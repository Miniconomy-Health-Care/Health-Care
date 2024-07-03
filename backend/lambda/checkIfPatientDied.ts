import {SQSHandler} from 'aws-lambda';
import {sendQueueMessage} from '../utils/queueUtils';
import assert from 'node:assert';
import {httpsFetch} from '../utils/fetchUtils';

const handler: SQSHandler = async (event) => {
    const body = JSON.parse(event.Records[0].body);
    const queueUrl = process.env.DISCHARGE_PATIENT_QUEUE_URL;
    assert(queueUrl, 'DISCHARGE_PATIENT_QUEUE_URL not set');

    const {personaId} = JSON.parse(body);
    const response = await httpsFetch({
        method: 'POST',
        host: 'api.zeus.projects.bbdgrad.com',
        path: '/sick-death'
    }, {personaId});

    if (response.statusCode !== 200) {
        throw new Error('Error calling zeus');
    }

    await sendQueueMessage(queueUrl, body);

}; 
