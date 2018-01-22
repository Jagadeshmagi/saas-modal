import React from 'react';
import {Button, Modal, Form} from 'react-bootstrap'
import {addNewUser, validateEmail,editUser, updateUser} from '../helpers/users'

export default class AddUser extends React.Component {
  constructor(props) {    
    super(props);
    this.state = {
      firstName:'',
      lastName:'',
      email:'',
      current_email:'',
      cusID:53,
      addDisable:false,
      openAddUserModal:false,
      showError:false,
      editMode:false,
      status:'',
      userId:'',
      disabledMail:false
    }
  }

  componentDidMount(){
    this.setState({userId:localStorage.getItem('userId')})
  }

  componentWillReceiveProps(nextProps,nextState){    
    if(this.props.userList.indexOf(parseInt(this.state.userId))== -1){
      this.setState({disabledMail:false})      
    }else{
      this.setState({disabledMail:true})
    }
  }

  close(e){
    e.preventDefault();
    if(this.state.openAddUserModal){
      this.setState({openAddUserModal:false,firstName:'',lastName:'',email:''})
    }
  }

  handleAddUser(){
    this.setState({openAddUserModal:true, firstName:'', lastName:'', email:''})
  }

  handleEditUser(){
    editUser(this.props.userList[0])
    .then((responce) =>  {
        // console.log('responce', responce)
        this.setState({
          firstName:responce.data.first_name,
          lastName:responce.data.last_name,
          email:responce.data.email,
          current_email:responce.data.email,
          status:'Active'
        })
        // console.log('I am in sucess'+ JSON.stringify(responce))
      }
     )
    .catch((error) => console.log("Error in Adding New User" + error))


    this.setState({openAddUserModal:true},function(){
      this.setState({editMode:true})
    })
  }


  handleAdd(){
    this.validateEmail()
  }

  validateEmail(){
    validateEmail(this.state.email)
    .then((responce) =>  {
        // console.log('responce', responce)
        if(responce.status == 'failed'){
          if(this.state.editMode){
            this.handleUpdate()
          }else{            
            this.sendDataToAddUser()          
            this.setState({showError:false,firstName:'',lastName:'',email:''})
          }
        }else{
          this.setState({showError:true})
        }

        console.log('I am in sucess'+ JSON.stringify(responce))
      }
     )
    .catch((error) => console.log("Error in Adding New User" + error))
  }

  updateButtonClicked(){
    console.log('hhhhh', this.state.current_email, this.state.email)
    if(this.state.current_email !== this.state.email){
      console.log('not eq')
      this.validateEmail()
    }else{
      console.log('equal')
      this.handleUpdate()
    }
  }

  handleUpdate(){
    console.log('Clicked')
    updateUser(this.state.firstName, this.state.lastName, this.state.email, this.state.status, parseInt(this.props.userList[0]))
    .then((responce) =>  {
        if(this.state.openAddUserModal){
          this.setState({openAddUserModal:false})
          this.props.refreshTable()
        }
        console.log('I am in sucess'+ JSON.stringify(responce))
      }
     )
    .catch((error) => console.log("Error in Adding Updating User" + error))  
  }

  sendDataToAddUser(){
    console.log('Clicked')
    if(this.state.openAddUserModal){
      this.setState({openAddUserModal:false})
    }
    
    addNewUser(this.state.firstName, this.state.lastName, this.state.email,this.state.cusID)
    .then((responce) =>  {
        this.props.refreshTable()
        console.log('I am in sucess'+ JSON.stringify(responce))
      }
     )
    .catch((error) => console.log("Error in Adding New User" + error))    
  }

  render(){
    return(
      <div style={{display:'flex'}}>
          <div onClick={this.handleAddUser.bind(this)}>Add user</div>
          {this.props.userList.length == 1 ? <div style={{display:'flex'}}><span>&nbsp;|&nbsp;</span><div onClick={this.handleEditUser.bind(this)}>Edit</div></div> :''}
        <span>
        <Modal
          show={this.state.openAddUserModal}
          onHide={this.close}
          backdrop='static'>
          <form style={{border: '1px solid Navy'}}>
            <div style={{marginTop:'10px',paddingLeft:'15px', minHeight:300, width:500}}>
              <Modal.Header  style={{marginRight:15,borderBottom:0}}>
                <a href="" className='closebtn' onClick={this.close.bind(this)} show={true} onHide={this.close} backdrop='static'>
                  &#x2715;
                </a>
                <Modal.Title id="contained-modal-title" style={{fontSize: 20, fontWeight:'bold', color: '#454855'}}>
                  {this.props.userList.length == 1 ? 'EDIT USER':'ADD NEW USER' }
                </Modal.Title>
              </Modal.Header>
              <Modal.Body style={{padding:'0 15px 15px'}}>
              <Form>
                <div className='addUserInputs'>
                  <div className='addUserins'><p>First Name</p><input type="text" value={this.state.firstName} onChange={e => this.setState({ firstName: e.target.value })} placeholder='First Name' /></div>
                  <div className='addUserins'><p>Last Name</p><input type="text" value={this.state.lastName} onChange={e => this.setState({ lastName: e.target.value })} placeholder='Last Name'/></div>
                  <div className='addUserins'><p>Email</p><input type="email" value={this.state.email} onChange={e => this.setState({ email: e.target.value })} placeholder='mail@email.com' disabled={this.state.disabledMail}/></div>
                  <div className='addUserins'><p></p>{this.state.showError ? <p style={{color:'red'}}>This mail Id is already exists</p> : ''}</div>
                  {/*<div className='addUserins'><p>User Name : </p><input type="text" value={this.state.userName} onChange={e => this.setState({ userName: e.target.value })} placeholder='User Name' /></div>
                  <div className='addUserins'><p>Passwrod : </p><input type="password" value={this.state.passwrod} onChange={e => this.setState({ passwrod: e.target.value })} placeholder='Password' /></div>*/}
                  <div className='modalButtons'>
                    <div><Button className='modalButton' onClick={this.close.bind(this)} style={{color:'#4d59a4', backgroundColor:'#f6f4f4'}}>Cancel </Button></div>
                    {this.props.userList.length == 1 ?
                    <div><Button className='modalButtonSucess' onClick={this.updateButtonClicked.bind(this)}>Update</Button></div>
                    :
                    <div><Button className='modalButtonSucess' onClick={this.handleAdd.bind(this)} disabled={this.state.addDisable}>Add </Button></div>
                    }
                  </div>
                </div>
              </Form>
              </Modal.Body>
            </div>
          </form>
        </Modal>
        </span>
      </div>
    )
  }
}
