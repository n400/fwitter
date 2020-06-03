// get memes that match
// Ref(Collection('users'), '1')

Let(
  {
    me: Ref(Collection('users'), '1'),
    you: Ref(Collection('users'), '2'),
  },
  Paginate(Intersection(
    Match(Index("mid_by_uid"), Var("me") ),
    Match(Index("mid_by_uid"), Var("you") )
  ))
)

// {
//   data: [
//     Ref(Collection("memes"), "1"),
//     Ref(Collection("memes"), "2"),
//     Ref(Collection("memes"), "3"),
//     Ref(Collection("memes"), "4"),
//     Ref(Collection("memes"), "5"),
//     Ref(Collection("memes"), "6"),
//     Ref(Collection("memes"), "7"),
//     Ref(Collection("memes"), "7"),
//     Ref(Collection("memes"), "8"),
//     Ref(Collection("memes"), "9"),
//     Ref(Collection("memes"), "10"),
//     Ref(Collection("memes"), "11"),
//     Ref(Collection("memes"), "12"),
//     Ref(Collection("memes"), "13"),
//     Ref(Collection("memes"), "14"),
//     Ref(Collection("memes"), "15"),
//     Ref(Collection("memes"), "16"),
//     Ref(Collection("memes"), "17")
//   ]
// }

CreateIndex({
  name: "meme_by_uid_and_r",
  source: Collection("meme_ratings"),
  terms: [
    { field: ["data", "user"] },
    { field: ["data", "rating"] }
  ],
  values: [
    { field: ["data", "meme"] }
  ]
});


//get memes we've both liked
Let(
  {
    // accountRef: Identity(),
    // userRef: Select(['data', 'user'], Get(Var('accountRef'))),
    // profileRef: Select(['ref'],
    //   Get(Match(
    //     Index("users_by_alias"), profileAlias
    //   )),
      
    userRef: Ref(Collection("users"), "267178220599640596"),
    profileRef: Ref(Collection("users"), "267178323714507284"),
    rating1: "1",
    rating2: "2"
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




// CreateIndex({
//   name: "meme_by_uid_and_l_or_d",
//   source: {
//     collection: Collection("meme_ratings"),
//     fields: {
//       like_or_dislike: Query(Lambda(
//           "doc",
//           SubString(Select(["data", "rating"], Var("doc")), 0, 1)
//         ))
//     }
//   },
//   terms: [ { binding: "rolodex" }],
//   values: [
//     { binding: "like_or_dislike" },
//     { field: ["data", "last"] },
//     { field: ["ref"] }
//   ]
// })