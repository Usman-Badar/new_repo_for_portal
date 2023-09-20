import React, { useEffect, useState } from 'react';

import './Devices.css';
import axios from '../../../../../../axios';


import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Devices = () => {

    const [ Devices, setDevices ] = useState([{},{},{},{}]);

    useEffect(
        () => {

            axios.get('/getallattdevices').then( response => {

                setDevices(response.data);

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
    )

    return (
        <>
            <div className="Devices d-center">
                <div className="Devices-content">
                    
                    {/* Devices Header */}
                    <div className="text-center mb-3 emp_heading">
                        <h3 className="text-uppercase formName mb-1">Attendance Devices</h3>
                        <p>Attendance Devices for all seaboard companies</p>
                    </div>

                    <div className="d-flex justify-content-start w-100 allDevices">
                        <div className="SrNo text-center">
                            <b>Sr.NO</b>
                        </div>
                        <div className="DevName">
                            <b>Device Name</b>
                        </div>
                        <div className="DevLocation">
                            <b>Location</b>
                        </div>
                        <div className="DevIP">
                            <b>Device Code</b>
                        </div>
                    </div>
                    
                    {
                        Devices.map(
                            ( val, index ) => {
                                return (
                                    <div className="d-flex justify-content-start w-100 allDevices pb-3">
                                        <div className="SrNo text-center">
                                            <div> { index + 1 } </div>
                                        </div>
                                        <div className="DevName">
                                            <div> { val.device_name } </div>
                                        </div>
                                        <div className="DevLocation">
                                            <div> { val.location_name } </div>
                                        </div>
                                        <div className="DevIP">
                                            <div> { val.device_code } </div>
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

export default Devices;