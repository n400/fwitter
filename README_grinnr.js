REACT_APP_LOCAL___ADMIN=fnADrXh4zeACE6x7m4IRfzqSExtqoaI1LtIqovpC
REACT_APP_LOCAL___BOOTSTRAP_FAUNADB_KEY=fnADrb8WMYACE9le640bhudOWQgd-pDxZwGOki_-
REACT_APP_LOCAL___CHILD_DB_NAME=fwitter
REACT_APP_LOCAL___CLOUDINARY_CLOUDNAME=n400
REACT_APP_LOCAL___CLOUDINARY_TEMPLATE=ml_default
REACT_APP_LOCAL___DEBUG_AUTO_LOGIN_USER=contractparty3@gmail.com
REACT_APP_LOCAL___DEBUG_AUTO_LOGIN_PWORD=testtest


// to make the old fwitter work:

// 1. do something with the users.name var you removed it from the db queries, but it's still in the FE code

// to make grinnr work if you delete the db and npm run setup:
// 1. Create meme_ratings collection
// 2. create memes collection and populate it with the Map() function in public\images\memes\jim\filenames.txt
// 3. create the following indexes:
      // meme_ratings_by_user
      // memes_rated_by_user
// 4. create a new role that can view/rate memes and profiles. grant it required permissions.

// example ref
Ref(Collection('users'), '1')

//delete all meme ratings
Map(
  Paginate(Documents(Collection("match_scores")),{size:10000}),
  Lambda(ref => Delete(ref))
)

//see all previously rated memes with their ratings
CreateIndex({
  name: "meme_ratings_by_user",
  source: Collection("meme_ratings"),
  terms: [{field: ["data", "user"]}],
  values: [
    { field: ["data", "meme"] },
    { field: ["data", "rating"] }
  ]
})

// Get all memes the user has already rated
CreateIndex({
  name: "memes_rated_by_user",
  source: Collection("meme_ratings"),
  terms: [{field: ["data", "user"]}],
  values: [
    { field: ["data", "meme"] }
  ]
})

// For each meme/rating combo, i need to run this:
CreateIndex({
  name: "users_by_meme_and_rating",
  source: Collection("meme_ratings"),
  terms: [
    { field: ["data", "meme"] },
    { field: ["data", "rating"] },
  ],
  values: [
    {field: ["data", "user"]}
  ]
})

// For each meme/rating combo, i need to run this:
CreateIndex({
  name: "user_and_meme_ratings_by_meme_and_rating",
  source: Collection("meme_ratings"),
  terms: [
    { field: ["data", "meme"] },
    { field: ["data", "rating"] },
  ],
  values: [
    {field: ["data", "user"]},
    { field: ["data", "meme"] },
    { field: ["data", "rating"] }
  ]
})

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
  name: "ratings_by_uid",
  source: Collection("meme_ratings"),
  terms: [
    { field: ["data", "user"] }
  ],
  values: [
    { field: ["data", "meme"] },
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
  name: "meme_by_user_and_rating",
  source: Collection("meme_ratings"),
  terms: [
    { field: ["data", "user"] },
    { field: ["data", "rating"] }
  ],
  values: [
    { field: ["data", "meme"] }
  ]
});

// Get(Match(Index("meme_by_user_and_rating"),[ Ref(Collection("users"), "267178323714507284"), 5]))

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

//matching users
CreateIndex({
  name: "rs_by_user",
  source: Collection("match_scores"),
  terms: [
    { field: ["data", "users"] }
  ],
  values: [
    { field: ["data", "r"] },
    { field: ["ref"] },
  ]
})

// calculate r
CreateFunction({
  name: "calc_r",
  body: Query(Lambda(['user_1',"user_2"],
  Let({
    user_1: Var("user_1"),
    user_2: Var("user_2"),
    shared_memes_with_stats:
     //new memes could have ratings, but not have stats calculated yet (because calculating the stats gets expensive as it requires reading every rating)
     Filter( Paginate(Intersection(
       Match(Index("mid_by_uid"),  Var("user_1")  ),
       Match(Index("mid_by_uid"),  Var("user_2") )
     ), {size:100000}),
     Lambda( 'mid',
         IsNonEmpty(  Match(Index("ms_by_meme"), Var("mid"))  )
       ) 
     ),
     products: 
     Map( Var("shared_memes_with_stats"),
       // for each shared mid
       Lambda('mid',
         Let( // (this could be refactored to make it shorter by nesting it in another let for each user)
           { first_z: Let({ // get the rating. 
                           rating: Select(["data","rating"], Get(Match(Index("rating_by_mid_and_uid"), [  Var("mid"),  Var("user_1") ]  )))
                         }, //get the z-score from the rating.
                         Select(['data', ToString(
                           ToInteger( Var("rating") )
                           )],Get(Match(Index("ms_by_meme"), Var("mid")  )))
                       ), 
             second_z: Let({ rating: Select(["data","rating"], Get(Match(Index("rating_by_mid_and_uid"), [  Var("mid"),  Var("user_2") ]  )))
                           }, Select(['data', ToString( ToInteger( Var("rating") ) )],Get(Match(Index("ms_by_meme"), Var("mid")  )))),
           },
           Multiply(  Var("first_z"),  Var("second_z") )
         )
       )
     ) 
   },
   Divide(
     Sum( Select(["data"], Var("products")) ),
     //divide by n-1
     Subtract(Select(["data",0], Count( Var("shared_memes_with_stats") )),1)
   )
  )
  ))
})

// to call it:
// Call(Function("calc_r"),[Ref(Collection("users"), "1"), Ref(Collection("users"), "2")])



  //TODO: 
//  1. zeit or netlify?
//  2. help@grinnr.com
//  3. generic privacy policy, tos pages 
//  4. create collection of memes by user who uploaded them (like the fewwet; can probably resue that code)
//
  //BUGS:
  // 1. refresh user info after finishregistration function (whatever happens after updateuser) so that it appears 
  //    in the profile page without having to refresh/re-login
  // 2. only show memes user has not yet rated
  //
  //
  // NICE TO HAVE:
  // 1. add memes for moderation, to memes collection? should meme_ratings be restrctured? 
  //    Or keep it flat and rely on indexes? But then we will run into pagination issues, right? which way is easier?
  // 2. allow user to re-rate memes?
  //
  // NOT BLOCKER FOR LAUNCH *(can rely on help@grinnr.com)
  // 2. make email editable via profile (update account info when the user info gets updated)
  // 3. not a blocker for launch: password reset flow, make password editable
  // 4. not a blocker for launch: lambda to stay logged in
