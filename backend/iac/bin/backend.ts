#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import {BackendStack} from '../lib/backend-stack';

const app = new cdk.App();
new BackendStack(app, 'HealthCareBackend', {
    stackName: "HealthCareBackend",
    env: {account: '363615071302', region: 'eu-west-1'},
    tags: {
        "owner": "avishkarm@bbd.co.za",
        "created-using": "cdk",
    },
    repositoryConfig: [
        {owner: 'Miniconomy-Health-Care', repo: 'Health-Care'}
    ],
});
