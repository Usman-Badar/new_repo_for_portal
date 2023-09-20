import React, { useEffect, useState } from "react";
import Menu from "../../../../../../UI/Menu/Menu";
import './Employement_Request.css';

import axios from "../../../../../../../axios";
import { Link } from "react-router-dom";

const Employement_Request = () => {

    const [Data, setData] = useState([{}]);

    useEffect(
        () => {

            setData(
                [
                    {
                        icon: 'las la-cloud-upload-alt',
                        txt: 'Create Employee',
                        link: true,
                        href: '/employment_setup/form',
                    },
                    {
                        icon: 'las la-cloud-upload-alt',
                        txt: 'View Employee',
                        link: true,
                        href: '/employment_setup/employees'
                    },
                    {
                        icon: 'las la-cloud-upload-alt',
                        txt: 'Employement Request',
                        link: true,
                        href: '/employment_setup/requests'
                    }
                ]

            );

        }, []
    )

    const [ Employee, setEmployee ] = useState([]);

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

            console.log( err )

        } );

    }

    return (

        <>

            <Menu data={Data} />

            <div className="Employement_Request d-center">
                <div className="Employement_Request-content">

                    <h3>Employment Requests</h3>

                    <hr />

                    {
                        Employee.length === 0
                            ?
                            <h3 className="text-center">No Request Found</h3>
                            :
                            Employee.map(
                                (val, index) => {

                                    return (
                                        <div className="Requests" key={index}>
                                            <div className='index'>
                                                {index + 1}
                                            </div>
                                            <div className='colums'>
                                                <span>Employee Name</span>
                                                <p className="mb-0"> {val.name} </p>
                                            </div>
                                            <div className='colums'>
                                                <span>Created By</span>
                                                <p className="mb-0"> { val.user_name === null ? "No User Found" : encryptor.decrypt(val.user_name) } </p>
                                            </div>
                                            <div className='colums'>
                                                <span>Created Date</span>
                                                <p className="mb-0"> {val.created_at.substring(0, 10)} </p>
                                            </div>
                                            <div className='colums'>
                                                <Link to={ "/employment_setup/requests/" + val.emp_id } className="btn btn-primary"> View </Link>
                                            </div>
                                        </div>
                                    )
                                }
                            )
                    }

                </div>
            </div>

        </>

    )

}

export default Employement_Request;