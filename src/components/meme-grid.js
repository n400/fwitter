import React, { useState, useEffect } from 'react'
import { faunaQueries } from '../fauna/query-manager'
import { toast } from 'react-toastify'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faEye, faIcons, faHeadSideVirus, faLaugh, faHeart, faImages, faUserFriends, faBirthdayCake, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons'

const MemeGrid = (passedData) => {

  const profileToFetch = passedData.passedData
  const [data, setData] = useState(undefined)

  
  async function getNextMemeList (options = {}) {
    return faunaQueries
      .getMemesRatedMutually(profileToFetch,options.rating1,options.rating2)
      .then(res => {
        let memeList = res.data
        //TODO: load the other lists in the background so they load faster on click.
        // might want to lod them in their own divs instead of using the same div for all of them
        // that was the unrated ones can be obscured more easily
        //TODO: refactor setData out of this function so the component doesnt render
        /// twice on fist load after the data is there, but still re-renders on clicking the tabs
        // make a new function that rerenders the component, or figure out how to call the useEffect
        // console.log("getNextMemeList res", res)
        return memeList
      })
      .catch(err => {
        console.log(err)
        toast.error('get memes failed')
      })
  }

  async function getUnratedMemesFromProfile (options = {}) {
    console.log("gettin it")
    return faunaQueries
      .getUnratedMemesFromProfile(profileToFetch)
      .then(res => {
        let memeList = res.data
        //TODO: load the other lists in the background so they load faster on click
        //TODO: refactor setData out of this function so the component doesnt render
        /// twice on fist load after the data is there, but still re-renders on clicking the tabs
        // make a new function that rerenders the component, or figure out how to call the useEffect

        // setData({ memeList })
        return memeList
      })
      .catch(err => {
        console.log(err)
        toast.error('get memes failed')
      })
  }


  useEffect(() => {
    let didCancel = false
    async function fetchData () {
      if (didCancel) return
      let memeList = await getNextMemeList({ rating1: "4", rating2: "5" })
      let tabState = 'likes'
      setData({
        tabState: tabState,
        memeList: memeList
      })
    }
    fetchData()
    return function () {didCancel = true}
  }, [])

  async function handleMemeTabs(evt) {
    // console.log(evt.target.className)
    let memeList = undefined
    let tabState = evt.target.dataset.memebatch
    switch (tabState) {
      case 'likes':      
        memeList = await getNextMemeList({ rating1: "4", rating2: "5" })
      break;
      case 'dislikes':
        memeList = await getNextMemeList({ rating1: "1", rating2: "2" })
      break;
      case 'findout':
        memeList =await getUnratedMemesFromProfile(profileToFetch)
      break;
    }
    setData({
      tabState: tabState,
      memeList: memeList
    })
  }

  return renderMemeGrid()
  
  function renderMemeGrid () {
    // console.log("1",data)

    if (data === undefined) return (<React.Fragment><h1>Loading ... </h1></React.Fragment>)

  //   let tabListHTML = {
  //     'likes'    : {text: 'You both liked'},
  //     'dislikes' : {text: 'You both disliked'},
  //     'findout'  : {text: 'Find out!'},
  //  }
  //                {(Object.keys(tabListHTML)).map((tabListId) => (
  //                <div data-memebatch="{tabListId}" onClick={handleMemeTabs} className={'tab ' + (data.tabState == tabListId ? 'active' : '')}>{tabListHTML[tabListId]}</div>
  //               ))}
    return (
      <>
            <div className="tabs">
               <div data-memebatch="likes" onClick={handleMemeTabs} className={'tab ' + (data.tabState == 'likes' ? 'active' : '')}>You both liked</div>
              <div data-memebatch="dislikes" onClick={handleMemeTabs} className={'tab ' + (data.tabState == 'dislikes' ? 'active' : '')}>You both disliked</div>
              <div data-memebatch="findout" onClick={handleMemeTabs} className={'tab '+ (data.tabState == 'findout' ? 'active' : '')}>Find out!</div>
            </div>
            <div className="grid">
              {data.memeList.map(( meme,index ) => (
                <div className="grid-item-wrap">
                    <div key={index} className="grid-item">
                      <img className="rated-meme" src={meme.data.url}/>
                  </div>
                </div>
              ))}
            </div>
      </>
    )
  }
}

export {MemeGrid}
