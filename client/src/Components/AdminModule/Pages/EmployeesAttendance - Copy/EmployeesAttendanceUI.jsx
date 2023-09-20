import React, { useEffect, useState } from 'react';
import './EmployeesAttendanceUI.css';

import { Line } from 'react-chartjs-2';

const EmployeesAttendanceUI = () => {

    // CHART DATA
    const [ ChartData, setChartData] = useState({});

    useEffect(
        () => {

            

        }, []
    )

    return (
        <>
            <div className="EmployeesAttendanceUI">

                {/* CONTENT */}
                <div className="EmployeesAttendanceUIContent">

                    {/* LEFT */}
                    <div className="Left">

                        {/* GRAPH CONTAINER */}
                        <div className="GraphContainer">

                            {/* GRAPH */}
                            <Line
                                width='100px'
                                height='40px'
                                maintainAspectRatio={ false }
                                data={
                                    {
                                        labels: ['Jun', 'Jul', 'Aug'],
                                        datasets: [
                                            {
                                                id: 1,
                                                label: '',
                                                data: [23, 6, 7],
                                            },
                                            {
                                                id: 2,
                                                label: '',
                                                data: [3, 2, 1],
                                            },
                                            {
                                                id: 3,
                                                label: '',
                                                data: [34, 2, 1],
                                            },
                                        ],
                                    }
                                }
                            />

                        </div>
                        
                    </div>

                    {/* RIGHT */}
                    <div className="Right"></div>

                </div>

            </div>
        </>
    )
}
export default EmployeesAttendanceUI;