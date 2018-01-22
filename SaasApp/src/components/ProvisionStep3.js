import React from 'react';
import {Button} from 'react-bootstrap'

export default class ProvisionStep3 extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
     
    };
  }

  render() {
    return (
      <div>         
        <h4>SELF - SERVICE PROVISIONING STEP 3</h4>
        <div className='row pageWrapper'>
          <h5><b>ORDER REVIEW</b></h5>
          <p>Please review your order and submit it by clicking "Purchase" button at the bottom of the page</p>
          <div className='row'>
            <div className='col-lg-6'>
              <div className='twoDivCol'>
                <h5><b>DELIVER TO</b></h5>
                <p><b>{this.props.provisionObj.companyName}</b></p>
                <p>{this.props.provisionObj.contact.name}</p>
                <p>{this.props.provisionObj.contact.addr1}</p>
                <p>{this.props.provisionObj.contact.city}</p>
                <p>{this.props.provisionObj.contact.state},{this.props.provisionObj.contact.country} </p>
                <p>PIN: {this.props.provisionObj.contact.zip}</p>
                <p>{this.props.provisionObj.contact.email}</p>
              </div>
            </div>
            <div className='col-lg-6'>
              <div className='twoDivCol'>
                <h5><b>REVIEW PAYMENT DETAILS</b></h5>
                <p><b>{this.props.provisionObj.companyName}</b></p>
                <p>{this.props.provisionObj.contact.name}</p>
                <p>{this.props.provisionObj.contact.addr1}</p>
                <p>{this.props.provisionObj.contact.city}</p>
                <p>{this.props.provisionObj.contact.state},{this.props.provisionObj.contact.country} </p>
                <p>PIN: {this.props.provisionObj.contact.zip}</p>
                <p>{this.props.provisionObj.contact.email}</p>
              </div>
            </div>
          </div>
          <h5><b>REVIEW THE PURCHASE</b></h5>
          <div className='row'>
            <div className='col-lg-4'>
              <p><b>Product description:</b></p>
              <p>Cavirin Standard Enterprise</p>
              <p>Cavirin Policy Pack Unlimited</p>
            </div>
            <div className='col-lg-4'>
              <p><b>Qty:</b></p>
              <p>1</p>
              <p>1</p>
            </div>
            <div className='col-lg-4'>
              <p><b>Price:</b></p>
              <p>$124,000<span>(per year)</span></p>
              <p>$29,000<span>(per year)</span></p>
            </div>
          </div>
          <div className='row'>
            <div className='col-lg-4'></div>
            <div className='col-lg-4' style={{textAlign:'right',paddingTop: 10}}><b>Total:</b></div>
            <div className='col-lg-4'>
              <div className='totalAmount'>$153,000</div>
            </div>
          </div>
        </div>

        {/********* Purchase button *********/}
        <div className='btnWrapper'>
          <div><a href="/"><Button className='continueButtonp2'>Cancel</Button></a></div>
          <div><span className='continueButtonp2' onClick={this.props.savefunction}>Purchase</span></div>
        </div>      
      </div>
    );
  }
}
