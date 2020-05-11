import React, { useState, useEffect, useContext } from 'react'

import SessionContext from './../context/session'
import { faunaQueries } from '../fauna/query-manager'
import { toast } from 'react-toastify'

// Components
import {renderInputField} from './../components/input'

const Profile = props => {
  const sessionContext = useContext(SessionContext)
  const { user } = sessionContext.state
  const [wantMemes, setWantMemes] = useState ((user && user.wantMemes) ? user.wantMemes : '')
  const [wantFriends, setWantFriends] = useState ((user && user.wantFriends) ? user.wantFriends : '')
  const [wantDates, setWantDates] = useState ((user && user.wantDates) ? user.wantDates : '')
  // const [email, setEmail] = useState((user && user.wantDates) ? user.email : '')
  const [alias, setAlias] = useState(user ? user.alias : '')
  const [dob, setDob] = useState((user && user.zip) ? user.dob : '')
  const [zip, setZip] = useState ((user && user.zip) ? user.zip : '')

  //TODO: 
//  1. zeit or netlify?
//  2. help@grinnr.com
//  3. generic privacy policy, tos pages 
//  4. curate memes (jim will do)
//
  //BUGS:
  // 1. refresh user info after finishregistration function (whatever happens after updateuser) so that it appears 
  //    in the profile page without having to refresh/re-login
  //
  // NICE TO HAVE:
  // 1. add memes for moderation, to memes collection? should meme_ratings be restrctured? 
  //    Or keep it flat and rely on indexes? But then we will run into pagination issues, right? which way is easier?
  // 2. matches placeholder page
  //
  // NOT BLOCKER FOR LAUNCH *(can rely on help@grinnr.com)
  // 2. make email editable via profile (update account info when the user info gets updated)
  // 3. not a blocker for launch: password reset flow, make password editable
  // 4. not a blocker for launch: lambda to stay logged in
  console.log('viewing profile', "user: " + user, 
  // email, 
  alias, dob, zip, wantMemes, wantFriends, wantDates)

  const handleEditProfile = event => {
    console.log('editing profile', 
    // email, 
    alias, dob, zip, wantMemes, wantFriends, wantDates)
    faunaQueries
      .updateUser(
        // email, 
        alias, dob, zip, wantMemes, wantFriends, wantDates)
      .then(res => {
        toast.success('Profile updated')
        console.log(res)
      })
      .catch(err => {
        console.log(err)
        toast.error('Profile update failed')
      })
    event.preventDefault()
  }

  // const handleChangeEmail = event => {
  //   setEmail(event.target.value)
  // }

  const handleChangeAlias = event => {
    setAlias(event.target.value)
  }

  const handleChangeDob = event => {
    setDob(event.target.value)
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
      <div className="form-wrapper">
        <div className="form-header">
          <h1>Profile settings</h1>
          <small>(for additional support: help@grinnr.com)</small>
        </div>
        <form className="account-form" onSubmit={handleEditProfile}>
          
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
          {/* {renderInputField('email', email, 'text', e => handleChangeEmail(e), 'email')} */}
            {renderInputField('screen name', alias, 'text', e => handleChangeAlias(e), 'alias')}
            {renderInputField('dob (you must be over 18 to view profiles)', dob, 'date', e => handleChangeDob(e), 'dob')}
                {renderInputField('zip code', zip, 'text', e => handleChangeZip(e), 'zip')}
  {/* 
           
            {renderInputField('password', password, 'password', e => handleChangePassword(e), 'current-password')} */}

  
            <div className="input-row align-right">
              <button className="button-cta"> Update </button>
            </div>
          </form>
      </div>
      </div>
    </React.Fragment>
  )
}

export default Profile
