Map(
  //TODO: filter out only the users who are looking for dates/friends...
  // ...and then the additional filtering criteria (gender, age, etc)
  Paginate(Documents(Collection("users")), {size:100000}),
  Lambda(
    "potential_match",

    Let({
      user_1: Ref(Collection("users"), "267178323714507284") 
     ,user_2: Var("potential_match")
     ,shared_memes_with_stats:
       //new memes could have ratings, but not have stats calculated yet (because calculating the stats gets expensive as it requires reading every rating)
       Filter( Paginate(Intersection(
         Match(Index("mid_by_uid"),  Var("user_1")  ),
         Match(Index("mid_by_uid"),  Var("user_2") )
       ), {size:100000}),
       Lambda( 'mid',
           IsNonEmpty(  Match(Index("ms_by_meme"), Var("mid"))  )
         ) 
       )
     ,products: 
       Map( Var("shared_memes_with_stats"),
         // for each shared mid
         Lambda('mid',
           Let( // (TODO: DRY up these first_z and second_z queries by nesting in another let for each user)
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
    ,match_score: 
      Divide(
        Sum( Select(["data"], Var("products")) ),
        //divide by n-1
        Subtract(Select(["data",0], Count( Var("shared_memes_with_stats") )),1)
      )
     },

     Create(
      Collection('match_scores'),
      {
        data: {
          r: Var("match_score"),
          users:[ Var("user_1"), Var("user_2")]
        },
      },
    )
    )
)
)




Map(
  Paginate(Documents(Collection("users")), {size:100000}),
  Lambda( 
    "user_1",
    Let( 
      { 
        user_1: Var("user_1"),
        user_2: Ref(Collection("users"), "267178220599640596")
      },    
      If( //see if the r exists yet for this couple
        IsEmpty(
          Paginate(Intersection(
            Match(Index("rs_by_user"), Ref(Collection("users"), "267178323714507284")),
            Match(Index("rs_by_user"), Ref(Collection("users"), "267178220599640596"))
          ))
        ),
        //if not, create it
        Let({ shared_memes_with_stats:
                //new memes could have ratings, but not have stats calculated yet (because calculating the stats gets expensive as it requires reading every rating)
                Filter( Paginate(Intersection(
                  Match(Index("mid_by_uid"),  Var("user_1")  ),
                  Match(Index("mid_by_uid"),  Var("user_2") )
                ), {size:100000}),
                Lambda( 'mid',
                    IsNonEmpty(  Match(Index("ms_by_meme"), Var("mid"))  )
                  ) 
                )
              ,products: 
                Map( Var("shared_memes_with_stats"),
                  // for each shared mid
                  Lambda('mid',
                    Let( // (TODO: DRY up these first_z and second_z queries by nesting in another let for each user)
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
              ,match_score: 
                Divide(
                  Sum( Select(["data"], Var("products")) ),
                  //divide by n-1
                  Subtract(Select(["data",0], Count( Var("shared_memes_with_stats") )),1)
                )
              },

              Create(
                Collection('match_scores'),
                {
                  data: {
                    r: Var("match_score"),
                    users:[ Var("user_1"), Var("user_2")]
                  },
                },
              )
        ),
        //if so, see if it's been updated in last 4 hours (TODO: change to last login date, or last time they rated at least 5 of the same memes)
        If(
          GTE(TimeDiff( Epoch(Select(["ts"], Get(Intersection(
            Match(Index("rs_by_user"), Ref(Collection("users"), "267178323714507284")),
            Match(Index("rs_by_user"), Ref(Collection("users"), "267178220599640596"))
          ))),'microsecond'), Now(), 'seconds' ), 4),
        //if older than 4 hours, u[date it]  
          Let({ shared_memes_with_stats:
            //new memes could have ratings, but not have stats calculated yet (because calculating the stats gets expensive as it requires reading every rating)
            Filter( Paginate(Intersection(
              Match(Index("mid_by_uid"),  Var("user_1")  ),
              Match(Index("mid_by_uid"),  Var("user_2") )
            ), {size:100000}),
            Lambda( 'mid',
                IsNonEmpty(  Match(Index("ms_by_meme"), Var("mid"))  )
              ) 
            )
          ,products: 
            Map( Var("shared_memes_with_stats"),
              // for each shared mid
              Lambda('mid',
                Let( // (TODO: DRY up these first_z and second_z queries by nesting in another let for each user)
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
          ,match_score: 
            Divide(
              Sum( Select(["data"], Var("products")) ),
              //divide by n-1
              Subtract(Select(["data",0], Count( Var("shared_memes_with_stats") )),1)
            )
          },
          Update( Select(["ref"], Get(Intersection(
              Match(Index("rs_by_user"), Ref(Collection("users"), "267178323714507284")),
              Match(Index("rs_by_user"), Ref(Collection("users"), "267178220599640596"))
            ))),
            {  data: {  r: Var("match_score" ) },  })
          ),
          "exists and is recent"
        )
      )



    )
  )
)




Map(
  Paginate(Documents(Collection("users")), {size:100000}),
  Lambda( 
     "user_1",
      Let({
        user_1: Var("user_1"),
        user_2: Ref(Collection("users"), "267178220599640596"),
        r_doc: Intersection(
          Match(Index("rs_by_user"), Var("user_1")),
          Match(Index("rs_by_user"), Var("user_2"))
        )
      },
      If( //see if the r exists yet for this couple
        IsNonEmpty(
          Paginate( Var("r_doc"))
        ), //if so, update it if it hasn't been updated for 4 hours (TODO: change to last login date, or last time they rated at least 5 of the same memes)
        If( 
          GTE(TimeDiff( Epoch(Select(["ts"], Get( Var("r_doc") )
          ),'microsecond'), Now(), 'seconds' ), 4),
          Update(
            Select(["ref"], Get( Var("r_doc") )),
            { data: { r: 0.67 }, }
          ),
          "calculated recently"
        ),
        //if empty, try to create it
        Create(Collection('match_scores'),{
            data: {r: 0.67,
              users:[ Var("user_1"), Var("user_2")]
            },
          },
        ),
      )
    )
  )
)




//TODO: remove the user in question from the loop 
// but confirm first that is causing the error...


// this fails as soon as loop gets to user_2.
// we don't want to create a document that matches user_2 with user_2 anyway.
Map(
  Paginate(Documents(Collection("users")), {size:10}),
  Lambda( 
     "user_1",
      Let({
        user_1: Var("user_1"),
        user_2: Ref(Collection("users"), "267178220599640596"),
        r_doc: Intersection(
          Match(Index("rs_by_user"), Var("user_1")),
          Match(Index("rs_by_user"), Var("user_2"))
        )
      },
      If( //see if the r exists yet for this pair of users
        IsNonEmpty(
          Paginate( Var("r_doc"))
        ), //if so, update it if it hasn't been updated for 4 hours (TODO: change to last login date, or last time they rated at least 5 of the same memes)
        If( 
          GTE(TimeDiff( Epoch(Select(["ts"], Get( Var("r_doc") )
          ),'microsecond'), Now(), 'seconds' ), 4),
          Update(
            Select(["ref"], Get( Var("r_doc") )),
            { data: { r: 0.67 }, }
          ),
          "calculated recently"
        ),
        //if empty, try to create it
        Create(Collection('match_scores'),{
            data: {r: 0.67,
              users:[ Var("user_1"), Var("user_2")]
            },
          },
        ),
      )
    )
  )
)


// but this works. because i'm not running "update" in the same transaction, right?
// let me think some more.
Map(
  Paginate(Documents(Collection("users")), {size:100000}),
  Lambda( 
     "user_1",
      Let({
        user_1: Var("user_1"),
        user_2: Ref(Collection("users"), "267178220599640596"),
        r_doc: Intersection(
          Match(Index("rs_by_user"), Var("user_1")),
          Match(Index("rs_by_user"), Var("user_2"))
        )
      },
      If( //see if the r exists yet for this couple
        IsNonEmpty(
          Paginate( Var("r_doc"))
        ), //if so, update it if it hasn't been updated for 4 hours (TODO: change to last login date, or last time they rated at least 5 of the same memes)
        
          GTE(TimeDiff( Epoch(Select(["ts"], Get( Var("r_doc") )
          ),'microsecond'), Now(), 'seconds' ), 4),
        //if empty, try to create it
        "else do nothing"
        ,
      )
    )
  )
)

// this does not work. try removing this document:
//  Intersection(
//   Match(Index("rs_by_user"), Ref(Collection("users"), "267178220599640596")),
//   Match(Index("rs_by_user"), Ref(Collection("users"), "267178220599640596"))
// )

Map(
  Paginate(Documents(Collection("users")), {size:100000}),
  Lambda( 
     "user_1",
      Let({
        user_1: Var("user_1"),
        user_2: Ref(Collection("users"), "267178220599640596"),
        r_doc: Difference(Intersection(
            Match(Index("rs_by_user"), Var("user_1")),
            Match(Index("rs_by_user"), Var("user_2"))
          ),
          Intersection(
            Match(Index("rs_by_user"), Var("user_1")),
            Match(Index("rs_by_user"), Var("user_1"))
          )
        )
      },
      If( //see if the r exists yet for this couple
        IsNonEmpty(
          Paginate( Var("r_doc"))
        ), //if so, update it if it hasn't been updated for 4 hours (TODO: change to last login date, or last time they rated at least 5 of the same memes)
        If( 
          GTE(TimeDiff( Epoch(Select(["ts"], Get( Var("r_doc") )
          ),'microsecond'), Now(), 'seconds' ), 4),
          Update(
            Select(["ref"], Get( Var("r_doc") )),
            { data: { r: 0.67 }, }
          ),
          "calculated recently"
        ),
        //if empty, try to create it
        "do nothing",
      )
    )
  )
)


Paginate(
  Intersection(
    Match(Index("rs_by_user"), Ref(Collection("users"), "1")),
    Match(Index("rs_by_user"), Ref(Collection("users"), "267178220599640596"))
))

// {
//   data: [[0.67, Ref(Collection("match_scores"), "267376529374184979")]]
// }

Paginate(Intersection(
  Match(Index("rs_by_user"), Ref(Collection("users"), "1")),
  Match(Index("rs_by_user"), Ref(Collection("users"), "1"))
))

// {
//   data: [
//     [0.67, Ref(Collection("match_scores"), "267376529374184979")],
//     [0.67, Ref(Collection("match_scores"), "267421512270640658")]
//   ]
// }

Paginate(Intersection(
  Match(Index("rs_by_user"), Ref(Collection("users"), "267178220599640596")),
  Match(Index("rs_by_user"), Ref(Collection("users"), "267178220599640596"))
))

// 42 items. one for each user.
// {
//   data: [
//     [0.67, Ref(Collection("match_scores"), "267376529374184979")],
//     [0.67, Ref(Collection("match_scores"), "267376529460167187")],
//     ...
//     [0.67, Ref(Collection("match_scores"), "267376529957192211")],
//     [0.67, Ref(Collection("match_scores"), "267376529989698067")],
//     [0.8893532159073355, Ref(Collection("match_scores"), "267376529975018003")]
//   ]
// }


Map(
  Paginate(Documents(Collection("users")), {size:100000}),
  Lambda( 
     "user_1",
      Let({
        user_1: Var("user_1"),
        user_2: Ref(Collection("users"), "267178220599640596"),
        r_doc: Intersection(
            Match(Index("rs_by_user"), Var("user_1")),
            Match(Index("rs_by_user"), Var("user_2"))
          )
      },
      Map(
        Var("r_doc"),
        (
          Lambda(
            "x",
            Select(["data"],Get("x"))
          )
        )
      )
    )
  )
)