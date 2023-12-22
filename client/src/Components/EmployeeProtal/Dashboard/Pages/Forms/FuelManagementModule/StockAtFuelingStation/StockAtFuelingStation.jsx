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
            axios.post('/fuel-managent/fuel-request-for-station/request/details', {id}).then(res => {
                const Details = res.data[0];
                setModal(
                    <>
                        <h5>Fuel Request Details</h5>
                        <hr />
                        <table className="table table-borderless">
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
                                    <span>{moment(new Date(Details?.requested_at)).format('DD-MM-YYYY')} at {new Date(Details?.requested_at).toLocaleTimeString().substring(0,8)}</span>
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
                                            <span>{Details?.approved_at ? (moment(new Date(Details?.approved_at)).format('DD-MM-YYYY') + ' at ' + new Date(Details?.approved_at).toLocaleTimeString().substring(0,8)) : '-'}</span>
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
                                            <span>{Details?.approved_at ? (moment(new Date(Details?.approved_at)).format('DD-MM-YYYY') + ' at ' + new Date(Details?.approved_at).toLocaleTimeString().substring(0,8)) : '-'}</span>
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
        }else {
            if ( other_than_trip === 1 ) {
                axios.post('/fuel-managent/fuel-issue-for-equipemnt/request/details', {id}).then(res => {
                    const Details = res.data[0];
                    setModal(
                        <>
                            <h5>Fuel Issued To Equipments</h5>
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
                                            <span>{new Date(Details.submitted_at).toDateString()} at {new Date(Details.submitted_at).toLocaleTimeString().substring(0,8)}</span>
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
                                                    <span>{Details.verified_at ? (new Date(Details.verified_at).toDateString() + ' at ' + new Date(Details.verified_at).toLocaleTimeString().substring(0,8)) : '-'}</span>
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
                                                    <span>{Details.verified_at ? (new Date(Details.verified_at).toDateString() + ' at ' + new Date(Details.verified_at).toLocaleTimeString().substring(0,8)) : '-'}</span>
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
            }else 
            if (trip_based === 1) {
                axios.post('/fuel-managent/fuel-issue-for-trip/request/details', {id}).then(res => {
                    const Details = res.data[0];
                    setModal(
                        <>
                            <h5>Fuel Issued To Trailer</h5>
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
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-4">
                                <div className="border p-3 rounded">
                                    <div className='d-flex justify-content-center align-items-end mb-2'>
                                        <h1 className='text-center mb-0 mr-1' style={{fontFamily: "Maersk", fontSize: '40px'}}>
                                            <b>{Total.toFixed(2)}</b>
                                        </h1>
                                        <p className='mb-0 font-weight-bold text-secondary'>Ltr.</p>
                                    </div>
                                    <h6 className='text-center mb-0'>Total Stock at Station</h6>
                                </div>
                            </div>
                            <div className="col-8" style={{maxHeight: '75vh', overflow: 'auto'}}>
                                <div className='d-flex justify-content-between align-items-center mb-3'>
                                    <h5 className='mb-0'>
                                        <b>No. of Transactions:</b> {Requests?.filter(val => val.inserted_at.includes(DateFilter)).length}
                                    </h5>
                                    <div>
                                        <label className="mb-0">Date</label>
                                        <input onChange={(e) => setDate(e.target.value)} type="date" className="form-control form-control-sm" max={moment(new Date()).format('YYYY-MM-DD')} />
                                    </div>
                                </div>
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Ref #</th>
                                            <th>Fuel (ltr.)</th>
                                            <th>Dates</th>
                                            <th>Date & Time</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            Requests.filter(val => val.inserted_at.includes(DateFilter)).map((val, i) => {
                                                const { in_out, request_id, quantity_in_ltr, inserted_at, fuel_requested_at, other_than_trip, trip_based } = val;
                                                const d = new Date(inserted_at);
                                                const label = other_than_trip === 0 && trip_based === 0 ? 'Requested At' :
                                                    other_than_trip === 1 ? 'Issued To Equipement' :
                                                    trip_based === 1 ? 'Trip Date' : null;
                                                return (
                                                    <tr key={i}>
                                                        <td>{i+1}</td>
                                                        <td onClick={() => loadTransactionDetails(request_id, in_out, other_than_trip, trip_based)}>
                                                            <span className='pointer pointer-underline'>{request_id}</span>
                                                        </td>
                                                        {
                                                            in_out === 'IN'
                                                            ?
                                                            <td id={'quantity_' + (i+1)} className='text-success'>+{quantity_in_ltr}</td>
                                                            :
                                                            <td id={'quantity_' + (i+1)} className='text-danger'>-{quantity_in_ltr}</td>
                                                        }
                                                        <td>
                                                            <b>{label}</b><br />
                                                            <span>{fuel_requested_at && fuel_requested_at && moment(new Date(fuel_requested_at)).format('DD-MM-YYYY')}</span>
                                                        </td>
                                                        <td>{moment(d).format('DD-MM-YYYY HH:mm a')}</td>
                                                    </tr>
                                                )
                                            })
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
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
                        status === 'Verified' || status === 'Approved' || status === 'Issued'
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
                        status === 'Verified' || status === 'Approved' || status === 'Issued'
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