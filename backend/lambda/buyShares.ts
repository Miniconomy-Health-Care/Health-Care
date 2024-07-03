import {SQSHandler} from 'aws-lambda';
import {httpsFetch} from '../utils/fetchUtils';

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

    businessMarketValues.body.length = 


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
