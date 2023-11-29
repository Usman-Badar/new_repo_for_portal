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
const owner = 1; // JP
const inv = 20015; // Antash
const inv2 = 20055; // Saima

io.on('connection', ( socket ) => {
    socket.on(
        'admin_notification', (data) => {
            socket.broadcast.emit('admin_notification', { link: data.link, owner: data.owner, message: data.message });
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

    const { emp_id, request_to, company_code, location_code, reason, amountInWords, amount, employee } = req.body;
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
                    SendWhatsappNotification( null, null, "Hi " + result[0][0].name, "You have requested for advance cash, your request is in review. Please wait...", result[0][0].cell );
                    SendWhatsappNotification( null, null, "Hi " + result[1][0].name, result[0][0].name + " has requested for an advance cash for PKR " + amount.toLocaleString('en') + ". Kindly review", result[1][0].cell );
                    SendWhatsappNotification( null, null, "Hi " + result[2][0].name, result[0][0].name + " has requested for an advance cash for PKR " + amount.toLocaleString('en') + ". Kindly review", result[2][0].cell );
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
                            "SELECT MAX(serial_no) AS last_serial_no FROM db_cash_receipts WHERE series_year = ?;",
                            [emp_id, financial_year],
                            ( err, rslt ) => {
                    
                                if( err )
                                {
                                    connection.rollback(() => {console.log(err);connection.release();});
                                    res.send('err');
                                    res.end();
                                }else 
                                {
                                    let balance = 0;
                                    let serial_no = rslt[1][0].last_serial_no ? (rslt[1][0].last_serial_no + 1) : 1;
                                    if ( rslt[0].length > 0 )
                                    {
                                        connection.query(
                                            "INSERT INTO `db_cash_receipts`(`serial_no`, `series_year`, `emp_id`, `submit_date`, `submit_time`, `amount`, `amount_in_words`, `company`, `location`, `reason`) VALUES (?,?,?,?,?,?,?,?,?,?);",
                                            [ serial_no, financial_year, emp_id, d, d.toTimeString(), amount, amountInWords, company_code, location_code, reason ],
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

    const { emp_id, accessKey } = req.body;

    db.query(
        "SELECT  \
        db_cash_receipts.*, \
        locations.location_name, \
        companies.company_name, \
        record.name AS record_emp_name, \
        appr.name AS appr_emp_name, \
        req.name AS requested_emp_name \
        FROM `db_cash_receipts`  \
        LEFT OUTER JOIN employees record ON db_cash_receipts.verified_by = record.emp_id \
        LEFT OUTER JOIN employees appr ON db_cash_receipts.approved_by = appr.emp_id \
        LEFT OUTER JOIN employees req ON db_cash_receipts.emp_id = req.emp_id \
        LEFT OUTER JOIN locations ON db_cash_receipts.location = locations.location_code \
        LEFT OUTER JOIN companies ON db_cash_receipts.company = companies.company_code \
        " + ( accessKey === 1 ? "" : "WHERE approved_by = ? OR verified_by = ? OR cashier = ? OR db_cash_receipts.emp_id = ?" ) + " ORDER BY `id` DESC;",
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

router.get('/cash/load/request/cashiers', ( req, res ) => {
    db.query(
        "SELECT emp_id, name FROM `employees` WHERE emp_status = 'Active' AND designation_code = 66 OR designation_code = 97;;",
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

    const { request_id, remarks, employee, amount, submit_to, emp_id } = req.body;
    const d = new Date();

    db.query(
        "UPDATE db_cash_receipts SET status = ?, approved_date = ?, approved_time = ?, hod_remarks = ?, cashier = ? WHERE id = ? AND approved_by;",
        [ 'approved', d, d.toTimeString(), remarks, submit_to, request_id, emp_id ],
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
                            const message = result[0][0].name + " has approved an advance cash for PKR (" + amount.toLocaleString('en') + ")";
                            administrativeNotifications( link, owner, message );
                            SendWhatsappNotification( null, null, "Hi " + result[0][0].name, "You have approved an advance cash request, the request has been forwarded to " + result[1][0].name, result[0][0].cell );
                            SendWhatsappNotification( null, null, "Hi " + result[1][0].name, result[0][0].name + " has approved and forwarded you an advance cash request on portal for PKR " + amount.toLocaleString('en') + ", kindly issue the required amount to " + result[2][0].name, result[1][0].cell );
                            SendWhatsappNotification( null, null, "Hi " + result[2][0].name, result[0][0].name + " has approved your advance cash request for PKR " + amount.toLocaleString('en') + ". You can collect the granted amount from " + result[1][0].name, result[2][0].cell );
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
                            SendWhatsappNotification( null, null, "Hi " + result[0][0].name, "You have verified an advance cash request, the request has been forwarded to " + result[1][0].name, result[0][0].cell );
                            SendWhatsappNotification( null, null, "Hi " + result[1][0].name, result[0][0].name + " has verified and forwarded you an advance cash request on portal for PKR " + amount.toLocaleString('en') + ", kindly issue the required amount to " + result[2][0].name, result[1][0].cell );
                            SendWhatsappNotification( null, null, "Hi " + result[2][0].name, result[0][0].name + " has verified your advance cash request for PKR " + amount.toLocaleString('en') + ". Your request is now pending for approval.", result[2][0].cell );
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
                            SendWhatsappNotification( null, null, "Hi " + result[0][0].name, "You have rejected an advance cash request, the requested employee " + result[1][0].name + " has been informed.", result[0][0].cell );
                            SendWhatsappNotification( null, null, "Hi " + result[1][0].name, result[0][0].name + " has rejected your an advance cash request with remarks '" + remarks + "'", result[1][0].cell );
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
                            SendWhatsappNotification( null, null, "Hi " + result[0][0].name, "You have rejected an advance cash request, the requested employee " + result[1][0].name + " has been informed.", result[0][0].cell );
                            SendWhatsappNotification( null, null, "Hi " + result[1][0].name, result[0][0].name + " has rejected your an advance cash request with remarks '" + remarks + "'", result[1][0].cell );
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

    db.query(
        "UPDATE db_cash_receipts SET approved_by = ?, status = ?, approved_date = ?, approved_time = ?, hod_remarks = ? WHERE id = ? AND verified_by = ?;",
        [ emp_id, 'cancelled', d, d.toTimeString(), remarks, request_id, emp_id ],
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
                    [ emp_id, employee, appr_by ],
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
                            SendWhatsappNotification( null, null, "Hi " + result[0][0].name, "You have cancelled an advance cash request, the requested employee " + result[1][0].name + " has been informed.", result[0][0].cell );
                            SendWhatsappNotification( null, null, "Hi " + result[1][0].name, result[0][0].name + " has cancelled your an advance cash request with reason '" + remarks + "'", result[1][0].cell );
                            SendWhatsappNotification( null, null, "Hi " + result[2][0].name, result[0][0].name + " has cancelled an advance cash request with reason '" + remarks + "'", result[1][0].cell );
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
        const img = 'client/public/images/thumbs/' + cashier + '/' + fingerpos[x] + "_" + cashier + ".txt";
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
                    SendWhatsappNotification( null, null, "Hi " + result[0][0].name, result[1][0].name + " has collected amount PKR " + amount.toLocaleString('en') + " from you.", result[0][0].cell );
                    SendWhatsappNotification( null, null, "Hi " + result[1][0].name, "You have collected amount PKR " + amount.toLocaleString('en') + " from " + result[0][0].name, result[1][0].cell );
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
                                            "UPDATE db_cash_receipts SET receival_date = ?, receival_time = ?, status = ?, other = ?, received_person_name = ?, received_person_contact = ?, received_person_cnic = ?, cnic_front = ?, cnic_back = ?, signature = ?, emp_finger_print = ? WHERE id = ? AND cashier = ? AND status = 'approved';",
                                            [ parseFloat(amount), d, employee, d, d.toTimeString(), 'issued', other_person, receiving_person == 'null' ? null : receiving_person, receiving_person_contact == 'null' ? null : receiving_person_contact, receiving_person_cnic == 'null' ? null : receiving_person_cnic, 'front.png', 'back.png', 'signature.png', fingerprint2Name, request_id, emp_id ],
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
                                                        SendWhatsappNotification( null, null, "Hi " + result[0][0].name, "You have cleared an advance cash for PKR " + amount.toLocaleString('en') + " from the account of " + result[2][0].name, result[0][0].cell );
                                                        SendWhatsappNotification( null, null, "Hi " + result[1][0].name, result[2][0].name + " has cleared an advance cash request for PKR " + amount.toLocaleString('en'), result[1][0].cell );
                                                        SendWhatsappNotification( null, null, "Hi " + result[2][0].name, result[0][0].name + " has cleared your advance cash on portal for PKR " + amount.toLocaleString('en') + ", the remaining balance is PKR " + rslt[2][0].balance.toLocaleString('en'), result[2][0].cell );
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

// router.post('/cash/test/thumbs', ( req, res ) => {
//     const { template_1 } = req.body;

//     const compareImages = async (fileName1, fileName2) => {
//         // const example1 = await Jimp.read("image-text.jpg")
//         const example1 = await Jimp.read(fileName1)
//         const example2 = await Jimp.read(fileName2)
//         const example1Hash = example1.hash()
//         const example2Hash = example2.hash()
//         const distance = Jimp.distance(example1, example2)
//         const diff = Jimp.diff(example1, example2)
    
//         // console.log(distance)
//         // console.log(diff)
//         // if (example1Hash !== example2Hash || distance > 0.15 || diff.percent > 0.5) {
    
//         if (diff.percent > 0.1) {
//             return "Images don't match"
//         } else {
//             return "Images are same"
//         }
//     }

//     fs.writeFile("client/public/images/thumbs/1001/test.png", template_1, 'base64', function(err) {
//         console.log(err);
//         console.log("Finger Print Saved");
    
//         compareImages("client/public/images/thumbs/1000/LEFT_INDEX_1001.png", "client/public/images/thumbs/1001/test.png").then(result => {
//             console.log(result)
//         }).catch(err => {
//             console.log(err)
//         });
//     });

// } );


module.exports = router;