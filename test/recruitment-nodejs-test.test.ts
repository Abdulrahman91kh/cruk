import * as cdk from 'aws-cdk-lib';
import { Match, Template } from 'aws-cdk-lib/assertions';
import * as RecruitmentNodejsTest from '../lib/recruitment-nodejs-test-stack';

describe ("Main Stack Creation", () => {
    const app = new cdk.App();
    // WHEN
    const stack = new RecruitmentNodejsTest.RecruitmentNodejsTestStack(app, 'MyTestStack');
    // THEN
    const template = Template.fromStack(stack);
    it('Should test the "donation" Dynamodb table creation', () => {
        template.hasResourceProperties('AWS::DynamoDB::Table', {
            TableName: 'donations',
            KeySchema: Match.arrayWith([{
                AttributeName: 'id',
                KeyType: 'HASH'
            }]),
            AttributeDefinitions: Match.arrayWith([
                {
                    "AttributeName": "id",
                    "AttributeType": "S"
                },
                {
                    "AttributeName": "userId",
                    "AttributeType": "S"
                }
            ]),
            GlobalSecondaryIndexes: Match.arrayWith([
                Match.objectLike({
                    IndexName: "userIdIndex",
                    KeySchema: Match.arrayWith([
                        Match.objectLike({
                            AttributeName: "userId",
                            KeyType: "HASH"
                        })
                    ]),
                    Projection: Match.objectLike({
                        "ProjectionType": "ALL"
                    }),
                })
            ])
            //should check the key and index
        });
    });
    it('Should test the "users" Dynamodb table creation', () => {
        template.hasResourceProperties('AWS::DynamoDB::Table', {
            TableName: 'users',
            KeySchema: Match.arrayWith([{
                AttributeName: 'id',
                KeyType: 'HASH'
            }]),
            AttributeDefinitions: Match.arrayWith([
                {
                    "AttributeName": "id",
                    "AttributeType": "S"
                },
                {
                    "AttributeName": "email",
                    "AttributeType": "S"
                }
            ]),
            GlobalSecondaryIndexes: Match.arrayWith([
                Match.objectLike({
                    IndexName: "userEmailIndex",
                    KeySchema: Match.arrayWith([
                        Match.objectLike({
                            AttributeName: "email",
                            KeyType: "HASH"
                        })
                    ]),
                    Projection: Match.objectLike({
                        "ProjectionType": "ALL"
                    }),
                })
            ])
        });
    });
    
    it('Should test the "post-donations" lambda function creation', () => {
        template.hasResourceProperties('AWS::Lambda::Function', {
            Environment: Match.objectLike ({
                Variables: Match.objectLike({
                    DONATION_TABLE: Match.objectLike({
                        Ref: Match.anyValue()
                    }),
                    USERS_TABLE: Match.objectLike({
                        Ref: Match.anyValue()
                    })
                })
            }),
            FunctionName: "post-donations",
            Handler: "index.handler",
            Runtime: "nodejs16.x",
            Timeout: 120
        });
    });
    
    it('Should test the "post-users" lambda function creation', () => {
        template.hasResourceProperties('AWS::Lambda::Function', {
            Environment: Match.objectLike ({
                Variables: Match.objectLike({
                    DONATION_TABLE: Match.objectLike({
                        Ref: Match.anyValue()
                    }),
                    USERS_TABLE: Match.objectLike({
                        Ref: Match.anyValue()
                    }),
                    /**
                     * If we are needed to use it keep it if it's OK to use SES we can delete it
                     * TAG [DELETE_SNS]
                     * 
                     */
                    // SNS_TOPIC_ARN: Match.objectLike({
                    //     Ref: Match.anyValue()
                    // })
                })
            }),
            FunctionName: "post-users",
            Handler: "index.handler",
            Runtime: "nodejs16.x",
            Timeout: 120
        });
    });
    describe('Should test the API Gateway creation', () => {
        it('Should create a API Gateway restApi', () => {
            template.hasResourceProperties('AWS::ApiGateway::RestApi', {
                Name: 'Donations Management Service'
            });
        });

        it('Shuold create a resource "/donations"', () => {
            template.hasResourceProperties('AWS::ApiGateway::Resource', {
                PathPart: 'donations'
            });
        });

        it('Shuold add method POST to resource "/donations"', () => {
            template.hasResourceProperties('AWS::ApiGateway::Method', {
                HttpMethod: 'POST',
                ResourceId: Match.objectEquals({
                    Ref: Match.stringLikeRegexp('DonationsAPIdonations')
                })
            });
        });

        it('Shuold create a resource "/users"', () => {
            template.hasResourceProperties('AWS::ApiGateway::Resource', {
                PathPart: 'users'
            });
        })
        it('Shuold add method POST to resource "/users"', () => {
            template.hasResourceProperties('AWS::ApiGateway::Method', {
                HttpMethod: 'POST',
                ResourceId: Match.objectEquals({
                    Ref: Match.stringLikeRegexp('DonationsAPIusers')
                })
            });
        });
    });
    describe('Testing Permissions', () => {
        it('Should create IAM Policy with permission to SES', () => {
            template.hasResourceProperties('AWS::IAM::Policy', {
                PolicyName: Match.stringLikeRegexp('postdonations'),
                PolicyDocument: Match.objectLike({
                    Statement: Match.arrayWith([
                        Match.objectEquals({
                            Action: "ses:SendEmail",
                            Effect: "Allow",
                            Resource: "*"
                        }),
                    ])//end of statement
                })//end of policy document
            });//end of template statement
        });
    });
    
});
