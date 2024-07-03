import {SQSHandler} from 'aws-lambda';
import {sendQueueMessage} from '../utils/queueUtils';
import assert from 'node:assert';

export const handler: SQSHandler = async (event) => {
    const body = JSON.parse(event.Records[0].body);

    const queueUrl = process.env.DISCHARGE_PATIENT_QUEUE_URL;
    assert(queueUrl, 'DISCHARGE_PATIENT_QUEUE_URL not set');

    const {personaId} = body;

    const response = await fetch('https://api.zeus.projects.bbdgrad.com/sick-death', {method: 'POST', body: JSON.stringify({'personaId': personaId})});
    console.log('Response from zeus');
    console.log(response);
    if (response.status !== 200) {
        throw new Error('Error calling zeus');
    }

    await sendQueueMessage(queueUrl, body);

}; 
