import React, { useEffect, useState } from 'react';

import './Locations.css';

import axios from '../../../../axios';
import $ from 'jquery';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Link } from 'react-router-dom';

const Locations = () => {

    const [ Locations, setLocations ] = useState([]);
    const [ EditMode, setEditMode ] = useState(false);
    const [ Location, setLocation ] = useState(
        {
            location_code: '', location_name: '', attendance_mode: ''
        }
    );
    const [ LocationMap, setLocationMap ]= useState('');

    const [ AddLocation, setAddLocation ] = useState(
        {
            location_name: '',
            address: '',
            location_phone: '',
            map: '',
            attendance_mode: ''
        }
    )

    useEffect(
        () => {

            GetAllLocations();
            $('.UpdateLocation').hide(0);

        }, []
    );

    const GetAllLocations = () => {

        axios.get('/getalllocations').then( response => {

            setLocations( response.data );
            setLocationMap( response.data[0].map );

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
            ...AddLocation,
            [name]: value
        }
        setAddLocation( setVal );

    }

    const AddLocations = ( e ) => {

        e.preventDefault();

        const Data = new FormData();
        Data.append('location_name', AddLocation.location_name);
        Data.append('address', AddLocation.address);
        Data.append('location_phone', AddLocation.location_phone);
        Data.append('map', AddLocation.map);
        Data.append('attendance_mode', AddLocation.attendance_mode);
        Data.append('location_code', AddLocation.location_code ? AddLocation.location_code : 0);
        if ( EditMode === false )
        {
    
            axios.post('/addlocation', Data).then( () => {
    
                GetAllLocations();
    
                toast.dark('Location has been added successfully' , {
                    position: 'top-right',
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });;
    
    
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

            
        }else
        {

            axios.post('/updatelocation', Data).then( () => {
    
                GetAllLocations();
    
                toast.dark('Location has been Updated successfully' , {
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
        
        setAddLocation(
            {
                location_code: '',
                location_name: '',
                address: '',
                location_phone: '',
                map: '',
                attendance_mode: ''
            }
        );
        setEditMode( false );

    }

    const OnEdit = ( indexx ) => {

        let location = Locations.filter(
            (val, index, arr) => {
                return index === indexx;
            }
        );

        setAddLocation(
            {
                location_code: location[0].location_code,
                location_name: location[0].location_name,
                address: location[0].address,
                location_phone: location[0].location_phone,
                map: location[0].map,
                attendance_mode: location[0].attendance_mode
            }
        );

        $('.AddLocation').hide();
        $('.UpdateLocation').show();

        setEditMode( true );

    }

    const OnDelete = (id) => {

        const Data = new FormData();
        Data.append('location_code', id);
        axios.post('/deletelocation', Data).then( () => {

            GetAllLocations();

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

    const ShowMap = ( index )=> {

        setLocationMap( Locations[index].map );

    }
    

    return (
        <>
            <ToastContainer />
            <div className="Admin_Locations d-center">

                <div className="Admin_Locations-content">
                    <h3>Add New Location</h3>

                    <form className="addLocations" onSubmit={AddLocations}>
                        <div className='addLocationsGrid mb-2'>
                            <div><input onChange={onChangeHandler} value={AddLocation.location_name} type="text" className="form-control" placeholder="Location Name" name="location_name" required /></div>
                            <div><input onChange={onChangeHandler} value={AddLocation.address} type="text" className="form-control" placeholder="Location Address" name="address" required /></div>
                            <div className='d-flex justify-content-end'><button className="AddLocation btn" type="submit">Add Location</button></div>
                        </div>
                        <div className='addLocationsGrid mb-2'>
                            <div><input onChange={onChangeHandler} value={AddLocation.location_phone} type="text" className="form-control" placeholder="Location Number" name="location_phone" required /></div>
                            <div><select onChange={onChangeHandler} type="text" className="form-control" placeholder="Attandence Mode" name="attendance_mode" required >
                                <option value="tablet">tablet</option>
                                <option value="machine">machine</option>
                            </select>
                            </div>
                            {/* <div className='d-flex justify-content-end'><button className="btn" type="submit">Add Location</button></div> */}
                        </div>
                        <div className='addLocationsGrid1'>
                            <div><input onChange={onChangeHandler} value={AddLocation.map} type="text" className="form-control" placeholder="Map Pin" name="map" required /></div>
                            <div className='d-flex justify-content-end'><button className="UpdateLocation btn" type="submit">Update Location</button></div>
                        </div>
                    </form>

                    <h3>All Locations</h3>
                    <div className="locations">
                        <div className='d-flex border mb-4'>
                            <input type="search" className='form-control' />
                            <button className='btn' style={{ backgroundColor: 'rgb(238, 238, 238)', borderRadius: "0"}}><i class="las la-search"></i></button>
                        </div>
                        <div className='LocationGrid'>
                            <div>
                                {
                                    Locations.length === 0
                                        ?
                                        <h3 className="text-center mb-0">No Location Found</h3>
                                        :
                                        Locations.map(
                                            (val, index) => {
                                                return (
                                                    <div className='LocationDetails' key={index} onClick={() => ShowMap(index)}>
                                                        <div className="index"> {index + 1} </div>
                                                        <div>
                                                            <h5 > {val.location_name} </h5>
                                                            <p>{val.address}</p>
                                                            <div className='LocationPhone'>
                                                                <div><p>{val.location_phone} </p></div>
                                                                <div><p style={{ 'color': 'rgb(128, 128, 128, .5)', fontSize: '12px' }}>Attendance Mode</p><p> {val.attendance_mode} </p></div>
                                                            </div>
                                                        </div>
                                                        <div className="operations">
                                                            <Link to="/admin_locations/:id&&find=sublocation">
                                                                <div className="px-1">
                                                                    <div className='SublocationDiv' style={{ 'backgroundColor': '#1EC916' }}> <p>Sub Locations</p> </div>
                                                                </div>
                                                            </Link>
                                                            <div className="px-1">
                                                                <div className='EdditDiv' onClick={() => OnEdit(index)} style={{ 'backgroundColor': '#1EC916' }}><i className="las la-edit"></i></div>
                                                            </div>
                                                            <div className="px-1">
                                                                <div className="DeleteDiv" onClick={() => OnDelete(val.location_code)} style={{ 'backgroundColor': '#FEC400' }}><i className="las la-trash"></i></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            }
                                        )
                                }
                            </div>
                            <div className='LocationMap'>
                                <iframe
                                    src={ LocationMap } //"https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3621.4444412597113!2d67.01329841538036!3d24.81447025320958!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3eb33dc2ed5cb949%3A0xbb6aa8be49dbc0c2!2sSeaboard%20Group!5e0!3m2!1sen!2s!4v1634722904643!5m2!1sen!2s"
                                    width="100%"
                                    height="100%"
                                    style={{ border: '1px solid lightgray', borderRadius: '10px' }}
                                    allowfullscreen=""
                                    loading="lazy"
                                    className='map'
                                    title="map"
                                ></iframe>
                            </div>
                        </div>
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