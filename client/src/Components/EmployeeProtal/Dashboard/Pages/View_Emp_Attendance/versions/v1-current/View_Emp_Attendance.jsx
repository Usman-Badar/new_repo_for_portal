import React, { lazy, Suspense, useEffect, useState } from 'react';

import axios from '../../../../../axios';
import { useSelector } from 'react-redux';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// import $ from 'jquery';

import { FetchData, FetchCompanies, OnFilter } from './Functions';
const UI = lazy( () => import('./UI') );

const ViewEmpAttendance = () => {

    const EmpData = useSelector( ( state ) => state.EmpAuth.EmployeeData );
    const ref = React.createRef();
    const AccessControls = useSelector( ( state ) => state.EmpAuth.EmployeeData );
    
    const [ SelectedEmployee, setSelectedEmployee ] = useState('');
    const [ StartLoading, setStartLoading ] = useState(false);
    const [ Employees, setEmployees ] = useState([]);
    const [ DailyAttendance, setDailyAttendance ] = useState([]);
    const [ Companies, setCompanies ] = useState([]);
    const [ Filters, setFilters ] = useState(
        {
            dateFrom: '', dateTo: '', company: null
        }
    );

    useEffect(
        () => {

            FetchData( Filters, EmpData, toast, axios, setDailyAttendance, setStartLoading );

        // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [ Filters.dateFrom, Filters.dateTo, Filters.company ]
    )
    
    useEffect(
        () => {

            FetchCompanies( axios, toast, setCompanies );

        }, []
    )

    useEffect(
        () => {

            let names = [];
            for ( let x = 0; x < DailyAttendance.length; x++ )
            {
                if ( !names.includes( DailyAttendance[x].name ) )
                {
                    names.push( DailyAttendance[x].name );
                }
            }

            setEmployees( names );

        // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [ DailyAttendance.length ]
    )

    return (
        <>
            <Suspense fallback={ <div>Loading...</div> }>
                <UI 
                    AccessControls={ AccessControls }
                    Companies={ Companies }
                    Employees={ Employees }
                    DailyAttendance={ DailyAttendance }
                    SelectedEmployee={ SelectedEmployee }
                    ref={ ref }
                    StartLoading={ StartLoading }

                    OnFilter={ ( e ) => OnFilter( e, Filters, setFilters ) }
                    setSelectedEmployee={ ( value ) => setSelectedEmployee( value ) }
                />
            </Suspense>
        </>
    )

}

export default ViewEmpAttendance;