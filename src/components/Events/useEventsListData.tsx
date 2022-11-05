import { useState } from 'react'

const useEventListData = () => {
	const [events, setEvents] = useState<Record<string, string>>({
		'1:1:0': 'Event 1',
	})

	const getNextKey = () => {
		const keys = Object.keys(events)
		const maxKey = keys.reduce(
			(max, key) => Math.max(max, Number(key.split(':')[2])),
			0
		)
		return maxKey + 1
	}

	const addEvent = () => {
		const key = `0:0:${getNextKey()}`
		setEvents({
			...events,
			[key]: '',
		})
	}

	const splitEventKey = (eventKey: string) => {
		const [month, day, key] = eventKey.split(':')
		return { month: Number(month), day: Number(day), key: Number(key) }
	}

	const updateEvent =
		(oldEventKey: string) =>
		(newEvent: { month: number; day: number; event: string }) => {
			const { month: oldMonth, day: oldDay } = splitEventKey(oldEventKey)
			const { month, day, event } = newEvent

			const dayChanged = oldDay !== day || oldMonth !== month
			const eventChanged = events[oldEventKey] !== event
			const eventKey = dayChanged
				? `${month}:${day}:${oldEventKey.split(':')[2]}`
				: oldEventKey

			setEvents((events: Record<string, string>) => {
				const newEvents = { ...events }

				if (dayChanged) {
					delete newEvents[oldEventKey]
					newEvents[eventKey] = event
				} else if (eventChanged) {
					newEvents[eventKey] = event
				}

				return newEvents
			})
		}

	const deleteEvent = (oldEventKey: string) => () => {
		setEvents((events) => {
			const newEvents = { ...events }
			delete newEvents[oldEventKey]

			return newEvents
		})
	}

	return { events, addEvent, updateEvent, deleteEvent }
}

export default useEventListData
