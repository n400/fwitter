import React from 'react'
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faImage } from '@fortawesome/free-solid-svg-icons'

const Uploader = props => {
  const widget = window.cloudinary.createUploadWidget(
  //Widget options: https://cloudinary.com/documentation/upload_widget#upload_widget_options
    {
      cloudName: process.env.REACT_APP_LOCAL___CLOUDINARY_CLOUDNAME,
      uploadPreset: process.env.REACT_APP_LOCAL___CLOUDINARY_TEMPLATE,
      maxFiles: 1,
      // cropping: true,
      // showSkipCropButton: false,
      folder: "profile-photos",
      maxFileSize: 300000,
      //allows tagging suggestions (good for NSFW, mean, etc, although that kind of defeats the purpose)
      //allows a lot of additional css options, like where to put te thumbnails, etc.
      styles: {
        palette: {
          window: '#E5E8EB',
          windowBorder: '#4A4A4A',
          tabIcon: '#000000',
          textDark: '#fff',
          textLight: '#FFFFFF',
          link: '#44c767',
          action: '#FF620C',
          inactiveTabIcon: '#4c5d73',
          error: '#F44235',
          inProgress: '#44c767',
          complete: '#20B832',
          sourceBg: '#fff'
        },
        fonts: {
          Roboto: 'https://fonts.googleapis.com/css?family=Roboto'
        }
      }
    },
    (error, result) => {
      if (!error && result && result.event === 'success') {
        props.onPhotosUploaded(result.info)
      } else if (error) {
        console.error(error)
      }
    }
  )

  const handleUploadClick = () => {
    widget.open()
  }

  return (
    <div>
      <FontAwesomeIcon icon={faImage} className="upload-photo" onClick={handleUploadClick}></FontAwesomeIcon>
    </div>
  )
}

Uploader.propTypes = {
  onPhotosUploaded: PropTypes.func
}

export { Uploader }
