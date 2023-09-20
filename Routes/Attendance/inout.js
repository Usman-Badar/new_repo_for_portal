const express = require('express');
const router = express.Router();
const db = require('../../db/connection');

router.post('/deviceinout', ( req, res ) => {

    const { EmpID, date, time, location } = req.body;

    db.getConnection(
        ( err, connection ) => {

            if ( err )
            {

                res.status(503).send(err);
                res.end();

            }else
            {
                connection.query(
                    "INSERT INTO emp_machine_thumbs (emp_id, date, time, location, status) VALUES (?,?,?,?,?)",
                    [ EmpID, date, time, location, 'Waiting' ],
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

router.post('/getempinout', ( req, res ) => {

    const { machine } = req.body;

    const d = new Date();

    db.query(
        "SELECT * FROM emp_machine_thumbs WHERE device_id = '" + machine + "' AND status = 'Waiting' AND date= '" + d.getFullYear() + '-' + parseInt(d.getMonth() + 1) + '-' + d.getDate() + "' GROUP BY id ASC LIMIT 1",
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

router.post('/getempinoutsdetails', ( req, res ) => {

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
                    "SELECT DISTINCT emp_machine_thumbs.date, COUNT(emp_machine_thumbs.emp_id) AS inouts FROM emp_machine_thumbs WHERE emp_machine_thumbs.emp_id = " + empID,
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

module.exports = router;