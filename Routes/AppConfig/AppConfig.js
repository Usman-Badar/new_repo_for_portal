const express = require('express');
const router = express.Router();
const db = require('../../db/connection');

router.post('/setAppVer', ( req, res ) => {

    const { name, version, machine_id, device_id, msg } = req.body;

    db.query(
        "INSERT INTO tblapplog (app_id, app_name, app_ver, device_id, machine_id, log) VALUES (1,?,?,?,?,?)",
        [name, version, device_id, machine_id, msg],
        ( err, rslt ) => {

            if( err )
            {

                console.log( err );
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