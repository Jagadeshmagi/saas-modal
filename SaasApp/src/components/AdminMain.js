import React from 'react'
import { Link } from 'react-router'
import Header from './Header'
import AdminFooter from './AdminFooter'

export default class AdminMain extends React.Component {
  constructor(props) {

    super(props);

    this.state = {
      activeTab:'/app/adminMain/billing',
    };

    this.onItemClick = this.onItemClick.bind(this);
  }

  onItemClick(e)  {
    let linkHref = e.target.href;
    let linkName = linkHref.substring(linkHref.indexOf("/app"));

    this.setState({ activeTab: linkName})
  }

  render() {
    let tabs = [
      {linkName:'/app/adminMain/billing', displayName:'Billing & Usage'},
      // {linkName:'/app/adminMain/userManagement', displayName:'User Management'},
      {linkName:'/app/adminMain/companyInfo', displayName:'Company Info'},
    ]

    return (
      <div className="app-container">
        <Header header="Admin Portal"/>
        <div>
          <div style={{marginTop: 20}} >
              <div>
                <ul style={{marginLeft:80}}>
                  {tabs.map(function(tab, index) {
                    let linkStyle = (tab.linkName === this.state.activeTab)?{color:"#4C58A4", borderBottom: "4px solid #4C58A4"}:{color:"#ACB3B7", fontWeight:"semi-bold"}
                    return(
                      <li key={index}>
                        <Link to={tab.linkName} style={linkStyle} onClick={this.onItemClick} >
                            {tab.displayName}
                        </Link>
                      </li>
                    )
                  }.bind(this))}
                </ul>
              </div>
          </div>
        </div>

        <div>
          {this.props.children}
        </div>
        <AdminFooter/>
      </div>
    );
  }
}
