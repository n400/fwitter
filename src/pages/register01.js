import React, { useState, useContext } from 'react'
import { toast } from 'react-toastify'
import { safeVerifyError } from '../fauna/helpers/errors'
import { faunaQueries } from '../fauna/query-manager'
import SessionContext from '../context/session'
import { useHistory } from 'react-router-dom'
// Components
import Form from '../components/form'

const handleRegister = (event, email, password, alias, wantMemes, wantFriends, wantDates, sessionContext, history) => {
  faunaQueries
    .register(email, password, alias, wantMemes, wantFriends, wantDates)
    .then(e => {
      toast.success('User registered')
      sessionContext.dispatch({ type: 'register', data: e })
      history.push('register02')
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

const Register = () => {
  const history = useHistory()
  const sessionContext = useContext(SessionContext)
  // const memes_list = [
  //   // '/images/memes/jim/FB_IMG_1567648753248.jpg', 
  //   // '/images/memes/jim/FB_IMG_1567822761676.jpg', 
  //   // '/images/memes/jim/FB_IMG_1571669594704.jpg'
  //   'm1','m2','m3','m4','m5','m6','m7','m8','m9','m10'
  // ];
  // let meme_i = 0
  // let [meme, setMeme] = useState(memes_list[meme_i])
  // // let meme = memes_list[meme_i]
  // function setNextMeme() {
  //  meme =  memes_list[++meme_i] 
  //   console.log( meme )
  //   // setMemeRating(event.target.value)
  //   // handleSaveRating(event.target.name, event.target.value)
  // } 

  console.log(history)

  return ( 
    <>

    <div className="split-page-layout">
      <div className="main-left">
        <img 
        // onClick={setNextMeme}
        src="/images/memes/grinnr-texting-boy-girl-color.jpg" alt="grinnr is a networking and dating app that analyzes your sense of humor to find people who share your sense of humor.
" />
      </div>
      <div className="main-right">
          <Form
            isLogin={false}
            handleSubmit={(event, email, password, alias, wantMemes, wantFriends, wantDates) =>
              handleRegister(event, email, password, alias, wantMemes, wantFriends, wantDates, sessionContext, history)
            }
          ></Form>
      </div>
 </div>
    </>
  )
}

export default Register
