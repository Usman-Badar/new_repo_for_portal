/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react';
import './FuelRequest.css';

import JSAlert from 'js-alert';
import $ from 'jquery';
import axios from '../../../../../../../axios';
import Modal from '../../../../../../UI/Modal/Modal';
import { useSelector } from 'react-redux';

function FuelRequest() {
    const AccessControls = useSelector( ( state ) => state.EmpAuth.EmployeeData );
    const formRef = useRef();
    const fieldsetRef = useRef();
    const btnRef = useRef();
    
    const [Requests, setRequests] = useState();
    const [Details, setDetails] = useState();

    useEffect(
        () => {
            let isActive = true;
            loadRequests(isActive);
            return () => {
                isActive = false;
            }
        }, []
    );
    const onRequest = (e) => {
        e.preventDefault();
        const fuelRequired = e.target['fuelRequired'].value;
        if (typeof(parseInt(fuelRequired)) !== 'number') {
            JSAlert.alert('Invalid fuel quantity!!', 'Validation Error', JSAlert.Icons.Warning).dismissIn(4000);
            return false;
        }
        if (parseFloat(fuelRequired) < 0) {
            JSAlert.alert('Required fuel must be greater than 0!!', 'Validation Error', JSAlert.Icons.Warning).dismissIn(4000);
            return false;
        }
        fieldsetRef.current.disabled = true;
        btnRef.current.innerHTML = 'Please Wait...';
        axios.post(
            '/fuel-managent/fuel-request-for-station/new',
            {
                fuelRequired: fuelRequired,
                requested_by: localStorage.getItem('EmpID')
            }
        ).then(() => {
            fieldsetRef.current.disabled = false;
            btnRef.current.innerHTML = 'Submit';
            formRef.current.reset();
            loadRequests(true);
            JSAlert.alert('Request has been sent', 'Success', JSAlert.Icons.Success).dismissIn(2000);
        }).catch(err => {
            console.log(err);
            JSAlert.alert('Failed To Request!!', 'Request Failed', JSAlert.Icons.Failed).dismissIn(4000);
            fieldsetRef.current.disabled = false;
            btnRef.current.innerHTML = 'Submit';
        });
    }
    const loadRequests = (isActive) => {
        axios.post('/fuel-managent/fuel-request-for-station/requests',
        {
            emp_id: localStorage.getItem("EmpID"), 
            access: AccessControls?.access && JSON.parse(AccessControls.access).includes(87) ? 1 : 0
        }).then(res => {
            if (!isActive) return;
            setRequests(res.data);
        }).catch(err => console.log(err));
    }
    const loadDetails = (i) => {
        const obj = Requests[i];
        setDetails(obj);
    }

    return (
        <>
            {
                Details
                ?
                <ReceivalDetails AccessControls={AccessControls} Details={Details} setDetails={setDetails} loadRequests={loadRequests} />
                :
                <div className='FuelRequest page'>
                    <form className="page-content mb-3" ref={formRef} onSubmit={onRequest}>
                        <fieldset ref={fieldsetRef}>
                            <h6><b>New Fuel Request</b></h6>
                            <hr />
                            <label className='mb-0'>
                                <b>Fuel (in Ltr.)</b>
                            </label>
                            <input type='number' min={1} defaultValue={1} className="form-control" name='fuelRequired' required />

                            <div className='d-flex justify-content-end align-items-center mt-3'>
                                <button ref={btnRef} className="btn submit ml-3" type='submit'>
                                    Submit
                                </button>
                            </div>
                        </fieldset>
                    </form>
                    <div className="page-content">
                        <h3 className="heading">
                            Fuel Management Module
                            <sub>Request Fuel for Fueling Station / Point when required</sub>
                        </h3>
                        <hr />
                        {
                            !Requests
                            ?
                            <h6 className='text-center'>Please Wait....</h6>
                            :
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th className='border-top-0'>#</th>
                                        <th className='border-top-0'>Required Fuel (Ltr.)</th>
                                        <th className='border-top-0'>Requested By</th>
                                        <th className='border-top-0'>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        Requests.map(
                                            ({fuel_required, submit_person, requested_at, status}, i) => (
                                                <tr key={i} className='pointer pointer-hover' onClick={() => loadDetails(i)}>
                                                    <td className='border-top-0'>{i+1}</td>
                                                    <td className='border-top-0'>{fuel_required}</td>
                                                    <td className='border-top-0'>
                                                        <b>{submit_person}</b><br />
                                                        <span>{new Date(requested_at).toDateString()}</span><br />
                                                        <span>{new Date(requested_at).toLocaleTimeString()}</span>
                                                    </td>
                                                    <td className='border-top-0'><Status status={status} /></td>
                                                </tr>
                                            )
                                        )
                                    }
                                </tbody>
                            </table>
                        }
                    </div>
                </div>
            }
        </>
    )
}

export default FuelRequest

const Status = ({ status }) => {
    return (
        <div className='d-flex align-items-center'>
            <div
                className={
                    "dot mr-1 "
                    +
                    (
                        status === 'Approved'
                            ?
                            "bg-success"
                            :
                            status === 'Replied' || status === 'Closed'
                                ?
                                "bg-primary"
                                :
                                status === 'Waiting for approval'
                                    ?
                                    "bg-warning"
                                    :
                                    "bg-danger"
                    )
                }
            ></div>
            <div
                className={
                    "text-capitalize "
                    +
                    (
                        status === 'Approved'
                            ?
                            "text-success"
                            :
                            status === 'Replied' || status === 'Closed'
                                ?
                                "text-primary"
                                :
                                status === 'Waiting for approval'
                                    ?
                                    "text-warning"
                                    :
                                    "text-danger"
                    )
                }
                style={{ fontSize: 12 }}
            >
                {status.split('_').join(' ')}
            </div>
        </div>
    )
}

const ReceivalDetails = ({ AccessControls, Details, setDetails, loadRequests }) => {
    const [modal, setModal] = useState();

    const reject = () => {
        setModal(
            <>
                <h6><b>Confirm to reject this request?</b></h6>
                <hr />
                <button id='confirm' className="btn d-block ml-auto cancle mt-3" onClick={() => rejectRequest()}>Confirm</button>
            </>
        )
    }
    const approve = () => {
        setModal(
            <>
                <h6><b>Confirm to approve this request?</b></h6>
                <hr />
                <button id='confirm' className="btn d-block ml-auto submit mt-3" onClick={() => approveRequest()}>Confirm</button>
            </>
        )
    }
    const rejectRequest = () => {
        $('#confirm').prop('disabled', true);
        axios.post('/fuel-managent/fuel-request-for-station/reject', {id: Details?.id, rejected_by: localStorage.getItem('EmpID')}).then(() => {
            setDetails();
            loadRequests(true);
            JSAlert.alert('Request has been rejected!', 'Success', JSAlert.Icons.Warning).dismissIn(4000);
        }).catch(err => {
            console.log(err);
            $('#confirm').prop('disabled', false);
        });
    }
    const approveRequest = () => {
        $('#confirm').prop('disabled', true);
        axios.post('/fuel-managent/fuel-request-for-station/approve', {id: Details?.id, quantity: Details?.fuel_required, emp_id: Details?.requested_by, approved_by: localStorage.getItem('EmpID'), requested_at: Details?.requested_at}).then((res) => {
            if (res.data === 'limit exceed') {
                $('#confirm').prop('disabled', false);
                JSAlert.alert('Insufficient quantity at workshop!', 'Warning', JSAlert.Icons.Warning).dismissIn(4000);
                return;
            }
            setDetails();
            loadRequests(true);
            JSAlert.alert('Request has been aprroved!', 'Success', JSAlert.Icons.Success).dismissIn(4000);
        }).catch(err => {
            console.log(err);
            $('#confirm').prop('disabled', false);
        });
    }
    return (
        <>
            {modal && <Modal show={true} Hide={() => setModal()} content={modal} />}
            <div className='page'>
                <div className="page-content">
                    <div className="d-flex align-items-center justify-content-between">
                        <h3 className="heading">
                            Fuel Requisition Details
                            <sub>Request Fuel for Fueling Station / Point when required</sub>
                        </h3>
                        <div>
                            {
                                Details.status === 'Waiting for approval' &&
                                JSON.parse(AccessControls.access).includes(87) 
                                // &&
                                // parseInt(Details.approved_by) === parseInt(localStorage.getItem('EmpID'))
                                ?
                                <>
                                    <button className="btn submit" onClick={approve}>Approve</button>
                                    <button className="btn cancle ml-2" onClick={reject}>Reject</button>
                                </>
                                :null
                            }
                            <button className="btn light ml-2" onClick={() => setDetails()}>Back</button>
                        </div>
                    </div>
                    <hr />
                    <div className="w-50 mx-auto" style={{fontFamily: "Roboto-Light"}}>
                        <div className='main-banner'>
                            <h1 className='mb-0' style={{fontSize: 35}}>
                                <span className='font-weight-bold'>{parseFloat(Details.stock_at_workshop ? Details.stock_at_workshop : Details.total_stock).toFixed(2)}<small className='text-success' style={{ fontSize: 16 }}>Ltr</small></span>
                            </h1>
                            <h6 style={{fontSize: 15}} className='text-capitalize mb-0'>Stored at the Workshop {Details.stock_at_workshop ? `(dated: ${new Date(Details?.approved_at).toDateString()})` : '(Current)' }</h6>
                        </div>
                        <table className="table">
                            <tbody>
                                <tr>
                                    <td><h6 className='font-weight-bold'>Status</h6></td>
                                    <td><Status status={Details.status} /></td>
                                </tr>
                                <tr>
                                    <td><h6 className='font-weight-bold'>Fuel Required (Ltr.)</h6></td>
                                    <td>{Details.fuel_required}ltr</td>
                                </tr>
                                <tr>
                                    <td><h6 className='font-weight-bold'>Requested By</h6></td>
                                    <td>{Details.submit_person}</td>
                                </tr>
                                <tr>
                                    <td><h6 className='font-weight-bold'>Requested At</h6></td>
                                    <td>{new Date(Details.requested_at).toDateString()} at {new Date(Details.requested_at).toLocaleTimeString().substring(0,8)}</td>
                                </tr>
                                {
                                    Details.status === 'Rejected'
                                    ?
                                    <>
                                        <tr>
                                            <td><h6 className='font-weight-bold'>Rejected By</h6></td>
                                            <td>{Details.approval_person && Details.approval_person}</td>
                                        </tr>
                                        <tr>
                                            <td><h6 className='font-weight-bold'>Rejected At</h6></td>
                                            <td>{Details.approved_at ? (new Date(Details.approved_at).toDateString() + ' at ' + new Date(Details.approved_at).toLocaleTimeString().substring(0,8)) : '-'}</td>
                                        </tr>
                                    </>
                                    :
                                    <>
                                        <tr>
                                            <td><h6 className='font-weight-bold'>{Details.approved_at ? 'Approved By' : 'Submitted To'}</h6></td>
                                            <td>{Details.approval_person && Details.approval_person}</td>
                                        </tr>
                                        <tr>
                                            <td><h6 className='font-weight-bold'>Approved At</h6></td>
                                            <td>{Details.approved_at ? (new Date(Details.approved_at).toDateString() + ' at ' + new Date(Details.approved_at).toLocaleTimeString().substring(0,8)) : '-'}</td>
                                        </tr>
                                    </>
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    )
}