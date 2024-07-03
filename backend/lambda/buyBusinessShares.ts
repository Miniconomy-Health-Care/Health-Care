import {SQSHandler} from 'aws-lambda';
import {httpsFetch} from '../utils/fetchUtils';

export const handler: SQSHandler = async (sqsEvent) => {
    console.log(sqsEvent);

    const body = sqsEvent.Records[0].body;
    const {business} = JSON.parse(body);

    const requestBody = {
        "buyerId": "healthcare",
        "businessId": business.id,
        "quantity": 1
    };

    const response = await httpsFetch({
        method: 'POST',
        host: 'api.mese.projects.bbdgrad.com',
        path: '/stocks/buy'
    }, requestBody);

    if (response.statusCode !== 200) {
        throw new Error('Failed to pruchase shares from the stockmarket');
    }

    purchaseShares(business, response.body.referenceId, response.body.amountToPay)

};

const purchaseShares = async (business: any, referenceId:any, amountToPay:any) => {

    const requestBody = {
        "transactions": [
          {
            "debitAccountName": "health-care",
            "creditAccountName": referenceId,
            "amount": amountToPay,
            "debitRef": `Stock purchase of ${business.id}`,
            "creditRef": "Stock purchase by healthcare"
          }
        ]
    };

    const response = await httpsFetch({
        method: 'POST',
        host: 'api.commercialbank.projects.bbdgrad.com',
        path: '/transactions/create'
    }, requestBody);

    if (response.statusCode !== 200) {
        throw new Error('Transaction for stock purchase to commercial bank failed');
    }
}