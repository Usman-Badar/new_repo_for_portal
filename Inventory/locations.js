const express = require('express');
const router = express.Router();
const db = require('../db/connection');

const CreateLogs = require('../Routes/Employee/logs').CreateLog;

router.post('/inventory/get_sub_locations', ( req, res ) => {

    const { location_code } = req.body;

    db.query(
        "SELECT * FROM `tbl_inventory_sub_locations` WHERE location_code = ? AND status = 'active';",
        [ location_code ],
        ( err, rslt ) => {

            if( err )
            {

                res.send(err);
                res.end();

            }else 
            {
                
                res.send( rslt );
                res.end();
                
            }
            
        }
    )

} );

router.post('/inventory/add_new_sub_location', ( req, res ) => {

    const { location_code, sub_location } = req.body;

    db.query(
        "SELECT sub_location_code, LOWER(`tbl_inventory_sub_locations`.`sub_location_name`), status FROM tbl_inventory_sub_locations WHERE sub_location_name = ? AND location_code = ?;",
        [ sub_location.toLowerCase(), location_code ],
        ( err, rslt ) => {

            if( err )
            {

                res.send(err);
                res.end();

            }else 
            {
                if ( rslt[0] )
                {
                    if ( rslt[0].status === 'active' )
                    {
                        res.send( 'exists' );
                        res.end();
                    }else if ( rslt[0].status === 'removed' )
                    {
                        db.query(
                            "UPDATE `tbl_inventory_sub_locations` SET status = ? WHERE sub_location_code = ?;",
                            [ 'active', rslt[0].sub_location_code ],
                            ( err ) => {
                    
                                if( err )
                                {
                    
                                    res.send(err);
                                    res.end();
                    
                                }else 
                                {
    
                                    CreateLogs( 
                                        'tbl_inventory_sub_locations', 
                                        rslt[0].sub_location_code,
                                        "Sub-Location '" + sub_location + "'was removed and now re-active.",
                                        'info'
                                    );
                                    res.send( 'found' );
                                    res.end();
                                    
                                }
                                
                            }
                        )
                    }
                }else
                {
                    db.query(
                        "INSERT INTO `tbl_inventory_sub_locations`(`location_code`, `sub_location_name`) VALUES (?,?);",
                        [ location_code, sub_location ],
                        ( err, rslt ) => {
                
                            if( err )
                            {
                
                                res.send(err);
                                res.end();
                
                            }else 
                            {
                                
                                res.send( rslt );
                                res.end();
                                
                            }
                            
                        }
                    )
                }
            }
            
        }
    )

} );

router.post('/inventory/remove_sub_location', ( req, res ) => {

    const { sub_location_code } = req.body;

    db.query(
        "UPDATE `tbl_inventory_sub_locations` sET status = 'removed' WHERE sub_location_code = ?;",
        [ sub_location_code ],
        ( err ) => {

            if( err )
            {

                res.send(err);
                res.end();

            }else 
            {
                
                res.send('success');
                res.end();
                
            }
            
        }
    )

} );

router.post('/inventory/edit_sub_location', ( req, res ) => {

    const { name, sub_location_code, location_code } = req.body;

    db.query(
        "SELECT LOWER(sub_location_name) FROM `tbl_inventory_sub_locations` WHERE sub_location_name = ? AND sub_location_code != ? AND location_code = ?;",
        [ name, sub_location_code, location_code ],
        ( err, rslt ) => {

            if( err )
            {

                res.send(err);
                res.end();

            }else 
            {
                
                if ( rslt[0] )
                {
                    res.send( 'exists' );
                    res.end();
                }else
                {
                    db.query(
                        "UPDATE `tbl_inventory_sub_locations` SET sub_location_name = ? WHERE sub_location_code = ?;",
                        [ name, sub_location_code ],
                        ( err ) => {
                
                            if( err )
                            {
                
                                res.send(err);
                                res.end();
                
                            }else 
                            {
                                
                                res.send( 'success' );
                                res.end();
                                
                            }
                            
                        }
                    )
                }
                
            }
            
        }
    )

} );

router.get('/inventory/get_locations', ( req, res ) => {

    db.query(
        "SELECT * FROM `locations` WHERE status = 'active';",
        ( err, rslt ) => {

            if( err )
            {

                res.send(err);
                res.end();

            }else 
            {
                
                res.send( rslt );
                res.end();
                
            }
            
        }
    )

} );

router.post('/inventory/add_new_location', ( req, res ) => {

    const { location, phone, address } = req.body;

    db.query(
        "SELECT location_code, LOWER(`locations`.`location_name`), status FROM locations WHERE location_name = ?;",
        [ location.toLowerCase() ],
        ( err, rslt ) => {

            if( err )
            {

                res.send(err);
                res.end();

            }else 
            {
                if ( rslt[0] )
                {
                    if ( rslt[0].status === 'active' )
                    {
                        res.send( 'exists' );
                        res.end();
                    }else if ( rslt[0].status === 'removed' )
                    {
                        db.query(
                            "UPDATE `locations` SET status = ?, location_phone = ?, address = ? WHERE location_code = ?;",
                            [ 'active', phone, address, rslt[0].location_code ],
                            ( err ) => {
                    
                                if( err )
                                {
                    
                                    res.send(err);
                                    res.end();
                    
                                }else 
                                {
    
                                    CreateLogs( 
                                        'locations', 
                                        rslt[0].location_code,
                                        "Location '" + location + "'was removed and now re-active.",
                                        'info'
                                    );
                                    res.send( 'found' );
                                    res.end();
                                    
                                }
                                
                            }
                        )
                    }
                }else
                {
                    db.query(
                        "INSERT INTO `locations`(`location_name`, `location_phone`, `address`) VALUES (?,?,?);",
                        [ location, phone, address ],
                        ( err, rslt ) => {
                
                            if( err )
                            {
                
                                res.send(err);
                                res.end();
                
                            }else 
                            {
                                
                                res.send( rslt );
                                res.end();
                                
                            }
                            
                        }
                    )
                }
            }
            
        }
    )

} );

router.post('/inventory/remove_location', ( req, res ) => {

    const { location_code } = req.body;

    db.query(
        "UPDATE `locations` SET status = 'removed' WHERE location_code = ?;",
        [ location_code ],
        ( err ) => {

            if( err )
            {

                res.send(err);
                res.end();

            }else 
            {
                
                res.send('success');
                res.end();
                
            }
            
        }
    )

} );

router.post('/inventory/edit_location', ( req, res ) => {

    const { name, phone, address, location_code } = req.body;

    db.query(
        "SELECT LOWER(location_name) FROM `locations` WHERE location_name = ? AND location_code != ?;",
        [ name, location_code ],
        ( err, rslt ) => {

            if( err )
            {

                res.send(err);
                res.end();

            }else 
            {
                
                if ( rslt[0] )
                {
                    res.send( 'exists' );
                    res.end();
                }else
                {
                    db.query(
                        "UPDATE `locations` SET location_name = ?, location_phone = ?, address = ? WHERE location_code = ?;",
                        [ name, phone, address, location_code ],
                        ( err ) => {
                
                            if( err )
                            {
                
                                res.send(err);
                                res.end();
                
                            }else 
                            {
                                
                                res.send( 'success' );
                                res.end();
                                
                            }
                            
                        }
                    )
                }
                
            }
            
        }
    )

} );

module.exports = router;