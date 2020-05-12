import faunadb from 'faunadb'

const q = faunadb.query
const { Paginate, Match, Index, Create, Collection, Update, Let, Get, Identity, Var, Select } = q


function SaveRating(url, rating, email) {
  console.log('calling db', url, rating)
  return Let(
    {
      accountRef: Identity(),
      userRef: Select(['data', 'user'], Get(Var('accountRef')))
    },
    Create(Collection('meme_ratings'), {
      data: {
          account: Var('userRef'),
          email: email,
          meme_url: url,
          meme_rating: rating
          // user: Var('userRef'),
          // meme_id: Var('meme'),
          // meme_rating: Var('rating')
      }
    })
  )
}

function GetMemeRating(email, meme_url) {
  console.log('calling db to get rating', email, meme_url)
  return Let(
    {
      accountRef: Identity(),
      userRef: Select(['data', 'user'], Get(Var('accountRef')))
    },
    Paginate(Match(Index("rating_by_user_and_meme"), email, meme_url))
  )
}

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


export { SaveRating, GetMemeRating, UploadMeme }
