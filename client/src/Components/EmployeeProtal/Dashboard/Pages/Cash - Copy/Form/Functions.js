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

export const onCreateAdvanceCash = ( e, history, PR, Amount, Employee, Slip, setSelected, setKeyword, setEmployee, setAmount, setCompany ) => {

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
                JSAlert.alert("Advance Cash Has Been Created!!!").dismissIn(1000 * 2);
                history.push('/cash/requests');
                $('#resetBtn').trigger('click');
                setSelected(true);
                setKeyword("");
                setEmployee();
                setCompany();
                setAmount(1);
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