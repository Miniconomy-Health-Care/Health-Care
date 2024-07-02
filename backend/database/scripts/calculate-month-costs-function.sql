DROP FUNCTION IF EXISTS CalculateMonthlyCosts;

CREATE FUNCTION CalculateMonthlyCosts(input_month CHAR(2), input_year CHAR(2))
RETURNS BIGINT
LANGUAGE plpgsql
AS $$
DECLARE
    total_cost BIGINT := 0;
BEGIN
    SELECT COALESCE(SUM(treatmentCost), 0)
    INTO total_cost
    FROM PatientRecordView
    WHERE SUBSTRING(date, 1, 2) = input_year
      AND SUBSTRING(date, 4, 2) = input_month;

    RETURN total_cost;
END;
$$;
