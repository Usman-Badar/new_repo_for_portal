const express = require('express');
const router = express.Router();
const db = require('../../db/connection');

router.get('/portal/issues/categories', ( req, res ) => {
    db.query(
        "SELECT * FROM `tbl_pi_categories` WHERE status = 'Active' ORDER BY pi_category_id DESC",
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
    const { requested_by } = req.body;
    db.query(
        "SELECT tbl_pi_reported.*, employees.name, departments.department_name FROM `tbl_pi_reported` \
        LEFT OUTER JOIN employees ON employees.emp_id = tbl_pi_reported.requested_by \
        LEFT OUTER JOIN departments ON employees.department_code = departments.department_code \
        WHERE tbl_pi_reported.requested_by = ? ORDER BY tbl_pi_reported.requested_at, tbl_pi_reported.priority;",
        [ requested_by ],
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
        LEFT OUTER JOIN employees request ON request.emp_id = tbl_pi_reported.requested_by \
        LEFT OUTER JOIN departments request_dept ON request.department_code = request_dept.department_code \
        LEFT OUTER JOIN employees support ON support.emp_id = tbl_pi_reported.support_by \
        LEFT OUTER JOIN departments support_dept ON support.department_code = support_dept.department_code \
        LEFT OUTER JOIN employees edit ON edit.emp_id = tbl_pi_reported.last_edit_by \
        LEFT OUTER JOIN departments edit_dept ON edit.department_code = edit_dept.department_code \
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

module.exports = router;