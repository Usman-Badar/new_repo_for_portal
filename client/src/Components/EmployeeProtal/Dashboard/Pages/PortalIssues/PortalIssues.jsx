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
            console.log(res.data)
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
                            <td>
                                <b>Priority</b><br />
                                {
                                    JSON.parse(AccessControls.access).includes(78) && details.status === 'Pending'
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
                        </tr>
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
                            <td>
                                <b>Priority</b><br />
                                {
                                    JSON.parse(AccessControls.access).includes(78) && details.status === 'Pending'
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
                        </tr>
                    </tbody>
                </table>
            }
            <h6><b>Subject of the Issue</b></h6>
            <span>{details.subject}</span>
            <hr />
            <h6><b>Description of the Issue</b></h6>
            <hr />
            <span className='description' dangerouslySetInnerHTML={{__html: details.description}}></span>
            <hr />
            {
                details.support_emp_name
                ?
                <table className='table table-borderless'>
                    <tbody>
                        <tr>
                            <td>
                                <b>Supported At</b><br />
                                <span>{new Date(details.support_at).toDateString()} {new Date(details.support_at).toLocaleTimeString()}</span>
                            </td>
                            <td>
                                <b>Support Comments</b><br />
                                <span>{details.support_comments}</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
                :null
            }
        </>
    )
}

const IssuesListView = ({ history, AccessControls }) => {
    const [ status, setStatus ] = useState('pending');
    const [ issues, setIssues ] = useState();

    useEffect(
        () => {
            let isActive = true;
            loadReportedIssues(isActive);
            return () => {
                isActive = false;
            }
        }, []
    );

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
    return (
        <>
            <div className="d-flex align-items-center justify-content-between">
                <h3 className="heading">
                    Portal Issues
                    <sub>Report any issue on the portal</sub>
                </h3>
                <button className="btn submit" type='reset' onClick={ () => history.push('/portal/issues/new') }>
                    Report an Issue
                </button>
            </div>
            <hr />
            <ul className="nav nav-tabs my-3">
                <li className="nav-item" onClick={ () => { setStatus('all'); sessionStorage.setItem('reportingStatus', 'all') } }>
                    <a className={ status === 'all' ? 'nav-link active text-capitalize' : 'nav-link text-capitalize' }>
                        { 'all' } { status === 'all' ? `(${issues?issues.length:0})` : "" }
                    </a>
                </li>
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
                            <th className='border-top-0'>Category</th>
                            <th className='border-top-0'>Subject</th>
                            <th className='border-top-0'>Description</th>
                            <th className='border-top-0'>Requested By</th>
                            <th className='border-top-0'>Status</th>
                            <th className='border-top-0'>Priority</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            issues.map(
                                ( val, index ) => {

                                    return (
                                        <tr key={ index } onClick={ () => history.push('/portal/issues/details/' + val.portal_issue_id) } className='pointer pointer-hover'>
                                            <td>{ index + 1 }</td>
                                            <td>{ val.pi_category }</td>
                                            <td>{ val.subject }</td>
                                            <td>
                                                <div style={{maxHeight: '80px', overflow: 'hidden'}}>
                                                    <span dangerouslySetInnerHTML={{ __html: val.description }}></span>
                                                </div>
                                            </td>
                                            <td>
                                                <b>{val.name}</b><br />
                                                {val.department_name}<br />
                                                {new Date(val.requested_at).toDateString() + ' ' + new Date(val.requested_at).toLocaleTimeString()}
                                            </td>
                                            <td>
                                                {
                                                    val.status === 'Pending'
                                                    ?
                                                    <b className="badge badge-pill badge-warning px-3">{ val.status }</b>
                                                    :
                                                    val.status === 'Resolved'
                                                    ?
                                                    <b className="badge badge-pill badge-success px-3">{ val.status }</b>
                                                    :
                                                    <b className="badge badge-pill badge-info px-3">{ val.status }</b>
                                                }<br />
                                                {val.support_at && (new Date(val.support_at).toDateString() + ' ' + new Date(val.support_at).toLocaleTimeString())}
                                            </td>
                                            <td>
                                                {
                                                    val.priority === 'Low'
                                                    ?
                                                    <b className="badge badge-pill badge-secondary px-3">{ val.priority }</b>
                                                    :
                                                    val.priority === 'Medium'
                                                    ?
                                                    <b className="badge badge-pill badge-info px-3">{ val.priority }</b>
                                                    :
                                                    <b className="badge badge-pill badge-danger px-3">{ val.priority }</b>
                                                }
                                            </td>
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
}