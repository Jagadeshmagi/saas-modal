import React from 'react';
import { Popover, OverlayTrigger, Glyphicon} from 'react-bootstrap'
import {getUserName} from './../helpers/admin'


export default class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      arrow:"menu-down",
      name:""
    }
  }

  componentDidMount(){
    let customerId = localStorage.getItem('customerId');
    console.log("customerId customerId ", customerId)
    if (customerId !== "null"){
      getUserName(customerId)
      .then((res)=>{
        this.setState({
          name: res.data[0].name
        })
      })
      .catch((error)=>{
        console.log("error", error)
      })
    }
  }

  handleLogOut(){
    localStorage.removeItem('customerId')
    localStorage.removeItem('userId')
    sessionStorage.removeItem('role')
    localStorage.clear();
  }
  render() {
    // console.log('GGGGGGGGGGGGGGGG', this.props.header, this.props.userTest)
    let userOptionsPopover = (
      <Popover  id="popover-trigger-click-root-close"
        style={{marginTop:'15px', maxWidth:"600px", borderRadius: "0px"}}
        placement="bottom">
          <div><a onClick={this.handleLogOut.bind(this)} href='/app/login'><span style={{fontSize: 11}} className="glyphicon glyphicon-log-out"></span>&nbsp;&nbsp;Log Out</a></div>
      </Popover>
    )
    return (
        <header>
          <div className='headerWrapper'>

            <div className='heading'><h3>{this.props.header}</h3></div>
            {this.props.header.indexOf("Admin") == -1 ?
            <div className='portalLink'><a href='/app/login' target="_blank">Log In</a></div>
            :
            <div className='adminIcon' style={{flexDirection: 'inherit'}}>
              <span>
                <svg width="34px" height="34px" viewBox="1417 23 34 34" version="1.1">
                  <g id="Group-3" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" transform="translate(1418.000000, 27.000000)">
                      <circle id="Oval-6" stroke="#FFFFFF" fill-opacity="0.3" fill="#D8D8D8" cx="16" cy="16" r="16"></circle>
                      <path d="M19.1550404,24.4269952 L19.1550404,23.908489 C20.2184177,22.9721469 21.1074011,21.6255463 21.5338154,20.0483782 C21.5423224,20.0483782 21.6125053,20.0527081 21.6220757,20.0527081 C22.9353467,20.0527081 23.2735006,17.2761562 23.2735006,16.8604853 C23.2735006,16.4458968 23.3245427,14.785378 21.9953211,14.785378 C24.8536793,6.88330043 17.2888133,3.71380958 11.6029349,7.76227126 C9.25818801,7.76227126 9.07316036,11.2738247 9.93449596,14.785378 C8.60740111,14.785378 8.66163335,16.4458968 8.66163335,16.8604853 C8.66163335,17.2761562 8.96788601,20.0527081 10.2822203,20.0527081 C10.2843471,20.0527081 10.410889,20.0505432 10.4130157,20.0505432 C10.8383667,21.6201339 11.7113994,22.9613222 12.7747767,23.8987467 L12.7747767,24.4269952 C12.7747767,25.3048836 12.6503615,26.7045255 8.33943003,27.4990632 C7.4281157,27.666847 6.61675883,27.9850951 6,28.3823639 C8.74032327,30.6414921 12.1952361,32 15.9957465,32 C19.7930668,32 23.2607401,30.6436571 26,28.3888588 C25.3864313,27.9937549 24.5059549,27.6733419 23.604211,27.4990632 C19.3049766,26.6623089 19.1550404,25.3048836 19.1550404,24.4269952" id="Fill-1" fill="#FFFFFF"></path>
                  </g>
                </svg>
              </span>
              <span style={{fontSize: '20px', fontStyle: 'Italic', paddingTop:6}}>{' '} &nbsp;&nbsp;Hi {this.props.header === 'Cavirin Admin Portal'?'Admin':this.state.name}&nbsp;!
                <OverlayTrigger trigger="click" rootClose placement="bottom" overlay={userOptionsPopover}>
                    <Glyphicon style={{fontSize: '12px', marginLeft:"50px", marginRight:"50px", cursor:'pointer'}}
                      ref="targetUser" glyph="menu-down">
                    </Glyphicon>
                </OverlayTrigger>
              </span>
            </div>
            /*<div className='adminIcon'>
              <span className="glyphicon glyphicon-user"></span>
              <div><a onClick={this.handleLogOut.bind(this)} href='/app/login'><span style={{fontSize: 11}} className="glyphicon glyphicon-log-out"></span>&nbsp;&nbsp;Log Out</a></div>
            </div>*/
          }
          </div>
        </header>
    );
  }
}
