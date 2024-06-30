DROP FUNCTION IF EXISTS CalculateMonthlyCosts;

CREATE FUNCTION CalculateMonthlyCosts(input_month CHAR(2))
RETURNS NUMERIC(20, 10)
LANGUAGE plpgsql
AS $$
DECLARE
    total_cost NUMERIC(20, 10) := 0;
BEGIN
    SELECT COALESCE(SUM(treatmentCost), 0)
    INTO total_cost
    FROM PatientRecordView
    WHERE SUBSTRING(date, 4, 2) = input_month
      AND isAdmitted = TRUE;

    RETURN total_cost;
END;
$$;