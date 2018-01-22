import React from 'react'
import { Link } from 'react-router'
import Header from '../Header'
import AdminFooter from '../AdminFooter'
import {getExpDate, getSubscriptionDetailsByUser} from './../../helpers/admin'
import moment from 'moment';
import {ServiceIcon,SubscriptionIcon,HelpIcon} from '../common/MenuIcons'

export default class CustomerAdminMain extends React.Component {
  constructor(props) {

    super(props);
    this.state = {
      activeTab:'/app/admin/help',
      expiryDays:12,
      subtype:""
    };

    this.onItemClick = this.onItemClick.bind(this);
  }

  componentDidMount(){
    let help = localStorage.getItem("helpToggle")
    let activeTab;
    if (help != "true"){
      activeTab = "/app/admin/service";
      // let e = {target:{id:activeTab}}
      // this.ItemClick(e);
      this.setState({
        activeTab: activeTab,
        // instance_status:customerInfo.instance_status,
      })
    }



    let customerId = localStorage.getItem("customerId")
    this.getCustomerType(customerId);
    getExpDate(customerId)
    .then(res => {
      let customerInfo = res.data;
      var exp = new Date(customerInfo.enddate)
      var today = new Date(Date.now())
      console.log("exp, today", exp, today)
      let daysLeft = moment(exp).diff(today, 'days')
      this.setState({
        expiryDays:daysLeft + 1,
        // instance_status:customerInfo.instance_status,
      })
    }).catch((e) => {
      console.log("Error in getting the Company Info:"+JSON.stringify(e))
    })
  }

  getCustomerType(customerId){
    getSubscriptionDetailsByUser(customerId)
      .then((res)=>{
        this.setState({
          subtype:res.data.subtype
        })
      })
      .catch((error)=>{
        console.log("getSubscriptionDetailsByUser error ", error)
      })
  }

  onItemClick(e)  {
    let linkHref = e.target.id;
    let linkName = linkHref.substring(linkHref.indexOf("/app"));
    console.log("linkHref, linkName", linkHref, linkName)


    this.setState({ activeTab: linkName})
  }

  render() {
    let tabs = [
      {linkName:'/app/admin/service', displayName:'Service Status',icon:<ServiceIcon />},
      {linkName:'/app/admin/subscription', displayName:'Subscription Details',icon:<SubscriptionIcon />},
      {linkName:'/app/admin/help', displayName:'Help',icon:<HelpIcon />},
    ]
    let logoBackGround = {backgroundColor: '#00C484', paddingLeft: 0, height: 80}
    return (
      <div className="app-container">


        <table width='100%' >
          <tbody>
          <tr>
            <td style={{verticalAlign:'top'}}>
            <nav className="navContainer">
                <ul>
                  <li style={logoBackGround}><a href="javascript:void()">
                    <svg style={{align:'center'}}  width="60px" height="60px"  viewBox="656 156 288 288" version="1.1" >
                         <g id="Group-2" stroke="none" strokeWidth="5" fill="none" fillRule="evenodd" transform="translate(660.000000, 160.000000)">
                          <path d="M238.529268,238.300807 C213.343231,263.458971 178.555888,279.020052 140.127469,279.020052 C63.2799069,279.020052 0.978093317,216.784994 0.978093317,139.999073 C0.978093317,63.2177865 63.2799069,0.978094172 140.127469,0.978094172 C189.701753,0.978094172 233.213762,26.8684345 257.861755,65.845283" id="Stroke-1" stroke="#FFFFFF" strokeWidth="8" strokeLinecap="round"></path>
                          <path d="M193.088648,192.956335 C179.516946,206.51088 160.773525,214.893845 140.072736,214.893845 C98.6757973,214.893845 65.0990531,181.357351 65.0990531,139.993976 C65.0990531,98.6306005 98.6757973,65.0941063 140.072736,65.0941063 C161.752209,65.0941063 181.284143,74.2926611 194.971803,88.9871786" id="Stroke-3" stroke="#FFFFFF" strokeWidth="8" strokeLinecap="round"></path>
                          <path d="M158.681646,140 C158.681646,150.231944 150.383705,158.536131 140.128396,158.536131 C129.89164,158.536131 121.575146,150.231944 121.575146,140 C121.575146,129.768056 129.89164,121.463869 140.128396,121.463869 C150.383705,121.463869 158.681646,129.768056 158.681646,140 L158.681646,140 Z" id="Stroke-5" stroke="#FFFFFF" strokeWidth="8"></path>
                          <path d="M279.504121,139.995366 C279.504121,155.35255 267.045614,167.799562 251.674246,167.799562 C236.302878,167.799562 223.844371,155.35255 223.844371,139.995366 C223.844371,124.642816 236.302878,112.19117 251.674246,112.19117 C267.045614,112.19117 279.504121,124.642816 279.504121,139.995366 L279.504121,139.995366 Z" id="Stroke-7" stroke="#FFFFFF" strokeWidth="8"></path>
                          <path d="M153.19174,153.046655 L238.527413,238.298954" id="Stroke-9" stroke="#FFFFFF" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"></path>
                         </g>
                      </svg>

                  </a></li>
                  {tabs.map(function(tab, index) {
                    let linkStyle = (tab.linkName === this.state.activeTab)?{borderLeft: '4px solid #4C58A4',backgroundColor: 'Lavender'}:{}
                    return(
                    <li key={index}>
                      <Link to={tab.linkName} style={linkStyle} onClick={this.onItemClick} >
                        <div>{tab.icon}</div>
                        <div className="navDescription">
                          <span id={tab.linkName}>{tab.displayName}</span>
                        </div>
                      </Link>
                    </li>
                  )}.bind(this))}
                </ul>
            </nav>
            </td>
            <td style={{width:'99%',verticalAlign:'top'}}>
              <Header header="Admin Portal"/>
              {this.state.subtype !== "Paid"?
                <div style={{backgroundColor:'red',color:'white',width:'500px',height:'30px',textAlign:'center',margin:'0 auto'}}> Your evaluation expires in {this.state.expiryDays} days</div>
              :
              <div></div>
              }
              <span>
                {this.props.children}
              </span>
            </td>
          </tr>
          </tbody>
        </table>

        <AdminFooter/>
      </div>
    );
  }
}
