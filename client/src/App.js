import React, { lazy, Suspense } from 'react';

import './App.css';

import { Switch, Route, Redirect } from 'react-router-dom';
import Loading from './Components/UI/Loading/Loading';
import Vouchers from './Components/EmployeeProtal/Dashboard/Components/Vouchers/Vouchers';
import Quatation from './Components/EmployeeProtal/Dashboard/Components/Quatation/Quatation';
import Bills from './Components/EmployeeProtal//Dashboard/Components/Bills/Bills';

import LoadingIcon from './images/loadingIcons/icons8-loading-circle.gif';

const Login = lazy( () => import( './Components/EmployeeProtal/Auth/Login/Login' ) );
const Dashboard = lazy( () => import( './Components/EmployeeProtal/Dashboard/Dashboard' ) );
const Logout = lazy( () => import( './Components/EmployeeProtal/Auth/Logout/Logout' ) );

const AdminModule = lazy( () => import( './Components/AdminModule/AdminModule' ) );
const AdminLogin = lazy( () => import( './Components/AdminModule/Admin_login/Admin_login' ) );
const AdminLogout = lazy( () => import( './Components/AdminModule/Admin_Logout/Admin_Logout' ) );

const OutOfLocation = lazy( () => import( './Components/EmployeeProtal/OutOfLocation/OutOfLocation' ) );

// const Leave = lazy( () => import( './Components/Leave/Leave' ) );

const App = () => {

    require('dotenv').config();
        const Load = <Loading 
            display={ true }
            styling={
                {
                    zIndex: 100000
                }
            }
            icon={ 
                <img 
                    src={ LoadingIcon }
                    className="LoadingImg"
                    alt="LoadingIcon"
                /> 
            }
            txt="Please Wait"
        />

        const Sus = ( props ) => {

            return <Suspense fallback={ Load }> { props.content } </Suspense>

        }
    
        return ( 
            <>
                <Switch>

                    {/* 
                        For Employee Portal
                    */}

                    <Redirect exact path='/' to='/login' />
                    <Route exact path='/dashboard' render={ () => <Sus content={ <Dashboard /> }/> } />

                    <Route exact path='/chat' render={ () => <Sus content={ <Dashboard /> } /> } />
                    <Route exact path='/blackboard' render={ () => <Sus content={ <Dashboard /> } /> } />

                    <Route exact path='/outoflocation' render={ () => <Sus content={ <OutOfLocation /> } /> } />
                    <Route exact path='/login' render={ () => <Sus content={ <Login /> } /> } />
                    <Route exact path='/logout' render={ () => <Sus content={ <Logout /> } /> } />
                    <Route exact path='/descuss_chat/:id' render={ () => <Sus content={ <Dashboard /> } /> } />

                    <Route exact path='/attdevices' render={ () => <Sus content={ <Dashboard /> } /> } />
                    <Route exact path='/guests/view/guests' render={ () => <Sus content={ <Dashboard /> } /> } />
                    <Route exact path='/guests/view/employees' render={ () => <Sus content={ <Dashboard /> } /> } />

                    <Route exact path='/news' render={ () => <Sus content={ <Dashboard /> } /> } />
                    <Route exact path='/news/newspaper/:id' render={ () => <Sus content={ <Dashboard /> } /> } />
                    <Route exact path='/notices/management' render={ () => <Sus content={ <Dashboard /> } /> } />

                    <Route exact path='/help' render={ () => <Sus content={ <Dashboard /> } /> } />
                    <Route exact path='/drive' render={ () => <Sus content={ <Dashboard /> } /> } />

                    <Route exact path="/employeestickets/:path" render={ () => <Sus content={ <Dashboard /> } /> } />
                    <Route exact path="/acr/options" render={ () => <Sus content={ <Dashboard /> } /> } />
                    <Route exact path="/acr/self-assessment" render={ () => <Sus content={ <Dashboard /> } /> } />
                    <Route exact path="/acr/self-assessment/details/:id" render={ () => <Sus content={ <Dashboard /> } /> } />
                    {/* <Route exact path="/acr/growth-review" render={ () => <Sus content={ <Dashboard /> } /> } /> */}
                    <Route exact path="/acr/growth-review/new/:emp_id" render={ () => <Sus content={ <Dashboard /> } /> } />
                    <Route exact path="/acr/growth-review/:emp_id" render={ () => <Sus content={ <Dashboard /> } /> } />
                    <Route exact path="/acr/growth-review/details/:id" render={ () => <Sus content={ <Dashboard /> } /> } />
                    <Route exact path="/acr/peer-review/emp/:emp_id" render={ () => <Sus content={ <Dashboard /> } /> } />
                    <Route exact path="/acr/peer-review/details/:id" render={ () => <Sus content={ <Dashboard /> } /> } />
                    <Route exact path="/acr/peer-review/:emp_id" render={ () => <Sus content={ <Dashboard /> } /> } />
                    <Route exact path="/acr/form/:path" render={ () => <Sus content={ <Dashboard /> } /> } />












                    <Route exact path="/hr/temporary/employees/details/:emp_id" render={ () => <Sus content={ <Dashboard /> } /> } />
                    <Route exact path="/hr/temporary/employees/form" render={ () => <Sus content={ <Dashboard /> } /> } />
                    <Route exact path="/hr/temporary/employees/list" render={ () => <Sus content={ <Dashboard /> } /> } />

                    
                    <Route exact path="/hr/employee/list" render={ () => <Sus content={ <Dashboard /> } /> } />
                    <Route exact path="/hr/employee/details/:id" render={ () => <Sus content={ <Dashboard /> } /> } />
                    <Route exact path="/hr/employee/edit/:id" render={ () => <Sus content={ <Dashboard /> } /> } />

                    {/* LEAVE MODULE */}
                    
                    {/* <Route exact path='/leave/dashboard' render={ () => <Sus content={ <Leave /> } /> } />
                    <Route exact path='/leave/leave_form' render={ () => <Sus content={ <Leave /> } /> } />
                    <Route exact path='/leave/availed_leave_form' render={ () => <Sus content={ <Leave /> } /> } />
                    <Route exact path='/leave/short_leave_form' render={ () => <Sus content={ <Leave /> } /> } />
                    <Route exact path='/leave/requests' render={ () => <Sus content={ <Leave /> } /> } />
                    <Route exact path='/leave/requests/:id' render={ () => <Sus content={ <Leave /> } /> } /> */}


                    <Route exact path='/leave_form' render={ () => <Sus content={ <Dashboard /> } /> } />
                    <Route exact path='/avail_leave_form' render={ () => <Sus content={ <Dashboard /> } /> } />
                    <Route exact path='/short_leave_form' render={ () => <Sus content={ <Dashboard /> } /> } />
                    <Route exact path='/leave_history' render={ () => <Sus content={ <Dashboard /> } /> } />
                    <Route exact path='/leave_request/:id' render={ () => <Sus content={ <Dashboard /> } /> } />
                    <Route exact path='/view_leave_requests' render={ () => <Sus content={ <Dashboard /> } /> } />

                    <Route exact path='/attendance_requests/view/list' render={ () => <Sus content={ <Dashboard /> } /> } />
                    <Route exact path='/attendance_requests/view/details/:id' render={ () => <Sus content={ <Dashboard /> } /> } />





                    <Route exact path='/attendance_request' render={ () => <Sus content={ <Dashboard /> } /> } />
                    <Route exact path='/attendance_request/:id' render={ () => <Sus content={ <Dashboard /> } /> } />
                    <Route exact path='/attendance_requests' render={ () => <Sus content={ <Dashboard /> } /> } />

                    <Route exact path='/view_employees_attendance' render={ () => <Sus content={ <Dashboard /> } /> } />

                    <Route exact path='/profile/:path/:link' render={ () => <Sus content={ <Dashboard /> } /> } />
                    <Route exact path='/empdailyattendance' render={ () => <Sus content={ <Dashboard /> } /> } />

                    {/* 
                        For Admin Module
                    */}

                    <Route exact path='/admin_login' render={ () => <Sus content={ <AdminLogin /> } /> } />
                    <Route exact path='/admin_logout' render={ () => <Sus content={ <AdminLogout /> } /> } />
                    <Route exact path='/admin_module' render={ () => <Sus content={ <AdminModule /> } /> } />
                    <Route exact path='/admin_employement_requests' render={ () => <Sus content={ <AdminModule /> } /> } />
                    <Route exact path='/admin_employement_requests/admin_employement_setup' render={ () => <Sus content={ <AdminModule /> } /> } />
                    <Route exact path='/admin_employement_requests/admin_view_temp_employee/:id' render={ () => <Sus content={ <AdminModule /> } /> } />
                    <Route exact path='/admin_employement_requests/confirmapproval/:id' render={ () => <Sus content={ <AdminModule /> } /> } />
                    <Route exact path='/admin_companies' render={ () => <Sus content={ <AdminModule /> } /> } />
                    <Route exact path='/admin_locations' render={ () => <Sus content={ <AdminModule /> } /> } />
                    <Route exact path='/admin_departments' render={ () => <Sus content={ <AdminModule /> } /> } />
                    <Route exact path='/admin_departments/admin_designations/:id' render={ () => <Sus content={ <AdminModule /> } /> } />
                    <Route exact path='/admin_users' render={ () => <Sus content={ <AdminModule /> } /> } />
                    <Route exact path='/admin_emp_attendance' render={ () => <Sus content={ <AdminModule /> } />  } />
                    <Route exact path='/createuser' render={ () => <Sus content={ <AdminModule /> } /> } />
                    <Route exact path='/menu_setup' render={ () => <Sus content={ <AdminModule /> } /> } />
                    <Route exact path='/misc_setup' render={ () => <Sus content={ <AdminModule /> } /> } />
                    <Route exact path='/configure_attendance_request' render={ () => <Sus content={ <AdminModule /> } /> } />
                    <Route exact path='/employees/lock' render={ () => <Sus content={ <AdminModule /> } /> } />


                    {/* 
                        For Inventory
                    */}
                    <Route exact path="/inventory/challan/:path" render={ () => <Sus content={ <Dashboard /> } /> } />
                    <Route exact path="/inventory/workshop/daily_maintenance" render={ () => <Sus content={ <Dashboard /> } /> } />
                    <Route exact path="/inventory/workshop/checklist" render={ () => <Sus content={ <Dashboard /> } /> } />
                    <Route exact path="/inventory/workshop/report/:report_id" render={ () => <Sus content={ <Dashboard /> } /> } />
                    <Route exact path="/inventory/products/list" render={ () => <Sus content={ <Dashboard /> } /> } />
                    <Route exact path="/inventory/products/create" render={ () => <Sus content={ <Dashboard /> } /> } />
                    <Route exact path="/inventory/products/details/:id" render={ () => <Sus content={ <Dashboard /> } /> } />
                    <Route exact path="/inventory/categories/list" render={ () => <Sus content={ <Dashboard /> } /> } />
                    <Route exact path="/inventory/category/sub-categories/:category_id" render={ () => <Sus content={ <Dashboard /> } /> } />
                    <Route exact path="/inventory/vendors/list" render={ () => <Sus content={ <Dashboard /> } /> } />
                    <Route exact path="/inventory/vendor/:id" render={ () => <Sus content={ <Dashboard /> } /> } />
                    <Route exact path="/inventory/locations" render={ () => <Sus content={ <Dashboard /> } /> } />
                    <Route exact path="/inventory/location/:location_code/sub-locations" render={ () => <Sus content={ <Dashboard /> } /> } />

                    {/* VIEWS */}
                    <Route exact path="/view=quotations/:id" render={ () => <Sus content={ <Quatation /> } /> } />
                    <Route exact path="/view=bills/:id" render={ () => <Sus content={ <Bills /> } /> } />
                    <Route exact path="/view=vouchers/:id" render={ () => <Sus content={ <Vouchers /> } /> } />

                    {/* 
                        For Procurement
                    */}


                    <Route exact path="/employment_setup" render={ () => <Sus content={ <Dashboard /> } /> } />
                    <Route exact path="/employment_setup/:view" render={ () => <Sus content={ <Dashboard /> } /> } />
                    <Route exact path="/employment_setup/requests/:id" render={ () => <Sus content={ <Dashboard /> } /> } />
                    <Route exact path="/employment_setup/requests/confirm/:id" render={ () => <Sus content={ <Dashboard /> } /> } />

                    {/* 
                        FOR STORE MODULE
                    */}
                    <Route exact path="/store/:path" render={ () => <Sus content={ <Dashboard /> } /> } />
                    <Route exact path="/store/:path/index=:index" render={ () => <Sus content={ <Dashboard /> } /> } />
                    
                    {/* 
                        FOR ITEM REQUESTS
                    */}
                    <Route exact path="/item_requests" render={ () => <Sus content={ <Dashboard /> } /> } />
                    <Route exact path="/item_requests/:path" render={ () => <Sus content={ <Dashboard /> } /> } />
                    <Route exact path="/item_requests/:path/id=:index" render={ () => <Sus content={ <Dashboard /> } /> } />


                    {/* REPAIR REQUEST */}
                    <Route exact path="/repair_request" render={ () => <Sus content={ <Dashboard /> } /> } />
                    <Route exact path="/repair_request/new_repair" render={ () => <Sus content={ <Dashboard /> } /> } />
                    <Route exact path="/repair_request/new_incident" render={ () => <Sus content={ <Dashboard /> } /> } />
                    <Route exact path="/repair_request/details/:id" render={ () => <Sus content={ <Dashboard /> } /> } />
                    <Route exact path="/repair_request/incident/details/:id" render={ () => <Sus content={ <Dashboard /> } /> } />

                    {/* PURCAHSE REQUISITION */}
                    <Route exact path="/purchase/requisition/form" render={ () => <Sus content={ <Dashboard /> } /> } />
                    <Route exact path="/purchase/requisition/requests" render={ () => <Sus content={ <Dashboard /> } /> } />
                    <Route exact path="/purchase/requisition/details" render={ () => <Sus content={ <Dashboard /> } /> } />
                    <Route exact path="/purchase/requisition/form&&pr_id=:id" render={ () => <Sus content={ <Dashboard /> } /> } />

                    {/* PURCAHSE ORDER */}
                    <Route exact path="/purchase/order/form" render={ () => <Sus content={ <Dashboard /> } /> } />
                    <Route exact path="/purchase/order/form&&po_id=:id" render={ () => <Sus content={ <Dashboard /> } /> } />
                    <Route exact path="/purchase/order/requests" render={ () => <Sus content={ <Dashboard /> } /> } />
                    <Route exact path="/purchase/order/details" render={ () => <Sus content={ <Dashboard /> } /> } />
                    
                    {/* 
                        For Container
                    */}
                    <Route exact path="/logistics/container/:path" render={ () => <Sus content={ <Dashboard /> } /> } />
                    
                    {/* CASH DEPARTMENT */}
                    <Route exact path="/cash/form" render={ () => <Sus content={ <Dashboard /> } /> } />
                    <Route exact path="/cash/requests" render={ () => <Sus content={ <Dashboard /> } /> } />
                    <Route exact path="/cash/request/:id" render={ () => <Sus content={ <Dashboard /> } /> } />
                    
                    <Route exact path="/inventory/repair/requests" render={ () => <Sus content={ <Dashboard /> } /> } />
                    <Route exact path="/inventory/repair/request/:id" render={ () => <Sus content={ <Dashboard /> } /> } />

                    <Route exact path="/cash/advance/salary" render={ () => <Sus content={ <Dashboard /> } /> } />
                    <Route exact path="/cash/advance/salary/form" render={ () => <Sus content={ <Dashboard /> } /> } />
                    <Route exact path="/cash/advance/salary/request/:id" render={ () => <Sus content={ <Dashboard /> } /> } />

                    <Route exact path="/refund/csc/list" render={ () => <Sus content={ <Dashboard /> } /> } />
                    <Route exact path="/refund/csc/new" render={ () => <Sus content={ <Dashboard /> } /> } />
                    <Route exact path="/refund/csc/view/:id" render={ () => <Sus content={ <Dashboard /> } /> } />

                    <Route exact path="/cash/shipping/line/list" render={ () => <Sus content={ <Dashboard /> } /> } />
                    <Route exact path="/cash/shipping/line/form" render={ () => <Sus content={ <Dashboard /> } /> } />
                    <Route exact path="/cash/shipping/line/details/:id" render={ () => <Sus content={ <Dashboard /> } /> } />

                    {/* FUEL MANAGEMENT */}
                    <Route exact path="/fuel-managent/equipment-type-entry" render={ () => <Sus content={ <AdminModule /> } /> } />
                    <Route exact path="/fuel-managent/company-equipment-setup-form" render={ () => <Sus content={ <Dashboard /> } /> } />
                    <Route exact path="/fuel-managent/fuel-request-for-station" render={ () => <Sus content={ <Dashboard /> } /> } />
                    <Route exact path="/fuel-managent/fuel-receival-for-workshop" render={ () => <Sus content={ <Dashboard /> } /> } />
                    <Route exact path="/fuel-managent/equipment-fuel-entry" render={ () => <Sus content={ <Dashboard /> } /> } />
                    <Route exact path="/fuel-managent/equipment-trip-entry" render={ () => <Sus content={ <Dashboard /> } /> } />
                    <Route exact path="/fuel-managent/stock-at-workshop" render={ () => <Sus content={ <Dashboard /> } /> } />
                    <Route exact path="/fuel-managent/stock-at-station" render={ () => <Sus content={ <Dashboard /> } /> } />

                    <Route exact path='/notices/management' render={ () => <Sus content={ <Dashboard /> } /> } />

                    
                    <Route exact path='/portal/issues' render={ () => <Sus content={ <Dashboard /> } /> } />
                    <Route exact path='/portal/issues/new' render={ () => <Sus content={ <Dashboard /> } /> } />
                    <Route exact path='/portal/issues/details/:id' render={ () => <Sus content={ <Dashboard /> } /> } />
                    
                </Switch>
            </>
        )
}

export default App;