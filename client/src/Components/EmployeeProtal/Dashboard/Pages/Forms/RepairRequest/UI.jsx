/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useEffect, useState } from 'react';
import './Style.css';

import parse from 'html-react-parser';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Modal from '../../../../../UI/Modal/Modal';
import moment from 'moment';
import { Route, Switch } from 'react-router-dom';
import loading from '../../../../../../images/loadingIcons/icons8-iphone-spinner.gif';

const UI = ( { Incident, Comment, IncidentsList, Details, Attachments, Status, history, ListAttachments, Files, Locations, RequestsList, setStatus, newRequest, newIncident, setComment, getIncidents, getIncidentDetails, getDetails, onAttachFiles } ) => {
    
    return (
        <>
            <div className="repair_request page">
                <div className='page-content'>
                    <Switch>
                        <Route exact path="/repair_request" render={ 
                            () => (
                                <>
                                    <div className="d-flex align-items-center justify-content-between">
                                        <h3 className="heading">
                                            Reporting Section
                                            <sub>Report any incident</sub>
                                        </h3>

                                        {
                                            Status === 'repair'
                                            ?
                                            <button className="btn submit" type='reset' onClick={ () => history.push('/repair_request/new_repair') }>
                                                New Repair Request
                                            </button>
                                            :
                                            <button className="btn submit" type='reset' onClick={ () => history.push('/repair_request/new_incident') }>
                                                New Incident Report
                                            </button>
                                        }
                                    </div>

                                    <ul className="nav nav-tabs my-3">
                                        <li className="nav-item" onClick={ () => { setStatus('repair'); sessionStorage.setItem('reportingStatus', 'repair') } }>
                                            <a className={ Status === 'repair' ? 'nav-link active text-capitalize' : 'nav-link text-capitalize' }>
                                                { 'repair' } { Status === 'repair' ? `(${RequestsList?RequestsList.length:0})` : "" }
                                            </a>
                                        </li>
                                        <li className="nav-item" onClick={ () => { setStatus('incident'); sessionStorage.setItem('reportingStatus', 'incident') } }>
                                            <a className={ Status === 'incident' ? 'nav-link active text-capitalize' : 'nav-link text-capitalize' }>
                                                { 'incident' } { Status === 'incident' ? `(${IncidentsList?IncidentsList.length:0})` : "" }
                                            </a>
                                        </li>
                                    </ul>

                                    <div className='records-container'>
                                        {
                                            Status === 'repair'?<RepairRequests history={ history } RequestsList={ RequestsList } />:null
                                        }
                                        {
                                            Status === 'incident'?<IncidentRequests IncidentsList={ IncidentsList } history={ history } RequestsList={ RequestsList } getIncidents={ getIncidents } />:null
                                        }
                                    </div>
                                </>
                            )
                        } />
                        <Route exact path="/repair_request/new_repair" render={ 
                            () => (
                                <RepairRequestForm 
                                    history={ history }
                                    Locations={ Locations }
                                    
                                    onAttachFiles={ onAttachFiles }
                                    newRequest={ newRequest }
                                />
                            )
                        } />
                        <Route exact path="/repair_request/new_incident" render={ 
                            () => (
                                <IncidentReportForm 
                                    history={ history }
                                    Locations={ Locations }
                                    Comment={ Comment }
                                    
                                    setComment={ setComment }
                                    newIncident={ newIncident }
                                />
                            )
                        } />
                        <Route exact path="/repair_request/details/:id" render={ 
                            () => (
                                <RepairRequestDetails 
                                    history={ history }
                                    Details={ Details }
                                    Attachments={ Attachments }

                                    getDetails={ getDetails }
                                />
                            )
                        } />
                        <Route exact path="/repair_request/incident/details/:id" render={ 
                            () => (
                                <IncidentDetails 
                                    history={ history }
                                    Incident={ Incident }

                                    getIncidentDetails={ getIncidentDetails }
                                />
                            )
                        } />
                    </Switch>
                </div>
            </div>
        </>
    );

}

export default UI;

const RepairRequestForm = ({ Locations, history, onAttachFiles, newRequest }) => {
    return (
        <div className='RepairRequestForm'>
            <div className='inner'>
                <div className="d-flex align-items-center justify-content-between">
                    <h3 className="heading">
                        New Repair Request
                        <sub>Request for repairing</sub>
                    </h3>

                    <button className="btn light" onClick={ () => history.goBack() }>
                        Back
                    </button>
                </div>
                <hr />
                <form className="repair_request_form" id="repair_request_form" onSubmit={ newRequest }>
                    <fieldset>
                        <label className='mb-0 font-weight-bold'>
                            Location
                        </label>
                        <select className="form-control mb-2" name="location_code" required>
                            <option value="">Select the option</option>
                            {
                                Locations.map(
                                    ( val, index ) => {
                                        return (
                                            <option key={ index } value={ val.location_code }>{ val.location_name }</option>
                                        )
                                    }
                                )
                            }
                        </select>
                        <label className="mb-0 font-weight-bold">Subject</label>
                        <input type="text" name="subject" className="form-control mb-2" required />
                        <label className="mb-0 font-weight-bold">Description</label>
                        <textarea type="text" name="description" className="form-control mb-2" minLength={15} required />
                        <label className="mb-0 font-weight-bold">Attachments</label>
                        <input type="file" multiple accept="image/png, image/gif, image/jpeg" onChange={ onAttachFiles } name="attachments" className="form-control mb-3" required />

                        <button className='btn submit d-block ml-auto'>Submit</button>
                    </fieldset>
                </form>
            </div>
        </div>
    )
}

const IncidentReportForm = ({ Comment, Locations, history, setComment, newIncident }) => {
    const modules = {
        toolbar: [
            [{ header: '1' }, { header: '2' }, { font: [] }],
            [{ size: [] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [
                { list: 'ordered' },
                { list: 'bullet' },
                { indent: '-1' },
                { indent: '+1' },
            ],
            ['link', 'image', 'video'],
            ['clean'],
        ],
        clipboard: {
            matchVisual: false,
        },
    };
    const formats = [
        'header',
        'font',
        'size',
        'bold',
        'italic',
        'underline',
        'strike',
        'blockquote',
        'list',
        'bullet',
        'indent',
        'link',
        'image',
        'video',
    ];
    return (
        <div className='RepairRequestForm'>
            <div className='inner'>
                <div className="d-flex align-items-center justify-content-between">
                    <h3 className="heading">
                        New Incident Report
                        <sub>Report new incident</sub>
                    </h3>

                    <button className="btn light" onClick={ () => history.goBack() }>
                        Back
                    </button>
                </div>
                <hr />
                <form className="repair_request_form" id="repair_request_form" onSubmit={ newIncident }>
                    <fieldset>
                        <label className='mb-0 font-weight-bold'>
                            Location
                        </label>
                        <select className="form-control mb-2" name="location_code" required>
                            <option value="">Select the option</option>
                            {
                                Locations.map(
                                    ( val, index ) => {
                                        return (
                                            <option key={ index } value={ val.location_code }>{ val.location_name }</option>
                                        )
                                    }
                                )
                            }
                        </select>
                        <label className="mb-0 font-weight-bold">Subject</label>
                        <input type="text" name="subject" className="form-control mb-2" required />
                        <label className="mb-0 font-weight-bold">Incident Type</label>
                        <select name="type" className="form-control mb-2" required>
                            <option value="">Select Option</option>
                            <option value="Fire">Fire</option>
                            <option value="Accident">Accident</option>
                            <option value="Damage">Damage</option>
                            <option value="Theft">Theft</option>
                        </select>
                        <label className="mb-0 font-weight-bold">Description</label>
                        <ReactQuill style={{ backgroundColor: "#fff" }} theme="snow" modules={modules} formats={formats} value={Comment} onChange={setComment} />

                        <button className='btn submit d-block ml-auto mt-3'>Submit</button>
                    </fieldset>
                </form>
            </div>
        </div>
    )
}

const Form = ( { Files, Locations, newRequest, onAttachFiles } ) =>{

    return (
        <>
            <form className="repair_request_form" id="repair_request_form" onSubmit={ newRequest }>
                <fieldset>

                    <h6>Request Form</h6>

                    <label className="mb-0 d-flex align-items-center justify-content-between">
                        <span>Location</span>
                        <small>Found: ({ Locations.length })</small>
                    </label>
                    <select className="form-control form-control-sm" name="location_code" required>
                        <option value="">Select the option</option>
                        {
                            Locations.map(
                                ( val, index ) => {
                                    return (
                                        <option key={ index } value={ val.location_code }>{ val.location_name }</option>
                                    )
                                }
                            )
                        }
                    </select>
                    <small className="d-block mb-2">Select the location of item to be repaired.</small>

                    <label className="mb-0">Subject *</label>
                    <input type="text" name="subject" className="form-control form-control-sm" required />
                    <small className="d-block mb-2">Enter a suitable subject.</small>

                    <label className="mb-0">Description *</label>
                    <textarea name="description" className="form-control form-control-sm" required minLength={15} />
                    <small className="d-block mb-2">Describe the problem in the item to be repaired.</small>
                    
                    <label className="mb-0">Attachments *</label>
                    <input type="file" multiple accept="image/png, image/gif, image/jpeg" onChange={ onAttachFiles } name="attachments" className="form-control form-control-sm" style={ { fontSize: '10px' } } required />
                    <small className="d-block mb-2">Attach a cover photo.</small>
                    {
                        Files.length > 0
                        ?
                        Files.map(
                            val => {

                                return (
                                    <span className="attached_files">
                                        { val.name }
                                    </span>
                                )

                            }
                        )
                        :null
                    }
                    {/* <img src={ URL.createObjectURL(val.file) } style={ { border: '1px solid lightgray', borderRadius: '5px', margin: '10px', cursor: 'pointer' } } alt="attachment" width="100" height="100" /> */}

                    <button className="btn d-block ml-auto btn-danger">
                        Submit
                    </button>
                </fieldset>
            </form>
        </>
    )

}

const Requests = ( { RequestsList, ListAttachments } ) => {

    const [ Content, setContent ] = useState();

    return (
        <>
            {
                Content
                ?
                <Modal show={ true } Hide={ () => setContent() } content={Content} />
                :null
            }
            <div className='repair_request_list'>

                {
                    RequestsList.length === 0
                    ?
                    <h6 className="text-center">No Record Found</h6>
                    :
                    <table className='table table-bordered popUps'>
                        <thead>
                            <tr>

                                <th>ID</th>
                                <th>Subject</th>
                                <th>Description</th>
                                <th>Location</th>
                                <th>Request Date</th>
                                <th>Status</th>

                            </tr>
                        </thead>
                        <tbody>
                            {
                                RequestsList.map(
                                    ( val, index ) => {

                                        return (
                                            <tr key={ index }>

                                                <td>{ val.request_id }</td>
                                                <td>{ val.subject }</td>
                                                <td>
                                                    { val.description }
                                                    <hr className='m-0 my-1' />
                                                    {
                                                        ListAttachments.map(
                                                            val2 => {

                                                                let content = <div></div>;
                                                                if ( val.request_id === val2.request_id )
                                                                {
                                                                    content = <div onClick={ () => setContent(<img src={ 'assets/portal/assets/images/repair/' + val2.attachment.split('/').pop() } width="100%" alt="photo" />) } style={ { cursor: 'pointer', color: "blue" } }> {val2.attachment.split('/').pop()} </div>;
                                                                }

                                                                return content;

                                                            }
                                                        )
                                                    }
                                                </td>
                                                <td>{ val.location_name }</td>
                                                <td>{ moment(val.request_date).utc().format('MM-DD-YYYY') }</td>
                                                <td>
                                                    <span className="badge badge-pill badge-secondary px-3">{ val.status }</span>
                                                </td>

                                            </tr>
                                        )

                                    }
                                )
                            }
                        </tbody>
                    </table>
                }

            </div>
        </>
    )

}

const RepairRequests = ( { history, RequestsList } ) => {

    const [ Content, setContent ] = useState();

    return (
        <>
            {
                Content
                ?
                <Modal show={ true } Hide={ () => setContent() } content={Content} />
                :null
            }
            <div className='repair_request_list'>

                {
                    RequestsList.length === 0
                    ?
                    <h6 className="text-center">No Record Found</h6>
                    :
                    <table className='table popUps'>
                        <thead>
                            <tr>
                                <th className='border-top-0'>Sr.No</th>
                                <th className='border-top-0'>Subject</th>
                                <th className='border-top-0'>Description</th>
                                <th className='border-top-0'>Location</th>
                                <th className='border-top-0'>Request Date</th>
                                <th className='border-top-0'>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                RequestsList.map(
                                    ( val, index ) => {

                                        return (
                                            <tr key={ index } onClick={ () => history.push('/repair_request/details/' + val.request_id) } className='pointer pointer-hover'>
                                                <td>{ index + 1 }</td>
                                                <td>{ val.subject }</td>
                                                <td>{ val.description }</td>
                                                <td>{ val.location_name }</td>
                                                <td>
                                                    { moment(val.request_date).utc().format('MM-DD-YYYY') }<br />
                                                    { moment(val.request_time,'h:mm:ss a').format('hh:mm A') }
                                                </td>
                                                <td>
                                                    <span className="badge badge-pill badge-secondary px-3">{ val.status }</span>
                                                </td>
                                            </tr>
                                        )

                                    }
                                )
                            }
                        </tbody>
                    </table>
                }

            </div>
        </>
    )

}

const IncidentRequests = ( { IncidentsList, history, RequestsList, getIncidents } ) => {

    const [ Content, setContent ] = useState();
    useEffect(
        () => {
            getIncidents();
        }, []
    )

    return (
        <>
            {
                Content
                ?
                <Modal show={ true } Hide={ () => setContent() } content={Content} />
                :null
            }
            <div className='repair_request_list'>

                {
                    IncidentsList.length === 0
                    ?
                    <h6 className="text-center">No Record Found</h6>
                    :
                    <table className='table popUps'>
                        <thead>
                            <tr>
                                <th className='border-top-0'>Sr.No</th>
                                <th className='border-top-0'>Subject</th>
                                <th className='border-top-0'>Location</th>
                                <th className='border-top-0'>Request Date</th>
                                <th className='border-top-0'>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                IncidentsList.map(
                                    ( val, index ) => {

                                        return (
                                            <tr key={ index } onClick={ () => history.push('/repair_request/incident/details/' + val.report_id) } className='pointer pointer-hover'>
                                                <td>{ index + 1 }</td>
                                                <td>{ val.subject }</td>
                                                <td>{ val.location_name }</td>
                                                <td>
                                                    { moment(val.reported_date).utc().format('MM-DD-YYYY') }<br />
                                                    { moment(val.reported_time,'h:mm:ss a').format('hh:mm A') }
                                                </td>
                                                <td>
                                                    <span className="badge badge-pill badge-secondary px-3">{ val.status }</span>
                                                </td>
                                            </tr>
                                        )

                                    }
                                )
                            }
                        </tbody>
                    </table>
                }

            </div>
        </>
    )

}

const RepairRequestDetails = ({ Details, Attachments, history, getDetails }) => {
    useEffect(
        () => {
            getDetails();
        }, []
    )

    if ( !Details )
    {
        return <img src={loading} alt="loading..." width='50' height='50' className='d-block mx-auto' />
    }

    return (
        <>
            <div className="d-flex align-items-center justify-content-between">
                <h3 className="heading">
                    Repair Request Details
                    <sub>View The Details Of The Request</sub>
                </h3>

                <button className="btn light" onClick={ () => history.goBack() }>
                    Back
                </button>
            </div>
            <hr />

            <table className='table mb-2 table-borderless'>
                <tbody>
                    <tr>
                        <td>
                            <b>Requested By</b><br />
                            <span>{ Details.request_person }</span><br />
                            <span>{ Details.request_person_designation }</span>
                        </td>
                        <td>
                            <b>Requested Date & Time</b><br />
                            <span>
                                { moment(Details.request_date).utc().format('MM-DD-YYYY') }<br />
                                { Details.request_time }
                            </span>
                        </td>
                        {
                            Details.assign_to
                            ?
                            <td>
                                <b>Assigned To</b><br />
                                <span>{ Details.assigned_person }</span>
                                <span>
                                    { moment(Details.assign_date).utc().format('MM-DD-YYYY') }<br />
                                    { Details.assign_time }
                                </span>
                            </td>
                            :null
                        }
                        <td>
                            <b>Location</b><br />
                            <span>{ Details.location_name }</span>
                        </td>
                        <td>
                            <b>Request Status</b><br />
                            <span style={ { textTransform: 'capitalize' } } className="badge badge-dark rounded-pill px-3">
                                { Details.status }
                            </span>
                        </td>
                    </tr>
                    <tr>
                        <td colSpan={5}>
                            <b>Description</b><br />
                            <span>{ Details.description }</span>
                        </td>
                    </tr>
                </tbody>
            </table>

            <hr />
            <h5 className='font-weight-bold'>Attachments</h5>
            <hr />
            {
                Attachments.filter( val => { return !val.attachment.split('/').pop().includes('after_') } ).length === 0
                ?
                <h6 className='text-center col-12'>No Attachment Found</h6>
                :
                <div className='container-fluid'>
                    <div className='row'>
                        {
                            Attachments.filter( val => { return !val.attachment.split('/').pop().includes('after_') } ).map(
                                ( val, index ) => {
                                    return (
                                            <div 
                                                className="col-lg-3 col-md-6 col-sm-12 pb-4" 
                                                key={ index }
                                            >
                                                <a
                                                    href={ `${process.env.REACT_APP_SERVER}/assets/portal/assets/images/repair/` + val.attachment.split('/').pop() }
                                                    target="_blank"
                                                    style={
                                                        {
                                                            border: '1px solid lightgray',
                                                            borderRadius: '10px',
                                                            padding: '20px',
                                                            display: 'block'
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
                                                                border: '1px solid lightgray',
                                                                borderRadius: '10px'
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
            }
        </>
    )
}

const IncidentDetails = ({ Incident, history, getIncidentDetails }) => {
    useEffect(
        () => {
            getIncidentDetails();
        }, []
    )

    if ( !Incident )
    {
        return <img src={loading} alt="loading..." width='50' height='50' className='d-block mx-auto' />
    }

    return (
        <>
            <div className="d-flex align-items-center justify-content-between">
                <h3 className="heading">
                    Repair Request Details
                    <sub>View The Details Of The Request</sub>
                </h3>

                <button className="btn light" onClick={ () => history.goBack() }>
                    Back
                </button>
            </div>
            <hr />

            <table className='table mb-2 table-borderless'>
                <tbody>
                    <tr>
                        <td>
                            <b>Requested By</b><br />
                            <span>{ Incident.request_person }</span><br />
                            <span>{ Incident.request_person_designation }</span>
                        </td>
                        <td>
                            <b>Requested Date & Time</b><br />
                            <span>
                                { moment(Incident.reported_date).utc().format('MM-DD-YYYY') }<br />
                                { Incident.reported_time }
                            </span>
                        </td>
                        <td>
                            <b>Incident Type</b><br />
                            <span className='text-danger'>{ Incident.type }</span>
                        </td>
                        <td>
                            <b>Location</b><br />
                            <span>{ Incident.location_name }</span>
                        </td>
                        <td>
                            <b>Request Status</b><br />
                            <span style={ { textTransform: 'capitalize' } } className="badge badge-dark rounded-pill px-3">
                                { Incident.status }
                            </span>
                        </td>
                    </tr>
                    <tr>
                        <td colSpan={5}>
                            <b>Description</b><br />
                            <div className='incident_details'>{ parse(Incident.description) }</div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </>
    )
}