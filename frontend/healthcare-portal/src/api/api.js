import Cookies from 'js-cookie';

const baseUrl = "https://ppvyzz29a7.execute-api.eu-west-1.amazonaws.com/prod/api";
const token = Cookies.get('jwt');


export function getPersonaRecords() {
    return fetch(`${baseUrl}/patient/record`, {
        method: 'GET',
        headers: {'Content-Type': 'application/json', 'Authorization': token}
    })
}

export function getTaxRecords() {
    return fetch(`${baseUrl}/tax/record`, {
        method: 'GET',
        headers: {'Content-Type': 'application/json', 'Authorization': token}
    })
}

export function getBankBalance() {
    return fetch(`${baseUrl}/bank/balance`, {
        method: 'GET',
        headers: {'Content-Type': 'application/json', 'Authorization': token}
    })
}

export function getBankTransactions() {
    return fetch(`${baseUrl}/bank/transactions`, {
        method: 'GET',
        headers: {'Content-Type': 'application/json', 'Authorization': token}
    })
}
