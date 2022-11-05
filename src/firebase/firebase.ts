import { initializeApp } from 'firebase/app'
import { User as FirebaseUser } from 'firebase/auth'

import {
	getAuth,
	signInWithPopup,
	GoogleAuthProvider,
	signOut,
} from 'firebase/auth'
import { firebaseConfig } from './config'

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)

const provider = new GoogleAuthProvider()
provider.setCustomParameters({ prompt: 'select_account' })

export const signInWithGoogle = () =>
	signInWithPopup(auth, provider)
		.then((result) => {
			// This gives you a Google Access Token. You can use it to access the Google API.
			// const credential = GoogleAuthProvider.credentialFromResult(result);
			// const token = credential.accessToken;
			// The signed-in user info.
			const user: FirebaseUser = result.user
			localStorage.setItem('user', JSON.stringify(user))
			// ...
		})
		.catch((error) => {
			console.log('neat')
			// Handle Errors here.
			const errorCode = error.code
			const errorMessage = error.message
			console.log('err', errorCode, errorMessage)
			// The email of the user's account used.
			// const email = error.email;
			// The AuthCredential type that was used.
			// const credential = GoogleAuthProvider.credentialFromError(error);
			localStorage.setItem('user', '')
			// ...
		})

export const logOut = async () => {
	localStorage.setItem('user', '')
	return signOut(auth)
		.then(() => {
			return [true, undefined]
		})
		.catch((error) => {
			return [false, error]
		})
}
