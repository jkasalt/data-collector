// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use anyhow::Context;
use dotenv::dotenv;
use serde::{Deserialize, Serialize, Serializer};
use sqlx::{
    prelude::{FromRow, Type},
    types::Json,
    SqlitePool,
};
use std::{env, path::PathBuf};
use tauri::{AppHandle, Manager, RunEvent};

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
    rt: tokio::runtime::Handle,
}

impl AppState {
    async fn init() -> anyhow::Result<Self> {
        let db_path = db_path().expect("Db path should be set");

        std::fs::create_dir_all(db_path.parent().unwrap()).context("when initializing the app")?;

        let db = SqlitePool::connect(&db_path.to_string_lossy())
            .await
            .context("when connecting to database")?;
        let rt = tokio::runtime::Handle::current();
        sqlx::migrate!("./migrations").run(&db).await?;

        Ok(Self { db, rt })
    }

    fn close(&self) {
        tokio::task::block_in_place(|| {
            self.rt.block_on(self.db.close());
        });
    }
}

impl Drop for AppState {
    fn drop(&mut self) {
        self.close();
    }
}

#[cfg(debug_assertions)]
fn db_path() -> anyhow::Result<PathBuf> {
    dotenv()?;
    Ok(PathBuf::from(env::var("DATABASE_URL")?))
}

#[cfg(not(debug_assertions))]
fn db_path() -> anyhow::Result<PathBuf> {
    {
        let (config, _) =
            tauri::utils::config::parse(".").context("When parsing the tauri config")?;
        tauri::api::path::app_data_dir(&config)
            .map(|mut path| {
                path.push("data-collector");
                path.push("db.sqlite");
                path
            })
            .ok_or_else(|| anyhow::anyhow!("Could not find app data dir"))
    }
}

#[derive(Serialize, Deserialize, FromRow)]
struct DbPatient {
    id: i64,
    #[sqlx(flatten)]
    #[serde(flatten)]
    inner: Patient,
}

#[derive(Debug, Serialize, Deserialize, PartialEq)]
#[serde(tag = "type", content = "content")]
enum TreatmentType {
    TailorMade,
    Standardized(StandardizedTreatmentType),
}

#[derive(Debug, Serialize, Deserialize, PartialEq)]
enum StandardizedTreatmentType {
    Periolimel1500,
    Aminomix,
    SmofKabiven986,
    SmofKabiven1477,
    NutriflexNeoperi,
    NutriflexOmegaSpecial,
    Omegaflex625,
    Omegaflex1250,
    Omegaflex1875,
}

#[derive(Debug, Serialize, Deserialize, Type, PartialEq)]
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

#[derive(Debug, Serialize, Deserialize, PartialEq)]
enum CardiacDiagnostic {
    Cyanogenic,
    Other,
}

#[derive(Debug, Serialize, Deserialize, PartialEq)]
enum SncDiagnostic {
    Malformative,
    Acquired,
    Trauma,
}

#[derive(Debug, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "PascalCase")]
#[serde(tag = "t", content = "c")]
enum Diagnostic {
    ChromosomicSyndrome(String),
    Respiratory(bool),
    Cardiac(CardiacDiagnostic),
    Snc(SncDiagnostic),
    Urologic,
    MetabolicIllness,
    Digestive(String),
    Premature(String),
    Other(String),
}

#[derive(Debug, Deserialize, Serialize, FromRow, PartialEq)]
#[serde(rename_all = "camelCase")]
struct Patient {
    prescription_year: i64,
    treatment_duration: i64,
    treatment_type: Json<TreatmentType>,
    prescription_service: PrescriptionService,
    nombre_de_prescriptions: i32,
    diagnostic: Json<Diagnostic>,

    name: String,
    age: f64,
    sex: String,
    weight: f64,
    height: f64,
    cranial_perimeter: f64,
    had_evaluation_nutri_state: bool,
    z_score_weight: f64,
    z_score_height: f64,
    z_score_pc: f64,
}

#[derive(Serialize, sqlx::FromRow)]
struct PatientName {
    id: i64,
    name: String,
}

impl PatientName {
    const fn new(id: i64, name: String) -> Self {
        Self { id, name }
    }
}

#[tauri::command]
async fn save(handle: AppHandle, patient: Patient) -> DataCollectorResult<()> {
    let AppState { db, .. } = handle.state::<AppState>().inner();
    let bmi = 10.0 * patient.weight / patient.height.powi(2);
    sqlx::query!(
        "INSERT INTO patient (
            prescription_year,
            treatment_duration,
            treatment_type,
            prescription_service,
            nombre_de_prescriptions,
            diagnostic,

            name,
            age,
            sex,
            weight,
            height,
            bmi,
            cranial_perimeter,
            had_evaluation_nutri_state,
            z_score_weight,
            z_score_height,
            z_score_pc
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        patient.prescription_year,
        patient.treatment_duration,
        patient.treatment_type,
        patient.prescription_service,
        patient.nombre_de_prescriptions,
        patient.diagnostic,
        patient.name,
        patient.age,
        patient.sex,
        patient.weight,
        patient.height,
        bmi,
        patient.cranial_perimeter,
        patient.had_evaluation_nutri_state,
        patient.z_score_weight,
        patient.z_score_height,
        patient.z_score_pc,
    )
    .execute(db)
    .await?;
    Ok(())
}

#[tauri::command]
async fn update(handle: AppHandle, patient: DbPatient) -> DataCollectorResult<()> {
    let AppState { db, .. } = handle.state::<AppState>().inner();
    let bmi = 10.0 * patient.inner.weight / patient.inner.height.powi(2);
    sqlx::query!(
        "UPDATE patient SET 
            prescription_year = ?,
            treatment_duration = ?,
            treatment_type = ?,
            prescription_service = ?,
            nombre_de_prescriptions = ?,
            diagnostic = ?,

            name = ?,
            age = ?,
            sex = ?,
            weight = ?,
            height = ?,
            bmi = ?,
            cranial_perimeter = ?,
            had_evaluation_nutri_state = ?,
            z_score_weight = ?,
            z_score_height = ?,
            z_score_pc = ?
        WHERE id = ?",
        patient.inner.prescription_year,
        patient.inner.treatment_duration,
        patient.inner.treatment_type,
        patient.inner.prescription_service,
        patient.inner.nombre_de_prescriptions,
        patient.inner.diagnostic,
        patient.inner.name,
        patient.inner.age,
        patient.inner.sex,
        patient.inner.weight,
        patient.inner.height,
        bmi,
        patient.inner.cranial_perimeter,
        patient.inner.had_evaluation_nutri_state,
        patient.inner.z_score_weight,
        patient.inner.z_score_height,
        patient.inner.z_score_pc,
        patient.id,
    )
    .execute(db)
    .await?;
    Ok(())
}

#[tauri::command]
async fn names(handle: AppHandle) -> DataCollectorResult<Vec<PatientName>> {
    let AppState { db, .. } = handle.state::<AppState>().inner();
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
    let AppState { db, .. } = handle.state::<AppState>().inner();
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
    let AppState { db, .. } = handle.state::<AppState>().inner();
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
    let AppState { db, .. } = handle.state::<AppState>().inner();
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
    let app = tauri::Builder::default()
        .manage(AppState::init().await.unwrap())
        .invoke_handler(tauri::generate_handler![
            save,
            names,
            update,
            get_patient,
            prescription_years,
            get_by_prescription_year
        ])
        .build(tauri::generate_context!())
        .expect("error while building tauri application");

    app.run(|app_handle, event| {
        if let RunEvent::ExitRequested { .. } = event {
            app_handle.state::<AppState>().close();
            std::process::exit(0)
        }
    });
}

#[cfg(test)]
mod test {
    use super::*;

    #[test]
    fn patient_deserialize_works() {
        let input = r#"{"id":null,"name":"","age":0,"prescriptionYear":0,"treatmentDuration":0,"treatmentType":{"type":"Standardized","content":"SmofKabiven986"},"prescriptionService":"Chph","nombreDePrescriptions":1,"weight":0,"height":0,"cranialPerimeter":0,"hadEvaluationNutriState":false,"diagnostic":{"t":"Digestive","c":""},"zScoreWeight":0,"zScoreHeight":0,"zScorePc":0,"sex":"m"}"#;
        let expected = Patient {
            name: String::new(),
            age: 0.0,
            prescription_year: 0,
            treatment_duration: 0,
            treatment_type: Json(TreatmentType::Standardized(
                StandardizedTreatmentType::SmofKabiven986,
            )),
            prescription_service: PrescriptionService::Chph,
            nombre_de_prescriptions: 1,
            weight: 0.0,
            height: 0.0,
            cranial_perimeter: 0.0,
            had_evaluation_nutri_state: false,
            diagnostic: Json(Diagnostic::Digestive(String::new())),
            z_score_weight: 0.0,
            z_score_height: 0.0,
            z_score_pc: 0.0,
            sex: "m".to_string(),
        };

        assert_eq!(serde_json::from_str::<Patient>(input).unwrap(), expected);
    }
}
