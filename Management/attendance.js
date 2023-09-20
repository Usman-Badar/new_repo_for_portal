const express = require('express');
const router = express.Router();
const db = require('../db/connection');

router.get('/management/monthly_attendance/load_data', ( req, res ) => {

    db.query(
        "SELECT * FROM `companies`;" +
        "SELECT * FROM `locations`;",
        ( err, rslt ) => {

            if( err )
            {

                res.send(err);
                res.end();

            }else 
            {
                
                res.send( rslt );
                res.end();
                
            }
            
        }
    )

} );

router.post('/management/monthly_attendance/load_attendance', ( req, res ) => {

    const { company, location, date } = req.body;

    db.query(
        "SELECT  \
        emp_attendance.status \
        FROM  \
        emp_attendance  \
        INNER JOIN employees ON employees.emp_id = emp_attendance.emp_id  \
        WHERE employees.company_code = ? AND employees.location_code = ? AND MONTH(emp_attendance.emp_date) = ? AND YEAR(emp_attendance.emp_date) = ? \
        GROUP BY emp_attendance.status;" +
        "SELECT  \
        COUNT(emp_attendance.id) AS count, \
        emp_attendance.status, \
        emp_attendance.emp_date \
        FROM  \
        emp_attendance  \
        INNER JOIN employees ON employees.emp_id = emp_attendance.emp_id  \
        WHERE employees.company_code = ? AND employees.location_code = ? AND MONTH(emp_attendance.emp_date) = ? AND YEAR(emp_attendance.emp_date) = ? \
        GROUP BY emp_attendance.emp_date;",
        [ 
            company, location, date.split('-').pop(), date.split('-').shift(),
            company, location, date.split('-').pop(), date.split('-').shift()
        ],
        ( err, rslt ) => {

            if( err )
            {

                res.send(err);
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