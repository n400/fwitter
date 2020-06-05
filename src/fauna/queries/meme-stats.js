// Gets mean, standard deviation, and z-scores

Map(
  // for every meme (or the first 1000 anyway)
  Paginate(Documents(Collection("memes")), {size:10}),
  Lambda("mid",
    If(
      //make sure ratings exist. else the whole function will error out
      IsNonEmpty(Match(Index("ratings_by_mid"), Var("mid") )),
      Let(
        { mean: Mean(Match(Index("ratings_by_mid"), Var("mid") )),
          sd: Sqrt(Divide(Sum([
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
              ]),Subtract(Count(Match(Index("ratings_by_mid"), Var("mid") )),1)
          ))
        },
        //check if meme already has a document in the meme_stats collection.
        If(
          IsEmpty(Match(Index("ms_by_meme"),  Var("mid")  )),
          // if not, make one 
          Create(
            Collection('meme_stats'),
            {
              data: {
                meme: Var("mid"),
                mean: Var("mean"),
                sd: Var("sd"),
                1: Divide( Subtract(1,Var("mean")),Var("sd") ),
                2: Divide( Subtract(2,Var("mean")),Var("sd") ),
                3: Divide( Subtract(3,Var("mean")),Var("sd") ),
                4: Divide( Subtract(4,Var("mean")),Var("sd") ),
                5: Divide( Subtract(5,Var("mean")),Var("sd") ),
              },
            },
          ),
          // "else update it"
          Update(
            Select(['ref'],Get(Match(Index("ms_by_meme"), Var("mid")))),
            {
              data: {
                mean: Var("mean"),
                sd: Var("sd"),
                1: Divide( Subtract(1,Var("mean")),Var("sd") ),
                2: Divide( Subtract(2,Var("mean")),Var("sd") ),
                3: Divide( Subtract(3,Var("mean")),Var("sd") ),
                4: Divide( Subtract(4,Var("mean")),Var("sd") ),
                5: Divide( Subtract(5,Var("mean")),Var("sd") ),
              }
            }
          )
        ),
      ),
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
      'pepper this into the deck' 
    )
  )
)


// calculates correlation coefficient. supposedly

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



Let({
  user_1: Ref(Collection("users"), "267178323714507284"),
  user_2: Ref(Collection("users"), "267178220599640596"),
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

//////
//////
//////

// version #1
If( //see if the r exists yet for this couple
  IsEmpty(
    Paginate(Intersection(
      Match(Index("rs_by_user"), Ref(Collection("users"), "267178323714507284")),
      Match(Index("rs_by_user"), Ref(Collection("users"), "267178220599640596"))
    ))
  ),//if not, create it
  Create(
    Collection('match_scores'),
    {
      data: {
        r: 0.67,
        users:[ Ref(Collection("users"), "267178323714507284"),Ref(Collection("users"), "267178220599640596")]
      },
    },
  ),
  If( //if so, update it if it hasn't been updated for 4 hours (TODO: change to last login date, or last time they rated at least 5 of the same memes)
    GTE(TimeDiff( Epoch(Select(["ts"], Get(Intersection(
      Match(Index("rs_by_user"), Ref(Collection("users"), "267178323714507284")),
      Match(Index("rs_by_user"), Ref(Collection("users"), "267178220599640596"))
    ))
    ),'microsecond'), Now(), 'hours' ), 4),
    Update(
      Select(["ref"], Get(Intersection(
        Match(Index("rs_by_user"), Ref(Collection("users"), "267178323714507284")),
        Match(Index("rs_by_user"), Ref(Collection("users"), "267178220599640596"))
      ))),
      {
        data: {
          r: 0.67
        },
      }
    ),
    "calculated recently"
  )
)


// create or update a couple's score
Let({
  user_1: Ref(Collection("users"), "4"),
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




// version #1
If( 
  //see if the r exists yet for this couple
  IsEmpty(
    Paginate(Intersection(
      Match(Index("rs_by_user"), Ref(Collection("users"), "267178323714507284")),
      Match(Index("rs_by_user"), Ref(Collection("users"), "267178220599640596"))
    ))
  ),
  //if not, create it
  Let({
        user_1: Ref(Collection("users"), "267178323714507284") 
        ,user_2: Ref(Collection("users"), "267178220599640596")
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
  ),
 //if so, see if it's been updated in last 4 hours (TODO: change to last login date, or last time they rated at least 5 of the same memes)
  If(
    GTE(TimeDiff( Epoch(Select(["ts"], Get(Intersection(
      Match(Index("rs_by_user"), Ref(Collection("users"), "267178323714507284")),
      Match(Index("rs_by_user"), Ref(Collection("users"), "267178220599640596"))
    ))),'microsecond'), Now(), 'hours' ), 4),
   //if older than 4 hours, u[date it]  
    Let({
      user_1: Ref(Collection("users"), "267178323714507284") 
     ,user_2: Ref(Collection("users"), "267178220599640596")
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
     Update( Select(["ref"], Get(Intersection(
        Match(Index("rs_by_user"), Ref(Collection("users"), "267178323714507284")),
        Match(Index("rs_by_user"), Ref(Collection("users"), "267178220599640596"))
      ))),
      {  data: {  r: 0.67  },  })
    ),
    "exists and is recent"
  )
)