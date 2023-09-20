import React, { useEffect, useState } from 'react';

import './Departments.css';

import axios from '../../../../axios';
import { useHistory } from 'react-router-dom';
import $ from 'jquery';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Departments = () => {

    const history = useHistory();

    const [ Departments, setDepartments ] = useState([]);
    const [ Department, setDepartment ] = useState(
        {
            department_code: '', department_name: ''
        }
    );
    const [ AddDepart, setAddDepart ] = useState(
        {
            DepartName: ''
        }
    )

    useEffect(
        () => {

            GetAllDepartments();

        }, []
    );

    const GetAllDepartments = () => {

        axios.get('/getalldepartments').then( response => {

            setDepartments( response.data );

        } ).catch( error => {

            toast.dark(error, {
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

    const ViewDesignation = ( id ) => {

        history.replace( '/admin_departments/admin_designations/' + id );

    }

    // Function onchange which is called to store data into usestate()
    const onChangeHandler = ( e ) => {

        const { name, value } = e.target;
        const setVal = {
            ...AddDepart,
            [name]: value
        }
        setAddDepart( setVal );

    }

    const AddDepartments = ( e ) => {

        e.preventDefault();

        const Data = new FormData();
        Data.append('depart', AddDepart.DepartName);

        axios.post('/adddepartment', Data).then( () => {

            GetAllDepartments();
            $("input[name='DepartName']").val('');

        } ).catch( err => {

            toast.dark(err, {
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

    const OnEdit = ( id, indexx ) => {

        let department = Departments.filter(
            (val, index, arr) => {
                return index === indexx;
            }
        );

        const setValues = {
            ...Department,
            department_name: department[0].department_name,
            department_code: id
        }

        setDepartment(setValues);
        $('.editModalBtn').trigger('click');

    }

    const OnDelete = ( id ) => {

        const Data = new FormData();
        Data.append('departID', id);
        axios.post('/deletedepartmentname', Data).then( () => {

            GetAllDepartments();

            setDepartment(
                {
                    department_code: '', department_name: ''
                }
            );
            toast.dark('Department Deleted', {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });

        } ).catch( err => {

            toast.dark(err, {
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

    return (
        <>
            <ToastContainer />
            <div className="Admin_Departments d-center">

                <div className="Admin_Departments-content">
                    <h3>Add New Departments</h3>

                    <form className="addDepartments btn-group" onSubmit={ AddDepartments }>
                        <input onChange={ onChangeHandler } type="text" className="form-control" placeholder="Department Name" name="DepartName" required />
                        <button className="btn" type="submit">Add Department</button>
                    </form>

                    <h3>All Departments</h3>
                    <div className="departments">
                        {
                            Departments.length === 0
                                ?
                                <h3 className="text-center mb-0">No Department Found</h3>
                                :
                                Departments.map(
                                    (val, index) => {
                                        return (
                                            <div className="d-flex align-items-center border-bottom mb-2" key={index}>
                                                <div className="index"> { index + 1 } </div>
                                                <div>
                                                    <span style={{ 'color': 'rgb(128, 128, 128, .5)' }}>Department Name</span>
                                                    <h5> { val.department_name } </h5>
                                                </div>
                                                <div className="ml-auto d-flex align-items-center operations">
                                                    <div className="px-3">
                                                        <button onClick={ () => ViewDesignation( val.department_code ) } className="btn" style={{ 'backgroundColor': '#1A7DEC' }}><i className="las la-users"></i> Designations</button>
                                                    </div>
                                                    <div className="px-3">
                                                        <button className="btn" onClick={ () => OnEdit( val.department_code, index ) } style={{ 'backgroundColor': '#1EC916' }}><i className="las la-edit"></i> Edit</button>
                                                    </div>
                                                    <div className="px-3">
                                                        <button className="btn" onClick={ () => OnDelete( val.department_code ) } style={{ 'backgroundColor': '#FEC400' }}><i className="las la-trash"></i> Remove</button>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    }
                                )
                        }
                    </div>

                </div>

                <button type="button" className="btn btn-primary d-none editModalBtn" data-toggle="modal" data-target="#departmentModal">
                    Launch demo modal
                </button>
                <div className="modal fade" id="departmentModal" role="dialog" aria-labelledby="departmentModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content">
                            <div className="modal-body">
                                <input type="text" value={Department.department_name} className="form-control mb-3" placeholder="Category Name" name="editCtgryName" onChange={ onChangeHandler } pattern="[a-zA-Z][a-zA-Z\s]*" minLength="3" required />
                                <button data-dismiss="modal" className="btn d-block ml-auto">Update Department</button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </>
    )

}

export default Departments;