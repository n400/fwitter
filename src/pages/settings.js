import React, { useState, useEffect, useContext } from 'react'
import { useParams, Link } from 'react-router-dom'
import SessionContext from '../context/session'
import { faunaQueries } from '../fauna/query-manager'
import { toast } from 'react-toastify'
import Asset from '../components/asset'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencilAlt, faEye, faIcons, faHeadSideVirus, faLaugh, faHeart, faImages, faUserFriends, faBirthdayCake, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons'

const Profile = ({ match, location, props }) => {
  const sessionContext = useContext(SessionContext)
  const { user } = sessionContext.state 
  const profileToFetch = user
  const [profileData, setProfileData] = useState(undefined)

  async function getUserSettings (options = {}) {
    console.log(user)
    return faunaQueries
      .getUserSettings(user.alias)
      .then(res => {
        let userSettings = res.data
        console.log("userSettinggs",userSettings)
        return userSettings
      })
      .catch(err => {
        console.log(err)
        toast.error('get profile failed')
      })
  }

  useEffect(() => {
    let didCancel = false
    async function fetchData () {
      if (didCancel) return
      
      let userSettings = await getUserSettings()
      // let fetchedProfile = await getUserProfile()
      
       setProfileData({
        userSettings: userSettings,
        // profileDetails: fetchedProfile
      })
      //profileData is still undefined the first time this useEffect runs
    }
    fetchData()
    return function () {didCancel = true}
  }, [])

  // async function getUserSettings (options = { rating1: "1", rating2: "2" }) {
  //   return faunaQueries
  //     .getUserSettings()
  //     .then(res => {
  //       let userSettings = res.data
  //       console.log( "result: ", res.data )
  //       return userSettings
  //     })
  //     .catch(err => {
  //       console.log(err)
  //       toast.error('get memes failed')
  //     })
  // }

  return renderProfile()
  function renderProfile () {
    async function handleChangeSetting (evt) {
      console.log(evt)
    }
    // if (profileData === undefined) return (<React.Fragment><h1>Loading ... </h1></React.Fragment>)
    // console.log("pd", profileData)
    // let asset01 = profileData.asset01
    // let thisProfile = profileData.profileDetails[0].data
    // let alias = thisProfile.alias
    // let zip = thisProfile.zip
    // let dob = thisProfile.dob
    // let asset01 = thisProfile.asset01

    // function switchuserSettings(evt){
    //   switch ( evt.target.dataset.memebatch ) {
    //     case 'likes':      
    //       getUserSettings({ rating1: "4", rating2: "5" })
    //       break;
    //     case 'dislikes':
    //       getUserSettings({ rating1: "1", rating2: "2" })
    //       break;
    //   }
    // }

    return (
      <React.Fragment>
      {/* <div className="split-layout"> */}
        {/* <div className="main-left"> */}
        <div className="avatars" style={{ display: "flex", flexDirection: "row"}}>
          <div className="avatar">
            <img style={{borderRadius: '200%'}} src={user.asset01.url ? user.asset01.url : ''}/>
            <Link className="button dates" to={`/profile-edit/`}><FontAwesomeIcon icon={faPencilAlt} /></Link>
          </div>
          {/* <div className="avatar">
            <img style={{borderRadius: '200%'}} src={user.asset01.url ? user.asset01.url : ''}/>
            <Link className="button friends" to={`/profile-edit/`}><FontAwesomeIcon icon={faPencilAlt} /></Link>
          </div> */}
        </div>
        <div>
          {user.asset01.url}
          {user.wants}
          {user.dob}
          <Link to={`/profile/${user.alias}`}>view {user.alias} profile</Link>
        </div>

        <div className="form form-full-width">       
          <div className="">
            <div className="input-group">
              <input type="checkbox" id="friends" checked={true} onChange={handleChangeSetting} />
              <label htmlFor="friends">friends</label>
            </div>
            <div className="input-group">
              <input type="checkbox" id="dates" checked={false} onChange={handleChangeSetting} />
              <label htmlFor="dates">dates</label>
            </div>
          </div>     
          <div className="small">about me</div>
          <div className="input-group">
            <input type="text" id="city" onChange={handleChangeSetting} />
            <label htmlFor="city">city</label>
          </div>
          <div className="input-group">
            <input type="text" id="gender" onChange={handleChangeSetting} />
            <label htmlFor="gender">gender</label>
          </div>
          <div className="input-group">
            <input type="text" id="birthdate" onChange={handleChangeSetting} />
            <label htmlFor="birthdate">birthdate</label>
          </div>
          <div className="input-group">
            <input type="text" id="username" onChange={handleChangeSetting} />
            <label htmlFor="username">username</label>
          </div>
          <div className="input-group">
            <input type="text" id="email" onChange={handleChangeSetting} />
            <label htmlFor="email">email</label>
          </div>     
        </div>

    </React.Fragment>
    )
  }
}

export default Profile
