import styles from './Onboarding.module.css'
// import { authContext } from '../AuthProvider/AuthProvider'
import { useContext, useState } from 'react'
import { userContext } from '../UserProvider/UserProvider'
import { Navigate } from 'react-router-dom'

export const Onboarding = () => {
	const { user, updateUserState } = useContext(userContext)

	const [firstName, setFirstName] = useState(user?.firstName || '')

	if (user) {
		return <Navigate to='/events' replace />
	}

	return (
		<div className={styles.Onboarding}>
			<div className={styles.OnboardingContent}>
				<h1>User Onboarding</h1>
				<input
					type='text'
					value={firstName}
					onChange={(e) => setFirstName(e.target.value)}
				/>
				<button onClick={() => updateUserState({ firstName })}>save</button>
			</div>
		</div>
	)
}
