export function request(ctx) {
	return { payload: ctx.args.msg }
}

export function response(ctx) {
	return ctx.result
}
