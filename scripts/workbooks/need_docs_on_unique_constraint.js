// TODO: make this run async as a user logs in
// OK, this function works for ANY user_1:
Let({ //TODO: these should be filtered by friends/matches
  user_1: Ref(Collection("users"), "267178323714507284"),
  users: Paginate(Difference(Documents(Collection("users")),
          Match(Index("user_by_user"), Var("user_1"))), 
          {size: 5}
        )
},
Map(
  Var("users"),
  Lambda(
    "user_2",
    Call(Function("calc_r"),[Var("user_1"), Var("user_2")])
  )
)
)

// but update does not work in the above. 

// update does work here:
Call(Function("update_r"),[Ref(Collection("users"), "267178323714507284"), Ref(Collection("users"), "2")])

//but then not here:
Call(Function("update_r"),[Ref(Collection("users"), "1"), Ref(Collection("users"), "2")])

// why can i only calculate and update 267178323714507284???

// ok, we know that calc_r does not write anything. it's only used in update_r.
// we need to know why update_r fails


//update r
CreateFunction({
name: "update_r",
body: Query(Lambda(['user_1',"user_2"],
  Let({
    user_1: Ref(Collection("users"), "1"),
    user_2: Ref(Collection("users"), "2"),
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
      "no new mutual meme ratings"
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

// error: instance not unique
// document is not unique.
// position: ["in","else","create"]

Let({      user_1: Ref(Collection("users"), "1"),
user_2: Ref(Collection("users"), "2"),},
Create(Collection('match_scores'),{
  data: {
    r: 
    Call(Function("calc_r"),[ Var("user_1"), Var("user_2") ]),
    users:[ Var("user_1"), Var("user_2")]
  },
},
)
)

// error: instance not unique
// document is not unique.
// position: ["in","else","create"]

Let({      user_1: Ref(Collection("users"), "1"),
user_2: Ref(Collection("users"), "2"),},

// Create(Collection('match_scores'),{
//   data: {
//     r: 
    Call(Function("calc_r"),[ Var("user_1"), Var("user_2") ]),
//     users:[ Var("user_1"), Var("user_2")]
//   },
// },
// )
)

// -0.3098292967086785


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


