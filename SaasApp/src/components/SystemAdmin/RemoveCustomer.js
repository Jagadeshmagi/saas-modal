import React from 'react';
import {Button, Modal, Form} from 'react-bootstrap'
import {deprovisionPulsar} from '../../helpers/provision'

export default class RemoveCustomer extends React.Component {
  constructor(props) {    
    super(props);
    this.state = {
      openRemoveModal:false,
      userId:0,
      showRemove:true,
      modalTitle:''
    }
  }

  componentDidMount(){
    this.setContentTitle()
  }

  close(e){
    e.preventDefault();
    if(this.state.openRemoveModal){
      this.setState({openRemoveModal:false})
    }
  }

  removeClicked(){
    this.setState({openRemoveModal:true})
  }

  setContentTitle(){
    if(this.props.deprovisioningAction === 'TERMINATE'){
      this.setState({modalTitle:'TERMINATE'})
    }else if(this.props.deprovisioningAction === 'STOP'){
      this.setState({modalTitle:'STOP'})
    }else if(this.props.deprovisioningAction === 'RESTART'){
      this.setState({modalTitle:'RESTART'})
    }
  }

  handleRemove(e){
    let action
    if(this.props.deprovisioningAction === 'TERMINATE'){
      action = 'terminate'
    }else if(this.props.deprovisioningAction === 'STOP'){
      action = 'stop'
    }else if(this.props.deprovisioningAction === 'RESTART'){
      action = 'restart'
    }

    deprovisionPulsar(this.props.customer.customerid, action)
    .then((responce) =>  {
        this.setState({openRemoveModal:false})
        this.props.refresh()
      }
     )
    .catch((error) => console.log("Error in deprovisioning" + error))
  }


  render(){
    console.log('deprovisioningAction:', this.props.deprovisioningAction)
    return(
      <div>
      {this.state.showRemove ? 
        <div style={{display:'flex', color: '#4e5ba4'}}>
          <div style={{cursor:'pointer'}} onClick={this.removeClicked.bind(this)}>
            {(this.props.deprovisioningAction === 'TERMINATE')?
              'Terminate' : ''
            }
            {(this.props.deprovisioningAction === 'STOP')?
              'Stop' : ''
            }
            {(this.props.deprovisioningAction === 'RESTART')?
              'Restart' : ''
            }
          </div>
        </div>
      :''}
        <div>
        <Modal
          show={this.state.openRemoveModal}
          onHide={this.close}
          backdrop='static'>
          <form style={{border: '1px solid Navy'}}>
            <div style={{marginTop:'10px',paddingLeft:'15px', minHeight:180}}>
              <Modal.Header  style={{marginRight:15,borderBottom:0}}>
                <a href="javascript:void(0)" className='closebtn' onClick={this.close.bind(this)} show={true} onHide={this.close} backdrop='static'>
                  &#x2715;
                </a>
                <Modal.Title id="contained-modal-title" style={{fontSize: 20, fontWeight:'bold', color: '#454855'}}>
                  {this.state.modalTitle}
                </Modal.Title>
              </Modal.Header>
              <Modal.Body style={{padding:'0 15px 15px'}}>
                {(this.state.modalTitle === 'TERMINATE')?
                    <p>Are you sure you want to terminate the instance?</p>: ''
                }

                {(this.state.modalTitle === 'STOP')?
                    <p>Are you sure you want to stop the instance?</p> : ''
                }

                {(this.state.modalTitle === 'RESTART')?
                    <p>Are you sure you want to restart the instance?</p> : ''
                }               
                <div className='modalButtons'>
                  <div><Button className='modalButton' onClick={this.close.bind(this)} style={{color:'#4d59a4', backgroundColor:'#f6f4f4'}}>NO</Button></div>
                  <div><Button className='modalButtonSucess' onClick={this.handleRemove.bind(this)}>YES</Button></div>
                </div>
              </Modal.Body>
            </div>
          </form>
        </Modal>
        </div>
      </div>
    )
  }
}
