import {type APIGatewayProxyHandler} from 'aws-lambda';
import { getSqlPool } from '../utils/dbUtils';

export const handler: APIGatewayProxyHandler = async (event, context) => {

    const pool = await getSqlPool();
    const patientId = event.pathParameters?.personaId;

    if (!patientId) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Missing patient ID' }),
            headers: {
                'Content-Type': 'application/json',
            },
        };
    }

    try {
        const query = 'SELECT * FROM patientrecordview WHERE personaId = $1';
        const result = await pool.query(query, [patientId]);
        const records = result.rows;

        if (records.length === 0) {
            return {
                statusCode: 404,
                body: JSON.stringify({ message: 'No records found for the given patient ID' }),
                headers: {
                    'Content-Type': 'application/json',
                },
            };
        }

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
}
