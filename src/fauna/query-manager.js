import faunadb from 'faunadb'

import { registerWithUser, login, logout } from './queries/auth'
import {
  createFweet,
  getFweets,
  getFweetsByTag,
  getFweetsByAuthor,
  likeFweet,
  refweet,
  comment
} from './queries/fweets'
import { UpdateUser, FinishRegistration, GetRatedMemes, GetUserProfile, 
  SaveMatchRating, GetAllProfiles, GetAllMatches } from './queries/users'
import { SaveRating, GetUnratedMemes, GetMemesRatedMutually, GetUnratedMemesFromProfile, UploadMeme } from './queries/memes'
import { searchPeopleAndTags } from './queries/search'
import { follow } from './queries/followers'

/* Initialize the client to contact FaunaDB
 * The client is initially started with the a 'BOOTSTRAP' token.
 * This token has only two permissions, call the 'login' and 'register' User Defined Function (UDF)
 * If the login function succeeds, it will return a new token with elevated permission.
 * The client will then be replaced with a client that uses the secret that was returned by Login.
 */

class QueryManager {
  constructor(token) {
    // A client is just a wrapper, it does not create a persitant connection
    // FaunaDB behaves like an API and will include the token on each request.
    this.bootstrapToken = token || process.env.REACT_APP_LOCAL___BOOTSTRAP_FAUNADB_KEY
    this.client = new faunadb.Client({
      secret: token || this.bootstrapToken
    })
  }

  login(email, password) {
    return login(this.client, email, password).then(res => {
      if (res) {
        this.client = new faunadb.Client({ secret: res.secret })
      }
      return res
    })
  }

  register(email, password, alias, wantFriends, wantDates) {
    // const icon = 'person' + (Math.round(Math.random() * 22) + 1) // randomly choose an icon
    //ok the order of the vars here dictates the orders of the values
    return registerWithUser(this.client, email, password, alias, wantFriends, wantDates).then(res => {
      if (res) {
        this.client = new faunadb.Client({ secret: res.secret.secret })
      }
      return res
    })
  }

  logout() {
    return logout(this.client).then(res => {
      this.client = new faunadb.Client({
        secret: this.bootstrapToken
      })
      return res
    })
  }

  updateUser(
    // email, 
    alias, dob, zip, wantMemes, wantFriends, wantDates, asset01, asset02, asset03, asset04, asset05, asset06) {
    // we don't pass in the icon yet atm
    return this.client.query(UpdateUser(
      // email, 
      alias, dob, zip, wantMemes, wantFriends, wantDates, asset01, asset02, asset03, asset04, asset05, asset06))
  }

  finishRegistration(dob, zip) {
    return this.client.query(FinishRegistration(dob, zip))
  }

  saveRating(meme, rating, emoji) {
    return this.client.query(SaveRating(meme, rating, emoji))
  }
  saveMatchRating(match, rating) {
    return this.client.query(SaveMatchRating(match, rating))
  }

  getUserProfile(userAlias) {
    return this.client.query(GetUserProfile(userAlias))
  }
  
  getRatedMemes(userAlias) {
    return this.client.query(GetRatedMemes(userAlias))
  }

  getUnratedMemes() {
    return this.client.query(GetUnratedMemes())
  }

  getUnratedMemesFromProfile(profileAlias){
    return this.client.query(GetUnratedMemesFromProfile(profileAlias))
  }

  getMemesRatedMutually(profileAlias, rating1, rating2) {
    return this.client.query(GetMemesRatedMutually(profileAlias,rating1,rating2))
  }

  getAllProfiles() {
    return this.client.query(GetAllProfiles())
  }

  getAllMatches() {
    return this.client.query(GetAllMatches())
  }

  uploadMeme(asset) {
    return this.client.query(UploadMeme(asset))
  }

}
const faunaQueries = new QueryManager()
export { faunaQueries, QueryManager }
