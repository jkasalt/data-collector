-- Add up migration script here
UPDATE patient SET treatment_type = json_object('type', treatment_type);

UPDATE patient
SET treatment_type = json_set(treatment_type, '$.content', NULL)
WHERE json_extract(treatment_type, '$.type') = 'Standardized';
