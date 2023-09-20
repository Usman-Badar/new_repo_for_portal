import React, { useEffect, useState } from 'react';

import './Users.css';

import axios from '../../../../axios';
import { useHistory } from 'react-router-dom';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Users = () => {

    const history = useHistory();
    let key = 'real secret keys should be long and random';
    const encryptor = require('simple-encryptor')(key);

    const [ Users, setUsers ] = useState([]);

    useEffect(
        () => {

            GetAllUsers();

        }, []
    );

    const GetAllUsers = () => {

        axios.get('/getallusers').then( response => {

            setUsers( response.data );

        } ).catch( error => {

            toast.dark(error, {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });

        } );

    }

    const OnSelect = ( id ) => {

        history.push('/userdetails/' + id)

    }

    const OnDelete = ( id ) => {

        const Data = new FormData();
        Data.append('departID', id);
        axios.post('/deletedepartmentname', Data).then( () => {

            GetAllUsers();
            
            toast.dark('User Deleted', {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });

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

    const CreateUser = () => {

        history.push('/createuser');

    }

    return (
        <>
            <ToastContainer />
            <div className="Admin_Users d-center">

                <div className="Admin_Users-content">
                    {/* <h3>Add New User</h3> */}

                    <form className="CreateUser text-center">
                        <button className="btn" onClick={ CreateUser }>Create User</button>
                    </form>

                    <h3>All Users</h3>
                    <div className="users">
                        {
                            Users.length === 0
                                ?
                                <h3 className="text-center mb-0">No User Found</h3>
                                :
                                Users.map(
                                    (val, index) => {
                                        return (
                                            <div className="d-flex align-items-center border-bottom mb-2" key={index}>
                                                <div className="index"> { index + 1 } </div>
                                                <div>
                                                    <span style={{ 'color': 'rgb(128, 128, 128, .5)' }}>User Name</span>
                                                    <h5> { encryptor.decrypt(val.user_name) } </h5>
                                                </div>
                                                <div className="ml-auto d-flex align-items-center operations">
                                                    <div className="px-3">
                                                        <button className="btn" onClick={ () => OnSelect( val.user_id ) } style={{ 'backgroundColor': '#1EC916' }}><i className="lar la-eye"></i> View Profile</button>
                                                    </div>
                                                    <div className="px-3">
                                                        <button className="btn" onClick={ () => OnDelete( val.user_id ) } style={{ 'backgroundColor': '#FEC400' }}><i className="las la-trash"></i> Remove</button>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    }
                                )
                        }
                    </div>

                </div>

            </div>
        </>
    )

}

export default Users;