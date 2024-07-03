import {SQSHandler} from 'aws-lambda';
import { customDate } from '../utils/timeUtils';
import {getSqlPool} from '../utils/dbUtils';

export const handler: SQSHandler = async (sqsEvent) => {
    console.log(sqsEvent);
    console.log("Pay Income Tax Event Start");

    const pool = await getSqlPool();

    let date :customDate = sqsEvent.Records[0].body;

    const query = 'CALL add_patient_record($1, $2)';
    const result = await pool.query(query, [personaId, date]);
};
