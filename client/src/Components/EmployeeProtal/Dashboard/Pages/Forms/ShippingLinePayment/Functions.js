import axios from '../../../../../../axios';
import $ from 'jquery';
import JSAlert from 'js-alert';
import { convertCurrency } from '../../../../../../utils/currency';

export const onSubmit = ( e, history, Amount, setLoading ) => {

    e.preventDefault();
    $('fieldset').prop('disabled', true);
    setLoading(true);
    const line = e.target['line'].value;
    const purpose = e.target['purpose'].value;
    const company_code = e.target['company_code'].value;
    const location_code = e.target['location_code'].value;
    const amount = e.target['amount']?.value;
    const additional_notes = e.target['additional_notes']?.value;
    const submit_to = e.target['submit_to']?.value;
    const amount_in_words = convertCurrency(Amount);
    axios.post(
        '/cash/shipping/line',
        {
            emp_id: localStorage.getItem("EmpID"),
            line: line,
            purpose: purpose,
            amount: amount,
            additional_notes: additional_notes,
            submit_to: submit_to,
            company_code: company_code,
            location_code: location_code,
            amount_in_words: amount_in_words
        }
    ).then(
        res => {
            setLoading(false);
            $('fieldset').prop('disabled', false);
            if ( res.data.message )
            {
                JSAlert.alert("Shipping Line Payment Request Has Been Sent!!!").dismissIn(1000 * 2);
                history.push('/cash/shipping/line/list');
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
            console.log( err );
            setLoading(false);
        }
    );
}

export const loadList = ( Cashier, Admin, location_code, setRequests ) => {
    axios.post(
        '/shipping/line/load/payments',
        {
            emp_id: localStorage.getItem('EmpID'),
            accessKey: Admin ? 1 : 0,
            cashier: Cashier ? 1 : 0,
            location_code: location_code
        }
    )
    .then(
        res => 
        {
            setRequests(res.data);
        }
    ).catch(
        err => {
            console.log(err);
        }
    );
}

export const loadDetails = ( setRequestDetails, setAttachedBills ) => {
    axios.post(
        '/shipping/line/request/details',
        {
            request_id: window.location.href.split('/').pop()
        }
    )
    .then(
        res => 
        {
            setRequestDetails(res.data[0][0]);
            setAttachedBills(res.data[1]);
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

export const confirmRejectRequest = ( e, amount, emp_id, history ) => {
    e.preventDefault();
    const remarks = e.target['remarks'].value;
    $('fieldset').prop('disabled', true);
    axios.post(
        '/shipping/line/request/reject',
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
                JSAlert.alert("Shipping Line Payment Request Has Been Rejected!!!").dismissIn(1000 * 2);
                history.replace('/cash/shipping/line/list');;
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

export const confirmApproveRequest = ( e, emp_id, amount, history ) => {

    e.preventDefault();
    const remarks = e.target['remarks'].value;
    const cashiers = e.target['cashiers'].value;
    // const submit_to = e.target['submit_to'].value;
    $('fieldset').prop('disabled', true);
    axios.post(
        '/shipping/line/request/approve',
        {
            request_id: window.location.href.split('/').pop(),
            remarks: remarks,
            // submit_to: submit_to,
            cashiers: cashiers,
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
                JSAlert.alert("Shipping Line Payment Request Has Been Approved!!!").dismissIn(1000 * 2);
                history.replace('/cash/shipping/line/list');
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

export const validateEmployee = ( e, Template, requested_by, amount, history ) => {

    e.preventDefault();
    const Data = new FormData();

    Data.append('request_id', window.location.href.split('/').pop());
    Data.append('employee', requested_by);
    Data.append('amount', amount);
    Data.append('template', Template ? Template : 'null');
    Data.append('emp_id', localStorage.getItem('EmpID'));
    Data.append('passcode', e.target['passcode'].value);
    Data.append('receiver_id', e.target['emp_id'].value);

    $('fieldset').prop('disabled', true);
    axios.post(
        '/shipping/line/validation',
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
                JSAlert.alert("Success!!! Amount Has Been Released").dismissIn(1000 * 2);
                history.replace('/cash/shipping/line/list');
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

export const confirmClearRequest = ( e, Bills, received_by, emp_id, amount, history ) => {

    e.preventDefault();
    if ( Bills.length === 0 )
    {
        JSAlert.alert("Bills are required!!!!").dismissIn(1000 * 2);
        return false;
    }
    const amount_consumed = e.target['amount_consumed'].value;
    const Data = new FormData();
    Data.append('request_id', window.location.href.split('/').pop());
    Data.append('amount_consumed', amount_consumed);
    Data.append('employee', emp_id);
    Data.append('amount', amount);
    Data.append('received_by', received_by);
    Bills.map(val => Data.append('file', val.file));
    Data.append('emp_id', localStorage.getItem('EmpID'));

    $('fieldset').prop('disabled', true);
    axios.post(
        '/shipping/line/clearance',
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
            if ( res.data.message )
            {
                JSAlert.alert("Success!!! Amount (" + amount + ") Has Been Cleared").dismissIn(1000 * 2);
                history.replace('/cash/shipping/line/list');
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

export const GetCompanies = ( setCompanies ) => {
    axios.get('/getallcompanies')
    .then(
        res => 
        {
            setCompanies(res.data);
        }
    ).catch(
        err => {
            console.log(err);
        }
    );
}

export const GetLocations = ( setLocations ) => {
    axios.get('/getalllocations').then(
        res => {
            setLocations( res.data );
        }
    ).catch(
        err => {
            console.log( err );
        }
    )
}