import { APIGatewayProxyHandler } from 'aws-lambda';
import axios from 'axios';

export const handler: APIGatewayProxyHandler = async (event, context) => {
    try {
        const response = await axios.get('http://api.commercialbank.projects.bbdgrad.com/account/balance');

        if (response.status !== 200) {
            throw new Error('Failed to request commercial bank');
        }

        console.log('Successfully retrieved account balance');
        return {
            statusCode: 200,
            body: JSON.stringify(response.data)
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