import React, { Suspense, lazy, useEffect, useState } from 'react';
import { approveRequest, cancelRequest, clearRequest, fetchDetails, loadCashiers, loadRequests, onCreateAdvanceSalaryReq, rejectRequest, validateEmployee } from './Functions';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

const UI = lazy( () => import('./UI') );

const AdvanceSalary = () => {

    const history = useHistory();
    const AccessControls = useSelector( ( state ) => state.EmpAuth.EmployeeData );
    const [ Amount, setAmount ] = useState(1);
    const [ Requests, setRequests ] = useState([]);
    const [ RequestDetails, setRequestDetails ] = useState();
    const [ Admin, setAdmin ] = useState(false);
    const [ AccessDefined, setAccessDefined ] = useState(false);
    const [ Cancel, setCancel ] = useState(false);
    const [ Approve, setApprove ] = useState(false);
    const [ Reject, setReject ] = useState(false);
    const [ Money, setMoney ] = useState(false);
    const [ Cashiers, setCashiers ] = useState([]);
    const [ ClearMoney, setClearMoney ] = useState(false);

    useEffect(
        () => {
            let accessKey = false;
            if ( AccessControls )
            {
                for ( let y = 0; y < JSON.parse(AccessControls.access).length; y++ )
                {
                    if ( parseInt(JSON.parse(AccessControls.access)[y]) === 0 || parseInt(JSON.parse(AccessControls.access)[y]) === 47 )
                    {
                        accessKey = true;
                    }
                }
            }
            console.log(accessKey);
            setAdmin(accessKey);
            setAccessDefined(true);
        }, [AccessControls]
    )
    
    return (
        <Suspense fallback={ <div>Loading...</div> }>
            <UI 
                Amount={ Amount }
                AccessDefined={ AccessDefined }
                Requests={ Requests }
                RequestDetails={ RequestDetails }
                Cancel={ Cancel }
                Approve={ Approve }
                Reject={ Reject }
                Cashiers={ Cashiers }
                Money={ Money }
                ClearMoney={ ClearMoney }
                AccessControls={ AccessControls }

                clearRequest={ (e) => clearRequest( e, RequestDetails.requested_emp_name, RequestDetails.approved_by, RequestDetails.submitted_by, RequestDetails.amount, history ) }
                setClearMoney={ setClearMoney }
                validateEmployee={ (e, signature) => validateEmployee( e, RequestDetails.requested_emp_name, signature, RequestDetails.submitted_by, RequestDetails.amount, history ) }
                setMoney={ setMoney }
                approveRequest={ (e) => approveRequest( e, RequestDetails.submitted_by, RequestDetails.amount, history ) }
                loadCashiers={ () => loadCashiers( setCashiers ) }
                setReject={ setReject }
                setApprove={ setApprove }
                rejectRequest={ (e) => rejectRequest( e, RequestDetails.amount, RequestDetails.submitted_by, history ) }
                cancelRequest={ (e) => cancelRequest( e, RequestDetails.amount, RequestDetails.submitted_by, history, RequestDetails.approved_by ) }
                setCancel={ setCancel }
                fetchDetails={ ( request_id ) => fetchDetails( request_id, setRequestDetails ) }
                loadRequests={ () => loadRequests( Admin, setRequests ) }
                setAmount={ setAmount }
                onCreateAdvanceSalaryReq={ (e, setReason) => onCreateAdvanceSalaryReq( e, Amount, AccessControls, setReason, setAmount ) }
            />
        </Suspense>
    )
}

export default AdvanceSalary;