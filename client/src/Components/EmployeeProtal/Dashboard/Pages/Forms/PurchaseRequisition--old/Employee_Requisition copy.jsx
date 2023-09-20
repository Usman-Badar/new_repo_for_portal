import React, { useEffect, useState, lazy, Suspense } from "react";
import './Employee_Requisition.css';
import { useSelector } from 'react-redux';
import { Route, Link } from 'react-router-dom';

import axios from "../../../../../../axios";
import $ from 'jquery';

import Modal from '../../../../../UI/Modal/Modal';

import Menu from "../../../../../UI/Menu/Menu";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import socket from '../../../../../../io';
import Home from "./Home/Home";


const Discussions = lazy( () => import ("./Discussions/Discussions") );
const Form = lazy( () => import ("./Form/Form") );
const PreviousRequest = lazy( () => import ("./PreviousRequest/PreviousRequest") );

const Employee_Requisition = () => {

    const [Employees, setEmployees] = useState([]);
    const [Submitted, setSubmitted] = useState(false);

    const [ModalShow, setModalShow] = useState(false);

    const [MenuData, setMenuData] = useState([]);
    
    const [ViewRequest, setViewRequest] = useState([]);

    const [Tweets, setTweets] = useState([]);
    const [ Tweet, setTweet ] = useState(
        {
            tweet: '',
            reply: 0
        }
    );

    const [Companies, setCompanies] = useState([]);
    const [Locations, setLocations] = useState([]);
    const [RequestingPerson, setRequestingPerson] = useState(
        {
            emp_id: 0,
            name: '',
            company: {
                company_code: 0,
                company_name: ''
            },
            location: {
                location_code: 0,
                location_name: ''
            }
        }
    );

    const [Items, setItems] = useState([]);
    const [Amount, setAmount] = useState(0.0);
    const [Total, setTotal] = useState(0.0);
    const [Index, setIndex] = useState();

    const [EditMode, setEditMode] = useState(false);
    const [PRCode, setPRCode] = useState('');
    const [PurchaseRequisitionCode, setPurchaseRequisitionCode] = useState('');

    const [Item, setItem] = useState({
        description: "",
        reason: "",
        price: 0,
        quantity: 1,
    });
    
    const [CountStatus, setCountStatus] = useState([]);
    const [RequestedBy, setRequestedBy] = useState('');

    const Data = useSelector( ( state ) => state.EmpAuth.EmployeeData ); // CURRENT EMPLOYEE DATA

    useEffect(
        () => {

            if ( Data.company_code ) {

                GetCompanyLocations(Data.company_code);

                socket.on(
                    'newpurchaserequision', () => {
                        
                        AllPr( Data.emp_id );
                
                    }
                )

                AllPr( Data.emp_id );
                GetPRID( Data.company_code );

                let selectEmp = {};
                if ( JSON.parse(Data.access).includes(510) || JSON.parse(Data.access).includes(1) )
                {
                    selectEmp = {
                        icon: 'las la-street-view',
                        txt: 'Select Employee',
                        link: false,
                        func: () => HideModelFunction()
                    }
                }
                setMenuData(
                    [
                        {
                            icon: 'las la-hand-holding-usd',
                            txt: 'Dashboard',
                            link: true,
                            href: "/purchaserequisition/view=home"
                        },
                        {
                            icon: 'las la-hand-holding-usd',
                            txt: 'Purchase Requisition',
                            link: true,
                            href: "/purchaserequisition/view=form"
                        },
                        selectEmp
                    ]
                )
            }

            $('.PurchaseRequisition').show();
            $('.Discussion').hide(0);



        }, [ Data.company_code, Submitted ]
    );

    useEffect(
        () => {

            let selectEmp = {};
            if ( JSON.parse(Data.access).includes(510) || JSON.parse(Data.access).includes(1) )
            {
                selectEmp = {
                    icon: 'las la-street-view',
                    txt: 'Select Employee',
                    link: false,
                    func: () => HideModelFunction()
                }
            }
            if ( window.location.href.split('/')[ window.location.href.split('/').length - 2 ].split('=').pop() === 'previousrequests' )
            {

                setMenuData(
                    [
                        {
                            icon: 'las la-hand-holding-usd',
                            txt: 'Dashboard',
                            link: true,
                            href: "/purchaserequisition/view=home"
                        },
                        {
                            icon: 'las la-hand-holding-usd',
                            txt: 'Purchase Requisition',
                            link: true,
                            href: "/purchaserequisition/view=form"
                        },
                        {
                            icon: 'las la-comments',
                            txt: 'Discussion',
                            link: true,
                            href: '/purchaserequisition/view=discussion/' + window.location.href.split('/').pop()
                        },
                        selectEmp
                    ]
                )
                $('.Employee_Requisitions .Employee_Requisition_Left').css('background', '#fff');

            }else
            if ( window.location.href.split('/')[ window.location.href.split('/').length - 2 ].split('=').pop() === 'discussion' )
            {

                setMenuData(
                    [
                        {
                            icon: 'las la-hand-holding-usd',
                            txt: 'Dashboard',
                            link: true,
                            href: "/purchaserequisition/view=home"
                        },
                        {
                            icon: 'las la-hand-holding-usd',
                            txt: 'Purchase Requisition',
                            link: true,
                            href: "/purchaserequisition/view=form"
                        },
                        {
                            icon: 'las la-comments',
                            txt: 'Discussion',
                            link: true,
                            href: '/purchaserequisition/view=discussion/' + window.location.href.split('/').pop()
                        },
                        selectEmp
                    ]
                )

                socket.on('prdiscussions', () => {
                    GetDiscussions( window.location.href.split('/').pop() );
                });
                GetDiscussions( window.location.href.split('/').pop() );
                $('.Employee_Requisitions .Employee_Requisition_Left').css('background', 'none');

            }else
            {
                setMenuData(
                    [
                        {
                            icon: 'las la-hand-holding-usd',
                            txt: 'Dashboard',
                            link: true,
                            href: "/purchaserequisition/view=home"
                        },
                        {
                            icon: 'las la-hand-holding-usd',
                            txt: 'Purchase Requisition',
                            link: true,
                            href: "/purchaserequisition/view=form"
                        },
                        selectEmp
                    ]
                )
                $('.Employee_Requisitions .Employee_Requisition_Left').css('background', 'none');
            }

        }, [ window.location.href ]
    );

    const GetDiscussions = ( pr_id ) => {

        axios.post(
            '/getprdiscussion',
            {
                pr_id: pr_id
            }
        ).then(
            res => {

                setTweets( res.data );
                setTimeout(() => {
                    var objDiv = document.getElementById("TweetContainer");
                    if ( objDiv )
                    {
                        objDiv.scrollTop = objDiv.scrollHeight;
                    }
                }, 300);

            }
        ).catch(
            err => {

                console.log( err );

            }
        )

    }

    const onTweetboxChange = ( e ) => {

        const { name, value } = e.target;

        if ( name === 'tweet' )
        {
            setTweet(
                {
                    tweet: value,
                    reply: 0
                }
            )
        }else
        {
            setTweet(
                {
                    tweet: value,
                    reply: parseInt( name )
                }
            )
        }

    }

    const onTweet = ( e, txt, id ) => {

        e.preventDefault();
        const d = new Date();

        axios.post(
            '/prdiscussion',
            {
                pr_id: parseInt( window.location.href.split('/').pop() ),
                emp_id: Data.emp_id,
                body: txt ? txt : Tweet.tweet,
                reply: id ? id : Tweet.reply,
                date: d.toString()
            }
        ).then(
            () => {

                $("textarea").val('');
                setTweet(
                    {
                        tweet: '',
                        reply: 0
                    }
                )
                if ( id )
                {
                    socket.emit('prsubdiscussions', id);
                }else
                {
                    if ( Tweet.reply === 0 )
                    {
                        socket.emit('prdiscussions');   
                    }else
                    {
                        socket.emit('prsubdiscussions', Tweet.reply);
                    }
                }
                GetDiscussions( window.location.href.split('/').pop() );

            }
        ).catch(
            err => {

                console.log( err );

            }
        )

    }

    const createPRCode = ( company_code ) => {

        let CCode = '';
        let LastNum = '';
        let Year = '';

        const d = new Date();
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
                axios.post('/getprcode', { company_code: company_code }).then(
                    (res) => {
        
                        if ( res.data.length > 0 )
                        {
                            let code = ( parseInt( res.data[0].pr_code.split('-')[1] ) + 1 ).toString();
                            if ( code.length === 1 )
                            {
                                code = '0' + code;
                            }
                            LastNum = code;
                        }else
                        {
                            LastNum = '01';
                        }
                        setPurchaseRequisitionCode( CCode + '-' + LastNum + '-' + Year );
        
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

    const GetPRID = ( company_code ) => {

        axios.post('/getprcode', { company_code: company_code }).then(
            (res) => {

                setPRCode( res.data[0].pr_code );

            }
        ).catch(
            (err) => {

                console.log(err);

            }
        )

    }

    const AllPr = ( id ) => {

        const Data = new FormData();
        Data.append('empID', id);
        axios.post('/getthatempinvtryrequests', Data).then(
            (res) => {

                setViewRequest( res.data );
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

    const AddItem = (e) => {
        if (
            Item.description !== ''
            &&
            Item.reason !== ''
            &&
            Item.quantity > 0
            &&
            e.keyCode === 13
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

                if (!EditMode) {
                    let cart = {
                        description: Item.description,
                        reason: Item.reason,
                        price: Item.price,
                        quantity: Item.quantity,
                        amount: Amount,
                    };
                    setItems([...Items, cart]);

                    setAmount(0.0);
                    setItem({
                        description: "",
                        reason: "",
                        price: 0,
                        quantity: 1,
                    });
                    let t = Total;

                    t = t + Amount;
                    setTotal(t);

                    var objDiv = document.getElementById("ItemsLIst");
                    if (objDiv !== null) {
                        objDiv.scrollTop = objDiv.scrollHeight;
                    }

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
                            amount: Amount,
                        };
                    } else {
                        cart = {
                            description: Item.description,
                            reason: Item.reason,
                            price: Item.price,
                            quantity: Item.quantity,
                            amount: Amount,
                        };
                    }
                    setTotal(Total - arr[Index].amount + Amount);

                    arr[Index] = cart;
                    setItems(arr);

                    setAmount(0.0);
                    setItem({
                        description: "",
                        reason: "",
                        price: 0,
                        quantity: 1,
                    });
                    setIndex();
                    setEditMode(false);
                    $(".PR_printUI .PR_printUI_Middle .PR_printUI_Grid.MyItems").removeClass("d-none");
                }
                
                $('textarea, input, select').blur();
                $('textarea[name=description]').focus();
            }

        }

    };

    const onChnageHandler = (e) => {
        const { name, value } = e.target;

        const val = {
            ...Item,
            [name]: value,
        };

        setItem(val);

        if (name === "price") {
            let amount = value * Item.quantity;
            setAmount(amount);
        }

        if (name === "quantity") {
            let amount = value * Item.price;
            setAmount(amount);
        }
    };

    const onCompanyChange = (company_code) => {

        axios.post('/getcompanylocations',
            {
                company_code: company_code ? company_code : Data.company_code
            }
        ).then(res => {

            setLocations(res.data);
            let Company = Companies.filter(
                (val) => {

                    return val.company_code === parseInt(company_code)

                }
            )

            setRequestingPerson(
                {
                    ...RequestingPerson,
                    company: {
                        company_code: Company[0].company_code,
                        company_name: Company[0].company_name
                    }
                }
            );
            createPRCode( company_code );

        }).catch(err => {

            console.log(err);

        });

    }

    const onLocationChange = ( location_code ) => {

        let Location = Locations.filter(
            (val) => {

                return val.location_code === parseInt(location_code)

            }
        )

        setRequestingPerson(
            {
                ...RequestingPerson,
                location: {
                    location_code: Location[0].location_code,
                    location_name: Location[0].location_name
                }
            }
        );

    }

    const GetCompanyLocations = (company_code) => {

        axios.post('/getcompanylocations',
            {
                company_code: company_code ? company_code : Data.company_code
            }
        ).then(res => {

            axios.get('/getallcompanies').then(res => { //get all companies
                
                // set companies
                setCompanies(res.data);
    
            }).catch(err => {
    
                ShowNotification(err);
    
            });

            // setCompanies(
            //     [
            //         {
            //             company_code: Data.company_code,
            //             company_name: Data.company_name
            //         }
            //     ]
            // )

            setRequestingPerson(
                {
                    emp_id: Data.emp_id,
                    name: Data.name,
                    company: {
                        company_code: Data.company_code,
                        company_name: Data.company_name
                    },
                    location: {
                        location_code: Data.location_code,
                        location_name: Data.location_name
                    }
                }
            )

            createPRCode( Data.company_code );
            setLocations(res.data);

        }).catch(err => {

            console.log(err);

        });

    }

    const SearchEmployees = (e) => {

        const { value } = e.target;

        const Data = new FormData();
        if (value === '') {

            setEmployees([]);

        } else {

            Data.append('key', value);
            axios.post('/getinvtryemployees', Data).then(res => {

                setEmployees(res.data);

            }).catch(err => {

                ShowNotification(err);

            });

        }

    }

    const HideModelFunction = () => {

        setModalShow(!ModalShow);

    }

    // if employee is been selected
    const EmployeeSelected = (index) => {

        let employee = Employees[index];
        const Data = new FormData();
        Data.append('company_code', employee.company_code)
        axios.post('/getcompanylocations', Data).then(response => { // get all locations regarding to company code

            // set modal to hide/show
            HideModelFunction();
            // set locations
            setLocations(response.data);

            // set data to request summary
            setRequestingPerson(
                {
                    emp_id: employee.emp_id,
                    name: employee.name,
                    company: {
                        company_code: employee.company_code,
                        company_name: employee.company_name
                    },
                    location: {
                        location_code: employee.location_code,
                        location_name: employee.location_name
                    }
                }
            );

            setRequestedBy( employee.name );

            createPRCode( employee.company_code );

        }).catch(err => {

            ShowNotification(err);

        });

    }

    // popup the toast
    const ShowNotification = (note) => {

        toast.dark(note.toString(), {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });

    }

    const OnEdit = (index) => {
        setEditMode(true);
        setIndex(index);

        setAmount(Items[index].amount);
        setItem({
            description: Items[index].description,
            reason: Items[index].reason,
            price: Items[index].price,
            quantity: Items[index].quantity,
        });

        $(".PR_printUI #Item" + index).toggleClass("d-none");
    };

    const onDelete = (id) => {

        setItems(
            Items.filter((val, index) => {
                return index !== id;
            })
        );

        setTotal(Total - Items[id].amount);
    };

    const SubmitPR = () => {

        if ( Items.length === 0 )
        {
            ShowNotification( 'Minimum 1 item is required' );
        }else
        if ( $('select[name=EmployeeCompany]').val() === '' )
        {
            ShowNotification( 'No company selected' );
        }else
        if ( $('select[name=EmployeeLocation]').val() === '' )
        {
            ShowNotification( 'No location selected' );
        }else
        {
            const d = new Date();
            let val = {
                items: JSON.stringify( Items ),
                sender: {
                    emp_id: Data.emp_id
                },
                behalfOf: {
                    emp_id: RequestingPerson.emp_id,
                    company_code: RequestingPerson.company.company_code,
                    location_code: RequestingPerson.location.location_code
                },
                dateTime: d.toString()
            }
            axios.post('/purchaserequision', val).then(response => {

                setItem({
                    description: "",
                    reason: "",
                    price: 0,
                    quantity: 1,
                });
                setEditMode( false );
                setTotal(0.00);
                setAmount(0.00);
                setItems([]);
                $('select[name=EmployeeCompany]').val('');
                $('select[name=EmployeeLocation]').val('');
                setSubmitted( !Submitted );

                socket.emit('newpurchaserequision');

                const Data3 = new FormData();
                Data3.append('access', JSON.stringify([512, 514, 1]));
                axios.post('/getemployeeaccesslike', Data3).then(
                    (res) => {

                        if ( res.data[0] ) {
                            for (let x = 0; x < res.data.length; x++) 
                            {

                                const Data2 = new FormData();
                                Data2.append('eventID', 3);
                                Data2.append('link', '/purchaserequisition/view=purchase_requisition&&id=' + response.data[0].pr_id);
                                Data2.append('receiverID', res.data[x].emp_id);
                                Data2.append('senderID', localStorage.getItem('EmpID'));
                                Data2.append('Title', localStorage.getItem('name'));
                                Data2.append('NotificationBody', localStorage.getItem('name') + ' post a new purchase request on the portal');
                                axios.post('/newnotification', Data2).then(() => {

                                    axios.post('/sendmail', Data2).then(() => {

                                        socket.emit( 'NewNotification', res.data[x].emp_id);

                                    })
                                });

                            }
                        }

                    }
                )

            }).catch(err => {

                ShowNotification(err);

            });
        }

    }

    const AttachDrive = ( txt, id ) => {

        setTweet(
            {
                tweet: txt,
                reply: id
            }
        );

        let e = document.createEvent('event');
        onTweet( e, txt, id );

    }

    const CollapseRequests = () => {

        $('.Employee_Requisitions').toggleClass('d-block');
        $('.openCollapseBtn').toggleClass('d-block');
        $('.Employee_Requisitions .ViewPrRequests_Left').toggle('slow');

    }

    return (
        <>
            <Menu data={MenuData} />
            <ToastContainer />
            <Modal show={ModalShow} Hide={HideModelFunction} content={
                <div className="PREmployeesList">
                    <input type="search" placeholder="Search Employee Name" className="form-control" name="empNameSearch" onChange={SearchEmployees} />
                    <div className="list">

                        {
                            Employees.length > 0
                                ?
                                Employees.map(
                                    (val, index) => {
                                        return (

                                            <div
                                                className={"d-flex align-content-center mt-2 employee" + index}
                                                key={index}
                                                style={
                                                    {
                                                        cursor: 'pointer',
                                                        transition: '.5s'
                                                    }
                                                }
                                                onMouseOver={() => $('.PREmployeesList .employee' + index).css('background-color', '#ECF0F5')}
                                                onMouseOut={() => $('.PREmployeesList .employee' + index).css('background-color', 'white')}
                                                onClick={() => EmployeeSelected(index)}
                                            >

                                                <div className="mr-2">
                                                    <img src={'images/employees/' + val.emp_image} className="rounded-circle" width="50" height="50" alt="emp img" />
                                                </div>
                                                <div>
                                                    <p className="font-weight-bold mb-0">{val.name}</p>
                                                    <p className="mb-0">{val.designation_name} in {val.department_name} Dept. {val.company_name}, {val.location_name}</p>
                                                </div>

                                            </div>

                                        )
                                    }
                                )
                                :
                                <h6 className="text-center mt-3">No Employee Found</h6>
                        }

                    </div>
                </div>
            } />
            <div className="Employee_Requisitions">
                <div>
                    <div className="ViewPrRequests_Left">
                        <button className="btn btn-sm btn-dark" onClick={ CollapseRequests }>
                            <i className="las la-compress"></i>
                        </button>
                        {
                            ViewRequest.map(
                                (val, index) => {

                                    const d = new Date(val.request_date);
                                    let txt = val.status;

                                    let bgColor = '#0eb8de';

                                    if (val.status === 'Approved' || val.status === 'Delivered') {
                                        bgColor = '#307365';
                                        txt = "Approved By accounts";
                                    }

                                    if (val.status === 'Rejected') {
                                        bgColor = '#d19399';
                                        if ( val.forward_by === null )
                                        {
                                            txt = "Rejected by inventory";
                                        }
                                        else
                                        {
                                            txt = "Rejected by accounts";
                                        }
                                    }

                                    if (val.status === 'Waiting For Approval') {
                                        bgColor = '#fc9701';
                                        txt = "Waiting for account's approval";
                                    }

                                    return (
                                        <>
                                            <div className="ViewPrRequests_div" key={ index }>
                                                <div className="d-flex align-items-center justify-content-between">
                                                    <div className="d-flex align-items-center w-75">
                                                        <img src={'images/employees/' + val.emp_image} alt="employeeImg" />
                                                        <div>
                                                            <p className="font-weight-bolder"> {val.name} </p>
                                                            <p> {val.designation_name + ' in ' + val.department_name + ' Department, ' + val.company_name} </p>
                                                        </div>
                                                    </div>
                                                    <div className="w-25">
                                                        <p className="font-weight-bolder">Total</p>
                                                        <p> Rs {val.total.toLocaleString('en-US')}</p>
                                                    </div>
                                                </div>
                                                <div className="py-3">
                                                    <div className="d-flex justify-content-between">
                                                        <div>
                                                            <p className="font-weight-bolder">Date</p>
                                                            <p>{d.toDateString()}</p>
                                                        </div>
                                                        <div>
                                                            <p className="font-weight-bolder">Status</p>
                                                            <p style={ { backgroundColor: bgColor, fontSize: '10px' } } className="text-white text-center rounded-pill px-2">{ txt }</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="d-flex align-items-center">
                                                    <i className="las la-map-marker-alt"></i>
                                                    <div>
                                                        <p className="font-weight-bolder">{val.company_name}</p>
                                                        <p>{val.location_name}</p>
                                                    </div>
                                                </div>
                                                <div className="ViewPrRequests_button">
                                                    <Link to={ "/purchaserequisition/view=previousrequests/" + val.pr_id }>
                                                        <button className="btn">View</button>
                                                    </Link>
                                                </div>
                                            </div>
                                        </>
                                    )
                                }
                            )
                        }
                    </div>
                </div>
                <div className="Employee_Requisition_Left">
                    <button className="btn btn-sm btn-dark d-none openCollapseBtn" onClick={ CollapseRequests }>
                        <i className="las la-external-link-alt"></i>
                    </button>

                    <Suspense>

                        <Route
                            exact
                            path='/purchaserequisition/view=home'
                            render={  
                                () =>
                                    <Home
                                        ViewRequest={ ViewRequest }
                                        CountRequests={ViewRequest.length}
                                        CountStatus={CountStatus}
                                        // MonthlyRequests={MonthlyRequests}
                                        EmpData={ Data }
                                    />
                            }
                        />

                        <Route
                            exact
                            path='/purchaserequisition/view=form'
                            render={  
                                () =>
                                    <Form
                                        RequestedBy={ RequestedBy }
                                        PRCode={ PRCode }
                                        PurchaseRequisitionCode={ PurchaseRequisitionCode }
                                        Items={Items}
                                        Item={Item}
                                        Total={Total}
                                        Data={Data}
                                        Amount={Amount}
                                        Companies={Companies}
                                        Locations={Locations}
                                        onChnageHandler={onChnageHandler}
                                        onCompanyChange={onCompanyChange}
                                        onLocationChange={onLocationChange}
                                        AddItem={AddItem}
                                        OnEdit={OnEdit}
                                        onDelete={onDelete}
                                    />
                            }
                        />

                        <Route
                            exact
                            path='/purchaserequisition/view=previousrequests/:pr_id'
                            render={
                                () =>
                                    <PreviousRequest
                                    />
                            }
                        />

                        <Route
                            exact
                            path='/purchaserequisition/view=discussion/:pr_id'
                            render={
                                () =>
                                    <Discussions
                                        Tweets={ Tweets }
                                        Tweet={ Tweet }
                                        EmpData={ Data }

                                        onTweetboxChange={ onTweetboxChange }
                                        onTweet={ onTweet }
                                        AttachDrive={ AttachDrive }
                                    />
                            }
                        />
                    </Suspense>


                    {
                        window.location.href.split('/').pop() === 'view=form'
                        ?
                        <button className="btn btn-primary d-block ml-auto" onClick={ SubmitPR }>Submit</button>
                        :
                        null
                    }

                </div>
            </div>
        </>
    )
}
export default Employee_Requisition;