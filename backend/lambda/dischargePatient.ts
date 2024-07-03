import {SQSHandler} from 'aws-lambda';
import {getSqlPool} from '../utils/dbUtils';
import {sendQueueMessage} from '../utils/queueUtils';
import assert from 'node:assert';

const handler: SQSHandler = async (event) => {
    const body = JSON.parse(event.Records[0].body);
    const queueUrl = process.env.CHARGE_HEALTH_INSURANCE_QUEUE_URL;
    assert(queueUrl, "CHARGE_HEALTH_INSURANCE_QUEUE_URL not set");
    
    const { personaId } = JSON.parse(body);
    const pool = await getSqlPool();
    const dischargePatientQuery = 'UPDATE persona SET isAdmitted=false WHERE personaId=$1';
    const dischargeRes = await pool.query(dischargePatientQuery, [personaId])
    
    await sendQueueMessage(queueUrl, body);
    
} 
