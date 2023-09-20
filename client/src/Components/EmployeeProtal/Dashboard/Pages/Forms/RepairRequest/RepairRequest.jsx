import React, { lazy, Suspense, useEffect, useState } from 'react';

import axios from '../../../../../../axios';
import $ from 'jquery';

import { newRequest, getLocations, getRequests, onAttachFiles, getDetails, getIncidents, newIncident, getIncidentDetails } from './Functions';
import { useHistory } from 'react-router-dom';
const UI = lazy( () => import('./UI') );
const Mail = lazy( () => import('../../../../../UI/Mail/Mail') );

const RepairRequest = () => {
    const history = useHistory();
    const [ Details, setDetails ] = useState();
    const [ Incident, setIncident ] = useState();
    const [ Attachments, setAttachments ] = useState([]);

    const [ Comment, setComment ] = useState('');
    const [ Locations, setLocations ] = useState([]);
    const [ RequestsList, setRequestsList ] = useState([]);
    const [ IncidentsList, setIncidentsList ] = useState([]);
    const [ ListAttachments, setListAttachments ] = useState([]);
    const [ Files, setFiles ] = useState([]);
    const [ Status, setStatus ] = useState('repair');
    const [ MailData, setMailData ] = useState(
        {
            subject: "",
            send_to: "",
            gender: "",
            receiver: "",
            message: ""
        }
    );

    useEffect(
        () => {
            
            getLocations( axios, setLocations );
            getRequests( axios, setRequestsList, setListAttachments );
            if (sessionStorage.getItem('reportingStatus'))
            {
                setStatus(sessionStorage.getItem('reportingStatus'));
            }

        }, []
    )

    useEffect(
        () => {
            
            if ( MailData.subject !== '' && MailData.send_to !== '' && MailData.gender !== '' && MailData.receiver !== '' && MailData.message !== '' )
            {
                $('#mail_form').trigger('click');
            }

        }, [ MailData.subject, MailData.send_to, MailData.gender, MailData.receiver, MailData.message ]
    );
    
    return (
        <>
            <Suspense fallback={ <div>Loading...</div> }>
                <UI 
                    Locations={ Locations }
                    RequestsList={ RequestsList }
                    ListAttachments={ ListAttachments }
                    Files={ Files }
                    history={ history }
                    Status={ Status }
                    Details={ Details }
                    IncidentsList={ IncidentsList }
                    Attachments={ Attachments }
                    Comment={ Comment }
                    Incident={ Incident }

                    setComment={ setComment }
                    getIncidents={ () => getIncidents( axios, setIncidentsList ) }
                    getDetails={ () => getDetails( axios, setDetails, setAttachments ) }
                    getIncidentDetails={ () => getIncidentDetails( axios, setIncident ) }
                    setStatus={ setStatus }
                    newIncident={ ( e ) => newIncident( e, history, axios, Comment, setComment ) }
                    newRequest={ (e) => newRequest(e, history, axios, Files, setRequestsList, setFiles, setListAttachments, setMailData) }
                    onAttachFiles={ (e) => onAttachFiles( e, setFiles ) }
                />
            </Suspense>
            <Mail
                data={ MailData }
            />
        </>
    );

}

export default RepairRequest;