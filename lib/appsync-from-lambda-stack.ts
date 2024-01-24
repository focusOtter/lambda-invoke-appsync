import * as cdk from 'aws-cdk-lib'
import { Construct } from 'constructs'
import { createInvokeAppSyncFunc } from './functions/invokeAppSyncFunc/construct'
import { createAppSyncAPI } from './api/appsync'

export class AppsyncFromLambdaStack extends cdk.Stack {
	constructor(scope: Construct, id: string, props?: cdk.StackProps) {
		super(scope, id, props)
		const appName = 'lambda-to-appsync-example'

		//* Create the services

		const invokeAppSyncFunc = createInvokeAppSyncFunc(this, {
			appName,
		})

		const appSyncAPI = createAppSyncAPI(this, {
			appName,
			invokeAppSyncFunc: invokeAppSyncFunc,
		})

		//* Add any additional permissions/envVars

		invokeAppSyncFunc.addEnvironment('REGION', this.region)
		invokeAppSyncFunc.addEnvironment('APPSYNC_API_URL', appSyncAPI.graphqlUrl)

		appSyncAPI.grantMutation(invokeAppSyncFunc)
	}
}
