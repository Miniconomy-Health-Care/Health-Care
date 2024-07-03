import {SQSHandler} from 'aws-lambda';
import {getSqlPool} from '../utils/dbUtils';
import {httpsFetch} from '../utils/fetchUtils';

export const handler: SQSHandler = async (sqsEvent) => {
    console.log(sqsEvent);

    //send request for tax number to revenue service
    const requestBody = {
        "businessName": "HEALTHCARE"
    };

    const response = await httpsFetch({
        method: 'POST',
        host: 'api.mers.projects.bbdgrad.com',
        path: '/api/taxpayer/business/register'
    }, requestBody);

    if (response.statusCode !== 200) {
        throw new Error('Failed to request tax number');
    }

    const taxNumber = response.body.taxId;

    const pool = await getSqlPool();
    const query = 'INSERT INTO TaxNumber (tax_id) VALUES ($1);';
    const queryRes = await pool.query(query, [taxNumber]);
};