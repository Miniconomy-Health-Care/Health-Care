import { APIGatewayProxyHandler } from 'aws-lambda';
import {httpsFetch} from '../utils/fetchUtils';

export const handler: APIGatewayProxyHandler = async (event, context) => {
    try {
        const response = await httpsFetch({
            method: 'GET',
            host: 'api.commercialbank.projects.bbdgrad.com',
            path: '/transactions'
        });

        if (response.statusCode !== 200) {
            console.error('Failed to request commercial bank:', response.body);
            return {
                statusCode: response.statusCode as number,
                body: JSON.stringify(response.body)
            };
        }

        console.log('Successfully retrieved transaction history');
        return {
            statusCode: 200,
            body: JSON.stringify(response.body)
        };
    } catch (error) {
        console.error('Error:', error);
        let errorMessage = 'Unknown error occurred';
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        return {
            statusCode: 500,
            body: JSON.stringify({ error: errorMessage })
        };
    }
};