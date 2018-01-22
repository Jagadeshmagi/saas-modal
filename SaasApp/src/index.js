import React from 'react';
import ReactDOM from 'react-dom';
import AppRoutes from './routes';
import {NetworkConstants} from './constants/NetworkConstants'

window.onload = () => {
  NetworkConstants.API_SERVER = 'http://34.201.99.168:3000'
  // NetworkConstants.API_SERVER = window.location.protocol +'//'+ window.location.host
  ReactDOM.render(<AppRoutes/>, document.getElementById('main'));
};