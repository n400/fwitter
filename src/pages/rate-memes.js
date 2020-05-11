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
  // const [meme, setState] = useState({
  //   url: 1,
  //   rating: '' 
  // });

  ///---///
  let [meme_i, setmeme_i] = useState(1)
  let memeRating = ''  
  console.log("load", meme_i, memeRating)
  ///---///
 
  // console.log("load", meme)

  const handleChangeRating = event => {
    console.log("handleChange", event.target.value)

    ///---///
    let memeRating = event.target.value
    handleSaveRating(meme_i, memeRating)
    ///---///


    // setMeme(event.target.dataset.emoji)
    //   // setMeme(
    //   //   // ...meme,
    //   //   { url: event.target.name,
    //   //     rating: event.target.dataset.emoji})
    //   console.log(meme)
    //   handleSaveRating(meme)  
    };

  const handleSaveRating = (url, rating) => {
    console.log("handleSave", url, rating)
    faunaQueries
      .saveRating(url, rating)
      .then(res => { // toast.success('Rating saved')
// ++url
      })
      .catch(err => {
        console.log(err)
        toast.error('Rating save failed')
      })
    // event.preventDefault()
  }

  useEffect((meme_i) => {
    let memeRating = ""
    console.log("useEffect", meme_i, memeRating)
  }, [])


  const renderMeme = () => {
      return (
        <React.Fragment>
        <div className="rate_meme_element">
          <img alt="" src={"/images/memes/jim/meme ("+meme_i+").jpg"} />
          <div className="meme-radios">


          <div className="button-radio">
              <label htmlFor={"hate_"+meme_i}><span role="img" aria-label="emoji">&#128556;</span></label>
              <input type="radio" id={"hate_"+meme_i} name={meme_i} 
              value="hate" onChange={handleChangeRating} />
            </div>
            <div className="button-radio">
              <label htmlFor={"dislike_"+meme_i}><span role="img" aria-label="emoji">&#128580;</span></label>
              <input type="radio" id={"dislike_"+meme_i} name={meme_i} 
              value="dislike" onChange={handleChangeRating} />
            </div>





            {/* <div className="button-radio">
              <input type="radio" id={"hate_"+meme.url} checked={meme.rating} name={meme.url} value="hate" data-emoji="01grimace" onChange={handleChangeRating} />
              <label htmlFor={"hate_"+meme.url}><span role="img" aria-label="emoji"><FontAwesomeIcon icon={faGrimace} /></span></label>
            </div>
            <div className="button-radio">
              <input type="radio" id={"dislike_"+meme.url} checked={meme.rating} name={meme.url} value="like" data-emoji="02mehRollingEyes" onChange={handleChangeRating} />
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
            </div> */}
          </div>
      </div>  
    </React.Fragment>
      )
  }
  
  if (user){
    return (
      renderMeme()
    )
  } else {
    history.push('/accounts/register')
    return null;
  }
}

export default RateMemes
