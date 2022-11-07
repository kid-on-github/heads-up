import { useState, useEffect, createContext, useContext } from 'react'
import { auth } from '../../firebase/firebase'
import React from 'react'
import { authContext } from '../AuthProvider/AuthProvider'

type userType = {
	firstName: string
	birthday?: string
	email?: string
	emailVerified?: boolean
	phone?: string
	phoneVerified?: boolean
} | null

type userContextType = {
	user: userType
	updateUserState: (newState: userType) => void
}

export const userContext = createContext<userContextType>({
	user: null,
	updateUserState: () => {},
})

export const UserProvider: React.FunctionComponent<{
	children: React.ReactNode | React.ReactNode[]
}> = ({ children }) => {
	const [user, setUser] = useState<userType>(null)

	const updateUserState = (newState: userType) => {
		setUser(newState)
		// TODO: send new state to kv
	}

	const authState = useContext(authContext)

	const getUserState = async () => {
		if (authState) {
			const { uid, firebaseToken } = authState

			// TODO: get user data from kv
			// TODO: setUserState()
		} else {
			setUser(null)
		}
	}

	useEffect(() => {
		getUserState()
	}, [authState])

	useEffect(() => {
		auth.onIdTokenChanged(async () => {
			getUserState()
		})
	}, [])

	return (
		<userContext.Provider value={{ user: user, updateUserState }}>
			{' '}
			{children}{' '}
		</userContext.Provider>
	)
}
