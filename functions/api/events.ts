import { splitEventKey } from '../../src/utils/utils'
import { months } from '../../src/utils/constants'
import { OK, Unauthorized } from '../../function_utilities/StandardResponses'
import verifyJWT from '../../function_utilities/verifyJWT'

export async function onRequestGet({ request, env }) {
	const { JWT_KV } = env

	let { valid } = await verifyJWT(request, JWT_KV)
	if (!valid) {
		return Unauthorized
	}

	const { keys } = await env.Events.list({ prefix: '' })
	const events = {}

	if (keys.length > 0) {
		await Promise.all(
			keys.map(async ({ name: key }): Promise<void> => {
				const value = await env.Events.get(`${key}`)
				events[key] = value
			})
		)
	}

	return new Response(JSON.stringify(events), { status: 200 })
}

const eventKeyIsValid = (eventKey: string) => {
	const splitKey = splitEventKey(eventKey)

	if (!splitKey) {
		return false
	}

	const { month, day, key } = splitKey

	if (isNaN(month) || isNaN(day) || isNaN(key)) {
		return false
	}

	if (key < 0) {
		return false
	}

	if (month < 0 || month > 12) {
		return false
	}

	const numberOfDaysInMonth = months[Object.keys(months)[month - 1]]

	if (day < 0 || day > numberOfDaysInMonth) {
		return false
	}

	return true
}

export async function onRequestPut({ request, env }) {
	const { JWT_KV } = env

	let { valid } = await verifyJWT(request, JWT_KV)
	if (!valid) {
		return Unauthorized
	}

	const updatedEvents = await request.json()

	const errors = []

	Object.entries(updatedEvents ?? {}).forEach(async ([oldKey, value]) => {
		if (Object.keys(value).length === 1) {
			const newKey = Object.keys(value)[0]
			const newEvent = value[newKey]

			if (eventKeyIsValid(oldKey) && eventKeyIsValid(newKey)) {
				const dayChanged = oldKey !== newKey
				if (dayChanged) {
					await env.Events.delete(oldKey)
				}
				await env.Events.put(newKey, newEvent)
			} else {
				errors.push('Invalid event key')
			}
		}
	})

	if (errors.length > 0) {
		return new Response(JSON.stringify(errors), { status: 400 })
	}

	return OK
}

export async function onRequestDelete({ request, env }) {
	const { JWT_KV } = env

	let { valid } = await verifyJWT(request, JWT_KV)
	if (!valid) {
		return Unauthorized
	}

	const eventsToDelete = await request.json()
	const errors = []

	if (!eventsToDelete || eventsToDelete.length === 0) {
		return new Response('Bad Request', { status: 400 })
	}

	eventsToDelete.forEach(async (eventKey) => {
		if (eventKeyIsValid(eventKey)) {
			await env.Events.delete(eventKey)
		} else {
			errors.push('Invalid event key')
		}
	})

	if (errors.length > 0) {
		return new Response(JSON.stringify(errors), { status: 400 })
	}

	return OK
}
