import React, { useState, useEffect, useContext } from 'react'
import { useParams } from 'react-router-dom'
import SessionContext from '../context/session'
import { faunaQueries } from '../fauna/query-manager'
import { toast } from 'react-toastify'
import Asset from '../components/asset'
import {MemeGrid} from '../components/meme-grid'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faEye, faIcons, faHeadSideVirus, faLaugh, faHeart, faImages, faUserFriends, faBirthdayCake, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons'

const ProfileView = ({ match, location, props }) => {
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

  return renderProfile()
  function renderProfile () {
    // async function clickRatingButtonEvent (evt) {
    //   let currentMeme = profileData.memeList
    // }
    if (profileData === undefined) return (<React.Fragment><h1>Loading ... </h1></React.Fragment>)
    let thisProfile = profileData.profileDetails[0].data
    console.log("pd", thisProfile.asset01)

    return (
      <React.Fragment>
        <div className="swipe-container">
          {/* <TinderCard onSwipe={onSwipe} onCardLeftScreen={() => onCardLeftScreen('fooBar')} preventSwipe={['down', 'up']}> */}
          {/* <Scrollbars style={{ width: '800px', autoHeight:'true' }}> */}
              <div className="scroll-container">
                <div className="preview-wrap">
                  <div className="img-wrap">
                    <div className="overlay"></div>
                    <img onClick={nextPhoto} src={thisProfile.asset01 ? thisProfile.asset01.url : null}></img>
                  </div>{/* </img-wrap> */}
                  <div className="">
                    <h2>{thisProfile.alias}</h2>
                    <div> {thisProfile.dob}<span>&bull;</span> {thisProfile.zip}</div>  
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
              </div>{/* </scroll-container> */}              
            <div className="grid">
              {<MemeGrid passedData={profileToFetch} />}
            </div>
          {/* </Scrollbars> */}
          {/* </TinderCard> */}
      </div>  
    </React.Fragment>
    )
  }
}

export default ProfileView
