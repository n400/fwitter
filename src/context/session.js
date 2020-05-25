import React from 'react'

const SessionContext = React.createContext({})

export const sessionReducer = (state, action) => {
// console.log("action", action)
  switch (action.type) {
    case 'login': {
      return { user: action.data.user }
    }
    case 'register': {
      console.log(action.data.user)
      return { user: action.data.user }
    }
    case 'logout': {
      return { user: null }
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`)
    }
  }
}

export const SessionProvider = SessionContext.Provider
export const SessionConsumer = SessionContext.Consumer
export default SessionContext

// action 
  // {type: "login", data: {…}}
  // data:
    // account: {ref: Ref, ts: 1590359753400000, email: "contractparty3@gmail.com", user: Ref}
    // secret: "fnEDsswt_oACEgOtvxH4QAITiFpcsMkTXvJ75hxJiK5LOnItivk"
    // user: {ref: Ref, ts: 1590373285920000, email: "contractparty3@gmail.com", alias: "bigmac", wantMemes: true, …}


// and running the following from profile.js

// console.log( "sessioncontext:", useContext(SessionContext) )

// returns the following

//     sessioncontext: 
//     {state: {…}, dispatch: ƒ}
//         dispatch: ƒ ()
//         state:
//             user:
//                 alias: "bigmac"
//                 asset01: ""
//                 asset02: ""
//                 asset03: ""
//                 asset04: ""
//                 asset05: ""
//                 asset06: ""
//                 created: FaunaTime {value: "2020-05-25T02:21:25.767736Z"}
//                 dob: ""
//                 email: "contractparty3@gmail.com"
//                 ref: Ref
//                     value: {id: "266444108835324436", collection: Ref}
//                     class: (...)
//                     collection: (...)
//                     database: (...)
//                     id: (...)
//                     __proto__: Value
//                 ts: 1590373285920000
//                 wantDates: true
//                 wantFriends: true
//                 wantMemes: true
//                 zip: "12345"

// so.. TODO2: this doesnt all need to be passed along as global variables. 
// in fact, then you arent getting updates when you reload your own profile
// TODO1: flatten fetchedProfile to look like the above users output, not an indexed array