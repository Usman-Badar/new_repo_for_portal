import axios from "../../../../../../axios";
import React, { useState, useEffect } from "react";
import './Admin_View_Employees.css';

const Admin_View_Employees = () => {

    const [EmployeeID, setEmployeeID] = useState([]);
    const [Employee, setEmployee] = useState([]);

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
            <div className="Admin_View_Employees">
                <select className="form-control" onChange={EmployeeDetails} required>
                <option value=''>Select Employee</option>
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
                <div className="Details_of_Employee">
                    {
                        Employee.map(
                            (val) => {
                                return (
                                    <div className="InputDetailsGrid">
                                        <div>
                                            <p className="font-weight-bold mb-0">Emlpoyee ID</p>
                                            <p>{val.emp_id}</p>
                                        </div>
                                        <div>
                                            <p className="font-weight-bold mb-0">Name</p>
                                            <p>{val.name}</p>
                                        </div>
                                        <div>
                                            <p className="font-weight-bold mb-0">Father Name</p>
                                            <p>{val.father_name}</p>
                                        </div>
                                        <div>
                                            <p className="font-weight-bold mb-0">Date of birth</p>
                                            <p>{val.date_of_birth}</p>
                                        </div>
                                        <div>
                                            <p className="font-weight-bold mb-0">Place of birth</p>
                                            <p>{val.place_of_birth}</p>
                                        </div>
                                        <div>
                                            <p className="font-weight-bold mb-0">Residential Address</p>
                                            <p>{val.residential_address}</p>
                                        </div>
                                        <div>
                                            <p className="font-weight-bold mb-0">Permanent Address</p>
                                            <p>{val.permanent_address}</p>
                                        </div>
                                        <div>
                                            <p className="font-weight-bold mb-0">Emergency person name</p>
                                            <p>{val.emergency_person_name}</p>
                                        </div>
                                        <div>
                                            <p className="font-weight-bold mb-0">Emergency person number</p>
                                            <p>{val.emergency_person_number}</p>
                                        </div>
                                        <div>
                                            <p className="font-weight-bold mb-0">Phone Number ( Landline )</p>
                                            <p>{val.landline}</p>
                                        </div>
                                        <div>
                                            <p className="font-weight-bold mb-0">Phone Number ( Cell )</p>
                                            <p>{val.cell}</p>
                                        </div>
                                        <div>
                                            <p className="font-weight-bold mb-0">Gender</p>
                                            <p>{val.gender}</p>
                                        </div>
                                        <div>
                                            <p className="font-weight-bold mb-0">Time in</p>
                                            <p>{val.time_in}</p>
                                        </div>
                                        <div>
                                            <p className="font-weight-bold mb-0">Time Out</p>
                                            <p>{val.time_out}</p>
                                        </div>
                                        <div>
                                            <p className="font-weight-bold mb-0">Salary</p>
                                            <p>{val.salary}</p>
                                        </div>
                                        <div>
                                            <p className="font-weight-bold mb-0">Date of Joining</p>
                                            <p>{val.date_of_join}</p>
                                        </div>
                                        <div>
                                            <p className="font-weight-bold mb-0">Additional Off</p>
                                            <p>{val.additional_off}</p>
                                        </div>
                                        <div>
                                            <p className="font-weight-bold mb-0">Employee status</p>
                                            <p>{val.emp_status}</p>
                                        </div>
                                        <div>
                                            <p className="font-weight-bold mb-0">Email</p>
                                            <p>{val.email}</p>
                                        </div>
                                        <div>
                                            <p className="font-weight-bold mb-0">Access</p>
                                            <p>{val.access}</p>
                                        </div>
                                        <div>
                                            <p className="font-weight-bold mb-0">Marital Status</p>
                                            <p>{val.marital_status}</p>
                                        </div>
                                        <div>
                                            <p className="font-weight-bold mb-0">CNIC</p>
                                            <p>{val.cnic}</p>
                                        </div>
                                        <div>
                                            <p className="font-weight-bold mb-0">CNIC Date of issue</p>
                                            <p>{val.cnic_date_of_issue}</p>
                                        </div>
                                        <div>
                                            <p className="font-weight-bold mb-0">CNIC Date of expiry</p>
                                            <p>{val.cnic_date_of_expiry}</p>
                                        </div>
                                        <div>
                                            <p className="font-weight-bold mb-0">CNIC Place of issue</p>
                                            <p>{val.cnic_place_of_issue}</p>
                                        </div>
                                        <div>
                                            <p className="font-weight-bold mb-0">CNIC Front Image</p>
                                            <img src={'images/documents/cnic/front/' + val.cnic_front_image} alt="" style={{ width: '30%' }} />
                                        </div>
                                        <div>
                                            <p className="font-weight-bold mb-0">CNIC Back Image</p>
                                            <img src={'images/documents/cnic/back/' + val.cnic_back_image} alt="" style={{ width: '30%' }} />
                                        </div>
                                        <div>
                                            <p className="font-weight-bold mb-0">Guest Meetable</p>
                                            <p>{val.guest_meetable}</p>
                                        </div>
                                        <div>
                                            <p className="font-weight-bold mb-0">Company Code</p>
                                            <p>{val.company_code}</p>
                                        </div>
                                        <div>
                                            <p className="font-weight-bold mb-0">Location Code</p>
                                            <p>{val.location_code}</p>
                                        </div>
                                        <div>
                                            <p className="font-weight-bold mb-0">Department Code</p>
                                            <p>{val.department_code}</p>
                                        </div>
                                        <div>
                                            <p className="font-weight-bold mb-0">Designation Code</p>
                                            <p>{val.designation_code}</p>
                                        </div>
                                        <div>
                                            <p className="font-weight-bold mb-0">User ID</p>
                                            <p>{val.user_id}</p>
                                        </div>
                                        <div>
                                            <p className="font-weight-bold mb-0">Grade Code</p>
                                            <p>{val.grade_code}</p>
                                        </div>
                                        <div>
                                            <p className="font-weight-bold mb-0">Created At</p>
                                            <p>{val.created_at}</p>
                                        </div>
                                        <div>
                                            <p className="font-weight-bold mb-0">Updated At</p>
                                            <p>{val.updated_at}</p>
                                        </div>
                                        <div>
                                            <p className="font-weight-bold mb-0">User Name</p>
                                            <p>{val.user_name}</p>
                                        </div>
                                        <div>
                                            <p className="font-weight-bold mb-0">User Image</p>
                                            <img src={'images/users/' + val.user_image} alt="" style={{ width: '30%' }} />
                                        </div>
                                        <div>
                                            <p className="font-weight-bold mb-0">ID</p>
                                            <p>{val.id}</p>
                                        </div>
                                        <div>
                                            <p className="font-weight-bold mb-0">Login ID</p>
                                            <p>{val.login_id}</p>
                                        </div>
                                        <div>
                                            <p className="font-weight-bold mb-0">Emp Password</p>
                                            <p>{val.emp_password}</p>
                                        </div>
                                        <div>
                                            <p className="font-weight-bold mb-0">Emp Image</p>
                                            <img src={'images/employees/' + val.emp_image} alt="" style={{ width: '30%' }} />
                                        </div>
                                        <div>
                                            <p className="font-weight-bold mb-0">Emp CV</p>
                                            <img src={'images/documents/cv/' + val.cv} alt="" style={{ width: '30%' }} />
                                        </div>
                                        <div>
                                            <p className="font-weight-bold mb-0">Emp proof of address</p>
                                            <img src={'images/documents/address/' + val.proof_of_address} alt="" style={{ width: '30%' }} />
                                        </div>
                                        <div>
                                            <p className="font-weight-bold mb-0">Emp armed license</p>
                                            {
                                                val.armed_license === null
                                                ?
                                                <p>misssing</p>
                                                :
                                                <img src={'images/documents/licenses/armed/' + val.armed_license} alt="" style={{ width: '30%' }} />   
                                            }
                                        </div>
                                        <div>
                                            <p className="font-weight-bold mb-0">Emp driving license</p>
                                            {
                                                val.driving_license === null
                                                ?
                                                <p>misssing</p>
                                                :
                                                <img src={'images/documents/licenses/driving/' + val.driving_license} alt="" style={{ width: '30%' }} />   
                                            }
                                        </div>
                                        <div>
                                            <p className="font-weight-bold mb-0">Company Name</p>
                                            <p>{val.company_name}</p>
                                        </div>
                                        <div>
                                            <p className="font-weight-bold mb-0">Location Name</p>
                                            <p>{val.location_name}</p>
                                        </div>
                                        <div>
                                            <p className="font-weight-bold mb-0">Designation Name</p>
                                            <p>{val.designation_name}</p>
                                        </div>
                                        <div>
                                            <p className="font-weight-bold mb-0">Department Name</p>
                                            <p>{val.department_name}</p>
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