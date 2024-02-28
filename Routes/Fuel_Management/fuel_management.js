const express = require('express');
const router = express.Router();
const db = require('../../db/connection');
const { SendWhatsappNotification } = require('../Whatsapp/whatsapp');
// const supplier_verifier = 10106;
// const supplier_approval = 10119;

router.post('/fuel-managent/additional-fuel-issue-for-selected-trips-list', ( req, res ) => {
    const { allIssued, id, fuel, emp_id, number, trip_date } = req.body;
    let status = 'partial issued';
    if (allIssued === 1) {
        status = 'issued';
    }
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
                if (parseFloat(fuel) > TOTAL) {
                    res.send('limit increase');
                    res.end();
                }else {
                    db.query(
                        "UPDATE tbl_fuel_entry_for_trip SET status = ?, last_issued_by = ?, last_issued_at = ?, additional_fuel_issued = 1, additional_fuel_issued_at = ? WHERE id = ?;",
                        [status, emp_id, new Date(), new Date(), id],
                        ( err ) => {
                            if( err ) {
                                console.log(err)
                                res.status(500).send(err);
                                res.end();
                            }else {
                                let q = '';
                                let para = [];
                                q = q.concat('INSERT INTO `tbl_fuel_stock_at_fueling_station`(`request_id`, `quantity_in_ltr`, `fuel_requested_at`, `in_out`, `trip_based`) VALUES (?,?,?,?,?);');
                                para.push(id)
                                para.push(fuel)
                                para.push(trip_date)
                                para.push('OUT')
                                para.push(1)
            
                                q = q.concat('INSERT INTO `tbl_fuel_issued_to_equipments`(`request_id`, `quantity_in_ltr`, `trip_based`, `equipment_id`) VALUES (?,?,?,?);');
                                para.push(id)
                                para.push(fuel)
                                para.push(1)
                                para.push(number)
                                db.query(
                                    q,
                                    para,
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
                            }
                        }
                    );
                }
            }
        }
    );
} );

router.post('/fuel-managent/fuel-issue-for-selected-trips-list', ( req, res ) => {
    const { additionalFuelIssued, additionalFuel, trip_date, number, allIssued, id, routes, emp_id } = req.body;
    const selectedRoutes = JSON.parse(routes);
    let status = 'issued';

    if (allIssued !== 1) {
        status = 'partial issued';
    }
    if (additionalFuel === 1 && additionalFuelIssued === 0) {
        status = 'partial issued';
    }
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
                let fuelSelected = 0;
                for (let x = 0; x < selectedRoutes.length; x++) {
                    fuelSelected = parseFloat(fuelSelected) + parseFloat(selectedRoutes[x].fuel);
                }
                if (fuelSelected > TOTAL) {
                    res.send('limit increase');
                    res.end();
                }else {
                    db.query(
                        "UPDATE tbl_fuel_entry_for_trip SET status = ?, last_issued_by = ?, last_issued_at = ? WHERE id = ?;",
                        [status, emp_id, new Date(), id],
                        ( err ) => {
                            if( err ) {
                                console.log(err)
                                res.status(500).send(err);
                                res.end();
                            }else {
                                let q = '';
                                let para = [];
                                for (let x = 0; x < selectedRoutes.length; x++) {
                                    q = q.concat("UPDATE tbl_fuel_entry_trips_list SET status = ?, issued_by = ?, issued_at = ? WHERE id = ?;");
                                    para.push('issued')
                                    para.push(emp_id)
                                    para.push(new Date())
                                    para.push(selectedRoutes[x].id)
                
                                    q = q.concat('INSERT INTO `tbl_fuel_stock_at_fueling_station`(`request_id`, `quantity_in_ltr`, `fuel_requested_at`, `in_out`, `trip_based`) VALUES (?,?,?,?,?);');
                                    para.push(id)
                                    para.push(selectedRoutes[x].fuel)
                                    para.push(trip_date)
                                    para.push('OUT')
                                    para.push(1)
                
                                    q = q.concat('INSERT INTO `tbl_fuel_issued_to_equipments`(`request_id`, `quantity_in_ltr`, `trip_based`, `equipment_id`) VALUES (?,?,?,?);');
                                    para.push(id)
                                    para.push(selectedRoutes[x].fuel)
                                    para.push(1)
                                    para.push(number)
                                }
                                db.query(
                                    q,
                                    para,
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
                            }
                        }
                    );
                }
            }
        }
    );
} );

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
    const { type, number, from, to, date, fuel, emp_id } = req.body;
    const dt = date === '' || date === null || date === 'null' || date === undefined ? new Date() : date;

    if (type === '' || isNaN(parseInt(type))) {
        res.send('err');
        res.end();
        return false;
    }else if (number === '' || isNaN(parseInt(number))) {
        res.send('err');
        res.end();
        return false;
    }else if (fuel === '' || isNaN(parseInt(fuel)) || parseInt(fuel) <= 0) {
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
        "INSERT INTO `tbl_fuel_issue_for_trailers`(`fuel_to_issue`, `trip_date`, `equipment_type`, `equipment_number`, `trip_from`, `trip_to`, `created_by`) VALUES (?,?,?,?,?,?,?);",
        [fuel, dt, type, number, from, to, emp_id],
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

router.post('/fuel-managent/issue-fuel-for-trips', ( req, res ) => {
    const { total_fuel, type, number, trips, additionalFuel, date, emp_id } = req.body;
    const dt = date === '' || date === null || date === 'null' || date === undefined ? new Date() : date;
    const tripEntries = JSON.parse(trips);

    if (type === '' || isNaN(parseInt(type))) {
        res.send('err');
        res.end();
        return false;
    }else if (number === '' || isNaN(parseInt(number))) {
        res.send('err');
        res.end();
        return false;
    }else if (tripEntries.length === 0) {
        res.send('err');
        res.end();
        return false;
    }else if (parseInt(additionalFuel) < 0) {
        res.send('err');
        res.end();
        return false;
    }
    else if (emp_id == null || emp_id === '' || isNaN(parseInt(emp_id))) {
        res.send('err');
        res.end();
        return false;
    }

    db.query(
        "INSERT INTO `tbl_fuel_entry_for_trip`(`total_fuel_to_issue`, `trip_date`, `equipment_type`, `equipment_number`, `additional_fuel`, `created_by`) VALUES (?,?,?,?,?,?);",
        [total_fuel, dt, type, number, additionalFuel, emp_id],
        ( err, rslt ) => {
            console.log(rslt);
            if( err ) {
                console.log(err)
                res.status(500).send(err);
                res.end();
            }else {
                let q = "";
                for (let x = 0; x < tripEntries.length; x++) {
                    q = q.concat(`INSERT INTO tbl_fuel_entry_trips_list(entry_code, trip_id, route, fuel) VALUES (${rslt.insertId}, ${tripEntries[x].id}, '${tripEntries[x].trip_from} to ${tripEntries[x].trip_to}', ${tripEntries[x].fuel_to_issue});`);
                }
                db.query(
                    q,
                    () => {
                        res.send('success');
                        res.end();
                    }
                );
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
        "SELECT tbl_fuel_equipment_company_setup.*, companies.company_name, locations.location_name, tbl_fuel_equipment_setup.equipment_type AS equipment_type_name FROM `tbl_fuel_equipment_company_setup` LEFT OUTER JOIN companies ON tbl_fuel_equipment_company_setup.company_code = companies.company_code LEFT OUTER JOIN locations ON tbl_fuel_equipment_company_setup.location_code = locations.location_code LEFT OUTER JOIN tbl_fuel_equipment_setup ON tbl_fuel_equipment_company_setup.equipment_type = tbl_fuel_equipment_setup.id ORDER BY tbl_fuel_equipment_company_setup.id DESC;",
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
        "SELECT IFNULL( (SELECT SUM(quantity_in_ltr) FROM `tbl_fuel_issued_to_equipments` WHERE in_out = 'IN' AND equipment_id = ?) ,0) AS q;" +
        "SELECT IFNULL( (SELECT SUM(quantity_in_ltr) FROM `tbl_fuel_issued_to_equipments` WHERE in_out = 'OUT' AND equipment_id = ?) ,0) AS q;" +
        "SELECT * FROM `tbl_fuel_issued_to_equipments` WHERE equipment_id = ?;",
        [id, id, id],
        ( err, rslt ) => {
            if( err ) {
                console.log(err);
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

router.post('/fuel-managent/equipments/details/filtered', ( req, res ) => {
    const { id, startDate, endDate } = req.body;
    console.log(startDate)
    let q = "";
    if (startDate.length > 0 && endDate.length === 0) {
        q = "SELECT IFNULL( (SELECT SUM(quantity_in_ltr) FROM `tbl_fuel_issued_to_equipments` WHERE in_out = 'IN' AND equipment_id = ? AND DATE(inserted_at) = DATE('" + startDate + "')) ,0) AS q;" +
            "SELECT IFNULL( (SELECT SUM(quantity_in_ltr) FROM `tbl_fuel_issued_to_equipments` WHERE in_out = 'OUT' AND equipment_id = ? AND DATE(inserted_at) = DATE('" + startDate + "')) ,0) AS q;" +
            "SELECT * FROM `tbl_fuel_issued_to_equipments` WHERE equipment_id = ? AND DATE(inserted_at) = DATE('" + startDate + "');";
    }else {
        q = "SELECT IFNULL( (SELECT SUM(quantity_in_ltr) FROM `tbl_fuel_issued_to_equipments` WHERE in_out = 'IN' AND equipment_id = ? AND DATE(inserted_at) BETWEEN DATE('" + startDate + "') AND DATE('" + endDate + "')) ,0) AS q;" +
            "SELECT IFNULL( (SELECT SUM(quantity_in_ltr) FROM `tbl_fuel_issued_to_equipments` WHERE in_out = 'OUT' AND equipment_id = ? AND DATE(inserted_at) BETWEEN DATE('" + startDate + "') AND DATE('" + endDate + "')) ,0) AS q;" +
            "SELECT * FROM `tbl_fuel_issued_to_equipments` WHERE equipment_id = ? AND DATE(inserted_at) BETWEEN DATE('" + startDate + "') AND DATE('" + endDate + "');";
    }
    db.query(
        q,
        [id, id, id],
        ( err, rslt ) => {
            if( err ) {
                console.log(err);
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
        "SELECT  \
        tbl_fuel_stock_at_workshop.*,  \
        workshop_company.code AS workshop_company,  \
        workshop_location.location_name AS workshop_location, \
        tbl_fuel_receival_for_workshop.supplier, \
        tbl_fuel_receival_for_workshop.fuel_received AS workshop_fuel_received, \
        tbl_fuel_receival_for_workshop.submitted_at, \
        tbl_fuel_receival_for_workshop.verified_at, \
        workshop_submit_person.name AS workshop_submit_person, \
        workshop_verify_person.name AS workshop_verify_person, \
         \
        station_company.code AS station_company, \
        station_location.location_name AS station_location, \
        station_submit_person.name AS station_submit_person, \
        station_verify_person.name AS station_verify_person, \
        tbl_fuel_request_for_station.requested_at, \
        tbl_fuel_request_for_station.approved_at \
        FROM `tbl_fuel_stock_at_workshop`  \
        LEFT OUTER JOIN tbl_fuel_receival_for_workshop ON tbl_fuel_stock_at_workshop.request_id = tbl_fuel_receival_for_workshop.id \
        LEFT OUTER JOIN companies workshop_company ON tbl_fuel_receival_for_workshop.company_code = workshop_company.company_code \
        LEFT OUTER JOIN locations workshop_location ON tbl_fuel_receival_for_workshop.location_code = workshop_location.location_code \
        LEFT OUTER JOIN employees workshop_submit_person ON tbl_fuel_receival_for_workshop.submitted_by = workshop_submit_person.emp_id \
        LEFT OUTER JOIN employees workshop_verify_person ON tbl_fuel_receival_for_workshop.verified_by = workshop_verify_person.emp_id \
         \
        LEFT OUTER JOIN tbl_fuel_request_for_station ON tbl_fuel_stock_at_workshop.request_id = tbl_fuel_request_for_station.id \
        LEFT OUTER JOIN companies station_company ON tbl_fuel_request_for_station.company_code = station_company.company_code \
        LEFT OUTER JOIN locations station_location ON tbl_fuel_request_for_station.location_code = station_location.location_code \
        LEFT OUTER JOIN employees station_submit_person ON tbl_fuel_request_for_station.requested_by = station_submit_person.emp_id \
        LEFT OUTER JOIN employees station_verify_person ON tbl_fuel_request_for_station.approved_by = station_verify_person.emp_id \
        ORDER BY tbl_fuel_stock_at_workshop.inserted_at DESC;",
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

router.post('/fuel-managent/trip-entries/equipment-numbers', ( req, res ) => {
    const { number } = req.body;

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
        WHERE tbl_fuel_issue_for_trailers.equipment_number = ? ORDER BY id DESC;",
        [number],
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
                res.send(rslt);
                res.end();
            }
        }
    );
} );

router.get('/fuel-managent/fuel-issue-for-trips-list/requests', ( req, res ) => {
    db.query(
        "SELECT tbl_fuel_entry_for_trip.*, \
        locations.location_name, \
        companies.company_name, \
        submit.name AS submit_person, \
        tbl_fuel_equipment_setup.equipment_type AS equipment_type_name, \
        tbl_fuel_equipment_company_setup.equipment_number AS equipment_no \
        FROM tbl_fuel_entry_for_trip  \
        LEFT OUTER JOIN locations ON tbl_fuel_entry_for_trip.location_code = locations.location_code \
        LEFT OUTER JOIN companies ON tbl_fuel_entry_for_trip.company_code = companies.company_code \
        LEFT OUTER JOIN employees submit ON tbl_fuel_entry_for_trip.created_by = submit.emp_id \
        LEFT OUTER JOIN tbl_fuel_equipment_setup ON tbl_fuel_entry_for_trip.equipment_type = tbl_fuel_equipment_setup.id \
        LEFT OUTER JOIN tbl_fuel_equipment_company_setup ON tbl_fuel_entry_for_trip.equipment_number = tbl_fuel_equipment_company_setup.id \
        ORDER BY tbl_fuel_entry_for_trip.id DESC;",
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

router.post('/fuel-managent/request/load-trip-lists', ( req, res ) => {
    const { id } = req.body;

    db.query(
        "SELECT tbl_fuel_entry_trips_list.*, \
        submit.name AS submit_person \
        FROM tbl_fuel_entry_trips_list  \
        LEFT OUTER JOIN employees submit ON tbl_fuel_entry_trips_list.issued_by = submit.emp_id \
        WHERE tbl_fuel_entry_trips_list.entry_code = ?;",
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
    const { emp_id, access, date } = req.body;

    db.query(
        "SELECT tbl_fuel_request_for_station.*, \
        submit.name AS submit_person, \
        approve.name AS approval_person,  \
        companies.company_name,  \
        locations.location_name  \
        FROM tbl_fuel_request_for_station  \
        LEFT OUTER JOIN employees submit ON tbl_fuel_request_for_station.requested_by = submit.emp_id \
        LEFT OUTER JOIN employees approve ON tbl_fuel_request_for_station.approved_by = approve.emp_id \
        LEFT OUTER JOIN companies ON tbl_fuel_request_for_station.company_code = companies.company_code \
        LEFT OUTER JOIN locations ON tbl_fuel_request_for_station.location_code = locations.location_code \
        " + (access === 1 ? "" : (date && date.length > 0 ? "WHERE tbl_fuel_request_for_station.requested_by = ? OR tbl_fuel_request_for_station.approved_by = ? AND DATE(tbl_fuel_request_for_station.requested_at) = '" + date + "'" : "WHERE tbl_fuel_request_for_station.requested_by = ? OR tbl_fuel_request_for_station.approved_by = ?")) + " ORDER BY id DESC;",
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
        "SELECT tbl_fuel_entry_for_trip.*, \
        submit.name AS submit_person, \
        tbl_fuel_equipment_setup.equipment_type AS equipment_type_name, \
        tbl_fuel_equipment_company_setup.equipment_number AS equipment_no \
        FROM tbl_fuel_entry_for_trip  \
        LEFT OUTER JOIN employees submit ON tbl_fuel_entry_for_trip.created_by = submit.emp_id \
        LEFT OUTER JOIN tbl_fuel_equipment_setup ON tbl_fuel_entry_for_trip.equipment_type = tbl_fuel_equipment_setup.id \
        LEFT OUTER JOIN tbl_fuel_equipment_company_setup ON tbl_fuel_entry_for_trip.equipment_number = tbl_fuel_equipment_company_setup.id \
        WHERE tbl_fuel_entry_for_trip.id = ? ORDER BY id DESC;",
        [id],
        ( err, rslt ) => {
            if( err ) {
                console.log(err)
                res.status(500).send(err);
                res.end();
            }else {
                const data = rslt[0];
                db.query(
                    "SELECT tbl_fuel_entry_trips_list.route \
                    FROM tbl_fuel_entry_trips_list  \
                    WHERE tbl_fuel_entry_trips_list.entry_code = ? ORDER BY id DESC;",
                    [id],
                    ( err, result ) => {
                        if( err ) {
                            console.log(err)
                            res.status(500).send(err);
                            res.end();
                        }else {
                            let route = "";
                            for (let x = 0; x < result.length; x++) {
                                route = route.concat(result[x].route + '\n');
                            }

                            data.route = route;
                            res.send([data]);
                            res.end();
                        }
                    }
                );
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
        "SELECT  \
        tbl_fuel_stock_at_fueling_station.*,  \
        station_company.company_name AS station_company,  \
        station_location.location_name AS station_location, \
        tbl_fuel_request_for_station.requested_at, \
        tbl_fuel_request_for_station.approved_at, \
        station_submit_person.name AS station_submit_person, \
        station_verify_person.name AS station_verify_person, \
        equipment_company.code AS equipment_company, \
        equipment_location.location_name AS equipment_location, \
        equipment.equipment_number, \
        equipment_type.equipment_type, \
        equipment_submit_person.name AS equipment_submit_person, \
        equipment_verify_person.name AS equipment_verify_person, \
        tbl_fuel_issue_for_equipments.submitted_at, \
        tbl_fuel_issue_for_equipments.verified_at, \
         \
        trip_company.code AS trip_company, \
        trip_location.location_name AS trip_location, \
        trip_issued_by.name AS trip_issued_by, \
        trip_equipment.equipment_number, \
        trip_equipment_type.equipment_type, \
        tbl_fuel_entry_for_trip.last_issued_at \
        FROM `tbl_fuel_stock_at_fueling_station`  \
        LEFT OUTER JOIN tbl_fuel_request_for_station ON tbl_fuel_stock_at_fueling_station.request_id = tbl_fuel_request_for_station.id \
        LEFT OUTER JOIN companies station_company ON tbl_fuel_request_for_station.company_code = station_company.company_code \
        LEFT OUTER JOIN locations station_location ON tbl_fuel_request_for_station.location_code = station_location.location_code \
        LEFT OUTER JOIN employees station_submit_person ON tbl_fuel_request_for_station.requested_by = station_submit_person.emp_id \
        LEFT OUTER JOIN employees station_verify_person ON tbl_fuel_request_for_station.approved_by = station_verify_person.emp_id \
         \
        LEFT OUTER JOIN tbl_fuel_issue_for_equipments ON tbl_fuel_stock_at_fueling_station.request_id = tbl_fuel_issue_for_equipments.id \
        LEFT OUTER JOIN companies equipment_company ON tbl_fuel_issue_for_equipments.company_code = equipment_company.company_code \
        LEFT OUTER JOIN locations equipment_location ON tbl_fuel_issue_for_equipments.location_code = equipment_location.location_code \
        LEFT OUTER JOIN tbl_fuel_equipment_company_setup equipment ON tbl_fuel_issue_for_equipments.equipment_number = equipment.id \
        LEFT OUTER JOIN tbl_fuel_equipment_setup equipment_type ON tbl_fuel_issue_for_equipments.equipment_type = equipment_type.id \
        LEFT OUTER JOIN employees equipment_submit_person ON tbl_fuel_issue_for_equipments.submitted_by = equipment_submit_person.emp_id \
        LEFT OUTER JOIN employees equipment_verify_person ON tbl_fuel_issue_for_equipments.verified_by = equipment_verify_person.emp_id \
         \
        LEFT OUTER JOIN tbl_fuel_entry_for_trip ON tbl_fuel_stock_at_fueling_station.request_id = tbl_fuel_entry_for_trip.id \
        LEFT OUTER JOIN companies trip_company ON tbl_fuel_entry_for_trip.company_code = trip_company.company_code \
        LEFT OUTER JOIN locations trip_location ON tbl_fuel_entry_for_trip.location_code = trip_location.location_code \
        LEFT OUTER JOIN employees trip_issued_by ON tbl_fuel_entry_for_trip.last_issued_by = trip_issued_by.emp_id \
        LEFT OUTER JOIN tbl_fuel_equipment_company_setup trip_equipment ON tbl_fuel_entry_for_trip.equipment_number = trip_equipment.id \
        LEFT OUTER JOIN tbl_fuel_equipment_setup trip_equipment_type ON tbl_fuel_entry_for_trip.equipment_type = trip_equipment_type.id \
        ORDER BY tbl_fuel_stock_at_fueling_station.inserted_at DESC;",
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