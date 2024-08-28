-- Add up migration script here
ALTER TABLE patient ADD COLUMN prescription_year INTEGER NOT NULL;
