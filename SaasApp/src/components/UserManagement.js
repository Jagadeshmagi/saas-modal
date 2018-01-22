import React from 'react';
import {Table, Column, Cell} from 'fixed-data-table';
import {Button, Modal} from 'react-bootstrap'
import moment from 'moment'
import AddUser from './AddUser'
import DeleteUser from './DeleteUser'
import SuspendUser from './SuspendUser'
import {getUserTable} from '../helpers/users'
// import Loader from '../static/img/loading.gif'


export default class UserManagement extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      customerId:5,
      tableData:[],
      selectedUserList:[]
    }

  }

  componentDidMount(){
    getUserTable(this.state.customerId)
    .then((responce) =>  {
      console.log('All Users List', responce)
      this.setState({tableData:responce.data})
    })
    .catch((error) => console.log("Error in Getting User Derails"))
  }

  handleCheckbox(e){
    var userList=this.state.selectedUserList
    var inputId = parseInt(e.target.id)
    var index = userList.indexOf(inputId);

    if(userList.indexOf(inputId) == -1){
      userList.push(inputId)
    }else{
      userList.splice(index, 1);      
    }
    
    this.setState({selectedUserList:userList},function(){console.log('UUU',this.state.selectedUserList)})
  }

  refreshTable(){
    this.setState({tableData:[]},function(){
      getUserTable(this.state.customerId)
      .then((responce) =>  {
        this.setState({tableData:responce.data, selectedUserList:[]})

      })
      .catch((error) => console.log("Error in Getting User Derails"))
    })
  }

  render() {
    const rows = this.state.tableData
    if(this.state.tableData.length>0){
    return (
      <div id='UserManagWrap'>
        <div className='row oprations'>
          <AddUser userList={this.state.selectedUserList} refreshTable={this.refreshTable.bind(this)}/><span>&nbsp;|&nbsp;</span>
          {this.state.selectedUserList.length > 0 ? 
          <div className='selectOperations'>
            <SuspendUser suspendUserList={this.state.selectedUserList} refreshTable={this.refreshTable.bind(this)} />
            <DeleteUser deleteUserList={this.state.selectedUserList} refreshTable={this.refreshTable.bind(this)} />
          </div>
          :''}
        </div>
        <div className='row'>
          <div className='tableWrapper'>
            <Table
              rowHeight={50}
              rowsCount={this.state.tableData.length}
              width={1140}
              height={400}
              margin={'0 auto'}
              headerHeight={50}>
              <Column
                header={<Cell></Cell>}
                cell={({rowIndex}) => (
                  <Cell>
                    <div className='inputStyle4'>
                    <input className='chkAll' type="checkbox" id={this.state.tableData[rowIndex].id} value="on" onChange={this.handleCheckbox.bind(this)} /><label htmlFor={this.state.tableData[rowIndex].id}></label>
                    {/*<input className='chkAll' type='checkbox' id={this.state.tableData[rowIndex].id} value={this.state.tableData[rowIndex].id} onChange={this.handleCheckbox.bind(this)}/>*/}
                    </div>
                  </Cell>
                )}
                width={40}
              />

              <Column
                header={<Cell>USER NAME</Cell>}
                cell={({rowIndex}) => (
                  <Cell>
                    {this.state.tableData[rowIndex].first_name+' '+this.state.tableData[rowIndex].last_name}
                  </Cell>
                )}
                width={220}
              />
              <Column
                header={<Cell>EMAIL</Cell>}
                cell={({rowIndex}) => (
                  <Cell>
                    {this.state.tableData[rowIndex].email}
                  </Cell>
                )}
                width={220}
              />
              <Column
                header={<Cell>CREATED (UTC)</Cell>}
                cell={({rowIndex}) => {
                let createdTime = this.state.tableData[rowIndex].created
                if(createdTime === null || createdTime === "null" || createdTime=== undefined)
                  createdTime = '-';
                else{
                  createdTime = moment.utc(createdTime,"YYYY/MM/DD @ HH:mm TZD").format('MM[/]DD[/]YYYY [@] HH[:]mm');
                }
                return(
                <Cell>
                  {createdTime}
                </Cell>
                )}}
                width={220}
              />
              <Column
                header={<Cell>LAST TIME LOGIN (UTC)</Cell>}
                cell={({rowIndex}) => {
                let loginTime = this.state.tableData[rowIndex].lastlogin
                if(loginTime === null || loginTime === "null" || loginTime=== undefined)
                  loginTime = '-';
                else{
                  loginTime = moment.utc(loginTime,"YYYY/MM/DD @ HH:mm TZD").format('MM[/]DD[/]YYYY [@] HH[:]mm');
                }
                return(
                <Cell>
                  {loginTime}
                </Cell>
                )}}
                width={220}
              />
              <Column
                header={<Cell>STATUS</Cell>}
                cell={({rowIndex}) => (
                  <Cell>
                    {this.state.tableData[rowIndex].status}
                  </Cell>
                )}
                width={220}
              />
            </Table>
          </div>
        </div>
      </div>
    );
  }
  else
  {
    return (
      <div id='UserManagWrap'>
        <div className='row oprations'>
          <AddUser userList={this.state.selectedUserList} refreshTable={this.refreshTable.bind(this)}/><span>&nbsp;|&nbsp;</span>
        </div>
      </div>
    )
  }
  }
}