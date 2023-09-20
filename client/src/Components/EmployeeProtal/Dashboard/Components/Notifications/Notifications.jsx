import React, { useEffect, useState } from 'react';

import './Notifications.css';
import axios from '../../../../../axios';
import { Link, useHistory } from 'react-router-dom';

import $ from 'jquery';

import socket from '../../../../../io';
import Icon from '../../../../../images/logo192.png';

function Notifications( props ) {

    const history = useHistory();
    const [ View, setView ] = useState("notifications");
    const [ Notificationss, setNotificationss ] = useState([]);
    const [ Permisstion, setPermisstion ] = useState( true );

    useEffect(
        () => {
            if ( props.Data.emp_id )
            {
                GetNotify();
            }
            socket.on(
                'NotifyTheUser', ( notify_to ) => {
    
                    if ( props.Data.emp_id === parseInt( notify_to ) )
                    {
                        // deleteStore('notifications');
                        GetNotify();
                    }
    
                }
            )

        // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [ props.Data.emp_id ]
    );
    useEffect(
        () => {
            $('.Notifications_Box').fadeOut(0);
            $('#dashboard_content, .Dashboard_sideBar').on('click', function() {
                $('.Notifications_Box').fadeOut(0);
            });
        }, []
    )

    const getOS = () => {
        var userAgent = window.navigator.userAgent,
            platform = window.navigator.platform,
            macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'],
            windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'],
            iosPlatforms = ['iPhone', 'iPad', 'iPod'],
            os = null;

        if (macosPlatforms.indexOf(platform) !== -1) {
            os = 'Mac OS';
        } else if (iosPlatforms.indexOf(platform) !== -1) {
            os = 'iOS';
        } else if (windowsPlatforms.indexOf(platform) !== -1) {
            os = 'Windows';
        } else if (/Android/.test(userAgent)) {
            os = 'Android';
        } else if (!os && /Linux/.test(platform)) {
            os = 'Linux';
        }

        return os;
    }

    const GetNotify = () => {

        const Data = new FormData();
        Data.append('EmpID', localStorage.getItem('EmpID'));
    
            axios.post('/getnotifications', Data).then(res => {
    
                setNotificationss( res.data.reverse() );
                
                let notify = false;
                let sender = null;
                let txt = null;
                for ( let x = 0; x < res.data.length; x++ )
                {
                    if ( res.data[x].notified === null )
                    {
                        notify = true;
                        sender = res.data[x].notification_title;
                        txt = res.data[x].notification_body;
                    }
                }
    
                if ( notify )
                {
                    axios.post('/notified', Data).then(res => {
    
                        if 
                        (
                            getOS() !== 'iOS' && getOS() !== 'Android'
                        ) 
                        {
                            Note(res.data.length, sender, txt);
                        }
                    
            
                    }).catch(err => {
            
                        console.log(err);
            
                    });
                }
    
            }).catch(err => {
    
                console.log(err);
    
            });

    }


    const Note = ( length, sender, body ) => {

        if (Notification.permission !== 'granted') {

            Notification.requestPermission().then(permission => {

                if (permission === 'granted') {
                    let notification = new Notification('Web Portal', {
                        icon: Icon,
                        body: body,
                    });
                    notification.onclick = function () {
                        window.open('http://202.63.220.170:3443');
                    };
                }else
                {
                    setPermisstion( false );
                }

            })

        } else {
            let notification = new Notification('Web Portal', {
                icon: Icon,
                body: body,
            });
            notification.onclick = function () {
                window.open('http://202.63.220.170:3443');
            };
        }
        

    }
    const OnSeenNotifications = () => {

        

        if ( Notificationss.length > 0 )
        {
            const Data = new FormData();
            Data.append('EmpID', localStorage.getItem('EmpID'));
            axios.post('/seennotifications', Data).then(() => {
                GetNotify();
            }).catch(err => {
                console.log(err);
            });
        }

        $('.Notifications_Box').fadeToggle('fast');
    }
    
    const RemoveNotification = (id) => {

        const Data = new FormData();
        Data.append('EmpID', localStorage.getItem('EmpID'));
        Data.append('NotificationID', id);
        axios.post('/removenotifications', Data).then(res => {

            // deleteStore('notifications');
            GetNotify();

        }).catch(err => {

            console.log(err);

        });

    }

    const RemoveAllNotifications = () => {

        $('#clearAllBtn').text("Clearing...");
        const Data = new FormData();
        Data.append('EmpID', localStorage.getItem('EmpID'));
        axios.post('/removeallnotifications', Data).then(res => {

            // deleteStore('notifications');
            GetNotify();
            $('#clearAllBtn').text("Clear All");
            $('.Notifications_Box').fadeOut('fast');

        }).catch(err => {
            $('#clearAllBtn').text("Clear All");
            console.log(err);

        });

    }

    const ViewallNotifications = () => { 
        $('.Notifications_Box').fadeOut('fast');
        history.replace('/profile/notifications/all');
    }

    const GotoLink = ( eventID ) => {
        
        if ( eventID === 1 )
        {
            history.replace('/chat');
        }

    }

    return ( 
        
        <>
            <div className="pl-3 pr-1 notification d-center">
                {
                    Notificationss.length > 0
                    ?
                    <div className="notification_number" onClick={OnSeenNotifications}></div>
                    :
                    null
                }
                <i className="las la-bell" onClick={OnSeenNotifications}></i>
                <div className="Notifications_Box">
                    <div className='Notifications_topbar'>
                        <div className={View === 'notifications' ? "active" : ""}>
                            <p className='mb-0 font-weight-bold' onClick={() => setView('notifications')}>Notifications</p>
                        </div>
                        {/* <div>
                            <p className='mb-0 font-weight-bold'>Alerts</p>
                        </div>
                        <div>
                            <p className='mb-0 font-weight-bold'>Notification</p>
                        </div> */}
                    </div>
                    {
                        View === 'notifications'
                        ?
                        <div className="Notifications_list">
                            {
                                Notificationss.length === 0
                                ?
                                <h6 className='text-center'>No Notification</h6>
                                :
                                Notificationss.map(
                                    (val, index) => {

                                        return (
                                            <div className="list" key={index}>
                                                <p className="font-weight-bold mb-0 first" onClick={() => GotoLink(val.event_id)}> {val.notification_title} </p>
                                                <p className="mb-0 py-1 text-secondary second" onClick={() => GotoLink(val.event_id)}>
                                                    "
                                                    {val.notification_body}
                                                    "
                                                </p>
                                                <div className="cross" onClick={() => RemoveNotification(val.notification_id)}><i className="las la-times"></i></div>
                                            </div>
                                        )
                                    }
                                )
                            }
                        </div>
                        :null
                    }
                    <div className='Notifications_footer'>
                        <div>
                            <p className='mb-0 font-weight-bold' onClick={ViewallNotifications}>View All</p>
                            {/* <Link to='/profile/notifications/all' className='mb-0 font-weight-bold' >View All</Link> */}
                        </div>
                        <div>
                            <p className='mb-0 font-weight-bold' id='clearAllBtn' onClick={RemoveAllNotifications}>Clear All</p>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
}

export default Notifications;