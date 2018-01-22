import React from 'react';
import SubscriptionDetailsShared from './../SharedComponents/SubscriptionDetailsShared'
import {getSubscriptionDetailsByUser} from './../../helpers/admin'
import moment from 'moment';

export default class SubscriptionDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      edition:"Cavirin Core",
      subStatus:"Trial",
      subStartDate:"12/12/2017",
      subEndDate:"12/12/2018",
      container:"1000",
      hosts:"10,000"
    };
  }

//   {
//     "status": "success",
//     "data": {
//         "id": "6",
//         "productid": "6",
//         "oppertunityid": "6",
//         "startdate": "12-19-2017 19:10:25-07",
//         "enddate": "12-19-2017 19:10:25-07",
//         "subtype": "Paid",
//         "vmcount": "11",
//         "containercount": "11",
//         "imagecount": "1",
//         "subtypes": "Paid"
//     },
//     "message": "Subscription Data"
// }

  componentDidMount(){
    let customerId = localStorage.getItem("customerId")
    getSubscriptionDetailsByUser(customerId)
      .then((res)=>{
        console.log(res.data)
        let customerInfo = res.data
        this.setState({
          subStatus: customerInfo.subtype,
          subStartDate: moment.utc(customerInfo.startdate).format('MM.DD.YYYY'),
          subEndDate: moment.utc(customerInfo.enddate).format('MM.DD.YYYY'),
          container: customerInfo.containercount,
          hosts: customerInfo.vmcount
        })
      })
      .catch((error)=>{
        console.log("getSubscriptionDetailsByUser error ", error)
      })
  }

  render() {
    return (
      <SubscriptionDetailsShared
        edition={this.state.edition}
        subStatus={this.state.subStatus}
        subStartDate={this.state.subStartDate}
        subEndDate={this.state.subEndDate}
        container={this.state.container}
        hosts={this.state.hosts}
      />
    )
  }
}
