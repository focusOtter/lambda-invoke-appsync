# AWS CDK: Lambda to AppSync Integration

Sometimes you want to call an AppSync API in a Lambda function. A real-world use case is when a customer makes a [payment with Stripe and you want to fire a webhook](https://github.com/focusOtter/stripe-webhook-example). Another use case in when an image is upload to an S3 bucket and you want to perform some additional processing.

This repository contains a project setup using AWS Cloud Development Kit (CDK) for a serverless integration between AWS Lambda and AWS AppSync. The setup enables a Lambda function, written in TypeScript, to call an AppSync GraphQL API using IAM credentials for authentication.

The main functionality of this integration is to allow the Lambda function to execute a `broadcastMessage` mutation on the AppSync API.

## Overview

The project demonstrates a secure and scalable pattern for invoking GraphQL mutations from a Lambda function. It uses AWS IAM for authentication, ensuring that the process adheres to AWS's best practices for security and identity management.

### Key Components

- **AWS AppSync API**: Configured to use IAM permissions for a simple GraphQL schema that supports a `broadcastMessage` mutation.
- **AWS Lambda (NodeJSFunction)**: A TypeScript-based Lambda function capable of calling the AppSync API mutation.
- **Utility Files**:
  - `appsyncAuthUtil.ts`: A utility to facilitate signing AppSync requests with IAM credentials and AWS Signature Version 4 (SigV4). What is I love about this file is you never have to adjust it. It just works™️. Review [the lambda function](/lib/functions/invokeAppSyncFunc/main.ts) for example usage.
  - `parrotMessage.js`: Contains the request and response mapping templates for the AppSync resolver. This resolver is connected to a [NONE datasource](https://docs.aws.amazon.com/appsync/latest/devguide/resolver-reference-none-js.html).

### Configuration Details

1. **AppSync API IAM Permissions**:

   - The AppSync API is configured with IAM permissions as the default authorization mode.
   - This is set using `defaultAuthorization.authorizationType` with the value `AuthorizationType.IAM`.

2. **AppSync Schema**:

   - The GraphQL schema includes the following mutation, which is accessible using IAM credentials:
     ```graphql
     type Mutation {
     	broadcastMessage(msg: String): String! @aws_iam
     }
     ```

3. **Lambda Access to AppSync**:
   - The AWS CDK L2 construct is used to grant the Lambda function access to the `broadcastMessage` mutation on the AppSync API. This is achieved via `appSyncAPI.grantMutation(invokeAppSyncFunc)`.

## Getting Started

### Prerequisites

- AWS Account and AWS CLI configured on your machine.
- Node.js and npm installed.

### Deployment Steps

1. **Clone the Repository**:

   ```
   git clone https://github.com/focusOtter/lambda-invoke-appsync.git
   ```

2. **Install Dependencies**:
   Navigate to the project directory and run:

   ```
   npm install
   ```

3. **Deploy using AWS CDK**:
   ```
   npx aws-cdk deploy
   ```

### Usage

After deploying the stack, you can invoke the Lambda function to test the `broadcastMessage` mutation on the AppSync API. The Lambda function will use the `appsyncAuthUtil.ts` utility to sign the request with IAM credentials.
<img width="1874" alt="image" src="https://github.com/focusOtter/lambda-invoke-appsync/assets/5106417/bb405643-4956-4aeb-a73d-bdf1e8b8e641">

From there, verify the logs:

<img width="1598" alt="image" src="https://github.com/focusOtter/lambda-invoke-appsync/assets/5106417/83947b38-3c2d-4fd2-b163-57140cea3f4d">



## Contributions

Contributions to this project are welcome. Please follow the standard GitHub pull request process to propose changes.

---
