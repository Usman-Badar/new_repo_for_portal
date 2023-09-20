const express = require('express');
const router = express.Router();
const db = require('../../db/connection');

setInterval(() => {

    const d = new Date();
    db.getConnection(
        ( err, connection ) => {

            if ( !err )
            {

                connection.query(
                    "SELECT * FROM guests WHERE meeting_status = 'Waiting' GROUP BY meeting_time ASC LIMIT 1;",
                    (err, rslt) => {
            
                        if (err) {
            
                            res.status(500).send(err);
                            res.end();
                            connection.release();
            
                        } else {
            
                            if (rslt[0]) {
            
                                let time = null;
                                
                                let gethour = rslt[0].meeting_time.split(':').shift();
                                let getmin = rslt[0].meeting_time.split(':').pop();
                                var hours = gethour;
                                var minutes = getmin;
                                var ampm = hours >= 12 ? 'PM' : 'AM';
                                hours = hours % 12;
                                hours = hours ? hours : 12; // the hour '0' should be '12'
                                minutes = minutes < 10 ? '0' + minutes : minutes;
                                hours = hours < 10 ? '0' + hours : hours;
                                var fullTimes = hours + ':' + minutes + ':00 ' + ampm;
                                time = fullTimes.toString();
                                
            
                                connection.release();
                                if ( time === d.toLocaleTimeString().toString() )
                                {
            
                                    connection.release();
            
                                }
            
                            }
            
                        }
            
                    }
                )

            }else{
                
                res.status(503).send(err);
                res.end();
            }

        }
    )
    
    
}, 100000);

module.exports = router;