const express = require('express');
const router = express.Router();
const db = require('../../db/connection');

const CreateLogs = require('./logs').CreateLog;

router.get('/getnextattendancetimelimit', ( req, res ) => {

    db.query(
        "SELECT valueInt1 FROM tblmisc WHERE id = 1;",
        ( err, rslt ) => {

            if ( err )
            {
                console.log( err );
            }else
            {
                res.send( rslt );
            }

        }
    )

} );

router.post('/getallemployeestodayattendancecompanywise', ( req, res ) => {

    const { locationID } = req.body;
    const d = new Date();

    db.getConnection(
        ( err, connection ) => {

            if ( err )
            {

                res.status(503).send(err);
                res.end();

            }else
            {
                connection.query(
                    "SELECT \
                    employees.name,  \
                    designations.designation_name,  \
                    departments.department_name,  \
                    companies.company_name,  \
                    emp_app_profile.emp_image, \
                    emp_attendance.*  \
                    FROM employees  \
                    LEFT OUTER JOIN designations ON employees.designation_code = designations.designation_code  \
                    LEFT OUTER JOIN departments ON employees.department_code = departments.department_code  \
                    LEFT OUTER JOIN companies ON employees.company_code = companies.company_code  \
                    LEFT OUTER JOIN emp_app_profile ON employees.emp_id =  emp_app_profile.emp_id  \
                    LEFT OUTER JOIN emp_attendance ON employees.emp_id =  emp_attendance.emp_id  \
                    WHERE emp_attendance.emp_date = '" + d.getFullYear() + '-' + parseInt(d.getMonth() + 1) + '-' + d.getDate() + "' AND employees.location_code = " + locationID + ";",
                    ( err, rslt ) => {
            
                        if( err )
                        {

                            res.status(500).send(err);
                            res.end();
                            connection.release();
            
                        }else 
                        {

                            res.send( rslt );
                            res.end();
                            connection.release();
            
                        }
            
                    }
                )
            }

        }
    )

} );

router.post('/allemployeesattcompanywiseaccordingtodate', ( req, res ) => {

    const { CompanyCode, DateFrom, DateTo } = req.body;

    let q = '';
    if ( DateTo === '' )
    {
        q = "SELECT emp_attendance.`id`, emp_attendance.`emp_id`, emp_attendance.`time_in`, emp_attendance.`time_out`, emp_attendance.`status`, emp_attendance.`break_in`, emp_attendance.`break_out`, ADDDATE(emp_attendance.emp_date, INTERVAL 1 DAY) `emp_date`, employees.company_code, employees.name, employees.emp_id FROM employees LEFT OUTER JOIN emp_attendance ON employees.emp_id = emp_attendance.emp_id WHERE employees.company_code = " + CompanyCode + " AND emp_attendance.emp_date = '" + DateFrom + "' ORDER BY emp_attendance.emp_date DESC;";
    }else
    if ( DateFrom === '' )
    {
        q = "SELECT emp_attendance.`id`, emp_attendance.`emp_id`, emp_attendance.`time_in`, emp_attendance.`time_out`, emp_attendance.`status`, emp_attendance.`break_in`, emp_attendance.`break_out`, ADDDATE(emp_attendance.emp_date, INTERVAL 1 DAY) `emp_date`, employees.company_code, employees.name, employees.emp_id FROM employees LEFT OUTER JOIN emp_attendance ON employees.emp_id = emp_attendance.emp_id WHERE employees.company_code = " + CompanyCode + " AND emp_attendance.emp_date = '" + DateTo + "' ORDER BY emp_attendance.emp_date DESC;";
    }else
    {
        q = "SELECT emp_attendance.`id`, emp_attendance.`emp_id`, emp_attendance.`time_in`, emp_attendance.`time_out`, emp_attendance.`status`, emp_attendance.`break_in`, emp_attendance.`break_out`, ADDDATE(emp_attendance.emp_date, INTERVAL 1 DAY) `emp_date`, employees.company_code, employees.name, employees.emp_id FROM employees LEFT OUTER JOIN emp_attendance ON employees.emp_id = emp_attendance.emp_id WHERE employees.company_code = " + CompanyCode + " AND emp_attendance.emp_date BETWEEN '" + DateFrom + "' AND '" + DateTo + "' ORDER BY emp_attendance.emp_date DESC;";
    }

    db.query(
        q,
        ( err, rslt ) => {

            if( err )
            {

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

router.get('/getallattendancerequests', ( req, res ) => {

    db.getConnection(
        ( err, connection ) => {

            if ( err )
            {

                res.status(503).send(err);
                res.end();

            }else
            {
                connection.query(
                    "SELECT employees.name, \
                    designations.designation_name, \
                    departments.department_name, \
                    companies.company_name, \
                    emp_app_profile.emp_image, \
                    emp_attendance_requests_ref.*,\
                    emp_attendance_requests.*\
                    FROM employees \
                    LEFT OUTER JOIN designations ON employees.designation_code = designations.designation_code \
                    LEFT OUTER JOIN departments ON employees.department_code = departments.department_code \
                    LEFT OUTER JOIN companies ON employees.company_code = companies.company_code \
                    LEFT OUTER JOIN emp_app_profile ON employees.emp_id =  emp_app_profile.emp_id \
                    RIGHT OUTER JOIN emp_attendance_requests_ref ON employees.emp_id = emp_attendance_requests_ref.requested_by\
                    LEFT OUTER JOIN emp_attendance_requests ON emp_attendance_requests_ref.request_id = emp_attendance_requests.id",
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
    )

} );

router.post('/attendance_request', ( req, res ) => {

    const { emp_id, subject, description, arrivalTime, arrivalFor, imageName } = req.body;
    let img = null;
    let imgName = null;
    if ( req.files )
    {
        img = req.files.image;
        imgName = imageName + '.png';
    }

    const d = new Date();

    db.getConnection(
        ( err, connection ) => {

            if ( err )
            {

                res.status(503).send(err);
                res.end();

            }else
            {
                connection.query(
                    "INSERT INTO emp_attendance_requests (request_subject, request_description, arrival_timing, arrival_for, request_image) VALUES (?,?,?,?,?)",
                    [ subject, description, arrivalTime, arrivalFor, imgName ],
                    ( err, rslt ) => {
            
                        if( err )
                        {
                            res.status(500).send(err);
                            res.end();
                            connection.release();
            
                        }else 
                        {
            
                            if ( img )
                            {
                                img.mv('client/images/att_requests_proof/' + imgName, (err) => {
                                                            
                                    if (err) {
                            
                                        res.status(500).send(err);
                                        res.end();
                                        connection.release();
                            
                                    }
                            
                                });
                            }
            
                            connection.query(
                                "SELECT id FROM emp_attendance_requests WHERE request_subject = '" + subject + "' AND request_description = '" + description + "' AND arrival_timing LIKE '%" + arrivalTime + "%'",
                                ( err, rslt ) => {
                        
                                    if( err )
                                    {

                                        res.status(500).send(err);
                                        res.end();
                                        connection.release();
                        
                                    }else 
                                    {
                        
                                        connection.query(
                                            "INSERT INTO emp_attendance_requests_ref (request_id, requested_by, request_date, request_time, request_status) VALUES (?,?,?,?,?)",
                                            [ rslt[0].id, emp_id, d, d.toTimeString(), 1 ],
                                            ( err, rslt ) => {
                                    
                                                if( err )
                                                {
                                    
                                                    res.status(500).send(err);
                                                    res.end();
                                                    connection.release();
                                    
                                                }else 
                                                {
                                    
                                                    res.send( 'done' );
                                                    res.end();
                                                    connection.release();
                                    
                                                }
                                    
                                            }
                                        )
                        
                                    }
                        
                                }
                            )
            
                        }
            
                    }
                )
            }

        }
    )

} );    

router.post('/gettodaysattendance', ( req, res ) => {

    const { empID } = req.body;

    let d = new Date();

    db.getConnection(
        ( err, connection ) => {

            if ( err )
            {

                
                res.status(503).send(err);
                res.end();

            }else
            {
                connection.query(
                    'SELECT * FROM emp_attendance WHERE emp_id = ' + empID + " AND emp_date = '" + d.getFullYear() + '-' + ( parseInt(d.getMonth() + 1).toString().length === 1 ? '0' + parseInt(d.getMonth() + 1).toString() : parseInt(d.getMonth() + 1).toString() ) + '-' + ( d.getDate().toString().length === 1 ? '0' + d.getDate().toString() : d.getDate() ) + "'",
                    ( err, rslt ) => {
            
                        if( err )
                        {

                            connection.release();
                            res.send( err );
                            res.end();
            
                        }else 
                        {
            
                            connection.release();
                            res.send( rslt );
                            res.end();
            
                        }
            
                    }
                )
            }

        }
    )

} );

router.post('/getempattdetails', ( req, res ) => {

    const { empID } = req.body;
    
    db.getConnection(
        ( err, connection ) => {

            if ( err )
            {

                res.status(503).send(err);
                res.end();

            }else
            {
                connection.query(
                    "SELECT `id`, `emp_id`, `time_in`, `time_out`, `break_in`, `break_out`, `status`, `emp_date` FROM emp_attendance WHERE emp_id = " + empID + " AND MONTH(`emp_date`) = MONTH(CURRENT_DATE()) AND YEAR(`emp_date`) = YEAR(CURRENT_DATE()) ORDER BY emp_date DESC",
                    ( err, rslt ) => {
            
                        if( err )
                        {

                            connection.release();
                            res.send( err );
                            res.end();
            
                        }else 
                        {
            
                            connection.release();
                            res.send( rslt );
                            res.end();
            
                        }
            
                    }
                )
            }

        }
    )

} );

router.post('/getweeklyattendanceperformance', ( req, res ) => {

    const { date_from, date_to } = req.body;

    let date = date_to.split('-')[0];
    let month = date_to.split('-')[1];
    let year = date_to.split('-')[2];
    let arr = [ year, month, date ];
    const d1 = new Date( date_from );
    const d2 = new Date( arr.join('-') );

    db.getConnection(
        ( err, connection ) => {

            if ( err )
            {

                res.status(503).send(err);
                res.end();

            }else
            {
                connection.query(
                    "SELECT \
                    SUM(total_ratings) as total_ratings,  \
                    SUM(emp_ratings) as emp_ratings,  \
                    COUNT(emp_id) * 20 as expected_ratings,  \
                    emp_date,  \
                    emp_id \
                    FROM emp_attendance  \
                    WHERE emp_date BETWEEN ? AND ?  \
                    GROUP BY emp_date;",
                    [ d2, d1 ],
                    ( err, rslt ) => {
            
                        if( err )
                        {

                            res.status(500).send(err);
                            res.end();
                            connection.release();
            
                        }else 
                        {
            
                            // const sql = connection.format("SELECT SUM(total_ratings) as total_ratings, SUM(emp_ratings) as emp_ratings, emp_date, emp_id FROM emp_attendance WHERE emp_date BETWEEN ? AND ? GROUP BY emp_date;",
                            // [ d2, d1 ]);
                            // console.log(sql);
                            res.send( rslt );
                            res.end();
                            connection.release();
            
                        }
            
                    }
                )
            }

        }
    )

} );

router.post('/getthatdateemployeeslist', ( req, res ) => {

    const { date_time, company } = req.body;

    db.query(
        "SELECT \
        emp_attendance.*, \
        employees.emp_id, \
        employees.time_in as timing, \
        employees.name \
        FROM emp_attendance \
        LEFT OUTER JOIN employees ON employees.emp_id = emp_attendance.emp_id \
        WHERE emp_attendance.emp_date = ? AND emp_attendance.status != 'leave' AND emp_attendance.editable = 1 AND employees.company_code = ?;",
        [ date_time, company ],
        ( err, rslt ) => {

            if ( err )
            {
                console.log( err );
            }else
            {
                res.send( rslt );
            }

        }
    )

} );

router.post('/updateemployeeattendance', ( req, res ) => {

    const {
        emp_id,
        employee_name,
        time_in,
        break_in,
        break_out,
        time_out,
        previous_time_in,
        previous_break_in,
        previous_break_out,
        previous_time_out,
        status,
        date_time,
        editor,
        editor_name,
        edit_date
    } = req.body;

    let q = '';
    let data = [];
    let date = new Date( edit_date );

    if ( time_in !== '' )
    {
        q = q.concat("UPDATE emp_attendance SET time_in = ?, edit_by = ?, edit_date = ?, editable = 0, edit_time = ? WHERE emp_id = ? AND emp_date = ?;");
        data.push(time_in, editor, date, date.toTimeString(), emp_id, date_time);
    }
    if ( break_in !== '' )
    {
        q = q.concat("UPDATE emp_attendance SET break_in = ?, edit_by = ?, edit_date = ?, editable = 0, edit_time = ? WHERE emp_id = ? AND emp_date = ?;");
        data.push(break_in, editor, date, date.toTimeString(), emp_id, date_time);
    }
    if ( break_out !== '' )
    {
        q = q.concat("UPDATE emp_attendance SET break_out = ?, edit_by = ?, edit_date = ?, editable = 0, edit_time = ? WHERE emp_id = ? AND emp_date = ?;");
        data.push(break_out, editor, date, date.toTimeString(), emp_id, date_time);
    }
    if ( time_out !== '' )
    {
        q = q.concat("UPDATE emp_attendance SET time_out = ?, edit_by = ?, edit_date = ?, editable = 0, edit_time = ? WHERE emp_id = ? AND emp_date = ?;");
        data.push(time_out, editor, date, date.toTimeString(), emp_id, date_time);
    }
    if ( status !== '' )
    {
        q = q.concat("UPDATE emp_attendance SET status = ?, edit_by = ?, edit_date = ?, editable = 0, edit_time = ? WHERE emp_id = ? AND emp_date = ?;");
        data.push(status, editor, date, date.toTimeString(), emp_id, date_time);
    }

    q = q.concat(
        'SELECT id FROM emp_attendance WHERE emp_id = ? AND emp_date = ?'
    );
    data.push( emp_id, date_time );

    db.query(
        q,
        data,
        ( err, rslt ) => {


            if ( err )
            {
                console.log( err );
            }else
            {

                let id = rslt.pop()[0].id;
                CreateLogs( 
                    'emp_attendance', 
                    id,
                    editor_name + " (" + editor + ") update the employee " + employee_name + " (" + emp_id + ") attendance record with id " + id + '. The previous timings was (' + previous_time_in + ', ' + previous_break_in + ', ' + previous_break_out + ', ' + previous_time_out + ')',
                    'info'
                )
                res.send( rslt );
            }

        }
    )

} );

router.post('/getemployeecompaniesauth', ( req, res ) => {

    const { emp_id } = req.body;

    db.query(
        "SELECT \
        invtry_emp_approval_to_related_companies.company_code, \
        employees.emp_id, \
        employees.name, \
        companies.company_name \
        FROM invtry_emp_approval_to_related_companies \
        LEFT OUTER JOIN employees ON employees.emp_id = invtry_emp_approval_to_related_companies.emp_id \
        LEFT OUTER JOIN companies ON companies.company_code = invtry_emp_approval_to_related_companies.company_code \
        WHERE invtry_emp_approval_to_related_companies.emp_id = ?;",
        [ emp_id ],
        ( err, rslt ) => {

            if ( err )
            {
                console.log( err );
            }else
            {
                res.send( rslt );
            }

        }
    )

} );

module.exports = router;