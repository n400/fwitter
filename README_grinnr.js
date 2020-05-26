REACT_APP_LOCAL___ADMIN=fnADrXh4zeACE6x7m4IRfzqSExtqoaI1LtIqovpC
REACT_APP_LOCAL___BOOTSTRAP_FAUNADB_KEY=fnADrb8WMYACE9le640bhudOWQgd-pDxZwGOki_-
REACT_APP_LOCAL___CHILD_DB_NAME=fwitter
REACT_APP_LOCAL___CLOUDINARY_CLOUDNAME=n400
REACT_APP_LOCAL___CLOUDINARY_TEMPLATE=ml_default
REACT_APP_LOCAL___DEBUG_AUTO_LOGIN_USER=contractparty3@gmail.com
REACT_APP_LOCAL___DEBUG_AUTO_LOGIN_PWORD=testtest


// to make the old fwitter work:

// 1. do something with the users.name var you removed it from the db queries, but it's still in the FE code

// to make grinnr work if you delete the db and npm run setup:
// 1. Create meme_ratings collection
// 2. create memes collection and populate it with the Map() function in public\images\memes\jim\filenames.txt
// 3. create the following indexes:
      // meme_ratings_by_user
      // memes_rated_by_user
// 4. create a new role that can view/rate memes and profiles. grant it required permissions.
// name: view_and_rate_memes_and_view_profiles



//delete all meme ratings
Map(
  Paginate(Documents(Collection("meme_ratings"))),
  Lambda(ref => Delete(ref))
)

//see all previously rated memes with their ratings
CreateIndex({
  name: "meme_ratings_by_user",
  source: Collection("meme_ratings"),
  terms: [{field: ["data", "user"]}],
  values: [
    { field: ["data", "meme"] },
    { field: ["data", "rating"] },
    { field: ["data", "url"] },
    { field: ["data", "created"] },
    { field: ["data", "emoji_url"] },
    { field: ["ref"] }
  ]
})
// Get all memes the user has already rated
CreateIndex({
  name: "memes_rated_by_user",
  source: Collection("meme_ratings"),
  terms: [{field: ["data", "user"]}],
  values: [
    { field: ["data", "meme"] }
  ]
})

//should we use something like this for the profiles page?
// CreateIndex({
//   name: "user_previews_by_alias",
//   source: Collection("users"),
//   terms: [{field: ["data", "alias"]}],
//   values: [
//     // { field: ["data", "email"] },
//     { field: ["data", "wantMemes"] },
//     { field: ["data", "wantFriends"] },
//     { field: ["data", "wantDates"] },
//     { field: ["data", "dob"] },
//     { field: ["data", "asset01"] },
//     { field: ["ref"] }
//   ]
// })


Paginate(Match(
  Index("meme_ratings_by_user"), Ref(Collection("users"), "265231995802485267")
))

//get single meme ref from result of one result of the meme_ratings_by_user index 
Select(
  ['data','meme'],
  Get(Match(
    Index("meme_ratings_by_user"), Ref(Collection("users"), "265231995802485267")
  ))
)

Paginate(Match(
  Index("memes_rated_by_user"), Ref(Collection("users"), "265231995802485267")
))

// Get all memes user has not rated yet
Paginate(Difference(
  Documents(Collection("memes")),
  Match(
    Index("memes_rated_by_user"), Ref(Collection("users"), "265231995802485267")
  )
))




//check timestamps of all_memes and memes_rated_by_user nidexes for #cloud-support





Select(
  [data,url],
  
  Get(Ref(Collection("memes"), 2))
  )




  //TODO: 
//  1. zeit or netlify?
//  2. help@grinnr.com
//  3. generic privacy policy, tos pages 
//  4. create collection of memes by user who uploaded them (like the fewwet; can probably resue that code)
//
  //BUGS:
  // 1. refresh user info after finishregistration function (whatever happens after updateuser) so that it appears 
  //    in the profile page without having to refresh/re-login
  // 2. only show memes user has not yet rated
  //
  //
  // NICE TO HAVE:
  // 1. add memes for moderation, to memes collection? should meme_ratings be restrctured? 
  //    Or keep it flat and rely on indexes? But then we will run into pagination issues, right? which way is easier?
  // 2. allow user to re-rate memes?
  //
  // NOT BLOCKER FOR LAUNCH *(can rely on help@grinnr.com)
  // 2. make email editable via profile (update account info when the user info gets updated)
  // 3. not a blocker for launch: password reset flow, make password editable
  // 4. not a blocker for launch: lambda to stay logged in





  // //PROBABLY GARBAGE
// //After i get the difference, i could use a Get() to get the first one? that will probably take too long.
// // This does not work yet:
// Select(
//   ['data'],
//   Documents(Collection("memes"))
// )

// Select(
//   ['data'],
//   Match(
//     Index("memes_rated_by_user"), Ref(Collection("users"), "265231995802485267")
//   ),
// )
// // see what a user rated a meme
// CreateIndex({
//   name: "meme_rating_by_user_and_meme",
//   source: Collection("meme_ratings"),
//   terms: [
//     {field: ["data", "user"]},
//     {field: ["data", "meme"]}
// ],
//   values: [
//     { field: ["data", "rating"] },
//     { field: ["ref"] }
//   ]
// })
// Paginate(Match(
//   Index("meme_rating_by_user_and_meme"), 
//   Ref(Collection("users"), "265231995802485267"), 
//   Ref(Collection("memes"), "1")
// ))





CreateFunction({
  name: "register_with_user2",
  role: Role("functionrole_register_with_user"),
  body: Query()
})