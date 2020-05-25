import React from 'react'
import PropTypes from 'prop-types'
import { ToastContainer, toast } from 'react-toastify'
import {NavMobile, Nav} from './../components/nav'
import { useLocation } from 'react-router-dom'
import { Masonry } from './../components/masonry'
import { Footer } from './../components/footer'

// // https://blog.logrocket.com/developing-responsive-layouts-with-react-hooks/

const viewportContext = React.createContext({})

const ViewportProvider = ({ children }) => {
  const [width, setWidth] = React.useState(window.innerWidth)
  const [height, setHeight] = React.useState(window.innerHeight)
  const handleWindowResize = () => {
    setWidth(window.innerWidth)
    setHeight(window.innerHeight)
  };

  React.useEffect(() => {
    window.addEventListener("resize", handleWindowResize)
    return () => window.removeEventListener("resize", handleWindowResize)
  }, [])

  return (
    <viewportContext.Provider value={{ width, height }}>
      {children}
    </viewportContext.Provider>
  )
}

const useViewport = () => {
  const { width, height } = React.useContext(viewportContext)
  return { width, height }
}


const MobileComponent = function (props) {
    return (
    <>
      <div className={"mobile-layout " + useLocation().pathname}>
        <ToastContainer position={toast.POSITION.BOTTOM_RIGHT} />
        <div className="body-container">
          <NavMobile />
          <main className="main-wrapper">
            {props.children}
          </main>
          
        </div>
      </div>
      </>
  )
}

const DesktopComponent = function (props) {
  return (
  <>
    <Masonry /> 
    <div className={"desktop-layout " + useLocation().pathname}>
      <ToastContainer position={toast.POSITION.BOTTOM_RIGHT} />
      <div className="body-container">
      <NavMobile />
        <main className="main-wrapper">
          {props.children}
          {/* TODO: hide footer on home page (memes page), and fix how it looks everywhere else  */}
        </main>
        <Footer/>
      </div>
    </div>
    </>
)
}


const MyComponent = props => {
  const { width } = useViewport()
  const breakpoint = 768
  return width < breakpoint ? (<MobileComponent>{props.children}</MobileComponent>) : (<DesktopComponent>{props.children}</DesktopComponent>)
}

const Layout = props => {
  return (<ViewportProvider><MyComponent>{props.children}</MyComponent></ViewportProvider>)
}

Layout.propTypes = {children: PropTypes.node}

export default Layout
