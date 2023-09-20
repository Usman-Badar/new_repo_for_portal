import React, { useEffect, useState } from 'react';

import './Designations.css';

import axios from '../../../../../axios';
import $ from 'jquery';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Designations = () => {

    const [ Designations, setDesignations ] = useState([]);
    const [ Designation, setDesignation ] = useState(
        {
            department_code: '', designation_name: '', designation_code: ''
        }
    );
    const [ AddDesignation, setAddDesignation ] = useState(
        {
            Designation: ''
        }
    )

    useEffect(
        () => {

            GetAllDesignations();

        }, []
    );

    const GetAllDesignations = () => {

        const Data = new FormData();
        Data.append('departID', window.location.href.split('/').pop());
        axios.post('/getdesignations', Data).then( response => {

            setDesignations( response.data );

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

    // Function onchange which is called to store data into usestate()
    const onChangeHandler = ( e ) => {

        const { name, value } = e.target;
        const setVal = {
            ...AddDesignation,
            [name]: value
        }
        setAddDesignation( setVal );

    }

    const OnEdit = ( id, indexx ) => {

        let designation = Designations.filter(
            (val, index, arr) => {
                return index === indexx;
            }
        );

        const setValues = {
            ...Designation,
            designation_name: designation[0].designation_name,
            designation_code: id,
            department_code: designation[0].department_code
        }

        setDesignation(setValues);
        $('.editModalBtn').trigger('click');

    }

    const AddDesignations = ( e ) => {

        e.preventDefault();

        const Data = new FormData();
        Data.append('designation', AddDesignation.Designation);
        Data.append('departID', window.location.href.split('/').pop());

        axios.post('/adddesignation', Data).then( () => {

            GetAllDesignations();

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

    }

    return (
        <>
            <div className="Admin_Designations d-center">

                <div className="Admin_Designations-content">
                    <h3>Add New Designations</h3>

                    <form className="addDesignations btn-group" onSubmit={ AddDesignations }>
                        <input type="text" onChange={ onChangeHandler } className="form-control" placeholder="Designation Name" name="Designation" required />
                        <button className="btn" type="submit">Add Designation</button>
                    </form>

                    <h3>All Designations</h3>
                    <div className="designations">
                        {
                            Designations.length === 0
                                ?
                                <h3 className="text-center mb-0">No Designation Found</h3>
                                :
                                Designations.map(
                                    (val, index) => {
                                        return (
                                            <div className="d-flex align-items-center border-bottom mb-2" key={index}>
                                                <div className="index"> { index + 1 } </div>
                                                <div>
                                                    <span style={{ 'color': 'rgb(128, 128, 128, .5)' }}>Designation Name</span>
                                                    <h5> { val.designation_name } </h5>
                                                </div>
                                                <div className="ml-auto d-flex align-items-center operations">
                                                    <div className="px-3">
                                                        <button className="btn" onClick={ () => OnEdit( val.designation_code, index ) } style={{ 'backgroundColor': '#1EC916' }}><i className="las la-edit"></i> Edit</button>
                                                    </div>
                                                    <div className="px-3">
                                                        <button className="btn" onClick={ () => OnEdit( val.designation_code, index ) } style={{ 'backgroundColor': '#FEC400' }}><i className="las la-trash"></i> Remove</button>
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
                                <input type="text" value={Designation.designation_name} className="form-control mb-3" placeholder="Category Name" name="editCtgryName" onChange={ onChangeHandler } pattern="[a-zA-Z][a-zA-Z\s]*" minLength="3" required />
                                <button data-dismiss="modal" className="btn d-block ml-auto">Update Department</button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </>
    )

}

export default Designations;