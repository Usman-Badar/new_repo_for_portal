/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from 'react';
import './Style.css';
import { Switch, Route, useHistory } from 'react-router-dom';
import moment from 'moment';
import axios from '../../../../../axios';
import ReactQuill from 'react-quill';
import $ from 'jquery';
import JSAlert from 'js-alert';

const PortalIssues = () => {
    const history = useHistory();
    return (
        <div className="portal_issues page">
            <div className='page-content'>
                <Switch>
                        <Route exact path="/portal/issues" render={ 
                            () => (
                                <IssuesListView 
                                    history={history}
                                />
                            )
                        } />
                        <Route exact path="/portal/issues/new" render={ 
                            () => (
                                <NewIssue 
                                    history={history}
                                />
                            )
                        } />
                        <Route exact path="/portal/issues/details/:id" render={ 
                            () => (
                                <IssueDetails 
                                    history={history}
                                />
                            )
                        } />
                </Switch>
            </div>
        </div>
    )
}

export default PortalIssues;

const IssueDetails = ({ history }) => {
    const [ details, setDetails ] = useState();

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

    if (!details) {
        return <h6 className="text-center mb-0">Loading...</h6>
    }
    return (
        <>
            <div className="d-flex align-items-center justify-content-between">
                <h3 className="heading">
                    {details.subject}
                    <sub>Subject of the report (Portal Issue)</sub>
                </h3>
                <button className="btn light" onClick={ () => history.goBack() }>
                    Back
                </button>
            </div>
            <hr />
            <table className='table table-borderless'>
                <tbody>
                    <tr>
                        <td>
                            <b>Request By</b><br />
                            <span>{details.request_emp_name}</span><br />
                            <span>{details.request_emp_dept}</span><br />
                            <span>{new Date(details.requested_at).toDateString()} {new Date(details.requested_at).toLocaleTimeString()}</span>
                        </td>
                        {
                            details.support_emp_name
                            ?
                            <td>
                                <b>Support By</b><br />
                                <span>{details.support_emp_name}</span><br />
                                <span>{details.support_emp_dept}</span><br />
                                <span>{new Date(details.support_at).toDateString()} {new Date(details.support_at).toLocaleTimeString()}</span>
                            </td>
                            :null
                        }
                        <td>
                            <b>Category</b><br />
                            <span>{details.pi_category}</span>
                        </td>
                        <td>
                            <b>Issue Date</b><br />
                            <span>{new Date(details.issue_date).toDateString()}</span>
                        </td>
                        <td>
                            <b>Status</b><br />
                            <span>{details.status}</span>
                        </td>
                        <td>
                            <b>Priority</b><br />
                            {
                                localStorage.getItem("EmpID") === '5000'
                                ?
                                <select className="form-control w-50">
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
            <h6><b>Description</b></h6>
            <hr />
            <span className='description' dangerouslySetInnerHTML={{__html: details.description}}></span>
        </>
    )
}

const IssuesListView = ({ history }) => {
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
        axios.post(
            '/portal/issues/list',
            {
                requested_by: localStorage.getItem('EmpID')
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
                <li className="nav-item" onClick={ () => { setStatus('pending'); sessionStorage.setItem('reportingStatus', 'pending') } }>
                    <a className={ status === 'pending' ? 'nav-link active text-capitalize' : 'nav-link text-capitalize' }>
                        { 'pending' } { status === 'pending' ? `(${issues?issues.length:0})` : "" }
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
                <table className='table popUps'>
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
                                                    :null
                                                }
                                            </td>
                                            <td>
                                                {
                                                    val.priority === 'Low'
                                                    ?
                                                    <b className="badge badge-pill badge-light px-3">{ val.priority }</b>
                                                    :null
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

const NewIssue = ({ history }) => {
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
            <div className="page-content">
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
                        <input type="text" name='subject' className="form-control mb-2" maxLength={30} required />
                        <label className='mb-0 font-weight-bold'>Description</label>
                        <ReactQuill style={{ backgroundColor: "#fff" }} theme="snow" modules={modules} formats={formats} value={description} onChange={setDescription} />
                        <button className='btn submit d-block ml-auto mt-3'>Submit</button>
                    </fieldset>
                </form>
            </div>
        </>
    )
}