import React, { 
  // useEffect, useContext 
} from 'react'
// import SessionContext from '../context/session'
import { Link } from 'react-router-dom'
import { Masonry } from '../components/masonry'

// Components

const Matches = props => {
  // const sessionContext = useContext(SessionContext)

  // // Just for debugging to get in quickly
  // useEffect(() => {
  //   // For debugging, autologin to get in faster for testing, add a user and pword in the .env.local
  // }, [])

  return (
    <React.Fragment>

<Masonry />


      <div className="form-wrapper">
        <div className="form-header">
          <h1>Not enough users in your area</h1>
          <small>(sorry)</small>
        </div>
        <p>
        Grinnr is still in beta testing, but we will email you once we have a critical mass 
        of users in your area.</p>
        <p> You can accelerate this process by advertising for us on 
          your tinder profile.</p>
          {/* <p><strong>"Waiting for you on grinnr.com (no, not grindr)".</strong></p> */}
        <p>Meanwhile, start rating memes to improve your matches (don't worry--they will come).
        </p>
        <Link className="button-cta" to="/">Rate memes</Link>

     </div>

      {/* {user ? <Search /> : null} */}
    </React.Fragment>
  )
}

export default Matches
