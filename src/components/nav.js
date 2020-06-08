import React, { useContext } from 'react'
import { toast } from 'react-toastify'
import { NavLink, Link, useLocation, useHistory } from 'react-router-dom'
import SessionContext from './../context/session'
import { faunaQueries } from '../fauna/query-manager'
import { isFunction } from '../fauna/helpers/util'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGrin, faHeart, faStar, faComment, faImages, faUser, faUserEdit, faComments  } from '@fortawesome/free-solid-svg-icons'

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


{/* <h5 key={index}><Link to={`/profile/${match.data.alias}`}>{match.data.alias}</Link></h5> */}

        <NavLink to={'/settings'} exact={true}>
          <FontAwesomeIcon icon={faUser} />
        </NavLink>
        <NavLink to='/memes'>
          <FontAwesomeIcon icon={faImages} />
        </NavLink>

        <NavLink to={'/matches'} exact={true}>
          <span className="oval">
            <span className="circle circle-dates">
              <FontAwesomeIcon icon={faHeart} />
            </span>
            <span className="circle circle-friends">
              <FontAwesomeIcon className="fa-flip-horizontal" icon={faStar} />
            </span>
          </span>
        </NavLink>


        <NavLink to='/profiles' exact={true}>
          <span className="oval">
            <span className="circle circle-dates">
              <FontAwesomeIcon icon={faComment} />
            </span>
            <span className="circle circle-friends">
              <FontAwesomeIcon className="fa-flip-horizontal" icon={faComment} />
            </span>
          </span>
        </NavLink>
        

      </nav>
    ) 
  } else {
    return(
      <nav>
        <NavLink className="logo" to='/' exact={true}>
          <FontAwesomeIcon icon={faGrin} />
        </NavLink>
        <Link className="button" to={linkInfo.link}>login</Link>
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