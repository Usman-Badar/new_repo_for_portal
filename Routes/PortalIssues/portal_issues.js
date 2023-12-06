const express = require('express');
const router = express.Router();
const db = require('../../db/conn_portal_issues');

router.get('/portal/issues/categories', ( req, res ) => {
    db.query(
        "SELECT * FROM `tbl_pi_categories` WHERE status = 'Active' ORDER BY pi_category_id",
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

router.post('/portal/issues/list', ( req, res ) => {
    const { requested_by, admin } = req.body;
    if (parseInt(admin) === 1) {
        db.query(
            "SELECT tbl_pi_reported.*, seaboard.employees.name, seaboard.departments.department_name, seaboard.companies.code FROM `tbl_pi_reported` \
            LEFT OUTER JOIN seaboard.employees ON seaboard.employees.emp_id = tbl_pi_reported.requested_by \
            LEFT OUTER JOIN seaboard.departments ON seaboard.employees.department_code = seaboard.departments.department_code \
            LEFT OUTER JOIN seaboard.companies ON seaboard.employees.company_code = seaboard.companies.company_code \
            ORDER BY tbl_pi_reported.requested_at DESC;",
            ( err, rslt ) => {
                if( err ) {
                    console.log(err);
                    res.status(500).send(err);
                    res.end();
                }else {
                    res.send( rslt );
                    res.end();
                }
            }
        );
    }else {
        db.query(
            "SELECT tbl_pi_reported.*, seaboard.employees.name, seaboard.departments.department_name, seaboard.companies.code FROM `tbl_pi_reported` \
            LEFT OUTER JOIN seaboard.employees ON seaboard.employees.emp_id = tbl_pi_reported.requested_by \
            LEFT OUTER JOIN seaboard.departments ON seaboard.employees.department_code = seaboard.departments.department_code \
            LEFT OUTER JOIN seaboard.companies ON seaboard.employees.company_code = seaboard.companies.company_code \
            WHERE tbl_pi_reported.requested_by = ? ORDER BY tbl_pi_reported.requested_at DESC;",
            [ requested_by ],
            ( err, rslt ) => {
                if( err ) {
                    console.log(err);
                    res.status(500).send(err);
                    res.end();
                }else {
                    res.send( rslt );
                    res.end();
                }
            }
        );
    }
} );

router.post('/portal/issues/details', ( req, res ) => {
    const { report_id, viewer } = req.body;
    db.query(
        "SELECT \
        tbl_pi_reported.*, \
        request.name AS request_emp_name, \
        request_dept.department_name AS request_emp_dept, \
        support.name AS support_emp_name, \
        support_dept.department_name AS support_emp_dept, \
        edit.name AS edit_emp_name, \
        edit_dept.department_name AS edit_emp_dept \
        FROM `tbl_pi_reported` \
        LEFT OUTER JOIN seaboard.employees request ON request.emp_id = tbl_pi_reported.requested_by \
        LEFT OUTER JOIN seaboard.departments request_dept ON request.department_code = request_dept.department_code \
        LEFT OUTER JOIN seaboard.employees support ON support.emp_id = tbl_pi_reported.support_by \
        LEFT OUTER JOIN seaboard.departments support_dept ON support.department_code = support_dept.department_code \
        LEFT OUTER JOIN seaboard.employees edit ON edit.emp_id = tbl_pi_reported.last_edit_by \
        LEFT OUTER JOIN seaboard.departments edit_dept ON edit.department_code = edit_dept.department_code \
        WHERE tbl_pi_reported.portal_issue_id = ?;",
        [ report_id ],
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

router.post('/portal/issues/new', ( req, res ) => {
    const { category, categoryName, issue_date, subject, description, reported_by } = req.body;
    db.query(
        "INSERT INTO `tbl_pi_reported`(`pi_category_id`, `pi_category`, `subject`, `description`, `issue_date`, `requested_by`) VALUES (?,?,?,?,?,?);",
        [ category, categoryName, subject, description, issue_date, reported_by ],
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

router.post('/portal/issues/update', ( req, res ) => {
    const { report_id, support_by, status, support_comment } = req.body;
    db.query(
        "UPDATE `tbl_pi_reported` SET status = ?, support_by = ?, support_at = ?, support_comments = ? WHERE portal_issue_id = ?;",
        [ status, support_by, new Date(), support_comment, report_id ],
        ( err ) => {
            if( err ) {
                console.log(err);
                res.status(500).send(err);
                res.end();
            }else {
                res.send('success');
                res.end();
            }
        }
    );
} );

router.post('/portal/issues/update/priority', ( req, res ) => {
    const { report_id, update_by, priority } = req.body;
    db.query(
        "UPDATE `tbl_pi_reported` SET priority = ?, last_edit_by = ?, last_edit_at = ? WHERE portal_issue_id = ?;",
        [ priority, update_by, new Date(), report_id ],
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

module.exports = router;