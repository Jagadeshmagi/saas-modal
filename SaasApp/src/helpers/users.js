import axios from 'axios'
import {NetworkConstants} from '../constants/NetworkConstants'

/******* Add a New USER ******/
export function addNewUser(firstName, lastName, email, customerId){
  console.log("Add user called in helper");
  var customer_Id = localStorage.getItem('customerId')

  return new Promise((resolve, reject) => {
    axios.post(NetworkConstants.API_SERVER+'/api/adduser',{     
      first_name:firstName,
      last_name:lastName,
      email:email,
      customerid:customer_Id
    })
    .then(function (response) {
      resolve(response.data);
    })
    .catch(function (response) {
      reject(response);
    });
  })
}

/****** Validating Emails ******/

export function validateEmail(inputEmail){
  return new Promise((resolve, reject) => {
    axios.post(NetworkConstants.API_SERVER+'/api/checkuserid',{     
      email: inputEmail
    })
    .then(function (response) {
      resolve(response.data);
    })
    .catch(function (response) {
      reject(response);
    });
  })
}

/*********** Getting All the user ********/

export function getUserTable(customerID) {
  var customer_Id = localStorage.getItem('customerId')
  var user_Id = localStorage.getItem('userId')
  console.log("Get All the existing User called in helper");
  return new Promise((resolve, reject) => {
      axios.get(NetworkConstants.API_SERVER+'/api/users/'+customer_Id+'/'+user_Id)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (response) {
          reject(response);
      });
    }
  )
}

/*********** Delete user ********/

export function deleteUser(userIds){
  console.log("delete User called in helper", userIds);
  return new Promise((resolve, reject) => {
    axios.post(NetworkConstants.API_SERVER+'/api/deleteusers',{     
      "userid": userIds
    })
    .then(function (response) {
      resolve(response.data);
    })
    .catch(function (response) {
      reject(response);
    });
  })
}

/*********** Suspend user ********/

export function suspendUser(userIds){
  console.log("suspend User called in helper", userIds);
  return new Promise((resolve, reject) => {
    axios.put(NetworkConstants.API_SERVER+'/api/suspendusers',{     
      "userid": userIds
    })
    .then(function (response) {
      resolve(response.data);
    })
    .catch(function (response) {
      reject(response);
    });
  })
}


/*********** Edit User ********/
export function editUser(userId) {
  console.log("Edit user called in helper");
  return new Promise((resolve, reject) => {
      axios.get(NetworkConstants.API_SERVER+'/api/user/'+userId)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (response) {
          reject(response);
      });
    }
  )
}

/*********** Update User ********/

export function updateUser(firstName, lastName, email, status, userId){
  console.log("AupdateUser called in helper");
  return new Promise((resolve, reject) => {
    axios.put(NetworkConstants.API_SERVER+'/api/edituser/'+userId,{     
      first_name:firstName,
      last_name:lastName,
      email:email,
      status:status
    })
    .then(function (response) {
      resolve(response.data);
    })
    .catch(function (response) {
      reject(response);
    });
  })
}

/*********** Get Company Details ********/
export function getCompanyDetail(userId) {
  console.log("Get Company Details called in helper");
  var customer_Id = localStorage.getItem('customerId')

  return new Promise((resolve, reject) => {
      axios.get(NetworkConstants.API_SERVER+'/api/customer/'+customer_Id)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (response) {
          reject(response);
      });
    }
  )
}

/*********** update Company Info ********/
export function updateCompnayInfo(companyName, first_name, last_name, name, addr1, addr2, city, state, country, zip, phone, contactId, customerId){
  console.log("AupdateUser called in helper");
  var customer_Id = localStorage.getItem('customerId')

  return new Promise((resolve, reject) => {
    axios.put(NetworkConstants.API_SERVER+'/api/editcustomer/'+customer_Id,{     
      companyname:companyName,
      first_name:first_name,
      last_name:last_name,
      name:name,
      addr1:addr1,
      addr2:addr2,
      city:city,
      state:state,
      country:country,
      zip:zip,
      phone:phone,
      contactid:contactId
    })
    .then(function (response) {
      resolve(response.data);
    })
    .catch(function (response) {
      reject(response);
    });
  })
}

/*********** Get Card Details ********/
export function getCardDetail() {
  console.log("Get Card Details called in helper");
  var customer_Id = localStorage.getItem('customerId')
  return new Promise((resolve, reject) => {
      axios.get(NetworkConstants.API_SERVER+'/api/ccinfo/'+customer_Id)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (response) {
          reject(response);
      });
    }
  )
}