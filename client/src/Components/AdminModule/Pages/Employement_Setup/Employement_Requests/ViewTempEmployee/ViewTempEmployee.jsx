/* eslint-disable jsx-a11y/iframe-has-title */
import React, { useEffect, useState } from 'react';

import './ViewTempEmployee.css';
import axios from '../../../../../../axios';
import { useHistory } from 'react-router-dom';
import JSAlert from 'js-alert';

const ViewTempEmployee = () => {
    const history = useHistory();
    const [ Employee, setEmployee ] = useState([]);

    useEffect(
        () => {
            const Data = new FormData();
            Data.append('empID', window.location.href.split('/').pop());
            axios.post('/gettempemployeedetails', Data).then( response => {
                setEmployee( response.data );
            } ).catch( err => {
                console.log(err);
                JSAlert.alert(`Something went wrong. ${err}`, "Failed To Fetch", JSAlert.Icons.Failed);
            } );
        }, []
    )

    return (
        <>
            <div className='page'>
                <div className='page-content'>
                    <div className="d-flex align-items-center justify-content-between">
                        <h3 className="heading">
                            Employee Details
                            <sub>View The Employee Details</sub>
                        </h3>
                        <div>
                            <button className='btn light' onClick={() => history.goBack()}>Back</button>
                            {
                                sessionStorage.getItem('userName') === 'UsmanBadar' || sessionStorage.getItem('userName') === 'MMalahim'
                                ?
                                <button className='btn submit ml-2' onClick={() => history.push(`/admin_employement_requests/confirmapproval/${window.location.href.split('/').pop()}`)}>Proceed</button>
                                :null
                            }
                        </div>
                    </div>
                    <hr />
                    {
                        Employee.length === 0
                        ?
                        <h4 className="text-center">No Record Found</h4>
                        :
                        Employee.map(
                            ({emp_image, name, cnic, cv, proof_of_address, cnic_place_of_issue, father_name, date_of_birth, place_of_birth, cnic_front_image, cnic_back_image}, i) => {
                                return (
                                    <table key={i} className='table table-borderless'>
                                        <tbody>
                                            <tr>
                                                <td className='text-center'>
                                                    <img className='rounded border' src={`${process.env.REACT_APP_SERVER}/client/images/employees/${emp_image}`} width='200' alt="Employee Img" />
                                                </td>
                                                <td>
                                                    <b>Employee Name</b><br />
                                                    <span>{name}</span>
                                                    <br /><br />
                                                    <b>Date of Birth</b><br />
                                                    <span>{date_of_birth}</span>
                                                </td>
                                                <td>
                                                    <b>Father Name</b><br />
                                                    <span>{father_name}</span>
                                                    <br /><br />
                                                    <b>Place of Birth</b><br />
                                                    <span>{place_of_birth}</span>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <h5 className='mb-3'>CNIC Information</h5>
                                                    <b>CNIC Number</b><br />
                                                    <span>{cnic}</span>
                                                    <br /><br />
                                                    <b>CNIC Place of Issue</b><br />
                                                    <span>{cnic_place_of_issue}</span>
                                                </td>
                                                <td className='text-center'>
                                                    <img className='rounded border' src={`${process.env.REACT_APP_SERVER}/client/images/documents/cnic/front/${cnic_front_image}`} width='100%' alt="CNIC Front Img" />
                                                    <p className='mb-0 font-weight-bold'>CNIC Front Image</p>
                                                </td>
                                                <td className='text-center'>
                                                    <img className='rounded border' src={`${process.env.REACT_APP_SERVER}/client/images/documents/cnic/back/${cnic_back_image}`} width='100%' alt="CNIC Back Img" />
                                                    <p className='mb-0 font-weight-bold'>CNIC Back Image</p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <h5>Documents Information</h5>
                                                </td>
                                                <td className='text-center'>
                                                    {
                                                        cv.includes('.pdf')
                                                        ?
                                                        <iframe className='rounded border' src={`${process.env.REACT_APP_SERVER}/client/images/documents/cv/${cv}`} width='100%'></iframe>
                                                        :
                                                        <img className='rounded border' src={`${process.env.REACT_APP_SERVER}/client/images/documents/cv/${cv}`} width='100%' alt="CV" />
                                                    }
                                                    <p className='mb-0 font-weight-bold'>Employee CV</p>
                                                </td>
                                                <td className='text-center'>
                                                    <img className='rounded border' src={`${process.env.REACT_APP_SERVER}/client/images/documents/address/${proof_of_address}`} width='100%' alt="Employee Proof of Address" />
                                                    <p className='mb-0 font-weight-bold'>Employee Proof of Address</p>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                )
                            }
                        )
                    }
                </div>
            </div>
        </>
    )

}

export default ViewTempEmployee;