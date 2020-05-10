import faunadb from 'faunadb'

const q = faunadb.query
const { Create, Collection, Update, Let, Get, Identity, Var, Select } = q

function CreateUser(email, alias, wantMemes, wantFriends, wantDates, icon) {
  return Create(Collection('users'), {
    data: {
      email: email,
      alias: alias,
      wantMemes: wantMemes,
      wantFriends: wantFriends,
      wantDates: wantDates,
      icon: icon
    }
  })
}

/* We could place this function as well in a UDF and just derive the user to update from
 * the Identity() which we do not need to pass as a paramter.
 * Instead, shows a different approach, security via Roles.
 */

function UpdateUser(avatar, alias, zip, icon, wantMemes, wantFriends, wantDates) {
  console.log('updating', avatar, alias, zip, icon, wantMemes, wantFriends, wantDates)
  return Let(
    {
      accountRef: Identity(),
      userRef: Select(['data', 'user'], Get(Var('accountRef')))
    },
    Update(Var('userRef'), {
      data: {
        alias: alias,
        zip: zip,
        icon: icon,
        wantMemes: wantMemes,
        wantFriends: wantFriends,
        wantDates: wantDates,
        avatar: avatar
      }
    })
  )
}


function SaveRating(meme, rating) {
  console.log('updating', meme, rating)
  return Let(
    {
      accountRef: Identity(),
      userRef: Select(['data', 'user'], Get(Var('accountRef')))
    },
    Create(Collection('meme_ratings'), {
      data: {
          user: Var('userRef'),
          meme_id: meme,
          meme_rating: rating
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


export { CreateUser, UpdateUser, SaveRating }
