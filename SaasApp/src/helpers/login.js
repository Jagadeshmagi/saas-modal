import axios from 'axios'
import {NetworkConstants} from '../constants/NetworkConstants'
import base64 from 'base-64'
const axiosWithoutToken = axios.create();

export function auth(emailId,password){
  console.log("login called in helper");
  return new Promise((resolve, reject) => {
    axios.post(NetworkConstants.API_SERVER+'/api/login',{
      "email": emailId,
      "password": password
    })
    .then(function (response) {
      console.log("Success Response for auth", response.data)
      resolve(response);
    })
    .catch(function (response) {
      console.log("Success Response for auth", response.data)
      reject(response);
    });
  })
}

export function resetPassword(payload){
  console.log("resetPassword called in helper", payload);
  return new Promise((resolve, reject) => {
    axios.post(NetworkConstants.API_SERVER+'/api/login/updatePassword', payload)
    .then(function (response) {
      console.log("Success Response for resetPassword", response.data)
      resolve(response);
    })
    .catch(function (response) {
      console.log("Error Response for resetPassword", response.response)
      reject(response.response.data);
    });
  })
}

export function loginPulsar (username, password, pulsarIP) {
  console.log("username, password, pulsarIP", username, password, pulsarIP)
  let encodedStr = base64.encode(username+':'+password)
  let AuthStr = 'Basic '+encodedStr;
  //let client_id="pulsar"
  //let client_secret="cavirinSecurity"
  let pulsarAPIServer = 'https://'+pulsarIP+'/arap-server/api/v0/login'
  console.log("pulsarAPIServer", pulsarAPIServer, AuthStr)
  return new Promise((resolve, reject) => {
    axiosWithoutToken.post(pulsarAPIServer, {},{ headers: {'Content-Type':'application/x-www-form-urlencoded', Authorization: AuthStr } })
       .then(function (response) {
        // console.log("This is the login response", response.data)
        console.log("response.data.user.created !== response.data.user.modified", response.data.user.created, response.data.user.modified)
        // if (response.data.user.created !== response.data.user.modified){
        // if (!response.data.user.changePassword){
          console.log("This is the login response", response.data)
          response.data.userName = username;
          localStorage.setItem('response',JSON.stringify(response.data));
          localStorage.setItem('accessToken',response.data.access_token);
          localStorage.setItem('refreshToken',response.data.refresh_token);
          localStorage.setItem('userID',response.data.user.id);
          resolve({
            name: username,
            company: '',
            uid: response.data.access_token,
            user: response.data.user
          })
        // } else {
        //   localStorage.setItem('accessToken',response.data.access_token);
        //   localStorage.setItem('refreshToken',response.data.refresh_token);
        //   localStorage.setItem('userID',response.data.user.id);
        //   resolve({
        //     user: response.data.user
        //   })
        // }
      })
      .catch(function (response) {
        console.log("failed to auth", response)
        // if (response.data.message === "License has expired"){
        //   response.data.license = "License has expired";
        // }
        console.log("failed to auth", response.data)
        reject(response)
      }
    )
  })
}
