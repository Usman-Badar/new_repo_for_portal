const express = require('express');
const router = express.Router();
const db = require('../../db/connection');
const fs = require('fs');
const { SendWhatsappNotification } = require('../Whatsapp/whatsapp');
const { CreateLog } = require('./logs');

function chunkArrayInGroups(arr, size) {
    var myArray = [];
    for (var i = 0; i < arr.length; i += size) {
        myArray.push(arr.slice(i, i + size));
    }
    return myArray;
}

router.get('/getallnewspapers', ( req, res ) => {

    
    db.getConnection(
        ( err, connection ) => {

            if ( err )
            {

                res.status(503).send(err);
                res.end();

            }else
            {
                connection.query(
                    "SELECT * FROM emp_news_papers ORDER BY id DESC",
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
                )
            }

        }
    );

} );

router.post('/getnewspaper', ( req, res ) => {

    const { id } = req.body;
    
    db.getConnection(
        ( err, connection ) => {

            if ( err )
            {

                res.status(503).send(err);
                res.end();

            }else
            {
                connection.query(
                    'SELECT * from emp_news_papers WHERE id = ' + id,
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
                )
            }

        }
    );

} );

router.get('/get_all_notices', ( req, res ) => {
    db.query(
        "SELECT * FROM `tbl_notices` WHERE status = 'Active' ORDER BY id DESC;",
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
    )
} );

router.get('/notice/get_all_notices', ( req, res ) => {
    db.query(
        "SELECT tbl_notices.*, employees.name FROM `tbl_notices` LEFT OUTER JOIN employees ON upload_by = employees.emp_id ORDER BY tbl_notices.id DESC;",
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
    )
} );

router.post('/notice/new', ( req, res ) => {
    const {title, type, upload_by} = req.body;
    const {file} = req.files;
    const d = new Date().getTime();
    const url = `assets/portal/assets/notices/${d}_${file.name}`;
    db.query(
        "INSERT INTO `tbl_notices`(`title`, `url`, `type`, `upload_by`) VALUES (?,?,?,?);",
        [title, `${d}_${file.name}`, type, upload_by],
        (err) => {
            if( err ) {
                console.log(err);
                res.status(500).send(err);
                res.end();
            }else {
                file.mv(url, function(err) {
                    if (err) {
                        res.status(500).send("Could not upload notice file.");
                        res.end();
                        throw new Error("Could not upload notice file.");
                    }
                    res.send('success');
                    res.end();
                })
            }
        }
    )
} );

router.post('/notice/update/file', ( req, res ) => {
    const {type, id, prevUrl} = req.body;
    const {file} = req.files;
    const d = new Date().getTime();
    const url = `assets/portal/assets/notices/${d}_${file.name}`;
    db.query(
        "UPDATE `tbl_notices` SET url = ?, type = ? WHERE id = ?;",
        [`${d}_${file.name}`, type, id],
        (err) => {
            if( err ) {
                console.log(err);
                res.status(500).send(err);
                res.end();
            }else {
                if (fs.existsSync(`assets/portal/assets/notices/${prevUrl}`)) fs.unlinkSync(`assets/portal/assets/notices/${prevUrl}`);
                file.mv(url, function(err) {
                    if (err) {
                        res.status(500).send("Could not upload notice file.");
                        res.end();
                        throw new Error("Could not upload notice file.");
                    }
                    res.send(`${d}_${file.name}`);
                    res.end();
                })
            }
        }
    )
} );

router.post('/notice/disable', ( req, res ) => {
    const {id} = req.body;
    db.query(
        "UPDATE `tbl_notices` SET status = ? WHERE id = ?;",
        ['Disable', id],
        (err) => {
            if( err ) {
                console.log(err);
                res.status(500).send(err);
                res.end();
            }else {
                res.send('success');
                res.end();
            }
        }
    )
} );

router.post('/notice/enable', ( req, res ) => {
    const {id} = req.body;
    db.query(
        "UPDATE `tbl_notices` SET status = ? WHERE id = ?;",
        ['Active', id],
        (err) => {
            if( err ) {
                console.log(err);
                res.status(500).send(err);
                res.end();
            }else {
                res.send('success');
                res.end();
            }
        }
    )
} );

router.post('/notice/update/title', ( req, res ) => {
    const {id, title} = req.body;
    db.query(
        "UPDATE `tbl_notices` SET title = ? WHERE id = ?;",
        [title, id],
        (err) => {
            if( err ) {
                console.log(err);
                res.status(500).send(err);
                res.end();
            }else {
                res.send('success');
                res.end();
            }
        }
    )
} );

router.post('/notice/send', ( req, res ) => {
    const {url, location, company, emp_id, notice_id} = req.body;
    const LIMIT = 5;
    const DELAY = 5000;
    const QUERY_PARAMETERS = [];
    const NOTIFICATION_BODY = "New notice has been uploaded on portal, please check";

    let q = "SELECT emp_id, name, cell FROM employees WHERE emp_status = 'Active' ";
    if (company.toString().length > 0) {
        q = q.concat(' AND company_code = ' + parseInt(company));
        QUERY_PARAMETERS.push("company: " + company);
    }

    if (location.toString().length > 0) {
        q = q.concat(' AND location_code = ' + parseInt(location));
        QUERY_PARAMETERS.push("location: " + location);
    }

    db.query(
        "UPDATE `tbl_notices` SET whatsapp_sent = ?, whatsapp_sent_date = ? WHERE url LIKE '%" + url + "%'",
        [1, new Date()],
        () => {
            db.query(
                q,
                (err, employees) => {
                    if (employees.length > 0) {
                        if (employees.length > LIMIT) {
                            const list = chunkArrayInGroups(employees, LIMIT);
                            const limit = list.length;
                            const count = [];
                            function call() {
                                const x = count.length;
                                let qq = "";
                                for (let y = 0; y < list[x].length; y++) {
                                    SendWhatsappNotification( null, null, "Hi " + list[x][y]?.name, NOTIFICATION_BODY, list[x][y]?.cell );
                                    qq = qq.concat("INSERT INTO `tbl_notice_notifications`(`emp_id`, `notification`, `query_parameters`, `sent_by`) VALUES ('"+list[x][y]?.emp_id+"','"+NOTIFICATION_BODY+"', '"+JSON.stringify(QUERY_PARAMETERS)+"','"+emp_id+"');")
                                }
                                if ((x+1) === limit) {
                                    console.log('Notification has been sent to all')
                                }else {
                                    db.query(
                                        qq,
                                        () => {
                                            count.push(1);
                                            setTimeout(() => {
                                                call();
                                            }, DELAY);
                                        }
                                    )
                                }
                            }
                            call();
                        }else {
                            let qq = "";
                            for (let x = 0; x < employees.length; x++) {
                                SendWhatsappNotification( null, null, "Hi " + employees[x]?.name, NOTIFICATION_BODY, employees[x]?.cell );
                                qq = qq.concat("INSERT INTO `tbl_notice_notifications`(`emp_id`, `notification`, `query_parameters`, `sent_by`) VALUES ('"+list[x][y]?.emp_id+"','"+NOTIFICATION_BODY+"', '"+JSON.stringify(QUERY_PARAMETERS)+"','"+emp_id+"');")
                            }
                            db.query(
                                qq,
                                () => {
                                    console.log('notification sent');
                                }
                            )
                        }
                    }
                }
            )
            res.send("success").end();
        }
    );

    // CreateLog('tbl_notices', notice_id, `${name}:${emp_id} has sent a notification (${url}) to the following companies \n${arr}.`, 'info', 'update');
    
    // function sendOneByOne() {
    //     let query = `SELECT emp_id, name, cell FROM employees WHERE emp_status = 'Active' AND company_code = ${parsed_arr[count].company} AND location_code = ${parsed_arr[count].location};`;
    //     if (parsed_arr[count].location === 'all') {
    //         query = `SELECT emp_id, name, cell FROM employees WHERE emp_status = 'Active' AND company_code = ${parsed_arr[count].company};`;
    //     }
    //     db.query(
    //         query,
    //         (err, employees) => {
    //             if( err ) {
    //                 console.log(err);
    //             }else {
    //                 sentCount = sentCount + 1;
    //                 const code = '92';
    //                 let standardNumber;
    //                 let num = "";

    //                 const empLimit = employees.length;
    //                 let empCount = 0;
    //                 function sendToEmp() {
    //                     if ( employees[empCount]?.cell.includes('+') )
    //                     {
    //                         num = employees[empCount]?.cell.replace('+', '');
    //                         standardNumber = num + '@c.us';
    //                     }else   
    //                     {
    //                         num = employees[empCount]?.cell.substring(1, 11);
    //                         standardNumber = code + num + '@c.us';
    //                     }
    //                     const mediaUrl = `assets/portal/assets/notices/${url}`;
    //                     sendMediaMessageSelected(mediaUrl, standardNumber);

    //                     if ((empCount+1) === empLimit) {
    //                         if ((count+1) === limit) {
    //                             db.query(
    //                                 "UPDATE `tbl_notices` SET whatsapp_sent = ?, whatsapp_sent_date = ? WHERE url LIKE '%" + url + "%'",
    //                                 [1, new Date()],
    //                                 (err) => {
    //                                     if( err ) {
    //                                         console.log(err);
    //                                     }else {
    //                                         console.log("Message has been sent to all selected employees.");
    //                                     }
    //                                 }
    //                             )
    //                         }else {
    //                             console.log(`${parsed_arr[count].companyName} has been notified.`)
    //                             count = count + 1;
    //                             sendOneByOne();
    //                         }
    //                     }else {
    //                         console.log(`message sent to ${employees[empCount]?.name}.`);
    //                         empCount = empCount + 1;
    //                         sendToEmp();
    //                     }
    //                 }
    //                 sendToEmp();
    //             }
    //         }
    //     )
    // }
    // sendOneByOne();
} );

module.exports = router;