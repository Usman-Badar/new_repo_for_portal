/* eslint-disable eqeqeq */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react';
import './FuelReceivedForm.css';
import JSAlert from 'js-alert';
import $ from 'jquery';
import axios from '../../../../../../../axios';
import Modal from '../../../../../../UI/Modal/Modal';
import { useSelector } from 'react-redux';
import ReactTooltip from 'react-tooltip';
import moment from 'moment';

function FuelRecievedFrom() {
    const AccessControls = useSelector( ( state ) => state.EmpAuth.EmployeeData );
    const companyRef = useRef();
    const locationRef = useRef();
    const supplierRef = useRef();
    const dateRef = useRef();
    const fuelRef = useRef();
    const btnRef = useRef();
    const formRef = useRef();
    const fieldsetRef = useRef();
    const [Companies, setCompanies] = useState([]);
    const [Locations, setLocations] = useState([]);
    const [AllLocations, setAllLocations] = useState([]);
    const [Requests, setRequests] = useState();
    const [New, setNew] = useState(false);
    const [Details, setDetails] = useState();
    const [ ShowFilters, setShowFilters ] = useState(false);
    const [ FilterCompany, setFilterCompany ] = useState('');
    const [ FilterLocation, setFilterLocation ] = useState('');
    const [ FilterSupplier, setFilterSupplier ] = useState('');
    const [ FilterReceivingDate, setFilterReceivingDate ] = useState('');

    useEffect(
        () => {
            let isActive = true;
            GetCompanies(isActive);
            return () => {
                isActive = false;
            }
        }, []
    );
    useEffect(
        () => {
            let isActive = true;
            loadRequests(isActive);
            return () => {
                isActive = false;
            }
        }, []
    );
    useEffect(
        () => {
            if ( sessionStorage.getItem('FilterCompany') && sessionStorage.getItem('FilterCompany') !== '' ) setFilterCompany(sessionStorage.getItem('FilterCompany'));
            if ( sessionStorage.getItem('FilterLocation') && sessionStorage.getItem('FilterLocation') !== '' ) setFilterLocation(sessionStorage.getItem('FilterLocation'));
            if ( sessionStorage.getItem('FilterSupplier') && sessionStorage.getItem('FilterSupplier') !== '' ) setFilterSupplier(sessionStorage.getItem('FilterSupplier'));
            if ( sessionStorage.getItem('FilterReceivingDate') && sessionStorage.getItem('FilterReceivingDate') !== '' ) setFilterReceivingDate(sessionStorage.getItem('FilterReceivingDate'));
        }, []
    );
    const GetCompanies = (isActive) => {
        axios.get('/getallcompanies')
        .then(res => {
            if (!isActive) return;
            setCompanies(res.data);
            GetAllLocations();
        }).catch(err => console.log(err));
    }
    const GetLocations = (value) => {
        setLocations([]);
        axios.post('/getcompanylocations', {company_code: value}).then(
            res => {
                setLocations(res.data);
            }
        ).catch(
            err => {
                console.log(err);
            }
        )
    }
    const GetAllLocations = () => axios.get('/getalllocations').then(res => setAllLocations(res.data)).catch(err => console.log(err));
    const onSubmit = (e) => {
        e.preventDefault();
        if (companyRef.current.value.trim().length === 0) {
            JSAlert.alert('Company is required!!', 'Validation Error', JSAlert.Icons.Warning).dismissIn(4000);
            return false;
        }else if (locationRef.current.value.trim().length === 0) {
            JSAlert.alert('Location is required!!', 'Validation Error', JSAlert.Icons.Warning).dismissIn(4000);
            return false;
        }else if (supplierRef.current.value.trim().length === 0) {
            JSAlert.alert('Supplier is required!!', 'Validation Error', JSAlert.Icons.Warning).dismissIn(4000);
            return false;
        }else if (dateRef.current.value.trim().length === 0) {
            JSAlert.alert('Date is required!!', 'Validation Error', JSAlert.Icons.Warning).dismissIn(4000);
            return false;
        }else if (isNaN(parseInt(fuelRef.current.value))) {
            JSAlert.alert('Invalid fuel quantity!!', 'Validation Error', JSAlert.Icons.Warning).dismissIn(4000);
            return false;
        }else if (parseFloat(fuelRef.current.value) <= 0) {
            JSAlert.alert('Fuel quantity must be greater than 0!!', 'Validation Error', JSAlert.Icons.Warning).dismissIn(4000);
            return false;
        }else if (!isValidDate(dateRef)) {
            JSAlert.alert('Date should be valid and must not be greater than the current date!!', 'Validation Error', JSAlert.Icons.Warning).dismissIn(4000);
            return false;
        }

        fieldsetRef.current.disabled = true;
        btnRef.current.innerHTML = 'Please Wait...';
        axios.post(
            '/fuel-managent/fuel-receival-for-workshop',
            {
                company_code: companyRef.current.value,
                location_code: locationRef.current.value,
                supplier: supplierRef.current.value,
                date: dateRef.current.value,
                fuel: fuelRef.current.value,
                emp_id: localStorage.getItem('EmpID')
            }
        ).then(() => {
            loadRequests(true);
            fieldsetRef.current.disabled = false;
            btnRef.current.innerHTML = 'Submit';
            formRef.current.reset();
            setNew(false);
            
            JSAlert.alert('Fuel receival confirmed', 'Success', JSAlert.Icons.Success).dismissIn(2000);
        }).catch(err => {
            console.log(err);
            JSAlert.alert('Failed To complete!!', 'Request Failed', JSAlert.Icons.Failed).dismissIn(4000);
            fieldsetRef.current.disabled = false;
            btnRef.current.innerHTML = 'Submit';
        });
    }
    const loadRequests = (isActive) => {
        axios.post('/fuel-managent/fuel-receival-for-workshop/requests', 
        {
            emp_id: localStorage.getItem("EmpID"), 
            access: AccessControls?.access && JSON.parse(AccessControls.access).includes(85) ? 1 : 0
        }).then(res => {
            if (!isActive) return;
            setRequests(res.data);
        }).catch(err => console.log(err));
    }
    const loadDetails = (i) => {
        const obj = Requests[i];
        setDetails(obj);
    }
    function isValidDate(d) {
        // const date1 = moment(d, 'DD-MM-YYYY').valueOf();
        // const date2 = moment(new Date(), 'DD-MM-YYYY').valueOf();
        
        // if (date1 > date2) {
        //     return false;
        // }
        return true;
    }
    const resetFilters = () => {
        sessionStorage.removeItem('FilterCompany');
        sessionStorage.removeItem('FilterLocation');
        sessionStorage.removeItem('FilterSupplier');
        sessionStorage.removeItem('FilterReceivingDate');
        setFilterCompany("");
        setFilterLocation("");
        setFilterSupplier("");
        setFilterReceivingDate("");
    }

    if (!AccessControls) {
        return <></>
    }

    if (New) {
        return (
            <div className='page'>
                <form className='page-content' ref={formRef} onSubmit={onSubmit}>
                    <h3 className="heading">
                        Fuel Received Entry
                        <sub>For Workshop</sub>
                    </h3>
                    <hr />
                    <fieldset ref={fieldsetRef}>
                        <div className="d-flex mb-2" style={{ gap: '20px' }}>
                            <div className='w-50'>
                                <label className='mb-0'>
                                    <b>Company</b>
                                </label>
                                <select className="form-control" ref={companyRef} onChange={(e) => GetLocations(e.target.value)} required>
                                    <option value=''>Select the option</option>
                                    {
                                        Companies.map(
                                            val => {

                                                return (
                                                    <option
                                                        key={val.company_code}
                                                        value={val.company_code}
                                                    // selected={details && details.company_code == val.company_code ? true : false}
                                                    > {val.company_name} </option>
                                                )

                                            }
                                        )
                                    }
                                </select>
                            </div>
                            <div className='w-50'>
                                <label className='mb-0'>
                                    <b>Location</b>
                                </label>
                                <select className="form-control" ref={locationRef} required>
                                    <option value=''>Select the option</option>
                                    {
                                        Locations.map(
                                            val => {

                                                return (
                                                    <option
                                                        key={val.location_code}
                                                        value={val.location_code}
                                                    // selected={details && details.location_code == val.location_code ? true : false}
                                                    > {val.location_name} </option>
                                                );

                                            }
                                        )
                                    }
                                </select>
                            </div>
                        </div>
                        <div className="d-flex mb-2" style={{ gap: '20px' }}>
                            <div className='w-50'>
                                <label className='mb-0'>
                                    <b>Supplier</b>
                                </label>
                                <input type="text" className="form-control" ref={supplierRef} required />
                            </div>
                            <div className='w-50'>
                                <label className='mb-0'>
                                    <b>Date</b>
                                </label>
                                <input type="date" max={new Date().toISOString().slice(0, 10).replace('T', ' ')} className="form-control" ref={dateRef} required />
                            </div>
                        </div>

                        <div className="mb-3">
                            <label className='mb-0'>
                                <b>Fuel (Ltr.)</b>
                            </label>
                            <input type='number' min={1} className="form-control" ref={fuelRef} required />
                        </div>

                        <div className='d-flex justify-content-end align-items-center'>
                            <button className="btn light" type="button" onClick={() => setNew(false)}>Cancel</button>
                            <button className="btn ml-3 submit" type='submit' ref={btnRef}>
                                Submit
                            </button>
                        </div>
                    </fieldset>
                </form>
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
                <div className='FuelRecievedFrom page'>
                    <div className="page-content">
                        <div className="d-flex align-items-center justify-content-between">
                            <h3 className="heading">
                                Fuel Received At Workshop
                                <sub>Fuel Received for QFS Workshop from Supplier</sub>
                            </h3>
                            <div>
                                {JSON.parse(AccessControls.access).includes(84) && <button className="btn submit" onClick={() => setNew(true)}>New</button>}
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
                                                FilterCompany !== '' || FilterLocation !== '' || FilterSupplier !== '' || FilterReceivingDate !== ''
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
                                                <label className="font-weight-bold mb-0">Supplier</label>
                                                <input value={FilterSupplier} onChange={
                                                    e => {
                                                        setFilterSupplier(e.target.value);
                                                        sessionStorage.setItem('FilterSupplier', e.target.value);
                                                    }
                                                } className="form-control form-control-sm mb-2" />
                                            </div>
                                            <div className='w-50'>
                                                <label className="font-weight-bold mb-0">Receiving Date</label>
                                                <input value={FilterReceivingDate} type='date' onChange={
                                                    e => {
                                                        setFilterReceivingDate(e.target.value);
                                                        sessionStorage.setItem('FilterReceivingDate', e.target.value);
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
                            <h6 className='text-center'>Please Wait....</h6>
                            :
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th className='border-top-0'>#</th>
                                        <th className='border-top-0'>Company</th>
                                        <th className='border-top-0'>Location</th>
                                        <th className='border-top-0'>Supplier</th>
                                        <th className='border-top-0'>Received Fuel (Ltr.)</th>
                                        <th className='border-top-0'>Receiving Date</th>
                                        <th className='border-top-0'>Submitted By</th>
                                        <th className='border-top-0'>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        Requests.filter(val => {
                                            return val.company_name.includes(FilterCompany) && 
                                            val.location_name.includes(FilterLocation) &&
                                            val.supplier.toLowerCase().includes(FilterSupplier.toLowerCase()) &&
                                            moment(val.receival_date).format('YYYY-MM-DD').includes(FilterReceivingDate)
                                        }).map(
                                            ({company_name, location_name, supplier, fuel_received, receival_date, submit_person, submitted_at, status}, i) => (
                                                <tr key={i} className='pointer pointer-hover' onClick={() => loadDetails(i)}>
                                                    <td className='border-top-0'>{i+1}</td>
                                                    <td className='border-top-0'>{company_name}</td>
                                                    <td className='border-top-0'>{location_name}</td>
                                                    <td className='border-top-0'>{supplier}</td>
                                                    <td className='border-top-0'>{fuel_received}</td>
                                                    <td className='border-top-0'>{new Date(receival_date).toDateString()}</td>
                                                    <td className='border-top-0'>
                                                        <b>{submit_person}</b><br />
                                                        <span>{new Date(submitted_at).toDateString()}</span><br />
                                                        <span>{new Date(submitted_at).toLocaleTimeString()}</span>
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

export default FuelRecievedFrom;

const Status = ({ status }) => {
    return (
        <h6 className='d-flex align-items-center'>
            <div
                className={
                    "dot mr-1 "
                    +
                    (
                        status === 'Verified'
                            ?
                            "bg-success"
                            :
                            status === 'Replied' || status === 'Closed'
                                ?
                                "bg-primary"
                                :
                                status === 'Waiting for verification'
                                    ?
                                    "bg-warning"
                                    :
                                    "bg-danger"
                    )
                }
            ></div>
            <h6
                className={
                    "text-capitalize mb-0 "
                    +
                    (
                        status === 'Verified'
                            ?
                            "text-success"
                            :
                            status === 'Replied' || status === 'Closed'
                                ?
                                "text-primary"
                                :
                                status === 'Waiting for verification'
                                    ?
                                    "text-warning"
                                    :
                                    "text-danger"
                    )
                }
                style={{ fontSize: 12 }}
            >
                {status.split('_').join(' ')}
            </h6>
        </h6>
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
        axios.post('/fuel-managent/fuel-receival-for-workshop/reject', {id: Details?.id, emp_id: Details.submitted_by, verifier: localStorage.getItem('EmpID')}).then(() => {
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
        axios.post('/fuel-managent/fuel-receival-for-workshop/approve', {id: Details?.id, fuel_received: Details.fuel_received, emp_id: Details.submitted_by, verifier: localStorage.getItem('EmpID'), received_at: Details.receival_date}).then((res) => {
            console.log(res)
            setDetails();
            loadRequests(true);
            JSAlert.alert('Request has been verified!', 'Success', JSAlert.Icons.Success).dismissIn(4000);
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
                            Fuel Receival Details
                            <sub>Fuel Receival from Supplier details</sub>
                        </h3>
                        <div>
                            {
                                Details.status === 'Waiting for verification' && 
                                JSON.parse(AccessControls.access).includes(85) 
                                // &&
                                // parseInt(Details.verified_by) === parseInt(localStorage.getItem('EmpID'))
                                ?
                                <>
                                    <button className="btn submit" onClick={approve}>Verify</button>
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
                                <span className='font-weight-bold'>{parseFloat(Details?.stock_at_workshop ? Details?.stock_at_workshop : Details?.total_stock).toFixed(2)}<small className='text-success' style={{ fontSize: 16 }}>Ltr</small></span>
                            </h1>
                            <h6 style={{fontSize: 15}} className='text-capitalize mb-0'>Stored at the Workshop {Details?.stock_at_workshop ? `(dated: ${new Date(Details?.verified_at).toDateString()})` : '(Current)' }</h6>
                        </div>
                        <table className="table">
                            <tbody>
                                <tr>
                                    <td><h6 className='font-weight-bold'>Status</h6></td>
                                    <td><Status status={Details.status} /></td>
                                </tr>
                                <tr>
                                    <td><h6 className='font-weight-bold'>Company</h6></td>
                                    <td>{Details.company_name}</td>
                                </tr>
                                <tr>
                                    <td><h6 className='font-weight-bold'>Location</h6></td>
                                    <td>{Details.location_name}</td>
                                </tr>
                                <tr>
                                    <td><h6 className='font-weight-bold'>Supplier</h6></td>
                                    <td>{Details.supplier}</td>
                                </tr>
                                <tr>
                                    <td><h6 className='font-weight-bold'>Fuel Received (Ltr.)</h6></td>
                                    <td>{Details.fuel_received}</td>
                                </tr>
                                <tr>
                                    <td><h6 className='font-weight-bold'>Received At</h6></td>
                                    <td>{new Date(Details.receival_date).toDateString()}</td>
                                </tr>
                                <tr>
                                    <td><h6 className='font-weight-bold'>Entered By</h6></td>
                                    <td>{Details.submit_person}</td>
                                </tr>
                                <tr>
                                    <td><h6 className='font-weight-bold'>Entered At</h6></td>
                                    <td>{new Date(Details.submitted_at).toDateString()} at {new Date(Details.submitted_at).toLocaleTimeString().substring(0,8)}</td>
                                </tr>
                                {
                                    Details.status === 'Rejected'
                                    ?
                                    <>
                                        <tr>
                                            <td><h6 className='font-weight-bold'>Rejected By</h6></td>
                                            <td>{Details.verifier_person && Details.verifier_person}</td>
                                        </tr>
                                        <tr>
                                            <td><h6 className='font-weight-bold'>Rejected At</h6></td>
                                            <td>{Details.verified_at ? (new Date(Details.verified_at).toDateString() + ' at ' + new Date(Details.verified_at).toLocaleTimeString().substring(0,8)) : '-'}</td>
                                        </tr>
                                    </>
                                    :
                                    <>
                                        <tr>
                                            <td><h6 className='font-weight-bold'>{Details.verified_at ? 'Verified By' : 'Submitted To'}</h6></td>
                                            <td>{Details.verifier_person && Details.verifier_person}</td>
                                        </tr>
                                        <tr>
                                            <td><h6 className='font-weight-bold'>Verified At</h6></td>
                                            <td>{Details.verified_at ? (new Date(Details.verified_at).toDateString() + ' at ' + new Date(Details.verified_at).toLocaleTimeString().substring(0,8)) : '-'}</td>
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