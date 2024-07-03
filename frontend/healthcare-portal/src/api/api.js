import Cookies from 'js-cookie';

const baseUrl = "https://ppvyzz29a7.execute-api.eu-west-1.amazonaws.com/prod/api";
const token = Cookies.get('jwt');


// export const getPersonaRecords() = async () => {
//     try {
//         const response = await axios.get(
//           "https://api.sustenance.projects.bbdgrad.com/api/PersonaRecords"
//         );
//         return response.data;
//     }
//     catch(error){
//         throw error;
//     }
// // return fetch(`${baseUrl}/patient/record`, {method: 'GET', headers: {'Content-Type': 'application/json', 'Authorization':token }})
// }