import React, { useEffect, useState } from 'react';
import './Admin_login.css';

import Logo from '../../../images/logo192.png';

import { useHistory } from 'react-router-dom';
import axios from '../../../axios';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminLogin = () => {
    const history = useHistory();
    let key = 'real secret keys should be long and random';
    const encryptor = require('simple-encryptor')(key);

    const [ Form, setForm ] = useState(
        {
            userName: '', userPass: ''
        }
    );

    useEffect(
        () => {

            if ( sessionStorage.getItem('UserID') )
            {
                history.replace('/admin_module');
            }

        }, []
    );

    return (
        <>
            <ToastContainer />
            <div className='adminLoginContainer'>

                <form className='adminLoginContainerContent' onSubmit={ ( e ) => OnUserLogin( e, encryptor, Form, history, setForm ) }>

                    <img src={ Logo } alt="Logo" className='logo' />
                    <h4>
                        Admin Login
                    </h4>

                    <br />

                    <label> Login ID </label>        
                    <input 
                        type="text" 
                        className='form-control form-control-sm' 
                        name="userName" 
                        value={ Form.userName } 
                        onChange={ ( e ) => OnChangeHandler( e, Form, setForm ) } 
                        minLength="3" 
                        required 
                    />
                    <label> Password </label>                        
                    <input 
                        type="password" 
                        className='form-control form-control-sm' 
                        name="userPass" 
                        value={ Form.userPass } 
                        onChange={ ( e ) => OnChangeHandler( e, Form, setForm ) } 
                        minLength="3" 
                        required 
                    />
                    
                    <button className='submit' type='submit'>Login</button>

                </form>

            </div>
        </>
    )

}

export default AdminLogin;

// Call on change function to store input field data into usestate()
const OnChangeHandler = ( e, Form, setForm ) => {

    const { name, value } = e.target;
    const setValues = {
        ...Form,
        [name]: value
    }

    setForm(setValues);

}

// On form submition, the following function call
const OnUserLogin = ( e, encryptor, Form, history, setForm ) => {

    e.preventDefault();

    axios.get('/getallusers').then( response => {

        for ( let x = 0; x < response.data.length; x++ )
        {
            // if the password and login id ofthe current index of an array is matched with 
            // the entered login id and password, the following condition will be true
            if ( Form.userName === encryptor.decrypt( response.data[x].user_name ) )
            {
                const verifyPass = encryptor.decrypt( response.data[x].user_password );

                if ( verifyPass === Form.userPass )
                {

                    Alert( 'Login Success' );

                    sessionStorage.setItem('UserID', response.data[x].user_id);
                    sessionStorage.setItem('userName', encryptor.decrypt( response.data[x].user_name ));
                    sessionStorage.setItem('UserImg', response.data[x].user_image);

                    setForm( { userName: '', userPass: '' } );

                    setTimeout(() => {
                        history.replace('/admin_module');
                    }, 1500);

                    break;
                }else {

                    setForm( { userName: Form.userName, userPass: '' } );
                    Alert( 'Password Not Match' );
                    break;
                    
                }
                
            }else
            {
                
                setForm( { userName: Form.userName, userPass: '' } );

            }

        }

    } ).catch( error => {

        Alert( error );

    } );

}

const Alert = ( msg ) => {

    toast.dark(msg, {
        position: 'bottom-center',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    });

}