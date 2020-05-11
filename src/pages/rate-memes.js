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
  const [meme, setMeme] = useState({
    url: 1,
    rating: '' 
  });
 
  console.log("load", meme.url, meme.rating)

  const handleChangeRating = event => {
    console.log("handleChange", "etv " + event.target.dataset.emoji, meme)
      setMeme({
        ...meme,
        // [event.target.name]: event.target.value
        url: event.target.name,
        rating: event.target.dataset.emoji
      });

      handleSaveRating(meme)  
    };

  const handleSaveRating = (meme) => {
    console.log("handleSave", meme.url, meme.rating)
    faunaQueries
      .saveRating(meme.url, meme.rating)
      .then(res => { // toast.success('Rating saved')
        // nextMeme()
        // setmeme.url(++meme.url)
        // setMemeRating('')
      })
      .catch(err => {
        console.log(err)
        toast.error('Rating save failed')
      })
    // event.preventDefault()
  }

  let nextMeme = () => {
    // setmeme.url(++meme.url)
    // setMemeRating('')
    // event.preventDefault()
  }

  const renderMeme = () => {
      return (
        <React.Fragment>
        <div className="rate_meme_element">
          <img alt="" src={"/images/memes/jim/meme ("+meme.url+").jpg"} />
          <div className="meme-radios">
            <div className="button-radio">
              <input type="radio" id={"hate_"+meme.url} name={meme.url} value={meme.rating} data-emoji="grimace" onChange={handleChangeRating} />
              <label htmlFor={"hate_"+meme.url}><span role="img" aria-label="emoji"><FontAwesomeIcon icon={faGrimace} /></span></label>
            </div>
            <div className="button-radio">
              <input type="radio" id={"dislike_"+meme.url} name={meme.url} value="dislike" onChange={handleChangeRating} />
              <label htmlFor={"dislike_"+meme.url}><span role="img" aria-label="emoji"><FontAwesomeIcon icon={faMehRollingEyes} /></span></label>
            </div>
            <div className="button-radio">
              <input type="radio" id={"neutral_"+meme.url} name={meme.url} value="neutral" onChange={handleChangeRating} />
              <label htmlFor={"neutral_"+meme.url}><span role="img" aria-label="emoji"><FontAwesomeIcon icon={faMehBlank} /></span></label>
            </div>
            <div className="button-radio">
              <input type="radio" id={"like_"+meme.url} name={meme.url} value="like" onChange={handleChangeRating} />
              <label htmlFor={"like_"+meme.url}><span role="img" aria-label="emoji"><FontAwesomeIcon icon={faSmileWink} /></span></label>
            </div>
            <div className="button-radio">
              <input type="radio" id={"love_"+meme.url} name={meme.url} value="love" onChange={handleChangeRating} />
              <label htmlFor={"love_"+meme.url}><span role="img" aria-label="emoji"><FontAwesomeIcon icon={faGrinTears} /></span></label>
            </div>
          </div>
      </div>  
    </React.Fragment>
      )
  }
  
  if (user){
    return (
      renderMeme(meme.url, meme.rating)
    )
  } else {
    history.push('/accounts/register')
    return null;
  }
}

export default RateMemes
