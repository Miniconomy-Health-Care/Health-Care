import { APIGatewayProxyHandler } from 'aws-lambda';
import {httpsFetch} from '../utils/fetchUtils';

export const handler: APIGatewayProxyHandler = async (event, context) => {
    try {
        const response = await httpsFetch({
            method: 'GET',
            host: 'api.commercialbank.projects.bbdgrad.com',
            path: '/'
        });

        if (response.statusCode !== 200) {
            throw new Error('Failed to request commercial bank');
        }

        console.log('Successfully retrieved account balance');
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
            body: JSON.stringify({ error: "Something is wrong" })
        };
    }
};