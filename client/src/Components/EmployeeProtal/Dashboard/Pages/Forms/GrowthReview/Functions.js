import axios from '../../../../../../axios';
import socket from '../../../../../../io';
import $ from 'jquery';

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

const TotalCostCalculation = () => {

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

export const onAttachQuotations = ( event, setQuotations ) => {
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
                        name: event.target.files[x].name,
                        extension: event.target.files[x].type
                    }
                );
            }

            setQuotations( arr );

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

export const PRSubmittion = ( e, history, toast, Quotations, Data, Employee ) => {

    e.preventDefault();
    const FormFields = new FormData();
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

    if ( validation_passed )
    {
        $('fieldset').prop('disabled', true);
        FormFields.append( "specifications", JSON.stringify(specifications) );
        FormFields.append( "data", JSON.stringify(Data) );
        FormFields.append( "note", e.target['notes'].value );
        FormFields.append( "submit_to", e.target['submit_to'] ? e.target['submit_to'].value : null );
        FormFields.append( "requested_by", localStorage.getItem("EmpID") );
        FormFields.append( "requested_on_behalf", Employee );
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

export const CancelRequisition = ( e, pr_id, history ) => {

    e.preventDefault();
    const reason = e.target['reason'].value;
    $('fieldset').prop('disabled', true);
    axios.post(
        '/purchase/requisition/cancellation',
        {
            emp_id: localStorage.getItem('EmpID'),
            reason: reason,
            pr_id: pr_id
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

export const loadRequests = ( setRequests ) => {

    axios.post(
        '/purchase/requisition/load/requests',
        {
            emp_id: localStorage.getItem('EmpID')
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

export const openRequestDetails = ( AccessControls, pr_id, setRequestDetails, setSpecifications, setQuotations ) => {

    let key = false;
    if ( AccessControls.access )
    {
        for ( let x = 0; x < JSON.parse(AccessControls.access).length; x++ )
        {
            if ( parseInt(JSON.parse(AccessControls.access)[x]) === 30 || parseInt(JSON.parse(AccessControls.access)[x]) === 0 )
            {
                key = true;
            }
        }
    }

    axios.post(
        '/purchase/requisition/details',
        {
            pr_id: pr_id,
            viewed: key
        }
    )
    .then(
        res => 
        {
            
            setRequestDetails(res.data[1][0]);
            setSpecifications(res.data[2]);
            setQuotations(res.data[3]);

        }
    ).catch(
        err => {

            console.log(err);

        }
    );

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

    row.appendChild(column_serial_number);
    row.appendChild(column_description);
    row.appendChild(column_quantity);
    row.appendChild(column_est_cost);

    document.getElementById('specifications_table_body').appendChild(row);

}