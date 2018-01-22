import React, { PropTypes } from 'react'
import CavirinIcon from './common/CavirinIcon'
import { Button, Col, FormControl, FormGroup, ControlLabel, HelpBlock,Glyphicon, Row} from 'react-bootstrap'
import Joi from 'joi-browser';
import {auth} from '../helpers/login'
import Header from './Header';

export default class PaySuccess extends React.Component {

  
  
  render() {
    
     return (
      <div> 
        <Header header="Cavirin Self-Service Provisioning"/>
        <div style={{"margin": "auto","width": "35%","margin-top":"7%"}}>
          <p style={{"margin": "auto","width": "8%"}}>        
          <span className="glyphicon glyphicon-ok-sign" style={{'color':'green','font-size': '30px'}}></span>
          </p>
          <p style={{"font-size": "20px","font-weight": "bold","margin": "auto","width": "50%"}}>CONGRATULATIONS</p>
          <p style={{"font-size": "15px"}}>Your order has been accepted. You will be receiving a confirmation mail along with the link to admin portal to connect to the Server.</p>
          
        </div>

      </div>
    );
  }
}

PaySuccess.contextTypes = {
    router: PropTypes.object.isRequired,
}
