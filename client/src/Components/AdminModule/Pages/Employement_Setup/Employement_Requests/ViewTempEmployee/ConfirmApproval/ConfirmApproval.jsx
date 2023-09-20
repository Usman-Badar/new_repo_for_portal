import React, { useEffect, useState } from 'react';

import './ConfirmApproval.css';
import axios from '../../../../../../../axios';
import $ from 'jquery';

import { useHistory } from 'react-router-dom';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ConfirmApproval = () => {

    const history = useHistory();

    let key = 'real secret keys should be long and random';
    const encryptor = require('simple-encryptor')(key);

    const [ Employee, setEmployee ] = useState([]);
    const [ Props, setProps ] = useState([]);
    const [ Departments, setDepartments ] = useState([]);
    const [ Designations, setDesignations ] = useState([]);
    const [ Companies, setCompanies ] = useState([]);
    const [ Locations, setLocations ] = useState([]);
    const [ Grades, setGrades ] = useState([]);
    const [ EmpAccess, setEmpAccess ] = useState([]);
    const [ AccessAssigned, setAccessAssigned ] = useState([]);

    const [ EmployeeCode, setEmployeeCode ] = useState();
    const [ EmpData, setEmpData ] = useState(
        {
            additionalOFF: '', Designations: '', departments: '', Location: '',
            TimeOUT: '', TimeIN: '', CnfPassword: '', EmpPassword: '',
            LoginID: '', empID: '', CompanyName: '', doj: '', salary: '', EmpGrade: ''
        }
    )
    const [ AdditionalOffDays, setAdditionalOffDays ] = useState([]);

    useEffect(
        () => {

            const Data = new FormData();
            Data.append('empID', window.location.href.split('/').pop());
            axios.post('/gettempemployeedetails', Data).then( response => {

                setEmployee( response.data );
                axios.get('/getempprops').then( response => {

                    setProps( response.data );
    
                } )

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

            axios.get('/getcompaniescodes').then( response => {

                setCompanies( response.data );

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

            axios.get('/getalldepartments').then( response => {

                setDepartments( response.data );

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

            axios.get('/getalllocations').then( response => {

                setLocations( response.data );

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

            axios.get('/getallaccess').then( response => {

                setEmpAccess( response.data );

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

            axios.get('/getallgrades').then( response => {

                setGrades( response.data );

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
    );

    // Call on change function to store input field data into usestate()
    const OnChangeHandler = ( e ) => {

        const { name, value } = e.target;

        if ( name === 'EmpPassword' || name === 'CnfPassword' || name === 'LoginID' )
        {

            const setValues = {
                ...EmpData,
                [name]: encryptor.encrypt( value )
            }
    
            setEmpData(setValues);

        }else
        {
            const setValues = {
                ...EmpData,
                [name]: value
            }
    
            setEmpData(setValues);
        }

        if ( name === 'CompanyName' )
        {

            const Data = new FormData();
            Data.append('CompanyCode', value);
            axios.post('/getcompany', Data).then(response => {
    
                if( response.data[0] )
                {
                    let empID = parseInt( response.data[0].emp_id ) + 1;
                    setEmployeeCode( empID.toString() );
                }else
                {
                    setEmployeeCode( value + '001' );
                }
    
            }).catch(err => {
    
                toast.dark(err, {
                    position: 'top-right',
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
    
            });

        }

        if ( name === 'departments' )
        {

            const Data = new FormData();
            Data.append('departID', value);
            axios.post('/getdesignations', Data).then(response => {
    
                setDesignations(response.data);
    
            }).catch(err => {
    
                toast.dark(err, {
                    position: 'top-right',
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
    
            });

        }

        if ( name === 'additionalOffDays' )
        {
            if ( $("input[name='additionalOffDays'][value='" + value + "']").prop('checked') === true )
            {
                setAdditionalOffDays( [ ...AdditionalOffDays, value ] );
            }else
            {
                setAdditionalOffDays(
                    AdditionalOffDays.filter(
                        (val, index, arr) => {
                            return val !== value;
                        }
                    )
                );
            }
        }

        if ( name === 'access' )
        {

            if ( $("input[name='access'][value='" + value + "']").prop('checked') )
            {

                setAccessAssigned( [ ...AccessAssigned, parseInt( value ) ] );

            }else
            {
                setAccessAssigned(
                    AccessAssigned.filter(
                        (val, index, arr) => {
                            return val !== parseInt( value );
                        }
                    )
                );
            }

        }

        if ( name === 'checkallaccess' )
        {

            if ( $("input[name='checkallaccess']").prop('checked') )
            {

                let data = [];
                for( let x = 0; x < EmpAccess.length; x++ )
                {
                    data.push( EmpAccess[x].access_id );
                }

                setAccessAssigned( data );
                $("input[type='checkbox']").prop('checked', true);

            }else
            {
                setAccessAssigned( [] );
                $("input[type='checkbox']").prop('checked', false);
            }
        }

    }

    const OnSetupEmployee = ( e ) => {

        e.preventDefault();

        if ( encryptor.decrypt( EmpData.EmpPassword ) === encryptor.decrypt( EmpData.CnfPassword ) )
        {
            let boxes = [];
            for ( let x = 0; x < Props.length; x++ )
            {
                if ( Props[x].Field !== 'id' && Props[x].Field !== 'emp_id' )
                {
                    if ( Props[x].Type === "tinyint(1)" )
                    {
                        boxes.push(
                            {
                                field: e.target[Props[x].Field].name,
                                checked: e.target[Props[x].Field].checked
                            }
                        )
                    }else
                    {
                        boxes.push(
                            {
                                field: e.target[Props[x].Field].name,
                                value: e.target[Props[x].Field].value
                            }
                        )
                    }
                }
            }
            let arr = [];
            arr.push( EmpData );
            arr.push( Employee[0] );
            arr.push( JSON.stringify( AdditionalOffDays ) );
            arr.push( EmployeeCode );
            arr.push( JSON.stringify( AccessAssigned ) );
            arr.push( JSON.stringify( boxes ) );
        
            axios.post('/createemployee', arr).then( () => {

                history.replace('/admin_employement_requests');

            } ).catch( err => {

                toast.dark( err , {
                    position: 'top-right',
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });

            } );
        }

    }

    return (
        <>
            <div className='ConfirmApproval d-center'>
                <div className="ConfirmApproval-content">
                    <div className="container-fluid">
                        <h2>Employee Profile</h2>
                        <form onSubmit={ OnSetupEmployee }>
                        <div className="row">
                            <div className="col-lg-6 col-md-6 col-sm-12 mb-3">
                                <span>Company Name</span>
                                <select className="form-control" name="CompanyName" onChange={ OnChangeHandler } required>
                                    <option value=''>Select an option</option>
                                    {
                                        Companies.map(
                                            ( val, index ) => {

                                                return (
                                                    <option key={ index } value={ val.company_code }> { val.company_name } </option>
                                                )

                                            }
                                        )
                                    }
                                </select>
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-12 mb-3">
                                <span>Employee ID</span>
                                <input type="text" className="form-control" name="empID" value={ EmployeeCode } readOnly required />
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-12 mb-3">
                                <span>Employee Grade</span>
                                <select className="form-control" name="EmpGrade" onChange={ OnChangeHandler } required>
                                    <option value=''>Select an option</option>
                                    {
                                        Grades.map(
                                            ( val, index ) => {

                                                return (
                                                    <option key={ index } value={ val.grade_code }> { val.grade } </option>
                                                )

                                            }
                                        )
                                    }
                                </select>
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-12 mb-3">
                                <span>Login ID</span>
                                <input type="text" className="form-control" name="LoginID" onChange={ OnChangeHandler } minLength="3" required />
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-12 mb-3">
                                <span>Password</span>
                                <input type="password" className="form-control" name="EmpPassword" onChange={ OnChangeHandler } minLength="3" required />
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-12 mb-3">
                                <span>Confirm Password</span>
                                <input type="password" className="form-control" name="CnfPassword" onChange={ OnChangeHandler } minLength="3" required />
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-12 mb-3">
                                <div className="d-flex align-items-center">
                                    <div className="w-50 mr-1">
                                        <span>TimeIN</span>
                                        <select className="form-control" name="TimeIN" onChange={ OnChangeHandler } required>
                                            <option value=''>Select an option</option>
                                            <option value='05:00 AM'>05:00 AM</option>
                                            <option value='05:30 AM'>05:30 AM</option>
                                            <option value='06:00 AM'>06:00 AM</option>
                                            <option value='06:30 AM'>06:30 AM</option>
                                            <option value='07:00 AM'>07:00 AM</option>
                                            <option value='07:30 AM'>07:30 AM</option>
                                            <option value='08:00 AM'>08:00 AM</option>
                                            <option value='08:30 AM'>08:30 AM</option>
                                            <option value='09:00 AM'>09:00 AM</option>
                                            <option value='09:30 AM'>09:30 AM</option>
                                            <option value='10:00 AM'>10:00 AM</option>
                                            <option value='10:30 AM'>10:30 AM</option>
                                            <option value='11:00 AM'>11:00 AM</option>
                                            <option value='11:30 AM'>11:30 AM</option>
                                            <option value='12:00 PM'>12:00 PM</option>
                                            <option value='12:30 PM'>12:30 PM</option>
                                            <option value='01:00 PM'>01:00 PM</option>
                                            <option value='01:30 PM'>01:30 PM</option>
                                            <option value='02:00 PM'>02:00 PM</option>
                                            <option value='02:30 PM'>02:30 PM</option>
                                            <option value='03:00 PM'>03:00 PM</option>
                                            <option value='03:30 PM'>03:30 PM</option>
                                            <option value='04:00 PM'>04:00 PM</option>
                                            <option value='04:30 PM'>04:30 PM</option>
                                            <option value='05:00 PM'>05:00 PM</option>
                                            <option value='05:30 PM'>05:30 PM</option>
                                            <option value='06:00 PM'>06:00 PM</option>
                                            <option value='06:30 PM'>06:30 PM</option>
                                            <option value='07:00 PM'>07:00 PM</option>
                                            <option value='07:30 PM'>07:30 PM</option>
                                            <option value='08:00 PM'>08:00 PM</option>
                                            <option value='08:30 PM'>08:30 PM</option>
                                        </select>
                                    </div>
                                    <div className="w-50 ml-1">
                                        <span>TimeOUT</span>
                                        <select className="form-control" name="TimeOUT" onChange={ OnChangeHandler } required>
                                            <option value=''>Select an option</option>
                                            <option value='05:00 AM'>05:00 AM</option>
                                            <option value='05:30 AM'>05:30 AM</option>
                                            <option value='06:00 AM'>06:00 AM</option>
                                            <option value='06:30 AM'>06:30 AM</option>
                                            <option value='07:00 AM'>07:00 AM</option>
                                            <option value='07:30 AM'>07:30 AM</option>
                                            <option value='08:00 AM'>08:00 AM</option>
                                            <option value='08:30 AM'>08:30 AM</option>
                                            <option value='09:00 AM'>09:00 AM</option>
                                            <option value='09:30 AM'>09:30 AM</option>
                                            <option value='10:00 AM'>10:00 AM</option>
                                            <option value='10:30 AM'>10:30 AM</option>
                                            <option value='11:00 AM'>11:00 AM</option>
                                            <option value='11:30 AM'>11:30 AM</option>
                                            <option value='12:00 PM'>12:00 PM</option>
                                            <option value='12:30 PM'>12:30 PM</option>
                                            <option value='01:00 PM'>01:00 PM</option>
                                            <option value='01:30 PM'>01:30 PM</option>
                                            <option value='02:00 PM'>02:00 PM</option>
                                            <option value='02:30 PM'>02:30 PM</option>
                                            <option value='03:00 PM'>03:00 PM</option>
                                            <option value='03:30 PM'>03:30 PM</option>
                                            <option value='04:00 PM'>04:00 PM</option>
                                            <option value='04:30 PM'>04:30 PM</option>
                                            <option value='05:00 PM'>05:00 PM</option>
                                            <option value='05:30 PM'>05:30 PM</option>
                                            <option value='06:00 PM'>06:00 PM</option>
                                            <option value='06:30 PM'>06:30 PM</option>
                                            <option value='07:00 PM'>07:00 PM</option>
                                            <option value='07:30 PM'>07:30 PM</option>
                                            <option value='08:00 PM'>08:00 PM</option>
                                            <option value='08:30 PM'>08:30 PM</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-12 mb-3">
                                <span>Location</span>
                                <select className="form-control" name="Location" onChange={ OnChangeHandler } required>
                                    <option value=''>Select an option</option>
                                    {
                                        Locations.map(
                                            ( val, index ) => {

                                                return (
                                                    <option key={ index } value={ val.location_code }> { val.location_name } </option>
                                                )

                                            }
                                        )
                                    }
                                </select>
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-12 mb-3">
                                <span>Department</span>
                                <select className="form-control" name="departments" onChange={ OnChangeHandler } required>
                                    <option value=''>Select an option</option>
                                    {
                                        Departments.map(
                                            ( val, index ) => {

                                                return (
                                                    <option key={ index } value={ val.department_code }> { val.department_name } </option>
                                                )

                                            }
                                        )
                                    }
                                </select>
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-12 mb-3">
                                <span>Designation</span>
                                <select className="form-control" name="Designations" onChange={ OnChangeHandler } required>
                                    <option value=''>Select an option</option>
                                    {
                                        Designations.map(
                                            ( val, index ) => {

                                                return (
                                                    <option key={ index } value={ val.designation_code }> { val.designation_name } </option>
                                                )

                                            }
                                        )
                                    }
                                </select>
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-12 mb-3">
                                <span>Date Of Joining</span>
                                <input type="date" className="form-control" name="doj" onChange={ OnChangeHandler } required />
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-12 mb-3">
                                <span>Salary</span>
                                <input placeholder="Rs" type="text" pattern="^[0-9]+$" className="form-control" name="salary" onChange={ OnChangeHandler } required />
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-12 mb-3">
                                <span>Additional Off</span>
                                <select className="form-control" name="additionalOFF" onChange={ OnChangeHandler }>
                                    <option value=''>Select an option</option>
                                    <option value='yes'>Yes</option>
                                    <option value='No'>No</option>
                                </select>
                            </div>
                            {
                                EmpData.additionalOFF === 'yes'
                                ?
                                    <div className="col-lg-6 col-md-6 col-sm-12 mb-3">
                                        <b>Select Days</b>
                                        <div className="d-flex align-items-center w-100">
                                            <div className=" w-50">
                                                <input type="checkbox" name="additionalOffDays" onChange={ OnChangeHandler } value="Monday" /> Monday <br />
                                                <input type="checkbox" name="additionalOffDays" onChange={ OnChangeHandler } value="Tuesday" /> Tuesday <br />
                                                <input type="checkbox" name="additionalOffDays" onChange={ OnChangeHandler } value="Wednessday" /> Wednessday <br />
                                            </div>
                                            <div className=" w-50">
                                                <input type="checkbox" name="additionalOffDays" onChange={ OnChangeHandler } value="Thursday" /> Thursday <br />
                                                <input type="checkbox" name="additionalOffDays" onChange={ OnChangeHandler } value="Friday" /> Friday <br />
                                                <input type="checkbox" name="additionalOffDays" onChange={ OnChangeHandler } value="Saturday" /> Saturday <br />
                                            </div>
                                        </div>
                                    </div>
                                :
                                null
                            }
                            <div className="col-lg-12 col-md-12 col-sm-12 mb-3">
                                <b>Employee Props</b>
                                {
                                    Props.map(
                                        val => {
                                            let content = <></>;

                                            if ( val.Field !== 'id' && val.Field !== 'emp_id' )
                                            {
                                                content = <div className='d-flex align-items-center'>
                                                    {
                                                        val.Type === "tinyint(1)"
                                                        ?
                                                        <input type="checkbox" name={ val.Field } />
                                                        :
                                                        val.Type === "int(11)" || val.Type === "float"
                                                        ?
                                                        <input type="number" defaultValue={0} name={ val.Field } />
                                                        :
                                                        <input type="text" name={ val.Field } />
                                                    }
                                                    <span className='ml-2'>
                                                        {
                                                            val.Field
                                                        }
                                                    </span>
                                                </div>
                                            }

                                            return content;

                                        }
                                    )
                                }
                            </div>
                            <div className="col-lg-12 col-md-12 col-sm-12 mb-3">
                                <div className="d-flex justify-content-between">
                                    <div>
                                        <span>Assign employee some access (optional):</span>    
                                    </div>
                                    <div>
                                        <input type="checkbox" name="checkallaccess" onChange={ OnChangeHandler } /> Check All
                                    </div>
                                </div>
                                <div className="empAccess">
                                {
                                    EmpAccess.map(
                                        ( val, index ) => {
                                            return (
                                                <div key={ index } className="empAccess-Items">
                                                    <input type="checkbox" name="access" value={ val.access_id } onChange={ OnChangeHandler } /> { val.access_title }
                                                </div>
                                            )
                                        }
                                    )
                                }
                                </div>
                            </div>
                            <div className="col-lg-12 col-md-12 col-sm-12 mb-3 text-center">
                                <button type="submit" className="btn btn-dark px-4" style={ { 'borderRadius' : '30px' } }>Create Employee</button>
                            </div>
                        </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )

}

export default ConfirmApproval;