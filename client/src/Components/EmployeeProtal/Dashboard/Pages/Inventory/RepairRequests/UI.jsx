/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import './Style.css';
import { Route, Switch, useHistory } from 'react-router-dom';
import Modal from '../../../../../UI/Modal/Modal';
import moment from 'moment';
import loading from '../../../../../../images/loadingIcons/icons8-iphone-spinner.gif';
import BreadCrumb from '../../../Components/BreadCrumb';

import ReactTooltip from 'react-tooltip';

function UI({ Status, Complete, Reject, Pending, AssignTo, Details, Employees, Attachments, LoadedStatuses, FilterLocation, LoadedLocations, FilterDescription, FilterSubject, Requests, setComplete, setStatus, setReject, setPending, setAssignTo, getDetails, setFilterDescription, setFilterLocation, setFilterSubject, onCompleteRequest, onAttachFiles, onReject, onPending, onAssignRequest }) {

    const history = useHistory();
    const Arr = Requests.filter(val => {return val.subject.toLowerCase().includes(FilterSubject.toLowerCase()) && val.description.toLowerCase().includes(FilterDescription.toLowerCase()) && val.location_name.toLowerCase().includes(FilterLocation.toLowerCase()) && val.status.toLowerCase().includes(Status.toLowerCase())});

    return (
        <>
            <div className='repair-requests page'>
                { Details ? <BreadCrumb links={[{label: 'Repair Requests', href: '/inventory/repair/requests'}]} currentLabel={ "Repair Request Details - ID: " + window.location.href.split('/').pop() } /> :null }
                <div className='repair-requests-container page-content'>
                    <Modal show={ AssignTo } Hide={ () => setAssignTo(!AssignTo) } content={ <ModalAssignTo Employees={ Employees } AssignTo={ AssignTo } onAssignRequest={ onAssignRequest } /> } />
                    <Modal show={ Pending } Hide={ () => setPending(!Pending) } content={ <ModalPending Pending={ Pending } onPending={ onPending } /> } />
                    <Modal show={ Reject } Hide={ () => setReject(!Reject) } content={ <ModalReject Reject={ Reject } onReject={ onReject } /> } />
                    <Modal show={ Complete } Hide={ () => setComplete(!Complete) } content={ <ModalComplete Complete={ Complete } onComplete={ onCompleteRequest } onAttachFiles={ onAttachFiles } /> } />
                    <Switch>
                        <Route exact path="/inventory/repair/requests" render={ 
                                () => (
                                    <ListView 
                                        history={ history }
                                        Arr={ Arr }
                                        LoadedStatuses={ LoadedStatuses }
                                        LoadedLocations={ LoadedLocations }
                                        Status={ Status }

                                        setStatus={ setStatus }
                                        setFilterDescription={ setFilterDescription }
                                        setFilterLocation={ setFilterLocation }
                                        setFilterSubject={ setFilterSubject }
                                    />
                                )
                            } 
                        />
                        <Route exact path="/inventory/repair/request/:id" render={ 
                                () => (
                                    <DetailsView 
                                        Details={ Details }
                                        Attachments={ Attachments }
                                        history={ history }

                                        setAssignTo={ setAssignTo }
                                        setComplete={ setComplete }
                                        setReject={ setReject }
                                        setPending={ setPending }
                                        onAssignRequest={ onAssignRequest }
                                        getDetails={ getDetails }
                                    />
                                )
                            } 
                        />
                    </Switch>
                </div>
            </div>
        </>
    )
}

export default UI;

const ModalAssignTo = ({ Employees, AssignTo, onAssignRequest }) => {
    if ( !AssignTo )
    {
        return <></>;
    }

    return (
        <form onSubmit={ onAssignRequest }>
            <fieldset className="px-3 pt-2 pb-0">
                <h6 className='mb-3'>
                    Select An Employee From The Following List
                </h6>
                <select type="text" className='form-control assign_to' required id="assign_to" name="assign_to">
                    <option value="">Select The Option</option>
                    {
                        Employees.map(
                            val => {

                                return <option value={ val.emp_id }>{ val.name }</option>

                            }
                        )
                    }
                </select>
                <button className='btn submit mt-3 d-block ml-auto' type='submit'>
                    Confirm
                </button>
            </fieldset>
        </form>
    )
}

const ModalPending = ({ Pending, onPending }) => {
    if ( !Pending )
    {
        return <></>;
    }

    return (
        <form onSubmit={ onPending }>
            <fieldset className="px-3 pt-2 pb-0">
                <h6 className='mb-3'>
                    Do you want to set this request to pending?
                </h6>
                <textarea className='form-control reason' placeholder='Enter your reason here....' required id="reason" name="reason" />
                <button className='btn submit mt-3 d-block ml-auto' type='submit'>
                    Confirm
                </button>
            </fieldset>
        </form>
    )
}

const ModalReject = ({ Reject, onReject }) => {
    if ( !Reject )
    {
        return <></>;
    }

    return (
        <form onSubmit={ onReject }>
            <fieldset className="px-3 pt-2 pb-0">
                <h6 className='mb-3'>
                    Do you want to reject this request?
                </h6>
                <textarea className='form-control reason' placeholder='Enter your reason here....' required id="reason" name="reason" />
                <button className='btn submit mt-3 d-block ml-auto' type='submit'>
                    Confirm
                </button>
            </fieldset>
        </form>
    )
}

const ModalComplete = ({ Complete, onAttachFiles, onComplete }) => {
    if ( !Complete )
    {
        return <></>;
    }

    return (
        <form onSubmit={ onComplete }>
            <fieldset className="px-3 pt-2 pb-0">
                <h6 className='mb-3'>
                    Do you want to complete this request?
                </h6>
                <textarea className='form-control reason mb-3' minLength={10} placeholder='Enter your reason here....' required id="remarks" name="remarks" />
                <input type="file" className='form-control assign_to mr-3' required onChange={ onAttachFiles } multiple />
                <button className='btn submit mt-3 d-block ml-auto' type='submit'>
                    Confirm
                </button>
            </fieldset>
        </form>
    )
}

const ListView = ({ Status, history, Arr, LoadedStatuses, LoadedLocations, setFilterDescription, setStatus, setFilterLocation, setFilterSubject }) => {
    const [ ShowFilters, setShowFilters ] = useState(false);

    const resetFilters = () => {
        sessionStorage.removeItem('FilterRepairLocation');
        sessionStorage.removeItem('FilterRepairSubject');
        sessionStorage.removeItem('FilterRepairDescription');
        setFilterSubject("");
        setFilterDescription("");
        setFilterLocation("");
    }
    return (
        <>
            <div className="d-flex align-items-center justify-content-between">
                <h3 className="heading">
                    Repair Requests
                    <sub>List Of All Requests</sub>
                </h3>
                <button className="btn submit px-2 ml-2 filter-emit" onClick={() => setShowFilters(!ShowFilters)} type='button'>
                    {
                        ShowFilters
                            ?
                            <>
                                <i className="las la-times"></i>
                            </>
                            :
                            <div data-tip data-for='filter'>
                                <i className="las la-filter"></i>
                                <ReactTooltip id='filter' place="top">
                                    Filters
                                </ReactTooltip>
                            </div>
                    }
                </button>
            </div>
            {
                ShowFilters
                ?
                <>
                    <br />
                    <div className='filter-content popUps'>
                            <div className='flex'>
                                <div className='w-100'>
                                    <label className="font-weight-bold mb-0">Search By Subject</label>
                                    <input placeholder='Search Here...' className='form-control form-control-sm mb-2' onChange={(e) => setFilterSubject(e.target.value)} />
                                </div>
                                <div className='w-50'>
                                    <label className="font-weight-bold mb-0">Search By Description</label>
                                    <input placeholder='Search Here...' className='form-control form-control-sm mb-2' onChange={(e) => setFilterDescription(e.target.value)} />
                                </div>
                                <div className='w-50'>
                                    {
                                        LoadedLocations
                                            ?
                                            <>
                                                <label className="font-weight-bold mb-0">Location</label>
                                                <select className='form-control form-control-sm mb-2' onChange={(e) => setFilterLocation(e.target.value)}>
                                                    <option value=''>Select Option</option>
                                                    {
                                                        LoadedLocations.sort().map(
                                                            (location, index) => {

                                                                return <option key={index} value={location}>{location}</option>;

                                                            }
                                                        )
                                                    }
                                                </select>
                                            </>
                                            : null
                                    }
                                </div>
                                <button className='btn green d-block ml-auto mt-2' type='button' onClick={resetFilters}>Reset All</button>
                            </div>
                    </div>
                </>
                :null
            }
            <ul className="nav nav-tabs my-3">
                {/* <li className="nav-item" onClick={ () => { setStatus('overview'); sessionStorage.setItem('RepairStatus', 'overview') } }>
                    <a className={ Status === 'overview' ? 'nav-link active text-capitalize' : 'nav-link text-capitalize' }>overview</a>
                </li> */}
                <li className="nav-item" onClick={ () => { setStatus(''); sessionStorage.setItem('RepairStatus', '') } }>
                    <a className={ Status === '' ? 'nav-link active text-capitalize' : 'nav-link text-capitalize' }>all { Status === '' ? `(${Arr.length})` : "" }</a>
                </li>
                {
                    LoadedStatuses.map(
                        ( status, index ) => {
                            return (
                                <li className="nav-item" onClick={ () => { setStatus( status ); sessionStorage.setItem('RepairStatus', status) } } key={ index }>
                                    <a className={ Status === status ? 'nav-link active text-capitalize' : 'nav-link text-capitalize' }>
                                        { status } { Status === status ? `(${Arr.length})` : "" }
                                    </a>
                                </li>
                            )
                        }
                    )
                }
            </ul>
            {
                Arr.length === 0
                ?
                <h6 className="text-center">No Record Found</h6>
                :
                <table className="table mt-3 requests">
                    <thead>
                        <tr>
                            <th className='border-top-0'>Sr.No</th>
                            <th className='border-top-0'>Subject</th>
                            <th className='border-top-0'>Location</th>
                            <th className='border-top-0'>Status</th>
                            <th className='border-top-0'>Request Date/Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            Arr.map(
                                ( val, index ) => {
                                    return (
                                        <tr key={ index } className='pointer' onClick={ () => history.push('/inventory/repair/request/' + val.request_id) }>
                                            <td>
                                                { index + 1 }
                                            </td>
                                            <td>
                                                <b>{ val.subject }</b><br />
                                                <span>{ val.description }</span>
                                            </td>
                                            <td>
                                                { val.location_name }
                                            </td>
                                            <td>
                                                <div className='d-flex align-items-center'>
                                                    <div 
                                                        className={
                                                            "dot mr-1 "
                                                            +
                                                            (
                                                                val.status === 'approved' || val.status === 'closed'
                                                                ?
                                                                "bg-success"
                                                                :
                                                                val.status === 'rejected'
                                                                ?
                                                                "bg-danger"
                                                                :
                                                                val.status === 'pending'
                                                                ?
                                                                "bg-warning"
                                                                :
                                                                val.status === 'working'
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
                                                                val.status === 'approved' || val.status === 'closed'
                                                                ?
                                                                "text-success"
                                                                :
                                                                val.status === 'rejected'
                                                                ?
                                                                "text-danger"
                                                                :
                                                                val.status === 'pending'
                                                                ?
                                                                "text-warning"
                                                                :
                                                                val.status === 'working'
                                                                ?
                                                                "text-primary"
                                                                :
                                                                "text-dark"
                                                            )
                                                        }
                                                    >{ val.status }</div>
                                                </div>
                                            </td>
                                            <td>
                                                { new Date(val.request_date).toDateString() } <br />
                                                { val.request_time }
                                            </td>
                                            {/* <td>
                                                <span 
                                                    className="lnr lnr-pushpin"
                                                    onClick={ () => openOptions( index ) }
                                                >
                                                </span>
                                                <TableOptions
                                                    index={ index }
                                                    options={
                                                        [
                                                            {
                                                                label: "View Details",
                                                                func: () => history.replace('/repair/requests/' + val.request_id + '&&subject=' + val.subject),
                                                                icon: "lnr-eye"
                                                            }
                                                        ]
                                                    }
                                                />
                                            </td> */}
                                        </tr>
                                    );
                                }
                            )
                        }
                    </tbody>
                </table>
            }
        </>
    )
}

const DetailsView = ({ history, Details, Attachments, getDetails, setComplete, setAssignTo, setReject, setPending, onAssignRequest }) => {

    useEffect(
        () => {
            getDetails( window.location.href.split('/').pop() );
        }, []
    )

    return (
        <>
            {
                Details
                ?
                <>
                    <div className="d-flex align-items-center justify-content-between">
                        <h3 className="heading">
                            Repair Request Details
                            <sub>Details Of The Request</sub>
                        </h3>
                        <div>
                            <button className="btn light" type='button' onClick={ () => history.replace('/inventory/repair/requests') }>Back</button>
                            {
                                Details && Details.assign_to === null && Details.status.toLowerCase() !== 'rejected'
                                ?
                                <>
                                    <button className='btn submit ml-2' id="assign_to_btn" type="button" onClick={ () => setAssignTo(true) }>
                                        Assign To
                                    </button>
                                    <button className='btn cancle ml-2' id="rejection_btn" type="button" onClick={ () => setReject(true) }>
                                        Reject
                                    </button>
                                    {
                                        Details.status.toLowerCase() !== 'pending'
                                        ?
                                        <button className='btn light ml-2' id="rejection_btn" type="button" onClick={ () => setPending(true) }>
                                            Set To Pending
                                        </button>
                                        :null
                                    }
                                </>
                                :null
                            }
                            {
                                Details && Details.assign_to !== null && Details.status.toLowerCase() === 'working'
                                ?
                                <button className='btn submit ml-2' id="complete_btn" onClick={ () => setComplete(true) }>
                                    Complete The Request
                                </button>
                                :null
                            }
                        </div>
                    </div>
                    <hr />
                    <table className="table table-borderless">
                        <tbody>
                            <tr>
                                <td>
                                    <b>Requested By</b><br />
                                    <span>{ Details.request_person }</span><br />
                                    <b>Request Date & Time</b><br />
                                    <span>
                                        { new Date(Details.request_date).toDateString() } at { moment(Details.request_time,'h:mm:ss a').format('hh:mm A') }
                                    </span>
                                </td>
                                {
                                    Details.assign_to
                                    ?
                                    <td>
                                        <b>Assigned To</b><br />
                                        <span>{ Details.assigned_person }</span><br />
                                        <b>Assigning Date & Time</b><br />
                                        <span>
                                            { new Date(Details.assign_date).toDateString() } at { moment(Details.assign_time,'h:mm:ss a').format('hh:mm A') }
                                        </span>
                                    </td>
                                    :null
                                }
                                <td>
                                    <b>Location</b><br />
                                    <span>{ Details.location_name }</span><br />
                                    <b>Request Status</b>
                                    <div className='d-flex align-items-center'>
                                        <div 
                                            className={
                                                "dot mr-1 "
                                                +
                                                (
                                                    Details.status === 'approved' || Details.status === 'cleared' || Details.status === 'closed'
                                                    ?
                                                    "bg-success"
                                                    :
                                                    Details.status === 'rejected'
                                                    ?
                                                    "bg-danger"
                                                    :
                                                    Details.status === 'waiting for approval' || Details.status === 'pending for verification'
                                                    ?
                                                    "bg-warning"
                                                    :
                                                    Details.status === 'issued'
                                                    ?
                                                    "bg-info"
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
                                                    Details.status === 'approved' || Details.status === 'cleared' || Details.status === 'closed'
                                                    ?
                                                    "text-success"
                                                    :
                                                    Details.status === 'rejected'
                                                    ?
                                                    "text-danger"
                                                    :
                                                    Details.status === 'waiting for approval' || Details.status === 'pending for verification'
                                                    ?
                                                    "text-warning"
                                                    :
                                                    Details.status === 'issued'
                                                    ?
                                                    "text-info"
                                                    :
                                                    "text-dark"
                                                )
                                            }
                                        >{ Details.status }</div>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={3}>
                                    <b>Description</b><br />
                                    <pre style={{ fontFamily: 'Poppins', fontSize: '13px', width: '100%', whiteSpace: 'pre-wrap' }}>{ Details.description }</pre>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <hr />
                    
                    <h5 className='mb-0 text-capitalize'>
                        Attachments
                    </h5>

                    <br />

                    <div className="container-fluid px-0">
                        <div className="row">

                            {
                                Attachments.filter( val => { return !val.attachment.split('/').pop().includes('after_') } ).length === 0
                                ?
                                <h6 className='text-center col-12'>No Attachment Found</h6>
                                :
                                Attachments.filter( val => { return !val.attachment.split('/').pop().includes('after_') } ).map(
                                    ( val, index ) => {
                                        return (
                                                <div 
                                                    className="col-lg-2 col-md-4 col-sm-12 pb-4" 
                                                    key={ index }
                                                >
                                                    <a
                                                        href={ `${process.env.REACT_APP_SERVER}/assets/portal/assets/images/repair/` + val.attachment.split('/').pop() }
                                                        target="_blank"
                                                        style={
                                                            {
                                                                border: '1px solid lightgray',
                                                                borderRadius: '5px',
                                                                display: 'block',
                                                                height: '250px',
                                                                overflow: 'hidden'
                                                            }
                                                        }
                                                    >
                                                        <img 
                                                            src={ `${process.env.REACT_APP_SERVER}/assets/portal/assets/images/repair/` + val.attachment.split('/').pop() } 
                                                            alt="photo" 
                                                            width="100%"
                                                            // height="400"
                                                            style={
                                                                {
                                                                    borderRadius: '5px'
                                                                }
                                                            }
                                                        />
                                                    </a>
                                                </div>
                                        );
                                    }
                                )
                            }

                        </div>
                    </div>

                    <h5 className='mb-0 text-capitalize'>
                        Attachments (After)
                    </h5>

                    <br />

                    <div className="container-fluid px-0">
                        <div className="row">

                            {
                                Attachments.filter( val => { return val.attachment.split('/').pop().includes('after_') } ).length === 0
                                ?
                                <h6 className='text-center col-12'>No Attachment Found</h6>
                                :
                                Attachments.filter( val => { return val.attachment.split('/').pop().includes('after_') } ).map(
                                    ( val, index ) => {

                                        return (
                                                <div 
                                                    className="col-lg-2 col-md-4 col-sm-12 pb-4" 
                                                    key={ index }
                                                >
                                                    <a
                                                        href={ `${process.env.REACT_APP_SERVER}/assets/portal/assets/images/repair/` + val.attachment.split('/').pop() }
                                                        target="_blank"
                                                        style={
                                                            {
                                                                border: '1px solid lightgray',
                                                                borderRadius: '5px',
                                                                display: 'block',
                                                                height: '250px',
                                                                overflow: 'hidden'
                                                            }
                                                        }
                                                    >
                                                        <img 
                                                            src={ `${process.env.REACT_APP_SERVER}/assets/portal/assets/images/repair/` + val.attachment.split('/').pop() } 
                                                            alt="photo" 
                                                            width="100%"
                                                            height="400"
                                                            style={
                                                                {
                                                                    borderRadius: '5px'
                                                                }
                                                            }
                                                        />
                                                    </a>
                                                </div>
                                        );

                                    }
                                )
                            }

                        </div>
                    </div>

                    <h5 className='mb-0 text-capitalize'>
                        Remarks
                    </h5>

                    <hr />

                    <p>
                        {
                            Details.remarks ? Details.remarks : "No Remarks Yet"
                        }
                    </p>
                </>
                :
                <img src={loading} alt="loading..." width='50' height='50' className='d-block mx-auto' />
            }
        </>
    )
}