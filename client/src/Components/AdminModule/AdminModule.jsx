import React, { lazy, Suspense, useEffect, useState } from 'react';

import './AdminModule.css';
// REACT REDUX
import { useDispatch } from 'react-redux';
import { Route, useHistory, NavLink } from 'react-router-dom';
import { ShowSideBar } from '../../Redux/Actions/Action';
import Loading from '../UI/Loading/Loading';
import LoadingIcon from '../../images/loadingIcons/icons8-loading-circle.gif';
import Middleware from '../UI/Middleware/Middleware';

const Sidebar = lazy( () => import('./Components/SideBar/SideBar') );
const TopBar = lazy( () => import('./Components/TopBar/TopBar') );
const Breadcrumbs = lazy( () => import('./Components/Breadcrumbs/Breadcrumbs') );
const Home = lazy( () => import('./Pages/Home/Home') );
const EmployeeForm = lazy( () => import('./Pages/Employement_Setup/EmployeeSetup/EmployeeForm') );
const EmploymentRequests = lazy( () => import('./Pages/Employement_Setup/Employement_Requests/Employement_Requests') );
const ViewTempEmployees = lazy( () => import('./Pages/Employement_Setup/Employement_Requests/ViewTempEmployee/ViewTempEmployee') );
const ConfirmApproval = lazy( () => import('./Pages/Employement_Setup/Employement_Requests/ViewTempEmployee/ConfirmApproval/ConfirmApproval') );
const Admin_View_Employees = lazy( () => import('./Pages/Employement_Setup/Employement_Requests/Admin_View_Employees/Admin_View_Employees') );
const Departments = lazy( () => import('./Pages/Departments/Departments') );
const Designations = lazy( () => import('./Pages/Departments/Designations/Designations') );
const Companies = lazy( () => import('./Pages/Companies/Companies') );
const Locations = lazy( () => import('./Pages/Locations/Locations') );
const SubLocations = lazy( () => import('./Pages/Locations/Locations') );
const Users = lazy( () => import('./Pages/Users/Users') );
const CreateUser = lazy( () => import('./Pages/Users/CreateUser/CreateUser') );
const EmployeesAttendance = lazy( () => import('./Pages/EmployeesAttendance/EmployeesAttendance') );
const AdminLogbook = lazy( () => import('./Pages/AdminLogbook/AdminLogbook') );
const AttRequest_Config = lazy( () => import('./Pages/AttRequest_Config/AttRequest_Config') );
const MenuSetup = lazy( () => import('./Pages/MenuSetup/MenuSetup') );
const MiscSetup = lazy( () => import('./Pages/MiscSetup/MiscSetup') );
const AccessManagement = lazy( () => import('./Pages/AccessManagement/AccessManagement') );

const AdminModule = () => {

    const history = useHistory();
    const dispatch = useDispatch();
    const [ ShowBar, setShowBar ] = useState( false );

    useEffect(
        () => {
            if (sessionStorage.getItem('UserID') === undefined || sessionStorage.getItem('UserID') === null) {
                console.log('sessionStorage.getItem(UserID)', sessionStorage.getItem('UserID'))
                history.replace('/admin_login');
            }
        }, [history]
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const SideBarClose = () => {
        dispatch( ShowSideBar( false ) );
    }

    const ShowSide = () => {
        setShowBar(!ShowBar);
    }

    const content = (
        <div className="Dashboard_links">
            <NavLink activeClassName="Admin_Dashboard_active" to="/admin_module" className="d-center links">
                <div className="pr-3"><i className="las la-home"></i></div>
                <div className="links_txt">Home</div>
            </NavLink>
            <NavLink activeClassName="Admin_Dashboard_active" to="/admin_employement_requests" className="d-center links">
                <div className="pr-3"><i class="las la-building"></i></div>
                <div className="links_txt">Employment Requests</div>
            </NavLink>
            <NavLink activeClassName="Admin_Dashboard_active" to="/admin_employement_requests/admin_employement_setup" className="d-center links">
                <div className="pr-3"><i class="las la-building"></i></div>
                <div className="links_txt">Employee Form</div>
            </NavLink>
            <NavLink activeClassName="Admin_Dashboard_active" to="/admin/access/management" className="d-center links">
                <div className="pr-3"><i class="las la-building"></i></div>
                <div className="links_txt">Access Management</div>
            </NavLink>
            <NavLink activeClassName="Admin_Dashboard_active" to="/admin_companies" className="d-center links">
                <div className="pr-3"><i class="las la-building"></i></div>
                <div className="links_txt">Companies</div>
            </NavLink>
            <NavLink activeClassName="Admin_Dashboard_active" to="/admin_locations" className="d-center links">
                <div className="pr-3"><i class="las la-street-view"></i></div>
                <div className="links_txt">Locations</div>
            </NavLink>
            <NavLink activeClassName="Admin_Dashboard_active" to="/admin_locations/:id&&find=sublocation" className="d-center links">
                <div className="pr-3"><i class="las la-street-view"></i></div>
                <div className="links_txt">Sub Locations</div>
            </NavLink>
            <NavLink activeClassName="Admin_Dashboard_active" to="/admin_departments" className="d-center links">
                <div className="pr-3"><i className="las la-list-alt"></i></div>
                <div className="links_txt">Departments</div>
            </NavLink>
            <NavLink activeClassName="Admin_Dashboard_active" to="/admin_users" className="d-center links">
                <div className="pr-3"><i className="las la-users"></i></div>
                <div className="links_txt">Users</div>
            </NavLink>
            <NavLink activeClassName="Admin_Dashboard_active" to="/admin_emp_attendance" className="d-center links">
                <div className="pr-3"><i className="las la-users"></i></div>
                <div className="links_txt">Employees Attendance</div>
            </NavLink>
            <NavLink activeClassName="Admin_Dashboard_active" to="/admin_logbook" className="d-center links">
                <div className="pr-3"><i className="las la-users"></i></div>
                <div className="links_txt">Admin Logbook</div>
            </NavLink>
            <NavLink activeClassName="Admin_Dashboard_active" to="/configure_attendance_request" className="d-center links">
                <div className="pr-3"><i className="las la-users"></i></div>
                <div className="links_txt">Attendance Request Configuration</div>
            </NavLink>
            <NavLink activeClassName="Admin_Dashboard_active" to="/menu_setup" className="d-center links">
                <div className="pr-3"><i className="las la-bars"></i></div>
                <div className="links_txt">Menu Setup</div>
            </NavLink>
            <NavLink activeClassName="Admin_Dashboard_active" to="/misc_setup" className="d-center links">
                <div className="pr-3"><i className="lar la-compass"></i></div>
                <div className="links_txt">MISC Setup</div>
            </NavLink>
        </div> 
    );
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
        return (
            <Suspense fallback={Load}>
                <Middleware 
                    admin={props.admin}
                    guarded={props.guarded} 
                    hasAccess={props.access} 
                    user={{}}
                    authorization={props.authorization}
                    authorizationMethod={props.authorizationMethod}
                    authorization_key={props.authorization_key}
                    authorization_value={props.authorization_value}
                    authorization_expression={props.authorization_expression}
                >
                    { props.content }
                </Middleware>
            </Suspense>
        )
    }

    return (
        <>
            <div className='AdminModule'>
                <Sidebar title="Admin Portal" Data={ content } show={ ShowBar } SideBarClose={ SideBarClose } />
                <div className="Admin_Dashboard_main_content">
                    {/* TopBar Start From Here */}
                    <TopBar sideBarTrue={ ShowSide } />
                    {/* TopBar End here */}
                    <div className="content">
                        {/* <Breadcrumbs /> */}
                        <Route exact path='/admin/access/management' render={ () => <Sus content={ <AccessManagement /> } /> } />
                        <Route exact path='/admin_module' render={ () => <Sus content={<Home />} /> } />
                        <Route exact path='/admin_employement_requests' render={ () => <Sus content={<EmploymentRequests />} /> } />
                        <Route exact path='/admin_employement_requests/admin_employement_setup' render={ () => <Sus content={<EmployeeForm />} /> } />
                        <Route exact path='/admin_employement_requests/admin_view_temp_employee/:id' render={ () => <Sus content={<ViewTempEmployees />} /> } />
                        <Route exact path='/admin_employement_requests/confirmapproval/:id' render={ () => <Sus content={<ConfirmApproval />} /> } />
                        <Route exact path='/admin_view_employees' render={ () => <Sus content={<Admin_View_Employees />} /> } />
                        <Route exact path='/admin_companies' render={ () => <Sus content={<Companies />} /> } />
                        <Route exact path='/admin_locations' render={ () => <Sus content={<Locations />} /> } />
                        <Route exact path='/admin_locations/:id&&find=sublocation' render={ () => <Sus content={<SubLocations />} /> } />
                        <Route exact path='/admin_departments' render={ () => <Sus content={<Departments />} /> } />
                        <Route exact path='/admin_departments/admin_designations/:id' render={ () => <Sus content={<Designations />} /> } />
                        <Route exact path='/admin_users' render={ () => <Sus content={<Users />} /> } />
                        <Route exact path='/createuser' render={ () => <Sus content={<CreateUser />} /> } />
                        <Route exact path='/admin_emp_attendance' render={ () => <Sus content={<EmployeesAttendance />} /> } />
                        <Route exact path='/admin_logbook' render={ () => <Sus content={<AdminLogbook />} /> } />
                        <Route exact path='/configure_attendance_request' render={ () => <Sus content={<AttRequest_Config />} /> } />

                        <Route exact path='/menu_setup' render={ () => <Sus content={<MenuSetup />} /> } />
                        <Route exact path='/misc_setup' render={ () => <Sus content={<MiscSetup />} /> } />
                        
                    </div>
                </div>
            </div>
        </>
    )

}

export default AdminModule;