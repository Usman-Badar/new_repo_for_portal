import React, { useEffect, useState } from 'react';
import axios from '../../../../../../../axios';
import moment from 'moment';

const StockAtWorkshop = () => {
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
    const loadTransactions = (isActive) => {
        axios.get('/fuel-managent/fuel-receival-for-workshop/transactions').then(res => {
            if (!isActive) return;
            let total = 0;
            for (let x = 0; x < res.data.length; x++) {
                const q = parseFloat(res.data[x].quantity_in_ltr); 
                if (res.data[x].in_out === 'IN') {
                    total = total + q;
                }
            }
            setTotal(total);
            setRequests(res.data);
        }).catch(err => console.log(err));
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
            <div className="page">
                <div className="page-content">
                    <h3 className="heading">
                        Fuel At Workshop
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
                                    <h6 className='text-center mb-0'>Total Stock at Workshop</h6>
                                </div>
                            </div>
                            <div className="col-8" style={{maxHeight: '75vh', overflow: 'auto'}}>
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Ref #</th>
                                            <th>Fuel (ltr.)</th>
                                            <th>Date & Time</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            Requests.map((val, i) => {
                                                const { in_out, request_id, quantity_in_ltr, inserted_at } = val;
                                                const d = new Date(inserted_at);
                                                return (
                                                    <tr key={i}>
                                                        <td>{i+1}</td>
                                                        <td>{request_id}</td>
                                                        {
                                                            in_out === 'IN'
                                                            ?
                                                            <td className='text-success'>+{quantity_in_ltr}</td>
                                                            :
                                                            <td className='text-danger'>-{quantity_in_ltr}</td>
                                                        }
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

export default StockAtWorkshop;
