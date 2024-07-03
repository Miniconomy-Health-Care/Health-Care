import {type APIGatewayProxyHandler} from 'aws-lambda';
import {getSqlPool} from '../utils/dbUtils';
import {Cors} from 'aws-cdk-lib/aws-apigateway';

export const handler: APIGatewayProxyHandler = async (event, context) => {
    const pool = await getSqlPool();
    try {
        const result = await pool.query('SELECT * FROM taxrecordview');
        const records = result.rows;
        return {
            statusCode: 200,
            body: JSON.stringify(records),
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Headers': Cors.DEFAULT_HEADERS.join(','),
                'Access-Control-Allow-Origin': Cors.ALL_ORIGINS.join(','),
                'Access-Control-Allow-Methods': Cors.ALL_METHODS.join(','),
                'Vary': 'Origin'
            },
        };
    } catch (error) {
        console.error('Error fetching records:', error);

        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error fetching records', error }),
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Headers': Cors.DEFAULT_HEADERS.join(','),
                'Access-Control-Allow-Origin': Cors.ALL_ORIGINS.join(','),
                'Access-Control-Allow-Methods': Cors.ALL_METHODS.join(','),
                'Vary': 'Origin'
            },
        };
    } finally {
        await pool.end();
    }
}
