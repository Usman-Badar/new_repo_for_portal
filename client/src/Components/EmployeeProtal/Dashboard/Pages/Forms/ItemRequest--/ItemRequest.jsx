/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import './ItemRequest.css';

import { Link, useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from '../../../../../../axios';
import socket from '../../../../../../io';

import ReactTooltip from 'react-tooltip';
import Modal from '../../../../../UI/Modal/Modal';
import $ from 'jquery';
import moment from 'moment';

const ItemRequest = () => {

    const history = useHistory();
    const Relations = useSelector((state) => state.EmpAuth.Relations);
    const AccessControls = useSelector( ( state ) => state.EmpAuth.EmployeeData );

    const [ PurchaseRequisitionCode, setPurchaseRequisitionCode ] = useState('');
    const [ Disabled, setDisabled ] = useState(true);
    const [ DisabledEntity, setDisabledEntity ] = useState(true);
    const [ EditMode, setEditMode ] = useState(false);
    const [ ShowModal, setShowModal ] = useState(false);
    const [ Content, setContent ] = useState();
    const [ Index, setIndex ] = useState();
    const [ View, setView ] = useState('');
    const [ Requests, setRequests ] = useState([]);
    const [ Locations, setLocations ] = useState([]);
    const [ Companies, setCompanies ] = useState([]);
    const [ Items, setItems ] = useState([]);
    const [ Comments, setComments ] = useState([]);
    const [ StoreItems, setStoreItems ] = useState([]);
    const [ Logs, setLogs ] = useState([]);
    const [ RequestDetails, setRequestDetails ] = useState(
        {
            details: null,
            specifications: [],
            logs: [],
            specificationsStatus: []
        }
    );
    const [ Item, setItem ] = useState(
        {
            company_code: '',
            location_code: '',
            request_to: '',
            request_by: AccessControls.emp_id,
            request_date: new Date(),
            request_action: ''
        }
    );

    const [ Entity, setEntity ] = useState(
        {
            name: "",
            required_quantity: "",
            reason: ""
        }
    )

    useEffect(
        () => {

            if ( Items.length === 0 )
            {
                setDisabled( true );
            }else
            if ( Item.company_code === '' )
            {
                setDisabled( true );
            }else
            if ( Item.location_code === '' )
            {
                setDisabled( true );
            }else
            {
                setDisabled( false );
            }

        }, [ Items.length, Item.company_code, Item.location_code ]
    )

    useEffect(
        () => {

            if ( !Entity.item_id )
            {
                setDisabledEntity( true );
            }else
            if ( Entity.name !== '' && Entity.required_quantity !== '' && Entity.reason !== '' )
            {
                setDisabledEntity( false );
            }else
            if ( Entity.reason.length > 20 )
            {
                setDisabledEntity( false );
            }else
            {
                setDisabledEntity( true );
            }

            if ( window.location.href.split('/')[5] === 'edit' && Entity.name !== '' && Entity.required_quantity !== '' && Entity.reason !== '' )
            {
                OpenModal();
            }

        }, [ Entity.name, Entity.required_quantity, Entity.reason ]
    )

    useEffect(
        () => {

            GetItemRequests();

            socket.on(
                'somethingchangeinitemrequest', ( request_id ) => {
                    
                    GetItemRequests();
                    if ( request_id )
                    {
                        GetRequestDetails(request_id);
                    }
            
                }
            )

            socket.on(
                'newitemrequestcomment', ( request_id ) => {
                    
                    if ( parseInt( request_id ) === parseInt( window.location.href.split('/').pop().split('=').pop() ) )
                    {
                        GetCommnets(window.location.href.split('/').pop().split('=').pop());
                    }
            
                }
            )

        // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []
    )

    useEffect(
        () => {

            if ( window.location.href.split('/').pop() === 'new' || window.location.href.split('/')[5] === 'generatepr' )
            {
                GetCompanies();
            }

            if ( window.location.href.split('/').pop().includes('index') )
            {
                GetRequestDetails(window.location.href.split('/').pop().split('=').pop());
                GetCommnets(window.location.href.split('/').pop().split('=').pop());
            }
            setView( window.location.href.split('/').pop() );

        // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [ window.location.href.split('/').pop() ]
    )

    setTimeout(() => {
        ReactTooltip.rebuild();
    }, 1000);

    const GetCommnets = (id) => {

        axios.post('/getitemrequestcomments', { id: id })
        .then(
            res => 
            {

                setComments( res.data );
                setTimeout(() => {
                    let objDiv = document.getElementById("comments_content");
                    if (objDiv) {
                        objDiv.scrollTop = objDiv.scrollHeight;
                    }
                }, 500);

            }
        ).catch(
            err => {

                console.log(err);

            }
        );

    }

    const GetRequestDetails = ( id ) => {

        axios.post('/getitemrequestdetails', { id: id })
        .then(
            res => 
            {

                setItems( res.data[1] );
                setRequestDetails(
                    {
                        details: res.data[0][0],
                        specifications: res.data[1],
                        logs: res.data[2],
                        specificationsStatus: res.data[3]
                    }
                );

                GetLocations( res.data[0][0].company_code )
                createPRCode( res.data[0][0].company_code );

                setTimeout(() => {
                    setItem(
                        {
                            ...Item,
                            company_code: res.data[0][0].company_code,
                            location_code: res.data[0][0].location_code
                        }
                    );
                }, 1000);

            }
        ).catch(
            err => {

                console.log(err);

            }
        );

    }

    const GetStoreItems = ( key ) => {

        if ( key !== '' )
        {
            axios.post('/getmatchedstoreitems', { key: key })
            .then(
                res => 
                {
    
                    setStoreItems(res.data);
    
                }
            ).catch(
                err => {
    
                    console.log(err);
    
                }
            );
        }else
        {
            setStoreItems([]);
        }

    }

    const GetCompanies = () => {

        axios.get('/getallcompanies')
        .then(
            res => 
            {
                setCompanies(res.data);
            }
        ).catch(
            err => {

                console.log(err);

            }
        );

    }

    const GetLocations = ( company_code ) => {

        axios.post('/getcompanylocations',
            {
                company_code: company_code
            }
        ).then(
            res => {

                setLocations( res.data );

            }
        ).catch(
            err => {

                console.log( err );

            }
        )

    }

    const GetItemRequests = () => {

        axios.post(
            '/getallitemrequests',
            {
                emp_id: localStorage.getItem('EmpID'),
                access: AccessControls.access
            }
        ).then(
            res => {

                setRequests( res.data );

            }
        ).catch(
            err => {

                console.log( err );

            }
        )

    }

    const onChangeHandler = ( e ) => {

        const { name, value } = e.target;
        const val ={
            ...Item,
            [name]: value
        };
        let arr = Logs;

        setItem( val );

        if ( name === 'company_code' )
        {
            GetLocations( value );
            if ( window.location.href.split('/')[5] === 'generatepr' )
            {
                createPRCode( value );
            }

            if ( e.target.attributes.log )
            {
                let record;
                for ( let y = 0; y < arr.length; y++ )
                {
                    if ( arr[y].includes("Request company") )
                    {
                        record = true;
                    }
                }

                if ( !record )
                {
                    arr.push(
                        "Request company (" + RequestDetails.details.company_name + ") has changed"
                    )
                }
            }
        }

        if ( name === 'location_code' )
        {
            if ( e.target.attributes.log )
            {
                let record;
                for ( let y = 0; y < arr.length; y++ )
                {
                    if ( arr[y].includes("Request location") )
                    {
                        record = true;
                    }
                }

                if ( !record )
                {
                    arr.push(
                        "Request location (" + RequestDetails.details.location_name + ") has changed"
                    )
                }
            }
        }

        if ( e.target.attributes.log )
        {
            setLogs( arr );
        }

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

    const onSubmitForm = (url) => {

        setDisabled( true );
        axios.post(
            url,
            {
                request: JSON.stringify( Item ),
                specifications: JSON.stringify( Items ),
                pr_code: PurchaseRequisitionCode,
                itemRequest: JSON.stringify( RequestDetails.details ),
                logs: JSON.stringify( Logs ),
                itemsDetails: JSON.stringify( RequestDetails.specificationsStatus )
            }
        ).then(
            () => {

                socket.emit( 'somethingchangeinitemrequest' );
                
                let message = localStorage.getItem('name') + ' has sent your a new item request for approval';
                if ( url === '/generatepronitemrequest' )
                {
                    message = localStorage.getItem('name') + ' proceed your item request to purchase requisition';
                }
                const Data2 = new FormData();
                Data2.append('eventID', 3);
                Data2.append('receiverID', Item.request_to);
                Data2.append('senderID', localStorage.getItem('EmpID'));
                Data2.append('Title', localStorage.getItem('name'));
                Data2.append('NotificationBody', message);
                axios.post('/newnotification', Data2).then(() => {

                    axios.post('/sendmail', Data2).then(() => {


                    })
                })
                history.replace('/item_requests');

            }
        ).catch(
            err => {

                setDisabled( false );
                console.log( err );

            }
        )

    }

    const onChangeEntities = ( e ) => {

        const { name, value } = e.target;
        const val = {
            ...Entity,
            [name]: value
        };

        setEntity( val );

        if ( name === 'name' )
        {
            GetStoreItems( value );
        }

    }

    const AddItem = ( log ) => {

        let arr = Items;
        
        if ( window.location.href.split('/')[5] === 'generatepr' )
        {
            if ( log )
            {
                let arr2 = Logs;
                if ( EditMode )
                {
                    if ( parseInt( arr[Index].required_quantity ) !== parseInt( Entity.required_quantity ) )
                    {
                        arr2.push(
                            Entity.name + "'s required quantity has edited"
                        )    
                    }
    
                    if ( arr[Index].reason !== Entity.reason )
                    {
                        arr2.push(
                            Entity.name + "'s reason has edited"
                        )    
                    }
    
                    if ( arr[Index].name !== Entity.name )
                    {
                        arr2.push(
                            arr[Index].name + " has changed to a new item " + Entity.name
                        )    
                    }
                }else
                {
                    arr2.push(
                        'New item ' + Entity.name + " has added"
                    )
                }
                setLogs(arr2);
            }
            if ( EditMode )
            {
                arr[Index] = {
                    id: Entity.id,
                    item_id: Entity.item_id,
                    name: Entity.name,
                    required_quantity: Entity.required_quantity,
                    reason: Entity.reason,
                    edited: true
                }
                setEditMode(false);
                setIndex();
            }else
            {
                arr.push(
                    {
                        id: Entity.id,
                        item_id: Entity.item_id,
                        name: Entity.name,
                        required_quantity: Entity.required_quantity,
                        reason: Entity.reason,
                        new_added: true
                    }
                );
            }
        }else
        {
            if ( EditMode )
            {
                arr[Index] = {
                    id: Entity.id,
                    item_id: Entity.item_id,
                    name: Entity.name,
                    required_quantity: Entity.required_quantity,
                    reason: Entity.reason,
                    hod_approval_required: Entity.hod_approval_required
                }
                setEditMode(false);
                setIndex();
            }else
            {
                arr.push(
                    {
                        id: Entity.id,
                        item_id: Entity.item_id,
                        name: Entity.name,
                        required_quantity: Entity.required_quantity,
                        reason: Entity.reason,
                        hod_approval_required: Entity.hod_approval_required
                    }
                );
            }
        }
    
        setItems( arr );
        setEntity(
            {
                name: '',
                required_quantity: '',
                reason: ''
            }
        )

    }

    const SelectItem = ( index ) => {

        const val ={
            ...Entity,
            item_id: StoreItems[index].id,
            name: StoreItems[index].name,
            hod_approval_required: StoreItems[index].hod_approval_required
        }

        setEntity( val );
        setStoreItems([]);

    }

    const RemoveItem = ( index ) => {

        let arr = Items.filter(
            (val, i) => {

                return i !== index

            }
        );

        setItems( arr );

    }

    const EditItem = ( index ) => {

        let val = Items[index];
        setEntity(
            {
                id: val.id,
                item_id: val.item_id,
                name: val.name,
                required_quantity: val.required_quantity,
                reason: val.reason
            }
        )
        setEditMode( true );
        setIndex( index );

    }

    const OpenRequest = (index) => {

        history.replace('/item_requests/view/index=' + index);

    }

    const onClose = () => {

        setShowModal( !ShowModal );

    }

    const OpenModal = () => {

        const content = 
        <form className="w-100" onSubmit={ ( e ) => alert( "A" ) }>
            <small>Item Name</small>
            <div className="itemNameContainer">
                <input onChange={ onChangeEntities } value={ Entity.name } name="name" className="form-control form-control-sm" required />
                <div className="list">
                    {
                        StoreItems.map(
                            val => {
                                return <span>{val.name}</span>
                            }
                        )
                    }
                </div>
            </div>
            <small>Required Quantity</small>
            <input onChange={ onChangeEntities } value={ Entity.required_quantity } name="required_quantity" className="form-control form-control-sm" required />
            <small>Reason / Details</small> 
            <input onChange={ onChangeEntities } value={ Entity.reason } name="reason" className="form-control form-control-sm" required />
            <div className="text-right">
                <button className="btn btn-outline-dark btn-sm mt-2">
                    update
                </button>
            </div>
        </form>

        setContent( content );
        setShowModal( true );

    }

    const PerformAction = () => {

        let content;
        if ( Item.request_action === 'cancel' )
        {
            content = 
            <form className="w-100" onSubmit={ ( e ) => ActRequest( e, '/cancelitemrequest' ) }>
                <p>Do you want to cancel the request?</p>
                <textarea className="form-control form-control-sm" required minLength={10} placeholder="Give Reason" name='remarks'></textarea>
                <div className="text-right">
                    <button className="btn btn-outline-dark btn-sm mt-2">
                        Confirm
                    </button>
                </div>
            </form>
        }else
        if ( Item.request_action === 'approve' )
        {
            content = 
            <form className="w-100" onSubmit={ ( e ) => ActRequest( e, '/approveitemrequest' ) }>
                <p>Do you want to approve the request?</p>
                <textarea className="form-control form-control-sm" required minLength={10} placeholder="Give Remarks" name='remarks'></textarea>
                <div className="text-right">
                    <button className="btn btn-outline-dark btn-sm mt-2">
                        Confirm
                    </button>
                </div>
            </form>
        }else
        if ( Item.request_action === 'reject' )
        {
            content = 
            <form className="w-100" onSubmit={ ( e ) => ActRequest( e, '/rejectitemrequest' ) }>
                <p>Do you want to reject the request?</p>
                <textarea className="form-control form-control-sm" required minLength={10} placeholder="Give Reason" name='remarks'></textarea>
                <div className="text-right">
                    <button className="btn btn-outline-dark btn-sm mt-2">
                        Confirm
                    </button>
                </div>
            </form>
        }else
        if ( Item.request_action === 'generatepr' )
        {
            content = 
            <form className="w-100" onSubmit={ () => history.replace('/item_requests/generatepr/index=' + RequestDetails.details.id) }>
                <p>Do you want to generate purchase requisition of the request?</p>
                <div className="text-right">
                    <button className="btn btn-outline-dark btn-sm mt-2">
                        Confirm
                    </button>
                </div>
            </form>
        }else
        if ( Item.request_action === 'deliver' )
        {
            content = 
            <form className="w-100" onSubmit={ ( e ) => ActRequest( e, '/deliveritemrequest' ) }>
                <p>Are you going to deliver the items of this request?</p>
                <div className="text-right">
                    <button className="btn btn-outline-dark btn-sm mt-2">
                        Confirm
                    </button>
                </div>
            </form>
        }else
        if ( Item.request_action === 'delivered' )
        {
            content = 
            <form className="w-100" onSubmit={ ( e ) => ActRequest( e, '/delivereditemrequest', RequestDetails.specifications ) }>
                <p>Did you receive your required items?</p>
                <div className="text-right">
                    <button className="btn btn-outline-dark btn-sm mt-2">
                        Confirm
                    </button>
                </div>
            </form>
        }

        setContent( content );
        setShowModal( true );

    }

    const ActRequest = ( e, url, specifications ) => {

        e.preventDefault();
        axios.post(
            url,
            {
                request_id: RequestDetails.details.id,
                emp_id: AccessControls.emp_id,
                specifications: specifications ? JSON.stringify(specifications) : null,
                reason: e.target['remarks'] ? e.target['remarks'].value : null
            }
        ).then(
            () => {

                socket.emit( 'somethingchangeinitemrequest', RequestDetails.details.id );
                
                let message;
                let receiver;
                let sender;
                if ( url === '/rejectitemrequest' )
                {
                    message = localStorage.getItem('name') + ' has reject your item request.';
                    receiver = RequestDetails.details.request_by;
                    sender = localStorage.getItem('EmpID');
                }else
                if ( url === '/approveitemrequest' )
                {
                    message = localStorage.getItem('name') + ' has approve your item request.';
                    receiver = RequestDetails.details.request_by;
                    sender = localStorage.getItem('EmpID');
                }else
                if ( url === '/cancelitemrequest' )
                {
                    message = localStorage.getItem('name') + ' has cancel his item request.';
                    receiver = Item.request_to;
                    sender = Item.request_by;
                }else
                if ( url === '/deliveritemrequest' )
                {
                    message = "Delivery of your required item (s) is in process.";
                    receiver = RequestDetails.details.request_by;
                    sender = localStorage.getItem('EmpID');
                }
                const Data2 = new FormData();
                Data2.append('eventID', 3);
                Data2.append('receiverID', receiver);
                Data2.append('senderID', sender);
                Data2.append('Title', localStorage.getItem('name'));
                Data2.append('NotificationBody', message);
                axios.post('/newnotification', Data2).then(() => {

                    axios.post('/sendmail', Data2).then(() => {


                    })
                })
                history.replace('/item_requests');

            }
        ).catch(
            err => {

                console.log( err );

            }
        )

    }

    const newComment = ( e ) => {

        e.preventDefault();
        axios.post(
            '/newitemrequestcomment', 
            {
                comment: e.target['comment'].value,
                item_request_id: window.location.href.split('/').pop().split('=').pop(),
                sender_id: localStorage.getItem("EmpID")
            }
        ).then(
            () => {

                document.getElementById('commentForm').reset();
                GetCommnets( window.location.href.split('/').pop().split('=').pop() );
                socket.emit( 'newitemrequestcomment', window.location.href.split('/').pop().split('=').pop() );
            
            }
        ).catch(
            err => {

                console.log( err );

            }
        );

    }

    return (
        <>
            <Modal show={ ShowModal } Hide={ onClose } content={ Content } />
            {/* {
                View.includes('index')
                ?
                <div className='commentBox'>
                    <div className='header' onClick={ () => $('.commentBox').toggleClass('open') }>
                        Comment Section

                        {
                            Comments.length === 0
                            ?null
                            :
                            <span className='counting'>
                                { Comments.length }
                            </span>
                        }
                    </div>
                    <div className='comments_content' id="comments_content">

                        {
                            Comments.length === 0
                            ?
                            <div className='text-center'>No Comments</div>
                            :
                            Comments.map(
                                val => {

                                    return (
                                        <div className={ parseInt( val.sender_id ) === parseInt(localStorage.getItem('EmpID')) ? 'comment mine' : 'comment' }>
                                            <small className={ parseInt( val.sender_id ) === parseInt(localStorage.getItem('EmpID')) ? 'mine' : '' }> <b>{val.name}</b> </small>
                                            <p className={ parseInt( val.sender_id ) === parseInt(localStorage.getItem('EmpID')) ? 'mine' : '' }> {val.comment} </p>
                                            <small className={ parseInt( val.sender_id ) === parseInt(localStorage.getItem('EmpID')) ? 'mine' : '' }> { new Date( val.send_date ).toDateString() } at { val.send_time } </small>
                                        </div>
                                    ) 

                                }
                            )
                        }

                    </div>
                    <form className='newComment' id="commentForm" onSubmit={ newComment }>
                        <input required type="text" name="comment" />
                        <button><i className="las la-paper-plane"></i></button>
                    </form>
                </div>
                :null
            } */}
            {
                window.location.href.split('/')[5] === 'generatepr'
                ?
                <div className="items_container">

                    <div className="d-flex align-items-center justify-content-between mb-3">

                        <div>

                            <h5 className='mb-0 font-weight-bold'>Generating Purchase Requisition</h5>
                            {/* {
                                View === 'new'
                                ?
                                :
                                <h5 className='mb-0 font-weight-bold'>Update Existing Store Items</h5>
                            }  */}

                        </div>
                        <div className="d-flex">
                            <Link to={ '/item_requests/view/index=' + window.location.href.split('/').pop().split('=').pop() } className="btn btn-sm cancle">cancel</Link>
                            {
                                !Disabled
                                ?
                                <>
                                    <select className="form-control form-control-sm mx-2" onChange={ onChangeHandler } name="request_to">
                                        <option value="">Select the option</option>
                                        {
                                            Relations.map(
                                                (val, index) => {
                                                    let option;
                                                    if ( val.category === 'all' || val.category.includes('item_request') )
                                                    {
                                                        option = <option value={val.sr} key={index}> {val.name} </option>;
                                                    }

                                                    return option;
                                                }
                                            )
                                        }
                                    </select>
                                    {
                                        Item.request_to !== ''
                                        ?
                                        <button className="btn btn-sm submit" type="button" onClick={ () => onSubmitForm('/generatepronitemrequest') }> 
                                            submit
                                        </button>
                                        :null
                                    }
                                </>
                                :null
                            }
                        </div>

                    </div>

                    <div className="container-fluid px-0">
                        <form className="p-3 rounded">

                            <h6 className='mb-3 font-weight-bold'>Purchase Requisition Form</h6>
                            <div className="d-flex w-100">
                                <div className="mr-1 w-50">
                                    <label className="mb-0"> Company </label>
                                    <select className="form-control form-control-sm mb-2" log='company_code' onChange={ onChangeHandler } name="company_code" value={ Item.company_code }>
                                        <option value=''>Select the option</option>
                                        {
                                            Companies.map(
                                                val => {

                                                    return <option key={ val.company_code } value={ val.company_code }> { val.company_name } </option>

                                                }
                                            )
                                        }
                                    </select>
                                </div>
                                <div className="ml-1 w-50">
                                    <label className="mb-0"> PR Number </label>
                                    <input type="text" disabled className="form-control form-control-sm mb-2" value={PurchaseRequisitionCode} />
                                </div>
                            </div>
                            <div className="d-flex w-100">
                                <div className="mr-1 w-50">
                                    <label className="mb-0"> Delivery / Work Location </label>
                                    <select className="form-control form-control-sm mb-2" log='location_code' onChange={ onChangeHandler } name="location_code" value={ Item.location_code }>
                                        <option value=''>Select the option</option>
                                        {
                                            Locations.map(
                                                val => {

                                                    return <option key={ val.location_code } value={ val.location_code }> { val.location_name } </option>

                                                }
                                            )
                                        }
                                    </select>
                                </div>
                                <div className="ml-1 w-50">
                                    <label className="mb-0"> Date </label>
                                    <input type="text" disabled className="form-control form-control-sm mb-2" value={new Date().toDateString()} />
                                </div>
                            </div>
                            
                            <table className="table table-sm mt-4">
                                <tr className="bg-light">

                                    <th>Sr No.</th>
                                    {/* <th>Status</th> */}
                                    <th>Item</th>
                                    <th>Quantity</th>
                                    <th>Reason / Details</th>
                                    <th>Availability</th>
                                                                                
                                </tr>
                                {
                                    Items.map(
                                        ( val, index ) => {

                                            return (
                                                <>
                                                    {
                                                        EditMode && parseInt( Index ) === parseInt( index )
                                                        ?
                                                        <tr>

                                                            <td> { Index + 1 } </td>
                                                            <td>  </td>
                                                            <td className="ItemColumn">
                                                                <input onChange={ onChangeEntities } value={ Entity.name } attr="pr" name="name" className="entities form-control form-control-sm" />
                                                                {
                                                                    StoreItems.length > 0
                                                                    ?
                                                                    <div className="StoreItemsList">
                                                                        {
                                                                            StoreItems.map(
                                                                                ( val, index ) => {

                                                                                    return <p key={ index } className="StoreItemsListItem" onClick={ () => SelectItem(index) }>{val.name}</p>

                                                                                }
                                                                            )
                                                                        }
                                                                    </div>
                                                                    :null
                                                                }
                                                            </td>
                                                            <td><input onChange={ onChangeEntities } value={ Entity.required_quantity } attr="pr" name="required_quantity" type="number" className="entities form-control form-control-sm" /></td>
                                                            <td colSpan={2}><input onChange={ onChangeEntities } value={ Entity.reason } attr="pr" name="reason" type="text" className="entities form-control form-control-sm" /></td>
                                                                                                        
                                                        </tr>
                                                        :
                                                        RequestDetails.specificationsStatus.length > 0
                                                        ?
                                                        <tr>

                                                            <td>{ index + 1 }</td>
                                                            {/* <td>{ val.new_added ? "new" : val.edited ? 'edited' : 'default' }</td> */}
                                                            <td className='underline'>
                                                                { val.name }
                                                                {
                                                                    RequestDetails.specificationsStatus[index]
                                                                    ?
                                                                    <div className='items_specifications details'>
                                                                        <b>Availble Quantity: </b>
                                                                        <span> { RequestDetails.specificationsStatus[index].availble_quantity } </span>
                                                                        <br />
                                                                        <b>Status: </b>
                                                                        <span> { RequestDetails.specificationsStatus[index].status } </span>
                                                                    </div>
                                                                    :null
                                                                }
                                                            </td>
                                                            <td>{ val.required_quantity }</td>
                                                            <td className="icons">
                                                                { val.reason }
                                                                <span>
                                                                    <i onClick={ () => EditItem( index ) } className="lar la-edit"></i>
                                                                    <i onClick={ () => RemoveItem( index ) } className="lar la-trash-alt"></i>
                                                                </span>
                                                            </td>
                                                            <td>
                                                                {
                                                                    RequestDetails.specificationsStatus[index]
                                                                    ?
                                                                    parseInt( val.required_quantity ) > parseInt( RequestDetails.specificationsStatus[index].availble_quantity ) ? "Not Availble" : "Availble"
                                                                    :null
                                                                }
                                                            </td>
                                                                                                        
                                                        </tr>
                                                        :null
                                                    }
                                                </>
                                            )

                                        }
                                    )
                                }
                                {
                                    !EditMode
                                    ?
                                    <tr>

                                        <td> { Items.length + 1 } </td>
                                        <td>  </td>
                                        <td className="ItemColumn">
                                            <input onChange={ onChangeEntities } value={ Entity.name } name="name" className="entities form-control form-control-sm" />
                                            {
                                                StoreItems.length > 0
                                                ?
                                                <div className="StoreItemsList">
                                                    {
                                                        StoreItems.map(
                                                            ( val, index ) => {

                                                                return <p key={ index } className="StoreItemsListItem" onClick={ () => SelectItem(index) }>{val.name}</p>

                                                            }
                                                        )
                                                    }
                                                </div>
                                                :null
                                            }
                                        </td>
                                        <td><input onChange={ onChangeEntities } value={ Entity.required_quantity } name="required_quantity" type="number" className="entities form-control form-control-sm" /></td>
                                        <td colSpan={2}><input onChange={ onChangeEntities } value={ Entity.reason } name="reason" type="text" className="entities form-control form-control-sm" /></td>
                                                                                    
                                    </tr>
                                    :null
                                }
                            </table>

                            <div className="text-right">
                                <button className="btn btn-sm cancle" onClick={ () => AddItem( 'log' ) } type="button" disabled={ DisabledEntity }> 
                                    {
                                        EditMode
                                        ?
                                        "update item"
                                        :
                                        "add item"
                                    }
                                </button>
                            </div>

                        </form>
                    </div>


                </div>
                :
                View === 'new'
                ?
                <div className="items_container">

                    <div className="d-flex align-items-center justify-content-between mb-3">

                        <div>

                            <h5 className='mb-0 font-weight-bold'>Send New Item Request</h5>
                            {/* {
                                View === 'new'
                                ?
                                :
                                <h5 className='mb-0 font-weight-bold'>Update Existing Store Items</h5>
                            }  */}

                        </div>
                        <div className="d-flex">
                            <Link to='/item_requests' className="btn btn-sm cancle">cancel</Link>
                            {
                                !Disabled
                                ?
                                <>
                                    <select className="form-control form-control-sm mx-2" onChange={ onChangeHandler } name="request_to">
                                        <option value="">Select the option</option>
                                        {
                                            Relations.map(
                                                (val, index) => {
                                                    let option;
                                                    if ( val.category === 'all' || val.category.includes('item_request') )
                                                    {
                                                        option = <option value={val.sr} key={index}> {val.name} </option>;
                                                    }

                                                    return option;
                                                }
                                            )
                                        }
                                    </select>
                                    {
                                        Item.request_to !== ''
                                        ?
                                        <button className="btn btn-sm submit" type="button" onClick={ () => onSubmitForm('/newitemrequest') }> 
                                            submit
                                        </button>
                                        :null
                                    }
                                </>
                                :null
                            }
                        </div>

                    </div>

                    <div className="container-fluid px-0">
                        <form className="p-3 rounded">

                            <h6 className='mb-3 font-weight-bold'>Item Request Form</h6>
                            <div className="d-flex w-100">
                                <div className="mr-1 w-50">
                                    <label className="mb-0"> Company </label>
                                    <select className="form-control form-control-sm mb-2" onChange={ onChangeHandler } name="company_code" value={ Item.company_code }>
                                        <option value=''>Select the option</option>
                                        {
                                            Companies.map(
                                                val => {

                                                    return <option key={ val.company_code } value={ val.company_code }> { val.company_name } </option>

                                                }
                                            )
                                        }
                                    </select>
                                </div>
                                <div className="ml-1 w-50">
                                    <label className="mb-0"> Date </label>
                                    <input type="text" disabled className="form-control form-control-sm mb-2" value={new Date().toDateString()} />
                                </div>
                            </div>
                            <div className="d-flex w-100">
                                <div className="mr-1 w-50">
                                <label className="mb-0"> Delivery / Work Location </label>
                                    <select className="form-control form-control-sm mb-2" onChange={ onChangeHandler } name="location_code" value={ Item.location_code }>
                                        <option value=''>Select the option</option>
                                        {
                                            Locations.map(
                                                val => {

                                                    return <option key={ val.location_code } value={ val.location_code }> { val.location_name } </option>

                                                }
                                            )
                                        }
                                    </select>
                                </div>
                                <div className="ml-1 w-50">
                                    
                                </div>
                            </div>
                            
                            <table className="table table-sm mt-4">
                                <tr className="bg-light">

                                    <th>Sr No.</th>
                                    <th>Item</th>
                                    <th>Quantity</th>
                                    <th>Reason / Details</th>
                                                                                
                                </tr>
                                {
                                    Items.map(
                                        ( val, index ) => {

                                            return (
                                                <>
                                                    {
                                                        EditMode && parseInt( Index ) === parseInt( index )
                                                        ?
                                                        <tr>

                                                            <td> { Index + 1 } </td>
                                                            <td className="ItemColumn">
                                                                <input onChange={ onChangeEntities } value={ Entity.name } name="name" className="entities form-control form-control-sm" />
                                                                {
                                                                    StoreItems.length > 0
                                                                    ?
                                                                    <div className="StoreItemsList">
                                                                        {
                                                                            StoreItems.map(
                                                                                ( val, index ) => {

                                                                                    return <p key={ index } className="StoreItemsListItem" onClick={ () => SelectItem(index) }>{val.name}</p>

                                                                                }
                                                                            )
                                                                        }
                                                                    </div>
                                                                    :null
                                                                }
                                                            </td>
                                                            <td><input onChange={ onChangeEntities } value={ Entity.required_quantity } name="required_quantity" type="number" className="entities form-control form-control-sm" /></td>
                                                            <td><input onChange={ onChangeEntities } value={ Entity.reason } name="reason" type="text" className="entities form-control form-control-sm" /></td>
                                                                                                        
                                                        </tr>
                                                        :
                                                        <tr>

                                                            <td>{ index + 1 }</td>
                                                            <td>{ val.name }</td>
                                                            <td>{ val.required_quantity }</td>
                                                            <td className="icons">
                                                                { val.reason }
                                                                <span>
                                                                    <i onClick={ () => EditItem( index ) } className="lar la-edit"></i>
                                                                    <i onClick={ () => RemoveItem( index ) } className="lar la-trash-alt"></i>
                                                                </span>
                                                            </td>
                                                                                                        
                                                        </tr>
                                                    }
                                                </>
                                            )

                                        }
                                    )
                                }
                                {
                                    !EditMode
                                    ?
                                    <tr>

                                        <td> { Items.length + 1 } </td>
                                        <td className="ItemColumn">
                                            <input onChange={ onChangeEntities } value={ Entity.name } name="name" className="entities form-control form-control-sm" />
                                            {
                                                StoreItems.length > 0
                                                ?
                                                <div className="StoreItemsList">
                                                    {
                                                        StoreItems.map(
                                                            ( val, index ) => {

                                                                return <p key={ index } className="StoreItemsListItem" onClick={ () => SelectItem(index) }>{val.name}</p>

                                                            }
                                                        )
                                                    }
                                                </div>
                                                :null
                                            }
                                        </td>
                                        <td><input onChange={ onChangeEntities } value={ Entity.required_quantity } name="required_quantity" type="number" className="entities form-control form-control-sm" /></td>
                                        <td><input onChange={ onChangeEntities } value={ Entity.reason } name="reason" type="text" className="entities form-control form-control-sm" /></td>
                                                                                    
                                    </tr>
                                    :null
                                }
                            </table>

                            <div className="text-right">
                                <button className="btn btn-sm cancle" onClick={ AddItem } type="button" disabled={ DisabledEntity }> 
                                    {
                                        EditMode
                                        ?
                                        "update item"
                                        :
                                        "add item"
                                    }
                                </button>
                            </div>

                        </form>
                    </div>


                </div>
                :
                View.includes('index')
                ?
                <div className="items_container">
                    <div className="d-flex align-items-center justify-content-between mb-3">

                        <div>

                            <h5 className='mb-0 font-weight-bold'>Request Details</h5>

                        </div>
                        <div className="d-flex">

                            {
                                RequestDetails.details !== null
                                ?
                                <select name="request_action" id="" className='form-control mr-2 form-control-sm request_action' onChange={onChangeHandler}>
                                    <option value="">select</option>
                                    {
                                        RequestDetails.details.status === 'sent' && RequestDetails.details.request_by === AccessControls.emp_id
                                        ?
                                        <option value="cancel">cancel</option>
                                        :null
                                    }
                                    {
                                        RequestDetails.details.status === 'delivery is in process' && RequestDetails.details.request_by === AccessControls.emp_id
                                        ?
                                        <option value="delivered">received</option>
                                        :null
                                    }
                                    {
                                        RequestDetails.details.status === 'sent'
                                        ?
                                        <>
                                            <option value="approve">approve</option>
                                            <option value="reject">reject</option>
                                        </>
                                        :null
                                    }
                                    {/* {
                                        RequestDetails.details.status === 'approved' && RequestDetails.details.request_by !== AccessControls.emp_id
                                        ?
                                        JSON.parse(AccessControls.access).includes(529) || JSON.parse(AccessControls.access).includes(1)
                                        ?
                                        <>
                                            <option value="generatepr">generate purchase requisition</option>
                                        </>
                                        :null
                                        :null
                                    } */}
                                    {/* {
                                        RequestDetails.details.request_by !== AccessControls.emp_id
                                        ?
                                        JSON.parse(AccessControls.access).includes(529) || JSON.parse(AccessControls.access).includes(1)
                                        ?
                                        RequestDetails.details.status === 'approved' || RequestDetails.details.status === 'proceed to purchase requisition'
                                        ?
                                        <>
                                            <option value="deliver">deliver</option>
                                        </>
                                        :null
                                        :null
                                        :null
                                    } */}
                                </select>
                                :null
                            }
                            {
                                Item.request_action === ''
                                ?null
                                :
                                <button onClick={ PerformAction } className="btn btn-sm submit mr-2">next</button>
                            }
                            <Link to='/item_requests' className="btn btn-sm newBtn">close</Link>
                        </div>

                    </div>

                    {
                        RequestDetails.details !== null
                        ?
                        <div className="container-fluid px-0">
                            <form>
                                <h5 className='mb-4 font-weight-bold text-center'>Item Request</h5>

                                <div className="d-flex w-100">
                                    <div className="w-50 pr-1">
                                        <div className="d-flex align-items-center">

                                            <p className='mb-0 w-50 font-weight-bold'>Requested By: </p>
                                            <p className='mb-0'>{ RequestDetails.details.sender_name }</p>

                                        </div>
                                        <div className="d-flex align-items-center">

                                            <p className='mb-0 w-50 font-weight-bold'>Company: </p>
                                            <p className='mb-0'>{ RequestDetails.details.company_name }</p>

                                        </div>
                                        <div className="d-flex align-items-center">

                                            <p className='mb-0 w-50 font-weight-bold'>Delivery / Work Location: </p>
                                            <p className='mb-0'>{ RequestDetails.details.location_name }</p>

                                        </div>
                                        <div className="d-flex align-items-center">

                                            <p className='mb-0 w-50 font-weight-bold'>Request Date: </p>
                                            <p className='mb-0'>{ moment(RequestDetails.details.request_date).utc().format('MM-DD-YYYY') }</p>

                                        </div>
                                    </div>
                                    <div className="w-50 pl-1">
                                        <div className="d-flex align-items-center">

                                            <p className='mb-0 w-50 font-weight-bold'>Received By: </p>
                                            <p className='mb-0'>{ RequestDetails.details.receiver_name }</p>

                                        </div>
                                        <div className="d-flex align-items-center">

                                            <p className='mb-0 w-50 font-weight-bold' style={ { textTransform: "capitalize" } }>
                                                {
                                                    RequestDetails.details.status === 'canceled'
                                                    ?
                                                    "Cancelation "
                                                    :
                                                    RequestDetails.details.status === 'approved'
                                                    ?
                                                    "Approval "
                                                    :
                                                    RequestDetails.details.status === 'rejected'
                                                    ?
                                                    "Rejection "
                                                    :null
                                                }
                                                Date: 
                                            </p>
                                            <p className='mb-0'>{ RequestDetails.details.acted_date === null ? "Not Approve Yet" : moment(RequestDetails.details.acted_date).utc().format('MM-DD-YYYY') }</p>

                                        </div>
                                        <div className="d-flex align-items-center">

                                            <p className='mb-0 w-50 font-weight-bold'>Request Status: </p>
                                            <p className='mb-0 statusBox'>{ RequestDetails.details.status }</p>

                                        </div>
                                    </div>
                                </div>

                                <div className="my-3 logContainer">
                                    {
                                        RequestDetails.details.request_by === AccessControls.emp_id
                                        ?null
                                        :
                                        RequestDetails.logs.map(
                                            val => {
                                                return (
                                                    <div key={ val.log_id } className="log"> 
                                                        <span>{ val.log }</span>
                                                        <span>{ moment(val.log_date).utc().format('MM-DD-YYYY') } at { val.log_time }</span>
                                                    </div>
                                                )
                                            }
                                        )
                                    }
                                </div>

                                <table className="table table-sm">

                                    <tr>
                                        <th>Sr No</th>
                                        <th>H.O.D Approval Required</th>
                                        <th>Item Name</th>
                                        <th>Required Quantity</th>
                                        {
                                            RequestDetails.details.status === 'delivery is in process'
                                            ?
                                            <th>Deliver Quantity</th>
                                            :null
                                        }
                                        <th>Reason / Details</th>
                                        {/* <th>Availability</th> */}
                                    </tr>

                                    {
                                        RequestDetails.specifications.map(
                                            (val, index) => {
                                                return (
                                                    <tr>
                                                        <td>{ index + 1 }</td>
                                                        <td>{ val.hod_approval_required === 1 ? <span className='text-danger'>Required</span> : <span className='text-primary'>Not Required</span> }</td>
                                                        <td>{ val.name }</td>
                                                        <td>{ val.required_quantity }</td>
                                                        {
                                                            RequestDetails.details.status === 'delivery is in process'
                                                            ?
                                                            <td>{ val.deliver_quantity }</td>
                                                            :null
                                                        }
                                                        <td style={ { wordBreak: 'break-all' } }>
                                                            { val.reason }
                                                        </td>
                                                        {/* <td>{ val.availability === null ? "Not Checked" : val.availability === 0 ? "Not Availble" : "Availble" }</td> */}
                                                    </tr>
                                                )
                                            }
                                        )
                                    }

                                </table>

                                {
                                    RequestDetails.details.acted_date === null
                                    ?
                                    null
                                    :
                                    <div className="border-top pt-3">
                                        <h5 className='mb-0 font-weight-bold'>Review</h5>
                                        <br />
                                        <div className="d-flex">

                                            <div className="w-50 d-flex">
                                                <div className="w-50 font-weight-bold">
                                                    From:
                                                </div>
                                                <div className="w-50">
                                                    { RequestDetails.details.sender_name }
                                                </div>
                                            </div>

                                        </div>
                                        
                                        <div className="d-flex">

                                            <div className="w-50 d-flex">
                                                <div className="w-50 font-weight-bold">
                                                    To:
                                                </div>
                                                <div className="w-50">
                                                    { RequestDetails.details.receiver_name }
                                                </div>
                                            </div>

                                        </div>
                                        
                                        <div className="d-flex">

                                            <div className="w-50 d-flex">
                                                <div className="w-50 font-weight-bold">
                                                    { RequestDetails.details.receiver_name.split(' ').shift() }'s Remarks:
                                                </div>
                                                <div className="w-50">
                                                    { RequestDetails.details.remarks }
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                }

                                <br />

                                {
                                    RequestDetails.details.pr_request_generate_date === null
                                    ?
                                    null
                                    :
                                    <div className="border-top pt-3">
                                        <h5 className='mb-0 font-weight-bold'>Requisition</h5>
                                        <br />
                                        <div className="d-flex">

                                            <div className="w-50 d-flex">
                                                <div className="w-50 font-weight-bold">
                                                    From:
                                                </div>
                                                <div className="w-50">
                                                    { RequestDetails.details.requisition_name }
                                                </div>
                                            </div>

                                        </div>
                                        
                                        <div className="d-flex">

                                            <div className="w-50 d-flex">
                                                <div className="w-50 font-weight-bold">
                                                    Requisition Date:
                                                </div>
                                                <div className="w-50">
                                                    { moment(RequestDetails.details.pr_request_generate_date).utc().format('MM-DD-YYYY') }
                                                </div>
                                            </div>

                                        </div>
                                        
                                        <div className="d-flex">

                                            <div className="w-50 d-flex">
                                                <div className="w-50 font-weight-bold">
                                                    Requisition Time:
                                                </div>
                                                <div className="w-50">
                                                    { RequestDetails.details.pr_request_generate_time }
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                }

                                <br />

                                {
                                    RequestDetails.details.delivery_date === null
                                    ?
                                    null
                                    :
                                    <div className="border-top pt-3">
                                        <h5 className='mb-0 font-weight-bold'>Delivery</h5>
                                        <br />
                                        
                                        <div className="d-flex">

                                            <div className="w-50 d-flex">
                                                <div className="w-50 font-weight-bold">
                                                    Delivery Date:
                                                </div>
                                                <div className="w-50">
                                                    { moment(RequestDetails.details.delivery_date).utc().format('MM-DD-YYYY') }
                                                </div>
                                            </div>

                                        </div>
                                        
                                        <div className="d-flex">

                                            <div className="w-50 d-flex">
                                                <div className="w-50 font-weight-bold">
                                                    Delivery Time:
                                                </div>
                                                <div className="w-50">
                                                    { RequestDetails.details.delivery_time }
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                }

                            </form>
                        </div>
                        :null
                    }
                </div>
                :
                <div className="items_container">

                    <div className="d-flex align-items-center justify-content-between mb-3">

                        <div>

                            <h5 className='mb-0 font-weight-bold'>Item Requests</h5>

                        </div>
                        <div>
                            <Link to='/item_requests/new' className="btn btn-sm newBtn">new</Link>
                        </div>

                    </div>

                    <table className="table table-sm">

                        <thead>
                            <tr>

                                <th> Request ID </th>
                                <th> Request By </th>
                                <th> Request To </th>
                                <th> Company </th>
                                <th> Date Time </th>
                                <th> Status </th>

                            </tr>
                        </thead>

                        <tbody>
                            {
                                Requests.map(
                                    ( val, index ) => {

                                        const d = new Date(val.request_date);

                                        return (
                                            <tr className="hover" key={ index } onClick={ () => OpenRequest(val.id) }>

                                                <td> { val.id } </td>
                                                <td> { val.sender_name } </td>
                                                <td> { val.receiver_name } </td>
                                                <td> { val.company_name } <br /> { val.location_name } </td>
                                                <td> { d ? d.toDateString() : null } <br /> { val.request_time } </td>
                                                <td> 
                                                    <span className="statusBox">{ val.status }</span>
                                                </td>

                                            </tr>
                                        )

                                    }
                                )
                            }
                        </tbody>

                    </table>

                </div>
            }
            <ReactTooltip />
        </>
    )

}

export default ItemRequest;