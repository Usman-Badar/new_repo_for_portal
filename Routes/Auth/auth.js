const express = require('express');
const router = express.Router();
const db = require('../../db/connection');

const io = require('../../server');

io.on('connection', ( socket ) => {

    // WHEN NEW USER LOGGED IN
    socket.on(
        'NewUser', ( id ) => {
            
            db.getConnection(
                ( err, connection ) => {
        
                    if ( err )
                    {

                        connection.release();
        
                    }else
                    {

                        console.log( 'CONNECTED', socket.id );

                        connection.query(
                            "UPDATE employees SET app_status = ? WHERE emp_id = ?",
                            [ socket.id, parseInt( id ) ],
                            () => {
                    
                                socket.broadcast.emit(
                                    'UserOnline', { err: null, rslt: [ { app_status: socket.id } ] }
                                )


                                connection.release();
                    
                            }
                        )
                    }
        
                }
            )
    
        }
    )

    // CHECK USER IS ALREADY LOGIN IN ANOTHER WINDOW
    socket.on(
        'UserCanLogin', ( id ) => {
            
            db.getConnection(
                ( err, connection ) => {
        
                    if ( err )
                    {

                        connection.release();
        
                    }else
                    {

                        connection.query(
                            "SELECT app_status FROM employees WHERE emp_id = ?",
                            [ parseInt( id ) ],
                            ( err, rslt ) => {
                    
                                socket.emit(
                                    'UserCanLogin', { err: err, rslt: rslt } // rslt
                                )

                                connection.release();
                    
                            }
                        )
                    }
        
                }
            )
    
        }
    )

    // WHEN A USER LOGGED OUT
    socket.on(
        'UserLost', ( id ) => {

            console.log( 'LOST', socket.id );
            
            db.getConnection(
                ( err, connection ) => {
        
                    if ( err )
                    {

                        connection.release();
        
                    }else
                    {
                        connection.query(
                            "UPDATE employees SET app_status = '' WHERE emp_id = ?",
                            [ parseInt( id ) ],
                            () => {
                    
                                socket.broadcast.emit(
                                    'UserOnline', { err: null, rslt: [ { app_status: '' } ] }
                                )
                                connection.release();
                    
                            }
                        )
                    }
        
                }
            )
    
        }
    )

    // WHEN A USER IS DISCONNECTED
    socket.on(
        'disconnect', () => {

            console.log( 'DISCONNECTED', socket.id );
            
            db.getConnection(
                ( err, connection ) => {
        
                    if ( err )
                    {

                        connection.release();
        
                    }else
                    {
                        connection.query(
                            "UPDATE employees SET app_status = '' WHERE app_status = ?",
                            [ socket.id ],
                            () => {
                    
                                socket.broadcast.emit(
                                    'UserOnline', { err: null, rslt: [ { app_status: '' } ] }
                                )
                                connection.release();
                    
                            }
                        )
                    }
        
                }
            )
    
        }
    )
});

router.get('/authemployee', ( req, res ) => {

    db.getConnection(
        ( err, connection ) => {

            if ( err )
            {

                res.status(503).send(err);
                res.end();

            }else
            {
                connection.query(
<<<<<<< HEAD
                    "SELECT emp_app_profile.* FROM emp_app_profile LEFT OUTER JOIN employees ON emp_app_profile.emp_id = employees.emp_id WHERE employees.emp_status = 'Active' AND lock_user = 'N';",
=======
                    "SELECT emp_app_profile.*, employees.lock_user FROM emp_app_profile LEFT OUTER JOIN employees ON emp_app_profile.emp_id = employees.emp_id WHERE employees.emp_status = 'Active';",
>>>>>>> df693b0fb18291af2d490c5bdf70980b9ea78c2d
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

router.get('/getemployeesid&name', ( req, res ) => {

    db.getConnection(
        ( err, connection ) => {

            if ( err )
            {
                res.status(503).send(err);
                res.end();

            }else
            {
                connection.query(
                    "SELECT emp_id, name FROM employees WHERE emp_status = 'Active';",
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

module.exports = router;