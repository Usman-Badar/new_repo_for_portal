import React, { useEffect, useState } from 'react';

import './Login.css';
import $ from 'jquery';

import { useHistory } from 'react-router-dom';

import JSAlert from 'js-alert'

import axios from '../../../../axios';

import Loading from '../../../UI/Loading/Loading';

import FrmLogin from './frmLogin';

import socket from '../../../../io';
import LoadingIcon from '../../../../images/loadingIcons/icons8-loading-circle.gif';

const Employee_Login = () => {

    const [ UserData, setUserData ] = useState(
        {
            LoginID: '', LoginPass: '', Email: '', Name: ''
        }
    );

    const [ Employee, setEmployee ] = useState({});
    const [ Text, setText ] = useState("Loading....");
    
    // To show loading on true : false condition
    const [ StartLoading, setStartLoading ] = useState(true);

    // To change URL
    const history = useHistory();

    let key = 'real secret keys should be long and random';
    const encryptor = require('simple-encryptor')(key);
    
    useEffect(
        () => {

            setStartLoading( false );

        }, []

    )

    const LoginShow = () =>{

        $('.LoginDiv').fadeIn();
        $('.PassDiv').fadeOut(0);
        $('.ButtonDiv2').hide();
        $('.ButtonDiv1').show();
        $('.Emp_Login2_Grid .HideDiv').css('left', '0');
        $('.Emp_Login2_Grid .HideDiv').html('LOGIN ID');

    }

    const Login_Div2 = ( e ) => {

        e.preventDefault();
        setText("Processing");
        setStartLoading( true );


        // IF USER WANT TO TO GO TO ATTENDANCE PAGE
        if ( UserData.LoginID === '1234567890' )
        {
            history.push('/atthome');
        }

        axios.get('/authemployee').then(response => {

            let failed = true;

            for (let x = 0; x < response.data.length; x++) {

                // if the password and login id of the current index of an array is matched with 
                // the entered login id and password, the following condition will be true

                if ( UserData.LoginID === encryptor.decrypt( response.data[x].login_id ) ) {

                    $('.LoginDiv').fadeOut(0);
                    $('.PassDiv').fadeIn();
                    $('.ButtonDiv2').show();
                    $('.ButtonDiv1').hide();
                    $('.Emp_Login2_Grid .HideDiv').css('left', '50%');
                    $('.Emp_Login2_Grid .HideDiv').html('PASSWORD');

                    setEmployee(response.data[x]);
                    setStartLoading(false);
                    failed = false;
                    
                } else {

                    setStartLoading(false);
                    
                    setUserData({ LoginID: UserData.LoginID, LoginPass: '' });

                }

            }

            if ( failed )
            {
                JSAlert.alert("No Employee Found").dismissIn(1000 * 2);
            }

        }).catch(error => {

            setStartLoading(false);
            JSAlert.alert(error).dismissIn(1000 * 2);

        });

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
        setText("Logging");
        setStartLoading(true);

        if ( UserData.LoginPass === encryptor.decrypt( Employee.emp_password ) )
        {
            
            const d = new FormData();
            d.append('empID', Employee.emp_id);
            axios.post('/getemployee', d).then( res => {

                let employee = res.data;

                socket.emit(
                    'UserCanLogin', Employee.emp_id
                );
            
                    // CHECK IF USER IS ALREADY LOGIN IN ANOTHER WINDOW
                socket.on(
                    'UserCanLogin', ( result ) => {

                        LoginSuccess( result, Employee, employee );

                    }
                );

            } ).catch( err => {

                JSAlert.alert(err).dismissIn(1000 * 2);

            } );

        }else {

            setStartLoading(false);

            setUserData( { LoginID: UserData.LoginID, LoginPass: '' } );
            JSAlert.alert('Password Not Matched').dismissIn(1000 * 2);
            
        }

    }

    const LoginSuccess = ( result, emp, employee ) => {

        setStartLoading(false);
        
        if ( result.err === null && result.rslt[0].app_status === '' )
        {
            JSAlert.alert('Welcome To Web Portal').dismissIn(1000 * 2);

            localStorage.setItem('Token', encryptor.encrypt(emp.emp_id));
            localStorage.setItem('EmpID', emp.emp_id);
            localStorage.setItem('name', employee[0][0].name);

            socket.emit(
                'NewUser', emp.emp_id
            );

            // BECAUSE IT GIVES ERRORS
            // dispatch( EmployeeLogin( employee[0] ) );
            
            setUserData( { LoginID: '', LoginPass: '' } );
    
            setTimeout(() => {
                history.replace('/login');
            }, 1000);
        }else
        {
            JSAlert.alert('You are already login in another window, or your previous session is still on. Contact IT Support.').dismissIn(1000 * 2);
        }

    }

    if ( localStorage.getItem('Token') ) {
        
        if 
        ( 
            parseInt( encryptor.decrypt( localStorage.getItem("Token") ) )
            ===
            parseInt( localStorage.getItem('EmpID') )
        )
        {
            history.replace('/dashboard');
        }
        
    };

    return (
        <>
            <Loading 
                display={ StartLoading }
                styling={
                    {
                        zIndex: 100000
                    }
                }
                icon={ 
                    <img 
                        src={ LoadingIcon }
                        className="LoadingImg"
                        alt="LoadingIcon"
                    /> 
                }
                txt={ Text }
            />
            <FrmLogin Employee={ Employee } Login_Div2={ Login_Div2 } LoginShow={ LoginShow } OnChangeHandler={ OnChangeHandler } UserData={ UserData } OnUserLogin={ OnUserLogin } />
        </>
    )
}
export default Employee_Login;