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



// version #3
