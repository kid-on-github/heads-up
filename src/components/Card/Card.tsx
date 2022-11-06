import { FunctionComponent } from 'react'
import styles from './Card.module.css'

const Card: FunctionComponent<{
	children?: JSX.Element | JSX.Element[]
	handleClose?: () => void
}> = ({ children, handleClose }) => {
	return (
		<div className={styles.Card}>
			{handleClose && (
				<button className={styles.CloseButton} onClick={handleClose}>
					<span className='material-symbols-outlined'>close</span>
				</button>
			)}
			{children}
		</div>
	)
}

const CardLabel: FunctionComponent<{
	children?: JSX.Element | JSX.Element[]
}> = ({ children }) => <div className={styles.CardLabel}>{children}</div>

const CardContent: FunctionComponent<{
	children?: JSX.Element | JSX.Element[]
}> = ({ children }) => <div className={styles.CardContent}>{children}</div>

export { Card, CardLabel, CardContent }
