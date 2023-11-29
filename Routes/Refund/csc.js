const express = require('express');
const router = express.Router();
const db = require('../../db/connection');
const moment = require('moment');
const fs = require('fs');
const owner = 1; // JP

const SendWhatsappNotification = require('../Whatsapp/whatsapp').SendWhatsappNotification;
const administrativeNotifications = require('../Employee/notifications').administrativeNotifications;

router.post('/refund/csc/submission', ( req, res ) => {

    const { emp_id, month_year, company_code, submit_to, processed_data, grand_total_data } = req.body;
    const grand_total_data_parsed = JSON.parse(grand_total_data);
    const processed_data_parsed = JSON.parse(processed_data);

    console.log(grand_total_data_parsed);

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
                            "INSERT INTO `tbl_refund_csc_reports`(`prepared_by`, `prepared_date`, `prepared_time`, `company`, `month`, `year`, `total_payable_csc_storage`, `total_qfs_box_qict_storage_roll_over_charges`, `total_gross_payable`, `total_less_w_h_t`, `total_net_csc`, `total_qfs_bill_adjustment`, `total_cheque_amount`, `no_of_forwarders`, `checked_by`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);",
                            [emp_id, new Date(), new Date().toTimeString(), company_code, month_year.split('-').pop(), month_year.split('-').shift(), parseFloat(grand_total_data_parsed.total_payable_csc_storage), parseFloat(grand_total_data_parsed.total_qfs_box_qict_storage_roll_over_charges), parseFloat(grand_total_data_parsed.total_gross_payable), parseFloat(grand_total_data_parsed.total_less_w_h_t), parseFloat(grand_total_data_parsed.total_net_csc), parseFloat(grand_total_data_parsed.total_qfs_bill_adjustment), parseFloat(grand_total_data_parsed.total_cheque_amount), processed_data_parsed.length, submit_to],
                            ( err, rslt ) => {
                    
                                if( err )
                                {
                                    connection.rollback(() => {console.log(err);connection.release();});
                                    res.send('err');
                                    res.end();
                                }else 
                                {
                                    if ( req.files )
                                    {
                                        const { file } = req.files;
                                        fs.mkdir('assets/portal/assets/excel/csc', { recursive: true }, (err) => {
                                                if (err) {
                                                    connection.rollback(() => {console.log(err);connection.release();});
                                                    res.status(500).send(err);
                                                    res.end();
                                                }else {
                                                    const name = new Date().getTime() + "_" + file.name;
                                                    file.mv('assets/portal/assets/excel/csc/' + name, (err) => {
                                                            if (err) 
                                                            {
                                                                connection.rollback(() => {console.log(err);connection.release();});
                                                                res.status(500).send(err);
                                                                res.end();
                                                            }else
                                                            {
                                                                console.log("Excel File Saved");
                                                            }
                                                        }
                                                    );
                                                }
                                            }
                                        )
                                    }
                                    const report_id = rslt.insertId;
                                    let limit = processed_data_parsed.length;
                                    let count = [];
                                    function addItems()
                                    {
                                        connection.query(
                                            "INSERT INTO `tbl_csc_refund_report_items`(`report_id`, `forwarder_name`, `payable_csc_storage`, `qfs_box_qict_storage_roll_over_charges`, `payable_gross_csc`, `tax_rate`, `less_w_h_t`, `net_csc`, `qfs_bill_adjustment`, `cheque_amount`, `gross_payable_from_file`, `less_wht_from_file`, `net_csc_from_file`, `cheque_amount_from_file`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?);",
                                            [report_id, processed_data_parsed[count.length].forwarder_name, processed_data_parsed[count.length].payable_csc_storage, processed_data_parsed[count.length].qfs_box_qict_storage_roll_over_charges, processed_data_parsed[count.length].payable_gross_csc, processed_data_parsed[count.length].tax_rate, processed_data_parsed[count.length].less_w_h_t, processed_data_parsed[count.length].net_csc, processed_data_parsed[count.length].qfs_bill_adjustment, processed_data_parsed[count.length].cheque_amount, processed_data_parsed[count.length].gross_payable_from_file, processed_data_parsed[count.length].less_wht_from_file, processed_data_parsed[count.length].net_csc_from_file, processed_data_parsed[count.length].cheque_amount_from_file],
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
                                                        console.log( "CSC items added" );
                                                        connection.query(
                                                            "SELECT name, cell FROM employees WHERE emp_id = ?;" + 
                                                            "SELECT name, cell FROM employees WHERE emp_id = ?;",
                                                            [ emp_id, submit_to ],
                                                            ( err, result ) => {
                                                                if( err )
                                                                {
                                                                    connection.rollback(() => {console.log(err);connection.release();});
                                                                    res.send('err');
                                                                    res.end();
                                                                }else
                                                                {
                                                                    const link = '/refund/csc/view/' + report_id;
                                                                    const message = result[0][0].name + " has submitted a CSC refund report: " + month_year;
                                                                    administrativeNotifications( link, owner, message );
                                                                    SendWhatsappNotification( null, null, "Hi " + result[0][0].name, "You have submitted a CSC refund report, your report is in review. Please wait...", result[0][0].cell );
                                                                    SendWhatsappNotification( null, null, "Hi " + result[1][0].name, result[0][0].name + " has submitted a CSC refund report. Kindly check", result[1][0].cell );
                                                                    connection.commit((err) => {
                                                                        if ( err ) {
                                                                            connection.rollback(() => {console.log(err);connection.release();});
                                                                            res.send('err');
                                                                            res.end();
                                                                        }else
                                                                        {
                                                                            connection.release();
                                                                            res.send("success");
                                                                            res.end();
                                                                        }
                                                                    });
                                                                }
                                                            }
                                                        );
                                                    }else
                                                    {
                                                        count.push(1);
                                                        addItems();
                                                    }
                                                }
                                            }
                                        );
                                    }
                                    addItems();
                                }
                            }
                        );
                    }
                }
            )
        }
    )
} );

router.post('/refund/csc/list', ( req, res ) => {
    const { emp_id, accessKey } = req.body;
    db.query(
        "SELECT  \
        tbl_refund_csc_reports.*, \
        companies.code, \
        req.name as requested_person, \
        checked.name as checked_person, \
        appr.name as approved_person \
        FROM `tbl_refund_csc_reports` \
        LEFT OUTER JOIN companies ON tbl_refund_csc_reports.company = companies.company_code \
        LEFT OUTER JOIN employees req ON tbl_refund_csc_reports.prepared_by = req.emp_id \
        LEFT OUTER JOIN employees checked ON tbl_refund_csc_reports.checked_by = checked.emp_id \
        LEFT OUTER JOIN employees appr ON tbl_refund_csc_reports.approved_by = appr.emp_id \
        " + ( accessKey === 1 ? "" : "WHERE prepared_by = ? OR checked_by = ? OR approved_by = ?" ) + " ORDER BY report_id DESC;",
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

router.post('/refund/csc/details', ( req, res ) => {
    const { report_id } = req.body;
    db.query(
        "SELECT  \
        tbl_refund_csc_reports.*, \
        companies.code, \
        req.name as requested_person, \
        checked.name as checked_person, \
        appr.name as approved_person \
        FROM `tbl_refund_csc_reports` \
        LEFT OUTER JOIN companies ON tbl_refund_csc_reports.company = companies.company_code \
        LEFT OUTER JOIN employees req ON tbl_refund_csc_reports.prepared_by = req.emp_id \
        LEFT OUTER JOIN employees checked ON tbl_refund_csc_reports.checked_by = checked.emp_id \
        LEFT OUTER JOIN employees appr ON tbl_refund_csc_reports.approved_by = appr.emp_id \
        WHERE report_id = ?;" +
        "SELECT * FROM `tbl_csc_refund_report_items` WHERE report_id = ?;",
        [ report_id, report_id ],
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

router.post('/refund/csc/set_to_checked', ( req, res ) => {
    const { report_id } = req.body;
    db.query(
        "UPDATE tbl_refund_csc_reports SET status = 'checked', checked_date= ?, checked_time = ? WHERE report_id = ?;",
        [ new Date(), new Date().toTimeString(), report_id ],
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

router.post('/refund/csc/set_to_paid_all', ( req, res ) => {
    const { report_id } = req.body;
    db.query(
        "UPDATE tbl_refund_csc_reports SET all_forwarders_paid = 1 WHERE report_id = ?;",
        [ report_id ],
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

router.post('/refund/csc/set_to_paid', ( req, res ) => {
    const { checked_by, month_year, emp_id, report_id, forwarders } = req.body;
    const parsed_forwarders = JSON.parse(forwarders);
    let limit = parsed_forwarders.length;
    let count = [];
    function addItems()
    {
        db.query(
            "UPDATE tbl_csc_refund_report_items SET status = 'paid', marked_by = ?, marked_date = ?, marked_time = ? WHERE id = ?;",
            [ emp_id, new Date(), new Date().toTimeString(), parsed_forwarders[count.length].id ],
            ( err ) => {
                if( err )
                {
                    res.send('err');
                    res.end();
                }else
                {
                    if ( ( count.length + 1 ) === limit )
                    {
                        console.log( "CSC items updated" );
                        db.query(
                            "SELECT name, cell FROM employees WHERE emp_id = ?;" + 
                            "SELECT name, cell FROM employees WHERE emp_id = ?;",
                            [ emp_id, checked_by ],
                            ( err, result ) => {
                                if( err )
                                {
                                    res.send('err');
                                    res.end();
                                }else
                                {
                                    const link = '/refund/csc/view/' + report_id;
                                    let message = "The following forwarders has been paid and updated in a CSC refund report: " + month_year + '\n';
                                    for ( let x = 0; x < parsed_forwarders.length; x++ )
                                    {
                                        message = message.concat(parsed_forwarders[x].forwarder_name + '\n');
                                    }
                                    administrativeNotifications( link, owner, message );
                                    SendWhatsappNotification( null, null, "Hi " + result[0][0].name, message, result[0][0].cell );
                                    SendWhatsappNotification( null, null, "Hi " + result[1][0].name, message, result[1][0].cell );
                                    res.send("success");
                                    res.end();
                                }
                            }
                        );
                    }else
                    {
                        count.push(1);
                        addItems();
                    }
                }
            }
        );
    }
    addItems();

} );

module.exports = {
    router: router
};