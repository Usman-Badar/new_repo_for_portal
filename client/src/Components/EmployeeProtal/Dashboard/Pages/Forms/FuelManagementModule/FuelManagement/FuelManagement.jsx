/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react';
import './FuelManagement.css';
import axios from '../../../../../../../axios';
import JSAlert from 'js-alert';
import moment from 'moment';

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
    const [List, setList] = useState([]);
    const [RowDetails, setRowDetails] = useState();
    const [Loading, setLoading] = useState(false);
    const [ID, setID] = useState();

    const [ FilterCompany, setFilterCompany ] = useState('');
    const [ FilterLocation, setFilterLocation ] = useState('');
    const [ FilterEquipmentType, setFilterEquipmentType ] = useState('');
    const [ FilterEquipmentNumber, setFilterEquipmentNumber ] = useState('');
    const [ StartDate, setStartDate ] = useState('');
    const [ EndDate, setEndDate ] = useState('');

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
            loadRequests(isActive);
            return () => {
                isActive = false;
            }
        }, []
    );
    useEffect(
        () => {
            if ( sessionStorage.getItem('FilterCompany') && sessionStorage.getItem('FilterCompany') !== '' ) setFilterCompany(sessionStorage.getItem('FilterCompany'));
            if ( sessionStorage.getItem('FilterLocation') && sessionStorage.getItem('FilterLocation') !== '' ) setFilterLocation(sessionStorage.getItem('FilterLocation'));
            if ( sessionStorage.getItem('FilterEquipmentType') && sessionStorage.getItem('FilterEquipmentType') !== '' ) setFilterEquipmentType(sessionStorage.getItem('FilterEquipmentType'));
            if ( sessionStorage.getItem('FilterEquipmentNumber') && sessionStorage.getItem('FilterEquipmentNumber') !== '' ) setFilterEquipmentNumber(sessionStorage.getItem('FilterEquipmentNumber'));
        }, []
    );
    useEffect(
        () => {
            if (StartDate.length > 0) {
                loadDetailsFiltered();
            }else {
                setEndDate('');
                if (RowDetails) loadDetails(RowDetails.data);
            }
        }, [StartDate, EndDate]
    );

    const loadRequests = (isActive) => {
        axios.get('/fuel-managent/equipments')
        .then(res => {
            if (!isActive) return;
            setList(res.data);
            GetCompanies(isActive);
        }).catch(err => console.log(err));
    }
    const loadDetailsFiltered = () => {
        setLoading(true);
        axios.post('/fuel-managent/equipments/details/filtered', {id: ID, startDate: StartDate, endDate: EndDate})
        .then(res => {
            setRowDetails({
                data: RowDetails.data,
                total: res.data[0].total,
                transactions: res.data[1]
            });
            setLoading(false);
        }).catch(err => console.log(err));
    }
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
            loadRequests(true);
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
    const loadDetails = (val) => {
        setLoading(true);
        axios.post('/fuel-managent/equipments/details', {id: val.id})
        .then(res => {
            setRowDetails({
                data: val,
                total: res.data[0].total,
                transactions: res.data[1]
            });
            setID(val.id);
            setLoading(false);
        }).catch(err => console.log(err));
    }
    const GetLocations = () => axios.get('/getalllocations').then(res => setLocations(res.data)).catch(err => console.log(err));

    return (
        <>
            <div className='FuelManagement page'>
                <div className="page-content">
                    <h3 className="heading">
                        Setup Company Equipments
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
                                <button className="btn submit" ref={btnRef} type='submit'>
                                    Enter
                                </button>
                            </div>
                        </fieldset>
                    </form>
                </div>
                <br />
                {
                    Loading || RowDetails
                    ?
                    <div className="page-content popUps">
                        {!RowDetails && <h6 className='text-center font-weight-bold mb-0'>Loading...</h6>}
                        {
                            RowDetails && (
                                <div className="container-fluid">
                                    <div className="row">
                                        <div className="col-3">
                                            <div style={{position: 'sticky', top: 0}}>
                                                <table className="table table-striped mb-0">
                                                    <tbody>
                                                        <tr>
                                                            <td>
                                                                <h3 className='text-center mb-0' style={{fontFamily: 'Maersk'}}>
                                                                    <b>{parseFloat(RowDetails?.total).toFixed(2)}</b> {' '}
                                                                    <small style={{fontSize: '12px'}} className='text-secondary'><b>Ltr.</b></small>
                                                                </h3>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td>
                                                                <b>Equipment Type</b><br />
                                                                {RowDetails?.data?.equipment_type_name}
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td>
                                                                <b>Equipment Number</b><br />
                                                                {RowDetails?.data?.equipment_number}
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td>
                                                                <b>Created At</b><br />
                                                                {moment(new Date(RowDetails?.data?.created_at)).format('DD-MM-YYYY HH:mm a')}
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                        <div className="col-9">
                                            <div className="d-flex justify-content-between align-items-end mb-3">
                                                <h4 className='mb-0' style={{fontFamily: "Roboto-Light"}}><b>Transactions:</b> {RowDetails?.transactions?.length}</h4>
                                                <div className="d-flex align-items-end" style={{gap: 10}}>
                                                    <div>
                                                        <label className='mb-0'><b>{StartDate.length > 0 ? "Start Date" : "Date"}</b></label>
                                                        <input type="date" className='form-control' onChange={(e) => setStartDate(e.target.value)} />
                                                    </div>
                                                    {
                                                        StartDate.length > 0 && (
                                                            <div>
                                                                <label className='mb-0'><b>End Date</b></label>
                                                                <input type="date" className='form-control' onChange={(e) => setEndDate(e.target.value)} />
                                                            </div>
                                                        )
                                                    }
                                                    <button className='btn light' onClick={() => setRowDetails()}>Back</button>
                                                </div>
                                            </div>
                                            <table className="table table-bordered mb-0">
                                                <thead>
                                                    <tr>
                                                        <th>#</th>
                                                        <th>Quantity</th>
                                                        <th>Inserted At</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        RowDetails?.transactions?.map(
                                                            (val, i) => {
                                                                return (
                                                                    <tr key={i}>
                                                                        <td>{i+1}</td>
                                                                        <td>{val.quantity_in_ltr}</td>
                                                                        <td>{moment(new Date(val.inserted_at)).format('YYYY-MM-DD HH:mm a')}</td>
                                                                    </tr>
                                                                )
                                                            }
                                                        )
                                                    }
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            )
                        }
                    </div>
                    :
                    <div className="page-content popUps">
                        <div className="d-flex justify-content-end align-items-center mb-3" style={{gap: 15}}>
                            <div>
                                <label className="mb-0"><b>Company</b></label>
                                <select value={FilterCompany} onChange={
                                    e => {
                                        setFilterCompany(e.target.value);
                                        sessionStorage.setItem('FilterCompany', e.target.value);
                                    }
                                } className="form-control">
                                    <option value=''>Show All</option>
                                    {Companies.map(val => <option key={val.company_name} value={val.company_name}>{val.company_name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="mb-0"><b>Location</b></label>
                                <select value={FilterLocation} onChange={
                                    e => {
                                        setFilterLocation(e.target.value);
                                        sessionStorage.setItem('FilterLocation', e.target.value);
                                    }
                                } className="form-control">
                                    <option value=''>Show All</option>
                                    {Locations.map(val => <option key={val.location_name} value={val.location_name}>{val.location_name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="mb-0"><b>Equipment Type</b></label>
                                <select value={FilterEquipmentType} onChange={
                                    e => {
                                        setFilterEquipmentType(e.target.value);
                                        sessionStorage.setItem('FilterEquipmentType', e.target.value);
                                    }
                                } className="form-control">
                                    <option value=''>Show All</option>
                                    {Equipments.map(({ equipment_type }) => <option value={equipment_type}>{equipment_type}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="mb-0"><b>Equipment Number</b></label>
                                <input value={FilterEquipmentNumber} onChange={
                                    e => {
                                        setFilterEquipmentNumber(e.target.value);
                                        sessionStorage.setItem('FilterEquipmentNumber', e.target.value);
                                    }
                                } className="form-control" />
                            </div>
                        </div>
                        {
                            List.length === 0
                            ?
                            <h5 className="text-center mb-0">Please Wait...</h5>
                            :
                            <table className="table mb-0">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Company</th>
                                        <th>Location</th>
                                        <th>Equipment Type</th>
                                        <th>Equipment Number</th>
                                        <th>Created At</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        List.filter(val => {
                                            return val.company_name.includes(FilterCompany) && 
                                            val.location_name.includes(FilterLocation) &&
                                            val.equipment_type_name.includes(FilterEquipmentType) &&
                                            val.equipment_number.toLowerCase().includes(FilterEquipmentNumber.toLowerCase())
                                        }).map((val, i) => {
                                            const { company_name, location_name, equipment_type_name, equipment_number, created_at } = val;
                                            const d = new Date(created_at);
                                            return (
                                                <tr key={i} className='pointer' onClick={(() => loadDetails(val))}>
                                                    <td>{i+1}</td>
                                                    <td>{company_name}</td>
                                                    <td>{location_name}</td>
                                                    <td>{equipment_type_name}</td>
                                                    <td>{equipment_number}</td>
                                                    <td>{moment(d).format('DD-MM-YYYY HH:mm a')}</td>
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </table>
                        }
                    </div>
                }
            </div>
        </>
    )
}

export default FuelManagement