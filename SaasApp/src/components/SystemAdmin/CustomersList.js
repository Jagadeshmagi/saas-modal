import React from 'react'
import {Button, Popover, OverlayTrigger, Glyphicon} from 'react-bootstrap'
import {Table, Column, Cell} from 'fixed-data-table'
import moment from 'moment'
import {getSaaSCustomersList} from '../../helpers/systemAdmin'
import RemoveCustomer from './RemoveCustomer'
import AddCustomer from './AddCustomer'
import CustomerServiceStatus from './CustomerServiceStatus'
import Subscription from './Subscription'
import ColumnChooserClass from './ColumnChooserCell'

export function findElement(arr, propName, propValue) {

  let obj  = null;
  for (let i=0; i < arr.length; i++)
    if (arr[i][propName] === propValue)
      obj = arr[i];
  return obj
}

export default class CustomersList extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      customersList:[],
      totalCustomersCount:0,
      selectedCustomerId:[],
      selectedCustomer:{},
      selectAll:false,
      showDetails:'', // values can be 'SERVICE_STATUS','ADD_CUSTOMER','SUBSCRIPTION','USAGE','BILLS'
      addCustomerFields:false,
      searchText:'',
      entid:'',
      showEditSub:true,
      columnsList:[
        {name:'companyname', displayText:'Company', show:true, columnName: "COMPANY NAME", width:200},
        {name:'salesforcecustomerid', displayText:'Salesforce ID', show:false, columnName: "SALESFORCE ID", width:200},
        {name:'plan', displayText:'Edition', show:false, columnName: "EDITION", width:150,},
        {name:'subtype', displayText:'Subscription Type', show:true,  columnName: "SUBSCRIPTION TYPE", width:210},
        {name:'instance_status', displayText:'Service Status', show:true, columnName: "SERVICE STATUS", width:220},
      ],
      columnChooserShow:false,
      tableWidth:1080,
      minTableWidth:850,
      searchInstruction:'Press enter or click on icon to search'
    }

  }

  updateDimensions() {
    if(window.innerWidth < 800) {
      this.setState({ tableWidth: 710 });
    } else if(window.innerWidth < 1600) {
      let update_width  = window.innerWidth - 240
      console.log('window.innerWidth', window.innerWidth)
      console.log('update_width', update_width)
      this.setState({ tableWidth: update_width, minTableWidth:update_width - 350});
    }else {
      let update_width  = window.innerWidth - 225
      console.log('window.innerWidth', window.innerWidth)
      console.log('update_width', update_width)
      this.setState({ tableWidth: update_width, minTableWidth:update_width- 455});
    }
  }

  componentDidMount(){
    this.getCustomerList()
    this.updateDimensions();
    window.addEventListener("resize", this.updateDimensions.bind(this));
    let columnsList = localStorage.getItem("CustomersTableSettings")?JSON.parse(localStorage.getItem("CustomersTableSettings")):this.state.columnsList;
    this.setState({columnsList:columnsList})    
  }

  twitterFunction(d,s,id){
    var js,fjs=d.getElementsByTagName(s)[0];
    var p=/^http:/.test(d.location)?'http':'https';
    if(!d.getElementById(id)){
      js=d.createElement(s);
      js.id=id;js.src=p+"://platform.twitter.com/widgets.js";
      fjs.parentNode.insertBefore(js,fjs);
    }}(document,"script","twitter-wjs");
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions.bind(this));
  }

  getCustomerList(){
    getSaaSCustomersList(this.state.searchText)
    .then((res) =>  {
      this.setState({selectedCustomerId:[],customersList:res.data,totalCustomersCount:res.totalcount})
    })
    .catch((error) => console.log("Error in Getting Customers List"))
  }

  handleSearchKeyUp(e){
    let separators = ['Enter','\n','\r'];
    if (separators.indexOf(e.key) > -1) {
      this.search()
    }
  }

  clearSearch(){
    searchTextInput.value = ''
    this.setState({searchText:''},()=>{
      this.getCustomerList()
    })
  }

  search(){
    this.setState({searchText:searchTextInput.value},() => {
      this.getCustomerList()
    })
  }

  showServiceStatus(){
    if(this.state.selectedCustomerId.length > 0){
      let customerObj = findElement(this.state.customersList,'customerid',this.state.selectedCustomerId[0].toString())
      // alert(JSON.stringify(customerObj))
      this.setState({selectedCustomer:customerObj,showDetails:'SERVICE_STATUS',columnChooserShow:false})
    }
  }

  showSubscription(){
    if(this.state.selectedCustomerId.length > 0){
      let customerObj = findElement(this.state.customersList,'customerid',this.state.selectedCustomerId[0].toString())
      // alert(JSON.stringify(customerObj))
      this.setState({selectedCustomer:customerObj,showDetails:'SUBSCRIPTION',columnChooserShow:false, entid:customerObj.entid})
    }
  }

  closeDetails(){
    this.setState({showDetails:'',columnChooserShow:true})
  }

  refreshTable(){
    window.location.reload()
    // this.getCustomerList()
  }

  refreshList(){
    this.getCustomerList()
  }

  selectAllHandler(){
    this.setState({selectAll:!this.state.selectAll}, function(){
      if(this.state.selectAll === true){
       getSaaSCustomersList(this.state.searchText)
       .then((res) =>  {
        let selectList = [];
        res.data.map((customer) => {
          selectList.push(parseInt(customer.customerid))
        })
        this.setState({customersList:res.data,selectedCustomerId:selectList});
       })
       .catch((error) => console.log("Error in Getting Customers List:" + error))
      }else{
        this.setState({selectedCustomerId: []})
      }
    })
  }

  handleCheckbox(e){
    let customerList=this.state.selectedCustomerId
    let inputId = parseInt(e.target.id)
    let index = customerList.indexOf(inputId);

    if(customerList.indexOf(inputId) == -1){
      customerList.push(inputId)
    }else{
      customerList.splice(index, 1);
    }

    var currentSelectedId = e.target.id
    this.state.customersList.map((val,key)=>{
      if(val.customerid == e.target.id){
        if(val.instance_status == 'Terminated'){
          this.setState({showEditSub:false})
        }else{
          this.setState({showEditSub:true})
        }
      }
    })

    this.setState({selectedCustomerId:customerList}, function(){
      console.log('customerid List', this.state.selectedCustomerId)
      if(this.state.selectedCustomerId.length === 0){
        this.setState({showDetails:''});
      }
    })
  }

  handleAddCustomerBtn(){
    this.setState({showDetails:"ADD_CUSTOMER",columnChooserShow:false, addCustomerFields:true})
  }

  handleClose(e){
    if(this.state.showDetails === 'ADD_CUSTOMER'){
      this.setState({addCustomerFields:false})
    }
    if(!this.state.showDetails==''){
      this.setState({showDetails:'',columnChooserShow:true})
    }
  }

  getTableColumn(colObj){
    const rows = this.state.customersList
    if(colObj != null && colObj["show"]){
      switch(colObj.name){
        case 'companyname' :
          return <Column
                header={<Cell>{colObj.columnName}</Cell>}
                cell={({rowIndex}) => (
                  <CompanyNameTooltip
                  showDetails = {this.state.showDetails}
                  data={this.state.customersList}
                  rowIndex={rowIndex}
                  col="details"/>
                )}
                width={this.state.showDetails == '' ? (this.state.tableWidth-100) / 3: colObj['width']} />
        case 'salesforcecustomerid' :
          return <Column
                header={<Cell>{colObj.columnName}</Cell>}
                cell={({rowIndex}) => (
                  <Cell>
                    {rows[rowIndex].salesforcecustomerid}
                  </Cell>
                )}
                width={colObj['width']}
              />
        case 'plan' :
          return <Column
                header={<Cell>{colObj.columnName}</Cell>}
                cell={({rowIndex}) => (
                  <Cell>
                    {/*{rows[rowIndex].plan}*/}
                    {'Cavirin core'}
                  </Cell>
                )}
                width={colObj['width']}
              />
        case 'subtype' :
          return <Column
                header={<Cell>{colObj.columnName}</Cell>}
                cell={({rowIndex}) => (
                  <Cell>
                    {rows[rowIndex].subtype}
                  </Cell>
                )}
                width={this.state.showDetails == '' ? (this.state.tableWidth-100) / 3 : colObj['width']}
              />
        case 'instance_status' :
          return <Column
                header={<Cell>{colObj.columnName}</Cell>}
                cell={({rowIndex}) => (
                  <Cell>
                    {rows[rowIndex].instance_status}
                  </Cell>
                )}
                width={this.state.showDetails == '' ? (this.state.tableWidth-100) / 3 : colObj['width']}
              />
      }
    }
  }

  columnDisplayChangeHandler(colName){
    //var columnsList = this.state.columnsList;
    var columnsList = localStorage.getItem("CustomersTableSettings")?JSON.parse(localStorage.getItem("CustomersTableSettings")):this.state.columnsList;
    let newColumnsList = [];
    columnsList.forEach(function(col){
      if(col.name === colName){
        col.show = !col.show;
        newColumnsList.push(col);
      }
      else{
        newColumnsList.push(col);
      }
    })

    this.setTable(newColumnsList)
    localStorage.setItem("CustomersTableSettings", JSON.stringify(newColumnsList))

  }

  setTable(newColumnsList){
    let tWidth = 80
    newColumnsList.forEach(function(col){
      if(col.show){
        tWidth = tWidth + col.width
      }
    })
    // this.setState({columnsList:newColumnsList,tableWidth:tWidth})
    this.setState({columnsList:newColumnsList})
  }

  columnChooserToggle() {
    setTimeout(function(){
      let popoverElement = document.getElementById('popover-trigger-click-root-close')
      let popOverChild = popoverElement.firstChild
    },10)
    this.setState({ columnChooserShow: !this.state.columnChooserShow });
  }

  render() {
    let dataList = this.state.customersList
    let selectedList=this.state.selectedCustomerId
    const heightAuto = this.state.customersList.length * 55 + 60
    let seperatorDivStyle=this.state.showDetails !== '' ?{width:'17px',minHeight:430,height: this.state.showDetails === 'ADD_CUSTOMER' ? 800 : 420,margin:'0 10px',background:'linear-gradient(to left, #F9FAFC, #b4bcca)',
                          position:'absolute','left':-25,zIndex:99,'top':0,'opacity':'0.4'}: {display:'none'}
    // console.log('HHHHHHHHHHHHHh', document.getElementById('myId').height)
    const searchInstruction = ( <Popover style={{color: 'black',borderWidth: 1,borderRadius:0,minWidth:220,height:40,display:this.state.searchText =='' ? 'block': 'none' }}>{this.state.searchInstruction}</Popover> )

    return (
        <div style={{marginLeft:50}}>
        <div style={{margin:'35px 60px 25px 0', display: 'flex', justifyContent: 'space-between'}}>
            <OverlayTrigger ref="searchBox" placement="top" overlay={searchInstruction}>
              <div style={{position:'relative'}}>
                <input style={{width:600, height:40, padding:'5px 5px 5px 35px'}} type="text" id="searchTextInput" name='searchTextInput'
                onKeyUp={this.handleSearchKeyUp.bind(this)}
                placeholder='Type company name to search' />
                <span className='inputClose' onClick={this.clearSearch.bind(this)}>x</span>
                <span onClick={this.search.bind(this)} className="glyphicon glyphicon-search" style={{position: 'absolute',left: 10, top: 15, cursor: 'pointer'}}></span>
              </div>
            </OverlayTrigger>
           {this.state.showDetails == 'ADD_CUSTOMER' ? '' :
              <div className='addCusBtn' onClick={this.handleAddCustomerBtn.bind(this)}>Add New Customer</div>
            }
        </div>
        <div className='row oprations' style={{minHeight:25}}>

          <div className='col-lg-9 tableWrapper' style={{padding:0,width:!this.state.showDetails == '' ? '45%' : '75%'}}>
            <div>
            {this.state.totalCustomersCount > 0?
            <span style={{color: '#337ab9', cursor:'auto'}}>
              {this.state.totalCustomersCount} {this.state.totalCustomersCount == 1? 'Customer':'Customers'}
            </span>
            :''
            }
            {this.state.selectedCustomerId.length == 1 ?
              <span>&nbsp;
              <span style={{color: '#337ab9', cursor:'auto'}}>
                View/Edit:
              </span>&nbsp;
              <a href='JavaScript: void(0)' onClick={this.showSubscription.bind(this)}> Subscription</a> |
              <a href='JavaScript: void(0)' onClick={this.showServiceStatus.bind(this)}> Service Status</a>
              {/*
               |
              <a href='JavaScript: void(0)'> Usage</a> |
              <a href='JavaScript: void(0)'> Bills </a>
             */}
              </span>
            :''}
            </div>
          </div>
          <div className='col-lg-3' style={{position:'relative', minHeight:30, margin: 0}}>
            <div style={{position: 'absolute', top:0, right:100, display: 'flex'}}>
              <span style={{display:'inline-block', margin:10}}>
                <a onClick={this.refreshList.bind(this)}> <Glyphicon style={{color:'#4e56a0', fontSize:"19"}} glyph="glyphicon glyphicon-refresh" /></a>
              </span>
              <ColumnChooserClass
                toggle={this.columnChooserToggle.bind(this)}
                columnShow={this.state.columnChooserShow}
                columnsList={this.state.columnsList}
                changeHandler={this.columnDisplayChangeHandler.bind(this)}
              />
            </div>
          </div>
        </div>

        <div className='row' style={{margin: '0 0 30px 0', display: 'flex', position:'relative'}}>
          <div className='col-lg-9 tableWrapper' style={{position:'relative',padding:0}}>
          <div className='tableWrapper tableCheckValue' style={{position:'relative',padding:0}}>
            <Table
              rowHeight={50}
              rowsCount={dataList.length}
              // width={!this.state.showDetails == '' ? 710 : 1080}
              width={!this.state.showDetails == '' ? this.state.minTableWidth : this.state.tableWidth}
              height={heightAuto}
              margin={'0 auto'}
              headerHeight={50}>
              <Column
                align="center"
                header={
                  <Cell>
                  <input type='checkbox' id="selectAllChk" className="chkAll"
                  checked={(dataList.length > 0 && selectedList.length === dataList.length)?true:false}
                  ref={input => {
                      if (input) {
                        input.indeterminate = (selectedList.length > 0 && selectedList.length < dataList.length)?true:false;
                      }
                    }}
                  onClick={this.selectAllHandler.bind(this)}/>
                  <label style={{marginTop:'10px'}} htmlFor="selectAllChk"></label>
                  </Cell>
                }
                cell={({rowIndex}) => (
                  <Cell>
                    <input type="checkbox" id={dataList[rowIndex].customerid}
                    checked={(selectedList.indexOf(parseInt(dataList[rowIndex].customerid)) != -1)?true:false}
                    onChange={this.handleCheckbox.bind(this)} />
                    <label htmlFor={dataList[rowIndex].customerid}></label>
                  </Cell>
                )}
                width={80}
                padding={'0 20px'}
              />
              {this.state.columnsList.map(function(columnObj){
                return this.getTableColumn(columnObj)
              }.bind(this))}
            </Table>
          </div>
          </div>

          <div className='col-lg-3 columnStyle'>
            <div className="seperator" style={seperatorDivStyle}></div>
            <div id='myId'>
            {(this.state.showDetails === 'SUBSCRIPTION')?
              <Subscription
                showEditSub={this.state.showEditSub}
                selectedCustomerId={this.state.selectedCustomerId}
                entid={this.state.entid}
                customer={this.state.selectedCustomer}
                refresh={this.refreshTable}
                handleClose={this.handleClose.bind(this)} />
              :''
            }

            {(this.state.showDetails === 'SERVICE_STATUS')?
              <CustomerServiceStatus
                customer={this.state.selectedCustomer}
                handleClose={this.handleClose.bind(this)}
                refresh={this.refreshTable}/>
              :''
            }

            {(this.state.showDetails === 'ADD_CUSTOMER')?
              <AddCustomer
                addCustomerFields={this.state.addCustomerFields}
                handleClose={this.handleClose.bind(this)}
                refreshTable ={this.refreshTable.bind(this)} />
              :''
            }
            </div>
          </div>
        </div>
        </div>
    );

  }
}

/************** TooltipCompanyName Component ************8*/
class CompanyNameTooltip extends React.Component {
  render() {
    // var partialCompName
    var count
    if(this.props.showDetails == ''){
      count = 30
    }else{count = 15}
    var fullCompanyName
    var companynameLength = this.props.data[this.props.rowIndex].companyname.length

    if(companynameLength>count){
      fullCompanyName = this.props.data[this.props.rowIndex].companyname.slice(0, count).concat('...')
    }else{
      fullCompanyName = this.props.data[this.props.rowIndex].companyname
    }
    const tooltipCompanyName = ( <Popover className='tableContent' style={{backgroundColor:'#4180be', color:'#fff', borderRadius: 3,orderWidth: 1,width:210,minHeight:35, display:companynameLength > count ? 'block':'none'}}>{this.props.data[this.props.rowIndex].companyname}</Popover> )
    return (
      <div>
        <OverlayTrigger ref="cName" placement="top" overlay={tooltipCompanyName}>
          <div style={{color:'#4C58A4', padding:8, fontSize:18}}>{fullCompanyName}</div>
        </OverlayTrigger>
      </div>
    );
  }
}
