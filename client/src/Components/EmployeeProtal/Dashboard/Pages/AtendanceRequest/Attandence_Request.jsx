/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-lone-blocks */
import React, { useEffect, useState } from 'react';
import './AttendanceRequest.css';
import { Route, Switch, useHistory } from 'react-router-dom';
import axios from '../../../../../axios';
import GoogleMapReact from 'google-map-react';
import Modal from '../../../../UI/Modal/Modal';
import $ from 'jquery';
import JSAlert from 'js-alert';

import Pin from '../../../../../images/icons8-map-pin-48.png';
import { useSelector } from 'react-redux';

const AttendanceRequest = () => {

    const history = useHistory();
    const Relations = useSelector((state) => state.EmpAuth.Relations);
    const AccessControls = useSelector( ( state ) => state.EmpAuth.EmployeeData );

    const [ CancelContent, setCancelContent ] = useState();
    const [ Requests, setRequests ] = useState();
    const [ RequestDetails, setRequestDetails ] = useState(
        {
            emp_info: undefined,
            request_info: {},
            reviews: []
        }
    );

    useEffect(
        () => {
            if (AccessControls) loadRequests();
        }, [AccessControls]
    )

    const loadRequests = () => {

        axios.post(
            '/getallattendancerequests',
            {
                emp_id: localStorage.getItem('EmpID'),
                all: JSON.parse(AccessControls.access).includes(83) ? 1 : 0
            }
        ).then(
            res => {

                setRequests(res.data);

            }
        ).catch(
            err => {

                console.log(err)

            }
        )

    }

    return (
        <>
            <div className="attendance_request">
                <div className="attendance_request_container">
                
                    <Modal show={ CancelContent ? true : false } Hide={ () => setCancelContent() } content={ CancelContent } />

                    <Switch>
                        <Route exact path="/attendance_requests/view/list" render={ 
                            () => (
                                <AttRequests 
                                    Requests={ Requests }
                                    history={ history }
                                />
                            )
                        } />
                        <Route exact path="/attendance_requests/view/details/:id" render={ 
                            () => (
                                <DetailRequest
                                    RequestDetails={ RequestDetails }
                                    history={ history }
                                    Requests={ Requests }
                                    Relations={ Relations }

                                    setCancelContent={ setCancelContent }
                                    setRequestDetails={ setRequestDetails }
                                />
                            )
                        } />
                    </Switch>

                </div>
            </div>
        </>
    )
}
export default AttendanceRequest;

const AttRequests = ( { Requests, history } ) => {

    return (
        <>
            <div className="d-flex align-items-center justify-content-between">
                <h3 className="heading">
                    Attendance Requests
                    <sub>Attendance Correction</sub>
                </h3>
            </div>
            <hr />

            {
                Requests
                ?
                Requests.length === 0
                ?
                <h6 className="text-center">No Request Found</h6>
                :
                <table className="table table-hover popUps">
                    <thead>
                        <tr>
                            <th>Sr.No</th>
                            <th>Requested By</th>
                            <th>Submit To</th>
                            <th>Date & Time</th>
                            <th>Current Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            Requests.map(
                                ( val, index ) => {
                                    return (
                                        <tr className='pointer' key={ index } title="Double Click To Enter" onDoubleClick={ () => history.push('/attendance_requests/view/details/' + val.request_id) }>
                                            <td>{ index + 1 }</td>
                                            <td>
                                                <div className="d-flex align-items-center">
                                                    <img src={ process.env.REACT_APP_SERVER+'/images/employees/' + val.emp_image } alt="emp" width='40' height='40' className='rounded-circle' />
                                                    <div className='ml-2'>
                                                        <b>{val.sender_name}</b> <br />
                                                        <span>{val.designation_name}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>{ val.receiver_name }</td>
                                            <td>{ new Date(val.request_date).toDateString() } <br /> { val.request_time }</td>
                                            <td>
                                                <div className='d-flex align-items-center'>
                                                    <div 
                                                        className={
                                                            "dot mr-1 "
                                                            +
                                                            (
                                                                val.request_status === 'approved' || val.request_status === 'mark'
                                                                ?
                                                                "bg-success"
                                                                :
                                                                val.request_status === 'rejected'
                                                                ?
                                                                "bg-danger"
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
                                                                val.request_status === 'approved' || val.request_status === 'mark'
                                                                ?
                                                                "text-success"
                                                                :
                                                                val.request_status === 'rejected'
                                                                ?
                                                                "text-danger"
                                                                :
                                                                "text-dark"
                                                            )
                                                        }
                                                    >
                                                        { val.request_status }
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                }
                            )
                        }
                    </tbody>
                </table>
                :
                <h6 className="text-center">Please Wait....</h6>
            }
        </>
    )

}

const PinDrop = ( { title } ) => {

    return (
        <div style={{position: 'relative'}}>
            <img src={Pin} alt="pin" style={{ transform: "translate(-48px,-48px)" }} />
            <div className='bg-white p-2' style={{ position: 'absolute', bottom: 100, left: -48 }}>
                {title}
            </div>
        </div>
    )

}

const DetailRequest = ({ Relations, Requests, RequestDetails, history, setRequestDetails, setCancelContent }) => {

    useEffect(
        () => {
            return loadDetails(window.location.href.split('/').pop());
        }, []
    )

    const loadDetails = ( id ) => {
        axios.post(
            '/getattendancerequestdetails',
            {
                request_id: id,
            }
        ).then(
            res => {
                setRequestDetails(
                    {
                        emp_info: res.data[2][0],
                        request_info: res.data[0][0],
                        reviews: res.data[1]
                    }
                );
            }
        ).catch(
            err => {
                console.log(err)
            }
        )
    }
    
    function showCancelBtn()
    {
        let val = true;
        for ( let x = 0; x < RequestDetails.reviews.length; x++ )
        {
            const status = RequestDetails.reviews[x].request_status;
            if ( status === 'cancel' || status === 'mark' || status === 'approved' || status === 'rejected' )
            {
                val = false;
            }
        }
        return val;
    }

    const cancelRequest = () => {

        setCancelContent(
            <>
                <form className="w-100 p-3" onSubmit={ confirmToCancelRequest }>
                    <fieldset>
                        <h6>Do you really want to cancel your request?</h6>
                        <textarea name="reason" className="form-control mb-3" style={{ minHeight: '80px' }} placeholder='Enter a valid reason here...' required minLength='10'></textarea>
                        <button className="btn submit d-block ml-auto">
                            submit
                        </button>
                    </fieldset>
                </form>
            </>
        )

    }

    const confirmToCancelRequest = ( e ) => {
        e.preventDefault();
        $('fieldset').prop('disabled', true);
        axios.post(
            '/attendance_request/cancel',
            {
                request_id: window.location.href.split('/').pop(),
                emp_id: localStorage.getItem("EmpID"),
                reason: e.target['reason'].value
            }
        ).then(
            () => {
                JSAlert.alert("Your Request Has Been Canceled").dismissIn(1000 * 2);
                setTimeout(() => {
                    history.push('/attendance_requests/view/list');
                }, 1500);
            }
        ).catch(
            err => {
                $('fieldset').prop('disabled', false);
                console.log(err)
            }
        )
    }

    const rejectRequest = () => {

        setCancelContent(
            <>
                <form className="w-100 p-3" onSubmit={ confirmToRejectRequest }>
                    <fieldset>
                        <h6>Do you really want to reject this request?</h6>
                        <textarea name="remarks" className="form-control mb-3" style={{ minHeight: '80px' }} placeholder='Enter a valid reason here...' required minLength='10'></textarea>
                        <button className="btn submit d-block ml-auto">
                            submit
                        </button>
                    </fieldset>
                </form>
            </>
        )

    }

    const confirmToRejectRequest = ( e ) => {
        e.preventDefault();
        $('fieldset').prop('disabled', true);
        axios.post(
            '/attendance_request/reject',
            {
                request_id: window.location.href.split('/').pop(),
                remarks: e.target['remarks'].value
            }
        ).then(
            () => {
                JSAlert.alert("The Request Has Been Rejected").dismissIn(1000 * 2);
                setTimeout(() => {
                    history.push('/attendance_requests/view/list');
                }, 1500);
            }
        ).catch(
            err => {
                $('fieldset').prop('disabled', false);
                console.log(err)
            }
        )
    }

    const approveRequest = () => {

        setCancelContent(
            <>
                <form className="w-100 p-3" onSubmit={ confirmToApproveRequest }>
                    <fieldset>
                        <h6>Kindly confirm to approve this request.</h6>
                        <textarea name="remarks" className="form-control mb-3" style={{ minHeight: '80px' }} placeholder='Enter your remarks here...' required minLength='10'></textarea>
                        
                        <label className='mb-1 font-weight-bold'>Submit To</label>
                        <select name="forward_to" className='form-control mb-3'required>
                            <option value="">Select The Option</option>
                            {
                                Relations.map(
                                    (val, index) => {

                                        let option;
                                        if ( val.category === 'all' || val.category.includes('attendance_request') )
                                        {
                                            option = <option value={val.sr} key={index}> {val.name} </option>;
                                        }

                                        return option;
                                    }
                                )
                            }
                        </select>
                        <button className="btn submit d-block ml-auto">
                            submit
                        </button>
                    </fieldset>
                </form>
            </>
        )

    }

    const confirmToApproveRequest = ( e ) => {
        e.preventDefault();
        $('fieldset').prop('disabled', true);
        axios.post(
            '/attendance_request/approve',
            {
                request_id: window.location.href.split('/').pop(),
                remarks: e.target['remarks'].value,
                forward_to: e.target['forward_to'].value
            }
        ).then(
            () => {
                JSAlert.alert("The Request Has Been Approved").dismissIn(1000 * 2);
                setTimeout(() => {
                    history.push('/attendance_requests/view/list');
                }, 1500);
            }
        ).catch(
            err => {
                $('fieldset').prop('disabled', false);
                console.log(err)
            }
        )
    }

    const acknowledgeRequest = () => {

        setCancelContent(
            <>
                <form className="w-100 p-3" onSubmit={ confirmToAcknowledgeRequest }>
                    <fieldset>
                        <h6>Do you really want to mark the attendance of the requested employee?</h6>
                        <textarea name="remarks" className="form-control mb-3" style={{ minHeight: '80px' }} placeholder='Enter your remarks here...' required minLength='10'></textarea>
                        <button className="btn submit d-block ml-auto">
                            submit
                        </button>
                    </fieldset>
                </form>
            </>
        )

    }

    const confirmToAcknowledgeRequest = ( e ) => {
        e.preventDefault();
        $('fieldset').prop('disabled', true);
        axios.post(
            '/attendance_request/mark',
            {
                request_id: window.location.href.split('/').pop(),
                remarks: e.target['remarks'].value
            }
        ).then(
            () => {
                JSAlert.alert("The Request Has Been Completed").dismissIn(1000 * 2);
                setTimeout(() => {
                    history.push('/attendance_requests/view/list');
                }, 1500);
            }
        ).catch(
            err => {
                $('fieldset').prop('disabled', false);
                console.log(err)
            }
        )
    }

    return (
        <>
            <div className='d-flex flex-column'>
                <div className="d-flex align-items-center justify-content-between">
                    <h3 className="heading">
                        Request Details
                        <sub>View Attendance Request</sub>
                    </h3>

                    <div className="btn-group">
                        <button className="btn submit" type='button' onClick={() => history.replace('/attendance_requests/view/list')}>
                            Back
                        </button>
                        {
                            RequestDetails.emp_info && showCancelBtn() && RequestDetails.reviews[0].request_by == localStorage.getItem("EmpID") && RequestDetails.reviews[0].request_status == "sent" ? <button className="btn light" type='button' onClick={cancelRequest}>Cancel</button> : null
                        }
                        {
                            !Requests?null:
                            Requests.map(
                                val => {
                                    let content = <></>;
                                    if ( val.request_id == window.location.href.split('/').pop() && val.request_status === 'sent' && parseInt(val.request_to) === parseInt(localStorage.getItem('EmpID')) )
                                    {
                                        content = (
                                            <>
                                                <button className="btn cancle" type='button' onClick={rejectRequest}>Reject</button>
                                                <button className="btn submit" type='button' onClick={approveRequest}>Approve</button>
                                            </>
                                        )
                                    }else
                                    if ( val.request_id == window.location.href.split('/').pop() && val.request_status === 'approved' && parseInt(val.act_by) === parseInt(localStorage.getItem('EmpID')) )
                                    {
                                        content = (
                                            <>
                                                <button className="btn green" type='button' onClick={acknowledgeRequest}>Acknowledge</button>
                                            </>
                                        )
                                    }
                                    return content;
                                }
                            )
                        }
                    </div>
                </div>
                <hr />
                {
                    RequestDetails.emp_info && RequestDetails.request_info
                    ?
                    <div style={{ flexGrow: 2, width: '100%', height: '80vh', position: 'relative' }}>

                        <button 
                            className={ 'btn text-white text-capitalize ' + ( RequestDetails.reviews[0].request_status === 'sent' || RequestDetails.reviews[0].request_status === 'cancel' ? 'btn-dark' : RequestDetails.reviews[0].request_status === 'rejected' ? 'btn-danger' : 'btn-success' ) }
                            style={
                                {
                                    position: 'absolute',
                                    top: '5%',
                                    left: '2%',
                                    zIndex: 1
                                }
                            }
                        >{RequestDetails.reviews[0].request_status}</button>

                        <div className="details">

                            <div className="location_details divs mb-3">
                                <h6>{ new Date(RequestDetails.request_info.date).toDateString() } at { RequestDetails.request_info.time }</h6>
                                <p className="text-secondary mb-0">Date & Time</p>
                            </div>

                            <div className="employee_details divs">
                                <h6>{ RequestDetails.emp_info.name }</h6>
                                <p className="text-secondary mb-0">{RequestDetails.emp_info.designation_name}</p>
                            </div>

                            {
                                RequestDetails.request_info.location_code
                                ?
                                <>
                                    <div className="distance_line">
                                        { RequestDetails.request_info.distance && parseFloat(parseFloat(RequestDetails.request_info.distance)/1000).toFixed(2) } km
                                    </div>

                                    <div className="location_details divs mb-3">
                                        <h6>{ RequestDetails.request_info.location_name }</h6>
                                        <p className="text-secondary mb-0">Location</p>
                                    </div>
                                </>
                                :
                                <div className="location_details divs my-3">
                                    <h6>Other</h6>
                                    <p className="text-secondary mb-0">Location</p>
                                </div>
                            }

                            <div className="location_details divs mb-3">
                                <h6>
                                    { RequestDetails.request_info.reason }. Kindly accept my request for <u className='text-info'>({ RequestDetails.reviews[0].time_in ? "time in" : "time out" })</u>
                                </h6>
                                <p className="text-secondary mb-0">reason</p>
                            </div>

                            {
                                RequestDetails.reviews[0].remarks
                                ?
                                <div className="location_details divs">
                                    <h6>{ RequestDetails.reviews[0].remarks }</h6>
                                    <p className="text-secondary mb-0">{ RequestDetails.reviews[0].receiver_name }'s remarks</p>
                                </div>
                                :null
                            }

                        </div>

                        <GoogleMapReact
                            bootstrapURLKeys={{ key: "" }}
                            defaultCenter={
                                {
                                    lat: parseFloat(RequestDetails.request_info.emp_lat),
                                    lng: parseFloat(RequestDetails.request_info.emp_long)
                                }
                            }
                            defaultZoom={18}
                        >
                            <PinDrop
                                lat={parseFloat(RequestDetails.request_info.emp_lat)}
                                lng={parseFloat(RequestDetails.request_info.emp_long)}
                                title={ RequestDetails.emp_info.name }
                            />
                            {
                                RequestDetails.request_info.location_code
                                ?
                                <PinDrop
                                    lat={parseFloat(RequestDetails.request_info.latitude)}
                                    lng={parseFloat(RequestDetails.request_info.longitude)}
                                    title={ RequestDetails.request_info.location_name }
                                />
                                :null
                            }
                        </GoogleMapReact>
                    </div>
                    :
                    <h6 className='text-center'>Please Wait...</h6>
                }
            </div>
        </>
    )

}