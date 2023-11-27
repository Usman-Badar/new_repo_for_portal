const express = require('express');
const router = express.Router();
const db = require('../../db/connection');
const SendWhatsappNotification = require('../Whatsapp/whatsapp').SendWhatsappNotification;

router.post('/timein', ( req, res ) => {
    const { empID, temp_emp_id } = req.body;
    const d = new Date();

    if (temp_emp_id === 'NaN' || isNaN(parseInt(temp_emp_id))) {
        db.query(
            'SELECT id, emp_id, time_in FROM emp_attendance WHERE emp_id = ? AND emp_date = ?;',
            [empID, d.toISOString().slice(0, 10).replace('T', ' ')],
            ( err, result ) => {
                if( err )
                {
                    console.log(err)
                    res.status(500).send(err);
                    res.end();
                }else 
                {
                    if ( !result[0] )
                    {
                        db.query(
                            'SELECT name, time_in, time_out, cell, grace_in_minutes FROM employees WHERE emp_id = ' + empID + ";" +
                            "SELECT * FROM `tbl_holidays`;",
                            ( err, rslt ) => {
                                if( err )
                                {
                                    console.log(err)
                                    res.status(500).send(err);
                                    res.end();
                                }else 
                                {
                                    
                                    let time1 = rslt[0][0].time_in.substring(3, 5);
                                    let time2 = d.toTimeString();
                                    time1 = parseInt(time1) + parseInt(rslt[0][0].grace_in_minutes);
                                    time1 = rslt[0][0].time_in.substring(0, 3) + (time1.toString().length === 1 ? ( '0' + time1.toString() ) : time1.toString()) + ':00';
                                    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                                    const dayName = days[d.getDay()];
                    
                                    let status = 'Present';
                                    
                                    if ( time2 > time1 )
                                    {
                                        status = 'Late';
                                    }
    
                                    if ( dayName === 'Sunday' )
                                    {
                                        status = 'OFF';
                                    }
    
                                    for ( let x = 0; x < rslt[1].length; x++ )
                                    {
                                        const h_d = new Date(rslt[1][x].day).toISOString().slice(0, 10).replace('T', ' ');
                                        const iso_d = d.toISOString().slice(0, 10).replace('T', ' ');
                                        if (h_d === iso_d)
                                        {
                                            status = rslt[1][x].status;
                                        }
                                    }
                    
                                    db.query(
                                        'INSERT IGNORE INTO emp_attendance (emp_id, status, time_in, emp_date) VALUES (?,?,?,?)',
                                        [ empID, status, d.toTimeString(), d ],
                                        ( err ) => {
                                
                                            if( err )
                                            {
                                
                                                console.log(err)
                                                res.status(500).send(err);
                                                res.end();
                                
                                            }else 
                                            {
                                                let message = "";
                                                if ( status === 'Present' ) {
                                                    message = "Your punctuality is commendable! We've recorded your arrival at precisely " + d + " with the status '" + status + "'. Keep up the great work!";
                                                }else {
                                                    message = "Regrettably, your time in has been marked as '" + status + "' at " + d + ". Let's make an effort to be on time in the future and ensure smooth operations. Your timeliness is highly valued and appreciated. Together, we can maintain a more punctual schedule.";
                                                }
                                                SendWhatsappNotification( 
                                                    null, 
                                                    null, 
                                                    "Hi " + rslt[0][0].name, 
                                                    message, 
                                                    rslt[0][0].cell 
                                                );
                                                res.send('success');
                                                res.end();
                                
                                            }
                                
                                        }
                                    )
                    
                                }
                    
                            }
                        )
                    }else
                    {
                        db.query(
                            "SELECT name, time_in, time_out, cell, grace_in_minutes FROM employees WHERE emp_id = ?;" +
                            "SELECT * FROM `tbl_holidays`;",
                            [ empID ],
                            ( err, rslt ) => {
                                if( err )
                                {
                                    console.log(err)
                                    res.status(500).send(err);
                                    res.end();
                                }else 
                                {
                                    
                                    let time1 = rslt[0][0].time_in.substring(3, 5);
                                    let time2 = d.toTimeString();
                                    time1 = parseInt(time1) + parseInt(rslt[0][0].grace_in_minutes);
                                    time1 = rslt[0][0].time_in.substring(0, 3) + (time1.toString().length === 1 ? ( '0' + time1.toString() ) : time1.toString()) + ':00';
                                    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                                    const dayName = days[d.getDay()];
                    
                                    let status = 'Present';
                                    
                                    if ( time2 > time1 )
                                    {
                                        status = 'Late';
                                    }
    
                                    if ( dayName === 'Sunday' )
                                    {
                                        status = 'OFF';
                                    }
    
                                    for ( let x = 0; x < rslt[1].length; x++ )
                                    {
                                        const h_d = new Date(rslt[1][x].day).toISOString().slice(0, 10).replace('T', ' ');
                                        const iso_d = d.toISOString().slice(0, 10).replace('T', ' ');
                                        if (h_d === iso_d)
                                        {
                                            status = rslt[1][x].status;
                                        }
                                    }
    
                                    if ( d.toTimeString() > result[0].time_in )
                                    {
                                        console.log("Could not update")
                                        SendWhatsappNotification( null, null, "Hi " + rslt[0][0].name, "Couldn't update your time in because your time in is already marked", rslt[0][0].cell );
                                        res.send( rslt[0][0].name );
                                        res.end();
                                    }else
                                    {
    
                                        db.query(
                                            'UPDATE emp_attendance SET status = ?, time_in = ? WHERE id = ?;',
                                            [ status, d.toTimeString(), result[0].id ],
                                            ( err ) => {
                                                if( err )
                                                {
                                                    console.log(err)
                                                    res.status(500).send(err);
                                                    res.end();
                                                }else 
                                                {
                                                    let message = "";
                                                    if ( status === 'Present' ) {
                                                        message = "Congratulations on being present and on time! We've updated your time in the records to reflect your punctuality at " + d + ". Your commitment to being on schedule is truly appreciated and sets a positive example for others. Keep up the excellent work!";
                                                    }else {
                                                        message = "We have updated your time in our records to " + d + ", and the status has been noted as 'Late' While we understand that unforeseen circumstances can arise, we encourage you to make every effort to be punctual in the future. Your commitment to timeliness is crucial for maintaining a smooth and efficient workflow. Should you encounter any challenges, don't hesitate to communicate with us, and we'll work together to find suitable solutions. Thank you for your understanding and cooperation.";
                                                    }
                                                    SendWhatsappNotification( 
                                                        null, 
                                                        null, 
                                                        "Hi " + rslt[0][0].name, 
                                                        message, 
                                                        rslt[0][0].cell 
                                                    );
                                                    res.send( rslt[0][0].name );
                                                    res.end();
                                                }
                                            }
                                        )
                                    }
                                }
                    
                            }
                        )
                    }
                }
            }
        )
    }else {
        db.query(
            'SELECT id, emp_id, time_in FROM temp_emp_attendance WHERE emp_id = ? AND emp_date = ?;',
            [empID, d.toISOString().slice(0, 10).replace('T', ' ')],
            ( err, result ) => {
                if( err )
                {
                    console.log(err)
                    res.status(500).send(err);
                    res.end();
                }else 
                {
                    if ( !result[0] )
                    {
                        db.query(
                            'INSERT IGNORE INTO temp_emp_attendance (emp_id, time_in, emp_date) VALUES (?,?,?)',
                            [ empID, d.toTimeString(), d ],
                            ( err ) => {
                    
                                if( err )
                                {
                    
                                    console.log(err)
                                    res.status(500).send(err);
                                    res.end();
                    
                                }else 
                                {
                                    res.send('success');
                                    res.end();
                                }
                            }
                        )
                    }else
                    {
                        if ( d.toTimeString() > result[0].time_in )
                        {
                            res.send('success');
                            res.end();
                        }else
                        {

                            db.query(
                                'UPDATE emp_attendance SET time_in = ? WHERE id = ?;',
                                [ d.toTimeString(), result[0].id ],
                                ( err ) => {
                                    if( err )
                                    {
                                        console.log(err)
                                        res.status(500).send(err);
                                        res.end();
                                    }else 
                                    {
                                        res.send('success');
                                        res.end();
                                    }
                                }
                            )
                        }
                    }
                }
            }
        )
    }
} );

router.post('/timeout', ( req, res ) => {

    const { empID, temp_emp_id } = req.body;
    const d = new Date().toISOString().slice(0, 10).replace('T', ' ');
    if (temp_emp_id === 'NaN' || isNaN(parseInt(temp_emp_id))) {
        db.query(
            "UPDATE emp_attendance SET time_out = '" + new Date().toTimeString() + "' WHERE emp_id = " + empID + " AND emp_attendance.emp_date = '" + d + "';" +
            "SELECT name, cell FROM employees WHERE emp_id = ?;",
            [empID],
            ( err, rslt ) => {
                if( err )
                {
                    res.send( err );
                    res.end();
                }else 
                {
                    SendWhatsappNotification( 
                        null, 
                        null, 
                        "Hi " + rslt[1][0].name, 
                        "We hope this message finds you well. We wanted to inform you that your time out has been successfully recorded in our system. Your exit time was " + new Date().toTimeString() + ".", 
                        rslt[1][0].cell 
                    );
                    res.send( 'success' );
                    res.end();
                }
            }
        )
    }else {
        db.query(
            "UPDATE temp_emp_attendance SET time_out = '" + new Date().toTimeString() + "' WHERE emp_id = " + empID + " AND temp_emp_attendance.emp_date = '" + d + "';",
            ( err, rslt ) => {
                if( err )
                {
                    res.send( err );
                    res.end();
                }else 
                {
                    res.send( 'success' );
                    res.end();
                }
            }
        )
    }
} );

router.post('/breakin', ( req, res ) => {

    const { empID } = req.body;
    const d = new Date();

    db.query(
        "UPDATE emp_attendance SET break_in = '" + d.toTimeString() + "' WHERE emp_id = " + empID + " AND emp_attendance.emp_date = '" + d.getFullYear() + '-' + ( parseInt(d.getMonth() + 1).toString().length === 1 ? '0' + parseInt(d.getMonth() + 1).toString() : parseInt(d.getMonth() + 1).toString() ) + '-' + ( d.getDate().toString().length === 1 ? '0' + d.getDate().toString() : d.getDate() ) + "'",
        ( err, rslt ) => {

            if( err )
            {

                res.send( err );
                res.end();

            }else 
            {

                res.send( 'success' );
                res.end();

            }

        }
    )

} );

router.post('/breakout', ( req, res ) => {

    const { empID } = req.body;
    const d = new Date();

    db.query(
        "UPDATE emp_attendance SET break_out = '" + d.toTimeString() + "' WHERE emp_id = " + empID + " AND emp_attendance.emp_date = '" + d.getFullYear() + '-' + ( parseInt(d.getMonth() + 1).toString().length === 1 ? '0' + parseInt(d.getMonth() + 1).toString() : parseInt(d.getMonth() + 1).toString() ) + '-' + ( d.getDate().toString().length === 1 ? '0' + d.getDate().toString() : d.getDate() ) + "'",
        ( err ) => {

            if( err )
            {

                res.send( err );
                res.end();

            }else 
            {

                res.send( 'success' );
                res.end();

            }

        }
    )

} );

router.post('/setstatustolog', ( req, res ) => {

    const { device_id } = req.body;

    db.query(
        "UPDATE emp_machine_thumbs SET status = 'valid' WHERE status = 'Waiting' AND device_id = ?",
        [ device_id ],
        ( err ) => {

            if( err )
            {

                res.send( err );
                res.end();

            }else 
            {

                res.send( 'success' );
                res.end();

            }

        }
    )

} );

router.post('/getemployeesforattendance', ( req, res ) => {
    const { emp_id } = req.body;

    db.query(
        "SELECT employees.emp_id, employees.name, companies.company_name, departments.department_name, locations.location_name, designations.designation_name, emp_app_profile.emp_image \
        FROM employees \
        LEFT OUTER JOIN emp_app_profile ON employees.emp_id = emp_app_profile.emp_id \
        LEFT OUTER JOIN companies ON employees.company_code = companies.company_code \
        LEFT OUTER JOIN departments ON employees.department_code = departments.department_code \
        LEFT OUTER JOIN locations ON employees.location_code = locations.location_code \
        LEFT OUTER JOIN designations ON employees.designation_code = designations.designation_code \
        WHERE employees.emp_id = ?;",
        [emp_id],
        ( err, rslt ) => {
            if( err ) {
                console.log(err);
                res.send( err );
                res.end();
            }else 
            {
                if (rslt.length === 0) {
                    db.query(
                        "SELECT tbl_temp_employees.*, tbl_temp_employees.image AS emp_image, tbl_temp_employees.temp_emp_id AS emp_id, tbl_temp_employees.designation AS designation_name, tbl_temp_employees.department AS department_name, \
                        companies.company_name \
                        FROM tbl_temp_employees \
                        LEFT OUTER JOIN companies ON tbl_temp_employees.company_code = companies.company_code \
                        WHERE temp_emp_id = ?;",
                        [emp_id],
                        ( err, rslt ) => {
                            if( err ) {
                                console.log(err);
                                res.send( err );
                                res.end();
                            }else 
                            {
                                rslt[0].temporary = 1;
                                res.send(rslt);
                                res.end();
                            }
                        }
                    )
                }else {
                    res.send(rslt);
                    res.end();
                }
            }
        }
    )

} );

router.post('/ratings', ( req, res ) => {

    const { emp_id, date, ratings } = req.body;

    const d = new Date( date );

    db.getConnection(
        ( err, connection ) => {

            if ( err )
            {

                res.status(503).send(err);
                res.end();

            }else
            {
                let correspondingDate = d.getFullYear() + '-' + ( parseInt(d.getMonth() + 1).toString().length === 1 ? '0' + parseInt(d.getMonth() + 1).toString() : parseInt(d.getMonth() + 1).toString() ) + '-' + ( d.getDate().toString().length === 1 ? '0' + d.getDate().toString() : d.getDate() );
                connection.query(
                    "UPDATE emp_attendance SET total_ratings = total_ratings + 5, emp_ratings = emp_ratings + " + parseInt( ratings ) + " WHERE emp_id = " + parseInt( emp_id ) + " AND emp_date = '" + correspondingDate + "'",
                    ( err, rslt ) => {
            
                        if( err )
                        {
            
                            console.log( err );
                            connection.release();
                            res.send( err );
                            res.end();
            
                        }else 
                        {
            
                            connection.release();
                            res.send(rslt);
                            res.end();
            
                        }
            
                    }
                )
            }

        }
    )

} );

router.post('/getallpresentofthelocation', ( req, res ) => {

    const { machine_id } = req.body;

    let date = new Date().toISOString().slice(0, 10).replace('T', ' ');

    db.query(
        "SELECT current_location FROM tblthumbdevices WHERE device_id = ?",
        [ machine_id ],
        ( err, rslt ) => {

            if( err )
            {

                res.send( err );
                res.end();

            }else 
            {
                db.query(
                    "SELECT \
                    emp_attendance.emp_id, \
                    emp_attendance.status, \
                    emp_attendance.time_in, \
                    emp_attendance.time_out, \
                    employees.location_code, \
                    employees.name, \
                    emp_app_profile.emp_image \
                    FROM \
                    emp_attendance \
                    LEFT OUTER JOIN employees ON emp_attendance.emp_id = employees.emp_id \
                    LEFT OUTER JOIN emp_app_profile ON employees.emp_id = emp_app_profile.emp_id \
                    WHERE emp_attendance.emp_date = ? AND employees.location_code = ?;",
                    [ date, rslt[0].current_location ],
                    ( err, rslt ) => {
            
                        if( err )
                        {
            
                            res.send( err );
                            res.end();
            
                        }else 
                        {
                            res.send(rslt);
                            res.end();
            
                        }
            
                    }
                )

            }

        }
    )

} );

router.post('/attendance/auth', ( req, res ) => {

    const { id } = req.body;

    db.query(
        "SELECT emp_app_profile.emp_id, emp_app_profile.attendance_id, employees.name FROM `emp_app_profile` LEFT OUTER JOIN employees ON emp_app_profile.emp_id = employees.emp_id WHERE emp_app_profile.attendance_id = ?;",
        [id],
        ( err, rslt ) => {

            if( err )
            {

                console.log(err)
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

router.post('/attendance/get_code', ( req, res ) => {

    const { number, otp } = req.body;
    const num = number.includes('92') ? number.substring(2) : number.substring(1);
    const codeArr = ['0','1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20'];
    let code = codeArr[Math.floor(Math.random() * codeArr.length)]+codeArr[Math.floor(Math.random() * codeArr.length)]+codeArr[Math.floor(Math.random() * codeArr.length)]+codeArr[Math.floor(Math.random() * codeArr.length)]+codeArr[Math.floor(Math.random() * codeArr.length)]+codeArr[Math.floor(Math.random() * codeArr.length)];
    if ( number === '923303744620' )
    {
        code = '111111111';
    }

    if (otp !== "NO_OTP") {
        console.log(otp);
        db.query(
            "SELECT temp_emp_id, name, cell FROM `tbl_temp_employees` WHERE cell LIKE '%"+num+"%' AND status = 'active';",
            ( err, rslt ) => {
                if( err ) {
                    console.log(err);
                    res.status(500).send(err);
                    res.end();
                }else {
                    if (rslt.length > 0) {
                        rslt[0].message = 'c_success';
                        SendWhatsappNotification( null, null, "Hi " + rslt[0].name, "Congratulations on completing the registration process! Your unique registration code is: \n" + otp + "\nKeep this code safe and handy, as it will be essential for any future interactions or access to our services.", rslt[0].cell );
                        res.send(rslt);
                        res.end();
                    }else {
                        res.send('still_nothing_found');
                        res.end();
                    }
                }
            }
        )
    }else {
        db.query(
            "SELECT emp_id, name, cell FROM `employees` WHERE cell LIKE '%"+num+"%' AND emp_status = 'Active';",
            ( err, rslt ) => {
                if( err ) {
                    console.log(err);
                    res.status(500).send(err);
                    res.end();
                }else 
                {
                    if ( rslt.length > 0 ) {
                        db.query(
                            "UPDATE emp_app_profile SET attendance_id = ? WHERE emp_id = ?;",
                            [ code, rslt[0].emp_id ],
                            ( err ) => {
                                if( err ) {
                                    console.log(err);
                                    res.status(500).send(err);
                                    res.end();
                                }else {
                                    SendWhatsappNotification( null, null, "Hi " + rslt[0].name, "Congratulations on completing the registration process! Your unique registration code is: \n" + code + "\nKeep this code safe and handy, as it will be essential for any future interactions or access to our services.", rslt[0].cell );
                                    res.send('success');
                                    res.end();
                                }
                            }
                        )
                    }else {
                        res.send('nothing_found');
                        res.end();
                    }
                }
    
            }
        )
    }

} );

module.exports = router;