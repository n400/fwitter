import React, { useContext } from 'react'
import { toast } from 'react-toastify'
import { NavLink, Link, useLocation, useHistory } from 'react-router-dom'
import SessionContext from './../context/session'
import { faunaQueries } from '../fauna/query-manager'
import { isFunction } from '../fauna/helpers/util'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGrin, faGrinHeart, faUser, faUserEdit, faComments, faSignOutAlt } from '@fortawesome/free-solid-svg-icons'

function SignupOrLoginOrLogout(sessionContext) {
  const { user } = sessionContext.state
  const location = useLocation();
  const linkInfo = (location.pathname === "/accounts/login")
  ? { linkText: 'signup', link: '/accounts/register' }
  : { linkText: 'login', link: '/accounts/login' }
  if (user) {
    return renderLink({ handleClick: handleLogout, label: 'logout' }, sessionContext)
  } else {
    return  <li key=''><Link className="button" to={linkInfo.link}> {linkInfo.linkText}</Link></li>
  }
}

const renderProtectedLink = (sessionContext, linkData) => {
  if (sessionContext.state && sessionContext.state.user) {
    return renderLink(linkData, sessionContext)
  } else {
    return null
  }
}

const handleLogout = (event, sessionContext) => {
  return faunaQueries.logout().then(() => {
    toast.success('Logged out')
    sessionContext.dispatch({ type: 'logout', data: null })
    event.preventDefault()
  })
}
const links = [
  // renderLogo,
  // s => renderProtectedLink(s, { href: '/', label: 'grinnr' }),
  // Who knows, these features might be next.
  // s => renderProtectedLink(s, { href: '/', label: 'Memes' }),
  // s => renderProtectedLink(s, { href: '/', label: 'faPaperPlane' }),
  // s => renderProtectedLink(s, { href: '/', label: 'Profile' }),
  // <FontAwesomeIcon icon={faPaperPlane} />
  // s => renderProtectedLink(s, { href: '/topics', label: 'Topics' }),
  // s => renderProtectedLink(s, { href: '/messages', label: 'Messages' }),
  s => renderProtectedLink(s, { href: '/', label: 'memes' }),
  s => renderProtectedLink(s, { href: '/matches', label: 'matches' }),
  s => renderProtectedLink(s, { href: '/profile-edit', label: 'profile' }),
  SignupOrLoginOrLogout
  // ,renderLoginLink
]

const renderLink = ( link, sessionContext ) => {
  if (link.handleClick) {
    return (
      <li onClick={event => handleLogout(event, sessionContext)} key={`nav-link-${link.label}`}>
        <Link to={link.href}>{link.label}</Link>
      </li>
    )
  } else {
    return (
      <li key={`nav-link-${link.href}-${link.label}`}>
        <NavLink className="navlink" key={'link_' + link.label} to={link.href} exact={true}>
          {link.label}
        </NavLink>
      </li>
    )
  }
}

const NavMobile = () => {
  const sessionContext = useContext(SessionContext)
  const { user } = sessionContext.state
  const location = useLocation();

  const linkInfo = (location.pathname === "/accounts/login")
  ? { linkText: 'signup', link: '/accounts/register' }
  : { linkText: 'login', link: '/accounts/login' }
  if (user) {
    return (
      <nav>
        <NavLink to='/profile-edit/summer' exact={true}>
          <FontAwesomeIcon icon={faUserEdit} />
        </NavLink>
        <NavLink to='/profile' exact={true}>
          <FontAwesomeIcon icon={faUser} />
        </NavLink>
        <Link to="/profiles">Profiles</Link>
        <NavLink to='/' exact={true}>
          <FontAwesomeIcon icon={faGrin} />
        </NavLink>
        <NavLink to='/matches' exact={true}>
          <FontAwesomeIcon icon={faComments} />
        </NavLink>
        

      </nav>
    ) 
  } else {
    return(
      <nav>
        <NavLink className="logo" to='/' exact={true}>
          <FontAwesomeIcon icon={faGrin} />
        </NavLink>
        <Link className="button" to={linkInfo.link}> {linkInfo.linkText}</Link>
      </nav>
    )
  }


}
const Nav = () => {
  const sessionContext = useContext(SessionContext)
  return (
    <nav>
      <NavLink className="logo" to='/' exact={true}>
        {/* <i aria-hidden="true" className="home  icon" ></i> */}
        grinnr
      </NavLink>
      <ul>
        {links.map(link => {
          if (isFunction(link)) {
            return link(sessionContext)
          } else {
            return null
          }
        })}
      </ul>
    </nav>
  )
}

export { NavMobile, Nav }