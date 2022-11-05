import { FunctionComponent, useEffect, useRef } from 'react'
import styles from './TextArea.module.css'

// https://medium.com/@oherterich/creating-a-textarea-with-dynamic-height-using-react-and-typescript-5ed2d78d9848
// Owen Herterich
const useAutosizeTextArea = (
	textAreaRef: HTMLTextAreaElement | null,
	value: string
) => {
	useEffect(() => {
		if (textAreaRef) {
			textAreaRef.style.height = '0px'
			const scrollHeight = textAreaRef.scrollHeight
			textAreaRef.style.height = scrollHeight + 'px'
		}
	}, [textAreaRef, value])
}

const TextArea: FunctionComponent<{
	value: string
	setValue: (newValue: string) => void
}> = ({ value, setValue }) => {
	const textAreaRef = useRef<HTMLTextAreaElement>(null)

	useAutosizeTextArea(textAreaRef.current, value)

	return (
		<textarea
			className={styles.TextArea}
			onChange={(e) => setValue(e.target.value)}
			placeholder='Event'
			ref={textAreaRef}
			rows={1}
			value={value}
		/>
	)
}

export default TextArea
