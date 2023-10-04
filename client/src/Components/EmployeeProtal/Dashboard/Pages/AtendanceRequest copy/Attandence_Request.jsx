/* eslint-disable eqeqeq */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-lone-blocks */
import React, { useEffect, useState } from 'react';
import './Attandence_Request.css';

import { NavLink, useHistory } from 'react-router-dom';
import $ from 'jquery';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import axios from '../../../../../axios';
import socket from '../../../../../io';

import { useSelector } from 'react-redux';
import Modal from '../../../../UI/Modal/Modal';
import Mail from '../../../../UI/Mail/Mail';
import JSAlert from 'js-alert';

import LoadingImg from '../../../../../images/loadingIcons/icons8-iphone-spinner.gif';

const Attandence_Request = () => {

    const history = useHistory();
    const Relations = useSelector((state) => state.EmpAuth.Relations);
    const AccessControls = useSelector( ( state ) => state.EmpAuth.EmployeeData );

    const [RequestList, setRequestList] = useState([]);
    const [Submittion, setSubmittion] = useState(false);

    const [OpenForm, setOpenForm] = useState(false);
    const [RecordFound, setRecordFound] = useState(false);
    const [Dates, setDates] = useState([]);

    const [Form, setForm] = useState({
        date: new Date().toString(),
        reason: '',
        submit_to: '',
        request_type: '',
        request_for: '',
        // current_time: '',
        // new_time: '',
    });
    const [MailData, setMailData] = useState(
        {
            subject: "",
            send_to: "",
            gender: "",
            receiver: "",
            message: ""
        }
    );


    const [DetailsView, setDetailsView] = useState(false);
    const [SnapShot, setSnapShot] = useState(null);
    const [ ShowModal, setShowModal ] = useState(false);
    const [ Content, setContent ] = useState();

    const [Attendance, setAttendance] = useState(
        {
            time_in: '',
            time_out: '',
            break_in: '',
            break_out: ''
        }
    );

    const [NewAttendance, setNewAttendance] = useState(
        {
            time_in: '',
            time_out: '',
            break_in: '',
            break_out: '',
            time_in_check: false,
            time_out_check: false, 
            break_in_check: false, 
            break_out_check: false 
        }
    );

    const [RequestDetails, setRequestDetails] = useState(
        {
            emp_info: {},
            request_info: {},
            reviews: []
        }
    );

    const [RequestAction, setRequestAction] = useState(
        {
            request_action: '',
            request_send_to: '',
        }
    );

    const [Marking, setMarking] = useState(
        {
            mark_time_in: false,
            mark_time_out: false,
            mark_break_in: false,
            mark_break_out: false
        }
    );

    const OnTimeChange = (e) => {
        const { value, name, checked } = e.target;

        let val = {};
        let v;
        if ( name.includes('check') )
        {
            v = checked;
            if ( checked )
            {
                $('#' + name).prop('disabled', true).val('');
            }else
            {
                $('#' + name).prop('disabled', false);
            }
        }else
        {
            v = value;
        }
        
        val = {
            ...NewAttendance,
            [name]: v
        }
        setNewAttendance(val);

    }

    useEffect(
        () => {

            let name = 'time_in';
            if ( !Marking.mark_time_in )
            {
                name = 'time_in';
            }else
            if ( !Marking.mark_time_out )
            {
                name= 'time_out';
            }else
            if ( !Marking.mark_break_in )
            {
                name= 'break_in';
            }else
            if ( !Marking.mark_break_out )
            {
                name= 'break_out';
            }

            let val = {
                ...NewAttendance,
                [name]: ''
            };

            setNewAttendance( val );

        // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [ Marking.mark_time_in, Marking.mark_time_out, Marking.mark_break_in, Marking.mark_break_out ]
    )

    useEffect(
        () => {

            socket.on(
                'newattendancerequest', () => {
                    
                    setSubmittion( !Submittion );
            
                }
            )

            GetDates();

        // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []
    )

    useEffect(
        () => {

            if (Form.request_type === 'update') 
            {
                // ShowNotification("Update Mode On", "top-center");
                requestData();
            } else
            if (Form.request_type === 'insert') {
                requestData();
                // ShowNotification("Insert Mode On", "top-center");
                // setAttendance(
                //     {
                //         time_in: '',
                //         time_out: '',
                //         break_in: '',
                //         break_out: ''
                //     }
                // );
            }else
            {
                setMarking(
                    {
                        mark_time_in: false,
                        mark_time_out: false,
                        mark_break_in: false,
                        mark_break_out: false
                    }
                );
                setNewAttendance(
                    {
                        time_in: '',
                        time_out: '',
                        break_in: '',
                        break_out: '',
                        time_in_check: false,
                        time_out_check: false, 
                        break_in_check: false, 
                        break_out_check: false 
                    }
                );
            }

        }, [Form.request_type, Form.date]
    )

    const GetDates = () => {

        axios.get('/get_enabled_att_request_dates').then(
            res => {

                setDates( res.data );

            }
        ).catch(
            err => {

                console.log( err );

            }
        )

    }

    const onChangeCheck = (e) => {

        const { name, checked } = e.target;

        let value;
        if (checked) {
            $('#' + name).prop('disabled', true).val('');
            // $('#' + name).prop('required', false);
            value = null;
        } else {
            $('#' + name).prop('disabled', false);
            // $('#' + name).prop('required', true);
            value = '';
        }

        const val = {
            ...NewAttendance,
            [name]: value
        }
        setNewAttendance(val);

    }

    const requestData = () => {

        axios.post(
            '/getemptimein',
            {
                emp_id: localStorage.getItem('EmpID'),
                date_time: Form.date
            }
        ).then(
            res => {

                if (res.data.length > 0) {

                    setAttendance(res.data[0]);
                    setNewAttendance(
                        {
                            ...NewAttendance,
                            time_in: res.data[0].time_in === null ? null : res.data[0].time_in,
                            time_out: res.data[0].time_out === null ? null : res.data[0].time_out,
                            break_in: res.data[0].break_in === null ? null : res.data[0].break_in,
                            break_out: res.data[0].break_out === null ? null : res.data[0].break_out
                        }
                    );
                    setRecordFound( true );

                } else {

                    setRecordFound( false );

                }

            }
        ).catch(
            err => {

                console.log(err)

            }
        )

    }

    useEffect(
        () => {

            axios.post(
                '/getallattendancerequests',
                {
                    emp_id: localStorage.getItem('EmpID'),
                }
            ).then(
                res => {

                    setRequestList(res.data);

                }
            ).catch(
                err => {

                    console.log(err)

                }
            )

        }, [ Submittion ]
    )

    useEffect(
        () => {

            let id = parseInt(window.location.href.split('/').pop().split('_').shift());
            if (!isNaN(id)) {
                showrequest(id);
            }

            if (window.location.href.split('/').pop() === 'new') {
                setOpenForm(true)
            }

            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [window.location.href.split('/').pop()]
    )

    useEffect(
        () => {

            if ( RequestDetails.reviews[0] )
            {
                EditAttendance(
                    RequestDetails.reviews[0]
                )
            }

        // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [ RequestDetails.reviews.length ]
    )

    useEffect(
        () => {
            
            if ( MailData.subject !== '' && MailData.send_to !== '' && MailData.gender !== '' && MailData.receiver !== '' && MailData.message !== '' )
            {
                $('#mail_form').trigger('click');
            }

        }, [ MailData.subject, MailData.send_to, MailData.gender, MailData.receiver, MailData.message ]
    );

    const showrequest = (id) => {

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
                )

                setDetailsView(true);
                setOpenForm(false);

            }
        ).catch(
            err => {

                console.log(err)

            }
        )
    }

    const onImageUpload = (event) => {

        const reader = new FileReader();

        reader.onload = () => {

            if (reader.readyState === 2) {

                setSnapShot(reader.result);

            }

        }

        reader.readAsDataURL(event.target.files[0]);

    }

    const closebutton = () => {

        setSnapShot(null);

    }

    const ShowNotification = (txt, position) => {

        toast.dark(txt.toString(), {
            position: position,
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });

    }

    const OnChangeHandler = (e) => {
        const { value, name } = e.target;

        let val;
        if (name === 'request_type') {
            val = {
                ...Form,
                new_time: '',
                current_time: '',
                [name]: value
            }
        } else
            if (name === 'c') {
            } else {
                val = {
                    ...Form,
                    [name]: value
                }
            }


        setForm(val);
    }

    const Validation = () => {

        let pass = true;
        
        // shahzad IF TIME OUT IS GREATER THAN TIME IN
        if ( Form.request_type === 'insert' && RecordFound )
        {
            JSAlert.alert("Your attendance of this date has already exists, instead of add timings, kindly select update option from the request type field.", "Warning", JSAlert.Icons.Warning);
            pass = false;
        }
        
        if ( Form.request_type === 'insert' && !Marking.mark_time_in )
        {
            JSAlert.alert('Shift (Start) option must be true/checked when the request type is [Insert].', "Warning", JSAlert.Icons.Warning);
            pass = false;
        } 

        if ( Form.request_type === 'insert' && Marking.mark_time_in && ( NewAttendance.time_in === '' || NewAttendance.time_in === null ) )
        {
            JSAlert.alert('Shift (Start) option must be true/checked when the request type is [Insert].', "Warning", JSAlert.Icons.Warning);
            pass = false;
        } 
        
        // IF TIME OUT IS GREATER THAN TIME IN
        if ( Marking.mark_time_in && Marking.mark_time_out && NewAttendance.time_out < NewAttendance.time_in )
        {
            JSAlert.alert('Shift (End) time should be greater than Shift (Start) time.', "Warning", JSAlert.Icons.Warning);
            pass = false;
        }

        // IF BREAK OUT IS GREATER THAN BREAK IN
        if ( Marking.mark_break_in && Marking.mark_break_out && NewAttendance.break_out < NewAttendance.break_in )
        {
            JSAlert.alert('Break (End) time should be greater than Break (Start) time.', "Warning", JSAlert.Icons.Warning);
            pass = false;
        }

        // IF BREAK OUT IS GREATER THAN TIME OUT
        if ( Marking.mark_time_out && Marking.mark_break_out && NewAttendance.break_out > NewAttendance.time_out )
        {
            JSAlert.alert('Break (End) time could not be greater than Shift (End) time.', "Warning", JSAlert.Icons.Warning);
            pass = false;
        }

        // IF BREAK IN IS GREATER THAN TIME OUT
        if ( Marking.mark_time_out && Marking.mark_break_in && NewAttendance.break_in > NewAttendance.time_out )
        {
            JSAlert.alert('Break (Start) time could not be greater than Shift (End) time.', "Warning", JSAlert.Icons.Warning);
            pass = false;
        }

        // IF BREAK IN IS LESS THAN TIME IN
        if ( Marking.mark_time_in && Marking.mark_break_in && NewAttendance.break_in < NewAttendance.time_in )
        {
            JSAlert.alert('Break (Start) time should be greater than Shift (Start) time.', "Warning", JSAlert.Icons.Warning);
            pass = false;
        }

        // IF BREAK OUT IS LESS THAN TIME IN
        if ( Marking.mark_time_in && Marking.mark_break_out && NewAttendance.break_out < NewAttendance.time_in )
        {
            JSAlert.alert('Break (End) time should be greater than Shift (Start) time.', "Warning", JSAlert.Icons.Warning);
            pass = false;
        }

        return pass;

    }

    const Submit = (e) => {

        e.preventDefault();
        const pass = Validation();
        if ( pass )
        {
            setContent(
                <>
                    <div className='d-flex flex-column justify-content-center align-items-center'>
                        <img src={LoadingImg} width="50" height="50" alt="Loading..." />
                        <p className='mb-0 mt-2'>Please Wait....</p>
                    </div>
                </>
            );
            setShowModal( true );
            const Data = new FormData();
            Data.append('time_in', NewAttendance.time_in)
            Data.append('time_out', NewAttendance.time_out)
            Data.append('break_in', NewAttendance.break_in)
            Data.append('break_out', NewAttendance.break_out)
            Data.append('date_time', new Date().toString())
            Data.append('request_by', localStorage.getItem('EmpID'))
            Data.append('request_to', Form.submit_to)
            Data.append('request_type', Form.request_type)
            Data.append('reason', Form.reason)
            Data.append('record_date', Form.date)
            Data.append('snapshot', SnapShot)
            Data.append('prev_attendance', JSON.stringify( Attendance ))
    
            axios.post(
                '/newattendancerequest',
                Data
            ).then(
                () => {
                    setContent(<></>);
                    setShowModal(false);
                    JSAlert.alert("Request has been submitted successfully.", "Success", JSAlert.Icons.Success).dismissIn(1000 * 2);
                    setOpenForm(false);
                    setForm({
                        date: '',
                        reason: '',
                        submit_to: '',
                        request_type: '',
                        request_for: '',
                        current_time: '',
                        new_time: '',
                    });
    
    
                    setDetailsView(false);
                    setSnapShot(null);
    
                    setAttendance(
                        {
                            time_in: '',
                            time_out: '',
                            break_in: '',
                            break_out: ''
                        }
                    );
    
                    setNewAttendance(
                        {
                            time_in: '',
                            time_out: '',
                            break_in: '',
                            break_out: '',
                            time_in_check: false,
                            time_out_check: false, 
                            break_in_check: false, 
                            break_out_check: false 
                        }
                    );
                    setMailData(
                        {
                            ...MailData,
                            subject: "New Attendance Request",
                            gender: "Sir",
                            message: localStorage.getItem('name') + ' has sent a new repair request.'
                        }
                    )
                    $('a[type=reset]').trigger('click');
                    const Data2 = new FormData();
                    Data2.append('eventID', 4);
                    Data2.append('whatsapp', true);
                    Data2.append('receiverID', Form.submit_to);
                    Data2.append('senderID', localStorage.getItem('EmpID'));
                    Data2.append('Title', localStorage.getItem('name'));
                    Data2.append('NotificationBody', localStorage.getItem('name') + ' has sent an attendance request on the portal.');
                    axios.post('/newnotification', Data2).then(() => {
                        axios.post('/sendmail', Data2)
                    })
    
                    setTimeout(() => {
                        socket.emit('NewNotification', Form.submit_to);
                        socket.emit('newattendancerequest', '');
                        history.replace('/attendance_request');
                    }, 2000);
    
                }
            ).catch(
                err => {
                    setContent(<></>);
                    setShowModal(false);
                    JSAlert.alert(`Something went wrong: ${err}`, "Error Found", JSAlert.Icons.Failed).dismissIn(1000 * 4);
                }
            )
        }else {
            return false;
        }
    }

    const buttonslideSnapeshot = (snapshot) => {
        setContent(
            <>
                <img src={snapshot} alt="snapshot" width='100%' />
            </>
        );
        setShowModal(true);
    }

    const d = new Date();

    const OnChangeSelect = (e) => {
        const { value, name } = e.target;

        let val = {};
        if 
        ( 
            value === 'mark' ||
            value === 'approve' ||
            value === 'reject '
        )
        {
            val = {
                ...RequestAction,
                request_send_to: '',
                [name]: value
            }
        }else
        {
            val = {
                ...RequestAction,
                [name]: value
            }
        }

        if ( name === 'request_send_to' )
        {
            let email;
            let name;
            for ( let x = 0; x < Relations.length; x++ )
            {
                if ( parseInt(Relations[x].sr) === parseInt(value) )
                {
                    email = Relations[x].email;
                    name = Relations[x].name;
                }
            }
            setMailData(
                {
                    ...MailData,
                    send_to: email,
                    receiver: name
                }
            );
        }

        setRequestAction(val);
    }

    const OpenRemarks = ( id, request_id, remarks ) => {

        const content = 
        <form className="w-100 text-right" onSubmit={ ( e ) => TakeAction( e, id, request_id ) }>
            <h6 className='text-left'>Do you want to proceed?</h6>
            <textarea name="remarks" style={{minHeight: '80px'}} className="form-control" defaultValue={remarks?remarks:''} placeholder='Your remarks....' required minLength='10' />
            <button className="btn submit mt-2">
                Confirm
            </button>
        </form>

        setContent( content );
        setShowModal( true );

    }

    const TakeAction = ( e, id, request_id ) => {

        e.preventDefault();
        const status = document.getElementById('record_status');
        const remarks = e.target['remarks'].value;

        if (remarks.trim().length < 10) {
            JSAlert.alert("Remarks should be greater than 10 characters.", "Warning", JSAlert.Icons.Warning).dismissIn(1000 * 4);
            return false;
        }

        setContent(
            <>
                <div className='d-flex flex-column justify-content-center align-items-center'>
                    <img src={LoadingImg} width="50" height="50" alt="Loading..." />
                    <p className='mb-0 mt-2'>Please Wait....</p>
                </div>
            </>
        );

        axios.post(
            '/performactionforattrequest',
            {
                request_id: request_id,
                id: id,
                emp_id: localStorage.getItem('EmpID'),
                date_time: new Date().toString(),
                status: RequestAction.request_action,
                forward_to: RequestAction.request_send_to,
                remarks: remarks,
                time_in: NewAttendance.time_in,
                time_out: NewAttendance.time_out,
                break_in: NewAttendance.break_in,
                break_out: NewAttendance.break_out,
                time_in_check: NewAttendance.time_in_check,
                time_out_check: NewAttendance.time_out_check,
                break_in_check: NewAttendance.break_in_check,
                break_out_check: NewAttendance.break_out_check,
                request_type: RequestDetails.request_info.request_type,
                request_by: RequestDetails.reviews[0].request_by,
                record_date: RequestDetails.request_info.date,
                record_status: status ? status.value : null
            }
        ).then(
            () => {
                JSAlert.alert(`Request has been updated.`, "Success", JSAlert.Icons.Success).dismissIn(1000 * 2);

                setRequestDetails(
                    {
                        emp_info: {},
                        request_info: {},
                        reviews: []
                    }
                )
                setRequestAction(
                    {
                        request_action: '',
                        request_send_to: '',
                    }
                );

                setDetailsView(false);
                setOpenForm(false);
                setShowModal( false );
                // setSubmittion( true );
                
                let forward = false;
                if ( RequestAction.request_send_to === 'null' || RequestAction.request_send_to === '' || RequestAction.request_send_to === null )
                {
                    forward = false;
                }else
                {
                    forward = true;
                }

                if ( forward )
                {
                    const Data2 = new FormData();
                    Data2.append('eventID', 4);
                    Data2.append('receiverID', RequestAction.request_send_to);
                    Data2.append('senderID', localStorage.getItem('EmpID'));
                    Data2.append('Title', localStorage.getItem('name'));
                    Data2.append('NotificationBody', localStorage.getItem('name') + ' put forward an attendance request on the portal.');
                    axios.post('/newnotification', Data2).then(() => {
    
                        axios.post('/sendmail', Data2).then(() => {
    
                        })
                    })
                }

                const Data2 = new FormData();
                Data2.append('eventID', 4);
                Data2.append('receiverID', RequestDetails.reviews[0].request_by);
                Data2.append('senderID', localStorage.getItem('EmpID'));
                Data2.append('Title', localStorage.getItem('name'));
                Data2.append('NotificationBody', 'Your attendance request on the portal is now ' + RequestAction.request_action + '.');
                axios.post('/newnotification', Data2).then(() => {

                    axios.post('/sendmail', Data2).then(() => {

                    })
                })

                history.replace('/attendance_request');

            }
        ).catch(
            err => {
                OpenRemarks(id, request_id, remarks);
                JSAlert.alert(`Something went wrong: ${err}`, "Error Found", JSAlert.Icons.Failed).dismissIn(1000 * 4);
            }
        )

    }

    const onCLose = () => {

        setShowModal( !ShowModal );

    }

    const EditAttendance = ( data ) => {

        setNewAttendance(
            {
                ...NewAttendance,
                time_in: data.time_in,
                time_out: data.time_out,
                break_in: data.break_in,
                break_out: data.break_out
            }
        )

        setTimeout(() => {
            if ( data.time_in === null || data.time_in === 'null' )
            {
                $('#time_in_check').prop('disabled', true);
                $('input[type=checkbox][name=time_in_check]').prop('checked', true);
            }
            if ( data.time_out === null || data.time_out === 'null' )
            {
                $('#time_out_check').prop('disabled', true);
                $('input[type=checkbox][name=time_out_check]').prop('checked', true);
            }
            if ( data.break_in === null || data.break_in === 'null' )
            {
                $('#break_in_check').prop('disabled', true);
                $('input[type=checkbox][name=break_in_check]').prop('checked', true);
            }
            if ( data.break_out === null || data.break_out === 'null' )
            {
                $('#break_out_check').prop('disabled', true);
                $('input[type=checkbox][name=break_out_check]').prop('checked', true);
            }
        }, 150);

    }

    const onMarkChange = ( e ) => {

        const { checked, name } = e.target;

        let id = name.split('_');
        id.shift();
        const val = {
            ...Marking,
            [name]: checked
        }
        setMarking( val );
        
        // setTimeout(() => {
        //     $('#' + id.join('_')).prop('required', checked);
        // }, 100);

    }

    return (
        <>
            <Mail
                data={ MailData }
            />
            <Modal width="50%" show={ ShowModal } Hide={ onCLose } content={ Content } />
            <div className='page'>
                <div className="Attandence_Request page-content">
                    <div className="d-flex align-items-center justify-content-between">
                        <h3 className="heading">
                            Attendance Correction
                            <sub>Update Your Attendance</sub>
                        </h3>
                        <div className='d-flex align-items-center'>
                            {
                                RequestDetails.emp_info.name
                                ?
                                RequestList.map(
                                    ( val ) => {
                                        if ( parseInt( window.location.href.split('/').pop().split('_').pop() ) === val.id )
                                        {
                                            let options = [];
                                            if ( parseInt( val.request_by ) === parseInt( localStorage.getItem('EmpID') ) )
                                            {
                                                if ( CheckCancellation() )
                                                {
                                                    options.push(<option value="cancel">Cancel</option>);
                                                    Marking( options );
                                                }
                                            }else
                                            {
                                                if ( val.request_status === 'sent' && val.request_to == localStorage.getItem("EmpID") )
                                                {
                                                    Marking( options );
                                                    options.push(<option value="reject">Reject</option>);
                                                }else
                                                if ( val.request_status === 'approve & forward' )
                                                {
                                                    Marking( options );
                                                }else
                                                if ( val.request_status === 'approve' )
                                                {
                                                    Marking( options );
                                                }

                                            }

                                            function Marking( options )
                                            {

                                                if ( AccessControls.access && CheckCancellation() )
                                                {
                                                    if ( val.request_to == localStorage.getItem("EmpID") && (JSON.parse(AccessControls.access).includes(19) || JSON.parse(AccessControls.access).includes(0)) )
                                                    {
                                                        options.push(<option value="mark">Mark</option>);
                                                    }
                                                }
                                                return options;

                                            }

                                            function CheckCancellation()
                                            {
                                                let val = true;
                                                for ( let x = 0; x < RequestDetails.reviews.length; x++ )
                                                {

                                                    if ( RequestDetails.reviews[x].request_status === 'cancel' || RequestDetails.reviews[x].request_status === 'mark' || RequestDetails.reviews[x].request_status === 'mark_&_forward' )
                                                    {
                                                        val = false;
                                                    }

                                                }
                                                return val;
                                            }

                                            return (
                                                <>
                                                    {
                                                        val.request_status === 'mark_&_forward'
                                                        ?
                                                        null
                                                        :
                                                        <select name="request_action" id="" className='form-control mr-2 request_action' onChange={OnChangeSelect}>
                                                            <option value="">Select Option</option>
                                                            { options }
                                                        </select>
                                                    }
                                                    {
                                                        RequestAction.request_action === "approve_&_forward" || RequestAction.request_action === "reject_&_forward" || RequestAction.request_action === "mark_&_forward"
                                                        ?
                                                        <select name="request_send_to" id="" className='form-control mr-2 request_send_to' onChange={OnChangeSelect}>
                                                            <option value="">select</option>
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
                                                        :
                                                        null
                                                    }
                                                    {
                                                        RequestAction.request_action === ''
                                                        ?
                                                        null
                                                        :
                                                        RequestAction.request_send_to === 0 && ( RequestAction.request_action === "approve_&_forward" || RequestAction.request_action === "reject_&_forward" )
                                                        ?
                                                        null
                                                        :
                                                        <div onClick={ () => OpenRemarks( val.id, val.request_id ) } className="btn green mr-2">Confirm</div>
                                                    }

                                                </>
                                            )
                                        }else
                                        {
                                            return false;
                                        }

                                    }
                                )
                                :
                                null
                            }
                            <button className='btn submit' onClick={() => history.push('/attendance_request/new')}>New</button>
                        </div>
                    </div>
                    <br />
                    {
                        OpenForm
                        ?
                        <AttRequestForm
                            OnChangeHandler={OnChangeHandler}
                            OnTimeChange={OnTimeChange}
                            onChangeCheck={onChangeCheck}
                            onUploadSnap={onImageUpload}
                            onMarkChange={ onMarkChange }
                            closebutton={closebutton}
                            Submit={Submit}
                            
                            Dates={ Dates }
                            Form={Form}
                            date={d}
                            Attendance={Attendance}
                            SnapShot={SnapShot}
                            Relations={Relations}
                            Marking={ Marking }
                            NewAttendance={ NewAttendance }
                        />
                        :
                        <>
                            {
                                DetailsView
                                ?
                                <View2
                                    RequestList={RequestList}
                                    RequestDetails={RequestDetails}
                                    NewAttendance={ NewAttendance }
                                    AccessControls={ AccessControls }

                                    buttonslideSnapeshot={buttonslideSnapeshot}
                                    OnTimeChange={ OnTimeChange }
                                />
                                :
                                <View
                                    View={View}
                                    RequestList={RequestList}
                                />

                            }
                        </>
                    }
                </div>
            </div>
        </>
    )
}
export default Attandence_Request;

const View = ({ RequestList }) => {
    const history = useHistory();

    return (
        <>
            <div className=' popUps'>

                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th>Requested By</th>
                            <th>Requested Date</th>
                            <th>Request Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            RequestList.map(
                                (val, index) => {

                                    const d = new Date(val.request_date);
                                    let newBadge = <p className="newBadge dontSHow"></p>;
                                    if ( d && new Date().getDate() === d.getDate() ) {
                                        newBadge = <p className="newBadge">new</p>;
                                    }

                                    return (
                                        <tr className='pointer' key={index} onClick={() => history.push('/attendance_request/' + val.request_id + '_' + val.id)}>
                                            <td>
                                                { newBadge }
                                                <div className='d-flex align-items-center justify-content-start'>
                                                    <img src={ process.env.REACT_APP_SERVER+'/images/employees/' + val.emp_image } alt="" />
                                                    <div className='pl-2'>
                                                        <p className='mb-0'>{val.sender_name}</p>
                                                        <p className='mb-0 text-secondary'>{val.designation_name}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className='text-secondary'>
                                                {d ? d.toDateString() : null}<br />
                                                {val.request_time}
                                            </td>
                                            <td>
                                                {
                                                    val.request_status === 'sent'
                                                    ?
                                                    <div className='status_div text-white sent'>
                                                        {val.request_status}
                                                    </div>
                                                    :
                                                    val.request_status === 'mark' || val.request_status === 'approved'
                                                    ?
                                                    <div className='status_div text-white approved'>
                                                        {val.request_status}
                                                    </div>
                                                    :
                                                    <div className='status_div text-white rejected'>
                                                        {val.request_status}
                                                    </div>
                                                }
                                            </td>
                                        </tr>
                                    )
                                }
                            )
                        }
                    </tbody>
                </table>

            </div>
        </>
    )

}

const AttRequestForm = (props) => {

    const [Attendance, setAttendance] = useState(
        {
            time_in: '',
            time_out: '',
            break_in: '',
            break_out: ''
        }
    );

    useEffect(
        () => {

            setAttendance(props.Attendance);

        }, [props.Attendance]
    )

    return (
        <form className="Attandence_Request_form popUps" onSubmit={props.Submit}>

            <h5 className="font-weight-bold">Create New Request</h5>

            <div className="Attandence_Request_form_div">

                <div>
                    <p className='font-weight-bold'>Request type</p>
                    <select id="" className="form-control" onChange={props.OnChangeHandler} name='request_type' required >
                        <option value="">Select Your Request Type</option>
                        <option value='update'>I want to correct my timings (Update)</option>
                        <option value='insert'>I want to add my timings (Insert)</option>
                    </select>
                </div>

                <div className='my-3'>
                    <p className='font-weight-bold'>Date</p>
                    <input type="date" className="form-control" onChange={props.OnChangeHandler} name='date' required />
                </div>

                {
                    props.Form.request_type === ''
                    ?
                    null
                    :
                    <>
                        <div style={{display: 'grid', gridTemplateColumns: '50fr 50fr', gridGap: 10}} className='my-2'>
                            <div className="d-flex align-items-center">
                                <input type="checkbox" name='mark_time_in' onChange={props.onMarkChange} /> <span className="pl-2">Update Shift (Start)</span>
                            </div>
                            <div className="d-flex align-items-center">
                                <input type="checkbox" name='mark_time_out' onChange={props.onMarkChange} /> <span className="pl-2">Update Shift (End)</span>
                            </div>
                            <div className="d-flex align-items-center">
                                <input type="checkbox" name='mark_break_in' onChange={props.onMarkChange} /> <span className="pl-2">Update Break (Start)</span>
                            </div>
                            <div className="d-flex align-items-center">
                                <input type="checkbox" name='mark_break_out' onChange={props.onMarkChange} /> <span className="pl-2">Update Break (End)</span>
                            </div>
                        </div>
                    </>
                }

                {
                    props.Marking.mark_time_in
                    ?
                    <div className='my-2'>
                        <div className='d-flex'>
                            <div className='w-100 mr-1'>
                                <p className='font-weight-bold'>Current Time (Start)</p>
                                <input type="time" disabled className="form-control form-control-sm" name="time_in" value={Attendance.time_in} />
                            </div>
                            <div className='w-100 ml-1'>
                                <p className='font-weight-bold'>Enter New Time (Start)</p>
                                <input type="time" className="form-control form-control-sm" onChange={props.OnTimeChange} value={props.NewAttendance.time_in} name="time_in" id="time_in" />
                            </div>
                        </div>
                        {/* <div className='d-flex justify-content-end align-items-center mt-1' style={{ marginRight: '212px' }}>
                            <input type="checkbox" name='time_in' onChange={props.onChangeCheck} />
                            <label for="time_in"> Set to Null </label>
                        </div> */}
                    </div>
                    :
                    null
                }

                {
                    props.Marking.mark_time_out
                    ?
                    <div className='my-2'>
                        <div className='d-flex'>
                            <div className='w-100 mr-1'>
                                <p className='font-weight-bold'>Current Time (End)</p>
                                <input type="time" disabled className="form-control form-control-sm" name="time_out" value={Attendance.time_out} />
                            </div>
                            <div className='w-100 ml-1'>
                                <p className='font-weight-bold'>Enter New Time (End)</p>
                                <input type="time" className="form-control form-control-sm" onChange={props.OnTimeChange} value={props.NewAttendance.time_out} name="time_out" id="time_out" />
                            </div>
                        </div>
                        {/* <div className='d-flex justify-content-end align-items-center mt-1' style={{ marginRight: '212px' }}>
                            <input type="checkbox" name='time_out' onChange={props.onChangeCheck} />
                            <label for="time_out"> Set to Null </label>
                        </div> */}
                    </div>
                    :
                    null
                }

                {
                    props.Marking.mark_break_in
                    ?
                    <div className='my-2'>
                        <div className='d-flex'>
                            <div className='w-100 mr-1'>
                                <p className='font-weight-bold'>Current Break (Start)</p>
                                <input type="time" disabled className="form-control form-control-sm" name="break_in" value={Attendance.break_in} />
                            </div>
                            <div className='w-100 ml-1'>
                                <p className='font-weight-bold'>Enter New Break (Start)</p>
                                <input type="time" className="form-control form-control-sm" onChange={props.OnTimeChange} value={props.NewAttendance.break_in} name="break_in" id='break_in' />
                            </div>
                        </div>
                        {/* <div className='d-flex justify-content-end align-items-center mt-1' style={{ marginRight: '212px' }}>
                            <input type="checkbox" name='break_in' onChange={props.onChangeCheck} />
                            <label for="break_in"> Set to Null </label>
                        </div> */}
                    </div>
                    :
                    null
                }

                {
                    props.Marking.mark_break_out
                    ?
                    <div className='my-2'>
                        <div className='d-flex'>
                            <div className='w-100 mr-1'>
                                <p className='font-weight-bold'>Current Break (End)</p>
                                <input type="time" disabled className="form-control form-control-sm" name="break_out" value={Attendance.break_out} />
                            </div>
                            <div className='w-100 ml-1'>
                                <p className='font-weight-bold'>Enter New Break (End)</p>
                                <input type="time" className="form-control form-control-sm" onChange={props.OnTimeChange} value={props.NewAttendance.break_out} name="break_out" id='break_out' />
                            </div>
                        </div>
                        {/* <div className='d-flex justify-content-end align-items-center mt-1' style={{ marginRight: '212px' }}>
                            <input type="checkbox" name='break_out' onChange={props.onChangeCheck} />
                            <label for="break_out"> Set to Null </label>
                        </div> */}
                    </div>
                    :
                    null
                }

                <div className='my-3'>
                    <p className='font-weight-bold'>Reason</p>
                    <textarea onChange={props.OnChangeHandler} value={props.Form.reason} className="form-control form-control-sm" name='reason' minLength={20} required />
                    <small>{props.Form.reason.trim().length}/20</small>
                </div>
                <div>

                    {
                        props.SnapShot !== null
                            ?
                            <div className='d-flex justify-content-between'>
                                <p className='mb-0 font-weight-bold'>Snapshot <sup>(Optional)</sup></p>
                                <i class="las la-times-circle" onClick={props.closebutton} style={{ fontSize: '20px', cursor: 'pointer' }} ></i>
                            </div>
                            :
                            <div>
                                <p className='mb-0 font-weight-bold'>Snapshot <sup>(Optional)</sup></p>
                            </div>
                    }
                    {
                        props.SnapShot !== null
                        ?
                        <img className='border rounded' src={props.SnapShot} width='100%' alt="snap" />
                        :
                        <input type="file" className='form-control' onChange={props.onUploadSnap} />
                    }
                </div>
            </div>

            <div className="Attandence_Request_form_button" >

                <div className=''>
                    <span className='font-weight-bold'>Submit to
                        <select name="submit_to" onChange={props.OnChangeHandler} id="" className="form-control form-control-sm" required>
                            <option value=''>Select Option</option>
                            {
                                props.Relations.map(
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
                    </span>
                </div>

                <div className="d-flex">
                    <NavLink to="/attendance_request" className="btn cancle" type="reset" >Cancel</NavLink>
                    {
                        props.Form.submit_to === ''
                        ?
                        null
                        :
                        <button className="btn submit ml-2" type="submit">Submit</button>
                    }
                </div>
            </div>

        </form>
    )

}

const View2 = ({ RequestList, RequestDetails, buttonslideSnapeshot, OnTimeChange, NewAttendance, AccessControls }) => {
    const history = useHistory();
    const [ Marked, setMarked ] = useState(false);

    useEffect(
        () => {

            let marked = false;
            RequestDetails.reviews.filter(
                val => {

                    marked = false;
                    if ( val.request_status === 'mark' || val.request_status === 'mark_&_forward' || val.request_status === 'cancel' ) // || val.request_by === parseInt(localStorage.getItem('EmpID')) )
                    {
                        marked = true;
                    }
                    return marked;

                }
            )
            setMarked( marked );

        }, [ RequestDetails.reviews ]
    )

    useEffect(
        () => {
            $('.responsive_left').hide(0);
        },[]
    )

    return (
        <>

            <div className='View2 popUps'>
                <div className='View2_left'>

                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th>Request By</th>
                                <th>Request Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                RequestList.map(
                                    (val, index) => {

                                        const d = new Date(val.request_date);

                                        return (
                                            <tr className={val.id == window.location.href.split('/').pop().split('_').pop() ? 'pointer pointer-hover bg-highlight' : 'pointer pointer-hover'} key={index} onClick={() => history.push('/attendance_request/' + val.request_id + '_' + val.id)}>
                                                <td>
                                                    {val.sender_name}<br />
                                                    <span className='text-secondary'>{val.designation_name}</span>
                                                </td>
                                                <td className='text-secondary'>
                                                    {d ? d.toDateString() : null}<br />
                                                    {val.request_time}
                                                </td>
                                            </tr>
                                        )
                                    }
                                )
                            }
                        </tbody>
                    </table>

                </div>
                <div className='View2_right'>
                    <div className='top'>
                        <div className='View2_grid' >
                            <div className='View2_image'>
                                <img src={process.env.REACT_APP_SERVER+'/images/employees/' + RequestDetails.emp_info.emp_image} alt="employee" className='rounded' />
                            </div>
                            <div>
                                <h5 className='mb-3'>Employee Details</h5>
                                <div className='details'>
                                    <p className='mr-2'>Name</p>
                                    <p className='ml-2' style={{ color: 'gray' }} >{RequestDetails.emp_info.name}</p>
                                </div>

                                <div className='details'>
                                    <p className='mr-2'>Designation</p>
                                    <p className='ml-2' style={{ color: 'gray' }} >{RequestDetails.emp_info.designation_name}</p>
                                </div>

                                <div className='details'>
                                    <p className='mr-2'>Department</p>
                                    <p className='ml-2' style={{ color: 'gray' }} >{RequestDetails.emp_info.department_name}</p>
                                </div>

                                <div className='details'>
                                    <p className='mr-2'>Company</p>
                                    <p className='ml-2' style={{ color: 'gray' }} >{RequestDetails.emp_info.company_name}</p>
                                </div>


                            </div>
                        </div>

                    </div>


                    <div className='bottom mb-4'>

                        <h5>Request Details</h5>

                        <div className='details'>
                            <p >Request Type</p>
                            <p style={{ color: 'gray' }} >{RequestDetails.request_info.request_type}</p>
                        </div>

                        <div className='details'>
                            <p>Requested Date</p>
                            <p style={{ color: 'gray' }} >{new Date(RequestDetails.reviews[0]?.request_date).toDateString()} at {RequestDetails.reviews[0]?.request_time}</p>
                        </div>

                        <div className='details'>
                            <p>Reason</p>
                            <p style={{ color: 'gray' }} >{RequestDetails.request_info.reason}</p>
                        </div>

                        <div className='details'>
                            <p>Snapshot</p>
                            <div>
                                {
                                    RequestDetails.request_info.snapshot === null
                                        ?
                                        <p style={{ color: 'gray' }}>No Snapshot</p>
                                        :
                                        <div className='buttonslideSnapeshot' onClick={() => buttonslideSnapeshot(RequestDetails.request_info.snapshot)}>show</div>

                                }
                            </div>
                        </div>

                        {
                            RequestDetails.reviews.map(
                                ( val, index ) => {

                                    let sender = [];
                                    sender = val.sender_name.split(' ');
                                    if ( sender.length > 2 )
                                    {
                                        sender.pop();
                                    }

                                    let content = null;
                                    if ( index < RequestDetails.reviews.length )
                                    {
                                        content = (
                                            <div className='' key={ index }>
                                                <div className='d-flex justify-content-between'>
                                                    <h5>Requested To Update</h5>
                                                    <h5>{new Date(RequestDetails.request_info.date).toDateString()}</h5>
                                                </div>
                                                <div>
                                                    <table className="table mb-0">
                                                        <tbody>
                                                            {
                                                                val.time_in
                                                                ?
                                                                <tr>
                                                                    <th>Shift (Start)</th>
                                                                    <td>{val.time_in}</td>
                                                                </tr>
                                                                :null
                                                            }
                                                            {
                                                                val.time_out
                                                                ?
                                                                <tr>
                                                                    <th>Shift (End)</th>
                                                                    <td>{val.time_out}</td>
                                                                </tr>
                                                                :null
                                                            }
                                                            {
                                                                val.break_in
                                                                ?
                                                                <tr>
                                                                    <th>Break (Start)</th>
                                                                    <td>{val.break_in}</td>
                                                                </tr>
                                                                :null
                                                            }
                                                            {
                                                                val.break_out
                                                                ?
                                                                <tr>
                                                                    <th>Break (End)</th>
                                                                    <td>{val.break_out}</td>
                                                                </tr>
                                                                :null
                                                            }
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        ) 
                                    }

                                    return content;

                                }
                            )
                        }
                    </div>

                    <div className='bottom'>

                        <div>
                            <h5>Review / Comments</h5>
                        </div>


                        <div className='ReviewsGrid'>

                            {
                                RequestDetails.reviews.map(
                                    (val, index) => {

                                        let receiver = [];
                                        if ( val.receiver_name !== null )
                                        {
                                            receiver = val.receiver_name.split(' ');
                                            if ( receiver.length > 1 )
                                            {
                                                receiver.pop();
                                            }
                                        }else
                                        {
                                            receiver = [val.sender_name];
                                            if ( receiver.length > 1 )
                                            {
                                                receiver.pop();
                                            }
                                        }

                                        return (
                                            <>
                                                <div>

                                                    <div className='details' key={index}>
                                                        <p className='mb-0 mr-2 d-block'>From : </p>
                                                        <p className='mb-0 ml-2 d-block' style={{ color: 'gray' }} >{val.sender_name}</p>
                                                    </div>

                                                    <div className='details' key={index}>
                                                        <p className='mb-0 mr-2 d-block'>To : </p>
                                                        <p className='mb-0 ml-2 d-block' style={{ color: 'gray' }} >{val.receiver_name}</p>
                                                    </div>

                                                    <div className='details'>
                                                        <p className='mb-0 mr-2 d-block'> { receiver.join(' ') } remarks : </p>
                                                        <p className='mb-0 ml-2 d-block' style={{ color: 'gray' }} >{val.remarks === null ? 'No remrks yet' : val.remarks}</p>
                                                    </div>
                                                </div>
                                                <div>

                                                    <div>
                                                        <p>{val.request_time}, {new Date(val.request_date).toDateString()}</p>
                                                    </div>

                                                    <div className='status_div text-white sent'>
                                                        {val.request_status}
                                                    </div>

                                                </div>
                                            </>

                                        )

                                    }
                                )
                            }


                        </div>

                    </div>

                    <NavLink to='/attendance_request' className='View2_right_cancle'>
                        <i class="las la-times"></i>
                    </NavLink>

                </div>


            </div>

            <ToastContainer />

        </>
    )

}