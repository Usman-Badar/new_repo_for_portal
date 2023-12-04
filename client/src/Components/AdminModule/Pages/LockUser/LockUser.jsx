/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import axios from '../../../../axios';
import Modal from '../../../UI/Modal/Modal';
import $ from 'jquery';

const LockUser = () => {
    const [ companies, setCompanies ] = useState([]);
    const [ employees, setEmployees ] = useState([]);
    const [ companyCode, setCompanyCode ] = useState();
    const [ modal, setModal ] = useState();
    const [ keywords, setKeywords ] = useState('');

    useEffect(
        () => {
            GetCompanies();
        }, []
    )
    useEffect(
        () => {
            if (companyCode) loadEmployees();
        }, [companyCode]
    )
    const GetCompanies = () => axios.get('/getallcompanies').then(res => setCompanies(res.data)).catch(err => console.log(err));
    const loadEmployees = () => {
        axios.post('/employees/company_code', {company_code: companyCode})
        .then(res => {
            setEmployees(res.data);
        }).catch(err => {
            console.log(err);
        });
    }
    const openModal = (val, i) => {
        val.index = i;
        setModal(val);
    }
    const updateEmployee = (e) => {
        e.preventDefault();
        $('fieldset').prop('disabled', true);
        const lock_user = e.target['lock_user'].value;
        const remarks = e.target['remarks'].value;
        axios.post('/employees/update_lock', {emp_id: modal.emp_id, lock_user: lock_user, remarks: remarks})
        .then(() => {
            setModal();
            loadEmployees();
        }).catch(err => {
            console.log(err);
        });
    }
    return (
        <div className='page pt-3'>
            {modal && <Modal Hide={() => setModal()} show content={
                <>
                    <h5>Update Employee Login Access</h5>
                    <hr />
                    <form onSubmit={updateEmployee}>
                        <fieldset>
                            <label className="mb-0"><b>Lock</b></label>
                            <select required name="lock_user" className='form-control mb-3'>
                                <option value="N" selected={modal.lock_user === 'N'}>Unlock User</option>
                                <option value="Y" selected={modal.lock_user === 'Y'}>Lock User</option>
                            </select>
                            <label className="mb-0"><b>Remarks</b></label>
                            <textarea name="remarks" className='form-control mb-3' required />

                            <button className="submit btn d-block ml-auto">Update</button>
                        </fieldset>
                    </form>
                </>
            } />}
            <div className="page-content">
                <h1 className="heading">
                    User Lock
                    <sub>Restrict user to login</sub>
                </h1>
                <hr />
                <div className="d-flex" style={{gap: '20px'}}>
                    <div className='w-50'>
                        <label className="mb-0"><b>Company</b></label>
                        <select onChange={(e) => setCompanyCode(e.target.value)} className='form-control'>
                            <option value="">Select</option>
                            {companies.map((val, i) => <option key={i} value={val.company_code}>{val.company_name}</option>)}
                        </select>
                    </div>
                    <div className='w-50'>
                        <label className="mb-0"><b>Search Employee</b></label>
                        <input onChange={(e) => setKeywords(e.target.value)} placeholder='Search Keywords' className='form-control' />
                    </div>
                </div>
                <br />
                {companyCode && <h5>Total Records Found: {employees.length}</h5>}
                <table className='table table-bordered'>
                    <thead>
                        <tr>
                            <th>Sr.No</th>
                            <th>Employee</th>
                            <th>Employee Status</th>
                            <th colSpan={2}>Lock User</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            employees.filter(val => val.name.toLocaleLowerCase().includes(keywords.toLocaleLowerCase())).map((val, i) => {
                                return (
                                    <tr key={i}>
                                        <td>{i+1}</td>
                                        <td>
                                            <div className="d-flex align-items-center">
                                                <img src={`${process.env.REACT_APP_SERVER}/images/employees/${val.emp_image}`} alt='employee' width={50} height={50} className='rounded-circle' />
                                                <div className='pl-2'>
                                                    <b>{val.name}</b><br />
                                                    <span>{val.department_name}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td>{val.emp_status}</td>
                                        <td>{val.lock_user}</td>
                                        <td>
                                            <button className={'btn btn-sm d-block ml-auto ' + (modal && modal.index === i ? 'btn-dark' : 'btn-outline-dark')} onClick={() => openModal(val, i)}>Update</button>
                                        </td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default LockUser;
