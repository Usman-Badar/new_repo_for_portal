import axios from '../../../../../../axios';
import JSAlert from 'js-alert';
import $ from 'jquery';

export const getAllRequests = ( Admin, setRequestsList ) => {
    axios.post(
        '/inventory/get_all_repair_requests',
        {
            emp_id: localStorage.getItem('EmpID'),
            accessKey: Admin ? 1 : 0
        }
    ).then(
        res => {
            setRequestsList( res.data );
        }
    ).catch(
        err => {
            console.log( err );
        }
    );
}

export const getDetails = ( request_id, setDetails, setAttachments, setEmployees ) => {
    axios.post(
        '/inventory/get_repair_request_details',
        {
            request_id: request_id
        }
    ).then(
        res => {
            setDetails( res.data[0][0] );
            setAttachments( res.data[1] );
            setEmployees( res.data[2] );
            if ( res.data[0][0].status === 'sent' )
            {
                setToViewed( request_id )
            }
        }
    ).catch(
        err => {
            console.log( err );
        }
    )
}

const setToViewed = ( request_id ) => {
    axios.post(
        '/inventory/set_repair_request_to_viewed',
        {
            request_id: request_id
        }
    )
}

export const onCompleteRequest = ( e, Details, AfterAttachments, history ) => {

    e.preventDefault();
    $('#complete_btn').prop('disabled', true);
    $('fieldset').prop('disabled', true);
    const remarks = e.target['remarks'].value;
    const Data = new FormData();
    Data.append('request_id', Details.request_id);
    Data.append('remarks', remarks);
    Data.append('closed_by', localStorage.getItem('EmpID'));
    AfterAttachments.forEach(
        file => {
            Data.append("Attachments", file.file);
            Data.append("AttachmentName", file.name);
        }
    );
    axios.post(
        '/inventory/complete_repair_request',
        Data,
        {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }
    ).then(
        res => {
           if ( res.data === 'success' ) 
           {
                setTimeout(() => {
                    history.replace('/inventory/repair/requests');
                }, 2000);
                JSAlert.alert("Request has completed").dismissIn(1000 * 2);
           }else
           {
               $('fieldset').prop('disabled', false);
               JSAlert.alert("Something went wrong!!!").dismissIn(1000 * 2);
           }
        }
    ).catch(
        err => {
            console.log( err );
            $('#complete_btn').prop('disabled', false);
            $('fieldset').prop('disabled', false);
        }
    )

}

export const onAttachFiles = ( event, setAfterAttachments ) => {
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
                        name: "after_" + event.target.files[x].name
                    }
                );
            }
            setAfterAttachments( arr );
        }
    }
    if ( event.target.files[0] ) {
        reader.readAsDataURL( event.target.files[0] );
    }
}

export const onAssignRequest = ( e, Details, Employees, history ) => {
    e.preventDefault();
    const assign_to = e.target['assign_to'].value;
    $('#assign_to_btn').prop('disabled', true);
    $('fieldset').prop('disabled', true);
    axios.post(
        '/inventory/assign_repair_request',
        {
            request_id: Details.request_id,
            assign_to: assign_to
        }
    ).then(
        res => {
            if ( res.data === 'success' ) 
            {
                let name;
                for ( let x = 0; x < Employees.length; x++ )
                {
                    if ( parseInt(Employees[x].emp_id) === parseInt(assign_to) )
                    {
                        name = Employees[x].name;
                    }
                }
                setTimeout(() => {
                    history.replace('/inventory/repair/requests');
                }, 2000);
                JSAlert.alert('Request has assigned to ' + name).dismissIn(1000 * 2);
            }else
            {
                $('fieldset').prop('disabled', false);
                JSAlert.alert("Something went wrong!!!").dismissIn(1000 * 2);
            }
        }
    ).catch(
        err => {
            $('fieldset').prop('disabled', false);
            console.log( err );
        }
    )
}

export const setRequestToPending = ( e, history, request_id ) => {
    e.preventDefault();
    const reason = e.target['reason'].value;
    $('fieldset').prop('disabled', true);
    axios.post(
        '/inventory/set_repair_request_to_pending',
        {
            request_id: request_id,
            reason: reason
        }
    ).then(
        () => {
            setTimeout(() => {
                history.replace('/inventory/repair/requests');
            }, 2000);
            JSAlert.alert('Request has set to pending').dismissIn(1000 * 2);
        }
    ).catch(
        err => {
            $('fieldset').prop('disabled', false);
            console.error(err);
        }
    );
}

export const setRequestToRejection = ( e, history, request_id ) => {
    e.preventDefault();
    const reason = e.target['reason'].value;
    $('fieldset').prop('disabled', true);
    axios.post(
        '/inventory/set_repair_request_to_reject',
        {
            request_id: request_id,
            reason: reason
        }
    ).then(
        () => {
            setTimeout(() => {
                history.replace('/inventory/repair/requests');
            }, 2000);
            JSAlert.alert('Request has Rejected').dismissIn(1000 * 2);
        }
    ).catch(
        err => {
            console.error(err);
            $('fieldset').prop('disabled', false);
        }
    );
}