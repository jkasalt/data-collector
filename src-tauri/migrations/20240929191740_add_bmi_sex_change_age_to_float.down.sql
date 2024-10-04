-- Add down migration script here
CREATE TABLE tmp (
	id INTEGER PRIMARY KEY AUTOINCREMENT,   
	name TEXT NOT NULL,
	age INTEGER NOT NULL, -- change age back to INTEGER
	prescription_year INTEGER NOT NULL,
	treatment_duration INTEGER NOT NULL,
	treatment_type TEXT NOT NULL,
	prescription_service TEXT NOT NULL,
	weight REAL NOT NULL,
	height REAL  NOT NULL,
	cranial_perimeter REAL NOT NULL,
	had_evaluation_nutri_state INTEGER CHECK(had_evaluation_nutri_state IN (0,1)) NOT NULL,
	z_score REAL NOT NULL,
	diagnostic TEXT,
	nombre_de_prescriptions INTEGER NOT NULL,
);

INSERT INTO tmp (
	id,
	name,
	age,
	prescription_year,
	treatment_duration,
	treatment_type,
	prescription_service,
	weight,
	height,
	cranial_perimeter,
	had_evaluation_nutri_state,
	z_score,
	diagnostic,
	nombre_de_prescriptions
) SELECT 
	id,
	name,
	ROUND(age),
	prescription_year,
	treatment_duration,
	treatment_type,
	prescription_service,
	weight,
	height,
	cranial_perimeter,
	had_evaluation_nutri_state,
	z_score,
	diagnostic,
	nombre_de_prescriptions
FROM patient;

DROP TABLE patient;
ALTER TABLE tmp RENAME TO patient;
