import React, { PropTypes } from 'react'
import CavirinIcon from './common/CavirinIcon'
import { Button, Col, FormControl, FormGroup, ControlLabel, HelpBlock,Glyphicon, Row} from 'react-bootstrap'
import Joi from 'joi-browser';
import {auth, loginPulsar} from '../helpers/login'
import {getCustomerInfo, getEula} from '../helpers/admin'
import ResetPassword from './ResetPassword'

export default class Login extends React.Component {

  constructor(props) {

    super(props);

    this.state = {
      showEULA: false,
      emailId: '',
      password: '',
      emailId_validation: 'success',
      password_validation: 'success',
      emailId_error: '',
      password_error: '',
      isFetching: false,
      error: '',
      showResetPassword:false
    };

    this.handleChange = this.handleChange.bind(this);
    this.validateUser = this.validateUser.bind(this);
    this.validatePassword = this.validatePassword.bind(this);
    this.login = this.login.bind(this);
    this.keyPress = this.keyPress.bind(this);
  }

  handleChange(e) {
    this.setState({[e.target.name]: e.target.value})
  }

  validateUser(emailId) {
    let user_schema = {
      emailId: Joi.string().required(),
    };
    let result = Joi.validate({emailId: this.state.emailId}, user_schema)
    if (result.error) {
      this.setState({emailId_error : result.error.details[0].message, emailId_validation: 'error'})
      return false
    } else {
      this.setState({emailId_error: '', emailId_validation : 'success'})
      return true
    }
  }

  validatePassword(password) {
    let password_schema = {
      password: Joi.string().required(),
    }
    let password_result = Joi.validate({password: this.state.password}, password_schema)
    if (password_result.error) {
      this.setState({password_error: password_result.error.details[0].message, password_validation: 'error'})
      return false
    } else {
      this.setState({password_error: '', password_validation: 'success'})
      return true
    }
  }

  callLoginPulsar(emailId, password, pulsarIP){
    console.log("callLoginPulsaris called", emailId, password, pulsarIP)
      // // validate user name
      // let isValidUsername = this.validateUser(this.state.username)
      //
      // //validate password
      // let isValidPassword = this.validatePassword(this.state.password)
      //
      // // procceed only if no error
      // if (!(isValidUsername && isValidPassword))
      //   return false;

      let uiContext = {}
      // loginPulsar
      loginPulsar(emailId, password, pulsarIP)
      .then((res) => {
        // console.log("ljksjklsfjlkdsjklsdljkds", res)
        // if(this.props.error === ''){
        // // get state
        // getUIContext(this.state.username)
        // .then((result) => {
        //   if(result.output != null){
        //     uiContext = JSON.parse(result.output);
        //     console.log("redis fetch result:"+JSON.stringify(uiContext))
        //
        //     //uiContext = UIContextConstants.EMPTY_STATE_CONTEXT
        //     this.props.fetchUserContext(uiContext.welcomeSeen,
        //       uiContext.dashboardSetup,
        //       uiContext.discoverySetup,
        //       uiContext.policySetup)
        //
        //     // show welcomeScreen or dashboardstart or dashbord depending on the values
        //     if (uiContext.welcomeSeen == true) {
        //       console.log("uiContext.welcomeSeen == true");
        //       if (uiContext.dashboardSetup == true) {
        //         this.context.router.replace('dashboard')
        //       } else {
        //         getReportsExists()
        //         .then((reportsExist) => {
        //           if(reportsExist){
        //             console.log("set uiContext.dashboardSetup == true");
        //             this.props.setDashboardSetup();
        //             this.saveContext(true,true,true,true);
        //             this.context.router.replace('dashboard');
        //           }else{
        //             this.context.router.replace('startdashboard')
        //           }
        //         })
        //         .catch((error) => console.log("Error in getting Reports status:"+error))
        //       }
        //
        //     } else {
        //       console.log("uiContext.welcomeSeen == false");
        //       this.props.setWelcomeSeen();
        //       this.saveContext(true,false,false,false);
        //       this.context.router.replace('welcomeScreen');
        //     }
        //   }//end if(result.output != null)
        //   else{
        //     //User login first time, save user in context
        //     console.log("User logged in first time");
        //     this.saveContext(true,false,false,false);
        //     this.context.router.replace('welcomeScreen');
        //   }
        // })
        // .catch(function (response) {
        //   console.log("getUIContext reject in AuthenticateContainer :"+JSON.stringify(response));
        //   this.context.router.replace('welcomeScreen')
        //   //Promise.reject(response);
        // }.bind(this))
        //
        // }else{
        //   this.setState({password_validation:'error'})
        // }  //this.context.router.replace('welcomeScreen')
      }).catch(function (response) {
        console.log('fetch user was not successful', response)
      })
  }

  getIP(customerId){
    console.log("getIPgetIP")
    getCustomerInfo(customerId)
     .then((res) => {
       console.log("getIPgetIP", res)
       // if (res.data){
       //   let pulsarIP = res.data.ipaddress
       //   this.callLoginPulsar(this.state.emailId,this.state.password, pulsarIP)
       // } else {
         console.log("getIPgetIP111", res)
          this.callLoginPulsar(this.state.emailId, this.state.password, res.data.ipaddress)
       // }
       // let pulsarIP = customerInfo.ipaddress
       //  // this.callLoginPulsar(this.state.emailId,this.state.password, pulsarIP)

     }).catch((e) => {
       console.log("Error in getting the Company Info:"+JSON.stringify(e))
     })
  }

  checkEula(id){
    let bool = false;
    getEula(id)
    .then((res)=>{
      console.log("checkEula res, ", res, res.data, res.data[0].serviceagreementaccepted)
      if (res.data[0].serviceagreementaccepted === "true"){
        bool = true;
      }
      this.setState({
        showEULA: !bool
      }, ()=>{console.log("checkEula res, ", this.state.showEULA)})
    })
    .catch((error)=>{
      console.log("checkEula error, ", error)
    })
    return bool;
  }

  login(email, password, userData) {
    // validate email
    let isValidEmailId = this.validateUser(this.state.emailId)

    //validate password
    let isValidPassword = this.validatePassword(this.state.password)

    // procceed only if no error
    if (!(isValidEmailId && isValidPassword))
      return false;

    let passwordToUse = typeof password ==="string"?password:this.state.password
    let emailToUse = typeof email ==="string"?email:this.state.emailId


    auth(emailToUse, passwordToUse)
    .then(res => {
      // console.log("response.data.userDataresponse.data.userData", res, res.data, res.data.pulsarUserdata, res.data.data.pulsarUserdata)
      if(res.status == 200 && res.data.status === 'success'){
        localStorage.setItem("helpToggle", res.data.data.showhelpscreen);
        localStorage.setItem('customerId',res.data.data.customerid);

        if(res.data.data.role != null && res.data.data.role === 'Systemadmin'){
          console.log("1111111111")
          sessionStorage.setItem('role',res.data.data.role);
          this.setState({error: ''})
            this.context.router.replace('/app/sysadmin')
        }else{
          let route = '/app/admin'
          if (res.data.data.showhelpscreen == "true"){
            route = '/app/admin/help'
          } else {
            route = '/app/admin/service'
          }
          this.checkEula(res.data.data.customerid);
          console.log("res.data.data.showhelpscreen", route, res.data.data.showhelpscreen)
          console.log("2222222222", res, res.data.data.resetpassword)
          if (res.data.data.resetpassword === "true"){
            console.log("3333333333")
            this.setState({
              showResetPassword:true
            })
          } else {
            console.log("4444444444")
            console.log("nopreset login")
            // localStorage.setItem('customerId',res.data.data.customerid);
            localStorage.setItem('userId',res.data.data.id);
            this.setState({error: ''})
            // this.context.router.push('/test');
            this.context.router.replace(route)
            // this.getCustomerType(res.data.data.customerid);
            // if (userData){
            //   console.log("userDatauserData", userData)
              // localStorage.setItem('response', userData);
            // } else {
              // console.log("called login called login ")
              // this.getIP(res.data.data.customerid);
            // }
            // localStorage.setItem('response',JSON.stringify(res.data.pulsarUserdata));
          }
       }
      }else{
        this.setState({error: 'Username and/or Password are incorrect'})
      }
    }).catch((e) => {
      console.log("Error in getting the login data:    "+JSON.stringify(e))
    })

  }

  keyPress(e){
    if (e.key === 'Enter') {
      this.login();
    }
  }

  render() {
    let style = {display: 'block', margin: 'auto', paddingBottom: 15}
    return (
      <div className="loginWrapper">
        <div className="navbar navbar-default" style={{"background-color": "rgb(76, 88, 164)","width":"100%","height":"220px", "margin-bottom": "inherit"}}>
          <div className="container" >
          <div style={{ width:'15%',textAlign:'center',"padding-top": "10px","padding-bottom": "10px", margin:'0 auto'}}>
            <CavirinIcon color='#FFFFFF'/>
          </div>
          </div>
        </div>
        <ResetPassword
          login={true}
          emailId={this.state.emailId}
          loginCall={this.login}
          showEULA={this.state.showEULA}
          show={this.state.showResetPassword}
          />
        <div className='row' style={{"background": "white","width":"100%", minHeight:300, paddingTop:20}}>
          <div className='col-lg-4'></div>
          <div className='col-lg-4'>
            <FormGroup controlId="formBasicText"  validationState={this.state.emailId_validation} >
              <ControlLabel style={{fontSize:'15px',fontWeight:500}}>Email Id</ControlLabel>
              <FormControl
                type="text"
                name="emailId"
                value={this.state.emailId}
                placeholder="Username"
                onChange={this.handleChange}
                onBlur={this.validateUser}
                onKeyPress={this.keyPress}
                style={{borderRadius:0}}
              />
              <HelpBlock>{this.state.emailId_error}</HelpBlock>
            </FormGroup>

            <FormGroup controlId="formPassword" validationState={this.state.password_validation} >
              <ControlLabel style={{fontSize:'15px',fontWeight:500}}>Password</ControlLabel>
              <FormControl
                type="password"
                name="password"
                value={this.state.password}
                placeholder="Password"
                onChange={this.handleChange}
                onBlur={this.validatePassword}
                onKeyPress={this.keyPress}
                style={{borderRadius:0}}
              />
              <HelpBlock>{this.state.password_error}</HelpBlock>
            </FormGroup>

            <FormGroup style={{fontSize:'15px',fontWeight:500}} controlId="loginError" validationState="error">
              <HelpBlock>
                {
                  <div>
                    {this.state.error}
                  </div>
                }
              </HelpBlock>
            </FormGroup>
          </div>
        </div>

        <div>
          <footer className="footer" style={{"background-color": "rgb(76, 88, 164)"}}>
            <div className="container" style={{"width":"100%"}}>

            <div style={{"margin": "0px", "padding-top": "30px"}}>
            <div style={{"align": "center"}}>

            <Button bsStyle='primary' bsSize='large' style={{borderRadius: 0,backgroundColor: '#FFFFFF',color: '#4C58A4',fontWeight: 'bold'}} onClick={this.login} >
              Sign In
            </Button>
            </div>
            </div>
            <p style={{padding:'23px 30px', color: 'white',backgroundColor:'#4C58A4', marginBottom:0, textAlign: 'left'}}>&copy; Cavirin Systems Inc. 2018<br/>
            <a target='_blank' href='https://www.Cavirin.com' style={{color: 'white'}}> About Cavirin</a> | <a href="mailto:cloud@cavirin.com" style={{color: 'white'}}>Contact us</a> </p>
            </div>
          </footer>
        </div>
      </div>
    )
  }
}

Login.contextTypes = {
    router: PropTypes.object.isRequired,
}
