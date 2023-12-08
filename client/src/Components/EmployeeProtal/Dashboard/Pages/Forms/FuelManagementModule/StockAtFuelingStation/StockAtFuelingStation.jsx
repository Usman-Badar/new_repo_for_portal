import React, { useEffect, useState } from 'react';
import axios from '../../../../../../../axios';
import moment from 'moment';
import $ from 'jquery';
import Modal from '../../../../../../UI/Modal/Modal';

const StockAtFuelingStation = () => {
    const [modal, setModal] = useState();
    const [Requests, setRequests] = useState();
    const [Total, setTotal] = useState(0);

    useEffect(
        () => {
            let isActive = true;
            loadTransactions(isActive);
            return () => {
                isActive = false;
            }
        }, []
    );
    useEffect(
        () => {
            if (Requests) {
                let total = 0;
                for (let x = 0; x < Requests.length; x++) {
                    total += parseFloat($('#quantity_' + (x+1)).text());
                }
                setTotal(total);
            }
        }, [Requests]
    );
    const loadTransactions = (isActive) => {
        axios.get('/fuel-managent/fuel-request-for-station/transactions').then(res => {
            if (!isActive) return;
            setRequests(res.data);
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
            alert('Option disabled');
            // axios.post('/fuel-managent/fuel-receival-for-workshop/request/details', {id}).then(res => {
            //     const Details = res.data[0];
            //     setModal(
            //         <>
            //             <h5>Fuel Receival Details</h5>
            //             <hr />
            //             <table className="table table-borderless">
            //                 <tbody>
            //                     <tr>
            //                         <td>
            //                             <b>Company</b><br />
            //                             <span>{Details?.company_name}</span>
            //                         </td>
            //                         <td>
            //                             <b>Location</b><br />
            //                             <span>{Details?.location_name}</span>
            //                         </td>
            //                         <td>
            //                             <b>Supplier</b><br />
            //                             <span>{Details?.supplier}</span>
            //                         </td>
            //                         <td>
            //                             <b>Fuel Received (Ltr.)</b><br />
            //                             <span>{Details?.fuel_received}</span>
            //                         </td>
            //                         <td>
            //                             <b>Received At</b><br />
            //                             <span>{moment(new Date(Details?.receival_date)).format('DD-MM-YYYY')}</span>
            //                         </td>
            //                     </tr>
            //                     <tr>
            //                         <td>
            //                             <b>Entered By</b><br />
            //                             <span>{Details?.submit_person}</span>
            //                         </td>
            //                         <td>
            //                             <b>Entered At</b><br />
            //                             <span>{moment(new Date(Details?.submitted_at)).format('DD-MM-YYYY')} at {new Date(Details?.submitted_at).toLocaleTimeString().substring(0,5)}</span>
            //                         </td>
            //                         {
            //                             Details?.status === 'Rejected'
            //                             ?
            //                             <>
            //                                 <td>
            //                                     <b>Rejected By</b><br />
            //                                     <span>{Details?.verifier_person && Details?.verifier_person}</span>
            //                                 </td>
            //                                 <td>
            //                                     <b>Rejected At</b><br />
            //                                     <span>{Details?.verified_at ? (moment(new Date(Details?.verified_at)).format('DD-MM-YYYY') + ' at ' + new Date(Details?.verified_at).toLocaleTimeString().substring(0,5)) : '-'}</span>
            //                                 </td>
            //                             </>
            //                             :
            //                             <>
            //                                 <td>
            //                                     <b>{Details?.verified_at ? 'Verified By' : 'Submitted To'}</b><br />
            //                                     <span>{Details?.verifier_person && Details?.verifier_person}</span>
            //                                 </td>
            //                                 <td>
            //                                     <b>Verified At</b><br />
            //                                     <span>{Details?.verified_at ? (moment(new Date(Details?.verified_at)).format('DD-MM-YYYY') + ' at ' + new Date(Details?.verified_at).toLocaleTimeString().substring(0,5)) : '-'}</span>
            //                                 </td>
            //                             </>
            //                         }
            //                         <td>
            //                             <b>Status</b><br />
            //                             <Status status={Details?.status} />
            //                         </td>
            //                     </tr>
            //                 </tbody>
            //             </table>
            //         </>
            //     );
            // }).catch(err => console.log(err));
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
                                <h6>
                                    <b>No. of Transactions:</b> {Requests?.length}
                                </h6>
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Ref #</th>
                                            <th>Fuel (ltr.)</th>
                                            <th>Requested At</th>
                                            <th>Date & Time</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            Requests.map((val, i) => {
                                                const { in_out, request_id, quantity_in_ltr, inserted_at, fuel_requested_at } = val;
                                                const d = new Date(inserted_at);
                                                return (
                                                    <tr key={i}>
                                                        <td>{i+1}</td>
                                                        <td onClick={() => loadTransactionDetails(request_id, in_out)}>
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
                                                            {fuel_requested_at && fuel_requested_at && moment(new Date(fuel_requested_at)).format('DD-MM-YYYY')}
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