to make the old fwitter work:

1. do something with the users.name var you removed it from the db queries, but it's still in the FE code

to make grinnr work if you delete the db and npm run setup:
1. Create meme_ratings collection
2. create a new role that can view/rate memes
3. add users and accounts as members (figure out later which is needed)
4. don't forget to add the meme_Ratings collection and grant the role the required permissions

Map(Paginate(Documents(Collection('meme_ratings'))),
Lambda(ref => Delete(ref))
)



//Create index to find a rating by meme and user (to see if user has already rated the meme yet)
// {
//   name: "rating_by_user_and_meme",
//   unique: false,
//   serialized: true,
//   source: "meme_ratings",
//   terms: [
//     {
//       field: ["data", "email"]
//     },
//     {
//       field: ["data", "meme_url"]
//     }
//   ],
//   values: [
//     {
//       field: ["data", "meme_rating"]
//     }
//   ]
// }
//
// ''Use it:
// Paginate(Match(Index("rating_by_user_and_meme"), "test@gmail.com", 1))

userRef















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