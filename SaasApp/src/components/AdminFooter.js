import React from 'react';
import {Row, Col} from 'react-bootstrap';

export default function AdminFooter (){
 return(
   <Row className="admin_footer">
    <Col lg={12}>
      <hr/>
      <span>Need Help? Email: </span><a href="mailto:support@cavirin.com">support@cavirin.com</a>
      &nbsp;&nbsp;|&nbsp;&nbsp;<a target="_blank" href="https://cavirin.com/cloud/service-agreement/">Terms of Service</a>
      &nbsp;&nbsp;|&nbsp;&nbsp;<a target="_blank" href="https://cavirin.com/cloud/privacy-policy/">Privacy Policy</a>
    </Col>
   </Row>
  )
}
