/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import './Style.css';

import moment from 'moment';
import CanvasJSReact from '../../../../../canvasjs.react';
import loading from '../../../../../images/loadingIcons/icons8-iphone-spinner.gif';

// import "https://cdn.dribbble.com/users/6234/screenshots/16550123/media/67f0d3ab601bdbab51d89e591b3e9abd.png?compress=1&resize=1000x750&vertical=top" from '../../../../../images/img1.jpg';
// import weathericon from '../../../../../images/weather-icon.png';

import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

import { useHistory } from 'react-router-dom';

const UI = ({ InventoryData, View, HomeData, AccessControls, WeatherData, setView, loadData }) => {

    const history = useHistory();
    const key = 'real secret keys should be long and random';
    const encryptor = require('simple-encryptor')(key);
    const CanvasJSChart = CanvasJSReact.CanvasJSChart;
    const [value, onChange] = useState(new Date());

    return (
        <>
            <div className='page homepage'>
                {
                    View === 1
                    ?
                    <HomeView
                        WeatherData={WeatherData}
                        AccessControls={ AccessControls }
                        CanvasJSChart={ CanvasJSChart }
                        value={value}
                        HomeData={ HomeData }
                        encryptor={ encryptor }
                        history={ history }
                        View={ View }

                        setView={ setView }
                        loadData={ loadData }
                        onChange={onChange}
                    />
                    :
                    <InventoryView 
                        AccessControls={ AccessControls }
                        CanvasJSChart={ CanvasJSChart }
                        View={ View }
                        InventoryData={ InventoryData }

                        setView={ setView }
                    />
                }
            </div>
        </>
    )

}

export default UI;

const InventoryView = ({ InventoryData, View, CanvasJSChart, AccessControls, setView }) => {

    // const outwardAvg = (InventoryData.total_outward_quantity/InventoryData.total_inward_quantity*100).toFixed(2);
    // const inwardAvg = (InventoryData.total_inward_quantity/InventoryData.total_stored_quantity*100).toFixed(2);  
    let data = [];

    if ( InventoryData && InventoryData.products_type_data )
    {
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
    if ( InventoryData && InventoryData.products_issued_data )
    {
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
    if ( InventoryData && InventoryData.products_pending_issued_data )
    {
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
    if ( InventoryData && InventoryData.products_pending_preview_data )
    {
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
        title:{
            text: "Your Monthly Attendance Summery"
        },
        axisX: {
            title: "",
            reversed: true,
        },
        // axisY: {
        //     title: monthNames[new Date().getMonth()+1],
        //     includeZero: true
        // },
        toolTip:{
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
                                <h3 className='font-weight-bold mb-0'>{ InventoryData.total_products }</h3>
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
                                    <div>{ InventoryData.total_inward_quantity }</div>
                                    <div className='ml-1'>
                                        <Tippy content={<span>Total Inward Value</span>}>
                                            <div style={{fontSize: '12px', cursor: 'default'}}>PKR { InventoryData.total_inward_value.toLocaleString('en') }</div>
                                        </Tippy>
                                        <Tippy content={<span>Inward Entries</span>}>
                                            <div style={{fontSize: '12px', cursor: 'default'}}>{ InventoryData.total_inward_entries }</div>
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
                                    <div>{ InventoryData.total_outward_quantity }</div>
                                    <div className='ml-1'>
                                        <Tippy content={<span>Total Outward Value</span>}>
                                            <div style={{fontSize: '12px', cursor: 'default'}}>PKR { InventoryData.total_outward_value.toLocaleString('en') }</div>
                                        </Tippy>
                                        <Tippy content={<span>Outward Entries</span>}>
                                            <div style={{fontSize: '12px', cursor: 'default'}}>{ InventoryData.total_outward_entries }</div>
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
                                    <div>{ InventoryData.total_stored_quantity }</div>
                                    <div className='ml-1'>
                                        <Tippy content={<span>Total Stored Value</span>}>
                                            <div style={{fontSize: '12px', cursor: 'default'}}>PKR { InventoryData.total_stored_value.toLocaleString('en') }</div>
                                        </Tippy>
                                        <div style={{fontSize: '12px', cursor: 'default', opacity: 0}}>XXX</div>
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
                    { AccessControls.access ? <Widget View={ View } access={ AccessControls.access } setView={ setView } /> : null}
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
                                                ( val, index ) => {
                                                    return (
                                                        <tr key={index}>
                                                            <td>
                                                                <div className='d-flex align-items-center'>
                                                                    <div className='number mr-3'>
                                                                        <i className="las la-arrow-down"></i>
                                                                    </div>
                                                                    <span>{ val.name }</span>
                                                                </div>
                                                            </td>
                                                            <td className='text-right'>
                                                                <span className='number text-success'>{ val.quantity }</span>
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
                                                ( val, index ) => {
                                                    return (
                                                        <tr key={index}>
                                                            <td>
                                                                <div className='d-flex align-items-center'>
                                                                    <div className='number mr-3'>
                                                                        <i className="las la-arrow-down"></i>
                                                                    </div>
                                                                    <span>{ val.name }</span>
                                                                </div>
                                                            </td>
                                                            <td className='text-right'>
                                                                <span className='number text-danger'>{ val.quantity }</span>
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

const Widget = ({ View, access, setView }) => {

    let inventoryAccessKey = false;
    let procurementAccessKey = false;
    for ( let y = 0; y < JSON.parse(access).length; y++ )
    {
        if ( parseInt(JSON.parse(access)[y]) === 23 || parseInt(JSON.parse(access)[y]) === 0 )
        {
            inventoryAccessKey = true;
        }
        if ( parseInt(JSON.parse(access)[y]) === 20 || parseInt(JSON.parse(access)[y]) === 0 )
        {
            procurementAccessKey = true;
        }
    }

    if ( !inventoryAccessKey )
    {
        return <></>;
    }

    return (
        <>
            <div className='Widget-container popUps'>
                <div className='page-content mb-3'>
                    <h5 className='mb-2'>My Favorites</h5>
                    <div className='card-1-grid grid grid-gap-1 grid-3-3-3 '>
                        <div className={ View === 1 ? 'icon-div text-center active' : 'icon-div text-center' } onClick={ () => setView(1) }>
                            <i className="las la-home"></i>
                            <p className='font-weight-bold mb-0'>Home</p>
                        </div>
                        {
                            inventoryAccessKey
                            ?
                            <div className={ View === 2 ? 'icon-div text-center active' : 'icon-div text-center' } onClick={ () => setView(2) }>
                                <i className="lab la-dropbox"></i>
                                <p className='font-weight-bold mb-0'>Inventory</p>
                            </div>
                            :null
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
        height: HomeData ? HomeData.monthly_attendance_summery.map(() => {return height = height + 50}).pop() : 0,
        title:{
            text: "Your Monthly Attendance Summery"
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
    if ( d.getHours() > 5 && d.getHours() <= 12 )
    {
        message = "Good Morning";
    }
    if ( d.getHours() > 12 && d.getHours() <= 17 )
    {
        message = "Good Afternoon";
    }
    if ( d.getHours() > 17 )
    {
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
                                                { WeatherData.temp }
                                            </h4>
                                            <h4 className="mb-0 font-weight-bold">
                                                <i className="las la-tint mr-2"></i>
                                                { WeatherData.humidity }
                                            </h4>
                                            <h4 className="mb-2 font-weight-bold">
                                                <i className="las la-wind mr-2"></i>
                                                { WeatherData.wind_speed }
                                            </h4>
                                            <p className="mb-0 font-weight-bold">{ WeatherData.day }, { WeatherData.current_time }</p>
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
                                        <h5>{ AccessControls.name }</h5>
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
                                            <td>{ HomeData.todays_attendance[0] && HomeData.todays_attendance[0].time_in? moment(HomeData.todays_attendance[0].time_in,'h:mm:ss a').format('hh:mm A') : 'no time in' }</td>
                                        </tr>
                                        <tr>
                                            <th>Break in</th>
                                            <td>{ HomeData.todays_attendance[0] && HomeData.todays_attendance[0].break_in? moment(HomeData.todays_attendance[0].break_in,'h:mm:ss a').format('hh:mm A') : 'no break in' }</td>
                                        </tr>
                                        <tr>
                                            <th>Break out</th>
                                            <td>{ HomeData.todays_attendance[0] && HomeData.todays_attendance[0].break_out? moment(HomeData.todays_attendance[0].break_out,'h:mm:ss a').format('hh:mm A') : 'no break out' }</td>
                                        </tr>
                                        <tr>
                                            <th>Time out</th>
                                            <td>{ HomeData.todays_attendance[0] && HomeData.todays_attendance[0].time_out? moment(HomeData.todays_attendance[0].time_out,'h:mm:ss a').format('hh:mm A') : 'no time out' }</td>
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
                    { AccessControls.access ? <Widget View={ View } access={ AccessControls.access } setView={ setView } /> : null}
                    <div className='page-content mb-3'>
                        <h5 className='mb-3'>Recent Chats</h5>
                        {
                            HomeData && HomeData.last_chats
                            ?
                            HomeData.last_chats.length === 0 ? <h6 className='text-center'>No Chat Found</h6> :
                            HomeData.last_chats.map(
                                ( val, index ) => {
                                    return (
                                        <div key={index} className='d-flex align-items-center border-bottom border-top py-1 pointer' onClick={ () => history.push('/chat') }>
                                            <img src={'/images/employees/' + val.emp_image} alt=""
                                                width="40"
                                                height="40"
                                                className="rounded-circle border" />

                                            <div className='p-1'>
                                                <p className='font-weight-bolder mb-0'>{ val.sender }</p>
                                                <p className='mb-0' style={{ wordBreak: 'break-word' }}>{ encryptor.decrypt(val.chat_body) }</p>
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