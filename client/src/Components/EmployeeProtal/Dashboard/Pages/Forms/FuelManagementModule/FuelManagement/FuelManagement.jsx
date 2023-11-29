/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react';
import './FuelManagement.css';
import axios from '../../../../../../../axios';
import JSAlert from 'js-alert';

function FuelManagement() {
    const companyRef = useRef();
    const locationRef = useRef();
    const typeRef = useRef();
    const numberRef = useRef();
    const btnRef = useRef();
    const formRef = useRef();
    const fieldsetRef = useRef();
    const [Companies, setCompanies] = useState([]);
    const [Locations, setLocations] = useState([]);
    const [Equipments, setEquipments] = useState([]);

    useEffect(
        () => {
            let isActive = true;
            loadEquipments(isActive);
            return () => {
                isActive = false;
            }
        }, [Companies]
    );
    useEffect(
        () => {
            window.addEventListener("beforeunload", beforeunload);
            let isActive = true;
            GetCompanies(isActive);
            return () => {
                isActive = false;
            }
        }, []
    );

    const beforeunload = (e, ) => {
        if (fieldsetRef.current.disabled) {
            e.preventDefault();
            e.returnValue = true;
        }
    }
    const onSubmit = (e) => {
        e.preventDefault();
        if (companyRef.current.value.trim().length === 0) {
            JSAlert.alert('Company is required!!', 'Validation Error', JSAlert.Icons.Warning).dismissIn(4000);
            return false;
        }else if (locationRef.current.value.trim().length === 0) {
            JSAlert.alert('Location is required!!', 'Validation Error', JSAlert.Icons.Warning).dismissIn(4000);
            return false;
        }else if (typeRef.current.value.trim().length === 0) {
            JSAlert.alert('Equipment Type is required!!', 'Validation Error', JSAlert.Icons.Warning).dismissIn(4000);
            return false;
        }else if (numberRef.current.value.trim().length === 0) {
            JSAlert.alert('Equipment Number is required!!', 'Validation Error', JSAlert.Icons.Warning).dismissIn(4000);
            return false;
        }

        fieldsetRef.current.disabled = true;
        btnRef.current.innerHTML = 'Please Wait...';
        axios.post(
            '/fuel-managent/company-equipment-setup-entry',
            {
                company_code: companyRef.current.value,
                location_code: locationRef.current.value,
                type_id: typeRef.current.value,
                equipment_number: numberRef.current.value,
                emp_id: localStorage.getItem('EmpID')
            }
        ).then(() => {
            fieldsetRef.current.disabled = false;
            btnRef.current.innerHTML = 'Submit';
            formRef.current.reset();
            JSAlert.alert('Equiment has been setup', 'Success', JSAlert.Icons.Success).dismissIn(2000);
            loadEquipments(true);
        }).catch(err => {
            console.log(err);
            JSAlert.alert('Failed To Add!!', 'Request Failed', JSAlert.Icons.Failed).dismissIn(4000);
            fieldsetRef.current.disabled = false;
            btnRef.current.innerHTML = 'Submit';
        });
    }
    const loadEquipments = (isActive) => {
        axios.get('/fuel-managent/equipment-types').then(res => {
            if (!isActive) return;
            setEquipments(res.data);
        }).catch(err => console.log(err));
    }
    const GetCompanies = (isActive) => {
        axios.get('/getallcompanies')
        .then(res => {
            if (!isActive) return;
            setCompanies(res.data);
            GetLocations();
        }).catch(err => console.log(err));
    }
    const GetLocations = () => axios.get('/getalllocations').then(res => setLocations(res.data)).catch(err => console.log(err));

    return (
        <>
            <div className='FuelManagement page'>

                <div className="page-content">
                    <h3 className="heading">
                        Fuel Management Module
                        <sub>Comapany Equipment Setup Form</sub>
                    </h3>

                    <hr />
                    <form onSubmit={onSubmit} ref={formRef}>
                        <fieldset ref={fieldsetRef}>
                            <div className="flex_container mb-3">
                                <div>
                                    <label className='mb-0'><b>Company</b></label>
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
                                                        >{val.company_name}</option>
                                                    )

                                                }
                                            )
                                        }
                                    </select>
                                </div>
                                <div>
                                    <label className='mb-0'><b>Location</b></label>
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
                                                        >{val.location_name}</option>
                                                    );

                                                }
                                            )
                                        }
                                    </select>
                                </div>
                            </div>
                            <div className="flex_container mb-3">
                                <div>
                                    <label className='mb-0'><b>Equipment Type</b></label>
                                    <select className="form-control" ref={typeRef} required>
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
                                <div>
                                    <label className='mb-0'><b>Equipment Number</b></label>
                                    <input type="text" className="form-control" ref={numberRef} required />
                                </div>
                            </div>
                            <div className='d-flex justify-content-end align-items-center mt-3'>
                                <button className="btn light" type="button">Cancle</button>
                                <button className="btn ml-3 submit" ref={btnRef} type='submit'>
                                    Submit
                                </button>
                            </div>
                        </fieldset>
                    </form>
                </div>
            </div>
        </>
    )
}

export default FuelManagement