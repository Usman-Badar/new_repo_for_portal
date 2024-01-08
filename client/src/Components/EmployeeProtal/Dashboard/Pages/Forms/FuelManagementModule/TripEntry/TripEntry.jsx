/* eslint-disable eqeqeq */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react';
import './TripEntry.css';
import JSAlert from 'js-alert';
import $ from 'jquery';
import axios from '../../../../../../../axios';
import Modal from '../../../../../../UI/Modal/Modal';
import { useSelector } from 'react-redux';

function TripEntry() {
    const AccessControls = useSelector( ( state ) => state.EmpAuth.EmployeeData );
    const typeRef = useRef();
    const numberRef = useRef();
    const fromRef = useRef();
    const toRef = useRef();
    const dateRef = useRef();
    const fuelRef = useRef();
    const btnRef = useRef();
    const formRef = useRef();
    const fieldsetRef = useRef();
    const [Equipments, setEquipments] = useState([]);
    const [EquipmentNumbers, setEquipmentNumbers] = useState([]);
    const [Requests, setRequests] = useState();
    const [New, setNew] = useState(false);
    const [Details, setDetails] = useState();

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
    const onSubmit = (e) => {
        e.preventDefault();
        if (typeRef.current.value.trim().length === 0) {
            JSAlert.alert('Equipment is required!!', 'Validation Error', JSAlert.Icons.Warning).dismissIn(4000);
            return false;
        }else if (numberRef.current.value.trim().length === 0) {
            JSAlert.alert('Equipment Number is required!!', 'Validation Error', JSAlert.Icons.Warning).dismissIn(4000);
            return false;
        }else if (fromRef.current.value.trim().length === 0) {
            JSAlert.alert('Trip from location is required!!', 'Validation Error', JSAlert.Icons.Warning).dismissIn(4000);
            return false;
        }else if (toRef.current.value.trim().length === 0) {
            JSAlert.alert('Trip destination is required!!', 'Validation Error', JSAlert.Icons.Warning).dismissIn(4000);
            return false;
        }
        // else if (dateRef.current.value.trim().length === 0) {
        //     JSAlert.alert('Date is required!!', 'Validation Error', JSAlert.Icons.Warning).dismissIn(4000);
        //     return false;
        // }
        else if (isNaN(parseInt(fuelRef.current.value))) {
            JSAlert.alert('Invalid fuel quantity!!', 'Validation Error', JSAlert.Icons.Warning).dismissIn(4000);
            return false;
        }else if (parseFloat(fuelRef.current.value) <= 0) {
            JSAlert.alert('Fuel quantity must be greater than 0!!', 'Validation Error', JSAlert.Icons.Warning).dismissIn(4000);
            return false;
        }
        // else if (!isValidDate(dateRef)) {
        //     JSAlert.alert('Date should be valid and must not be greater than the current date!!', 'Validation Error', JSAlert.Icons.Warning).dismissIn(4000);
        //     return false;
        // }

        fieldsetRef.current.disabled = true;
        btnRef.current.innerHTML = 'Please Wait...';
        axios.post(
            '/fuel-managent/fuel-issue-for-trip/new',
            {
                type: typeRef.current.value,
                number: numberRef.current.value,
                from: fromRef.current.value,
                to: toRef.current.value,
                date: dateRef.current.disabled ? '' : dateRef.current.value,
                fuel: fuelRef.current.value,
                emp_id: localStorage.getItem('EmpID')
            }
        ).then((res) => {
            if (res.data === 'err') {
                fieldsetRef.current.disabled = false;
                btnRef.current.innerHTML = 'Retry';
                JSAlert.alert('Something Went Wrong!!', 'Warning', JSAlert.Icons.Warning).dismissIn(2000);
                return;
            }
            if (res.data === 'limit exceed') {
                fieldsetRef.current.disabled = false;
                btnRef.current.innerHTML = 'Retry';
                JSAlert.alert('Insufficient quantity at fuleing station!!', 'Warning', JSAlert.Icons.Warning).dismissIn(2000);
                return;
            }
            loadRequests(true);
            fieldsetRef.current.disabled = false;
            btnRef.current.innerHTML = 'Submit';
            formRef.current.reset();
            setNew(false);
            
            JSAlert.alert('Trip entry has been recorded', 'Success', JSAlert.Icons.Success).dismissIn(2000);
        }).catch(err => {
            console.log(err);
            JSAlert.alert('Failed To complete!!', 'Request Failed', JSAlert.Icons.Failed).dismissIn(4000);
            fieldsetRef.current.disabled = false;
            btnRef.current.innerHTML = 'Submit';
        });
    }
    const loadRequests = (isActive) => {
        axios.post('/fuel-managent/fuel-issue-for-trip/requests', {emp_id: localStorage.getItem("EmpID")}).then(res => {
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

    return (
        <>
            {New && (
                <Modal show={true} Hide={() => setNew(false)} content={
                    <form ref={formRef} onSubmit={onSubmit}>
                        <h3 className="heading">
                            New Record
                            <sub>Trailer Trip Entry</sub>
                        </h3>
                        <hr />
                        <fieldset ref={fieldsetRef}>
                            <div className="d-flex mb-2" style={{gap: '20px'}}>
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
                                    <select className="form-control" ref={numberRef} required>
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
                            <div className="d-flex mb-2" style={{gap: '20px'}}>
                                <div className='w-50'>
                                    <label className='mb-0'>
                                        <b>Fuel (Ltr.)</b>
                                    </label>
                                    <input type='number' min={1} className="form-control" ref={fuelRef} required />
                                </div>
                                <div className='w-50'>
                                    <label className='mb-0'>
                                        <b>Date</b>
                                    </label>
                                    <input type="date" defaultValue={new Date().toISOString().slice(0, 10).replace('T', ' ')} max={new Date().toISOString().slice(0, 10).replace('T', ' ')} className="form-control" ref={dateRef} required disabled={AccessControls.access && JSON.parse(AccessControls.access).includes(95) ? false : true} />
                                </div>
                            </div>
                            <hr />
                            <h6><b>Trip</b></h6>
                            <div className="d-flex mb-3" style={{gap: '20px'}}>
                                <div className='w-50'>
                                    <label className='mb-0'>
                                        <b>From</b>
                                    </label>
                                    <input type='text' className="form-control" ref={fromRef} required />
                                </div>
                                <div className='w-50'>
                                    <label className='mb-0'>
                                        <b>To</b>
                                    </label>
                                    <input type='text' className="form-control" ref={toRef} required />
                                </div>
                            </div>

                            <div className='d-flex justify-content-end align-items-center'>
                                <button className="btn light" type="button">Cancel</button>
                                <button className="btn ml-3 submit" type='submit' ref={btnRef}>
                                    Submit
                                </button>
                            </div>
                        </fieldset>
                    </form>
                } />
            )}
            {
                Details
                ?
                <ReceivalDetails AccessControls={AccessControls} Details={Details} setDetails={setDetails} loadRequests={loadRequests} />
                :
                <div className='FuelRecievedFrom page'>
                    <div className="page-content">
                        <div className="d-flex align-items-center justify-content-between">
                            <h3 className="heading">
                                Fuel Management Module
                                <sub>Trailer Trip Entry</sub>
                            </h3>
                            {JSON.parse(AccessControls.access).includes(94) && <button className="btn submit" onClick={() => setNew(true)}>New</button>}
                        </div>
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
                                        <th className='border-top-0'>Issued Fuel (Ltr.)</th>
                                        <th className='border-top-0'>Trip Date</th>
                                        <th className='border-top-0'>Equipment Type</th>
                                        <th className='border-top-0'>Equipment Number</th>
                                        <th className='border-top-0'>Trip</th>
                                        <th className='border-top-0'>Submitted By</th>
                                        <th className='border-top-0'>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        Requests.map(
                                            ({equipment_type_name, equipment_no, trip_from, trip_to, fuel_to_issue, trip_date, submit_person, created_at, status}, i) => (
                                                <tr key={i} className='pointer pointer-hover' onClick={() => loadDetails(i)}>
                                                    <td className='border-top-0'>{i+1}</td>
                                                    <td className='border-top-0'>{fuel_to_issue}</td>
                                                    <td className='border-top-0'>{new Date(trip_date).toDateString()}</td>
                                                    <td className='border-top-0'>{equipment_type_name}</td>
                                                    <td className='border-top-0'>{equipment_no}</td>
                                                    <td className='border-top-0'>{trip_from} to {trip_to}</td>
                                                    <td className='border-top-0'>
                                                        <b>{submit_person}</b><br />
                                                        <span>{new Date(created_at).toDateString()}</span><br />
                                                        <span>{new Date(created_at).toLocaleTimeString()}</span>
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

export default TripEntry;

const Status = ({ status }) => {
    return (
        <div className='d-flex align-items-center'>
            <div
                className={
                    "dot mr-1 "
                    +
                    (
                        status === 'Verified' || status === 'Issued'
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
            <div
                className={
                    "text-capitalize "
                    +
                    (
                        status === 'Verified' || status === 'Issued'
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
            </div>
        </div>
    )
}

const ReceivalDetails = ({ AccessControls, Details, setDetails, loadRequests }) => {
    const [modal, setModal] = useState();
    return (
        <>
            {modal && <Modal show={true} Hide={() => setModal()} content={modal} />}
            <div className='page'>
                <div className="page-content">
                    <div className="d-flex align-items-center justify-content-between">
                        <h3 className="heading">
                            Trailer Trip Details
                            <sub>Trailer Trip Entry</sub>
                        </h3>
                        <div>
                            <button className="btn light ml-2" onClick={() => setDetails()}>Back</button>
                        </div>
                    </div>
                    <hr />
                    <table className="table table-borderless">
                        <tbody>
                            <tr>
                                <td>
                                    <b>Equipment Type</b><br />
                                    <span>{Details.equipment_type_name}</span>
                                </td>
                                <td>
                                    <b>Equipment Number</b><br />
                                    <span>{Details.equipment_no}</span>
                                </td>
                                <td>
                                    <b>Trip</b><br />
                                    <span>{Details.trip_from} to {Details.trip_to}</span>
                                </td>
                                <td>
                                    <b>Fuel Issued (Ltr.)</b><br />
                                    <span>{Details.fuel_to_issue}</span>
                                </td>
                                <td>
                                    <b>Trip Date</b><br />
                                    <span>{new Date(Details.trip_date).toDateString()}</span>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <b>Issued By</b><br />
                                    <span>{Details.submit_person}</span>
                                </td>
                                <td>
                                    <b>Issued At</b><br />
                                    <span>{new Date(Details.created_at).toDateString()} at {new Date(Details.created_at).toLocaleTimeString().substring(0,8)}</span>
                                </td>
                                <td>
                                    <b>Status</b><br />
                                    <Status status={Details.status} />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    {/* {JSON.stringify(Details)} */}
                </div>
            </div>
        </>
    )
}