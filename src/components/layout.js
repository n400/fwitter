import React from 'react'
import PropTypes from 'prop-types'
import { ToastContainer, toast } from 'react-toastify'
import Nav from './../components/nav'
import { NavLink, useLocation } from 'react-router-dom'
import { Masonry } from './../components/masonry'


const Layout = props => {
  console.log(useLocation().pathname )
  return (
    <>
    <Masonry />
    <div className={"page " + useLocation().pathname}>
      <ToastContainer position={toast.POSITION.BOTTOM_RIGHT} />
      <div className="body-container">
        <Nav/>
        <div className="main-wrapper">
          {props.children}
          {/* TODO: hide footer on home page (memes page), and fix how it looks everywhere else  */}
          {/* <footer><small>&copy; Copyright 2020 grinnr &nbsp; &#8226; &nbsp;</small><small><NavLink to="/legal">legal</NavLink>	 &nbsp; &#8226; &nbsp;<NavLink to="/media">media</NavLink>	</small></footer> */}
        </div>
      </div>
     </div>
    </>
  )
}

Layout.propTypes = {
  children: PropTypes.node
}

export default Layout
