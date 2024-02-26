import React, { useEffect, useRef, useState } from 'react';
import './TripSelection.css';
import axios from '../../../../../../../axios';
import { useSelector } from 'react-redux';
import moment from 'moment';
import JSAlert from 'js-alert';

const TripSelection = () => {
    const AccessControls = useSelector( ( state ) => state.EmpAuth.EmployeeData );
    const typeRef = useRef();
    const numberRef = useRef();
    const tripListRef = useRef();
    const dateRef = useRef();
    const additionalFuelRef = useRef();
    const btnRef = useRef();
    const btn2Ref = useRef();
    const btn3Ref = useRef();
    const formRef = useRef();
    const fieldsetRef = useRef();
    const [AdditionalFuel, setAdditionalFuel] = useState(0);
    const [New, setNew] = useState(false);
    const [Equipments, setEquipments] = useState([]);
    const [EquipmentNumbers, setEquipmentNumbers] = useState([]);
    const [TripEntries, setTripEntries] = useState([]);
    const [Trips, setTrips] = useState([]);
    const [SelectedTrips, setSelectedTrips] = useState([]);
    const [Requests, setRequests] = useState();
    const [Details, setDetails] = useState();
    const [selectedRoutes, setselectedRoutes] = useState([]);

    useEffect(
        () => {
            let isActive = true;
            GetEquipments(isActive);
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
    const submit = (e) => {
        e.preventDefault();
        if (typeRef.current.value.trim().length === 0) {
            JSAlert.alert('Equipment is required!!', 'Validation Error', JSAlert.Icons.Warning).dismissIn(4000);
            return false;
        }else if (numberRef.current.value.trim().length === 0) {
            JSAlert.alert('Equipment Number is required!!', 'Validation Error', JSAlert.Icons.Warning).dismissIn(4000);
            return false;
        }else if (TripEntries.length === 0) {
            JSAlert.alert('At least one trip should be selected!!', 'Validation Error', JSAlert.Icons.Warning).dismissIn(4000);
            return false;
        }else if (AdditionalFuel < 0) {
            JSAlert.alert('Invalid additional fuel quantity!!', 'Validation Error', JSAlert.Icons.Warning).dismissIn(4000);
            return false;
        }else if (SelectedTrips.length === 0) {
            JSAlert.alert('At least one route should be selected!!', 'Validation Error', JSAlert.Icons.Warning).dismissIn(4000);
            return false;
        }

        fieldsetRef.current.disabled = true;
        btnRef.current.innerHTML = 'Please Wait...';
        axios.post(
            '/fuel-managent/issue-fuel-for-trips',
            {
                type: typeRef.current.value,
                number: numberRef.current.value,
                trips: JSON.stringify(SelectedTrips),
                additionalFuel: AdditionalFuel === '' || isNaN(AdditionalFuel) ? 0 : AdditionalFuel,
                date: dateRef.current.disabled ? '' : dateRef.current.value,
                emp_id: localStorage.getItem('EmpID'),
                total_fuel: parseFloat(totalFuel) + parseFloat(AdditionalFuel)
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
            fieldsetRef.current.disabled = false;
            btnRef.current.innerHTML = 'Submit';
            formRef.current.reset();
            setNew(false);
            setAdditionalFuel(0);
            setTripEntries([]);
            setSelectedTrips([]);
            setEquipmentNumbers([]);
            loadRequests(true);
            
            JSAlert.alert('Trip entry has been created', 'Success', JSAlert.Icons.Success).dismissIn(2000);
        }).catch(err => {
            console.log(err);
            JSAlert.alert('Failed To complete!!', 'Could not create', JSAlert.Icons.Failed).dismissIn(4000);
            fieldsetRef.current.disabled = false;
            btnRef.current.innerHTML = 'Submit';
        });
    }
    const loadRequests = (isActive) => {
        axios.get('/fuel-managent/fuel-issue-for-trips-list/requests').then(res => {
            if (!isActive) return;
            setRequests(res.data);
        }).catch(err => console.log(err));
    }
    const openDetails = (i) => {
        const obj = Requests[i];
        setDetails(obj);
        loadTrips(obj.id);
    }
    const loadTrips = (id) => {
        axios.post('/fuel-managent/request/load-trip-lists', {id: id}).then(res => {
            setTrips(res.data);
        }).catch(err => console.log(err));
    }
    const checkUncheck = (e, val, i) => {
        if (e.target.checked) {
            val.index = i;
            const arr = selectedRoutes.slice();
            arr.push(val);
            setselectedRoutes(arr);
        }else {
            const arr = selectedRoutes.filter(val => val.index !== i);
            setselectedRoutes(arr);
        }
    }
    const checkAll = (e) => {
        if (e.target.checked) {
            const arr = [];
            Trips.forEach((val, i) => {
                if (val.status !== 'issued') {
                    val.index = i;
                    arr.push(val);
                }
            });
            setselectedRoutes(arr);
        }else {
            setselectedRoutes([]);
        }
    }
    const issueFuel = () => {
        btn2Ref.current.disabled = true;
        btn2Ref.current.innerHTML = 'Please Wait...';
        axios.post(
            '/fuel-managent/fuel-issue-for-selected-trips-list',
            {
                id: Details.id,
                additionalFuel: Details.additional_fuel > 0 ? 1 : 0,
                additionalFuelIssued: Details.additional_fuel_issued,
                routes: JSON.stringify(selectedRoutes),
                allIssued: Trips.filter(val => val.status !== 'issued').length === selectedRoutes.length ? 1 : 0,
                emp_id: localStorage.getItem('EmpID'),
                trip_date: Details.trip_date,
                number: Details.equipment_number
            }
        ).then(res => {
            if (res.data === 'err') {
                btn2Ref.current.disabled = false;
                btn2Ref.current.innerHTML = 'Retry';
                JSAlert.alert('Something Went Wrong!!', 'Warning', JSAlert.Icons.Warning).dismissIn(2000);
                return;
            }

            if (res.data === 'limit increase') {
                btn2Ref.current.disabled = false;
                btn2Ref.current.innerHTML = 'Retry';
                JSAlert.alert('Insufficient quantity at the station!!', 'Warning', JSAlert.Icons.Warning).dismissIn(2000);
                return;
            }

            btn2Ref.current.innerHTML = 'Issue Fuel';
            loadRequests(true);
            setDetails(false);
            setTrips([]);
            setselectedRoutes([]);
            JSAlert.alert('Fuel issued to the selected routes', 'Success', JSAlert.Icons.Success).dismissIn(2000);
        }).catch(err => {
            console.log(err);
            JSAlert.alert('Failed To complete!!', 'Could not create', JSAlert.Icons.Failed).dismissIn(4000);
            btn2Ref.current.innerHTML = 'Issue Fuel';
            btn2Ref.current.disabled = false;
        });
    }
    const issueAdditionalFuel = () => {
        btn3Ref.current.disabled = true;
        btn3Ref.current.innerHTML = 'Please Wait...';
        axios.post(
            '/fuel-managent/additional-fuel-issue-for-selected-trips-list',
            {
                id: Details.id,
                fuel: Details.additional_fuel,
                emp_id: localStorage.getItem('EmpID'),
                trip_date: Details.trip_date,
                number: Details.equipment_number,
                allIssued: Trips.filter(val => val.status !== 'issued').length === selectedRoutes.length ? 1 : 0,
            }
        ).then(res => {
            if (res.data === 'err') {
                btn3Ref.current.disabled = false;
                btn3Ref.current.innerHTML = 'Retry';
                JSAlert.alert('Something Went Wrong!!', 'Warning', JSAlert.Icons.Warning).dismissIn(2000);
                return;
            }

            if (res.data === 'limit increase') {
                btn3Ref.current.disabled = false;
                btn3Ref.current.innerHTML = 'Retry';
                JSAlert.alert('Insufficient quantity at the station!!', 'Warning', JSAlert.Icons.Warning).dismissIn(2000);
                return;
            }

            btn3Ref.current.innerHTML = 'Issue Fuel';
            loadRequests(true);
            setDetails(false);
            setTrips([]);
            setselectedRoutes([]);
            JSAlert.alert('Fuel issued to the selected routes', 'Success', JSAlert.Icons.Success).dismissIn(2000);
        }).catch(err => {
            console.log(err);
            JSAlert.alert('Failed To complete!!', 'Could not create', JSAlert.Icons.Failed).dismissIn(4000);
            btn3Ref.current.innerHTML = 'Issue Fuel';
            btn3Ref.current.disabled = false;
        });
    }

    let totalFuel = 0;
    SelectedTrips.forEach(val => {
        totalFuel = totalFuel + (val.fuel_to_issue ? val.fuel_to_issue : 0);
    })
    if (!AccessControls) {
        return <></>
    }

    if (New) {
        return (
            <div className='FuelTripSelection page'>
                <div className="page-content">
                    <div className="d-flex align-items-center justify-content-between">
                        <h3 className="heading">
                            Fuel Management Module
                            <sub>Trailer Trip Entry</sub>
                        </h3>
                        <button className="btn light" onClick={() => setNew(false)}>Back</button>
                    </div>
                    <hr />    
                    <form ref={formRef} className='w-50 mx-auto border p-3 rounded' onSubmit={submit}>
                        <fieldset ref={fieldsetRef}>
                            <table className="table table-sm mb-0">
                                <tbody>
                                    <tr>
                                        <td className='border-top-0'>
                                            <label className='font-weight-bold mb-0'>Equipment Type</label>
                                            <select onChange={(e) => GetEquipmentNumbers(e.target.value)} className="form-control" ref={typeRef}>
                                                <option value=''>Select the option</option>
                                                {
                                                    Equipments.map(
                                                        ({ id, equipment_type }) => {
                                                            return <option value={id}>{equipment_type}</option>
                                                        }
                                                    )
                                                }
                                            </select>
                                        </td>
                                        <td className='border-top-0'>
                                            <label className='font-weight-bold mb-0'>Equipment Number</label>
                                            <select onChange={(e) => GetTripEntries(e.target.value)} className="form-control" ref={numberRef}>
                                                <option value=''>Select the option</option>
                                                {EquipmentNumbers.map(val => <option key={val.id} value={val.id}> {val.equipment_number}</option>)}
                                            </select>
                                        </td>
                                    </tr>
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
                                                            <i onClick={() => delEntry(i)} className="lar la-trash-alt pointer" style={{fontSize: 20}}></i>
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
                                    <tr>
                                        <td colSpan={2} className='border-top-0'>
                                            <label className='font-weight-bold mb-0'>Trip List</label>
                                            <select onChange={(e) => addTrips(e.target.value)} className="form-control" ref={tripListRef}>
                                                <option value=''>Select a trip</option>
                                                {TripEntries.map(val => <option key={val.id} value={JSON.stringify(val)}>{val.trip_from} to {val.trip_to}</option>)}
                                            </select>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colSpan={2} className='border-top-0'>
                                            <label className='font-weight-bold mb-0'>Additional Fuel (optional)</label>
                                            <input type="number" onChange={(e) => setAdditionalFuel(e.target.value)} className='form-control' ref={additionalFuelRef} defaultValue={0} />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colSpan={2} className='border-top-0'>
                                            <label className='font-weight-bold mb-0'>Net Fuel</label>
                                            <input type="text" className='form-control' value={parseFloat(totalFuel) + (isNaN(parseFloat(AdditionalFuel)) ? 0 : parseFloat(AdditionalFuel)) + 'ltr'} disabled />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colSpan={2} className='border-top-0'>
                                            <label className='font-weight-bold mb-0'>Date</label>
                                            <input type="date" defaultValue={new Date().toISOString().slice(0, 10).replace('T', ' ')} max={new Date().toISOString().slice(0, 10).replace('T', ' ')} min={moment().subtract(7, 'days').format('YYYY-MM-DD')} className="form-control" ref={dateRef} disabled={AccessControls.access && JSON.parse(AccessControls.access).includes(95) ? false : true} />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colSpan={2} className='border-top-0'>
                                            <div className='d-flex justify-content-end'>
                                                <button ref={btnRef} className='btn submit'>Submit</button>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </fieldset>
                    </form>
                </div>
            </div>
        )
    }

    if (Details) {
        return (
            <div className='FuelTripSelection page'>
                <div className="page-content">
                    <div className="d-flex align-items-center justify-content-between">
                        <h3 className="heading">
                            Fuel Management Module
                            <sub>Trailer Trip Entry</sub>
                        </h3>
                        <button className="btn light" onClick={() => {
                            setDetails(false);
                            setTrips([]);
                            setselectedRoutes([]);
                        }}>Back</button>
                    </div>
                    <hr />    
                    <div className="d-flex" style={{gap: 20}}>
                        <div className='w-50' style={{fontFamily: "Roboto-Light"}}>
                            <div className='main-banner'>
                                <h1 className='mb-0' style={{fontSize: 35}}>
                                    <span className='font-weight-bold'>{Details.total_fuel_to_issue}<small className='text-success font-weight-bold' style={{ fontSize: 16 }}>ltr</small></span>
                                </h1>
                                <h6 style={{fontSize: 15}} className='text-capitalize mb-0'>Total fuel to issue</h6>
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
                                        <td style={{verticalAlign: 'bottom'}}><h6 className='font-weight-bold'>Additional Fuel</h6></td>
                                        <td>
                                            <div className={Details.additional_fuel_issued === 1 ? "" : "d-flex align-items-center justify-content-between"}>
                                                {Details.additional_fuel}ltr
                                                {
                                                    Details.additional_fuel_issued === 1 && (
                                                        <p className='mb-0'>
                                                            <b>Issued At: </b>
                                                            {moment(Details.additional_fuel_issued_at).format('YYYY-MM-DD HH:mm A')}
                                                        </p>
                                                    )
                                                }
                                                {Details.additional_fuel_issued === 0 && Details.additional_fuel > 0 && <button className='btn light' ref={btn3Ref} onClick={issueAdditionalFuel}>Issue</button>}
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td><h6 className='font-weight-bold'>Trip Date</h6></td>
                                        <td>{new Date(Details.trip_date).toDateString()}</td>
                                    </tr>
                                    <tr>
                                        <td><h6 className='font-weight-bold'>Created By</h6></td>
                                        <td>{Details.submit_person}</td>
                                    </tr>
                                    <tr>
                                        <td><h6 className='font-weight-bold'>Created At</h6></td>
                                        <td>{new Date(Details.created_at).toDateString()} at {new Date(Details.created_at).toLocaleTimeString().substring(0,8)}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="w-50">
                            <div className="d-flex align-items-center justify-content-between">
                                <h5 className='mb-0'>Routes</h5>
                                {
                                    Details.status.toLowerCase() !== 'issued' && <button className='btn submit' ref={btn2Ref} onClick={issueFuel} disabled={selectedRoutes.length === 0}>Issue Fuel</button>
                                }
                            </div>
                            {
                                Trips.length === 0
                                ?
                                <h6 className="text-center">Loading Trips...</h6>
                                :
                                <table className='table table-sm mt-2'>
                                    <thead>
                                        <tr>
                                            <th>
                                                <div className="d-flex align-items-center">
                                                    <input disabled={Details.status.toLowerCase() === 'issued'} onChange={checkAll} type="checkbox" checked={Trips.filter(val => val.status !== 'issued').length === selectedRoutes.length} className='form-cotnrol mr-1' />
                                                    All
                                                </div>
                                            </th>
                                            <th>Sr.No</th>
                                            <th>Route</th>
                                            <th>Fuel</th>
                                            <th>Issued By</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            Trips.map((val, i) => {
                                                const checked = selectedRoutes.filter(val => val.index === i)[0];
                                                const disabled = val.status === 'issued';
                                                return (
                                                    <tr>
                                                        <td>
                                                            <input disabled={disabled} checked={checked} onChange={(e) => checkUncheck(e, val, i)} type="checkbox" className='form-cotnrol' />
                                                        </td>
                                                        <td>{i+1}</td>
                                                        <td>{val.route}</td>
                                                        <td>{val.fuel}ltr</td>
                                                        <td>
                                                            {val.submit_person || 'not issued'} <br />
                                                            {val.submit_person && moment(val.issued_at).format('YYYY-MM-DD HH:mm A')}
                                                        </td>
                                                        <td>{val.status}</td>
                                                    </tr>
                                                )
                                            })
                                        }
                                    </tbody>
                                </table>
                            }
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className='FuelTripSelection page'>
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
                                <th className='border-top-0'>Total Fuel (Ltr.) To Issue</th>
                                <th className='border-top-0'>Trip Date</th>
                                <th className='border-top-0'>Equipment Type</th>
                                <th className='border-top-0'>Equipment Number</th>
                                <th className='border-top-0'>Created By</th>
                                <th className='border-top-0'>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                Requests.map(
                                    ({equipment_type_name, equipment_no, total_fuel_to_issue, trip_date, submit_person, created_at, status}, i) => (
                                        <tr key={i} className='pointer pointer-hover' onClick={() => openDetails(i)}>
                                            <td className='border-top-0'>{i+1}</td>
                                            <td className='border-top-0'>{total_fuel_to_issue}ltr</td>
                                            <td className='border-top-0'>{new Date(trip_date).toDateString()}</td>
                                            <td className='border-top-0'>{equipment_type_name}</td>
                                            <td className='border-top-0'>{equipment_no}</td>
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
    )
}

export default TripSelection;

const Status = ({ status }) => {
    return (
        <div className='d-flex align-items-center'>
            <div
                className={
                    "dot mr-1 "
                    +
                    (
                        status === 'Active' || status === 'Issued' || status === 'issued'
                            ?
                            "bg-success"
                            :
                            status === 'partial issued' || status === 'Closed'
                                ?
                                "bg-primary"
                                :
                                status === 'waiting for issue' || status === 'Waiting For Verification'
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
                        status === 'Active' || status === 'Issued' || status === 'issued'
                            ?
                            "text-success"
                            :
                            status === 'partial issued' || status === 'Closed'
                                ?
                                "text-primary"
                                :
                                status === 'waiting for issue' || status === 'Waiting For Verification'
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