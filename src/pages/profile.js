import React, { useState, useEffect, useContext } from 'react'

import SessionContext from './../context/session'
import { faunaQueries } from '../fauna/query-manager'
import { toast } from 'react-toastify'


import { Uploader } from '../components/uploader'
import Asset from '../components/asset'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faEye, faIcons, faHeadSideVirus, faLaugh, faHeart, faImages, faUserFriends, faBirthdayCake, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons'


const Profile = props => {
  const sessionContext = useContext(SessionContext)
  const { user } = sessionContext.state
  //TODO (techdebt): change these to useState with an array at some point: https://daveceddia.com/usestate-hook-examples/
  const [wantMemes, setWantMemes] = useState ((user && user.wantMemes) ? user.wantMemes : '')
  const [wantFriends, setWantFriends] = useState ((user && user.wantFriends) ? user.wantFriends : '')
  const [wantDates, setWantDates] = useState ((user && user.wantDates) ? user.wantDates : '')
  //TODO (need to learn this): const [email, setEmail] = useState((user && user.wantDates) ? user.email : '')
  const [alias, setAlias] = useState(user ? user.alias : '')
  const [dob, setDob] = useState((user && user.zip) ? user.dob : '')
  const [zip, setZip] = useState ((user && user.zip) ? user.zip : '')
  const [asset01, setAsset01] = useState((user && user.asset01) ? user.asset01 : '')
  const [asset02, setAsset02] = useState((user && user.asset02) ? user.asset02 : '')

  const [memeData, setMemeData] = useState(undefined)

  useEffect(() => {
    let didCancel = false
    async function fetchData () {
      if (didCancel) return
      let memeList = await getNextMemeList()
      // let currentMeme = 1
      // let currentMeme = (memeList.size != 0) ? memeList[Symbol.iterator]().next().value[1] : undefined // I don't like this.
      setMemeData({
        // currentMeme: currentMeme,
        memeList: memeList,
      })
    }
    fetchData()
    return function () {didCancel = true}
  }, [])

  async function getNextMemeList (options = {}) {
    // let excludeMeme = options.excludeMeme
    return faunaQueries
      .getRatedMemes()
      .then(res => {
        let memeList = res.data
        return memeList
      })
      .catch(err => {
        console.log(err)
        toast.error('What\'s happeniiing???')
      })
  }

  async function handleSaveRating  ({currentMeme, rating}) {
    let mId = currentMeme.id
    return faunaQueries
      .saveRating(mId, rating, user.email)
      .then(res => {console.log ('meme rating saved'); return true})
      .catch(err => {
        console.log(err)
        toast.error('Rating save failed.')
      })
  }

  const nextPhoto = event => {console.log("change photo", event)}

  return renderProfile()
  function renderProfile () {
    // async function clickRatingButtonEvent (evt) {
    //   let currentMeme = memeData.memeList
    // }
    if (memeData === undefined) return (<React.Fragment><div>Loading ... </div></React.Fragment>)
    // if (memeData.currentMeme === undefined) return (<React.Fragment><div>Ran out of memes!</div></React.Fragment>)
    let mId = "url.jpg"
    console.log("memeData", memeData.memeList)

    // const elements = ['one', 'two', 'three'];
    const ratedMemes = []
    console.log("length: ", memeData.memeList.length > 0)
    for (const [index, value] of memeData.memeList.entries()) {
      let mId = value[0]
      let mRating = value[1]
      let mUrl = value[2]
      let emojiUrl = value[4]
      console.log("values",value)
      // if( memeData.memeList.length > 0 ){
        ratedMemes.push(<><div className="ratedMeme">
        <img src={mUrl}/><img src={emojiUrl} />
      </div></>)
      // }else{
      //   ratedMemes.push(<button className="ratedMeme">rate memes to see them here</button>)
      // }
    }

    return (
      <React.Fragment>
      <div className="split-layout">
        <div className="main-left">
          <div className="profilePhotos">
            <div className="swipeableAsset" onClick={nextPhoto}>
            {asset01 ? <Asset asset={asset01}></Asset> : null}
            </div>
          </div>
          <h1>{user.alias}</h1>
          <section className="profile-detes">
              <div><FontAwesomeIcon icon={faUserFriends} /><span>{wantMemes ? "memes" : ""}{wantFriends ? "friends" : ""}{wantDates ? "dates" : ""} </span></div>
              <div><FontAwesomeIcon icon={faBirthdayCake} /><span>{dob}</span></div>
              <div><FontAwesomeIcon icon={faMapMarkerAlt} /><span>{zip}</span></div>
            </section>
        </div>
        <div className="memeGrid">{memeData.memeList.length > 0 ? ratedMemes : "button: rate memes"}</div>
        <div className="main-right profile-text">
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
          </div>
        </div>
      </div>
    </React.Fragment>
    )
  }







}

export default Profile
