import React from 'react'
import { NavLink } from 'react-router-dom'

const Footer = props => {

  return (
    <> 
    <footer><small>&copy; Copyright 2020 grinnr &nbsp; &#8226; &nbsp;</small><small><NavLink to="/legal">legal</NavLink>	 &nbsp; &#8226; &nbsp;<NavLink to="/media">media</NavLink>	</small></footer>

    </>
  )
}

export { Footer }
