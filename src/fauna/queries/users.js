import faunadb from 'faunadb'

const q = faunadb.query
const { Lambda, Create, Collection, Documents, Update, Let, Get, Identity, Var, Select, Now,
Paginate,Match,Index, Ref } = q

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

// console.log('getting user profile', userAlias)
      // userRef: Select(['data', 'user'], Get(Var('accountRef')))

function GetUserProfile(userAlias) {
  console.log('getting user profile', userAlias)
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

function SaveMatchRating(matchRef, rating) {
  console.log('saving match rating', matchRef, rating)
  return Let(
    {
      accountRef: Identity(),
      userRef: Select(['data', 'user'], Get(Var('accountRef'))),
      // matchRef: Select(['ref'],Get(Match(Index("users_by_alias"), matchAlias)))
    },
    Create(Collection('match_ratings'), {
      data: {
          user: Var('userRef'),
          // match: Var('matchRef'),
          match: Ref(Collection("users"), matchRef),
          match_rating: rating,
          // discovered: path to see alias of profile where they found it, if relevant
          created: Now()
      }
    })
  )
}

//get all user profiles
function GetAllProfiles() {
  // console.log('getting user profile')
  return q.Map(
    Paginate(Documents(Collection("users"))),
    Lambda("i", Get(Var("i")))
  )
}
// TODO #1
// get all users and their meme ratings
// only return the users who have the same meme ratings
// function GetMatches(userRef) { 
//   console.log('getting matches for:', userRef)
//   return Let(
//     {
//       userRef: Ref(Collection("users"), "266526604073632275")
//     },
//     Paginate(
//       Match(
//         Index("meme_ratings_by_user"),  Var('userRef')
//       ), {size: 1000})
//   )
// }





// TODO #2
//after you click on a profile preview, then you need:
//get 2 lists of meme_ratings by user
//get the intersection of them
//display list of meme ratings you've both rated the same.
//sort them with conditional rendering on the frontend to limit db latency



//This returns only the logged in user's memes. 
// could be faster to edit memes from the profile?
// function GetAuthenticatedUsersRatedMemes(userAlias) { 
//   console.log('getting rated memes')
//   return Let(
//     {
//       accountRef: Identity(),
//       userRef: Select(['data', 'user'], Get(Var('accountRef')))
//     },
//     Paginate(
//       Match(
//         Index("meme_ratings_by_user"),  Var('userRef')
//       ), {size: 1000})
//   )
// }




export { CreateUser, UpdateUser, FinishRegistration, GetUserProfile, GetRatedMemes, GetAllProfiles, SaveMatchRating }
