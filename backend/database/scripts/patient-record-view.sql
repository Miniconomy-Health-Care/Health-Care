CREATE VIEW PatientRecordView AS
SELECT
    p.personaId,
    p.isAdmitted,
    r.date,
    t.name AS treatmentName,
	t.problem,
    t.cost AS treatmentCost
FROM
    Persona p
JOIN
    Record r ON p.personaId = r.personaId
JOIN
    Treatment t ON r.treatmentId = t.treatmentId;