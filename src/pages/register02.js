import React, { useState, useEffect, useContext } from 'react'
import SessionContext from '../context/session'
import { faunaQueries } from '../fauna/query-manager'
import { toast } from 'react-toastify'
import { Masonry } from './../components/masonry'

import { Uploader } from './../components/uploader'
import Asset from './../components/asset'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import { useHistory } from 'react-router-dom'

// Components
import {renderInputField} from './../components/input'


const Register02 = (props) => {
  
  const history = useHistory()
  const sessionContext = useContext(SessionContext)
  const { user } = sessionContext.state
  // const [asset, setAsset] = useState(null)
  const [dob, setDob] = useState(user ? user.dob : '')
  const [zip, setZip] = useState ((user && user.zip) ? user.zip : '')


  const handleEditProfile = (event) => {
    console.log('editing profile', dob, zip)

    // if (!asset) {
    //   toast.warn('Please upload an image first :)')
    //   return
    // }

    faunaQueries
      .finishRegistration(dob, zip)
      .then(res => {
        // if(history) 
        history.push('register03');
        toast.success('Profile updated')
      })
      .catch(err => {
        console.log(err)
        toast.error('Something went wrong. Please reload the page and log into your account.')
      })
    event.preventDefault()
  }
  const handleChangeDob = event => {
    setDob(event.target.value)
  }

  const handleChangeZip = event => {
    setZip(event.target.value)
  }

  // const generateUploadImage = () => {
  //   return <Uploader onPhotosUploaded={handleUploadPhoto}></Uploader>
  // }

  // const handleUploadPhoto = photoInfo => {
  //   setAsset({ url: photoInfo.secure_url, type: photoInfo.resource_type, id: photoInfo.public_id })
  // }
  // const handleChangeAsset = event => {
  //   setAsset(event.target.value)
  // }

  return (
    <React.Fragment>
      <Masonry />
      {/* <h1 className="jim-slogan">Jim writes something funny here!</h1> */}
      <div className="split-page-layout">
        <div className="main-left">
          <img 
          // onClick={setNextMeme}
          src="/images/memes/grinnr-is-01.jpg" alt="grinnr is a networking and dating app that analyzes your sense of humor to find people who share your sense of humor." />
        </div>
        <div className="main-right">
          <div className="form-wrapper">
            <div className="form-header">
              <h1>2 more questions</h1>
              <small>(you can do it)</small>
            </div>
            <form className="account-form form-with-button-checkboxes" onSubmit={handleEditProfile}>
              {/* {asset ? <Asset asset={asset} onChange={handleChangeAsset}></Asset> : null} */}
              {/* <div className="icon">{generateUploadImage()}</div> */}
              {renderInputField('dob (you must be over 18)', dob, 'date', e => handleChangeDob(e), 'dob')}
              {renderInputField('zip code', zip, 'text', e => handleChangeZip(e), 'zip')}
              <div className="input-row align-right">
                <button className="button-cta"> Next </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}

export default Register02
