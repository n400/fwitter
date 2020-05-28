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
      'pepper this into the deck' 
    )
  )
)


// calculates correlation coefficient. supposedly
Let({
  user_1: Ref(Collection("users"), "1")
 ,user_2: Ref(Collection("users"), "2")
 ,shared_memes_with_stats:
   //new memes could have ratings, but not have stats calculated yet (because calculating the stats gets expensive as it requires reading every rating)
   Filter( Paginate(Intersection(
     Match(Index("mid_by_uid"), Ref(Collection("users"), "1") ),
     Match(Index("mid_by_uid"), Ref(Collection("users"), "2") )
   )),
   Lambda( 'mid',
       IsNonEmpty(  Match(Index("ms_by_meme"), Var("mid"))  )
     ) 
   )
 ,products: 
   Map( Var("shared_memes_with_stats"),
     // for each shared mid
     Lambda('mid',
       Let( // (this could be refactored to make it shorter by nesting it in another let for each user)
         { first_z: Let({ // get the rating. 
                         rating: Select(["data","rating"], Get(Match(Index("rating_by_mid_and_uid"), [  Var("mid"),  Var("user_1") ]  )))
                       }, //get the z-score from the rating.
                       Select(['data', ToString(Var("rating"))],Get(Match(Index("ms_by_meme"), Var("mid")  )))
                     ), 
           second_z: Let({ rating: Select(["data","rating"], Get(Match(Index("rating_by_mid_and_uid"), [  Var("mid"),  Var("user_2") ]  )))
                         }, Select(['data', ToString(Var("rating"))],Get(Match(Index("ms_by_meme"), Var("mid")  )))),
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

