import {httpsFetch} from '../utils/fetchUtils';
import {getSqlPool} from '../utils/dbUtils';

export const handler = async () => {
  const response = await httpsFetch({
    method: 'GET',
    host: 'api.zeus.projects.bbdgrad.com', 
    path: '/start-time'
  });
  
  if(response.statusCode === 200){
    const startDate = response.body.start_date;
    const millis = new Date(`${startDate}Z`).getTime()
    const sql = await getSqlPool();
    const query = 'UPDATE time set startTime=$1';
    const queryRes = await sql.query(query, [millis]);
  }else{
    console.log(response);
  }
};
