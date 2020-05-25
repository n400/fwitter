import React, { 
  // useEffect, useContext 
} from 'react'
// import SessionContext from '../context/session'
import { Link } from 'react-router-dom'

// Components

const Profiles = () => {

  const profiles = [
    {alias: `bigmac`,},
    { alias: `summer`,},
    { alias: `n400`, },
  ];
  
  return (
    <>
      {profiles.map((user, index) => (
        <h5 key={index}>
          <Link to={`/user/${user.alias}`}>{user.alias}'s Page</Link>
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


export default Profiles
