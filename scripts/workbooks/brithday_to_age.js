// Binding functions are not permitted to perform reads or writes.
// https://docs.fauna.com/fauna/current/api/fql/indexes#binding

// computes the value for a field in a document while 
// the document is being indexed.
// https://docs.fauna.com/fauna/current/tutorials/indexes/bindings.html 

CreateIndex({
  name: "people_by_rolodex",
  source: {
    collection: Collection("People"),
    fields: {
      rolodex: Query(
        Lambda(
          "doc",
          SubString(Select(["data", "last"], Var("doc")), 0, 1)
        )
      )
    }
  },
  terms: [ { binding: "rolodex" }],
  values: [
    { binding: "rolodex" },
    { field: ["data", "last"] },
    { field: ["ref"] }
  ]
})

CreateIndex({
  name: 'monthly_property_entry_by_id_year_month',
  source: {
    collection: q.Collection('MonthlyPropertyEntry'),
    fields: {
      year: q.Query(
        q.Lambda(
          'entry',
          q.Year(q.ToTime(q.Select(['data', 'targetDate'], q.Var('entry'))))
        )
      ),
      month: q.Query(
        q.Lambda(
          'entry',
          q.Month(q.ToTime(q.Select(['data', 'targetDate'], q.Var('entry'))))
        )
      )
    }
  },
  terms: [
    {
      field: ['data', 'targetProperty']
    },
    {
      binding: 'year'
    },
    {
      binding: 'month'
    }
  ]
})

CreateIndex({
  name: "orders_by_status",
  source: {
    collection: Collection("orders"),
    fields: {
      status: Query(
        Lambda("order", q.Select(['printJob', 'status'], Var("order")))
      )
    }
  },
  terms: [{ binding: "status" }]
})


// ok, let's try this
Divide(TimeDiff( 
  ToDate(Var("doc")),
  ToDate(SubString(ToString(Now()),0,FindStr(ToString(Now()), "T"))),
  'days'
),365)


CreateIndex({
  name: "age_by_user",
  source: {
    collection: Collection("users"),
    fields: {
      age: Query(
        Lambda(
          "doc",
          Divide(TimeDiff( 
            ToDate(Var("doc")),
            ToDate(SubString(ToString(Now()),0,FindStr(ToString(Now()), "T"))),
            'days'
          ),365)          
        )
      )
    }
  },
  terms: [ { field: "ref" }],
  values: [
    { binding: "age" },
    { field: ["ref"] },
    { field: ["data","dob"] },
  ]
})

Paginate(Match(Index("age_by_user"), Ref(Collection("users"),1)))

// {
//   data: [[null, Ref(Collection("users"), "1"), "1981-08-14"]]
// }


CreateIndex({
  name: "age_by_user2",
  source: {
    collection: Collection("users"),
    fields: {
      age: Query(
        Lambda(
          "doc",
          Divide(TimeDiff( 
            ToDate(Select(["data","dob"],Var("doc"))),
            ToDate(SubString(ToString(Now()),0,FindStr(ToString(Now()), "T"))),
            'days'
          ),365)          
        )
      )
    }
  },
  terms: [ { field: "ref" }],
  values: [
    { binding: "age" },
    { field: ["ref"] }
  ]
})

Paginate(Match(Index("age_by_user2"), Ref(Collection("users"),1)))


// {
//   data: [[null, Ref(Collection("users"), "1")]]
// }

CreateIndex({
  name: "age_by_user6",
  source: {
    collection: Collection("users"),
    fields: {
      age: Query(
        Lambda(
          "doc",
          Var("doc")         
        )
      )
    }
  },
  terms: [ { field: "ref" }],
  values: [
    { binding: "age" },
    { field: ["ref"] },
    { field: ["data", "dob"] }
  ]
})

Paginate(Match(Index("age_by_user6"), Ref(Collection("users"),1)))

// {
//   data: [[null, Ref(Collection("users"), "1")]]
// }

CreateIndex({
  name: "age_by_user8",
  source: [{
    collection: Collection("users"),
    fields: {
      age: Query(
        Lambda(
          "doc",
          Select(["data", "dob"], Var("doc"))
        )
      )
    }
  }],
  terms: [ { field: "ref" }],
  values: [
    { binding: "age" },
    { field: ["ref"] },
    { field: ["data", "dob"] }
  ]
})


Paginate(Match(Index("age_by_user8"), Ref(Collection("users"),1)))

// {
//   data: [["1981-08-14", Ref(Collection("users"), "1"), "1981-08-14"]]
// }

CreateIndex({
  name: "age_by_user",
  source: [{
    collection: Collection("users"),
    fields: {
      age: Query(
        Lambda(
          "doc",
          Divide(TimeDiff( 
            ToDate(Select(["data", "dob"], Var("doc"))),
            ToDate(SubString(ToString(Now()),0,FindStr(ToString(Now()), "T"))),
            'days'
          ),365)
        )
      )
    }
  }],
  terms: [ { field: "ref" }],
  values: [
    { binding: "age" },
    { field: ["ref"] }
  ]
})


Paginate(Match(Index("age_by_user"), Ref(Collection("users"),1)))


// {
//   data: [[null, Ref(Collection("users"), "1")]]
// }


CreateIndex({
  name: "age_by_user2",
  source: [{
    collection: Collection("users"),
    fields: {
      age: Query(
        Lambda(
          "doc",
          Select(["data", "dob"], Var("doc"))
        )
      )
    }
  }],
  terms: [ { field: "ref" }],
  values: [
    { binding: "age" },
    { field: ["ref"] }
  ]
})


Paginate(Match(Index("age_by_user2"), Ref(Collection("users"),1)))

// {
//   data: [["1981-08-14", Ref(Collection("users"), "1")]]
// }

CreateIndex({
  name: "age_by_user3",
  source: [{
    collection: Collection("users"),
    fields: {
      age: Query(
        Lambda(
          "doc",
          ToDate(Select(["data", "dob"], Var("doc")))
        )
      )
    }
  }],
  terms: [ { field: "ref" }],
  values: [
    { binding: "age" },
    { field: ["ref"] }
  ]
})

Paginate(Match(Index("age_by_user3"), Ref(Collection("users"),1)))

// {
//   data: [[Date("1981-08-14"), Ref(Collection("users"), "1")]]
// }

CreateIndex({
  name: "age_by_user4",
  source: [{
    collection: Collection("users"),
    fields: {
      age: Query(
        Lambda(
          "doc",
          TimeDiff(
            ToDate(Select(["data", "dob"], Var("doc"))),
            ToDate(SubString(ToString(Now()),0,FindStr(ToString(Now()), "T"))),
            
        ))
      )
    }
  }],
  terms: [ { field: "ref" }],
  values: [
    { binding: "age" },
    { field: ["ref"] }
  ]
})

Paginate(Match(Index("age_by_user4"), Ref(Collection("users"),1)))


CreateIndex({
  name: "age_by_user7",
  source: [{
    collection: Collection("users"),
    fields: {
      age: Query(
        Lambda(
          "doc",

          SubString(ToString(Now()),0,FindStr(ToString(Now()), "T"))
        )
      )
    }
  }],
  terms: [ { field: "ref" }],
  values: [
    { binding: "age" },
    { field: ["ref"] }
  ]
})

Paginate(Match(Index("age_by_user7"), Ref(Collection("users"),1)))


// {
//   data: [["+1000000000-12-31", Ref(Collection("users"), "1")]]
// }



CreateIndex({
  name: "age_by_user8",
  source: [{
    collection: Collection("users"),
    fields: {
      age: Query(
        Lambda(
          "doc",

          ToDate(SubString(ToString(Now()),0,FindStr(ToString(Now()), "T")))
        )
      )
    }
  }],
  terms: [ { field: "ref" }],
  values: [
    { binding: "age" },
    { field: ["ref"] }
  ]
})

Paginate(Match(Index("age_by_user8"), Ref(Collection("users"),1)))

// {
//   data: [[null, Ref(Collection("users"), "1")]]
// }




CreateIndex({
  name: "age_by_user9",
  source: [{
    collection: Collection("users"),
    fields: {
      age: Query(
        Lambda(
          "doc",

          ToString(Now())
        )
      )
    }
  }],
  terms: [ { field: "ref" }],
  values: [
    { binding: "age" },
    { field: ["ref"] }
  ]
})

Paginate(Match(Index("age_by_user9"), Ref(Collection("users"),1)))

// {
//   data: [
//     ["+1000000000-12-31T23:59:59.999999999Z", Ref(Collection("users"), "1")]
//   ]
// }


CreateIndex({
  name: "age_by_user10",
  source: [{
    collection: Collection("users"),
    fields: {
      age: Query(
        Lambda(
          "doc",
          Now()
        )
      )
    }
  }],
  terms: [ { field: "ref" }],
  values: [
    { binding: "age" },
    { field: ["ref"] }
  ]
})

Paginate(Match(Index("age_by_user10"), Ref(Collection("users"),1)))


// {
//   data: [
//     [
//       Time("+1000000000-12-31T23:59:59.999999999Z"),
//       Ref(Collection("users"), "1")
//     ]
//   ]
// }

CreateIndex({
  name: "now_by_user",
  source: [{
    collection: Collection("users"),
    fields: {
      now: Query(
        Lambda(
          "doc",
          Now()
        )
      )
    }
  }],
  terms: [ { field: "ref" }],
  values: [
    { binding: "now" }
  ]
})

Paginate(Match(Index("now_by_user"), Ref(Collection("users"),1)))

// {
//   data: [Time("+1000000000-12-31T23:59:59.999999999Z")]
// }

Now()

// Time("2020-06-10T01:33:41.537480Z")