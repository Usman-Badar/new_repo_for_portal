const express = require('express');
const router = express.Router();
const db = require('../../db/connection');

const CreateLogs = require('../Employee/logs').CreateLog;
const SendWhatsappNotification = require('../Whatsapp/whatsapp').SendWhatsappNotification;

router.post('/getmatchedstoreitems', ( req, res ) => {

    const { key } = req.body;

    db.query(
        "SELECT * FROM `tbl_inventory_sub_categories` WHERE name LIKE '%" + key + "%' AND status = 'active';",
        ( err, rslt ) => {

            if( err )
            {

                console.log( err );
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

router.get('/store/items', ( req, res ) => {

    db.query(
        "SELECT \
        tblitems.id,  \
        tblitems.item_name,  \
        tblitems.availble_quantity,  \
        tblitems.lock_edit,  \
        tblitems.asset_id,  \
        tblitems.sub_asset_id, \
        tbl_assets.asset_name, \
        tbl_sub_assets.sub_asset_name  \
        FROM `tblitems`  \
        LEFT OUTER JOIN tbl_assets ON tblitems.asset_id = tbl_assets.asset_id \
        LEFT OUTER JOIN tbl_sub_assets ON tblitems.sub_asset_id = tbl_sub_assets.sub_asset_id \
        WHERE tblitems.status = 'in_stock';",
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

router.post('/store/new', ( req, res ) => {

    const { name, quantity, lock_edit, date_time, insert_by, sub_asset_id, asset_id } = req.body;
    const d = new Date( date_time );

    db.query(
        "INSERT INTO `tblitems`(`asset_id`,`sub_asset_id`, `item_name`, `availble_quantity`, `lock_edit`, `ins_dt`, `ins_by`) VALUES (?,?,?,?,?,?,?);",
        [ asset_id, sub_asset_id, name, quantity, lock_edit, d, insert_by ],
        ( err ) => {

            if( err )
            {

                res.status(500).send(err);
                res.end();

            }else 
            {

                res.send( 'success' );
                res.end();

            }

        }
    )

} );

router.post('/store/edit', ( req, res ) => {

    const { id, name, quantity, lock_edit, date_time, edit_by, edit_emp_name, sub_asset_id, asset_id } = req.body;
    const d = new Date( date_time );

    db.query(
        "UPDATE `tblitems` SET `item_name` = ?, `availble_quantity` = ?, `lock_edit` = ?, `edit_dt` = ?, `edit_by` = ?, `asset_id` = ?, `sub_asset_id` = ? WHERE id = ?;",
        [ name, quantity, lock_edit, d, edit_by, asset_id, sub_asset_id, id ],
        ( err ) => {

            if( err )
            {

                res.status(500).send(err);
                res.end();

            }else 
            {
                
                CreateLogs( 
                    'tblitems', 
                    id,
                    edit_emp_name + " (" + edit_by + ") update the store item with id " + id + ' to ({ item_name: ' + name +', availble_quantity: ' + quantity + ', lock_edit: ' + lock_edit + ' }).',
                    'info'
                );
                res.send( 'success' );
                res.end();

            }

        }
    )

} );

router.post('/store/remove', ( req, res ) => {

    const { id, date_time, remove_by, remove_emp_name } = req.body;
    const d = new Date( date_time );

    db.query(
        "UPDATE `tblitems` SET `status` = ?, `edit_dt` = ?, `edit_by` = ? WHERE id = ?;",
        [ 'removed', d, remove_by, id ],
        ( err ) => {

            if( err )
            {

                res.status(500).send(err);
                res.end();

            }else 
            {
                
                CreateLogs( 
                    'tblitems', 
                    id,
                    remove_emp_name + " (" + remove_by + ") remove the store item with id " + id + '.',
                    'info',
                    'delete'
                )
                res.send( 'success' );
                res.end();

            }

        }
    )

} );

router.get('/getallitemsnames', ( req, res ) => {

    db.query(
        "SELECT * FROM `tbl_items` ORDER BY id DESC",
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

router.post('/enternewitemname', ( req, res ) => {

    const { item_name } = req.body;

    db.query(
        "INSERT INTO `tbl_items`(`item_name`) VALUES (?);",
        [ item_name ],
        ( err ) => {

            if( err )
            {

                console.log( err );
                res.status(500).send(err);
                res.end();

            }else 
            {
             
                res.send("Success");
                res.end();

            }

        }
    )

} );

router.post('/deleteitemname', ( req, res ) => {

    const { id } = req.body;

    db.query(
        "DELETE FROM `tbl_items` WHERE id = ?",
        [ id ],
        ( err ) => {

            if( err )
            {

                res.status(500).send(err);
                res.end();

            }else 
            {
                
                res.send( 'SUCCESS' );
                res.end();

            }

        }
    )

} );

router.post('/edititemname', ( req, res ) => {

    const { item_id, item_name } = req.body;

    db.query(
        "UPDATE `tbl_items` SET item_name = ? WHERE id = ?",
        [ item_name, item_id ],
        ( err ) => {

            if( err )
            {

                res.status(500).send(err);
                res.end();

            }else 
            {
                
                res.send( 'SUCCESS' );
                res.end();

            }

        }
    )

} );

router.get('/store/get_inventory_requests', ( req, res ) => {

    db.query(
        "SELECT  \
        tbl_inventory_request_to_store.*, \
        sender.name AS sender_name , \
        sender_designation.designation_name AS sender_designation \
        FROM `tbl_inventory_request_to_store` \
        LEFT OUTER JOIN employees sender ON tbl_inventory_request_to_store.requested_by = sender.emp_id \
        LEFT OUTER JOIN designations sender_designation ON sender.designation_code = sender_designation.designation_code \
        ORDER BY tbl_inventory_request_to_store.id DESC;",
        ( err, rslt ) => {

            if( err )
            {

                res.status(500).send(err);
                res.end();

            }else 
            {

                let arr = [rslt];
                if ( rslt.length > 0 )
                {
                    let query = "SELECT tbl_inventory_request_to_store_assigned_items.request_id, tbl_inventory_request_to_store_assigned_items.assigned_quantity, tbl_inventory_product_transactions.name FROM `tbl_inventory_request_to_store_assigned_items` \
                    LEFT OUTER JOIN tbl_inventory_product_transactions ON tbl_inventory_request_to_store_assigned_items.transaction_id = tbl_inventory_product_transactions.transaction_id \
                    WHERE ";
                    let params = [];
                    for ( let x = 0; x < rslt.length; x++ )
                    {
                        query = query.concat(" tbl_inventory_request_to_store_assigned_items.request_id  = ?");
                        params.push( rslt[x].id );

                        if ( (x+1) === rslt.length )
                        {
                            // nothing
                        }else
                        {
                            query = query.concat(" OR ");
                        }
                    }
                    let qqqqq =db.query(
                        query,
                        params,
                        ( err, rslt2 ) => {
                
                            if( err )
                            {
                
                                console.log( err );
                                res.status(500).send(err);
                                res.end();
                
                            }else 
                            {
                                
                                arr.push( rslt2 )
                                res.send( arr );
                                res.end();
                
                            }
                
                        }
                    )
                }else
                {
                    res.send( arr );
                    res.end();
                }

            }

        }
    )

} );

router.post('/store/accept_inventory_request', ( req, res ) => {

    const { request_id, accepted_by } = req.body;

    db.query(
        "UPDATE tbl_inventory_request_to_store SET accepted_by = ?, accept_date = ?, accept_time = ? WHERE id = ?;" +
        "SELECT requested_by FROM tbl_inventory_request_to_store WHERE id = ?;",
        [ accepted_by, new Date(), new Date().toTimeString(), request_id, request_id ],
        ( err, rslt ) => {

            if( err )
            {

                console.log( err )
                res.status(500).send(err);
                res.end();

            }else 
            {
                db.query(
                    "SELECT name, cell FROM employees WHERE emp_id = ?;" + 
                    "SELECT name, cell FROM employees WHERE emp_id = ?;",
                    [ accepted_by, rslt[1][0].requested_by ],
                    ( err, result ) => {
            
                        if( err )
                        {
            
                            console.log( err );
                            res.send( err );
                            res.end();
            
                        }else
                        {
                            SendWhatsappNotification( null, null, "Hi " + result[0][0].name, "You have accepted the request from the inventory department.", result[0][0].cell );
                            SendWhatsappNotification( null, null, "Hi " + result[1][0].name, result[0][0].name + " has accepted your item request, please wait... while our store department is delivering your required items.", result[1][0].cell );
                        }
            
                    }
                );
                res.send('success');
                res.end();
            }

        }
    )

} );

router.post('/store/inventory_request/details', ( req, res ) => {

    const { request_id } = req.body;

    db.query(
        "SELECT  \
        tbl_inventory_request_to_store.*, \
        sender.name AS sender_name, \
        receiver.name AS receiver_name \
        FROM `tbl_inventory_request_to_store`  \
        LEFT OUTER JOIN employees sender ON tbl_inventory_request_to_store.requested_by = sender.emp_id \
        LEFT OUTER JOIN employees receiver ON tbl_inventory_request_to_store.accepted_by = receiver.emp_id \
        WHERE tbl_inventory_request_to_store.id = ?;" +
        "SELECT  \
        tbl_inventory_request_to_store_assigned_items.*, \
        tbl_inventory_product_transactions.stored_quantity, \
        tbl_inventory_product_transactions.name, \
        tbl_inventory_product_transactions.description, \
        companies.company_name, \
        locations.location_name, \
        tbl_inventory_sub_locations.sub_location_name \
        FROM `tbl_inventory_request_to_store_assigned_items`  \
        LEFT OUTER JOIN tbl_inventory_products ON tbl_inventory_request_to_store_assigned_items.product_id = tbl_inventory_products.product_id \
        LEFT OUTER JOIN tbl_inventory_product_transactions ON tbl_inventory_request_to_store_assigned_items.transaction_id = tbl_inventory_product_transactions.transaction_id \
        LEFT OUTER JOIN companies ON tbl_inventory_product_transactions.company_code = companies.company_code \
        LEFT OUTER JOIN locations ON tbl_inventory_product_transactions.location_code = locations.location_code \
        LEFT OUTER JOIN tbl_inventory_sub_locations ON tbl_inventory_product_transactions.sub_location_code = tbl_inventory_sub_locations.sub_location_code \
        WHERE tbl_inventory_request_to_store_assigned_items.request_id = ?;",
        [ request_id, request_id ],
        ( err, rslt ) => {

            if( err )
            {

                console.log( err )
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

router.post('/store/issue_items_to_inventory', ( req, res ) => {

    const { id, request_id } = req.body;

    db.query(
        "UPDATE tbl_inventory_request_to_store SET issued = 1 WHERE id = ?;" +
        "UPDATE tbl_item_requests SET status = ? WHERE id = ?;" +
        "SELECT requested_by, accepted_by FROM tbl_inventory_request_to_store WHERE id = ?;",
        [ id, 'delivering_to_inventory', request_id, request_id ],
        ( err, rslt ) => {

            if( err )
            {

                console.log( err )
                res.status(500).send(err);
                res.end();

            }else 
            {
                res.send( rslt );
                res.end();
             
                CreateLogs( 
                    'tbl_item_requests', 
                    request_id,
                    "Delivering items to inventory",
                    'info'
                );
                db.query(
                    "SELECT name, cell FROM employees WHERE emp_id = ?;" + 
                    "SELECT name, cell FROM employees WHERE emp_id = ?;",
                    [ rslt[2][0].accepted_by, rslt[2][0].requested_by ],
                    ( err, result ) => {
            
                        if( err )
                        {
            
                            console.log( err );
                            res.send( err );
                            res.end();
            
                        }else
                        {
                            SendWhatsappNotification( null, null, "Hi " + result[0][0].name, "Kindly deliver the required items to the inventory department.", result[0][0].cell );
                            SendWhatsappNotification( null, null, "Hi " + result[1][0].name, result[0][0].name + " is delivering you the required items, kindly receive.", result[1][0].cell );
                        }
            
                    }
                );

            }

        }
    )

} );

module.exports = router;