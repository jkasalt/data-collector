// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use dotenv::dotenv;
use serde::{Deserialize, Serialize, Serializer};
use sqlx::SqlitePool;
use std::env;
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
        dotenv()?;
        let db = SqlitePool::connect(&env::var("DATABASE_URL")?).await?;
        Ok(Self { db })
    }
}

#[derive(Serialize, Deserialize, sqlx::FromRow)]
struct Patient {
    id: i64,
    name: String,
    age: i64,
}

#[derive(Deserialize)]
struct NewPatient {
    name: String,
    age: i64,
}

#[derive(Serialize)]
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
async fn save(handle: AppHandle, NewPatient { name, age }: NewPatient) -> DataCollectorResult<()> {
    let AppState { db } = handle.state::<AppState>().inner();
    sqlx::query!("INSERT INTO patient (name, age) VALUES (?, ?)", name, age)
        .execute(db)
        .await?;
    Ok(())
}

#[tauri::command]
async fn update(handle: AppHandle, patient: Patient) -> DataCollectorResult<()> {
    let AppState { db } = handle.state::<AppState>().inner();
    sqlx::query!(
        "UPDATE patient SET name = ?, age = ? WHERE id = ?",
        patient.name,
        patient.age,
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
async fn get_patient(handle: AppHandle, id: i64) -> DataCollectorResult<Patient> {
    let AppState { db } = handle.state::<AppState>().inner();
    let patient = sqlx::query_as!(Patient, "SELECT * FROM patient WHERE id = ?", id)
        .fetch_one(db)
        .await?;
    Ok(patient)
}

#[tokio::main]
async fn main() {
    tauri::Builder::default()
        .manage(AppState::init().await.unwrap())
        .invoke_handler(tauri::generate_handler![save, names, update, get_patient])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
