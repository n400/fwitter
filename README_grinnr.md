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