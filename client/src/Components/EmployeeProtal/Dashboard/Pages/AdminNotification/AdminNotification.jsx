/* eslint-disable eqeqeq */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/iframe-has-title */
import React, { useEffect, useState } from 'react';
import './Style.css';

import $ from 'jquery';
import Modal from '../../../../UI/Modal/Modal';
import axios from '../../../../../axios';
import JSAlert from 'js-alert';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSelector } from 'react-redux';

const AdminNotification = () => {
    let titleTimeout;
    const AccessControls = useSelector( ( state ) => state.EmpAuth.EmployeeData );

    const [notices, setNotices] = useState();
    const [whatsapp, setWhatsapp] = useState(false);
    const [noticeID, setNoticeID] = useState();
    const [modalData, setModalData] = useState();
    const [companies, setCompanies] = useState([]);
    const [locations, setLocations] = useState([]);
    const [_, setFile] = useState();

    useEffect(
        () => {
            loadNotices();
        }, []
    )
    useEffect(
        () => {
            if (whatsapp && $('#arr').length) {
                const arr = JSON.parse($('#arr').text());
                openWhatsAppModal(whatsapp, noticeID, arr);
            }
        }, [companies, locations, whatsapp]
    )
    const GetCompanies = () => {
        axios.get('/getallcompanies')
            .then(
                res => {
                    setCompanies(res.data);
                    if (locations.length === 0) GetLocations();
                }
            ).catch(
                err => {
                    console.log(err);
                }
            );
    }
    const GetLocations = () => {
        setLocations([]);
        axios.get('/getalllocations').then(
            res => {
                setLocations(res.data);
            }
        ).catch(
            err => {
                console.log(err);
            }
        )
    }
    const onAddNotice = (e) => {
        e.preventDefault();
        const title = e.target['title'].value;
        const files = e.target['file'].files;
        if (files.length === 0) {
            JSAlert.alert("Notice file is required.", "Validation Error", JSAlert.Icons.Warning);
            return false;
        } else if (title.trim().length < 5) {
            JSAlert.alert("Title must contains 5 characters.", "Validation Error", JSAlert.Icons.Warning);
            return false;
        } else if (files[0].type !== 'application/pdf' && files[0].type !== 'image/jpeg') {
            JSAlert.alert("Invalid file format.", "Validation Error", JSAlert.Icons.Warning);
            return false;
        }
        setModalData(
            <>
                <h6 className='text-center mb-0 p-3'><b>Adding Notice...</b></h6>
            </>
        );
        const Data = new FormData();
        Data.append('title', title);
        Data.append('type', files[0].type.split('/').pop());
        Data.append('file', files[0]);
        Data.append('upload_by', localStorage.getItem('EmpID'));
        axios.post(
            '/notice/new', Data,
            {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            }
        ).then(() => {
            setModalData();
            loadNotices();
            JSAlert.alert(`Notice has been created successfully`, "Success", JSAlert.Icons.Success).dismissIn(2000);
        }).catch(err => {
            createNew();
            console.log(err);
            JSAlert.alert(`Something went wrong, ${err}.`, "Request Failed", JSAlert.Icons.Failed);
        });
    }
    const onTitleChange = (e, id, prevTitle, index) => {
        clearTimeout(titleTimeout);
        const title = e.target.textContent;
        titleTimeout = setTimeout(() => {
            if (title.trim().length === 0) {
                $('#title').text(prevTitle);
            } else {
                axios.post('/notice/update/title', { id: id, title: title }).then(() => {
                    toast.dark(`Title has been updated successfully.`, { position: 'top-right', autoClose: 5000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true });
                    let arr = notices.slice();
                    arr[index].title = title;
                    setNotices(arr);
                }).catch(err => {
                    $('#title').text(prevTitle);
                    console.log(err);
                    JSAlert.alert(`${err}. Could not update the title.`, "Failed To Update", JSAlert.Icons.Failed);
                });
            }
        }, 1000);
    }
    const updateNewFile = (e, val, index) => {
        if (e.target.files[0].type !== 'application/pdf' && e.target.files[0].type !== 'image/jpeg') {
            JSAlert.alert("Invalid file format.", "Validation Error", JSAlert.Icons.Warning);
            return false;
        }
        setModalData(
            <>
                <h6 className='text-center mb-0 p-3'><b>Updating File...</b></h6>
            </>
        );
        const Data = new FormData();
        Data.append('type', e.target.files[0].type.split('/').pop());
        Data.append('file', e.target.files[0]);
        Data.append('id', val.id);
        Data.append('prevUrl', val.url);
        axios.post(
            '/notice/update/file',
            Data,
            {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            }
        ).then(res => {
            toast.dark(`File has been updated successfully.`, { position: 'top-right', autoClose: 5000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true });
            let arr = notices.slice();
            arr[index].url = res.data;
            arr[index].type = e.target.files[0].type.split('/').pop();
            setNotices(arr);
            setModalData();
        }).catch(err => {
            openDetails(val, index);
            console.log(err);
            JSAlert.alert(`${err}. Could not update the file.`, "Failed To Update", JSAlert.Icons.Failed);
        });
    }
    const openDetails = (val, index) => {
        const { id, url, title, status, upload_at, whatsapp_sent, whatsapp_sent_date, name } = val;
        setModalData(
            <>
                <h5 className='mb-0'>Notice Details</h5>
                <hr />
                <div className='d-flex'>
                    <div className='p-relative pr-1' style={{width: '60%'}}>
                        {
                            val.upload_by === parseInt(localStorage.getItem('EmpID'))
                            ?
                            <>
                                <input type='file' className='d-none' id="fileEditUpload" onChange={(e) => updateNewFile(e, val, index)} accept="image/jpeg, .pdf" />
                                <div className='editBtn' onClick={() => $('#fileEditUpload').trigger('click')}>
                                    <i className="las la-cloud-upload-alt"></i>
                                </div>
                            </>
                            :null
                        }
                        {
                            val.type === 'pdf'
                            ?
                            <iframe src={`${process.env.REACT_APP_SERVER}/assets/portal/assets/notices/${url}`} width="100%" style={{ minHeight: '300px', height: "100%" }}></iframe>
                            :
                            <img src={`${process.env.REACT_APP_SERVER}/assets/portal/assets/notices/${url}`} alt="news papers" width='100%' />
                        }
                    </div>
                    <div style={{width: '40%'}} className='pl-1 d-flex flex-column justify-content-between'>
                        <table className='table table-borderless'>
                            <tbody>
                                <tr>
                                    <td>
                                        <b>Title</b><br />
                                        <span id='title' contentEditable={val.upload_by === parseInt(localStorage.getItem('EmpID'))} onInput={(e) => onTitleChange(e, id, title, index)}>{title}</span>
                                    </td>
                                    <td>
                                        <b>Upload By</b><br />
                                        <span>{name}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <b>Status</b><br />
                                        <span>{status}</span>
                                    </td>
                                    <td>
                                        <b>Upload At</b><br />
                                        <span>{new Date(upload_at).toDateString()}</span><br />
                                        <span>{new Date(upload_at).toLocaleTimeString()}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <b>Whatsapp Sent</b><br />
                                        <span>{whatsapp_sent === 0 ? "No" : "Yes"}</span>
                                    </td>
                                    <td>
                                        <b>Whatsapp Sent Date</b><br />
                                        <span>{whatsapp_sent === 0 ? "-" : new Date(whatsapp_sent_date).toDateString()}</span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        {
                            JSON.parse(AccessControls.access).includes(70)
                            ?
                            <div className='text-right'>
                                {status === 'Active' && <button className='btn submit mt-2' onClick={() => openWhatsAppModal(url, id)}>Send WhatsApp Notification</button>}
                            </div>
                            :null
                        }
                    </div>
                </div>
            </>
        );
    }
    const onFileUpload = (event) => {
        const reader = new FileReader();
        reader.onload = () => {
            if (reader.readyState === 2) {
                if (event.target.files[0].type === 'application/pdf' || event.target.files[0].type === 'image/jpeg') {
                    setFile(event.target.files[0]);
                } else {
                    $('#file').val('');
                    JSAlert.alert("Invalid file format.", "Validation Error", JSAlert.Icons.Warning);
                    return false;
                }
            }
        }
        reader.readAsDataURL(event.target.files[0]);
    }
    const createNew = (title) => {
        setModalData(
            <>
                <form onSubmit={onAddNotice}>
                    <fieldset>
                        <h5 className='mb-0'>Add New Notice</h5>
                        <hr />
                        <label className='mb-0'><b>Notice Title</b></label>
                        <input type="text" className='form-control mb-2' required minLength={5} name='title' defaultValue={title ? title : ''} />
                        <label className='mb-0'><b>File</b></label>
                        <input id='file' type="file" className='form-control mb-2' required name='file' onChange={onFileUpload} accept="image/jpeg, .pdf" />
                        <button className='btn submit d-block ml-auto mt-2'>Add</button>
                    </fieldset>
                </form>
            </>
        )
    }
    const loadNotices = () => {
        axios.get('/notice/get_all_notices').then(res => {
            setNotices(res.data);
            if (companies.length === 0) GetCompanies();
        }).catch(err => {
            console.log(err);
            JSAlert.alert("Could not be able to load notices, retry again.", "Request Failed", JSAlert.Icons.Failed);
        });
    }
    const disableNotice = (id) => {
        setModalData(
            <>
                <h6 className='text-center mb-0 p-3'><b>Disabling Notice...</b></h6>
            </>
        );
        axios.post('/notice/disable', { id: id }).then(() => {
            setModalData();
            loadNotices();
            JSAlert.alert(`Notice has been disabled successfully`, "Success", JSAlert.Icons.Warning).dismissIn(2000);
        }).catch(err => {
            console.log(err);
            JSAlert.alert(`Something went wrong, ${err}.`, "Request Failed", JSAlert.Icons.Failed);
        });
    }
    const enableNotice = (id) => {
        setModalData(
            <>
                <h6 className='text-center mb-0 p-3'><b>Enabling Notice...</b></h6>
            </>
        );
        axios.post('/notice/enable', { id: id }).then(() => {
            setModalData();
            loadNotices();
            JSAlert.alert(`Notice has been enable successfully`, "Success", JSAlert.Icons.Success).dismissIn(2000);
        }).catch(err => {
            console.log(err);
            JSAlert.alert(`Something went wrong, ${err}.`, "Request Failed", JSAlert.Icons.Failed);
        });
    }
    const addRow = (e, id) => {
        e.preventDefault();

        const company = e.target['company'].value;
        const location = e.target['location'].value;
        const checkAll = e.target['checkAll'].checked;
        
        if (!JSON.parse(AccessControls.access).includes(70)) {
            JSAlert.alert("You don't have access!!", "Validation Error", JSAlert.Icons.Warning);
            return false;
        }
        if (!checkAll) {
            if (company.trim().length === 0 && location.trim().length === 0) {
                JSAlert.alert("Please fill atleast one field.", "Validation Error", JSAlert.Icons.Warning);
                return false;
            }
        }
        
        setModalData(
            <>
                <h6 className='text-center mb-0 p-3'><b>Sending WhatsApp Notification...</b></h6>
                <p className='text-center mb-0'>This may take a while, please wait or you can close this window.</p>
            </>
        );
        axios.post('/notice/send', { notice_id: noticeID, company: company, location: location, url: id, name: localStorage.getItem('name'), emp_id: localStorage.getItem("EmpID") }).then(() => {
            setModalData();
            loadNotices();
            JSAlert.alert(`Notice has been sent successfully`, "Success", JSAlert.Icons.Success).dismissIn(2000);
        }).catch(err => {
            console.log(err);
            JSAlert.alert(`Something went wrong, ${err}.`, "Request Failed", JSAlert.Icons.Failed);
        });
    }

    const sendToAll = (e) => {
        const {checked} = e.target;
        if (checked) {
            $('#company').prop('disabled', true);
            $('#location').prop('disabled', true);
        }else {
            $('#company').prop('disabled', false);
            $('#location').prop('disabled', false);
        }
    }

    const openWhatsAppModal = (id, notice_id, arr) => {
        setModalData(
            <>
                <h5 className='mb-0'>WhatsApp Notification</h5>
                <hr />
                <div id="arr" className='d-none'>{JSON.stringify(arr || [])}</div>
                <form onSubmit={(e) => addRow(e, id, notice_id)}>
                    <fieldset id="fieldset">
                        <table className='table table-sm table-borderless mb-0'>
                            <tbody>
                                <tr>
                                    <td>
                                        <label className='mb-0'><b>Company</b></label>
                                        <select className='form-control' id='company' name="company">
                                            <option value="">Select company</option>
                                            {
                                                companies.map(
                                                    ({ company_code, company_name }, i) => {
                                                        return <option value={company_code} key={i}>{company_name}</option>
                                                    }
                                                )
                                            }
                                        </select>
                                        <div className='d-flex align-items-center mt-3' onChange={sendToAll} style={{gap: 5, fontFamily: 'Roboto-Light'}}>
                                            <input type='checkbox' id="checkAll" name="checkAll" />
                                            Send To All
                                        </div>
                                    </td>
                                    <td>
                                        <label className='mb-0'><b>Location</b></label>
                                        <select className='form-control' id='location' name="location">
                                            <option value="">Select Location</option>
                                            {
                                                locations.map(
                                                    ({ location_code, location_name }, i) => {
                                                        return <option value={location_code} key={i}>{location_name}</option>
                                                    }
                                                )
                                            }
                                        </select>
                                        <button className='d-none' id="reset">Reset</button>
                                        <button className='btn submit d-block ml-auto mt-3'>Send</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </fieldset>
                </form>
            </>
        )
    }

    return (
        <>
            <div className='page admin_notification'>
                <ToastContainer />
                {modalData ? <Modal width='45%' show={true} Hide={() => { setModalData(false); setWhatsapp(); }} content={modalData} /> : null}
                <div className='page-content'>
                    <div className="d-flex align-items-center justify-content-between">
                        <h3 className="heading">
                            Notices Management
                            <sub>To manage all portal notices</sub>
                        </h3>
                        {
                            JSON.parse(AccessControls.access).includes(68)
                            ?
                            <button className='btn submit' onClick={() => createNew()}>New</button>
                            :null
                        }
                    </div>
                    <br />
                    {
                        notices
                        ?
                        <table className='table' style={{fontFamily: "Roboto-Light"}}>
                            <thead>
                                <tr>
                                    <th>Sr.No</th>
                                    <th>Notice</th>
                                    <th>Status</th>
                                    <th colSpan={2}>Upload At</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    notices.map(
                                        (val, index) => {
                                            const { title, upload_at, status, name, id } = val;
                                            return (
                                                <>
                                                    <tr className='pointer pointer-hover'>
                                                        <td onClick={() => openDetails(val, index)}>{index + 1}</td>
                                                        <td onClick={() => openDetails(val, index)}>{title}</td>
                                                        <td onClick={() => openDetails(val, index)}>{status}</td>
                                                        <td onClick={() => openDetails(val, index)}>
                                                            <b>{name}</b><br />
                                                            <span>{new Date(upload_at).toLocaleString()}</span>
                                                        </td>
                                                        <td>
                                                            {
                                                                !JSON.parse(AccessControls.access).includes(69)?null:
                                                                status === 'Active'
                                                                ?
                                                                <b className='text-danger d-block ml-auto' onClick={() => disableNotice(id)}>Disable</b>
                                                                :
                                                                <b className='text-success d-block ml-auto' onClick={() => enableNotice(id)}>Enable</b>
                                                            }
                                                        </td>
                                                    </tr>
                                                </>
                                            )
                                        }
                                    )
                                }
                            </tbody>
                        </table>
                        :
                        <h6 className='text-center'><b>Loading...</b></h6>
                    }
                </div>
            </div>
        </>
    )
}

export default AdminNotification;