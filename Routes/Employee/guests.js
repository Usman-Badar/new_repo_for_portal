const express = require('express');
const router = express.Router();
const db = require('../../db/connection');

router.get('/getallguests', ( req, res ) => {

    db.query(
        "SELECT DISTINCT \
        employees.emp_id, \
        employees.name, \
        locations.location_name, \
        companies.company_name, \
        departments.department_name, \
        designations.designation_name, \
        emp_app_profile.emp_image, \
        guest_meetings.meeting_date,\
        guest_meetings.meeting_time,\
        guests.guest_image,\
        guests.guest_phone,\
        guests.guest_name\
        FROM employees \
        RIGHT OUTER JOIN guest_meetings ON employees.emp_id = guest_meetings.emp_id \
        LEFT OUTER JOIN guests ON guests.id = guest_meetings.guest_id \
        LEFT OUTER JOIN emp_app_profile ON employees.emp_id = emp_app_profile.emp_id \
        LEFT OUTER JOIN companies ON employees.company_code = companies.company_code   \
        LEFT OUTER JOIN departments ON employees.department_code = departments.department_code  \
        LEFT OUTER JOIN locations ON employees.location_code = locations.location_code  \
        LEFT OUTER JOIN designations ON employees.designation_code = designations.designation_code  \
        GROUP BY employees.emp_id DESC ORDER BY guest_meetings.id DESC;",
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
    );

} );

router.post('/getthatemployeelastguest', ( req, res ) => {

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
                    "SELECT \
                    ADDDATE(guest_meetings.meeting_date, INTERVAL 1 DAY) meeting_date, \
                    guest_meetings.meeting_time, \
                    guests.*, \
                    employees.emp_id \
                    FROM employees \
                    RIGHT OUTER JOIN guest_meetings ON employees.emp_id = guest_meetings.emp_id \
                    RIGHT OUTER JOIN guests ON guest_meetings.guest_id = guests.id \
                    WHERE employees.emp_id = " + empID + " \
                    ORDER BY guest_meetings.id DESC LIMIT 1;",
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
                );
            }

        }
    );

} );

router.post('/getthatemployeeallguests', ( req, res ) => {

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
                    "SELECT DISTINCT \
                    guests.*, \
                    employees.emp_id \
                    FROM employees \
                    RIGHT OUTER JOIN guest_meetings ON employees.emp_id = guest_meetings.emp_id \
                    RIGHT OUTER JOIN guests ON guest_meetings.guest_id = guests.id \
                    WHERE employees.emp_id = " + empID + " \
                    ORDER BY guest_meetings.id DESC;",
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
                );
            }

        }
    );

} );

router.post('/getthatempguestallmeetings', ( req, res ) => {

    const { guestID, empID } = req.body;

    db.query(
        "\
        SELECT \
        guest_meetings.meeting_date, \
        guest_meetings.meeting_time, \
        guest_meetings.guest_off_time \
        FROM employees  \
        RIGHT OUTER JOIN guest_meetings ON employees.emp_id = guest_meetings.emp_id  \
        RIGHT OUTER JOIN guests ON guest_meetings.guest_id = guests.id  \
        WHERE employees.emp_id = " + empID + " AND guest_meetings.guest_id = " + guestID + " \
        ORDER BY guest_meetings.id DESC;",
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

module.exports = router;