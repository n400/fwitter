// TODO: make this run async as a user logs in

// This updates r scores for all of the users who have not already been rated and want friends
Let({ 
    user_1: Ref(Collection("users"), "1"),
    users: Paginate(
              Difference(
                Match(Index("users_by_wants"),  'friends' ),
                Match(Index("matches_rated_by_user"),  Var("user_1")),
                Match(Index("user_by_user"), Var("user_1"))
              ), 
            {size: 40000}
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
    ), {size: 100}),
    Lambda(
      "match",
      Get(Var("match"))
    )
  )  
)