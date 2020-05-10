import React, { 
  // useEffect, useContext 
} from 'react'
// import SessionContext from '../context/session'
import { Masonry } from './../components/masonry'

// Components

const Profile = props => {
  // const sessionContext = useContext(SessionContext)

  // // Just for debugging to get in quickly
  // useEffect(() => {
  //   // For debugging, autologin to get in faster for testing, add a user and pword in the .env.local
  // }, [])

  return (
    <React.Fragment>

<Masonry />


      <div className="form-wrapper">
        <h3 className="form-header">You've been added to our waitlist</h3>
        <small>(i'm sorry)</small>

        <p>
        We will contact you as soon as we 
      have a critical mass of users in your area. 
        </p>
     </div>

      {/* {user ? <Search /> : null} */}
    </React.Fragment>
  )
}

export default Profile
