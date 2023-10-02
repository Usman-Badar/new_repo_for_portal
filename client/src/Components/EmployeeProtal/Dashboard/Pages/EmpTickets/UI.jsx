/* eslint-disable eqeqeq */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useLayoutEffect, useState } from "react";
import './UI.css';

import moment from "moment";
import JSAlert from 'js-alert';
import FolderIcon from '../../../../../images/vector-folder-icon.png';
import $ from 'jquery';
import { Route, Switch, useHistory } from 'react-router-dom';
import loading from '../../../../../images/loadingIcons/icons8-iphone-spinner.gif';
import Modal from '../../../../UI/Modal/Modal';
import BreadCrumb from "../../Components/BreadCrumb";
import axios from "../../../../../axios";
// import Joyride, { STATUS } from 'react-joyride';

import ReactTooltip from 'react-tooltip';

const UI = ( { GrowthCategories, addNewCategory, enterReply, deleteTicket, loadAllTickets, AllTickets, nextQuarter, setList, addRow, rejectAssignedTask, loadPeerReviewDetails, PeerReviewDetails, PeerReviewData, loadEmpPeerReview, loadPeers, SelfSubmissions, loadAllSubmissions, setCompleteTask, loadSubordinatesForGrowthReview, GrowthReviewDetails, loadGrowthReviewDetails, EmpGrowthReviewData, GrowthReviewData, setInCompleteTask, acceptAssignedTask, loadGrowthReviewData, Companies, loadEmpGrowthReviewData, SelfAssessmentDetails, SelfAssessmentData, Status, AccessControls, List, Content, SubmitConfirm, loadSelfAssessmentData, loadSubordinates, setSubmitConfirm, issueTicket, Selected, loadSelfAssessmentDetails, Keyword, Employees, Ticket, loadTicketIssued, loadSeniors, setTicket, setEmployee, setStatus, setKeyword } ) => {
    
    const today = new Date();
    const quarter = Math.floor((today.getMonth() + 3) / 3);
    const history = useHistory();
    useLayoutEffect(
        () => {
            $('.EmpTickets_container .tickets__selection_container .ticket').on(
                'click', (e) => {

                    $('.EmpTickets_container .tickets__selection_container .ticket').removeClass('active');
                    $('.EmpTickets_container .tickets__selection_container .ticket .la-check').remove();

                    let icon = document.createElement('i');
                    icon.className = 'las la-check';
                    if ( e.target.className === "ticket" )
                    {
                        $(e.target).addClass('active');
                        $(e.target).append(icon);
                    }else
                    {
                        $(e.target.parentElement).addClass('active');
                        $(e.target.parentElement).append(icon);
                    }

                }
            )
        }, []
    );

    return (
        <div className="ticket page">
            <Modal show={ SubmitConfirm } Hide={ () => setSubmitConfirm(!SubmitConfirm) } content={ Content } />
            <Switch>
                <Route exact path="/acr/options" render={ 
                        () => <SelectOption
                            history={ history }
                            Companies={ Companies }
                            List={ List }
                            Status={ Status }
                            SelfAssessmentData={ SelfAssessmentData }
                            quarter={ quarter }
                            AccessControls={ AccessControls }
                            Employees={ Employees }
                            SelfSubmissions={ SelfSubmissions }
                            EmpGrowthReviewData={ EmpGrowthReviewData }
                            AllTickets={ AllTickets }
                            
                            enterReply={ enterReply }
                            deleteTicket={ deleteTicket }
                            loadAllTickets={ loadAllTickets }
                            loadPeers={ loadPeers }
                            loadAllSubmissions={ loadAllSubmissions }
                            loadSubordinatesForGrowthReview={ loadSubordinatesForGrowthReview }
                            loadEmpGrowthReviewData={ loadEmpGrowthReviewData }
                            loadSubordinates={ loadSubordinates }
                            loadSelfAssessmentData={ loadSelfAssessmentData }
                            setStatus={ setStatus }
                            loadTicketIssued={ loadTicketIssued }
                        />
                    } 
                />
                <Route exact path="/acr/form/issue-to-subordinates" render={ 
                        () => <IssueToSubordinates
                            history={ history }
                            Ticket={ Ticket }
                            Keyword={ Keyword }
                            Employees={ Employees }
                            Selected={ Selected }
                            issueTicket={ issueTicket }

                            setEmployee={ setEmployee }
                            setKeyword={ setKeyword }
                            loadSubordinates={ loadSubordinates }
                            setTicket={ setTicket }
                        />
                    } 
                />
                <Route exact path="/acr/form/junior-review" render={ 
                        () => <JuniorReview
                            history={ history }
                            Ticket={ Ticket }
                            Employees={ Employees }
                            issueTicket={ issueTicket }

                            setEmployee={ setEmployee }
                            loadSeniors={ loadSeniors }
                            setTicket={ setTicket }
                        />
                    } 
                />
                <Route exact path="/acr/form/peer-review" render={ 
                        () => <>
                            <h4 className="text-center font-weight-bold">Coming Soon....</h4>
                            <hr />
                            <button className="btn submit d-block mx-auto" onClick={ () => history.replace('/acr/options') }>Back</button>
                        </>
                    } 
                />
                <Route exact path="/acr/form/self-review" render={ 
                        () => <>
                            <h4 className="text-center font-weight-bold">Coming Soon....</h4>
                            <hr />
                            <button className="btn submit d-block mx-auto" onClick={ () => history.replace('/acr/options') }>Back</button>
                        </>
                    } 
                />
                <Route exact path="/acr/self-assessment/details/:id" render={ 
                        () => <SelfAssessmentDetailsComponent
                            SelfAssessmentDetails={ SelfAssessmentDetails }
                            history={ history }

                            loadSelfAssessmentDetails={ loadSelfAssessmentDetails }
                        />
                    } 
                />
                <Route exact path="/acr/growth-review/new/:emp_id" render={ 
                        () => <EmployeeGrowthReview
                            Companies={ Companies }
                            history={ history }
                            quarter={ quarter }
                            GrowthReviewData={ GrowthReviewData }

                            loadGrowthReviewData={ loadGrowthReviewData }
                        />
                    } 
                />
                <Route exact path="/acr/growth-review/:emp_id" render={ 
                        () => <GrowthReviewDetailsComponent
                            GrowthReviewDetails={ GrowthReviewDetails }
                            history={ history }
                            List={ List }
                            nextQuarter={ nextQuarter }
                            quarter={ quarter }
                            GrowthCategories={ GrowthCategories }

                            addNewCategory={ addNewCategory }
                            setList={ setList }
                            addRow={ addRow }
                            rejectAssignedTask={ rejectAssignedTask }
                            setCompleteTask={ setCompleteTask }
                            setInCompleteTask={ setInCompleteTask }
                            acceptAssignedTask={ acceptAssignedTask }
                            loadGrowthReviewDetails={ loadGrowthReviewDetails }
                        />
                    } 
                />
                <Route exact path="/acr/peer-review/emp/:emp_id" render={ 
                        () => <EmpPeerReview
                            history={ history }
                            quarter={ quarter }
                            PeerReviewData={ PeerReviewData }

                            loadEmpPeerReview={ loadEmpPeerReview }
                        />
                    } 
                />
                <Route exact path="/acr/peer-review/details/:id" render={ 
                        () => <PeerReviewDetailsComponent
                            history={ history }
                            PeerReviewDetails={ PeerReviewDetails }

                            loadPeerReviewDetails={ loadPeerReviewDetails }
                        />
                    } 
                />
            </Switch>
        </div>
    )
}

export default UI;

const PeerReviewDetailsComponent = ({ history, PeerReviewDetails, loadPeerReviewDetails }) => {
    useEffect(
        () => {
            loadPeerReviewDetails(window.location.href.split('/').pop());
        }, []
    );

    if ( !PeerReviewDetails )
    {
        return (
            <div className="ticket_container page-content">
                <img src={loading} alt="loading..." width='50' height='50' className='d-block mx-auto' />
            </div>
        )
    }

    return (
        <>
            <BreadCrumb links={[{label: 'Performance Review', href: '/acr/options'}]} currentLabel={ "Peer Review Details - Quarter " + (PeerReviewDetails.quarter + ' - Year ' + PeerReviewDetails.year) } />
            <div className="ticket_container page-content">
                <div className="d-flex align-items-center justify-content-between">
                    <h3 className="heading">
                        Peer Review Details
                        <sub>Details Of The Submitted Review</sub>
                    </h3>
                    <div>
                        <button className='btn light' onClick={ () => history.goBack() }>Back</button>
                    </div>
                </div>
                <hr />
                <table className="table table-borderless">
                    <tbody>
                        <tr>
                            <td>
                                <b>Submitted By</b><br />
                                <span>{ PeerReviewDetails.name }</span><br />
                            </td>
                            <td>
                                <b>Designation</b><br />
                                <span>{ PeerReviewDetails.designation_name }</span>
                            </td>
                            <td>
                                <b>Company</b><br />
                                <span>{ PeerReviewDetails.company_name }</span>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <b>Submitted Date</b><br />
                                <span>{ moment(PeerReviewDetails.review_date).utc().format('MM-DD-YYYY') }</span>
                            </td>
                            <td>
                                <b>Submitted Time</b><br />
                                <span>{ PeerReviewDetails.review_time }</span>
                            </td>
                            <td>
                                <b>Status</b><br />
                                <span>{ PeerReviewDetails.status }</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <hr />
                <div className="p-3">
                    {
                        JSON.parse(PeerReviewDetails.data).map(
                            ( val, index ) => {
                                return (
                                    <div className="ml-3 mb-5" key={index} style={{ fontSize: '15px' }}>
                                        <div className="d-flex align-items-center mb-1">
                                            <i className="las la-arrow-right mr-2"></i>
                                            <label className="mb-1 font-weight-bold">{ val.q }</label>
                                        </div>
                                        {
                                            val.type === 'text'
                                            ?
                                            <p className="mb-0">{ val.answer }</p>
                                            :
                                            val.type === 'multiple'
                                            ?
                                            <ul>
                                                {
                                                    val.answers.map(
                                                        ( value, i ) => {
                                                            return <li key={i}>{ value.answer }</li>
                                                        }
                                                    )
                                                }
                                            </ul>
                                            :
                                            val.type === 'checkbox'
                                            ?
                                            val.answers.map(
                                                ( value, i ) => {
                                                    return (
                                                        <div className="d-flex align-items-center mb-2" key={i}>
                                                            <input type="checkbox" className="mr-2" checked={ value.checked } />
                                                            {value.label}
                                                        </div>
                                                    )
                                                }
                                            )
                                            :
                                            val.type === 'radio'
                                            ?
                                            val.answers.map(
                                                ( value, i ) => {
                                                    return (
                                                        <div className="d-flex align-items-center mb-2" key={i}>
                                                            <input type="radio" className="mr-2" checked={ value.checked } />
                                                            {value.label}
                                                        </div>
                                                    )
                                                }
                                            )
                                            :null
                                        }
                                    </div>
                                )
                            }
                        )
                    }
                </div>
            </div>
        </>
    )
}

const EmpPeerReview = ({ history, quarter, PeerReviewData, loadEmpPeerReview }) => {
    const [ Status, setStatus ] = useState('pending');
    useEffect(
        () => {
            loadEmpPeerReview();
            if ( sessionStorage.getItem('ACRView-Peer_review') )
            {
                setStatus(sessionStorage.getItem('ACRView-Peer_review'));
            }
        }, []
    );
    useEffect(
        () => {
            if ( PeerReviewData && document.getElementById('quarter_grid') !== null )
            {
                const quarter_grid = document.getElementById('quarter_grid').childNodes;
                for ( let x = 0; x < quarter_grid.length; x++)
                {
                    quarter_grid[x].style.display = 'block';
                }
                if ( Status === 'pending' )
                {
                    for ( let x = 0; x < quarter_grid.length; x++)
                    {
                        if ( quarter_grid[x].children[1].textContent.toLowerCase() !== 'pending' )
                        {
                            quarter_grid[x].style.display = 'none';
                        }
                    }
                }else
                if ( Status === 'submitted' )
                {
                    for ( let x = 0; x < quarter_grid.length; x++)
                    {
                        if ( quarter_grid[x].children[1].textContent.toLowerCase() !== 'submitted' )
                        {
                            quarter_grid[x].style.display = 'none';
                        }
                    }
                }else
                if ( Status === 'expired' )
                {
                    for ( let x = 0; x < quarter_grid.length; x++)
                    {
                        if ( quarter_grid[x].children[1].textContent.toLowerCase() !== 'expired' )
                        {
                            quarter_grid[x].style.display = 'none';
                        }
                    }
                }else
                if ( Status === 'upcoming' )
                {
                    for ( let x = 0; x < quarter_grid.length; x++)
                    {
                        if ( quarter_grid[x].children[1].textContent.toLowerCase() !== 'upcoming' )
                        {
                            quarter_grid[x].style.display = 'none';
                        }
                    }
                }
            }
        }, [ Status, PeerReviewData ] 
    )
    const onOpenQuarter = (q) => {
        let qq = PeerReviewData.filter( val => val.quarter === q )[0];
        if ( qq )
        {
            history.push('/acr/peer-review/details/' + qq.id);
        }else
        if ( !qq && quarter > q )
        {
            JSAlert.alert(`Review for quarter ${q} was not submitted!!`).dismissIn(1000 * 2);
        }else
        if ( !qq && quarter === q )
        {
            const emp_id = window.location.href.split('/').pop().split('&&name=').shift();
            const name = window.location.href.split('/').pop().split('&&name=').pop();
            JSAlert.alert(`Review for quarter ${q} is not submitted yet!!`).dismissIn(1000 * 2);
            history.push('/acr/peer-review/' + emp_id + '&&name=' + name);
        }else
        if ( !qq && quarter < q )
        {
            JSAlert.alert(`Review for this quarter will open soon!!!`).dismissIn(1000 * 2);
        }
    }
    if ( !PeerReviewData )
    {
        return <img src={loading} alt="loading..." width='50' height='50' className='d-block mx-auto' />
    }
    return (
        <>
            <BreadCrumb links={[{label: 'Performance Review', href: '/acr/options'}]} currentLabel="Peer Review" />
            <div className="ticket_container page-content popUps">
                <button className="btn light d-block ml-auto" onClick={ () => history.goBack() }>Back</button>
                <ul className="nav nav-tabs my-3">
                    <li className="nav-item" onClick={ () => { setStatus(''); sessionStorage.setItem('ACRView-Peer_review', '') } }>
                        <a className={ Status === '' ? 'nav-link active text-capitalize' : 'nav-link text-capitalize' }>All</a>
                    </li>
                    <li className="nav-item" onClick={ () => { setStatus('pending'); sessionStorage.setItem('ACRView-Peer_review', 'pending') } }>
                        <a className={ Status === 'pending' ? 'nav-link active text-capitalize' : 'nav-link text-capitalize' }>Pending</a>
                    </li>
                    <li className="nav-item" onClick={ () => { setStatus('submitted'); sessionStorage.setItem('ACRView-Peer_review', 'submitted') } }>
                        <a className={ Status === 'submitted' ? 'nav-link active text-capitalize' : 'nav-link text-capitalize' }>Submitted</a>
                    </li>
                    <li className="nav-item" onClick={ () => { setStatus('expired'); sessionStorage.setItem('ACRView-Peer_review', 'expired') } }>
                        <a className={ Status === 'expired' ? 'nav-link active text-capitalize' : 'nav-link text-capitalize' }>Expired</a>
                    </li>
                    <li className="nav-item" onClick={ () => { setStatus('upcoming'); sessionStorage.setItem('ACRView-Peer_review', 'upcoming') } }>
                        <a className={ Status === 'upcoming' ? 'nav-link active text-capitalize' : 'nav-link text-capitalize' }>Upcoming</a>
                    </li>
                </ul>
                <div className="quarter_grid" id="quarter_grid">
                    <div className="item" onClick={ () => onOpenQuarter(1) }>
                        <img src={ FolderIcon } alt="folder" width="70%" />
                        {
                            quarter > 1 && PeerReviewData.filter( val => val.quarter === 1 ).length === 0
                            ?
                            <>
                                <p className="title pending">
                                    Expired
                                </p>
                                <p className="font-weight-bold mb-0">-</p>
                            </>
                            :
                            quarter === 1 && PeerReviewData.filter( val => val.quarter === 1 ).length === 0
                            ?
                            <>
                                <p className="title pending">
                                    Pending
                                </p>
                                <p className="font-weight-bold mb-0">-</p>
                            </>
                            :
                            PeerReviewData.filter( val => val.quarter === 1 ).length > 0
                            ?
                            <>
                                <p className="title completed">
                                    Submitted
                                </p>
                                <p className="font-weight-bold mb-0">{ new Date(PeerReviewData.filter( val => val.quarter === 1 )[0].review_date).toDateString() }</p>
                            </>
                            :null
                        }
                        <span>Quarter 1</span>
                    </div>
                    <div className="item" onClick={ () => onOpenQuarter(2) }>
                        <img src={ FolderIcon } alt="folder" width="70%" />
                        {
                            quarter < 2
                            ?
                            <>
                                <p className="title">Upcoming</p>
                                <p className="font-weight-bold mb-0">-</p>
                            </>
                            :
                            quarter > 2 && PeerReviewData.filter( val => val.quarter === 2 ).length === 0
                            ?
                            <>
                                <p className="title pending">
                                    Expired
                                </p>
                                <p className="font-weight-bold mb-0">-</p>
                            </>
                            :
                            quarter === 2 && PeerReviewData.filter( val => val.quarter === 2 ).length === 0
                            ?
                            <>
                                <p className="title pending">
                                    Pending
                                </p>
                                <p className="font-weight-bold mb-0">-</p>
                            </>
                            :
                            PeerReviewData.filter( val => val.quarter === 2 ).length > 0
                            ?
                            <>
                                <p className="title completed">
                                    Submitted
                                </p>
                                <p className="font-weight-bold mb-0">{ new Date(PeerReviewData.filter( val => val.quarter === 2 )[0].review_date).toDateString() }</p>
                            </>
                            :null
                        }
                        <span>Quarter 2</span>
                    </div>
                    <div className="item" onClick={ () => onOpenQuarter(3) }>
                        <img src={ FolderIcon } alt="folder" width="70%" />
                        {
                            quarter < 3
                            ?
                            <>
                                <p className="title">Upcoming</p>
                                <p className="font-weight-bold mb-0">-</p>
                            </>
                            :
                            quarter > 3 && PeerReviewData.filter( val => val.quarter === 3 ).length === 0
                            ?
                            <>
                                <p className="title pending">
                                    Expired
                                </p>
                                <p className="font-weight-bold mb-0">-</p>
                            </>
                            :
                            quarter === 3 && PeerReviewData.filter( val => val.quarter === 3 ).length === 0
                            ?
                            <>
                                <p className="title pending">
                                    Pending
                                </p>
                                <p className="font-weight-bold mb-0">-</p>
                            </>
                            :
                            PeerReviewData.filter( val => val.quarter === 3 ).length > 0
                            ?
                            <>
                                <p className="title completed">
                                    Submitted
                                </p>
                                <p className="font-weight-bold mb-0">{ new Date(PeerReviewData.filter( val => val.quarter === 3 )[0].review_date).toDateString() }</p>
                            </>
                            :null
                        }
                        <span>Quarter 3</span>
                    </div>
                    <div className="item" onClick={ () => onOpenQuarter(4) }>
                        <img src={ FolderIcon } alt="folder" width="70%" />
                        {
                            quarter < 4
                            ?
                            <>
                                <p className="title">Upcoming</p>
                                <p className="font-weight-bold mb-0">-</p>
                            </>
                            :
                            quarter > 4 && PeerReviewData.filter( val => val.quarter === 4 ).length === 0
                            ?
                            <>
                                <p className="title pending">
                                    Expired
                                </p>
                                <p className="font-weight-bold mb-0">-</p>
                            </>
                            :
                            quarter === 4 && PeerReviewData.filter( val => val.quarter === 4 ).length === 0
                            ?
                            <>
                                <p className="title pending">
                                    Pending
                                </p>
                                <p className="font-weight-bold mb-0">-</p>
                            </>
                            :
                            PeerReviewData.filter( val => val.quarter === 4 ).length > 0
                            ?
                            <>
                                <p className="title completed">
                                    Submitted
                                </p>
                                <p className="font-weight-bold mb-0">{ new Date(PeerReviewData.filter( val => val.quarter === 4 )[0].review_date).toDateString() }</p>
                            </>
                            :null
                        }
                        <span>Quarter 4</span>
                    </div>
                </div>
            </div>
        </>
    )
}

const SelfAssessmentDetailsComponent = ({ history, SelfAssessmentDetails, loadSelfAssessmentDetails }) => {
    useEffect(
        () => {
            loadSelfAssessmentDetails(window.location.href.split('/').pop());
        }, []
    );

    if ( !SelfAssessmentDetails )
    {
        return (
            <div className="ticket_container page-content">
                <img src={loading} alt="loading..." width='50' height='50' className='d-block mx-auto' />
            </div>
        )
    }

    return (
        <>
            <BreadCrumb links={[{label: 'Performance Review', href: '/acr/options'}]} currentLabel={ "Self-Assessment Details - Quarter " + (SelfAssessmentDetails.details.quarter + ' - Year ' + SelfAssessmentDetails.details.year) } />
            <div className="ticket_container page-content">
                <div className="d-flex align-items-center justify-content-between">
                    <h3 className="heading">
                        Self Assessment Details
                        <sub>Details Of The Submitted Review</sub>
                    </h3>
                    <div>
                        <button className='btn light' onClick={ () => history.goBack() }>Back</button>
                    </div>
                </div>
                <hr />
                <table className="table table-borderless">
                    <tbody>
                        <tr>
                            <td>
                                <b>Submitted By</b><br />
                                <span>{ SelfAssessmentDetails.details.name }</span><br />
                            </td>
                            <td>
                                <b>Designation</b><br />
                                <span>{ SelfAssessmentDetails.details.designation_name }</span>
                            </td>
                            <td>
                                <b>Company</b><br />
                                <span>{ SelfAssessmentDetails.details.company_name }</span>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <b>Submitted Date</b><br />
                                <span>{ moment(SelfAssessmentDetails.details.submit_date).utc().format('MM-DD-YYYY') }</span>
                            </td>
                            <td>
                                <b>Submitted Time</b><br />
                                <span>{ SelfAssessmentDetails.details.submit_time }</span>
                            </td>
                            <td>
                                <b>Status</b><br />
                                <span>{ SelfAssessmentDetails.details.status }</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <hr />
                <div className="px-3 pt-3 pb-0">
                    {
                        JSON.parse(SelfAssessmentDetails.details.data).map(
                            ( val, index ) => {
                                return (
                                    <div className="ml-3 mb-5" key={index} style={{ fontSize: '15px' }}>
                                        <div className="d-flex align-items-center mb-1">
                                            <i className="las la-arrow-right mr-2"></i>
                                            <label className="mb-1 font-weight-bold">{ val.question }</label>
                                        </div>
                                        {
                                            val.applicable === 1
                                            ?
                                            <p className="mb-0">{ val.answer }</p>
                                            :
                                            <p className="mb-0 text-danger">Not Applicable</p>
                                        }
                                    </div>
                                )
                            }
                        )
                    }
                </div>
                {
                    SelfAssessmentDetails.tickets.length > 0
                    ?
                    <>
                        <h5 className="pl-4 mb-0">Tickets Explanations</h5>
                        <hr />
                        <div className="p-3">
                            {
                                SelfAssessmentDetails.tickets.map(
                                    ( val, index ) => {
                                        return (
                                            <div className="ml-3 mb-5" key={index} style={{ fontSize: '15px' }}>
                                                <div className="d-flex align-items-center mb-1">
                                                    <i className="las la-arrow-right mr-2"></i>
                                                    <label className="mb-1 font-weight-bold">{ val.remarks }</label>
                                                </div>
                                                <p className="mb-0">{ val.explanation }</p>
                                            </div>
                                        )
                                    }
                                )
                            }
                        </div>
                    </>
                    :null
                }
            </div>
        </>
    )
}

const GrowthReviewDetailsComponent = ({ GrowthCategories, addNewCategory, quarter, nextQuarter, setList, List, addRow, history, GrowthReviewDetails, rejectAssignedTask, acceptAssignedTask, setCompleteTask, loadGrowthReviewDetails, setInCompleteTask }) => {
    const lastMonthsOfTheQuarter = [3, 6, 9, 12];
    const currentMonth = new Date().getMonth() + 1;
    const lastAboveDays = 15;
    let openLock = false;
    if ( lastMonthsOfTheQuarter.includes(currentMonth) && new Date().getDate() > lastAboveDays )
    {
        openLock = true;
    }
    
    // const [ { run, steps }, setState ] = useState(
    //     {
    //         run: true,
    //         steps: [
    //             {
    //                 content: (
    //                     <>
    //                         <h4 className="text-left">General Tasks</h4>
    //                         <p className="mb-0 text-left" style={{ textAlign: "justify" }}>Uncategorized tasks refer to general tasks that have not been assigned to a specific category. They might cover various aspects of work that don't fall under a particular project or department but are still essential for overall productivity and organization.</p>
    //                     </>
    //                 ),
    //                 locale: { skip: <strong>SKIP</strong> },
    //                 target: '.category'
    //             },
    //             {
    //                 content: (
    //                     <>
    //                         <h4 className="text-left">Add New Tasks</h4>
    //                         <p className="mb-0 text-left" style={{ textAlign: "justify" }}>To streamline task assignments for the selected employee, simply click the button below. By doing so, you will access an intuitive interface that allows you to assign tasks efficiently and effectively.</p>
    //                     </>
    //                 ),
    //                 locale: { skip: <strong>SKIP</strong> },
    //                 target: '#addNewTasks'
    //             }
    //         ]
    //     }
    // );
    const [ EditMode, setEditMode ] = useState(false);
    const [ AcceptanceContent, setAcceptanceContent ] = useState();
    const [ ConfirmAcceptance, setConfirmAcceptance ] = useState(false);
    const [ ActionContent, setActionContent ] = useState(<></>);
    const [ ConfirmAction, setConfirmAction ] = useState(false);
    const [ Category, setCategory ] = useState();
    const [ Collaborators, setCollaborators ] = useState([]);
    const [ ShowModal, setShowModal ] = useState(false);
    const [ Calender, setCalender ] = useState();
    const [ Content, setContent ] = useState();
    const [ Task, setTask ] = useState();
    const [ CalenderViewPosition, setCalenderViewPosition ] = useState();
    

    useEffect(
        () => {
            loadGrowthReviewDetails(window.location.href.split('/').pop());
        }, []
    );
    useEffect(
        () => {
            setShowModal(false);
            setContent();
            if ( GrowthReviewDetails )
            {
                setTimeout(() => {
                    $('.react-joyride__beacon').trigger('click');
                }, 1000);
                let names = [];
                for ( let x = 0; x < GrowthReviewDetails.length; x++ )
                {
                    if ( !names.includes( GrowthReviewDetails[x].assigned_emp_name ) )
                    {
                        names.push(GrowthReviewDetails[x].assigned_emp_name);
                    }
                }
                setCollaborators(names);
            }
        }, [GrowthReviewDetails]
    );
    useEffect(
        () => {
            if (GrowthReviewDetails && Calender && GrowthCategories) {
                if( $('#today').length ) setCalenderViewPosition($('#today').position().left);
            }
        }, [GrowthReviewDetails, Calender, GrowthCategories]
    )
    useEffect(
        () => {
            if (CalenderViewPosition) $('#generalTasks').animate({scrollLeft: CalenderViewPosition}, 500);
        }, [CalenderViewPosition]
    )
    useEffect(
        () => {
            if (Content || AcceptanceContent || ActionContent) {
                setShowModal(!ShowModal);
            }
        }, [ ConfirmAcceptance, ConfirmAction ]
    )

    const moveRight = () => {
        let currPosition = CalenderViewPosition;
        currPosition = currPosition + 200;
        setCalenderViewPosition(currPosition);
    }

    const moveLeft = () => {
        let currPosition = CalenderViewPosition;
        currPosition = currPosition - 200;
        setCalenderViewPosition(currPosition);
    }

    const acceptTask = (id) => {
        setConfirmAcceptance(true);
        setAcceptanceContent(
            <>
                <h6>Do you want to accept this task?</h6>
                <button className="btn submit d-block ml-auto" id="confirmBtn" onClick={() => acceptAssignedTask(id, window.location.href.split('/').pop(), setConfirmAcceptance, setAcceptanceContent)}>Yes</button>
            </>
        );
    }
    const rejectTask = (id) => {
        setConfirmAcceptance(true);
        setAcceptanceContent(
            <>
                <form onSubmit={(e) => rejectAssignedTask(e, id, window.location.href.split('/').pop(), setConfirmAcceptance, setAcceptanceContent)}>
                    <fieldset>
                        <h6>Do you want to reject this task?</h6>
                        <textarea name="remarks" className="form-control" placeholder="Your Remarks..." required minLength={20} />
                        <button className="btn submit d-block ml-auto mt-3" id="confirmBtn">Yes</button>
                    </fieldset>
                </form>
            </>
        );
    }
    const setTaskInComplete = (id, condition, confirmed) => {
        // if ( !condition )
        // {
        //     return false;
        // }
        setConfirmAction(true);
        setActionContent(
            <form onSubmit={(e) => setInCompleteTask(e, id, window.location.href.split('/').pop(), setConfirmAction, setActionContent, confirmed)}>
                <h6>Do you want to set this task to incomplete?</h6>
                <textarea placeholder="Your Remarks Here...." name="remarks" className="form-control mb-3" minLength={15} required />
                <button className="btn cancle d-block ml-auto" id="confirmBtn">Yes</button>
            </form>
        );
    }
    const setTaskComplete = (id, condition, confirmed) => {
        // if ( !condition )
        // {
        //     return false;
        // }
        setConfirmAction(true);
        setActionContent(
            <form onSubmit={(e) => setCompleteTask(e, id, window.location.href.split('/').pop(), setConfirmAction, setActionContent, confirmed)}>
                <h6>Do you want to set this task to complete?</h6>
                <textarea placeholder="Your Remarks Here...." name="remarks" className="form-control mb-3" minLength={15} required />
                <button className="btn submit d-block ml-auto" id="confirmBtn">Yes</button>
            </form>
        );
    }
    const onChangeHandler = (e, id) => {
        const { value, name } = e.target;
        let arr = List.slice();
        arr[id][name] = value;
        setList(arr);
    }
    const removeTask = ( index ) => {
        const arr = List.filter((val, i) => i !== index);
        setList(arr);
    }
    const additionalTasks = () => {
        document.getElementById('growthreviewsubmitbtn').setAttribute('disabled', true);
        axios.post(
            '/acr/growth-review/additional-tasks',
            {
                tasks: JSON.stringify(List),
                submit_by: localStorage.getItem('EmpID'),
                emp_id: window.location.href.split('/').pop(),
            }
        ).then(
            res => {
                if ( res.data === 'success' ) {
                    JSAlert.alert("Tasks Has Been Added").dismissIn(1000 * 2);
                    setList();
                    setEditMode(false);
                    loadGrowthReviewDetails(window.location.href.split('/').pop());
                }else
                {
                    document.getElementById('growthreviewsubmitbtn').setAttribute('disabled', 'false');
                    JSAlert.alert("Something went wrong!!!").dismissIn(1000 * 2);
                }
            }
        ).catch(
            err => {
                document.getElementById('growthreviewsubmitbtn').setAttribute('disabled', 'false');
                console.log( err );
            }
        )
    }
    const newCategory = (e) => {
        addNewCategory(e.target['categoryInput'].value);
    }
    const enumerateDaysBetweenDates = (startDate, endDate) => {
        let dates = [];
    
        let currDate = moment(startDate).startOf('day');
        let lastDate = moment(endDate).startOf('day');
        dates.push(currDate.clone().toDate());
    
        while(currDate.add(1, 'days').diff(lastDate) <= 0) {
            // console.log(currDate.toDate());
            dates.push(currDate.clone().toDate());
        }
    
        setCalender(dates);
        return dates;
    };
    const openList = (d) => {
        setContent(
            <>
                {
                    GrowthReviewDetails.filter(val =>val.deadline >= d && val.start_date <= d).length > 0
                    ?
                        <div>
                            <h5 className="mb-0">{new Date(d).toDateString()}</h5>
                            <p className="mb-0 font-weight-bold">Total Tasks To Do: {GrowthReviewDetails.filter(val => val.deadline >= d && val.start_date <= d).length}</p>
                            <hr className="mb-3" />
                            {
                                GrowthReviewDetails.filter(val => val.deadline >= d && val.start_date <= d).map(
                                    ({ id, task, deadline, accepted, completed }, ii) => {
                                        const iso_deadline = new Date(deadline).toISOString().slice(0, 10).replace('T', ' ');
                                        return (
                                            <div key={ii} className="p-3 calender_date border-bottom-0 mb-3 rounded" style={{ boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px' }} onClick={() => openDetailsModel(id, "General", d)}>
                                                <div className="d-flex justify-content-between align-items-center mb-3">
                                                    <p>{task}</p>
                                                    <small className="font-weight-bold" style={ { fontSize: '15px' } }>{iso_deadline}</small>
                                                </div>
                                                <div className={
                                                    "status_color " +
                                                    (
                                                        accepted === null && completed === null
                                                            ?
                                                            "bg-status-warning"
                                                            :
                                                            accepted === 1 && completed === null
                                                                ?
                                                                "bg-status-blue"
                                                                :
                                                                accepted === 0 && completed === null
                                                                    ?
                                                                    "bg-status-red"
                                                                    :
                                                                    completed === 0 ?
                                                                        "bg-status-lightgray"
                                                                        :
                                                                        completed === 1
                                                                            ?
                                                                            "bg-status-green"
                                                                            :
                                                                            "bg-light"
                                                    )
                                                }
                                                >
                                                    <small className="text-dark font-weight-bold" style={{ fontFamily: "Quicksand" }}>
                                                        {
                                                            accepted === null && completed === null
                                                                ?
                                                                "Not Accepted"
                                                                :
                                                                accepted === 1 && completed === null
                                                                    ?
                                                                    "Accepted"
                                                                    :
                                                                    accepted === 0 && completed === null
                                                                        ?
                                                                        "Rejected"
                                                                        :
                                                                        completed === 0 ?
                                                                            "Incomplete"
                                                                            :
                                                                            completed === 1
                                                                                ?
                                                                                "Completed"
                                                                                :
                                                                                ""
                                                        }
                                                    </small>
                                                </div>
                                            </div>
                                        )
                                    }
                                )
                            }
                        </div>
                    :
                    <h6 className="text-center">No Task Found</h6>
                }
            </>
        )
        setShowModal(true);
    }
    const openDetailsModel = (id, category, d) => {
        const task = id ? GrowthReviewDetails.filter(val => val.id === id)[0] : Task;
        task.category = category;
        const deadline = new Date(task.deadline);
        const currDate = new Date();
        const start = moment(task.start_date, "YYYY-MM-DD");
        const end = moment(task.deadline, "YYYY-MM-DD");
        setTask(task);
        setContent(
            <div className="p-3">
                <div className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0" style={{fontFamily: "Roboto-Light", fontWeight: "bold"}}>Task Details</h5>
                    {d ? <button className="btn light" onClick={() => openList(d)}>Back</button> : null}
                </div>
                <hr className="mb-1" />
                <table class="table table2">
                    <tbody>
                        <tr className="border-bottom">
                            <th>Description</th>
                            <td className="text-capitalize">{task.task}</td>
                        </tr>
                        <tr className="border-bottom">
                            <th>Assigned by</th>
                            <td>
                                <b>{task.assigned_emp_name}</b><br />
                                <span>{new Date(task.assigning_date).toDateString()} at {task.assigning_time}</span>
                            </td>
                        </tr>
                        <tr className="border-bottom">
                            <th>Deadline</th>
                            <td>{new Date(task.deadline).toDateString()}</td>
                        </tr>
                        <tr className="border-bottom">
                            <th>Duration</th>
                            <td>{moment.duration(end.diff(start)).asDays()+1} Day(s)</td>
                        </tr>
                        <tr className="border-bottom">
                            <th>Category</th>
                            <td>{category || task.category}</td>
                        </tr>
                        <tr className="border-bottom">
                            <th>Accepted</th>
                            <td>
                                {
                                    task.accepted === 0
                                    ?
                                    <>
                                        <span className="text-danger">Refuse to Accept</span><br />
                                        <span>{new Date(task.accepted_date).toDateString()} at {task.accepted_time}</span>
                                    </>
                                    :
                                    task.accepted === 1
                                    ?
                                    <>
                                        <span className="text-success">Accepted</span><br />
                                        <span>{new Date(task.accepted_date).toDateString()} at {task.accepted_time}</span>
                                    </>
                                    :
                                    <span className="text-secondary">Not Accepted Yet</span>
                                }
                            </td>
                        </tr>
                        <tr className="border-bottom">
                            <th>Remarks</th>
                            <td>{task.remarks ? task.remarks : "-----"}</td>
                        </tr>
                        <tr className="border-bottom">
                            <th>
                                <span>Status</span>
                                {
                                    task.confirmed !== null
                                    ?
                                    <>
                                        <br />
                                        <span>Assignee Remarks</span>
                                    </>
                                    :null
                                }
                            </th>
                            <td>
                                {
                                    task.completed === null && task.emp_id == localStorage.getItem("EmpID")
                                    ?
                                    <>
                                        {
                                            task.accepted === 0
                                            ?
                                            <span className="text-danger"><b>Rejected</b></span>
                                            :
                                            <span className="text-danger">Not Completed yet</span>
                                        }
                                    </>
                                    :
                                    task.completed === 0
                                    ? <span className="text-danger">Incomplete</span>
                                    : task.completed === 1
                                    ? <span className="text-success">Completed</span>
                                    :
                                    task.accepted === 0
                                    ?
                                    <span className="text-danger">Rejected</span>
                                    :
                                    task.accepted === 1
                                    ?
                                    <span className="text-success">Accepted</span>
                                    :
                                    <span className="text-warning">Waiting For Acceptance</span>
                                }
                                <br />
                                {
                                    task.confirmed !== null
                                    ?
                                    task.confirmed === 1
                                    ?
                                    <>
                                        <b><i><u>Confirmed as completed, by the assignee</u></i></b><br />
                                        <span>{task.confirmed_remarks}</span>
                                    </>
                                    :
                                    <>
                                        <b><i><u>Completed task has been declined by the assignee</u></i></b><br />
                                        <span>{task.confirmed_remarks}</span>
                                    </>
                                    :
                                    <b><i><u>Not Confirmed</u></i></b>
                                }
                            </td>
                        </tr>
                    </tbody>
                </table>
                {
                    task.confirmed === null && task.accepted === 1 && task.completed !== null && task.assigned_by == localStorage.getItem('EmpID')
                    ?
                    <fieldset className="d-flex justify-content-end">
                        <button className="btn cancle mr-2" onClick={() => setTaskInComplete(task.id, currDate > deadline, false)}>Decline</button>
                        <button className="btn submit" onClick={() => setTaskComplete(task.id, currDate > deadline, true)}>Confirm To Complete</button>
                    </fieldset>
                    :
                    task.accepted === 1 && task.completed === null && task.emp_id == localStorage.getItem('EmpID')
                    ?
                    <fieldset className="d-flex justify-content-end">
                        <button className="btn cancle mr-2" onClick={() => setTaskInComplete(task.id, currDate > deadline)}>Set Task To Incomplete</button>
                        <button className="btn submit" onClick={() => setTaskComplete(task.id, currDate > deadline)}>Set Task To Complete</button>
                    </fieldset>
                    :
                    task.accepted === null && task.emp_id == localStorage.getItem('EmpID')
                    ?
                    <fieldset className="d-flex justify-content-end">
                        <button className="btn cancle mr-2" onClick={ () => rejectTask( task.id ) }>Reject</button>
                        <button className="btn submit" onClick={ () => acceptTask( task.id ) }>Accept</button>
                    </fieldset>
                    :null
                }
            </div>
        )
        setShowModal(true);
    }

    const resetFilters = () => {
        setDateFilter("");
    }

    const [ DateFilter, setDateFilter ] = useState('');
    const [ ShowFilters, setShowFilters ] = useState(false);
    const d = moment(moment()).format('YYYY-MM-DD');
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    if (GrowthReviewDetails) {
        let assigning_dates_arr = [];
        let deadline_arr = [];
        GrowthReviewDetails.forEach(val => {deadline_arr.push(val.deadline); assigning_dates_arr.push(val.start_date)});

        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
        const min_date = assigning_dates_arr.sort()[0];
        const max_date = deadline_arr.sort().reverse()[0];
        if ( !Calender ) enumerateDaysBetweenDates(min_date, max_date);

        const taskStatus = (confirmed, ) => {
            let status = <></>;
            
            return status;
        }
        
        return (
            <>
                <Modal show={ ConfirmAcceptance } Hide={ () => setConfirmAcceptance(!ConfirmAcceptance) } content={AcceptanceContent} />
                <Modal show={ ConfirmAction } Hide={ () => setConfirmAction(!ConfirmAction) } content={ActionContent} />
                <Modal show={ ShowModal } Hide={ () => setShowModal(!ShowModal) } content={ Content } />
                <BreadCrumb links={[{label: 'Performance Review', href: '/acr/options'}]} currentLabel="Growth Review Details" />
                {/* <Joyride
                    wrapperOptions={{
                        class: "teste"
                    }}
                    steps={steps}
                    run={run}
                    continuous={true}
                    scrollToFirstStep={true}
                    showSkipButton
                    styles={{
                        buttonNext: {
                            background: '#272F3E'
                        },
                        options: {
                            primaryColor: '#272F3E',
                        }
                    }}
                /> */}
                <div className="d-grid-growth-details">
                    <div className="ticket_container page-content">
                        <div className="d-flex align-items-center justify-content-between">
                            <h3 className="heading">
                                Growth Review
                                <sub>List of All Assigned Tasks</sub>
                            </h3>
                            <div className="d-flex">
                                <button className='btn light mr-2' onClick={() => history.goBack()}>Back</button>
                                {
                                    window.location.href.split('/').pop() == localStorage.getItem("EmpID")
                                        ? null
                                        :
                                        EditMode
                                            ?
                                            <button onClick={() => setEditMode(false)} className="btn light">Back To Details View</button>
                                            :
                                            <>
                                                <button onClick={() => setEditMode(true)} className="btn submit" id="addNewTasks">Add New Task</button>
                                                <button onClick={() => setEditMode(true)} className="btn light ml-2">Create Category</button>
                                            </>
                                }
                                 <button className="btn submit px-2 filter-emit" onClick={() => setShowFilters(!ShowFilters)} type='button'>
                                    {
                                        ShowFilters
                                            ?
                                            <>
                                                <i className="las la-times"></i>
                                            </>
                                            :
                                            <div data-tip data-for='filter'>
                                                {
                                                    DateFilter !== ''
                                                        ?
                                                        <div className='filterisOpen'></div>
                                                        :
                                                        null
                                                }
                                                <i className="las la-filter"></i>
                                                <ReactTooltip id='filter' place="top">
                                                    Filters
                                                </ReactTooltip>
                                            </div>
                                    }
                                </button>
                            </div>
                        </div>
                        <br />
                            {
                                ShowFilters
                                    ?
                                    <>
                                        <div className='filter-content popUps'>
                                            <div className='flex'>
                                                <div className='w-75 d-block mb-2'>
                                                    <label className="font-weight-bold mb-0">Select Month</label>
                                                    <input type="month" className="form-control" id="" name="" />
                                                </div>
                                                <button className='btn w-25 green d-block ml-auto mt-2' type='button' onClick={resetFilters}>Reset All</button>
                                            </div>
                                        </div>
                                        <br />
                                    </>
                                    : null
                            }
                        <hr />
    
                        {
                            !Calender || !GrowthCategories
                            ?
                            <div>
                                <h5 className="text-center font-italic" style={{ fontFamily: "Roboto-Light", textTransform: "underline" }}>Building Calender...</h5>
                            </div>
                            :
                            EditMode
                            ?
                            <>
                                <div 
                                    className="alert alert-secondary pointer pointer-hover p-2 px-2 d-flex justify-content-between category"
                                    data-toggle="collapse" href="#addRowForm" role="button" aria-expanded="false" aria-controls="addRowForm"
                                >
                                    <h6 className="mb-0"><b className="text-capitalize">General Tasks</b></h6>
                                    <h6 className="mb-0"><span>{ List?.filter(val => val.category === null).length }</span></h6>
                                </div>
                                <form onSubmit={ (e) => addRow( e, null ) } id="addRowForm" className="collapse show popUps mt-2 rounded">
                                    <div className="d-flex" style={{ gap: '15px' }}>
                                        <div className="w-50">
                                            <p className="mb-1 font-weight-bold">Task</p>
                                            <input className="form-control" placeholder="Enter the task in detail...." name="task" required />
                                        </div>
                                        <div className="w-50">
                                            <p className="mb-1 font-weight-bold">Start Date</p>
                                            <input type="date" className="form-control" name="start_date" required />
                                        </div>
                                        <div className="w-50">
                                            <p className="mb-1 font-weight-bold">Deadline</p>
                                            <input type="date" className="form-control" name="deadline" required />
                                        </div>
                                    </div>
                                    <button className="btn submit d-block ml-auto mt-2" type="submit">Add</button>
                                </form>
                                {
                                    List && List.filter(val => val.category === null).length > 0
                                    ?
                                    <>
                                        <table className="table mb-0">
                                            <thead>
                                                <tr>
                                                    <th className="border-top-0">Sr.No</th>
                                                    <th className="border-top-0">Tasks</th>
                                                    <th className="border-top-0">Start Date</th>
                                                    <th className="border-top-0">Deadline</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    List.filter(val => val.category === null).map(
                                                        ( val, index ) => {
                                                            return (
                                                                <tr key={index}>
                                                                    <td>{index + 1}</td>
                                                                    <td>
                                                                        <textarea name='task' className="contentEditableInput form-control" onChange={ (e) => onChangeHandler( e, index ) } value={ val.task } />
                                                                    </td>
                                                                    <td>
                                                                        <input name='start_date' type="date" className="contentEditableInput form-control" value={ val.start_date } onChange={ (e) => onChangeHandler( e, index ) } />
                                                                    </td>
                                                                    <td style={{ position: 'relative' }}>
                                                                        <div className="d-flex align-items-center pr-5">
                                                                            <input name='deadline' type="date" className="contentEditableInput form-control" value={ val.deadline } onChange={ (e) => onChangeHandler( e, index ) } />
                                                                            <i className="las la-trash text-danger" onDoubleClick={ () => removeTask( index ) }></i>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            )
                                                        }
                                                    )
                                                }
                                            </tbody>
                                        </table>
                                    </>
                                    :null
                                }
                                {
                                    !GrowthCategories?
                                    <b>Please Wait...</b>
                                    :
                                    GrowthCategories.length === 0?
                                    <b>No Category Found</b>
                                    :
                                    <>
                                        <br />
                                        {
                                            GrowthCategories.map(
                                            ({ id, category, tasks, created_by }, index) => {
                                                return (
                                                    <>
                                                        <div 
                                                            key={index} 
                                                            className={ "alert alert-secondary pointer pointer-hover p-2 px-2 d-flex justify-content-between category " + ( Category && Category.id === id ? "active" : "" ) }
                                                            data-toggle="collapse" href={ "#" + category.split(' ').join('_') + id } role="button" aria-expanded="false" aria-controls={ category.split(' ').join('_') + id }
                                                        >
                                                            <h6 className="mb-0"><b className="text-capitalize">{ category }</b></h6>
                                                            <h6 className="mb-0"><span>{ List?.filter(val => val.category !== null && val.category === id).length }</span></h6>
                                                        </div>
                                                        <div class="collapse border p-2 mb-3" id={ category.split(' ').join('_') + id }>
                                                            <form onSubmit={ (e) => addRow( e, id ) } id={ "addRowForm" + id } className="popUps mt-2 rounded">
                                                                <div className="d-flex" style={{ gap: '15px' }}>
                                                                    <div className="w-50">
                                                                        <p className="mb-1 font-weight-bold text-capitalize">{category} Task</p>
                                                                        <input className="form-control" placeholder="Enter the task in detail...." name="task" required />
                                                                    </div>
                                                                    <div className="w-50">
                                                                        <p className="mb-1 font-weight-bold">Start Date</p>
                                                                        <input type="date" className="form-control" name="start_date" required />
                                                                    </div>
                                                                    <div className="w-50">
                                                                        <p className="mb-1 font-weight-bold">Deadline</p>
                                                                        <input type="date" className="form-control" name="deadline" required />
                                                                    </div>
                                                                </div>
                                                                <button className="btn submit d-block ml-auto mt-2" type="submit">Add</button>
                                                            </form>
                                                            <hr />
                                                            {
                                                                List && List.filter(val => val.category !== null && val.category === id).length > 0
                                                                ?
                                                                <>
                                                                    <table className="table mb-0">
                                                                        <thead>
                                                                            <tr>
                                                                                <th className="border-top-0">Sr.No</th>
                                                                                <th className="border-top-0">Tasks</th>
                                                                                <th className="border-top-0">Start Date</th>
                                                                                <th className="border-top-0">Deadline</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                            {
                                                                                List.filter(val => val.category !== null && val.category === id).map(
                                                                                    ( val, index ) => {
                                                                                        return (
                                                                                            <tr key={index}>
                                                                                                <td>{index + 1}</td>
                                                                                                <td>
                                                                                                    <textarea name='task' className="contentEditableInput form-control" onChange={ (e) => onChangeHandler( e, index ) } value={ val.task } />
                                                                                                </td>
                                                                                                <td>
                                                                                                    <input name='start_date' type="date" className="contentEditableInput form-control" value={ val.start_date } onChange={ (e) => onChangeHandler( e, index ) } />
                                                                                                </td>
                                                                                                <td style={{ position: 'relative' }}>
                                                                                                    <div className="d-flex align-items-center pr-5">
                                                                                                        <input name='deadline' type="date" className="contentEditableInput form-control" value={ val.deadline } onChange={ (e) => onChangeHandler( e, index ) } />
                                                                                                        <i className="las la-trash text-danger" onDoubleClick={ () => removeTask( index ) }></i>
                                                                                                    </div>
                                                                                                </td>
                                                                                            </tr>
                                                                                        )
                                                                                    }
                                                                                )
                                                                            }
                                                                        </tbody>
                                                                    </table>
                                                                </>
                                                                :null
                                                            }
                                                        </div>
                                                    </>
                                                )
                                            }
                                        )
                                        }
                                    </>
                                }
                                {
                                    List && List.length > 0
                                    ?
                                    <button className="btn submit d-block ml-auto mt-3" id="growthreviewsubmitbtn" onClick={ additionalTasks }>Assign Tasks</button>
                                    :null
                                }
                            </>
                            :
                            <>
                                <div className="collapse show" id="generalTasks">
                                    {/* <div className="Arrow_div left" onClick={moveLeft} ><i class="las la-angle-left"></i></div>
                                    <div className="Arrow_div right" onClick={moveRight} ><i class="las la-angle-right"></i></div> */}
                                    <table class="table table-bordered">
                                        <thead>
                                            <tr>
                                                <th scope="col">Categories</th>
                                                {
                                                    Calender.map(
                                                        (date, i) => {
                                                            const d = moment(date).format("YYYY-MM-DD");
                                                            const dd = new Date(date);
                                                            const today_date = new Date();
                                                            return (
                                                                <th className="table-header" id={ today_date.getDate() === dd.getDate() && today_date.getMonth() === dd.getMonth() && today_date.getFullYear() === dd.getFullYear() ? "today" : "" } key={i} scope="col" onClick={() => openList(d)} >
                                                                    {days[date.getDay()]} {date.getDate()} {months[date.getMonth()]} {today_date.getDate() === dd.getDate() ? <span className="font-weight-normal text-success">&#40;Today&#41;</span> : ""}
                                                                </th>
                                                            )
                                                        }
                                                    )
                                                }
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>
                                                    <h6 className="mb-0"><b className="text-capitalize">General Tasks</b></h6>
                                                    <h6 className="mb-0"><span className="text-capitalize">Total Tasks: {GrowthReviewDetails.filter(val => val.category_id === null).length}</span></h6>
                                                </td>
                                                {
                                                    Calender.map(
                                                        (date, i) => {
                                                            const d = moment(date).format("YYYY-MM-DD");
                                                            return (
                                                                <td key={i} className="p-0">
                                                                    {
                                                                        GrowthReviewDetails.filter(val => val.category_id === null && val.deadline >= d && val.start_date <= d).length > 0
                                                                        ?
                                                                        GrowthReviewDetails.filter(val => val.category_id === null && val.deadline >= d && val.start_date <= d).slice(0,3).map(
                                                                            ({id, task, deadline, confirmed, accepted, completed}, ii) => {
                                                                                const iso_deadline = new Date(deadline).toISOString().slice(0, 10).replace('T', ' ');
                                                                                return (
                                                                                    <div key={ii} className={ "p-3 calender_date " + ( days[new Date(d).getDay()] === 'Sun' ? "off" : "" ) } onClick={() => openDetailsModel(id, "General")}>
                                                                                        <p>{task.substring(0, 20)}...</p>
                                                                                        <small>{iso_deadline}</small><br />
                                                                                        <div className="d-flex align-item-center justify-content-between">
                                                                                            <div className={
                                                                                                "status_color " +
                                                                                                (
                                                                                                    accepted === null && completed === null
                                                                                                        ?
                                                                                                        "bg-status-warning"
                                                                                                        :
                                                                                                        accepted === 1 && completed === null
                                                                                                            ?
                                                                                                            "bg-status-blue"
                                                                                                            :
                                                                                                            accepted === 0 && completed === null
                                                                                                                ?
                                                                                                                "bg-status-red"
                                                                                                                :
                                                                                                                completed === 0 ?
                                                                                                                    "bg-status-lightgray"
                                                                                                                    :
                                                                                                                    completed === 1
                                                                                                                        ?
                                                                                                                        "bg-status-green"
                                                                                                                        :
                                                                                                                        "bg-light"
                                                                                                )
                                                                                            }
                                                                                            >
                                                                                                <small className="text-dark font-weight-bold" style={{ fontFamily: "Quicksand" }}>
                                                                                                    {
                                                                                                        accepted === null && completed === null
                                                                                                            ?
                                                                                                            "Not Accepted"
                                                                                                            :
                                                                                                            accepted === 1 && completed === null
                                                                                                                ?
                                                                                                                "Accepted"
                                                                                                                :
                                                                                                                accepted === 0 && completed === null
                                                                                                                    ?
                                                                                                                    "Rejected"
                                                                                                                    :
                                                                                                                    completed === 0 ?
                                                                                                                        "Incomplete"
                                                                                                                        :
                                                                                                                        completed === 1
                                                                                                                            ?
                                                                                                                            "Completed"
                                                                                                                            :
                                                                                                                            ""
                                                                                                    }
                                                                                                </small>
                                                                                            </div>
                                                                                            {
                                                                                                accepted === 1 && completed === 1 && confirmed === null
                                                                                                ?
                                                                                                <div className="confirmed-icon bg-status-warning border" data-tip data-for='notconfirmed'>
                                                                                                    <i className="las la-exclamation"></i>
                                                                                                    <ReactTooltip id='notconfirmed' place="top">
                                                                                                        Not Confirmed
                                                                                                    </ReactTooltip>
                                                                                                </div>
                                                                                                :
                                                                                                null
                                                                                            }
                                                                                        </div>
                                                                                    </div>
                                                                                )
                                                                            }
                                                                        )
                                                                        :null
                                                                    }
                                                                </td>
                                                            )
                                                        }
                                                    )
                                                }
                                            </tr>
                                            {
                                                GrowthCategories.filter(val => val.category_id !== null).map(
                                                    ({category, id}, i) => {
                                                        return (
                                                            <tr key={i}>
                                                                <td>
                                                                    <h6 className="mb-0"><b className="text-capitalize">{category.split(' ').join('_')}</b></h6>
                                                                    <h6 className="mb-0"><span className="text-capitalize">Total Tasks: { GrowthReviewDetails.filter(val => val.category_id !== null && val.category_id === id).length }</span></h6>
                                                                </td>
                                                                {
                                                                    Calender.map(
                                                                        (date, i) => {
                                                                            const d = moment(date).format("YYYY-MM-DD");
                                                                            return (
                                                                                <td key={i} className="p-0">
                                                                                    {
                                                                                        GrowthReviewDetails.filter(val => val.category_id !== null && val.category_id === id && val.deadline >= d && val.start_date <= d).length > 0
                                                                                            ?
                                                                                            GrowthReviewDetails.filter(val => val.category_id !== null && val.category_id === id && val.deadline >= d && val.start_date <= d).slice(0, 3).map(
                                                                                                ({ id, task, deadline, confirmed, accepted, completed }, ii) => {
                                                                                                    const iso_deadline = new Date(deadline).toISOString().slice(0, 10).replace('T', ' ');
                                                                                                    return (
                                                                                                        <div key={ii} className="p-3 calender_date " onClick={() => openDetailsModel(id, category.split(' ').join('_'))}>
                                                                                                            <p>{task.substring(0, 20)}...</p>
                                                                                                            <small>{iso_deadline}</small><br />
                                                                                                            <div className="d-flex align-item-center justify-content-between">
                                                                                                                <div className={
                                                                                                                    "status_color " +
                                                                                                                    (
                                                                                                                        accepted === null && completed === null
                                                                                                                            ?
                                                                                                                            "bg-status-warning"
                                                                                                                            :
                                                                                                                            accepted === 1 && completed === null
                                                                                                                                ?
                                                                                                                                "bg-status-blue"
                                                                                                                                :
                                                                                                                                accepted === 0 && completed === null
                                                                                                                                    ?
                                                                                                                                    "bg-status-red"
                                                                                                                                    :
                                                                                                                                    completed === 0 ?
                                                                                                                                        "bg-status-lightgray"
                                                                                                                                        :
                                                                                                                                        completed === 1
                                                                                                                                            ?
                                                                                                                                            "bg-status-green"
                                                                                                                                            :
                                                                                                                                            "bg-light"
                                                                                                                    )
                                                                                                                }
                                                                                                                >
                                                                                                                    <small className="text-dark font-weight-bold" style={{ fontFamily: "Quicksand" }}>
                                                                                                                        {
                                                                                                                            accepted === null && completed === null
                                                                                                                                ?
                                                                                                                                "Not Accepted"
                                                                                                                                :
                                                                                                                                accepted === 1 && completed === null
                                                                                                                                    ?
                                                                                                                                    "Accepted"
                                                                                                                                    :
                                                                                                                                    accepted === 0 && completed === null
                                                                                                                                        ?
                                                                                                                                        "Rejected"
                                                                                                                                        :
                                                                                                                                        completed === 0 ?
                                                                                                                                            "Incomplete"
                                                                                                                                            :
                                                                                                                                            completed === 1
                                                                                                                                                ?
                                                                                                                                                "Completed"
                                                                                                                                                :
                                                                                                                                                ""
                                                                                                                        }
                                                                                                                    </small>
                                                                                                                </div>
                                                                                                                {
                                                                                                                    accepted === 1 && completed === 1 && confirmed === null
                                                                                                                    ?
                                                                                                                    <div className="confirmed-icon bg-status-warning border" data-tip data-for='notconfirmed'>
                                                                                                                        <i className="las la-exclamation"></i>
                                                                                                                        <ReactTooltip id='notconfirmed' place="top">
                                                                                                                            Not Confirmed
                                                                                                                        </ReactTooltip>
                                                                                                                    </div>
                                                                                                                    :
                                                                                                                    null
                                                                                                                }
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    )
                                                                                                }
                                                                                            )
                                                                                            : null
                                                                                    }
                                                                                </td>
                                                                            )
                                                                        }
                                                                    )
                                                                }
                                                            </tr>
                                                        )
                                                    }
                                                )
                                            }
                                        </tbody>
                                    </table>
                                    
                                    {/* <td className="table-primary" data-tip data-for='deadline'>
                                        Need to update advance cash user interface
                                        <br />
                                        <br />
                                        <b>Muhammad Usman</b>
                                        <br />
                                        Mon Jun 26 2023
                                        <ReactTooltip id='deadline' place="top">
                                            <b>Deadline</b>
                                            <br />
                                            Mon Jun 26 2023
                                        </ReactTooltip>
                                    </td> */}
                                    {/* {
                                        GrowthReviewDetails && GrowthReviewDetails.filter(val => val.category_id === null).length > 0
                                        ?
                                        <>
                                            <table className="table">
                                                <thead>
                                                    <tr>
                                                        <th>Sr.No</th>
                                                        <th>Task</th>
                                                        <th>Assigned By</th>
                                                        <th>Deadline</th>
                                                        <th>Status</th>
                                                        <th>Remarks</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        GrowthReviewDetails.filter(val => val.category_id === null).map(
                                                            ( val, index ) => {
                                                                const deadline = new Date(val.deadline);
                                                                const currDate = new Date();
                                                                return (
                                                                    <tr key={index}>
                                                                        <td>{ index + 1 }</td>
                                                                        <td>{ val.task }</td>
                                                                        <td>
                                                                            <b>{ val.assigned_emp_name }</b><br />
                                                                            { val.assigning_date !== null ? new Date(val.assigning_date).toDateString() : null }
                                                                        </td>
                                                                        <td>{ new Date(val.deadline).toDateString() }</td>
                                                                        {
                                                                            val.accepted === null && val.emp_id == localStorage.getItem('EmpID')
                                                                            ?
                                                                            <td colSpan={2}>
                                                                                <button className="btn" onClick={ () => acceptTask( val.id ) }>Accept</button>
                                                                                <button className="btn reject ml-2" onClick={ () => rejectTask( val.id ) }>Reject</button>
                                                                            </td>
                                                                            :
                                                                            <>
                                                                                <td>
                                                                                    {
                                                                                        val.completed === null && val.emp_id == localStorage.getItem("EmpID")
                                                                                        ?
                                                                                        <>
                                                                                            {
                                                                                                val.accepted === 1 && val.completed === null
                                                                                                ?
                                                                                                <>
                                                                                                    <i title="Set Task To Complete" className={  currDate > deadline ? "las la-check" : "las la-check lock" } onClick={ () => setTaskComplete( val.id, currDate > deadline ) }></i>
                                                                                                    <i title="Set Task To Incomplete" className={  currDate > deadline ? "las la-times" : "las la-times lock" } onClick={ () => setTaskInComplete( val.id, currDate > deadline ) }></i>
                                                                                                </>
                                                                                                :
                                                                                                val.accepted === 0
                                                                                                ?
                                                                                                <span className="text-danger"><b>Rejected</b><br />By Employee</span>
                                                                                                :
                                                                                                <span className="text-danger">Not Accepted By Employee</span>
                                                                                            }
                                                                                        </>
                                                                                        :
                                                                                        val.completed === 0
                                                                                        ?<span className="text-danger">Incomplete</span>
                                                                                        :val.completed === 1
                                                                                        ?<span className="text-success">Completed</span>
                                                                                        :
                                                                                        val.accepted === 0
                                                                                        ?
                                                                                        <span className="text-danger">Rejected</span>
                                                                                        :
                                                                                        val.accepted === 1
                                                                                        ?
                                                                                        <span className="text-success">Accepted</span>
                                                                                        :
                                                                                        <span className="text-warning">Waiting For Acceptance</span>
                                                                                    }
                                                                                </td>
                                                                                <td>
                                                                                    { val.remarks ? val.remarks : "-----" }
                                                                                </td>
                                                                            </>
                                                                        }
                                                                    </tr>
                                                                )
                                                            }
                                                        )
                                                    }
                                                </tbody>
                                            </table>
                                        </>
                                        :null
                                    } */}
                                </div>
                            </>
                        }
                        
                    </div>
                    {/* <div className="page-content">
                        <h6 className="mb-0 collaborators"><b>Collaborators</b></h6>
                        <hr className="my-1" />
                        {
                            Collaborators.length === 0
                            ?
                            <h6>No Task Assigned</h6>
                            :
                            Collaborators.map(
                                ( name, index ) => {
                                    return (
                                        <div key={index} className="p-1 px-2 d-flex justify-content-between">
                                            <b>{ name }</b>
                                            <span>10</span>
                                        </div>
                                    )
                                }
                            )
                        }
                        <br />
                        {
                            EditMode
                            ?
                            <form onSubmit={ newCategory }>
                                <h6 className="mb-0"><b>Add New Category</b></h6>
                                <hr className="my-1" />
                                <input type="text" className="form-control my-1" name="categoryInput" id="categoryInput" placeholder="Press Enter To Add Category" required />
                                <button className="btn submit d-block ml-auto">Add</button>
                            </form>
                            :null
                        }
                    </div> */}
                </div>
            </>
        )
    }else {
        return (
            <>
                <div className="ticket_container page-content">
                    <img src={loading} alt="loading..." width='50' height='50' className='d-block mx-auto' />
                </div>
            </>
        )
    }

}

const IssueToSubordinates = ( { history, issueTicket, Selected, Keyword, Employees, Ticket, setTicket, setEmployee, setKeyword, loadSubordinates } ) => {

    const [ AccessKey, setAccessKey ] = useState();
    useEffect(
        () => {
            const accessKey = loadSubordinates();
            setAccessKey(accessKey);
        }, []
    );

    const Arr = Employees ? Employees.filter(
        val => {
            return val.name.toLowerCase().includes(Keyword.toLowerCase()) && val.emp_id != localStorage.getItem('EmpID')
        }
    ) : null;

    return (
        <div className="ticket_container page-content">
            <div className="issue-to-subordinates">
                <div className="d-flex align-items-center justify-content-between">
                    <h3 className="heading">
                        Performance Tickets
                        <sub>Issue Tickets To Subordinates</sub>
                    </h3>
                </div>
                <hr />
                <div className="issue-to-subordinates-grid">
                    <form onSubmit={ issueTicket } className="container-fluid">
                        {
                            Ticket === 'red'
                            ?
                            <div className="alert alert-danger">
                                <b className="text-capitalize">You have selected { Ticket } ticket</b> <br />
                                <p className="mb-0">Red ticket may affect the performance of the employee, kindly give only when the work is truly bad.</p>
                            </div>
                            :
                            Ticket === 'yellow'
                            ?
                            <div className="alert alert-warning">
                                <b className="text-capitalize">You have selected { Ticket } ticket</b> <br />
                                <p className="mb-0">Yellow ticket may affect the performance of the employee, kindly give only when the work is average.</p>
                            </div>
                            :
                            Ticket === 'green'
                            ?
                            <div className="alert alert-success">
                                <b className="text-capitalize">You have selected { Ticket } ticket</b> <br />
                                <p className="mb-0">Green ticket will improve the performance of the employee, kindly give only when the work is good.</p>
                            </div>
                            :null
                        }
                        <fieldset className="row">
                            <div className="col-lg-6 mb-3">
                                <label className="mb-0">Subordinate</label>
                                {
                                    Employees && AccessKey === 0?
                                    <select className="form-control" onChange={ ( e ) => setEmployee({ emp_id: e.target.value, name: e.target.options[e.target.selectedIndex].text }) }>
                                        <option>Select option</option>
                                        {
                                            Employees.map(
                                                val => {
                                                    return <option value={ val.emp_id }>{ val.name }</option>
                                                }
                                            )
                                        }
                                    </select>
                                    :
                                    <div className="employees_list_container">
                                        <input type="text" className="form-control" value={ Keyword } onChange={ ( e ) => setKeyword( e.target.value ) } />
                                        {
                                            Arr && !Selected?
                                            <div className="employees_list">
                                                {
                                                    Arr.map(
                                                        ( val, index ) => {
                                                            return (
                                                                <div className="employee" key={index} onClick={ () => setEmployee({ emp_id: val.emp_id, name: val.name }) }>
                                                                    <img src={ process.env.REACT_APP_SERVER+'/images/employees/' + val.emp_image } className="rounded-circle" alt="emp" width={35} height={35} />
                                                                    <div className="ml-2">
                                                                        <b>{ val.name }</b>
                                                                        <p className="mb-0">{ val.designation_name }</p>
                                                                    </div>
                                                                </div>
                                                            )
                                                        }
                                                    )
                                                }
                                            </div>
                                            :null
                                        }
                                    </div>
                                }
                            </div>
                            <div className="col-lg-6 mb-3">
                                <label className="mb-0">Date</label>
                                <input type="text" className="form-control" value={ new Date().toDateString() } disabled />
                            </div>
                            <div className="col-lg-12 mb-3">
                                <label className="mb-0">Remarks</label>
                                <textarea className="form-control" rows={5} name="remarks" minLength={10} required />

                                <div className="text-right mt-3">
                                    <button className="btn light mr-3" onClick={ () => history.replace('/acr/options') }>Back</button>
                                    <button className="btn submit">Issue</button>
                                </div>
                            </div>
                        </fieldset>
                    </form>
                    <div>
                        <h6 className="font-weight-bold">Select Ticket Type</h6>
                        <hr className="w-100" />
                        <div className="type_container">
                            <div className="circle red" onClick={ () => setTicket('red') }></div>
                            <div className="circle yellow" onClick={ () => setTicket('yellow') }></div>
                            <div className="circle green" onClick={ () => setTicket('green') }></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

}

const GrowthReviewComponent = ({ quarter, Companies, EmpGrowthReviewData, Employees, history, loadEmpGrowthReviewData, loadSubordinatesForGrowthReview }) => {
    const [ Your, setYour ] = useState(true);
    const [ ShowFiltersSubordinates, setShowFiltersSubordinates ] = useState(false);
    const [ Keyword, setKeyword ] = useState('');
    const [ Status, setStatus ] = useState('pending');
    const [ ShowFilters, setShowFilters ] = useState(false);
    useEffect(
        () => {
            loadSubordinatesForGrowthReview();
            if ( sessionStorage.getItem('ACRGrowthReviewSearchEmpByName') )
            {
                setKeyword(sessionStorage.getItem('ACRGrowthReviewSearchEmpByName'));
            }
            if ( sessionStorage.getItem('GrowthReviewYours') )
            {
                setYour(sessionStorage.getItem('GrowthReviewYours') == '1');
            }
            if ( sessionStorage.getItem('ACRView-Growth_review_employee') )
            {
                setStatus(sessionStorage.getItem('ACRView-Growth_review_employee'));
            }
        }, []
    );
    useEffect(
        () => {
            if ( !Your && !EmpGrowthReviewData ) loadEmpGrowthReviewData();
        }, [Your]
    );
    useEffect(
        () => {
            if ( EmpGrowthReviewData && EmpGrowthReviewData[0] )
            {
                history.push('/acr/growth-review/details/'+ EmpGrowthReviewData[0].id);
            }else
            if ( EmpGrowthReviewData && document.getElementById('quarter_grid') !== null )
            {
                const quarter_grid = document.getElementById('quarter_grid').childNodes;
                for ( let x = 0; x < quarter_grid.length; x++)
                {
                    quarter_grid[x].style.display = 'block';
                }
                if ( Status === 'pending' )
                {
                    for ( let x = 0; x < quarter_grid.length; x++)
                    {
                        if ( quarter_grid[x].children[1].textContent.toLowerCase() !== 'not assigned' )
                        {
                            quarter_grid[x].style.display = 'none';
                        }
                    }
                }else
                if ( Status === 'assigned' )
                {
                    for ( let x = 0; x < quarter_grid.length; x++)
                    {
                        if ( quarter_grid[x].children[1].textContent.toLowerCase() !== 'assigned' )
                        {
                            quarter_grid[x].style.display = 'none';
                        }
                    }
                }else
                if ( Status === 'expired' )
                {
                    for ( let x = 0; x < quarter_grid.length; x++)
                    {
                        if ( quarter_grid[x].children[1].textContent.toLowerCase() !== 'expired' )
                        {
                            quarter_grid[x].style.display = 'none';
                        }
                    }
                }else
                if ( Status === 'upcoming' )
                {
                    for ( let x = 0; x < quarter_grid.length; x++)
                    {
                        if ( quarter_grid[x].children[1].textContent.toLowerCase() !== 'upcoming' )
                        {
                            quarter_grid[x].style.display = 'none';
                        }
                    }
                }
            }
        }, [ Status, EmpGrowthReviewData ] 
    )

    const onOpenQuarter = (q) => {
        let qq = EmpGrowthReviewData.filter( val => val.quarter === q )[0];
        if ( qq )
        {
            history.push('/acr/growth-review/details/' + qq.id);
        }else
        if ( !qq && quarter > q )
        {
            JSAlert.alert(`Tasks for quarter ${q} was not assigned!!`).dismissIn(1000 * 2);
        }else
        if ( !qq && quarter === q )
        {
            JSAlert.alert(`Tasks for quarter ${q} is not assigned yet!!`).dismissIn(1000 * 2);
            // history.push('/acr/growth-review');
        }else
        if ( !qq && quarter < q )
        {
            JSAlert.alert(`Tasks for this quarter will assign soon!!!`).dismissIn(1000 * 2);
        }
    }
    const Arr = Employees ? Employees.filter(val => {return val.name.toLowerCase().includes(Keyword.toLowerCase()) && val.emp_id !== parseInt(localStorage.getItem("EmpID")) }) : null;

    return (
        <>
            <div className="d-flex align-items-center justify-content-between mb-3">
                <div></div>
                <div className="d-flex">
                    <div className="btn-group">
                        <button onClick={ () => { setYour(true); sessionStorage.setItem("GrowthReviewYours", '1') } } className={ Your ? "btn submit" : "btn light" }>Tasks Assigned By You</button>
                        <button onClick={ () => history.push('/acr/growth-review/' + localStorage.getItem("EmpID")) } className={ Your ? "btn light" : "btn submit" }>Tasks Assigned To You</button>
                    </div>
                    {/* <button className="btn submit ml-2" onClick={() => history.push('/acr/growth-review')}>New</button> */}
                </div>
            </div>
            {
                Your
                ?
                <>
                    {
                        Arr
                        ?
                        <>
                                    <div className="d-flex align-items-center justify-content-between">
                                        <h6 className="mb-0" style={{ fontFamily: "Roboto" }}><b>Employees ({Arr.length})</b></h6>
                                        <button className="btn light px-2 ml-2 filter-emit" onClick={() => setShowFiltersSubordinates(!ShowFiltersSubordinates)} type='button'>
                                            {
                                                ShowFilters
                                                    ?
                                                    <>
                                                        <i className="las la-times"></i>
                                                    </>
                                                    :
                                                    <div data-tip data-for='filter'>
                                                        {
                                                            Keyword !== ''
                                                                ?
                                                                <div className='filterisOpen'></div>
                                                                :
                                                                null
                                                        }
                                                        <i className="las la-filter"></i>
                                                        <ReactTooltip id='filter' place="top">
                                                            Filters
                                                        </ReactTooltip>
                                                    </div>
                                            }
                                        </button>
                                    </div>
                            {
                                ShowFiltersSubordinates
                                ?
                                            <>
                                                <div className='filter-content mt-3 popUps'>
                                                    <div className='flex'>
                                                        <div className='w-100'>
                                                            <label className="font-weight-bold mb-0">Search Employee</label>
                                                            <input placeholder='Search Keywords...' type="search" value={Keyword} onChange={(e) => { setKeyword(e.target.value); sessionStorage.setItem('ACRGrowthReviewSearchEmpByName', e.target.value) }} className='form-control form-control-sm mb-2' />
                                                        </div>
                                                        <button className='btn green d-block ml-auto mt-2' type='reset'>Reset All</button>
                                                    </div>
                                                </div>
                                            </>
                                            :null
                            }
                            {
                                Arr.length === 0
                                ?
                                <h6 className="text-center">No Subordinate Found</h6>
                                :
                                <>
                                    <table className="table mt-3">
                                        <thead>
                                            <tr>
                                                <th>Employee Code</th>
                                                <th>Employee</th>
                                                <th>Company</th>
                                            </tr>   
                                        </thead>
                                        <tbody>
                                            {
                                                Arr.map(
                                                    ( val, index ) => {
                                                        return (
                                                            <tr key={index} className="pointer pointer-hover" onClick={ () => history.push("/acr/growth-review/" + val.emp_id) }>
                                                                <td>{ val.emp_id }</td>
                                                                <td>
                                                                    <div className="d-flex align-items-center">
                                                                        <img src={ process.env.REACT_APP_SERVER+'/images/employees/' + val.emp_image } alt="employee" width="40" height="40" className="rounded-circle" />
                                                                        <div className="ml-2">
                                                                            <b>{ val.name }</b><br />
                                                                            <span>{ val.designation_name }</span>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td>{ val.company_name }</td>
                                                            </tr>
                                                        )
                                                    }
                                                )
                                            }
                                        </tbody>
                                    </table>
                                </>
                            }
                        </>
                        :
                        <img src={loading} alt="loading..." width='50' height='50' className='d-block mx-auto' />
                    }
                </>
                :
                !EmpGrowthReviewData
                ?
                <img src={loading} alt="loading..." width='50' height='50' className='d-block mx-auto' />
                :
                <>
                    <h6 className="text-center">Nothing Found...</h6>
                    {/* <div className="popUps">
                        {
                            ShowFilters
                            ?
                            <>
                                <div className='filter-content popUps mt-3'>
                                    <div className='flex'>
                                        <div className='w-50'>
                                            <label className="font-weight-bold mb-0">Company</label>
                                            <select className='form-control form-control-sm mb-2' onChange={ (e) => alert(e.target.value) }>
                                                <option value=''>Select Option</option>
                                                {
                                                    Companies.sort().map(
                                                        ( company, index ) => {
                                                            return <option key={ index } value={ company.company_code }>{ company.company_name }</option>;

                                                        }
                                                    )
                                                }
                                            </select>
                                        </div>
                                        <div className='w-100'>
                                            <label className="font-weight-bold mb-0">Search Employee</label>
                                            <input placeholder='Search Keywords...' type="search" onChange={ (e) => alert(e.target.value) } className='form-control form-control-sm mb-2' />
                                        </div>
                                    </div>
                                </div>
                                <br />
                            </>
                            :null
                        }
                        <ul className="nav nav-tabs mb-3">
                            <li className="nav-item" onClick={ () => { setStatus(''); sessionStorage.setItem('ACRView-Growth_review_employee', '') } }>
                                <a className={ Status === '' ? 'nav-link active text-capitalize' : 'nav-link text-capitalize' }>All</a>
                            </li>
                            <li className="nav-item" onClick={ () => { setStatus('pending'); sessionStorage.setItem('ACRView-Growth_review_employee', 'pending') } }>
                                <a className={ Status === 'pending' ? 'nav-link active text-capitalize' : 'nav-link text-capitalize' }>Pending</a>
                            </li>
                            <li className="nav-item" onClick={ () => { setStatus('assigned'); sessionStorage.setItem('ACRView-Growth_review_employee', 'assigned') } }>
                                <a className={ Status === 'assigned' ? 'nav-link active text-capitalize' : 'nav-link text-capitalize' }>Assigned</a>
                            </li>
                            <li className="nav-item" onClick={ () => { setStatus('expired'); sessionStorage.setItem('ACRView-Growth_review_employee', 'expired') } }>
                                <a className={ Status === 'expired' ? 'nav-link active text-capitalize' : 'nav-link text-capitalize' }>Expired</a>
                            </li>
                            <li className="nav-item" onClick={ () => { setStatus('upcoming'); sessionStorage.setItem('ACRView-Growth_review_employee', 'upcoming') } }>
                                <a className={ Status === 'upcoming' ? 'nav-link active text-capitalize' : 'nav-link text-capitalize' }>Upcoming</a>
                            </li>
                        </ul>
                        <div className="quarter_grid" id="quarter_grid">
                            <div className="item" onClick={ () => onOpenQuarter(1) }>
                                <img src={ FolderIcon } alt="folder" width="70%" />
                                {
                                    EmpGrowthReviewData.filter( val => val.quarter === 1 ).length > 0
                                    ?
                                    <>
                                        <p className="title completed">
                                            Assigned
                                        </p>
                                        <p className="font-weight-bold mb-0">{ new Date(EmpGrowthReviewData.filter( val => val.quarter === 1 )[0].created_date).toDateString() }</p>
                                    </>
                                    :
                                    ( quarter > 1 || quarter === 1 ) && EmpGrowthReviewData.filter( val => val.quarter === 1 ).length === 0
                                    ?
                                    <>
                                        <p className="title pending">
                                            Expired
                                        </p>
                                        <p className="font-weight-bold mb-0">-</p>
                                    </>
                                    :
                                    quarter !== 1 && EmpGrowthReviewData.filter( val => val.quarter === 1 ).length === 0
                                    ?
                                    <>
                                        <p className="title pending">
                                            Not Assigned
                                        </p>
                                        <p className="font-weight-bold mb-0">-</p>
                                    </>
                                    :null
                                }
                                <span>Quarter 1</span>
                            </div>
                            <div className="item" onClick={ () => onOpenQuarter(2) }>
                                <img src={ FolderIcon } alt="folder" width="70%" />
                                {
                                    EmpGrowthReviewData.filter( val => val.quarter === 2 ).length > 0
                                    ?
                                    <>
                                        <p className="title completed">
                                            Assigned
                                        </p>
                                        <p className="font-weight-bold mb-0">{ new Date(EmpGrowthReviewData.filter( val => val.quarter === 2 )[0].created_date).toDateString() }</p>
                                    </>
                                    :
                                    quarter < 2
                                    ?
                                    <>
                                        <p className="title">Upcoming</p>
                                        <p className="font-weight-bold mb-0">-</p>
                                    </>
                                    :
                                    ( quarter > 2 || quarter === 2 ) && EmpGrowthReviewData.filter( val => val.quarter === 2 ).length === 0
                                    ?
                                    <>
                                        <p className="title pending">
                                            Expired
                                        </p>
                                        <p className="font-weight-bold mb-0">-</p>
                                    </>
                                    :
                                    quarter !== 2 && EmpGrowthReviewData.filter( val => val.quarter === 2 ).length === 0
                                    ?
                                    <>
                                        <p className="title pending">
                                            Not Assigned
                                        </p>
                                        <p className="font-weight-bold mb-0">-</p>
                                    </>
                                    :null
                                }
                                <span>Quarter 2</span>
                            </div>
                            <div className="item" onClick={ () => onOpenQuarter(3) }>
                                <img src={ FolderIcon } alt="folder" width="70%" />
                                {
                                    EmpGrowthReviewData.filter( val => val.quarter === 3 ).length > 0
                                    ?
                                    <>
                                        <p className="title completed">
                                            Assigned
                                        </p>
                                        <p className="font-weight-bold mb-0">{ new Date(EmpGrowthReviewData.filter( val => val.quarter === 3 )[0].created_date).toDateString() }</p>
                                    </>
                                    :
                                    quarter < 3
                                    ?
                                    <>
                                        <p className="title">Upcoming</p>
                                        <p className="font-weight-bold mb-0">-</p>
                                    </>
                                    :
                                    ( quarter > 3 || quarter === 3 ) && EmpGrowthReviewData.filter( val => val.quarter === 3 ).length === 0
                                    ?
                                    <>
                                        <p className="title pending">
                                            Expired
                                        </p>
                                        <p className="font-weight-bold mb-0">-</p>
                                    </>
                                    :
                                    quarter !== 3 && EmpGrowthReviewData.filter( val => val.quarter === 3 ).length === 0
                                    ?
                                    <>
                                        <p className="title pending">
                                            Not Assigned
                                        </p>
                                        <p className="font-weight-bold mb-0">-</p>
                                    </>
                                    :null
                                }
                                <span>Quarter 3</span>
                            </div>
                            <div className="item" onClick={ () => onOpenQuarter(4) }>
                                <img src={ FolderIcon } alt="folder" width="70%" />
                                {
                                    EmpGrowthReviewData.filter( val => val.quarter === 4 ).length > 0
                                    ?
                                    <>
                                        <p className="title completed">
                                            Assigned
                                        </p>
                                        <p className="font-weight-bold mb-0">{ new Date(EmpGrowthReviewData.filter( val => val.quarter === 4 )[0].created_date).toDateString() }</p>
                                    </>
                                    :
                                    quarter < 4
                                    ?
                                    <>
                                        <p className="title">Upcoming</p>
                                        <p className="font-weight-bold mb-0">-</p>
                                    </>
                                    :
                                    ( quarter > 4 || quarter === 4 ) && EmpGrowthReviewData.filter( val => val.quarter === 4 ).length === 0
                                    ?
                                    <>
                                        <p className="title pending">
                                            Expired
                                        </p>
                                        <p className="font-weight-bold mb-0">-</p>
                                    </>
                                    :
                                    quarter !== 4 && EmpGrowthReviewData.filter( val => val.quarter === 4 ).length === 0
                                    ?
                                    <>
                                        <p className="title pending">
                                            Not Assigned
                                        </p>
                                        <p className="font-weight-bold mb-0">-</p>
                                    </>
                                    :null
                                }
                                <span>Quarter 4</span>
                            </div>
                        </div>
                    </div> */}
                </>
            }
        </>
    )
}

const EmployeeGrowthReview = ({ Companies, history, quarter, GrowthReviewData, loadGrowthReviewData }) => {
    const [ ShowFilters, setShowFilters ] = useState(false);
    const [ Status, setStatus ] = useState('pending');
    useEffect(
        () => {
            loadGrowthReviewData();
            if ( sessionStorage.getItem('ACRView-Growth_review') )
            {
                setStatus(sessionStorage.getItem('ACRView-Growth_review'));
            }
        }, []
    )
    useEffect(
        () => {
            if ( GrowthReviewData && document.getElementById('quarter_grid') !== null )
            {
                const quarter_grid = document.getElementById('quarter_grid').childNodes;
                for ( let x = 0; x < quarter_grid.length; x++)
                {
                    quarter_grid[x].style.display = 'block';
                }
                if ( Status === 'pending' )
                {
                    for ( let x = 0; x < quarter_grid.length; x++)
                    {
                        if ( quarter_grid[x].children[1].textContent.toLowerCase() !== 'pending' )
                        {
                            quarter_grid[x].style.display = 'none';
                        }
                    }
                }else
                if ( Status === 'assigned' )
                {
                    for ( let x = 0; x < quarter_grid.length; x++)
                    {
                        if ( quarter_grid[x].children[1].textContent.toLowerCase() !== 'assigned' )
                        {
                            quarter_grid[x].style.display = 'none';
                        }
                    }
                }else
                if ( Status === 'expired' )
                {
                    for ( let x = 0; x < quarter_grid.length; x++)
                    {
                        if ( quarter_grid[x].children[1].textContent.toLowerCase() !== 'expired' )
                        {
                            quarter_grid[x].style.display = 'none';
                        }
                    }
                }else
                if ( Status === 'upcoming' )
                {
                    for ( let x = 0; x < quarter_grid.length; x++)
                    {
                        if ( quarter_grid[x].children[1].textContent.toLowerCase() !== 'upcoming' )
                        {
                            quarter_grid[x].style.display = 'none';
                        }
                    }
                }
            }
        }, [ Status, GrowthReviewData ] 
    )
    if ( !GrowthReviewData )
    {
        return <img src={loading} alt="loading..." width='50' height='50' className='d-block mx-auto' />
    }
    const onOpenQuarter = (q) => {
        let qq = GrowthReviewData.filter( val => val.quarter === q )[0];
        if ( qq )
        {
            history.push('/acr/growth-review/details/' + qq.id);
        }else
        if ( !qq && ( quarter + 1 ) === q )
        {
            const emp_id = window.location.href.split('/').pop().split('&&name=').shift();
            const name = window.location.href.split('/').pop().split('&&name=').pop();
            JSAlert.alert(`Tasks for quarter ${q} is not assigned yet!!`).dismissIn(1000 * 2);
            history.push('/acr/growth-review/' + emp_id + '&&name=' + name);
        }else
        if ( !qq && quarter < q )
        {
            JSAlert.alert(`Tasks for this quarter will assign you soon!!!`).dismissIn(1000 * 2);
        }else
        if ( !qq )
        {
            JSAlert.alert(`Tasks for quarter ${q} was not assigned!!`).dismissIn(1000 * 2);
        }
    }
    return (
        <>
            <BreadCrumb links={[{label: 'Performance Review', href: '/acr/options'}]} currentLabel={ "Growth Review For The Year " + new Date().getFullYear() } />
            <div className="ticket_container page-content popUps">
                {/* <div className="d-flex align-items-center justify-content-end">
                    <button className="btn submit px-2 ml-2 filter-emit" onClick={ () => setShowFilters(!ShowFilters) } type='button'>
                        { ShowFilters ? <><i className="las la-times"></i> Close</> : <><i className="las la-filter"></i> Filters</> }
                    </button>
                </div> */}
                {
                    ShowFilters
                    ?
                    <>
                        <div className='filter-content popUps mt-3'>
                            <div className='flex'>
                                <div className='w-50'>
                                    <label className="font-weight-bold mb-0">Company</label>
                                    <select className='form-control form-control-sm mb-2' onChange={ (e) => alert(e.target.value) }>
                                        <option value=''>Select Option</option>
                                        {
                                            Companies.sort().map(
                                                ( company, index ) => {
                                                    return <option key={ index } value={ company.company_code }>{ company.company_name }</option>;

                                                }
                                            )
                                        }
                                    </select>
                                </div>
                                <div className='w-100'>
                                    <label className="font-weight-bold mb-0">Search Employee</label>
                                    <input placeholder='Search Keywords...' type="search" onChange={ (e) => alert(e.target.value) } className='form-control form-control-sm mb-2' />
                                </div>
                            </div>
                            {/* <button className='btn light d-block ml-auto mt-2' type='reset'>Reset All</button> */}
                        </div>
                        <br />
                    </>
                    :null
                }
                <ul className="nav nav-tabs my-3">
                    <li className="nav-item" onClick={ () => { setStatus(''); sessionStorage.setItem('ACRView-Growth_review', '') } }>
                        <a className={ Status === '' ? 'nav-link active text-capitalize' : 'nav-link text-capitalize' }>All</a>
                    </li>
                    <li className="nav-item" onClick={ () => { setStatus('pending'); sessionStorage.setItem('ACRView-Growth_review', 'pending') } }>
                        <a className={ Status === 'pending' ? 'nav-link active text-capitalize' : 'nav-link text-capitalize' }>Pending</a>
                    </li>
                    <li className="nav-item" onClick={ () => { setStatus('assigned'); sessionStorage.setItem('ACRView-Growth_review', 'assigned') } }>
                        <a className={ Status === 'assigned' ? 'nav-link active text-capitalize' : 'nav-link text-capitalize' }>Assigned</a>
                    </li>
                    <li className="nav-item" onClick={ () => { setStatus('expired'); sessionStorage.setItem('ACRView-Growth_review', 'expired') } }>
                        <a className={ Status === 'expired' ? 'nav-link active text-capitalize' : 'nav-link text-capitalize' }>Expired</a>
                    </li>
                    <li className="nav-item" onClick={ () => { setStatus('upcoming'); sessionStorage.setItem('ACRView-Growth_review', 'upcoming') } }>
                        <a className={ Status === 'upcoming' ? 'nav-link active text-capitalize' : 'nav-link text-capitalize' }>Upcoming</a>
                    </li>
                </ul>
                <div className="quarter_grid" id="quarter_grid">
                    <div className="item" onClick={ () => onOpenQuarter(1) }>
                        <img src={ FolderIcon } alt="folder" width="70%" />
                        {
                            ( quarter > 1 || quarter === 1 ) && GrowthReviewData.filter( val => val.quarter === 1 ).length === 0
                            ?
                            <>
                                <p className="title pending">
                                    Expired
                                </p>
                                <p className="font-weight-bold mb-0">-</p>
                            </>
                            :
                            ( quarter === 4 ? true : ( quarter + 1 ) === 1 ) && GrowthReviewData.filter( val => val.quarter === 1 ).length === 0
                            ?
                            <>
                                <p className="title pending">
                                    Pending
                                </p>
                                <p className="font-weight-bold mb-0">-</p>
                            </>
                            :
                            GrowthReviewData.filter( val => val.quarter === 1 ).length > 0
                            ?
                            <>
                                <p className="title completed">
                                    Assigned
                                </p>
                                <p className="font-weight-bold mb-0">{ new Date(GrowthReviewData.filter( val => val.quarter === 1 )[0].created_date).toDateString() }</p>
                            </>
                            :null
                        }
                        <span>Quarter 1</span>
                    </div>
                    <div className="item" onClick={ () => onOpenQuarter(2) }>
                        <img src={ FolderIcon } alt="folder" width="70%" />
                        {
                            quarter < 2 && ( quarter + 1 !== 2 )
                            ?
                            <>
                                <p className="title">Upcoming</p>
                                <p className="font-weight-bold mb-0">-</p>
                            </>
                            :
                            ( quarter > 2 || quarter === 2 ) && GrowthReviewData.filter( val => val.quarter === 2 ).length === 0
                            ?
                            <>
                                <p className="title pending">
                                    Expired
                                </p>
                                <p className="font-weight-bold mb-0">-</p>
                            </>
                            :
                            ( quarter + 1 === 2 ) && GrowthReviewData.filter( val => val.quarter === 2 ).length === 0
                            ?
                            <>
                                <p className="title pending">
                                    Pending
                                </p>
                                <p className="font-weight-bold mb-0">-</p>
                            </>
                            :
                            GrowthReviewData.filter( val => val.quarter === 2 ).length > 0
                            ?
                            <>
                                <p className="title completed">
                                    Assigned
                                </p>
                                <p className="font-weight-bold mb-0">{ new Date(GrowthReviewData.filter( val => val.quarter === 2 )[0].created_date).toDateString() }</p>
                            </>
                            :null
                        }
                        <span>Quarter 2</span>
                    </div>
                    <div className="item" onClick={ () => onOpenQuarter(3) }>
                        <img src={ FolderIcon } alt="folder" width="70%" />
                        {
                            quarter < 3 && ( quarter + 1 !== 3 )
                            ?
                            <>
                                <p className="title">Upcoming</p>
                                <p className="font-weight-bold mb-0">-</p>
                            </>
                            :
                            ( quarter > 3 || quarter === 3 ) && GrowthReviewData.filter( val => val.quarter === 3 ).length === 0
                            ?
                            <>
                                <p className="title pending">
                                    Expired
                                </p>
                                <p className="font-weight-bold mb-0">-</p>
                            </>
                            :
                            ( quarter + 1 === 3 ) && GrowthReviewData.filter( val => val.quarter === 3 ).length === 0
                            ?
                            <>
                                <p className="title pending">
                                    Pending
                                </p>
                                <p className="font-weight-bold mb-0">-</p>
                            </>
                            :
                            GrowthReviewData.filter( val => val.quarter === 3 ).length > 0
                            ?
                            <>
                                <p className="title completed">
                                    Assigned
                                </p>
                                <p className="font-weight-bold mb-0">{ new Date(GrowthReviewData.filter( val => val.quarter === 3 )[0].created_date).toDateString() }</p>
                            </>
                            :null
                        }
                        <span>Quarter 3</span>
                    </div>
                    <div className="item" onClick={ () => onOpenQuarter(4) }>
                        <img src={ FolderIcon } alt="folder" width="70%" />
                        {
                            quarter < 4 && ( quarter + 1 !== 4 )
                            ?
                            <>
                                <p className="title">Upcoming</p>
                                <p className="font-weight-bold mb-0">-</p>
                            </>
                            :
                            ( quarter > 4 || quarter === 4 ) && GrowthReviewData.filter( val => val.quarter === 4 ).length === 0
                            ?
                            <>
                                <p className="title pending">
                                    Expired
                                </p>
                                <p className="font-weight-bold mb-0">-</p>
                            </>
                            :
                            ( quarter + 1 === 4 ) && GrowthReviewData.filter( val => val.quarter === 4 ).length === 0
                            ?
                            <>
                                <p className="title pending">
                                    Pending
                                </p>
                                <p className="font-weight-bold mb-0">-</p>
                            </>
                            :
                            GrowthReviewData.filter( val => val.quarter === 4 ).length > 0
                            ?
                            <>
                                <p className="title completed">
                                    Assigned
                                </p>
                                <p className="font-weight-bold mb-0">{ new Date(GrowthReviewData.filter( val => val.quarter === 4 )[0].created_date).toDateString() }</p>
                            </>
                            :null
                        }
                        <span>Quarter 4</span>
                    </div>
                </div>
            </div>
        </>
    )
}

const SelectOption = ( { enterReply, AllTickets, loadAllTickets, loadPeers, SelfSubmissions, loadAllSubmissions, loadSubordinatesForGrowthReview, EmpGrowthReviewData, Employees, Companies, SelfAssessmentData, quarter, Status, loadEmpGrowthReviewData, AccessControls, List, history, setStatus, loadSubordinates, loadSelfAssessmentData, loadTicketIssued, deleteTicket } ) => {

    const [ Your, setYour ] = useState(true);
    const [ AccessToViewAll, setAccessToViewAll ] = useState(false);
    const [ ViewAll, setViewAll ] = useState(false);
    const [ ShowFilters, setShowFilters ] = useState(false);
    const [ ConfirmRemoval, setConfirmRemoval ] = useState(false);
    const [ Content, setContent ] = useState(<></>);
    const [ TicketStatus, setTicketStatus ] = useState('');
    const [ IssuedBySearch, setIssuedBySearch ] = useState('');
    const [ IssuedToSearch, setIssuedToSearch ] = useState('');

    useEffect(
        () => {
            loadTicketIssued();
        }, []
    );
    useEffect(
        () => {
            if ( AccessControls )
            {
                for ( let y = 0; y < JSON.parse(AccessControls.access).length; y++ )
                {
                    if ( parseInt(JSON.parse(AccessControls.access)[y]) === 50 )
                    {
                        setAccessToViewAll(true);
                        return false;
                    }
                }
            }
        }, [ AccessControls ]
    );

    const removeTicket = ( ticket_id, allTickets ) => {
        let data = [];
        if (allTickets) {
            data = AllTickets.filter(val => val.ticket_id === ticket_id)[0];
        }else {
            data = List.filter(val => val.ticket_id === ticket_id)[0];
        }
        if ( data )
        {
            setContent(
                <>
                    <h6>Do you want to delete this ticket from <b>{data.issued_to_emp}</b>{AllTickets?<> issued by <b>{data.issued_emp}</b></>:null}?</h6>
                    <button className="btn d-block ml-auto submit mt-3" id="removalConfirmationBtn" onClick={ () => deleteTicket(data, allTickets, setConfirmRemoval) }>Confirm</button>
                </>
            )
            setConfirmRemoval(true);
        }
    }
    const onReply = ( ticket_id, generated_by, emp_id, generated_date ) => {
        let reply = $("#reply_box_" + ticket_id).text();
        console.log(reply);
        if ( reply === '' )
        {
            JSAlert.alert(`Reply box is empty!!!`).dismissIn(1000 * 2);
            return false;
        }
        enterReply(ticket_id, reply, generated_by, emp_id, generated_date);
    }
    
    return (
        <> 
            <Modal show={ ConfirmRemoval } Hide={ () => setConfirmRemoval(!ConfirmRemoval) } content={Content} />
            <div className="ticket_container page-content">
                <div className="px-3 pb-3">
                    <h3 className="heading">
                        Performance Review
                        <sub>Review your performance and set your goals</sub>
                    </h3>
                    <hr />
                    {/* <h3>Welcome To Performance Review, <b style={{ fontFamily: 'Poppins' }}>{ AccessControls ? AccessControls.name : null }</b></h3> */}
                    <ul className="nav nav-tabs my-3">
                        <li className="nav-item" onClick={ () => { setStatus('performance_review'); sessionStorage.setItem('ACRView', 'performance_review') } }>
                            <a className={ Status === 'performance_review' ? 'nav-link active text-capitalize' : 'nav-link text-capitalize' }>Performance Review</a>
                        </li>
                        <li className="nav-item" onClick={ () => { setStatus('peer_review'); sessionStorage.setItem('ACRView', 'peer_review') } }>
                            <a className={ Status === 'peer_review' ? 'nav-link active text-capitalize' : 'nav-link text-capitalize' }>Peer Review</a>
                        </li>
                        <li className="nav-item" onClick={ () => { setStatus('growth_review'); sessionStorage.setItem('ACRView', 'growth_review') } }>
                            <a className={ Status === 'growth_review' ? 'nav-link active text-capitalize' : 'nav-link text-capitalize' }>Growth Review</a>
                        </li>
                        <li className="nav-item" onClick={ () => { setStatus('self_assessment'); sessionStorage.setItem('ACRView', 'self_assessment') } }>
                            <a className={ Status === 'self_assessment' ? 'nav-link active text-capitalize' : 'nav-link text-capitalize' }>Self-Assessment</a>
                        </li>
                        <li className="nav-item ml-auto disabled">
                            <a className='nav-link text-capitalize disabled font-weight-bold' style={{ fontFamily: "cursive" }}>({new Date().getFullYear()})</a>
                        </li>
                    </ul>

                    {
                        Status === 'performance_review'
                        ?
                        <div className="popUps">
                            <div className="d-flex align-items-center justify-content-between">
                                {
                                    ViewAll
                                    ?
                                    <ul className="nav nav-tabs">
                                        <li className="nav-item" onClick={ () => setTicketStatus('') }>
                                            <a className={ TicketStatus === '' ? 'nav-link active text-capitalize' : 'nav-link text-capitalize' }>All {TicketStatus === '' && AllTickets && AllTickets.filter(val => val.ticket.includes(TicketStatus)).length}</a>
                                        </li>
                                        <li className="nav-item" onClick={ () => setTicketStatus('red') }>
                                            <a className={ TicketStatus === 'red' ? 'nav-link active text-capitalize' : 'nav-link text-capitalize' }>Red {TicketStatus === 'red' && AllTickets && AllTickets.filter(val => val.ticket.includes(TicketStatus)).length}</a>
                                        </li>
                                        <li className="nav-item" onClick={ () => setTicketStatus('green') }>
                                            <a className={ TicketStatus === 'green' ? 'nav-link active text-capitalize' : 'nav-link text-capitalize' }>Green {TicketStatus === 'green' && AllTickets && AllTickets.filter(val => val.ticket.includes(TicketStatus)).length}</a>
                                        </li>
                                        <li className="nav-item" onClick={ () => setTicketStatus('yellow') }>
                                            <a className={ TicketStatus === 'yellow' ? 'nav-link active text-capitalize' : 'nav-link text-capitalize' }>Yellow {TicketStatus === 'yellow' && AllTickets && AllTickets.filter(val => val.ticket.includes(TicketStatus)).length}</a>
                                        </li>
                                    </ul>
                                    :
                                    <>
                                        {
                                            Your
                                            ?
                                            <ul className="nav nav-tabs">
                                                <li className="nav-item" onClick={ () => setTicketStatus('') }>
                                                    <a className={ TicketStatus === '' ? 'nav-link active text-capitalize' : 'nav-link text-capitalize' }>All {TicketStatus === '' && List && List.filter(val => val.issued_emp_id == localStorage.getItem('EmpID') && val.ticket.includes(TicketStatus)).length}</a>
                                                </li>
                                                <li className="nav-item" onClick={ () => setTicketStatus('red') }>
                                                    <a className={ TicketStatus === 'red' ? 'nav-link active text-capitalize' : 'nav-link text-capitalize' }>Red {TicketStatus === 'red' && List && List.filter(val => val.issued_emp_id == localStorage.getItem('EmpID') && val.ticket.includes(TicketStatus)).length}</a>
                                                </li>
                                                <li className="nav-item" onClick={ () => setTicketStatus('green') }>
                                                    <a className={ TicketStatus === 'green' ? 'nav-link active text-capitalize' : 'nav-link text-capitalize' }>Green {TicketStatus === 'green' && List && List.filter(val => val.issued_emp_id == localStorage.getItem('EmpID') && val.ticket.includes(TicketStatus)).length}</a>
                                                </li>
                                                <li className="nav-item" onClick={ () => setTicketStatus('yellow') }>
                                                    <a className={ TicketStatus === 'yellow' ? 'nav-link active text-capitalize' : 'nav-link text-capitalize' }>Yellow {TicketStatus === 'yellow' && List && List.filter(val => val.issued_emp_id == localStorage.getItem('EmpID') && val.ticket.includes(TicketStatus)).length}</a>
                                                </li>
                                            </ul>
                                            :
                                            <ul className="nav nav-tabs">
                                                <li className="nav-item" onClick={ () => setTicketStatus('') }>
                                                    <a className={ TicketStatus === '' ? 'nav-link active text-capitalize' : 'nav-link text-capitalize' }>All {TicketStatus === '' && List && List.filter(val => val.issued_to_emp_id == localStorage.getItem('EmpID') && val.ticket.includes(TicketStatus)).length}</a>
                                                </li>
                                                <li className="nav-item" onClick={ () => setTicketStatus('red') }>
                                                    <a className={ TicketStatus === 'red' ? 'nav-link active text-capitalize' : 'nav-link text-capitalize' }>Red {TicketStatus === 'red' && List && List.filter(val => val.issued_to_emp_id == localStorage.getItem('EmpID') && val.ticket.includes(TicketStatus)).length}</a>
                                                </li>
                                                <li className="nav-item" onClick={ () => setTicketStatus('green') }>
                                                    <a className={ TicketStatus === 'green' ? 'nav-link active text-capitalize' : 'nav-link text-capitalize' }>Green {TicketStatus === 'green' && List && List.filter(val => val.issued_to_emp_id == localStorage.getItem('EmpID') && val.ticket.includes(TicketStatus)).length}</a>
                                                </li>
                                                <li className="nav-item" onClick={ () => setTicketStatus('yellow') }>
                                                    <a className={ TicketStatus === 'yellow' ? 'nav-link active text-capitalize' : 'nav-link text-capitalize' }>Yellow {TicketStatus === 'yellow' && List && List.filter(val => val.issued_to_emp_id == localStorage.getItem('EmpID') && val.ticket.includes(TicketStatus)).length}</a>
                                                </li>
                                            </ul>
                                        }
                                    </>
                                }
                                <div className="d-flex">
                                    {
                                        ViewAll
                                        ?
                                        <button className="btn light px-2 filter-emit" onClick={ () => setShowFilters(!ShowFilters) } type='button'>
                                            { ShowFilters ? <><i className="las la-times"></i> Close</> : <><i className="las la-filter"></i> Filters</> }
                                        </button>
                                        :null
                                    }
                                    <button className="btn submit ml-2" onClick={() => history.push('/acr/form/issue-to-subordinates')}>New</button>
                                    <div className="dropdown dropleft">
                                        <button className="btn ml-2" type="button" id="dropdownMenuButton" data-toggle="dropdown">
                                            <i className="las la-ellipsis-v"></i>
                                        </button>
                                        <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                            <a className={ Your && !ViewAll ? "dropdown-item active" : "dropdown-item" } onClick={ () => { setYour(true); setViewAll(false); } }>Issued By You</a>
                                            <a className={ !Your && !ViewAll ? "dropdown-item active" : "dropdown-item" } onClick={ () => { setYour(false); setViewAll(false); } }>Issued To You</a>
                                            {
                                                AccessToViewAll
                                                ?
                                                <>
                                                    <div className="dropdown-divider"></div>
                                                    <a className={ !ViewAll ? "dropdown-item" : "dropdown-item active" } onClick={ () => setViewAll(true) }>View All</a>
                                                </>
                                                :null
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {
                                ShowFilters?
                                <div className='filter-content popUps my-3'>
                                    <div className='flex'>
                                        <div className='w-100'>
                                            <label className="font-weight-bold mb-0">Search Employee (Issued By)</label>
                                            <input placeholder='Search Keywords...' type="search" onChange={ (e) => setIssuedBySearch(e.target.value) } className='form-control form-control-sm mb-2' />
                                        </div>
                                        <div className='w-100'>
                                            <label className="font-weight-bold mb-0">Search Employee (Issued To)</label>
                                            <input placeholder='Search Keywords...' type="search" onChange={ (e) => setIssuedToSearch(e.target.value) } className='form-control form-control-sm mb-2' />
                                        </div>
                                    </div>
                                    {/* <button className='btn light d-block ml-auto mt-2' type='reset'>Reset All</button> */}
                                </div>
                                :null
                            }
                            {
                                ViewAll
                                ?<AllTicketsView removeTicket={removeTicket} IssuedToSearch={ IssuedToSearch } IssuedBySearch={ IssuedBySearch } TicketStatus={ TicketStatus } AllTickets={ AllTickets } loadAllTickets={ loadAllTickets } />
                                :
                                <>
                                    {
                                        Your
                                        ?
                                        <>
                                            <p className="border px-3 rounded-pill bg-light my-2" style={{ width: 'fit-content' }}><small><b>Issued By You</b></small></p>
                                            <table className="table">
                                                <thead>
                                                    <tr>
                                                        <th>Sr.No</th>
                                                        <th>Ticket</th>
                                                        <th>Issued To</th>
                                                        <th colSpan={2}>Date</th>
                                                    </tr>   
                                                </thead>
                                                <tbody>
                                                    {
                                                        List && List.filter(val => val.issued_emp_id == localStorage.getItem('EmpID') && val.ticket.includes(TicketStatus)).map(
                                                            ( val, index ) => {
                                                                return (
                                                                    <tr key={index}>
                                                                        <td>{ index + 1 }</td>
                                                                        <td>
                                                                            <div className="d-flex align-items-center">
                                                                                <div className={ (val.ticket === 'red' ? 'bg-danger' : val.ticket === 'green' ? 'bg-success' : 'bg-warning') + ' rounded-circle mr-1' } style={{ width: '10px', height: '10px' }}></div>
                                                                                <span className={ (val.ticket === 'red' ? 'text-danger' : val.ticket === 'green' ? 'text-success' : 'text-warning') + ' text-capitalize' }>{ val.ticket }</span>
                                                                            </div>
                                                                        </td>
                                                                        <td>
                                                                            <b className="text-capitalize">{ val.issued_to_emp }</b><br />
                                                                            <span>{ val.remarks }</span>
                                                                        </td>
                                                                        <td>{ new Date(val.generated_date).toDateString() }</td>
                                                                        <td>
                                                                            <span className="text-danger pointer" onClick={ () => removeTicket(val.ticket_id) }>Remove</span>
                                                                        </td>
                                                                    </tr>
                                                                )
                                                            }
                                                        )
                                                    }
                                                </tbody>
                                            </table>
                                        </>
                                        :
                                        <>
                                            <p className="border px-3 rounded-pill bg-light my-2" style={{ width: 'fit-content' }}><small><b>Issued To You</b></small></p>
                                            <table className="table">
                                                <thead>
                                                    <tr>
                                                        <th>Sr.No</th>
                                                        <th>Ticket</th>
                                                        <th>Issued By</th>
                                                        <th>Date</th>
                                                    </tr>   
                                                </thead>
                                                <tbody>
                                                    {
                                                        List && List.filter(val => val.issued_to_emp_id == localStorage.getItem('EmpID') && val.ticket.includes(TicketStatus)).map(
                                                            ( val, index ) => {
                                                                return (
                                                                    <tr key={index} className="pointer pointer-hover">
                                                                        <td>{ index + 1 }</td>
                                                                        <td>
                                                                            <div className="d-flex align-items-center">
                                                                                <div className={ (val.ticket === 'red' ? 'bg-danger' : val.ticket === 'green' ? 'bg-success' : 'bg-warning') + ' rounded-circle mr-1' } style={{ width: '10px', height: '10px' }}></div>
                                                                                <span className={ (val.ticket === 'red' ? 'text-danger' : val.ticket === 'green' ? 'text-success' : 'text-warning') + ' text-capitalize' }>{ val.ticket }</span>
                                                                            </div>
                                                                        </td>
                                                                        {
                                                                            val.reply !== null
                                                                            ?
                                                                            <td>
                                                                                <b className="text-capitalize">{ val.issued_emp }</b><br />
                                                                                <span>{ val.remarks }</span>
                                                                                <div className="card card-body border-0 bg-light p-3 mt-2" style={{ whiteSpace: "pre-wrap" }}>
                                                                                    {val.reply}<br />
                                                                                    <div className="text-right mb-0 font-weight-bold">
                                                                                        { new Date(val.reply_date).toLocaleDateString() } at { val.reply_time }
                                                                                    </div>
                                                                                </div>
                                                                            </td>
                                                                            :
                                                                            <td>
                                                                                <div data-toggle="collapse" data-target={ "#reply_" + val.ticket_id } aria-expanded="false" aria-controls={ "reply_" + val.ticket_id }>
                                                                                    <b className="text-capitalize">{ val.issued_emp }</b><br />
                                                                                    <span>{ val.remarks }</span>
                                                                                </div>
                                                                                <div className="collapse mt-2" style={{ cursor: 'text' }} id={ "reply_" + val.ticket_id }>
                                                                                    <div className="card card-body" style={{ overflow: "overlay" }} id={ "reply_box_" + val.ticket_id } contentEditable>
                                                                                        Your reply here....
                                                                                    </div>
                                                                                    <button className="btn mt-2 d-block ml-auto reply_btn" onClick={ () => onReply( val.ticket_id, val.generated_by, val.emp_id, val.generated_date ) }>Reply</button>
                                                                                </div>
                                                                            </td>
                                                                        }
                                                                        <td>{ new Date(val.generated_date).toDateString() }</td>
                                                                    </tr>
                                                                )
                                                            }
                                                        )
                                                    }
                                                </tbody>
                                            </table>
                                        </>
                                    }
                                </>
                            }
                        </div>
                        :
                        Status === 'growth_review'
                        ?
                        <GrowthReviewComponent 
                            history={ history }
                            Employees={ Employees }
                            Companies={ Companies }
                            quarter={ quarter }
                            EmpGrowthReviewData={ EmpGrowthReviewData }

                            loadEmpGrowthReviewData={ loadEmpGrowthReviewData }
                            loadSubordinatesForGrowthReview={ loadSubordinatesForGrowthReview }
                        />
                        :
                        Status === 'self_assessment'
                        ?
                        <SelfAssessment 
                            history={ history }
                            SelfAssessmentData={ SelfAssessmentData }
                            quarter={ quarter }
                            SelfSubmissions={ SelfSubmissions }
                            Companies={ Companies }
                            AccessControls={ AccessControls }

                            loadAllSubmissions={ loadAllSubmissions }
                            loadSelfAssessmentData={ loadSelfAssessmentData }
                        />
                        :
                        Status === 'peer_review'
                        ?
                        <PeerReview 
                            Employees={ Employees }
                            history={ history }

                            loadPeers={ loadPeers }
                        />
                        :null
                    }
                </div>
            </div>
        </>
    )

}

const AllTicketsView = ({ removeTicket, IssuedToSearch, IssuedBySearch, TicketStatus, AllTickets, loadAllTickets }) => {
    useEffect(
        () => {
            loadAllTickets();
        }, []
    );
    if ( !AllTickets )
    {
        return <img src={loading} alt="loading..." width='50' height='50' className='d-block mx-auto' />
    }
    return (
        <>
            <p className="border px-3 rounded-pill bg-light my-2" style={{ width: 'fit-content' }}><small><b>View All Tickets</b></small></p>
            <table className="table">
                <thead>
                    <tr>
                        <th>Sr.No</th>
                        <th>Ticket</th>
                        <th>Issued By</th>
                        <th>Issued To</th>
                        <th colSpan={2}>Date</th>
                    </tr>   
                </thead>
                <tbody>
                    {
                        AllTickets.filter(val => val.ticket.includes(TicketStatus) && val.issued_emp.toLowerCase().includes(IssuedBySearch.toLowerCase()) && val.issued_to_emp.toLowerCase().includes(IssuedToSearch.toLowerCase())).map(
                            ( val, index ) => {
                                return (
                                    <tr key={index}>
                                        <td>{ index + 1 }</td>
                                        <td>
                                            <div className="d-flex align-items-center">
                                                <div className={ (val.ticket === 'red' ? 'bg-danger' : val.ticket === 'green' ? 'bg-success' : 'bg-warning') + ' rounded-circle mr-1' } style={{ width: '10px', height: '10px' }}></div>
                                                <span className={ (val.ticket === 'red' ? 'text-danger' : val.ticket === 'green' ? 'text-success' : 'text-warning') + ' text-capitalize' }>{ val.ticket }</span>
                                            </div>
                                        </td>
                                        <td><b className="text-capitalize">{ val.issued_emp }</b></td>
                                        <td>
                                            <b className="text-capitalize">{ val.issued_to_emp }</b><br />
                                            <span>{ val.remarks }</span>
                                        </td>
                                        <td>{ new Date(val.generated_date).toDateString() }</td>
                                        <td>
                                            <span className="text-danger pointer" onClick={ () => removeTicket(val.ticket_id, true) }>Remove</span>
                                        </td>
                                    </tr>
                                )
                            }
                        )
                    }
                </tbody>
            </table>
        </>
    )
}

const PeerReview = ({ history, Employees, loadPeers }) => {
    const today = new Date();
    const quarter = Math.floor((today.getMonth() + 3) / 3);
    useEffect(
        () => {
            loadPeers();
        }, []
    );
    if ( !Employees )
    {
        return <img src={loading} alt="loading..." width='50' height='50' className='d-block mx-auto' />
    }
    return (
        <>
            {
                Employees.length === 0
                ?
                <h6 className="text-center">No Peer Found</h6>
                :
                <div className="peer-grid-container">
                    {
                        Employees.map(
                            ( val, index ) => {
                                return (
                                    <div className="item" key={index} onClick={ () => history.push('/acr/peer-review/emp/' + val.emp_id + '&&name=' + val.name) }>
                                        <img src={process.env.REACT_APP_SERVER+'/images/employees/' + val.emp_image} alt="emp" />
                                        <label className="mb-0 mt-3"><b>{val.name}</b></label>
                                        <p className="mb-0">{val.designation_name}</p>
                                        {
                                            quarter === val.last_submitted_in_quarter
                                            ?
                                            <div className="peer-status completed">Submitted</div>
                                            :
                                            <div className="peer-status pending">Pending</div>
                                        }
                                    </div>
                                )
                            }
                        )
                    }
                </div>
            }
        </>
    )
}

const SelfAssessment = ({ AccessControls, SelfSubmissions, Companies, SelfAssessmentData, quarter, history, loadAllSubmissions, loadSelfAssessmentData }) => {
    const [ Your, setYour ] = useState(true);
    const [ ShowFilters, setShowFilters ] = useState(false);
    const [ AccessDefined, setAccessDefined ] = useState(false);
    const [ Admin, setAdmin ] = useState(false);
    const [ Status, setStatus ] = useState('pending');
    useEffect(
        () => {
            loadSelfAssessmentData();
            if ( sessionStorage.getItem('ACRView-Self_assessment') )
            {
                setStatus(sessionStorage.getItem('ACRView-Self_assessment'));
            }
            if ( sessionStorage.getItem('SelfAssessmentYours') )
            {
                setYour(sessionStorage.getItem('SelfAssessmentYours') == '1');
            }
        }, []
    );
    useEffect(
        () => {
            if ( SelfAssessmentData && document.getElementById('quarter_grid') !== null )
            {
                const quarter_grid = document.getElementById('quarter_grid').childNodes;
                for ( let x = 0; x < quarter_grid.length; x++)
                {
                    quarter_grid[x].style.display = 'block';
                }
                if ( Status === 'pending' )
                {
                    for ( let x = 0; x < quarter_grid.length; x++)
                    {
                        if ( quarter_grid[x].children[1].textContent.toLowerCase() !== 'pending' )
                        {
                            quarter_grid[x].style.display = 'none';
                        }
                    }
                }else
                if ( Status === 'submitted' )
                {
                    for ( let x = 0; x < quarter_grid.length; x++)
                    {
                        if ( quarter_grid[x].children[1].textContent.toLowerCase() !== 'submitted' )
                        {
                            quarter_grid[x].style.display = 'none';
                        }
                    }
                }else
                if ( Status === 'expired' )
                {
                    for ( let x = 0; x < quarter_grid.length; x++)
                    {
                        if ( quarter_grid[x].children[1].textContent.toLowerCase() !== 'expired' )
                        {
                            quarter_grid[x].style.display = 'none';
                        }
                    }
                }else
                if ( Status === 'upcoming' )
                {
                    for ( let x = 0; x < quarter_grid.length; x++)
                    {
                        if ( quarter_grid[x].children[1].textContent.toLowerCase() !== 'upcoming' )
                        {
                            quarter_grid[x].style.display = 'none';
                        }
                    }
                }
            }
        }, [ Status, SelfAssessmentData ] 
    )
    useEffect(
        () => {
            let accessKey = false;
            if ( AccessControls )
            {
                for ( let y = 0; y < JSON.parse(AccessControls.access).length; y++ )
                {
                    if ( parseInt(JSON.parse(AccessControls.access)[y]) === 49 )
                    {
                        accessKey = true;
                    }
                }
            }
            setAccessDefined(true);
            setAdmin(accessKey);
        }, [AccessControls]
    )
    if ( !SelfAssessmentData || !AccessDefined )
    {
        return <img src={loading} alt="loading..." width='50' height='50' className='d-block mx-auto' />
    }
    const onOpenQuarter = (q) => {
        let qq = SelfAssessmentData.filter( val => val.quarter === q )[0];
        if ( qq )
        {
            history.push('/acr/self-assessment/details/' + qq.id);
        }else
        if ( !qq && quarter > q )
        {
            JSAlert.alert(`Self Assessment Review for quarter ${q} was not submitted!!`).dismissIn(1000 * 2);
        }else
        if ( !qq && quarter === q )
        {
            JSAlert.alert(`Self Assessment Review for quarter ${q} is pending for submission!!`).dismissIn(1000 * 2);
            history.push('/acr/self-assessment');
        }else
        if ( !qq && quarter < q )
        {
            JSAlert.alert(`Self Assessment Review for this quarter will activate soon!!!`).dismissIn(1000 * 2);
        }
    }
    
    return (
        <>
            <div className="popUps">
                {
                    Admin
                    ?
                    <div className="d-flex justify-content-end">
                        {
                            !Your 
                            ? 
                            <button className="btn submit px-2 mr-2 filter-emit" onClick={ () => setShowFilters(!ShowFilters) } type='button'>
                                { ShowFilters ? <><i className="las la-times"></i> Close</> : <><i className="las la-filter"></i> Filters</> }
                            </button>
                            :null
                        }
                        <div className="btn-group">
                            <button onClick={ () => { setYour(true); sessionStorage.setItem("SelfAssessmentYours", '1') } } className={ Your ? "btn submit" : "btn light" }>Your Assessments</button>
                            <button onClick={ () => { setYour(false); sessionStorage.setItem("SelfAssessmentYours", '0') } } className={ Your ? "btn light" : "btn submit" }>Other</button>
                        </div>
                    </div>
                    :null
                }
                {
                    Your
                    ?
                    <>
                        <ul className="nav nav-tabs my-3">
                            <li className="nav-item" onClick={ () => { setStatus(''); sessionStorage.setItem('ACRView-Self_assessment', '') } }>
                                <a className={ Status === '' ? 'nav-link active text-capitalize' : 'nav-link text-capitalize' }>All</a>
                            </li>
                            <li className="nav-item" onClick={ () => { setStatus('pending'); sessionStorage.setItem('ACRView-Self_assessment', 'pending') } }>
                                <a className={ Status === 'pending' ? 'nav-link active text-capitalize' : 'nav-link text-capitalize' }>Pending</a>
                            </li>
                            <li className="nav-item" onClick={ () => { setStatus('submitted'); sessionStorage.setItem('ACRView-Self_assessment', 'submitted') } }>
                                <a className={ Status === 'submitted' ? 'nav-link active text-capitalize' : 'nav-link text-capitalize' }>Submitted</a>
                            </li>
                            <li className="nav-item" onClick={ () => { setStatus('expired'); sessionStorage.setItem('ACRView-Self_assessment', 'expired') } }>
                                <a className={ Status === 'expired' ? 'nav-link active text-capitalize' : 'nav-link text-capitalize' }>Expired</a>
                            </li>
                            <li className="nav-item" onClick={ () => { setStatus('upcoming'); sessionStorage.setItem('ACRView-Self_assessment', 'upcoming') } }>
                                <a className={ Status === 'upcoming' ? 'nav-link active text-capitalize' : 'nav-link text-capitalize' }>Upcoming</a>
                            </li>
                        </ul>
                        <div className="quarter_grid" id="quarter_grid">
                            <div className="item" onClick={ () => onOpenQuarter(1) }>
                                <img src={ FolderIcon } alt="folder" width="70%" />
                                {
                                    quarter > 1 && SelfAssessmentData.filter( val => val.quarter === 1 ).length === 0
                                    ?
                                    <>
                                        <p className="title pending">
                                            Expired
                                        </p>
                                        <p className="font-weight-bold mb-0">-</p>
                                    </>
                                    :
                                    quarter === 1 && SelfAssessmentData.filter( val => val.quarter === 1 ).length === 0
                                    ?
                                    <>
                                        <p className="title pending">
                                            Pending
                                        </p>
                                        <p className="font-weight-bold mb-0">-</p>
                                    </>
                                    :
                                    SelfAssessmentData.filter( val => val.quarter === 1 ).length > 0
                                    ?
                                    <>
                                        <p className="title completed">
                                            Submitted
                                        </p>
                                        <p className="font-weight-bold mb-0">{ new Date(SelfAssessmentData.filter( val => val.quarter === 1 )[0].submit_date).toDateString() }</p>
                                    </>
                                    :null
                                }
                                <span>Quarter 1</span>
                            </div>
                            <div className="item" onClick={ () => onOpenQuarter(2) }>
                                <img src={ FolderIcon } alt="folder" width="70%" />
                                {
                                    quarter < 2
                                    ?
                                    <>
                                        <p className="title">Upcoming</p>
                                        <p className="font-weight-bold mb-0">-</p>
                                    </>
                                    :
                                    quarter > 2 && SelfAssessmentData.filter( val => val.quarter === 2 ).length === 0
                                    ?
                                    <>
                                        <p className="title pending">
                                            Expired
                                        </p>
                                        <p className="font-weight-bold mb-0">-</p>
                                    </>
                                    :
                                    quarter === 2 && SelfAssessmentData.filter( val => val.quarter === 2 ).length === 0
                                    ?
                                    <>
                                        <p className="title pending">
                                            Pending
                                        </p>
                                        <p className="font-weight-bold mb-0">-</p>
                                    </>
                                    :
                                    SelfAssessmentData.filter( val => val.quarter === 2 ).length > 0
                                    ?
                                    <>
                                        <p className="title completed">
                                            Submitted
                                        </p>
                                        <p className="font-weight-bold mb-0">{ new Date(SelfAssessmentData.filter( val => val.quarter === 2 )[0].submit_date).toDateString() }</p>
                                    </>
                                    :null
                                }
                                <span>Quarter 2</span>
                            </div>
                            <div className="item" onClick={ () => onOpenQuarter(3) }>
                                <img src={ FolderIcon } alt="folder" width="70%" />
                                {
                                    quarter < 3
                                    ?
                                    <>
                                        <p className="title">Upcoming</p>
                                        <p className="font-weight-bold mb-0">-</p>
                                    </>
                                    :
                                    quarter > 3 && SelfAssessmentData.filter( val => val.quarter === 3 ).length === 0
                                    ?
                                    <>
                                        <p className="title pending">
                                            Expired
                                        </p>
                                        <p className="font-weight-bold mb-0">-</p>
                                    </>
                                    :
                                    quarter === 3 && SelfAssessmentData.filter( val => val.quarter === 3 ).length === 0
                                    ?
                                    <>
                                        <p className="title pending">
                                            Pending
                                        </p>
                                        <p className="font-weight-bold mb-0">-</p>
                                    </>
                                    :
                                    SelfAssessmentData.filter( val => val.quarter === 3 ).length > 0
                                    ?
                                    <>
                                        <p className="title completed">
                                            Submitted
                                        </p>
                                        <p className="font-weight-bold mb-0">{ new Date(SelfAssessmentData.filter( val => val.quarter === 3 )[0].submit_date).toDateString() }</p>
                                    </>
                                    :null
                                }
                                <span>Quarter 3</span>
                            </div>
                            <div className="item" onClick={ () => onOpenQuarter(4) }>
                                <img src={ FolderIcon } alt="folder" width="70%" />
                                {
                                    quarter < 4
                                    ?
                                    <>
                                        <p className="title">Upcoming</p>
                                        <p className="font-weight-bold mb-0">-</p>
                                    </>
                                    :
                                    quarter > 4 && SelfAssessmentData.filter( val => val.quarter === 4 ).length === 0
                                    ?
                                    <>
                                        <p className="title pending">
                                            Expired
                                        </p>
                                        <p className="font-weight-bold mb-0">-</p>
                                    </>
                                    :
                                    quarter === 4 && SelfAssessmentData.filter( val => val.quarter === 4 ).length === 0
                                    ?
                                    <>
                                        <p className="title pending">
                                            Pending
                                        </p>
                                        <p className="font-weight-bold mb-0">-</p>
                                    </>
                                    :
                                    SelfAssessmentData.filter( val => val.quarter === 4 ).length > 0
                                    ?
                                    <>
                                        <p className="title completed">
                                            Submitted
                                        </p>
                                        <p className="font-weight-bold mb-0">{ new Date(SelfAssessmentData.filter( val => val.quarter === 4 )[0].submit_date).toDateString() }</p>
                                    </>
                                    :null
                                }
                                <span>Quarter 4</span>
                            </div>
                        </div>
                    </>
                    :
                    <AllSelfAssessmentData 
                        SelfSubmissions={ SelfSubmissions }
                        history={ history }
                        Companies={ Companies }
                        ShowFilters={ ShowFilters }

                        loadAllSubmissions={ loadAllSubmissions }
                    />
                }
            </div>
        </>
    )
}

const AllSelfAssessmentData = ({ Companies, ShowFilters, history, SelfSubmissions, loadAllSubmissions }) => {
    const [ Company, setCompany ] = useState('');
    const [ Name, setName ] = useState('');
    useEffect(
        () => {
            loadAllSubmissions();
            if ( sessionStorage.getItem('self_assessment_emps_company') )
            {
                setCompany(sessionStorage.getItem('self_assessment_emps_company'));
            }
            if ( sessionStorage.getItem('self_assessment_emps_name') )
            {
                setName(sessionStorage.getItem('self_assessment_emps_name'));
            }
        }, []
    );
    if ( !SelfSubmissions )
    {
        return <img src={loading} alt="loading..." width='50' height='50' className='d-block mx-auto' />
    }
    return (
        <>
            {
                ShowFilters
                ?
                <>
                    <div className='filter-content popUps mt-3'>
                        <div className='flex'>
                            <div className='w-50'>
                                <label className="font-weight-bold mb-0">Company</label>
                                <select value={ Company } className='form-control form-control-sm mb-2' onChange={ (e) => { setCompany(e.target.value); sessionStorage.setItem('self_assessment_emps_company', e.target.value) } }>
                                    <option value=''>Select Option</option>
                                    {
                                        Companies.sort().map(
                                            ( company, index ) => {
                                                return <option key={ index } value={ company.company_name }>{ company.company_name }</option>;

                                            }
                                        )
                                    }
                                </select>
                            </div>
                            <div className='w-100'>
                                <label className="font-weight-bold mb-0">Search Employee</label>
                                <input value={ Name } placeholder='Search Keywords...' type="search" onChange={ (e) => { setName(e.target.value); sessionStorage.setItem('self_assessment_emps_name', e.target.value) } } className='form-control form-control-sm mb-2' />
                            </div>
                        </div>
                        {/* <button className='btn light d-block ml-auto mt-2' type='reset'>Reset All</button> */}
                    </div>
                    <br />
                </>
                :null
            }
            <table className="table mt-3">
                <thead>
                    <tr>
                        <th>Employee Code</th>
                        <th>Employee</th>
                        <th colSpan={2}>Company</th>
                    </tr>   
                </thead>
                <tbody>
                    {
                        SelfSubmissions.filter(val => val.company_name.toLowerCase().includes(Company.toLowerCase()) && val.name.toLowerCase().includes(Name.toLowerCase())).map(
                            ( val, index ) => {
                                return (
                                    <tr key={index} className="pointer pointer-hover" onClick={ () => history.push('/acr/self-assessment/details/' + val.id) }>
                                        <td>{ val.emp_id }</td>
                                        <td>
                                            <div className="d-flex align-items-center">
                                                <img src={ process.env.REACT_APP_SERVER+'/images/employees/' + val.emp_image } alt="employee" width="40" height="40" className="rounded-circle" />
                                                <div className="ml-2">
                                                    <b>{ val.name }</b><br />
                                                    <span>{ val.designation_name }</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td>{ val.company_name }</td>
                                        <td>
                                            {
                                                val.status
                                                ?
                                                <span className="border text-success px-2 border-success rounded-pill">Tasks Assigned</span>
                                                :
                                                <span className="border text-warning px-2 border-warning rounded-pill">Pending</span>
                                            }
                                        </td>
                                    </tr>
                                )
                            }
                        )
                    }
                </tbody>
            </table>
        </>
    )
}

const JuniorReview = ( { history, issueTicket, Employees, Ticket, setTicket, setEmployee, loadSeniors } ) => {

    useEffect(
        () => {
            loadSeniors();
        }, []
    );

    return (
        <>
            <div className="issue-to-subordinates">
                <div className="d-flex align-items-center justify-content-between">
                    <h3 className="heading">
                        Junior Review
                        <sub>Issue Tickets To Seniors</sub>
                    </h3>
                </div>
                <hr />
                <div className="issue-to-subordinates-grid">
                    <form onSubmit={ issueTicket } className="container-fluid">
                    {
                            Ticket === 'red'
                            ?
                            <div className="alert alert-danger">
                                <b className="text-capitalize">You have selected { Ticket } ticket</b> <br />
                                <p className="mb-0">Red ticket may affect the performance of the employee, kindly give only when the work is truly bad.</p>
                            </div>
                            :
                            Ticket === 'yellow'
                            ?
                            <div className="alert alert-warning">
                                <b className="text-capitalize">You have selected { Ticket } ticket</b> <br />
                                <p className="mb-0">Yellow ticket may affect the performance of the employee, kindly give only when the work is average.</p>
                            </div>
                            :
                            Ticket === 'green'
                            ?
                            <div className="alert alert-success">
                                <b className="text-capitalize">You have selected { Ticket } ticket</b> <br />
                                <p className="mb-0">Green ticket will improve the performance of the employee, kindly give only when the work is good.</p>
                            </div>
                            :null
                        }
                        <fieldset className="row">
                            <div className="col-lg-6 mb-3">
                                <label className="mb-0">Senior</label>
                                {
                                    Employees?
                                    <select required className="form-control" onChange={ ( e ) => setEmployee({ emp_id: e.target.options[e.target.selectedIndex].value, name: e.target.options[e.target.selectedIndex].text }) }>
                                        <option value=''>Select option</option>
                                        {
                                            Employees.map(
                                                val => {
                                                    return <option value={ val.emp_id }>{ val.name }</option>
                                                }
                                            )
                                        }
                                    </select>
                                    :
                                    <input type="text" className="form-control" value="Please Wait..." disabled />
                                }
                            </div>
                            <div className="col-lg-6 mb-3">
                                <label className="mb-0">Date</label>
                                <input type="text" className="form-control" value={ new Date().toDateString() } disabled />
                            </div>
                            <div className="col-lg-12 mb-3">
                                <label className="mb-0">Remarks</label>
                                <textarea className="form-control" rows={5} name="remarks" minLength={10} required />

                                <div className="text-right mt-3">
                                    <button className="btn light mr-3" onClick={ () => history.replace('/acr/options') }>Back</button>
                                    <button className="btn submit">Issue</button>
                                </div>
                            </div>
                        </fieldset>
                    </form>
                    <div>
                        <h6 className="font-weight-bold">Select Ticket Type</h6>
                        <hr className="w-100" />
                        <div className="type_container">
                            <div className="circle red" onClick={ () => setTicket('red') }></div>
                            <div className="circle yellow" onClick={ () => setTicket('yellow') }></div>
                            <div className="circle green" onClick={ () => setTicket('green') }></div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )

}