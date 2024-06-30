CREATE VIEW TaxRecordView AS
SELECT
    Tax.taxId,
    TaxType.name,
    Tax.month,
    Tax.year,
    Tax.amount
FROM
    Tax
INNER JOIN
    TaxType ON Tax.taxTypeId = TaxType.taxTypeId;