import React, { useState, useEffect, useContext } from 'react'
import { useParams, Link } from 'react-router-dom'
import SessionContext from '../context/session'
import { faunaQueries } from '../fauna/query-manager'
import { toast } from 'react-toastify'
import { Uploader } from '../components/uploader'
import Asset from '../components/asset'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faEye, faIcons, faHeadSideVirus, faLaugh, faHeart, faImages, faUserFriends, faBirthdayCake, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons'

const Chats = () => {
  const [data, setData] = useState(undefined)
  useEffect(() => {
    async function fetchData () {
      let matchList = await getNextProfileList()
      setData({ matchList: matchList })
    }
    fetchData()
  }, [])

  async function getNextProfileList (options = {}) {
    // let excludeMeme = options.excludeMeme
    return faunaQueries
      .getAllProfiles()
      .then(res => {
        let matchList = res.data
        return matchList
      })
      .catch(err => {
        console.log(err)
        toast.error('get matches failed')
      })
  }

  return renderMeme()

  function renderMeme () {

    if ( data === undefined) return (<React.Fragment><div>Loading ... </div></React.Fragment>)
    return (
      <>
        {data.matchList.map(( match, index) => (
          <h5 key={index}><Link to={`/profile/${match.data.alias}`}>{match.data.alias}</Link></h5>
        ))}

      </>
    );

  }

};


export default Chats