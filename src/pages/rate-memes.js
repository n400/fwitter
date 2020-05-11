import React, { useState,  useContext, useEffect } from 'react'

import SessionContext from '../context/session'
import { faunaQueries } from '../fauna/query-manager'
import { toast } from 'react-toastify'
import { useHistory } from 'react-router-dom'
import { Masonry } from '../components/masonry'

// Components

const RateMemes = props => {
  const history = useHistory();
  const sessionContext = useContext(SessionContext)
  const { user } = sessionContext.state
  // const memes_list = [ //TODO: at some point, write FQL query to get all the memes the user hasnt rated yet
  //   '/images/memes/jim/FB_IMG_1567648753248.jpg', 
  //   '/images/memes/jim/FB_IMG_1567822761676.jpg', 
  //   '/images/memes/jim/FB_IMG_1571669594704.jpg',
  //   '/images/memes/jim/FB_IMG_1567648753248.jpg', 
  //   '/images/memes/jim/FB_IMG_1567822761676.jpg', 
  //   '/images/memes/jim/FB_IMG_1571669594704.jpg'
  // ];

  let [meme_i, setmeme_i] = useState(1)
  let memeRating = ''  

  const handleChangeRating = event => {
    let memeRating = event.target.value
    handleSaveRating(meme_i, memeRating)  
  } 

  const handleSaveRating = (meme_i, memeRating) => {
    faunaQueries
      .saveRating(meme_i, memeRating)
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
    let memeRating = ''
    // event.preventDefault()
  }

  //https://dev.to/mrscx/creating-a-radio-button-component-in-react-1l1a
  // const RadioButton = (props) => {
  //   return (
  //       // <div className="RadioButton">
  //       //     <input id={props.id} onChange={props.changed} value={props.value} type="radio" checked={props.isSelected} />
  //       //     <label htmlFor={props.id}>{props.label}</label>
  //       // </div>
  //       <div className="button-radio">
  //         <input checked={props.isSelected} type="radio" id={"hate_"+memeId} name={memeId} value="hate" onChange={handleChangeRating} />
  //         <label htmlFor={"hate_"+memeId}><span role="img" aria-label="emoji">&#128556;</span></label>
  //       </div>
  //   );
  // }

  const renderMeme = () => {
      return (
        <React.Fragment>
          <Masonry/>
        <div className="rate_meme_element">
          <img alt="" src={"/images/memes/jim/meme ("+meme_i+").jpg"} />
          <div className="meme-radios">
            <div className="button-radio">
              <input type="radio" id={"hate_"+meme_i} name={meme_i} value="hate" onChange={handleChangeRating} />
              <label htmlFor={"hate_"+meme_i}><span role="img" aria-label="emoji">&#128556;</span></label>
            </div>
            <div className="button-radio">
              <input type="radio" id={"dislike_"+meme_i} name={meme_i} value="dislike" onChange={handleChangeRating} />
              <label htmlFor={"dislike_"+meme_i}><span role="img" aria-label="emoji">&#128580;</span></label>
            </div>
            <div className="button-radio">
              <input type="radio" id={"neutral_"+meme_i} name={meme_i} value="neutral" onChange={handleChangeRating} />
              <label htmlFor={"neutral_"+meme_i}><span role="img" aria-label="emoji">&#129300;</span></label>
            </div>
            <div className="button-radio">
              <input type="radio" id={"like_"+meme_i} name={meme_i} value="like" onChange={handleChangeRating} />
              <label htmlFor={"like_"+meme_i}><span role="img" aria-label="emoji">&#128521;</span></label>
            </div>
            <div className="button-radio">
              <input type="radio" id={"love_"+meme_i} name={meme_i} value="love" onChange={handleChangeRating} />
              <label htmlFor={"love_"+meme_i}><span role="img" aria-label="emoji">&#128525;</span></label>
            </div>
          </div>
      </div>  
    </React.Fragment>
      )
  }
  
  if (user){
    return (
      renderMeme(meme_i)
    )
  } else {
    history.push('/accounts/register')
    return null;
  }
}

export default RateMemes
