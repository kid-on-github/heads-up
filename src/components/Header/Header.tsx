import { useContext } from 'react'
import { Link } from 'react-router-dom'
import { authContext } from '../AuthProvider/AuthProvider'
import { logOut, signInWithGoogle } from '../../firebase/firebase'
import { User as FirebaseUser } from 'firebase/auth'
import { useState } from 'react'
import styles from './Header.module.css'

export const Header = () => {
	const user = useContext(authContext)
	return (
		<div className={styles.Header}>
			<span className={styles.Logo}>
				<Link to='/'>Logo Here</Link>
			</span>
			{user ? (
				<UserDropdown user={user} />
			) : (
				<button className={styles.SignIn} onClick={signInWithGoogle}>
					Sign in with Google
				</button>
			)}
		</div>
	)
}

const UserDropdown: React.FunctionComponent<{ user: FirebaseUser }> = ({
	user,
}) => {
	const [dropdownVisible, setDropDownVisible] = useState(false)

	const toggleDropDownVisibility = () => {
		setDropDownVisible((curr) => !curr)
	}

	return (
		<div
			className={`${styles.DropdownWrapper} ${
				dropdownVisible && styles.dropdownVisible
			}`}
			onClick={toggleDropDownVisibility}
		>
			<div className={styles.DropdownLabel}>
				<p>{user.displayName}</p>
				<span
					className={`material-icons ${
						dropdownVisible && styles.dropdownArrowRotated
					}`}
				>
					expand_more
				</span>
			</div>
			<div className={styles.Dropdown}>
				<Link to='/events'>Events</Link>
				<button className={styles.SignOut} onClick={logOut}>
					sign out
				</button>
			</div>
		</div>
	)
}
