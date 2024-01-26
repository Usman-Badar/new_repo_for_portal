/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-lone-blocks */
import React, { useEffect, useState } from 'react';
import './Attandence_Request.css';

import moment from 'moment';
import { NavLink, useHistory } from 'react-router-dom';
import $ from 'jquery';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import axios from '../../../../../axios';
import socket from '../../../../../io';

import { useSelector } from 'react-redux';
import Modal from '../../../../UI/Modal/Modal';
import Mail from '../../../../UI/Mail/Mail';

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
        request_type: 'update',
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

            if (AccessControls) {
                axios.post(
                    '/getallattendancerequests',
                    {
                        emp_id: localStorage.getItem('EmpID'),
                        all: JSON.parse(AccessControls.access).includes(83) ? 1 : 0,
                        attendance_correcton: true,
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
            }

        }, [ Submittion, AccessControls ]
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
            alert( 'Record of this date is already exist. Select request type [Update]' )
            pass = false;
        }
        
        if ( Form.request_type === 'insert' && !Marking.mark_time_in )
        {
            alert( 'Iime IN must be checked when request type is [Insert]' )
            pass = false;
        } 

        if ( Form.request_type === 'insert' && Marking.mark_time_in && ( NewAttendance.time_in === '' || NewAttendance.time_in === null ) )
        {
            alert( 'Iime IN must be entered when request type is [INSERT]' )
            pass = false;
        } 
        
        // IF TIME OUT IS GREATER THAN TIME IN
        if ( Marking.mark_time_in && Marking.mark_time_out && NewAttendance.time_out < NewAttendance.time_in )
        {
            alert( 'time_out should be greater than time_in' )
            pass = false;
        }

        // IF BREAK OUT IS GREATER THAN BREAK IN
        if ( Marking.mark_break_in && Marking.mark_break_out && NewAttendance.break_out < NewAttendance.break_in )
        {
            alert( 'break_out should be greater than break_in' )
            pass = false;
        }

        // IF BREAK OUT IS GREATER THAN TIME OUT
        if ( Marking.mark_time_out && Marking.mark_break_out && NewAttendance.break_out > NewAttendance.time_out )
        {
            alert( 'break_out should be less than time_out' )
            pass = false;
        }

        // IF BREAK IN IS GREATER THAN TIME OUT
        if ( Marking.mark_time_out && Marking.mark_break_in && NewAttendance.break_in > NewAttendance.time_out )
        {
            alert( 'break_in should be less than time_out' )
            pass = false;
        }

        // IF BREAK IN IS LESS THAN TIME IN
        if ( Marking.mark_time_in && Marking.mark_break_in && NewAttendance.break_in < NewAttendance.time_in )
        {
            alert( 'break_in should be greater than time_in' )
            pass = false;
        }

        // IF BREAK OUT IS LESS THAN TIME IN
        if ( Marking.mark_time_in && Marking.mark_break_out && NewAttendance.break_out < NewAttendance.time_in )
        {
            alert( 'break_out should be greater than time_in' )
            pass = false;
        }

        return pass;

    }

    const Submit = (e) => {

        e.preventDefault();

        let pass = Validation();

        if ( pass )
        {
            $('button[type=submit]').prop('disabled', true);
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
    
                    ShowNotification("Request sent", 'top-center');
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
    
                        axios.post('/sendmail', Data2).then(() => {
    
                        })
                    })
    
                    setTimeout(() => {
                        socket.emit('NewNotification', Form.submit_to);
                        socket.emit('newattendancerequest', '');
                        history.replace('/attendance_request');
                    }, 500);
    
                }
            ).catch(
                err => {
    
                    console.log(err)
    
                }
            )
        }

    }

    const buttonslideSnapeshot = () => {
        if ($('.buttonslideSnapeshot').html() === 'Hide') {
            $('.buttonslideSnapeshot').html('Show');
        } else {
            $('.buttonslideSnapeshot').html('Hide');
        }
        $('.slideSnapeshot').slideToggle();
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

    const OpenRemarks = ( id, request_id ) => {

        const content = 
        <form className="w-100 text-right" onSubmit={ ( e ) => TakeAction( e, id, request_id ) }>
            <textarea name="remarks" className="form-control" placeholder='remarks' required minLength='10'></textarea>
            <button className="btn btn-outline-dark btn-sm mt-2" id="submitBtn">
                submit
            </button>
        </form>

        setContent( content );
        setShowModal( true );

    }

    const TakeAction = ( e, id, request_id ) => {

        e.preventDefault();
        let status = document.getElementById('record_status');
        $('#submitBtn').prop('disabled', true)

        axios.post(
            '/performactionforattrequest',
            {
                request_id: request_id,
                id: id,
                emp_id: localStorage.getItem('EmpID'),
                date_time: new Date().toString(),
                status: RequestAction.request_action,
                forward_to: RequestAction.request_send_to,
                remarks: e.target['remarks'].value,
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
                record_date: new Date( RequestDetails.request_info.date ).toString(),
                record_status: status ? status.value : null
            }
        ).then(
            () => {

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

                $('#submitBtn').prop('disabled', false)
                console.log(err)

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
            <Modal show={ ShowModal } Hide={ onCLose } content={ Content } />
            <div className="Attandence_Request">
                <div className="Attandence_Request_Top" >
                    <div className="Attandence_Request_Top_left">

                        <div className="dropdown_filter">
                            <p className="font-weight-bold">Attandence Requests</p>
                        </div>

                    </div>
                    <div className="Attandence_Request_Top_right">
                        
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
                                            if ( val.request_status === 'sent' )
                                            {
                                                Marking( options );
                                                
                                                
                                                {/* options.push(<option value="approve">Approve</option>);
                                                options.push(<option value="approve_&_forward">Approve & Forward</option>); */}
                                                options.push(<option value="reject">Reject</option>);
                                                {/* options.push(<option value="reject_&_forward">Reject & Forward</option>); */}
                                            }else
                                            if ( val.request_status === 'approve & forward' )
                                            {
                                                Marking( options );
                                            }else
                                            if ( val.request_status === 'approve' )
                                            {
                                                Marking( options );
                                                // eslint-disable-next-line no-lone-blocks
                                                {/* options.push(<option value="approve_&_forward">Approve & Forward</option>); */}
                                            }else
                                            if ( val.request_status === 'reject' )
                                            {
                                                {/* options.push(<option value="reject_&_forward">Reject & Forward</option>); */}
                                            }

                                        }

                                        function Marking( options )
                                        {

                                            if ( AccessControls.access && CheckCancellation() )
                                            {
                                                if ( JSON.parse(AccessControls.access).includes(19) || JSON.parse(AccessControls.access).includes(0) )
                                                {
                                                    options.push(<option value="mark">Mark</option>);
                                                    {/* options.push(<option value="mark_&_forward">Mark & Forward</option>); */}
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
                                                    <select name="request_action" id="" className='form-control col-sm-3 mr-2 form-control-sm request_action' onChange={OnChangeSelect}>
                                                        <option value="">select</option>
                                                        { options }
                                                    </select>
                                                }

                                                {
                                                    RequestAction.request_action === "approve_&_forward" || RequestAction.request_action === "reject_&_forward" || RequestAction.request_action === "mark_&_forward"
                                                    ?
                                                    <select name="request_send_to" id="" className='form-control col-sm-3 mr-2 form-control-sm request_send_to' onChange={OnChangeSelect}>
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
                                                    <div onClick={ () => OpenRemarks( val.id, val.request_id ) } className="btn light mx-2">Update</div>
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
                        <NavLink to='/attendance_request/new' className="btn submit">New</NavLink>

                    </div>
                </div>

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

                            <div className="Attandence_Request_breadcrums">
                                <div className='d-flex'>
                                    <p>
                                        Total Requests :
                                    </p>
                                    <p className='ml-2' style={{color: 'gray'}} >{RequestList.length}</p>
                                </div>
                            </div>

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
        </>
    )
}
export default Attandence_Request;

const View = ({ RequestList }) => {

    return (
        <>
            <div>

                <table className="table table-sm table-hover">
                    <thead>
                        <tr>
                            <th></th>
                            <th></th>
                            <th>Request By</th>
                            <th className='column-lg'>Requested At</th>
                            <th className='column-lg'>Updated At</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            RequestList.map(
                                (val, index) => {
                                    console.log(val)

                                    const d = new Date(val.request_date);
                                    let newBadge = <p className="newBadge dontSHow"></p>;

                                    if ( d )
                                    {
                                        if ( new Date().getDate() === d.getDate() )
                                        {
                                            newBadge = <p className="newBadge">new</p>;
                                        }
                                    }

                                    return (
                                        <tr key={index}>
                                            { newBadge }
                                            <td> <NavLink to={'/attendance_request/' + val.request_id + '_' + val.id}> <img className="d-block mx-auto" src={ process.env.REACT_APP_SERVER+'/images/employees/' + val.emp_image } alt="" /></NavLink>  </td>
                                            <td className='column-sm'> 
                                                <NavLink to={'/attendance_request/' + val.request_id + '_' + val.id}> {val.sender_name}</NavLink>
                                                <NavLink to={'/attendance_request/' + val.request_id + '_' + val.id}> {d ? d.toDateString() : null}</NavLink>  
                                            </td>
                                            <td className='column-lg'> <NavLink to={'/attendance_request/' + val.request_id + '_' + val.id}> {val.sender_name}</NavLink>  </td>
                                            <td className='column-lg'>
                                                <NavLink to={'/attendance_request/' + val.request_id + '_' + val.id}> {d ? d.toDateString() : null}</NavLink><br />
                                                <NavLink to={'/attendance_request/' + val.request_id + '_' + val.id}> {val.request_time}</NavLink>
                                            </td>
                                            <td className='column-lg'>
                                                <NavLink to={'/attendance_request/' + val.request_id + '_' + val.id}> {val.update_date ? new Date(val.update_date).toDateString() : null}</NavLink><br />
                                                <NavLink to={'/attendance_request/' + val.request_id + '_' + val.id}> {val.update_time}</NavLink>
                                            </td>
                                            <td> <NavLink style={ { backgroundColor: "var(--black)" } } className="text-white px-3 rounded-pill" to={'/attendance_request/' + val.request_id + '_' + val.id}> {val.request_status}</NavLink>  </td>
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

    const [ prevDates, setDates ] = useState([]);
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
            loadAttConf();
        }, [props.Dates]
    )
    useEffect(
        () => {
            setAttendance(props.Attendance);
        }, [props.Attendance]
    );
    const loadAttConf = () => {
        axios.get('/getpreviousdateslimit').then(res => {
            const limit = parseInt(res.data[0].valueInt1);
            const dates = props.Dates || [];

            for (let x = 1; x <= limit; x++) {
                dates.push({
                    date: moment().subtract(x, 'day').format('YYYY-MM-DD'),
                    enabled: 1
                });
            }
            setDates(dates);

        }).catch(err => {
            console.log(err);
        });
    }

    function sortFunction(a,b){  
        var dateA = new Date(a.date).getDate();
        var dateB = new Date(b.date).getDate();
        return dateA > dateB ? 1 : -1;  
    }; 

    return (
        <form className="Attandence_Request_form" onSubmit={props.Submit}>

            <h5 className="font-weight-bold">Add New Request</h5>

            <div className="Attandence_Request_form_div">

                <div>
                    <p>Request type</p>
                    <select id="" className="form-control form-control-sm" onChange={props.OnChangeHandler} name='request_type' required disabled>
                        <option value="">select</option>
                        <option selected={props.Form.request_type === 'update'} value='update'>Update</option>
                        <option selected={props.Form.request_type === 'insert'} value='insert'>Insert</option>
                    </select>
                </div>

                <div className='my-3'>
                    <p>Date</p>
                    {/* <input type="date" onChange={props.OnChangeHandler} className="form-control form-control-sm" name='date' required /> */}
                    <select id="" className="form-control form-control-sm" onChange={props.OnChangeHandler} name='date' required >
                        <option value={ new Date().toString() }>{ new Date().toDateString() }</option>
                        {
                            prevDates.sort(sortFunction).map(
                                val => {

                                    return <option value={ new Date(val.date).toString() }>{ new Date(val.date).toDateString() }</option>

                                }
                            )
                        }
                    </select>

                </div>

                {
                    props.Form.request_type === ''
                    ?
                    null
                    :
                    <>
                        <div className="d-flex align-items-center">
                            <input type="checkbox" name='mark_time_in' onChange={props.onMarkChange} /> <small className="pl-2">Update time IN</small>
                        </div>
                        <div className="d-flex align-items-center">
                            <input type="checkbox" name='mark_time_out' onChange={props.onMarkChange} /> <small className="pl-2">Update time OUT</small>
                        </div>
                        {/* <div className="d-flex align-items-center">
                            <input type="checkbox" name='mark_break_in' onChange={props.onMarkChange} /> <span className="pl-2">Mark break in</span>
                        </div>
                        <div className="d-flex align-items-center">
                            <input type="checkbox" name='mark_break_out' onChange={props.onMarkChange} /> <span className="pl-2">Mark break out</span>
                        </div> */}
                    </>
                }

                {
                    props.Marking.mark_time_in
                    ?
                    <div className='my-2'>
                        <div className='d-flex'>
                            <div className='w-100 mr-1'>
                                <p>Time In</p>
                                <input type="time" disabled className="form-control form-control-sm" name="time_in" value={Attendance.time_in} />
                            </div>
                            <div className='w-100 ml-1'>
                                <p>New Time In</p>
                                <input type="time" className="form-control form-control-sm" onChange={props.OnTimeChange} value={props.NewAttendance.time_in === '00:00:00' ? null : props.NewAttendance.time_in} name="time_in" id="time_in" required />
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
                                <p>Time Out</p>
                                <input type="time" disabled className="form-control form-control-sm" name="time_out" value={Attendance.time_out} />
                            </div>
                            <div className='w-100 ml-1'>
                                <p>New Time Out</p>
                                <input type="time" className="form-control form-control-sm" onChange={props.OnTimeChange} value={props.NewAttendance.time_out === '00:00:00' ? null : props.NewAttendance.time_out} name="time_out" id="time_out" required />
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
                    <div className='mb-2'>
                        <div className='d-flex'>
                            <div className='w-100 mr-1'>
                                <p>Break In</p>
                                <input type="time" disabled className="form-control form-control-sm" name="break_in" value={Attendance.break_in} />
                            </div>
                            <div className='w-100 ml-1'>
                                <p>New Break In</p>
                                <input type="time" className="form-control form-control-sm" onChange={props.OnTimeChange} value={props.NewAttendance.break_in === '00:00:00' ? null : props.NewAttendance.break_in} name="break_in" id='break_in' />
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
                    <div>
                        <div className='d-flex'>
                            <div className='w-100 mr-1'>
                                <p>Break Out</p>
                                <input type="time" disabled className="form-control form-control-sm" name="break_out" value={Attendance.break_out} />
                            </div>
                            <div className='w-100 ml-1'>
                                <p>New Break Out</p>
                                <input type="time" className="form-control form-control-sm" onChange={props.OnTimeChange} value={props.NewAttendance.break_out === '00:00:00' ? null : props.NewAttendance.break_out} name="break_out" id='break_out' />
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
                    <p>Reason</p>
                    <textarea onChange={props.OnChangeHandler} value={props.reason} className="form-control form-control-sm" name='reason' required />
                </div>
                <div>

                    {
                        props.SnapShot !== null
                            ?
                            <div className='d-flex justify-content-between'>
                                <p className='mb-2'>Snapshot <sub>(Optional)</sub></p>
                                <i class="las la-times-circle" onClick={props.closebutton} style={{ fontSize: '20px', cursor: 'pointer' }} ></i>
                            </div>
                            :
                            <div>
                                <p className='mb-2'>Snapshot <sub>(Optional)</sub></p>
                            </div>
                    }
                    {
                        props.SnapShot !== null
                            ?
                            <img src={props.SnapShot} width='100%' alt="snap" />
                            :
                            <input type="file" onChange={props.onUploadSnap} />
                    }
                </div>
            </div>

            <div className="Attandence_Request_form_button" >

                <div className=''>
                    <span>Submit to :
                        <select name="submit_to" onChange={props.OnChangeHandler} id="" className="form-control form-control-sm" required>
                            <option value=''> select </option>
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
                    <NavLink to="/attendance_request" className="btn btn-sm cancle" type="reset" >Cancel</NavLink>
                    {
                        props.Form.submit_to === ''
                        ?
                        null
                        :
                        <button className="btn btn-sm submit" type="submit">Submit</button>
                    }
                </div>
            </div>

        </form>
    )

}

const View2 = ({ RequestList, RequestDetails, buttonslideSnapeshot, OnTimeChange, NewAttendance, AccessControls }) => {

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

            <div className='View2'>

                <div className='View2_left'>

                    <table className="table table-sm table-hover">
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
                                            <tr key={index} >
                                                <td> <NavLink to={'/attendance_request/' + val.request_id + '_' + val.id}> {val.sender_name}</NavLink>  </td>
                                                <td> <NavLink to={'/attendance_request/' + val.request_id + '_' + val.id}> {d ? d.toDateString() : null}</NavLink>  </td>
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
                                <img src={process.env.REACT_APP_SERVER+'/images/employees/' + RequestDetails.emp_info.emp_image} alt="" />
                            </div>
                            <div>
                                <h4 className='mb-3'>Employee Details</h4>
                                <div className='details'>
                                    <p className='mr-2'>Name :</p>
                                    <p className='ml-2' style={{ color: 'gray' }} >{RequestDetails.emp_info.name}</p>
                                </div>

                                <div className='details'>
                                    <p className='mr-2'>Designation :</p>
                                    <p className='ml-2' style={{ color: 'gray' }} >{RequestDetails.emp_info.designation_name}</p>
                                </div>

                                <div className='details'>
                                    <p className='mr-2'>Department :</p>
                                    <p className='ml-2' style={{ color: 'gray' }} >{RequestDetails.emp_info.department_name}</p>
                                </div>

                                <div className='details'>
                                    <p className='mr-2'>Company :</p>
                                    <p className='ml-2' style={{ color: 'gray' }} >{RequestDetails.emp_info.company_name}</p>
                                </div>


                            </div>
                        </div>

                    </div>


                    <div className='bottom mb-4'>

                        <div>
                            <h4>Request Details</h4>
                        </div>

                        <div className='details'>
                            <p>Reason : </p>
                            <p style={{ color: 'gray' }} >{RequestDetails.request_info.reason}</p>
                        </div>

                        <div className='details'>
                            <p>Date : </p>
                            <p style={{ color: 'gray' }} >{new Date(RequestDetails.request_info.date).toDateString()}</p>
                        </div>

                        <div className='details'>
                            <p >Request Type : </p>
                            <p style={{ color: 'gray' }} >{RequestDetails.request_info.request_type}</p>
                        </div>

                        <div className='details'>
                            <p>Snapshot : </p>
                            <div>
                                {
                                    RequestDetails.request_info.snapshot === null
                                        ?
                                        <p style={{ color: 'gray' }}>No Snapshot</p>
                                        :
                                        <>
                                            <div className='buttonslideSnapeshot' onClick={buttonslideSnapeshot}>show</div>
                                            <div className='slideSnapeshot' >
                                                <img src={RequestDetails.request_info.snapshot} alt="" />
                                            </div>
                                        </>

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
                                                <p>{ sender.join(' ') } timings : </p>
                                                <div>
                                                    <table className="table table-sm">

                                                        <thead>
                                                            <tr>

                                                                <th> Time in </th>
                                                                <th> Time out </th>
                                                                <th> Break in </th>
                                                                <th> Break out </th>

                                                            </tr>
                                                        </thead>

                                                        <tbody>
                                                            <tr>

                                                                <td> { val.time_in } </td>
                                                                <td> { val.time_out } </td>
                                                                <td> { val.break_in } </td>
                                                                <td> { val.break_out } </td>

                                                            </tr>
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

                        {
                            Marked
                            ?
                            null
                            :
                            AccessControls.access && RequestDetails.reviews.length > 0 //&& RequestDetails.reviews[0].request_by !== parseInt( localStorage.getItem('EmpID') )
                            ?
                            JSON.parse(AccessControls.access).includes(19) || JSON.parse(AccessControls.access).includes(0)
                            ?
                            <div className='details d-block'>
                                <p>Your timings : </p>
                                <div>
                                    <table className="table table-sm">

                                        <tbody>
                                            <tr>

                                                <td className="text-left">
                                                    <label className="mb-0">Time IN</label><br />
                                                    <input type='time' name="time_in" id="time_in_check" value={ !NewAttendance.time_in || NewAttendance.time_in === '00:00:00' ? null : NewAttendance.time_in } style={ { width: '100% !important' } } onChange={ OnTimeChange } /> 
                                                    <div className='w-100 text-left d-flex align-items-center'>
                                                        {/* <input onChange={ OnTimeChange } type='checkbox' name="time_in_check" /> <span> Set to null </span> */}
                                                    </div>
                                                </td>
                                                <td className="text-left">
                                                    <label className="mb-0">Time OUT</label><br />
                                                    <input type='time' name="time_out" id="time_out_check" value={ !NewAttendance.time_out || NewAttendance.time_out === '00:00:00' ? null : NewAttendance.time_out } style={ { width: '100% !important' } } onChange={ OnTimeChange } /> 
                                                    <div className='w-100 text-left d-flex align-items-center'>
                                                        {/* <input onChange={ OnTimeChange } type='checkbox' name="time_out_check" /> <span> Set to null </span> */}
                                                    </div>
                                                </td>
                                                <td className="text-left">
                                                    <label className="mb-0">Break IN</label><br />
                                                    <input type='time' name="break_in" id="break_in_check" value={ !NewAttendance.break_in || NewAttendance.break_in === '00:00:00' ? null : NewAttendance.break_in } style={ { width: '100% !important' } } onChange={ OnTimeChange } /> 
                                                    <div className='w-100 text-left d-flex align-items-center'>
                                                        {/* <input onChange={ OnTimeChange } type='checkbox' name="break_in_check" /> <span> Set to null </span> */}
                                                    </div>
                                                </td>
                                                <td className="text-left">
                                                    <label className="mb-0">Break OUT</label><br />
                                                    <input type='time' name="break_out" id="break_out_check" value={ !NewAttendance.break_out || NewAttendance.break_out === '00:00:00' ? null : NewAttendance.break_out } style={ { width: '100% !important' } } onChange={ OnTimeChange } /> 
                                                    <div className='w-100 text-left d-flex align-items-center'>
                                                        {/* <input onChange={ OnTimeChange } type='checkbox' name="break_out_check" /> <span> Set to null </span> */}
                                                    </div>
                                                </td>
                                                <td className="text-left">
                                                    <label className="mb-0">Status</label><br />
                                                    <select name="" id="record_status" defaultValue='Present'>
                                                        <option value="Present">Present</option>
                                                        <option value="Late">Late</option>
                                                        <option value="Absent">Absent</option>
                                                        <option value="Holiday">Holiday</option>
                                                        <option value="OFF">OFF</option>
                                                    </select>
                                                </td>

                                            </tr>
                                        </tbody>

                                    </table>
                                </div>
                            </div>
                            :
                            null
                            :
                            null
                        }

                        {
                            RequestDetails.request_info.marked_time_in === null &&
                            RequestDetails.request_info.marked_time_out === null &&
                            RequestDetails.request_info.marked_break_in === null &&
                            RequestDetails.request_info.marked_break_out === null
                            ?
                            null
                            :
                            <div className='details'>
                                <p>Marked timings : </p>
                                <div>
                                    <table className="table table-sm">

                                        <thead>
                                            <tr>

                                                <th> Time in </th>
                                                <th> Time out </th>
                                                <th> Break in </th>
                                                <th> Break out </th>

                                            </tr>
                                        </thead>

                                        <tbody>
                                            <tr>

                                                <td> { RequestDetails.request_info.marked_time_in } </td>
                                                <td> { RequestDetails.request_info.marked_time_out } </td>
                                                <td> { RequestDetails.request_info.marked_break_in } </td>
                                                <td> { RequestDetails.request_info.marked_break_out } </td>

                                            </tr>
                                        </tbody>

                                    </table>
                                </div>
                            </div>
                        }

                    </div>

                    <div className='bottom'>

                        <div>
                            <h4>Review / Comments</h4>
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
                                                        <small className='mr-2 d-block'>From : </small>
                                                        <small className='ml-2 d-block' style={{ color: 'gray' }} >{val.sender_name}</small>
                                                    </div>

                                                    <div className='details' key={index}>
                                                        <small className='mr-2 d-block'>To : </small>
                                                        <small className='ml-2 d-block' style={{ color: 'gray' }} >{val.receiver_name}</small>
                                                    </div>

                                                    <div className='details'>
                                                        <small className='mr-2 d-block'> { receiver.join(' ') } remarks : </small>
                                                        <small className='ml-2 d-block' style={{ color: 'gray' }} >{val.remarks === null ? 'No remrks yet' : val.remarks}</small>
                                                    </div>
                                                </div>
                                                <div>

                                                    <div>
                                                        <p>{new Date(val.request_date).toDateString()}</p>
                                                    </div>

                                                    <div className='statusbox'>
                                                        <p>{val.request_status}</p>
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