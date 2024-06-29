import * as cdk from 'aws-cdk-lib';
import * as elasticbeanstalk from 'aws-cdk-lib/aws-elasticbeanstalk';
import * as s3assets from 'aws-cdk-lib/aws-s3-assets';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';

export interface EBEnvProps extends cdk.StackProps {
  minSize?: string;
  maxSize?: string;
  instanceTypes?: string;
  envName?: string;
}

export class HealthcarePortalCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const appName = 'Health-Care-Portal';

    // vpc
    const vpc = new ec2.Vpc(this, `${appName}-VPC`, {
      subnetConfiguration: [
          {
              name: "HealthCarePortalSubnet",
              subnetType: ec2.SubnetType.PUBLIC,
          },
      ],
    });

    // security group
    const securityGroup = new ec2.SecurityGroup(this, `${appName}-SG`, {
        vpc,
        allowAllOutbound: true,
    });

    securityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(8080));

    // zip frontend and upload it to S3
    const healthCarePortal = new s3assets.Asset(this, 'WebAppZip', {
      path: `${__dirname}/../../healthcare-portal-server`,
      exclude: ['node_modules', 'package-lock.json']
    });

    // create EB app
    const app = new elasticbeanstalk.CfnApplication(this, 'application', {
      applicationName: appName,
    });

    // create EB app version from S3
    const appVersion = new elasticbeanstalk.CfnApplicationVersion(this, 'application-version', {
      applicationName: appName,
      sourceBundle: {
        s3Bucket: healthCarePortal.s3BucketName,
        s3Key: healthCarePortal.s3ObjectKey,
      },
    });

    appVersion.addDependency(app);

    // create role and instance profile
    const myRole = new iam.Role(this, `${appName}-aws-elasticbeanstalk-ec2-role`, {
      assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com'),
    });

    const managedPolicy = iam.ManagedPolicy.fromAwsManagedPolicyName('AWSElasticBeanstalkWebTier')
    myRole.addManagedPolicy(managedPolicy);

    const myProfileName = `${appName}-InstanceProfile`

    const instanceProfile = new iam.CfnInstanceProfile(this, myProfileName, {
      instanceProfileName: myProfileName,
      roles: [
          myRole.roleName
      ]
    });

    const optionSettingProperties: elasticbeanstalk.CfnEnvironment.OptionSettingProperty[] = [
      {
        namespace: 'aws:ec2:vpc',
        optionName: 'VPCId',
        value: vpc.vpcId,
      },
      {
        namespace: 'aws:ec2:vpc',
        optionName: 'Subnets',
        value: vpc.publicSubnets.map(value => value.subnetId).join(','),
      },
      {
        namespace: 'aws:ec2:vpc',
        optionName: 'ELBSubnets',
        value: vpc.publicSubnets.map(value => value.subnetId).join(','),
      },
      {
          namespace: 'aws:autoscaling:launchconfiguration',
          optionName: 'IamInstanceProfile',
          value: myProfileName,
      },
      {
          namespace: 'aws:autoscaling:asg',
          optionName: 'MinSize',
          value: '1',
      },
      {
          namespace: 'aws:autoscaling:asg',
          optionName: 'MaxSize',
          value: '1',
      },
      {
          namespace: 'aws:ec2:instances',
          optionName: 'InstanceTypes',
          value: 't2.micro',
      },
    ];

    // create EB environment
    const elbEnv = new elasticbeanstalk.CfnEnvironment(this, 'Environment', {
      environmentName: "HealthCarePortalEnvironment",
      applicationName: appName,
      solutionStackName: '64bit Amazon Linux 2023 v6.1.6 running Node.js 20',
      optionSettings: optionSettingProperties,
      versionLabel: appVersion.ref,
    });

    

  }

}

