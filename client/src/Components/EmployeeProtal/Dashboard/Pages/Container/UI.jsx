import React from 'react';
import './Style.css';

import { Route, Switch, useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';

const UI = ( { Locations, List, Entry } ) => {
    
    const history = useHistory();
    const AccessControls = useSelector( ( state ) => state.EmpAuth.EmployeeData );

    return (
        <>
            <div className="container_entry">
                <div className="container_entry_container">

                    <Switch>
                        <Route exact path="/logistics/container/in_out" render={ 
                                () => (
                                    <ListView 
                                        List={ List }
                                        history={ history }
                                    />
                                )
                            } 
                        />
                        <Route exact path="/logistics/container/entry" render={ 
                                () => (
                                    <NewEntry 
                                        Locations={ Locations }
                                        history={ history }
                                        AccessControls={ AccessControls }

                                        Entry={ Entry }
                                    />
                                )
                            } 
                        />
                    </Switch>

                </div>
            </div>
        </>
    );

}

export default UI;

const ListView = ( { List, history } ) => {

    return (
        <>
            <div className="d-flex align-items-center justify-content-between">
                <h3 className="heading">
                    Container in/out
                    <sub>Entered list view</sub>
                </h3>

                <button className="btn submit" onClick={ () => history.push('/logistics/container/entry') } type='button'>New Entry</button>
            </div>
            <hr />

            {
                List
                ?
                List.length === 0
                ?
                <h6 className="text-center">No Record Found</h6>
                :
                <table className="table">
                    <thead>
                        <tr>
                            <th>Sr.No</th>
                            <th>Container No</th>
                            <th>Current Status</th>
                            <th>Entered</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            List.map(
                                ( val, index ) => {
                                    return (
                                        <tr key={ index }>
                                            <td>{ index + 1 }</td>
                                            <td>{ val.container_no }</td>
                                            <td>
                                                { val.status }
                                            </td>
                                            <td>
                                                { val.name } <br />
                                                { new Date(val.entered_date).toDateString() } at { val.entered_time.substring(0,5) }
                                            </td>
                                        </tr>
                                    )
                                }
                            )
                        }
                    </tbody>
                </table>
                :
                <h6 className="text-center">Please Wait...</h6>
            }
        </>
    )

}

const NewEntry = ( { AccessControls, Locations, history, Entry } ) => {

    return (
        <>
            <div className="d-flex align-items-center justify-content-between">
                <h3 className="heading">
                    Container Entry
                    <sub>Container New Entry</sub>
                </h3>

                <button className="btn submit" onClick={ () => history.push('/logistics/container/in_out') } type='button'>Back To List</button>
            </div>
            <hr />

            <form onSubmit={ ( e ) => Entry( e, history ) }>
                <fieldset>
                    <div className="flex_container mb-3">

                        <div>
                            <label className='mb-0'>
                                <b>Container Number</b>
                            </label>
                            <input type="text" id='container_no' className="form-control" />
                        </div>
                        <div>
                            <label className='mb-0'>
                                <b>Current Date</b>
                            </label>
                            <input type="text" disabled value={ new Date().toDateString() } className="form-control" />
                        </div>

                    </div>
                    <div className="flex_container">

                        <div>
                            <label className='mb-0'>
                                <b>Location</b>
                            </label>
                            <select className="form-control" name="location_code" required>
                                <option value=''>Select the option</option>
                                {
                                    Locations.map(
                                        val => {

                                            let option = <></>
                                            if ( val.location_code == AccessControls.location_code )
                                            {
                                                option = <option key={ val.location_code } value={ val.location_code }> { val.location_name } </option>
                                            }
                                            return option;

                                        }
                                    )
                                }
                            </select>
                        </div>
                        <div>
                            <label className='mb-0'>
                                <b>Status</b>
                            </label>
                            <select defaultValue='IN' className="form-control" name="status" required disabled>
                                <option value='IN'>IN</option>
                                <option value='OUT'>OUT</option>
                            </select>
                        </div>

                    </div>

                    <button className="btn d-block ml-auto submit mt-3" type='submit'>Enter</button>

                </fieldset>
            </form>
        </>
    )

}