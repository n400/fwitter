Select(["data","assets",0,"url"],Get(Match(Index("assetsD_by_user"),Ref(Collection('users'), '1'))))

// /images/eelopp / image10.jpg

// >> Time elapsed: 271ms

Get(Match(Index("assetsD_by_user"),Ref(Collection('users'), '1')))

// {
//   ref: Ref(Collection("profiles_dates"), "268360521756967442"),
//   ts: 1592187387140000,
//   data: {
//     user: Ref(Collection("users"), "1"),
//     created: Time("2020-05-25T20:28:24.851124Z"),
//     job: "quant",
//     gender: ["male", "fTm"],
//     orientation: ["gay", "blerghh"],
//     status: "single",
//     school: "hard knocks",
//     aboutMe:
//       "I’m looking to have a kid this year, so I need a wife. I wish this site let me say I want a wife. Oh, wait I guess it does!",
//     whyGrinnr:
//       "I’m sad and lonely and all I do all day is look at memes anyway.",
//     assets: [
//       {
//         url: "/images/people/image10.jpg",
//         caption: "guess where this was taken"
//       },
//       {
//         url: "/images/people/image11.jpg",
//         caption: "guess where this was taken"
//       },
//       {
//         url: "/images/people/image12.jpg",
//         caption: "guess where this was taken"
//       },
//       {
//         url: "/images/people/image13.jpg",
//         caption: "guess where this was taken"
//       },
//       {
//         url: "/images/people/image14.jpg",
//         caption: "guess where this was taken"
//       }
//     ]
//   }
// }

// >> Time elapsed: 14ms



Select(["data","assets", 0 ], Get(Match(Index("assetsD_by_user"), Ref(Collection("users"), "1")     )) )

// {
//   url: "/images/people/image10.jpg",
//   caption: "guess where this was taken"
// }

// >> Time elapsed: 11ms

Select(["data","assets", 0, "url"], Get(Match(Index("assetsD_by_user"), Ref(Collection("users"), "1")     )) )

// /images/eelopp / image10.jpg

// >> Time elapsed: 260ms


Paginate(Match(Index("assetsD_by_user"), Ref(Collection("users"), "1" )))

// {
//   data: [
//     ["/images/people/image10.jpg", "guess where this was taken"],
//     ["/images/people/image11.jpg", "guess where this was taken"],
//     ["/images/people/image12.jpg", "guess where this was taken"],
//     ["/images/people/image13.jpg", "guess where this was taken"],
//     ["/images/people/image14.jpg", "guess where this was taken"]
//   ]
// }

// >> Time elapsed: 12ms

Select(["data",0], Paginate(Match(Index("assetsD_by_user"), Ref(Collection("users"), "1" ))))

// ["/images/people/image10.jpg", "guess where this was taken"]

// >> Time elapsed: 646ms

Select(["data",0,0], Paginate(Match(Index("assetsD_by_user"), Ref(Collection("users"), "1" ))))

// /images/eelopp / image10.jpg

// >> Time elapsed: 134ms