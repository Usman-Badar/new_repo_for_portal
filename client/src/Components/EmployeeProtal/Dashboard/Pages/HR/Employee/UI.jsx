/* eslint-disable jsx-a11y/iframe-has-title */
/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable eqeqeq */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import $ from 'jquery';
import './Style.css';
import axios from '../../../../../../axios';
import { Route, Switch, useHistory } from 'react-router-dom';
import JSAlert from 'js-alert';
import { useSelector } from 'react-redux';
import { Uint8ToBase64 } from '../../../../../../utils/Uint8ToBase64';

function UI({ Grades, Designations, Departments, Employee, SpecKeyword, Location, Locations, Companies, Company, HREmployee, fetchDetails, fetchList, setSpecKeyword, setLocation, loadCompanies, setCompany, loadEmployees }) {

    const history = useHistory();
    const Data = useSelector((state) => state.EmpAuth.EmployeeData);

    return (
        <>
            <div className="hr_employee">
                <div className="hr_employee_form">
                    <Switch>
                        <Route exact path="/hr/employee/list" render={ 
                            () => (
                                <EmployeeList 
                                    HREmployee={ HREmployee }
                                    Company={ Company }
                                    Companies={ Companies }
                                    Locations={ Locations }
                                    Location={ Location }
                                    SpecKeyword={ SpecKeyword }
                                    history={ history }

                                    setSpecKeyword={ setSpecKeyword }
                                    setLocation={ setLocation }
                                    setCompany={ setCompany }
                                    loadEmployees={ loadEmployees }
                                    loadCompanies={ loadCompanies }
                                />
                            )
                        } />
                        <Route exact path="/hr/employee/details/:id" render={ 
                            () => (
                                <EmployeeDetails 
                                    history={ history }
                                    Employee={ Employee }
                                    Data={ Data }

                                    fetchDetails={ fetchDetails }
                                />
                            )
                        } />
                        <Route exact path="/hr/employee/edit/:id" render={ 
                            () => (
                                <EmployeeEdit 
                                    history={ history }
                                    Employee={ Employee }
                                    Designations={ Designations }
                                    Departments={ Departments }
                                    Locations={ Locations }
                                    Grades={ Grades }

                                    fetchList={ fetchList }
                                    fetchDetails={ fetchDetails }
                                />
                            )
                        } />
                    </Switch>
                </div>
            </div>
        </>
    )
    
}

export default UI;

const EmployeeList = ( { Location, Company, Companies, Locations, setLocation, SpecKeyword, AccessControls, history, HREmployee, loadEmployees, setSpecKeyword, setCompany, loadCompanies } ) => {

    useEffect(
        () => {
            loadCompanies();
        }, []
    )

    useEffect(
        () => {
            if ( Companies )
            {
                loadEmployees();
            }
        }, [ Company, Companies ]
    )

    const Arr = HREmployee ? HREmployee.filter(
        val => {
            return val.location_name.toLowerCase().includes(Location.toLowerCase()) && val.name.toLowerCase().includes(SpecKeyword.toLowerCase());
        }
    ) : null;

    return (
        <>
            <div className="employee_list">
                <div className="d-flex align-items-end justify-content-between">
                    <h3 className="heading">
                        Employee Management
                        <sub>List Of Employees ({Arr ? Arr.length : 0})</sub>
                    </h3>
                    <div>
                        {/* {
                            AccessControls.access
                            ?
                            JSON.parse(AccessControls.access).includes(22) || JSON.parse(AccessControls.access).includes(0)
                            ?
                            <button className='btn submit' onClick={ () => history.replace('/purchase/order/form') }>New</button>
                            :null
                            :null
                        } */}
                        <button className="btn submit px-2 ml-2 filter-emit" type='button'>
                            <i className="las la-filter"></i>
                            <div className="filter-container">
                                <h6 className='mb-0' style={{ fontFamily: 'Oxygen' }}>Filter Options</h6>
                                <hr className='my-1 bg-dark' />
                                
                                <label className="font-weight-bold mb-0">Company</label>
                                <select value={ Company.company_code } className='form-control form-control-sm mb-2' onChange={ (e) => setCompany({ company_code: e.target.value, company_name: e.target.options[e.target.selectedIndex].text }) }>
                                    <option value=''>Select Option</option>
                                    {
                                        Companies && Companies.sort().map(
                                            ( company, index ) => {

                                                return <option key={ index } value={ company.company_code } selected={ Company.company_code == company.company_code }>{ company.company_name }</option>;

                                            }
                                        )
                                    }
                                </select>

                                {
                                    Locations
                                    ?
                                    <>
                                        <label className="font-weight-bold mb-0">Location</label>
                                        <select className='form-control form-control-sm mb-2' onChange={ (e) => setLocation(e.target.value) }>
                                            <option value=''>All Locations</option>
                                            {
                                                Locations.sort().map(
                                                    ( location, index ) => {

                                                        return <option key={ index } value={ location }>{ location }</option>;

                                                    }
                                                )
                                            }
                                        </select>
                                        <label className="font-weight-bold mb-0">Search Name</label>
                                        <input placeholder='Search Keywords...' type="search" onChange={ (e) => setSpecKeyword(e.target.value) } className='form-control form-control-sm mb-2' />
                                    </>
                                    :null
                                }

                            </div>
                        </button>
                    </div>
                </div>
                <hr />

                {
                    Arr
                    ?
                    Arr.length === 0
                    ?
                    <h6 className="text-center">No Request Found</h6>
                    :
                    <table className="table table-hover popUps">
                        <thead>
                            <tr>
                                <th>Sr.No</th>
                                <th>Employee Code</th>
                                <th>Employee</th>
                                <th>Co & Loc</th>
                                <th>Department</th>
                                <th>Date Of Joining</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                Arr.map(
                                    ( val, index ) => {
                                        return (
                                            <tr className='pointer' onDoubleClick={ () => history.push('/hr/employee/details/' + val.emp_id) }>
                                                <td>{ index + 1 }</td>
                                                <td>{ val.emp_id }</td>
                                                <td className='text-capitalize'>
                                                    <div className='d-flex align-items-center'>
                                                        <img src={ process.env.REACT_APP_SERVER+'/images/employees/' + val.emp_image } alt="emp" width={ 40 } height={ 40 } className='rounded-circle' />
                                                        <div className='ml-2'>
                                                            <b>{ val.name }</b> <br />
                                                            <span>{ val.designation_name }</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span>{ val.company_name }</span> <br />
                                                    <span>{ val.location_name }</span>
                                                </td>
                                                <td>{ val.department_name }</td>
                                                <td>{ new Date(val.date_of_join).toDateString() }</td>
                                                <td>{ val.emp_status }</td>
                                            </tr>
                                        )
                                    }
                                )
                            }
                        </tbody>
                    </table>
                    :
                    <h6 className="text-center">Kindly Select A Company</h6>
                }
            </div>
        </>
    )

}

const EmployeeDetails = ({ Data, Employee, history, fetchDetails }) => {

    const [ access, setAccess ] = useState(false);

    useEffect(
        () => {
            if (Data) {
                for ( let y = 0; y < JSON.parse(Data.access).length; y++ )
                {
                    if ( parseInt(JSON.parse(Data.access)[y]) === 62 || parseInt(JSON.parse(Data.access)[y]) === 0 || parseInt(window.location.href.split('/').pop()) === parseInt(localStorage.getItem('EmpID')) )
                    {
                        setAccess(true);
                    }
                }
            }
        }, [Data]
    )
    useEffect(
        () => {
            if (access) {
                fetchDetails();
            }
        }, [access]
    )

    return (
        <>
            {
                Employee
                ?
                <>
                    <div className="d-flex align-items-center justify-content-between">
                        <div className='d-flex align-items-center justify-content-start'>
                            <img src={ process.env.REACT_APP_SERVER+'/images/employees/' + Employee.emp_image } alt="emp" width="60" height="60" />
                            <h3 className="heading ml-2">
                                { Employee.name }
                                <sub>{ Employee.designation_name }</sub>
                            </h3>
                        </div>
                        <div className='btn-group'>
                            <button className='btn submit' onClick={ () => history.replace('/hr/employee/list') }>Back</button>
                            <button className='btn green' onClick={ () => history.push('/hr/employee/edit/' + window.location.href.split('/').pop()) }>Edit</button>
                        </div>
                    </div>
                    <hr />

                    <table className='table table-bordered'>
                        <tbody>
                            <tr>
                                <th className='text-uppercase bg-lightgray letter-spacing' colSpan={4}>Personal data</th>
                            </tr>
                            <tr>
                                <td>
                                    <b>Employee Code</b> <br />
                                    <span>{ Employee.emp_id }</span>
                                </td>
                                <td>
                                    <b>Employee Name</b> <br />
                                    <span>{ Employee.name }</span>
                                </td>
                                <td>
                                    <b>Father Name</b> <br />
                                    <span>{ Employee.father_name }</span>
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={3}>
                                    <b>Residential Address</b> <br />
                                    <span>{ Employee.residential_address }</span>
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={3}>
                                    <b>Permanent Address</b> <br />
                                    <span>{ Employee.permanent_address }</span>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <b>Date Of Birth</b> <br />
                                    <span>{ new Date(Employee.date_of_birth).toDateString() }</span>
                                </td>
                                <td>
                                    <b>Place Of Birth</b> <br />
                                    <span>{ Employee.place_of_birth }</span>
                                </td>
                                <td>
                                    <b>Gender</b> <br />
                                    <span>{ Employee.gender }</span>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <b>Date Of Joining</b> <br />
                                    <span>{ new Date(Employee.date_of_join).toDateString() }</span>
                                </td>
                                <td>
                                    <b>Salary</b> <br />
                                    <span>PKR { Employee.salary }</span>
                                </td>
                                <td>
                                    <b>Employment Status</b> <br />
                                    <span>{ Employee.emp_status }</span>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <b>Cell Phone Number</b> <br />
                                    <span>{ Employee.cell }</span>
                                </td>
                                <td>
                                    <b>Landline Number</b> <br />
                                    <span>{ Employee.landline }</span>
                                </td>
                                <td>
                                    <b>Marital Status</b> <br />
                                    <span>{ Employee.marital_status }</span>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <b>Emergency Contact Person (Name)</b> <br />
                                    <span>{ Employee.emergency_person_name }</span>
                                </td>
                                <td>
                                    <b>Emergency Contact Person (Number)</b> <br />
                                    <span>{ Employee.emergency_person_number }</span>
                                </td>
                                <td>
                                    <b>Number Of Children</b> <br />
                                    <span>{ JSON.parse(Employee.children) ? JSON.parse(Employee.children).length : 0 }</span>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <b>Official Email Address</b> <br />
                                    <span>{ Employee.email }</span>
                                </td>
                                <td>
                                    <b>Additional OFF(s)</b> <br />
                                    <span>{ JSON.parse(Employee.additional_off) ? JSON.parse(Employee.additional_off).length > 0 ? JSON.parse(Employee.additional_off).join(', ') : "No" : "No" }</span>
                                </td>
                                <td>
                                    <b>Children (Name)</b> <br />
                                    <span>{ JSON.parse(Employee.children) ? JSON.parse(Employee.children).length > 0 ? JSON.parse(Employee.children).map(val => val.childName).join(', ') : "No Children" : "No Children" }</span>
                                </td>
                            </tr>
                            <tr>
                                <th className='text-uppercase bg-lightgray letter-spacing' colSpan={4}>position information</th>
                            </tr>
                            <tr>
                                <td>
                                    <b>Company</b> <br />
                                    <span>{ Employee.company_name }</span>
                                </td>
                                <td>
                                    <b>Location</b> <br />
                                    <span>{ Employee.location_name }</span>
                                </td>
                                <td>
                                    <b>Department</b> <br />
                                    <span>{ Employee.department_name }</span>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <b>IN/OUT Timings</b> <br />
                                    <span>{ Employee.time_in } - { Employee.time_out }</span>
                                </td>
                                <td>
                                    <b>Employment Type</b> <br />
                                    <span>{ Employee.type }</span>
                                </td>
                                <td>
                                    <b>Grade Code</b> <br />
                                    <span>{ Employee.grade }</span>
                                </td>
                            </tr>
                            <tr>
                                <th className='text-uppercase bg-lightgray letter-spacing' colSpan={4}>cnic information</th>
                            </tr>
                            <tr>
                                <td>
                                    <b>CNIC Number</b> <br />
                                    <span>{ Employee.cnic }</span>
                                </td>
                                <td>
                                    <b>CNIC Date Of Issue</b> <br />
                                    <span>{ new Date(Employee.cnic_date_of_issue).toDateString() }</span>
                                </td>
                                <td>
                                    <b>CNIC Date Of Expiry</b> <br />
                                    <span>{ new Date(Employee.cnic_date_of_expiry).toDateString() }</span>
                                </td>
                            </tr>
                            <tr>
                                <td style={{ verticalAlign: 'middle', textAlign: 'center' }} className='bg-lightgray'>
                                    <div>
                                        <h4 className='font-weight-bold'>DOCUMENTS</h4>
                                    </div>
                                </td>
                                <td>
                                    <b>CNIC Front Image</b> <br />
                                    <img src={ Employee.cnic_front_file ? Uint8ToBase64(Buffer.from(Employee.cnic_front_file, 'base64')) : process.env.REACT_APP_SERVER+'/images/documents/cnic/front/' + Employee.cnic_front_image } alt="CNIC photo" width="70%" className='border' />
                                </td>
                                <td>
                                    <b>CNIC Back Image</b> <br />
                                    <img src={ Employee.cnic_back_file ? Uint8ToBase64(Buffer.from(Employee.cnic_back_file, 'base64')) : process.env.REACT_APP_SERVER+'/images/documents/cnic/back/' + Employee.cnic_back_image } alt="CNIC photo" width="70%" className='border' />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <h5>Employee Properties</h5>
                                    <hr />
                                    <b>Enable/Disable Attendance</b> <br />
                                    <span>{ Employee.attendance_enable === 1 ? "Enabled" : "Disabled" }</span>
                                </td>
                                <td>
                                    <b>CV</b> <br />
                                    {
                                        Employee.cv.includes('.pdf')
                                        ?
                                        <iframe src={ process.env.REACT_APP_SERVER+'/images/documents/cv/' + Employee.cv } width="100%" height="500" className='border'></iframe>
                                        :
                                        <img src={ process.env.REACT_APP_SERVER+'/images/documents/cv/' + Employee.cv } alt="CV preview" width="100%" height="500" className='border' />
                                    }
                                </td>
                                <td>
                                    <b>Proof Of Address</b> <br />
                                    {
                                        Employee.proof_of_address.includes('.pdf')
                                        ?
                                        <iframe src={ process.env.REACT_APP_SERVER+'/images/documents/address/' + Employee.proof_of_address } width="100%" height="500" className='border'></iframe>
                                        :
                                        <img src={ process.env.REACT_APP_SERVER+'/images/documents/address/' + Employee.proof_of_address } alt="proof_of_address preview" width="100%" height="500" className='border' />
                                    }
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </>
                :
                !access
                ?
                <h6 className='text-center mb-0'>No Record Found</h6>
                :
                <h6 className='text-center mb-0'>Please Wait...</h6>
            }
        </>
    )

}

const EmployeeEdit = ({ Grades, Designations, Departments, Locations, Employee, history, fetchList, fetchDetails }) => {

    const moment = require('moment');
    const [ UploadedEmpImage, setUploadedEmpImage ] = useState();
    const [ UploadedCNICFront, setUploadedCNICFront ] = useState();
    const [ UploadedCNICBack, setUploadedCNICBack ] = useState();
    const [ UploadedCV, setUploadedCV ] = useState();
    const [ UploadedPrfAddress, setUploadedPrfAddress ] = useState();

    useEffect(
        () => {
            fetchDetails();
            fetchList();
        }, []
    );

    const updateDetails = ( e ) => {

        e.preventDefault();

        const name = document.getElementById('name').value;
        const father_name = document.getElementById('father_name').value;
        const date_of_birth = document.getElementById('date_of_birth').value;
        const place_of_birth = document.getElementById('place_of_birth').value;
        const residential_address = document.getElementById('residential_address').value;
        const permanent_address = document.getElementById('permanent_address').value;
        const gender = document.getElementById('gender').value;
        const date_of_join = document.getElementById('date_of_join').value;
        const salary = document.getElementById('salary').value;
        const cell = document.getElementById('cell').value;
        const landline = document.getElementById('landline').value;
        const emp_status = document.getElementById('emp_status').value;
        const emergency_person_name = document.getElementById('emergency_person_name').value;
        const emergency_person_number = document.getElementById('emergency_person_number').value;
        const marital_status = document.getElementById('marital_status').value;
        const email = document.getElementById('email').value;
        
        const additional_off_monday = document.getElementById('additional_off_monday').checked;
        const additional_off_tuesday = document.getElementById('additional_off_tuesday').checked;
        const additional_off_wednesday = document.getElementById('additional_off_wednesday').checked;
        const additional_off_thursday = document.getElementById('additional_off_thursday').checked;
        const additional_off_friday = document.getElementById('additional_off_friday').checked;
        const additional_off_saturday = document.getElementById('additional_off_saturday').checked;
        
        const location_name = document.getElementById('location_name').value;
        const department_name = document.getElementById('department_name').value;
        const designation_name = document.getElementById('designation_name').value;
        const time_in = document.getElementById('time_in').value;
        const time_out = document.getElementById('time_out').value;
        const type = document.getElementById('type').value;
        const grade_code = document.getElementById('grade_code').value;
        
        const cnic = document.getElementById('cnic').value;
        const cnic_date_of_issue = document.getElementById('cnic_date_of_issue').value;
        const cnic_date_of_expiry = document.getElementById('cnic_date_of_expiry').value;
        const attendance_enable = document.getElementById('attendance_enable').value;
        
        const Data = new FormData();
        Data.append('emp_id', Employee.emp_id);
        Data.append('name', name);
        Data.append('father_name', father_name);
        Data.append('date_of_birth', date_of_birth);
        Data.append('place_of_birth', place_of_birth);
        Data.append('residential_address', residential_address);
        Data.append('permanent_address', permanent_address);
        Data.append('gender', gender);
        Data.append('date_of_join', date_of_join);
        Data.append('salary', salary);
        Data.append('cell', cell);
        Data.append('landline', landline);
        Data.append('emp_status', emp_status);
        Data.append('emergency_person_name', emergency_person_name);
        Data.append('emergency_person_number', emergency_person_number);
        Data.append('marital_status', marital_status);
        Data.append('email', email);
        Data.append('additional_off_monday', additional_off_monday);
        Data.append('additional_off_tuesday', additional_off_tuesday);
        Data.append('additional_off_wednesday', additional_off_wednesday);
        Data.append('additional_off_thursday', additional_off_thursday);
        Data.append('additional_off_friday', additional_off_friday);
        Data.append('additional_off_saturday', additional_off_saturday);
        Data.append('location_name', location_name);
        Data.append('department_name', department_name);
        Data.append('designation_name', designation_name);
        Data.append('time_in', time_in);
        Data.append('time_out', time_out);
        Data.append('type', type);
        Data.append('grade_code', grade_code);
        Data.append('cnic', cnic);
        Data.append('cnic_date_of_issue', cnic_date_of_issue);
        Data.append('cnic_date_of_expiry', cnic_date_of_expiry);
        Data.append('attendance_enable', attendance_enable);
        
        Data.append('UploadedEmpImage', UploadedEmpImage ? UploadedEmpImage.file : null);
        Data.append('UploadedEmpImageName', UploadedEmpImage ? UploadedEmpImage.name : null);
        Data.append('UploadedCNICFront', UploadedCNICFront ? UploadedCNICFront.file : null);
        Data.append('UploadedCNICFrontName', UploadedCNICFront ? UploadedCNICFront.name : null);
        Data.append('UploadedCNICBack', UploadedCNICBack ? UploadedCNICBack.file : null);
        Data.append('UploadedCNICBackName', UploadedCNICBack ? UploadedCNICBack.name : null);
        Data.append('UploadedCV', UploadedCV ? UploadedCV.file : null);
        Data.append('UploadedCVName', UploadedCV ? UploadedCV.name : null);
        Data.append('UploadedPrfAddress', UploadedPrfAddress ? UploadedPrfAddress.file : null);
        Data.append('UploadedPrfAddressName', UploadedPrfAddress ? UploadedPrfAddress.name : null);

        $('fieldset').prop('disabled', true);
        axios.post(
            '/hr/employee/update/details',
            Data,
            {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            }
        )
        .then(
            () => {
                JSAlert.alert("Details Updated.").dismissIn(1000 * 2);
                history.push('/hr/employee/details/' + window.location.href.split('/').pop());
            }
        ).catch(
            err => {
                $('fieldset').prop('disabled', false);
                console.log(err);
            }
        );

    }

    const onUpload = ( event ) => {

        const reader = new FileReader();
        const { id, name } = event.target;

        reader.onload = () => {
            if( reader.readyState === 2 )
            {
                if ( id === 'emp_image' )
                {
                    setUploadedEmpImage( { file: event.target.files[0], name: name } );
                }else
                if ( id === 'cnic_front_image' )
                {
                    setUploadedCNICFront( { file: event.target.files[0], name: name } );
                }else
                if ( id === 'cnic_back_image' )
                {
                    setUploadedCNICBack( { file: event.target.files[0], name: name } );
                }else
                if ( id === 'cv' )
                {
                    setUploadedCV( { file: event.target.files[0], name: name } );
                }else
                if ( id === 'proof_of_address' )
                {
                    setUploadedPrfAddress( { file: event.target.files[0], name: name } );
                }
            }
        }

        if ( event.target.files[0] ) {
            reader.readAsDataURL( event.target.files[0] );
        }

    }

    return (
        <>
            {
                Employee
                ?
                <form onSubmit={updateDetails}>
                    <div className="d-flex align-items-center justify-content-between">
                        <h3 className="heading ml-2">
                            Update Employee Details
                            <sub>Edit The Employee Information</sub>
                        </h3>
                        <div className='btn-group'>
                            <button className='btn cancle' type='reset' onClick={ () => history.push('/hr/employee/details/' + window.location.href.split('/').pop()) }>Cancel</button>
                            <button className='btn submit' type='submit'>Update</button>
                        </div>
                    </div>
                    <hr />
                    <fieldset>
                        <table className='table table-bordered'>
                            <tbody>
                                <tr>
                                    <th className='text-uppercase bg-lightgray letter-spacing' colSpan={4}>Personal data</th>
                                </tr>
                                <tr>
                                    <td>
                                        <b>Employee Code</b> <br />
                                        <span>{ Employee.emp_id }</span>
                                    </td>
                                    <td>
                                        <b>Employee Image</b> <br />
                                        <input className='form-control' type='file' id="emp_image" name={ Employee.emp_image } onChange={ onUpload } />
                                    </td>
                                    <td>
                                        <b>Employee Name</b> <br />
                                        <input className='form-control' type='text' id="name" defaultValue={ Employee.name } required />
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <b>Father Name</b> <br />
                                        <input className='form-control' type='text' id="father_name" defaultValue={ Employee.father_name } required />
                                    </td>
                                    <td>
                                        <b>Date Of Birth</b> <br />
                                        <input className='form-control' type='date' id="date_of_birth" defaultValue={ moment(Employee.date_of_birth).format('YYYY-MM-DD') } required />
                                    </td>
                                    <td>
                                        <b>Place Of Birth</b> <br />
                                        <input className='form-control' type='text' id="place_of_birth" defaultValue={ Employee.place_of_birth } required />
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan={3}>
                                        <b>Residential Address</b> <br />
                                        <textarea className='form-control' type='text' id="residential_address" defaultValue={ Employee.residential_address } required />
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan={3}>
                                        <b>Permanent Address</b> <br />
                                        <textarea className='form-control' type='text' id="permanent_address" defaultValue={ Employee.permanent_address } required />
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <b>Gender</b> <br />
                                        <select className='form-control' id="gender" required>
                                            <option selected={ Employee.gender === "Male" } value="Male">Male</option>
                                            <option selected={ Employee.gender === "FeMale" } value="FeMale">FeMale</option>
                                        </select>
                                    </td>
                                    <td>
                                        <b>Date Of Joining</b> <br />
                                        <input className='form-control' type='date' id="date_of_join" defaultValue={ moment(Employee.date_of_join).format('YYYY-MM-DD') } required />
                                    </td>
                                    <td>
                                        <b>Salary</b> <br />
                                        <input className='form-control' type='number' id="salary" defaultValue={ Employee.salary } required />
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <b>Cell Phone Number</b> <br />
                                        <input className='form-control' type='text' id="cell" defaultValue={ Employee.cell } required />
                                    </td>
                                    <td>
                                        <b>Landline Number</b> <br />
                                        <input className='form-control' type='text' id="landline" defaultValue={ Employee.landline } required />
                                    </td>
                                    <td>
                                        <b>Employment Status</b> <br />
                                        <select className='form-control' id="emp_status" required>
                                            <option selected={ Employee.emp_status === "Active" } value="Active">Active</option>
                                            <option selected={ Employee.emp_status === "Resigned" } value="Resigned">Resigned</option>
                                            <option selected={ Employee.emp_status === "Suspended" } value="Suspended">Suspended</option>
                                            <option selected={ Employee.emp_status === "Terminated" } value="Terminated">Terminated</option>
                                        </select>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <b>Emergency Contact Person (Name)</b> <br />
                                        <input className='form-control' type='text' id="emergency_person_name" defaultValue={ Employee.emergency_person_name } required />
                                    </td>
                                    <td>
                                        <b>Emergency Contact Person (Number)</b> <br />
                                        <input className='form-control' type='text' id="emergency_person_number" defaultValue={ Employee.emergency_person_number } required />
                                    </td>
                                    <td>
                                        <b>Marital Status</b> <br />
                                        <select className='form-control' id="marital_status" required>
                                            <option selected={ Employee.marital_status === "Single" } value="Single">Single</option>
                                            <option selected={ Employee.marital_status === "Married" } value="Married">Married</option>
                                            <option selected={ Employee.marital_status === "Widowed" } value="Widowed">Widowed</option>
                                            <option selected={ Employee.marital_status === "Divorced" } value="Divorced">Divorced</option>
                                            <option selected={ Employee.marital_status === "Separated" } value="Separated">Separated</option>
                                        </select>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <b>Official Email Address</b> <br />
                                        <input className='form-control' type='email' id="email" defaultValue={ Employee.email } required />
                                    </td>
                                    <td colSpan={2}>
                                        <b>Additional OFF(s)</b> <br />
                                        <div className="d-flex align-items-center my-2">
                                            <div className="d-flex align-items-center w-50">
                                                <input type='checkbox' defaultChecked={ JSON.parse(Employee.additional_off).includes('Monday') } id="additional_off_monday" value="Monday" className='mr-1' /> <span>Monday</span>
                                            </div>
                                            <div className="d-flex align-items-center w-50">
                                                <input type='checkbox' defaultChecked={ JSON.parse(Employee.additional_off).includes('Tuesday') } id="additional_off_tuesday" value="Tuesday" className='mr-1' /> <span>Tuesday</span>
                                            </div>
                                        </div>
                                        <div className="d-flex align-items-center mb-2">
                                            <div className="d-flex align-items-center w-50">
                                                <input type='checkbox' defaultChecked={ JSON.parse(Employee.additional_off).includes('Wednesday') } id="additional_off_wednesday" value="Wednesday" className='mr-1' /> <span>Wednesday</span>
                                            </div>
                                            <div className="d-flex align-items-center w-50">
                                                <input type='checkbox' defaultChecked={ JSON.parse(Employee.additional_off).includes('Thursday') } id="additional_off_thursday" value="Thursday" className='mr-1' /> <span>Thursday</span>
                                            </div>
                                        </div>
                                        <div className="d-flex align-items-center">
                                            <div className="d-flex align-items-center w-50">
                                                <input type='checkbox' defaultChecked={ JSON.parse(Employee.additional_off).includes('Friday') } id="additional_off_friday" value="Friday" className='mr-1' /> <span>Friday</span>
                                            </div>
                                            <div className="d-flex align-items-center w-50">
                                                <input type='checkbox' defaultChecked={ JSON.parse(Employee.additional_off).includes('Saturday') } id="additional_off_saturday" value="Saturday" className='mr-1' /> <span>Saturday</span>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <th className='text-uppercase bg-lightgray letter-spacing' colSpan={4}>position information</th>
                                </tr>
                                <tr>
                                    <td>
                                        <b>Location</b> <br />
                                        <select className='form-control' id="location_name" required>
                                            {
                                                Locations && Locations.map(
                                                    ( val, index ) => {
                                                        return <option key={index} selected={ Employee.location_code === val.location_code } value={ val.location_code }>{ val.location_name }</option>
                                                    }
                                                )
                                            }
                                        </select>
                                    </td>
                                    <td>
                                        <b>Department</b> <br />
                                        <select className='form-control' id="department_name" required>
                                            {
                                                Departments && Departments.map(
                                                    ( val, index ) => {
                                                        return <option key={index} selected={ Employee.department_code === val.department_code } value={ val.department_code }>{ val.department_name }</option>
                                                    }
                                                )
                                            }
                                        </select>
                                    </td>
                                    <td>
                                        <b>Designation</b> <br />
                                        <select className='form-control' id="designation_name" required>
                                            {
                                                Designations && Designations.map(
                                                    ( val, index ) => {
                                                        return <option key={index} selected={ Employee.designation_code === val.designation_code } value={ val.designation_code }>{ val.designation_name }</option>
                                                    }
                                                )
                                            }
                                        </select>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <b>IN/OUT Timings</b> <br />
                                        <div className='d-flex'>
                                            <select className='form-control mr-1' id="time_in" required>
                                                <option selected={ Employee.time_in === '09:00 AM'} value={'09:00 AM'}>09:00 AM</option>
                                                <option selected={ Employee.time_in === '09:30 AM'} value={'09:30 AM'}>09:30 AM</option>
                                                <option selected={ Employee.time_in === '10:00 AM'} value={'10:00 AM'}>10:00 AM</option>
                                                <option selected={ Employee.time_in === '10:30 AM'} value={'10:30 AM'}>10:30 AM</option>
                                                <option selected={ Employee.time_in === '11:00 AM'} value={'11:00 AM'}>11:00 AM</option>
                                                <option selected={ Employee.time_in === '11:30 AM'} value={'11:30 AM'}>11:30 AM</option>
                                                <option selected={ Employee.time_in === '12:00 PM'} value={'12:00 PM'}>12:00 PM</option>
                                                <option selected={ Employee.time_in === '12:30 PM'} value={'12:30 PM'}>12:30 PM</option>
                                                <option selected={ Employee.time_in === '13:00 PM'} value={'13:00 PM'}>13:00 PM</option>
                                                <option selected={ Employee.time_in === '13:30 PM'} value={'13:30 PM'}>13:30 PM</option>
                                                <option selected={ Employee.time_in === '14:00 PM'} value={'14:00 PM'}>14:00 PM</option>
                                                <option selected={ Employee.time_in === '14:30 PM'} value={'14:30 PM'}>14:30 PM</option>
                                            </select>
                                            <select className='form-control ml-1' id="time_out" required>
                                                <option selected={ Employee.time_out === '03:00 PM'} value={'03:00 PM'}>03:00 PM</option>
                                                <option selected={ Employee.time_out === '03:30 PM'} value={'03:30 PM'}>03:30 PM</option>
                                                <option selected={ Employee.time_out === '04:00 PM'} value={'04:00 PM'}>04:00 PM</option>
                                                <option selected={ Employee.time_out === '04:30 PM'} value={'04:30 PM'}>04:30 PM</option>
                                                <option selected={ Employee.time_out === '05:00 PM'} value={'05:00 PM'}>05:00 PM</option>
                                                <option selected={ Employee.time_out === '05:30 PM'} value={'05:30 PM'}>05:30 PM</option>
                                                <option selected={ Employee.time_out === '06:00 PM'} value={'06:00 PM'}>06:00 PM</option>
                                                <option selected={ Employee.time_out === '06:30 PM'} value={'06:30 PM'}>06:30 PM</option>
                                                <option selected={ Employee.time_out === '07:00 PM'} value={'07:00 PM'}>07:00 PM</option>
                                                <option selected={ Employee.time_out === '07:30 PM'} value={'07:30 PM'}>07:30 PM</option>
                                                <option selected={ Employee.time_out === '08:00 PM'} value={'08:00 PM'}>08:00 PM</option>
                                                <option selected={ Employee.time_out === '08:30 PM'} value={'08:30 PM'}>08:30 PM</option>
                                                <option selected={ Employee.time_out === '09:00 PM'} value={'09:00 PM'}>09:00 PM</option>
                                                <option selected={ Employee.time_out === '09:30 PM'} value={'09:30 PM'}>09:30 PM</option>
                                                <option selected={ Employee.time_out === '10:00 PM'} value={'10:00 PM'}>10:00 PM</option>
                                                <option selected={ Employee.time_out === '10:30 PM'} value={'10:30 PM'}>10:30 PM</option>
                                            </select>
                                        </div>
                                    </td>
                                    <td>
                                        <b>Employment Type</b> <br />
                                        <select className='form-control' id="type" required>
                                            <option selected={ Employee.type === "Regular" } value="Regular">Regular</option>
                                            <option selected={ Employee.type === "Temporary" } value="Temporary">Temporary</option>
                                            <option selected={ Employee.type === "Contractual" } value="Contractual">Contractual</option>
                                        </select>
                                    </td>
                                    <td>
                                        <b>Grade Code</b> <br />
                                        <select className='form-control' id="grade_code" required>
                                            {
                                                Grades && Grades.map(
                                                    ( val, index ) => {
                                                        return <option key={index} selected={ Employee.grade_code === val.grade_code } value={ val.grade_code }>{ val.grade }</option>
                                                    }
                                                )
                                            }
                                        </select>
                                    </td>
                                </tr>
                                <tr>
                                    <th className='text-uppercase bg-lightgray letter-spacing' colSpan={4}>cnic information</th>
                                </tr>
                                <tr>
                                    <td>
                                        <b>CNIC Number</b> <br />
                                        <input className='form-control' type='number' id="cnic" defaultValue={ Employee.cnic } required />
                                    </td>
                                    <td>
                                        <b>CNIC Date Of Issue</b> <br />
                                        <input className='form-control' type='date' id="cnic_date_of_issue" defaultValue={ moment(Employee.cnic_date_of_issue).format('YYYY-MM-DD') } required />
                                    </td>
                                    <td>
                                        <b>CNIC Date Of Expiry</b> <br />
                                        <input className='form-control' type='date' id="cnic_date_of_expiry" defaultValue={ moment(Employee.cnic_date_of_expiry).format('YYYY-MM-DD') } required />
                                    </td>
                                </tr>
                                <tr>
                                    <td style={{ verticalAlign: 'middle', textAlign: 'center' }} className='bg-lightgray'>
                                        <div>
                                            <h4 className='font-weight-bold'>DOCUMENTS</h4>
                                        </div>
                                    </td>
                                    <td>
                                        <b>CNIC Front Image</b> <br />
                                        <input className='form-control' type='file' id="cnic_front_image" name={ Employee.cnic_front_image } onChange={ onUpload } />
                                    </td>
                                    <td>
                                        <b>CNIC Back Image</b> <br />
                                        <input className='form-control' type='file' id="cnic_back_image" name={ Employee.cnic_back_image } onChange={ onUpload } />
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <h5>Employee Properties</h5>
                                        <hr />
                                        <b>Enable/Disable Attendance</b> <br />
                                        <select className='form-control' id="attendance_enable" required>
                                            <option selected={ Employee.attendance_enable === 1 } value={1}>Enabled</option>
                                            <option selected={ Employee.attendance_enable === 0 } value={0}>Disabled</option>
                                        </select>
                                    </td>
                                    <td>
                                        <b>CV</b> <br />
                                        <input className='form-control' type='file' id="cv" name={ Employee.cv } onChange={ onUpload } />
                                    </td>
                                    <td>
                                        <b>Proof Of Address</b> <br />
                                        <input className='form-control' type='file' id="proof_of_address" name={ Employee.proof_of_address } onChange={ onUpload } />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </fieldset>
                </form>
                :
                <h6 className='text-center'>Please Wait...</h6>
            }
        </>
    )

}