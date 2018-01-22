import React from 'react';
import {Button, Popover, OverlayTrigger} from 'react-bootstrap'
import {validateEmail} from '../helpers/users'
import {NetworkConstants} from '../constants/NetworkConstants'

export default class ProvisionStep2 extends React.Component {
  constructor(props){
    super(props);
    this.state={
      name:'',
      firstName:'',
      lastName:'',
      address1:'',
      city:'',
      state:'',
      zip:'',
      country:'',
      email:'',
      formErrors: {name:'',email: ''},
      emailValid: false,
      nameValid: false,
      formValid: false,
      continueDisable:true,
      showError:false,
      paymentOption:'creditCard',
      purchaseOrderNumber:'',

      tooltipCompanyName: 'Type your Company Name',
      tooltipFirstName:'Type your First Name',
      tooltipLastName:'Type your Last Name',
      tooltipStreetAddress:'Type Address',
      tooltipCity:'Type your City',
      tooltipState:'Type your State',
      tooltipCountry:'Type your Country',
      tooltipEmail:'Type your email',
      tooltipZip:'Type Zip code'
    }
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
        this.enableContinue()
      }
    );
  }

  validateField(fieldName, value) {
    let fieldValidationErrors = this.state.formErrors;
    let emailValid = this.state.emailValid;

    if(fieldName == 'email'){
      emailValid = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
      fieldValidationErrors.email = emailValid ? '' : ' is invalid';      
    }

    this.setState({formErrors: fieldValidationErrors,
                    emailValid: emailValid
                  },function(){
                    if(this.state.emailValid == '' || this.state.emailValid== null){
                      this.setState({continueDisable:true})
                    }else{
                      this.setState({continueDisable:false})
                    }
                    this.validateForm;
                    this.validateEmail()
                  });
  }

  validateEmail(){
    validateEmail(this.state.email)
    .then((responce) =>  {
        // console.log('responce', responce)
        if(responce.status == 'failed'){          
          this.setState({showError:false})
        }else{
          this.setState({showError:true, continueDisable:true})
        }
        console.log('I am in sucess'+ JSON.stringify(responce))
      }
     )
    .catch((error) => console.log("Error in Adding New User" + error))
  }

  handleName(e){
    this.setState({name:e.target.value}, function(){
      this.enableContinue()
    })
  }

  enableContinue(){
    if(this.state.name !== ''&& this.state.name !== null&& this.state.email !== ''&& this.state.email !== null){
      this.setState({continueDisable:false})
    }else{
      this.setState({continueDisable:true})
    }
  }

  componentDidMount(){
    var infraSizeVal = this.props.provisionObj.preferences.infrastructureSize.toString().replace(/[^a-zA-Z0-9]/g,'K - ')
    var dailyAsses = this.props.provisionObj.preferences.noOfDailyAssessments.toString().replace(/[^a-zA-Z0-9]/g,' - ')
    document.getElementById("infraSize").innerHTML = infraSizeVal+'K';
    document.getElementById("security").innerHTML = this.props.provisionObj.preferences.complianceFramework;
    document.getElementById("industryTypeId").innerHTML = this.props.provisionObj.preferences.infastructureType;
    document.getElementById("industrySelection").innerHTML = this.props.provisionObj.preferences.industryType;
    document.getElementById("assesments").innerHTML = dailyAsses;
  }
  handleContinue(){
    let companyName = this.state.name;
    let contactObj = {}; 
    contactObj.fname = this.state.firstName 
    contactObj.lname = this.state.lastName 
    contactObj.name = this.state.firstName + ' ' + this.state.lastName
    contactObj.addr1 = this.state.address1
    contactObj.addr2 = ''
    contactObj.city = this.state.city
    contactObj.state = this.state.state
    contactObj.country = this.state.country
    contactObj.zip = this.state.zip
    contactObj.email = this.state.email

    let paymentObj = {}; 
    paymentObj.paymenttype = this.state.paymentOption
    paymentObj.purchaseorderno = this.state.purchaseOrderNumber
    document.myform.card_holder_name.value = this.state.firstName+' '+this.state.lastName;
    document.myform.street_address.value = this.state.address1;
    document.myform.street_address2.value = '';
    document.myform.city.value = this.state.city;
    document.myform.state.value = this.state.state;
    document.myform.zip.value = this.state.zip;
    document.myform.country.value = this.state.country;
    document.myform.email.value = this.state.email;
    document.myform.companyname.value = this.state.name;
    document.myform.infrastructuresize.value = this.props.provisionObj.preferences.infrastructureSize;
    document.myform.industrytype.value = this.props.provisionObj.preferences.industryType;
    document.myform.complianceframework.value = this.props.provisionObj.preferences.complianceFramework;
    document.myform.infastructuretype.value = this.props.provisionObj.preferences.infastructureType;
    document.myform.noofdailyassesments.value = this.props.provisionObj.preferences.noOfDailyAssessments;
    document.myform.paymenttype.value = this.state.paymentOption;
    document.myform.name.value = this.state.firstName+' '+this.state.lastName;
    document.myform.first_name.value = this.state.firstName;
    document.myform.last_name.value = this.state.lastName;
    document.myform.addr1.value = this.state.address1;
    document.myform.addr2.value = '';
    document.myform.purchaseorderno.value = '';
    document.myform.x_receipt_link_url.value = NetworkConstants.API_SERVER+'/api/provisioning';
   
    if(this.state.paymentOption=='creditCard')
    {
      document.getElementById("form_id").submit();
      
    }
    else
    {
      this.props.saveStep2(companyName,contactObj,paymentObj)
    }
  }

  handlePaymentOption(e){
    this.setState({paymentOption:e.target.value})
    console.log(e.target.value)
  }
  render() {
    const tooltipCompanyName = ( <Popover style={{color: 'black',borderWidth: 1,borderRadius:0,width:210,height:40,display:this.state.name =='' ? 'block': 'none' }}>{this.state.tooltipCompanyName}</Popover> )
    const tooltipFirstName = ( <Popover style={{color: 'black',borderWidth: 1,borderRadius:0,width:210,height:40,display:this.state.firstName =='' ? 'block': 'none' }}>{this.state.tooltipFirstName}</Popover> )
    const tooltipLastName = ( <Popover style={{color: 'black',borderWidth: 1,borderRadius:0,width:210,height:40,display:this.state.lastName =='' ? 'block': 'none' }}>{this.state.tooltipLastName}</Popover> )
    const tooltipStreetAddress = ( <Popover style={{color: 'black',borderWidth: 1,borderRadius:0,width:210,height:40,display:this.state.address1 =='' ? 'block': 'none' }}>{this.state.tooltipStreetAddress}</Popover> )
    const tooltipCity = ( <Popover style={{color: 'black',borderWidth: 1,borderRadius:0,width:210,height:40,display:this.state.city =='' ? 'block': 'none' }}>{this.state.tooltipCity}</Popover> )
    const tooltipState = ( <Popover style={{color: 'black',borderWidth: 1,borderRadius:0,width:210,height:40,display:this.state.state =='' ? 'block': 'none' }}>{this.state.tooltipState}</Popover> )
    const tooltipCountry = ( <Popover style={{color: 'black',borderWidth: 1,borderRadius:0,width:210,height:40,display:this.state.country =='' ? 'block': 'none' }}>{this.state.tooltipCountry}</Popover> )
    const tooltipEmail = ( <Popover style={{color: 'black',borderWidth: 1,borderRadius:0,width:210,height:40,display:this.state.email =='' ? 'block': 'none' }}>{this.state.tooltipEmail}</Popover> )
    const tooltipZip = ( <Popover style={{color: 'black',borderWidth: 1,borderRadius:0,width:210,height:40,display:this.state.zip =='' ? 'block': 'none' }}>{this.state.tooltipZip}</Popover> )
    
    return (
      <div> 
        <h4>SELF - SERVICE PROVISIONING STEP 2</h4>
        <div className="row cotainerClass">
          <div className='col-lg-6'>
            <div>
              <h5><b>SELECTION</b></h5>
              <div>1. Infrastructure size - <span id='infraSize'></span></div>
              <div>2. Industry selection - <span id='industrySelection'></span></div>
              <div>3. Security and Compliance - <span id='security'></span></div>
              <div>4. Deployment type - <span id='industryTypeId'></span></div>
              <div>5. Number of assesments per day - <span id='assesments'></span></div>
            </div>

            <div>
              <h5><b>LICENSE DETAILS</b></h5>
              <ol>
                <li>Plan type - Cavirin Core Enterprise</li>
                <li>Plan Details<br/>
                  <ul className='glypStyle'>
                    <li>1 to  {this.props.provisionObj.preferences.infrastructureSize[1]}000 servers</li>
                    <li>10 Policy Pack bundles</li>
                    <li>25 K scans</li>
                    <li>API and Integration</li>
                    <li>Assesment reports (unlimited)</li>
                    <li>Analytical Dashboard</li>
                    <li>Alerts</li>
                    <li>Continuous monitoring</li>
                    <li>Email Support</li>
                  </ul>
                </li>
                <li>Software Fee<br/>
                  <div className='cardType1'>
                    <input type="radio" name='plan' checked={true} id="plan1"/>
                    <label for="plan1">F1 tier: Small & Medium EC2 & RDS instance, Elastic Load Balancer $0.01/host/hour</label><br/>
                    <input type="radio" name='plan' id="plan2" />
                    <label for="plan2">F1 tier: Medium EC2 & RDS instance, Elastic Load Balancers $0.04/host/hour</label>
                  </div>
                </li>
              </ol>
            </div>
          </div>

          <div className='col-lg-6'>
            <form id='form_id' name="myform" action='https://sandbox.2checkout.com/checkout/purchase' method='post'>
            <input type='hidden' name='sid' value='901364802' />
            <input type='hidden' name='mode' value='2CO' />
            <input type='hidden' name='li_0_type' value='product' />
            <input type='hidden' name='li_0_name' value='Example Product Name' />
            <input type='hidden' name='li_0_product_id' value='Example Product ID' />
            <input type='hidden' name='li_0__description' value='Example Product Description' />
            <input type='hidden' name='li_0_price' value='24.00' />
            <input type='hidden' name='li_0_quantity' value='1' />
            <input type='hidden' name='li_0_tangible' value='N' />
            <input type='hidden' name='card_holder_name' value='Checkout Shopper' />
            <input type='hidden' name='street_address' value='123 Test St' />
            <input type='hidden' name='street_address2' value='Suite 200' />
            <input type='hidden' name='city' value='Columbus' />
            <input type='hidden' name='state' value='OH' />
            <input type='hidden' name='zip' value='43228' />
            <input type='hidden' name='country' value='USA' />
            <input type='hidden' name='email' value='example@2co.com' />
            <input type='hidden' name='phone' value='614-921-2450' />
            <input type='hidden' name='phone_extension' value='197' />
            <input type='hidden' name='companyname' value='' />
            <input type='hidden' name='infrastructuresize' value='' />
            <input type='hidden' name='industrytype' value='' />
            <input type='hidden' name='complianceframework' value='' />
            <input type='hidden' name='infastructuretype' value='' />
            <input type='hidden' name='noofdailyassesments' value='' />
            <input type='hidden' name='paymenttype' value='' />
            <input type='hidden' name='name' value='' />
            <input type='hidden' name='first_name' value='' />
            <input type='hidden' name='last_name' value='' />
            <input type='hidden' name='purchaseorderno' value='' />
            <input type='hidden' name='addr1' value='' />
            <input type='hidden' name='addr2' value='' />
            <input type='hidden' name='x_receipt_link_url' value='http://35.154.147.88:3000/app/success'/>

            <input type='hidden' name='purchase_step' value='payment-method' />
            </form>
            <h5><b>ADDRESS</b></h5>
            <div>
            <div className='inputStyleFull'>
              <OverlayTrigger ref="severity" placement="right" overlay={tooltipCompanyName}>
                <input type="text" value={this.state.name} onChange={this.handleName.bind(this)} placeholder='Company Name' />
              </OverlayTrigger>
            </div>

              <div className='inputStyleOffWrap'>
                <div className='inputStyleOff'>
                <OverlayTrigger ref="severity" placement="right" overlay={tooltipFirstName}>
                  <input type="text" value={this.state.firstName} onChange={e => this.setState({ firstName: e.target.value })} style={{width:150, marginRight:10}} placeholder='First Name' />
                </OverlayTrigger>
                </div>
                <div className='inputStyleOff'>
                  <OverlayTrigger ref="severity" placement="right" overlay={tooltipLastName}>
                    <input type="text" value={this.state.lastName} onChange={e => this.setState({ lastName: e.target.value })} placeholder='Last Name' />
                  </OverlayTrigger>
                </div>
              </div>

              <div className='inputStyleFull'>
                <OverlayTrigger ref="severity" placement="right" overlay={tooltipStreetAddress}>
                  <input type="text" value={this.state.address1} onChange={e => this.setState({ address1: e.target.value })} placeholder='Street address' />
                </OverlayTrigger>
              </div>

              <div className='inputStyleOffWrap'>
                <div className='inputStyleOff'>
                  <OverlayTrigger ref="severity" placement="right" overlay={tooltipCity}>
                    <input type="text" value={this.state.city} onChange={e => this.setState({ city: e.target.value })} style={{width:150, marginRight:10}} placeholder='City' />
                  </OverlayTrigger>
                </div>
                <div className='inputStyleOff'>
                  <OverlayTrigger ref="severity" placement="right" overlay={tooltipState}>
                    <input type="text" value={this.state.state} onChange={e => this.setState({ state: e.target.value })} placeholder='State' />
                  </OverlayTrigger>
                </div>
              </div>

              <div className='inputStyleOffWrap'>
                <div className='inputStyleOff'>
                  <OverlayTrigger ref="severity" placement="right" overlay={tooltipZip}>
                    <input type="numer" value={this.state.zip} onChange={e => this.setState({ zip: e.target.value })} style={{width:150, marginRight:10}} placeholder='Zip Code' />
                  </OverlayTrigger>
                </div>
                <div className='inputStyleOff'>
                  <OverlayTrigger ref="severity" placement="right" overlay={tooltipCountry}>
                    <input type="text" value={this.state.country} onChange={e => this.setState({ country: e.target.value })} placeholder='Country' />
                  </OverlayTrigger>
                </div>
              </div>
              
              <div className='inputStyleFull'>
                <OverlayTrigger ref="severity" placement="right" overlay={tooltipEmail}>
                  <input type="email" name='email' value={this.state.email} onChange={this.handleEmailChange.bind(this)}  placeholder='Email' />
                </OverlayTrigger>
              </div>
              <div><FormErrors formErrors={this.state.formErrors} /></div>
              <div className='addUserins'><p></p>{this.state.showError ? <p style={{color:'red'}}>This mail Id is already exists</p> : ''}</div>
            </div><br/>

            <div>
              <h5><b>PAYMENT OPTIONS</b></h5>
              <div>
                <div className='paymentOption'>
                  <input type="radio" name="rGroup" value="creditCard" id="creditCard" onChange={this.handlePaymentOption.bind(this)} checked={this.state.paymentOption === 'creditCard'?true:false}/>&nbsp;
                  <label htmlFor="creditCard">Credit Card</label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  <input type="radio" name="rGroup" value="purchaseOrder" id="purchaseOrder" onChange={this.handlePaymentOption.bind(this)} checked={this.state.paymentOption === 'purchaseOrder'?true:false} />&nbsp;
                  <label htmlFor="purchaseOrder">Purchase Order Number</label>
                </div>
              </div>

              {this.state.paymentOption === 'creditCard' ?
              <div style={{marginTop:15,'display':'none'}}>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<div className='creditCardButton'><a href="javascript:void(0)">Click to complete credit card payment</a></div>
              </div>
              :
              <div className='addUserins' style={{margin:'10px 0 0 0'}}>
                <p style={{margin:'4px 0px'}}>Order Number</p>
                <input type="text" value={this.state.purchaseOrderNumber} onChange={e => this.setState({ purchaseOrderNumber: e.target.value })} placeholder='Provide Order Number' />
              </div>
            }
          </div>

          {/********* Continue button *********/}
          <div className='btnWrapper'>
            <div><a href="/"><Button className='continueButtonp2'>Cancel</Button></a></div>
            <div><Button className='continueButtonp2' onClick={this.handleContinue.bind(this)} disabled={this.state.continueDisable}>Complete</Button></div>
          </div>                    
        </div>
      </div>

    </div>
    );
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