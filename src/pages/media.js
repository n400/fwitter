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
          <h1>Love for grinnr</h1>
        </div>
        <p>
        Here are some of the creative ways other users are helping get the word out.</p>
        <p><img src="/images/memes/jim/meme (1).jpg" /></p>
        <p><img src="/images/memes/jim/meme (3).jpg" /></p>
        <p>If you're looking for a real "about" page, email help@grinnr.com</p>
          {/* <p><strong>"Waiting for you on grinnr.com (no, not grindr)".</strong></p> */}
        <Link className="button-cta" to="/">Rate memes</Link>

     </div>

      {/* {user ? <Search /> : null} */}
    </React.Fragment>
  )
}

export default Media
