/* eslint-disable eqeqeq */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react';
import './EquipmentFuelEntry.css';
import JSAlert from 'js-alert';
import $ from 'jquery';
import axios from '../../../../../../../axios';
import Modal from '../../../../../../UI/Modal/Modal';
import { useSelector } from 'react-redux';
import moment from 'moment';

function EquipmentFuelEntry() {
    const AccessControls = useSelector( ( state ) => state.EmpAuth.EmployeeData );
    const typeRef = useRef();
    const numberRef = useRef();
    const meterRef = useRef();
    const tripBasedRef = useRef();
    const dateRef = useRef();
    const fuelRef = useRef();
    const btnRef = useRef();
    const tripListRef = useRef();
    const formRef = useRef();
    const fieldsetRef = useRef();
    const [Equipments, setEquipments] = useState([]);
    const [EquipmentNumbers, setEquipmentNumbers] = useState([]);
    const [Requests, setRequests] = useState();
    const [New, setNew] = useState(false);
    const [Details, setDetails] = useState();
    const [tripBased, setTripBased] = useState(0);
    const [TripEntries, setTripEntries] = useState([]);
    const [SelectedTrips, setSelectedTrips] = useState([]);

    useEffect(
        () => {
            let isActive = true;
            GetEquipments(isActive);
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
    const GetEquipments = (isActive) => {
        axios.get('/fuel-managent/equipment-types')
        .then(res => {
            if (!isActive) return;
            setEquipments(res.data);
        }).catch(err => console.log(err));
    }
    const GetEquipmentNumbers = (value) => {
        setEquipmentNumbers([]);
        axios.post('/fuel-managent/equipment-numbers', {type_id: value}).then(
            res => {
                setEquipmentNumbers(res.data);
            }
        ).catch(
            err => {
                console.log(err);
            }
        )
    }
    const GetTripEntries = (value) => {
        setTripEntries([]);
        axios.post('/fuel-managent/trip-entries/equipment-numbers', {number: value}).then(
            res => {
                setTripEntries(res.data);
                setSelectedTrips([]);
            }
        ).catch(
            err => {
                console.log(err);
            }
        )
    }
    const addTrips = (value) => {
        const arr = SelectedTrips.slice();
        arr.push(JSON.parse(value));
        setSelectedTrips(arr);
        tripListRef.current.value = "";    
    }
    const delEntry = (index) => {
        const arr = SelectedTrips.filter((val, i) => {
            return i !== index;
        });
        setSelectedTrips(arr);
    }
    const onSubmit = (e) => {
        e.preventDefault();
        if (typeRef.current.value.trim().length === 0) {
            JSAlert.alert('Equipment is required!!', 'Validation Error', JSAlert.Icons.Warning).dismissIn(4000);
            return false;
        }else if (numberRef.current.value.trim().length === 0) {
            JSAlert.alert('Equipment Number is required!!', 'Validation Error', JSAlert.Icons.Warning).dismissIn(4000);
            return false;
        }else if (meterRef.current.value.trim().length === 0) {
            JSAlert.alert('Hrs. meter reading is required!!', 'Validation Error', JSAlert.Icons.Warning).dismissIn(4000);
            return false;
        }else if (parseInt(tripBasedRef.current.value) === 0 && isNaN(parseInt(fuelRef.current.value))) {
            JSAlert.alert('Invalid fuel quantity!!', 'Validation Error', JSAlert.Icons.Warning).dismissIn(4000);
            return false;
        }else if (parseInt(tripBasedRef.current.value) === 0 && parseFloat(fuelRef.current.value) <= 0) {
            JSAlert.alert('Fuel quantity must be greater than 0!!', 'Validation Error', JSAlert.Icons.Warning).dismissIn(4000);
            return false;
        }else if (parseInt(tripBasedRef.current.value) === 1 && SelectedTrips.length === 0) {
            JSAlert.alert('At least one route should be selected!!', 'Validation Error', JSAlert.Icons.Warning).dismissIn(4000);
            return false;
        }else if (parseInt(tripBasedRef.current.value) === 1 && TripEntries.length === 0) {
            JSAlert.alert('At least one trip should be selected!!', 'Validation Error', JSAlert.Icons.Warning).dismissIn(4000);
            return false;
        }

        fieldsetRef.current.disabled = true;
        btnRef.current.innerHTML = 'Please Wait...';
        axios.post(
            '/fuel-managent/fuel-issue-for-equipemnt/new',
            {
                type: typeRef.current.value,
                number: numberRef.current.value,
                meter: meterRef.current.value,
                trips: JSON.stringify(SelectedTrips),
                date:  dateRef.current.disabled ? '' : dateRef.current.value,
                fuel: parseInt(tripBasedRef.current.value) === 0 ? fuelRef.current.value : parseFloat(totalFuel),
                emp_id: localStorage.getItem('EmpID'),
                trip_based: parseInt(tripBasedRef.current.value)
            }
        ).then(() => {
            fieldsetRef.current.disabled = false;
            btnRef.current.innerHTML = 'Submit';
            formRef.current.reset();

            setTripBased(0);
            setTripEntries([]);
            setSelectedTrips([]);
            setEquipmentNumbers([]);

            setNew(false);
            loadRequests(true);
            JSAlert.alert('Fuel issue request has been submitted', 'Success', JSAlert.Icons.Success).dismissIn(2000);
        }).catch(err => {
            console.log(err);
            JSAlert.alert('Failed To complete!!', 'Request Failed', JSAlert.Icons.Failed).dismissIn(4000);
            fieldsetRef.current.disabled = false;
            btnRef.current.innerHTML = 'Submit';
        });
    }
    const loadRequests = (isActive) => {
        axios.post('/fuel-managent/fuel-issue-for-equipemnt/requests', 
        {
            emp_id: localStorage.getItem("EmpID"), 
            access: AccessControls?.access && JSON.parse(AccessControls.access).includes(92) ? 1 : 0
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

    if (!AccessControls) {
        return <></>
    }

    let totalFuel = 0;
    SelectedTrips.forEach(val => {
        totalFuel = totalFuel + (val.fuel_to_issue ? val.fuel_to_issue : 0);
    })

    if (JSON.parse(AccessControls.access).includes(91) && New) {
        return (
            <div className='page'>
                <form className='page-content' ref={formRef} onSubmit={onSubmit}>
                    <h3 className="heading">
                        Issue Fuel to Equipments
                        <sub>Equipment's Fuel Entry</sub>
                    </h3>
                    <hr />
                    <fieldset ref={fieldsetRef}>
                        <div className="d-flex mb-2" style={{ gap: '20px' }}>
                            <div className='w-50'>
                                <label className='mb-0'>
                                    <b>Equipment Type</b>
                                </label>
                                <select onChange={(e) => GetEquipmentNumbers(e.target.value)} className="form-control" ref={typeRef} required>
                                    <option value=''>Select the option</option>
                                    {
                                        Equipments.map(
                                            ({ id, equipment_type }) => {
                                                return <option value={id}>{equipment_type}</option>
                                            }
                                        )
                                    }
                                </select>
                            </div>
                            <div className='w-50'>
                                <label className='mb-0'>
                                    <b>Equipment Number</b>
                                </label>
                                <select onChange={(e) => GetTripEntries(e.target.value)} className="form-control" ref={numberRef} required>
                                    <option value=''>Select the option</option>
                                    {
                                        EquipmentNumbers.map(
                                            val => {

                                                return (
                                                    <option
                                                        key={val.id}
                                                        value={val.id}
                                                    // selected={details && details.location_code == val.location_code ? true : false}
                                                    > {val.equipment_number}</option>
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
                                    <b>Hrs. Meter Reading</b>
                                </label>
                                <input type="number" className="form-control" ref={meterRef} required />
                            </div>
                            <div className='w-50'>
                                <label className='mb-0'>
                                    <b>Trip Based Or Not</b>
                                </label>
                                <select className="form-control" ref={tripBasedRef} onChange={(e) => setTripBased(e.target.value)} required>
                                    <option value="0">Other Than Trip Based</option>
                                    <option value="1">Trip Based</option>
                                </select>
                            </div>
                        </div>
                        <table className="table table-sm mb-0" style={{fontFamily: 'Roboto-Light'}}>
                            {
                                SelectedTrips.length > 0 && (
                                    <tr>
                                        <th>Trip</th>
                                        <th>Fuel</th>
                                    </tr>
                                )
                            }
                            {
                                SelectedTrips.length > 0 && SelectedTrips.map((val, i) => {
                                    return (
                                        <tr key={val.id}>
                                            <td>{val.trip_from} to {val.trip_to}</td>
                                            <td>
                                                <div className='d-flex justify-content-between'>
                                                    <span>{val.fuel_to_issue}ltr</span>
                                                    <i onClick={() => delEntry(i)} className="lar la-trash-alt pointer" style={{ fontSize: 20 }}></i>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                            {
                                SelectedTrips.length > 0 && (
                                    <tr>
                                        <th>Total</th>
                                        <th>{totalFuel}ltr</th>
                                    </tr>
                                )
                            }
                        </table>
                        {
                            parseInt(tripBased) === 0
                            ?
                            <div className="mb-3">
                                <label className='mb-0'>
                                    <b>Fuel (Ltr.)</b>
                                </label>
                                <input type='number' min={1} className="form-control" ref={fuelRef} required />
                            </div>
                            :
                            <div className="mb-3">
                                <label className='mb-0'>
                                    <b>Select Trip</b>
                                </label>
                                <select onChange={(e) => addTrips(e.target.value)} className="form-control" ref={tripListRef}>
                                    <option value=''>Select a trip</option>
                                    {TripEntries.map(val => <option key={val.id} value={JSON.stringify(val)}>{val.trip_from} to {val.trip_to}</option>)}
                                </select>
                            </div>
                        }
                        <div className="mb-3">
                            <label className='mb-0'>
                                <b>Date</b>
                            </label>
                            <input type="date" defaultValue={new Date().toISOString().slice(0, 10).replace('T', ' ')} max={new Date().toISOString().slice(0, 10).replace('T', ' ')} className="form-control" ref={dateRef} required disabled={AccessControls.access && JSON.parse(AccessControls.access).includes(93) ? false : true} />
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
                                Issue Fuel To Equipments
                                <sub>Equipment's Fuel Entry (Other than Trip base)</sub>
                            </h3>
                            {JSON.parse(AccessControls.access).includes(91) && <button className="btn submit" onClick={() => setNew(true)}>New</button>}
                        </div>
                        <hr />
                        {
                            !Requests
                            ?
                            <h6 className='text-center'>Please Wait....</h6>
                            :
                            <table className="table" style={{fontFamily: 'Roboto-Light'}}>
                                <thead>
                                    <tr>
                                        <th className='border-top-0 bg-light'>#</th>
                                        <th className='border-top-0 bg-light'>Fuel (Ltr.)</th>
                                        <th className='border-top-0 bg-light'>Date</th>
                                        <th className='border-top-0 bg-light'>Equipment Type</th>
                                        <th className='border-top-0 bg-light'>Equipment Number</th>
                                        <th className='border-top-0 bg-light'>Hrs. Meter Reading</th>
                                        <th className='border-top-0 bg-light'>Submitted By</th>
                                        <th className='border-top-0 bg-light'>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        Requests.map(
                                            ({equipment_type_name, equipment_no, hrs_meter_reading, fuel_issued, issued_date, submit_person, submitted_at, status}, i) => (
                                                <tr key={i} className='pointer pointer-hover' onClick={() => loadDetails(i)}>
                                                    <td>{i+1}</td>
                                                    <td>{fuel_issued}</td>
                                                    <td>{moment(issued_date).format('DD-MM-YYYY')}</td>
                                                    <td>{equipment_type_name}</td>
                                                    <td>
                                                        <div className="badge bg-light border">
                                                            <b>{equipment_no}</b>
                                                        </div>
                                                    </td>
                                                    <td>{hrs_meter_reading}</td>
                                                    <td>
                                                        <b>{submit_person}</b><br />
                                                        <span>{moment(submitted_at).format('DD-MM-YYYY hh:mm A')}</span>
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

export default EquipmentFuelEntry;

const Status = ({ status }) => {
    return (
        <h6 className='d-flex align-items-center'>
            <div
                className={
                    "dot mr-1 "
                    +
                    (
                        status === 'Verified' || status === 'issued'
                            ?
                            "bg-success"
                            :
                            status === 'Replied' || status === 'Closed'
                                ?
                                "bg-primary"
                                :
                                status === 'Waiting For Verification' || status === 'Waiting For Verification'
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
                        status === 'Verified' || status === 'issued'
                            ?
                            "text-success"
                            :
                            status === 'Replied' || status === 'Closed'
                                ?
                                "text-primary"
                                :
                                status === 'Waiting For Verification' || status === 'Waiting For Verification'
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
                <h6><b>Confirm to verify this request?</b></h6>
                <hr />
                <button id='confirm' className="btn d-block ml-auto submit mt-3" onClick={() => approveRequest()}>Confirm</button>
            </>
        )
    }
    const issueFuel = () => {
        setModal(
            <>
                <h6><b>Confirm to issue fuel?</b></h6>
                <hr />
                <button id='confirm' className="btn d-block ml-auto submit mt-3" onClick={() => confirmIssueFuel()}>Confirm</button>
            </>
        )
    }
    const confirmIssueFuel = () => {
        if (!JSON.parse(AccessControls.access).includes(92)) {
            JSAlert.alert('Access Denied!', 'Warning', JSAlert.Icons.Warning).dismissIn(4000);
            return;
        }
        $('#confirm').prop('disabled', true);
        axios.post('/fuel-managent/fuel-issue-for-equipemnt/issue', {id: Details?.id, fuel_issued: Details.fuel_issued, emp_id: Details.submitted_by, issued_by: localStorage.getItem('EmpID'), issued_date: Details.issued_date, equipment_number: Details.equipment_number}).then((res) => {
            if (res.data === 'limit exceed') {
                $('#confirm').prop('disabled', false);
                JSAlert.alert('Insufficient quantity at the station!', 'Warning', JSAlert.Icons.Warning).dismissIn(4000);
                return;
            }
            setDetails();
            loadRequests(true);
            JSAlert.alert('Fuel Has been Issued!', 'Success', JSAlert.Icons.Success).dismissIn(4000);
        }).catch(err => {
            console.log(err);
            $('#confirm').prop('disabled', false);
        });
    }
    const rejectRequest = () => {
        if (!JSON.parse(AccessControls.access).includes(92)) {
            JSAlert.alert('Access Denied!', 'Warning', JSAlert.Icons.Warning).dismissIn(4000);
            return;
        }
        $('#confirm').prop('disabled', true);
        axios.post('/fuel-managent/fuel-issue-for-equipemnt/reject', {id: Details?.id, emp_id: Details.submitted_by, verifier: localStorage.getItem('EmpID')}).then(() => {
            setDetails();
            loadRequests(true);
            JSAlert.alert('Request has been rejected!', 'Success', JSAlert.Icons.Warning).dismissIn(4000);
        }).catch(err => {
            console.log(err);
            $('#confirm').prop('disabled', false);
        });
    }
    const approveRequest = () => {
        if (!JSON.parse(AccessControls.access).includes(92)) {
            JSAlert.alert('Access Denied!', 'Warning', JSAlert.Icons.Warning).dismissIn(4000);
            return;
        }
        $('#confirm').prop('disabled', true);
        axios.post('/fuel-managent/fuel-issue-for-equipemnt/approve', {id: Details?.id, fuel_issued: Details.fuel_issued, emp_id: Details.submitted_by, verifier: localStorage.getItem('EmpID'), issued_date: Details.issued_date, equipment_number: Details.equipment_number}).then((res) => {
            if (res.data === 'limit exceed') {
                $('#confirm').prop('disabled', false);
                JSAlert.alert('Insufficient quantity at the station!', 'Warning', JSAlert.Icons.Warning).dismissIn(4000);
                return;
            }
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
                            Equipment's Fuel Details
                            <sub>Equipment's Fuel Issue (Other than Trip base)</sub>
                        </h3>
                        <div>
                            {
                                Details.trip_based === 0 &&
                                Details.status === 'Waiting For Verification' && 
                                JSON.parse(AccessControls.access).includes(92) 
                                // &&
                                // parseInt(Details.verified_by) === parseInt(localStorage.getItem('EmpID'))
                                ?
                                <>
                                    <button className="btn submit" onClick={approve}>Verify</button>
                                    <button className="btn cancle ml-2" onClick={reject}>Reject</button>
                                </>
                                :
                                Details.trip_based === 1 &&
                                Details.status === 'Waiting For Verification' && 
                                JSON.parse(AccessControls.access).includes(92) 
                                ?<button className="btn submit" onClick={issueFuel}>Issue Fuel</button>
                                :null
                            }
                            <button className="btn light ml-2" onClick={() => setDetails()}>Back</button>
                        </div>
                    </div>
                    <hr />
                    <div className="w-50 mx-auto" style={{fontFamily: "Roboto-Light"}}>
                        <div className='main-banner'>
                            <h1 className='mb-0' style={{fontSize: 35}}>
                                <span className='font-weight-bold'>{parseFloat(Details.stock_at_station ? Details.stock_at_station : Details.total_stock).toFixed(2)}<small className='text-success' style={{ fontSize: 16 }}>Ltr</small></span>
                            </h1>
                            <h6 style={{fontSize: 15}} className='text-capitalize mb-0'>Stored at the fueling station {Details.stock_at_station ? `(dated: ${new Date(Details?.verified_at).toDateString()})` : '(Current)' }</h6>
                        </div>
                        <table className="table">
                            <tbody>
                                <tr>
                                    <td><h6 className='font-weight-bold'>Status</h6></td>
                                    <td><Status status={Details.status} /></td>
                                </tr>
                                <tr>
                                    <td><h6 className='font-weight-bold'>Equipment Type</h6></td>
                                    <td>{Details.equipment_type_name}</td>
                                </tr>
                                <tr>
                                    <td><h6 className='font-weight-bold'>Equipment Number</h6></td>
                                    <td>{Details.equipment_no}</td>
                                </tr>
                                <tr>
                                    <td><h6 className='font-weight-bold'>Hrs. Meter Reading</h6></td>
                                    <td>{Details.hrs_meter_reading}</td>
                                </tr>
                                <tr>
                                    <td><h6 className='font-weight-bold'>Trip Based</h6></td>
                                    <td>{Details.trip_based === 1 ? "Trip Based" : "Other Than Trip Based"}</td>
                                </tr>
                                {
                                    Details.trip_based === 1
                                    ?
                                    <>
                                        <tr>
                                            <td><h6 className='font-weight-bold'>Total Fuel To Issue (Ltr.)</h6></td>
                                            <td>{Details.fuel_issued}ltr</td>
                                        </tr>
                                        <tr>
                                            <td><h6 className='font-weight-bold'>Trips</h6></td>
                                            <td>
                                                <pre style={{fontFamily: 'Roboto-Light', display: 'block'}}>{Details.trips.split(', ').join('\n')}</pre>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td><h6 className='font-weight-bold'>Created By</h6></td>
                                            <td>{Details.submit_person}</td>
                                        </tr>
                                        <tr>
                                            <td><h6 className='font-weight-bold'>Created At</h6></td>
                                            <td>{new Date(Details.submitted_at).toDateString()} at {new Date(Details.submitted_at).toLocaleTimeString().substring(0,8)}</td>
                                        </tr>
                                        {
                                            Details.status === 'issued' && (
                                                <>
                                                    <tr>
                                                        <td><h6 className='font-weight-bold'>Issued By</h6></td>
                                                        <td>{Details.verifier_person && Details.verifier_person}</td>
                                                    </tr>
                                                    <tr>
                                                        <td><h6 className='font-weight-bold'>Issued At</h6></td>
                                                        <td>{Details.verified_at ? (new Date(Details.verified_at).toDateString() + ' at ' + new Date(Details.verified_at).toLocaleTimeString().substring(0,8)) : '-'}</td>
                                                    </tr>
                                                </>
                                            )
                                        }
                                    </>
                                    :
                                    <>
                                        <tr>
                                            <td><h6 className='font-weight-bold'>Fuel Issued (Ltr.)</h6></td>
                                            <td>{Details.fuel_issued}ltr</td>
                                        </tr>
                                        <tr>
                                            <td><h6 className='font-weight-bold'>Issued By</h6></td>
                                            <td>{Details.submit_person}</td>
                                        </tr>
                                        <tr>
                                            <td><h6 className='font-weight-bold'>Issued At</h6></td>
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