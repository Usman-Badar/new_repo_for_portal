const express = require('express');
const router = express.Router();
const db = require('../../db/connection');

router.post('/addlocation', ( req, res ) => {

    const { location_name, address, map, attendance_mode, location_phone } = req.body;

    db.getConnection(
        ( err, connection ) => {

            if ( err )
            {

                res.status(503).send(err);
                res.end();
            }else
            {
                connection.query(
                    "INSERT INTO locations (location_name, address, map, attendance_mode, location_phone) VALUES (?,?,?,?,?)",
                    [ location_name, address, map, attendance_mode, location_phone ],
                    ( err, rslt ) => {
            
                        if( err )
                        {

                            res.status(500).send(err);
                            res.end();
                            connection.release();
            
                        }else 
                        {
            
                            res.send( 'success' );
                            res.end();
                            connection.release();
            
                        }
            
                    }
                )
            }

        }
    )

} );

router.post('/updatelocation', ( req, res ) => {

    const { location_name, address, map, attendance_mode, location_phone, location_code } = req.body;

    db.getConnection(
        ( err, connection ) => {

            if ( err )
            {

                
                res.status(503).send(err);
                res.end();
            }else
            {
                connection.query(
                    "UPDATE locations SET location_name = ?, address = ?, map = ?, attendance_mode = ?, location_phone = ? WHERE location_code = ?",
                    [ location_name, address, map, attendance_mode, location_phone, location_code ],
                    ( err, rslt ) => {
            
                        if( err )
                        {
                            res.status(500).send(err);
                            res.end();
                            connection.release();
            
                        }else 
                        {
            
                            res.send( 'success' );
                            res.end();
                            connection.release();
            
                        }
            
                    }
                )
            }

        }
    )

} );

router.post('/deletelocation', ( req, res ) => {

    const { location_code } = req.body;

    db.getConnection(
        ( err, connection ) => {

            if ( err )
            {

                res.status(503).send(err);
                res.end();

            }else
            {
                connection.query(
                    "DELETE FROM locations WHERE location_code = ?",
                    [ location_code ],
                    ( err, rslt ) => {
            
                        if( err )
                        {
                            res.status(500).send(err);
                            res.end();
                            connection.release();
            
                        }else 
                        {
            
                            res.send( 'success' );
                            res.end();
                            connection.release();
            
                        }
            
                    }
                )
            }

        }
    )

} );

router.get('/getalllocations', ( req, res ) => {

    db.query(
        "SELECT * FROM locations ORDER BY location_name ASC;",
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

router.get('/getalltablocationsandmachines', ( req, res ) => {

    db.query(
        "SELECT * FROM locations WHERE attendance_mode = 'tablet';" +
        "SELECT \
        tblthumbdevices.*, \
        locations.location_name \
        FROM tblthumbdevices \
        LEFT OUTER JOIN locations ON tblthumbdevices.current_location = locations.location_code;",
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

router.post('/getalllocationemployees', ( req, res ) => {

    const { location } = req.body;

    db.getConnection(
        ( err, connection ) => {

            if ( err )
            {
                res.status(503).send(err);
                res.end();

            }else
            {
                connection.query(
                    "SELECT employees.*, departments.department_name, designations.designation_name, emp_app_profile.emp_image FROM employees LEFT OUTER JOIN emp_app_profile ON employees.emp_id = emp_app_profile.emp_id LEFT OUTER JOIN departments ON employees.department_code = departments.department_code LEFT OUTER JOIN designations ON employees.designation_code = designations.designation_code WHERE employees.location_code = " + location,
                    ( err, rslt ) => {
            
                        if( err )
                        {
            
                            res.status(500).send(err);
                            connection.release();
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

router.post('/getalllocationempswhoosenotstarttheirshift', ( req, res ) => {

    const { location } = req.body;

    db.getConnection(
        ( err, connection ) => {

            if ( err )
            {

                res.status(503).send(err);
                res.end();

            }else
            {
                connection.query(
                    "SELECT employees.*, departments.department_name, designations.designation_name, emp_attendance.time_in FROM employees LEFT OUTER JOIN departments ON employees.department_code = departments.department_code LEFT OUTER JOIN designations ON employees.designation_code = designations.designation_code LEFT OUTER JOIN emp_attendance ON employees.emp_id = emp_attendance.emp_id WHERE employees.location_code = " + location + " AND emp_attendance.emp_date IS NULL",
                    ( err, rslt ) => {
            
                        if( err )
                        {
            
                            res.status(500).send(err);
                            res.end();
                            connection.release();
            
                        }else 
                        {

                            connection.release();
                            res.end();
                            res.send( rslt );
            
                        }
            
                    }
                )
            }

        }
    )

} );

router.post('/getsearchedemployee', ( req, res ) => {

    const { srchKey, location } = req.body;

    db.getConnection(
        ( err, connection ) => {

            if ( err )
            {
                res.status(503).send(err);
                res.end();
            }else
            {
                connection.query(
                    srchKey === 'Get All'
                    ?
                    "SELECT employees.*, departments.department_name, designations.designation_name FROM employees LEFT OUTER JOIN departments ON employees.department_code = departments.department_code LEFT OUTER JOIN designations ON employees.designation_code = designations.designation_code WHERE employees.location_code = " + location
                    :
                    "SELECT employees.*, departments.department_name, designations.designation_name FROM employees LEFT OUTER JOIN departments ON employees.department_code = departments.department_code LEFT OUTER JOIN designations ON employees.designation_code = designations.designation_code WHERE employees.name LIKE '%" + srchKey + "%' AND employees.location_code = " + location,
                    ( err, rslt ) => {
            
                        if( err )
                        {
            
                            res.status(500).send(err);
                            res.end();
                            connection.release();
            
                        }else 
                        {

                            connection.release();
                            res.end();
                            res.send( rslt );
            
                        }
            
                    }
                )
            }

        }
    )

} );


// if you want to delete any location you should delete its sublocations

module.exports = router;