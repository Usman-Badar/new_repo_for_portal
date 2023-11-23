const express = require('express');
const router = express.Router();
const db = require('../../db/connection');
const fs = require('fs');
const io = require('../../server');
const SendWhatsappNotification = require('../Whatsapp/whatsapp').SendWhatsappNotification;
const administrativeNotifications = require('../Employee/notifications').administrativeNotifications;

const moment = require('moment');
var key = 'real secret keys should be long and random';
var encryptor = require('simple-encryptor')(key);
const owner = 5000; // JP
const inv = 20015; // Antash
const inv2 = 5000; // Saima

io.on('connection', ( socket ) => {
    socket.on(
        'admin_notification', (data) => {
            socket.broadcast.emit('admin_notification', { link: data.link, owner: data.owner, message: data.message });
        }
    )
    socket.on(
        'new_comment', (data) => {
            socket.broadcast.emit('new_comment');
        }
    )
});

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

router.post('/cash/advance/create', ( req, res ) => {

    const { pr_id, previous_slip, emp_id, request_to, company_code, location_code, reason, amountInWords, amount, employee } = req.body;
    const d = new Date();
    const financial_year = getFinancialYear();

    function sendNote(link, owner)
    {
        db.query(
            "SELECT name, cell FROM employees WHERE emp_id = ?;" + 
            "SELECT name, cell FROM employees WHERE emp_id = ?;" + 
            "SELECT name, cell FROM employees WHERE emp_id = ?;",
            [ emp_id, inv, inv2 ],
            ( err, result ) => {
                if( err )
                {
                    console.log( err );
                    res.send( err );
                    res.end();
                }else
                {
                    const message = result[0][0].name + " has requested for advance cash for PKR (" + amount.toLocaleString('en') + ")";
                    administrativeNotifications( link, owner, message );
                    SendWhatsappNotification( null, null, "Hi " + result[0][0].name, "Thank you for applying for an advance cash option. Your advance cash request is under review. Thank you for your patience.", result[0][0].cell );
                    SendWhatsappNotification( null, null, "Hi " + result[1][0].name, result[0][0].name + " has requested for an advance cash for PKR " + amount.toLocaleString('en') + ". Your review is appreciated", result[1][0].cell );
                    SendWhatsappNotification( null, null, "Hi " + result[2][0].name, result[0][0].name + " has requested for an advance cash for PKR " + amount.toLocaleString('en') + ". Your review is appreciated", result[2][0].cell );
                }
            }
        );
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
                            "SELECT * FROM `db_cash_balance` WHERE emp_id = ?;" +
                            "SELECT MAX(serial_no) AS last_serial_no FROM db_cash_receipts WHERE series_year = ? AND company = ?;",
                            [emp_id, financial_year, company_code],
                            ( err, rslt ) => {
                    
                                if( err )
                                {
                                    connection.rollback(() => {console.log(err);connection.release();});
                                    res.send('err');
                                    res.end();
                                }else 
                                {
                                    console.log(rslt[1][0].last_serial_no);
                                    let balance = 0;
                                    let serial_no = rslt[1][0] && rslt[1][0].last_serial_no ? (rslt[1][0].last_serial_no + 1) : 1;
                                    if ( rslt[0].length > 0 )
                                    {
                                        connection.query(
                                            "INSERT INTO `db_cash_receipts`(`previous_slip`, `pr_id`, `serial_no`, `series_year`, `emp_id`, `submit_date`, `submit_time`, `amount`, `amount_in_words`, `company`, `location`, `reason`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?);",
                                            [ previous_slip == 'null' || previous_slip == 'undefined' ? null : previous_slip, pr_id == 'null' || pr_id == 'undefined' ? null : pr_id, serial_no, financial_year, emp_id, d, d.toTimeString(), amount, amountInWords, company_code, location_code, reason ],
                                            ( err, result ) => {
                                                if( err )
                                                {
                                                    connection.rollback(() => {console.log(err);connection.release();});
                                                    res.send('err');
                                                    res.end();
                                                }else 
                                                {
                                                    connection.commit((err) => {
                                                        if ( err ) {
                                                            connection.rollback(() => {console.log(err);connection.release();});
                                                            res.send('err');
                                                            res.end();
                                                        }else
                                                        {
                                                            const link = '/cash/request/' + result.insertId.toString();
                                                            sendNote(link, owner);
                                                            connection.release();
                                                            res.send({ message: 'success', link: link, owner: owner, date: new Date().toDateString(), time: moment(new Date().toTimeString(),'h:mm:ss a').format('hh:mm A') });
                                                            res.end();
                                                        }
                                                    });
                                                }
                                            }
                                        );
                                    }else
                                    {
                                        connection.query(
                                            "INSERT INTO `db_cash_receipts`(`serial_no`, `series_year`, `emp_id`, `submit_date`, `submit_time`, `amount`, `amount_in_words`, `company`, `location`, `reason`) VALUES (?,?,?,?,?,?,?,?,?,?);" +
                                            "INSERT INTO `db_cash_balance`(`emp_id`, `balance`, `last_updated`) VALUES (?,?,?);",
                                            [ serial_no, financial_year, emp_id, d, d.toTimeString(), amount, amountInWords, company_code, location_code, reason, emp_id, balance, d ],
                                            ( err, result ) => {
                                                if( err )
                                                {
                                                    connection.rollback(() => {console.log(err);connection.release();});
                                                    res.send('err');
                                                    res.end();
                                                }else 
                                                {
                                                    connection.commit((err) => {
                                                        if ( err ) {
                                                            connection.rollback(() => {console.log(err);connection.release();});
                                                            res.send('err');
                                                            res.end();
                                                        }else
                                                        {
                                                            const link = '/cash/request/' + result[0].insertId.toString();
                                                            sendNote(link, owner);
                                                            connection.release();
                                                            res.send({ message: 'success', link: link, owner: owner, date: new Date().toDateString(), time: moment(new Date().toTimeString(),'h:mm:ss a').format('hh:mm A') });
                                                            res.end();
                                                        }
                                                    });
                                                }
                                            }
                                        );
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

router.post('/cash/load/requests', ( req, res ) => {

    // const { shipViewer, cashViewer, emp_id, cashier, location_code, accessKey } = req.body;
    const { shp_line_adv_cash_viewer, cashViewer, emp_id, cashier, location_code, accessKey } = req.body;
    let query = "";
    if (shp_line_adv_cash_viewer === 1) {
        query = "SELECT  \
        db_cash_receipts.*, \
        locations.location_name, \
        companies.company_name, \
        companies.code AS company_code_name, \
        record.name AS record_emp_name, \
        appr.name AS appr_emp_name, \
        req.name AS requested_emp_name \
        FROM `db_cash_receipts`  \
        LEFT OUTER JOIN employees record ON db_cash_receipts.verified_by = record.emp_id \
        LEFT OUTER JOIN employees appr ON db_cash_receipts.approved_by = appr.emp_id \
        LEFT OUTER JOIN employees req ON db_cash_receipts.emp_id = req.emp_id \
        LEFT OUTER JOIN locations ON db_cash_receipts.location = locations.location_code \
        LEFT OUTER JOIN companies ON db_cash_receipts.company = companies.company_code \
        WHERE db_cash_receipts.shp_line_adv = 'Y' OR approved_by = ? OR verified_by = ? OR cashier = ? OR db_cash_receipts.emp_id = ? ORDER BY `id` DESC;";
    }else  {
        query = "SELECT  \
        db_cash_receipts.*, \
        locations.location_name, \
        companies.company_name, \
        companies.code AS company_code_name, \
        record.name AS record_emp_name, \
        appr.name AS appr_emp_name, \
        req.name AS requested_emp_name \
        FROM `db_cash_receipts`  \
        LEFT OUTER JOIN employees record ON db_cash_receipts.verified_by = record.emp_id \
        LEFT OUTER JOIN employees appr ON db_cash_receipts.approved_by = appr.emp_id \
        LEFT OUTER JOIN employees req ON db_cash_receipts.emp_id = req.emp_id \
        LEFT OUTER JOIN locations ON db_cash_receipts.location = locations.location_code \
        LEFT OUTER JOIN companies ON db_cash_receipts.company = companies.company_code \
        " + ( accessKey === 1 ? 
            (cashViewer === 1 ? 
                "WHERE db_cash_receipts.shp_line_adv = 'N' OR approved_by = ? OR verified_by = ? OR cashier = ? OR db_cash_receipts.emp_id = ? " 
                : 
                ""
            ) 
            : cashier === 1 ? 
                (
                "WHERE db_cash_receipts.location = " + location_code + " AND (db_cash_receipts.status = 'approved' OR db_cash_receipts.status = 'issued')"
                )    
                :   
                "WHERE approved_by = ? OR verified_by = ? OR cashier = ? OR db_cash_receipts.emp_id = ?" 
                ) + " ORDER BY `id` DESC;";
    }
    console.log(query);

    // PREVIOUS QUERY
    // "SELECT  \
    // db_cash_receipts.*, \
    // locations.location_name, \
    // companies.company_name, \
    // companies.code AS company_code_name, \
    // record.name AS record_emp_name, \
    // appr.name AS appr_emp_name, \
    // req.name AS requested_emp_name \
    // FROM `db_cash_receipts`  \
    // LEFT OUTER JOIN employees record ON db_cash_receipts.verified_by = record.emp_id \
    // LEFT OUTER JOIN employees appr ON db_cash_receipts.approved_by = appr.emp_id \
    // LEFT OUTER JOIN employees req ON db_cash_receipts.emp_id = req.emp_id \
    // LEFT OUTER JOIN locations ON db_cash_receipts.location = locations.location_code \
    // LEFT OUTER JOIN companies ON db_cash_receipts.company = companies.company_code \
    // " + ( accessKey === 1 ? (cashViewer ? "WHERE db_cash_receipts.shp_line_adv = 'N' OR approved_by = ? OR verified_by = ? OR cashier = ? OR db_cash_receipts.emp_id = ?" : shipViewer ? "WHERE db_cash_receipts.shp_line_adv = 'Y' OR approved_by = ? OR verified_by = ? OR cashier = ? OR db_cash_receipts.emp_id = ?" : "") : cashier ? ("WHERE db_cash_receipts.location = " + location_code + " AND (db_cash_receipts.status = 'approved' OR db_cash_receipts.status = 'issued')") : "WHERE approved_by = ? OR verified_by = ? OR cashier = ? OR db_cash_receipts.emp_id = ?" ) + " ORDER BY `id` DESC;",
    db.query(
        query,
        [ emp_id, emp_id, emp_id, emp_id ],
        ( err, rslt ) => {
            if( err )
            {
                console.log(err);
                res.status(500).send(err);
                res.end();
            }else 
            {
                res.send( rslt );
                res.end();
            }

        }
    )

} );

router.post('/cash/load/previous', ( req, res ) => {

    const { emp_id } = req.body;

    db.query(
        "SELECT  \
        db_cash_receipts.*, \
        locations.location_name, \
        companies.company_name, \
        companies.code AS company_code_name, \
        record.name AS record_emp_name, \
        appr.name AS appr_emp_name, \
        req.name AS requested_emp_name \
        FROM `db_cash_receipts`  \
        LEFT OUTER JOIN employees record ON db_cash_receipts.verified_by = record.emp_id \
        LEFT OUTER JOIN employees appr ON db_cash_receipts.approved_by = appr.emp_id \
        LEFT OUTER JOIN employees req ON db_cash_receipts.emp_id = req.emp_id \
        LEFT OUTER JOIN locations ON db_cash_receipts.location = locations.location_code \
        LEFT OUTER JOIN companies ON db_cash_receipts.company = companies.company_code \
        WHERE approved_by = ? OR verified_by = ? OR cashier = ? OR db_cash_receipts.emp_id = ? ORDER BY `id` DESC;",
        [ emp_id, emp_id, emp_id, emp_id ],
        ( err, rslt ) => {

            if( err )
            {
                console.log(err);
                res.status(500).send(err);
                res.end();
            }else 
            {
                res.send( rslt );
                res.end();
            }

        }
    )

} );

router.post('/cash/load/emp/requests', ( req, res ) => {

    const { emp_id } = req.body;

    db.query(
        "SELECT  \
        db_cash_receipts.*, \
        locations.location_name, \
        companies.code, \
        record.name AS record_emp_name, \
        appr.name AS appr_emp_name, \
        req.name AS requested_emp_name \
        FROM `db_cash_receipts`  \
        LEFT OUTER JOIN employees record ON db_cash_receipts.verified_by = record.emp_id \
        LEFT OUTER JOIN employees appr ON db_cash_receipts.approved_by = appr.emp_id \
        LEFT OUTER JOIN employees req ON db_cash_receipts.emp_id = req.emp_id \
        LEFT OUTER JOIN locations ON db_cash_receipts.location = locations.location_code \
        LEFT OUTER JOIN companies ON db_cash_receipts.company = companies.company_code \
        WHERE db_cash_receipts.emp_id = ? ORDER BY `id` DESC;",
        [ emp_id ],
        ( err, rslt ) => {

            if( err )
            {
                console.log(err);
                res.status(500).send(err);
                res.end();
            }else 
            {
                res.send( rslt );
                res.end();
            }

        }
    )

} );

router.post('/cash/load/request/details', ( req, res ) => {

    const { request_id } = req.body;

    db.query(
        "SELECT  \
        db_cash_receipts.*, \
        locations.location_name, \
        companies.company_name, \
        companies.code AS company_code_name, \
        record.name AS record_emp_name, \
        appr.name AS appr_emp_name, \
        cashier.name AS cashier_emp_name, \
        req.name AS requested_emp_name, \
        designations.designation_name \
        FROM `db_cash_receipts`  \
        LEFT OUTER JOIN employees record ON db_cash_receipts.verified_by = record.emp_id \
        LEFT OUTER JOIN employees appr ON db_cash_receipts.approved_by = appr.emp_id \
        LEFT OUTER JOIN employees req ON db_cash_receipts.emp_id = req.emp_id \
        LEFT OUTER JOIN designations ON req.designation_code = designations.designation_code \
        LEFT OUTER JOIN employees cashier ON db_cash_receipts.cashier = cashier.emp_id \
        LEFT OUTER JOIN locations ON db_cash_receipts.location = locations.location_code \
        LEFT OUTER JOIN companies ON db_cash_receipts.company = companies.company_code \
        WHERE id = ?;",
        [ request_id ],
        ( err, rslt ) => {

            if( err )
            {
                console.log(err);
                res.status(500).send(err);
                res.end();
            }else 
            {
                res.send( rslt );
                res.end();
            }

        }
    )

} );

router.post('/cash/load/request/comments', ( req, res ) => {

    const { request_id } = req.body;

    db.query(
        "SELECT tbl_cash_receipt_comments.*, employees.name, designations.designation_name, emp_app_profile.emp_image FROM `tbl_cash_receipt_comments` \
        LEFT OUTER JOIN employees ON tbl_cash_receipt_comments.comment_by = employees.emp_id \
        LEFT OUTER JOIN emp_app_profile ON tbl_cash_receipt_comments.comment_by = emp_app_profile.emp_id \
        LEFT OUTER JOIN designations ON employees.designation_code = designations.designation_code \
        WHERE request_id = ? ORDER BY comment_id DESC;",
        [ request_id ],
        ( err, rslt ) => {

            if( err )
            {
                console.log(err);
                res.status(500).send(err);
                res.end();
            }else 
            {
                res.send( rslt );
                res.end();
            }

        }
    )

} );

router.post('/cash/load/request/new_comment', ( req, res ) => {

    const { serial_no, name, emp_id, employee, cashier, verified_by, approved_by, request_id, body } = req.body;

    db.query(
        "INSERT INTO `tbl_cash_receipt_comments`(`request_id`, `comment_by`, `comment_date`, `comment_time`, `body`) VALUES (?,?,?,?,?);",
        [ request_id, emp_id, new Date(), new Date().toTimeString(), body ],
        ( err ) => {

            if( err )
            {
                console.log(err);
                res.status(500).send(err);
                res.end();
            }else 
            {
                const query = (employee !== "N" ? "SELECT name, cell FROM employees WHERE emp_id = ?;" : "") + (cashier !== "N" ? "SELECT name, cell FROM employees WHERE emp_id = ?;" : "") + (verified_by !== "N" ? "SELECT name, cell FROM employees WHERE emp_id = ?;" : "") + (approved_by !== "N" ? "SELECT name, cell FROM employees WHERE emp_id = ?;" : "");
                if ( query !== '' )
                {
                    db.query(
                        query,
                        [ employee, cashier, verified_by, approved_by ],
                        ( err, result ) => {
                            if( err )
                            {
                                console.log( err );
                                res.send( err );
                                res.end();
                            }else
                            {
                                for ( let x = 0; x < result.length; x++ )
                                {
                                    if ( result[x][0] ) {
                                        const link = "/cash/request/" + request_id;
                                        const message = `Hi ${result[x][0].name}\n\n${name} has added a new comment on an advance cash request with id#${serial_no}.`;
                                        administrativeNotifications( link, owner, message );
                                        SendWhatsappNotification( null, null, message, result[x][0].cell );
                                    }
                                }
                            }
                        }
                    );
                }
                res.send('success');
                res.end();
            }

        }
    )

} );

router.get('/cash/load/request/cashiers', ( req, res ) => {
    db.query(
        "SELECT emp_id, name, location_code FROM `employees` WHERE emp_status = 'Active' AND designation_code = 66 OR designation_code = 97;",
        ( err, rslt ) => {
            if( err )
            {
                console.log(err);
                res.status(500).send(err);
                res.end();
            }else 
            {
                res.send( rslt );
                res.end();
            }
        }
    )
} );

router.post('/cash/load/request/approve', ( req, res ) => {

    const { request_id, remarks, employee, amount, cashiers, emp_id } = req.body;
    const d = new Date();
    const cashiersList = JSON.parse(cashiers);

    db.query(
        "UPDATE db_cash_receipts SET status = ?, approved_date = ?, approved_time = ?, hod_remarks = ? WHERE id = ? AND approved_by;",
        [ 'approved', d, d.toTimeString(), remarks, request_id, emp_id ],
        ( err ) => {

            if( err )
            {
                console.log('err');
                res.status(500).send(err);
                res.end();
            }else 
            {
                const link = '/cash/request/' + request_id;
                res.send({ message: 'success', link: link, owner: owner, date: new Date().toDateString(), time: moment(new Date().toTimeString(),'h:mm:ss a').format('hh:mm A') });
                res.end();
                let query = "SELECT name, cell FROM employees WHERE emp_id = ?; SELECT name, cell FROM employees WHERE emp_id = ?;";
                let arr = [ emp_id, employee ];
                for ( let x = 0; x < cashiersList.length; x++ )
                {
                    query = query.concat("SELECT name, cell FROM employees WHERE emp_id = ?;");
                    arr.push(cashiersList[x].emp_id);
                }
                db.query(
                    query, arr,
                    ( err, result ) => {
                        if( err )
                        {
                            console.log( err );
                            res.send( err );
                            res.end();
                        }else
                        {
                            const message = result[0][0].name + " has approved an advance cash for PKR (" + amount.toLocaleString('en') + ")";
                            administrativeNotifications( link, owner, message );
                            SendWhatsappNotification( null, null, "Hi " + result[0][0].name, " Your approved advance cash request has been forwarded to" + result[1][0].name + "Thank you for your prompt action.", result[0][0].cell );
                            SendWhatsappNotification( null, null, "Hi " + result[1][0].name, " Congratulations your advance cash request for PKR " + amount.toLocaleString('en') + "has been approved by " + result[0][0].name + ". You are now eligible to collect the granted amount. Please proceed with the collection process. If you have any questions or need assistance, feel free to reach out to us", result[1][0].cell );
                            for ( let x = 0; x < cashiersList.length; x++ )
                            {
                                let i = x + 1;
                                SendWhatsappNotification( null, null, "Hi " + result[1+i][0].name, result[0][0].name + " has approved and forwarded you an advance cash request on portal for PKR " + amount.toLocaleString('en') + ", kindly issue the required amount to " + result[1][0].name + " If you have any questions, please let us know. Thank you. " , result[1+i][0].cell );
                            }
                        }
                    }
                );
            }

        }
    )

} );

router.post('/cash/load/request/verify', ( req, res ) => {

    const { request_id, remarks, employee, amount, submit_to, emp_id } = req.body;
    const d = new Date();

    db.query(
        "UPDATE db_cash_receipts SET status = ?, verified_by = ?, verified_date = ?, verified_time = ?, verification_remarks = ?, approved_by = ? WHERE id = ?;",
        [ 'waiting for approval', emp_id, d, d.toTimeString(), remarks, submit_to, request_id ],
        ( err ) => {

            if( err )
            {
                console.log('err');
                res.status(500).send(err);
                res.end();
            }else 
            {
                const link = '/cash/request/' + request_id;
                res.send({ message: 'success', link: link, owner: owner, date: new Date().toDateString(), time: moment(new Date().toTimeString(),'h:mm:ss a').format('hh:mm A') });
                res.end();
                db.query(
                    "SELECT name, cell FROM employees WHERE emp_id = ?;" + 
                    "SELECT name, cell FROM employees WHERE emp_id = ?;" + 
                    "SELECT name, cell FROM employees WHERE emp_id = ?;",
                    [ emp_id, submit_to, employee ],
                    ( err, result ) => {
                        if( err )
                        {
                            console.log( err );
                            res.send( err );
                            res.end();
                        }else
                        {
                            const message = result[0][0].name + " has verified an advance cash for PKR (" + amount.toLocaleString('en') + ")";
                            administrativeNotifications( link, owner, message );
                            SendWhatsappNotification( null, null, "Hi " + result[0][0].name, "You have successfully verified an advance cash request. The request has been forwarded to " + result[1][0].name + "for further processing. Thank you for your prompt action. ", result[0][0].cell );
                            SendWhatsappNotification( null, null, "Hi " + result[1][0].name, "We are pleased to inform you that " + result[0][0].name + " has verified and forwarded you an advance cash request on portal for PKR " + amount.toLocaleString('en') + ", kindly issue the requested amount to " + result[2][0].name + " . Thank you. ", result[1][0].cell );
                            SendWhatsappNotification( null, null, "Hi " + result[2][0].name, "We are pleased to inform you that " + result[0][0].name + " has verified your advance cash request for PKR " + amount.toLocaleString('en') + ". We are currently processing it and will notify you once it's approved. Your patience is appreciated.", result[2][0].cell );
                        }
                    }
                );
            }

        }
    )

} );

router.post('/cash/load/request/reject', ( req, res ) => {

    const { request_id, remarks, amount, employee, emp_id } = req.body;
    const d = new Date();

    db.query(
        "UPDATE db_cash_receipts SET status = ?, approved_date = ?, approved_time = ?, hod_remarks = ? WHERE id = ? AND approved_by = ?;",
        [ 'rejected', d, d.toTimeString(), remarks, request_id, emp_id ],
        ( err ) => {

            if( err )
            {
                console.log('err');
                res.status(500).send(err);
                res.end();
            }else 
            {
                const link = '/cash/request/' + request_id;
                res.send({ message: 'success', link: link, owner: owner, date: new Date().toDateString(), time: moment(new Date().toTimeString(),'h:mm:ss a').format('hh:mm A') });
                res.end();
                db.query(
                    "SELECT name, cell FROM employees WHERE emp_id = ?;" + 
                    "SELECT name, cell FROM employees WHERE emp_id = ?;",
                    [ emp_id, employee ],
                    ( err, result ) => {
                        if( err )
                        {
                            console.log( err );
                            res.send( err );
                            res.end();
                        }else
                        {
                            const message = result[0][0].name + " has rejected an advance cash for PKR (" + amount.toLocaleString('en') + ")";
                            administrativeNotifications( link, owner, message );
                            SendWhatsappNotification( null, null, "Hi " + result[0][0].name, "We regret to inform you that the advance cash request, Requested by " + result[1][0].name + ". We have duly informed " + result[1][0].name + " regarding this decision. Thank you", result[0][0].cell );
                            SendWhatsappNotification( null, null, "Hi " + result[1][0].name, "We regret to inform you that your advance cash request has been rejected by " + result[0][0].name + " with the following remarks '" + remarks + "'" + " If you have any concerns or wish to discuss this further, please feel free to reach out to us.", result[1][0].cell );
                        }
                    }
                );
            }

        }
    )

} );

router.post('/cash/load/request/vreject', ( req, res ) => {

    const { request_id, remarks, amount, employee, emp_id } = req.body;
    const d = new Date();

    db.query(
        "UPDATE db_cash_receipts SET status = ?, verified_by = ?, verified_date = ?, verified_time = ?, verification_remarks = ? WHERE id = ?;",
        [ 'rejected', emp_id, d, d.toTimeString(), remarks, request_id ],
        ( err ) => {

            if( err )
            {
                console.log('err');
                res.status(500).send(err);
                res.end();
            }else 
            {
                const link = '/cash/request/' + request_id;
                res.send({ message: 'success', link: link, owner: owner, date: new Date().toDateString(), time: moment(new Date().toTimeString(),'h:mm:ss a').format('hh:mm A') });
                res.end();
                db.query(
                    "SELECT name, cell FROM employees WHERE emp_id = ?;" + 
                    "SELECT name, cell FROM employees WHERE emp_id = ?;",
                    [ emp_id, employee ],
                    ( err, result ) => {
                        if( err )
                        {
                            console.log( err );
                            res.send( err );
                            res.end();
                        }else
                        {
                            const message = result[0][0].name + " has rejected an advance cash for PKR (" + amount.toLocaleString('en') + ")";
                            administrativeNotifications( link, owner, message );
                            SendWhatsappNotification( null, null, "Hi " + result[0][0].name, "This Messsage notifies you that you have rejected the advance cash request, Requested by" + result[1][0].name + ". We have duly informed " + result[1][0].name + " regarding this decision. Thank you", result[0][0].cell );
                            SendWhatsappNotification( null, null, "Hi " + result[1][0].name, "We regret to inform you that your advance cash request has been rejected by " + result[0][0].name + " with the following remarks '" + remarks + "'" + " If you have any concerns or wish to discuss this further, please feel free to reach out to us.", result[1][0].cell );
                        }
                    }
                );
            }

        }
    )

} );

router.post('/cash/load/request/cancel', ( req, res ) => {

    const { request_id, remarks, amount, employee, appr_by, emp_id } = req.body;
    const d = new Date();

    // "UPDATE db_cash_receipts SET approved_by = ?, status = ?, approved_date = ?, approved_time = ?, hod_remarks = ? WHERE id = ? AND verified_by = ?;",
    // [ emp_id, 'cancelled', d, d.toTimeString(), remarks, request_id, emp_id ],
    db.query(
        "UPDATE db_cash_receipts SET cancelled_by = ?, status = ?, cancelled_at = ?, cancellation_remarks = ? WHERE id = ? AND emp_id = ?;",
        [ emp_id, 'cancelled', d, remarks, request_id, emp_id ],
        ( err ) => {

            if( err )
            {
                console.log('err');
                res.status(500).send(err);
                res.end();
            }else 
            {
                const link = '/cash/request/' + request_id;
                res.send({ message: 'success', link: link, owner: owner, date: new Date().toDateString(), time: moment(new Date().toTimeString(),'h:mm:ss a').format('hh:mm A') });
                res.end();
                db.query(
                    "SELECT name, cell FROM employees WHERE emp_id = ?;" + 
                    "SELECT name, cell FROM employees WHERE emp_id = ?;" + 
                    "SELECT name, cell FROM employees WHERE emp_id = ?;",
                    [ emp_id, appr_by ],
                    ( err, result ) => {
                        if( err )
                        {
                            console.log( err );
                            res.send( err );
                            res.end();
                        }else
                        {
                            const message = result[0][0].name + " has cancelled an advance cash for PKR (" + amount.toLocaleString('en') + ")";
                            administrativeNotifications( link, owner, message );
                            SendWhatsappNotification( null, null, "Hi " + result[0][0].name, "The advance cash request has been successfully canceled", result[0][0].cell );
                            SendWhatsappNotification( null, null, "Hi " + result[1][0].name, "The advance cash request has been successfully canceled", result[1][0].cell );
                        }
                    }
                );
            }

        }
    )

} );

router.post('/cash/load/thumbs', ( req, res ) => {

    const { cashier } = req.body;
    let fingerpos = ["RIGHT_THUMB", "RIGHT_INDEX", "RIGHT_MIDDLE", "RIGHT_RING", "RIGHT_LITTLE", "LEFT_THUMB", "LEFT_INDEX", "LEFT_MIDDLE", "LEFT_RING", "LEFT_LITTLE"];
    const cashierThumbs = [];
    for ( let x = 0; x < fingerpos.length; x++ )
    {
        const img = 'client/images/thumbs/' + cashier + '/' + fingerpos[x] + "_" + cashier + ".txt";
        var imageAsBase64 = fs.readFileSync(img, 'utf8');
        cashierThumbs.push(imageAsBase64);
    }
    res.send(cashierThumbs);
    res.end();

} );

router.post('/cash/validation', ( req, res ) => {
    const { template1, template2, receiving_person, receiving_person_cnic, receiving_person_contact, request_id, amount, other, passcode, employee, emp_id, signature } = req.body;
    const d = new Date();
    let other_person = 0;
    if ( other === 'yes' )
    {
        other_person = 1;
    }
    const sendNote = ( link, owner ) => {
        db.query(
            "SELECT name, cell FROM employees WHERE emp_id = ?;" + 
            "SELECT name, cell FROM employees WHERE emp_id = ?;",
            [ emp_id, employee ],
            ( err, result ) => {
                if( err )
                {
                    console.log( err );
                    res.send( err );
                    res.end();
                }else
                {
                    const message = result[1][0].name + " has collected amount PKR (" + amount.toLocaleString('en') + ") from " + result[0][0].name;
                    administrativeNotifications( link, owner, message );
                    SendWhatsappNotification( null, null, "Hi " + result[0][0].name, "We would like to inform you that " + result[1][0].name + " has collected amount PKR " + amount.toLocaleString('en') + " from you. If you have any questions or require any additional information, please feel free to reach out to us.", result[0][0].cell );
                    SendWhatsappNotification( null, null, "Hi " + result[1][0].name, "Congratulations, You have collected amount PKR " + amount.toLocaleString('en') + " from " + result[0][0].name, result[1][0].cell );
                }
            }
        );
    }
    db.query(
        "SELECT emp_password FROM `emp_app_profile` WHERE emp_id = ?;",
        [ employee ],
        ( err, rslt ) => {
            if( err )
            {
                console.log(err);
                res.status(500).send(err);
                res.end();
            }else 
            {
                if ( other_person === 1 || encryptor.decrypt(rslt[0].emp_password) === passcode )
                {
                    db.getConnection(
                        ( err, connection ) => {
                            connection.beginTransaction(
                                ( err ) => {
                                    if ( err )
                                    {
                                        connection.rollback(() => {console.log(err);connection.release();});
                                        res.send('err');
                                        res.end();
                                    }else
                                    {
                                        let fingerprint1Name = "cashier.bmp";
                                        let fingerprint2Name = "employee.bmp";
                                        fs.mkdir('assets/portal/assets/AC/' + request_id + '/thumbs/', { recursive: true }, (err) => {
                                            if ( err )
                                            {
                                                console.log(err)
                                                res.send('err');
                                                res.end();
                                            }else
                                            {
                                                if ( template1 !== 'null' )
                                                {
                                                    fs.writeFile('assets/portal/assets/AC/' + request_id + '/thumbs/' + fingerprint1Name, template1, 'base64', function(err) {
                                                        if ( err )
                                                        {
                                                            connection.rollback(() => {console.log(err);connection.release();});
                                                            res.send('err');
                                                            res.end();
                                                        }
                                                    });
                                                }
                                                if ( template2 !== 'null' )
                                                {
                                                    fs.writeFile('assets/portal/assets/AC/' + request_id + '/thumbs/' + fingerprint2Name, template2, 'base64', function(err) {
                                                        if ( err )
                                                        {
                                                            connection.rollback(() => {console.log(err);connection.release();});
                                                            res.send('err');
                                                            res.end();
                                                        }
                                                    });
                                                }
                                            }
                                        });
                                        if ( other_person === 1 )
                                        {
                                            const { CNICFront, CNICBack } = req.files;
                                            fs.mkdir('assets/portal/assets/AC/' + request_id + '/',
                                                { recursive: true },
                                                (err) => {
                                                    if (err) {
                                                        connection.rollback(() => {console.log(err);connection.release();});
                                                        res.status(500).send(err);
                                                        res.end();
                                                    }
                                                    else {
                                                        CNICFront.mv('assets/portal/assets/AC/' + request_id + '/front.png', (err) => {if (err){connection.rollback(() => {console.log(err);connection.release();});res.status(500).send(err);res.end();}})
                                                        CNICBack.mv('assets/portal/assets/AC/' + request_id + '/back.png', (err) => {if (err){connection.rollback(() => {console.log(err);connection.release();});res.status(500).send(err);res.end();}})
                                                        fs.writeFile('assets/portal/assets/AC/' + request_id + '/signature.png', signature.split('data:image/png;base64,').pop(), 'base64', function(err) {
                                                            console.log(err);
                                                        });
                                                    }
                                                }
                                            )
                                        }
                                        connection.query(
                                            "UPDATE `db_cash_balance` SET balance = balance + ?, last_updated = ? WHERE emp_id = ?;" + 
                                            "UPDATE db_cash_receipts SET receival_date = ?, receival_time = ?, status = ?, other = ?, received_person_name = ?, received_person_contact = ?, received_person_cnic = ?, cnic_front = ?, cnic_back = ?, signature = ?, emp_finger_print = ?, cashier = ? WHERE id = ? AND status = 'approved';",
                                            [ parseFloat(amount), d, employee, d, d.toTimeString(), 'issued', other_person, receiving_person == 'null' ? null : receiving_person, receiving_person_contact == 'null' ? null : receiving_person_contact, receiving_person_cnic == 'null' ? null : receiving_person_cnic, 'front.png', 'back.png', 'signature.png', fingerprint2Name, emp_id, request_id ],
                                            ( err, rslt ) => {
                                                if( err )
                                                {
                                                    connection.rollback(() => {console.log(err);connection.release();});
                                                    res.send('err');
                                                    res.end();
                                                }else 
                                                {
                                                    connection.commit((err) => {
                                                        if ( err ) {
                                                            connection.rollback(() => {console.log(err);connection.release();});
                                                            res.send('err');
                                                            res.end();
                                                        }else
                                                        {
                                                            const link = '/cash/request/' + request_id.toString();
                                                            sendNote(link, owner);
                                                            connection.release();
                                                            res.send({ message: 'success', link: link, owner: owner, date: new Date().toDateString(), time: moment(new Date().toTimeString(),'h:mm:ss a').format('hh:mm A') });
                                                            res.end();
                                                        }
                                                    });
                                                }
                                                
                                            }
                                        );
                                    }
                                }
                            )
                        }
                    )
                }else
                {
                    res.send('not matched');
                    res.end();
                }
            }
        }
    )
} );

router.post('/cash/request/clearance', ( req, res ) => {
    const { request_id, after_amount, verified_by, employee, amount, emp_id } = req.body;
    const d = new Date();
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
                            "UPDATE `db_cash_balance` SET balance = balance - ?, last_updated = ? WHERE emp_id = ?;" + 
                            "UPDATE db_cash_receipts SET clearance_date = ?, clearance_time = ?, status = ?, after_amount = ? WHERE id = ? AND cashier = ?;" + 
                            "SELECT balance FROM db_cash_balance WHERE emp_id = ?;",
                            [ parseFloat(amount), d, employee, d, d.toTimeString(), 'cleared', after_amount, request_id, emp_id, employee ],
                            ( err, rslt ) => {
                                if( err )
                                {
                                    connection.rollback(() => {console.log(err);connection.release();});
                                    res.send('err');
                                    res.end();
                                }else 
                                {
                                    connection.commit((err) => {
                                        if ( err ) {
                                            connection.rollback(() => {console.log(err);connection.release();});
                                            res.send('err');
                                            res.end();
                                        }else
                                        {
                                            const link = '/cash/request/' + request_id;
                                            db.query(
                                                "SELECT name, cell FROM employees WHERE emp_id = ?;" + 
                                                "SELECT name, cell FROM employees WHERE emp_id = ?;" + 
                                                "SELECT name, cell FROM employees WHERE emp_id = ?;",
                                                [ emp_id, verified_by, employee ],
                                                ( err, result ) => {
                                                    if( err )
                                                    {
                                                        console.log( err );
                                                        res.send( err );
                                                        res.end();
                                                    }else
                                                    {
                                                        const message = result[2][0].name + " has cleared his advance cash for PKR (" + amount.toLocaleString('en') + ")";
                                                        administrativeNotifications( link, owner, message );
                                                        SendWhatsappNotification( null, null, "Hi " + result[0][0].name, "We are pleased to inform you that the advance cash request for PKR " + amount.toLocaleString('en') + " from the account of " + result[2][0].name + "has been successfully cleared. If you have any further queries or need assistance, feel free to reach out to us. ", result[0][0].cell );
                                                        SendWhatsappNotification( null, null, "Hi " + result[1][0].name, "We are pleased to inform you that the advance cash request for PKR " + amount.toLocaleString('en') + " has been cleared by " + result[2][0].name + "If you have any further queries or need assistance, feel free to reach out to us. ", result[1][0].cell );
                                                        SendWhatsappNotification( null, null, "Hi " + result[2][0].name, "We are pleased to inform you that the advance cash request for PKR " + amount.toLocaleString('en') + " has been cleared by " + result[0][0].name + ", The remaining balance is PKR " + rslt[2][0].balance.toLocaleString('en') + "If you have any further queries or need assistance, feel free to reach out to us.", result[2][0].cell );
                                                    }
                                                }
                                            );
                                            connection.release();
                                            res.send({ message: 'success', link: link, owner: owner, date: new Date().toDateString(), time: moment(new Date().toTimeString(),'h:mm:ss a').format('hh:mm A') });
                                            res.end();
                                        }
                                    });
                                }
                                
                            }
                        );
                    }
                }
            )
        }
    )
} );

router.post('/cash/advance/salary', ( req, res ) => {

    const { emp_id, reason, amount, request_to, company_code, location_code, amountInWords } = req.body;
    const d = new Date();

    function sendNote(link, owner)
    {
        db.query(
            "SELECT name, cell FROM employees WHERE emp_id = ?;" + 
            "SELECT name, cell FROM employees WHERE emp_id = ?;",
            [ emp_id, request_to ],
            ( err, result ) => {
                if( err )
                {
                    console.log( err );
                    res.send( err );
                    res.end();
                }else
                {
                    const message = result[0][0].name + " has requested for advance salary for PKR (" + amount.toLocaleString('en') + ")";
                    administrativeNotifications( link, owner, message );
                    SendWhatsappNotification( null, null, "Hi " + result[0][0].name, "Thank you for applying for an Advance Salary option. Your advance Salary request is under review. Thank you for your patience.", result[0][0].cell );
                    SendWhatsappNotification( null, null, "Hi " + result[1][0].name, result[0][0].name + " has requested for an advance salary for PKR " + amount.toLocaleString('en') + ". Your review is appreciated. Thank You.", result[1][0].cell );
                }
            }
        );
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
                            "INSERT INTO `tbl_advance_salary`(`submitted_by`, `submitted_date`, `submitted_time`, `amount`, `amount_in_words`, `company`, `location`, `reason`, `approved_by`) VALUES (?,?,?,?,?,?,?,?,?);",
                            [ emp_id, d, d.toTimeString(), amount, amountInWords, company_code, location_code, reason, request_to ],
                            ( err, result ) => {
                                if( err )
                                {
                                    connection.rollback(() => {console.log(err);connection.release();});
                                    res.send('err');
                                    res.end();
                                }else 
                                {
                                    connection.commit((err) => {
                                        if ( err ) {
                                            connection.rollback(() => {console.log(err);connection.release();});
                                            res.send('err');
                                            res.end();
                                        }else
                                        {
                                            const link = '/cash/advance/salary/' + result.insertId.toString();
                                            sendNote(link, owner);
                                            connection.release();
                                            res.send({ message: 'success', link: link, owner: owner, date: new Date().toDateString(), time: moment(new Date().toTimeString(),'h:mm:ss a').format('hh:mm A') });
                                            res.end();
                                        }
                                    });
                                }
                            }
                        );
                    }
                }
            )
        }
    )
} );

router.post('/cash/advance/salary/requests', ( req, res ) => {

    const { emp_id, accessKey } = req.body;

    db.query(
        "SELECT  \
        tbl_advance_salary.*, \
        locations.location_name, \
        companies.company_name, \
        submit.name AS requested_emp_name, \
        approve.name AS approved_emp_name \
        FROM `tbl_advance_salary`  \
        LEFT OUTER JOIN employees submit ON tbl_advance_salary.submitted_by = submit.emp_id \
        LEFT OUTER JOIN employees approve ON tbl_advance_salary.approved_by = approve.emp_id \
        LEFT OUTER JOIN locations ON tbl_advance_salary.location = locations.location_code \
        LEFT OUTER JOIN companies ON tbl_advance_salary.company = companies.company_code \
        " + ( accessKey === 1 ? "" : "WHERE cashier = ? OR approved_by = ? OR submitted_by = ?" ) + " ORDER BY `id` DESC;",
        [ emp_id, emp_id, emp_id ],
        ( err, rslt ) => {
            
            if( err )
            {
                console.log(err);
                res.status(500).send(err);
                res.end();
            }else 
            {
                res.send( rslt );
                res.end();
            }

        }
    )

} );

router.post('/cash/advance/salary/request/details', ( req, res ) => {

    const { request_id } = req.body;

    db.query(
        "SELECT  \
        tbl_advance_salary.*, \
        locations.location_name, \
        companies.company_name, \
        submit.name AS requested_emp_name, \
        designations.designation_name, \
        cashier.name AS cashier_emp_name, \
        approve.name AS approved_emp_name \
        FROM `tbl_advance_salary`  \
        LEFT OUTER JOIN employees submit ON tbl_advance_salary.submitted_by = submit.emp_id \
        LEFT OUTER JOIN designations ON submit.designation_code = designations.designation_code \
        LEFT OUTER JOIN employees cashier ON tbl_advance_salary.cashier = cashier.emp_id \
        LEFT OUTER JOIN employees approve ON tbl_advance_salary.approved_by = approve.emp_id \
        LEFT OUTER JOIN locations ON tbl_advance_salary.location = locations.location_code \
        LEFT OUTER JOIN companies ON tbl_advance_salary.company = companies.company_code \
        WHERE id = ?;",
        [ request_id ],
        ( err, rslt ) => {
            
            if( err )
            {
                console.log(err);
                res.status(500).send(err);
                res.end();
            }else 
            {
                res.send( rslt );
                res.end();
            }

        }
    )

} );

router.post('/cash/advance/salary/cancel', ( req, res ) => {

    const { request_id, remarks, amount, employee, appr_by } = req.body;
    const d = new Date();

    db.query(
        "UPDATE tbl_advance_salary SET approved_by = ?, status = ?, approved_date = ?, approved_time = ?, remarks = ? WHERE id = ? AND submitted_by = ?;",
        [ employee, 'cancelled', d, d.toTimeString(), remarks, request_id, employee ],
        ( err ) => {

            if( err )
            {
                console.log('err');
                res.status(500).send(err);
                res.end();
            }else 
            {
                const link = '/cash/advance/salary/request/' + request_id;
                res.send({ message: 'success', link: link, owner: owner, date: new Date().toDateString(), time: moment(new Date().toTimeString(),'h:mm:ss a').format('hh:mm A') });
                res.end();
                db.query(
                    "SELECT name, cell FROM employees WHERE emp_id = ?;" + 
                    "SELECT name, cell FROM employees WHERE emp_id = ?;",
                    [ employee, appr_by ],
                    ( err, result ) => {
                        if( err )
                        {
                            console.log( err );
                            res.send( err );
                            res.end();
                        }else
                        {
                            const message = result[0][0].name + " has cancelled an advance salary for PKR (" + amount.toLocaleString('en') + ")";
                            administrativeNotifications( link, owner, message );
                            SendWhatsappNotification( null, null, "Hi " + result[0][0].name, "Your advance salary request has been successfully cancelled", result[0][0].cell );
                            SendWhatsappNotification( null, null, "Hi " + result[1][0].name, result[0][0].name + " has cancelled his advance salary request with reason '" + remarks + "'", result[1][0].cell );
                        }
                    }
                );
            }

        }
    )

} );

router.post('/cash/advance/salary/reject', ( req, res ) => {

    const { request_id, remarks, amount, employee, emp_id } = req.body;
    const d = new Date();

    db.query(
        "UPDATE tbl_advance_salary SET status = ?, approved_date = ?, approved_time = ?, remarks = ? WHERE id = ? AND approved_by = ?;",
        [ 'rejected', d, d.toTimeString(), remarks, request_id, emp_id ],
        ( err ) => {

            if( err )
            {
                console.log('err');
                res.status(500).send(err);
                res.end();
            }else 
            {
                const link = '/cash/advance/salary/request/' + request_id;
                res.send({ message: 'success', link: link, owner: owner, date: new Date().toDateString(), time: moment(new Date().toTimeString(),'h:mm:ss a').format('hh:mm A') });
                res.end();
                db.query(
                    "SELECT name, cell FROM employees WHERE emp_id = ?;" + 
                    "SELECT name, cell FROM employees WHERE emp_id = ?;",
                    [ emp_id, employee ],
                    ( err, result ) => {
                        if( err )
                        {
                            console.log( err );
                            res.send( err );
                            res.end();
                        }else
                        {
                            const message = result[0][0].name + " has rejected an advance salary request for PKR (" + amount.toLocaleString('en') + ")";
                            administrativeNotifications( link, owner, message );
                            SendWhatsappNotification( null, null, "Hi " + result[0][0].name, "This Messsage notifies you that you have rejected the advance salary request, Requested by " + result[1][0].name + ". We have duly informed " + result[1][0].name + " regarding this decision. Thank you", result[0][0].cell );
                            SendWhatsappNotification( null, null, "Hi " + result[1][0].name, "We regret to inform you that your advance salary request has been rejected by " + result[0][0].name + " with the following remarks '" + remarks + "'" + " If you have any concerns or wish to discuss this further, please feel free to reach out to us.", result[1][0].cell );
                        }
                    }
                );
            }

        }
    )

} );

router.post('/cash/advance/salary/approve', ( req, res ) => {

    const { request_id, remarks, employee, amount, submit_to, emp_id } = req.body;
    const d = new Date();

    db.query(
        "UPDATE tbl_advance_salary SET status = ?, approved_date = ?, approved_time = ?, remarks = ?, cashier = ? WHERE id = ? AND approved_by = ?;",
        [ 'approved', d, d.toTimeString(), remarks, submit_to, request_id, emp_id ],
        ( err ) => {

            if( err )
            {
                console.log('err');
                res.status(500).send(err);
                res.end();
            }else 
            {
                const link = '/cash/advance/salary/request/' + request_id;
                res.send({ message: 'success', link: link, owner: owner, date: new Date().toDateString(), time: moment(new Date().toTimeString(),'h:mm:ss a').format('hh:mm A') });
                res.end();
                db.query(
                    "SELECT name, cell FROM employees WHERE emp_id = ?;" + 
                    "SELECT name, cell FROM employees WHERE emp_id = ?;" + 
                    "SELECT name, cell FROM employees WHERE emp_id = ?;",
                    [ emp_id, submit_to, employee ],
                    ( err, result ) => {
                        if( err )
                        {
                            console.log( err );
                            res.send( err );
                            res.end();
                        }else
                        {
                            const message = result[0][0].name + " has approved an advance salary request for PKR (" + amount.toLocaleString('en') + ")";
                            administrativeNotifications( link, owner, message );
                            SendWhatsappNotification( null, null, "Hi " + result[0][0].name, "This message is to notify that you have approved an advance salary request, Now the request has been successfully forwarded to " + result[1][0].name, result[0][0].cell );
                            SendWhatsappNotification( null, null, "Hi " + result[1][0].name, "We are pleased to inform you that " + result[0][0].name + " has approved and forwarded you an advance salary request on portal for PKR " + amount.toLocaleString('en') + ", kindly issue the requested amount to " + result[2][0].name + " . Thank you. ", result[1][0].cell );
                            SendWhatsappNotification( null, null, "Hi " + result[2][0].name, "We are pleased to inform you that " + result[0][0].name + " has approved your advance salary request for PKR " + amount.toLocaleString('en') + ". You can collect the granted amount from " + result[1][0].name +" . Thank you. ", result[2][0].cell );
                        }
                    }
                );
            }

        }
    )

} );

router.post('/cash/advance/salary/validation', ( req, res ) => {
    const { passcode, request_id, employee, signature, amount, emp_id } = req.body;
    const d = new Date();
    const sendNote = ( link, owner ) => {
        db.query(
            "SELECT name, cell FROM employees WHERE emp_id = ?;" + 
            "SELECT name, cell FROM employees WHERE emp_id = ?;",
            [ emp_id, employee ],
            ( err, result ) => {
                if( err )
                {
                    console.log( err );
                    res.send( err );
                    res.end();
                }else
                {
                    const message = result[1][0].name + " has collected amount PKR (" + amount.toLocaleString('en') + ") from " + result[0][0].name;
                    administrativeNotifications( link, owner, message );
                    SendWhatsappNotification( null, null, "Hi " + result[0][0].name, " The amount of PKR " + amount.toLocaleString('en') + " has been collected by " + result[1][0].name + " from you.", result[0][0].cell );
                    SendWhatsappNotification( null, null, "Hi " + result[1][0].name, " You have collected the amount of PKR " + amount.toLocaleString('en') + " from " + result[0][0].name, result[1][0].cell );
                }
            }
        );
    }
    db.query(
        "SELECT emp_password FROM `emp_app_profile` WHERE emp_id = ?;",
        [ employee ],
        ( err, rslt ) => {
            if( err )
            {
                console.log(err);
                res.status(500).send(err);
                res.end();
            }else 
            {
                if ( encryptor.decrypt(rslt[0].emp_password) === passcode )
                {
                    db.getConnection(
                        ( err, connection ) => {
                            connection.beginTransaction(
                                ( err ) => {
                                    if ( err )
                                    {
                                        connection.rollback(() => {console.log(err);connection.release();});
                                        res.send('err');
                                        res.end();
                                    }else
                                    {
                                        fs.mkdir('assets/portal/assets/AS/' + request_id + '/',
                                            { recursive: true },
                                            (err) => {
                                                if (err) {
                                                    connection.rollback(() => {console.log(err);connection.release();});
                                                    res.status(500).send(err);
                                                    res.end();
                                                }
                                                else {
                                                    fs.writeFile('assets/portal/assets/AS/' + request_id + '/signature.png', signature.split('data:image/png;base64,').pop(), 'base64', function(err) {
                                                        console.log(err);
                                                    });
                                                }
                                            }
                                        )
                                        connection.query( 
                                            "UPDATE tbl_advance_salary SET receiving_date = ?, receiving_time = ?, status = ?, emp_signatures = ? WHERE id = ? AND cashier = ? AND status = 'approved';",
                                            [ d, d.toTimeString(), 'issued', 'signature.png', request_id, emp_id ],
                                            ( err, rslt ) => {
                                                if( err )
                                                {
                                                    connection.rollback(() => {console.log(err);connection.release();});
                                                    res.send('err');
                                                    res.end();
                                                }else 
                                                {
                                                    connection.commit((err) => {
                                                        if ( err ) {
                                                            connection.rollback(() => {console.log(err);connection.release();});
                                                            res.send('err');
                                                            res.end();
                                                        }else
                                                        {
                                                            const link = '/cash/advance/salary/request/' + request_id.toString();
                                                            sendNote(link, owner);
                                                            connection.release();
                                                            res.send({ message: 'success', link: link, owner: owner, date: new Date().toDateString(), time: moment(new Date().toTimeString(),'h:mm:ss a').format('hh:mm A') });
                                                            res.end();
                                                        }
                                                    });
                                                }
                                                
                                            }
                                        );
                                    }
                                }
                            )
                        }
                    )
                }else
                {
                    res.send('not matched');
                    res.end();
                }
            }
        }
    )
} );

router.post('/cash/advance/salary/clearance', ( req, res ) => {
    const { request_id, employee, amount, approved_by, emp_id } = req.body;
    const d = new Date();
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
                            "UPDATE tbl_advance_salary SET clearance_date = ?, clearance_time = ?, status = ? WHERE id = ? AND approved_by = ?;",
                            [ d, d.toTimeString(), 'cleared', request_id, emp_id ],
                            ( err, rslt ) => {
                                if( err )
                                {
                                    connection.rollback(() => {console.log(err);connection.release();});
                                    res.send('err');
                                    res.end();
                                }else 
                                {
                                    connection.commit((err) => {
                                        if ( err ) {
                                            connection.rollback(() => {console.log(err);connection.release();});
                                            res.send('err');
                                            res.end();
                                        }else
                                        {
                                            const link = '/cash/advance/salary/request/' + request_id;
                                            db.query(
                                                "SELECT name, cell FROM employees WHERE emp_id = ?;" + 
                                                "SELECT name, cell FROM employees WHERE emp_id = ?;" + 
                                                "SELECT name, cell FROM employees WHERE emp_id = ?;",
                                                [ emp_id, approved_by, employee ],
                                                ( err, result ) => {
                                                    if( err )
                                                    {
                                                        console.log( err );
                                                        res.send( err );
                                                        res.end();
                                                    }else
                                                    {
                                                        const message = result[1][0].name + " has cleared an advance salary request for PKR (" + amount.toLocaleString('en') + ")";
                                                        administrativeNotifications( link, owner, message );
                                                        SendWhatsappNotification( null, null, "Hi " + result[0][0].name, "We are delighted to inform you that the advance salary request for PKR " + amount.toLocaleString('en') + " from " + result[2][0].name + "'s account has been successfully cleared", result[0][0].cell );
                                                        SendWhatsappNotification( null, null, "Hi " + result[1][0].name, "Congratulations! We would like to inform you that" + result[2][0].name + " has cleared the advance salary request for PKR " + amount.toLocaleString('en'), result[1][0].cell );
                                                        SendWhatsappNotification( null, null, "Hi " + result[2][0].name, "Congratulations! We would like to inform you that" + result[0][0].name + " has cleared your advance salary request on portal for PKR " + amount.toLocaleString('en') + ", the remaining balance is PKR " + rslt[2][0].balance.toLocaleString('en'), result[2][0].cell );
                                                    }
                                                }
                                            );
                                            connection.release();
                                            res.send({ message: 'success', link: link, owner: owner, date: new Date().toDateString(), time: moment(new Date().toTimeString(),'h:mm:ss a').format('hh:mm A') });
                                            res.end();
                                        }
                                    });
                                }
                                
                            }
                        );
                    }
                }
            )
        }
    )
} );

router.post('/cash/shipping/line', ( req, res ) => {

    const { emp_id, line, purpose, amount, additional_notes, submit_to, company_code, location_code, amount_in_words } = req.body;
    const d = new Date();

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
                            "INSERT INTO `tbl_shipping_line_payments`(`location`, `company`,`requested_by`, `requested_date`, `requested_time`, `approved_by`, `amount`, `amount_in_words`, `additional_notes`, `line`, `purpose`) VALUES (?,?,?,?,?,?,?,?,?,?,?);",
                            [location_code, location_code, emp_id, d, d.toTimeString(), submit_to, parseFloat(amount), amount_in_words, additional_notes, line, purpose],
                            ( err, rslt ) => {
                    
                                if( err )
                                {
                                    connection.rollback(() => {console.log(err);connection.release();});
                                    res.send('err');
                                    res.end();
                                }else 
                                {
                                    connection.commit((err) => {
                                        if ( err ) {
                                            connection.rollback(() => {console.log(err);connection.release();});
                                            res.send('err');
                                            res.end();
                                        }else
                                        {
                                            const link = '/cash/shipping/line/details/' + rslt.insertId.toString();
                                            connection.release();
                                            res.send({ message: 'success', link: link, owner: owner, date: new Date().toDateString(), time: moment(new Date().toTimeString(),'h:mm:ss a').format('hh:mm A') });
                                            res.end();
                                            db.query(
                                                "SELECT name, cell FROM employees WHERE emp_id = ?;" + 
                                                "SELECT name, cell FROM employees WHERE emp_id = ?;",
                                                [ emp_id, submit_to ],
                                                ( err, result ) => {
                                                    if( err )
                                                    {
                                                        console.log( err );
                                                        res.send( err );
                                                        res.end();
                                                    }else
                                                    {
                                                        const message = result[0][0].name + " has requested for shipping line payment for Rs " + amount.toLocaleString('en') + "/-";
                                                        administrativeNotifications( link, owner, message );
                                                        SendWhatsappNotification( null, null, "Hi " + result[0][0].name, "Thank you for applying for an shipping line payment option. Your shipping line payment request is under review. Thank you for your patience.", result[0][0].cell );
                                                        SendWhatsappNotification( null, null, "Hi " + result[1][0].name, result[0][0].name + " has requested for an shipping line payment for Rs " + amount.toLocaleString('en') + "/-. Your review is appreciated.", result[1][0].cell );
                                                    }
                                                }
                                            );
                                        }
                                    });
                                }
                                
                            }
                        );
                    }
                }
            )
        }
    )
} );

router.post('/shipping/line/load/payments', ( req, res ) => {

    const { emp_id, cashier, location_code, accessKey } = req.body;

    db.query(
        "SELECT  \
        tbl_shipping_line_payments.*, \
        requested.name AS requested_emp_name, \
        appr.name AS appr_emp_name, \
        received.name AS received_emp_name \
        FROM `tbl_shipping_line_payments`  \
        LEFT OUTER JOIN employees requested ON tbl_shipping_line_payments.requested_by = requested.emp_id \
        LEFT OUTER JOIN employees appr ON tbl_shipping_line_payments.approved_by = appr.emp_id \
        LEFT OUTER JOIN employees received ON tbl_shipping_line_payments.received_by = received.emp_id \
        " + ( accessKey === 1 ? "" : cashier ? ("WHERE tbl_shipping_line_payments.location = " + location_code + " AND (tbl_shipping_line_payments.status = 'approved' OR tbl_shipping_line_payments.status = 'issued' OR tbl_shipping_line_payments.status = 'cleared')") : "WHERE requested_by = ? OR approved_by = ? OR received_by = ? OR cashier = ?" ) + " ORDER BY `payment_id` DESC;",
        [ emp_id, emp_id, emp_id, emp_id ],
        ( err, rslt ) => {
            if( err )
            {
                console.log(err);
                res.status(500).send(err);
                res.end();
            }else 
            {
                console.log(rslt.length)
                res.send( rslt );
                res.end();
            }

        }
    )

} );

router.post('/shipping/line/request/details', ( req, res ) => {
    const { request_id } = req.body;

    db.query(
        "SELECT  \
        tbl_shipping_line_payments.*, \
        requested.name AS requested_emp_name, \
        appr.name AS appr_emp_name, \
        cashier.name AS cashier_emp_name, \
        received.name AS received_emp_name, \
        designations.designation_name \
        FROM `tbl_shipping_line_payments`  \
        LEFT OUTER JOIN employees requested ON tbl_shipping_line_payments.requested_by = requested.emp_id \
        LEFT OUTER JOIN employees appr ON tbl_shipping_line_payments.approved_by = appr.emp_id \
        LEFT OUTER JOIN employees received ON tbl_shipping_line_payments.received_by = received.emp_id \
        LEFT OUTER JOIN designations ON requested.designation_code = designations.designation_code \
        LEFT OUTER JOIN employees cashier ON tbl_shipping_line_payments.cashier = cashier.emp_id \
        WHERE tbl_shipping_line_payments.payment_id = ?;" +
        "SELECT * FROM `tbl_shipping_line_payment_bills` WHERE payment_id = ?;",
        [ request_id, request_id ],
        ( err, rslt ) => {
            if( err )
            {
                console.log(err);
                res.status(500).send(err);
                res.end();
            }else 
            {
                res.send( rslt );
                res.end();
            }
        }
    );
} );

router.post('/shipping/line/request/reject', ( req, res ) => {

    const { request_id, remarks, amount, employee, emp_id } = req.body;
    const d = new Date();

    db.query(
        "UPDATE tbl_shipping_line_payments SET status = ?, approved_date = ?, approved_time = ?, remarks = ? WHERE payment_id = ? AND approved_by = ?;",
        [ 'rejected', d, d.toTimeString(), remarks, request_id, emp_id ],
        ( err ) => {

            if( err )
            {
                console.log('err');
                res.status(500).send(err);
                res.end();
            }else 
            {
                const link = '/cash/shipping/line/details/' + request_id;
                res.send({ message: 'success', link: link, owner: owner, date: new Date().toDateString(), time: moment(new Date().toTimeString(),'h:mm:ss a').format('hh:mm A') });
                res.end();
                db.query(
                    "SELECT name, cell FROM employees WHERE emp_id = ?;" + 
                    "SELECT name, cell FROM employees WHERE emp_id = ?;",
                    [ emp_id, employee ],
                    ( err, result ) => {
                        if( err )
                        {
                            console.log( err );
                            res.send( err );
                            res.end();
                        }else
                        {
                            const message = result[0][0].name + " has rejected an shipping line payment for PKR (" + amount.toLocaleString('en') + ")";
                            administrativeNotifications( link, owner, message );
                            SendWhatsappNotification( null, null, "Hi " + result[0][0].name, "You have rejected an shipping line payment request of " + result[1][0].name + " We have duly informed the employee.", result[0][0].cell );
                            SendWhatsappNotification( null, null, "Hi " + result[1][0].name, "We regret to inform you that " + result[0][0].name + " has rejected your shipping line payment request with remarks '" + remarks + "'. If you have any query regarding this decision or need further information, please don't hesitate to contact us. Thank you.", result[1][0].cell );
                        }
                    }
                );
            }

        }
    )

} );

router.post('/shipping/line/request/approve', ( req, res ) => {

    const { request_id, remarks, employee, amount, cashiers, emp_id } = req.body;
    const d = new Date();
    const cashiersList = JSON.parse(cashiers);

    db.query(
        "UPDATE tbl_shipping_line_payments SET status = ?, approved_date = ?, approved_time = ?, remarks = ? WHERE payment_id = ? AND approved_by = ?;",
        [ 'approved', d, d.toTimeString(), remarks, request_id, emp_id ],
        ( err ) => {

            if( err )
            {
                console.log('err');
                res.status(500).send(err);
                res.end();
            }else 
            {
                const link = '/cash/shipping/line/details/' + request_id;
                res.send({ message: 'success', link: link, owner: owner, date: new Date().toDateString(), time: moment(new Date().toTimeString(),'h:mm:ss a').format('hh:mm A') });
                res.end();
                let query = "SELECT name, cell FROM employees WHERE emp_id = ?; SELECT name, cell FROM employees WHERE emp_id = ?;";
                let arr = [ emp_id, employee ];
                for ( let x = 0; x < cashiersList.length; x++ )
                {
                    query = query.concat("SELECT name, cell FROM employees WHERE emp_id = ?;");
                    arr.push(cashiersList[x].emp_id);
                }
                db.query(
                    query, arr,
                    ( err, result ) => {
                        if( err )
                        {
                            console.log( err );
                            res.send( err );
                            res.end();
                        }else
                        {
                            const message = result[0][0].name + " has approved an shipping line payment request for Rs " + amount.toLocaleString('en') + "/-";
                            administrativeNotifications( link, owner, message );
                            SendWhatsappNotification( null, null, "Hi " + result[0][0].name, " Your approved an shipping line payment request has been forwarded to " + result[1][0].name + " Thank you for your prompt action.", result[0][0].cell );
                            SendWhatsappNotification( null, null, "Hi " + result[1][0].name, " Congratulations! Your shipping line payment request for Rs " + amount.toLocaleString('en') + "/-. has been approved by" + result[0][0].name + ". You are now eligible to collect the requested amount. Please proceed with the collection process. Thank you.", result[1][0].cell );
                            for ( let x = 0; x < cashiersList.length; x++ )
                            {
                                let i = x + 1;
                                SendWhatsappNotification( null, null, "Hi " + result[1+i][0].name, "This is to notify you that " + result[0][0].name + " has approved an shipping line payment request for the amount of Rs " + amount.toLocaleString('en') + "/- and forwarded this request to you. If you have any questions, please let us know. Thank you.", result[1+i][0].cell );
                            }
                        }
                    }
                );
            }

        }
    )

} );

router.post('/shipping/line/validation', ( req, res ) => {
    const { request_id, receiver_id, employee, amount, passcode, template, emp_id } = req.body;
    const d = new Date();
    const sendNote = ( link, owner ) => {
        db.query(
            "SELECT name, cell FROM employees WHERE emp_id = ?;" + 
            "SELECT name, cell FROM employees WHERE emp_id = ?;" + 
            "SELECT name, cell FROM employees WHERE emp_id = ?;",
            [ emp_id, employee, receiver_id ],
            ( err, result ) => {
                if( err )
                {
                    console.log( err );
                    res.send( err );
                    res.end();
                }else
                {
                    const message = result[2][0].name + " has collected amount Rs " + amount.toLocaleString('en') + "/- from " + result[0][0].name + " in the account of shipping line payment.";
                    administrativeNotifications( link, owner, message );
                    SendWhatsappNotification( null, null, "Hi " + result[0][0].name, "This is to notify you that " + result[2][0].name + " has collected the amount of Rs " + amount.toLocaleString('en') + "/- from you in the account of shipping line payment. If you have any query, please feel free to reach out to us.", result[0][0].cell );
                    SendWhatsappNotification( null, null, "Hi " + result[1][0].name, result[2][0].name + " has collected amount Rs " + amount.toLocaleString('en') + "/- from " + result[0][0].name + " in the account of shipping line payment", result[1][0].cell );
                    SendWhatsappNotification( null, null, "Hi " + result[2][0].name, "You have collected amount Rs " + amount.toLocaleString('en') + "/- from " + result[0][0].name + " in the account of shipping line payment", result[2][0].cell );
                }
            }
        );
    }
    db.query(
        "SELECT emp_password FROM `emp_app_profile` WHERE emp_id = ?;",
        [ receiver_id ],
        ( err, rslt ) => {
            if( err )
            {
                console.log(err);
                res.status(500).send(err);
                res.end();
            }else 
            {
                if ( encryptor.decrypt(rslt[0].emp_password) === passcode )
                {
                    db.getConnection(
                        ( err, connection ) => {
                            connection.beginTransaction(
                                ( err ) => {
                                    if ( err )
                                    {
                                        connection.rollback(() => {console.log(err);connection.release();});
                                        res.send('err');
                                        res.end();
                                    }else
                                    {
                                        let fingerprintName = "employee.bmp";
                                        fs.mkdir('assets/portal/assets/SLP/' + request_id + '/thumbs/', { recursive: true }, (err) => {
                                            if ( err )
                                            {
                                                console.log(err)
                                                res.send('err');
                                                res.end();
                                            }else
                                            {
                                                if ( template !== 'null' )
                                                {
                                                    fs.writeFile('assets/portal/assets/SLP/' + request_id + '/thumbs/' + fingerprintName, template, 'base64', function(err) {
                                                        if ( err )
                                                        {
                                                            connection.rollback(() => {console.log(err);connection.release();});
                                                            res.send('err');
                                                            res.end();
                                                        }
                                                    });
                                                }
                                            }
                                        });
                                        connection.query(
                                            "UPDATE tbl_shipping_line_payments SET received_date = ?, received_time = ?, received_by = ?, status = ?, cashier = ? WHERE payment_id = ? AND status = 'approved';",
                                            [ d, d.toTimeString(), receiver_id, 'issued', emp_id, request_id ],
                                            ( err, rslt ) => {
                                                if( err )
                                                {
                                                    connection.rollback(() => {console.log(err);connection.release();});
                                                    res.send('err');
                                                    res.end();
                                                }else 
                                                {
                                                    connection.commit((err) => {
                                                        if ( err ) {
                                                            connection.rollback(() => {console.log(err);connection.release();});
                                                            res.send('err');
                                                            res.end();
                                                        }else
                                                        {
                                                            const link = '/cash/shipping/line/details/' + request_id.toString();
                                                            sendNote(link, owner);
                                                            connection.release();
                                                            res.send({ message: 'success', link: link, owner: owner, date: new Date().toDateString(), time: moment(new Date().toTimeString(),'h:mm:ss a').format('hh:mm A') });
                                                            res.end();
                                                        }
                                                    });
                                                }
                                                
                                            }
                                        );
                                    }
                                }
                            )
                        }
                    )
                }else
                {
                    res.send('not matched');
                    res.end();
                }
            }
        }
    )
} );

router.post('/shipping/line/clearance', ( req, res ) => {
    const { request_id, amount_consumed, employee, amount, received_by, emp_id } = req.body;
    const d = new Date();
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
                            "UPDATE tbl_shipping_line_payments SET clearance_date = ?, clearance_time = ?, status = ?, amount_consumed = ? WHERE payment_id = ? AND cashier = ?;",
                            [ d, d.toTimeString(), 'cleared', amount_consumed, request_id, emp_id ],
                            ( err ) => {
                                if( err )
                                {
                                    connection.rollback(() => {console.log(err);connection.release();});
                                    res.send('err');
                                    res.end();
                                }else 
                                {
                                    const { file } = req.files;
                                    let fileArr = [];
                                    if ( !file.length ) {
                                        fileArr = [file];
                                    }else {
                                        fileArr = file;
                                    };

                                    fs.mkdir('assets/portal/assets/SLP/' + request_id + '/bills',
                                        { recursive: true },
                                        (err) => {
                                            if (err) {
                                                connection.rollback(() => {console.log(err);connection.release();});
                                                res.status(500).send(err);
                                                res.end();
                                            }
                                            else {
                                                let bill_Limit = fileArr.length;
                                                let bill_Limit_count = [];
                                                function addBills()
                                                {
                                                    connection.query(
                                                        "INSERT INTO `tbl_shipping_line_payment_bills`(`payment_id`, `bill`, `bill_date`, `bill_time`) VALUES (?,?,?,?);",
                                                        [ request_id, 'assets/portal/assets/SLP/' + request_id + '/bills/' + ( fileArr[bill_Limit_count.length].md5 + "_" + fileArr[bill_Limit_count.length].name), new Date(), new Date().toTimeString() ],
                                                        ( err ) => {
                                                            if( err )
                                                            {
                                                                connection.release();
                                                                console.log( err );
                                                                res.send( err );
                                                                res.end();
                                                            }else
                                                            {
                                                                fileArr[bill_Limit_count.length].mv('assets/portal/assets/SLP/' + request_id + '/bills/' + ( fileArr[bill_Limit_count.length].md5 + "_" + fileArr[bill_Limit_count.length].name), (err) => {if (err){connection.rollback(() => {console.log(err);connection.release();})}})
                                                                if ( ( bill_Limit_count.length + 1 ) === bill_Limit )
                                                                {
                                                                    console.log( "SLP bills has been added!!!" );
                                                                    connection.commit((err) => {
                                                                        if ( err ) {
                                                                            connection.rollback(() => {console.log(err);connection.release();});
                                                                            res.send('err');
                                                                            res.end();
                                                                        }else
                                                                        {
                                                                            const link = '/cash/shipping/line/details/' + request_id;
                                                                            connection.query(
                                                                                "SELECT name, cell FROM employees WHERE emp_id = ?;" + 
                                                                                "SELECT name, cell FROM employees WHERE emp_id = ?;" + 
                                                                                "SELECT name, cell FROM employees WHERE emp_id = ?;",
                                                                                [ emp_id, received_by, employee ],
                                                                                ( err, result ) => {
                                                                                    if( err )
                                                                                    {
                                                                                        connection.release();
                                                                                        console.log( err );
                                                                                        res.send( err );
                                                                                        res.end();
                                                                                    }else
                                                                                    {
                                                                                        const message = result[2][0].name + " has cleared his shipping line payment for Rs " + amount.toLocaleString('en') + "/-";
                                                                                        administrativeNotifications( link, owner, message );
                                                                                        SendWhatsappNotification( null, null, "Hi " + result[0][0].name, "You have cleared a shipping line payment for Rs " + amount.toLocaleString('en') + "/- from the account of " + result[2][0].name, result[0][0].cell );
                                                                                        SendWhatsappNotification( null, null, "Hi " + result[1][0].name, "You have submitted the bills against the shipping line payment and " + result[0][0].name + " has cleared that shipping line payment request for Rs " + amount.toLocaleString('en') + "/-", result[1][0].cell );
                                                                                        SendWhatsappNotification( null, null, "Hi " + result[2][0].name, result[0][0].name + " has cleared your shipping line payment on portal for Rs " + amount.toLocaleString('en') + "/-", result[2][0].cell );
                                                                                        connection.release();
                                                                                        res.send({ message: 'success', link: link, owner: owner, date: new Date().toDateString(), time: moment(new Date().toTimeString(),'h:mm:ss a').format('hh:mm A') });
                                                                                        res.end();
                                                                                    }
                                                                                }
                                                                            );
                                                                        }
                                                                    });
                                                                }else
                                                                {
                                                                    bill_Limit_count.push(1);
                                                                    addBills();
                                                                }
                                                            }
                                                        }
                                                    );
                                                }
                                                addBills();
                                            }
                                        }
                                    )
                                }
                            }
                        );
                    }
                }
            )
        }
    )
} );

module.exports = router;
