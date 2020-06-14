import React, { useState,  useContext, useEffect } from 'react'

import SessionContext from '../context/session'
import { faunaQueries } from '../fauna/query-manager'
import { toast } from 'react-toastify'
import { useHistory } from 'react-router-dom'
import TinderCard from 'react-tinder-card'

function RateMemes () {
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
    return faunaQueries
      .getUnratedMemes()
      .then(res => {
        // Convert the array result (res.data) into a Map object.
        // E.G.:
        // [0: {13 => 'apple'}, 1: {17 => 'pear', 2: {7 => 'banana'}] converts to ...
        // ... {13 => 'apple', 17 => 'pear', 7 => 'banana'}
        // To access the values by index:
        // Array.from(myMapObject)[index][1]
        // To access the values by id:
        // myMapObject.get(MyMapId)
        let excludeMemeId = !excludeMeme ? undefined : excludeMeme.id
        // console.log("excludeMemeId:", excludeMemeId, excludeMeme.ref.id)
        // One of the memes might be already rated because of potential race conditions, ... 
        // ... so we remove it post-database-access.
        let memeList = new Map((res.data).map(function (n) {return [n.id, n]}))
        if (excludeMemeId) {
          Array.from(memeList).some(function (n) {
            let mId = n[0]
            if (mId == excludeMemeId) memeList.delete(mId)
          })
        }
        console.log("mapped memelist:", memeList)
        return memeList
      })
      .catch(err => {
        console.log(err)
        toast.error('What\'s happeniiing???')
      })
  }
  
  async function handleSaveRating  ({currentMeme, rating, emoji}) {
    console.log(rating)
    let mId = currentMeme.id
    return faunaQueries
      .saveMemeRating(mId, rating, emoji)
      .then(res => {
        console.log('__ matches unlocked.');//TODO: make this a count in the nav 
        return true})
      .catch(err => {
        console.log(err)
        toast.error('Rating save failed.')
      })
  }

  async function loadNextMeme ({currentMeme, memeList}) {
    //
    // A Map that looks like {13 => 'apple', 17 => 'pear', 7 => 'banana'} ...
    // ... then converts into this with Array.from:
    // [0: [13, 'apple'], 1: [17, 'pear'], 2: [7, 'banana']]
    //
    // N.B.: To get a map value by id: myMeme = memeList.get(mId)

    let foundCurrentMeme = false
    let nextMeme = Array.from(memeList).find(function (n) {
      let meme = n[1]
      if (foundCurrentMeme == true) return true
      if (meme == currentMeme) foundCurrentMeme = true
    })

    if (nextMeme) nextMeme = nextMeme[1]

    if (nextMeme === undefined) {
      memeList = await getNextMemeList({excludeMeme: currentMeme})
      nextMeme = (memeList.size != 0) ? memeList[Symbol.iterator]().next().value[1] : undefined
    }
    setMemeData({
      currentMeme: nextMeme,
      memeList: memeList,
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
      // TODO: add active class to the selected button, then remove it when the next meme loads,
      // do this when you make the swipe work
      console.log(evt.target)
      // let emoji = evt.target.dataset[emoji]
      // No await here in handleSaveRating because we want it to run at the same time as "loadNextMeme".
      let success = handleSaveRating({currentMeme: currentMeme, rating: evt.target.dataset["rating"], emoji: evt.target.src})
      loadNextMeme({currentMeme: currentMeme, memeList: memeData.memeList})

    }
    if (memeData === undefined) return (<React.Fragment><div>Loading ... </div></React.Fragment>)
    if (memeData.currentMeme === undefined) return (<React.Fragment><div>Ran out of memes!</div></React.Fragment>)
    let mId = memeData.currentMeme.id
    return (
      <React.Fragment>
        <div className="swipe-container">
          <TinderCard onSwipe={onSwipe} onCardLeftScreen={() => onCardLeftScreen('fooBar')} preventSwipe={['down', 'up']}>
            <div className="swipeableAsset">        
              <img className="meme_to_rate" alt="" src={"/images/memes/jim/meme (" + mId + ").jpg"} />
            </div>
          </TinderCard>
        </div>  
        <div className="action-bar meme-radios">
          <div className="action">
            <div className="action-content emoji">
              <img src="images/icons/emojis_hate.svg" onClick={clickRatingButtonEvent} data-rating="1"/>
            </div>
          </div>
          <div className="action">
            <div className="action-content emoji">
              <img src="images/icons/emojis_dislike.svg" onClick={clickRatingButtonEvent} data-rating="2"/>
            </div>
          </div>
          <div className="action">
            <div className="action-content emoji dislike">
              <img src="images/icons/emojis_meh.svg" onClick={clickRatingButtonEvent} data-rating="3"/>
            </div>
          </div>
          <div className="action">
            <div className="action-content emoji">
              <img src="images/icons/emojis_like.svg" onClick={clickRatingButtonEvent} data-rating="4"/>
            </div>
          </div>
          <div className="action">
            <div className="action-content emoji">
              <img src="images/icons/emojis_love.svg" onClick={clickRatingButtonEvent} data-rating="5"/>
            </div>
          </div>
        </div>
    </React.Fragment>
    )
  }
}

export default RateMemes