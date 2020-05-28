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

