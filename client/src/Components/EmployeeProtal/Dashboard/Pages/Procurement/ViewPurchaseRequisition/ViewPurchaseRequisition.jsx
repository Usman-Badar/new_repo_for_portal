/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useMemo, lazy, Suspense } from "react";

import './UI.css';
import axios from "../../../../../../axios";
import $ from 'jquery';

import Loader from '../../../../../../images/loadingIcons/icons8-iphone-spinner.gif';

// React Redux Packages
import { useSelector } from 'react-redux';
import { useHistory, Route } from 'react-router-dom';

import socket from '../../../../../../io';

import Modal from '../../../../../UI/Modal/Modal';
import Menu from '../../../../../UI/Menu/Menu';

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Home = lazy( () => import("./Components/Home/Home") );
const Requests = lazy( () => import("./Components/Requests/Requests") );
const Purchaserequisition = lazy( () => import("./Components/PurchaseRequisition/PurchaseRequisition") );
const Quotations = lazy( () => import("./Components/Quotations/Quotations") );
const Discussions = lazy( () => import("./Components/Discussions/Discussions") );
const SearchFilters = lazy( () => import("./Components/SearchFilters/SearchFilters") );

const PurchaseRequisition = () => {
    
    const [ModalContent, setModalContent] = useState(<></>);
    const [ModalShow, setModalShow] = useState( false );
    // const [Change, setChange] = useState( false );

    const [ViewRequest, setViewRequest] = useState([]);
    const [CountStatus, setCountStatus] = useState([]);
    const [MonthlyRequests, setMonthlyRequests] = useState([]);
    const [Companies, setCompanies] = useState([]);
    const [Locations, setLocations] = useState([]);
    const [Key, setKey] = useState(
        {
            column: 'employees.name',
            value: ''
        }
    );
    const [Company, setCompany] = useState(
        {
            column: 'invtry_purchase_requests.company_code',
            value: ''
        }
    );
    const [Location, setLocation] = useState(
        {
            column: 'invtry_purchase_requests.location_code',
            value: ''
        }
    );
    const [Status, setStatus] = useState(
        {
            column: 'invtry_purchase_requests.status',
            value: ''
        }
    );
    const [MyDate, setMyDate] = useState(
        {
            column: 'invtry_purchase_requests.request_date',
            value: ''
        }
    );

    const [List, setList] = useState([]);

    const [Items, setItems] = useState([]);
    const [DeletedItems, setDeletedItems] = useState([]);
    const [Amount, setAmount] = useState(0.0);
    const [Total, setTotal] = useState(0.0);
    const [Index, setIndex] = useState();

    const [EditMode, setEditMode] = useState(true);

    const [Item, setItem] = useState({
        description: "",
        reason: "",
        price: 0,
        tax: '',
        quantity: 1,
    });

    const [TaxMode, setTaxMode] = useState('inclusive');
    const [Tax, setTax] = useState(0.00);
    const [TaxAmount, setTaxAmount] = useState(0.00);
    const [NetTotal, setNetTotal] = useState(0.00);
    
    const [PRID, setPRID] = useState(0); // FOR THE CURRENT PR ID
    const [ AttachQuotations, setAttachQuotations ] = useState([]); // FOR QUOTATION ATTACHMENTS
    const [ QuotationPreview, setQuotationPreview ] = useState([]); // FOR QUOTATION PREVIEW
    const [ Tweet, setTweet ] = useState(
        {
            tweet: '',
            reply: 0
        }
    );
    const [ Tweets, setTweets ] = useState([]); // FOR PR DISCUSSIONS
    const [ WindowLocation, setWindowLocation ] = useState(); // FOR WINDOW LOCATION (URL)

    // MENU ITEMS
    const [Data, setData] = useState( [] );
    
    // Current Employee Data
    const EmpData = useSelector((state) => state.EmpAuth.EmployeeData);
    // HISTORY FOR REACT ROUTING
    const history = useHistory();

    useMemo(
        () => {

            return setWindowLocation( window.location.href.split('/').pop().split('id=').pop() );

        }, [ parseInt( window.location.href.split('/').pop().split('id=').pop() ) ]
    )

    useEffect(
        () => {

            if ( !isNaN( parseInt( WindowLocation ) ) )
            {
                
                let pr_id = window.location.href.split('/').pop().split('id=').pop(); // RETURNS AN ID ( PR ID ) FROM THE URL
    
                axios.post(
                    '/getpurchaseorderdetails',
                    {
                        pr_id: pr_id,
                        po_id: null
                    }
                ).then(
                    (res) => {
                        
                        setTax( parseFloat( res.data[4][0].tax_per ) );
                        setTotal( parseFloat( res.data[4][0].total ) );
                        if ( res.data[4][0].tax_mode !== null )
                        {
                            setTaxMode( res.data[4][0].tax_mode );
                        }
                        setTaxAmount( res.data[4][0].tax_amt );
                        setNetTotal( res.data[4][0].net_amt );
                        setItems( res.data[5] );
                        setList( res.data[4] );
                        // setTotal( parseFloat( res.data[4][0].total ) );
    
                        if ( res.data[4][0].status !== 'Approved' || res.data[4][0].status !== 'Delivered' || res.data[4][0].status !== 'Waiting For Approval' )
                        {
                            setAttachQuotations( res.data[6] ); // QUOTATIONS
                        }

                        $('.action').prop('disabled', false);
                        setEditMode(false);
                        setIndex(0);
    
                        setAmount(0.00);
                        setItem({
                            description: '',
                            reason: '',
                            price: 0,
                            tax: '',
                            quantity: 1,
                        });
    
                        $(".ViewPrRequests .PR_printUI_Middle .table .MyItems").removeClass("d-none");
                        setPRID( parseInt( pr_id ) );
                        GetDiscussions( parseInt( pr_id ) );
    
                    }
                ).catch(err => {
    
                    console.log(err);
    
                });
            }

        // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [ WindowLocation ]
    )

    useEffect(
        () => {

            SortedPr();

        }, [ Key, Company, Location, Status, MyDate ]
    )

    useEffect(
        () => {

            let items = Items;
            let tx_amount = 0.00;
            let item_amount = 0.00;
            let total = 0.00;
            let total_tax_amount = 0.00;

            for ( let x = 0; x < items.length; x++ )
            {
                if ( TaxMode === 'exclusive' )
                {
                    let reverse_tax = 100 - parseFloat( Tax );
                    let amount = ( parseFloat( items[x].price ) * parseFloat( items[x].quantity ) );
                    let amount_with_tax = amount / reverse_tax;
                    amount_with_tax = amount_with_tax * 100; 
                    let tax_amount = amount_with_tax - amount;
                    tx_amount = tax_amount.toFixed(3);
                    item_amount = parseFloat( amount ) + parseFloat( tx_amount );
                    total = total + amount;
                    total_tax_amount = total_tax_amount + tax_amount;
    
                }else
                if ( TaxMode === 'inclusive' )
                {
                    let amount = ( parseFloat( items[x].price ) * parseFloat( items[x].quantity ) );
                    let tax_amount = ( amount / 100 ) * parseFloat( Tax );
                    tx_amount = tax_amount.toFixed(3);
                    item_amount = parseFloat( amount ).toFixed(3);
                    total = total + amount;
                    total_tax_amount = total_tax_amount + parseFloat( tx_amount );
                }

                items[x].tax = Tax;
                items[x].tax_amount = tx_amount;
                items[x].amount = item_amount;
            }

            setItems( items );
            setTotal( total );
            setTaxAmount( parseFloat( total_tax_amount ).toFixed(3) );

            if ( TaxMode === 'exclusive' )
            {
                let netTotal = parseFloat( total ) + parseFloat( total_tax_amount );
                setNetTotal( parseFloat( netTotal ).toFixed(3) );
            }else
            {
                setNetTotal( parseFloat( total ) );
            }

        }, [ TaxMode, Tax, Items, EditMode ]
    )
    
    useEffect(
        () => {

            socket.on(
                'newpurchaserequision', () => {
                    
                    AllPr();
            
                }
            )
            socket.on('prdiscussions', () => {
                
                GetDiscussions( window.location.href.split('/').pop().split('id=').pop() );

            });

            AllPr();
            AllCompanies();
            AllLocations();
            GetMonthlyRequests();

            setData(
                [
                    {
                        icon: 'las la-user',
                        txt: 'Requests',
                        link: false, // || true
                        func: () => {
                            $('.ViewPrRequests_Left').show();
                            $('.ViewPrRequests_Right').hide();
                        }
                    }
                ]
            )

        }, []
    )

    useEffect(
        () => {
            
            // IMPORTANT VARIABLES
            let price = parseFloat( Item.price );
            let quantity = parseInt( Item.quantity );

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
    

        }, [ Item.quantity, Item.price ]
    )

    // WHEN INDIVIDUAL TAX MODE CHANGE FROM
    // ! EXCLUSIVE/INCLUSIVE
    const IndividualTaxMode = ( e ) => {

        const { value } = e.target;
        setTaxMode(value);

    }

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

    const GetMonthlyRequests = () => {

        let val = {
            emp_id: EmpData.emp_id,
            access: EmpData.access
        }
        axios.post('/getmonthlyrequests', { myData: JSON.stringify(val) }).then(response => {

            setMonthlyRequests(response.data);

        }).catch(error => {

            console.log(error);

        });

    }

    const AllPr = () => {

        let val = {
            emp_id: EmpData.emp_id,
            access: EmpData.access
        }
        axios.post('/getallpr', { myData: JSON.stringify(val) }).then(response => {

            setViewRequest( response.data );

        }).catch(error => {

            console.log(error);

        });

    }

    const SortedPr = () => {

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

        axios.post('/getallprsorted', { myData: JSON.stringify(val), filters: filters }).then(response => {

            setViewRequest(response.data);
            let arr = [];
            for( let x = 0; x < response.data.length; x++ )
            {

                arr.push(response.data[x].status)

            }
            setCountStatus( arr );

        }).catch(error => {

            console.log(error);

        });

    }


    const AllCompanies = () => {

        axios.get('/getallcompanies').then(response => {

            setCompanies(response.data);

        }).catch(error => {

            console.log(error);

        });

    }

    const AllLocations = () => {

        axios.get('/getalllocations').then(response => {

            setLocations(response.data);

        }).catch(error => {

            console.log(error);

        });

    }

    const onChangeCompany = (e) => {

        onSearchPR('Company', e);
        if ( e.target.value !== '' )
        {
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

    const onChangeLocation = ( e ) => {

        onSearchPR('Location', e);
        AllLocations();

    }

    const onSearchPR = ( column, e ) => {

        const { value } = e.target;

        if ( column === 'Key' )
        {
            setKey(
                {
                    ...Key,
                    value: value
                }
            );
        }else if ( column === 'Company' )
        {
            setCompany(
                {
                    ...Company,
                    value: value
                }
            );
        }else if ( column === 'Location' )
        {
            setLocation(
                {
                    ...Location,
                    value: value
                }
            );
        }else if ( column === 'Status' )
        {
            setStatus(
                {
                    ...Status,
                    value: value
                }
            );
        }else
        {
            setMyDate(
                {
                    ...MyDate,
                    value: value
                }
            );
        }


        // IF EMPTY
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

    const OnEdit = (index) => {
        if ( 
            List[0].status === 'Viewed'
            ||
            List[0].status === 'Sent'
        )
        {
            $('.action').prop('disabled', true);
            setEditMode(true);
            setIndex(index);
    
            setAmount(Items[index].amount);
            setItem(Items[index]);
    
            $(".ViewPrRequests .PR_printUI_Middle .table .MyItems" + index).toggleClass("d-none");
        }
    };

    // WHEN EMPLOYEE ENTERING THE DETAILS IN THE FIELDS AND THE DATA IS STORE TO STATE
    const onChangeHandler = (e) => {
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
        }

    };

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

                if (!EditMode) {

                    let cart = {
                        description: Item.description,
                        reason: Item.reason,
                        price: Item.price,
                        quantity: Item.quantity,
                    };
                    setItems([...Items, cart]);

                    setAmount(0.0);
                    setItem({
                        description: "",
                        reason: "",
                        price: 0,
                        tax: '',
                        quantity: 1,
                    });

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
                        };
                    } else {
                        cart = {
                            description: Item.description,
                            reason: Item.reason,
                            price: Item.price,
                            quantity: Item.quantity,
                        };
                    }

                    arr[Index] = cart;
                    setItems(arr);

                    setAmount(0.0);
                    setItem({
                        description: "",
                        reason: "",
                        price: 0,
                        tax: '',
                        quantity: 1,
                    });
                    setEditMode(false);
                    $('.action').prop('disabled', false);
                    setIndex();
                    $(".ViewPrRequests .PR_printUI_Middle .table .MyItems").removeClass("d-none");


                }

                $('textarea, input, select').blur();
                $('textarea[name=description]').focus();

            }

        }

    };

    const onDelete = (id) => {
        if ( 
            List[0].status === 'Viewed'
            ||
            List[0].status === 'Sent'
        )
        {
            // let total_tax = parseFloat( TotalTax );
            let arr = Items.filter((val, index) => {
                return index === id;
            })

            setDeletedItems( arr );

            setItems(
                Items.filter((val, index) => {
                    return index !== id;
                })
            );

        }
    };

    const onAttachQuotations = ( e ) => {

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

                setAttachQuotations( arr );
            }



        }

        if (files[0]) {
            reader.readAsDataURL(files[0]);
        }

    }

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

    const RemoveQuotation = ( id ) => {

        let array = AttachQuotations.filter(
            ( val, index, arr ) => {
      
              return arr[index].name !== arr[id].name;
      
            }
        )
      
        setAttachQuotations( array );

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
                pr_id: PRID,
                emp_id: EmpData.emp_id,
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
                GetDiscussions( window.location.href.split('/').pop().split('id=').pop() );

            }
        ).catch(
            err => {

                console.log( err );

            }
        )

    }

    const ViewTheRequest = ( pr_id, status ) => {

        if ( status === "Sent" )
        {
            if ( JSON.parse(  EmpData.access ).includes(512) || JSON.parse( EmpData.access ).includes(514) || JSON.parse( EmpData.access ).includes(1) )
            {
                const Data2 = new FormData();
                Data2.append('prID', pr_id);
                Data2.append('empID', EmpData.emp_id);
                axios.post('/setprtoviewed', Data2).then(
                    () => {
    
                        socket.emit('newpurchaserequision');
        
                    }
        
                ).catch(
                    (err) => {
        
                        console.log(err);
        
                    }
                )
            }
        }

    }

    const onDiscard = ( prID ) => {

        setModalContent(
            <div>
                <p>Do you want to discard this request?</p>
                <form onSubmit={(e) => DiscardRequest(prID, e)}>
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

    const DiscardRequest = ( prID, e ) => {

        e.preventDefault();

        const Data = new FormData();
        Data.append('prID', prID);
        Data.append('empID', EmpData.emp_id);
        Data.append('remarks', e.target['remarks'].value);
        axios.post('/setprtodiscard', Data).then(
            () => {

                socket.emit('newpurchaserequision');
                const Data2 = new FormData();
                Data2.append('eventID', 3);
                Data2.append('link', '/purchaserequisition/view=previousrequests/' + prID);
                Data2.append('receiverID', List[0].request_by);
                Data2.append('senderID', localStorage.getItem('EmpID'));
                Data2.append('Title', localStorage.getItem('name'));
                Data2.append('NotificationBody', localStorage.getItem('name') + " has discard your purchase request with id#" + prID + " under this reason '" + e.target['remarks'].value + "'");
                axios.post('/newnotification', Data2).then(() => {

                    axios.post('/sendmail', Data2).then(() => {

                        history.replace('/purchaserequisition/view=purchase_requisition&&id=' + ( prID - 1 ) );
                        setTimeout(() => {
                            history.replace('/purchaserequisition/view=purchase_requisition&&id=' + prID );
                        }, 100);

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

    const onForward = ( prID ) => {

        setModalContent(
            <div>
                <p>Do you want to forward this request?</p>
                <button onClick={ () => ForwardRequest( prID ) } className="btn btn-sm btn-info d-block ml-auto px-3">Yes</button>
            </div>
        )

        HideModelFunction();

    }

    const onApprove = ( prID ) => {

        setModalContent(
            <div>
                <p>Do you want to approve this request?</p>
                <form onSubmit={(e) => ApproveRequest(prID, e)}>
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

    const ApproveRequest = ( prID, e ) => {

        e.preventDefault();

        const Data = new FormData();
        Data.append('prID', prID);
        Data.append('empID', EmpData.emp_id);
        Data.append('remarks', e.target['remarks'].value);
        axios.post('/setprtoapprove', Data).then(
            () => {

                setModalShow(false);
                toast.dark('Request has been approved'.toString(), {
                    position: 'top-right',
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });

                socket.emit('newpurchaserequision');
                const Data2 = new FormData();
                Data2.append('eventID', 3);
                Data2.append('receiverID', List[0].request_by);
                Data2.append('senderID', localStorage.getItem('EmpID'));
                Data2.append('Title', localStorage.getItem('name'));
                Data2.append('NotificationBody', localStorage.getItem('name') + " has approved your purchase request with id#" + prID);
                axios.post('/newnotification', Data2).then(() => {

                    axios.post('/sendmail', Data2).then(() => {

                        history.replace('/purchaserequisition/view=purchase_requisition&&id=' + ( prID - 1 ) );
                        setTimeout(() => {
                            history.replace('/purchaserequisition/view=purchase_requisition&&id=' + prID );
                        }, 100);

                    })
                })

            }
        ).catch(
            (err) => {

                console.log(err);

            }
        )

    }

    const ForwardRequest = ( prID ) => {

        let pass = true;
        for (let y = 0; y < Items.length; y++) {
            if (
                Items[y].description !== ''
                ||
                Items[y].reason !== ''
                ||
                Items[y].quantity > 0
            ) {

            } else {
                toast.dark('Please fill all the fields in the items list', {
                    position: 'top-center',
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                pass = false;
                HideModelFunction();
            }
        }

        // if ( AttachQuotations.length === 0 )
        // {
        //     toast.dark('Please attach at least 1 quotation', {
        //         position: 'top-center',
        //         autoClose: 5000,
        //         hideProgressBar: false,
        //         closeOnClick: true,
        //         pauseOnHover: true,
        //         draggable: true,
        //         progress: undefined,
        //     });
        //     pass = false;
        //     HideModelFunction();
        // }

        if ( pass )
        {

            if ( Items.length > 0 )
            {
                
                const d = new FormData();
        
                d.append('prID', prID);
                d.append('Items', JSON.stringify( Items ));
                d.append('deletedItems', JSON.stringify( DeletedItems ));
                d.append('Total', Total);
                d.append('TaxMode', TaxMode);
                d.append('Tax', Tax);
                d.append('TaxAmount', TaxAmount);
                d.append('NetTotal', NetTotal);
        
                axios.post('/setprtofinal', d).then(
                    () => {
        
                        const Data = new FormData();
                        Data.append('prID', prID);
                        Data.append('empID', EmpData.emp_id);
                        AttachQuotations.forEach(file => {
                            Data.append("Attachments", file.file);
                        });
                        axios.post('/setprtowaitforapproval', Data, {
        
                            headers: {
                                "Content-Type": "multipart/form-data"
                            }
        
                        }).then(
                            () => {
    
                                history.replace('/purchaserequisition/view=purchase_requisition&&id=' + ( prID - 1 ) );
                                setTimeout(() => {
                                    history.replace('/purchaserequisition/view=purchase_requisition&&id=' + prID );
                                }, 100);
        
                                setItems([]);
                                setModalContent(<></>);
                                setModalShow(false);
        
                                setIndex()
                                setEditMode(false)
                                $('.action').prop('disabled', false);
                                setTotal(0.00)
                                setAmount(0.00)
                                socket.emit( 'NewNotification', List[0].request_by);
                                socket.emit('newpurchaserequision');
                                
                                const Data2 = new FormData();
                                Data2.append('eventID', 3);
                                Data2.append('receiverID', List[0].request_by);
                                Data2.append('senderID', localStorage.getItem('EmpID'));
                                Data2.append('Title', localStorage.getItem('name'));
                                Data2.append('NotificationBody', localStorage.getItem('name') + " has sent your purchase request with id#" + prID + ' for approval');
                                axios.post('/newnotification', Data2).then(() => {
        
                                    axios.post('/sendmail', Data2).then(() => {

        
                                    })
                                })
        
                                let list = JSON.stringify([513, 514, 515]);
                                const Data3 = new FormData();
                                Data3.append('access', list);
                                axios.post('/getemployeeaccesslike', Data3).then(
                                    (res) => {
        
                                        if (res.data[0]) {
                                            for (let x = 0; x < res.data.length; x++) {
                                                const Data2 = new FormData();
                                                Data2.append('eventID', 3);
                                                Data2.append('receiverID', res.data[x].emp_id);
                                                Data2.append('senderID', localStorage.getItem('EmpID'));
                                                Data2.append('Title', localStorage.getItem('name'));
                                                Data2.append('NotificationBody', localStorage.getItem('name') + " put forward a purchase request with id#" + prID + ' for approval');
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
        
                            }
                        )
        
                    }
        
                ).catch(
                    (err) => {
        
                        console.log(err);
        
                    }
                )

            }else
            {
                toast.dark('one specification required', {
                    position: 'top-center',
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                pass = false;
                HideModelFunction();
            }

        }

    }

    const HideModelFunction = () => {

        setModalShow( !ModalShow );

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

    // IF THE USER PRINTS THE REQUEST
    const Print = ( id ) => {

        let iframe = document.getElementById('pr');
        iframe.src = 'https://' + window.location.host + '/#/view=purchase_requisition/' + id
        iframe.contentWindow.print();
        setTimeout(() => {
            iframe.contentWindow.print();
        }, 500);

    }

    const CollapseRequests = () => {

        $('.ViewPrRequests_grid').toggleClass('d-block');
        $('.ViewPrRequests .ViewPrRequests_grid .ViewPrRequests_Right .previewWindow .openBtn').toggleClass('d-block');
        $('.ViewPrRequests_grid .ViewPrRequests_Left').toggle('slow');

    }

    const onChangeTax = ( e ) => {

        setTax( e.target.value );

    }

    return (
        <>
            <div className="ViewPrRequests">
            <Menu data={ Data } />
                <Modal show={ ModalShow } Hide={HideModelFunction} content={ModalContent} />
                <ToastContainer />
                <iframe 
                    title="pr" 
                    id="pr" 
                    className="d-none w-100"
                    src={ 'https://' + window.location.host + '/#/view=purchase_requisition/' + PRID }
                >
                </iframe>

                {/* TOPBAR FOR SEARCH FILTERS */}
                    {
                        useMemo(
                            () => {

                                return (
                                    <Suspense fallback={ <>Please Wait....</> }>
                                        <SearchFilters 
                                            Locations={ Locations }
                                            Companies={ Companies }

                                            onSearchPR={ onSearchPR }
                                            onChangeCompany={ onChangeCompany }
                                            onChangeLocation={ onChangeLocation }
                                        />
                                    </Suspense>
                                )

                            }, [ Locations, Companies ]
                        )
                    }
                
                <div className="ViewPrRequests_grid">
                    <div className="ViewPrRequests_Left">
                        <button onClick={ CollapseRequests } className="btn btn-sm collapseBtn"><i className="las la-chevron-left"></i></button>
                        <Suspense fallback={
                            <div className="w-100 d-flex justify-content-center mt-5">
                                <div>
                                    <img className="rounded-circle" src={ Loader } width="60" height="60" alt="Loading...." />
                                    <p className="mb-0">Processing....</p>
                                </div>
                            </div>
                            }
                        >
                            {
                                ViewRequest.map(
                                    (val, index) => {

                                        const d = new Date(val.request_date);

                                        return (
                                            <>
                                                <Requests 
                                                    key={index} 
                                                    data={val} 
                                                    date={d} 
                                                    ViewTheRequest={ ViewTheRequest } 
                                                    EmpData={ EmpData }
                                                />
                                            </>
                                        )
                                    }
                                )
                            }
                        </Suspense>
                    </div>
                    <div className="ViewPrRequests_Right">
                        <div className='previewWindow'>
                            <button onClick={ CollapseRequests } className="btn btn-sm openBtn mb-2"><i className="las la-chevron-down"></i></button>
                            <Route
                                exact
                                path="/purchaserequisition/home"
                                render={
                                    () =>
                                        <Suspense fallback={
                                            <div className="w-100 d-flex justify-content-center mt-5">
                                                <div>
                                                        <img className="rounded-circle" src={ Loader } width="60" height="60" alt="Loading...." />
                                                        <p className="mb-0">Loading....</p>
                                                </div>  
                                            </div>
                                            

                                        }>
                                            <Home
                                                ViewRequest={ ViewRequest }
                                                CountRequests={ViewRequest.length}
                                                CountStatus={CountStatus}
                                                MonthlyRequests={MonthlyRequests}
                                                EmpData={ EmpData }
                                            />
                                        </Suspense>
                                }
                            />

                            <Route
                                exact
                                path="/purchaserequisition/view=purchase_requisition&&id=:pr_id"
                                render={
                                    () =>
                                        <Suspense fallback={
                                            <div className="w-100 d-flex justify-content-center mt-5">
                                                <div>
                                                        <img className="rounded-circle" src={ Loader } width="60" height="60" alt="Loading...." />
                                                        <p className="mb-0">Loading....</p>
                                                </div>  
                                            </div>
                                            

                                        }>
                                            <Purchaserequisition
                                                List={List}
                                                Items={Items}
                                                Item={Item}
                                                Total={Total}
                                                Amount={Amount}
                                                Index={ Index }
                                                TaxMode={ TaxMode }
                                                Tax={ Tax }
                                                TaxAmount={ TaxAmount }
                                                NetTotal={ NetTotal }

                                                IndividualTaxMode={ IndividualTaxMode }
                                                OnChangeHandler={onChangeHandler}
                                                AddItem={AddItem}
                                                OnEdit={OnEdit}
                                                onDelete={onDelete}
                                                onChangeTax={ onChangeTax }
                                            />
                                        </Suspense>
                                }
                            />

                            <Route
                                exact
                                path="/purchaserequisition/view=quotations&&id=:pr_id"
                                render={
                                    () =>
                                        <Suspense fallback={
                                            <div className="w-100 d-flex justify-content-center mt-5">
                                                <div>
                                                        <img className="rounded-circle" src={ Loader } width="60" height="60" alt="Loading...." />
                                                        <p className="mb-0">Loading....</p>
                                                </div>  
                                            </div>
                                            }
                                        >
                                            <Quotations
                                                List={List}
                                                AttachQuotations={AttachQuotations}
                                                QuotationPreview={QuotationPreview}

                                                onAttachQuotations={onAttachQuotations}
                                                PreviewQuotation={PreviewQuotation}
                                                RemoveQuotation={RemoveQuotation}
                                            />
                                        </Suspense>
                                }
                            />

                            <Route
                                exact
                                path="/purchaserequisition/view=discussions&&id=:pr_id"
                                render={
                                    () =>
                                        <Suspense fallback={
                                            <div className="w-100 d-flex justify-content-center mt-5">
                                                <div>
                                                        <img className="rounded-circle" src={ Loader } width="60" height="60" alt="Loading...." />
                                                        <p className="mb-0">Loading....</p>
                                                </div>  
                                            </div>
                                            }
                                        >
                                            <Discussions
                                                Tweets={ Tweets }
                                                EmpData={ EmpData }

                                                onTweetboxChange={ onTweetboxChange }
                                                onTweet={ onTweet }
                                                AttachDrive={ AttachDrive }
                                            />
                                        </Suspense>
                                }
                            />


                        </div>
                        <div className="control">

                            {
                                window.location.href.split('/').pop() !== 'home'
                                ?
                                <div className="btn-group">
                                    <button className="btn firstBtn" onClick={() => history.replace('/purchaserequisition/view=purchase_requisition&&id=' + PRID)}>Purchase Requisition</button>
                                    <button className="btn secondBtn" onClick={() => history.replace('/purchaserequisition/view=quotations&&id=' + PRID)}>Quotations</button>
                                    <button className="btn thirdBtn" onClick={() => history.replace('/purchaserequisition/view=discussions&&id=' + PRID)}>Discussions</button>
                                    <button className="btn forthBtn" onClick={ () => Print(PRID) }>Print</button>
                                        {
                                            EmpData.access
                                            ?
                                            JSON.parse(EmpData.access).includes(513) || JSON.parse(EmpData.access).includes(515)
                                                ?
                                                List[0]
                                                ?
                                                    List[0].status === 'Waiting For Approval'
                                                        ?
                                                        <>
                                                                <button
                                                                    className="btn btn-sm fifthBtn"
                                                                    onClick={() => onDiscard( window.location.href.split('/').pop().split('id=').pop() )}
                                                                >
                                                                    Discard
                                                                </button>
                                                                <button
                                                                    className="btn btn-sm sixthBtn"
                                                                    onClick={() => onApprove( window.location.href.split('/').pop().split('id=').pop() )}
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
                                        {
                                            List[0]
                                            ?
                                            List[0].status === 'Viewed'
                                            ||
                                            List[0].status === 'Sent'
                                            ?
                                            EmpData.access
                                            ?
                                            JSON.parse(  EmpData.access ).includes(512) || JSON.parse( EmpData.access ).includes(514) || JSON.parse( EmpData.access ).includes(1)
                                            ?
                                            <>
                                                <button
                                                    className="btn sixthBtn"
                                                    onClick={() => onForward( window.location.href.split('/').pop().split('id=').pop() )}
                                                >
                                                    Forward
                                                </button>
                                                <button
                                                    className="btn fifthBtn"
                                                    style={{ backgroundColor: 'red', color: 'white' }}
                                                    onClick={() => onDiscard( window.location.href.split('/').pop().split('id=').pop() )}
                                                >
                                                    Discard
                                                </button>
                                                <button
                                                    className="btn d-none onTweetBtn"
                                                    onClick={(e) => onTweet(e)}
                                                >
                                                    Tweet
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
        </>
    )

}

export default PurchaseRequisition;