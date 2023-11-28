const express = require('express');
const router = express.Router();
const db = require('../../db/connection');
const fs = require('fs');
const io = require('../../server');
const SendWhatsappNotification = require('../Whatsapp/whatsapp').SendWhatsappNotification;
const administrativeNotifications = require('../Employee/notifications').administrativeNotifications;

const moment = require('moment');
const key = 'real secret keys should be long and random';
const encryptor = require('simple-encryptor')(key);
const owner = 5000; // JP
const inv = 20004; // Mahmood ul Hassan

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

router.post('/cash/shipping/create', ( req, res ) => {

    const { line, pr_id, previous_slip, emp_id, request_to, company_code, location_code, reason, amountInWords, amount, d_o, lolo, detention, damage_dirty, csc, other, other_specification } = req.body;
    const d = new Date();
    const financial_year = getFinancialYear();

    if (line.trim().length === 0) {
        res.send('err').end();
        return false;
    }else if (company_code === '') {
        res.send('err').end();
        return false;
    }else if (location_code === '') {
        res.send('err').end();
        return false;
    }else if (reason.trim().length < 20) {
        res.send('err').end();
        return false;
    }if (parseFloat(amount) < 1) {
        res.send('err').end();
        return false;
    }

    function sendNote(link, owner)
    {
        db.query(
            "SELECT name, cell FROM employees WHERE emp_id = ?;" + 
            "SELECT name, cell FROM employees WHERE emp_id = ?;",
            [ emp_id, inv ],
            ( err, result ) => {
                if( err )
                {
                    console.log( err );
                    res.send( err );
                    res.end();
                }else
                {
                    const message = result[0][0].name + " has requested for advance cash (shipping) for PKR (" + amount.toLocaleString('en') + ")";
                    administrativeNotifications( link, owner, message );
                    SendWhatsappNotification( null, null, "Hi " + result[0][0].name, "Thank you for applying for an advance cash (shipping). Your advance cash (shipping) request is under review. Thank you for your patience.", result[0][0].cell );
                    SendWhatsappNotification( null, null, "Hi " + result[1][0].name, result[0][0].name + " has requested for an advance cash (shipping) for PKR " + amount.toLocaleString('en') + ", Kindly review.", result[1][0].cell );
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
                                    let balance = 0;
                                    let serial_no = rslt[1][0] && rslt[1][0].last_serial_no ? (rslt[1][0].last_serial_no + 1) : 1;
                                    if ( rslt[0].length > 0 )
                                    {
                                        connection.query(
                                            "INSERT INTO `db_cash_receipts`(`shp_line_adv`, `line`, `d_o`, `lolo`, `detention`, `damage_dirty`, `csc`, `other_purpose_amount`, `other_purpose_specification`, `previous_slip`, `pr_id`, `serial_no`, `series_year`, `emp_id`, `submit_date`, `submit_time`, `amount`, `amount_in_words`, `company`, `location`, `reason`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);",
                                            [ 'Y', line, d_o, lolo, detention, damage_dirty, csc, other, other_specification, previous_slip == 'null' || previous_slip == 'undefined' ? null : previous_slip, pr_id == 'null' || pr_id == 'undefined' ? null : pr_id, serial_no, financial_year, emp_id, d, d.toTimeString(), amount, amountInWords, company_code, location_code, reason ],
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
                                            "INSERT INTO `db_cash_receipts`(`shp_line_adv`, `line`, `d_o`, `lolo`, `detention`, `damage_dirty`, `csc`, `other_purpose_amount`, `other_purpose_specification`, `serial_no`, `series_year`, `emp_id`, `submit_date`, `submit_time`, `amount`, `amount_in_words`, `company`, `location`, `reason`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);" +
                                            "INSERT INTO `db_cash_balance`(`emp_id`, `balance`, `last_updated`) VALUES (?,?,?);",
                                            [ 'Y', line, d_o, lolo, detention, damage_dirty, csc, other, other_specification, serial_no, financial_year, emp_id, d, d.toTimeString(), amount, amountInWords, company_code, location_code, reason, emp_id, balance, d ],
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

module.exports = router;