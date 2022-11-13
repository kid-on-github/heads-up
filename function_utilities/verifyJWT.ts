import { validAud, validIss } from './config'

const defaultResponse: { valid: boolean; userId: string | null } = {
	valid: false,
	userId: null,
}

export default async function verifyJWT(request, JWT_KV) {
	const response = { ...defaultResponse }

	const encodedToken = getJwt(request)

	if (encodedToken === null) {
		return response
	}

	const token = decodeJwt(encodedToken)

	// Is the token expired?
	let expiryDate = new Date(token.payload.exp * 1000)
	let currentDate = new Date(Date.now())
	if (expiryDate <= currentDate) {
		console.error('expired token', expiryDate, currentDate)
		return response
	}

	const { aud, iss, sub, auth_time: authTime } = token.payload

	if (aud !== validAud) {
		console.error('invalid aud', aud)
		return response
	}

	if (iss !== validIss) {
		console.error('invalid iss', iss)
		return response
	}

	// TODO: Must be a non-empty string and must be the uid of the user or device.
	if (typeof sub !== 'string' || sub.length === 0) {
		console.error('invalid sub', sub)
		return response
	}

	let authTimeDate = new Date(authTime * 1000)
	if (authTimeDate >= currentDate) {
		console.error('invalid auth time', authTime)
		return response
	}

	const { valid, userId } = await isValidJwtSignature(token, JWT_KV)

	if (valid) {
		response.valid = true
		response.userId = userId
	}

	console.log('\nvalid:', valid, 'userId:', userId, '\n')
	return response
}

function getJwt(request) {
	const authHeader = request.headers.get('Authorization')
	if (!authHeader || authHeader.substring(0, 6) !== 'Bearer') {
		console.error('No Bearer')
		return null
	}
	return authHeader.substring(6).trim()
}

function decodeJwt(token: string) {
	const parts = token.split('.')
	const header = JSON.parse(atob(parts[0]))
	const payload = JSON.parse(atob(parts[1]))
	const signature = atob(parts[2].replace(/_/g, '/').replace(/-/g, '+'))
	return {
		header: header,
		payload: payload,
		signature: signature,
		raw: { header: parts[0], payload: parts[1], signature: parts[2] },
	}
}

const getGoogleJWK = async (kid, JWT_KV) => {
	let googleJWK = await JWT_KV.get(`kid:${kid}`)
		.then((key) => JSON.parse(key))
		.catch((err) => {
			console.error(err)
			return null
		})
	const secondsInAMonth = 2628288

	if (!googleJWK) {
		const response: { keys: any[] } = (await fetch(
			'https://www.googleapis.com/robot/v1/metadata/jwk/securetoken@system.gserviceaccount.com'
		).then((response) => response.json())) || { keys: [] }

		const keys = response?.keys || []

		for (const key of keys) {
			const currentKid = key?.kid
			const value = JSON.stringify(key)

			if (currentKid && currentKid === kid) {
				JWT_KV.put(`kid:${currentKid}`, value, {
					metadata: { value },
					expirationTtl: secondsInAMonth, // TODO: set key to expire based on value of max-age in the Cache-Control header of the response - https://firebase.google.com/docs/auth/admin/verify-id-tokens#web
				})
				googleJWK = key
				return
			}
		}
	}

	return googleJWK
}

async function isValidJwtSignature(token, JWT_KV) {
	if (!token?.header?.kid) {
		return defaultResponse
	}

	const { kid } = token.header
	const { header, payload } = token.raw
	const encoder = new TextEncoder()
	const data = encoder.encode(`${header}.${payload}`)
	const signature = new Uint8Array(
		Array.from(token.signature).map((c: string) => c.charCodeAt(0))
	)

	const googleJWK = await getGoogleJWK(kid, JWT_KV)

	if (!googleJWK) {
		console.error('invalid kid')
		return defaultResponse
	}

	const key = await crypto.subtle.importKey(
		'jwk',
		googleJWK,
		{ name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
		false,
		['verify']
	)

	const valid = await crypto.subtle.verify(
		'RSASSA-PKCS1-v1_5',
		key,
		signature,
		data
	)

	return { valid, userId: token.payload.user_id }
}
