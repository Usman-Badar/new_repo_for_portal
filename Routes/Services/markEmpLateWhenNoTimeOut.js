const express = require('express');
const router = express.Router();
const db = require('../../db/connection');
const moment = require('moment');

function UpdateAtt()
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
                        WHERE b.time_in = ? AND a.time_in < ? AND MONTH(a.emp_date) = ? AND YEAR(a.emp_date) = ? AND a.time_out IS NOT NULL AND a.emp_date != CURDATE() AND a.status != 'OFF' AND b.location_code != 4 AND b.company_code != 10; \
                        UPDATE emp_attendance a \
                        JOIN employees b ON a.emp_id = b.emp_id \
                        SET a.status = 'Present' \
                        WHERE MONTH(a.emp_date) = ? AND YEAR(a.emp_date) = ? AND a.status = 'Absent' AND a.time_in IS NOT NULL AND a.emp_date != CURDATE() AND a.status != 'OFF' AND b.location_code != 4 AND b.company_code != 10; \
                        UPDATE emp_attendance a \
                        JOIN employees b ON a.emp_id = b.emp_id \
                        SET a.status = 'Late' \
                        WHERE b.time_in = ? AND a.time_in > ? AND MONTH(a.emp_date) = ? AND YEAR(a.emp_date) = ? AND a.time_in IS NOT NULL AND a.time_out IS NOT NULL AND a.emp_date != CURDATE() AND a.status != 'OFF' AND b.location_code != 4 AND b.company_code != 10;", 
                        [ 
                            rslt[count.length].time_in, time, d.getMonth() + 1, d.getFullYear(), 
                            d.getMonth() + 1, d.getFullYear(), 
                            rslt[count.length].time_in, time, d.getMonth() + 1, d.getFullYear() 
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
                                        "UPDATE emp_attendance a \
                                        JOIN employees b ON a.emp_id = b.emp_id \
                                        SET a.status = 'Late' \
                                        WHERE MONTH(a.emp_date) = ? AND YEAR(a.emp_date) = ? AND a.status = 'Present' AND a.time_out IS NULL AND a.emp_date != CURDATE() AND a.status != 'OFF' AND b.location_code != 4 AND b.company_code != 10;",
                                        [ d.getMonth() + 1, d.getFullYear() ],
                                        ( err ) => {
                                            if( err )
                                            {
                                                console.log(err);
                                            }else
                                            {
                                                console.log( "All Attendance Updated" );
                                                UpdateLate();
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

UpdateAtt();

function UpdateLate()
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
                        [ rslt[count.length].time_in, time, d.getMonth() + 1, d.getFullYear(), rslt[count.length].emp_id],
                        ( err ) => {
                            if( err )
                            {
                                console.log(err);
                            }else
                            {
                                if ( ( count.length + 1 ) === limit )
                                {
                                    console.log( "All Lates Marked" );
                                    setTimeout(() => {
                                        UpdateAtt();
                                    }, (1000 * 60) * 60);
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
    UpdateAtt: () => UpdateAtt()
};