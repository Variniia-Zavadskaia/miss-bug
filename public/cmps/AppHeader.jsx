const { useState, useEffect } = React
const { NavLink } = ReactRouterDOM
import { UserMsg } from './UserMsg.jsx'
import { showErrorMsg } from '../services/event-bus.service.js'

export function AppHeader() {
  return (
    <React.Fragment>
      <header className="flex align-center space-between">
        <img className="logo" src="assets/img/minilogo.jpeg" />
        <div className="nav-bar-container">
          <nav className="nav-bar">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/bug">Bugs</NavLink>
            <NavLink to="/about">About</NavLink>
          </nav>
        </div>
      </header>
      <UserMsg />
    </React.Fragment>
  )
}
