CREATE OR REPLACE FUNCTION add_patient_record(new_personalId BIGINT, new_date TEXT)
RETURNS VOID AS $$
DECLARE
    treatment_count INTEGER;
    random_treatmentId INTEGER;
BEGIN
    INSERT INTO Persona (personalId, isAdmitted) VALUES (new_personalId, true);

    SELECT COUNT(*) INTO treatment_count FROM Treatment;

    SELECT treatmentId INTO random_treatmentId
    FROM Treatment
    OFFSET floor(random() * treatment_count)::INTEGER
    LIMIT 1;

    INSERT INTO Record (personalId, date, treatmentId) 
    VALUES (new_personalId, new_date, random_treatmentId);
END;
$$ LANGUAGE plpgsql;