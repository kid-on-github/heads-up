import { useContext, useEffect, useState } from 'react'
import { splitEventKey } from '../../utils/utils'
import { authContext } from '../AuthProvider/AuthProvider'

const useEventListData = () => {
	const [events, setEvents] = useState<Record<string, string>>({})
	const auth = useContext(authContext)

	const APIGetEvents = async () => {
		const response = await fetch('/api/events', {
			headers: {
				Authorization: `Bearer ${auth?.firebaseToken}`,
			},
		})
		const data = await response.json()
		return data
	}

	const APIPutEvent = async (
		events: Record<string, Record<string, string>>
	) => {
		const response = await fetch('/api/events', {
			method: 'PUT',
			headers: {
				Authorization: `Bearer ${auth?.firebaseToken}`,
			},
			body: JSON.stringify(events),
		})
		return response
	}

	const APIDeleteEvent = async (eventKey: string) => {
		const response = await fetch('/api/events', {
			method: 'DELETE',
			headers: {
				Authorization: `Bearer ${auth?.firebaseToken}`,
			},
			body: JSON.stringify([eventKey]),
		})
		return response
	}

	useEffect(() => {
		APIGetEvents().then((data) => setEvents(data))
	}, [])

	const getNextKey = () => {
		const keys = Object.keys(events)
		const maxKey = keys.reduce(
			(max, key) => Math.max(max, Number(key.split(':')[2])),
			0
		)
		return maxKey + 1
	}

	const addEvent = async () => {
		const key = `0:0:${getNextKey()}`
		setEvents({
			...events,
			[key]: '',
		})
	}

	const updateEvent =
		(oldEventKey: string) =>
		(newEvent: { month: number; day: number; event: string }) => {
			const splitKey = splitEventKey(oldEventKey)

			if (!splitKey) return

			const { month: oldMonth, day: oldDay } = splitKey
			const { month, day, event } = newEvent

			const dayChanged = oldDay !== day || oldMonth !== month
			const eventKey = dayChanged
				? `${month}:${day}:${oldEventKey.split(':')[2]}`
				: oldEventKey

			setEvents((events: Record<string, string>) => {
				const newEvents = { ...events }

				if (dayChanged) {
					delete newEvents[oldEventKey]
				}

				newEvents[eventKey] = event
				APIPutEvent({ [oldEventKey]: { [eventKey]: event } })

				return newEvents
			})
		}

	const deleteEvent = (eventKey: string) => async () => {
		setEvents((events) => {
			const newEvents = { ...events }
			delete newEvents[eventKey]
			return newEvents
		})
		await APIDeleteEvent(eventKey)
	}

	return { events, addEvent, updateEvent, deleteEvent }
}

export default useEventListData
