const express = require('express');
const router = express.Router();
const db = require('../../db/connection');

// the following request is to get all users data

router.post('/initializeemployee', ( req, res ) => {

    const { 
        Name, FatherName, Dob, PoB, ImageName, RsdtAddress, PrmtAddress, Emergency_contact_person, Emergency_contact_number, landlineHome, personal_no, 
        cnic, cnic_PoI , cnic_DoI , cnic_DoE, children, maritalStatus, CNICFrontImageName, CNICBackImageName, CVImageName, AddressImageName, DrivingLicenseName, 
        ArmedLicenseName, gender, userID, Email
    } = req.body;
    
    const { Image, CNICFrontImage, CNICBackImage, CVImage, AddressImage, DrivingLicense, ArmedLicense } = req.files;
    let imgName = ImageName + '.png';
    let cnic_f_name = CNICFrontImageName + '.png';
    let cnic_b_name = CNICBackImageName + '.png';
    let cvimgName =  CVImageName + '.png';
    let addressimgName = AddressImageName + '.png';
    let drvLicName = DrivingLicenseName + '.png';
    let armdLicName = ArmedLicenseName + '.png';

    const d = new Date();
    
    db.getConnection(
        ( err, connection ) => {

            if ( err )
            {

                console.log( err );
                res.status(503).send(err);
                res.end();

            }else
            {
                connection.query(
                    "INSERT INTO employees (name, father_name, date_of_birth, place_of_birth, residential_address, permanent_address, emergency_person_name, emergency_person_number, landline, cell, gender, emp_status, email, children, marital_status, created_at, user_id, cnic, cnic_date_of_issue, cnic_date_of_expiry, cnic_place_of_issue, cnic_front_image, cnic_back_image) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
                    [ Name, FatherName, Dob, PoB, RsdtAddress, PrmtAddress, Emergency_contact_person, Emergency_contact_number, landlineHome, personal_no, gender, 'Waiting For Approval', Email, children, maritalStatus, d, isNaN( userID ) ? null : parseInt( userID ), cnic, cnic_DoI, cnic_DoE, cnic_PoI, cnic_f_name, cnic_b_name ],
                    ( err ) => {
            
                        if( err )
                        {
            
                            console.log( err );
                            res.status(500).send( err );
                            res.end();
                            connection.release();
            
                        }else 
                        {
            
                            connection.query(
                                "SELECT emp_id FROM employees WHERE name = '" + Name + "' AND father_name = '" + FatherName + "' AND created_at = '" + d.getFullYear() + '-' + parseInt(d.getMonth() + 1) + '-' + d.getDate() + "' AND emp_status = 'Waiting For Approval' AND cell = '" + personal_no + "'",
                                ( err, rslt ) => {
            
                                    if ( err )
                                    {
            
                                        console.log( err );
                                        res.status(500).send( err );
                                        res.end();
                                        connection.release();
            
                                    }else
                                    {
            
                                        if ( DrivingLicense )
                                        {
                                            connection.query(
                                                "INSERT INTO emp_driving_license (emp_id, driving_license, status) VALUES (?,?,?)",
                                                [ rslt[0].emp_id, drvLicName, 'Active' ],
                                                ( err, rslt ) => {
                            
                                                    if ( err )
                                                    {
                            
                                                        console.log( err );
                                                        res.status(500).send( err );
                                                        res.end();
                                                        connection.release();
                            
                                                    }
                                                }
                                            )
                                        }
            
                                        if ( ArmedLicense )
                                        {
                                            connection.query(
                                                "INSERT INTO emp_armed_license (emp_id, armed_license, status) VALUES (?,?,?)",
                                                [ rslt[0].emp_id, armdLicName, 'Active' ],
                                                ( err, rslt ) => {
                            
                                                    if ( err )
                                                    {
                            
                                                        console.log( err );
                                                        res.status(500).send( err );
                                                        res.end();
                                                        connection.release();
                            
                                                    }
                                                }
                                            )
                                        }
            
                                        connection.query(
                                            "INSERT INTO emp_cv (emp_id, cv, status) VALUES (?,?,?)",
                                            [ rslt[0].emp_id, cvimgName, 'Active' ],
                                            ( err, rsltcv ) => {
                        
                                                if ( err )
                                                {
                        
                                                    console.log( err );
                                                    res.status(500).send( err );
                                                    res.end();
                                                    connection.release();
                        
                                                }else
                                                {
                                                    connection.query(
                                                        "INSERT INTO emp_prf_address (emp_id, proof_of_address, status) VALUES (?,?,?)",
                                                        [ rslt[0].emp_id, addressimgName, 'Active' ],
                                                        ( err, rsltadd ) => {
                                    
                                                            if ( err )
                                                            {
                                    
                                                                        console.log( err );
                                                                res.status(500).send(err);
                                                                res.end();
                                                                connection.release();
                                    
                                                            }else
                                                            {
                                                                
                                                                Image.mv('client/images/employees/' + imgName, (err) => {
            
                                                                    if (err) {
                                                            
                                                                        console.log( err );
                                                                        res.status(500).send(err);
                                                                        res.end();
                                                                        connection.release();
                                                            
                                                                    }
                                                            
                                                                });
                                                            
                                                                CNICFrontImage.mv('client/images/documents/cnic/front/' + cnic_f_name, (err) => {
                                                            
                                                                    if (err) {
                                                            
                                                                        console.log( err );
                                                                        res.status(500).send(err);
                                                                        res.end();
                                                                        connection.release();
                                                            
                                                                    }
                                                            
                                                                });
                                                            
                                                                CNICBackImage.mv('client/images/documents/cnic/back/' + cnic_b_name, (err) => {
                                                            
                                                                    if (err) {
                                                            
                                                                        console.log( err );
                                                                        res.status(500).send(err);
                                                                        res.end();
                                                                        connection.release();
                                                            
                                                                    }
                                                            
                                                                });
                                                            
                                                                CVImage.mv('client/images/documents/cv/' + cvimgName, (err) => {
                                                            
                                                                    if (err) {
                                                            
                                                                        console.log( err );
                                                                        res.status(500).send(err);
                                                                        res.end();
                                                                        connection.release();
                                                            
                                                                    }
                                                            
                                                                });
                                                            
                                                                AddressImage.mv('client/images/documents/address/' + addressimgName, (err) => {
                                                            
                                                                    if (err) {
                                                            
                                                                            console.log( err );
                                                                        res.status(500).send(err);
                                                                        res.end();
                                                                        connection.release();
                                                            
                                                                    }
                                                            
                                                                });
                                                            
                                                                if (DrivingLicense)
                                                                {
                                                                    DrivingLicense.mv('client/images/documents/licenses/driving/' + drvLicName, (err) => {
                                                            
                                                                        if (err) {
                                                            
                                                                            console.log( err );
                                                                            res.status(500).send(err);
                                                                            res.end();
                                                                            connection.release();
                                                                
                                                                        }
                                                                
                                                                    });
                                                                }
                                                            
                                                                if (ArmedLicense)
                                                                {
                                                                    ArmedLicense.mv('client/images/documents/licenses/armed/' + armdLicName, (err) => {
                                                            
                                                                        if (err) {
                                                            
                                                                            console.log( err );
                                                                            res.status(500).send(err);
                                                                            res.end();
                                                                            connection.release();
                                                                
                                                                        }
                                                                
                                                                    });
                                                                }
                                    
                                                                connection.query(
                                                                    "INSERT INTO emp_app_profile (emp_id, emp_image) VALUES (?,?)",
                                                                    [ rslt[0].emp_id, imgName ],
                                                                    ( err, rslt ) => {
                                                
                                                                        if ( err )
                                                                        {
                                                            
                                                                            console.log( err );
                                                                            res.status(500).send(err);
                                                                            res.end();
                                                                            connection.release();
                                                
                                                                        }else
                                                                        {
                                                                            res.send('Done!!');
                                                                            res.end();
                                                                            connection.release();
                                                                        }
            
                                                                    }
                                                                )
                                    
                                                            }
                                                        }
                                                    )
                                                }
                                            }
                                        )
            
                                    }
            
                                }
                            )
            
                        }
            
                    }
                );
            }

        }
    );

} );

router.post('/usernameexistornot', ( req, res ) => {

    const { LoginID } = req.body;
    
    db.getConnection(
        ( err, connection ) => {

            if ( err )
            {

                
                res.status(503).send(err);
                res.end();

            }else
            {
                connection.query(
                    "SELECT login_id FROM employees WHERE login_id = '" + LoginID + "'",
                    ( err, rslt ) => {
            
                        if( err )
                        {
            
                            res.status(500).send(err);
                            res.end();
                            connection.release();
            
                        }else 
                        {
            
                            res.send( rslt );
                            res.end();
                            connection.release();
            
                        }
            
                    }
                );
            }

        }
    );

} );

router.post('/getemployee', ( req, res ) => {

    const { empID, view } = req.body;

    db.query(
        "SELECT employees.*, \
        ADDDATE(employees.date_of_birth, INTERVAL 1 DAY) `date_of_birth`, \
        ADDDATE(employees.date_of_join, INTERVAL 1 DAY) `date_of_join`, \
        users.user_name, \
        users.user_image, \
        emp_app_profile.*, \
        emp_cv.cv, \
        emp_prf_address.proof_of_address, \
        emp_armed_license.armed_license, \
        emp_driving_license.driving_license, \
        companies.company_name, \
        companies.code AS comp_code, \
        locations.location_name, \
        designations.designation_name, \
        departments.department_name \
        FROM employees \
        LEFT OUTER JOIN users ON employees.user_id = users.user_id \
        LEFT OUTER JOIN emp_app_profile ON employees.emp_id = emp_app_profile.emp_id \
        LEFT OUTER JOIN emp_cv ON employees.emp_id = emp_cv.emp_id \
        LEFT OUTER JOIN emp_prf_address ON employees.emp_id = emp_prf_address.emp_id \
        LEFT OUTER JOIN emp_armed_license ON employees.emp_id = emp_armed_license.emp_id \
        LEFT OUTER JOIN emp_driving_license ON employees.emp_id = emp_driving_license.emp_id \
        LEFT OUTER JOIN designations ON employees.designation_code = designations.designation_code \
        LEFT OUTER JOIN departments ON designations.department_code = departments.department_code \
        LEFT OUTER JOIN companies ON employees.company_code = companies.company_code \
        LEFT OUTER JOIN locations ON employees.location_code = locations.location_code \
        WHERE \
        employees.emp_id = " + empID + ";" +
        "SELECT \
        tbl_er.sr, \
        tbl_er.category, \
        employees.name \
        FROM tbl_er \
        LEFT OUTER JOIN employees ON employees.emp_id = tbl_er.sr \
        WHERE tbl_er.jr = ?;" +
        ( view ? "SELECT * FROM `tbl_portal_menu` WHERE view = ? ORDER BY indexing ASC" : '' ),
        [ empID, view ],
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
    );

} );

router.post('/getemployeedetails', ( req, res ) => {

    const { empID } = req.body;

    db.getConnection(
        ( err, connection ) => {

            if ( err )
            {

                res.status(503).send(err);
                res.end();

            }else
            {
                connection.query(
                    "SELECT employees.*, companies.company_name, departments.department_name, locations.location_name, designations.designation_name, emp_app_profile.emp_image, emp_app_profile.emp_password  \
                    FROM employees \
                    LEFT OUTER JOIN emp_app_profile ON employees.emp_id = emp_app_profile.emp_id \
                    LEFT OUTER JOIN companies ON employees.company_code = companies.company_code \
                    LEFT OUTER JOIN departments ON employees.department_code = departments.department_code \
                    LEFT OUTER JOIN locations ON employees.location_code = locations.location_code \
                    LEFT OUTER JOIN designations ON employees.designation_code = designations.designation_code \
                    WHERE employees.emp_id = " + empID,
                    ( err, rslt ) => {
            
                        if( err )
                        {
            
                            res.status(500).send(err);
                            res.end();
                            connection.release();
            
                        }else 
                        {
            
                            res.send( rslt );
                            res.end();
                            connection.release();
            
                        }
            
                    }
                );
            }

        }
    );

} );

router.post('/gettempemployee', ( req, res ) => {

    const { empID } = req.body;

    db.getConnection(
        ( err, connection ) => {

            if ( err )
            {

                
                res.status(503).send(err);
                res.end();

            }else
            {
                connection.query(
                    "SELECT employees.*, \
                    users.*, \
                    emp_app_profile.*, \
                    emp_cv.cv, \
                    emp_prf_address.proof_of_address, \
                    emp_armed_license.armed_license, \
                    emp_driving_license.driving_license \
                    FROM employees \
                    LEFT OUTER JOIN users ON employees.user_id = users.user_id \
                    LEFT OUTER JOIN emp_app_profile ON employees.emp_id = emp_app_profile.emp_id \
                    LEFT OUTER JOIN emp_cv ON employees.emp_id = emp_cv.emp_id \
                    LEFT OUTER JOIN emp_prf_address ON employees.emp_id = emp_prf_address.emp_id \
                    LEFT OUTER JOIN emp_armed_license ON employees.emp_id = emp_armed_license.emp_id \
                    LEFT OUTER JOIN emp_driving_license ON employees.emp_id = emp_driving_license.emp_id \
                    WHERE employees.emp_status = 'Waiting For Approval' AND employees.emp_id = " + empID,
                    ( err, rslt ) => {
            
                        if( err )
                        {
            
                            res.status(500).send(err);
                            res.end();
                            connection.release();
            
                        }else 
                        {
            
                            res.send( rslt );
                            res.end();
                            connection.release();
            
                        }
            
                    }
                );
            }

        }
    );

} );

router.post('/getlocationemployees', ( req, res ) => {

    const { location } = req.body;

    db.getConnection(
        ( err, connection ) => {

            if ( err )
            {

                res.status(503).send(err);
                res.end();

            }else
            {
                connection.query(
                    "SELECT * FROM employees WHERE location_code = " + location,
                    ( err, rslt ) => {
            
                        if( err )
                        {
            
                            res.status(500).send(err);
                            res.end();
                            connection.release();
            
                        }else 
                        {
            
                            res.send( rslt );
                            res.end();
                            connection.release();
            
                        }
            
                    }
                );
            }

        }
    );

} );

router.get('/getalltempemployee', ( req, res ) => {

    db.getConnection(
        ( err, connection ) => {

            if ( err )
            {

                
                res.status(503).send(err);
                res.end();

            }else
            {
                connection.query(
                    "SELECT employees.*, users.* FROM employees LEFT OUTER JOIN users ON employees.user_id = users.user_id WHERE emp_status = 'Waiting For Approval' GROUP BY emp_id DESC;",
                    ( err, rslt ) => {
            
                        if( err )
                        {
            
                            res.status(500).send(err);
                            res.end();
                            connection.release();
            
                        }else 
                        {
            
                            res.send( rslt );
                            res.end();
                            connection.release();
            
                        }
            
                    }
                );
            }

        }
    );

} );

router.post('/srchtempemp', ( req, res ) => {

    const { SearchKey, SearchBy } = req.body;

    let q = null;
    if ( SearchBy === 'name' )
    {
        q = "SELECT employees.*, users.* FROM employees LEFT OUTER JOIN users ON employees.user_id = users.user_id WHERE emp_status = 'Waiting For Approval' AND employees.name LIKE '%" + SearchKey + "%' GROUP BY emp_id DESC;";
    }else
    {
        q = "SELECT employees.*, users.* FROM employees LEFT OUTER JOIN users ON employees.user_id = users.user_id WHERE emp_status = 'Waiting For Approval' AND users.user_name LIKE '%" + SearchKey + "%' GROUP BY emp_id DESC;";
    }
    db.getConnection(
        ( err, connection ) => {

            if ( err )
            {

                res.status(503).send(err);
                res.end();

            }else
            {
                connection.query(
                    q,
                    ( err, rslt ) => {
            
                        if( err )
                        {
                            res.status(500).send(err);
                            res.end();
                            connection.release();
            
                        }else 
                        {
            
                            res.send( rslt );
                            res.end();
                            connection.release();
            
                        }
            
                    }
                );
            }

        }
    );

} );

router.post('/gettempemployeedetails', ( req, res ) => {

    const { empID } = req.body;

    db.getConnection(
        ( err, connection ) => {

            if ( err )
            {

                res.status(503).send(err);
                res.end();

            }else
            {
                connection.query(
                    "SELECT employees.*, \
                    users.*, \
                    emp_app_profile.*, \
                    emp_cv.cv, \
                    emp_prf_address.proof_of_address, \
                    emp_armed_license.armed_license, \
                    emp_driving_license.driving_license \
                    FROM employees \
                    LEFT OUTER JOIN users ON employees.user_id = users.user_id \
                    LEFT OUTER JOIN emp_app_profile ON employees.emp_id = emp_app_profile.emp_id \
                    LEFT OUTER JOIN emp_cv ON employees.emp_id = emp_cv.emp_id \
                    LEFT OUTER JOIN emp_prf_address ON employees.emp_id = emp_prf_address.emp_id \
                    LEFT OUTER JOIN emp_armed_license ON employees.emp_id = emp_armed_license.emp_id \
                    LEFT OUTER JOIN emp_driving_license ON employees.emp_id = emp_driving_license.emp_id \
                    WHERE employees.emp_status = 'Waiting For Approval' AND employees.emp_id = " + empID,
                    ( err, rslt ) => {
            
                        if( err )
                        {
            
                            res.status(500).send(err);
                            res.end();
                            connection.release();
            
                        }else 
                        {
            
                            res.send( rslt );
                            res.end();
                            connection.release();
            
                        }
            
                    }
                );
            }

        }
    );

} );

router.post('/createemployee', ( req, res ) => {

    const { 
        Designations, departments, Location, TimeOUT, TimeIN, EmpPassword, 
        LoginID, CompanyName, doj, salary, EmpGrade
    } = req.body[0];

    const { 
        emp_id 
    } = req.body[1];

    const additionalOFFDays = req.body[2];
    const EmpID = req.body[3];
    const EmpAccess = req.body[4];

    const d = new Date();

    db.getConnection(
        ( err, connection ) => {

            if ( err )
            {

                res.status(503).send(err);
                res.end();

            }else
            {
                connection.query(
                    "UPDATE employees SET emp_id = " + parseInt( EmpID ) + ", time_in = '" + TimeIN + "', time_out = '" + TimeOUT + "', salary = '" + salary + "', date_of_join = '" + doj + "', additional_off = '" + additionalOFFDays + "', emp_status = 'Active', access = '" + EmpAccess + "', company_code = '" + parseInt( CompanyName ) + "', department_code = '" + parseInt( departments ) + "', location_code = '" + parseInt( Location ) + "', designation_code = '" + parseInt( Designations ) + "', grade_code = '" + parseInt( EmpGrade ) + "', updated_at = '" + d + "' WHERE employees.emp_id = " + emp_id,
                    ( err, rslt ) => {
            
                        if ( err )
                        {
                            res.status(500).send(err);
                            res.end();
                            connection.release();
                        }else
                        {
            
                            connection.query(
                                "UPDATE emp_app_profile SET login_id = '" + LoginID + "', emp_password = '" + EmpPassword + "' WHERE emp_app_profile.emp_id = " + parseInt( EmpID ),
                                ( err, rslt ) => {
                        
                                    if ( err )
                                    {
                                        res.status(500).send(err);
                                        res.end();
                                        connection.release();
                                    }else
                                    {
                                        res.send('Done!');
                                        res.end();
                                        connection.release();
                                    }
                        
                                }
                            )
            
                        }
            
                    }
                )
            }

        }
    );

} );

module.exports = router;