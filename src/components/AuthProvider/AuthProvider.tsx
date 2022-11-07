import { useState, useEffect, createContext } from 'react'
import { auth } from '../../firebase/firebase'
import React from 'react'

type authContextType = { uid: string; firebaseToken: string } | null

export const authContext = createContext<authContextType>(null)

export const AuthProvider: React.FunctionComponent<{
	children: React.ReactNode | React.ReactNode[]
}> = ({ children }) => {
	const [authState, setAuthState] = useState<authContextType>(null)

	useEffect(() => {
		auth.onIdTokenChanged(async (user) => {
			if (user) {
				const { uid } = user
				const firebaseToken = await user.getIdToken()
				setAuthState({ uid, firebaseToken })
			} else {
				setAuthState(null)
			}
		})
	}, [])

	return (
		<authContext.Provider value={authState}> {children} </authContext.Provider>
	)
}
