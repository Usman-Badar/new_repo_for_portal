/* eslint-disable react-hooks/exhaustive-deps */
import React, { Suspense, lazy, useEffect, useState } from 'react';

import { approveRequest, cancelRequest, clearRequest, loadCashiers, loadComments, loadDetails, loadPRDetails, loadSlipDetails, loadThumbs, newComment, onAttachCNICBack, onAttachCNICFront, rejectRequest, rejectVRequest, validateEmployee, verifyRequest } from './Functions';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import socket from '../../../../../../io';
const UI = lazy( () => import('./Ui') );

function RequestDetails() {
    const AccessControls = useSelector( ( state ) => state.EmpAuth.EmployeeData );
    const history = useHistory();
    
    const [ CNICFront, setCNICFront ] = useState();
    const [ CNICBack, setCNICBack ] = useState();
    const [ Cashiers, setCashiers ] = useState([]);
    const [ Comments, setComments ] = useState([]);
    const [ Details, setDetails ] = useState();
    const [ SlipDetails, setSlipDetails ] = useState();
    const [ Other, setOther ] = useState(false);
    const [ Approve, setApprove ] = useState(false);
    const [ Reject, setReject ] = useState(false);
    const [ VApprove, setVApprove ] = useState(false);
    const [ VReject, setVReject ] = useState(false);
    const [ Cancel, setCancel ] = useState(false);
    const [ Money, setMoney ] = useState(false);
    const [ ClearMoney, setClearMoney ] = useState(false);
    const [ CashierThumbs, setCashierThumbs ] = useState();
    
    const [ PRequestDetails, setPRequestDetails ] = useState();
    const [ Specifications, setSpecifications ] = useState();
    const [ AttachedQuotations, setAttachedQuotations ] = useState();

    useEffect(
        () => {
            loadDetails( setDetails );
            socket.on(
                'new_comment', () => {
                    loadComments( setComments );
                }
            );
        }, []
    );

    return (
        <Suspense fallback={ <div>Loading...</div> }>
            <UI 
                ClearMoney={ ClearMoney }
                Details={ Details }
                Cashiers={ Cashiers }
                Approve={ Approve }
                Reject={ Reject }
                Money={ Money }
                CashierThumbs={ CashierThumbs }
                AccessControls={ AccessControls }
                history={ history }
                Other={ Other }
                CNICFront={ CNICFront }
                CNICBack={ CNICBack }
                Cancel={ Cancel }
                VApprove={ VApprove }
                Comments={ Comments }
                VReject={ VReject }
                PRequestDetails={ PRequestDetails }
                Specifications={ Specifications }
                AttachedQuotations={ AttachedQuotations }
                SlipDetails={ SlipDetails }

                loadSlipDetails={ (slip_id) => loadSlipDetails(slip_id, setSlipDetails) }
                loadPRDetails={ () => loadPRDetails(Details.pr_id, setPRequestDetails, setSpecifications, setAttachedQuotations) }
                newComment={ (serial_no, comment, setComment) => newComment(serial_no, comment, Details, setComments, setComment) }
                loadComments={ () => loadComments( setComments ) }
                rejectVRequest={ (e) => rejectVRequest( e, Details.amount, Details.emp_id, history ) }
                setVApprove={ setVApprove }
                setVReject={ setVReject }
                cancelRequest={ (e) => cancelRequest( e, Details.amount, Details.emp_id, history, Details.approved_by ) }
                setCancel={ setCancel }
                onAttachCNICFront={ ( e ) => onAttachCNICFront( e, setCNICFront ) }
                onAttachCNICBack={ ( e ) => onAttachCNICBack( e, setCNICBack ) }
                setOther={ setOther }
                clearRequest={ (e) => clearRequest( e, Details.requested_emp_name, Details.recorded_by, Details.emp_id, Details.amount, history, AccessControls ) }
                validateEmployee={ (e, signature, Template1, Template2) => validateEmployee( e, Details.requested_emp_name, Other, CNICFront, CNICBack, signature, Template1, Template2, Details.emp_id, Details.amount, history ) }
                loadThumbs={ () => loadThumbs( Details.cashier, setCashierThumbs ) }
                setMoney={ setMoney }
                rejectRequest={ (e) => rejectRequest( e, Details.amount, Details.emp_id, history ) }
                setReject={ setReject }
                approveRequest={ (e) => approveRequest( e, Details.emp_id, Details.amount, AccessControls, history ) }
                loadCashiers={ () => loadCashiers( setCashiers ) }
                setApprove={ setApprove }
                setClearMoney={ setClearMoney }
                verifyRequest={ (e) => verifyRequest( e, Details.emp_id, Details.amount, Details.shp_line_adv, AccessControls, history ) }
            />
        </Suspense>
    );

}

export default RequestDetails;