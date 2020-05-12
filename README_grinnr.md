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