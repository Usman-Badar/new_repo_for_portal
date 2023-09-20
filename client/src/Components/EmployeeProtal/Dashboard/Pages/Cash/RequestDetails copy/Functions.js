import axios from '../../../../../../axios';
import $ from 'jquery';
import JSAlert from 'js-alert';
import socket from '../../../../../../io';

export const loadDetails = ( setDetails ) => {
    axios.post(
        '/cash/load/request/details',
        {
            emp_id: localStorage.getItem('EmpID'),
            request_id: window.location.href.split('/').pop()
        }
    )
    .then(
        res => 
        {
            setDetails(res.data[0]);
        }
    ).catch(
        err => {
            console.log(err);
        }
    );
}

export const loadCashiers = ( setCashiers ) => {
    axios.get('/cash/load/request/cashiers')
    .then(
        res => 
        {
            setCashiers(res.data);
        }
    ).catch(
        err => {
            console.log(err);
        }
    );
}

export const approveRequest = ( e, emp_id, amount, history ) => {

    e.preventDefault();

    const remarks = e.target['remarks'].value;
    const submit_to = e.target['submit_to'].value;
    $('fieldset').prop('disabled', true);
    axios.post(
        '/cash/load/request/approve',
        {
            request_id: window.location.href.split('/').pop(),
            remarks: remarks,
            submit_to: submit_to,
            employee: emp_id,
            amount: amount,
            emp_id: localStorage.getItem('EmpID')
        }
    )
    .then(
        res => 
        {
            $('fieldset').prop('disabled', false);
            if ( res.data.message )
            {
                const message = localStorage.getItem('name') + " has approved an advance cash for PKR (" + amount.toLocaleString('en') + ") - " + res.data.date + ' - ' + res.data.time;
                socket.emit( 'admin_notification', { link: res.data.link, message: message, owner: res.data.owner });
                JSAlert.alert("Advance Cash Has Been Approved!!!").dismissIn(1000 * 2);
                history.replace('/cash/requests');
            }else
            {   
                console.log(res.data);
                JSAlert.alert("Something Went Wrong!!!!").dismissIn(1000 * 2);
            }
        }
    ).catch(
        err => {
            $('fieldset').prop('disabled', false);
            JSAlert.alert("Something Went Wrong!!!!").dismissIn(1000 * 2);
            console.log(err);
        }
    );
}

export const verifyRequest = ( e, emp_id, amount, history ) => {

    e.preventDefault();

    const remarks = e.target['remarks'].value;
    const submit_to = e.target['submit_to'].value;
    $('fieldset').prop('disabled', true);
    axios.post(
        '/cash/load/request/verify',
        {
            request_id: window.location.href.split('/').pop(),
            remarks: remarks,
            submit_to: submit_to,
            employee: emp_id,
            amount: amount,
            emp_id: localStorage.getItem('EmpID')
        }
    )
    .then(
        res => 
        {
            $('fieldset').prop('disabled', false);
            if ( res.data.message )
            {
                const message = localStorage.getItem('name') + " has verified an advance cash for PKR (" + amount.toLocaleString('en') + ") - " + res.data.date + ' - ' + res.data.time;
                socket.emit( 'admin_notification', { link: res.data.link, message: message, owner: res.data.owner });
                JSAlert.alert("Advance Cash Has Been Verified!!!").dismissIn(1000 * 2);
                history.replace('/cash/requests');
            }else
            {   
                console.log(res.data);
                JSAlert.alert("Something Went Wrong!!!!").dismissIn(1000 * 2);
            }
        }
    ).catch(
        err => {
            $('fieldset').prop('disabled', false);
            JSAlert.alert("Something Went Wrong!!!!").dismissIn(1000 * 2);
            console.log(err);
        }
    );
}

export const rejectRequest = ( e, amount, emp_id, history ) => {

    e.preventDefault();

    const remarks = e.target['remarks'].value;
    $('fieldset').prop('disabled', true);
    axios.post(
        '/cash/load/request/reject',
        {
            request_id: window.location.href.split('/').pop(),
            remarks: remarks,
            employee: emp_id,
            amount: amount,
            emp_id: localStorage.getItem('EmpID')
        }
    )
    .then(
        res => 
        {
            $('fieldset').prop('disabled', false);
            if ( res.data.message )
            {
                const message = localStorage.getItem('name') + " has rejected an advance cash for PKR (" + amount.toLocaleString('en') + ") - " + res.data.date + ' - ' + res.data.time;
                socket.emit( 'admin_notification', { link: res.data.link, message: message, owner: res.data.owner });
                JSAlert.alert("Advance Cash Has Been Rejected!!!").dismissIn(1000 * 2);
                history.replace('/cash/requests');;
            }else
            {   
                console.log(res.data);
                JSAlert.alert("Something Went Wrong!!!!").dismissIn(1000 * 2);
            }
        }
    ).catch(
        err => {
            $('fieldset').prop('disabled', false);
            JSAlert.alert("Something Went Wrong!!!!").dismissIn(1000 * 2);
            console.log(err);
        }
    );
}

export const rejectVRequest = ( e, amount, emp_id, history ) => {

    e.preventDefault();

    const remarks = e.target['remarks'].value;
    $('fieldset').prop('disabled', true);
    axios.post(
        '/cash/load/request/vreject',
        {
            request_id: window.location.href.split('/').pop(),
            remarks: remarks,
            employee: emp_id,
            amount: amount,
            emp_id: localStorage.getItem('EmpID')
        }
    )
    .then(
        res => 
        {
            $('fieldset').prop('disabled', false);
            if ( res.data.message )
            {
                const message = localStorage.getItem('name') + " has rejected an advance cash for PKR (" + amount.toLocaleString('en') + ") - " + res.data.date + ' - ' + res.data.time;
                socket.emit( 'admin_notification', { link: res.data.link, message: message, owner: res.data.owner });
                JSAlert.alert("Advance Cash Has Been Rejected!!!").dismissIn(1000 * 2);
                history.replace('/cash/requests');;
            }else
            {   
                console.log(res.data);
                JSAlert.alert("Something Went Wrong!!!!").dismissIn(1000 * 2);
            }
        }
    ).catch(
        err => {
            $('fieldset').prop('disabled', false);
            JSAlert.alert("Something Went Wrong!!!!").dismissIn(1000 * 2);
            console.log(err);
        }
    );
}

export const cancelRequest = ( e, amount, emp_id, history, approved_by ) => {

    e.preventDefault();

    const remarks = e.target['reason'].value;
    $('fieldset').prop('disabled', true);
    axios.post(
        '/cash/load/request/cancel',
        {
            request_id: window.location.href.split('/').pop(),
            remarks: remarks,
            employee: emp_id,
            appr_by: approved_by,
            amount: amount,
            emp_id: localStorage.getItem('EmpID')
        }
    )
    .then(
        res => 
        {
            $('fieldset').prop('disabled', false);
            if ( res.data.message )
            {
                const message = localStorage.getItem('name') + " has cancelled an advance cash for PKR (" + amount.toLocaleString('en') + ") - " + res.data.date + ' - ' + res.data.time;
                socket.emit( 'admin_notification', { link: res.data.link, message: message, owner: res.data.owner });
                JSAlert.alert("Advance Cash Has Been Cancelled!!!").dismissIn(1000 * 2);
                history.replace('/cash/requests');;
            }else
            {   
                console.log(res.data);
                JSAlert.alert("Something Went Wrong!!!!").dismissIn(1000 * 2);
            }
        }
    ).catch(
        err => {
            $('fieldset').prop('disabled', false);
            JSAlert.alert("Something Went Wrong!!!!").dismissIn(1000 * 2);
            console.log(err);
        }
    );
}

export const loadThumbs = ( cashier, setCashierThumbs ) => {
    axios.post(
        '/cash/load/thumbs',
        {
            cashier: cashier
        }
    )
    .then(
        res => 
        {
            setCashierThumbs(res.data);
        }
    ).catch(
        err => {
            console.log(err);
        }
    );
}

export const validateEmployee = ( e, requested_emp_name, Other, AttachedCNIC, Template1, Template2, emp_id, amount, history ) => {

    e.preventDefault();

    const Data = new FormData();
    const template1 = Template1;
    const template2 = Template2;
    const id = emp_id;

    Data.append('request_id', window.location.href.split('/').pop());
    Data.append('passcode', !Other ? e.target['passcode'].value : null);
    Data.append('receiving_person', Other ? e.target['receiving_person'].value : null);
    Data.append('receiving_person_contact', Other ? e.target['receiving_person_contact'].value : null);
    Data.append('employee', id);
    Data.append('template1', template1);
    Data.append('template2', template2);
    Data.append('amount', amount);
    Data.append('other', Other ? 'yes' : 'no');
    Data.append('emp_id', localStorage.getItem('EmpID'));
    AttachedCNIC.forEach(
        file => {
            Data.append("Attachments", file.file);
        }
    );

    $('fieldset').prop('disabled', true);
    axios.post(
        '/cash/validation',
        Data,
        {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }
    )
    .then(
        res => 
        {
            $('fieldset').prop('disabled', false);
            if ( res.data === 'not matched' )
            {
                JSAlert.alert("Password Not Matched!!!").dismissIn(1000 * 2);
            }else
            if ( res.data === 'err' )
            {
                console.log(res.data);
                JSAlert.alert("Something Went Wrong!!!!").dismissIn(1000 * 2);
            }else
            {   
                let message = "";
                if ( Other )
                {
                    message = e.target['receiving_person'].value + " has collect amount PKR (" + amount.toLocaleString('en') + ") on behalf of " + requested_emp_name + " - " + res.data.date + ' - ' + res.data.time;
                }else
                {
                    message = requested_emp_name + " has collected amount PKR (" + amount.toLocaleString('en') + ") - " + res.data.date + ' - ' + res.data.time;
                }
                socket.emit( 'admin_notification', { link: res.data.link, message: message, owner: res.data.owner });
                JSAlert.alert("Success!!! Amount Has Been Released").dismissIn(1000 * 2);
                history.replace('/cash/requests');
            }
        }
    ).catch(
        err => {
            $('fieldset').prop('disabled', false);
            JSAlert.alert("Something Went Wrong!!!!").dismissIn(1000 * 2);
            console.log(err);
        }
    );
}

export const clearRequest = ( e, requested_emp_name, recorded_by, emp_id, amount, history ) => {

    e.preventDefault();

    const after_amount = e.target['after_amount'].value;
    $('fieldset').prop('disabled', true);
    axios.post(
        '/cash/request/clearance',
        {
            request_id: window.location.href.split('/').pop(),
            after_amount: after_amount,
            employee: emp_id,
            amount: amount,
            recorded_by: recorded_by,
            emp_id: localStorage.getItem('EmpID')
        }
    )
    .then(
        res => 
        {
            $('fieldset').prop('disabled', false);
            if ( res.data.message )
            {
                const message = requested_emp_name + " has cleared his advance cash for PKR (" + amount.toLocaleString('en') + ") - " + res.data.date + ' - ' + res.data.time;
                socket.emit( 'admin_notification', { link: res.data.link, message: message, owner: res.data.owner });
                JSAlert.alert("Success!!! Amount (" + amount + ") Has Been Cleared").dismissIn(1000 * 2);
                history.replace('/cash/requests');
            }else
            {
                console.log(res.data);
                JSAlert.alert("Something Went Wrong!!!!").dismissIn(1000 * 2);
            }
        }
    ).catch(
        err => {
            $('fieldset').prop('disabled', false);
            JSAlert.alert("Something Went Wrong!!!!").dismissIn(1000 * 2);
            console.log(err);
        }
    );
}

export const onAttachCNIC = ( event, AttachedCNIC, setAttachedCNIC ) => {
    const reader = new FileReader();
    reader.onload = () => {
        if( reader.readyState === 2 )
        {
            let arr = AttachedCNIC;
            for ( let x= 0; x < 2; x++ ) // event.target.files.length
            {
                arr = [...arr, {file: event.target.files[x], name: event.target.files[x].name, extension: event.target.files[x].type}];
            }
            setAttachedCNIC(arr);
        }
    }
    if ( event.target.files[0] ) {
        reader.readAsDataURL( event.target.files[0] );
    }
}