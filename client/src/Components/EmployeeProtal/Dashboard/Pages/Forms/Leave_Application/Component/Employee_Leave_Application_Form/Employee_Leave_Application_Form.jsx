/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import $ from 'jquery';
import './Employee_Leave_Application_Form.css';
import axios from '../../../../../../../../axios';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Mail from '../../../../../../../UI/Mail/Mail';
import moment from 'moment';

const Employee_Leave_Application_Form = ( props ) => {
    
    const [ LeaveData, setLeaveData ] = useState(
        {
            leaveType: '', leaveFrom: '', leaveTo: '',
            NoOfDays: 0, Purpose: '', leaveDate: '', submit_to: ''
        }
    );
    const [MailData, setMailData] = useState(
        {
            subject: "",
            send_to: "",
            gender: "",
            receiver: "",
            message: ""
        }
    );
    const [ LeavesAvailed, setLeavesAvailed ] = useState(0);
    const [ Attachement, setAttachement ] = useState(
        {
            name: '', file: ''
        }
    );

    useEffect(
        () => {
            
            if ( LeaveData.leaveFrom !== '' && LeaveData.leaveFrom === LeaveData.leaveTo )
            {
                $('#checked_single').prop('checked', true);
                onDayLeave();
                setLeaveData(
                    {
                        ...LeaveData,
                        leaveDate: LeaveData.leaveFrom,
                        leaveFrom: '',
                        leaveTo: ''
                    }
                );
                $('#leaveDate').val(LeaveData.leaveFrom);
            }

        }, [ LeaveData.leaveFrom, LeaveData.leaveTo ]
    );

    useEffect(
        () => {
            
            $('.Medical_Prove').hide(0);
            $('.Employee_Leave_Application_Form .Application_Form .Leave_Duration_Date2').slideUp(0);

            axios.post(
                '/leave/total_days_count',
                {
                    emp_id: localStorage.getItem("EmpID")
                }
            ).then(
                res => {

                    setLeavesAvailed( res.data[0].total_leaves );

                }
            ).catch(
                err => {

                    console.log( err );

                }
            )

        }, []
    );

    useEffect(
        () => {

            for ( let x = 0; x < props.Relations.length; x++ )
            {
                if ( parseInt(props.Relations[x].sr) === parseInt(LeaveData.submit_to) )
                {
                    setMailData(
                        {
                            subject: "New Leave",
                            send_to: props.Relations[x].email,
                            gender: props.Relations[x].gender === 'FeMale' ? "Madam" : "Sir",
                            receiver: props.Relations[x].name,
                            message: localStorage.getItem('name') + ' apply for a leave on the portal'
                        }
                    );
                }
            }
            
        }, [ LeaveData.submit_to ]
    )

    const onChangeHandler = ( e ) => {

        const { name, value, type } = e.target;

        if ( type === 'radio' )
        {
            if ( name === 'leaveType' && value === 'Sick' )
            {
                // $("input[name='attachement']").attr('required', true);
                $('.Medical_Prove').show(500);
            }else
            {
                $("input[name='attachement']").attr('required', false);
                $('.Medical_Prove').hide(500);
            }
        }

        // if ( name === 'leaveType' )
        // {
        //     if ( value === 'Privilege' ) document.getElementsByName("leaveFrom")[0].setAttribute('min', moment(moment(), "DD-MM-YYYY").add(14, 'days').toISOString().split('T')[0]);
        //     if ( value === 'Casual' )
        //     {
        //         document.getElementsByName("leaveFrom")[0].setAttribute('min', moment(moment(), "DD-MM-YYYY").toISOString().split('T')[0]);
        //         document.getElementsByName("leaveTo")[0].setAttribute('max', moment(moment(), "DD-MM-YYYY").add(3, 'days').toISOString().split('T')[0]);
        //     }
        // }

        const val = {
            ...LeaveData,
            [name]: value
        }

        setLeaveData( val );

    }

    const DaysAndDate = ( e ) => {


        const { name, value } = e.target;

        const moment = require('moment');
        let NoOfDays = 0;

        if ( name === 'leaveDate' )
        {

            // Empty

        }else
        {
            if ( name === 'leaveFrom' && value !== '' && LeaveData.leaveTo !== '' )
            {
                if ( LeaveData.leaveTo > value )
                {

                    const startDate = value;
                    const endDate = LeaveData.leaveTo;    
                    
                    const days = moment(endDate).diff(moment(startDate), 'days');
                    NoOfDays = (parseInt(days) + 1);

                }else
                {
                    NoOfDays = 0;
                }
            }

            if ( name === 'leaveTo' && value !== '' && LeaveData.leaveFrom !== '' )
            {
                if ( LeaveData.leaveFrom < value )
                {
                    const startDate  = LeaveData.leaveFrom;
                    const endDate    = value;    
                
                    const days = moment(endDate).diff(moment(startDate), 'days');
                    NoOfDays = (parseInt(days) + 1); 
                }
                else
                {
                    NoOfDays = 0;
                }
            }
        }

        const val = {
            ...LeaveData,
            [name]: value,
            NoOfDays: NoOfDays
        }

        setLeaveData( val ); 

    }

    const onAttachement = ( e ) => {

        const reader = new FileReader();
        const d = new Date();

        reader.onload = () => {

            if( reader.readyState === 2 )
            {

                setAttachement(
                    {
                        ...Attachement,
                        name: localStorage.getItem('name') + '_' + localStorage.getItem('EmpID') + "_" + d.getDate().toString() + '-' + ( d.getMonth() + 1 ).toString() + '-' + d.getFullYear().toString() + '_' + d.getTime().toString(),
                        file: e.target.files[0]
                    }
                )

            }

        }

        reader.readAsDataURL( e.target.files[0] );

    }

    const onTakeLeave = ( e ) => {

        e.preventDefault();
        let noError = false;

        if ( LeaveData.leaveType === '' )
        {

            toast.dark( 'Please Fill all The Fields' , {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
                    
            noError = true;

        }

            if ( $('input[name=OnDayLeave]').prop('checked') )
            {
                if ( LeaveData.leaveDate === '' )
                {
                    toast.dark( 'Please Fill all The Date Fields' , {
                        position: 'top-right',
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });

                    noError = true;
                }
            }else
            {
                if ( LeaveData.leaveFrom === '' || LeaveData.leaveTo === '' )
                {
                    toast.dark( 'Please Fill all The Date Fields' , {
                        position: 'top-right',
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });

                    noError = true;
                }
            }

        if ( !noError )
        {
            const Data = new FormData();
            Data.append('RequestedBy', localStorage.getItem('EmpID'));
            Data.append('RequestedTo', LeaveData.submit_to);
            Data.append('leaveType', LeaveData.leaveType);
            Data.append('leaveFrom', LeaveData.leaveFrom);
            Data.append('leaveTo', LeaveData.leaveTo);
            Data.append('leaveDate', LeaveData.leaveDate);
            Data.append('onDayLeave', $('input[name=OnDayLeave]').prop('checked') ? 1 : 0);
            Data.append('NoOfDays', LeaveData.NoOfDays);
            Data.append('Purpose', LeaveData.Purpose);
            Data.append('AttachementName', Attachement.name.replace(/\s/g, ''));
            Data.append('AttachementFile', Attachement.file);
            Data.append('Availed', $('input[type=number]').val());
    
            axios.post('/applyleave', Data).then( () => {

                toast.dark( 'Request Submitted' , {
                    position: 'top-right',
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                $('button[type=reset]').trigger('click');
                $('.Medical_Prove').hide(500);
                $('#mail_form').trigger('click');
                setLeaveData(
                    {
                        leaveType: '', leaveFrom: '', leaveTo: '',
                        NoOfDays: 0, Purpose: '', leaveDate: '', submit_to: ''
                    }
                );
                if ($('input[name=OnDayLeave]').prop('checked')) {

                    $('.Employee_Leave_Application_Form .Application_Form .Leave_Duration_Date').slideUp(500);
                    $('.Employee_Leave_Application_Form .Application_Form .Leave_Duration_Date2').slideDown(500);
                    $('.Employee_Leave_Application_Form .Application_Form input[type=date]').val('');

                } else {

                    $('.Employee_Leave_Application_Form .Application_Form .Leave_Duration_Date').slideDown(500);
                    $('.Employee_Leave_Application_Form .Application_Form .Leave_Duration_Date2').slideUp(500);

                }

                const Data2 = new FormData();
                Data2.append('eventID', 2);
                Data2.append('whatsapp', true);
                Data2.append('receiverID', LeaveData.submit_to);
                Data2.append('senderID', localStorage.getItem('EmpID'));
                Data2.append('Title', localStorage.getItem('name'));
                Data2.append('NotificationBody', localStorage.getItem('name') + ' has applied apply for a leave on the portal');
                axios.post('/newnotification', Data2).then(() => {
                    
                })
    
            } ).catch( err => {
    
                toast.dark( err.toString() , {
                    position: 'top-right',
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
    
            } )
        }
            
        

    }

    const onDayLeave = () => {

        if ( $('input[name=OnDayLeave]').prop('checked') )
        {

            $('.Employee_Leave_Application_Form .Application_Form .Leave_Duration_Date').slideUp(500);
            $('.Employee_Leave_Application_Form .Application_Form .Leave_Duration_Date2').slideDown(500);
            $('.Employee_Leave_Application_Form .Application_Form input[type=date]').val('');
            setLeaveData(
                {
                    ...LeaveData, leaveFrom: '', leaveTo: '',
                    NoOfDays: 0
                }
            );
        }else
        {
            $('.Employee_Leave_Application_Form .Application_Form .Leave_Duration_Date').slideDown(500);
            $('.Employee_Leave_Application_Form .Application_Form .Leave_Duration_Date2').slideUp(500);
            setLeaveData(
                {
                    ...LeaveData, leaveFrom: '', leaveTo: '',
                    NoOfDays: 0
                }
            );
        }

    }

    return (
        <>
            <Mail
                data={ MailData }
            />
            <div className={ props.LeaveForm ? "Employee_Leave_Application_Form" : "Employee_Leave_Application_Form availedform" }>
                <div className="Application_Form" style={ { animationDelay: ( 0 + '.' + 1 ).toString() + 's' } }>
                    <form onSubmit={ onTakeLeave }>
                        <h3 className="heading">
                            { props.Mainheading }
                            <sub>Application Form</sub>
                        </h3>

                        <hr />

                        <div className="number_of_days_container">
                            <span>Single Day Leave</span>
                            <input className="d-block" type='checkbox' id="checked_single" value="true" name='OnDayLeave' onChange={ onDayLeave } />
                        </div>

                        <div className="grid_container types my-4">
                            <div className="leave_type_container">
                                <div className="d-flex align-items-center">
                                    <input name='leaveType' value="Privilege" type="radio" className="mr-2" onChange={onChangeHandler}/>
                                    <label>
                                        Privilege
                                    </label>
                                </div>
                                <p className="mb-0">
                                    Privilege leave (PL) means earned leaves (EL) granted to the employee every year in lieu of his services.
                                </p>
                            </div>

                            <div className="leave_type_container">
                                <div className="d-flex align-items-center">
                                    <input name='leaveType' value="Casual" type="radio" className="mr-2" onChange={onChangeHandler}/>
                                    <label>
                                        Casual
                                    </label>
                                </div>
                                <p className="mb-0">
                                    Casual Leave or CL is granted to an employee in case if he/she could not report to work for an unforeseen situation.
                                </p>
                            </div>

                            <div className="leave_type_container">
                                <div className="d-flex align-items-center">
                                    <input name='leaveType' value="Sick" type="radio" className="mr-2" onChange={onChangeHandler}/>
                                    <label>
                                        Sick
                                    </label>
                                </div>
                                <p className="mb-0">
                                    Sick leave is paid time off from work that workers can use to stay home to address their health needs without losing pay.
                                </p>
                            </div>

                            {/* <div className="leave_type_container">
                                <div className="d-flex align-items-center">
                                    <input name='leaveType' value="Other" type="radio" className="mr-2" onChange={onChangeHandler}/>
                                    <label>
                                        Other
                                    </label>
                                </div>
                                <p className="mb-0">
                                    Any other leave that an employee wants to avail in specific circumstances.
                                </p>
                            </div> */}
                        </div>
                        
                        <div className="grid_container Leave_Duration_Date">
                            <div>
                                <label className='mb-0'>Leave From</label>
                                <input type="date" className="form-control mb-2" name="leaveFrom" onChange={ DaysAndDate } />
                            </div>
                            <div>
                                <label className='mb-0'>Leave To</label>
                                <input type="date" className="form-control mb-2" name="leaveTo" onChange={ DaysAndDate } />
                            </div>
                            <div>
                                <label className='mb-0'>No. of Days</label>
                                <input value={ LeaveData.NoOfDays } disabled type="text" className="form-control mb-2" />
                            </div>
                            <div>
                                <label className='mb-0'>No. of Leaves Availed ({new Date().getFullYear() - 1} - {new Date().getFullYear()})</label>
                                <input value={ LeavesAvailed } disabled type="text" className="form-control mb-2" />
                            </div>
                        </div>
                        
                        <div className="grid_container Leave_Duration_Date Leave_Duration_Date2">
                            <div>
                                <label className='mb-0'>Leave Date</label>
                                <input type="date" className="form-control" id="leaveDate" name="leaveDate" onChange={ DaysAndDate } />
                            </div>
                            <div>
                                <label className='mb-0'>No. of Leaves Availed ({new Date().getFullYear() - 1} - {new Date().getFullYear()})</label>
                                <input value={ LeavesAvailed } disabled type="text" className="form-control" />
                            </div>
                        </div>
                        
                        <label className='mb-0 mt-3'>Reason To Avail Leave</label>
                        <textarea name="Purpose" onChange={ onChangeHandler } required minLength='30' placeholder="Describe your reason in detail..." style={{height: '80px'}} className="form-control" />
                        
                        <div className="Medical_Prove">
                            <div className="Leave_Purpose_Heading" >
                                <label className='mb-0 mt-3'>Medical Attachment</label>
                            </div>
                            <div className="Leave_Purpose_reason">
                                <input name="attachement" onChange={ onAttachement } type="file" className="form-control" />
                                <input type="number" defaultValue={ props.availed } className="d-none form-control" />
                            </div>
                        </div>
                        <div className="mt-3">
                            <label className='mb-0'>Submit Application To</label>
                            <select name="submit_to" onChange={onChangeHandler} id="" className="form-control form-control-sm" required>
                                <option value=''> submit to </option>
                                {
                                    props.Relations.map(
                                        (val, index) => {
                                            let option;
                                            if ( val.category === 'all' || val.category.includes('leave_request') )
                                            {
                                                option = <option value={val.sr} key={index}> {val.name} </option>;
                                            }

                                            return option;
                                        }
                                    )
                                }
                            </select>
                        </div>

                        <div className="d-flex align-items-center justify-content-end mt-3">
                            <button type="reset" className="btn green">Cancel</button>
                            {
                                LeaveData.leaveType === '' || 
                                LeaveData.Purpose === '' || 
                                LeaveData.submit_to === ''
                                ?null
                                :
                                <button type="submit" className="btn submit ml-3">Submit</button>
                            }
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}
export default Employee_Leave_Application_Form;