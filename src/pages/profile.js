import React, { useState, useEffect, useContext } from 'react'
import { useParams } from 'react-router-dom'
import SessionContext from '../context/session'
import { faunaQueries } from '../fauna/query-manager'
import { toast } from 'react-toastify'
import Asset from '../components/asset'
import {MemeGrid} from '../components/meme-grid'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faEye, faIcons, faHeadSideVirus, faLaugh, faHeart, faImages, faUserFriends, faBirthdayCake, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons'

const Profile = ({ match, location, props }) => {
  const sessionContext = useContext(SessionContext)
  const { user } = sessionContext.state 
  const profileToFetch = match.params.userAlias
  const [profileData, setProfileData] = useState(undefined)
  async function getUserProfile (options = {}) {
    // let excludeMeme = options.excludeMeme
    // console.log( "gup",profileToFetch )
    return faunaQueries
      .getUserProfile(profileToFetch)
      .then(res => {
        let fetchedProfile = res.data
        console.log("fetchedProfile",fetchedProfile)
        return fetchedProfile
      })
      .catch(err => {
        console.log(err)
        toast.error('get profile failed')
      })
  }
  const nextPhoto = event => {console.log("change photo", event)}


  useEffect(() => {
    let didCancel = false
    async function fetchData () {
      if (didCancel) return
      
      // let memeList = await getNextMemeList({ rating1: "4", rating2: "5" })
      let fetchedProfile = await getUserProfile()
      
       setProfileData({
        // memeList: memeList,
        profileDetails: fetchedProfile
      })
      //profileData is still undefined the first time this useEffect runs
    }
    fetchData()
    return function () {didCancel = true}
  }, [])

  // async function getNextMemeList (options = { rating1: "1", rating2: "2" }) {
  //   return faunaQueries
  //     .getMemesRatedMutually(profileToFetch,options.rating1,options.rating2)
  //     .then(res => {
  //       let memeList = res.data
  //       console.log( "result: ", res.data )
  //       return memeList
  //     })
  //     .catch(err => {
  //       console.log(err)
  //       toast.error('get memes failed')
  //     })
  // }

  return renderProfile()
  function renderProfile () {
    // async function clickRatingButtonEvent (evt) {
    //   let currentMeme = profileData.memeList
    // }
    if (profileData === undefined) return (<React.Fragment><h1>Loading ... </h1></React.Fragment>)
    // console.log("pd", profileData)
    let thisProfile = profileData.profileDetails[0].data
    let alias = thisProfile.alias
    let zip = thisProfile.zip
    let dob = thisProfile.dob
    let asset01 = thisProfile.asset01

    // function switchMemeList(evt){
    //   switch ( evt.target.dataset.memebatch ) {
    //     case 'likes':      
    //       getNextMemeList({ rating1: "4", rating2: "5" })
    //       break;
    //     case 'dislikes':
    //       getNextMemeList({ rating1: "1", rating2: "2" })
    //       break;
    //   }
    // }

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
              {/* <div><FontAwesomeIcon icon={faUserFriends} /><span>{wantMemes ? "memes" : ""}{wantFriends ? "friends" : ""}{wantDates ? "dates" : ""} </span></div> */}
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
          {/* <div className="tabs">
            <div data-memebatch="likes" onClick={switchMemeList} className="tab">You both liked</div>
            <div data-memebatch="dislikes" onClick={switchMemeList} className="tab">You both disliked</div>
            <div className="tab">find out!</div>
          </div> */}
          <div className="grid">
            {/* {profileData.memeList.length > 0 ? memeGrid : "button: rate memes"} */}
            {/* {profileData.memeList.map(( meme, index) => (
              <div key={index} className="grid-item">
                  <img className="rated-meme" src={meme.data.url}/>
              </div>
            ))} */}
            {<MemeGrid passedData={profileToFetch} />}
          </div>
          
      
          

      {/* </div> */}
      {/* </div> */}
    </React.Fragment>
    )
  }
}

export default Profile
