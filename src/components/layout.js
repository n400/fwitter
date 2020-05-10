import React from 'react'
import PropTypes from 'prop-types'
import { ToastContainer, toast } from 'react-toastify'
import Nav from './../components/nav'
import { useLocation } from 'react-router-dom'

const Layout = props => {
  console.log(useLocation().pathname )
  return (
    <div className={"page " + useLocation().pathname}>
      <ToastContainer position={toast.POSITION.BOTTOM_RIGHT} />
      <div className="body-container">
        <Nav/>
        <div className="main-wrapper">
          {props.children}
          <footer><small>&copy; Copyright 2020 grinnr &nbsp; &#8226; &nbsp;</small><small>privacy policy	 &nbsp; &#8226; &nbsp; terms of service </small></footer>
        </div>
     </div>
     </div>
  )
}

Layout.propTypes = {
  children: PropTypes.node
}

export default Layout
