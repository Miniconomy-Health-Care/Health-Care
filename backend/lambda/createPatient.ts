import {type APIGatewayProxyHandler} from 'aws-lambda';

export const handler: APIGatewayProxyHandler = async (event, context) => {
    return {
        statusCode: 200,
        body: event.body || 'Empty Body'
    };
}
