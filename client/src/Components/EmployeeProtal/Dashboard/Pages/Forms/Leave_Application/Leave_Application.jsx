/* eslint-disable eqeqeq */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import $ from 'jquery';
import './Leave_Application.css';
import JSAlert from 'js-alert';
import EmployeeLeaveApplicationForm from './Component/Employee_Leave_Application_Form/Employee_Leave_Application_Form';

import axios from '../../../../../../axios';

import { useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Loading from '../../../../../UI/Loading/Loading';
import Mail from '../../../../../UI/Mail/Mail';
import { useHistory } from 'react-router-dom';
import printJS from 'print-js';
import Model from '../../../../../UI/Modal/Modal';
import LoadingImg from '../../../../../../images/loadingIcons/icons8-iphone-spinner.gif';

const Leave_Application = () => {

    const moment = require('moment');
    const history = useHistory();
    const Relations = useSelector((state) => state.EmpAuth.Relations);
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    const [ModalShow, setModalShow] = useState(false);
    const [ModalContent, setModalContent] = useState();
    const [Data, setData] = useState([]);
    const [Type, setType] = useState();
    const [MailData, setMailData] = useState(
        {
            subject: "",
            send_to: "",
            gender: "",
            receiver: "",
            message: ""
        }
    );
    const [Leaves, setLeaves] = useState();
    const [Recent, setRecent] = useState([]);
    const [PrevLeave, setPrevLeave] = useState();
    const [StartLoading, setStartLoading] = useState(true); // For show Loading page or hide
    const [Content, setContent] = useState(true)
    const [ShortLeaveData, setShortLeaveData] = useState(
        {
            ShortLeaveTime: '', ShortLeaveEndTime: '', ShortLeaveDate: '', ShortLeaveReason: '', submit_to: ''
        }
    )

    useEffect(
        () => {

            $('button[type="reset"]').on(
                'click', () => {

                    setShortLeaveData(
                        {
                            ShortLeaveTime: '', ShortLeaveEndTime: '', ShortLeaveDate: '', ShortLeaveReason: '', submit_to: ''
                        }
                    )

                }
            )

            $('.divs').hide(0);
            setData(
                [
                    {
                        icon: 'las la-male',
                        txt: 'Short Leave Form',
                        link: false, // || true
                        func: () => ShowShortLeaveForm()
                    },
                    {
                        icon: 'las la-home',
                        txt: 'Leave Form',
                        link: false, // || true
                        func: () => ShowLeaveForm()
                    },
                    {
                        icon: 'las la-male',
                        txt: 'Avail Leave Form',
                        link: false, // || true
                        func: () => ShowAvailLeaveForm()
                    },
                    {
                        icon: 'las la-history',
                        txt: 'History',
                        link: false, // || true
                        func: () => ShowHistory()
                    }
                ]
            );
            if (history.location.pathname === '/short_leave_form') {
                $('.Short_Leave_Form').show();
            } else
                if (history.location.pathname === '/leave_form') {
                    $('.Employee_Leave_App_Form').show();
                    setContent(<EmployeeLeaveApplicationForm Relations={Relations} availed='0' type='LeaveForm' Mainheading='Leave Request' heading='Purpose of Leave' />);
                } else
                    if (history.location.pathname === '/avail_leave_form') {
                        $('.Employee_Leave_App_Form').show();
                        setContent(<EmployeeLeaveApplicationForm Relations={Relations} availed='1' type='AvailLeaveForm' Mainheading='Availed Leave Request' heading="Reason" />);
                    } else
                        if (history.location.pathname === '/leave_history' || history.location.pathname.includes('/leave_request/')) {
                            $('.History').show();
                            if (history.location.pathname.includes('/leave_request/')) {
                                getDetails(history.location.pathname.split('/').pop());
                            }else
                            {
                                GetRecentLeave('/getallrecentleaves', { empID: localStorage.getItem('EmpID') })
                            }
                        }

        }, [history]
    )

    useEffect(
        () => {

            for (let x = 0; x < Relations.length; x++) {
                if (parseInt(Relations[x].sr) === parseInt(ShortLeaveData.submit_to)) {
                    setMailData(
                        {
                            subject: "New Short Leave",
                            send_to: Relations[x].email,
                            gender: Relations[x].gender === 'FeMale' ? "Madam" : "Sir",
                            receiver: Relations[x].name,
                            message: localStorage.getItem('name') + ' apply for a short leave on the portal'
                        }
                    );
                }
            }

        }, [ShortLeaveData.submit_to]
    )

    const ShowShortLeaveForm = () => {
        history.replace('/short_leave_form');
    }
    const ShowLeaveForm = () => {
        history.replace('/leave_form');
    }
    const ShowAvailLeaveForm = () => {
        history.replace('/avail_leave_form');
    }

    const ShowHistory = () => {

        history.replace('/leave_history');

    }

    const onChangeHandler = (e) => {

        const { name, value } = e.target;
        const val = {
            ...ShortLeaveData,
            [name]: value
        }

        setShortLeaveData(val);

    }

    const OnTakeShortLeave = (e) => {

        e.preventDefault();
        if ( ShortLeaveData.ShortLeaveTime === '' || ShortLeaveData.ShortLeaveDate === '' || ShortLeaveData.ShortLeaveReason === '' ) {
            JSAlert.alert("Please fill all the fields", "Warning", JSAlert.Icons.Warning).dismissIn(1000 * 4);
            return false;
        }
        if (days[new Date(ShortLeaveData.ShortLeaveDate).getDay()] === 'Sunday') {
            JSAlert.alert("Sunday could not be selected as a date.", "Warning", JSAlert.Icons.Warning).dismissIn(1000 * 4);
            return false;
        }
        if (ShortLeaveData.ShortLeaveReason.trim().length < 30) {
            JSAlert.alert("Reason should be greater than 30 characters.", "Warning", JSAlert.Icons.Warning).dismissIn(1000 * 4);
            return false;
        }

        setStartLoading(true);
        $('fieldset').prop('disabled', true);
        setModalContent(
            <>
                <div className='d-flex flex-column justify-content-center align-items-center'>
                    <img src={LoadingImg} width="50" height="50" alt="Loading..." />
                    <p className='mb-0 mt-2'>Please Wait....</p>
                </div>
            </>
        );
        setModalShow(true);

        const Data = new FormData();
        Data.append('ShortLeaveTime', ShortLeaveData.ShortLeaveTime);
        Data.append('ShortLeaveEndTime', ShortLeaveData.ShortLeaveEndTime);
        Data.append('ShortLeaveDate', ShortLeaveData.ShortLeaveDate);
        Data.append('ShortLeaveReason', ShortLeaveData.ShortLeaveReason);
        Data.append('RequestedBy', localStorage.getItem('EmpID'));
        Data.append('RequestedTo', ShortLeaveData.submit_to);

        axios.post('/applyshortleave', Data).then(() => {
            JSAlert.alert("Request has been sent successfully.", "Success", JSAlert.Icons.Success).dismissIn(1000 * 2);
            setStartLoading(false);
            setModalContent(<></>);
            setModalShow(false);
            $('fieldset').prop('disabled', false);
            $('button[type=reset]').trigger('click');
        }).catch(err => {
            $('fieldset').prop('disabled', false);
            setStartLoading(false);
            setModalContent(<></>);
            setModalShow(false);
            JSAlert.alert(`Something went wrong: ${err}`, "Error Found", JSAlert.Icons.Failed).dismissIn(1000 * 4);
        });
    }

    const GetHistorySorted = (type) => {

        const Data = new FormData();
        Data.append('empID', localStorage.getItem('EmpID'));
        setLeaves([]);

        if (type === 'Leaves') {

            GetLeave('/getallleaves', Data);

        } else if (type === 'shortLeaves') {

            GetLeave('/getallshortleaves', Data);

        }

    }

    const GetRecentLeave = (Url, Data) => {

        axios.post(Url, Data).then(res => {

            setRecent(res.data);

        }).catch(err => {

            toast.dark(err.toString(), {
                position: 'bottom-right',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            console.log(err);

        });

    }

    const GetLeave = (Url, Data) => {

        axios.post(Url, Data).then(res => {

            setLeaves(res.data);

        }).catch(err => {

            toast.dark(err.toString(), {
                position: 'bottom-right',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            console.log(err);

        });

    }

    const openLeave = (index, type, leaves) => {

        let leave_id = leaves === 'recent' ? Recent[index].leave_id : Leaves[index].leave_id

        history.replace('/leave_request/' + leave_id + '_' + type);

    }

    const getDetails = (id) => {

        const leave_id = id.split('_').shift();
        const type = id.split('_').pop();
        axios.post('/getmyleavedetails', { leave_id: leave_id, type: type, emp_id: localStorage.getItem('EmpID') }).then(res => {

            setType(type);
            setPrevLeave(res.data[0]);
            setData(
                [
                    {
                        icon: 'las la-male',
                        txt: 'Short Leave Form',
                        link: false, // || true
                        func: () => ShowShortLeaveForm()
                    },
                    {
                        icon: 'las la-home',
                        txt: 'Leave Form',
                        link: false, // || true
                        func: () => ShowLeaveForm()
                    },
                    {
                        icon: 'las la-male',
                        txt: 'Avail Leave Form',
                        link: false, // || true
                        func: () => ShowAvailLeaveForm()
                    },
                    {
                        icon: 'las la-history',
                        txt: 'History',
                        link: false, // || true
                        func: () => ShowHistory()
                    },
                    {
                        icon: 'las la-print',
                        txt: 'Print',
                        link: false, // || true
                        func: () => printLeave()
                    },
                    parseInt(res.data[0].requested_by) !== parseInt(localStorage.getItem('EmpID')) &&
                        (res.data[0].request_status.toLowerCase() === 'viewed' || res.data[0].request_status.toLowerCase() === 'sent')
                        ?
                        {
                            icon: 'las la-check-circle',
                            txt: 'Approve',
                            link: false, // || true
                            func: () => approveLeave(res.data[0])
                        }
                        : undefined,
                    parseInt(res.data[0].requested_by) !== parseInt(localStorage.getItem('EmpID')) &&
                        (res.data[0].request_status.toLowerCase() === 'viewed' || res.data[0].request_status.toLowerCase() === 'sent')
                        ?
                        {
                            icon: 'lar la-hand-paper',
                            txt: 'Reject',
                            link: false, // || true
                            func: () => rejectLeave(res.data[0])
                        }
                        : undefined,
                    parseInt(res.data[0].requested_by) !== parseInt(localStorage.getItem('EmpID')) &&
                        res.data[0].request_status.toLowerCase() === 'accepted' &&
                        parseInt(res.data[0].authorized_to) === parseInt(localStorage.getItem('EmpID'))
                        ?
                        {
                            icon: 'las la-print',
                            txt: 'Authorize',
                            link: false, // || true
                            func: () => authorizeLeave(res.data[0])
                        }
                        : undefined
                ]
            );

        }).catch(err => {

            console.log(err);

        });

    }

    const printLeave = () => {

        $('#controls_btns').addClass("d-none");

        printJS(
            {
                printable: 'leaveApp',
                type: 'html',
                targetStyles: ['*'],
                css: [
                    "https://fonts.googleapis.com/css2?family=Cinzel&family=Oxygen:wght@300&display=swap",
                    "https://fonts.googleapis.com/css?family=Tangerine"
                ],
                font_size: ''
            }
        );
        
        $('#controls_btns').removeClass("d-none");

    }

    const cancelRequest = (e, obj) => {

        e.preventDefault();
        const remarks = e.target['remarks'].value.trim();
        if (remarks.length < 10) {
            JSAlert.alert("Remarks should be greater than 10 characters.", "Warning", JSAlert.Icons.Warning).dismissIn(1000 * 4);
            return false;
        }

        const objects = {
            leave_id: obj.leave_id,
            remarks: e.target['remarks'].value,
            type: history.location.pathname.split('/').pop().split('_').pop(),
            submit_by: obj.requested_by,
            submit_to: obj.received_by
        }
        setModalContent(
            <>
                <div className='d-flex flex-column justify-content-center align-items-center'>
                    <img src={LoadingImg} width="50" height="50" alt="Loading..." />
                    <p className='mb-0 mt-2'>Please Wait....</p>
                </div>
            </>
        )

        axios.post('/cancel_leave', objects).then(() => {
            JSAlert.alert(`Request has been cancelled.`, "Success", JSAlert.Icons.Information).dismissIn(1000 * 2);
            setTimeout(() => {
                ShowHistory();
            }, 2000);
        }).catch(
            err => {
                JSAlert.alert(`Something went wrong: ${err}`, "Error Found", JSAlert.Icons.Failed).dismissIn(1000 * 2);
                ShowHideModal();
                cancelLeave(obj, remarks);
            }
        )

    }

    const cancelLeave = (obj, remarks) => {

        ShowHideModal();
        setModalContent(
            <>
                <h6>
                    Do You Want To Cancel This Request?
                </h6>
                <div className="up text-right">
                    <button className="px-3 btn green" onClick={() => openClose('down', 'up')}>Yes</button>
                </div>
                <div className="down text-right">
                    <form onSubmit={(e) => cancelRequest(e, obj)}>
                        <textarea className="form-control" name="remarks" minLength={10} defaultValue={remarks?remarks:''} placeholder="Your remarks..." required></textarea>
                        <button type='submit' className="px-3 btn green mt-3">Confirm</button>
                    </form>
                </div>
            </>
        )

    }

    const openClose = (open, close) => {

        $('.' + close).slideUp(500);
        $('.' + open).slideDown(500);

    }

    const ShowHideModal = () => {

        if (ModalShow) {
            setModalShow(false);
        } else {
            setModalShow(true);
        }

    }

    const rejectRequest = (e, obj) => {

        e.preventDefault();
        const remarks = e.target['remarks'].value.trim();

        if (remarks.length < 10) {
            JSAlert.alert("Remarks should be greater than 10 characters.", "Warning", JSAlert.Icons.Warning).dismissIn(1000 * 4);
            return false;
        }

        const objects = {
            leave_id: obj.leave_id,
            remarks: e.target['remarks'].value,
            type: history.location.pathname.split('/').pop().split('_').pop(),
            emp_id: localStorage.getItem('EmpID'),
            submit_by: obj.requested_by,
            leaveFrom: obj.leave_from,
            leaveTo: obj.leave_to,
            date: obj.date,
            oneDayLeave: obj.one_day_leave
        }
        setModalContent(
            <>
                <div className='d-flex flex-column justify-content-center align-items-center'>
                    <img src={LoadingImg} width="50" height="50" alt="Loading..." />
                    <p className='mb-0 mt-2'>Please Wait....</p>
                </div>
            </>
        )
        axios.post('/reject_leave', objects).then(() => {
            JSAlert.alert(`Request has been rejected.`, "Success", JSAlert.Icons.Information).dismissIn(1000 * 2);
            setTimeout(() => {
                ShowHistory();
            }, 2000);
        }).catch(
            err => {
                JSAlert.alert(`Something went wrong: ${err}`, "Error Found", JSAlert.Icons.Failed).dismissIn(1000 * 2);
                ShowHideModal();
                rejectLeave(obj, remarks);
            }
        )

    }

    const rejectLeave = (obj, remarks) => {

        ShowHideModal();
        setModalContent(
            <>
                <h6>
                    Do You Want To Reject This Request?
                </h6>
                <div className="up text-right">
                    <button className="px-3 btn submit" onClick={() => openClose('down', 'up')}>Yes</button>
                </div>
                <div className="down text-right">
                    <form onSubmit={(e) => rejectRequest(e, obj)}>
                        <textarea className="form-control" name="remarks" defaultValue={remarks?remarks:''} minLength={10} placeholder="Your remarks...." required></textarea>
                        <button type='submit' className="px-3 btn cancle mt-3">Confirm</button>
                    </form>
                </div>
            </>
        )

    }

    const approveRequest = (e, obj) => {
        e.preventDefault();
        const remarks = e.target['remarks'].value.trim();
        const submit_to = e.target['submit_to'].value;

        if (remarks.length < 10) {
            JSAlert.alert("Remarks should be greater than 10 characters.", "Warning", JSAlert.Icons.Warning).dismissIn(1000 * 4);
            return false;
        }

        if (submit_to === '') {
            JSAlert.alert("[Submit To] field should not be empty.", "Warning", JSAlert.Icons.Warning).dismissIn(1000 * 4);
            return false;
        }

        const objects = {
            leave_id: obj.leave_id,
            remarks: e.target['remarks'].value,
            type: history.location.pathname.split('/').pop().split('_').pop(),
            emp_id: localStorage.getItem('EmpID'),
            submit_to: e.target['submit_to'].value,
            submit_by: obj.requested_by,
        }
        setModalContent(
            <>
                <div className='d-flex flex-column justify-content-center align-items-center'>
                    <img src={LoadingImg} width="50" height="50" alt="Loading..." />
                    <p className='mb-0 mt-2'>Please Wait....</p>
                </div>
            </>
        )
        axios.post('/approve_leave', objects).then(() => {
            JSAlert.alert(`Request has been approved and forwarded for authorization.`, "Success", JSAlert.Icons.Success).dismissIn(1000 * 2);
            setTimeout(() => {
                ShowHistory();
            }, 2000);
        }).catch(
            err => {
                JSAlert.alert(`Something went wrong: ${err}`, "Error Found", JSAlert.Icons.Failed).dismissIn(1000 * 2);
                ShowHideModal();
                approveLeave(obj, remarks);
            }
        )

    }

    const approveLeave = (obj, remarks) => {

        ShowHideModal();
        setModalContent(
            <>
                <h6>
                    Do You Want To Approve This Request?
                </h6>
                <div className="up text-right">
                    <button className="px-3 btn submit" onClick={() => openClose('down', 'up')}>Yes</button>
                </div>
                <div className="down text-right">
                    <form onSubmit={(e) => approveRequest(e, obj)}>
                        <textarea className="form-control" name="remarks" defaultValue={remarks ? remarks : ''} minLength={10} placeholder="Your remarks..." required />
                        <select name="submit_to" id="" className="form-control my-3" required>
                            <option value=''> submit to </option>
                            {
                                Relations.map(
                                    (val, index) => {
                                        let option;
                                        if (val.category === 'all' || val.category.includes('leave_request')) {
                                            option = <option value={val.sr} key={index}> {val.name} </option>;
                                        }

                                        return option;
                                    }
                                )
                            }
                        </select>
                        <button type='submit' className="px-3 btn submit">Forward</button>
                    </form>
                </div>
            </>
        )

    }

    const authorizeRequest = (e, obj) => {

        e.preventDefault();
        const remarks = e.target['remarks'].value.trim();
        if (remarks.length < 10) {
            JSAlert.alert("Remarks should be greater than 10 characters.", "Warning", JSAlert.Icons.Warning).dismissIn(1000 * 4);
            return false;
        }
        const objects = {
            leave_id: obj.leave_id,
            remarks: e.target['remarks'].value,
            type: history.location.pathname.split('/').pop().split('_').pop(),
            emp_id: localStorage.getItem('EmpID'),
            submit_by: obj.requested_by
        }
        setModalContent(
            <>
                <div className='d-flex flex-column justify-content-center align-items-center'>
                    <img src={LoadingImg} width="50" height="50" alt="Loading..." />
                    <p className='mb-0 mt-2'>Please Wait....</p>
                </div>
            </>
        )
        axios.post('/authorize_leave', objects).then(() => {
            if (history.location.pathname.split('/').pop().split('_').pop() === 'short') {
                const Data2 = new FormData();
                Data2.append('requestedBy', obj.requested_by);
                Data2.append('empID', localStorage.getItem("EmpID"));
                Data2.append('leave_id', obj.leave_id);
                Data2.append('leaveDate', obj.date);
                axios.post('/markshortleave', Data2).then(() => {
                    JSAlert.alert(`Request has been authorized.`, "Success", JSAlert.Icons.Success).dismissIn(1000 * 2);
                    setTimeout(() => {
                        ShowHistory();
                    }, 2000);
                    const Data2 = new FormData();
                    Data2.append('eventID', 2);
                    Data2.append('whatsapp', true);
                    Data2.append('receiverID', obj.requested_by);
                    Data2.append('senderID', localStorage.getItem('EmpID'));
                    Data2.append('Title', localStorage.getItem('name'));
                    Data2.append('NotificationBody', localStorage.getItem('name') + ' has authorize your short leave on the portal');
                    axios.post('/newnotification', Data2)
                }).catch(err => {
                    JSAlert.alert(`Something went wrong: ${err}`, "Error Found", JSAlert.Icons.Failed).dismissIn(1000 * 2);
                    ShowHideModal();
                    authorizeLeave(obj, remarks);
                });
            } else {
                const Data2 = new FormData();
                Data2.append('requestedBy', obj.requested_by);
                Data2.append('empID', localStorage.getItem("EmpID"));
                Data2.append('leaveID', obj.leave_id);
                Data2.append('leaveFrom', obj.leave_from);
                Data2.append('leaveTo', obj.leave_to);
                Data2.append('oneDayLeave', obj.one_day_leave);
                axios.post('/markleave', Data2).then(() => {
                    JSAlert.alert(`Request has been authorized.`, "Success", JSAlert.Icons.Success).dismissIn(1000 * 2);
                    setTimeout(() => {
                        ShowHistory();
                    }, 2000);
                    const Data2 = new FormData();
                    Data2.append('eventID', 2);
                    Data2.append('whatsapp', true);
                    Data2.append('receiverID', obj.requested_by);
                    Data2.append('senderID', localStorage.getItem('EmpID'));
                    Data2.append('Title', localStorage.getItem('name'));
                    Data2.append('NotificationBody', localStorage.getItem('name') + ' has authorize your leave request on the portal');
                    axios.post('/newnotification', Data2)
                }).catch(err => {
                    JSAlert.alert(`Something went wrong: ${err}`, "Error Found", JSAlert.Icons.Failed).dismissIn(1000 * 2);
                    ShowHideModal();
                    authorizeLeave(obj, remarks);
                });
            }
        }).catch(
            err => {
                JSAlert.alert(`Something went wrong: ${err}`, "Error Found", JSAlert.Icons.Failed).dismissIn(1000 * 2);
                ShowHideModal();
                authorizeLeave(obj, remarks);
            }
        )

    }

    const authorizeLeave = (obj, remarks) => {

        ShowHideModal();
        setModalContent(
            <>
                <h6>
                    Do You Want To Authorize This Request?
                </h6>
                <div className="up text-right">
                    <button className="px-3 btn submit" onClick={() => openClose('down', 'up')}>Yes</button>
                </div>
                <div className="down text-right">
                    <form onSubmit={(e) => authorizeRequest(e, obj)}>
                        <textarea className="form-control" name="remarks" defaultValue={remarks?remarks:''} minLength={10} placeholder="Your remarks..." required></textarea>
                        <button type='submit' className="px-3 btn submit mt-3">Authorize</button>
                    </form>
                </div>
            </>
        )

    }

    const backtoleave = () => {
        history.replace('/leave_history');
    }

    return (
        <>
            {/* <Menu data={Data} /> */}
            <Mail
                data={MailData}
            />
            <Model show={ModalShow} Hide={ShowHideModal} content={ModalContent} />
            <div className='Leave_container'>

                <div className='Topbar_menu'>
                    <div className={ window.location.href.split('/').pop() === 'short_leave_form' ? 'tabs active' : 'tabs' } id="tab1" onClick={() => ShowShortLeaveForm()} >
                        Short Leave
                    </div>
                    <div className={ window.location.href.split('/').pop() === 'leave_form' ? 'tabs active' : 'tabs' } id="tab2" onClick={() => ShowLeaveForm()}>
                        Leave
                    </div>
                    <div className={ window.location.href.split('/').pop() === 'avail_leave_form' ? 'tabs active' : 'tabs' } id="tab3" onClick={() => ShowAvailLeaveForm()}>
                        Availed Leave
                    </div>
                    <div className={ window.location.href.split('/').pop() === 'leave_history' ? 'tabs active' : 'tabs' } id="tab4" onClick={() => ShowHistory()}>
                        Requests
                    </div>
                </div>

                {
                    window.location.href.split('/').pop() === 'short_leave_form'
                    ?
                    <div className="bg-white Short_Leave_Form divs">
                        <div className="Application_Form" style={{ animationDelay: (0 + '.' + 1).toString() + 's' }}>
                            <form onSubmit={OnTakeShortLeave}>
                                <fieldset>
                                    <h2 className="heading">
                                        Short Leave
                                        <sub>Application Form</sub>
                                    </h2>

                                    <hr />

                                    <div className="grid_container">
                                        <div>
                                            <label className='mb-0'>Your Leaving Time</label>
                                            <input onChange={onChangeHandler} required name="ShortLeaveTime" type="time" className="form-control mb-2" />
                                        </div>
                                        <div>
                                            <label className='mb-0'>Your Again Arrival Time <sup>(optional)</sup></label>
                                            <input onChange={onChangeHandler} name="ShortLeaveEndTime" disabled={ ShortLeaveData.ShortLeaveTime === '' } type="time" min={ ShortLeaveData.ShortLeaveTime } className="form-control mb-2" />
                                        </div>
                                        <div>
                                            <label className='mb-0'>Leave Date</label>
                                            <input onChange={onChangeHandler} required name="ShortLeaveDate" type="Date" className="form-control mb-2" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className='mb-0'>Reason For Leave</label>
                                        <textarea onChange={onChangeHandler} required name="ShortLeaveReason" minLength="30" style={{ height: '80px' }} placeholder="Describe your reason in detail" className="form-control" />
                                        <small className='mb-3'>{ShortLeaveData.ShortLeaveReason.trim().length}/30</small>
                                    </div>
                                    
                                    <label className='mb-0'>Submit Application To</label>
                                    <select name="submit_to" onChange={onChangeHandler} id="" className="form-control" required>
                                        <option value=''>select the option</option>
                                        {
                                            Relations.map(
                                                (val, index) => {
                                                    let option;
                                                    if (val.category === 'all' || val.category.includes('leave_request')) {
                                                        option = <option value={val.sr} key={index}> {val.name} </option>;
                                                    }

                                                    return option;
                                                }
                                            )
                                        }
                                    </select>
                                    <div className="d-flex justify-content-end align-items-center mt-3">
                                        <button type="reset" className="btn green">Cancel</button>
                                        {
                                            ShortLeaveData.ShortLeaveTime === '' ||
                                            ShortLeaveData.ShortLeaveDate === '' ||
                                            ShortLeaveData.ShortLeaveReason === '' ||
                                            ShortLeaveData.submit_to === ''
                                            ? null
                                            :
                                            <button type="submit" className="btn submit ml-3">Submit</button>
                                        }
                                    </div>
                                </fieldset>
                            </form>
                        </div>
                    </div>
                    :null
                }
                {
                    window.location.href.split('/').pop() === 'leave_form' || window.location.href.split('/').pop() === 'avail_leave_form'
                    ?
                    <div className="bg-white Employee_Leave_App_Form divs">
                        {
                            Content
                        }
                    </div>
                    :null
                }

                <div className="bg-white History divs">

                    <div className="history_content">

                        {
                            PrevLeave
                                ?
                                <>
                                    <PrevLeaveApp
                                        Type={Type}
                                        PrevLeave={PrevLeave}
                                        printLeave={printLeave}
                                        cancelLeave={cancelLeave}
                                        approveLeave={approveLeave}
                                        rejectLeave={rejectLeave}
                                        authorizeLeave={authorizeLeave}
                                        backtoleave={backtoleave}
                                    />
                                </>
                                :
                                <List
                                    Leaves={Leaves}
                                    Recent={ Recent }
                                    GetHistorySorted={GetHistorySorted}
                                    openLeave={openLeave}
                                />
                        }

                    </div>
                </div>

            </div>
            <ToastContainer />
            <Loading show={StartLoading} />
        </>
    )
}
export default Leave_Application;

const PrevLeaveApp = ({ Type, PrevLeave, printLeave, cancelLeave, approveLeave, rejectLeave, authorizeLeave, backtoleave }) => {


    return (
        <div id="leaveApp" style={{ width: '100%', fontSize: '13px', overflow: 'hidden', position: 'relative' }}>
            <h3 className='text-center font-weight-bold' style={{ letterSpacing: '10px' }}>SEABOARD</h3>
            <p className='text-center font-weight-bold'> {Type === 'short' ? "Short Leave" : "Leave Application"} </p>

            <hr />

            <table className="table tbl table-bordered">

                <tbody>
                    <tr>

                        <th>Date</th>
                        <td>{new Date(PrevLeave.requested_date).toDateString()}</td>
                        <th>Name</th>
                        <td>{PrevLeave.sender_person}</td>

                    </tr>
                    <tr>

                        <th>Designation</th>
                        <td>{PrevLeave.sender_designation}</td>
                        <th>Department</th>
                        <td>{PrevLeave.sender_department}</td>

                    </tr>
                    <tr>

                        <th>Company</th>
                        <td>{PrevLeave.sender_company}</td>

                        <th>Cell Phone</th>
                        <td>{PrevLeave.sender_cell}</td>

                    </tr>
                    <tr>

                        <th>Permanent Address</th>
                        <td colSpan={3}>{PrevLeave.sender_address}</td>

                    </tr>
                    {
                        PrevLeave.request_status.toLowerCase() === 'canceled'
                            ?
                            <>
                                <tr>

                                    <th>Cancel Date</th>
                                    <td>{new Date(PrevLeave.cancel_date).toDateString()}</td>

                                    <th>Cancel Time</th>
                                    <td>{PrevLeave.cancel_time}</td>

                                </tr>
                                <tr>

                                    <th>Cancel Reason</th>
                                    <td colSpan={3}>{PrevLeave.remarks}</td>

                                </tr>
                            </>
                            : null
                    }
                </tbody>

            </table>

            <table className="table table-sm mb-0 table-borderless">

                <thead>
                    <tr>

                        <th>Purpose Of Leave</th>

                    </tr>
                </thead>
                <tbody>
                    <tr>

                        <td>
                            {PrevLeave.leave_purpose}
                        </td>

                    </tr>
                </tbody>

            </table>

            <br />

            <table className="table table-sm mb-0 table-borderless">

                <thead>
                    <tr>

                        <th>Requested Date & Time</th>

                    </tr>
                </thead>
                <tbody>
                    <tr>

                        <td>
                            {new Date(PrevLeave.requested_date).toDateString()} at {PrevLeave.requested_time}
                        </td>

                    </tr>
                </tbody>

            </table>

            <br />

            {
                Type === 'short'
                    ?
                    <table className="table table-striped table-bordered">
                        <thead>
                            <tr>
                                <th colSpan={2}>Date Of Leave</th>
                                <th> <span className='mr-2'>Leave Timing(s):</span> {PrevLeave.leave_time} {PrevLeave.leave_end_time ? ( " - " + PrevLeave.leave_end_time ) : "" }</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <th>Day</th>
                                <th>Month</th>
                                <th>Year</th>
                            </tr>
                            <tr>
                                <td>{new Date(PrevLeave.date).getDate()}</td>
                                <td>{new Date(PrevLeave.date).getMonth() + 1}</td>
                                <td>{new Date(PrevLeave.date).getFullYear()}</td>
                            </tr>
                        </tbody>
                    </table>
                    :
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                {
                                    PrevLeave.leave_to
                                        ?
                                        <>
                                            <th colSpan={2}>Dates Of Leave</th>
                                            <th><span className='mr-2'>Days</span> {PrevLeave.days}</th>
                                        </>
                                        :
                                        <th colSpan={3}>Date Of Leave</th>
                                }
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <th>Day</th>
                                <th>Month</th>
                                <th>Year</th>
                            </tr>
                            <tr>
                                <td>{new Date(PrevLeave.leave_from).getDate()}</td>
                                <td>{new Date(PrevLeave.leave_from).getMonth() + 1}</td>
                                <td>{new Date(PrevLeave.leave_from).getFullYear()}</td>
                            </tr>
                            {
                                PrevLeave.leave_to
                                    ?
                                    <>
                                        <tr>
                                            <th colSpan={3}>To</th>
                                        </tr>
                                        <tr>
                                            <td>{new Date(PrevLeave.leave_to).getDate()}</td>
                                            <td>{new Date(PrevLeave.leave_to).getMonth() + 1}</td>
                                            <td>{new Date(PrevLeave.leave_to).getFullYear()}</td>
                                        </tr>
                                    </>
                                    : null
                            }
                        </tbody>
                    </table>
            }

            {
                PrevLeave.request_status.toLowerCase() === 'canceled'
                    ? null
                    :
                    <>
                        <br />
                        <br />

                        {
                            parseInt(PrevLeave.requested_by) !== parseInt(localStorage.getItem('EmpID')) &&
                                (PrevLeave.request_status.toLowerCase() === 'viewed' || PrevLeave.request_status.toLowerCase() === 'sent')
                                ?
                                <button className="accepted_div" onDoubleClick={() => approveLeave(PrevLeave)}>Double Click to Approve</button>
                                : null
                        }

                        <h2 className='text-right px-5 mb-0 signatures'>{PrevLeave.receiver_person ? PrevLeave.receiver_person : null}</h2>
                        <p className='text-right mb-0'>-----------------------------------------------------</p>
                        <p className='text-right font-weight-bold mb-0'> {PrevLeave.request_status.toLowerCase() === 'rejected' ? "Rejected" : "Recommended"} By</p>
                        <p className='text-right font-weight-bold mb-0'>{PrevLeave.receiver_designation}</p>




                        <br />

                        <table className="table table-borderless">

                            <thead>
                                <tr>

                                    <th>Remarks</th>

                                </tr>
                            </thead>
                            <tbody>
                                <tr>

                                    <td>
                                        {PrevLeave.comments ? PrevLeave.comments : 'No Remarks'}
                                    </td>

                                </tr>
                            </tbody>

                        </table>

                        {
                            PrevLeave.request_status.toLowerCase() === 'rejected'
                                ? null
                                :
                                <>
                                    <br />

                                    {
                                        parseInt(PrevLeave.requested_by) !== parseInt(localStorage.getItem('EmpID')) &&
                                            PrevLeave.request_status.toLowerCase() === 'accepted' &&
                                            parseInt(PrevLeave.authorized_to) === parseInt(localStorage.getItem('EmpID'))
                                            ?
                                            <button className="accepted_div" onDoubleClick={() => authorizeLeave(PrevLeave)}>Double Click to Authorize</button>
                                            : null
                                    }

                                    <h2 className='text-right px-5 mb-0 signatures'>{PrevLeave.auther_person ? PrevLeave.auther_person : null}</h2>
                                    <p className='text-right mb-0'>-----------------------------------------------------</p>
                                    <p className='text-right font-weight-bold mb-0'>Authorized By</p>
                                    <p className='text-right font-weight-bold mb-0'>{PrevLeave.auther_designation}</p>

                                    <br />

                                    <table className="table table-borderless">

                                        <thead>
                                            <tr>

                                                <th>Remarks</th>

                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>

                                                <td>
                                                    {PrevLeave.comments2 ? PrevLeave.comments2 : 'No Remarks'}
                                                </td>

                                            </tr>
                                        </tbody>

                                    </table>
                                </>
                        }
                    </>
            }

            <div className='Print_button' id="controls_btns">

                <div>

                    <button type="button" className="btn ml-2 green" onClick={() => backtoleave()} >Back</button>

                </div>

                <div>

                    {
                        parseInt(PrevLeave.requested_by) === parseInt(localStorage.getItem('EmpID')) &&
                        (PrevLeave.request_status.toLowerCase() === 'viewed' || PrevLeave.request_status.toLowerCase() === 'sent')
                        ?
                        <button className="btn ml-2 cancle" onClick={() => cancelLeave(PrevLeave)}>Cancel</button>
                        :null
                    }
                    {
                        parseInt(PrevLeave.requested_by) !== parseInt(localStorage.getItem('EmpID')) &&
                            (PrevLeave.request_status.toLowerCase() === 'viewed' || PrevLeave.request_status.toLowerCase() === 'sent')
                            ?
                            <button className="btn ml-2 cancle px-4" onClick={() => rejectLeave(PrevLeave)}>Reject</button>
                            : null
                    }
                    <button type="" className="btn ml-2 submit" onClick={() => printLeave()} >Print</button>

                </div>

            </div>

        </div>
    )

}

const List = ({ Recent, Leaves, GetHistorySorted, openLeave }) => {

    return (
        <>

            <div className="d-flex justify-content-between align-items-center mb-3">
                <h3 className="heading">
                    Recent Leaves
                    <sub>Requests</sub>
                </h3>
                <select onChange={(e) => GetHistorySorted(e.target.value)} id="leave_type_select" className='form-control'>
                    <option value="">Select Type</option>
                    <option value="Leaves">Leave Applications</option>
                    <option value="shortLeaves">Short Leaves</option>
                </select>

            </div>

            <div className='showBigScreen'>
                {
                    Recent && !Leaves
                    ?
                    Recent.length === 0 ? <h6 className="text-center">No Recent Leave Found</h6> :
                    <>
                        <table className='table tbl tbl2'>
                            <thead>
                                <tr>

                                    <th className='border-top-0'>Sr.No</th>
                                    <th className='border-top-0'>Description</th>
                                    <th className='border-top-0'>Request Date & Time</th>
                                    <th className='border-top-0'>Status</th>
                                    <th className='border-top-0'>Leave Date</th>

                                </tr>
                            </thead>
                            <tbody>
                                {
                                    Recent.map(
                                        (val, index) => {
                                            if ( index === 0 ) console.log(val)

                                            return (
                                                <tr style={ { cursor: "pointer" } } title='Double Click' onDoubleClick={() => openLeave(index, val.date ? "short" : 'leave', 'recent')}>

                                                    <td>{index + 1}</td>
                                                    <td>
                                                        {
                                                            parseInt(val.requested_by) !== parseInt(localStorage.getItem('EmpID'))
                                                            ?
                                                            <>
                                                                <b>{val.name}</b>
                                                                <br />
                                                            </>
                                                            : null
                                                        }
                                                        {val.leave_purpose}
                                                    </td>
                                                    <td>
                                                        {new Date(val.requested_date).toDateString()} <br />
                                                        at {val.requested_time}
                                                    </td>
                                                    <td>
                                                        {
                                                            val.request_status === 'Accepted'
                                                            ?
                                                            <div className={ val.authorized_to == localStorage.getItem('EmpID') ? 'status_div text-white waiting_for_approval' : 'status_div text-white accepted' }>
                                                                { val.authorized_to == localStorage.getItem('EmpID') ? "Pending For Authorization" : val.request_status }
                                                            </div>
                                                            :
                                                            val.request_status === 'sent'
                                                            ?
                                                            <div className={ val.received_by == localStorage.getItem('EmpID') ? 'status_div text-white waiting_for_approval' : 'status_div text-white sent' }>
                                                                { val.received_by == localStorage.getItem('EmpID') ? "Pending For Approval" : val.request_status }
                                                            </div>
                                                            :
                                                            val.request_status === 'rejected'
                                                            ?
                                                            <div className='status_div text-white rejected'>
                                                                {val.request_status}
                                                            </div>
                                                            :
                                                            val.request_status === 'Authorized'
                                                            ?
                                                            <div className='status_div authorized text-white' >
                                                                {val.request_status}
                                                            </div>
                                                            :
                                                            val.request_status === 'canceled'
                                                            ?
                                                            <div className='status_div canceled'>
                                                                {val.request_status}
                                                            </div>
                                                            :
                                                            <div className='status_div canceled'>
                                                                {val.request_status}
                                                            </div>
                                                        }
                                                    </td>
                                                    {
                                                        val.date
                                                            ?
                                                            <td>
                                                                {new Date(val.date).toDateString()} <br />
                                                                at {val.leave_time}
                                                            </td>
                                                            :
                                                            <td>
                                                                {new Date(val.leave_from).toDateString()}
                                                                <br />
                                                                {
                                                                    val.leave_to
                                                                        ?
                                                                        <>
                                                                            To
                                                                            <br />
                                                                        </>
                                                                        : null
                                                                }
                                                                {val.leave_to ? new Date(val.leave_to).toDateString() : ''}
                                                            </td>
                                                    }

                                                </tr>
                                            )

                                        }
                                    )
                                }
                            </tbody>
                        </table>
                    </>
                    :null
                }
                {
                    Leaves
                    ?
                    Leaves.length === 0 ? <h6 className="text-center">No Leave Found</h6> :
                    <>
                        <table className='table tbl tbl2'>
                            <thead>
                                <tr>

                                    <th>Sr.No</th>
                                    <th>Description</th>
                                    <th>Request Date & Time</th>
                                    <th>Status</th>
                                    <th>Leave Date</th>

                                </tr>
                            </thead>
                            <tbody>
                                {
                                    Leaves.map(
                                        (val, index) => {

                                            return (
                                                <tr style={ { cursor: "pointer" } } title='Double Click' onDoubleClick={() => openLeave(index, val.date ? "short" : 'leave')}>

                                                    <td>{index + 1}</td>
                                                    <td style={{ width: "40%" }}>
                                                        {
                                                            parseInt(val.requested_by) !== parseInt(localStorage.getItem('EmpID'))
                                                                ?
                                                                <>
                                                                    <b>{val.name}</b>
                                                                    <br />
                                                                </>
                                                                : null
                                                        }
                                                        {val.leave_purpose}
                                                    </td>
                                                    <td>
                                                        {new Date(val.requested_date).toDateString()} <br />
                                                        at {val.requested_time}
                                                    </td>

                                                    <td>
                                                        {
                                                            val.request_status === 'Accepted'
                                                            ?
                                                            <div className={ val.authorized_to == localStorage.getItem('EmpID') ? 'status_div text-white waiting_for_approval' : 'status_div text-white accepted' }>
                                                                { val.authorized_to == localStorage.getItem('EmpID') ? "Pending For Authorization" : val.request_status }
                                                            </div>
                                                            :
                                                            val.request_status === 'sent'
                                                            ?
                                                            <div className={ val.received_by == localStorage.getItem('EmpID') ? 'status_div text-white waiting_for_approval' : 'status_div text-white sent' }>
                                                                { val.received_by == localStorage.getItem('EmpID') ? "Pending For Approval" : val.request_status }
                                                            </div>
                                                            :
                                                            val.request_status === 'rejected'
                                                            ?
                                                            <div className='status_div text-white rejected'>
                                                                {val.request_status}
                                                            </div>
                                                            :
                                                            val.request_status === 'Authorized'
                                                            ?
                                                            <div className='status_div authorized text-white' >
                                                                {val.request_status}
                                                            </div>
                                                            :
                                                            val.request_status === 'canceled'
                                                            ?
                                                            <div className='status_div canceled'>
                                                                {val.request_status}
                                                            </div>
                                                            :
                                                            <div className='status_div waiting_for_approval'>
                                                                {val.request_status}
                                                            </div>
                                                        }
                                                    </td>
                                                    {
                                                        val.date
                                                        ?
                                                        <td>
                                                            {new Date(val.date).toDateString()} <br />
                                                            at {val.leave_time}
                                                        </td>
                                                        :
                                                        <td>
                                                            {new Date(val.leave_from).toDateString()}
                                                            <br />
                                                            {
                                                                val.leave_to
                                                                    ?
                                                                    <>
                                                                        To
                                                                        <br />
                                                                    </>
                                                                    : null
                                                            }
                                                            {val.leave_to ? new Date(val.leave_to).toDateString() : ''}
                                                        </td>
                                                    }
                                                </tr>
                                            )

                                        }
                                    )
                                }
                            </tbody>
                        </table>
                    </>
                    :null    
                }
            </div>
        </>
    )

}