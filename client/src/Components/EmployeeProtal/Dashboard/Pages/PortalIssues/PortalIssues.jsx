/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from 'react';
import './Style.css';
import { Switch, Route, useHistory } from 'react-router-dom';
import moment from 'moment';
import axios from '../../../../../axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import $ from 'jquery';
import JSAlert from 'js-alert';
import Modal from '../../../../UI/Modal/Modal';
import { useSelector } from 'react-redux';
import ReactTooltip from 'react-tooltip';

const PortalIssues = () => {
    const history = useHistory();
    const AccessControls = useSelector( ( state ) => state.EmpAuth.EmployeeData );

    if (!AccessControls) {
        return <></>
    }

    return (
        <div className="portal_issues page">
            <div className='page-content'>
                <Switch>
                        <Route exact path="/portal/issues" render={ 
                            () => (
                                <IssuesListView 
                                    history={history}
                                    AccessControls={AccessControls}
                                />
                            )
                        } />
                        <Route exact path="/portal/issues/new" render={ 
                            () => (
                                <NewIssue 
                                    history={history}
                                    AccessControls={AccessControls}
                                />
                            )
                        } />
                        <Route exact path="/portal/issues/details/:id" render={ 
                            () => (
                                <IssueDetails 
                                    history={history}
                                    AccessControls={AccessControls}
                                />
                            )
                        } />
                </Switch>
            </div>
        </div>
    )
}

export default PortalIssues;

const IssueDetails = ({ history, AccessControls }) => {
    const [ details, setDetails ] = useState();
    const [ showReplyModal, setShowReplyModal ] = useState(false);

    useEffect(
        () => {
            let isActive = true;
            loadDetails(isActive);
            return () => {
                isActive = false;
            }
        }, []
    );

    const loadDetails = (isActive) => {
        axios.post(
            '/portal/issues/details',
            {
                report_id: window.location.href.split('/').pop(),
                viewer: localStorage.getItem('EmpID')
            }
        ).then((res) => {
            if (!isActive) return;
            setDetails(res.data[0]);
        } ).catch(err => console.log(err));
    }
    const updateIssue = (e) => {
        e.preventDefault();
        const comment = e.target['comment'].value;
        const status = e.target['status'].value;
        
        if (!JSON.parse(AccessControls.access).includes(77) || details.status !== 'Pending') {
            JSAlert.alert("You don't have access.", "Validation Error", JSAlert.Icons.Warning);
            return false;
        }
        if (comment === '' || comment.trim().length < 20) {
            JSAlert.alert("Comments must contains 20 characters", "Validation Error", JSAlert.Icons.Warning);
            return false;
        }
        if (status === '') {
            JSAlert.alert("Status is required!!", "Validation Error", JSAlert.Icons.Warning);
            return false;
        }
        $('fieldset').prop('disabled', true);
        axios.post(
            '/portal/issues/update',
            {
                report_id: window.location.href.split('/').pop(),
                support_by: localStorage.getItem('EmpID'),
                support_comment: comment,
                status: status,
            }
        ).then(() => {
            JSAlert.alert("Issue has been updated!!", "Success", JSAlert.Icons.Success).dismissIn(2000);
            setTimeout(() => {
                history.replace('/portal/issues');
            }, 2000);
        } ).catch(err => console.log(err));
    }
    const updatePriority = (e) => {
        const priority = e.target.value;
        
        if (!JSON.parse(AccessControls.access).includes(76)) {
            JSAlert.alert("Access Denied", "Validation Error", JSAlert.Icons.Warning);
            return false;
        }
        if (priority === '') {
            JSAlert.alert("Priority is required", "Validation Error", JSAlert.Icons.Warning);
            return false;
        }
        axios.post(
            '/portal/issues/update/priority',
            {
                report_id: window.location.href.split('/').pop(),
                update_by: localStorage.getItem('EmpID'),
                priority: priority,
            }
        ).then(() => {
            JSAlert.alert("Priority has been updated!!", "Success", JSAlert.Icons.Success).dismissIn(2000);
            loadDetails(true);
        } ).catch(err => console.log(err));
    }
    // const magnify = (id, zoom) => {
    //     const lensSize = 200;
    //     const els = document.getElementsByTagName('img');
    //     Array.from(els).forEach((el, i) => {
    //         const copy = el.cloneNode(true);
    //         const lens = document.createElement("underlay");
    
    //         lens.setAttribute("id", "lens_" + i);
    //         lens.setAttribute("class", "lens");
    //         lens.style.width = lensSize + "px";
    //         lens.style.height = lensSize + "px";
    //         lens.style.backgroundImage = "url(" + el.src + ")";
    
    //         el.appendChild(lens);
    //         el.getBoundingClientRect();
    //         copy.style.zoom = zoom || 4;
    //         lens.appendChild(copy);
    
    //         copy.style.width = (el.offsetWidth * (zoom || 4)) + "px";
    //         copy.style.heigth = (el.offsetHeight * (zoom || 4)) + "px";
    //         copy.style.position = "absolute";
    
    //         el.addEventListener("mousemove", (ev) => {
    //             ev.preventDefault();
    //             ev.stopPropagation();
    //             const pos = getCursorPos(ev);
    //             lens.style.left = - (lensSize / 2) + pos.x + "px";
    //             lens.style.top = - (lensSize / 2) + pos.y + "px";
    //             copy.style.left = - (pos.x - el.offsetLeft) + (lensSize / (zoom || 4)) * 0.5 + "px";
    //             copy.style.top = - (pos.y - el.offsetTop) + (lensSize / (zoom || 4)) * 0.5 + "px";
    //         })
    //     });
    // }
    // const getCursorPos = (e) => {
    //     var x = (window.Event) ? e.pageX : e.clientX + (document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft);
    //     var y = (window.Event) ? e.pageY : e.clientY + (document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop);
    //     return { x: x, y: y };
    // }

    if (!details) {
        return <h6 className="text-center mb-0">Loading...</h6>
    }
    return (
        <>
            {showReplyModal && (
                <Modal show={true} Hide={ () => setShowReplyModal(false) } content={
                    <form onSubmit={updateIssue}>
                        <h5 className='mb-0'>Comment</h5>
                        <hr />
                        <fieldset>
                            <lable className="mb-0"><b>Status</b></lable>
                            <select name='status' className='form-control mb-3' defaultValue={'Resolved'} required>
                                <option value="Resolved">Resolved</option>
                                <option value="Replied">Replied</option>
                            </select>
                            <textarea className='form-control' placeholder='Enter your comments here...' name="comment" minLength={20} required />
                            <button className='btn submit d-block ml-auto mt-3'>Submit</button>
                        </fieldset>
                    </form>
                } />
            )}
            <div className="d-flex align-items-center justify-content-between">
                <h3 className="heading">
                    PORTAL ISSUE
                    <sub>Subject of the report (Portal Issue)</sub>
                </h3>
                <div>
                    {
                        JSON.parse(AccessControls.access).includes(79) && details.status === 'Pending'
                        ?
                        <button className="btn submit" onClick={() => setShowReplyModal(true)}>
                            Comment
                        </button>
                        :null
                    }
                    <button className="btn light ml-2" onClick={ () => history.goBack() }>
                        Back
                    </button>
                </div>
            </div>
            <hr />
            {
                window.innerWidth < 992
                ?
                <table className='table table-borderless'>
                    <tbody>
                        <tr>
                            <td>
                                <b>Request By</b><br />
                                <span>{details.request_emp_name}</span><br />
                                <span>{details.request_emp_dept}</span>
                            </td>
                            <td>
                                <b>Requested At</b><br />
                                <span>{new Date(details.requested_at).toDateString()} {new Date(details.requested_at).toLocaleTimeString()}</span>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <b>Issue Category</b><br />
                                <span>{details.pi_category}</span>
                            </td>
                            <td>
                                <b>Date of Issue</b><br />
                                <span>{new Date(details.issue_date).toDateString()}</span>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <b>Current Status</b><br />
                                <span>{details.status}</span>
                            </td>
                            {
                                JSON.parse(AccessControls.access).includes(78)
                                ?
                                <td>
                                    <b>Priority</b><br />
                                    {
                                        details.status === 'Pending'
                                        ?
                                        <select className="form-control w-50" onChange={updatePriority}>
                                            <option value="Low" selected={details.priority === 'Low'}>Low</option>
                                            <option value="Medium" selected={details.priority === 'Medium'}>Medium</option>
                                            <option value="High" selected={details.priority === 'High'}>High</option>
                                        </select>
                                        :
                                        <span>{details.priority}</span>
                                    }
                                </td>
                                :null
                            }
                        </tr>
                        {
                            details.support_emp_name
                            ?
                            <tr>
                                <td>
                                    <b>Supported At</b><br />
                                    <span>{new Date(details.support_at).toDateString()} {new Date(details.support_at).toLocaleTimeString()}</span>
                                </td>
                                <td colSpan={2}>
                                    <b>Support Comments</b><br />
                                    <span>{details.support_comments}</span>
                                </td>
                            </tr>
                            :null
                        }
                    </tbody>
                </table>
                :
                <table className='table table-borderless'>
                    <tbody>
                        <tr>
                            <td>
                                <b>Request By</b><br />
                                <span>{details.request_emp_name}</span><br />
                                <span>{details.request_emp_dept}</span>
                            </td>
                            <td>
                                <b>Requested At</b><br />
                                <span>{new Date(details.requested_at).toDateString()} {new Date(details.requested_at).toLocaleTimeString()}</span>
                            </td>
                            <td>
                                <b>Issue Category</b><br />
                                <span>{details.pi_category}</span>
                            </td>
                            <td>
                                <b>Date of Issue</b><br />
                                <span>{new Date(details.issue_date).toDateString()}</span>
                            </td>
                            <td>
                                <b>Current Status</b><br />
                                <span>{details.status}</span>
                            </td>
                            {
                                JSON.parse(AccessControls.access).includes(78)
                                ?
                                <td>
                                    <b>Priority</b><br />
                                    {
                                        details.status === 'Pending'
                                        ?
                                        <select className="form-control w-50" onChange={updatePriority}>
                                            <option value="Low" selected={details.priority === 'Low'}>Low</option>
                                            <option value="Medium" selected={details.priority === 'Medium'}>Medium</option>
                                            <option value="High" selected={details.priority === 'High'}>High</option>
                                        </select>
                                        :
                                        <span>{details.priority}</span>
                                    }
                                </td>
                                :null
                            }
                        </tr>
                        {
                            details.support_emp_name
                            ?
                            <tr>
                                <td>
                                    <b>Supported At</b><br />
                                    <span>{new Date(details.support_at).toDateString()} {new Date(details.support_at).toLocaleTimeString()}</span>
                                </td>
                                <td colSpan={2}>
                                    <b>Support Comments</b><br />
                                    <span>{details.support_comments}</span>
                                </td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                            :null
                        }
                    </tbody>
                </table>
            }
            <h6><b>Subject</b></h6>
            <span>{details.subject}</span>
            <hr />
            <h6><b>Description</b></h6>
            <hr />
            <span className='description' dangerouslySetInnerHTML={{__html: details.description}}></span>
        </>
    )
}

const IssuesListView = ({ history, AccessControls }) => {
    const types = {
        priority: 'priority',
        issue_date: 'issue_date'
    };

    const [ RequestStatuses, setRequestStatuses ] = useState([]);
    const [ RequestCategories, setRequestCategories ] = useState([]);
    const [ status, setStatus ] = useState('');
    const [ issues, setIssues ] = useState();
    const [ ShowFilters, setShowFilters ] = useState(false);
    const [ filterSubject, setFilterSubject ] = useState('');
    const [ filterDescription, setFilterDescription ] = useState('');
    const [ filterPriority, setFilterPriority ] = useState('');
    const [ filterCategory, setFilterCategory ] = useState('');
    const [ filterIssueDate, setFilterIssueDate ] = useState('');
    const [ filterID, setFilterID ] = useState('');

    useEffect(
        () => {
            let isActive = true;
            loadReportedIssues(isActive);
            return () => {
                isActive = false;
            }
        }, []
    );
    useEffect(
        () => {
            if (issues) {
                const statuses = [];
                const categories = [];
                for ( let x = 0; x < issues.length; x++ )
                {
                    if ( !statuses.includes(issues[x].status.toLowerCase()) ) {
                        statuses.push(issues[x].status.toLowerCase());
                    }
                    if ( !categories.includes(issues[x].pi_category.toLowerCase()) ) {
                        categories.push(issues[x].pi_category.toLowerCase());
                    }
                }
                setRequestStatuses(statuses);
                setRequestCategories(categories);

                if ( sessionStorage.getItem('portal_issue') )
                {
                    setStatus(sessionStorage.getItem('portal_issue'));
                }
                if ( sessionStorage.getItem('pi_subject') )
                {
                    setFilterSubject(sessionStorage.getItem('pi_subject'));
                }
                if ( sessionStorage.getItem('pi_desc') )
                {
                    setFilterDescription(sessionStorage.getItem('pi_desc'));
                }
                if ( sessionStorage.getItem('pi_category') )
                {
                    setFilterCategory(sessionStorage.getItem('pi_category'));
                }
                if ( sessionStorage.getItem('pi_date') )
                {
                    setFilterCategory(sessionStorage.getItem('pi_date'));
                }
                if ( sessionStorage.getItem('pi_id') )
                {
                    setFilterID(sessionStorage.getItem('pi_id'));
                }
            }
        }, [issues?.length]
    );

    const sortArray = ( type, in_de, dataType ) => {
        const sortProperty = types[type];
        let sorted = sort(sortProperty, in_de, dataType);
        setIssues(sorted);
    };
    const sort = ( property, in_de, dataType ) => {
        const result =
        dataType === "string"
        ? sortString(property, in_de)
        : dataType === 'date'
        ? sortDate(property, in_de)
        : [];

        return result;
    }
    const sortDate = ( property, in_de ) => {
        let sorted;
        if ( in_de > 0 ) {
            sorted = [...issues].sort((a, b) => new Date(b[property]) - new Date(a[property]));
        }else {
            sorted = [...issues].sort((a, b) => new Date(a[property]) - new Date(b[property]));
        }
        return sorted;
    }
    const sortString = ( property, in_de ) => {
        let sorted;
        if ( in_de > 0 ) {
            sorted = [...issues].sort((a, b) => b[property].localeCompare(a[property]));
        }else {
            sorted = [...issues].sort((a, b) => a[property].localeCompare(b[property]));
        }
        return sorted;
    }
    const loadReportedIssues = (isActive) => {
        const admin = JSON.parse(AccessControls.access).includes(77) || JSON.parse(AccessControls.access).includes(0) ? 1 : 0;
        axios.post(
            '/portal/issues/list',
            {
                requested_by: localStorage.getItem('EmpID'),
                admin: admin,
            }
        ).then((res) => {
            if (!isActive) return;
            setIssues(res.data);
        } ).catch(err => console.log(err));
    }
    const resetFilters = () => {
        sessionStorage.removeItem('pi_subject');
        sessionStorage.removeItem('pi_desc');
        sessionStorage.removeItem('pi_priority');
        sessionStorage.removeItem('pi_category');
        sessionStorage.removeItem('pi_date');
        sessionStorage.removeItem('pi_id');
        setFilterSubject("");
        setFilterDescription("");
        setFilterPriority("");
        setFilterCategory("");
        setFilterIssueDate("");
        setFilterID("");
    }
    const Status = ({ status }) => {
        return (
            <div className='d-flex align-items-center'>
                <div
                    className={
                        "dot mr-1 "
                        +
                        (
                            status === 'Resolved'
                                ?
                                "bg-success"
                                :
                                status === 'Replied'
                                    ?
                                    "bg-primary"
                                    :
                                    status === 'Pending'
                                        ?
                                        "bg-warning"
                                        :
                                        status === 'Low'
                                            ?
                                            "bg-dark"
                                            :
                                            status === 'Medium'
                                                ?
                                                "bg-info"
                                                :
                                                "bg-danger"
                        )
                    }
                ></div>
                <div
                    className={
                        "text-capitalize "
                        +
                        (
                            status === 'Resolved'
                                ?
                                "text-success"
                                :
                                status === 'Replied'
                                    ?
                                    "text-primary"
                                    :
                                    status === 'Pending'
                                        ?
                                        "text-warning"
                                        :
                                        status === 'Low'
                                            ?
                                            "text-dark"
                                            :
                                            status === 'Medium'
                                                ?
                                                "text-info"
                                                :
                                                "text-danger"
                        )
                    }
                    style={{ fontSize: 12 }}
                >
                    {status.split('_').join(' ')}
                </div>
            </div>
        )
    }

    return (
        <>
            <div className="d-flex align-items-center justify-content-between">
                <h3 className="heading">
                    Portal Issues
                    <sub>Report any issue on the portal</sub>
                </h3>
                <div>
                    <button className="btn submit" type='reset' onClick={ () => history.push('/portal/issues/new') }>
                        Report an Issue
                    </button>
                    {
                        AccessControls && JSON.parse(AccessControls.access).includes(77)
                        ?
                        <button className="btn submit px-2 ml-2 filter-emit" onClick={() => setShowFilters(!ShowFilters)} type='button'>
                            {
                                ShowFilters
                                    ?
                                    <>
                                        <i className="las la-times"></i>
                                    </>
                                    :
                                    <div data-tip data-for='filter'>
                                        {
                                            filterSubject !== '' || 
                                            filterDescription !== '' || 
                                            filterPriority !== '' || 
                                            filterCategory !== '' || 
                                            filterIssueDate !== ''
                                            ?
                                            <div className='filterisOpen'></div>
                                            :
                                            null
                                        }
                                        <i className="las la-filter"></i>
                                        <ReactTooltip id='filter' place="top">
                                            Filters
                                        </ReactTooltip>
                                    </div>
                            }
                        </button>
                        :null
                    }
                </div>
            </div>
            <hr />
            {
                AccessControls && JSON.parse(AccessControls.access).includes(77) && ShowFilters && (
                    <>
                        <div className='filter-content popUps'>
                            <div className='flex'>
                                <div className='w-100'>
                                    <label className="font-weight-bold mb-0">Category</label>
                                    <select value={filterCategory} onChange={(e) => {setFilterCategory(e.target.value); sessionStorage.setItem('pi_category', e.target.value)}} className='form-control mb-2'>
                                        <option value={""}>All</option>
                                        {
                                            RequestCategories.map((category, i) => <option key={i} value={category}>{category}</option>)
                                        }
                                    </select>
                                </div>
                                <div className='w-100'>
                                    <label className="font-weight-bold mb-0">Search ID</label>
                                    <input value={filterID} placeholder='Search Keywords...' type="number" onChange={(e) => {setFilterID(e.target.value); sessionStorage.setItem('pi_id', e.target.value)}} className='form-control mb-2' />
                                </div>
                                <div className='w-100'>
                                    <label className="font-weight-bold mb-0">Search Subject</label>
                                    <input value={filterSubject} placeholder='Search Keywords...' type="search" onChange={(e) => {setFilterSubject(e.target.value); sessionStorage.setItem('pi_subject', e.target.value)}} className='form-control mb-2' />
                                </div>
                                <div className='w-100'>
                                    <label className="font-weight-bold mb-0">Search Description</label>
                                    <input value={filterDescription} placeholder='Search Keywords...' type="search" onChange={(e) => {setFilterDescription(e.target.value); sessionStorage.setItem('pi_desc', e.target.value)}} className='form-control mb-2' />
                                </div>
                                {
                                    AccessControls && JSON.parse(AccessControls.access).includes(78) && (
                                        <div className='w-100'>
                                            <label className="font-weight-bold mb-0">Priority</label>
                                            <select value={filterPriority} onChange={(e) => {setFilterPriority(e.target.value); sessionStorage.setItem('pi_priority', e.target.value)}} className='form-control mb-2'>
                                                <option value={""}>All</option>
                                                <option value={"Low"}>Low</option>
                                                <option value={"Medium"}>Medium</option>
                                                <option value={"High"}>High</option>
                                            </select>
                                        </div>
                                    )
                                }
                                <div className='w-100'>
                                    <label className="font-weight-bold mb-0">Issue Date</label>
                                    <input value={filterIssueDate} type="date" onChange={(e) => {setFilterIssueDate(e.target.value); sessionStorage.setItem('pi_date', e.target.value)}} className='form-control mb-2' />
                                </div>
                                <button className='btn green d-block ml-auto mt-2' type='button' onClick={resetFilters}>Reset All</button>
                            </div>
                        </div>
                        <br />
                    </>
                )
            }
            <ul className="nav nav-tabs my-3">
                <li className="nav-item" onClick={ () => { setStatus(''); sessionStorage.setItem('portal_issue', '') } }>
                    <a className={ status === '' ? 'nav-link active text-capitalize' : 'nav-link text-capitalize' }>
                        { 'all' } { status === '' ? `(${issues?issues.length:0})` : "" }
                    </a>
                </li>
                    {
                        RequestStatuses.map(
                            (st, index) => {
                                return (
                                    <li className="nav-item" onClick={() => { setStatus(st); sessionStorage.setItem('portal_issue', st) }} key={index}>
                                        <a className={st === status ? 'nav-link active text-capitalize' : 'nav-link text-capitalize'}>
                                            {st.split('_').join(' ')} {st === status ? `(${issues ? issues.filter(val => val.status.toLowerCase().includes(status)).length : 0})` : ""}
                                        </a>
                                    </li>
                                )
                            }
                        )
                    }
            </ul>
            {
                !issues
                ?
                <h6 className="text-center">Loading...</h6>
                :
                issues.length === 0
                ?
                <h6 className="text-center">No Issue Reported</h6>
                :
                <table className='table popUps list'>
                    <thead>
                        <tr>
                            <th className='border-top-0'>Sr.No</th>
                            <th className='border-top-0'>ID</th>
                            <th className='border-top-0'>Category</th>
                            <th className='border-top-0'>Subject</th>
                            <th className='border-top-0'>Description</th>
                            <th className='border-top-0'>Requested By</th>
                            <th className='border-top-0'>
                                <div className='d-flex align-items-center'>
                                    Issue Date
                                    <div className='ml-2'>
                                        <i onClick={ () => sortArray('issue_date', 1, 'date') } className="las la-chevron-up d-block" style={{ cursor: 'pointer' }}></i>
                                        <i onClick={ () => sortArray('issue_date', 0, 'date') } className="las la-chevron-down d-block" style={{ cursor: 'pointer' }}></i>
                                    </div>
                                </div>
                            </th>
                            <th className='border-top-0'>Status</th>
                            {AccessControls && JSON.parse(AccessControls.access).includes(78) && (
                                <th className='border-top-0'>
                                    <div className='d-flex align-items-center'>
                                        Priority
                                        <div className='ml-2'>
                                            <i onClick={ () => sortArray('priority', 1, 'string') } className="las la-chevron-up d-block" style={{ cursor: 'pointer' }}></i>
                                            <i onClick={ () => sortArray('priority', 0, 'string') } className="las la-chevron-down d-block" style={{ cursor: 'pointer' }}></i>
                                        </div>
                                    </div>
                                </th>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {
                            issues.filter(val => 
                                val.status.toLowerCase().includes(status) && 
                                val.subject.toLocaleLowerCase().includes(filterSubject.toLocaleLowerCase()) && 
                                val.description.toLocaleLowerCase().includes(filterDescription.toLocaleLowerCase()) && 
                                val.priority.toLocaleLowerCase().includes(filterPriority.toLocaleLowerCase()) && 
                                val.pi_category.toLocaleLowerCase().includes(filterCategory.toLocaleLowerCase()) && 
                                val.issue_date.toLocaleLowerCase().includes(filterIssueDate.toLocaleLowerCase())
                            ).filter(val => {
                                if (filterID === '') {
                                    return true;
                                }else {
                                    return parseInt(val.portal_issue_id) === parseInt(filterID)
                                }
                            }).map(
                                ( val, index ) => {
                                    return (
                                        <tr key={ index } onClick={ () => history.push('/portal/issues/details/' + val.portal_issue_id) } className='pointer pointer-hover'>
                                            <td>{ index + 1 }</td>
                                            <td>{ val.portal_issue_id }</td>
                                            <td>{ val.pi_category }</td>
                                            <td>{ val.subject }</td>
                                            <td>
                                                <div style={{maxHeight: '80px', overflow: 'hidden'}}>
                                                    <span dangerouslySetInnerHTML={{ __html: val.description }}></span>
                                                </div>
                                            </td>
                                            <td>
                                                <b>{val.name}</b><br />
                                                {val.department_name}, {val.code}<br />
                                                {moment(new Date(val.requested_at)).format('DD-MM-YYYY hh:mm A')}
                                            </td>
                                            <td>{new Date(val.issue_date).toDateString()}</td>
                                            <td>
                                                <Status status={val.status} />
                                                <div className='mt-1'>{val.support_at && (new Date(val.support_at).toDateString() + ' ' + new Date(val.support_at).toLocaleTimeString())}</div>
                                            </td>
                                            {AccessControls && JSON.parse(AccessControls.access).includes(78) && (
                                                <td>
                                                    <Status status={val.priority} />
                                                </td>
                                            )}
                                        </tr>
                                    )

                                }
                            )
                        }
                    </tbody>
                </table>
            }
        </>
    )
};

const NewIssue = ({ history, AccessControls }) => {
    const [ description, setDescription ] = useState('');
    const [ categories, setCategories ] = useState();
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

    useEffect(
        () => {
            let isActive = true;
            loadCategories(isActive);
            return () => {
                isActive = false;
            }
        }, []
    );
    const loadCategories = (isActive) => {
        axios.get('/portal/issues/categories').then((res) => {
            if (!isActive) return;
            setCategories(res.data);
        } ).catch(err => console.log(err));
    }
    const onReportIssue = (e) => {
        e.preventDefault();
        const category = e.target['category'].value;
        const categoryName = $('#category').find('option:selected').text();
        const issue_date = e.target['issue_date'].value;
        const subject = e.target['subject'].value;

        if (!JSON.parse(AccessControls.access).includes(76)) {
            JSAlert.alert("You don't have access to send report", "Validation Error", JSAlert.Icons.Warning);
            return false;
        }

        if (category === '' || category.trim().length === 0 || categoryName === '' || categoryName.trim().length === 0) {
            JSAlert.alert("Category is required", "Validation Error", JSAlert.Icons.Warning);
            return false;
        }
        if (issue_date === '') {
            JSAlert.alert("Issue Date is required", "Validation Error", JSAlert.Icons.Warning);
            return false;
        }
        if (issue_date > moment().format('YYYY-MM-DD').valueOf()) {
            JSAlert.alert("Issue Date not be greater than the current date", "Validation Error", JSAlert.Icons.Warning);
            return false;
        }
        if (subject === '' || subject.trim().length === 0) {
            JSAlert.alert("Subject is required", "Validation Error", JSAlert.Icons.Warning);
            return false;
        }
        if (description === '' || description.trim() === '<p><br></p>') {
            JSAlert.alert("Description must contains 20 characters", "Validation Error", JSAlert.Icons.Warning);
            return false;
        }

        $('fieldset').prop('disabled', true);
        axios.post(
            '/portal/issues/new',
            {
                category: category,
                categoryName: categoryName,
                issue_date: issue_date,
                subject: subject,
                description: description,
                reported_by: localStorage.getItem('EmpID'),
            }
        ).then(() => {
            JSAlert.alert("Issue has been reported!!", "Success", JSAlert.Icons.Success).dismissIn(2000);
            setTimeout(() => {
                history.replace('/portal/issues');
            }, 2000);
        } ).catch(err => {
            console.log(err);
            $('fieldset').prop('disabled', false);
            JSAlert.alert("Something went wrong!!", "Failed", JSAlert.Icons.Failed).dismissIn(2000);
        });
    }

    const options = categories && categories.map(({pi_category_id, pi_category_name}, i) => {return <option key={i} value={pi_category_id}>{pi_category_name}</option>});
    return (
        <>
            <div className="d-flex align-items-center justify-content-between">
                <h3 className="heading">
                    Report a New Issue
                    <sub>Specify the issue</sub>
                </h3>
                <button className="btn light" type='reset' onClick={ () => history.goBack() }>
                    Back
                </button>
            </div>
            <hr />
            <div className="page-content portal_issue_form">
                <form onSubmit={onReportIssue}>
                    <fieldset>
                        <div className="d-flex mb-2" style={{gap: '20px'}}>
                            <div className='w-50'>
                                <label className='mb-0 font-weight-bold'>Category</label>
                                <select name='category' id='category' className="form-control" required>
                                    <option value="">Please select</option>
                                    {options}
                                </select>
                            </div>
                            <div className='w-50'>
                                <label className='mb-0 font-weight-bold'>Issue Date</label>
                                <input name='issue_date' type="date" className="form-control" required />
                            </div>
                        </div>
                        <label className='mb-0 font-weight-bold'>Subject</label>
                        <input type="text" name='subject' className="form-control mb-2" maxLength={200} required />
                        <label className='mb-0 font-weight-bold'>Description</label>
                        <ReactQuill style={{ backgroundColor: "#fff" }} theme="snow" modules={modules} formats={formats} value={description} onChange={setDescription} />
                        <button className='btn submit d-block ml-auto mt-3'>Submit</button>
                    </fieldset>
                </form>
            </div>
        </>
    )
};