import {SQSHandler} from 'aws-lambda';
import {httpsFetch} from '../utils/fetchUtils';

export const handler: SQSHandler = async (sqsEvent) => {
    console.log(sqsEvent);

    const body = sqsEvent.Records[0].body;
    let {taxNumber, paymentId} = JSON.parse(body);

    //submit notice of payment to revenue service
    //we need to check the callback url
    const requestBody = {
        "taxId": taxNumber,
        "paymentId": paymentId,
        "callbackURL": "string"
    };

    const response = await httpsFetch({
        method: 'POST',
        host: 'api.mers.projects.bbdgrad.com',
        path: '/api/taxpayment/submitNoticeOfPayment'
    }, requestBody);

    if (response.statusCode !== 200) {
        throw new Error('Failed to notify revenue service of payment');
    }
    

}