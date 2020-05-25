import faunadb from 'faunadb'

const q = faunadb.query
const { Difference, Documents, Ref, Now, Paginate, Match, Index, Create, Collection, Let, Get, Identity, Var, Select } = q


function SaveRating(mRefId, rating, emoji) {
  // console.log('calling db', mRefId, rating, emoji)
  return Let(
    {
      accountRef: Identity(),
      userRef: Select(['data', 'user'], Get(Var('accountRef'))),
    },
    Create(Collection('meme_ratings'), {
      data: {
          user: Var('userRef'),
          meme: Ref(Collection("memes"), mRefId), //TODO select get real ref, but for now the url is the ref
          url: Select( //TODO: get the url from the rating itself to limit db calls
            ['data','url'],
            Get(Ref(Collection("memes"), mRefId))
            ),
          rating: rating,
          emoji_url: emoji,
          // discovered: path to see alias of profile where they found it, if relevant
          created: Now()
      }
    })
  )
}

function GetUnratedMemes(user) {
  // console.log('getting unrated memes')
  return Let(
    {
      accountRef: Identity(),
      userRef: Select(['data', 'user'], Get(Var('accountRef')))
    },
    Paginate(Difference(
      Documents(Collection("memes")),
      Match(
        Index("memes_rated_by_user"),  Var('userRef')
      )
    ), {size: 3})
  )
}

function UploadMeme(asset ) {
  // console.log('saving meme to db', asset)
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

export { SaveRating, GetUnratedMemes, UploadMeme }
