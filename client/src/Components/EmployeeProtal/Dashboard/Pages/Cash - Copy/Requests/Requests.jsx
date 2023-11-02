/* eslint-disable react-hooks/exhaustive-deps */
import React, { Suspense, lazy, useEffect, useState } from 'react';

import { loadAllRequests } from './Functions';
import { useSelector } from 'react-redux';
const UI = lazy( () => import('./Ui') );

function RequestsComponent() {
    
    const AccessControls = useSelector( ( state ) => state.EmpAuth.EmployeeData );

    const [ ShowFilters, setShowFilters ] = useState(false);
    const [ Admin, setAdmin ] = useState(false);
    const [ Cashier, setCashier ] = useState(false);
    const [ AccessDefined, setAccessDefined ] = useState(false);
    const [ Keyword, setKeyword ] = useState('');
    const [ Company, setCompany ] = useState('');
    const [ Status, setStatus ] = useState('');
    const [ Companies, setCompanies ] = useState([]);
    const [ RequestStatuses, setRequestStatuses ] = useState([]);
    const [ Requests, setRequests ] = useState([]);
    const [ Amount, setAmount ] = useState(0);
    const [ Range, setRange ] = useState({ start: 0, end: 10 });

    useEffect(
        () => {
            let accessKey = false;
            let cashier = false;
            if ( AccessControls )
            {
                for ( let y = 0; y < JSON.parse(AccessControls.access).length; y++ )
                {
                    if ( parseInt(JSON.parse(AccessControls.access)[y]) === 0 || parseInt(JSON.parse(AccessControls.access)[y]) === 47 )
                    {
                        accessKey = true;
                    }
                    if ( parseInt(JSON.parse(AccessControls.access)[y]) === 52 )
                    {
                        cashier = true;
                    }
                }
            }
            setAdmin(accessKey);
            setCashier(cashier);
            setAccessDefined(true);
        }, [AccessControls]
    )

    useEffect(
        () => {
            if ( AccessControls && AccessDefined )
            {
                loadAllRequests( Admin, Cashier, AccessControls.location_code, setRequests );
            }
        }, [ AccessControls, AccessDefined ]
    );

    useEffect(
        () => {
            if ( Requests.length > 0 )
            {
                let names = [];
                let statuses = [];
                for ( let x = 0; x < Requests.length; x++ )
                {
                    if ( !names.includes(Requests[x].company_name) )
                    {
                        names.push(Requests[x].company_name);
                    }
                    if ( !statuses.includes(Requests[x].status) )
                    {
                        statuses.push(Requests[x].status.toLowerCase());
                    }
                }
                setRequestStatuses(statuses);
                setCompanies( names );

                if ( window.location.href.includes('?view=') )
                {
                    setStatus(window.location.href.split('?view=').pop().toLowerCase());
                }else
                if (sessionStorage.getItem('ACStatus'))
                {
                    setStatus(sessionStorage.getItem('ACStatus'));
                }
            }
        }, [ Requests ]
    );

    useEffect(
        () => {
            if (sessionStorage.getItem('AC_Filters_Company'))
            {
                setCompany(sessionStorage.getItem('AC_Filters_Company'));
            }
            if (sessionStorage.getItem('AC_Filters_Amount'))
            {
                setAmount(parseFloat(sessionStorage.getItem('AC_Filters_Amount')));
            }
            if (sessionStorage.getItem('AC_Filters_Keyword'))
            {
                setKeyword(sessionStorage.getItem('AC_Filters_Keyword'));
            }
        }, []
    );

    const updateEndValue = (e) => {
        setRange(
            {
                ...Range,
                end: parseInt(e.target.value)
            }
        )
    }

    return (
        <Suspense fallback={ <div>Loading...</div> }>
            <UI 
                Requests={ Requests }
                Companies={ Companies }
                Keyword={ Keyword }
                Amount={ Amount }
                Company={ Company }
                Status={ Status }
                ShowFilters={ ShowFilters }
                RequestStatuses={ RequestStatuses }
                Range={ Range }

                updateEndValue={ updateEndValue }
                setShowFilters={ setShowFilters }
                setStatus={ setStatus }
                setCompany={ (value) => { setCompany(value); sessionStorage.setItem("AC_Filters_Company", value) } }
                setAmount={ (value) => { setAmount(value); sessionStorage.setItem("AC_Filters_Amount", value) } }
                setKeyword={ (value) => { setKeyword(value); sessionStorage.setItem("AC_Filters_Keyword", value) } }
            />
        </Suspense>
    );

}

export default RequestsComponent;