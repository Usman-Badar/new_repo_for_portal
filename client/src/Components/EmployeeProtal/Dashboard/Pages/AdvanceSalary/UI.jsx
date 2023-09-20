/* eslint-disable eqeqeq */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react';
import './Style.css';
import { Route, Switch, useHistory } from 'react-router-dom';
import { numberToWords } from "amount-to-words";
import { useSelector } from 'react-redux';
import moment from 'moment';
import JSAlert from 'js-alert';
import SignatureCanvas from 'react-signature-canvas';

import Modal from '../../../../UI/Modal/Modal';
import loading from '../../../../../images/loadingIcons/icons8-iphone-spinner.gif';

const UI = ({ ClearMoney, AccessControls, Money, Cashiers, Approve, Reject, Cancel, RequestDetails, Requests, AccessDefined, Amount, clearRequest, setMoney, setClearMoney, setReject, setApprove, rejectRequest, approveRequest, loadCashiers, onCreateAdvanceSalaryReq, fetchDetails, setCancel, cancelRequest, validateEmployee, loadRequests, setAmount }) => {

    const history = useHistory();

    return (
        <>
            <div className="advance_salary page">
                <div className="advance_salary_container page-content">
                    <Modal show={ Cancel } Hide={ () => setCancel(!Cancel) } content={ <ConfirmCancellation cancelRequest={ cancelRequest } /> } />
                    <Modal show={ Approve } Hide={ () => setApprove(!Approve) } content={ <ConfirmApproval approveRequest={ approveRequest } Cashiers={ Cashiers } loadCashiers={ loadCashiers } /> } />
                    <Modal show={ Reject } Hide={ () => setReject(!Reject) } content={ <ConfirmRejection rejectRequest={ rejectRequest } /> } />
                    <Modal show={ Money } Hide={ () => setMoney(!Money) } content={ <ModalSignature validateEmployee={ validateEmployee } AccessControls={ AccessControls } RequestDetails={ RequestDetails } /> } />
                    <Modal show={ ClearMoney } Hide={ () => setClearMoney(!ClearMoney) } content={ <ModalMoneyClearance clearRequest={ clearRequest } AccessControls={ AccessControls } RequestDetails={ RequestDetails } /> } />
                    <Switch>
                            <Route exact path="/cash/advance/salary" render={ 
                                    () => <RequestsList
                                        Requests={ Requests }
                                        AccessDefined={ AccessDefined }
                                        history={ history }

                                        loadRequests={ loadRequests }
                                    />
                                } 
                            />
                            <Route exact path="/cash/advance/salary/form" render={ 
                                    () => <Form
                                        history={ history }
                                        Amount={ Amount }

                                        setAmount={ setAmount }
                                        onCreateAdvanceSalaryReq={ onCreateAdvanceSalaryReq }
                                    />
                                } 
                            />
                            <Route exact path="/cash/advance/salary/request/:id" render={ 
                                    () => <Details
                                        history={ history }
                                        RequestDetails={ RequestDetails }
                                        setApprove={ setApprove }
                                        setReject={ setReject }
                                        setMoney={ setMoney }

                                        setClearMoney={ setClearMoney }
                                        setCancel={ setCancel }
                                        fetchDetails={ fetchDetails }
                                        onCreateAdvanceSalaryReq={ onCreateAdvanceSalaryReq }
                                    />
                                } 
                            />
                    </Switch>
                </div>
            </div>
        </>
    )
}

export default UI;

const ModalMoneyClearance = ({ AccessControls, RequestDetails, clearRequest }) => {
    
    const [ CashierPassCode, setCashierPassCode ] = useState();
    const [ ValidCashier, setValidCashier ] = useState(false);
    const key = 'real secret keys should be long and random';
    const encryptor = require('simple-encryptor')(key);

    useEffect(
        () => {
            if ( CashierPassCode === encryptor.decrypt( AccessControls.emp_password ) )
            {
                setValidCashier(true);
            }
        }, [ CashierPassCode ]
    )

    const clearAmount = ( e ) => {
        e.preventDefault();
        if ( ValidCashier )
        {
            clearRequest( e )
        }else
        {
            JSAlert.alert("Cashier Password Not Matched").dismissIn(1500 * 1);
        }
    }

    if ( !RequestDetails )
    {
        return <></>
    }

    return (
        <>
            <form onSubmit={ clearAmount }>
                <fieldset>
                    <h5>Validation Required</h5>
                    <hr />
                    <label className='mb-0'>{ RequestDetails.approved_emp_name } Pass Code</label>
                    <input type='password' required className='form-control mb-3' onChange={ (e) => setCashierPassCode(e.target.value) } />
                    <button className='btn submit d-block mx-auto mt-3'>Clear Amount</button>
                </fieldset>
            </form>
        </>
    )
}

const ModalSignature = ({ AccessControls, RequestDetails, validateEmployee }) => {

    const [ CashierPassCode, setCashierPassCode ] = useState();
    const [ signature, setSignature ] = useState(null);
    const [ ValidCashier, setValidCashier ] = useState(false);
    const key = 'real secret keys should be long and random';
    const encryptor = require('simple-encryptor')(key);
    const sigRef = useRef();

    useEffect(
        () => {
            if ( CashierPassCode === encryptor.decrypt( AccessControls.emp_password ) )
            {
                setValidCashier(true);
            }
        }, [ CashierPassCode ]
    );
    const verifyEmployee = ( e ) => {
        e.preventDefault();
        if ( signature )
        {
            validateEmployee(e, signature);
        }else
        {
            JSAlert.alert("Signature is required!!!").dismissIn(1500 * 1);
        }
    }
    const handleSignatureEnd = () => {
        setSignature(sigRef.current.toDataURL());
    }
    const clearSignature = () => {
        sigRef.current.clear();
        setSignature(null);
    }

    if ( !RequestDetails )
    {
        return <></>;
    }

    return (
        <>
            <div>
                <h5 className='mb-3'>Verification is required</h5>
                <hr />
                {
                    ValidCashier
                    ?
                    <form onSubmit={ verifyEmployee }>
                        <fieldset>
                            <label className='mb-0 font-weight-bold'>Receiving Person Password</label>
                            <input type='password' className='form-control' name="passcode" required />
                            <label className='mb-0 font-weight-bold'>Receiving Person Signature</label>
                            <SignatureCanvas penColor='blue' ref={sigRef} canvasProps={{className: 'sigCanvas'}} onEnd={handleSignatureEnd} />
                            <button type='button' className='btn d-block ml-auto light my-2' onClick={clearSignature}>Clear Signature</button>
                            <button className='btn submit d-block ml-auto mt-3' type='submit'>Release Cash</button>
                        </fieldset>
                    </form>
                    :
                    <>
                        <label className='mb-0 font-weight-bold'>{ RequestDetails.cashier_emp_name }'s' Password</label>
                        <input type='password' className='form-control' onChange={ (e) => setCashierPassCode(e.target.value) } />
                    </>
                }
            </div>
        </>
    )
}

const ConfirmApproval = ({ Cashiers, approveRequest, loadCashiers }) => {
    useEffect(
        () => {
            if ( Cashiers.length === 0 )
            {
                loadCashiers();
            }
        }, []
    )

    return (
        <>
            <form onSubmit={ approveRequest }>
                <h5>Confirmation</h5>
                <hr />
                <fieldset>
                    <label className="mb-0"><b>Remarks</b></label>
                    <textarea className="form-control" name="remarks" required />
                    <label className="mb-0"><b>Submit To</b></label>
                    <select name="submit_to" required className="form-control mb-2">
                        <option value="">Select option</option>
                        {
                            Cashiers.map(
                                (val, index) => {
                                    return <option value={val.emp_id} key={index}>{val.name}</option>;
                                }
                            )
                        }
                    </select>
                    <button className='btn submit d-block mx-auto mt-3'>Confirm</button>
                </fieldset>
            </form>
        </>
    )
}

const ConfirmRejection = ({ rejectRequest }) => {
    return (
        <>
            <form onSubmit={ rejectRequest }>
                <h5>Confirm Rejection</h5>
                <hr />
                <fieldset>
                    <label className="mb-0"><b>Remarks</b></label>
                    <textarea className="form-control" name="remarks" required />
                    <button className='btn submit d-block mx-auto mt-3'>Confirm</button>
                </fieldset>
            </form>
        </>
    )
}

const ConfirmCancellation = ({ cancelRequest }) => {
    return (
        <>
            <form onSubmit={ cancelRequest }>
                <h5>Confirm Cancellation</h5>
                <hr />
                <fieldset>
                    <label className="mb-0"><b>Reason</b></label>
                    <textarea className="form-control" name="reason" placeholder="Tell us why you're cancelling your request?" required />
                    <button className='btn submit d-block mx-auto mt-3'>Confirm</button>
                </fieldset>
            </form>
        </>
    )
}

const Form = ({ history, Amount, setAmount, onCreateAdvanceSalaryReq }) => {

    const Relations = useSelector((state) => state.EmpAuth.Relations);
    const [ Reason, setReason ] = useState('');

    return (
        <>
            <form onSubmit={ (e) => onCreateAdvanceSalaryReq( e, setReason ) }>
                <fieldset>
                    <div className="d-flex align-items-center justify-content-between">
                        <h3 className="heading">
                            Advance Salary Form
                            <sub>Get Your Salary In Advance</sub>
                        </h3>
                        <button className='btn light' onClick={ () => history.push('/cash/advance/salary') }>Back</button>
                    </div>
                    <hr />
                    <label className='mb-0'>
                        <b>Amount</b>
                    </label>
                    <input type='number' value={Amount} onChange={ (e) => setAmount(e.target.value) } min={1} className="form-control mb-2" required />
                    <label className='mb-0'>
                        <b>Amount In Words (PKR)</b>
                    </label>
                    <input className="form-control mb-2" value={ Amount > 0 ? ( numberToWords(Amount) + " Rupees Only" ) : '' } disabled />
                    <label className='mb-0'>
                        <b>Reason</b>
                    </label>
                    <textarea placeholder='Enter a valid reason in detail' onChange={ (e) => setReason(e.target.value) } className="form-control mb-0" name="reason" minLength={50} required />
                    <p><b>{Reason.length}</b> Characters <span className='text-danger'>(Minimum <b>50</b> Characters are required)</span></p>
                    <label className="mb-0"><b>Submit To</b></label>
                    <select className="form-control mb-3" name="request_to" required>
                        <option value="">Select the option</option>
                        {
                            Relations?
                            Relations.map(
                                (val, index) => {
                                    return <option value={val.sr} key={index}> {val.name} </option>;
                                }
                            ):null
                        }
                    </select>
                    <button className='btn submit d-block ml-auto' type='submit'>Submit</button>
                    <button className='btn submit d-none ml-auto' id="resetBtn" type='reset'>Reset</button>
                </fieldset>
            </form>
        </>
    )
}

const RequestsList = ({ Requests, AccessDefined, history, loadRequests }) => {

    const Arr = Requests.filter(val => {return val.requested_emp_name.toLowerCase().includes(''.toLowerCase())});

    useEffect(
        () => {
            if ( AccessDefined )
            {
                loadRequests();
            }
        }, [ AccessDefined ]
    )

    return (
        <>
            <div className="d-flex align-items-center justify-content-between">
                <h3 className="heading">
                    Advance Salary Requests
                    <sub>List Of Advance Salary Requests</sub>
                </h3>

                <div>
                    <button className='btn submit' onClick={ () => history.push('/cash/advance/salary/form') }>New</button>
                </div>
            </div>
            <hr />
            {
                Arr.length === 0
                ?
                <h6 className="text-center">No Record Found</h6>
                :
                <table className="table mt-3 requests">
                    <thead>
                        <tr>
                            <th>Sr.No</th>
                            <th>Requested To</th>
                            <th>Amount</th>
                            <th>Reason</th>
                            <th>Request Date/Time</th>
                            <th>Status</th>
                            <th>Cash Collected</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            Arr.map(
                                ( val, index ) => {
                                    return (
                                        <tr key={ index } className='pointer pointer-hover' onClick={ () => history.push('/cash/advance/salary/request/' + val.id) }>
                                            <td>{ index + 1 }</td>
                                            <td>{ val.approved_emp_name }</td>
                                            <td style={{ fontFamily: "Exo" }}><b>Rs { val.amount.toLocaleString('en') } /-</b></td>
                                            <td>{ val.reason }</td>
                                            <td>
                                                { moment(val.submitted_date).utc().format('MM-DD-YYYY') } at { moment(val.submitted_time,'h:mm:ss a').format('hh:mm A') }
                                            </td>
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
                                                                val.status === 'waiting for approval' || val.status === 'pending for verification'
                                                                ?
                                                                "bg-warning"
                                                                :
                                                                val.status === 'issued'
                                                                ?
                                                                "bg-primary"
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
                                                                val.status === 'waiting for approval' || val.status === 'pending for verification'
                                                                ?
                                                                "text-warning"
                                                                :
                                                                val.status === 'issued'
                                                                ?
                                                                "text-primary"
                                                                :
                                                                "text-dark"
                                                            )
                                                        }
                                                    >{ val.status }</div>
                                                </div>
                                            </td>
                                            <td>
                                                { val.receiving_date ? <span className='text-success'>Cash Collected</span> : <span className='text-danger'>Cash Not Collected</span> }
                                            </td>
                                        </tr>
                                    );
                                }
                            )
                        }
                    </tbody>
                </table>
            }
        </>
    )
}

const Details = ({ history, RequestDetails, setCancel, setClearMoney, setMoney, setApprove, setReject, fetchDetails }) => {

    let dueSinsStart;
    let dueSinsEnd;

    useEffect(
        () => {
            fetchDetails(window.location.href.split('/').pop());
        }, []
    )

    if ( !RequestDetails )
    {
        return <img src={loading} alt="loading..." width='50' height='50' className='d-block mx-auto' />;
    }

    dueSinsStart = moment(RequestDetails.receiving_date, "YYYY-MM-DD");
    dueSinsEnd = RequestDetails.clearance_date ? moment(RequestDetails.clearance_date, "YYYY-MM-DD") : moment().startOf('day');

    return (
        <>
            <div className="d-flex align-items-center justify-content-between">
                <h3 className="heading">
                    Advance Salary Request Details
                    <sub>Details Of The Advance Salary Request</sub>
                </h3>
                <div>
                    <button className='btn light' onClick={ () => history.replace('/cash/advance/salary') }>Back</button>
                    {/* <button className='btn submit ml-2' onClick={ print }>Print</button> */}
                    {
                        RequestDetails.status === 'waiting for approval' && RequestDetails.submitted_by == localStorage.getItem('EmpID')
                        ?
                        <button className='btn cancle ml-2' onClick={ () => setCancel(true) }>Cancel</button>
                        :null
                    }
                </div>
            </div>
            <hr />
            <table className='table table-borderless'>
                <tbody>
                    <tr>
                        <td className='bg-light text-center'>
                            <h1 className='mb-0'>PKR <span className='font-weight-bold' style={{ fontFamily: "Exo" }}>{ RequestDetails.amount.toLocaleString('en') }</span></h1>
                            <h6 className='font-weight-bold'>{ RequestDetails.amount_in_words } Rupees Only</h6>
                        </td>
                        <td>
                            <h6 className='font-weight-bold'>Requested By</h6>
                            <p className='mb-1 font-weight-bold'>{ RequestDetails.requested_emp_name }</p>
                            <p>{ RequestDetails.designation_name }</p>
                            <h6 className='font-weight-bold'>Cash Collected</h6>
                            <p>
                                { 
                                    RequestDetails.receiving_date? <span>{ moment(RequestDetails.receiving_date).utc().format('MM-DD-YYYY') } at { moment(RequestDetails.receiving_time,'h:mm:ss a').format('hh:mm A') }</span> :<span className='text-danger'>Cash Not Collected</span>
                                }<br />
                            </p>
                        </td>
                        <td>
                            {
                                RequestDetails.approved_date
                                ?
                                RequestDetails.status === 'rejected'
                                ?
                                <h6 className='font-weight-bold'>Rejected By</h6>
                                :
                                RequestDetails.status === 'cancelled'
                                ?
                                <h6 className='font-weight-bold'>Cancelled By</h6>
                                :
                                <h6 className='font-weight-bold'>Approved By</h6>
                                :
                                <h6 className='font-weight-bold'>Requested To</h6>
                            }
                            <p className='mb-0'>{ RequestDetails.approved_emp_name ? RequestDetails.approved_emp_name : <span className='text-warning'>Pending For Approval</span> }</p>
                            { RequestDetails.approved_date ? <>{moment(RequestDetails.approved_date).utc().format('MM-DD-YYYY')} at {moment(RequestDetails.approved_time,'h:mm:ss a').format('hh:mm A')}</> : null}
                            { RequestDetails.approved_date ? <h6 className='font-weight-bold mt-2'>Remarks</h6> : null }
                            { RequestDetails.approved_date ? <p>{ RequestDetails.remarks }</p> : null }
                        </td>
                        <td>
                            <h6 className='font-weight-bold'>Company & Location</h6>
                            <p className='mb-1'>{ RequestDetails.company_name }</p>
                            <p>{ RequestDetails.location_name }</p>
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
                                            RequestDetails.status === 'waiting for approval' || RequestDetails.status === 'pending for verification'
                                            ?
                                            "bg-warning"
                                            :
                                            RequestDetails.status === 'issued'
                                            ?
                                            "bg-primary"
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
                                            RequestDetails.status === 'waiting for approval' || RequestDetails.status === 'pending for verification'
                                            ?
                                            "text-warning"
                                            :
                                            RequestDetails.status === 'issued'
                                            ?
                                            "text-primary"
                                            :
                                            "text-dark"
                                        )
                                    }
                                >{ RequestDetails.status }</div>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        {
                            RequestDetails.remarks
                            ?
                            <td>
                                {
                                    RequestDetails.clearance_date ? 
                                    <>
                                        <b>Clearance Date & Time</b><br />
                                        {moment(RequestDetails.clearance_date).utc().format('MM-DD-YYYY')} at {moment(RequestDetails.clearance_time,'h:mm:ss a').format('hh:mm A')}
                                    </> 
                                    :null
                                }
                                {
                                    RequestDetails.status !== 'rejected' && RequestDetails.status !== 'cancelled'
                                    ?
                                    <>
                                        <h6 className='font-weight-bold mb-0 mt-2'>Due Since</h6>
                                        <span className='text-danger'>
                                            { 
                                                RequestDetails.clearance_date
                                                ?
                                                <span className='text-success'>Amount Has Been Cleared</span> 
                                                :
                                                RequestDetails.receiving_date ? 
                                                <><span className="font-weight-bold" style={{ fontFamily: "Exo" }}>{moment.duration(dueSinsEnd.diff(dueSinsStart)).asDays()}</span> { moment.duration(dueSinsEnd.diff(dueSinsStart)).asDays() === 1 ? "Day" : "Days" }</> 
                                                : "Cash Not Collected" 
                                            }
                                        </span>
                                    </>
                                    :null
                                }
                            </td>
                            :
                            <td></td>
                        }
                        <td colSpan={2}>
                            <h6 className='font-weight-bold'>Reason</h6>
                            <pre style={{ fontFamily: 'Poppins', fontSize: '13px' }}>{ RequestDetails.reason }</pre>
                        </td>
                        {/* {
                            RequestDetails.status === 'cancelled'
                            ?
                            <td>
                                <h6 className='font-weight-bold'>Cancelled By</h6>
                                <span>{ RequestDetails.appr_emp_name }</span><br />
                                <b>Date & Time</b><br />
                                <span>{ moment(Details.approved_date).utc().format('MM-DD-YYYY') + " at " + moment(Details.approved_time,'h:mm:ss a').format('hh:mm A') }</span>
                            </td>
                            :
                            RequestDetails.hod_remarks
                            ?
                            <td>
                                <h6 className='font-weight-bold'>Approved By</h6>
                                <span>{ RequestDetails.appr_emp_name }</span><br />
                                <b>Date & Time</b><br />
                                <span>{ moment(Details.approved_date).utc().format('MM-DD-YYYY') + " at " + moment(Details.approved_time,'h:mm:ss a').format('hh:mm A') }</span>
                            </td>
                            :null
                        } */}
                    </tr>
                </tbody>
            </table>
            <div className='grid'>
                <div>
                    {
                        RequestDetails.receiving_date
                        ?
                        <>
                            <h6 className='font-weight-bold'>Signature</h6>
                            <img src={ process.env.REACT_APP_SERVER + '/assets/portal/assets/AS/' + window.location.href.split('/').pop() + '/' + RequestDetails.emp_signatures } alt="" width="100%" />
                        </>
                        :null
                    }
                </div>
                <div></div>
                <div className='text-center'>
                    {
                        RequestDetails.status === 'waiting for approval' && RequestDetails.approved_by == localStorage.getItem('EmpID')
                        ?
                        <>
                            <button className='btn cancle mr-3' onClick={ () => setReject(true) }>Reject</button>
                            <button className='btn submit' onClick={ () => setApprove(true) }>Approve</button>
                        </>
                        :null
                    }
                    {
                        RequestDetails.status === 'approved' && RequestDetails.cashier == localStorage.getItem('EmpID')
                        ?<button className='btn submit' onClick={ () => setMoney(true) }>Release Amount (Rs.{ RequestDetails.amount.toLocaleString('en') }/-)</button>
                        :null
                    }
                    
                    {
                        RequestDetails.status === 'issued' && RequestDetails.approved_by == localStorage.getItem('EmpID')
                        ?<button className='btn submit' onClick={ () => setClearMoney(true) }>Clear Amount (PKR { RequestDetails.amount.toLocaleString('en') })</button>
                        :null
                    }
                </div>
            </div>
        </>
    )
}