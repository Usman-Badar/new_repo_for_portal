const express = require('express');
const router = express.Router();
const db = require('../../db/connection');

// OLD CODE
// function UpdateAtt(month, year)
// {
//     db.query(
//         "SELECT time_in, grace_in_minutes FROM `employees` WHERE time_in IS NOT NULL GROUP BY time_in;",
//         ( err, rslt ) => {

//             if( err )
//             {

//                 console.log( err );

//             }else 
//             {

//                 let limit = rslt.length;
//                 let count = [];
//                 function Mark()
//                 {
//                     const d = new Date();
//                     let time = rslt[count.length].time_in.substring(3, 5);
//                     time = parseInt(time) + parseInt(rslt[count.length].grace_in_minutes);
//                     time = rslt[count.length].time_in.substring(0, 3) + (time.toString().length === 1 ? ( '0' + time.toString() ) : time.toString()) + ':00';

//                     db.query(
//                         "UPDATE emp_attendance a \
//                         JOIN employees b ON a.emp_id = b.emp_id \
//                         SET a.status = 'Present' \
//                         WHERE b.time_in = ? AND a.time_in < ? AND MONTH(a.emp_date) = ? AND YEAR(a.emp_date) = ? AND a.time_out IS NOT NULL AND a.emp_date != CURDATE() AND a.status != 'OFF' AND a.edit_by IS NULL; \
//                         UPDATE emp_attendance a \
//                         JOIN employees b ON a.emp_id = b.emp_id \
//                         SET a.status = 'Present' \
//                         WHERE MONTH(a.emp_date) = ? AND YEAR(a.emp_date) = ? AND a.status = 'Absent' AND a.time_in IS NOT NULL AND a.emp_date != CURDATE() AND a.status != 'OFF' AND a.edit_by IS NULL; \
//                         UPDATE emp_attendance a \
//                         JOIN employees b ON a.emp_id = b.emp_id \
//                         SET a.status = 'Late' \
//                         WHERE b.time_in = ? AND a.time_in > ? AND MONTH(a.emp_date) = ? AND YEAR(a.emp_date) = ? AND a.time_in IS NOT NULL AND a.time_out IS NOT NULL AND a.emp_date != CURDATE() AND a.status != 'OFF' AND a.edit_by IS NULL;", 
//                         [ 
//                             rslt[count.length].time_in, time, month, year, 
//                             month, year, 
//                             rslt[count.length].time_in, time, month, year 
//                         ],
//                         ( err ) => {
//                             if( err )
//                             {
//                                 console.log(err);
//                             }else
//                             {
//                                 if ( ( count.length + 1 ) === limit )
//                                 {
//                                     db.query(
//                                         "UPDATE emp_attendance a \
//                                         JOIN employees b ON a.emp_id = b.emp_id \
//                                         SET a.status = 'Late' \
//                                         WHERE MONTH(a.emp_date) = ? AND YEAR(a.emp_date) = ? AND a.status = 'Present' AND a.time_out IS NULL AND a.emp_date != CURDATE() AND a.status != 'OFF' AND a.edit_by IS NULL;",
//                                         [ month, year ],
//                                         ( err ) => {
//                                             if( err )
//                                             {
//                                                 console.log(err);
//                                             }else
//                                             {
//                                                 console.log( "All Attendance Updated" );
//                                                 UpdateLate(month, year);
//                                             }
//                                         }
//                                     )
//                                 }else
//                                 {
//                                     console.log( "Attendance Updated For (" + time + ") ", rslt[count.length].time_in);
//                                     count.push(1);
//                                     Mark();
//                                 }
//                             }
//                         }
//                     )
//                 }
//                 Mark();

//             }

//         }
//     )
// }
// function UpdateLate(month, year)
// {
//     db.query(
//         "SELECT emp_id, time_in, grace_in_minutes FROM `employees` WHERE time_in IS NOT NULL AND emp_status = 'Active' AND location_code != 4 AND company_code != 10;",
//         ( err, rslt ) => {

//             if( err )
//             {

//                 console.log( err );

//             }else 
//             {
                
//                 let limit = rslt.length;
//                 let count = [];
//                 function Mark()
//                 {
//                     const d = new Date();
//                     let time = rslt[count.length].time_in.substring(3, 5);
//                     time = parseInt(time) + parseInt(rslt[count.length].grace_in_minutes);
//                     time = rslt[count.length].time_in.substring(0, 3) + (time.toString().length === 1 ? ( '0' + time.toString() ) : time.toString()) + ':00';

//                     db.query(
//                         "UPDATE emp_attendance a \
//                         JOIN employees b ON a.emp_id = b.emp_id \
//                         SET a.status = 'Late' \
//                         WHERE b.time_in = ? AND a.time_in >= ? AND MONTH(a.emp_date) = ? AND YEAR(a.emp_date) = ? AND a.time_in IS NOT NULL AND a.time_out IS NOT NULL AND a.emp_date != CURDATE() AND a.emp_id = ? AND a.status = 'Present';", 
//                         [ rslt[count.length].time_in, time, month, year, rslt[count.length].emp_id],
//                         ( err ) => {
//                             if( err )
//                             {
//                                 console.log(err);
//                             }else
//                             {
//                                 if ( ( count.length + 1 ) === limit )
//                                 {
//                                     console.log( "All Lates Marked" );
//                                 }else
//                                 {
//                                     console.log( "Lates Updated For (" + time + ") ", rslt[count.length].time_in);
//                                     count.push(1);
//                                     Mark();
//                                 }
//                             }
//                         }
//                     )
//                 }
//                 Mark();

//             }

//         }
//     )
// }

// 2023-11-16
function UpdateAtt(month, year)
{
    db.query(
        "SELECT time_in, grace_in_minutes FROM `employees` WHERE time_in IS NOT NULL GROUP BY time_in;",
        ( err, rslt ) => {

            if( err )
            {

                console.log( err );

            }else 
            {

                let limit = rslt.length;
                let count = [];
                function Mark()
                {
                    const d = new Date();
                    let time = rslt[count.length].time_in.substring(3, 5);
                    time = parseInt(time) + parseInt(rslt[count.length].grace_in_minutes);
                    time = rslt[count.length].time_in.substring(0, 3) + (time.toString().length === 1 ? ( '0' + time.toString() ) : time.toString()) + ':00';

                    db.query(
                        "UPDATE emp_attendance a \
                        JOIN employees b ON a.emp_id = b.emp_id \
                        SET a.status = 'Present' \
                        WHERE b.time_in = ? AND a.time_in < ? AND MONTH(a.emp_date) = ? AND YEAR(a.emp_date) = ? AND a.time_out IS NOT NULL AND a.emp_date != CURDATE() AND a.status != 'OFF' AND a.status != 'leave' AND a.status != 'short leave' AND a.edit_by IS NULL; \
                        UPDATE emp_attendance \
                        SET emp_attendance.status = 'Present' \
                        WHERE MONTH(emp_attendance.emp_date) = ? AND YEAR(emp_attendance.emp_date) = ? AND emp_attendance.status = 'Absent' AND emp_attendance.time_in IS NOT NULL AND emp_attendance.emp_date != CURDATE() AND emp_attendance.status != 'OFF' AND emp_attendance.status != 'leave' AND emp_attendance.status != 'short leave' AND emp_attendance.edit_by IS NULL; \
                        UPDATE emp_attendance a \
                        JOIN employees b ON a.emp_id = b.emp_id \
                        SET a.status = 'Late' \
                        WHERE b.time_in = ? AND a.time_in > ? AND MONTH(a.emp_date) = ? AND YEAR(a.emp_date) = ? AND a.time_in IS NOT NULL AND a.time_out IS NOT NULL AND a.emp_date != CURDATE() AND a.status != 'OFF' AND a.status != 'leave' AND a.status != 'short leave' AND a.edit_by IS NULL;", 
                        [ 
                            rslt[count.length].time_in, time, month, year, 
                            month, year, 
                            rslt[count.length].time_in, time, month, year 
                        ],
                        ( err ) => {
                            if( err )
                            {
                                console.log(err);
                            }else
                            {
                                if ( ( count.length + 1 ) === limit )
                                {
                                    db.query(
                                        "UPDATE emp_attendance \
                                        SET emp_attendance.status = 'Late' \
                                        WHERE MONTH(emp_attendance.emp_date) = ? AND YEAR(emp_attendance.emp_date) = ? AND emp_attendance.status = 'Present' AND emp_attendance.time_out IS NULL AND emp_attendance.emp_date != CURDATE() AND emp_attendance.status != 'OFF' AND emp_attendance.status != 'leave' AND emp_attendance.status != 'short leave' AND emp_attendance.edit_by IS NULL;",
                                        [ month, year ],
                                        ( err ) => {
                                            if( err )
                                            {
                                                console.log(err);
                                            }else
                                            {
                                                console.log( "All Attendance Updated" );
                                                UpdateLate(month, year);
                                            }
                                        }
                                    )
                                }else
                                {
                                    console.log( "Attendance Updated For (" + time + ") ", rslt[count.length].time_in);
                                    count.push(1);
                                    Mark();
                                }
                            }
                        }
                    )
                }
                Mark();

            }

        }
    )
}
function UpdateLate(month, year)
{
    db.query(
        "SELECT emp_id, time_in, grace_in_minutes FROM `employees` WHERE time_in IS NOT NULL AND emp_status = 'Active' AND location_code != 4 AND company_code != 10;",
        ( err, rslt ) => {

            if( err )
            {

                console.log( err );

            }else 
            {
                
                let limit = rslt.length;
                let count = [];
                function Mark()
                {
                    const d = new Date();
                    let time = rslt[count.length].time_in.substring(3, 5);
                    time = parseInt(time) + parseInt(rslt[count.length].grace_in_minutes);
                    time = rslt[count.length].time_in.substring(0, 3) + (time.toString().length === 1 ? ( '0' + time.toString() ) : time.toString()) + ':00';

                    db.query(
                        "UPDATE emp_attendance a \
                        JOIN employees b ON a.emp_id = b.emp_id \
                        SET a.status = 'Late' \
                        WHERE b.time_in = ? AND a.time_in >= ? AND MONTH(a.emp_date) = ? AND YEAR(a.emp_date) = ? AND a.time_in IS NOT NULL AND a.time_out IS NOT NULL AND a.emp_date != CURDATE() AND a.emp_id = ? AND a.status = 'Present';", 
                        [ rslt[count.length].time_in, time, month, year, rslt[count.length].emp_id],
                        ( err ) => {
                            if( err )
                            {
                                console.log(err);
                            }else
                            {
                                if ( ( count.length + 1 ) === limit )
                                {
                                    console.log( "All Lates Marked" );
                                }else
                                {
                                    console.log( "Lates Updated For (" + time + ") ", rslt[count.length].time_in);
                                    count.push(1);
                                    Mark();
                                }
                            }
                        }
                    )
                }
                Mark();

            }

        }
    )
}

module.exports = {
    router: router,
    UpdateAtt: (month, year) => UpdateAtt(month, year)
};