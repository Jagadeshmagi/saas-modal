import React from 'react';
import {Button} from 'react-bootstrap';
import moment from 'moment';
import {getPulsarSoftwareVersion,getPulsarContentVersion,getPulsarDevicesCount,getCustomerInfo} from '../helpers/admin'

export default class BillingAndUsage extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
        companyName:'',
        name: '',
        addr1: '',
        addr2: '',
        city: '',
        state: '',
        country:'',
        zip: '',
        phone: '',
        email: '',

		customerId: '-',
		plan: '-',
		activatedDate: '-',
		expiryDate: '-',
		activeDevices: '-',
		buildversion: '-',
		contentVersion: '-',

		instanceName:'',
		instanceIP:'',
    url:''
    };
  }

  componentDidMount(){
    this.buildURL();
   let hostlocation = window.location.host;
   let customerId = localStorage.getItem('customerId');

   getCustomerInfo(customerId)
    .then(res => {
      let customerInfo = res.data;
      console.log("customerInfo:"+JSON.stringify(customerInfo))
      let planType = "Basic";
      if(customerInfo.plan != null){
      	planType = customerInfo.plan;
      }

	    let activatedDate = "-";
      if(customerInfo.activated != null){
       	activatedDate = moment(customerInfo.activated).format('MM.DD.YYYY');
      }

      let expiryDate = "-";
      if(customerInfo.expiredate != null){
      	expiryDate = moment(customerInfo.expiredate).format('MM.DD.YYYY');
      }

      this.setState({
      	companyName:customerInfo.companyname,
      	name:customerInfo.name,
      	addr1:customerInfo.addr1,
      	addr2:customerInfo.addr2,
      	city:customerInfo.city,
      	state:customerInfo.state,
      	country:customerInfo.country,
      	zip:customerInfo.zip,
      	phone:customerInfo.phone,
      	email:customerInfo.email,
      	instanceName:customerInfo.instanceid,
      	instanceIP:customerInfo.ipaddress,
      	customerId:customerInfo.companyname,
      	plan: planType,
		    activatedDate: activatedDate,
		    expiryDate: expiryDate
      })

  	  let pulsarIP = customerInfo.ipaddress

	    getPulsarContentVersion(pulsarIP)
      .then((data) => {
      	this.setState({contentVersion:data.contents[0].version});
	    })
	    .catch((e) => {
	  	  this.setState({contentVersion:'-'});
      	console.log("Error in getting pulsar content version :"+JSON.stringify(e));
	    });

  	  getPulsarSoftwareVersion(pulsarIP)
      .then((data) => {
        	this.setState({buildVersion:data.contents[0].version});
  	  })
  	  .catch((e) => {
  	  	this.setState({buildVersion:'-'});
        	console.log("Error in getting pulsar software version :"+JSON.stringify(e));
  	  });

      getPulsarDevicesCount(pulsarIP)
      .then((data) => {
        	this.setState({activeDevices:data.accessible});
  	  })
  	  .catch((e) => {
  	  	this.setState({activeDevices:'-'});
        	console.log("Error in getting pulsar accessible devices count :"+JSON.stringify(e));
  	  });

    }).catch((e) => {
    	console.log("Error in getting the Company Info:"+JSON.stringify(e))
    })

  }

  buildURL(){
    let token = localStorage.getItem('accessToken')
    let response = localStorage.getItem('response')
    console.log("dfasdfas2werw4", response)
    this.setState({
      url:response
    })
  }

  render() {
    // let pulsarLink = 'http://localhost:8080/#/auth/?token='+ this.state.url
    let pulsarLink = 'https://'+this.state.instanceIP+'/pulsar/#/auth/?token='+ this.state.url


  	// let pulsarLink = 'https://'+this.state.instanceIP+'/pulsar/?token='+token
    console.log("pulsarLinkpulsarLinkpulsarLink", pulsarLink)
    return (
      	<div style={{marginLeft:100, padding: '15px 0'}}>
          	<div className='row'>
                <div style={{fontWeight: 'bold',fontSize: 16}}>COMPANY INFO</div>
                <p>{this.state.companyName}</p>
                <p>{this.state.name}</p>
                <p>{this.state.addr1}</p>
                <p>{this.state.city},{this.state.state} {this.state.zip}</p>
                <p>{this.state.country} </p>
                <p>{this.state.email}</p>
            </div>
            <div className='row'>
              <h5><b>SCOPE</b></h5>
              <div className='col-lg-6' style={{padding:0}}>
          			<p>Customer ID: {this.state.customerId}</p>
          			<p>Plan: {this.state.plan} <span className='upgradeStyle'>Upgrade</span></p>
          			<p>Activated: {this.state.activatedDate}</p>
          			<p>Plan expires: {this.state.expiryDate}</p>
          			<p>Active devices: {this.state.activeDevices} </p>
          			<p>Build version: {this.state.buildversion} <span className='upgradeStyle'>Upgrade</span></p>
          			<p>Content version: {this.state.contentVersion} <span className='upgradeStyle'>Upgrade</span></p>
              </div>
              <div className='col-lg-6'></div>
            </div>
            <div className='row'>
              <h5><b>OPERATIONAL STATUS</b></h5>
      				<div className='col-lg-4' style={{padding:0}}>{this.state.instanceName}</div>
      				<div className='col-lg-4'>
      					<a href={pulsarLink} target="_blank"><Button className='continueButtonp2'>Connect</Button></a>
      				</div>
            </div>
      	</div>
    );
  }
}
