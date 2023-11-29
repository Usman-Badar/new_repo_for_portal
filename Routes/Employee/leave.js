const express = require('express');
const router = express.Router();
const db = require('../../db/connection');
const SendWhatsappNotification = require('../Whatsapp/whatsapp').SendWhatsappNotification;

router.post('/applyshortleave', (req, res) => {

    const { ShortLeaveTime, ShortLeaveEndTime, ShortLeaveDate, ShortLeaveReason, RequestedBy, RequestedTo } = req.body;
    const d = new Date();
    const code = new Date().getTime() + '_' + new Date().getDate() + (new Date().getMonth() + 1) + new Date().getFullYear();

    function notification() {
        db.query(
            "SELECT name, cell FROM employees WHERE emp_id = ?;" + 
            "SELECT name, cell FROM employees WHERE emp_id = ?;",
            [ RequestedBy, RequestedTo ],
            ( err, result ) => {
    
                if( err )
                {
    
                    console.log( err );
                    res.send( err );
                    res.end();
    
                }else
                {
                    SendWhatsappNotification( null, null, "Hi " + result[0][0].name, "Your short leave has been sent to your H.O.D " + result[1][0].name + ", kindly wait... while your application is proceeding for approval.", result[0][0].cell );
                    SendWhatsappNotification( null, null, "Hi " + result[1][0].name, result[0][0].name + " has sent you a short leave on portal, " + result[0][0].name + " will leave at around " + ShortLeaveTime + " on " + ShortLeaveDate + " under reason '" + ShortLeaveReason + "'. Kindly view", result[1][0].cell );
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
                            "INSERT INTO emp_short_leave_applications (unique_id, leave_purpose, leave_time, leave_end_time, date) VALUES (?,?,?,?,?)",
                            [code, ShortLeaveReason, ShortLeaveTime, ShortLeaveEndTime == '' ? null : ShortLeaveEndTime, ShortLeaveDate],
                            ( err, rslt ) => {
                    
                                if( err )
                                {
                                    connection.rollback(() => {console.log(err);connection.release();});
                                    res.send('err');
                                    res.end();
                                }else 
                                {
                                    connection.query(
                                        "INSERT INTO emp_short_leave_application_refs (leave_id, requested_by, requested_date, requested_time, request_status, received_by) VALUES (?,?,?,?,?,?)",
                                        [rslt.insertId, RequestedBy, d, d.toTimeString(), 'sent', RequestedTo],
                                        ( err ) => {
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
                                                        notification();
                                                        connection.release();
                                                        res.send(rslt);
                                                        res.end();
                                                    }
                                                });
                                            }
                                        }
                                    );
                                }
                                
                            }
                        );
                    }
                }
            )
        }
    )

});

router.post('/getallleaves', (req, res) => {

    const { empID, all } = req.body;

    if (parseInt(all) === 1) {
        db.query(
            "SELECT \
            employees.emp_id, \
            employees.name, \
            emp_leave_application_refs.*, \
            emp_leave_applications.*  \
            FROM employees \
            RIGHT OUTER JOIN emp_leave_application_refs ON emp_leave_application_refs.requested_by = employees.emp_id \
            LEFT OUTER JOIN emp_leave_applications ON emp_leave_applications.leave_id = emp_leave_application_refs.leave_id \
            ORDER BY emp_leave_applications.leave_id DESC",
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
    }else {
        db.query(
            "SELECT \
            employees.emp_id, \
            employees.name, \
            emp_leave_application_refs.*, \
            emp_leave_applications.*  \
            FROM employees \
            RIGHT OUTER JOIN emp_leave_application_refs ON emp_leave_application_refs.requested_by = employees.emp_id \
            LEFT OUTER JOIN emp_leave_applications ON emp_leave_applications.leave_id = emp_leave_application_refs.leave_id \
            WHERE emp_leave_application_refs.requested_by = " + empID + " OR emp_leave_application_refs.received_by = " + empID + " OR emp_leave_application_refs.authorized_to = " + empID + " ORDER BY emp_leave_applications.leave_id DESC",
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
    }

});

router.post('/getallrecentleaves', (req, res) => {

    const { empID, all } = req.body;

    if (all === 1) {
        db.query(
            "SELECT \
            employees.emp_id, \
            employees.name, \
            emp_leave_application_refs.*, \
            emp_leave_applications.*  \
            FROM employees \
            RIGHT OUTER JOIN emp_leave_application_refs ON emp_leave_application_refs.requested_by = employees.emp_id \
            LEFT OUTER JOIN emp_leave_applications ON emp_leave_applications.leave_id = emp_leave_application_refs.leave_id \
            ORDER BY emp_leave_applications.leave_id DESC LIMIT 10",
            (err, rslt) => {
    
                if (err) {
    
                    res.status(500).send(err);
                    res.end();
    
                } else {
    
                    if ( rslt.length === 0 )
                    {
                        db.query(
                            "SELECT \
                            employees.emp_id, \
                            employees.name, \
                            emp_leave_application_refs.*, \
                            emp_leave_applications.*  \
                            FROM employees \
                            RIGHT OUTER JOIN emp_leave_application_refs ON emp_leave_application_refs.requested_by = employees.emp_id \
                            LEFT OUTER JOIN emp_leave_applications ON emp_leave_applications.leave_id = emp_leave_application_refs.leave_id \
                            ORDER BY emp_leave_applications.leave_id DESC LIMIT 10",
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
                    }else
                    {
                        res.send(rslt);
                        res.end();
                    }
    
                }
    
            }
        )
    }else {
        db.query(
            "SELECT \
            employees.emp_id, \
            employees.name, \
            emp_leave_application_refs.*, \
            emp_leave_applications.*  \
            FROM employees \
            RIGHT OUTER JOIN emp_leave_application_refs ON emp_leave_application_refs.requested_by = employees.emp_id \
            LEFT OUTER JOIN emp_leave_applications ON emp_leave_applications.leave_id = emp_leave_application_refs.leave_id \
            WHERE emp_leave_application_refs.received_by = " + empID + " OR emp_leave_application_refs.authorized_to = " + empID + " ORDER BY emp_leave_applications.leave_id DESC LIMIT 10",
            (err, rslt) => {
    
                if (err) {
    
                    res.status(500).send(err);
                    res.end();
    
                } else {
    
                    if ( rslt.length === 0 )
                    {
                        db.query(
                            "SELECT \
                            employees.emp_id, \
                            employees.name, \
                            emp_leave_application_refs.*, \
                            emp_leave_applications.*  \
                            FROM employees \
                            RIGHT OUTER JOIN emp_leave_application_refs ON emp_leave_application_refs.requested_by = employees.emp_id \
                            LEFT OUTER JOIN emp_leave_applications ON emp_leave_applications.leave_id = emp_leave_application_refs.leave_id \
                            WHERE emp_leave_application_refs.requested_by = " + empID + " OR emp_leave_application_refs.received_by = " + empID + " OR emp_leave_application_refs.authorized_to = " + empID + " ORDER BY emp_leave_applications.leave_id DESC LIMIT 5",
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
                    }else
                    {
                        res.send(rslt);
                        res.end();
                    }
    
                }
    
            }
        )
    }

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

    const { empID, all } = req.body;

    if (parseInt(all) === 1) {
        db.query(
            "SELECT \
            employees.emp_id, \
            employees.name, \
            emp_short_leave_application_refs.*, \
            emp_short_leave_applications.* \
            FROM employees \
            RIGHT OUTER JOIN emp_short_leave_application_refs ON emp_short_leave_application_refs.requested_by = employees.emp_id \
            LEFT OUTER JOIN emp_short_leave_applications ON emp_short_leave_applications.leave_id = emp_short_leave_application_refs.leave_id \
            ORDER BY emp_short_leave_applications.leave_id DESC",
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
    }else {
        db.query(
            "SELECT \
            employees.emp_id, \
            employees.name, \
            emp_short_leave_application_refs.*, \
            emp_short_leave_applications.* \
            FROM employees \
            RIGHT OUTER JOIN emp_short_leave_application_refs ON emp_short_leave_application_refs.requested_by = employees.emp_id \
            LEFT OUTER JOIN emp_short_leave_applications ON emp_short_leave_applications.leave_id = emp_short_leave_application_refs.leave_id \
            WHERE emp_short_leave_application_refs.requested_by = " + empID + " OR emp_short_leave_application_refs.received_by = " + empID + " OR emp_short_leave_application_refs.authorized_to = " + empID + " ORDER BY emp_short_leave_applications.leave_id DESC",
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
    }

});

router.post('/applyleave', (req, res) => {

    const { onDayLeave, leaveType, leaveFrom, leaveTo, NoOfDays, Purpose, AttachementName, Availed, RequestedBy, RequestedTo, leaveDate } = req.body;
    const d = new Date();
    const code = new Date().getTime() + '_' + new Date().getDate() + (new Date().getMonth() + 1) + new Date().getFullYear();

    let attName = null;

    db.query(
        "INSERT INTO emp_leave_applications (unique_id, leave_type, availed, one_day_leave, leave_purpose, leave_from, leave_to, days, attachement) VALUES (?,?,?,?,?,?,?,?,?)",
        [code, leaveType, Availed, parseInt(onDayLeave), Purpose, parseInt(onDayLeave) === 1 ? leaveDate : leaveFrom, leaveTo === '' ? null : leaveTo, parseInt(NoOfDays), attName],
        (err, rslt) => {

            if (err) {

                console.log(err)
                res.status(500).send(err);
                res.end();

            } else {

                db.query(
                    "SELECT leave_id FROM emp_leave_applications WHERE unique_id = ?",
                    [ code ],
                    (err, rslt) => {

                        if (err) {

                            console.log(err)
                            res.status(500).send(err);
                            res.end();

                        } else {
                            db.query(
                                "INSERT INTO emp_leave_application_refs (leave_id, requested_by, requested_date, requested_time, request_status, received_by) VALUES (?,?,?,?,?,?)",
                                [rslt[0].leave_id, RequestedBy, d, d.toTimeString(), 'sent', RequestedTo],
                                (err, rslt) => {

                                    if (err) {

                                        console.log(err)
                                        res.status(500).send(err);
                                        res.end();

                                    } else {

                                        if (AttachementName !== '') {

                                            const { AttachementFile } = req.files;

                                            attName = AttachementName + '.' + (AttachementFile.mimetype.split('/')[1]).toString();

                                            AttachementFile.mv('client/public/images/leave_attatchments/' + attName, (err) => {

                                                if (!err) {
                                                    
                                                    res.send(rslt);
                                                    res.end();
                                                }

                                            });

                                        } else {

                                            res.send(rslt);
                                            res.end();
                                        }

                                    }

                                }
                            )

                        }

                    }
                )

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

router.post('/leave/total_days_count', (req, res) => {

    const { emp_id } = req.body;

    db.query(
        "SELECT emp_id, COUNT(id) as total_leaves FROM emp_attendance \
        WHERE status = 'leave' AND emp_id = ? AND time_in IS null \
        AND emp_date BETWEEN CONCAT(YEAR(CURRENT_DATE)-1,'-07-01') AND CONCAT(YEAR(CURRENT_DATE),'-06-30');",
        [ emp_id ],
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

router.post('/markshortleave', (req, res) => {

    const { empID, leave_id } = req.body;

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
                            let q = null;

                            if (results[0]) {

                                q = {
                                    sql: "UPDATE emp_attendance SET status = 'short leave', leave_ref = '" + 'short/' + leave_id + "' WHERE emp_id = " + empID + " AND emp_attendance.emp_date = ?",
                                    values: [date]
                                };

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

                                q = {
                                    sql: 'INSERT INTO emp_attendance (emp_id, status, emp_date, leave_ref) VALUES (?,?,?,?)',
                                    values: [empID, 'short leave', date, 'short/' + leave_id]
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

});

router.post('/markleave', (req, res) => {

    const { empID, leaveID, leaveFrom, oneDayLeave, dates } = req.body;

    let leaveDates = JSON.parse(dates);
    let date = new Date( leaveFrom ).toISOString().slice(0, 10).replace('T', ' ');

    if (parseInt(oneDayLeave) === 1) {

        let q1 = db.query(
            'SELECT id FROM emp_attendance WHERE emp_date = ? AND emp_id = ?;',
            [ date, empID ],
            (err, rslt) => {

                console.log( 'q1: ', q1.sql );

                if (err) {

                    console.log(err);
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
                        parameters = [empID, 'leave', date, 'leave/' + leaveID];
                    }
                    
                    let q2 = db.query(
                        q,
                        parameters,
                        (err) => {
            
                            console.log( 'q2: ', q2.sql );
                            if (err) {
            
                                console.log(err);
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
            let q3 = db.query(
                'SELECT id FROM emp_attendance WHERE emp_date = ? AND emp_id = ?;',
                [ date2, empID ],
                (err, rslt) => {
    
                    console.log( 'q3: ', q3.sql );
                    if (err) {
    
                        console.log(err);
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
                        
                        let q4 = db.query(
                            q,
                            parameters,
                            (err) => {
                
                                console.log( 'q4: ', q4.sql );
                                if (err) {
                
                                    console.log(err);
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

router.post('/getmyleavedetails', (req, res) => {

    const { leave_id, type, emp_id } = req.body;
    const d = new Date();

    let q = "";
    if ( type === 'short' )
    {
        q = "SELECT        \
        emp_short_leave_applications.*, \
        emp_short_leave_application_refs.*, \
        sender.name AS sender_person,  \
        sender.cell AS sender_cell,  \
        sender.permanent_address AS sender_address,  \
        receiver.name AS receiver_person,  \
        auther.name AS auther_person,   \
        sender_desgn.designation_name AS sender_designation,  \
        receiver_desgn.designation_name AS receiver_designation,  \
        auther_desgn.designation_name AS auther_designation,   \
        sender_depart.department_name AS sender_department,  \
        receiver_depart.department_name AS receiver_department,  \
        auther_depart.department_name AS auther_department,   \
        sender_company.company_name AS sender_company   \
        FROM \
        emp_short_leave_applications \
        LEFT OUTER JOIN emp_short_leave_application_refs ON emp_short_leave_applications.leave_id = emp_short_leave_application_refs.leave_id \
        LEFT OUTER JOIN employees sender ON emp_short_leave_application_refs.requested_by = sender.emp_id \
        LEFT OUTER JOIN employees receiver ON emp_short_leave_application_refs.approved_by = receiver.emp_id \
        LEFT OUTER JOIN employees auther ON emp_short_leave_application_refs.authorized_by = auther.emp_id \
        LEFT OUTER JOIN designations sender_desgn ON sender.designation_code = sender_desgn.designation_code \
        LEFT OUTER JOIN designations receiver_desgn ON receiver.designation_code = receiver_desgn.designation_code \
        LEFT OUTER JOIN designations auther_desgn ON auther.designation_code = auther_desgn.designation_code \
        LEFT OUTER JOIN departments sender_depart ON sender.department_code = sender_depart.department_code \
        LEFT OUTER JOIN departments receiver_depart ON receiver.department_code = receiver_depart.department_code \
        LEFT OUTER JOIN departments auther_depart ON auther.department_code = auther_depart.department_code \
        LEFT OUTER JOIN companies sender_company ON sender.company_code = sender_company.company_code \
        WHERE  \
        emp_short_leave_applications.leave_id = ?; UPDATE emp_short_leave_application_refs SET handle_by = ?, view_date = ?, view_time = ? WHERE leave_id = ?;"
    }else
    {
        q = "SELECT        \
        emp_leave_applications.*, \
        emp_leave_application_refs.*, \
        sender.name AS sender_person,  \
        sender.cell AS sender_cell,  \
        sender.permanent_address AS sender_address,  \
        receiver.name AS receiver_person,  \
        auther.name AS auther_person,   \
        sender_desgn.designation_name AS sender_designation,  \
        receiver_desgn.designation_name AS receiver_designation,  \
        auther_desgn.designation_name AS auther_designation,   \  \
        sender_depart.department_name AS sender_department,  \
        receiver_depart.department_name AS receiver_department,  \
        auther_depart.department_name AS auther_department,   \
        sender_company.company_name AS sender_company   \
        FROM \
        emp_leave_applications \
        LEFT OUTER JOIN emp_leave_application_refs ON emp_leave_applications.leave_id = emp_leave_application_refs.leave_id \
        LEFT OUTER JOIN employees sender ON emp_leave_application_refs.requested_by = sender.emp_id \
        LEFT OUTER JOIN employees receiver ON emp_leave_application_refs.approved_by = receiver.emp_id \
        LEFT OUTER JOIN employees auther ON emp_leave_application_refs.authorized_by = auther.emp_id \
        LEFT OUTER JOIN designations sender_desgn ON sender.designation_code = sender_desgn.designation_code \
        LEFT OUTER JOIN designations receiver_desgn ON receiver.designation_code = receiver_desgn.designation_code \
        LEFT OUTER JOIN designations auther_desgn ON auther.designation_code = auther_desgn.designation_code \
        LEFT OUTER JOIN departments sender_depart ON sender.department_code = sender_depart.department_code \
        LEFT OUTER JOIN departments receiver_depart ON receiver.department_code = receiver_depart.department_code \
        LEFT OUTER JOIN departments auther_depart ON auther.department_code = auther_depart.department_code \
        LEFT OUTER JOIN companies sender_company ON sender.company_code = sender_company.company_code \
        WHERE  \
        emp_leave_applications.leave_id = ?; UPDATE emp_leave_application_refs SET handle_by = ?, view_date = ?, view_time = ? WHERE leave_id = ?;"
    }

    db.query(
        q,
        [leave_id, emp_id, d, d.toTimeString(), leave_id],
        (err, rslt) => {

            if (err) {

                console.log(err)
                res.status(500).send(err);
                res.end();

            } else {

                res.send(rslt[0]);
                res.end();

            }

        }
    )

});

router.post('/cancel_leave', (req, res) => {

    const { leave_id, remarks, type, submit_to, submit_by } = req.body;
    let q = "";
    const d = new Date();
    let leave_type = '';
    if ( type === 'short' )
    {
        leave_type = 'short leave';
        q = "UPDATE emp_short_leave_application_refs SET cancel_date = ?, cancel_time = ?, remarks = ?, request_status = ? WHERE leave_id = ?;";
    }else
    {
        leave_type = 'leave';
        q = "UPDATE emp_leave_application_refs SET cancel_date = ?, cancel_time = ?, remarks = ?, request_status = ? WHERE leave_id = ?;";
    }

    db.query(
        q,
        [ d, d.toTimeString(), remarks, 'canceled', leave_id ],
        (err, rslt) => {

            if (err) {

                console.log( err )
                res.status(500).send(err);
                res.end();

            } else {

                db.query(
                    "SELECT name, cell FROM employees WHERE emp_id = ?;" + 
                    "SELECT name, cell FROM employees WHERE emp_id = ?;",
                    [ submit_by, submit_to ],
                    ( err, result ) => {
            
                        if( err )
                        {
            
                            console.log( err );
                            res.send( err );
                            res.end();
            
                        }else
                        {
                            SendWhatsappNotification( null, null, "Hi " + result[0][0].name, "You have canceled your " + leave_type + ". Your H.O.D also has been notified.", result[0][0].cell );
                            SendWhatsappNotification( null, null, "Hi " + result[1][0].name, result[0][0].name + " has canceled his/her " + leave_type + " with reason '" + remarks + "'.", result[1][0].cell );
                            res.send(rslt);
                            res.end();
                        }
            
                    }
                );

            }

        }
    )

});

router.post('/reject_leave', (req, res) => {

    const { leave_id, emp_id, remarks, type, submit_by } = req.body;
    let q = "";
    const d = new Date();
    let leave_type = '';
    if ( type === 'short' )
    {
        leave_type = 'short leave';
        q = "UPDATE emp_short_leave_application_refs SET approved_by = ?, approval_date = ?, approval_time = ?, comments = ?, request_status = ? WHERE leave_id = ?;";
    }else
    {
        leave_type = 'leave';
        q = "UPDATE emp_leave_application_refs SET approved_by = ?, approval_date = ?, approval_time = ?, comments = ?, request_status = ? WHERE leave_id = ?;";
    }

    db.query(
        q,
        [ emp_id, d, d.toTimeString(), remarks, 'rejected', leave_id ],
        (err, rslt) => {

            if (err) {

                console.log( err )
                res.status(500).send(err);
                res.end();

            } else {

                db.query(
                    "SELECT name, cell FROM employees WHERE emp_id = ?;" + 
                    "SELECT name, cell FROM employees WHERE emp_id = ?;",
                    [ submit_by, emp_id ],
                    ( err, result ) => {
            
                        if( err )
                        {
            
                            console.log( err );
                            res.send( err );
                            res.end();
            
                        }else
                        {
                            SendWhatsappNotification( null, null, "Hi " + result[0][0].name, "Your " + leave_type + " has been rejected by " + result[1][0].name + " with remarks '" + remarks + "'. If you have any query, kindly contact " + result[1][0].name, result[0][0].cell );
                            SendWhatsappNotification( null, null, "Hi " + result[1][0].name, "You have rejected a " + leave_type + " with reason '" + remarks + "'. The requested employee " + result[0][0].name + " has been notified", result[1][0].cell );
                            res.send(rslt);
                            res.end();
                        }
            
                    }
                );

            }

        }
    )

});

router.post('/approve_leave', (req, res) => {

    const { leave_id, emp_id, remarks, type, submit_to, submit_by } = req.body;
    let q = "";
    const d = new Date();
    let leave_type = '';
    if ( type === 'short' )
    {
        leave_type = 'short leave';
        q = "UPDATE emp_short_leave_application_refs SET approved_by = ?, approval_date = ?, approval_time = ?, comments = ?, request_status = ?, authorized_to = ? WHERE leave_id = ?;";
    }else
    {
        leave_type = 'leave';
        q = "UPDATE emp_leave_application_refs SET approved_by = ?, approval_date = ?, approval_time = ?, comments = ?, request_status = ?, authorized_to = ? WHERE leave_id = ?;";
    }

    db.query(
        q,
        [ emp_id, d, d.toTimeString(), remarks, 'Accepted', submit_to, leave_id ],
        (err, rslt) => {

            if (err) {

                console.log( err )
                res.status(500).send(err);
                res.end();

            } else {

                db.query(
                    "SELECT name, cell FROM employees WHERE emp_id = ?;" + 
                    "SELECT name, cell FROM employees WHERE emp_id = ?;" + 
                    "SELECT name, cell FROM employees WHERE emp_id = ?;",
                    [ submit_by, emp_id, submit_to ],
                    ( err, result ) => {
            
                        if( err )
                        {
            
                            console.log( err );
                            res.send( err );
                            res.end();
            
                        }else
                        {
                            SendWhatsappNotification( null, null, "Hi " + result[0][0].name, "Your " + leave_type + " has been approved by " + result[1][0].name + " with remarks '" + remarks + "'. Your request has been proceed for authorization.", result[0][0].cell );
                            SendWhatsappNotification( null, null, "Hi " + result[1][0].name, "Thank you for approving the " + leave_type + ". The requested employee " + result[0][0].name + " has been notified. The " + leave_type + " has been proceed to " + result[2][0].name, result[1][0].cell );
                            SendWhatsappNotification( null, null, "Hi " + result[2][0].name, result[1][0].name + " has forward you a " + leave_type + " with remarks '" + remarks + "'. The requested employee " + result[0][0].name + " has been notified.", result[2][0].cell );
                            res.send(rslt);
                            res.end();
                        }
            
                    }
                );

            }

        }
    )

});

router.post('/authorize_leave', (req, res) => {

    const { leave_id, emp_id, remarks, type, submit_by } = req.body;
    let q = "";
    const d = new Date();
    let leave_type = '';
    if ( type === 'short' )
    {
        leave_type = 'short leave';
        q = "UPDATE emp_short_leave_application_refs SET authorized_by = ?, authorized_date = ?, authorized_time = ?, comments2 = ?, request_status = ? WHERE leave_id = ?;";
    }else
    {
        leave_type = 'leave';
        q = "UPDATE emp_leave_application_refs SET authorized_by = ?, authorized_date = ?, authorized_time = ?, comments2 = ?, request_status = ? WHERE leave_id = ?;";
    }

    db.query(
        q,
        // [ null, null, null, null, 'Accepted', leave_id ],
        [ emp_id, d, d.toTimeString(), remarks, 'Authorized', leave_id ],
        (err, rslt) => {

            if (err) {

                console.log( err )
                res.status(500).send(err);
                res.end();

            } else {

                db.query(
                    "SELECT name, cell FROM employees WHERE emp_id = ?;" + 
                    "SELECT name, cell FROM employees WHERE emp_id = ?;",
                    [ submit_by, emp_id ],
                    ( err, result ) => {
            
                        if( err )
                        {
            
                            console.log( err );
                            res.send( err );
                            res.end();
            
                        }else
                        {
                            SendWhatsappNotification( null, null, "Hi " + result[0][0].name, "Your " + leave_type + " has been authorized by " + result[1][0].name + " with remarks '" + remarks + "'. Good luck.", result[0][0].cell );
                            SendWhatsappNotification( null, null, "Hi " + result[1][0].name, "Thank you for authorizing the " + leave_type + ". The requested employee " + result[0][0].name + " has been notified.", result[1][0].cell );
                            res.send(rslt);
                            res.end();
                        }
            
                    }
                );

            }

        }
    )

});

module.exports = router;