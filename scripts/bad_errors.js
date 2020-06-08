// 1. if there is a uniqueindex constraint, we should tell the user. 
// also, how do you tell what index is causing this?
// or to list all indexes with unique set to true?
// in the interim, tell users to check for index w/ unique constraint if hey get an error that looks like this

Let({ user_1: Ref(Collection("users"), "1"),
user_2: Ref(Collection("users"), "2"),},
  Create(Collection('match_scores'),{
    data: {
      r: Call(Function("calc_r"),[ Var("user_1"), Var("user_2") ]),
      users:[ Var("user_2")]
    },
  },
  )
)

// error: instance not unique
// document is not unique.
// position: ["in","else","create"]

///
///

// 2. if you get "instance not found", check for its existence first
Map(
  Paginate(Difference(
    Match(Index("users_by_wantFriends"), true ),
    Match(Index("matches_rated_by_user"), Ref(Collection("users"), "3" )),
    Match(Index("user_by_user"), Ref(Collection("users"), "3" ))
  )),
  Lambda(
    "match",
    Get(
      Intersection(
          Match(Index("r_and_ref_by_user"), Ref(Collection("users"), "3") ),
          Match(Index("r_and_ref_by_user"), Var("match") )
      )
    )
  )
)

// error: instance not found
// Set not found.
// position: ["map","expr"]

// check if it exists first

Map(
  Paginate(Difference(
    Match(Index("users_by_wantFriends"), true ),
    Match(Index("matches_rated_by_user"), Ref(Collection("users"), "3" )),
    Match(Index("user_by_user"), Ref(Collection("users"), "3" ))
  )),
  Lambda(
    "match",
    If(
      Exists(
        Intersection(
            Match(Index("r_and_ref_by_user"), Ref(Collection("users"), "3") ),
            Match(Index("r_and_ref_by_user"), Var("match") )
        )
      ),
      Get(Intersection(
        Match(Index("r_and_ref_by_user"), Ref(Collection("users"), "3") ),
        Match(Index("r_and_ref_by_user"), Var("match") )
      )),
      ["no r for",Var("match")]
    )
  )
)

///
///

// 3. UDF call errors still not appearing. make sure this gets done.

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


/////////////////////////
/////////////////////////
/////////////////////////

///forgot what all these are...


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




