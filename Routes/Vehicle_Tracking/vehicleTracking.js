const express = require('express');
const router = express.Router();
const db = require('../../db/connection');

router.post('/vehicle/tracking/mobile', ( req, res ) => {
    const { code } = req.body;
    db.query(
        "SELECT * FROM `tbl_vehcile_tracking_app_mobiles` WHERE logged_in = 0 AND code = ?;",
        [code],
        ( err, rslt ) => {
            if( err ){
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

router.post('/vehicle/tracking/mobile/login', ( req, res ) => {
    const { mobile_id } = req.body;
    db.query(
        "UPDATE `tbl_vehcile_tracking_app_mobiles` SET logged_in = 1 WHERE logged_in = 0 AND mobile_id = ?;",
        [mobile_id],
        ( err ) => {
            if( err ){
                console.log( err );
                res.status(500).send(err);
                res.end();
            }else 
            {
                res.send('success');
                res.end();
            }
        }
    )
} );

router.post('/vehicle/tracking/route', ( req, res ) => {
    const { mobile_id } = req.body;
    db.query(
        "SELECT route_id FROM `tbl_vehcile_tracking_app_mobiles` WHERE mobile_id = ?;",
        [mobile_id],
        ( err, result ) => {
            if( err ){
                console.log( err );
                res.status(500).send(err);
                res.end();
            }else 
            {
                if (!result[0]) {
                    res.status(500).send("Invalid Mobile ID");
                    res.end();
                }else {
                    db.query(
                        "SELECT \
                        `tbl_vehcile_tracking_route_stops`.*, \
                        `tbl_vehcile_tracking_stops`.* \
                        FROM `tbl_vehcile_tracking_route_stops` \
                        LEFT OUTER JOIN tbl_vehcile_tracking_stops ON tbl_vehcile_tracking_route_stops.stop_id = tbl_vehcile_tracking_stops.stop_id \
                        WHERE tbl_vehcile_tracking_route_stops.route_id = ? ORDER BY tbl_vehcile_tracking_route_stops.stop_id;",
                        [result[0].route_id],
                        ( err, rslt ) => {
                            if( err ){
                                console.log( err );
                                res.status(500).send(err);
                                res.end();
                            }else 
                            {
                                res.send([rslt, result[0]]);
                                res.end();
                            }
                        }
                    )
                }
            }
        }
    )
} );

router.post('/vehicle/tracking/save', ( req, res ) => {
    const { data } = req.body;
    const parsed_date = JSON.parse(data);
    const { id, userInfo, startTime, endTime, date, coordinates, stopsReached } = parsed_date;
    
    console.log(coordinates.length);
    console.log(stopsReached);
    let limit = coordinates.length;
    let count = [];
    function insertLog() {
        db.query(
            "INSERT INTO `tbl_vehcile_tracking_logs`(`session_id`, `date`, `time`, `route_id`, `latitude`, `logitude`, `speed`, `mobile_id`, `start_time`, `end_time`) VALUES (?,?,?,?,?,?,?,?,?,?);",
            [id?id:'', date, new Date(coordinates[count.length].timestamp).toTimeString(), userInfo.route_id, coordinates[count.length].coords.latitude, coordinates[count.length].coords.longitude, coordinates[count.length].coords.speed, userInfo.mobile_id, startTime, endTime],
            ( err ) => {
                if( err ){
                    console.log( err );
                    res.status(500).send(err);
                    res.end();
                }else 
                {
                    if ((count.length + 1) === limit)
                    {
                        console.log("All logs inserted!!!");
                        res.send("SUCCESS");
                        res.end();
                    }else
                    {
                        console.log("Log inserted:", id);
                        count.push(1);
                        insertLog();
                    }
                }
            }
        )
    };
    insertLog();
} );

module.exports = router;