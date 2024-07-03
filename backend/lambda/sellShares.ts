import {SQSHandler} from 'aws-lambda';
import {httpsFetch} from '../utils/fetchUtils';

export const handler: SQSHandler = async (sqsEvent) => {
    console.log(sqsEvent);

    //sell 49% of our 100,000 shares at the start of the simulation
    const requestBody = {
        "sellerId": "healthcare",
        "companyId": "healthcare",
        "quantity": 49000
    };

    const response = await httpsFetch({
        method: 'POST',
        host: 'api.mese.projects.bbdgrad.com',
        path: '/stocks/sell'
    }, requestBody);

    if (response.statusCode !== 200) {
        throw new Error('Failed to sell 49% of shares');
    }

};
