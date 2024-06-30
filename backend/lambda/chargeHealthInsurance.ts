import {SQSHandler} from 'aws-lambda';
import {httpsFetch} from '../utils/fetchUtils';

export const handler: SQSHandler = async (sqsEvent, c) => {
    //this function should get an SQSEvent which will contain the details needed to attempt charging health insurance
    console.log(sqsEvent);
    const body = sqsEvent.Records[0].body;
    const {cost, personaId} = JSON.parse(body);

    //send request to health insurance
    const requestBody = {
        'personaID': personaId,
        'claimAmount': cost
    };

    console.log('Sending request to health insurance');

    const response = await httpsFetch({
        method: 'POST',
        host: 'api.health.projects.bbdgrad.com',
        path: '/pay-claim'
    }, requestBody);

    if (response.statusCode !== 200) {
        throw new Error('Failed to request health insurance');
    }

    if (response.statusCode === 200) {
        console.log('Successfully charged health insurance');
    }

};
