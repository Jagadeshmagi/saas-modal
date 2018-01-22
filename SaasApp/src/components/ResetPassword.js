import React, { PropTypes } from 'react'
// import {blueBtn, btnPrimary, modalDialogClassDash} from 'sharedStyles/styles.css'
import {Col, Row, Grid, Button, Modal, ControlLabel, FormGroup, Popover, OverlayTrigger, FormControl} from 'react-bootstrap'
// import {modalCloseStyle, userModal, modalContainer} from './styles.css'
import {resetPassword} from '../helpers/login'
import {serviceagreementaccepted} from './../helpers/admin'
import Joi from 'joi-browser'
import {auth, loginPulsar} from '../helpers/login'

const ResetPassword = React.createClass({
  getInitialState(){
    let show = this.props.show === true?this.props.show:false
    return{
      buttonText:"Save",
      showEULA:false,
      acceptedEULA:true,
      showUser:false,
      disable:true,

      pwOld:"",
      pwNew1:"",
      pwNew2:"",

      pwOld_error:"Please enter your current password ",
      pwNew1_error:"Please enter a new password ",
      pwNew2_error:"Please reenter the new password",

      pwOldValid:false,
      pwNew1Valid:false,
      pwNew2Valid:false,

      pwOld_validation:"",
      pwNew1_validation:"",
      pwNew2_validation:"",

      tooltippwOld:"",
      tooltippwNew1:"",
      tooltippwNew2:"",

      bordercolpwOld:"thin solid #4C58A4",
      bordercolpwNew1:"thin solid #4C58A4",
      bordercolpwNew2:"thin solid #4C58A4",
      }
  },
  // componentDidMount(){
  //   if (this.props.login){
  //     this.setState({showUser:true})
  //   }
  // },
  componentWillReceiveProps(nextProps){
    // console.log("nextPropsnextPropsnextProps", nextProps)
    if (nextProps.show != this.props.show){
      this.setState({
        showUser: nextProps.show,
        //showEULA: nextProps.showEULA,
        // acceptedEULA: !nextProps.showEULA
      })
    }

    if (nextProps.showEULA != this.props.showEULA){
      this.setState({
        showEULA: nextProps.showEULA,
        acceptedEULA: !nextProps.showEULA
      })      
    }

  },

  openUserModal(){
    this.setState({showUser:true})
  },

  closeUser() {
    this.setState({
      showUser:false,
      disable:true,

      pwOld:"",
      pwNew1:"",
      pwNew2:"",

      pwOld_error:"Please enter your current password ",
      pwNew1_error:"Please enter a new password ",
      pwNew2_error:"Please reenter the new password",

      pwOldValid:false,
      pwNew1Valid:false,
      pwNew2Valid:false,

      pwOld_validation:"",
      pwNew1_validation:"",
      pwNew2_validation:"",

      tooltippwOld:"",
      tooltippwNew1:"",
      tooltippwNew2:"",

      bordercolpwOld:"thin solid #4C58A4",
      bordercolpwNew1:"thin solid #4C58A4",
      bordercolpwNew2:"thin solid #4C58A4",
    });

    // if(this.props.login){
    //   this.props.resetComplete()
    // }
  },

  handleOld(e){
    this.setState({
      pwOld:e.target.value
    })
  },
  handleNew1(e){
    this.setState({
      pwNew1:e.target.value
    }, ()=>{
      if(this.state.pwNew2.length>1){
        this.checkPWMatch()
      }
    })
  },
  handleNew2(e){
    this.setState({
      pwNew2:e.target.value
    }, ()=>{this.checkPWMatch()})
  },

  handleOldBlur(){
    // awesome logix =D to make awesome pw
    // pwOld
    let pwOld_schema = {
        "Current Password": Joi.string().min(5).max(32).required(),
    };
    let result = Joi.validate({"Current Password": this.state.pwOld}, pwOld_schema)
    if (result.error) {
      // console.log("pwOldresult.error", result.error)
        this.refs.pwOld.show();
        this.setState({pwOld_error : result.error.details[0].message, pwOld_validation: 'error'})
        this.state.pwOldValid=false;
        this.state.bordercolpwOld='thin solid #FF444D';
        this.state.labeltoolheight=55;
        this.setState({tooltippwOld:"hover"});
    } else {
        this.refs.pwOld.hide();
        this.setState({tooltippwOld:false});
        this.setState({pwOld_error: '', pwOld_validation : 'success'})
        this.state.pwOldValid=true;
        this.state.bordercolpwOld='thin solid #00C484';
    }
  },
  handleNew1Blur(){
    if(this.state.pwNew1){
      this.checkpwNew1();
    }
  },

  checkpwNew1(){
    //   var pattern = new RegExp(/^([a-zA-Z0-9_-]){12,51}$/);
    //   var pattern = new RegExp(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d][A-Za-z\d!@#$%^&*()_+]{11,31}$/);
  var pattern = new RegExp(/^[a-zA-Z0-9~@$*()_!=[\]/,.?:; -]{11,31}$/);
  var result = pattern.test(this.state.pwNew1)
  // console.log(result, "this is the result")
  if (result){
    // this.setState({
    //   pwNew1Valid:true
    // })
    this.refs.pwNew1.hide();
    this.setState({tooltippwNew1:false});
    this.setState({pwNew1_error: '', pwNew1_validation : 'success'})
    this.state.pwNew1Valid=true;
    this.state.bordercolpwNew1='thin solid #00C484';
  } else {
    this.refs.pwNew1.show();
    this.setState({
      pwNew1_error : `New Password must be at least 12 characters long and cannot contain the following: # % ^ + { } | \ ' " > < \``,
      pwNew1_validation: 'error'})
    this.state.pwNew1Valid=false;
    this.state.bordercolpwNew1='thin solid #FF444D';
    this.state.labeltoolheight=55;
    this.setState({tooltippwNew1:"hover"});
  }
},

//   checkpwNew1(){
// // ~@$*()-_=![]:;?/,.
//     //  ~ @ # $ ^ & * ( ) - _ + = [ ] { } | \ , . ? : # % ^ + { } | \ ' " > < `
//   // var pattern = new RegExp(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d][A-Za-z\d!@#$%^&*()_+]{11,31}$/);
//   // var pattern = new RegExp(/^[a-zA-Z0-9]*$/);
//   var pattern = new RegExp(/^([a-zA-Z0-9_-]){12,51}$/);
//   var result = pattern.test(this.state.pwNew1)
//   if (result){
//     // this.setState({
//     //   pwNew1Valid:true
//     // })
//     this.refs.pwNew1.hide();
//     this.setState({tooltippwNew1:false});
//     this.setState({pwNew1_error: '', pwNew1_validation : 'success'})
//     this.state.pwNew1Valid=true;
//     this.state.bordercolpwNew1='thin solid #00C484';
//   } else {
//     this.refs.pwNew1.show();
//     this.setState({
//       pwNew1_error : `New Password must be alphanumeric and must contain at least 12 characters.`,
//       pwNew1_validation: 'error'})
//     this.state.pwNew1Valid=false;
//     this.state.bordercolpwNew1='thin solid #FF444D';
//     this.state.labeltoolheight=55;
//     this.setState({tooltippwNew1:"hover"});
//   }
// },

  checkPWMatch(){
    // console.log("golden =)", this.state.pwNew1, this.state.pwNew2, this.state.pwNew1Valid, this.state.pwOldValid)
    if(this.state.pwNew1 && this.state.pwNew2 && this.state.pwNew1Valid && this.state.pwOldValid){
      // console.log("golden =)")
      if(this.state.pwNew1 === this.state.pwNew2){
        // console.log("golden =)")
        this.setState({
          disable:false
        })
        this.refs.pwNew2.hide();
        this.setState({tooltippwNew2:false});
        this.setState({pwNew2_error: '', pwNew2_validation : 'success'})
        this.state.pwNew2valid=true;
        this.state.bordercolpwNew2='thin solid #00C484';
      } else {
        this.refs.pwNew2.show();
        this.setState({pwNew2_error : "New Password must match", pwNew2_validation: 'error'})
        this.state.pwNew2valid=false;
        this.state.bordercolpwNew2='thin solid #FF444D';
        this.state.labeltoolheight=55;
        this.setState({tooltippwNew2:"hover"});
        this.setState({
          disable:true
        })
      }
    }
  },

  agreeEULA(){
    let customerId = localStorage.getItem('customerId');
    serviceagreementaccepted(customerId)
    .then((res)=>{
      let passwordPayload = {
        email:this.props.emailId,
        currentPassword:this.state.pwOld,
        updatedPassword:this.state.pwNew1
      };
      this.props.loginCall(passwordPayload.email,passwordPayload.updatedPassword)
      this.closeUser();
    })
    .catch((error)=>{
      console.log("serviceagreementaccepted error ", error)
    })
  },

  updatePW(){
    // if(this.props.login){
    //   this.props.checkFirstLogin();
    // }
    // let userId = localStorage.getItem('userID');
    // {
    //   "email":email,
    //     "currentPassword":oldPW,
    //     "updatedPassword":newPW
    // }
    let passwordPayload = {
      email:this.props.emailId,
      currentPassword:this.state.pwOld,
      updatedPassword:this.state.pwNew1
    };
    this.setState({
      buttonText:"Saving..."
    })
    console.log("passwordPayloadpasswordPayloadpasswordPayload", passwordPayload)
    resetPassword(passwordPayload)
      .then((response)=>{
        this.setState({
          buttonText:"Save"
        })
        console.log("PW reset success ", response)
        // this.closeUser();
        // this.context.router.replace('/app/admin')
        // this.props.loginCall(this.props.emailId,passwordPayload.updatePassword)
        // this.closeUser();

        // if(this.props.login){
        //   this.props.checkFirstLogin(passwordPayload.updatePassword);
        //   // dispatch(authUser(user.uid))
        //
        // }
        if (response.message === "Username or Password wrong"){
          errorMessage = "Provided password doesnt match password in database."
          this.setState({pwOld_error : errorMessage, pwOld_validation: 'error'}, ()=>{
            this.refs.pwOld.show();
          })
          this.state.pwOldValid=false;
          this.state.bordercolpwOld='thin solid #FF444D';
          this.state.labeltoolheight=55;
          this.setState({tooltippwOld:"hover"});
        } else {
          console.log("dsfasdfasdfafsadfasdf", passwordPayload, passwordPayload.email,passwordPayload.updatedPassword, response, response.data.dataServiceAgreement)
          // if (response.data.dataServiceAgreement== "true"){
            // if (response.data && response.data.userData){
            //   this.props.loginCall(passwordPayload.email,passwordPayload.updatedPassword, response.data.userData)
            // } else {
            //   this.props.loginCall(passwordPayload.email,passwordPayload.updatedPassword)
            // }
              this.agreeEULA();
              this.props.loginCall(passwordPayload.email,passwordPayload.updatedPassword)
            this.closeUser();
          // }
          // else {
          //   this.setState({
          //     showEULA:true
          //   })
          // }
        }

      })
      .catch((error)=>{
        // alert("Invalid. Try again")
        let errorMessage = "";
        if (error){
          // console.log("errorerror", error, error.data)
        if (error.message === "New Password Same as Previous Password"){
            errorMessage = "New Password should be different from old password."
            this.setState({pwNew1_error : errorMessage, pwNew1_error_validation: 'error'}, ()=>{
              this.refs.pwNew1.show();
            })
            this.state.pwNew1Valid=false;
            this.state.bordercolpwNew1='thin solid #FF444D';
            this.state.labeltoolheight=55;
            this.setState({tooltippwNew1:"hover"});
          }
        } else {
          errorMessage = "Error in resetting password."
          this.setState({pwOld_error : errorMessage, pwOld_validation: 'error'}, ()=>{
            this.refs.pwOld.show();
          })
          this.state.pwOldValid=false;
          this.state.bordercolpwOld='thin solid #FF444D';
          this.state.labeltoolheight=55;
          this.setState({tooltippwOld:"hover"});
        }

        // this.setState({pwOld_error : errorMessage, pwOld_validation: 'error'})
        // this.state.pwOldValid=false;
        // this.state.bordercolpwOld='thin solid #FF444D';
        // this.state.labeltoolheight=55;
        // this.setState({tooltippwOld:"hover"});
      })
  },

  setEula(){
    this.setState({
      acceptedEULA: !this.state.acceptedEULA
    })
  },

  render() {

    const tooltippwOld = (
      <Popover style={{height:"auto", minHeight:"7%", color: 'black',borderWidth: 2,borderRadius:0,width:200}}>{this.state.pwOld_error}</Popover>
    );
    const tooltippwNew1 = (
      <Popover style={{height:"auto", minHeight:"7%", color: 'black',borderWidth: 2,borderRadius:0,width:200}}>{this.state.pwNew1_error}</Popover>
    );
    const tooltippwNew2 = (
      <Popover style={{height:"auto", minHeight:"7%", color: 'black',borderWidth: 2,borderRadius:0,width:200}}>{this.state.pwNew2_error}</Popover>
    );

    let list = this.state.sList;
    // console.log("listlistlist", list, this.state.Number)
    let overLayStyle= {color: 'grey',borderWidth: 2,
                        borderRadius:0,width:220,height:120,paddingLeft:5,paddingBottom:0,paddingRight:0,paddingTop:10}
    let posstyle = {  position: 'relative', top:40, left: 0,
      width: '200px',
      float: 'left',
      textAlign:"center",
      marginLeft: '70' }

    let eula = (<span></span>)
    if (this.props.showEULA){
      eula = (
        <Col style={{marginTop:"50"}}>
          <input type='Checkbox' className='inputStyle' id="help" value="helpLabel" name="helpLabel" checked={this.state.acceptedEULA} onChange={this.setEula.bind(this)}/>
          <label className="checkboxStyle" style={{fontWeight:'500'}} htmlFor="help" title="helpLabel">
            &nbsp;&nbsp;I have read and accept the <a target="_blank" href="https://cavirin.com/cloud/service-agreement/">Terms of Service</a> and <a target="_blank" href="https://cavirin.com/cloud/privacy-policy/">Privacy Policy</a>.
          </label>
        </Col>
      )
    }

    let disable = this.state.disable || !this.state.acceptedEULA? true:false
    // if (this.state.showEULA){
    //   return (
    //     <span className='modalContainer'>
    //           {this.props.login?"":<Button href='JavaScript: void(0)' onClick={this.openUserModal}
    //             bsStyle='primary' bsSize='large' className='btnPrimary'
    //             style={{borderRadius: 0, marginTop: 60,marginBottom: 20,width:'300px', marginLeft:"60", marginBottom:"30"}}>
    //               Service Agreement
    //           </Button>}
    //       <Modal
    //         show={this.state.showUser}
    //                onHide={this.closeUser}
    //               //  dialogClassName={userModal}
    //                backdrop='static'
    //                keyboard={false}
    //                style={{width:'900'}}
    //
    //         aria-labelledby="contained-modal-title"
    //         dialogClassName='modalDialogClassDash'
    //         backdrop='static' >
    //         <form style={{border: '1px solid Navy'}}>
    //           <div style={{marginTop:'25px',paddingLeft:'15px'}}>
    //           <Modal.Header  style={{marginLeft:15,marginRight:25,borderBottom:0}}>
    //             <Modal.Title id="contained-modal-title" style={{fontSize: 22, fontWeight:'bold', color: '#454855'}}>{'Service Agreement'}</Modal.Title>
    //           </Modal.Header>
    //           <Modal.Body style={{width:'500'}}>
    //             <div style={{marginLeft:20}}>
    //               &nbsp;<a href="https://cavirin.com/cloud/service-agreement/" target="_blank">Terms of Service</a>
    //             </div>
    //             {/*<div style={{textAlign: "center"}}>
    //               <Button href='JavaScript: void(0)' onClick={this.agreeEULA}
    //                 bsStyle='primary' bsSize='large' className='btnPrimary'
    //                 style={{borderRadius: 0, marginTop: 60,marginBottom: 20,width:'300px', marginLeft:"60", marginBottom:"30"}}>
    //                   I have read and accept the terms of service.
    //               </Button>
    //             </div>*/}
    //           </Modal.Body>
    //           <Modal.Footer style={{marginRight:30,marginBottom:15,borderTop:0}}>
    //             {this.props.login?"":<span><Button className='blueBtn' onClick={this.closeUser}>Cancel</Button>&nbsp;&nbsp;&nbsp;</span>}
    //             <Button bsStyle='primary' className='btnPrimary' onClick={this.agreeEULA}
    //               style={{borderRadius: 0}}>
    //               I have read and accept the terms of service.
    //             </Button>
    //           </Modal.Footer>
    //          </div>
    //         </form>
    //        </Modal>
    //      </span>
    //   )
    // } else {
      return (
        <span className='modalContainer'>
              {this.props.login?"":<Button href='JavaScript: void(0)' onClick={this.openUserModal}
                bsStyle='primary' bsSize='large' className='btnPrimary'
                style={{borderRadius: 0, marginTop: 60,marginBottom: 20,width:'300px', marginLeft:"60", marginBottom:"30"}}>
                  Change Password
              </Button>}
          <Modal
            show={this.state.showUser}
                   onHide={this.closeUser}
                  //  dialogClassName={userModal}
                   backdrop='static'
                   keyboard={false}
                   style={{width:'900'}}

            aria-labelledby="contained-modal-title"
            dialogClassName='modalDialogClassDash'
            backdrop='static' >
            <form style={{border: '1px solid Navy'}}>
              <div style={{marginTop:'25px',paddingLeft:'15px'}}>
              <Modal.Header  style={{marginLeft:15,marginRight:25,borderBottom:0}}>
                <a style={{textDecoration:'none'}} href="javascript:void(0)" className='modalCloseStyle' style={{fontSize:27, top:12, right:26, transform: 'scale(1.3,0.9)'}} onClick={this.closeUser}>X</a>
                <Modal.Title id="contained-modal-title" style={{fontSize: 22, fontWeight:'bold', color: '#454855'}}>{'Reset Password'}</Modal.Title>
              </Modal.Header>
              <Modal.Body style={{width:'500'}}>
                <FormGroup controlId="formpwOld" validationState={this.state.pwOld_validation}>
                  <Col xs={12}><ControlLabel style={{fontSize:'15px',fontWeight:'500'}}>Current Password</ControlLabel></Col>
                    <OverlayTrigger ref="pwOld" trigger={this.state.tooltippwOld} placement="right" overlay={tooltippwOld}>
                      <FormControl style={{width:400,height:40,marginLeft:15,padding:'12px',borderRadius:0,border:this.state.bordercolpwOld}}
                        type="password" name="groupname" placeholder="Enter Current Password"
                        onBlur={this.handleOldBlur}
                        onChange={this.handleOld}/>
                      </OverlayTrigger>
                    </FormGroup>
                <FormGroup controlId="formpwNew1" validationState={this.state.pwNew1_validation}>
                  <Col xs={12}><ControlLabel style={{fontSize:'15px',fontWeight:'500'}}>New Password</ControlLabel></Col>
                    <OverlayTrigger ref="pwNew1" trigger={this.state.tooltippwNew1} placement="right" overlay={tooltippwNew1}>
                      <FormControl style={{width:400,height:40,marginLeft:15,padding:'12px',borderRadius:0,border:this.state.bordercolpwNew1}}
                        type="password" name="groupname" placeholder="Enter New Password"
                        onBlur={this.handleNew1Blur}
                        onChange={this.handleNew1}/>
                      </OverlayTrigger>
                    </FormGroup>
                <FormGroup controlId="formpwNew2" validationState={this.state.pwNew2_validation}>
                  <Col xs={12}><ControlLabel style={{fontSize:'15px',fontWeight:'500'}}>Re-Enter Password</ControlLabel></Col>
                    <OverlayTrigger ref="pwNew2" trigger={this.state.tooltippwNew2} placement="right" overlay={tooltippwNew2}>
                      <FormControl style={{width:400,height:40,marginLeft:15,padding:'12px',borderRadius:0,border:this.state.bordercolpwNew2}}
                        type="password" name="groupname" placeholder="Re-Enter Password"
                        onChange={this.handleNew2}/>
                      </OverlayTrigger>
                    </FormGroup>
                {eula}
              </Modal.Body>
              <Modal.Footer style={{marginRight:30,marginBottom:15,borderTop:0}}>
                {this.props.login?"":<span><Button className='blueBtn' onClick={this.closeUser}>Cancel</Button>&nbsp;&nbsp;&nbsp;</span>}
                <Button bsStyle='primary' className='btnPrimary' onClick={this.updatePW}
                  disabled={disable || this.state.buttonText === "Saving..."?true: false}
                  style={{borderRadius: 0}}>
                  {this.state.buttonText}
                </Button>
              </Modal.Footer>
             </div>
            </form>
           </Modal>
         </span>
          )
        // }
      },
    }
  )

export default ResetPassword
