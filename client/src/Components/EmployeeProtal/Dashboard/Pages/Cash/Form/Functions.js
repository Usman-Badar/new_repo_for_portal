import axios from '../../../../../../axios';
import $ from 'jquery';
import JSAlert from 'js-alert';
import socket from '../../../../../../io';

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

export const GetCompanyLocations = ( company_code, setLocations ) => {
    console.log(company_code)
    axios.post('/getcompanylocations', {company_code: company_code}).then(
        res => {
            setLocations( res.data );
        }
    ).catch(
        err => {
            console.log( err );
        }
    )
}

export const loadEmployees = ( setEmployees ) => {
    axios.post(
        '/get/employees/all',
        {
            emp_id: localStorage.getItem("EmpID"),
            accessKey: 1
        }
    ).then(
        res => {

            setEmployees( res.data );

        }
    ).catch(
        err => {

            console.log( err );

        }
    );
}

export const onCreateAdvanceCash = ( e, history, PR, Amount, Employee, Slip ) => {

    e.preventDefault();
    const company_code = e.target['company_code'].value;
    const location_code = e.target['location_code'].value;
    const request_to = e.target['request_to']?.value;
    const reason = e.target['reason'].value;
    const amount = Amount;
    const emp_id = Employee ? Employee.emp_id : null;
    $('fieldset').prop('disabled', true);
    axios.post(
        '/cash/advance/create',
        {
            emp_id: localStorage.getItem("EmpID"),
            company_code: company_code,
            location_code: location_code,
            reason: reason,
            amount: amount,
            employee: emp_id,
            request_to: request_to,
            pr_id: PR,
            previous_slip: Slip,
            amountInWords: document.getElementById('amount_in_words')?.value
        }
    ).then(
        res => {
            $('fieldset').prop('disabled', false);
            if ( res.data.message )
            {
                const message = localStorage.getItem('name') + " has requested for advance cash for PKR (" + amount.toLocaleString('en') + ") - " + res.data.date + ' - ' + res.data.time;
                socket.emit( 'admin_notification', { link: res.data.link, message: message, owner: res.data.owner });
                JSAlert.alert("Advance Cash Has Been Created!!!", "Success", JSAlert.Icons.Success).dismissIn(1000 * 2);
                history.push('/cash/requests');
                $('#resetBtn').trigger('click');
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

export const onCreateShpCash = ( e, history, Total, DO, LOLO, DET, DMGDT, CSC, Other ) => {

    e.preventDefault();
    const line = e.target['line'].value;
    const company_code = e.target['company_code'].value;
    const location_code = e.target['location_code'].value;
    const request_to = e.target['request_to']?.value;
    const reason = e.target['reason'].value;
    const amount = Total;

    if (line.trim().length === 0) {
        JSAlert.alert('Shipping line is required.', 'Validation Error', JSAlert.Icons.Warning).dismissIn(4000);
        return false;
    }else if (company_code === '') {
        JSAlert.alert('Company code is required.', 'Validation Error', JSAlert.Icons.Warning).dismissIn(4000);
        return false;
    }else if (location_code === '') {
        JSAlert.alert('Location code is required.', 'Validation Error', JSAlert.Icons.Warning).dismissIn(4000);
        return false;
    }else if (reason.trim().length < 20) {
        JSAlert.alert('Reason must contains 20 characters.', 'Validation Error', JSAlert.Icons.Warning).dismissIn(4000);
        return false;
    }if (parseFloat(amount) < 1) {
        JSAlert.alert('Amount should be greater than 0.', 'Validation Error', JSAlert.Icons.Warning).dismissIn(4000);
        return false;
    }else if (DO.required && parseFloat(DO.amount) < 1) {
        JSAlert.alert('DO amount should be greater than 0.', 'Validation Error', JSAlert.Icons.Warning).dismissIn(4000);
        return false;
    }else if (LOLO.required && parseFloat(LOLO.amount) < 1) {
        JSAlert.alert('LOLO amount should be greater than 0.', 'Validation Error', JSAlert.Icons.Warning).dismissIn(4000);
        return false;
    }else if (DET.required && parseFloat(DET.amount) < 1) {
        JSAlert.alert('Detention amount should be greater than 0.', 'Validation Error', JSAlert.Icons.Warning).dismissIn(4000);
        return false;
    }else if (DMGDT.required && parseFloat(DMGDT.amount) < 1) {
        JSAlert.alert('Damage & Dirty amount should be greater than 0.', 'Validation Error', JSAlert.Icons.Warning).dismissIn(4000);
        return false;
    }else if (CSC.required && parseFloat(CSC.amount) < 1) {
        JSAlert.alert('CSC amount should be greater than 0.', 'Validation Error', JSAlert.Icons.Warning).dismissIn(4000);
        return false;
    }else if (Other.required && parseFloat(Other.amount) < 1) {
        JSAlert.alert('Other amount should be greater than 0.', 'Validation Error', JSAlert.Icons.Warning).dismissIn(4000);
        return false;
    }
    // else if (Other.required && Other.specification.trim().length < 10) {
    //     JSAlert.alert('Please specify the purpose in other specification field in at least 10 characters.', 'Validation Error', JSAlert.Icons.Warning).dismissIn(4000);
    //     return false;
    // }

    $('fieldset').prop('disabled', true);
    axios.post(
        '/cash/shipping/create',
        {
            line: line,
            emp_id: localStorage.getItem("EmpID"),
            company_code: company_code,
            location_code: location_code,
            reason: reason,
            amount: amount,
            request_to: request_to,
            pr_id: 'null',
            previous_slip: 'null',
            amountInWords: document.getElementById('amount_in_words')?.value,
            d_o: parseFloat(DO.amount),
            lolo: parseFloat(LOLO.amount),
            detention: parseFloat(DET.amount),
            damage_dirty: parseFloat(DMGDT.amount),
            csc: parseFloat(CSC.amount),
            other: parseFloat(Other.amount),
            other_specification: Other.specification
        }
    ).then(
        res => {
            $('fieldset').prop('disabled', false);
            if ( res.data.message )
            {
                const message = localStorage.getItem('name') + " has requested for advance cash for PKR (" + amount.toLocaleString('en') + ") - " + res.data.date + ' - ' + res.data.time;
                socket.emit( 'admin_notification', { link: res.data.link, message: message, owner: res.data.owner });
                JSAlert.alert("Advance Cash Has Been Created!!!").dismissIn(1000 * 2);
                history.push('/cash/requests');
                $('#resetBtn').trigger('click');
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

export const loadPRList = ( setPRList ) => {
    axios.post('/purchase/requisition/load/requests_with_specifications', { emp_id: localStorage.getItem('EmpID') }).then(
        res => {
            setPRList( res.data );
        }
    ).catch(
        err => {
            console.log( err );
        }
    )
}

export const loadSlipList = ( setSlipList ) => {
    axios.post('/cash/load/previous', { emp_id: localStorage.getItem('EmpID') }).then(
        res => {
            setSlipList( res.data );
        }
    ).catch(
        err => {
            console.log( err );
        }
    )
}