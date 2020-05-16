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
    // checkForMemeRating(user.email, meme_i)
  };

  const getUnratedMemes = () => {
    faunaQueries
      .getUnratedMemes()
      .then(res => {
        console.log(res.data[0].id)
      })
      .catch(err => {
        console.log(err)
        toast.error('failed')
      })
  }
//TODO: pass the result array to this outer function 
//to use it to declare meme_i, but remove the ==count and iterate through the list instead

  const handleSaveRating = (meme_i, rating) => {
    console.log("handleSave", meme_i, rating)
    console.log(user.email)
    faunaQueries
      .saveRating(meme_i, rating, user.email)
      .then(res => { // toast.success('Rating saved')
      })
      .catch(err => {
        console.log(err)
        toast.error('Rating save failed')
      })
  }

  const renderMeme = () => {    
    getUnratedMemes()
      return (
        <React.Fragment>
        <div className="rate_meme_element">
          <img className="meme_to_rate" alt="" src={"/images/memes/jim/meme ("+meme_i+").jpg"} />
          <div className="meme-radios">
          <div className="button-radio">
              <label htmlFor={"hate_"+meme_i}><img class="emoji" src="images/icons/meh-rolling-eyes-regular.svg"/></label>
              <input type="radio" id={"hate_"+meme_i} name={meme_i} 
              value="hate" onClick={handleChangeRating} />
            </div>
            <div className="button-radio">
              <label htmlFor={"dislike_"+meme_i}>
              <img class="emoji" src="images/icons/meh-rolling-eyes-regular.svg"/>
              </label>
              <input type="radio" id={"dislike_"+meme_i} name={meme_i} 
              value="dislike" onClick={handleChangeRating} />
            </div>
            <div className="button-radio">
              <label htmlFor={"meh_"+meme_i}><img class="emoji" src="images/icons/meh-rolling-eyes-regular.svg"/></label>
              <input type="radio" id={"meh_"+meme_i} name={meme_i} 
              value="meh" onClick={handleChangeRating} />
            </div>
            <div className="button-radio">
              <label htmlFor={"like_"+meme_i}>
              <img class="emoji" src="images/icons/meh-rolling-eyes-regular.svg"/></label>
              <input type="radio" id={"like_"+meme_i} name={meme_i} 
              value="like" onClick={handleChangeRating} />
            </div>
            <div className="button-radio">
              <label htmlFor={"love_"+meme_i}><img class="emoji" src="images/icons/meh-rolling-eyes-regular.svg"/></label>
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
