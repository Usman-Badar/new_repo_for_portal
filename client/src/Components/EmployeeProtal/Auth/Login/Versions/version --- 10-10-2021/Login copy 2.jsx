import React, { useEffect, useState } from 'react';
import './Login.css';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import $ from 'jquery';
import IMG from '../../../../images/no-user.png';
import { useHistory, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import axios from '../../../../axios';

import Loading from '../../UI/Loading/Loading';

import { EmployeeLogin } from '../../../../Redux/Actions/Action';


const Employee_Login = () => {

    // To change URL
    const history = useHistory();
    let key = 'real secret keys should be long and random';
    const encryptor = require('simple-encryptor')(key);
    const dispatch = useDispatch();

    const [ UserData, setUserData ] = useState(
        {
            LoginID: '', LoginPass: '', Email: '', Name: ''
        }
    );

    const [ PrevLogins, setPrevLogins ] = useState( localStorage.getItem('prevData') ? JSON.parse(localStorage.getItem('prevData')) : [] );
    const [ RememberMe, setRememberMe ] = useState( true );
    
    // To show loading on true : false condition
    const [ StartLoading, setStartLoading ] = useState(true);
    
    useEffect(
        () => {
            $('.Login_Div2').hide(0);
            $('.Login_Div3').hide(0);

            setTimeout(() => {
                setStartLoading(false);
            }, 500);
        }, []

    )

    const Login_Div1= () => {

        $('.Login_Div1').hide();
        $('.Login_Div2').show();
        $('.Login_Div3').hide();

    }
    const Login_Div2= ( e ) => {

        e.preventDefault();
        setStartLoading(true);

        axios.get('/authemployee').then(response => {

            for (let x = 0; x < response.data.length; x++) {
                // if the password and login id ofthe current index of an array is matched with 
                // the entered login id and password, the following condition will be true

                if (UserData.LoginID === encryptor.decrypt(response.data[x].login_id)) {

                    $('.Login_Div1').hide();
                    $('.Login_Div2').hide();
                    $('.Login_Div3').show();
                    
                } else {
                    setStartLoading(false);
                    setUserData({ LoginID: UserData.LoginID, LoginPass: '' });
                }

            }

        }).catch(error => {

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

        });

    }

    const Login_Div3= () => {

        $('.Login_Div1').hide();
        $('.Login_Div2').hide();
        $('.Login_Div3').show();

    }
    const back= () => {

        $('.Login_Div1').hide();
        $('.Login_Div2').show();
        $('.Login_Div3').hide();

        $('.Login_Div1').show();
        $('.Login_Div2').hide();
        $('.Login_Div3').hide();

    }
    const backagain= () => {

        $('.Login_Div1').show();
        $('.Login_Div2').hide();
        $('.Login_Div3').hide();

    }

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

                                    if ( localStorage.getItem('prevData') ) {

                                        let names = [];

                                        for ( let x = 0; x < JSON.parse(localStorage.getItem('prevData')).length; x++ )
                                        {

                                            names.push(JSON.parse(localStorage.getItem('prevData'))[x].loginID);

                                        }

                                        if ( names.includes(encryptor.decrypt(response.data[x].login_id)) )
                                        {
                                            // 
                                        }else
                                        {
                                            let prevData = JSON.parse(localStorage.getItem('prevData'));
                                            let data = {
                                                img: response.data[x].emp_image,
                                                name: res.data[0].name,
                                                loginID: encryptor.decrypt(response.data[x].login_id),
                                                email: res.data[0].email,
                                                date: date.getDate() + ' ' + monthNames[date.getMonth()] + ' ' + date.getFullYear()
                                            }

                                            prevData.push(data);
                                            localStorage.setItem('prevData', JSON.stringify(prevData));
                                        }
                                        
                                    } else {
                                        let data = [
                                            {
                                                img: response.data[x].emp_image,
                                                name: res.data[0].name,
                                                loginID: encryptor.decrypt(response.data[x].login_id),
                                                email: res.data[0].email,
                                                date: date.getDate() + ' ' + monthNames[date.getMonth()] + ' ' + date.getFullYear()
                                            }
                                        ];

                                        localStorage.setItem('prevData', JSON.stringify(data));
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

    const ShowPass =() => {

        if ( $(".Login_Div3 input[type='checkbox']").prop('checked') )
        {
            $(".Login_Div3 input[name='LoginPass']").attr('type', 'text');
        }else
        {
            $(".Login_Div3 input[name='LoginPass']").attr('type', 'password');
        }

    }

    const PrevLoginSelect = ( usrName, mail, loginID ) => {

        axios.get('/authemployee').then( response => {
            
            for ( let x = 0; x < response.data.length; x++ )
            {
                // if the password and login id ofthe current index of an array is matched with 
                // the entered login id and password, the following condition will be true
                
                if ( loginID.toString() === encryptor.decrypt( response.data[x].login_id ) )
                {

                    setUserData(
                        {
                            LoginID: encryptor.decrypt( response.data[x].login_id ), LoginPass: '', Email: mail, Name: usrName
                        }
                    );

                    setRememberMe( true );
                    Login_Div3();

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

            <ToastContainer />
            <Loading display={StartLoading} />
            <div className="Employee_Login">
                <div className="Login_Div Login_Div1">
                    <div className="py-5 px-3">
                        <h1 className="text-center" onDoubleClick={ goToAttendance }>Seaboard Group</h1>
                        <p className="text-center font-weight-bold">Choose an <Link className="text-dark" to="/admin_login" target="_blank">Account</Link></p>
                        {
                            PrevLogins.map(
                                (val, index) => {

                                    return (
                                        <div className="PrevLogins" 
                                            // onClick={Login_Div2} 
                                            onClick={ () => PrevLoginSelect( val.name, val.email, val.loginID ) }>
                                            <img src={'images/employees/' + val.img } alt="Dp" />
                                            <div className="d-flex align-items-center">
                                                <div>
                                                    <p className="mb-0 font-weight-bolder">{val.name}</p>
                                                    <p className="mb-0">{val.date}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )

                                }
                            )
                        }
                        <div className="AnotherOptions" onClick={Login_Div1}>
                            <i className="las la-user-circle"></i>
                            <div className="d-flex align-items-center">
                                <p className="mb-0 font-weight-bolder">Use Another Account</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="Login_Div Login_Div2  p-3">
                    <i class="las la-arrow-left prev" onClick={backagain} ></i>
                    <div className="p-4">
                        <h1 className="text-center">Log In</h1>
                        <p className="text-center">to continue</p>
                        <form onSubmit={Login_Div2}>
                            <TextField value={ UserData.LoginID } onChange={ OnChangeHandler } name="LoginID" required id="standard-basic" label="Login Id" variant="standard" className="mb-3" />
                            <div className="w-100 text-right py-3">
                                <Button type="submit" variant="contained">Next</Button>
                            </div>
                        </form>
                    </div>
                </div>
                <div className="Login_Div Login_Div3 p-3">
                    <i class="las la-arrow-left"onClick={back} ></i>
                    <div className="p-4">
                        <h3 className="text-center">Hi { UserData.LoginID }</h3>
                        <p className="text-center">{ UserData.Email }</p>
                        <form onSubmit={  OnUserLogin }>
                            <TextField value={ UserData.LoginPass } onChange={ OnChangeHandler } name="LoginPass" required id="standard-password-input" label="Password" type="password" autoComplete="current-password" variant="standard" />
                            <div className="d-flex align-items-center py-3"><Checkbox name='showpassword' onChange={ ShowPass } className="showPass" /> <p className="mb-0">Show Password</p></div>
                            <div className="w-100 text-right py-3"><Button variant="contained" type="submit">Next</Button></div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}
export default Employee_Login;