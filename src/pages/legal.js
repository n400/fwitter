import React, { 
  // useEffect, useContext 
} from 'react'
// import SessionContext from '../context/session'
import { Link } from 'react-router-dom'

// Components

const Media = props => {
  // const sessionContext = useContext(SessionContext)

  // // Just for debugging to get in quickly
  // useEffect(() => {
  //   // For debugging, autologin to get in faster for testing, add a user and pword in the .env.local
  // }, [])

  return (
    <React.Fragment>
      <div className="form-wrapper">
        <div className="form-header">
          <h1>Legal stuff</h1>
        </div>
 <p>
        If you work for tinder and want us to tell people to stop advertising us on your app, contact our lawyers.</p>
        <p><a>Terms of use</a></p>
        <p><a>Privacy policy</a></p>
     </div>
    </React.Fragment>
  )
}

export default Media
