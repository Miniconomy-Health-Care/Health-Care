import {SQSHandler} from 'aws-lambda';
import {httpsFetch} from '../utils/fetchUtils';
import assert from 'node:assert';
import {sendQueueMessage} from '../utils/queueUtils';

export const handler: SQSHandler = async (sqsEvent) => {
    console.log(sqsEvent);

    //get details of healthcare shareholders
    const response = await httpsFetch({
        method: 'GET',
        host: 'api.mese.projects.bbdgrad.com',
        path: '/businesses/healthcare'
    });

    if (response.statusCode !== 200) {
        throw new Error('Failed to get healthcare shareholders');
    }

    //get the market value of healthcare
    const healthcareMarketValue = await getHealthcareMarketValue();

    if(healthcareMarketValue === 0){
        throw new Error('Failed to get market value for healthcare');
    }

    type shareholderType = { holderId: string; holderType: string; quantity: number; bankAccount: string; };

    const UserDivQueueUrl = process.env.PAY_USER_DIVIDENDS_QUEUE_URL;
    assert(UserDivQueueUrl, 'PAY_USER_DIVIDENDS_QUEUE_URL was not set');

    const BusinessDivQueueUrl = process.env.PAY_BUSINESS_DIVIDENDS_QUEUE_URL;
    assert(BusinessDivQueueUrl, 'PAY_BUSINESS_DIVIDENDS_QUEUE_URL was not set');

    response.body.forEach(async (shareholder: shareholderType) => {

        if(shareholder.holderType === "user"){
            await sendQueueMessage(UserDivQueueUrl, {shareholder, healthcareMarketValue});
        }
        else if(shareholder.holderType === "business"){
            await sendQueueMessage(BusinessDivQueueUrl, {shareholder, healthcareMarketValue});
        }

    });

};


const getHealthcareMarketValue = async () =>{

    const businessMarketValues = await httpsFetch({
        method: 'GET',
        host: 'api.mese.projects.bbdgrad.com',
        path: '/businesses'
    });

    if (businessMarketValues.statusCode !== 200) {
        throw new Error('Failed to get market value of businesses from Stock Market');
    }

    type businessType = {id: string; name: string; currentMarketValue: number;};

    businessMarketValues.body.forEach(async (business: businessType) => {
        if(business.name === "healthcare"){
            return business.currentMarketValue
        }
    });

    return 0;
}
