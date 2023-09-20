/* eslint-disable eqeqeq */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import './Style.css';
import LoadingImg from '../../../../../../images/loadingIcons/loading2.gif';
import BreadCrumb from '../../../Components/BreadCrumb';
import { Switch, Route, Link } from 'react-router-dom';
import { convertCurrency } from '../../../../../../utils/currency';
import moment from 'moment';
import { convertTZ } from './../../../../../../utils/date';
import Modal from '../../../../../UI/Modal/Modal';
import JSAlert from 'js-alert';
import $ from 'jquery';

import ReactTooltip from 'react-tooltip';

const UI = ({ AccessDefined, AccessControls, Cashier, Admin, Relations, history, GetLocations, GetCompanies, confirmClearRequest, validateEmployee, confirmApproveRequest, confirmRejectRequest, loadCashiers, loadDetails, loadList, onSubmit }) => {
    return (
        <div className='shipping_line_payment page'>
            <Switch>
                <Route exact path="/cash/shipping/line/form" render={ 
                    () => (
                        <Form 
                            history={ history }
                            Relations={ Relations }

                            onSubmit={ onSubmit }
                            GetLocations={ GetLocations }
                            GetCompanies={ GetCompanies }
                        />
                    )
                } />
                <Route exact path="/cash/shipping/line/list" render={ 
                    () => (
                        <List 
                            history={ history }
                            Admin={ Admin }
                            Cashier={ Cashier }
                            AccessDefined={ AccessDefined }
                            AccessControls={ AccessControls }

                            loadList={ loadList }
                        />
                    )
                } />
                <Route exact path="/cash/shipping/line/details/:id" render={ 
                    () => (
                        <Details 
                            history={ history }
                            AccessControls={ AccessControls }

                            confirmClearRequest={ confirmClearRequest }
                            validateEmployee={ validateEmployee }
                            confirmApproveRequest={ confirmApproveRequest }
                            loadCashiers={ loadCashiers }
                            confirmRejectRequest={ confirmRejectRequest }
                            loadDetails={ loadDetails }
                        />
                    )
                } />
            </Switch>
        </div>
    )
}

export default UI;

const Details = ({ AccessControls, history, confirmClearRequest, confirmApproveRequest, loadCashiers, validateEmployee, confirmRejectRequest, loadDetails }) => {
    
    const key = 'real secret keys should be long and random';
    const encryptor = require('simple-encryptor')(key);

    const [ CashierPassCode, setCashierPassCode ] = useState('');
    const [ RequestDetails, setRequestDetails ] = useState();
    const [ ApprReject, setApprReject ] = useState(false);
    const [ ClearPayment, setClearPayment ] = useState(false);
    const [ BillsView, setBillsView ] = useState(false);
    const [ ApprRejectContent, setApprRejectContent ] = useState(<></>);
    const [ Cashiers, setCashiers ] = useState([]);
    const [ Bills, setBills ] = useState([]);
    const [ AttachedBills, setAttachedBills ] = useState([]);
    useEffect(
        () => {
            loadDetails(setRequestDetails, setAttachedBills);
        }, []
    );
    useEffect(
        () => {
            if (Cashiers.length === 0) {
                loadCashiers( setCashiers );
            }
        }, []
    );
    useEffect(
        () => {
            if (CashierPassCode === encryptor.decrypt(AccessControls.emp_password)) {
                setApprRejectContent(
                    <form onSubmit={ (e) => confirmClearRequest( e, Bills, RequestDetails.received_by, RequestDetails.requested_by, RequestDetails.amount, history ) }>
                        <fieldset>
                            <h6><b>Do you want to clear amount Rs {RequestDetails.amount.toLocaleString('en')}/- of this request?</b></h6>
                            <hr />
                            <label className='mb-0'><b>Amount Consumed</b></label>
                            <input type='number' name="amount_consumed" className='form-control mb-2' required min={1} />
                            <button className='btn submit d-block ml-auto'>Confirm</button>
                        </fieldset>
                    </form>
                )
            }
        }, [CashierPassCode]
    );

    const rejectRequest = () => {
        setApprRejectContent(
            <form onSubmit={ (e) => confirmRejectRequest( e, RequestDetails.amount, RequestDetails.requested_by, history ) }>
                <fieldset>
                    <h6><b>Do you want to reject this request?</b></h6>
                    <textarea name="remarks" placeholder='Remarks Required...' className='form-control mb-2' rows={3} required minLength={20} />
                    <button className='btn cancle d-block ml-auto'>Confirm</button>
                </fieldset>
            </form>
        )
        setApprReject(true);
    }
    const approveRequest = () => {
        setApprRejectContent(
            <form onSubmit={ (e) => confirmApproveRequest( e, RequestDetails.requested_by, RequestDetails.amount, history ) }>
                <fieldset>
                    <h6><b>Do you want to approve this request?</b></h6>
                    <textarea name="remarks" placeholder='Remarks Required...' className='form-control mb-2' rows={3} required minLength={20} />
                    <input disabled required className='d-none' value={JSON.stringify(Cashiers.filter(val => val.location_code === RequestDetails.location))} name="cashiers" />
                    <button className='btn submit d-block ml-auto'>Confirm</button>
                </fieldset>
            </form>
        )
        setApprReject(true);
    }
    const releasePayment = () => {
        setApprRejectContent(<ModalFingerPrint history={ history } AccessControls={ AccessControls } Details={ RequestDetails } validateEmployee={ validateEmployee } />);
        setApprReject(true);
    }
    const onUploadBills = ( event ) => {
        const reader = new FileReader();
        reader.onload = () => {
            if( reader.readyState === 2 )
            {
                let arr = [];
                for ( let x = 0; x < event.target.files.length; x++ )
                {
                    arr.push({file: event.target.files[x], name: event.target.files[x].name, extension: event.target.files[x].type});
                }
                setBills(arr);
            }
        }
        if ( event.target.files[0] ) {
            reader.readAsDataURL( event.target.files[0] );
        }
    }
    const clearAmount = () => {
        setApprRejectContent(
            <form onSubmit={ (e) => confirmClearRequest( e, Bills, RequestDetails.received_by, RequestDetails.requested_by, RequestDetails.amount, history ) }>
                <fieldset>
                    <h6><b>Do you want to clear amount Rs {RequestDetails.amount.toLocaleString('en')}/- of this request?</b></h6>
                    <hr />
                    <label className='mb-0'><b>Cashier's Password</b></label>
                    <input type='password' onChange={ (e) => setCashierPassCode(e.target.value) } className='form-control mb-2' required />
                </fieldset>
            </form>
        )
        setApprReject(true);
    }

    return (
        <>
            <Modal show={ApprReject} Hide={() => setApprReject(!ApprReject)} content={ApprRejectContent} />
            <BreadCrumb links={[{label: 'Line Payments', href: '/cash/shipping/line/list'}]} currentLabel="Shipping Line Payment Details" />
            {
                BillsView
                ?
                <div className='page-content'>
                    <div className="d-flex align-items-center justify-content-between">
                        <h3 className="heading">
                            Shipping Line Payment Bills
                            <sub>view bills and the payment</sub>
                        </h3>

                        <button className='btn light' onClick={ () => setBillsView(false) }>Back</button>
                    </div>
                    <hr />
                    {
                        AttachedBills.length === 0
                        ?
                        <h6 className='text-center' style={{ textDecoration: 'underline' }}><b><u>No Bill Attached</u></b></h6>
                        :
                        <div className='bill-grid'>
                            {
                                AttachedBills.map(
                                    ( {bill}, index ) => {
                                        return <img key={index} src={process.env.REACT_APP_SERVER + '/' + bill} alt="" width="100%" />
                                    }
                                )
                            }
                        </div>
                    }
                </div>
                :
                ClearPayment
                ?
                <div className='page-content'>
                    <div className="d-flex align-items-center justify-content-between">
                        <h3 className="heading">
                            Clear Shipping Line Payment
                            <sub>upload bills and clear the payment</sub>
                        </h3>

                        <div>
                            <button className='btn light' onClick={ () => setClearPayment(false) }>Back</button>
                            {
                                Bills.length > 0
                                ?
                                <>
                                    <button className='btn green ml-2' onClick={ () => $("#uploadBillsInput").trigger('click') }>Uploaded ({Bills.length})</button>
                                    <button className='btn submit ml-2' onClick={ clearAmount }>Clear Amount Rs {RequestDetails.amount.toLocaleString("en")}/-</button>
                                </>
                                :
                                <button className='btn green ml-2' onClick={ () => $("#uploadBillsInput").trigger('click') }>Upload</button>
                            }
                            <input type='file' className='d-none' id="uploadBillsInput" onChange={onUploadBills} multiple />
                        </div>
                    </div>
                    <hr />
                    {
                        Bills.length === 0
                        ?
                        <h6 className='text-center' style={{ textDecoration: 'underline' }}><b><u>No Bill Uploaded</u></b></h6>
                        :
                        <div className='bill-grid'>
                            {
                                Bills.map(
                                    ( {file}, index ) => {
                                        return <img key={index} src={URL.createObjectURL(file)} alt="" width="100%" />
                                    }
                                )
                            }
                        </div>
                    }
                </div>
                :
                <div className='page-content'>
                    <div className="d-flex align-items-center justify-content-between">
                        <h3 className="heading">
                            Shipping Line Payment
                            <sub>detail of shipping line payments</sub>
                        </h3>

                        <div>
                            <button className='btn light' onClick={ () => history.goBack() }>Back</button>
                            {
                                RequestDetails?.amount_consumed
                                ?
                                <button className='btn submit ml-2' onClick={ () => setBillsView(true) }>Attached Bills <sup>{AttachedBills.length}</sup></button>
                                :null
                            }
                        </div>
                    </div>
                    <hr />
                    <div className='p-relative'>
                        {
                            !RequestDetails
                            ?
                            <div className='py-3'>
                                <div className='loading-screen popUps'>
                                    <img src={LoadingImg} width="50px" height="50px" alt="loading" />
                                </div>
                            </div>
                            :
                            <>
                                <table className='table table-borderless table-sm'>
                                    <tbody>
                                        <tr>
                                            <td className='text-center font-italic'>
                                                <h1 className='mb-0 bg-light pt-3 border-top border-right border-left px-3'>
                                                    <small className='text-success' style={{fontSize: 16}}>Rs</small><span className='font-weight-bold' style={{ fontFamily: 'Roboto' }}>{RequestDetails.amount.toLocaleString('en')}</span>/-
                                                </h1>
                                                <h6 className='text-capitalize bg-light pb-3 border-bottom border-right border-left px-3'>{RequestDetails.amount_in_words} Rupees Only</h6>
                                            </td>
                                            <td>
                                                <h6 className='font-weight-bold'>Requested By</h6>
                                                <p className='mb-0 font-weight-bold'>
                                                    <Link to={'/hr/employee/details/' + RequestDetails.emp_id} className='clickable'>{RequestDetails.requested_emp_name}</Link>
                                                </p>
                                                <p>{RequestDetails.designation_name}</p>
                                                <h6 className='font-weight-bold'>Collected By</h6>
                                                <p>
                                                    {
                                                        RequestDetails.received_date
                                                        ?
                                                        <span className='text-success'><u><Link to={'/hr/employee/details/' + RequestDetails.received_by} className='clickable'>{RequestDetails.received_emp_name}</Link></u></span>
                                                        :
                                                        <span className='text-danger'>Cash Not Collected</span>
                                                    }<br />
                                                    {RequestDetails.receival_date ? <><b>Collection Date: </b> {convertTZ(RequestDetails.receival_date).toDateString()} at {moment(RequestDetails.receival_time, 'h:mm:ss a').format('hh:mm A')}</> : null}
                                                </p>
                                            </td>
                                            <>
                                                {
                                                    RequestDetails.status === 'waiting for approval'
                                                    ?
                                                    <td>
                                                        <h6 className='font-weight-bold'>Requested To</h6>
                                                        <b>
                                                            <Link to={'/hr/employee/details/' + RequestDetails.approved_by} className='clickable'>
                                                                {RequestDetails.appr_emp_name}
                                                            </Link>
                                                        </b><br />
                                                        {RequestDetails.approved_date ? <span>{convertTZ(RequestDetails.approved_date).toDateString() + " at " + moment(RequestDetails.approved_time, 'h:mm:ss a').format('hh:mm A')}</span> : null}
                                                        {RequestDetails.approved_date ? <h6 className='font-weight-bold mt-2'>Remarks</h6> : null}
                                                        {RequestDetails.approved_date ? <p>{RequestDetails.remarks}</p> : null}
                                                    </td>
                                                    :
                                                    RequestDetails.status === 'cancelled' || RequestDetails.status === 'rejected'
                                                    ?
                                                    <td>
                                                        <h6 className='font-weight-bold'>Rejected By</h6>
                                                        <b>
                                                            <Link to={'/hr/employee/details/' + RequestDetails.approved_by} className='clickable'>
                                                                {RequestDetails.appr_emp_name}
                                                            </Link>
                                                        </b><br />
                                                        {RequestDetails.approved_date ? <span>{convertTZ(RequestDetails.approved_date).toDateString() + " at " + moment(RequestDetails.approved_time, 'h:mm:ss a').format('hh:mm A')}</span> : null}
                                                        {RequestDetails.approved_date ? <h6 className='font-weight-bold mt-2'>Remarks</h6> : null}
                                                        {RequestDetails.approved_date ? <p>{RequestDetails.remarks}</p> : null}
                                                    </td>
                                                    :
                                                    RequestDetails.remarks
                                                    ?
                                                    <td>
                                                        <h6 className='font-weight-bold'>Approved By</h6>
                                                        <b>
                                                            <Link to={'/hr/employee/details/' + RequestDetails.approved_by} className='clickable'>
                                                                {RequestDetails.appr_emp_name}
                                                            </Link>
                                                        </b><br />
                                                        {RequestDetails.approved_date ? <span>{convertTZ(RequestDetails.approved_date).toDateString() + " at " + moment(RequestDetails.approved_time, 'h:mm:ss a').format('hh:mm A')}</span> : null}
                                                        {RequestDetails.approved_date ? <h6 className='font-weight-bold mt-2'>Remarks</h6> : null}
                                                        {RequestDetails.approved_date ? <p>{RequestDetails.remarks}</p> : null}
                                                    </td>
                                                    : null
                                                }
                                            </>
                                            <td>
                                                <h6 className='font-weight-bold'>Request Status</h6>
                                                <div className='d-flex align-items-center'>
                                                    <div
                                                        className={
                                                            "dot mr-1 "
                                                            +
                                                            (
                                                                RequestDetails.status === 'approved' || RequestDetails.status === 'cleared'
                                                                    ?
                                                                    "bg-success"
                                                                    :
                                                                    RequestDetails.status === 'rejected'
                                                                        ?
                                                                        "bg-danger"
                                                                        :
                                                                        RequestDetails.status === 'waiting for approval'
                                                                            ?
                                                                            "bg-warning"
                                                                            :
                                                                            RequestDetails.status === 'issued'
                                                                                ?
                                                                                "bg-info"
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
                                                                RequestDetails.status === 'approved' || RequestDetails.status === 'cleared'
                                                                    ?
                                                                    "text-success"
                                                                    :
                                                                    RequestDetails.status === 'rejected'
                                                                        ?
                                                                        "text-danger"
                                                                        :
                                                                        RequestDetails.status === 'waiting for approval'
                                                                            ?
                                                                            "text-warning"
                                                                            :
                                                                            RequestDetails.status === 'issued'
                                                                                ?
                                                                                "text-info"
                                                                                :
                                                                                "text-dark"
                                                            )
                                                        }
                                                    >{RequestDetails.status}</div>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            {
                                                RequestDetails.clearance_date
                                                ?
                                                <td>
                                                    <h6 className='font-weight-bold mb-0'>Amount Consumed</h6>
                                                    <p className='mb-1'>{RequestDetails.amount_consumed ? ("PKR " + RequestDetails.amount_consumed.toLocaleString('en')) : <span className='text-warning'>Amount Not Cleared</span>}</p>
                                                    <b>Clearance Date & Time</b><br />
                                                    {RequestDetails.clearance_date ? <>{convertTZ(RequestDetails.clearance_date).toDateString()} at {moment(RequestDetails.clearance_time, 'h:mm:ss a').format('hh:mm A')}</> : null}
                                                </td>
                                                :
                                                <td></td>
                                            }
                                            <td colSpan={2}>
                                                <h6 className='font-weight-bold'>Additional Notes</h6>
                                                <pre style={{ fontFamily: 'Poppins', fontSize: '13px', width: '100%', whiteSpace: 'pre-wrap' }}>{RequestDetails.additional_notes ? RequestDetails.additional_notes : "No Additional Notes"}</pre>
                                            </td>
                                            <td>
                                                {
                                                    RequestDetails.cashier
                                                    ?
                                                    <>
                                                        <h6 className='font-weight-bold mt-4'>Cashier</h6>
                                                        <p className='mb-0'>
                                                            <Link to={'/hr/employee/details/' + RequestDetails.cashier} className='clickable'>{RequestDetails.cashier_emp_name}</Link>
                                                        </p>
                                                    </>
                                                    :null
                                                }
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <div className='footer-grid'>
                                    <div>
                                        {
                                            RequestDetails.received_date
                                            ?
                                            <>
                                                <h6 className='font-weight-bold'>Employee Thumb</h6>
                                                <img src={process.env.REACT_APP_SERVER + '/assets/portal/assets/SLP/' + window.location.href.split('/').pop() + '/thumbs/employee.bmp'} alt="" className='rounded border' width="25%" />
                                            </>
                                            : null
                                        }
                                    </div>
                                    <div>
                                        {
                                            RequestDetails.other === 1
                                                ?
                                                <>
                                                    <h6 className='font-weight-bold'>Cash Receiver CNIC</h6>
                                                    <div className='d-flex w-100' style={{ gap: '10px' }}>
                                                        <div className='w-50'>
                                                            <img src={process.env.REACT_APP_SERVER + '/assets/portal/assets/AC/' + window.location.href.split('/').pop() + '/' + RequestDetails.cnic_front} width="100%" className='rounded' alt="cashier finger print" />
                                                            {/* <p className='font-weight-bold text-center mb-0'>CNIC Front</p> */}
                                                        </div>
                                                        <div className='w-50'>
                                                            <img src={process.env.REACT_APP_SERVER + '/assets/portal/assets/AC/' + window.location.href.split('/').pop() + '/' + RequestDetails.cnic_back} width="100%" className='rounded' alt="employee finger print" />
                                                            {/* <p className='font-weight-bold text-center mb-0'>CNIC Back</p> */}
                                                        </div>
                                                    </div>
                                                </>
                                                : null
                                        }
                                    </div>
                                    <div className='text-right'>
                                        {
                                            RequestDetails.status === 'waiting for approval' && RequestDetails.approved_by == localStorage.getItem('EmpID')
                                            ?
                                            <>
                                                <button className='btn cancle mr-2' onClick={rejectRequest}>Reject</button>
                                                <button className='btn submit' onClick={approveRequest}>Approve</button>
                                            </>
                                            : null
                                        }
                                        {
                                            RequestDetails.status === 'approved' && AccessControls.location_code === RequestDetails.location && ( AccessControls.designation_code === 66 || AccessControls.designation_code === 97 )
                                            ? <button className='btn submit' onClick={() => releasePayment()}>Release Amount Rs {RequestDetails.amount.toLocaleString('en')}/-</button>
                                            : null
                                        }
                                        {
                                            RequestDetails.status === 'issued' && RequestDetails.cashier == localStorage.getItem('EmpID')
                                            ? <button className='btn submit' onClick={() => setClearPayment(true)}>Clear Amount Rs {RequestDetails.amount.toLocaleString('en')}/-</button>
                                            : null
                                        }
                                    </div>
                                </div>
                            </>
                        }
                    </div>
                </div>
            }
        </>
    )
}

const List = ({ AccessDefined, AccessControls, Cashier, Admin, history, loadList }) => {
    const [ ShowFilters, setShowFilters ] = useState(false);
    const [ Requests, setRequests ] = useState();
    const [ Amount, setAmount ] = useState(0);
    const [ Status, setStatus ] = useState('');
    const [ RequestStatuses, setRequestStatuses ] = useState([]);

    useEffect(
        () => {
            if ( AccessDefined )
            {
                loadList(Cashier, Admin, AccessControls.location_code, setRequests);
                if (sessionStorage.getItem('Shipping_LineStatus'))
                {
                    setStatus(sessionStorage.getItem('Shipping_LineStatus'));
                }
            }
        }, [ AccessDefined ]
    );
    useEffect(
        () => {
            if ( Requests && Requests.length > 0 )
            {
                let statuses = [];
                for ( let x = 0; x < Requests.length; x++ )
                {
                    if ( !statuses.includes(Requests[x].status) )
                    {
                        statuses.push(Requests[x].status.toLowerCase());
                    }
                }
                setRequestStatuses(statuses);
            }
        }, [ Requests ]
    );

    const resetFilters = () => {
        sessionStorage.removeItem('Shipping_Line_Amount');
        setAmount(0);
    }

    return (
        <>
            <div className='page-content'>
                <div className="d-flex align-items-center justify-content-between">
                    <h3 className="heading">
                        Shipping Line Payments
                        <sub>List of all shipping line payments</sub>
                    </h3>

                    <div>
                        <button className="btn submit px-2 filter-emit" onClick={ () => setShowFilters(!ShowFilters) } type='button'>
                        {
                                ShowFilters
                                    ?
                                    <>
                                        <i className="las la-times"></i>
                                    </>
                                    :
                                    <div data-tip data-for='filter'>
                                        {
                                            Amount !== 0
                                            ?
                                            <div className='filterisOpen'></div>
                                            :
                                            null
                                        }
                                        <i className="las la-filter"></i>
                                        <ReactTooltip id='filter' place="top">
                                            Filters
                                        </ReactTooltip>
                                    </div>
                            }
                        </button>
                        <button className='btn submit ml-2' onClick={ () => history.push('/cash/shipping/line/form') }>New</button>
                    </div>
                </div>
                <hr />
                <div className='p-relative'>
                    {
                        ShowFilters
                        ?
                        <>
                            <div className='filter-content popUps'>
                                    <div className='flex'>
                                        <div className='w-100'>
                                            <label className="font-weight-bold mb-0">Amount</label>
                                            <input placeholder='Amount Greater (>) Than' type="number" value={Amount} onChange={(e) => setAmount(e.target.value)} className='form-control form-control-sm mb-2' />
                                        </div>
                                        <button className='btn green d-block ml-auto mt-2' type='button' onClick={resetFilters}>Reset All</button>
                                    </div>
                            </div>
                            <br />
                        </>
                        :null
                    }
                    {
                        Requests
                        ?
                        <>
                            <ul className="nav nav-tabs mb-3">
                                <li className="nav-item" onClick={ () => { setStatus(''); sessionStorage.setItem('Shipping_LineStatus', '') } }>
                                    <a className={ Status === '' ? 'nav-link active text-capitalize' : 'nav-link text-capitalize' }>all { Status === '' ? `(${Requests.length})` : "" }</a>
                                </li>
                                {
                                    RequestStatuses.map(
                                        ( status, index ) => {
                                            return (
                                                <li className="nav-item" onClick={ () => { setStatus( status ); sessionStorage.setItem('Shipping_LineStatus', status) } } key={ index }>
                                                    <a className={ Status === status ? 'nav-link active text-capitalize' : 'nav-link text-capitalize' }>
                                                        { status } { Status === status ? `(${Requests.length})` : "" }
                                                    </a>
                                                </li>
                                            )
                                        }
                                    )
                                }
                            </ul>
                            <div className='records-container' style={{ maxHeight: '70vh' }}>
                                {
                                    Requests.length === 0
                                    ?
                                    <h6 className='text-center'><b><u>No Record Found</u></b></h6>
                                    :
                                    <>
                                        <table className="table"> 
                                            <thead>
                                                <tr>
                                                    <th className='border-top-0'>Sr.No</th>
                                                    <th className='border-top-0'>Requested Employee</th>
                                                    <th className='border-top-0'>Purpose</th>
                                                    <th className='border-top-0'>Amount</th>
                                                    <th className='border-top-0'>Status</th>
                                                    <th className='border-top-0'>Collected</th>
                                                </tr>   
                                            </thead>
                                            <tbody>
                                                {
                                                    Requests.map(
                                                        ( val, index ) => {
                                                            const requested_date = val.requested_date ? convertTZ(val.requested_date).toDateString() : null;

                                                            return (
                                                                <tr key={index} className='pointer pointer-hover' onClick={ () => history.push('/cash/shipping/line/details/' + val.payment_id) }>
                                                                    <td>{index+1}</td>
                                                                    <td>
                                                                        <b>{ val.requested_emp_name }</b><br />
                                                                        {requested_date}{val.requested_time ? ( " at " + moment(val.requested_time,'h:mm:ss a').format('hh:mm A') ) : null}
                                                                    </td>
                                                                    <td>{val.purpose}</td>
                                                                    <td>Rs {val.amount.toLocaleString('en')}/-</td>
                                                                    <td>
                                                                        <div className='d-flex align-items-center'>
                                                                            <div 
                                                                                className={
                                                                                    "dot mr-1 "
                                                                                    +
                                                                                    (
                                                                                        val.status === 'approved' || val.status === 'cleared'
                                                                                        ?
                                                                                        "bg-success"
                                                                                        :
                                                                                        val.status === 'rejected'
                                                                                        ?
                                                                                        "bg-danger"
                                                                                        :
                                                                                        val.status === 'waiting for approval'
                                                                                        ?
                                                                                        "bg-warning"
                                                                                        :
                                                                                        val.status === 'issued'
                                                                                        ?
                                                                                        "bg-info"
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
                                                                                        val.status === 'approved' || val.status === 'cleared'
                                                                                        ?
                                                                                        "text-success"
                                                                                        :
                                                                                        val.status === 'rejected'
                                                                                        ?
                                                                                        "text-danger"
                                                                                        :
                                                                                        val.status === 'waiting for approval'
                                                                                        ?
                                                                                        "text-warning"
                                                                                        :
                                                                                        val.status === 'issued'
                                                                                        ?
                                                                                        "text-info"
                                                                                        :
                                                                                        "text-dark"
                                                                                    )
                                                                                }
                                                                            >{ val.status }</div>
                                                                        </div>
                                                                    </td>
                                                                    <td>
                                                                        {val.received_date ? <span className='text-success'>Cash Collected</span> : <span className='text-danger'>Cash Not Collected</span>}
                                                                    </td>
                                                                </tr>
                                                            );
                                                        }
                                                    )
                                                }
                                            </tbody>
                                        </table>
                                        {/* <div className='records-controls d-flex align-items-center justify-content-start'>
                                            <div>
                                                <select className='form-control' onChange={ updateEndValue }>
                                                    <option value={10}>10</option>
                                                    { Arr.length > 10 && <option value={15}>15</option> }
                                                    { Arr.length > 15 && <option value={20}>20</option> }
                                                    { Arr.length > 20 && <option value={25}>25</option> }
                                                </select>
                                            </div>
                                            <div></div>
                                        </div> */}
                                    </>
                                }
                            </div>
                        </>
                        :
                        <div className='py-3'>
                            <div className='loading-screen popUps'>
                                <img src={LoadingImg} width="50px" height="50px" alt="loading" />
                            </div>
                        </div>
                    }
                </div>
            </div>
        </>
    )
}

const Form = ({ Relations, history, GetLocations, GetCompanies, onSubmit }) => {

    const [ Loading, setLoading ] = useState(false);
    const [ Amount, setAmount ] = useState(1);
    const [ Companies, setCompanies ] = useState([]);
    const [ Locations, setLocations ] = useState([]);

    useEffect(
        () => {
            GetCompanies(setCompanies);
            GetLocations(setLocations);
        }, []
    )

    return (
        <>
            <BreadCrumb links={[{label: 'Line Payments', href: '/cash/shipping/line/list'}]} currentLabel="Shipping Line Payment Form" />
            <form onSubmit={ (e) => onSubmit( e, history, Amount, setLoading ) } className="shipping_line_payment_form page-content p-relative">
                {
                    Loading
                    ?
                    <div className='loading-screen popUps'>
                        <img src={LoadingImg} width="50px" height="50px" alt="loading" />
                    </div>
                    :null
                }
                <fieldset>
                    <div className="d-flex align-items-center justify-content-between">
                        <h3 className="heading">
                            Shipping Line Payment Form
                            <sub>Get Cash For Line Payment Instantly</sub>
                        </h3>
                    </div>
                    <hr />
                    <div className='grid mb-2'>
                        <div>
                            <label className='mb-0'>
                                <b>Line</b>
                            </label>
                            <input className="form-control" name="line" required />
                        </div>
                        <div>
                            <label className='mb-0'>
                                <b>Purpose</b>
                            </label>
                            <select className="form-control" name="purpose" required>
                                <option value=''>Select the option</option>
                                <option value='D/O'>D/O</option>
                                <option value='LOLO'>LOLO</option>
                                <option value='Detention'>Detention</option>
                                <option value='Damage & Dirty'>Damage & Dirty</option>
                                <option value='Other'>Other</option>
                            </select>
                        </div>
                        <div>
                            <label className='mb-0'>
                                <b>Company</b>
                            </label>
                            <select className="form-control" name="company_code" required>
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
                        <div>
                            <label className='mb-0'>
                                <b>Cash Collection At</b>
                            </label>
                            <select className="form-control" name="location_code" required>
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
                        <div>
                            <label className='mb-0'>
                                <b>Amount</b>
                            </label>
                            <input type='number' value={Amount} onChange={ (e) => setAmount(e.target.value) } min={1} className="form-control" name="amount" required />
                        </div>
                        <div>
                            <label className='mb-0'>
                                <b>Amount In Words</b>
                            </label>
                            <input className="form-control text-capitalize" name="amount_in_words" value={ convertCurrency(Amount) + " Rupees Only" } disabled required />
                        </div>
                    </div>
                    <label className='mb-0'>
                        <b>Additional Notes (optional)</b>
                    </label>
                    <textarea className="form-control mb-2" name="additional_notes" placeholder='If there is any additional notes needs to be in notice, kindly enter here....' rows={3} />
                    <label className='mb-0'>
                        <b>Submit To</b>
                    </label>
                    <select name="submit_to" className="form-control" required>
                        <option value=''>submit to</option>
                        {
                            Relations.map(
                                (val, index) => {
                                    return <option value={val.sr} key={index}> {val.name} </option>;
                                }
                            )
                        }
                    </select>

                    <button className='btn submit d-block ml-auto mt-3'>Submit</button>
                </fieldset>
            </form>
        </>
    )
}

const ModalFingerPrint = ({ history, AccessControls, Details, validateEmployee }) => {

    const [CashierPassCode, setCashierPassCode] = useState();
    const [Template, setTemplate] = useState();
    const [ValidCashier, setValidCashier] = useState(false);
    const key = 'real secret keys should be long and random';
    const encryptor = require('simple-encryptor')(key);
    const secugen_lic = "";
    const uri = "https://localhost:8443/SGIFPCapture";
    const xmlhttp = new XMLHttpRequest();
    let fpobject;

    useEffect(
        () => {
            if (CashierPassCode === encryptor.decrypt(AccessControls.emp_password)) {
                setValidCashier(true);
            }
        }, [CashierPassCode]
    );

    function CallSGIFPGetData(successCall, failCall) {
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                fpobject = JSON.parse(xmlhttp.responseText);
                successCall(fpobject);
            } else if (xmlhttp.status == 404) {
                failCall(xmlhttp.status)
            }
        }
        xmlhttp.onerror = function () {
            failCall(xmlhttp.status);
        }
        var params = "Timeout=10000";
        params += "&Quality=50";
        params += "&licstr=" + encodeURIComponent(secugen_lic);
        params += "&templateFormat=ISO";
        xmlhttp.open("POST", uri, true);
        xmlhttp.send(params);
    }
    function SuccessFunction(result) {
        if (result.ErrorCode == 0) {
            /* 	Display BMP data in image tag
                BMP data is in base 64 format 
            */
            if (result != null && result.BMPBase64.length > 0) {
                document.getElementById('FPImage').src = "data:image/bmp;base64," + result.BMPBase64;
            }
            setTemplate(result.BMPBase64);
        } else {
            alert("Fingerprint Capture Error Code:  " + result.ErrorCode + ".\nDescription:  " + (result.ErrorCode) + "."); // ErrorCodeToString
        }
    }
    function ErrorFunction(status) {
        alert("Check if SGIBIOSRV is running; status = " + status + ":");
    }
    const verifyEmployee = (e) => {
        e.preventDefault();
        if (Template) {
            validateEmployee(e, Template, Details.requested_by, Details.amount, history);
        } else {
            JSAlert.alert("Fingerprint is required!!!").dismissIn(1500 * 1);
        }
    }

    return (
        <>
            <div>
                <h5 className='mb-3'>Verification is required</h5>
                <hr />
                {
                    ValidCashier
                        ?
                        <form onSubmit={verifyEmployee}>
                            <fieldset>
                                <div className='text-center mb-3'>
                                    <img onClick={() => CallSGIFPGetData(SuccessFunction, ErrorFunction)} id="FPImage" src={"https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/Fingerprint_picture.svg/1413px-Fingerprint_picture.svg.png"} alt="fingerprints" />
                                </div>
                                <label className='mb-0'><b>Receiver's Employee ID</b></label>
                                <input type='number' name="emp_id" className='form-control mb-2' required />
                                <label className='mb-0'><b>Receiver's Password</b></label>
                                <input type='password' name="passcode" className='form-control' required />
                                <button className='btn submit d-block ml-auto mt-3' type='submit'>Release Cash</button>
                            </fieldset>
                        </form>
                        :
                        <>
                            <label className='mb-0 font-weight-bold'>Cashier's Password</label>
                            <input type='password' className='form-control' onChange={(e) => setCashierPassCode(e.target.value)} />
                        </>
                }
            </div>
        </>
    )
}