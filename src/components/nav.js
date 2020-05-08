import React, { useContext } from 'react'
import { toast } from 'react-toastify'
import { Link, useLocation } from 'react-router-dom'
import SessionContext from './../context/session'
import { faunaQueries } from '../fauna/query-manager'
import { isFunction } from '../fauna/helpers/util'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faPaperPlane } from '@fortawesome/free-solid-svg-icons'

// const renderLogo = sessionContext => {
//   return (
//     <li><Link className="logo" to='/'>grinnr</Link></li>
//     // <div className="fauna-logo">
//     //   <Link className="logo-container" to="/">
//     //     <img alt="Fauna logo" src="/images/logo-fauna-white.svg" />
//     //   </Link>
//     // </div>
//   )
// }

function SignupOrLoginOrLogout(sessionContext) {
  const { user } = sessionContext.state
  const location = useLocation();
  const linkInfo = (location.pathname === "/accounts/login")
  ? { linkText: 'signup', link: 'register' }
  : { linkText: 'login', link: 'login' }
  if (user) {
    return renderLink({ handleClick: handleLogout, label: 'Logout' }, sessionContext)
  } else {
    return  <li><Link className="button" to={linkInfo.link}> {linkInfo.linkText}</Link></li>
  }
}

// const renderProtectedLink = (sessionContext, linkData) => {
//   if (sessionContext.state && sessionContext.state.user) {
//     return renderLink(linkData, sessionContext)
//   } else {
//     return null
//   }
// }

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
  SignupOrLoginOrLogout
]

const renderLink = (
  link, sessionContext, 
  // props
  ) => {
  if (link.handleClick) {
    return (
      <li onClick={event => handleLogout(event, sessionContext)} key={`nav-link-${link.label}`}>
        <Link to={link.href}>{link.label}</Link>
      </li>
    )
  } else {
    return (
      <li key={`nav-link-${link.href}-${link.label}`}>
        <Link to={link.href}>{link.label}</Link>
      </li>
    )
  }
}

const Nav = () => {
  const sessionContext = useContext(SessionContext)
  return (
    <nav>
      <Link className="logo" to='/'>grinnr</Link>
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

export default Nav