const express = require('express');
const router = express.Router();
const db = require('../../db/connection');

router.get('/getallgrades', ( req, res ) => {

    db.getConnection(
        ( err, connection ) => {

            if ( err )
            {
                res.status(503).send(err);
                res.end();
            }else
            {
                connection.query(
                    "SELECT * FROM emp_grades",
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