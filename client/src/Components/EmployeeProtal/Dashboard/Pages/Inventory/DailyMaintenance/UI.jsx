import React, { useEffect } from 'react';
import './Style.css';
import { Route, Switch,useHistory } from 'react-router-dom';
import Modal from '../../../../../UI/Modal/Modal';

const UI = ( { Content, ShowModal, CheckList, List, Details, setEdit, deleteItem, loadChecklist, setShowModal, loadDetails } ) => {
    
    const history = useHistory();

    return (
        <>
            <div className="daily_maintenance">
                <div className="daily_maintenance_container">
                    <Modal show={ ShowModal } Hide={ () => setShowModal( !ShowModal ) } content={ Content } />

                    <Switch>
                        <Route exact path="/inventory/workshop/daily_maintenance" render={ 
                                () => (
                                    <ListView 
                                        List={ List }
                                        history={ history }
                                    />
                                )
                            } 
                        />
                        <Route exact path="/inventory/workshop/checklist" render={ 
                                () => (
                                    <Checklist 
                                        CheckList={ CheckList }
                                        history={ history }
                                        
                                        deleteItem={ deleteItem }
                                        setEdit={ setEdit }
                                        setShowModal={ setShowModal }
                                        loadChecklist={ loadChecklist }
                                    />
                                )
                            } 
                        />
                        <Route exact path="/inventory/workshop/report/:report_id" render={ 
                                () => (
                                    <DetailView 
                                        history={ history }
                                        Details={ Details }

                                        loadDetails={ loadDetails }
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

const Checklist = ( { CheckList, history, setShowModal, setEdit, loadChecklist, deleteItem } ) => {

    useEffect(
        () => {
            loadChecklist();
        }, []
    )

    return (
        <>
            <div className="d-flex align-items-center justify-content-between">
                <h3 className="heading">
                    Workshop Checklist
                    <sub>Daily Maintenance</sub>
                </h3>

                <div className="btn-group">
                    <button className="btn submit" onClick={ () => history.push('/inventory/workshop/daily_maintenance') } type='button'>Back</button>
                    <button className="btn green" onClick={ () => { setShowModal(true); setEdit(); } } type='button'>New</button>
                </div>
            </div>
            <hr />

            {
                CheckList
                ?
                CheckList.length === 0
                ?
                <h6 className="text-center">No Record Found</h6>
                :
                <table className="table table-sm table-striped">
                    <thead>
                        <tr>
                            <th>Sr.No</th>
                            <th colSpan={2}>Title</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            CheckList.map(
                                ( val, index ) => {
                                    return (
                                        <tr key={ index } className="pointer">
                                            <td>{ index + 1 }</td>
                                            <td>
                                                { val.title }
                                            </td>
                                            <td>
                                                <i onClick={ () => { setShowModal(true); setEdit( val ); } } className="lar la-edit"></i>
                                                <i className="las la-trash" onDoubleClick={ () => deleteItem(val.id) }></i>
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

const ListView = ( { List, history } ) => {

    return (
        <>
            <div className="d-flex align-items-center justify-content-between">
                <h3 className="heading">
                    Workshop Reports
                    <sub>Daily Maintenance</sub>
                </h3>

                <button className="btn submit" onClick={ () => history.push('/inventory/workshop/checklist') } type='button'>Checklist</button>
            </div>
            <hr />

            {
                List
                ?
                List.length === 0
                ?
                <h6 className="text-center">No Record Found</h6>
                :
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Sr.No</th>
                            <th>Vehicle</th>
                            <th>Location</th>
                            <th>Reported By</th>
                            <th>Date & Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            List.map(
                                ( val, index ) => {
                                    return (
                                        <tr key={ index } className="pointer" onClick={ () => history.push('/inventory/workshop/report/' + val.report_id) }>
                                            <td>{ index + 1 }</td>
                                            <td>
                                                { val.vehicle_type_name } <br />
                                                { val.name }
                                            </td>
                                            <td>{ val.location_name }</td>
                                            <td>{ val.enter_emp_name }</td>
                                            <td>
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

const DetailView = ( { Details, history, loadDetails } ) => {

    useEffect(
        () => {
            loadDetails(window.location.href.split('/').pop());
        }, []
    )

    return (
        <>
            <div className="d-flex align-items-center justify-content-between">
                <h3 className="heading">
                    Maintenance Report
                    <sub>Daily Analytics</sub>
                </h3>

                <button className="btn submit" onClick={ () => history.push('/inventory/workshop/daily_maintenance') } type='button'>Back</button>
            </div>
            <hr />

            {
                Details
                ?
                <>
                    <table className="table table-bordered">
                        <tbody>
                            <tr>
                                <th>Vehicle Registration Number</th>
                                <td>{ Details.details.name }</td>
                                <th>Driver Name</th>
                                <td>{ Details.details.driver_emp_name }</td>
                            </tr>
                            <tr>
                                <th>Current Meter Reading</th>
                                <td>{ Details.details.meter_reading }</td>
                                <th>Entered By</th>
                                <td>{ Details.details.enter_emp_name }</td>
                            </tr>
                            <tr>
                                <th>Date</th>
                                <td>{ new Date(Details.details.entered_date).toDateString() }</td>
                                <th>Time</th>
                                <td>{ Details.details.entered_time }</td>
                            </tr>
                        </tbody>
                    </table>
                    <table className="table table-sm table-bordered">
                        <thead>
                            <tr>
                                <th className='text-center'>Item</th>
                                <th className='text-center'>Checked</th>
                                <th className='text-center'>Comments</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                Details.items.map(
                                    ( val, index ) => {
                                        return (
                                            <tr key={ index }>
                                                <td>{ val.title }</td>
                                                <td className='text-center'>
                                                    <input type="checkbox" checked={ val.checked === 1 ? true : false } />
                                                </td>
                                                <td>{ val.comment === '' ? 'No Comment' : val.comment }</td>
                                            </tr>
                                        )
                                    }
                                )
                            }
                        </tbody>
                    </table>
                </>
                :
                <h6 className="text-center">Please Wait...</h6>
            }
        </>
    )

}