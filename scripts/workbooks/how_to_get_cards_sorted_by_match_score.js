


user_1: Ref(Collection("users"), "267178323714507284"),
user_2: Ref(Collection("users"), "267178220599640596"),




//get the current user out of the document


//this returns the list of users sorted by r. we could loop back through it to get r?
Map(
  Paginate(Match(Index("users_and_r_by_users2"), Ref(Collection("users"), "267178323714507284") )),
  Lambda(
    "r_doc",
    Get( Var("r_doc"))
  )
)





Let({ 
  matches: 
    Map(
      Paginate(Match(Index("users_and_r_by_users2"), Ref(Collection("users"), "267178323714507284") )),
      Lambda(
        "r_doc",
        Difference(
          Select(["data","users"], Get(Var("r_doc"))),
          [Ref(Collection("users"), "267178323714507284")]
        )
      )
    )
  },
  Map(
   Var("matches"),
   Lambda(
    "match",
    Paginate(Match(Index("r_by_pair"), Var("match")))
   )
  )
)

// can we get this, get each doc from the ref, then difference the user in question's ref, then get the other user's doc?
CreateIndex({
  name: "r_and_ref_by_user",
  source: Collection("match_scores"),
  terms: [
    { field: ["data","users"] }
  ],
  values: [
    { field: ["data", "r"], reverse: true },
    { field: ["ref"] }
  ]
});


// this gives us the ordered list of match_docs
Paginate(Match(Index("r_and_ref_by_user"), Ref(Collection("users"), "267178323714507284") ))

// {
//   data: [
//     [1.0673111966309519, Ref(Collection("match_scores"), "267452284673196562")],
//     [0.4572918461746685, Ref(Collection("match_scores"), "267542498585349632")],
//     [
//       0.28735503296845616, Ref(Collection("match_scores"), "267542498619949568")
//     ],
//     [
//       0.22474624520625364, Ref(Collection("match_scores"), "267542498781430272")
//     ],
//     [
//       0.20735090381870006, Ref(Collection("match_scores"), "267542498990096896")
//     ],
//     [0.1910379969872114, Ref(Collection("match_scores"), "267542498754167296")],
//     [
//       0.12121115392582073, Ref(Collection("match_scores"), "267542498851684864")
//     ],
//     [
//       0.10975029728968412, Ref(Collection("match_scores"), "267542498976465408")
//     ],
//     ...
//
// readOps: 1


//now from these match docs, we want to get just the match, not the user querying
// so, first, let's get just the match scores
Map(
  Paginate(Match(Index("r_and_ref_by_user"), Ref(Collection("users"), "267178323714507284") )),

  Lambda(
    "r_doc",
    Select([1],Var("r_doc"))
  )

)

// {
//   data: [
//     Ref(Collection("match_scores"), "267452284673196562"),
//     Ref(Collection("match_scores"), "267542498585349632"),
//     Ref(Collection("match_scores"), "267542498619949568"),
//     Ref(Collection("match_scores"), "267542498781430272"),
//     Ref(Collection("match_scores"), "267542498990096896"),
//     Ref(Collection("match_scores"), "267542498754167296"),
//     Ref(Collection("match_scores"), "267542498851684864"),
//     Ref(Collection("match_scores"), "267542498976465408"),
//     Ref(Collection("match_scores"), "267542498647212544"),
//     Ref(Collection("match_scores"), "267542498996388352")
//     ...
//
// readOps: 1


// Now, let's get the full doc for each ref
Map(
  Paginate(Match(Index("r_and_ref_by_user"), Ref(Collection("users"), "267178323714507284") )),
  Lambda(
    "r_doc",
    Get(Select([1],Var("r_doc")))
  )
)

// {
//   data: [
//     {
//       ref: Ref(Collection("match_scores"), "267452284673196562"),
//       ts: 1591411395600000,
//       data: {
//         r: 1.0673111966309519,
//         users: [
//           Ref(Collection("users"), "267178323714507284"),
//           Ref(Collection("users"), "267178220599640596")
//         ],
//         n: 18
//       }
//     },
//     {
//       ref: Ref(Collection("match_scores"), "267542498585349632"),
//       ts: 1591411395600000,
//       data: {
//         r: 0.4572918461746685,
//         users: [
//           Ref(Collection("users"), "267178323714507284"),
//           Ref(Collection("users"), "1")
//         ],
//         n: 17
//       }
//     },
//     {
//       ref: Ref(Collection("match_scores"), "267542498619949568"),
//       ts: 1591411395600000,
//       data: {
//         r: 0.28735503296845616,
//         users: [
//           Ref(Collection("users"), "267178323714507284"),
//           Ref(Collection("users"), "3")
//         ],
//         n: 17
//       }
//     },
//      ...
//
// readOps: 42


// And from each of these, let's get the content of the users field.
Map(
  Paginate(Match(Index("r_and_ref_by_user"), Ref(Collection("users"), "267178323714507284") )),
  Lambda(
    "r_doc",
    Select(["data", "users"], Get(Select([1],Var("r_doc"))))
  )
)

// {
//   data: [
//     [
//       Ref(Collection("users"), "267178323714507284"),
//       Ref(Collection("users"), "267178220599640596")
//     ],
//     [
//       Ref(Collection("users"), "267178323714507284"),
//       Ref(Collection("users"), "1")
//     ],
//     [
//       Ref(Collection("users"), "267178323714507284"),
//       Ref(Collection("users"), "3")
//     ],
//     ...
//
// readOps: 42


// But let's remove the currently logged-in user from the array.
Map(
  Paginate(Match(Index("r_and_ref_by_user"), Ref(Collection("users"), "267178323714507284") )),
  Lambda(
    "r_doc",
    Difference(
      Select(["data", "users"], Get(Select([1],Var("r_doc")))),
      [Ref(Collection("users"), "267178323714507284")]
    )
  )
)

// Finally, we have users ranked by match score
// {
//   data: [
//     [Ref(Collection("users"), "267178220599640596")],
//     [Ref(Collection("users"), "1")],
//     [Ref(Collection("users"), "3")],
//     [Ref(Collection("users"), "15")],
//     [Ref(Collection("users"), "30")],
//     [Ref(Collection("users"), "13")],
//     [Ref(Collection("users"), "20")],
//     [Ref(Collection("users"), "29")],
//     [Ref(Collection("users"), "5")],
//     [Ref(Collection("users"), "266525242360332819")],
//     [Ref(Collection("users"), "266525336289673747")],
//     ...
//
// readOps: 42

// But we still need to get each user doc so we can show their profile photo and stuff for their card.
// First, we need to select the Ref from the array because Get() accepts just a Ref, not an array
Map(
  Paginate(Match(Index("r_and_ref_by_user"), Ref(Collection("users"), "267178323714507284") )),
  Lambda(
    "r_doc",
    Select(0,Difference(
      Select(["data", "users"], Get(Select([1],Var("r_doc")))),
      [Ref(Collection("users"), "267178323714507284")]
    ))
  )
)

// {
//   data: [
//     Ref(Collection("users"), "267178220599640596"),
//     Ref(Collection("users"), "1"),
//     Ref(Collection("users"), "3"),
//     Ref(Collection("users"), "15"),
//     Ref(Collection("users"), "30"),
//     Ref(Collection("users"), "13"),
//     ...
//
// readOps: 42

// Now, we can get each user doc
Map(
  Paginate(Match(Index("r_and_ref_by_user"), Ref(Collection("users"), "267178323714507284") )),
  Lambda(
    "r_doc",
    Get(Select(0,Difference(
      Select(["data", "users"], Get(Select([1],Var("r_doc")))),
      [Ref(Collection("users"), "267178323714507284")]
    )))
  )
)

// {
//   data: [
//     {
//       ref: Ref(Collection("users"), "267178220599640596"),
//       ts: 1591059857050000,
//       data: {
//         alias: "greg",
//         wantMemes: true,
//         wantFriends: true,
//         wantDates: true
//       }
//     },
//     {
//       ref: Ref(Collection("users"), "1"),
//       ts: 1590456424550000,
//       data: {
//         alias: "user_1",
//         wantMemes: true,
//         wantFriends: true,
//         wantDates: true,
//         dob: "1981-08-14",
//         zip: "12345",
//         asset01: {
//           url: "/images/people/image1.jpg"
//         },
//         asset02: {
//           url: "/images/people/image2.jpg"
//         },
//         asset03: {
//           url: "/images/people/image3.jpg"
//         },
//         asset04: {
//           url: "/images/people/image4.jpg"
//         },
//         asset05: {
//           url: "/images/people/image5.jpg"
//         },
//         asset06: {
//           url: "/images/people/image6.jpg"
//         },
//         created: Time("2020-05-25T20:28:24.851124Z")
//       }
//     },
//     ...
//
// readOps: 83

// now get matches who havent already been rated and want friends/dates...
// This lists all of the users who have not already been rated and want dates and are not self
Difference(
  Match(Index("users_by_wantFriends"),  true ),
  Match(Index("matches_rated_by_user"),  Ref(Collection("users"), "3" )),
  Match(Index("user_by_user"), Ref(Collection("users"), "3" ))
)

// data: [
//   Ref(Collection("users"), "1"),
//   Ref(Collection("users"), "2"),
//   Ref(Collection("users"), "5"),
//   ...
//   Ref(Collection("users"), "267178220599640596"),
//   Ref(Collection("users"), "267178323714507284")
// ]
// }

//map thruogh each of them and get their match score, but check if it exists first

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

// data: [
//   {
//     ref: Ref(Collection("match_scores"), "267713750245573139"),
//     ts: 1591570577800000,
//     data: {
//       r: 0.039550285024046714,
//       users: [Ref(Collection("users"), "1"), Ref(Collection("users"), "3")],
//       n: 18
//     }
//   },
//   {
//     ref: Ref(Collection("match_scores"), "267715458212299264"),
//     ts: 1591572206690000,
//     data: {
//       r: -0.42261260265415435,
//       users: [Ref(Collection("users"), "2"), Ref(Collection("users"), "3")],
//       n: 18
//     }
//   },
//   ["no r for", Ref(Collection("users"), "5")],
//   ["no r for", Ref(Collection("users"), "6")],
//   ...


// And, taking what we learned from before, let's get the content of the users field from each of these.


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
      Select(["data", "users"],Get(Intersection(
        Match(Index("r_and_ref_by_user"), Ref(Collection("users"), "3") ),
        Match(Index("r_and_ref_by_user"), Var("match") )
      ))),
      ["no r for",Var("match")]
    )
  )
)

// But let's remove the currently logged-in user from the array.

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
      Difference(
        Select(["data", "users"],Get(Intersection(
          Match(Index("r_and_ref_by_user"), Ref(Collection("users"), "3") ),
          Match(Index("r_and_ref_by_user"), Var("match") )
        ))),
        [Ref(Collection("users"), "3")]
      ),
      []
    )
  )
)

// {
// data: [
//   [Ref(Collection("users"), "1")],
//   [Ref(Collection("users"), "2")],
//   null,
//   null
//   ...

// And select the ref from the array

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
      Select([0],
        Difference(
          Select(["data", "users"],Get(Intersection(
            Match(Index("r_and_ref_by_user"), Ref(Collection("users"), "3") ),
            Match(Index("r_and_ref_by_user"), Var("match") )
          ))),
          [Ref(Collection("users"), "3")]
        )
      ),
      []
    )
  )
)

// And get the user doc from it

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
      Get(Select([0],
        Difference(
          Select(["data", "users"],Get(Intersection(
            Match(Index("r_and_ref_by_user"), Ref(Collection("users"), "3") ),
            Match(Index("r_and_ref_by_user"), Var("match") )
          ))),
          [Ref(Collection("users"), "3")]
        )
      )),
      []
    )
  )
)

// but let's get rid of the nulls by using Filter instead of Map
Filter(
  Paginate(Difference(
    Match(Index("users_by_wantFriends"), true ),
    Match(Index("matches_rated_by_user"), Ref(Collection("users"), "3" )),
    Match(Index("user_by_user"), Ref(Collection("users"), "3" ))
  )),
  Lambda(
    "user",
    Exists(
        Intersection(
            Match(Index("r_and_ref_by_user"), Ref(Collection("users"), "3") ),
            Match(Index("r_and_ref_by_user"), Var("user") )
        )
    )
  )
)

// and then map over that
Map(
  Filter(
    Paginate(Difference(
      Match(Index("users_by_wantFriends"), true ),
      Match(Index("matches_rated_by_user"), Ref(Collection("users"), "3" )),
      Match(Index("user_by_user"), Ref(Collection("users"), "3" ))
    )),
    Lambda(
      "filtered_results",
      Exists(
          Intersection(
              Match(Index("r_and_ref_by_user"), Ref(Collection("users"), "3") ),
              Match(Index("r_and_ref_by_user"), Var("filtered_results") )
          )
      )
    )
  ),
  Lambda(
    "match",
    Get(Var("match"))
  )
)

//and clean it up a little more with a Let

Let({
  user: Ref(Collection("users"), "3" )
},
  Map(
    Paginate(Filter(
      Difference(
        Match(Index("users_by_wantFriends"), true ),
        Match(Index("matches_rated_by_user"), Var("user") ),
        Match(Index("user_by_user"), Var("user") )
      ),
      Lambda(
        "i",
        Exists(
            Intersection(
                Match(Index("r_and_ref_by_user"), Var("user") ),
                Match(Index("r_and_ref_by_user"), Var("i") )
            )
        )
      )
    )),
    Lambda(
      "match",
      Get(Var("match"))
    )
  )  
)

// but we also want to return the r from the match_score doc with the user profile.
// let's play with some joins and see if we can get one to work.

Paginate(Difference(
  Match(Index("users_by_wantFriends"), true ),
  Match(Index("matches_rated_by_user"), Ref(Collection("users"), "1" ) ),
  Match(Index("user_by_user"), Ref(Collection("users"), "1" ) )
))

// {
//   data: [
//     Ref(Collection("users"), "26"),
//     Ref(Collection("users"), "27"),
//     Ref(Collection("users"), "28"),
//     Ref(Collection("users"), "29"),
//     Ref(Collection("users"), "30"),
//     Ref(Collection("users"), "266525336289673747"),
//     Ref(Collection("users"), "266526604073632275"),
//     Ref(Collection("users"), "266554703588885010"),
//     Ref(Collection("users"), "266820499462423059"),
//     Ref(Collection("users"), "266821227617714707"),
//     Ref(Collection("users"), "266821501277176339"),
//     Ref(Collection("users"), "267178323714507284")
//   ]
// }

////////

Paginate(
  Join(
    Difference(
      Match(Index("users_by_wantFriends"), true ),
      Match(Index("matches_rated_by_user"), Ref(Collection("users"), "1" ) ),
      Match(Index("user_by_user"), Ref(Collection("users"), "1" ) )
    ),
    Lambda(
      'user',
      Match(Index("r_and_ref_by_user"), Var("user") )
    )
  )
)

// the above is wrong. it returns way more than 11 results.
// but this works...

Paginate(
  Join(
    Difference(
      Match(Index("users_by_wantFriends"), true ),
      Match(Index("matches_rated_by_user"), Ref(Collection("users"), "3" )),
      Match(Index("user_by_user"), Ref(Collection("users"), "3" ))
    ),
    Lambda(
      "match",
      Intersection(
        Match(Index("r_and_ref_by_user"), Ref(Collection("users"), "3") ),
        Match(Index("r_and_ref_by_user"), Var("match") )
      )
    )
  )
)

// {
//   data: [
//     [
//       0.28735503296845616,
//       Ref(Collection("match_scores"), "267542498619949568")
//     ],
//     [
//       0.039550285024046714,
//       Ref(Collection("match_scores"), "267713750245573139")
//     ],
//     [
//       -0.42261260265415435,
//       Ref(Collection("match_scores"), "267715458212299264")
//     ]
//   ]
// }

// it doesnt give us what we want though. we're back at just having the match_doc. fewer reads though

Paginate(
  Join(
    Difference(
      Match(Index("users_by_wantFriends"), true ),
      Match(Index("matches_rated_by_user"), Ref(Collection("users"), "3" )),
      Match(Index("user_by_user"), Ref(Collection("users"), "3" ))
    ),
    Lambda(
      "match",
      Select([1],Get(Intersection(
        Match(Index("r_and_ref_by_user"), Ref(Collection("users"), "3") ),
        Match(Index("r_and_ref_by_user"), Var("match") )
      )))
    )
  )
)

// error: invalid argument
// Invalid lambda. Lambda in this context may not read, write, or call a user function.
// position: ["paginate","with"]

Map(
  Paginate(
    Join(
      Difference(
        Match(Index("users_by_wantFriends"), true ),
        Match(Index("matches_rated_by_user"), Ref(Collection("users"), "3" )),
        Match(Index("user_by_user"), Ref(Collection("users"), "3" ))
      ),
      Lambda(
        "match",
        Intersection(
          Match(Index("r_and_users_by_users"), Ref(Collection("users"), "3") ),
          Match(Index("r_and_users_by_users"), Var("match") )
        )
      )
    )
  ),
  Lambda(
    "match",
    Get(Select(1,Var("match")))
  )
)


//what does this do?

Paginate(Match(Index("r_and_user_by_users_a3"), Ref(Collection("users"), "1" )))

// {
//   data: [
//     [0.4572918461746685, null],
//     [0.375985355820392, null],
//     [0.29763939119362753, null],
//     [0.2616110602996056, null],
//     [0.18042113051542646, null],
//     [0.15051678967828355, null],
//     [0.10355452917792819, null],
//     [0.0848257295610729, null],
//     [0.050626570120591304, null],
//     [0.039550285024046714, null],
//     [0.020785467994418893, null],
//     [0.019102865557628686, null],
//     [0.002028246338856781, null],
//     [0, null],
//     [0, null],
//     [0, null],
//     [0, null],
//     [0, null],
//     [0, null],
//     [-0.0047711415425590485, null],
//     [-0.007631295677613135, null],
//     [-0.02270746147474341, null],
//     [-0.086448761179594, null],
//     [-0.1201735742623777, null],
//     [-0.17849112221413166, null],
//     [-0.22734788707966777, null],
//     [-0.22754321446438006, null],
//     [-0.27378114840001294, null],
//     [-0.2825294019678386, null],
//     [-0.3032677545516593, null],
//     [-0.3098292967086785, null],
//     [-0.43356312830727833, null],
//     [-0.43537763885446573, null],
//     [-0.4849313526087317, null],
//     [-0.5825777338026782, null],
//     [-0.7552144680227467, null]
//   ]
// }
//
// readops: 1


CreateIndex({
  name: "r_and_users_by_users",
  source: Collection("match_scores"),
  terms: [{ field: ["data", "users"]}],
  values: [
    {field: ["data", "r"],reverse: true},
    {field: ["data", "users"]}
  ]
});


Paginate(
  Join(
    Difference(
      Match(Index("users_by_wantFriends"), true ),
      Match(Index("matches_rated_by_user"), Ref(Collection("users"), "3" )),
      Match(Index("user_by_user"), Ref(Collection("users"), "3" ))
    ),
    Lambda(
      "match",
      Intersection(
        Match(Index("r_and_users_by_users"), Ref(Collection("users"), "3") ),
        Match(Index("r_and_users_by_users"), Var("match") )
      )
    )
  )
)
 
// {
//   data: [
//     [0.28735503296845616, Ref(Collection("users"), "3")],
//     [0.28735503296845616, Ref(Collection("users"), "267178323714507284")],
//     [0.039550285024046714, Ref(Collection("users"), "1")],
//     [0.039550285024046714, Ref(Collection("users"), "3")],
//     [-0.42261260265415435, Ref(Collection("users"), "2")],
//     [-0.42261260265415435, Ref(Collection("users"), "3")]
//   ]
// }



CreateIndex({
  name: "r_users_ref_by_users",
  source: Collection("match_scores"),
  terms: [{ field: ["data", "users"]}],
  values: [
    {field: ["data", "r"],reverse: true},
    {field: ["data", "users"]},
    {field: ["ref"]},
  ]
});


Paginate(
  Join(
    Difference(
      Match(Index("users_by_wantFriends"), true ),
      Match(Index("matches_rated_by_user"), Ref(Collection("users"), "1" )),
      Match(Index("user_by_user"), Ref(Collection("users"), "1" ))
    ),
    Lambda(
      "match",
      Intersection(
        Match(Index("r_users_ref_by_users"), Ref(Collection("users"), "1") ),
        Match(Index("r_users_ref_by_users"), Var("match") )
      )
    )
  )
)

// {
//   data: [
//     [
//       0.4572918461746685,
//       Ref(Collection("users"), "1"),
//       Ref(Collection("match_scores"), "267542498585349632")
//     ],
//     [
//       0.4572918461746685,
//       Ref(Collection("users"), "267178323714507284"),
//       Ref(Collection("match_scores"), "267542498585349632")
//     ],
//     [
//       0.10355452917792819,
//       Ref(Collection("users"), "1"),
//       Ref(Collection("match_scores"), "267726121271820800")
//     ],
//     [
//       0.10355452917792819,
//       Ref(Collection("users"), "29"),
//       Ref(Collection("match_scores"), "267726121271820800")
//     ],

// no noe of that helps. it still returns duplicates.
// back to what marrony did...

Paginate(
  Join(
    Difference(
      Match(Index("users_by_wantFriends"), true ),
      Match(Index("matches_rated_by_user"), Ref(Collection("users"), "3" )),
      Match(Index("user_by_user"), Ref(Collection("users"), "3" ))
    ),
    Lambda(
      "match",
      Intersection(
        Match(Index("r_and_ref_by_user"), Ref(Collection("users"), "3") ),
        Match(Index("r_and_ref_by_user"), Var("match") )
      )
    )
  )
)

// {
//   data: [
//     [
//       0.28735503296845616,
//       Ref(Collection("match_scores"), "267542498619949568")
//     ],
//     [
//       0.039550285024046714,
//       Ref(Collection("match_scores"), "267713750245573139")
//     ],
//     [
//       -0.42261260265415435,
//       Ref(Collection("match_scores"), "267715458212299264")
//     ]
//   ]
// }

// but let's get the user doc from the matchdoc...

Map(
  Paginate(
    Join(
      Difference(
        Match(Index("users_by_wantFriends"), true ),
        Match(Index("matches_rated_by_user"), Ref(Collection("users"), "3" )),
        Match(Index("user_by_user"), Ref(Collection("users"), "3" ))
      ),
      Lambda(
        "match",
        Intersection(
          Match(Index("r_and_ref_by_user"), Ref(Collection("users"), "3") ),
          Match(Index("r_and_ref_by_user"), Var("match") )
        )
      )
    )
  ),
  Lambda(
    "r_doc",
    Get(Select(1,Var("r_doc")))
  )
)

// {
//   data: [
//     {
//       ref: Ref(Collection("match_scores"), "267542498619949568"),
//       ts: 1591411395600000,
//       data: {
//         r: 0.28735503296845616,
//         users: [
//           Ref(Collection("users"), "267178323714507284"),
//           Ref(Collection("users"), "3")
//         ],
//         n: 17
//       }
//     },
//     {
//       ref: Ref(Collection("match_scores"), "267713750245573139"),
//       ts: 1591570577800000,
//       data: {
//         r: 0.039550285024046714,
//         users: [Ref(Collection("users"), "1"), Ref(Collection("users"), "3")],
//         n: 18
//       }
//     },
//     {
//       ref: Ref(Collection("match_scores"), "267715458212299264"),
//       ts: 1591572206690000,
//       data: {
//         r: -0.42261260265415435,
//         users: [Ref(Collection("users"), "2"), Ref(Collection("users"), "3")],
//         n: 18
//       }
//     }
//   ]
// }

Map(
  Paginate(
    Join(
      Difference(
        Match(Index("users_by_wantFriends"), true ),
        Match(Index("matches_rated_by_user"), Ref(Collection("users"), "3" )),
        Match(Index("user_by_user"), Ref(Collection("users"), "3" ))
      ),
      Lambda(
        "match",
        Intersection(
          Match(Index("r_and_ref_by_user"), Ref(Collection("users"), "3") ),
          Match(Index("r_and_ref_by_user"), Var("match") )
        )
      )
    )
  ),
  Lambda(
    "r_doc",
    Select(["data", "users"], Get(Select(1,Var("r_doc"))))
  )
)

// {
//   data: [
//     [
//       Ref(Collection("users"), "267178323714507284"),
//       Ref(Collection("users"), "3")
//     ],
//     [Ref(Collection("users"), "1"), Ref(Collection("users"), "3")],
//     [Ref(Collection("users"), "2"), Ref(Collection("users"), "3")]
//   ]
// }

Map(
  Paginate(
    Join(
      Difference(
        Match(Index("users_by_wantFriends"), true ),
        Match(Index("matches_rated_by_user"), Ref(Collection("users"), "3" )),
        Match(Index("user_by_user"), Ref(Collection("users"), "3" ))
      ),
      Lambda(
        "match",
        Intersection(
          Match(Index("r_and_ref_by_user"), Ref(Collection("users"), "3") ),
          Match(Index("r_and_ref_by_user"), Var("match") )
        )
      )
    )
  ),
  Lambda(
    "r_doc",
    Difference(
      Select(["data", "users"], Get(Select(1,Var("r_doc")))),
      [Ref(Collection("users"), "3")]
    )
  )
)

// {
//   data: [
//     [Ref(Collection("users"), "267178323714507284")],
//     [Ref(Collection("users"), "1")],
//     [Ref(Collection("users"), "2")]
//   ]
// }

Map(
  Paginate(
    Join(
      Difference(
        Match(Index("users_by_wantFriends"), true ),
        Match(Index("matches_rated_by_user"), Ref(Collection("users"), "3" )),
        Match(Index("user_by_user"), Ref(Collection("users"), "3" ))
      ),
      Lambda(
        "match",
        Intersection(
          Match(Index("r_and_ref_by_user"), Ref(Collection("users"), "3") ),
          Match(Index("r_and_ref_by_user"), Var("match") )
        )
      )
    )
  ),
  Lambda(
    "r_doc",
    Select(0,
      Difference(
        Select(["data", "users"], Get(Select(1,Var("r_doc")))),
        [Ref(Collection("users"), "3")]
      )
    )
  )
)

// {
//   data: [
//     Ref(Collection("users"), "267178323714507284"),
//     Ref(Collection("users"), "1"),
//     Ref(Collection("users"), "2")
//   ]
// }

Let({
  user: Ref(Collection("users"), "3"),
  },
  Map(
    Paginate(Join(
      Difference(
        Match(Index("users_by_wantFriends"), true ),
        Match(Index("matches_rated_by_user"), Var("user")),
        Match(Index("user_by_user"), Var("user"))
      ),
      Lambda(
        "match",
        Intersection(
          Match(Index("r_and_ref_by_user"), Var("user") ),
          Match(Index("r_and_ref_by_user"), Var("match") )
        )
      )
    )),
    Lambda(
      "r_doc",
      [Select(0,Var("r_doc")),
      Get(Select(0,
        Difference(
          Select(["data", "users"], Get(Select(1,Var("r_doc")))),
          [Var("user")]
        )
      ))]
    )
  )
)






// in some cases, like when the user runs out of matches, 
// we will want to use the prior function with the If so that we can calculate an r if it doesnt exist..
// see calc_ALL_rs.js for part 2.



// TODO: 
// 1. keep the r from the match score. maybe you can assign it to a var in a 
// Let at some point and store it there? Or use a join probably?
// 2. Is there a more efficient way to do this? with an index binding maybe?
//
// do the other stuff first though and the answer will make itself apparent






CreateIndex({
  name: "r_and_user_by_users_and_wantFriends_a4",
  source: [Collection("users"),Collection("match_scores")],
  terms: [
    { field: ["data","users"] },
     { field: ["data","wantFriends"] }
  ],
  values: [
    { field: ["data","r"],reverse:true },
    { field: ["data", "users"] },
  ]
});