import {type APIGatewayProxyHandler} from 'aws-lambda';

export const handler: APIGatewayProxyHandler = async (event, context) => {

    //This function should send a message to the SQS Queue 'chargeHealthInsuranceQueue'
    return {
        statusCode: 200,
        body: event.body || 'Empty Body'
    };
}
