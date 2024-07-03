import {getCurrentDate} from '../utils/timeUtils';
import {sendQueueMessage} from '../utils/queueUtils';
import assert from 'node:assert';

export const handler = async () => {
    const date = await getCurrentDate();
    console.log(`The current date is ${date.str}`);

    if (date.day !== 1) {
        console.log('Not 1st day of the month, exiting');
    } else {
        const {
            PAY_INCOME_TAX_QUEUE_URL: incomeTaxQueue,
            PAY_VAT_QUEUE_URL: vatQueue,
            BUY_SHARES_QUEUE_URL: buySharesQueue,
            PAY_DIVIDENDS_QUEUE_URL: payDividendsQueue,
        } = process.env;

        assert(incomeTaxQueue, 'PAY_INCOME_TAX_QUEUE_URL not set');
        assert(vatQueue, 'PAY_VAT_QUEUE_URL not set');
        assert(buySharesQueue, 'BUY_SHARES_QUEUE_URL not set');
        assert(payDividendsQueue, 'PAY_DIVIDENDS_QUEUE_URL not set');

        await sendQueueMessage(vatQueue, date);
        await sendQueueMessage(buySharesQueue, date);

        if (date.month === 1) {
            await sendQueueMessage(payDividendsQueue, date);
            await sendQueueMessage(incomeTaxQueue, date);
        }
    }
};
