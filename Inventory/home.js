const express = require('express');
const router = express.Router();
const db = require('../db/connection');

router.get('/inventory/get_data/home', ( req, res ) => {

    // "SELECT  \
    // tbl_inventory_products.name, \
    // tbl_inventory_products.entry, \
    // tbl_inventory_products.sub_category_id, \
    // tbl_inventory_sub_categories.name AS sub_category_name, \
    // SUM(tbl_inventory_products.quantity) AS quantity \
    // FROM `tbl_inventory_products` \
    // LEFT OUTER JOIN tbl_inventory_sub_categories ON tbl_inventory_products.sub_category_id = tbl_inventory_sub_categories.id \
    // GROUP BY tbl_inventory_products.sub_category_id, tbl_inventory_products.entry ORDER BY tbl_inventory_products.product_id DESC LIMIT 10;" +
    // "SELECT * FROM `tbl_inventory_venders` ORDER BY vender_id DESC LIMIT 10;",

    db.query(
        "SELECT \
        `tbl_inventory_product_transactions`.`entry`, \
        `tbl_inventory_product_transactions`.`quantity`, \
        `tbl_inventory_product_transactions`.`total_amount`, \
        `tbl_inventory_sub_categories`.`name` AS sub_category_name \
        FROM \
        `tbl_inventory_product_transactions` \
        LEFT OUTER JOIN tbl_inventory_products ON tbl_inventory_product_transactions.product_id = tbl_inventory_products.product_id \
        LEFT OUTER JOIN tbl_inventory_sub_categories ON tbl_inventory_products.sub_category_id = tbl_inventory_sub_categories.id \
        GROUP BY tbl_inventory_products.sub_category_id, tbl_inventory_product_transactions.entry ORDER BY tbl_inventory_products.product_id DESC LIMIT 10;" +
        "SELECT * FROM `tbl_inventory_venders` ORDER BY vender_id DESC LIMIT 10;",
        ( err, rslt ) => {

            if( err )
            {

                console.log(err)
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