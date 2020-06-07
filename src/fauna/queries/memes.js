import faunadb from 'faunadb'

const q = faunadb.query
const { Difference, Paginate, Lambda, Match, Index, Intersection, Create, Collection, Let, Get, Identity, Var, Union, ToNumber, Select } = q


// accountRef: Ref(Collection("users"), "267178220599640596"),
// userRef: Ref(Collection("users"), "267178323714507284"),

function GetMemesRatedMutually(profileAlias,rating1,rating2) {
  console.log("GetMemesRatedMutually",profileAlias,rating1,rating2)
  return Let(
    {
      // profileRef: Ref(Collection("users"), "267178220599640596"),
      // userRef: Ref(Collection("users"), "267178323714507284"),
      accountRef: Identity(),
      userRef: Select(['data', 'user'], Get(Var('accountRef'))),
      profileRef: Select(['ref'],
        Get(Match(
          Index("users_by_alias"), profileAlias
        ))
      ),
      rating1: ToNumber(rating1),
      rating2: ToNumber(rating2)
    },
    q.Map(
      Paginate(
        Union(
          Intersection(
            Match(Index("meme_by_user_and_rating"), [Var("userRef"), Var("rating1")] ),
            Match(Index("meme_by_user_and_rating"), [Var("profileRef"), Var("rating1")]  )
          ),          
          Intersection(
            Match(Index("meme_by_user_and_rating"), [Var("userRef"), Var("rating2")] ),
            Match(Index("meme_by_user_and_rating"), [Var("profileRef"), Var("rating2")]  )
          ),
          Intersection(
            Match(Index("meme_by_user_and_rating"), [Var("userRef"), Var("rating2")] ),
            Match(Index("meme_by_user_and_rating"), [Var("profileRef"), Var("rating1")]  )
          ),
          Intersection(
            Match(Index("meme_by_user_and_rating"), [Var("userRef"), Var("rating1")] ),
            Match(Index("meme_by_user_and_rating"), [Var("profileRef"), Var("rating2")]  )
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

export { GetMemesRatedMutually, GetUnratedMemesFromProfile, UploadMeme }
