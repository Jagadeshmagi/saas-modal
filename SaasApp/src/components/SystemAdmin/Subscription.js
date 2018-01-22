import React from 'react';
import {getContactList, updateSubscription} from '../../helpers/systemAdmin'
import moment from 'moment'
import DatePicker from 'react-bootstrap-date-picker'
import {FormGroup, Button} from 'react-bootstrap'

export default class Subscription extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      edition: 'Cavirin core',
      subscriptionStatus: this.props.customer.subtype,
      subscriptionStart: this.props.customer.customer_startdate,
      subscriptionEnd:this.props.customer.customer_enddate,

      editMode:false,
      contactDetailsArray:[],
      finalSubscriptionEnd:'',
      showDateError:false,
      showCurrentError:false,
      sameDateError:false
      // contactDetails:null


    };
  }

  componentDidMount(){
    console.log('selectedCustomer', this.props.customer)
    this.setState({subscriptionEnd:this.props.customer.customer_enddate})

    this.getContactDetail()
  }

  getContactDetail(){
    console.log('Coming',parseInt(this.props.entid))
    getContactList(this.props.selectedCustomerId[0])
    .then((res) =>  {
      this.setState({contactDetailsArray:res.data})
      console.log('DDDDDDDD', res.data)
    })
    .catch((error) => console.log("Error in Getting get Contact List"))


  }

  handleEdit(e){
    this.setState({editMode:true})
  }

  handleCancel(e){
    this.setState({editMode:false})
  }
  handleUpdate(e){
    updateSubscription(this.props.selectedCustomerId[0], parseInt(this.props.entid), this.state.edition, this.state.subscriptionStatus, this.state.finalSubscriptionEnd)
    .then((res) =>  {
      console.log('Sucess message', res.data)
      this.setState({editMode:false})
      this.props.refresh()
    })
    .catch((error) => console.log("Error in update Subscription"))
  }

  handleEditionChange(e){
    this.setState({edition:e.target.value})
  }

  handleStatusChange(e){
    this.setState({subscriptionStatus:e.target.value})
  }

  handleSubscriptionEnd(value){
    this.setState({subscriptionEnd:value})
    var NewDate = new Date(value);
    var finalEndDate = NewDate.toISOString();

    var today = moment().startOf('day').toISOString();

    // console.log('Start EndDate', this.state.subscriptionStart)
    console.log('finalEndDate', value, today, moment().startOf('day'))
    this.setState({finalSubscriptionEnd:finalEndDate, subscriptionEnd:value}, function(){
      this.checkDateValid()
    })

  }

  checkDateValid(){
    if(this.state.subscriptionStart <= this.state.subscriptionEnd){
      this.setState({
        showDateError:false
      });
    } else {
      this.setState({
        showDateError:true,
      });
    }

    var subscriptionStart = moment.utc(this.state.subscriptionStart,"YYYY/MM/DD @ HH:mm TZD").format('MM[-]DD[-]YYYY')
    var subscriptionEnd = moment.utc(this.state.subscriptionEnd,"YYYY/MM/DD @ HH:mm TZD").format('MM[-]DD[-]YYYY')
    let errorMessage;

    if(subscriptionStart == subscriptionEnd ){
      this.setState({
        sameDateError:true,
      })
    }else{
      this.setState({
        sameDateError:false,
      })
    }
  }

  render() {
    var subscriptionStart = moment.utc(this.state.subscriptionStart,"YYYY/MM/DD @ HH:mm TZD").format('MMM DD YYYY')
    var subscriptionEnd = moment.utc(this.state.subscriptionEnd,"YYYY/MM/DD @ HH:mm TZD").format('MM[-]DD[-]YYYY')
    let errorMessage;

    if(this.state.sameDateError){
      errorMessage = (<span className='datePickError'>"Subscription End and Start" date should not be same</span>)
    }

    if(this.state.showDateError){
      errorMessage = (<span  className='datePickError'>"Subscription End" date must be later than "From" date</span>)
    }

    var contactTableData=[]
    this.state.contactDetailsArray.map((val,key)=>{
      // console.log('Hiiiiii', val, key)
      let oneRow = <tr>
              <td>{val.name}</td>
              <td>{val.email}</td>
            </tr>
      contactTableData.push(oneRow)
    })
    return (
      <div className='cusServiceWrap'>
        <div style={{display:'flex', justifyContent:'space-between'}}>
          <div style={{fontSize: 20, fontWeight:'bold', color: '#454855', marginTop:5}}>Subscription Details</div>
          <a href="javascript:void(0)" className='closeNew' onClick={this.props.handleClose} show={true} onHide={this.close} backdrop='static'>&#x2715;</a>
        </div>
        <div>Customer :&nbsp;<span>{this.props.customer.companyname}</span> </div>
        <div>Salesforce Customer ID :&nbsp;<span>{this.props.customer.salesforcecustomerid}</span>  </div>
        <div>Opportunity ID :&nbsp;<span>{this.props.customer.oppertunityid}</span>  </div>

        <div style={{margin:'13px 0 0'}}><b>Contacts</b></div>
        <div>
          <table style={{border:1}}>
            <tr>
              <th>Name</th>
              <th>Email</th>
            </tr>
            {contactTableData}
          </table>
        </div>

        <div>
          <div style={{display:'flex', marginTop: 10}}>
            <span>Edition : </span>&nbsp;<span>{this.state.edition}</span>
{/*            {this.state.editMode ?
              <select value={this.state.edition} onChange={this.handleEditionChange.bind(this)}>
                <option value="cavirinplus">Cavirin Plus</option>
                <option value="cavirinGold">Cavirin Gold</option>
              </select>
              :
              <span>{this.state.edition}</span>
            }&nbsp;
*/}
          </div>

          <div style={{display:'flex'}}>
            <span>Subscription Type: </span>&nbsp;
            {this.state.editMode && this.state.subscriptionStatus == 'Trial' ?
              <select value={this.state.subscriptionStatus} onChange={this.handleStatusChange.bind(this)}>
                <option value="Trial" selected={this.state.subscriptionStatus == 'Trial'?true:false}>Trial</option>
                <option value="Paid" selected={this.state.subscriptionStatus == 'Paid'?true:false}>Paid</option>
              </select>
              :
              <span>{this.state.subscriptionStatus}</span>
            }&nbsp;
          </div>

          <div>Subscription Start: <span>{moment.utc(this.props.customer.customer_startdate,"YYYY/MM/DD @ HH:mm TZD").format('MMM Do YYYY')}</span></div>
          <div className='subscription' style={{display:'flex'}}><span style={{display:'inline-block', marginTop:this.state.editMode ? 8 : ''}}>Subscription End:</span>&nbsp;&nbsp;
            {this.state.editMode ?
              <span className="datePick mytable">
                <DatePicker value={this.state.subscriptionEnd} onChange={this.handleSubscriptionEnd.bind(this)} dateFormat="MM/DD/YYYY" calendarPlacement='top' />
                <div>{errorMessage}</div>
              </span>
              :
              <span>{moment.utc(this.props.customer.customer_enddate,"YYYY/MM/DD @ HH:mm TZD").format('MMM Do YYYY')}</span>
            }
            </div>

          <div>
            <div><b>Licensed Qty</b></div>
            <ul>
              <li>Containers: {this.props.customer.containercount}</li>
              <li>Hosts/VMs: {this.props.customer.vmcount}</li>
            </ul>
          </div>

          {this.state.editMode ?
            <div style={{display:'flex', padding:'4px 22px', margin:'20px -39px 0px 0px', justifyContent: 'flex-end'}}>
              <div className='modalButton' onClick={this.handleCancel.bind(this)} style={{padding:'3px 6px', border: '1px solid #4e5ba4'}}>Cancel</div>
              <Button className='modalButtonSucess' onClick={this.handleUpdate.bind(this)} style={{padding:'3px 10px', border: '1px solid #4e5ba4'}} disabled={(this.state.sameDateError || this.state.showDateError) ? true : false }>Save</Button>
            </div>
          :
            <span>
              {this.props.showEditSub ?
                <div className='modalButtonSucess' style={{padding:'4px 22px', margin:'20px 0 0'}} onClick={this.handleEdit.bind(this)}>Edit</div>
                : ''
              }
            </span>
          }

        </div>
      </div>
    );
  }
}
