import React from 'react';
import {Button, Modal, Form} from 'react-bootstrap'
import {suspendUser} from '../helpers/users'

export default class SuspendUser extends React.Component {
  constructor(props) {    
    super(props);
    this.state = {
      openSuspendModal:false,
      userId:'',
      showSuspend:true
    }
  }

  componentWillMount(){
    if(this.props.suspendUserList.indexOf(parseInt(this.state.userId))== 0){
      this.setState({showSuspend:true})      
    }else{
      this.setState({showSuspend:false})
    }
    
    this.setState({userId:localStorage.getItem('userId'), suspendUserList:this.props.suspendUserList})
  }

  componentWillReceiveProps(nextProps,nextState){    
    if(this.props.suspendUserList.indexOf(parseInt(this.state.userId))== -1){
      this.setState({showSuspend:true})      
    }else{
      this.setState({showSuspend:false})
    }
  }

  close(e){
    e.preventDefault();
    if(this.state.openSuspendModal){
      this.setState({openSuspendModal:false})
    }
  }

  suspendClicked(){
    this.setState({openSuspendModal:true})
  }

  handleSuspend(e){
    suspendUser(this.props.suspendUserList)
    .then((responce) =>  {
        this.setState({openSuspendModal:false})
        this.props.refreshTable()
        console.log('I am in sucess'+ JSON.stringify(responce))
      }
     )
    .catch((error) => console.log("Error in Adding New User" + error))
  }
  render(){
    return(
      <div>
        {this.state.showSuspend ? 
        <div style={{display:'flex'}}>
          <div onClick={this.suspendClicked.bind(this)}>Suspend</div><span>&nbsp;|&nbsp;</span>
        </div>
        :''}
        <span>
        <Modal
          show={this.state.openSuspendModal}
          onHide={this.close}
          backdrop='static'>
          <form style={{border: '1px solid Navy'}}>
            <div style={{marginTop:'10px',paddingLeft:'15px', minHeight:180}}>
              <Modal.Header  style={{marginRight:15,borderBottom:0}}>
                <a href="" className='closebtn' onClick={this.close.bind(this)} show={true} onHide={this.close} backdrop='static'>
                  &#x2715;
                </a>
                <Modal.Title id="contained-modal-title" style={{fontSize: 20, fontWeight:'bold', color: '#454855'}}>
                  {'SUSPEND USER'}
                </Modal.Title>
              </Modal.Header>
              <Modal.Body style={{padding:'0 15px 15px'}}>
                <p>Are you sure you want to suspend the selected User/Users?</p>
                <div className='modalButtons'>
                  <div><Button className='modalButton' onClick={this.close.bind(this)} style={{color:'#4d59a4', backgroundColor:'#f6f4f4'}}>NO</Button></div>
                  <div><Button className='modalButtonSucess' onClick={this.handleSuspend.bind(this)}>YES</Button></div>
                </div>
              </Modal.Body>
            </div>
          </form>
        </Modal>
        </span>
      </div>
    )
  }
}
