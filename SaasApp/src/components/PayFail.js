import React, { PropTypes } from 'react'
import CavirinIcon from './common/CavirinIcon'
import { Button, Col, FormControl, FormGroup, ControlLabel, HelpBlock,Glyphicon, Row} from 'react-bootstrap'
import Joi from 'joi-browser';
import {auth} from '../helpers/login'
import Header from './Header';

export default class PayFail extends React.Component {


  render() {
         return (
      <div> 
        <Header header="Cavirin Self-Service Provisioning"/>
        <div style={{"margin": "auto","width": "35%","margin-top":"7%"}}>
          <p style={{"margin": "auto","width": "8%"}}>        
          <span className="glyphicon glyphicon-warning-sign" style={{'color':'red','font-size': '30px'}}></span>
          </p>
          <p style={{"font-size": "20px","font-weight": "bold","margin": "auto","width": "33%"}}>Payment Failed</p>
          <p style={{"font-size": "15px"}}>Your purchase failed to complete successfully.Please contact our billing support team for assistance.</p>
          
        </div>

      </div>
    );
  }
}

PayFail.contextTypes = {
    router: PropTypes.object.isRequired,
}
