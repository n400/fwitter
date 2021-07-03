import faunadb from 'faunadb'

const q = faunadb.query
const { Lambda, Create, Collection, Update, Let, Get, Identity, Var, Select, Now,
Paginate,Match,Index,Ref } = q

function CreateUser(alias, wantMemes, wantFriends, wantDates) {
  return Create(Collection('users'), {
    data: {
      alias: alias,
      wantMemes: wantMemes,
      wantFriends: wantFriends,
      wantDates: wantDates
    }
  })
}

/* We could place this function as well in a UDF and just derive the user to update from
 * the Identity() which we do not need to pass as a paramter.
 * Instead, shows a different approach, security via Roles.
 */

function FinishRegistration(dob, zip) {
  // console.log('updating', dob, zip)
  return Let(
    {
      accountRef: Identity(),
      userRef: Select(['data', 'user'], Get(Var('accountRef')))
    },
    Update(Var('userRef'), {
      data: {
        dob: dob,
        zip: zip
      }
    })
  )
}

function UpdateUser(
  // email, 
  alias, dob, zip, wantMemes, wantFriends, wantDates, asset01, asset02, asset03, asset04, asset05, asset06) {
  // console.log('updating', email, alias, dob, zip, wantMemes, wantFriends, wantDates)
  return Let(
    {
      accountRef: Identity(),
      userRef: Select(['data', 'user'], Get(Var('accountRef')))
    },
    Update(Var('userRef'), {
      data: {
        // email: email, //TODO move the email to a settings page. edit settings that way
        alias: alias,
        dob: dob,
        zip: zip, //same with zip some day, but not right now
        wantMemes: wantMemes,
        wantFriends: wantFriends,
        wantDates: wantDates,
        asset01: asset01,
        asset02: asset02,
        asset03: asset03,
        asset04: asset04,
        asset05: asset05,
        asset06: asset06,
        created: Now()
      }
    })
  )
}

function GetUserProfile(userAlias) {
  // console.log('getting user profile', userAlias)
  return Let(
    {
      accountRef: Identity(),
      userAlias: userAlias
    },
    q.Map(
      Paginate(
        Match(
          Index("users_by_alias"),  Var('userAlias')
        ), {size: 100}),
      Lambda("i", Get(Var("i")))
    )
  )
}

function GetUserSettings(){
  console.log("trying")
  return Let(
    {
      accountRef: Identity(),
      userRef: Select(['data', 'user'], Get(Var('accountRef')))
    },

     // if the user wants dates
      Get(Match(Index("assetsD_by_user"), Ref(Collection("users"), "1" ))),
      // if the user wants friends
      Get(Match(Index("assetsF_by_user"), Ref(Collection("users"), "1" ))) 
    
  )

}

// Ask Brecht or someone: Should i be saving the meme ratings 
// in the user collection instead of a separate meme_ratings collection?
function GetRatedMemes(userAlias) { 
  console.log('getting rated memes for:', userAlias)
  return Let(
    {
      userRef: Select(['ref'],
        Get(Match(
          Index("users_by_alias"), userAlias
        ))
      )
    },
    Paginate(
      Match(
        Index("meme_ratings_by_user"),  Var('userRef')
      ), {size: 1000})
  )
}








export { CreateUser, UpdateUser, FinishRegistration, GetUserProfile, GetUserSettings,
  GetRatedMemes }
