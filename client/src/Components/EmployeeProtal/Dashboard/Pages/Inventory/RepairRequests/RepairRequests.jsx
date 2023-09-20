/* eslint-disable react-hooks/exhaustive-deps */
import React, { Suspense, lazy, useEffect, useState } from 'react';
import { getAllRequests, getDetails, onAssignRequest, onAttachFiles, onCompleteRequest, setRequestToPending, setRequestToRejection } from './Functions';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';

const UI = lazy( () => import('./UI') );

function RepairRequests() {

    const AccessControls = useSelector( ( state ) => state.EmpAuth.EmployeeData );
    const history = useHistory();

    const [ AccessDefined, setAccessDefined ] = useState(false);
    const [ Admin, setAdmin ] = useState(false);
    const [ Requests, setRequests ] = useState([]);
    const [ FilterSubject, setFilterSubject ] = useState('');
    const [ LoadedLocations, setLoadedLocations ] = useState([]);
    const [ LoadedStatuses, setLoadedStatuses ] = useState([]);
    const [ FilterDescription, setFilterDescription ] = useState('');
    const [ FilterLocation, setFilterLocation ] = useState('');
    const [ Status, setStatus ] = useState('');

    const [ Reject, setReject ] = useState(false);
    const [ Pending, setPending ] = useState(false);
    const [ AssignTo, setAssignTo ] = useState(false);
    const [ Complete, setComplete ] = useState(false);
    const [ Details, setDetails ] = useState();
    const [ Employees, setEmployees ] = useState([]);
    const [ Attachments, setAttachments ] = useState([]);
    const [ AfterAttachments, setAfterAttachments ] = useState([]);

    useEffect(
        () => {
            if ( AccessControls && AccessDefined )
            {
                getAllRequests(Admin, setRequests);
            }
        }, [ AccessControls, AccessDefined ]
    );

    useEffect(
        () => {
            let accessKey = false;
            if ( AccessControls )
            {
                for ( let y = 0; y < JSON.parse(AccessControls.access).length; y++ )
                {
                    if ( parseInt(JSON.parse(AccessControls.access)[y]) === 0 || parseInt(JSON.parse(AccessControls.access)[y]) === 46 )
                    {
                        accessKey = true;
                    }
                }
            }
            setAdmin(accessKey);
            setAccessDefined(true);
        }, [AccessControls]
    )

    useEffect(
        () => {
            if ( Requests.length > 0 )
            {
                let locationNames = [];
                let statuses = [];
                for ( let x = 0; x < Requests.length; x++ )
                {
                    if ( !locationNames.includes( Requests[x].location_name ) )
                    {
                        locationNames.push(Requests[x].location_name);
                    }
                    if ( !statuses.includes( Requests[x].status ) )
                    {
                        statuses.push(Requests[x].status);
                    }
                }
                setLoadedLocations( locationNames );
                setLoadedStatuses( statuses );
                if (sessionStorage.getItem('RepairStatus'))
                {
                    setStatus(sessionStorage.getItem('RepairStatus'));
                }
            }

        // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [ Requests ]
    )

    useEffect(
        () => {
            if ( sessionStorage.getItem('FilterRepairLocation') )
            {
                setFilterLocation(sessionStorage.getItem('FilterRepairLocation'));
            }
            if ( sessionStorage.getItem('FilterRepairSubject') )
            {
                setFilterSubject(sessionStorage.getItem('FilterRepairSubject'));
            }
            if ( sessionStorage.getItem('FilterRepairDescription') )
            {
                setFilterDescription(sessionStorage.getItem('FilterRepairDescription'));
            }
        }, []
    );

    return (
        <>
            <Suspense fallback={ <div>Loading...</div> }>
                <UI 
                    Requests={ Requests }
                    FilterSubject={ FilterSubject }
                    FilterDescription={ FilterDescription }
                    LoadedLocations={ LoadedLocations }
                    FilterLocation={ FilterLocation }
                    LoadedStatuses={ LoadedStatuses }
                    Details={ Details }
                    Employees={ Employees }
                    Attachments={ Attachments }
                    AssignTo={ AssignTo }
                    Pending={ Pending }
                    Reject={ Reject }
                    Status={ Status }
                    Complete={ Complete }

                    setStatus={ setStatus }
                    setComplete={ setComplete }
                    setReject={ setReject }
                    setPending={ setPending }
                    setAssignTo={ setAssignTo }
                    onCompleteRequest={ ( e ) => onCompleteRequest( e, Details, AfterAttachments, history ) }
                    onAttachFiles={ (e) => onAttachFiles( e, setAfterAttachments ) }
                    onReject={ (e) => setRequestToRejection( e, history, window.location.href.split('/').pop() ) }
                    onPending={ (e) => setRequestToPending( e, history, window.location.href.split('/').pop() ) }
                    onAssignRequest={ ( e ) => onAssignRequest( e, Details, Employees, history ) }
                    getDetails={ ( request_id ) => getDetails( request_id, setDetails, setAttachments, setEmployees ) }
                    setFilterLocation={ (val) => { setFilterLocation(val); sessionStorage.setItem('FilterRepairLocation', val) } }
                    setFilterSubject={ (val) => { setFilterSubject(val); sessionStorage.setItem('FilterRepairSubject', val) } }
                    setFilterDescription={ (val) => { setFilterDescription(val); sessionStorage.setItem('FilterRepairDescription', val) } }
                />
            </Suspense>
        </>
    )
}

export default RepairRequests;