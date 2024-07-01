import {type APIGatewayProxyHandler} from 'aws-lambda';
import {getSqlPool} from '../utils/dbUtils';
import {sendQueueMessage} from '../utils/queueUtils';
import assert from 'node:assert';
import {getCurrentDate} from '../utils/timeUtils';

export const handler: APIGatewayProxyHandler = async (event, context) => {

    const personaId = JSON.parse(event.body!)['personaId'];
    const pool = await getSqlPool();
    const date = (await getCurrentDate()).str;

    const query = 'CALL add_patient_record($1, $2)';
    const result = await pool.query(query, [personaId, date]);

    const queueUrl = process.env.CHARGE_HEALTH_INSURANCE_QUEUE_URL;
    assert(queueUrl, 'CHARGE_HEALTH_INSURANCE_QUEUE_URL was not set');

    const getPatientRecordQuery = 'SELECT treatmentCost, recordId FROM PatientRecordView WHERE personaId=$1 ORDER BY recordid DESC LIMIT 1';
    const res = await pool.query(getPatientRecordQuery, [personaId]);
    const record = res.rows[0];

    await sendQueueMessage(queueUrl, {personaId, cost: record['treatmentCost'], identifier: record['recordId']});

    return {
        statusCode: 200,
        body: ''
    };

};
