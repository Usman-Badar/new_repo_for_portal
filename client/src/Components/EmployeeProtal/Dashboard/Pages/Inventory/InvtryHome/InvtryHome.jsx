import React from 'react';

import './InvtryHome.css';
import { Bar, Line, Pie, Radar, PolarArea, Doughnut, Bubble, Scatter } from 'react-chartjs-2';
import { useSelector } from 'react-redux';

const InvtryHome = () => {

    const AccessControls = useSelector( ( state ) => state.EmpAuth.EmployeeData );

    const ChartData = {
        labels: [ 'Qasim Freight Station', 'Seaboard Logistics', 'Seaboard Services' ],
        datasets: [
            {
                label: 'Requests for the month',
                data: [
                    10,
                    20,
                    30
                ],
                backgroundColor: [
                    '#007BFF',
                    '#17A2B8',
                    '#343A40'
                ]
            }
        ]
    }

    return (
        <>
            <div className="InvtryHome">
                <div>
                    {
                        AccessControls.access ? JSON.parse(AccessControls.access).includes(504) || JSON.parse(AccessControls.access).includes(1)
                            ?
                            <div className="New_PR_Requests">
                                <h3 className="mb-4"> New PR Requests </h3>
                                <div className="lists">
                                    <div className="one">
                                        <div className="d-flex">
                                            <div className="d-flex justify-content-center align-items-center">
                                                <img alt="imgs" src={'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThLP6xJXBY_W2tT5waakogfnpHk4uhpVTy7A&usqp=CAU'} alt="Image" />
                                            </div>
                                            <div className="d-flex align-items-center">
                                                <div>
                                                    <p className="mb-0 font-weight-bold">Name</p>
                                                    <p className="mb-0">Location</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="d-flex align-items-center Text">
                                            <div>
                                                <p className="mb-0 font-weight-bold">Description</p>
                                                <p className="mb-0">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,</p>
                                            </div>
                                        </div>
                                        <div className="d-flex align-items-center">
                                            <div>
                                                <p className="mb-0 font-weight-bold">Status</p>
                                                <p className="mb-0">Approved</p>
                                            </div>
                                        </div>
                                        <div className="d-flex align-items-center">
                                            <div>
                                                <p className="mb-0 font-weight-bold">Time Remaining</p>
                                                <p className="mb-0">20:00</p>
                                            </div>
                                        </div>
                                        <div className="d-flex align-items-center">
                                            <div>
                                                <p className="mb-0 font-weight-bold">Date</p>
                                                <p className="mb-0">24 September 2021 at 12:00 PM</p>
                                            </div>
                                        </div>
                                        <div className="ShowOnHover">
                                            {/* <a href="#" title="Delete"><i class="las la-trash"></i></a> */}
                                        </div>
                                    </div>
                                    <div className="one">
                                        <div className="d-flex">
                                            <div className="d-flex justify-content-center align-items-center">
                                                <img alt="123" src={'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThLP6xJXBY_W2tT5waakogfnpHk4uhpVTy7A&usqp=CAU'} alt="Image" />
                                            </div>
                                            <div className="d-flex align-items-center">
                                                <div>
                                                    <p className="mb-0 font-weight-bold">Name</p>
                                                    <p className="mb-0">Location</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="d-flex align-items-center Text">
                                            <div>
                                                <p className="mb-0 font-weight-bold">Description</p>
                                                <p className="mb-0">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,</p>
                                            </div>
                                        </div>
                                        <div className="d-flex align-items-center">
                                            <div>
                                                <p className="mb-0 font-weight-bold">Status</p>
                                                <p className="mb-0">Approved</p>
                                            </div>
                                        </div>
                                        <div className="d-flex align-items-center">
                                            <div>
                                                <p className="mb-0 font-weight-bold">Time Remaining</p>
                                                <p className="mb-0">20:00</p>
                                            </div>
                                        </div>
                                        <div className="d-flex align-items-center">
                                            <div>
                                                <p className="mb-0 font-weight-bold">Date</p>
                                                <p className="mb-0">24 September 2021 at 12:00 PM</p>
                                            </div>
                                        </div>
                                        <div className="ShowOnHover">
                                            {/* <a href="#" title="Delete"><i class="las la-trash"></i></a> */}
                                        </div>
                                    </div>
                                    <div className="one">
                                        <div className="d-flex">
                                            <div className="d-flex justify-content-center align-items-center">
                                                <img alt='imgs' src={'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThLP6xJXBY_W2tT5waakogfnpHk4uhpVTy7A&usqp=CAU'} alt="Image" />
                                            </div>
                                            <div className="d-flex align-items-center">
                                                <div>
                                                    <p className="mb-0 font-weight-bold">Name</p>
                                                    <p className="mb-0">Location</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="d-flex align-items-center Text">
                                            <div>
                                                <p className="mb-0 font-weight-bold">Description</p>
                                                <p className="mb-0">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,</p>
                                            </div>
                                        </div>
                                        <div className="d-flex align-items-center">
                                            <div>
                                                <p className="mb-0 font-weight-bold">Status</p>
                                                <p className="mb-0">Approved</p>
                                            </div>
                                        </div>
                                        <div className="d-flex align-items-center">
                                            <div>
                                                <p className="mb-0 font-weight-bold">Time Remaining</p>
                                                <p className="mb-0">20:00</p>
                                            </div>
                                        </div>
                                        <div className="d-flex align-items-center">
                                            <div>
                                                <p className="mb-0 font-weight-bold">Date</p>
                                                <p className="mb-0">24 September 2021 at 12:00 PM</p>
                                            </div>
                                        </div>
                                        <div className="ShowOnHover">
                                            {/* <a href="#" title="Delete"><i class="las la-trash"></i></a> */}
                                        </div>
                                    </div>
                                    <div className="one">
                                        <div className="d-flex">
                                            <div className="d-flex justify-content-center align-items-center">
                                                <img src={'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThLP6xJXBY_W2tT5waakogfnpHk4uhpVTy7A&usqp=CAU'} alt="Image" />
                                            </div>
                                            <div className="d-flex align-items-center">
                                                <div>
                                                    <p className="mb-0 font-weight-bold">Name</p>
                                                    <p className="mb-0">Location</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="d-flex align-items-center Text">
                                            <div>
                                                <p className="mb-0 font-weight-bold">Description</p>
                                                <p className="mb-0">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,</p>
                                            </div>
                                        </div>
                                        <div className="d-flex align-items-center">
                                            <div>
                                                <p className="mb-0 font-weight-bold">Status</p>
                                                <p className="mb-0">Approved</p>
                                            </div>
                                        </div>
                                        <div className="d-flex align-items-center">
                                            <div>
                                                <p className="mb-0 font-weight-bold">Time Remaining</p>
                                                <p className="mb-0">20:00</p>
                                            </div>
                                        </div>
                                        <div className="d-flex align-items-center">
                                            <div>
                                                <p className="mb-0 font-weight-bold">Date</p>
                                                <p className="mb-0">24 September 2021 at 12:00 PM</p>
                                            </div>
                                        </div>
                                        <div className="ShowOnHover">
                                            {/* <a href="#" title="Delete"><i class="las la-trash"></i></a> */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            :
                            null
                            :
                            null
                    }

                    {
                        AccessControls.access ? JSON.parse(AccessControls.access).includes(505) || JSON.parse(AccessControls.access).includes(1)
                        ?
                            <div className="New_PO_Requests">
                                <h3 className="mb-4"> PO Requests </h3>
                                <div className="lists">
                                    <div className="one">
                                        <div className="d-flex">
                                            <div className="d-flex justify-content-center align-items-center">
                                                <img src={'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThLP6xJXBY_W2tT5waakogfnpHk4uhpVTy7A&usqp=CAU'} alt="Image" />
                                            </div>
                                            <div className="d-flex align-items-center">
                                                <div>
                                                    <p className="mb-0 font-weight-bold">Name</p>
                                                    <p className="mb-0">Location</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="d-flex align-items-center Text">
                                            <div>
                                                <p className="mb-0 font-weight-bold">Description</p>
                                                <p className="mb-0">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,</p>
                                            </div>
                                        </div>
                                        <div className="d-flex align-items-center">
                                            <div>
                                                <p className="mb-0 font-weight-bold">Status</p>
                                                <p className="mb-0">Approved</p>
                                            </div>
                                        </div>
                                        <div className="d-flex align-items-center">
                                            <div>
                                                <p className="mb-0 font-weight-bold">Time Remaining</p>
                                                <p className="mb-0">20:00</p>
                                            </div>
                                        </div>
                                        <div className="d-flex align-items-center">
                                            <div>
                                                <p className="mb-0 font-weight-bold">Date</p>
                                                <p className="mb-0">24 September 2021 at 12:00 PM</p>
                                            </div>
                                        </div>
                                        <div className="ShowOnHover">
                                            <a href="#" title="Delete"><i class="las la-trash"></i></a>
                                        </div>
                                    </div>
                                    <div className="one">
                                        <div className="d-flex">
                                            <div className="d-flex justify-content-center align-items-center">
                                                <img src={'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThLP6xJXBY_W2tT5waakogfnpHk4uhpVTy7A&usqp=CAU'} alt="Image" />
                                            </div>
                                            <div className="d-flex align-items-center">
                                                <div>
                                                    <p className="mb-0 font-weight-bold">Name</p>
                                                    <p className="mb-0">Location</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="d-flex align-items-center Text">
                                            <div>
                                                <p className="mb-0 font-weight-bold">Description</p>
                                                <p className="mb-0">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,</p>
                                            </div>
                                        </div>
                                        <div className="d-flex align-items-center">
                                            <div>
                                                <p className="mb-0 font-weight-bold">Status</p>
                                                <p className="mb-0">Approved</p>
                                            </div>
                                        </div>
                                        <div className="d-flex align-items-center">
                                            <div>
                                                <p className="mb-0 font-weight-bold">Time Remaining</p>
                                                <p className="mb-0">20:00</p>
                                            </div>
                                        </div>
                                        <div className="d-flex align-items-center">
                                            <div>
                                                <p className="mb-0 font-weight-bold">Date</p>
                                                <p className="mb-0">24 September 2021 at 12:00 PM</p>
                                            </div>
                                        </div>
                                        <div className="ShowOnHover">
                                            <a href="#" title="Delete"><i class="las la-trash"></i></a>
                                        </div>
                                    </div>
                                    <div className="one">
                                        <div className="d-flex">
                                            <div className="d-flex justify-content-center align-items-center">
                                                <img src={'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThLP6xJXBY_W2tT5waakogfnpHk4uhpVTy7A&usqp=CAU'} alt="Image" />
                                            </div>
                                            <div className="d-flex align-items-center">
                                                <div>
                                                    <p className="mb-0 font-weight-bold">Name</p>
                                                    <p className="mb-0">Location</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="d-flex align-items-center Text">
                                            <div>
                                                <p className="mb-0 font-weight-bold">Description</p>
                                                <p className="mb-0">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,</p>
                                            </div>
                                        </div>
                                        <div className="d-flex align-items-center">
                                            <div>
                                                <p className="mb-0 font-weight-bold">Status</p>
                                                <p className="mb-0">Approved</p>
                                            </div>
                                        </div>
                                        <div className="d-flex align-items-center">
                                            <div>
                                                <p className="mb-0 font-weight-bold">Time Remaining</p>
                                                <p className="mb-0">20:00</p>
                                            </div>
                                        </div>
                                        <div className="d-flex align-items-center">
                                            <div>
                                                <p className="mb-0 font-weight-bold">Date</p>
                                                <p className="mb-0">24 September 2021 at 12:00 PM</p>
                                            </div>
                                        </div>
                                        <div className="ShowOnHover">
                                            <a href="#" title="Delete"><i class="las la-trash"></i></a>
                                        </div>
                                    </div>
                                    <div className="one">
                                        <div className="d-flex">
                                            <div className="d-flex justify-content-center align-items-center">
                                                <img src={'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThLP6xJXBY_W2tT5waakogfnpHk4uhpVTy7A&usqp=CAU'} alt="Image" />
                                            </div>
                                            <div className="d-flex align-items-center">
                                                <div>
                                                    <p className="mb-0 font-weight-bold">Name</p>
                                                    <p className="mb-0">Location</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="d-flex align-items-center Text">
                                            <div>
                                                <p className="mb-0 font-weight-bold">Description</p>
                                                <p className="mb-0">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,</p>
                                            </div>
                                        </div>
                                        <div className="d-flex align-items-center">
                                            <div>
                                                <p className="mb-0 font-weight-bold">Status</p>
                                                <p className="mb-0">Approved</p>
                                            </div>
                                        </div>
                                        <div className="d-flex align-items-center">
                                            <div>
                                                <p className="mb-0 font-weight-bold">Time Remaining</p>
                                                <p className="mb-0">20:00</p>
                                            </div>
                                        </div>
                                        <div className="d-flex align-items-center">
                                            <div>
                                                <p className="mb-0 font-weight-bold">Date</p>
                                                <p className="mb-0">24 September 2021 at 12:00 PM</p>
                                            </div>
                                        </div>
                                        <div className="ShowOnHover">
                                            <a href="#" title="Delete"><i class="las la-trash"></i></a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        :
                        null
                        :
                        null
                    }
                </div>
                <div>
                    {
                        AccessControls.access ? JSON.parse(AccessControls.access).includes(504) || JSON.parse(AccessControls.access).includes(1)
                            ?
                            <>
                                <div className="RequestsForPeriods">
                                    <h4 className="mb-4"> PR Requests For the month </h4>
                                    <Pie
                                        width='100%'
                                        height='100px'
                                        data={ChartData}
                                    />
                                </div>
                                <div className="RequestsStatusCounts">
                                    <h4 className="mb-4"> PR Requests Status </h4>
                                    <div className="status bg-light">
                                        <div style={{ width: '30%' }} className="statuses Completed bg-success">
                                            <p className="mb-0">10 Completed</p>
                                        </div>
                                        <div style={{ width: '50%' }} className="statuses Rejected bg-danger">
                                            <p className="mb-0">30 Rejected</p>
                                        </div>
                                        <div style={{ width: '70%' }} className="statuses Pending bg-warning">
                                            <p className="mb-0">50 Pending</p>
                                        </div>
                                        <div style={{ width: '90%' }} className="statuses WaitingForApproval bg-info">
                                            <p className="mb-0">80 Waiting For Approval</p>
                                        </div>
                                    </div>
                                </div>
                            </>
                            :
                            null
                            :
                            null
                    }
                </div>
            </div>
        </>
    );
}

export default InvtryHome;
