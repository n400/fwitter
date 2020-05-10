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
import { useHistory } from 'react-router-dom'

// Components

const Profile = (props) => {
  
  const history = useHistory()
  const sessionContext = useContext(SessionContext)
  const { user } = sessionContext.state
  const [asset, setAsset] = useState(null)
  const [alias, setAlias] = useState(user ? user.alias : '')
  const [zip, setZip] = useState ((user && user.zip) ? user.zip : '')


  const handleEditProfile = (event) => {
    console.log('editing profile', props, history, asset, alias, zip)

    // if (!asset) {
    //   toast.warn('Please upload an image first :)')
    //   return
    // }

    faunaQueries
      .updateUser(asset, alias, zip)
      .then(res => {
        // if(history) 
        history.push('register03');
        toast.success('Profile updated')
      })
      .catch(err => {
        console.log(err)
        toast.error('Profile update failed')
      })
    event.preventDefault()
  }







  const generateUploadImage = () => {
    return <Uploader onPhotosUploaded={handleUploadPhoto}></Uploader>
  }

  const handleUploadPhoto = photoInfo => {
    setAsset({ url: photoInfo.secure_url, type: photoInfo.resource_type, id: photoInfo.public_id })
  }











  const handleChangeAlias = event => {
    setAlias(event.target.value)
  }

  const handleChangeZip = event => {
    setZip(event.target.value)
  }

  const handleChangeAsset = event => {
    // setFweet(event.target.value)
    setAsset(event.target.value)
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

          {asset ? <Asset asset={asset} onChange={handleChangeAsset}></Asset> : null}
          <div className="icon">{generateUploadImage()}</div>

          <div className="input-row">
            <label htmlFor="dob" className="input-row-column">
              dob
            </label>
            <input id="dob" className="input-row-column" value={alias} onChange={handleChangeAlias} type="text" />
          </div>

          <div className="input-row">
            <label htmlFor="zip" className="input-row-column">
              zip code (optional)
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
