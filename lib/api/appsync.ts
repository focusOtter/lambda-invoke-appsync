import {
	AuthorizationType,
	Code,
	Definition,
	FieldLogLevel,
	FunctionRuntime,
	GraphqlApi,
} from 'aws-cdk-lib/aws-appsync'
import { IFunction } from 'aws-cdk-lib/aws-lambda'
import { Construct } from 'constructs'
import * as path from 'path'

type AppSyncAPIProps = {
	appName: string
	invokeAppSyncFunc: IFunction
}

export const createAppSyncAPI = (scope: Construct, props: AppSyncAPIProps) => {
	const api = new GraphqlApi(scope, `${props.appName}`, {
		name: props.appName,
		definition: Definition.fromFile(path.join(__dirname, 'schema.graphql')),
		authorizationConfig: {
			defaultAuthorization: {
				authorizationType: AuthorizationType.IAM,
			},
		},
		logConfig: {
			fieldLogLevel: FieldLogLevel.ALL,
		},
	})

	const noneDS = api.addNoneDataSource('noneDS', {
		name: 'noneDS',
	})

	noneDS.createResolver('parrotMessage', {
		typeName: 'Mutation',
		fieldName: 'broadcastMessage',
		runtime: FunctionRuntime.JS_1_0_0,
		code: Code.fromAsset(path.join(__dirname, 'parrotMessage.js')),
	})

	return api
}
