import {SQSHandler} from 'aws-lambda';
import {getSqlPool} from '../utils/dbUtils';
import {httpsFetch} from '../utils/fetchUtils';
import assert from 'node:assert';
import {sendQueueMessage} from '../utils/queueUtils';

export const handler: SQSHandler = async (sqsEvent) => {
    console.log(sqsEvent);

    const body = sqsEvent.Records[0].body;
    let {paymentId, amountDue, taxType, date, taxNumber} = JSON.parse(body);
    date = JSON.parse(date);

    //pay tax to revenue service
    const requestBody = {
        'transactions': [
            {
                'debitAccountName': 'health-care',
                'creditAccountName': 'central-revenue-service',
                'amount': amountDue,
                'debitRef': `${taxType} tax payment`,
                'creditRef': paymentId
            }
        ]
    };

    const response = await httpsFetch({
        method: 'POST',
        host: 'api.commercialbank.projects.bbdgrad.com',
        path: '/transactions/create'
    }, requestBody);

    if (response.statusCode !== 200) {
        throw new Error('Failed to pay revenue service');
    }

    //store tax record after payment
    const pool = await getSqlPool();
    const query = 'CALL AddTaxRecord($1, $2, $3, $4)';
    const queryResult = await pool.query(query, [taxType, date.month, date.year, amountDue]);

    const queueUrl = process.env.SUB_NOTICE_OF_PAYMENT_TO_REV_QUEUE_URL;
    assert(queueUrl, 'SUB_NOTICE_OF_PAYMENT_TO_REV_QUEUE_URL was not set');

    await pool.end();
    await sendQueueMessage(queueUrl, {taxNumber, paymentId});

};
