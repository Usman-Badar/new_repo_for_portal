const express = require('express');
const router = express.Router();
const db = require('../../db/connection');

router.get('/getallmeetableemployees', ( req, res ) => {
    
    db.query(
        "SELECT emp_app_profile.emp_image, employees.emp_id, employees.name, employees.department_code, employees.designation_code FROM employees \
        RIGHT OUTER JOIN emp_app_profile ON employees.emp_id = emp_app_profile.emp_id \
        RIGHT OUTER JOIN departments ON departments.department_code = employees.department_code \
        RIGHT OUTER JOIN designations ON designations.designation_code = employees.designation_code \
        WHERE employees.guest_meetable != 0;",
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

router.post('/GetGuestOnKeyWord', ( req, res ) => {

    const { Column, key } = req.body;

    db.getConnection(
        ( err, connection ) => {

            if ( err )
            {
                res.status(503).send(err);
                res.end();

            }else
            {
                connection.query(
                    "SELECT * FROM guests \
                    WHERE " + Column + " LIKE '%" + key + "%';",
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

router.post('/getallregisteredguestslocationwise', ( req, res ) => {

    const { location } = req.body;

    db.getConnection(
        ( err, connection ) => {

            if ( err )
            {

                res.status(503).send(err);
                res.end();

            }else
            {
                connection.query(
                    "SELECT employees.name AS meeting_person, guests.* FROM guests LEFT OUTER JOIN employees ON guests.emp_id = employees.emp_id WHERE guests.location_code = " + location + " GROUP BY id DESC",
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

router.post('/registerguest', ( req, res ) => {

    const { data } = req.body;
    const { GuestName, GuestPhone, MeetingWith, MeetingTime, location, GstImgName, GstImg } = JSON.parse( data );

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
                    "SELECT current_location FROM tblthumbdevices WHERE device_id = ?",
                    [ location ],
                    ( err, location_id ) => {
            
                        if( err )
                        {
            
                            console.log( err );
                            res.status(500).send(err);
                            res.end();
                            connection.release();
            
                        }else 
                        {
            
                            connection.query(
                                "INSERT INTO guests (guest_image, guest_name, guest_phone) VALUES (?,?,?)",
                                [ GstImgName + '.jpg', GuestName, GuestPhone ],
                                ( err, rslt ) => {
                        
                                    if( err )
                                    {
                        
                                        console.log( err );
                                        res.status(500).send(err);
                                        res.end();
                                        connection.release();
                        
                                    }else 
                                    {
                        
                                        connection.query(
                                            "SELECT id FROM guests WHERE guest_phone = '" + GuestPhone + "' AND guest_name = '" + GuestName + "'",
                                            ( err, rslt ) => {
                                    
                                                if( err )
                                                {
                                    
                                                    console.log( err );
                                                    res.status(500).send(err);
                                                    res.end();
                                                    connection.release();
                                    
                                                }else 
                                                {
                                    
                                                    connection.query(
                                                        "INSERT INTO guest_meetings (guest_id, emp_id, location_code, meeting_time, meeting_date) VALUES (?,?,?,?,?)",
                                                        [ rslt[0].id, MeetingWith, location_id[0].current_location, MeetingTime, d ],
                                                        ( err, rslt ) => {
                                                
                                                            if( err )
                                                            {
                                                
                                                                console.log( err );
                                                                res.status(500).send(err);
                                                                res.end();
                                                                connection.release();
                                                
                                                            }else 
                                                            {
                                                
                                                                GstImg.mv('images/guests/' + GstImgName + '.jpg', (err) => {
            
                                                                    if (err) {
                                    
                                                                        console.log(err)
                                                                        res.status(500).send(err);
                                                                        res.end();
                                                                        connection.release();
                                                            
                                                                    }else
                                                                    {
                                                                        res.send('Done');
                                                                        res.end();
                                                                        connection.release();
                                                                    }
                                                            
                                                                });
                                                
                                                            }
                                                
                                                        }
                                                    );
                                    
                                                }
                                    
                                            }
                                        );
                        
                                    }
                        
                                }
                            );
            
                        }
            
                    }
                );
            }

        }
    )

} );

router.post('/registerguest2', ( req, res ) => {

    const { data } = req.body;
    const { GuestID, MeetingWith, MeetingTime, location } = JSON.parse( data );

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
                    "SELECT current_location FROM tblthumbdevices WHERE device_id = ?",
                    [ location ],
                    ( err, location_id ) => {
            
                        if( err )
                        {
            
                            console.log( err );
                            res.status(500).send(err);
                            res.end();
                            connection.release();
            
                        }else 
                        {
            
                            connection.query(
                                "INSERT INTO guest_meetings (guest_id, emp_id, location_code, meeting_time, meeting_date) VALUES (?,?,?,?,?)",
                                [ GuestID, MeetingWith, location_id[0].current_location, MeetingTime, d ],
                                ( err, rslt ) => {
                        
                                    if( err )
                                    {
                        
                                        console.log( err );
                                        res.status(500).send(err);
                                        res.end();
                                        connection.release();
                        
                                    }else 
                                    {
                        
                                        res.send('Done');
                                        res.end();
                                        connection.release();
                        
                                    }
                        
                                }
                            );
            
                        }
            
                    }
                );
            }

        }
    )

} );

router.post('/getallactiveguests', ( req, res ) => {

    const { machine_id } = req.body;

    db.query(
        "SELECT current_location FROM tblthumbdevices WHERE device_id = ?",
        [ machine_id ],
        (err, rslt) => {

            if (err) {

                res.status(500).send(err);
                res.end();

            } else {

                db.query(
                    "SELECT \
                    guests.*, \
                    guest_meetings.meeting_time, \
                    guest_meetings.meeting_date, \
                    guest_meetings.id AS meeting_id, \
                    guest_meetings.guest_off_time \
                    FROM \
                    guests \
                    LEFT OUTER JOIN guest_meetings ON guests.id = guest_meetings.guest_id \
                    WHERE guest_meetings.location_code = ? AND DATE(meeting_date) = CURDATE() AND guest_meetings.guest_off_time IS NULL",
                    [ rslt[0].current_location ],
                    (err, rslt) => {
            
                        if (err) {
            
                            res.status(500).send(err);
                            res.end();
            
                        } else {
            
                            res.send(rslt);
                            res.end();
                            
                        }
            
                    }
                )
                
            }

        }
    )

} );

router.post('/outguest', ( req, res ) => {

    const { id, time } = req.body;

    db.query(
        "UPDATE guest_meetings SET guest_off_time = ? WHERE id = ?",
        [ time, id ],
        (err, rslt) => {

            if (err) {

                res.status(500).send(err);
                res.end();

            } else {

                res.send('success');
                res.end();
                
            }

        }
    )

} );

module.exports = router;