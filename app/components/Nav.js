import React from 'react'
import ThemeContext from '../contexts/theme'
import { NavLink } from 'react-router-dom'
import AuthContext from '../contexts/auth';

const activeStyle = {
  color: 'rgb(187, 46, 31)'
}


export default function Nav ({toggleTheme}) {
  const theme = React.useContext(ThemeContext);
  const token = React.useContext(AuthContext);
  if (!token) {
    return null;
  }
  return (
    <nav className='row space-between'>
      <ul className='row nav'>
        <li>
          <NavLink
            to='/'
            exact
            activeStyle={activeStyle}
            className='nav-link'>
              Popular
          </NavLink>
        </li>
        <li>
          <NavLink
            to='/battle'
            activeStyle={activeStyle}
            className='nav-link'>
              Battle
          </NavLink>
        </li>
      </ul>
      <button
        style={{fontSize: 30}}
        className='btn-clear'
        onClick={toggleTheme}
      >
        {theme === 'light' ? '🔦' : '💡'}
      </button>
    </nav>
  )
}