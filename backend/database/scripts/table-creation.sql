DROP TABLE IF EXISTS record;
DROP TABLE IF EXISTS tax;
DROP TABLE IF EXISTS taxtype;
DROP TABLE IF EXISTS treatment;
DROP TABLE IF EXISTS persona;

CREATE TABLE Persona (
    personaId BIGINT PRIMARY KEY,
    isAdmitted BOOLEAN
);

CREATE TABLE Treatment (
    treatmentId SERIAL PRIMARY KEY,
    name CHARACTER VARYING(50),
    cost NUMERIC,
    problem CHARACTER VARYING(50)
);

CREATE TABLE Record (
    recordId SERIAL PRIMARY KEY,
    personaId BIGINT,
    date CHARACTER VARYING(8),
    treatmentId INTEGER
);

CREATE TABLE Taxtype (
    taxTypeId SERIAL PRIMARY KEY,
    name CHARACTER VARYING(50)
);

CREATE TABLE Tax (
    taxId SERIAL PRIMARY KEY,
    taxTypeId INTEGER,
    month CHARACTER VARYING(2),
    year CHARACTER VARYING(2),
    amount NUMERIC
);

CREATE TABLE Time
(
    timeId    SERIAL PRIMARY KEY,
    startTime BIGINT
);

ALTER TABLE Record
ADD CONSTRAINT fk_personaId
FOREIGN KEY (personaId)
REFERENCES Persona (personaId);

ALTER TABLE Record
ADD CONSTRAINT fk_treatmentId
FOREIGN KEY (treatmentId)
REFERENCES Treatment (treatmentId);

ALTER TABLE Tax
ADD CONSTRAINT fk_taxTypeId
FOREIGN KEY (taxTypeId)
REFERENCES TaxType (taxTypeId);
