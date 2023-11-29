const express = require('express');
const router = express.Router();
const db = require('../../db/connection');
const fs = require('fs');

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
    console.log(mobile_id);
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
                    console.log("No Mobile")
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
    const { userInfo, startTime, endTime, date, coordinates, stopsReached } = parsed_date;

    fs.appendFile(
        'logs/testcoordinates.txt',
        data,
        'utf-8',
        ( err ) => {

            if ( err )
            {
                console.error(
                    err
                );
            }

        }
    );
    let limit = coordinates.length;
    let count = [];
    let stop_limit = stopsReached?.length;
    let stop_count = [];
    const id = coordinates[count.length].session_id?coordinates[count.length].session_id:'';
    function insertLog() {
        db.query(
            "INSERT INTO `tbl_vehcile_tracking_logs`(`session_id`, `date`, `time`, `route_id`, `latitude`, `logitude`, `speed`, `mobile_id`, `start_time`, `end_time`) VALUES (?,?,?,?,?,?,?,?,?,?);",
            [id, date, new Date(coordinates[count.length].timestamp).toTimeString(), userInfo.route_id, coordinates[count.length].coords.latitude, coordinates[count.length].coords.longitude, coordinates[count.length].coords.speed, userInfo.mobile_id, startTime, endTime],
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
                        if (stopsReached) {
                            insertStopLog();
                        }else {
                            res.send("SUCCESS");
                            res.end();
                        }
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
    function insertStopLog() {
        db.query(
            "INSERT INTO `tbl_vehcile_tracking_daily_stops_data`(`session_id`, `date`, `time_reach`, `time_start_moving`, `route_id`, `stop_id`, `mobile_id`) VALUES (?,?,?,?,?,?,?);",
            [id, date, stopsReached[stop_count.length].timeReached, stopsReached[stop_count.length].moveTime, userInfo.route_id, stopsReached[stop_count.length].stop_id, userInfo.mobile_id],
            ( err ) => {
                if( err ){
                    console.log( err );
                    res.status(500).send(err);
                    res.end();
                }else 
                {
                    if ((stop_count.length + 1) === stop_limit)
                    {
                        console.log("All stop logs inserted!!!");
                        res.send("SUCCESS");
                        res.end();
                    }else
                    {
                        console.log("Stop log inserted:", id);
                        stop_count.push(1);
                        insertStopLog();
                    }
                }
            }
        )
    };
} );

router.post('/vehicle/tracking/history', ( req, res ) => {
    const { mobile_id } = req.body;
    db.query(
        "SELECT tbl_vehcile_tracking_logs.*, tbl_vehcile_tracking_routes.* FROM `tbl_vehcile_tracking_logs` LEFT OUTER JOIN tbl_vehcile_tracking_routes ON tbl_vehcile_tracking_logs.route_id = tbl_vehcile_tracking_routes.route_id WHERE tbl_vehcile_tracking_logs.mobile_id = ? GROUP BY tbl_vehcile_tracking_logs.session_id ORDER BY tbl_vehcile_tracking_logs.id;",
        [mobile_id],
        ( err, rslt ) => {
            if( err ){
                console.log( err );
                res.status(500).send(err);
                res.end();
            }else 
            {
                res.send(rslt);
                res.end();
            }
        }
    )
} );

router.post('/vehicle/tracking/history/details', ( req, res ) => {
    const { mobile_id, session_id } = req.body;
    db.query(
        "SELECT tbl_vehcile_tracking_logs.*, tbl_vehcile_tracking_logs.logitude AS longitude FROM `tbl_vehcile_tracking_logs` WHERE session_id = ? AND mobile_id = ?;" +
        "SELECT tbl_vehcile_tracking_daily_stops_data.*, tbl_vehcile_tracking_stops.* FROM `tbl_vehcile_tracking_daily_stops_data` LEFT OUTER JOIN tbl_vehcile_tracking_stops ON tbl_vehcile_tracking_daily_stops_data.stop_id = tbl_vehcile_tracking_stops.stop_id WHERE tbl_vehcile_tracking_daily_stops_data.session_id = ? AND tbl_vehcile_tracking_daily_stops_data.mobile_id = ?;",
        [session_id, mobile_id, session_id, mobile_id],
        ( err, rslt ) => {
            if( err ){
                console.log( err );
                res.status(500).send(err);
                res.end();
            }else 
            {
                res.send(rslt);
                res.end();
            }
        }
    )
} );

module.exports = router;