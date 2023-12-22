/* eslint-disable react-hooks/exhaustive-deps */
import React, { lazy, Suspense, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { loadPRList, addRow, SubTotalCostCalculation, TotalCostCalculation, ApproveRequisition, RejectRequisition, CancelRequisition, openRequestDetails, loadRequests, GetLocations, POSubmittion, SubmitPO, onAttachBills, GetCompanies, onContentInput, searchVendor, addAdditionalRow, onFooterContentInput, loadSubOrdinands, updatePO, POUpdate, overrideRequisition, unApproveRequest } from './Functions';
import { useSelector } from 'react-redux';
const UI = lazy( () => import('./UI') );

function PurchaseOrder() {

    const AccessControls = useSelector( ( state ) => state.EmpAuth.EmployeeData );
    const history = useHistory();

    const [ AccessDefined, setAccessDefined ] = useState(false);
    const [ Admin, setAdmin ] = useState(false);
    const [ CompanyViewer, setCompanyViewer ] = useState(false);
    const [ ShowBillModal, setShowBillModal ] = useState(false);
    const [ SubmitConfirmation, setSubmitConfirmation ] = useState(false);
    const [ EditConfirmation, setEditConfirmation ] = useState(false);
    const [ Bills, setBills ] = useState([]);
    const [ AttachedBills, setAttachedBills ] = useState([]);
    const [ RemovedBills, setRemovedBills ] = useState([]);
    const [ Companies, setCompanies ] = useState([]);
    const [ Locations, setLocations ] = useState([]);
    const [ Specifications, setSpecifications ] = useState([]);
    const [ EditedSpecifications, setEditedSpecifications ] = useState([]);
    const [ Data, setData ] = useState();
    const [ PRAttachment, setPRAttachment ] = useState();
    const [ Vendors, setVendors ] = useState();
    const [ Vendor, setVendor ] = useState();
    const [ Requests, setRequests ] = useState();
    const [ PRList, setPRList ] = useState();
    const [ PR, setPR ] = useState();
    const [ PRCode, setPRCode ] = useState();
    const [ SPRSpecifications, setSPRSpecifications ] = useState();
    const [ RequestDetails, setRequestDetails ] = useState();
    const [ AdditionalRows, setAdditionalRows ] = useState();
    const [ SubOrdinands, setSubOrdinands ] = useState();
    const [ PRequestDetails, setPRequestDetails ] = useState();
    const [ PRSpecifications, setPRSpecifications ] = useState([]);
    const [ LoadedCompanies, setLoadedCompanies ] = useState();
    const [ FilterCompany, setFilterCompany ] = useState('');
    const [ FilterPRCompany, setFilterPRCompany ] = useState('');
    const [ SpecKeyword, setSpecKeyword ] = useState('');
    const [ FilterAmount, setFilterAmount ] = useState('');
    const [ Status, setStatus ] = useState('');
    const [ RequestStatuses, setRequestStatuses ] = useState([]);

    useEffect(
        () => {
            GetCompanies( setCompanies );
            GetLocations( setLocations );
        }, []
    )

    useEffect(
        () => {
            let accessKey = false;
            let companyViewer = false;
            if ( AccessControls )
            {
                for ( let y = 0; y < JSON.parse(AccessControls.access).length; y++ )
                {
                    if ( parseInt(JSON.parse(AccessControls.access)[y]) === 0 || parseInt(JSON.parse(AccessControls.access)[y]) === 43 )
                    {
                        accessKey = true;
                    }
                    if ( parseInt(JSON.parse(AccessControls.access)[y]) === 53 )
                    {
                        companyViewer = true;
                    }
                }
            }
            setCompanyViewer(companyViewer);
            setAccessDefined(true);
            setAdmin(accessKey);
        }, [AccessControls]
    )

    useEffect(
        () => {

            if ( PRAttachment && !PRList )
            {
                loadPRList( setPRList );
            }

        }, [ PRAttachment ]
    )

    useEffect(
        () => {

            if ( Requests )
            {
                let names = [];
                let statuses = [];
                for ( let x = 0; x < Requests.length; x++ )
                {
                    if ( !names.includes( Requests[x].company_name ) )
                    {
                        names.push(Requests[x].company_name);
                    }
                    if ( !statuses.includes(Requests[x].status) )
                    {
                        statuses.push(Requests[x].status.toLowerCase());
                    }
                }

                setRequestStatuses(statuses);
                setLoadedCompanies( names );

                if ( window.location.href.includes('?view=') )
                {
                    setStatus(window.location.href.split('?view=').pop().toLowerCase());
                }else
                if (sessionStorage.getItem('POStatus'))
                {
                    setStatus(sessionStorage.getItem('POStatus'));
                }
            }

        // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [ Requests ]
    )

    useEffect(
        () => {
            if ( sessionStorage.getItem('FilterCompany') && sessionStorage.getItem('FilterCompany') !== '' )
            {
                setFilterCompany(sessionStorage.getItem('FilterCompany'));
            }
            if ( sessionStorage.getItem('FilterPRCompany') && sessionStorage.getItem('FilterPRCompany') !== '' )
            {
                setFilterPRCompany(sessionStorage.getItem('FilterPRCompany'));
            }
            if ( sessionStorage.getItem('SpecKeyword') && sessionStorage.getItem('SpecKeyword') !== '' )
            {
                setSpecKeyword(sessionStorage.getItem('SpecKeyword'));
            }
            if ( sessionStorage.getItem('FilterAmount') && sessionStorage.getItem('FilterAmount') !== '' )
            {
                setFilterAmount(parseFloat(sessionStorage.getItem('FilterAmount')));
            }
        }, []
    );
    
    return (
        <>
            <Suspense fallback={ <div>Please Wait...</div> }>
                <UI 
                    Companies={ Companies }
                    Locations={ Locations }
                    Bills={ Bills }
                    ShowBillModal={ ShowBillModal }
                    SubmitConfirmation={ SubmitConfirmation }
                    EditConfirmation={ EditConfirmation }
                    Requests={ Requests }
                    history={ history }
                    RequestDetails={ RequestDetails }
                    Specifications={ Specifications }
                    AttachedBills={ AttachedBills }
                    Vendors={ Vendors }
                    PRAttachment={ PRAttachment }
                    PRList={ PRList }
                    PR={ PR }
                    AdditionalRows={ AdditionalRows }
                    PRequestDetails={ PRequestDetails }
                    PRSpecifications={ PRSpecifications }
                    SubOrdinands={ SubOrdinands }
                    Data={ Data }
                    Vendor={ Vendor }
                    LoadedCompanies={ LoadedCompanies }
                    FilterCompany={ FilterCompany }
                    SpecKeyword={ SpecKeyword }
                    FilterAmount={ FilterAmount }
                    FilterPRCompany={ FilterPRCompany }
                    PRCode={ PRCode }
                    SPRSpecifications={ SPRSpecifications }
                    Admin={ Admin }
                    CompanyViewer={ CompanyViewer }
                    AccessDefined={ AccessDefined }
                    RemovedBills={ RemovedBills }
                    Status={ Status }
                    RequestStatuses={ RequestStatuses }

                    unApproveRequest={ (e, po_id, requested_by) => unApproveRequest(e, po_id, requested_by, history) }
                    overrideRequisition={ (e, type) => overrideRequisition( e, type, RequestDetails, history ) }
                    setStatus={ setStatus }
                    setRemovedBills={ setRemovedBills }
                    setBills={ setBills }
                    setFilterPRCompany={ (val) => { setFilterPRCompany(val); sessionStorage.setItem('FilterPRCompany', val) } }
                    setSpecKeyword={ (val) => { setSpecKeyword(val); sessionStorage.setItem('SpecKeyword', val) } }
                    setFilterAmount={ (val) => { setFilterAmount(val); sessionStorage.setItem('FilterAmount', val) } }
                    setFilterCompany={ (val) => { setFilterCompany(val); sessionStorage.setItem('FilterCompany', val) } }
                    setEditConfirmation={ setEditConfirmation }
                    SubTotalCostCalculation={ SubTotalCostCalculation }
                    TotalCostCalculation={ TotalCostCalculation }
                    loadSubOrdinands={ () => loadSubOrdinands( setSubOrdinands ) }
                    onFooterContentInput={ onFooterContentInput }
                    addAdditionalRow={ addAdditionalRow }
                    attachPR={ ( pr_id, pr_code, specifications ) => { setPRCode(pr_code); setPR( pr_id ); setPRAttachment(false); setSPRSpecifications(specifications); } }
                    setPRAttachment={ setPRAttachment }
                    selectVendor={ ( vendor_id, name ) => { document.getElementById('vendor_id').value = name; setVendor( vendor_id ); setVendors(); } }
                    searchVendor={ ( e ) => searchVendor( e, setVendors, setVendor ) }
                    addRow={ addRow }
                    openRequestDetails={ ( po_id, edit ) => openRequestDetails( po_id, edit, setRequestDetails, setSpecifications, setAttachedBills, setAdditionalRows, setPRequestDetails, setPRSpecifications, setBills, setPR, setPRCode, setSPRSpecifications ) }
                    POSubmittion={ ( e ) => POSubmittion( e, history, Bills, Data, PR, Vendor, Specifications ) }
                    POUpdate={ ( e ) => POUpdate( e, history, Data, Vendor, EditedSpecifications, Bills, RemovedBills, PR ) }
                    SubmitPO={ ( e ) => SubmitPO( e, setData, setSubmitConfirmation, setSpecifications ) }
                    updatePO={ ( e ) => updatePO( e, setData, setEditConfirmation, setEditedSpecifications ) }
                    setSubmitConfirmation={ setSubmitConfirmation }
                    onAttachBills={ ( e ) => onAttachBills( e, Bills, setBills ) }
                    setShowBillModal={ setShowBillModal }
                    onContentInput={ onContentInput }
                    loadRequests={ () => loadRequests( AccessControls.companies, CompanyViewer, Admin, setRequests ) }
                    CancelRequisition={ ( e, po_id ) => CancelRequisition( e, po_id, history, RequestDetails ) }
                    ApproveRequisition={ ( e, po_id, requested_by ) => ApproveRequisition( e, po_id, requested_by, history ) }
                    RejectRequisition={ ( e, po_id, requested_by, Specifications ) => RejectRequisition( e, po_id, requested_by, Specifications, history ) }
                />
            </Suspense>
        </>
    );

}

export default PurchaseOrder;