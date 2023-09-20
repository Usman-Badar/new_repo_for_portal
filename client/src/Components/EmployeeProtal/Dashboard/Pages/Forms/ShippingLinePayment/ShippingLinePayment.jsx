import React, { Suspense, lazy, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { GetCompanies, GetLocations, confirmApproveRequest, confirmClearRequest, confirmRejectRequest, loadCashiers, loadDetails, loadList, onSubmit, validateEmployee } from './Functions';

const UI = lazy( () => import('./UI') );

const ShippingLinePayment = () => {
    const history = useHistory();
    const AccessControls = useSelector( ( state ) => state.EmpAuth.EmployeeData );
    const Relations = useSelector((state) => state.EmpAuth.Relations);
    
    const [ Admin, setAdmin ] = useState(false);
    const [ Cashier, setCashier ] = useState(false);
    const [ AccessDefined, setAccessDefined ] = useState(false);

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
                    if ( parseInt(JSON.parse(AccessControls.access)[y]) === 52 )
                    {
                        setCashier(true);
                    }
                }
            }
            setAdmin(accessKey);
            setAccessDefined(true);
        }, [AccessControls]
    )

    return (
        <Suspense fallback={ <div>Loading...</div> }>
            <UI 
                history={ history }
                Relations={ Relations }
                Admin={ Admin }
                Cashier={ Cashier }
                AccessDefined={ AccessDefined }
                AccessControls={ AccessControls }

                GetLocations={ GetLocations }
                GetCompanies={ GetCompanies }
                confirmClearRequest={ confirmClearRequest }
                validateEmployee={ validateEmployee }
                loadCashiers={ loadCashiers }
                confirmApproveRequest={ confirmApproveRequest }
                confirmRejectRequest={ confirmRejectRequest }
                loadDetails={ loadDetails }
                onSubmit={ onSubmit }
                loadList={ loadList }
            />
        </Suspense>
    )
}

export default ShippingLinePayment;