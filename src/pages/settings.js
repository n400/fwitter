import React, { useState, useEffect, useContext } from 'react'
import { useParams, Link } from 'react-router-dom'
import SessionContext from '../context/session'
import { faunaQueries } from '../fauna/query-manager'
import { toast } from 'react-toastify'
import Asset from '../components/asset'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faEye, faIcons, faHeadSideVirus, faLaugh, faHeart, faImages, faUserFriends, faBirthdayCake, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons'

const Profile = ({ match, location, props }) => {
  const sessionContext = useContext(SessionContext)
  const { user } = sessionContext.state 
  const profileToFetch = user
  const [profileData, setProfileData] = useState(undefined)
  async function getUserProfile (options = {}) {
    console.log(user)
    // return faunaQueries
    //   .getUserProfile(profileToFetch)
    //   .then(res => {
    //     let fetchedProfile = res.data
    //     console.log("fetchedProfile",fetchedProfile)
    //     return fetchedProfile
    //   })
    //   .catch(err => {
    //     console.log(err)
    //     toast.error('get profile failed')
    //   })
  }

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
    console.log("pd", profileData)

    // let thisProfile = profileData.profileDetails[0].data
    // let alias = thisProfile.alias
    // let zip = thisProfile.zip
    // let dob = thisProfile.dob
    // let asset01 = thisProfile.asset01

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
            {/* {asset01 ? <Asset asset={asset01}></Asset> : null} */}
            <Link to={`/profile-edit/`}>edit profile</Link>
          </div>
          <h1>
          {/* {alias} */}
          </h1>

    </React.Fragment>
    )
  }
}

export default Profile
