export const OK = new Response(null, { status: 200 })
export const BadRequest = new Response(null, { status: 400 })
export const Unauthorized = new Response(null, {
	status: 401,
	headers: { 'WWW-Authenticate': 'Basic realm="User Visible Realm' },
})
