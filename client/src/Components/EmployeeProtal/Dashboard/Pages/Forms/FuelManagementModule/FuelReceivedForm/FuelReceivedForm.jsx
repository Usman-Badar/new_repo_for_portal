/* eslint-disable eqeqeq */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react';
import './FuelReceivedForm.css';
import JSAlert from 'js-alert';
import moment from 'moment';
import axios from '../../../../../../../axios';

function FuelRecievedFrom() {
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
    const [Requests, setRequests] = useState();

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
    const GetCompanies = (isActive) => {
        axios.get('/getallcompanies')
        .then(res => {
            if (!isActive) return;
            setCompanies(res.data);
            GetLocations();
        }).catch(err => console.log(err));
    }
    const GetLocations = () => axios.get('/getalllocations').then(res => setLocations(res.data)).catch(err => console.log(err));
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
            JSAlert.alert('Fuel receival confirmed', 'Success', JSAlert.Icons.Success).dismissIn(2000);
        }).catch(err => {
            console.log(err);
            JSAlert.alert('Failed To complete!!', 'Request Failed', JSAlert.Icons.Failed).dismissIn(4000);
            fieldsetRef.current.disabled = false;
            btnRef.current.innerHTML = 'Submit';
        });
    }
    const loadRequests = (isActive) => {
        axios.post('/fuel-managent/fuel-receival-for-workshop/requests', {emp_id: localStorage.getItem("EmpID")}).then(res => {
            if (!isActive) return;
            setRequests(res.data);
        }).catch(err => console.log(err));
    }
    function isValidDate(d) {
        // const date1 = moment(d, 'DD-MM-YYYY').valueOf();
        // const date2 = moment(new Date(), 'DD-MM-YYYY').valueOf();
        
        // if (date1 > date2) {
        //     return false;
        // }
        return true;
    }

    return (
        <>
            <div className='FuelRecievedFrom page'>
                <div className="page-content mb-3">
                    <h3 className="heading">
                        Fuel Management Module
                        <sub>Fuel Received for QFS Workshop from Supplier</sub>
                    </h3>
                    <hr />
                    <form ref={formRef} onSubmit={onSubmit}>
                        <fieldset ref={fieldsetRef}>
                            <div className="d-flex mb-2" style={{gap: '20px'}}>
                                <div className='w-50'>
                                    <label className='mb-0'>
                                        <b>Company</b>
                                    </label>
                                    <select className="form-control" ref={companyRef} required>
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
                            <div className="d-flex mb-2" style={{gap: '20px'}}>
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
                                    <input type="date" className="form-control" ref={dateRef} required />
                                </div>
                            </div>

                            <div className="mb-3">
                                <label className='mb-0'>
                                    <b>Fuel (Ltr.)</b>
                                </label>
                                <input type='number' min={1} className="form-control" ref={fuelRef} required />
                            </div>

                            <div className='d-flex justify-content-end align-items-center'>
                                <button className="btn light" type="button">Cancle</button>
                                <button className="btn ml-3 submit" type='submit' ref={btnRef}>
                                    Submit
                                </button>
                            </div>
                        </fieldset>
                    </form>
                </div>
                <div className='page-content'>
                    <h3 className="heading">
                        Requests
                        <sub>List of the Requests</sub>
                    </h3>
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
                                    Requests.reverse().map(
                                        ({company_name, location_name, supplier, fuel_received, receival_date, submit_person, submitted_at, status}, i) => (
                                            <tr key={i} className='pointer pointer-hover'>
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
                                                <td className='border-top-0'>{status}</td>
                                            </tr>
                                        )
                                    )
                                }
                            </tbody>
                        </table>
                    }
                </div>
            </div>
        </>
    )
}

export default FuelRecievedFrom