const express = require('express');
const router = express.Router();
const db = require('../../db/connection');
const fs = require('fs');
const administrativeNotifications = require('./notifications').administrativeNotifications;
const SendWhatsappNotification = require('../Whatsapp/whatsapp').SendWhatsappNotification;
const owner = 5000; // JP
const inv = 20015; // Antash
const inv2 = 5000; // Saima

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
            connection.beginTransaction(
                ( err ) => {
                    if ( err )
                    {
                        console.log(err);
                        connection.rollback(() => {console.log(err);connection.release();});
                    }else
                    {
                        connection.query(
                            "SELECT MAX(emp_id) AS emp_id FROM employees;",
                            ( err, max_emp_id ) => {
                                if( err )
                                {
                                    connection.rollback(() => {console.log(err);connection.release();});
                                    res.status(500).send(err);
                                    res.end();
                                }else
                                {
                                    const emp_id = parseInt(max_emp_id[0].emp_id) + 1;
                                    connection.query(
                                        "INSERT INTO employees (emp_id, name, father_name, date_of_birth, place_of_birth, residential_address, permanent_address, emergency_person_name, emergency_person_number, landline, cell, gender, emp_status, email, children, marital_status, created_at, user_id, cnic, cnic_date_of_issue, cnic_date_of_expiry, cnic_place_of_issue, cnic_front_image, cnic_back_image) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
                                        [ emp_id, Name, FatherName, Dob, PoB, RsdtAddress, PrmtAddress, Emergency_contact_person, Emergency_contact_number, landlineHome, personal_no, gender, 'Waiting For Approval', Email, children, maritalStatus, d, isNaN( userID ) ? null : parseInt( userID ), cnic, cnic_DoI, cnic_DoE, cnic_PoI, cnic_f_name, cnic_b_name ],
                                        ( err, rslt ) => {
                                
                                            if( err )
                                            {
                                                connection.rollback(() => {console.log(err);connection.release();});
                                                res.status(500).send(err);
                                                res.end();
                                            }else
                                            {
                                                if ( DrivingLicense )
                                                {
                                                    connection.query(
                                                        "INSERT INTO emp_driving_license (emp_id, driving_license, status) VALUES (?,?,?)",
                                                        [ emp_id, drvLicName, 'Active' ],
                                                        ( err, rslt ) => {
                                                
                                                            if( err )
                                                            {
                                                                connection.rollback(() => {console.log(err);connection.release();});
                                                                res.status(500).send(err);
                                                                res.end();
                                                            }
                                                
                                                        }
                                                    );
                                                }
                                                if ( ArmedLicense )
                                                {
                                                    connection.query(
                                                        "INSERT INTO emp_armed_license (emp_id, armed_license, status) VALUES (?,?,?)",
                                                        [ emp_id, armdLicName, 'Active' ],
                                                        ( err, rslt ) => {
                                                
                                                            if( err )
                                                            {
                                                                connection.rollback(() => {console.log(err);connection.release();});
                                                                res.status(500).send(err);
                                                                res.end();
                                                            }
                                                
                                                        }
                                                    );
                                                }
                                                connection.query(
                                                    "INSERT INTO emp_cv (emp_id, cv, status) VALUES (?,?,?)",
                                                    [ emp_id, cvimgName, 'Active' ],
                                                    ( err ) => {
                                            
                                                        if( err )
                                                        {
                                                            connection.rollback(() => {console.log(err);connection.release();});
                                                            res.status(500).send(err);
                                                            res.end();
                                                        }else
                                                        {
                                                            connection.query(
                                                                "INSERT INTO emp_prf_address (emp_id, proof_of_address, status) VALUES (?,?,?)",
                                                                [ emp_id, addressimgName, 'Active' ],
                                                                ( err ) => {
                                                        
                                                                    if( err )
                                                                    {
                                                                        connection.rollback(() => {console.log(err);connection.release();});
                                                                        res.status(500).send(err);
                                                                        res.end();
                                                                    }else
                                                                    {
                                                                        Image.mv('client/images/employees/' + imgName, (err) => {

                                                                            if (err) {
                                                                    
                                                                                console.log( err );
                                                                                res.status(500).send(err);
                                                                                res.end();
                                                                    
                                                                            }
                                                                    
                                                                        });
                                                                    
                                                                        CNICFrontImage.mv('client/images/documents/cnic/front/' + cnic_f_name, (err) => {
                                                                    
                                                                            if (err) {
                                                                    
                                                                                console.log( err );
                                                                                res.status(500).send(err);
                                                                                res.end();
                                                                    
                                                                            }
                                                                    
                                                                        });
                                                                    
                                                                        CNICBackImage.mv('client/images/documents/cnic/back/' + cnic_b_name, (err) => {
                                                                    
                                                                            if (err) {
                                                                    
                                                                                console.log( err );
                                                                                res.status(500).send(err);
                                                                                res.end();
                                                                    
                                                                            }
                                                                    
                                                                        });
                                                                    
                                                                        CVImage.mv('client/images/documents/cv/' + cvimgName, (err) => {
                                                                    
                                                                            if (err) {
                                                                    
                                                                                console.log( err );
                                                                                res.status(500).send(err);
                                                                                res.end();
                                                                    
                                                                            }
                                                                    
                                                                        });
                                                                    
                                                                        AddressImage.mv('client/images/documents/address/' + addressimgName, (err) => {
                                                                    
                                                                            if (err) {
                                                                    
                                                                                console.log( err );
                                                                                res.status(500).send(err);
                                                                                res.end();
                                                                    
                                                                            }
                                                                    
                                                                        });
                                                                    
                                                                        if (DrivingLicense)
                                                                        {
                                                                            DrivingLicense.mv('client/images/documents/licenses/driving/' + drvLicName, (err) => {
                                                                    
                                                                                if (err) {
                                                                    
                                                                                    console.log( err );
                                                                                    res.status(500).send(err);
                                                                                    res.end();
                                                                        
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
                                                                        
                                                                                }
                                                                        
                                                                            });
                                                                        }
                                                                        
                                                                        connection.query(
                                                                            "INSERT INTO emp_app_profile (emp_id, emp_image) VALUES (?,?)",
                                                                            [ emp_id, imgName ],
                                                                            ( err ) => {
                                                                    
                                                                                if( err )
                                                                                {
                                                                                    connection.rollback(() => {console.log(err);connection.release();});
                                                                                    res.status(500).send(err);
                                                                                    res.end();
                                                                                }else
                                                                                {
                                                                                    connection.commit((err) => {
                                                                                        if ( err ) {
                                                                                            connection.rollback(() => {console.log(err);connection.release();});
                                                                                            res.send('err');
                                                                                            res.end();
                                                                                        }else
                                                                                        {
                                                                                            connection.release();
                                                                                            res.send('Done!!');
                                                                                            res.end();
                                                                                        }
                                                                                    });
                                                                                }
                                                                    
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
                                }
                            }
                        );
                    }
                }
            )
        }
    )

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
        LEFT OUTER JOIN departments ON employees.department_code = departments.department_code \
        LEFT OUTER JOIN companies ON employees.company_code = companies.company_code \
        LEFT OUTER JOIN locations ON employees.location_code = locations.location_code \
        WHERE \
        employees.emp_id = " + empID + ";" +
        "SELECT  \
        tbl_er.sr,  \
        tbl_er.category,  \
        employees.name,  \
        employees.email,  \
        employees.gender, \
        emp_props.pr_approval_limit \
        FROM tbl_er  \
        LEFT OUTER JOIN employees ON employees.emp_id = tbl_er.sr \
        LEFT OUTER JOIN emp_props ON employees.emp_id = emp_props.emp_id  \
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

                let query = "SELECT * FROM invtry_emp_approval_to_related_companies ";

                if ( rslt[1].length > 0 )
                {
                    query = query.concat(" WHERE ");
                    for ( let i = 0; i < rslt[1].length; i++ )
                    {
                        if ( i === 0 )
                        {
                            query = query.concat(" emp_id = " + rslt[1][i].sr);
                        }else
                        {
                            query = query.concat(" OR emp_id = " + rslt[1][i].sr);
                        }
                    }
                }

                db.query(
                    query,
                    ( err, result ) => {
            
                        if( err )
                        {
                            res.status(500).send(err);
                            res.end();
            
                        }else 
                        {
                            for ( let i = 0; i < rslt[1].length; i++ )
                            {
                                let arr = [];
                                for ( let ix = 0; ix < result.length; ix++ )
                                {
                                    if ( result[ix].emp_id === rslt[1][i].sr )
                                    {
                                        arr.push(result[ix].company_code);
                                    }
                                }
                                rslt[1][i].companies = arr;
                            }
                            db.query(
                                "SELECT * FROM invtry_emp_approval_to_related_companies WHERE emp_id = ?;",
                                [ empID ],
                                ( err, companies ) => {
                        
                                    if( err )
                                    {
                                        res.status(500).send(err);
                                        res.end();
                        
                                    }else 
                                    {
                                        let arr = [];
                                        for ( x = 0; x < companies.length; x++ )
                                        {
                                            arr.push(companies[x].company_code);
                                        }
                                        rslt[0][0].companies = arr;
                                        res.send( rslt );
                                        res.end();
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

router.post('/temporary/employee/create', ( req, res ) => {

    const { company_code, location_code, created_by, department, designation, name, f_name, d_o_b, cell, gender, address, cnic_no, cnic_d_o_i, additional_notes, cnic_d_o_e } = req.body;
    const d = new Date();
    const cnic_front_img_name = [name, "front", d.getDate(), '.jpg'].join("_");
    const cnic_back_img_name = [name, "back", d.getDate(), '.jpg'].join("_");
    const emp_img_name = [name, cnic_no, d.getDate(), '.jpg'].join("_");

    db.getConnection(
        ( err, connection ) => {
            connection.beginTransaction(
                ( err ) => {
                    if ( err )
                    {
                        connection.rollback(() => {console.log(err);connection.release();});
                        res.send('err');
                        res.end();
                    }else
                    {
                        connection.query(
                            "SELECT MAX(temp_emp_id) AS last_emp_id FROM tbl_temp_employees WHERE company_code = ? AND location_code = ?;",
                            [ company_code, location_code ],
                            ( err, rslt ) => {
                                if( err )
                                {
                                    connection.rollback(() => {console.log(err);connection.release();});
                                    res.send('err');
                                    res.end();
                                }else 
                                {
                                    console.log(rslt[0])
                                    const last_emp_id = rslt[0] && rslt[0].last_emp_id ? ( rslt[0].last_emp_id + 1 ) : ( company_code + location_code + "001" );
                                    connection.query(
                                        "INSERT INTO tbl_temp_employees (temp_emp_id, name, father_name, date_of_birth, address, cell, gender, created_by, cnic_no, cnic_d_o_i, cnic_d_o_e, cnic_front, cnic_back, department, designation, company_code, location_code, image, addItional_notes) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);",
                                        [last_emp_id, name, f_name, d_o_b, address, cell, gender, created_by, cnic_no, cnic_d_o_i, cnic_d_o_e, cnic_front_img_name, cnic_back_img_name, department, designation, company_code, location_code, emp_img_name, additional_notes],
                                        ( err, rslt ) => {
                                            if( err )
                                            {
                                                connection.rollback(() => {console.log(err);connection.release();});
                                                res.send('err');
                                                res.end();
                                            }else 
                                            {
                                                connection.commit((err) => {
                                                    if ( err ) {
                                                        connection.rollback(() => {console.log(err);connection.release();});
                                                        res.send('err');
                                                        res.end();
                                                    }else
                                                    {
                                                        if ( req.files ) {
                                                            const { empImage, CNICFront, CNICBack } = req.files;
                                                            empImage.mv('client/images/employees/' + emp_img_name, (err) => {
                                                                if (err) {
                                                                    console.log( err );
                                                                    res.status(500).send(err);
                                                                    res.end();
                                                                }else
                                                                console.log("File Saved Successfully");
                                                            });
                                                            CNICFront.mv('client/images/documents/cnic/front/' + cnic_front_img_name, (err) => {
                                                                if (err) {
                                                                    console.log( err );
                                                                    res.status(500).send(err);
                                                                    res.end();
                                                                }else
                                                                console.log("File Saved");
                                                            });
                                                            CNICBack.mv('client/images/documents/cnic/back/' + cnic_back_img_name, (err) => {
                                                                if (err) {
                                                                    console.log( err );
                                                                    res.status(500).send(err);
                                                                    res.end();
                                                                }else
                                                                console.log("File Saved");
                                                            });
                                                        }
                                                        connection.release();
                                                        res.send("SUCCESS");
                                                        res.end();
                                                    }
                                                });
                                            }
                                        }
                                    );
                                }
                            }
                        );
                    }
                }
            )
        }
    );
});

router.post('/temporary/employee/confirm', ( req, res ) => {

    const { emp_id, approved_by, remarks } = req.body;
    const d = new Date();

    db.query(
        "UPDATE tbl_temp_employees SET status = 'active', approved_by = ?, approved_date = ?, approved_time = ?, approval_remarks = ? WHERE temp_emp_id = ? AND status = 'waiting_for_approval';",
        [ approved_by, d, d.toTimeString(), remarks, emp_id ],
        ( err ) => {
            if( err )
            {
                console.log(err)
                res.send('err');
                res.end();
            }else 
            {
                res.send("SUCCESS");
                res.end();
            }
        }
    );
});

router.post('/temporary/employee/verification', ( req, res ) => {

    const { emp_id, verified_by, remarks } = req.body;
    const d = new Date();

    db.query(
        "UPDATE tbl_temp_employees SET status = 'waiting_for_approval', verified_by = ?, verified_date = ?, verified_time = ?, verification_remarks = ? WHERE temp_emp_id = ? AND status = 'waiting_for_verification';",
        [ verified_by, d, d.toTimeString(), remarks, emp_id ],
        ( err ) => {
            if( err )
            {
                res.send('err');
                res.end();
            }else 
            {
                res.send("SUCCESS");
                res.end();
            }
        }
    );
});

router.post('/fetch/hr/temporary/employees/list', ( req, res ) => {
    const { companies, verification_person } = req.body;
    const parsed_companies = JSON.parse(companies);
    let query = "SELECT 1;";
    if (parseInt(verification_person) === 1) {
        query = "SELECT tbl_temp_employees.*, locations.location_name, companies.company_name, created.name AS created_by_person FROM tbl_temp_employees \
        LEFT OUTER JOIN locations ON tbl_temp_employees.location_code = locations.location_code \
        LEFT OUTER JOIN companies ON tbl_temp_employees.company_code = companies.company_code \
        LEFT OUTER JOIN employees created ON tbl_temp_employees.created_by = created.emp_id;";
    }else if ( parsed_companies.length > 0 ) {
        query = "SELECT tbl_temp_employees.*, locations.location_name, companies.company_name, created.name AS created_by_person FROM tbl_temp_employees \
        LEFT OUTER JOIN locations ON tbl_temp_employees.location_code = locations.location_code \
        LEFT OUTER JOIN companies ON tbl_temp_employees.company_code = companies.company_code \
        LEFT OUTER JOIN employees created ON tbl_temp_employees.created_by = created.emp_id \
        WHERE ";
        parsed_companies.forEach((company, index) => {
            query = query.concat(`tbl_temp_employees.company_code = ${company}`);
            if ( (index+1) < parsed_companies.length ) query = query.concat(` OR `);
        });
    }
    console.log(query);
    db.query(
        query,
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
    );
} );

router.post('/hr/temporary/employee/data', ( req, res ) => {

    const { emp_id } = req.body;

    db.query(
        "SELECT  \
        `tbl_temp_employees`.*, \
        `companies`.`company_name`, \
        `locations`.`location_name`, \
        `requisition`.`name` AS requisition_name, \
        `verification`.`name` AS verification_name, \
        `approval`.`name` AS approval_name \
        FROM `tbl_temp_employees` \
        LEFT OUTER JOIN companies ON tbl_temp_employees.company_code = companies.company_code \
        LEFT OUTER JOIN locations ON tbl_temp_employees.location_code = locations.location_code \
        LEFT OUTER JOIN employees requisition ON tbl_temp_employees.created_by = requisition.emp_id \
        LEFT OUTER JOIN employees verification ON tbl_temp_employees.verified_by = verification.emp_id \
        LEFT OUTER JOIN employees approval ON tbl_temp_employees.approved_by = approval.emp_id \
        WHERE tbl_temp_employees.temp_emp_id  = ?;",
        [ emp_id ],
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

router.post('/get_employee_sr', ( req, res ) => {

    const { empID } = req.body;

    db.query(
        "SELECT  \
        tbl_er.sr,  \
        tbl_er.category,  \
        employees.emp_id,  \
        employees.name,  \
        employees.email,  \
        employees.gender, \
        emp_props.pr_approval_limit \
        FROM tbl_er  \
        LEFT OUTER JOIN employees ON employees.emp_id = tbl_er.sr \
        LEFT OUTER JOIN emp_props ON employees.emp_id = emp_props.emp_id  \
        WHERE tbl_er.jr = ?;",
        [empID],
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

    db.query(
        "SELECT employees.*, users.* FROM employees LEFT OUTER JOIN users ON employees.user_id = users.user_id WHERE emp_status = 'Waiting For Approval' GROUP BY employees.created_at DESC;",
        ( err, rslt ) => {
            if( err ){
                res.status(500).send(err);
                res.end();
            }else {
                res.send( rslt );
                res.end();
            }
        }
    );

} );

router.get('/access/get/all', ( req, res ) => {
    db.query(
        "SELECT * FROM `accesses`",
        ( err, rslt ) => {
            if( err ){
                res.status(500).send(err);
                res.end();
            }else {
                res.send( rslt );
                res.end();
            }
        }
    );
} );

router.post('/access/create/new', ( req, res ) => {
    const {access_id, module, access_title, access_description} = req.body;
    db.query(
        "INSERT INTO `accesses`(`access_id`, `access_title`, `access_description`, `module`) VALUESs (?,?,?,?);",
        [access_id, access_title, access_description, module],
        ( err ) => {
            if( err ){
                res.status(500).send(err);
                res.end();
            }else {
                res.send('success');
                res.end();
            }
        }
    );
} );

router.post('/access/create/update', ( req, res ) => {
    const {access_id, module, access_title, access_description} = req.body;
    db.query(
        "UPDATE `accesses` SET access_title = ?, access_description = ?, module = ? WHERE access_id = ?;",
        [access_title, access_description, module, access_id],
        ( err ) => {
            if( err ){
                res.status(500).send(err);
                res.end();
            }else {
                res.send('success');
                res.end();
            }
        }
    );
} );

router.post('/employees/search/keyword', ( req, res ) => {
    const {keyword} = req.body;
    db.query(
        "SELECT employees.emp_id, employees.name, employees.access, emp_app_profile.emp_image, designations.designation_name FROM `employees` LEFT OUTER JOIN emp_app_profile ON employees.emp_id = emp_app_profile.emp_id LEFT OUTER JOIN designations ON employees.designation_code = designations.designation_code WHERE employees.emp_status = 'Active' AND LOWER(employees.name) LIKE '%" + keyword.toLowerCase() + "%';",
        ( err, rslt ) => {
            if( err ){
                console.log(err);
                res.status(500).send(err);
                res.end();
            }else {
                res.send(rslt);
                res.end();
            }
        }
    );
} );

router.post('/access/employee/revoke', ( req, res ) => {
    const {list, emp_id} = req.body;
    db.query(
        "UPDATE employees SET access = ? WHERE emp_id = ?;",
        [JSON.stringify(list), emp_id],
        ( err ) => {
            if( err ){
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

router.post('/access/module/name/update', ( req, res ) => {
    const {module, name} = req.body;
    db.query(
        "UPDATE accesses SET module = ? WHERE LOWER(module) = ?;",
        [name, module.toLowerCase()],
        ( err ) => {
            if( err ){
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

router.post('/access/assign/employees', ( req, res ) => {
    const {employees, access_id} = req.body;
    const parsed_employees = JSON.parse(employees);
    const limit = parsed_employees.length;
    let count = 0;
    function assignAccess() {
        db.query(
            "SELECT access FROM employees WHERE emp_id = ? AND access IS NOT NULL;",
            [parsed_employees[count].emp_id],
            ( err, rslt ) => {
                if( err ){
                    console.log(err);
                    res.status(500).send(err);
                    res.end();
                }else {
                    const access = JSON.parse(rslt[0].access);
                    access.push(access_id);
                    access.sort();
                    db.query(
                        "UPDATE employees SET access = ? WHERE emp_id = ?;",
                        [JSON.stringify(access), parsed_employees[count].emp_id],
                        ( err ) => {
                            if( err ){
                                console.log(err);
                                res.status(500).send(err);
                                res.end();
                            }else {
                                if ((count+1) === limit) {
                                    res.send('success');
                                    res.end();
                                }else {
                                    count = count + 1;
                                    assignAccess();
                                }
                            }
                        }
                    );
                }
            }
        );
    }
    assignAccess();
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
    const boxes = JSON.parse(req.body[5]);

    const d = new Date();

    let q = "INSERT INTO `emp_props`(`emp_id`, ";
    for ( let x = 0; x < boxes.length; x++ )
    {
        if ( ( x + 1 ) === boxes.length )
        {
            q = q.concat("`" + boxes[x].field + "`) VALUES (" + parseInt( EmpID ) + ", ")
        }else
        {
            q = q.concat("`" + boxes[x].field + "`, ")
        }
    }

    for ( let y = 0; y < boxes.length; y++ )
    {
        if ( ( y + 1 ) === boxes.length )
        {
            q = q.concat( ( boxes[y].value ? boxes[y].value : boxes[y].checked ? 1 : 0 ) + ');' )
        }else
        {
            q = q.concat( ( boxes[y].value ? boxes[y].value : boxes[y].checked ? 1 : 0 ) + ', ' )
        }
    }

    db.query(
        "UPDATE employees SET emp_id = " + parseInt( EmpID ) + ", time_in = '" + TimeIN + "', time_out = '" + TimeOUT + "', salary = '" + salary + "', date_of_join = '" + doj + "', additional_off = '" + additionalOFFDays + "', emp_status = 'Active', app_status = '', access = '" + EmpAccess + "', company_code = '" + parseInt( CompanyName ) + "', department_code = '" + parseInt( departments ) + "', location_code = '" + parseInt( Location ) + "', designation_code = '" + parseInt( Designations ) + "', grade_code = '" + parseInt( EmpGrade ) + "', updated_at = '" + d + "' WHERE employees.emp_id = " + emp_id,
        ( err, rslt ) => {

            if ( err )
            {
                res.status(500).send(err);
                res.end();
            }else
            {

                db.query(
                    "UPDATE emp_app_profile SET login_id = '" + LoginID + "', emp_password = '" + EmpPassword + "' WHERE emp_app_profile.emp_id = " + parseInt( EmpID ),
                    ( err, rslt ) => {
            
                        if ( err )
                        {
                            res.status(500).send(err);
                            res.end();
                        }else
                        {
                            db.query(
                                q,
                                ( err, rslt ) => {
                        
                                    if ( err )
                                    {
                                        res.status(500).send(err);
                                        res.end();
                                    }else
                                    {
                                        res.send('Done!');
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

router.get('/getempprops', ( req, res ) => {

    db.query(
        "SHOW COLUMNS FROM seaboard.emp_props;",
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
    );

} );

router.get('/hr/employee/load/data', ( req, res ) => {

    db.query(
        "SELECT * FROM `designations` ORDER BY designation_name ASC;" + 
        "SELECT * FROM `departments` ORDER BY department_name ASC;" + 
        "SELECT * FROM `locations` WHERE status = 'active' ORDER BY location_name ASC;" + 
        "SELECT * FROM `emp_grades`;",
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
    );

} );

router.post('/get/employees/all', ( req, res ) => {

    const { emp_id, accessKey, company_code, department_code } = req.body;
    let sql = "";
    if ( accessKey == 0 )
    {
        sql = "AND tbl_er.sr = " + emp_id;
    }else
    if ( accessKey == 2 )
    {
        sql = "AND employees.company_code = " + company_code;
    }else
    if ( accessKey == 3 )
    {
        sql = "AND employees.company_code = " + company_code + " AND employees.department_code = " + department_code;
    }

    db.query(
        "SELECT employees.emp_id, employees.name, designations.designation_name, emp_app_profile.emp_image, companies.company_name FROM employees  \
        LEFT OUTER JOIN designations ON employees.designation_code = designations.designation_code  \
        LEFT OUTER JOIN tbl_er ON employees.emp_id = tbl_er.jr  \
        LEFT OUTER JOIN emp_app_profile ON employees.emp_id = emp_app_profile.emp_id  \
        LEFT OUTER JOIN companies ON employees.company_code = companies.company_code WHERE  \
        employees.emp_status = 'Active' " + sql + " OR tbl_er.sr = ? \
        GROUP BY employees.emp_id ORDER BY employees.name ASC;",
        [ emp_id ],
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

router.post('/acr/growth-review/employees/all', ( req, res ) => {
    const { emp_id } = req.body;
    db.query(
        "SELECT   \
        employees.emp_id,   \
        employees.name,   \
        designations.designation_name,   \
        emp_app_profile.emp_image,   \
        companies.company_name  \
        FROM tbl_acr_growth_review_emp_relations    \
        LEFT OUTER JOIN employees ON tbl_acr_growth_review_emp_relations.junior = employees.emp_id    \
        LEFT OUTER JOIN designations ON employees.designation_code = designations.designation_code    \
        LEFT OUTER JOIN emp_app_profile ON employees.emp_id = emp_app_profile.emp_id    \
        LEFT OUTER JOIN companies ON employees.company_code = companies.company_code   \
        WHERE employees.emp_status = 'Active' AND tbl_acr_growth_review_emp_relations.senior = ? \
        GROUP BY employees.emp_id ORDER BY employees.name ASC;",
        [ emp_id ],
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

router.post('/acr/peer-review/employees/all', ( req, res ) => {
    const { emp_id } = req.body;
    db.query(
        "SELECT  \
        employees.emp_id,  \
        employees.name,  \
        designations.designation_name,  \
        emp_app_profile.emp_image,  \
        companies.company_name, \
        tbl_acr_peer_relations.last_submitted_in_quarter \
        FROM tbl_acr_peer_relations   \
        LEFT OUTER JOIN employees ON tbl_acr_peer_relations.last_person = employees.emp_id   \
        LEFT OUTER JOIN designations ON employees.designation_code = designations.designation_code   \
        LEFT OUTER JOIN emp_app_profile ON employees.emp_id = emp_app_profile.emp_id   \
        LEFT OUTER JOIN companies ON employees.company_code = companies.company_code  \
        WHERE employees.emp_status = 'Active' AND tbl_acr_peer_relations.first_person = ?  \
        GROUP BY employees.emp_id ORDER BY employees.name ASC;",
        [ emp_id ],
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

router.post(
    '/register_thumb',
    ( req, res ) => {
        const { thumbs, emp_id } = req.body;
        console.log(thumbs);
        db.query(
            "SELECT thumbs FROM employees WHERE emp_id = ?;",
            [ emp_id ],
            ( err, rslt ) => {
    
                if( err )
                {
                    console.log('err');
                    res.status(500).send(err);
                    res.end();
                }else 
                {
                    if ( rslt[0].thumbs === 1 )
                    {
                        res.send('already exists');
                        res.end();
                    }else
                    {
                        db.query(
                            "UPDATE employees SET thumbs = 1 WHERE emp_id = ?;",
                            [ emp_id ],
                            ( err ) => {
                    
                                if( err )
                                {
                                    console.log('err');
                                    res.status(500).send(err);
                                    res.end();
                                }else 
                                {
                                    for ( let x = 0; x < thumbs.length; x++ )
                                    {
                                        if ( req.body.thumbs[x].img !== '' )
                                        {
                                            fs.writeFile("client/images/thumbs/" + emp_id + "_" + (x+1) + ".bmp", req.body.thumbs[x].img, 'base64', function(err) {
                                                console.log(err);
                                                console.log("Finger Print " + req.body.thumbs[x].title + " Saved");
                                            });
                                        }
                                        if ( (x+1) === thumbs.length )
                                        {
                                            res.send('success');
                                            res.end();
                                        }
                                    }
                                }
                    
                            }
                        )
                    }
                }
    
            }
        )
    }
)

router.post('/get/company/employees', ( req, res ) => {

    const { company_code, companies } = req.body;
    const companiesList = JSON.parse(companies);
    let conditions = "";
    let arr = [];
    
    if ( company_code == null && companiesList.length === 0 )
    {
        conditions = conditions.concat(' WHERE employees.company_code = x ');
    }else
    if ( company_code == null )
    {
        for ( let x = 0; x < companiesList.length; x++ )
        {
            if ( x === 0 )
            {
                conditions = conditions.concat(' WHERE ');
            }
            conditions = conditions.concat(' employees.company_code = ? ');
            arr.push(companiesList[x].company_code);
            if ( ( x + 1 ) !== companiesList.length )
            {
                conditions = conditions.concat(' OR ');
            }
        }
    }else
    {
        conditions = conditions.concat(' WHERE employees.company_code = ? ');
        arr.push(company_code);
    }
    conditions = conditions.concat(' ORDER BY employees.name ASC; ');

    let aaaaa = db.query(
        "SELECT  \
        `employees`.`emp_id`, \
        `employees`.`name`, \
        `employees`.`emp_status`, \
        `employees`.`date_of_join`, \
        `emp_app_profile`.`emp_image`, \
        `designations`.`designation_name`, \
        `departments`.`department_name`, \
        `companies`.`company_name`, \
        `locations`.`location_name` \
        FROM `employees` \
        LEFT OUTER JOIN emp_app_profile ON employees.emp_id = emp_app_profile.emp_id \
        LEFT OUTER JOIN designations ON employees.designation_code = designations.designation_code \
        LEFT OUTER JOIN departments ON employees.department_code = departments.department_code \
        LEFT OUTER JOIN companies ON employees.company_code = companies.company_code \
        LEFT OUTER JOIN locations ON employees.location_code = locations.location_code" +
        conditions,
        arr,
        ( err, rslt ) => {
            console.log(aaaaa.sql);
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

router.post('/hr/employee/data', ( req, res ) => {

    const { emp_id } = req.body;

    db.query(
        "SELECT  \
        `employees`.*, \
        `emp_app_profile`.`emp_image`, \
        `designations`.`designation_name`, \
        `departments`.`department_name`, \
        `companies`.`company_name`, \
        `locations`.`location_name`, \
        `emp_cv`.`cv`, \
        `emp_prf_address`.`proof_of_address`, \
        `emp_props`.`attendance_enable`, \
        `emp_grades`.`grade` \
        FROM `employees` \
        LEFT OUTER JOIN emp_app_profile ON employees.emp_id = emp_app_profile.emp_id \
        LEFT OUTER JOIN designations ON employees.designation_code = designations.designation_code \
        LEFT OUTER JOIN departments ON employees.department_code = departments.department_code \
        LEFT OUTER JOIN companies ON employees.company_code = companies.company_code \
        LEFT OUTER JOIN locations ON employees.location_code = locations.location_code \
        LEFT OUTER JOIN emp_cv ON employees.emp_id = emp_cv.emp_id \
        LEFT OUTER JOIN emp_prf_address ON employees.emp_id = emp_prf_address.emp_id \
        LEFT OUTER JOIN emp_props ON employees.emp_id = emp_props.emp_id \
        LEFT OUTER JOIN emp_grades ON employees.grade_code = emp_grades.grade_code \
        WHERE employees.emp_id = ? \
        ORDER BY employees.name ASC;",
        [ emp_id ],
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

router.post('/admin/notifications', ( req, res ) => {

    const { emp_id } = req.body;

    db.query(
        "SELECT \
        tbl_administrative_notifications.*, \
        employees.name \
        FROM `tbl_administrative_notifications` \
        LEFT OUTER JOIN employees ON tbl_administrative_notifications.link = employees.emp_id \
        WHERE owner = ? ORDER BY tbl_administrative_notifications.notification_id DESC LIMIT 10;",
        [ emp_id ],
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

router.post('/admin/notifications/all', ( req, res ) => {

    const { emp_id } = req.body;

    db.query(
        "SELECT \
        tbl_administrative_notifications.*, \
        employees.name \
        FROM `tbl_administrative_notifications` \
        LEFT OUTER JOIN employees ON tbl_administrative_notifications.link = employees.emp_id \
        WHERE owner = ? ORDER BY tbl_administrative_notifications.note_date DESC, tbl_administrative_notifications.note_time DESC;",
        [ emp_id ],
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

router.post('/admin/notification/viewed', ( req, res ) => {

    const { notification_id } = req.body;

    db.query(
        "UPDATE tbl_administrative_notifications SET status = ?, view_date = ? WHERE notification_id = ?;",
        [ 'viewed', new Date(), notification_id ],
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

router.post('/employees/tickets/generate', ( req, res ) => {

    const { emp_id, ticket, remarks, generated_by } = req.body;

    db.query(
        "INSERT INTO `emp_tickets`(`emp_id`, `generated_by`, `generated_date`, `generated_time`, `ticket`, `remarks`) VALUES (?,?,?,?,?,?);",
        [ emp_id, generated_by, new Date(), new Date().toTimeString(), ticket, remarks ],
        ( err ) => {

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
                    [ generated_by, emp_id ],
                    ( err, result ) => {
            
                        if( err )
                        {
            
                            console.log( err );
                            res.send( err );
                            res.end();
            
                        }else
                        {
                            SendWhatsappNotification( null, null, "Hi " + result[0][0].name, ticket + " ticket has been given to the employee " + result[1][0].name + ".", result[0][0].cell );
                            SendWhatsappNotification( null, null, "Hi " + result[1][0].name, result[0][0].name + " has given you a " + ticket + " ticket with remarks '" + remarks + "'.", result[1][0].cell );
                            res.send('success');
                            res.end();
                        }
            
                    }
                );

            }

        }
    );

} );

router.post('/acr/ticket/delete', ( req, res ) => {

    const { data } = req.body;
    const parsed_data = JSON.parse(data);

    db.query(
        "DELETE FROM emp_tickets WHERE ticket_id = ?;",
        [ parsed_data.ticket_id ],
        ( err ) => {
            if( err )
            {
                console.log( err )
                res.status(500).send(err);
                res.end();
            }else 
            {
                res.send('success');
                res.end();
                db.query(
                    "SELECT name, cell FROM employees WHERE emp_id = ?;" + 
                    "SELECT name, cell FROM employees WHERE emp_id = ?;",
                    [ parsed_data.generated_by, parsed_data.emp_id ],
                    ( err, result ) => {
            
                        if( err )
                        {
                            console.log( err );
                            res.send( err );
                            res.end();
                        }else
                        {
                            SendWhatsappNotification( null, null, "Hi " + result[0][0].name, parsed_data.ticket + " ticket has been removed from the employee " + result[1][0].name + ". \nGiven Date: " + parsed_data.generated_date, result[0][0].cell );
                            SendWhatsappNotification( null, null, "Hi " + result[1][0].name, result[0][0].name + " has reversed a " + ticket + " ticket. \nGiven Date: " + parsed_data.generated_date, result[1][0].cell );
                        }
            
                    }
                );
            }
        }
    );

} );

router.post('/acr/ticket/reply', ( req, res ) => {

    const { generated_date, ticket_id, reply, generated_by, emp_id } = req.body;

    db.query(
        "UPDATE emp_tickets SET reply = ?, reply_date = ?, reply_time = ? WHERE ticket_id = ?;",
        [ reply, new Date(), new Date().toTimeString(), ticket_id ],
        ( err ) => {
            if( err )
            {
                console.log( err )
                res.status(500).send(err);
                res.end();
            }else 
            {
                res.send('success');
                res.end();
                db.query(
                    "SELECT name, cell FROM employees WHERE emp_id = ?;" + 
                    "SELECT name, cell FROM employees WHERE emp_id = ?;",
                    [ generated_by, emp_id ],
                    ( err, result ) => {
            
                        if( err )
                        {
                            console.log( err );
                            res.send( err );
                            res.end();
                        }else
                        {
                            SendWhatsappNotification( null, null, "Hi " + result[0][0].name, "Your reply has been added", result[0][0].cell );
                            SendWhatsappNotification( null, null, "Hi " + result[1][0].name, result[0][0].name + " has added a reply '" + reply + "' on an issued ticket. \nGiven Date: " + new Date(generated_date).toDateString(), result[1][0].cell );
                        }
            
                    }
                );
            }
        }
    );

} );

router.get('/acr/self-assessment/categories', ( req, res ) => {
    db.query(
        "SELECT * FROM `tbl_acr_self_assessment_categories` WHERE status = 'active';",
        ( err, result ) => {
            if( err )
            {
                console.log( err );
                res.send( err );
                res.end();

            }else
            {
                res.send(result);
                res.end();
            }

        }
    );
} );

router.get('/acr/self-assessment/questions', ( req, res ) => {
    db.query(
        "SELECT * FROM `tbl_acr_self_assessment_questions` WHERE status = 'active';",
        ( err, result ) => {
            if( err )
            {
                console.log( err );
                res.send( err );
                res.end();

            }else
            {
                res.send(result);
                res.end();
            }

        }
    );
} );

router.post('/acr/self-assessment/tickets', ( req, res ) => {
    const { emp_id } = req.body;
    const month = new Date().getMonth() - 2;
    const year = new Date().getFullYear();
    db.query(
        "SELECT * FROM `emp_tickets` WHERE emp_id = ? AND status = 'isssued' AND ticket != 'green' AND MONTH(generated_date) >= ? AND YEAR(generated_date) = ?;",
        [emp_id, month, year],
        ( err, result ) => {
            if( err )
            {
                console.log( err );
                res.send( err );
                res.end();

            }else
            {
                res.send(result);
                res.end();
            }

        }
    );
} );

router.get('/acr/self-assessment/submissions/all', ( req, res ) => {
    db.query(
        "SELECT  \
        tbl_acr_self_assessment_submissions.*, \
        employees.emp_id, \
        employees.name, \
        companies.company_name, \
        emp_app_profile.emp_image, \
        designations.designation_name \
        FROM `tbl_acr_self_assessment_submissions` \
        LEFT OUTER JOIN employees ON tbl_acr_self_assessment_submissions.submit_by = employees.emp_id \
        LEFT OUTER JOIN companies ON employees.company_code = companies.company_code \
        LEFT OUTER JOIN designations ON employees.designation_code = designations.designation_code \
        LEFT OUTER JOIN emp_app_profile ON employees.emp_id = emp_app_profile.emp_id \
        ORDER BY tbl_acr_self_assessment_submissions.id DESC;",
        ( err, result ) => {
            if( err )
            {
                console.log( err );
                res.send( err );
                res.end();

            }else
            {
                res.send(result);
                res.end();
            }

        }
    );
} );

router.post('/acr/self-assessment/submission', ( req, res ) => {

    const { quarter, emp_id, formData, tickets } = req.body;
    const explainedTickets = JSON.parse(tickets);
    const d = new Date();
    db.query(
        "INSERT INTO `tbl_acr_self_assessment_submissions`(`quarter`, `year`, `submit_by`, `submit_date`, `submit_time`, `data`) VALUES (?,?,?,?,?,?);",
        [ quarter, d.getFullYear(), emp_id, new Date(), new Date().toTimeString(), formData ],
        ( err, rslt ) => {
            if( err )
            {
                console.log( err )
                res.status(500).send(err);
                res.end();
            }else 
            {
                db.query(
                    "SELECT name, cell FROM employees WHERE emp_id = ?;",
                    [ emp_id ],
                    ( err, result ) => {
            
                        if( err )
                        {
            
                            console.log( err );
                            res.send( err );
                            res.end();
            
                        }else
                        {
                            let limit = explainedTickets.length;
                            let count = [];
                            function addExplanation()
                            {
                                db.query(
                                    "INSERT INTO `tbl_acr_self_assessment_tickets_explanations`(`review_id`, `ticket_id`, `emp_id`, `explanation`, `explanation_date`, `explanation_time`) VALUES (?,?,?,?,?,?);",
                                    [rslt.insertId, explainedTickets[count.length].ticket_id, emp_id, explainedTickets[count.length].explanation, new Date(), new Date().toTimeString()],
                                    ( err ) => {
                                        if( err )
                                        {
                                            res.send('err');
                                            res.end();
                                        }else
                                        {
                                            if ( ( count.length + 1 ) === limit )
                                            {
                                                console.log( "self-assessment explanations added" );
                                                const message = result[0].name + " has submitted a self-assessment form.";
                                                const link = "/acr/self-assessment/details/" + rslt.insertId;
                                                administrativeNotifications( link, owner, message );
                                                SendWhatsappNotification( null, null, "Hi " + result[0].name, "Thank you for submitting self-assessment review.", result[0].cell );
                                                res.send('success');
                                                res.end();
                                            }else
                                            {
                                                count.push(1);
                                                addExplanation();
                                            }
                                        }
                                    }
                                );
                            }
                            addExplanation();
                        }
            
                    }
                );
            }
        }
    );
} );

router.post('/acr/growth-review/submission', ( req, res ) => {

    const { tasks, submit_by, emp_id, quarter } = req.body;
    const d = new Date();
    const assignedTasks = JSON.parse(tasks);
    const tasksDesc = [];
    assignedTasks.forEach(val => tasks.push(val.task));
    db.getConnection(
        ( err, connection ) => {
            connection.beginTransaction(
                ( err ) => {
                    if ( err )
                    {
                        connection.rollback(() => {console.log(err);connection.release();});
                    }else
                    {
                        connection.query(
                            "INSERT INTO `tbl_acr_growth_review`(`created_by`, `created_date`, `created_time`, `quarter`, `year`, `emp_id`) VALUES (?,?,?,?,?,?);",
                            [ submit_by, new Date(), new Date().toTimeString(), quarter, d.getFullYear(), emp_id ],
                            ( err, rslt ) => {
                                if( err )
                                {
                                    connection.rollback(() => {console.log(err);connection.release();});
                                    console.log( err );
                                    res.send( err );
                                    res.end();
                                }else
                                {
                                    const reviewID = rslt.insertId;
                                    let specLimit = assignedTasks.length;
                                    let speccount = [];
                                    function addItems()
                                    {
                                        connection.query(
                                            "INSERT INTO `tbl_acr_growth_review_items`(`review_id`, `emp_id`, `quarter`, `year`, `task`, `deadline`, `assigning_date`, `assigning_time`) VALUES (?,?,?,?,?,?,?,?);",
                                            [reviewID, emp_id, quarter, d.getFullYear(), assignedTasks[speccount.length].task, assignedTasks[speccount.length].deadline, new Date(), new Date().toTimeString()],
                                            ( err ) => {
                                                if( err )
                                                {
                                                    connection.rollback(() => {console.log(err);connection.release();});
                                                    res.send('err');
                                                    res.end();
                                                }else
                                                {
                                                    if ( ( speccount.length + 1 ) === specLimit )
                                                    {
                                                        console.log( "growth-review items added" );
                                                        connection.query(
                                                            "SELECT name, cell FROM employees WHERE emp_id = ?;" + 
                                                            "SELECT name, cell FROM employees WHERE emp_id = ?;",
                                                            [ submit_by, emp_id ],
                                                            ( err, rslt ) => {
                                                                if( err )
                                                                {
                                                                    connection.rollback(() => {console.log(err);connection.release();});
                                                                    console.log( err );
                                                                    res.send( err );
                                                                    res.end();
                                                                }else
                                                                {
                                                                    SendWhatsappNotification( null, null, "Hi " + rslt[1][0].name, rslt[0][0].name + " have assigned you some tasks:\n " + tasksDesc.join(', ') + ", Kindly check.", rslt[1][0].cell );
                                                                    SendWhatsappNotification( null, null, "Hi " + rslt[0][0].name, "Thank you for submitting growth review form, " + rslt[1][0].name + " has been notified.", rslt[0][0].cell );
                                                                    connection.commit((err) => {
                                                                        if ( err ) {
                                                                            connection.rollback(() => {console.log(err);connection.release();});
                                                                            res.send('err');
                                                                            res.end();
                                                                        }else
                                                                        {
                                                                            connection.release();
                                                                            res.send('success');
                                                                            res.end();
                                                                        }
                                                                    });
                                                                }
                                                            }
                                                        );
                                                    }else
                                                    {
                                                        speccount.push(1);
                                                        addItems();
                                                    }
                                                }
                                            }
                                        );
                                    }
                                    addItems();
                                }
                    
                            }
                        );
                    }
                }
            )
        }
    )
} );

router.post('/acr/growth-review/additional-tasks', ( req, res ) => {

    const { emp_id, tasks, submit_by } = req.body;
    const d = new Date();
    const assignedTasks = JSON.parse(tasks);
    const tasksList = [];
    assignedTasks.forEach(val => tasksList.push(val.task));
    db.getConnection(
        ( err, connection ) => {
            connection.beginTransaction(
                ( err ) => {
                    if ( err )
                    {
                        connection.rollback(() => {console.log(err);connection.release();});
                    }else
                    {
                        let specLimit = assignedTasks.length;
                        let speccount = [];
                        function addItems()
                        {
                            connection.query(
                                "INSERT INTO `tbl_acr_growth_review_items`(`category_id`, `assigned_by`, `emp_id`, `year`, `task`, `start_date`, `deadline`, `assigning_date`, `assigning_time`) VALUES (?,?,?,?,?,?,?,?,?);",
                                [assignedTasks[speccount.length].category == null || assignedTasks[speccount.length].category == 'null' ? null : assignedTasks[speccount.length].category, submit_by, emp_id, d.getFullYear(), assignedTasks[speccount.length].task, assignedTasks[speccount.length].start_date, assignedTasks[speccount.length].deadline, new Date(), new Date().toTimeString()],
                                ( err ) => {
                                    if( err )
                                    {
                                        connection.rollback(() => {console.log(err);connection.release();});
                                        res.send('err');
                                        res.end();
                                    }else
                                    {
                                        if ( ( speccount.length + 1 ) === specLimit )
                                        {
                                            console.log( "growth-review items added" );
                                            connection.query(
                                                "SELECT name, cell FROM employees WHERE emp_id = ?;" + 
                                                "SELECT name, cell FROM employees WHERE emp_id = ?;",
                                                [ submit_by, emp_id ],
                                                ( err, rslt ) => {
                                                    if( err )
                                                    {
                                                        connection.rollback(() => {console.log(err);connection.release();});
                                                        console.log( err );
                                                        res.send( err );
                                                        res.end();
                                                    }else
                                                    {
                                                        SendWhatsappNotification( null, null, "Hi " + rslt[1][0].name, rslt[0][0].name + " have assigned you some tasks: \n" + tasksList.join('\n') + ", Kindly check.", rslt[1][0].cell );
                                                        SendWhatsappNotification( null, null, "Hi " + rslt[0][0].name, "Your tasks has been assigned to " + rslt[1][0].name + ".", rslt[0][0].cell );
                                                        connection.commit((err) => {
                                                            if ( err ) {
                                                                connection.rollback(() => {console.log(err);connection.release();});
                                                                res.send('err');
                                                                res.end();
                                                            }else
                                                            {
                                                                connection.release();
                                                                res.send('success');
                                                                res.end();
                                                            }
                                                        });
                                                    }
                                                }
                                            );
                                        }else
                                        {
                                            speccount.push(1);
                                            addItems();
                                        }
                                    }
                                }
                            );
                        }
                        addItems();
                    }
                }
            )
        }
    )
} );

router.post('/acr/growth-review/individual-tasks', ( req, res ) => {

    const { category_id, task, submit_by, emp_id } = req.body;
    const d = new Date();
    const assignedTasks = JSON.parse(task);
    db.query(
        "INSERT INTO `tbl_acr_growth_review_items`(`category_id`, `assigned_by`, `emp_id`, `year`, `task`, `start_date`, `deadline`, `assigning_date`, `assigning_time`) VALUES (?,?,?,?,?,?,?,?,?);",
        [category_id == null || category_id == 'null' ? null : category_id, submit_by, emp_id, d.getFullYear(), assignedTasks.task, assignedTasks.start_date, assignedTasks.deadline, new Date(), new Date().toTimeString()],
        ( err ) => {
            if( err )
            {
                res.send('err');
                res.end();
            }else
            {
                db.query(
                    "SELECT name, cell FROM employees WHERE emp_id = ?;" + 
                    "SELECT name, cell FROM employees WHERE emp_id = ?;",
                    [ submit_by, emp_id ],
                    ( err, rslt ) => {
                        if( err )
                        {
                            console.log( err );
                            res.send( err );
                            res.end();
                        }else
                        {
                            SendWhatsappNotification( null, null, "Hi " + rslt[1][0].name, rslt[0][0].name + " have assigned you a task, Kindly check.", rslt[1][0].cell );
                            SendWhatsappNotification( null, null, "Hi " + rslt[0][0].name, "Your task has been assigned to " + rslt[1][0].name + ".", rslt[0][0].cell );
                            res.send('success');
                            res.end();
                        }
                    }
                );
            }
        }
    );
} );

router.post('/acr/self-assessment/data', ( req, res ) => {
    const { empID } = req.body;
    const d = new Date();
    db.query(
        "SELECT * FROM `tbl_acr_self_assessment_submissions` WHERE submit_by = ? AND year = ? AND status != 'rejected';",
        [ empID, d.getFullYear() ],
        ( err, result ) => {
            if( err )
            {
                console.log( err );
                res.send( err );
                res.end();

            }else
            {
                res.send(result);
                res.end();
            }

        }
    );
} );

router.post('/acr/growth-review/data', ( req, res ) => {
    const { empID } = req.body;
    const d = new Date();
    db.query(
        "SELECT tbl_acr_growth_review.*, employees.name FROM `tbl_acr_growth_review` LEFT OUTER JOIN employees ON tbl_acr_growth_review.emp_id = employees.emp_id WHERE tbl_acr_growth_review.emp_id = ? AND tbl_acr_growth_review.status = ? AND tbl_acr_growth_review.year = ?;",
        [ empID, 'submitted', d.getFullYear()],
        ( err, result ) => {
            if( err )
            {
                console.log( err );
                res.send( err );
                res.end();

            }else
            {
                res.send(result);
                res.end();
            }

        }
    );
} );

router.post('/acr/growth-review/emp_data', ( req, res ) => {
    const { empID } = req.body;
    const d = new Date();
    db.query(
        "SELECT * FROM `tbl_acr_growth_review` WHERE emp_id = ? AND status = ? AND year = ?;",
        [ empID, 'submitted', d.getFullYear()],
        ( err, result ) => {
            if( err )
            {
                console.log( err );
                res.send( err );
                res.end();

            }else
            {
                res.send(result);
                res.end();
            }

        }
    );
} );

router.post('/acr/self-assessment/details', ( req, res ) => {
    const { id } = req.body;
    db.query(
        "SELECT  \
        tbl_acr_self_assessment_submissions.*, \
        employees.emp_id, \
        employees.name, \
        companies.company_name, \
        emp_app_profile.emp_image, \
        designations.designation_name \
        FROM `tbl_acr_self_assessment_submissions` \
        LEFT OUTER JOIN employees ON tbl_acr_self_assessment_submissions.submit_by = employees.emp_id \
        LEFT OUTER JOIN companies ON employees.company_code = companies.company_code \
        LEFT OUTER JOIN designations ON employees.designation_code = designations.designation_code \
        LEFT OUTER JOIN emp_app_profile ON employees.emp_id = emp_app_profile.emp_id \
        WHERE tbl_acr_self_assessment_submissions.id = ? \
        ORDER BY tbl_acr_self_assessment_submissions.id DESC;" +
        "SELECT \
        tbl_acr_self_assessment_tickets_explanations.*, \
        emp_tickets.remarks, \
        emp_tickets.ticket \
        FROM `tbl_acr_self_assessment_tickets_explanations` \
        LEFT OUTER JOIN emp_tickets ON tbl_acr_self_assessment_tickets_explanations.ticket_id = emp_tickets.ticket_id \
        WHERE tbl_acr_self_assessment_tickets_explanations.review_id = ?;",
        [ id, id ],
        ( err, result ) => {
            if( err )
            {
                console.log( err );
                res.send( err );
                res.end();

            }else
            {
                res.send(result);
                res.end();
            }

        }
    );
} );

router.post('/acr/growth-review/details', ( req, res ) => {
    const { emp_id } = req.body;
    db.query(
        "SELECT tbl_acr_growth_review_items.*, assigned.name AS assigned_emp_name, assigned_desg.designation_name, assigned_to_profile.emp_image AS assigned_to_profile_image, assigned_by_profile.emp_image AS assigned_by_profile_image FROM `tbl_acr_growth_review_items` LEFT OUTER JOIN employees assigned ON tbl_acr_growth_review_items.assigned_by = assigned.emp_id LEFT OUTER JOIN designations assigned_desg ON assigned.designation_code = assigned_desg.designation_code LEFT OUTER JOIN emp_app_profile assigned_to_profile ON tbl_acr_growth_review_items.emp_id = assigned_to_profile.emp_id LEFT OUTER JOIN emp_app_profile assigned_by_profile ON tbl_acr_growth_review_items.assigned_by = assigned_by_profile.emp_id LEFT OUTER JOIN employees emp ON tbl_acr_growth_review_items.emp_id = emp.emp_id WHERE tbl_acr_growth_review_items.emp_id = ? ORDER BY id DESC;",
        [ emp_id ],
        ( err, result ) => {
            if( err )
            {
                console.log( err );
                res.send( err );
                res.end();

            }else
            {
                res.send(result);
                res.end();
            }

        }
    );
} );

router.post('/acr/growth-review/category/add', ( req, res ) => {
    const { category, emp_id, created_by } = req.body;
    db.query(
        "INSERT INTO `tbl_acr_growth_review_categories`(`category`, `created_by`, `created_date`, `created_time`, `emp_id`) VALUES (?,?,?,?,?)",
        [ category, created_by, new Date(), new Date().toTimeString(), emp_id ],
        ( err ) => {
            if( err )
            {
                console.log( err );
                res.send( err );
                res.end();

            }else
            {
                res.send('success');
                res.end();
            }

        }
    );
} );

router.post('/acr/growth-review/category/update', ( req, res ) => {
    const { category, id } = req.body;
    db.query(
        "UPDATE `tbl_acr_growth_review_categories` SET category = ? WHERE id = ?;",
        [ category, id ],
        ( err ) => {
            if( err )
            {
                console.log( err );
                res.send( err );
                res.end();

            }else
            {
                res.send('success');
                res.end();
            }

        }
    );
} );

router.post('/acr/growth-review/categories', ( req, res ) => {
    const { emp_id } = req.body;
    db.query(
        "SELECT * FROM tbl_acr_growth_review_categories WHERE emp_id = ?",
        [ emp_id ],
        ( err, rslt ) => {
            if( err )
            {
                console.log( err );
                res.send( err );
                res.end();

            }else
            {
                res.send(rslt);
                res.end();
            }

        }
    );
} );

router.post('/acr/growth-review/accept/task', ( req, res ) => {
    const { id } = req.body;
    db.query(
        "UPDATE `tbl_acr_growth_review_items` SET accepted = ?, accepted_date = ?, accepted_time = ? WHERE id = ?;" +
        "SELECT assigned_by, emp_id FROM tbl_acr_growth_review_items WHERE id = ?;",
        [ 1, new Date(), new Date().toTimeString(), id, id ],
        ( err, result ) => {
            if( err )
            {
                console.log( err );
                res.send( err );
                res.end();

            }else
            {
                db.query(
                    "SELECT name, cell FROM employees WHERE emp_id = ?;" + 
                    "SELECT name, cell FROM employees WHERE emp_id = ?;",
                    [ result[1][0].assigned_by, result[1][0].emp_id ],
                    ( err, rslt ) => {
                        if( err )
                        {
                            console.log( err );
                            res.send( err );
                            res.end();
                        }else
                        {
                            SendWhatsappNotification( null, null, "Hi " + rslt[0][0].name, rslt[1][0].name + " has accepted your assigned tasks.", rslt[0][0].cell );
                            SendWhatsappNotification( null, null, "Hi " + rslt[1][0].name, "You have accepted the assigned tasks.", rslt[1][0].cell );
                        }
                    }
                );
                res.send('success');
                res.end();
            }

        }
    );
} );

router.post('/acr/growth-review/reject/task', ( req, res ) => {
    const { id, remarks } = req.body;
    db.query(
        "UPDATE `tbl_acr_growth_review_items` SET remarks = ?, accepted = ?, accepted_date = ?, accepted_time = ? WHERE id = ?;" +
        "SELECT assigned_by, emp_id FROM tbl_acr_growth_review_items WHERE id = ?;",
        [ remarks, 0, new Date(), new Date().toTimeString(), id, id ],
        ( err, result ) => {
            if( err )
            {
                console.log( err );
                res.send( err );
                res.end();

            }else
            {
                db.query(
                    "SELECT name, cell FROM employees WHERE emp_id = ?;" + 
                    "SELECT name, cell FROM employees WHERE emp_id = ?;",
                    [ result[1][0].assigned_by, result[1][0].emp_id ],
                    ( err, rslt ) => {
                        if( err )
                        {
                            console.log( err );
                            res.send( err );
                            res.end();
                        }else
                        {
                            SendWhatsappNotification( null, null, "Hi " + rslt[0][0].name, rslt[1][0].name + " has rejected your assigned tasks.", rslt[0][0].cell );
                            SendWhatsappNotification( null, null, "Hi " + rslt[1][0].name, "You have rejected the assigned tasks.", rslt[1][0].cell );
                        }
                    }
                );
                res.send('success');
                res.end();
            }

        }
    );
} );

router.post('/acr/growth-review/task/incomplete', ( req, res ) => {
    const { id, remarks, confirmed } = req.body;
    if ( confirmed == 'null' || confirmed == null ) {
        db.query(
            "UPDATE `tbl_acr_growth_review_items` SET completed = ?, completion_date = ?, completion_time = ?, remarks = ? WHERE id = ?;" +
            "SELECT assigned_by, emp_id FROM tbl_acr_growth_review_items WHERE id = ?;",
            [ 0, new Date(), new Date().toTimeString(), remarks, id, id ],
            ( err, result ) => {
                if( err )
                {
                    console.log( err );
                    res.send( err );
                    res.end();
    
                }else
                {
                    db.query(
                        "SELECT name, cell FROM employees WHERE emp_id = ?;" + 
                        "SELECT name, cell FROM employees WHERE emp_id = ?;",
                        [ result[1][0].assigned_by, result[1][0].emp_id ],
                        ( err, rslt ) => {
                            if( err )
                            {
                                console.log( err );
                                res.send( err );
                                res.end();
                            }else
                            {
                                SendWhatsappNotification( null, null, "Hi " + rslt[0][0].name, rslt[1][0].name + " could not be able to complete your assigned tasks.", rslt[0][0].cell );
                                SendWhatsappNotification( null, null, "Hi " + rslt[1][0].name, "You have set the status incomplete.", rslt[1][0].cell );
                            }
                        }
                    );
                    res.send('success');
                    res.end();
                }
    
            }
        );
    }else {
        console.log(confirmed);
        db.query(
            "UPDATE `tbl_acr_growth_review_items` SET confirmed = ?, confirmed_date = ?, confirmed_time = ?, confirmed_remarks = ? WHERE id = ?;" +
            "SELECT assigned_by, emp_id FROM tbl_acr_growth_review_items WHERE id = ?;",
            [ confirmed, confirmed == 'null' || confirmed == null ? null : new Date(), confirmed == 'null' || confirmed == null ? null : new Date().toTimeString(), remarks, id, id ],
            ( err, result ) => {
                if( err )
                {
                    console.log( err );
                    res.send( err );
                    res.end();
    
                }else
                {
                    db.query(
                        "SELECT name, cell FROM employees WHERE emp_id = ?;" + 
                        "SELECT name, cell FROM employees WHERE emp_id = ?;",
                        [ result[1][0].assigned_by, result[1][0].emp_id ],
                        ( err, rslt ) => {
                            if( err )
                            {
                                console.log( err );
                                res.send( err );
                                res.end();
                            }else
                            {
                                SendWhatsappNotification( null, null, "Hi " + rslt[0][0].name, "You have declined the completed tasks", rslt[0][0].cell );
                                SendWhatsappNotification( null, null, "Hi " + rslt[1][0].name, rslt[0][0].name + " has declined your completed tasks.", rslt[1][0].cell );
                            }
                        }
                    );
                    res.send('success');
                    res.end();
                }
    
            }
        );
    }
} );

router.post('/acr/growth-review/task/complete', ( req, res ) => {
    const { id, remarks, confirmed } = req.body;
    if ( confirmed == 'null' || confirmed == null ) {
        db.query(
            "UPDATE `tbl_acr_growth_review_items` SET completed = ?, completion_date = ?, completion_time = ?, remarks = ? WHERE id = ?;" +
            "SELECT assigned_by, emp_id FROM tbl_acr_growth_review_items WHERE id = ?;",
            [ id, new Date(), new Date().toTimeString(), remarks, id, id ],
            ( err, result ) => {
                if( err )
                {
                    console.log( err );
                    res.send( err );
                    res.end();
    
                }else
                {
                    db.query(
                        "SELECT name, cell FROM employees WHERE emp_id = ?;" + 
                        "SELECT name, cell FROM employees WHERE emp_id = ?;",
                        [ result[1][0].assigned_by, result[1][0].emp_id ],
                        ( err, rslt ) => {
                            if( err )
                            {
                                console.log( err );
                                res.send( err );
                                res.end();
                            }else
                            {
                                SendWhatsappNotification( null, null, "Hi " + rslt[0][0].name, rslt[1][0].name + " has completed your assigned tasks.", rslt[0][0].cell );
                                SendWhatsappNotification( null, null, "Hi " + rslt[1][0].name, "You have completed the assigned tasks.", rslt[1][0].cell );
                            }
                        }
                    );
                    res.send('success');
                    res.end();
                }
    
            }
        );
    }else {
        db.query(
            "UPDATE `tbl_acr_growth_review_items` SET confirmed = ?, confirmed_date = ?, confirmed_time = ?, confirmed_remarks = ? WHERE id = ?;" +
            "SELECT assigned_by, emp_id FROM tbl_acr_growth_review_items WHERE id = ?;",
            [ confirmed, confirmed == 'null' || confirmed == null ? null : new Date(), confirmed == 'null' || confirmed == null ? null : new Date().toTimeString(), remarks, id, id ],
            ( err, result ) => {
                if( err )
                {
                    console.log( err );
                    res.send( err );
                    res.end();
    
                }else
                {
                    db.query(
                        "SELECT name, cell FROM employees WHERE emp_id = ?;" + 
                        "SELECT name, cell FROM employees WHERE emp_id = ?;",
                        [ result[1][0].assigned_by, result[1][0].emp_id ],
                        ( err, rslt ) => {
                            if( err )
                            {
                                console.log( err );
                                res.send( err );
                                res.end();
                            }else
                            {
                                SendWhatsappNotification( null, null, "Hi " + rslt[0][0].name, "You have confirmed the tasks", rslt[0][0].cell );
                                SendWhatsappNotification( null, null, "Hi " + rslt[1][0].name, rslt[0][0].name + " has confirmed the tasks.", rslt[1][0].cell );
                            }
                        }
                    );
                    res.send('success');
                    res.end();
                }
    
            }
        );
    }
} );

router.post('/acr/peer-review/data', ( req, res ) => {
    const { empID, review_by } = req.body;
    const d = new Date();
    db.query(
        "SELECT tbl_acr_peer_reviews.*, employees.name FROM `tbl_acr_peer_reviews` LEFT OUTER JOIN employees ON tbl_acr_peer_reviews.reviewed_emp = employees.emp_id WHERE tbl_acr_peer_reviews.reviewed_emp = ? AND tbl_acr_peer_reviews.review_by = ? AND tbl_acr_peer_reviews.status = ? AND tbl_acr_peer_reviews.year = ?;",
        [ empID, review_by, 'submitted', d.getFullYear()],
        ( err, result ) => {
            if( err )
            {
                console.log( err );
                res.send( err );
                res.end();

            }else
            {
                res.send(result);
                res.end();
            }

        }
    );
} );

router.post('/acr/peer-review/submission', ( req, res ) => {

    const { data, submit_by, emp_id, quarter } = req.body;
    const d = new Date();
    db.getConnection(
        ( err, connection ) => {
            connection.beginTransaction(
                ( err ) => {
                    if ( err )
                    {
                        connection.rollback(() => {console.log(err);connection.release();});
                    }else
                    {
                        connection.query(
                            "INSERT INTO `tbl_acr_peer_reviews`(`review_by`, `review_date`, `review_time`, `quarter`, `year`, `reviewed_emp`, `data`) VALUES (?,?,?,?,?,?,?);",
                            [ submit_by, new Date(), new Date().toTimeString(), quarter, d.getFullYear(), emp_id, data ],
                            ( err, result ) => {
                                if( err )
                                {
                                    connection.rollback(() => {console.log(err);connection.release();});
                                    res.send( err );
                                    res.end();
                                }else
                                {
                                    connection.query(
                                        "UPDATE tbl_acr_peer_relations SET last_submitted_in_quarter = ? WHERE first_person = ? AND last_person = ?;",
                                        [ quarter, submit_by, emp_id ],
                                        ( err ) => {
                                            if( err )
                                            {
                                                connection.rollback(() => {console.log(err);connection.release();});
                                                console.log( err );
                                                res.send( err );
                                                res.end();
                                            }else
                                            {
                                                connection.query(
                                                    "SELECT name, cell FROM employees WHERE emp_id = ?;",
                                                    [ submit_by ],
                                                    ( err, rslt ) => {
                                                        if( err )
                                                        {
                                                            connection.rollback(() => {console.log(err);connection.release();});
                                                            console.log( err );
                                                            res.send( err );
                                                            res.end();
                                                        }else
                                                        {
                                                            const message = rslt[0].name + " has submitted a peer-review form.";
                                                            const link = "/acr/peer-review/details/" + result.insertId;
                                                            administrativeNotifications( link, owner, message );
                                                            SendWhatsappNotification( null, null, "Hi " + rslt[0].name, "Thank you for submitting peer review form. ", rslt[0].cell );
                                                            connection.commit((err) => {
                                                                if ( err ) {
                                                                    connection.rollback(() => {console.log(err);connection.release();});
                                                                    res.send('err');
                                                                    res.end();
                                                                }else
                                                                {
                                                                    connection.release();
                                                                    res.send('success');
                                                                    res.end();
                                                                }
                                                            });
                                                        }
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
            )
        }
    )
} );

router.post('/acr/peer-review/details', ( req, res ) => {
    const { id } = req.body;
    db.query(
        "SELECT  \
        tbl_acr_peer_reviews.*, \
        employees.emp_id, \
        employees.name, \
        companies.company_name, \
        emp_app_profile.emp_image, \
        designations.designation_name \
        FROM `tbl_acr_peer_reviews` \
        LEFT OUTER JOIN employees ON tbl_acr_peer_reviews.review_by = employees.emp_id \
        LEFT OUTER JOIN companies ON employees.company_code = companies.company_code \
        LEFT OUTER JOIN designations ON employees.designation_code = designations.designation_code \
        LEFT OUTER JOIN emp_app_profile ON employees.emp_id = emp_app_profile.emp_id \
        WHERE tbl_acr_peer_reviews.id = ? \
        ORDER BY tbl_acr_peer_reviews.id DESC;",
        [ id ],
        ( err, result ) => {
            if( err )
            {
                console.log( err );
                res.send( err );
                res.end();

            }else
            {
                res.send(result);
                res.end();
            }

        }
    );
} );

router.post('/hr/employee/update/details', ( req, res ) => {

    const { 
        emp_id, marital_status, name, father_name, date_of_birth, place_of_birth, residential_address, permanent_address, 
        gender, date_of_join, salary, cell, landline, emp_status, emergency_person_name, emergency_person_number, email, 
        additional_off_monday, additional_off_tuesday, additional_off_wednesday, additional_off_thursday, additional_off_friday, 
        additional_off_saturday, location_name, department_name, designation_name, time_in, time_out, type, grade_code, cnic, 
        cnic_date_of_issue, cnic_date_of_expiry, attendance_enable, UploadedEmpImageName, 
        UploadedCNICFrontName, UploadedCNICBackName, UploadedCVName, UploadedPrfAddressName 
    } = req.body;
    const Arr = [];

    if ( req.files )
    {
        const { UploadedEmpImage, UploadedCNICFront, UploadedCNICBack, UploadedCV, UploadedPrfAddress } = req.files;
        if ( UploadedEmpImage )
        {
            UploadedEmpImage.mv('client/images/employees/' + UploadedEmpImageName)
        }
        if ( UploadedCNICFront )
        {
            UploadedCNICFront.mv('client/images/documents/cnic/front/' + UploadedCNICFrontName)
        }
        if ( UploadedCNICBack )
        {
            UploadedCNICBack.mv('client/images/documents/cnic/back/' + UploadedCNICBackName)
        }
        if ( UploadedCV )
        {
            UploadedCV.mv('client/images/documents/cv/' + UploadedCVName)
        }
        if ( UploadedPrfAddress )
        {
            UploadedPrfAddress.mv('client/images/documents/address/' + UploadedPrfAddressName)
        }
    }

    if ( additional_off_monday === 'true' || additional_off_monday === true )
    {
        Arr.push('Monday');
    }
    if ( additional_off_tuesday === 'true' || additional_off_tuesday === true )
    {
        Arr.push('Tuesday');
    }
    if ( additional_off_wednesday === 'true' || additional_off_wednesday === true )
    {
        Arr.push('Wednesday');
    }
    if ( additional_off_thursday === 'true' || additional_off_thursday === true )
    {
        Arr.push('Thursday');
    }
    if ( additional_off_friday === 'true' || additional_off_friday === true )
    {
        Arr.push('Friday');
    }
    if ( additional_off_saturday === 'true' || additional_off_saturday === true )
    {
        Arr.push('Saturday');
    }

    db.query(
        "UPDATE `employees` SET `name`=?,`father_name`=?,`date_of_birth`=?,`place_of_birth`=?, \
        `residential_address`=?,`permanent_address`=?,`emergency_person_name`=?,`emergency_person_number`=?,`landline`=?, \
        `cell`=?,`gender`=?,`time_in`=?,`time_out`=?,`salary`=?,`date_of_join`=?, \
        `additional_off`=?,`emp_status`=?,`email`=?,`marital_status`=?, \
        `cnic`=?,`cnic_date_of_issue`=?,`cnic_date_of_expiry`=?,`location_code`=?, \
        `department_code`=?,`designation_code`=?,`type`=?,`grade_code`=? WHERE `emp_id`=?;" +
        "UPDATE emp_props SET attendance_enable = ? WHERE emp_id = ?;",
        [ 
            name, father_name, date_of_birth, place_of_birth, residential_address, permanent_address, emergency_person_name, emergency_person_number, landline, cell, 
            gender, time_in, time_out, salary, date_of_join, JSON.stringify(Arr), emp_status, email, marital_status, cnic, cnic_date_of_issue, cnic_date_of_expiry, location_name, 
            department_name, designation_name, type, grade_code, emp_id,
            attendance_enable, emp_id 
        ],
        ( err ) => {

            if( err )
            {

                console.log( err )
                res.status(500).send(err);
                res.end();

            }else 
            {

                res.send('success');
                res.end();

            }

        }
    );

} );

router.post('/employees/tickets/fetch/issued', ( req, res ) => {

    const { emp_id } = req.body;

    db.query(
        "SELECT  \
        emp_tickets.*,  \
        issued_emp.emp_id AS issued_emp_id,  \
        issued_to_emp.emp_id AS issued_to_emp_id,  \
        issued_emp.name AS issued_emp,  \
        issued_to_emp.name AS issued_to_emp,  \
        designations.designation_name  \
        FROM `emp_tickets`  \
        LEFT OUTER JOIN employees issued_emp ON issued_emp.emp_id = emp_tickets.generated_by \
        LEFT OUTER JOIN employees issued_to_emp ON issued_to_emp.emp_id = emp_tickets.emp_id \
        LEFT OUTER JOIN employees ON employees.emp_id = emp_tickets.emp_id  \
        LEFT OUTER JOIN designations ON employees.designation_code = designations.designation_code  \
        WHERE emp_tickets.generated_by = ? OR emp_tickets.emp_id = ?  \
        ORDER BY ticket_id DESC;",
        [ emp_id, emp_id ],
        ( err, rslt ) => {

            if( err )
            {

                console.log( err )
                res.status(500).send(err);
                res.end();

            }else 
            {

                res.send(rslt);
                res.end();

            }

        }
    );

} );

router.get('/acr/performance/tickets/all', ( req, res ) => {
    db.query(
        "SELECT  \
        emp_tickets.*,  \
        issued_emp.emp_id AS issued_emp_id,  \
        issued_to_emp.emp_id AS issued_to_emp_id,  \
        issued_emp.name AS issued_emp,  \
        issued_to_emp.name AS issued_to_emp,  \
        designations.designation_name  \
        FROM `emp_tickets`  \
        LEFT OUTER JOIN employees issued_emp ON issued_emp.emp_id = emp_tickets.generated_by \
        LEFT OUTER JOIN employees issued_to_emp ON issued_to_emp.emp_id = emp_tickets.emp_id \
        LEFT OUTER JOIN employees ON employees.emp_id = emp_tickets.emp_id  \
        LEFT OUTER JOIN designations ON employees.designation_code = designations.designation_code  \
        ORDER BY ticket_id DESC;",
        ( err, rslt ) => {
            if( err )
            {
                console.log( err )
                res.status(500).send(err);
                res.end();
            }else 
            {
                res.send(rslt);
                res.end();
            }
        }
    );
} );

module.exports = router;