import React, { Suspense, lazy, useEffect, useState } from 'react';

import { approveRequest, cancelRequest, clearRequest, loadCashiers, loadDetails, loadHODs, loadThumbs, onAttachCNIC, rejectRequest, rejectVRequest, validateEmployee, verifyRequest } from './Functions';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
const UI = lazy( () => import('./Ui') );

function RequestDetails() {
    const AccessControls = useSelector( ( state ) => state.EmpAuth.EmployeeData );
    const history = useHistory();
    
    const [ AttachedCNIC, setAttachedCNIC ] = useState([]);
    const [ Cashiers, setCashiers ] = useState([]);
    const [ Details, setDetails ] = useState();
    const [ Other, setOther ] = useState(false);
    const [ Approve, setApprove ] = useState(false);
    const [ Reject, setReject ] = useState(false);
    const [ VApprove, setVApprove ] = useState(false);
    const [ VReject, setVReject ] = useState(false);
    const [ Cancel, setCancel ] = useState(false);
    const [ Money, setMoney ] = useState(false);
    const [ ClearMoney, setClearMoney ] = useState(false);
    const [ CashierThumbs, setCashierThumbs ] = useState();

    useEffect(
        () => {
            loadDetails( setDetails );
        }, []
    );

    return (
        <Suspense fallback={ <div>Loading...</div> }>
            <UI 
                ClearMoney={ ClearMoney }
                Details={ Details }
                Approve={ Approve }
                Cashiers={ Cashiers }
                Reject={ Reject }
                Money={ Money }
                CashierThumbs={ CashierThumbs }
                AccessControls={ AccessControls }
                history={ history }
                Other={ Other }
                AttachedCNIC={ AttachedCNIC }
                Cancel={ Cancel }
                VApprove={ VApprove }
                VReject={ VReject }

                rejectVRequest={ (e) => rejectVRequest( e, Details.amount, Details.emp_id, history ) }
                setVApprove={ setVApprove }
                setVReject={ setVReject }
                cancelRequest={ (e) => cancelRequest( e, Details.amount, Details.emp_id, history, Details.approved_by ) }
                setCancel={ setCancel }
                onAttachCNIC={ ( e ) => onAttachCNIC( e, AttachedCNIC, setAttachedCNIC ) }
                setOther={ setOther }
                clearRequest={ (e) => clearRequest( e, Details.requested_emp_name, Details.recorded_by, Details.emp_id, Details.amount, history ) }
                validateEmployee={ (e, Template1, Template2) => validateEmployee( e, Details.requested_emp_name, Other, AttachedCNIC, Template1, Template2, Details.emp_id, Details.amount, history ) }
                loadThumbs={ () => loadThumbs( Details.cashier, setCashierThumbs ) }
                setMoney={ setMoney }
                rejectRequest={ (e) => rejectRequest( e, Details.amount, Details.emp_id, history ) }
                setReject={ setReject }
                approveRequest={ (e) => approveRequest( e, Details.emp_id, Details.amount, history ) }
                loadCashiers={ () => loadCashiers( setCashiers ) }
                setApprove={ setApprove }
                setClearMoney={ setClearMoney }
                verifyRequest={ (e) => verifyRequest( e, Details.emp_id, Details.amount, history ) }
            />
        </Suspense>
    );

}

export default RequestDetails;