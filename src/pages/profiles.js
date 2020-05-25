import React, { 
  // useEffect, useContext 
} from 'react'
// import SessionContext from '../context/session'
import { Link } from 'react-router-dom'

// Components

const Profiles = () => {

  const profiles = [
    {alias: `jim`,},
    { alias: `summer`,},
    { alias: `n400`, },
  ];
  
  return (
    <>
      {profiles.map((user, index) => (
        <h5 key={index}>
          <Link to={`/profile/${user.alias}`}>{user.alias}'s Page</Link>
        </h5>
      ))}
    </>
  );
};


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


export default Profiles
