import {SQSHandler} from 'aws-lambda';
import {httpsFetch} from '../utils/fetchUtils';
import assert from 'node:assert';
import {sendQueueMessage} from '../utils/queueUtils';

export const handler: SQSHandler = async (event) => {
    console.log(event);

    const currentBankBalance = await getBankBalance();
    const balanceForShares = currentBankBalance*0.10;

    const businessMarketValues = await httpsFetch({
        method: 'GET',
        host: 'api.mese.projects.bbdgrad.com',
        path: '/businesses'
    });

    if (businessMarketValues.statusCode !== 200) {
        throw new Error('Failed to get market value of businesses from Stock Market');
    }
    
    const BUY_BUSINESS_SHARES_QUEUE_URL = process.env.BUY_BUSINESS_SHARES_QUEUE_URL;
    assert(BUY_BUSINESS_SHARES_QUEUE_URL, 'BUY_BUSINESS_SHARES_QUEUE_URL was not set');

    let totalPurchasePrice = 0;

    for(let i=0; i<10; i++){
        let randomIndex = Math.floor(Math.random() * businessMarketValues.body.length);
        if((businessMarketValues.body[randomIndex].currentMarketValue + totalPurchasePrice) < balanceForShares){
            totalPurchasePrice += businessMarketValues.body[randomIndex].currentMarketValue;
            await sendQueueMessage(BUY_BUSINESS_SHARES_QUEUE_URL, businessMarketValues.body[randomIndex]);
        }
    }


};

const getBankBalance = async() => {

    const response = await httpsFetch({
        method: 'GET',
        host: 'api.commercialbank.projects.bbdgrad.com',
        path: '/account/balance'
    });

    if (response.statusCode !== 200) {
        throw new Error('Failed to get account balance from commercial bank');
    }

    return response.body.status.accountBalance;
}
