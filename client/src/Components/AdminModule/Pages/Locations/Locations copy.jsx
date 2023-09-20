import React, { useEffect, useState } from 'react';

import './Locations.css';

import axios from '../../../../axios';
import $ from 'jquery';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Locations = () => {

    const [ Locations, setLocations ] = useState([]);
    const [ Location, setLocation ] = useState(
        {
            location_code: '', location_name: '', attendance_mode: ''
        }
    );
    const [ AddDepart, setAddDepart ] = useState(
        {
            LocatName: ''
        }
    )

    useEffect(
        () => {

            GetAllLocations();

        }, []
    );

    const GetAllLocations = () => {

        axios.get('/getalllocations').then( response => {

            setLocations( response.data );

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
            ...AddDepart,
            [name]: value
        }
        setAddDepart( setVal );

    }

    const AddLocations = ( e ) => {

        e.preventDefault();

        const Data = new FormData();
        Data.append('depart', AddDepart.DepartName);

        axios.post('/adddepartment', Data).then( () => {

            GetAllLocations();
            $("input[name='DepartName']").val('');

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

    const OnEdit = ( id, indexx ) => {

        let location = Locations.filter(
            (val, index, arr) => {
                return index === indexx;
            }
        );

        const setValues = {
            ...Location,
            location_name: location[0].location_name,
            attendance_mode: location[0].attendance_mode,
            location_code: id
        }

        setLocation(setValues);
        $('.editModalBtn').trigger('click');

    }

    const OnDelete = ( id ) => {

        const Data = new FormData();
        Data.append('departID', id);
        axios.post('/deletedepartmentname', Data).then( () => {

            GetAllLocations();

            setLocation(
                {
                    location_code: '', location_name: '', attendance_mode: ''
                }
            );
            toast.dark('Location Deleted', {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });

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
            <ToastContainer />
            <div className="Admin_Locations d-center">

                <div className="Admin_Locations-content">
                    <h3>Add New Location</h3>

                    <form className="addLocations btn-group" onSubmit={ AddLocations }>
                        <input onChange={ onChangeHandler } type="text" className="form-control" placeholder="Location Name" name="LocatName" required />
                        <button className="btn" type="submit">Add Location</button>
                    </form>

                    <h3>All Locations</h3>
                    <div className="locations">
                        {
                            Locations.length === 0
                                ?
                                <h3 className="text-center mb-0">No Location Found</h3>
                                :
                                Locations.map(
                                    (val, index) => {
                                        return (
                                            <div className="d-flex align-items-center border-bottom mb-2" key={index}>
                                                <div className="index"> { index + 1 } </div>
                                                <div>
                                                    <span style={{ 'color': 'rgb(128, 128, 128, .5)' }}>Location Name</span>
                                                    <h5> { val.location_name } </h5>
                                                </div>
                                                <div className="ml-5">
                                                    <span style={{ 'color': 'rgb(128, 128, 128, .5)' }}>Attendance Mode</span>
                                                    <h5> { val.attendance_mode } </h5>
                                                </div>
                                                <div className="ml-auto d-flex align-items-center operations">
                                                    <div className="px-3">
                                                        <button className="btn" onClick={ () => OnEdit( val.location_code, index ) } style={{ 'backgroundColor': '#1EC916' }}><i className="las la-edit"></i> Edit</button>
                                                    </div>
                                                    <div className="px-3">
                                                        <button className="btn" onClick={ () => OnDelete( val.location_code ) } style={{ 'backgroundColor': '#FEC400' }}><i className="las la-trash"></i> Remove</button>
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
                                <input type="text" value={Location.location_name} className="form-control mb-3" placeholder="Location Name" name="editCtgryName" onChange={ onChangeHandler } pattern="[a-zA-Z][a-zA-Z\s]*" minLength="3" required />
                                <input type="text" value={Location.attendance_mode} className="form-control mb-3" placeholder="Attendance Mode" name="editCtgryName" onChange={ onChangeHandler } pattern="[a-zA-Z][a-zA-Z\s]*" minLength="3" required />
                                <button data-dismiss="modal" className="btn d-block ml-auto">Update Location</button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </>
    )

}

export default Locations;