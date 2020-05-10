import React, { useState, useEffect, useContext } from 'react'

import SessionContext from '../context/session'
import { faunaQueries } from '../fauna/query-manager'
import { toast } from 'react-toastify'
import { useHistory } from 'react-router-dom'

// Components

const RateMemes = props => {
  const history = useHistory();
  const sessionContext = useContext(SessionContext)
  const { user } = sessionContext.state
  const [meme01, setMeme01] = useState(user ? user.alias : '')
  const handleEditProfile = event => {
    console.log('saving ratings', meme01)
    faunaQueries
      .updateUser(meme01)
      .then(res => {
        toast.success('Ratings saved')
      })
      .catch(err => {
        console.log(err)
        toast.error('Rating save failed')
      })
    event.preventDefault()
  }

  const handleChangeMeme01 = event => {setMeme01(event.target.value)}

  // Just for debugging to get in quickly
  useEffect(() => {
    // For debugging, autologin to get in faster for testing, add a user and pword in the .env.local         
   //TODO: this is a really slow redirect, but it's slow on the home page too. write a conditional rendering instead
    // if (!user){
    //   history.push('/accounts/register')
    // }
  }, [])

  
  if (user){
    return (
      <React.Fragment>
        <div className="main-column">
          <div className="main-title">Profile</div>
  
          <form className="account-form form-with-button-checkboxes" onSubmit={handleEditProfile}>
            <div className="input-row">
              <label htmlFor="icon" className="input-row-column">
                icon
              </label>
              <input id="alias" className="input-row-column" value={meme01} onChange={handleChangeMeme01} type="text" />
            </div>

            <div className="input-row align-right">
              <button className="button-cta"> Update </button>
            </div>
          </form>
        </div>
      </React.Fragment>
    )
  } else {
    history.push('/accounts/register')
    return null;
  }
}

export default RateMemes
