import React from 'react';
import RemoveCustomer from './RemoveCustomer'
import CustomerServiceLogs from './CustomerServiceLogs'

export default class CustomerServiceStatus extends React.Component {
  constructor(props) {

    super(props);

    this.state = {
      customerName:'Acme Core',
      salesforceCustomerId: '-',
      instanceIP:'10.1.1.23',
      instanceStatus:'RUNNING'
    };
  }

  refresh(){
    this.props.refresh();
  }

  render() {
    return (
      <div className='cusServiceWrap'>
        <div style={{display:'flex', justifyContent:'space-between'}}>
          <div style={{fontSize: 20, fontWeight:'bold', color: '#454855', marginTop:5}}>Service Status</div>
          <a href="javascript:void()" className='closeNew' onClick={this.props.handleClose} show={true} onHide={this.close} backdrop='static'>&#x2715;</a>
        </div>
        <div>Customer Name: {this.props.customer.companyname}</div>
        <div>Salesforce Customer ID: {this.props.customer.salesforcecustomerid}</div>
        <div></div>
        <div style={{display:'flex'}}>
          Service Status:&nbsp;<b>{this.props.customer.instance_status}</b>&nbsp;&nbsp;
          {this.props.customer.instance_status !=='Terminated' ||  this.props.customer.instance_status =='Active' ?
        	<div style={{display:'flex', marginTop:-11}}>
            <RemoveCustomer customer={this.props.customer} deprovisioningAction='TERMINATE' refresh={this.refresh.bind(this)}/>
        	  <span style={{display: 'inline-block',marginTop: '9px'}}>&nbsp;|&nbsp;</span>
            <RemoveCustomer customer={this.props.customer} deprovisioningAction={(this.props.customer.instance_status !=='Stopped' || this.props.customer.instance_status =='Active' || this.props.customer.instance_status =='Restarted') ? 'STOP':'RESTART'} refresh={this.refresh.bind(this)}/>
          </div>: ''}&nbsp;&nbsp;
          {/* <CustomerServiceLogs customer={this.props.customer} /> */}
        </div>
        <div>
        	<table style={{border:1}}>
        		<tr>
        			<th>IP Address</th>
              <th>Instance ID</th>
        			<th>Status</th>
        		</tr>
        		<tr>
        			<td>{this.props.customer.ipaddress}</td>
              <td>{this.props.customer.instanceid}</td>
        			<td>{this.props.customer.instance_status}</td>
        		</tr>        		
        	</table>
        </div>
      </div>
    );
  }
}