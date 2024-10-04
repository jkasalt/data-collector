-- Add down migration script here
CREATE TABLE tmp AS SELECT 
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
		diagnostic
	FROM patient;
DROP TABLE patient;
ALTER TABLE tmp RENAME TO patient;
