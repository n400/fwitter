import React, { useEffect } from 'react'
// import ReactDOM from "react-dom";
import { Link, BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import RateMemes from './pages/meme-deck'
import Home from './pages/home'
import Login from './pages/login'
import ProfileEdit from './pages/profile-edit'
import Profile from './pages/profile'
import Settings from './pages/settings'
import Profiles from './pages/profiles'
import Register01 from './pages/register01'
import Register02 from './pages/register02'
import RateMatches from './pages/match-deck'
import Media from './pages/media'
import Legal from './pages/legal'
import Layout from './components/layout'
import { SessionProvider, sessionReducer } from './context/session'
// TODO: // const IndexPage = () => {return <h3>Home Page</h3>;};

const App = () => {
  const [state, dispatch] = React.useReducer(sessionReducer, { user: null })
  const { user } = state

  const loadScript = url => {
    const script = document.createElement('script')
    script.async = true
    script.src = url
    document.head.appendChild(script)
  }

  useEffect(() => {
    // Load all cloudinary scripts
    loadScript('https://widget.cloudinary.com/v2.0/global/all.js')
  }, [])

  // console.log("user",user)
  // Return the header and either show an error or render the loaded profiles.
  return (
    <React.Fragment>
      <Router>
        <SessionProvider value={{ state, dispatch }}>
          <Layout>
            <Switch>
              <Route exact path="/accounts/login">
                <Login />
              </Route>
              <Route exact path="/accounts/register">
                <Register01 />
              </Route>
              {/* //TODO change the actual path when there is no user instead of just the content, 
                         changing null to a 404 will probably do this. also have a non-JS fallback 
                         page in case the app breaks b your queries suck or something. research 
                         techniques for js fallback and 404 with cra */}
              {user ? <Route exact path="/accounts/register02"><Register02 /></Route> : null}
              {user ? <Route path="/settings" component={Settings} /> : null}
              {user ? <Route path="/profile-edit" component={ProfileEdit} /> : null}
              <Route exact path="/legal"><Legal /></Route> 
              <Route exact path="/media"><Media /></Route>
              <Route exact path="/profiles" component={Profiles} />
              {user ? <Route exact path="/matches"><RateMatches /></Route> : null}
              {user ? <Route exact path="/memes"><RateMemes /></Route> : null}
              {user ? <Route exact path="/profile/:userAlias" component={Profile} /> : null}


              <Route exact path="/"><Home /></Route>
            </Switch>
          </Layout>
        </SessionProvider>
      </Router>
    </React.Fragment>
  )
}





export default App



