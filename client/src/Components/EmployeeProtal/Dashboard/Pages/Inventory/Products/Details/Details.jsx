import React, { lazy, Suspense, useState } from 'react';

import { deleteTransaction, generateLabel, GetCompanies, getProductDetails, onFileSelection, printLabel, updateDetails, viewDetails, GetLocations, GetSubLocations, loadOutwards, createOutward, loadEmployees, onCreateOutward, createInward, loadDeliveryChallans, onCreateInward } from './Functions';
const UI = lazy( () => import('./UI') );

const Details = () => {
    
    const [ Confirmation, setConfirmation ] = useState();
    const [ InOutDetails, setInOutDetails ] = useState();
    const [ View, setView ] = useState(1);
    const [ Product, setProduct ] = useState();
    const [ OutwardDetails, setOutwardDetails ] = useState();
    const [ Inward, setInward ] = useState([]);
    const [ InwardOutward, setInwardOutward ] = useState([]);
    const [ Outward, setOutward ] = useState([]);
    const [ Name, searchName ] = useState('');
    const [ Month, searchMonth ] = useState('');
    const [ Amount, searchAmount ] = useState(0);
    const [ CreateInward, setCreateInward ] = useState(false);
    const [ ShowDetails, setShowDetails ] = useState(false);
    const [ EditDetails, setEditDetails ] = useState();
    const [ AttachedDC, setAttachedDC ] = useState();
    const [ Employees, setEmployees ] = useState([]);
    const [ Companies, setCompanies ] = useState([]);
    const [ Locations, setLocations ] = useState([]);
    const [ SubLocations, setSubLocations ] = useState([]);

    return (
        <>
            <Suspense fallback={ <div>Loading...</div> }>
                <UI 
                    Product={ Product }
                    Inward={ Inward }
                    Outward={ Outward }
                    View={ View }
                    Name={ Name }
                    Month={ Month }
                    Amount={ Amount }
                    ShowDetails={ ShowDetails }
                    InOutDetails={ InOutDetails }
                    Confirmation={ Confirmation }
                    EditDetails={ EditDetails }
                    Companies={ Companies }
                    Locations={ Locations }
                    SubLocations={ SubLocations }
                    InwardOutward={ InwardOutward }
                    OutwardDetails={ OutwardDetails }
                    Employees={ Employees }
                    CreateInward={ CreateInward }
                    AttachedDC={ AttachedDC }

                    onCreateInward={ ( e, Preview ) => onCreateInward( e, Preview, AttachedDC, setProduct, setInward, setOutward, setCreateInward, setAttachedDC ) }
                    setAttachedDC={ setAttachedDC }
                    loadDeliveryChallans={ loadDeliveryChallans }
                    setCreateInward={ setCreateInward }
                    onCreateOutward={ ( e ) => onCreateOutward( e, OutwardDetails, setOutwardDetails, setProduct, setInward, setOutward ) }
                    loadEmployees={ () => loadEmployees( setEmployees ) }
                    setOutwardDetails={ setOutwardDetails }
                    createOutward={ ( val ) => createOutward( val, setOutwardDetails ) }
                    loadOutwards={ ( transaction_id ) => loadOutwards( transaction_id, setInwardOutward ) }
                    GetSubLocations={ ( location_code ) => GetSubLocations( location_code, setSubLocations ) }
                    GetLocations={ ( location_code ) => GetLocations(location_code, setLocations, setSubLocations) }
                    GetCompanies={ () => GetCompanies(setCompanies) }
                    updateDetails={ ( e ) => updateDetails( e, EditDetails, setProduct, setInward, setOutward, setEditDetails ) }
                    onFileSelection={ ( e ) => onFileSelection( e, EditDetails, setEditDetails ) }
                    setEditDetails={ setEditDetails }
                    setConfirmation={ setConfirmation }
                    deleteTransaction={ ( val ) => deleteTransaction( val, setConfirmation, setProduct, setInward, setOutward ) }
                    printLabel={ printLabel }
                    generateLabel={ generateLabel }
                    viewDetails={ ( val ) => viewDetails( val, setInOutDetails, setShowDetails ) }
                    setShowDetails={ setShowDetails }
                    searchAmount={ searchAmount }
                    searchMonth={ searchMonth }
                    searchName={ searchName }
                    setView={ setView }
                    getProductDetails={ () => getProductDetails( setProduct, setInward, setOutward ) }
                />
            </Suspense>
        </>
    );

}

export default Details;