import React, { useEffect, useState } from 'react';
import axios from '../../../../../../../axios';
import moment from 'moment';
import $ from 'jquery';
import Modal from '../../../../../../UI/Modal/Modal';

const StockAtWorkshop = () => {
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
        axios.get('/fuel-managent/fuel-receival-for-workshop/transactions').then(res => {
            if (!isActive) return;
            setTotal(res.data[0].total);
            setRequests(res.data[1]);
        }).catch(err => console.log(err));
    }
    const loadTransactionDetails = (id, in_out) => {
        setModal(
            <>
                <h6 className="text-center py-3 border">
                    <b>Loading Details...</b>
                </h6>
            </>
        );
        if (in_out === 'IN') {
            axios.post('/fuel-managent/fuel-receival-for-workshop/request/details', {id}).then(res => {
                const Details = res.data[0];
                setModal(
                    <>
                        <h5 style={{fontFamily: "Roboto-Light", fontWeight: 'bold'}}>Fuel Receival Details</h5>
                        <hr />
                        <table style={{fontFamily: "Roboto-Light"}} className="table table-borderless">
                            <tbody>
                                <tr>
                                    <td>
                                        <b>Company</b><br />
                                        <span>{Details?.company_name}</span>
                                    </td>
                                    <td>
                                        <b>Location</b><br />
                                        <span>{Details?.location_name}</span>
                                    </td>
                                    <td>
                                        <b>Supplier</b><br />
                                        <span>{Details?.supplier}</span>
                                    </td>
                                    <td>
                                        <b>Fuel Received (Ltr.)</b><br />
                                        <span>{Details?.fuel_received}</span>
                                    </td>
                                    <td>
                                        <b>Received At</b><br />
                                        <span>{moment(new Date(Details?.receival_date)).format('DD-MM-YYYY')}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <b>Entered By</b><br />
                                        <span>{Details?.submit_person}</span>
                                    </td>
                                    <td>
                                        <b>Entered At</b><br />
                                        <span>{moment(new Date(Details?.submitted_at)).format('DD-MM-YYYY')} at {new Date(Details?.submitted_at).toLocaleTimeString().substring(0,5)}</span>
                                    </td>
                                    {
                                        Details?.status === 'Rejected'
                                        ?
                                        <>
                                            <td>
                                                <b>Rejected By</b><br />
                                                <span>{Details?.verifier_person && Details?.verifier_person}</span>
                                            </td>
                                            <td>
                                                <b>Rejected At</b><br />
                                                <span>{Details?.verified_at ? (moment(new Date(Details?.verified_at)).format('DD-MM-YYYY') + ' at ' + new Date(Details?.verified_at).toLocaleTimeString().substring(0,5)) : '-'}</span>
                                            </td>
                                        </>
                                        :
                                        <>
                                            <td>
                                                <b>{Details?.verified_at ? 'Verified By' : 'Submitted To'}</b><br />
                                                <span>{Details?.verifier_person && Details?.verifier_person}</span>
                                            </td>
                                            <td>
                                                <b>Verified At</b><br />
                                                <span>{Details?.verified_at ? (moment(new Date(Details?.verified_at)).format('DD-MM-YYYY') + ' at ' + new Date(Details?.verified_at).toLocaleTimeString().substring(0,5)) : '-'}</span>
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
            axios.post('/fuel-managent/fuel-request-for-station/request/details', {id}).then(res => {
                const Details = res.data[0];
                setModal(
                    <>
                        <h5 style={{fontFamily: "Roboto-Light", fontWeight: 'bold'}}>Fuel Request Details</h5>
                        <hr />
                        <table style={{fontFamily: "Roboto-Light"}} className="table table-borderless">
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
                        Fuel At Workshop
                        <sub>Total Fuel Received in Ltr.</sub>
                    </h3>
                    <hr />
                    <div className='main-banner'>
                        <h1 className='mb-0' style={{ fontSize: 35 }}>
                            <span className='font-weight-bold'>{Total.toFixed(2)}<small className='text-dark font-weight-bold' style={{ fontSize: 16 }}>Ltr</small></span>
                        </h1>
                        <h6 style={{ fontSize: 15 }} className='text-capitalize mb-0'>Total Stock at Workshop</h6>
                    </div>
                    <div className='d-flex justify-content-between align-items-center mb-3'>
                        <h5 className='mb-0' style={{fontFamily: "Roboto-Light"}}>
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
                                <th>Supplier</th>
                                <th>Fuel (ltr.)</th>
                                <th>Requested By</th>
                                <th>Approved By</th>
                                <th>Fuel Dates</th>
                                <th>Date & Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                Requests.filter(val => val.inserted_at.includes(DateFilter)).map((val, i) => {
                                    const { approved_at, requested_at, station_submit_person, station_verify_person, station_company, station_location, verified_at, submitted_at, workshop_submit_person, workshop_verify_person, supplier, workshop_company, workshop_location, in_out, request_id, quantity_in_ltr, inserted_at, fuel_received_at } = val;
                                    const d = new Date(inserted_at);
                                    return (
                                        <tr key={i}>
                                            {/*  onClick={() => loadTransactionDetails(request_id, in_out)} */}
                                            <td>{i+1}</td>
                                            {
                                                in_out === 'IN'
                                                ?
                                                <>
                                                    <td>
                                                        {workshop_company}<br />
                                                        {workshop_location}
                                                    </td>
                                                    <td>{supplier}</td>
                                                </>
                                                :
                                                <>
                                                    <td>
                                                        {station_company}<br />
                                                        {station_location}
                                                    </td>
                                                    <td></td>
                                                </>
                                            }
                                            {
                                                in_out === 'IN'
                                                ?
                                                <td id={'quantity_' + (i+1)} className='text-success'>+{quantity_in_ltr}</td>
                                                :
                                                <td id={'quantity_' + (i+1)} className='text-danger'>-{quantity_in_ltr}</td>
                                            }
                                            {
                                                in_out === 'IN'
                                                ?
                                                <>
                                                    <td>
                                                        {workshop_submit_person}<br />
                                                        {moment(submitted_at).format('YYYY-MM-DD HH:mm a')}
                                                    </td>
                                                    <td>
                                                        {workshop_verify_person}<br />
                                                        {moment(verified_at).format('YYYY-MM-DD HH:mm a')}
                                                    </td>
                                                </>
                                                :
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
                                            }
                                            <td>
                                                {
                                                    fuel_received_at && (
                                                        in_out === 'IN'
                                                        ?
                                                        <>
                                                            <b>Fuel Receival Date</b><br />
                                                            {fuel_received_at && moment(new Date(fuel_received_at)).format('DD-MM-YYYY')}
                                                        </>
                                                        :
                                                        <>
                                                            <b>Fuel Request Date</b><br />
                                                            {fuel_received_at && moment(new Date(fuel_received_at)).format('DD-MM-YYYY')}
                                                        </>
                                                    )
                                                }
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
        </>
    )
}

export default StockAtWorkshop;

const Status = ({ status }) => {
    return (
        <div className='d-flex align-items-center'>
            <div
                className={
                    "dot mr-1 "
                    +
                    (
                        status === 'Verified' || status === 'Approved'
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
                        status === 'Verified' || status === 'Approved'
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