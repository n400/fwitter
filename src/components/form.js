import React, { useState } from 'react'
import PropTypes from 'prop-types'

import { QueryManager } from '../../src/fauna/query-manager'
require('dotenv').config({ path: '.env.' + process.argv[2] })
const { handleSetupError } = require('../../src/fauna/helpers/errors')
// const faunadb = require('faunadb')
// const q = faunadb.query
// const { CreateKey, Database } = q
// const faunadb = require('faunadb')
// const q = faunadb.query
// var client = new faunadb.Client({ secret: process.env.REACT_APP_LOCAL___ADMIN })
var createDummyData = async () => {
  let adminKey = process.env.REACT_APP_LOCAL___ADMIN
  let faunaQueries = new QueryManager(adminKey)
  await handleSetupError(
    faunaQueries.register('oaumses1@test.com', 'testtest', 'iBrecht', 'uuuoatabrecht'),
    'register user1'
  )


}
// var createDummyData = () => client.query(
//   q.Create(
//     q.Collection('fweets'),
//     { data: { testField: 'ramseypoo' } }
//   )
// ).then(function(response) {
//   console.log(response.ref); // Logs the ref to the console.
// })

const Form = props => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [alias, setAlias] = useState('')
  // const [zip, setZip] = useState('')

  const handleChangeUserName = event => {
    setUsername(event.target.value)
  }

  const handleChangePassword = event => {
    setPassword(event.target.value)
  }

  const handleChangeName = event => {
    setName(event.target.value)
  }

  const handleChangeAlias = event => {
    setAlias(event.target.value)
  }

  // const handleChangeZip = event => {
  //   setZip(event.target.value)
  // }


  return (
    <React.Fragment>
      <h1 className="jim-slogan">Jim writes something funny here!</h1>
      {/* <button className="button-cta" onClick={createDummyData}>click me</button> */}
      <div className="form-wrapper">
        <h3 className="form-header">Sign up today</h3>
        <small>(or stay sad forever)</small>
        <form className="account-form" onSubmit={e => props.handleSubmit(e, username, password, alias, name)}>

          {/* {props.isLogin ? null : renderInputField('Screen name', alias, 'text', e => handleChangeAlias(e))}
          {renderInputField('Email', username, 'text', e => handleChangeUserName(e))}
          {renderInputField('Password', password, 'password', e => handleChangePassword(e))}   
          {props.isLogin ? null : renderInputField('Zip', name, 'text', e => handleChangeName(e))}          
         <div className="input-row align-right">
            <button className={props.isLogin ? 'login' : 'register'}> {props.isLogin ? 'Login' : 'Next'} </button>
            </div> */}


          {renderInputField('email', username, 'text', e => handleChangeUserName(e), 'username')}
          {props.isLogin ? null : renderInputField('name (you can change this later)', alias, 'text', e => handleChangeAlias(e))}
          {props.isLogin ? null : renderInputField('zip code (optional)', name, 'text', e => handleChangeName(e))}
          {renderInputField('password', password, 'password', e => handleChangePassword(e), 'current-password')}
          <div className="input-row align-right">
            {/* <Link to={linkInfo.link}> {linkInfo.linkText}</Link> */}
            <button className="button-cta"> {props.isLogin ? 'Login' : 'Next'} </button>
          </div>

        </form>
      </div>
    </React.Fragment>
  )
}

const renderInputField = (name, value, type, fun, autocomplete) => {
  const lowerCaseName = name.toLowerCase()
  return (
    <div className="input-row">
      <label htmlFor="{lowerCaseName}" className="input-row-column">
        {name}
      </label>
      <input
        className="input-row-column"
        value={value}
        onChange={fun}
        type={type}
        id={lowerCaseName}
        name={lowerCaseName}
        autoComplete={autocomplete}
      />
    </div>
  )
}

Form.propTypes = {
  isLogin: PropTypes.bool,
  handleSubmit: PropTypes.func
}

export default Form
