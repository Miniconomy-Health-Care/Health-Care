import {SQSHandler} from 'aws-lambda';
import {httpsFetch} from '../utils/fetchUtils';

export const handler: SQSHandler = async (sqsEvent) => {
    console.log(sqsEvent);

    const body = sqsEvent.Records[0].body;
    const {shareholder, healthcareMarketValue} = JSON.parse(body);

    const totalAmountDue = Math.floor(shareholder.quantity * healthcareMarketValue);

    //pay dividends to business shareholder
    const requestBody = {
        "transactions": [
          {
            "debitAccountName": "health-care",
            "creditAccountName": shareholder.bankAccount,
            "amount": totalAmountDue,
            "debitRef": `Dividends payment to ${shareholder.holderId}`,
            "creditRef": "Dividends payment from healthcare"
          }
        ]
    };

    const response = await httpsFetch({
        method: 'POST',
        host: 'api.commercialbank.projects.bbdgrad.com',
        path: '/transactions/create'
    }, requestBody);

    if (response.statusCode !== 200) {
        throw new Error('Failed to pay business share holder');
    }

};