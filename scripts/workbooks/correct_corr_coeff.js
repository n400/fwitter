// my math is wrong, but maybe it will work anyway, for now.
// https://docs.google.com/spreadsheets/d/1BGSkeG9THvl9lIVz_jtws6j0SDDD2hG6hCkHg1IeUKc/edit#gid=0
// https://www.thoughtco.com/how-to-calculate-the-correlation-coefficient-3126228





CreateFunction({
  name: "calc_r",
  body: Query(Lambda(['user_1',"user_2"],
  Let({
    // user_1: Var("user_1"),
    // user_2: Var("user_2"),
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
           { first_z: Call(Function("get_z"),[Var("mid"), Var("user_1")]), 
             second_z: Call(Function("get_z"),[Var("mid"), Var("user_1")]),
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







Map( 
  Filter( Paginate(Intersection(
    Match(Index("mid_by_uid"), Ref(Collection("users"), "267178323714507284") ),
    Match(Index("mid_by_uid"), Ref(Collection("users"), "267178220599640596") )
  ), {size:100000}),
  Lambda( 'mid',
      IsNonEmpty(  Match(Index("ms_by_meme"), Var("mid"))  )
    ) 
  ),
       // for each shared mid
       Lambda('mid',
         Let( // (this could be refactored to make it shorter by nesting it in another let for each user)
           { first_z: Call(Function("get_z"),[Var("mid"), Ref(Collection("users"), "267178323714507284")]), 
             second_z: Call(Function("get_z"),[Var("mid"),Ref(Collection("users"), "267178220599640596") ]),
           },
           [Var("first_z"),  Var("second_z") ]
         )
       )
     ) 



     Map( 
      Filter( Paginate(Intersection(
        Match(Index("mid_by_uid"), Ref(Collection("users"), "267178323714507284") ),
        Match(Index("mid_by_uid"), Ref(Collection("users"), "267178220599640596") )
      ), {size:100000}),
      Lambda(Var("mid"), IsNonEmpty(  Match(Index("ms_by_meme"), Var("mid"))  )) 
      )
      ,
      Call(Function("get_z"),
        [ Ref(Collection("memes"), "1"), Ref(Collection("users"), "267178323714507284")]
      )
     ) 



     Let({
      uid: Ref(Collection("users"), "267178323714507284")
    },
      Map([
        Ref(Collection("memes"), "1"),
        Ref(Collection("memes"), "2"),
        Ref(Collection("memes"), "3"),
        Ref(Collection("memes"), "4"),
        Ref(Collection("memes"), "5"),
        Ref(Collection("memes"), "6"),
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
      ],
        Lambda("mid",
          Paginate(Match(Index("rating_by_mid_and_uid"),  Var("mid"), Var("uid")))  
        )
      )  
    )
    




    Map( 
      Filter( Paginate(Intersection(
        Match(Index("mid_by_uid"), Ref(Collection("users"), "267178323714507284") ),
        Match(Index("mid_by_uid"), Ref(Collection("users"), "267178220599640596") )
      ), {size:100000}),
      Lambda( 'mid',
          IsNonEmpty(  Match(Index("ms_by_meme"), Var("mid"))  )
        ) 
      ),
           // for each shared mid
           Lambda('mid',
             Let( // (this could be refactored to make it shorter by nesting it in another let for each user)
               { first_z: Call(Function("get_z"),[Var("mid"), Ref(Collection("users"), "267178323714507284")]), 
                 second_z: Call(Function("get_z"),[Var("mid"),Ref(Collection("users"), "267178220599640596") ]),
               },
               [Var("first_z"),  Var("second_z") ]
             )
           )
         ) 
    
    // {
    //   data: [
    //     [1.234033542917991, 1.234033542917991],
    //     [0.9861168645694258, 0.9861168645694258],
    //     [0.5422318204446291, 0.5422318204446291],
    //     [-0.7187952884282609, 0.7187952884282609],
    //     [0.5167331012717166, 0.5167331012717166],
    //     [-0.6113670624423352, -1.3100722766621467],
    //     [1.2166467537900665, 1.2166467537900665],
    //     [-0.8120352581656795, -1.5338443765351721],
    //     [-0.7306168766242422, -1.3800541002902353],
    //     [-0.6691759234658824, -1.3599381670435675],
    //     [-0.6313453403451317, -1.4394673759869003],
    //     [-1.5396424471426264, -1.5396424471426264],
    //     [0.7407648192797208, -1.234608032132868],
    //     [1.04528994741593, 1.04528994741593],
    //     [-0.744465847290055, -1.3713844555343118],
    //     [-1.4348041353823655, -1.4348041353823655],
    //     [1.5985414534568814, 1.5985414534568814]
    //   ]
    // }


Map( 
  Filter( Paginate(Intersection(
    Match(Index("mid_by_uid"), Ref(Collection("users"), "267178323714507284") ),
    Match(Index("mid_by_uid"), Ref(Collection("users"), "267178220599640596") )
  ), {size:100000}),
  Lambda( 'mid',
      IsNonEmpty(  Match(Index("ms_by_meme"), Var("mid"))  )
    ) 
  ),
  // for each shared mid
  Lambda('mid',
    Let( // (this could be refactored to make it shorter by nesting it in another let for each user)
      { first_z: Call(Function("get_z"),[Var("mid"), Ref(Collection("users"), "267178323714507284")]), 
        second_z: Call(Function("get_z"),[Var("mid"),Ref(Collection("users"), "267178220599640596") ]),
      },
      Multiply([Var("first_z"),  Var("second_z") ])
    )
  )
) 
    
    // {
    //   data: [
    //     1.522838785046729,
    //     0.9724264705882353,
    //     0.29401534710269656,
    //     -0.5166666666666668,
    //     0.2670130979498861,
    //     0.8009350393700788,
    //     1.4802293235079067,
    //     1.2455357142857142,
    //     1.0082908163265305,
    //     0.9100378787878787,
    //     0.9088010204081632,
    //     2.370498865043335,
    //     -0.9145541958041957,
    //     1.092631074168798,
    //     1.0209488906497621,
    //     2.0586629069103375,
    //     2.555334778420039
    //   ]
    // }




    Let({
      // user_1: Var("user_1"),
      // user_2: Var("user_2"),
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
             { first_z: Call(Function("get_z"),[Var("mid"), Var("user_1")]), 
               second_z: Call(Function("get_z"),[Var("mid"), Var("user_2")]),
             },
             Multiply(  Var("first_z"),  Var("second_z") )
           )
         )
       ) 
     },
    //  Divide(
        Select(["data"], Var("products")) ,
       //divide by n-1
       //Subtract(Select(["data",0], Count( Var("shared_memes_with_stats") )),1)
    //  )
    )
  
  



