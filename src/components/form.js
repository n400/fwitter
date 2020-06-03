import React, { useState } from 'react'
import PropTypes from 'prop-types'
import {renderInputField} from './input'
import { QueryManager } from '../../src/fauna/query-manager'
require('dotenv').config({ path: '.env.' + process.argv[2] })
const { handleSetupError } = require('../../src/fauna/helpers/errors')
// const faunadb = require('faunadb')
// const q = faunadb.query
// const { CreateKey, Database } = q
// const faunadb = require('faunadb')
// const q = faunadb.query
// var client = new faunadb.Client({ secret: process.env.REACT_APP_LOCAL___ADMIN })

const Form = props => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  // const [name, setName] = useState('')
  const [alias, setAlias] = useState('')
  // const [wantMemes, setWantMemes] =useState('')
  // const [wantFriends, setWantFriends] = useState('')
  // const [wantDates, setWantDates] = useState('')

  const handleChangeEmail = event => {
    setEmail(event.target.value)
  }
  const handleChangePassword = event => {
    setPassword(event.target.value)
  }
  const handleChangeAlias = event => {
    setAlias(event.target.value)
  }
  // const handleChangeWantMemes = event => {
  //   setWantMemes(event.target.checked)
  // }
  // const handleChangeWantFriends = event => {
  //   setWantFriends(event.target.checked)
  // }
  // const handleChangeWantDates = event => {
  //   setWantDates(event.target.checked)
  // }



  return (
    <React.Fragment>

      <div className="form-wrapper">
      <div className="form-header">
        <h1>{props.isLogin ? "welcome to grinnr" : "sign up today"}</h1>
        <small>{props.isLogin ? "(the end is near... if you know what i mean)" : "(or stay sad forever)"}</small>
      </div>
      <form className="account-form form-with-button-checkboxes" onSubmit={e => props.handleSubmit(e, email, password, alias )}>
        {/* {props.isLogin ? null : 
            <div className="input-row">
              <label className="button-row-label">why grinnr? (select all that apply)</label>
              <div className="button-checkboxes">
                <div className="input-group">
                  <input type="checkbox" id="memes" checked={wantMemes} onChange={handleChangeWantMemes} />
                  <label htmlFor="memes">memes</label>
                </div>
                <div className="input-group">
                  <input type="checkbox" id="friends" checked={wantFriends} onChange={handleChangeWantFriends} />
                  <label htmlFor="friends">friends</label>
                </div>
                <div className="input-group">
                  <input type="checkbox" id="dates" checked={wantDates} onChange={handleChangeWantDates} />
                  <label htmlFor="dates">dates</label>
                </div>
              </div>
            </div>
          } */}
          
          {renderInputField('email', email, 'text', e => handleChangeEmail(e), 'email')}
          {props.isLogin ? null : renderInputField('handle (you can change this later)', alias, 'text', e => handleChangeAlias(e))}

          {renderInputField('password', password, 'password', e => handleChangePassword(e), 'current-password')}
          <div className="input-row align-right">
            <button className="button-cta"> {props.isLogin ? 'Login' : 'Next'} </button>
          </div>

        </form>
      </div>
      
    </React.Fragment>
  )
}

// const renderInputField = (name, value, type, fun, autocomplete) => {
//   const lowerCaseName = name.toLowerCase()
//   return (
//     <div className="input-row">
//       {/* <label htmlFor="{lowerCaseName}" className="input-row-column">
//         {name}
//       </label> */}
//       <input
//         className="input-row-column"
//         placeholder={name}
//         value={value}
//         onChange={fun}
//         type={type}
//         id={lowerCaseName}
//         name={lowerCaseName}
//         autoComplete={autocomplete}
//       />
//     </div>
//   )
// }

Form.propTypes = {
  isLogin: PropTypes.bool,
  handleSubmit: PropTypes.func
}

export default Form
