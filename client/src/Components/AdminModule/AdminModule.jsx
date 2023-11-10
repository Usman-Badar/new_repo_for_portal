import React, { lazy, Suspense, useEffect, useState } from 'react';

import './AdminModule.css';
// REACT REDUX
import { useDispatch } from 'react-redux';
import { Route, useHistory, NavLink } from 'react-router-dom';
// REDUX ACTIONS/METHDS
import { ShowSideBar } from '../../Redux/Actions/Action';

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
const EquipmentType = lazy( () => import('./Pages/EquipmentType_Form/EquipmentType_Form') );

const AdminModule = () => {

    const history = useHistory();
    const dispatch = useDispatch();
    const [ ShowBar, setShowBar ] = useState( false );

    useEffect(
        () => {

            if (sessionStorage.getItem('UserID') === undefined || sessionStorage.getItem('UserID') === null) {
                history.replace('/admin_login');
            }

        }, [history]
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const SideBarClose = () => {

        dispatch( ShowSideBar( false ) );

    }

    const ShowSide = () => {

        if ( ShowBar )
        {
            setShowBar( false );
        }else
        {
            setShowBar( true );
        }

    }

    let content = (
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
            <NavLink activeClassName="Admin_Dashboard_active" to="/fuel-managent/equipment-type-entry" className="d-center links">
                <div className="pr-3"><i className="lar la-compass"></i></div>
                <div className="links_txt">Equipment Entry Form</div>
            </NavLink>
        </div> 
    )

    return (
        <>
            <div className='AdminModule'>
                <Sidebar title="Admin Module" Data={ content } show={ ShowBar } SideBarClose={ SideBarClose } />

                <div className="Admin_Dashboard_main_content">
                    {/* TopBar Start From Here */}
                    <TopBar sideBarTrue={ ShowSide } />
                    {/* TopBar End here */}
                    <div className="content">
                        {/* <Breadcrumbs /> */}
                        <Route exact path='/admin_module' render={ () => <Suspense fallback={ <div>Loading....</div> }><Home /></Suspense> } />
                        <Route exact path='/admin_employement_requests' render={ () => <Suspense fallback={ <div>Loading....</div> }><EmploymentRequests /></Suspense> } />
                        <Route exact path='/admin_employement_requests/admin_employement_setup' render={ () => <Suspense fallback={ <div>Loading....</div> }><EmployeeForm /></Suspense> } />
                        <Route exact path='/admin_employement_requests/admin_view_temp_employee/:id' render={ () => <Suspense fallback={ <div>Loading....</div> }><ViewTempEmployees /></Suspense> } />
                        <Route exact path='/admin_employement_requests/confirmapproval/:id' render={ () => <Suspense fallback={ <div>Loading....</div> }><ConfirmApproval /></Suspense> } />
                        <Route exact path='/admin_view_employees' render={ () => <Suspense fallback={ <div>Loading....</div> }><Admin_View_Employees /></Suspense> } />
                        <Route exact path='/admin_companies' render={ () => <Suspense fallback={ <div>Loading....</div> }><Companies /></Suspense> } />
                        <Route exact path='/admin_locations' render={ () => <Suspense fallback={ <div>Loading....</div> }><Locations /></Suspense> } />
                        <Route exact path='/admin_locations/:id&&find=sublocation' render={ () => <Suspense fallback={ <div>Loading....</div> }><SubLocations /></Suspense> } />
                        <Route exact path='/admin_departments' render={ () => <Suspense fallback={ <div>Loading....</div> }><Departments /></Suspense> } />
                        <Route exact path='/admin_departments/admin_designations/:id' render={ () => <Suspense fallback={ <div>Loading....</div> }><Designations /></Suspense> } />
                        <Route exact path='/admin_users' render={ () => <Suspense fallback={ <div>Loading....</div> }><Users /></Suspense> } />
                        <Route exact path='/createuser' render={ () => <Suspense fallback={ <div>Loading....</div> }><CreateUser /></Suspense> } />
                        <Route exact path='/admin_emp_attendance' render={ () => <Suspense fallback={ <div>Loading....</div> }>< EmployeesAttendance /></Suspense>  } />
                        <Route exact path='/admin_logbook' render={ () => <Suspense fallback={ <div>Loading....</div> }>< AdminLogbook /></Suspense>  } />
                        <Route exact path='/configure_attendance_request' render={ () => <Suspense fallback={ <div>Loading....</div> }><AttRequest_Config /></Suspense> } />

                        <Route exact path='/menu_setup' render={ () => <Suspense fallback={ <div>Loading....</div> }><MenuSetup /></Suspense> } />
                        <Route exact path='/misc_setup' render={ () => <Suspense fallback={ <div>Loading....</div> }><MiscSetup /></Suspense> } />
                        <Route exact path='/fuel-managent/equipment-type-entry' render={ () => <Suspense fallback={ <div>Loading....</div> }><EquipmentType /></Suspense> } />
                    </div>
                </div>
            </div>
        </>
    )

}

export default AdminModule;