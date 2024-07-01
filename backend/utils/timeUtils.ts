import {getSqlPool} from './dbUtils';

export type customDate = {
    day: number,
    month: number,
    year: number,
    str: string //miniconomy date format string
}

export const getCurrentDate = async (): Promise<customDate> => {
    const pool = await getSqlPool();
    const query = 'SELECT startTime FROM time ORDER BY timeId DESC LIMIT 1'
    const result = await pool.query(query);
    console.log(result)
    const startTime = result.rows[0]['starttime'];
    
    const timeElapsed = Date.now()  - startTime;
    const daysElapsed = Math.floor(timeElapsed/1000/60/2);
    
    const day = daysElapsed % 30 === 0 ? 30 : daysElapsed % 30;
    const month = Math.floor(daysElapsed / 30 % 12) + 1;
    const year = Math.floor(daysElapsed / 360) + 1;
    const dayStr = String(day).padStart(2, '0');
    const monthStr = String(month).padStart(2, '0');
    const yearStr = String(year).padStart(2, '0');
    
    return {day, month, year, str: `${dayStr}|${monthStr}|${yearStr}`}
}
