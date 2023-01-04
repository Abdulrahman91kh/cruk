import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import {
  aws_dynamodb as dynamodb,
  aws_lambda as lambda,
  aws_apigateway as apigateway,
  aws_sns as sns,
  Duration
} from 'aws-cdk-lib';
import { PolicyStatement, Effect } from 'aws-cdk-lib/aws-iam';
import path = require('path');
import * as dotenv from 'dotenv';
dotenv.config();

export class RecruitmentNodejsTestStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // SNS Subscription topic
    const topic = new sns.Topic(this, 'donation-thanks', {
        displayName: 'Multiple Donations Thanks',
        topicName: 'donationThanks'
    });

    // Donation Dynamo Table
    const donationsTable = new dynamodb.Table(this, 'donations', {
        partitionKey: {
            name: 'id', type: dynamodb.AttributeType.STRING,
        },
        tableName: "donations"
    });
    // We will need to query donations by userId
    donationsTable.addGlobalSecondaryIndex({
      indexName: 'userIdIndex',
      partitionKey: { name: 'userId', type: dynamodb.AttributeType.STRING}
    });

    // Users Table
    const usersTable = new dynamodb.Table(this, 'users', {
        partitionKey: {
            name: 'id', type: dynamodb.AttributeType.STRING,
        },
        tableName: "users"
    });
    // We will need to query users by user email
    usersTable.addGlobalSecondaryIndex({
      indexName: 'userEmailIndex',
      partitionKey: {name: 'email', type: dynamodb.AttributeType.STRING}
    });

    // Insert Donation Lambda
    const inserDonationHandler = new lambda.Function(this, 'post-donations', {
        runtime: lambda.Runtime.NODEJS_16_X,
        code: lambda.Code.fromAsset(path.join(__dirname,'/../dist/lambda/handlers/post-donations')),
        handler: 'index.handler',
        functionName: 'post-donations',
        timeout: Duration.seconds(120),
        environment: {
            DONATION_TABLE: donationsTable.tableName,
            USERS_TABLE: usersTable.tableName,
            SES_SOURCE_EMAIL: process.env.SES_SOURCE_EMAIL || 'no-reply@cruk.com'
            // SNS_TOPIC_ARN: topic.topicArn
        }
    });
    inserDonationHandler.addToRolePolicy(new PolicyStatement({
      actions: ['ses:SendEmail'],
      resources: ['*'],
      effect: Effect.ALLOW,
    }));

    //Insert User 
    const subscribeTopicHandler = new lambda.Function(this, 'post-users', {
        runtime: lambda.Runtime.NODEJS_16_X,
        code: lambda.Code.fromAsset(path.join(__dirname, `/../dist/lambda/handlers/post-users`)),
        handler: 'index.handler',
        functionName: 'post-users',
        timeout: Duration.seconds(120),
        environment: {
            DONATION_TABLE: donationsTable.tableName,
            USERS_TABLE: usersTable.tableName,
            SNS_TOPIC_ARN: topic.topicArn
        }
    });
    
    // APIGateway
    const apiGateway = new apigateway.RestApi(this, 'DonationsAPI', {
        restApiName: 'Donations Management Service',
        description: 'This API owns donations data',
    });

    const donationsAPI = apiGateway.root.addResource('donations');
      const usersAPI = apiGateway.root.addResource('users');
      const newDonationIntegration = new apigateway.LambdaIntegration(inserDonationHandler);
      const newSubscriptionIntegration = new apigateway.LambdaIntegration(subscribeTopicHandler);
      donationsAPI.addMethod('POST', newDonationIntegration);
      usersAPI.addMethod('POST', newSubscriptionIntegration);

      // Premissions        
      donationsTable.grantFullAccess(inserDonationHandler);
      usersTable.grantFullAccess(subscribeTopicHandler);
      topic.grantPublish(inserDonationHandler);
  }
}
