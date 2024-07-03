import {APIGatewayProxyHandler} from 'aws-lambda';
import {getSqlPool} from '../utils/dbUtils';
import assert from 'node:assert';
import {purgeQueues, sendQueueMessage} from '../utils/queueUtils';
import {getCurrentDate} from '../utils/timeUtils';

const Actions = {
    reset: 'reset',
    start: 'start'
} as const;

export const handler: APIGatewayProxyHandler = async (event) => {
    console.log(event);
    const body = JSON.parse(event.body!);
    const action = body.action;
    if (action === Actions.start) {

        try {
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

            const startTime = body.startTime;
            const millis = new Date(`${startTime}Z`).getTime();
            const sql = await getSqlPool();
            const query = 'CALL reset_simulation($1)';
            const queryRes = await sql.query(query, [millis]);

            const date = await getCurrentDate();

            //Get a tax number at the start of the simulation

            const TaxNumberQueueUrl = process.env.GET_TAX_NUMBER_QUEUE_URL;
            assert(TaxNumberQueueUrl, 'GET_TAX_NUMBER_QUEUE_URL not set');

            await sendQueueMessage(TaxNumberQueueUrl, date);
            //Register business on stock exchange at the start of the simulation

            const RegisterOnStockMarketQueueUrl = process.env.REGISTER_ON_STOCKMARKET_QUEUE_URL;
            assert(RegisterOnStockMarketQueueUrl, 'REGISTER_ON_STOCKMARKET_QUEUE_URL not set');

            await sendQueueMessage(RegisterOnStockMarketQueueUrl, date);
        } catch (e) {
            console.error(e);
        }
    }

    return {
        statusCode: 200,
        body: ''
    };
};
