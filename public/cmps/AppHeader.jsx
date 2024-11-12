const { useState } = React
const { Link, NavLink } = ReactRouterDOM
const { useNavigate } = ReactRouter

import { userService } from '../services/user.service.js'
import { showErrorMsg } from '../services/event-bus.service.js'

import { UserMsg } from './UserMsg.jsx'
import { LoginSignup } from './LoginSignup.jsx'

export function AppHeader() {
    const navigate = useNavigate()
    const [user, setUser] = useState(userService.getLoggedinUser())

	function onLogout() {
		userService.logout()
            .then(() => onSetUser(null))
            .catch(err => showErrorMsg('OOPs try again'))
	}

	function onSetUser(user) {
		setUser(user)
        navigate('/')
	}

    return (
        <React.Fragment>
            <header className="flex align-center space-between">
                <img className="logo" src="assets/img/minilogo.jpeg" />
                <section className="nav-bar-container">
                    <nav className="nav-bar">
                        <NavLink to="/">Home</NavLink>
                        <NavLink to="/bug">Bugs</NavLink>
                        <NavLink to="/about">About</NavLink>
                    </nav>
                </section>

                {user ? (
				<section className="nav-bar-container">
					<Link to={`/user/${user._id}`}>Hello {user.fullname}</Link>
					<button onClick={onLogout}>Logout</button>
				</section>
			) : (
				<section>
					<LoginSignup onSetUser={onSetUser} />
				</section>
			)}
            </header>
            <UserMsg />
        </React.Fragment>
    )
}
