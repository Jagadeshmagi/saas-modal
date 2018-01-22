import React from 'react';
import ProvisionStep1 from './ProvisionStep1';
import ProvisionStep2 from './ProvisionStep2';
import ProvisionStep3 from './ProvisionStep3';
import SucessMessage from './SucessMessage';
import Header from './Header';
import {provisionPulsar} from '../helpers/provision'

export default class ProvisionMain extends React.Component {
  constructor(props) {
    
    super(props);

    this.state = {
      step:'Step1',
      provisionObj:{
        companyName:'',
        contact:{
          name: '',
          addr1: '',
          addr2: '',
          city: '',
          state: '',
          country:'',
          zip: '',
          phone: '',
          email: ''
        },
        preferences:{
          infrastructureSize: '',
          industryType: [],
          complianceFramework: [],
          infastructureType: [],
          noOfDailyAssessments: 0
        },
        sucess:false
      },
      payment:{
        paymenttype:'',
        purchaseorderno:'',
      },      
    };

    this.saveStep1 = this.saveStep1.bind(this);
    this.saveStep2 = this.saveStep2.bind(this);
    this.savefunction = this.savefunction.bind(this);
  }

  saveStep1(preferencesObj){
    let newObj = this.state.provisionObj;
    newObj.preferences = preferencesObj;
    this.setState({provisionObj:newObj,step:'Step2'})
  }

  saveStep2(companyName,contactObj,paymentObj){
    let newObj = this.state.provisionObj;
    newObj.companyName = companyName;
    newObj.contact = contactObj;
    this.setState({provisionObj:newObj,payment:paymentObj},() => {
      this.savefunction()
    })
  }

  savefunction(){
    let hostlocation = window.location.host;
    let provisionObj = this.state.provisionObj;
    let contactObj = provisionObj.contact;
    let preferencesObj = provisionObj.preferences;
    let paymentObj = this.state.payment;

    let provisioningData = {
      "companyname": provisionObj.companyName,
      "name": contactObj.name,
      "first_name":contactObj.fname,
      "last_name":contactObj.lname,
      "addr1": contactObj.addr1,
      "addr2": contactObj.addr2,
      "city": contactObj.city,
      "state": contactObj.state,
      "country": contactObj.country,
      "zip": contactObj.zip,
      "phone": contactObj.phone,
      "email": contactObj.email,
      "infrastructuresize": preferencesObj.infrastructureSize,
      "industrytype": preferencesObj.industryType,
      "complianceframework": preferencesObj.complianceFramework,
      "infastructuretype": preferencesObj.infastructureType,
      "noofdailyassesments": preferencesObj.noOfDailyAssessments,
      "paymenttype":paymentObj.paymenttype,
      "purchaseorderno":paymentObj.purchaseorderno,
    }

    provisionPulsar(provisioningData)
    .then(res => {
      this.setState({sucess:true})
    })

  }


  render() {
    let page;
    if(this.state.step=='Step1'){
      page = <ProvisionStep1 provisionObj={this.state.provisionObj} saveStep1={this.saveStep1}/>
    }else if(this.state.step=='Step2'){
      page = <ProvisionStep2 provisionObj={this.state.provisionObj} saveStep2={this.saveStep2}/>
    }else if(this.state.step=='Step3'){
      page = <ProvisionStep3 provisionObj={this.state.provisionObj}  savefunction={this.savefunction}/>
    }

    return (
      <div> 
        <Header header="Cavirin Self-Service Provisioning"/>
        {page}
        {this.state.sucess ? <SucessMessage showAlert ={true}/> : ''}
      </div>
    );
  }
}