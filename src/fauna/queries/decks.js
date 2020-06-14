import faunadb from 'faunadb'

const q = faunadb.query
const { Call, Difference, Documents, Filter, Exists, Join, Intersection, Ref, Now, Paginate, Lambda, Match, Index, Create, Collection, Let, Get, Identity, Var, ToNumber, Select } = q

// TODO: make this run async as a user rates more memes

// Let({ //TODO: these should be filtered by friends/matches
//   user_1: Ref(Collection("users"), "267178323714507284"),
//   users: Paginate(Difference(Documents(Collection("users")),
//           Match(Index("user_by_user"), Var("user_1"))), 
//           {size: 100000}
//         )
// },
// Map(
//   Var("users"),
//   Lambda(
//     "user_2",
//     Call(Function("update_r"),[Var("user_1"), Var("user_2")])
//   )
// )
// )

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

//get all user profiles
//get all user profiles
function GetAllProfiles() {
  // console.log('getting user profile')
  return q.Map(
    Paginate(Documents(Collection("users"))),
    Lambda("i", Get(Var("i")))
  )
}



// get all users and their meme ratings
function GetAllMatches() {
  console.log('getting user profile')
  return Let({
    accountRef: Identity(),
    user: Select(['data', 'user'], Get(Var('accountRef'))),
  },
  q.Map(
    Paginate(Join(
      Difference(
        Match(Index("users_by_wants"), 'friends' ),
        Match(Index("matches_rated_by_user"), Var("user")),
        Match(Index("user_by_user"), Var("user"))
      ),
      Lambda(
        "match",
        Intersection(
          Match(Index("r_and_ref_by_user"), Var("user") ),
          Match(Index("r_and_ref_by_user"), Var("match") )
        )
      )
    ),{size: 2}),
    Lambda(
      "r_doc",
      [Select(0,Var("r_doc")),
      Get(Select(0,
        Difference(
          Select(["data", "users"], Get(Select(1,Var("r_doc")))),
          [Var("user")]
        )
      )),
      Call(q.Function("get_age"),
      // Ref(Collection("users"), "1") 
        Select(0,
          Difference(
            Select(["data", "users"], Get(Select(1,Var("r_doc")))),
            [Var("user")]
          )
        )
      )
    ]
    )
  )
)}

function CalculateMatches(){
  return Let({ 
    accountRef: Identity(),
    user_1: Select(['data', 'user'], Get(Var('accountRef'))),
    // user_1: Ref(Collection("users"), "1"),
    users: Paginate(
              Difference(
                Match(Index("users_by_wants"),  'friends' ),
                Match(Index("matches_rated_by_user"),  Var("user_1")),
                Match(Index("user_by_user"), Var("user_1"))
              ), 
            {size: 40000}
          )
  },
  q.Map(
    Var("users"),
    Lambda(
      "user_2",
      Call(q.Function("update_r"),[Var("user_1"), Var("user_2")])
    )
  )
)

}


function SaveMemeRating(mRefId, rating) {
  console.log('saving in db', rating)
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
          rating: ToNumber(rating),
          // emoji_url: emoji,
          // discovered: path to see alias of profile where they found it, if relevant
          created: Now()
      }
    })
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
          match: matchRef,
          match_rating: rating,
          // discovered: path to see alias of profile where they found it, if relevant
          created: Now()
      }
    })
  )
}



export { SaveMatchRating, SaveMemeRating, GetUnratedMemes, GetAllMatches, GetAllProfiles, CalculateMatches }
