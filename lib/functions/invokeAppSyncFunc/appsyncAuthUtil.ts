import { SignatureV4 } from '@aws-sdk/signature-v4'
import { Sha256 } from '@aws-crypto/sha256-js'
import { defaultProvider } from '@aws-sdk/credential-provider-node'
import { HttpRequest } from '@aws-sdk/protocol-http'
import { default as fetch, Request } from 'node-fetch'

export type Operation = {
	query: string
	operationName: string
	variables: object
}

export type Config = {
	url: string
	region: string
}

export type RequestParams = {
	config: Config
	operation: Operation
}

export type GraphQLResult<T = object> = {
	data?: T
	errors?: any[]
	extensions?: { [key: string]: any }
}
export const AppSyncRequestIAM = async (params: RequestParams) => {
	// deconstruct the url and create a URL object
	const endpoint = new URL(params.config.url)

	// create something that knows how to let Lambda sign AppSync requests
	const signer = new SignatureV4({
		credentials: defaultProvider(),
		region: params.config.region,
		service: 'appsync',
		sha256: Sha256,
	})

	// Setup the request that we are wanting to sign  with our URL and signer
	const requestToBeSigned = new HttpRequest({
		hostname: endpoint.host,
		port: 443,
		path: endpoint.pathname,
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			host: endpoint.host,
		},
		body: JSON.stringify(params.operation),
	})

	// Actually sign the request
	const signedRequest = await signer.sign(requestToBeSigned)

	// Create an authenticated request for fetch
	const request = new Request(endpoint, signedRequest)

	let body
	try {
		// Make the fetch request
		const response = await fetch(request)
		body = await response.json()
	} catch (e) {
		console.log('error', e)
	}

	return {
		body: JSON.stringify(body),
	}
}
