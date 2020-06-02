import React, { useState,  useContext, useEffect } from 'react'

import SessionContext from '../context/session'
import { faunaQueries } from '../fauna/query-manager'
import { toast } from 'react-toastify'
import { useHistory } from 'react-router-dom'

function RateMemes () {
  const sessionContext = useContext(SessionContext)
  const {user} = sessionContext.state
  const [memeData, setMemeData] = useState(undefined)

  useEffect(() => {
    let didCancel = false
    async function fetchData () {
      if (didCancel) return
      let memeList = await getNextMemeList()
      //getting stuck here
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
        console.log("fetched memes res:", res.data)
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
    // console.log("emoji",emoji)
    let mId = currentMeme.id
    return faunaQueries
      .saveRating(mId, rating, emoji)
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
  

  return renderMeme()

  function renderMeme () {
    async function clickRatingButtonEvent (evt) {
      let currentMeme = memeData.currentMeme
      // console.log("evt",evt.target.dataset["emoji"])
      // let emoji = evt.target.dataset[emoji]
      // No await here in handleSaveRating because we want it to run at the same time as "loadNextMeme".
      let success = handleSaveRating({currentMeme: currentMeme, rating: evt.target.value, emoji: evt.target.dataset["emoji"]})
      loadNextMeme({currentMeme: currentMeme, memeList: memeData.memeList})
    }
    if (memeData === undefined) return (<React.Fragment><div>Loading ... </div></React.Fragment>)
    if (memeData.currentMeme === undefined) return (<React.Fragment><div>Ran out of memes!</div></React.Fragment>)
    let mId = memeData.currentMeme.id
    return (
      <React.Fragment>
        <div className="rate_meme_element">
          <div className="swipeableAsset">
            <img className="meme_to_rate" alt="" src={"/images/memes/jim/meme (" + mId + ").jpg"} />
          </div>
          <div className="action-bar meme-radios">
          <div className="action-bar-button">
              <label htmlFor={"hate_"+mId}><img className="emoji" src="images/icons/emojis_hate.svg"/></label>
              <input type="radio" id={"hate_"+mId} name={mId} 
              value="1" onClick={clickRatingButtonEvent} data-emoji="images/icons/emojis_hate.svg"/>
            </div>
            <div className="action-bar-button">
              <label htmlFor={"dislike_"+mId}><img className="emoji" src="images/icons/emojis_dislike.svg"/></label>
              <input type="radio" id={"dislike_"+mId} name={mId} 
              value="2" onClick={clickRatingButtonEvent}  data-emoji="images/icons/emojis_dislike.svg"/>
            </div>
            <div className="action-bar-button">
              <label htmlFor={"meh_"+mId}><img className="emoji" src="images/icons/emojis_meh.svg"/></label>
              <input type="radio" id={"meh_"+mId} name={mId} 
              value="3" onClick={clickRatingButtonEvent} data-emoji="images/icons/emojis_meh.svg" />
            </div>
            <div className="action-bar-button">
              <label htmlFor={"like_"+mId}><img className="emoji" src="images/icons/emojis_like.svg"/></label>
              <input type="radio" id={"like_"+mId} name={mId} 
              value="4" onClick={clickRatingButtonEvent} data-emoji="images/icons/emojis_like.svg" />
            </div>
            <div className="action-bar-button">
              <label htmlFor={"love_"+mId}><img className="emoji" src="images/icons/emojis_love.svg"/></label>
              <input type="radio" id={"love_"+mId} name={mId} 
              value="5" onClick={clickRatingButtonEvent}  data-emoji="images/icons/emojis_love.svg"/>
            </div>
          </div>
      </div>  
    </React.Fragment>
    )
  }
}

export default RateMemes