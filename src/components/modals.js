import React, { 
  // useEffect, useContext 
  useState
} from 'react'
// import SessionContext from '../context/session'
import { Link } from 'react-router-dom'

// Components

// https://jsfiddle.net/jd2yr6h9/1/
class Modal extends React.Component {
	constructor(props) {
  	super(props);
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }
	componentDidMount() {
  	// document.body.style.overflow = 'hidden';
    document.addEventListener('mousedown', this.handleClickOutside);
  }
  componentWillUnmount() {
  	document.removeEventListener('mousedown', this.handleClickOutside);
  	document.body.style.overflow = 'unset';
  }
  handleClickOutside(event) {
        const { closeModal } = this.props;
        if (this.modalRef && !this.modalRef.contains(event.target)) {
            closeModal();
        }
  }
	render() {
  	return (
    	<div className='modal'>  	  
         <div ref={ref => { this.modalRef = ref; }} className='modal-content'>
             <p className="modal-header">scroll me</p>
             <button tabIndex='0' onClick={this.props.closeModal}>Close Modal</button>
         </div>
    	</div>
    )
  }
}

export {Modal}