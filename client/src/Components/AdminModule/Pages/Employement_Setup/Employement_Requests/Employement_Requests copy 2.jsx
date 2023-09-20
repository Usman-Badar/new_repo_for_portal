import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import './Employement_Requests.css';
import axios from '../../../../../axios';


import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FetchedList from '../../../../../utils/list/List';

const Employement_Requests = () => {

    const [ Employee, setEmployee ] = useState([]);
    const [ Search, setSearch ] = useState(
        {
            SrchKey: '', SrchBy: 'name'
        }
    );

    let key = 'real secret keys should be long and random';
    const encryptor = require('simple-encryptor')(key);

    useEffect(
        () => {

            getAllTempEmp();

            setInterval(() => {
                getAllTempEmp();
            }, 1000);

        }, []
    );

    const getAllTempEmp = () => {

        axios.get('/getalltempemployee').then( response => {

            setEmployee( response.data );

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

    // Call on change function to store input field data into usestate()
    const OnChangeHandler = ( e ) => {

        const { name, value } = e.target;
        const setValues = {
            ...Search,
            [name]: value
        }

        setSearch(setValues);

    }

    const OnSearchEmployee = ( e ) => {

        e.preventDefault();

        const Data = new FormData();
        Data.append('SearchKey', Search.SrchKey);
        Data.append('SearchBy', Search.SrchBy);

        axios.post('/srchtempemp', Data).then( response => {

            setEmployee( response.data );

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

        } )

    }

    return (
        <>
            <div className="Employement_Requests d-center">
                <div className="Employement_Requests-content">

                    <h3>Employment Requests</h3>
                    <form className="search-content" onSubmit={ OnSearchEmployee }>
                        <div className="d-flex align-items-center w-75">
                            <input type="text" className="form-control mr-1" placeholder="Search Keywords" name="SrchKey" onChange={ OnChangeHandler } required />
                            <select className="form-control ml-1" onChange={ OnChangeHandler } name="SrchBy">
                                <option value="name">Search By</option>
                                <option value="name">Employee Name</option>
                                <option value="user_name">User</option>
                            </select>
                            <button className="btn searchBtn btn-dark px-4 mx-3">Search</button>
                        </div>
                        <div className="w-50 text-center d-flex">
                            <Link className="btn btn-primary mx-1" to='/admin_view_employees' >View Employees</Link>
                            <Link className="btn btn-info mx-1" to={ sessionStorage.getItem('userName') === 'UsmanBadar' ? "/admin_employement_requests/admin_employement_setup" : '/admin_employement_requests/admin_employement_setup' }>Create Employee</Link>
                        </div>
                    </form>

                    {
                        sessionStorage.getItem('userName') === 'UsmanBadar'
                        ?
                        <h3 className="text-uppercase" style={ { 'color' : 'rgb(128, 128, 128, .5)' } }>Requests</h3>
                        :
                        null
                    }

                    {
                        sessionStorage.getItem('userName') === 'UsmanBadar'
                        ?
                        Employee.length === 0
                        ?
                        <h3 className="text-center">No Request Found</h3>
                        :
                        <>
                            <FetchedList 
                                small={true}
                                headColumns={
                                    [{text: "Name"}, {text: "Created By"}, {text: "Created Date"}]
                                }
                            />
                        </>
                        :
                        null
                    }

                </div>
            </div>
        </>
    )

}

export default Employement_Requests;