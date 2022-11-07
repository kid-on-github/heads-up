import { useContext } from 'react'
import { Link } from 'react-router-dom'
import { authContext } from '../AuthProvider/AuthProvider'
import { logOut } from '../../firebase/firebase'
import { useState } from 'react'
import styles from './Header.module.css'
import { userContext } from '../UserProvider/UserProvider'

export const Header = () => {
	const auth = useContext(authContext)
	return (
		<div className={styles.Header}>
			<span className={styles.Logo}>
				<Link to='/'>Logo Here</Link>
			</span>
			{auth ? (
				<UserDropdown />
			) : (
				<Link to={'/auth'} className={styles.SignIn}>
					Register / Sign In
				</Link>
			)}
		</div>
	)
}

const UserDropdown = () => {
	const [dropdownVisible, setDropDownVisible] = useState(false)

	const toggleDropDownVisibility = () => {
		setDropDownVisible((curr) => !curr)
	}

	const { user } = useContext(userContext)

	if (!user)
		return (
			<div
				className={`${styles.DropdownWrapper} ${
					dropdownVisible && styles.dropdownVisible
				}`}
				onClick={toggleDropDownVisibility}
			>
				<div className={styles.DropdownLabel}>
					<button className={styles.SignOut} onClick={logOut}>
						sign out
					</button>
				</div>
			</div>
		)

	return (
		<div
			className={`${styles.DropdownWrapper} ${
				dropdownVisible && styles.dropdownVisible
			}`}
			onClick={toggleDropDownVisibility}
		>
			<div className={styles.DropdownLabel}>
				<p>{user?.firstName}</p>
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
