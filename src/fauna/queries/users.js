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
        avatar: avatar,
        avatar: avatar,
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


function UploadUserAvatar(avatar, alias, zip) {
  console.log('updating', avatar, alias, zip)
  return Let(
    {
      accountRef: Identity(),
      userRef: Select(['data', 'user'], Get(Var('accountRef')))
    },
    Update(Var('userRef'), {
      data: {
        avatar: avatar,
        alias: alias,
        zip: zip
      }
    })
  )
}


export { CreateUser, UpdateUser, UploadUserAvatar }
