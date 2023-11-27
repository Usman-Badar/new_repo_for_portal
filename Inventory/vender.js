const express = require('express');
const router = express.Router();
const db = require('../db/connection');
const { SendWhatsappNotification } = require('../Routes/Whatsapp/whatsapp');

router.post('/inventory/venders/all', ( req, res ) => {

    db.query(
        "SELECT * FROM `tbl_inventory_venders` WHERE status = 'active' ORDER BY vender_id DESC;" +
        "SELECT COUNT(*) AS total_venders FROM tbl_inventory_venders WHERE status = 'active';",
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

router.post('/inventory/vender/send_code', ( req, res ) => {
    const { vendor_id, phone, contact_person } = req.body;
    const codeArr = ['0','1','2','3','4','5','6','7','8','9'];
    const code = codeArr[Math.floor(Math.random() * codeArr.length)]+codeArr[Math.floor(Math.random() * codeArr.length)]+codeArr[Math.floor(Math.random() * codeArr.length)]+codeArr[Math.floor(Math.random() * codeArr.length)]+codeArr[Math.floor(Math.random() * codeArr.length)]+codeArr[Math.floor(Math.random() * codeArr.length)];
    db.query(
        "UPDATE `tbl_inventory_venders` SET verification_code = ? WHERE vender_id = ?;",
        [ code, vendor_id ],
        ( err ) => {
            if( err )
            {
                console.log(err);
                res.send(err);
                res.end();
            }else 
            {
                SendWhatsappNotification( null, null, "Hi " + contact_person, "You are now registering on seaboard web portal, to be our registered vendor, you need verification. Your verification code is: \n" + code, phone );
                res.send( 'success' );
                res.end();
            }
            
        }
    )
} );

router.post('/inventory/vender/details', ( req, res ) => {
    const { vendor_id } = req.body;
    db.query(
        "SELECT * FROM `tbl_inventory_venders` WHERE vender_id = ?;",
        [ vendor_id ],
        ( err, rslt ) => {
            if( err )
            {
                console.log(err);
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

router.post('/inventory/vender/purchase_orders', ( req, res ) => {
    const { vendor_id } = req.body;
    db.query(
        "SELECT tbl_inventory_purchase_order.*, companies.code FROM `tbl_inventory_purchase_order` LEFT OUTER JOIN companies ON tbl_inventory_purchase_order.company_code = companies.company_code WHERE tbl_inventory_purchase_order.vendor_id = ? ORDER BY tbl_inventory_purchase_order.po_id DESC;",
        [ vendor_id ],
        ( err, rslt ) => {
            if( err )
            {
                console.log(err);
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

router.post('/inventory/vender/verification', ( req, res ) => {
    const { code, vendor_id, contact_person, phone } = req.body;
    db.query(
        "SELECT * FROM `tbl_inventory_venders` WHERE verification_code = ? AND vender_id = ?;",
        [ code, vendor_id ],
        ( err, rslt ) => {
            if( err )
            {
                console.log(err);
                res.send(err);
                res.end();
            }else 
            {
                if ( rslt[0] )
                {
                    db.query(
                        "UPDATE `tbl_inventory_venders` SET verified = 1 WHERE verification_code = ?;",
                        [ code ],
                        ( err ) => {
                            if( err )
                            {
                                console.log(err);
                                res.send(err);
                                res.end();
                            }else 
                            {
                                SendWhatsappNotification( null, null, "Hi " + contact_person, "You are now a registered vendor of seaboard group.", phone );
                                res.send('success');
                                res.end();
                            }
                        }
                    )
                }else
                {
                    res.send('not found');
                    res.end();
                }
            }
        }
    )
} );

router.post('/inventory/venders/create', ( req, res ) => {

    const { name, contact_person, phone, ntn_no, address } = req.body;
    const codeArr = ['0','1','2','3','4','5','6','7','8','9'];
    const code = codeArr[Math.floor(Math.random() * codeArr.length)]+codeArr[Math.floor(Math.random() * codeArr.length)]+codeArr[Math.floor(Math.random() * codeArr.length)]+codeArr[Math.floor(Math.random() * codeArr.length)]+codeArr[Math.floor(Math.random() * codeArr.length)]+codeArr[Math.floor(Math.random() * codeArr.length)];

    db.query(
        "SELECT LOWER(name), vender_id, status FROM `tbl_inventory_venders` WHERE name = ? OR phone = ?;",
        [ name.toLowerCase(), phone ],
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
                            "UPDATE `tbl_inventory_venders` SET status = ?, name = ?, contact_person = ?, address = ?, ntn_no = ?, phone = ? WHERE vender_id = ?;",
                            [ 'active', name, contact_person, address, ntn_no, phone, rslt[0].vender_id ],
                            ( err ) => {
                    
                                if( err )
                                {
                    
                                    console.log(err)
                                    res.send(err);
                                    res.end();
                    
                                }else 
                                {
    
                                    res.send( 'found' );
                                    res.end();
                                    
                                }
                                
                            }
                        )
                    }
                }else
                {
                    db.query(
                        "INSERT INTO `tbl_inventory_venders`(`name`, `contact_person`, `phone`, `address`, `ntn_no`, `verification_code`) VALUES (?,?,?,?,?,?);",
                        [ name, contact_person, phone, address, ntn_no === '' ? null : ntn_no, code ],
                        ( err ) => {
                            
                            if( err )
                            {
                
                                console.log(err);
                                res.send(err);
                                res.end();
                
                            }else 
                            {
                
                                SendWhatsappNotification( null, null, "Hi " + contact_person, "You are now registering on seaboard web portal, to be our registered vendor, you need verification. Your verification code is: \n" + code, phone );
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

router.post('/inventory/venders/remove', ( req, res ) => {

    const { id } = req.body;

    db.query(
        "UPDATE tbl_inventory_venders SET status = 'removed' WHERE vender_id = ?",
        [id],
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

router.post('/inventory/venders/edit', ( req, res ) => {

    const { name, contact_person, phone, address, ntn_no, vender_id } = req.body;

    db.query(
        "SELECT LOWER(name) FROM `tbl_inventory_venders` WHERE name = ? AND vender_id != ?;",
        [ name, vender_id ],
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
                        "UPDATE `tbl_inventory_venders` SET name = ?, contact_person = ?, phone = ?, address = ?, ntn_no = ?, verified = 0 WHERE vender_id = ?;",
                        [ name, contact_person, phone, address, ntn_no === '' ? null : ntn_no, vender_id ],
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

router.post(
    '/inventory/venders/search',
    ( req, res ) => {

        const { key } = req.body;

        db.query(
            "SELECT * FROM `tbl_inventory_venders` WHERE tbl_inventory_venders.name LIKE '%" + key + "%' AND status = 'active';",
            ( err, rslt ) => {
    
                if( err )
                {
    
                    console.log( err )
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
)

module.exports = router;