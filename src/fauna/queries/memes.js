import faunadb from 'faunadb'

const q = faunadb.query
const { Difference, Documents, Ref, Now, Paginate, Match, Index, Create, Collection, Let, Get, Identity, Var, Select } = q


function SaveRating(url, rating, email) {
  console.log('calling db', url, rating)
  return Let(
    {
      accountRef: Identity(),
      userRef: Select(['data', 'user'], Get(Var('accountRef'))),
    },
    Create(Collection('meme_ratings'), {
      data: {
          user: Var('userRef'),
          meme: Ref(Collection("memes"), url), //TODO select get real ref, but for now the url is the ref
          rating: rating,
          // emoji: emoji,
          created: Now()
          // user: Var('userRef'),
          // meme_id: Var('meme'),
          // meme_rating: Var('rating')
      }
    })
  )
}

function GetRatedMemes(user) {
  console.log('getting unrated memes')
  return Let(
    {
      accountRef: Identity(),
      userRef: Select(['data', 'user'], Get(Var('accountRef')))
    },
    Paginate(
      Match(
        Index("memes_rated_by_user"),  Ref(Collection("users"), "265231995802485267")
      ), {size: 1000})
  )
}

function GetUnratedMemes(user) {
  console.log('getting unrated memes')
  return Let(
    {
      accountRef: Identity(),
      userRef: Select(['data', 'user'], Get(Var('accountRef')))
    },
    Paginate(Difference(
      Documents(Collection("memes")),
      Match(
        Index("memes_rated_by_user"),  Ref(Collection("users"), "265231995802485267")
      )
    ), {size: 1000})
  )
}

// function GetMemeRating(email, meme_url) {
//   console.log('calling db to get rating', email, meme_url)
//   return Let(
//     {
//       accountRef: Identity(),
//       userRef: Select(['data', 'user'], Get(Var('accountRef')))
//     },
//     Paginate(Match(Index("rating_by_user_and_meme"), email, meme_url))
//   )
// }

function UploadMeme(asset ) {
  console.log('saving meme to db', asset)
  return Let(
    {
      accountRef: Identity(),
      userRef: Select(['data', 'user'], Get(Var('accountRef')))
    },
    Create(Collection('memes'), {
      data: {
          asset: asset
      }
    })
  )
}


export { SaveRating, GetUnratedMemes, UploadMeme, GetRatedMemes }
