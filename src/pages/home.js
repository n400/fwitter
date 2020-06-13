import React, { useState, useContext } from 'react'
import { toast } from 'react-toastify'
import { safeVerifyError } from '../fauna/helpers/errors'
import { faunaQueries } from '../fauna/query-manager'
import SessionContext from '../context/session'
import { useHistory } from 'react-router-dom'
// Components
import Form from '../components/form'

const handleRegister = (event, email, password, alias, 
  wantFriends, wantDates, sessionContext, history) => {
  faunaQueries
    .register(email, password, alias, wantFriends, wantDates)
    .then(e => {
      toast.success('User registered')
      sessionContext.dispatch({ type: 'register', data: e })
      history.push('/accounts/register02')
    })
    .catch(err => {
      const errorCode = safeVerifyError(err, [
        'requestResult',
        'responseContent',
        'errors', // The errors of the call
        0,
        'cause', // the underlying cause (the error in the function)
        0,
        'code'
      ])
      const description = safeVerifyError(err, [
        'requestResult',
        'responseContent',
        'errors', // The errors of the call
        0,
        'cause', // the underlying cause (the error in the function)
        0,
        'description'
      ])
      if (errorCode === 'instance not unique') {
        toast.error('An account with that e-mail or alias already exists')
      } else if (description.includes('Invalid e-mail provided')) {
        toast.error('Invalid e-mail format')
      } else if (description.includes('Invalid password')) {
        toast.error('Invalid password, please provide at least 8 chars')
      } else {
        console.log(err)
        toast.error('Oops, something went wrong')
      }
    })
  event.preventDefault()
}


const setNextMeme = () => {
  faunaQueries
  .getAllProfiles()
  .then(res => {
    console.log( res)
  })
  .catch(err => {
    console.log(err)
    toast.error('getting profiles failed')
  })
}

const Register = () => {
  const history = useHistory()
  const sessionContext = useContext(SessionContext)

  return ( 
    <>

    <div className="split-layout">
      <div className="">
        <h1>Home page learn all about grinnr</h1>
      </div>
      <div className="main-left">
        <img 
        onClick={setNextMeme}
        src="/images/memes/grinnr-texting-boy-girl-color.jpg" alt="grinnr is a networking and dating app that analyzes your sense of humor to find people who share your sense of humor.
" />
      </div>
      <div className="main-right">
          <Form
            isLogin={false}
            handleSubmit={(event, email, password, alias, wantFriends, wantDates) =>
              handleRegister(event, email, password, alias, wantFriends, wantDates, sessionContext, history)
            }
          ></Form>
      </div>
 </div>
    </>
  )
}

export default Register
