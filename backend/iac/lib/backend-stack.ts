import * as cdk from 'aws-cdk-lib';
import {aws_ec2 as ec2, aws_iam as iam, aws_rds as rds, Duration} from 'aws-cdk-lib';
import {Construct} from 'constructs';
import {GitHubStackProps} from './githubStackProps';
import {JsonSchemaType, LambdaIntegration, Model, RequestValidator, RestApi} from 'aws-cdk-lib/aws-apigateway';
import {Runtime} from 'aws-cdk-lib/aws-lambda';
import {HttpMethod} from 'aws-cdk-lib/aws-apigatewayv2';
import {Effect, PolicyDocument, PolicyStatement} from 'aws-cdk-lib/aws-iam';
import {NodejsFunction, NodejsFunctionProps} from 'aws-cdk-lib/aws-lambda-nodejs';
import * as path from 'path';
import {SqsEventSource} from 'aws-cdk-lib/aws-lambda-event-sources';
import {Queue} from 'aws-cdk-lib/aws-sqs';
import {Secret} from 'aws-cdk-lib/aws-secretsmanager';

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

        //Lambdas
        const lambdaEnv = {
            'DB_SECRET': dbInstance.secret?.secretArn!,
            'CERT_SECRET': certSecret.secretArn,
            'KEY_SECRET': keySecret.secretArn,
            'CHARGE_HEALTH_INSURANCE_QUEUE_URL': chargeHealthInsuranceQueue.queueUrl
        };

        const lambdaAppDir = path.resolve(__dirname, '../../lambda');

        const createLambda = (id: string, props: NodejsFunctionProps) => {
            const fn = new NodejsFunction(this, id, {
                environment: lambdaEnv,
                ...props
            });

            dbInstance.secret?.grantRead(fn);
            certSecret.grantRead(fn);
            keySecret.grantRead(fn);

            return fn;
        };

        const createPatientLambda = createLambda(`create-patient-lambda`, {
            runtime: Runtime.NODEJS_20_X,
            entry: path.join(lambdaAppDir, 'createPatient.ts'),
            functionName: 'create-patient-lambda',
        });

        const getAllPatientRecordsLambda = createLambda(`get-all-patient-records-lambda`, {
            runtime: Runtime.NODEJS_20_X,
            entry: path.join(lambdaAppDir, 'getAllPatientRecords.ts'),
            functionName: 'get-all-patient-records-lambda',
        });

        const getPatientRecordByIdLambda = createLambda(`get-patient-record-lambda`, {
            runtime: Runtime.NODEJS_20_X,
            entry: path.join(lambdaAppDir, 'getPatientRecordById.ts'),
            functionName: 'get-patient-record-lambda',
        });

        const getAllTaxRecordsLambda = createLambda(`get-all-tax-records-lambda`, {
            runtime: Runtime.NODEJS_20_X,
            entry: path.join(lambdaAppDir, 'getAllTaxRecords.ts'),
            functionName: 'get-all-tax-records-lambda',
        });

        const getBankBalanceLambda = createLambda(`get-bank-balance-lambda`, {
            runtime: Runtime.NODEJS_20_X,
            entry: path.join(lambdaAppDir, 'getBankBalance.ts'),
            functionName: 'get-bank-balance-lambda',
        });

        const payIncomeTaxLambda = createLambda(`pay-income-tax-lambda`, {
            runtime: Runtime.NODEJS_20_X,
            entry: path.join(lambdaAppDir, 'payIncomeTax.ts'),
            functionName: 'pay-income-tax-lambda',
        });

        const payVatLambda = createLambda(`pay-vat-lambda`, {
            runtime: Runtime.NODEJS_20_X,
            entry: path.join(lambdaAppDir, 'payVat.ts'),
            functionName: 'pay-vat-lambda',
        });

        const payDividendsLambda = createLambda(`pay-dividends-lambda`, {
            runtime: Runtime.NODEJS_20_X,
            entry: path.join(lambdaAppDir, 'payDividends.ts'),
            functionName: 'pay-dividends-lambda',
        });

        const sellSharesLambda = createLambda(`sell-shares-lambda`, {
            runtime: Runtime.NODEJS_20_X,
            entry: path.join(lambdaAppDir, 'sellShares.ts'),
            functionName: 'sell-shares-lambda',
        });

        const buySharesLambda = createLambda(`buy-shares-lambda`, {
            runtime: Runtime.NODEJS_20_X,
            entry: path.join(lambdaAppDir, 'buyShares.ts'),
            functionName: 'buy-shares-lambda',
        });

        const chargeHealthInsuranceLambda = createLambda(`charge-health-insurance-lambda`, {
            runtime: Runtime.NODEJS_20_X,
            entry: path.join(lambdaAppDir, 'chargeHealthInsurance.ts'),
            functionName: 'charge-health-insurance-lambda',
        });

        // API
        const api = new RestApi(this, `${appName}-api-gateway`, {
            deployOptions: {stageName: 'prod', tracingEnabled: true},
            restApiName: `${appName}-api`,
            defaultMethodOptions: {},
        });

        const apiResource = api.root.addResource('api');
        const patientResource = apiResource.addResource('patient');
        const patientRecordResource = patientResource.addResource('record');
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

        // Get all patient records endpoint
        patientRecordResource.addMethod(HttpMethod.GET, new LambdaIntegration(getAllPatientRecordsLambda));

        // Get patient record by id
        patientRecordResource.addResource('{personaId}').addMethod(HttpMethod.GET, new LambdaIntegration(getPatientRecordByIdLambda));

        // Get all tax records
        apiResource.addResource('tax').addResource('record').addMethod(HttpMethod.GET, new LambdaIntegration(getAllTaxRecordsLambda));

        // Get bank balance
        apiResource.addResource('bank').addResource('balance').addMethod(HttpMethod.GET, new LambdaIntegration(getBankBalanceLambda));


        // QUEUE Configs
        chargeHealthInsuranceLambda.addEventSource(new SqsEventSource(chargeHealthInsuranceQueue, {batchSize: 1}));
        chargeHealthInsuranceQueue.grantSendMessages(createPatientLambda);
    }
}
