import React, { useEffect, useState } from 'react';
import './AttRequest_Config.css';

import axios from '../../../../axios';

import $ from 'jquery';

const AttRequest_Config = () => {

    const [Datelist, setDatelist] = useState([]);

    const [AddDate, setAddDate] = useState(
        {
            date: ''
        }
    )

    useEffect(
        () => {

            GetAllDates();

        }, []
    );

    const GetAllDates = () => {

        axios.get('/get_att_request_dates').then(response => {

            setDatelist(response.data);

        }).catch(err => {

            console.log(err)

        });

    }

    // Function onchange which is called to store data into usestate()
    const OnChangeHandler = (e) => {

        const { name, value } = e.target;
        const setVal = {
            ...AddDate,
            [name]: value
        }
        setAddDate(setVal);

        if ( value === '' )
        {
            GetAllDates();
        }else
        {
            let date = Datelist.filter(
                val => {

                    const d1 = new Date( val.date );
                    const d2 = new Date( AddDate.date );
                    console.log( d1.toDateString() );
                    console.log( AddDate.date );
                    return val.date === AddDate.date

                }
            )

            console.log( date );
            // setDatelist( date );
        }

    }

    const AddNewDate = (e) => {

        e.preventDefault();

        const Data = new FormData();
        Data.append('date', AddDate.date);

        axios.post('/att_request_dates', Data).then(() => {

            GetAllDates();
            $("input[name='date']").val('');

        }).catch(err => {

            console.log(err)

        });

    }

    const ChangeStatus = ( status, id ) => {

        const Data = new FormData();
        Data.append('status', status);
        Data.append('id', id);

        axios.post('/get_att_request_dates_show_hide', Data).then(() => {

            GetAllDates();
            $("input[name='date']").val('');

        }).catch(err => {

            console.log(err)

        });

    }

    const OnDelete = ( id ) => {

        const Data = new FormData();
        Data.append('id', id);

        axios.post('/del_att_request_dates_', Data).then(() => {

            GetAllDates();
            $("input[name='date']").val('');

        }).catch(err => {

            console.log(err)

        });
        
    }

    return (
        <>
            <div className="AttRequest_Config d-center">
                <div className="AttRequest_Config-content">

                    <h3>Attendance Request Configuration</h3>
                    <form className="search-content" onSubmit={AddNewDate}>
                        <div className="d-flex align-items-center w-50">
                            <input type="date" name='date' className="form-control mr-1" onChange={OnChangeHandler} required />
                            <button className="btn searchBtn btn-dark px-4 mx-3 w-50">Add Date</button>
                        </div>
                    </form>

                    {
                        sessionStorage.getItem('userName') === 'UsmanBadar' || sessionStorage.getItem('userName') === 'MMalahim'
                            ?
                            <h3 className="text-uppercase" style={{ 'color': 'rgb(128, 128, 128, .5)' }}>Dates</h3>
                            :
                            null
                    }

                    {
                        sessionStorage.getItem('userName') === 'UsmanBadar' || sessionStorage.getItem('userName') === 'MMalahim'
                            ?

                            <>
                                {
                                    Datelist.map(
                                        (val, index) => {

                                            const d = new Date( val.date );

                                            return (
                                                <>
                                                    <div className="Requests" key={index}>
                                                        <div className='index' >
                                                            {index + 1}
                                                        </div>
                                                        <div className='colums'>
                                                            <p className="mb-0">{d ? d.toDateString() : null}</p>
                                                        </div>
                                                        <div className='colums'>
                                                            {
                                                                val.enabled === 1
                                                                    ?
                                                                    <button className="btn btn-primary" onClick={() => ChangeStatus(0, val.id)}>Disable</button>
                                                                    :
                                                                    <button className="btn btn-primary" onClick={() => ChangeStatus(1, val.id)}>Enable</button>
                                                            }
                                                        </div>
                                                        <div className='colums'>
                                                            <button className="btn"  onClick={ () => OnDelete( val.id ) } style={{ 'backgroundColor': '#FEC400' }}><i className="las la-trash"></i></button>
                                                        </div>
                                                    </div>
                                                </>
                                            )
                                        }
                                    )
                                }

                            </>
                            :
                            null
                    }

                </div>
            </div>
        </>
    )
}
export default AttRequest_Config;