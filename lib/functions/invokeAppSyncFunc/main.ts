import { BroadcastMessageMutationVariables } from '../../api/codegen/API'
import { broadcastMessage } from '../../api/codegen/mutations'
import { AppSyncRequestIAM } from './appsyncAuthUtil'

exports.handler = async (event: any) => {
	console.log('the event', event)

	try {
		const res = await AppSyncRequestIAM({
			config: {
				region: process.env.REGION as string,
				url: process.env.APPSYNC_API_URL as string,
			},
			operation: {
				operationName: 'BroadcastMessage',
				query: broadcastMessage,
				variables: {
					msg: event.msg,
				} as BroadcastMessageMutationVariables,
			},
		})
		console.log('the appsync res', res)
	} catch (e) {
		console.log('error', e)
	}
}
