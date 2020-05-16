import React from 'react'

const Masonry = props => {

  return (
    <>
      <div className="masonry">
      
          <div className="flex-item"><img alt="" src="https://imgflip.com/s/meme/Disaster-Girl.jpg"/></div>
          <div className="flex-item"><img alt="" src="https://imgflip.com/s/meme/Is-This-A-Pigeon.jpg"/></div>
          <div className="flex-item"><img alt="" src="https://i.imgflip.com/2/24y43o.jpg"/></div>
          <div className="flex-item"><img alt="" src="https://imgflip.com/s/meme/Disaster-Girl.jpg"/></div>
          <div className="flex-item"><img alt="" src="https://imgflip.com/s/meme/Is-This-A-Pigeon.jpg"/></div>
          
          <div className="flex-item"><img alt="" src="/images/memes/blank/meme-blank-doge.jpg" /></div>
          <div className="flex-item"><img alt="" src="https://i.imgflip.com/2/24y43o.jpg"/></div>
          <div className="flex-item"><img alt="" src="https://imgflip.com/s/meme/Is-This-A-Pigeon.jpg"/></div>
          <div className="flex-item disaster-girl"><img alt="" src="https://imgflip.com/s/meme/Disaster-Girl.jpg"/></div>
          <div className="flex-item"><img alt="" src="https://i.imgflip.com/2/24y43o.jpg"/></div>
          <div className="flex-item"><img alt="" src="https://i.imgflip.com/2/24y43o.jpg"/></div>
          
      </div>
      <div className="masonry-overlay"></div>
    </>
  )
}

export { Masonry }
