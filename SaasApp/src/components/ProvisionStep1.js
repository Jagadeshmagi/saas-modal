import React, { Component } from 'react';
import {Button} from 'react-bootstrap';
import Slider, { Range } from 'rc-slider';

class ProvisionStep1 extends Component {

  constructor(props){
    super(props);
    this.state={
      infrastructureSize:[3,10],
      industryType:[],
      complianceFramework:[],
      infastructureType:[],
      noOfDailyAssessments:[2,6],
      industryTypeOptionsList:[
        {label:'Healthcare', value:'Healthcare'},
        {label:'Financial Services', value:'Financial Services'},
        //{label:'Goverment', value:'Goverment'},
        //{label:'Consulting', value:'Consulting'},
        //{label:'Food', value:'Food'},
        //{label:'Energy', value:'Energy'},
        {label:'Retail', value:'Retail'},
        {label:'Other', value:'Other'},
      ],
      complianceFrameworkOptionsList:[
        {label:'AWS Hardening', value:'AWS Hardening'},
        {label:'NIST', value:'NIST'},
        {label:'CIS', value:'CIS'},
        {label:'PCI', value:'PCI'},
      ],
      infastructureTypeOptionsList:[
        //{label:'Hybrid', value:'Hybrid'},
        {label:'GCP', value:'GCP'},
        {label:'AWS', value:'AWS'},
        {label:'Azure', value:'Azure'},
        {label:'OnPrem', value:'OnPrem'},
      ],
    }
  }

  handleInfrastructure(e){
    this.setState({infrastructureSize:e})
  }
  handleDailyAssessments(e){
    this.setState({noOfDailyAssessments:e})
  }
  industryTypeHandle(e){
    const index = this.state.industryType.indexOf(e.target.value)
    let newList = this.state.industryType.slice()
    if (index === -1)
    {
      newList = newList.concat(e.target.value)      
    } else {
      newList.splice(index,1);
    }
    this.setState({industryType:newList})
  }

  complianceFrameworkHandle(e){
    const index = this.state.complianceFramework.indexOf(e.target.value)
    let newList = this.state.complianceFramework.slice()
    if (index === -1)
    {
      newList = newList.concat(e.target.value)      
    } else {
      newList.splice(index,1);
    }
    this.setState({complianceFramework:newList})
  }

  infastructureTypeHandle(e){
    const index = this.state.infastructureType.indexOf(e.target.value)
    let newList = this.state.infastructureType.slice()
    if (index === -1)
    {
      newList = newList.concat(e.target.value)      
    } else {
      newList.splice(index,1);
    }
    this.setState({infastructureType:newList})
  }

  handleContinue(e){
    let preferencesObj = {}
    preferencesObj.infrastructureSize = this.state.infrastructureSize;
    preferencesObj.industryType = this.state.industryType;
    preferencesObj.complianceFramework = this.state.complianceFramework;
    preferencesObj.infastructureType = this.state.infastructureType;
    preferencesObj.noOfDailyAssessments = this.state.noOfDailyAssessments;
    
    this.props.saveStep1(preferencesObj)
    
    console.log('Question1 Ans: ', this.state.infrastructureSize + '\n' + 'Question2 Ans: ', this.state.industryType + '\n' + 'Question3 Ans: ', this.state.complianceFramework + '\n' + 'Question4 Ans: ', this.state.infastructureType + '\n' + 'Question5 Ans: ', this.state.noOfDailyAssessments + '\n' )
    console.log(JSON.stringify(this.state.industryType))
  }

  render() {
    var marksList = {'0':'0K', '2':'2K', '4':'4K', '6':'6K', '8':'8K','10':'10K','12':'12K','14':'14K'}
    var marksDailyAsset = {'0':'0', '2':'2', '4':'4', '6':'6', '8':'8','10':'10'}
    return (
      <div>
        <h4>SELF - SERVICE PROVISIONING STEP 1</h4>
        <div className="row cotainerClass" style={{marginBottom:30}}>
          <div className='col-lg-3'>
          </div>
          <div className='col-lg-6'>
            <h5>QUESTIONNAIRE</h5>
            {/********* Question 1 *********/}
            <div id='Q1'>
              <p>1. How big is your infrastructure</p>
              <div style={{margin: '31px 0 35px 22px'}}>               
                <Range marks={marksList} min={0} max={14} defaultValue={[3, 10]} tipFormatter={value => `${value}%`} onChange={this.handleInfrastructure.bind(this)}/>
              </div>
            </div>

            {/********* Question 2 *********/}
            <div id='industryType'>
              <p>2. What is your industry? (multiple selections)</p>
              <div>
                <div className='checkboxRow' id="checkboxes">
                  {
                    this.state.industryTypeOptionsList.map((val,key)=>{
                      var label = val.label
                      return (<div key={key}>
                      <input type='Checkbox' className='inputStyle' id={key} value={label} name={label} onChange={this.industryTypeHandle.bind(this)}/>
                      <label className="checkboxStyle" style={{fontWeight:'500'}} htmlFor={key} title={label}>&nbsp;&nbsp;{label}</label></div>
                      );
                    
                    })
                  }
                </div>
              </div>              
            </div>

            {/********* Question 3 *********/}
            <div id='complianceFramework'>
              <p>3. Security and Compliance framework (multiple selections)</p>
              <div>
                <div className='checkboxRow' id="checkboxes">
                  {
                    this.state.complianceFrameworkOptionsList.map((val,index)=>{
                      var label = val.label
                      return (<div key={index}>
                      <input type='Checkbox' className='inputStyle' id={'compliance'+index} value={label} name={label} onChange={this.complianceFrameworkHandle.bind(this)}/>
                      <label className="checkboxStyle" style={{fontWeight:'500'}} htmlFor={'compliance'+index} title={label}>&nbsp;&nbsp;{label}</label></div>
                      );
                    
                    })
                  }
                </div>
              </div>
            </div>

            {/********* Question 4 *********/}
            <div id='infastructureType'>
              <p>4. Deployment type? (multiple selections)</p>

              <div>
                <div className='checkboxRow' id="checkboxes">
                  {
                    this.state.infastructureTypeOptionsList.map((val,index)=>{
                      var label = val.label
                      return (<div key={index}>
                      <input type='Checkbox' className='inputStyle' id={'infastructure'+index} value={label} name={label} onChange={this.infastructureTypeHandle.bind(this)}/>
                      <label className="checkboxStyle" style={{fontWeight:'500'}} htmlFor={'infastructure'+index} title={label}>&nbsp;&nbsp;{label}</label></div>
                      );
                    
                    })
                  }
                </div>
              </div>
            </div>

            {/********* Question 5 *********/}
            <div id='noOfDailyAssessments'>
              <p>5. Number of daily assesments?</p>
              <div style={{margin: '31px 0 35px 22px'}}>               
                <Range marks={marksDailyAsset} min={0} max={10} defaultValue={[2, 6]} tipFormatter={value => `${value}%`} onChange={this.handleDailyAssessments.bind(this)}/>
              </div>
            </div>

            {/********* Continue button *********/}
            <div>
              <Button className='continueButton' onClick={this.handleContinue.bind(this)}>Continue</Button>
            </div>
          </div>
          <div className='col-lg-3'>
          </div>
        </div>
      </div>
    );
  }
}

export default ProvisionStep1;