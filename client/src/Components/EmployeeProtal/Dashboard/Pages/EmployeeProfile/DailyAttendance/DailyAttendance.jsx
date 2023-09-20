import React, { useEffect, useState } from 'react';
import TodayAttendance from '../Components/TodayAttendance/TodayAttendance';

import './DailyAttendance.css';
import axios from '../../../../../../axios';


import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const DailyAttendance = () => {

    const ref = React.createRef();

    const [ Attendance, setAttendance ] = useState([]);
    const [ AttendanceInOuts, setAttendanceInOuts ] = useState([]);

    useEffect(
        () => {

            const Data = new FormData();
            Data.append('empID', localStorage.getItem('EmpID'));
            axios.post( '/getempattdetails', Data ).then( response => {

                setAttendance( response.data );
                axios.post( '/getempinoutsdetails', Data ).then( response => {

                    setAttendanceInOuts( response.data );
                    

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
            <div className="DailyAttendance">
                <div className="attendance">
                    <h3 className="mb-4">Daily Attendance</h3>
                    <div className="attendance-content">
                        {
                            Attendance.length === 0
                                ?
                                <h3 className="w-100 text-center">No Record Found</h3>
                                :
                                <table className="table" id="table-to-xls" ref={ ref }>
                                    <thead>
                                        <tr>
                                            <th>Date</th>
                                            <th>Time In</th>
                                            <th>Time Out</th>
                                            <th>Break In</th>
                                            <th>Break Out</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            Attendance.map(
                                                (val, index) => {

                                                    return (
                                                        <>
                                                            <tr key={index}>
                                                                <td> {val.emp_date.toString().substring(0, 10)} </td>
                                                                <td> {val.time_in === null ? <span>No Time In</span> : val.time_in} </td>
                                                                <td> {val.time_out === null ? <span>No Time Out</span> : val.time_out} </td>
                                                                <td> {val.break_in === null ? <span>No Break In</span> : val.break_in} </td>
                                                                <td> {val.break_out === null ? <span>No Break Out</span> : val.break_out} </td>
                                                            </tr>
                                                        </>
                                                    )

                                                }
                                            )
                                        }
                                    </tbody>
                                </table>
                        }
                    </div>
                </div>
                <div>
                    <TodayAttendance btnTxt="View Your Profile" btnHref="/empprofile" />
                </div>
            </div>
        </>
    )

}

export default DailyAttendance;