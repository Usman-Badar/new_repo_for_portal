/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react';
import './FuelRequest.css';

import JSAlert from 'js-alert';
import $ from 'jquery';
import axios from '../../../../../../../axios';
import Modal from '../../../../../../UI/Modal/Modal';
import { useSelector } from 'react-redux';
import ReactTooltip from 'react-tooltip';
import moment from 'moment';

function FuelRequest() {
    const AccessControls = useSelector( ( state ) => state.EmpAuth.EmployeeData );
    const formRef = useRef();
    const fieldsetRef = useRef();
    const btnRef = useRef();
    
    const [Requests, setRequests] = useState();
    const [Details, setDetails] = useState();
    const [New, setNew] = useState(false);
    const [Companies, setCompanies] = useState([]);
    const [AllLocations, setAllLocations] = useState([]);
    const [ ShowFilters, setShowFilters ] = useState(false);
    const [ FilterCompany, setFilterCompany ] = useState('');
    const [ FilterLocation, setFilterLocation ] = useState('');
    const [ FilterDate, setFilterDate ] = useState('');

    useEffect(
        () => {
            if ( sessionStorage.getItem('FilterCompany') && sessionStorage.getItem('FilterCompany') !== '' ) setFilterCompany(sessionStorage.getItem('FilterCompany'));
            if ( sessionStorage.getItem('FilterLocation') && sessionStorage.getItem('FilterLocation') !== '' ) setFilterLocation(sessionStorage.getItem('FilterLocation'));
            if ( sessionStorage.getItem('FilterDate') && sessionStorage.getItem('FilterDate') !== '' ) setFilterDate(sessionStorage.getItem('FilterDate'));
        }, []
    );
    useEffect(
        () => {
            if (FilterDate.length > 0) {
                loadRequests(true, FilterDate);
            }else {
                loadRequests(true);
            }
        }, [FilterDate]
    )
    const GetCompanies = (isActive) => {
        axios.get('/getallcompanies')
        .then(res => {
            if (!isActive) return;
            setCompanies(res.data);
            GetAllLocations();
        }).catch(err => console.log(err));
    }
    const GetAllLocations = () => axios.get('/getalllocations').then(res => setAllLocations(res.data)).catch(err => console.log(err));
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
            setNew(false);
            JSAlert.alert('Request has been sent', 'Success', JSAlert.Icons.Success).dismissIn(2000);
        }).catch(err => {
            console.log(err);
            JSAlert.alert('Failed To Request!!', 'Request Failed', JSAlert.Icons.Failed).dismissIn(4000);
            fieldsetRef.current.disabled = false;
            btnRef.current.innerHTML = 'Submit';
        });
    }
    const loadRequests = (isActive, date) => {
        axios.post('/fuel-managent/fuel-request-for-station/requests',
        {
            emp_id: localStorage.getItem("EmpID"), 
            access: AccessControls?.access && JSON.parse(AccessControls.access).includes(87) ? 1 : 0,
            date: date
        }).then(res => {
            if (!isActive) return;
            setRequests(res.data);
            GetCompanies(true);
        }).catch(err => console.log(err));
    }
    const loadDetails = (i) => {
        const obj = Requests[i];
        setDetails(obj);
    }
    const resetFilters = () => {
        sessionStorage.removeItem('FilterCompany');
        sessionStorage.removeItem('FilterLocation');
        sessionStorage.removeItem('FilterDate');
        setFilterCompany("");
        setFilterLocation("");
        setFilterDate("");
    }

    if (JSON.parse(AccessControls.access).includes(86) && New) {
        return (
            <div className='page'>
                <div className="page-content">
                    <div className="d-flex align-items-center justify-content-between">
                        <h3 className="heading">
                            New Request For Fuel
                            <sub>Request Fuel for Fueling Station / Point when required</sub>
                        </h3>
                        <button className="btn light" onClick={() => setNew(false)}>Back</button>
                    </div>
                    <hr />
                    <form ref={formRef} onSubmit={onRequest}>
                        <fieldset ref={fieldsetRef}>
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
                </div>
            </div>
        )
    }

    return (
        <>
            {
                Details
                ?
                <ReceivalDetails AccessControls={AccessControls} Details={Details} setDetails={setDetails} loadRequests={loadRequests} />
                :
                <div className='FuelRequest page'>
                    <div className="page-content">
                        <div className="d-flex align-items-center justify-content-between">
                            <h3 className="heading">
                                Request For Fueling Station
                                <sub>Request Fuel for Fueling Station / Point when required</sub>
                            </h3>
                            <div>
                                {JSON.parse(AccessControls.access).includes(86) && <button className="btn submit" onClick={() => setNew(true)}>New</button>}
                                <button className="btn submit px-2 ml-2 filter-emit" onClick={() => setShowFilters(!ShowFilters)} type='button'>
                                    {
                                        ShowFilters
                                            ?
                                            <>
                                                <i className="las la-times"></i>
                                            </>
                                            :
                                            <div data-tip data-for='filter'>
                                                {
                                                    FilterCompany !== '' || FilterLocation !== '' || FilterDate !== ''
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
                            </div>
                        </div>
                        {
                            ShowFilters && (
                                <>
                                    <br />
                                    <div className='filter-content popUps'>
                                        <div className='flex'>
                                            <div className='w-50'>
                                                <label className="font-weight-bold mb-0">Company</label>
                                                <select value={FilterCompany} onChange={
                                                    e => {
                                                        setFilterCompany(e.target.value);
                                                        sessionStorage.setItem('FilterCompany', e.target.value);
                                                    }
                                                } className="form-control form-control-sm mb-2">
                                                    <option value=''>Show All</option>
                                                    {Companies.map(val => <option key={val.company_name} value={val.company_name}>{val.company_name}</option>)}
                                                </select>
                                            </div>
                                            <div className='w-50'>
                                                <label className="font-weight-bold mb-0">Location</label>
                                                <select value={FilterLocation} onChange={
                                                    e => {
                                                        setFilterLocation(e.target.value);
                                                        sessionStorage.setItem('FilterLocation', e.target.value);
                                                    }
                                                } className="form-control form-control-sm mb-2">
                                                    <option value=''>Show All</option>
                                                    {AllLocations.map(val => <option key={val.location_name} value={val.location_name}>{val.location_name}</option>)}
                                                </select>
                                            </div>
                                            <div className='w-50'>
                                                <label className="font-weight-bold mb-0">Request Date</label>
                                                <input type='date' value={FilterDate} onChange={
                                                    e => {
                                                        setFilterDate(e.target.value);
                                                        sessionStorage.setItem('FilterDate', e.target.value);
                                                    }
                                                } className="form-control form-control-sm mb-2" />
                                            </div>
                                            <button className='btn green d-block ml-auto mt-2' type='button' onClick={resetFilters}>Reset All</button>
                                        </div>
                                    </div>
                                </>
                            )
                        }
                        <hr />
                        {
                            !Requests
                            ?
                            <h6 className='text-center mb-0' style={{fontFamily: "Roboto-Light"}}>
                                <b>Please Wait....</b>
                            </h6>
                            :
                            <table className="table" style={{fontFamily: 'Roboto-Light'}}>
                                <thead>
                                    <tr>
                                        <th className='border-top-0 bg-light'>#</th>
                                        <th className='border-top-0 bg-light'>Company</th>
                                        <th className='border-top-0 bg-light'>Location</th>
                                        <th className='border-top-0 bg-light'>Required Fuel (Ltr.)</th>
                                        <th className='border-top-0 bg-light'>Requested By</th>
                                        <th className='border-top-0 bg-light'>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        Requests.filter(val => {
                                            return val.company_name.includes(FilterCompany) && 
                                            val.location_name.includes(FilterLocation)
                                        }).map(
                                            ({fuel_required, submit_person, requested_at, status, company_name, location_name}, i) => (
                                                <tr key={i} className='pointer pointer-hover' onClick={() => loadDetails(i)}>
                                                    <td>{i+1}</td>
                                                    <td>{company_name}</td>
                                                    <td>{location_name}</td>
                                                    <td>{fuel_required}</td>
                                                    <td>
                                                        <b>{submit_person}</b><br />
                                                        <span>{moment(requested_at).format('DD-MM-YYYY hh:mm A')}</span>
                                                    </td>
                                                    <td><Status status={status} /></td>
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
        if (!JSON.parse(AccessControls.access).includes(87)) {
            JSAlert.alert('Access Denied!!', 'Validation Error', JSAlert.Icons.Warning).dismissIn(4000);
            return false;
        }
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
        if (!JSON.parse(AccessControls.access).includes(87)) {
            JSAlert.alert('Access Denied!!', 'Validation Error', JSAlert.Icons.Warning).dismissIn(4000);
            return false;
        }
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
                            <h6 style={{fontSize: 15}} className='text-capitalize mb-0'>Stored at the Workshop {Details.stock_at_workshop ? `(dated: ${moment(Details?.approved_at).format('DD-MM-YYYY')})` : '(Current)' }</h6>
                        </div>
                        <table className="table">
                            <tbody>
                                <tr>
                                    <td><h6 className='font-weight-bold'>Status</h6></td>
                                    <td><Status status={Details.status} /></td>
                                </tr>
                                <tr>
                                    <td><h6 className='font-weight-bold'>Fuel Required (Ltr.)</h6></td>
                                    <td>{Details.fuel_required} (Ltr.)</td>
                                </tr>
                                <tr>
                                    <td><h6 className='font-weight-bold'>Requested By</h6></td>
                                    <td>{Details.submit_person}</td>
                                </tr>
                                <tr>
                                    <td><h6 className='font-weight-bold'>Requested At</h6></td>
                                    <td>{moment(Details.requested_at).format('DD-MM-YYYY hh:mm A')}</td>
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
                                            <td>{Details.approved_at ? (moment(Details.approved_at).format('DD-MM-YYYY hh:mm A')) : '-'}</td>
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
                                            <td>{Details.approved_at ? (moment(Details.approved_at).format('DD-MM-YYYY hh:mm A')) : '-'}</td>
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