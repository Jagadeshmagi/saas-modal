import React from 'react';
import {Button, Popover, OverlayTrigger} from 'react-bootstrap';



export default class ServiceStatusShared extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      host:'',
      token: '',
      id: '',
      ipaddress: this.props.ipaddress,
      instance_status: this.props.instance_status
      // instance_status:"Stopped"
    };
  }

  componentDidMount(){
    this.buildURL();
  }

  componentWillReceiveProps(nextProps,nextState){
    console.log("nextState.ipaddress", nextState, nextProps)
    this.setState({
      ipaddress: nextProps.ipaddress,
      instance_status: nextProps.instance_status,
      token: nextProps.token

      // instance_status:"Stopped"
    }, ()=>{console.log("this.state", this.state)})
  }

  buildURL(){
    let host = window.location.hostname;
    let id = localStorage.getItem('customerId')
    // let token = localStorage.getItem('accessToken')
    let response = localStorage.getItem('response')
    this.setState({
      token:response,
      id:id,
      host: host
    })
  }

  render() {
    let connectPopover = (
      <Popover  id="popover-trigger-click-root-close"
        style={{marginTop:'15px', maxWidth:"300px", borderRadius: "0px"}}
        placement="bottom">
          <div>Connect to your Cavirin service if the status is Active. If your service status is not Active, please contact us.</div>
      </Popover>
    )
    // let pulsarLink = 'http://localhost:8080/#/auth/?token='+ this.state.token
    // let pulsarLink = 'https://'+this.state.ipaddress+'/pulsar/#/auth/?token='+ this.state.token
    let pulsarLink = 'https://'+this.state.ipaddress+'/pulsar/#/auth/?token='+ this.state.token
    // let pulsarLink3 = 'https://'+this.state.host+'/customer/'+ this.state.id+'/?token='+ this.state.token
  // Connect to your Cavirin service if the status is Active. If your service status is not Active, please contact us
    return (
      <div className='cusServiceWrap'>
        <div>
          <span style={{fontWeight:"bold"}}>Status:</span> &nbsp;&nbsp;{this.state.instance_status}
            <a style={{fontWeight:"bold", marginLeft:"50px"}} href={pulsarLink} target="_blank">
            <OverlayTrigger trigger="hover" rootClose placement="bottom" overlay={connectPopover}>
              <Button disabled={this.state.instance_status !== "Active"? true: false}
              className='continueButtonp2'>
                Connect
              </Button>
              </OverlayTrigger>
            </a>

          {/*<a href={pulsarLink3} target="_blank">
            <Button disabled={this.state.instance_status === "Stopped" || this.state.instance_status === "Terminated"? true: false}
            className='continueButtonp2'>
              Connect
            </Button>
          </a>*/}
        </div>
      </div>
    );
  }
}
