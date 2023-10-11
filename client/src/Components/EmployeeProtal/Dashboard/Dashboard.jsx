/* eslint-disable react/jsx-pascal-case */
/* eslint-disable react-hooks/exhaustive-deps */
// REACT BASIC COMPONENTS
import React, { lazy, Suspense, useEffect, useMemo, useState } from 'react';

// CSS FILE
import './Dashboard.css';
// REACT REDUX
import { useSelector, useDispatch } from 'react-redux';
// REACT NAVIGATION
import { Route, NavLink, useHistory } from 'react-router-dom';
// BACKEND REQUEST API
import axios from '../../../axios';
// REDUX ACTIONS/METHDS
import { EmployeeLogin, ShowSideBar } from '../../../Redux/Actions/Action';
// TOAST CUSTOM COMPONENT
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import $ from 'jquery';
import parse from 'html-react-parser';

// CUSTOM LOADING COMPONENT
import Loading from '../../UI/Loading/Loading';
import LoadingIcon from '../../../images/loadingIcons/icons8-loading-circle.gif';
// CREATING SOCKET
import socket from '../../../io';
import Middleware from '../../UI/Middleware/Middleware';

const SideBar = lazy( () => import('./Components/SideBar/SideBar') );
const TopBar = lazy( () => import('./Components/TopBar/TopBar') );
const Descussion = lazy( () => import('./Pages/Descussion/Descussion') );
const Devices = lazy( () => import('./Pages/Attendance/Devices/Devices') );
const EmployeeProfile = lazy( () => import('./Pages/EmployeeProfile/EmployeeProfile') );
const DailyAttendance = lazy( () => import('./Pages/EmployeeProfile/DailyAttendance/DailyAttendance') );

// const Home = lazy( () => import('./Pages/Home--prev/Home') );
const Home = lazy( () => import('./Pages/Home--new/Home') );
const Chat = lazy( () => import('./Pages/Chat/Employee_Chat') );

const Guests = lazy( () => import('./Pages/Attendance/Guests/Guests') );
const News = lazy( () => import('./Pages/News/News') );
const NewsPaper = lazy( () => import('./Pages/News/NewsPaper/NewsPaper') );

const Help = lazy( () => import('./Pages/Help/Employee_Help') );
const Drive = lazy( () => import('./Pages/Drive/Employee_Drive') );
const AttendanceRequest = lazy( () => import('./Pages/AtendanceRequest/Attandence_Request') );
const AttendanceRequestPrev = lazy( () => import('./Pages/AtendanceRequest copy/Attandence_Request') );

const Attendance = lazy( () => import('./Pages/Employee/Attendance/Attendance') );

const BlackBoard = lazy( () => import('./Pages/BlackBoard/BlackBoard') );

const LeaveApplication = lazy( () => import('./Pages/Forms/Leave_Application/Leave_Application') );
const LeaveRequests = lazy( () => import('./Pages/LeaveRequests/Leave_Application_Details') );

const ChatBotNotification = lazy( () => import('../../UI/ChatBot/ChatBot_Notification') );
const View_Emp_Attendance = lazy( () => import('./Pages/View_Emp_Attendance/View_Emp_Attendance') );

// const InvtryAssets = lazy( () => import( './Pages/Inventory/InvtryAssets/InvtryAssets' ) );
// const InvtrySubAssets = lazy( () => import(  './Pages/Inventory/InvtryAssets/InvtrySubAssets/InvtrySubAssets' ) );

// const Assets = lazy( () => import(  './Pages/Inventory/Assets/New_Inventory_Assets' ) );

// const NewAssetEntry = lazy( () => import(  './Pages/Inventory/AssetEntry/AssetEntry' ) );
// const ViewInvtryRequests = lazy( () => import(  './Pages/Inventory/ViewInvtryRequests/ViewInvtryRequests' ) );

// const PRRequestDetails = lazy( () => import(  '../../Inventory/PRRequests/PRRequestDetails/PRRequestDetails' ) );
// const PRRequests = lazy( () => import(  '../../Inventory/PRRequests/New_PR_Request' ) );

// const InvtryLocation = lazy( () => import(  './Pages/Inventory/InvtryLocation/InvtryLocation' ) );
// const InvtrySubLocations = lazy( () => import(  './Pages/Inventory/InvtryLocation/InvtrySubLocations/InvtrySubLocations' ) );

const EmploymentForm = lazy( () => import( './Pages/Forms/EmployementSetup/EmployementForm' ) );
const EmploymentRequests = lazy( () => import( './Pages/Forms/EmployementSetup/Employement_Request/Employement_Request' ) );
const ViewEmployees = lazy( () => import( './Pages/Forms/EmployementSetup/View_Employees/View_Employees' ) );
const ViewTempEmployee = lazy( () => import( './Pages/Forms/EmployementSetup/ViewTempEmployee/ViewTempEmployee' ) );
const ConfirmApproval = lazy( () => import( './Pages/Forms/EmployementSetup/ViewTempEmployee/ConfirmApproval/ConfirmApproval' ) );

const InventoryRequests = lazy( () => import('./Pages/Store/Inventory_requests/InventoryRequests') );
const Items = lazy( () => import('./Pages/Store/Items/Items') );
const Inward = lazy( () => import('./Pages/Store/Inward/Inward') );
const ItemRequest = lazy( () => import('./Pages/Forms/ItemRequest/ItemRequest') );
const RepairRequest = lazy( () => import('./Pages/Forms/RepairRequest/RepairRequest') );

const EmpTickets = lazy( () => import('./Pages/EmpTickets/EmpTickets') );
const SelfAssessmentForm = lazy( () => import('./Pages/SelfAssessmentForm/SelfAssessmentForm') );
const GrowthReview = lazy( () => import('./Pages/GrowthReview/GrowthReview') );
const PeerReview = lazy( () => import('./Pages/PeerReview/PeerReview') );

const PurchaseRequisition = lazy( () => import('./Pages/Forms/PurchaseRequisition/PurchaseRequisition') );
const PurchaseOrder = lazy( () => import('./Pages/Forms/PurchaseOrder/PurchaseOrder') );

const DeliveryChallan = lazy( () => import('./Pages/Inventory/DeliveryChallan/DeliveryChallan') );

const Container = lazy( () => import('./Pages/Container/Container') );
const DailyMaintenance = lazy( () => import('./Pages/Inventory/DailyMaintenance/DailyMaintenance') );
const Products = lazy( () => import('./Pages/Inventory/Products/Products') );
const ProductDetails = lazy( () => import('./Pages/Inventory/Products/Details/Details') );
const Categories = lazy( () => import('./Pages/Inventory/Categories/Categories') );
const SubCategories = lazy( () => import('./Pages/Inventory/Categories/Sub-Categories/Sub-Categories') );
const Vendors = lazy( () => import('./Pages/Inventory/Vendors/Vendors') );
const HREmployee = lazy( () => import('./Pages/HR/Employee/Employee') );
const Locations = lazy( () => import('./Pages/Inventory/Locations/Locations') );
const Create = lazy( () => import('./Pages/Inventory/Products/Create/Create') );


const CashForm = lazy( () => import('./Pages/Cash/Form/Form') );
const CashRequests = lazy( () => import('./Pages/Cash/Requests/Requests') );
const CashDetails = lazy( () => import('./Pages/Cash/RequestDetails/RequestDetails') );
const RepairRequests = lazy( () => import('./Pages/Inventory/RepairRequests/RepairRequests') );


const AdvanceSalary = lazy( () => import('./Pages/AdvanceSalary/AdvanceSalary') );
const CSCRefund = lazy( () => import('./Pages/Refunds/CSCRefund/CSCRefund') );

const ShippingLinePayment = lazy( () => import('./Pages/Forms/ShippingLinePayment/ShippingLinePayment') );
const TemporaryEmployees = lazy( () => import('./Pages/HR/TemporaryEmployees/TemporaryEmployees') );
const AdminNotification = lazy( () => import('./Pages/AdminNotification/AdminNotification') );

const Dashboard = () => {
    
    const AccessControls = useSelector( ( state ) => state.EmpAuth.EmployeeData );
    const Menu = useSelector( ( state ) => state.EmpAuth.Menu );
    
    const history = useHistory();
    const key = 'real secret keys should be long and random';
    const encryptor = require('simple-encryptor')(key);

    const dispatch = useDispatch();
    const [ ShowBar, setShowBar ] = useState( false );

    useEffect(
        () => {
            
            if ( localStorage.getItem("Token") === undefined || localStorage.getItem("Token") === null )
            {
                history.replace("/login");
            }else
            {
                const d = new FormData();
                d.append('empID', localStorage.getItem('EmpID'));
                d.append('view', 'portal');
                axios.post('/getemployee', d).then(res => {
    
                    socket.open();
                    socket.emit(
                        'NewUser', localStorage.getItem('EmpID')
                    );
                    
                    dispatch(EmployeeLogin(res.data));
    
                }).catch(err => {
    
                    toast.dark(err, {
                        position: 'top-right',
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
    
                });
            }

        }, [ dispatch ]
    );

    const FormsLinks = ( clas, options ) => {

        if ($('.' + clas).find('i').hasClass('la-caret-right')) {
            $('.' + clas + ' .la-caret-right').removeClass('la-caret-right').addClass('la-caret-down');
            $('.' + options).slideDown();
        } else {
            $('.' + clas + ' .la-caret-down').removeClass('la-caret-down').addClass('la-caret-right');
            $('.' + options).slideUp();
        }

    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const SideBarClose = () => {

        dispatch( ShowSideBar( false ) );

    }

    // SIDEBAR LINKS
    let content = useMemo(
        () => {

            return (
                <div className="Dashboard_links">
                    {
                        Menu.map(
                            ( val, index ) => {

                                let access = val.access === null ? [] : JSON.parse( val.access );
                                let accessKey = val.access === null ? true : false;
                                let content = null;
                                if ( AccessControls.access )
                                {
                                    for ( let x = 0; x < access.length; x++ )
                                    {
                                        for ( let y = 0; y < JSON.parse(AccessControls.access).length; y++ )
                                        {
                                            if ( parseInt(JSON.parse(AccessControls.access)[y]) === parseInt(access[x]) )
                                            {
                                                accessKey = true;
                                            }
                                        }
                                    }

                                    if ( val.option_id !== null && accessKey )
                                    {
                                        content = <>
                                            <div key={ index } className={ "d-center links animate__animated ripple animate__bounceInLeft animate__fast " + val.menu_txt + val.option_id } onClick={() => FormsLinks(val.menu_txt + val.option_id, val.option_id)}>
                                                <div className="pr-3">
                                                    {
                                                        val.icon_class_name.includes('svg')
                                                        ?
                                                        parse(val.icon_class_name)
                                                        :
                                                        <i className={ val.icon_class_name }></i>
                                                    }
                                                </div>
                                                <div className="d-flex justify-content-between w-100">
                                                    <div className="links_txt"> { val.menu_txt } </div>
                                                    <div className="links_txt"><i className="las la-caret-right" style={{ 'fontSize': '12px' }}></i></div>
                                                </div>
                                            </div>
                                            <div className={ "Forms_options _options dropoptions " + val.option_id }>
    
                                                {
                                                    Menu.map(
                                                        val2 => {
    
                                                            let subAccess = val2.access === null ? [] : JSON.parse( val2.access );
                                                            let subAccessKey = val2.access === null ? true : false;
                                                            let sub_content = null;
                                                            for ( let x = 0; x < subAccess.length; x++ )
                                                            {
                                                                for ( let y = 0; y < JSON.parse(AccessControls.access).length; y++ )
                                                                {
                                                                    if ( parseInt(JSON.parse(AccessControls.access)[y]) === parseInt(subAccess[x]) )
                                                                    {
                                                                        subAccessKey = true;
                                                                    }
                                                                }
                                                            }
                                                            if ( val2.under_menu === val.option_id && subAccessKey )
                                                            {
                                                                sub_content = <>
                                                                    <NavLink key={ val2.menu_txt } activeClassName="Dashboard_active" to={ val2.link } className="d-center links animate__animated ripple animate__bounceInLeft animate__fast">
                                                                        <div className="pr-3">
                                                                            {
                                                                                val2.icon_class_name.includes('svg')
                                                                                ?
                                                                                parse(val2.icon_class_name)
                                                                                :
                                                                                <i className={ val2.icon_class_name }></i>
                                                                            }
                                                                        </div>
                                                                        <div className="links_txt">{ val2.menu_txt }</div>
                                                                    </NavLink>
                                                                </>
                                                            }
    
                                                            return sub_content;
    
                                                        }
                                                    )
                                                }
    
                                            </div>
                                        </>
                                    }else if ( val.under_menu === null && accessKey )
                                    {
                                        content = <>
                                            <NavLink key={ val.menu_txt } activeClassName="Dashboard_active" to={ val.link } className="d-center links animate__animated ripple animate__bounceInLeft animate__fast">
                                                <div className="pr-3">
                                                    {
                                                        val.icon_class_name.includes('svg')
                                                        ?
                                                        parse(val.icon_class_name)
                                                        :
                                                        <i className={ val.icon_class_name }></i>
                                                    }
                                                </div>
                                                <div className="links_txt">{ val.menu_txt }</div>
                                            </NavLink>
                                        </>
                                    }
                                }

                                return content;

                            }
                        )
                    }
                </div> 
            )

        }, [AccessControls, SideBarClose, Menu ]
    )

    if ( localStorage.getItem("Token") )
    {
        if 
        ( 
            parseInt( encryptor.decrypt( localStorage.getItem("Token") ) )
            !==
            parseInt( localStorage.getItem('EmpID') )
        )
        {
            history.replace("/login");
        }
    }

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
            <Suspense fallback={ Load }>
                <Middleware 
                    admin={props.admin}
                    guarded={props.guarded} 
                    hasAccess={props.access} 
                    user={AccessControls}
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
            <div className="Dashboard">

                {/* SideBar Start From Here */}
                {
                    // eslint-disable-next-line react-hooks/exhaustive-deps
                    useMemo(
                        () => {

                            return <SideBar Data={ content } show={ ShowBar } SideBarClose={ SideBarClose } />

                        }, [ ShowBar, content, SideBarClose ]
                    )
                }
                {/* SideBar End Here */}

                <div className="Dashboard_main_content">
                    {/* TopBar Start From Here */}
                    {
                        useMemo(
                            () => {

                                const ShowSide = () => {

                                    if ( ShowBar )
                                    {
                                        setShowBar( false );
                                    }else
                                    {
                                        setShowBar( true );
                                    }

                                }

                                return <TopBar sideBarTrue={ ShowSide } />

                            }, [ ShowBar ]
                        )
                    }

                    {/* TopBar End here */}
                    <div className="content" id="dashboard_content">
                        
                        {
                            Object.keys(AccessControls).length === 0
                            ?
                            <h6 className='text-center p-3 bg-white mb-0'>Please Wait....</h6>
                            :
                            <div className='popUps'>
                                <ChatBotNotification  />
                                <Route exact path='/dashboard' render={ () => <Sus content={ <Home /> } /> } />

                                <Route exact path='/chat' render={ () => <Sus content={ <Chat /> } admin guarded access={2} /> } />

                                <Route exact path='/attdevices' render={ () => <Sus content={ <Devices /> } /> } />
                                <Route exact path='/guests/view/guests' render={ () => <Sus content={ <Guests /> } /> } />
                                <Route exact path='/guests/view/employees' render={ () => <Sus content={ <Guests /> } /> } />

                                <Route exact path='/blackboard' render={ () => <Sus content={ <BlackBoard /> } /> } />

                                <Route exact path='/news' render={ () => <Sus content={ <News /> } /> } />
                                <Route exact path='/news/newspaper/:id' render={ () => <Sus content={ <NewsPaper /> } /> } />

                                <Route exact path='/help' render={ () => <Sus content={ <Help /> } /> } />
                                <Route exact path='/drive' render={ () => <Sus content={ <Drive /> } /> } />

                                <Route exact path='/leave_form' render={ () => <Sus content={ <LeaveApplication /> } /> } />
                                <Route exact path='/avail_leave_form' render={ () => <Sus content={ <LeaveApplication /> } /> } />
                                <Route exact path='/short_leave_form' render={ () => <Sus content={ <LeaveApplication /> } /> } />
                                <Route exact path='/leave_history' render={ () => <Sus content={ <LeaveApplication /> } /> } />
                                <Route exact path='/leave_request/:id' render={ () => <Sus content={ <LeaveApplication /> } /> } />

                                <Route exact path='/view_leave_requests' render={ () => <Sus content={ <LeaveRequests /> } /> } />

                                <Route exact path='/attendance_requests/view/list' render={ () => <Sus content={ <AttendanceRequest /> } /> } />
                                <Route exact path='/attendance_requests/view/details/:id' render={ () => <Sus content={ <AttendanceRequest /> } /> } />





                                <Route exact path='/attendance_request' render={ () => <Sus content={ <AttendanceRequestPrev /> } /> } />
                                <Route exact path='/attendance_request/:id' render={ () => <Sus content={ <AttendanceRequestPrev /> } /> } />
                                <Route exact path='/attendance_requests' render={ () => <Sus content={ <View_Emp_Attendance /> } /> } />

                                <Route exact path='/view_employees_attendance' render={ () => <Sus content={ <Attendance /> } /> } />

                                <Route exact path='/profile/:path/:link' render={ () => <Sus content={ <EmployeeProfile /> } /> } />
                                <Route exact path='/empdailyattendance' render={ () => <Sus content={ <DailyAttendance /> } /> } />

                                <Route exact path='/employeestickets/:path' render={ () => <Sus content={ <EmpTickets /> } /> } />
                                <Route exact path="/acr/options" render={ () => <Sus content={ <EmpTickets /> } /> } />
                                <Route exact path="/acr/self-assessment" render={ () => <Sus content={ <SelfAssessmentForm /> } /> } />
                                <Route exact path="/acr/self-assessment/details/:id" render={ () => <Sus content={ <EmpTickets /> } /> } />
                                <Route exact path="/acr/growth-review/new/:emp_id" render={ () => <Sus content={ <EmpTickets /> } /> } />
                                <Route exact path="/acr/growth-review/details/:id" render={ () => <Sus content={ <EmpTickets /> } /> } />
                                <Route exact path="/acr/growth-review/:emp_id" render={ () => <Sus content={ <EmpTickets /> } admin guarded access={5} authorization authorizationMethod="matchAuthKey" authorization_key={sessionStorage.getItem('authorization_key')} authorization_value={parseInt(window.location.href.split('/').pop())} authorization_expression={"equal"} /> } />
                                {/* <Route exact path="/acr/growth-review" render={ () => <Sus content={ <GrowthReview /> } /> } /> */}
                                <Route exact path="/acr/peer-review/:emp_id" render={ () => <Sus content={ <PeerReview /> } /> } />
                                <Route exact path="/acr/peer-review/emp/:emp_id" render={ () => <Sus content={ <EmpTickets /> } /> } />
                                <Route exact path="/acr/peer-review/details/:id" render={ () => <Sus content={ <EmpTickets /> } /> } />
                                <Route exact path="/acr/form/:path" render={ () => <Sus content={ <EmpTickets /> } /> } />






                                <Route exact path="/hr/temporary/employees/details/:emp_id" render={ () => <Sus content={ <TemporaryEmployees /> } /> } />
                                <Route exact path="/hr/temporary/employees/form" render={ () => <Sus content={ <TemporaryEmployees /> } /> } />
                                <Route exact path="/hr/temporary/employees/list" render={ () => <Sus content={ <TemporaryEmployees /> } /> } />


                                <Route exact path="/hr/employee/list" render={ () => <Sus content={ <HREmployee /> } /> } />
                                <Route exact path="/hr/employee/details/:id" render={ () => <Sus content={ <HREmployee /> } /> } />
                                <Route exact path="/hr/employee/edit/:id" render={ () => <Sus content={ <HREmployee /> } /> } />


                                <Route exact path="/inventory/challan/:path" render={ () => <Sus content={ <DeliveryChallan /> } /> } />
                                <Route exact path="/inventory/workshop/daily_maintenance" render={ () => <Sus content={ <DailyMaintenance /> } /> } />
                                <Route exact path="/inventory/workshop/checklist" render={ () => <Sus content={ <DailyMaintenance /> } /> } />
                                <Route exact path="/inventory/workshop/report/:report_id" render={ () => <Sus content={ <DailyMaintenance /> } /> } />
                                <Route exact path="/inventory/products/list" render={ () => <Sus content={ <Products /> } /> } />
                                <Route exact path="/inventory/products/create" render={ () => <Sus content={ <Create /> } /> } />
                                <Route exact path="/inventory/products/details/:id" render={ () => <Sus content={ <ProductDetails /> } /> } />
                                <Route exact path="/inventory/categories/list" render={ () => <Sus content={ <Categories /> } /> } />
                                <Route exact path="/inventory/category/sub-categories/:category_id" render={ () => <Sus content={ <SubCategories /> } /> } />
                                <Route exact path="/inventory/vendors/list" render={ () => <Sus content={ <Vendors /> } /> } />
                                <Route exact path="/inventory/vendor/:id" render={ () => <Sus content={ <Vendors /> } /> } />
                                <Route exact path="/inventory/locations" render={ () => <Sus content={ <Locations /> } /> } />
                                <Route exact path="/inventory/location/:location_code/sub-locations" render={ () => <Sus content={ <Locations /> } /> } />
                                
                                <Route exact path="/employment_setup" render={ () => <Sus content={ <EmploymentForm /> } /> } />
                                <Route exact path="/employment_setup/form" render={ () => <Sus content={ <EmploymentForm /> } /> } />
                                <Route exact path="/employment_setup/requests" render={ () => <Sus content={ <EmploymentRequests /> } /> } />
                                <Route exact path="/employment_setup/requests/:id" render={ () => <Sus content={ <ViewTempEmployee /> } /> } />
                                <Route exact path="/employment_setup/requests/confirm/:id" render={ () => <Sus content={ <ConfirmApproval /> } /> } />
                                <Route exact path="/employment_setup/employees" render={ () => <Sus content={ <ViewEmployees /> } /> } />
                                
                                <Route exact path='/notices/management' render={ () => <Sus content={ <AdminNotification /> } /> } />

                                {/* 
                                    FOR STORE MODULE
                                */}
                                <Route exact path="/store/inventory_requests" render={ () => <Sus content={ <InventoryRequests /> } /> } />
                                <Route exact path="/store/items" render={ () => <Sus content={ <Items /> } /> } />
                                <Route exact path="/store/items/index=:index" render={ () => <Sus content={ <Items /> } /> } />
                                <Route exact path="/store/inward" render={ () => <Sus content={ <Inward /> } /> } />

                                {/* 
                                    FOR ITEM REQUESTS
                                */}
                                <Route exact path="/item_requests" render={ () => <Sus content={ <ItemRequest /> } /> } />
                                <Route exact path="/item_requests/:path" render={ () => <Sus content={ <ItemRequest /> } /> } />
                                <Route exact path="/item_requests/:path/id=:index" render={ () => <Sus content={ <ItemRequest /> } /> } />
                                

                                {/* REPAIR REQUEST */}
                                <Route exact path="/repair_request" render={ () => <Sus content={ <RepairRequest /> } /> } />
                                <Route exact path="/repair_request/new_repair" render={ () => <Sus content={ <RepairRequest /> } /> } />
                                <Route exact path="/repair_request/new_incident" render={ () => <Sus content={ <RepairRequest /> } /> } />
                                <Route exact path="/repair_request/details/:id" render={ () => <Sus content={ <RepairRequest /> } /> } />
                                <Route exact path="/repair_request/incident/details/:id" render={ () => <Sus content={ <RepairRequest /> } /> } />
                                
                                {/* PURCAHSE REQUISITION */}
                                <Route exact path="/purchase/requisition/form" render={ () => <Sus content={ <PurchaseRequisition /> } /> } />
                                <Route exact path="/purchase/requisition/requests" render={ () => <Sus content={ <PurchaseRequisition /> } /> } />
                                <Route exact path="/purchase/requisition/details" render={ () => <Sus content={ <PurchaseRequisition /> } /> } />
                                <Route exact path="/purchase/requisition/form&&pr_id=:id" render={ () => <Sus content={ <PurchaseRequisition /> } /> } />
                                
                                {/* PURCAHSE ORDER */}
                                <Route exact path="/purchase/order/form" render={ () => <Sus content={ <PurchaseOrder /> } /> } />
                                <Route exact path="/purchase/order/form&&po_id=:id" render={ () => <Sus content={ <PurchaseOrder /> } /> } />
                                <Route exact path="/purchase/order/requests" render={ () => <Sus content={ <PurchaseOrder /> } /> } />
                                <Route exact path="/purchase/order/details" render={ () => <Sus content={ <PurchaseOrder /> } /> } />
                                
                                {/* 
                                    For Container
                                */}
                                <Route exact path="/logistics/container/:path" render={ () => <Sus content={ <Container /> } /> } />
                                
                                {/* CASH DEPARTMENT */}
                                <Route exact path="/cash/form" render={ () => <Sus content={ <CashForm /> } /> } />
                                <Route exact path="/cash/requests" render={ () => <Sus content={ <CashRequests /> } /> } />
                                <Route exact path="/cash/request/:id" render={ () => <Sus content={ <CashDetails /> } /> } />
                                
                                <Route exact path="/inventory/repair/requests" render={ () => <Sus content={ <RepairRequests /> } /> } />
                                <Route exact path="/inventory/repair/request/:id" render={ () => <Sus content={ <RepairRequests /> } /> } />

                                <Route exact path="/cash/advance/salary" render={ () => <Sus content={ <AdvanceSalary /> } /> } />
                                <Route exact path="/cash/advance/salary/form" render={ () => <Sus content={ <AdvanceSalary /> } /> } />
                                <Route exact path="/cash/advance/salary/request/:id" render={ () => <Sus content={ <AdvanceSalary /> } /> } />

                                <Route exact path="/refund/csc/list" render={ () => <Sus content={ <CSCRefund /> } /> } />
                                <Route exact path="/refund/csc/new" render={ () => <Sus content={ <CSCRefund /> } /> } />
                                <Route exact path="/refund/csc/view/:id" render={ () => <Sus content={ <CSCRefund /> } /> } />

                                <Route exact path="/cash/shipping/line/list" render={ () => <Sus content={ <ShippingLinePayment /> } /> } />
                                <Route exact path="/cash/shipping/line/form" render={ () => <Sus content={ <ShippingLinePayment /> } /> } />
                                <Route exact path="/cash/shipping/line/details/:id" render={ () => <Sus content={ <ShippingLinePayment /> } /> } />
                            </div>
                        }
                    </div>

                </div>

            </div>
        </>
    )

};

export default Dashboard;