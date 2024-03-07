// Last updated : 2023-Nov-20
const express = require('express');
const router = express.Router();
const db = require('../../db/connection');
const ExcelJS = require('exceljs');
const moment = require('moment');

const CreateLogs = require('./logs').CreateLog;

router.post('/attendance/thumbs/records', ( req, res ) => {
    const { attendance } = req.body;
    const pared_attendance = JSON.parse(attendance);
    let query = (
        "SELECT \
        emp_machine_thumbs.*, \
        locations.location_name \
        FROM \
        employees \
        LEFT OUTER JOIN emp_machine_thumbs ON employees.emp_id = emp_machine_thumbs.emp_id \
        LEFT OUTER JOIN locations ON emp_machine_thumbs.location = locations.location_code \
        WHERE "
    );
    for (let x = 0; x < pared_attendance.length; x++) {
        const date = pared_attendance[x].emp_date;
        console.log(date)
        if (x>0) query = query.concat(" OR ");
        query = query.concat(" emp_machine_thumbs.date = '" + date + "' ");
    }
    query = query.concat(" ORDER BY emp_machine_thumbs.`id` DESC;");

    let abc = db.query(
        query,
        (err, rslt) => {
            console.log(abc.sql)
            if (err) {
                console.log(err);
            }else
            {
                res.send(rslt);
                res.end();
            }

        }
    );
} );

router.post('/attendance/update/logs', ( req, res ) => {
    const { attendance } = req.body;
    const pared_attendance = JSON.parse(attendance);
    let query = (
        "SELECT \
        tbl_attendance_logs.*, \
        employees.name \
        FROM `tbl_attendance_logs`    \
        LEFT OUTER JOIN employees ON tbl_attendance_logs.edited_by = employees.emp_id WHERE "
    );
    for (let x = 0; x < pared_attendance.length; x++) {
        if (x>0) query = query.concat(" OR ");
        query = query.concat("tbl_attendance_logs.attendance_record_id = " + pared_attendance[x].id);
    }
    query = query.concat(" ORDER BY tbl_attendance_logs.`id` DESC;");

    db.query(
        query,
        (err, rslt) => {
            if (err) {
                console.log(err);
            }else
            {
                res.send(rslt);
                res.end();
            }

        }
    );
} );

router.post('/attendance/update/status', ( req, res ) => {
    const { emp_id, new_status, name, list } = req.body;
    const pared_list = JSON.parse(list);
    const limit = pared_list.length;
    let count = [];

    function updateRecords()
    {
        db.query(
            "INSERT INTO `tbl_attendance_logs`(`attendance_record_id`, `before_value`, `after_value`, `edited_by`, `message`, `match_key`) VALUES (?,?,?,?,?,?);",
            [pared_list[count.length].id, pared_list[count.length].status, new_status, emp_id, `The status has been changed from ${pared_list[count.length].status} to ${new_status}.`, 'status'],
            (err) => {
                if (err) {
                    console.log(err);
                }else
                {
                    db.query(
                        "UPDATE emp_attendance SET status = ?, edit_by = ?, edit_date = ?, edit_time = ? WHERE id = ?;",
                        [new_status, emp_id, new Date(), new Date().toTimeString(), pared_list[count.length].id],
                        (err) => {
                            if (err) {
                                console.log(err);
                            }else
                            {
                                if ( ( count.length + 1 ) === limit )
                                {
                                    console.log( "STATUS MARKED - ", new Date().getHours() + ':' + new Date().getMinutes() );
                                    res.send("SUCCESS");
                                    res.end();
                                }else
                                {
                                    count.push(1);
                                    updateRecords();
                                }
                            }
            
                        }
                    );
                }

            }
        )
    }
    updateRecords();
} );

router.post('/attendance/update/record', ( req, res ) => {
    const { emp_id, new_status, name, new_time_out, value, changes } = req.body;
    const parsed_value = JSON.parse(value);
    const parsed_changes = JSON.parse(changes);
    let query = "";
    let parameters = [];
    let sub_query = "";
    let sub_parameters = [];
    if (parsed_changes.status) {
        query = query.concat("INSERT INTO `tbl_attendance_logs`(`attendance_record_id`, `before_value`, `after_value`, `edited_by`, `message`, `match_key`) VALUES (?,?,?,?,?,?);");
        parameters.push(parsed_value.id);
        parameters.push(parsed_value.status);
        parameters.push(new_status);
        parameters.push(emp_id);
        parameters.push(`The status has been changed from ${parsed_value.status} to ${new_status}.`);
        parameters.push('status');

        sub_query = "UPDATE emp_attendance SET status = ?, edit_by = ?, edit_date = ?, edit_time = ? WHERE id = ?;";
        sub_parameters = [new_status, emp_id, new Date(), new Date().toTimeString(), parsed_value.id]
    }
    if (parsed_changes.time_out) {
        query = query.concat("INSERT INTO `tbl_attendance_logs`(`attendance_record_id`, `before_value`, `after_value`, `edited_by`, `message`, `match_key`) VALUES (?,?,?,?,?,?);");
        parameters.push(parsed_value.id);
        parameters.push(parsed_value.time_out == null ? "null" : parsed_value.time_out);
        parameters.push(new_time_out);
        parameters.push(emp_id);
        parameters.push(`The time OUT has been changed from ${parsed_value.time_out} to ${new_time_out}.`);
        parameters.push('time_out');
        
        sub_query = "UPDATE emp_attendance SET time_out = ?, edit_by = ?, edit_date = ?, edit_time = ? WHERE id = ?;";
        sub_parameters = [new_time_out === '' && parsed_value.time_out == null ? null : new_time_out, emp_id, new Date(), new Date().toTimeString(), parsed_value.id]
    }
    if (parsed_changes.status && parsed_changes.time_out) {
        sub_query = "UPDATE emp_attendance SET status = ?, time_out = ?, edit_by = ?, edit_date = ?, edit_time = ? WHERE id = ?;";
        sub_parameters = [new_status, new_time_out === '' && parsed_value.time_out == null ? null : new_time_out, emp_id, new Date(), new Date().toTimeString(), parsed_value.id]
    }

    db.query(
        query,
        parameters,
        (err) => {
            if (err) {
                console.log(err);
            }else
            {
                db.query(
                    sub_query,
                    sub_parameters,
                    (err) => {
                        if (err) {
                            console.log(err);
                        }else
                        {
                            res.send("SUCCESS");
                            res.end();
                        }
        
                    }
                );
            }

        }
    )
} );

router.get('/getnextattendancetimelimit', ( req, res ) => {

    db.query(
        "SELECT valueInt1 FROM tblmisc WHERE id = 1;",
        ( err, rslt ) => {

            if ( err )
            {
                console.log( err );
            }else
            {
                res.send( rslt );
            }

        }
    )

} );

router.post('/getallemployeestodayattendancecompanywise', ( req, res ) => {

    const { locationID } = req.body;
    const d = new Date();

    db.getConnection(
        ( err, connection ) => {

            if ( err )
            {

                res.status(503).send(err);
                res.end();

            }else
            {
                connection.query(
                    "SELECT \
                    employees.name,  \
                    designations.designation_name,  \
                    departments.department_name,  \
                    companies.company_name,  \
                    emp_app_profile.emp_image, \
                    emp_attendance.*  \
                    FROM employees  \
                    LEFT OUTER JOIN designations ON employees.designation_code = designations.designation_code  \
                    LEFT OUTER JOIN departments ON employees.department_code = departments.department_code  \
                    LEFT OUTER JOIN companies ON employees.company_code = companies.company_code  \
                    LEFT OUTER JOIN emp_app_profile ON employees.emp_id =  emp_app_profile.emp_id  \
                    LEFT OUTER JOIN emp_attendance ON employees.emp_id =  emp_attendance.emp_id  \
                    WHERE emp_attendance.emp_date = '" + d.getFullYear() + '-' + parseInt(d.getMonth() + 1) + '-' + d.getDate() + "' AND employees.location_code = " + locationID + ";",
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

router.post('/getmymonthlyattendance', ( req, res ) => {
    const { DateFrom, DateTo, emp_id } = req.body;
    db.query(
        "SELECT emp_attendance.`id`, emp_attendance.`emp_id`, emp_attendance.`time_in`, emp_attendance.`time_out`, emp_attendance.`status`, emp_attendance.`break_in`, emp_attendance.`break_out`, emp_attendance.`emp_date`, employees.company_code, employees.name, employees.emp_id FROM employees LEFT OUTER JOIN emp_attendance ON employees.emp_id = emp_attendance.emp_id WHERE emp_attendance.emp_id = " + emp_id + " AND emp_attendance.emp_date BETWEEN '" + DateFrom + "' AND '" + DateTo + "' ORDER BY emp_attendance.emp_date DESC, employees.name ASC;",
        ( err, rslt ) => {
            if( err )
            {
                console.log(err);
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

router.post('/allemployeesattcompanywiseaccordingtodate', ( req, res ) => {

    const { CompanyCode, LocationCode, DateFrom, DateTo, AccessControls, temporaryStaff } = req.body;
    const access = JSON.parse(JSON.parse(AccessControls).access);
    let hasLocationAccess = false;
    function regularStaff() {
        let locationQuery = "";
        let companyQuery = "";

        if (LocationCode != 'null') {
            locationQuery = " employees.location_code = " + LocationCode + " AND ";
        }
        if (CompanyCode != 'null') {
            companyQuery = " employees.company_code = " + CompanyCode + " AND ";
        }
        for ( let x = 0; x < access.length; x++ )
        {
            if ( access[x] === 31 )
            {
                locationQuery = " employees.location_code = " + JSON.parse(AccessControls).location_code + " AND ";
                // companyQuery = " employees.company_code = " + JSON.parse(AccessControls).company_code + " AND ";
                hasLocationAccess = true;
            }
            if ( access[x] === 73 )
            {
                companyQuery = " employees.company_code = " + JSON.parse(AccessControls).company_code + " AND ";
                hasLocationAccess = true;
            }
        }
        
        let q = '';
        if ( DateTo === '' ) {
            q = "SELECT emp_attendance.`id`, emp_attendance.`emp_id`, emp_attendance.`time_in`, emp_attendance.`time_out`, emp_attendance.`status`, emp_attendance.`break_in`, emp_attendance.`break_out`, emp_attendance.`emp_date`, employees.company_code, employees.name, employees.emp_id FROM employees LEFT OUTER JOIN emp_attendance ON employees.emp_id = emp_attendance.emp_id WHERE " + locationQuery + companyQuery + " emp_attendance.emp_date = '" + DateFrom + "' ORDER BY emp_attendance.emp_date DESC, employees.name ASC;";
        }else
        if ( DateFrom === '' )
        {
            q = "SELECT emp_attendance.`id`, emp_attendance.`emp_id`, emp_attendance.`time_in`, emp_attendance.`time_out`, emp_attendance.`status`, emp_attendance.`break_in`, emp_attendance.`break_out`, emp_attendance.`emp_date`, employees.company_code, employees.name, employees.emp_id FROM employees LEFT OUTER JOIN emp_attendance ON employees.emp_id = emp_attendance.emp_id WHERE " + locationQuery + companyQuery + " emp_attendance.emp_date = '" + DateTo + "' ORDER BY emp_attendance.emp_date DESC, employees.name ASC;";
        }else
        {
            q = "SELECT emp_attendance.`id`, emp_attendance.`emp_id`, emp_attendance.`time_in`, emp_attendance.`time_out`, emp_attendance.`status`, emp_attendance.`break_in`, emp_attendance.`break_out`, emp_attendance.`emp_date`, employees.company_code, employees.name, employees.emp_id FROM employees LEFT OUTER JOIN emp_attendance ON employees.emp_id = emp_attendance.emp_id WHERE " + locationQuery + companyQuery + " emp_attendance.emp_date BETWEEN '" + DateFrom + "' AND '" + DateTo + "' ORDER BY emp_attendance.emp_date DESC, employees.name ASC;";
        }
        db.query(
            q,
            ( err, rslt ) => {
                if( err )
                {
                    console.log(err);
                    res.status(500).send(err);
                    res.end();
                }else 
                {
                    res.send( rslt );
                    res.end();
                }
            }
        )
    }
    function dailyWagesStaff() {
        let locationQuery = "";
        let companyQuery = "";
        for ( let x = 0; x < access.length; x++ )
        {
            if ( access[x] === 61 )
            {
                locationQuery = " tbl_temp_employees.location_code = " + JSON.parse(AccessControls).location_code + " AND ";
                companyQuery = " tbl_temp_employees.company_code = " + JSON.parse(AccessControls).company_code + " AND ";
                hasLocationAccess = true;
            }
            if ( access[x] === 73 )
            {
                companyQuery = " tbl_temp_employees.company_code = " + JSON.parse(AccessControls).company_code + " AND ";
                hasLocationAccess = true;
            }
            if ( access[x] === 60 || access[x] === 0 )
            {
                locationQuery = "";
                hasLocationAccess = false;
            }
        }
        if (!hasLocationAccess && LocationCode != 'null') {
            locationQuery = " tbl_temp_employees.location_code = " + LocationCode + " AND ";
        }
        if (!hasLocationAccess && CompanyCode != 'null') {
            companyQuery = " tbl_temp_employees.company_code = " + CompanyCode + " AND ";
        }
        let q = '';
        if ( DateTo === '' ) {
            q = "SELECT temp_emp_attendance.`paid`, temp_emp_attendance.`paid_date`, temp_emp_attendance.`paid_time`, temp_emp_attendance.`id`, temp_emp_attendance.`emp_id`, temp_emp_attendance.`time_in`, temp_emp_attendance.`time_out`, temp_emp_attendance.`emp_date`, tbl_temp_employees.company_code, tbl_temp_employees.name, tbl_temp_employees.temp_emp_id FROM tbl_temp_employees LEFT OUTER JOIN temp_emp_attendance ON tbl_temp_employees.temp_emp_id = temp_emp_attendance.emp_id WHERE " + locationQuery + companyQuery + " temp_emp_attendance.emp_date = '" + DateFrom + "' ORDER BY temp_emp_attendance.emp_date DESC, tbl_temp_employees.name ASC;";
        }else
        if ( DateFrom === '' )
        {
            q = "SELECT temp_emp_attendance.`paid`, temp_emp_attendance.`paid_date`, temp_emp_attendance.`paid_time`, temp_emp_attendance.`id`, temp_emp_attendance.`emp_id`, temp_emp_attendance.`time_in`, temp_emp_attendance.`time_out`, temp_emp_attendance.`emp_date`, tbl_temp_employees.company_code, tbl_temp_employees.name, tbl_temp_employees.temp_emp_id FROM tbl_temp_employees LEFT OUTER JOIN temp_emp_attendance ON tbl_temp_employees.temp_emp_id = temp_emp_attendance.emp_id WHERE " + locationQuery + companyQuery + " temp_emp_attendance.emp_date = '" + DateTo + "' ORDER BY temp_emp_attendance.emp_date DESC, tbl_temp_employees.name ASC;";
        }else
        {
            q = "SELECT temp_emp_attendance.`paid`, temp_emp_attendance.`paid_date`, temp_emp_attendance.`paid_time`, temp_emp_attendance.`id`, temp_emp_attendance.`emp_id`, temp_emp_attendance.`time_in`, temp_emp_attendance.`time_out`, temp_emp_attendance.`emp_date`, tbl_temp_employees.company_code, tbl_temp_employees.name, tbl_temp_employees.temp_emp_id FROM tbl_temp_employees LEFT OUTER JOIN temp_emp_attendance ON tbl_temp_employees.temp_emp_id = temp_emp_attendance.emp_id WHERE " + locationQuery + companyQuery + " temp_emp_attendance.emp_date BETWEEN '" + DateFrom + "' AND '" + DateTo + "' ORDER BY temp_emp_attendance.emp_date DESC, tbl_temp_employees.name ASC;";
        }
        db.query(
            q,
            ( err, rslt ) => {
                if( err )
                {
                    res.status(500).send(ewrr);
                    res.end();
                }else 
                {
                    res.send( rslt );
                    res.end();
                }
            }
        )
    }
    if(parseInt(temporaryStaff) === 1) {
        dailyWagesStaff();
    }else {
        if (access.includes(63) || access.includes(0)) {
            regularStaff();
        }else {
            if (access.includes(60) || access.includes(61)) {
                dailyWagesStaff();
            }else {
                res.send([]);
                res.end();
            }
        }
    }

} );

router.get('/getallattendancerequests', ( req, res ) => {

    db.getConnection(
        ( err, connection ) => {

            if ( err )
            {

                res.status(503).send(err);
                res.end();

            }else
            {
                connection.query(
                    "SELECT employees.name, \
                    designations.designation_name, \
                    departments.department_name, \
                    companies.company_name, \
                    emp_app_profile.emp_image, \
                    emp_attendance_requests_ref.*,\
                    emp_attendance_requests.*\
                    FROM employees \
                    LEFT OUTER JOIN designations ON employees.designation_code = designations.designation_code \
                    LEFT OUTER JOIN departments ON employees.department_code = departments.department_code \
                    LEFT OUTER JOIN companies ON employees.company_code = companies.company_code \
                    LEFT OUTER JOIN emp_app_profile ON employees.emp_id =  emp_app_profile.emp_id \
                    RIGHT OUTER JOIN emp_attendance_requests_ref ON employees.emp_id = emp_attendance_requests_ref.requested_by\
                    LEFT OUTER JOIN emp_attendance_requests ON emp_attendance_requests_ref.request_id = emp_attendance_requests.id",
                    (err, rslt) => {
        
                        if (err) {

                            res.status(500).send(err);
                            res.end();
                            connection.release();
        
                        } else {
        
                            res.send(rslt);
                            res.end();
                            connection.release();
        
                        }
        
                    }
                )
            }

        }
    )

} );

router.post('/attendance_request', ( req, res ) => {

    const { emp_id, subject, description, arrivalTime, arrivalFor, imageName } = req.body;
    let img = null;
    let imgName = null;
    if ( req.files )
    {
        img = req.files.image;
        imgName = imageName + '.png';
    }

    const d = new Date();

    db.getConnection(
        ( err, connection ) => {

            if ( err )
            {

                res.status(503).send(err);
                res.end();

            }else
            {
                connection.query(
                    "INSERT INTO emp_attendance_requests (request_subject, request_description, arrival_timing, arrival_for, request_image) VALUES (?,?,?,?,?)",
                    [ subject, description, arrivalTime, arrivalFor, imgName ],
                    ( err, rslt ) => {
            
                        if( err )
                        {
                            res.status(500).send(err);
                            res.end();
                            connection.release();
            
                        }else 
                        {
            
                            if ( img )
                            {
                                img.mv('client/images/att_requests_proof/' + imgName, (err) => {
                                                            
                                    if (err) {
                            
                                        res.status(500).send(err);
                                        res.end();
                                        connection.release();
                            
                                    }
                            
                                });
                            }
            
                            connection.query(
                                "SELECT id FROM emp_attendance_requests WHERE request_subject = '" + subject + "' AND request_description = '" + description + "' AND arrival_timing LIKE '%" + arrivalTime + "%'",
                                ( err, rslt ) => {
                        
                                    if( err )
                                    {

                                        res.status(500).send(err);
                                        res.end();
                                        connection.release();
                        
                                    }else 
                                    {
                        
                                        connection.query(
                                            "INSERT INTO emp_attendance_requests_ref (request_id, requested_by, request_date, request_time, request_status) VALUES (?,?,?,?,?)",
                                            [ rslt[0].id, emp_id, d, d.toTimeString(), 1 ],
                                            ( err, rslt ) => {
                                    
                                                if( err )
                                                {
                                    
                                                    res.status(500).send(err);
                                                    res.end();
                                                    connection.release();
                                    
                                                }else 
                                                {
                                    
                                                    res.send( 'done' );
                                                    res.end();
                                                    connection.release();
                                    
                                                }
                                    
                                            }
                                        )
                        
                                    }
                        
                                }
                            )
            
                        }
            
                    }
                )
            }

        }
    )

} );    

router.post('/gettodaysattendance', ( req, res ) => {

    const { empID, temp_emp_id } = req.body;

    const d = new Date().toISOString().slice(0, 10).replace('T', ' ');
    if (temp_emp_id === 'NaN' || isNaN(parseInt(temp_emp_id))) {
        db.query(
            'SELECT * FROM emp_attendance WHERE emp_id = ? AND emp_date = ?',
            [empID, d],
            ( err, rslt ) => {
                if( err ) {
                    console.log(err);
                    res.send( err );
                    res.end();
                }else {
                    res.send( rslt );
                    res.end();
                }
            }
        )
    }else {
        db.query(
            'SELECT * FROM temp_emp_attendance WHERE emp_id = ? AND emp_date = ?',
            [empID, d],
            ( err, rslt ) => {
                if( err ) {
                    console.log(err);
                    res.send( err );
                    res.end();
                }else {
                    res.send( rslt );
                    res.end();
                }
            }
        )
    }

} );

router.post('/getempattdetails', ( req, res ) => {

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
                    "SELECT `id`, `emp_id`, `time_in`, `time_out`, `break_in`, `break_out`, `status`, `emp_date` FROM emp_attendance WHERE emp_id = " + empID + " AND MONTH(`emp_date`) = MONTH(CURRENT_DATE()) AND YEAR(`emp_date`) = YEAR(CURRENT_DATE()) ORDER BY emp_date DESC",
                    ( err, rslt ) => {
            
                        if( err )
                        {

                            connection.release();
                            res.send( err );
                            res.end();
            
                        }else 
                        {
            
                            connection.release();
                            res.send( rslt );
                            res.end();
            
                        }
            
                    }
                )
            }

        }
    )

} );

router.post('/getweeklyattendanceperformance', ( req, res ) => {

    const { date_from, date_to } = req.body;

    let date = date_to.split('-')[0];
    let month = date_to.split('-')[1];
    let year = date_to.split('-')[2];
    let arr = [ year, month, date ];
    const d1 = new Date( date_from );
    const d2 = new Date( arr.join('-') );

    db.getConnection(
        ( err, connection ) => {

            if ( err )
            {

                res.status(503).send(err);
                res.end();

            }else
            {
                connection.query(
                    "SELECT \
                    SUM(total_ratings) as total_ratings,  \
                    SUM(emp_ratings) as emp_ratings,  \
                    COUNT(emp_id) * 20 as expected_ratings,  \
                    emp_date,  \
                    emp_id \
                    FROM emp_attendance  \
                    WHERE emp_date BETWEEN ? AND ?  \
                    GROUP BY emp_date;",
                    [ d2, d1 ],
                    ( err, rslt ) => {
            
                        if( err )
                        {

                            res.status(500).send(err);
                            res.end();
                            connection.release();
            
                        }else 
                        {
            
                            // const sql = connection.format("SELECT SUM(total_ratings) as total_ratings, SUM(emp_ratings) as emp_ratings, emp_date, emp_id FROM emp_attendance WHERE emp_date BETWEEN ? AND ? GROUP BY emp_date;",
                            // [ d2, d1 ]);
                            // console.log(sql);
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

router.post('/getthatdateemployeeslist', ( req, res ) => {

    const { date_time, company } = req.body;

    let q = db.query(
        "SELECT \
        emp_attendance.status, \
        employees.emp_id, \
        employees.time_in as timing, \
        employees.name, \
        emp_app_profile.emp_image \
        FROM emp_attendance \
        LEFT OUTER JOIN employees ON employees.emp_id = emp_attendance.emp_id \
        LEFT OUTER JOIN emp_app_profile ON emp_app_profile.emp_id = emp_attendance.emp_id \
        WHERE emp_attendance.emp_date = ? AND employees.company_code = ?;",
        [ date_time, company ],
        ( err, rslt ) => {

            if ( err )
            {
                console.log( err );
            }else
            {

                console.log( q.sql )
                res.send( rslt );
            }

        }
    )

} );



router.post('/getemployeefullattendance', ( req, res ) => {

    const { emp_id, date } = req.body;

    db.query(
        "SELECT \
        emp_machine_thumbs.*, \
        locations.location_name \
        FROM \
        employees \
        LEFT OUTER JOIN emp_machine_thumbs ON employees.emp_id = emp_machine_thumbs.emp_id \
        LEFT OUTER JOIN locations ON emp_machine_thumbs.location = locations.location_code \
        WHERE emp_machine_thumbs.emp_id = ? AND emp_machine_thumbs.date = ?;",
        [ emp_id, date ],
        ( err, rslt ) => {

            if ( err )
            {
                console.log( err );
            }else
            {
                db.query(
                    "SELECT \
                    emp_attendance.* \
                    FROM \
                    emp_attendance \
                    WHERE emp_attendance.emp_id = ? AND emp_attendance.emp_date = ?;",
                    [ emp_id, date ],
                    ( err, rslt2 ) => {
            
                        if ( err )
                        {
                            console.log( err );
                        }else
                        {
            
                            db.query(
                                "SELECT \
                                * \
                                FROM \
                                tbl_logs \
                                WHERE tbl_logs.tbl_name = 'emp_attendance' \
                                AND \
                                tbl_logs.id = ?",
                                [ rslt2[0].id ],
                                ( err, rslt3 ) => {
                        
                                    if ( err )
                                    {
                                        console.log( err );
                                    }else
                                    {

                                        if (rslt2[0].leave_ref !== null) {
                                            let qqq = "";
                                            if (rslt2[0].leave_ref.includes('leave')) {
                                                qqq = "SELECT * FROM emp_leave_applications WHERE leave_id = ?;";
                                            }else {
                                                qqq = "SELECT * FROM emp_short_leave_applications WHERE leave_id = ?;";
                                            }
                                            db.query(
                                                qqq,
                                                [ rslt2[0].leave_ref.split('/').pop() ],
                                                ( err, rslt4 ) => {
                                                    let arr = [];
                                                    arr.push( rslt );
                                                    arr.push( rslt2 );
                                                    arr.push( rslt3 );
                                                    arr.push( rslt4 );
                                                    res.send( arr );
                                                }
                                            )
                                        }else {
                                            let arr = [];
                                            arr.push( rslt );
                                            arr.push( rslt2 );
                                            arr.push( rslt3 );
                                            res.send( arr );
                                        }
                                    }
                        
                                }
                            )
                        }
            
                    }
                )
            }

        }
    )

} );

router.post('/updateemployeeattendance', ( req, res ) => {

    const {
        emp_id,
        record_id,
        time_in,
        time_out,
        break_in,
        break_out,
        edit_by,
        edit_by_name,
        previous_time_in,
        previous_time_out,
        previous_break_in,
        previous_break_out
    } = req.body;

    db.query(
        "SELECT time_in FROM employees WHERE emp_id = ?;",
        [ emp_id ],
        ( err, time_in_data ) => {


            if ( err )
            {
                console.log( err );
            }else
            {

                let status = '';
                let time = '';

                if ( time_in_data[0].time_in === '09:00 AM' )
                {
                    time = '09:15:00';
                }else
                if ( time_in_data[0].time_in === '10:00 AM' )
                {
                    time = '10:15:00';
                }else
                if ( time_in_data[0].time_in === '11:00 AM' )
                {
                    time = '11:15:00';
                }else
                if ( time_in_data[0].time_in === '08:00 AM' )
                {
                    time = '08:15:00';
                }

                if ( time_in > time )
                {
                    status = "Late";
                }else
                {
                    status = "Present";
                }

                db.query(
                    "UPDATE emp_attendance SET status = ?, time_in = ?, time_out = ?, break_in = ?, break_out = ?, edit_by = ?, edit_date = ?, edit_time = ? WHERE id = ?;",
                    [ status, time_in === '' ? null : time_in, time_out === '' ? null : time_out, break_in === '' ? null : break_in, break_out === '' ? null : break_out, edit_by, new Date(), new Date().toTimeString(), record_id ],
                    ( err ) => {
            
            
                        if ( err )
                        {
                            console.log( err );
                        }else
                        {
            
                            CreateLogs( 
                                'emp_attendance', 
                                record_id,
                                edit_by_name + " (" + edit_by + ") update the attendance record. \n Previous timings was ( time_in = " + previous_time_in + ", time_out = " + previous_time_out + ", break_in = " + previous_break_in + ", break_out = " + previous_break_out + " )",
                                'info'
                            )
                            res.send( 'SUCCESS' );
                        }
            
                    }
                )
            }

        }
    )

} );

router.post('/getemployeecompaniesauth', ( req, res ) => {

    const { emp_id } = req.body;

    db.query(
        "SELECT \
        invtry_emp_approval_to_related_companies.company_code, \
        employees.emp_id, \
        employees.name, \
        companies.company_name \
        FROM invtry_emp_approval_to_related_companies \
        LEFT OUTER JOIN employees ON employees.emp_id = invtry_emp_approval_to_related_companies.emp_id \
        LEFT OUTER JOIN companies ON companies.company_code = invtry_emp_approval_to_related_companies.company_code \
        WHERE invtry_emp_approval_to_related_companies.emp_id = ?;",
        [ emp_id ],
        ( err, rslt ) => {

            if ( err )
            {
                console.log( err );
            }else
            {
                res.send( rslt );
            }

        }
    )

} );

router.post('/attendance/create/excel', ( req, res ) => {

    const { data, emp_id, logs, punch } = req.body;
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const parsed_data = JSON.parse(data);
    const parsed_logs = JSON.parse(logs);
    const parsed_punch = JSON.parse(punch);

    async function createExcelFile() {
        const fileName = emp_id + '_attendance.xlsx';
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Employees List", { views: [{ state: "frozen", ySplit: 1 }] });

        worksheet.columns = [
            { header: "Sr.No", key: 'id', outlineLevel: 1 },
            { header: "Employee Code", key: 'emp_id', outlineLevel: 1 },
            { header: "Employee Name", key: 'name', outlineLevel: 1 },
            { header: "Date", key: 'in_date', outlineLevel: 1 },
            { header: "Start Time", key: 'time_in', outlineLevel: 1 },
            // { header: "Out Date", key: 'out_date', outlineLevel: 1 },
            { header: "End Time", key: 'time_out', outlineLevel: 1 },
            { header: "Start Break", key: 'break_in', outlineLevel: 1 },
            { header: "End Break", key: 'break_out', outlineLevel: 1 },
            { header: "Hour(s)", key: 'hours', outlineLevel: 1 },
            { header: "Status", key: 'status', outlineLevel: 1 },
            { header: "Punch(s)", key: 'punch', outlineLevel: 1 },
            { header: "Log(s)", key: 'logs', outlineLevel: 1 },
        ];
        const row = worksheet.getRow(1);
        row.eachCell(function (cell) {
            cell.font = {
                name: 'Arial',
                family: 2,
                bold: false,
                size: 10,
            };
            cell.alignment = {
                vertical: 'middle', horizontal: 'center'
            };
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'EFF2F5' }
            };
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            }
        });

        for ( let x = 0; x < parsed_data.length; x++ ) {
            const startTime = moment(parsed_data[x].time_in, 'HH:mm:ss a');
            const endTime = moment(parsed_data[x].time_out, 'HH:mm:ss a');
            const duration = moment.duration(endTime.diff(startTime));
            const hours = parseInt(duration.asHours());
            const minutes = parseInt(duration.asMinutes()) % 60;
            const formattedHours = parsed_data[x].time_in === null || parsed_data[x].time_out === null ? '---' : `${hours}:${minutes}`;
            // const dayName = days[new Date(parsed_data[x].emp_date).getDay()];
            const recorded_punch = [];
            const recorded_logs = [];
            parsed_punch.filter(value => value.emp_id === parsed_data[x].emp_id && value.date === parsed_data[x].emp_date).map(({time, location_name}) => {
                recorded_punch.push(`${time}, ${location_name}`);
            });
            parsed_logs.filter(value => value.attendance_record_id === parsed_data[x].id).map(({message, name, created_at}) => {
                recorded_logs.push(`${message}, ${name} at ${new Date(created_at).toLocaleString()}`);
            });
            worksheet.addRow(
                { 
                    id: x+1, 
                    emp_id: parsed_data[x].emp_id, 
                    name: parsed_data[x].name, 
                    in_date: new Date(parsed_data[x].emp_date).toDateString(), 
                    time_in: parsed_data[x].time_in, 
                    // out_date: new Date(parsed_data[x].emp_date).toDateString(), 
                    time_out: parsed_data[x].time_out, 
                    break_in: parsed_data[x].break_in, 
                    break_out: parsed_data[x].break_out, 
                    hours: formattedHours, 
                    status: parsed_data[x].status?.split('_').join(' '), 
                    punch: recorded_punch.join('\n'), 
                    logs: recorded_logs.join('\n'),
                }
            );
        }

        worksheet.columns.forEach(function (column, columnNumber) {
            let maxLength = 0;
            column["eachCell"]({ includeEmpty: true }, function (cell) {
                let columnLength = cell.value ? (cell.value.toString().length + 5) : 10;
                if (columnNumber !== 10 && columnNumber !== 11) {
                    if (columnLength > maxLength) {
                        maxLength = columnLength;
                    }
                }
            });
            column.width = maxLength < 10 ? 10 : maxLength;
        });
        worksheet.autoFilter = 'A1:L1';

        worksheet.eachRow({ includeEmpty: true }, function (row, rowNumber) {
            if ( rowNumber !== 1 )
            {
                row.eachCell(function (cell, cellNumber) {
                    cell.font = {
                        name: 'Arial',
                        family: 2,
                        bold: false,
                        size: 10,
                    };
                    cell.alignment = {
                        vertical: 'top', horizontal: 'left'
                    };
                    if(cellNumber === 11) {
                        cell.border = {
                            top: {style:'thick'},
                            left: {style:'thick'},
                            bottom: {style:'thick'},
                            right: {style:'thick'}
                        };
                    }
                    if ( cell.value === 'Late' )
                    {
                        cell.fill = {
                            type: 'pattern',
                            pattern: 'solid',
                            fgColor: { argb: 'cac7c4' }
                        };
                        cell.font = {
                            color: { argb: '000000' }
                        }
                    }else if ( cell.value === 'Paid' || cell.value === 'Unpaid' )
                    {
                        cell.fill = {
                            type: 'pattern',
                            pattern: 'solid',
                            fgColor: { argb: '82ca9d' }
                        };
                        cell.font = {
                            color: { argb: '000000' }
                        }
                    }else if ( cell.value === 'leave' || cell.value === 'OFF' || cell.value === 'Holiday' )
                    {
                        cell.fill = {
                            type: 'pattern',
                            pattern: 'solid',
                            fgColor: { argb: 'b8daff' }
                        };
                        cell.font = {
                            color: { argb: '000000' }
                        }
                    }else if ( cell.value === 'Absent' )
                    {
                        cell.fill = {
                            type: 'pattern',
                            pattern: 'solid',
                            fgColor: { argb: 'ebcccf' }
                        };
                        cell.font = {
                            color: { argb: '000000' }
                        }
                    }else
                    {
                        cell.fill = {
                            type: 'pattern',
                            pattern: 'solid',
                            fgColor: { argb: 'FFFFFF' }
                        };
                    }
                });
            }
        });

        await workbook.xlsx.writeFile('./assets/portal/assets/excel/attendance/' + fileName);
        console.log("File is written");

    };
    createExcelFile();
    res.send("success");
    res.end();

} );

router.post('/attendance/update/mark_as_paid', ( req, res ) => {
    const { emp_id, list } = req.body;
    const pared_list = JSON.parse(list);

    let query = "UPDATE temp_emp_attendance SET paid = ?, paid_date = ?, paid_time = ?, marked_by = ? WHERE ";
    let parameters = [
        1,
        new Date(),
        new Date().toTimeString(),
        emp_id,
    ];
    for( let x = 0; x < pared_list.length; x++ ) {
        query = query.concat(" id = ?");
        parameters.push(pared_list[x].id);
        if ((x+1) < pared_list.length) {
            query = query.concat(" OR ");
        }
    }

    db.query(
        query,
        parameters,
        (err) => {
            if (err) {
                console.log(err);
            }else
            {
                res.send("SUCCESS");
                res.end();
            }
        }
    );
} );

module.exports = router;