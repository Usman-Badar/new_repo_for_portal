import React, { Suspense, lazy } from 'react';
import { useHistory } from 'react-router-dom';
import { GetCompanies, loadDetails, loadList, setReportToPaid, setToCheck, setToPaid, submitReport } from './Funtions';
import { useSelector } from 'react-redux';

const UI = lazy( () => import('./UI') );

const CSCRefund = () => {
    const history = useHistory();
    const AccessControls = useSelector( ( state ) => state.EmpAuth.EmployeeData );
    const Relations = useSelector((state) => state.EmpAuth.Relations);
    return (
        <Suspense fallback={ <div>Loading...</div> }>
            <UI 
                history={ history }
                Relations={ Relations }
                AccessControls={ AccessControls }

                setReportToPaid={ setReportToPaid }
                submitReport={ submitReport }
                GetCompanies={ GetCompanies }
                loadList={ loadList }
                loadDetails={ loadDetails }
                setToCheck={ setToCheck }
                setToPaid={ setToPaid }
            />
        </Suspense>
    )
}

export default CSCRefund;