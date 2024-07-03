import {APIGatewayProxyHandler} from 'aws-lambda';
import {getSqlPool} from '../utils/dbUtils';

const Actions = {
    reset: 'reset',
    start: 'start'
} as const;

export const handler: APIGatewayProxyHandler = async (event) => {
    const body = JSON.parse(event.body!);
    const action = body.action;
    if (action === Actions.start) {
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
