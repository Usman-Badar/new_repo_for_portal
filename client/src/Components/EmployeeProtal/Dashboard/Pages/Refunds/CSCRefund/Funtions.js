import axios from '../../../../../../axios';
import JSAlert from 'js-alert';
import $ from 'jquery';

export const loadList = ( AccessControls, setList ) => {
    let accessKey = false;
    if ( AccessControls )
    {
        for ( let y = 0; y < JSON.parse(AccessControls.access).length; y++ )
        {
            if ( parseInt(JSON.parse(AccessControls.access)[y]) === 0 || parseInt(JSON.parse(AccessControls.access)[y]) === 43 )
            {
                accessKey = true;
            }
        }
    }
    axios.post(
        "/refund/csc/list",
        {
            emp_id: localStorage.getItem('EmpID'),
            accessKey: accessKey ? 1 : 0
        }
    )
    .then(
        res => {
            setList(res.data);
        }
    ).catch(
        err => {
            console.log(err);
        }
    );
}

export const loadDetails = ( setDetails ) => {
    axios.post(
        '/refund/csc/details',
        {
            report_id: window.location.href.split('/').pop()
        }
    )
    .then(
        res => 
        {
            setDetails(
                {
                    data: res.data[0][0],
                    items: res.data[1]
                }
            );
        }
    ).catch(
        err => {
            console.log(err);
        }
    );
}

export const setReportToPaid = ( setDetails ) => {
    axios.post(
        '/refund/csc/set_to_paid_all',
        {
            report_id: window.location.href.split('/').pop()
        }
    )
    .then(
        res => 
        {
            loadDetails(setDetails);
        }
    ).catch(
        err => {
            console.log(err);
        }
    );
}

export const setToCheck = ( history ) => {
    $('#submitBtn').prop('disabled', true);
    axios.post(
        '/refund/csc/set_to_checked',
        {
            report_id: window.location.href.split('/').pop()
        }
    )
    .then(
        () => 
        {
            JSAlert.alert("Report has been checked!!!").dismissIn(1000 * 2);
            history.push('/refund/csc/list');
        }
    ).catch(
        err => {
            $('#submitBtn').prop('disabled', false);
            console.log(err);
        }
    );
}

export const setToPaid = ( data, PaidRefunds, setDetails, setMarkCheckConfirm, setPaidRefunds ) => {
    $('#submitBtn').prop('disabled', true);
    axios.post(
        '/refund/csc/set_to_paid',
        {
            emp_id: data.prepared_by,
            month_year: data.month + '-' + data.year,
            checked_by: data.checked_by,
            report_id: window.location.href.split('/').pop(),
            forwarders: JSON.stringify(PaidRefunds)
        }
    )
    .then(
        () => 
        {
            setPaidRefunds([]);
            setMarkCheckConfirm(false);
            $('#submitBtn').prop('disabled', false);
            JSAlert.alert("Selected forwarders has been paid!!!").dismissIn(1000 * 2);
            loadDetails(setDetails);
        }
    ).catch(
        err => {
            $('#submitBtn').prop('disabled', false);
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

export const submitReport = ( ProcessedData, GrandTotalData, MonthYear, Company, SubmitTo, UploadedFile, history ) => {
    if ( !ProcessedData || !MonthYear || !Company || !SubmitTo || !UploadedFile || ProcessedData === '' || MonthYear === '' || Company === '' || SubmitTo === '' )
    {
        JSAlert.alert("All fields are required!!!").dismissIn(1000 * 2);
        return false;
    }
    $('#submitBtn').prop('disabled', true);
    const Data = new FormData();
    Data.append('emp_id', localStorage.getItem("EmpID"));
    Data.append('month_year', MonthYear);
    Data.append('company_code', Company);
    Data.append('submit_to', SubmitTo);
    Data.append('processed_data', JSON.stringify(ProcessedData));
    Data.append('grand_total_data', JSON.stringify(GrandTotalData));
    Data.append('file', UploadedFile?.file);
    axios.post(
        '/refund/csc/submission',
        Data
    ).then(
        () => 
        {
            JSAlert.alert("Report submitted!!!").dismissIn(1000 * 2);
            $('#submitBtn').prop('disabled', false);
            history.replace('/refund/csc/list');
        }
    ).catch(
        err => {
            $('#submitBtn').prop('disabled', false);
            console.log(err);
        }
    );
}