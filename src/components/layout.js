import React from 'react'
import PropTypes from 'prop-types'
import { ToastContainer, toast } from 'react-toastify'
import Nav from './../components/nav'
import { NavLink, useLocation } from 'react-router-dom'
import { Masonry } from './../components/masonry'

// // https://blog.logrocket.com/developing-responsive-layouts-with-react-hooks/
// const viewportContext = React.createContext({});
// const ViewportProvider = ({ children }) => {
//   const [width, setWidth] = React.useState(window.innerWidth);
//   const [height, setHeight] = React.useState(window.innerHeight);
//   const handleWindowResize = () => {
//     setWidth(window.innerWidth);
//     setHeight(window.innerHeight);
//   };
//   React.useEffect(() => {
//     window.addEventListener("resize", handleWindowResize);
//     return () => window.removeEventListener("resize", handleWindowResize);
//   }, []);

//   return (
//     <viewportContext.Provider value={{ width, height }}>
//       {children}
//     </viewportContext.Provider>
//   );
// };
// const useViewport = () => {
//   const { width, height } = React.useContext(viewportContext);
//   return { width, height };
// };
// const MobileLayout = props => {
//   console.log(props.children )
//   return (
//         <>
//         {/* TODO: only show masonry at larger widths */}
//         <Masonry /> 
//         <div className={"page " + useLocation().pathname}>
//           <ToastContainer position={toast.POSITION.BOTTOM_RIGHT} />
//           <div className="body-container">
//             <Nav/>
//             <div className="main-wrapper">
//               {props.children}
//               {/* TODO: hide footer on home page (memes page), and fix how it looks everywhere else  */}
//               <footer><small>&copy; Copyright 2020 grinnr &nbsp; &#8226; &nbsp;</small><small><NavLink to="/legal">legal</NavLink>	 &nbsp; &#8226; &nbsp;<NavLink to="/media">media</NavLink>	</small></footer>
//             </div>
//           </div>
//          </div>
//         </>
//       )
// }

// const DesktopLayout = props => <p>"Wow, your screen is big!"</p>;
// const Layout = props => {
//   const { width } = useViewport();
//   const breakpoint = 620;
//   return width < breakpoint ? <MobileLayout /> : <DesktopLayout />;
// };
// const MyLayout = props => {
//   return (
//     <ViewportProvider>
//       <Layout />
//     </ViewportProvider>
//   );
// }


const Layout = props => {
  // console.log(useLocation().pathname )
  return (
    <>
    {/* TODO: only show masonry at larger widths */}
    <Masonry /> 
    <div className={"page " + useLocation().pathname}>
      <ToastContainer position={toast.POSITION.BOTTOM_RIGHT} />
      <div className="body-container">
        <Nav/>
        <div className="main-wrapper">
          {props.children}
          {/* TODO: hide footer on home page (memes page), and fix how it looks everywhere else  */}
          <footer><small>&copy; Copyright 2020 grinnr &nbsp; &#8226; &nbsp;</small><small><NavLink to="/legal">legal</NavLink>	 &nbsp; &#8226; &nbsp;<NavLink to="/media">media</NavLink>	</small></footer>
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
