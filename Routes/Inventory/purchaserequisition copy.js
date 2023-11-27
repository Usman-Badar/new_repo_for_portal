const express = require('express');
const router = express.Router();
const db = require('../../db/connection');
const fs = require('fs');
const moment = require('moment');

router.post('/purchaserequision', ( req, res ) => {

    const { Specifications, EmpInfo, senderInfo } = req.body;

    let specification = JSON.parse( Specifications );


    // calculating total
    let total = 0.00;
    for ( let x = 0; x < specification.length; x++ )
    {
        total = total + specification[x].amount;
    }
    let empInfo = JSON.parse( EmpInfo );
    let sInfo = JSON.parse( senderInfo );
    let isSender = true;
    if ( sInfo === null || sInfo === 'null' )
    {
        isSender = false;
    }
    
    const d = new Date();
    let time = d.toTimeString();

    db.getConnection(
        ( err, connection ) => {

            if ( err )
            {
  
                res.status(503).send(err);
                res.end();

            }else
            {
                connection.query(
                    "INSERT INTO `invtry_purchase_requests`(`location_code`, `company_code`, `request_by`, `request_for`, `request_date`, `request_time`, `status`, `total`) VALUES (?,?,?,?,?,?,?,?)",
                    [ empInfo.location.location_code, empInfo.company.company_code, isSender ? sInfo.emp_id : empInfo.emp_id, empInfo.emp_id, d, time, 'Sent', total ],
                    ( err, rslt ) => {
                        
                        if( err )
                        {
            
                            res.status(500).send(err);
                            res.end();
                            connection.release();
            
                        }else 
                        {

                            connection.query(
                                "SELECT pr_id FROM invtry_purchase_requests WHERE location_code = ? AND request_by = ? AND request_date = ? AND request_time = ? AND status = ?",
                                [ empInfo.location.location_code, isSender ? sInfo.emp_id : empInfo.emp_id, d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate(), time.split('GMT')[0].substring(0,8), 'Sent' ],
                                ( err, rslt ) => {
                                    
                                    if( err )
                                    {
                                        
                                        res.status(500).send(err);
                                        res.end();
                                        connection.release();
                                        
                                    }else 
                                    {
                                        
                                        if ( specification )
                                        {
                                            for( let x = 0; x < specification.length; x++ )
                                            {
                                                connection.query(
                                                    "INSERT INTO `invtry_purchase_request_specifications`(`pr_id`, `description`, `reason`, `price`, `quantity`, `amount`) VALUES (?,?,?,?,?,?)",
                                                    [ rslt[0].pr_id, specification[x].description, specification[x].reason, parseFloat(specification[x].price), parseInt(specification[x].quantity), parseFloat(specification[x].amount) ],
                                                    ( err, rslt ) => {
                                            
                                                        if( err )
                                                        {
                                            
                                                            res.status(500).send(err);
                                                            res.end();
                                                            connection.release();
                                            
                                                        }
                                            
                                                    }
                                                );
    
                                                if ( ( x + 1 ) === specification.length )
                                                {

                                                    // let spec = `<></>`;
                                                    // let spec2 = `<></>`;
                                                    // for ( let x = 0; x < specification.length; x++ )
                                                    // {
                                                    //     spec += 
                                                    //     `
                                                    //     <div className="PR_printUI_Grid">
                                                    //         <div><p>${specification[x].Sno}</p></div>
                                                    //         <div><p>${specification[x].desc}</p></div>
                                                    //         <div><p>${specification[x].Quantity}</p></div>
                                                    //         <div><p>${specification[x].EstimatedCost}</p></div>
                                                    //         <div><p>${specification[x].TotalCost}</p></div>
                                                    //     </div>
                                                    //     `

                                                    //     spec2 += 
                                                    //     `
                                                    //     <div className="PR_printUI_Grid1">
                                                    //         <div><p>${specification[x].Sno}</p></div>
                                                    //         <div className="text-justify px-2"><p>${specification[x].reason}</p></div>
                                                    //     </div>
                                                    //     `
                                                    // }

                                                    res.send( 'success' );
                                                    connection.release();

                                                }
                                            }
                                        }
                        
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

router.post('/getinvtryemployees', ( req, res ) => {

    const { key } = req.body;

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
                    emp_app_profile.*, \
                    companies.*, \
                    locations.*, \
                    designations.*, \
                    departments.* \
                    FROM employees \
                    LEFT OUTER JOIN emp_app_profile ON employees.emp_id = emp_app_profile.emp_id \
                    LEFT OUTER JOIN designations ON employees.designation_code = designations.designation_code \
                    LEFT OUTER JOIN departments ON designations.department_code = departments.department_code \
                    LEFT OUTER JOIN companies ON employees.company_code = companies.company_code \
                    LEFT OUTER JOIN locations ON employees.location_code = locations.location_code \
                    WHERE employees.name LIKE '%" + key + "%'",
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

router.post('/getemployeeprrequests', ( req, res ) => {

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
                    "SELECT invtry_purchase_requests.*, \
                    employees.*, \
                    invtry_purchase_request_specifications.*  \
                    FROM invtry_purchase_requests \
                    LEFT OUTER JOIN invtry_purchase_request_specifications ON invtry_purchase_requests.pr_id = invtry_purchase_request_specifications.pr_id \
                    LEFT OUTER JOIN employees ON invtry_purchase_requests.request_by = employees.emp_id \
                    WHERE invtry_purchase_requests.request_by = " + parseInt( empID ) + " OR invtry_purchase_requests.request_for = " + parseInt( empID ) + " ORDER BY invtry_purchase_requests.pr_id DESC;" +
                    "SELECT invtry_purchase_requests.*, \
                    employees.*, \
                    invtry_purchase_request_specifications.*  \
                    FROM invtry_purchase_requests \
                    LEFT OUTER JOIN invtry_purchase_request_specifications ON invtry_purchase_requests.pr_id = invtry_purchase_request_specifications.pr_id \
                    LEFT OUTER JOIN employees ON invtry_purchase_requests.request_for = employees.emp_id \
                    WHERE invtry_purchase_requests.request_by = " + parseInt( empID ) + " OR invtry_purchase_requests.request_for = " + parseInt( empID ) + " ORDER BY invtry_purchase_requests.pr_id DESC",
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

router.post('/getallrequests', ( req, res ) => {

    const { colunms, approvalLimit } = req.body;

    let q = "SELECT DISTINCT \
    employees.emp_id, \
    employees.name, \
    locations.location_name,  \
    companies.company_name, \
    departments.department_name, \
    designations.designation_name,  \
    emp_app_profile.emp_image,  \
    invtry_purchase_requests.*, \
    invtry_purchase_requests.location_code as pr_location, \
    invtry_purchase_requests.status as status \
    FROM employees  \
    LEFT OUTER JOIN companies ON employees.company_code = companies.company_code  \
    LEFT OUTER JOIN departments ON employees.department_code = departments.department_code  \
    LEFT OUTER JOIN locations ON employees.location_code = locations.location_code  \
    LEFT OUTER JOIN designations ON employees.designation_code = designations.designation_code  \
    RIGHT OUTER JOIN emp_app_profile ON employees.emp_id = emp_app_profile.emp_id  \
    RIGHT OUTER JOIN invtry_purchase_requests ON employees.emp_id = invtry_purchase_requests.request_for";
    if ( colunms )
    {
        let acc = colunms.split(',');
        
        q = q.concat(' WHERE ', "invtry_purchase_requests.status LIKE '%" + acc[0] + "%'");
        for ( let x = 0; x < acc.length; x++ )
        {
            q = q.concat(" OR ", "invtry_purchase_requests.status LIKE '%" + acc[x] + "%'");
        }
    }
    

    if ( approvalLimit === '>150000' )
    {
        if ( !q.includes('WHERE') )
        {
            q = q.concat(' WHERE ');
        }
        q = q.concat(" AND invtry_purchase_requests.total < 150000 ");
    }else if ( approvalLimit === '^150000' )
    {
        if ( !q.includes('WHERE') )
        {
            q = q.concat(' WHERE ');
        }
        q = q.concat(" AND invtry_purchase_requests.total > 150000 ");
    }
    
    q = q.concat(" GROUP BY employees.emp_id ORDER BY invtry_purchase_requests.pr_id DESC;");

    console.log( q );

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

router.post('/getthatrequestfulldetails', ( req, res ) => {

    const { prID } = req.body;

    db.getConnection(
        ( err, connection ) => {

            if ( err )
            {
                res.status(503).send(err);
                res.end();

            }else
            {
                connection.query(
                    "SELECT DISTINCT \
                    emp_for.name as emp_for_name, \
                    sender.name as sender_name, \
                    sender.gender as sender_gender, \
                    approve_emp.name as approve_emp_name, \
                    handle_emp.name as handle_emp_name, \
                    locations.location_name, \
                    companies.company_name, \
                    invtry_purchase_requests.*, \
                    invtry_purchase_requests.status as status  \
                    FROM invtry_purchase_requests  \
                    RIGHT OUTER JOIN employees emp_for ON emp_for.emp_id = invtry_purchase_requests.request_for  \
                    RIGHT OUTER JOIN employees sender ON sender.emp_id = invtry_purchase_requests.request_by  \
                    LEFT OUTER JOIN employees approve_emp ON approve_emp.emp_id = invtry_purchase_requests.approve_by \
                    LEFT OUTER JOIN employees handle_emp ON handle_emp.emp_id = invtry_purchase_requests.handle_by \
                    LEFT OUTER JOIN locations ON invtry_purchase_requests.location_code = locations.location_code \
                    LEFT OUTER JOIN companies ON invtry_purchase_requests.company_code = companies.company_code \
                    WHERE invtry_purchase_requests.pr_id = " + prID,
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

router.post('/getthatempinvtryrequests', ( req, res ) => {

    const { empID, colunms, approvalLimit } = req.body;

    let q = "SELECT  \
    employees.name, \
    invtry_purchase_requests.*, \
    locations.location_name,  \
    companies.company_name  \
    FROM employees  \
    LEFT OUTER JOIN invtry_purchase_requests ON employees.emp_id = invtry_purchase_requests.request_for  \
    LEFT OUTER JOIN companies ON employees.company_code = companies.company_code  \
    LEFT OUTER JOIN locations ON employees.location_code = locations.location_code ";

    if ( colunms )
    {
        let acc = colunms.split(',');
        
        q = q.concat(' WHERE ', "invtry_purchase_requests.status LIKE '%" + acc[0] + "%'");
        for ( let x = 0; x < acc.length; x++ )
        {
            q = q.concat(" OR ", "invtry_purchase_requests.status LIKE '%" + acc[x] + "%'");
        }
    }

    if ( approvalLimit === '>150000' )
    {
        q = q.concat(" AND invtry_purchase_requests.total < 150000 ");
        q = q.concat(" AND invtry_purchase_requests.request_for = " + empID + " ORDER BY invtry_purchase_requests.pr_id DESC");
    }else
    {
        if ( q.indexOf('WHERE') !== -1 )
        {
            q = q.concat(" AND invtry_purchase_requests.request_for = " + empID + " ORDER BY invtry_purchase_requests.pr_id DESC");
        }else
        {
            q = q.concat("WHERE invtry_purchase_requests.request_for = " + empID + " ORDER BY invtry_purchase_requests.pr_id DESC");
        }
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
            
                            let arr = [];
                            if ( rslt[0] )
                            {
                                for ( let x= 0; x < rslt.length; x++ )
                                {

                                    if ( rslt[x].request_for === parseInt( empID ) )
                                    {
                                        arr.push( rslt[x] );
                                    }
                                
                                }
                            }
                            res.send( arr );
                            res.end();
                            connection.release();
            
                        }
            
                    }
                );
            }

        }
    );

} );

router.post('/getrequestspecifications', ( req, res ) => {

    const { prID } = req.body;

    db.getConnection(
        ( err, connection ) => {

            if ( err )
            {
                res.status(503).send(err);
                res.end();

            }else
            {
                connection.query(
                    "SELECT DISTINCT \
                    invtry_purchase_request_specifications.id, \
                    invtry_purchase_request_specifications.pr_id, \
                    invtry_purchase_request_specifications.description, \
                    invtry_purchase_request_specifications.reason, \
                    invtry_purchase_request_specifications.price, \
                    invtry_purchase_request_specifications.quantity, \
                    invtry_purchase_request_specifications.amount \
                    FROM invtry_purchase_requests \
                    LEFT OUTER JOIN invtry_purchase_request_specifications ON invtry_purchase_requests.pr_id = 	invtry_purchase_request_specifications.pr_id  \
                    WHERE invtry_purchase_requests.pr_id = " + prID,
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

router.post('/getrequestquotations', ( req, res ) => {

const { prID } = req.body;

db.getConnection(
    ( err, connection ) => {

        if ( err )
        {

            
            res.send([]);

        }else
        {
            connection.query(
                "SELECT DISTINCT \
                invtry_purchase_request_quotations.quotation_id, \
                invtry_purchase_request_quotations.pr_id, \
                invtry_purchase_request_quotations.image, \
                invtry_purchase_request_quotations.image_type \
                FROM invtry_purchase_requests \
                LEFT OUTER JOIN invtry_purchase_request_quotations ON invtry_purchase_requests.pr_id = 	invtry_purchase_request_quotations.pr_id  \
                WHERE invtry_purchase_requests.pr_id = " + prID,
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

router.post('/setprtofinal', ( req, res ) => {

    const { Items, prID, Total } = req.body;
    
    let q = "UPDATE invtry_purchase_requests SET total = '" + Total + "' WHERE pr_id = " + prID + ";";
    if ( Items )
    {
        let items = JSON.parse( Items );
        
        for ( let x = 0; x < items.length; x++ )
        {
            if ( items[x].id )
            {
                q = q.concat('UPDATE invtry_purchase_request_specifications SET ');
                q = q.concat( Object.keys(items[0])[0] + " = " + Object.entries(items[0])[0][1] );
                for ( let y = 0; y < Object.keys(items[x]).length; y++ )
                {
                    q = q.concat(' ,', Object.keys(items[x])[y] + " = '" + Object.entries(items[x])[y][1] + "'" );
                }

                q = q.concat(' WHERE invtry_purchase_request_specifications.id = ' + items[x].id);
                q = q.concat(' AND invtry_purchase_request_specifications.pr_id = ' + items[x].pr_id);
                q = q.concat(';');
            }else
            {
                q = q.concat("INSERT INTO `invtry_purchase_request_specifications`(`pr_id`, `description`, `reason`, `price`, `quantity`, `amount`) VALUES ('" + prID + "','" + items[x].description + "','" + items[x].reason + "','" + items[x].price + "','" + items[x].quantity + "','" + items[x].amount + "')");
                q = q.concat(";");
            }
        }
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

router.post('/setprtoviewed', ( req, res ) => {

    const { prID, empID } = req.body;
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
                    "UPDATE invtry_purchase_requests SET status = 'Viewed', handle_by = ?, view_date = ?, view_time = ? WHERE pr_id = ? AND status = 'Sent'",
                    [ empID, d, d.toTimeString(), prID ],
                    ( err, rslt ) => {
            
                        if( err )
                        {
            
                            res.status(500).send(err);
                            res.end();
                            connection.release();
            
                        }else 
                        {
            
                            res.send( 'success' );
                            res.end();
                            connection.release();
            
                        }
            
                    }
                );
            }

        }
    );

} );

router.post('/setprtowaitforapproval', ( req, res ) => {

    const { prID, empID } = req.body;
    const d = new Date();

    let day = moment(d).format('ddd');

    db.getConnection(
        ( err, connection ) => {

            if ( err )
            {
                res.status(503).send(err);
                res.end();

            }else
            {
                connection.query(
                    "UPDATE invtry_purchase_requests SET status = 'Waiting For Approval', forward_by = ?, forward_date = ?, forward_time = ? WHERE pr_id = ? AND status = 'Viewed'",
                    [ empID, d, d.toTimeString(), prID ],
                    ( err, rslt ) => {
            
                        if( err )
                        {
            
                            res.status(500).send(err);
                            res.end();
                            connection.release();
            
                        }else 
                        {
                            
                            if ( req.files !== undefined && req.files !== 'null' && req.files !== null )
                            {
                                const { Attachments } = req.files;
                                for ( let x= 0; x < Attachments.length; x++ )
                                {
                                    let folderName = prID + "_" + day + " " + moment(d).format("Do MMM YYYY") + ' at ' + d.getHours() + d.getMinutes() + d.getSeconds();
                                    connection.query(
                                        "INSERT INTO invtry_purchase_request_quotations (pr_id, image, image_type) VALUES (?,?,?)",
                                        [ prID, folderName + '/' + Attachments[x].name, Attachments[x].mimetype.split('/')[1] ],
                                        ( err, rslt ) => {
                                
                                            if( err )
                                            {
                                
                                                res.status(500).send(err);
                                                res.end();
                                                connection.release();
                                
                                            }else 
                                            {
                                
                                                fs.mkdir('client/images/Inventory/pr_attachments/' + folderName,
                                                    { recursive: true },
                                                    (err) => {
                                                        if (err) {
    
                                                            res.status(500).send(err);
                                                            res.end();
                                                            connection.release();
    
                                                        }
                                                        else {
    
                                                            Attachments[x].mv('client/images/Inventory/pr_attachments/' + folderName + '/' + Attachments[x].name, (err) => {
    
                                                                if (err) {
    
                                                                    res.status(500).send(err);
                                                                    res.end();
                                                                    connection.release();
    
                                                                }
    
                                                                if ( parseInt ( x + 1 ) === Attachments.length )
                                                                {
                                                                    res.send( 'success' );
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
                                        
                                }
                            }else
                            {
                                res.send( 'success' );
                                res.end();
                                connection.release();
                            }

                        }
            
                    }
                );
            }

        }
    );

} );

router.post('/setprtodiscard', ( req, res ) => {

    const { prID, empID, remarks } = req.body;
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
                    "UPDATE invtry_purchase_requests SET status = 'Rejected', discard_by = ?, discard_date = ?, discard_time = ?, remarks = ? WHERE pr_id = ?",
                    [ empID, d, d.toTimeString(), remarks, prID ],
                    ( err, rslt ) => {
            
                        if( err )
                        {
            
                            res.status(500).send(err);
                            res.end();
                            connection.release();
            
                        }else 
                        {
            
                            res.send( 'success' );
                            res.end();
                            connection.release();
            
                        }
            
                    }
                );
            }

        }
    );

} );

router.post('/setprtoapprove', ( req, res ) => {

    const { prID, empID, remarks } = req.body;
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
                    "UPDATE invtry_purchase_requests SET status = 'Approved', approve_by = ?, approve_date = ?, approve_time = ?, remarks = ? WHERE pr_id = ? AND status = 'Waiting For Approval'",
                    [ empID, d, d.toTimeString(), remarks, prID ],
                    ( err, rslt ) => {
            
                        if( err )
                        {
            
                            res.status(500).send(err);
                            res.end();
                            connection.release();
            
                        }else 
                        {
            
                            res.send( 'success' );
                            res.end();
                            connection.release();
            
                        }
            
                    }
                );
            }

        }
    );

} );

router.post('/setprtodeliver', ( req, res ) => {

    const { prID, remarks } = req.body;
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
                    "UPDATE invtry_purchase_requests SET status = 'Delivered', delivery_date = ?, delivery_time = ?, emp_remarks = ? WHERE pr_id = ? AND status = 'Approved'",
                    [ d, d.toTimeString(), remarks, prID ],
                    ( err, rslt ) => {
            
                        if( err )
                        {
            
                            res.status(500).send(err);
                            res.end();
                            connection.release();
            
                        }else 
                        {
            
                            res.send( 'success' );
                            res.end();
                            connection.release();
            
                        }
            
                    }
                );
            }

        }
    );

} );

module.exports = router;