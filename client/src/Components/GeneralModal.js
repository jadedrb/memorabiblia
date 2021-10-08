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

    let portalStuff = (
      <div className='g-modal'>
        {this.props.children}
        <div className='modal-cloud' onClick={this.props.toggle}></div>
      </div>
    )

    return ReactDOM.createPortal(portalStuff, this.el)
  }
}

export default GeneralModal;