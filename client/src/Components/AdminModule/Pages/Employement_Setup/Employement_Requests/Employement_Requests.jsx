import React, { useEffect, useState } from 'react';
import './Employement_Requests.css';
import { useHistory } from 'react-router-dom';
import axios from '../../../../../axios';
import JSAlert from 'js-alert';

const Employement_Requests = () => {

    const [ Employee, setEmployee ] = useState([]);
    const history  = useHistory();
    const key = 'real secret keys should be long and random';
    const encryptor = require('simple-encryptor')(key);

    useEffect(() => {getAllTempEmp()}, []);
    const getAllTempEmp = () => {
        axios.get('/getalltempemployee').then( response => {
            setEmployee( response.data );
        } ).catch( err => {
            console.log(err);
            JSAlert.alert(`Something went wrong. ${err}`, "Failed To Fetch", JSAlert.Icons.Failed);
        } );
    }

    return (
        <>
            <div className='page'>
                <div className='page-content'>
                    <div className="d-flex align-items-center justify-content-between">
                        <h3 className="heading">
                            Employment Requests
                            <sub>View All Employment Requests</sub>
                        </h3>
                        <div>
                            <button className='btn submit' onClick={() => history.push('/admin_employement_requests/admin_employement_setup')}>Create Employee</button>
                        </div>
                    </div>
                    <hr />
                    {
                        Employee.length === 0
                        ?
                        <h6 className='text-center'>No Request Found</h6>
                        :
                        <table className='table'>
                            <thead>
                                <tr>
                                    <th className='border-top-0'>Sr.No</th>
                                    <th className='border-top-0'>Name</th>
                                    <th className='border-top-0'>Created By</th>
                                    <th className='border-top-0'>Created At</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    Employee.filter(val => {return (sessionStorage.getItem('userName') === 'UsmanBadar' ? val : encryptor.decrypt(val.user_name) === sessionStorage.getItem('userName'))}).map(
                                        ({name, user_name, created_at, emp_id}, i) => {
                                            return (
                                                <tr className='pointer pointer-hover' key={i} onClick={() => history.push("/admin_employement_requests/admin_view_temp_employee/" + emp_id)}>
                                                    <td>{i+1}</td>
                                                    <td>{name}</td>
                                                    <td>{encryptor.decrypt(user_name)}</td>
                                                    <td>{new Date(created_at).toDateString()}</td>
                                                </tr>
                                            )
                                        }
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

export default Employement_Requests;