DROP PROCEDURE IF EXISTS AddTaxRecord;

CREATE OR REPLACE PROCEDURE AddTaxRecord(
   	tax_name VARCHAR,
    input_month CHAR(2),
    input_year CHAR(2),
    amount NUMERIC
)
LANGUAGE plpgsql
AS $$
DECLARE
    tax_type_id INTEGER;
BEGIN
    SELECT taxTypeId
    INTO tax_type_id
    FROM Taxtype
    WHERE name = tax_name;

    IF tax_type_id IS NOT NULL THEN
        INSERT INTO Tax (taxTypeId, month, year, amount)
        VALUES (tax_type_id, input_month, input_year, amount);
    ELSE
        RAISE EXCEPTION 'Tax type "%" not found.', tax_name;
    END IF;
END;
$$;