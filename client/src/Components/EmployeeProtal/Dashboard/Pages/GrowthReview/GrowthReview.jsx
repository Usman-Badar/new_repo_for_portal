import React, { Suspense, lazy, useState } from 'react';

import { addRow, onSubmit } from './Functions';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
const UI = lazy(() => import('./UI'));

const GrowthReview = () => {
    const history = useHistory();
    const today = new Date();
    const quarter = Math.floor((today.getMonth() + 3) / 3) === 4 ? 1 : (Math.floor((today.getMonth() + 3) / 3) + 1);
    const currentQuarter = Math.floor((today.getMonth() + 3) / 3);
    const AccessControls = useSelector( ( state ) => state.EmpAuth.EmployeeData );
    const [ List, setList ] = useState();

    return (
        <>
            <Suspense fallback={<div>Loading....</div>}>
                <UI 
                    history={ history }
                    List={ List }
                    quarter={ quarter }
                    AccessControls={ AccessControls }
                    currentQuarter={ currentQuarter }

                    setList={ setList }
                    onSubmit={ () => onSubmit( history, quarter, List ) }
                    addRow={ (e) => addRow( e, quarter, List, setList ) }
                />
            </Suspense>
        </>
    )
}
export default GrowthReview;