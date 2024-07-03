import * as cdk from 'aws-cdk-lib';
import {aws_cognito, aws_ec2 as ec2, aws_iam as iam, aws_rds as rds, Duration} from 'aws-cdk-lib';
import {Construct} from 'constructs';
import {GitHubStackProps} from './githubStackProps';
import {
    AuthorizationType,
    CognitoUserPoolsAuthorizer,
    Cors,
    JsonSchemaType,
    LambdaIntegration,
    Model,
    RequestValidator,
    RestApi,
    SecurityPolicy
} from 'aws-cdk-lib/aws-apigateway';
import {Runtime} from 'aws-cdk-lib/aws-lambda';
import {HttpMethod} from 'aws-cdk-lib/aws-apigatewayv2';
import {Effect, PolicyDocument, PolicyStatement} from 'aws-cdk-lib/aws-iam';
import {NodejsFunction, NodejsFunctionProps} from 'aws-cdk-lib/aws-lambda-nodejs';
import * as path from 'path';
import {SqsEventSource} from 'aws-cdk-lib/aws-lambda-event-sources';
import {Queue} from 'aws-cdk-lib/aws-sqs';
import {Secret} from 'aws-cdk-lib/aws-secretsmanager';
import {Certificate} from 'aws-cdk-lib/aws-certificatemanager';
import {Rule, Schedule} from 'aws-cdk-lib/aws-events';
import {addLambdaPermission, LambdaFunction} from 'aws-cdk-lib/aws-events-targets';

export class BackendStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: GitHubStackProps) {
        super(scope, id, props);

        const appName = 'health-care';

        //VPC
        const vpc = new ec2.Vpc(this, `${appName}-vpc`, {
            maxAzs: 2,
            subnetConfiguration: [
                {
                    name: 'HealthCarePublicSubnet',
                    subnetType: ec2.SubnetType.PUBLIC,
                },
            ],
        });

        //Security Group
        const securityGrouup = new ec2.SecurityGroup(this, `${appName}-sg`, {
            vpc,
            allowAllOutbound: false,
        });

        securityGrouup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(5432));
        securityGrouup.addEgressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(5432));

        //Database
        const dbInstance = new rds.DatabaseInstance(this, `${appName}-db-instance`, {
            engine: rds.DatabaseInstanceEngine.postgres({
                version: rds.PostgresEngineVersion.VER_16_1,
            }),
            databaseName: 'HealthCareDb',
            instanceType: ec2.InstanceType.of(
                ec2.InstanceClass.T3,
                ec2.InstanceSize.MICRO
            ),
            vpc,
            vpcSubnets: {
                subnetType: ec2.SubnetType.PUBLIC,
            },
            allocatedStorage: 20,
            publiclyAccessible: true,
            deletionProtection: false,
            credentials: rds.Credentials.fromGeneratedSecret('postgres', {
                secretName: `${appName}-db-secret`,
            }),
            securityGroups: [securityGrouup],
        });

        //Secret

        const certSecret = new Secret(this, 'cert-secret', {
            secretName: 'cert-secret',
        });

        const keySecret = new Secret(this, 'key-secret', {
            secretName: 'key-secret'
        });

        //Github deploy role
        const githubDomain = 'token.actions.githubusercontent.com';

        const ghProvider = new iam.OpenIdConnectProvider(this, 'githubProvider', {
            url: `https://${githubDomain}`,
            clientIds: ['sts.amazonaws.com'],
        });

        const iamRepoDeployAccess = props?.repositoryConfig.map(
            (r) => `repo:${r.owner}/${r.repo}:*`
        );

        const conditions: iam.Conditions = {
            StringLike: {
                [`${githubDomain}:sub`]: iamRepoDeployAccess,
            },
        };

        const elbUpdatesPolicy = iam.ManagedPolicy.fromAwsManagedPolicyName('AWSElasticBeanstalkManagedUpdatesCustomerRolePolicy');
        const elbWebTierPolicy = iam.ManagedPolicy.fromAwsManagedPolicyName('AWSElasticBeanstalkWebTier');

        new iam.Role(this, `${appName}-deploy-role`, {
            assumedBy: new iam.WebIdentityPrincipal(
                ghProvider.openIdConnectProviderArn,
                conditions
            ),
            inlinePolicies: {
                'deployPolicy': new PolicyDocument({
                    statements: [
                        new PolicyStatement({
                            actions: ['sts:AssumeRole'],
                            effect: Effect.ALLOW,
                            resources: ['arn:aws:iam::*:role/cdk-*']
                        }),
                        new PolicyStatement({
                            actions: ['secretsmanager:GetSecretValue'],
                            effect: Effect.ALLOW,
                            resources: ['*']
                        })
                    ],
                }),
            },
            managedPolicies: [elbWebTierPolicy, elbUpdatesPolicy],
            roleName: 'HealthCareDeployRole',
            description:
                'This role is used via GitHub Actions to deploy with AWS CDK',
            maxSessionDuration: cdk.Duration.hours(1),
        });

        // QUEUES
        const chargeHealthInsuranceQueue = new Queue(this, 'charge-health-insurance', {
            queueName: 'charge-health-insurance.fifo',
            visibilityTimeout: Duration.minutes(15),
            contentBasedDeduplication: true,
        });

        const payIncomeTaxQueue = new Queue(this, 'pay-income-tax', {
            queueName: 'pay-income-tax.fifo',
            visibilityTimeout: Duration.minutes(5),
            contentBasedDeduplication: true,
        });
        const payVatQueue = new Queue(this, 'pay-vat', {
            queueName: 'pay-vat.fifo',
            visibilityTimeout: Duration.minutes(5),
            contentBasedDeduplication: true,
        });

        const buySharesQueue = new Queue(this, 'buy-shares', {
            queueName: 'buy-shares.fifo',
            visibilityTimeout: Duration.minutes(5),
            contentBasedDeduplication: true,
        });

        const payDividendsQueue = new Queue(this, 'pay-dividends', {
            queueName: 'pay-dividends.fifo',
            visibilityTimeout: Duration.minutes(5),
            contentBasedDeduplication: true,
        });

        const getTaxNumberQueue = new Queue(this, 'get-tax-number', {
            queueName: 'get-tax-number.fifo',
            visibilityTimeout: Duration.minutes(5),
            contentBasedDeduplication: true,
        });

        const payRevServiceQueue = new Queue(this, 'pay-rev-service', {
            queueName: 'pay-rev-service.fifo',
            visibilityTimeout: Duration.minutes(5),
            contentBasedDeduplication: true,
        });

        const subNoticeOfPaymentToRevQueue = new Queue(this, 'sub-notice-payment-rev', {
            queueName: 'sub-notice-payment-rev.fifo',
            visibilityTimeout: Duration.minutes(5),
            contentBasedDeduplication: true,
        });

        const sellSharesQueue = new Queue(this, 'sell-shares', {
            queueName: 'sell-shares.fifo',
            visibilityTimeout: Duration.minutes(5),
            contentBasedDeduplication: true,
        });

        const registerOnStockMarketQueue = new Queue(this, 'register-on-stockmarket', {
            queueName: 'register-on-stockmarket.fifo',
            visibilityTimeout: Duration.minutes(5),
            contentBasedDeduplication: true,
        });

        const payUserDividendsQueue = new Queue(this, 'pay-user-dividends', {
            queueName: 'pay-user-dividends.fifo',
            visibilityTimeout: Duration.minutes(5),
            contentBasedDeduplication: true,
        });

        const payBusinessDividendsQueue = new Queue(this, 'pay-business-dividends', {
            queueName: 'pay-business-dividends.fifo',
            visibilityTimeout: Duration.minutes(5),
            contentBasedDeduplication: true,
        });

        const buyBusinessSharesQueue = new Queue(this, 'buy-business-shares', {
            queueName: 'buy-business-shares.fifo',
            visibilityTimeout: Duration.minutes(5),
            contentBasedDeduplication: true,
        });

        const dischargePatientQueue = new Queue(this, 'discharge-patient', {
            queueName: 'discharge-patient.fifo',
            visibilityTimeout: Duration.minutes(5),
            contentBasedDeduplication: true,
        });

        const checkPatientDiedQueue = new Queue(this, 'check-patient-died', {
            queueName: 'check-patient-died.fifo',
            visibilityTimeout: Duration.minutes(5),
            contentBasedDeduplication: true,
        });

        //Lambdas
        const lambdaEnv = {
            'DB_SECRET': dbInstance.secret?.secretArn!,
            'CERT_SECRET': certSecret.secretArn,
            'KEY_SECRET': keySecret.secretArn,
            'CHARGE_HEALTH_INSURANCE_QUEUE_URL': chargeHealthInsuranceQueue.queueUrl,
            'PAY_INCOME_TAX_QUEUE_URL': payIncomeTaxQueue.queueUrl,
            'PAY_VAT_QUEUE_URL': payVatQueue.queueUrl,
            'BUY_SHARES_QUEUE_URL': buySharesQueue.queueUrl,
            'PAY_DIVIDENDS_QUEUE_URL': payDividendsQueue.queueUrl,
            'GET_TAX_NUMBER_QUEUE_URL': getTaxNumberQueue.queueUrl,
            'PAY_REV_SERVICE_QUEUE_URL': payRevServiceQueue.queueUrl,
            'SUB_NOTICE_OF_PAYMENT_TO_REV_QUEUE_URL': subNoticeOfPaymentToRevQueue.queueUrl,
            'SELL_SHARES_QUEUE_URL': sellSharesQueue.queueUrl,
            'REGISTER_ON_STOCKMARKET_QUEUE_URL': registerOnStockMarketQueue.queueUrl,
            'PAY_USER_DIVIDENDS_QUEUE_URL': payUserDividendsQueue.queueUrl,
            'PAY_BUSINESS_DIVIDENDS_QUEUE_URL': payBusinessDividendsQueue.queueUrl,
            'BUY_BUSINESS_SHARES_QUEUE_URL': buyBusinessSharesQueue.queueUrl,
            'DISCHARGE_PATIENT_QUEUE_URL': dischargePatientQueue.queueUrl,
            'CHECK_PATIENT_DIED_QUEUE_URL': checkPatientDiedQueue.queueUrl
        };

        const lambdaAppDir = path.resolve(__dirname, '../../lambda');

        const createLambda = (id: string, props: NodejsFunctionProps) => {
            const fn = new NodejsFunction(this, id, {
                runtime: Runtime.NODEJS_20_X,
                environment: lambdaEnv,
                bundling: {nodeModules: ['pg']},
                timeout: Duration.seconds(30),
                ...props
            });

            dbInstance.secret?.grantRead(fn);
            certSecret.grantRead(fn);
            keySecret.grantRead(fn);

            return fn;
        };

        const createPatientLambda = createLambda(`create-patient-lambda`, {
            entry: path.join(lambdaAppDir, 'createPatient.ts'),
            functionName: 'create-patient-lambda',
        });

        const getAllPatientRecordsLambda = createLambda(`get-all-patient-records-lambda`, {
            entry: path.join(lambdaAppDir, 'getAllPatientRecords.ts'),
            functionName: 'get-all-patient-records-lambda',
        });

        const getPatientRecordByIdLambda = createLambda(`get-patient-record-lambda`, {
            entry: path.join(lambdaAppDir, 'getPatientRecordById.ts'),
            functionName: 'get-patient-record-lambda',
        });

        const getAllTaxRecordsLambda = createLambda(`get-all-tax-records-lambda`, {
            entry: path.join(lambdaAppDir, 'getAllTaxRecords.ts'),
            functionName: 'get-all-tax-records-lambda',
        });

        const getBankBalanceLambda = createLambda(`get-bank-balance-lambda`, {
            entry: path.join(lambdaAppDir, 'getBankBalance.ts'),
            functionName: 'get-bank-balance-lambda',
        });

        const payIncomeTaxLambda = createLambda(`pay-income-tax-lambda`, {
            entry: path.join(lambdaAppDir, 'payIncomeTax.ts'),
            functionName: 'pay-income-tax-lambda',
        });

        const payVatLambda = createLambda(`pay-vat-lambda`, {
            entry: path.join(lambdaAppDir, 'payVat.ts'),
            functionName: 'pay-vat-lambda',
        });

        const payDividendsLambda = createLambda(`pay-dividends-lambda`, {
            entry: path.join(lambdaAppDir, 'payDividends.ts'),
            functionName: 'pay-dividends-lambda',
        });

        const sellSharesLambda = createLambda(`sell-shares-lambda`, {
            entry: path.join(lambdaAppDir, 'sellShares.ts'),
            functionName: 'sell-shares-lambda',
        });

        const buySharesLambda = createLambda(`buy-shares-lambda`, {
            entry: path.join(lambdaAppDir, 'buyShares.ts'),
            functionName: 'buy-shares-lambda',
        });

        const chargeHealthInsuranceLambda = createLambda(`charge-health-insurance-lambda`, {
            entry: path.join(lambdaAppDir, 'chargeHealthInsurance.ts'),
            functionName: 'charge-health-insurance-lambda',
        });

        const timeEventCoordinatorLambda = createLambda('time-event-coordinator-lambda', {
            entry: path.join(lambdaAppDir, 'timeEventCoordinator.ts'),
            functionName: 'time-event-coordinator-lambda',
        });

        const syncTimeLambda = createLambda('sync-time-lambda', {
            entry: path.join(lambdaAppDir, 'syncTime.ts'),
            functionName: 'sync-time-lambda',
        });

        const getTransactions = createLambda('get-transactions-lambda', {
            entry: path.join(lambdaAppDir, 'getTransactions.ts'),
            functionName: 'get-transactions-lambda',
        });


        const simulationEventsLambda = createLambda('simulation-events-lambda', {
            entry: path.join(lambdaAppDir, 'simulationEvents.ts'),
            functionName: 'simulation-events-lambda',
        });

        const getTaxNumberLamda = createLambda('get-tax-number-lambda', {
            entry: path.join(lambdaAppDir, 'getTaxNumber.ts'),
            functionName: 'get-tax-number-lambda',
        });

        const payRevServiceLamda = createLambda('pay-rev-service-lambda', {
            entry: path.join(lambdaAppDir, 'payRevService.ts'),
            functionName: 'pay-rev-service-lambda',
        });

        const subNoticeOfPaymentToRevLambda = createLambda('sub-notice-payment-rev-lambda', {
            entry: path.join(lambdaAppDir, 'subNoticeOfPaymentToRev.ts'),
            functionName: 'sub-notice-payment-rev-lambda',
        });

        const registerOnStockMarketLambda = createLambda('register-on-stockmarket-lambda', {
            entry: path.join(lambdaAppDir, 'registerOnStockMarket.ts'),
            functionName: 'register-on-stockmarket-lambda',
        });

        const payBusinessDividendsLambda = createLambda('pay-business-dividends-lambda', {
            entry: path.join(lambdaAppDir, 'payBusinessDividends.ts'),
            functionName: 'pay-business-dividends-lambda',
        });

        const payUserDividendsLambda = createLambda('pay-user-dividends-lambda', {
            entry: path.join(lambdaAppDir, 'payUserDividends.ts'),
            functionName: 'pay-user-dividends-lambda',
        });

        const buyBusinessSharesLambda = createLambda('buy-business-shares-lambda', {
            entry: path.join(lambdaAppDir, 'buyBusinessShares.ts'),
            functionName: 'buy-business-shares-lambda',
        });

        const dischargePatientLambda = createLambda('discharge-patient-lambda', {
            entry: path.join(lambdaAppDir, 'dischargePatient.ts'),
            functionName: 'discharge-patient-lambda',
        });

        const checkIfPatientDiedLambda = createLambda('check-patient-died-lambda', {
            entry: path.join(lambdaAppDir, 'checkIfPatientDied.ts'),
            functionName: 'check-patient-died-lambda',
        });


        //Event bridge rules
        const dailyRule = new Rule(this, 'daily-rule', {
            schedule: Schedule.rate(Duration.minutes(2))
        });
        addLambdaPermission(dailyRule, timeEventCoordinatorLambda);
        dailyRule.addTarget(new LambdaFunction(timeEventCoordinatorLambda));

        const syncTimeRule = new Rule(this, 'sync-time-rule', {
            schedule: Schedule.rate(Duration.minutes(30))
        });
        addLambdaPermission(syncTimeRule, syncTimeLambda);
        syncTimeRule.addTarget(new LambdaFunction(syncTimeLambda));

        // API
        const domainName = 'api.care.projects.bbdgrad.com';

        const api = new RestApi(this, `${appName}-api-gateway`, {
            deployOptions: {stageName: 'prod', tracingEnabled: true},
            restApiName: `${appName}-api`,
            domainName: {
                domainName: domainName,
                certificate: Certificate.fromCertificateArn(this, 'api-cert', 'arn:aws:acm:eu-west-1:363615071302:certificate/8c0eecf5-8298-4521-990a-9fc3c9d54dd7'),
                // mtls: {
                //     bucket: Bucket.fromBucketName(this, 'truststore-bucket', 'miniconomy-trust-store-bucket'),
                //     key: 'truststore.pem'
                // },
                securityPolicy: SecurityPolicy.TLS_1_2
            }
        });

        const cognitoUserPool = aws_cognito.UserPool.fromUserPoolId(this, 'cognito-user-pool', 'eu-west-1_aWn2igcWJ');

        const privateApi = new RestApi(this, `${appName}-private-api-gateway`, {
            deployOptions: {stageName: 'prod'},
            restApiName: `${appName}-private-api`,
            defaultCorsPreflightOptions: {
                allowHeaders: Cors.DEFAULT_HEADERS,
                allowOrigins: ['http://localhost:8080', 'https://care.projects.bbdgrad.com'],
                allowMethods: Cors.ALL_METHODS,
                allowCredentials: true,
            },
            defaultMethodOptions: {
                authorizationType: AuthorizationType.COGNITO,
                authorizer: new CognitoUserPoolsAuthorizer(this, 'cognito-api-authorizer', {
                    authorizerName: 'cognito-api-authorizer',
                    cognitoUserPools: [cognitoUserPool],
                    resultsCacheTtl: Duration.minutes(30)
                }),
            }
        });

        // Public api resources
        const apiResource = api.root.addResource('api');
        const patientResource = apiResource.addResource('patient');

        // Private api resources
        const privateApiResource = privateApi.root.addResource('api');
        const privatePatientResource = privateApiResource.addResource('patient');
        const privatePatientRecordResource = privatePatientResource.addResource('record');

        // Create patient endpoint
        const createPatientRequestModel = new Model(this, 'create-patient-request-model', {
            restApi: api,
            schema: {
                additionalProperties: false,
                type: JsonSchemaType.OBJECT,
                required: ['personaId'],
                properties: {
                    personaId: {type: JsonSchemaType.NUMBER}
                }
            }
        });

        const createPatientValidator = new RequestValidator(this, 'create-patient-validator', {
            restApi: api,
            validateRequestBody: true
        });


        patientResource.addMethod(HttpMethod.POST, new LambdaIntegration(createPatientLambda), {
            requestValidator: createPatientValidator,
            requestModels: {'application/json': createPatientRequestModel},
            methodResponses: [{
                statusCode: '200', responseModels: {'application/json': Model.EMPTY_MODEL}
            },
                {statusCode: '400', responseModels: {'application/json': Model.ERROR_MODEL}},
            ],
        });

        // sim time endpoint
        const simulationResource = apiResource.addResource('simulation').addMethod(HttpMethod.POST, new LambdaIntegration(simulationEventsLambda));

        // Get all patient records endpoint
        privatePatientRecordResource.addMethod(HttpMethod.GET, new LambdaIntegration(getAllPatientRecordsLambda));

        // Get patient record by id
        privatePatientRecordResource.addResource('{personaId}').addMethod(HttpMethod.GET, new LambdaIntegration(getPatientRecordByIdLambda));

        // Get all tax records
        privateApiResource.addResource('tax').addResource('record').addMethod(HttpMethod.GET, new LambdaIntegration(getAllTaxRecordsLambda));

        // Get bank balance
        const privateBankResource = privateApiResource.addResource('bank');
        privateBankResource.addResource('balance').addMethod(HttpMethod.GET, new LambdaIntegration(getBankBalanceLambda));
        privateBankResource.addResource('transactions').addMethod(HttpMethod.GET, new LambdaIntegration(getTransactions));

        // QUEUE Configs
        chargeHealthInsuranceLambda.addEventSource(new SqsEventSource(chargeHealthInsuranceQueue, {batchSize: 1}));
        chargeHealthInsuranceQueue.grantSendMessages(dischargePatientLambda);

        payIncomeTaxLambda.addEventSource(new SqsEventSource(payIncomeTaxQueue, {batchSize: 1}));
        payIncomeTaxQueue.grantSendMessages(timeEventCoordinatorLambda);

        payVatLambda.addEventSource(new SqsEventSource(payVatQueue, {batchSize: 1}));
        payVatQueue.grantSendMessages(timeEventCoordinatorLambda);

        buySharesQueue.grantSendMessages(timeEventCoordinatorLambda);
        buySharesLambda.addEventSource(new SqsEventSource(buySharesQueue, {batchSize: 1}));

        payDividendsQueue.grantSendMessages(timeEventCoordinatorLambda);
        payDividendsLambda.addEventSource(new SqsEventSource(payDividendsQueue, {batchSize: 1}));

        getTaxNumberQueue.grantSendMessages(simulationEventsLambda);
        getTaxNumberQueue.grantSendMessages(syncTimeLambda);
        getTaxNumberLamda.addEventSource(new SqsEventSource(getTaxNumberQueue, {batchSize: 1}));

        payRevServiceQueue.grantSendMessages(payIncomeTaxLambda);
        payRevServiceQueue.grantSendMessages(payVatLambda);
        payRevServiceLamda.addEventSource(new SqsEventSource(payRevServiceQueue, {batchSize: 1}));

        subNoticeOfPaymentToRevQueue.grantSendMessages(payRevServiceLamda);
        subNoticeOfPaymentToRevLambda.addEventSource(new SqsEventSource(subNoticeOfPaymentToRevQueue, {batchSize: 1}));

        sellSharesQueue.grantSendMessages(registerOnStockMarketLambda);
        sellSharesLambda.addEventSource(new SqsEventSource(sellSharesQueue, {batchSize: 1}));

        registerOnStockMarketQueue.grantSendMessages(simulationEventsLambda);
        registerOnStockMarketQueue.grantSendMessages(syncTimeLambda);
        registerOnStockMarketLambda.addEventSource(new SqsEventSource(registerOnStockMarketQueue, {batchSize: 1}));

        payUserDividendsQueue.grantSendMessages(payDividendsLambda);
        payUserDividendsLambda.addEventSource(new SqsEventSource(payUserDividendsQueue, {batchSize: 1}));

        payBusinessDividendsQueue.grantSendMessages(payDividendsLambda);
        payBusinessDividendsLambda.addEventSource(new SqsEventSource(payBusinessDividendsQueue, {batchSize: 1}));

        buyBusinessSharesQueue.grantSendMessages(buySharesLambda);
        buyBusinessSharesLambda.addEventSource(new SqsEventSource(buyBusinessSharesQueue, {batchSize: 1}));

        dischargePatientQueue.grantSendMessages(checkIfPatientDiedLambda);
        dischargePatientLambda.addEventSource(new SqsEventSource(dischargePatientQueue, {batchSize: 1}));

        checkPatientDiedQueue.grantSendMessages(createPatientLambda);
        checkIfPatientDiedLambda.addEventSource(new SqsEventSource(checkPatientDiedQueue, {batchSize: 1}));

        chargeHealthInsuranceQueue.grantPurge(syncTimeLambda);
        payIncomeTaxQueue.grantPurge(syncTimeLambda);
        payVatQueue.grantPurge(syncTimeLambda);
        buySharesQueue.grantPurge(syncTimeLambda);
        payDividendsQueue.grantPurge(syncTimeLambda);
        getTaxNumberQueue.grantPurge(syncTimeLambda);
        payRevServiceQueue.grantPurge(syncTimeLambda);
        subNoticeOfPaymentToRevQueue.grantPurge(syncTimeLambda);
        sellSharesQueue.grantPurge(syncTimeLambda);
        registerOnStockMarketQueue.grantPurge(syncTimeLambda);
        payUserDividendsQueue.grantPurge(syncTimeLambda);
        payBusinessDividendsQueue.grantPurge(syncTimeLambda);
        buyBusinessSharesQueue.grantPurge(syncTimeLambda);
        dischargePatientQueue.grantPurge(syncTimeLambda);
        checkPatientDiedQueue.grantPurge(syncTimeLambda);

        chargeHealthInsuranceQueue.grantPurge(simulationEventsLambda);
        payIncomeTaxQueue.grantPurge(simulationEventsLambda);
        payVatQueue.grantPurge(simulationEventsLambda);
        buySharesQueue.grantPurge(simulationEventsLambda);
        payDividendsQueue.grantPurge(simulationEventsLambda);
        getTaxNumberQueue.grantPurge(simulationEventsLambda);
        payRevServiceQueue.grantPurge(simulationEventsLambda);
        subNoticeOfPaymentToRevQueue.grantPurge(simulationEventsLambda);
        sellSharesQueue.grantPurge(simulationEventsLambda);
        registerOnStockMarketQueue.grantPurge(simulationEventsLambda);
        payUserDividendsQueue.grantPurge(simulationEventsLambda);
        payBusinessDividendsQueue.grantPurge(simulationEventsLambda);
        buyBusinessSharesQueue.grantPurge(simulationEventsLambda);
        dischargePatientQueue.grantPurge(simulationEventsLambda);
        checkPatientDiedQueue.grantPurge(simulationEventsLambda);
    }
}
