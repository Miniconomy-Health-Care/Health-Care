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

        //Get a tax number at the start of the simulation

        const date = await getCurrentDate();

        const {
            GET_TAX_NUMBER_QUEUE_URL: getTaxNumberQueue
        } = process.env;

        assert(getTaxNumberQueue, 'GET_TAX_NUMBER_QUEUE_URL not set');

        await sendQueueMessage(getTaxNumberQueue, date);

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
