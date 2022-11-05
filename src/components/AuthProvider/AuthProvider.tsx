import { useState, useEffect, createContext } from 'react'
import { auth } from '../../firebase/firebase'
import React from 'react'
import { User as FirebaseUser } from 'firebase/auth'

//FirebaseUser
export const authContext = createContext<FirebaseUser | null>(null)

export const AuthProvider: React.FunctionComponent<{
	children: React.ReactNode
}> = ({ children }) => {
	const getUserFromLocalStorage = () => {
		const user = localStorage.getItem('user')
		return user ? JSON.parse(user) : {}
	}

	const [userState, setUserState] = useState(() => getUserFromLocalStorage())

	useEffect(() => {
		auth.onIdTokenChanged((user) => {
			localStorage.setItem('user', JSON.stringify(user))
			setUserState(user ? user : null)
		})
	}, [])

	return (
		<authContext.Provider value={userState}> {children} </authContext.Provider>
	)
}
