const express = require('express');
const router = express.Router();
const db = require('../db/connection');

router.post('/attendance/auth/login', ( req, res ) => {

    var key = 'real secret keys should be long and random';
    var encryptor = require('simple-encryptor')(key);

    const { id, pass } = req.body;
    let id_matched = false;
    let pass_matched = false;
    let enc_id = false;

    db.query(
        "SELECT * FROM `emp_app_profile` WHERE attendance_login_id = ?;",
        [id],
        ( err, rslt ) => {

            if( err )
            {

                res.send(err);
                res.end();

            }else 
            {
                
                if ( rslt[0] )
                {
                    let emp_pass = encryptor.decrypt(rslt[0].attendance_password);
                    id_matched = true;
                    enc_id = rslt[0].emp_id;
                    if ( pass === emp_pass )
                    {
                        pass_matched = true;
                    }
                }

                res.send( JSON.stringify({ id_matched: id_matched, pass_matched: pass_matched, id: enc_id }) );
                res.end();
                
            }
            
        }
    )

} );

module.exports = router;