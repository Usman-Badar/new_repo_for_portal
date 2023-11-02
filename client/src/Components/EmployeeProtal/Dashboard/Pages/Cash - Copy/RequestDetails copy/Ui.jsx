/* eslint-disable no-loop-func */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import React, { useEffect, useRef, useState } from 'react';
import './Style.css';

import { useReactToPrint } from 'react-to-print';
import JSAlert from 'js-alert';
import Modal from '../../../../../UI/Modal/Modal';
import moment from 'moment';
import loading from '../../../../../../images/loadingIcons/icons8-iphone-spinner.gif';
import { useSelector } from 'react-redux';

function UI({ VApprove, VReject, Cancel, AttachedCNIC, Other, ClearMoney, history, AccessControls, CashierThumbs, Money, Reject, Cashiers, Approve, Details, clearRequest, setCancel, rejectVRequest, verifyRequest, cancelRequest, setVApprove, setVReject, setClearMoney, validateEmployee, onAttachCNIC, approveRequest, setOther, rejectRequest, setMoney, loadThumbs, loadCashiers, setReject, setApprove }) {
    
    const [ StartPrint, setStartPrint ] = useState(false);
    const Relations = useSelector((state) => state.EmpAuth.Relations);
    const componentRef = useRef();
    let dueSinsStart;
    let dueSinsEnd;
    const handlePrint = useReactToPrint(
        {
            pageStyle: `@media print {
                @page {
                    size: ${8.6}in ${6.5}in;
                    margin: 0;
                    top: 0,
                    left: 0;
                }
            }`,
            content: () => componentRef.current,
            copyStyles: true,
            onAfterPrint: () => setStartPrint(false)
        }
    );

    const print = () => {
        setStartPrint(true);
        setTimeout(() => {
            handlePrint();
        }, 200);
    }

    if ( Details )
    {
        dueSinsStart = moment(Details.receival_date, "YYYY-MM-DD");
        dueSinsEnd = moment().startOf('day');
    }

    return (
        <>
            <div className="advance_cash_details page">
                <div className="advance_cash_details_container page-content">
                    {
                        Details
                        ?
                        <>
                            <Modal show={ VApprove } Hide={ () => setVApprove(!VApprove) } content={ <ConfirmVApproval Details={ Details } Relations={ Relations } verifyRequest={ verifyRequest } /> } />
                            <Modal show={ VReject } Hide={ () => setVReject(!VReject) } content={ <ConfirmVRejection rejectVRequest={ rejectVRequest } /> } />
                            <Modal show={ Approve } Hide={ () => setApprove(!Approve) } content={ <ConfirmApproval approveRequest={ approveRequest } Cashiers={ Cashiers } loadCashiers={ loadCashiers } /> } />
                            <Modal show={ Reject } Hide={ () => setReject(!Reject) } content={ <ConfirmRejection rejectRequest={ rejectRequest } /> } />
                            <Modal show={ Cancel } Hide={ () => setCancel(!Cancel) } content={ <ConfirmCancellation cancelRequest={ cancelRequest } /> } />
                            <Modal show={ Money } Hide={ () => setMoney(!Money) } content={ <ModalFingerPrint AttachedCNIC={ AttachedCNIC } onAttachCNIC={ onAttachCNIC } Other={ Other } setOther={ setOther } validateEmployee={ validateEmployee } AccessControls={ AccessControls } CashierThumbs={ CashierThumbs } loadThumbs={ loadThumbs } Details={ Details } /> } />
                            <Modal show={ ClearMoney } Hide={ () => setClearMoney(!ClearMoney) } content={ <ModalMoneyClearance clearRequest={ clearRequest } AccessControls={ AccessControls } Details={ Details } /> } />
                            <div className="d-flex align-items-center justify-content-between">
                                <h3 className="heading">
                                    Advance Cash Details
                                    <sub>Details Of The Cash Request</sub>
                                </h3>
                                <div>
                                    <button className='btn light' onClick={ () => history.replace('/cash/requests') }>Back</button>
                                    <button className='btn submit ml-2' onClick={ print }>Print</button>
                                    {
                                        Details.status === 'waiting for approval' && Details.recorded_by == localStorage.getItem('EmpID')
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
                                            <h1 className='mb-0'>PKR <span className='font-weight-bold' style={{ fontFamily: "Exo" }}>{ Details.amount.toLocaleString('en') }</span></h1>
                                            <h6 className='font-weight-bold'>{ Details.amount_in_words } Rupees Only</h6>
                                        </td>
                                        <td>
                                            <h6 className='font-weight-bold'>Requested By</h6>
                                            <p className='mb-1 font-weight-bold'>{ Details.requested_emp_name }</p>
                                            <p>{ Details.designation_name }</p>
                                            <h6 className='font-weight-bold'>Collected By</h6>
                                            <p>
                                                { 
                                                    Details.received_person_name
                                                    ? 
                                                    <>
                                                        <b>Name: </b>{Details.received_person_name}<br />
                                                        <b>Contact: </b> {Details.received_person_contact}
                                                    </> 
                                                    : 
                                                    Details.receival_date 
                                                    ? 
                                                    <span className='text-success'>Cash Collected By Employee</span> 
                                                    :
                                                    <span className='text-danger'>Cash Not Collected</span>
                                                }<br />
                                                {Details.receival_date ? <>{new Date(Details.receival_date).toDateString()} at {moment(Details.receival_time,'h:mm:ss a').format('hh:mm A')}</> : null}
                                            </p>
                                        </td>
                                        <td>
                                            <h6 className='font-weight-bold'>Verified By</h6>
                                            <p>{ Details.record_emp_name ? Details.record_emp_name : <span className='text-warning'>Pending For Verification</span> }</p>
                                            <h6 className='font-weight-bold'>Verification Date & Time</h6>
                                            { Details.verified_date ? <>{new Date(Details.verified_date).toDateString()} at {moment(Details.verified_time,'h:mm:ss a').format('hh:mm A')}</> : <span className='text-warning'>Pending For Verification</span>}
                                        </td>
                                        <td>
                                            <h6 className='font-weight-bold'>Company & Location</h6>
                                            <p className='mb-1'>{ Details.company_name }</p>
                                            <p>{ Details.location_name }</p>
                                            <h6 className='font-weight-bold'>Request Status</h6>
                                            <div className='d-flex align-items-center'>
                                                <div 
                                                    className={
                                                        "dot mr-1 "
                                                        +
                                                        (
                                                            Details.status === 'approved' || Details.status === 'cleared'
                                                            ?
                                                            "bg-success"
                                                            :
                                                            Details.status === 'rejected'
                                                            ?
                                                            "bg-danger"
                                                            :
                                                            Details.status === 'waiting for approval' || Details.status === 'pending for verification'
                                                            ?
                                                            "bg-warning"
                                                            :
                                                            Details.status === 'issued'
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
                                                            Details.status === 'approved' || Details.status === 'cleared'
                                                            ?
                                                            "text-success"
                                                            :
                                                            Details.status === 'rejected'
                                                            ?
                                                            "text-danger"
                                                            :
                                                            Details.status === 'waiting for approval' || Details.status === 'pending for verification'
                                                            ?
                                                            "text-warning"
                                                            :
                                                            Details.status === 'issued'
                                                            ?
                                                            "text-primary"
                                                            :
                                                            "text-dark"
                                                        )
                                                    }
                                                >{ Details.status }</div>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        {
                                            Details.hod_remarks
                                            ?
                                            <td>
                                                <h6 className='font-weight-bold mb-0'>Amount Consumed</h6>
                                                <p className='mb-1'>{ Details.after_amount ? ( "PKR " + Details.after_amount.toLocaleString('en') ) : <span className='text-warning'>Amount Not Cleared</span> }</p>
                                                {Details.clearance_date ? <>{new Date(Details.clearance_date).toDateString()} at {moment(Details.clearance_time,'h:mm:ss a').format('hh:mm A')}</> : null}
                                                <h6 className='font-weight-bold mb-0'>Due Since</h6>
                                                <span className='text-danger'>{ Details.receival_date ? <><span className="font-weight-bold" style={{ fontFamily: "Exo" }}>{moment.duration(dueSinsEnd.diff(dueSinsStart)).asDays()}</span> { moment.duration(dueSinsEnd.diff(dueSinsStart)).asDays() === 1 ? "Day" : "Days" }</> : "Amount Not Collected" }</span>
                                            </td>
                                            :
                                            <td></td>
                                        }
                                        <td colSpan={2}>
                                            <h6 className='font-weight-bold'>Reason</h6>
                                            <pre style={{ fontFamily: 'Poppins', fontSize: '13px' }}>{ Details.reason }</pre>
                                        </td>
                                        {
                                            Details.status === 'cancelled'
                                            ?
                                            <td>
                                                <h6 className='font-weight-bold'>Cancelled By</h6>
                                                <span>{ Details.appr_emp_name }</span><br />
                                                <b>Date & Time</b><br />
                                                <span>{ new Date(Details.approved_date).toDateString() + " at " + moment(Details.approved_time,'h:mm:ss a').format('hh:mm A') }</span>
                                            </td>
                                            :
                                            Details.hod_remarks
                                            ?
                                            <td>
                                                <h6 className='font-weight-bold'>Approved By</h6>
                                                <span>{ Details.appr_emp_name }</span><br />
                                                <b>Date & Time</b><br />
                                                <span>{ new Date(Details.approved_date).toDateString() + " at " + moment(Details.approved_time,'h:mm:ss a').format('hh:mm A') }</span>
                                            </td>
                                            :null
                                        }
                                    </tr>
                                    {
                                        Details.hod_remarks
                                        ?
                                        <tr>
                                            <td>
                                                <h6 className='font-weight-bold'>Fingerprints</h6>
                                                <div className='d-flex w-100' style={{ gap: '10px' }}>
                                                    <div className='w-50'>
                                                        <img src={ process.env.REACT_APP_SERVER + '/assets/portal/assets/AC/' + window.location.href.split('/').pop() + '/thumbs/' + Details.cashier_finger_print } width="100%" className='rounded' alt="cashier finger print" />
                                                        <p className='font-weight-bold text-center mb-0'>Cashier Fingerprint</p>
                                                    </div>
                                                    <div className='w-50'>
                                                        <img src={ process.env.REACT_APP_SERVER + '/assets/portal/assets/AC/' + window.location.href.split('/').pop() + '/thumbs/' + Details.emp_finger_print } width="100%" className='rounded' alt="employee finger print" />
                                                        <p className='font-weight-bold text-center mb-0'>Employee Fingerprint</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td colSpan={2}>
                                                <h6 className='font-weight-bold'>
                                                    { Details.status === 'cancelled' ? "Reason" : "Final Remarks" }
                                                </h6>
                                                <pre style={{ fontFamily: 'Poppins' }}>{ Details.hod_remarks }</pre>
                                            </td>
                                        </tr>
                                        :null
                                    }
                                </tbody>
                            </table>
                            <div className='grid'>
                                <div>
                                    {/* {
                                        Details.cashier_finger_print
                                        ?
                                        <>
                                            <h6 className='font-weight-bold'>Fingerprints</h6>
                                            <div className='d-flex w-100' style={{ gap: '10px' }}>
                                                <div className='w-50'>
                                                    <img src={ process.env.REACT_APP_SERVER + '/assets/portal/assets/AC/' + window.location.href.split('/').pop() + '/thumbs/' + Details.cashier_finger_print } width="100%" className='rounded' alt="cashier finger print" />
                                                    <p className='font-weight-bold text-center mb-0'>Cashier Fingerprint</p>
                                                </div>
                                                <div className='w-50'>
                                                    <img src={ process.env.REACT_APP_SERVER + '/assets/portal/assets/AC/' + window.location.href.split('/').pop() + '/thumbs/' + Details.emp_finger_print } width="100%" className='rounded' alt="employee finger print" />
                                                    <p className='font-weight-bold text-center mb-0'>Employee Fingerprint</p>
                                                </div>
                                            </div>
                                        </>
                                        :null
                                    } */}
                                </div>
                                <div>
                                    {
                                        Details.other === 1
                                        ?
                                        <>
                                            <h6 className='font-weight-bold'>Cash Receiver CNIC</h6>
                                            <div className='d-flex w-100' style={{ gap: '10px' }}>
                                                <div className='w-50'>
                                                    <img src={ process.env.REACT_APP_SERVER + '/assets/portal/assets/AC/' + window.location.href.split('/').pop() + '/' + Details.cnic_front } width="100%" className='rounded' alt="cashier finger print" />
                                                    {/* <p className='font-weight-bold text-center mb-0'>CNIC Front</p> */}
                                                </div>
                                                <div className='w-50'>
                                                    <img src={ process.env.REACT_APP_SERVER + '/assets/portal/assets/AC/' + window.location.href.split('/').pop() + '/' + Details.cnic_back } width="100%" className='rounded' alt="employee finger print" />
                                                    {/* <p className='font-weight-bold text-center mb-0'>CNIC Back</p> */}
                                                </div>
                                            </div>
                                        </>
                                        :null
                                    }
                                </div>
                                <div className='text-center'>
                                    {
                                        Details.status === 'pending for verification'
                                        ?
                                        <>
                                            <button className='btn cancle mr-3' onClick={ () => setVReject(true) }>Reject</button>
                                            <button className='btn submit' onClick={ () => setVApprove(true) }>Approve</button>
                                        </>
                                        :null
                                    }
                                    {
                                        Details.status === 'waiting for approval' && Details.approved_by == localStorage.getItem('EmpID')
                                        ?
                                        <>
                                            <button className='btn cancle mr-3' onClick={ () => setReject(true) }>Reject</button>
                                            <button className='btn submit' onClick={ () => setApprove(true) }>Approve</button>
                                        </>
                                        :null
                                    }
                                    {
                                        Details.status === 'approved' && Details.cashier == localStorage.getItem('EmpID')
                                        ?<button className='btn submit' onClick={ () => setMoney(true) }>Release Amount (PKR { Details.amount.toLocaleString('en') })</button>
                                        :null
                                    }
                                    
                                    {
                                        Details.status === 'issued' && Details.cashier == localStorage.getItem('EmpID')
                                        ?<button className='btn submit' onClick={ () => setClearMoney(true) }>Clear Amount (PKR { Details.amount.toLocaleString('en') })</button>
                                        :null
                                    }
                                </div>
                            </div>
                        </>
                        :
                        <img src={loading} alt="loading..." width='50' height='50' className='d-block mx-auto' />
                    }
                </div>
            </div>
            {
                StartPrint
                ?
                <div id="ac_to_print" ref={ componentRef } style={{ margin: 0, position: 'relative', border: '1px solid gray', height: '100%', padding: '20px', fontFamily: "Poppins" }}>
                    <h1 className='text-center font-weight-bold' style={{ fontFamily: 'cinzel', letterSpacing: '3px' }}>SEABOARD GROUP</h1>
                    <h3 className='text-center'>Advance Cash Payment</h3>
                    <br />
                    <div className='print_status'>
                        <p className='mb-0'>
                            { 
                                Details.status === 'cleared' 
                                ? 
                                "CLEARED" 
                                : 
                                Details.status === 'cancelled'
                                ?
                                "Cancelled" 
                                :
                                Details.status === 'waiting for approval'
                                ?
                                "PENDING"
                                :
                                Details.status === 'rejected'
                                ?
                                "REJECTED"
                                :
                                Details.status === 'approved'
                                ?
                                "APPROVED"
                                :
                                "NOT CLEARED" 
                            }
                        </p>
                    </div>
                    <table className='table table-borderless'>
                        <tbody>
                            <tr>
                                <td colSpan={2}><b>Advance Payment #</b> { Details.id }</td>
                                <td><b>Date:</b> { new Date(Details.recorded_date).toDateString() }</td>
                            </tr>
                            <tr>
                                <td colSpan={2}>
                                    <b>Requested By: </b><br />
                                    <span>{ Details.requested_emp_name }</span>
                                </td>
                                <td>
                                    <b>Company: </b><br />
                                    <span>{ Details.company_name }</span>
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={3} style={{ wordBreak: 'break-word' }}>
                                    <b>Purpose: </b><br />
                                    <span>{ Details.reason }</span>
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={3}>
                                    <b>Amount: </b><br />
                                    <span>PKR {Details.amount.toLocaleString('en')}</span>
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={3}>
                                    <b>Amount In Words: </b><br />
                                    <span>{ Details.amount_in_words } Rupees Only</span>
                                </td>
                            </tr>
                            <tr>
                                <td className='text-center'>
                                    <span style={{ fontSize: 35, display: 'block', fontFamily: "Tangerine", transform: "rotate(-10deg) translate(0, 5px)" }}>
                                        { Details.record_emp_name }
                                    </span><br />
                                    <b>Recorded By</b>
                                </td>
                                <td className='text-center'>
                                    <span style={{ fontSize: 35, display: 'block', fontFamily: "Tangerine", transform: "rotate(-10deg) translate(0, 5px)" }}>
                                        { Details.status === 'approved' || Details.status === 'issued' || Details.status === 'cleared' ? Details.appr_emp_name : <span style={{ opacity: 0 }}>--------</span> }
                                    </span><br />
                                    <b>Approved By</b>
                                </td>
                                <td className='text-center'>
                                    <span style={{ fontSize: 35, display: 'block', fontFamily: "Tangerine", transform: "rotate(-10deg) translate(0, 5px)" }}>
                                        { Details.status === 'issued' || Details.status === 'cleared' ? ( Details.received_person_name ? Details.received_person_name : Details.requested_emp_name ) : <span style={{ opacity: 0 }}>--------</span> }
                                    </span><br />
                                    <b>Received By</b>
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={3}>
                                    <b className='mr-2'>Note:</b>
                                    <span>This is a computer generated report, hence does not require a signature.</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                :null
            }
        </>
    );

}

export default UI;

const ConfirmVRejection = ({ rejectVRequest }) => {
    return (
        <>
            <form onSubmit={ rejectVRequest }>
                <h5>Confirm Rejection</h5>
                <hr />
                <fieldset>
                    <label className="mb-0"><b>Remarks</b></label>
                    <textarea placeholder="Tell us why you're rejecting this request" className="form-control" name="remarks" required />
                    <button className='btn submit d-block mx-auto mt-3'>Confirm</button>
                </fieldset>
            </form>
        </>
    )
}

const ConfirmVApproval = ({ Details, Relations, verifyRequest }) => {

    return (
        <>
            <form onSubmit={ verifyRequest }>
                <h5>Confirm Verification</h5>
                <hr />
                <fieldset>
                    <label className="mb-0"><b>Remarks</b></label>
                    <textarea className="form-control mb-3" name="remarks" required />
                    <label className="mb-0"><b>Submit To</b></label>
                    <select className="form-control mb-3" name="submit_to" required>
                        <option value="">Select the option</option>
                        {
                            Details.company && Relations
                            ?
                            Relations.map(
                                (val, index) => {
                                    let option;
                                    console.log(val)
                                    if ( val.category === 'all' )
                                    {
                                        if ( val.companies.includes( parseInt(Details.company) ) )
                                        {
                                            option = <option value={val.sr} key={index}> {val.name} </option>
                                        }
                                    }

                                    return option;
                                }
                            ):null
                        }
                    </select>
                    <button className='btn submit d-block mx-auto mt-3'>Confirm</button>
                </fieldset>
            </form>
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
                    <textarea className="form-control" name="reason" required />
                    <button className='btn submit d-block mx-auto mt-3'>Confirm</button>
                </fieldset>
            </form>
        </>
    )
}

const ModalFingerPrint = ({ AttachedCNIC, Other, AccessControls, CashierThumbs, Details, validateEmployee, loadThumbs, onAttachCNIC, setOther }) => {

    const [ CashierPassCode, setCashierPassCode ] = useState();
    const [ Template1, setTemplate1 ] = useState();
    const [ Template2, setTemplate2 ] = useState();
    const [ ValidCashier, setValidCashier ] = useState(false);
    const key = 'real secret keys should be long and random';
    const encryptor = require('simple-encryptor')(key);
    const secugen_lic = "";
    const uri = "https://localhost:8443/SGIFPCapture";
    const xmlhttp = new XMLHttpRequest();
    let fpobject;

    useEffect(
        () => {
            if ( CashierPassCode === encryptor.decrypt( AccessControls.emp_password ) )
            {
                if ( Template1 )
                {
                    JSAlert.alert("Cashier Validated").dismissIn(1500 * 1);
                    setValidCashier(true);
                }else
                {
                    JSAlert.alert("Fingerprint is required!!!").dismissIn(1500 * 1);
                }
            }
        }, [ CashierPassCode, Template1 ]
    );

    function CallSGIFPGetData(successCall, failCall) {
        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                fpobject = JSON.parse(xmlhttp.responseText);
                successCall(fpobject);
            } else if (xmlhttp.status == 404) {
                failCall(xmlhttp.status)
            }
        }
        xmlhttp.onerror = function() {
            failCall(xmlhttp.status);
        }
        var params = "Timeout=10000";
        params += "&Quality=50";
        params += "&licstr=" + encodeURIComponent(secugen_lic);
        params += "&templateFormat=ISO";
        xmlhttp.open("POST", uri, true);
        xmlhttp.send(params);
    }
    function SuccessFunc1(result) {
        if (result.ErrorCode == 0) {
            if (result != null && result.BMPBase64.length > 0) {
                document.getElementById('FPImage1').src = "data:image/bmp;base64," + result.BMPBase64;
            }
            setTemplate1(result.BMPBase64);
        } else {
            alert("Fingerprint Capture Error Code:  " + result.ErrorCode + ".\nDescription:  " + (result.ErrorCode) + "."); // ErrorCodeToString
        }
    }
    function SuccessFunc2(result) {
        if (result.ErrorCode == 0) {
            /* 	Display BMP data in image tag
                BMP data is in base 64 format 
            */
            if (result != null && result.BMPBase64.length > 0) {
                document.getElementById('FPImage2').src = "data:image/bmp;base64," + result.BMPBase64;
            }
            setTemplate2(result.BMPBase64);
        } else {
            alert("Fingerprint Capture Error Code:  " + result.ErrorCode + ".\nDescription:  " + (result.ErrorCode) + "."); // ErrorCodeToString
        }
    }
    function ErrorFunc(status) {
        alert("Check if SGIBIOSRV is running; status = " + status + ":");
    }
    const verifyEmployee = ( e ) => {
        e.preventDefault();
        if ( Template2 )
        {
            validateEmployee(e, Template1, Template2);
        }else
        {
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
                    <form onSubmit={ verifyEmployee }>
                        <fieldset>
                            <div className='text-center mb-3'>
                                <img onClick={ () => CallSGIFPGetData(SuccessFunc2, ErrorFunc) } id="FPImage2" src={ "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/Fingerprint_picture.svg/1413px-Fingerprint_picture.svg.png" } alt="fingerprints" />
                            </div>
                            {
                                !Other
                                ?
                                <>
                                    <label className='mb-0'>{ Details.requested_emp_name } Pass Code</label>
                                    <input type='password' name="passcode" className='form-control' required />
                                </>
                                :
                                <>
                                    <label className='mb-0'>Receiving Person Name</label>
                                    <input type='text' name="receiving_person" className='form-control mb-2' required />
                                    <label className='mb-0'>Receiving Person Contact</label>
                                    <input type='number' name="receiving_person_contact" className='form-control mb-2' required />
                                    <label className='mb-0'>Upload CNIC (Front & Back)</label>
                                    <input type='file' name="receiving_person_cnic" className='form-control' onChange={ onAttachCNIC } required multiple />
                                    {
                                        AttachedCNIC.map(
                                            ( val, index ) => {
                                                return <img src={ URL.createObjectURL(val.file) } alt="" width="100%" key={index} />
                                            }
                                        )
                                    }
                                </>
                            }
                            <div className='d-flex align-items-center mt-3'>
                                <input type='checkbox' checked={Other} className='form-control mr-2' onChange={ () => setOther(!Other) } /> <span>Other Person</span>
                            </div>
                            <button className='btn submit d-block ml-auto mt-3' type='submit'>Get Money</button>
                        </fieldset>
                    </form>
                    :
                    <>
                        {/* <div className='text-center mb-3'>
                            <img onClick={ () => CallSGIFPGetData(SuccessFunc1, ErrorFunc) } id="FPImage1" src={ "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/Fingerprint_picture.svg/1413px-Fingerprint_picture.svg.png" } alt="fingerprints" />
                        </div> */}
                        <label className='mb-0 font-weight-bold'>{ Details.cashier_emp_name }'s' Password</label>
                        <input type='password' className='form-control' onChange={ (e) => setCashierPassCode(e.target.value) } />
                    </>
                }
            </div>
        </>
    )
}

const ModalMoneyClearance = ({ AccessControls, Details, clearRequest }) => {
    
    const [ CashierPassCode, setCashierPassCode ] = useState();
    const [ ValidCashier, setValidCashier ] = useState(false);
    const key = 'real secret keys should be long and random';
    const encryptor = require('simple-encryptor')(key);

    useEffect(
        () => {
            if ( CashierPassCode === encryptor.decrypt( AccessControls.emp_password ) )
            {
                JSAlert.alert("Cashier Validated").dismissIn(1500 * 1);
                setValidCashier(true);
            }
        }, [ CashierPassCode ]
    )

    return (
        <>
            {
                ValidCashier
                ?
                <form onSubmit={ clearRequest }>
                    <h5>Clear Amount Issued</h5>
                    <hr />
                    <fieldset>
                        <label className="mb-0"><b>Money Consumed</b></label>
                        <input type='number' className="form-control" name="after_amount" min={0} required />
                        <button className='btn submit d-block mx-auto mt-3'>Clear Amount</button>
                    </fieldset>
                </form>
                :
                <>
                    <h5>Validation Required</h5>
                    <hr />
                    <label className='mb-0'>{ Details.cashier_emp_name } Pass Code</label>
                    <input type='password' className='form-control mb-3' onChange={ (e) => setCashierPassCode(e.target.value) } />
                </>
            }
        </>
    )
}