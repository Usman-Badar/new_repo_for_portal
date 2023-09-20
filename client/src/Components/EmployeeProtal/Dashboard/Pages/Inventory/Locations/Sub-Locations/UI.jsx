/* eslint-disable no-use-before-define */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import './Style.css';

import { useHistory } from 'react-router-dom';
import Modal from '../../../../../../UI/Modal/Modal';

function UI({ RemovalConfirm, Edit, OpenFormModal, FilterName, LocationList, setEdit, removeLocation, setRemovalConfirm, createLocation, editLocation, setOpenFormModal, getAllSubLocations, setFilterName }) {
  return (
    <>
        <Modal show={ OpenFormModal } Hide={ () => { setOpenFormModal(!OpenFormModal); setEdit(); } } content={ <ModalForm Edit={ Edit } OpenFormModal={ OpenFormModal } createLocation={ createLocation } /> } />
        <Modal show={ RemovalConfirm } Hide={ () => setRemovalConfirm(!RemovalConfirm) } content={ <ModalConfirmation RemovalConfirm={ RemovalConfirm } /> } />
        <LocationsList 
            LocationList={ LocationList }
            FilterName={ FilterName }

            removeLocation={ removeLocation }
            editLocation={ editLocation }
            setFilterName={ setFilterName }
            getAllSubLocations={ getAllSubLocations }
            setOpenFormModal={ setOpenFormModal }
        />
    </>
  )
}

export default UI;

const LocationsList = ({ FilterName, LocationList, removeLocation, editLocation, setOpenFormModal, getAllSubLocations, setFilterName }) => {

    const history = useHistory();
    const Arr = LocationList.filter(val => val.sub_location_name.toLowerCase().includes(FilterName.toLowerCase()));

    useEffect(
        () => {
            getAllSubLocations();
        }, [window.location.href]
    );

    return (
        <>
            <div className="d-flex align-items-center justify-content-between">
                <h3 className="heading">
                    Sub-Locations list
                    <sub>List Of All Sub-Locations</sub>
                </h3>

                <div>
                    <button className='btn light' onClick={ () => history.replace('/inventory/locations') }>Back</button>
                    <button className='btn submit ml-2' onClick={ () => setOpenFormModal(true) }>New</button>
                    <button className="btn submit px-2 ml-2 filter-emit" type='button'>
                        <i className="las la-filter"></i> Filters
                        <div className="filter-container">
                            <h6 className='mb-0' style={{ fontFamily: 'Oxygen' }}>Filter Options</h6>
                            <hr className='my-1 bg-dark' />

                            <label className="font-weight-bold mb-0">Search Name</label>
                            <input placeholder='Search By Name...' type="search" onChange={ (e) => setFilterName(e.target.value) } className='form-control form-control-sm mb-2' />
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
                            <th colSpan={2}>Location</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            Arr.map(
                                ( val, index ) => {
                                    return (
                                        <tr key={ index }>
                                            <td>{ index + 1 }</td>
                                            <td>{ val.sub_location_name }</td>
                                            <td>
                                                <div className="d-flex">
                                                    <span title="Edit Sub-Location" className='iconic' onClick={ () => editLocation( val.sub_location_code ) }><i className="las la-edit"></i></span>
                                                    <span title="Remove Sub-Location" className='iconic' onClick={ () => removeLocation( val.sub_location_code ) }><i className="las la-trash"></i></span>
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
                    <input type="text" className="form-control mb-2" name="sub_location_name" required />
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