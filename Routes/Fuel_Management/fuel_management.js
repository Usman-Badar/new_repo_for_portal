const express = require('express');
const router = express.Router();
const db = require('../../db/connection');
const { SendWhatsappNotification } = require('../Whatsapp/whatsapp');
// const supplier_verifier = 10106;
// const supplier_approval = 10119;

router.post('/fuel-managent/equipment-numbers', ( req, res ) => {
    const { type_id } = req.body;
    db.query(
        "SELECT * FROM `tbl_fuel_equipment_company_setup` WHERE equipment_type = ? ORDER BY id DESC;",
        [type_id],
        ( err, rslt ) => {
            if( err ) {
                res.status(500).send(err);
                res.end();
            }else {
                res.send( rslt );
                res.end();
            }
        }
    );
} );

router.post('/fuel-managent/fuel-issue-for-equipemnt/new', ( req, res ) => {
    const { type, number, meter, date, fuel, emp_id } = req.body;
    const dt = date === '' || date === null || date === 'null' || date === undefined ? new Date() : date;

    if (type === '' || isNaN(parseInt(type))) {
        res.status(500).send(err);
        res.end();
        return false;
    }else if (number === '' || isNaN(parseInt(number))) {
        res.status(500).send(err);
        res.end();
        return false;
    }else if (fuel === '' || isNaN(parseInt(fuel)) || parseInt(fuel) <= 0) {
        res.status(500).send(err);
        res.end();
        return false;
    }else if (meter === '' || isNaN(parseInt(meter))) {
        res.status(500).send(err);
        res.end();
        return false;
    }
    // else if (date === '') {
    //     res.status(500).send(err);
    //     res.end();
    //     return false;
    // }
    else if (emp_id == null || emp_id === '' || isNaN(parseInt(emp_id))) {
        res.status(500).send(err);
        res.end();
        return false;
    }

    db.query(
        "INSERT INTO `tbl_fuel_issue_for_equipments`(`fuel_issued`, `issued_date`, `equipment_type`, `equipment_number`, `hrs_meter_reading`, `submitted_by`) VALUES (?,?,?,?,?,?);",
        [fuel, dt, type, number, meter, emp_id],
        ( err ) => {
            if( err ) {
                console.log(err)
                res.status(500).send(err);
                res.end();
            }else {
                res.send('success');
                res.end();
            }
        }
    );
} );

router.post('/fuel-managent/fuel-issue-for-trip/new', ( req, res ) => {
    // const { type, number, from, to, date, fuel, emp_id } = req.body;
    const { from, to, date, fuel, emp_id } = req.body;
    const dt = date === '' || date === null || date === 'null' || date === undefined ? new Date() : date;

    // if (type === '' || isNaN(parseInt(type))) {
    //     res.send('err');
    //     res.end();
    //     return false;
    // }else if (number === '' || isNaN(parseInt(number))) {
    //     res.send('err');
    //     res.end();
    //     return false;
    // }else 
    if (fuel === '' || isNaN(parseInt(fuel)) || parseInt(fuel) <= 0) {
        res.send('err');
        res.end();
        return false;
    }else if (from === '') {
        res.send('err');
        res.end();
        return false;
    }else if (to === '') {
        res.send('err');
        res.end();
        return false;
    }
    // else if (date === '') {
    //     res.send('err');
    //     res.end();
    //     return false;
    // }
    else if (emp_id == null || emp_id === '' || isNaN(parseInt(emp_id))) {
        res.send('err');
        res.end();
        return false;
    }

    db.query(
        "INSERT INTO `tbl_fuel_issue_for_trailers`(`fuel_to_issue`, `trip_date`, `equipment_type`, `equipment_number`, `trip_from`, `trip_to`, `created_by`, `stock_at_station`) VALUES (?,?,?,?,?,?,?,?);",
        [fuel, dt, type, number, from, to, emp_id, TOTAL],
        ( err, rslt ) => {
            if( err ) {
                console.log(err)
                res.status(500).send(err);
                res.end();
            }else {
                res.send('success');
                res.end();
            }
        }
    );

} );

router.get('/fuel-managent/equipment-types', ( req, res ) => {
    db.query(
        "SELECT * FROM `tbl_fuel_equipment_setup` ORDER BY id DESC;",
        ( err, rslt ) => {
            if( err ) {
                res.status(500).send(err);
                res.end();
            }else {
                res.send( rslt );
                res.end();
            }
        }
    );
} );

router.get('/fuel-managent/equipments', ( req, res ) => {
    db.query(
        "SELECT tbl_fuel_equipment_company_setup.*, tbl_fuel_equipment_setup.equipment_type AS equipment_type_name FROM `tbl_fuel_equipment_company_setup` LEFT OUTER JOIN tbl_fuel_equipment_setup ON tbl_fuel_equipment_company_setup.equipment_type = tbl_fuel_equipment_setup.id ORDER BY tbl_fuel_equipment_company_setup.id DESC;",
        ( err, rslt ) => {
            if( err ) {
                res.status(500).send(err);
                res.end();
            }else {
                res.send( rslt );
                res.end();
            }
        }
    );
} );

router.post('/fuel-managent/equipments/details', ( req, res ) => {
    const { id } = req.body;
    db.query(
        "SELECT IFNULL( (SELECT SUM(quantity_in_ltr) FROM `tbl_fuel_issued_to_equipments` WHERE in_out = 'IN') ,0) AS q;" +
        "SELECT IFNULL( (SELECT SUM(quantity_in_ltr) FROM `tbl_fuel_issued_to_equipments` WHERE in_out = 'OUT') ,0) AS q;" +
        "SELECT * FROM `tbl_fuel_issued_to_equipments` WHERE equipment_id = ?;",
        [id],
        ( err, rslt ) => {
            if( err ) {
                res.status(500).send(err);
                res.end();
            }else {
                const IN = rslt[0][0].q;
                const OUT = rslt[1][0].q;
                const TOTAL = IN - OUT;
                res.send([{total: TOTAL}, rslt[2]]);
                res.end();
            }
        }
    );
} );

router.post('/fuel-managent/equipment-type-entry', ( req, res ) => {
    const { id, type, user_id } = req.body;

    if (type.trim() === '') {
        res.status(500).send(err);
        res.end();
        return false;
    }

    db.query(
        "SELECT * FROM `tbl_fuel_equipment_setup` WHERE id = ?;",
        [id],
        ( err, rslt ) => {
            if( err ) {
                res.status(500).send(err);
                res.end();
            }else {
                if (rslt.length > 0) {
                    res.status(500).send(err);
                    res.end();
                    return false;
                }
                db.query(
                    "INSERT INTO `tbl_fuel_equipment_setup`(`equipment_type`, `created_by`) VALUES (?,?);",
                    [type, user_id],
                    ( err, rslt ) => {
                        if( err ) {
                            res.status(500).send(err);
                            res.end();
                        }else {
                            res.send( rslt );
                            res.end();
                        }
                    }
                );
            }
        }
    );
} );

router.post('/fuel-managent/company-equipment-setup-entry', ( req, res ) => {
    const { company_code, location_code, type_id, equipment_number, emp_id } = req.body;

    if (company_code === '' || isNaN(parseInt(company_code))) {
        res.status(500).send(err);
        res.end();
        return false;
    }else if (location_code === '' || isNaN(parseInt(location_code))) {
        res.status(500).send(err);
        res.end();
        return false;
    }else if (type_id === '' || isNaN(parseInt(type_id))) {
        res.status(500).send(err);
        res.end();
        return false;
    }else if (equipment_number === '') {
        res.status(500).send(err);
        res.end();
        return false;
    }else if (emp_id == null || emp_id === '' || isNaN(parseInt(emp_id))) {
        res.status(500).send(err);
        res.end();
        return false;
    }

    db.query(
        "INSERT INTO `tbl_fuel_equipment_company_setup`(`company_code`, `location_code`, `equipment_type`, `equipment_number`, `created_by`) VALUES (?,?,?,?,?);",
        [company_code, location_code, type_id, equipment_number, emp_id],
        ( err ) => {
            if( err ) {
                res.status(500).send(err);
                res.end();
            }else {
                res.send('success');
                res.end();
            }
        }
    );
} );

router.post('/fuel-managent/fuel-receival-for-workshop', ( req, res ) => {
    const { company_code, location_code, supplier, date, fuel, emp_id } = req.body;

    if (company_code === '' || isNaN(parseInt(company_code))) {
        res.status(500).send(err);
        res.end();
        return false;
    }else if (location_code === '' || isNaN(parseInt(location_code))) {
        res.status(500).send(err);
        res.end();
        return false;
    }else if (fuel === '' || isNaN(parseInt(fuel)) || parseInt(fuel) <= 0) {
        res.status(500).send(err);
        res.end();
        return false;
    }else if (supplier.trim() === '') {
        res.status(500).send(err);
        res.end();
        return false;
    }else if (date === '') {
        res.status(500).send(err);
        res.end();
        return false;
    }else if (emp_id == null || emp_id === '' || isNaN(parseInt(emp_id))) {
        res.status(500).send(err);
        res.end();
        return false;
    }

    db.query(
        "INSERT INTO `tbl_fuel_receival_for_workshop`(`company_code`, `location_code`, `supplier`, `fuel_received`, `receival_date`, `submitted_by`) VALUES (?,?,?,?,?,?);",
        [company_code, location_code, supplier, fuel, date, emp_id],
        ( err ) => {
            if( err ) {
                console.log(err)
                res.status(500).send(err);
                res.end();
            }else {
                db.query(
                    "SELECT name, cell FROM employees WHERE emp_id = ?;" + 
                    "SELECT name, cell FROM employees WHERE emp_id = ?;",
                    [ emp_id, emp_id ],
                    ( err, result ) => {
                        SendWhatsappNotification( null, null, "Hi " + result[0][0].name, "Your fuel receival request has been sent for verification, please wait for the verification process.", result[0][0].cell );
                        // SendWhatsappNotification( null, null, "Hi " + result[1][0].name, result[0][0].name + " has sent you a fuel receival request on the portal, please check.", result[1][0].cell );
                        res.send('success');
                        res.end();
                    }
                );
            }
        }
    );
} );

router.get('/fuel-managent/fuel-receival-for-workshop/transactions', ( req, res ) => {
    db.query(
        "SELECT IFNULL( (SELECT SUM(quantity_in_ltr) FROM `tbl_fuel_stock_at_workshop` WHERE in_out = 'IN') ,0) AS q;" +
        "SELECT IFNULL( (SELECT SUM(quantity_in_ltr) FROM `tbl_fuel_stock_at_workshop` WHERE in_out = 'OUT') ,0) AS q;" +
        "SELECT * FROM `tbl_fuel_stock_at_workshop` ORDER BY inserted_at DESC;",
        ( err, rslt ) => {
            if( err ) {
                console.log(err)
                res.status(500).send(err);
                res.end();
            }else {
                const IN = rslt[0][0].q;
                const OUT = rslt[1][0].q;
                const TOTAL = IN - OUT;
                res.send([{total: TOTAL}, rslt[2]]);
                res.end();
            }
        }
    );
} );

router.post('/fuel-managent/fuel-receival-for-workshop/requests', ( req, res ) => {
    const { emp_id, access } = req.body;

    db.query(
        "SELECT tbl_fuel_receival_for_workshop.*, \
        locations.location_name, \
        companies.company_name, \
        submit.name AS submit_person, \
        verify.name AS verifier_person  \
        FROM tbl_fuel_receival_for_workshop  \
        LEFT OUTER JOIN locations ON tbl_fuel_receival_for_workshop.location_code = locations.location_code \
        LEFT OUTER JOIN companies ON tbl_fuel_receival_for_workshop.company_code = companies.company_code \
        LEFT OUTER JOIN employees submit ON tbl_fuel_receival_for_workshop.submitted_by = submit.emp_id \
        LEFT OUTER JOIN employees verify ON tbl_fuel_receival_for_workshop.verified_by = verify.emp_id \
        " + (access === 1 ? "" : "WHERE tbl_fuel_receival_for_workshop.submitted_by = ? OR tbl_fuel_receival_for_workshop.verified_by = ?") + " ORDER BY id DESC;",
        [emp_id, emp_id],
        ( err, rslt ) => {
            if( err ) {
                console.log(err)
                res.status(500).send(err);
                res.end();
            }else {
                db.query(
                    "SELECT IFNULL( (SELECT SUM(quantity_in_ltr) FROM `tbl_fuel_stock_at_workshop` WHERE in_out = 'IN') ,0) AS q;" +
                    "SELECT IFNULL( (SELECT SUM(quantity_in_ltr) FROM `tbl_fuel_stock_at_workshop` WHERE in_out = 'OUT') ,0) AS q;",
                    ( err, result ) => {
                        if( err ) {
                            console.log(err)
                            res.status(500).send(err);
                            res.end();
                        }else {
                            const IN = result[0][0].q;
                            const OUT = result[1][0].q;
                            const TOTAL = IN - OUT;
                            const arr = [];
                            for (let x = 0; x < rslt.length; x++) {
                                rslt[x].total_stock = TOTAL;
                                arr.push(rslt[x]);
                            }
                            res.send( arr );
                            res.end();
                        }
                    }
                );
            }
        }
    );
} );

router.post('/fuel-managent/fuel-issue-for-equipemnt/requests', ( req, res ) => {
    const { emp_id, access } = req.body;

    db.query(
        "SELECT tbl_fuel_issue_for_equipments.*, \
        locations.location_name, \
        companies.company_name, \
        submit.name AS submit_person, \
        tbl_fuel_equipment_setup.equipment_type AS equipment_type_name, \
        tbl_fuel_equipment_company_setup.equipment_number AS equipment_no, \
        verify.name AS verifier_person  \
        FROM tbl_fuel_issue_for_equipments  \
        LEFT OUTER JOIN locations ON tbl_fuel_issue_for_equipments.location_code = locations.location_code \
        LEFT OUTER JOIN companies ON tbl_fuel_issue_for_equipments.company_code = companies.company_code \
        LEFT OUTER JOIN employees submit ON tbl_fuel_issue_for_equipments.submitted_by = submit.emp_id \
        LEFT OUTER JOIN employees verify ON tbl_fuel_issue_for_equipments.verified_by = verify.emp_id \
        LEFT OUTER JOIN tbl_fuel_equipment_setup ON tbl_fuel_issue_for_equipments.equipment_type = tbl_fuel_equipment_setup.id \
        LEFT OUTER JOIN tbl_fuel_equipment_company_setup ON tbl_fuel_issue_for_equipments.equipment_number = tbl_fuel_equipment_company_setup.id \
        " + (access === 1 ? "" : "WHERE tbl_fuel_issue_for_equipments.submitted_by = ? OR tbl_fuel_issue_for_equipments.verified_by = ?") + " ORDER BY id DESC;",
        [emp_id, emp_id],
        ( err, rslt ) => {
            if( err ) {
                console.log(err)
                res.status(500).send(err);
                res.end();
            }else {
                db.query(
                    "SELECT IFNULL( (SELECT SUM(quantity_in_ltr) FROM `tbl_fuel_stock_at_fueling_station` WHERE in_out = 'IN') ,0) AS q;" +
                    "SELECT IFNULL( (SELECT SUM(quantity_in_ltr) FROM `tbl_fuel_stock_at_fueling_station` WHERE in_out = 'OUT') ,0) AS q;",
                    ( err, result ) => {
                        if( err ) {
                            console.log(err)
                            res.status(500).send(err);
                            res.end();
                        }else {
                            const IN = result[0][0].q;
                            const OUT = result[1][0].q;
                            const TOTAL = IN - OUT;
                            const arr = [];
                            for (let x = 0; x < rslt.length; x++) {
                                rslt[x].total_stock = TOTAL;
                                arr.push(rslt[x]);
                            }
                            res.send( arr );
                            res.end();
                        }
                    }
                );
            }
        }
    );
} );

router.post('/fuel-managent/fuel-issue-for-trip/requests', ( req, res ) => {
    const { emp_id } = req.body;

    db.query(
        "SELECT tbl_fuel_issue_for_trailers.*, \
        locations.location_name, \
        companies.company_name, \
        submit.name AS submit_person, \
        tbl_fuel_equipment_setup.equipment_type AS equipment_type_name, \
        tbl_fuel_equipment_company_setup.equipment_number AS equipment_no \
        FROM tbl_fuel_issue_for_trailers  \
        LEFT OUTER JOIN locations ON tbl_fuel_issue_for_trailers.location_code = locations.location_code \
        LEFT OUTER JOIN companies ON tbl_fuel_issue_for_trailers.company_code = companies.company_code \
        LEFT OUTER JOIN employees submit ON tbl_fuel_issue_for_trailers.created_by = submit.emp_id \
        LEFT OUTER JOIN tbl_fuel_equipment_setup ON tbl_fuel_issue_for_trailers.equipment_type = tbl_fuel_equipment_setup.id \
        LEFT OUTER JOIN tbl_fuel_equipment_company_setup ON tbl_fuel_issue_for_trailers.equipment_number = tbl_fuel_equipment_company_setup.id \
        WHERE tbl_fuel_issue_for_trailers.created_by = ? ORDER BY id DESC;",
        [emp_id],
        ( err, rslt ) => {
            if( err ) {
                console.log(err)
                res.status(500).send(err);
                res.end();
            }else {
                db.query(
                    "SELECT IFNULL( (SELECT SUM(quantity_in_ltr) FROM `tbl_fuel_stock_at_fueling_station` WHERE in_out = 'IN') ,0) AS q;" +
                    "SELECT IFNULL( (SELECT SUM(quantity_in_ltr) FROM `tbl_fuel_stock_at_fueling_station` WHERE in_out = 'OUT') ,0) AS q;",
                    ( err, result ) => {
                        if( err ) {
                            console.log(err)
                            res.status(500).send(err);
                            res.end();
                        }else {
                            const IN = result[0][0].q;
                            const OUT = result[1][0].q;
                            const TOTAL = IN - OUT;
                            const arr = [];
                            for (let x = 0; x < rslt.length; x++) {
                                rslt[x].total_stock = TOTAL;
                                arr.push(rslt[x]);
                            }
                            res.send( arr );
                            res.end();
                        }
                    }
                );
            }
        }
    );
} );

router.post('/fuel-managent/fuel-receival-for-workshop/request/details', ( req, res ) => {
    const { id } = req.body;

    db.query(
        "SELECT tbl_fuel_receival_for_workshop.*, \
        locations.location_name, \
        companies.company_name, \
        submit.name AS submit_person, \
        verify.name AS verifier_person  \
        FROM tbl_fuel_receival_for_workshop  \
        LEFT OUTER JOIN locations ON tbl_fuel_receival_for_workshop.location_code = locations.location_code \
        LEFT OUTER JOIN companies ON tbl_fuel_receival_for_workshop.company_code = companies.company_code \
        LEFT OUTER JOIN employees submit ON tbl_fuel_receival_for_workshop.submitted_by = submit.emp_id \
        LEFT OUTER JOIN employees verify ON tbl_fuel_receival_for_workshop.verified_by = verify.emp_id \
        WHERE tbl_fuel_receival_for_workshop.id = ? ORDER BY id DESC;",
        [id],
        ( err, rslt ) => {
            if( err ) {
                console.log(err)
                res.status(500).send(err);
                res.end();
            }else {
                res.send( rslt );
                res.end();
            }
        }
    );
} );

router.post('/fuel-managent/fuel-receival-for-workshop/reject', ( req, res ) => {
    const { id, emp_id, verifier } = req.body;

    db.query(
        "UPDATE `tbl_fuel_receival_for_workshop` SET verified_by = ?, verified_at = ?, status = ? WHERE id = ?;",
        [verifier, new Date(), 'Rejected', id],
        ( err ) => {
            if( err ) {
                console.log(err)
                res.status(500).send(err);
                res.end();
            }else {
                db.query(
                    "SELECT name, cell FROM employees WHERE emp_id = ?;" + 
                    "SELECT name, cell FROM employees WHERE emp_id = ?;",
                    [ emp_id, verifier ],
                    ( err, result ) => {
                        SendWhatsappNotification( null, null, "Hi " + result[0][0].name, "Your fuel receival request has been rejected by " + result[1][0].name + ".", result[0][0].cell );
                        SendWhatsappNotification( null, null, "Hi " + result[1][0].name, "You have rejected a fuel receival request on the portal.", result[1][0].cell );
                        res.send('success');
                        res.end();
                    }
                );
            }
        }
    );
} );

router.post('/fuel-managent/fuel-receival-for-workshop/approve', ( req, res ) => {
    const { id, fuel_received, emp_id, verifier, received_at } = req.body;

    db.query(
        "SELECT IFNULL( (SELECT SUM(quantity_in_ltr) FROM `tbl_fuel_stock_at_workshop` WHERE in_out = 'IN') ,0) AS q;" +
        "SELECT IFNULL( (SELECT SUM(quantity_in_ltr) FROM `tbl_fuel_stock_at_workshop` WHERE in_out = 'OUT') ,0) AS q;",
        ( err, rslt ) => {
            if( err ) {
                console.log(err)
                res.status(500).send(err);
                res.end();
            }else {
                const IN = rslt[0][0].q;
                const OUT = rslt[1][0].q;
                const TOTAL = IN - OUT;
                db.query(
                    "UPDATE `tbl_fuel_receival_for_workshop` SET verified_by = ?, verified_at = ?, status = ?, stock_at_workshop = ? WHERE id = ?;",
                    [verifier, new Date(), 'Verified', TOTAL, id],
                    ( err ) => {
                        if( err ) {
                            console.log(err)
                            res.status(500).send(err);
                            res.end();
                        }else {
                            db.query(
                                'INSERT INTO `tbl_fuel_stock_at_workshop`(`request_id`, `quantity_in_ltr`, `fuel_received_at`) VALUES (?,?,?);',
                                [ id, fuel_received, received_at ],
                                ( err ) => {
                                    if( err ) {
                                        console.log(err)
                                        res.status(500).send(err);
                                        res.end();
                                    }else {
                                        db.query(
                                            "SELECT name, cell FROM employees WHERE emp_id = ?;" + 
                                            "SELECT name, cell FROM employees WHERE emp_id = ?;",
                                            [ emp_id, verifier ],
                                            ( err, result ) => {
                                                SendWhatsappNotification( null, null, "Hi " + result[0][0].name, "Your fuel receival request has been verified by " + result[1][0].name + ".", result[0][0].cell );
                                                SendWhatsappNotification( null, null, "Hi " + result[1][0].name, "You have verified a fuel receival request on the portal.", result[1][0].cell );
                                                res.send('success');
                                                res.end();
                                            }
                                        );
                                    }
                                }
                            );
                        }
                    }
                );
            }
        }
    );
} );

router.post('/fuel-managent/fuel-request-for-station/new', ( req, res ) => {
    const { fuelRequired, requested_by } = req.body;

    if (parseInt(fuelRequired) <= 0) {
        res.status(500).send(err);
        res.end();
        return false;
    }

    db.query(
        "INSERT INTO `tbl_fuel_request_for_station`(`fuel_required`, `requested_by`, `requested_at`) VALUES (?,?,?);",
        [fuelRequired, requested_by, new Date()],
        ( err ) => {
            if( err ) {
                console.log(err)
                res.status(500).send(err);
                res.end();
            }else {
                res.send('success');
                res.end();
            }
        }
    );
} );

router.post('/fuel-managent/fuel-request-for-station/requests', ( req, res ) => {
    const { emp_id, access } = req.body;

    db.query(
        "SELECT tbl_fuel_request_for_station.*, \
        submit.name AS submit_person, \
        approve.name AS approval_person  \
        FROM tbl_fuel_request_for_station  \
        LEFT OUTER JOIN employees submit ON tbl_fuel_request_for_station.requested_by = submit.emp_id \
        LEFT OUTER JOIN employees approve ON tbl_fuel_request_for_station.approved_by = approve.emp_id \
        " + (access === 1 ? "" : "WHERE tbl_fuel_request_for_station.requested_by = ? OR tbl_fuel_request_for_station.approved_by = ?") + " ORDER BY id DESC;",
        [emp_id, emp_id],
        ( err, rslt ) => {
            if( err ) {
                console.log(err)
                res.status(500).send(err);
                res.end();
            }else {
                db.query(
                    "SELECT IFNULL( (SELECT SUM(quantity_in_ltr) FROM `tbl_fuel_stock_at_workshop` WHERE in_out = 'IN') ,0) AS q;" +
                    "SELECT IFNULL( (SELECT SUM(quantity_in_ltr) FROM `tbl_fuel_stock_at_workshop` WHERE in_out = 'OUT') ,0) AS q;",
                    ( err, result ) => {
                        if( err ) {
                            console.log(err)
                            res.status(500).send(err);
                            res.end();
                        }else {
                            const IN = result[0][0].q;
                            const OUT = result[1][0].q;
                            const TOTAL = IN - OUT;
                            const arr = [];
                            for (let x = 0; x < rslt.length; x++) {
                                rslt[x].total_stock = TOTAL;
                                arr.push(rslt[x]);
                            }
                            res.send( arr );
                            res.end();
                        }
                    }
                );
            }
        }
    );
} );

router.post('/fuel-managent/fuel-request-for-station/request/details', ( req, res ) => {
    const { id } = req.body;

    db.query(
        "SELECT tbl_fuel_request_for_station.*, \
        submit.name AS submit_person, \
        approve.name AS approval_person  \
        FROM tbl_fuel_request_for_station  \
        LEFT OUTER JOIN employees submit ON tbl_fuel_request_for_station.requested_by = submit.emp_id \
        LEFT OUTER JOIN employees approve ON tbl_fuel_request_for_station.approved_by = approve.emp_id \
        WHERE tbl_fuel_request_for_station.id = ? ORDER BY id DESC;",
        [id],
        ( err, rslt ) => {
            if( err ) {
                console.log(err)
                res.status(500).send(err);
                res.end();
            }else {
                res.send(rslt);
                res.end();
            }
        }
    );
} );

router.post('/fuel-managent/fuel-issue-for-equipemnt/request/details', ( req, res ) => {
    const { id } = req.body;

    db.query(
        "SELECT tbl_fuel_issue_for_equipments.*, \
        submit.name AS submit_person, \
        tbl_fuel_equipment_setup.equipment_type AS equipment_type_name, \
        tbl_fuel_equipment_company_setup.equipment_number AS equipment_no, \
        approve.name AS verifier_person  \
        FROM tbl_fuel_issue_for_equipments  \
        LEFT OUTER JOIN employees submit ON tbl_fuel_issue_for_equipments.submitted_by = submit.emp_id \
        LEFT OUTER JOIN employees approve ON tbl_fuel_issue_for_equipments.verified_by = approve.emp_id \
        LEFT OUTER JOIN tbl_fuel_equipment_setup ON tbl_fuel_issue_for_equipments.equipment_type = tbl_fuel_equipment_setup.id \
        LEFT OUTER JOIN tbl_fuel_equipment_company_setup ON tbl_fuel_issue_for_equipments.equipment_number = tbl_fuel_equipment_company_setup.id \
        WHERE tbl_fuel_issue_for_equipments.id = ? ORDER BY id DESC;",
        [id],
        ( err, rslt ) => {
            if( err ) {
                console.log(err)
                res.status(500).send(err);
                res.end();
            }else {
                res.send(rslt);
                res.end();
            }
        }
    );
} );

router.post('/fuel-managent/fuel-issue-for-trip/request/details', ( req, res ) => {
    const { id } = req.body;

    db.query(
        "SELECT tbl_fuel_issue_for_trailers.*, \
        submit.name AS submit_person, \
        tbl_fuel_equipment_setup.equipment_type AS equipment_type_name, \
        tbl_fuel_equipment_company_setup.equipment_number AS equipment_no \
        FROM tbl_fuel_issue_for_trailers  \
        LEFT OUTER JOIN employees submit ON tbl_fuel_issue_for_trailers.created_by = submit.emp_id \
        LEFT OUTER JOIN tbl_fuel_equipment_setup ON tbl_fuel_issue_for_trailers.equipment_type = tbl_fuel_equipment_setup.id \
        LEFT OUTER JOIN tbl_fuel_equipment_company_setup ON tbl_fuel_issue_for_trailers.equipment_number = tbl_fuel_equipment_company_setup.id \
        WHERE tbl_fuel_issue_for_trailers.id = ? ORDER BY id DESC;",
        [id],
        ( err, rslt ) => {
            if( err ) {
                console.log(err)
                res.status(500).send(err);
                res.end();
            }else {
                res.send(rslt);
                res.end();
            }
        }
    );
} );

router.post('/fuel-managent/fuel-request-for-station/reject', ( req, res ) => {
    const { id, rejected_by } = req.body;

    db.query(
        "UPDATE `tbl_fuel_request_for_station` SET approved_by = ?, approved_at = ?, status = ? WHERE id = ?;",
        [rejected_by, new Date(), 'Rejected', id],
        ( err ) => {
            if( err ) {
                console.log(err)
                res.status(500).send(err);
                res.end();
            }else {
                res.send('success');
                res.end();
            }
        }
    );
} );

router.post('/fuel-managent/fuel-request-for-station/approve', ( req, res ) => {
    const { id, quantity, emp_id, approved_by, requested_at } = req.body;

    db.query(
        "SELECT IFNULL( (SELECT SUM(quantity_in_ltr) FROM `tbl_fuel_stock_at_workshop` WHERE in_out = 'IN') ,0) AS q;" +
        "SELECT IFNULL( (SELECT SUM(quantity_in_ltr) FROM `tbl_fuel_stock_at_workshop` WHERE in_out = 'OUT') ,0) AS q;",
        ( err, rslt ) => {
            if( err ) {
                console.log(err)
                res.status(500).send(err);
                res.end();
            }else {
                const IN = rslt[0][0].q;
                const OUT = rslt[1][0].q;
                const TOTAL = IN - OUT;

                if (parseFloat(quantity) > parseFloat(TOTAL)) {
                    res.send('limit exceed');
                    res.end();
                }else {
                    db.query(
                        "UPDATE `tbl_fuel_request_for_station` SET approved_by = ?, approved_at = ?, status = ?, stock_at_workshop = ? WHERE id = ?;",
                        [approved_by, new Date(), 'Approved', TOTAL, id],
                        ( err ) => {
                            if( err ) {
                                console.log(err)
                                res.status(500).send(err);
                                res.end();
                            }else {
                                db.query(
                                    'INSERT INTO `tbl_fuel_stock_at_fueling_station`(`request_id`, `quantity_in_ltr`, `fuel_requested_at`) VALUES (?,?,?);' +
                                    'INSERT INTO `tbl_fuel_stock_at_workshop`(`request_id`, `quantity_in_ltr`, `fuel_received_at`, `in_out`) VALUES (?,?,?,?);',
                                    [ id, quantity, requested_at, id, quantity, requested_at, 'OUT' ],
                                    ( err ) => {
                                        if( err ) {
                                            console.log(err)
                                            res.status(500).send(err);
                                            res.end();
                                        }else {
                                            db.query(
                                                "SELECT name, cell FROM employees WHERE emp_id = ?;" + 
                                                "SELECT name, cell FROM employees WHERE emp_id = ?;",
                                                [ emp_id, approved_by ],
                                                ( err, result ) => {
                                                    SendWhatsappNotification( null, null, "Hi " + result[0][0].name, "Your fuel request has been approved by " + result[1][0].name + ".", result[0][0].cell );
                                                    SendWhatsappNotification( null, null, "Hi " + result[1][0].name, "You have approved a fuel request on the portal.", result[1][0].cell );
                                                    res.send('success');
                                                    res.end();
                                                }
                                            );
                                        }
                                    }
                                );
                            }
                        }
                    );
                }
            }
        }
    );

} );

router.get('/fuel-managent/fuel-request-for-station/transactions', ( req, res ) => {
    db.query(
        "SELECT IFNULL( (SELECT SUM(quantity_in_ltr) FROM `tbl_fuel_stock_at_fueling_station` WHERE in_out = 'IN') ,0) AS q;" +
        "SELECT IFNULL( (SELECT SUM(quantity_in_ltr) FROM `tbl_fuel_stock_at_fueling_station` WHERE in_out = 'OUT') ,0) AS q;" +
        "SELECT * FROM `tbl_fuel_stock_at_fueling_station` ORDER BY inserted_at DESC;",
        ( err, rslt ) => {
            if( err ) {
                console.log(err)
                res.status(500).send(err);
                res.end();
            }else {
                const IN = rslt[0][0].q;
                const OUT = rslt[1][0].q;
                const TOTAL = IN - OUT;
                res.send([{total: TOTAL}, rslt[2]]);
                res.end();
            }
        }
    );
} );

router.post('/fuel-managent/fuel-issue-for-equipemnt/reject', ( req, res ) => {
    const { id, emp_id, verifier } = req.body;

    db.query(
        "UPDATE `tbl_fuel_issue_for_equipments` SET verified_by = ?, verified_at = ?, status = ? WHERE id = ?;",
        [verifier, new Date(), 'Rejected', id],
        ( err ) => {
            if( err ) {
                console.log(err)
                res.status(500).send(err);
                res.end();
            }else {
                db.query(
                    "SELECT name, cell FROM employees WHERE emp_id = ?;" + 
                    "SELECT name, cell FROM employees WHERE emp_id = ?;",
                    [ emp_id, verifier ],
                    ( err, result ) => {
                        SendWhatsappNotification( null, null, "Hi " + result[0][0].name, "Your fuel issue request (for equipments) has been rejected by " + result[1][0].name + ".", result[0][0].cell );
                        SendWhatsappNotification( null, null, "Hi " + result[1][0].name, "You have rejected a fuel issue request (for equipments) on the portal.", result[1][0].cell );
                        res.send('success');
                        res.end();
                    }
                );
            }
        }
    );
} );

router.post('/fuel-managent/fuel-issue-for-equipemnt/approve', ( req, res ) => {
    const { id, fuel_issued, emp_id, verifier, issued_date, equipment_number } = req.body;

    db.query(
        "SELECT IFNULL( (SELECT SUM(quantity_in_ltr) FROM `tbl_fuel_stock_at_fueling_station` WHERE in_out = 'IN') ,0) AS q;" +
        "SELECT IFNULL( (SELECT SUM(quantity_in_ltr) FROM `tbl_fuel_stock_at_fueling_station` WHERE in_out = 'OUT') ,0) AS q;",
        ( err, rslt ) => {
            if( err ) {
                console.log(err)
                res.status(500).send(err);
                res.end();
            }else {
                const IN = rslt[0][0].q;
                const OUT = rslt[1][0].q;
                const TOTAL = IN - OUT;

                if (parseFloat(fuel_issued) > parseFloat(TOTAL)) {
                    res.send('limit exceed');
                    res.end();
                }else {
                    db.query(
                        "UPDATE `tbl_fuel_issue_for_equipments` SET verified_by = ?, verified_at = ?, status = ?, stock_at_station = ? WHERE id = ?;",
                        [verifier, new Date(), 'Verified', TOTAL, id],
                        ( err ) => {
                            if( err ) {
                                console.log(err)
                                res.status(500).send(err);
                                res.end();
                            }else {
                                db.query(
                                    'INSERT INTO `tbl_fuel_stock_at_fueling_station`(`request_id`, `quantity_in_ltr`, `fuel_requested_at`, `in_out`, `other_than_trip`) VALUES (?,?,?,?,?);' +
                                    'INSERT INTO `tbl_fuel_issued_to_equipments`(`request_id`, `quantity_in_ltr`, `other_than_trip`, `equipment_id`) VALUES (?,?,?,?);',
                                    [ id, fuel_issued, issued_date, 'OUT', 1, id, fuel_issued, 1, equipment_number ],
                                    ( err ) => {
                                        if( err ) {
                                            console.log(err)
                                            res.status(500).send(err);
                                            res.end();
                                        }else {
                                            db.query(
                                                "SELECT name, cell FROM employees WHERE emp_id = ?;" + 
                                                "SELECT name, cell FROM employees WHERE emp_id = ?;",
                                                [ emp_id, verifier ],
                                                ( err, result ) => {
                                                    SendWhatsappNotification( null, null, "Hi " + result[0][0].name, "Your fuel receival request has been verified by " + result[1][0].name + ".", result[0][0].cell );
                                                    SendWhatsappNotification( null, null, "Hi " + result[1][0].name, "You have verified a fuel receival request on the portal.", result[1][0].cell );
                                                    res.send('success');
                                                    res.end();
                                                }
                                            );
                                        }
                                    }
                                );
                            }
                        }
                    );
                }
            }
        }
    );
} );

module.exports = router;