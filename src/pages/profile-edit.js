import React, { useState, useEffect, useContext } from 'react'
import { useParams } from 'react-router-dom'
import SessionContext from '../context/session'
import { faunaQueries } from '../fauna/query-manager'
import { toast } from 'react-toastify'


import { Uploader } from '../components/uploader'
import Asset from '../components/asset'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons'

// Components
import {renderInputField} from '../components/input'

const Profile = props => {
  const { authorAlias } = useParams()

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
  const [asset02, setAsset02] = useState((user && user.asset02) ? user.asset02 : '')
  const [asset03, setAsset03] = useState((user && user.asset03) ? user.asset03 : '')
  const [asset04, setAsset04] = useState((user && user.asset04) ? user.asset04 : '')
  const [asset05, setAsset05] = useState((user && user.asset05) ? user.asset05 : '')
  const [asset06, setAsset06] = useState((user && user.asset06) ? user.asset06 : '')

  const handleEditProfile = event => {
    // console.log('editing profile', 
    // alias, dob, zip, wantMemes, wantFriends, wantDates, 
    // asset01)
    // if (!asset01) {
    //   toast.warn('Please upload an image first :)')
    //   return
    // }
    faunaQueries
      .updateUser(
        alias, dob, zip, wantMemes, wantFriends, wantDates, 
        asset01, asset02, asset03, asset04, asset05, asset06)
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
 
  const handleChangeAlias = event => {setAlias(event.target.value)}
  const handleChangeDob = event => {setDob(event.target.value)}
  const handleChangeZip = event => {setZip(event.target.value)}
  const handleChangeWantMemes = event => {setWantMemes(event.target.checked)}
  const handleChangeWantFriends = event => {setWantFriends(event.target.checked)}
  const handleChangeWantDates = event => {setWantDates(event.target.checked)}
  const handleChangeAsset01 = event => {setAsset01(event.target.value)}
  const handleChangeAsset02 = event => {setAsset02(event.target.value)}
  const handleChangeAsset03 = event => {setAsset03(event.target.value)}
  const handleChangeAsset04 = event => {setAsset04(event.target.value)}
  const handleChangeAsset05 = event => {setAsset05(event.target.value)}
  const handleChangeAsset06 = event => {setAsset06(event.target.value)}

  const generateUploadImage01 = () => {return <Uploader onPhotosUploaded={handleUploadPhoto01}></Uploader>}
  const generateUploadImage02 = () => {return <Uploader onPhotosUploaded={handleUploadPhoto02}></Uploader>}
  const generateUploadImage03 = () => {return <Uploader onPhotosUploaded={handleUploadPhoto03}></Uploader>}
  const generateUploadImage04 = () => {return <Uploader onPhotosUploaded={handleUploadPhoto04}></Uploader>}
  const generateUploadImage05 = () => {return <Uploader onPhotosUploaded={handleUploadPhoto05}></Uploader>}
  const generateUploadImage06 = () => {return <Uploader onPhotosUploaded={handleUploadPhoto06}></Uploader>}

  const handleUploadPhoto01 = photoInfo => {setAsset01({ url: photoInfo.secure_url, type: photoInfo.resource_type, id: photoInfo.public_id})}
  const handleUploadPhoto02 = photoInfo => {setAsset02({ url: photoInfo.secure_url, type: photoInfo.resource_type, id: photoInfo.public_id})}
  const handleUploadPhoto03 = photoInfo => {setAsset03({ url: photoInfo.secure_url, type: photoInfo.resource_type, id: photoInfo.public_id})}
  const handleUploadPhoto04 = photoInfo => {setAsset04({ url: photoInfo.secure_url, type: photoInfo.resource_type, id: photoInfo.public_id})}
  const handleUploadPhoto05 = photoInfo => {setAsset05({ url: photoInfo.secure_url, type: photoInfo.resource_type, id: photoInfo.public_id})}
  const handleUploadPhoto06 = photoInfo => {setAsset06({ url: photoInfo.secure_url, type: photoInfo.resource_type, id: photoInfo.public_id})}
  

  // Just for debugging to get in quickly
  useEffect(() => {
    // console.log("res", memes_list)
    // For debugging, autologin to get in faster for testing, add a user and pword in the .env.local
  }, [
    // user, authorAlias
  ])

  return (
    <React.Fragment>
      <div className="form-header">
        <h1>Edit profile</h1>
        <small>(for additional support: help@grinnr.com)</small>
      </div>
      <div className="form-wrapper">
        <form className="account-form" onSubmit={handleEditProfile}>
          <div className="uploadAssets">
            <div className="uploadImageBox">{generateUploadImage01()}{asset01 ? <Asset asset={asset01} onChange={handleChangeAsset01}></Asset> : null}</div>
            <div className="uploadImageBox">{generateUploadImage02()}{asset02 ? <Asset asset={asset02} onChange={handleChangeAsset02}></Asset> : null}</div>
            <div className="uploadImageBox">{generateUploadImage03()}{asset03 ? <Asset asset={asset03} onChange={handleChangeAsset03}></Asset> : null}</div>
            <div className="uploadImageBox">{generateUploadImage04()}{asset04 ? <Asset asset={asset04} onChange={handleChangeAsset04}></Asset> : null}</div>
            <div className="uploadImageBox">{generateUploadImage05()}{asset05 ? <Asset asset={asset05} onChange={handleChangeAsset05}></Asset> : null}</div>
            <div className="uploadImageBox">{generateUploadImage06()}{asset06 ? <Asset asset={asset06} onChange={handleChangeAsset06}></Asset> : null}</div>
          </div>
          <div className="input-row">
              <label>why grinnr? (select all that apply)</label>
              <div className="button-checkboxes">
                <div className="input-group">
                  <input type="checkbox" id="memes" checked={wantMemes} onChange={handleChangeWantMemes} />
                  <label htmlFor="memes">memes</label>
                </div>
                <div className="input-group">
                  <input type="checkbox" id="friends" checked={wantFriends} onChange={handleChangeWantFriends} />
                  <label htmlFor="friends">friends</label>
                </div>
                <div className="input-group">
                  <input type="checkbox" id="dates" checked={wantDates} onChange={handleChangeWantDates} />
                  <label htmlFor="dates">dates</label>
                </div>
              </div>
            </div>
            {renderInputField('screen name', alias, 'text', e => handleChangeAlias(e), 'alias')}
            {renderInputField('dob (you must be over 18 to view profiles)', dob, 'date', e => handleChangeDob(e), 'dob')}
            {renderInputField('zip code', zip, 'text', e => handleChangeZip(e), 'zip')}
            {/* {renderInputField('email', email, 'text', e => handleChangeEmail(e), 'email')} */}
            {/*{renderInputField('password', password, 'password', e => handleChangePassword(e), 'current-password')} */}

  
            <div className="input-row align-right">
              <button className="button"> Update </button>
            </div>
          </form>
      </div>
    </React.Fragment>
  )
}

export default Profile
