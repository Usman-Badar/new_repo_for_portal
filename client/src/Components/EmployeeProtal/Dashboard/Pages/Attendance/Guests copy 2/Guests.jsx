import React, { useEffect, useState } from 'react';
import './Guests.css';

import axios from "../../../../../../axios";
import Modal from '../../../../../UI/Modal/Modal';

function Guests() {
    
    const [ Employee, setEmployee ] = useState();
    const [ Employees, setEmployees ] = useState([]);
    const [ Guests, setGuests ] = useState([]);
    const [ Filter, setFilter ] = useState();
    const [ SelectedGuestMeetings, setSelectedGuestMeetings ] = useState();

    useEffect(
        () => {

            GetAllEmployees();

        }, []
    );

    const GetAllEmployees = () => {

        axios.get('/getallguests').then( res => {

            setEmployees( res.data );

        } ).catch( err => {

            console.log(err);

        } );

    };

    const ViewDetails = ( index, ) => {

        setEmployee( Employees[index] );
        setGuests([]);

        const Data = new FormData();
        Data.append('empID', Employees[index].emp_id);

        axios.post('/getthatemployeeallguests', Data).then( res => {
            
            setGuests( res.data );

        } ).catch( err => {

            console.log( err );

        } );

    }

    const ViewGuestDetails = ( guestID, empID ) => {

        const Data = new FormData();
        Data.append('empID', empID);
        Data.append('guestID', guestID);
        setSelectedGuestMeetings();

        axios.post('/getthatempguestallmeetings', Data).then( res => {
            
            setSelectedGuestMeetings( res.data );

        } ).catch( err => {

            console.log( err );

        } );

    }

    const hideModal = () => {

        setEmployee();
        setGuests([]);
        setSelectedGuestMeetings([]);

    }

    return (
        <>
            <div className="guests_container">

                {
                    Employee
                    ?
                    <Modal show={ true } Hide={ hideModal } content={ <ModalContent SelectedGuestMeetings={ SelectedGuestMeetings } Guests={ Guests } Employee={ Employee } ViewGuestDetails={ ViewGuestDetails } /> } />
                    :null
                }

                <ListView 
                    Employees={ Employees }
                    Filter={ Filter }

                    setFilter={ setFilter }
                    ViewDetails={ ViewDetails }
                />

            </div>
        </>
    )

}

export default Guests;

const ListView = ( { Employees, Filter, setFilter, ViewDetails } ) => {

    return (
        <div className="list_content">

            <div className="d-flex align-items-end justify-content-between">
                <h4 className="heading">
                    View Guests
                    <sub>List of Guests</sub>
                </h4>
                <input type="search" onChange={ (e) => setFilter(e.target.value) } className="form-control" placeholder='Search Employees' />
            </div>

            <hr />

            <table className="table table-bordered table-hover">
                <thead>
                    <tr>
                        <th>Sr.No</th>
                        <th>Employee</th>
                        <th>Last Guest Meeting With</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        Filter !== undefined && Filter !== ''
                        ?
                        Employees.map(
                            ( val, index ) => {
                                let content = <></>;
                                if ( val.name && val.name.toLowerCase().includes(Filter.toLowerCase()) )
                                {
                                    content = (
                                        <tr key={ index } onClick={ () => ViewDetails( index ) }>
                                            <td>{ index + 1 }</td>
                                            <td>
                                                <div className="d-flex align-items-center">
                                                    <img src={ 'images/employees/' + val.emp_image } className="rounded-circle mr-2" alt='Employee photo' width='40' height='40' />
                                                    <div style={{ fontSize: '11px' }}>
                                                        <p className="mb-0 font-weight-bold">{ val.name }</p>
                                                        <p className="mb-0">{ val.designation_name } at { val.company_name }</p>
                                                        <p className="mb-0">{ val.location_name }</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="d-flex align-items-center justify-content-between">
                                                    <div className="d-flex align-items-center">
                                                        <img src={ 'images/guests/' + val.guest_image } className="rounded-circle mr-2" alt='Guest photo' width='40' height='40' />
                                                        <div style={{ fontSize: '11px' }}>
                                                            <p className="mb-0 font-weight-bold">{ val.guest_name }</p>
                                                            <p className="mb-0">{ val.guest_phone }</p>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <p className="mb-0">{ new Date(val.meeting_date).toDateString() }</p>
                                                        <p className="mb-0">{ val.meeting_time }</p>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                }
                                return content;
                            }
                        )
                        :
                        Employees.map(
                            ( val, index ) => {
                                return (
                                    <tr key={ index } onClick={ () => ViewDetails( index ) }>
                                        <td>{ index + 1 }</td>
                                        <td>
                                            <div className="d-flex align-items-center">
                                                <img src={ 'images/employees/' + val.emp_image } className="rounded-circle mr-2" alt='Employee photo' width='40' height='40' />
                                                <div style={{ fontSize: '11px' }}>
                                                    <p className="mb-0 font-weight-bold">{ val.name }</p>
                                                    <p className="mb-0">{ val.designation_name } at { val.company_name }</p>
                                                    <p className="mb-0">{ val.location_name }</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="d-flex align-items-center justify-content-between">
                                                <div className="d-flex align-items-center">
                                                    <img src={ 'images/guests/' + val.guest_image } className="rounded-circle mr-2" alt='Guest photo' width='40' height='40' />
                                                    <div style={{ fontSize: '11px' }}>
                                                        <p className="mb-0 font-weight-bold">{ val.guest_name }</p>
                                                        <p className="mb-0">{ val.guest_phone }</p>
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className="mb-0">{ new Date(val.meeting_date).toDateString() }</p>
                                                    <p className="mb-0">{ val.meeting_time }</p>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            }
                        )
                    }
                </tbody>
            </table>

        </div>
    )

}

const ModalContent = ( { SelectedGuestMeetings, Employee, Guests, ViewGuestDetails } ) => {

    return (
        <>
            <div className='modal_content'>
                
                <div className="d-flex align-items-center justify-content-between">
                    <h3 className='mb-0 font-weight-bold'>Details</h3>
                    <div className='text-right'>
                        <p className='mb-0'><b>{ Employee.name }</b></p>
                        <p className='mb-0'>{ Employee.designation_name } at { Employee.company_name }, { Employee.location_name }</p>
                    </div>
                </div>
                <hr />
                
                <div className="flex_container">
                    
                    <p className='partition mb-0 font-weight-bold p-0 d-flex justify-content-between'>
                        <span>Guests</span>
                        <span>Total: {Guests.length}</span>
                    </p>
                    <p className='partition mb-0 font-weight-bold p-0 d-flex justify-content-between'>
                        <span>Meetings</span>
                        <span>Total: {SelectedGuestMeetings ? SelectedGuestMeetings.length : 0}</span>
                    </p>

                </div>

                <div className="flex_container">

                    <div className='partition bg-white'>
                        {
                            Guests.map(
                                ( val, index ) => {
                                    return (
                                        <div className='guest' key={index} onClick={ () => ViewGuestDetails( val.id, val.emp_id ) }>
                                            <img src={ 'images/guests/' + val.guest_image } className="rounded-circle mr-2" alt='Guest photo' width='40' height='40' />
                                            <div>
                                                <p className="mb-0"><b>{ val.guest_name }</b></p>
                                                <p className="mb-0">{ val.guest_phone }</p>
                                            </div>
                                        </div>
                                    )
                                }
                            )
                        }
                    </div>
                    <div className='partition bg-white'>

                        {
                            !SelectedGuestMeetings
                            ?
                            <p className="text-center mb-0">Please Wait...</p>
                            :
                            SelectedGuestMeetings.length === 0
                            ?
                            <p className="text-center mb-0">No Details Found</p>
                            :
                            <table className="table table-sm">
                                <thead>
                                    <tr>
                                        <th>Meeting Date</th>
                                        <th>Meeting Start-Time</th>
                                        <th>Meeting End-Time</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        SelectedGuestMeetings.map(
                                            ( val, index ) => {
                                                return (
                                                    <tr key={index}>
                                                        <td>{ new Date(val.meeting_date).toDateString() }</td>
                                                        <td>{ val.meeting_time == null ? "Not Entered" : val.meeting_time }</td>
                                                        <td>{ val.guest_off_time == null ? "Not Entered" : val.guest_off_time }</td>
                                                    </tr>
                                                )
                                            }
                                        )
                                    }
                                </tbody>
                            </table>
                        }

                    </div>

                </div>

            </div>
        </>
    )

}