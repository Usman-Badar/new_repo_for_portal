const express = require('express');
const router = express.Router();
const db = require('../db/connection');
const CreateLogs = require('../Routes/Employee/logs').CreateLog;
// const AssignProduct = require('./products').AssignProduct;

router.get('/inventory/get_item_requests', ( req, res ) => {

    db.query(
        "SELECT \
        tbl_item_requests.id, \
        tbl_item_requests.request_date, \
        tbl_item_requests.request_time, \
        tbl_item_requests.status, \
        acted.name AS acted_name, \
        sender.name AS sender_name \
        FROM \
        tbl_item_requests \
        LEFT OUTER JOIN employees acted ON tbl_item_requests.acted_by = acted.emp_id \
        LEFT OUTER JOIN employees sender ON tbl_item_requests.request_by = sender.emp_id \
        WHERE \
        tbl_item_requests.status = 'approved' OR tbl_item_requests.status = 'proceed to purchase requisition' OR tbl_item_requests.status = 'delivery is in process' OR tbl_item_requests.status = 'delivered' OR tbl_item_requests.status = 'at_store' OR tbl_item_requests.status = 'delivering_to_inventory' ORDER BY tbl_item_requests.id DESC;",
        ( err, rslt ) => {

            if( err )
            {

                res.send(err);
                res.end();

            }else 
            {
                
                let itemRequestDescriptionQuery = "SELECT 1;";
                let params = [];
                for ( let x = 0; x < rslt.length; x++ )
                {
                    itemRequestDescriptionQuery = itemRequestDescriptionQuery.concat("SELECT tbl_item_requests_specifications.*, tbl_inventory_sub_categories.name as sub_category_name FROM `tbl_item_requests_specifications` LEFT OUTER JOIN tbl_inventory_sub_categories ON tbl_item_requests_specifications.item_id = tbl_inventory_sub_categories.id WHERE tbl_item_requests_specifications.request_id = ?;");
                    params.push( rslt[x].id );
                }
                db.query(
                    itemRequestDescriptionQuery,
                    params,
                    ( err, result ) => {
            
                        if( err )
                        {
            
                            console.log(err)
                            res.send(err);
                            res.end();
            
                        }else 
                        {
                            let arr = [rslt];
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

router.post('/inventory/get_item_request/details', ( req, res ) => {

    const { request_id } = req.body;

    db.query(
        "SELECT \
        tbl_item_requests.*, \
        locations.location_name, \
        companies.company_name, \
        acted.name AS acted_name, \
        sender.name AS sender_name \
        FROM \
        tbl_item_requests \
        LEFT OUTER JOIN locations ON tbl_item_requests.location_code = locations.location_code \
        LEFT OUTER JOIN companies ON tbl_item_requests.company_code = companies.company_code \
        LEFT OUTER JOIN employees acted ON tbl_item_requests.acted_by = acted.emp_id \
        LEFT OUTER JOIN employees sender ON tbl_item_requests.request_by = sender.emp_id \
        WHERE \
        tbl_item_requests.id = ?;" +
        "SELECT  \
        tbl_item_requests_specifications.*, \
        tbl_inventory_sub_categories.id as sub_category_id, \
        tbl_inventory_sub_categories.name as sub_category_name  \
        FROM  \
        `tbl_item_requests_specifications`  \
        LEFT OUTER JOIN tbl_inventory_sub_categories on tbl_item_requests_specifications.item_id = tbl_inventory_sub_categories.id \
        WHERE tbl_item_requests_specifications.request_id = ?;" +
        "SELECT * FROM `tbl_logs` WHERE tbl_name = 'tbl_item_requests' AND id = ?",
        [ request_id, request_id, request_id ],
        ( err, rslt ) => {

            if( err )
            {

                console.log( err )
                res.send(err);
                res.end();

            }else 
            {
                
                if ( rslt[0][0].status !== 'approved' && rslt[0][0].status !== 'proceed to purchase requisition' )
                {
                    db.query(
                        "SELECT  \
                        tbl_inventory_request_to_store.*, \
                        sender.name AS sender_name, \
                        receiver.name AS receiver_name \
                        FROM `tbl_inventory_request_to_store`  \
                        LEFT OUTER JOIN employees sender ON tbl_inventory_request_to_store.requested_by = sender.emp_id \
                        LEFT OUTER JOIN employees receiver ON tbl_inventory_request_to_store.accepted_by = receiver.emp_id \
                        WHERE tbl_inventory_request_to_store.request_id = ?",
                        [ request_id ],
                        ( err, result ) => {
                
                            if( err )
                            {
                
                                console.log(err)
                                res.send(err);
                                res.end();
                
                            }else 
                            {
                                
                                db.query(
                                    "SELECT  \
                                    tbl_inventory_request_to_store_assigned_items.*, \
                                    tbl_inventory_product_transactions.name, \
                                    companies.company_name \
                                    FROM `tbl_inventory_request_to_store_assigned_items`  \
                                    LEFT OUTER JOIN tbl_inventory_product_transactions ON tbl_inventory_request_to_store_assigned_items.transaction_id = tbl_inventory_product_transactions.transaction_id \
                                    LEFT OUTER JOIN companies ON tbl_inventory_product_transactions.company_code = companies.company_code \
                                    WHERE tbl_inventory_request_to_store_assigned_items.request_id = ?;",
                                    [ result[0].id ],
                                    ( err, result2 ) => {
                            
                                        if( err )
                                        {
                            
                                            console.log(err)
                                            res.send(err);
                                            res.end();
                            
                                        }else 
                                        {
                                            
                                            let arr = [ result[0] ];
                                            let finalArr = rslt;
                                            arr.push( result2 );

                                            finalArr.push(arr);
                                            res.send( finalArr );
                                            res.end();
                                            
                                        }
                                        
                                    }
                                )
                                
                            }
                            
                        }
                    )    
                }else
                {
                    res.send( rslt );
                    res.end();
                }
                
            }
            
        }
    )

} );

router.post('/inventory/get_item_request/get_sub_category_items', ( req, res ) => {

    const { sub_category_id } = req.body;

    db.query(
        "SELECT product_id, quantity FROM `tbl_inventory_products` \
        WHERE tbl_inventory_products.sub_category_id = ?;",
        [ sub_category_id ],
        ( err, rslt ) => {

            if( err )
            {

                res.send(err);
                res.end();

            }else 
            {
                db.query(
                    "SELECT tbl_inventory_product_transactions.product_id, tbl_inventory_product_transactions.company_code, SUM(tbl_inventory_product_transactions.quantity) AS quantity, SUM(tbl_inventory_product_transactions.stored_quantity) AS stored_quantity, companies.company_name FROM `tbl_inventory_product_transactions` \
                    LEFT OUTER JOIN companies ON companies.company_code = tbl_inventory_product_transactions.company_code WHERE product_id = ? AND entry = 'inward' GROUP BY company_code;",
                    [ rslt[0].product_id ],
                    ( err, rslt2 ) => {
            
                        if( err )
                        {
            
                            res.send(err);
                            res.end();
            
                        }else 
                        {
                            
                            res.send( [rslt, rslt2] );
                            res.end();
                            
                        }
                        
                    }
                );
                
            }
            
        }
    );

} );

router.post('/inventory/item_request/request_to_store', ( req, res ) => {

    const { products, emp_id, request_id } = req.body;

    const assigned_products = JSON.parse(products);
    const code = new Date().getTime() + '_' + new Date().getDate() + (new Date().getMonth() + 1) + new Date().getFullYear();
    
    db.query(
        "INSERT INTO `tbl_inventory_request_to_store`(`request_id`, `entry_code`, `requested_by`, `request_date`, `request_time`) VALUES (?,?,?,?,?);" +
        "SELECT id FROM tbl_inventory_request_to_store WHERE entry_code = ?",
        [ request_id, code, emp_id, new Date(), new Date().toTimeString(), code ],
        ( err, rslt ) => {

            if( err )
            {

                res.send(err);
                res.end();

            }else 
            {
                
                let attr_query = "SELECT 1;";
                let params = [];
                for ( let x = 0; x < assigned_products.length; x++ )
                {
                    attr_query = attr_query.concat("INSERT INTO `tbl_inventory_request_to_store_assigned_items`(`request_id`, `transaction_id`, `product_id`, `assigned_quantity`, `current_stored_quantity`) VALUES (?,?,?,?,?);");
                    params.push(rslt[1][0].id);
                    params.push(assigned_products[x].transaction_id);
                    params.push(assigned_products[x].product_id);
                    params.push(assigned_products[x].assigned_quantity);
                    params.push(assigned_products[x].stored_quantity);
                }
                
                db.query(
                    attr_query,
                    params,
                    ( err ) => {
            
                        if( err )
                        {
            
                            console.log( err );
                            res.send(err);
                            res.end();
            
                        }else 
                        {
                            db.query(
                                "UPDATE tbl_item_requests SET status = ? WHERE id = ?",
                                [ 'at_store', request_id ],
                                ( err ) => {
                        
                                    if( err )
                                    {
                        
                                        console.log( err );
                                        res.send(err);
                                        res.end();
                        
                                    }else 
                                    {

                                        CreateLogs( 
                                            'tbl_item_requests', 
                                            request_id,
                                            "Request to store for the required items.",
                                            'info'
                                        );
                                        setTimeout(() => {
                                            CreateLogs( 
                                                'tbl_item_requests', 
                                                request_id,
                                                "Delivery pending in Store.",
                                                'info'
                                            );
                                        }, 1000);

                                        res.send("success");
                                        res.end();
                                        
                                    }
                                    
                                }
                            )
                            
                        }
                        
                    }
                )
                
            }
            
        }
    )

} );

router.post('/inventory/item_request/deliver_to_employee', ( req, res ) => {

    const { issued_by, assigned_products, request_id, requested_by } = req.body;
    const products = JSON.parse(assigned_products);

    db.query(
        "UPDATE tbl_item_requests SET status = ?, delivery_date = ?, delivery_time = ? WHERE id = ?;",
        [ 'delivery is in process', new Date(), new Date().toTimeString(), request_id ], 
        ( err ) => {

            if( err )
            {

                console.log( err );
                res.send(err);
                res.end();

            }else 
            {

                CreateLogs( 
                    'tbl_item_requests', 
                    request_id,
                    "The delivery of this request is in process",
                    'info'
                );

                let itemRequestDescriptionQuery = "";
                let params = [];
                
                for ( let x = 0; x < products.length; x++ )
                {
                    itemRequestDescriptionQuery = itemRequestDescriptionQuery.concat(
                        "UPDATE `tbl_inventory_products` SET tbl_inventory_products.quantity = tbl_inventory_products.quantity - ? WHERE tbl_inventory_products.product_id = ?;" +
                        "UPDATE `tbl_inventory_product_transactions` SET tbl_inventory_product_transactions.stored_quantity = tbl_inventory_product_transactions.stored_quantity - ? WHERE tbl_inventory_product_transactions.transaction_id = ?;" +
                        "INSERT INTO `tbl_inventory_product_transactions`(`name`,`description`,`product_id`, `entry`, `quantity`, `recorded_by`, `record_date`, `record_time`, `employee`, `request_id`, `status`, `unit_price`, `total_amount`, `delivery_challan`, `company_code`, `location_code`, `sub_location_code`, `preview`, `physical_condition`, `note`, `acquisition_date`) \
                        SELECT name, description, product_id, ?, ?, ?, ?, ?, ?, ?, ?, unit_price, ? * unit_price, delivery_challan, company_code, location_code, sub_location_code, preview, physical_condition, note, acquisition_date FROM `tbl_inventory_product_transactions` WHERE transaction_id = ?;"
                    );
                    params.push( products[x].assigned_quantity );
                    params.push( products[x].product_id );
                    
                    params.push( products[x].assigned_quantity );
                    params.push( products[x].transaction_id );

                    params.push( 'outward' );
                    params.push( products[x].assigned_quantity );
                    params.push( issued_by );
                    params.push( new Date() );
                    params.push( new Date().toTimeString() );
                    params.push( requested_by );
                    params.push( request_id );
                    params.push( "issued" );
                    params.push( products[x].assigned_quantity );
                    params.push( products[x].transaction_id );
                }

                let query = db.query(
                    itemRequestDescriptionQuery,
                    params,
                    ( err ) => {
            
                        console.log( query.sql );
                        if( err )
                        {
            
                            console.log(err)
                            res.send(err);
                            res.end();
            
                        }else 
                        {
                            res.send('success');
                            res.end();
                        }
                        
                    }
                )
                
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

module.exports = router;