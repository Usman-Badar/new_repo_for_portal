/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/iframe-has-title */
import React, { useEffect, useState } from 'react';
import './AdminNotification.css';

import $ from 'jquery';
import Modal from '../../../../UI/Modal/Modal';
import axios from '../../../../../axios';
import JSAlert from 'js-alert';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminNotification = () => {
    let titleTimeout;

    const [notices, setNotices] = useState();
    const [whatsapp, setWhatsapp] = useState(false);
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
            if (whatsapp) openWhatsAppModal(whatsapp);
        }, [companies, locations, whatsapp]
    )
    const GetCompanies = () => {
        axios.get('/getallcompanies')
        .then(
            res => {
                setCompanies(res.data);
                GetLocations();
            }
        ).catch(
            err => {
                console.log(err);
            }
        );
    }
    const GetLocations = () => {
        axios.get('/getalllocations').then(
            res => {
                setLocations( res.data );
            }
        ).catch(
            err => {
                console.log( err );
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
        }else if (title.trim().length < 5) {
            JSAlert.alert("Title must contains 5 characters.", "Validation Error", JSAlert.Icons.Warning);
            return false;
        }else if (files[0].type !== 'application/pdf' && files[0].type !== 'image/jpeg') {
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
        } ).catch( err => {
            createNew();
            console.log(err);
            JSAlert.alert(`Something went wrong, ${err}.`, "Request Failed", JSAlert.Icons.Failed);
        } );
    }
    const onTitleChange = (e, id, prevTitle, index) => {
        clearTimeout(titleTimeout);
        const title = e.target.textContent;
        titleTimeout = setTimeout(() => {
            if (title.trim().length === 0) {
                $('#title').text(prevTitle);
            }else {
                axios.post('/notice/update/title', {id: id, title: title}).then(() => {
                    toast.dark(`Title has been updated successfully.`, { position: 'top-right', autoClose: 5000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true});
                    let arr = notices.slice();
                    arr[index].title = title;
                    setNotices(arr);
                }).catch( err => {
                    $('#title').text(prevTitle);
                    console.log(err);
                    JSAlert.alert(`${err}. Could not update the title.`, "Failed To Update", JSAlert.Icons.Failed);
                } );
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
            toast.dark(`File has been updated successfully.`, { position: 'top-right', autoClose: 5000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true});
            let arr = notices.slice();
            arr[index].url = res.data;
            arr[index].type = e.target.files[0].type.split('/').pop();
            setNotices(arr);
            setModalData();
        }).catch( err => {
            openDetails(val, index);
            console.log(err);
            JSAlert.alert(`${err}. Could not update the file.`, "Failed To Update", JSAlert.Icons.Failed);
        } );
    }
    const openDetails = (val, index) => {
        const { id, url, title, status, upload_at, whatsapp_sent } = val;
        setModalData(
            <>
                <h5 className='mb-0'>Notice Details</h5>
                <hr />
                <div className='d-flex'>
                    <div className='p-relative w-50 pr-1'>
                    <input type='file' className='d-none' id="fileEditUpload" onChange={(e) => updateNewFile(e, val, index)} accept="image/jpeg, .pdf" />
                    <div className='editBtn' onClick={() => $('#fileEditUpload').trigger('click')}>
                        <i className="las la-cloud-upload-alt"></i>
                    </div>
                    {
                        val.type === 'pdf'
                        ?
                        <iframe src={`${process.env.REACT_APP_SERVER}/assets/portal/assets/notices/${url}`} width="100%" style={{ minHeight: '300px', height: "100%" }}></iframe>
                        :
                        <img src={`${process.env.REACT_APP_SERVER}/assets/portal/assets/notices/${url}`} alt="news papers" width='100%' />
                    }
                    </div>
                    <div className='w-50 pl-1 d-flex flex-column justify-content-between'>
                        <table className='table table-borderless'>
                            <tbody>
                                <tr>
                                    <td>
                                        <b>Title</b><br />
                                        <span id='title' contentEditable onInput={(e) => onTitleChange(e, id, title, index)}>{title}</span>
                                    </td>
                                    <td>
                                        <b>Upload Date</b><br />
                                        <span>{new Date(upload_at).toDateString()}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <b>Status</b><br />
                                        <span>{status}</span>
                                    </td>
                                    <td>
                                        <b>Upload Time</b><br />
                                        <span>{new Date(upload_at).toLocaleTimeString()}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan={2}>
                                        <b>Whatsapp Sent</b><br />
                                        <span>{whatsapp_sent === 0 ? "No" : "Yes"}</span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <div className='text-right'>
                            {
                                status === 'Active'
                                ?
                                <>
                                    <button className='btn cancle' onDoubleClick={() => disableNotice(id)}>Disable</button>
                                    <button className='btn submit mt-2' onClick={() => openWhatsAppModal(url)}>Send Whatsapp Notification</button>
                                </>
                                :
                                <button className='btn green' onDoubleClick={() => enableNotice(id)}>Enable</button>
                            }
                        </div>
                    </div>
                </div>
            </>
        );
    }
    const onFileUpload = (event) => {
        const reader = new FileReader();
        reader.onload = () => {
            if (reader.readyState === 2) {
                console.log()
                if (event.target.files[0].type === 'application/pdf' || event.target.files[0].type === 'image/jpeg') {
                    setFile(event.target.files[0]);
                }else {
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
                        <input type="text" className='form-control mb-2' required minLength={5} name='title' defaultValue={title?title:''} />
                        <label className='mb-0'><b>File</b></label>
                        <input id='file' type="file" className='form-control mb-2' required name='file' onChange={onFileUpload} accept="image/jpeg, .pdf" />
                        <button className='btn submit d-block ml-auto mt-2'>Add</button>
                    </fieldset>
                </form>
            </>
        )
    }
    const loadNotices = () => {
        axios.post('/get_all_notices').then( res => {
            setNotices(res.data);
            if (companies.length === 0) GetCompanies();
        } ).catch( err => {
            console.log(err);
            JSAlert.alert("Could not be able to load notices, retry again.", "Request Failed", JSAlert.Icons.Failed);
        } );
    }
    const disableNotice = (id) => {
        setModalData(
            <>
                <h6 className='text-center mb-0 p-3'><b>Disabling Notice...</b></h6>
            </>
        );
        axios.post('/notice/disable', {id: id}).then(() => {
            setModalData();
            loadNotices();
            JSAlert.alert(`Notice has been disabled successfully`, "Success", JSAlert.Icons.Warning).dismissIn(2000);
        }).catch( err => {
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
        axios.post('/notice/enable', {id: id}).then(() => {
            setModalData();
            loadNotices();
            JSAlert.alert(`Notice has been enable successfully`, "Success", JSAlert.Icons.Success).dismissIn(2000);
        }).catch( err => {
            console.log(err);
            JSAlert.alert(`Something went wrong, ${err}.`, "Request Failed", JSAlert.Icons.Failed);
        });
    }
    const addRow = (e, id, arr) => {
        e.preventDefault();
        const company = e.target['company'].value;
        const companyName = $('#company').find('option:selected').text();
        const location = e.target['location'].value;
        const locationName = $('#location').find('option:selected').text();
        if (company.trim().length === 0) {
            JSAlert.alert("Company is required.", "Validation Error", JSAlert.Icons.Warning);
            return false;
        }else if (location.trim().length === 0) {
            JSAlert.alert("Location is required.", "Validation Error", JSAlert.Icons.Warning);
            return false;
        }
        const obj = {
            company: company,
            companyName: companyName,
            location: location,
            locationName: locationName
        };
        const list = arr || [];
        list.push(obj);
        openWhatsAppModal(id, list);
    }
    const openWhatsAppModal = (id, arr) => {
        setWhatsapp(id);
        setModalData(
            <>
                <h5 className='mb-0'>WhatsApp Notification</h5>
                <hr />
                <div id="arr" className='d-none'>{JSON.stringify(arr || [])}</div>
                <form onSubmit={(e) => addRow(e, id, arr)}>
                    <table className='table table-sm table-borderless'>
                        <tbody>
                            <tr>
                                <td>
                                    <label className='mb-0'><b>Company</b></label>
                                    <select className='form-control' id='company' name="company" required>
                                        <option value="">Select company</option>
                                        {
                                            companies.map(
                                                ({company_code, company_name}, i) => {
                                                    return <option value={company_code} key={i}>{company_name}</option>
                                                }
                                            )
                                        }
                                    </select>
                                </td>
                                <td>
                                    <label className='mb-0'><b>Location</b></label>
                                    <select className='form-control' id='location' name="location" required>
                                        <option value="all">All Locations</option>
                                        {
                                            locations.map(
                                                ({location_code, location_name}, i) => {
                                                    return <option value={location_code} key={i}>{location_name}</option>
                                                }
                                            )
                                        }
                                    </select>
                                    <button className='d-none' id="reset">Reset</button>
                                    <button className='btn submit d-block ml-auto mt-3'>Add</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </form>
                {
                    arr
                    ?
                    <table className='table table-sm'>
                        <thead>
                            <tr>
                                <th>Sr.No</th>
                                <th>Company</th>
                                <th>Location</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                arr.map(
                                    ({companyName, locationName}, i) => {
                                        return (
                                            <tr key={i}>
                                                <td>{i+1}</td>
                                                <td>{companyName}</td>
                                                <td>{locationName}</td>
                                            </tr>
                                        )
                                    }
                                )
                            }
                        </tbody>
                    </table>
                    :null
                }
                {
                    arr
                    ?
                    <button className='btn submit d-block ml-auto' onClick={SendNotification}>Send</button>
                    :null
                }
            </>
        )
    }
    const SendNotification = () => {
        const arr = $('#arr').text();
        const id = whatsapp;
        setModalData(
            <>
                <h6 className='text-center mb-0 p-3'><b>Sending WhatsApp Notification...</b></h6>
                <p className='text-center mb-0'>This may take a while, please wait or you can close this window.</p>
            </>
        );
        axios.post('/notice/send', {arr: arr, url: id}).then(() => {
            setModalData();
            loadNotices();
            JSAlert.alert(`Notice has been sent successfully`, "Success", JSAlert.Icons.Success).dismissIn(2000);
        }).catch( err => {
            console.log(err);
            JSAlert.alert(`Something went wrong, ${err}.`, "Request Failed", JSAlert.Icons.Failed);
        });
    }

    return (
        <>
            <div className='page admin_notification'>
                <ToastContainer />
                {modalData ? <Modal width='50%' show={true} Hide={() => {setModalData(false); setWhatsapp();}} content={modalData} /> : null}
                <div className='page-content'>
                    <div className="d-flex align-items-center justify-content-between">
                        <h3 className="heading">
                            Notices Management
                            <sub>To manage all portal notices</sub>
                        </h3>
                        <button className='btn submit' onClick={() => createNew()}>New</button>
                    </div>
                    <br />
                    {
                        notices
                        ?
                        <table className='table'>
                            <thead>
                                <tr>
                                    <th>Sr.No</th>
                                    <th>Notice</th>
                                    <th>Status</th>
                                    <th>Upload Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    notices.map(
                                        (val, index) => {
                                            const { title, upload_at, status } = val;
                                            return (
                                                <>
                                                    <tr className='pointer pointer-hover' onClick={() => openDetails(val, index)}>
                                                        <td>{index+1}</td>
                                                        <td>{title}</td>
                                                        <td>{status}</td>
                                                        <td>{new Date(upload_at).toLocaleString()}</td>
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