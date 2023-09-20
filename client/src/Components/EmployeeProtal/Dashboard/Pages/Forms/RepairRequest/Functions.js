import $ from 'jquery';
import JSAlert from 'js-alert';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const newRequest = ( e, history, axios, Files, setRequestsList, setFiles, setListAttachments, setMailData ) => {

    e.preventDefault();
    const location = e.target['location_code'].value;
    const subject = e.target['subject'].value;
    const description = e.target['description'].value;
    const Data = new FormData();
    $('fieldset').prop('disabled', true);
    Data.append('location', location);
    Data.append('subject', subject);
    Data.append('description', description);
    Data.append('request_by', localStorage.getItem("EmpID"));
    Files.forEach(
        file => {
            Data.append("Attachments", file.file);
        }
    );

    axios.post(
        '/inventory/new_repair_request',
        Data, 
        {

            headers: {
                "Content-Type": "multipart/form-data"
            }

        }
    ).then(
        res => {
            const Data2 = new FormData();
            Data2.append('eventID', 2);
            Data2.append('whatsapp', true);
            Data2.append('receiverID', res.data.emp_id);
            Data2.append('senderID', localStorage.getItem('EmpID'));
            Data2.append('Title', localStorage.getItem('name'));
            Data2.append('NotificationBody', localStorage.getItem('name') + ' has sent a new repair request.')
            axios.post('/newnotification', Data2).then(() => {
                
                setFiles([]);
                setMailData(
                    {
                        subject: "New Repair Request",
                        send_to: res.data.email,
                        gender: "Sir",
                        receiver: res.data.name,
                        message: localStorage.getItem('name') + ' has sent a new repair request.'
                    }
                )
                // getRequests(axios, setRequestsList, setListAttachments);
                JSAlert.alert("Repair request has been generated.").dismissIn(1000 * 2);
                history.push('/repair_request');
                toast.dark("Request Generated.", {
                    position: 'top-center',
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            })
        }
    ).catch(
        err => {

            $('fieldset').prop('disabled', false);
            toast.dark("Error: " + err.message, {
                position: 'top-center',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            console.log( err );

        }
    )

}

export const newIncident = ( e, history, axios, Comment, setComment ) => {

    e.preventDefault();

    if ( Comment === '' || Comment === '<p><br></p>' )
    {
        JSAlert.alert("Description is required.").dismissIn(1000 * 2);
        return false;
    }

    const location = e.target['location_code'].value;
    const subject = e.target['subject'].value;
    const type = e.target['type'].value;
    const Data = new FormData();
    $('fieldset').prop('disabled', true);
    Data.append('location', location);
    Data.append('subject', subject);
    Data.append('type', type);
    Data.append('description', Comment);
    Data.append('request_by', localStorage.getItem("EmpID"));

    axios.post(
        '/inventory/new_incident_report',
        Data
    ).then(
        () => {
            setComment('');
            JSAlert.alert("Incident Report has been generated.").dismissIn(1000 * 2);
            history.push('/repair_request');
        }
    ).catch(
        err => {

            $('fieldset').prop('disabled', false);
            console.log( err );

        }
    )

}

export const getLocations = ( axios, setLocations ) => {

    axios.get(
        '/inventory/get_locations'
    ).then(
        res => {

            setLocations( res.data );

        }
    ).catch(
        err => {

            console.log( err );

        }
    )

}

export const getRequests = ( axios, setRequestsList, setListAttachments ) => {

    axios.post(
        '/inventory/get_repair_requests',
        {
            request_by: localStorage.getItem("EmpID")
        }
    ).then(
        res => {

            setRequestsList( res.data[0] );
            setListAttachments( res.data[1] );

        }
    ).catch(
        err => {

            console.log( err );

        }
    )

}

export const getIncidents = ( axios, setIncidentsList ) => {
    axios.post(
        '/inventory/get_incidents',
        {
            reported_by: localStorage.getItem("EmpID")
        }
    ).then(
        res => {
            setIncidentsList(res.data);
        }
    ).catch(
        err => {
            console.log( err );
        }
    )
}

export const onAttachFiles = ( event, setFiles ) => {

    const reader = new FileReader();
    
    reader.onload = () => {

        if( reader.readyState === 2 )
        {

            let arr = [];

            for ( let x= 0; x < event.target.files.length; x++ )
            {
                arr.push( 
                    {
                        file: event.target.files[x],
                        name: event.target.files[x].name
                    }
                 );
            }

            setFiles( arr );

        }

        
    }

    if ( event.target.files[0] ) {
        reader.readAsDataURL( event.target.files[0] );
    }

}

export const getDetails = ( axios, setDetails, setAttachments ) => {
    axios.post(
        '/inventory/get_repair_request_details',
        {
            request_id: window.location.href.split('/').pop()
        }
    ).then(
        res => {
            setDetails( res.data[0][0] );
            setAttachments( res.data[1] );
        }
    ).catch(
        err => {
            console.log( err );
        }
    )
}

export const getIncidentDetails = ( axios, setIncident ) => {
    axios.post(
        '/inventory/get_incident_report_details',
        {
            request_id: window.location.href.split('/').pop()
        }
    ).then(
        res => {
            setIncident( res.data[0] );
        }
    ).catch(
        err => {
            console.log( err );
        }
    )
}