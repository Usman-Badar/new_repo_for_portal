/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import './Style.css';

import { Route, Switch, useHistory } from 'react-router-dom';
import Modal from '../../../../../UI/Modal/Modal';
import SubLocations from './Sub-Locations/Sub-Locations';

function UI({ RemovalConfirm, Edit, OpenFormModal, FilterName, FilterAddress, FilterPhone, LocationList, removeLocation, setEdit, setRemovalConfirm, createLocation, editLocation, setOpenFormModal, getAllLocations, setFilterName, setFilterAddress, setFilterPhone }) {
  return (
    <>
        <div className="inventory_locations page">
            <div className="inventory_locations_container page-content">
                <Modal show={ OpenFormModal } Hide={ () => { setOpenFormModal(!OpenFormModal); setEdit() } } content={ <ModalForm Edit={ Edit } OpenFormModal={ OpenFormModal } createLocation={ createLocation } /> } />
                <Modal show={ RemovalConfirm } Hide={ () => setRemovalConfirm(!RemovalConfirm) } content={ <ModalConfirmation RemovalConfirm={ RemovalConfirm } /> } />
                <Switch>
                    <Route exact path="/inventory/locations" render={ 
                            () => (
                                <LocationsList 
                                    LocationList={ LocationList }
                                    FilterName={ FilterName }
                                    FilterAddress={ FilterAddress }
                                    FilterPhone={ FilterPhone }

                                    removeLocation={ removeLocation }
                                    editLocation={ editLocation }
                                    setFilterName={ setFilterName }
                                    setFilterAddress={ setFilterAddress }
                                    setFilterPhone={ setFilterPhone }
                                    getAllLocations={ getAllLocations }
                                    setOpenFormModal={ setOpenFormModal }
                                />
                            )
                        } 
                    />
                    <Route exact path="/inventory/location/:location_code/sub-locations" render={ 
                            () => (
                                <SubLocations />
                            )
                        } 
                    />
                </Switch>
            </div>
        </div>
    </>
  )
}

export default UI;

const LocationsList = ({ FilterName, FilterAddress, FilterPhone, LocationList, removeLocation, editLocation, setOpenFormModal, getAllLocations, setFilterName, setFilterAddress, setFilterPhone }) => {

    useEffect(
        () => {
            getAllLocations();
        }, []
    )

    const history = useHistory();
    const Arr = LocationList.filter(val => val.location_name.toLowerCase().includes(FilterName.toLowerCase()) && val.location_phone.toLowerCase().includes(FilterPhone.toLowerCase()) && val.address.toLowerCase().includes(FilterAddress.toLowerCase()));

    return (
        <>
            <div className="d-flex align-items-center justify-content-between">
                <h3 className="heading">
                    Locations list
                    <sub>List Of All Locations</sub>
                </h3>

                <div>
                    <button className='btn submit' onClick={ () => setOpenFormModal(true) }>New</button>
                    <button className="btn submit px-2 ml-2 filter-emit" type='button'>
                        <i className="las la-filter"></i> Filters
                        <div className="filter-container">
                            <h6 className='mb-0' style={{ fontFamily: 'Oxygen' }}>Filter Options</h6>
                            <hr className='my-1 bg-dark' />

                            <label className="font-weight-bold mb-0">Search Name</label>
                            <input placeholder='Search By Name...' type="search" onChange={ (e) => setFilterName(e.target.value) } className='form-control form-control-sm mb-2' />
                            
                            <label className="font-weight-bold mb-0">Search Address</label>
                            <input placeholder='Search By Address...' type="search" onChange={ (e) => setFilterAddress(e.target.value) } className='form-control form-control-sm mb-2' />

                            <label className="font-weight-bold mb-0">Search Phone</label>
                            <input placeholder='Search By Phone Number...' type="search" onChange={ (e) => setFilterPhone(e.target.value) } className='form-control form-control-sm mb-2' />
                        </div>
                    </button>
                </div>
            </div>
            <hr />

            {
                Arr.length === 0
                ?
                <h6 className='text-center'>No Record Found</h6>
                :
                <table className="table table-sm">
                    <thead>
                        <tr>
                            <th>Sr.No</th>
                            <th>Location</th>
                            <th>Telephone No</th>
                            <th colSpan={2}>Address</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            Arr.map(
                                ( val, index ) => {
                                    return (
                                        <tr key={ index }>
                                            <td>{ index + 1 }</td>
                                            <td>{ val.location_name }</td>
                                            <td>{ val.location_phone }</td>
                                            <td style={{ wordBreak: 'break-word' }}>{ val.address }</td>
                                            <td>
                                                <div className="d-flex">
                                                    <span title="View Sub-Locations" className='iconic' onClick={ () => history.push('/inventory/location/' + val.location_code + '/sub-locations') }><i className="lar la-eye"></i></span>
                                                    <span title="Edit Location" className='iconic' onClick={ () => editLocation( val.location_code ) }><i className="las la-edit"></i></span>
                                                    <span title="Remove Location" className='iconic' onClick={ () => removeLocation( val.location_code ) }><i className="las la-trash"></i></span>
                                                </div>
                                            </td>
                                        </tr>
                                    );

                                }
                            )
                        }
                    </tbody>
                </table>
            }
        </>
    )
}

const ModalForm = ( { Edit, OpenFormModal, createLocation } ) => {

    if ( !OpenFormModal )
    {
        return <></>;
    }

    return (
        <>
            <form onSubmit={ createLocation }>
                <h5>{ Edit ? 'Update Location' : 'New Location' }</h5>
                <hr />
                <div class="alert alert-danger d-none" id="add_location_err" role="alert"></div>
                <fieldset>
                    <label className="mb-0"><b>Location Name *</b></label>
                    <input type="text" className="form-control mb-2" name="location_name" required />
                    <label className="mb-0"><b>Location Phone *</b></label>
                    <input type="text" className="form-control mb-2" name="location_phone" minLength={11} maxLength={15} required />
                    <label className="mb-0"><b>Location Address *</b></label>
                    <textarea className="form-control mb-2" name="location_address" minLength={10} required />
                    <button className='btn submit d-block ml-auto mt-3'>{ Edit ? 'Update' : 'Create' }</button>
                </fieldset>
            </form>
        </>
    )

}

const ModalConfirmation = ( { RemovalConfirm } ) => {

    if ( !RemovalConfirm )
    {
        return <></>;
    }

    return (
        <form onSubmit={ RemovalConfirm.func }>
            <fieldset className="px-3 pt-2 pb-0">
                <h6 className='mb-3'>
                    { RemovalConfirm.label }
                </h6>
                <button className='btn cancle d-block ml-auto' type='submit'>
                    Confirm
                </button>
            </fieldset>
        </form>
    )

}