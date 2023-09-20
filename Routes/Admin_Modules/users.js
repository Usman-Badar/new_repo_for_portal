const express = require('express');
const router = express.Router();
const db = require('../../db/connection');

router.get('/getallusers', ( req, res ) => {

    db.getConnection(
        ( err, connection ) => {

            if ( err )
            {
                
                res.status(503).send(err);
                res.end();

            }else
            {
                connection.query(
                    "SELECT * FROM users",
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

router.post('/createuser', ( req, res ) => {

    const { UserName, UserRole, UserPassword, UsrImgName } = req.body;
    const { UsrImg } = req.files;
    
    let imgName = UsrImgName + '.png';

    db.getConnection(
        ( err, connection ) => {

            if ( err )
            {

                res.status(503).send(err);
                res.end();

            }else
            {
                connection.query(
                    "INSERT INTO users (user_image, user_name, user_password, role_id ) VALUES (?,?,?,?)",
                    [ imgName, UserName, UserPassword, UserRole ],
                    ( err, rslt ) => {
            
                        if( err )
                        {
            
                            res.status(500).send(err);
                            res.end();
                            connection.release();
            
                        }else 
                        {
            
                            UsrImg.mv('client/public/images/users/' + imgName, (err) => {
            
                                if (err) {
                        
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
                )
            }

        }
    )

} );

module.exports = router;