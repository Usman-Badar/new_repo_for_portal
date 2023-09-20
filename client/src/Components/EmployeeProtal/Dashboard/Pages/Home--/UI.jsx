/* eslint-disable eqeqeq */
import React from 'react';
import './Style.css';

import CanvasJSReact from '../../../../../canvasjs.react';
import loading from '../../../../../images/loadingIcons/icons8-iphone-spinner.gif';

function UI({ RequestByOrTo, Leaves, LeaveData, LeaveType, setRequestByOrTo, setLeaveType, setGroupBy }) {

    const CanvasJSChart = CanvasJSReact.CanvasJSChart;
    let optionsForLeavesChart = {};

    if ( LeaveData && Leaves )
    {
        optionsForLeavesChart = {
            animationEnabled: true,
            title: false,
            height: 140,
            subtitles: false,
            legend: {
                horizontalAlign: "right", // "center" , "right"
                verticalAlign: "center",  // "top" , "bottom"
                fontSize: 14
            },
            data: [{
                type: "doughnut",
                showInLegend: true,
                indexLabel: false,
                // yValueFormatString: "#,###'%'",
                dataPoints: RequestByOrTo == '0' ? Leaves.leaves_by_you : Leaves.leaves_to_you
            }]
        }
    }

    const optionsForItemRequests = {
        animationEnabled: true,
        title: false,
        subtitles: false,
        height: 200,
        legend: {
            horizontalAlign: "center", // "center" , "right"
            verticalAlign: "top",  // "top" , "bottom"
            fontSize: 14
        },
        data: [
            {
                type: "spline",
                name: "Approved",
                showInLegend: true,
                indexLabel: false,
                color: "#28A744",
                dataPoints: [
                    { y: 155, label: "Jan", markerSize: 5 },
                    { y: 150, label: "Feb", markerSize: 5 },
                    { y: 152, label: "Mar", markerSize: 5 },
                    { y: 148, label: "Apr", markerSize: 5 },
                    { y: 142, label: "May", markerSize: 5 },
                ]
            },
            {
                type: "spline",
                name: "Rejected",
                showInLegend: true,
                indexLabel: false,
                color: "#DC3545",
                dataPoints: [
                    { y: 172, label: "Jan", markerSize: 5 },
                    { y: 173, label: "Feb", markerSize: 5 },
                    { y: 175, label: "Mar", markerSize: 5 },
                    { y: 172, label: "Apr", markerSize: 5 },
                    { y: 162, label: "May", markerSize: 5 },
                ]
            },
            {
                type: "spline",
                name: "Pendings",
                showInLegend: true,
                indexLabel: false,
                color: "#FFC107",
                dataPoints: [
                    { y: 72, label: "Jan", markerSize: 5 },
                    { y: 73, label: "Feb", markerSize: 5 },
                    { y: 75, label: "Mar", markerSize: 5 },
                    { y: 72, label: "Apr", markerSize: 5 },
                    { y: 62, label: "May", markerSize: 5 },
                ]
            }
        ]
    }

    return (
        <>
            <div className="dashboard_homepage page">
                <div className='d-flex justify-content-end align-items-center mb-3'>
                    <div className='d-flex justify-content-end align-items-center'>
                        <div>Owned</div>
                        <label class="switch mb-0 mx-2">
                            <input type="checkbox" />
                            <span class="slider"></span>
                        </label>
                        <div>Admin</div>
                    </div>
                </div>
                <div className='grid-2 g-gap-20'>
                    <div>
                        <div className='page-content mb-3'>
                            {
                                LeaveData
                                ?
                                <>
                                    <div className='d-flex align-items-center justify-content-between'>
                                        <h4 className='font-weight-bold'>Leave Requests</h4>
                                        <select className='form-control' style={{ width: 'fit-content' }} value={ LeaveType } onChange={ (e) => setLeaveType(e.target.value) }>
                                            <option value="leaves" selected={ LeaveType === 'leaves' }>Leaves</option>
                                            <option value="short leaves" selected={ LeaveType === 'short leaves' }>Short Leaves</option>
                                        </select>
                                    </div>
                                    <hr />
                                    <div className='grid-2'>
                                        <div className='p-3 bg-light inner-shadow'>
                                            <i className="las la-file-invoice la-2x"></i><br />
                                            <h6 className='text-secondary mb-3'>Total leave requests</h6>
                                            <div className='d-flex align-items-center justify-content-between'>
                                                <h4 className='mb-0 font-weight-bold'>{ LeaveData.total_leaves_sent }</h4>
                                                <p className='mb-0 text-secondary'>Sent</p>
                                            </div>
                                            <div className='d-flex align-items-center justify-content-between'>
                                                <h4 className='mb-0 font-weight-bold'>{ LeaveData.total_leaves_received }</h4>
                                                <p className='mb-0 text-secondary'>Received</p>
                                            </div>
                                        </div>
                                        <div>
                                            <div className='navs'>
                                                <select className='nav-items' onChange={ (e) => setRequestByOrTo(e.target.value) }>
                                                    <option value='0'>Requested</option>
                                                    <option value='1'>Received</option>
                                                </select>
                                                {/* <select className='nav-items' onChange={ (e) => setGroupBy(e.target.value) }>
                                                    <option value="1">Group by status</option>
                                                    <option value="2">Group by type</option>
                                                    <option value="3">Group by availed/not availed</option>
                                                    <option value="4">Group by single-day/multiple-days</option>
                                                </select> */}
                                            </div>
                                            {
                                                Leaves ? <div className='chart-div leaves bg-white popUps'><CanvasJSChart options={optionsForLeavesChart} /></div> : <div className='text-center pt-4'><img src={loading} alt="Loading..." width='50' height='50' /></div>
                                            }
                                        </div>
                                    </div>
                                    <div className='mb-1 mt-3 d-flex justify-content-between align-items-center'>
                                        <h6 className='mb-0'>Leave Requests (20)</h6>
                                        <p className='mb-0 badging badging-warning pill px-3'>Pendings</p>
                                    </div>
                                    <div className='list-container'>
                                        <table className='table table-hover'>
                                            <thead>
                                                <tr>
                                                    <th>Sr.No</th>
                                                    <th>Description</th>
                                                    <th>Date</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr className='pointer'>
                                                    <td>1</td>
                                                    <td>Due to my brother's accident... I need one day's leave, kindly accept. Yours truly. Usman Badar</td>
                                                    <td>10 May 2023</td>
                                                </tr>
                                                <tr className='pointer'>
                                                    <td>1</td>
                                                    <td>Due to my brother's accident... I need one day's leave, kindly accept. Yours truly. Usman Badar</td>
                                                    <td>10 May 2023</td>
                                                </tr>
                                                <tr className='pointer'>
                                                    <td>1</td>
                                                    <td>Due to my brother's accident... I need one day's leave, kindly accept. Yours truly. Usman Badar</td>
                                                    <td>10 May 2023</td>
                                                </tr>
                                                <tr className='pointer'>
                                                    <td>1</td>
                                                    <td>Due to my brother's accident... I need one day's leave, kindly accept. Yours truly. Usman Badar</td>
                                                    <td>10 May 2023</td>
                                                </tr>
                                                <tr className='pointer'>
                                                    <td>1</td>
                                                    <td>Due to my brother's accident... I need one day's leave, kindly accept. Yours truly. Usman Badar</td>
                                                    <td>10 May 2023</td>
                                                </tr>
                                                <tr className='pointer'>
                                                    <td>1</td>
                                                    <td>Due to my brother's accident... I need one day's leave, kindly accept. Yours truly. Usman Badar</td>
                                                    <td>10 May 2023</td>
                                                </tr>
                                                <tr className='pointer'>
                                                    <td>1</td>
                                                    <td>Due to my brother's accident... I need one day's leave, kindly accept. Yours truly. Usman Badar</td>
                                                    <td>10 May 2023</td>
                                                </tr>
                                                <tr className='pointer'>
                                                    <td>1</td>
                                                    <td>Due to my brother's accident... I need one day's leave, kindly accept. Yours truly. Usman Badar</td>
                                                    <td>10 May 2023</td>
                                                </tr>
                                                <tr className='pointer'>
                                                    <td>1</td>
                                                    <td>Due to my brother's accident... I need one day's leave, kindly accept. Yours truly. Usman Badar</td>
                                                    <td>10 May 2023</td>
                                                </tr>
                                                <tr className='pointer'>
                                                    <td>1</td>
                                                    <td>Due to my brother's accident... I need one day's leave, kindly accept. Yours truly. Usman Badar</td>
                                                    <td>10 May 2023</td>
                                                </tr>
                                                <tr className='pointer'>
                                                    <td>1</td>
                                                    <td>Due to my brother's accident... I need one day's leave, kindly accept. Yours truly. Usman Badar</td>
                                                    <td>10 May 2023</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </>
                                :
                                <div className='text-center'><img src={loading} alt="Loading..." width='50' height='50' /></div>
                            }
                        </div>
                    </div>
                    <div>
                        <div className='page-content'>
                            <h4 className='font-weight-bold'>Item Requests</h4>
                            <hr />
                            <div className='grid-2-3 g-gap-20'>
                                <div className='p-3 border rounded'>
                                    <i className="las la-exchange-alt la-2x"></i><br />
                                    <h6 className='text-secondary mb-3'>Total Requests</h6>
                                    <div className='d-flex align-items-center justify-content-between'>
                                        <h4 className='mb-0 font-weight-bold'>200</h4>
                                        <p className='mb-0 text-secondary'>Sent</p>
                                    </div>
                                    <div className='d-flex align-items-center justify-content-between'>
                                        <h4 className='mb-0 font-weight-bold'>87</h4>
                                        <p className='mb-0 text-secondary'>Received</p>
                                    </div>
                                    <div className='d-flex align-items-center justify-content-between'>
                                        <h4 className='mb-0 font-weight-bold'>10000</h4>
                                        <p className='mb-0 text-secondary'>Item Issued</p>
                                    </div>
                                </div>
                                <div className='chart-div item_requests bg-white'>
                                    <div className=''></div>
                                    <CanvasJSChart options={optionsForItemRequests} />
                                </div>
                            </div>
                            <div className='mb-1 mt-3 d-flex justify-content-between align-items-center'>
                                <h6 className='mb-0'>Item Requests (17)</h6>
                                <p className='mb-0 badging badging-warning pill px-3'>Pendings</p>
                            </div>
                            <div className='list-container'>
                                <table className='table table-hover'>
                                    <thead>
                                        <tr>
                                            <th>Sr.No</th>
                                            <th>Com & Loc</th>
                                            <th>Requested By</th>
                                            <th>Date & Time</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className='pointer'>
                                            <td>1</td>
                                            <td>
                                                Seaboard Logistics<br />
                                                Headoffice
                                            </td>
                                            <td>Usman Badar</td>
                                            <td>10 May 2023</td>
                                        </tr>
                                        <tr className='pointer'>
                                            <td>1</td>
                                            <td>
                                                Seaboard Logistics<br />
                                                Headoffice
                                            </td>
                                            <td>Usman Badar</td>
                                            <td>10 May 2023</td>
                                        </tr>
                                        <tr className='pointer'>
                                            <td>1</td>
                                            <td>
                                                Seaboard Logistics<br />
                                                Headoffice
                                            </td>
                                            <td>Usman Badar</td>
                                            <td>10 May 2023</td>
                                        </tr>
                                        <tr className='pointer'>
                                            <td>1</td>
                                            <td>
                                                Seaboard Logistics<br />
                                                Headoffice
                                            </td>
                                            <td>Usman Badar</td>
                                            <td>10 May 2023</td>
                                        </tr>
                                        <tr className='pointer'>
                                            <td>1</td>
                                            <td>
                                                Seaboard Logistics<br />
                                                Headoffice
                                            </td>
                                            <td>Usman Badar</td>
                                            <td>10 May 2023</td>
                                        </tr>
                                        <tr className='pointer'>
                                            <td>1</td>
                                            <td>
                                                Seaboard Logistics<br />
                                                Headoffice
                                            </td>
                                            <td>Usman Badar</td>
                                            <td>10 May 2023</td>
                                        </tr>
                                        <tr className='pointer'>
                                            <td>1</td>
                                            <td>
                                                Seaboard Logistics<br />
                                                Headoffice
                                            </td>
                                            <td>Usman Badar</td>
                                            <td>10 May 2023</td>
                                        </tr>
                                        <tr className='pointer'>
                                            <td>1</td>
                                            <td>
                                                Seaboard Logistics<br />
                                                Headoffice
                                            </td>
                                            <td>Usman Badar</td>
                                            <td>10 May 2023</td>
                                        </tr>
                                        <tr className='pointer'>
                                            <td>1</td>
                                            <td>
                                                Seaboard Logistics<br />
                                                Headoffice
                                            </td>
                                            <td>Usman Badar</td>
                                            <td>10 May 2023</td>
                                        </tr>
                                        <tr className='pointer'>
                                            <td>1</td>
                                            <td>
                                                Seaboard Logistics<br />
                                                Headoffice
                                            </td>
                                            <td>Usman Badar</td>
                                            <td>10 May 2023</td>
                                        </tr>
                                        <tr className='pointer'>
                                            <td>1</td>
                                            <td>
                                                Seaboard Logistics<br />
                                                Headoffice
                                            </td>
                                            <td>Usman Badar</td>
                                            <td>10 May 2023</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default UI;