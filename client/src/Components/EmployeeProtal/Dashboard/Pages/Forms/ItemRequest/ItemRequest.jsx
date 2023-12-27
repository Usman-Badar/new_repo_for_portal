/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import './ItemRequest.css';

import { Route, Switch, useHistory } from 'react-router-dom';
import axios from '../../../../../../axios';
import socket from '../../../../../../io';
import { useSelector } from 'react-redux';
import Modal from '../../../../../UI/Modal/Modal';
import JSAlert from 'js-alert';
import $ from 'jquery';
// import Hover from 'react-3d-hover';
import moment from 'moment';

const ItemRequest = () => {
    
    const history = useHistory();
    const AccessControls = useSelector( ( state ) => state.EmpAuth.EmployeeData );
    const Relations = useSelector((state) => state.EmpAuth.Relations);
    
    const [ LoadedLocations, setLoadedLocations ] = useState();
    const [ LoadedCompanies, setLoadedCompanies ] = useState();
    const [ LoadedReqEmployees, setLoadedReqEmployees ] = useState();
    const [ FilterCompany, setFilterCompany ] = useState('');
    const [ FilterLocation, setFilterLocation ] = useState('');
    const [ ReqEmployee, setReqEmployee ] = useState('');

    const [ SelectedProduct, setSelectedProduct ] = useState();
    const [ ShowModal, setShowModal ] = useState(false);
    const [ Content, setContent ] = useState();
    const [ ApprovalContent, setApprovalContent ] = useState();
    const [ RejectionContent, setRejectionContent ] = useState();
    const [ CancelContent, setCancelContent ] = useState();
    const [ RevivalContent, setRevivalContent ] = useState();
    const [ EditContent, setEditContent ] = useState();
    const [ RequestToStoreContent, setRequestToStoreContent ] = useState();
    const [ DeliveryContent, setDeliveryContent ] = useState();
    const [ IssueContent, setIssueContent ] = useState();
    const [ Index, setIndex ] = useState();
    const [ EditMode, setEditMode ] = useState(false);
    const [ Logs, setLogs ] = useState([]);
    const [ DisabledEntity, setDisabledEntity ] = useState(true);
    const [ Requests, setRequests ] = useState();
    const [ Locations, setLocations ] = useState([]);
    const [ Companies, setCompanies ] = useState([]);
    const [ Items, setItems ] = useState([]);
    const [ ReqToStore, setReqToStore ] = useState();
    const [ StoreItems, setStoreItems ] = useState();
    const [ Inwards, setInwards ] = useState();
    const [ ItemDetails, setItemDetails ] = useState();
    const [ RequestDetails, setRequestDetails ] = useState(
        {
            details: undefined,
            specifications: []
        }
    );
    const [ Entity, setEntity ] = useState(
        {
            name: "",
            required_quantity: "",
            reason: ""
        }
    )
    const [ Action, setAction ] = useState(
        {
            approve: false,
            reject: false,
            edit: false,
            cancel: false,
            revival: false,
            deliver: false,
            req_to_store: false
        }
    );

    useEffect(
        () => {

            if ( SelectedProduct )
            {
                setIssueContent(
                    <>
                        <h6>Issue <span className="text-capitalize">{ SelectedProduct.name }</span></h6>
                        <hr />
                        <form onSubmit={ ( e ) => AssignProduct( e, SelectedProduct ) }>
                            <fieldset>
                                <label className="mb-0">Required Quantity</label>
                                <input name="required_quantity" required className='form-control mb-2' disabled value={ sessionStorage.getItem('required_quantity') } />
                                <label className="mb-0">Deliver Quantity</label>
                                <input 
                                    name="deliver_quantity" 
                                    required 
                                    className='form-control' 
                                    type='number'
                                    defaultValue={ SelectedProduct.stored_quantity < parseInt(sessionStorage.getItem('required_quantity')) ? SelectedProduct.stored_quantity : parseInt(sessionStorage.getItem('required_quantity')) } 
                                    min={1} 
                                    max={ SelectedProduct.stored_quantity < parseInt(sessionStorage.getItem('required_quantity')) ? SelectedProduct.stored_quantity : parseInt(sessionStorage.getItem('required_quantity')) }
                                />
                                <button type='submit' className="btn light d-block ml-auto mt-3" disabled={ SelectedProduct.stored_quantity == 0 ? true : false }>Confirm</button>
                            </fieldset>
                        </form>
                    </>
                )
            }

        }, [ SelectedProduct ]
    );

    useEffect(
        () => {

            if ( Action.approve )
            {
                setApprovalContent(
                    <>
                        <h6>Approval Confirmation</h6>
                        <hr />
                        <form onSubmit={ (e) => ApproveRequest( e, RequestDetails.specifications ) }>
                            <fieldset>
                                <textarea name="remarks" rows={5} placeholder="Your Remarks..." minLength={20} required className='form-control'></textarea>
                                <button type='submit' className="btn light d-block ml-auto mt-3">Confirm</button>
                            </fieldset>
                        </form>
                    </>
                )
            }else
            if ( Action.reject )
            {
                setRejectionContent(
                    <>
                        <h6>Rejection Confirmation</h6>
                        <hr />
                        <form onSubmit={ (e) => RejectRequest( e, RequestDetails.specifications ) }>
                            <fieldset>
                                <textarea name="remarks" rows={5} placeholder="Your Remarks..." minLength={20} required className='form-control'></textarea>
                                <button type='submit' className="btn light d-block ml-auto mt-3">Confirm</button>
                            </fieldset>
                        </form>
                    </>
                )
            }else
            if ( Action.cancel )
            {
                setCancelContent(
                    <>
                        <h6>Cancelation Confirmation</h6>
                        <hr />
                        <form onSubmit={ (e) => CancelRequest( e, RequestDetails.specifications ) }>
                            <fieldset>
                                <textarea name="remarks" rows={5} placeholder="Your Remarks..." minLength={20} required className='form-control'></textarea>
                                <button type='submit' className="btn light d-block ml-auto mt-3">Confirm</button>
                            </fieldset>
                        </form>
                    </>
                )
            }else
            if ( Action.revival )
            {
                setRevivalContent(
                    <>
                        <h6>Receive Confirmation</h6>
                        <hr />
                        <form onSubmit={ (e) => RevivalRequest( e, RequestDetails.specifications ) }>
                            <fieldset>
                                <p className="mb-0">Did you received your required items?</p>
                                <button type='submit' className="btn light d-block ml-auto mt-3">Yes I received</button>
                            </fieldset>
                        </form>
                    </>
                )
            }else
            if ( Action.req_to_store )
            {
                setRequestToStoreContent(
                    <>
                        <h6>Request Summery</h6>
                        <table className="table table-sm">
                            <thead>
                                <tr>
                                    <th>Item</th>
                                    <th>Required Qty</th>
                                    <th>Assigned Qty</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    JSON.parse( sessionStorage.getItem('AssignedProductList') ).map(
                                        ( val, index ) => {
                                            return (
                                                <tr key={ index }>
                                                    <td>{ val.name }</td>
                                                    <td>{ val.required_quantity }</td>
                                                    <td>{ val.deliver_quantity }</td>
                                                </tr>
                                            )
                                        }
                                    )
                                }
                            </tbody>
                        </table>
                        <button type='button' className="btn light d-block mx-auto mt-3" onClick={ requestToStore }>Request To Store</button>
                    </>
                )
            }else
            if ( Action.deliver )
            {
                setDeliveryContent(
                    <>
                        <h6>Please Wait</h6>
                        <p className="mb-0">
                            We are loading the requested items...
                        </p>
                    </>
                );
                loadStoreReqDetails();
            }else
            if ( Action.edit )
            {
                setEditContent(
                    <>
                        <h6>Confirmation</h6>
                        <p className="mb-0">
                            Would you like to edit this request? This will redirect you to the item request form where you can edit this request.
                        </p>
                        <button onClick={ () => history.push('/item_requests/entry?mode=edit&&id=' + window.location.href.split('/').pop().split('=').pop()) } className="btn light mt-3 d-block ml-auto">Confirm</button>
                    </>
                );
            }

        }, [ Action.edit, Action.deliver, Action.approve, Action.reject, Action.cancel, Action.revival, Action.req_to_store ]
    );

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
            );

        // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []
    );

    useEffect(
        () => {

            if ( !Entity.item_id )
            {
                setDisabledEntity( true );
            }else
            if ( isNaN(parseInt(Entity.required_quantity)) || parseInt(Entity.required_quantity) <= 0 )
            {
                setDisabledEntity( true );
            }else
            if ( Entity.reason.length < 20 )
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

        }, [ Entity.name, Entity.required_quantity, Entity.reason ]
    )

    useEffect(
        () => {

            if ( Requests )
            {
                let companyNames = [];
                let locationNames = [];
                let senderNames = [];
                for ( let x = 0; x < Requests.length; x++ )
                {
                    if ( !companyNames.includes( Requests[x].company_name ) )
                    {
                        companyNames.push(Requests[x].company_name);
                    }

                    if ( !locationNames.includes( Requests[x].location_name ) )
                    {
                        locationNames.push(Requests[x].location_name);
                    }

                    if ( !senderNames.includes( Requests[x].sender_name ) )
                    {
                        senderNames.push(Requests[x].sender_name);
                    }
                }

                setLoadedCompanies( companyNames );
                setLoadedLocations( locationNames );
                setLoadedReqEmployees( senderNames );
            }

        // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [ Requests ]
    )

    const loadStoreReqDetails = () => {

        axios.post(
            '/inventory/get_item_request/store_req_details',
            {
                request_id: window.location.href.split('/').pop().split('=').pop()
            }
        ).then(
            res => {

                setReqToStore(res.data);
    
                setDeliveryContent(
                    <>
                        <h6>Confirmation</h6>
                        <p className="mb-2">
                            Would you like to proceed and deliver the following items to the requested employee?
                        </p>
                        <table className="table table-sm">
                            <thead>
                                <tr>
                                    <th>Item</th>
                                    <th>Required Qty</th>
                                    <th>Assigned Qty</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    RequestDetails.specifications.map(
                                        ( val, index ) => {
                                            return (
                                                <tr key={ index }>
                                                    <td>{ val.name }</td>
                                                    <td>{ val.required_quantity }</td>
                                                    <td>{ val.deliver_quantity }</td>
                                                </tr>
                                            )
                                        }
                                    )
                                }
                            </tbody>
                        </table>
                        <button type='button' className="btn light d-block ml-auto mt-3" onClick={ (e) => deliverTheRequiredItems(e, res.data[1]) }>Deliver</button>
                    </>
                );
            }
        ).catch(
            err => {
                console.log( err );
            }
        )

    }

    const requestToStore = ( e ) => {

        e.target.disabled = true;

        axios.post(
            '/inventory/item_request/request_to_store',
            {
                emp_id: localStorage.getItem('EmpID'),
                request_id: window.location.href.split('/').pop().split('=').pop(),
                products: sessionStorage.getItem('AssignedProductList')
            }
        ).then(
            () => {
    
                JSAlert.alert("Your Request Has Been Sent").dismissIn(1000 * 2);
                history.replace('/item_requests');
    
            }
        ).catch(
            err => {
    
                console.log( err );
                e.target.disabled = false;
    
            }
        )

    }

    const deliverTheRequiredItems = ( e, specifications ) => {

        e.target.disabled = true;
        axios.post(
            '/inventory/item_request/deliver_to_employee',
            {
                assigned_products: JSON.stringify(specifications),
                request_id: window.location.href.split('/').pop().split('=').pop(),
                requested_by: RequestDetails.details.request_by,
                issued_by: localStorage.getItem('EmpID')
            }
        ).then(
            () => {
    
                JSAlert.alert("Delivery is in process...").dismissIn(1000 * 2);
                history.replace('/item_requests');
    
            }
        ).catch(
            err => {
    
                console.log( err );
                e.target.disabled = false;
    
            }
        )

    }

    const AssignProduct = ( e, product ) => {

        e.preventDefault();
        const required_quantity = e.target['required_quantity'].value;
        const deliver_quantity = e.target['deliver_quantity'].value;
        let arr = [];
        
        product.required_quantity = required_quantity;
        product.deliver_quantity = deliver_quantity;
        product.item_id = sessionStorage.getItem('item_id');
        product.request_id = sessionStorage.getItem('request_id');

        if ( sessionStorage.getItem('AssignedProductList') )
        {
            arr = JSON.parse(sessionStorage.getItem('AssignedProductList'));
            let exists = false;

            for ( let x = 0; x < arr.length; x++ )
            {
                if ( arr[x].item_id == sessionStorage.getItem('item_id') )
                {
                    arr[x] = product;
                    exists = true;
                }
            }
            
            if ( !exists )
            {
                arr.push( product );
            }
        }else
        {
            arr.push( product );
        }

        sessionStorage.setItem('AssignedProductList', JSON.stringify(arr));
        history.replace('/item_requests/view/id=' + sessionStorage.getItem('request_id'));
    
    }

    const ApproveRequest = ( e, specifications ) => {

        e.preventDefault();
        $('fieldset').prop('disabled', true);
        axios.post(
            '/approveitemrequest',
            {
                request_id: RequestDetails.details.id,
                emp_id: AccessControls.emp_id,
                specifications: specifications ? JSON.stringify(specifications) : null,
                reason: e.target['remarks'] ? e.target['remarks'].value : null
            }
        ).then(
            () => {

                socket.emit( 'somethingchangeinitemrequest', RequestDetails.details.id );
                JSAlert.alert("Item Request Has Been Approved").dismissIn(1000 * 2);
                setTimeout(() => {
                    history.replace('/item_requests');
                }, 1500);

            }
        ).catch(
            err => {

                $('fieldset').prop('disabled', false);
                console.log( err );

            }
        )

    }

    const RejectRequest = ( e, specifications ) => {

        e.preventDefault();
        $('fieldset').prop('disabled', true);
        axios.post(
            '/rejectitemrequest',
            {
                request_id: RequestDetails.details.id,
                emp_id: AccessControls.emp_id,
                specifications: specifications ? JSON.stringify(specifications) : null,
                reason: e.target['remarks'] ? e.target['remarks'].value : null
            }
        ).then(
            () => {

                socket.emit( 'somethingchangeinitemrequest', RequestDetails.details.id );
                JSAlert.alert("Item Request Has Been Rejected").dismissIn(1000 * 2);
                setTimeout(() => {
                    history.replace('/item_requests');
                }, 1500);

            }
        ).catch(
            err => {

                $('fieldset').prop('disabled', false);
                console.log( err );

            }
        )

    }

    const CancelRequest = ( e, specifications ) => {

        e.preventDefault();
        $('fieldset').prop('disabled', true);
        axios.post(
            '/cancelitemrequest',
            {
                request_id: RequestDetails.details.id,
                emp_id: AccessControls.emp_id,
                specifications: specifications ? JSON.stringify(specifications) : null,
                reason: e.target['remarks'] ? e.target['remarks'].value : null
            }
        ).then(
            () => {

                socket.emit( 'somethingchangeinitemrequest', RequestDetails.details.id );
                JSAlert.alert("Item Request Has Been Cancelled").dismissIn(1000 * 2);
                setTimeout(() => {
                    history.replace('/item_requests');
                }, 1500);

            }
        ).catch(
            err => {

                $('fieldset').prop('disabled', false);
                console.log( err );

            }
        )

    }

    const RevivalRequest = ( e, specifications ) => {

        e.preventDefault();
        $('fieldset').prop('disabled', true);
        axios.post(
            '/delivereditemrequest',
            {
                request_id: RequestDetails.details.id,
                emp_id: AccessControls.emp_id,
                specifications: specifications ? JSON.stringify(specifications) : null,
                reason: e.target['remarks'] ? e.target['remarks'].value : null
            }
        ).then(
            () => {

                socket.emit( 'somethingchangeinitemrequest', RequestDetails.details.id );
                JSAlert.alert("Item Request Has Been Completed").dismissIn(1000 * 2);
                setTimeout(() => {
                    history.replace('/item_requests');
                }, 1500);

            }
        ).catch(
            err => {

                $('fieldset').prop('disabled', false);
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

    const GetRequestDetails = ( id ) => {

        axios.post('/getitemrequestdetails', { id: id })
        .then(
            res => 
            {

                setItems( res.data[1] );
                setRequestDetails(
                    {
                        details: res.data[0][0],
                        specifications: res.data[1]
                    }
                );

                GetLocations( res.data[0][0].company_code );

            }
        ).catch(
            err => {

                console.log(err);

            }
        );

    }

    const GetLocations = () => {

        axios.get('/getalllocations').then(
            res => {

                setLocations( res.data );

            }
        ).catch(
            err => {

                console.log( err );

            }
        )

    }

    const GetCompanies = () => {
        axios.get('/getallcompanies')
        .then(
            res => 
            {
                setCompanies(res.data);
                GetLocations();
            }
        ).catch(
            err => {

                console.log(err);

            }
        );
    }

    const GetStoreItems = ( key ) => {

        setStoreItems('Please Wait');
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
            setTimeout(() => {
                setStoreItems();
            }, 500);
        }

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

    const SelectItem = ( index ) => {

        const val ={
            ...Entity,
            item_id: StoreItems[index].id,
            name: StoreItems[index].name,
            hod_approval_required: StoreItems[index].hod_approval_required
        }

        setEntity( val );
        setStoreItems();

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

    const RemoveItem = ( index ) => {

        let arr = Items.filter(
            (val, i) => {

                return i !== index

            }
        );

        setItems( arr );

    }

    const SubmitForm = ( e ) => {

        e.preventDefault();
        const company_code = e.target['company_code'].value;
        const location_code = e.target['location_code'].value;
        let no_items_r_hod_approval = [];
        let no_items_n_hod_approval = [];

        if ( Items.length === 0 )
        {
            JSAlert.alert("No Item Added").dismissIn(1000 * 2);
            return false;
        }else
        if ( Entity.name !== '' || Entity.required_quantity !== '' || Entity.reason !== '' )
        {
            JSAlert.alert("There is an incomplete value in the fields... kindly add or clear.").dismissIn(1000 * 2);
            return false;
        }

        if ( RequestDetails.details )
        {
            setContent(
                <>
                    <form onSubmit={ ( e ) => confirmEditing( e, company_code, location_code, Items ) }>
                        <fieldset>
                            <h5>Summary</h5>
                            <hr />
                            <table className="table table-sm table-striped mb-0">
                                <tbody>
                                    <tr>
                                        <th>Company</th>
                                        <th>Changes</th>
                                    </tr>
                                    <tr>
                                        <td>{ RequestDetails.details.company_name }</td>
                                        <td>{ company_code == RequestDetails.details.company_code ? 'Nothing Changed' : $("select[name=company_code] :selected").text() }</td>
                                    </tr>
                                    <tr>
                                        <th>Location</th>
                                        <th>Changes</th>
                                    </tr>
                                    <tr>
                                        <td>{ RequestDetails.details.location_name }</td>
                                        <td>{ location_code == RequestDetails.details.location_code ? 'Nothing Changed' : $("select[name=location_code] :selected").text() }</td>
                                    </tr>
                                </tbody>
                            </table>
    
                            <b className='mt-2 d-block'>
                                Kindly Confirm the changes in this request.
                            </b>
                            <textarea name="reason" className='form-control mb-3' minLength={20} required />
    
                            <button className='btn light d-block ml-auto' type='submit'>Confirm</button>
                        </fieldset>
                    </form>
                </>
            );
        }else
        {
            Items.map(
                ( val ) => {
                    if ( val.hod_approval_required === 1 )
                    {
                        no_items_r_hod_approval.push(1);
                    }else
                    {
                        no_items_n_hod_approval.push(1);
                    }
                    return true;
                }
            );
    
            setContent(
                <>
                    <form onSubmit={ ( e ) => confirmSubmission( e, company_code, location_code, Items ) }>
                        <fieldset>
                            <h5>Summary</h5>
                            <hr />
                            <table className="table table-striped mb-0">
                                <tbody>
                                    <tr>
                                        <th>No. of items require H.O.Ds approval</th>
                                        <td>{ no_items_r_hod_approval.length }</td>
                                    </tr>
                                    <tr>
                                        <th>No. of items do not require H.O.Ds approval</th>
                                        <td>{ no_items_n_hod_approval.length }</td>
                                    </tr>
                                </tbody>
                            </table>
    
                            <span className='mb-2 d-block'>
                                {
                                    no_items_r_hod_approval.length > 0
                                    ?
                                    <>This request will proceed to your H.O.D. <br /> Kindly select any option from the list below...</>
                                    :
                                    <>This request will proceed directly to the inventory department.</>
                                }
                            </span>
    
                            {
                                Relations && no_items_r_hod_approval.length > 0
                                ?
                                Relations.map(
                                    (val, index) => {
                                        let option;
                                        if ( val.category === 'all' || val.category.includes('item_request') )
                                        {
                                            option = (
                                                <div className='d-flex align-items-center mb-1'>
                                                    <input required className='mr-1' value={val.sr} type="radio" name="hod" key={index} /> {val.name}
                                                </div>
                                            )
                                        }
    
                                        return option;
                                    }
                                )
                                :null
                            }
    
                            <button className='btn light d-block ml-auto' type='submit'>Confirm</button>
                        </fieldset>
                    </form>
                </>
            );
        }

        setShowModal( !ShowModal );

    }

    const confirmSubmission = ( e, company_code, location_code, Items ) => {

        e.preventDefault();
        $('fieldset').prop('disabled', true);
        const hod = e.target['hod'] ? e.target['hod'].value : 0;
        axios.post(
            '/newitemrequest',
            {
                company_code: company_code,
                location_code: location_code,
                hod: hod,
                request_by: localStorage.getItem('EmpID'),
                specifications: JSON.stringify( Items )
            }
        ).then(
            () => {

                JSAlert.alert("Item Request Has Been Sent").dismissIn(1000 * 2);
                setTimeout(() => {
                    history.replace('/item_requests');
                }, 1500);

            }
        ).catch(
            err => {

                $('fieldset').prop('disabled', false);
                console.log( err );

            }
        )

    }

    const confirmEditing = ( e, company_code, location_code, Items ) => {

        e.preventDefault();
        $('fieldset').prop('disabled', true);
        axios.post(
            '/edititemrequest',
            {
                company_code: company_code,
                location_code: location_code,
                request_id: window.location.href.split('&&id=').pop(),
                reason: e.target['reason'].value,
                edit_by: localStorage.getItem('EmpID'),
                specifications: JSON.stringify( Items )
            }
        ).then(
            () => {

                JSAlert.alert("Item Request Has Been Updated").dismissIn(1000 * 2);
                setTimeout(() => {
                    history.replace('/item_requests/view/id='+window.location.href.split('&&id=').pop());
                }, 1500);

            }
        ).catch(
            err => {

                $('fieldset').prop('disabled', false);
                console.log( err );

            }
        )

    }

    const onAction = ( type, checked ) => {

        setAction(
            {
                ...Action,
                [type]: checked
            }
        );

    }

    const GetItemDetails = ( id ) => {

        setItemDetails();
        setItems([]);
 
        axios.post(
            '/inventory/item_request/get_sub_category_items',
            {
                id: id
            }
        ).then(
            res => {

                if ( res.data[0][0] )
                {
                    setItemDetails( res.data[0][0] );
                    setItems( res.data[1] );
                    getAllInwards( res.data[0][0].product_id, setInwards );
                }else
                {
                    JSAlert.alert("Nothing Found...").dismissIn(1000 * 2);
                    history.goBack();
                }

            }
        ).catch(
            err => {

                console.log( err );

            }
        )

    }

    const getAllInwards = ( product_id, setInwards ) => {

        axios.post(
            '/inventory/get/product/inwards',
            {
                product_id: product_id
            }
        ).then(
            res => {
    
                setInwards( res.data );
    
            }
        ).catch(
            err => {
    
                console.log( err );
    
            }
        )
    
    }

    return (
        <>
            <div className="Item_Request page">
                <Modal show={ ShowModal } Hide={ () => setShowModal( !ShowModal ) } content={ Content } />
                <Modal show={ Action.approve } Hide={ () => onAction( 'approve', false ) } content={ ApprovalContent } />
                <Modal show={ Action.reject } Hide={ () => onAction( 'reject', false ) } content={ RejectionContent } />
                <Modal show={ Action.cancel } Hide={ () => onAction( 'cancel', false ) } content={ CancelContent } />
                <Modal show={ Action.revival } Hide={ () => onAction( 'revival', false ) } content={ RevivalContent } />
                <Modal show={ Action.req_to_store } Hide={ () => onAction( 'req_to_store', false ) } content={ RequestToStoreContent } />
                <Modal show={ Action.deliver } Hide={ () => onAction( 'deliver', false ) } content={ DeliveryContent } />
                <Modal show={ Action.edit } Hide={ () => onAction( 'edit', false ) } content={ EditContent } />
                <Modal show={ SelectedProduct ? true : false } Hide={ () => setSelectedProduct() } content={ IssueContent } />
                {/* <Hover perspective={2000} speed={1000}> */}
                    <div className="Item_Request_container page-content">
                        
                        <Switch>
                            <Route exact path="/item_requests" render={ 
                                    () => (
                                        <ListView 
                                            List={ Requests }
                                            history={ history }
                                            LoadedLocations={ LoadedLocations }
                                            LoadedCompanies={ LoadedCompanies }
                                            LoadedReqEmployees={ LoadedReqEmployees }
                                            FilterLocation={ FilterLocation }
                                            ReqEmployee={ ReqEmployee }
                                            FilterCompany={ FilterCompany }

                                            setFilterLocation={ setFilterLocation }
                                            setReqEmployee={ setReqEmployee }
                                            setFilterCompany={ setFilterCompany }
                                        />
                                    )
                                } 
                            />
                            <Route exact path="/item_requests/view/id=:id" render={ 
                                    () => (
                                        <DetailsView 
                                            Action={ Action }
                                            history={ history }
                                            RequestDetails={ RequestDetails }
                                            AccessControls={ AccessControls }

                                            onAction={ onAction }
                                            GetRequestDetails={ GetRequestDetails }
                                        />
                                    )
                                } 
                            />
                            <Route exact path="/item_requests/entry" render={ 
                                    () => (
                                        <Entry 
                                            history={ history }
                                            Companies={ Companies }
                                            Locations={ Locations }
                                            StoreItems={ StoreItems }
                                            DisabledEntity={ DisabledEntity }
                                            Items={ Items }
                                            Entity={ Entity }
                                            EditMode={ EditMode }
                                            Index={ Index }
                                            RequestDetails={ RequestDetails }

                                            GetRequestDetails={ GetRequestDetails }
                                            SubmitForm={ SubmitForm }
                                            RemoveItem={ RemoveItem }
                                            EditItem={ EditItem }
                                            AddItem={ AddItem }
                                            SelectItem={ SelectItem }
                                            onChangeEntities={ onChangeEntities }
                                            GetCompanies={ GetCompanies }
                                        />
                                    )
                                } 
                            />
                            <Route exact path="/item_requests/issue/id=:id" render={ 
                                    () => (
                                        <ItemView 
                                            Items={ Items }
                                            ItemDetails={ ItemDetails }
                                            history={ history }
                                            Inwards={ Inwards }
                                            Companies={ Companies }

                                            setSelectedProduct={ setSelectedProduct }
                                            GetCompanies={ GetCompanies }
                                            GetItemDetails={ GetItemDetails }
                                        />
                                    )
                                } 
                            />
                        </Switch>

                    </div>
                {/* </Hover> */}
            </div>
        </>
    )

}

export default ItemRequest;

const ItemView = ( { Companies, history, Inwards, Items, ItemDetails, GetCompanies, GetItemDetails, setSelectedProduct } ) => {

    useEffect(
        () => {
            
            if ( Items.length === 0 )
            {
                GetCompanies();
                GetItemDetails( window.location.href.split('/').pop().split('=').pop() );
            }

        }, [ Items.length ]
    );

    return (
        <>
            {
                ItemDetails && Items.length > 0
                ?
                <>
                    <div className="d-flex align-items-center justify-content-between">
                        <h3 className="heading">
                            { sessionStorage.getItem('sub_category_name') }
                            <sub>Sub Category</sub>
                        </h3>
        
                        <button className="btn submit" onClick={ () => history.goBack() } type='button'>Go Back</button>
                    </div>
                    <hr />
                    <div className="item_details_grid">
                        <div>

                            <table className="table table-bordered text-center table-striped">
                                <thead>
                                    <tr>
                                        <th>Total Store Quantity</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            <span style={ { fontSize: 40 } }>{ ItemDetails.quantity }</span>
                                            Qty
                                        </td>
                                    </tr>
                                </tbody>
                            </table>

                            <table className="table table-bordered text-center table-striped">
                                <thead>
                                    <tr>
                                        <th>Companies</th>
                                        <th>Stored Quantity</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        Companies.map(
                                            ( val, index ) => {

                                                let content = (
                                                    <tr key={ index }>
                                                        <td>{ val.company_name }</td>
                                                        <td>0 Qty</td>
                                                    </tr>
                                                );
                                                for ( let x = 0; x < Items.length; x++ )
                                                {
                                                    if ( Items[x].company_code === val.company_code )
                                                    {
                                                        content = (
                                                            <tr key={ index }>
                                                                <td>{ Items[x].company_name }</td>
                                                                <td>{ Items[x].stored_quantity } Qty</td>
                                                            </tr>
                                                        )
                                                    }
                                                }
                                                return content;
                                            }
                                        )
                                    }
                                </tbody>
                            </table>

                        </div>
                        <div>
                            
                            {
                                Inwards
                                ?
                                Inwards.length === 0
                                ?
                                <h6 className="text-center">No Record Found</h6>
                                :
                                <>
                                    <h6 className="mb-0">Total Inwards</h6>
                                    <p className="mb-1">
                                        Kindly issue the required items from the list of inwards below.
                                    </p>
                                    <table className="table table-bordered text-center table-striped">
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>Company</th>
                                                <th>Inward Qty</th>
                                                <th>Stored Qty</th>
                                                <th>Dated</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                Inwards.map(
                                                    ( val, index ) => {
                                                        return (
                                                            <tr key={ index } className="pointer" onClick={ () => setSelectedProduct( val ) }>
                                                                <td>{ index + 1 }</td>
                                                                <td>{ val.company_name }</td>
                                                                <td>{ val.quantity }</td>
                                                                <td>{ val.stored_quantity }</td>
                                                                <td>{ moment(new Date(val.record_date)).format('MM-DD-YYYY') }</td>
                                                            </tr>
                                                        );
                                                    }
                                                )
                                            }
                                        </tbody>
                                    </table>
                                </>
                                :
                                <h6 className="text-center">Please Wait....</h6>
                            }

                        </div>
                    </div>
                </>
                :
                <h6 className='text-center mb-0'>Please Wait...</h6>
            }
        </>
    )

}

const DetailsView = ( { AccessControls, Action, RequestDetails, history, onAction, GetRequestDetails } ) => {

    const details = RequestDetails.details;
    const specifications = RequestDetails.specifications;
    const AssignedProductList = sessionStorage.getItem('AssignedProductList') ? JSON.parse(sessionStorage.getItem('AssignedProductList')) : [];
    const [ accessKey, setAccessKey ] = useState(false);

    useEffect(
        () => {

            if ( AssignedProductList.length === specifications.length && details && details.status === 'approved' )
            {
                JSAlert.alert("All Done... Now Send Your Request To Store Department").dismissIn(1000 * 1);
            }

        }, [ AssignedProductList.length, specifications.length ]
    );

    useEffect(
        () => {
            
            if ( AccessControls.access )
            {
                for ( let x = 0; x < JSON.parse(AccessControls.access).length; x++ )
                {
                    if ( parseInt(JSON.parse(AccessControls.access)[x]) === 25 )
                    {
                        setAccessKey(true);
                    }
                }
            }

        }, [ AccessControls.access ]
    );

    useEffect(
        () => {
            
            GetRequestDetails( window.location.href.split('/').pop().split('=').pop() );

        }, []
    );

    const selectRow = ( item_id, name, required_quantity ) => {

        if ( accessKey )
        {
            if ( details.status === 'approved' )
            {
                sessionStorage.setItem('sub_category_name', name);
                sessionStorage.setItem('item_id', item_id);
                sessionStorage.setItem('required_quantity', required_quantity);
                sessionStorage.setItem('request_id', window.location.href.split('/').pop().split('=').pop())
                history.push('/item_requests/issue/id=' + item_id);
            }else
            if ( details.status === 'sent' )
            {
                JSAlert.alert("Pending Approval").dismissIn(1000 * 2);
            }
        }

    }

    return (
        <>
            <div className="d-flex align-items-center justify-content-between">
                <h3 className="heading">
                    Item Request
                    <sub>View Details</sub>
                </h3>

                <button className="btn submit" onClick={ () => history.push('/item_requests') } type='button'>Back To Requests</button>
            </div>
            <hr />

            {
                details
                ?
                <div className='animate__animated animate__fadeIn'>
                    <div className="d-flex align-items-center justify-content-end mb-3">
                        {
                            AssignedProductList.length === specifications.length && details.status === 'approved'
                            ?
                            <div className="d-flex align-items-center justify-content-end mr-3">
                                <label class="switch mb-0 mr-2">
                                    <input checked={ Action.req_to_store } onChange={ ( e ) => onAction('req_to_store', e.target.checked) } type="checkbox" />
                                    <span class="slider"></span>
                                </label>
                                <span>Request To Store</span>
                            </div>
                            :null
                        }
                        {
                            details.status === 'sent' && details.received_by === parseInt(localStorage.getItem("EmpID"))
                            ?
                            <>
                                <div className="d-flex align-items-center justify-content-end mr-3">
                                    <label class="switch mb-0 mr-2">
                                        <input checked={ Action.reject } onChange={ ( e ) => onAction('reject', e.target.checked) } type="checkbox" />
                                        <span class="slider danger"></span>
                                    </label>
                                    <span>Reject</span>
                                </div>
                                <div className="d-flex align-items-center justify-content-end mr-3">
                                    <label class="switch mb-0 mr-2">
                                        <input checked={ Action.approve } onChange={ ( e ) => onAction('approve', e.target.checked) } type="checkbox" />
                                        <span class="slider"></span>
                                    </label>
                                    <span>Approve</span>
                                </div>
                                {
                                    accessKey
                                    ?
                                    <div className="d-flex align-items-center justify-content-end">
                                        <label class="switch mb-0 mr-2">
                                            <input checked={ Action.edit } onChange={ ( e ) => onAction('edit', e.target.checked) } type="checkbox" />
                                            <span class="slider"></span>
                                        </label>
                                        <span>Edit</span>
                                    </div>
                                    :null
                                }
                            </>
                            :null
                        }
                        {
                            details.status === 'delivering_to_inventory'
                            ?
                            <div className="d-flex align-items-center justify-content-end">
                                <label class="switch mb-0 mr-2">
                                    <input checked={ Action.deliver } onChange={ ( e ) => onAction('deliver', e.target.checked) } type="checkbox" />
                                    <span class="slider green"></span>
                                </label>
                                <span>Deliver To Employee</span>
                            </div>
                            :null
                        }
                        {
                            details.status === 'sent' && details.request_by === parseInt(localStorage.getItem('EmpID'))
                            ?
                            <div className="d-flex align-items-center justify-content-end">
                                <label class="switch mb-0 mr-2">
                                    <input checked={ Action.cancel } onChange={ ( e ) => onAction('cancel', e.target.checked) } type="checkbox" />
                                    <span class="slider green"></span>
                                </label>
                                <span>Cancel</span>
                            </div>
                            :null
                        }
                        {
                            details.status === 'delivery is in process' && details.request_by === parseInt(localStorage.getItem('EmpID'))
                            ?
                            <div className="d-flex align-items-center justify-content-end">
                                <label class="switch mb-0 mr-2">
                                    <input checked={ Action.revival } onChange={ ( e ) => onAction('revival', e.target.checked) } type="checkbox" />
                                    <span class="slider"></span>
                                </label>
                                <span>Received</span>
                            </div>
                            :null
                        }
                    </div>

                    <table className="table table-bordered">
                        <tbody>
                            <tr>
                                <th className='bg-light'>Requested By</th>
                                <td>{ details.sender_name }</td>
                                <th className='bg-light'>Request Date</th>
                                <td>{ moment(new Date(details.request_date)).format('MM-DD-YYYY') }</td>
                                <th className='bg-light'>Received By</th>
                                <td>{ details.receiver_name }</td>
                            </tr>
                            <tr>
                                <th className='bg-light'>Company</th>
                                <td>{ details.company_name }</td>
                                <th className='bg-light'>Delivery Location</th>
                                <td>{ details.location_name }</td>
                                <th className='bg-light'>Request Status</th>
                                <td 
                                    style={ 
                                        { 
                                            textTransform: "capitalize",
                                            backgroundColor: (
                                                details.status === 'approved' 
                                                ? 
                                                '#28A745'
                                                :
                                                details.status === 'rejected'
                                                ?
                                                '#DC3545'
                                                :
                                                '#343A40'
                                            )
                                        } 
                                    }
                                    className="text-light"
                                >
                                    {
                                        details.status === 'sent' && details.received_by == localStorage.getItem('EmpID')
                                        ?
                                        'Pending For Approval'
                                        :
                                        details.status.split('_').join(' ')
                                    }
                                </td>
                            </tr>
                            <tr>
                                <th className='bg-light'>
                                    {
                                        details.status === 'canceled'
                                        ?
                                        "Cancelation "
                                        :
                                        details.status === 'rejected'
                                        ?
                                        "Rejection "
                                        :
                                        "Approval "
                                    } 
                                    Date
                                </th>
                                <td>{ details.acted_date === null ? "Not Approve Yet" : moment(new Date(details.acted_date)).format('MM-DD-YYYY') }</td>
                            </tr>
                        </tbody>
                    </table>

                    <h6>List Of The Required Items</h6>

                    <table className="table table-bordered table-striped border-0">
                        <thead>
                            <tr>
                                <th className='text-center'>Sr.No</th>
                                <th className='text-center'>Item</th>
                                <th className='text-center'>H.O.D's Approval Required</th>
                                <th className='text-center'>Required Qty</th>
                                {
                                    details.status === 'at_store'
                                    ||
                                    details.status === 'delivering_to_inventory'
                                    ||
                                    details.status === 'delivered'
                                    ||
                                    details.status === 'delivery is in process'
                                    ||
                                    details.status === 'partially_delivered'
                                    ?
                                    <th className='text-center'>Assigned Qty</th>
                                    :null
                                }
                                <th className='text-center'>Reason</th>
                            </tr>
                        </thead>
                        <tbody id="specifications_table_body">
                            {
                                specifications.map(
                                    ( val, index ) => {

                                        let status = false;
                                        for ( let x = 0; x < AssignedProductList.length; x++ )
                                        {
                                            if ( parseInt(AssignedProductList[x].item_id) === parseInt(val.item_id) )
                                            {
                                                status = true;
                                            }
                                        }

                                        return (
                                            <tr title={ accessKey ? 'Double Click' : undefined } className={ accessKey ? status ? 'pointer issued' : 'pointer' : '' } onDoubleClick={ () => selectRow( val.item_id, val.name, val.required_quantity ) } id={ "specification_row_" + index } key={ index }>
                                                <td className='text-center' id={  'specification_serial_no_' + index }>{ index + 1 }</td>
                                                <td className='text-center' id={  'specification_description_' + index }>{ val.name }</td>
                                                <td className='text-center' id={  'specification_hod_approval_' + index }>
                                                    {
                                                        val.hod_approval_required === 1
                                                        ?
                                                        <span className="text-danger">Required</span>
                                                        :
                                                        <span className="text-dark">Not Required</span>
                                                    }
                                                </td>
                                                <td className='text-center' id={  'specification_quantity_' + index }>{ val.required_quantity }</td>
                                                {
                                                    val.deliver_quantity
                                                    ?
                                                    <td className='text-center' id={  'specification_d_quantity_' + index }>{ val.deliver_quantity }</td>
                                                    :null
                                                }
                                                <td className='text-center' id={  'specification_reason_' + index }>{ val.reason }</td>
                                            </tr>
                                        )
                                    }
                                )
                            }
                        </tbody>
                    </table>
                    
                    {
                        AssignedProductList && AssignedProductList.length > 0
                        ?
                        <>
                            <h6>List Of The Issued Items</h6>
                            <table className="table table-bordered table-striped border-0">
                                <thead>
                                    <tr>
                                        <th className='text-center'>Sr.No</th>
                                        <th className='text-center'>Name</th>
                                        <th className='text-center'>H.O.D's Approval Required</th>
                                        <th className='text-center'>Required Quantity</th>
                                        <th className='text-center'>Assigned Quantity</th>
                                    </tr>
                                </thead>
                                <tbody id="specifications_table_body">
                                    {
                                        AssignedProductList.map(
                                            ( val, index ) => {

                                                return (
                                                    <tr key={ index }>
                                                        <td className='text-center' id={  'specification_serial_no_' + index }>{ index + 1 }</td>
                                                        <td className='text-center' id={  'specification_description_' + index }>{ val.name }</td>
                                                        <td className='text-center' id={  'specification_hod_approval_' + index }>
                                                            {
                                                                val.hod_approval_required === 1
                                                                ?
                                                                <span className="text-danger">Required</span>
                                                                :
                                                                <span className="text-dark">Not Required</span>
                                                            }
                                                        </td>
                                                        <td className='text-center' id={  'specification_required_quantity_' + index }>{ val.required_quantity }</td>
                                                        <td className='text-center' id={  'specification_deliver_quantity_' + index }>{ val.deliver_quantity }</td>
                                                    </tr>
                                                )
                                            }
                                        )
                                    }
                                </tbody>
                            </table>
                        </>
                        :null
                    }

                    <div className='d-flex w-100'>
                        <div className='w-100 pr-2'>
                            {
                                RequestDetails.details.acted_date === null
                                ?null
                                :
                                <>
                                    <h6>Remarks</h6>
                                    <table className="table">
                                        <tbody>
                                            <tr>
                                                <th>Remarks From: </th>
                                                <td>{ details.acted_name }</td>
                                            </tr>
                                            <tr>
                                                <th>Remarks: </th>
                                                <td>{ details.remarks ? details.remarks : "No Remarks Yet" }</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </>
                            }
                        </div>
                        <div className='w-100 pl-2'>
                            {
                                RequestDetails.details.delivery_date === null
                                ?null
                                :
                                <>
                                    <h6>Delivery</h6>
                                    <table className="table">
                                        <tbody>
                                            <tr>
                                                <th>Delivery Date: </th>
                                                <td>{ moment(new Date(RequestDetails.details.delivery_date)).format('MM-DD-YYYY') }</td>
                                            </tr>
                                            <tr>
                                                <th>Delivery Time: </th>
                                                <td>{ details.delivery_time.substring(0,5) }</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </>
                            }
                        </div>
                    </div>
                </div>
                :
                <h6 className="text-center mb-0">Please Wait....</h6>
            }
        </>
    )

}

const ListView = ( { FilterLocation, ReqEmployee, FilterCompany, List, history, LoadedReqEmployees, LoadedLocations, LoadedCompanies, setFilterLocation, setReqEmployee, setFilterCompany } ) => {

    useEffect(
        () => {

            return () => {
                if ( sessionStorage.getItem('AssignedProductList') )
                {
                    sessionStorage.removeItem('AssignedProductList');
                }
            }

        }, []
    )

    const Arr = List ? List.filter(
        val => {
            return val.company_name.toLowerCase().includes(FilterCompany.toLowerCase()) && val.location_name.toLowerCase().includes(FilterLocation.toLowerCase()) && val.sender_name?.toLowerCase().includes(ReqEmployee.toLowerCase());
        }
    ) : null;

    return (
        <>
            <div className="d-flex align-items-center justify-content-between">
                <h3 className="heading">
                    Item Request
                    <sub>all list view</sub>
                </h3>

                <div>
                    <button className="btn submit" onClick={ () => history.push('/item_requests/entry') } type='button'>New Request</button>
                    <button className="btn submit px-2 ml-2 filter-emit" type='button'>
                        <i className="las la-filter"></i> Filters
                        <div className="filter-container">
                            <h6 className='mb-0' style={{ fontFamily: 'Oxygen' }}>Filter Options</h6>
                            <hr className='my-1 bg-dark' />

                            {
                                LoadedLocations
                                ?
                                <>
                                    <label className="font-weight-bold mb-0">Location</label>
                                    <select className='form-control form-control-sm mb-2' onChange={ (e) => setFilterLocation(e.target.value) }>
                                        <option value=''>Select Option</option>
                                        {
                                            LoadedLocations.sort().map(
                                                ( location, index ) => {

                                                    return <option key={ index } value={ location }>{ location }</option>;

                                                }
                                            )
                                        }
                                    </select>
                                </>
                                :null
                            }
                            {
                                LoadedCompanies
                                ?
                                <>
                                    <label className="font-weight-bold mb-0">Company</label>
                                    <select className='form-control form-control-sm mb-2' onChange={ (e) => setFilterCompany(e.target.value) }>
                                        <option value=''>Select Option</option>
                                        {
                                            LoadedCompanies.sort().map(
                                                ( company, index ) => {

                                                    return <option key={ index } value={ company }>{ company }</option>;

                                                }
                                            )
                                        }
                                    </select>
                                </>
                                :null
                            }
                            {
                                LoadedReqEmployees
                                ?
                                <>
                                    <label className="font-weight-bold mb-0">Requested By</label>
                                    <select className='form-control form-control-sm mb-2' onChange={ (e) => setReqEmployee(e.target.value) }>
                                        <option value=''>Select Option</option>
                                        {
                                            LoadedReqEmployees.sort().map(
                                                ( employee, index ) => {

                                                    return <option key={ index } value={ employee }>{ employee }</option>;

                                                }
                                            )
                                        }
                                    </select>
                                </>
                                :null
                            }
                        </div>
                    </button>
                </div>
            </div>
            <hr />

            {
                Arr
                ?
                Arr.length === 0
                ?
                <h6 className="text-center">No Record Found</h6>
                :
                <table className="table">
                    <thead>
                        <tr>
                            <th>Sr.No</th>
                            <th>Company & Location</th>
                            <th>Requested By</th>
                            <th>Received By</th>
                            <th>Current Status</th>
                            <th>Date & Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            Arr.map(
                                ( val, index ) => {
                                    return (
                                        <tr key={ index } className="pointer pointer-hover" onClick={ () => history.replace('/item_requests/view/id=' + val.id) }>
                                            <td>{ index + 1 }</td>
                                            <td>
                                                { val.company_name } <br />
                                                { val.location_name }
                                            </td>
                                            <td>
                                                { val.sender_name }
                                            </td>
                                            <td>
                                                { val.receiver_name }
                                            </td>
                                            <td>
                                                <div className='d-flex align-items-center'>
                                                    <div 
                                                        className={
                                                            "dot mr-1 "
                                                            +
                                                            (
                                                                val.status === 'approved' || val.status === 'delivered' || val.status === 'partially delivered'
                                                                ?
                                                                "bg-success"
                                                                :
                                                                val.status === 'rejected'
                                                                ?
                                                                "bg-danger"
                                                                :
                                                                "bg-dark"
                                                            )
                                                        }
                                                    ></div>
                                                    <div
                                                        className={
                                                            "text-capitalize "
                                                            +
                                                            (
                                                                val.status === 'approved' || val.status === 'delivered' || val.status === 'partially delivered'
                                                                ?
                                                                "text-success"
                                                                :
                                                                val.status === 'rejected'
                                                                ?
                                                                "text-danger"
                                                                :
                                                                "text-dark"
                                                            )
                                                        }
                                                    >{ val.status.split('_').join(' ') }</div>
                                                </div>
                                            </td>
                                            <td>
                                                { moment(new Date(val.request_date)).format('MM-DD-YYYY') } at { val.request_time.substring(0,5) }
                                            </td>
                                        </tr>
                                    )
                                }
                            )
                        }
                    </tbody>
                </table>
                :
                <h6 className="text-center">Please Wait...</h6>
            }
        </>
    )

}

const Entry = ( { RequestDetails, EditMode, Index, Entity, Items, DisabledEntity, StoreItems, history, Locations, Companies, SubmitForm, SelectItem, AddItem, RemoveItem, EditItem, onChangeEntities, GetCompanies, GetRequestDetails } ) => {

    const details = RequestDetails.details;
    const [ edit, setEdit ] = useState(false);

    useEffect(
        () => {
            GetCompanies();
        }, []
    );

    useEffect(
        () => {
            
            if ( window.location.href.includes('?') )
            {
                setEdit(true);
            }
            if ( Companies.length > 0 && Locations.length > 0 && window.location.href.includes('?') )
            {
                GetRequestDetails( window.location.href.split('&&id=').pop() );
            }

        }, [ Companies.length, Locations.length ]
    );

    return (
        <>
            <div className="d-flex align-items-center justify-content-between">
                <h3 className="heading">
                    Item Request
                    <sub>New Request</sub>
                </h3>

                <button className="btn submit" onClick={ () => history.push('/item_requests') } type='button'>Back To List</button>
            </div>
            <hr />

            {
                edit && !details
                ?
                <h6 className="text-center">Loading Details...</h6>
                :
                <form onSubmit={ SubmitForm }>
                    <fieldset>
                        <div className="flex_container mb-3">

                            <div>
                                <label className='mb-0'>
                                    <b>Company</b>
                                </label>
                                <select className="form-control" name="company_code" required>
                                    <option value=''>Select the option</option>
                                    {
                                        Companies.map(
                                            val => {

                                                return (
                                                    <option 
                                                        key={ val.company_code } 
                                                        value={ val.company_code }
                                                        selected={details&&details.company_code==val.company_code?true:false}
                                                    > { val.company_name } </option>
                                                )

                                            }
                                        )
                                    }
                                </select>
                            </div>
                            <div>
                                <label className='mb-0'>
                                    <b>Location</b>
                                </label>
                                <select className="form-control" name="location_code" required>
                                    <option value=''>Select the option</option>
                                    {
                                        Locations.map(
                                            val => {

                                                return (
                                                    <option 
                                                        key={ val.location_code } 
                                                        value={ val.location_code }
                                                        selected={details&&details.location_code==val.location_code?true:false}
                                                    > { val.location_name } </option>
                                                );

                                            }
                                        )
                                    }
                                </select>
                            </div>

                        </div>

                        <div className='mb-3'>
                            <div className="grid">

                                <div>
                                    <label className='mb-0'>
                                        <b>Item</b>
                                    </label>
                                    <div className="items_container">
                                        <input className="form-control" value={ Entity.name } name="name" onChange={ onChangeEntities } />
                                        {
                                            StoreItems
                                            ?
                                            <div className="items_list">
                                                {
                                                    typeof(StoreItems) ===  'string'
                                                    ?
                                                    <p className="text-center mb-0">{ StoreItems }</p>
                                                    :
                                                    StoreItems.length === 0
                                                    ?
                                                    <p className="text-center mb-0">No Record Found</p>
                                                    :
                                                    StoreItems.map(
                                                        ( val, index ) => {
                                                            return (
                                                                <div onClick={ () => SelectItem(index) } key={ index } className="item text-capitalize">
                                                                    { val.name }
                                                                    <hr className='m-0' />
                                                                </div>
                                                            )
                                                        }
                                                    )
                                                }
                                            </div>
                                            :null
                                        }
                                        <small><b>Select from the dropdown</b></small>
                                    </div>
                                </div>

                                <div>
                                    <label className='mb-0'>
                                        <b>Quantity</b>
                                    </label>
                                    <input className="form-control" value={ Entity.required_quantity } type='number' onChange={ onChangeEntities } name="required_quantity" />
                                    <small><b>Minimum 1 is required</b></small>
                                </div>

                                <div>
                                    <label className='mb-0'>
                                        <b>Reason</b>
                                    </label>
                                    <input className="form-control" value={ Entity.reason } onChange={ onChangeEntities } name="reason" />
                                    <small><b>Minimum 20 characters are required</b></small>
                                </div>

                            </div>
                            <button onClick={ () => AddItem( 'log' ) } className="btn d-block ml-auto submit mt-2" type='button' disabled={ DisabledEntity }>
                                {
                                    EditMode
                                    ?
                                    ("Press To Update " + ( Index + 1 ))
                                    :
                                    "Press To Enter"
                                }
                            </button>
                        </div>

                        <h6>Entered Items List</h6>
                        {
                            Items.length === 0
                            ?
                            <>
                                <p className="text-center mb-0"><b>No Item Entered</b></p>
                                <hr className='my-1' />
                            </>
                            :
                            <table className="table table-bordered table-striped border-0">
                                <thead>
                                    <tr>
                                        <th className='text-center'>Sr.No</th>
                                        <th className='text-center'>Item</th>
                                        <th className='text-center'>H.O.D's Approval Required</th>
                                        <th className='text-center'>Required Quantity</th>
                                        <th className='text-center' colSpan={2}>Reason</th>
                                    </tr>
                                </thead>
                                <tbody id="specifications_table_body">
                                    {
                                        Items.map(
                                            ( val, index ) => {
                                                return (
                                                    <tr id={ "specification_row_" + index } key={ index }>
                                                        <td className='text-center' id={  'specification_serial_no_' + index }>{ index + 1 }</td>
                                                        <td className='text-center' id={  'specification_description_' + index }>{ val.name }</td>
                                                        <td className='text-center' id={  'specification_hod_approval_' + index }>
                                                            {
                                                                val.hod_approval_required === 1
                                                                ?
                                                                <span className="text-danger">Required</span>
                                                                :
                                                                <span className="text-dark">Not Required</span>
                                                            }
                                                        </td>
                                                        <td className='text-center' id={  'specification_quantity_' + index }>{ val.required_quantity }</td>
                                                        <td className='text-center' id={  'specification_reason_' + index }>{ val.reason }</td>
                                                        <td className='text-center' id={  'specification_action_' + index }>
                                                            <span>
                                                                <i onClick={ () => EditItem( index ) } className="lar text-success mx-1 la-edit"></i>
                                                                <i onClick={ () => RemoveItem( index ) } className="lar text-danger mx-1 la-trash-alt"></i>
                                                            </span>
                                                        </td>
                                                    </tr>
                                                )
                                            }
                                        )
                                    }
                                </tbody>
                            </table>
                        }
                        <button className="btn d-block ml-auto submit mt-3" type='submit'>
                            {
                                details
                                ?
                                "Done Editing"
                                :
                                "Send Request"
                            }
                        </button>

                    </fieldset>
                </form>
            }
        </>
    )

}