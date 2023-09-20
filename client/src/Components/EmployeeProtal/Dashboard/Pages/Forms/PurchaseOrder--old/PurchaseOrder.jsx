import React, { Suspense, lazy, useState, useEffect } from 'react';
import { Route } from 'react-router-dom';

// IMPORT CSS
import './PurchaseOrder.css';

import Request from './Request/Request';

import Menu from "../../../../../UI/Menu/Menu";
import { useSelector } from 'react-redux';

import axios from '../../../../../../axios';
import socket from '../../../../../../io';
import $ from 'jquery';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useHistory } from 'react-router-dom';
import Modal from '../../../../../UI/Modal/Modal';
import PRPrintUI from './PR_printUI/PR_printUI';

const Home = lazy( () => import('./Home/Home') );
const Form = lazy( () => import('./Form/Form') );
const PreviousRequest = lazy( () => import('./PreviousRequest/PreviousRequest') );
const Bills = lazy( () => import('./Bills/Bills') );

const PurchaseOrder = () => {

    // STATE FOR MENU
    const [MenuData, setMenuData] = useState([]);

    // HSOW/HIDE MODAL THROUGH THIS STATE BY CHANGE IT TO TRUE/FALSE
    const [ShowHide, setShowHide] = useState( false );

    const [Submitted, setSubmitted] = useState(false);

    const [Requests, setRequests] = useState([]);
    const [Companies, setCompanies] = useState([]);
    const [Locations, setLocations] = useState([]);
    const [ShiptoLocations, setShiptoLocations] = useState([]);
    const [PurchaseOrderCode, setPurchaseOrderCode] = useState('');
    const [CountStatus, setCountStatus] = useState([]);

    
    const [PrID, setPrID] = useState(0);
    const [PrIDPrev, setPrIDPrev] = useState(0);
    const [PRCode, setPRCode] = useState('');

    const [RequestInformation, setRequestInformation] = useState(
        {
            company: {
                company_code: 0,
                company_name: '',
                company_website: ''
            },
            location: {
                location_code: 0,
                location_name: '',
                location_phone: '',
                location_address: ''
            },
            ShipTo: {
                company: {
                    company_code: 0,
                    company_name: '',
                    company_website: ''
                },
                location: {
                    location_code: 0,
                    location_name: '',
                    location_phone: '',
                    location_address: ''
                },
            },
            venders: [],
            comments: '',
            gst: 0,
            cartage: 0,
            others: 0,
            total: 0
        }
    );

    const [Items, setItems] = useState([]);
    const [Amount, setAmount] = useState(0.0);
    const [Total, setTotal] = useState(0.0);
    const [Index, setIndex] = useState();

    const [EditMode, setEditMode] = useState(false);

    const [Item, setItem] = useState({
        description: "",
        reason: "",
        price: 0,
        taxRequired: "NO",
        tax: '',
        quantity: 1,
    });

    const [TaxMode, setTaxMode] = useState('exclusive');
    const [IndividualTax, setIndividualTax] = useState(false);

    // PURCHASE ORDER DETAILS STATE
    const [ PurchaseOrderDetails, setPurchaseOrderDetails ] = useState(
        {
            info: [],
            specifications: [],
            venders: []
        }
    );
    // FOR THE CURRENT PO ID
    const [POID, setPOID] = useState(0);
    // REQEUST DETAILS STATE
    const [Details, setDetails] = useState([]);
    // FOR ATTACH BILLS
    const [ AttachBills, setAttachBills ] = useState([]);
    // FOR BILLS PREVIEW
    const [ BillPreview, setBillPreview ] = useState([]);

    const Data = useSelector( ( state ) => state.EmpAuth.EmployeeData ); // CURRENT EMPLOYEE DATA

    // NAVIGATION
    const history = useHistory();

    // TODO: REACT LIFECYCLE
    useEffect(
        () => {

            // IF PURCHASE REQUISITION HAS ATTACHED
            if ( PRCode.length > 0 )
            {
                // SET THE CODE TO THE INPUT
                $('.prNumber').val( PRCode );
            }

            // IF COMMENTS HAS BEEN ENTERED
            if ( RequestInformation.comments.length > 0 )
            {
                // SET THE COMMENTS TO THE TEXTAREA
                $('#requestComments').val( RequestInformation.comments );
            }

            let po_id = window.location.href.split('/').pop().split('id=').pop(); // RETURNS AN ID ( PO ID ) FROM THE URL

            if ( !isNaN( parseInt( po_id ) ) )
            {
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
                                
                                setDetails( res.data[4] );

                                let poInfo = res.data[0];
                                if ( res.data[4][0] )
                                {
                                    poInfo[0].pr_code = res.data[4][0].pr_code;
                                }

                                setPurchaseOrderDetails(
                                    {
                                        ...PurchaseOrderDetails,
                                        info: poInfo,
                                        specifications: res.data[1],
                                        venders: res.data[3]
                                    }
                                )

                                if ( res.data[2][0] )
                                {
                                    setAttachBills( res.data[2] );
                                }
                                setPOID( parseInt( po_id ) );
            
                            }
                        ).catch(err => {
            
                            console.log(err);
            
                        });
                    
                    }
                );
    
            }
            // GET ALL PREVIOUS PURCHASE ORDERS
            if ( Data.emp_id )
            {
                AllPO( Data.emp_id );
                // GET ALL COMPANIES
                GetAllCompanies();
            }

            let condition = window.location.href.split('/')[ window.location.href.split('/').length - 3 ].split('view=').pop();

            if ( window.location.href.split('/').pop().split('view=').pop() === 'form' )
            {
                setMenuData(
                    [
                        {
                            icon: 'las la-hand-holding-usd',
                            txt: 'Dashboard',
                            link: true,
                            href: "/purchaseorder/view=home"
                        },
                        {
                            icon: 'las la-hand-holding-usd',
                            txt: 'Purchase Order',
                            link: false,
                            func: () => OpenPurchaseOrderForm()
                        },
                        {
                            icon: 'las la-hand-holding-usd',
                            txt: 'Bills',
                            link: false,
                            func: () => OpenAttachedBillsView()
                        }
                    ]
                )
            }else if ( condition === 'previousrequests' || condition === 'attached_bills' )
            {
                setMenuData(
                    [
                        {
                            icon: 'las la-hand-holding-usd',
                            txt: 'Dashboard',
                            link: true,
                            href: "/purchaseorder/view=home"
                        },
                        {
                            icon: 'las la-hand-holding-usd',
                            txt: 'Purchase Order',
                            link: false,
                            func: () => OpenPurchaseOrderForm()
                        },
                        {
                            icon: 'las la-hand-holding-usd',
                            txt: 'Attached Bills',
                            link: false,
                            func: () => OpenPurchaseOrderBills()
                        }
                    ]
                )
            }else
            {
                setMenuData(
                    [
                        {
                            icon: 'las la-hand-holding-usd',
                            txt: 'Dashboard',
                            link: true,
                            href: "/purchaseorder/view=home"
                        },
                        {
                            icon: 'las la-hand-holding-usd',
                            txt: 'Purchase Order',
                            link: false,
                            func: () => OpenPurchaseOrderForm()
                        }
                    ]
                )
            }

        // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [ window.location.href ]
    )

    useEffect(
        () => {

            if ( Data.company_code ) {

                socket.on(
                    'newpurchaseorder', () => {
                        
                        AllPO( Data.emp_id );
                
                    }
                )

            }


        }, [ Data.company_code, Data.emp_id, Submitted ]
    );

    useEffect(
        () => {

            // * IMPORTANT VARIABLES
            let cartage = RequestInformation.cartage === '' ? 0 : parseFloat( RequestInformation.cartage );
            let others = RequestInformation.others === '' ? 0 : parseFloat( RequestInformation.others );
            let total = Total === '' ? 0 : parseFloat( Total );

            let val = {
                ...RequestInformation,
                total: cartage + others + total
            };

            setRequestInformation( val );

        // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [ RequestInformation.cartage, RequestInformation.others, Total]
    )

    useEffect(
        () => {
            
            // IMPORTANT VARIABLES
            let price = parseFloat( Item.price );
            let quantity = parseInt( Item.quantity );
            let tax = parseFloat( Item.tax );

            if ( isNaN( price ) || price < 0 )
            {
                price = 0;
                setItem(
                    {
                        ...Item,
                        price: 0
                    }
                )
            }
            
            if ( isNaN( quantity ) || quantity < 0 )
            {
                quantity = 0;
                setItem(
                    {
                        ...Item,
                        quantity: 0
                    }
                )
            }
            
            if ( isNaN( tax ) || tax < 0 )
            {
                tax = 0;
                setItem(
                    {
                        ...Item,
                        tax: ''
                    }
                )
            }

            if ( Item.taxRequired === 'YES' && TaxMode === 'exclusive' )
            {
                let amount = ( ( price * quantity ) / 100 ) * tax;
                setAmount( amount + ( price * quantity ) );
            }else
            {
                let amount = quantity * price;
                setAmount( amount );
            }
    

        // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [ Item.tax, Item.quantity, Item.price, TaxMode ]
    )

    useEffect(
        () => {

            // IMPORTANT VARIABLES
            let subTotal = parseFloat( Total );
            let cartage = parseFloat( RequestInformation.cartage );
            let others = parseFloat( RequestInformation.others );
            let gst = parseFloat( RequestInformation.gst );

            if ( isNaN( subTotal ) )
            {
                subTotal = 0;
                setTotal( subTotal );
            }
            if ( isNaN( cartage ) )
            {
                cartage = 0;
                setRequestInformation(
                    {
                        ...RequestInformation,
                        cartage: 0
                    }
                );
            }
            if ( isNaN( others ) )
            {
                others = 0;
                setRequestInformation(
                    {
                        ...RequestInformation,
                        others: 0
                    }
                );
            }
            if ( isNaN( gst ) )
            {
                gst = 0;
                setRequestInformation(
                    {
                        ...RequestInformation,
                        gst: ''
                    }
                );
            }

            let amount = ( subTotal / 100 ) * gst;
            setRequestInformation(
                {
                    ...RequestInformation,
                    total: subTotal + amount + others + cartage
                }
            );


        }, [ RequestInformation.gst, RequestInformation.cartage, RequestInformation.others, Total ]
    )

    // TO OPEN THE VIEW WHERE EMPLOYEE CAN ATTACH BILLS REMOVE THEM AND ALSO PREVIEW THEM
    const OpenAttachedBillsView = () => {

        history.replace("/purchaseorder/view=bills");

    }

    // THIS FUNCTION WILL OPEN THE PURCHASE ORDER
    // FORM WHERE EMPLOYEE CAN FILL THE FIELDS AND SEND THE REQUEST
    // TO THE MANAGEMENT
    const OpenPurchaseOrderForm = () => {

        history.replace("/purchaseorder/view=form");

    }

    // THIS FUNCTION WILL USE TO VIEW THE HISTORIC PURCHASE ORDER'S BILLS
    const OpenPurchaseOrderBills = () => {

        // /purchaseorder/view=attached_bills/1/1
        let links = window.location.href.split('/');
        let pr_id = links[6];
        let po_id = links[7];
        history.replace('/purchaseorder/view=attached_bills/' + pr_id + '/' + po_id);

    }

    // GET ALL COMPANIES
    const GetAllCompanies = () => {

        const Data = new FormData();
        axios.get('/getallcompanies', Data).then(
            (res) => {

                setCompanies( res.data );

            }
        ).catch(
            (err) => {

                console.log(err);

            }
        )

    }

    // GET ALL PREVIOUS PURCHASE ORDERS
    const AllPO = ( id ) => {

        const Data = new FormData();
        Data.append('empID', id);
        axios.post('/getthatempinvtrypos', Data).then(
            (res) => {

                setRequests( res.data );
                let arr = [];
                for( let x = 0; x < res.data.length; x++ )
                {
    
                    arr.push(res.data[x].status)
    
                }
                setCountStatus( arr );

            }
        ).catch(
            (err) => {

                console.log(err);

            }
        )

    }
    
    // GET COMPANY'S ALL LOCATIONS
    const GetCompanyLocations = ( company_code ) => {

        axios.post('/getcompanylocations',
            {
                company_code: company_code ? company_code : Data.company_code
            }
        ).then(res => {

            // CREATE PO CODE ACCORDING TO THE COMPANY CODE
            createPOCode( company_code );

            // SET VALUE TO LOCATIONS DROPDOWN
            setLocations( res.data );

        }).catch(err => {

            console.log(err);

        });

    }
    
    // CREATE CODE FOR PURCHASE ORDER
    const createPOCode = ( company_code ) => {

        let CCode = '';
        let LastNum = '';
        let Year = '';

        const d = new Date();

        // IF CURRENT MONTH IS GREATER THAN JUNE
        if ( d.getMonth() > 6 )
        {
            Year = d.getFullYear().toString().substring(2,4) + '/' + ( d.getFullYear() + 1 ).toString().substring(2,4);
        }else
        {
            Year = ( d.getFullYear() - 1 ).toString().substring(2,4) + '/' + d.getFullYear().toString().substring(2,4);
        }

        axios.post('/getshortcompanyname', { company_code: company_code }).then(
            (res) => {

                if ( res.data.length > 0 )
                {
                    CCode = res.data[0].code;
                }

                axios.post('/getpocode', { company_code: company_code }).then(
                    (res) => {
        
                        if ( res.data.length > 0 )
                        {
                            let code = ( parseInt( res.data[0].po_code.split('-')[1] ) + 1 ).toString();
                            if ( code.length === 1 )
                            {
                                code = '0' + code;
                            }
                            LastNum = code;
                        }else
                        {
                            LastNum = '01';
                        }

                        setPurchaseOrderCode( CCode + '-' + LastNum + '-' + Year );
        
                    }
                ).catch(
                    (err) => {
        
                        console.log(err);
        
                    }
                )

            }
        ).catch(
            (err) => {

                console.log(err);

            }
        )

    }

    // WHEN REQUEST COMPANY IS SELECTED
    const OnChangeCompany = ( e ) => {

        const { value } = e.target;

        // SELECTED COMPANY
        let Company = Companies.filter(
            ( val ) => {

                return val.company_code === parseInt( value )

            }
        )

        if ( Company[0] )
        {
            // SET THE SELECTED COMPANY TO REQUEST INFORMATION
            setRequestInformation(
                {
                    ...RequestInformation,
                    company: {
                        company_code: Company[0].company_code,
                        company_name: Company[0].company_name,
                        company_website: Company[0].website
                    }
                }
            )
    
            GetCompanyLocations( Company[0].company_code );
        }

    }

    // WHEN REQUEST LOCATION IS SELECTED
    const OnChangeLocation = ( e ) => {

        const { value } = e.target;

        // SELECTED LOCATION
        let Location = Locations.filter(
            ( val ) => {

                return val.location_code === parseInt( value )

            }
        )

        // SET THE SELECTED COMPANY TO REQUEST INFORMATION
        setRequestInformation(
            {
                ...RequestInformation,
                location: {
                    location_code: Location[0].location_code,
                    location_name: Location[0].location_name,
                    location_address: Location[0].address,
                    location_phone: Location[0].location_phone
                }
            }
        )

    }

    // WHEN SHIP TO COMPANY IS SELECTED
    const OnChangeShipToCompany = ( e ) => {

        const { value } = e.target;

        // SELECTED COMPANY
        let Company = Companies.filter(
            ( val ) => {

                return val.company_code === parseInt( value )

            }
        )

        axios.post('/getcompanylocations',
            {
                company_code: Company[0].company_code
            }
        ).then(res => {

            // SET THE SELECTED COMPANY TO REQUEST INFORMATION
            setRequestInformation(
                {
                    ...RequestInformation,
                    ShipTo: {
                        ...RequestInformation.ShipTo,
                        company: {
                            company_code: Company[0].company_code,
                            company_name: Company[0].company_name,
                            company_website: Company[0].website
                        }
                    }
                }
            )

            // SET SHIP TO LOCATIONS
            setShiptoLocations( res.data );

        }).catch(err => {

            console.log(err);

        });

    }

    // WHEN SHIP TO LOCATION IS SELECTED
    const OnChangeShipToLocation = ( e ) => {

        const { value } = e.target;

        // SELECTED LOCATION
        let Location = ShiptoLocations.filter(
            ( val ) => {

                return val.location_code === parseInt( value )

            }
        )

        // SET THE SELECTED COMPANY TO REQUEST INFORMATION
        setRequestInformation(
            {
                ...RequestInformation,
                ShipTo: {
                    ...RequestInformation.ShipTo,
                    location: {
                        location_code: Location[0].location_code,
                        location_name: Location[0].location_name,
                        location_address: Location[0].address,
                        location_phone: Location[0].location_phone
                    }
                }
            }
        )

    }

    // ADD VENDER TO THE REQUEST
    const AddVender = ( val ) => {

        let arr = RequestInformation.venders;
        arr.push( val );
        
        setRequestInformation(
            {
                ...RequestInformation,
                venders: arr
            }
        )

    }

    // REMOVE THE ADDED VENDER FROM THE LIST
    const RemoveVender = ( name ) => {

        let Venders = RequestInformation.venders.filter(
            ( val ) => {

                return val.VenderName !== name

            }
        )

        setRequestInformation(
            {
                ...RequestInformation,
                venders: Venders
            }
        )

    }

    // ON ENTER COMMENTS FOR THE REQUEST
    const OnComments = ( e ) => {

        // EXTRACTING VALUE
        const { value } = e.target;

        let val = {
            ...RequestInformation,
            comments: value
        }

        setRequestInformation( val );

    }

    // WHEN EMPLOYEE ENTERING THE DETAILS IN THE FIELDS AND THE DATA IS STORE TO STATE
    const OnChangeHandler = (e) => {
        const { name, value } = e.target;

        let pass = true;
        if ( name === 'quantity' || name === 'price' || name === 'tax' )
        {
            if ( value < 0 || value === -0 || value === '-0' )
            {
                ShowNotification( "value should be greater than 0", 'top-center' );
                pass = false;
            }
        }

        if ( pass )
        {
            const val = {
              ...Item,
              [name]: value,
            };
        
            setItem(val);
    
            if (name === "taxRequired") {
    
                let input = document.getElementById('TAX');
                if ( value === 'YES' )
                {
                    input.disabled = false;
                    setIndividualTax( true );
                    setRequestInformation(
                        {
                            ...RequestInformation,
                            gst: '',
                            total: isNaN( parseFloat( Total ) ) ? 0 : parseFloat( Total )
                        }
                    )
                }else
                {
                    setItem(
                        {
                            ...Item,
                            taxRequired: "NO",
                            tax: ''
                        }
                    )
                    input.disabled = true;
                    setIndividualTax( false );
                    
                }
                
            }
        }

    };

    // WHEN EMPLOYEE WANT TO ADD AN ITEM TO THE ENTERED ITEMS LIST
    const AddItem = (e) => {
        if (
            e.keyCode === 13 && Item.description !== '' && Item.reason !== '' && Item.quantity > 0 && Item.price > 0
        ) {

            if (Item.reason.length < 20) {

                let val = $(".err_reason").val();

                let i = 0;
                let txt = "Reason must contain 20 characters minimum!!!";
                let speed = 50;
                val = '';

                function typeWriter() {
                    if (i < txt.length) {
                        val += txt.charAt(i);
                        $(".err_reason").html(val);
                        i++;
                        setTimeout(typeWriter, speed);
                    }
                }

                typeWriter();

                setTimeout(() => {
                    $(".err_reason").html('');
                }, 5000);

            } else {

                if (Item.taxRequired === "YES" && Item.tax.toString() === '0') {
                    ShowNotification( "Tax required", 'top-center' );
                } else {
                    if (!EditMode) {
                        let cart = {
                            description: Item.description,
                            reason: Item.reason,
                            price: Item.price,
                            quantity: Item.quantity,
                            taxRequired: Item.taxRequired,
                            tax: Item.tax,
                            amount: Amount,
                        };
                        setItems([...Items, cart]);

                        setAmount(0.0);
                        $('select').val('NO');
                        setItem({
                            description: "",
                            reason: "",
                            price: 0,
                            taxRequired: "NO",
                            tax: '',
                            quantity: 1,
                        });

                        let t = Total;
                        t = t + Amount;

                        setTotal(t);

                        var objDiv = document.getElementById("ItemsLIst");
                        if (objDiv !== null) {
                            objDiv.scrollTop = objDiv.scrollHeight;
                        }
                        
                        let input = document.getElementById('TAX');
                        input.disabled = true;

                    } else {
                        let arr = Items;
                        let cart = {};
                        if (Item.id) {
                            cart = {
                                id: Item.id,
                                pr_id: Item.pr_id,
                                description: Item.description,
                                reason: Item.reason,
                                price: Item.price,
                                quantity: Item.quantity,
                                taxRequired: Item.taxRequired,
                                tax: Item.tax,
                                amount: Amount,
                            };
                        } else {
                            cart = {
                                description: Item.description,
                                reason: Item.reason,
                                price: Item.price,
                                quantity: Item.quantity,
                                taxRequired: Item.taxRequired,
                                tax: Item.tax,
                                amount: Amount,
                            };
                        }
                        setTotal(( Total - arr[Index].amount ) + Amount);

                        arr[Index] = cart;
                        setItems(arr);

                        setAmount(0.0);
                        $('select').val('NO');
                        setItem({
                            description: "",
                            reason: "",
                            price: 0,
                            taxRequired: "NO",
                            tax: '',
                            quantity: 1,
                        });
                        setEditMode(false);
                        setIndex();
                        $(".POForm .PO_printUI_Middle .PO_printUI_Grid.MyItems").removeClass("d-none");
                        let input = document.getElementById('TAX');
                        input.disabled = true;


                    }

                    $('textarea, input, select').blur();
                    $('textarea[name=description]').focus();
                }

            }

        }

    };

    // WHEN EMPLOYEE WANT TO EDIT THE ENTERED ITEM DETAIL
    const OnEdit = (index) => {
        setEditMode(true);
        setIndex(index);

        if ( Items[index].tax !== '' )
        {
            $('select').val('YES');
        }
        setAmount(Items[index].amount);
        setItem(Items[index]);

        $(".POForm .PO_printUI_Middle .PO_printUI_Grid.MyItems").removeClass("d-none");
        $(".POForm .PO_printUI_Middle .PO_printUI_Grid.MyItems" + index).toggleClass("d-none");
    };

    // WHEN EMPLOYEE WANT TO DELETE/REMOVE THE ENTERED ITEM
    const onDelete = (id) => {

        setItems(
            Items.filter((val, index) => {
                return index !== id;
            })
        );

        setTotal(Total - Items[id].amount);
    };

    // WHEN PURCHASE ORDER IS SUBMIT
    const SubmitPurchaseOrder = () => {

        let pass = true;
        if ( RequestInformation.company.company_code === 0 )
        {
            ShowNotification( "No Company Selected", 'top-center' );
            pass = false;
        }else
        if ( RequestInformation.location.location_code === 0 )
        {
            ShowNotification( "No location Selected", 'top-center' );
            pass = false;
        }else
        if ( RequestInformation.ShipTo.company.company_code === 0 )
        {
            ShowNotification( "No Ship To Company Selected", 'top-center' );
            pass = false;
        }else
        if ( RequestInformation.ShipTo.location.location_code === 0 )
        {
            ShowNotification( "No Ship To Location Selected", 'top-center' );
            pass = false;
        }else
        if ( RequestInformation.venders.length === 0 )
        {
            ShowNotification( "No vender added", 'top-center' );
            pass = false;
        }else
        if ( Items.length === 0 )
        {
            ShowNotification( "No Items added", 'top-center' );
            pass = false;
        }else
        if ( RequestInformation.comments.length === 0 )
        {
            ShowNotification( "Please enter comments", 'top-center' );
            pass = false;
        }else
        if ( AttachBills.length === 0 )
        {
            ShowNotification( "Please attach at least one bill document.", 'top-center' );
            pass = false;
        }else
        if ( EditMode )
        {
            ShowNotification( "The request is in edit mode, please press enter on the specification fields to get out of it.", 'top-center' );
            pass = false;
        }

        if ( pass )
        {
            const val = {
                RequestInfo: RequestInformation,
                specifications: Items,
                SenderInfo: Data.emp_id,
                code: PurchaseOrderCode,
                TaxMode: TaxMode,
                PrID: PrID
            }
            const D = new FormData();
            D.append('data', JSON.stringify( val ));
            AttachBills.forEach(file => {
                D.append("Attachments", file.file);
            });
    
            axios.post(
                '/purchase_order/new',
                D
            ).then(
                () => {
    
                    ShowNotification( "Request Submitted", 'top-center' );
                    setTimeout(() => {
                        history.replace('/purchaseorder/');
                        setTimeout(() => {
                            history.replace('/purchaseorder/view=form');
                        }, 100);
                    }, 1000);

                    socket.emit('newpurchaseorder');

                    const Data3 = new FormData();
                    Data3.append('access', JSON.stringify([523, 524, 1]));
                    axios.post('/getemployeeaccesslike', Data3).then(
                        (res) => {

                            if (res.data[0]) {
                                for (let x = 0; x < res.data.length; x++) {

                                    socket.emit('NewNotification', res.data[x].emp_id);
                                    const Data2 = new FormData();
                                    Data2.append('eventID', 3);
                                    Data2.append('link', '');
                                    Data2.append('receiverID', res.data[x].emp_id);
                                    Data2.append('senderID', localStorage.getItem('EmpID'));
                                    Data2.append('Title', localStorage.getItem('name'));
                                    Data2.append('NotificationBody', localStorage.getItem('name') + ' post a new purchase order request on the portal with id# ' + PurchaseOrderCode);
                                    axios.post('/newnotification', Data2).then(() => {

                                        axios.post('/sendmail', Data2).then(() => {


                                        })
                                    });

                                }
                            }

                        }
                    )
    
                }
            ).catch(
                (err) => {
    
                    console.log(err);
                    ShowNotification( "Request Failed", 'top-center' );
    
                }
            )
        }

    }

    // WHEN EMPLOYEE ENTER PURCHASE REQUISITION NUMBER/CODE
    const OnChangePrNumber = ( e ) => {

        if ( e.keyCode === 13 )
        {
            // EXTRACTING VALUE
            const { value } = e.target;

            axios.post('/getprforpo',
                {
                    pr_code: value
                }
            ).then(res => {

                // WHEN PURCHASE REQUISITION IS NOT EXISTS
                const NotFound = () => {
                    ShowNotification( "Not Found", 'top-center' );
                    setItems([]);
                    setTotal(0.00);
                    setPrID( 0 );
                    setPRCode('');
                }

                if ( res.data.length > 0 )
                {
                    if ( res.data[1].length > 0 )
                    {
                        setItems( res.data[0] );
    
                        setTotal( res.data[1][0].total );

                        setRequestInformation(
                            {
                                ...RequestInformation,
                                total: res.data[1][0].total
                            }
                        )
                        setPrID( res.data[1][0].pr_id );
                        setPRCode( value );
                        ShowNotification( "Connected", 'top-center' );
                    }else
                    {
                        NotFound();
                    }
                }else
                {
                    NotFound();
                }

            }).catch(err => {

                console.log(err);

            });
        }

    }

    // WHEN THE FINAL VALUE
    // todo: (SUB TOTAL, GST, CARTAGE, OTHERS, TOTAL)
    // GOT CHANGE
    const FinalValuesChangeHandler = ( e ) => {

        const { name, value } = e.target;
        const val = {
            ...RequestInformation,
            [name]: value
        }

        setRequestInformation( val );

    }

    // DECIDE IS TAX INCLUDED OR EXCLUDED
    const ExclusiveInclusiveTax = ( e ) => {

        // EXTRACTING VALUE
        const { value } = e.target;
        
        // IMPORTANT VARIABLES
        let total = parseFloat( Total );
        let gst = parseFloat( RequestInformation.gst );
        let cartage = RequestInformation.cartage === '' ? 0 : parseFloat(RequestInformation.cartage);
        let others = RequestInformation.others === '' ? 0 : parseFloat(RequestInformation.others);
        
        if ( value === 'exclusive' )
        {
    
            if ( isNaN( total ) )
            {
                total = 0;
                setTotal(0.00);
            }
            if ( isNaN( gst ) )
            {
                gst = 0;
                setRequestInformation(
                    {
                        ...RequestInformation,
                        gst: ''
                    }
                );
            }
    
            if ( Item.taxRequired === 'NO' )
            {
                
                let amount = ( total / 100 ) * gst;
                setRequestInformation(
                    {
                        ...RequestInformation,
                        total: amount + total + cartage + others
                    }
                );
            }
        }else
        {
            // * IMPORTANT VARIABLES
            let total = Total === '' ? 0 : parseFloat(Total);

            let val = {
                ...RequestInformation,
                total: cartage + others + total
            };

            setRequestInformation(val);
        }

    }

    // WHEN INDIVIDUAL TAX MODE CHANGE FROM
    // ! EXCLUSIVE/INCLUSIVE
    const IndividualTaxMode = ( e ) => {

        const { value } = e.target;
        setTaxMode(value);

    }

    // SHOW POP-UP ALERT
    const ShowNotification = ( note , position) => {

        toast.dark(note.toString(), {
            position: position,
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });

    }

    // ON ATTACH BILLS TO THE REQUEST
    const onAttachBills = ( e ) => {

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

                setAttachBills( arr );
            }



        }

        if (files[0]) {
            reader.readAsDataURL(files[0]);
        }

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

    // WHEN EMPLOYEE WANTS TO REMOVE A BILL FROM THE ATTACHMENT LIST
    const RemoveBill = ( id ) => {

        let array = AttachBills.filter(
            ( val, index, arr ) => {
      
              return arr[index].name !== arr[id].name;
      
            }
        )
      
        setAttachBills( array );
        setBillPreview([]);

    }

    // IF EMPLOYEE WANTS TO SEE THE HISTORIC PURCHASE ORDER'S PURCHASE REQUISITION
    // HE CAN VIEW BY THIS FUNCTION
    const ShowModal = ( pr_id ) => {

        setPrIDPrev( pr_id );
        setShowHide( !ShowHide );

    }

    const CollapseRequests = () => {

        $('.PurchaseOrderContainer .PurchaseOrderGrid').toggleClass('d-block');
        $('.openCollapseBtn').toggleClass('d-block');
        $('.PurchaseOrderContainer .PurchaseOrderGrid .Left.PreviousPurchaseOrders').toggle('slow');

    }
    
    return (

        // PURCHASE ORDER START
        <div className="PurchaseOrderContainer">
            <ToastContainer />

            {/* CUSTOM MODAL COMPONENT */}
            <Modal 
                show={ ShowHide } 
                Hide={ 
                    () => {
                        setShowHide( !ShowHide );
                        setPrIDPrev(0);
                    }
                } 
                content=
                {
                    PrIDPrev === 0
                    ?
                    PrID === 0
                    ?
                    null
                    :
                    <PRPrintUI
                        PrID={ PrID }
                    />
                    :
                    <PRPrintUI
                        PrID={ PrIDPrev }
                    />
                } 
            />

            {/* PURCHASE ORDER MENU COMPONENT */}
            <div style={ { height: '50px' } }>
                <Menu data={ MenuData } />  
            </div>

            {/* CONTENT */}
            {/* GRID CONTAINER */}
            <div className='PurchaseOrderGrid'>

                {/* LEFT PANEL */}
                {/* PREVIOUS REQUESTS */}
                <div className="Left PreviousPurchaseOrders">
                    <button className="btn btn-sm btn-dark" onClick={ CollapseRequests }>
                        <i className="las la-compress"></i>
                    </button>

                    {/* REQUESTS */}
                    {
                        Requests.length === 0
                        ?
                        <>
                            <h5 className="text-center">No Request Found</h5>
                        </>
                        :
                        Requests.map(
                            ( val, index ) => {

                                const d = new Date( val.request_date );
                                let txt = val.status;

                                let bgColor = 'var(--blue)';

                                if (val.status === 'Approved' || val.status === 'Delivered') {
                                    bgColor = 'var(--success)';
                                    txt = "Approved By accounts";
                                }

                                if (val.status === 'Rejected') {
                                    bgColor = 'var(--orange)';
                                    txt = "Rejected by accounts";
                                }

                                if (val.status === 'Waiting For Approval') {
                                    bgColor = 'var(--c-green)';
                                }

                                return (
                                    <Request 
                                        index={ index }
                                        data={ val }
                                        d={ d }
                                        txt={ txt }
                                        bgColor={ bgColor }
                                    />
                                );

                            }
                        )
                    }

                </div>

                {/* RIGHT PANEL */}
                {/* MAIN CONTENT */}
                <div className="Right MainContentWindow">
                    <button className="btn btn-sm btn-dark d-none openCollapseBtn" onClick={ CollapseRequests }>
                        <i className="las la-external-link-alt"></i>
                    </button>

                    <Suspense fallback={ <div>Loading....</div> }>
                        
                        {/* ROUTES */}
                        <Route
                            exact
                            path='/purchaseorder/view=home'
                            render={  
                                () =>
                                    <Home
                                        ViewRequest={ Requests }
                                        CountRequests={ Requests.length }
                                        CountStatus={ CountStatus }
                                        // MonthlyRequests={ MonthlyRequests }
                                        EmpData={ Data }
                                    />
                            }
                        />
                        
                        <Route
                            exact
                            path='/purchaseorder/view=form'
                            render={  
                                () =>
                                    <Form
                                        Companies={ Companies }
                                        Locations={ Locations }
                                        ShiptoLocations={ ShiptoLocations }
                                        RequestInformation={ RequestInformation }
                                        Data={ Data }
                                        Items={ Items }
                                        Item={ Item }
                                        Total={ Total }
                                        Amount={ Amount }
                                        PurchaseOrderCode={ PurchaseOrderCode }
                                        TaxMode={ TaxMode }
                                        IndividualTax={ IndividualTax }
                                        PRCode={ PRCode }
                                        Index={ Index }

                                        AddItem={ AddItem }
                                        OnEdit={ OnEdit }
                                        onDelete={ onDelete }
                                        OnChangeCompany={ OnChangeCompany }
                                        OnChangeLocation={ OnChangeLocation }
                                        OnChangeShipToCompany={ OnChangeShipToCompany }
                                        OnChangeShipToLocation={ OnChangeShipToLocation }
                                        AddVender={ AddVender }
                                        RemoveVender={ RemoveVender }
                                        OnComments={ OnComments }
                                        OnChangeHandler={OnChangeHandler}
                                        SubmitPurchaseOrder={ SubmitPurchaseOrder }
                                        OnChangePrNumber={ OnChangePrNumber }
                                        FinalValuesChangeHandler={ FinalValuesChangeHandler }
                                        ExclusiveInclusiveTax={ ExclusiveInclusiveTax }
                                        IndividualTaxMode={ IndividualTaxMode }
                                        ShowHide={ () => setShowHide( !ShowHide ) }
                                    />
                            }
                        />
                        
                        <Route
                            exact
                            path='/purchaseorder/view=previousrequests/:id/:id'
                            render={  
                                () =>
                                    <PreviousRequest
                                        PurchaseOrderDetails={ PurchaseOrderDetails } 

                                        // FUNCTIONS
                                        ShowModal={ ShowModal }
                                    />
                            }
                        />

                        {/* ROUTE FOR ATTACHMENT OF BILLS */}
                        {/* ROUTE */}
                        <Route
                            exact
                            path='/purchaseorder/view=bills'
                            render={  
                                () =>
                                    <Bills
                                        Details={ Details }
                                        AttachBills={ AttachBills }
                                        BillPreview={ BillPreview }

                                        onAttachBills={ onAttachBills }
                                        PreviewBill={ PreviewBill }
                                        RemoveBill={ RemoveBill }
                                    />
                            }
                        />

                        {/* TO VIEW THE PREVIOUS REQUEST'S BILLS */}
                        {/* ROUTE */}
                        <Route
                            exact
                            path='/purchaseorder/view=attached_bills/:id/:id'
                            render={  
                                () =>
                                    <Bills
                                        Details={ Details }
                                        AttachBills={ AttachBills }
                                        BillPreview={ BillPreview }

                                        onAttachBills={ onAttachBills }
                                        PreviewBill={ PreviewBill }
                                        RemoveBill={ RemoveBill }
                                    />
                            }
                        />

                    </Suspense>

                </div>

            </div>

        </div>

    )

}

export default PurchaseOrder;