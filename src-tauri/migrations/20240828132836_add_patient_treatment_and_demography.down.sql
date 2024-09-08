-- Add down migration script here
CREATE TABLE tmp AS SELECT id, name, age, prescription_year FROM patient;
DROP TABLE patient;
ALTER TABLE tmp RENAME TO patient;
