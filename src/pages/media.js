import React, { 
  // useEffect, useContext 
  useState
} from 'react'
// import SessionContext from '../context/session'
import { Link } from 'react-router-dom'
import {Modal} from '../components/modals'

// Components

// // https://jsfiddle.net/jd2yr6h9/1/
// class Modal extends React.Component {
// 	constructor(props) {
//   	super(props);
//     this.handleClickOutside = this.handleClickOutside.bind(this);
//   }
// 	componentDidMount() {
//   	// document.body.style.overflow = 'hidden';
//     document.addEventListener('mousedown', this.handleClickOutside);
//   }
//   componentWillUnmount() {
//   	document.removeEventListener('mousedown', this.handleClickOutside);
//   	document.body.style.overflow = 'unset';
//   }
//   handleClickOutside(event) {
//         const { closeModal } = this.props;
//         if (this.modalRef && !this.modalRef.contains(event.target)) {
//             closeModal();
//         }
//   }
// 	render() {
//   	return (
//     	<div className='modal'>  	  
//          <div ref={ref => { this.modalRef = ref; }} className='modal-content'>
//              <p className="modal-header">scroll me</p>
//              <button tabIndex='0' onClick={this.props.closeModal}>Close Modal</button>
//          </div>
//     	</div>
//     )
//   }
// }




const Media = props => {
  const [showModal, setShowModal] = useState( false )

  // constructor(props) {
  // 	super(props);
  
  //   this.state = {
  //   	showModal: false
  //   }
  // }

  return (
    <React.Fragment>

      <div className="main">
          { showModal && (
            <Modal closeModal={() => setShowModal( false )} />
          )}
        <button onClick={() => setShowModal( true )}>Open modal</button>
      </div>

      <div className="form-wrapper">
        <div className="form-header">
          <h1>Love for grinnr</h1>
        </div>
        <p>
        Here are some of the creative ways other users are helping get the word out.</p>
        <p><img src="/images/memes/jim/meme (1).jpg" /></p>
        <p><img src="/images/memes/jim/meme (3).jpg" /></p>
        <p>If you're looking for a real "about" page, email help@grinnr.com</p>
        <Link className="button" to="/">Rate memes</Link>
     </div>
     
    </React.Fragment>
  )
}

export default Media

// ReactDOM.render(
//   <App />,
//   document.getElementById('container')
// );