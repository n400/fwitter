import React, { useEffect } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import RateMemes from './pages/rate-memes'
// import Home from './pages/home'
import Login from './pages/login'
// import User from './pages/user'
// import Tag from './pages/tag'
import Profile from './pages/profile'
import Register01 from './pages/register01'
import Register02 from './pages/register02'
import Matches from './pages/matches'
import Media from './pages/media'
import Legal from './pages/legal'
// import Waitlist from './pages/waitlist'
import Layout from './components/layout'
import { SessionProvider, sessionReducer } from './context/session'

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
              {user ? <Route exact path="/accounts/register02"><Register02 /></Route> : null}
              {user ? <Route exact path="/matches"><Matches /></Route> : null}
              {user ? <Route path="/profile/" component={Profile} /> : null}
              <Route exact path="/legal"><Legal /></Route> 
              <Route exact path="/media"><Media /></Route> 
              {/* <Route path="/users/:authorAlias" component={User} />
              <Route path="/tags/:tag" component={Tag} /> */}
              <Route path="/">
                <RateMemes />
              </Route>
            </Switch>
          </Layout>
        </SessionProvider>
      </Router>
    </React.Fragment>
  )
}

export default App
