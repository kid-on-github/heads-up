import { useState, useEffect, createContext, useContext } from 'react'
import { auth } from '../../firebase/firebase'
import React from 'react'
import { authContext } from '../AuthProvider/AuthProvider'
import { UserType } from '../../utils/constants'

type userContextType = {
	user: UserType | null
	updateUserState: (newState: UserType) => void
}

export const userContext = createContext<userContextType>({
	user: null,
	updateUserState: () => {},
})

export const UserProvider: React.FunctionComponent<{
	children: React.ReactNode | React.ReactNode[]
}> = ({ children }) => {
	const [user, setUser] = useState<UserType | null>(null)

	const updateUserState = (newState: UserType) => {
		setUser(newState)
		// TODO: send new state to kv
	}

	const authState = useContext(authContext)

	const getUserState = async () => {
		if (authState) {
			const { uid, firebaseToken } = authState
			// TODO: send firebaseToken in the following request
			const response = await fetch(`/api/${uid}/user`)
			const user = JSON.parse(await response.json())
			setUser(user)
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
