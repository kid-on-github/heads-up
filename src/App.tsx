import * as React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './components/AuthProvider/AuthProvider'
import { RequireAuth } from './components/AuthProvider/RequireAuth'
import { Header } from './components/Header/Header'
import { Profile } from './components/Profile/Profile'
import { Home } from './components/Home/Home'

function App() {
	return (
		<React.StrictMode>
			<AuthProvider>
				<BrowserRouter>
					<Header />
					<Routes>
						<Route path='/' element={<Home />} />
						<Route
							path='/profile'
							element={
								<RequireAuth>
									<Profile />
								</RequireAuth>
							}
						/>
					</Routes>
				</BrowserRouter>
			</AuthProvider>
		</React.StrictMode>
	)
}

export default App
