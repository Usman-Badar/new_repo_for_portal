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

export const loadSlipDetails = ( slip_id, setSlipDetails ) => {
    axios.post(
        '/cash/load/request/details',
        {
            request_id: slip_id
        }
    )
    .then(
        res => 
        {
            setSlipDetails(res.data[0]);
        }
    ).catch(
        err => {
            console.log(err);
        }
    );
}

export const loadComments = ( setComments ) => {
    axios.post(
        '/cash/load/request/comments',
        {
            request_id: window.location.href.split('/').pop()
        }
    )
    .then(
        res => 
        {
            setComments(res.data);
        }
    ).catch(
        err => {
            console.log(err);
        }
    );
}

export const newComment = (serial_no, comment, Details, setComments, setComment) => {
    $('fieldset').prop('disabled', true);
    const currentEmp = parseInt(localStorage.getItem("EmpID"));
    axios.post(
        '/cash/load/request/new_comment',
        {
            emp_id: currentEmp,
            name: localStorage.getItem('name'),
            employee: Details.emp_id === currentEmp || Details.emp_id === null ? 'N' : Details.emp_id,
            cashier: Details.cashier === currentEmp || Details.cashier === null ? 'N' : Details.cashier,
            verified_by: Details.verified_by === currentEmp || Details.verified_by === null ? 'N' : Details.verified_by,
            approved_by: Details.approved_by === currentEmp || Details.approved_by === null ? 'N' : Details.approved_by,
            body: comment,
            serial_no: serial_no,
            request_id: window.location.href.split('/').pop()
        }
    )
    .then(
        () => 
        {
            socket.emit('new_comment');
            $('fieldset').prop('disabled', false);
            loadComments(setComments);
            setComment('');
        }
    ).catch(
        err => {
            $('fieldset').prop('disabled', false);
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

export const approveRequest = ( e, emp_id, amount, AccessControls, history ) => {

    e.preventDefault();
    if (!JSON.parse(AccessControls.access).includes(75)) {
        JSAlert.alert("You don't have access!!!", 'Validation Error', JSAlert.Icons.Failed).dismissIn(1000 * 2);
        return false;
    }

    const remarks = e.target['remarks'].value;
    const cashiers = e.target['cashiers'].value;
    // const submit_to = e.target['submit_to'].value;
    $('fieldset').prop('disabled', true);
    axios.post(
        '/cash/load/request/approve',
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

export const verifyRequest = ( e, emp_id, amount, shp_line_adv, AccessControls, history ) => {

    e.preventDefault();

    if (shp_line_adv === 'Y' && !JSON.parse(AccessControls.access).includes(74)) {
        JSAlert.alert("You don't have access!!!", 'Validation Error', JSAlert.Icons.Failed).dismissIn(1000 * 2);
        return false;
    }
    if (shp_line_adv === 'N' && !JSON.parse(AccessControls.access).includes(51)) {
        JSAlert.alert("You don't have access!!!", 'Validation Error', JSAlert.Icons.Failed).dismissIn(1000 * 2);
        return false;
    }
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

export const validateEmployee = ( e, requested_emp_name, Other, CNICFront, CNICBack, signature, Template1, Template2, emp_id, amount, history ) => {

    e.preventDefault();

    const Data = new FormData();
    const id = emp_id;

    Data.append('request_id', window.location.href.split('/').pop());
    Data.append('passcode', !Other ? e.target['passcode'].value : null);
    Data.append('receiving_person', Other ? e.target['receiving_person'].value : null);
    Data.append('receiving_person_contact', Other ? e.target['receiving_person_contact'].value : null);
    Data.append('receiving_person_cnic', Other ? e.target['receiving_person_cnic'].value : null);
    Data.append('employee', id);
    Data.append('signature', signature);
    Data.append('amount', amount);
    Data.append('template1', Template1 ? Template1 : 'null');
    Data.append('template2', Template2 ? Template2 : 'null');
    Data.append('other', Other ? 'yes' : 'no');
    Data.append('emp_id', localStorage.getItem('EmpID'));
    Data.append("CNICFront", CNICFront?.file);
    Data.append("CNICBack", CNICBack?.file);

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

export const onAttachCNICFront = ( event, setCNICFront ) => {
    const reader = new FileReader();
    reader.onload = () => {
        if( reader.readyState === 2 )
        {
            setCNICFront({file: event.target.files[0], name: event.target.files[0].name, extension: event.target.files[0].type});
        }
    }
    if ( event.target.files[0] ) {
        reader.readAsDataURL( event.target.files[0] );
    }
}

export const onAttachCNICBack = ( event, setCNICBack ) => {
    const reader = new FileReader();
    reader.onload = () => {
        if( reader.readyState === 2 )
        {
            setCNICBack({file: event.target.files[0], name: event.target.files[0].name, extension: event.target.files[0].type});
        }
    }
    if ( event.target.files[0] ) {
        reader.readAsDataURL( event.target.files[0] );
    }
}

export const loadPRDetails = ( pr_id, setPRequestDetails, setSpecifications, setAttachedQuotations ) => {
    axios.post(
        '/purchase/requisition/details',
        {
            pr_id: pr_id,
            viewed: false
        }
    )
    .then(
        res => 
        {
            setPRequestDetails(res.data[1][0]);
            setAttachedQuotations(res.data[3]);
            setSpecifications(res.data[2]);
        }
    ).catch(
        err => {
            console.log(err);
        }
    );
}