import React from 'react';
import {Modal, Button} from 'react-bootstrap'

export default class CustomerServiceLogs extends React.Component {
  constructor(props) {

    super(props);

    this.state = {
      showLogsModal: false,
      searchText:''
    };
  }

  getLogs(){
    let customerId = this.props.customer.customerid;
    let searchText = this.state.searchText;
  }

  handleSearchTextChange(e){
    this.setState({searchText:e.target.value})
  }

  clearSearch(){
    this.setState({searchText:''})
    this.getLogs()
  }

  closeModal() {
    this.setState({showLogsModal: false});
  }

  openModal(){
    this.getLogs();
    this.setState({showLogsModal: true });
  }

  render() {
    return (
    <div>
      <div style={{display:'flex', color: '#4e5ba4', marginTop: 3}}>
        <div style={{cursor:'pointer'}} onClick={this.openModal.bind(this)}>
          VIEW LOGS
        </div>
      </div>
      <Modal
        show={this.state.showLogsModal}
        onHide={this.closeDelete}
        aria-labelledby="contained-modal-title"
        className="modal fade right logData"
        >
        <form style={{border: '1px solid Navy'}}>
        <Modal.Header style={{marginRight:15,borderBottom:0}}>
          <a href="javascript:void(0)" className='closebtn' onClick={this.closeModal.bind(this)} show={true} onHide={this.closeModal} backdrop='static'>
            &#x2715;
          </a>
        </Modal.Header>
        <Modal.Body>

        <div style={{marginLeft:'15px',marginRight:'15px',height:'450px'}}>
          <div style={{marginTop: 30,marginBottom: 30, display: 'flex'}}>
           <div style={{position:'relative'}}>
             <input style={{width:300, height:31, padding:5}} value={this.state.searchText} type="text" id="searchText" name='searchText' onChange={this.handleSearchTextChange.bind(this)} placeholder='Search Logs' />
             <span className='inputClose' onClick={this.clearSearch.bind(this)}>x</span>
           </div>
           <div>
             <Button className='modalButton modalButtonSucess' onClick={this.getLogs.bind(this)}>Search </Button>
           </div>
          </div> 
          <h1> Log Data </h1>
        </div>
        </Modal.Body>
        </form>
      </Modal>
    </div>     
    );
  }
}