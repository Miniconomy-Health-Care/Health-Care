CREATE OR REPLACE PROCEDURE add_patient_record(new_personaId BIGINT, new_date TEXT)
LANGUAGE plpgsql
AS $$
DECLARE
    treatment_count INTEGER;
    random_treatmentId INTEGER;
BEGIN
    INSERT INTO Persona (personaId, isAdmitted) VALUES (new_personaId, true);

    SELECT COUNT(*) INTO treatment_count FROM Treatment;

    SELECT treatmentId INTO random_treatmentId
    FROM Treatment
    OFFSET floor(random() * treatment_count)::INTEGER
    LIMIT 1;

    INSERT INTO Record (personaId, date, treatmentId) 
    VALUES (new_personaId, new_date, random_treatmentId);
END;
$$;
