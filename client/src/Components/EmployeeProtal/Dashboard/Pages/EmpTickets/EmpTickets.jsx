/* eslint-disable react-hooks/exhaustive-deps */
import React, { lazy, Suspense, useEffect, useState } from "react";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import $ from 'jquery';

import { GetCompanies, issueTicket, acceptAssignedTask, loadEmpGrowthReviewData, loadGrowthReviewData, loadGrowthReviewDetails, loadSelfAssessmentData, loadSelfAssessmentDetails, loadSeniors, loadSubordinates, loadTicketIssued, loadSubordinatesForGrowthReview, setInCompleteTask, setCompleteTask, loadAllSelfSubmissions, loadPeers, loadEmpPeerReview, loadPeerReviewDetails, rejectAssignedTask, addRow, loadAllTickets, deleteTicket, enterReply, addNewCategory, updateCategory } from './Functions';
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
const UI = lazy(() => import('./UI'));

const EmpTickets = () => {
    
    const AccessControls = useSelector( ( state ) => state.EmpAuth.EmployeeData );
    const history = useHistory();
    const today = new Date();
    const quarter = Math.floor((today.getMonth() + 3) / 3);
    const nextQuarter = Math.floor((today.getMonth() + 3) / 3) === 4 ? 1 : (Math.floor((today.getMonth() + 3) / 3) + 1);

    const [ Status, setStatus ] = useState('performance_review');
    const [ Keyword, setKeyword ] = useState('');
    const [ Ticket, setTicket ] = useState();
    const [ Employee, setEmployee ] = useState();
    const [ Selected, setSelected ] = useState(true);
    const [ SubmitConfirm, setSubmitConfirm ] = useState(false);
    const [ Content, setContent ] = useState(<></>);
    const [ Employees, setEmployees ] = useState();
    const [ List, setList ] = useState();
    const [ Companies, setCompanies ] = useState([]);
    const [ PeerReviewData, setPeerReviewData ] = useState();
    const [ SelfAssessmentData, setSelfAssessmentData ] = useState();
    const [ GrowthReviewData, setGrowthReviewData ] = useState();
    const [ EmpGrowthReviewData, setEmpGrowthReviewData ] = useState();
    const [ SelfAssessmentDetails, setSelfAssessmentDetails ] = useState();
    const [ GrowthReviewDetails, setGrowthReviewDetails ] = useState();
    const [ SelfSubmissions, setSelfSubmissions ] = useState();
    const [ PeerReviewDetails, setPeerReviewDetails ] = useState();
    const [ AllTickets, setAllTickets ] = useState();
    const [ GrowthCategories, setGrowthCategories ] = useState();

    useEffect(
        () => {
            if ( Employee )
            {
                setKeyword(Employee.name);
                setTimeout(() => {
                    setSelected(true);
                }, 200);
            }
        }, [ Employee ]
    )
    useEffect(
        () => {
            if ( Keyword.length > 0 )
            {
                setSelected(false);
            }
        }, [ Keyword ]
    )
    useEffect(
        () => {
            GetCompanies(setCompanies);
            if ( sessionStorage.getItem('ACRView') )
            {
                setStatus(sessionStorage.getItem('ACRView'));
            }
        }, []
    )

    return (
        <>
            <Suspense fallback={<div>Loading....</div>}>
                <UI 
                    Ticket={ Ticket }
                    Employees={ Employees } 
                    Keyword={ Keyword }
                    Selected={ Selected }
                    Content={ Content }
                    SubmitConfirm={ SubmitConfirm }
                    List={ List }
                    Status={ Status }
                    SelfAssessmentData={ SelfAssessmentData }
                    Companies={ Companies }
                    AccessControls={ AccessControls }
                    SelfAssessmentDetails={ SelfAssessmentDetails }
                    GrowthReviewData={ GrowthReviewData } 
                    SelfSubmissions={ SelfSubmissions }
                    EmpGrowthReviewData={ EmpGrowthReviewData }
                    GrowthReviewDetails={ GrowthReviewDetails }
                    PeerReviewData={ PeerReviewData }
                    PeerReviewDetails={ PeerReviewDetails }
                    nextQuarter={ nextQuarter }
                    AllTickets={ AllTickets }
                    GrowthCategories={ GrowthCategories }

                    updateCategory={(e, id, setCategoryModal) => updateCategory(e, id, setCategoryModal, setGrowthCategories)}
                    addNewCategory={ (e, setCategoryModal) => addNewCategory(e, setGrowthCategories, setCategoryModal) }
                    enterReply={ (ticket_id, reply, generated_by, emp_id, generated_date) => enterReply( ticket_id, reply, generated_by, emp_id, generated_date, setList ) }
                    deleteTicket={ (data, allTickets, setConfirmRemoval) => deleteTicket(data, allTickets, setConfirmRemoval, setList, setAllTickets) } 
                    loadAllTickets={ () => loadAllTickets( setAllTickets ) }
                    setList={ setList }
                    addRow={ (e, category) => addRow( e, category, List, setList ) }
                    loadPeerReviewDetails={ (id) => loadPeerReviewDetails( id, setPeerReviewDetails ) }
                    loadEmpPeerReview={ () => loadEmpPeerReview( setPeerReviewData ) }
                    loadAllSubmissions={ () => loadAllSelfSubmissions( setSelfSubmissions ) }
                    setCompleteTask={ ( e, task_id, review_id, setConfirmAction, setActionContent, confirmed ) => setCompleteTask( e, task_id, review_id, setGrowthReviewDetails, setConfirmAction, setActionContent, setGrowthCategories, confirmed ) }
                    setInCompleteTask={ ( e, task_id, review_id, setConfirmAction, setActionContent, confirmed ) => setInCompleteTask( e, task_id, review_id, setGrowthReviewDetails, setConfirmAction, setActionContent, setGrowthCategories, confirmed ) }
                    rejectAssignedTask={ ( e, task_id, review_id, setConfirmAcceptance, setAcceptanceContent ) => rejectAssignedTask( e, task_id, review_id, setGrowthReviewDetails, setConfirmAcceptance, setAcceptanceContent, setGrowthCategories ) }
                    acceptAssignedTask={ ( task_id, review_id, setConfirmAcceptance, setAcceptanceContent ) => acceptAssignedTask( task_id, review_id, setGrowthReviewDetails, setConfirmAcceptance, setAcceptanceContent, setGrowthCategories ) }
                    loadGrowthReviewDetails={ (id) => loadGrowthReviewDetails( id, setGrowthReviewDetails, setGrowthCategories ) }
                    loadSelfAssessmentDetails={ (id) => loadSelfAssessmentDetails( id, setSelfAssessmentDetails ) }
                    setStatus={ setStatus }
                    loadTicketIssued={ () => loadTicketIssued( setList ) }
                    setSubmitConfirm={ setSubmitConfirm }
                    issueTicket={ ( e ) => issueTicket( e, Ticket, Employee, history, setContent, setSubmitConfirm ) }
                    setEmployee={ setEmployee }
                    setKeyword={ setKeyword }
                    setTicket={ setTicket }
                    loadSubordinatesForGrowthReview={ () => loadSubordinatesForGrowthReview( quarter, setEmployees ) }
                    loadPeers={ () => loadPeers( quarter, setEmployees ) }
                    loadSubordinates={ () => loadSubordinates( AccessControls, setEmployees ) }
                    loadSeniors={ () => loadSeniors( setEmployees ) }
                    loadSelfAssessmentData={ () => loadSelfAssessmentData( setSelfAssessmentData ) }
                    loadGrowthReviewData={ () => loadGrowthReviewData( setGrowthReviewData ) }
                    loadEmpGrowthReviewData={ () => loadEmpGrowthReviewData( setEmpGrowthReviewData ) }
                />
            </Suspense>
            <ToastContainer />
        </>
    )

}
export default EmpTickets;