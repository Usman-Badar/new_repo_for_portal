const express = require('express');
const router = express.Router();
const db = require('../db/connection');

router.post('/workshop/auth', ( req, res ) => {

    const { id } = req.body;

    db.query(
        "SELECT * FROM `emp_app_profile` WHERE workshop_id = ?;",
        [id],
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