import React, { lazy, Suspense, useEffect, useState } from 'react';
import axios from '../../../../../axios';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import $ from 'jquery';
// REACT REDUX
import { useSelector } from 'react-redux';

const UI = lazy(() => import('./UI'));

const AttendanceRequests = () => {

    const Employee = useSelector( ( state ) => state.EmpAuth.EmployeeData );

    const [ Companies, setCompanies ] = useState( [] );
    const [ Employees, setEmployees ] = useState( [] );
    const [ Name, setName ] = useState();
    const [ DateTime, setDateTime ] = useState('');
    const [ Company, setCompany ] = useState('');

    useEffect(
        () => {

            axios.post(
                '/getemployeecompaniesauth',
                {
                    emp_id: Employee.emp_id
                }
            ).then(
                res => {

                    setCompanies( res.data );
                    if ( res.data.length === 1 )
                    {
                        setCompany( res.data[0].company_code );
                    }

                }
            ).catch(
                err => {

                    console.log( err );

                }
            )

        // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []
    )

    const onChangeDate = ( e ) => {

        const { value } = e.target;
        GetList( value, Company );

    }

    const GetList = ( date, company ) => {

        axios.post(
            '/getthatdateemployeeslist',
            {
                date_time: date,
                company: company
            }
        ).then(
            res => {

                setEmployees( res.data );
                setDateTime( date );

            }
        ).catch(
            err => {

                console.log( err );

            }
        )

    }

    const onChangeName = ( e ) => {

        setName( e.target.value );

    }

    const updateRecord = ( id ) => {

        let time_in = document.querySelector('input[name=time_in' + id + ']').value;
        let break_in = document.querySelector('input[name=break_in' + id + ']').value;
        let break_out = document.querySelector('input[name=break_out' + id + ']').value;
        let time_out = document.querySelector('input[name=time_out' + id + ']').value;
        let status = document.querySelector('select[name=status' + id + ']').value;
        let timing = document.querySelector('input[name=timing' + id + ']').value;

        // CHECKBOXES
        let time_in_check = document.querySelector('input[id=checkboxnumber_time_in_' + id + ']').checked;
        let break_in_check = document.querySelector('input[id=checkboxnumber_break_in_' + id + ']').checked;
        let break_out_check = document.querySelector('input[id=checkboxnumber_break_out_' + id + ']').checked;
        let time_out_check = document.querySelector('input[id=checkboxnumber_time_out_' + id + ']').checked;

        console.log( time_in_check );
        console.log( break_in_check );
        console.log( break_out_check );
        console.log( time_out_check );

        if ( time_in_check )
        {
            time_in = null;                                
        }

        if ( break_in_check )
        {
            break_in = null;                                    
        }

        if ( break_out_check )
        {
            break_out = null;                                    
        }

        if ( time_out_check )
        {
            time_out = null;                                    
        }

        if ( status === 'Absent' || status === 'Holiday' || status === 'OFF' )
        {
            time_in = null;
            break_in = null;
            break_out = null;
            time_out = null;
        }
        // if ( status === 'Present' && ( time_in === '' || time_in === null ) )
        // {
        //     ShowNotification(
        //         "Please enter time in",
        //         'top-center'
        //     )
        //     return false;
        // }
        if ( time_in !== '' || time_in !== null )
        {
            if ( time_in > timing.split(' ').shift() )
            {
                status = 'Late';
            }
        }

        axios.post(
            '/updateemployeeattendance',
            {
                emp_id: Employees[id].emp_id,
                employee_name: Employees[id].name,
                previous_time_in: Employees[id].time_in,
                previous_break_in: Employees[id].break_in,
                previous_break_out: Employees[id].break_out,
                previous_time_out: Employees[id].time_out,
                time_in: time_in,
                break_in: break_in,
                break_out: break_out,
                time_out: time_out,
                status: status,
                date_time: DateTime,
                editor: Employee.emp_id,
                editor_name: Employee.name,
                edit_date: new Date()
            }
        ).then(
            () => {

                onChangeDate(
                    {
                        target: {
                            value: DateTime
                        }
                    }
                )
                ShowNotification(
                    "Record Updated",
                    'top-center'
                )
                $('input[type=time]').val('');

            }
        ).catch(
            err => {

                console.log( err );

            }
        )

    }

    const ShowNotification = ( txt, position ) => {

        toast.dark( txt.toString() , {
            position: position,
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });

    }

    const onChangeCompany = ( e ) => {

        setCompany( e.target.value );
        GetList( DateTime, e.target.value );

    }

    return (

        <>
            <Suspense fallback={<div>Loading...</div>}>
                <UI
                    onChangeDate={onChangeDate}
                    onChangeName={ onChangeName }
                    updateRecord={ updateRecord }
                    onChangeCompany={ onChangeCompany }

                    Name={ Name }
                    Employees={ Employees }
                    Companies={ Companies }
                />
                <ToastContainer />
            </Suspense>
        </>

    )

}

export default AttendanceRequests;