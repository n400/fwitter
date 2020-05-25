import React, { 
  // useEffect, useContext 
} from 'react'
// import SessionContext from '../context/session'
import { Link } from 'react-router-dom'

// Components


const User = ({ match, location }) => {
  // var {params: { userId } } = match;
  console.log( match.params.userAlias )
  return (
    <><section>
      <h4>{match.params.userAlias}</h4>
          <p>
        <strong>Match Props: </strong>
        <code>{JSON.stringify(match, null, 2)}</code>
      </p>
      <p>
        <strong>Location Props: </strong>
        <code>{JSON.stringify(location, null, 2)}</code>
      </p>
      {/* <p>
        <strong>User ID: </strong>
        {userId}
      </p>
      <p>
        <strong>User Name: </strong>
        {profiles[userId - 1].name}
      </p> */}
    </section>
    </>
  );
};

export default User
