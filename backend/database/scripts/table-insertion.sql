TRUNCATE TABLE Treatment RESTART IDENTITY;

INSERT INTO Treatment (name, problem, cost) VALUES
('Surgery', 'Injury', 800),
('Doctor Visit', 'Sickness', 400),
('Medication', 'Prescription', 200);

TRUNCATE TABLE Taxtype RESTART IDENTITY;

INSERT INTO Taxtype (name) VALUES ('VAT');
INSERT INTO Taxtype (name) VALUES ('Income');
INSERT INTO Taxtype (name) VALUES ('Stock');