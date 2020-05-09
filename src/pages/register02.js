import React, { useState, useEffect, useContext } from 'react'

import SessionContext from '../context/session'
import Search from '../components/search'
import Nav from '../components/nav'
import { faunaQueries } from '../fauna/query-manager'
import { toast } from 'react-toastify'
import { Masonry } from './../components/masonry'

// Components

const Profile = props => {
  const sessionContext = useContext(SessionContext)
  const { user } = sessionContext.state

  const [alias, setAlias] = useState(user ? user.alias : '')

  const [zip, setZip] = useState ((user && user.zip) ? user.zip : '')
  const [icon, setIcon] = useState ((user && user.icon) ? user.icon : '')

  const handleEditProfile = event => {
    console.log('editing profile', alias, zip)
    faunaQueries
      .updateUser(alias, zip, icon)
      .then(res => {
        toast.success('Profile updated')
      })
      .catch(err => {
        console.log(err)
        toast.error('Profile update failed')
      })
    event.preventDefault()
  }

  const handleChangeAlias = event => {
    setAlias(event.target.value)
  }


  const handleChangeIcon = event => {
    setIcon(event.target.value)
  }

  const handleChangeZip = event => {
    setZip(event.target.value)
  }


  // Just for debugging to get in quickly
  useEffect(() => {
    // For debugging, autologin to get in faster for testing, add a user and pword in the .env.local
  }, [])

  return (
    <React.Fragment>

<Masonry />

<h1 className="jim-slogan">Jim writes something funny here!</h1>
      




      <div className="form-wrapper">
        <h3 className="form-header">Sign up today</h3>
        <small>(or stay sad forever)</small>

        <form className="account-form form-with-button-checkboxes" onSubmit={handleEditProfile}>
          <div className="input-row">
            <label htmlFor="icon" className="input-row-column">
              icon
            </label>
            <input id="alias" className="input-row-column" value={icon} onChange={handleChangeIcon} type="text" />
          </div>
          <div className="input-row">
            <label htmlFor="alias" className="input-row-column">
              handle
            </label>
            <input id="alias" className="input-row-column" value={alias} onChange={handleChangeAlias} type="text" />
          </div>

          <div className="input-row">
            <label htmlFor="zip" className="input-row-column">
              zip (optional)
            </label>
            <input id="zip" className="input-row-column" value={zip} onChange={handleChangeZip} type="text" />
          </div>
          <div className="input-row align-right">
            <button className="button-cta"> Next </button>
          </div>



        </form></div>

      {/* {user ? <Search /> : null} */}
    </React.Fragment>
  )
}

export default Profile
