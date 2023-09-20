/* eslint-disable react-hooks/exhaustive-deps */
import React, { Suspense, lazy, useEffect, useState, useMemo } from "react";

import { ToastContainer, toast } from "react-toastify";
import Modal from "../../../../../UI/Modal/Modal";
import axios from "../../../../../../axios";
import $ from 'jquery';

// LOADING IMAGE
import Loader from '../../../../../../images/loadingIcons/icons8-iphone-spinner.gif';

// CSS FILE
import './ViewPurchaseOrder.css';

// REACT REDUX PACKAGES
import { useSelector } from "react-redux";
// IMPORT SOCKET INSTANCE
import socket from '../../../../../../io';

// REACT ROUTING PACKAGES
import { Route, useHistory } from "react-router-dom";

// ! IMPORTANT COMPONENTS
// SEARCH BAR COMPONENT
import SearchBar from "./Components/SearchBar/SearchBar";
// REQUESTS COMPONENT
// ALL PURCHASE ORDER REQUEST WILL LISTED
const Requests = lazy( () => import("./Components/Requests/Requests") );
// HOME COMPONENT WHERE EMPLOYEE CAN VIEW THE STATUS OF THE REQUESTS AND OTHER USE FULL INFORMATION
const Home = lazy( () => import("./Components/Home/Home") );
// FORM COMPONENT TO VIEW THE REQUEST DETAILS ( PURCHASE ORDER ) IN FORM VIEW
const Form = lazy( () => import("./Components/Form/PreviousRequest") );
// FORM COMPONENT TO VIEW THE REQUEST DETAILS ( PURCHASE REQUISITION ) IN FORM VIEW
const PRForm = lazy( () => import("./Components/PurchaseRequisition/PurchaseRequisition") );
// CUSTOM QUOTATIONS COMPONENT TO VIEW THE ATTACHED QUOTATIONS WITH PURCHASE REQUISITION
const Quotations = lazy( () => import("./Components/Quotations/Quotations") );
// CUSTOM BILLS COMPONENT TO VIEW THE ATTACHED BILLS WITH PURCHASE ORDER
const Bills = lazy( () => import("./Components/Bills/Bills") );
// CUSTOM VOUCHERS COMPONENT TO VIEW THE ATTACHED VOUCHERS WITH PURCHASE ORDER
const Vouchers = lazy( () => import("./Components/Vouchers/Vouchers") );
// ! IMPORTANT COMPONENTS END

// RETURN JSX
const ViewPurchaseOrder = () => {

    // REACT STATES
    // TO TOGGLE MODAL HIDE/SHOW
    const [ ModalShow, setModalShow ] = useState( false );
    // TO SET CUSTOM MODAL JSX CONTENT
    const [ModalContent, setModalContent] = useState(<></>);
    // MONTHLY REQUESTS LIST
    const [MonthlyRequests, setMonthlyRequests] = useState([]);
    // ! SEARCH FILTERS
    // SEARCH BY NAME
    const [Key, setKey] = useState(
        {
            column: 'employees.name',
            value: ''
        }
    );
    // SEARCH BY COMPANY
    const [Company, setCompany] = useState(
        {
            column: 'companies.company_code',
            value: ''
        }
    );
    // SEARCH BY LOCATION
    const [Location, setLocation] = useState(
        {
            column: 'locations.location_code',
            value: ''
        }
    );
    // SEARCH BY STATUS
    const [Status, setStatus] = useState(
        {
            column: 'invtry_purchase_order.status',
            value: ''
        }
    );
    // SEARCH BY DATE
    const [MyDate, setMyDate] = useState(
        {
            column: 'invtry_purchase_order.request_date',
            value: ''
        }
    );
    // LOCATIONS LIST
    const [Companies, setCompanies] = useState([]);
    // COMPANIES LIST
    const [Locations, setLocations] = useState([]);
    // PURCHASE ORDERS LIST
    const [PurchaseOrders, setPurchaseOrders] = useState([]);
    // PURCHASE ORDER'S STATUSES LIST
    const [CountStatus, setCountStatus] = useState([]);
    // REQEUST DETAILS STATE
    const [Details, setDetails] = useState([]);
    // TO SAVE THE PURCHASE ORDER DETAILS
    const [PurchaseOrderDetails, setPurchaseOrderDetails] = useState(
        {
            info: [],
            specifications: [],
            venders: []
        }
    );
    // TO SAVE THE PURCHASE REQUISITION DETAILS
    // * IF ANY
    const [PurchaseRequisitionDetails, setPurchaseRequisitionDetails] = useState(
        {
            info: [],
            specifications: [],
        }
    );
    // FOR THE CURRENT PO ID
    const [POID, setPOID] = useState(0);

    // ATTACHED QUOTATIONS LIST
    const [ AttachQuotations, setAttachQuotations ] = useState([]);
    // TO VIEW THE ATTACHED QUOTATION (PREVIEW) 
    const [ QuotationPreview, setQuotationPreview ] = useState([]);
    // ATTACHED BILLS LIST
    const [ AttachBills, setAttachBills ] = useState([]);
    // TO VIEW THE ATTACHED BILL (PREVIEW) 
    const [ BillPreview, setBillPreview ] = useState([]);
    // ATTACHED VOUCHERS LIST
    const [ AttachVouchers, setAttachVouchers ] = useState([]);
    // TO VIEW THE ATTACHED VOUCHER (PREVIEW) 
    const [ VoucherPreview, setVoucherPreview ] = useState([]);
    // FOR WINDOW LOCATION (URL)
    const [ WindowLocation, setWindowLocation ] = useState();

    // ! CURRENT EMPLOYEE DATA
    // RETRIEVE FROM REACT REDUX
    const EmpData = useSelector((state) => state.EmpAuth.EmployeeData);

    // REACT NAVIGATION
    const history = useHistory();

    // TO SAVE THE LOCATION URL
    useMemo(
        () => {

            return setWindowLocation( window.location.href.split('/').pop().split('id=').pop() );

        }, [ parseInt( window.location.href.split('/').pop().split('id=').pop() ) ]
    )

    // TODO: REACT LIFECYCLE
    useEffect(
        () => {

            if ( !isNaN( parseInt( WindowLocation ) ) )
            {
                let po_id = window.location.href.split('/').pop().split('id=').pop(); // RETURNS AN ID ( PO ID ) FROM THE URL

                // GET PURCHASE ORDER'S PURCHASE REQUISITION ID
                axios.post(
                    '/getpridfrompo',
                    {
                        po_id: po_id
                    }
                ).then(
                    ( res ) => {

                        axios.post(
                            '/getpurchaseorderdetails',
                            {
                                pr_id: res.data[0] ? res.data[0].pr_id : null,
                                po_id: po_id
                            }
                        ).then(
                            (res) => {

                                setQuotationPreview([]);
                                setBillPreview([]);
                                setVoucherPreview([]);
                                
                                let poInfo = res.data[0];
                                if ( res.data[4][0] )
                                {
                                    poInfo[0].pr_code = res.data[4][0].pr_code;
                                }
                                setDetails( res.data[0] );
                                setPurchaseOrderDetails(
                                    {
                                        ...PurchaseOrderDetails,
                                        info: poInfo,
                                        specifications: res.data[1],
                                        venders: res.data[3]
                                    }
                                )
                                setAttachBills( res.data[2] );
                                setAttachVouchers( res.data[7] );
                                if ( res.data[4][0] )
                                {
                                    setPurchaseRequisitionDetails(
                                        {
                                            ...PurchaseRequisitionDetails,
                                            info: res.data[4],
                                            specifications: res.data[5],
                                        }
                                    )

                                    setAttachQuotations( res.data[6] );
                                }else
                                {
                                    setPurchaseRequisitionDetails(
                                        {
                                            ...PurchaseRequisitionDetails,
                                            info: [],
                                            specifications: [],
                                        }
                                    )

                                    setAttachQuotations([]);
                                }
                                
                                setPOID( parseInt( po_id ) );
            
                            }
                        ).catch(err => {
            
                            console.log(err);
            
                        });
                    
                    }
                )
            }

        }, [ WindowLocation ]
    )

    // TODO: REACT LIFECYCLE
    useEffect(
        () => {

            // CALL FUNCTION TO GET ALL PURCHASE ORDER REQUESTS
            // WHICH ARE SORTED AND FILTERS
            SortedPO();

        }, [ Key, Company, Location, Status, MyDate ]
    )

    // TODO: REACT LIFECYCLE
    useEffect(
        () => {

            socket.on(
                'newpurchaseorder', () => {
                    
                    GetAllPO();
            
                }
            )

            // CALL FUNCTION TO GET ALL PURCHASE ORDERS
            GetAllPO();
            // CALL FUNCTION TO GET ALL COMPANIES LIST
            AllCompanies();
            // CALL FUNCTION TO GET ALL LOCATIONS LIST
            AllLocations();

        }, []
    )

    // GET ALL PURCHASE ORDERS
    // ALL REQUESTS WILL RETRIEVE
    const GetAllPO = () => {

        let val = {
            emp_id: EmpData.emp_id,
            access: EmpData.access
        }
        axios.post('/getallpo', { myData: JSON.stringify(val) }).then(response => {

            setPurchaseOrders( response.data );

        }).catch(error => {

            console.log(error);

        });

    }

    // THIS FUNCTION IS TO SORT THE REQUEST LIST
    // BY COMPANY, LOCATION, STATUS, DATE
    const SortedPO = () => {

        let val = {
            emp_id: EmpData.emp_id,
            access: EmpData.access
        }

        let filters = [
            Key,
            Company,
            Location,
            Status,
            MyDate
        ]

        axios.post('/getallposorted', { myData: JSON.stringify(val), filters: filters }).then(response => {

            // SET SORTED DATA 
            setPurchaseOrders(response.data);

            // ARRAY OF THE STATUES
            let arr = [];
            for( let x = 0; x < response.data.length; x++ )
            {

                arr.push(response.data[x].status)

            }

            // SET STATUES TO THE REACT STATE
            setCountStatus( arr );

        }).catch(error => {

            console.log(error);

        });

    }

    // TO HIDE AND SHOW THE CUSTOM MODAL COMPONENT
    const HideModelFunction = () => {

        setModalShow( !ModalShow );

    }

    // TO SEARCH PURCHASE ORDERS BY DIFFERENT WAYS
    const onSearchPO = ( column, e ) => {

        const { value } = e.target;

        if ( column === 'Key' ) // IF EMPLOYEE SEARCH THE REQUESTS BY NAME
        {
            setKey(
                {
                    ...Key,
                    value: value
                }
            );
        }else if ( column === 'Company' ) // IF EMPLOYEE SEARCH THE REQUESTS BY COMPANY
        {
            setCompany(
                {
                    ...Company,
                    value: value
                }
            );
        }else if ( column === 'Location' ) // IF EMPLOYEE SEARCH THE REQUESTS BY LOCATION
        {
            setLocation(
                {
                    ...Location,
                    value: value
                }
            );
        }else if ( column === 'Status' ) // IF EMPLOYEE SEARCH THE REQUESTS BY STATUS
        {
            setStatus(
                {
                    ...Status,
                    value: value
                }
            );
        }else // IF EMPLOYEE SEARCH THE REQUESTS BY DATE
        {
            setMyDate(
                {
                    ...MyDate,
                    value: value
                }
            );
        }


        // IF THE SEARCH FILTERS OR FIELDS ARE EMPTY
        if ( column === 'Key' && value === '' )
        {
            setKey(
                {
                    ...Key,
                    value: ''
                }
            );
        }else if ( column === 'Company' && value === '' )
        {
            setCompany(
                {
                    ...Company,
                    value: ''
                }
            );
        }else if ( column === 'Location' && value === '' )
        {
            setLocation(
                {
                    ...Location,
                    value: ''
                }
            );
        }else if ( column === 'Status' && value === '' )
        {
            setStatus(
                {
                    ...Status,
                    value: ''
                }
            );
        }else if ( column === 'MyDate' && value === '' )
        {
            setMyDate(
                {
                    ...MyDate,
                    value: ''
                }
            );
        }

    }

    // WHEN EMPLOYEE SELECTS A COMPANY TO FILTER THE REQUESTS
    const onChangeCompany = (e) => {

        onSearchPO('Company', e);
        if ( e.target.value !== '' ) // IF VALUE IS NOT EMPTY
        {
            // GET COMPANY LOCATIONS
            axios.post('/getcompanylocations', { company_code: e.target.value }).then(response => {
    
                setLocations(response.data);
    
            }).catch(error => {
    
                console.log(error);
    
            });
        }else
        {
            AllLocations();
        }

    }

    // WHEN EMPLOYEE SELECTS A LOCATION TO FILTER THE REQUESTS
    const onChangeLocation = ( e ) => {

        onSearchPO('Location', e);
        AllLocations();

    }

    // GET ALL LOCATIONS FROM THE DATABASE
    const AllLocations = () => {

        axios.get('/getalllocations').then(response => {

            setLocations(response.data);

        }).catch(error => {

            console.log(error);

        });

    }

    // GET ALL COMPANIES FROM THE DATABASE
    const AllCompanies = () => {

        axios.get('/getallcompanies').then(response => {

            setCompanies( response.data );

        }).catch(error => {

            console.log(error);

        });

    }

    // WHEN EMPLOYEE CLICKS ON AN INDIVIDUAL REQUEST TO VIEW ITS DETAILS
    // THIS FUNCTIONS WILL CALL WHICH RETRIEVE THE DETAILS
    const ViewRequestDetails = ( po_id, status ) => {

        if ( status === "Sent" )
        {
            if 
            ( 
                JSON.parse( EmpData.access ).includes(523) || 
                JSON.parse( EmpData.access ).includes(524) || 
                JSON.parse( EmpData.access ).includes(1) 
            )
            {
                const Data2 = new FormData();
                Data2.append('poID', po_id);
                Data2.append('empID', EmpData.emp_id);
                axios.post('/setpotoviewed', Data2).then( // SET THAT REQUEST'S STATUS TO VIEWED
                    () => {
    
                        socket.emit('newpurchaseorder');
        
                    }
        
                ).catch(
                    (err) => {
        
                        console.log(err);
        
                    }
                )
            }
        }

    }

    // WHEN EMPLOYEE WANTS TO PREVIEW THE ATTACHED QUOTATIONS
    const PreviewQuotation = ( id ) => {

        let array = [];
        if ( AttachQuotations[0].image )
        {
            array = AttachQuotations.filter(
                ( val, index, arr ) => {
          
                  return arr[index].image === arr[id].image;
          
                }
            )
        }else
        {
            array = AttachQuotations.filter(
                ( val, index, arr ) => {
          
                  return arr[index].name === arr[id].name;
          
                }
            )
        }
        
      
        setQuotationPreview( array );

    }

    // WHEN EMPLOYEE WANT TO SEE THE PREVIEW THE ATTACHED BILLS
    const PreviewBill = ( id ) => {

        let array = [];
        if ( AttachBills[0].image )
        {
            array = AttachBills.filter(
                ( val, index, arr ) => {
          
                  return arr[index].image === arr[id].image;
          
                }
            )
        }else
        {
            array = AttachBills.filter(
                ( val, index, arr ) => {
          
                  return arr[index].name === arr[id].name;
          
                }
            )
        }
        
      
        setBillPreview( array );

    }

    // WHEN EMPLOYEE WANT TO SEE THE PREVIEW THE ATTACHED VOUCHERS
    const PreviewVoucher = ( id ) => {

        let array = [];
        if ( AttachVouchers[0].image )
        {
            array = AttachVouchers.filter(
                ( val, index, arr ) => {
          
                  return arr[index].image === arr[id].image;
          
                }
            )
        }else
        {
            array = AttachVouchers.filter(
                ( val, index, arr ) => {
          
                  return arr[index].name === arr[id].name;
          
                }
            )
        }
        
      
        setVoucherPreview( array );

    }

    // ON ATTACH VOUCHERS TO THE REQUEST
    const onAttachVouchers = ( e ) => {

        const reader = new FileReader();
        const { files } = e.target;

        reader.onload = () => {

            if (reader.readyState === 2) {
                let arr = [];
                // let invoAttachments = document.querySelector('.invoAttachments');

                for (let x = 0; x < files.length; x++) {
                    arr.push(
                        {
                            name: files[x].name,
                            file: files[x]
                        }
                    )
                }

                setAttachVouchers( arr );
            }



        }

        if (files[0]) {
            reader.readAsDataURL(files[0]);
        }

    }

    // WHEN EMPLOYEE WANTS TO REMOVE A VOUCHER FROM THE ATTACHMENT LIST
    const RemoveVoucher = ( id ) => {

        let array = AttachVouchers.filter(
            ( val, index, arr ) => {
      
              return arr[index].name !== arr[id].name;
      
            }
        )
      
        setAttachVouchers( array );
        setVoucherPreview([]);

    }

    // IF EMPLOYEE WANTS TO DISCARD THE REQUEST
    const onDiscard = ( poID ) => {

        setModalContent(
            <div>
                <p>Do you want to discard this request?</p>
                <form onSubmit={(e) => DiscardRequest(poID, e)}>
                    <textarea 
                        style={
                            {
                                fontSize: '13px'
                            }
                        }
                        name='remarks' 
                        className="form-control mb-3" 
                        placeholder="Add Remarks" 
                        required 
                        minLength="10"
                     />
                    <button type="submit" className="btn btn-sm btn-danger d-block ml-auto px-3">Yes</button>
                </form>
            </div>
        )

        HideModelFunction();

    }

    
    // IF EMPLOYEE WANTS TO APPROVE THE REQUEST
    const onApprove = ( poID ) => {

        if ( AttachVouchers.length === 0 )
        {
            toast.dark('Please attach at least one voucher', {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }else
        {
            setModalContent(
                <div>
                    <p>Do you want to approve this request?</p>
                    <form onSubmit={(e) => ApproveRequest(poID, e)}>
                        <textarea 
                            style={
                                {
                                    fontSize: '13px'
                                }
                            }
                            name='remarks' 
                            className="form-control mb-3" 
                            placeholder="Add Remarks" 
                            required 
                            minLength="10"
                         />
                        <button type="submit" className="btn btn-sm btn-success d-block ml-auto px-3">Yes</button>
                    </form>
                </div>
            )
    
            HideModelFunction();
        }


    }

    // THIS FUNCTION WILL DISCARD THE CURRENT REQUEST
    const DiscardRequest = ( poID, e ) => {

        e.preventDefault();

        const Data = new FormData();
        Data.append('poID', poID);
        Data.append('empID', EmpData.emp_id);
        Data.append('remarks', e.target['remarks'].value);
        axios.post('/setpotodiscard', Data).then(
            () => {

                const Data2 = new FormData();
                Data2.append('eventID', 3);
                Data2.append('link', '');
                Data2.append('receiverID', Details[0].request_by);
                Data2.append('senderID', localStorage.getItem('EmpID'));
                Data2.append('Title', localStorage.getItem('name'));
                Data2.append('NotificationBody', localStorage.getItem('name') + " has discard your purchase order with id#" + Details[0].po_code + " under this reason '" + e.target['remarks'].value + "'");
                axios.post('/newnotification', Data2).then(() => {

                    axios.post('/sendmail', Data2).then(() => {

                        socket.emit('newpurchaseorder');
                        history.replace('/purchaseorder/window=purchaseorder&&id=' + ( poID - 1 ) );
                        setTimeout(() => {
                            history.replace('/purchaseorder/window=purchaseorder&&id=' + poID );
                        }, 100);
                        SortedPO();

                    })
                })

                toast.dark('Request has been Discard', {
                    position: 'top-right',
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });

                setModalShow(false);

            }

        ).catch(
            (err) => {

                console.log(err);

            }
        )

    }

    // THIS FUNCTION WILL APPROVE THE CURRENT REQUEST
    const ApproveRequest = ( poID, e ) => {

        e.preventDefault();

        const Data = new FormData();
        Data.append('poID', poID);
        Data.append('empID', EmpData.emp_id);
        Data.append('remarks', e.target['remarks'].value);
        AttachVouchers.forEach(file => {
            Data.append("Attachments", file.file);
        });
        axios.post(
            '/setpotoapprove', 
            Data,
            {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            }
        ).then(
            () => {

                setModalShow(false);

                const Data2 = new FormData();
                Data2.append('eventID', 3);
                Data2.append('receiverID', Details[0].request_by);
                Data2.append('senderID', localStorage.getItem('EmpID'));
                Data2.append('Title', localStorage.getItem('name'));
                Data2.append('NotificationBody', localStorage.getItem('name') + " has approved your purchase order with id#" + Details[0].po_code);
                axios.post('/newnotification', Data2).then(() => {
                    
                    axios.post('/sendmail', Data2).then(() => {

                        socket.emit('newpurchaseorder');
                        history.replace('/purchaseorder/window=purchaseorder&&id=' + ( poID - 1 ) );
                        setTimeout(() => {
                            history.replace('/purchaseorder/window=purchaseorder&&id=' + poID );
                        }, 100);
                        SortedPO();

                    })
                })

                toast.dark('Request has been approved'.toString(), {
                    position: 'top-right',
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });

            }
        ).catch(
            (err) => {

                console.log(err);

            }
        )

    }

    // IF EMPLOYEE PRINTS THE REQUEST
    const Print = ( id ) => {

        // let pr = PurchaseRequisitionDetails.info[0] ? PurchaseRequisitionDetails.info[0].pr_id : 0;
        let iframe = document.getElementById('po');
        // iframe.src = 'https://' + window.location.host + '/#/view=purchase_order/' + id + '/' + pr
        iframe.contentWindow.print();
        setTimeout(() => {
            iframe.contentWindow.print();
        }, 500);

    }

    const CollapseRequests = () => {

        $('.ViewPurchaseOrderContainer .ViewPurchaseOrderGridContainer').toggleClass('d-block');
        $('.ViewPurchaseOrderContainer .ViewPurchaseOrderGridContainer .Right.RequestDetails .PreviewWindow .openBtn').toggleClass('d-block');
        $('.ViewPurchaseOrderContainer .ViewPurchaseOrderGridContainer .Left.RequestsList').toggle('slow');

    }

    return (
        // ViewPurchaseOrderContainer START
        // PARENT CONTAINER
        // TO VIEW THE PURCHASE ORDERS
        <div className="ViewPurchaseOrderContainer">

            {/* TO SHOW THE TOASTS */}
            <ToastContainer />
            {/* CUSTOM MODAL */}
            {/* COMPONENT */}
            <Modal show={ ModalShow } Hide={ HideModelFunction } content={ ModalContent } />
            <iframe 
                title="po" 
                id="po" 
                className="d-none w-100"
                src={ 'https://' + window.location.host + '/#/view=purchase_order/' + POID + '/' + ( PurchaseRequisitionDetails.info[0] ? PurchaseRequisitionDetails.info[0].pr_id : 0 ) }
            >
            </iframe>

            <Suspense fallback=
                {
                    <div className="w-100 d-flex justify-content-center mt-5">
                        <div>
                            <img className="rounded-circle" src={ Loader } width="60" height="60" alt="Loading...." />
                            <p className="mb-0">Processing....</p>
                        </div>
                    </div>
                }
            >
                {/* TOP BAR COMPONENT */}
                {/* WHERE EMPLOYEE CAN SEARCH REQUESTS */}
                {/* BY COMPANY, BY LOCATION, BY STATUS, BY DATE */}
                {
                    useMemo(
                        () => {

                            return (
                                    <SearchBar 
                                        Locations={ Locations }
                                        Companies={ Companies }

                                        // FUNCTIONS
                                        onChangeLocation={ onChangeLocation }
                                        onChangeCompany={ onChangeCompany }
                                        onSearchPO={ onSearchPO }
                                    />
                            )

                        }, [ Locations, Companies ]
                    )
                }
            </Suspense>

            {/* GRID CONTAINER */}
            {/* MAIN CONTENT */}
            {/* WHERE EMPLOYEE CAN VIEW THE REQUESTS AND PROCEED THE IT */}
            <div className="ViewPurchaseOrderGridContainer">

                <Suspense fallback=
                    {
                        <div className="w-100 d-flex justify-content-center mt-5">
                            <div className="text-center">
                                <img className="rounded-circle" src={ Loader } width="60" height="60" alt="Loading...." />
                                <p className="mb-0">Loading Requests</p>
                            </div>
                        </div>
                    }
                >
                    {/* LEFT SIDE */}
                    {/* REQUESTS LIST */}
                    {/* IN DESCENDING ORDER */}
                    <div className="Left RequestsList">
                        <button onClick={ CollapseRequests } className="btn btn-sm collapseBtn btn-dark"><i className="las la-chevron-left"></i></button>
                            {/* MAPPING THE REQUESTS */}
                            {/* ALL REQUESTS ARE LISTED HERE */}
                            {/* LIST CONTAINER */}
                            {
                                PurchaseOrders.map(
                                    (val, index) => {

                                        const d = new Date(val.request_date);

                                        return (
                                            <>
                                                {/* PURCHASE ORDER LIST COMPONENT */}
                                                <Requests
                                                    key={ index } 
                                                    data={ val } 
                                                    date={ d } 
                                                    EmpData={ EmpData }

                                                    // FUNCTIONS
                                                    ViewRequestDetails={ ViewRequestDetails } 
                                                />
                                            </>
                                        )
                                    }
                                )
                            }


                    </div>
                </Suspense>

                {/* RIGHT SIDE */}
                {/* REQUEST DETAILS */}
                {/* MAIN CONTENT */}
                <div className="Right RequestDetails">

                    {/* PREVIEW WINDOW */}
                    {/* ROUTES */}
                    <div className="PreviewWindow">
                            <button onClick={ CollapseRequests } className="btn btn-sm openBtn btn-dark mb-2"><i className="las la-chevron-down"></i></button>

                            {/* HOME ROUTE */}
                            <Route
                                exact
                                path="/purchaseorder/home"
                                render={
                                    () =>
                                        <Suspense
                                            fallback={
                                                <div className="w-100 d-flex justify-content-center mt-5">
                                                    <div>
                                                        <img className="rounded-circle" src={ Loader } width="60" height="60" alt="Loading...." />
                                                        <p className="mb-0">Please Wait</p>
                                                    </div>
                                                </div>
                                            }
                                        >
                                            <Home
                                                ViewRequest={ PurchaseOrders }
                                                CountRequests={ PurchaseOrders.length }
                                                CountStatus={ CountStatus }
                                                MonthlyRequests={ MonthlyRequests }
                                                EmpData={ EmpData }
                                            />
                                        </Suspense>
                                }
                            />

                            {/* VIEW PURCHASE ORDER DETAILS */}
                            {/* DEFAULT */}
                            <Route
                                exact
                                path="/purchaseorder/window=purchaseorder&&id=:id"
                                render={
                                    () =>
                                        <Suspense
                                            fallback={
                                                <div className="w-100 d-flex justify-content-center mt-5">
                                                    <div>
                                                        <img className="rounded-circle" src={ Loader } width="60" height="60" alt="Loading...." />
                                                        <p className="mb-0">Please Wait</p>
                                                    </div>
                                                </div>
                                            }
                                        >
                                            <Form
                                                PurchaseOrderDetails={ PurchaseOrderDetails }
                                            />
                                        </Suspense>
                                }
                            />

                            {/* VIEW PURCHASE REQUISITION DETAILS */}
                            {/* IF ANY */}
                            <Route
                                exact
                                path="/purchaseorder/window=purchaserequisition&&id=:id"
                                render={
                                    () =>
                                        <Suspense
                                            fallback={
                                                <div className="w-100 d-flex justify-content-center mt-5">
                                                    <div>
                                                        <img className="rounded-circle" src={ Loader } width="60" height="60" alt="Loading...." />
                                                        <p className="mb-0">Please Wait</p>
                                                    </div>
                                                </div>
                                            }
                                        >
                                            <PRForm
                                                PurchaseRequisitionDetails={ PurchaseRequisitionDetails }
                                            />
                                        </Suspense>
                                }
                            />
                            
                            {/* TO VIEW THE ATTACHED QUOTATIONS WITH THE PURCHASE REQUISITION */}
                            {/* IF ANY PURCHASE ORDER */}
                            {/* BECAUSE THE QUOTATIONS HAS ATTACHED WITH PURCHASE REQUISITION */}
                            <Route
                                exact
                                path="/purchaseorder/window=quotations&&id=:id"
                                render={
                                    () =>
                                        <Suspense
                                            fallback={
                                                <div className="w-100 d-flex justify-content-center mt-5">
                                                    <div>
                                                        <img className="rounded-circle" src={ Loader } width="60" height="60" alt="Loading...." />
                                                        <p className="mb-0">Please Wait</p>
                                                    </div>
                                                </div>
                                            }
                                        >
                                            <Quotations
                                                List={ Details }
                                                AttachQuotations={ AttachQuotations }
                                                QuotationPreview={ QuotationPreview }

                                                // FUNCTIONS
                                                PreviewQuotation={ PreviewQuotation }
                                            />
                                        </Suspense>
                                }
                            />

                            {/* TO VIEW THE ATTACHED BILLS WITH THE PURCHASE ORDER */}
                            <Route
                                exact
                                path="/purchaseorder/window=bills&&id=:id"
                                render={
                                    () =>
                                        <Suspense
                                            fallback={
                                                <div className="w-100 d-flex justify-content-center mt-5">
                                                    <div>
                                                        <img className="rounded-circle" src={ Loader } width="60" height="60" alt="Loading...." />
                                                        <p className="mb-0">Please Wait</p>
                                                    </div>
                                                </div>
                                            }
                                        >
                                            <Bills
                                                AttachBills={ AttachBills }
                                                BillPreview={ BillPreview }

                                                // FUNCTIONS
                                                PreviewBill={ PreviewBill }
                                            />
                                        </Suspense>
                                }
                            />
                            
                            <Route
                                exact
                                path="/purchaseorder/window=vouchers&&id=:id"
                                render={
                                    () =>
                                        <Suspense
                                            fallback={
                                                <div className="w-100 d-flex justify-content-center mt-5">
                                                    <div>
                                                        <img className="rounded-circle" src={ Loader } width="60" height="60" alt="Loading...." />
                                                        <p className="mb-0">Please Wait</p>
                                                    </div>
                                                </div>
                                            }
                                        >
                                            <Vouchers
                                                Details={ Details }
                                                AttachVouchers={ AttachVouchers }
                                                VoucherPreview={ VoucherPreview }

                                                // FUNCTIONS
                                                PreviewVoucher={ PreviewVoucher }
                                                onAttachVouchers={ onAttachVouchers }
                                                RemoveVoucher={ RemoveVoucher }
                                            />
                                        </Suspense>
                                }
                            />

                    </div>   

                    {/* REQUEST CONTROLS */}
                    {/* TO APPROVE/REJECT THE REQUEST */}
                    {/* BUTTONS GROUP */}
                    <div className="POControls">

                        {
                            window.location.href.split('/').pop() !== 'home'
                                ?
                                <div className="btn-group">
                                    <button className="btn firstBtn" onClick={() => history.replace('/purchaseorder/window=purchaseorder&&id=' + POID)}>Purchase Order</button>
                                    {
                                        PurchaseRequisitionDetails.info[0]
                                        ?
                                        <button className="btn secondBtn" onClick={() => history.replace('/purchaseorder/window=purchaserequisition&&id=' + POID)}>Purchase Requisition</button>
                                        :
                                        null
                                    }
                                    {
                                        AttachQuotations.length > 0
                                        ?
                                        <button className="btn thirdBtn" onClick={() => history.replace('/purchaseorder/window=quotations&&id=' + POID)}>Quotations</button>
                                        :
                                        null
                                    }
                                    <button className="btn forthBtn" onClick={() => history.replace('/purchaseorder/window=bills&&id=' + POID)}>Bills</button>
                                    <button className="btn firstBtn" onClick={() => history.replace('/purchaseorder/window=vouchers&&id=' + POID)}>Vouchers</button>
                                    <button 
                                        className="btn secondBtn" 
                                        onClick={() => Print( POID )}
                                    >
                                        Print
                                    </button>
                                    {
                                        Details[0]
                                            ?
                                            Details[0].status === 'Viewed'
                                                ||
                                                Details[0].status === 'Sent'
                                                ?
                                                EmpData.access
                                                    ?
                                                    JSON.parse(EmpData.access).includes(523) || JSON.parse(EmpData.access).includes(524) || JSON.parse(EmpData.access).includes(1)
                                                        ?
                                                        <>
                                                            <button
                                                                className="btn btn-sm fifthBtn"
                                                                onClick={ () => onDiscard( window.location.href.split('/').pop().split('id=').pop() ) }
                                                            >
                                                                Discard
                                                            </button>
                                                            <button
                                                                className="btn btn-sm sixthBtn"
                                                                onClick={ () => onApprove( window.location.href.split('/').pop().split('id=').pop() ) }
                                                            >
                                                                Approve
                                                            </button>
                                                        </>
                                                        :
                                                        null
                                                    :
                                                    null
                                                :
                                                null
                                            :
                                            null
                                    }
                                </div>
                                :
                                null
                        }

                    </div>

                </div>

            </div>

        </div>
    )

}

// EXPORT COMPONENT
export default ViewPurchaseOrder;