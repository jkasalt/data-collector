-- Add up migration script here
-- change age to float
CREATE TABLE tmp (
	id INTEGER PRIMARY KEY AUTOINCREMENT,   
	name TEXT NOT NULL,
	age REAL NOT NULL, -- change age to REAL
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
	nombre_de_prescriptions INTEGER NOT NULL DEFAULT 1
);

INSERT INTO tmp SELECT * FROM patient;
DROP TABLE patient;
ALTER TABLE tmp RENAME TO patient;

-- add some columns
ALTER TABLE patient ADD COLUMN bmi REAL NOT NULL DEFAULT 0;
ALTER TABLE patient ADD COLUMN sex TEXT CHECK(sex in ('m', 'f')) NOT NULL DEFAULT 'm';

-- add z-score columns
ALTER TABLE patient RENAME COLUMN z_score TO z_score_weight;
ALTER TABLE patient ADD COLUMN z_score_height REAL NOT NULL DEFAULT 0;
ALTER TABLE patient ADD COLUMN z_score_pc REAL NOT NULL DEFAULT 0;
