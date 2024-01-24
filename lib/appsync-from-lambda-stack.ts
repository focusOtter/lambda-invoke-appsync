import * as cdk from 'aws-cdk-lib'
import { Construct } from 'constructs'
import { createInvokeAppSyncFunc } from './functions/invokeAppSyncFunc/construct'
import { createAppSyncAPI } from './api/appsync'

export class AppsyncFromLambdaStack extends cdk.Stack {
	constructor(scope: Construct, id: string, props?: cdk.StackProps) {
		super(scope, id, props)
		const appName = 'lambda-to-appsync-example'

		// Create the services

		const invokeAppSyncFunc = createInvokeAppSyncFunc(this, {
			appName,
			account: this.account,
			region: this.region,
		})

		const appSyncAPI = createAppSyncAPI(this, {
			appName,
			invokeAppSyncFunc: invokeAppSyncFunc.invokeAppSyncFunc,
		})

		// Add any additional permissions/envVars

		invokeAppSyncFunc.invokeAppSyncFunc.addEnvironment('REGION', this.region)
		invokeAppSyncFunc.invokeAppSyncFunc.addEnvironment(
			'APPSYNC_API_URL',
			appSyncAPI.graphqlUrl
		)

		appSyncAPI.grantMutation(invokeAppSyncFunc.invokeAppSyncFunc)

		// Log the Lambda function URL once it's deployed

		new cdk.CfnOutput(this, 'invokeAppSyncFuncURL', {
			value: invokeAppSyncFunc.invokeAppSyncFuncURL,
		})
	}
}
