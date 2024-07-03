import {SQSHandler} from 'aws-lambda';
import {httpsFetch} from '../utils/fetchUtils';
import assert from 'node:assert';
import {sendQueueMessage} from '../utils/queueUtils';
import {getSqlPool} from '../utils/dbUtils';

export const handler: SQSHandler = async (sqsEvent) => {
    console.log(sqsEvent);

    const body = sqsEvent.Records[0].body;
    const {date} = JSON.parse(body);
    const pool = await getSqlPool();

    //get details of healthcare shareholders
    const response = await httpsFetch({
        method: 'GET',
        host: 'api.mese.projects.bbdgrad.com',
        path: '/businesses/healthcare'
    });

    if (response.statusCode !== 200) {
        throw new Error('Failed to get healthcare shareholders');
    }

    const yearlyCostsQuery = 'SELECT CalculateYearlyCosts($1)';
    const yearlyCostsQueryRes = await pool.query(yearlyCostsQuery, [date.year - 1]);
    const yearlyCost = yearlyCostsQueryRes.rows[0].calculateyearlycosts;

    type shareholderType = { holderId: string; holderType: string; quantity: number; bankAccount: string; };

    const UserDivQueueUrl = process.env.PAY_USER_DIVIDENDS_QUEUE_URL;
    assert(UserDivQueueUrl, 'PAY_USER_DIVIDENDS_QUEUE_URL was not set');

    const BusinessDivQueueUrl = process.env.PAY_BUSINESS_DIVIDENDS_QUEUE_URL;
    assert(BusinessDivQueueUrl, 'PAY_BUSINESS_DIVIDENDS_QUEUE_URL was not set');

    response.body.forEach(async (shareholder: shareholderType) => {

        if(shareholder.holderType === "user"){
            await sendQueueMessage(UserDivQueueUrl, {shareholder, yearlyCost});
        }
        else if(shareholder.holderType === "business"){
            await sendQueueMessage(BusinessDivQueueUrl, {shareholder, yearlyCost});
        }

    });

};
