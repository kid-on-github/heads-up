import { useContext, useState } from 'react'
import styles from './AuthPage.module.css'
import { signIn, signInWithGoogle } from '../../firebase/firebase'
import { Navigate } from 'react-router-dom'
import { authContext } from '../AuthProvider/AuthProvider'
import { Card } from '../Card/Card'

export const AuthPage = () => {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')

	const auth = useContext(authContext)
	const authenticated = auth

	if (authenticated) {
		return <Navigate to='/events' replace />
	}

	return (
		<div className={styles.AuthPage}>
			<div className={styles.AuthPageContent}>
				<Card>
					<input
						type='email'
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>
					<input
						type='password'
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>

					<button onClick={() => signIn(email, password)}>Sign In</button>

					<button onClick={signInWithGoogle}>Sign in with Google</button>
				</Card>
			</div>
		</div>
	)
}
