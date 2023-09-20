import React, { lazy, Suspense, useState } from 'react';
import { createVendor, editVender, getDetails, GetVenders, loadRelatedPOs, removeVender, sendCode, verifyVendor } from './Functions';

const UI = lazy( () => import('./UI') );

const VendorsComponent = () => {

    const [ PurchaseOrders, setPurchaseOrders ] = useState();
    const [ VendorDetails, setVendorDetails ] = useState();
    const [ Edit, setEdit ] = useState();
    const [ RemovalConfirm, setRemovalConfirm ] = useState();
    const [ OpenFormModal, setOpenFormModal ] = useState(false);
    const [ VerificationProcess, setVerificationProcess ] = useState(false);
    const [ Venders, setVenders ] = useState([]);
    const [ FilterName, setFilterName ] = useState('');
    const [ FilterAddress, setFilterAddress ] = useState('');
    const [ FilterPhone, setFilterPhone ] = useState('');
    const [ FilterNTN, setFilterNTN ] = useState('');

    return (
        <>
            <Suspense fallback={ <div>Loading...</div> }>
                <UI 
                    Venders={ Venders }
                    OpenFormModal={ OpenFormModal }
                    RemovalConfirm={ RemovalConfirm }
                    Edit={ Edit }
                    FilterName={ FilterName }
                    FilterAddress={ FilterAddress }
                    FilterPhone={ FilterPhone }
                    FilterNTN={ FilterNTN }
                    PurchaseOrders={ PurchaseOrders }
                    VendorDetails={ VendorDetails }
                    VerificationProcess={ VerificationProcess }

                    sendCode={ sendCode }
                    verifyVendor={ (e) => verifyVendor( e, VendorDetails, setVerificationProcess, setVendorDetails ) }
                    setVerificationProcess={ setVerificationProcess }
                    getDetails={ () => getDetails( setVendorDetails ) }
                    setEdit={ setEdit }
                    setFilterName={ setFilterName }
                    setFilterAddress={ setFilterAddress }
                    setFilterPhone={ setFilterPhone }
                    setFilterNTN={ setFilterNTN }
                    editVender={ ( index ) => editVender( VendorDetails, index, Venders, setEdit, setOpenFormModal ) }
                    setRemovalConfirm={ setRemovalConfirm }
                    removeVender={( index ) => removeVender( index, Venders, setRemovalConfirm, setVenders )  }
                    createVendor={ ( e ) => createVendor( e, VendorDetails, Edit, setEdit, setVendorDetails, setOpenFormModal, setVenders ) }
                    setOpenFormModal={ setOpenFormModal }
                    GetVenders={ () => GetVenders(setVenders) }
                    loadRelatedPOs={ () => loadRelatedPOs( setPurchaseOrders ) }
                />
            </Suspense>
        </>
    );

}

export default VendorsComponent;