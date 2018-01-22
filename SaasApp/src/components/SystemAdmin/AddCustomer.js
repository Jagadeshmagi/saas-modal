import React from 'react';
import {Button, Modal, Form, Popover, OverlayTrigger} from 'react-bootstrap'
import {validateEmail} from '../../helpers/users'
import {addNewCustomer} from '../../helpers/provision'

export default class AddCustomer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openAddUserModal:false,
      companyName:'',
      email:'',
      continueDisable:true,
      firstName:'',
      lastName:'',
      address1:'',
      city:'',
      zip:'',
      country:'',
      state:'',
      formErrors: {companyName:'',firstName:'',lastName:'',email: '',salesforceCustomerId:'',oppertunityId:''},
      emailValid: false,
      expiryDays:14,
      expiryDaysPaid:365,
      subscriptionType:'Trial',
      salesforceCustomerId:'',
      oppertunityId:'',

      tooltipCompanyName: 'Type your Company Name',
      tooltipSalesforce:'Provide Salesforce Customer ID',
      tooltipOppertunityId:'Provide Opportunity Id',
      tooltipDaysInt:'Subscription starts from today'
    }
  }

  componentDidMount(){
    this.setState({userId:localStorage.getItem('userId')})
    this.twitterFeed()
  }

  twitterFeed(){
    !function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+"://platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs");
  }

  componentWillReceiveProps(nextProps,nextState){

  }

  close(e){
    e.preventDefault();
    if(this.state.openAddUserModal){
    console.log('coming', this.state.firstName)
      this.setState({
        openAddUserModal:false,
        companyName:'',
        name:'',
        firstName:'',
        lastName:'',
        address1:'',
        city:'',
        zip:'',
        country:'',
        state:'',
        email:'',
        phone:'',
        subscriptionType:'Trial',
        expiryDays:14,
        expiryDaysPaid:365,
        provisionSucess:false,
        salesforceCustomerId:null,
        oppertunityId:null,
        eulaAccepted:false
      }, function(){
    console.log('coming after', this.state.firstName)

      })
    }
  }

  handleAddCustomer(){
    let contactObj = {};
    contactObj.companyname = this.state.companyName
    contactObj.first_name = this.state.firstName
    contactObj.last_name = this.state.lastName
    contactObj.name = this.state.firstName + ' ' + this.state.lastName
    contactObj.addr1 = this.state.address1
    contactObj.addr2 = ''
    contactObj.city = this.state.city
    contactObj.state = this.state.state
    contactObj.country = this.state.country
    contactObj.zip = this.state.zip
    contactObj.phone = this.state.phone
    contactObj.email = this.state.email
    contactObj.subtype = this.state.subscriptionType
    contactObj.serviceagreementaccepted = this.state.eulaAccepted ? "true" : "false"
    contactObj.expirydays = this.state.subscriptionType ==='Trial' ? parseInt(this.state.expiryDays) : parseInt(this.state.expiryDaysPaid)
    contactObj.plan = "Cavirin core"
    contactObj.salesforcecustomerid = this.state.salesforceCustomerId
    contactObj.oppertunityid = this.state.oppertunityId

    console.log('Clicked', contactObj)

    // this.props.refreshTable()

    addNewCustomer(contactObj)
    .then((responce) =>  {
        console.log('I am in sucess'+ responce)
        // this.props.handleShowDetails
        this.props.handleClose()
        this.props.refreshTable()
        this.setState({provisionSucess:true})
      }
     )
    .catch((error) => console.log("Error in Adding New Customer" + error))
  }

  handleEmailChange(event){
    this.handleUserInput(event)
  }

  handleUserInput (e) {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({[name]: value},
      () => {
        this.validateField(name, value)
      }
    );
  }

  validateField(fieldName, value) {
    let fieldValidationErrors = this.state.formErrors;
    let emailValid = this.state.emailValid;

    if(fieldName == 'email'){
      emailValid = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
      fieldValidationErrors.email = emailValid ? '' : 'Email is invalid';
      if(emailValid){
        this.validateEmail()
      }
    }else if (fieldName == 'firstName'){
      let firstNameValid = value.match(/^[A-z]+$/)
      fieldValidationErrors.firstName = firstNameValid ? '' : 'Only alphabets are allowed in First Name';
    }else if (fieldName == 'lastName'){
      let lastNameValid = value.match(/^[A-z]+$/)
      fieldValidationErrors.lastName = lastNameValid ? '' : 'Only alphabets are allowed in Last Name';
    }else if (fieldName == 'companyName'){
      fieldValidationErrors.companyName = (value == '') ? 'Company name is required' : '';
    }else if (fieldName == 'salesforceCustomerId'){
      fieldValidationErrors.salesforceCustomerId = (value == '') ? 'Salesforce Customer ID is required' : '';
    }else if (fieldName == 'oppertunityId'){
      fieldValidationErrors.oppertunityId = (value == '') ? 'Opportunity ID is required' : '';
    }

    this.setState({formErrors: fieldValidationErrors},function(){
      this.validateForm()
    });
  }

  validateForm(){
    let enableAdd = true
    let formErrors = this.state.formErrors;
    Object.keys(formErrors).map((fieldName, i) => {
      if(formErrors[fieldName] != ''){
        enableAdd = false;
      }
    })
    if(enableAdd){
      this.setState({continueDisable:false})
    }else{
      this.setState({continueDisable:true})
    }
  }

  validateEmail(){
    let fieldValidationErrors = this.state.formErrors;
    validateEmail(this.state.email)
    .then((responce) =>  {
        // console.log('responce', responce)
        if(responce.status == 'failed'){
          fieldValidationErrors.email = ""
          this.setState({formErrors:fieldValidationErrors})
        }else{
          fieldValidationErrors.email = "Email already exists"
          this.setState({formErrors:fieldValidationErrors, continueDisable:true})
        }
        console.log('I am in sucess'+ JSON.stringify(responce))
      }
     )
    .catch((error) => console.log("Error in Adding New User" + error))
  }

  handletrialClick(e){
    this.setState({subscriptionType:'Trial', expiryDays: 14})
  }

  handleLicensedClick(e){
    this.setState({subscriptionType:'Paid', expiryDaysPaid:365})
  }

  handleEulaClick(e){
    if(this.state.eulaAccepted){
      this.setState({eulaAccepted:false})
    }else{
      this.setState({eulaAccepted:true})
    }
  }

  render(){
    const tooltipCompanyName = ( <Popover style={{color: 'black',borderWidth: 1,borderRadius:0,width:210,height:40,display:this.state.companyName =='' ? 'block': 'none' }}>{this.state.tooltipCompanyName}</Popover> )
    const tooltipSalesforce = ( <Popover style={{color: 'black',borderWidth: 1,borderRadius:0,width:250,height:40,display:this.state.salesforceCustomerId =='' ? 'block': 'none' }}>{this.state.tooltipSalesforce}</Popover> )
    const tooltipOppertunityId = ( <Popover style={{color: 'black',borderWidth: 1,borderRadius:0,width:210,height:40,display:this.state.oppertunityId =='' ? 'block': 'none' }}>{this.state.tooltipOppertunityId}</Popover> )
    const tooltipDaysInt = (<Popover style={{color: 'black',borderWidth: 1,borderRadius:0,width:230,height:40,display:this.state.expirydays !== '' || this.state.expiryDaysPaid !=='' ? 'block': 'none' }}>{this.state.tooltipDaysInt}</Popover>)
    return(
      <div className='customerWrapper' style={{display:'flex', marginRight:15}}>
        {this.props.addCustomerFields ?
          <div>
            <div style={{display:'flex', justifyContent:'space-between', margin: '0 0 20px 15px'}}>
              <div style={{fontSize: 20, fontWeight:'bold', color: '#454855', marginTop:5}}>ADD NEW CUSTOMER</div>
              <a href="javascript:void()" className='closeNew' onClick={this.props.handleClose} show={true} onHide={this.close} backdrop='static'>&#x2715;</a>
            </div>
            <Form>
              <div>
                <div className='addUserins'>
                  <OverlayTrigger ref="cName" placement="top" overlay={tooltipCompanyName}>
                    <input type="text" id='cName' name="companyName" value={this.state.companyName} onChange={this.handleUserInput.bind(this)} placeholder='Company Name' />
                  </OverlayTrigger>
                  <div style={{color:'red', margin: '8px 14px 0 0'}}>{this.state.formErrors.companyName}</div>
                </div>

                <div className='addUserins' style={{flexDirection: 'inherit', display: 'inherit'}}>
                  <div className='inputStyleOff'>
                    <input type="text" name="firstName" value={this.state.firstName} onChange={this.handleUserInput.bind(this)} style={{width:150, marginRight:10}} placeholder='First Name' />
                  </div>
                  
                  <div className='inputStyleOff'>
                    <input type="text" name="lastName"  value={this.state.lastName} onChange={this.handleUserInput.bind(this)} style={{width:165}} placeholder='Last Name' />
                  </div>
                  {this.state.formErrors.firstName !== ''?
                    <div style={{color:'red',margin: '8px 14px 0px 0px'}}>{this.state.formErrors.firstName}</div>
                    :this.state.formErrors.lastName !== ''?<div style={{color:'red',margin: '8px 14px 0px 0px'}}>{this.state.formErrors.lastName}</div> :''
                  }
                </div>
                  

                <div className='addUserins'>
                  <input type="text" value={this.state.address1} onChange={e => this.setState({ address1: e.target.value })} placeholder='Street address' />
                </div>

                <div className='addUserins' style={{flexDirection: 'inherit'}}>
                  <div className='inputStyleOff'>
                    <input type="text" value={this.state.city} onChange={e => this.setState({ city: e.target.value })} style={{width:150, marginRight:10}} placeholder='City' />
                  </div>
                  <div className='inputStyleOff'>
                    <input type="text" value={this.state.state} onChange={e => this.setState({ state: e.target.value })} style={{width:165}} placeholder='State' />
                  </div>
                </div>

                <div className='addUserins' style={{flexDirection: 'inherit'}}>
                  <div className='inputStyleOff'>
                    <input type="numer" value={this.state.zip} onChange={e => this.setState({ zip: e.target.value })} style={{width:150, marginRight:10}} placeholder='Zip Code' />
                  </div>
                  <div className='inputStyleOff'>
                    <input type="text" value={this.state.country} onChange={e => this.setState({ country: e.target.value })} style={{width:165}} placeholder='Country' />
                  </div>
                </div>

                <div className='addUserins'>
                  <input type="number" value={this.state.phone} onChange={e => this.setState({ phone: e.target.value })} placeholder='Phone Number' min="1" />
                </div>

                <div className='addUserins' style={{marginBottom: 0}}>
                  <input type="email" name='email' value={this.state.email} onChange={this.handleEmailChange.bind(this)}  placeholder='Email' />
                </div>

                <div style={{margin: '8px 14px 0px 0px'}}><p style={{color:'red',margin: '8px 14px 0px 15px'}}>{this.state.formErrors.email}</p></div>

                <div className='addUserins'>
                  <OverlayTrigger ref="SFId" placement="top" overlay={tooltipSalesforce}>
                    <input type="text" id='SFId' name="salesforceCustomerId" value={this.state.salesforceCustomerId} onChange={this.handleUserInput.bind(this)} placeholder='Salesforce Customer ID'/>
                  </OverlayTrigger>
                  <div style={{color:'red', margin: '8px 14px 0px 0px'}}>{this.state.formErrors.salesforceCustomerId}</div>
                </div>

                <div className='addUserins'>
                  <OverlayTrigger ref="opId" placement="top" overlay={tooltipOppertunityId}>
                    <input type="text" id='opId' name="oppertunityId" value={this.state.oppertunityId} onChange={this.handleUserInput.bind(this)}  placeholder='Opportunity Id'/>
                  </OverlayTrigger>
                  <div style={{color:'red', margin: '8px 14px 0px 0px'}}>{this.state.formErrors.oppertunityId}</div>
                </div>

                <div className='tableWrapper' style={{margin: '20px 0 10px 15px'}}>
                  <input type="checkbox" id="eula" name='eula' onClick={this.handleEulaClick.bind(this)} checked={this.state.eulaAccepted}/>
                  <label htmlFor="eula" style={{fontWeight:400}}>&nbsp;&nbsp;Customer has accepted Service Agreement & <br/>&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Privacy Policy through trial request workflow</label>
                </div>

                <div style={{marginLeft:16}}>
                  <p>Subscription Type</p>
                  <div className='cardType1'>
                    <div>
                        <input type="radio" id="trial" name='plan' onClick={this.handletrialClick.bind(this)} checked={this.state.subscriptionType === 'Trial' ? true : false}/>
                        <label htmlFor="trial">&nbsp;&nbsp;Trial</label>
                        <OverlayTrigger ref="trial" placement="top" overlay={tooltipDaysInt}>
                          <input type="number" id='trial' value={this.state.expiryDays} onChange={e => this.setState({ expiryDays: e.target.value })} style={{width:50,textAlign:'center', margin:'0 10px'}} />
                        </OverlayTrigger>
                          <span>days</span>
                    </div><br/>
                    <div>
                      <input type="radio" id="licensed" name='plan' onClick={this.handleLicensedClick.bind(this)} checked={this.state.subscriptionType == 'Paid' ? true : false}/>
                      <label htmlFor="licensed">&nbsp;&nbsp;Paid</label>
                      <OverlayTrigger ref="trial" placement="top" overlay={tooltipDaysInt}>
                        <input type="number" value={this.state.expiryDaysPaid} onChange={e => this.setState({ expiryDaysPaid: e.target.value })} style={{width:50,textAlign:'center', margin:'0 10px'}} />
                      </OverlayTrigger>
                      <span>days</span>
                    </div>
                  </div>
                </div>

                <div className='modalButtons' style={{margin: '30px -12px 0'}}>
                  <div><Button className='modalButton' onClick={this.props.handleClose} style={{color:'#4d59a4', backgroundColor:'#f6f4f4'}}>Cancel </Button></div>
                  <div><Button className='modalButtonSucess' onClick={this.handleAddCustomer.bind(this)} disabled={this.state.continueDisable}>Add</Button></div>
                </div>
              </div>
            </Form>
            <div>
              <a className="twitter-timeline" href="https://twitter.com/Cavirin" data-chrome="nofooter noborders">
                Tweets by @Cavirin
              </a>
            </div>
          </div>
        :""}
      </div>
    )
  }
}


export const FormErrors = ({formErrors}) =>
<div className='formErrors'>
  {Object.keys(formErrors).map((fieldName, i) => {
    if(formErrors[fieldName].length > 0){
      return (
        <p key={i} style={{color:'red'}}>{fieldName} {formErrors[fieldName]}</p>
      )
    } else {
      return '';
    }
  })}
</div>
