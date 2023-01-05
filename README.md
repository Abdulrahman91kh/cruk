# Donation Management Service
  
## Introduction

- This service handles user donation and user subscriptions. It exposes an API of:

  -  `donations` Which accepts users donations and thanks those who donate more than twoice.

  -  `users` Where users can register thier emails

- I intended to use SNS for the thanks thing, but I changed my mind later to SES to get an actual email sent by only verifing my own email `abdulrahman91kh@gmail.com`. So the API endpoint for `users` serves no purpose in terms of the challenge, but I decided to keep it as it is already implemented, may it helps to show how I thought about its implementation.

---

## Installation & Setup

- First of all, let's grap the challenge code. Use the following git command to clone the project
    ```
    git clone https://github.com/Abdulrahman91kh/cruk.git
    ```
- We need to create an environment file `.env`, navigate to the project root folder, create a new file with name of `.env`, and copy the next snippet to your file, don't forget to change the variables values with yours
    ```
    ACCOUNT_ID=123456789
    REGION=EU-DIRECTION-X
    SES_SOURCE_EMAIL="abdulrahman91kh@gmail.com"
    ```
- You need to have your AWS ready and your credentials configured, you will need at least a defualt profile to deploy the project to. for more information please visit [AWS documentation](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html)
- Now you need to navigate to the project folder and install its dependencies, you can do it using:
    ```
    npm i
    ```
- Then you need to build the source code, you can do it using:
    ```
    npm run build
    ```
- Now its time to generate the cloudformation template, you can do it using:
    ```
    npx cdk synth
    ```
- Everything is set and ready to get deployed, you can deploy using:
    ```
    npx cdk deploy
    ```

- **Important NOTE**: if you are doploying this to your sandbox, you will have to [create an identity](https://docs.aws.amazon.com/ses/latest/dg/creating-identities.html) first, otherwise, the sending emails function will throw an error and you will get an *internal server error*
---

## Live testing
### Postman Testing
- If you are willing to test this service using postman, you will find a postman collection and a postman environment variable files within this project files. Navigate to: `<rootDir>/<postman>/`
- Within the postman collection you will find examples for the expected responses in success and failure cases.
- If you are going to use any other client please find the following:
  - The service API URL is:
	    ```
	    https://dit4rtt93m.execute-api.eu-west-1.amazonaws.com/prod/
	    ``` 
  - The donations Endpoint details: 
        ```
	    URL: https://dit4rtt93m.execute-api.eu-west-1.amazonaws.com/prod/donations
        Method: POST
        Body: {
            "email": "example@email.com",
            "amount": 123
        }
	    ```
    Where the `email` indicates to the donator email, and the amount is the donation in £ (numeric value only)
  - the users Endpoint is: 
        ```
	    URL: https://dit4rtt93m.execute-api.eu-west-1.amazonaws.com/prod/users
        Method: POST
        Body: {
            "email": "example@email.com"
        }
	    ```
    Where email is the subscriber email.

---

### Scalability & Resources
- Lambda limitation
- DynamoDB Limitations
- SES Limitations

---

### Scalability & Resources
- Keep structural logs.
- Keep logs insightfull without any sensitive information.
- In case of corss lambdas requests we may introduce a `correlationId` to be attached to logs.
- The `correlationId` would be a unique id that is generated from the first lambda serving a request and passed to the next lambdas.
- Using `correlationId` in cloudwatch insights page will help to see the request logs going from one resource to another and may be from one service to another.
- Easier request tracking = faster debuging.
- For such a simple service like this cloudwatch would be fine to query and filter requests and logs in different levels.
- If the service is scaled and got more resources into it, we can use `DLQ`s, to monitor `SQS`s and `Eventbridges`. We may need to use a monitoring tools such as `Newrelic`.

---

### Next improvements
- Exclude the tests from the build.
- Using the service name as a prefix to the service resources helps to identify the resource when the system gets more complex.
- Use a feature flag to turn on and of sending emails (in case of it is causing errors because of the identity thing).
- Split the stack creation test file into smaller ones to make it easier to read.
- Rename the users table to donators makes more sense in terms of scalling the service up.

