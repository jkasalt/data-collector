-- Add down migration script here
UPDATE patient SET treatment_type = json_extract(treatment_type, '$.type');
