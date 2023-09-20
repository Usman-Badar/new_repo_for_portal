const express = require('express');
const router = express.Router();
const db = require('../../db/connection');

const SendWhatsappNotification = require('../Whatsapp/whatsapp').SendWhatsappNotification;
const CreateLogs = require('../Employee/logs').CreateLog;
const io = require('../../server');

io.on('connection', ( socket ) => {

    // WHEN NEW USER LOGGED IN
    socket.on(
        'somethingchangeinitemrequest', ( request_id ) => {
            
            socket.broadcast.emit(
                'somethingchangeinitemrequest', request_id 
            )
    
        }
    )

    socket.on(
        'newitemrequestcomment', ( request_id ) => {
            
            socket.broadcast.emit(
                'newitemrequestcomment', request_id 
            )
    
        }
    )

});

router.post('/getallitemrequests', ( req, res ) => {

    const { emp_id, access } = req.body;
    let allAccess = false;
    const empAccess = JSON.parse( access );
    let query;
    let perameters;
    for ( let x = 0; x < empAccess.length; x++ )
    {
        if ( parseInt(empAccess[x]) === 48 || parseInt(empAccess[x]) === 0 )
        {
            allAccess = true;
        }
    }
    // if ( empAccess.includes(530) || empAccess.includes(1) )
    // {
    //     query = "SELECT \
    //     tbl_item_requests.*, \
    //     locations.location_name, \
    //     companies.company_name, \
    //     receiver.name AS receiver_name, \
    //     sender.name AS sender_name \
    //     FROM \
    //     tbl_item_requests \
    //     LEFT OUTER JOIN locations ON tbl_item_requests.location_code = locations.location_code \
    //     LEFT OUTER JOIN companies ON tbl_item_requests.company_code = companies.company_code \
    //     LEFT OUTER JOIN employees receiver ON tbl_item_requests.received_by = receiver.emp_id \
    //     LEFT OUTER JOIN employees sender ON tbl_item_requests.request_by = sender.emp_id \
    //     WHERE \
    //     tbl_item_requests.request_by = ? OR tbl_item_requests.received_by = ? OR tbl_item_requests.acted_by = ? OR tbl_item_requests.status = 'approved' OR tbl_item_requests.status = 'proceed to purchase requisition' OR tbl_item_requests.status = 'delivery is in process' OR tbl_item_requests.status = 'delivered' ORDER BY tbl_item_requests.id DESC LIMIT 15;";
    //     perameters = [ emp_id, emp_id, emp_id ];
    // }else
    // {
        query = "SELECT \
        tbl_item_requests.*, \
        locations.location_name, \
        companies.company_name, \
        receiver.name AS receiver_name, \
        sender.name AS sender_name \
        FROM \
        tbl_item_requests \
        LEFT OUTER JOIN locations ON tbl_item_requests.location_code = locations.location_code \
        LEFT OUTER JOIN companies ON tbl_item_requests.company_code = companies.company_code \
        LEFT OUTER JOIN employees receiver ON tbl_item_requests.received_by = receiver.emp_id \
        LEFT OUTER JOIN employees sender ON tbl_item_requests.request_by = sender.emp_id \
        " + ( !allAccess ? "WHERE tbl_item_requests.request_by = ? OR tbl_item_requests.received_by = ? OR tbl_item_requests.acted_by = ?" : "" ) + " ORDER BY tbl_item_requests.id DESC;";
        perameters = [ emp_id, emp_id, emp_id ];
    // }

    // WHERE tbl_item_requests.status = 'approved' OR tbl_item_requests.status = 'proceed to purchase requisition' OR tbl_item_requests.status = 'delivery is in process' OR tbl_item_requests.status = 'delivered' OR tbl_item_requests.status = 'partially delivered' OR tbl_item_requests.status = 'at_store' OR tbl_item_requests.status = 'delivering_to_inventory' OR  \

    db.query(
        query,
        perameters,
        ( err, rslt ) => {

            if( err )
            {

                console.log(err)
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

router.post('/getitemrequestdetails', ( req, res ) => {

    const { id } = req.body;

    db.query(
        "SELECT \
        tbl_item_requests.*, \
        companies.company_name, \
        locations.location_name, \
        receiver.name AS receiver_name, \
        requisition.name AS requisition_name, \
        acted.name AS acted_name, \
        sender.name AS sender_name \
        FROM \
        tbl_item_requests \
        LEFT OUTER JOIN companies ON tbl_item_requests.company_code = companies.company_code \
        LEFT OUTER JOIN locations ON tbl_item_requests.location_code = locations.location_code \
        LEFT OUTER JOIN employees receiver ON tbl_item_requests.received_by = receiver.emp_id \
        LEFT OUTER JOIN employees requisition ON tbl_item_requests.pr_request_generate_by = requisition.emp_id \
        LEFT OUTER JOIN employees sender ON tbl_item_requests.request_by = sender.emp_id \
        LEFT OUTER JOIN employees acted ON tbl_item_requests.acted_by = acted.emp_id \
        WHERE tbl_item_requests.id = ?;",
        [ id ],
        ( err, rslt ) => {

            if( err )
            {

                console.log(err);
                res.status(500).send(err);
                res.end();

            }else 
            {
                
                db.query(
                    "SELECT \
                    tbl_item_requests_specifications.*, \
                    tbl_inventory_sub_categories.name  \
                    FROM \
                    tbl_item_requests_specifications \
                    LEFT OUTER JOIN tbl_inventory_sub_categories ON tbl_item_requests_specifications.item_id = tbl_inventory_sub_categories.id \
                    WHERE tbl_item_requests_specifications.request_id = ?",
                    [ rslt[0].id ],
                    ( err, result ) => {
            
                        if( err )
                        {
            
                            console.log(err);
                            res.status(500).send(err);
                            res.end();
            
                        }else 
                        {
                            
                            let arr = [];
                            arr.push( rslt );
                            arr.push( result );
                            res.send( arr );
                            res.end();
            
                        }
            
                    }
                )

            }

        }
    )
    
} );

router.post('/newitemrequest', ( req, res ) => {

    const { request_by, company_code, location_code, hod, specifications } = req.body;

    let specificationsData = JSON.parse( specifications );
    const d = new Date();
    let request_to = hod;
    if ( parseInt(hod) === 0 )
    {
        request_to = 20015;
    }

    db.getConnection(
        ( err, connection ) => {
            connection.beginTransaction(
                ( err ) => {
                    if ( err )
                    {
                        connection.rollback(() => {console.log(err);connection.release();});
                    }else
                    {
                        connection.query(
                            "INSERT INTO `tbl_item_requests`(`location_code`, `company_code`, `request_by`, `request_date`, `request_time`, `received_by`, `received_date`, `received_time`, `hod_approval_required`) VALUES (?,?,?,?,?,?,?,?,?);",
                            [ location_code, company_code, request_by, d, d.toTimeString(), request_to, d, d.toTimeString(), parseInt(hod) !== 0 ? 1 : 0 ],
                            ( err, rslt ) => {
                    
                                if( err )
                                {
                                    connection.rollback(() => {console.log(err);connection.release();});
                                    res.send('err');
                                    res.end();
                                }else 
                                {
                                    let limit = specificationsData.length;
                                    let count = [];
                                    function InsertRows()
                                    {
                                        connection.query(
                                            "INSERT INTO `tbl_item_requests_specifications`(`request_id`, `item_id`, `reason`, `required_quantity`, `hod_approval_required`) VALUES (?,?,?,?,?);",
                                            [ rslt.insertId, specificationsData[count.length].item_id, specificationsData[count.length].reason, specificationsData[count.length].required_quantity, specificationsData[count.length].hod_approval_required == 'null' || specificationsData[count.length].hod_approval_required == 'undefined' || specificationsData[count.length].hod_approval_required == null ? 0 : specificationsData[count.length].hod_approval_required ],
                                            ( err ) => {
                                    
                                                if( err )
                                                {
                                                    connection.rollback(() => {console.log(err);connection.release();});
                                                    res.status(500).send(err);
                                                    res.end();
                                                }else 
                                                {

                                                    if ( ( count.length + 1 ) === limit )
                                                    {
                                                        CreateLogs( 
                                                            'tbl_item_requests', 
                                                            rslt.insertId,
                                                            "New item request initialized",
                                                            'info'
                                                        );
                                                        connection.query(
                                                            "SELECT name, cell FROM employees WHERE emp_id = ?;" + 
                                                            "SELECT name, cell FROM employees WHERE emp_id = ?;",
                                                            [ request_by, request_to ],
                                                            ( err, result ) => {
                                                    
                                                                if( err )
                                                                {
                                                                    connection.rollback(() => {console.log(err);connection.release();});
                                                                    res.status(500).send(err);
                                                                    res.end();
                                                                }else
                                                                {
                                                                    SendWhatsappNotification( null, null, "Hi " + result[0][0].name, " Your item request has been sent. Please wait while we are reviewing your request.", result[0][0].cell );
                                                                    SendWhatsappNotification( null, null, "Hi " + result[1][0].name, result[0][0].name + " has sent you an item request on portal. Kindly review.", result[1][0].cell );
                                                                }
                                                    
                                                            }
                                                        );
                                                        connection.commit((err) => {
                                                            if ( err ) {
                                                                connection.rollback(() => {console.log(err);connection.release();});
                                                                res.send('err');
                                                                res.end();
                                                            }else
                                                            {
                                                                connection.release();
                                                                res.send('success');
                                                                res.end();
                                                            }
                                                        });
                                                    }else
                                                    {
                                                        count.push(1);
                                                        InsertRows();
                                                    }
                                                    // if ( !hod_approval )
                                                    // {
                                                    //     db.query(
                                                    //         "UPDATE tbl_item_requests SET status = ?, acted_by = ?, acted_date = ?, acted_time = ?, remarks = ? WHERE id = ?",
                                                    //         [ 'approved', requestData.request_to, d, d.toTimeString(), "The request has been approved by the system on behalf of the receiver, and diverted to the inventory department due to the items do not require H.O.D's approval.", rslt[1][0].id ],
                                                    //         ( err ) => {
                                                    
                                                    //             if( err )
                                                    //             {
                                                    
                                                    //                 console.log( err );
                                                    //                 res.status(500).send(err);
                                                    //                 res.end();
                                                    
                                                    //             }else 
                                                    //             {
                                                                
                                                    //                 CreateLogs( 
                                                    //                     'tbl_item_requests', 
                                                    //                     rslt.insertId,
                                                    //                     "This request has been approved",
                                                    //                     'info'
                                                    //                 );
                                                    //                 CreateLogs( 
                                                    //                     'tbl_item_requests', 
                                                    //                     rslt.insertId,
                                                    //                     "Pending for delivery",
                                                    //                     'info'
                                                    //                 );
                                                    //                 res.send("Success");
                                                    //                 res.end();
                                                    
                                                    //             }
                                                    
                                                    //         }
                                                    //     )
                                                    // }else
                                                    // {
                                                    //     res.send("Success");
                                                    //     res.end();
                                                    // }
                                    
                                                }
                                    
                                            }
                                        )
                                    }
                                    InsertRows();
                                }
                                
                            }
                        );
                    }
                }
            )
        }
    )

} );

router.post('/edititemrequest', ( req, res ) => {

    const { request_id, edit_by, company_code, location_code, reason, specifications } = req.body;

    let specificationsData = JSON.parse( specifications );
    const d = new Date();
    db.getConnection(
        ( err, connection ) => {
            connection.beginTransaction(
                ( err ) => {
                    if ( err )
                    {
                        connection.rollback(() => {console.log(err);connection.release();});
                    }else
                    {
                        connection.query(
                            "UPDATE `tbl_item_requests` SET location_code = ?, company_code = ?, edited_by = ?, edited_date = ?, edited_time = ?, edited_reason = ? WHERE id = ?;" +
                            "DELETE FROM tbl_item_requests_specifications WHERE request_id = ?;",
                            [ location_code, company_code, edit_by, d, d.toTimeString(), reason, request_id, request_id ],
                            ( err, rslt ) => {
                    
                                if( err )
                                {
                                    connection.rollback(() => {console.log(err);connection.release();});
                                    res.status(500).send(err);
                                    res.end();
                                }else 
                                {
                                    let limit = specificationsData.length;
                                    let count = [];
                                    function InsertRows()
                                    {
                                        connection.query(
                                            "INSERT INTO `tbl_item_requests_specifications`(`request_id`, `item_id`, `reason`, `required_quantity`, `hod_approval_required`) VALUES (?,?,?,?,?);",
                                            [ request_id, specificationsData[count.length].item_id, specificationsData[count.length].reason, specificationsData[count.length].required_quantity, specificationsData[count.length].hod_approval_required ],
                                            ( err ) => {
                                    
                                                if( err )
                                                {
                                                    connection.rollback(() => {console.log(err);connection.release();});
                                                    res.status(500).send(err);
                                                    res.end();
                                                }else 
                                                {

                                                    if ( ( count.length + 1 ) === limit )
                                                    {
                                                        CreateLogs( 
                                                            'tbl_item_requests', 
                                                            request_id,
                                                            "New item request initialized",
                                                            'info'
                                                        );
                                                        connection.query(
                                                            "SELECT name, cell FROM employees WHERE emp_id = ?;",
                                                            [ edit_by ],
                                                            ( err, result ) => {
                                                    
                                                                if( err )
                                                                {
                                                                    connection.rollback(() => {console.log(err);connection.release();});
                                                                    res.status(500).send(err);
                                                                    res.end();
                                                                }else
                                                                {
                                                                    SendWhatsappNotification( null, null, "Hi " + result[0][0].name, ` Item request has been updated with id#${request_id}.`, result[0][0].cell );
                                                                }
                                                    
                                                            }
                                                        );
                                                        connection.commit((err) => {
                                                            if ( err ) {
                                                                connection.rollback(() => {console.log(err);connection.release();});
                                                                res.send('err');
                                                                res.end();
                                                            }else
                                                            {
                                                                connection.release();
                                                                res.send('success');
                                                                res.end();
                                                            }
                                                        });
                                                    }else
                                                    {
                                                        count.push(1);
                                                        InsertRows();
                                                    }
                                                }
                                    
                                            }
                                        )
                                    }
                                    InsertRows();
                                }
                                
                            }
                        );
                    }
                }
            )
        }
    )

} );

router.post('/cancelitemrequest', ( req, res ) => {

    const { request_id, emp_id, reason } = req.body;

    db.query(
        "UPDATE tbl_item_requests SET status = ?, acted_by = ?, acted_date = ?, acted_time = ?, remarks = ? WHERE id = ?",
        [ 'canceled', emp_id, new Date(), new Date().toTimeString(), reason, request_id ],
        ( err ) => {

            if( err )
            {

                console.log( err );
                res.status(500).send(err);
                res.end();

            }else 
            {
             
                CreateLogs( 
                    'tbl_item_requests', 
                    request_id,
                    "This request has been canceled",
                    'info'
                );
                db.query(
                    "SELECT name, cell FROM employees WHERE emp_id = ?;",
                    [ emp_id ],
                    ( err, result ) => {
            
                        if( err )
                        {
            
                            console.log( err );
                            res.send( err );
                            res.end();
            
                        }else
                        {
                            SendWhatsappNotification( null, null, "Hi " + result[0][0].name, "Your item request has been cancelled.", result[0][0].cell );
                        }
            
                    }
                );
                res.send("Success");
                res.end();

            }

        }
    )

} );

router.post('/newitemrequestcomment', ( req, res ) => {

    const { comment, item_request_id, sender_id } = req.body;
    const d = new Date();

    db.query(
        "INSERT INTO `tbl_item_request_comments`(`item_request_id`, `sender_id`, `send_date`, `send_time`, `comment`) VALUES (?,?,?,?,?);",
        [ item_request_id, sender_id, d, d.toTimeString(), comment ],
        ( err ) => {

            if( err )
            {

                res.status(500).send(err);
                res.end();

            }else 
            {

                res.send('success');
                res.end();

            }

        }
    )

} );

router.post('/getitemrequestcomments', ( req, res ) => {

    const { id } = req.body;

    db.query(
        "SELECT \
        tbl_item_request_comments.*, \
        employees.name \
        FROM  \
        tbl_item_request_comments \
        LEFT OUTER JOIN employees ON tbl_item_request_comments.sender_id = employees.emp_id \
        WHERE \
        tbl_item_request_comments.item_request_id = ?;",
        [ id ],
        ( err, rslt ) => {

            if( err )
            {

                console.log( err );
                res.status(500).send(err);
                res.end();

            }else 
            {

                res.send(rslt);
                res.end();

            }

        }
    )

} );

router.post('/approveitemrequest', ( req, res ) => {

    const { request_id, emp_id, reason } = req.body;

    db.query(
        "UPDATE tbl_item_requests SET status = ?, acted_by = ?, acted_date = ?, acted_time = ?, remarks = ? WHERE id = ?;" + 
        "SELECT request_by FROM tbl_item_requests WHERE id = ?",
        [ 'approved', emp_id, new Date(), new Date().toTimeString(), reason, request_id, request_id ],
        ( err, rslt ) => {

            if( err )
            {

                console.log( err );
                res.status(500).send(err);
                res.end();

            }else 
            {
             
                res.send("Success");
                res.end();
                CreateLogs( 
                    'tbl_item_requests', 
                    request_id,
                    "This request has been approved",
                    'info'
                );
                CreateLogs( 
                    'tbl_item_requests', 
                    request_id,
                    "Pending for delivery",
                    'info'
                );
                db.query(
                    "SELECT name, cell FROM employees WHERE emp_id = ?;" + 
                    "SELECT name, cell FROM employees WHERE emp_id = ?;" + 
                    "SELECT name, cell FROM employees WHERE emp_id = ?;",
                    [ emp_id, rslt[1][0].request_by, 20015 ],
                    ( err, result ) => {
            
                        if( err )
                        {
            
                            console.log( err );
                            res.send( err );
                            res.end();
            
                        }else
                        {
                            SendWhatsappNotification( null, null, "Hi " + result[0][0].name, "You have approved an item request on portal, the requested employee has been notified.", result[0][0].cell );
                            SendWhatsappNotification( null, null, "Hi " + result[1][0].name, result[0][0].name + " has approve your item request on portal.", result[1][0].cell );
                            SendWhatsappNotification( null, null, "Hi " + result[2][0].name, result[0][0].name + " has approve an item request on portal. Kindly view.", result[2][0].cell );
                        }
            
                    }
                );

            }

        }
    )

} );

router.post('/rejectitemrequest', ( req, res ) => {

    const { request_id, emp_id, reason } = req.body;

    db.query(
        "UPDATE tbl_item_requests SET status = ?, acted_by = ?, acted_date = ?, acted_time = ?, remarks = ? WHERE id = ?;" + 
        "SELECT request_by FROM tbl_item_requests WHERE id = ?",
        [ 'rejected', emp_id, new Date(), new Date().toTimeString(), reason, request_id, request_id ],
        ( err, rslt ) => {

            if( err )
            {

                console.log( err );
                res.status(500).send(err);
                res.end();

            }else 
            {
             
                CreateLogs( 
                    'tbl_item_requests', 
                    request_id,
                    "This request has been approved",
                    'info'
                );
                db.query(
                    "SELECT name, cell FROM employees WHERE emp_id = ?;" +
                    "SELECT name, cell FROM employees WHERE emp_id = ?;",
                    [ emp_id, rslt[1][0].request_by ],
                    ( err, result ) => {
            
                        if( err )
                        {
            
                            console.log( err );
                            res.send( err );
                            res.end();
            
                        }else
                        {
                            SendWhatsappNotification( null, null, "Hi " + result[0][0].name, "You have rejected an item request on portal.", result[0][0].cell );
                            SendWhatsappNotification( null, null, "Hi " + result[1][0].name, result[0][0].name + " have rejected your item request on portal.", result[1][0].cell );
                        }
            
                    }
                );
                res.send("Success");
                res.end();

            }

        }
    )

} );

router.post('/deliveritemrequest', ( req, res ) => {

    const { request_id } = req.body;

    db.query(
        "UPDATE tbl_item_requests SET status = ?, delivery_date = ?, delivery_time = ? WHERE id = ?",
        [ 'delivery is in process', new Date(), new Date().toTimeString(), request_id ],
        ( err ) => {

            if( err )
            {

                console.log( err );
                res.status(500).send(err);
                res.end();

            }else 
            {
             
                CreateLogs( 
                    'tbl_item_requests', 
                    request_id,
                    "The delivery of this request is in process",
                    'info'
                );
                res.send("Success");
                res.end();

            }

        }
    )

} );

router.post('/delivereditemrequest', ( req, res ) => {

    const { request_id, specifications } = req.body;

    const received_specifications = JSON.parse(specifications);
    let status = 'delivered';
    for ( let i = 0; i < received_specifications.length; i++ )
    {
        if ( received_specifications[i].deliver_quantity < received_specifications[i].required_quantity )
        {
            status = 'partially delivered';
        }
    }

    db.query(
        "UPDATE tbl_item_requests SET status = ? WHERE id = ?",
        [ status, request_id ],
        ( err ) => {

            if( err )
            {

                console.log( err );
                res.status(500).send(err);
                res.end();

            }else 
            {
             
                CreateLogs( 
                    'tbl_item_requests', 
                    request_id,
                    "The items of this request has delivered",
                    'info'
                );

                CreateLogs( 
                    'tbl_item_requests', 
                    request_id,
                    "Request Completed",
                    'info'
                );
                res.send("Success");
                res.end();

            }

        }
    )

} );

router.post('/inventory/get/product/inwards', ( req, res ) => {

    const { product_id } = req.body;

    db.query(
        "SELECT tbl_inventory_product_transactions.*, companies.company_name FROM `tbl_inventory_product_transactions` LEFT OUTER JOIN companies ON tbl_inventory_product_transactions.company_code = companies.company_code WHERE tbl_inventory_product_transactions.product_id = ? AND tbl_inventory_product_transactions.entry = 'inward';",
        [ product_id ],
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

router.post('/inventory/item_request/get_sub_category_items', ( req, res ) => {

    const { id } = req.body;

    db.query(
        "SELECT product_id, quantity FROM `tbl_inventory_products` \
        WHERE tbl_inventory_products.sub_category_id = ?;",
        [ id ],
        ( err, rslt ) => {

            if( err )
            {

                console.log( err );
                res.send(err);
                res.end();

            }else 
            {
                if ( rslt[0] )
                {
                    db.query(
                        "SELECT tbl_inventory_product_transactions.name, tbl_inventory_product_transactions.description, tbl_inventory_product_transactions.product_id, tbl_inventory_product_transactions.company_code, SUM(tbl_inventory_product_transactions.quantity) AS quantity, SUM(tbl_inventory_product_transactions.stored_quantity) AS stored_quantity, companies.company_name FROM `tbl_inventory_product_transactions` \
                        RIGHT OUTER JOIN companies ON companies.company_code = tbl_inventory_product_transactions.company_code WHERE product_id = ? AND tbl_inventory_product_transactions.entry = 'inward' GROUP BY companies.company_code;",
                        [ rslt[0].product_id ],
                        ( err, rslt2 ) => {
                
                            if( err )
                            {
                
                                console.log( err );
                                res.send(err);
                                res.end();
                
                            }else 
                            {
                                
                                res.send( [rslt, rslt2] );
                                res.end();
                                
                            }
                            
                        }
                    );
                }else
                {
                    res.send( [rslt, []] );
                    res.end();
                }
                
            }
            
        }
    );

} );

module.exports = router;