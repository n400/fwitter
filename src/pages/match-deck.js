import React, { useState,  useContext, useEffect } from 'react'

import SessionContext from '../context/session'
import { faunaQueries } from '../fauna/query-manager'
import { toast } from 'react-toastify'
import { useHistory } from 'react-router-dom'
import { flattenDataKeys } from '../fauna/helpers/util'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimesCircle, faTimes, faHeart, faStar, faComment, faImages, faUser, faUserEdit, faComments  } from '@fortawesome/free-solid-svg-icons'
import TinderCard from 'react-tinder-card'
import { Scrollbars } from 'react-custom-scrollbars';
import {MemeGrid} from '../components/meme-grid'

// TODO: refactor match-deck and meme-deck functions into one that uses "card-deck"

function RateMatches () {
  const sessionContext = useContext(SessionContext)
  const {user} = sessionContext.state
  const [memeData, setMemeData] = useState(undefined)

  useEffect(() => {
    let didCancel = false
    async function fetchData () {
      if (didCancel) return
      let memeList = await getNextMemeList()
      let currentMeme = (memeList.size != 0) ? memeList[Symbol.iterator]().next().value[1] : undefined // I don't like this.
      setMemeData({
        currentMeme: currentMeme,
        memeList: memeList,
      })
    }
    fetchData()
    return function () {didCancel = true}
  }, [])

  async function getNextMemeList (options = {}) {
    let excludeMeme = options.excludeMeme
    console.log("oem",options.excludeMeme)
    return faunaQueries
      .getAllMatches()
      .then(res => {
        console.log( res)

        let excludeMemeId = !excludeMeme ? undefined : excludeMeme[1].ref.value.id
        console.log("excludeMemeId:", excludeMemeId, excludeMeme)
        // One of the memes might be already rated because of potential race conditions, ... 
        // ... so we remove it post-database-access.
        let memeList = new Map((res.data).map(function (n) {return [n[1].ref.value.id, n]}))
        console.log(memeList)
        //// ??TODO: this "if (excludeMemeId)" function probably doesnt work anymore because 
        //// the match data structure is a little different from the meme data structure
        if (excludeMemeId) {
          console.log("its happening")
          Array.from(memeList).some(function (n) {
            let mId = n[0]
            console.log("mId",n[0],mId)
            if (mId == excludeMemeId) memeList.delete(mId)
          })
        }
      
        return memeList
      })
      .catch(err => {
        console.log(err)
        toast.error('getting profiles failed')
      })
  }
  
  async function handleSaveRating  ({currentMeme, rating}) {
    // console.log("emoji",emoji)
    let mId = currentMeme[1].ref
    console.log(mId)
    return faunaQueries
      .saveMatchRating(mId, rating)
      .then(res => {
        console.log('__ matches unlocked.');//TODO: make this a count in the nav 
        return true})
      .catch(err => {
        console.log(err)
        toast.error('Rating save failed.')
      })
  }

  async function loadNextMeme ({currentMeme, memeList}) {
    let foundCurrentMeme = false
    let nextMeme = Array.from(memeList).find(function (n) {
      let meme = n[1]
      console.log("nm", meme, "currentM", currentMeme)
      if (foundCurrentMeme == true) return true
      if (meme == currentMeme) foundCurrentMeme = true
    })

    if (nextMeme) nextMeme = nextMeme[1] 
    console.log("nm?", nextMeme)
    if (nextMeme === undefined) { //(i.e., if reached end of list)
      memeList = await getNextMemeList({excludeMeme: currentMeme})
      console.log("size", memeList.size )
      nextMeme = (memeList.size != 0) ? memeList[Symbol.iterator]().next().value[1] : undefined
      console.log( "nm..", nextMeme )
    }
    setMemeData({
      currentMeme: nextMeme,
      memeList: memeList,
    })
  }
    
    
  const tryGettingMore = () => {
    console.log("clicked")
    faunaQueries
    .calculateMatches()
    .then(res => {
      console.log( res)
    })
    .catch(err => {
      console.log(err)
      toast.error('testFunction failed')
    })
  }


  const onSwipe = (direction) => {
    console.log('You swiped: ' + direction)
  }
  
  const onCardLeftScreen = (myIdentifier) => {
    console.log(myIdentifier + ' left the screen')
  }

  return renderMeme()

  function renderMeme () {
    async function clickRatingButtonEvent (evt) {
      let currentMeme = memeData.currentMeme
      // No await here in handleSaveRating because we want it to run at the same time as "loadNextMeme".

      console.log(evt.target)
 
      let success = handleSaveRating({currentMeme: currentMeme, rating: evt.target.dataset["swipe"] })
      loadNextMeme({currentMeme: currentMeme, memeList: memeData.memeList})
    }
    if (memeData === undefined) return (<React.Fragment><div>Loading ... </div></React.Fragment>)
    if (memeData.currentMeme === undefined) return (
      <React.Fragment>
        <div>Ran out of matches!</div>
        <div className="button" onClick={tryGettingMore}>Summer: Try getting more</div>
        <div>Rate more memes</div>
        <div>Advertise us on tinder   </div>
      </React.Fragment>)
    let mId = memeData.currentMeme[1].ref.value.id
    let profileToFetch = memeData.currentMeme[1].data.alias
    let zip = memeData.currentMeme[1].data.zip
    let age = (memeData.currentMeme[2] ? memeData.currentMeme[2] : '?')
    console.log("matchlist:", memeData)

    return (
      <React.Fragment>
        <div className="swipe-container">
          {/* <TinderCard onSwipe={onSwipe} onCardLeftScreen={() => onCardLeftScreen('fooBar')} preventSwipe={['down', 'up']}> */}
          {/* <Scrollbars style={{ width: '800px', autoHeight:'true' }}> */}
              <div className="scroll-container">
                <div className="preview-wrap">
                  <div className="img-wrap">
                    <div className="overlay"></div>
                    <img className="meme_to_rate" 
                    // onClick={setNextMeme}
                    alt="" src={memeData.currentMeme[1].data.asset01 ? memeData.currentMeme[1].data.asset01.url : '/images/icons/emojis_love.svg'} /> 
                  </div>{/* </img-wrap> */}
                  <div className="">
                    <h2> {profileToFetch}</h2>
                    <div> {zip}<span>&bull;</span> {age}</div>  
                  </div>
                </div>{/* </preview-wrap> */}
                <div className="profile-description">
                  <section>
                    <h5 className="section-header">Lorem ipsum dolor sit amet</h5> 
                    <p>consectetur adipiscing elit, sed do eiusmod tempor 
                      incididunt ut labore et dolore magna aliqua. Morbi enim 
                      nunc faucibus a pellentesque sit amet porttitor. Posuere 
                      sollicitudin aliquam ultrices sagittis orci a. Justo 
                      eget magna fermentum iaculis eu non diam. Pharetra diam 
                      sit amet nisl. Nibh sed pulvinar proin gravida hendrerit 
                    </p>
                  </section>
                  <section>
                    <h5 className="section-header">Lorem ipsum dolor sit amet</h5> 
                    <p>consectetur adipiscing elit, sed do eiusmod tempor 
                      incididunt ut labore et dolore magna aliqua. Morbi enim 
                      nunc faucibus a pellentesque sit amet porttitor. Posuere 
                      sollicitudin aliquam ultrices sagittis orci a. Justo 
                      eget magna fermentum iaculis eu non diam. Pharetra diam 
                      sit amet nisl. Nibh sed pulvinar proin gravida hendrerit 
                    </p>
                  </section>
                  <section>
                    <h5 className="section-header">Lorem ipsum dolor sit amet</h5> 
                    <p>consectetur adipiscing elit, sed do eiusmod tempor 
                      incididunt ut labore et dolore magna aliqua. Morbi enim 
                      nunc faucibus a pellentesque sit amet porttitor. Posuere 
                      sollicitudin aliquam ultrices sagittis orci a. Justo 
                      eget magna fermentum iaculis eu non diam. Pharetra diam 
                      sit amet nisl. Nibh sed pulvinar proin gravida hendrerit 
                    </p>
                  </section>
                </div>{/* profile-description */}
                <div className="grid">
                  {<MemeGrid passedData={profileToFetch} />}
                </div>
              </div>{/* </scroll-container> */}
          {/* </Scrollbars> */}
          {/* </TinderCard> */}
      </div>  
      <div className="action-bar">
        <div className="action" data-swipe="left" onClick={clickRatingButtonEvent} >
          <div className="action-content dislike"><FontAwesomeIcon icon={faTimes} /></div>
        </div>

        <div className="action" data-swipe="right" onClick={clickRatingButtonEvent} >
          <div className="action-content like"><FontAwesomeIcon icon={faComment} /></div>
        </div>
      </div>{/* action-bar */}
    </React.Fragment>
    )
  }
}

export default RateMatches