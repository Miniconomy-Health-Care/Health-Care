import {Pool, PoolConfig} from 'pg';
import {GetSecretValueCommand, SecretsManagerClient} from '@aws-sdk/client-secrets-manager';

const secretManagerClient = new SecretsManagerClient();
export const getSqlPool = async () => {
    const secretResponse = await secretManagerClient.send(
        new GetSecretValueCommand({
            SecretId: process.env.DB_SECRET,
        }));

    let secretData = '';

    if (secretResponse.SecretString) {
        secretData = secretResponse.SecretString;
    }

    const {
        username: DB_USER,
        host: DB_HOST,
        port: DB_PORT,
        password: DB_PASS,
        dbname: DB_NAME
    } = JSON.parse(secretData);

    const config: PoolConfig = {
        user: DB_USER,
        host: DB_HOST,
        database: DB_NAME,
        password: DB_PASS,
        port: DB_PORT,
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
        ssl: {rejectUnauthorized: false}
    };

    return new Pool(config);
};
