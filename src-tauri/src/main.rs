// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use anyhow::Context;
use dotenv::dotenv;
use serde::{Deserialize, Serialize, Serializer};
use sqlx::{
    prelude::{FromRow, Type},
    SqlitePool,
};
use std::{env, path::PathBuf};
use tauri::{AppHandle, Manager};

#[derive(thiserror::Error, Debug, Serialize)]
#[non_exhaustive]
enum DataCollectorError {
    #[error("database error")]
    #[serde(serialize_with = "serialize_sqlx_error")]
    DbError(#[from] sqlx::Error),
}

fn serialize_sqlx_error<S>(err: &sqlx::Error, serializer: S) -> Result<S::Ok, S::Error>
where
    S: Serializer,
{
    serializer.serialize_str(&err.to_string())
}

type DataCollectorResult<T> = Result<T, DataCollectorError>;

struct AppState {
    db: SqlitePool,
}

impl AppState {
    async fn init() -> anyhow::Result<Self> {
        let db_path = db_path().expect("Db path should be set");

        std::fs::create_dir_all(db_path.parent().unwrap()).context("when initializing the app")?;

        let db = SqlitePool::connect(&db_path.to_string_lossy()).await?;

        sqlx::migrate!("./migrations").run(&db).await?;

        Ok(Self { db })
    }
}

fn db_path() -> Option<PathBuf> {
    #[cfg(debug_assertions)]
    {
        dotenv().ok()?;
        Some(PathBuf::from(env::var("DATABASE_URL").ok()?))
    }
    #[cfg(not(debug_assertions))]
    {
        let config = tauri::utils::config::parse(".");
        tauri::api::path::app_data_dir(&config).map(|mut path| {
            path.push("data-collector");
            path.push("db.sqlite")
        })
    }
}

#[derive(Serialize, Deserialize, FromRow)]
struct DbPatient {
    id: i64,
    #[sqlx(flatten)]
    #[serde(flatten)]
    inner: Patient,
}

#[derive(Serialize, Deserialize, Type)]
enum TreatmentType {
    TailorMade,
    Standardized,
}

#[derive(Serialize, Deserialize, Type)]
enum PrescriptionService {
    Chph,
    Der1,
    Enfc,
    Hadp,
    Hel,
    Nath,
    Pedh,
    Ponh,
    Sipi,
}

#[derive(Deserialize, Serialize, FromRow)]
#[serde(rename_all = "camelCase")]
struct Patient {
    prescription_year: i64,
    treatment_duration: i64,
    treatment_type: TreatmentType,
    prescription_service: PrescriptionService,

    name: String,
    age: i64,
    weight: f64,
    height: f64,
    cranial_perimeter: f64,
    had_evaluation_nutri_state: bool,
    z_score: f64,
}

#[derive(Serialize, sqlx::FromRow)]
struct PatientName {
    id: i64,
    name: String,
}

impl PatientName {
    fn new(id: i64, name: String) -> Self {
        Self { id, name }
    }
}

#[tauri::command]
async fn save(handle: AppHandle, patient: Patient) -> DataCollectorResult<()> {
    let AppState { db } = handle.state::<AppState>().inner();
    sqlx::query!(
        "INSERT INTO patient (
            prescription_year,
            treatment_duration,
            treatment_type,
            prescription_service,

            name,
            age,
            weight,
            height,
            cranial_perimeter,
            had_evaluation_nutri_state,
            z_score
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        patient.prescription_year,
        patient.treatment_duration,
        patient.treatment_type,
        patient.prescription_service,
        patient.name,
        patient.age,
        patient.weight,
        patient.height,
        patient.cranial_perimeter,
        patient.had_evaluation_nutri_state,
        patient.z_score,
    )
    .execute(db)
    .await?;
    Ok(())
}

#[tauri::command]
async fn update(handle: AppHandle, patient: DbPatient) -> DataCollectorResult<()> {
    let AppState { db } = handle.state::<AppState>().inner();
    sqlx::query!(
        "UPDATE patient SET name = ?, age = ? WHERE id = ?",
        patient.inner.name,
        patient.inner.age,
        patient.id
    )
    .execute(db)
    .await?;
    Ok(())
}

#[tauri::command]
async fn names(handle: AppHandle) -> DataCollectorResult<Vec<PatientName>> {
    let AppState { db } = handle.state::<AppState>().inner();
    let names = sqlx::query!("SELECT id, name FROM patient LIMIT 10000")
        .fetch_all(db)
        .await?
        .into_iter()
        .map(|row| PatientName::new(row.id, row.name))
        .collect();
    Ok(names)
}

#[tauri::command]
async fn prescription_years(handle: AppHandle) -> DataCollectorResult<Vec<i64>> {
    let AppState { db } = handle.state::<AppState>().inner();
    let prescription_years =
        sqlx::query!("SELECT DISTINCT prescription_year FROM patient LIMIT 10000")
            .fetch_all(db)
            .await?
            .into_iter()
            .map(|row| row.prescription_year)
            .collect();

    Ok(prescription_years)
}

#[tauri::command]
async fn get_patient(handle: AppHandle, id: i64) -> DataCollectorResult<DbPatient> {
    let AppState { db } = handle.state::<AppState>().inner();
    let patient = sqlx::query_as("SELECT * FROM patient WHERE id = ?")
        .bind(id)
        .fetch_one(db)
        .await?;
    Ok(patient)
}

#[tauri::command]
async fn get_by_prescription_year(
    handle: AppHandle,
    prescription_year: i64,
) -> DataCollectorResult<Vec<PatientName>> {
    let AppState { db } = handle.state::<AppState>().inner();
    let patient_names = sqlx::query_as!(
        PatientName,
        "SELECT id, name FROM patient WHERE prescription_year = ?",
        prescription_year
    )
    .fetch_all(db)
    .await?;

    Ok(patient_names)
}

#[tokio::main]
async fn main() {
    tauri::Builder::default()
        .manage(AppState::init().await.unwrap())
        .invoke_handler(tauri::generate_handler![
            save,
            names,
            update,
            get_patient,
            prescription_years,
            get_by_prescription_year
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
