// import React from 'react';
// import { Link } from 'react-router'
// import {Row, Col} from 'react-bootstrap';
// import {toggleHelpscreen} from './../../helpers/admin'
//
// export default class Help extends React.Component {
//
//   constructor(props) {
//     super(props);
//     this.state = {
//       help: "true"
//     };
//   }
//
//   componentDidMount(){
//     let current = localStorage.getItem("helpToggle");
//     this.setState({
//       help: current
//     })
//   }
//
//   setHelp(){
//     let current = localStorage.getItem("helpToggle");
//     let customerId = localStorage.getItem("customerId");
//     let newBool;
//     if (current === "true"){
//       newBool = "false";
//     } else {
//       newBool = "true";
//     }
//     toggleHelpscreen(customerId, newBool)
//     .then((res)=>{
//       localStorage.setItem("helpToggle", newBool);
//       this.setState({
//         help: newBool
//       })
//       // console.log("toggleHelpscreen success ", res)
//     })
//     .catch((error)=>{
//       console.log("toggleHelpscreen error ", error)
//     })
//   }
//
//   render() {
//     console.log("this.state.help", this.state.help)
//   	let boxStyle = {
// 		 width: 300,
// 		 height: 150,
// 		 backgroundColor: '#4f81bd',
// 		 color:'white',
// 		 borderRadius: 20,
// 		 display: 'inline-block',
// 		 margin: '30px 30px 30px 30px',
// 		 textAlign: 'center',
//      paddingTop: "65px",
//      paddingBottom: "65px"
// 	}
//     return (
//       <div>
//    	   <Row style={{marginTop: 70}}>
//         <Col lg={3} sm={6}>
//           <a target="_blank" href="https://cavirin.com/">
//              <div style={boxStyle}>Getting Started</div>
//           </a>
//         </Col>
//         <Col lg={3} sm={6}>
//           <a target="_blank" href="https://cavirin.com/">
//              <div style={boxStyle}>Quick start</div>
//           </a>
//         </Col>
//         <Col lg={3} sm={6}>
//           <a target="_blank" href="https://cavirin.com/">
//              <div style={boxStyle}>Documentation</div>
//           </a>
//         </Col>
//         <Col lg={3} sm={6}>
//           <a target="_blank" href="https://cavirin.com/">
//              <div style={boxStyle}>Whats New?</div>
//           </a>
//         </Col>
//        </Row>
//        <Row>
//          <Col style={{textAlign:"center", marginLeft:"-60"}}>
//            <input type='Checkbox' className='inputStyle' id="help" value="helpLabel" name="helpLabel" checked={this.state.help=="true"?false:true} onChange={this.setHelp.bind(this)}/>
//            <label className="checkboxStyle" style={{fontWeight:'500'}} htmlFor="help" title="helpLabel">
//              &nbsp;&nbsp;Switch default tab to Service Status when I login
//            </label>
//          </Col>
//        </Row>
//       </div>
//     );
//   }
// }


import React from 'react';
import { Link } from 'react-router'
import {Row, Col} from 'react-bootstrap';
import {toggleHelpscreen} from './../../helpers/admin'

export default class Help extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      help: "true"
    };
  }

  componentDidMount(){
    let current = localStorage.getItem("helpToggle");
    this.setState({
      help: current
    })
  }

  setHelp(){
    let current = localStorage.getItem("helpToggle");
    let customerId = localStorage.getItem("customerId");
    let newBool;
    if (current === "true"){
      newBool = "false";
    } else {
      newBool = "true";
    }
    toggleHelpscreen(customerId, newBool)
    .then((res)=>{
      localStorage.setItem("helpToggle", newBool);
      this.setState({
        help: newBool
      })
      // console.log("toggleHelpscreen success ", res)
    })
    .catch((error)=>{
      console.log("toggleHelpscreen error ", error)
    })
  }

  render() {
    console.log("this.state.help", this.state.help)
  // 	let boxStyle = {
	// 	 width: 300,
	// 	 height: 150,
	// 	 backgroundColor: '#4f81bd',
	// 	 color:'white',
	// 	 borderRadius: 20,
	// 	 display: 'inline-block',
	// 	 margin: '30px 30px 30px 30px',
	// 	 textAlign: 'center',
  //    paddingTop: "65px",
  //    paddingBottom: "65px"
	// }

    let boxStyle = {display: 'flex', justifyContent: 'center', fontSize:"26"}
    return (
      <div>
   	   <Row style={{marginTop: 150}}>
        <Col lg={12}>
          <div style={boxStyle}>
            <a target="_blank" href="https://cavirin.com/">
              Getting Started
            </a>
          </div>
        </Col>
        <Col lg={12}>
        <div style={boxStyle}>
          <a target="_blank" href="https://cavirin.com/">
            Quick Start
          </a>
        </div>
        </Col>
        <Col lg={12}>
        <div style={boxStyle}>
          <a target="_blank" href="https://cavirin.com/">
            Documentation
          </a>
        </div>
        </Col>
       </Row>
       <Row>
         <Col style={{textAlign:"center", marginTop:"50", fontSize:"26"}}>
           <input type='Checkbox' className='inputStyle' id="help" value="helpLabel" name="helpLabel" checked={this.state.help=="true"?false:true} onChange={this.setHelp.bind(this)}/>
           <label className="checkboxStyle" style={{fontWeight:'500'}} htmlFor="help" title="helpLabel">
             &nbsp;&nbsp;Switch default tab to Service Status when I login
           </label>
         </Col>
       </Row>
      </div>
    );
  }
}
