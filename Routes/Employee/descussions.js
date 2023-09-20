const express = require('express');
const router = express.Router();
const db = require('../../db/connection');

router.get('/prevdescussions', ( req, res ) => {

    db.getConnection(
        ( err, connection ) => {

            if ( err )
            {

                res.status(503).send(err);
                res.end();

            }else
            {
                connection.query(
                    'SELECT employees.name, employees.father_name, emp_app_profile.login_id, emp_app_profile.emp_image, descussions.* FROM descussions LEFT OUTER JOIN employees ON employees.emp_id = descussions.emp_id LEFT OUTER JOIN emp_app_profile ON employees.emp_id = emp_app_profile.emp_id GROUP BY id desc',
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