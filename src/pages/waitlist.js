import React, { useState, useEffect, useContext } from 'react'
// import Feed from '../components/feed'

// import Nav from './../components/nav'
// import Search from './../components/search'
// import Fweeter from '../components/fweeter'
// import { faunaQueries } from '../fauna/query-manager'
// import { safeVerifyError } from '../fauna/helpers/errors'
// import { toast } from 'react-toastify'
import SessionContext from '../context/session'
import { useHistory } from 'react-router-dom'


import { QueryManager } from '../../src/fauna/query-manager'
require('dotenv').config({ path: '.env.' + process.argv[2] })
const { handleSetupError } = require('../../src/fauna/helpers/errors')
const faunadb = require('faunadb')
const q = faunadb.query


// await handleSetupError(faunaQueries.login('user1@test.com', 'testtest'))
// const fw1 = await handleSetupError(
//   faunaQueries.createFweet('What do people do these days? #lockdown #corona #bored'),
//   'create fweet 1'
// )
console.log("Wefcwaefw")

function createDummyData () {
  // let adminKey = process.env.REACT_APP_LOCAL___ADMIN
  // let faunaQueries = new QueryManager(adminKey)
console.log("dvsbdbd")
  //   faunaQueries.register('_spamthses1o@test.com', 'testtest', '_xprthBrechto', '_xoatthabrecht')
  //   .then(function(response) {
  //       console.log("sefrwsf",response); // Logs the ref to the console.
  //     })

}



const Home = () => {
  const [state, setState] = useState({
    fweets: [],
    loaded: false,
    error: false
  })
  const history = useHistory();

  // Fetch the fweets on first load.
  const sessionContext = useContext(SessionContext)
  const { user } = sessionContext.state


  useEffect(() => {
    if (!user) {
      history.push('/accounts/login')
    } else {
      console.log("Wefcwaefw")
      // setState({ error: null, fweets: [], loaded: false })
      // faunaQueries
      //   .getFweets()
      //   .then(result => {
      //     console.log('fweets', result)
      //     setState({
      //       fweets: result,
      //       loaded: true
      //     })
      //   })
      //   .catch(err => {
      //     console.log(err)
      //     const rawError = safeVerifyError(err, ['requestResult', 'responseRaw'])
      //     if (rawError.includes('Rate limiting')) {
      //       setState({ error: { message: 'Rate-limiting' }, fweets: [], loaded: true })
      //       toast.warn('You are reloading too fast')
      //     } else if (rawError.includes('permission denied')) {
      //       console.log(err)
      //       setState({ error: { message: 'Permission denied!' }, fweets: [], loaded: true })
      //       toast.error('No data permissions')
      //     } else {
      //       setState({ error: err, fweets: [], loaded: true })
      //       toast.error('Unknown error')
      //     }
      //   })
    }
  }, [user])

  // const handleCreateFweet = (message, asset) => {
  //   return faunaQueries
  //     .createFweet(message, asset)
  //     .then(fweetArray => {
  //       setState({
  //         fweets: fweetArray.concat(state.fweets),
  //         loaded: true
  //       })
  //       toast.success('Fweeted')
  //     })
  //     .catch(err => {
  //       const rawError = safeVerifyError(err, ['requestResult', 'responseRaw'])
  //       if (rawError.includes('Rate limiting')) {
  //         toast.warn('You are fweeting too fast')
  //       } else {
  //         console.error('error on Fweet', err)
  //         toast.error('Fweet failed')
  //       }
  //     })
  // }

  // const update = (fweets, loaded, error) => {
  //   setState({
  //     fweets: fweets,
  //     loaded: loaded,
  //     error: error
  //   })
  // }

  return (
    <React.Fragment>
  
      {/* <img alt="" src="/images/memes/blank/meme-blank-doge.jpg" /> */}
      <section className="header">
      Congratulations! You've been added to our waitlist. We will contact you as soon as we 
      have a critical mass of users in your area. Meanwhile, please provide a little more information
      about what you're looking for to vote on other memes other users have submitted.
     
     
      <button className="button-cta" onClick={createDummyData}>click me</button>
      </section>
    </React.Fragment>
  )
}

export default Home



// const handleSubmitLookingFor = (message, asset) => {
//   return faunaQueries
//     .submitLookingFor(message, asset)
//     .then(fweetArray => {
//       setState({
//         fweets: fweetArray.concat(state.fweets),
//         loaded: true
//       })
//       toast.success('Fweeted')
//     })
//     .catch(err => {
//       const rawError = safeVerifyError(err, ['requestResult', 'responseRaw'])
//       if (rawError.includes('Rate limiting')) {
//       //   toast.warn('You are fweeting too fast')
//       // } else {
//         console.error('error on Fweet', err)
//         toast.error('Fweet failed')
//       }
//     })
// }