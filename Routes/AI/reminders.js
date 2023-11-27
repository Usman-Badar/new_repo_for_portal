const express = require('express');
const router = express.Router();
const db = require('../../db/connection');
let key = 'real secret keys should be long and random';
const encryptor = require('simple-encryptor')(key);

const SendWhatsappNotification = require('../Whatsapp/whatsapp').SendWhatsappNotification;

// function reminder_on_absent_for_leave()
// {
//     var prev_date = new Date();
//     prev_date.setDate(prev_date.getDate() - 1);

//     db.query(
//         "SELECT \
//         emp_attendance.*, \
//         `employees`.`cell`, \
//         `employees`.`name` \
//         FROM emp_attendance \
//         LEFT OUTER JOIN employees ON emp_attendance.emp_id = employees.emp_id \
//         WHERE emp_attendance.status = 'Absent' \
//         AND emp_attendance.emp_date = ?;",
//         [ prev_date.getFullYear() + '-' + parseInt(prev_date.getMonth() + 1) + '-' + prev_date.getDate() ],
//         ( err, rslt ) => {

//             if( err )
//             {

//                 console.log( err );

//             }else 
//             {
                
//                 let phrases = [ 
//                     "We discovered you were *absent* yesterday. Kindly send a leave request now on the portal, just log in to your account at http://portal.seaboard.pk" ,
//                     "We found you were *absent* yesterday. Kindly send a leave request now on the portal, just log in to your account at http://portal.seaboard.pk",
//                     "We discovered you were *absent* yesterday. Please send a leave request now on the portal by logging in to your account at http://portal.seaboard.pk.",
//                     "We discovered you were *absent* the day before. Please send a leave request now on the portal by logging in to your account at http://portal.seaboard.pk.",
//                     "You were *absent* yesterday, we discovered. Please send a leave request now on the portal by logging in to your account at http://portal.seaboard.pk."
//                 ]
//                 for ( let x = 0; x < rslt.length; x++ )
//                 {
//                     SendWhatsappNotification( null, null, "Hi " + rslt[x].name, phrases[Math.floor(Math.random() * phrases.length)], rslt[x].cell );
//                 }

//             }

//         }
//     )
// }

// function reminder_on_absent_for_leave()
// {
//     var prev_date = new Date();
//     prev_date.setDate(prev_date.getDate() - 1);

//     db.query(
//         "SELECT \
//         emp_attendance.*, \
//         `employees`.`cell`, \
//         `employees`.`name` \
//         FROM emp_attendance \
//         LEFT OUTER JOIN employees ON emp_attendance.emp_id = employees.emp_id \
//         WHERE emp_attendance.status = 'Absent' \
//         AND emp_attendance.emp_date = ?;",
//         [ prev_date.getFullYear() + '-' + parseInt(prev_date.getMonth() + 1) + '-' + prev_date.getDate() ],
//         ( err, rslt ) => {

//             if( err )
//             {

//                 console.log( err );

//             }else 
//             {
                
//                 let phrases = [ 
//                     "We discovered you were *absent* yesterday. Kindly send a leave request now on the portal, just log in to your account at http://portal.seaboard.pk" ,
//                     "We found you were *absent* yesterday. Kindly send a leave request now on the portal, just log in to your account at http://portal.seaboard.pk",
//                     "We discovered you were *absent* yesterday. Please send a leave request now on the portal by logging in to your account at http://portal.seaboard.pk.",
//                     "We discovered you were *absent* the day before. Please send a leave request now on the portal by logging in to your account at http://portal.seaboard.pk.",
//                     "You were *absent* yesterday, we discovered. Please send a leave request now on the portal by logging in to your account at http://portal.seaboard.pk."
//                 ]
//                 for ( let x = 0; x < rslt.length; x++ )
//                 {
//                     SendWhatsappNotification( null, null, "Hi " + rslt[x].name, phrases[Math.floor(Math.random() * phrases.length)], rslt[x].cell );
//                 }

//             }

//         }
//     )
// }

function correctStoredQuantityInProducts()
{

    db.query(
        "SELECT product_id, quantity FROM `tbl_inventory_products`;",
        ( err, rslt ) => {

            if( err )
            {

                console.log( err );

            }else 
            {
                
                let limit = rslt.length;
                let count = [];
                function getInwards()
                {
                    db.query(
                        "SELECT transaction_id, stored_quantity FROM `tbl_inventory_product_transactions` WHERE product_id = ? AND entry = ?;",
                        [ rslt[count.length].product_id, 'inward' ],
                        ( err, inwards ) => {
                            if( err )
                            {
                                console.log(err);
                            }else
                            {
                                if ( ( count.length + 1 ) === limit )
                                {
                                    console.log( "All Products Updated" );
                                }else
                                {
                                    let total_stored_quantity = 0;
                                    for ( let x = 0; x < inwards.length; x++ )
                                    {
                                        total_stored_quantity = total_stored_quantity + inwards[x].stored_quantity;
                                    }
                                    db.query(
                                        "UPDATE tbl_inventory_products SET quantity = ? WHERE product_id = ?;",
                                        [ total_stored_quantity, rslt[count.length].product_id ],
                                        ( err, updateRslt ) => {
                                            if( err )
                                            {
                                                console.log(err);
                                            }else
                                            {
                                                console.log(updateRslt);
                                                count.push(1);
                                                getInwards();
                                            }
                                        }
                                    )
                                }
                            }
                        }
                    )
                }
                getInwards();

            }

        }
    )
}
// correctStoredQuantityInProducts();
function reminder_on_absent_for_leave()
{
    var prev_date = new Date();
    prev_date.setDate(prev_date.getDate() - 1);

    db.query(
        "SELECT \
        emp_attendance.*, \
        `employees`.`cell`, \
        `employees`.`name` \
        `emp_props`.`whatsapp_notifications` \
        FROM emp_attendance \
        LEFT OUTER JOIN employees ON emp_attendance.emp_id = employees.emp_id \
        LEFT OUTER JOIN emp_props ON employees.emp_id = emp_props.emp_id \
        WHERE emp_attendance.status = 'Absent' \
        AND emp_attendance.emp_date = ?;",
        [ prev_date.getFullYear() + '-' + parseInt(prev_date.getMonth() + 1) + '-' + prev_date.getDate() ],
        ( err, rslt ) => {

            if( err )
            {

                console.log( err );

            }else 
            {
                
                let phrases = [ 
                    "We discovered you were *absent* yesterday. Kindly send a leave request now on the portal, just log in to your account at https://182.180.190.108:3443" ,
                    "We found you were *absent* yesterday. Kindly send a leave request now on the portal, just log in to your account at https://182.180.190.108:3443",
                    "We discovered you were *absent* yesterday. Please send a leave request now on the portal by logging in to your account at https://182.180.190.108:3443.",
                    "We discovered you were *absent* the day before. Please send a leave request now on the portal by logging in to your account at https://182.180.190.108:3443.",
                    "You were *absent* yesterday, we discovered. Please send a leave request now on the portal by logging in to your account at https://182.180.190.108:3443."
                ]
                for ( let x = 0; x < rslt.length; x++ )
                {
                    if ( parseInt(rslt[x].whatsapp_notifications) === 1 )
                    {
                        SendWhatsappNotification( null, null, "Hi " + rslt[x].name, phrases[Math.floor(Math.random() * phrases.length)], rslt[x].cell );
                    }
                }

            }

        }
    )
}

function reminder_on_absent_more_than_1_day()
{
    var prev_date = new Date();
    prev_date.setDate(prev_date.getDate() - 1);
    
    var prev_date2 = new Date();
    prev_date2.setDate(prev_date2.getDate() - 4);

    db.query(
        "SELECT \
        emp_attendance.*, \
        `employees`.`cell`, \
        `employees`.`name` \
        FROM emp_attendance \
        LEFT OUTER JOIN employees ON emp_attendance.emp_id = employees.emp_id \
        WHERE emp_attendance.status = 'Absent' \
        AND emp_attendance.emp_date BETWEEN ? AND ?;",
        [
            prev_date2.getFullYear() + '-' + parseInt(prev_date2.getMonth() + 1) + '-' + prev_date2.getDate(),
            prev_date.getFullYear() + '-' + parseInt(prev_date.getMonth() + 1) + '-' + prev_date.getDate()
        ],
        ( err, rslt ) => {

            if( err )
            {

                console.log( err );

            }else 
            {

                let arr_for_1_day = [];
                let arr_for_2_days = [];
                let arr_for_3_days = [];
                let arr_for_4_days = [];
                for ( let x = 0; x < rslt.length; x++ )
                {
                    if ( arr_for_1_day.includes(rslt[x].emp_id) )
                    {
                        if ( arr_for_2_days.includes(rslt[x].emp_id) )
                        {
                            if ( arr_for_3_days.includes(rslt[x].emp_id) )
                            {
                                arr_for_4_days.push(rslt[x].emp_id)
                            }else
                            {
                                arr_for_3_days.push(rslt[x].emp_id)
                            }
                        }else
                        {
                            arr_for_2_days.push(rslt[x].emp_id)
                        }
                    }else
                    {
                        arr_for_1_day.push(rslt[x].emp_id)
                    }
                }
                mark_2_days( arr_for_2_days );
                mark_3_days( arr_for_2_days, arr_for_3_days );
                mark_4_days( arr_for_2_days, arr_for_3_days, arr_for_4_days );

            }

        }
    )

    function mark_2_days( arr_for_2_days )
    {
        for ( let a = 0; a < arr_for_2_days.length; a++ )
        {
            db.query(
                "SELECT \
                `employees`.`cell`, \
                `employees`.`name` \
                FROM employees \
                WHERE employees.emp_id = ?;",
                [ arr_for_2_days[a] ],
                ( err, rslt_for_2_days ) => {
        
                    if( err )
                    {
        
                        console.log( err );
        
                    }else 
                    {
                        let phrases_for_2_day = [ 
                            "We found you are continuous *absent* for 2 days, kindly apply for a leave request on the portal at http://192.168.100.14:3443." ,
                            "We discovered you have been continuously *absent* for two days; please submit a leave request via the portal at http://192.168.100.14:3443.",
                            "We found you are continuous *absent* for 2 days, kindly apply for a leave request on the portal at http://192.168.100.14:3443",
                            "We discovered you have been continuously *absent* for two days; please apply for a leave request via the portal at http://192.168.100.14:3443.",
                            "We discovered you have been continuously *absent* for two days; please submit a leave request via the portal at http://192.168.100.14:3443."
                        ];
                        for ( let ax = 0; ax < rslt_for_2_days.length; ax++ )
                        {
                            SendWhatsappNotification( null, null, "Hi " + rslt_for_2_days[ax].name, phrases_for_2_day[Math.floor(Math.random() * phrases_for_2_day.length)], rslt_for_2_days[ax].cell );
                        }

                    }
        
                }
            )
        }
    }
    function mark_3_days( arr_for_2_days, arr_for_3_days )
    {
        for ( let a = 0; a < arr_for_2_days.length; a++ )
        {
            db.query(
                "SELECT \
                `employees`.`cell`, \
                `employees`.`name` \
                FROM employees \
                WHERE employees.emp_id = ?;",
                [ arr_for_2_days[a] ],
                ( err, rslt_for_2_days ) => {
        
                    if( err )
                    {
        
                        console.log( err );
        
                    }else 
                    {
                        for ( let ax = 0; ax < rslt_for_2_days.length; ax++ )
                        {
                            for ( let b = 0; b < arr_for_3_days.length; b++ )
                            {
                                db.query(
                                    "SELECT  \
                                    `employees`.`cell`,  \
                                    `employees`.`name`  \
                                    FROM employees  \
                                    LEFT OUTER JOIN tbl_er ON employees.emp_id = tbl_er.sr \
                                    WHERE tbl_er.jr = ? AND tbl_er.priority = 1;",
                                    [ arr_for_3_days[b] ],
                                    ( err, rslt_for_3_days ) => {
                            
                                        if( err )
                                        {
                            
                                            console.log( err );
                            
                                        }else 
                                        {
                                            for ( let ay = 0; ay < rslt_for_3_days.length; ay++ )
                                            {
                                                let phrases_for_3_day = [ 
                                                    `We found that ${ rslt_for_2_days[ax].name } is *absent* for two days, kindly find out why he/she is *absent* without giving any notification.` ,
                                                    `We discovered that ${ rslt_for_2_days[ax].name } has been *absent* for two days; please investigate why he/she has been *absent* without notification.`,
                                                    `We found that ${ rslt_for_2_days[ax].name } is *absent* for two days, kindly find out why he/she is *absent* without giving any notification.`,
                                                    `We discovered that ${ rslt_for_2_days[ax].name } has been missing for two days; please investigate why he/she has been *absent* without notification.`,
                                                    `We found that ${ rslt_for_2_days[ax].name } is *absent* for two days, kindly find out why he/she is *absent* without giving any notification`
                                                ];
                                                SendWhatsappNotification( null, null, "Hi " + rslt_for_3_days[ay].name, phrases_for_3_day[Math.floor(Math.random() * phrases_for_3_day.length)], rslt_for_3_days[ay].cell );
                                                
                                            }

                                        }
                            
                                    }
                                )
                            }
                        }

                    }
        
                }
            )
        }
    }
    function mark_4_days( arr_for_2_days, arr_for_3_days, arr_for_4_days )
    {
        for ( let a = 0; a < arr_for_2_days.length; a++ )
        {
            db.query(
                "SELECT \
                `employees`.`cell`, \
                `employees`.`name` \
                FROM employees \
                WHERE employees.emp_id = ?;",
                [ arr_for_2_days[a] ],
                ( err, rslt_for_2_days ) => {
        
                    if( err )
                    {
        
                        console.log( err );
        
                    }else 
                    {
                        for ( let ax = 0; ax < rslt_for_2_days.length; ax++ )
                        {
                            for ( let b = 0; b < arr_for_3_days.length; b++ )
                            {
                                db.query(
                                    "SELECT  \
                                    `employees`.`cell`,  \
                                    `employees`.`name`  \
                                    FROM employees  \
                                    LEFT OUTER JOIN tbl_er ON employees.emp_id = tbl_er.sr \
                                    WHERE tbl_er.jr = ? AND tbl_er.priority = 1;",
                                    [ arr_for_3_days[b] ],
                                    ( err, rslt_for_3_days ) => {
                            
                                        if( err )
                                        {
                            
                                            console.log( err );
                            
                                        }else 
                                        {
                                            for ( let ay = 0; ay < rslt_for_3_days.length; ay++ )
                                            {
                                                for ( let c = 0; c < arr_for_4_days.length; c++ )
                                                    {
                                                        db.query(
                                                            "SELECT  \
                                                            `employees`.`cell`,  \
                                                            `employees`.`name`  \
                                                            FROM employees  \
                                                            LEFT OUTER JOIN tbl_er ON employees.emp_id = tbl_er.sr \
                                                            WHERE tbl_er.jr = ? AND tbl_er.priority = 2;",
                                                            [ arr_for_4_days[c] ],
                                                            ( err, rslt_for_4_days ) => {
                                                    
                                                                if( err )
                                                                {
                                                    
                                                                    console.log( err );
                                                    
                                                                }else 
                                                                {
                                                                    for ( let az = 0; az < rslt_for_4_days.length; az++ )
                                                                    {
                                                                        let phrases_for_4_day = [ 
                                                                            `We found that ${ rslt_for_2_days[ax].name } is absent for three days, Also ${ rslt_for_3_days[ay].name } was notified by the system yesterday, kindly find out why he is absent without giving any notification.` ,
                                                                            `We discovered that ${ rslt_for_2_days[ax].name } has been absent for three days. ${ rslt_for_3_days[ay].name } was also notified by the system yesterday; please investigate why he has been absent without notification.`,
                                                                            `We found that ${ rslt_for_2_days[ax].name } is absent for three days, Also ${ rslt_for_3_days[ay].name } was notified by the system yesterday, kindly find out why he is absent without giving any notification.`,
                                                                            `We discovered that ${ rslt_for_2_days[ax].name } has been missing for three days. ${ rslt_for_3_days[ay].name } was also notified by the system yesterday; please investigate why he has been absent without notification.`,
                                                                            `We discovered that ${ rslt_for_2_days[ax].name } has been absent for three days. ${ rslt_for_3_days[ay].name } was also notified by the system yesterday; please investigate why he has been absent without notification.`
                                                                        ];
                                                                        SendWhatsappNotification( null, null, "Hi " + rslt_for_4_days[az].name, phrases_for_4_day[Math.floor(Math.random() * phrases_for_4_day.length)], rslt_for_4_days[az].cell );
                                                                    }
                                                                }
                                                    
                                                            }
                                                        )
                                                    }
                                                
                                            }

                                        }
                            
                                    }
                                )
                            }
                        }

                    }
        
                }
            )
        }
    }
}

function reminder_for_approval_a_leave_request()
{
    db.query(
        "SELECT  \
        emp_leave_application_refs.*, \
        employees.cell, \
        employees.name \
        FROM `emp_leave_application_refs` \
        LEFT OUTER JOIN employees ON emp_leave_application_refs.received_by = employees.emp_id \
        WHERE emp_leave_application_refs.request_status = 'sent' AND CURRENT_TIME() > ADDTIME(emp_leave_application_refs.requested_time, '1000');",
        ( err, rslt ) => {

            if( err )
            {

                console.log( err );

            }else 
            {
                
                let phrases = [ 
                    "There is a leave request pending at your side for approval. Kindly view that leave request, just log in to your account at http://192.168.100.14:3443",
                    "A leave request is awaiting approval on your end. Log in to your account at http://192.168.100.14:3443 to view that leave request.",
                    "There is a leave request pending at your side for approval. Log in to your account at http://192.168.100.14:3443 to view that leave request.",
                    "There is a leave request pending at your side for approval. Please review that leave request by logging in to your account at http://192.168.100.14:3443.",
                    "There is a leave request awaiting approval on your end. Kindly view that leave request, just log in to your account at http://192.168.100.14:3443"
                ]
                for ( let x = 0; x < rslt.length; x++ )
                {
                    SendWhatsappNotification( null, null, "Hi " + rslt[x].name, phrases[Math.floor(Math.random() * phrases.length)], rslt[x].cell );
                }

            }

        }
    )
}

function reminder_for_authorize_a_leave_request()
{
    db.query(
        "SELECT  \
        emp_leave_application_refs.*, \
        employees.cell, \
        employees.name \
        FROM `emp_leave_application_refs` \
        LEFT OUTER JOIN employees ON emp_leave_application_refs.authorized_to = employees.emp_id \
        WHERE emp_leave_application_refs.request_status = 'Accepted' AND CURRENT_TIME() > ADDTIME(emp_leave_application_refs.approval_time, '1000');",
        ( err, rslt ) => {

            if( err )
            {

                console.log( err );

            }else 
            {
                
                let phrases = [ 
                    "There is a leave request pending at your side for approval. Kindly view that leave request, just log in to your account at http://192.168.100.14:3443",
                    "A leave request is awaiting approval on your end. Log in to your account at http://192.168.100.14:3443 to view that leave request.",
                    "There is a leave request pending at your side for approval. Log in to your account at http://192.168.100.14:3443 to view that leave request.",
                    "There is a leave request pending at your side for approval. Please review that leave request by logging in to your account at http://192.168.100.14:3443.",
                    "There is a leave request awaiting approval on your end. Kindly view that leave request, just log in to your account at http://192.168.100.14:3443"
                ]
                for ( let x = 0; x < rslt.length; x++ )
                {
                    SendWhatsappNotification( null, null, "Hi " + rslt[x].name, phrases[Math.floor(Math.random() * phrases.length)], rslt[x].cell );
                }

            }

        }
    )
}

function reminder_for_approval_a_short_leave_request()
{
    db.query(
        "SELECT  \
        emp_short_leave_application_refs.*, \
        employees.cell, \
        employees.name \
        FROM `emp_short_leave_application_refs` \
        LEFT OUTER JOIN employees ON emp_short_leave_application_refs.received_by = employees.emp_id \
        WHERE emp_short_leave_application_refs.request_status = 'sent' AND CURRENT_TIME() > ADDTIME(emp_short_leave_application_refs.requested_time, '1000');",
        ( err, rslt ) => {

            if( err )
            {

                console.log( err );

            }else 
            {
                
                let phrases = [ 
                    "There is a short leave pending at your side for approval. Kindly view that short leave, just log in to your account at http://192.168.100.14:3443",
                    "A short leave is awaiting approval on your end. Log in to your account at http://192.168.100.14:3443 to view that short leave.",
                    "There is a short leave pending at your side for approval. Log in to your account at http://192.168.100.14:3443 to view that short leave.",
                    "There is a short leave pending at your side for approval. Please review that short leave by logging in to your account at http://192.168.100.14:3443.",
                    "There is a short leave awaiting approval on your end. Kindly view that short leave, just log in to your account at http://192.168.100.14:3443"
                ]
                for ( let x = 0; x < rslt.length; x++ )
                {
                    SendWhatsappNotification( null, null, "Hi " + rslt[x].name, phrases[Math.floor(Math.random() * phrases.length)], rslt[x].cell );
                }

            }

        }
    )
}

function reminder_for_authorize_a_short_leave_request()
{
    db.query(
        "SELECT  \
        emp_short_leave_application_refs.*, \
        employees.cell, \
        employees.name \
        FROM `emp_short_leave_application_refs` \
        LEFT OUTER JOIN employees ON emp_short_leave_application_refs.authorized_to = employees.emp_id \
        WHERE emp_short_leave_application_refs.request_status = 'Accepted' AND CURRENT_TIME() > ADDTIME(emp_short_leave_application_refs.approval_time, '1000');",
        ( err, rslt ) => {

            if( err )
            {

                console.log( err );

            }else 
            {
                
                let phrases = [ 
                    "There is a short leave pending at your side for approval. Kindly view that short leave, just log in to your account at http://192.168.100.14:3443",
                    "A short leave is awaiting approval on your end. Log in to your account at http://192.168.100.14:3443 to view that short leave.",
                    "There is a short leave pending at your side for approval. Log in to your account at http://192.168.100.14:3443 to view that short leave.",
                    "There is a short leave pending at your side for approval. Please review that short leave by logging in to your account at http://192.168.100.14:3443.",
                    "There is a short leave awaiting approval on your end. Kindly view that short leave, just log in to your account at http://192.168.100.14:3443"
                ]
                for ( let x = 0; x < rslt.length; x++ )
                {
                    SendWhatsappNotification( null, null, "Hi " + rslt[x].name, phrases[Math.floor(Math.random() * phrases.length)], rslt[x].cell );
                }

            }

        }
    )
}

function password_reset()
{
    let phrases = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','1','2','3','4','5','6','7','8','9','0'];

    db.query(
        "SELECT emp_id, cell, name FROM employees WHERE company_code = 10 AND location_code = 4;",
        ( err, rslt ) => {

            if( err )
            {

                console.log( err );

            }else 
            {
                
                for ( let z = 0; z < rslt.length; z++ )
                {
                    console.log( 'Credentials Updating...' );

                    let login_id = phrases[Math.floor(Math.random() * phrases.length)] + phrases[Math.floor(Math.random() * phrases.length)] + phrases[Math.floor(Math.random() * phrases.length)] + phrases[Math.floor(Math.random() * phrases.length)] + phrases[Math.floor(Math.random() * phrases.length)] + phrases[Math.floor(Math.random() * phrases.length)];
                    let password = phrases[Math.floor(Math.random() * phrases.length)] + phrases[Math.floor(Math.random() * phrases.length)] + phrases[Math.floor(Math.random() * phrases.length)] + phrases[Math.floor(Math.random() * phrases.length)] + phrases[Math.floor(Math.random() * phrases.length)] + phrases[Math.floor(Math.random() * phrases.length)];

                    db.query(
                        "UPDATE emp_app_profile SET login_id = ?, emp_password = ? WHERE emp_id = ?;",
                        [ encryptor.encrypt( login_id ), encryptor.encrypt( password ), rslt[z].emp_id ],
                        ( err ) => {
                
                            if( err )
                            {
                
                                console.log( err );
                
                            }else 
                            {
                                console.log( 'login_id: ', login_id );
                                console.log( 'password: ', password );
                                SendWhatsappNotification( null, null, "Hi " + rslt[z].name, "Your login id and password has been changed, your new login_id is '" + login_id + "' and password is '" + password + "'. Kindly login to http://portal.seaboard.pk and change you credentials first.", rslt[z].cell );
                
                            }
                
                        }
                    )
                }

            }

        }
    )
}

function updateSpecificationsInPR()
{

    db.query(
        "SELECT pr_id FROM `tbl_inventory_purchase_requisition`;",
        ( err, rslt ) => {

            if( err )
            {

                console.log( err );

            }else 
            {
                
                let limit = rslt.length;
                let count = [];
                function getSpecifications()
                {
                    db.query(
                        "SELECT description FROM `tbl_inventory_purchase_requisition_specifications` WHERE pr_id = ?;",
                        [ rslt[count.length].pr_id ],
                        ( err, spec ) => {
                            if( err )
                            {
                                console.log(err);
                            }else
                            {
                                if ( ( count.length + 1 ) === limit )
                                {
                                    console.log( "All PR Updated" );
                                }else
                                {
                                    let arr_specifications_names = []; 
                                    for ( let x = 0; x < spec.length; x++ )
                                    {
                                        arr_specifications_names.push(spec[x].description);
                                    }
                                    db.query(
                                        "UPDATE tbl_inventory_purchase_requisition SET specifications = ? WHERE pr_id = ?;",
                                        [ arr_specifications_names.join(', '), rslt[count.length].pr_id ],
                                        ( err, updateRslt ) => {
                                            if( err )
                                            {
                                                console.log(err);
                                            }else
                                            {
                                                console.log(updateRslt);
                                                count.push(1);
                                                getSpecifications();
                                            }
                                        }
                                    )
                                }
                            }
                        }
                    )
                }
                getSpecifications();

            }

        }
    )
}

function updateSpecificationsInPO()
{

    db.query(
        "SELECT po_id FROM `tbl_inventory_purchase_order`;",
        ( err, rslt ) => {

            if( err )
            {

                console.log( err );

            }else 
            {
                
                let limit = rslt.length;
                let count = [];
                function getSpecifications()
                {
                    db.query(
                        "SELECT description FROM `tbl_inventory_purchase_order_specifications` WHERE po_id = ?;",
                        [ rslt[count.length].po_id ],
                        ( err, spec ) => {
                            if( err )
                            {
                                console.log(err);
                            }else
                            {
                                if ( ( count.length + 1 ) === limit )
                                {
                                    console.log( "All PO Updated" );
                                }else
                                {
                                    let arr_specifications_names = []; 
                                    for ( let x = 0; x < spec.length; x++ )
                                    {
                                        arr_specifications_names.push(spec[x].description);
                                    }
                                    db.query(
                                        "UPDATE tbl_inventory_purchase_order SET specifications = ? WHERE po_id = ?;",
                                        [ arr_specifications_names.join(', '), rslt[count.length].po_id ],
                                        ( err, updateRslt ) => {
                                            if( err )
                                            {
                                                console.log(err);
                                            }else
                                            {
                                                console.log(updateRslt);
                                                count.push(1);
                                                getSpecifications();
                                            }
                                        }
                                    )
                                }
                            }
                        }
                    )
                }
                getSpecifications();

            }

        }
    )
}

function correctStoredQuantityInProducts()
{

    db.query(
        "SELECT product_id, quantity FROM `tbl_inventory_products`;",
        ( err, rslt ) => {

            if( err )
            {

                console.log( err );

            }else 
            {
                
                let limit = rslt.length;
                let count = [];
                function getInwards()
                {
                    db.query(
                        "SELECT transaction_id, stored_quantity FROM `tbl_inventory_product_transactions` WHERE product_id = ? AND entry = ?;",
                        [ rslt[count.length].product_id, 'inward' ],
                        ( err, inwards ) => {
                            if( err )
                            {
                                console.log(err);
                            }else
                            {
                                if ( ( count.length + 1 ) === limit )
                                {
                                    console.log( "All Products Updated" );
                                }else
                                {
                                    let total_stored_quantity = 0;
                                    for ( let x = 0; x < inwards.length; x++ )
                                    {
                                        total_stored_quantity = total_stored_quantity + inwards[x].stored_quantity;
                                    }
                                    db.query(
                                        "UPDATE tbl_inventory_products SET quantity = ? WHERE product_id = ?;",
                                        [ total_stored_quantity, rslt[count.length].product_id ],
                                        ( err, updateRslt ) => {
                                            if( err )
                                            {
                                                console.log(err);
                                            }else
                                            {
                                                console.log(updateRslt);
                                                count.push(1);
                                                getInwards();
                                            }
                                        }
                                    )
                                }
                            }
                        }
                    )
                }
                getInwards();

            }

        }
    )
}

function giveAnAccessToAll(newAccess) {
    db.query(
        "SELECT emp_id, access FROM `employees` WHERE emp_status = 'Active' AND access IS NOT NULL AND location_code = 4 AND company_code = 10;",
        ( err, rslt ) => {
            if( err )
            {
                console.log( err );
            }else 
            {
                let Limit = rslt.length;
                let count = [];
                function updateAccess()
                {
                    const arr = JSON.parse(rslt[count.length].access);
                    let exists = arr.filter(val => parseInt(val) === parseInt(newAccess));
                    if ( !exists[0] )
                    {
                        arr.push(parseInt(newAccess));
                    }
                    db.query(
                        "UPDATE employees SET access = ? WHERE emp_id = ?;",
                        [ JSON.stringify(arr.sort()), rslt[count.length].emp_id],
                        ( err ) => {
                            if( err )
                            {
                                console.log( err );
                                res.send( err );
                                res.end();
                            }else
                            {
                                if ( ( count.length + 1 ) === Limit )
                                {
                                    console.log( "Access Updated" );
                                }else
                                {
                                    count.push(1);
                                    updateAccess();
                                }
                            }
                        }
                    );
                }
                updateAccess();
            }

        }
    )
}

function makeSeriesPO(company_code, start_series_code, series_year)
{
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
                            "SELECT * FROM `tbl_inventory_purchase_order` WHERE company_code = ? AND series_year = ? AND series_code IS NOT NULL ORDER BY po_id ASC;",
                            [ company_code, series_year ],
                            ( err, rslt ) => {
                    
                                if( err )
                                {
                                    connection.rollback(() => {console.log(err);connection.release();});
                                    res.send('err');
                                    res.end();
                                }else 
                                {
                                    let series_start = parseInt(start_series_code);
                                    let Limit = rslt.length;
                                    let count = [];
                                    function updateSeries()
                                    {
                                        connection.query(
                                            "UPDATE tbl_inventory_purchase_order SET series_code = ? WHERE company_code = ? AND po_id = ?;",
                                            [series_start, company_code, rslt[count.length].po_id],
                                            ( err ) => {
                                                if( err )
                                                {
                                                    connection.rollback(() => {console.log(err);connection.release();});
                                                    res.send('err');
                                                    res.end();
                                                }else
                                                {
                                                    if ( ( count.length + 1 ) === Limit )
                                                    {
                                                        connection.commit((err) => {
                                                            if ( err ) {
                                                                connection.rollback(() => {console.log(err);connection.release();});
                                                            }else
                                                            {
                                                                connection.release();
                                                                console.log("Series updated\nCompany Code:", company_code);
                                                            }
                                                        });
                                                    }else
                                                    {
                                                        count.push(1);
                                                        series_start = series_start + 1;
                                                        updateSeries();
                                                    }
                                                }
                                            }
                                        );
                                    }
                                    if ( rslt.length > 0 )
                                    {
                                        updateSeries();
                                    }
                                }
                                
                            }
                        );
                    }
                }
            )
        }
    )
}

// makeSeriesPO(10, 217, '22/23');

// giveAnAccessToAll(10);

// updateSpecificationsInPO();

// setTimeout(() => {
//     password_reset();
// }, 1000 * 30);

// setInterval(() => {
//     reminder_on_absent_more_than_1_day();
// }, ( 1000 * 60 ) * 150);

setInterval(() => {

    reminder_on_absent_for_leave();
    
}, ( 1000 * 60 ) * 700);

// setInterval(() => {

//     reminder_for_approval_a_short_leave_request();
//     reminder_for_approval_a_leave_request();
    
// }, ( 1000 * 60 ) * 125);

// setInterval(() => {

//     reminder_for_authorize_a_short_leave_request();
//     reminder_for_authorize_a_leave_request();
    
// }, ( 1000 * 60 ) * 127);

module.exports = {
    router: router,
    correctStoredQuantityInProducts: () => correctStoredQuantityInProducts()
};