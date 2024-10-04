-- Add up migration script here
ALTER TABLE patient ADD COLUMN nombre_de_prescriptions INTEGER NOT NULL DEFAULT 1;
