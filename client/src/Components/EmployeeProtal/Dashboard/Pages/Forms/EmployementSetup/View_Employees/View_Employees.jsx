import axios from "../../../../../../../axios";
import React, { useState, useEffect } from "react";
import './View_Employees.css';

import Menu from "../../../../../../UI/Menu/Menu";

const Admin_View_Employees = () => {

    const [EmployeeID, setEmployeeID] = useState([]);
    const [Employee, setEmployee] = useState([]);

    const [Data, setData] = useState([{}]);

    useEffect(
        () => {

            setData(
                [
                    {
                        icon: 'las la-cloud-upload-alt',
                        txt: 'Create Employee',
                        link: true,
                        href: '/employment_setup/form',
                    },
                    {
                        icon: 'las la-cloud-upload-alt',
                        txt: 'View Employee',
                        link: true,
                        href: '/employment_setup/employees'
                    },
                    {
                        icon: 'las la-cloud-upload-alt',
                        txt: 'Employement Request',
                        link: true,
                        href: '/employment_setup/requests'
                    }
                ]

            );

        }, []
    )

    useEffect(
        () => {

            axios.get('/getemployeesid&name').then(
                ( res ) => {

                    setEmployeeID( res.data );

                }
            ).catch(
                ( err ) => {

                    console.log( err );

                }
            )
        
        }
    , []) 

    const EmployeeDetails = ( e ) =>{
        
        axios.post('/getemployee',
        {
            empID: e.target.value
        }
        ).then(
            ( res ) => {
                setEmployee( res.data );
            }
        ).catch(
            ( err ) => {

                console.log( err );

            }
        )

    }

    return (
        <>
            <Menu data={Data} />

            <div className="View_Employees">
                
                <div className="jumbotron-fluid bg-white m-5 mb-0 shadow-sm p-4 rounded">

                    <div className="container-fluid row">

                        <div className="col-lg-6 col-md-12 col-sm-12">
                            <h6> Select Company </h6>
                            <select className="form-control" onChange={EmployeeDetails} required>
                                <option value=''></option>
                                {
                                    EmployeeID.map(
                                        (val, index) => {
                                            return (
                                                <option value={val.emp_id}>{val.emp_id} {val.name}</option>
                                            )
                                        }
                                    )
                                }
                            </select>
                        </div>
                        
                        <div className="col-lg-6 col-md-12 col-sm-12">
                            <h6> Select Employee </h6>
                            <select className="form-control" onChange={EmployeeDetails} required>
                                <option value=''></option>
                                {
                                    EmployeeID.map(
                                        (val, index) => {
                                            return (
                                                <option value={val.emp_id}>{val.emp_id} {val.name}</option>
                                            )
                                        }
                                    )
                                }
                            </select>
                        </div>

                    </div>

                </div>

                <div className="Details_of_Employee jumbotron-fluid bg-white m-5 mb-0 shadow-sm p-4 rounded">
                    {
                        Employee.map(
                            ( val, index ) => {

                                return (
                                    <div className="container-fluid font-italic" key={ index }>
                                        <div className="row">
                                            <div className="col-lg-6 col-md-12 col-sm-12">
                                                <p className="font-weight-bold mb-0">Emlpoyee ID</p>
                                                <p className="text-secondary">{val.emp_id}</p>
                                            </div>
                                            <div className="col-lg-6 col-md-12 col-sm-12">
                                                <p className="font-weight-bold mb-0">Name</p>
                                                <p className="text-secondary">{val.name}</p>
                                            </div>
                                            <div className="col-lg-6 col-md-12 col-sm-12">
                                                <p className="font-weight-bold mb-0">Father Name</p>
                                                <p className="text-secondary">{val.father_name}</p>
                                            </div>
                                            <div className="col-lg-6 col-md-12 col-sm-12">
                                                <p className="font-weight-bold mb-0">Date of birth</p>
                                                <p className="text-secondary">{val.date_of_birth}</p>
                                            </div>
                                            <div className="col-lg-6 col-md-12 col-sm-12">
                                                <p className="font-weight-bold mb-0">Place of birth</p>
                                                <p className="text-secondary">{val.place_of_birth}</p>
                                            </div>
                                            <div className="col-lg-6 col-md-12 col-sm-12">
                                                <p className="font-weight-bold mb-0">Residential Address</p>
                                                <p className="text-secondary">{val.residential_address}</p>
                                            </div>
                                            <div className="col-lg-6 col-md-12 col-sm-12">
                                                <p className="font-weight-bold mb-0">Permanent Address</p>
                                                <p className="text-secondary">{val.permanent_address}</p>
                                            </div>
                                            <div className="col-lg-6 col-md-12 col-sm-12">
                                                <p className="font-weight-bold mb-0">Emergency person name</p>
                                                <p className="text-secondary">{val.emergency_person_name}</p>
                                            </div>
                                            <div className="col-lg-6 col-md-12 col-sm-12">
                                                <p className="font-weight-bold mb-0">Emergency person number</p>
                                                <p className="text-secondary">{val.emergency_person_number}</p>
                                            </div>
                                            <div className="col-lg-6 col-md-12 col-sm-12">
                                                <p className="font-weight-bold mb-0">Phone Number ( Landline )</p>
                                                <p className="text-secondary">{val.landline}</p>
                                            </div>
                                            <div className="col-lg-6 col-md-12 col-sm-12">
                                                <p className="font-weight-bold mb-0">Phone Number ( Cell )</p>
                                                <p className="text-secondary">{val.cell}</p>
                                            </div>
                                            <div className="col-lg-6 col-md-12 col-sm-12">
                                                <p className="font-weight-bold mb-0">Gender</p>
                                                <p className="text-secondary">{val.gender}</p>
                                            </div>
                                            <div className="col-lg-6 col-md-12 col-sm-12">
                                                <p className="font-weight-bold mb-0">Time in</p>
                                                <p className="text-secondary">{val.time_in}</p>
                                            </div>
                                            <div className="col-lg-6 col-md-12 col-sm-12">
                                                <p className="font-weight-bold mb-0">Time Out</p>
                                                <p className="text-secondary">{val.time_out}</p>
                                            </div>
                                            <div className="col-lg-6 col-md-12 col-sm-12">
                                                <p className="font-weight-bold mb-0">Salary</p>
                                                <p className="text-secondary">{val.salary}</p>
                                            </div>
                                            <div className="col-lg-6 col-md-12 col-sm-12">
                                                <p className="font-weight-bold mb-0">Date of Joining</p>
                                                <p className="text-secondary">{val.date_of_join}</p>
                                            </div>
                                            <div className="col-lg-6 col-md-12 col-sm-12">
                                                <p className="font-weight-bold mb-0">Additional Off</p>
                                                <p className="text-secondary">{val.additional_off}</p>
                                            </div>
                                            <div className="col-lg-6 col-md-12 col-sm-12">
                                                <p className="font-weight-bold mb-0">Employee status</p>
                                                <p className="text-secondary">{val.emp_status}</p>
                                            </div>
                                            <div className="col-lg-6 col-md-12 col-sm-12">
                                                <p className="font-weight-bold mb-0">Email</p>
                                                <p className="text-secondary">{val.email}</p>
                                            </div>
                                            <div className="col-lg-6 col-md-12 col-sm-12">
                                                <p className="font-weight-bold mb-0">Marital Status</p>
                                                <p className="text-secondary">{val.marital_status}</p>
                                            </div>
                                            <div className="col-lg-6 col-md-12 col-sm-12">
                                                <p className="font-weight-bold mb-0">CNIC</p>
                                                <p className="text-secondary">{val.cnic}</p>
                                            </div>
                                            <div className="col-lg-6 col-md-12 col-sm-12">
                                                <p className="font-weight-bold mb-0">CNIC Date of issue</p>
                                                <p className="text-secondary">{val.cnic_date_of_issue}</p>
                                            </div>
                                            <div className="col-lg-6 col-md-12 col-sm-12">
                                                <p className="font-weight-bold mb-0">CNIC Date of expiry</p>
                                                <p className="text-secondary">{val.cnic_date_of_expiry}</p>
                                            </div>
                                            <div className="col-lg-6 col-md-12 col-sm-12">
                                                <p className="font-weight-bold mb-0">CNIC Place of issue</p>
                                                <p className="text-secondary">{val.cnic_place_of_issue}</p>
                                            </div>
                                            <div className="col-lg-6 col-md-12 col-sm-12">
                                                <p className="font-weight-bold mb-0">CNIC Front Image</p>
                                                <img src={'images/documents/cnic/front/' + val.cnic_front_image} alt="" style={{ width: '30%' }} />
                                            </div>
                                            <div className="col-lg-6 col-md-12 col-sm-12">
                                                <p className="font-weight-bold mb-0">CNIC Back Image</p>
                                                <img src={'images/documents/cnic/back/' + val.cnic_back_image} alt="" style={{ width: '30%' }} />
                                            </div>
                                            {/* <div className="col-lg-6 col-md-12 col-sm-12">
                                                <p className="font-weight-bold mb-0">Guest Meetable</p>
                                                <p className="text-secondary">{val.guest_meetable}</p>
                                            </div> */}
                                            <div className="col-lg-6 col-md-12 col-sm-12">
                                                <p className="font-weight-bold mb-0">Company Code</p>
                                                <p className="text-secondary">{val.company_code}</p>
                                            </div>
                                            <div className="col-lg-6 col-md-12 col-sm-12">
                                                <p className="font-weight-bold mb-0">Location Code</p>
                                                <p className="text-secondary">{val.location_code}</p>
                                            </div>
                                            <div className="col-lg-6 col-md-12 col-sm-12">
                                                <p className="font-weight-bold mb-0">Department Code</p>
                                                <p className="text-secondary">{val.department_code}</p>
                                            </div>
                                            <div className="col-lg-6 col-md-12 col-sm-12">
                                                <p className="font-weight-bold mb-0">Designation Code</p>
                                                <p className="text-secondary">{val.designation_code}</p>
                                            </div>
                                            {/* <div className="col-lg-6 col-md-12 col-sm-12">
                                                <p className="font-weight-bold mb-0">User ID</p>
                                                <p className="text-secondary">{val.user_id}</p>
                                            </div> */}
                                            <div className="col-lg-6 col-md-12 col-sm-12">
                                                <p className="font-weight-bold mb-0">Grade Code</p>
                                                <p className="text-secondary">{val.grade_code}</p>
                                            </div>
                                            <div className="col-lg-6 col-md-12 col-sm-12">
                                                <p className="font-weight-bold mb-0">Created At</p>
                                                <p className="text-secondary">{val.created_at}</p>
                                            </div>
                                            <div className="col-lg-6 col-md-12 col-sm-12">
                                                <p className="font-weight-bold mb-0">Updated At</p>
                                                <p className="text-secondary">{val.updated_at}</p>
                                            </div>
                                            {/* <div className="col-lg-6 col-md-12 col-sm-12">
                                                <p className="font-weight-bold mb-0">User Name</p>
                                                <p className="text-secondary">{val.user_name}</p>
                                            </div> */}
                                            {/* <div className="col-lg-6 col-md-12 col-sm-12">
                                                <p className="font-weight-bold mb-0">User Image</p>
                                                <img src={'images/users/' + val.user_image} alt="" style={{ width: '30%' }} />
                                            </div> */}
                                            {/* <div className="col-lg-6 col-md-12 col-sm-12">
                                                <p className="font-weight-bold mb-0">ID</p>
                                                <p className="text-secondary">{val.id}</p>
                                            </div> */}
                                            {/* <div className="col-lg-6 col-md-12 col-sm-12">
                                                <p className="font-weight-bold mb-0">Login ID</p>
                                                <p className="text-secondary">{val.login_id}</p>
                                            </div>
                                            <div className="col-lg-6 col-md-12 col-sm-12">
                                                <p className="font-weight-bold mb-0">Emp Password</p>
                                                <p className="text-secondary">{val.emp_password}</p>
                                            </div> */}
                                            <div className="col-lg-6 col-md-12 col-sm-12">
                                                <p className="font-weight-bold mb-0">Emp Image</p>
                                                <img src={'images/employees/' + val.emp_image} alt="" style={{ width: '30%' }} />
                                            </div>
                                            <div className="col-lg-6 col-md-12 col-sm-12">
                                                <p className="font-weight-bold mb-0">Emp CV</p>
                                                <img src={'images/documents/cv/' + val.cv} alt="" style={{ width: '30%' }} />
                                            </div>
                                            <div className="col-lg-6 col-md-12 col-sm-12">
                                                <p className="font-weight-bold mb-0">Emp proof of address</p>
                                                <img src={'images/documents/address/' + val.proof_of_address} alt="" style={{ width: '30%' }} />
                                            </div>
                                            <div className="col-lg-6 col-md-12 col-sm-12">
                                                <p className="font-weight-bold mb-0">Emp armed license</p>
                                                {
                                                    val.armed_license === null
                                                    ?
                                                    <p>misssing</p>
                                                    :
                                                    <img src={'images/documents/licenses/armed/' + val.armed_license} alt="" style={{ width: '30%' }} />   
                                                }
                                            </div>
                                            <div className="col-lg-6 col-md-12 col-sm-12">
                                                <p className="font-weight-bold mb-0">Emp driving license</p>
                                                {
                                                    val.driving_license === null
                                                    ?
                                                    <p>misssing</p>
                                                    :
                                                    <img src={'images/documents/licenses/driving/' + val.driving_license} alt="" style={{ width: '30%' }} />   
                                                }
                                            </div>
                                            <div className="col-lg-6 col-md-12 col-sm-12">
                                                <p className="font-weight-bold mb-0">Company Name</p>
                                                <p className="text-secondary">{val.company_name}</p>
                                            </div>
                                            <div className="col-lg-6 col-md-12 col-sm-12">
                                                <p className="font-weight-bold mb-0">Location Name</p>
                                                <p className="text-secondary">{val.location_name}</p>
                                            </div>
                                            <div className="col-lg-6 col-md-12 col-sm-12">
                                                <p className="font-weight-bold mb-0">Designation Name</p>
                                                <p className="text-secondary">{val.designation_name}</p>
                                            </div>
                                            <div className="col-lg-6 col-md-12 col-sm-12">
                                                <p className="font-weight-bold mb-0">Department Name</p>
                                                <p className="text-secondary">{val.department_name}</p>
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
export default Admin_View_Employees;