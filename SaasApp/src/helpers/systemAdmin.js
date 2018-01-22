import axios from 'axios'
import {NetworkConstants} from '../constants/NetworkConstants'

export function getSaaSCustomersList(searchTxt,start,end) {
  console.log("Get All the SAAS customers list called in helper");
  let queryStr = '';
  if(searchTxt != null && searchTxt!= ''){
    queryStr = "?name="+searchTxt
  }

  let url = NetworkConstants.API_SERVER+'/api/customers' + queryStr
  if(start != null && end != null){
    NetworkConstants.API_SERVER+'/api/customers/' + start + '/' + end + queryStr
  }
  return new Promise((resolve, reject) => {

      axios.get(url)
      .then(function (response) {
        resolve(response.data);
      })
      .catch(function (response) {
        reject(response);
      });
    }
  )
}

/*********** Remove Customer ********/

export function removeCustomer(customerIds){
  console.log('In helper', customerIds)
  return new Promise((resolve, reject) => {
    axios.put(NetworkConstants.API_SERVER+'/api/customerstatus',{     
      customerid:customerIds,
      status:'Inactive'
    })
    .then(function (response) {
      resolve(response.data);
    })
    .catch(function (response) {
      reject(response);
    });
  })
}

/*********** Get Contact Details for Subscription ********/
export function getContactList(customerid) {
  console.log("Get Contact Details for Subscription Details called in helper");
  return new Promise((resolve, reject) => {
      axios.get(NetworkConstants.API_SERVER+'/api/users/'+customerid)
      .then(function (response) {
        resolve(response.data);
      })
      .catch(function (response) {
        reject(response);
      });
    }
  )
}


/*********** Update Plan Details ********/

export function updateSubscription(customerId, entid, plan, subType, endDate){
  console.log('In helper updateSubscription')
  return new Promise((resolve, reject) => {
    axios.put(NetworkConstants.API_SERVER+'/api/plan',{     
      customerid:customerId,
      entid:entid,
      plan:plan,
      subtype:subType,
      enddate:endDate
    })
    .then(function (response) {
      resolve(response.data);
    })
    .catch(function (response) {
      reject(response);
    });
  })
}