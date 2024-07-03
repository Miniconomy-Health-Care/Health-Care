import {SQSHandler} from 'aws-lambda';
import {getSqlPool} from '../utils/dbUtils';
import {getCurrentDate} from '../utils/timeUtils';
import {httpsFetch} from '../utils/fetchUtils';
import {sendQueueMessage} from '../utils/queueUtils';
import assert from 'node:assert';

export const handler: SQSHandler = async (sqsEvent) => {
    console.log(sqsEvent);

    const date = await getCurrentDate();
    const pool = await getSqlPool();

    //Get our tax number
    const taxNumberQuery = 'select * from TaxNumber;';
    const taxNumberQueryRes = await pool.query(taxNumberQuery);
    const taxNumber = taxNumberQueryRes.rows[0].tax_id;

    const monthlyCostsQuery = 'SELECT CalculateMonthlyCosts($1, $2)';
    const monthlyCostsQueryRes = await pool.query(monthlyCostsQuery, [date.month, date.year]);
    const monthlyCost = monthlyCostsQueryRes.rows[0].calculatemonthlycosts;


    //get amount of VAT due from revenue service
    const requestBody = {
        "taxId": taxNumber,
        "taxType": "VAT",
        "amount": monthlyCost
    };

    const response = await httpsFetch({
        method: 'POST',
        host: 'api.mers.projects.bbdgrad.com',
        path: '/api/taxpayment/createTaxInvoice'
    }, requestBody);

    if (response.statusCode !== 200) {
        throw new Error('Failed to get VAT invoice from revenue service');
    }

    const paymentId = response.body.paymentId;
    const amountDue = response.body.amountDue;
    const taxType = "VAT";

    const queueUrl = process.env.PAY_REV_SERVICE_QUEUE_URL;
    assert(queueUrl, 'PAY_REV_SERVICE_QUEUE_URL was not set');

    await sendQueueMessage(queueUrl, {paymentId, amountDue, taxType, date, taxNumber});
};