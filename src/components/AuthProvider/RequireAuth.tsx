import { useContext } from 'react'
import { authContext } from './AuthProvider'
import { Navigate } from 'react-router-dom'
import React from 'react'

export const RequireAuth: React.FunctionComponent<{
	children: React.ReactNode
}> = ({ children }) => {
	let user = useContext(authContext)
	return <>{user ? children : <Navigate to='/' replace />}</>
}
