import React, { useState, useContext } from 'react'
import PropTypes from 'prop-types'
import SessionContext from '../context/session'
import { Uploader } from '../components/uploader'
import Asset from '../components/asset'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import { toast } from 'react-toastify'

const Fweeter = props => {
  const [fweet, setFweet] = useState('')
  const [asset, setAsset] = useState(null)

  const sessionContext = useContext(SessionContext)
  const { user } = sessionContext.state

  const handleChangeCaption = event => {
    setFweet(event.target.value)
  }

  const handleChangeAsset = event => {
    // setFweet(event.target.value)
    setAsset(event.target.value)
  }

  const handleSubmit = event => {
    event.preventDefault()

    if (!asset) {
      toast.warn('Please upload an image first :)')
      return
    }

    props.handleCreateFweet(fweet, asset).then(e => {
      setFweet('')
      setAsset(null)
    })
    return false
  }


  const generateUploadImage = () => {
    return <Uploader onPhotosUploaded={handleUploadPhoto}></Uploader>
  }

  const handleUploadPhoto = photoInfo => {
    setAsset({ url: photoInfo.secure_url, type: photoInfo.resource_type, id: photoInfo.public_id })
  }

  return (
    <div className="fweeter">
    
      <div className="fweet-card">
        <div className="avatar">
          <img className="avatar-image" src={`/images/${user.icon}.png`} alt="profile" />
        </div>
        <form className="fweet-card-text-container" onSubmit={handleSubmit}>
          <input
            className="fweet-input-field"
            type="text"
            id="fname"
            name="fname"
            placeholder="What's on your mind?"
            value={fweet}
            onChange={handleChangeCaption}
          />
        </form>
      </div>
      {asset ? <Asset asset={asset} onChange={handleChangeAsset}></Asset> : null}
      <div className="fweet-card-actions">
        <div className="icon">{generateUploadImage()}</div>
        <button className="icon" onClick={handleSubmit}>
          <FontAwesomeIcon icon={faPaperPlane} />
        </button>
      </div>
    </div>
  )
}

Fweeter.propTypes = {
  handleCreateFweet: PropTypes.func
}

export default Fweeter