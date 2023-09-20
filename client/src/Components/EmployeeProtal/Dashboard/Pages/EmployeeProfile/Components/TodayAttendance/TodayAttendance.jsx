import React, { useEffect, useState } from 'react';

import './TodayAttendance.css';
import { Bar, Line, Pie, Radar, PolarArea, Doughnut, Bubble, Scatter } from 'react-chartjs-2';
import { Link } from 'react-router-dom';
import axios from '../../../../../../../axios';


import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TodayAttendance = ( props ) => {

    const [ TodayAttendance, setTodayAttendance ] = useState([]);

    useEffect(
        () => {

            const Data = new FormData();
            Data.append('empID', localStorage.getItem('EmpID'));
            axios.post('/gettodaysattendance', Data).then( res => {

                setTodayAttendance( [ parseInt(res.data[0].time_in.split(':').shift()), parseInt(res.data[0].break_in.split(':').shift()), parseInt(res.data[0].break_out.split(':').shift()), parseInt(res.data[0].time_out.split(':').shift()) ] );

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

            } )

        }, []
    );

    const ChartData = {
        labels: [ 'Time In', 'Take Break', 'Break Out', 'Time Out' ],
        datasets: [
            {
                label: 'Start From',
                data: TodayAttendance,
                backgroundColor: [
                    '#007BFF',
                    '#17A2B8',
                    '#343A40',
                    '#1A2226',
                ]
            }
        ]
    }

    return (
        <>
            <div className="Right text-center p-3 bg-white">
                <h4>Today's Attendance</h4>
                <Bar
                    width='100%'
                    height='100px'
                    data={ChartData}
                />
                <Link to={ props.btnHref } className="btn btn-block btn-dark btn-sm mt-3"> { props.btnTxt } </Link>
            </div>
        </>
    )

}

export default TodayAttendance;