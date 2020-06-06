

Let({ //TODO: these should be filtered by friends/matches
    user_1: Ref(Collection("users"), "267178323714507284"),
    users: Paginate(Difference(Documents(Collection("users")),
            Match(Index("user_by_user"), Var("user_1"))), 
            {size: 100000}
          )
  },
  Map(
    Var("users"),
    Lambda(
      "user_2",
      Call(Function("update_r"),[Var("user_1"), Var("user_2")])
    )
  )
)

// Call(Function("update_r"),[Ref(Collection("users"), "1"), Ref(Collection("users"), "2")])



