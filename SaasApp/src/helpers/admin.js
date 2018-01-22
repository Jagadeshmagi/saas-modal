import axios from 'axios'
import {NetworkConstants} from '../constants/NetworkConstants'

export function getCustomerInfo(customerId) {
    console.log("getCustomerInfo called in helper");
    return new Promise((resolve, reject) => {
	    axios.get(NetworkConstants.API_SERVER+'/api/customer/' + customerId)
	    .then(function (response) {
	      resolve(response.data);
	    })
	    .catch(function (response) {
	      reject(response);
	    });
    })
}

export function getPulsarSoftwareVersion(pulsarIP) {
    console.log("getPulsarSoftwareVersion called in helper");
    let pulsarAPIServer = 'https://'+pulsarIP+'/arap-server/settings'
	return new Promise((resolve, reject) => {
	    axios.get(pulsarAPIServer+'/software')
	    .then(function (response) {
	      resolve(response.data);
	    })
	    .catch(function (response) {
	      reject(response);
	    });
    })
}

export function getPulsarContentVersion(pulsarIP) {
    console.log("getPulsarContentVersion called in helper");
    let pulsarAPIServer = 'https://'+pulsarIP+'/arap-server/settings'
	return new Promise((resolve, reject) => {
	    axios.get(pulsarAPIServer+'/content')
	    .then(function (response) {
	      resolve(response.data);
	    })
	    .catch(function (response) {
	      reject(response);
	    });
    })
}


export function getPulsarDevicesCount(pulsarIP) {
    console.log("getPulsarDevicesCount called in helper");
    let pulsarAPIServer = 'https://'+pulsarIP+'/arap-server/settings'
	return new Promise((resolve, reject) => {
	    axios.get(pulsarAPIServer+'/resources/count')
	    .then(function (response) {
	      resolve(response.data);
	    })
	    .catch(function (response) {
	      reject(response);
	    });
    })
}

export function getExpDate(customerId){
    console.log("getExpDate called in helper");
	return new Promise((resolve, reject) => {
	    axios.get(NetworkConstants.API_SERVER+"/api/getExpDate/"+customerId)
      // axios.get(NetworkConstants.API_SERVER+"/api/getExpDate/"+6)
	    .then(function (response) {
	      resolve(response.data);
	    })
	    .catch(function (response) {
	      reject(response);
	    });
    })
}
// http://52.90.220.2:3000/api/getInstanceStatus/6

export function getInstanceStatus(customerId){
    console.log("getExpDate called in helper");
	return new Promise((resolve, reject) => {
	    axios.get(NetworkConstants.API_SERVER+"/api/getInstanceStatus/"+customerId)
      // axios.get(NetworkConstants.API_SERVER+"/api/getInstanceStatus/"+6)
	    .then(function (response) {
	      resolve(response.data);
	    })
	    .catch(function (response) {
	      reject(response);
	    });
    })
}


// 52.90.220.2:3000/api/getSubscriptionDetailsByUser/1
export function getSubscriptionDetailsByUser(customerId){
    console.log("getExpDate called in helper");
	return new Promise((resolve, reject) => {
	    axios.get(NetworkConstants.API_SERVER+"/api/getSubscriptionDetailsByUser/"+customerId)
      // axios.get(NetworkConstants.API_SERVER+"/api/getSubscriptionDetailsByUser/"+6)
	    .then(function (response) {
	      resolve(response.data);
	    })
	    .catch(function (response) {
	      reject(response);
	    });
    })
}

export function getMaintenance(){
    console.log("getExpDate called in helper");
	return new Promise((resolve, reject) => {
	    // axios.get(NetworkConstants.API_SERVER+"/api/getSubscriptionDetailsByUser/"+customerId)
      axios.get(NetworkConstants.API_SERVER+"/api/Maintenance/")
	    .then(function (response) {
	      resolve(response.data);
	    })
	    .catch(function (response) {
	      reject(response);
	    });
    })
}

export function serviceagreementaccepted(id){
    console.log("getExpDate called in helper");
	return new Promise((resolve, reject) => {
	    // axios.get(NetworkConstants.API_SERVER+"/api/getSubscriptionDetailsByUser/"+customerId)
      axios.put(NetworkConstants.API_SERVER+"/api/serviceagreementaccepted/" + id, {serviceagreementaccepted:"false"})
	    .then(function (response) {
	      resolve(response.data);
	    })
	    .catch(function (response) {
	      reject(response);
	    });
    })
}

export function toggleHelpscreen(id, boolean){
    console.log("getExpDate called in helper");
	return new Promise((resolve, reject) => {
	    // axios.get(NetworkConstants.API_SERVER+"/api/getSubscriptionDetailsByUser/"+customerId)
      axios.put(NetworkConstants.API_SERVER+"/api/toggleHelpscreen/" + id, {toggleHelpscreen:boolean})
	    .then(function (response) {
	      resolve(response.data);
	    })
	    .catch(function (response) {
	      reject(response);
	    });
    })
}

export function getUserName(customerId){
    console.log("getExpDate called in helper");
	return new Promise((resolve, reject) => {
	    // axios.get(NetworkConstants.API_SERVER+"/api/getSubscriptionDetailsByUser/"+customerId)
      axios.get(NetworkConstants.API_SERVER+"/api/name/" + customerId)
	    .then(function (response) {
	      resolve(response.data);
	    })
	    .catch(function (response) {
	      reject(response);
	    });
    })
}

export function getEula(id){
    console.log("getEula called in helper");
	return new Promise((resolve, reject) => {
      axios.get(NetworkConstants.API_SERVER+"/api/eula/" + id)
	    .then(function (response) {
	      resolve(response.data);
	    })
	    .catch(function (response) {
	      reject(response);
	    });
    })
}
