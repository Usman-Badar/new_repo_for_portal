const express = require('express');
const router = express.Router();
const db = require('../../db/connection');
const moment = require('moment');
const { administrativeNotifications } = require('../Employee/notifications');
const { SendWhatsappNotification } = require('../Whatsapp/whatsapp');
const owner = 5000; // JP
const inv = 20015; // Antash
const inv2 = 5000; // Saima

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

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
                        const limit = rslt.length;
                        const count = [];
                        db.query(
                            "SELECT additional_off, time_out FROM employees WHERE emp_id = ?;" +
                            "SELECT day FROM tbl_holidays;" +
                            "SELECT time_in, status FROM emp_attendance WHERE emp_id = ? AND emp_date = ?;",
                            [inv2, inv2, new Date().toISOString().slice(0, 10).replace('T', ' ')],
                            ( _, offDays ) => {
                                const { additional_off, time_out } = offDays[0][0];
                                const parsed_offDays = JSON.parse(additional_off);
                                const holidays = [];
                                offDays[1].forEach(({day}) => holidays.push(day));

                                issueTickets(parsed_offDays, holidays, time_out, offDays[2]);
                            }
                        );
                        async function issueTickets(parsed_offDays, holidays, time_out, isPresent)
                        {
                            const submitDate = new Date(rslt[count.length].submit_date);
                            const currentDate = new Date(rslt[count.length].today);
                            const dayName = days[currentDate.getDay()];
                            let issueTicket = false;

                            if (holidays.includes(rslt[count.length].today) || dayName === 'Sunday') {
                                next(parsed_offDays, holidays, time_out, isPresent);
                            }else if (isPresent.length === 0) {
                                next(parsed_offDays, holidays, time_out, isPresent);
                            }else if (isPresent[0].status.toLowerCase() === 'leave') {
                                next(parsed_offDays, holidays, time_out, isPresent);
                            }else {
                                const ticket_issue_date_time = await predictTicketTime(submitDate, rslt[count.length].submit_time, currentDate, time_out, isPresent);
                                if ( ticket_issue_date_time.ticket_should_issue ) {
                                    const code = rslt[count.length].company_code_name + '-' + rslt[count.length].series_year + '-' + rslt[count.length].serial_no;
                                    const remarks = "Yellow ticket has been issued by the system on behalf of Mr. Jahanzeb Punjwani due to the late verification of the advance cash request with serial number:\n" + code;
                                    db.query(
                                        "INSERT INTO `emp_tickets`(`emp_id`, `generated_by`, `generated_date`, `generated_time`, `ticket`, `remarks`) VALUES (?,?,?,?,?,?);" +
                                        "UPDATE db_cash_receipts SET ticket_issued_for_late_verification = 1 WHERE id = ?;",
                                        [ 
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
                                                    "SELECT name, cell FROM employees WHERE emp_id = ?;",
                                                    [ 
                                                        owner, 
                                                        inv2 
                                                    ],
                                                    ( err, result ) => {
                                                        if( err ) {
                                                            console.log( err );
                                                            checkAdvanceCashPendingForVerification();
                                                        }else
                                                        {
                                                            const message = "Yellow ticket has been given to the employee(s) " + result[1][0].name + " due to late advance cash (" + code + ") verification.";
                                                            administrativeNotifications( '/cash/request/' + rslt[count.length].id, owner, message );
                                                            SendWhatsappNotification( null, null, "Hi " + result[0][0].name, message, result[0][0].cell );
                                                            SendWhatsappNotification( null, null, "Hi " + result[1][0].name, result[0][0].name + " has given you a yellow ticket with remarks '" + remarks + "'.", result[1][0].cell );
                                                            if ( ( count.length + 1 ) === limit )
                                                            {
                                                                console.log( "Ticket Issued (Verification) Regarding Advance Cash!!!" );
                                                                checkAdvanceCashPendingForVerification();
                                                            }else
                                                            {
                                                                count.push(1);
                                                                issueTickets(parsed_offDays, holidays, time_out, isPresent);
                                                            }
                                                        }
                                                    }
                                                );
                                            }
                                        }
                                    );
                                }else {
                                    next(parsed_offDays, holidays, time_out, isPresent);
                                }
                            }
                        };
                        function next(parsed_offDays, holidays, time_out, isPresent) {
                            if ((count.length + 1) === limit) {
                                console.log( "Ticket Not Issued For (Verification) Regarding Advance Cash!!!" );
                                checkAdvanceCashPendingForVerification();
                            }else {
                                count.push(1);
                                issueTickets(parsed_offDays, holidays, time_out, isPresent);
                            }
                        }
                        async function predictTicketTime(submit_date, submit_time, curren_date, time_out, isPresent) {
                            try {
                                let currentDateRequest = true;
                                let ticket_should_issue = false;
                                const dt = new Date(submit_date.toISOString().slice(0, 10).replace('T', ' ') + ' ' + submit_time);
                                const date_time = moment(dt);
                                const addHours = date_time.add(4, 'hours').format('YYYY-MM-DD HH:mm:ss');

                                const startTime = moment(submit_time, 'HH:mm:ss a');
                                const emp_time_out = moment(time_out, 'HH:mm:ss a');
                                const duration = moment.duration(emp_time_out.diff(startTime));
                                const last_day_minutes = parseInt(duration.asMinutes());

                                console.log('last_day_minutes', last_day_minutes);

                                const emp_time_in = moment(isPresent[0].time_in, 'HH:mm:ss a');
                                const currentTime = moment(new Date().toTimeString().substring(0,8), 'HH:mm:ss a');
                                const today_duration = moment.duration(currentTime.diff(emp_time_in));
                                const today_minutes = parseInt(today_duration.asMinutes());

                                console.log('today_minutes', today_minutes);

                                const total_minutes_passed = parseInt(last_day_minutes) + parseInt(today_minutes);

                                const predicted_time_is_in_working_hours = addHours.valueOf() <= emp_time_out.format('HH:mm:ss').valueOf();
                                const predicted_time_for_next_day_is_exceed = total_minutes_passed > 240; // 60 minutes * 4 hours = 240 minutes
                                
                                if (curren_date > submit_date) {
                                    currentDateRequest = false;
                                }
    
                                if (currentDateRequest) {
                                    if (predicted_time_is_in_working_hours) {
                                        ticket_should_issue = true;
                                    }
                                    return {predicted_dt: addHours, ticket_should_issue: ticket_should_issue};
                                }else {
                                    if (predicted_time_for_next_day_is_exceed) {
                                        ticket_should_issue = true;
                                    }
                                    return {predicted_dt: total_minutes_passed, ticket_should_issue: ticket_should_issue};
                                }
                            }catch (err) {
                                console.log(err);
                            }
                        }
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

// const today_duration = moment.duration(moment('2023-11-25 18:00:00', 'YYYY-MM-DD HH:mm:ss').diff(moment('2023-11-25 14:50:00', 'YYYY-MM-DD HH:mm:ss')));
// const totalHours = parseFloat(today_duration.asHours());
// console.log('totalHours', totalHours);

module.exports = {
    router: router,
    checkAdvanceCashPendingForVerification: () => checkAdvanceCashPendingForVerification(),
    checkAdvanceCashPendingForApproval: () => checkAdvanceCashPendingForApproval()
};