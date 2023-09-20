import React, { Suspense, lazy, useEffect, useState } from 'react';

import { useHistory } from 'react-router-dom';
import { GetCompanies, GetSubLocations, loadDeliveryChallans, onAddAttribute, onCreateProduct, onFileSelection, searchSubCategories, selectSubCategory } from './Functions';
const UI = lazy( () => import('./UI') );

function Create() {
    const history = useHistory();

    const [ Companies, setCompanies ] = useState([]);
    // const [ Categories, setCategories ] = useState([]);
    const [ Category, setCategory ] = useState();
    const [ SubCategory, setSubCategory ] = useState();
    const [ SubCategories, setSubCategories ] = useState([]);
    const [ Locations, setLocations ] = useState([]);
    const [ Type, setType ] = useState('');
    const [ AttrType, setAttrType ] = useState('value_str');
    const [ SubLocations, setSubLocations ] = useState([]);
    const [ Attributes, setAttributes ] = useState([]);
    const [ DeliveryChallans, setDeliveryChallans ] = useState([]);
    const [ ShowResults, setShowResults ] = useState(false);
    const [ NewAttribute, setNewAttribute ] = useState(false);
    const [ AttachedDC, setAttachedDC ] = useState();
    const [ Preview, setPreview ] = useState();
    const [ VendorSearch, setVendorSearch ] = useState('');
    const [ DescriptionSearch, setDescriptionSearch ] = useState('');

    useEffect(
        () => {
            GetCompanies(setCompanies, setLocations);
            loadDeliveryChallans(setDeliveryChallans);
        }, []
    )

    // useEffect(
    //     () => {
    //         LoadCategories(Type, setCategories, setCategory, setSubCategory, setSubCategories);
    //     }, [ Type ]
    // )

    return (
        <Suspense fallback={<div>Loading....</div>}>
            <UI 
                Companies={ Companies }
                Locations={ Locations }
                SubLocations={ SubLocations }
                // Categories={ Categories }
                ShowResults={ ShowResults }
                SubCategories={ SubCategories }
                SubCategory={ SubCategory }
                Category={ Category }
                Type={ Type }
                Attributes={ Attributes }
                NewAttribute={ NewAttribute }
                AttrType={ AttrType }
                AttachedDC={ AttachedDC }
                VendorSearch={ VendorSearch }
                DescriptionSearch={ DescriptionSearch }
                DeliveryChallans={ DeliveryChallans }
                Preview={ Preview }

                setAttributes={ setAttributes }
                onFileSelection={ ( e ) => onFileSelection( e, Preview, setPreview ) }
                onCreateProduct={ (e) => onCreateProduct( e, history, Preview, Category, SubCategory, Type, AttachedDC, SubCategories, Attributes ) }
                setDescriptionSearch={ setDescriptionSearch }
                setVendorSearch={ setVendorSearch }
                setAttachedDC={ setAttachedDC }
                setAttrType={ setAttrType }
                onAddAttribute={ (e) => onAddAttribute( e, Attributes, setAttributes ) }
                setNewAttribute={ setNewAttribute }
                selectSubCategory={ (index) => selectSubCategory( index, SubCategories, setCategory, setSubCategory, setType ) }
                setCategory={ setCategory }
                searchSubCategories={ (e) => searchSubCategories(e, setSubCategories, setSubCategory, setType, setCategory) }
                setShowResults={ setShowResults }
                setType={ setType }
                GetSubLocations={ (location_code) => GetSubLocations(location_code, setSubLocations) }
            />
        </Suspense>
    )
}

export default Create;