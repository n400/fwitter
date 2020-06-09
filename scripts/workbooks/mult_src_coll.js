CreateIndex({
  name: "test_1",
  source: [Collection("users"), Collection("match_scores") ],
  terms: [{field: ["data", "wants"]}],
  values: [
    { field: ["data", "users"] },
    { field: ["data", "r"] }
  ]
})

Paginate(Match(Index('test_1'),'friends'))

// {
//   data: []
// }

CreateIndex({
  name: "test_2",
  source: [Collection("users"), Collection("match_scores") ],
  terms: [{field: ["data", "wants"]}],
  values: [
    { field: ["data", "r"] }
  ]
})

Paginate(Match(Index('test_2'),'friends'))

// {
//   data: []
// }

CreateIndex({
  name: "test_3",
  source: [Collection("users"), Collection("match_scores") ],
  terms: [{field: ["data", "wants"]}],
  values: []
})

// {
//   data: [
//     Ref(Collection("users"), "1"),
//     Ref(Collection("users"), "2"),
//     Ref(Collection("users"), "3"),
//     Ref(Collection("users"), "4"),
//     Ref(Collection("users"), "5"),
//     Ref(Collection("users"), "6"),
//     Ref(Collection("users"), "7"),

CreateIndex({
  name: "test_4",
  source: [Collection("users"), Collection("meme_ratings") ],
  terms: [{field: ["data", "wants"]},{field: ["data", "rating"]}],
  values: []
})

Paginate(Match(Index('test_2'),'friends',5))

// {
//   data: []
// }
