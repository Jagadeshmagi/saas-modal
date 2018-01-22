import React from 'react';

export default class SubscriptionDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      edition:"Cavirin Core",
      subStatus:"Trial",
      subStartDate:"12/12/2017",
      subEndDate:"12/12/2018",
      container:"1000",
      hosts:"10,000"
    };
  }
  render() {
    let css = {
        oddRow : {
          backgroundColor:'#f9fafc',
          height:'50px',
          width:'100%',
          lineHeight:'50px' //++ To Adjust the text to align to the middle
        },
        evenRow:{
          backgroundColor:'#EDF2F8',
          height:'50px',
          lineHeight:'50px',
          width:'100%',
        },
        leftCol:{
          display:'inline-block',
          textAlign:'right',
          width:'20%',
          overflow:'hidden'
        },
        rightCol:{
          paddingLeft:'100px',
          display:'inline-block',
          width:'80%',
          overflow:'hidden'
        },
        column1:{
          backgroundColor:'#FFF',
          border:'2px solid #E5EAF4',
          margin:'0 40px',
          width:'33%',
          position:'relative'
        },
        column2:{
          backgroundColor:'#FFF',
          border:'2px solid #E5EAF4',
          margin:'0 40px',
          width:'33%',
          position:'relative'
        },
        column3:{
          backgroundColor:'#FFF',
          border:'2px solid #E5EAF4',
          margin:'0 40px',
          width:'33%',
          position:'relative'
        },
        columnWrapper:{
          display:'flex',
          justifyContent:'center',
          padding:'0 50px',
          margin:'30px 0 100px -50px'
        },

        //++++++++ Used for planning section +++++++++++++
        colHeading:{
          textAlign:'center',
          color:'#4C58A4',
          fontSize: '20px',
          fontWeight: 'bold',
          borderBottom: '0.5px solid #E5EAF4',
          padding: '0 0 0 0',
          height:'50px',
          lineHeight:'50px'
        },

        colContents:{
          height:'280px',
          padding:'20px 0px',
          minHeight:'400px',
          height:'auto',
          marginBottom: 120
        },

        colFooter:{
          textAlign:'center',
          //borderTop:'2px solid #E5EAF4',
          height:'120px',
          position:'absolute',
          bottom:0,
          left:0,
          right:0
        },

        footerDiv:{
          display: 'flex',
          justifyContent: 'space-between',
          flexDirection: 'column'
        }

      }
      let spanStyle = {fontSize:'20px',color:'#4C58A4',fontWeight:500}
      let packageDiv = {width:'100%',paddingTop:'20px'}
      let wrapperVersionAndSystemStyle = {marginLeft:'60px',marginRight:'75px',marginTop:'-25px'}
      let selectStyle = {marginLeft: '10px'}
      let billingTableWrapper = {marginLeft:'60px',marginRight:'75px',marginTop:'50px'}
        return (
          <div>
           <div style={{marginTop:'40px'}}>
            <div style={wrapperVersionAndSystemStyle}>
              <span style={spanStyle}>Edition: {this.props.edition}</span>
              <div style={{marginTop:'20px'}}></div>
              <div>
                 <div style={css.oddRow}>
                  <div style={css.leftCol}>Subscription Status:</div>
                  <div style={css.rightCol}>{this.props.subStatus}</div>
                 </div>
                 <div style={css.evenRow}>
                <div style={css.leftCol}>Subscription Start Date:</div>
                 <div style={css.rightCol}>{this.props.subStartDate}</div>
                 </div>
                 <div style={css.oddRow}>
                  <div style={css.leftCol}>Subscription End Date:</div>
                 <div style={css.rightCol}>{this.props.subEndDate}</div>
                 </div>
                 <div style={css.evenRow}>
                  <div style={css.leftCol}>Containers:</div>
                 <div style={css.rightCol}>{this.props.container}</div>
                 </div>
                 <div style={css.oddRow}>
                  <div style={css.leftCol}>Hosts/VMs:</div>
                 <div style={css.rightCol}>{this.props.hosts}</div>
                 </div>
                 </div>
                 </div>
              </div>
            </div>
        )
        }
    }
