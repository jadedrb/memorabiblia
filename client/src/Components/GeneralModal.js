import React from 'react';
import ReactDOM from 'react-dom';

const modal = document.getElementById('modal-root')

class GeneralModal extends React.Component {

  el = document.createElement('div')

  
  componentDidMount() {
    modal.appendChild(this.el)
  }

  componentWillUnmount() {
    modal.removeChild(this.el)
  }

  render() {
    return ReactDOM.createPortal(this.props.children, this.el)
  }
}

export default GeneralModal;