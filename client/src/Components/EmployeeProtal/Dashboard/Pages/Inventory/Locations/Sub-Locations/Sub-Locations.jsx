import React, { Suspense, lazy, useEffect, useState } from 'react';
import { createLocation, editLocation, getAllSubLocations, removeLocation } from './Functions';

const UI = lazy( () => import('./UI') );

function SubLocations() {

  const LocationCode = window.location.href.split('/location/').pop().split('/').shift();
  
  const [ RemovalConfirm, setRemovalConfirm ] = useState();
  const [ Edit, setEdit ] = useState();
  const [ LocationList, setLocationList ] = useState([]);
  const [ OpenFormModal, setOpenFormModal ] = useState(false);
  const [ FilterName, setFilterName ] = useState('');

  return (
    <Suspense fallback={<div>Loading....</div>}>
        <UI
          LocationList={ LocationList }
          FilterName={ FilterName }
          OpenFormModal={ OpenFormModal }
          Edit={ Edit }
          RemovalConfirm={ RemovalConfirm }

          setEdit={ setEdit }
          removeLocation={ ( index ) => removeLocation( index, LocationCode, LocationList, setRemovalConfirm, setLocationList ) }
          setRemovalConfirm={ setRemovalConfirm }
          editLocation={ ( index ) => editLocation( index, LocationList, setEdit, setOpenFormModal ) }
          createLocation={ ( e ) => createLocation( e, LocationCode, Edit, setEdit, setOpenFormModal, setLocationList ) }
          setFilterName={ setFilterName }
          setOpenFormModal={ setOpenFormModal }
          getAllSubLocations={ () => getAllSubLocations( LocationCode, setLocationList ) }
        />
    </Suspense>
  )
}

export default SubLocations;