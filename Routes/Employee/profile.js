const express = require('express');
const router = express.Router();
const db = require('../../db/connection');

router.post('/updateprofile', ( req, res ) => {

    const { 
        emp_id,
        residential_address,
        emergency_person_name,
        emergency_person_number,
        landline,
        cell,
        email,
        login_id,
        emp_password,
        CVName,
        PRFName
    } = req.body;
    const d = new Date();

    db.query(
        "UPDATE employees SET residential_address = ?, emergency_person_name = ?, emergency_person_number = ?, landline = ?, cell = ?, email = ? WHERE emp_id = ?;" +
        "UPDATE emp_app_profile SET login_id = ?, emp_password = ? WHERE emp_id = ?;",
        [residential_address, emergency_person_name, emergency_person_number, landline, cell, email, emp_id, login_id, emp_password, emp_id],
        ( err ) => {

            if( err )
            {

                console.log( err );
                res.status(500).send(err);
                res.end();

            }else 
            {

                if ( req.files )
                {
                    const { CV, PRF } = req.files;
                    let q = "";
                    let pera = [];

                    if ( CV )
                    {
                        q = q.concat("UPDATE emp_cv SET cv = ? WHERE emp_id = ?;");
                        pera.push(CVName + '.' + CV.name.split('.').pop());
                        pera.push(emp_id);
                        CV.mv('client/images/documents/cv/' + CVName + '.' + CV.name.split('.').pop(), (err) => {
            
                            if (err) {
                    
                                res.status(500).send(err);
                                res.end();
                    
                            }
                    
                        });
                    }
                    if ( PRF )
                    {
                        q = q.concat("UPDATE emp_prf_address SET proof_of_address = ? WHERE emp_id = ?;");
                        pera.push(PRFName + '.' + PRF.name.split('.').pop());
                        pera.push(emp_id);
                        PRF.mv('client/images/documents/address/' + PRFName + '.' + PRF.name.split('.').pop(), (err) => {
            
                            if (err) {
                    
                                res.status(500).send(err);
                                res.end();
                    
                            }
                    
                        });
                    }
                    db.query(
                        q,
                        pera,
                        ( err ) => {
                
                            if( err )
                            {
                
                                console.log( err );
                                res.status(500).send(err);
                                res.end();
                
                            }else 
                            {
                
                                
                                res.send('success');
                                res.end();
                
                            }
                
                        }
                    )
                }else
                {
                    res.send( 'success' );
                    res.end();
                }

            }

        }
    )

} );

router.post('/dashboard/data/pendings/leaves', ( req, res ) => {

    const { user, emp_id, leave_type } = req.body;

    const userRequests = () => {
        let leave_query = "SELECT COUNT(id) AS sent FROM `emp_leave_application_refs` WHERE requested_by = ?;" + "SELECT COUNT(id) AS received FROM `emp_leave_application_refs` WHERE received_by = ? OR approved_by = ? OR handle_by = ? OR authorized_to = ? OR authorized_by = ?;";
        if ( leave_type === 'short leaves' )
        {
            leave_query = "SELECT COUNT(id) AS sent FROM `emp_short_leave_application_refs` WHERE requested_by = ?;" + "SELECT COUNT(id) AS received FROM `emp_short_leave_application_refs` WHERE received_by = ? OR approved_by = ? OR handle_by = ? OR authorized_to = ? OR authorized_by = ?;";
        }
        
        db.query(
            leave_query,
            [ emp_id, emp_id, emp_id, emp_id, emp_id, emp_id ],
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
    }

    if ( user === 1 )
    {
        userRequests();
    }else
    {
        allRequests();
    }

} );

router.post('/dashboard/data/pendings/leaves/chart', ( req, res ) => {

    const { user, emp_id, leave_type } = req.body;

    const userRequests = () => {
        let leave_query = "SELECT COUNT(emp_leave_application_refs.id) AS counting, emp_leave_application_refs.request_status, emp_leave_applications.leave_type FROM emp_leave_application_refs LEFT OUTER JOIN emp_leave_applications ON emp_leave_application_refs.leave_id = emp_leave_applications.leave_id WHERE emp_leave_application_refs.requested_by = ? GROUP BY emp_leave_application_refs.request_status ORDER BY emp_leave_application_refs.request_status; \
        SELECT COUNT(emp_leave_application_refs.id) AS counting, emp_leave_application_refs.request_status, emp_leave_applications.leave_type FROM emp_leave_application_refs LEFT OUTER JOIN emp_leave_applications ON emp_leave_application_refs.leave_id = emp_leave_applications.leave_id WHERE emp_leave_application_refs.received_by = ? OR emp_leave_application_refs.approved_by = ? OR emp_leave_application_refs.handle_by = ? OR emp_leave_application_refs.authorized_to = ? OR emp_leave_application_refs.authorized_by = ? GROUP BY emp_leave_application_refs.request_status ORDER BY emp_leave_application_refs.request_status;";
        if ( leave_type === 'short leaves' )
        {
            leave_query = "SELECT COUNT(emp_short_leave_application_refs.id) AS counting, emp_short_leave_application_refs.request_status FROM emp_short_leave_application_refs LEFT OUTER JOIN emp_short_leave_applications ON emp_short_leave_application_refs.leave_id = emp_short_leave_applications.leave_id WHERE emp_short_leave_application_refs.requested_by = ? GROUP BY emp_short_leave_application_refs.request_status ORDER BY emp_short_leave_application_refs.request_status; \
            SELECT COUNT(emp_short_leave_application_refs.id) AS counting, emp_short_leave_application_refs.request_status FROM emp_short_leave_application_refs LEFT OUTER JOIN emp_short_leave_applications ON emp_short_leave_application_refs.leave_id = emp_short_leave_applications.leave_id WHERE emp_short_leave_application_refs.received_by = ? OR emp_short_leave_application_refs.approved_by = ? OR emp_short_leave_application_refs.handle_by = ? OR emp_short_leave_application_refs.authorized_to = ? OR emp_short_leave_application_refs.authorized_by = ? GROUP BY emp_short_leave_application_refs.request_status ORDER BY emp_short_leave_application_refs.request_status;";
        }
        
        db.query(
            leave_query,
            [ emp_id, emp_id, emp_id, emp_id, emp_id, emp_id ],
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
    }

    if ( user === 1 )
    {
        userRequests();
    }else
    {
        allRequests();
    }

} );

router.post('/dashboard/home/data', ( req, res ) => {

    const { emp_id } = req.body;
    const date = new Date().toISOString().slice(0, 10).replace('T', ' ');
    const month = new Date().getMonth() + 1;
    const year = new Date().getFullYear();

    // DATEDIFF(CURDATE(), db_cash_receipts.submit_date) <= 180
    // DATEDIFF(CURDATE(), db_cash_receipts.submit_date) <= 180

    db.query(
        "SELECT COUNT(db_cash_receipts.id) AS no_of_requests, SUM(db_cash_receipts.amount) AS amount, MONTH(db_cash_receipts.submit_date) AS month FROM db_cash_receipts WHERE db_cash_receipts.status != 'cleared' AND db_cash_receipts.status != 'cancelled' AND db_cash_receipts.status != 'rejected' AND db_cash_receipts.status = 'approved' AND YEAR(db_cash_receipts.submit_date) = ? GROUP BY MONTH(db_cash_receipts.submit_date);" +
        "SELECT COUNT(db_cash_receipts.id) AS no_of_requests, SUM(db_cash_receipts.amount) AS amount, MONTH(db_cash_receipts.submit_date) AS month FROM db_cash_receipts WHERE db_cash_receipts.status = 'cleared' AND YEAR(db_cash_receipts.submit_date) = ? GROUP BY MONTH(db_cash_receipts.submit_date);" +

        "SELECT  \
        db_cash_balance.*, \
        employees.name, \
        designations.designation_name, \
        companies.company_name, \
        emp_app_profile.emp_image \
        FROM `db_cash_balance`  \
        LEFT OUTER JOIN employees ON db_cash_balance.emp_id = employees.emp_id \
        LEFT OUTER JOIN designations ON employees.designation_code = designations.designation_code \
        LEFT OUTER JOIN companies ON employees.company_code = companies.company_code \
        LEFT OUTER JOIN emp_app_profile ON employees.emp_id = emp_app_profile.emp_id \
        ORDER BY balance DESC;" +
        
        "SELECT DISTINCT employees.emp_id, employees.name, companies.company_name   \
        FROM employees   \
        LEFT OUTER JOIN emp_attendance ON employees.emp_id = emp_attendance.emp_id   \
        LEFT OUTER JOIN emp_props ON employees.emp_id = emp_props.emp_id   \
        LEFT OUTER JOIN companies ON employees.company_code = companies.company_code   \
        WHERE employees.emp_id in   \
        (SELECT DISTINCT employees.emp_id FROM employees LEFT OUTER JOIN emp_attendance ON employees.emp_id = emp_attendance.emp_id WHERE emp_attendance.status = 'Absent' AND subdate(current_date, 1)) AND   \
        employees.emp_status = 'Active' AND emp_props.attendance_enable = 1;" +
        
        "SELECT * FROM `emp_attendance` WHERE emp_date = ? AND emp_id = ?;" +
        "SELECT COUNT(id) AS count, status FROM `emp_attendance` WHERE MONTH(emp_date) = ? AND YEAR(emp_date) = ? AND emp_id = ? GROUP BY status;" +
        "SELECT emp_chats.*, sender.name AS sender, emp_app_profile.emp_image FROM `emp_chats` LEFT OUTER JOIN employees sender ON emp_chats.sender_id = sender.emp_id LEFT OUTER JOIN emp_app_profile ON sender.emp_id = emp_app_profile.emp_id WHERE emp_chats.receiver_id = ? ORDER BY emp_chats.id DESC;" +
        
        "SELECT COUNT(vender_id) AS count, verified FROM `tbl_inventory_venders` GROUP BY verified;",
        [ year, year, date, emp_id, month, year, emp_id, emp_id ],
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

router.get('/dashboard/home/advance_cash', ( req, res ) => {
    db.query(
        "SELECT COUNT(db_cash_receipts.id) AS no_of_requests, SUM(db_cash_receipts.amount) AS amount, MONTH(db_cash_receipts.submit_date) AS month, db_cash_receipts.status FROM db_cash_receipts WHERE YEAR(db_cash_receipts.submit_date) = ? GROUP BY MONTH(db_cash_receipts.submit_date), db_cash_receipts.status;",
        [ new Date().getFullYear() ],
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

router.post('/dashboard/home/monthly/attendance', ( req, res ) => {
    const { year } = req.body;
    db.query(
        "SELECT COUNT(emp_attendance.id) AS attendance, MONTH(emp_attendance.emp_date) AS month, emp_attendance.status AS status FROM emp_attendance WHERE YEAR(emp_attendance.emp_date) = ? AND ( emp_attendance.status = 'Absent' OR emp_attendance.status = 'Late' OR emp_attendance.status = 'leave' OR emp_attendance.status = 'Present' ) GROUP BY emp_attendance.status, MONTH(emp_attendance.emp_date);" +
        "SELECT COUNT(emp_attendance.id) AS total_attendance, MONTH(emp_attendance.emp_date) AS month FROM emp_attendance WHERE YEAR(emp_attendance.emp_date) = ? AND ( emp_attendance.status = 'Absent' OR emp_attendance.status = 'Late' OR emp_attendance.status = 'leave' OR emp_attendance.status = 'Present' ) GROUP BY MONTH(emp_attendance.emp_date);",
        [ year, year ],
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

router.post('/dashboard/home/monthly/purchases', ( req, res ) => {

    const { month, year } = req.body;

    db.query(
        "SELECT COUNT(tbl_inventory_purchase_order.total_value) AS amount, COUNT(tbl_inventory_purchase_order.po_id) AS count, tbl_inventory_purchase_order.requested_date, MONTH(tbl_inventory_purchase_order.requested_date) AS month, tbl_inventory_purchase_order.status AS status FROM tbl_inventory_purchase_order WHERE YEAR(tbl_inventory_purchase_order.requested_date) = ? AND MONTH(tbl_inventory_purchase_order.requested_date) = ? GROUP BY tbl_inventory_purchase_order.requested_date, tbl_inventory_purchase_order.status;",
        [ year, month ],
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

router.post('/dashboard/home/monthly/attendance/zero_lates', ( req, res ) => {

    const { month, year } = req.body;

    db.query(
        "SELECT DISTINCT employees.emp_id, employees.name, companies.company_name  \
        FROM employees  \
        LEFT OUTER JOIN emp_attendance ON employees.emp_id = emp_attendance.emp_id  \
        LEFT OUTER JOIN emp_props ON employees.emp_id = emp_props.emp_id  \
        LEFT OUTER JOIN companies ON employees.company_code = companies.company_code  \
        WHERE employees.emp_id not in  \
        (SELECT DISTINCT employees.emp_id FROM employees LEFT OUTER JOIN emp_attendance ON employees.emp_id = emp_attendance.emp_id WHERE emp_attendance.status = 'Late' AND MONTH(emp_attendance.emp_date) = ? AND YEAR(emp_attendance.emp_date) = ?) AND employees.emp_id not in  \
        (SELECT DISTINCT employees.emp_id FROM employees LEFT OUTER JOIN emp_attendance ON employees.emp_id = emp_attendance.emp_id WHERE emp_attendance.status = 'Absent' AND MONTH(emp_attendance.emp_date) = ? AND YEAR(emp_attendance.emp_date) = ?) AND employees.emp_id in  \
        (SELECT DISTINCT emp_attendance.emp_id FROM emp_attendance WHERE MONTH(emp_attendance.emp_date) = ? AND YEAR(emp_attendance.emp_date) = ?) AND  \
        employees.emp_status = 'Active' AND emp_props.attendance_enable = 1;",
        [ month, year, month, year, month, year ],
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

router.post('/dashboard/home/monthly/attendance/absents', ( req, res ) => {
    const { month, year } = req.body;
    db.query(
        "SELECT  \
        employees.emp_id,  \
        employees.name,  \
        companies.code, \
        COUNT(emp_attendance.status) AS absents \
        FROM employees   \
        LEFT OUTER JOIN emp_attendance ON employees.emp_id = emp_attendance.emp_id   \
        LEFT OUTER JOIN emp_props ON employees.emp_id = emp_props.emp_id   \
        LEFT OUTER JOIN companies ON employees.company_code = companies.company_code   \
        WHERE emp_attendance.status = 'Absent' AND MONTH(emp_attendance.emp_date) = ? AND YEAR(emp_attendance.emp_date) = ? AND employees.emp_status = 'Active' AND emp_props.attendance_enable = 1 \
        GROUP BY employees.emp_id;",
        [ month, year ],
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

// router.post('/dashboard/home/data', ( req, res ) => {

//     const { emp_id } = req.body;
//     const date = new Date().toISOString().slice(0, 10).replace('T', ' ');
//     const month = new Date().getMonth() + 1;
//     const year = new Date().getFullYear();

//     db.query(
//         "SELECT * FROM `emp_attendance` WHERE emp_date = ? AND emp_id = ?;" +
//         "SELECT COUNT(id) AS count, status FROM `emp_attendance` WHERE MONTH(emp_date) = ? AND YEAR(emp_date) = ? AND emp_id = ? GROUP BY status;" +
//         "SELECT emp_chats.*, sender.name AS sender, emp_app_profile.emp_image FROM `emp_chats` LEFT OUTER JOIN employees sender ON emp_chats.sender_id = sender.emp_id LEFT OUTER JOIN emp_app_profile ON sender.emp_id = emp_app_profile.emp_id WHERE emp_chats.receiver_id = ? ORDER BY emp_chats.id DESC;" +
        
//         "SELECT COUNT(product_id) AS total_products FROM `tbl_inventory_products`;" +
//         "SELECT SUM(quantity) AS total_inward_quantity, SUM(quantity*unit_price) AS total_inward_value, COUNT(transaction_id) AS total_inward_entries FROM `tbl_inventory_product_transactions` WHERE entry = 'inward';" +
//         "SELECT SUM(quantity) AS total_outward_quantity, SUM(quantity*unit_price) AS total_outward_value, COUNT(transaction_id) AS total_outward_entries FROM `tbl_inventory_product_transactions` WHERE entry = 'outward';" +
//         "SELECT SUM(stored_quantity) AS total_stored_quantity, SUM(stored_quantity*unit_price) AS total_stored_value FROM `tbl_inventory_product_transactions` WHERE entry = 'inward';" +
//         "SELECT product_id, name, quantity FROM `tbl_inventory_product_transactions` WHERE entry = 'inward' ORDER BY quantity DESC LIMIT 3;" +
//         "SELECT product_id, name, quantity FROM `tbl_inventory_product_transactions` WHERE entry = 'outward' ORDER BY quantity DESC LIMIT 3;" +
//         "SELECT COUNT(tbl_inventory_product_transactions.transaction_id) AS total_inward_entries, SUM(tbl_inventory_product_transactions.quantity) AS total_inward_quantity, SUM(tbl_inventory_product_transactions.stored_quantity) AS total_stored_quantity, SUM(tbl_inventory_product_transactions.unit_price*tbl_inventory_product_transactions.stored_quantity) AS current_value, tbl_inventory_products.product_type FROM `tbl_inventory_product_transactions` LEFT OUTER JOIN tbl_inventory_products ON tbl_inventory_product_transactions.product_id = tbl_inventory_products.product_id WHERE tbl_inventory_product_transactions.entry = 'inward' GROUP BY tbl_inventory_products.product_type;" +
//         "SELECT COUNT(transaction_id) AS total_issued, SUM(quantity) AS quantity_issued, SUM(unit_price*quantity) AS value_issued FROM `tbl_inventory_product_transactions` WHERE status = 'issued';" +
//         "SELECT COUNT(transaction_id) AS total_issued, SUM(quantity) AS quantity_issued, SUM(unit_price*quantity) AS value_issued FROM `tbl_inventory_product_transactions` WHERE status = 'signature pending';" +
//         "SELECT COUNT(transaction_id) AS total_entries, SUM(stored_quantity) AS quantity FROM `tbl_inventory_product_transactions` WHERE preview IS NULL AND entry = 'inward';" +
        
//         "SELECT COUNT(id) AS total_requests FROM `db_cash_receipts`;" +
//         "SELECT SUM(amount) AS total_amount_issued FROM `db_cash_receipts` WHERE receival_date IS NOT NULL OR status = 'approved' OR status = 'cleared' OR status = 'issued';" +
//         "SELECT SUM(amount) AS total_amount_collected FROM `db_cash_receipts` WHERE receival_date IS NOT NULL;" +
//         "SELECT SUM(amount) AS total_amount_not_collected FROM `db_cash_receipts` WHERE receival_date IS NULL AND status = 'approved';" + 
//         "SELECT SUM(amount) AS total_amount_pending FROM `db_cash_receipts` WHERE receival_date IS NOT NULL AND clearance_date IS NULL;" +
//         "SELECT SUM(amount) AS total_amount_cleared FROM `db_cash_receipts` WHERE receival_date IS NOT NULL AND clearance_date IS NOT NULL;" +
//         "SELECT  \
//         db_cash_balance.*, \
//         employees.name, \
//         designations.designation_name, \
//         companies.company_name, \
//         emp_app_profile.emp_image \
//         FROM `db_cash_balance`  \
//         LEFT OUTER JOIN employees ON db_cash_balance.emp_id = employees.emp_id \
//         LEFT OUTER JOIN designations ON employees.designation_code = designations.designation_code \
//         LEFT OUTER JOIN companies ON employees.company_code = companies.company_code \
//         LEFT OUTER JOIN emp_app_profile ON employees.emp_id = emp_app_profile.emp_id \
//         ORDER BY balance DESC;",
//         [ date, emp_id, month, year, emp_id, emp_id ],
//         ( err, rslt ) => {
//             if( err )
//             {
//                 console.log(err);
//                 res.status(500).send(err);
//                 res.end();
//             }else 
//             {
//                 res.send( rslt );
//                 res.end();
//             }

//         }
//     )

// } );

module.exports = router;