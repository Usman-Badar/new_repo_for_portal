import React, { Suspense, lazy, useState } from 'react';
import { createLocation, editLocation, getAllLocations, removeLocation } from './Functions';

const UI = lazy( () => import('./UI') );

function Locations() {

  const [ RemovalConfirm, setRemovalConfirm ] = useState();
  const [ Edit, setEdit ] = useState();
  const [ LocationList, setLocationList ] = useState([]);
  const [ OpenFormModal, setOpenFormModal ] = useState(false);
  const [ FilterName, setFilterName ] = useState('');
  const [ FilterAddress, setFilterAddress ] = useState('');
  const [ FilterPhone, setFilterPhone ] = useState('');

  return (
    <Suspense fallback={<div>Loading....</div>}>
        <UI
          LocationList={ LocationList }
          FilterName={ FilterName }
          FilterAddress={ FilterAddress }
          FilterPhone={ FilterPhone }
          OpenFormModal={ OpenFormModal }
          Edit={ Edit }
          RemovalConfirm={ RemovalConfirm }

          setEdit={ setEdit }
          removeLocation={ ( index ) => removeLocation( index, LocationList, setRemovalConfirm, setLocationList ) }
          setRemovalConfirm={ setRemovalConfirm }
          editLocation={ ( index ) => editLocation( index, LocationList, setEdit, setOpenFormModal ) }
          createLocation={ ( e ) => createLocation( e, Edit, setEdit, setOpenFormModal, setLocationList ) }
          setFilterName={ setFilterName }
          setFilterAddress={ setFilterAddress }
          setFilterPhone={ setFilterPhone }
          setOpenFormModal={ setOpenFormModal }
          getAllLocations={ () => getAllLocations( setLocationList ) }
        />
    </Suspense>
  )
}

export default Locations;