import React, { useEffect, useState } from 'react'
import 'react-chatbox-component/dist/style.css';

import {ChatBox} from 'react-chatbox-component';

import './Employee_Chat.css';
import axios from '../../../../../axios';

import { useSelector } from 'react-redux';
import $ from 'jquery';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Menu from '../../../UI/Menu/Menu';

const Employee_Chat = () => {

    const [ Employees, setEmployees ] = useState([]);
    const [ Chat, setChat ] = useState([]);
    const [ ChatEmployee, setChatEmployee ] = useState();
    const [ EmpID, setEmpID ] = useState();
    const [ EmpIndex, setEmpIndex ] = useState();
    const [ Data, setData ] = useState([]);

    const [ EmpSearch, setEmpSearch ] = useState(
        {
            value: ''
        }
    );

    const [ ShowX, setShowX ] = useState(false);
    
    const searchcancle = ( e ) =>{
        setEmpSearch( { value: e.target.value } );
        if ( $('.Menusearch').val().length > 0 )
            {
                setShowX( true );
                OnSearch( e.target.value );
            }else
            {
                OnSearch( e.target.value );
                setShowX( false );
            }

    }
    const clickcross = () =>{
        setEmpSearch( { value: '' } );
        setShowX( false );
    }

    const CurrentEmployeeData = useSelector( ( state ) => state.EmpAuth.EmployeeData );

    useEffect(
        () => {
            
            GetAllEmployees('chat');
            setEmpID( parseInt( localStorage.getItem('EmpID') ) );

            setInterval(() => {
                $('.Grid2 .refresh').trigger('click');
            }, 1000);

            if (window.location.href.split('/').pop() === 'chat') {
                setData(
                    [
                        {
                            icon: 'las la-search',
                            txt: 'Search',
                            link: false,
                            func: () => ShowSearchBar()
                        },
                        {
                            icon: 'las la-users',
                            txt: 'Contacts',
                            link: false,
                            func: () => GetAllEmployees('contacts')
                        },
                        {
                            icon: 'lab la-rocketchat',
                            txt: 'Chat',
                            link: false,
                            func: () => GetAllEmployees('chat')
                        }
                    ]
                )
            }else {
                setData([]);
            }
        }, []
    );

    const GetAllEmployees = ( mode ) => {
        const Data = new FormData();
        if ( mode === 'chat' )
        {
            $('.Grid2').hide();
            Data.append('currentEmp', localStorage.getItem('EmpID'));

            axios.post('/getchatemployees', Data).then(res => {

                setEmployees(res.data);

            }).catch(err => {

                toast.dark(err, {
                    position: 'top-right',
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });;

            });
        }

        if ( mode === 'contacts' )
        {
            $('.Grid2').hide();
            Data.append('currentEmp', localStorage.getItem('EmpID'));

            axios.post('/getallemployees', Data).then(res => {

                setEmployees(res.data);

            }).catch(err => {

                toast.dark(err, {
                    position: 'top-right',
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });;

            });
        }

    };

    const ShowHideChat = () => {

        if (window.location.href.split('/').pop() === 'chat' && $('.Employee_Chat').width() < 1000) {
            setData([]);
        }

        if ($('.Employee_Chat').width() < 1000){
            if( $('.Grid1').css('display') === 'none' )
            {
                $('.Grid1').show();
                $('.Grid2').hide();
            }else
            {
                $('.Grid1').hide();
                $('.Grid2').show();
            }
            
        }else
        {
            $('.Grid2').show();
        }

    }

    const GetThatEmpChat = ( id, index ) => {

        const Data = new FormData();
        Data.append('sender', id);
        Data.append('receiver', localStorage.getItem('EmpID'));
        axios.post('/getemployeewithchat', Data).then(res => {

            setChatEmployee( Employees[index] );
            setEmpIndex( index );


            if ( res.data.length > Chat.length || res.data.length < Chat.length )
            {
                setChat(res.data);
            }
            if ( $('.chat-box .msg-footer .input-group').find('i') )
            {
                // null
            }else
            {
                $('.chat-box .msg-footer .input-group').append("<div><button><i></i></button></div>");
                $('.chat-box .msg-footer .input-group button').addClass('btn').attr('type', 'button') ;
                $('.chat-box .msg-footer .input-group button i').addClass('lab la-google-drive');
            }

        }).catch(err => {

            toast.dark(err, {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });

        });
        
    }

    const GoBack = () => {
        ShowHideChat();
        GetAllEmployees('chat');
        if (window.location.href.split('/').pop() === 'chat') {
            setData(
                [
                    {
                        icon: 'las la-search',
                        txt: 'Search',
                        link: false,
                        func: () => ShowSearchBar()
                    },
                    {
                        icon: 'las la-users',
                        txt: 'Contacts',
                        link: false,
                        func: () => GetAllEmployees('contacts')
                    },
                    {
                        icon: 'lab la-rocketchat',
                        txt: 'Chat',
                        link: false,
                        func: () => GetAllEmployees('chat')
                    }
                ]
            )
        }
    }

    const ShowSearchBar = () => {

        if ( !$('.Employee_Chat .Grid1 .searchbarDiv').hasClass('searchbarDivShow') )
        {
            $('.Employee_Chat .Grid1 .searchbarDiv').addClass('searchbarDivShow');
        }else
        {
            $('.Employee_Chat .Grid1 .searchbarDiv').removeClass('searchbarDivShow');
        }

    }

    const OnChat = ( e ) => {

        if ( e.keyCode === 13 )
        {
            const Data = new FormData();
            Data.append('senderID', localStorage.getItem('EmpID'));
            Data.append('receiverID', ChatEmployee.emp_id);
            Data.append('CHatBody', e.target.value);
            Data.append('EmployeeName', CurrentEmployeeData.name);
            axios.post('/insertchat', Data).then(() => {

                GetThatEmpChat(ChatEmployee.emp_id, EmpIndex);
                $('.Emp_Chat_2 .chatinput').val('');

            }).catch(err => {
                toast.dark(err, {
                    position: 'top-right',
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            });
        }

    }

    const OnSearch = ( val ) => {

        const Data = new FormData();
        Data.append('SearchKey', val);
        Data.append('currentEmp', localStorage.getItem('EmpID'));
        axios.post('/srchemp', Data).then( res => {

            setEmployees( res.data );

        } ).catch( err => {

            toast.dark( err , {
                    position: 'top-right',
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });;

        } );

    }

    return (
        <>
            <Menu data={ Data } />
            <div className="Employee_Chat">
                <div className="Grid1">
                    <div className="DIV1 searchbarDiv">
                        <input type="text" value={EmpSearch.value} placeholder="Search Keywords" className="form-control Menusearch" onChange={searchcancle} />
                        {
                            !ShowX
                                ?
                                <i className="las la-search"></i>
                                :
                                <i className="las la-times" onClick={clickcross}></i>
                        }
                    </div>
                    <div className="list">
                        {

                            Employees.map(
                                (val, index) => {

                                    return (
                                        <>
                                            {
                                                val.emp_id === parseInt( localStorage.getItem('EmpID') )
                                                ?
                                                    null
                                                :
                                                    <div onClick={ ShowHideChat }>
                                                        <div className="DIV1 d-flex emplist" onClick={() => GetThatEmpChat(val.emp_id, index)}>
                                                            <div>
                                                                <img src={process.env.REACT_APP_SERVER+'/images/employees/' + val.emp_image} alt="DP" className="empImgs" />
                                                            </div>
                                                            <div className="d-flex align-items-center">
                                                                <div>
                                                                    <p className="font-weight-bold">{val.name}</p>
                                                                    <p> {val.designation_name + " at " + val.location_name + ", " + val.company_name} </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                            }
                                        </>
                                    )

                                }
                            )

                        }
                    </div>
                </div>
                <div className="Grid2">
                    {
                        ChatEmployee !== undefined
                        ?
                            <>
                                <div className="Emp_Chat_2">
                                    <div className="Emp_Chat_Div">
                                        <div className="d-flex Emp_Chat_Header px-3 py-2">
                                            <div className="mr-3"><img src={ process.env.REACT_APP_SERVER+'/images/employees/' + ChatEmployee.emp_image } onClick={ GoBack } alt="employee Img" /></div>
                                            <div>
                                                <div className="d-block" style={ { fontSize: '12px' } }>
                                                    <p className="font-weight-bolder mb-0"> { ChatEmployee.name } </p>
                                                    <p> { ChatEmployee.designation_name } at { ChatEmployee.location_name }, { ChatEmployee.company_name } </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="Chat_Box_Div">
                                            {
                                                Chat.map(
                                                    ( val, index ) => {

                                                        return (
                                                            <>
                                                                {
                                                                    val.sender_id !== EmpID
                                                                    ?
                                                                        <div className="Chat_Box_Container_left"><img src={ process.env.REACT_APP_SERVER+'/images/employees/' + ChatEmployee.emp_image } alt="dp" className="mr-1" />
                                                                            <div className="Chat_Box_Message">
                                                                                <p> { val.chat_body } </p>
                                                                                <div className="d-flex justify-content-end" style={{ fontSize: '12px' }}>
                                                                                    <p>{ val.send_time }</p><i className="las la-check ml-1"></i></div>
                                                                            </div>
                                                                        </div>
                                                                    :
                                                                        <div className="Chat_Box_Container_right">
                                                                            <div className="Chat_Box_Message">
                                                                                <p> { val.chat_body } </p>
                                                                                <div className="d-flex justify-content-end" style={{ fontSize: '12px' }}>
                                                                                    <p>{ val.send_time }</p><i className="las la-check ml-1"></i></div>
                                                                            </div><img src={ process.env.REACT_APP_SERVER+'/images/employees/' + CurrentEmployeeData.emp_image } alt="dp" className="ml-1" /></div>
                                                                }
                                                            </>
                                                        )

                                                    }
                                                )
                                            }
                                        </div>
                                        <div className="d-flex py-2 px-2">
                                            <div className="MuiFormControl-root MuiTextField-root css-i44wyl" style={{ width: '100%' }}>
                                                <input
                                                    className="form-control chatinput"
                                                    name="arrivalTime"
                                                    onKeyDown={OnChat}
                                                    type="text"
                                                    variant="standard"
                                                    style={{ width: "100%" }}
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                    required
                                                />
                                            </div>
                                            <button className="btn text-white refresh d-none" onClick={() => GetThatEmpChat(ChatEmployee.emp_id, EmpIndex)}><i className="las la-redo-alt"></i></button>
                                            <div className="d-flex justify-content-center align-items-center">
                                                <i className="lab la-google-drive" style={{ fontSize: '25px' }}></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        :
                        null
                    }
                </div>
            </div>
        </>
    )
}
 export default Employee_Chat;