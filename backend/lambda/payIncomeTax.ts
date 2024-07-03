import {SQSHandler} from 'aws-lambda';
import {getSqlPool} from '../utils/dbUtils';
import {getCurrentDate} from '../utils/timeUtils';
import {httpsFetch} from '../utils/fetchUtils';
import {sendQueueMessage} from '../utils/queueUtils';
import assert from 'node:assert';

export const handler: SQSHandler = async (sqsEvent) => {
    console.log(sqsEvent);

    const body = sqsEvent.Records[0].body;
    const {date} = JSON.parse(body);
    const pool = await getSqlPool();

    //Get our tax number
    const taxNumberQuery = 'select * from TaxNumber;';
    const taxNumberQueryRes = await pool.query(taxNumberQuery);
    const taxNumber = taxNumberQueryRes.rows[0].tax_id;

    const yearlyCostsQuery = 'SELECT CalculateYearlyCosts($1)';
    const yearlyCostsQueryRes = await pool.query(yearlyCostsQuery, [date.year]);
    const yearlyCost = yearlyCostsQueryRes.rows[0].calculateyearlycosts;


    //get amount of income tax due from revenue service
    const requestBody = {
        "taxId": taxNumber,
        "taxType": "INCOME",
        "amount": yearlyCost
    };

    const response = await httpsFetch({
        method: 'POST',
        host: 'api.mers.projects.bbdgrad.com',
        path: '/api/taxpayment/createTaxInvoice'
    }, requestBody);

    if (response.statusCode !== 200) {
        throw new Error('Failed to get income tax invoice from revenue service');
    }

    const paymentId = response.body.paymentId;
    const amountDue = response.body.amountDue;
    const taxType = "Income";

    const queueUrl = process.env.PAY_REV_SERVICE_QUEUE_URL;
    assert(queueUrl, 'PAY_REV_SERVICE_QUEUE_URL was not set');

    await sendQueueMessage(queueUrl, {paymentId, amountDue, taxType, date});
};
