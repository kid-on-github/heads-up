import { FunctionComponent } from 'react'
import styles from './Events.module.css'
import { Card, CardContent, CardLabel } from '../Card/Card'
import TextArea from '../TextArea/TextArea'
import useEventListData from './useEventsListData'
import { months } from '../../utils/constants'

export const Events = () => (
	<div className={styles.Events}>
		<div className={styles.EventsContent}>
			<EventList />
		</div>
	</div>
)

const EventList = () => {
	const { events, addEvent, updateEvent, deleteEvent } = useEventListData()

	const eventsSortedByKey = Object.entries(events).sort(([a], [b]) => {
		return Number(a.split(':')[2]) - Number(b.split(':')[2])
	})

	return (
		<div className={styles.EventList}>
			{eventsSortedByKey.map(([eventKey, event]) => {
				const [month, day, key] = eventKey.split(':')
				return (
					<EventCard
						month={Number(month)}
						day={Number(day)}
						event={event}
						updateEvent={updateEvent(eventKey)}
						deleteEvent={deleteEvent(eventKey)}
						key={key}
					/>
				)
			})}

			<button className={styles.StyledButton} onClick={addEvent}>
				add event
			</button>
		</div>
	)
}

const EventCard: FunctionComponent<{
	month: number
	day: number
	event: string
	updateEvent: (newEvent: { month: number; day: number; event: string }) => void
	deleteEvent: () => void
}> = ({ month, day, event, updateEvent, deleteEvent }) => {
	return (
		<Card handleClose={deleteEvent}>
			<CardLabel>
				<DaySelector
					{...{ month, day }}
					setDate={({ day, month }: { day: number; month: number }) =>
						updateEvent({ month, day, event })
					}
				/>
			</CardLabel>
			<CardContent>
				<TextArea
					value={event}
					setValue={(event) => updateEvent({ month, day, event })}
				/>
			</CardContent>
		</Card>
	)
}

const DaySelector: FunctionComponent<{
	month: number
	day: number
	setDate: ({ day, month }: { day: number; month: number }) => void
}> = ({ month, day, setDate }) => {
	const emptyArrayOfMonthLength = Array.from(
		Array(months[Object.keys(months)[month - 1]] ?? 0).keys()
	)

	return (
		<div className={styles.DaySelector}>
			<select
				value={month ?? 'month'}
				onChange={(e) => setDate({ day, month: Number(e.target.value) })}
			>
				<option disabled hidden value={0}>
					month
				</option>
				{Object.keys(months).map((month, index) => (
					<option value={index + 1} key={index}>
						{month}
					</option>
				))}
			</select>
			<select
				value={day !== undefined && day === 0 ? 'day' : day}
				disabled={month === 0}
				onChange={(e) => setDate({ day: Number(e.target.value), month })}
			>
				<option disabled hidden>
					day
				</option>
				{emptyArrayOfMonthLength.map((index) => (
					<option value={index + 1} key={index}>
						{index + 1}
					</option>
				))}
			</select>
		</div>
	)
}
