export const splitEventKey = (eventKey: string) => {
	const [month, day, key] = eventKey.split(':')

	if (month && day && key) {
		return { month: Number(month), day: Number(day), key: Number(key) }
	}

	return null
}
