import React from 'react';
import {Button, Modal} from 'react-bootstrap'

export default class SucessMessage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
    }
  }

  render() {
    return (
      <div>
        <Modal
          show={this.props.showAlert}
          onHide={this.close}
          backdrop='static'>
          <form style={{border: '1px solid Navy'}}>
            <div style={{marginTop:'10px',paddingLeft:'15px'}}>
              <Modal.Header  style={{marginRight:15,borderBottom:0}}>
                <a href="http://cavirin.io/" className='closebtn' onClick={this.close} show={true} onHide={this.close} backdrop='static'>
                  &#x2715;
                </a>
                <Modal.Title id="contained-modal-title" style={{fontSize: 20, fontWeight:'bold', color: '#454855'}}>
                  {'CONGRATULATIONS'}
                </Modal.Title>
              </Modal.Header>
              <Modal.Body style={{padding:'0 15px 15px'}}>
                  <p>Your order has been accepted. You will be receiving a confirmation mail along with the link to admin portal to connect to the Server.</p>
              </Modal.Body>
            </div>
          </form>
        </Modal>
      </div>
    );
  }
}