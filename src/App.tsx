import * as React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './components/AuthProvider/AuthProvider'
import { RequireAuth } from './components/AuthProvider/RequireAuth'
import { Header } from './components/Header/Header'
import { Events } from './components/Events/Events'
import { Home } from './components/Home/Home'
import { AuthPage } from './components/AuthPage/AuthPage'
import { Onboarding } from './components/Onboarding/Onboarding'
import { RequireUser } from './components/UserProvider/RequireUser'
import { UserProvider } from './components/UserProvider/UserProvider'

function App() {
	return (
		<React.StrictMode>
			<AuthProvider>
				<UserProvider>
					<BrowserRouter>
						<Header />
						<Routes>
							<Route path='/' element={<Home />} />
							<Route
								path='/events'
								element={
									<RequireUser>
										<Events />
									</RequireUser>
								}
							/>
							<Route path='/auth' element={<AuthPage />} />
							<Route
								path='/onboarding'
								element={
									<RequireAuth>
										<Onboarding />
									</RequireAuth>
								}
							/>
						</Routes>
					</BrowserRouter>
				</UserProvider>
			</AuthProvider>
		</React.StrictMode>
	)
}

export default App
