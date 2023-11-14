/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import './Style.css';
import $ from 'jquery';
import JSAlert from 'js-alert';
import axios from '../../../../axios';
import ReactTooltip from 'react-tooltip';
import Modal from '../../../UI/Modal/Modal';
import { useHistory } from 'react-router-dom';
import { Menu, MenuItem } from '@szhsin/react-menu';
import { ToastContainer, toast } from 'react-toastify';
import "@szhsin/react-menu/dist/index.css";
import 'react-toastify/dist/ReactToastify.css';

const AccessManagement = () => {
    const history = useHistory();
    let moduleChangeTimeout;
    const [ empAccess, setEmpAccess ] = useState([]);
    const [ assignedAccessEmployees, setAssignAccessToEmployees ] = useState([]);
    const [ modalData, setModalData ] = useState();
    const [ accessCodesList, setAccessCodesList ] = useState([]);
    const [ accessList, setAccessList ] = useState();
    const [ lastAccessCode, setLastAccessCode ] = useState(0);
    const [ modulesList, setModulesList ] = useState([]);
    const [ employeesList, setEmployeesList ] = useState();
    const [ selectedEmployee, setSelectedEmployee ] = useState();
    useEffect(
        () => {
            loadAllAccess();
        }, []
    );
    useEffect(
        () => {
            if (assignedAccessEmployees.length > 0) {
                $('#assignBtn').removeClass('d-none').addClass('d-block');
            }else {
                if ($('#assignBtn').hasClass('d-block')) $('#assignBtn').removeClass('d-block').addClass('d-none');
            }
        }, [assignedAccessEmployees]
    );
    useEffect(
        () => {
            if (selectedEmployee) {
                $('#searchEmpInput').val('');
                setEmployeesList()
                setEmpAccess(JSON.parse(selectedEmployee.access));
            }
        }, [selectedEmployee]
    );
    const loadAllAccess = () => {
        axios.get('/access/get/all').then( response => {
            processData(response.data);
        } ).catch( err => {
            console.log(err);
            JSAlert.alert(`Something went wrong. ${err}`, "Failed To Fetch", JSAlert.Icons.Failed);
        } );
    }
    const processData = (data) => {
        const accessCodes = [];
        const modules = [];
        let lastIndex = 0;
        for ( let x = 0; x < data.length; x++ ) {
            const module = data[x].module;
            const access_id = data[x].access_id;
            if (access_id > lastIndex) {
                lastIndex = data[x].access_id;
            }
            if (!modules.includes(module)) modules.push(module);
            if (!accessCodes.includes(access_id)) accessCodes.push(access_id);
        }
        setLastAccessCode(lastIndex);
        setAccessCodesList(accessCodes);
        setModulesList(modules);
        setAccessList(data);
    }
    const createAccess = (access_id, module, access_title, access_description) => {
        setModalData(
            <>
                <h5 className='mb-0'>Create Access</h5>
                <hr />
                <form onSubmit={onCreateAccess}>
                    <fieldset>
                        <label className='mb-0 font-weight-bold'>Access Code</label>
                        <input type='number' className='form-control mb-2' defaultValue={access_id?access_id:lastAccessCode} name="access_id" required />
                        <label className='mb-0 font-weight-bold'>Module</label>
                        <select className='form-control mb-2' defaultValue={module?module:''} name="module" required>
                            <option value=''>Select The Option</option>
                            {
                                modulesList.map(
                                    (module, i) => {
                                        return <option key={i} value={module}>{module}</option>
                                    }
                                )
                            }
                        </select>
                        <label className='mb-0 font-weight-bold'>Access</label>
                        <input className='form-control mb-2' defaultValue={access_title?access_title:''} name="access_title" required />
                        <label className='mb-0 font-weight-bold'>Description</label>
                        <textarea className='form-control mb-2' defaultValue={access_description?access_description:''} name="access_description" required />
                        <button className='btn submit d-block ml-auto mt-2'>Create</button>
                    </fieldset>
                </form>
            </>
        )
    }
    const onCreateAccess = (e) => {
        e.preventDefault();
        const access_id = e.target['access_id'].value;
        const module = e.target['module'].value;
        const access_title = e.target['access_title'].value;
        const access_description = e.target['access_description'].value;

        if (access_id.trim().length === 0 || module.trim().length === 0 || access_title.trim().length === 0 || access_description.trim().length === 0) {
            JSAlert.alert(`All fields are required.`, "Validation Error", JSAlert.Icons.Warning).dismissIn(4000);
            return false;
        }else if (isNaN(parseInt(access_id))) {
            JSAlert.alert(`Invalid access code.`, "Validation Error", JSAlert.Icons.Warning).dismissIn(4000);
            return false;
        }else if (accessCodesList.includes(parseInt(access_id))) {
            JSAlert.alert(`Access code is already in use.`, "Validation Error", JSAlert.Icons.Warning).dismissIn(4000);
            return false;
        }

        setModalData(<h6 className='p-3 text-center mb-0'><b>Creating Access...</b></h6>);
        axios.post(
            '/access/create/new',
            {
                access_id: access_id,
                module: module,
                access_title: access_title,
                access_description: access_description,
            }
        ).then(() => {
            loadAllAccess();
            setModalData();
            JSAlert.alert(`Access has been created`, "Success", JSAlert.Icons.Success).dismissIn(2000);
        } ).catch( err => {
            createAccess(module, access_title, access_description);
            JSAlert.alert(`Something went wrong. ${err}`, "Request Failed", JSAlert.Icons.Failed);
            console.log(err);
        } );
    }
    const editAccess = (access_id, access_title, access_description, module) => {
        setModalData(
            <>
                <h5 className='mb-0'>Edit Access</h5>
                <hr />
                <form onSubmit={(e) => onEditAccess(e, access_id)}>
                    <fieldset>
                        <label className='mb-0 font-weight-bold'>Module</label>
                        <select className='form-control mb-2' defaultValue={module?module:''} name="module" required>
                            <option value=''>Select The Option</option>
                            {
                                modulesList.map(
                                    (module, i) => {
                                        return <option key={i} value={module}>{module}</option>
                                    }
                                )
                            }
                        </select>
                        <label className='mb-0 font-weight-bold'>Access</label>
                        <input className='form-control mb-2' defaultValue={access_title?access_title:''} name="access_title" required />
                        <label className='mb-0 font-weight-bold'>Description</label>
                        <textarea className='form-control mb-2' defaultValue={access_description?access_description:''} name="access_description" required />
                        <button className='btn submit d-block ml-auto mt-2'>Update</button>
                    </fieldset>
                </form>
            </>
        )
    }
    const onEditAccess = (e, access_id) => {
        e.preventDefault();
        const module = e.target['module'].value;
        const access_title = e.target['access_title'].value;
        const access_description = e.target['access_description'].value;

        if (module.trim().length === 0 || access_title.trim().length === 0 || access_description.trim().length === 0) {
            JSAlert.alert(`All fields are required.`, "Validation Error", JSAlert.Icons.Warning).dismissIn(4000);
            return false;
        }
        setModalData(<h6 className='p-3 text-center mb-0'><b>Updating Access...</b></h6>);
        axios.post(
            '/access/create/update',
            {
                access_id: access_id,
                module: module,
                access_title: access_title,
                access_description: access_description,
            }
        ).then(() => {
            loadAllAccess();
            setModalData();
            JSAlert.alert(`Access has been updated`, "Success", JSAlert.Icons.Success).dismissIn(2000);
        } ).catch( err => {
            editAccess(access_id, access_title, access_description, module);
            JSAlert.alert(`Something went wrong. ${err}`, "Request Failed", JSAlert.Icons.Failed);
            console.log(err);
        } );
    }
    const assignAccessToEmployees = (access_id, access_title, employees, keyword) => {
        setModalData();
        let timeout;
        let empArr = employees || [];
        const arr = JSON.parse($('#stringify_assignedAccessEmployees').text());
        function searchEmployee(e) {
            const keyword = e.target.value;
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                $('#message').text('Please Wait...');
                axios.post('/employees/search/keyword', {keyword:keyword}).then( response => {
                    $('#message').text('');
                    assignAccessToEmployees(access_id, access_title, response.data, keyword);
                } ).catch( err => {
                    console.log(err);
                    JSAlert.alert(`Something went wrong. ${err}`, "Failed To Fetch", JSAlert.Icons.Failed);
                } );
            }, 1000);
        }
        setModalData(
            <>
                <h5 className='mb-0'>Assign Access</h5>
                <br />
                <table className='table table-sm table-bordered mb-2'>
                    <thead>
                        <tr>
                            <th>Access Code</th>
                            <th>Access</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{access_id}</td>
                            <td>{access_title}</td>
                        </tr>
                    </tbody>
                </table>
                <label className='mb-0 font-weight-bold'>Search Employees</label>
                <input type='search' name='search_employees' placeholder='Search keywords...' className='form-control' onChange={searchEmployee} defaultValue={keyword?keyword:''} />
                <p className='mb-0' id="message"></p>
                {
                    <table className='table table-sm mt-2'>
                        <tbody>
                            {
                                empArr.filter(val => !arr.map(value => value.emp_id).includes(val.emp_id)).map(
                                    ({emp_id, emp_image, name, designation_name}, i) => {
                                        return (
                                            <tr key={i}>
                                                <td>
                                                    <div className="d-flex align-items-center justify-content-between">
                                                        <div className="d-flex align-items-center justify-content-start">
                                                            <img src={`${process.env.REACT_APP_SERVER}/client/images/employees/${emp_image}`} width="40" height="40" className="rounded-circle" alt="employee" />
                                                            <div className="pl-2">
                                                                <p className="mb-0 font-weight-bold">{name}</p>
                                                                <p className="mb-0">{designation_name}</p>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <input onChange={(e) => onCheckboxChange(e, emp_id, emp_image, name, designation_name)} type='checkbox' className='form-control' defaultChecked={arr.includes(emp_id)} />
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    }
                                )
                            }
                        </tbody>
                        <tfoot>
                            {
                                arr.map(
                                    ({emp_id, emp_image, name, designation_name}, i) => {
                                        return (
                                            <tr key={i}>
                                                <td>
                                                    <div className="d-flex align-items-center justify-content-between">
                                                        <div className="d-flex align-items-center justify-content-start">
                                                            <img src={`${process.env.REACT_APP_SERVER}/client/images/employees/${emp_image}`} width="40" height="40" className="rounded-circle" alt="employee" />
                                                            <div className="pl-2">
                                                                <p className="mb-0 font-weight-bold">{name}</p>
                                                                <p className="mb-0">{designation_name}</p>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <input onChange={(e) => onCheckboxChange(e, emp_id, emp_image, name, designation_name)} type='checkbox' className='form-control' defaultChecked={true} />
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    }
                                )
                            }
                        </tfoot>
                    </table>
                }
                <button id="assignBtn" className='btn cancle d-none ml-auto' onClick={() => assignAccess(access_id)}>Assign</button>
            </>
        )
    }
    const onCheckboxChange = (e, emp_id, emp_image, name, designation_name) => {
        const { checked } = e.target;
        if (checked) {
            setAssignAccessToEmployees((prevState) => [...prevState, {emp_id: emp_id, emp_image: emp_image, name: name, designation_name: designation_name}]);
        }else {
            const arr = JSON.parse($('#stringify_assignedAccessEmployees').text());
            const newArr = arr.filter(val => val.emp_id !== emp_id);
            setAssignAccessToEmployees(newArr);
        }
    }
    const assignAccess = (access_id) => {
        const employees = JSON.parse($('#stringify_assignedAccessEmployees').text());
        if (employees.length === 0) {
            JSAlert.alert(`No employee selected`, "Validation Error", JSAlert.Icons.Warning).dismissIn(4000);
            return false;
        }
        $('#assignBtn').prop('disabled', true);
        axios.post('/access/assign/employees', {employees:JSON.stringify(employees), access_id: access_id}).then(() => {
            setModalData();
            setAssignAccessToEmployees([]);
            JSAlert.alert(`Access has been assigned.`, "Success", JSAlert.Icons.Success).dismissIn(2000);
        } ).catch( err => {
            $('#assignBtn').prop('disabled', false);
            console.log(err);
            JSAlert.alert(`Something went wrong. ${err}`, "Failed To Fetch", JSAlert.Icons.Failed);
        } );
    }
    const changeModuleName = (e, module) => {
        clearTimeout(moduleChangeTimeout);
        const name = e.target.textContent;
        moduleChangeTimeout = setTimeout(() => {
            if (name.trim().length === 0) {
                $('#' + module.split(' ').join('_')).text(module).css('font-weight', 'bold');
            }else {
                axios.post('/access/module/name/update', {module: module, name: name}).then(() => {
                    console.log(`${module} name has been updated successfully.`);
                    toast.dark(`Module name has been updated successfully.`, { position: 'top-right', autoClose: 5000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true});
                    let arr = modulesList.slice();
                    let accessArr = accessList.slice();
                    const index = arr.indexOf(module);
                    arr[index] = name;
                    for (let x = 0; x < accessArr.length; x++) {
                        if (accessArr[x].module === module) {
                            accessArr[x].module = name;
                        }
                    }
                    setModulesList(arr);
                    setAccessList(accessArr);
                }).catch( err => {
                    $('#' + module.split(' ').join('_')).text(module).css('font-weight', 'bold');
                    console.log(err);
                    JSAlert.alert(`${err}. Could not change the module name.`, "Failed To Update", JSAlert.Icons.Failed);
                } );
            }
        }, 1000);
    }
    const searchEmployees = (e) => {
        const keyword = e.target.value;
        let timeout;
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            axios.post('/employees/search/keyword', {keyword:keyword}).then(response => {
                setEmployeesList(response.data);
            } ).catch( err => {
                console.log(err);
                JSAlert.alert(`Something went wrong. ${err}`, "Failed To Fetch", JSAlert.Icons.Failed);
            } );
        }, 1000);
    }
    const revokeAccess = (access) => {
        const { access_id, access_title } = access;
        const { emp_id, name } = selectedEmployee;
        setModalData(
            <>
                <h5 className='mb-0'>Revoke Access</h5>
                <hr />
                <h6>Do you want to revoke ({access_title}) access from {name}?</h6>
                <button id="revokeBtn" className='btn cancle d-block ml-auto mt-3' onClick={() => confirmRevoke(access_id, emp_id)}>Confirm</button>
            </>
        )
    }
    const confirmRevoke = (access_id, emp_id) => {
        $('#revokeBtn').prop('disabled', true);
        let list = empAccess.slice();
        list = list.filter(access => access !== access_id);
        axios.post('/access/employee/revoke', {list: list, emp_id: emp_id}).then(() => {
            setModalData();
            setEmpAccess(list);
            JSAlert.alert(`Access has been revoked.`, "Success", JSAlert.Icons.Success).dismissIn(2000);
        } ).catch( err => {
            console.log(err);
            $('#revokeBtn').prop('disabled', false);
            JSAlert.alert(`Something went wrong. ${err}`, "Failed To Fetch", JSAlert.Icons.Failed);
        } );
    }

    return (
        <div className='page access_management_page'>
            <ToastContainer />
            {modalData?<Modal show={true} Hide={() => setModalData()} content={modalData} />:null}
            <div className='page-content'>
                <div className="d-flex align-items-center justify-content-between">
                    <h3 className="heading">
                        Access Management
                        <sub>Manage All Access Overhear</sub>
                    </h3>
                    <div className='d-flex'>
                        <div className='search_div'>
                            <input id="searchEmpInput" type='search' className='form-control' placeholder='Search employees...' onChange={searchEmployees} />
                            {
                                employeesList
                                ?
                                <div className='search_results'>
                                    {
                                        employeesList.length === 0
                                        ?
                                        <p className='mb-0 p-2 font-weight-bold'>No Record Found</p>
                                        :
                                        employeesList.map(
                                            (val, i) => {
                                                const {emp_image, name, designation_name} = val;
                                                return (
                                                    <div key={i} onClick={() => setSelectedEmployee(val)} className="d-flex align-items-center justify-content-start mb-2 pointer pointer-hover p-1">
                                                        <img src={`${process.env.REACT_APP_SERVER}/client/images/employees/${emp_image}`} width="40" height="40" className="rounded-circle" alt="employee" />
                                                        <div className="pl-2">
                                                            <p className="mb-0 font-weight-bold">{name}</p>
                                                            <p className="mb-0">{designation_name}</p>
                                                        </div>
                                                    </div>
                                                )
                                            }
                                        )
                                    }
                                </div>
                                :null
                            }
                        </div>
                        <button className='btn submit ml-2' onClick={() => createAccess()} style={{whiteSpace: 'nowrap'}}>New Access</button>
                    </div>
                </div>
                <hr />
                {
                    selectedEmployee
                    ?
                    <table className='table table-bordered'>
                        <tbody>
                            <tr>
                                <td>
                                    <div className="d-flex align-items-center justify-content-between">
                                        <div className="d-flex align-items-center justify-content-start pointer pointer-hover p-1">
                                            <img src={`${process.env.REACT_APP_SERVER}/client/images/employees/${selectedEmployee.emp_image}`} width="40" height="40" className="rounded-circle" alt="employee" />
                                            <div className="pl-2">
                                                <p className="mb-0 font-weight-bold">{selectedEmployee.name}</p>
                                                <p className="mb-0">{selectedEmployee.designation_name}</p>
                                            </div>
                                        </div>
                                        <div className='d-flex align-items-end'>
                                            <Menu menuButton={<button className='btn light'>Granted Access List</button>}>
                                                {
                                                    accessList.filter(val => empAccess.map(access => access).includes(val.access_id)).length === 0
                                                    ?
                                                    <MenuItem>No Access Granted</MenuItem>
                                                    :
                                                    accessList.filter(val => empAccess.map(access => access).includes(val.access_id)).map(
                                                        ({access_id, access_title}, i) => {
                                                            return <MenuItem key={i}>({access_id}) {access_title}</MenuItem>
                                                        }
                                                    )
                                                }
                                            </Menu>
                                            <button className='btn light p-2 ml-4' onClick={() => setSelectedEmployee()}>
                                                <i className="las la-times la-2x"></i>
                                            </button>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    :null
                }
                <div id="stringify_assignedAccessEmployees" className='d-none'>{JSON.stringify(assignedAccessEmployees)}</div>
                <>
                    {
                        !accessList
                        ?
                        <h6 className='text-center mb-0'><b>Loading Access...</b></h6>
                        :
                        accessList.length === 0
                        ?
                        <h6 className='text-center mb-0'><b>No Access Found</b></h6>
                        :
                        modulesList.map(
                            (module, i) => {
                                return (
                                    <>
                                        <ReactTooltip place="top" />
                                        <h4 className='text-capitalize' id={module.split(' ').join('_')} contentEditable onInput={(e) => changeModuleName(e, module)}><b>{module}</b></h4>
                                        <table className='table table-bordered' key={i}>
                                            <colgroup>
                                                <col span="1" style={{width: '5%'}} />
                                                <col span="1" style={{width: '10%'}} />
                                                <col span="1" style={{width: '20%'}} />
                                                <col span="1" style={{width: '40%'}} />
                                                <col span="1" style={{width: '25%'}} />
                                            </colgroup>
                                            <thead>
                                                <tr>
                                                    <th className='border-top-0'>Sr.No</th>
                                                    <th className='border-top-0'>Access Code</th>
                                                    <th className='border-top-0'>Access</th>
                                                    <th className='border-top-0' colSpan={2}>Description</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    accessList.filter(val => val.module === module).map(
                                                        (val, ii) => {
                                                            const {access_id, access_title, access_description, module} = val;
                                                            return (
                                                                <tr key={ii}>
                                                                    <td>{ii+1}</td>
                                                                    <td>{access_id}</td>
                                                                    <td>{access_title}</td>
                                                                    <td>{access_description}</td>
                                                                    <td>
                                                                        <div className='w-50 mx-auto'>
                                                                            <i onClick={() => editAccess(access_id, access_title, access_description, module)} style={{fontSize: 19}} data-tip="Edit Access" className="pointer las mx-2 la-edit"></i>
                                                                            <i onClick={() => assignAccessToEmployees(access_id, access_title)} style={{fontSize: 19}} data-tip="Assign To Employee" className="pointer las mx-2 la-user-shield"></i>
                                                                            {
                                                                                empAccess.includes(access_id)
                                                                                ?
                                                                                <>
                                                                                    <ReactTooltip place="top" />
                                                                                    <i onClick={() => revokeAccess(val)} style={{fontSize: 19}} data-tip="Revoke Access" className="pointer text-danger las mx-2 la-external-link-alt"></i>
                                                                                </>
                                                                                :null
                                                                            }
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            )
                                                        }
                                                    )
                                                }
                                            </tbody>
                                        </table>
                                    </>
                                )
                            }
                        )
                    }
                </>
            </div>
        </div>
    )
}

export default AccessManagement;