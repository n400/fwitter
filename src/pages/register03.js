import React, { useState, useEffect, useContext } from 'react'
import PropTypes from 'prop-types'
import SessionContext from '../context/session'
import { faunaQueries } from '../fauna/query-manager'
import { toast } from 'react-toastify'
import { Masonry } from './../components/masonry'

import { Uploader } from './../components/uploader'
import Asset from './../components/asset'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons'

// Components

const Profile = props => {
  const sessionContext = useContext(SessionContext)
  const { user } = sessionContext.state
  const [asset, setAsset] = useState(null)
  const [alias, setAlias] = useState(user ? user.alias : '')
  const [zip, setZip] = useState ((user && user.zip) ? user.zip : '')


  // Just for debugging to get in quickly
  useEffect(() => {
    // For debugging, autologin to get in faster for testing, add a user and pword in the .env.local
  }, [])

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
