import React, { useEffect, useState } from 'react';
import './EmployeesAttendanceUI.css';

import { Line } from 'react-chartjs-2';
import axios from '../../../../axios';
import moment from 'moment';

const EmployeesAttendanceUI = () => {

    // CHART DATA
    const [ ChartData, setChartData] = useState([]);
    // CHART DATA INVERSE
    const [ ChartDataInverse, setChartDataInverse] = useState([]);
    // CHART DATA VALUES
    const [ ChartDataValues, setChartDataValues] = useState([]);
    // DATA
    const [ Data, setData] = useState(
        {
            TotalExpectedRatings: 0,
            TotalRatings: 0,
            TotalRatingsInPercent: '',
            TotalEmpRatings: 0,
            TotalEmpRatingsInPercent: '',
            EmployeesWhoRated: '',
            EmployeesWhoDoNotRated: '',
        }
    );

    useEffect(
        () => {
            let date_from = new Date(); //moment().format("DD-MM-YYYY");
            let date_to = moment().subtract(7, "days").format("DD-MM-YYYY");
            
            axios.post(
                '/getweeklyattendanceperformance', 
                {
                    date_from: date_from.toString(), 
                    date_to: date_to.toString()
                }
            ).then(
                res => {

                    // IMPORTANT VARIABLES
                    let arr = [];
                    let arr2 = [];
                    let arr3 = [];
                    // let data = [10,20,30,40,50,60,70,80,90,5,4,6,7,78,98,7,5,43,46];
                    let TotalExpectedRatings = 0;
                    let TotalRatings = 0;
                    let TotalEmpRatings = 0;

                    for ( let x = 0; x < res.data.length; x++ )
                    {
                        let d = new Date( res.data[x].emp_date );
                        // let index = Math.floor(Math.random() * data.length);
                        arr.push(
                            d.toDateString().substring(0,10)
                        );
                        arr2.push(
                            res.data[x].total_ratings //data[index]
                        );
                        arr3.push(
                            res.data[x].expected_ratings //data[index]
                        );

                        TotalExpectedRatings = TotalExpectedRatings + res.data[x].expected_ratings;
                        TotalRatings = TotalRatings + res.data[x].total_ratings;
                        TotalEmpRatings = TotalEmpRatings + res.data[x].emp_ratings;
                    }

                    setData(
                        {
                            TotalExpectedRatings: TotalExpectedRatings,
                            TotalRatings: TotalRatings,
                            TotalRatingsInPercent: ( Math.round( ( TotalRatings / TotalExpectedRatings ) * 100 ) ) + '%',
                            TotalEmpRatings: TotalEmpRatings,
                            TotalEmpRatingsInPercent: ( Math.round( ( TotalEmpRatings / TotalRatings ) * 100 ) ) + '%',
                            EmployeesWhoRated: ( Math.round( ( TotalRatings / TotalExpectedRatings ) * 100 ) ) + '%',
                            EmployeesWhoDoNotRated: ( 100 - ( Math.round( ( TotalRatings / TotalExpectedRatings ) * 100 ) ) ) + '%',
                        }
                    )
                    setChartData( arr );
                    setChartDataValues( arr2 );
                    setChartDataInverse( arr3 );

                }
            ).catch( err => console.log( err ) );

        }, []
    )

    const d = new Date();

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
                                        labels: ChartData,
                                        datasets: [
                                            {
                                                id: 2,
                                                label: 'Expected Ratings',
                                                data: ChartDataInverse,
                                            },
                                            {
                                                id: 1,
                                                label: 'Received Ratings',
                                                data: ChartDataValues,
                                                borderColor: '#F14B71'
                                            }
                                        ],
                                    }
                                }
                            />

                        </div>
                        <div className='GraphDecs'>
                            <h5 className='font-weight-bolder'>SHORT SUMMARY</h5>
                            <div className='graphrating pt-3'>
                                <div style={{ position: 'relative' }}>
                                    <p style={{ left: '-35px' }}>Total</p>
                                    <h1>{ Data.TotalExpectedRatings }<sub>ratings expected</sub></h1>
                                </div>
                                {/* <h1>14%<sub>raise</sub></h1> */}
                            </div>
                            <div className='graphprogressbar'>
                                <div className='Bar1'>
                                    <div className='Bar2'>
                                        <div className='Bar3'></div>
                                    </div>
                                </div>
                            </div>
                            <div className='grahgrid'>
                                <div className='graphcirclediv'>
                                    <div className='graphcircle' style={{ backgroundColor: '#B8CAF0' }}></div>
                                </div>
                                <div><p>Total Ratings</p></div>
                                <div className='text-center'> <p>{ Data.TotalRatings }</p> </div>
                                <div className='text-center'><p>{ Data.TotalRatingsInPercent }</p></div>
                            </div>
                            <div className='grahgrid'>
                                <div className='graphcirclediv'>
                                    <div className='graphcircle' style={{ backgroundColor: '#F14B71' }}></div>
                                </div>
                                <div><p>Received Ratings</p></div>
                                <div className='text-center'> <p>{ Data.TotalEmpRatings }</p> </div>
                                <div className='text-center'><p>{ Data.TotalEmpRatingsInPercent }</p></div>
                            </div>
                            {/* <div className='grahgrid'>
                                <div className='graphcirclediv'>
                                    <div className='graphcircle' style={{ backgroundColor: '#423A8E' }}></div>
                                </div>
                                <div><p>Previous Ratings</p></div>
                                <div className='text-center'> <p>60</p> </div>
                                <div className='text-center'><p>20%</p></div>
                            </div> */}
                            <div className='graphrating'>
                                <div style={{ position: 'relative' }}>
                                    <p style={{ left: '-75px' }}>Employees</p>
                                    <h1>{ Data.EmployeesWhoRated }<sub>Are Rating</sub></h1>
                                </div>
                                <div style={{ position: 'relative' }}>
                                    <p style={{ left: '-75px' }}>Employees</p>
                                    <h1>{ Data.EmployeesWhoDoNotRated }<sub>Are Not Rating</sub></h1>
                                </div>
                            </div>
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