import React, { useState, useEffect, useContext } from 'react'
import { useParams, Link } from 'react-router-dom'
import SessionContext from './../context/session'
import { faunaQueries } from '../fauna/query-manager'
import { toast } from 'react-toastify'
import { Uploader } from '../components/uploader'
import Asset from '../components/asset'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faEye, faIcons, faHeadSideVirus, faLaugh, faHeart, faImages, faUserFriends, faBirthdayCake, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons'

const Profiles = () => {
  const profiles = [{alias: `jim`,},{ alias: `summer`,},{ alias: `n400`, },];
  getNextProfileList()
  async function getNextProfileList (options = {}) {
    // let excludeMeme = options.excludeMeme
    console.log( "rjedfs" )
    return faunaQueries
      .getAllProfiles()
      .then(res => {
        let matchList = res.data
        console.log(matchList)
        return matchList
      })
      .catch(err => {
        console.log(err)
        toast.error('get matches failed')
      })
  }
  return (
    <>
      {profiles.map((user, index) => (
        <h5 key={index}><Link to={`/profile/${user.alias}`}>{user.alias}</Link></h5>
      ))}
    </>
  );
};
export default Profiles



  // const sessionContext = useContext(SessionContext)

  // // Just for debugging to get in quickly
  // useEffect(() => {
  //   // For debugging, autologin to get in faster for testing, add a user and pword in the .env.local
  // }, [])




  // function renderProfile () {
  //   // async function clickRatingButtonEvent (evt) {
  //   //   let currentMeme = memeData.memeList
  //   // }
  //   if (memeData === undefined) return (<React.Fragment><div>Loading ... </div></React.Fragment>)
  //   // if (memeData.currentMeme === undefined) return (<React.Fragment><div>Ran out of memes!</div></React.Fragment>)
  //   console.log("md.pd:", memeData.profileDetails)
  //   console.log("md.pd.zip:", memeData.profileDetails[0].data.zip)
  //   console.log("md.ml:", memeData.memeList)
    
  //   // creates the profileDetails element and pushes the profile data into it
  //   const profileDetailsElement = []
  //   for (const [index, value] of memeData.profileDetails.entries()) {
  //     let thisProfile = memeData.profileDetails[0].data
  //     //TODO: This outer function will work perfectly for the 
  //     //allPRofiles page, working just like the function that creates the ratedMemes
  //     //element and pushes data into it, but needs to be edited here to remove the loop
  //     // console.log(memeData.profileDetails)
  //     profileDetailsElement.push(<>
  //       <div className="grid-item">
  //           {thisProfile.alias} {thisProfile.wantMemes} {thisProfile.dob} {thisProfile.zip} {thisProfile.asset01}
  //       </div>
  //       </>)
  //   }


