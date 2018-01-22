import React from 'react'
import { Router, Route, hashHistory,browserHistory, IndexRoute  } from 'react-router'
import Layout from './components/Layout';
import ProvisionMain from './components/ProvisionMain';
import AdminMain from './components/AdminMain';
import BillingAndUsage from './components/BillingAndUsage';
import UserManagement from './components/UserManagement';
import CompanyInfo from './components/CompanyInfo';
import Login from './components/Login'
import PaySuccess from './components/PaySuccess'
import PayFail from './components/PayFail'
import SystemAdminMain from './components/SystemAdmin/SystemAdminMain'
import CustomersList from './components/SystemAdmin/CustomersList'
import PartnersList from './components/SystemAdmin/PartnersList'
import CustomerAdminMain from './components/CustomerAdmin/CustomerAdminMain'
import ServiceStatus from './components/CustomerAdmin/ServiceStatus'
import SubscriptionDetails from './components/CustomerAdmin/SubscriptionDetails'
import UsageDetails from './components/CustomerAdmin/UsageDetails'
import Help from './components/CustomerAdmin/Help'
import ErrorPage from './components/ErrorPage'

export const routes = (
  <Route path="/app" component={Layout}>
    <IndexRoute component={Login}/>
    <Route path='provision'  component={ProvisionMain}/>
    <Route path='login'  component={Login}/>
    <Route path='success'  component={PaySuccess}/>
    <Route path='fail'  component={PayFail}/>
	  <Route path='adminMain'  component={AdminMain} onEnter={requireAuth}>
  		<IndexRoute component={BillingAndUsage}/>
  		<Route path="billing" component={BillingAndUsage}/>
  		<Route path="userManagement" component={UserManagement}/>
  		<Route path="companyInfo" component={CompanyInfo}/>
    </Route>
    <Route path='admin'  component={CustomerAdminMain} onEnter={requireAuth}>
      <IndexRoute component={Help}/>
      <Route path="help" component={Help}/>
      <Route path="service" component={ServiceStatus}/>
      <Route path="subscription" component={SubscriptionDetails}/>
      <Route path="usage" component={UsageDetails}/>      
    </Route>    
    <Route path='sysadmin'  component={SystemAdminMain} onEnter={requireSysAdminAuth}>
      <IndexRoute component={CustomersList}/>
      <Route path="customers" component={CustomersList}/>
      <Route path="partners" component={PartnersList}/>
    </Route>         
  </Route>
);

export function isClient() {
   return typeof window != 'undefined' && window.document;
}
export function requireAuth(nextState,replace)
  {
    if (isClient()){
      let customerId = localStorage.getItem('customerId');
      if(customerId == null){
        console.log("loading login for admin")
        replace('/app/login')
      }
    }
         
  }
export function requireSysAdminAuth(nextState,replace)
{
  if (isClient()){
    let role = sessionStorage.getItem('role');
    if(role == null){
      console.log("loading login for admin")
      replace('/app/login')
    }
  }
         
 }

export default class AppRoutes extends React.Component {
  render() {
    return (
      <Router history={browserHistory} routes={routes} onUpdate={() => window.scrollTo(0, 0)}/>
    );
  }
}