const express = require('express');
const router = express.Router();
const db = require('../../db/connection');
const moment = require('moment');
const { administrativeNotifications } = require('../Employee/notifications');
const { SendWhatsappNotification } = require('../Whatsapp/whatsapp');
const owner = 5000; // JP
const inv = 20015; // Antash
const inv2 = 5000; // Saima

function checkAdvanceCashPendingForVerification() {
    setTimeout(() => {
        db.query(
            "SELECT db_cash_receipts.*, companies.code AS company_code_name, CURDATE() AS today FROM `db_cash_receipts` LEFT OUTER JOIN companies ON db_cash_receipts.company = companies.company_code WHERE db_cash_receipts.status = 'pending for verification' AND db_cash_receipts.ticket_issued_for_late_verification = 0 ORDER BY db_cash_receipts.id DESC;",
            (err, rslt) => {
                if (err) {
                    console.log(err);
                    checkAdvanceCashPendingForVerification();
                }else {
                    if ( rslt.length > 0 ) {
                        let limit = rslt.length;
                        let count = [];
                        function issueTickets()
                        {
                            let issueTicket = false;
                            if (new Date(rslt[count.length].today) > new Date(rslt[count.length].submit_date)) {
                                issueTicket = true;
                            }else {
                                const startTime = moment(rslt[count.length].submit_time, 'HH:mm:ss a');
                                const endTime = moment(new Date().toTimeString().substring(0,8), 'HH:mm:ss a');
                                const duration = moment.duration(endTime.diff(startTime));
                                const hours = parseInt(duration.asHours());
                                if ( hours >= 2 ) {
                                    issueTicket = true;
                                }
                            }
                            if ( issueTicket ) {
                                const code = rslt[count.length].company_code_name + '-' + rslt[count.length].series_year + '-' + rslt[count.length].serial_no;
                                const remarks = "Yellow ticket has been issued by the system on behalf of Mr. Jahanzeb Punjwani due to the late verification of the advance cash request with serial number:\n" + code;
                                db.query(
                                    "INSERT INTO `emp_tickets`(`emp_id`, `generated_by`, `generated_date`, `generated_time`, `ticket`, `remarks`) VALUES (?,?,?,?,?,?);" +
                                    "INSERT INTO `emp_tickets`(`emp_id`, `generated_by`, `generated_date`, `generated_time`, `ticket`, `remarks`) VALUES (?,?,?,?,?,?);" +
                                    "UPDATE db_cash_receipts SET ticket_issued_for_late_verification = 1 WHERE id = ?;",
                                    [ 
                                        inv, owner, new Date(), new Date().toTimeString(), 'yellow', remarks, 
                                        inv2, owner, new Date(), new Date().toTimeString(), 'yellow', remarks,
                                        rslt[count.length].id
                                    ],
                                    ( err ) => {
                                        if( err ) {
                                            console.log( err );
                                            checkAdvanceCashPendingForVerification();
                                        }else 
                                        {
                                            db.query(
                                                "SELECT name, cell FROM employees WHERE emp_id = ?;" + 
                                                "SELECT name, cell FROM employees WHERE emp_id = ?;" + 
                                                "SELECT name, cell FROM employees WHERE emp_id = ?;",
                                                [ owner, inv, inv2 ],
                                                ( err, result ) => {
                                                    if( err ) {
                                                        console.log( err );
                                                        checkAdvanceCashPendingForVerification();
                                                    }else
                                                    {
                                                        const message = "Yellow ticket has been given to the employee(s) " + result[1][0].name + " and " + result[2][0].name + " due to late advance cash (" + code + ") verification.";
                                                        administrativeNotifications( '/cash/request/' + rslt[count.length].id, owner, message );
                                                        SendWhatsappNotification( null, null, "Hi " + result[0][0].name, message, result[0][0].cell );
                                                        SendWhatsappNotification( null, null, "Hi " + result[1][0].name, result[0][0].name + " has given you a yellow ticket with remarks '" + remarks + "'.", result[1][0].cell );
                                                        SendWhatsappNotification( null, null, "Hi " + result[2][0].name, result[0][0].name + " has given you a yellow ticket with remarks '" + remarks + "'.", result[2][0].cell );
                                                        if ( ( count.length + 1 ) === limit )
                                                        {
                                                            console.log( "Ticket Issued (Verification) Regarding Advance Cash!!!" );
                                                            checkAdvanceCashPendingForVerification();
                                                        }else
                                                        {
                                                            count.push(1);
                                                            issueTickets();
                                                        }
                                                    }
                                                }
                                            );
                                        }
                                    }
                                );
                            }else
                            {
                                count.push(1);
                                issueTickets();
                            }
                        }
                        issueTickets();
                    }else
                    {
                        checkAdvanceCashPendingForVerification();
                    }
                }
            }
        )
    }, 1000);
}

function checkAdvanceCashPendingForApproval() {
    setTimeout(() => {
        db.query(
            "SELECT db_cash_receipts.*, companies.code AS company_code_name, CURDATE() AS today FROM `db_cash_receipts` LEFT OUTER JOIN companies ON db_cash_receipts.company = companies.company_code WHERE db_cash_receipts.status = 'waiting for approval' AND db_cash_receipts.ticket_issued_for_late_approval = 0 AND db_cash_receipts.approved_by IS NOT NULL ORDER BY db_cash_receipts.id DESC;",
            (err, rslt) => {
                if (err) {
                    console.log(err);
                    checkAdvanceCashPendingForApproval();
                }else {
                    if ( rslt.length > 0 ) {
                        let limit = rslt.length;
                        let count = [];
                        function issueTickets()
                        {
                            let issueTicket = false;
                            if (new Date(rslt[count.length].today) > new Date(rslt[count.length].verified_date)) {
                                issueTicket = true;
                            }else {
                                const startTime = moment(rslt[count.length].verified_time, 'HH:mm:ss a');
                                const endTime = moment(new Date().toTimeString().substring(0,8), 'HH:mm:ss a');
                                const duration = moment.duration(endTime.diff(startTime));
                                const minutes = parseInt(duration.asMinutes()) % 60;
                                if ( minutes >= 30 ) {
                                    issueTicket = true;
                                }
                            }
                            if ( issueTicket ) {
                                const code = rslt[count.length].company_code_name + '-' + rslt[count.length].series_year + '-' + rslt[count.length].serial_no;
                                const remarks = "Yellow ticket has been issued by the system on behalf of Mr. Jahanzeb Punjwani due to the late approval of the advance cash request with serial number:\n" + code;
                                db.query(
                                    "INSERT INTO `emp_tickets`(`emp_id`, `generated_by`, `generated_date`, `generated_time`, `ticket`, `remarks`) VALUES (?,?,?,?,?,?);" +
                                    "UPDATE db_cash_receipts SET ticket_issued_for_late_approval = 1 WHERE id = ?;",
                                    [ 
                                        rslt[count.length].approved_by, owner, new Date(), new Date().toTimeString(), 'yellow', remarks, 
                                        rslt[count.length].id
                                    ],
                                    ( err ) => {
                                        if( err ) {
                                            console.log( err );
                                            checkAdvanceCashPendingForApproval();
                                        }else 
                                        {
                                            db.query(
                                                "SELECT name, cell FROM employees WHERE emp_id = ?;" + 
                                                "SELECT name, cell FROM employees WHERE emp_id = ?;",
                                                [ owner, rslt[count.length].approved_by ],
                                                ( err, result ) => {
                                                    if( err ) {
                                                        console.log( err );
                                                        checkAdvanceCashPendingForApproval();
                                                    }else
                                                    {
                                                        const message = "Yellow ticket has been given to the employee(s) " + result[1][0].name + " due to late advance cash (" + code + ") approval.";
                                                        administrativeNotifications( '/cash/request/' + rslt[count.length].id, owner, message );
                                                        SendWhatsappNotification( null, null, "Hi " + result[0][0].name, message, result[0][0].cell );
                                                        SendWhatsappNotification( null, null, "Hi " + result[1][0].name, result[0][0].name + " has given you a yellow ticket with remarks '" + remarks + "'.", result[1][0].cell );
                                                        if ( ( count.length + 1 ) === limit )
                                                        {
                                                            console.log( "Ticket Issued (Approval) Regarding Advance Cash!!!" );
                                                            checkAdvanceCashPendingForApproval();
                                                        }else
                                                        {
                                                            count.push(1);
                                                            issueTickets();
                                                        }
                                                    }
                                                }
                                            );
                                        }
                                    }
                                );
                            }else
                            {
                                count.push(1);
                                issueTickets();
                            }
                        }
                        issueTickets();
                    }else
                    {
                        checkAdvanceCashPendingForApproval();
                    }
                }
            }
        )
    }, 1000 * 30);
}

setTimeout(() => {
    checkAdvanceCashPendingForVerification();
    checkAdvanceCashPendingForApproval();
}, 1000);

module.exports = {
    router: router,
    checkAdvanceCashPendingForVerification: () => checkAdvanceCashPendingForVerification(),
    checkAdvanceCashPendingForApproval: () => checkAdvanceCashPendingForApproval()
};