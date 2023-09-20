const express = require('express');
const router = express.Router();
const db = require('../../db/connection');

const CreateLogs = require('./logs').CreateLog;

router.post('/applyshortleave', (req, res) => {

    const { leave_time_from, leave_time_to, leave_date, note, request_to, request_by } = req.body;
    
    const d = new Date();

    db.query(
        "INSERT INTO `tbl_short_leaves`(`leave_time_from`, `leave_time_to`, `leave_date`, `note`, `request_by`, `request_time`, `request_date`, `request_to`) VALUES (?,?,?,?,?,?,?,?);" +
        "SELECT leave_id FROM tbl_short_leaves WHERE leave_time_from = ? AND leave_time_to = ? AND leave_date = ? AND note = ?",
        [ leave_time_from, leave_time_to, leave_date, note, request_by, d.toTimeString(), d, request_to, leave_time_from, leave_time_to, leave_date, note ],
        (err, rslt) => {

            if (err) {

                console.log( err );
                res.status(500).send(err);
                res.end();

            } else {

                CreateLogs( 
                    'tbl_short_leaves', 
                    rslt[1][0].leave_id,
                    "New short leave request generated",
                    'info',
                    'insert'
                );
                res.send('success');
                res.end();

            }

        }
    )

});

router.post('/getleaverequestdetail', (req, res) => {

    const { leave_id, type } = req.body;

    let tables = [];
    if ( type === 'Leave' )
    {
        tables = [ 'tbl_leave_application', 'tbl_leave_application_refs' ];
    }else
    {
        tables = [ 'tbl_short_leave_application', 'tbl_short_leave_application_refs' ];
    }

    db.query(
        "SELECT * FROM " + tables[0] + " WHERE leave_id = ?;" +
        "SELECT \
        tbl_leave_application_refs.*, \
        sender.name as sender_name, \
        receiver.name as receiver_name  \
        FROM tbl_leave_application_refs  \
        LEFT OUTER JOIN employees sender ON sender.emp_id = tbl_leave_application_refs.request_by  \
        LEFT OUTER JOIN employees receiver ON receiver.emp_id = tbl_leave_application_refs.request_to  \
        WHERE tbl_leave_application_refs.leave_id = ?;",
        [ leave_id, leave_id ],
        (err, rslt) => {

            if (err) {

                res.status(500).send(err);
                res.end();

            } else {

                db.query(
                    "SELECT \
                    employees.name, \
                    emp_app_profile.emp_image, \
                    designations.designation_name, \
                    departments.department_name, \
                    companies.company_name \
                    FROM employees \
                    LEFT OUTER JOIN emp_app_profile ON employees.emp_id = emp_app_profile.emp_id \
                    LEFT OUTER JOIN designations ON employees.designation_code = designations.designation_code \
                    LEFT OUTER JOIN departments ON employees.department_code = departments.department_code \
                    LEFT OUTER JOIN companies ON employees.company_code = companies.company_code \
                    WHERE employees.emp_id = ?;",
                    [ rslt[1][0].request_by ],
                    (err, rslt1) => {
            
                        if (err) {
            
                            res.status(500).send(err);
                            res.end();
            
                        } else {
            
                            rslt[2] = rslt1;
                            res.send(rslt);
                            res.end();
            
                        }
            
                    }
                )

            }

        }
    )

});

router.post('/performactiononleave', (req, res) => {

    const { leave_id, action, request_from, request_to, date_time } = req.body;

    let q = '';
    let parameters = [];
    const d =  new Date( date_time );
    if ( action === 'approve' )
    {
        q = "UPDATE tbl_leave_application_refs SET request_status = 'approved' WHERE leave_id = ? AND request_to = ?;";
        parameters.push(leave_id);
        parameters.push(request_to);
    }else
    if ( action === 'approve and forward' )
    {
        q = "UPDATE tbl_leave_application_refs SET request_status = 'approved' WHERE leave_id = ? AND request_to = ?;";
        parameters.push(leave_id);
        parameters.push(request_to);

        q = "INSERT INTO `tbl_leave_application_refs`(`leave_id`, `request_by`, `request_date`, `request_time`, `request_to`, `request_status`) VALUES (?,?,?,?,?,?);";
        parameters.push(leave_id);
        parameters.push(request_from);
        parameters.push( d );
        parameters.push( d.toTimeString() );
        parameters.push( request_to );
        parameters.push( 'sent' );
    }else
    if ( action === 'reject and forward' )
    {
        q = "UPDATE tbl_leave_application_refs SET request_status = 'reject' WHERE leave_id = ? AND request_to = ?;";
        parameters.push(leave_id);
        parameters.push(request_to);

        q = "INSERT INTO `tbl_leave_application_refs`(`leave_id`, `request_by`, `request_date`, `request_time`, `request_to`, `request_status`) VALUES (?,?,?,?,?,?);";
        parameters.push(leave_id);
        parameters.push(request_from);
        parameters.push( d );
        parameters.push( d.toTimeString() );
        parameters.push( request_to );
        parameters.push( 'sent' );
    }else
    if ( action === 'reject' )
    {
        q = "UPDATE tbl_leave_application_refs SET request_status = 'reject' WHERE leave_id = ? AND request_to = ?;";
        parameters.push(leave_id);
        parameters.push(request_to);
    }

    console.log( q );

    db.query(
        q,
        parameters,
        (err) => {

            if (err) {

                console.log( err );
                res.status(500).send(err);
                res.end();

            } else {

                res.send('success');
                res.end();

            }

        }
    )

});

router.post('/getallleavesrequests', (req, res) => {

    const { emp_id } = req.body;

    db.query(
        "SELECT  \
        sender.name as sender_name, \
        receiver.name as receiver_name, \
        emp_leave_application_refs.id, \
        emp_leave_application_refs.leave_id, \
        emp_leave_application_refs.request_status, \
        emp_leave_application_refs.requested_date \
        FROM `emp_leave_application_refs`  \
        LEFT OUTER JOIN employees sender ON sender.emp_id = emp_leave_application_refs.requested_by \
        LEFT OUTER JOIN employees receiver ON receiver.emp_id = emp_leave_application_refs.requested_to \
        WHERE requested_by = ? OR requested_to = ? ORDER BY emp_leave_application_refs.id DESC;",
        [ emp_id, emp_id ],
        (err, rslt) => {

            if (err) {

                res.status(500).send(err);
                res.end();

            } else {

                res.send(rslt);
                res.end();

            }

        }
    )
        
});

router.post('/getallshortleavesrequests', (req, res) => {

    const { emp_id } = req.body;

    db.query(
        "SELECT  \
        sender.name as sender_name, \
        receiver.name as receiver_name, \
        tbl_short_leave_application_refs.id, \
        tbl_short_leave_application_refs.leave_id, \
        tbl_short_leave_application_refs.request_status, \
        tbl_short_leave_application_refs.request_date \
        FROM `tbl_short_leave_application_refs`  \
        LEFT OUTER JOIN employees sender ON sender.emp_id = tbl_short_leave_application_refs.request_by \
        LEFT OUTER JOIN employees receiver ON receiver.emp_id = tbl_short_leave_application_refs.request_to \
        WHERE request_by = 500 OR request_to = 500 ORDER BY tbl_short_leave_application_refs.id DESC;",
        [ emp_id, emp_id ],
        (err, rslt) => {

            if (err) {

                res.status(500).send(err);
                res.end();

            } else {

                res.send(rslt);
                res.end();

            }

        }
    )
        
});

router.post('/getallavailedleaves', (req, res) => {

    const { empID } = req.body;

    db.getConnection(
        (err, connection) => {

            if (err) {

                res.status(503).send(err);
                res.end();

            } else {
                connection.query(
                    "SELECT \
                    employees.emp_id, \
                    emp_leave_application_refs.*, \
                    emp_leave_applications.* \
                    FROM employees \
                    RIGHT OUTER JOIN emp_leave_application_refs ON emp_leave_application_refs.requested_by = employees.emp_id \
                    LEFT OUTER JOIN emp_leave_applications ON emp_leave_applications.leave_id = emp_leave_application_refs.leave_id \
                    WHERE emp_leave_applications.availed = 1 AND emp_id = " + empID,
                    (err, rslt) => {

                        if (err) {

                            res.status(500).send(err);
                            res.end();
                            connection.release();

                        } else {

                            res.send(rslt);
                            res.end();
                            connection.release();

                        }

                    }
                )
            }

        }
    );

});

router.post('/getallshortleaves', (req, res) => {

    const { empID } = req.body;

    db.getConnection(
        (err, connection) => {

            if (err) {


                res.status(503).send(err);
                res.end();

            } else {
                connection.query(
                    "SELECT \
                    employees.emp_id, \
                    emp_short_leave_application_refs.*, \
                    emp_short_leave_applications.*, \
                    ADDDATE(emp_short_leave_applications.date, INTERVAL 1 DAY) `date`, \
                    ADDDATE(emp_short_leave_application_refs.requested_date, INTERVAL 1 DAY) `requested_date` \
                    FROM employees \
                    RIGHT OUTER JOIN emp_short_leave_application_refs ON emp_short_leave_application_refs.requested_by = employees.emp_id \
                    LEFT OUTER JOIN emp_short_leave_applications ON emp_short_leave_applications.leave_id = emp_short_leave_application_refs.leave_id \
                    WHERE emp_id = " + empID,
                    (err, rslt) => {

                        if (err) {

                            res.status(500).send(err);
                            res.end();
                            connection.release();

                        } else {

                            res.send(rslt);
                            res.end();
                            connection.release();

                        }

                    }
                )
            }

        }
    );

});

router.post('/applyleave', (req, res) => {

    const { request_by, leave_type, leave_from, leave_to, note, availed, request_to, date_time, no_of_days } = req.body;
    
    const d = new Date( date_time );
    const d1 = new Date( leave_from );
    const d2 = new Date( leave_to );

    const d3 = new Date( leave_from ).toISOString().slice(0, 10).replace('T', ' ');
    const d4 = new Date( leave_to ).toISOString().slice(0, 10).replace('T', ' ');
    const d5 = new Date( date_time ).toISOString().slice(0, 10).replace('T', ' ');

    db.query(
        "INSERT INTO `tbl_leaves`(`leave_type`, `availed`, `leave_from`, `leave_to`, `note`, `no_of_days`, `request_by`, `request_time`, `request_date`, `request_to`) VALUES (?,?,?,?,?,?,?,?,?,?);" +
        "SELECT leave_id FROM `tbl_leaves` WHERE leave_from = ? AND leave_to = ? AND note = ? AND request_date = ?;",
        [ leave_type, availed, d1, d2, note, no_of_days, request_by, d.toTimeString(), d, request_to, d3, d4, note, d5 ],
        (err, rslt) => {

            if (err) {

                console.log( err );
                res.status(500).send(err);
                res.end();

            } else {

                CreateLogs( 
                    'tbl_leaves', 
                    rslt[1][0].leave_id,
                    "New leave request generated",
                    'info',
                    'insert'
                );
                res.send('success');
                res.end();

            }

        }
    )

});

router.get('/getallempleaves', (req, res) => {

    db.getConnection(
        (err, connection) => {

            if (err) {

                res.status(503).send(err);
                res.end();

            } else {
                connection.query(
                    "SELECT DISTINCT employees.*, locations.location_name, \
                    companies.company_name,departments.department_name,designations.designation_name, \
                    emp_app_profile.emp_image, emp_leave_application_refs.*, \
                    ADDDATE(emp_leave_application_refs.requested_date, INTERVAL 1 DAY) requested_date,\
                    emp_leave_applications.*, \
                    ADDDATE(emp_leave_applications.leave_from, INTERVAL 1 DAY) leave_from, \
                    ADDDATE(emp_leave_applications.leave_to, INTERVAL 1 DAY) leave_to \
                    FROM employees LEFT OUTER JOIN companies ON employees.company_code = companies.company_code LEFT OUTER JOIN departments ON employees.department_code = departments.department_code LEFT OUTER JOIN locations ON employees.location_code = locations.location_code LEFT OUTER JOIN designations ON employees.designation_code = designations.designation_code RIGHT OUTER JOIN emp_app_profile ON employees.emp_id = emp_app_profile.emp_id RIGHT OUTER JOIN emp_leave_application_refs ON employees.emp_id = emp_leave_application_refs.requested_by RIGHT OUTER JOIN emp_leave_applications ON emp_leave_application_refs.leave_id = emp_leave_applications.leave_id ORDER BY emp_leave_application_refs.id DESC;",
                    (err, rslt) => {

                        if (err) {

                            res.status(500).send(err);
                            res.end();
                            connection.release();

                        } else {

                            res.send(rslt);
                            res.end();
                            connection.release();

                        }

                    }
                )
            }

        }
    );

});

router.get('/getallempshrtleaves', (req, res) => {

    db.getConnection(
        (err, connection) => {

            if (err) {


                res.status(503).send(err);
                res.end();

            } else {
                connection.query(
                    "SELECT DISTINCT employees.*, locations.location_name,companies.company_name,departments.department_name, \
                    designations.designation_name,emp_app_profile.emp_image, emp_short_leave_application_refs.*, \
                    emp_short_leave_applications.*, \
                    ADDDATE(emp_short_leave_applications.date, INTERVAL 1 DAY) date, \
                    ADDDATE(emp_short_leave_application_refs.requested_date, INTERVAL 1 DAY) requested_date \
                    FROM employees LEFT OUTER JOIN companies ON employees.company_code = companies.company_code LEFT OUTER JOIN departments ON employees.department_code = departments.department_code LEFT OUTER JOIN locations ON employees.location_code = locations.location_code LEFT OUTER JOIN designations ON employees.designation_code = designations.designation_code RIGHT OUTER JOIN emp_app_profile ON employees.emp_id = emp_app_profile.emp_id RIGHT OUTER JOIN emp_short_leave_application_refs ON employees.emp_id = emp_short_leave_application_refs.requested_by RIGHT OUTER JOIN emp_short_leave_applications ON emp_short_leave_application_refs.leave_id = emp_short_leave_applications.leave_id ORDER BY emp_short_leave_application_refs.id DESC;",
                    (err, rslt) => {

                        if (err) {

                            res.status(500).send(err);
                            res.end();
                            connection.release();

                        } else {

                            res.send(rslt);
                            res.end();
                            connection.release();

                        }

                    }
                )
            }

        }
    );

});

router.post('/getempleavescount', (req, res) => {

    const { empID } = req.body;

    db.getConnection(
        (err, connection) => {

            if (err) {

                res.status(503).send(err);
                res.end();

            } else {
                connection.query(
                    "SELECT DISTINCT emp_leave_applications.days,emp_leave_applications.leave_type FROM employees RIGHT OUTER JOIN emp_leave_application_refs ON employees.emp_id = emp_leave_application_refs.requested_by RIGHT OUTER JOIN emp_leave_applications ON emp_leave_application_refs.leave_id = emp_leave_applications.leave_id WHERE emp_leave_application_refs.request_status = 'Accepted' AND employees.emp_id = " + empID,
                    (err, rslt) => {

                        if (err) {

                            res.status(500).send(err);
                            res.end();
                            connection.release();

                        } else {

                            res.send(rslt);
                            res.end();
                            connection.release();

                        }

                    }
                )
            }

        }
    );

});

router.post('/getempshortleavescount', (req, res) => {

    const { empID } = req.body;

    db.getConnection(
        (err, connection) => {

            if (err) {

                res.status(503).send(err);
                res.end();

            } else {
                connection.query(
                    "SELECT COUNT(id) AS counts FROM `emp_short_leave_application_refs` WHERE emp_short_leave_application_refs.request_status = 'Accepted' AND requested_by = " + empID,
                    (err, rslt) => {

                        if (err) {

                            res.status(500).send(err);
                            res.end();
                            connection.release();

                        } else {

                            res.send(rslt);
                            res.end();
                            connection.release();

                        }

                    }
                )
            }

        }
    );

});

router.post('/updateleavestatusreject', (req, res) => {

    const { empID, leave, handleBY, leave_id, Remarks } = req.body;
    const d = new Date();

    db.getConnection(
        (err, connection) => {

            if (err) {

                res.status(503).send(err);
                res.end();

            } else {
                connection.query(
                    leave === 'leave'
                        ?
                        "UPDATE emp_leave_application_refs SET request_status = 'Rejected', approval_date = '" + d.getFullYear() + '-' + parseInt(d.getMonth() + 1) + '-' + d.getDate() + "', approved_by = " + handleBY + ", approval_time = '" + d.toTimeString() + "', comments = '" + Remarks + "' WHERE request_status = 'Waiting For Approval' AND requested_by = " + empID + " AND emp_leave_application_refs.leave_id = " + leave_id
                        :
                        "UPDATE emp_short_leave_application_refs SET request_status = 'Rejected', approval_date = '" + d.getFullYear() + '-' + parseInt(d.getMonth() + 1) + '-' + d.getDate() + "', approved_by = " + handleBY + ", approval_time = '" + d.toTimeString() + "', comments = '" + Remarks + "' WHERE request_status = 'Waiting For Approval' AND requested_by = " + empID + " AND emp_short_leave_application_refs.leave_id = " + leave_id
                    ,
                    (err, rslt) => {

                        if (err) {

                            res.status(500).send(err);
                            res.end();
                            connection.release();

                        } else {

                            res.send(rslt);
                            res.end();
                            connection.release();

                        }

                    }
                )
            }

        }
    );

});

// NEW
router.post('/updateleavestatustowaiting', (req, res) => {

    const { empID, leave, handleBY, leave_id } = req.body;
    const d = new Date();
    db.query(
        leave === 'leave'
            ?
            "UPDATE emp_leave_application_refs SET request_status = 'Waiting For Approval', view_date = ?, handle_by = " + handleBY + ", view_time = '" + d.toTimeString() + "' WHERE request_status = 'sent' AND requested_by = " + empID + " AND emp_leave_application_refs.leave_id = " + leave_id
            :
            "UPDATE emp_short_leave_application_refs SET request_status = 'Waiting For Approval', view_date = ?, handle_by = " + handleBY + ", view_time = '" + d.toTimeString() + "' WHERE request_status = 'sent' AND requested_by = " + empID + " AND emp_short_leave_application_refs.leave_id = " + leave_id
        ,
        [ d ],
        (err, rslt) => {

            if (err) {

                res.status(500).send(err);
                res.end();

            } else {

                res.send(rslt);
                res.end();

            }

        }
    )

});

router.post('/updateleavestatustoaccept', (req, res) => {

    const { empID, leave, handleBY, leave_id, Remarks } = req.body;
    const d = new Date();

    db.query(
        leave === 'leave'
            ?
            "UPDATE emp_leave_application_refs SET request_status = 'Accepted', approval_date = ?, approved_by = " + handleBY + ", approval_time = '" + d.toTimeString() + "', comments = '" + Remarks + "' WHERE request_status = 'Waiting For Approval' AND requested_by = " + empID + " AND emp_leave_application_refs.leave_id = " + leave_id
            :
            "UPDATE emp_short_leave_application_refs SET request_status = 'Accepted', approval_date = ?, approved_by = " + handleBY + ", approval_time = '" + d.toTimeString() + "', comments = '" + Remarks + "' WHERE request_status = 'Waiting For Approval' AND requested_by = " + empID + " AND emp_short_leave_application_refs.leave_id = " + leave_id
        ,
        [ d ],
        (err, rslt) => {

            if (err) {

                console.log( err );
                res.status(500).send(err);
                res.end();

            } else {

                if (leave !== 'leave') {

                    db.query(
                        'SELECT \
                        employees.emp_id,\
                        employees.time_in, \
                        employees.time_out, \
                        emp_short_leave_application_refs.*, \
                        emp_short_leave_applications.* \
                        FROM employees \
                        RIGHT OUTER JOIN emp_short_leave_application_refs ON emp_short_leave_application_refs.requested_by = employees.emp_id \
                        LEFT OUTER JOIN emp_short_leave_applications ON emp_short_leave_applications.leave_id = emp_short_leave_application_refs.leave_id  \
                        WHERE emp_short_leave_applications.leave_id = ' + leave_id,
                        (err, rslt) => {

                            if (err) {

                                res.status(500).send(err);
                                res.end();

                            } else {

                                let leaveFor = rslt[0].leave_for;
                                let date = rslt[0].date;

                                db.query(
                                    'SELECT time_in FROM emp_attendance WHERE emp_id = ' + empID + " AND emp_date = ?",
                                    [date],
                                    (err, results) => {

                                        if (err) {

                                            res.status(500).send(err);
                                            res.end();

                                        } else {
                                            let timeForBreak = null;
                                            let q = null;

                                            if (results[0]) {

                                                if (leaveFor === 'break_in') {
                                                    timeForBreak = '13:00:00';
                                                    q = {
                                                        sql: "UPDATE emp_attendance SET status = 'leave', leave_ref = '" + 'short/' + leave_id + "' WHERE emp_id = " + empID + " AND emp_attendance.emp_date = ?",
                                                        values: [date]
                                                    };
                                                } else if (leaveFor === 'break_out') {
                                                    timeForBreak = '14:00:00';
                                                    q = {
                                                        sql: "UPDATE emp_attendance SET status = 'leave', leave_ref = '" + 'short/' + leave_id + "' WHERE emp_id = " + empID + " AND emp_attendance.emp_date = ?",
                                                        values: [date]
                                                    };
                                                } else if (leaveFor === 'time_in') {
                                                    q = {
                                                        sql: "UPDATE emp_attendance SET status = 'leave', leave_ref = '" + 'short/' + leave_id + "' WHERE emp_id = " + empID + " AND emp_attendance.emp_date = ?",
                                                        values: [date]
                                                    };
                                                } else {
                                                    q = {
                                                        sql: "UPDATE emp_attendance SET status = 'leave', leave_ref = '" + 'short/' + leave_id + "' WHERE emp_id = " + empID + " AND emp_attendance.emp_date = ?",
                                                        values: [date]
                                                    };
                                                }

                                                db.query(
                                                    q,
                                                    [date],
                                                    (err) => {

                                                        if (err) {

                                                            res.status(500).send(err);
                                                            res.end();

                                                        } else {

                                                            res.send('success');
                                                            res.end();

                                                        }

                                                    }
                                                )

                                            } else {

                                                if (leaveFor === 'break_in') {
                                                    q = {
                                                        sql: 'INSERT INTO emp_attendance (emp_id, status, emp_date, leave_ref) VALUES (?,?,?,?)',
                                                        values: [empID, 'leave', date, 'short/' + leave_id]
                                                    }
                                                } else if (leaveFor === 'break_out') {
                                                    q = {
                                                        sql: 'INSERT INTO emp_attendance (emp_id, status, emp_date, leave_ref) VALUES (?,?,?,?)',
                                                        values: [empID, 'leave', date, 'short/' + leave_id]
                                                    }
                                                } else if (leaveFor === 'time_in') {
                                                    q = {
                                                        sql: 'INSERT INTO emp_attendance (emp_id, status, emp_date, leave_ref) VALUES (?,?,?,?)',
                                                        values: [empID, 'leave', date, 'short/' + leave_id]
                                                    }
                                                } else {
                                                    q = {
                                                        sql: 'INSERT INTO emp_attendance (emp_id, status, emp_date, leave_ref) VALUES (?,?,?,?)',
                                                        values: [empID, 'leave', date, 'short/' + leave_id]
                                                    }
                                                }

                                                db.query(
                                                    q,
                                                    (err) => {

                                                        if (err) {

                                                            res.status(500).send(err);
                                                            res.end();

                                                        } else {

                                                            res.send('success');
                                                            res.end();

                                                        }

                                                    }
                                                )
                                            }

                                        }

                                    }
                                )

                            }

                        }
                    )
                } else {
                    res.send(rslt);
                }


            }

        }
    )

});

// NEW

router.post('/markleave', (req, res) => {

    const { empID, leaveID, leaveFrom, oneDayLeave, dates } = req.body;

    let leaveDates = JSON.parse(dates);
    let date = new Date( leaveFrom ).toISOString().slice(0, 10).replace('T', ' ');

    if (parseInt(oneDayLeave) === 1) {

        db.query(
            'SELECT id FROM emp_attendance WHERE emp_date = ? AND emp_id = ?;',
            [ date, empID ],
            (err, rslt) => {

                if (err) {

                    res.status(500).send(err);
                    res.end();

                } else {

                    let q = "";
                    let parameters = [];
                    if ( rslt[0] )
                    {
                        q = "UPDATE emp_attendance SET status = ?, leave_ref = ? WHERE emp_id = ? AND emp_date = ?;";
                        parameters = [ 'leave', 'leave/' + leaveID, empID, date ];
                    }else
                    {
                        q = "INSERT INTO emp_attendance (emp_id, status, emp_date, leave_ref) VALUES (?,?,?,?);";
                        parameters = [empID, 'leave', leaveFrom, 'leave/' + leaveID];
                    }
                    
                    db.query(
                        q,
                        parameters,
                        (err) => {
            
                            if (err) {
            
                                res.status(500).send(err);
                                res.end();
            
                            } else {
            
                                res.send('success');
                                res.end();
            
                            }
            
                        }
                    );

                }

            }
        );

    } else {

        for (let x = 0; x < leaveDates.length; x++) 
        {

            let date2 = new Date( leaveDates[x] ).toISOString().slice(0, 10).replace('T', ' ');
            db.query(
                'SELECT id FROM emp_attendance WHERE emp_date = ? AND emp_id = ?;',
                [ date2, empID ],
                (err, rslt) => {
    
                    if (err) {
    
                        res.status(500).send(err);
                        res.end();
    
                    } else {
    
                        let q = "";
                        let parameters = [];
                        if ( rslt[0] )
                        {
                            q = "UPDATE emp_attendance SET status = ?, leave_ref = ? WHERE emp_id = ? AND emp_date = ?;";
                            parameters = [ 'leave', 'leave/' + leaveID, empID, date2 ];
                        }else
                        {
                            q = "INSERT INTO emp_attendance (emp_id, status, emp_date, leave_ref) VALUES (?,?,?,?);";
                            parameters = [empID, 'leave', date2, 'leave/' + leaveID];
                        }
                        
                        db.query(
                            q,
                            parameters,
                            (err) => {
                
                                if (err) {
                
                                    res.status(500).send(err);
                                    res.end();
                
                                }
                
                            }
                        );
    
                    }
    
                }
            );

            if ( ( x + 1 ) === leaveDates.length )
            {
                res.send('success');
                res.end();
            }

        }

    }

});

router.post('/getemployeeleavesummery', (req, res) => {

    const { emp_id } = req.body;

    db.query(
        "SELECT  \
        COUNT( emp_leave_applications.leave_id ) AS leaves, \
        emp_leave_applications.leave_type \
        FROM emp_leave_applications \
        LEFT OUTER JOIN emp_leave_application_refs ON emp_leave_applications.leave_id = emp_leave_application_refs.leave_id \
        WHERE emp_leave_application_refs.requested_by = ? GROUP BY emp_leave_applications.leave_type; \
         \
        SELECT  \
        COUNT( emp_short_leave_applications.leave_id ) AS leaves  \
        FROM emp_short_leave_applications \
        LEFT OUTER JOIN emp_short_leave_application_refs ON emp_short_leave_applications.leave_id = emp_short_leave_application_refs.leave_id \
        WHERE emp_short_leave_application_refs.requested_by = ?; \
         \
         SELECT \
         COUNT(emp_attendance.id) AS count, \
         MONTHNAME ( emp_attendance.emp_date ) AS Month, \
         YEAR ( emp_attendance.emp_date ) AS Year \
         FROM \
         emp_attendance \
         WHERE status = 'leave' AND emp_id = ? AND YEAR ( emp_attendance.emp_date ) = ? \
         GROUP BY MONTH ( emp_attendance.emp_date );",
        [ emp_id, emp_id, emp_id, new Date().getFullYear() ],
        (err, rslt) => {

            if (err) {

                res.status(500).send(err);
                res.end();

            } else {

                res.send( rslt );
                res.end();

            }

        }
    );

});

router.get('/getleaverequestsstatus', (req, res) => {

    const { emp_id } = req.body;

    let q = db.query(
        "",
        [ emp_id, emp_id, emp_id, new Date().getFullYear() ],
        (err, rslt) => {

            if (err) {

                res.status(500).send(err);
                res.end();

            } else {

                console.log( q.sql );
                res.send( rslt );
                res.end();

            }

        }
    );

});

router.post('/getemployeealltypeofleaves', (req, res) => {

    const { emp_id } = req.body;

    db.query(
        "SELECT  \
        tbl_leaves.*, \
        sender.emp_image AS sender_image, \
        receiver.emp_image AS receiver_image,   \
        sender_emp.name AS sender_name, \
        receiver_emp.name AS receiver_name    \
        FROM `tbl_leaves` \
        LEFT OUTER JOIN emp_app_profile sender ON tbl_leaves.request_by = sender.emp_id \
        LEFT OUTER JOIN emp_app_profile receiver ON tbl_leaves.request_to = receiver.emp_id \
        LEFT OUTER JOIN employees sender_emp ON tbl_leaves.request_by = sender_emp.emp_id \
        LEFT OUTER JOIN employees receiver_emp ON tbl_leaves.request_to = receiver_emp.emp_id \
        WHERE  \
        tbl_leaves.availed = 0 AND  \
        tbl_leaves.request_by = ? OR  \
        tbl_leaves.request_to = ?  \
        ORDER BY tbl_leaves.leave_id DESC;" +
        "SELECT  \
        tbl_leaves.*, \
        sender.emp_image AS sender_image, \
        receiver.emp_image AS receiver_image,   \
        sender_emp.name AS sender_name, \
        receiver_emp.name AS receiver_name    \
        FROM `tbl_leaves` \
        LEFT OUTER JOIN emp_app_profile sender ON tbl_leaves.request_by = sender.emp_id \
        LEFT OUTER JOIN emp_app_profile receiver ON tbl_leaves.request_to = receiver.emp_id \
        LEFT OUTER JOIN employees sender_emp ON tbl_leaves.request_by = sender_emp.emp_id \
        LEFT OUTER JOIN employees receiver_emp ON tbl_leaves.request_to = receiver_emp.emp_id \
        WHERE  \
        tbl_leaves.availed = 1 AND  \
        tbl_leaves.request_by = ? OR  \
        tbl_leaves.request_to = ?  \
        ORDER BY tbl_leaves.leave_id DESC;" +
        "SELECT  \
        tbl_short_leaves.*, \
        sender.emp_image AS sender_image, \
        receiver.emp_image AS receiver_image,   \
        sender_emp.name AS sender_name, \
        receiver_emp.name AS receiver_name    \
        FROM `tbl_short_leaves` \
        LEFT OUTER JOIN emp_app_profile sender ON tbl_short_leaves.request_by = sender.emp_id \
        LEFT OUTER JOIN emp_app_profile receiver ON tbl_short_leaves.request_to = receiver.emp_id \
        LEFT OUTER JOIN employees sender_emp ON tbl_short_leaves.request_by = sender_emp.emp_id \
        LEFT OUTER JOIN employees receiver_emp ON tbl_short_leaves.request_to = receiver_emp.emp_id \
        WHERE  \
        tbl_short_leaves.request_by = ? OR  \
        tbl_short_leaves.request_to = ?  \
        ORDER BY tbl_short_leaves.leave_id DESC;",
        [ emp_id, emp_id, emp_id, emp_id, emp_id, emp_id ],
        (err, rslt) => {

            if (err) {

                res.status(500).send(err);
                res.end();

            } else {

                res.send( rslt );
                res.end();

            }

        }
    );

});

module.exports = router;