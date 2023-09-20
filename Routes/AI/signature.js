const express = require('express');
const router = express.Router();
const db = require('../../db/connection');

const io = require('../../server');
io.on('connection', ( socket ) => {

    socket.on(
        'signature_validation_process_connected', ( data ) => {
            
            socket.broadcast.emit(
                'signature_validation_process_connected', { connection: true }
            )
    
        }
    );

    socket.on(
        'signature_validation_process_model_saved', ( data ) => {
            
            setTimeout(() => {
                console.log('message sent');
                socket.broadcast.emit(
                    'signature_validation_process_model_saved', { saved: true }
                );
            }, 10000);
    
        }
    );

    socket.on(
        'signature_validation_process_message_for_approval', ( data ) => {

            if ( data.loss )
            {
                console.log( data.message, data.loss );
            }else
            if ( data.final )
            {
                let arr = JSON.parse(data.message);
                console.log( arr );
                require('fs').unlinkSync("assets/portal/assets/images/signatures/" + data.emp_id + "/signature_to_match.png");
                socket.broadcast.emit(
                    'signature_validation_process__match_results_for_approval', { label: arr[0].label, confidence: arr[0].confidence }
                );
            }if ( data.type )
            {
                if ( data.type === 'error' )
                {
                    console.log( 'err: ', data.message );
                }else
                {
                    console.log( 'rslt: ', data.message );
                }
            }else
            {
                console.log( data.message );
                socket.broadcast.emit(
                    'signature_validation_process_message_for_approval', { message: data.message }
                );
            }
    
        }
    );

    socket.on(
        'signature_validation_process_message', ( data ) => {

            if ( data.loss )
            {
                console.log( data.message, data.loss );
            }else
            if ( data.final )
            {
                let arr = JSON.parse(data.message);
                console.log( arr );
                require('fs').unlinkSync("assets/portal/assets/images/signatures/" + data.emp_id + "/signature_to_match.png");
                socket.broadcast.emit(
                    'signature_validation_process__match_results', { label: arr[0].label, confidence: arr[0].confidence }
                );
            }if ( data.type )
            {
                if ( data.type === 'error' )
                {
                    console.log( 'err: ', data.message );
                }else
                {
                    console.log( 'rslt: ', data.message );
                }
            }else
            {
                console.log( data.message );
                socket.broadcast.emit(
                    'signature_validation_process_message', { message: data.message }
                );
            }
    
        }
    );

    socket.on(
        'signature_validation_process_test_again', () => {
            
            socket.broadcast.emit(
                'signature_validation_process_test_again', { message: 'true' }
            )
    
        }
    );
    

    socket.on(
        'signature_validation_process_approve_again', () => {
            
            socket.broadcast.emit(
                'signature_validation_process_approve_again', { message: 'true' }
            )
    
        }
    );

    socket.on(
        'signature_validation_process_start', () => {
            
            socket.broadcast.emit(
                'signature_validation_process_start', { connection: true }
            )
    
        }
    );

});

// const fs = require('fs');
// const SendWhatsappNotification = require('../Whatsapp/whatsapp').SendWhatsappNotification;

router.post('/test/signature', ( req, res ) => {

    const { signature, emp_id } = req.body;
    const base64Data = signature.replace(/^data:image\/png;base64,/, "");

    require("fs").writeFile("assets/portal/assets/images/signatures/" + emp_id + "/signature_to_match.png", base64Data, 'base64', function(err) {
        console.log(err);
        console.log("Test Signature Saved");
        res.send("success");
        res.end();
    });

} );

router.post('/save/signature', ( req, res ) => {

    const { signature, count } = req.body;
    const base64Data = signature.replace(/^data:image\/png;base64,/, "");

    require("fs").writeFile("assets/portal/assets/images/signatures/default_signature_" + count + ".png", base64Data, 'base64', function(err) {
        console.log(err);
        console.log("Signature Saved");
        res.send("success");
        res.end();
    });

} );

router.post('/approve/signature', ( req, res ) => {

    const { emp_id } = req.body;

    db.query(
        "UPDATE `tbl_inventory_product_transactions` SET status = 'signatured & issued' WHERE employee = ? AND status = ? AND entry = ?;",
        [ emp_id, "signature pending", 'outward' ],
        ( err, rslt ) => {

            if( err )
            {

                console.log( err );

            }else 
            {
            
                console.log(rslt)
                res.send('success');
                res.end();

            }

        }
    )

} );

router.post('/save/modal', ( req, res ) => {

    const { emp_id } = req.body;
    const { Attachments } = req.files;
    require("fs").mkdir(
        'assets/portal/assets/images/signatures/' + emp_id,
        () => {
            for ( let x = 0; x < Attachments.length; x++ )
            {
                Attachments[x].mv("assets/portal/assets/images/signatures/" + emp_id + "/" + Attachments[x].name, (err) => {
                        if (err) 
                        {
                        
                            res.status(500).send(err);
                            res.end();

                        }

                    }
                )
            }
        }
    );

    require('fs').unlinkSync("assets/portal/assets/images/signatures/default_signature_1.png");
    require('fs').unlinkSync("assets/portal/assets/images/signatures/default_signature_2.png");
    require('fs').unlinkSync("assets/portal/assets/images/signatures/default_signature_3.png");

    res.send("success");
    res.end();

} );

router.post('/validate/signature', ( req, res ) => {

    const { signature } = req.body;
    const base64Data = signature.replace(/^data:image\/png;base64,/, "");

    require("fs").writeFile("assets/portal/assets/images/signatures/signature_to_match.png", base64Data, 'base64', function(err) {
        console.log(err);
    });

    res.send("success");
    res.end();

} );

router.get('/signature_users', ( req, res ) => {

    db.query(
        "SELECT \
        employees.emp_id, \
        employees.name, \
        emp_app_profile.emp_image \
        FROM emp_props \
        LEFT OUTER JOIN employees ON emp_props.emp_id = employees.emp_id \
        LEFT OUTER JOIN emp_app_profile ON employees.emp_id = emp_app_profile.emp_id \
        WHERE emp_props.item_request_exception = 1 \
        ORDER BY employees.name ASC;",
        ( err, rslt ) => {

            if( err )
            {

                console.log( err );

            }else 
            {
            
                res.send(rslt);
                res.end();

            }

        }
    )

} );

router.post('/inventory/list_of_outward', ( req, res ) => {

    const { emp_id } = req.body;

    db.query(
        "SELECT transaction_id, name, record_date, quantity FROM `tbl_inventory_product_transactions` WHERE employee = ? AND status = ? AND entry = ?;",
        [ emp_id, "signature pending", 'outward' ],
        ( err, rslt ) => {

            if( err )
            {

                console.log( err );

            }else 
            {
            
                res.send(rslt);
                res.end();

            }

        }
    )

} );

module.exports = router;