import React, { useEffect, useLayoutEffect, useState } from "react";
import './UI.css';

import $ from 'jquery';
import { Route, Switch, useHistory } from 'react-router-dom';
import Modal from '../../../../UI/Modal/Modal';

const UI = ( { ShowModal, Data, Tickets, Employees, Keyword, searchEmployees, setShowModal, generateTicket, getIssuedTickets, getEmployees, setEmployee, setTicket } ) => {

    const history = useHistory();

    useLayoutEffect(
        () => {
            $('.EmpTickets_container .tickets__selection_container .ticket').on(
                'click', (e) => {

                    $('.EmpTickets_container .tickets__selection_container .ticket').removeClass('active');
                    $('.EmpTickets_container .tickets__selection_container .ticket .la-check').remove();

                    let icon = document.createElement('i');
                    icon.className = 'las la-check';
                    if ( e.target.className === "ticket" )
                    {
                        $(e.target).addClass('active');
                        $(e.target).append(icon);
                    }else
                    {
                        $(e.target.parentElement).addClass('active');
                        $(e.target.parentElement).append(icon);
                    }

                }
            )
        }, []
    );

    return (
        <div className="emp_tickets_container">
            <Switch>
                <Route exact path="/employeestickets/form" render={ 
                        () => <Form
                            Employees={ Employees }
                            Keyword={ Keyword }
                            history={ history }

                            searchEmployees={ searchEmployees }
                            generateTicket={ generateTicket }
                            getEmployees={ getEmployees }
                            setEmployee={ setEmployee }
                            setTicket={ setTicket }
                        />
                    } 
                />
                <Route exact path="/employeestickets/list" render={ 
                        () => <List 
                            Tickets={ Tickets }
                            Data={ Data }
                            history={ history }
                            ShowModal={ ShowModal }

                            setShowModal={ setShowModal }
                            getIssuedTickets={ getIssuedTickets }
                        />
                    } 
                />
            </Switch>
        </div>
    )
}

export default UI;

const List = ( { ShowModal, history, Data, Tickets, setShowModal, getIssuedTickets } ) => {

    const [ Content, setContent ] = useState(<></>);

    useEffect(
        () => {

            getIssuedTickets(localStorage.getItem('EmpID'));

        }, []
    );

    const OpenDetails = ( index ) => {

        if ( window.innerWidth <= 600 )
        {
            setContent(
                <div className="p-3 rounded" style={ { fontSize: '13px', border: '1px solid lightgray' } }>
                    <div className="d-flex align-items-center justify-content-between">
                        <h5 className="font-weight-bold mb-0">Details</h5>
                        {
                            Tickets[index].ticket === 'green'
                            ?
                            <i className="las green la-trophy"></i>
                            :
                            Tickets[index].ticket === 'yellow'
                            ?
                            <i className="las yellow la-star-half-alt"></i>
                            :
                            <i className="las red la-exclamation"></i>
                        }
                    </div>
                    <hr />

                    <b>Employee</b>
                    <br />
                    <p>
                        { Tickets[index].name } <br />
                        { Tickets[index].designation_name }
                    </p>

                    <b>Generate Date</b>
                    <br />
                    <p>
                        { new Date(Tickets[index].generated_date).toDateString() } <br />
                        { Tickets[index].generated_time }
                    </p>

                    <b>Remarks</b>
                    <br />
                    <p>
                        { Tickets[index].remarks }
                    </p>
                </div>
            )
            setShowModal(true);
        }

    }

    return (
        <>
            <Modal show={ ShowModal } Hide={ () => setShowModal(!ShowModal) } content={ Content } />
            <div className="grid_container">
                {
                    window.screen.availWidth <= 800
                    ?
                    <div className="bar_container">
                        <div className="bar_container_content">
                            <h6 className="text-center font-weight-bold">Overview</h6>
                            <hr />
                            {/* <CanvasJSChart options={options} /> */}
                            {
                                Data.length === 0
                                ?
                                <h6 className="text-center">No Ticket Issued</h6>
                                :
                                Data.map(
                                    ( val, index ) => {

                                        let width = (val.y / val.total_tickets_issued) * 100;
                                        return (
                                            <div className="bar" key={index}>
                                                <div style={ { width: width + '%' } } className={ val.indexLabel + " bar_filled" }>
                                                    { width } %
                                                </div>
                                            </div>
                                        )
                                    }
                                )
                            }
                        </div>
                    </div>
                    :null
                }
                <div>
                    <div className="tickets_issued">

                        <div className="d-flex align-items-center justify-content-between head">
                            <h3 className="heading">
                                Tickets Issued
                                <sub>To Employees</sub>
                            </h3>
                            <div className="d-flex align-items-center justify-content-center counts">
                                <div className="green">
                                    { Data.length === 0 || !Data[0] ? "0" : Data[0].y }
                                </div>
                                <div className="yellow">
                                    { Data.length === 0 || !Data[2] ? "0" : Data[2].y }
                                </div>
                                <div className="red">
                                    { Data.length === 0 || !Data[1] ? "0" : Data[1].y }
                                </div>
                            </div>
                        </div>
                        
                        <hr className="mb-1" />

                        <button className="btn submit d-block ml-auto mb-1" onClick={ () => history.push('/employeestickets/form') }>New</button>
                        
                        {
                            Tickets
                            ?
                            Tickets.length === 0
                            ?
                            <h6 className="text-center">No Ticket Found</h6>
                            :
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Sr.No</th>
                                        <th>Ticket</th>
                                        <th>Employee</th>
                                        <th>Remarks</th>
                                        <th>Generate Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        Tickets.map(
                                            ( val, index ) => {

                                                return (
                                                    <tr key={ index } title={ val.remarks } onClick={ () => OpenDetails(index) }>
                                                        <td>
                                                            { index + 1 }
                                                        </td>
                                                        <td>
                                                            {
                                                                val.ticket === 'green'
                                                                ?
                                                                <i className="las green la-trophy"></i>
                                                                :
                                                                val.ticket === 'yellow'
                                                                ?
                                                                <i className="las yellow la-star-half-alt"></i>
                                                                :
                                                                <i className="las red la-exclamation"></i>
                                                            }
                                                        </td>
                                                        <td>
                                                            <b>{ val.name }</b> 
                                                            <br />
                                                            { val.designation_name }
                                                        </td>
                                                        <td>
                                                            { val.remarks.substring(0, 50) + '...' }
                                                            <div className="date_column">
                                                                <b>Generate Date:</b> <br />
                                                                { new Date( val.generated_date ).toDateString() }
                                                            </div>
                                                        </td>
                                                        <td>
                                                            { new Date( val.generated_date ).toDateString() } <br />
                                                            { val.generated_time }
                                                        </td>
                                                    </tr>
                                                )

                                            }
                                        )
                                    }
                                </tbody>
                            </table>
                            :
                            <h6 className="text-center">Loading The List...</h6>
                        }

                    </div>
                </div>
                {
                    window.screen.availWidth > 800
                    ?
                    <div className="bar_container">
                        <div className="bar_container_content">
                            <h6 className="text-center font-weight-bold">Overview</h6>
                            <hr />
                            {/* <CanvasJSChart options={options} /> */}
                            {
                                Data.length === 0
                                ?
                                <h6 className="text-center">No Ticket Issued</h6>
                                :
                                Data.map(
                                    ( val, index ) => {

                                        let width = (val.y / val.total_tickets_issued) * 100;
                                        return (
                                            <div className="bar" key={index}>
                                                <div style={ { width: width + '%' } } className={ val.indexLabel + " bar_filled" }>
                                                    { width } %
                                                </div>
                                            </div>
                                        )
                                    }
                                )
                            }
                        </div>
                    </div>
                    :null
                }
            </div>
        </>
    )

}

const Form = ( { history, Employees, Keyword, searchEmployees, generateTicket, getEmployees, setEmployee, setTicket } ) => {

    return (
        <form className="EmpTickets_container container-fluid" id="ticket_form" onSubmit={ generateTicket }>

            <fieldset>
                <h3 className="heading">
                    Performance Tickets
                    <sub>For Employees</sub>
                </h3>

                <hr />

                <div className="tickets__selection_container mb-5">
                    <div className="ticket" onClick={ () => setTicket("green") }>
                        <i className="las la-trophy"></i>
                    </div>
                    <div className="ticket" onClick={ () => setTicket("yellow") }>
                        <i className="las la-star-half-alt"></i>
                    </div>
                    <div className="ticket" onClick={ () => setTicket("red") }>
                        <i className="las la-exclamation"></i>
                    </div>
                </div>

                <div className="row mb-3">
                    <div className="col-lg-6 col-md-6 col-sm-12">
                        <label className="mb-0">Employee</label>
                        <div className="search_container">
                            <input type="search" required className="form-control search_employees" placeholder="Seach employees..." onFocus={ getEmployees } onChange={ searchEmployees } />
                            {
                                Keyword
                                ?
                                <div className="employees_list">

                                    {
                                        Employees
                                        ?
                                        Employees.map(
                                            ( val, index ) => {

                                                let content = <></>;
                                                if ( val.name.toLowerCase().includes(Keyword.toLowerCase()) )
                                                {
                                                    content = (
                                                        <div className="employee" key={ index } onClick={ () => setEmployee( val.emp_id ) }>
                                                            <div>
                                                                <img src={ "images/employees/" + val.emp_image } alt="emp_photo" width="35" height="35" className="rounded-circle" />
                                                            </div>
                                                            <div className="ml-2">
                                                                <p className="font-weight-bold mb-0"> { val.name } </p>
                                                                <p className="mb-0"> { val.designation_name } at { val.company_name }</p>
                                                            </div>
                                                        </div>
                                                    )
                                                }

                                                return content;

                                            }
                                        )
                                        :
                                        <p className="text-center mb-0">Loading employees list...</p>
                                    }
                                    
                                </div>
                                :null
                            }
                        </div>
                    </div>
                    
                    <div className="col-lg-6 col-md-6 col-sm-12">
                        <label className="mb-0">Generate Date</label>
                        <input type="text" className="form-control" value={ new Date().toDateString() } disabled />
                    </div>
                </div>

                <div className="reason">
                    <label className="mb-0">Give Remarks</label>
                    <textarea name="remarks" required id="" rows="3" className="form-control" placeholder="Suitable remarks according to the given task..." />
                </div>

                <div className="d-flex justify-content-end mt-3">
                    <button className="btn green mr-3" type="button" onClick={ () => history.push('/employeestickets/list') }>Back</button>
                    <button className="btn submit" type="submit">Submit</button>
                </div>
            </fieldset>

        </form>
    )

}