import React, { useState,  useContext, useEffect } from 'react'

import SessionContext from '../context/session'
import { faunaQueries } from '../fauna/query-manager'
import { toast } from 'react-toastify'
import { useHistory } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGrimace, faMehRollingEyes, faMehBlank, faSmileWink, faGrinTears } from '@fortawesome/free-solid-svg-icons'

// Components

const RateMemes = props => {
  const history = useHistory();
  const sessionContext = useContext(SessionContext)
  const { user } = sessionContext.state
  let [meme_i, setmeme_i] = useState(1)

  const handleChangeRating = event => {
    console.log("handleChange", event.target.value)
    let memeRating = event.target.value
    handleSaveRating(meme_i, memeRating)
    setmeme_i(++meme_i)
  };

  const handleSaveRating = (meme_i, rating) => {
    console.log("handleSave", meme_i, rating)
    faunaQueries
      .saveRating(meme_i, rating)
      .then(res => { // toast.success('Rating saved')
      })
      .catch(err => {
        console.log(err)
        toast.error('Rating save failed')
      })
  }

  const renderMeme = () => {
      return (
        <React.Fragment>
        <div className="rate_meme_element">
          <img alt="" src={"/images/memes/jim/meme ("+meme_i+").jpg"} />
          <div className="meme-radios">
          <div className="button-radio">
              <label htmlFor={"hate_"+meme_i}><span role="img" aria-label="emoji"><FontAwesomeIcon icon={faGrimace} /></span></label>
              <input type="radio" id={"hate_"+meme_i} name={meme_i} 
              value="hate" onClick={handleChangeRating} />
            </div>
            <div className="button-radio">
              <label htmlFor={"dislike_"+meme_i}><span role="img" aria-label="emoji"><FontAwesomeIcon icon={faMehRollingEyes} /></span></label>
              <input type="radio" id={"dislike_"+meme_i} name={meme_i} 
              value="dislike" onClick={handleChangeRating} />
            </div>
            <div className="button-radio">
              <label htmlFor={"meh_"+meme_i}><span role="img" aria-label="emoji"><FontAwesomeIcon icon={faMehBlank} /></span></label>
              <input type="radio" id={"meh_"+meme_i} name={meme_i} 
              value="meh" onClick={handleChangeRating} />
            </div>
            <div className="button-radio">
              <label htmlFor={"like_"+meme_i}><span role="img" aria-label="emoji"><FontAwesomeIcon icon={faSmileWink} /></span></label>
              <input type="radio" id={"like_"+meme_i} name={meme_i} 
              value="like" onClick={handleChangeRating} />
            </div>
            <div className="button-radio">
              <label htmlFor={"love_"+meme_i}><span role="img" aria-label="emoji"><FontAwesomeIcon icon={faGrinTears} /></span></label>
              <input type="radio" id={"love_"+meme_i} name={meme_i} 
              value="love" onClick={handleChangeRating} />
            </div>
          </div>
      </div>  
    </React.Fragment>
      )
  }
  
  if (user){
    console.log("rendering")
    return (
      renderMeme()
    )
  } else {
    history.push('/accounts/register')
    return null;
  }
}

export default RateMemes
