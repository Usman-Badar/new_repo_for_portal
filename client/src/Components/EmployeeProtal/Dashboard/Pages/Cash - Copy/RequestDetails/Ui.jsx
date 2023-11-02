/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-loop-func */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable eqeqeq */
import React, { useEffect, useRef, useState } from 'react';
import './Style.css';

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import parse from 'html-react-parser';
import { useReactToPrint } from 'react-to-print';
import JSAlert from 'js-alert';
import Modal from '../../../../../UI/Modal/Modal';
import moment from 'moment';
import loading from '../../../../../../images/loadingIcons/icons8-iphone-spinner.gif';
import { useSelector } from 'react-redux';
import SignatureCanvas from 'react-signature-canvas';
import BreadCrumb from '../../../Components/BreadCrumb';
import { Link } from 'react-router-dom';

function UI({ SlipDetails, loadSlipDetails, PRequestDetails, Specifications, loadPRDetails, Comments, CNICBack, VApprove, VReject, Cancel, CNICFront, Other, ClearMoney, history, AccessControls, CashierThumbs, Money, Reject, Cashiers, Approve, Details, newComment, loadComments, clearRequest, setCancel, rejectVRequest, verifyRequest, cancelRequest, setVApprove, setVReject, setClearMoney, validateEmployee, onAttachCNICFront, onAttachCNICBack, approveRequest, setOther, rejectRequest, setMoney, loadThumbs, loadCashiers, setReject, setApprove }) {

    const [Comment, setComment] = useState('');
    const [StartPrint, setStartPrint] = useState(false);
    const [VerificationAccess, setVerificationAccess] = useState(false);
    const [Status, setStatus] = useState('');
    const [PrintContentLoaded, setPrintContentLoaded] = useState(false);
    const Relations = useSelector((state) => state.EmpAuth.Relations);
    const componentRef = useRef();
    const onBeforeGetContentResolve = useRef();
    let dueSinsStart;
    let dueSinsEnd;
    const modules = {
        toolbar: [
            [{ header: '1' }, { header: '2' }, { font: [] }],
            [{ size: [] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [
                { list: 'ordered' },
                { list: 'bullet' },
                { indent: '-1' },
                { indent: '+1' },
            ],
            ['link', 'image', 'video'],
            ['clean'],
        ],
        clipboard: {
            matchVisual: false,
        },
    };
    const formats = [
        'header',
        'font',
        'size',
        'bold',
        'italic',
        'underline',
        'strike',
        'blockquote',
        'list',
        'bullet',
        'indent',
        'link',
        'image',
        'video',
    ];

    useEffect(
        () => {
            loadComments();
            if (AccessControls) {
                for (let y = 0; y < JSON.parse(AccessControls.access).length; y++) {
                    if (parseInt(JSON.parse(AccessControls.access)[y]) === 0 || parseInt(JSON.parse(AccessControls.access)[y]) === 51) {
                        setVerificationAccess(true);
                        return false;
                    }
                }
            }
        }, []
    );
    useEffect(() => {
        if (PrintContentLoaded) {
            // Resolves the Promise, telling `react-to-print` it is time to gather the content of the page for printing
            onBeforeGetContentResolve.current();
        }
    }, [PrintContentLoaded, onBeforeGetContentResolve]);

    const handleOnBeforeGetContent = () => {
        return new Promise((resolve) => { // `react-to-print` will wait for this Promise to resolve before continuing
            // Load data
            onBeforeGetContentResolve.current = resolve;
            setPrintContentLoaded(true); // When data is done loading
        });
    };
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
            onBeforeGetContent: handleOnBeforeGetContent,
            copyStyles: true,
            onAfterPrint: () => { setStartPrint(false); setPrintContentLoaded(false); }
        }
    );
    const print = () => {
        setStartPrint(true);
        handlePrint();
    }
    const createComment = (e) => {
        e.preventDefault();
        if (Comment === '' || Comment === '<p><br></p>') {
            JSAlert.alert("Minimum 1 character is required for the comment").dismissIn(1500 * 1);
            return false;
        }
        newComment(Details.company_code_name + '-' + Details.series_year + '-' + Details.serial_no, Comment, setComment);
    }
    if (Details) {
        dueSinsStart = moment(Details.receival_date, "YYYY-MM-DD");
        dueSinsEnd = Details.clearance_date ? moment(Details.clearance_date, "YYYY-MM-DD") : moment().startOf('day');
    }
    return (
        <>
            <div className="advance_cash_details page">
                {Details ? <BreadCrumb links={[{ label: 'Cash Requests', href: '/cash/requests' }]} currentLabel={"Advance Cash Details - " + (Details.company_code_name + '-' + Details.series_year + '-' + Details.serial_no)} /> : null}
                <div className='page-content'>
                    {
                        Details && (Details.pr_id !== null || Details.previous_slip !== null)
                            ?
                            <ul className="nav nav-tabs mb-3">
                                <li className="nav-item" onClick={() => setStatus('')}>
                                    <a className={Status === '' ? 'nav-link active text-capitalize' : 'nav-link text-capitalize'}>Details</a>
                                </li>
                                {
                                    Details.previous_slip !== null
                                        ?
                                        <li className="nav-item" onClick={() => setStatus('Slip')}>
                                            <a className={Status === 'Slip' ? 'nav-link active text-capitalize' : 'nav-link text-capitalize'}>Previous Attached Slip</a>
                                        </li>
                                        : null
                                }
                                {
                                    Details.pr_id !== null
                                        ?
                                        <li className="nav-item" onClick={() => setStatus('PR')}>
                                            <a className={Status === 'PR' ? 'nav-link active text-capitalize' : 'nav-link text-capitalize'}>Purchase Requisition</a>
                                        </li>
                                        : null
                                }
                            </ul>
                            : null
                    }
                    {
                        Status === ''
                            ?
                            <div className="advance_cash_details_container mb-3">
                                {
                                    Details
                                        ?
                                        <>
                                            <Modal show={VApprove} Hide={() => setVApprove(!VApprove)} content={<ConfirmVApproval Details={Details} Relations={Relations} verifyRequest={verifyRequest} />} />
                                            <Modal show={VReject} Hide={() => setVReject(!VReject)} content={<ConfirmVRejection rejectVRequest={rejectVRequest} />} />
                                            <Modal show={Approve} Hide={() => setApprove(!Approve)} content={<ConfirmApproval approveRequest={approveRequest} Details={Details} Cashiers={Cashiers} loadCashiers={loadCashiers} />} />
                                            <Modal show={Reject} Hide={() => setReject(!Reject)} content={<ConfirmRejection rejectRequest={rejectRequest} />} />
                                            <Modal show={Cancel} Hide={() => setCancel(!Cancel)} content={<ConfirmCancellation cancelRequest={cancelRequest} />} />
                                            <Modal show={Money} Hide={() => setMoney(!Money)} content={<ModalFingerPrint CNICBack={CNICBack} CNICFront={CNICFront} onAttachCNICBack={onAttachCNICBack} onAttachCNICFront={onAttachCNICFront} Other={Other} setOther={setOther} validateEmployee={validateEmployee} AccessControls={AccessControls} CashierThumbs={CashierThumbs} loadThumbs={loadThumbs} Details={Details} />} />
                                            <Modal show={ClearMoney} Hide={() => setClearMoney(!ClearMoney)} content={<ModalMoneyClearance clearRequest={clearRequest} AccessControls={AccessControls} Details={Details} />} />
                                            <div className="d-flex align-items-center justify-content-between">
                                                <h3 className="heading">
                                                    Advance Cash Details
                                                    <sub>Details Of The Cash Request</sub>
                                                </h3>
                                                <div>
                                                    <button className='btn light' onClick={() => history.goBack()}>Back</button>
                                                    <button className='btn submit ml-2' onClick={print}>Print</button>
                                                    {
                                                        Details.status === 'waiting for approval' && Details.emp_id == localStorage.getItem('EmpID')
                                                            ?
                                                            <button className='btn cancle ml-2' onClick={() => setCancel(true)}>Cancel</button>
                                                            : null
                                                    }
                                                </div>
                                            </div>
                                            <hr />

                                            <div className={Details.status === 'issued' || Details.status === 'cleared' ? 'amountdiv' : 'amountdiv2'}>
                                                <h1 className='mb-0'>
                                                    <small className='text-success' style={{ fontSize: 16 }}>Rs</small><span className='font-weight-bold'>{Details.amount.toLocaleString('en')}</span>/-
                                                </h1>
                                                <h6 className='text-capitalize mb-0'>{Details.amount_in_words}</h6>

                                            </div>

                                            <div className={Details.status === 'issued' || Details.status === 'cleared' ? 'table_container-grid' : 'table_container-non-grid'}>

                                                <div className='table_container-left'>

                                                    <table className='table'>
                                                        <tbody>

                                                            <tr>
                                                                <td className='border-top-0'>
                                                                    <h6 className='font-weight-bold'>Request Status</h6>
                                                                </td>
                                                                <td className='border-top-0'>
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
                                                                                                    "text-info"
                                                                                                    :
                                                                                                    "text-dark"
                                                                                )
                                                                            }
                                                                        >{Details.status}</div>
                                                                    </div>
                                                                </td>
                                                            </tr>

                                                            <tr>
                                                                <td >
                                                                    <h6 className='font-weight-bold'>Requested By</h6>
                                                                </td>
                                                                <td>
                                                                    <p className='mb-0 font-weight-bold'>
                                                                        <Link to={'/hr/employee/details/' + Details.emp_id} className='clickable'>{Details.requested_emp_name}</Link>
                                                                    </p>
                                                                    <p>{Details.designation_name}</p>
                                                                </td>
                                                            </tr>

                                                            <tr>
                                                                <td>
                                                                    <h6 className='font-weight-bold'>Reason</h6>
                                                                </td>
                                                                <td>
                                                                    <pre style={{ fontFamily: 'Poppins', fontSize: '13px', width: '100%', whiteSpace: 'pre-wrap' }}>{Details.reason}</pre>
                                                                </td>
                                                            </tr>

                                                            <tr>
                                                                <td>
                                                                    <h6 className='font-weight-bold'>Company & Location</h6>
                                                                </td>
                                                                <td>
                                                                    <p className='mb-1'>{Details.company_name}</p>
                                                                    <p>{Details.location_name}</p>
                                                                </td>
                                                            </tr>

                                                            <tr>
                                                                <td>
                                                                    <h6 className='font-weight-bold'>Verified By</h6>
                                                                </td>
                                                                <td>
                                                                    <p className='mb-0 font-weight-bold'>
                                                                        {Details.record_emp_name ? <Link to={'/hr/employee/details/' + Details.verified_by} className='clickable'>{Details.record_emp_name}</Link> : <span className='text-warning'>Pending For Verification</span>}
                                                                    </p>
                                                                    {Details.verified_date ? <>{new Date(Details.verified_date).toDateString()} at {moment(Details.verified_time, 'h:mm:ss a').format('hh:mm A')}</> : null}
                                                                </td>
                                                            </tr>

                                                            {
                                                                Details.verified_date
                                                                    ?
                                                                    <tr>
                                                                        <td>
                                                                            {Details.verified_date ? <h6 className='font-weight-bold mt-2'>Verification Remarks</h6> : null}
                                                                        </td>
                                                                        <td>
                                                                            {Details.verified_date ? <p>{Details.verification_remarks}</p> : null}
                                                                        </td>
                                                                    </tr>
                                                                    : null
                                                            }

                                                            {
                                                                Details.status === 'cancelled' || Details.status === 'rejected'
                                                                    ?
                                                                    <>
                                                                        <tr>
                                                                            <td>
                                                                                <h6 className='font-weight-bold'>Rejected By</h6>
                                                                            </td>
                                                                            <td>
                                                                                <span>
                                                                                    <Link to={'/hr/employee/details/' + (Details.approved_by !== null ? Details.approved_by : Details.verified_by !== null ? Details.verified_by : Details.emp_id)} className='clickable'>
                                                                                        {Details.appr_emp_name ? Details.appr_emp_name : Details.record_emp_name}
                                                                                    </Link>
                                                                                </span><br />
                                                                                <b>Date & Time</b><br />
                                                                                <span>{new Date(Details.approved_date).toDateString() + " at " + moment(Details.approved_time, 'h:mm:ss a').format('hh:mm A')}</span>
                                                                            </td>
                                                                            <tr>
                                                                                <td>
                                                                                    <h6 className='font-weight-bold'>
                                                                                        {Details.status === 'cancelled' ? "Reason" : Details.status === 'rejected' ? "Rejection Remarks" : "Approval Remarks"}
                                                                                    </h6>
                                                                                </td>
                                                                                <td>
                                                                                    <pre style={{ fontFamily: 'Poppins', width: '100%', whiteSpace: 'pre-wrap' }}>{Details.hod_remarks}</pre>
                                                                                </td>
                                                                            </tr>
                                                                        </tr>
                                                                    </>
                                                                    :
                                                                    Details.hod_remarks
                                                                    ?
                                                                    <>
                                                                        <tr>
                                                                            <td>
                                                                                <h6 className='font-weight-bold'>Approved By</h6>
                                                                            </td>
                                                                            <td>
                                                                                <span>
                                                                                    <Link to={'/hr/employee/details/' + (Details.approved_by !== null ? Details.approved_by : Details.verified_by !== null ? Details.verified_by : Details.emp_id)} className='clickable'>
                                                                                        {Details.appr_emp_name ? Details.appr_emp_name : Details.record_emp_name}
                                                                                    </Link>
                                                                                </span><br />
                                                                                <b>Date & Time</b><br />
                                                                                <span>{new Date(Details.approved_date).toDateString() + " at " + moment(Details.approved_time, 'h:mm:ss a').format('hh:mm A')}</span>
                                                                            </td>
                                                                        </tr>

                                                                        <tr>
                                                                            <td>
                                                                                <h6 className='font-weight-bold'>
                                                                                    {Details.status === 'cancelled' ? "Reason" : Details.status === 'rejected' ? "Rejection Remarks" : "Approval Remarks"}
                                                                                </h6>
                                                                            </td>
                                                                            <td>
                                                                                <pre style={{ fontFamily: 'Poppins', width: '100%', whiteSpace: 'pre-wrap' }}>{Details.hod_remarks}</pre>
                                                                            </td>
                                                                        </tr>
                                                                    </>
                                                                    : null
                                                            }

                                                            {
                                                                Details.cashier_emp_name
                                                                    ?
                                                                    <tr>
                                                                        <td>
                                                                            <h6 className='font-weight-bold'>Cashier</h6>
                                                                        </td>
                                                                        <td>
                                                                            {
                                                                                Details.cashier_emp_name === null
                                                                                    ?
                                                                                    <span>-----</span>
                                                                                    :
                                                                                    <>
                                                                                        <span>
                                                                                            <Link to={'/hr/employee/details/' + Details.cashier} className='clickable'>{Details.cashier_emp_name}</Link>
                                                                                        </span><br />
                                                                                    </>
                                                                            }
                                                                        </td>
                                                                    </tr>

                                                                    : null
                                                            }

                                                            <tr>
                                                                <td>
                                                                    <h6 className='font-weight-bold'>Collected By</h6>
                                                                </td>
                                                                <td>
                                                                    <p>
                                                                        {
                                                                            Details.received_person_name
                                                                                ?
                                                                                <>
                                                                                    <b>Name: </b>{Details.received_person_name}<br />
                                                                                    <b>Contact: </b> {Details.received_person_contact}<br />
                                                                                    <b>CNIC: </b> {Details.received_person_cnic}
                                                                                </>
                                                                                :
                                                                                Details.receival_date
                                                                                    ?
                                                                                    <span className='text-success'>Cash Collected By <u><Link to={'/hr/employee/details/' + Details.emp_id} className='clickable'>{Details.requested_emp_name}</Link></u></span>
                                                                                    :
                                                                                    <span className='text-danger'>Cash Not Collected</span>
                                                                        }<br />
                                                                        {Details.receival_date ? <><b>Collection Date: </b> {new Date(Details.receival_date).toDateString()} at {moment(Details.receival_time, 'h:mm:ss a').format('hh:mm A')}</> : null}
                                                                    </p>
                                                                </td>

                                                            </tr>

                                                            {
                                                                Details.hod_remarks
                                                                    ?
                                                                    <>
                                                                        <tr>
                                                                            <td>
                                                                                <h6 className='font-weight-bold mb-0'>Amount Consumed</h6>
                                                                            </td>
                                                                            <td>
                                                                                <p className='mb-1'>{Details.after_amount ? ("PKR " + Details.after_amount.toLocaleString('en')) : <span className='text-warning'>Amount Not Cleared</span>}</p>
                                                                            </td>
                                                                        </tr>

                                                                        <tr>
                                                                            <td>
                                                                                <b>Clearance Date & Time</b><br />
                                                                            </td>
                                                                            <td>
                                                                                {Details.clearance_date ? <>{new Date(Details.clearance_date).toDateString()} at {moment(Details.clearance_time, 'h:mm:ss a').format('hh:mm A')}</> : null}
                                                                            </td>
                                                                        </tr>

                                                                        <tr>
                                                                            <td>
                                                                                <h6 className='font-weight-bold mb-0 mt-2'>Due Since</h6>
                                                                            </td>
                                                                            <td>
                                                                                <span className='text-danger'>
                                                                                    {
                                                                                        Details.clearance_date
                                                                                            ?
                                                                                            <span className='text-success'>Amount Has Been Cleared</span>
                                                                                            :
                                                                                            Details.receival_date ?
                                                                                                <><span className="font-weight-bold" style={{ fontFamily: "Exo" }}>{moment.duration(dueSinsEnd.diff(dueSinsStart)).asDays()}</span> {moment.duration(dueSinsEnd.diff(dueSinsStart)).asDays() === 1 ? "Day" : "Days"}</>
                                                                                                : "Cash Not Collected"
                                                                                    }</span>
                                                                            </td>
                                                                        </tr>
                                                                    </>
                                                                    :
                                                                    null
                                                            }
                                                        </tbody>

                                                    </table>

                                                </div>

                                                <div className='table_container-right'>
                                                    <div className=''>
                                                        <div className='mb-3'>
                                                            {
                                                                Details.receival_date && Details.other === 1
                                                                    ?
                                                                    <>
                                                                        <h6 className='font-weight-bold'>Signature</h6>
                                                                        <div className='bg-light border'>
                                                                            <img src={process.env.REACT_APP_SERVER + '/assets/portal/assets/AC/' + window.location.href.split('/').pop() + '/' + Details.signature} alt="" width="100%" />
                                                                        </div>
                                                                    </>
                                                                    :
                                                                    Details.receival_date && Details.other === 0
                                                                        ?
                                                                        <>
                                                                            <h6 className='font-weight-bold'>Employee Thumb</h6>
                                                                            <div className='bg-light border d-flex justify-content-center'>
                                                                                <img src={process.env.REACT_APP_SERVER + '/assets/portal/assets/AC/' + window.location.href.split('/').pop() + '/thumbs/' + Details.emp_finger_print} alt="" width="50%" />
                                                                            </div>
                                                                        </>
                                                                        : null
                                                            }
                                                        </div>
                                                        <div>
                                                            {
                                                                Details.other === 1
                                                                    ?
                                                                    <>
                                                                        <h6 className='font-weight-bold'>Cash Receiver CNIC</h6>
                                                                        <div className='d-flex w-100' style={{ gap: '10px' }}>
                                                                            <div className='w-50'>
                                                                                <img src={process.env.REACT_APP_SERVER + '/assets/portal/assets/AC/' + window.location.href.split('/').pop() + '/' + Details.cnic_front} width="100%" className='rounded' alt="cashier finger print" />
                                                                                {/* <p className='font-weight-bold text-center mb-0'>CNIC Front</p> */}
                                                                            </div>
                                                                            <div className='w-50'>
                                                                                <img src={process.env.REACT_APP_SERVER + '/assets/portal/assets/AC/' + window.location.href.split('/').pop() + '/' + Details.cnic_back} width="100%" className='rounded' alt="employee finger print" />
                                                                                {/* <p className='font-weight-bold text-center mb-0'>CNIC Back</p> */}
                                                                            </div>
                                                                        </div>
                                                                    </>
                                                                    : null
                                                            }
                                                        </div>
                                                        <div className='text-center'>
                                                            {
                                                                Details.status === 'pending for verification' && VerificationAccess
                                                                    ?
                                                                    <>
                                                                        <button className='btn cancle mr-3' onClick={() => setVReject(true)}>Reject</button>
                                                                        <button className='btn submit' onClick={() => setVApprove(true)}>Verify</button>
                                                                    </>
                                                                    : null
                                                            }
                                                            {
                                                                Details.status === 'waiting for approval' && Details.approved_by == localStorage.getItem('EmpID')
                                                                    ?
                                                                    <>
                                                                        <button className='btn cancle mr-3' onClick={() => setReject(true)}>Reject</button>
                                                                        <button className='btn submit' onClick={() => setApprove(true)}>Approve</button>
                                                                    </>
                                                                    : null
                                                            }
                                                            {
                                                                Details.status === 'approved' && AccessControls.location_code === Details.location && (AccessControls.designation_code === 66 || AccessControls.designation_code === 97)
                                                                    ? <button className='btn submit' onClick={() => setMoney(true)}>Release Amount (PKR {Details.amount.toLocaleString('en')})</button>
                                                                    : null
                                                            }
                                                            {
                                                                Details.status === 'issued' && Details.cashier == localStorage.getItem('EmpID')
                                                                    ? <button className='btn submit' onClick={() => setClearMoney(true)}>Clear Amount (PKR {Details.amount.toLocaleString('en')})</button>
                                                                    : null
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>


                                            {/* <table className='table table-borderless table-sm'>
                                                <tbody>
                                                    <tr>
                                                        <td className='text-center font-italic'>
                                                            <h1 className='mb-0 bg-light pt-3 border-top border-right border-left px-3'>
                                                                <small className='text-success' style={{ fontSize: 16 }}>Rs</small><span className='font-weight-bold' style={{ fontFamily: 'Roboto' }}>{Details.amount.toLocaleString('en')}</span>/-
                                                            </h1>
                                                            <h6 className='text-capitalize bg-light pb-3 border-bottom border-right border-left px-3'>{Details.amount_in_words} Rupees Only</h6>
                                                        </td>
                                                        <td>
                                                            <h6 className='font-weight-bold'>Requested By</h6>
                                                            <p className='mb-0 font-weight-bold'>
                                                                <Link to={'/hr/employee/details/' + Details.emp_id} className='clickable'>{Details.requested_emp_name}</Link>
                                                            </p>
                                                            <p>{Details.designation_name}</p>
                                                            <h6 className='font-weight-bold'>Collected By</h6>
                                                            <p>
                                                                {
                                                                    Details.received_person_name
                                                                        ?
                                                                        <>
                                                                            <b>Name: </b>{Details.received_person_name}<br />
                                                                            <b>Contact: </b> {Details.received_person_contact}<br />
                                                                            <b>CNIC: </b> {Details.received_person_cnic}
                                                                        </>
                                                                        :
                                                                        Details.receival_date
                                                                            ?
                                                                            <span className='text-success'>Cash Collected By <u><Link to={'/hr/employee/details/' + Details.emp_id} className='clickable'>{Details.requested_emp_name}</Link></u></span>
                                                                            :
                                                                            <span className='text-danger'>Cash Not Collected</span>
                                                                }<br />
                                                                {Details.receival_date ? <><b>Collection Date: </b> {new Date(Details.receival_date).toDateString()} at {moment(Details.receival_time, 'h:mm:ss a').format('hh:mm A')}</> : null}
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <h6 className='font-weight-bold'>Verified By</h6>
                                                            <p className='mb-0 font-weight-bold'>
                                                                {Details.record_emp_name ? <Link to={'/hr/employee/details/' + Details.verified_by} className='clickable'>{Details.record_emp_name}</Link> : <span className='text-warning'>Pending For Verification</span>}
                                                            </p>
                                                            {Details.verified_date ? <>{new Date(Details.verified_date).toDateString()} at {moment(Details.verified_time, 'h:mm:ss a').format('hh:mm A')}</> : null}
                                                            {Details.verified_date ? <h6 className='font-weight-bold mt-2'>Remarks</h6> : null}
                                                            {Details.verified_date ? <p>{Details.verification_remarks}</p> : null}
                                                        </td>
                                                        <td>
                                                            <h6 className='font-weight-bold'>Company & Location</h6>
                                                            <p className='mb-1'>{Details.company_name}</p>
                                                            <p>{Details.location_name}</p>
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
                                                                                            "text-info"
                                                                                            :
                                                                                            "text-dark"
                                                                        )
                                                                    }
                                                                >{Details.status}</div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        {
                                                            Details.hod_remarks
                                                                ?
                                                                <td>
                                                                    <h6 className='font-weight-bold mb-0'>Amount Consumed</h6>
                                                                    <p className='mb-1'>{Details.after_amount ? ("PKR " + Details.after_amount.toLocaleString('en')) : <span className='text-warning'>Amount Not Cleared</span>}</p>
                                                                    <b>Clearance Date & Time</b><br />
                                                                    {Details.clearance_date ? <>{new Date(Details.clearance_date).toDateString()} at {moment(Details.clearance_time, 'h:mm:ss a').format('hh:mm A')}</> : null}
                                                                    <h6 className='font-weight-bold mb-0 mt-2'>Due Since</h6>
                                                                    <span className='text-danger'>
                                                                        {
                                                                            Details.clearance_date
                                                                                ?
                                                                                <span className='text-success'>Amount Has Been Cleared</span>
                                                                                :
                                                                                Details.receival_date ?
                                                                                    <><span className="font-weight-bold" style={{ fontFamily: "Exo" }}>{moment.duration(dueSinsEnd.diff(dueSinsStart)).asDays()}</span> {moment.duration(dueSinsEnd.diff(dueSinsStart)).asDays() === 1 ? "Day" : "Days"}</>
                                                                                    : "Cash Not Collected"
                                                                        }</span>
                                                                </td>
                                                                :
                                                                <td></td>
                                                        }
                                                        <td colSpan={2}>
                                                            <h6 className='font-weight-bold'>Reason</h6>
                                                            <pre style={{ fontFamily: 'Poppins', fontSize: '13px', width: '100%', whiteSpace: 'pre-wrap' }}>{Details.reason}</pre>
                                                        </td>
                                                        {
                                                            Details.status === 'cancelled' || Details.status === 'rejected'
                                                                ?
                                                                <td>
                                                                    <h6 className='font-weight-bold'>Rejected By</h6>
                                                                    <span>
                                                                        <Link to={'/hr/employee/details/' + (Details.approved_by !== null ? Details.approved_by : Details.verified_by !== null ? Details.verified_by : Details.emp_id)} className='clickable'>
                                                                            {Details.appr_emp_name ? Details.appr_emp_name : Details.record_emp_name}
                                                                        </Link>
                                                                    </span><br />
                                                                    <b>Date & Time</b><br />
                                                                    <span>{new Date(Details.approved_date).toDateString() + " at " + moment(Details.approved_time, 'h:mm:ss a').format('hh:mm A')}</span>
                                                                </td>
                                                                :
                                                                Details.hod_remarks
                                                                    ?
                                                                    <td>
                                                                        <h6 className='font-weight-bold'>Approved By</h6>
                                                                        <span>
                                                                            <Link to={'/hr/employee/details/' + (Details.approved_by !== null ? Details.approved_by : Details.verified_by !== null ? Details.verified_by : Details.emp_id)} className='clickable'>
                                                                                {Details.appr_emp_name ? Details.appr_emp_name : Details.record_emp_name}
                                                                            </Link>
                                                                        </span><br />
                                                                        <b>Date & Time</b><br />
                                                                        <span>{new Date(Details.approved_date).toDateString() + " at " + moment(Details.approved_time, 'h:mm:ss a').format('hh:mm A')}</span>
                                                                    </td>
                                                                    : null
                                                        }
                                                    </tr>
                                                    {
                                                        Details.hod_remarks
                                                            ?
                                                            <tr>
                                                                <td></td>
                                                                <td colSpan={2}>
                                                                    <h6 className='font-weight-bold'>
                                                                        {Details.status === 'cancelled' ? "Reason" : "Approval Remarks"}
                                                                    </h6>
                                                                    <pre style={{ fontFamily: 'Poppins', width: '100%', whiteSpace: 'pre-wrap' }}>{Details.hod_remarks}</pre>
                                                                </td>
                                                                <td>
                                                                    <h6 className='font-weight-bold'>Cashier</h6>
                                                                    {
                                                                        Details.cashier_emp_name === null
                                                                            ?
                                                                            <span>-----</span>
                                                                            :
                                                                            <>
                                                                                <span>
                                                                                    <Link to={'/hr/employee/details/' + Details.cashier} className='clickable'>{Details.cashier_emp_name}</Link>
                                                                                </span><br />
                                                                            </>
                                                                    }
                                                                </td>
                                                            </tr>
                                                            : null
                                                    }
                                                </tbody>
                                            </table> */}
                                            {/* <div className='grid'>
                                                <div>
                                                    {
                                                        Details.receival_date && Details.other === 1
                                                            ?
                                                            <>
                                                                <h6 className='font-weight-bold'>Signature</h6>
                                                                <img src={process.env.REACT_APP_SERVER + '/assets/portal/assets/AC/' + window.location.href.split('/').pop() + '/' + Details.signature} alt="" width="100%" />
                                                            </>
                                                            :
                                                            Details.receival_date && Details.other === 0
                                                                ?
                                                                <>
                                                                    <h6 className='font-weight-bold'>Employee Thumb</h6>
                                                                    <img src={process.env.REACT_APP_SERVER + '/assets/portal/assets/AC/' + window.location.href.split('/').pop() + '/thumbs/' + Details.emp_finger_print} alt="" width="50%" />
                                                                </>
                                                                : null
                                                    }
                                                </div>
                                                <div>
                                                    {
                                                        Details.other === 1
                                                            ?
                                                            <>
                                                                <h6 className='font-weight-bold'>Cash Receiver CNIC</h6>
                                                                <div className='d-flex w-100' style={{ gap: '10px' }}>
                                                                    <div className='w-50'>
                                                                        <img src={process.env.REACT_APP_SERVER + '/assets/portal/assets/AC/' + window.location.href.split('/').pop() + '/' + Details.cnic_front} width="100%" className='rounded' alt="cashier finger print" />
                                                                    </div>
                                                                    <div className='w-50'>
                                                                        <img src={process.env.REACT_APP_SERVER + '/assets/portal/assets/AC/' + window.location.href.split('/').pop() + '/' + Details.cnic_back} width="100%" className='rounded' alt="employee finger print" />
                                                                    </div>
                                                                </div>
                                                            </>
                                                            : null
                                                    }
                                                </div>
                                                <div className='text-center'>
                                                    {
                                                        Details.status === 'pending for verification' && VerificationAccess
                                                            ?
                                                            <>
                                                                <button className='btn cancle mr-3' onClick={() => setVReject(true)}>Reject</button>
                                                                <button className='btn submit' onClick={() => setVApprove(true)}>Verify</button>
                                                            </>
                                                            : null
                                                    }
                                                    {
                                                        Details.status === 'waiting for approval' && Details.approved_by == localStorage.getItem('EmpID')
                                                            ?
                                                            <>
                                                                <button className='btn cancle mr-3' onClick={() => setReject(true)}>Reject</button>
                                                                <button className='btn submit' onClick={() => setApprove(true)}>Approve</button>
                                                            </>
                                                            : null
                                                    }
                                                    {
                                                        Details.status === 'approved' && AccessControls.location_code === Details.location && (AccessControls.designation_code === 66 || AccessControls.designation_code === 97)
                                                            ? <button className='btn submit' onClick={() => setMoney(true)}>Release Amount (PKR {Details.amount.toLocaleString('en')})</button>
                                                            : null
                                                    }
                                                    {
                                                        Details.status === 'issued' && Details.cashier == localStorage.getItem('EmpID')
                                                            ? <button className='btn submit' onClick={() => setClearMoney(true)}>Clear Amount (PKR {Details.amount.toLocaleString('en')})</button>
                                                            : null
                                                    }
                                                </div>
                                            </div> */}
                                        </>
                                        :
                                        <img src={loading} alt="loading..." width='50' height='50' className='d-block mx-auto' />
                                }
                            </div>
                            :
                            Status === 'Slip'
                                ?
                                <AttachedSlip
                                    slip_id={Details.previous_slip}
                                    SlipDetails={SlipDetails}

                                    loadSlipDetails={loadSlipDetails}
                                />
                                :
                                <PurchaseRequisition
                                    PRequestDetails={PRequestDetails}
                                    Specifications={Specifications}

                                    loadPRDetails={loadPRDetails}
                                />
                    }
                </div>
            </div>
            {
                StartPrint
                    ?
                    <div id="ac_to_print" ref={componentRef} style={{ margin: 0, position: 'relative', border: '1px solid gray', height: '100%', padding: '20px', fontFamily: "Poppins" }}>
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
                                    <td colSpan={3}><b>Advance Payment #</b> <span className='font-weight-bold' style={{ fontFamily: 'Exo' }}>{Details.company_code_name + '-' + Details.series_year + '-' + Details.serial_no}</span></td>
                                    <td><b>Date:</b> {new Date(Details.submit_date).toDateString()}</td>
                                </tr>
                                {
                                    Details.other === 1
                                        ?
                                        <tr>
                                            <td colSpan={3}>
                                                <b>Company: </b><br />
                                                <b><u>{Details.company_name}</u></b><br />
                                                <b>Location: </b><br />
                                                <b><u>{Details.location_name}</u></b>
                                            </td>
                                            <td>
                                                <b>Cash Receiver</b><br />
                                                <span><b>Name: </b> {Details.received_person_name}</span><br />
                                                <span><b>Contact: </b> {Details.received_person_contact}</span><br />
                                                <span><b>CNIC: </b> {Details.received_person_cnic}</span>
                                            </td>
                                        </tr>
                                        :
                                        <tr>
                                            <td colSpan={2}>
                                                <b>Company: </b><br />
                                                <span><u>{Details.company_name}</u></span>
                                            </td>
                                            <td colSpan={2}>
                                                <b>Location: </b><br />
                                                <span><u>{Details.location_name}</u></span>
                                            </td>
                                        </tr>
                                }
                                <tr>
                                    <td colSpan={4} style={{ wordBreak: 'break-word' }}>
                                        <b>Purpose: </b><br />
                                        <span>{Details.reason}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan={4}>
                                        <b>Amount: </b><br />
                                        <span>Rs {Details.amount.toLocaleString('en')} /-</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan={4}>
                                        <b>Amount In Words: </b><br />
                                        <span>{Details.amount_in_words} Rupees Only</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td className='text-center'>
                                        <span style={{ fontSize: 35, display: 'block', fontFamily: "Tangerine", transform: "rotate(-10deg) translate(0, 5px)" }}>
                                            {Details.requested_emp_name}
                                        </span><br />
                                        <b>Submitted By</b><br />
                                        <small>{new Date(Details.submit_date).toDateString()}</small>
                                    </td>
                                    <td className='text-center'>
                                        <span style={{ fontSize: 35, display: 'block', fontFamily: "Tangerine", transform: "rotate(-10deg) translate(0, 5px)" }}>
                                            {Details.record_emp_name}
                                        </span><br />
                                        <b>Verified By</b><br />
                                        <small>{Details.verified_date !== null ? new Date(Details.verified_date).toDateString() : '-'}</small>
                                    </td>
                                    <td className='text-center'>
                                        <span style={{ fontSize: 35, display: 'block', fontFamily: "Tangerine", transform: "rotate(-10deg) translate(0, 5px)" }}>
                                            {Details.status === 'approved' || Details.status === 'issued' || Details.status === 'cleared' ? Details.appr_emp_name : <span style={{ opacity: 0 }}>--------</span>}
                                        </span><br />
                                        <b>Approved By</b><br />
                                        <small>{Details.approved_date !== null ? new Date(Details.approved_date).toDateString() : '-'}</small>
                                    </td>
                                    <td className='text-center'>
                                        {
                                            Details.other === 1
                                                ?
                                                <>
                                                    <div style={{ height: '80px', position: 'relative' }}>
                                                        <img style={{ position: 'absolute', left: 0, bottom: '0' }} src={process.env.REACT_APP_SERVER + '/assets/portal/assets/AC/' + window.location.href.split('/').pop() + '/' + Details.signature} alt="" width="200" height="200" /><br />
                                                    </div>
                                                </>
                                                :
                                                <>
                                                    <span style={{ fontSize: 35, display: 'block', fontFamily: "Tangerine", transform: "rotate(-10deg) translate(0, 5px)" }}>
                                                        {Details.status === 'issued' || Details.status === 'cleared' ? (Details.received_person_name ? Details.received_person_name : Details.requested_emp_name) : <span style={{ opacity: 0 }}>--------</span>}
                                                    </span><br />
                                                </>
                                        }
                                        <b>Received By</b><br />
                                        <small>{Details.receival_date !== null ? new Date(Details.receival_date).toDateString() : '-'}</small>
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan={4}>
                                        <b className='mr-2'>Note:</b>
                                        <span>This is a computer generated advance cash payment slip.</span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    : null
            }
        </>
    );

}

export default UI;

const AttachedSlip = ({ slip_id, SlipDetails, loadSlipDetails }) => {
    useEffect(
        () => {
            if (!SlipDetails) loadSlipDetails(slip_id);
        }, []
    )
    return (
        <>
            <div className="advance_cash_details_container mb-3">
                {
                    SlipDetails
                        ?
                        <>
                            <div className="d-flex align-items-center justify-content-between">
                                <h3 className="heading">
                                    Attached Slip Details
                                    <sub>Details Of The Cash Request</sub>
                                </h3>
                            </div>
                            <hr />

                            <div className={SlipDetails.status === 'issued' || SlipDetails.status === 'cleared' ? 'amountdiv' : 'amountdiv2'}>
                                <h1 className='mb-0'>
                                    <small className='text-success' style={{ fontSize: 16 }}>Rs</small><span className='font-weight-bold'>{SlipDetails.amount.toLocaleString('en')}</span>/-
                                </h1>
                                <h6 className='text-capitalize mb-0'>{SlipDetails.amount_in_words}</h6>

                            </div>

                            <div className={SlipDetails.status === 'issued' || SlipDetails.status === 'cleared' ? 'table_container-grid' : 'table_container-non-grid'}>

                                <div className='table_container-left'>

                                    <table className='table'>
                                        <tbody>

                                            <tr>
                                                <td className='border-top-0'>
                                                    <h6 className='font-weight-bold'>Request Status</h6>
                                                </td>
                                                <td className='border-top-0'>
                                                    <div className='d-flex align-items-center'>
                                                        <div
                                                            className={
                                                                "dot mr-1 "
                                                                +
                                                                (
                                                                    SlipDetails.status === 'approved' || SlipDetails.status === 'cleared'
                                                                        ?
                                                                        "bg-success"
                                                                        :
                                                                        SlipDetails.status === 'rejected'
                                                                            ?
                                                                            "bg-danger"
                                                                            :
                                                                            SlipDetails.status === 'waiting for approval' || SlipDetails.status === 'pending for verification'
                                                                                ?
                                                                                "bg-warning"
                                                                                :
                                                                                SlipDetails.status === 'issued'
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
                                                                    SlipDetails.status === 'approved' || SlipDetails.status === 'cleared'
                                                                        ?
                                                                        "text-success"
                                                                        :
                                                                        SlipDetails.status === 'rejected'
                                                                            ?
                                                                            "text-danger"
                                                                            :
                                                                            SlipDetails.status === 'waiting for approval' || SlipDetails.status === 'pending for verification'
                                                                                ?
                                                                                "text-warning"
                                                                                :
                                                                                SlipDetails.status === 'issued'
                                                                                    ?
                                                                                    "text-info"
                                                                                    :
                                                                                    "text-dark"
                                                                )
                                                            }
                                                        >{SlipDetails.status}</div>
                                                    </div>
                                                </td>
                                            </tr>

                                            <tr>
                                                <td >
                                                    <h6 className='font-weight-bold'>Requested By</h6>
                                                </td>
                                                <td>
                                                    <p className='mb-0 font-weight-bold'>
                                                        <Link to={'/hr/employee/SlipDetails/' + SlipDetails.emp_id} className='clickable'>{SlipDetails.requested_emp_name}</Link>
                                                    </p>
                                                    <p>{SlipDetails.designation_name}</p>
                                                </td>
                                            </tr>

                                            <tr>
                                                <td>
                                                    <h6 className='font-weight-bold'>Reason</h6>
                                                </td>
                                                <td>
                                                    <pre style={{ fontFamily: 'Poppins', fontSize: '13px', width: '100%', whiteSpace: 'pre-wrap' }}>{SlipDetails.reason}</pre>
                                                </td>
                                            </tr>

                                            <tr>
                                                <td>
                                                    <h6 className='font-weight-bold'>Company & Location</h6>
                                                </td>
                                                <td>
                                                    <p className='mb-1'>{SlipDetails.company_name}</p>
                                                    <p>{SlipDetails.location_name}</p>
                                                </td>
                                            </tr>

                                            <tr>
                                                <td>
                                                    <h6 className='font-weight-bold'>Verified By</h6>
                                                </td>
                                                <td>
                                                    <p className='mb-0 font-weight-bold'>
                                                        {SlipDetails.record_emp_name ? <Link to={'/hr/employee/SlipDetails/' + SlipDetails.verified_by} className='clickable'>{SlipDetails.record_emp_name}</Link> : <span className='text-warning'>Pending For Verification</span>}
                                                    </p>
                                                    {SlipDetails.verified_date ? <>{new Date(SlipDetails.verified_date).toDateString()} at {moment(SlipDetails.verified_time, 'h:mm:ss a').format('hh:mm A')}</> : null}
                                                </td>
                                            </tr>

                                            {
                                                SlipDetails.verified_date
                                                    ?
                                                    <tr>
                                                        <td>
                                                            {SlipDetails.verified_date ? <h6 className='font-weight-bold mt-2'>Verification Remarks</h6> : null}
                                                        </td>
                                                        <td>
                                                            {SlipDetails.verified_date ? <p>{SlipDetails.verification_remarks}</p> : null}
                                                        </td>
                                                    </tr>
                                                    : null
                                            }

                                            {
                                                SlipDetails.status === 'cancelled' || SlipDetails.status === 'rejected'
                                                    ?
                                                    <tr>
                                                        <td>
                                                            <h6 className='font-weight-bold'>Rejected By</h6>
                                                        </td>
                                                        <td>
                                                            <span>
                                                                <Link to={'/hr/employee/SlipDetails/' + (SlipDetails.approved_by !== null ? SlipDetails.approved_by : SlipDetails.verified_by !== null ? SlipDetails.verified_by : SlipDetails.emp_id)} className='clickable'>
                                                                    {SlipDetails.appr_emp_name ? SlipDetails.appr_emp_name : SlipDetails.record_emp_name}
                                                                </Link>
                                                            </span><br />
                                                            <b>Date & Time</b><br />
                                                            <span>{new Date(SlipDetails.approved_date).toDateString() + " at " + moment(SlipDetails.approved_time, 'h:mm:ss a').format('hh:mm A')}</span>
                                                        </td>

                                                    </tr>
                                                    :
                                                    SlipDetails.hod_remarks
                                                        ?
                                                        <>
                                                            <tr>
                                                                <td>
                                                                    <h6 className='font-weight-bold'>Approved By</h6>
                                                                </td>
                                                                <td>
                                                                    <span>
                                                                        <Link to={'/hr/employee/SlipDetails/' + (SlipDetails.approved_by !== null ? SlipDetails.approved_by : SlipDetails.verified_by !== null ? SlipDetails.verified_by : SlipDetails.emp_id)} className='clickable'>
                                                                            {SlipDetails.appr_emp_name ? SlipDetails.appr_emp_name : SlipDetails.record_emp_name}
                                                                        </Link>
                                                                    </span><br />
                                                                    <b>Date & Time</b><br />
                                                                    <span>{new Date(SlipDetails.approved_date).toDateString() + " at " + moment(SlipDetails.approved_time, 'h:mm:ss a').format('hh:mm A')}</span>
                                                                </td>
                                                            </tr>

                                                            <tr>
                                                                <td>
                                                                    <h6 className='font-weight-bold'>
                                                                        {SlipDetails.status === 'cancelled' ? "Reason" : "Approval Remarks"}
                                                                    </h6>
                                                                </td>
                                                                <td>
                                                                    <pre style={{ fontFamily: 'Poppins', width: '100%', whiteSpace: 'pre-wrap' }}>{SlipDetails.hod_remarks}</pre>
                                                                </td>
                                                            </tr>
                                                        </>
                                                        : null
                                            }

                                            {
                                                SlipDetails.cashier_emp_name
                                                    ?
                                                    <tr>
                                                        <td>
                                                            <h6 className='font-weight-bold'>Cashier</h6>
                                                        </td>
                                                        <td>
                                                            {
                                                                SlipDetails.cashier_emp_name === null
                                                                    ?
                                                                    <span>-----</span>
                                                                    :
                                                                    <>
                                                                        <span>
                                                                            <Link to={'/hr/employee/SlipDetails/' + SlipDetails.cashier} className='clickable'>{SlipDetails.cashier_emp_name}</Link>
                                                                        </span><br />
                                                                    </>
                                                            }
                                                        </td>
                                                    </tr>

                                                    : null
                                            }

                                            <tr>
                                                <td>
                                                    <h6 className='font-weight-bold'>Collected By</h6>
                                                </td>
                                                <td>
                                                    <p>
                                                        {
                                                            SlipDetails.received_person_name
                                                                ?
                                                                <>
                                                                    <b>Name: </b>{SlipDetails.received_person_name}<br />
                                                                    <b>Contact: </b> {SlipDetails.received_person_contact}<br />
                                                                    <b>CNIC: </b> {SlipDetails.received_person_cnic}
                                                                </>
                                                                :
                                                                SlipDetails.receival_date
                                                                    ?
                                                                    <span className='text-success'>Cash Collected By <u><Link to={'/hr/employee/SlipDetails/' + SlipDetails.emp_id} className='clickable'>{SlipDetails.requested_emp_name}</Link></u></span>
                                                                    :
                                                                    <span className='text-danger'>Cash Not Collected</span>
                                                        }<br />
                                                        {SlipDetails.receival_date ? <><b>Collection Date: </b> {new Date(SlipDetails.receival_date).toDateString()} at {moment(SlipDetails.receival_time, 'h:mm:ss a').format('hh:mm A')}</> : null}
                                                    </p>
                                                </td>

                                            </tr>

                                            {
                                                SlipDetails.hod_remarks
                                                    ?
                                                    <>
                                                        <tr>
                                                            <td>
                                                                <h6 className='font-weight-bold mb-0'>Amount Consumed</h6>
                                                            </td>
                                                            <td>
                                                                <p className='mb-1'>{SlipDetails.after_amount ? ("PKR " + SlipDetails.after_amount.toLocaleString('en')) : <span className='text-warning'>Amount Not Cleared</span>}</p>
                                                            </td>
                                                        </tr>

                                                        <tr>
                                                            <td>
                                                                <b>Clearance Date & Time</b><br />
                                                            </td>
                                                            <td>
                                                                {SlipDetails.clearance_date ? <>{new Date(SlipDetails.clearance_date).toDateString()} at {moment(SlipDetails.clearance_time, 'h:mm:ss a').format('hh:mm A')}</> : null}
                                                            </td>
                                                        </tr>

                                                        {/* <tr>
                                                                            <td>
                                                                                <h6 className='font-weight-bold mb-0 mt-2'>Due Since</h6>
                                                                            </td>
                                                                            <td>
                                                                                <span className='text-danger'>
                                                                                    {
                                                                                        SlipDetails.clearance_date
                                                                                            ?
                                                                                            <span className='text-success'>Amount Has Been Cleared</span>
                                                                                            :
                                                                                            SlipDetails.receival_date ?
                                                                                                <><span className="font-weight-bold" style={{ fontFamily: "Exo" }}>{moment.duration(dueSinsEnd.diff(dueSinsStart)).asDays()}</span> {moment.duration(dueSinsEnd.diff(dueSinsStart)).asDays() === 1 ? "Day" : "Days"}</>
                                                                                                : "Cash Not Collected"
                                                                                    }</span>
                                                                            </td>
                                                                        </tr> */}
                                                    </>
                                                    :
                                                    null
                                            }
                                        </tbody>

                                    </table>

                                </div>

                                <div className='table_container-right'>
                                    <div className=''>
                                        <div className='mb-3'>
                                            {
                                                SlipDetails.receival_date && SlipDetails.other === 1
                                                    ?
                                                    <>
                                                        <h6 className='font-weight-bold'>Signature</h6>
                                                        <div className='bg-light border'>
                                                            <img src={process.env.REACT_APP_SERVER + '/assets/portal/assets/AC/' + window.location.href.split('/').pop() + '/' + SlipDetails.signature} alt="" width="100%" />
                                                        </div>
                                                    </>
                                                    :
                                                    SlipDetails.receival_date && SlipDetails.other === 0
                                                        ?
                                                        <>
                                                            <h6 className='font-weight-bold'>Employee Thumb</h6>
                                                            <div className='bg-light border d-flex justify-content-center'>
                                                                <img src={process.env.REACT_APP_SERVER + '/assets/portal/assets/AC/' + window.location.href.split('/').pop() + '/thumbs/' + SlipDetails.emp_finger_print} alt="" width="50%" />
                                                            </div>
                                                        </>
                                                        : null
                                            }
                                        </div>
                                        <div>
                                            {
                                                SlipDetails.other === 1
                                                    ?
                                                    <>
                                                        <h6 className='font-weight-bold'>Cash Receiver CNIC</h6>
                                                        <div className='d-flex w-100' style={{ gap: '10px' }}>
                                                            <div className='w-50'>
                                                                <img src={process.env.REACT_APP_SERVER + '/assets/portal/assets/AC/' + window.location.href.split('/').pop() + '/' + SlipDetails.cnic_front} width="100%" className='rounded' alt="cashier finger print" />
                                                                {/* <p className='font-weight-bold text-center mb-0'>CNIC Front</p> */}
                                                            </div>
                                                            <div className='w-50'>
                                                                <img src={process.env.REACT_APP_SERVER + '/assets/portal/assets/AC/' + window.location.href.split('/').pop() + '/' + SlipDetails.cnic_back} width="100%" className='rounded' alt="employee finger print" />
                                                                {/* <p className='font-weight-bold text-center mb-0'>CNIC Back</p> */}
                                                            </div>
                                                        </div>
                                                    </>
                                                    : null
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* <table className='table table-borderless table-sm'>
                                <tbody>
                                    <tr>
                                        <td className='text-center font-italic'>
                                            <h1 className='mb-0 bg-light pt-3 border-top border-right border-left px-3'>
                                                <small className='text-success' style={{ fontSize: 16 }}>Rs</small><span className='font-weight-bold' style={{ fontFamily: 'Roboto' }}>{SlipDetails.amount.toLocaleString('en')}</span>/-
                                            </h1>
                                            <h6 className='text-capitalize bg-light pb-3 border-bottom border-right border-left px-3'>{SlipDetails.amount_in_words} Rupees Only</h6>
                                        </td>
                                        <td>
                                            <h6 className='font-weight-bold'>Requested By</h6>
                                            <p className='mb-0 font-weight-bold'>
                                                <Link to={'/hr/employee/details/' + SlipDetails.emp_id} className='clickable'>{SlipDetails.requested_emp_name}</Link>
                                            </p>
                                            <p>{SlipDetails.designation_name}</p>
                                            <h6 className='font-weight-bold'>Collected By</h6>
                                            <p>
                                                {
                                                    SlipDetails.received_person_name
                                                        ?
                                                        <>
                                                            <b>Name: </b>{SlipDetails.received_person_name}<br />
                                                            <b>Contact: </b> {SlipDetails.received_person_contact}<br />
                                                            <b>CNIC: </b> {SlipDetails.received_person_cnic}
                                                        </>
                                                        :
                                                        SlipDetails.receival_date
                                                            ?
                                                            <span className='text-success'>Cash Collected By <u><Link to={'/hr/employee/details/' + SlipDetails.emp_id} className='clickable'>{SlipDetails.requested_emp_name}</Link></u></span>
                                                            :
                                                            <span className='text-danger'>Cash Not Collected</span>
                                                }<br />
                                                {SlipDetails.receival_date ? <><b>Collection Date: </b> {new Date(SlipDetails.receival_date).toDateString()} at {moment(SlipDetails.receival_time, 'h:mm:ss a').format('hh:mm A')}</> : null}
                                            </p>
                                        </td>
                                        <td>
                                            <h6 className='font-weight-bold'>Verified By</h6>
                                            <p className='mb-0 font-weight-bold'>
                                                {SlipDetails.record_emp_name ? <Link to={'/hr/employee/details/' + SlipDetails.verified_by} className='clickable'>{SlipDetails.record_emp_name}</Link> : <span className='text-warning'>Pending For Verification</span>}
                                            </p>
                                            {SlipDetails.verified_date ? <>{new Date(SlipDetails.verified_date).toDateString()} at {moment(SlipDetails.verified_time, 'h:mm:ss a').format('hh:mm A')}</> : null}
                                            {SlipDetails.verified_date ? <h6 className='font-weight-bold mt-2'>Remarks</h6> : null}
                                            {SlipDetails.verified_date ? <p>{SlipDetails.verification_remarks}</p> : null}
                                        </td>
                                        <td>
                                            <h6 className='font-weight-bold'>Company & Location</h6>
                                            <p className='mb-1'>{SlipDetails.company_name}</p>
                                            <p>{SlipDetails.location_name}</p>
                                            <h6 className='font-weight-bold'>Request Status</h6>
                                            <div className='d-flex align-items-center'>
                                                <div
                                                    className={
                                                        "dot mr-1 "
                                                        +
                                                        (
                                                            SlipDetails.status === 'approved' || SlipDetails.status === 'cleared'
                                                                ?
                                                                "bg-success"
                                                                :
                                                                SlipDetails.status === 'rejected'
                                                                    ?
                                                                    "bg-danger"
                                                                    :
                                                                    SlipDetails.status === 'waiting for approval' || SlipDetails.status === 'pending for verification'
                                                                        ?
                                                                        "bg-warning"
                                                                        :
                                                                        SlipDetails.status === 'issued'
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
                                                            SlipDetails.status === 'approved' || SlipDetails.status === 'cleared'
                                                                ?
                                                                "text-success"
                                                                :
                                                                SlipDetails.status === 'rejected'
                                                                    ?
                                                                    "text-danger"
                                                                    :
                                                                    SlipDetails.status === 'waiting for approval' || SlipDetails.status === 'pending for verification'
                                                                        ?
                                                                        "text-warning"
                                                                        :
                                                                        SlipDetails.status === 'issued'
                                                                            ?
                                                                            "text-info"
                                                                            :
                                                                            "text-dark"
                                                        )
                                                    }
                                                >{SlipDetails.status}</div>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        {
                                            SlipDetails.hod_remarks
                                                ?
                                                <td>
                                                    <h6 className='font-weight-bold mb-0'>Amount Consumed</h6>
                                                    <p className='mb-1'>{SlipDetails.after_amount ? ("PKR " + SlipDetails.after_amount.toLocaleString('en')) : <span className='text-warning'>Amount Not Cleared</span>}</p>
                                                    <b>Clearance Date & Time</b><br />
                                                    {SlipDetails.clearance_date ? <>{new Date(SlipDetails.clearance_date).toDateString()} at {moment(SlipDetails.clearance_time, 'h:mm:ss a').format('hh:mm A')}</> : null}
                                                </td>
                                                :
                                                <td></td>
                                        }
                                        <td colSpan={2}>
                                            <h6 className='font-weight-bold'>Reason</h6>
                                            <pre style={{ fontFamily: 'Poppins', fontSize: '13px', width: '100%', whiteSpace: 'pre-wrap' }}>{SlipDetails.reason}</pre>
                                        </td>
                                        {
                                            SlipDetails.status === 'cancelled' || SlipDetails.status === 'rejected'
                                                ?
                                                <td>
                                                    <h6 className='font-weight-bold'>Rejected By</h6>
                                                    <span>
                                                        <Link to={'/hr/employee/details/' + (SlipDetails.approved_by !== null ? SlipDetails.approved_by : SlipDetails.verified_by !== null ? SlipDetails.verified_by : SlipDetails.emp_id)} className='clickable'>
                                                            {SlipDetails.appr_emp_name ? SlipDetails.appr_emp_name : SlipDetails.record_emp_name}
                                                        </Link>
                                                    </span><br />
                                                    <b>Date & Time</b><br />
                                                    <span>{new Date(SlipDetails.approved_date).toDateString() + " at " + moment(SlipDetails.approved_time, 'h:mm:ss a').format('hh:mm A')}</span>
                                                </td>
                                                :
                                                SlipDetails.hod_remarks
                                                    ?
                                                    <td>
                                                        <h6 className='font-weight-bold'>Approved By</h6>
                                                        <span>
                                                            <Link to={'/hr/employee/details/' + (SlipDetails.approved_by !== null ? SlipDetails.approved_by : SlipDetails.verified_by !== null ? SlipDetails.verified_by : SlipDetails.emp_id)} className='clickable'>
                                                                {SlipDetails.appr_emp_name ? SlipDetails.appr_emp_name : SlipDetails.record_emp_name}
                                                            </Link>
                                                        </span><br />
                                                        <b>Date & Time</b><br />
                                                        <span>{new Date(SlipDetails.approved_date).toDateString() + " at " + moment(SlipDetails.approved_time, 'h:mm:ss a').format('hh:mm A')}</span>
                                                    </td>
                                                    : null
                                        }
                                    </tr>
                                    {
                                        SlipDetails.hod_remarks
                                            ?
                                            <tr>
                                                <td></td>
                                                <td colSpan={2}>
                                                    <h6 className='font-weight-bold'>
                                                        {SlipDetails.status === 'cancelled' ? "Reason" : "Approval Remarks"}
                                                    </h6>
                                                    <pre style={{ fontFamily: 'Poppins', width: '100%', whiteSpace: 'pre-wrap' }}>{SlipDetails.hod_remarks}</pre>
                                                </td>
                                                <td>
                                                    <h6 className='font-weight-bold'>Cashier</h6>
                                                    {
                                                        SlipDetails.cashier_emp_name === null
                                                            ?
                                                            <span>-----</span>
                                                            :
                                                            <>
                                                                <span>
                                                                    <Link to={'/hr/employee/details/' + SlipDetails.cashier} className='clickable'>{SlipDetails.cashier_emp_name}</Link>
                                                                </span><br />
                                                            </>
                                                    }
                                                </td>
                                            </tr>
                                            : null
                                    }
                                </tbody>
                            </table>

                            <div className='grid'>
                                <div>
                                    {
                                        SlipDetails.receival_date && SlipDetails.other === 1
                                            ?
                                            <>
                                                <h6 className='font-weight-bold'>Signature</h6>
                                                <img src={process.env.REACT_APP_SERVER + '/assets/portal/assets/AC/' + window.location.href.split('/').pop() + '/' + SlipDetails.signature} alt="" width="100%" />
                                            </>
                                            :
                                            SlipDetails.receival_date && SlipDetails.other === 0
                                                ?
                                                <>
                                                    <h6 className='font-weight-bold'>Employee Thumb</h6>
                                                    <img src={process.env.REACT_APP_SERVER + '/assets/portal/assets/AC/' + window.location.href.split('/').pop() + '/thumbs/' + SlipDetails.emp_finger_print} alt="" width="50%" />
                                                </>
                                                : null
                                    }
                                </div>
                                <div>
                                    {
                                        SlipDetails.other === 1
                                            ?
                                            <>
                                                <h6 className='font-weight-bold'>Cash Receiver CNIC</h6>
                                                <div className='d-flex w-100' style={{ gap: '10px' }}>
                                                    <div className='w-50'>
                                                        <img src={process.env.REACT_APP_SERVER + '/assets/portal/assets/AC/' + window.location.href.split('/').pop() + '/' + SlipDetails.cnic_front} width="100%" className='rounded' alt="cashier finger print" />
                                                        <p className='font-weight-bold text-center mb-0'>CNIC Front</p>
                                                    </div>
                                                    <div className='w-50'>
                                                        <img src={process.env.REACT_APP_SERVER + '/assets/portal/assets/AC/' + window.location.href.split('/').pop() + '/' + SlipDetails.cnic_back} width="100%" className='rounded' alt="employee finger print" />
                                                        <p className='font-weight-bold text-center mb-0'>CNIC Back</p>
                                                    </div>
                                                </div>
                                            </>
                                            : null
                                    }
                                </div>
                            </div> */}
                        </>
                        :
                        <img src={loading} alt="loading..." width='50' height='50' className='d-block mx-auto' />
                }
            </div>
        </>
    )
}

const PurchaseRequisition = ({ PRequestDetails, Specifications, loadPRDetails }) => {
    useEffect(
        () => {
            if (!PRequestDetails) loadPRDetails();
        }, []
    )
    if (!PRequestDetails || !Specifications) {
        return <img src={loading} alt="loading..." width='50' height='50' className='d-block mx-auto' />;
    }
    return (
        <>
            <form className='popUps purchase_requisition_details_2'>
                <fieldset disabled>
                    <div className="flex_container mb-3">

                        <div className='mb-3'>
                            <label className="mb-0"><b>Company Name</b></label>
                            <input value={PRequestDetails.company_name} className="form-control" />
                        </div>
                        <div>
                            <label className="mb-0"><b>Delivery / Work Location</b></label>
                            <input value={PRequestDetails.location_name} className="form-control" />
                        </div>

                    </div>

                    <div className="grid_container mb-3 px-5">

                        {
                            PRequestDetails.new_purchase === 1
                                ?
                                <div className='grid_container align-items-center'>
                                    <span>New Purchase</span>
                                    <input checked={true} type="checkbox" className='ml-2' />
                                </div>
                                : null
                        }
                        {
                            PRequestDetails.repair
                                ?
                                <div className='grid_container align-items-center'>
                                    <span>Repair</span>
                                    <input checked={true} type="checkbox" className='ml-2' />
                                </div>
                                : null
                        }
                        {
                            PRequestDetails.replace_recycle
                                ?
                                <div className='grid_container align-items-center'>
                                    <span>Replacement / Recycle</span>
                                    <input checked={true} type="checkbox" className='ml-2' />
                                </div>
                                : null
                        }
                        {
                            PRequestDetails.budgeted
                                ?
                                <div className='grid_container align-items-center'>
                                    <span>Budgeted</span>
                                    <input checked={true} type="checkbox" className='ml-2' />
                                </div>
                                : null
                        }
                        {
                            PRequestDetails.not_budgeted
                                ?
                                <div className='grid_container align-items-center'>
                                    <span>Not Budgeted</span>
                                    <input checked={true} type="checkbox" className='ml-2' />
                                </div>
                                : null
                        }
                        {
                            PRequestDetails.invoice_attached
                                ?
                                <div className='grid_container align-items-center'>
                                    <span>Invoice Attached</span>
                                    <input checked={true} type="checkbox" className='ml-2' />
                                </div>
                                : null
                        }

                    </div>

                    <label className="mb-0"><b>Reason For Repair / Replacement / New Purchase</b></label>
                    <textarea className="form-control" value={PRequestDetails.reason} />

                    <br />

                    <label className="mb-1"><b>Purchase / Repair / Replacement Specifications</b></label>

                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th className='text-center'>Sr.No.</th>
                                <th className='text-center'>Description</th>
                                <th className='text-center'>Quantity</th>
                                <th className='text-center'>Estimated Cost</th>
                                <th className='text-center'>Total Cost</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                Specifications.map(
                                    (val, index) => {
                                        return (
                                            <tr key={index}>
                                                <td className='text-center'> {index + 1} </td>
                                                <td className='text-center'> {val.description} </td>
                                                <td className='text-center'> {val.quantity} </td>
                                                <td className='text-center'> Rs {val.estimated_cost.toLocaleString('en')} </td>
                                                <td className='text-center'> Rs {val.total_estimated_cost.toLocaleString('en')} </td>
                                            </tr>
                                        )
                                    }
                                )
                            }
                        </tbody>
                        <tfoot>
                            <tr>
                                <td className='text-center'></td>
                                <td className='text-center'></td>
                                <td className='text-center'></td>
                                <td className='text-center'><b>Total</b></td>
                                <td className='text-center'> Rs {PRequestDetails.total_value.toLocaleString('en')} </td>
                            </tr>
                        </tfoot>
                    </table>

                    <label className="mb-0"><b>Additional Notes</b></label>
                    <textarea className="form-control" value={PRequestDetails.note} />
                </fieldset>
            </form>
        </>
    )
}

const CommentBox = ({ data, index }) => {
    return (
        <>
            <div className='comment popUps' key={index}>
                <div className='d-flex align-items-center pb-2'>
                    <img src={process.env.REACT_APP_SERVER+'/images/employees/' + data.emp_image} className='emp_img' alt="employee" />
                    <div className='ml-2 d-flex align-items-center justify-content-between w-100'>
                        <div>
                            <b>{data.name}</b><br />
                            <span>{data.designation_name}</span>
                        </div>
                        <div className='text-right'>
                            <span>{new Date(data.comment_date).toDateString()}</span><br />
                            <span>{moment(data.comment_time, 'h:mm:ss a').format('hh:mm A')}</span>
                        </div>
                    </div>
                </div>
                <p className='mb-0 py-1'>{parse(data.body)}</p>
            </div>
        </>
    )
}

const ConfirmVRejection = ({ rejectVRequest }) => {
    return (
        <>
            <form onSubmit={rejectVRequest}>
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
            <form onSubmit={verifyRequest}>
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
                                        if (val.category === 'all') {
                                            if (val.companies.includes(parseInt(Details.company))) {
                                                option = <option value={val.sr} key={index}> {val.name} </option>
                                            }
                                        }

                                        return option;
                                    }
                                ) : null
                        }
                    </select>
                    <button className='btn submit d-block mx-auto mt-3'>Confirm</button>
                </fieldset>
            </form>
        </>
    )
}

const ConfirmApproval = ({ Details, Cashiers, approveRequest, loadCashiers }) => {
    useEffect(
        () => {
            if (Cashiers.length === 0) {
                loadCashiers();
            }
        }, []
    );
    return (
        <>
            <form onSubmit={approveRequest}>
                <h5>Confirmation</h5>
                <hr />
                <fieldset>
                    <label className="mb-0"><b>Remarks</b></label>
                    <textarea className="form-control" name="remarks" required />
                    <input disabled required className='d-none' value={JSON.stringify(Cashiers.filter(val => val.location_code === Details.location))} name="cashiers" />
                    {/* <label className="mb-0"><b>Submit To</b></label>
                    <select name="submit_to" required className="form-control mb-2">
                        <option value="">Select option</option>
                        {
                            Cashiers.filter(val => val.location_code === Details.location).map(
                                (val, index) => {
                                    return <option value={val.emp_id} key={index}>{val.name}</option>;
                                }
                            )
                        }
                    </select> */}
                    <button className='btn submit d-block mx-auto mt-3'>Confirm</button>
                </fieldset>
            </form>
        </>
    )
}

const ConfirmRejection = ({ rejectRequest }) => {
    return (
        <>
            <form onSubmit={rejectRequest}>
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
            <form onSubmit={cancelRequest}>
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

const ModalFingerPrint = ({ CNICBack, CNICFront, Other, AccessControls, CashierThumbs, Details, validateEmployee, loadThumbs, onAttachCNICFront, onAttachCNICBack, setOther }) => {

    const [CashierPassCode, setCashierPassCode] = useState();
    const [Template1, setTemplate1] = useState();
    const [Template2, setTemplate2] = useState();
    const [signature, setSignature] = useState(null);
    const [ValidCashier, setValidCashier] = useState(false);
    const key = 'real secret keys should be long and random';
    const encryptor = require('simple-encryptor')(key);
    const sigRef = useRef();
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
    // function SuccessFunc1(result) {
    //     if (result.ErrorCode == 0) {
    //         if (result != null && result.BMPBase64.length > 0) {
    //             document.getElementById('FPImage1').src = "data:image/bmp;base64," + result.BMPBase64;
    //         }
    //         setTemplate1(result.BMPBase64);
    //     } else {
    //         alert("Fingerprint Capture Error Code:  " + result.ErrorCode + ".\nDescription:  " + (result.ErrorCode) + "."); // ErrorCodeToString
    //     }
    // }
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
    const verifyEmployee = (e) => {
        e.preventDefault();
        if (Other) {
            if (signature) {
                validateEmployee(e, signature);
            } else {
                JSAlert.alert("Signature is required!!!").dismissIn(1500 * 1);
            }
        } else {
            if (Template2) {
                validateEmployee(e, signature, Template1, Template2);
            } else {
                JSAlert.alert("Fingerprint is required!!!").dismissIn(1500 * 1);
            }
        }
    }
    const handleSignatureEnd = () => {
        setSignature(sigRef.current.toDataURL());
    }
    const clearSignature = () => {
        sigRef.current.clear();
        setSignature(null);
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
                                {
                                    !Other
                                        ?
                                        <>
                                            <div className='text-center mb-3'>
                                                <img onClick={() => CallSGIFPGetData(SuccessFunc2, ErrorFunc)} id="FPImage2" src={"https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/Fingerprint_picture.svg/1413px-Fingerprint_picture.svg.png"} alt="fingerprints" />
                                            </div>
                                            <label className='mb-0'>{Details.requested_emp_name}'s Password</label>
                                            <input type='password' name="passcode" className='form-control' required />
                                        </>
                                        :
                                        <>
                                            <label className='mb-0 font-weight-bold'>Receiving Person Name</label>
                                            <input type='text' name="receiving_person" className='form-control mb-2' required />
                                            <label className='mb-0 font-weight-bold'>Receiving Person Contact</label>
                                            <input type='number' placeholder='Enter without dashes (-)' name="receiving_person_contact" className='form-control mb-2' required />
                                            <label className='mb-0 font-weight-bold'>Receiving Person CNIC Number</label>
                                            <input type='number' placeholder='Enter without dashes (-)' name="receiving_person_cnic" className='form-control mb-2' required />
                                            <label className='mb-0 font-weight-bold'>Upload CNIC <b>(Front)</b></label>
                                            <input type='file' className='form-control' onChange={onAttachCNICFront} required multiple />
                                            {
                                                CNICFront ? <img src={URL.createObjectURL(CNICFront.file)} alt="" width="100%" /> : null
                                            }
                                            <label className='mb-0 font-weight-bold'>Upload CNIC <b>(Back)</b></label>
                                            <input type='file' className='form-control' onChange={onAttachCNICBack} required multiple />
                                            {
                                                CNICBack ? <img src={URL.createObjectURL(CNICBack.file)} alt="" width="100%" /> : null
                                            }
                                            <label className='mb-0 font-weight-bold'>Receiving Person Signature</label>
                                            <SignatureCanvas penColor='blue' ref={sigRef} canvasProps={{ className: 'sigCanvas' }} onEnd={handleSignatureEnd} />
                                            <button type='button' className='btn d-block ml-auto light my-2' onClick={clearSignature}>Clear Signature</button>
                                        </>
                                }
                                <div className='d-flex align-items-center mt-3'>
                                    <input type='checkbox' checked={Other} className='form-control mr-2' onChange={() => setOther(!Other)} /> <span>Other Person</span>
                                </div>
                                <button className='btn submit d-block ml-auto mt-3' type='submit'>Release Cash</button>
                            </fieldset>
                        </form>
                        :
                        <>
                            {/* <div className='text-center mb-3'>
                            <img onClick={ () => CallSGIFPGetData(SuccessFunc1, ErrorFunc) } id="FPImage1" src={ "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/Fingerprint_picture.svg/1413px-Fingerprint_picture.svg.png" } alt="fingerprints" />
                        </div> */}
                            <label className='mb-0 font-weight-bold'>Cashier's Password</label>
                            <input type='password' className='form-control' onChange={(e) => setCashierPassCode(e.target.value)} />
                        </>
                }
            </div>
        </>
    )
}

const ModalMoneyClearance = ({ AccessControls, Details, clearRequest }) => {

    const [CashierPassCode, setCashierPassCode] = useState("");
    const [ValidCashier, setValidCashier] = useState(false);
    const key = 'real secret keys should be long and random';
    const encryptor = require('simple-encryptor')(key);

    useEffect(
        () => {
            if (CashierPassCode === encryptor.decrypt(AccessControls.emp_password)) {
                setValidCashier(true);
            }
        }, [CashierPassCode]
    )

    return (
        <>
            {
                ValidCashier
                    ?
                    <form onSubmit={clearRequest}>
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
                        <label className='mb-0'>{Details.cashier_emp_name} Pass Code</label>
                        <input type='password' className='form-control mb-3' onChange={(e) => setCashierPassCode(e.target.value)} />
                    </>
            }
        </>
    )
}