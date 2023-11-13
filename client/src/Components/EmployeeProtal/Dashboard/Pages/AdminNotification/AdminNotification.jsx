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
                console.log('first');
                const arr = JSON.parse($('#arr').text());
                openWhatsAppModal(whatsapp, arr);
            }
        }, [companies, locations, whatsapp]
    )
    const GetCompanies = () => {
        axios.get('/getallcompanies')
            .then(
                res => {
                    setCompanies(res.data);
                }
            ).catch(
                err => {
                    console.log(err);
                }
            );
    }
    const GetLocations = (value) => {
        setLocations([]);
        axios.post('/getcompanylocations', {company_code: value}).then(
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
        const { id, url, title, status, upload_at, whatsapp_sent } = val;
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
                        {
                            JSON.parse(AccessControls.access).includes(70)
                            ?
                            <div className='text-right'>
                                {status === 'Active' && <button className='btn submit mt-2' onClick={() => openWhatsAppModal(url)}>Send WhatsApp Notification</button>}
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
                console.log()
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
    const addRow = (e, id, arr) => {
        e.preventDefault();
        // // RESTRICT MORE THAN 1 ROW
        // if ( arr && arr.length > 0 )
        // {
        //     alert('You can send notification for one location at a time!!!');
        //     return false;
        // }

        if ( arr && arr.length >= 1 ) {
            // console.log('arr[arr.length-1].location', arr[arr?.length-1]?.location)
            if ( arr[arr.length-1].location != 1 ) // Headoffice
            {
                JSAlert.alert("You can send notification for one location at a time!!", "Validation Error", JSAlert.Icons.Warning);
                return false;
            }
            if ( arr[arr.length-1].location == 1 && e.target['location'].value != 1 ) //Headoffice
            {
                JSAlert.alert("You can not select location other tha Head Office!!!", "Validation Error", JSAlert.Icons.Warning);
                return false;
            }
        }
        const company = e.target['company'].value;
        const companyName = $('#company').find('option:selected').text();
        const location = e.target['location'].value;
        const locationName = $('#location').find('option:selected').text();
        if (company.trim().length === 0) {
            JSAlert.alert("Company is required.", "Validation Error", JSAlert.Icons.Warning);
            return false;
        } else if (location.trim().length === 0) {
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
        console.log('before_push')
        list.push(obj);
        console.log('after_push')
        openWhatsAppModal(id, list);
    }
    const openWhatsAppModal = (id, arr) => {
        const AllLocationsIncludeOrNot = arr ? arr.findIndex(val => val.location_name === 'all') : -1;
        console.log('arr_in_openWhatsAppModal', arr);
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
                                    <select className='form-control' id='company' onChange={(e) => GetLocations(e.target.value)} name="company" required>
                                        <option value="">Select company</option>
                                        {
                                            companies.map(
                                                ({ company_code, company_name }, i) => {
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
                                                ({ location_code, location_name }, i) => {
                                                    return <option value={location_code} key={i}>{location_name}</option>
                                                }
                                            )
                                        }
                                    </select>
                                    <button className='d-none' id="reset">Reset</button>
                                    {AllLocationsIncludeOrNot < 0 ? <button className='btn submit d-block ml-auto mt-3'>Add</button> : null}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </form>
                {
                    arr && arr.length > 0
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
                                        ({ companyName, locationName }, i) => {
                                            return (
                                                <tr key={i}>
                                                    <td>{i + 1}</td>
                                                    <td>{companyName}</td>
                                                    <td>{locationName}</td>
                                                </tr>
                                            )
                                        }
                                    )
                                }
                            </tbody>
                        </table>
                        : null
                }
                {
                    arr && arr.length > 0
                    ?
                    <button className='btn submit d-block ml-auto' onClick={SendNotification}>Send</button>
                    : null
                }
            </>
        )
    }
    const SendNotification = () => {
        if (!JSON.parse(AccessControls.access).includes(70)) {
            JSAlert.alert("You don't have access!!", "Validation Error", JSAlert.Icons.Warning);
            return false;
        }
        
        const arr = $('#arr').text();
        const id = whatsapp;
        setModalData(
            <>
                <h6 className='text-center mb-0 p-3'><b>Sending WhatsApp Notification...</b></h6>
                <p className='text-center mb-0'>This may take a while, please wait or you can close this window.</p>
            </>
        );
        axios.post('/notice/send', { arr: arr, url: id, name: localStorage.getItem('name'), emp_id: localStorage.getItem("EmpID") }).then(() => {
            setModalData();
            loadNotices();
            JSAlert.alert(`Notice has been sent successfully`, "Success", JSAlert.Icons.Success).dismissIn(2000);
        }).catch(err => {
            console.log(err);
            JSAlert.alert(`Something went wrong, ${err}.`, "Request Failed", JSAlert.Icons.Failed);
        });
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
                        <table className='table'>
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
                                                                <button className='btn cancle d-block ml-auto' onClick={() => disableNotice(id)}>Disable</button>
                                                                :
                                                                <button className='btn green d-block ml-auto' onClick={() => enableNotice(id)}>Enable</button>
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