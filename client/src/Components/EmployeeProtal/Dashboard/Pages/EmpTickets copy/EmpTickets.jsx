import React, { lazy, Suspense, useEffect, useState } from "react";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import $ from 'jquery';

import { searchEmployees, getEmployees, generateTicket, getIssuedTickets } from './Functions';
import { useSelector } from "react-redux";
const UI = lazy(() => import('./UI'));

const EmpTickets = () => {
    
    const AccessControls = useSelector( ( state ) => state.EmpAuth.EmployeeData );

    const [ ShowModal, setShowModal ] = useState(false);
    const [ Keyword, setKeyword ] = useState();
    const [ Ticket, setTicket ] = useState();
    const [ Tickets, setTickets ] = useState();
    const [ Data, setData ] = useState([]);
    const [ Employee, setEmployee ] = useState();
    const [ Employees, setEmployees ] = useState();

    useEffect(
        () => {

            setKeyword();
            if ( Employees )
            {
                for ( let x = 0; x < Employees.length; x++ )
                {
                    if ( parseInt(Employees[x].emp_id) === parseInt(Employee) )
                    {
                        $('.search_employees').val(Employees[x].name)
                    }
                }
            }

        }, [ Employee ]
    )

    return (
        <>
            <Suspense fallback={<div>Loading....</div>}>
                <UI 
                    Keyword={ Keyword }
                    Employees={ Employees }
                    Tickets={ Tickets }
                    Data={ Data }
                    ShowModal={ ShowModal }

                    setShowModal={ setShowModal }
                    getIssuedTickets={ ( emp_id ) => getIssuedTickets( emp_id, setTickets, setData ) }
                    setTicket={ setTicket }
                    setEmployee={ setEmployee }
                    searchEmployees={ (e) => searchEmployees( e, setKeyword, setEmployee ) }
                    getEmployees={ () => getEmployees( Employees, AccessControls, setEmployees ) }
                    generateTicket={ (e) => generateTicket( e, Employee, Ticket, toast, setEmployee, setTicket ) }
                />
            </Suspense>
            <ToastContainer />
        </>
    )

}
export default EmpTickets;