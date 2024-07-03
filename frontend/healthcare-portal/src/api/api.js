import Cookies from 'js-cookie';

const baseUrl = "https://ppvyzz29a7.execute-api.eu-west-1.amazonaws.com/prod/api";
const token = Cookies.get('jwt');


export function getPersonaRecords() {
return fetch(`${baseUrl}/patient/record`, {method: 'GET', headers: {'Content-Type': 'application/json', 'Authorization':token, 'Access-Control-Allow-Origin':'*' }})
}