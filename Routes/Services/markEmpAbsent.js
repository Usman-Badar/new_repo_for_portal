const express = require('express');
const router = express.Router();
const db = require('../../db/connection');

setInterval(() => {

    const d = new Date();
    
    if ( d.getHours() === 23 && d.getMinutes() === 1 )
    {

        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const dayName = days[d.getDay()];
        const iso_d = d.toISOString().slice(0, 10).replace('T', ' ');

        db.query(
            "SELECT DISTINCT employees.emp_id, employees.additional_off \
            FROM employees \
            LEFT OUTER JOIN emp_attendance ON employees.emp_id = emp_attendance.emp_id \
            LEFT OUTER JOIN emp_props ON employees.emp_id = emp_props.emp_id \
            WHERE employees.emp_id not in (SELECT DISTINCT employees.emp_id \
            FROM employees \
            LEFT OUTER JOIN emp_attendance ON employees.emp_id = emp_attendance.emp_id \
            WHERE emp_attendance.emp_date = ?) AND employees.emp_status = 'Active' AND emp_props.attendance_enable = 1;" +
            "SELECT * FROM `tbl_holidays`;",
            [iso_d],
            (err, rslt) => {
                if (err) {
                    console.log(err);
                } else {
                    if ( rslt[0][0] ) {
                        let limit = rslt[0].length;
                        let count = [];
                        function markAttendance()
                        {
                            let status = 'Absent';
                            if ( dayName === 'Sunday' || JSON.parse(rslt[0][count.length].additional_off).includes(dayName) )
                            {
                                status = 'OFF';
                            }
                            for ( let y = 0; y < rslt[1].length; y++ )
                            {
                                const h_d = new Date(rslt[1][y].day).toISOString().slice(0, 10).replace('T', ' ');
                                if (h_d === iso_d)
                                {
                                    status = rslt[1][y].status;
                                }
                            }
                            console.log(status);
                            db.query(
                                "INSERT INTO emp_attendance (emp_id, status, emp_date) VALUES(?,?,?)",
                                [rslt[0][count.length].emp_id, status, d],
                                (err) => {

                                    if (err) {
                                        console.log(err);
                                    }else
                                    {
                                        if ( ( count.length + 1 ) === limit )
                                        {
                                            console.log( "STATUS MARKED - ", new Date().getHours() + ':' + new Date().getMinutes() );
                                            removeDuplicateAttendance(iso_d);
                                        }else
                                        {
                                            count.push(1);
                                            markAttendance();
                                        }
                                    }

                                }
                            )
                        }
                        markAttendance();
                    }
                }
            }
        )

    }
    
}, 1000);

function markEmpMissingAbsents(emp_id, month, year) {
    const dates = getDays(month, year);
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    db.query(
        "SELECT * FROM `tbl_holidays`;" +
        "SELECT emp_id, additional_off FROM employees WHERE emp_id = ?;",
        [emp_id],
        (err, results) => {
            if(!err) {
                let query_limit = dates.length;
                let query_count = [];
                function markAbsents() {
                    const d = new Date(dates[query_count.length]);
                    const dayName = days[d.getDay()];
                    const iso_d = d.toISOString().slice(0, 10).replace('T', ' ');
                    db.query(
                        "SELECT * FROM `emp_attendance` WHERE emp_id = ? AND emp_date = ?;",
                        [emp_id, dates[query_count.length]],
                        (err, rslt) => {
                            if (err) {
                                console.log(err);
                            } else {
                                if ( !rslt[0] ) {
                                    let status = 'Absent';
                                    if ( dayName === 'Sunday' || JSON.parse(results[1][0].additional_off).includes(dayName) )
                                    {
                                        status = 'OFF';
                                    }
                                    for ( let y = 0; y < results[0].length; y++ )
                                    {
                                        const h_d = new Date(results[0][y].day).toISOString().slice(0, 10).replace('T', ' ');
                                        if (h_d === iso_d)
                                        {
                                            status = results[0][y].status;
                                        }
                                    }
                                    console.log(status);
                                    db.query(
                                        "INSERT INTO emp_attendance (emp_id, status, emp_date) VALUES(?,?,?)",
                                        [emp_id, status, d],
                                        (err) => {
            
                                            if (err) {
                                                console.log(err);
                                            }else
                                            {
                                                if ( ( query_count.length + 1 ) === query_limit )
                                                {
                                                    console.log( "STATUS MARKED - ", new Date().getHours() + ':' + new Date().getMinutes() );
                                                    removeDuplicateAttendance(iso_d);
                                                }else
                                                {
                                                    query_count.push(1);
                                                    markAbsents();
                                                }
                                            }
            
                                        }
                                    )
                                }else {
                                    if ( ( query_count.length + 1 ) === query_limit )
                                    {
                                        console.log( "STATUS MARKED - ", new Date().getHours() + ':' + new Date().getMinutes() );
                                        removeDuplicateAttendance(iso_d);
                                    }else
                                    {
                                        query_count.push(1);
                                        markAbsents();
                                    }
                                }
                            }
                        }
                    )
                }
                markAbsents();
            }
        }
    )
}

function removeDuplicateAttendance(d) {
    let date;
    if (d) {
        date = d;
    }else {
        date = new Date().toISOString().slice(0, 10).replace('T', ' ');
    }
    db.query(
        "SELECT DISTINCT(emp_id) FROM `emp_attendance` WHERE emp_date = ?;",
        [date],
        (err, rslt) => {
            if (err) {
                console.log(err);
            }else
            {
                const employees = rslt;
                let limit = employees.length;
                let count = [];
                function checkEmployeeOneByOne()
                {
                    db.query(
                        "SELECT * FROM emp_attendance WHERE emp_id = ? AND emp_date = ?;",
                        [employees[count.length].emp_id, date],
                        (err, rslt2) => {
                            if (err) {
                                console.log(err);
                            }else
                            {
                                if (rslt2.length > 1 || rslt2[1]) {
                                    let time_in_arr = [];
                                    let time_out_arr = [];
                                    let status_arr = [];
                                    rslt2.forEach(val => {if (val.time_in) time_in_arr.push(val.time_in)});
                                    rslt2.forEach(val => {if (val.time_out) time_out_arr.push(val.time_out)});
                                    rslt2.forEach(val => status_arr.push(val.status));

                                    const min_time_in = time_in_arr.sort()[0];
                                    const max_time_out = time_out_arr.sort().reverse()[0];
                                    const status = status_arr.filter(val => val === 'Present')[0] || status_arr.filter(val => val === 'Late')[0] || status_arr.filter(val => val === 'leave')[0] || status_arr.filter(val => val === 'OFF')[0] || status_arr.filter(val => val === 'Absent')[0];

                                    db.query(
                                        "DELETE FROM emp_attendance WHERE emp_id = ? AND emp_date = ?;" +
                                        "INSERT IGNORE INTO emp_attendance (emp_id, status, time_in, time_out, emp_date) VALUES (?,?,?,?,?);",
                                        [employees[count.length].emp_id, date, employees[count.length].emp_id, status, min_time_in, max_time_out, date],
                                        ( err ) => {
                                            if( err )
                                            {
                                                console.log(err);
                                            }else 
                                            {
                                                if ( ( count.length + 1 ) === limit )
                                                {
                                                    console.log('ALL DUPLICATE RECORDS HAS BEEN REMOVED');
                                                }else
                                                {
                                                    count.push(1);
                                                    checkEmployeeOneByOne();
                                                }
                                            }
                                        }
                                    );
                                }else {
                                    if ( ( count.length + 1 ) === limit )
                                    {
                                        console.log('ALL DUPLICATE RECORDS HAS BEEN REMOVED');
                                    }else
                                    {
                                        count.push(1);
                                        checkEmployeeOneByOne();
                                    }
                                }
                            }

                        }
                    );
                }
                checkEmployeeOneByOne();
            }
        }
    )
}

const getDays = (month, year) => {
    let date = new Date(`${year}-${month}-01`);
    let days = [];
    while ((date.getMonth() + 1) === parseInt(month)) {
        days.push(date.toISOString().slice(0, 10).replace('T', ' '));
        date.setDate(date.getDate() + 1);
    }
    return days;
}

module.exports = {
    router: router,
    removeDuplicateAttendance: (d) => removeDuplicateAttendance(d)
};