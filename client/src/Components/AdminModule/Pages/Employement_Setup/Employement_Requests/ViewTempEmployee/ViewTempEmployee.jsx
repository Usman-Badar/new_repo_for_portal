import React, { useEffect, useState } from 'react';

import './ViewTempEmployee.css';
import axios from '../../../../../../axios';
import { Link } from 'react-router-dom';


import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ViewTempEmployee = () => {

    const [ Employee, setEmployee ] = useState([]);
    const [ Status, setStatus ] = useState();

    useEffect(
        () => {

            const Data = new FormData();
            Data.append('empID', window.location.href.split('/').pop());
            axios.post('/gettempemployeedetails', Data).then( response => {

                setEmployee( response.data );
                setStatus( response.data[0].emp_status );

            } ).catch( err => {

                toast.dark( err , {
                    position: 'top-right',
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });;

            } );

        }, []
    )

    return (
        <>
            <div className='ViewTempEmployee d-center'>
                <div className="ViewTempEmployee-content">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <Link to="/admin_employement_requests" className="text-dark"><i className="las la-arrow-left"></i> Go Back</Link>
                        {

                            Status === 'Waiting For Approval'
                            ?
                            <Link to={ "/admin_employement_requests/confirmapproval/" + window.location.href.split('/').pop() } className="btn btn-sm btn-info">Confirm Approval</Link>
                            :
                            null

                        }
                    </div>
                    <h2 className="text-center mb-4">Employee Details</h2>
                    {
                        Employee.length === 0
                        ?
                        <h4 className="text-center">No Record Found</h4>
                        :
                        Employee.map(
                            ( val, index ) => {

                                return (
                                    <div key={ index }>
                                    <div className="container-fluid">
                                        <h4 className="text-center">Personal Information</h4>
                                        <div className="row py-5">
                                            <div className="col-lg-4 col-md-6 col-sm-12 text-center">
                                                <img src={ 'images/employees/' + val.emp_image } className="emp_img" alt="Employee Img" />
                                            </div>
                                            <div className="col-lg-8 col-md-6 col-sm-12 d-center">
                                                <div className="w-100">
                                                    <div className="d-flex align-items-center mb-2">
                                                        <div className="w-50 mr-1">
                                                            <span>Name</span>
                                                            <input type="text" className="form-control" value={val.name} readOnly />
                                                        </div>
                                                        <div className="w-50 ml-1">
                                                            <span>Father Name</span>
                                                            <input type="text" className="form-control" value={val.father_name} readOnly />
                                                        </div>
                                                    </div>
                                                    <div className="d-flex align-items-center mb-2">
                                                        <div className="w-50 mr-1">
                                                            <span>Date Of Birth</span>
                                                            <input type="date" className="form-control" value={val.date_of_birth.substring(0,10)} readOnly />
                                                        </div>
                                                        <div className="w-50 ml-1">
                                                            <span>Place Of Birth</span>
                                                            <input type="text" className="form-control" value={val.place_of_birth} readOnly />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="container-fluid">
                                        <h4 className="text-center">CNIC Information</h4>
                                        <div className="row py-5">
                                            <div className="col-lg-6 col-md-6 col-sm-12 text-center">
                                                <img src={ 'images/documents/cnic/front/' + val.cnic_front_image } className="cnic_images emp_front_cnic" alt="CNIC Front Img" />
                                                <b className="d-block pt-2">CNIC Front Image</b>
                                            </div>
                                            <div className="col-lg-6 col-md-6 col-sm-12 text-center">
                                                <img src={ 'images/documents/cnic/back/' + val.cnic_back_image } className="cnic_images emp_back_cnic" alt="CNIC Back Img" />
                                                <b className="d-block pt-2">CNIC Back Image</b>
                                            </div>
                                            <div className="col-lg-12 col-md-12 col-sm-12">
                                                <div className="d-flex align-items-center pt-4">
                                                    <div className="w-50 mr-1">
                                                        <span>CNIC</span>
                                                        <input type="text" className="form-control" value={val.cnic} readOnly />
                                                    </div>
                                                    <div className="w-50 ml-1">
                                                        <span>CNIC Place Of Issue</span>
                                                        <input type="text" className="form-control" value={val.cnic_place_of_issue} readOnly />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-lg-12 col-md-12 col-sm-12">
                                                <div className="d-flex align-items-center pt-4">
                                                    <div className="w-50 mr-1">
                                                        <span>CNIC Issue Date</span>
                                                        <input type="date" className="form-control" value={val.cnic_date_of_issue.substring(0,10)} readOnly />
                                                    </div>
                                                    <div className="w-50 ml-1">
                                                        <span>CNIC Expiry Date</span>
                                                        <input type="date" className="form-control" value={val.cnic_date_of_expiry.substring(0,10)} readOnly />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="container-fluid">
                                        <h4 className="text-center">Other Documents Information</h4>
                                        <div className="row py-5">
                                            <div className="col-lg-6 col-md-6 col-sm-12 text-center">
                                                <img src={ 'images/documents/cv/' + val.cv } className="emp_docs_images" alt="CV Img" />
                                                <b className="d-block pt-2">CV Image</b>
                                            </div>
                                            <div className="col-lg-6 col-md-6 col-sm-12 text-center">
                                                <img src={ 'images/documents/address/' + val.proof_of_address } className="emp_docs_images" alt="Address Img" />
                                                <b className="d-block pt-2">Address Image</b>
                                            </div>
                                            {
                                                val.armed_license === null
                                                ?
                                                null
                                                :
                                                <div className="col-lg-6 col-md-6 col-sm-12 text-center">
                                                    <img src={'images/documents/licenses/armed/' + val.armed_license} className="emp_docs_images" alt="CV Img" />
                                                    <b className="d-block pt-2">Armed License Image</b>
                                                </div>
                                            }
                                            {
                                                val.driving_license === null
                                                ?
                                                null
                                                :
                                                <div className="col-lg-6 col-md-6 col-sm-12 text-center">
                                                    <img src={'images/documents/licenses/driving/' + val.driving_license} className="emp_docs_images" alt="CV Img" />
                                                    <b className="d-block pt-2">Driving License Image</b>
                                                </div>
                                            }
                                        </div>
                                    </div>
                                    </div>
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