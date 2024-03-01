import React, { useEffect, useState } from 'react';
import axios from '../../../../../../../axios';
import moment from 'moment';
import $ from 'jquery';
import Modal from '../../../../../../UI/Modal/Modal';

const StockAtFuelingStation = () => {
    const [modal, setModal] = useState();
    const [Requests, setRequests] = useState();
    const [Total, setTotal] = useState(0);
    const [DateFilter, setDate] = useState('');

    useEffect(
        () => {
            let isActive = true;
            loadTransactions(isActive);
            return () => {
                isActive = false;
            }
        }, []
    );
    const loadTransactions = (isActive) => {
        axios.get('/fuel-managent/fuel-request-for-station/transactions').then(res => {
            if (!isActive) return;
            setTotal(res.data[0].total);
            setRequests(res.data[1]);
        }).catch(err => console.log(err));
    }
    const loadTransactionDetails = (id, in_out, other_than_trip, trip_based) => {
        setModal(
            <>
                <h6 className="text-center py-3 border">
                    <b>Loading Details...</b>
                </h6>
            </>
        );
        if (in_out === 'IN') {
            axios.post('/fuel-managent/fuel-request-for-station/request/details', { id }).then(res => {
                const Details = res.data[0];
                setModal(
                    <>
                        <h5 style={{ fontFamily: "Roboto-Light", fontWeight: 'bold' }}>Fuel Request Details</h5>
                        <hr />
                        <table style={{ fontFamily: "Roboto-Light" }} className="table table-borderless">
                            <tbody>
                                <tr>
                                    <td>
                                        <b>Fuel Required (Ltr.)</b><br />
                                        <span>{Details?.fuel_required}</span>
                                    </td>
                                    <td>
                                        <b>Requested By</b><br />
                                        <span>{Details?.submit_person}</span>
                                    </td>
                                    <td>
                                        <b>Requested At</b><br />
                                        <span>{moment(new Date(Details?.requested_at)).format('DD-MM-YYYY')} at {new Date(Details?.requested_at).toLocaleTimeString().substring(0, 8)}</span>
                                    </td>
                                </tr>
                                <tr>
                                    {
                                        Details?.status === 'Rejected'
                                            ?
                                            <>
                                                <td>
                                                    <b>Rejected By</b><br />
                                                    <span>{Details?.approval_person && Details?.approval_person}</span>
                                                </td>
                                                <td>
                                                    <b>Rejected At</b><br />
                                                    <span>{Details?.approved_at ? (moment(new Date(Details?.approved_at)).format('DD-MM-YYYY') + ' at ' + new Date(Details?.approved_at).toLocaleTimeString().substring(0, 8)) : '-'}</span>
                                                </td>
                                            </>
                                            :
                                            <>
                                                <td>
                                                    <b>{Details?.approved_at ? 'Approved By' : 'Submitted To'}</b><br />
                                                    <span>{Details?.approval_person && Details?.approval_person}</span>
                                                </td>
                                                <td>
                                                    <b>Approved At</b><br />
                                                    <span>{Details?.approved_at ? (moment(new Date(Details?.approved_at)).format('DD-MM-YYYY') + ' at ' + new Date(Details?.approved_at).toLocaleTimeString().substring(0, 8)) : '-'}</span>
                                                </td>
                                            </>
                                    }
                                    <td>
                                        <b>Status</b><br />
                                        <Status status={Details?.status} />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </>
                );
            }).catch(err => console.log(err));
        } else {
            if (other_than_trip === 1) {
                axios.post('/fuel-managent/fuel-issue-for-equipemnt/request/details', { id }).then(res => {
                    const Details = res.data[0];
                    setModal(
                        <>
                            <h5 style={{ fontFamily: "Roboto-Light", fontWeight: 'bold' }}>Fuel Issued To Equipments</h5>
                            <hr />
                            <table style={{ fontFamily: "Roboto-Light" }} className="table table-borderless">
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
                                            <b>Hrs. Meter Reading</b><br />
                                            <span>{Details.hrs_meter_reading}</span>
                                        </td>
                                        <td>
                                            <b>Fuel Issued (Ltr.)</b><br />
                                            <span>{Details.fuel_issued}</span>
                                        </td>
                                        <td>
                                            <b>Issued At</b><br />
                                            <span>{new Date(Details.issued_date).toDateString()}</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <b>Issued By</b><br />
                                            <span>{Details.submit_person}</span>
                                        </td>
                                        <td>
                                            <b>Issued At</b><br />
                                            <span>{new Date(Details.submitted_at).toDateString()} at {new Date(Details.submitted_at).toLocaleTimeString().substring(0, 8)}</span>
                                        </td>
                                        {
                                            Details.status === 'Rejected'
                                                ?
                                                <>
                                                    <td>
                                                        <b>Rejected By</b><br />
                                                        <span>{Details.verifier_person && Details.verifier_person}</span>
                                                    </td>
                                                    <td>
                                                        <b>Rejected At</b><br />
                                                        <span>{Details.verified_at ? (new Date(Details.verified_at).toDateString() + ' at ' + new Date(Details.verified_at).toLocaleTimeString().substring(0, 8)) : '-'}</span>
                                                    </td>
                                                </>
                                                :
                                                <>
                                                    <td>
                                                        <b>{Details.verified_at ? 'Verified By' : 'Submitted To'}</b><br />
                                                        <span>{Details.verifier_person && Details.verifier_person}</span>
                                                    </td>
                                                    <td>
                                                        <b>Verified At</b><br />
                                                        <span>{Details.verified_at ? (new Date(Details.verified_at).toDateString() + ' at ' + new Date(Details.verified_at).toLocaleTimeString().substring(0, 8)) : '-'}</span>
                                                    </td>
                                                </>
                                        }
                                        <td>
                                            <b>Status</b><br />
                                            <Status status={Details.status} />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </>
                    );
                }).catch(err => console.log(err));
            } else
                if (trip_based === 1) {
                    axios.post('/fuel-managent/fuel-issue-for-trip/request/details', { id }).then(res => {
                        const Details = res.data[0];
                        setModal(
                            <>
                                <h5 style={{ fontFamily: "Roboto-Light", fontWeight: 'bold' }}>Fuel Issued To Trailer</h5>
                                <hr />
                                <table style={{ fontFamily: "Roboto-Light" }} className="table table-borderless">
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
                                                <pre style={{ fontFamily: "Roboto-Light" }}>{Details.route}</pre>
                                            </td>
                                            <td>
                                                <b>Fuel Issued (Ltr.)</b><br />
                                                <span>{Details.total_fuel_to_issue}</span>
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
                                                <span>{new Date(Details.created_at).toDateString()} at {new Date(Details.created_at).toLocaleTimeString().substring(0, 8)}</span>
                                            </td>
                                            <td>
                                                <b>Status</b><br />
                                                <Status status={Details.status} />
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </>
                        );
                    }).catch(err => console.log(err));
                }
        }
    }

    if (!Requests) {
        return (
            <div className="page">
                <div className="page-content">
                    <p className="text-center mb-0">Loading...</p>
                </div>
            </div>
        )
    }
    return (
        <>
            {modal && <Modal width="65%" show={true} Hide={() => setModal()} content={modal} />}
            <div className="page">
                <div className="page-content">
                    <h3 className="heading">
                        Fuel At Fueling Station
                        <sub>Total Fuel Received in Ltr.</sub>
                    </h3>
                    <hr />
                    <div className='main-banner'>
                        <h1 className='mb-0' style={{ fontSize: 35 }}>
                            <span className='font-weight-bold'>{Total.toFixed(2)}<small className='text-dark font-weight-bold' style={{ fontSize: 16 }}>Ltr</small></span>
                        </h1>
                        <h6 style={{ fontSize: 15 }} className='text-capitalize mb-0'>Total Stock at Station</h6>
                    </div>
                    <div className='d-flex justify-content-between align-items-center mb-3'>
                        <h5 className='mb-0' style={{ fontFamily: "Roboto-Light" }}>
                            <b>No. of Transactions:</b> {Requests?.filter(val => val.inserted_at.includes(DateFilter)).length}
                        </h5>
                        <div>
                            <label className="mb-0">Date</label>
                            <input onChange={(e) => setDate(e.target.value)} type="date" className="form-control form-control-sm" max={moment(new Date()).format('YYYY-MM-DD')} />
                        </div>
                    </div>
                    <table className="table table-bordered" style={{fontSize: 12, fontFamily: 'Roboto-Light'}}>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Com & Loc</th>
                                <th>Equipment</th>
                                <th>Fuel (ltr.)</th>
                                <th>Requested By</th>
                                <th>Approved By</th>
                                {/* <th>Dates</th> */}
                                <th>Date & Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                Requests.filter(val => val.inserted_at.includes(DateFilter)).map((val, i) => {
                                    const { last_issued_at, trip_issued_by, trip_location, trip_company, verified_at, submitted_at, equipment_submit_person, equipment_verify_person, equipment_type, equipment_number, requested_at, approved_at, station_submit_person, station_verify_person, station_company, station_location, in_out, request_id, quantity_in_ltr, inserted_at, fuel_requested_at, other_than_trip, trip_based } = val;
                                    const d = new Date(inserted_at);
                                    const label = other_than_trip === 0 && trip_based === 0 ? 'Requested At' :
                                        other_than_trip === 1 ? 'Issued To Equipment' :
                                            trip_based === 1 ? 'Trip Date' : null;
                                    return (
                                        <tr key={i}>
                                            {/*  onClick={() => loadTransactionDetails(request_id, in_out, other_than_trip, trip_based)} */}
                                            <td>{i + 1}</td>
                                            {
                                                trip_based === 1
                                                ?
                                                <td>
                                                    {trip_company}<br />
                                                    {trip_location}
                                                </td>
                                                :
                                                <td>
                                                    {station_company}<br />
                                                    {station_location}
                                                </td>
                                            }
                                            {
                                                in_out === 'OUT'
                                                ?
                                                <td>
                                                    {equipment_type}<br />
                                                    {equipment_number}
                                                </td>
                                                :
                                                <td></td>
                                            }
                                            {
                                                in_out === 'IN'
                                                    ?
                                                    <td id={'quantity_' + (i + 1)} className='text-success'>+{quantity_in_ltr}</td>
                                                    :
                                                    <td id={'quantity_' + (i + 1)} className='text-danger'>-{quantity_in_ltr}</td>
                                            }
                                            {
                                                in_out === 'IN'
                                                    ?
                                                    <>
                                                        <td>
                                                            {station_submit_person}<br />
                                                            {moment(requested_at).format('YYYY-MM-DD HH:mm a')}
                                                        </td>
                                                        <td>
                                                            {station_verify_person}<br />
                                                            {moment(approved_at).format('YYYY-MM-DD HH:mm a')}
                                                        </td>
                                                    </>
                                                    :
                                                    other_than_trip === 1
                                                    ?
                                                    <>
                                                        <td>
                                                            {equipment_submit_person}<br />
                                                            {moment(submitted_at).format('YYYY-MM-DD HH:mm a')}
                                                        </td>
                                                        <td>
                                                            {equipment_verify_person}<br />
                                                            {moment(verified_at).format('YYYY-MM-DD HH:mm a')}
                                                        </td>
                                                    </>
                                                    :
                                                    <>
                                                        <td>
                                                            {trip_issued_by}<br />
                                                            {moment(last_issued_at).format('YYYY-MM-DD HH:mm a')}
                                                        </td>
                                                        <td></td>
                                                    </>
                                            }
                                            {/* <td>
                                                <b>{label}</b><br />
                                                <span>{fuel_requested_at && fuel_requested_at && moment(new Date(fuel_requested_at)).format('DD-MM-YYYY')}</span>
                                            </td> */}
                                            <td>{moment(d).format('DD-MM-YYYY HH:mm a')}</td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}

export default StockAtFuelingStation;

const Status = ({ status }) => {
    if (!status) return <></>
    return (
        <div className='d-flex align-items-center'>
            <div
                className={
                    "dot mr-1 "
                    +
                    (
                        status === 'Verified' || status === 'Approved' || status === 'Issued' || status === 'issued'
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
            <div
                className={
                    "text-capitalize "
                    +
                    (
                        status === 'Verified' || status === 'Approved' || status === 'Issued' || status === 'issued'
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
            </div>
        </div>
    )
}