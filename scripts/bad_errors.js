
// error: invalid argument
// Integer expected, Unresolved Transaction Time provided.
// position: ["map","expr","in","else","if","gte",0,"time_diff","epoch"]



Map( 
   Paginate(Intersection(
    Match(Index("mid_by_uid"), Ref(Collection("users"), "267178323714507284") ),
    Match(Index("mid_by_uid"), Ref(Collection("users"), "267178220599640596") )
  ), {size:100000}),
  Lambda(
    "meme",
    Call(Function("get_z"),
    [Var("meme"), Ref(Collection("users"), "267178323714507284")]
  )
  )
 ) 

//  error: call error
// Calling the function resulted in an error.
// position: ["map","expr"]





 //i wrote a bad query copy/pasting from another query. forgot to remove the Filter and Lambda
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

// error: invalid expression
// No form/function found, or invalid argument keys: { call, arguments }.
// position: ["map"]


Difference(
  Match(Index("user_by_user"), Ref(Collection("users"), "267178323714507284")),
  Select(["data","users"], Get(Ref(Collection("match_scores"), "267542498619949568")))
)

// error: invalid argument
// Arguments cannot be of different types, expected Set or Array.
// position: ["difference"]


Map(
  Map(
    Paginate(Match(Index("users_and_r_by_users2"), Ref(Collection("users"), "267178323714507284") )),
    Lambda(
      "r_doc",
      Get( Var("r_doc"))
    )
  ),
  Difference(
    Select(["data","users"], Get(Var("r_doc"))),
    [Ref(Collection("users"), "267178323714507284")]
  )



)


// error: invalid expression
// No form/function found, or invalid argument keys: { difference }.
// position: ["map"]

