import React, { useEffect, useState } from "react";
import './New_Employee_Att.css';

import moment from "moment";
import axios from '../../../../../../axios';
import $ from 'jquery';


import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const New_Employee_Att = () => {

    const ref = React.createRef();

    const [Attendance, setAttendance] = useState([]);
    const [AttendanceInOuts, setAttendanceInOuts] = useState([]);

    useEffect(
        () => {

            const Data = new FormData();
            Data.append('empID', localStorage.getItem('EmpID'));
            axios.post('/getempattdetails', Data).then(response => {

                setAttendance([ response.data[0] ]);
                axios.post('/getempinoutsdetails', Data).then(response => {

                    setAttendanceInOuts(response.data);


                }).catch(err => {

                    toast.dark(err, {
                        position: 'top-right',
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });;

                });

            }).catch(err => {

                toast.dark(err, {
                    position: 'top-right',
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });;

            });


        }, []
    )

    return (
        <>
            <div className="New_Employee_Att">
                <div className="New_Employee_Att_Div">
                    <div className="Emp_Att_Grid ">
                        <div><p className="font-weight-bolder">Date</p></div>
                        <div><p className="font-weight-bolder">Check In</p></div>
                        <div></div>
                        <div><p className="font-weight-bolder">Check out</p></div>
                        <div><p className="font-weight-bolder">Total Hours</p></div>
                    </div>
                    <div className="Emp_Att_Grid1" style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px", marginBottom: "20px" }}>
                        <div><p className="font-weight-bolder">Day/Date</p></div>
                        <div><p className="font-weight-bolder">Check In</p></div>
                        <div><p className="font-weight-bolder">Check out</p></div>
                        <div><p className="font-weight-bolder">Total Hours</p></div>
                    </div>
                    {
                        Attendance.length === 0
                            ?
                            null
                            :
                            Attendance.map( // array [{},{},{}] .shift()
                                (val, index) => {

                                    const d = new Date();

                                    // var startTime1 = moment(val.time_in === null ? '00:00:00' : val.time_in, "HH:mm:ss");
                                    // var breakinTime1 = moment(val.break_in === null && val.time_out === null ? d.toLocaleDateString() : val.break_in === null && val.time_out !== null ? '00:00:00' : val.break_in, "HH:mm:ss");
                                    // var duration1 = moment.duration(breakinTime1.diff(startTime1));
                                    // var hours1 = parseInt(duration1.asHours());
                                    // var minutes1 = parseInt(duration1.asMinutes()) - hours1 * 60;

                                    // let a = parseInt(duration1.asMinutes()) / 240 * 100

                                    // var breakinTime2 = moment(val.break_in === null ? '00:00:00' : val.break_in, "HH:mm:ss");
                                    // var breakoutTime2 = moment(val.break_out === null ? d.toLocaleDateString() : val.break_out, "HH:mm:ss");
                                    // var duration2 = moment.duration(breakoutTime2.diff(breakinTime2));
                                    // var hours2 = parseInt(duration2.asHours());
                                    // var minutes2 = parseInt(duration2.asMinutes()) - hours2 * 60;

                                    // let b = parseInt(duration2.asMinutes()) / 60 * 100;

                                    // var breakoutTime3 = moment(val.break_out === null ? '00:00:00' : val.break_out, "HH:mm:ss");
                                    // var endTime3 = moment(val.time_out === null ? d.toLocaleDateString() : val.time_out, "HH:mm:ss");
                                    // var duration3 = moment.duration(endTime3.diff(breakoutTime3));
                                    // var hours3 = parseInt(duration3.asHours());
                                    // var minutes3 = parseInt(duration3.asMinutes()) - hours3 * 60;

                                    // let c = parseInt(duration3.asMinutes()) / 180 * 100

                                    // var startTime4 = moment(val.time_in === null ? '00:00:00' : val.time_in, "HH:mm:ss");
                                    // var endTime4 = moment(val.time_out === null ? d.toLocaleDateString() : val.time_out, "HH:mm:ss");
                                    // var duration4 = moment.duration(endTime4.diff(startTime4));
                                    // var hours4 = parseInt(duration4.asHours());
                                    // var minutes4 = parseInt(duration4.asMinutes()) - hours4 * 60;


                                    // time_in
                                    // break_in
                                    // break_out
                                    // time_out


                                    var startTime1 = null;
                                    var breakinTime1 = null;
                                    var duration1 = null;
                                    var hours1 = null;
                                    var minutes1 = null;

                                    if (val.break_in === null) {

                                        startTime1 = moment(val.time_in, "HH:mm:ss");
                                        breakinTime1 = moment(d.toTimeString(), "HH:mm:ss");
                                        duration1 = moment.duration(breakinTime1.diff(startTime1));
                                        hours1 = parseInt(duration1.asHours());
                                        minutes1 = parseInt(duration1.asMinutes()) - hours1 * 60;

                                    } else {

                                        startTime1 = moment(val.time_in, "HH:mm:ss");
                                        breakinTime1 = moment(val.break_in, "HH:mm:ss");
                                        duration1 = moment.duration(breakinTime1.diff(startTime1));
                                        hours1 = parseInt(duration1.asHours());
                                        minutes1 = parseInt(duration1.asMinutes()) - hours1 * 60;

                                    }

                                    let a = parseInt(duration1.asMinutes()) / 240 * 100

                                    var breakinTime2 = null;
                                    var breakoutTime2 = null;
                                    var duration2 = null;
                                    var hours2 = null;
                                    var minutes2 = null;

                                    if (val.break_out === null) {

                                        breakinTime2 = moment(val.break_in, "HH:mm:ss");
                                        breakoutTime2 = moment(d.toTimeString(), "HH:mm:ss");
                                        duration2 = moment.duration(breakoutTime2.diff(breakinTime2));
                                        hours2 = parseInt(duration2.asHours());
                                        minutes2 = parseInt(duration2.asMinutes()) - hours2 * 60;

                                    } else {

                                        breakinTime2 = moment(val.break_in, "HH:mm:ss");
                                        breakoutTime2 = moment(val.break_out, "HH:mm:ss");
                                        duration2 = moment.duration(breakoutTime2.diff(breakinTime2));
                                        hours2 = parseInt(duration2.asHours());
                                        minutes2 = parseInt(duration2.asMinutes()) - hours2 * 60;

                                    }

                                    let b = null;
                                    if (Number.isNaN(duration2.asMinutes()) || duration2.asMinutes() === null) {
                                        b = 0 / 60 * 100;
                                    } else {
                                        b = parseInt(duration2.asMinutes()) / 60 * 100;
                                    }


                                    var breakoutTime3 = null;
                                    var endTime3 = null;
                                    var duration3 = null;
                                    var hours3 = null;
                                    var minutes3 = null;

                                    if (val.time_out === null) {

                                        breakoutTime3 = moment(val.break_out, "HH:mm:ss");
                                        endTime3 = moment(d.toTimeString(), "HH:mm:ss");
                                        duration3 = moment.duration(endTime3.diff(breakoutTime3));
                                        hours3 = parseInt(duration3.asHours());
                                        minutes3 = parseInt(duration3.asMinutes()) - hours3 * 60;

                                    } else {

                                        breakoutTime3 = moment(val.break_out, "HH:mm:ss");
                                        endTime3 = moment(val.time_out, "HH:mm:ss");
                                        duration3 = moment.duration(endTime3.diff(breakoutTime3));
                                        hours3 = parseInt(duration3.asHours());
                                        minutes3 = parseInt(duration3.asMinutes()) - hours3 * 60;

                                    }

                                    let c = null;
                                    if (Number.isNaN(duration3.asMinutes()) || duration3.asMinutes() === null) {
                                        c = 0 / 180 * 100;
                                    } else {
                                        c = parseInt(duration3.asMinutes()) / 180 * 100;
                                    }


                                    var startTime4 = null;
                                    var endTime4 = null;
                                    var duration4 = null;
                                    var hours4 = null;
                                    var minutes4 = null;

                                    if (val.time_out === null) {

                                        startTime4 = moment(val.time_in, "HH:mm:ss");
                                        endTime4 = moment(d.toTimeString(), "HH:mm:ss");
                                        duration4 = moment.duration(endTime4.diff(startTime4));
                                        hours4 = parseInt(duration4.asHours());
                                        minutes4 = parseInt(duration4.asMinutes()) - hours4 * 60;

                                    } else {

                                        startTime4 = moment(val.time_in, "HH:mm:ss");
                                        endTime4 = moment(val.time_out, "HH:mm:ss");
                                        duration4 = moment.duration(endTime4.diff(startTime4));
                                        hours4 = parseInt(duration4.asHours());
                                        minutes4 = parseInt(duration4.asMinutes()) - hours4 * 60;
                                    }

                                    let day = moment(val.emp_date).format('ddd');
                                    // let month = moment(val.emp_date).format('mmm');
                                    // let year = moment(val.emp_date).format('yyy');
                                    // var check = moment(d.entry.date_entered, 'YYYY/MM/DD');

                                    // var month = check.format('M');
                                    // var year = check.format('YYYY');



                                    return (
                                        <>
                                            <div className="Show_Emp_Att_Grid">
                                                <div className="Emp_Att_Grid" key={index}>
                                                    <div><p>{day + " " + moment(val.emp_date).format("Do MMM YYYY")}</p></div>
                                                    <div><p>{val.time_in === null ? 'No time in' : val.time_in}</p></div>
                                                    <div className="d-flex align-items-center w-100">
                                                        {
                                                            val.time_in === null
                                                                ?
                                                                <div className="ProgressBar_Div_Off">
                                                                    <div className="ProgressBar_line">
                                                                        <div className="ProgressBar_Box">{val.status}</div>
                                                                    </div>
                                                                </div>
                                                                :
                                                                <div className="ProgressBar_Div">
                                                                    <div className="ProgressBar1" style={{ cursor: 'pointer', width: a + '%' }}>
                                                                        <div className="tooltip" style={{ left: "calc(50% - 75px)" }}>First Half, {hours1} H {minutes1} M.</div>
                                                                    </div>
                                                                    <div className="ProgressBar2" style={{ cursor: 'pointer', width: b + '%' }} data-tip data-for="progressTip2">
                                                                        <div className="tooltip" style={{ left: "calc(50% - 75px)" }}>Break, {hours2} H {minutes2} M.</div>
                                                                    </div>
                                                                    <div className="ProgressBar3" style={{ cursor: 'pointer', width: c + '%' }} data-tip data-for="progressTip3">
                                                                        <div className="tooltip" style={{ left: "calc(50% - 75px)" }}>Second Half, {hours3} H {minutes3} M.</div>
                                                                    </div>
                                                                </div>
                                                        }
                                                    </div>
                                                    <div><p>{val.time_out === null ? 'No time out' : val.time_out}</p></div>
                                                    <div> <p>{Number.isNaN(hours4) ? '0' : hours4} H {Number.isNaN(minutes4) ? '0' : minutes4} M</p></div>
                                                </div>
                                            </div>
                                            <div className="Show_Emp_Att_Grid1">
                                                <div className="Emp_Att_Grid1" key={index}>
                                                    <div><p>{val.emp_date}</p></div>
                                                    <div><p>{val.time_in === null ? 'No time in' : val.time_in}</p></div>
                                                    <div><p>{val.time_out === null ? 'No time out' : val.time_out}</p></div>
                                                    <div> <p>{Number.isNaN(hours4) ? '0' : hours4} H {Number.isNaN(minutes4) ? '0' : minutes4} M</p></div>
                                                </div>
                                                <div className="d-flex align-items-center w-100">
                                                    {
                                                        val.time_in === '00:00:00' || val.time_in === null
                                                            ?
                                                            <div className="ProgressBar_Div_Off">
                                                                <div className="ProgressBar_line">
                                                                    <div className={"ProgressBar_Box"}>{val.status}</div>
                                                                </div>
                                                            </div>
                                                            :
                                                            <div className="ProgressBar_Div">
                                                                <div className="ProgressBar1" style={{ width: a + '%' }}>
                                                                    <div className="tooltip" style={{ left: "calc(50% - 75px)" }}>First Half, {hours1} H {minutes1} M.</div>
                                                                </div>
                                                                <div className="ProgressBar2" style={{ width: b + '%' }} data-tip data-for="progressTip2">
                                                                    <div className="tooltip" style={{ left: "calc(50% - 75px)" }}>Break, {hours2} H {minutes2} M.</div>
                                                                </div>
                                                                <div className="ProgressBar3" style={{ width: c + '%' }} data-tip data-for="progressTip3">
                                                                    <div className="tooltip" style={{ left: "calc(50% - 75px)" }}>Second Half, {hours3} H {minutes3} M.</div>
                                                                </div>
                                                            </div>
                                                    }

                                                </div>
                                            </div>
                                        </>
                                    )
                                }
                            )
                    }
                </div>
            </div>
        </>
    )
}
export default New_Employee_Att;