import React, { useState, useEffect, useContext } from 'react'

import SessionContext from './../context/session'
import { faunaQueries } from '../fauna/query-manager'
import { toast } from 'react-toastify'

import { Uploader } from '../components/uploader'
import Asset from '../components/asset'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons'

// Components
import {renderInputField} from './../components/input'

const Profile = props => {
  const sessionContext = useContext(SessionContext)
  const { user } = sessionContext.state
  //TODO (techdebt): change these to useState with an array at some point: https://daveceddia.com/usestate-hook-examples/
  const [wantMemes, setWantMemes] = useState ((user && user.wantMemes) ? user.wantMemes : '')
  const [wantFriends, setWantFriends] = useState ((user && user.wantFriends) ? user.wantFriends : '')
  const [wantDates, setWantDates] = useState ((user && user.wantDates) ? user.wantDates : '')
  //TODO (need to learn this): const [email, setEmail] = useState((user && user.wantDates) ? user.email : '')
  const [alias, setAlias] = useState(user ? user.alias : '')
  const [dob, setDob] = useState((user && user.zip) ? user.dob : '')
  const [zip, setZip] = useState ((user && user.zip) ? user.zip : '')
  const [asset01, setAsset01] = useState((user && user.asset01) ? user.asset01 : '')

  const handleEditProfile = event => {
    console.log('editing profile', 
    alias, dob, zip, wantMemes, wantFriends, wantDates, 
    asset01)
    // if (!asset01) {
    //   toast.warn('Please upload an image first :)')
    //   return
    // }
    faunaQueries
      .updateUser(
        alias, dob, zip, wantMemes, wantFriends, wantDates, 
        asset01)
      // .uploadMeme(asset01)
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

  const handleChangeAlias = event => {setAlias(event.target.value)}
  const handleChangeDob = event => {setDob(event.target.value)}
  const handleChangeZip = event => {setZip(event.target.value)}
  const handleChangeWantMemes = event => {setWantMemes(event.target.checked)}
  const handleChangeWantFriends = event => {setWantFriends(event.target.checked)}
  const handleChangeWantDates = event => {setWantDates(event.target.checked)}
  const handleChangeAssets = event => {setAsset01(event.target.value)}

  const generateUploadImage = () => {
    console.log("generateUploadImage", asset01)
    return <Uploader onPhotosUploaded={handleUploadPhoto}></Uploader>
  }
  const handleUploadPhoto = photoInfo => {
    setAsset01({ url: photoInfo.secure_url, type: photoInfo.resource_type, id: photoInfo.public_id 
    })
    console.log("handleUploadPhoto", asset01)
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
          
            
        <div className="uploadImageBox">
          {generateUploadImage()}
          {asset01 ? <Asset asset={asset01} onChange={handleChangeAssets}></Asset> : null}
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
            {renderInputField('screen name', alias, 'text', e => handleChangeAlias(e), 'alias')}
            {renderInputField('dob (you must be over 18 to view profiles)', dob, 'date', e => handleChangeDob(e), 'dob')}
            {renderInputField('zip code', zip, 'text', e => handleChangeZip(e), 'zip')}
            {/* {renderInputField('email', email, 'text', e => handleChangeEmail(e), 'email')} */}
            {/*{renderInputField('password', password, 'password', e => handleChangePassword(e), 'current-password')} */}

  
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
