/* eslint-disable react-hooks/exhaustive-deps */
import React, { Suspense, lazy, useEffect, useState } from 'react';
import { getLeaveChartData, getLeaveData, sortLeavesData } from './Functions';

const UI = lazy( () => import('./UI') );

function Home() {

    const [ User, setUser ] = useState(1); // Or 0
    const [ LeaveData, setLeaveData ] = useState();
    const [ RequestByOrTo, setRequestByOrTo ] = useState('0');
    const [ InitialLeaveData, setInitialLeaveData ] = useState();
    const [ Leaves, setLeaves ] = useState();
    const [ GroupBy, setGroupBy ] = useState('1');
    const [ LeaveType, setLeaveType ] = useState('leave');

    useEffect(
        () => {
            setInitialLeaveData();
            setLeaves();
            getLeaveData( User, LeaveType, setLeaveData );
        }, [ LeaveType ]
    )

    useEffect(
        () => {
            if ( LeaveData && !InitialLeaveData )
            {
                getLeaveChartData( User, LeaveType, setInitialLeaveData );
            }
        }, [ LeaveData, LeaveType ]
    )

    useEffect(
        () => {
            if ( LeaveData && InitialLeaveData )
            {
                sortLeavesData( InitialLeaveData, GroupBy, setLeaves );
            }
        }, [ GroupBy, InitialLeaveData ]
    )

    return (
        <Suspense fallback={ <div>Loading...</div> }>
            <UI 
                LeaveType={ LeaveType }
                LeaveData={ LeaveData }
                Leaves={ Leaves }
                RequestByOrTo={ RequestByOrTo }

                setGroupBy={ setGroupBy }
                setRequestByOrTo={ setRequestByOrTo }
                setLeaveType={ setLeaveType }
            />
        </Suspense>
    )
}

export default Home;