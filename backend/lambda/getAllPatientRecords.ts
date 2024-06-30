import { APIGatewayProxyHandler } from 'aws-lambda';
import {getSqlPool} from '../utils/dbUtils';

export const handler: APIGatewayProxyHandler = async (event, context) => {
    const pool = await getSqlPool();
    try {
        const result = await pool.query('SELECT * FROM patientrecordview');
        const records = result.rows;
        return {
            statusCode: 200,
            body: JSON.stringify(records),
            headers: {
                'Content-Type': 'application/json',
            },
        };
    } catch (error) {
        console.error('Error fetching records:', error);

        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error fetching records', error }),
            headers: {
                'Content-Type': 'application/json',
            },
        };
    } finally {
        await pool.end();
    }
};