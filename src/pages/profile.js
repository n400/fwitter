import React, { useState, useEffect, useContext } from 'react'
import { useParams } from 'react-router-dom'
import SessionContext from './../context/session'
import { faunaQueries } from '../fauna/query-manager'
import { toast } from 'react-toastify'
import { Uploader } from '../components/uploader'
import Asset from '../components/asset'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faEye, faIcons, faHeadSideVirus, faLaugh, faHeart, faImages, faUserFriends, faBirthdayCake, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons'

const Profile = ({ match, location, props }) => {
  const sessionContext = useContext(SessionContext)
  //"user" refers to The logged in user, NOT the profile
  //We will need this to filter the memes
  const { user } = sessionContext.state 
  const profileToFetch = match.params.userAlias
 
  const [profileData, setProfileData] = useState(undefined)
  // profileData is still undefined until the render

  useEffect(() => {
    let didCancel = false
    async function fetchData () {
      if (didCancel) return
      //TODO for performance, we could make memes load after the other data?
      let memeList = await getNextMemeList()
      let fetchedProfile = await getUserProfile()
       setProfileData({
        // currentMeme: currentMeme,
        memeList: memeList,
        profileDetails: fetchedProfile
      })
      //profileData is still undefined the first time this useEffect runs
    }
    fetchData()
    return function () {didCancel = true}
  }, [])

  async function getNextMemeList (options = {}) {
    // let excludeMeme = options.excludeMeme
    console.log( "gnmt:",profileToFetch )
    return faunaQueries
      .getRatedMemes(profileToFetch)
      .then(res => {
        let memeList = res.data
        return memeList
      })
      .catch(err => {
        console.log(err)
        toast.error('get memes failed')
      })
  }
  async function getUserProfile (options = {}) {
    // let excludeMeme = options.excludeMeme
    console.log( "gup",profileToFetch )
    return faunaQueries
      .getUserProfile(profileToFetch)
      .then(res => {
        let fetchedProfile = res.data
        return fetchedProfile
      })
      .catch(err => {
        console.log(err)
        toast.error('get profile failed')
      })
  }
  const nextPhoto = event => {console.log("change photo", event)}

  return renderProfile()
  function renderProfile () {
    // async function clickRatingButtonEvent (evt) {
    //   let currentMeme = profileData.memeList
    // }
    if (profileData === undefined) return (<React.Fragment><h1>Loading ... </h1></React.Fragment>)
    console.log(profileData)
    let thisProfile = profileData.profileDetails[0].data
    let alias = thisProfile.alias
    let zip = thisProfile.zip
    let dob = thisProfile.dob
    let asset01 = thisProfile.asset01
    let wantMemes = thisProfile.wantMemes
    let wantFriends = thisProfile.wantFriends
    let wantDates = thisProfile.wantDates

    // creates the meme element and pushes the memes into it
    //TODO: pull into its own file so we can filter profile memes by logged in user's memes
    const ratedMemes = []
    for (const [index, value] of profileData.memeList.entries()) {
      let mId = value[0]
      let mRating = value[1]
      let mUrl = value[2]
      // let emojiUrl = value[4]
        ratedMemes.push(<>
        <div className="grid-item">
            <img className="rated-meme" src={mUrl}/>
            <div className="meme-rating">
              {/* <img src={"/"+emojiUrl} /> */}
            </div>
        </div>
        </>)
    }

    return (
      <React.Fragment>
      {/* <div className="split-layout"> */}
        {/* <div className="main-left"> */}
          <div className="profilePhotos">
            <div className="swipeableAsset" onClick={nextPhoto}>
            {asset01 ? <Asset asset={asset01}></Asset> : null}
            </div>
          </div>
          <h1>{alias}</h1>
          <section className="profile-details">
              <div><FontAwesomeIcon icon={faUserFriends} /><span>{wantMemes ? "memes" : ""}{wantFriends ? "friends" : ""}{wantDates ? "dates" : ""} </span></div>
              <div><FontAwesomeIcon icon={faBirthdayCake} /><span>{dob}</span></div>
              <div><FontAwesomeIcon icon={faMapMarkerAlt} /><span>{zip}</span></div>
          </section>
         
        {/* </div> */}
        {/* <div className="main-right"> */}
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
          <div className="grid">{profileData.memeList.length > 0 ? ratedMemes : "button: rate memes"}</div>
      {/* </div> */}
      {/* </div> */}
    </React.Fragment>
    )
  }
}

export default Profile
