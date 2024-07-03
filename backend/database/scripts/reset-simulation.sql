CREATE OR REPLACE PROCEDURE reset_simulation(start_time BIGINT) 
    LANGUAGE plpgsql
AS
$$
BEGIN
   TRUNCATE TABLE persona, record, tax, time, taxnumber RESTART IDENTITY;
   INSERT INTO time(starttime) VALUES (start_time);
END;
$$;
