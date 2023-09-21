/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import './Style.css';
import { Switch, Route } from 'react-router-dom';
import { useHistory } from 'react-router-dom';

import { GetCompanies, GetDesignations, loadRequests, onSubmit, loadDetails, approveTempEmployee, verifyTheRequest, verifyRequest } from './Functions';
import Form from '../../../../../../utils/form/Form';
import { useSelector } from 'react-redux';
import Modal from '../../../../../UI/Modal/Modal';

const TemporaryEmployees = () => {
    const history = useHistory();
    const AccessControls = useSelector( ( state ) => state.EmpAuth.EmployeeData );
    return (
        <>
            <Switch>
                <Route exact path="/hr/temporary/employees/list" render={ 
                    () => (
                        <List 
                            history={ history }
                            AccessControls={ AccessControls }

                            loadRequests={ loadRequests }
                        />
                    )
                } />
                <Route exact path="/hr/temporary/employees/form" render={ 
                    () => (
                        <TempForm 
                            history={ history }

                            onSubmit={ onSubmit }
                            GetCompanies={ GetCompanies }
                            GetDesignations={ GetDesignations }
                        />
                    )
                } />
                <Route exact path="/hr/temporary/employees/details/:emp_id" render={ 
                    () => (
                        <TempEmpDetails 
                            history={ history }
                            AccessControls={ AccessControls }

                            loadDetails={ loadDetails }
                            approveTempEmployee={ approveTempEmployee }
                        />
                    )
                } />
            </Switch>
        </>
    )
}

export default TemporaryEmployees;

const List = ({ AccessControls, history, loadRequests }) => {
    const [ requests, setRequests ] = useState();
    useEffect(
        () => {
            if ( AccessControls ) {
                const access = JSON.parse(AccessControls.access).filter(acs => acs === 55 || acs === 58)[0];
                if (access)  {
                    loadRequests( AccessControls.access, AccessControls.companies, setRequests );
                }else {
                    setRequests("You don't have access to view the list");
                }
            };
        }, [ AccessControls ]
    )
    return (
        <>
            <div className='page'>
                <div className='page-content'>
                    <div className='d-flex justify-content-between'>
                        <h3 className="heading">
                            Temporary Employees
                            <sub>View The List Here</sub>
                        </h3>
                        <div>
                            <button className='btn submit' onClick={() => history.push('/hr/temporary/employees/form')}>Request New</button>
                        </div>
                    </div>
                    <hr />
                    {
                        requests
                        ?
                        typeof(requests) === 'string'
                        ?
                        <h6 className='text-center'>{requests}</h6>
                        :
                        requests.length === 0
                        ?
                        <h6 className='text-center'>No Record Found</h6>
                        :
                        <div className='records-container' style={{ maxHeight: '70vh' }}>
                            <table className='table'>
                                <thead>
                                    <tr>
                                        <th className='border-top-0'>Sr.No</th>
                                        <th className='border-top-0'>Name</th>
                                        <th className='border-top-0'>Father Name</th>
                                        <th className='border-top-0'>Company & Location</th>
                                        <th className='border-top-0'>Created At</th>
                                        <th className='border-top-0'>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        requests.map(({created_by_person, temp_emp_id, name, father_name, status, designation, department, company_name, location_name, created_at}, index) => {
                                            return (
                                                <tr key={index} className='pointer pointer-hover' onClick={ () => history.push('/hr/temporary/employees/details/' + temp_emp_id) }>
                                                    <td>{ index + 1 }</td>
                                                    <td>
                                                        <b>{name}</b><br />
                                                        <span>{designation}, {department} Dept.</span>
                                                    </td>
                                                    <td>{father_name}</td>
                                                    <td>
                                                        <span>{company_name}</span><br />
                                                        <span>{location_name}</span>
                                                    </td>
                                                    <td>
                                                        <span>{created_by_person}</span><br />
                                                        <span>{new Date(created_at).toDateString()}</span>
                                                    </td>
                                                    <td>
                                                        <span className='text-warning text-capitalize'>{status.split("_").join(" ")}</span>
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </table>
                        </div>
                        :
                        <h6 className='text-center'>Please Wait....</h6>
                    }
                </div>
            </div>
        </>
    )
}

const TempForm = ({ history, GetCompanies, onSubmit, GetDesignations }) => {
    const [CNICFront, setCNICFront] = useState();
    const [CNICBack, setCNICBack] = useState();
    const [empImage, setEmpImage] = useState();

    const [companies, setCompanies] = useState([]);
    const [locations, setLocations] = useState([]);
    const [departments, setDepartments] = useState([]);

    useEffect(
        () => {
            GetCompanies(setCompanies, setLocations, setDepartments);
        }, []
    );

    return (
        <>
            <div className='page'>
                <Form 
                    loading={
                        {
                            type: 3
                        }
                    }
                    submission={
                        {
                            custom: true,
                            handler: ( e, setLoading ) => onSubmit( e, setLoading, CNICFront, CNICBack, empImage, history ),
                            api: '',
                            successMessage: 'Form Sub',
                            redirectUrl: '',
                        }
                    }
                    heading={
                        {
                            type: 'page-heading',
                            title: 'Temporary/Daily Wages Employment Form',
                            subTitle: 'Seaboard Group Employee Data Form',
                            line: true,
                            buttons: [
                                <button className='btn light' onClick={() => history.goBack()}>Back</button>
                            ]
                        }
                    }
                    fields={
                        [
                            {
                                grid: 2,
                                list: [
                                    {
                                        label: {
                                            text: "Companies",
                                            bold: true
                                        },
                                        name: "company_code",
                                        required: true,
                                        inputType: 'select',
                                        options: companies
                                    },
                                    {
                                        label: {
                                            text: "Locations",
                                            bold: true
                                        },
                                        name: "location_code",
                                        required: true,
                                        inputType: 'select',
                                        options: locations
                                    },
                                    {
                                        label: {
                                            text: "Department",
                                            bold: true
                                        },
                                        type: 'text',
                                        name: "department",
                                        required: true,
                                        inputType: 'input',
                                        placeholder: "Department",
                                    },
                                    {
                                        label: {
                                            text: "Designation",
                                            bold: true
                                        },
                                        type: 'text',
                                        name: "designation",
                                        required: true,
                                        inputType: 'input',
                                        placeholder: "Designation",
                                    },
                                    {
                                        label: {
                                            text: "Name",
                                            bold: true
                                        },
                                        type: 'text',
                                        name: "name",
                                        required: true,
                                        inputType: 'input',
                                        placeholder: "Employee Name",
                                        minLength: "3",
                                    },
                                    {
                                        label: {
                                            text: "Father Name",
                                            bold: true
                                        },
                                        type: 'text',
                                        name: "f_name",
                                        required: true,
                                        inputType: 'input',
                                        placeholder: "Employee Father Name",
                                        minLength: "3",
                                    },
                                    {
                                        label: {
                                            text: "Date of Birth",
                                            bold: true
                                        },
                                        type: 'date',
                                        name: "d_o_b",
                                        required: true,
                                        inputType: 'input',
                                        placeholder: "Employee Date of Birth",
                                    },
                                    {
                                        label: {
                                            text: "Cell Phone Number",
                                            bold: true
                                        },
                                        type: 'text',
                                        name: "cell",
                                        required: true,
                                        inputType: 'input',
                                        placeholder: "Employee Cell Phone Number",
                                        pattern: "^[0-9]+$",
                                        minLength:"11",
                                        maxLength:"13",
                                    },
                                    {
                                        label: {
                                            text: "Gender",
                                            bold: true
                                        },
                                        name: "gender",
                                        required: true,
                                        inputType: 'select',
                                        options: [
                                            {
                                                text: "Select one option",
                                                value: "",
                                            },
                                            {
                                                text: "Male",
                                                value: "male",
                                            },
                                            {
                                                text: "FeMale",
                                                value: "female",
                                            },
                                        ]
                                    },
                                    {
                                        label: {
                                            text: "Address",
                                            bold: true
                                        },
                                        type: 'text',
                                        name: "address",
                                        required: true,
                                        inputType: 'input',
                                        placeholder: "Employee Permanent Address",
                                        minLength: "10",
                                    },
                                    {
                                        label: {
                                            text: "Additional Notes",
                                            bold: true
                                        },
                                        type: 'text',
                                        name: "additional_notes",
                                        required: true,
                                        inputType: 'input',
                                        placeholder: "Need additional notes....",
                                        minLength: "5",
                                    },
                                    {
                                        label: {
                                            text: "CNIC",
                                            bold: true
                                        },
                                        type: 'number',
                                        name: "cnic_no",
                                        required: true,
                                        inputType: 'input',
                                        placeholder: "Employee CNIC Number",
                                        pattern: "^[0-9]+$",
                                        minLength: "13",
                                        maxLength: "13",
                                    },
                                    {
                                        label: {
                                            text: "CNIC Date Of Issue",
                                            bold: true
                                        },
                                        type: 'date',
                                        name: "cnic_d_o_i",
                                        required: true,
                                        inputType: 'input',
                                        placeholder: "Employee CNIC Date Of Issue",
                                    },
                                    {
                                        label: {
                                            text: "CNIC Date Of Expiry",
                                            bold: true
                                        },
                                        type: 'date',
                                        name: "cnic_d_o_e",
                                        required: true,
                                        inputType: 'input',
                                        placeholder: "Employee CNIC Date Of Expiry",
                                    },
                                    {
                                        label: {
                                            text: "CNIC Front Image",
                                            bold: true
                                        },
                                        type: 'file',
                                        name: "cnic_front",
                                        required: true,
                                        inputType: 'input',
                                        preview: {
                                            width: "50%"
                                        },
                                        accept: ".jpg, .jpeg, .png",
                                        changeHandler: setCNICFront,
                                    },
                                    {
                                        label: {
                                            text: "CNIC Back Image",
                                            bold: true
                                        },
                                        type: 'file',
                                        name: "cnic_back",
                                        required: true,
                                        inputType: 'input',
                                        preview: {
                                            width: "50%"
                                        },
                                        accept: ".jpg, .jpeg, .png",
                                        changeHandler: setCNICBack,
                                    },
                                    {
                                        label: {
                                            text: "Employee Image",
                                            bold: true
                                        },
                                        type: 'file',
                                        name: "emp_image",
                                        required: true,
                                        inputType: 'input',
                                        preview: {
                                            width: "50%"
                                        },
                                        accept: ".jpg, .jpeg, .png",
                                        changeHandler: setEmpImage,
                                    },
                                ]
                            },
                        ]
                    }
                    btn={
                        {
                            alignment: 'end',
                            space: true,
                            list: [
                                {
                                    text: 'Submit',
                                    type: 'submit',
                                    color: 'submit',
                                }
                            ]
                        }
                    }
                />
            </div>
        </>
    )
}

const TempEmpDetails = ({ AccessControls, history, approveTempEmployee, loadDetails }) => {
    const [ details, setDetails ] = useState();
    const [ verificationPerson, setVerificationPerson ] = useState(false);
    const [ showVerificationConfirmation, setShowVerificationConfirmation ] = useState(false);
    const [ showApprovalConfirmation, setShowApprovalConfirmation ] = useState(false);
    useEffect(
        () => {
            loadDetails(window.location.href.split('/').pop(), setDetails);
            const verification_person = JSON.parse(AccessControls.access).filter(acs => acs === 58)[0];
            setVerificationPerson(verification_person);
        }, []
    );

    return (
        <>
            <Modal show={ showVerificationConfirmation } Hide={ () => setShowVerificationConfirmation(!showVerificationConfirmation) } content={
                <form onSubmit={(e) => verifyRequest(e, history)}>
                    <fieldset>
                        <h5>Remarks Required</h5>
                        <hr />
                        <textarea name="remarks" className='form-control mb-3' placeholder='Enter your remarks here....' minLength={20} required />
                        <button className='btn submit d-block ml-auto'>Confirm</button>
                    </fieldset>
                </form>
            } />
            <Modal show={ showApprovalConfirmation } Hide={ () => setShowApprovalConfirmation(!showApprovalConfirmation) } content={
                <form onSubmit={(e) => approveTempEmployee(e, history)}>
                    <fieldset>
                        <h5>Remarks Required</h5>
                        <hr />
                        <textarea name="remarks" className='form-control mb-3' placeholder='Enter your remarks here....' minLength={20} required />
                        <button className='btn submit d-block ml-auto'>Confirm</button>
                    </fieldset>
                </form>
            } />
            <div className='page'>
                <div className='page-content'>
                    <div className='d-flex justify-content-between'>
                        <h3 className="heading">
                            Temporary Employee Details
                            <sub>View The Details of The Temp Employee</sub>
                        </h3>
                        <div>
                            <button className='btn light' onClick={() => history.goBack()}>Back</button>
                            {
                                verificationPerson && details && details.status === 'waiting_for_verification'
                                ?
                                <button id="submission" className='btn submit ml-2' onClick={() => setShowVerificationConfirmation(!showVerificationConfirmation)}>Verify</button>
                                :null
                            }
                            {
                                !verificationPerson && details && details.status === 'waiting_for_approval'
                                ?
                                <button id="submission" className='btn submit ml-2' onClick={() => setShowApprovalConfirmation(!showApprovalConfirmation)}>Approve</button>
                                :null
                            }
                        </div>
                    </div>
                    <hr />
                    {
                        details
                        ?
                        <>
                            <div className='details_container'>
                                <div className='text-center'>
                                    <img src={process.env.REACT_APP_SERVER + '/client/images/employees/' + details.image} width="50%" alt="cnic_front" className='border rounded' />
                                </div>
                                <div>
                                    <label className='mb-0'><b>Employee Code</b></label><br />
                                    <span>{details.temp_emp_id}</span><br />
                                    <label className='mb-0'><b>Gender</b></label><br />
                                    <span className='text-capitalize'>{details.gender.toLowerCase()}</span><br />
                                    <label className='mb-0'><b>Address</b></label><br />
                                    <span>{details.address}</span><br />
                                    <label className='mb-0'><b>Cell Phone Number</b></label><br />
                                    <span>{details.cell}</span><br />
                                    <label className='mb-0'><b>CNIC Date of Issue</b></label><br />
                                    <span>{details.cnic_d_o_i}</span><br />
                                    <label className='mb-0'><b>Department</b></label><br />
                                    <span>{details.department}</span><br />
                                    <label className='mb-0'><b>Company</b></label><br />
                                    <span>{details.company_name}</span>
                                </div>
                                <div>
                                    <label className='mb-0'><b>Name</b></label><br />
                                    <span>{details.name}</span><br />
                                    <label className='mb-0'><b>Father Name</b></label><br />
                                    <span>{details.father_name}</span><br />
                                    <label className='mb-0'><b>Date of Birth</b></label><br />
                                    <span>{details.date_of_birth}</span><br />
                                    <label className='mb-0'><b>CNIC</b></label><br />
                                    <span>{details.cnic_no}</span><br />
                                    <label className='mb-0'><b>CNIC Date of Expiry</b></label><br />
                                    <span>{details.cnic_d_o_e}</span><br />
                                    <label className='mb-0'><b>Designation</b></label><br />
                                    <span>{details.designation}</span><br />
                                    <label className='mb-0'><b>Location</b></label><br />
                                    <span>{details.location_name}</span>
                                </div>
                                <div>
                                    <label className='mb-0'><b>Created By</b></label><br />
                                    <span>{details.requisition_name}</span><br />
                                    <label className='mb-0'><b>Additional Notes</b></label><br />
                                    <span>{details.addItional_notes}</span>
                                    {
                                        details.verification_remarks
                                        ?
                                        <>
                                            <hr />
                                            <label className='mb-0'><b>Verified By</b></label><br />
                                            <span>{details.verification_name}</span><br />
                                            <span>{new Date(details.verified_date).toDateString()}</span><br />
                                            <span>{details.verification_remarks}</span>
                                            <hr />
                                        </>
                                        :null
                                    }
                                    {
                                        details.approval_remarks
                                        ?
                                        <>
                                            <label className='mb-0'><b>Approved By</b></label><br />
                                            <span>{details.approval_name}</span><br />
                                            <span>{new Date(details.approved_date).toDateString()}</span><br />
                                            <span>{details.approval_remarks}</span>
                                            <hr />
                                        </>
                                        :null
                                    }
                                </div>
                                <div>
                                    <img src={process.env.REACT_APP_SERVER + '/client/images/documents/cnic/front/' + details.cnic_front} width="100%" alt="cnic_front" className='border rounded' />
                                    <h6 className='text-center'><b>CNIC Front Image</b></h6>
                                </div>
                                <div>
                                    <img src={process.env.REACT_APP_SERVER + '/client/images/documents/cnic/back/' + details.cnic_back} width="100%" alt="cnic_back" className='border rounded' />
                                    <h6 className='text-center'><b>CNIC Back Image</b></h6>
                                </div>
                            </div>

                        </>
                        :<h6 className='text-center'>Loading...</h6>
                    }
                </div>
            </div>
        </>
    )
}