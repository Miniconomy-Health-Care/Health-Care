CREATE VIEW PatientRecordView AS
SELECT
    p.personalId,
    p.isAdmitted,
    r.date,
    t.name AS treatmentName,
	t.problem,
    t.cost AS treatmentCost
FROM
    Persona p
JOIN
    Record r ON p.personalId = r.personalId
JOIN
    Treatment t ON r.treatmentId = t.treatmentId;