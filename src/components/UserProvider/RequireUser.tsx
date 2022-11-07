import { useContext } from 'react'
import { userContext } from './UserProvider'
import { Navigate } from 'react-router-dom'
import React from 'react'

export const RequireUser: React.FunctionComponent<{
	children: React.ReactNode
}> = ({ children }) => {
	const { user } = useContext(userContext)
	return <>{user ? children : <Navigate to='/onboarding' replace />}</>
}
