import { FunctionUrlAuthType, Runtime } from 'aws-cdk-lib/aws-lambda'
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs'
import { Construct } from 'constructs'
import * as path from 'path'

type InvokeAppSyncFuncProps = {
	appName: string
	region: string
	account: string
}

export const createInvokeAppSyncFunc = (
	scope: Construct,
	props: InvokeAppSyncFuncProps
) => {
	const invokeAppSyncFunc = new NodejsFunction(
		scope,
		`${props.appName}-invokeAppSyncFunc`,
		{
			functionName: `${props.appName}-invokeAppSyncFunc`,
			runtime: Runtime.NODEJS_18_X,
			handler: 'handler',
			entry: path.join(__dirname, `./main.ts`),
		}
	)

	const invokeAppSyncFuncURL = invokeAppSyncFunc.addFunctionUrl({
		authType: FunctionUrlAuthType.NONE,
	})

	return { invokeAppSyncFunc, invokeAppSyncFuncURL: invokeAppSyncFuncURL.url }
}
