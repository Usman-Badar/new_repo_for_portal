import axios from '../../../../../axios';
import socket from '../../../../../io';
import $ from 'jquery';
import { numberToWords } from "amount-to-words";
import JSAlert from 'js-alert';

export const onCreateAdvanceSalaryReq = ( e, Amount, AccessControls, setReason, setAmount ) => {

    e.preventDefault();

    const reason = e.target['reason'].value;
    const amount = Amount;
    const request_to = e.target['request_to'].value;
    $('fieldset').prop('disabled', true);
    axios.post(
        '/cash/advance/salary',
        {
            emp_id: localStorage.getItem("EmpID"),
            reason: reason,
            amount: amount,
            request_to: request_to,
            company_code: AccessControls.company_code,
            location_code: AccessControls.location_code,
            amountInWords: numberToWords(amount)
        }
    ).then(
        res => {
            $('fieldset').prop('disabled', false);
            if ( res.data.message )
            {
                const message = localStorage.getItem('name') + " has requested for advance salary for PKR (" + amount.toLocaleString('en') + ") - " + res.data.date + ' - ' + res.data.time;
                socket.emit( 'admin_notification', { link: res.data.link, message: message, owner: res.data.owner });
                JSAlert.alert("Advance Salary Request Has Been Created!!!").dismissIn(1000 * 2);
                $('#resetBtn').trigger('click');
                setAmount(1);
                setReason('');
            }else
            {   
                console.log(res.data);
                JSAlert.alert("Something Went Wrong!!!!").dismissIn(1000 * 2);
            }
        }
    ).catch(
        err => {
            $('fieldset').prop('disabled', false);
            console.log( err );
            JSAlert.alert("Something Went Wrong!!!!").dismissIn(1000 * 2);
        }
    );
}

export const loadRequests = ( Admin, setRequests ) => {
    axios.post(
        '/cash/advance/salary/requests',
        {
            emp_id: localStorage.getItem("EmpID"),
            accessKey: Admin ? 1 : 0
        }
    ).then(
        res => {
            setRequests( res.data );
        }
    ).catch(
        err => {
            console.log( err );
        }
    )
}

export const fetchDetails = ( request_id, setRequestDetails ) => {
    axios.post(
        '/cash/advance/salary/request/details',
        {
            request_id: request_id
        }
    ).then(
        res => {
            setRequestDetails( res.data[0] );
        }
    ).catch(
        err => {
            console.log( err );
        }
    )
}

export const cancelRequest = ( e, amount, emp_id, history, approved_by ) => {

    e.preventDefault();

    const remarks = e.target['reason'].value;
    $('fieldset').prop('disabled', true);
    axios.post(
        '/cash/advance/salary/cancel',
        {
            request_id: window.location.href.split('/').pop(),
            remarks: remarks,
            employee: emp_id,
            appr_by: approved_by,
            amount: amount
        }
    )
    .then(
        res => 
        {
            $('fieldset').prop('disabled', false);
            if ( res.data.message )
            {
                const message = localStorage.getItem('name') + " has cancelled his advance salary request - " + res.data.date + ' - ' + res.data.time;
                socket.emit( 'admin_notification', { link: res.data.link, message: message, owner: res.data.owner });
                JSAlert.alert("Advance Salary Request Has Been Cancelled!!!").dismissIn(1000 * 2);
                history.replace('/cash/advance/salary');;
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
        '/cash/advance/salary/reject',
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
                const message = localStorage.getItem('name') + " has rejected his advance salary request - " + res.data.date + ' - ' + res.data.time;
                socket.emit( 'admin_notification', { link: res.data.link, message: message, owner: res.data.owner });
                JSAlert.alert("Advance Salary Request Has Been Rejected!!!").dismissIn(1000 * 2);
                history.replace('/cash/advance/salary');;
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
        '/cash/advance/salary/approve',
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
                const message = localStorage.getItem('name') + " has approved an advance salary request - " + res.data.date + ' - ' + res.data.time;
                socket.emit( 'admin_notification', { link: res.data.link, message: message, owner: res.data.owner });
                JSAlert.alert("Advance Salary Request Has Been Approved!!!").dismissIn(1000 * 2);
                history.replace('/cash/advance/salary');
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

export const validateEmployee = ( e, requested_emp_name, signature, emp_id, amount, history ) => {

    e.preventDefault();

    const Data = new FormData();
    const id = emp_id;
    Data.append('request_id', window.location.href.split('/').pop());
    Data.append('employee', id);
    Data.append('signature', signature);
    Data.append('amount', amount);
    Data.append('emp_id', localStorage.getItem('EmpID'));
    Data.append('passcode', e.target['passcode'].value);

    $('fieldset').prop('disabled', true);
    axios.post(
        '/cash/advance/salary/validation',
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
                let message = requested_emp_name + " has collected amount PKR (" + amount.toLocaleString('en') + ") - " + res.data.date + ' - ' + res.data.time;
                socket.emit( 'admin_notification', { link: res.data.link, message: message, owner: res.data.owner });
                JSAlert.alert("Success!!! Amount Has Been Released").dismissIn(1000 * 2);
                history.replace('/cash/advance/salary');
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

export const clearRequest = ( e, requested_emp_name, approved_by, emp_id, amount, history ) => {

    e.preventDefault();
    $('fieldset').prop('disabled', true);
    axios.post(
        '/cash/advance/salary/clearance',
        {
            request_id: window.location.href.split('/').pop(),
            employee: emp_id,
            amount: amount,
            approved_by: approved_by,
            emp_id: localStorage.getItem('EmpID')
        }
    )
    .then(
        res => 
        {
            $('fieldset').prop('disabled', false);
            if ( res.data.message )
            {
                const message = requested_emp_name + " has cleared an advance salary request for PKR (" + amount.toLocaleString('en') + ") - " + res.data.date + ' - ' + res.data.time;
                socket.emit( 'admin_notification', { link: res.data.link, message: message, owner: res.data.owner });
                JSAlert.alert("Success!!! Amount (" + amount + ") Has Been Cleared").dismissIn(1000 * 2);
                history.replace('/cash/advance/salary');
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