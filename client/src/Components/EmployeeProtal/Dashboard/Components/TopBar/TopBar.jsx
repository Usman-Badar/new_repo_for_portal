/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/no-distracting-elements */
import React, { useEffect, useState } from 'react';

import './TopBar.css';
import Typewriter from 'typewriter-effect';

import socket from '../../../../../io';
import axios from '../../../../../axios';
import $ from 'jquery';
import { NavLink, useHistory, useLocation } from 'react-router-dom';
import Modal from '../../../../UI/Modal/Modal';
import moment from 'moment';

import { useSelector, useDispatch } from 'react-redux';
import { ShowSideBar } from '../../../../../Redux/Actions/Action';

import Notifications from '../Notifications/Notifications';

const TopBar = () => {

    const history = useHistory();
    const location = useLocation();
    const Data = useSelector( ( state ) => state.EmpAuth.EmployeeData );
    const ShowBar = useSelector( ( state ) => state.SideBar.ShowSideBar );
    const dispatch = useDispatch();
    const key = 'real secret keys should be long and random';
    const encryptor = require('simple-encryptor')(key);
    const [ ViewNote, setViewNote ] = useState(false);
    const [ AdminNotifications, setAdminNotifications ] = useState([]);
    const [ AllNotifications, setAllNotifications ] = useState([]);
    const [ Messages, setMessages ] = useState([]);

    useEffect(
        () => {
            loadAdminNotifications();
        }, []
    )

    useEffect(
        () => {
            if ( window.location.href.includes('?openAdminNoteModel') )
            {
                setViewNote(true);
            }else
            {
                if ( ViewNote ) setViewNote(false);
            }
        }, [location]
    )

    useEffect(
        () => {
            if ( AdminNotifications.length > 0 )
            {
                let messages = [];
                for ( let x = 0; x < AdminNotifications.length; x++ )
                {
                    // if ( !messages.includes( AdminNotifications[x].message ) )
                    // {
                        messages.push(AdminNotifications[x].message);
                    // }
                }
                setMessages( messages );
            }
        }, [AdminNotifications]
    )

    useEffect(
        () => {
            // if ( Messages.length > 0 )
            // {
            //     typeWriter(Messages[0]);
            // }
            socket.on(
                'admin_notification', (data) => {
                    if ( parseInt(data.owner) === parseInt(localStorage.getItem("EmpID")) )
                    {
                        $('#topbar_news').css('color', '#F2AE03');
                        setTimeout(() => {
                            $('#topbar_news').css('color', '#eff2f5');
                        }, 3000);
                        setMessages([data.message]);
                    }
                }
            )
        }, [Messages]
    )

    useEffect(
        () => {

            $('.search i').on('click', () => {
                $('.search_dropdown').toggle(300);
            });

            $('.emp_img').on('click', () => {
                $('.emp_dropdown').toggle(300);
            });

            $('.emp_dropdown').on('click', () => {
                $('.emp_dropdown').toggle(300);
            });

            $('.content').on('click', () => {
                $('.emp_dropdown').hide(300);
            });

            $('.Dashboard_sideBar .links').on('click', () => {
                $('.emp_dropdown').hide(300);
            });

            document.addEventListener(
                'keypress',
                ( e ) => {

                    if ( e.shiftKey && e.keyCode === 43 )
                    {
                        dispatch( ShowSideBar( true ) );
                    }else if ( e.shiftKey && e.keyCode === 45 )
                    {
                        dispatch( ShowSideBar( false ) );
                    }

                }
            )

        }, []
    );

    const TrueOrFalse = () => {
        dispatch( ShowSideBar( !ShowBar ) );
    }

    const loadAdminNotifications = () => {
        axios.post(
            '/admin/notifications',
            {
                emp_id: localStorage.getItem('EmpID')
            }
        ).then( res => {
            setAdminNotifications(res.data);
        } ).catch( err => {
            console.log( err );
        } )
    }

    const loadAllNotifications = () => {
        axios.post(
            '/admin/notifications/all',
            {
                emp_id: localStorage.getItem('EmpID')
            }
        ).then( res => {
            setAllNotifications(res.data);
        } ).catch( err => {
            console.log( err );
        } )
    }

    return (
        <>
            <div className="Dashboard_topbar d-center">
                <Modal show={ ViewNote } Hide={ () => history.goBack() } content={ <NotificationsList location={ location } history={ history } AllNotifications={ AllNotifications } loadAllNotifications={ loadAllNotifications } /> } />
                <marquee direction="left" className="topbar_news d-450-none" id='topbar_news' onClick={ () => history.push('?openAdminNoteModel') }>
                    {/* <Typewriter
                        options={{
                            strings: Messages,
                            autoStart: true,
                            loop: true,
                            delay: 40,
                            deleteSpeed: 10
                        }}
                    /> */}
                    {Messages.join('__')}
                </marquee>
                <div className=" d-450-block"></div>
                <div className="icons d-center">
                    <Notifications Data={ Data } />
                    <div className="px-3 emp_img_container">
                        <div className="emp_img" style={ { "backgroundImage" : "url('images/employees/" + Data.emp_image + "')" } }></div>
                        <div className="emp_dropdown">
                            <p className="pl-4 pb-2 mb-1 font-weight-bold border-bottom"> { encryptor.decrypt( Data.login_id ) } </p>
                            <NavLink to="/profile/personal/info" className="d-center links">
                                <div className="pr-3"><i className="las la-user"></i></div>
                                <div className="links_txt">Profile</div>
                            </NavLink>
                            <NavLink to="/logout" className="d-center links">
                                <div className="pr-3"><i className="las la-sign-out-alt"></i></div>
                                <div className="links_txt">Logout</div>
                            </NavLink>
                        </div>
                    </div>
                    <div className="threeDots d-1400-block" onClick={ TrueOrFalse }>
                        <button className="btn p-0 m-0">
                            <i className="las la-ellipsis-v" style={ { color: "var(--gray-text)" } }></i>
                        </button>
                    </div>
                </div>
            </div>
        </>
    )

}

export default TopBar;

const NotificationsList = ({ location, history, AllNotifications, loadAllNotifications }) => {
    useEffect(
        () => {
            loadAllNotifications();
        }, [ location ]
    );

    const openNotification = ( notification_id, link ) => {
        axios.post(
            '/admin/notification/viewed',
            {
                notification_id: notification_id
            }
        )
        history.push(link);
    }

    return (
        <>
            <div>
                <h4>Notifications</h4>
                <table className='table mt-3'>
                    <thead>
                        <tr>
                            <th>Sr.No</th>
                            <th>Body</th>
                            <th>Date & Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            AllNotifications.map(
                                ( val, index ) => {
                                    return (
                                        <tr className={ val.view_date ? "viewed" : "" } key={index} onClick={ () => openNotification( val.notification_id, val.link ) }>
                                            <td>{ index + 1 }</td>
                                            <td>{ val.message }</td>
                                            <td>
                                                { new Date(val.note_date).toDateString() }<br />
                                                { moment(val.note_time,'h:mm:ss a').format('hh:mm A') }
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