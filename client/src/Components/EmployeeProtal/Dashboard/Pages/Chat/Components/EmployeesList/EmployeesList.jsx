/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import Typewriter from 'typewriter-effect';
import './EmployeesList.css';

const EmployeesList = React.memo(

    ( props ) => {

        const [ Employees, setEmployees ] = useState();

        useEffect(
            () => {

                setEmployees( props.Employees );

            }, [ props.Employees ]
        )

        return (
            <div className="List">
                {
                    !Employees
                    ?
                    <p className="text-center mt-3"> 
                        <Typewriter
                            options={{
                                strings: ["Please Wait...."],
                                autoStart: true,
                                loop: true,
                                delay: 50
                            }}
                        />
                    </p>
                    :
                    Employees.length === 0
                        ?
                        <p className="text-center mt-3"> 
                            <Typewriter
                                options={{
                                    strings: ["No Chat Found"],
                                    autoStart: true,
                                    loop: false,
                                    delay: 50
                                }}
                            />
                        </p>
                        :
                        props.SearchEmpKeywords
                        ?
                        Employees.filter(
                            obj => { return obj.name.toLowerCase().includes(props.SearchEmpKeywords.toLowerCase()) }
                        ).map(
                            (val, index) => {

                                return <Employee GetThatEmpChat={ props.GetThatEmpChat } index={ index } val={ val } />

                            }
                        )
                        :
                        Employees.map(
                            (val, index) => {

                                return <Employee GetThatEmpChat={ props.GetThatEmpChat } index={ index } val={ val } />

                            }
                        )
                }
            </div>
        );
    }

)

export default EmployeesList;

const Employee = ( { val, index, GetThatEmpChat } ) => {

    return (
        <>
            {
                val.emp_id === parseInt(localStorage.getItem('EmpID'))
                ?
                <></>
                :
                <div key={index} className="employee animate__animated animate__fadeInLeft" onClick={() => GetThatEmpChat(val.emp_id, index)}>
                    <div>
                        <img
                            src={'images/employees/' + val.emp_image}
                            alt="empImg"
                            width='40'
                            height='40'
                            className='rounded-circle'
                        />
                    </div>
                    <div className="ml-2">
                        <p className='font-weight-bold'> {val.name} </p>
                        <p> {val.designation_name + " in " + val.company_name} </p>
                        {/* <p>
                            { props.EmployeesLastChat[index] ? props.encryptor.decrypt(props.EmployeesLastChat[index].chat_body) : "No Chat" }
                        </p> */}
                    </div>
                </div>
            }
        </>
    )

}