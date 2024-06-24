import * as cdk from 'aws-cdk-lib';
import {aws_ec2 as ec2, aws_iam as iam, aws_rds as rds} from 'aws-cdk-lib';
import {Construct} from 'constructs';
import {GitHubStackProps} from "./githubStackProps";
import {LambdaIntegration, RestApi} from "aws-cdk-lib/aws-apigateway";
import {Code, Function as LambdaFn, Runtime} from "aws-cdk-lib/aws-lambda";
import {HttpMethod} from "aws-cdk-lib/aws-apigatewayv2";
import {Effect, PolicyDocument, PolicyStatement} from "aws-cdk-lib/aws-iam";

export class BackendStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: GitHubStackProps) {
        super(scope, id, props);

        const appName = "health-care"

        //VPC
        const vpc = new ec2.Vpc(this, `${appName}-vpc`, {
            maxAzs: 2,
            subnetConfiguration: [
                {
                    name: "HealthCarePublicSubnet",
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
            credentials: rds.Credentials.fromGeneratedSecret("postgres", {
                secretName: `${appName}-db-secret`,
            }),
            securityGroups: [securityGrouup],
        });

        //Github deploy role
        const githubDomain = "token.actions.githubusercontent.com";

        const ghProvider = new iam.OpenIdConnectProvider(this, "githubProvider", {
            url: `https://${githubDomain}`,
            clientIds: ["sts.amazonaws.com"],
        });

        const iamRepoDeployAccess = props?.repositoryConfig.map(
            (r) => `repo:${r.owner}/${r.repo}:*`
        );

        const conditions: iam.Conditions = {
            StringLike: {
                [`${githubDomain}:sub`]: iamRepoDeployAccess,
            },
        };

        const elbUpdatesPolicy = iam.ManagedPolicy.fromAwsManagedPolicyName('AWSElasticBeanstalkManagedUpdatesCustomerRolePolicy')

        new iam.Role(this, `${appName}-deploy-role`, {
            assumedBy: new iam.WebIdentityPrincipal(
                ghProvider.openIdConnectProviderArn,
                conditions
            ),
            inlinePolicies: {
                "deployPolicy": new PolicyDocument({
                    statements: [
                        new PolicyStatement({
                            actions: ["sts:AssumeRole"],
                            effect: Effect.ALLOW,
                            resources: ["arn:aws:iam::*:role/cdk-*"]
                        }),
                        new PolicyStatement({
                            actions: ["secretsmanager:GetSecretValue"],
                            effect: Effect.ALLOW,
                            resources: ["*"]
                        })
                    ],
                }),
            },
            roleName: 'HealthCareDeployRole',
            description:
                'This role is used via GitHub Actions to deploy with AWS CDK',
            maxSessionDuration: cdk.Duration.hours(1),
        });
        //Lambdas
        const createPatientLambda = new LambdaFn(this, `create-patient-lambda`, {
            runtime: Runtime.NODEJS_20_X,
            code: Code.fromAsset('../lambda'), //Folder
            handler: 'createPatient.handler', //Filename.FunctionName
            functionName: 'create-patient-lambda'
        });

        // API
        const api = new RestApi(this, `${appName}-api-gateway`, {
            deployOptions: {stageName: 'prod', tracingEnabled: true},
            restApiName: `${appName}-api`,
            defaultMethodOptions: {},
        });

        const apiResource = api.root.addResource('api')

        apiResource.addResource('patient')
            .addMethod(HttpMethod.POST, new LambdaIntegration(createPatientLambda))
    }
}
