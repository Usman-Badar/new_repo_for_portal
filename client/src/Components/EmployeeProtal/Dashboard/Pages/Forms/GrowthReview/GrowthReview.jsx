import React, { lazy, Suspense, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import $ from 'jquery';
import { addRow, ApproveRequisition, RejectRequisition, CancelRequisition, openRequestDetails, loadRequests, GetLocations, PRSubmittion, SubmitPR, onAttachQuotations, GetCompanies, onContentInput, onContentEdit, onSearchEmployees, loadHods, sendForApproveRequisition, InvRejectRequisition } from './Functions';
import { useSelector } from 'react-redux';
const UI = lazy( () => import('./UI') );

function PurchaseRequisition() {

    const history = useHistory();
    const Relations = useSelector((state) => state.EmpAuth.Relations);
    const AccessControls = useSelector( ( state ) => state.EmpAuth.EmployeeData );

    const [ ShowQuotationModal, setShowQuotationModal ] = useState(false);
    const [ SubmitConfirmation, setSubmitConfirmation ] = useState(false);
    const [ Quotations, setQuotations ] = useState([]);
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
    const [ FilterAmount, setFilterAmount ] = useState(0);
    const [ Employees, setEmployees ] = useState();
    const [ Employee, setEmployee ] = useState();
    const [ HodList, setHodList ] = useState();

    useEffect(
        () => {

            GetCompanies( setCompanies );
            GetLocations( setLocations );

        }, []
    )

    useEffect(
        () => {

            if ( Requests )
            {
                let names = [];
                for ( let x = 0; x < Requests.length; x++ )
                {
                    if ( !names.includes( Requests[x].company_name ) )
                    {
                        names.push(Requests[x].company_name);
                    }
                }

                setLoadedCompanies( names );
            }

        // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [ Requests ]
    )
    
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
                    Relations={ Relations }
                    
                    loadHods={ () => loadHods(setHodList) }
                    selectEmpInBehalf={ ( emp_id, name ) => { setEmployee( emp_id ); setEmployees(); $('#search_emps').val(name) } }
                    onSearchEmployees={ ( e ) => onSearchEmployees( e, setEmployees, setEmployee ) }
                    setFilterAmount={ setFilterAmount }
                    setFilterCompany={ setFilterCompany }
                    setSpecKeyword={ setSpecKeyword }
                    addRow={ addRow }
                    openRequestDetails={ ( pr_id ) => openRequestDetails( AccessControls, pr_id, setRequestDetails, setSpecifications, setAttachedQuotations ) }
                    PRSubmittion={ ( e ) => PRSubmittion( e, history, toast, Quotations, Data, Employee ) }
                    SubmitPR={ ( e ) => SubmitPR( e, setData, setSubmitConfirmation ) }
                    setSubmitConfirmation={ setSubmitConfirmation }
                    onAttachQuotations={ ( e ) => onAttachQuotations( e, setQuotations ) }
                    setShowQuotationModal={ setShowQuotationModal }
                    onContentEdit={ onContentEdit }
                    onContentInput={ onContentInput }
                    loadRequests={ () => loadRequests( setRequests ) }
                    CancelRequisition={ ( e, pr_id ) => CancelRequisition( e, pr_id, history ) }
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