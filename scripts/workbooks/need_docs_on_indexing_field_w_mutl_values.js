// i struggled a lot with this with match_docs, almost used a bad data model to get around it


    Paginate(Match(Index("r_and_ref_by_user"), Ref(Collection("users"), "3") ))


    {
      data: [
        [
          0.28735503296845616,
          Ref(Collection("match_scores"), "267542498619949568")
        ],
        [
          0.039550285024046714,
          Ref(Collection("match_scores"), "267713750245573139")
        ],
        [
          -0.42261260265415435,
          Ref(Collection("match_scores"), "267715458212299264")
        ]
      ]
    }
    
    >> Time elapsed: 472ms
    
    
        Paginate(Match(Index("r_and_ref_by_user"), Ref(Collection("users"), "1") ))
    
    
    {
      data: [
        [0.4572918461746685, Ref(Collection("match_scores"), "267542498585349632")],
        [
          0.18042113051542646,
          Ref(Collection("match_scores"), "267713750259204627")
        ],
        [
          0.15051678967828355,
          Ref(Collection("match_scores"), "267715446503899666")
        ],
        [
          0.050626570120591304,
          Ref(Collection("match_scores"), "267715446471393810")
        ],
        [
          0.039550285024046714,
          Ref(Collection("match_scores"), "267713750245573139")
        ],
        [-0.3098292967086785, Ref(Collection("match_scores"), "267713606789890579")]
      ]
    }
    
    >> Time elapsed: 597ms
    
    
        Paginate(
          Intersection(
                  Match(Index("r_and_ref_by_user"), Ref(Collection("users"), "3") ),
                  Match(Index("r_and_ref_by_user"), Ref(Collection("users"), "1") )
            )
        )
    
    
    {
      data: [
        [
          0.039550285024046714,
          Ref(Collection("match_scores"), "267713750245573139")
        ]
      ]
    }
    