const express = require('express');
const router = express.Router();
const db = require('../../db/connection');

router.get('/getallattdevices', ( req, res ) => {
    
    db.getConnection(
        ( err, connection ) => {

            if ( err )
            {

                res.status(503).send(err);
                res.end();

            }else
            {
                connection.query(
                    "SELECT att_devices.*, locations.location_name FROM locations LEFT OUTER JOIN att_devices ON locations.location_code = att_devices.location_code WHERE locations.attendance_mode = 'tablet'",
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

router.post('/setattdevice', ( req, res ) => {

    const { DevName, DevLocation, DevCode } = req.body;

    db.getConnection(
        ( err, connection ) => {

            if ( err )
            {

                res.status(503).send(err);
                res.end();

            }else
            {
                connection.query(
                    "INSERT INTO att_devices ( location_code, device_name, device_code ) VALUES (?,?,?)",
                    [ DevLocation, DevName, DevCode ],
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

router.post('/savenewdevice', ( req, res ) => {

    const { device_name, device_machine, device_browser } = req.body;

    db.query(
        "INSERT INTO `att_devices`(`device_name`, `device_browser`, `machine_id`) VALUES (?,?,?);",
        [ device_name, device_browser, device_machine ],
        ( err ) => {

            if( err )
            {

                console.log( err );
                res.status(500).send(err);
                res.end();

            }else 
            {

                res.send( 'success' );
                res.end();

            }

        }
    )

} );

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

router.post('/getlocationdevices', ( req, res ) => {

    const { location_id } = req.body;

    db.query(
        "SELECT * FROM `tblthumbdevices` WHERE current_location = ?;",
        [ location_id ],
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

router.post('/getmachinetablets', ( req, res ) => {

    const { machine_Id } = req.body;

    db.query(
        "SELECT * FROM `att_devices` WHERE machine_id = ?;",
        [ machine_Id ],
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