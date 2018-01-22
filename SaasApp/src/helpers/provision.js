import axios from 'axios'
import {NetworkConstants} from '../constants/NetworkConstants'

export function provisionPulsar(provisioningData){
  console.log("provisionPulsar called in helper");
  return new Promise((resolve, reject) => {

    axios.post(NetworkConstants.API_SERVER+'/api/provisioning',provisioningData)
    .then(function (response) {
      resolve(response);
    })
    .catch(function (response) {
      reject(response);
    });
  })
}

/******* Add a New Customer ******/

export function addNewCustomer(provisioningDataNew){
  console.log("add New Customer called in helper");
  return new Promise((resolve, reject) => {

    axios.post(NetworkConstants.API_SERVER+'/api/provisioning',provisioningDataNew)
    .then(function (response) {
      resolve(response);
    })
    .catch(function (response) {
      reject(response);
    });
  })
}

export function deprovisionPulsar(customerId,action){
  console.log("deprovisionPulsar called in helper");
  return new Promise((resolve, reject) => {

    axios.post(NetworkConstants.API_SERVER+'/api/deprovisioning',{
      "customerid": customerId,
      "action": action
    })
    .then(function (response) {
      resolve(response);
    })
    .catch(function (response) {
      reject(response);
    });
  })
}