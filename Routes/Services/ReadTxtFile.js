const express = require('express');
const router = express.Router();
const db = require('../../db/connection');
const fileRead = require('fs');
const moment = require('moment');
const { SendWhatsappNotification } = require('../Whatsapp/whatsapp');
// const axios = require('axios');

router.post('/servers/connectivity', ( req, res ) => {
    const { server } = req.body;
    if (fileRead.existsSync('./servers/' + server)) {
        enterLog();
    }else {
        fileRead.mkdirSync('./servers/' + server, { recursive: true });
        enterLog();
    }
    function enterLog() {
        const date = new Date().toISOString().substring(0,10);
        fileRead.appendFile('servers/' + server + '/' + date + '.txt',
            `\n${new Date().toTimeString()}`, 'utf-8',
            ( err ) => {
                if ( err ) throw err;
                res.send("SUCCESS");
                res.end();
            }
        );
    }
} );
setInterval(() => {
    checkServersConnectivity();
}, 1000 * 60);

const checkServersConnectivity = () => {
    const date = new Date().toISOString().substring(0,10);
    fileRead.readdir('./servers', (_, servers) => {
        servers.forEach(server => {
            if (fileRead.existsSync(`./servers/${server}/${date}.txt`)) {
                checkLastTime(`./servers/${server}/${date}.txt`, server);
            }else {
                notifyITDept(`./servers/${server}/${date}.txt`, server);
            }
        });
    });

    async function checkLastTime(path, server) {
        const data = await fileRead.promises.readFile(path, {encoding: "utf-8"});
        const lastTime = data.split("\n").pop();
        const currentTime = new Date().toTimeString();

        if (!lastTime.includes('notification sent:') && getTimeInterval(lastTime, currentTime) < -1) {
            notifyITDept(path, server);
        }
    }
    function getTimeInterval(startTime, endTime){
        return moment.duration(moment(startTime,"hh:mm").diff(moment(endTime,"hh:mm"))).asMinutes();
    }
    function notifyITDept(path, server) {
        SendWhatsappNotification( null, null, "Hello Usman Badar", `${server} server has lost it's connection with the head office server, please check.`, '03303744620');
        fileRead.appendFile(path,
            `\nnotification sent: ${new Date().toTimeString()}`, 'utf-8',
            ( err ) => {
                if ( err ) throw err;
            }
        );
    }
}






























router.get('/get_attendance_employees_devices', ( req, res ) => {

    db.query(
        "SELECT employees.emp_id, employees.location_code, employees.time_in, employees.time_out FROM employees;" +
        "SELECT device_id, current_location FROM tblthumbdevices;" +
        "SELECT tbl_temp_employees.temp_emp_id, tbl_temp_employees.location_code FROM tbl_temp_employees;",
        ( err, rslt ) => {
    
            if ( err )
            {
                console.log( err );
                res.send( err );
                res.end();
            }else
            {
                res.send( rslt );
                res.end();
            }
    
        }
    )

} );

router.post('/mark_employees_thumbs', ( req, res ) => {

    const { data } = req.body;
    const employees_thumbs = JSON.parse( data );
    let limit = employees_thumbs.length;
    let count = [];
    function markThumbs()
    {
        const d = new Date(employees_thumbs[count.length].emp_date);
        db.query(
            "INSERT INTO emp_machine_thumbs (emp_id, date, time, location, status, device_id) VALUES (?,?,?,?,?,?)",
            [employees_thumbs[count.length].emp_id, d, employees_thumbs[count.length].time, employees_thumbs[count.length].location, 'valid', employees_thumbs[count.length].device_id],
            ( err ) => {
                if( err )
                {
                    console.log( err );
                    res.send( err );
                    res.end();
                }else
                {
                    if ( ( count.length + 1 ) === limit )
                    {
                        console.log("THUMBS MARKED!!!");
                        res.send("SUCCESS");
                        res.end();
                    }else
                    {
                        console.log("THUMBS UPDATED AT: ", new Date().toTimeString());
                        count.push(1);
                        markThumbs();
                    }
                }
            }
        );
    }
    markThumbs();

} );

router.post('/mark_employees_attendance', ( req, res ) => {

    const { data } = req.body;
    const employees_attendance = JSON.parse( data );
    let limit = employees_attendance.length;
    let count = [];
    function checkProgress( connection, res, status, d, in_out, name, cell, markAttendance )
    {
        // if ( in_out === "IN" ) {
        //     let message = "Your time has been marked " + d + " with the status '" + status + "'.";
        //     SendWhatsappNotification( 
        //         null, 
        //         null, 
        //         "Hi " + name, 
        //         message, 
        //         cell 
        //     );
        // }else {
        //     SendWhatsappNotification( 
        //         null, 
        //         null, 
        //         "Hi " + name, 
        //         "We hope this message finds you well. We wanted to inform you that your time out has been successfully recorded in our system. Your exit time was " + new Date().toTimeString() + ".", 
        //         cell 
        //     );
        // }
        if ( ( count.length + 1 ) === limit )
        {
            connection.commit((err) => {
                if ( err ) {
                    connection.rollback(() => {console.log(err);connection.release();});
                    res.send('err');
                    res.end();
                }else
                {
                    connection.release();
                    console.log("ATTENDANCE MARKED!!!");
                    res.send("SUCCESS");
                    res.end();
                }
            });
        }else
        {
            console.log("ATTENDANCE UPDATED AT: ", new Date().toTimeString());
            count.push(1);
            markAttendance();
        }
    }
    db.getConnection(
        ( err, connection ) => {
            connection.beginTransaction(
                ( err ) => {
                    if ( err )
                    {
                        connection.rollback(() => {console.log(err);connection.release();});
                    }else
                    {
                        connection.query(
                            "SELECT * FROM `tbl_holidays`;",
                            ( err, holidays ) => {
                                if( err )
                                {
                                    connection.rollback(() => {console.log(err);connection.release();});
                                    res.send('err');
                                    res.end();
                                }else 
                                {
                                    function markAttendance()
                                    {
                                        const d = new Date(employees_attendance[count.length].emp_date);
                                        let status = employees_attendance[count.length].status;
                                        if ( employees_attendance[count.length].in_out === 'IN' )
                                        {
                                            connection.query(
                                                "SELECT emp_id, time_in, time_out FROM emp_attendance WHERE emp_id = ? AND emp_date = ?;",
                                                [ employees_attendance[count.length].emp_id, d.getFullYear() + '-' + ( parseInt(d.getMonth() + 1).toString().length === 1 ? '0' + parseInt(d.getMonth() + 1).toString() : parseInt(d.getMonth() + 1).toString() ) + '-' + ( d.getDate().toString().length === 1 ? '0' + d.getDate().toString() : d.getDate() ) ],
                                                ( err, rslt ) => {
                                                    if( err )
                                                    {
                                                        connection.rollback(() => {console.log(err);connection.release();});
                                                        res.send('err');
                                                        res.end();
                                                    }else 
                                                    {
                                                        for ( let x = 0; x < holidays.length; x++ )
                                                        {
                                                            const h_d = new Date(holidays[x].day).toISOString().slice(0, 10).replace('T', ' ');
                                                            const iso_d = d.toISOString().slice(0, 10).replace('T', ' ');

                                                            if (h_d === iso_d)
                                                            {
                                                                status = holidays[x].status;
                                                            }
                                                        }
                                                        if ( !rslt[0] )
                                                        {
                                                            connection.query(
                                                                "INSERT INTO `emp_attendance`(`emp_id`, `status`, `time_in`, `emp_date`) VALUES (?,?,?,?);" +
                                                                "SELECT name, cell FROM employees WHERE emp_id = ?;",
                                                                [ employees_attendance[count.length].emp_id, status, employees_attendance[count.length].time, d, employees_attendance[count.length].emp_id ],
                                                                ( err, result ) => {
                                                                    if( err )
                                                                    {
                                                                        connection.rollback(() => {console.log(err);connection.release();});
                                                                        res.send('err');
                                                                        res.end();
                                                                    }else 
                                                                    {
                                                                        console.log("RECORD INSERTED REF# - EMP-ID => (" + employees_attendance[count.length].emp_id + ") AT: ", new Date().toTimeString());
                                                                        checkProgress( connection, res, status, d, employees_attendance[count.length].in_out, result[1][0].name, result[1][0].cell, markAttendance );
                                                                    }
                                                                }
                                                            );
                                                        }else
                                                        {
                                                            let query = "";
                                                            let params = [];
                                                            if ( rslt[0].time_in === 'null' || rslt[0].time_in === null || employees_attendance[count.length].time < rslt[0].time_in )
                                                            {
                                                                query = "UPDATE `emp_attendance` SET time_in = ? WHERE emp_id = ? AND emp_date = ?;SELECT name, cell FROM employees WHERE emp_id = ?;";
                                                                params = [
                                                                    employees_attendance[count.length].time,
                                                                    employees_attendance[count.length].emp_id, 
                                                                    d.getFullYear() + '-' + ( parseInt(d.getMonth() + 1).toString().length === 1 ? '0' + parseInt(d.getMonth() + 1).toString() : parseInt(d.getMonth() + 1).toString() ) + '-' + ( d.getDate().toString().length === 1 ? '0' + d.getDate().toString() : d.getDate() ),
                                                                    employees_attendance[count.length].emp_id
                                                                ]
                                                            }else
                                                            {
                                                                query = "UPDATE `emp_attendance` SET time_out = ? WHERE emp_id = ? AND emp_date = ?;SELECT name, cell FROM employees WHERE emp_id = ?;";
                                                                params = [
                                                                    employees_attendance[count.length].time,
                                                                    employees_attendance[count.length].emp_id, 
                                                                    d.getFullYear() + '-' + ( parseInt(d.getMonth() + 1).toString().length === 1 ? '0' + parseInt(d.getMonth() + 1).toString() : parseInt(d.getMonth() + 1).toString() ) + '-' + ( d.getDate().toString().length === 1 ? '0' + d.getDate().toString() : d.getDate() ),
                                                                    employees_attendance[count.length].emp_id
                                                                ]
                                                            }
                                                            connection.query(
                                                                query,params,
                                                                ( err, result ) => {
                                                                    if( err )
                                                                    {
                                                                        connection.rollback(() => {console.log(err);connection.release();});
                                                                        res.send('err');
                                                                        res.end();
                                                                    }else 
                                                                    {
                                                                        console.log("RECORD UPDATED REF# - EMP-ID => (" + employees_attendance[count.length].emp_id + ") AT: ", new Date().toTimeString());
                                                                        checkProgress( connection, res, status, d, employees_attendance[count.length].in_out, result[1][0].name, result[1][0].cell, markAttendance );
                                                                    }
                                                                }
                                                            );
                                                        }
                                                    }
                                                }
                                            );
                                        }else
                                        {
                                            connection.query(
                                                "SELECT emp_id, time_in, time_out FROM emp_attendance WHERE emp_id = ? AND emp_date = ?;",
                                                [ employees_attendance[count.length].emp_id, d.getFullYear() + '-' + ( parseInt(d.getMonth() + 1).toString().length === 1 ? '0' + parseInt(d.getMonth() + 1).toString() : parseInt(d.getMonth() + 1).toString() ) + '-' + ( d.getDate().toString().length === 1 ? '0' + d.getDate().toString() : d.getDate() ) ],
                                                ( err, rslt ) => {
                                                    if( err )
                                                    {
                                                        connection.rollback(() => {console.log(err);connection.release();});
                                                        res.send('err');
                                                        res.end();
                                                    }else 
                                                    {
                                                        for ( let x = 0; x < holidays.length; x++ )
                                                        {
                                                            const h_d = new Date(holidays[x].day).toISOString().slice(0, 10).replace('T', ' ');
                                                            const iso_d = d.toISOString().slice(0, 10).replace('T', ' ');

                                                            if (h_d === iso_d)
                                                            {
                                                                status = holidays[x].status;
                                                            }
                                                        }
                                                        if ( !rslt[0] )
                                                        {
                                                            connection.query(
                                                                "INSERT INTO `emp_attendance`(`emp_id`, `status`, `time_out`, `emp_date`) VALUES (?,?,?,?);" +
                                                                "SELECT name, cell FROM employees WHERE emp_id = ?;",
                                                                [ employees_attendance[count.length].emp_id, status, employees_attendance[count.length].time, d, employees_attendance[count.length].emp_id ],
                                                                ( err, result ) => {
                                                                    if( err )
                                                                    {
                                                                        connection.rollback(() => {console.log(err);connection.release();});
                                                                        res.send('err');
                                                                        res.end();
                                                                    }else 
                                                                    {
                                                                        console.log("RECORD INSERTED REF# - EMP-ID => (" + employees_attendance[count.length].emp_id + ") AT: ", new Date().toTimeString());
                                                                        checkProgress( connection, res, status, d, employees_attendance[count.length].in_out, result[1][0].name, result[1][0].cell, markAttendance );
                                                                    }
                                                                }
                                                            );
                                                        }else
                                                        {
                                                            connection.query(
                                                                "UPDATE `emp_attendance` SET time_out = ? WHERE emp_id = ? AND emp_date = ?;" +
                                                                "SELECT name, cell FROM employees WHERE emp_id = ?;",
                                                                [
                                                                    employees_attendance[count.length].time,
                                                                    employees_attendance[count.length].emp_id, 
                                                                    d.getFullYear() + '-' + ( parseInt(d.getMonth() + 1).toString().length === 1 ? '0' + parseInt(d.getMonth() + 1).toString() : parseInt(d.getMonth() + 1).toString() ) + '-' + ( d.getDate().toString().length === 1 ? '0' + d.getDate().toString() : d.getDate() ),
                                                                    employees_attendance[count.length].emp_id, 
                                                                ],
                                                                ( err, result ) => {
                                                                    if( err )
                                                                    {
                                                                        connection.rollback(() => {console.log(err);connection.release();});
                                                                        res.send('err');
                                                                        res.end();
                                                                    }else 
                                                                    {
                                                                        console.log("RECORD UPDATED REF# - EMP-ID => (" + employees_attendance[count.length].emp_id + ") AT: ", new Date().toTimeString());
                                                                        checkProgress( connection, res, status, d, employees_attendance[count.length].in_out, result[1][0].name, result[1][0].cell, markAttendance );
                                                                    }
                                                                }
                                                            );
                                                        }
                                                    }
                                                }
                                            );
                                        }
                                    }
                                    markAttendance();
                                }
                            }
                        );
                    }
                }
            )
        }
    )
});

router.post('/mark_employees_attendance_qfs_port', ( req, res ) => {

    const { data } = req.body;
    const employees_attendance = JSON.parse( data );

    db.query(
        "SELECT * FROM `tbl_holidays`;",
        ( err, holidays ) => {
    
            if ( err )
            {
                console.log( err );
            }else
            {
                for ( let x = 0; x < employees_attendance.length; x++ )
                {
                    const d = new Date(employees_attendance[x].emp_date);
                    const date_time = (d.getFullYear() + '-' + ( parseInt(d.getMonth() + 1).toString().length === 1 ? '0' + parseInt(d.getMonth() + 1).toString() : parseInt(d.getMonth() + 1).toString() ) + '-' + ( d.getDate().toString().length === 1 ? '0' + d.getDate().toString() : d.getDate() ));
                    let status = employees_attendance[x].status;
                    console.log(date_time);

                    if ( employees_attendance[x].in_out === 'IN' )
                    {
                        let query = db.query(
                            "SELECT emp_id, time_in, time_out FROM emp_attendance WHERE emp_id = ? AND emp_date = ?;",
                            [ employees_attendance[x].emp_id, date_time ],
                            ( err, rslt ) => {
                        
                                console.log("IN: ", query.sql);
                                console.log("IN: ", rslt);
                                if ( err )
                                {
                                    console.log( err );
                                }else
                                {
    
                                    for ( let x = 0; x < holidays.length; x++ )
                                    {
                                        const h_d = new Date(holidays[x].day);
    
                                        if ( ( h_d.getFullYear() + '-' + (h_d.getMonth() + 1) + '-' + h_d.getDate() ) === ( d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() ) )
                                        {
                                            status = holidays[x].status;
                                        }
                                    }

                                    if ( !rslt[0] )
                                    {
                                        db.query(
                                            "INSERT INTO `emp_attendance`(`emp_id`, `status`, `time_in`, `emp_date`) VALUES (?,?,?,?);",
                                            [ employees_attendance[x].emp_id, status, employees_attendance[x].time, d ],
                                            ( err ) => {
                                        
                                                if ( err )
                                                {
                                                    console.log( err );
                                                }else
                                                {
                                                    console.log("RECORD INSERTED REF# - EMP-ID => (" + employees_attendance[x].emp_id + ") AT: ", new Date().toTimeString());
                                                }
                                        
                                            }
                                        )
                                    }else
                                    {
                                        db.query(
                                            "UPDATE `emp_attendance` SET time_in = ?, status = ? WHERE emp_id = ? AND emp_date = ?;",
                                            [ 
                                                rslt[0].time_in === 'null' || employees_attendance[x].time < rslt[0].time_in || rslt[0].time_in === null
                                                ?
                                                employees_attendance[x].time
                                                :
                                                rslt[0].time_in,
                                                employees_attendance[x].status,
                                                employees_attendance[x].emp_id, 
                                                d.getFullYear() + '-' + ( parseInt(d.getMonth() + 1).toString().length === 1 ? '0' + parseInt(d.getMonth() + 1).toString() : parseInt(d.getMonth() + 1).toString() ) + '-' + ( d.getDate().toString().length === 1 ? '0' + d.getDate().toString() : d.getDate() ) 
                                            ],
                                            ( err ) => {
                                        
                                                if ( err )
                                                {
                                                    console.log( err );
                                                }else
                                                {
                                                    console.log("RECORD UPDATED REF# - EMP-ID => (" + employees_attendance[x].emp_id + ") AT: ", new Date().toTimeString());
                                                }
                                        
                                            }
                                        )
                                    }
                                }
                        
                            }
                        )
                    }else
                    {
                        let query = db.query(
                            "SELECT emp_id, time_in, time_out FROM emp_attendance WHERE emp_id = ? AND emp_date = ?;",
                            [ employees_attendance[x].emp_id, date_time ],
                            ( err, rslt ) => {
                        
                                console.log("OUT: ", query.sql);
                                console.log("OUT: ", rslt);
                                if ( err )
                                {
                                    console.log( err );
                                }else
                                {
    
                                    for ( let x = 0; x < holidays.length; x++ )
                                    {
                                        const h_d = new Date(holidays[x].day);
    
                                        if ( ( h_d.getFullYear() + '-' + (h_d.getMonth() + 1) + '-' + h_d.getDate() ) === ( d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() ) )
                                        {
                                            status = holidays[x].status;
                                        }
                                    }

                                    if ( !rslt[0] )
                                    {
                                        db.query(
                                            "INSERT INTO `emp_attendance`(`emp_id`, `status`, `time_out`, `emp_date`) VALUES (?,?,?,?);",
                                            [ employees_attendance[x].emp_id, status, employees_attendance[x].time, d ],
                                            ( err ) => {
                                        
                                                if ( err )
                                                {
                                                    console.log( err );
                                                }else
                                                {
                                                    console.log("RECORD INSERTED REF# - EMP-ID => (" + employees_attendance[x].emp_id + ") AT: ", new Date().toTimeString());
                                                }
                                        
                                            }
                                        )
                                    }else
                                    {
                                        db.query(
                                            "UPDATE `emp_attendance` SET time_out = ? WHERE emp_id = ? AND emp_date = ?;",
                                            [
                                                employees_attendance[x].time,
                                                employees_attendance[x].emp_id, 
                                                d.getFullYear() + '-' + ( parseInt(d.getMonth() + 1).toString().length === 1 ? '0' + parseInt(d.getMonth() + 1).toString() : parseInt(d.getMonth() + 1).toString() ) + '-' + ( d.getDate().toString().length === 1 ? '0' + d.getDate().toString() : d.getDate() ) 
                                            ],
                                            ( err ) => {
                                        
                                                if ( err )
                                                {
                                                    console.log( err );
                                                }else
                                                {
                                                    console.log("RECORD UPDATED REF# - EMP-ID => (" + employees_attendance[x].emp_id + ") AT: ", new Date().toTimeString());
                                                }
                                        
                                            }
                                        )
                                    }
                                }
                        
                            }
                        )
                    }
            
                    if ( ( x + 1 ) === employees_attendance.length )
                    {
                        res.send("SUCCESS");
                        res.end();
                    }
            
                }
            }
    
        }
    )

})

router.post('/mark_temp_employees_attendance', ( req, res ) => {

    const { data } = req.body;
    const employees_attendance = JSON.parse( data );
    let limit = employees_attendance.length;
    let count = [];
    function checkProgress( connection, res, markAttendance )
    {
        if ( ( count.length + 1 ) === limit )
        {
            connection.commit((err) => {
                if ( err ) {
                    connection.rollback(() => {console.log(err);connection.release();});
                    res.send('err');
                    res.end();
                }else
                {
                    connection.release();
                    console.log("TEMP ATTENDANCE MARKED!!!");
                    res.send("SUCCESS");
                    res.end();
                }
            });
        }else
        {
            console.log("TEMP ATTENDANCE UPDATED AT: ", new Date().toTimeString());
            count.push(1);
            markAttendance();
        }
    }
    db.getConnection(
        ( err, connection ) => {
            connection.beginTransaction(
                ( err ) => {
                    if ( err )
                    {
                        connection.rollback(() => {console.log(err);connection.release();});
                    }else
                    {
                        function markAttendance()
                        {
                            const d = new Date(employees_attendance[count.length].emp_date);
                            const date = d.toISOString().slice(0, 10).replace('T', ' ');
                            if ( employees_attendance[count.length].in_out === 'IN' )
                            {
                                connection.query(
                                    "SELECT emp_id, time_in, time_out FROM temp_emp_attendance WHERE emp_id = ? AND emp_date = ?;",
                                    [ employees_attendance[count.length].emp_id, date ],
                                    ( err, rslt ) => {
                                        if( err )
                                        {
                                            connection.rollback(() => {console.log(err);connection.release();});
                                            res.send('err');
                                            res.end();
                                        }else 
                                        {
                                            if ( !rslt[0] )
                                            {
                                                connection.query(
                                                    "INSERT INTO `temp_emp_attendance`(`emp_id`, `time_in`, `emp_date`) VALUES (?,?,?);",
                                                    [ employees_attendance[count.length].emp_id, employees_attendance[count.length].time, d ],
                                                    ( err ) => {
                                                        if( err )
                                                        {
                                                            connection.rollback(() => {console.log(err);connection.release();});
                                                            res.send('err');
                                                            res.end();
                                                        }else 
                                                        {
                                                            console.log("RECORD INSERTED REF# - EMP-ID => (" + employees_attendance[count.length].emp_id + ") AT: ", new Date().toTimeString());
                                                            checkProgress( connection, res, markAttendance );
                                                        }
                                                    }
                                                );
                                            }else
                                            {
                                                let query = "";
                                                let params = [];
                                                if ( rslt[0].time_in == 'null' || rslt[0].time_in == null || employees_attendance[count.length].time < rslt[0].time_in )
                                                {
                                                    query = "UPDATE `temp_emp_attendance` SET time_in = ? WHERE emp_id = ? AND emp_date = ?;";
                                                    params = [ employees_attendance[count.length].time, employees_attendance[count.length].emp_id, date ];
                                                }else
                                                {
                                                    query = "UPDATE `temp_emp_attendance` SET time_out = ? WHERE emp_id = ? AND emp_date = ?;";
                                                    params = [ employees_attendance[count.length].time, employees_attendance[count.length].emp_id, date ];
                                                }
                                                connection.query(
                                                    query,params,
                                                    ( err ) => {
                                                        if( err )
                                                        {
                                                            connection.rollback(() => {console.log(err);connection.release();});
                                                            res.send('err');
                                                            res.end();
                                                        }else 
                                                        {
                                                            console.log("RECORD UPDATED REF# - EMP-ID => (" + employees_attendance[count.length].emp_id + ") AT: ", new Date().toTimeString());
                                                            checkProgress( connection, res, markAttendance );
                                                        }
                                                    }
                                                );
                                            }
                                        }
                                    }
                                );
                            }else
                            {
                                connection.query(
                                    "SELECT emp_id, time_in, time_out FROM temp_emp_attendance WHERE emp_id = ? AND emp_date = ?;",
                                    [ employees_attendance[count.length].emp_id, date ],
                                    ( err, rslt ) => {
                                        if( err )
                                        {
                                            connection.rollback(() => {console.log(err);connection.release();});
                                            res.send('err');
                                            res.end();
                                        }else 
                                        {
                                            if ( !rslt[0] )
                                            {
                                                connection.query(
                                                    "INSERT INTO `temp_emp_attendance`(`emp_id`, `time_out`, `emp_date`) VALUES (?,?,?);",
                                                    [ employees_attendance[count.length].emp_id, employees_attendance[count.length].time, d ],
                                                    ( err ) => {
                                                        if( err )
                                                        {
                                                            connection.rollback(() => {console.log(err);connection.release();});
                                                            res.send('err');
                                                            res.end();
                                                        }else 
                                                        {
                                                            console.log("RECORD INSERTED REF# - EMP-ID => (" + employees_attendance[count.length].emp_id + ") AT: ", new Date().toTimeString());
                                                            checkProgress( connection, res, markAttendance );
                                                        }
                                                    }
                                                );
                                            }else
                                            {
                                                connection.query(
                                                    "UPDATE `temp_emp_attendance` SET time_out = ? WHERE emp_id = ? AND emp_date = ?;",
                                                    [
                                                        employees_attendance[count.length].time,
                                                        employees_attendance[count.length].emp_id, 
                                                        date 
                                                    ],
                                                    ( err ) => {
                                                        if( err )
                                                        {
                                                            connection.rollback(() => {console.log(err);connection.release();});
                                                            res.send('err');
                                                            res.end();
                                                        }else 
                                                        {
                                                            console.log("RECORD UPDATED REF# - EMP-ID => (" + employees_attendance[count.length].emp_id + ") AT: ", new Date().toTimeString());
                                                            checkProgress( connection, res, markAttendance );
                                                        }
                                                    }
                                                );
                                            }
                                        }
                                    }
                                );
                            }
                        }
                        markAttendance();
                    }
                }
            )
        }
    )
});

// // CHECK IF EMPLOYEE IS EXIST OR NOT
// db.query(
//     "SELECT employees.emp_id, employees.location_code FROM employees;" +
//     "SELECT device_id, current_location FROM tblthumbdevices;",
//     ( err, rslt ) => {

//         myCache.set(
//             "employees",
//             JSON.stringify( rslt[0] ? rslt[0] : [] ),
//             10000000000
//         );

//         myCache.set(
//             "machines",
//             JSON.stringify( rslt[1] ? rslt[1] : [] ),
//             10000000000
//         );

//         console.log("Employees List Fetched");

//         setInterval(() => {
//             ReadFile();
//         }, 500);

//     }
// )

// // READING FILE
// const ReadFile = () => {
//     console.log("Listening File....");

//     fileRead.open(
//         'client/text.txt', ( err, fd ) => {

//             if ( err ) 
//             {

//                 console.error( err );

//             }
//             else
//             {
//                 fileRead.readFile(
//                     'client/text.txt', 'utf-8', ( err, data ) => {

//                         if ( err )
//                         {

//                             console.error( err );

//                         }else
//                         {

//                             let FirstLine = data.split('\n').shift(); // EXTRACT FIRST LINE
//                             let firstColumn = FirstLine.split(',').shift(); // EMPLOYEE ID
//                             let lastColumn = FirstLine.split(',').pop().substring(0, 2); // DEVICE LOCATION EXAMPLE: HEADOFFICE, NLC, TPX
//                             // let thirdColumn = FirstLine.split(',')[2]; // PUNCH TIMING
                            
//                             fileRead.writeFile(
//                                 'client/text.txt', '', 'utf-8', ( err ) => {

//                                     if ( err )
//                                     {
                                        
//                                         console.error( err );

//                                     }else
//                                     {
                                        
//                                         if ( FirstLine.length > 0 )
//                                         {

//                                             let employees = JSON.parse( myCache.get('employees') );
//                                             let machines = JSON.parse( myCache.get('machines') );
                                            
//                                             let employee;
//                                             let machine;
//                                             // CHECK IF EMPLOYEE IS EXIST OR NOT
//                                             for ( let x = 0; x < employees.length; x++ )
//                                             {
                                                
//                                                 if ( employees[x].emp_id === parseInt( firstColumn ) )
//                                                 {
//                                                     employee = employees[x];
//                                                 }

//                                             }

//                                             for ( let x = 0; x < machines.length; x++ )
//                                             {

//                                                 if ( machines[x].device_id === parseInt( lastColumn ) )
//                                                 {
//                                                     machine = machines[x];
//                                                 }

//                                             };

//                                             if ( employee !== undefined && machine.device_id !== undefined )
//                                             {

//                                                 const d = new Date();

//                                                 db.query(
//                                                     "INSERT INTO emp_machine_thumbs (emp_id, date, time, location, status, device_id) VALUES (?,?,?,?,?,?);",
//                                                     [employee.emp_id, d, d.toTimeString(), machine.current_location, 'Waiting', lastColumn],
//                                                     (err) => {

//                                                         if (err) {

//                                                             console.log(err);

//                                                         } else {

//                                                             fileRead.close(
//                                                                 fd, (err) => {

//                                                                     if (err) {
//                                                                         console.error(err);
//                                                                     }

//                                                                 }
//                                                             )

//                                                         }
//                                                     }
//                                                 );

//                                             }
//                                         }else
//                                         {
//                                             fileRead.close(
//                                                 fd, (err) => {

//                                                     if (err) {
//                                                         console.error(err);
//                                                     }

//                                                 }
//                                             )
//                                         }

//                                     }

//                                 }
//                             )

//                         }

//                     }
//                 )
//             }

//         }
//     )

// }

module.exports = router;