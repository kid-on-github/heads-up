import {
	BadRequest,
	OK,
	Unauthorized,
} from '../../../function_utilities/StandardResponses'
import verifyJWT from '../../../function_utilities/verifyJWT'
import type { UserType } from '../../../src/utils/constants'

export async function onRequest({ request, env, params }) {
	if (request.method === 'GET') {
		// TODO: make suer uid is valid and matches JWT (after JWT verification)

		const { JWT_KV } = env

		let { valid } = await verifyJWT(request, JWT_KV)
		if (!valid) {
			return Unauthorized
		}

		const { uid } = params
		const user = await env.Users.get(uid)

		if (user) {
			return new Response(JSON.stringify(user), { status: 200 })
		} else {
			const newUser: UserType = {
				uid: uid,
				firstName: null,
				email: null,
				emailVerified: false,
				cell: null,
				cellVerified: false,
				birthday: null,
			}

			const stringifiedUser = JSON.stringify(newUser)

			await env.Users.put(uid, stringifiedUser)

			return new Response(stringifiedUser, {
				status: 200,
				headers: {
					'content-type': 'application/json;charset=UTF-8',
				},
			})
		}
	}

	return BadRequest
}

export async function onRequestPut({ request, env, params }) {
	const { JWT_KV } = env

	let { valid } = await verifyJWT(request, JWT_KV)
	if (!valid) {
		return Unauthorized
	}

	const { uid } = params

	// TODO: make sure the uid is valid and matches the token uid, also validate data, maybe put this in a try catch block
	if (uid) {
		const newUser = await request.json()

		await env.Users.put(uid, JSON.stringify(newUser))

		return OK
	}

	return BadRequest
}
