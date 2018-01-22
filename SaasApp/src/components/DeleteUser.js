import React from 'react';
import {Button, Modal, Form} from 'react-bootstrap'
import {deleteUser} from '../helpers/users'

export default class AddUser extends React.Component {
  constructor(props) {    
    super(props);
    this.state = {
      openDeleteModal:false,
      userId:0,
      showDelete:true,
      deleteUserList:[]
      // deleteUserList:[]
    }
  }

  componentWillMount(){
    if(this.props.deleteUserList.indexOf(parseInt(this.state.userId))== 0){
      this.setState({showDelete:true})      
    }else{
      this.setState({showDelete:false})
    }

    this.setState({userId:localStorage.getItem('userId'), deleteUserList:this.props.deleteUserList})
  }

  componentWillReceiveProps(nextProps,nextState){
    if(this.props.deleteUserList.indexOf(parseInt(this.state.userId))== -1){
      this.setState({showDelete:true})      
    }else{
      this.setState({showDelete:false})
    }
  }

  close(e){
    e.preventDefault();
    if(this.state.openDeleteModal){
      this.setState({openDeleteModal:false})
    }
  }

  deleteClicked(){
    this.setState({openDeleteModal:true})
  }

  handleDelete(e){
    deleteUser(this.props.deleteUserList)
    .then((responce) =>  {
        this.setState({openDeleteModal:false})
        console.log('I am in sucess'+ JSON.stringify(responce))
        this.props.refreshTable()
      }
     )
    .catch((error) => console.log("Error in Adding New User" + error))
  }
  render(){

    // console.log('deleteUserList Render', this.props.deleteUserList)
    return(
      <div>
      {this.state.showDelete ? 
        <div style={{display:'inline-block'}}>
          <div onClick={this.deleteClicked.bind(this)}>Delete</div>
        </div>
      :''}
        <div>
        <Modal
          show={this.state.openDeleteModal}
          onHide={this.close}
          backdrop='static'>
          <form style={{border: '1px solid Navy'}}>
            <div style={{marginTop:'10px',paddingLeft:'15px', minHeight:180}}>
              <Modal.Header  style={{marginRight:15,borderBottom:0}}>
                <a href="" className='closebtn' onClick={this.close.bind(this)} show={true} onHide={this.close} backdrop='static'>
                  &#x2715;
                </a>
                <Modal.Title id="contained-modal-title" style={{fontSize: 20, fontWeight:'bold', color: '#454855'}}>
                  {'DELETE USER'}
                </Modal.Title>
              </Modal.Header>
              <Modal.Body style={{padding:'0 15px 15px'}}>
                <p>Are you sure you want to delete this User?</p>
                <div className='modalButtons'>
                  <div><Button className='modalButton' onClick={this.close.bind(this)} style={{color:'#4d59a4', backgroundColor:'#f6f4f4'}}>NO</Button></div>
                  <div><Button className='modalButtonSucess' onClick={this.handleDelete.bind(this)}>YES</Button></div>
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
