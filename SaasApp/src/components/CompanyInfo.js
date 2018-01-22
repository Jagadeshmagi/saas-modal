import React from 'react';
import {Button, Modal, Form} from 'react-bootstrap';
import {getCompanyDetail, updateCompnayInfo, getCardDetail} from '../helpers/users'


class CompanyInfo extends React.Component {
  constructor(props) {    
    super(props);
    this.state = {
      companyName:'',
      first_name:'',
      last_name:'',
      addr1:'',
      addr2:'',
      city:'',
      state:'',
      country:'',
      zip:'',
      email:'',

      edit_companyName:'',
      edit_name:'',
      edit_addr1:'',
      edit_addr2:'',
      edit_city:'',
      edit_state:'',
      edit_country:'',
      edit_zip:'',
      edit_email:'',
      edit_contactId:'',
      edit_phone:'',

      cardType:'',
      cardNumber:'',
      cardHolderName:'',
      mm:'',
      yyyy:'',
      customerId:5,
      openEditModal:false,
      paymentOption:'creditCard',
      purchaseOrderNumber:''
    };
  }

  componentDidMount(){
    this.getCompanyInfo()
    this.getCardDetails()
  }

  getCompanyInfo(){
    getCompanyDetail(this.state.customerId)
    .then((responce) =>  {
      console.log('Company Details', responce)
      this.setState({
        companyName:responce.data.companyname,
        first_name:responce.data.first_name,
        last_name:responce.data.last_name,
        addr1:responce.data.addr1,
        addr2:responce.data.addr2,
        city:responce.data.city,
        state:responce.data.state,
        country:responce.data.country,
        zip:responce.data.zip,
        email:responce.data.email,

        edit_companyName:responce.data.companyname,
        edit_first_name:responce.data.first_name,
        edit_last_name:responce.data.last_name,
        edit_addr1:responce.data.addr1,
        edit_addr2:responce.data.addr2,
        edit_city:responce.data.city,
        edit_state:responce.data.state,
        edit_country:responce.data.country,
        edit_zip:responce.data.zip,
        edit_email:responce.data.email,
        edit_contactId:responce.data.contactid
      })
    })
    .catch((error) => console.log("Error in Getting Company Detail"))
  }

  getCardDetails(){
    getCardDetail()
    .then((responce) =>  {
      console.log('Card Details Details', responce)
      this.setState({
        cardType:responce.data.cardtype,
        cardHolderName:responce.data.cardowner,
        cardNumber:responce.data.cardno,
        mm:responce.data.expirymonth,
        yyyy:responce.data.expiryyear,
        paymentOption:responce.data.paymenttype,
        purchaseOrderNumber:responce.data.purchaseorderno        
      })
    })
    .catch((error) => console.log("Error in Getting Card Detail"))
  }

  updateButtonClicked(){
    var name = this.state.first_name+ ' ' +this.state.last_name
    console.log('name', name)
    updateCompnayInfo(this.state.edit_companyName, this.state.edit_first_name, this.state.edit_last_name, name, this.state.edit_addr1, this.state.edit_addr2, this.state.edit_city, this.state.edit_state, this.state.edit_country, this.state.edit_zip, this.state.edit_phone, this.state.edit_contactId, this.state.customerId)
    .then((responce) =>  {
        if(this.state.openEditModal){
          this.setState({openEditModal:false})
          this.getCompanyInfo()
        }
        console.log('I am in sucess'+ JSON.stringify(responce))
      }
     )
    .catch((error) => console.log("Error in Updating company Info" + error)) 
  }

  close(e){
    e.preventDefault();
    if(this.state.openEditModal){
      this.setState({openEditModal:false})
    }
  }

  handleDelete(){
    console.log('Delete')
  }

  handleEdit(){
    console.log('Edited')
  }
  editClicked(){
    this.setState({openEditModal:true})
  }
  handlePaymentOption(e){
      this.setState({paymentOption:e.target.value})
    console.log(e.target.value)
  }
  render() {
    return (
      <div id='companyInfo'>
        <div className='row'>
          <div className='col-lg-6'>
            <div className='compinfo'>
            <div className='twoItem'>
              <div style={{fontWeight: 'bold',fontSize: 16}}>COMPANY INFO</div>
              <div className='editStyle' onClick={this.editClicked.bind(this)}>Edit</div>
            </div>
              <p><b>{this.state.companyName}</b></p>
              <p><span>{this.state.first_name}</span>&nbsp;<span>{this.state.last_name}</span></p>
              <p>{this.state.addr1}</p>
              <p>{this.state.addr2}</p>
              <p>{this.state.city}</p>
              <p>{this.state.state},{this.state.country} </p>
              <p>Zip Code: {this.state.zip}</p>
              <p>{this.state.email}</p>
              
              {/******* Modal Window for Edit ***********/}

              {this.state.openEditModal ? 
              <div id='companyInfoWrap'>
                <Modal
                  show={this.state.openEditModal}
                  onHide={this.close}
                  backdrop='static'>
                  <form style={{border: '1px solid Navy'}}>
                    <div style={{marginTop:'10px',paddingLeft:'15px', minHeight:400}}>
                      <Modal.Header  style={{marginRight:15,borderBottom:0}}>
                        <a href="" className='closebtn' onClick={this.close.bind(this)} show={true} onHide={this.close} backdrop='static'>
                          &#x2715;
                        </a>
                        <Modal.Title id="contained-modal-title" style={{fontSize: 20, fontWeight:'bold', color: '#454855'}}>
                          {'EDIT COMPANY INFORMATION'}
                        </Modal.Title>
                      </Modal.Header>
                      <Modal.Body style={{padding:'0 15px 15px'}}>
                      <Form>
                        <div className='addUserInputs'>
                          <div className='addUserins'><p>Company Name</p><input type="text" value={this.state.edit_companyName} onChange={e => this.setState({ edit_companyName: e.target.value })} /></div>
                          <div className='addUserins'><p>First Name</p><input type="text" value={this.state.edit_first_name} onChange={e => this.setState({ edit_first_name: e.target.value })} /></div>
                          <div className='addUserins'><p>Last Name</p><input type="text" value={this.state.edit_last_name} onChange={e => this.setState({ edit_last_name: e.target.value })} /></div>
                          <div className='addUserins'><p>Address 1</p><input type="text" value={this.state.edit_addr1} onChange={e => this.setState({ edit_addr1: e.target.value })} /></div>
                          <div className='addUserins'><p>Address 2</p><input type="text" value={this.state.edit_addr2} onChange={e => this.setState({ edit_addr2: e.target.value })}  /></div>
                          <div className='addUserins'><p>City</p><input type="text" value={this.state.edit_city} onChange={e => this.setState({ edit_city: e.target.value })} /></div>
                          <div className='addUserins'><p>State</p><input type="text" value={this.state.edit_state} onChange={e => this.setState({ edit_state: e.target.value })} /></div>
                          <div className='addUserins'><p>Country</p><input type="text" value={this.state.edit_country} onChange={e => this.setState({ edit_country: e.target.value })} /></div>
                          <div className='addUserins'><p>Zip Code</p><input type="text" value={this.state.edit_zip} onChange={e => this.setState({ edit_zip: e.target.value })} /></div>
                          <div className='addUserins'><p>Email</p><input type="email" value={this.state.edit_email} disabled /></div>
                          
                          <div className='modalButtons'>
                            <div><Button className='modalButton' onClick={this.close.bind(this)} style={{color:'#4d59a4', backgroundColor:'#f6f4f4'}}>Cancel </Button></div>
                            <div><Button className='modalButtonSucess' onClick={this.updateButtonClicked.bind(this)}>Update</Button></div>
                          </div>
                        </div>
                      </Form>
                      </Modal.Body>
                    </div>
                  </form>
                </Modal>
              </div>

              :''}
            </div>
          </div>
        </div>
        <div className='row'>
          <div className='col-lg-6'>
            <div className='compinfo'>
              <div style={{fontWeight: 'bold',fontSize: 18}}>PAYMENT DETAILS</div><br/>
              <div>
                <div className='paymentOption'>
                  <input type="radio" name="rGroup" value="creditCard" id="creditCard" onChange={this.handlePaymentOption.bind(this)} checked={this.state.paymentOption === 'creditCard'?true:false}/>&nbsp;
                  <label htmlFor="creditCard">Credit Card</label><br/>
                  <input type="radio" name="rGroup" value="purchaseOrder" id="purchaseOrder" onChange={this.handlePaymentOption.bind(this)} checked={this.state.paymentOption === 'purchaseOrder'?true:false} />&nbsp;
                  <label htmlFor="purchaseOrder">Purchase Order Number</label>
                </div>
              </div>
              {/*
              {this.state.paymentOption === 'creditCard' ?
              <div>
                <div className='inputStyleFull' value={this.state.cardType} placeholder='Card Type'>
                  <select readonly>
                    <option value="">Select Card Type</option>
                    <option value="masterCard" selected={this.state.cardType=='masterCard'?true:false}>MasterCard</option>
                    <option value="visa" selected={this.state.cardType=='visa'?true:false}>Visa</option>
                    <option value="americanExpress" selected={this.state.cardType=='americanExpress'?true:false}>American Express</option>
                  </select>
                </div>

                <div className='inputStyleFull'><input type="text" value={this.state.cardHolderName} placeholder='Card Holder Name' readonly /></div>
                <div className='inputStyleFull'><input type="text" value={this.state.cardNumber} placeholder='Card Number' readonly /></div>
                <div className='inputStyleOffWrap'>
                <div className='inputStyleFull'><input type="text" style={{width: 95}} value={this.state.mm+ ' / '+this.state.yyyy} placeholder='Card Number' readonly /></div>
                  {/*<div className='inputStyle3'><input type="text" value={this.state.mm} onChange={e => this.setState({ mm: e.target.value })} placeholder='MM' onkeypress='return event.charCode >= 48 && event.charCode <= 57'/></div>
                  <div className='inputStyle3'><input type="text" value={this.state.yyyy} onChange={e => this.setState({ yyyy: e.target.value })} placeholder='YYYY' /></div>
                </div>
                <div className='twoItem buttonTwo'>
                  <div><Button className='continueButtonp2' onClick={this.handleDelete.bind(this)}>Delete</Button></div>
                  <div><Button className='continueButtonp2' onClick={this.handleEdit.bind(this)}>Edit</Button></div>
                </div>
              </div>
              :
              <div className='addUserins' style={{minHeight:220, margin:'10px 0 0 0'}}>
                <p style={{margin:'4px 0px'}}>Order Number</p>
                <input type="text" value={this.state.purchaseOrderNumber} onChange={e => this.setState({ purchaseOrderNumber: e.target.value })} placeholder='Provide Order Number' />
              </div>
              }*/}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CompanyInfo