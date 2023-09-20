import React, { useState, useEffect } from "react";
import './AttendanceList.css';

import ReactHTMLTableToExcel from 'react-html-table-to-excel';

import axios from '../../../../../../../axios';

const AttendanceList = () => {

    const ref = React.createRef();

    const [ DailyAttendance, setDailyAttendance ] = useState([]);

    useEffect(
        () => {

            const Data = new FormData();
            Data.append('empID', localStorage.getItem('EmpID'));
            axios.post( '/getempattdetails', Data ).then( response => {

                setDailyAttendance( response.data );

            } ).catch( err => {
                
                console.log(err);

            } );

        }, []
    )

    return (
        <>
            <div className="Attendance">
                <h5 className="mb-4 font-weight-bolder">Daily Attendance</h5>
                <div className="attendance-content">
                    {
                        DailyAttendance.length === 0
                            ?
                            <h5 className="text-center font-weight-bolder">No Record Found</h5>
                            :
                            <table className="table" id="table-to-xls" ref={ref}>
                                <thead>
                                    <tr>
                                        <th className="d-none">ID</th>
                                        {/* <th>Name</th> */}
                                        <th>Date</th>
                                        <th className="d-none">Day</th>
                                        <th>Time In</th>
                                        <th>Time Out</th>
                                        <th>Break In</th>
                                        <th>Break Out</th>
                                        <th className="d-none">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        DailyAttendance.map(
                                            (val, index) => {

                                                var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                                                var d = new Date(val.emp_date);
                                                var dayName = days[d.getDay()];

                                                return (
                                                    <tr key={index}>
                                                        <td className="d-none"> {val.emp_id} </td>
                                                        {/* <td> {val.name} </td> */}
                                                        <td> { d.toDateString() } </td>
                                                        <td className="d-none"> {dayName} </td>
                                                        {
                                                            val.status === 'leave' && val.time_in === null && val.time_out === null && val.break_in === null && val.break_out === null
                                                                ?
                                                                <>
                                                                    <td> leave </td>
                                                                    <td> leave </td>
                                                                    <td> leave </td>
                                                                    <td> leave </td>
                                                                </>
                                                                :
                                                                val.status === 'leave' && (val.time_in !== null || val.time_out !== null || val.break_in !== null || val.break_out !== null)
                                                                    ?
                                                                    <>
                                                                        <td> {val.time_in === null ? <span>No Time In</span> : val.time_in} </td>
                                                                        <td> {val.time_out === null ? <span>No Time Out</span> : val.time_out} </td>
                                                                        <td> {val.break_in === null ? <span>No Break In</span> : val.break_in} </td>
                                                                        <td> {val.break_out === null ? <span>No Break Out</span> : val.break_out} </td>
                                                                    </>
                                                                    :
                                                                    <>
                                                                        <td> {val.time_in === null ? <span>No Time In</span> : val.time_in} </td>
                                                                        <td> {val.time_out === null ? <span>No Time Out</span> : val.time_out} </td>
                                                                        <td> {val.break_in === null ? <span>No Break In</span> : val.break_in} </td>
                                                                        <td> {val.break_out === null ? <span>No Break Out</span> : val.break_out} </td>
                                                                    </>
                                                        }
                                                        <td className="d-none">
                                                            {
                                                                val.status === 'leave' && val.time_in === null && val.time_out === null && val.break_in === null && val.break_out === null
                                                                    ?
                                                                    <>
                                                                        {val.status}
                                                                    </>
                                                                    :
                                                                    val.status === 'leave' && (val.time_in !== null || val.time_out !== null || val.break_in !== null || val.break_out !== null)
                                                                        ?
                                                                        <>
                                                                            Short Leave
                                                                        </>
                                                                        :
                                                                        <>
                                                                            {val.status}
                                                                        </>
                                                            }
                                                        </td>
                                                    </tr>
                                                )

                                            }
                                        )
                                    }
                                </tbody>
                            </table>
                    }
                </div>
                <div className="text-right ExportButton">
                    <ReactHTMLTableToExcel
                        id="test-table-xls-button"
                        className="download-table-xls-button btn btn-success ml-2"
                        table="table-to-xls"
                        filename={ localStorage.getItem('EmpID') }
                        sheet={["Employees", "Employees", "Employees", "Employees"]}
                        buttonText="Export in excel"
                    />
                </div>
            </div>
        </>
    )
}
export default AttendanceList;