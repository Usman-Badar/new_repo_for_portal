/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable eqeqeq */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import './Style.css';

import { numberToWords } from "amount-to-words";
import moment from 'moment';
import CanvasJSReact from '../../../../../canvasjs.react';
import loading from '../../../../../images/loadingIcons/icons8-iphone-spinner.gif';

// import "https://cdn.dribbble.com/users/6234/screenshots/16550123/media/67f0d3ab601bdbab51d89e591b3e9abd.png?compress=1&resize=1000x750&vertical=top" from '../../../../../images/img1.jpg';
// import weathericon from '../../../../../images/weather-icon.png';

import Modal from '../../../../UI/Modal/Modal';

import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

import { Link, useHistory } from 'react-router-dom';
import { Area, AreaChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { convertTZ } from './../../../../../utils/date';

const UI = ({ getAbsentsOfEmployees, Absents, AdvanceCashData, Vendors, Purchases, ZeroLatesEmps, Companies, AttendanceSummery, d, DateFilter, ACEmployees, ACCleared, ACNotCleared, DataLoaded, ACData, InventoryData, View, HomeData, AccessControls, WeatherData, loadMonthlyPurchases, getZeroLatesEmployees, loadACRequest, setACEmployees, loadAttendanceSummery, setDateFilter, setView, loadData }) => {

    const [ Requests, setRequests ] = useState([]);
    const [ Employee, setEmployee ] = useState();
    const [ ShowACDetails, setShowACDetails ] = useState(false);
    const [value, onChange] = useState(new Date());
    const [ ToggleInAC, setToggleInAC ] = useState(false);

    const { FormatMoney } = require('format-money-js');
    const fm = new FormatMoney({ symbol: 'Rs ', decimals: 2 });
    const types = {
        balance: 'balance',
        name: 'name',
        last_updated: 'last_updated',
    };
    const monthNames = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const history = useHistory();
    const key = 'real secret keys should be long and random';
    const encryptor = require('simple-encryptor')(key);
    const CanvasJSChart = CanvasJSReact.CanvasJSChart;
    let height = 0;
    let Admin = false;

    useEffect(
        () => {
            if ( sessionStorage.getItem('ADashboardACEmpListDateFilter') )
            {
                setDateFilter(sessionStorage.getItem('ADashboardACEmpListDateFilter'));
            }
        }, []
    );

    if ( !DataLoaded || !AdvanceCashData || !AttendanceSummery )
    {
        return <>Please Wait....</>;
    }

    const options = {
        animationEnabled: true,
        exportEnabled: true,
        theme: "light2",
        title: false,
        height: 200,
        axisY: {
            gridThickness: 0,
            lineThickness: 0,
            tickThickness: 0,
        },
        axisY2: {
            gridThickness: 0,
            lineThickness: 0,
            tickThickness: 0,
        },
        axisX: {
            gridThickness: 0,
            lineThickness: 0,
            tickThickness: 0,
        },
        toolTip: {
            shared: true
        },
        legend: false,
        data: [ ACNotCleared, ACCleared ]
    }
    const options2 = {
        animationEnabled: true,
        exportEnabled: true,
        theme: "light2",
        title: false,
        height: 200,
        axisY: {
            gridThickness: 0,
            lineThickness: 0,
            tickThickness: 0,
        },
        axisY2: {
            gridThickness: 0,
            lineThickness: 0,
            tickThickness: 0,
        },
        axisX: {
            gridThickness: 0,
            lineThickness: 0,
            tickThickness: 0,
        },
        toolTip: {
            shared: true
        },
        legend: false,
        data: [ AttendanceSummery ]
    }
    const options3 = {
        animationEnabled: true,
        exportEnabled: true,
        theme: "light2",
        title: false,
        height: 200,
        axisY: {
            gridThickness: 0,
            lineThickness: 0,
            tickThickness: 0,
        },
        axisY2: {
            gridThickness: 0,
            lineThickness: 0,
            tickThickness: 0,
        },
        axisX: {
            gridThickness: 0,
            lineThickness: 0,
            tickThickness: 0,
        },
        toolTip: {
            shared: true
        },
        legend: false,
        data: [Purchases]
    }
    const options4 = {
        animationEnabled: true,
        theme: "light2",
        height: HomeData ? HomeData.monthly_attendance_summery.map(() => { return height = height + 50 }).pop() : 0,
        title: {
            text: "Your Monthly Attendance Summary"
        },
        axisX: {
            title: "",
            reversed: true,
        },
        axisY: {
            title: monthNames[new Date().getMonth() + 1],
            includeZero: true
        },
        data: [{
            type: "bar",
            indexLabel: false,
            dataPoints: HomeData ? HomeData.monthly_attendance_summery : []
        }]
    }
    var dataPoint;
    var total;
    const option5 = {
        theme: "light2",
        animationEnabled: true,
        exportEnabled: true,
        title: false,
        height: 200,
        data: [{
            type: "funnel",
            indexLabel: "{label} - {y}",
            toolTipContent: "<b>{label} Vendors</b>: {y}</b>",
            neckWidth: 20,
            neckHeight: 0,
            valueRepresents: "area",
            dataPoints: Vendors
        }]
    }
    // if ( DataLoaded )
    // {
    //     //calculate percentage
    //     dataPoint = options.data[0].dataPoints;
    //     total = dataPoint[0]?.y;
    //     for (var i = 0; i < dataPoint.length; i++) {
    //         if (i == 0) {
    //             options.data[0].dataPoints[i].percentage = 100;
    //         } else {
    //             options.data[0].dataPoints[i].percentage = ((dataPoint[i].y / total) * 100).toFixed(2);
    //         }
    //     }
    // }

    const sortArray = ( type, in_de, dataType ) => {
        const sortProperty = types[type];
        let sorted = sort( sortProperty, in_de, dataType );
        setACEmployees(sorted);
    };

    const sort = ( property, in_de, dataType ) => {
        const result =
        dataType === "number"
        ? sortNumber(property, in_de)
        : dataType === "string"
        ? sortString(property, in_de)
        : dataType === 'date'
        ? sortDate(property, in_de)
        : [];

        return result;
    }

    const sortNumber = ( property, in_de ) => {
        let sorted;
        if ( in_de > 0 )
        {
            sorted = [...ACEmployees].sort((a, b) => b[property] - a[property]);
        }else
        {
            sorted = [...ACEmployees].sort((a, b) => a[property] - b[property]);
        }
        return sorted;
    }

    const sortString = ( property, in_de ) => {
        let sorted;
        if ( in_de > 0 )
        {
            sorted = [...ACEmployees].sort((a, b) => b[property].localeCompare(a[property]));
        }else
        {
            sorted = [...ACEmployees].sort((a, b) => a[property].localeCompare(b[property]));
        }
        return sorted;
    }

    const sortDate = ( property, in_de ) => {
        let sorted;
        if ( in_de > 0 )
        {
            sorted = [...ACEmployees].sort((a, b) => new Date(b[property]) - new Date(a[property]));
        }else
        {
            sorted = [...ACEmployees].sort((a, b) => new Date(a[property]) - new Date(b[property]));
        }
        return sorted;
    }

    const openACDetails = (id) => {
        let employee = ACEmployees.filter( val => val.id === id );
        if ( employee[0] )
        {
            loadACRequest(employee[0].emp_id, setRequests);
            setEmployee(employee[0]);
            setShowACDetails(true);
        }else
        {
            console.log("Error: No Employee Found!1!");
        }
    }
    
    if ( AccessControls && AccessControls.access )
    {
        for (let y = 0; y < JSON.parse(AccessControls.access).length; y++) {
            if (parseInt(JSON.parse(AccessControls.access)[y]) === 0) {
                Admin = true;
            }
        }
    }

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="custom-tooltip">
                    <b>{label}</b>
                    <hr className='my-1' />
                    {
                        payload.map(
                            ({name, value, color}, i) => {
                                return (
                                    <div style={{ color: color }} key={i} className='d-flex justify-content-between'>
                                        <span>{name}:</span>
                                        <span className='pl-3'>{value}%</span>
                                    </div>
                                )
                            }
                        )
                    }
                </div>
            );
        }
        return null;
    };

    const CustomPurchasesTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="custom-tooltip">
                    <b>Day: {label}</b>
                    <hr className='my-1' />
                    {
                        payload.map(
                            ({name, value, color}, i) => {
                                return (
                                    <div style={{ color: color }} key={i} className='d-flex justify-content-between'>
                                        <span>{name}:</span>
                                        <span className='pl-3'>{value} request(s)</span>
                                    </div>
                                )
                            }
                        )
                    }
                </div>
            );
        }
        return null;
    };

    // const data = [
    //     {
    //         "name": "Page A",
    //         "uv": 4000,
    //         "pv": 2400,
    //         "amt": 2400
    //     },
    //     {
    //         "name": "Page B",
    //         "uv": 3000,
    //         "pv": 1398,
    //         "amt": 2210
    //     },
    //     {
    //         "name": "Page C",
    //         "uv": 2000,
    //         "pv": 9800,
    //         "amt": 2290
    //     },
    //     {
    //         "name": "Page D",
    //         "uv": 2780,
    //         "pv": 3908,
    //         "amt": 2000
    //     },
    //     {
    //         "name": "Page E",
    //         "uv": 1890,
    //         "pv": 4800,
    //         "amt": 2181
    //     },
    //     {
    //         "name": "Page F",
    //         "uv": 2390,
    //         "pv": 3800,
    //         "amt": 2500
    //     },
    //     {
    //         "name": "Page G",
    //         "uv": 3490,
    //         "pv": 4300,
    //         "amt": 2100
    //     }
    // ]
    // console.log(Purchases)

    return (
        <>
            <div className='page homepage'>
                <Modal show={ ShowACDetails } Hide={ () => setShowACDetails( !ShowACDetails ) } content={ <ACContent history={ history } Employee={ Employee } Requests={ Requests } /> } />
                {
                    AccessControls.access && Admin
                    ?
                    <>
                        <div className='mb-4 grid grid-gap-3 grid-4-6 popUps'>
                            <div className='page-content'>
                                <div className='d-flex align-items-center justify-content-between'>
                                    <h5 className='mb-0 font-weight-bold text-capitalize'>Total cash in and out ({new Date().getFullYear()})</h5>
                                    <div className="dropdown dropleft">
                                        <button className="btn" type="button" id="dropdownMenuButton" data-toggle="dropdown">
                                            <i className="las la-ellipsis-v"></i>
                                        </button>
                                        <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                            <a className={ !ToggleInAC ? "dropdown-item active" : "dropdown-item" } onClick={ () => setToggleInAC(false) }>By Requests</a>
                                            <a className={ ToggleInAC ? "dropdown-item active" : "dropdown-item" } onClick={ () => setToggleInAC(true) }>By Amount</a>
                                        </div>
                                    </div>
                                </div>
                                <hr />
                                {
                                    ToggleInAC
                                    ?
                                    <ResponsiveContainer width="100%" height={250}>
                                        <LineChart data={AdvanceCashData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" />
                                            <YAxis />
                                            <Tooltip />
                                            <Legend align='center' />
                                            <Line type="monotone" dataKey="amount" name="Amount" stroke="#8883D8" />
                                        </LineChart>
                                    </ResponsiveContainer>
                                    :
                                    <ResponsiveContainer width="100%" height={250}>
                                        <LineChart data={AdvanceCashData} margin={{ top: 5, right: 30, left: -20, bottom: 5 }}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" />
                                            <YAxis />
                                            <Tooltip />
                                            <Legend align='center' />
                                            <Line type="monotone" dataKey="Approved" stroke="#82CA9D" />
                                            <Line type="monotone" dataKey="Issued" stroke="#8883D8" />
                                            <Line type="monotone" dataKey="Cleared" stroke="#83A6ED" />
                                            <Line type="monotone" dataKey="Waiting for approval" stroke="#FFC658" />
                                            <Line type="monotone" dataKey="Pending for verification" stroke="#EA8C19" />
                                        </LineChart>
                                    </ResponsiveContainer>
                                }
                            </div>
                            <div className='page-content'>
                                <div className='d-flex justify-content-between'>
                                    <h5 className='mb-0 font-weight-bold text-capitalize'>Advance Cash <sup className='text-danger'>(Overdue)</sup></h5>
                                    <select className='form-control mb-0' value={DateFilter} onChange={ (e) => { setDateFilter(e.target.value); sessionStorage.setItem('ADashboardACEmpListDateFilter', e.target.value) } } style={{ width: 'fit-content' }}>
                                        <option value={ moment(d).subtract(14, 'days').format('YYYY-MM-DD') }>7 days+</option>
                                        <option value={ moment(d).subtract(28, 'days').format('YYYY-MM-DD') }>14 days+</option>
                                        <option value={ moment(d).subtract(93, 'days').format('YYYY-MM-DD') }>28 days+</option>
                                        <option value={ moment(d).subtract(182, 'days').format('YYYY-MM-DD') }>6 months</option>
                                    </select>
                                </div>
                                <hr />
                                <div className='records-container' style={{ maxHeight: '250px' }}>
                                    {
                                        ACEmployees.length === 0
                                        ?
                                        <h6 className='text-center'>No Record Found</h6>
                                        :
                                        <table className='table table-sm'>
                                            <thead>
                                                <tr>
                                                    <th className='border-top-0'>Sr.No</th>
                                                    <th className='border-top-0'>
                                                        <div className='d-flex align-items-center'>
                                                            Employee 
                                                            <div className='ml-2'>
                                                                <i onClick={ () => sortArray('name', 1, 'string') } className="las la-chevron-up d-block" style={{ cursor: 'pointer' }}></i>
                                                                <i onClick={ () => sortArray('name', 0, 'string') } className="las la-chevron-down d-block" style={{ cursor: 'pointer' }}></i>
                                                            </div>
                                                        </div>
                                                    </th>
                                                    <th className='border-top-0'>
                                                        <div className='d-flex align-items-center'>
                                                            Total Pending Balance 
                                                            <div className='ml-2'>
                                                                <i onClick={ () => sortArray('balance', 1, 'number') } className="las la-chevron-up d-block" style={{ cursor: 'pointer' }}></i>
                                                                <i onClick={ () => sortArray('balance', 0, 'number') } className="las la-chevron-down d-block" style={{ cursor: 'pointer' }}></i>
                                                            </div>
                                                        </div>
                                                    </th>
                                                    <th className='border-top-0'>
                                                        <div className='d-flex align-items-center'>
                                                            Last Taken
                                                            <div className='ml-2'>
                                                                <i onClick={ () => sortArray('last_updated', 1, 'date') } className="las la-chevron-up d-block" style={{ cursor: 'pointer' }}></i>
                                                                <i onClick={ () => sortArray('last_updated', 0, 'date') } className="las la-chevron-down d-block" style={{ cursor: 'pointer' }}></i>
                                                            </div>
                                                        </div>
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    ACEmployees.map(
                                                        ( val, index ) => {
                                                            if ( index === 0 ) { console.log('db date: ', val.last_updated); console.log('1st solution: ', convertTZ(val.last_updated)); console.log('prev solution: ', new Date(val.last_updated)); console.log('local date: ', new Date(val.last_updated).toLocaleString()) }
                                                            return (
                                                                <tr key={index} className='pointer pointer-hover'>
                                                                    <td onClick={ () => openACDetails( val.id ) }>{ val.id }</td>
                                                                    <td onDoubleClick={ () => openACDetails( val.id ) }><Link to={'/hr/employee/details/' + val.emp_id} className='clickable'>{ val.name }</Link></td>
                                                                    <td onClick={ () => openACDetails( val.id ) } className={ parseInt(val.balance) === 0 ? "text-success" : "text-danger" }><b>{ fm.from(val.balance) }</b></td>
                                                                    <td onClick={ () => openACDetails( val.id ) }>{ convertTZ(val.last_updated).toDateString() }</td>
                                                                </tr>
                                                            )
                                                        }
                                                    )
                                                }
                                            </tbody>
                                        </table>
                                    }
                                </div>
                            </div>
                        </div>
                        <div className='page-content mb-4'>
                            <div className='d-flex justify-content-between align-items-center'>
                                <h5 className='mb-0 font-weight-bold text-capitalize'>Attendance Summary ({new Date().getFullYear()})</h5>
                                {/* <div>
                                    <label className='mb-0 label-small font-weight-bold'>Month</label>
                                    <input type='month' onChange={ (e) => loadAttendanceSummery(e.target.value) } defaultValue={moment(moment()).format('YYYY-MM')} className='form-control form-control-small' />
                                </div> */}
                            </div>
                            <hr />
                            <ResponsiveContainer width="100%" height={180}>
                                <AreaChart data={AttendanceSummery} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="1%" stopColor="#8883D8" stopOpacity={0.8} />
                                            <stop offset="99%" stopColor="#8883D8" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="1%" stopColor="#e99a28" stopOpacity={0.8} />
                                            <stop offset="99%" stopColor="#e99a28" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorCv" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="1%" stopColor="#8DD1E1" stopOpacity={0.8} />
                                            <stop offset="99%" stopColor="#8DD1E1" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorDv" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="1%" stopColor="#ee4a2f" stopOpacity={0.8} />
                                            <stop offset="99%" stopColor="#ee4a2f" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Area type="monotone" dataKey="Absent" stroke="#ee4a2f" fillOpacity={0.5} fill="url(#colorDv)" />
                                    <Area type="monotone" dataKey="Leave" stroke="#8DD1E1" fillOpacity={0.5} fill="url(#colorCv)" />
                                    <Area type="monotone" dataKey="Late" stroke="#e99a28" fillOpacity={0.5} fill="url(#colorPv)" />
                                    <Area type="monotone" dataKey="Present" stroke="#8883D8" fillOpacity={0.5} fill="url(#colorUv)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                        <div className='mb-4 grid grid-gap-3 grid-2-2 popUps'>
                            <div className='page-content'>
                                <div className='d-flex justify-content-between align-items-center'>
                                    <h5 className='mb-0 font-weight-bold text-capitalize'>employees having zero lates <sup>({ZeroLatesEmps.length})</sup></h5>
                                    <div>
                                        <label className='mb-0 label-small font-weight-bold'>Month</label>
                                        <input type='month' onChange={ (e) => getZeroLatesEmployees( e.target.value ) } defaultValue={moment(moment()).format('YYYY-MM')} className='form-control form-control-small' />
                                    </div>
                                </div>
                                <hr />
                                <div className='records-container' style={{ maxHeight: '250px' }}>
                                    {
                                        ZeroLatesEmps.length === 0
                                        ?
                                        <h6 className='text-center'>No Employee Found</h6>
                                        :
                                        <table className='table table-sm mb-0'>
                                            <thead>
                                                <tr>
                                                    <th className='border-top-0'>Sr.No</th>
                                                    <th className='border-top-0'>Employee Code</th>
                                                    <th className='border-top-0'>Employee</th>
                                                    <th className='border-top-0'>Company</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    ZeroLatesEmps.map(
                                                        ( val, index ) => {
                                                            return (
                                                                <tr key={index} className='clickable pointer' onClick={ () => history.push('/hr/employee/details/' + val.emp_id) }>
                                                                    <td>{ index + 1 }</td>
                                                                    <td>{ val.emp_id }</td>
                                                                    <td>{ val.name }</td>
                                                                    <td>{ val.company_name }</td>
                                                                </tr>
                                                            )
                                                        }
                                                    )
                                                }
                                            </tbody>
                                        </table>
                                    }
                                </div>
                            </div>
                            <div className='page-content'>
                                <div className='d-flex justify-content-between align-items-center'>
                                    <h5 className='mb-0 font-weight-bold text-capitalize'>employees having absents <sup>({Absents.length})</sup></h5>
                                    <div>
                                        <label className='mb-0 label-small font-weight-bold'>Month</label>
                                        <input type='month' onChange={ (e) => getAbsentsOfEmployees( e.target.value ) } defaultValue={moment(moment()).format('YYYY-MM')} className='form-control form-control-small' />
                                    </div>
                                </div>
                                <hr />
                                <div className='records-container' style={{ maxHeight: '250px' }}>
                                    {
                                        Absents.length === 0
                                        ?
                                        <h6 className='text-center'>No Employee Found</h6>
                                        :
                                        <table className='table table-sm mb-0'>
                                            <thead>
                                                <tr>
                                                    <th className='border-top-0'>Sr.No</th>
                                                    <th className='border-top-0'>Employee Code</th>
                                                    <th className='border-top-0'>Employee</th>
                                                    <th className='border-top-0'>Company</th>
                                                    <th className='border-top-0'>Absent(s)</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    Absents.sort(function(a, b){return b.absents - a.absents}).map(
                                                        ( val, index ) => {
                                                            return (
                                                                <tr key={index} className='clickable pointer' onClick={ () => history.push('/hr/employee/details/' + val.emp_id) }>
                                                                    <td>{ index + 1 }</td>
                                                                    <td>{ val.emp_id }</td>
                                                                    <td>{ val.name }</td>
                                                                    <td>{ val.code }</td>
                                                                    <td>{ val.absents }</td>
                                                                </tr>
                                                            )
                                                        }
                                                    )
                                                }
                                            </tbody>
                                        </table>
                                    }
                                </div>
                            </div>
                        </div>
                        <div className='mb-4 grid grid-gap-3 grid-7-3 popUps'>
                            <div className='page-content'>
                                <div className='d-flex justify-content-between align-items-center'>
                                    <h5 className='mb-0 font-weight-bold text-capitalize'>Purchase Orders</h5>
                                    <div>
                                        <label className='mb-0 label-small font-weight-bold'>Month</label>
                                        <input type='month' onChange={ (e) => loadMonthlyPurchases( e.target.value ) } defaultValue={moment(moment()).format('YYYY-MM')} className='form-control form-control-small' />
                                    </div>
                                </div>
                                <hr />
                                {/* <CanvasJSChart options={options3} /> */}
                                <ResponsiveContainer width="100%" height={180}>
                                    <AreaChart data={Purchases} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="1%" stopColor="#ee4a2f" stopOpacity={0.8} />
                                                <stop offset="99%" stopColor="#ee4a2f" stopOpacity={0} />
                                            </linearGradient>
                                            <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="1%" stopColor="#e99a28" stopOpacity={0.8} />
                                                <stop offset="99%" stopColor="#e99a28" stopOpacity={0} />
                                            </linearGradient>
                                            <linearGradient id="colorCv" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="1%" stopColor="#82CA9D" stopOpacity={0.8} />
                                                <stop offset="99%" stopColor="#82CA9D" stopOpacity={0} />
                                            </linearGradient>
                                            <linearGradient id="colorDv" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="1%" stopColor="#FFC658" stopOpacity={0.8} />
                                                <stop offset="99%" stopColor="#FFC658" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <Tooltip content={<CustomPurchasesTooltip />} />
                                        <Area type="monotone" dataKey="Waiting_for_approval" name="Waiting For Approval" stroke="#FFC658" fillOpacity={0.5} fill="url(#colorDv)" />
                                        <Area type="monotone" dataKey="Approved" stroke="#82CA9D" fillOpacity={0.5} fill="url(#colorCv)" />
                                        <Area type="monotone" dataKey="Canceled" stroke="#8883D8" fillOpacity={0.5} fill="url(#colorPv)" />
                                        <Area type="monotone" dataKey="Rejected" stroke="#ee4a2f" fillOpacity={0.5} fill="url(#colorUv)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                            <div className='page-content'>
                                <h6 className='mb-0 font-weight-bold text-capitalize'>Vendors Status</h6>
                                <hr />
                                <CanvasJSChart options={option5} />
                            </div>
                        </div>
                        {/* <div className='mb-4 grid grid-gap-3 grid-2-2 popUps'>
                            <div className='page-content'>
                                <h6 className='mb-0 font-weight-bold text-capitalize'>list of employees have issued tickets recently</h6>
                                <hr />
                                <div className='records-container' style={{ maxHeight: '35vh' }}>
                                    <table className='table table-sm mb-0'>
                                        <thead>
                                            <tr>
                                                <th className='border-top-0'>Code</th>
                                                <th className='border-top-0'>Employee</th>
                                                <th className='border-top-0'>Company</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>Code</td>
                                                <td>Employee</td>
                                                <td>Company</td>
                                            </tr>
                                            <tr>
                                                <td>Code</td>
                                                <td>Employee</td>
                                                <td>Company</td>
                                            </tr>
                                            <tr>
                                                <td>Code</td>
                                                <td>Employee</td>
                                                <td>Company</td>
                                            </tr>
                                            <tr>
                                                <td>Code</td>
                                                <td>Employee</td>
                                                <td>Company</td>
                                            </tr>
                                            <tr>
                                                <td>Code</td>
                                                <td>Employee</td>
                                                <td>Company</td>
                                            </tr>
                                            <tr>
                                                <td>Code</td>
                                                <td>Employee</td>
                                                <td>Company</td>
                                            </tr>
                                            <tr>
                                                <td>Code</td>
                                                <td>Employee</td>
                                                <td>Company</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className='page-content'>
                                <h6 className='mb-0 font-weight-bold text-capitalize'>list of employees got tickets recently</h6>
                                <hr />
                                <div className='records-container' style={{ maxHeight: '35vh' }}>
                                    <table className='table table-sm mb-0'>
                                        <thead>
                                            <tr>
                                                <th className='border-top-0'>Code</th>
                                                <th className='border-top-0'>Employee</th>
                                                <th className='border-top-0'>Company</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>Code</td>
                                                <td>Employee</td>
                                                <td>Company</td>
                                            </tr>
                                            <tr>
                                                <td>Code</td>
                                                <td>Employee</td>
                                                <td>Company</td>
                                            </tr>
                                            <tr>
                                                <td>Code</td>
                                                <td>Employee</td>
                                                <td>Company</td>
                                            </tr>
                                            <tr>
                                                <td>Code</td>
                                                <td>Employee</td>
                                                <td>Company</td>
                                            </tr>
                                            <tr>
                                                <td>Code</td>
                                                <td>Employee</td>
                                                <td>Company</td>
                                            </tr>
                                            <tr>
                                                <td>Code</td>
                                                <td>Employee</td>
                                                <td>Company</td>
                                            </tr>
                                            <tr>
                                                <td>Code</td>
                                                <td>Employee</td>
                                                <td>Company</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div> */}
                    </>
                    :null
                }
                <div className='mb-4 grid grid-gap-3 grid-3-7 popUps'>
                    <div className='page-content'>
                        <h5>Today's Attendance</h5>
                        {
                            HomeData && HomeData.todays_attendance
                                ?
                                <table className='table mb-0'>
                                    <tbody>
                                        <tr>
                                            <th>Time in</th>
                                            <td>{HomeData.todays_attendance[0] && HomeData.todays_attendance[0].time_in ? moment(HomeData.todays_attendance[0].time_in, 'h:mm:ss a').format('hh:mm A') : 'no time in'}</td>
                                        </tr>
                                        <tr>
                                            <th>Break in</th>
                                            <td>{HomeData.todays_attendance[0] && HomeData.todays_attendance[0].break_in ? moment(HomeData.todays_attendance[0].break_in, 'h:mm:ss a').format('hh:mm A') : 'no break in'}</td>
                                        </tr>
                                        <tr>
                                            <th>Break out</th>
                                            <td>{HomeData.todays_attendance[0] && HomeData.todays_attendance[0].break_out ? moment(HomeData.todays_attendance[0].break_out, 'h:mm:ss a').format('hh:mm A') : 'no break out'}</td>
                                        </tr>
                                        <tr>
                                            <th>Time out</th>
                                            <td>{HomeData.todays_attendance[0] && HomeData.todays_attendance[0].time_out ? moment(HomeData.todays_attendance[0].time_out, 'h:mm:ss a').format('hh:mm A') : 'no time out'}</td>
                                        </tr>
                                    </tbody>
                                </table>
                                :
                                <img src={loading} alt="loading..." width='50' height='50' className='d-block mx-auto' />
                        }
                    </div>
                    <div className='page-content'>
                        {
                            HomeData && HomeData.monthly_attendance_summery
                            ?
                            <CanvasJSChart options={options4} />
                            :
                            <img src={loading} alt="loading..." width='50' height='50' className='d-block mx-auto' />
                        }
                    </div>
                </div>
            </div>
        </>
    )

}

export default UI;

const InventoryView = ({ InventoryData, View, CanvasJSChart, AccessControls, setView }) => {

    // const outwardAvg = (InventoryData.total_outward_quantity/InventoryData.total_inward_quantity*100).toFixed(2);
    // const inwardAvg = (InventoryData.total_inward_quantity/InventoryData.total_stored_quantity*100).toFixed(2);  
    let data = [];

    if (InventoryData && InventoryData.products_type_data) {
        const obj1 = InventoryData.products_type_data[0];
        const obj2 = InventoryData.products_type_data[1];
        data.push(
            {
                label: obj1.product_type,
                y: obj1.total_inward_quantity,
                stored_quantity: obj1.total_stored_quantity,
                current_value: obj1.current_value ? obj1.current_value.toLocaleString('en') : 0,
                color: '#1E7BFF',
                toolTipContent: "<b>Total Inward Quantity: </b>{y}<br /><b>Total Stored Quantity: </b>{stored_quantity}<br /><b>Current Value: </b>PKR {current_value}<br />",
            },
            {
                label: obj2.product_type,
                y: obj2.total_inward_quantity,
                stored_quantity: obj2.total_stored_quantity,
                current_value: obj2.current_value ? obj2.current_value.toLocaleString('en') : 0,
                color: '#17A2B8',
                toolTipContent: "<b>Total Inward Quantity: </b>{y}<br /><b>Total Stored Quantity: </b>{stored_quantity}<br /><b>Current Value: </b>PKR {current_value}<br />",
            }
        )
    }
    if (InventoryData && InventoryData.products_issued_data) {
        const obj = InventoryData.products_issued_data;
        data.push(
            {
                label: "Total Issued",
                y: obj.quantity_issued,
                entries: obj.total_issued,
                value_issued: obj.value_issued ? obj.value_issued.toLocaleString('en') : 0,
                color: '#28A744',
                toolTipContent: "<b>Total Entries: </b>{entries}<br /><b>Total Quantity Issued: </b>{y}<br /><b>Total Value: </b>PKR {value_issued}<br />",
            }
        )
    }
    if (InventoryData && InventoryData.products_pending_issued_data) {
        const obj = InventoryData.products_pending_issued_data;
        data.push(
            {
                label: "Issued (Signatures Pending)",
                y: obj.quantity_issued,
                entries: obj.total_issued,
                value_issued: obj.value_issued ? obj.value_issued.toLocaleString('en') : 0,
                color: '#FFC107',
                toolTipContent: "<b>Total Entries: </b>{entries}<br /><b>Total Quantity Issued: </b>{y}<br /><b>Total Value: </b>PKR {value_issued}<br />",
            }
        )
    }
    if (InventoryData && InventoryData.products_pending_preview_data) {
        const obj = InventoryData.products_pending_preview_data;
        data.push(
            {
                label: "Pending Previews",
                y: obj.quantity,
                entries: obj.total_entries,
                color: '#FFC107',
                toolTipContent: "<b>Products With No Preview</b><hr /><b><b>Total Entries: </b>{entries}<br />Total Quantity: </b>{y}<br />",
            }
        )
    }
    const options = {
        animationEnabled: true,
        theme: "light2",
        height: 200,
        title: {
            text: "Inventory Summary"
        },
        axisX: {
            title: "",
            reversed: true,
        },
        // axisY: {
        //     title: monthNames[new Date().getMonth()+1],
        //     includeZero: true
        // },
        toolTip: {
            enabled: true,       //disable here
            animationEnabled: true, //disable here
        },
        data: [{
            type: "bar",
            indexLabel: false,
            dataPoints: data
        }]
    }

    return (
        <div className='inventory_view popUps'>
            <div className='grid grid-gap-2 grid-4-4-4-4 mb-3'>
                <div className='card-item page-content'>
                    {
                        InventoryData && InventoryData.total_products
                            ?
                            <>
                                <div className='d-flex align-items-center'>
                                    <i className="las la-compress-arrows-alt mr-2 text-primary"></i>
                                    <h3 className='font-weight-bold mb-0'>{InventoryData.total_products}</h3>
                                </div>
                                <h6 className='mb-0'>Total Products</h6>
                            </>
                            :
                            <img src={loading} alt="loading..." width='50' height='50' className='d-block mx-auto' />
                    }
                </div>
                <div className='card-item page-content'>
                    {
                        InventoryData && InventoryData.total_inward_quantity
                            ?
                            <>
                                <div className='d-flex align-items-center'>
                                    <i className="las la-sort-amount-up mr-2 text-success"></i>
                                    <h3 className='font-weight-bold mb-0 d-flex align-items-center'>
                                        <div>{InventoryData.total_inward_quantity}</div>
                                        <div className='ml-1'>
                                            <Tippy content={<span>Total Inward Value</span>}>
                                                <div style={{ fontSize: '12px', cursor: 'default' }}>PKR {InventoryData.total_inward_value.toLocaleString('en')}</div>
                                            </Tippy>
                                            <Tippy content={<span>Inward Entries</span>}>
                                                <div style={{ fontSize: '12px', cursor: 'default' }}>{InventoryData.total_inward_entries}</div>
                                            </Tippy>
                                        </div>
                                    </h3>
                                </div>
                                <h6 className='mb-0'>Total Inwards</h6>
                            </>
                            :
                            <img src={loading} alt="loading..." width='50' height='50' className='d-block mx-auto' />
                    }
                </div>
                <div className='card-item page-content'>
                    {
                        InventoryData && InventoryData.total_outward_quantity
                            ?
                            <>
                                <div className='d-flex align-items-center'>
                                    <i className="las la-sort-amount-down mr-2 text-danger"></i>
                                    <h3 className='font-weight-bold mb-0 d-flex align-items-center'>
                                        <div>{InventoryData.total_outward_quantity}</div>
                                        <div className='ml-1'>
                                            <Tippy content={<span>Total Outward Value</span>}>
                                                <div style={{ fontSize: '12px', cursor: 'default' }}>PKR {InventoryData.total_outward_value.toLocaleString('en')}</div>
                                            </Tippy>
                                            <Tippy content={<span>Outward Entries</span>}>
                                                <div style={{ fontSize: '12px', cursor: 'default' }}>{InventoryData.total_outward_entries}</div>
                                            </Tippy>
                                        </div>
                                    </h3>
                                </div>
                                <h6 className='mb-0'>Total Outwards</h6>
                            </>
                            :
                            <img src={loading} alt="loading..." width='50' height='50' className='d-block mx-auto' />
                    }
                </div>
                <div className='card-item page-content'>
                    {
                        InventoryData && InventoryData.total_stored_quantity
                            ?
                            <>
                                <div className='d-flex align-items-center'>
                                    <i className="las la-exchange-alt mr-2 text-secondary"></i>
                                    <h3 className='font-weight-bold mb-0 d-flex align-items-center'>
                                        <div>{InventoryData.total_stored_quantity}</div>
                                        <div className='ml-1'>
                                            <Tippy content={<span>Total Stored Value</span>}>
                                                <div style={{ fontSize: '12px', cursor: 'default' }}>PKR {InventoryData.total_stored_value.toLocaleString('en')}</div>
                                            </Tippy>
                                            <div style={{ fontSize: '12px', cursor: 'default', opacity: 0 }}>XXX</div>
                                        </div>
                                    </h3>
                                </div>
                                <h6 className='mb-0'>Total Stored</h6>
                            </>
                            :
                            <img src={loading} alt="loading..." width='50' height='50' className='d-block mx-auto' />
                    }
                </div>
            </div>
            <div className='grid grid-gap-2 grid-75-25'>
                <div>
                    <div className='page-content'>
                        <CanvasJSChart options={options} />
                    </div>
                </div>
                <div>
                    {AccessControls.access ? <Widget View={View} access={AccessControls.access} setView={setView} /> : null}
                    <div className='page-content high_inwards mb-3'>
                        {
                            InventoryData && InventoryData.products_have_h_inwards
                                ?
                                <>
                                    <div className='d-flex align-items-center justify-content-between mb-3'>
                                        <h6 className='font-weight-bold mb-0'>Products Have High Inwards</h6>
                                        {/* <span className='text-success pr-3'>{inwardAvg}%</span> */}
                                    </div>
                                    <table className='table table-sm table-borderless'>
                                        <tbody>
                                            {
                                                InventoryData.products_have_h_inwards.map(
                                                    (val, index) => {
                                                        return (
                                                            <tr key={index}>
                                                                <td>
                                                                    <div className='d-flex align-items-center'>
                                                                        <div className='number mr-3'>
                                                                            <i className="las la-arrow-down"></i>
                                                                        </div>
                                                                        <span>{val.name}</span>
                                                                    </div>
                                                                </td>
                                                                <td className='text-right'>
                                                                    <span className='number text-success'>{val.quantity}</span>
                                                                </td>
                                                            </tr>
                                                        )
                                                    }
                                                )
                                            }
                                        </tbody>
                                    </table>
                                </>
                                :
                                <img src={loading} alt="loading..." width='50' height='50' className='d-block mx-auto' />
                        }
                    </div>
                    <div className='page-content high_outwards'>
                        {
                            InventoryData && InventoryData.products_have_h_outwards
                                ?
                                <>
                                    <h6 className='mb-2 font-weight-bold'>Products Have High Outwards</h6>
                                    <table className='table table-sm table-borderless'>
                                        <tbody>
                                            {
                                                InventoryData.products_have_h_outwards.map(
                                                    (val, index) => {
                                                        return (
                                                            <tr key={index}>
                                                                <td>
                                                                    <div className='d-flex align-items-center'>
                                                                        <div className='number mr-3'>
                                                                            <i className="las la-arrow-down"></i>
                                                                        </div>
                                                                        <span>{val.name}</span>
                                                                    </div>
                                                                </td>
                                                                <td className='text-right'>
                                                                    <span className='number text-danger'>{val.quantity}</span>
                                                                </td>
                                                            </tr>
                                                        )
                                                    }
                                                )
                                            }
                                        </tbody>
                                    </table>
                                </>
                                :
                                <img src={loading} alt="loading..." width='50' height='50' className='d-block mx-auto' />
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

const HomeView = ({ View, encryptor, history, HomeData, CanvasJSChart, AccessControls, WeatherData, value, setView, onChange, loadData }) => {

    const d = new Date();
    let message = "";
    let height = 0;
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    const optionsForLeavesChart = {
        animationEnabled: true,
        theme: "light2",
        height: HomeData ? HomeData.monthly_attendance_summery.map(() => { return height = height + 50 }).pop() : 0,
        title: {
            text: "Your Monthly Attendance Summary"
        },
        axisX: {
            title: "",
            reversed: true,
        },
        axisY: {
            title: monthNames[new Date().getMonth()],
            includeZero: true
        },
        data: [{
            type: "bar",
            indexLabel: false,
            dataPoints: HomeData ? HomeData.monthly_attendance_summery : []
        }]
    }
    if (d.getHours() > 5 && d.getHours() <= 12) {
        message = "Good Morning";
    }
    if (d.getHours() > 12 && d.getHours() <= 17) {
        message = "Good Afternoon";
    }
    if (d.getHours() > 17) {
        message = "Good Evening";
    }

    useEffect(
        () => {
            loadData();
        }, []
    )

    return (
        <>
            <div className='grid grid-gap-2 grid-8-2 popUps'>
                <div className='grid grid-gap-2 grid-3-7 mb-3'>
                    <div>
                        <div className='page-content mb-3'>
                            {
                                WeatherData && AccessControls
                                    ?
                                    <>
                                        <div className="grid grid-gap-1 grid-8-2">

                                            <div className='pt-3'>
                                                <h4 className="mb-0 font-weight-bold" id="temp">
                                                    <i className="las la-temperature-low mr-2"></i>
                                                    {WeatherData.temp}
                                                </h4>
                                                <h4 className="mb-0 font-weight-bold">
                                                    <i className="las la-tint mr-2"></i>
                                                    {WeatherData.humidity}
                                                </h4>
                                                <h4 className="mb-2 font-weight-bold">
                                                    <i className="las la-wind mr-2"></i>
                                                    {WeatherData.wind_speed}
                                                </h4>
                                                <p className="mb-0 font-weight-bold">{WeatherData.day}, {WeatherData.current_time}</p>
                                            </div>

                                            <img
                                                src={WeatherData.weather_icon}
                                                alt="weather_icon"
                                                width='80px'
                                                height='80px'
                                                className="d-block mx-auto rounded-circle"
                                                id="weather_icon"
                                            />

                                        </div>
                                        <div className='mt-3'>
                                            <h6 className="mb-0 font-weight-bold">{message},</h6>
                                            <h5>{AccessControls.name}</h5>
                                        </div>
                                    </>
                                    :
                                    <img src={loading} alt="loading..." width='50' height='50' className='d-block mx-auto' />
                            }
                        </div>
                        <div className='page-content'>
                            <h5>Today's Attendance</h5>
                            {
                                HomeData && HomeData.todays_attendance
                                    ?
                                    <table className='table mb-0'>
                                        <tbody>
                                            <tr>
                                                <th>Time in</th>
                                                <td>{HomeData.todays_attendance[0] && HomeData.todays_attendance[0].time_in ? moment(HomeData.todays_attendance[0].time_in, 'h:mm:ss a').format('hh:mm A') : 'no time in'}</td>
                                            </tr>
                                            <tr>
                                                <th>Break in</th>
                                                <td>{HomeData.todays_attendance[0] && HomeData.todays_attendance[0].break_in ? moment(HomeData.todays_attendance[0].break_in, 'h:mm:ss a').format('hh:mm A') : 'no break in'}</td>
                                            </tr>
                                            <tr>
                                                <th>Break out</th>
                                                <td>{HomeData.todays_attendance[0] && HomeData.todays_attendance[0].break_out ? moment(HomeData.todays_attendance[0].break_out, 'h:mm:ss a').format('hh:mm A') : 'no break out'}</td>
                                            </tr>
                                            <tr>
                                                <th>Time out</th>
                                                <td>{HomeData.todays_attendance[0] && HomeData.todays_attendance[0].time_out ? moment(HomeData.todays_attendance[0].time_out, 'h:mm:ss a').format('hh:mm A') : 'no time out'}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    :
                                    <img src={loading} alt="loading..." width='50' height='50' className='d-block mx-auto' />
                            }
                        </div>
                    </div>
                    <div>
                        <div className='page-content mb-3'>
                            {
                                HomeData && HomeData.monthly_attendance_summery
                                ?
                                <CanvasJSChart options={optionsForLeavesChart} />
                                :
                                <img src={loading} alt="loading..." width='50' height='50' className='d-block mx-auto' />
                            }
                        </div>
                        {/* <div className='page-content mb-3'>
                            <div className='d-flex justify-content-between align-items-center'>
                                <h5 className=" font-weight-bold" id="temp">New Announcements</h5>
                                <div className='d-flex justify-content-center align-items-center'>
                                    <i className="las la-arrow-circle-left" ></i>
                                    <i className="las la-arrow-circle-right"></i>
                                </div>
                            </div>
                            <div className='grid grid-gap-1 grid-3-3-3'>

                                <div className='d-flex'>
                                    <div className='p-2'>
                                        <img src={"https://cdn.dribbble.com/users/6234/screenshots/16550123/media/67f0d3ab601bdbab51d89e591b3e9abd.png?compress=1&resize=1000x750&vertical=top"} alt=""
                                            width="80"
                                            height="80" />
                                    </div>
                                    <div className='p-2'>
                                        <p className="mb-0 font-weight-bold">Lorem ipsem</p>
                                        <p className="mb-0">Lorem ipsem Lorem ipsem Lorem ipsem Lorem ipsem Lorem ipsem Lorem ipsem </p>
                                    </div>
                                </div>

                                <div className='d-flex'>
                                    <div className='p-2'>
                                        <img src={"https://cdn.dribbble.com/users/6234/screenshots/16550123/media/67f0d3ab601bdbab51d89e591b3e9abd.png?compress=1&resize=1000x750&vertical=top"} alt=""
                                            width="80"
                                            height="80" />
                                    </div>
                                    <div className='p-2'>
                                        <p className="mb-0 font-weight-bold">Lorem ipsem</p>
                                        <p className="mb-0">Lorem ipsem Lorem ipsem Lorem ipsem Lorem ipsem Lorem ipsem Lorem ipsem </p>
                                    </div>
                                </div>

                                <div className='d-flex'>
                                    <div className='p-2'>
                                        <img src={"https://cdn.dribbble.com/users/6234/screenshots/16550123/media/67f0d3ab601bdbab51d89e591b3e9abd.png?compress=1&resize=1000x750&vertical=top"} alt=""
                                            width="80"
                                            height="80" />
                                    </div>
                                    <div className='p-2'>
                                        <p className="mb-0 font-weight-bold">Lorem ipsem</p>
                                        <p className="mb-0">Lorem ipsem Lorem ipsem Lorem ipsem Lorem ipsem Lorem ipsem Lorem ipsem </p>
                                    </div>
                                </div>

                            </div>
                        </div> */}
                    </div>
                </div>
                <div>
                    {AccessControls.access ? <Widget View={View} access={AccessControls.access} setView={setView} /> : null}
                    <div className='page-content mb-3'>
                        <h5 className='mb-3'>Recent Chats</h5>
                        {
                            HomeData && HomeData.last_chats
                                ?
                                HomeData.last_chats.length === 0 ? <h6 className='text-center'>No Chat Found</h6> :
                                    HomeData.last_chats.map(
                                        (val, index) => {
                                            return (
                                                <div key={index} className='d-flex align-items-center border-bottom border-top py-1 pointer' onClick={() => history.push('/chat')}>
                                                    <img src={'/images/employees/' + val.emp_image} alt=""
                                                        width="40"
                                                        height="40"
                                                        className="rounded-circle border" />

                                                    <div className='p-1'>
                                                        <p className='font-weight-bolder mb-0'>{val.sender}</p>
                                                        <p className='mb-0' style={{ wordBreak: 'break-word' }}>{encryptor.decrypt(val.chat_body)}</p>
                                                    </div>

                                                </div>
                                            )
                                        }
                                    )
                                :
                                <img src={loading} alt="loading..." width='50' height='50' className='d-block mx-auto' />
                        }
                    </div>
                    <div className='page-content'>
                        <Calendar onChange={onChange} value={value} />
                    </div>
                </div>

                {/* <div className='grid grid-gap-1 grid-3-3-3'>
                    <div className='page-content'></div>
                    <div className='page-content'>
                        <h5 className='font-weight-bolder'>Poll</h5>
                        <p>In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content</p>
                        <select className='form-control mb-3' name="" id="">
                            <option value="">select</option>
                            <option value="agreed">I agree</option>
                            <option value="not-agreed">Disagree</option>
                        </select>
                        <button type="button" className="btn">Submit</button>
                    </div>
                </div> */}

            </div>
        </>
    )
}

const ACView = ({ history, ACData, View, AccessControls, setView, loadACRequest }) => {

    const d = moment(moment()).format('YYYY-MM-DD');
    const types = {
        balance: 'balance',
        name: 'name',
        last_updated: 'last_updated',
    };
    const [DateFilter, setDateFilter] = useState(moment(d).subtract(7, 'days').format('YYYY-MM-DD'));
    const [Employees, setEmployees] = useState([]);
    const [Requests, setRequests] = useState([]);
    const [Employee, setEmployee] = useState();
    const [ShowACDetails, setShowACDetails] = useState(false);

    useEffect(
        () => {
            if (ACData && ACData.employees) {
                const Arr = ACData.employees.filter(val => { return moment(new Date(val.last_updated)).format('YYYY-MM-DD') > DateFilter });
                setEmployees(Arr);
            }
        }, [ACData, DateFilter]
    )

    if (!ACData) {
        return <></>;
    }

    const sortArray = (type, in_de, dataType) => {
        const sortProperty = types[type];
        let sorted = sort(sortProperty, in_de, dataType);
        setEmployees(sorted);
    };

    const sort = (property, in_de, dataType) => {
        const result =
            dataType === "number"
                ? sortNumber(property, in_de)
                : dataType === "string"
                    ? sortString(property, in_de)
                    : dataType === 'date'
                        ? sortDate(property, in_de)
                        : [];

        return result;
    }

    const sortNumber = (property, in_de) => {
        let sorted;
        if (in_de > 0) {
            sorted = [...Employees].sort((a, b) => b[property] - a[property]);
        } else {
            sorted = [...Employees].sort((a, b) => a[property] - b[property]);
        }
        return sorted;
    }

    const sortString = (property, in_de) => {
        let sorted;
        if (in_de > 0) {
            sorted = [...Employees].sort((a, b) => b[property].localeCompare(a[property]));
        } else {
            sorted = [...Employees].sort((a, b) => a[property].localeCompare(b[property]));
        }
        return sorted;
    }

    const sortDate = (property, in_de) => {
        let sorted;
        if (in_de > 0) {
            sorted = [...Employees].sort((a, b) => new Date(b[property]) - new Date(a[property]));
        } else {
            sorted = [...Employees].sort((a, b) => new Date(a[property]) - new Date(b[property]));
        }
        return sorted;
    }

    const openACDetails = (id) => {
        let employee = Employees.filter(val => val.id === id);
        if (employee[0]) {
            loadACRequest(employee[0].emp_id, setRequests);
            setEmployee(employee[0]);
            setShowACDetails(true);
        } else {
            console.log("Error: No Employee Found!1!");
        }
    }

    return (
        <div className='ac_view popUps'>
            <Modal show={ShowACDetails} Hide={() => setShowACDetails(!ShowACDetails)} content={<ACContent history={history} Employee={Employee} Requests={Requests} />} />
            <div className='grid grid-gap-2 grid-4-4-4-4 mb-3'>
                <div className='card-item page-content'>
                    {
                        ACData.total_requests
                            ?
                            <>
                                <div className='d-flex align-items-center'>
                                    <i className="las la-list mr-2 text-primary"></i>
                                    <h3 className='font-weight-bold mb-0'>{ACData.total_requests}</h3>
                                </div>
                                <h6 className='mb-0'>Total Requests</h6>
                            </>
                            :
                            <img src={loading} alt="loading..." width='50' height='50' className='d-block mx-auto' />
                    }
                </div>
                <div className='card-item page-content'>
                    {
                        ACData.total_amount_issued
                            ?
                            <>
                                <div className='d-flex align-items-center'>
                                    <i className="las la-coins mr-2 text-primary"></i>
                                    <h3 className='font-weight-bold mb-0 d-flex align-items-center'>
                                        <Tippy content={<span>{numberToWords(parseFloat(ACData.total_amount_issued))}</span>}>
                                            <div>{ACData.total_amount_issued.toLocaleString('en')}</div>
                                        </Tippy>
                                        <div className='ml-1'>
                                            <Tippy content={<span>Amount Collected</span>}>
                                                <div style={{ fontSize: '12px', cursor: 'default' }}>PKR {ACData.total_amount_collected.toLocaleString('en')}</div>
                                            </Tippy>
                                            <Tippy content={<span>Amount Pending For Collection</span>}>
                                                <div style={{ fontSize: '12px', cursor: 'default' }}>PKR {ACData.total_amount_not_collected.toLocaleString('en')}</div>
                                            </Tippy>
                                        </div>
                                    </h3>
                                </div>
                                <h6 className='mb-0'>Total Amount Issued</h6>
                            </>
                            :
                            <img src={loading} alt="loading..." width='50' height='50' className='d-block mx-auto' />
                    }
                </div>
                <div className='card-item page-content'>
                    {
                        ACData.total_amount_pending
                            ?
                            <>
                                <div className='d-flex align-items-center'>
                                    <i className="las la-search-dollar mr-2 text-primary"></i>
                                    <Tippy content={<span>Amount Pending For Clearance</span>}>
                                        <h3 className='font-weight-bold mb-0'>{ACData.total_amount_pending.toLocaleString('en')}</h3>
                                    </Tippy>
                                </div>
                                <h6 className='mb-0'>Total Amount Pending</h6>
                            </>
                            :
                            <img src={loading} alt="loading..." width='50' height='50' className='d-block mx-auto' />
                    }
                </div>
                <div className='card-item page-content'>
                    {
                        ACData.total_amount_cleared
                            ?
                            <>
                                <div className='d-flex align-items-center'>
                                    <i className="las la-hand-holding-usd mr-2 text-primary"></i>
                                    <Tippy content={<span>{numberToWords(parseFloat(ACData.total_amount_cleared))}</span>}>
                                        <h3 className='font-weight-bold mb-0'>{ACData.total_amount_cleared.toLocaleString('en')}</h3>
                                    </Tippy>
                                </div>
                                <h6 className='mb-0'>Total Amount Cleared</h6>
                            </>
                            :
                            <img src={loading} alt="loading..." width='50' height='50' className='d-block mx-auto' />
                    }
                </div>
            </div>
            <div className='grid grid-gap-2 grid-75-25'>
                <div>
                    <div className='page-content'>
                        <div className='d-flex align-items-center justify-content-between'>
                            <h4 className='mb-0 font-weight-bold'>List Of Employees ({Employees.length})</h4>
                            <select className='form-control mb-0' value={DateFilter} onChange={(e) => setDateFilter(e.target.value)} style={{ width: 'fit-content' }}>
                                <option value={moment(d).subtract(7, 'days').format('YYYY-MM-DD')}>7 days+</option>
                                <option value={moment(d).subtract(14, 'days').format('YYYY-MM-DD')}>14 days+</option>
                                <option value={moment(d).subtract(28, 'days').format('YYYY-MM-DD')}>28 days+</option>
                            </select>
                        </div>
                        {
                            ACData.employees
                                ?
                                ACData.employees.length > 0
                                    ?
                                    <table className='table mt-3'>
                                        <thead>
                                            <tr>
                                                <th>Sr.No</th>
                                                <th>
                                                    <div className='d-flex align-items-center'>
                                                        Employee
                                                        <div className='ml-2'>
                                                            <i onClick={() => sortArray('name', 1, 'string')} className="las la-chevron-up d-block" style={{ cursor: 'pointer' }}></i>
                                                            <i onClick={() => sortArray('name', 0, 'string')} className="las la-chevron-down d-block" style={{ cursor: 'pointer' }}></i>
                                                        </div>
                                                    </div>
                                                </th>
                                                <th>
                                                    <div className='d-flex align-items-center'>
                                                        Total Pending Balance
                                                        <div className='ml-2'>
                                                            <i onClick={() => sortArray('balance', 1, 'number')} className="las la-chevron-up d-block" style={{ cursor: 'pointer' }}></i>
                                                            <i onClick={() => sortArray('balance', 0, 'number')} className="las la-chevron-down d-block" style={{ cursor: 'pointer' }}></i>
                                                        </div>
                                                    </div>
                                                </th>
                                                <th>
                                                    <div className='d-flex align-items-center'>
                                                        Last Taken
                                                        <div className='ml-2'>
                                                            <i onClick={() => sortArray('last_updated', 1, 'date')} className="las la-chevron-up d-block" style={{ cursor: 'pointer' }}></i>
                                                            <i onClick={() => sortArray('last_updated', 0, 'date')} className="las la-chevron-down d-block" style={{ cursor: 'pointer' }}></i>
                                                        </div>
                                                    </div>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                Employees.map(
                                                    (val, index) => {
                                                        return (
                                                            <tr key={index} className='pointer pointer-hover' onClick={() => openACDetails(val.id)}>
                                                                <td>{val.id}</td>
                                                                <td>{val.name}</td>
                                                                <td className={parseInt(val.balance) === 0 ? "text-success" : "text-danger"}>PKR {val.balance.toLocaleString('en')}</td>
                                                                <td>{convertTZ(val.last_updated).toDateString() }</td>
                                                            </tr>
                                                        )
                                                    }
                                                )
                                            }
                                        </tbody>
                                    </table>
                                    :
                                    <h6 className='text-center'>No Record Found</h6>
                                :
                                <img src={loading} alt="loading..." width='50' height='50' className='d-block mx-auto' />
                        }
                    </div>
                </div>
                <div>
                    {AccessControls.access ? <Widget View={View} access={AccessControls.access} setView={setView} /> : null}
                </div>
            </div>
        </div>
    )
}

const ACContent = ({ history, Employee, Requests }) => {

    if (!Employee) {
        return <></>
    }

    return (
        <>
            <div className='d-flex align-items-end justify-content-between'>
                <div className='d-flex align-items-center'>
                    <img src={'images/employees/' + Employee.emp_image} alt="emp" width="50" height="50" className='rounded-circle' />
                    <div className='ml-2'>
                        <b>{Employee.name}</b><br />
                        <span>{Employee.designation_name} in  {Employee.company_name}</span>
                    </div>
                </div>
                <h6 style={{ fontSize: 16, fontFamily: "Exo" }} className='mb-0'><b>Remaining Balance: </b><span className='text-danger'>PKR {Employee.balance.toLocaleString('en')}</span></h6>
            </div>
            <table className='table mt-3'>
                <thead>
                    <tr>
                        <th>Sr.No</th>
                        <th>
                            <div className='d-flex align-items-center'>
                                Co & Loc
                                {/* <div className='ml-2'>
                                    <i onClick={ () => sortArray('name', 1, 'string') } className="las la-chevron-up d-block" style={{ cursor: 'pointer' }}></i>
                                    <i onClick={ () => sortArray('name', 0, 'string') } className="las la-chevron-down d-block" style={{ cursor: 'pointer' }}></i>
                                </div> */}
                            </div>
                        </th>
                        <th>
                            <div className='d-flex align-items-center'>
                                Amount
                                {/* <div className='ml-2'>
                                    <i onClick={ () => sortArray('balance', 1, 'number') } className="las la-chevron-up d-block" style={{ cursor: 'pointer' }}></i>
                                    <i onClick={ () => sortArray('balance', 0, 'number') } className="las la-chevron-down d-block" style={{ cursor: 'pointer' }}></i>
                                </div> */}
                            </div>
                        </th>
                        <th>
                            <div className='d-flex align-items-center'>
                                Recorded By
                                {/* <div className='ml-2'>
                                    <i onClick={ () => sortArray('last_updated', 1, 'date') } className="las la-chevron-up d-block" style={{ cursor: 'pointer' }}></i>
                                    <i onClick={ () => sortArray('last_updated', 0, 'date') } className="las la-chevron-down d-block" style={{ cursor: 'pointer' }}></i>
                                </div> */}
                            </div>
                        </th>
                        <th>
                            <div className='d-flex align-items-center'>
                                Status
                                {/* <div className='ml-2'>
                                    <i onClick={ () => sortArray('last_updated', 1, 'date') } className="las la-chevron-up d-block" style={{ cursor: 'pointer' }}></i>
                                    <i onClick={ () => sortArray('last_updated', 0, 'date') } className="las la-chevron-down d-block" style={{ cursor: 'pointer' }}></i>
                                </div> */}
                            </div>
                        </th>
                        <th>
                            <div className='d-flex align-items-center'>
                                Collected
                                {/* <div className='ml-2'>
                                    <i onClick={ () => sortArray('last_updated', 1, 'date') } className="las la-chevron-up d-block" style={{ cursor: 'pointer' }}></i>
                                    <i onClick={ () => sortArray('last_updated', 0, 'date') } className="las la-chevron-down d-block" style={{ cursor: 'pointer' }}></i>
                                </div> */}
                            </div>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {
                        Requests.map(
                            (val, index) => {
                                const recorded_date = val.recorded_date ? convertTZ(val.recorded_date).toDateString() : null;
                                return (
                                    <tr key={index} className='pointer pointer-hover' onClick={() => history.push('/cash/request/' + val.id)}>
                                        <td>{val.id}</td>
                                        <td>
                                            {val.code}<br />
                                            {val.location_name}
                                        </td>
                                        <td>PKR {val.amount.toLocaleString('en')}</td>
                                        <td>
                                            {val.record_emp_name}<br />
                                            {recorded_date}{val.recorded_time ? (" at " + moment(val.recorded_time, 'h:mm:ss a').format('hh:mm A')) : null}
                                        </td>
                                        <td>
                                            <div className='d-flex align-items-center'>
                                                <div
                                                    className={
                                                        "dot mr-1 "
                                                        +
                                                        (
                                                            val.status === 'approved' || val.status === 'cleared'
                                                                ?
                                                                "bg-success"
                                                                :
                                                                val.status === 'rejected'
                                                                    ?
                                                                    "bg-danger"
                                                                    :
                                                                    val.status === 'waiting for approval'
                                                                        ?
                                                                        "bg-warning"
                                                                        :
                                                                        val.status === 'issued'
                                                                            ?
                                                                            "bg-primary"
                                                                            :
                                                                            "bg-dark"
                                                        )
                                                    }
                                                ></div>
                                                <div
                                                    className={
                                                        "text-capitalize "
                                                        +
                                                        (
                                                            val.status === 'approved' || val.status === 'cleared'
                                                                ?
                                                                "text-success"
                                                                :
                                                                val.status === 'rejected'
                                                                    ?
                                                                    "text-danger"
                                                                    :
                                                                    val.status === 'waiting for approval'
                                                                        ?
                                                                        "text-warning"
                                                                        :
                                                                        val.status === 'issued'
                                                                            ?
                                                                            "text-primary"
                                                                            :
                                                                            "text-dark"
                                                        )
                                                    }
                                                >{val.status}</div>
                                            </div>
                                        </td>
                                        <td>
                                            {val.receival_date ? "Cash Collected" : "Not Collected"}
                                        </td>
                                    </tr>
                                )
                            }
                        )
                    }
                </tbody>
            </table>
        </>
    )
}

const Widget = ({ View, access, setView }) => {

    let inventoryAccessKey = false;
    let procurementAccessKey = false;
    let ACAccessKey = false;
    for (let y = 0; y < JSON.parse(access).length; y++) {
        if (parseInt(JSON.parse(access)[y]) === 23 || parseInt(JSON.parse(access)[y]) === 0) {
            inventoryAccessKey = true;
        }
        if (parseInt(JSON.parse(access)[y]) === 20 || parseInt(JSON.parse(access)[y]) === 0) {
            procurementAccessKey = true;
        }
        if (parseInt(JSON.parse(access)[y]) === 47 || parseInt(JSON.parse(access)[y]) === 0) {
            ACAccessKey = true;
        }
    }

    if (!inventoryAccessKey && !procurementAccessKey && !ACAccessKey) {
        return <></>;
    }

    return (
        <>
            <div className='Widget-container popUps'>
                <div className='page-content mb-3'>
                    <h5 className='mb-2'>My Favorites</h5>
                    <div className='card-1-grid grid grid-gap-1 grid-3-3-3 '>
                        <div className={View === 1 ? 'icon-div text-center active' : 'icon-div text-center'} onClick={() => setView(1)}>
                            <i className="las la-home"></i>
                            <p className='font-weight-bold mb-0'>Home</p>
                        </div>
                        {
                            inventoryAccessKey
                                ?
                                <div className={View === 2 ? 'icon-div text-center active' : 'icon-div text-center'} onClick={() => setView(2)}>
                                    <i className="lab la-dropbox"></i>
                                    <p className='font-weight-bold mb-0'>Inventory</p>
                                </div>
                                : null
                        }
                        {
                            ACAccessKey
                                ?
                                <div className={View === 3 ? 'icon-div text-center active' : 'icon-div text-center'} onClick={() => setView(3)}>
                                    <i className="las la-wallet"></i>
                                    <p className='font-weight-bold mb-0'>Advance Cash</p>
                                </div>
                                : null
                        }
                        {/* {
                            procurementAccessKey
                            ?
                            <div className={ View === 1 ? 'icon-div text-center active' : 'icon-div text-center' }>
                                <i className="las la-money-check-alt"></i>
                                <p className='font-weight-bold mb-0'>Procurement</p>
                            </div>
                            :null
                        } */}
                        {/* <div className={ View === 1 ? 'icon-div text-center active' : 'icon-div text-center' }>
                            <i className="las la-id-card"></i>
                            <p className='font-weight-bold mb-0'>Leaves</p>
                        </div>
                        <div className={ View === 1 ? 'icon-div text-center active' : 'icon-div text-center' }>
                            <i className="las la-shopping-bag"></i>
                            <p className='font-weight-bold mb-0'>Item Requests</p>
                        </div>
                        <div className={ View === 1 ? 'icon-div text-center active' : 'icon-div text-center' }>
                            <i className="lar la-calendar-alt"></i>
                            <p className='font-weight-bold mb-0'>Attendance</p>
                        </div> */}
                    </div>

                </div>
                {/* <div className='Widget-card-2 page-content mb-3'>
                    <div className='feedback-div'>
                        <p className='font-weight-bolder'>Please Give us your kind Feedback</p>
                        <textarea className='form-control' name="" id="" cols="30" rows="2"></textarea>
                    </div>
                </div> */}
                {/* <div className='page-content mb-3'>
                    <p className='font-weight-bolder'>Meetings</p>
                    <div className='border-bottom border-top p-1'>
                        <p className='mb-2'>16, May 2023</p>
                        <div className='d-flex justify-content-between align-items-center'>
                            <p className='mb-0 font-weight-bolder'>Meeting topic</p>
                            <p className='mb-0'>Portal Presentation</p>
                        </div>
                        <div className='d-flex justify-content-between align-items-center'>
                            <p className='mb-0 font-weight-bolder'>Meeting Time</p>
                            <p className='mb-0'>09:00 to 10:00</p>
                        </div>
                    </div>
                </div> */}
            </div>
        </>
    )
}