import React, { useState, useEffect, useContext } from 'react'

import SessionContext from './../context/session'
import Search from './../components/search'
import Nav from './../components/nav'
import { faunaQueries } from '../fauna/query-manager'
import { toast } from 'react-toastify'

// Components

const Profile = props => {
  const sessionContext = useContext(SessionContext)
  const { user } = sessionContext.state

  const [alias, setAlias] = useState(user ? user.alias : '')
  const [name, setName] = useState(user ? user.name : '')
  const [zip, setZip] = useState ((user && user.zip) ? user.zip : '')
  const [icon, setIcon] = useState ((user && user.icon) ? user.icon : '')
  const [wantMemes, setWantMemes] = useState ((user && user.wantMemes) ? user.wantMemes : '')
  const [wantFriends, setWantFriends] = useState ((user && user.wantFriends) ? user.wantFriends : '')
  const [wantDates, setWantDates] = useState ((user && user.wantDates) ? user.wantDates : '')

  const handleEditProfile = event => {
    console.log('editing profile', name, alias, zip)
    faunaQueries
      .updateUser(name, alias, zip, icon, wantMemes, wantFriends, wantDates)
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

  const handleChangeName = event => {
    setName(event.target.value)
  }

  const handleChangeIcon = event => {
    setIcon(event.target.value)
  }

  const handleChangeZip = event => {
    setZip(event.target.value)
  }

  const handleChangeWantMemes = event => {
    setWantMemes(event.target.checked)
  }

  const handleChangeWantFriends = event => {
    console.log(event.target.checked)
    setWantFriends(event.target.checked)
  }

  const handleChangeWantDates = event => {
    console.log(event.target.checked)
    setWantDates(event.target.checked)
  }

  // Just for debugging to get in quickly
  useEffect(() => {
    // For debugging, autologin to get in faster for testing, add a user and pword in the .env.local
  }, [])

  return (
    <React.Fragment>
    
      <div className="main-column">
        <div className="main-title">Profile</div>

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
            <label htmlFor="name" className="input-row-column">
              name
            </label>
            <input id="name" className="input-row-column" value={name} onChange={handleChangeName} type="text" />
          </div>


          <div className="input-row">
            <label>why grinnr? (select all that apply)</label>
            <div className="button-checkboxes">
              <input type="checkbox" id="memes" checked={wantMemes} onChange={handleChangeWantMemes} />
              <label htmlFor="memes">memes</label>
              <input type="checkbox" id="friends" checked={wantFriends} onChange={handleChangeWantFriends} />
              <label htmlFor="friends">friends</label>
              <input type="checkbox" id="dates" checked={wantDates} onChange={handleChangeWantDates} />
              <label htmlFor="dates">dates</label>
            </div>
          </div>



          <div className="input-row">
            <label htmlFor="zip" className="input-row-column">
              zip (optional)
            </label>
            <input id="zip" className="input-row-column" value={zip} onChange={handleChangeZip} type="text" />
          </div>

          <div className="input-row align-right">
            <button className="button-cta"> Update </button>
          </div>
        </form>
      </div>
      {user ? <Search /> : null}
    </React.Fragment>
  )
}

export default Profile
