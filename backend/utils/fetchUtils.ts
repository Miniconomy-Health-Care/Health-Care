import * as https from 'https';
import {SecretsManagerClient} from '@aws-sdk/client-secrets-manager';

type Response = {
    body: Record<string, any>,
    statusCode: number | undefined
}

const secretManagerClient = new SecretsManagerClient();

export const httpsFetch = async (options: https.RequestOptions, requestBody?: Record<string, any>): Promise<Response> => {

    // const certSecretResponse = await secretManagerClient.send(
    //     new GetSecretValueCommand({
    //         SecretId: process.env.CERT_SECRET,
    //     }));
    //
    // const keySecretResponse = await secretManagerClient.send(
    //     new GetSecretValueCommand({
    //         SecretId: process.env.KEY_SECRET,
    //     }));
    //
    // const certificate = certSecretResponse.SecretString ?? '';
    // const privateKey = keySecretResponse.SecretString ?? '';

    const opts: https.RequestOptions = {
        ...options,
        headers: {...options.headers, 'X-Origin': 'health_care', 'Content-Type': 'application/json'},
        port: 443,
        // cert: certificate,
        // key: privateKey
    };
    console.log('http call options');
    console.log(opts);
    return new Promise((resolve, reject) => {
        const req = https.request(opts, (res) => {
            res.setEncoding('utf8');
            let responseBody = '';

            res.on('data', (chunk) => {
                responseBody += chunk;
            });

            res.on('end', () => {
                console.log('Response body: ' + responseBody);
                resolve({
                    body: responseBody.length > 0 ? JSON.parse(responseBody) : {},
                    statusCode: res.statusCode
                });
            });
        });

        req.on('error', (err) => {
            reject(err);
        });

        if (requestBody) {
            req.write(JSON.stringify(requestBody));
        }

        req.end();
    });
};
