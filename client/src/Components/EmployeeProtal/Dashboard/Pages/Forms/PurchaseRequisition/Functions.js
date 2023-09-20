/* eslint-disable eqeqeq */
import axios from '../../../../../../axios';
import socket from '../../../../../../io';
import $ from 'jquery';
import JSAlert from 'js-alert';

export const onContentInput = ( e ) => {

    let id = e.target.id;
    let row = id.split('_').pop();
    let row_id = "specification_row_" + row;
    
    let row_child_nodes = document.getElementById(row_id).childNodes;
    let row_serial_number = row_child_nodes[0];
    let row_description = row_child_nodes[1];
    let row_quantity = row_child_nodes[2];
    let row_est_cost = row_child_nodes[3];
    let row_total_cost = row_child_nodes[4];
    
    CalculateEstTotalCost( e, row_quantity, row_est_cost, row_total_cost, row_serial_number, row_description, row );

}

export const onContentEdit = ( e ) => {

    let id = e.target.id;
    let row = id.split('_').pop();
    let row_id = "specification_row_" + row;
    
    let row_child_nodes = document.getElementById(row_id).childNodes;
    let row_serial_number = row_child_nodes[0];
    let row_description = row_child_nodes[1];
    let row_quantity = row_child_nodes[2];
    let row_est_cost = row_child_nodes[3];
    let row_total_cost = row_child_nodes[4];
    
    CalculateEstTotalCost( e, row_quantity, row_est_cost, row_total_cost, row_serial_number, row_description, row );

    document.getElementById(row_id).className = 'bg-success text-light';

}

const CalculateEstTotalCost = ( e, row_quantity, row_est_cost, row_total_cost, row_serial_number, row_description, row ) => {

    if (
        e.target.id.includes('specification_quantity') || e.target.id.includes('specification_est_cost')
    )
    {
        if ( row_quantity.textContent == '' && row_est_cost.textContent == '' )
        {
            row_total_cost.textContent = "";
        }else
        {
            let quantity = parseFloat(row_quantity.textContent == '' ? 0 : row_quantity.textContent);
            let est_cost = parseFloat(row_est_cost.textContent == '' ? 0 : row_est_cost.textContent);
            if ( isNaN(quantity) )
            {
                row_quantity.style.outline = "1px solid red";
                row_serial_number.textContent = "";
                return false;
            }else
            {
                row_quantity.style.outline = "none";
            }
            if ( isNaN(est_cost) )
            {
                row_est_cost.style.outline = "1px solid red";
                row_serial_number.textContent = "";
                return false;
            }else
            {
                row_est_cost.style.outline = "none";
            }
    
            row_total_cost.textContent = quantity * est_cost;
            SetSerialNumber( row_serial_number, row_description, row_quantity, row_est_cost, row );
            TotalCostCalculation();
        }
    }

}

export const TotalCostCalculation = () => {

    let rows = document.getElementById('specifications_table_body').childNodes;
    let rows_array = Object.keys(rows).map((key) => [rows[key]]);
    let total_calculated_amount = 0;
    for ( let x = 0; x < rows_array.length; x++ )
    {
        let est_total_column = rows_array[x][0].childNodes[4];
        if ( est_total_column.textContent !== '' )
        {
            total_calculated_amount = total_calculated_amount + parseFloat(est_total_column.textContent);
        }
    }

    document.getElementById('total_calculated_amount').textContent = total_calculated_amount;
    return total_calculated_amount;

}

const SetSerialNumber = ( row_serial_number, row_description, row_quantity, row_est_cost, row ) => {

    if (
        row_description.textContent !== '' &&
        row_quantity.textContent !== '' &&
        row_est_cost.textContent !== ''
    )
    {
        row_serial_number.textContent = row;
    }else
    {
        row_serial_number.textContent = "";
    }

    // if (
    //     row_description.textContent === '' &&
    //     row_quantity.textContent === '' &&
    //     row_est_cost.textContent === ''
    // )
    // {
    //     row_serial_number.textContent = "";
    // }
    
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

export const onAttachQuotations = ( event, Quotations, setQuotations ) => {
    const reader = new FileReader();
    
    reader.onload = () => {

        if( reader.readyState === 2 )
        {
            let arr = Quotations;
            for ( let x= 0; x < event.target.files.length; x++ )
            {
                arr = [...arr, {file: event.target.files[x],name: event.target.files[x].name,extension: event.target.files[x].type}];
            }
            setQuotations(arr);
        }
        
    }

    if ( event.target.files[0] ) {
        reader.readAsDataURL( event.target.files[0] );
    }
}

export const SubmitPR = ( e, setData, setSubmitConfirmation ) => {

    e.preventDefault();
    const company_code = e.target['company_code'].value;
    const location_code = e.target['location_code'].value;
    const new_purchase_checkbox = e.target['new_purchase'].checked;
    const repair_checkbox = e.target['repair'].checked;
    const replace_recycle_checkbox = e.target['replace_recycle'].checked;
    const budgeted_checkbox = e.target['budgeted'].checked;
    const not_budgeted_checkbox = e.target['not_budgeted'].checked;
    const invoice_attached_checkbox = e.target['invoice_attached'].checked;
    const reason = e.target['reason'].value;
    const total_calculated_amount = TotalCostCalculation();
    setData(
        {
            company_code: company_code,
            location_code: location_code,
            new_purchase_checkbox: new_purchase_checkbox,
            repair_checkbox: repair_checkbox,
            replace_recycle_checkbox: replace_recycle_checkbox,
            budgeted_checkbox: budgeted_checkbox,
            not_budgeted_checkbox: not_budgeted_checkbox,
            invoice_attached_checkbox: invoice_attached_checkbox,
            reason: reason,
            total_calculated_amount: total_calculated_amount
        }
    )
    setSubmitConfirmation( true );

}

export const PRSubmittion = ( e, history, toast, Quotations, Data, Employee, AccessControls ) => {

    e.preventDefault();
    const FormFields = new FormData();
    let rows = document.getElementById('specifications_table_body').childNodes;
    let rows_array = Object.keys(rows).map((key) => [rows[key]]);
    let specifications = [];
    let validation_passed = true;
    let key = false;
    for ( let x = 0; x < rows_array.length; x++ )
    {
        let column_passed = true;
        let obj = {};
        let columns = rows_array[x][0].childNodes;
        let columns_array = Object.keys(columns).map((key) => [columns[key]])
        if ( rows_array[x][0].childNodes[1].textContent !== '' || rows_array[x][0].childNodes[2].textContent !== '' || rows_array[x][0].childNodes[3].textContent !== '' )
        {
            if ( rows_array[x][0].childNodes[0].textContent === '' )
            {
                validation_passed = false;
                toast.dark('There is an incomplete value in the specifications list.', {
                    position: 'top-right',
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
        }
        for ( let y = 0; y < columns_array.length; y++ )
        {
            let label = columns_array[y][0].id.split('_');
            label.pop();
            obj = {
                ...obj,
                [label.join("_")]: columns_array[y][0].textContent
            }
        }

        let obj_arr = Object.keys(obj).map((key) => [obj[key]])
        for ( let z = 0; z < obj_arr.length; z++ )
        {
            if ( obj_arr[z][0] === '' )
            {
                column_passed = false;
            }
        }
        if ( column_passed )
        {
            specifications.push( obj );
        }
    }
    if ( AccessControls.access )
    {
        for ( let x = 0; x < JSON.parse(AccessControls.access).length; x++ )
        {
            if ( parseInt(JSON.parse(AccessControls.access)[x]) === 57 )
            {
                key = true;
            }
        }
    }

    if ( validation_passed )
    {
        $('fieldset').prop('disabled', true);
        FormFields.append( "specifications", JSON.stringify(specifications) );
        FormFields.append( "data", JSON.stringify(Data) );
        FormFields.append( "note", e.target['notes'].value );
        FormFields.append( "submit_to", e.target['submit_to'] ? e.target['submit_to'].value : null );
        FormFields.append( "requested_by", localStorage.getItem("EmpID") );
        FormFields.append( "requested_on_behalf", Employee );
        FormFields.append( "key", key );
        Quotations.forEach(
            file => {
                FormFields.append("Attachments", file.file);
            }
        );
    
        axios.post(
            '/purchase/requisition/submittion&&submit_by=employee',
            FormFields,
            {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            }
        )
        .then(
            res => {
                    
                if ( res.data === 'success' )
                {
                    socket.emit( 'new_purchase_requisition_found' );
                    setTimeout(() => {
                        $('fieldset').prop('disabled', false);
                        history.replace('/purchase/requisition/requests');
                    }, 2000);
                    toast.dark('Purchase Requisition Has Been Generated', {
                    position: 'top-center',
                    autoClose: 2000,
                    hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                }
    
            }
        ).catch(
            err => {
    
                $('fieldset').prop('disabled', false);
                console.log(err);
    
            }
        );
    }
    
}

export const loadHods = ( setHodList ) => {

    axios.get('/purchase/requisition/load/hod').then(
        res => {

            setHodList( res.data );

        }
    ).catch(
        err => {

            console.log( err );

        }
    )

}

export const CancelRequisition = ( e, pr_id, history, RequestDetails ) => {

    e.preventDefault();
    const reason = e.target['reason'].value;
    $('fieldset').prop('disabled', true);
    axios.post(
        '/purchase/requisition/cancellation',
        {
            emp_id: localStorage.getItem('EmpID'),
            reason: reason,
            pr_id: pr_id,
            status: RequestDetails.status,
            code: RequestDetails.code + '-' + RequestDetails.series_year + '-' + RequestDetails.series_code,
            requested_by: RequestDetails.requested_by
        }
    )
    .then(
        res => 
        {
                
            if ( res.data === 'success' )
            {
                setTimeout(() => {
                    history.push('/purchase/requisition/requests');
                }, 1500);
                $('#error_alert_cancelation').removeClass('d-none').text("Your application has been canceled.");
            }

        }
    ).catch(
        err => {

            $('fieldset').prop('disabled', false);
            console.log(err);

        }
    );

}

export const sendForApproveRequisition = ( e, pr_id, requested_by, submitted_to, history, toast, Specifications ) => {

    e.preventDefault();
    const reason = e.target['reason'].value;
    const appr_reject_by = e.target['submit_to'].value;
    $('fieldset').prop('disabled', true);
    axios.post(
        '/purchase/requisition/send_for_approval',
        {
            emp_id: localStorage.getItem('EmpID'),
            requested_by: requested_by,
            pr_id: pr_id,
            submitted_to: submitted_to,
            remarks: reason,
            submit_to: appr_reject_by,
            specifications: JSON.stringify(Specifications),
        }
    )
    .then(
        res => 
        {
                
            if ( res.data === 'success' )
            {
                setTimeout(() => {
                    history.push('/purchase/requisition/requests');
                }, 1500);
                $('#error_alert_approval').removeClass('d-none').text("The application has been sent for approval.");
            }

        }
    ).catch(
        err => {

            $('fieldset').prop('disabled', false);
            console.log(err);

        }
    );

}

export const ApproveRequisition = ( e, pr_id, requested_by, submitted_to, history ) => {

    e.preventDefault();
    const reason = e.target['reason'].value;
    $('fieldset').prop('disabled', true);
    axios.post(
        '/purchase/requisition/approval',
        {
            emp_id: localStorage.getItem('EmpID'),
            reason: reason,
            pr_id: pr_id,
            requested_by: requested_by,
            submitted_to: submitted_to
        }
    )
    .then(
        res => 
        {
                
            if ( res.data === 'success' )
            {
                setTimeout(() => {
                    history.push('/purchase/requisition/requests');
                }, 1500);
                $('#error_alert_approval').removeClass('d-none').text("The application has been approved.");
            }

        }
    ).catch(
        err => {

            $('fieldset').prop('disabled', false);
            console.log(err);

        }
    );

}

export const RejectRequisition = ( e, pr_id, requested_by, Specifications, history ) => {

    e.preventDefault();
    const reason = e.target['reason'].value;
    $('fieldset').prop('disabled', true);
    axios.post(
        '/purchase/requisition/reject',
        {
            emp_id: localStorage.getItem('EmpID'),
            remarks: reason,
            pr_id: pr_id,
            requested_by: requested_by,
            specifications: JSON.stringify(Specifications),
            department: 'accounts'
        }
    )
    .then(
        res => 
        {
                
            if ( res.data === 'success' )
            {
                setTimeout(() => {
                    history.push('/purchase/requisition/requests');
                }, 1500);
                $('#error_alert_rejection').removeClass('d-none').text("The application has been rejected.");
            }

        }
    ).catch(
        err => {

            $('fieldset').prop('disabled', false);
            console.log(err);

        }
    );

}

export const InvRejectRequisition = ( e, pr_id, requested_by, Specifications, history ) => {

    e.preventDefault();
    const reason = e.target['reason'].value;
    $('fieldset').prop('disabled', true);
    axios.post(
        '/purchase/requisition/reject',
        {
            emp_id: localStorage.getItem('EmpID'),
            remarks: reason,
            pr_id: pr_id,
            requested_by: requested_by,
            specifications: JSON.stringify(Specifications),
        }
    )
    .then(
        res => 
        {
                
            if ( res.data === 'success' )
            {
                setTimeout(() => {
                    history.push('/purchase/requisition/requests');
                }, 1500);
                $('#error_alert_rejection').removeClass('d-none').text("The application has been rejected.");
            }

        }
    ).catch(
        err => {

            $('fieldset').prop('disabled', false);
            console.log(err);

        }
    );

}

export const onSearchEmployees = ( e, setEmployees, setEmployee ) => {

    setEmployees();
    if ( e.target.value !== '' )
    {
        axios.post(
            '/inventory/pusrchase/requisition/search/employees',
            {
                key: e.target.value
            }
        ).then(
            res => {
    
                setEmployees( res.data );
    
            }
        ).catch(
            err => {
    
                console.log( err );
    
            }
        )
    }else
    {
        setTimeout(() => {
            setEmployees();
            setEmployee();
        }, 300);
    }

}

export const loadRequests = ( companies, CompanyViewer, Admin, setRequests ) => {

    axios.post(
        '/purchase/requisition/load/requests',
        {
            emp_id: localStorage.getItem('EmpID'),
            accessKey: Admin ? 1 : 0,
            companyViewer: CompanyViewer ? 1 : 0,
            companies: JSON.stringify(companies)
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

export const openRequestDetails = ( AccessControls, pr_id, setRequestDetails, setSpecifications, setAttachedQuotations, setQuotations, setLogs ) => {

    let key = false;
    if ( AccessControls.access )
    {
        for ( let x = 0; x < JSON.parse(AccessControls.access).length; x++ )
        {
            if ( parseInt(JSON.parse(AccessControls.access)[x]) === 57 )
            {
                key = true;
            }
        }
    }

    axios.post(
        '/purchase/requisition/details',
        {
            pr_id: pr_id,
            viewed: key,
            emp_id: localStorage.getItem("EmpID")
        }
    )
    .then(
        res => 
        {
            function renameKeys(obj, newKeys) {
                const keyValues = Object.keys(obj).map(key => {
                    const newKey = newKeys[key] || key;
                    return { [newKey]: obj[key] };
                });
                return Object.assign({}, ...keyValues);
            }
            let specifications = [];
            setRequestDetails(res.data[1][0]);
            setAttachedQuotations(res.data[3]);
            setLogs(res.data[4]);
            if ( window.location.href.includes('&&pr_id=') )
            {
                setQuotations(res.data[3]);
                for ( let x = 0; x < res.data[2].length; x++ )
                {
                    const newKeys = { sr_no: "specification_serial_number", description: "specification_description", quantity: "specification_quantity", estimated_cost: "specification_est_cost", total_estimated_cost: "specification_total_cost" };
                    const obj = renameKeys(res.data[2][x], newKeys);
                    specifications.push(obj);
                }
            }else
            {
                specifications = res.data[2];
            }
            setSpecifications(specifications);

        }
    ).catch(
        err => {

            console.log(err);

        }
    );

}

export const updatePR = ( e, RequestDetails, setData, setEditConfirmation, setEditedSpecifications, setLogs ) => {

    e.preventDefault();
    let rows = document.getElementById('specifications_table_body').childNodes;
    let rows_array = Object.keys(rows).map((key) => [rows[key]]);
    let specifications = [];
    let validation_passed = true;
    for ( let x = 0; x < rows_array.length; x++ )
    {
        let column_passed = true;
        let obj = {};
        let columns = rows_array[x][0].childNodes;
        let columns_array = Object.keys(columns).map((key) => [columns[key]])
        if ( rows_array[x][0].childNodes[1].textContent !== '' || rows_array[x][0].childNodes[2].textContent !== '' || rows_array[x][0].childNodes[3].textContent !== '' )
        {
            if ( rows_array[x][0].childNodes[0].textContent === '' )
            {
                validation_passed = false;
                JSAlert.alert("There is an incomplete value in the specifications list.").dismissIn(1000 * 2);
            }
        }
        for ( let y = 0; y < columns_array.length; y++ )
        {
            let label = columns_array[y][0].id.split('_');
            label.pop();
            obj = {
                ...obj,
                [label.join("_")]: columns_array[y][0].textContent
            }
        }

        let obj_arr = Object.keys(obj).map((key) => [obj[key]])
        for ( let z = 0; z < obj_arr.length; z++ )
        {
            if ( obj_arr[z][0] === '' )
            {
                column_passed = false;
            }
        }
        if ( column_passed )
        {
            specifications.push( obj );
        }
    }
    
    if ( specifications.length === 0 )
    {
        validation_passed = false;
        JSAlert.alert("No Specification Found.").dismissIn(1000 * 2);
    }

    if ( validation_passed )
    {
        const company_code = e.target['company_code'].value;
        const location_code = e.target['location_code'].value;
        const reason = e.target['reason'].value;
        const new_purchase = e.target['new_purchase'].checked;
        const repair = e.target['repair'].checked;
        const replace_recycle = e.target['replace_recycle'].checked;
        const budgeted = e.target['budgeted'].checked;
        const not_budgeted = e.target['not_budgeted'].checked;
        const invoice_attached = e.target['invoice_attached'].checked;
        const total_calculated_amount = TotalCostCalculation();
        const obj = {
            company_code: company_code,
            location_code: location_code,
            new_purchase: new_purchase,
            repair: repair,
            replace_recycle: replace_recycle,
            budgeted: budgeted,
            not_budgeted: not_budgeted,
            invoice_attached: invoice_attached,
            total_value: total_calculated_amount,
            reason: reason,
        };
        const logs = [];

        Object.keys(obj).forEach((key, i) => {
            if (RequestDetails[key] != Object.values(obj)[i]) {
                logs.push({
                    pr_id: window.location.href.split('&&pr_id=').pop(),
                    before_value: RequestDetails[key],
                    after_value: Object.values(obj)[i],
                    edit_by: localStorage.getItem("EmpID"),
                    status: 'edited',
                    match_key: key,
                    remarks: `${localStorage.getItem("name")} has updated the ${key.split('_').join(' ')} from ${RequestDetails[key]} to ${Object.values(obj)[i]}.`
                })
            }
        });
        // Object.values(obj).forEach(value => console.log(RequestDetails[value]));

        setLogs(logs);
        setData(obj);
        setEditConfirmation( true );
        setEditedSpecifications( specifications );
    }
}

export const addRow = () => {

    let rows = document.getElementById('specifications_table_body').childNodes;
    let row = document.createElement('tr');
    row.id = "specification_row_" + parseInt(rows.length + 1);

    let column_serial_number = document.createElement('td');
    column_serial_number.id = "specification_serial_number_" + parseInt(rows.length + 1);
    
    let column_description = document.createElement('td');
    column_description.contentEditable = true;
    column_description.addEventListener( 'input', onContentInput );
    column_description.id = "specification_description_" + parseInt(rows.length + 1);
    
    let column_quantity = document.createElement('td');
    column_quantity.contentEditable = true;
    column_quantity.addEventListener( 'input', onContentInput );
    column_quantity.id = "specification_quantity_" + parseInt(rows.length + 1);
    
    let column_est_cost = document.createElement('td');
    column_est_cost.contentEditable = true;
    column_est_cost.addEventListener( 'input', onContentInput );
    column_est_cost.id = "specification_est_cost_" + parseInt(rows.length + 1);
    
    let column_total_est_cost = document.createElement('td');
    column_total_est_cost.id = "specification_total_cost_" + parseInt(rows.length + 1);

    row.appendChild(column_serial_number);
    row.appendChild(column_description);
    row.appendChild(column_quantity);
    row.appendChild(column_est_cost);
    row.appendChild(column_total_est_cost);

    document.getElementById('specifications_table_body').appendChild(row);

}

export const PRUpdate = ( e, RequestDetails, history, Data, specifications, Quotations, RemovedQuotations, Logs, Specifications ) => {

    e.preventDefault();
    const FormFields = new FormData();
    const logs = Logs;
    addLogs(e.target['notes'].value, RequestDetails.note, logs);

    $('fieldset').prop('disabled', true);
    FormFields.append( "specifications", JSON.stringify(specifications) );
    FormFields.append( "prev_specifications", JSON.stringify(Specifications) );
    FormFields.append( "RemovedQuotations", JSON.stringify(RemovedQuotations) );
    FormFields.append( "data", JSON.stringify(Data) );
    FormFields.append( "logs", JSON.stringify(logs) );
    FormFields.append( "note", e.target['notes'].value );
    FormFields.append( "submitted_to", e.target['request_to']?.value );
    FormFields.append( "requested_by", localStorage.getItem("EmpID") );
    FormFields.append( "name", localStorage.getItem("name") );
    FormFields.append( "pr_id", window.location.href.split('&&pr_id=').pop() );
    Quotations.forEach(
        file => {
            if ( file.file ) FormFields.append("Attachments", file.file);
        }
    );

    axios.post(
        '/purchase/requisition/update',
        FormFields,
        {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }
    )
    .then(
        res => {
                
            if ( res.data === 'success' )
            {
                socket.emit( 'new_purchase_requisition_found' );
                setTimeout(() => {
                    $('fieldset').prop('disabled', false);
                    history.goBack();
                }, 2000);
                JSAlert.alert('Purchase Requisition Has Been Updated').dismissIn(1000 * 2);
            }else
            {
                console.log(res);
                $('fieldset').prop('disabled', false);
                JSAlert.alert('Something went wrong').dismissIn(1000 * 2);
            }

        }
    ).catch(
        err => {

            $('fieldset').prop('disabled', false);
            console.log(err);

        }
    );

    
}

const addLogs = (currentNote, prevNote, logs) => {
    if ( currentNote !== prevNote ) {
        logs.push({
            pr_id: window.location.href.split('&&pr_id=').pop(),
            before_value: prevNote,
            after_value: currentNote,
            edit_by: localStorage.getItem("EmpID"),
            status: 'edited',
            match_key: 'note',
            remarks: `${localStorage.getItem("name")} has updated the note from ${prevNote} to ${currentNote}.`
        })
    }
}

export const overrideRequisition = ( e, status, RequestDetails, history ) => {

    e.preventDefault();
    const remarks = e.target['remarks'].value;
    $('fieldset').prop('disabled', true);
    axios.post(
        '/purchase/requisition/override',
        {
            emp_id: localStorage.getItem('EmpID'),
            name: localStorage.getItem('name'),
            remarks: remarks,
            status: status,
            pr_id: window.location.href.split('?pr_id=').pop(),
            requestDetails: JSON.stringify(RequestDetails)
        }
    )
    .then(
        res => 
        { 
            if ( res.data === 'success' )
            {
                JSAlert.alert("The request has been " + status + ".").dismissIn(1000 * 2);
                setTimeout(() => {
                    history.push('/purchase/requisition/requests');
                }, 1500);
            }
        }
    ).catch(
        err => {

            $('fieldset').prop('disabled', false);
            console.log(err);

        }
    );

}