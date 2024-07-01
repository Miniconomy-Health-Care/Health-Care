#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import {HealthcarePortalCdkStack} from '../lib/healthcare-portal-cdk-stack';

const app = new cdk.App();
new HealthcarePortalCdkStack(app, 'HealthcarePortalCdkStack', {
  tags: {
    'owner': 'avishkarm@bbd.co.za',
    'created-using': 'cdk',
  },
});
