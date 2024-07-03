import {APIGatewayProxyHandler} from 'aws-lambda';
import {getSqlPool} from '../utils/dbUtils';
import assert from 'node:assert';
import {sendQueueMessage} from '../utils/queueUtils';
import {getCurrentDate} from '../utils/timeUtils';

const Actions = {
    reset: 'reset',
    start: 'start'
} as const;

export const handler: APIGatewayProxyHandler = async (event) => {
    const body = JSON.parse(event.body!);
    const action = body.action;
    if (action === Actions.start) {

        const date = await getCurrentDate();

        //Get a tax number at the start of the simulation

        const TaxNumberQueueUrl = process.env.GET_TAX_NUMBER_QUEUE_URL;
        assert(TaxNumberQueueUrl, 'GET_TAX_NUMBER_QUEUE_URL not set');

        await sendQueueMessage(TaxNumberQueueUrl, date);

        //Register business on stock exchange at the start of the simulation

        const RegisterOnStockMarketQueueUrl = process.env.REGISTER_ON_STOCKMARKET_QUEUE_URL;
        assert(RegisterOnStockMarketQueueUrl, 'REGISTER_ON_STOCKMARKET_QUEUE_URL not set');

        await sendQueueMessage(RegisterOnStockMarketQueueUrl, date);

        try {
            const startTime = body.startTime;
            const millis = new Date(`${startTime}Z`).getTime();
            const sql = await getSqlPool();
            const query = 'CALL reset_simulation($1)';
            const queryRes = await sql.query(query, [millis]);
        } catch (e) {
            console.error(e);
        }
    }

    return {
        statusCode: 200,
        body: ''
    };
};
