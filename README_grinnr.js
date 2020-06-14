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
  Paginate(Documents(Collection("match_ratings")),{size:10000}),
  Lambda(ref => Delete(ref))
)

// update data
Map(
  Paginate(Documents(Collection("users")),{size:10000}),
  Lambda(
    "ref",
    Update(
      Var("ref"),
      {
        data: {
          wants: ['friends', 'dates'],
          wantsMemes: null
        },
      },
    )
  )
)

// react-spring https://codesandbox.io/s/frosty-firefly-4eiy1?file=/src/index.js
//
// npm install --save react-tinder-card
// npm install react-custom-scrollbars --save
// https://github.com/malte-wessel/react-custom-scrollbars
// https://github.com/3DJakob/react-tinder-card

// CREATE NEW DB

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

// Get all memes/matches the user has already rated
CreateIndex({
  name: "memes_rated_by_user",
  source: Collection("meme_ratings"),
  terms: [{field: ["data", "user"]}],
  values: [
    { field: ["data", "meme"] }
  ]
})
CreateIndex({
  name: "matches_rated_by_user",
  source: Collection("match_ratings"),
  terms: [{field: ["data", "user"]}],
  values: [
    { field: ["data", "match"] }
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

CreateIndex({
  name: "user_by_user",
  source: Collection("users"),
  terms: [
    { field: ["ref"] }
  ],
  values: [
    { field: ["ref"] }
  ]
});


CreateIndex({
  name: "users_and_r_by_users",
  // unique: true,
  source: Collection("match_scores"),
  terms: [
    { field: ["data", "users"] }
  ],
  values: []
});

CreateIndex({
  name: "users_and_r_by_users2",
  source: Collection("match_scores"),
  terms: [
    { field: ["data", "users"] }
  ],
  values: []
});

CreateIndex({
  name: "user_by_user",
  source: Collection("users"),
  terms: [
    { field: ["ref"] }
  ],
  values: [
    { field: ["ref"] }
  ]
});

// TODO: this might eventually just be wants, not separate indexes for wantsFriends and wantDates
CreateIndex({
  name: "users_by_wants",
  source: Collection("users"),
  terms: [
    { field: ["data", "wants"] }
  ],
  values: []
})

CreateIndex({
  name: "dob_by_user",
  source: Collection("user_pii"),
  terms: [
    { field: ["data", "user"] }
  ],
  values: [{ field: ["data", "dob"] }]
})

///
// FUNCTIONS
///

// get z
CreateFunction({
  name: "calc_r",
  body: Query(Lambda(['user_1',"user_2"],


  ))
})
Get(Match(Index("dob_by_user"),Ref(Collection("users"),1)))

CreateFunction({
  name: "get_age",
  body: Query(
    Lambda(["user"],
    Divide(TimeDiff( 
      ToDate(Select(0,Paginate(Match(Index("dob_by_user"), Var("user"))))),
      ToDate(SubString(ToString(Now()),0,FindStr(ToString(Now()), "T"))),
      'days'
    ),365)
  ))
})

// Call(Function("get_age"),Ref(Collection("users"),1) )

CreateFunction({
  name: "calc_stats",
  body: Query(Lambda(["size"],
  Map( // for every meme (or the first 1000 anyway)
    Paginate(Documents(Collection("memes")), {size:Var("size")}),
    Lambda("mid",
      If(
        //make sure ratings exist. else the whole function will error out
        IsNonEmpty(Match(Index("ratings_by_mid"), Var("mid") )),
        Let(
          { mean: Mean(Match(Index("ratings_by_mid"), Var("mid") )),
            sum_of_products: Sum([
              Multiply(Count(Match(Index("ratings_by_mid_and_rating"), [ Var("mid"), 5 ])), 
                Multiply(Subtract( 5, Var("mean") ),Subtract( 5,  Var("mean") ))),
              Multiply( Count(Match(Index("ratings_by_mid_and_rating"), [ Var("mid"), 4 ])), 
                Multiply(Subtract( 4,  Var("mean") ),Subtract( 4,  Var("mean") ))),
              Multiply(Count(Match(Index("ratings_by_mid_and_rating"), [ Var("mid"), 3 ])), 
                Multiply(Subtract( 3,  Var("mean") ),Subtract( 3,  Var("mean") ))),
              Multiply(Count(Match(Index("ratings_by_mid_and_rating"), [ Var("mid"), 2 ])), 
                Multiply(Subtract( 2, Var("mean") ),Subtract( 2,  Var("mean") ))),
              Multiply(Count(Match(Index("ratings_by_mid_and_rating"), [ Var("mid"), 1 ])), 
                Multiply(Subtract( 1,  Var("mean") ),Subtract( 1,  Var("mean") )))
            ]),
            variance: Divide(
              Var("sum_of_products"),
              Subtract(Count(Match(Index("ratings_by_mid"), Var("mid") )),1)
            )
          },
          //check if meme already has a document in the meme_stats collection.
          If( 
            GT(Var("variance"),0),
            If(
              IsEmpty(Match(Index("ms_by_meme"),  Var("mid")  )), 
              Create(
                Collection('meme_stats'),
                {
                  data: {
                    n: Count(Match(Index("ratings_by_mid"), Var("mid") )),
                    meme: Var("mid"),
                    mean: Var("mean"),
                    sd: Sqrt( Var("variance")),
                    1: Divide( Subtract(1,Var("mean")),Sqrt( Var("variance")) ),
                    2: Divide( Subtract(2,Var("mean")),Sqrt( Var("variance")) ),
                    3: Divide( Subtract(3,Var("mean")),Sqrt( Var("variance")) ),
                    4: Divide( Subtract(4,Var("mean")),Sqrt( Var("variance")) ),
                    5: Divide( Subtract(5,Var("mean")),Sqrt( Var("variance")) ),
                  },
                },
              ),
              // "else update it"
              Update(
                Select(['ref'],Get(Match(Index("ms_by_meme"), Var("mid")))),
                {
                  data: {
                    n: Count(Match(Index("ratings_by_mid"), Var("mid") )),
                    mean: Var("mean"),
                    sd: Sqrt( Var("variance")),
                    1: Divide( Subtract(1,Var("mean")),Sqrt( Var("variance")) ),
                    2: Divide( Subtract(2,Var("mean")),Sqrt( Var("variance")) ),
                    3: Divide( Subtract(3,Var("mean")),Sqrt( Var("variance")) ),
                    4: Divide( Subtract(4,Var("mean")),Sqrt( Var("variance")) ),
                    5: Divide( Subtract(5,Var("mean")),Sqrt( Var("variance")) ),
                  }
                }
              )
            ),
            "n too low, all x = mean"
          ),
        ),
        'no observations' 
      )
    )
  )
  ))
})

// to call it:
// Call(Function("calc_stats"),[100000])


CreateFunction({
  name: "get_z",
  body: Query(Lambda(["meme","user"],
  Let({ // get the rating. 
    rating: Select(
      ["data","rating"], 
      Get(Match(Index("rating_by_mid_and_uid"), [  Var("meme"),  Var("user") ] )))
  }, //get the z-score from the rating.
  Select(['data', ToString(
    ToNumber( Var("rating") )
    )], Get(Match(Index("ms_by_meme"), Var("meme")  )))
  )
  ))
})
// to call it:
// Call(Function("get_z"),[Ref(Collection("memes"), "1"), Ref(Collection("users"), "2")])

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



CreateFunction({
  name: "update_r",
  body: Query(Lambda(['user_1',"user_2"],
    Let({
      r_doc: Intersection(
        Match(Index("rs_by_user"), Var("user_1")),
        Match(Index("rs_by_user"), Var("user_2"))
      ),
      n: Count(Intersection(
        Match(Index("mid_by_uid"), Var("user_1") ),
        Match(Index("mid_by_uid"), Var("user_2") )
      ))
    },
    If( //see if the r exists yet for this couple
      IsNonEmpty(
        Paginate( Var("r_doc"))
      ), 
      If( 
        // GTE(TimeDiff( Epoch(Select(["ts"], Get( Var("r_doc") )
        // ),'microsecond'), Now(), 'seconds' ), 4), 
        // see if n has increased by at least 2
        GT(Subtract(          
          Var("n"),
          Select(["data", 'n'], Get( Var("r_doc") ))
        ),2),
        Update(
          Select(["ref"], Get( Var("r_doc") )),
          { data: { 
            r: Call(Function("calc_r"),[ Var("user_1"), Var("user_2") ]),
            n: Var("n")
          }, }
        ),
        ["no new mutual meme ratings for ", Var("user_1"), Var("user_2")]
      ),
      //if empty, try to create it
      Create(Collection('match_scores'),{
          data: {
            r: Call(Function("calc_r"),[ Var("user_1"), Var("user_2") ]),
            users:[ Var("user_1"), Var("user_2")],
            n: Var("n")
          },
        },
      ),
    )
  )
  ))
})

// Call(Function("update_r"),[Ref(Collection("users"), "1"), Ref(Collection("users"), "2")])





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

  // "pepper this into the deck"
        // TODO (Phase 2 when we improve the algorithm for sorting the memes): 
      // because the meme deck will eventually be sorted by the following, which the user can configure:
      // (e.g., only show: "most polarizing", "most loved","most hated","newest" )
      //    n: number of "weights" in this list
      //    f1: best (highest mean) - 10 of these, then let the user filter them
      //    f2: worst (lowest mean)
      //    f2: most controversial - meme_polarity (highest spread/sd)
      //    f3: creation date (newest) - one every nth meme
      //    f4: one every nth meme
      // if the meme has no ratings yet, we need to calculate some kind of "default mean" 
      // to make sure they get peppered into the meme deck.


      Query(
        Lambda(
          [
            "email",
            "password",
            "alias",
            "wantFriends",
            "wantDates"
          ],
          If(
            GTE(Length(Var("password")), 8),
            If(
              ContainsStrRegex(
                Var("email"),
                "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$"
              ),
              Let(
                {
                  rateLimitingPage: Paginate(
                    Match(Index("rate_limiting_by_action_and_identity"), [
                      "register",
                      "global"
                    ])
                  )
                },
                If(
                  IsEmpty(Var("rateLimitingPage")),
                  Do(
                    Create(Collection("rate_limiting"), {
                      data: { action: "register", identity: "global" }
                    }),
                    Let(
                      {
                        user: Create(Collection("users"), {
                          data: {
                            alias: Var("alias"),
                            wantFriends: Var("wantFriends"),
                            wantDates: Var("wantDates")
                          }
                        }),
                        account: Select(
                          ["ref"],
                          Create(Collection("accounts"), {
                            credentials: { password: Var("password") },
                            data: {
                              email: Var("email"),
                              user: Select(["ref"], Var("user"))
                            }
                          })
                        ),
                        secret: Login(Var("account"), { password: Var("password") })
                      },
                      Do(
                        Let(
                          {
                            followerstats: Create(Collection("followerstats"), {
                              data: {
                                postlikes: 0,
                                postrefweets: 0,
                                author: Select(["ref"], Var("user")),
                                follower: Select(["ref"], Var("user"))
                              }
                            })
                          },
                          Var("followerstats")
                        ),
                        {
                          user: Var("user"),
                          account: Var("account"),
                          secret: Var("secret")
                        }
                      )
                    )
                  ),
                  Let(
                    {
                      eventsPage: Paginate(
                        Events(Select(["data", 0], Var("rateLimitingPage"))),
                        {
                          size: 100000,
                          before: null
                        }
                      ),
                      page: Select(["data"], Var("eventsPage")),
                      firstEventOfPage: Select([0], Var("page")),
                      timestamp: Select(["ts"], Var("firstEventOfPage")),
                      time: Epoch(Var("timestamp"), "microseconds"),
                      ageInMs: TimeDiff(Var("time"), Now(), "milliseconds")
                    },
                    If(
                      Or(
                        LT(Count(Var("page")), 10),
                        And(Not(Equals(0, 10000)), GTE(Var("ageInMs"), 10000))
                      ),
                      Do(
                        Update(Select(["document"], Var("firstEventOfPage")), {
                          data: { action: "register", identity: "global" }
                        }),
                        Let(
                          {
                            user: Create(Collection("users"), {
                              data: {
                                alias: Var("alias"),
                                wantFriends: Var("wantFriends"),
                                wantDates: Var("wantDates")
                              }
                            }),
                            account: Select(
                              ["ref"],
                              Create(Collection("accounts"), {
                                credentials: { password: Var("password") },
                                data: {
                                  email: Var("email"),
                                  user: Select(["ref"], Var("user"))
                                }
                              })
                            ),
                            secret: Login(Var("account"), {
                              password: Var("password")
                            })
                          },
                          Do(
                            Let(
                              {
                                followerstats: Create(Collection("followerstats"), {
                                  data: {
                                    postlikes: 0,
                                    postrefweets: 0,
                                    author: Select(["ref"], Var("user")),
                                    follower: Select(["ref"], Var("user"))
                                  }
                                })
                              },
                              Var("followerstats")
                            ),
                            {
                              user: Var("user"),
                              account: Var("account"),
                              secret: Var("secret")
                            }
                          )
                        )
                      ),
                      Abort("Rate limiting exceeded for this user/action")
                    )
                  )
                )
              ),
              Abort("Invalid e-mail provided")
            ),
            Abort("Invalid password, please provided at least 8 chars")
          )
        )
      )

      