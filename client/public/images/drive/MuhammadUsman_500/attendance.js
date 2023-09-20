const express = require('express');
const router = express.Router();
const db = require('../../db/connection');

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

                            connection.release();
                            res.send( err );
            
                        }else 
                        {

                            connection.release();
                            res.send( rslt );
            
                        }
            
                    }
                )
            }

        }
    )

} );

router.post('/allemployeesattcompanywiseaccordingtodate', ( req, res ) => {

    const { CompanyCode, DateFrom, DateTo } = req.body;

    db.getConnection(
        ( err, connection ) => {

            if ( err )
            {
                res.status(503).send(err);
                res.end();

            }else
            {
                const abc = connection.query(
                    "SELECT emp_attendance.`id`, emp_attendance.`emp_id`, emp_attendance.`time_in`, emp_attendance.`time_out`, emp_attendance.`status`, emp_attendance.`break_in`, emp_attendance.`break_out`, ADDDATE(emp_attendance.emp_date, INTERVAL 1 DAY) `emp_date`, employees.company_code, employees.name, employees.emp_id FROM employees LEFT OUTER JOIN emp_attendance ON employees.emp_id = emp_attendance.emp_id WHERE employees.company_code = " + CompanyCode + " AND emp_attendance.emp_date BETWEEN '" + DateFrom + "' AND '" + DateTo + "' ORDER BY emp_attendance.emp_date DESC;",
                    ( err, rslt ) => {
                        console.log(abc.sql)
                        if( err )
                        {

                            connection.release();
                            res.send( err );
            
                        }else 
                        {
            
                            connection.release();
                            res.send( rslt );
            
                        }
            
                    }
                )
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

                            connection.release();
                            res.send(err);
        
                        } else {
        
                            connection.release();
                            res.send(rslt);
        
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
            
                            connection.release();
                            res.send( err );
            
                        }else 
                        {
            
                            if ( img )
                            {
                                img.mv('client/images/att_requests_proof/' + imgName, (err) => {
                                                            
                                    if (err) {
                            
                                        connection.release();
                                        res.send( err );
                            
                                    }
                            
                                });
                            }
            
                            connection.query(
                                "SELECT id FROM emp_attendance_requests WHERE request_subject = '" + subject + "' AND request_description = '" + description + "' AND arrival_timing LIKE '%" + arrivalTime + "%'",
                                ( err, rslt ) => {
                        
                                    if( err )
                                    {

                                        connection.release();
                                        res.send( err );
                        
                                    }else 
                                    {
                        
                                        connection.query(
                                            "INSERT INTO emp_attendance_requests_ref (request_id, requested_by, request_date, request_time, request_status) VALUES (?,?,?,?,?)",
                                            [ rslt[0].id, emp_id, d, d.toTimeString(), 1 ],
                                            ( err, rslt ) => {
                                    
                                                if( err )
                                                {
                                    
                                                    connection.release();
                                                    res.send( err );
                                    
                                                }else 
                                                {
                                    
                                                    connection.release();
                                                    res.send( 'done' );
                                    
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
            
                        }else 
                        {
            
                            connection.release();
                            res.send( rslt );
            
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
                    "SELECT `id`, `emp_id`, `time_in`, `time_out`, `break_in`, `break_out`, `status`, `emp_date` FROM emp_attendance WHERE emp_id = " + empID + " ORDER BY emp_date DESC",
                    ( err, rslt ) => {
            
                        if( err )
                        {

                            connection.release();
                            res.send( err );
            
                        }else 
                        {
            
                            connection.release();
                            res.send( rslt );
            
                        }
            
                    }
                )
            }

        }
    )

} );

module.exports = router;