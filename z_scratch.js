//POST-DESIGN
// meme ratings collections and indexes
CreateCollection({"name": "meme_ratings", "history_days": 0});
CreateIndex({
  name: "ratings_by_mid",
  source: Collection("meme_ratings"),
  terms: [
    { field: ["data", "meme"] }
  ],
  values: [
    { field: ["data", "rating"] }
  ]
});
CreateIndex({
  name: "ratings_by_mid_and_rating",
  source: Collection("meme_ratings"),
  terms: [
    { field: ["data", "meme"] },
    { field: ["data", "rating"] },
  ],
  values: [
    { field: ["data", "rating"] }
  ]
});
CreateIndex({
  name: "rating_by_mid_and_uid",
  source: Collection("meme_ratings"),
  terms: [
    { field: ["data", "meme"] },
    { field: ["data", "user"] },
  ],
  values: [
    { field: ["data", "rating"] }
  ]
});

CreateIndex({
  name: "mid_by_uid",
  source: Collection("meme_ratings"),
  terms: [
    { field: ["data", "user"] }
  ],
  values: [
    { field: ["data", "meme"] }
  ]
});
CreateIndex({
  name: 'meme_by_meme',
  source: Collection('memes'),
  terms: [{field:  ['ref']}]
});

//meme stats collections and indexes
CreateCollection({"name": "meme_stats", "history_days": 0});
CreateIndex({
  name: 'ms_by_meme',
  source: Collection('meme_stats'),
  terms: [{field:  ["data", "meme"]}],
  values: [{field:  ["ref"]}]
});
CreateIndex({
  name: 'ms_by_ms',
  source: Collection('meme_stats'),
  terms: [{field:  ['ref']}]
});




// TODO: correlation coefficient.  works with size: 1, but not at default.
// needs some if isnotempty in the z definitions. figure it out
Divide(
  Select(["data",0], Sum(
    // for each shared mid
    Map(
      Paginate(
        Intersection(
          Match(Index("mid_by_uid"), Ref(Collection("users"), "1") ),
          Match(Index("mid_by_uid"), Ref(Collection("users"), "2"))
        ), {size:1}
      ),
      
      // sum the products of the standardized values of each observation
      Lambda(
        'mid',
        Let(
          { first_z: 
                Let({ // get the rating
                      rating: Select(["data","rating"], Get(Match(Index("rating_by_mid_and_uid"), [  Var("mid"), Ref(Collection("users"), "1")  ]  )))
                    },
                    //get the z-score from the rating
                    Select(['data', ToString(Var("rating"))],Get(Match(Index("ms_by_meme"), Var("mid")  )))
                ),
            second_z: 
                Let({ // get the rating
                      rating: Select(["data","rating"], Get(Match(Index("rating_by_mid_and_uid"), [  Var("mid"), Ref(Collection("users"), "1")  ]  )))
                    },
                    //get the z-score from the rating
                    Select(['data', ToString(Var("rating"))],Get(Match(Index("ms_by_meme"), Var("mid")  )))
                ),
          },
          Multiply( 
            Var("first_z"), 
            Var("second_z") 
          )
        )
      )
    )
  )
  )
  ,
  //divide by n... TODO: needs to be changed to n-1
  Count(
      Intersection(
        Match(Index("mid_by_uid"), Ref(Collection("users"), "1") ),
        Match(Index("mid_by_uid"), Ref(Collection("users"), "2"))
      )  
  )
)








,
second_z: 'Select(Get(     ) )',


// TODO
// THEN get the z-score of each meme rating
Select(['ref'],Get(Match(Index("ms_by_meme"), Var("mid"))))


// Let({
//     user1:  Ref(Collection("users"), "1"),
//     user2:  Ref(Collection("users"), "2")
//   },
Divide(
  Sum(
    // now we have to multiple the zscore tuples for each user to get an array here that we can sum
    
  ),
  //the list of memes both users have rated:
  Count(Intersection(
    Match(Index("mid_by_uid"), Ref(Collection("users"), "1") ),
    Match(Index("mid_by_uid"), Ref(Collection("users"), "2"))
  ))
)
// )

// OK. we need to iterate through the above set for every user pair
// we then need to use the mid to get 
// rating_by_uid_and_mid from meme_ratings collection
// THEN, we need 
// z_by_uid_and_mid from the memes collection
// also, what happens when a user rates more memes? can we calculate how many new matches they've unlocked?
// calculate the sample size needed to get a statsig r



///////////////////////////////////////////////////
///////////////////////////////////////////////////
///////////////////////////////////////////////////
///////////////////////////////////////////////////
///////////////////////////////////////////////////
///////////////////////////////////////////////////
///////////////////////////////////////////////////
///////////////////////////////////////////////////
///////////////////////////////////////////////////
///////////////////////////////////////////////////


// step #1
// this provides a list of all memes they've both rated.
// iterate through this
Intersection(
  Match(Index("mid_by_uid"), Ref(Collection("users"), "1") ),
  Match(Index("mid_by_uid"), Ref(Collection("users"), "2"))
)

[
  Ref(Collection("memes"), "1"),
  Ref(Collection("memes"), "2"),
  Ref(Collection("memes"), "3"),
  Ref(Collection("memes"), "4"),
  Ref(Collection("memes"), "5"),
  Ref(Collection("memes"), "6"),
  Ref(Collection("memes"), "7"),
  Ref(Collection("memes"), "7"),
  Ref(Collection("memes"), "8"),
  Ref(Collection("memes"), "9"),
  Ref(Collection("memes"), "10"),
  Ref(Collection("memes"), "11"),
  Ref(Collection("memes"), "12"),
  Ref(Collection("memes"), "13"),
  Ref(Collection("memes"), "14"),
  Ref(Collection("memes"), "15"),
  Ref(Collection("memes"), "16"),
  Ref(Collection("memes"), "17")
]