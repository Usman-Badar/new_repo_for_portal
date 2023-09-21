import React, { lazy, Suspense, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import $ from 'jquery';
import { addRow, ApproveRequisition, RejectRequisition, CancelRequisition, openRequestDetails, loadRequests, GetLocations, PRSubmittion, SubmitPR, onAttachQuotations, GetCompanies, onContentInput, onContentEdit, onSearchEmployees, loadHods, sendForApproveRequisition, InvRejectRequisition, updatePR, PRUpdate, TotalCostCalculation, overrideRequisition, SiteManagerApprovalConfirm, SiteManagerRejectionConfirm } from './Functions';
import { useSelector } from 'react-redux';
const UI = lazy( () => import('./UI') );

function PurchaseRequisition() {

    const history = useHistory();
    const Relations = useSelector((state) => state.EmpAuth.Relations);
    const AccessControls = useSelector( ( state ) => state.EmpAuth.EmployeeData );

    const [ EditConfirmation, setEditConfirmation ] = useState(false);
    const [ AccessDefined, setAccessDefined ] = useState(false);
    const [ Admin, setAdmin ] = useState(false);
    const [ CompanyViewer, setCompanyViewer ] = useState(false);
    const [ ShowQuotationModal, setShowQuotationModal ] = useState(false);
    const [ SubmitConfirmation, setSubmitConfirmation ] = useState(false);
    const [ Quotations, setQuotations ] = useState([]);
    const [ RemovedQuotations, setRemovedQuotations ] = useState([]);
    const [ AttachedQuotations, setAttachedQuotations ] = useState([]);
    const [ Companies, setCompanies ] = useState([]);
    const [ Locations, setLocations ] = useState([]);
    const [ Specifications, setSpecifications ] = useState([]);
    const [ Data, setData ] = useState();
    const [ Requests, setRequests ] = useState();
    const [ RequestDetails, setRequestDetails ] = useState();
    const [ LoadedCompanies, setLoadedCompanies ] = useState();
    const [ FilterCompany, setFilterCompany ] = useState('');
    const [ SpecKeyword, setSpecKeyword ] = useState('');
    const [ FilterAmount, setFilterAmount ] = useState(-100000);
    const [ Employees, setEmployees ] = useState();
    const [ Employee, setEmployee ] = useState();
    const [ HodList, setHodList ] = useState();
    const [ EditedSpecifications, setEditedSpecifications ] = useState([]);
    const [ Status, setStatus ] = useState('');
    const [ RequestStatuses, setRequestStatuses ] = useState([]);
    const [ Logs, setLogs ] = useState([]);

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
                    if ( parseInt(JSON.parse(AccessControls.access)[y]) === 0 || parseInt(JSON.parse(AccessControls.access)[y]) === 44 )
                    {
                        accessKey = true;
                    }
                    if ( parseInt(JSON.parse(AccessControls.access)[y]) === 54 )
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
                if (sessionStorage.getItem('PRStatus'))
                {
                    setStatus(sessionStorage.getItem('PRStatus'));
                }
            }

        // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [ Requests ]
    )

    useEffect(
        () => {
            if ( sessionStorage.getItem('PR_FilterCompany') && sessionStorage.getItem('PR_FilterCompany') !== '' )
            {
                setFilterCompany(sessionStorage.getItem('PR_FilterCompany'));
            }
            if ( sessionStorage.getItem('PR_SpecKeyword') && sessionStorage.getItem('PR_SpecKeyword') !== '' )
            {
                setSpecKeyword(sessionStorage.getItem('PR_SpecKeyword'));
            }
            if ( sessionStorage.getItem('PR_FilterAmount') && sessionStorage.getItem('PR_FilterAmount') !== '' )
            {
                setFilterAmount(parseFloat(sessionStorage.getItem('PR_FilterAmount')));
            }
        }, []
    );
    
    return (
        <>
            <Suspense fallback={ <div>Please Wait...</div> }>
                <UI 
                    Companies={ Companies }
                    Locations={ Locations }
                    Quotations={ Quotations }
                    ShowQuotationModal={ ShowQuotationModal }
                    SubmitConfirmation={ SubmitConfirmation }
                    Requests={ Requests }
                    history={ history }
                    RequestDetails={ RequestDetails }
                    Specifications={ Specifications }
                    AttachedQuotations={ AttachedQuotations }
                    LoadedCompanies={ LoadedCompanies }
                    FilterCompany={ FilterCompany }
                    SpecKeyword={ SpecKeyword }
                    FilterAmount={ FilterAmount }
                    AccessControls={ AccessControls }
                    Employees={ Employees }
                    Employee={ Employee }
                    HodList={ HodList }
                    Data={ Data }
                    Admin={ Admin }
                    Relations={ Relations }
                    EditConfirmation={ EditConfirmation }
                    AccessDefined={ AccessDefined }
                    RemovedQuotations={ RemovedQuotations }
                    Status={ Status }
                    RequestStatuses={ RequestStatuses }
                    Logs={ Logs }
                    CompanyViewer={ CompanyViewer }
                    
                    SiteManagerRejectionConfirm={ ( e, pr_id, requested_by, Specifications ) => SiteManagerRejectionConfirm( e, pr_id, requested_by, Specifications, history, (RequestDetails?.company_short_code + '-' + RequestDetails?.series_year + '-' + RequestDetails?.series_code) ) }
                    SiteManagerApprovalConfirm={ ( e, pr_id, requested_by, Specifications ) => SiteManagerApprovalConfirm( e, pr_id, requested_by, Specifications, history, (RequestDetails?.company_short_code + '-' + RequestDetails?.series_year + '-' + RequestDetails?.series_code) ) }
                    overrideRequisition={ (e, type) => overrideRequisition( e, type, RequestDetails, history ) }
                    TotalCostCalculation={ TotalCostCalculation }
                    setStatus={ setStatus }
                    setRemovedQuotations={ setRemovedQuotations }
                    setQuotations={ setQuotations }
                    setEditConfirmation={ setEditConfirmation }
                    loadHods={ () => loadHods(setHodList) }
                    selectEmpInBehalf={ ( emp_id, name ) => { setEmployee( emp_id ); setEmployees(); $('#search_emps').val(name) } }
                    onSearchEmployees={ ( e ) => onSearchEmployees( e, setEmployees, setEmployee ) }
                    setSpecKeyword={ (val) => { setSpecKeyword(val); sessionStorage.setItem('PR_SpecKeyword', val) } }
                    setFilterAmount={ (val) => { setFilterAmount(val); sessionStorage.setItem('PR_FilterAmount', val) } }
                    setFilterCompany={ (val) => { setFilterCompany(val); sessionStorage.setItem('PR_FilterCompany', val) } }
                    addRow={ addRow }
                    openRequestDetails={ ( pr_id ) => openRequestDetails( AccessControls, pr_id, setRequestDetails, setSpecifications, setAttachedQuotations, setQuotations, setLogs ) }
                    PRSubmittion={ ( e ) => PRSubmittion( e, history, toast, Quotations, Data, Employee, AccessControls ) }
                    PRUpdate={ ( e ) => PRUpdate( e, RequestDetails, history, Data, EditedSpecifications, Quotations, RemovedQuotations, Logs, Specifications ) }
                    updatePR={ ( e ) => updatePR( e, RequestDetails, setData, setEditConfirmation, setEditedSpecifications, setLogs ) }
                    SubmitPR={ ( e ) => SubmitPR( e, setData, setSubmitConfirmation ) }
                    setSubmitConfirmation={ setSubmitConfirmation }
                    onAttachQuotations={ ( e ) => onAttachQuotations( e, Quotations, setQuotations ) }
                    setShowQuotationModal={ setShowQuotationModal }
                    onContentEdit={ onContentEdit }
                    onContentInput={ onContentInput }
                    loadRequests={ () => loadRequests( AccessControls.companies, CompanyViewer, Admin, setRequests ) }
                    CancelRequisition={ ( e, pr_id ) => CancelRequisition( e, pr_id, history, RequestDetails ) }
                    ApproveRequisition={ ( e, pr_id, requested_by, submitted_to ) => ApproveRequisition( e, pr_id, requested_by, submitted_to, history ) }
                    sendForApproveRequisition={ ( e, pr_id, requested_by, submitted_to ) => sendForApproveRequisition( e, pr_id, requested_by, submitted_to, history, toast, Specifications ) }
                    RejectRequisition={ ( e, pr_id, requested_by, Specifications ) => RejectRequisition( e, pr_id, requested_by, Specifications, history ) }
                    InvRejectRequisition={ ( e, pr_id, requested_by, Specifications ) => InvRejectRequisition( e, pr_id, requested_by, Specifications, history ) }
                />
            </Suspense>
            <ToastContainer />
        </>
    );

}

export default PurchaseRequisition;