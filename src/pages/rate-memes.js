import React, { useState,  useContext } from 'react'

import SessionContext from '../context/session'
import { faunaQueries } from '../fauna/query-manager'
import { toast } from 'react-toastify'
import { useHistory } from 'react-router-dom'

// Components

const RateMemes = props => {
  const history = useHistory();
  const sessionContext = useContext(SessionContext)
  const { user } = sessionContext.state
  const memes_list = [ //TODO: at some point, write FQL query to get all the memes the user hasnt rated yet
    '/images/memes/jim/FB_IMG_1567648753248.jpg', 
    '/images/memes/jim/FB_IMG_1567822761676.jpg', 
    '/images/memes/jim/FB_IMG_1571669594704.jpg',
    '/images/memes/jim/FB_IMG_1567648753248.jpg', 
    '/images/memes/jim/FB_IMG_1567822761676.jpg', 
    '/images/memes/jim/FB_IMG_1571669594704.jpg'
  ];
  // const [meme, setMeme] = useState('')
  // const [memeRating, setMemeRating] = useState('')
  let [meme_i, setmeme_i] = useState(0)
  let memeRating = ''  
  let memeId = memes_list[meme_i]

  const handleChangeRating = event => {
    let memeRating = event.target.value
    handleSaveRating(memeId, memeRating)
  } 

  const handleSaveRating = (memeId, memeRating) => {
    faunaQueries
      .saveRating(memeId, memeRating)
      .then(res => { // toast.success('Rating saved')
        nextMeme()
      })
      .catch(err => {
        console.log(err)
        toast.error('Rating save failed')
      })
    // event.preventDefault()
  }

  let nextMeme = () => {
    setmeme_i(++meme_i)
    let memeId = memes_list[meme_i]
    let memeRating = ''
    // event.preventDefault()
  }



  const renderMeme = () => {
    console.log("rendering", meme_i, memeId)
      return (
        <React.Fragment>
        <div id="rate_meme_element">
          <img alt="" src={memeId} />
          <div className="button-checkboxes">
            <div className="button-radio">
              <label htmlFor={"hate_"+memeId}><span role="img" aria-label="emoji">&#128556;</span></label>
              <input type="radio" id={"hate_"+memeId} name={memeId} 
              value="hate" onChange={handleChangeRating} />
            </div>
            <div className="button-radio">
              <label htmlFor={"dislike_"+memeId}><span role="img" aria-label="emoji">&#128580;</span></label>
              <input type="radio" id={"dislike_"+memeId} name={memeId} 
              value="dislike" onChange={handleChangeRating} />
            </div>
            <div className="button-radio">
              <label htmlFor={"neutral_"+memeId}><span role="img" aria-label="emoji">&#129300; &#128533;</span></label>
              <input type="radio" id={"neutral_"+memeId} name={memeId} 
              value="neutral" onChange={handleChangeRating} />
            </div>
            <div className="button-radio">
              <label htmlFor={"like_"+memeId}><span role="img" aria-label="emoji">&#128521;</span></label>
              <input type="radio" id={"like_"+memeId} name={memeId} 
              value="like" onChange={handleChangeRating} />
            </div>
            <div className="button-radio">
              <label htmlFor={"love_"+memeId}><span role="img" aria-label="emoji">&#128525;</span></label>
              <input type="radio" id={"love_"+memeId} name={memeId} 
              value="love" onChange={handleChangeRating} />
            </div>
          </div>
      </div>  
    </React.Fragment>
      )
  }
  
  if (user){
    return (
      renderMeme(memeId)
    )
  } else {
    history.push('/accounts/register')
    return null;
  }
}

export default RateMemes
