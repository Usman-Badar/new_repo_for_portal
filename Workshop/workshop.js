const express = require('express');
const router = express.Router();
const db = require('../db/connection');

router.get('/workshop/list/to_check', function (req, res) {
    res.render('workshop_list_to_check.html', {url: req.query.url, category_id: 29, emp_id: req.query.emp_id});
});

router.post('/workshop/list/locations', function (req, res) {

    const { emp_id } = req.body;

    db.query(
        "SELECT emp_id, access, location_code FROM `employees` WHERE emp_id = ?;",
        [ emp_id ],
        ( err, rslt ) => {

            if( err )
            {

                console.log(err);
                res.status(500).send(err);
                res.end();

            }else 
            {
                let accessKey = false;
                let query = "";
                const accessArr = JSON.parse(rslt[0].access);
                for( let x = 0; x < accessArr.length; x++ )
                {
                    if ( parseInt(accessArr[x]) === 26 || parseInt(accessArr[x]) === 0 )
                    {
                        accessKey = true;
                    }
                }

                if ( accessKey )
                {
                    query = "SELECT * FROM `locations` WHERE status = 'active' ORDER BY location_name";
                }else
                {
                    query = "SELECT * FROM `locations` WHERE status = 'active' AND location_code = " + rslt[0].location_code + " ORDER BY location_name";
                }

                db.query(
                    query,
                    ( err, rslt ) => {
            
                        if( err )
                        {
            
                            console.log(err);
                            res.status(500).send(err);
                            res.end();
            
                        }else 
                        {
                            
                            res.send( rslt );
                            res.end();
            
                        }
            
                    }
                );

            }

        }
    );

});

router.post('/workshop/list/vehicles', function (req, res) {

    const { location_code, category_id, sub_category_id } = req.body;

    db.query(
        "SELECT * FROM `tbl_inventory_products` WHERE category_id = ? AND sub_category_id = ?;",
        [ category_id, sub_category_id ],
        ( err, rslt ) => {

            if( err )
            {

                console.log(err);
                res.status(500).send(err);
                res.end();

            }else 
            {
                db.query(
                    "SELECT * FROM `tbl_inventory_product_transactions` WHERE product_id = ? AND location_code = ?;",
                    [ rslt[0].product_id, location_code ],
                    ( err, rslt ) => {
            
                        if( err )
                        {
            
                            console.log(err);
                            res.status(500).send(err);
                            res.end();
            
                        }else 
                        {
                            res.send( rslt );
                            res.end();
                        }
            
                    }
                );
            }

        }
    );

});

router.post('/workshop/list/sub_categories', function (req, res) {

    const { category_id } = req.body;

    console.log(category_id)

    db.query(
        "SELECT * FROM `tbl_inventory_sub_categories` WHERE category_id = ?;",
        [ category_id ],
        ( err, rslt ) => {

            if( err )
            {

                console.log(err);
                res.status(500).send(err);
                res.end();

            }else 
            {
                res.send( rslt );
                res.end();
            }

        }
    );

});

router.post('/workshop/list/drivers', function (req, res) {

    const { location_code } = req.body;

    db.query(
        "SELECT * FROM `employees` WHERE location_code = ? AND designation_code = ?;",
        [ location_code, 43 ],
        ( err, rslt ) => {

            if( err )
            {

                console.log(err);
                res.status(500).send(err);
                res.end();

            }else 
            {
                res.send( rslt );
                res.end();
            }

        }
    );

});

router.post('/workshop/submit', function (req, res) {

    const { arrayOfData, emp_id, location_code, vehicle_type, vehicle, drivers, meter_reading } = req.body;
    const data = JSON.parse(arrayOfData);
    db.query(
        "INSERT INTO `tbl_workshop_maintenance_reports`(`entered_by`, `entered_date`, `entered_time`, `location_code`, `vehicle_id`, `vehicle_type`, `meter_reading`, `driver_id`) VALUES (?,?,?,?,?,?,?,?);",
        [ emp_id, new Date(), new Date().toTimeString(), location_code, vehicle, vehicle_type, meter_reading, drivers ],
        ( err, rslt ) => {

            if( err )
            {

                console.log(err);
                res.status(500).send(err);
                res.end();

            }else 
            {
                let limit = data.length;
                let count = [];
                function markAttendance()
                {
                    db.query(
                        "INSERT INTO `tbl_workshop_maintenance_report_items`(`report_id`, `title`, `checked`, `comment`) VALUES (?,?,?,?);",
                        [ rslt.insertId, data[count.length].id, data[count.length].checkbox ? 1 : 0, data[count.length].comment],
                        (err) => {

                            if (err) {
                                console.log(err);
                            }else
                            {
                                if ( ( count.length + 1 ) === limit )
                                {
                                    res.send('success');
                                    res.end();
                                }else
                                {
                                    count.push(1);
                                    markAttendance();
                                }
                            }

                        }
                    )
                }
                markAttendance();
            }

        }
    );

});

router.post('/workshop/newcheckitem', function (req, res) {

    const { title } = req.body;

    db.query(
        "INSERT INTO `tbl_workshop_list_to_check`(`title`) VALUES (?);",
        [ title ],
        (err) => {

            if (err) {
                console.log(err);
            }else
            {
                res.send('success');
                res.end();
            }

        }
    )

});

router.post('/workshop/editcheckitem', function (req, res) {

    const { title, id } = req.body;

    db.query(
        "UPDATE `tbl_workshop_list_to_check` SET title = ? WHERE id = ?;",
        [ title, id ],
        (err) => {

            if (err) {
                console.log(err);
            }else
            {
                res.send('success');
                res.end();
            }

        }
    )

});

router.post('/workshop/deletecheckitem', function (req, res) {

    const { id } = req.body;

    db.query(
        "DELETE FROM `tbl_workshop_list_to_check` WHERE id = ?;",
        [ id ],
        (err) => {

            if (err) {
                console.log(err);
            }else
            {
                res.send('success');
                res.end();
            }

        }
    )

});

router.get('/workshop/list', function (req, res) {

    db.query(
        "SELECT * FROM `tbl_workshop_list_to_check`;",
        ( err, rslt ) => {

            if( err )
            {

                console.log(err);
                res.status(500).send(err);
                res.end();

            }else 
            {
                
                res.send( rslt );
                res.end();

            }

        }
    );

});

router.get('/workshop/daily_reports', function (req, res) {

    db.query(
        "SELECT  \
        `tbl_workshop_maintenance_reports`.*, \
        enter_emp.name AS enter_emp_name, \
        locations.location_name, \
        tbl_inventory_product_transactions.name, \
        tbl_inventory_sub_categories.name AS vehicle_type_name \
        FROM `tbl_workshop_maintenance_reports`    \
        LEFT OUTER JOIN employees enter_emp ON tbl_workshop_maintenance_reports.entered_by = enter_emp.emp_id \
        LEFT OUTER JOIN locations ON tbl_workshop_maintenance_reports.location_code = locations.location_code \
        LEFT OUTER JOIN tbl_inventory_product_transactions ON tbl_workshop_maintenance_reports.vehicle_id = tbl_inventory_product_transactions.transaction_id \
        LEFT OUTER JOIN tbl_inventory_sub_categories ON tbl_workshop_maintenance_reports.vehicle_type = tbl_inventory_sub_categories.id \
        ORDER BY `report_id` DESC;",
        ( err, rslt ) => {

            if( err )
            {

                console.log(err);
                res.status(500).send(err);
                res.end();

            }else 
            {
                
                res.send( rslt );
                res.end();

            }

        }
    );

});

router.post('/workshop/get/report', function (req, res) {

    const { report_id } = req.body;

    db.query(
        "SELECT  \
        `tbl_workshop_maintenance_reports`.*, \
        enter_emp.name AS enter_emp_name, \
        driver_emp.name AS driver_emp_name, \
        locations.location_name, \
        tbl_inventory_product_transactions.name, \
        tbl_inventory_sub_categories.name AS vehicle_type_name \
        FROM `tbl_workshop_maintenance_reports`    \
        LEFT OUTER JOIN employees enter_emp ON tbl_workshop_maintenance_reports.entered_by = enter_emp.emp_id \
        LEFT OUTER JOIN employees driver_emp ON tbl_workshop_maintenance_reports.driver_id = driver_emp.emp_id \
        LEFT OUTER JOIN locations ON tbl_workshop_maintenance_reports.location_code = locations.location_code \
        LEFT OUTER JOIN tbl_inventory_product_transactions ON tbl_workshop_maintenance_reports.vehicle_id = tbl_inventory_product_transactions.transaction_id \
        LEFT OUTER JOIN tbl_inventory_sub_categories ON tbl_workshop_maintenance_reports.vehicle_type = tbl_inventory_sub_categories.id \
        WHERE report_id = ?;",
        [ report_id ],
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
                    tbl_workshop_maintenance_report_items.*, \
                    tbl_workshop_list_to_check.title \
                    FROM `tbl_workshop_maintenance_report_items` \
                    LEFT OUTER JOIN tbl_workshop_list_to_check ON tbl_workshop_maintenance_report_items.title = tbl_workshop_list_to_check.id \
                    WHERE tbl_workshop_maintenance_report_items.report_id = ?;",
                    [ rslt[0].report_id ],
                    ( err, result ) => {
            
                        if( err )
                        {
            
                            console.log(err);
                            res.status(500).send(err);
                            res.end();
            
                        }else 
                        {
                            
                            res.send( [ rslt[0], result ] );
                            res.end();
            
                        }
            
                    }
                );

            }

        }
    );

});

module.exports = router;