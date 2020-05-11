// .memes_to_rate{
//   display: flex;
//   flex-wrap: wrap;
//   .meme_to_rate{
//     width: 25%;
//     img{
//       object-fit: contain;
//     }
//   }
// }

import React, { useState, useEffect, useContext } from 'react'

import SessionContext from '../context/session'
import { faunaQueries } from '../fauna/query-manager'
import { toast } from 'react-toastify'
import { useHistory } from 'react-router-dom'

// Components

const RateMemes = props => {
  const history = useHistory();
  const sessionContext = useContext(SessionContext)
  const { user } = sessionContext.state
  // const [memerating, setMemerating] = useState(user && user.memes.meme.rating ? user.memes.meme.rating : '')  
  const [meme, setMeme] = useState('')
  const [memeRating, setMemeRating] = useState('')
  const rate_meme_element = []
  const handleChangeRating = event => {
    setMeme(event.target.name)
    setMemeRating(event.target.value)
    handleSaveRating(event.target.name, event.target.value)
  } 
  const handleSaveRating = (meme, memeRating) => {
    faunaQueries
      .saveRating(meme, memeRating)
      .then(res => { // toast.success('Rating saved')
        replaceMemeToRate()
      })
      .catch(err => {
        console.log(err)
        toast.error('Rating save failed')
      })
    // event.preventDefault()
  }
  // // Just for debugging to get in quickly
  // useEffect(() => {
  //   // For debugging, autologin to get in faster for testing, add a user and pword in the .env.local         
  // }, [])

  const memes_list = [
    '/images/memes/jim/FB_IMG_1567648753248.jpg', 
    '/images/memes/jim/FB_IMG_1567822761676.jpg', 
    '/images/memes/jim/FB_IMG_1571669594704.jpg'
  ];

  for (const [index, meme_id] of memes_list.entries()) {

  }

  
  const replaceMemeToRate = event => {
    console.log("go to next meme")

    setMeme(event.target.name)



  }

  for (const [index, meme_id] of memes_list.entries()) {
    rate_meme_element.push( 
      <div key={index} className="rate_meme_element">
        <img alt="" src={meme_id} />
        <div className="button-checkboxes">
          <div className="button-radio">
            <label htmlFor={"hate_"+meme_id}>&#128556;</label>
            <input type="radio" id={"hate_"+meme_id} name={meme_id} 
            value="hate" onChange={handleChangeRating} />
          </div>
          <div className="button-radio">
            <label htmlFor={"dislike_"+meme_id}>&#128580;</label>
            <input type="radio" id={"dislike_"+meme_id} name={meme_id} 
            value="dislike" onChange={handleChangeRating} />
          </div>
          <div className="button-radio">
            <label htmlFor={"neutral_"+meme_id}>&#129300; &#128533;</label>
            <input type="radio" id={"neutral_"+meme_id} name={meme_id} 
            value="neutral" onChange={handleChangeRating} />
          </div>
          <div className="button-radio">
            <label htmlFor={"like_"+meme_id}>&#128521;</label>
            <input type="radio" id={"like_"+meme_id} name={meme_id} 
            value="like" onChange={handleChangeRating} />
          </div>
          <div className="button-radio">
            <label htmlFor={"love_"+meme_id}>&#128525;</label>
            <input type="radio" id={"love_"+meme_id} name={meme_id} 
            value="love" onChange={handleChangeRating} />
          </div>
        </div>
    </div>  
    )
  }

  
  if (user){
    return (
      <React.Fragment>
          {rate_meme_element}
      </React.Fragment>
    )
    
  } else {
    history.push('/accounts/register')
    return null;
  }
}

export default RateMemes
