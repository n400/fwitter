Query(
  Lambda(
    [
      "email",
      "password",
      "alias",
      "wantMemes",
      "wantFriends",
      "wantDates",
      "icon"
    ],
    If(
      GTE(Length(Var("password")), 8),
      If(
        ContainsStrRegex(
          Var("email"),
          "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$"
        ),
        Let(
          {
            rateLimitingPage: Paginate(
              Match(Index("rate_limiting_by_action_and_identity"), [
                "register",
                "global"
              ])
            )
          },
          If(
            IsEmpty(Var("rateLimitingPage")),
            Do(
              Create(Collection("rate_limiting"), {
                data: { action: "register", identity: "global" }
              }),
              Let(
                {
                  user: Create(Collection("users"), {
                    data: {
                      alias: Var("alias"),
                      wantMemes: Var("wantMemes"),
                      wantFriends: Var("wantFriends"),
                      wantDates: Var("wantDates")
                    }
                  }),
                  account: Select(
                    ["ref"],
                    Create(Collection("accounts"), {
                      credentials: { password: Var("password") },
                      data: {
                        email: Var("email"),
                        user: Select(["ref"], Var("user"))
                      }
                    })
                  ),
                  secret: Login(Var("account"), { password: Var("password") })
                },
                Do(
                  Let(
                    {
                      followerstats: Create(Collection("followerstats"), {
                        data: {
                          postlikes: 0,
                          postrefweets: 0,
                          author: Select(["ref"], Var("user")),
                          follower: Select(["ref"], Var("user"))
                        }
                      })
                    },
                    Var("followerstats")
                  ),
                  {
                    user: Var("user"),
                    account: Var("account"),
                    secret: Var("secret")
                  }
                )
              )
            ),
            Let(
              {
                eventsPage: Paginate(
                  Events(Select(["data", 0], Var("rateLimitingPage"))),
                  null,
                  10
                ),
                page: Select(["data"], Var("eventsPage")),
                firstEventOfPage: Select([0], Var("page")),
                timestamp: Select(["ts"], Var("firstEventOfPage")),
                time: Epoch(Var("timestamp"), "microseconds"),
                ageInMs: TimeDiff(Var("time"), Now(null), "milliseconds")
              },
              If(
                Or(
                  LT(Count(Var("page")), 10),
                  And(Not(Equals(0, 10000)), GTE(Var("ageInMs"), 10000))
                ),
                Do(
                  Update(Select(["document"], Var("firstEventOfPage")), {
                    data: { action: "register", identity: "global" }
                  }),
                  Let(
                    {
                      user: Create(Collection("users"), {
                        data: {
                          alias: Var("alias"),
                          wantMemes: Var("wantMemes"),
                          wantFriends: Var("wantFriends"),
                          wantDates: Var("wantDates")
                        }
                      }),
                      account: Select(
                        ["ref"],
                        Create(Collection("accounts"), {
                          credentials: { password: Var("password") },
                          data: {
                            email: Var("email"),
                            user: Select(["ref"], Var("user"))
                          }
                        })
                      ),
                      secret: Login(Var("account"), {
                        password: Var("password")
                      })
                    },
                    Do(
                      Let(
                        {
                          followerstats: Create(Collection("followerstats"), {
                            data: {
                              postlikes: 0,
                              postrefweets: 0,
                              author: Select(["ref"], Var("user")),
                              follower: Select(["ref"], Var("user"))
                            }
                          })
                        },
                        Var("followerstats")
                      ),
                      {
                        user: Var("user"),
                        account: Var("account"),
                        secret: Var("secret")
                      }
                    )
                  )
                ),
                Abort("Rate limiting exceeded for this user/action")
              )
            )
          )
        ),
        Abort("Invalid e-mail provided")
      ),
      Abort("Invalid password, please provided at least 8 chars")
    )
  )
)