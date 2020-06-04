import faunadb from 'faunadb'

const q = faunadb.query
const { Difference, Documents, Ref, Now, Paginate, Lambda, Match, Index, Intersection, Create, Collection, Let, Get, Identity, Var, Union, ToDouble, Select } = q


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
          // url: Select( //TODO: get the url from the rating itself to limit db calls
          //   ['data','url'],
          //   Get(Ref(Collection("memes"), mRefId))
          //   ),
          rating: ToDouble(rating),
          // emoji_url: emoji,
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

function GetMemesRatedMutually(profileAlias,rating1,rating2) {
  console.log("db call:",profileAlias,rating1,rating2)
  return Let(
    {
      accountRef: Identity(),
      userRef: Select(['data', 'user'], Get(Var('accountRef'))),
      profileRef: Select(['ref'],
        Get(Match(
          Index("users_by_alias"), profileAlias
        ))
      ),
      rating1: rating1,
      rating2: rating2
    },
    q.Map(
      Paginate(
        Union(
          Intersection(
            Match(Index("meme_by_uid_and_r"), [Var("userRef"), Var("rating1")] ),
            Match(Index("meme_by_uid_and_r"), [Var("profileRef"), Var("rating1")]  )
          ),          
          Intersection(
            Match(Index("meme_by_uid_and_r"), [Var("userRef"), Var("rating2")] ),
            Match(Index("meme_by_uid_and_r"), [Var("profileRef"), Var("rating2")]  )
          ),
          Intersection(
            Match(Index("meme_by_uid_and_r"), [Var("userRef"), Var("rating2")] ),
            Match(Index("meme_by_uid_and_r"), [Var("profileRef"), Var("rating1")]  )
          ),
          Intersection(
            Match(Index("meme_by_uid_and_r"), [Var("userRef"), Var("rating1")] ),
            Match(Index("meme_by_uid_and_r"), [Var("profileRef"), Var("rating2")]  )
          )
        )
      ),
      Lambda("i", Get(Var("i")))
    )
  )
}

function GetUnratedMemesFromProfile (profileAlias){
  console.log("db call:",profileAlias)
  return Let(
    {
      accountRef: Identity(),
      userRef: Select(['data', 'user'], Get(Var('accountRef'))),
      profileRef: Select(['ref'],
        Get(Match(
          Index("users_by_alias"), profileAlias
        ))
      )
    },
    q.Map(
      
    Paginate(Difference(
      Match(
        Index("memes_rated_by_user"),  Var('profileRef')
      ),
      Match(
        Index("memes_rated_by_user"),  Var('userRef')
      )
    )),
      Lambda("i", Get(Var("i")))
    )
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

export { SaveRating, GetUnratedMemes, GetMemesRatedMutually, GetUnratedMemesFromProfile, UploadMeme }
