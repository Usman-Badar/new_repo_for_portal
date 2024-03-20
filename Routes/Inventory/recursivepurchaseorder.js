const express = require('express');
const router = express.Router();
const db = require('../../db/connection');
const fs = require('fs');
const MakeDir = require('fs');
const moment = require('moment');
const io = require('../../server');
const ExcelJS = require('exceljs');

function getFinancialYear()
{
    const d = new Date();
    const month = d.getMonth() + 1;
    let financialYear = '';
    if ( month < 7 )
    {
        const year2 = d.getFullYear().toString().substring(2,4);
        const year1 = parseInt(year2) - 1;
        financialYear = year1 + '/' + year2;
    }else
    {
        const year1 = d.getFullYear().toString().substring(2,4);
        const year2 = parseInt(year1) + 1;
        financialYear = year1 + '/' + year2;
    }

    return financialYear;
}

const SendWhatsappNotification = require('../Whatsapp/whatsapp').SendWhatsappNotification;

io.on('connection', ( socket ) => {

    socket.on(
        'newpurchaseorder', () => {
            
            socket.broadcast.emit('newpurchaseorder');
    
        }
    )

});

router.post('/purchase/order/recursive/submission', ( req, res ) => {
    const { submitted_to, specifications, data, note, pr_id, vendor_id, requested_by } = req.body;

    const code = new Date().getTime() + '_' + new Date().getDate() + (new Date().getMonth() + 1) + new Date().getFullYear();
    const received_specifications = JSON.parse( specifications );
    let arr_specifications_names = []; 
    const received_data = JSON.parse( data );
    let bills_attached = 0;
    const financial_year = getFinancialYear();

    if ( parseFloat(received_data.total_calculated_amount) < 0 )
    {
        res.send('err');
        res.end();
        return false;
    }

    if ( req.files )
    {
        const { Attachments } = req.files;
        let arr;
        if ( typeof(Attachments) === 'object' && !Attachments.length )
        {
            arr = [Attachments];
        }else
        {
            arr = Attachments;
        }
        bills_attached = arr.length;
    }
    for ( let x = 0; x < received_specifications.length; x++ )
    {
        arr_specifications_names.push(received_specifications[x].specification_description);
    }

    db.getConnection(
        ( err, connection ) => {
            connection.beginTransaction(
                ( err ) => {
                    if ( err )
                    {
                        connection.rollback(() => {console.log(err);connection.release();});
                    }else
                    {
                        connection.query(
                            "INSERT INTO `tbl_recursive_purchase_order`(`series_year`, `series_code`, `pr_id`, `invoice_no`, `entry`, `specifications`, `vendor_id`, `company_code`, `ship_to`, `new_purchase`, `repair`, `replace_recycle`, `invoice_attached`, `requested_by`, `requested_date`, `requested_time`, `total_value`, `total_sub_value`, `no_items_requested`, `status`, `appr_rejct_by`, `bills_attached`, `note`) SELECT ?,(select MAX(ifnull((select series_code from tbl_recursive_purchase_order where company_code = ? AND series_year = ? ORDER BY po_id DESC LIMIT 1),0)) + 1),?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?;",
                            [financial_year, received_data.company_code, financial_year, pr_id == 'undefined' ? null : pr_id, received_data.invoice_no, code, arr_specifications_names.join(', '), vendor_id, received_data.company_code, received_data.location_code, received_data.new_purchase_checkbox ? 1 :0, received_data.repair_checkbox ? 1 :0, received_data.replace_recycle_checkbox ? 1 :0, received_data.invoice_attached_checkbox ? 1 :0, requested_by, new Date(), new Date().toTimeString(), parseFloat(received_data.total_calculated_amount), parseFloat(received_data.sub_total_calculated_amount), received_specifications.length, "waiting_for_approval", submitted_to, bills_attached, note],
                            ( err, rslt ) => {
                    
                                if( err )
                                {
                                    connection.rollback(() => {console.log(err);connection.release();});
                                    res.send('err');
                                    res.end();
                                }else 
                                {
                                    const mPoId = rslt.insertId;
                                    let specLimit = received_specifications.length;
                                    let speccount = [];
                                    function addSpecifications()
                                    {
                                        connection.query(
                                            "INSERT INTO `tbl_recursive_purchase_order_details`(`po_id`, `sr_no`, `description`, `quantity`, `unit`, `unit_price`, `total_cost`, `entered_by`, `entered_date`) VALUES (?,?,?,?,?,?,?,?,?);",
                                            [mPoId, received_specifications[speccount.length].specification_serial_number, received_specifications[speccount.length].specification_description, parseFloat(received_specifications[speccount.length].specification_quantity), received_specifications[speccount.length].specification_unit, parseFloat(received_specifications[speccount.length].specification_est_cost), parseFloat(received_specifications[speccount.length].specification_total_cost), requested_by, new Date()],
                                            ( err ) => {
                                                if( err )
                                                {
                                                    connection.rollback(() => {console.log(err);connection.release();});
                                                    res.send('err');
                                                    res.end();
                                                }else
                                                {
                                                    if ( ( speccount.length + 1 ) === specLimit )
                                                    {
                                                        console.log( "PO specifications added" );
                                                    }else
                                                    {
                                                        speccount.push(1);
                                                        addSpecifications();
                                                    }
                                                }
                                            }
                                        );
                                    }
                                    addSpecifications();

                                    if ( received_data.additional_specifications.length > 0 )
                                    {
                                        let limit = received_data.additional_specifications.length;
                                        let count = [];
                                        function addAdditionalSpecifications()
                                        {
                                            connection.query(
                                                "INSERT INTO `tbl_recursive_purchase_order_additional_specifications`(`po_id`, `label`, `value`, `entered_by`, `entered_date`) VALUES (?,?,?,?,?);",
                                                [mPoId, received_data.additional_specifications[count.length].additional_label, received_data.additional_specifications[count.length].additional_value, requested_by, new Date()],
                                                ( err ) => {
                                                    if( err )
                                                    {
                                                        connection.rollback(() => {console.log(err);connection.release();});
                                                        res.send('err');
                                                        res.end();
                                                    }else
                                                    {
                                                        if ( ( count.length + 1 ) === limit )
                                                        {
                                                            console.log( "PO additional specifications added" );
                                                        }else
                                                        {
                                                            count.push(1);
                                                            addAdditionalSpecifications();
                                                        }
                                                    }
                                                }
                                            );
                                        }
                                        addAdditionalSpecifications();
                                    }

                                    if ( req.files )
                                    {
                                        const { Attachments } = req.files;
                                        let arr;
                                        if ( typeof(Attachments) === 'object' && !Attachments.length )
                                        {
                                            arr = [Attachments];
                                        }else
                                        {
                                            arr = Attachments;
                                        }
                                        for ( let y = 0; y < arr.length; y++ )
                                        {
                                            MakeDir.mkdir('assets/inventory/assets/images/bills',
                                                { recursive: true },
                                                (err) => {
                                                    if (err) {
                                                        connection.rollback(() => {console.log(err);connection.release();});
                                                        res.status(500).send(err);
                                                        res.end();
                                                    }
                                                    else {
                                                        let name = new Date().getTime() + "_" + arr[y].name;
                                                        arr[y].mv('assets/inventory/assets/images/bills/' + name, (err) => {
                                                                if (err) 
                                                                {
                                                                    connection.rollback(() => {console.log(err);connection.release();});
                                                                    res.status(500).send(err);
                                                                    res.end();
                                                                }else
                                                                {
                                                                    connection.query(
                                                                        "INSERT INTO `tbl_recursive_purchase_order_bills`(`bill`, `uploaded_by`, `uploaded_date`, `uploaded_time`, `po_id`) VALUES (?,?,?,?,?);",
                                                                        ['assets/inventory/assets/images/bills/' + name, requested_by, new Date(), new Date().toTimeString(), mPoId],
                                                                        ( err ) => {
                                                                            if( err )
                                                                            {
                                                                                connection.rollback(() => {console.log(err);connection.release();});
                                                                                res.send( err );
                                                                                res.end();
                                                                            }
                                                                        }
                                                                    );
                                                                }
                                                            }
                                                        )
                                                    }
                                                }
                                            )

                                            if ( (y+1) === arr.length )
                                            {
                                                connection.commit((err) => {
                                                    if ( err ) {
                                                        connection.rollback(() => {console.log(err);connection.release();});
                                                        res.send('err');
                                                        res.end();
                                                    }else
                                                    {
                                                        connection.release();
                                                        res.send('success');
                                                        res.end();
                                                    }
                                                });
                                            }
                                        }
                                    }else
                                    {
                                        connection.commit((err) => {
                                            if ( err ) {
                                                connection.rollback(() => {console.log(err);connection.release();});
                                                res.send('err');
                                                res.end();
                                            }else
                                            {
                                                connection.release();
                                                res.send('success');
                                                res.end();
                                            }
                                        });
                                    }
                                }
                                
                            }
                        );
                    }
                }
            )
        }
    )

} );

router.post('/purchase/order/recursive/load/requests', ( req, res ) => {

    const { emp_id, companyViewer, companies, accessKey } = req.body;

    let companies_query = "";
    if ( companyViewer === 1 )
    {
        const parsed_companies = JSON.parse(companies);
        companies_query = companies_query.concat("WHERE (");
        for ( let x = 0; x < parsed_companies.length; x++ )
        {
            if ( x === 0 ) {
                companies_query = companies_query.concat("tbl_recursive_purchase_order.company_code = " + parseInt(parsed_companies[x]) + " ");
            }else {
                companies_query = companies_query.concat("OR tbl_recursive_purchase_order.company_code = " + parseInt(parsed_companies[x]) + " ");
            }
        }
    }

    db.query(
        "SELECT tbl_recursive_purchase_order.*,  \
        approval_employee.name AS approval_employee_name,  \
        approval_employee_designations.designation_name AS approval_employee_designation_name,  \
        requested_employee.name AS requested_employee_name,  \
        requested_employee_designations.designation_name AS requested_employee_designation_name,  \
        companies.*, \
        locations.location_name \
        FROM `tbl_recursive_purchase_order`  \
        LEFT OUTER JOIN companies ON tbl_recursive_purchase_order.company_code = companies.company_code \
        LEFT OUTER JOIN locations ON tbl_recursive_purchase_order.ship_to = locations.location_code \
        LEFT OUTER JOIN employees requested_employee ON tbl_recursive_purchase_order.requested_by = requested_employee.emp_id \
        LEFT OUTER JOIN employees approval_employee ON tbl_recursive_purchase_order.appr_rejct_by = approval_employee.emp_id \
        LEFT OUTER JOIN designations approval_employee_designations ON approval_employee.designation_code = approval_employee_designations.designation_code \
        LEFT OUTER JOIN designations requested_employee_designations ON requested_employee.designation_code = requested_employee_designations.designation_code \
        " + ( accessKey === 1 ? " WHERE tbl_recursive_purchase_order.status != 'deleted' " : companyViewer ? companies_query + ')' : "WHERE (requested_by = ? OR submitted_to = ? OR appr_rejct_by = ?)" ) + " AND tbl_recursive_purchase_order.status != 'deleted' ORDER BY po_id DESC;",
        [ emp_id, emp_id, emp_id ],
        ( err, rslt ) => {
            if( err )
            {
                console.log( err );
                res.send( err );
                res.end();
            }else 
            {
                res.send(rslt);
                res.end();
            }
        }
    );

} );

router.post('/purchase/order/recursive/details', ( req, res ) => {

    const { po_id } = req.body;

    db.query(
        "SELECT ? AND ? AND ?;" +
        "SELECT tbl_recursive_purchase_order.*,  \
        companies.*, \
        companies.code AS company_short_code, \
        submit_to_employee.name AS submit_to_employee_name, \
        hod_employee.name AS hod_employee_name, \
        override_person.name AS override_person_name, \
        requested_employee.name AS requested_employee_name, \
        requested_employee_designation.designation_name AS requested_employee_designation_name, \
        submit_to_employee_designation.designation_name AS submit_to_employee_designation_name, \
        hod_employee_designation.designation_name AS hod_employee_designation_name, \
        locations.location_code, \
        locations.location_name, \
        locations.address, \
        locations.location_phone, \
        tbl_inventory_venders.name AS vendor_name, \
        tbl_inventory_venders.phone AS vendor_phone, \
        tbl_inventory_venders.verified, \
        tbl_inventory_venders.address AS vendor_address \
        FROM `tbl_recursive_purchase_order`  \
        LEFT OUTER JOIN companies ON tbl_recursive_purchase_order.company_code = companies.company_code \
        LEFT OUTER JOIN locations ON tbl_recursive_purchase_order.ship_to = locations.location_code \
        LEFT OUTER JOIN tbl_inventory_venders ON tbl_recursive_purchase_order.vendor_id = tbl_inventory_venders.vender_id \
        LEFT OUTER JOIN employees requested_employee ON tbl_recursive_purchase_order.requested_by = requested_employee.emp_id \
        LEFT OUTER JOIN employees submit_to_employee ON tbl_recursive_purchase_order.submitted_to = submit_to_employee.emp_id \
        LEFT OUTER JOIN employees hod_employee ON tbl_recursive_purchase_order.appr_rejct_by = hod_employee.emp_id \
        LEFT OUTER JOIN employees override_person ON tbl_recursive_purchase_order.override_by = override_person.emp_id \
        LEFT OUTER JOIN designations requested_employee_designation ON requested_employee.designation_code = requested_employee_designation.designation_code \
        LEFT OUTER JOIN designations submit_to_employee_designation ON submit_to_employee.designation_code = submit_to_employee_designation.designation_code \
        LEFT OUTER JOIN designations hod_employee_designation ON hod_employee.designation_code = hod_employee_designation.designation_code \
        WHERE po_id = ?;" +
        "SELECT * FROM `tbl_recursive_purchase_order_details` WHERE po_id = ? ORDER BY sr_no;" +
        "SELECT * FROM `tbl_recursive_purchase_order_bills` WHERE po_id = ?;" +
        "SELECT * FROM `tbl_recursive_purchase_order_additional_specifications` WHERE po_id = ?;",
        [ new Date(), new Date().toTimeString(), po_id, po_id, po_id, po_id, po_id ],
        ( err, rslt ) => {

            if( err )
            {

                console.log( err )
                res.send( err );
                res.end();

            }else 
            {
                let arr = [];

                if ( rslt[1][0].pr_id )
                {
                    db.query( 
                        "SELECT tbl_inventory_purchase_requisition.*,  \
                        companies.company_name, \
                        companies.code AS company_short_code, \
                        submit_to_employee.name AS submit_to_employee_name, \
                        hod_employee.name AS hod_employee_name, \
                        requested_employee.name AS requested_employee_name, \
                        requested_employee_designation.designation_name AS requested_employee_designation_name, \
                        submit_to_employee_designation.designation_name AS submit_to_employee_designation_name, \
                        hod_employee_designation.designation_name AS hod_employee_designation_name, \
                        locations.location_name \
                        FROM `tbl_inventory_purchase_requisition`  \
                        LEFT OUTER JOIN companies ON tbl_inventory_purchase_requisition.company_code = companies.company_code \
                        LEFT OUTER JOIN locations ON tbl_inventory_purchase_requisition.location_code = locations.location_code \
                        LEFT OUTER JOIN employees requested_employee ON tbl_inventory_purchase_requisition.requested_by = requested_employee.emp_id \
                        LEFT OUTER JOIN employees submit_to_employee ON tbl_inventory_purchase_requisition.submitted_to = submit_to_employee.emp_id \
                        LEFT OUTER JOIN employees hod_employee ON tbl_inventory_purchase_requisition.appr_rejct_by = hod_employee.emp_id \
                        LEFT OUTER JOIN designations requested_employee_designation ON requested_employee.designation_code = requested_employee_designation.designation_code \
                        LEFT OUTER JOIN designations submit_to_employee_designation ON submit_to_employee.designation_code = submit_to_employee_designation.designation_code \
                        LEFT OUTER JOIN designations hod_employee_designation ON hod_employee.designation_code = hod_employee_designation.designation_code \
                        WHERE pr_id = ?;" +
                        "SELECT * FROM `tbl_inventory_purchase_requisition_specifications` WHERE pr_id = ?;",
                        [ rslt[1][0].pr_id, rslt[1][0].pr_id ],
                        ( err, result ) => {
                
                            if( err )
                            {
                
                                console.log( err );
                                res.send( err );
                                res.end();
                
                            }else
                            {
                                arr = result;
                
                                res.send([rslt, arr]);
                                res.end();
                            }
                
                        }
                    );
                }else
                {
                    res.send([rslt, []]);
                    res.end();
                }

            }

        }
    );

} );

router.post('/purchase/order/recursive/update', ( req, res ) => {

    const { pr_id, RemovedBills, submitted_to, specifications, data, note, vendor_id, requested_by, po_id } = req.body;

    const received_specifications = JSON.parse( specifications );
    const removed_bills = JSON.parse( RemovedBills );
    let arr_specifications_names = []; 
    const received_data = JSON.parse( data );
    // const financial_year = getFinancialYear();
    for ( let x = 0; x < received_specifications.length; x++ )
    {
        arr_specifications_names.push(received_specifications[x].specification_description);
    }

    db.query(
        "UPDATE `tbl_recursive_purchase_order` SET `appr_rejct_by` = ?, view_date = null, view_time = null, `pr_id` = ?, `specifications` = ?, `invoice_no` = ?, `vendor_id` = ?, `ship_to` = ?, `new_purchase` = ?, `repair` = ?, `replace_recycle` = ?, `invoice_attached` = ?, `total_value` = ?, `total_sub_value` = ?, `no_items_requested` = ?, `note` = ? WHERE po_id = ?;",
        [ submitted_to, pr_id == null || pr_id == undefined || pr_id == 'null' || pr_id == 'undefined' ? null : pr_id, arr_specifications_names.join(', '), received_data.invoice_no, vendor_id, received_data.location_code, received_data.new_purchase_checkbox ? 1 :0, received_data.repair_checkbox ? 1 :0, received_data.replace_recycle_checkbox ? 1 :0, received_data.invoice_attached_checkbox ? 1 :0, received_data.total_calculated_amount, received_data.sub_total_calculated_amount, received_specifications.length, note, po_id ],
        ( err ) => {

            if( err )
            {

                console.log( err );
                res.send( err );
                res.end();

            }else 
            {
                db.query(
                    "DELETE FROM `tbl_recursive_purchase_order_details` WHERE po_id = ?;" +
                    "DELETE FROM `tbl_recursive_purchase_order_additional_specifications` WHERE po_id = ?;",
                    [ po_id, po_id ],
                    ( err ) => {
            
                        if( err )
                        {
            
                            console.log( err );
                            res.send( err );
                            res.end();
            
                        }else
                        {
                            const mPoId = po_id;
                            let specLimit = received_specifications.length;
                            let speccount = [];
                            function addSpecifications()
                            {
                                db.query(
                                    "INSERT INTO `tbl_recursive_purchase_order_details`(`po_id`, `sr_no`, `description`, `quantity`, `unit`, `unit_price`, `total_cost`, `entered_by`, `entered_date`) VALUES (?,?,?,?,?,?,?,?,?);",
                                    [ mPoId, received_specifications[speccount.length].specification_serial_number, received_specifications[speccount.length].specification_description, received_specifications[speccount.length].specification_quantity, received_specifications[speccount.length].specification_unit, received_specifications[speccount.length].specification_est_cost, received_specifications[speccount.length].specification_total_cost, requested_by, new Date() ],
                                    ( err ) => {
                                        if( err )
                                        {
                                            console.log( err );
                                            res.send( err );
                                            res.end();
                                        }else
                                        {
                                            if ( ( speccount.length + 1 ) === specLimit )
                                            {
                                                console.log( "PO specifications added" );
                                            }else
                                            {
                                                speccount.push(1);
                                                addSpecifications();
                                            }
                                        }
                                    }
                                );
                            }
                            addSpecifications();

                            if ( received_data.additional_specifications.length > 0 )
                            {
                                let limit = received_data.additional_specifications.length;
                                let count = [];
                                function addAdditionalSpecifications()
                                {
                                    db.query(
                                        "INSERT INTO `tbl_recursive_purchase_order_additional_specifications`(`po_id`, `label`, `value`, `entered_by`, `entered_date`) VALUES (?,?,?,?,?);",
                                        [ mPoId, received_data.additional_specifications[count.length].additional_label, received_data.additional_specifications[count.length].additional_value, requested_by, new Date() ],
                                        ( err ) => {
                                            if( err )
                                            {
                                                console.log( err );
                                                res.send( err );
                                                res.end();
                                            }else
                                            {
                                                if ( ( count.length + 1 ) === limit )
                                                {
                                                    console.log( "PO additional specifications added" );
                                                }else
                                                {
                                                    count.push(1);
                                                    addAdditionalSpecifications();
                                                }
                                            }
                                
                                        }
                                    );
                                }
                                addAdditionalSpecifications();
                            }
                            
                            let removed_Limit = removed_bills.length;
                            let removed_Limit_count = [];
                            function removeBills()
                            {
                                db.query(
                                    "DELETE FROM `tbl_recursive_purchase_order_bills` WHERE bill_id = ?;",
                                    [removed_bills[removed_Limit_count.length].bill_id],
                                    ( err ) => {
                                        if( err )
                                        {
                                            console.log( err );
                                            res.send( err );
                                            res.end();
                                        }else
                                        {
                                            if ( fs.existsSync(removed_bills[removed_Limit_count.length].bill) ) fs.unlinkSync(removed_bills[removed_Limit_count.length].bill);
                                            if ( ( removed_Limit_count.length + 1 ) === removed_Limit )
                                            {
                                                console.log( "PO removed bill has been removed!!!" );
                                            }else
                                            {
                                                removed_Limit_count.push(1);
                                                removeBills();
                                            }
                                        }
                                    }
                                );
                            }
                            if ( removed_Limit > 0 )
                            {
                                removeBills();
                            }

                            if ( req.files )
                            {
                                const { Attachments } = req.files;
                                let arr;
                                if ( typeof(Attachments) === 'object' && !Attachments.length )
                                {
                                    arr = [Attachments];
                                }else
                                {
                                    arr = Attachments;
                                }
                                let bill_Limit = arr.length;
                                let bill_Limit_count = [];
                                function addBills()
                                {
                                    MakeDir.mkdir('assets/inventory/assets/images/bills',
                                        { recursive: true },
                                        (err) => {
                                            if (err) {
                                                console.log(err);
                                            }
                                            else {
                                                let name = new Date().getTime() + "_" + arr[bill_Limit_count.length].name;
                                                arr[bill_Limit_count.length].mv('assets/inventory/assets/images/bills/' + name, (err) => {
                                                        if (err) 
                                                        {
                                                            console.log(err);
                                                        }else
                                                        {
                                                            db.query(
                                                                "INSERT INTO `tbl_recursive_purchase_order_bills`(`bill`, `uploaded_by`, `uploaded_date`, `uploaded_time`, `po_id`) VALUES (?,?,?,?,?);",
                                                                ['assets/inventory/assets/images/bills/' + name, requested_by, new Date(), new Date().toTimeString(), mPoId],
                                                                ( err ) => {
                                                                    if( err )
                                                                    {
                                                                        console.log(err);
                                                                    }else
                                                                    {
                                                                        if ( ( bill_Limit_count.length + 1 ) === bill_Limit )
                                                                        {
                                                                            console.log( "PO added bill has been added!!!" );
                                                                        }else
                                                                        {
                                                                            bill_Limit_count.push(1);
                                                                            addBills();
                                                                        }
                                                                    }
                                                                }
                                                            );
                                                        }
                                                    }
                                                )
                                            }
                                        }
                                    )
                                }
                                addBills();
                            }

                            res.send('success');
                            res.end();
                        }
            
                    }
                );

            }

        }
    );

} );

router.post('/purchase/order/recursive/cancellation', ( req, res ) => {

    const { emp_id, reason, po_id, code } = req.body;

    db.query(
        "UPDATE tbl_recursive_purchase_order SET status = ?, appr_rejct_by = ?, act_date = ?, act_time = ?, remarks_from_hod = ? WHERE po_id = ?;",
        [ 'deleted', emp_id, new Date(), new Date().toTimeString(), reason, po_id ],
        ( err ) => {
            if( err )
            {
                console.log( err );
                res.send( err );
                res.end();
            }else 
            {
                res.send('success');
                res.end();
            }
        }
    );

} );

router.post('/purchase/order/recursive/generate/all', ( req, res ) => {

    const { emp_id, arr, checkedArr } = req.body;

    const List = JSON.parse(arr);
    const checkedPOs = JSON.parse(checkedArr);
    const limit = List.length;
    const count = [];
    const financial_year = getFinancialYear();
    const code = new Date().getTime() + '_' + new Date().getDate() + (new Date().getMonth() + 1) + new Date().getFullYear();
    function generatePO()
    {
        const obj = List[count.length];
        if (checkedPOs.includes(obj.po_id)) {
            db.query(
                "INSERT INTO `tbl_inventory_purchase_order`(`series_year`, `series_code`, `pr_id`, `invoice_no`, `entry`, `specifications`, `vendor_id`, `company_code`, `ship_to`, `new_purchase`, `repair`, `replace_recycle`, `invoice_attached`, `requested_by`, `requested_date`, `requested_time`, `total_value`, `total_sub_value`, `no_items_requested`, `status`, `appr_rejct_by`, `bills_attached`, `note`) SELECT ?,(select MAX(ifnull((select series_code from tbl_inventory_purchase_order where company_code = ? AND series_year = ? ORDER BY po_id DESC LIMIT 1),0)) + 1),?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?;",
                [financial_year, obj.company_code, financial_year, obj.pr_id, obj.invoice_no, code, obj.specifications, obj.vendor_id, obj.company_code, obj.ship_to, obj.new_purchase, obj.repair, obj.replace_recycle, obj.invoice_attached, emp_id, new Date(), new Date().toTimeString(), obj.total_value, obj.total_sub_value, obj.no_items_requested, 'waiting_for_approval', obj.appr_rejct_by, obj.bills_attached, obj.note],
                ( err, rslt ) => {
                    if( err )
                    {
                        console.log( err );
                        res.send( err );
                        res.end();
                    }else 
                    {
                        const mPoId = rslt.insertId;
                        db.query("UPDATE tbl_recursive_purchase_order SET last_generated_at = ? WHERE po_id = ?;", [new Date(), obj.po_id], () => {
                            console.log("last generated at date time saved")
                        });
                        db.query(
                            "SELECT * FROM tbl_recursive_purchase_order_additional_specifications WHERE po_id = ?;",
                            [obj.po_id],
                            ( err, addtionalSpec ) => {
                                const spec_limit = addtionalSpec.length;
                                const spec_count = [];
                                function addAddtionalSpec() {
                                    const spec_obj = addtionalSpec[spec_count.length];
                                    db.query(
                                        "INSERT INTO `tbl_inventory_purchase_order_additional_specifications`(`po_id`, `label`, `value`, `entered_by`, `entered_date`) VALUES (?,?,?,?,?);",
                                        [mPoId, spec_obj.label, spec_obj.value, emp_id, new Date()],
                                        () => {
                                            if ((spec_count.length+1) === spec_limit){
                                                console.log("PO specifications added");
                                            }else{
                                                spec_count.push(1);
                                                addAddtionalSpec();
                                            }
                                        }
                                    );
                                }
                                if (addtionalSpec.length > 0) addAddtionalSpec();
                            }
                        );
                        db.query(
                            "SELECT * FROM tbl_recursive_purchase_order_bills WHERE po_id = ?;",
                            [obj.po_id],
                            ( err, bills ) => {
                                const bill_limit = bills.length;
                                const bill_count = [];
                                function addBills() {
                                    const bill_obj = bills[bill_count.length];
                                    db.query(
                                        "INSERT INTO `tbl_inventory_purchase_order_bills`(`bill`, `uploaded_by`, `uploaded_date`, `uploaded_time`, `po_id`) VALUES (?,?,?,?,?);",
                                        [bill_obj.bill, emp_id, new Date(), new Date().toTimeString(), mPoId],
                                        () => {
                                            if ((bill_count.length+1) === bill_limit){
                                                console.log("PO bills added");
                                            }else{
                                                bill_count.push(1);
                                                addBills();
                                            }
                                        }
                                    );
                                }
                                if (bills.length > 0) addBills();
                            }
                        );
                        db.query(
                            "SELECT * FROM tbl_recursive_purchase_order_details WHERE po_id = ?;",
                            [obj.po_id],
                            ( err, spec ) => {
                                const spec_limit = spec.length;
                                const spec_count = [];
                                function addSPecs() {
                                    const spec_obj = spec[spec_count.length];
                                    db.query(
                                        "INSERT INTO `tbl_inventory_purchase_order_specifications`(`po_id`, `sr_no`, `description`, `quantity`, `unit`, `unit_price`, `total_cost`, `entered_by`, `entered_date`) VALUES (?,?,?,?,?,?,?,?,?);",
                                        [mPoId, spec_obj.sr_no, spec_obj.description, spec_obj.quantity, spec_obj.unit, spec_obj.unit_price, spec_obj.total_cost, emp_id, new Date()],
                                        () => {
                                            if ((spec_count.length+1) === spec_limit){
                                                console.log("PO specifications added");
                                            }else{
                                                spec_count.push(1);
                                                addSPecs();
                                            }
                                        }
                                    );
                                }
                                if (spec.length > 0) addSPecs();
                            }
                        );
                        db.query(
                            "SELECT name, cell FROM employees WHERE emp_id = ?;" + 
                            "SELECT name, cell FROM employees WHERE emp_id = ?;",
                            [ emp_id, obj.appr_rejct_by ],
                            ( err, rslt ) => {
                                SendWhatsappNotification( 
                                    null, 
                                    null, 
                                    "Dear " + rslt[1][0].name,
                                    "I hope this message finds you well. I wanted to inform you that " + rslt[0][0].name + " has sent a purchase order for various items, including " + obj.specifications + ". The total value of the requisition amounts to Rs " + obj.total_value + "/-.\
                                    Before proceeding further, could you kindly review the order to ensure that everything is in order and matches our requirements? Once you have thoroughly checked it, please confirm its accuracy so that we can process the purchase accordingly.\
                                    If you have any questions or need any clarification, please don't hesitate to reach out. Your prompt attention to this matter is greatly appreciated.\
                                    Thank you for your cooperation.\n\
                                    Best regards",
                                    rslt[1][0].cell 
                                );
                                SendWhatsappNotification( null, null, "Hi " + rslt[0][0].name, "Thank you for submitting your purchase order! We want to assure you that we have received it successfully. Our dedicated accounts department is already on the job and will begin processing it promptly. Kindly allow us a short time to ensure everything is handled accurately and efficiently. If you have any questions or need further assistance, feel free to reach out to our customer support team. We truly appreciate your business and look forward to fulfilling your order with utmost care and attention to detail.", rslt[0][0].cell );
                                if ((count.length+1) === limit){
                                    console.log("All Po Generated");
                                    res.send('success');
                                    res.end();
                                }else {
                                    count.push(1);
                                    generatePO();
                                }
                    
                            }
                        );
                    }
                }
            );
        }else {
            if ((count.length+1) === limit){
                console.log("All Po Generated");
                res.send('success');
                res.end();
            }else { 
                count.push(1);
                generatePO();
            }
        }
    }
    generatePO();

} );

module.exports = router;