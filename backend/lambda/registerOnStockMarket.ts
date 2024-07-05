import {SQSHandler} from 'aws-lambda';
import {httpsFetch} from '../utils/fetchUtils';
import assert from 'node:assert';
import {sendQueueMessage} from '../utils/queueUtils';

export const handler: SQSHandler = async (sqsEvent) => {
    console.log(sqsEvent);

    //send request to register our business on the stock market
    const requestBody = {
        "name" :"healthcare",
        "bankAccount": "health-care"
    };

    const response = await httpsFetch({
        method: 'POST',
        host: 'api.mese.projects.bbdgrad.com',
        path: '/businesses?callbackUrl=string',
    }, requestBody);

    if (response.statusCode !== 200) {
        throw new Error('Failed to register business on stock market');
    }

    const queueUrl = process.env.SELL_SHARES_QUEUE_URL;
    assert(queueUrl, 'SELL_SHARES_QUEUE_URL was not set');

    await sendQueueMessage(queueUrl, {});

}
