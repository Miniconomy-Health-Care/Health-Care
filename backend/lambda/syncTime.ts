import {httpsFetch} from '../utils/fetchUtils';
import {getSqlPool} from '../utils/dbUtils';

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
      const query = 'CALL reset_simulation($1)';
      const queryRes = await sql.query(query, [latestStartTime]);
      console.log('Start time has been updated to: ' + latestStartTime);
    }
  }

};
