-- Add up migration script here
-- treatment
ALTER TABLE patient ADD COLUMN treatment_duration INTEGER NOT NULL;
ALTER TABLE patient ADD COLUMN treatment_type TEXT NOT NULL;
ALTER TABLE patient ADD COLUMN prescription_service TEXT NOT NULL;
--demography
ALTER TABLE patient ADD COLUMN weight REAL NOT NULL;
ALTER TABLE patient ADD COLUMN height REAL  NOT NULL;
ALTER TABLE patient ADD COLUMN cranial_perimeter REAL NOT NULL;
ALTER TABLE patient ADD COLUMN had_evaluation_nutri_state INTEGER CHECK(had_evaluation_nutri_state IN (0,1)) NOT NULL;
ALTER TABLE patient ADD COLUMN z_score REAL NOT NULL;
