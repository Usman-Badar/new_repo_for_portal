const express = require('express');
const router = express.Router();
const db = require('../../db/connection');
const supplier_verifier = 10106;

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
        "INSERT INTO `tbl_fuel_receival_for_workshop`(`company_code`, `location_code`, `supplier`, `fuel_received`, `receival_date`, `submitted_by`, `verified_by`) VALUES (?,?,?,?,?,?,?);",
        [company_code, location_code, supplier, fuel, date, emp_id, supplier_verifier],
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

router.post('/fuel-managent/fuel-receival-for-workshop/requests', ( req, res ) => {
    const { emp_id } = req.body;

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
        WHERE tbl_fuel_receival_for_workshop.submitted_by = ? OR tbl_fuel_receival_for_workshop.verified_by = ?;",
        [emp_id, emp_id],
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

module.exports = router;