const express = require('express');
const router = express.Router();
const db = require('../db/connection');

router.post('/management/dashboard/login', ( req, res ) => {

    const { id, pass } = req.body;
    let id_matched = false;
    let pass_matched = false;
    let enc_id = false;

    db.query(
        "SELECT * FROM `tbl_management` WHERE login_id = ?;",
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
                    let emp_pass = decrypt( process.env.SALT, rslt[0].password );
                    id_matched = true;
                    enc_id = rslt[0].manager_id;
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

const decrypt = (salt, encoded) => {
    if ( salt !== null && encoded !== null )
    {
        const textToChars = (text) => text.split("").map((c) => c.charCodeAt(0));
        const applySaltToChar = (code) => textToChars(salt).reduce((a, b) => a ^ b, code);
        return encoded
            .match(/.{1,2}/g)
            .map((hex) => parseInt(hex, 16))
            .map(applySaltToChar)
            .map((charCode) => String.fromCharCode(charCode))
            .join("");
    }else
    {
        return null;
    }
};

// const crypt = (salt, text) => {
//     const textToChars = (text) => text.split("").map((c) => c.charCodeAt(0));
//     const byteHex = (n) => ("0" + Number(n).toString(16)).substr(-2);
//     const applySaltToChar = (code) => textToChars(salt).reduce((a, b) => a ^ b, code);
    
//     return text
//         .split("")
//         .map(textToChars)
//         .map(applySaltToChar)
//         .map(byteHex)
//         .join("");
// };