
CreateIndex({
  name: "asset01_by_user",
  source: [Collection("profiles_friends"),Collection("profiles_dates")],
  terms: [{ field: ["data", "user"]}], 
  values: [{ field: ["data", "asset01"]}],
})

Paginate(Match(Index("asset01_by_user"),Ref(Collection('users'), '1')))

// {
//   data: []
// }

CreateIndex({
  name: "asset01_by_user",
  source: [Collection("profiles_friends")],
  terms: [{ field: ["data", "user"]}], 
  values: [{ field: ["data", "asset01"]}],
})

Paginate(Match(Index("asset01_by_user"),Ref(Collection('users'), '1')))

// {
//   data: []
// }

CreateIndex({
  name: "job_by_user",
  source: Collection("profiles_friends"),
  terms: [{ field: ["data", "user"]}], 
  values: [{ field: ["data", "job"]}],
})

Paginate(Match(Index("job_by_user"),Ref(Collection('users'), '1')))

//   data: ["quant"]

CreateIndex({
  name: "avatar_by_user",
  source: [Collection("profiles_friends"),Collection("profiles_dates")],
  terms: [{ field: ["data", "user"]}], 
  values: [{ field: ["data", "asset01" ,"url"]}],
})

Paginate(Match(Index("avatar_by_user"),Ref(Collection('users'), '1')))

// works

CreateIndex({
  name: "assetsF_by_user",
  source: Collection("profiles_friends"),
  terms: [{ field: ["data", "user"]}], 
  values: [{ field: ["data", "assets","url"]},{ field: ["data", "assets","caption"]}],
})

CreateIndex({
  name: "assetsD_by_user",
  source: Collection("profiles_dates"),
  terms: [{ field: ["data", "user"]}], 
  values: [{ field: ["data", "assets","url"]},{ field: ["data", "assets","caption"]}],
})

Paginate(Match(Index("assetsD_by_user"),Ref(Collection('users'), '1')))

Select(["data","assets",0,"url"],Get(Match(Index("assetsD_by_user"),Ref(Collection('users'), '1'))))