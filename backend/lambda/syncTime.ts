import {httpsFetch} from '../utils/fetchUtils';
import {getSqlPool} from '../utils/dbUtils';
import {purgeQueues, sendQueueMessage} from '../utils/queueUtils';
import {getCurrentDate} from '../utils/timeUtils';
import assert from 'node:assert';

export const handler = async () => {
    const response = await httpsFetch({
        method: 'GET',
        host: 'api.zeus.projects.bbdgrad.com',
        path: '/start-time'
    });

    if (response.statusCode !== 200) {
        console.log(response);
        return;
    }

    const startDate = response.body.start_date;
    const latestStartTime = new Date(`${startDate}Z`).getTime();

    const sql = await getSqlPool();

    const getTimeQuery = 'SELECT starttime FROM time';
    const queryRes = await sql.query(getTimeQuery);

    if (queryRes.rowCount && queryRes.rowCount > 0) {
        const currentStartTime = Number(queryRes.rows[0]['starttime']);

        if (currentStartTime !== latestStartTime) {
            console.log('Start time has changed. Resetting simulation');
            const {
                'CHARGE_HEALTH_INSURANCE_QUEUE_URL': chargeHealthInsuranceQueue,
                'PAY_INCOME_TAX_QUEUE_URL': payIncomeTaxQueue,
                'PAY_VAT_QUEUE_URL': payVatQueue,
                'BUY_SHARES_QUEUE_URL': buySharesQueue,
                'PAY_DIVIDENDS_QUEUE_URL': payDividendsQueue,
                'GET_TAX_NUMBER_QUEUE_URL': getTaxNumberQueue,
                'PAY_REV_SERVICE_QUEUE_URL': payRevServiceQueue,
                'SUB_NOTICE_OF_PAYMENT_TO_REV_QUEUE_URL': subNoticeOfPaymentToRevQueue,
                'SELL_SHARES_QUEUE_URL': sellSharesQueue,
                'REGISTER_ON_STOCKMARKET_QUEUE_URL': registerOnStockMarketQueue,
                'PAY_USER_DIVIDENDS_QUEUE_URL': payUserDividendsQueue,
                'PAY_BUSINESS_DIVIDENDS_QUEUE_URL': payBusinessDividendsQueue,
                'BUY_BUSINESS_SHARES_QUEUE_URL': buyBusinessSharesQueue,
                'DISCHARGE_PATIENT_QUEUE_URL': dischargePatientQueue,
                'CHECK_PATIENT_DIED_QUEUE_URL': checkPatientDiedQueue
            } = process.env;

            const queueUrls = [
                chargeHealthInsuranceQueue!,
                payIncomeTaxQueue!,
                payVatQueue!,
                buySharesQueue!,
                payDividendsQueue!,
                getTaxNumberQueue!,
                payRevServiceQueue!,
                subNoticeOfPaymentToRevQueue!,
                sellSharesQueue!,
                registerOnStockMarketQueue!,
                payUserDividendsQueue!,
                payBusinessDividendsQueue!,
                buyBusinessSharesQueue!,
                dischargePatientQueue!,
                checkPatientDiedQueue!
            ];

            await purgeQueues(queueUrls);

            const query = 'CALL reset_simulation($1)';
            const queryRes = await sql.query(query, [latestStartTime]);
            console.log('Start time has been updated to: ' + latestStartTime);

            const date = await getCurrentDate();

            //Get a tax number at the start of the simulation

            const TaxNumberQueueUrl = process.env.GET_TAX_NUMBER_QUEUE_URL;
            assert(TaxNumberQueueUrl, 'GET_TAX_NUMBER_QUEUE_URL not set');

            await sendQueueMessage(TaxNumberQueueUrl, date);
            //Register business on stock exchange at the start of the simulation

            const RegisterOnStockMarketQueueUrl = process.env.REGISTER_ON_STOCKMARKET_QUEUE_URL;
            assert(RegisterOnStockMarketQueueUrl, 'REGISTER_ON_STOCKMARKET_QUEUE_URL not set');

            await sql.end();
            await sendQueueMessage(RegisterOnStockMarketQueueUrl, date);
        }
    }

};
