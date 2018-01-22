import React from 'react';
import {getMaintenance} from '../../helpers/admin'

export default class ServiceMessages extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // messageList:["omgg, the sky is falling", "all is well", "maintenance schedule for dev 2090. we apologize for the inconvenience"]
      messageList:[]
    };
  }

  componentDidMount(){
    // this.getServiceMessages();
    getMaintenance()
    .then((res)=>{
      console.log("fasdfa", res, res.data)
      let messages = []
      for(var i = 0; i < res.data.length; i++){
        messages.push(res.data[i].emailtype)
      }
      this.setState({messageList:messages})
    })
    .catch((error)=>{
      console.log("getMaintenance error ", error)
    })
  }

  getServiceMessages(){
    getMaintenance()
    .then((res)=>{
      console.log("fasdfa", res, res.data)
      this.setState({messageList:res.data})

      // this.setState({
      //   messageList:res.data
      // })
    })
    .catch((error)=>{
      console.log("getMaintenance error ", error)
    })
  }

  render() {
    let spanStyle = {fontSize:'20px',color:'#4C58A4',fontWeight:500, marginTop:100}
    if (this.state.messageList.length > 0){
      return (
        <div>
          <div style={spanStyle}>
            Upcoming Maintenance
          </div>
          <div style={{marginTop:30}}>
            <ul>
            {this.state.messageList.map((message) =>
              {
                return (
                    <div style={{marginTop:'5px'}}>
                      {message}
                    </div>
                )
              }
            )}
            </ul>
          </div>
        </div>
      )
    } else {
      return (
        <span></span>
      )
    }
  }
}
