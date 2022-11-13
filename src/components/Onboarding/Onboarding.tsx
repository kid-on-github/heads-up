import styles from './Onboarding.module.css'
import { useContext, useState } from 'react'
import { userContext } from '../UserProvider/UserProvider'
import { Navigate } from 'react-router-dom'
import { UserType } from '../../utils/constants'
import { authContext } from '../AuthProvider/AuthProvider'

export const Onboarding = () => {
	const { user, updateUserState } = useContext(userContext)
	const auth = useContext(authContext)
	const [firstNameState, setFirstNameState] = useState(user?.firstName || '')

	if (!user) {
		return null
	}

	const updateUserInfo = async (newUserData: UserType) => {
		const response = await fetch(`/api/${user?.uid}/user`, {
			method: 'PUT',
			headers: {
				Authorization: `Bearer ${auth?.firebaseToken}`,
			},
			body: JSON.stringify(newUserData),
		})

		if (response.status === 200) {
			updateUserState(newUserData)
		}
	}

	const { firstName, cellVerified, emailVerified } = user

	// TODO: require contact verification
	const userContactVerified = cellVerified || emailVerified || true
	const userIsOnboarded = firstName && userContactVerified

	if (userIsOnboarded) {
		return <Navigate to='/events' replace />
	}

	return (
		<div className={styles.Onboarding}>
			<div className={styles.OnboardingContent}>
				<h1>User Onboarding</h1>
				<input
					type='text'
					value={firstNameState}
					onChange={(e) => setFirstNameState(e.target.value)}
				/>
				<button
					onClick={() => updateUserInfo({ ...user, firstName: firstNameState })}
				>
					save
				</button>
			</div>
		</div>
	)
}
