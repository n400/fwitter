import faunadb from 'faunadb'

const q = faunadb.query
const { Create, Collection, Update, Let, Get, Identity, Var, Select } = q

function CreateUser(email, alias, wantMemes, wantFriends, wantDates) {
  return Create(Collection('users'), {
    data: {
      email: email,
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
  console.log('updating', dob, zip)
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
  alias, dob, zip, wantMemes, wantFriends, wantDates) {
  // console.log('updating', email, alias, dob, zip, wantMemes, wantFriends, wantDates)
  return Let(
    {
      accountRef: Identity(),
      userRef: Select(['data', 'user'], Get(Var('accountRef')))
    },
    Update(Var('userRef'), {
      data: {
        // email: email,
        alias: alias,
        dob: dob,
        zip: zip,
        wantMemes: wantMemes,
        wantFriends: wantFriends,
        wantDates: wantDates
      }
    })
  )
}


function SaveRating(meme) {
  console.log('updating', meme.url, meme.rating)
  return Let(
    {
      accountRef: Identity(),
      userRef: Select(['data', 'user'], Get(Var('accountRef')))
    },
    Create(Collection('meme_ratings'), {
      data: {
          user: Var('userRef'),
          meme_url: meme.url,
          meme_rating: meme.rating
          // user: Var('userRef'),
          // meme_id: Var('meme'),
          // meme_rating: Var('rating')
      }
    })
  )
}


// Let(
//   { x: "url", y: "rating" },
//   Create(
//     Collection('memes'),
//     {
//       data: {
//           user: userRef,
//           meme_url: Var('x'),
//           meme_rating: Var('y')
//       },
//     },
//   )
// )


export { CreateUser, UpdateUser, SaveRating, FinishRegistration }