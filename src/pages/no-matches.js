import React, { 
  // useEffect, useContext 
} from 'react'
// import SessionContext from '../context/session'
import { Link } from 'react-router-dom'

// Components

const Matches = props => {
  // const sessionContext = useContext(SessionContext)

  // // Just for debugging to get in quickly
  // useEffect(() => {
  //   // For debugging, autologin to get in faster for testing, add a user and pword in the .env.local
  // }, [])

  return (
    <React.Fragment>
      <div className="form-wrapper">
        <div className="form-header">
          <h1>Not enough users in your area</h1>
          <small>(sorry)</small>
        </div>
        <p>
        Grinnr is still in beta testing. We will email you once we have a critical mass 
        of users in your area.</p>
        <p> To accelerate this process, complete your <Link to="/profile">profile</Link>, rate <Link to="/">memes</Link> to improve match accuracy, and <Link to="/media">advertise grinnr on 
          your tinder profile.</Link></p>
          {/* <p><strong>"Waiting for you on grinnr.com (no, not grindr)".</strong></p> */}
        <Link className="button" to="/">Rate memes</Link>

     </div>

      {/* {user ? <Search /> : null} */}
    </React.Fragment>
  )
}

export default Matches
