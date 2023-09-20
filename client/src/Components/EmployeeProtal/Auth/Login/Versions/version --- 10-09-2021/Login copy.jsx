import React, { useEffect, useState } from 'react';

import './Login.css';
import axios from '../../../../axios';

import { Link, useHistory } from 'react-router-dom';
import Loading from '../../UI/Loading/Loading';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useDispatch } from 'react-redux';
import { EmployeeLogin } from '../../../../Redux/Actions/Action';

import $ from 'jquery';

const Login = () => {

    // To change URL
    const history = useHistory();
    let key = 'real secret keys should be long and random';
    const encryptor = require('simple-encryptor')(key);
    const dispatch = useDispatch();

    const [ UserData, setUserData ] = useState(
        {
            LoginID: '', LoginPass: ''
        }
    );
    const [ PrevLogins, setPrevLogins ] = useState( sessionStorage.getItem('prevData') ? JSON.parse(sessionStorage.getItem('prevData')) : [] );
    const [ RememberMe, setRememberMe ] = useState( false );
    
    // To show loading on true : false condition
    const [ StartLoading, setStartLoading ] = useState(true);

    useEffect( () => {

        setTimeout(() => {
            setStartLoading(false);
        }, 500);

    }, [] )

    // Call on change function to store input field data into usestate()
    const OnChangeHandler = ( e ) => {

        const { name, value } = e.target;
        const setValues = {
            ...UserData,
            [name]: value
        }

        setUserData(setValues);

    }

    // On form submition, the following function call
    const OnUserLogin = ( e ) => {

        e.preventDefault();
        setStartLoading(true);

            axios.get('/authemployee').then( response => {

                for ( let x = 0; x < response.data.length; x++ )
                {
                    // if the password and login id ofthe current index of an array is matched with 
                    // the entered login id and password, the following condition will be true
                    
                    if ( UserData.LoginID === encryptor.decrypt( response.data[x].login_id ) )
                    {

                        if ( UserData.LoginPass === encryptor.decrypt( response.data[x].emp_password ) )
                        {

                            const d = new FormData();
                            const date = new Date();
                            d.append('empID', response.data[x].emp_id);
                            axios.post('/getemployee', d).then( res => {

                                toast.dark('Login Success', {
                                    position: 'bottom-center',
                                    autoClose: 3000,
                                    hideProgressBar: false,
                                    closeOnClick: true,
                                    pauseOnHover: true,
                                    draggable: true,
                                    progress: undefined,
                                });
    
                                setStartLoading(false);

                                sessionStorage.setItem('EmpID', response.data[x].emp_id);

                                if ( RememberMe )
                                {

                                    let monthNames = ["January", "February", "March", "April", "May", "June",
                                        "July", "August", "September", "October", "November", "December"
                                    ];

                                    if ( sessionStorage.getItem('prevData') ) {

                                        let names = [];

                                        for ( let x = 0; x < JSON.parse(sessionStorage.getItem('prevData')).length; x++ )
                                        {

                                            names.push(JSON.parse(sessionStorage.getItem('prevData'))[x].name);

                                        }

                                        if ( names.includes(encryptor.decrypt(response.data[x].login_id)) )
                                        {
                                            // 
                                        }else
                                        {
                                            let prevData = JSON.parse(sessionStorage.getItem('prevData'));
                                            let data = {
                                                img: response.data[x].emp_image,
                                                name: encryptor.decrypt(response.data[x].login_id),
                                                date: date.getDate() + ' ' + monthNames[date.getMonth()] + ' ' + date.getFullYear()
                                            }

                                            prevData.push(data);
                                            sessionStorage.setItem('prevData', JSON.stringify(prevData));
                                        }
                                        
                                    } else {
                                        let data = [
                                            {
                                                img: response.data[x].emp_image,
                                                name: encryptor.decrypt(response.data[x].login_id),
                                                date: date.getDate() + ' ' + monthNames[date.getMonth()] + ' ' + date.getFullYear()
                                            }
                                        ];

                                        sessionStorage.setItem('prevData', JSON.stringify(data));
                                    }

                                }

                                dispatch( EmployeeLogin( res.data[0] ) );

                                setUserData( { LoginID: '', LoginPass: '' } );
    
                                setTimeout(() => {
                                    history.replace('/login');
                                }, 1000);

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

                            break;
                        }else {

                            setStartLoading(false);

                            setUserData( { LoginID: UserData.LoginID, LoginPass: '' } );
                            toast.dark('Password Not Match', {
                                position: 'bottom-center',
                                autoClose: 3000,
                                hideProgressBar: false,
                                closeOnClick: true,
                                pauseOnHover: true,
                                draggable: true,
                                progress: undefined,
                            });
                            break;
                            
                        }
                        
                    }else
                    {
                        setStartLoading(false);
                        setUserData( { LoginID: UserData.LoginID, LoginPass: '' } );
                    }

                }

            } ).catch( error => {

                setStartLoading(false);
                toast.dark(error, {
                    position: 'bottom-center',
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });

            } );

    }

    if (localStorage.getItem('EmpID')) {
        history.replace('/dashboard');
    };

    const goToAttendance =() => {

        history.replace("/atthome")

    }

    const RememberMeFunc =() => {

        if ( $(".Emp_LoginPage_Header input[type='checkbox']").prop('checked') )
        {
            setRememberMe( true );
        }else
        {
            setRememberMe( false );
        }

    }

    const PrevLoginSelect = ( usrName ) => {

        axios.get('/authemployee').then( response => {

            for ( let x = 0; x < response.data.length; x++ )
            {
                // if the password and login id ofthe current index of an array is matched with 
                // the entered login id and password, the following condition will be true
                
                if ( usrName === encryptor.decrypt( response.data[x].login_id ) )
                {

                    setUserData(
                        {
                            LoginID: encryptor.decrypt( response.data[x].login_id ), LoginPass: ''
                        }
                    );

                    setRememberMe( true );
                    
                }

            }

        } ).catch( error => {

            setStartLoading(false);
            toast.dark(error, {
                position: 'bottom-center',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });

        } );

    }

    return (
        <>
            {/* Login Form Component Start From Here */}
            <ToastContainer />
            <Loading display={StartLoading} />
            <div className="Emp_LoginPage_Header">
                <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="svg1">
                    <path fill="#0DB8DE" fill-opacity="1" d="M37.1,-9.7C45.2,13,47.1,40.2,33.9,50.7C20.7,61.3,-7.5,55.3,-28.8,39.8C-50,24.3,-64.2,-0.6,-58.3,-20.3C-52.3,-40,-26.1,-54.6,-5.8,-52.7C14.5,-50.8,28.9,-32.4,37.1,-9.7Z" transform="translate(100 100)" />
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="svg2">
                    <path fill="#0DB8DE" fill-opacity="1" d="M0,288L16,256C32,224,64,160,96,144C128,128,160,160,192,197.3C224,235,256,277,288,277.3C320,277,352,235,384,229.3C416,224,448,256,480,261.3C512,267,544,245,576,234.7C608,224,640,224,672,192C704,160,736,96,768,96C800,96,832,160,864,208C896,256,928,288,960,266.7C992,245,1024,171,1056,154.7C1088,139,1120,181,1152,192C1184,203,1216,181,1248,160C1280,139,1312,117,1344,117.3C1376,117,1408,139,1424,149.3L1440,160L1440,320L1424,320C1408,320,1376,320,1344,320C1312,320,1280,320,1248,320C1216,320,1184,320,1152,320C1120,320,1088,320,1056,320C1024,320,992,320,960,320C928,320,896,320,864,320C832,320,800,320,768,320C736,320,704,320,672,320C640,320,608,320,576,320C544,320,512,320,480,320C448,320,416,320,384,320C352,320,320,320,288,320C256,320,224,320,192,320C160,320,128,320,96,320C64,320,32,320,16,320L0,320Z"></path>
                </svg>
                <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="svg3">
                    <path fill="#0DB8DE" fill-opacity="1" d="M43,-43.2C59.2,-26.9,78.2,-13.4,80.8,2.6C83.4,18.7,69.7,37.4,53.6,54C37.4,70.6,18.7,85.2,1.5,83.8C-15.7,82.3,-31.5,64.8,-42.1,48.1C-52.8,31.5,-58.4,15.7,-60.1,-1.7C-61.8,-19.2,-59.6,-38.3,-49,-54.7C-38.3,-71.1,-19.2,-84.7,-2.9,-81.8C13.4,-78.9,26.9,-59.6,43,-43.2Z" transform="translate(100 100)" />
                </svg>
                <div className="Emp_LoginPage_Box">
                    <div style={{ overflow: 'hidden' }}>
                        <div className="LoginPage_Image"></div>
                    </div>
                    <div className="LoginPage_Details">
                        <div className="LoginPage_Info">
                            <div>
                                <p className="mb-0" onDoubleClick={ goToAttendance }>Welcome To</p>
                                <h1 className="mb-5">SeaBoard Group</h1>

                                <div className="previousLoginsDivs">
                                    {
                                        PrevLogins.map(
                                            (val, index) => {

                                                return (
                                                    <div className="previousLogins" onClick={ () => PrevLoginSelect( val.name ) }>
                                                        <div>
                                                            <img src={'images/employees/' + val.img } alt="imgs" />
                                                        </div>
                                                        <div>
                                                            <span>
                                                                <p>
                                                                    {val.name}
                                                                </p>
                                                                <small>
                                                                    {val.date}
                                                                </small>
                                                            </span>
                                                        </div>
                                                    </div>
                                                )

                                            }
                                        )
                                    }
                                </div>
                            </div>
                            <div className="LoginPage_Form">
                                <h1 className="mb-4">Login</h1>
                                <form onSubmit={  OnUserLogin }>
                                    <input value={ UserData.LoginID } onChange={ OnChangeHandler } placeholder="Login ID" name="LoginID" type="text" className="form-control" required minLength="3" />
                                    <input value={ UserData.LoginPass } onChange={ OnChangeHandler } placeholder="Login Password" name="LoginPass" type="password" className="form-control" minLength="3" required />
                                    <div className="LoginPage_Form_checkbox d-flex align-items-center mb-4">
                                        <input type="checkbox" checked={ RememberMe ? true : false } className="text-left mr-2" name='rememberMe' onChange={ RememberMeFunc } />
                                        <p className="mb-0">Remember Me?</p>
                                    </div>
                                    <div>
                                        <button type="submit" className="btn">Login</button>
                                        <p className="text-center">Do You Logined In Before? Select Your <Link className="text-white" to="/admin_login" target="_blank">Account.</Link></p>
                                    </div>
                                    <div className="LoginPage_Icons d-flex justify-content-center">
                                        <div> <i class="lab la-facebook-f"></i> </div>
                                        <div> <i class="lab la-linkedin-in"></i> </div>
                                        <div> <i class="lab la-twitter"></i> </div>
                                        <div> <i class="lab la-google"></i> </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Login Form Component End Here */}
        </>
    )

}

export default Login;