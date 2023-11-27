import axios from '../../../../../../axios';
import socket from '../../../../../../io';
import $ from 'jquery';
import JSAlert from 'js-alert';

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
    
    let column_unit = document.createElement('td');
    column_unit.contentEditable = true;
    column_unit.addEventListener( 'input', onContentInput );
    column_unit.id = "specification_unit_" + parseInt(rows.length + 1);
    
    let column_est_cost = document.createElement('td');
    column_est_cost.contentEditable = true;
    column_est_cost.addEventListener( 'input', onContentInput );
    column_est_cost.id = "specification_est_cost_" + parseInt(rows.length + 1);
    
    let column_total_est_cost = document.createElement('td');
    column_total_est_cost.id = "specification_total_cost_" + parseInt(rows.length + 1);

    row.appendChild(column_serial_number);
    row.appendChild(column_description);
    row.appendChild(column_quantity);
    row.appendChild(column_unit);
    row.appendChild(column_est_cost);
    row.appendChild(column_total_est_cost);

    document.getElementById('specifications_table_body').appendChild(row);

}

export const addAdditionalRow = () => {

    let rows = document.getElementById('specifications_table_footer').childNodes;
    let filtered_rows = Array.from(rows).filter(row => row.id.includes('additional_labels_'));
    let total = document.getElementById('final_total');
    let row = document.createElement('tr');
    row.id = "additional_labels_" + parseInt(filtered_rows.length + 1);

    let empty_column_1 = document.createElement('td');
    empty_column_1.className = "border-0";
    
    let empty_column_2 = document.createElement('td');
    empty_column_2.className = "border-0";
    
    let empty_column_3 = document.createElement('td');
    empty_column_3.className = "border-0";
    
    let empty_column_4 = document.createElement('td');
    empty_column_4.className = "border-0";
    
    let label_column = document.createElement('td');
    label_column.contentEditable = true;
    label_column.addEventListener( 'input', onFooterContentInput );
    label_column.className = "text-center";
    label_column.id = "additional_label_" + parseInt(filtered_rows.length + 1);
    
    let label_value_column = document.createElement('td');
    label_value_column.contentEditable = true;
    label_value_column.addEventListener( 'input', onFooterContentInput );
    label_value_column.id = "additional_value_" + parseInt(filtered_rows.length + 1);

    row.appendChild(empty_column_1);
    row.appendChild(empty_column_2);
    row.appendChild(empty_column_3);
    row.appendChild(empty_column_4);
    row.appendChild(label_column);
    row.appendChild(label_value_column);

    document.getElementById('specifications_table_footer').insertBefore(row, total);

}

export const onContentInput = ( e ) => {

    let id = e.target.id;
    let row = id.split('_').pop();
    let row_id = "specification_row_" + row;
    
    let row_child_nodes = document.getElementById(row_id).childNodes;
    let row_serial_number = row_child_nodes[0];
    let row_description = row_child_nodes[1];
    let row_quantity = row_child_nodes[2];
    let row_unit = row_child_nodes[3];
    let row_est_cost = row_child_nodes[4];
    let row_total_cost = row_child_nodes[5];
    
    CalculateEstTotalCost( e, row_quantity, row_est_cost, row_total_cost, row_serial_number, row_description, row_unit, row );
    SetSerialNumber( row_serial_number, row_description, row_quantity, row_est_cost, row_unit, row );

}

export const onFooterContentInput = ( e ) => {

    let id = e.target.id;
    let row = id.split('_').pop();
    let row_id = "additional_labels_" + row;
    
    let row_child_nodes = document.getElementById(row_id).childNodes;
    // let row_serial_number = row_child_nodes[0];
    // let row_description = row_child_nodes[1];
    // let row_quantity = row_child_nodes[2];
    // let row_unit = row_child_nodes[3];
    // let row_est_cost = row_child_nodes[4];
    let value_in_amount = row_child_nodes[5];
    
    additionalCost( e, value_in_amount );

}

const additionalCost = ( e, value_in_amount ) => {

    if (
        e.target.id.includes('additional_value_')
    )
    {
        let total_value = document.getElementById('total_calculated_amount').textContent;
        let value_in_amount_int = parseFloat(value_in_amount.textContent == '' ? 0 : value_in_amount.textContent);
        if ( isNaN(value_in_amount_int) )
        {
            value_in_amount.style.outline = "1px solid red";
            return false;
        }else
        {
            value_in_amount.style.outline = "none";
        }

        total_value = parseFloat(total_value) + value_in_amount_int;
        SubTotalCostCalculation();
    }

}

const CalculateEstTotalCost = ( e, row_quantity, row_est_cost, row_total_cost, row_serial_number, row_description, row_unit, row ) => {

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
            if ( isNaN(quantity) || quantity < 0 )
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
    
            row_total_cost.textContent = parseFloat(quantity * est_cost).toFixed(2);
            SubTotalCostCalculation();
        }
    }

}

export const SubTotalCostCalculation = () => {

    let rows = document.getElementById('specifications_table_body').childNodes;
    let rows_array = Object.keys(rows).map((key) => [rows[key]]);
    let total_calculated_amount = 0;
    for ( let x = 0; x < rows_array.length; x++ )
    {
        let est_total_column = rows_array[x][0].childNodes[5];
        if ( est_total_column.textContent !== '' )
        {
            total_calculated_amount = total_calculated_amount + parseFloat(est_total_column.textContent);
        }
    }

    document.getElementById('sub_total_calculated_amount').textContent = parseFloat(total_calculated_amount).toFixed(2);
    TotalCostCalculation();
    return total_calculated_amount;

}

export const TotalCostCalculation = () => {

    let sub_total = document.getElementById('sub_total_calculated_amount').textContent;
    let rows = document.getElementById('specifications_table_footer').childNodes;
    let filtered_rows = Array.from(rows).filter(row => row.id.includes('additional_labels_'));
    let rows_array = Object.keys(filtered_rows).map((key) => [filtered_rows[key]]);
    let total_calculated_amount = 0;
    for ( let x = 0; x < rows_array.length; x++ )
    {
        let label_value_column = rows_array[x][0].childNodes[5];
        if ( label_value_column.textContent !== '' )
        {
            total_calculated_amount = total_calculated_amount + parseFloat(label_value_column.textContent);
        }
    }

    document.getElementById('total_calculated_amount').textContent = parseFloat(parseFloat(sub_total) + parseFloat(total_calculated_amount)).toFixed(2);
    return parseFloat(parseFloat(sub_total) + parseFloat(total_calculated_amount)).toFixed(2);

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

export const searchVendor = ( e, setVendors, setVendor ) => {

    setVendor();
    if ( e.target.value === '' )
    {
        setVendors();
        return false;
    }

    axios.post('/inventory/venders/search', { key: e.target.value }).then(
        res => {

            setVendors( res.data );

        }
    ).catch(
        err => {

            console.log( err );

        }
    )

}

const SetSerialNumber = ( row_serial_number, row_description, row_quantity, row_est_cost, row_unit, row ) => {

    if (
        row_description.textContent !== '' &&
        row_quantity.textContent !== '' &&
        row_quantity.textContent != 0 &&
        row_quantity.textContent > 0 &&
        row_unit.textContent !== '' &&
        row_est_cost.textContent !== ''
    )
    {
        row_serial_number.textContent = row;
    }else
    {
        row_serial_number.textContent = "";
    }
    
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

export const onAttachBills = ( event, Bills, setBills ) => {
    const reader = new FileReader();
    
    reader.onload = () => {

        if( reader.readyState === 2 )
        {
            let arr = Bills;
            for ( let x= 0; x < event.target.files.length; x++ )
            {
                arr = [...arr, {file: event.target.files[x],name: event.target.files[x].name,extension: event.target.files[x].type}];
            }
            setBills(arr);
        }
        
    }

    if ( event.target.files[0] ) {
        reader.readAsDataURL( event.target.files[0] );
    }
    
}

export const SubmitPO = ( e, setData, setSubmitConfirmation, setSpecifications ) => {

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
            console.log(obj)
            specifications.push( obj );
        }
    }
    
    if ( specifications.length === 0 )
    {
        validation_passed = false;
        JSAlert.alert("No Specification Found.").dismissIn(1000 * 2);
    }
    
    let additional_rows = document.getElementById('specifications_table_footer').childNodes;
    let filtered_rows = Array.from(additional_rows).filter(row => row.id.includes('additional_labels_'));
    let additional_rows_array = Object.keys(filtered_rows).map((key) => [filtered_rows[key]]);
    let additional_specifications = [];

    for ( let x = 0; x < additional_rows_array.length; x++ )
    {
        let column_passed = true;
        let obj = {};
        let columns = additional_rows_array[x][0].childNodes;
        let columns_array = Object.keys(columns).map((key) => [columns[key]])
        if ( additional_rows_array[x][0].childNodes[4].textContent !== '' || additional_rows_array[x][0].childNodes[5].textContent !== '' )
        {
            if ( additional_rows_array[x][0].childNodes[4].textContent === '' )
            {
                validation_passed = false;
                JSAlert.alert("There is an incomplete value in the additional specifications list.").dismissIn(1000 * 2);
            }
            if ( additional_rows_array[x][0].childNodes[5].textContent === '' )
            {
                validation_passed = false;
                JSAlert.alert("There is an incomplete value in the additional specifications list.").dismissIn(1000 * 2);
            }
        }
        
        for ( let y = 0; y < columns_array.length; y++ )
        {
            if ( columns_array[y][0].id !== '' )
            {
                let label = columns_array[y][0].id.split('_');
                label.pop();
                obj = {
                    ...obj,
                    [label.join("_")]: columns_array[y][0].textContent
                }
            }
        }

        let obj_arr = Object.keys(obj).map((key) => [obj[key]])
        for ( let z = 0; z < obj_arr.length; z++ )
        {
            if ( obj_arr[z][0] === '' )
            {
                column_passed = false;
            }else
            {
                column_passed = true;
            }
        }
        if ( column_passed )
        {
            additional_specifications.push( obj );
        }
    }

    if ( validation_passed )
    {
        const company_code = e.target['company_code'].value;
        const location_code = e.target['location_code'].value;
        const invoice_no = e.target['invoice_no'].value;
        const new_purchase_checkbox = e.target['new_purchase'].checked;
        const repair_checkbox = e.target['repair'].checked;
        const replace_recycle_checkbox = e.target['replace_recycle'].checked;
        const invoice_attached_checkbox = e.target['invoice_attached'].checked;
        const sub_total_calculated_amount = SubTotalCostCalculation();
        const total_calculated_amount = TotalCostCalculation();

        // if ( total_calculated_amount < 0 )
        // {
        //     JSAlert.alert('Total amount should be greater than 0!!!').dismissIn(1000 * 2);
        //     return false;
        // }
        setData(
            {
                company_code: company_code,
                location_code: location_code,
                invoice_no: invoice_no,
                new_purchase_checkbox: new_purchase_checkbox,
                repair_checkbox: repair_checkbox,
                replace_recycle_checkbox: replace_recycle_checkbox,
                invoice_attached_checkbox: invoice_attached_checkbox,
                sub_total_calculated_amount: sub_total_calculated_amount,
                total_calculated_amount: total_calculated_amount,
                additional_specifications: additional_specifications
            }
        )
        
        setSubmitConfirmation( true );
        setSpecifications( specifications );
    }

}

export const updatePO = ( e, setData, setEditConfirmation, setEditedSpecifications ) => {

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
    
    let additional_rows = document.getElementById('specifications_table_footer').childNodes;
    let filtered_rows = Array.from(additional_rows).filter(row => row.id.includes('additional_labels_'));
    let additional_rows_array = Object.keys(filtered_rows).map((key) => [filtered_rows[key]]);
    let additional_specifications = [];

    for ( let x = 0; x < additional_rows_array.length; x++ )
    {
        let column_passed = true;
        let obj = {};
        let columns = additional_rows_array[x][0].childNodes;
        let columns_array = Object.keys(columns).map((key) => [columns[key]])
        if ( additional_rows_array[x][0].childNodes[4].textContent !== '' || additional_rows_array[x][0].childNodes[5].textContent !== '' )
        {
            if ( additional_rows_array[x][0].childNodes[4].textContent === '' )
            {
                validation_passed = false;
                JSAlert.alert("There is an incomplete value in the additional specifications list.").dismissIn(1000 * 2);
            }
            if ( additional_rows_array[x][0].childNodes[5].textContent === '' )
            {
                validation_passed = false;
                JSAlert.alert("There is an incomplete value in the additional specifications list.").dismissIn(1000 * 2);
            }
        }
        
        for ( let y = 0; y < columns_array.length; y++ )
        {
            if ( columns_array[y][0].id !== '' )
            {
                let label = columns_array[y][0].id.split('_');
                label.pop();
                obj = {
                    ...obj,
                    [label.join("_")]: columns_array[y][0].textContent
                }
            }
        }

        let obj_arr = Object.keys(obj).map((key) => [obj[key]])
        for ( let z = 0; z < obj_arr.length; z++ )
        {
            if ( obj_arr[z][0] === '' )
            {
                column_passed = false;
            }else
            {
                column_passed = true;
            }
        }
        if ( column_passed )
        {
            additional_specifications.push( obj );
        }
    }

    if ( validation_passed )
    {
        const company_code = e.target['company_code'].value;
        const location_code = e.target['location_code'].value;
        const invoice_no = e.target['invoice_no'].value;
        const new_purchase_checkbox = e.target['new_purchase'].checked;
        const repair_checkbox = e.target['repair'].checked;
        const replace_recycle_checkbox = e.target['replace_recycle'].checked;
        const invoice_attached_checkbox = e.target['invoice_attached'].checked;
        const sub_total_calculated_amount = SubTotalCostCalculation();
        const total_calculated_amount = TotalCostCalculation();
        setData(
            {
                company_code: company_code,
                location_code: location_code,
                invoice_no: invoice_no,
                new_purchase_checkbox: new_purchase_checkbox,
                repair_checkbox: repair_checkbox,
                replace_recycle_checkbox: replace_recycle_checkbox,
                invoice_attached_checkbox: invoice_attached_checkbox,
                sub_total_calculated_amount: sub_total_calculated_amount,
                total_calculated_amount: total_calculated_amount,
                additional_specifications: additional_specifications
            }
        )
        setEditConfirmation( true );
        setEditedSpecifications( specifications );
    }

}

export const POSubmittion = ( e, history, Bills, Data, PR, Vendor, specifications ) => {

    e.preventDefault();
    const FormFields = new FormData();
    $('fieldset').prop('disabled', true);
    FormFields.append( "specifications", JSON.stringify(specifications) );
    FormFields.append( "data", JSON.stringify(Data) );
    FormFields.append( "note", e.target['notes'].value );
    FormFields.append( "submitted_to", e.target['request_to'].value );
    FormFields.append( "pr_id", PR);
    FormFields.append( "vendor_id", Vendor);
    FormFields.append( "requested_by", localStorage.getItem("EmpID") );
    Bills.forEach(
        file => {
            FormFields.append("Attachments", file.file);
        }
    );

    axios.post(
        '/purchase/order/submission',
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
                let draft_id = $('input#draft_id').val();
                if ( draft_id !== undefined || draft_id !== '' || draft_id !== null )
                {
                    let po_list = JSON.parse(localStorage.getItem('poDrafts'));
                    if ( po_list )
                    {
                        let arr = po_list.filter(function(item) {
                            return item.draft_id != draft_id
                        });
                        if ( arr.length === 0 )
                        {
                            localStorage.removeItem('poDrafts');
                        }else
                        {
                            localStorage.setItem('poDrafts', JSON.stringify(arr));
                        }
                    }
                }

                socket.emit( 'new_purchase_order_found' );
                setTimeout(() => {
                    $('fieldset').prop('disabled', false);
                    history.replace('/purchase/order/requests');
                }, 2000);
                JSAlert.alert('Purchase Order Has Been Generated').dismissIn(1000 * 2);
            }else
            {
                $('fieldset').prop('disabled', false);
                JSAlert.alert("Something went wrong, cannot create purchase order!!!").dismissIn(1000 * 2);
            }

        }
    ).catch(
        err => {

            $('fieldset').prop('disabled', false);
            console.log(err);

        }
    );

    
}

export const POUpdate = ( e, history, Data, Vendor, specifications, Bills, RemovedBills, PR ) => {

    e.preventDefault();
    const FormFields = new FormData();
    $('fieldset').prop('disabled', true);
    FormFields.append( "specifications", JSON.stringify(specifications) );
    FormFields.append( "RemovedBills", JSON.stringify(RemovedBills) );
    FormFields.append( "data", JSON.stringify(Data) );
    FormFields.append( "note", e.target['notes'].value );
    FormFields.append( "submitted_to", e.target['request_to'].value );
    FormFields.append( "vendor_id", Vendor);
    FormFields.append( "requested_by", localStorage.getItem("EmpID") );
    FormFields.append( "po_id", window.location.href.split('&&po_id=').pop() );
    FormFields.append( "pr_id", PR);
    console.log(PR);
    Bills.forEach(
        file => {
            if ( file.file ) FormFields.append("Attachments", file.file);
        }
    );

    axios.post(
        '/purchase/order/update',
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
                socket.emit( 'new_purchase_order_found' );
                setTimeout(() => {
                    $('fieldset').prop('disabled', false);
                    history.replace('/purchase/order/details?po_id=' + window.location.href.split('&&po_id=').pop());
                }, 2000);
                JSAlert.alert('Purchase Order Has Been Updated').dismissIn(1000 * 2);
            }

        }
    ).catch(
        err => {

            $('fieldset').prop('disabled', false);
            console.log(err);

        }
    );

    
}

export const CancelRequisition = ( e, po_id, history, RequestDetails ) => {

    e.preventDefault();
    const reason = e.target['reason'].value;
    const code = RequestDetails?.company_short_code + '-' + RequestDetails?.series_year + '-' + RequestDetails?.series_code;
    $('fieldset').prop('disabled', true);
    axios.post(
        '/purchase/order/cancellation',
        {
            emp_id: localStorage.getItem('EmpID'),
            reason: reason,
            po_id: po_id,
            code: code
        }
    )
    .then(
        res => 
        {
                
            if ( res.data === 'success' )
            {
                setTimeout(() => {
                    history.push('/purchase/order/requests');
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

export const loadSubOrdinands = ( setSubOrdinands ) => {

    axios.post(
        '/purchase/order/load/subordinates',
        {
            emp_id: localStorage.getItem('EmpID')
        }
    )
    .then(
        res => 
        {
                
            setSubOrdinands(res.data);

        }
    ).catch(
        err => {

            console.log(err);

        }
    );

}

export const ApproveRequisition = ( e, po_id, requested_by, history ) => {

    e.preventDefault();
    const reason = e.target['reason'].value;
    const submit_to = e.target['submit_to'].value;
    $('fieldset').prop('disabled', true);
    axios.post(
        '/purchase/order/approval',
        {
            emp_id: localStorage.getItem('EmpID'),
            reason: reason,
            submit_to: submit_to,
            po_id: po_id,
            requested_by: requested_by
        }
    )
    .then(
        res => 
        {
                
            if ( res.data === 'success' )
            {
                setTimeout(() => {
                    history.push('/purchase/order/requests');
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

export const overrideRequisition = ( e, status, RequestDetails, history ) => {

    e.preventDefault();
    const remarks = e.target['remarks'].value;
    $('fieldset').prop('disabled', true);
    axios.post(
        '/purchase/order/override',
        {
            emp_id: localStorage.getItem('EmpID'),
            name: localStorage.getItem('name'),
            remarks: remarks,
            status: status,
            po_id: window.location.href.split('?po_id=').pop(),
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
                    history.push('/purchase/order/requests');
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

export const RejectRequisition = ( e, po_id, requested_by, Specifications, history ) => {

    e.preventDefault();
    const reason = e.target['reason'].value;
    $('fieldset').prop('disabled', true);
    axios.post(
        '/purchase/order/reject',
        {
            emp_id: localStorage.getItem('EmpID'),
            remarks: reason,
            po_id: po_id,
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
                    history.push('/purchase/order/requests');
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

export const loadRequests = ( companies, CompanyViewer, Admin, setRequests ) => {

    axios.post(
        '/purchase/order/load/requests',
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

export const openRequestDetails = ( po_id, edit, setRequestDetails, setSpecifications, setAttachedBills, setAdditionalRows, setPRequestDetails, setPRSpecifications, setBills, setPR, setPRCode, setSPRSpecifications ) => {

    axios.post(
        '/purchase/order/details',
        {
            po_id: po_id,
            viewed: true
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

            if ( edit )
            {
                setBills(res.data[0][3]);
                for ( let x = 0; x < res.data[0][2].length; x++ )
                {
                    const newKeys = { sr_no: "specification_serial_number", description: "specification_description", quantity: "specification_quantity", unit: "specification_unit", unit_price: "specification_est_cost", total_cost: "specification_total_cost" };
                    const obj = renameKeys(res.data[0][2][x], newKeys);
                    specifications.push(obj);
                }
            }else
            {
                specifications = res.data[0][2];
            }
            setRequestDetails(res.data[0][1][0]);
            setSpecifications(specifications);
            setAttachedBills(res.data[0][3]);
            setAdditionalRows(res.data[0][4]);
            if ( res.data[1].length > 0 )
            {
                if ( edit )
                {
                    setPR(res.data[1][0][0].pr_id);
                    setPRCode(res.data[1][0][0].company_short_code + '-' + res.data[1][0][0].series_year + '-' + res.data[1][0][0].series_code);
                    setSPRSpecifications(res.data[1][0][0].specifications);
                }
                setPRequestDetails( res.data[1][0][0] );
                setPRSpecifications( res.data[1][1] )
            }

        }
    ).catch(
        err => {

            console.log(err);

        }
    );

}