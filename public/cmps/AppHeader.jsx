const { useState } = React
const { Link, NavLink } = ReactRouterDOM
const { useNavigate } = ReactRouter

import { userService } from '../services/user.service.js'
import { showErrorMsg } from '../services/event-bus.service.js'

import { UserMsg } from './UserMsg.jsx'
import { LoginSignup } from './LoginSignup.jsx'

export function AppHeader() {
    const navigate = useNavigate()
    const [user, setUser] = useState(userService.getLoggedInUser())

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
                <img onClick={() => navigate('/')} className="logo" src="assets/img/minilogo.jpeg" />

                {!user && <LoginSignup onSetUser={onSetUser} />}
                {user && (
                    <section className="nav-bar-container">
                        <nav className="nav-bar">
                            {/* <NavLink to="/">Home</NavLink> */}
                            <NavLink to="/bug">Bugs</NavLink>
                            {user && <NavLink to="/user">Profile</NavLink>}
                            {user && user.isAdmin && <NavLink to="/admin">Admin</NavLink>}
                            <NavLink to="/about">About</NavLink>
                        </nav>
                        <div>
                            <p>Hello {user.fullname}</p>
                            <button className="btn" onClick={onLogout}>
                                Logout
                            </button>
                        </div>
                    </section>
                )}
            </header>
            <UserMsg />
        </React.Fragment>
    )
}
