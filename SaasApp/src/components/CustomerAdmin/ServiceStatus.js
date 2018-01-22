import React from 'react';
import ServiceStatusShared from './../SharedComponents/ServiceStatusShared'
import ServiceMessages from './../SharedComponents/ServiceMessages'
import {getCustomerInfo, getInstanceStatus} from './../../helpers/admin'

export default class ServiceStatus extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      instanceIP:"",
      instance_status:"",
    };
  }

  componentDidMount(){
    let customerId = localStorage.getItem("customerId")
    getCustomerInfo(customerId)
    .then(res => {
      let customerInfo = res.data;
      console.log("res.dafdad", res.data)
      this.setState({
        instanceIP:customerInfo.ipaddress,
        token:""
        // instance_status:customerInfo.instance_status,
      })
    }).catch((e) => {
      console.log("Error in getting the Company Info1:"+JSON.stringify(e))
    })

    getInstanceStatus(customerId)
    .then(res => {
      let customerInfo = res.data;
      console.log("res.dafdad", res.data, res.pulsarUserdata)
      // localStorage.setItem('response',JSON.stringify(customerInfo.pulsarUserdata));
      this.setState({
        instance_status:customerInfo.status,
        token:JSON.stringify(res.pulsarUserdata)
      })
    }).catch((e) => {
      console.log("Error in getting the Company Info2:"+JSON.stringify(e))
    })
  }

  render() {
    let spanStyle = {fontSize:'20px',color:'#4C58A4',fontWeight:500}
    return (
      <div style={{marginTop:50, marginLeft:50}}>
        <div style={spanStyle}>Service</div>
        <div style={{marginTop:30}}>
          <ServiceStatusShared ipaddress={this.state.instanceIP} instance_status={this.state.instance_status} token={this.state.token}/>
        </div>
        <ServiceMessages/>
      </div>
    );
  }
}
