import { signInWithEmailAndPassword, User } from 'firebase/auth'
import { createUserWithEmailAndPassword } from 'firebase/auth'

import { signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth'
import { firebaseConfig } from './config'

import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import 'firebase/compat/database'

firebase.initializeApp(firebaseConfig)

export const auth = firebase?.auth()

const provider = new GoogleAuthProvider()

// const errors = {
// 	'auth/invalid-email': 'Invalid Email',
// 	'auth/user-not-found': 'User not found',
// }

export const signInWithGoogle = () => signInWithPopup(auth, provider)
// .then((userCredential) => {})
// .catch((error) => {
// 	const { code, message } = error
// })

export const signUp = (email: string, password: string) =>
	createUserWithEmailAndPassword(auth, email, password)
// .then((userCredential) => {})
// .catch((error) => {
// 	const { code, message } = error
// })

export const signIn = async (email: string, password: string) =>
	await signInWithEmailAndPassword(auth, email, password)
		// .then((userCredential) => {})
		.catch(async (error) => {
			let { code /*, message*/ } = error

			if (code === 'auth/user-not-found') {
				// code = message = undefined
				const signUpResults = await signUp(email, password)
			}

			// console.log('code', code)
			// console.log('message', message)
		})

export const logOut = async () => {
	return signOut(auth)
		.then(() => {
			return [true, null]
		})
		.catch((error) => {
			return [false, error]
		})
}
