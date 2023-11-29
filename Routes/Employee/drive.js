const express = require('express');
const router = express.Router();
const db = require('../../db/connection');
const MakeDir = require('fs');
const fs = require('fs-extra');

router.post('/getalldrive', ( req, res ) => {

    const { emp_id } = req.body;

    db.getConnection(
        ( err, connection ) => {

            if ( err )
            {

                
                res.status(503).send(err);
                res.end();

            }else
            {
                connection.query(
                    "SELECT * FROM emp_drive_main WHERE emp_drive_main.emp_id = ? AND emp_drive_main.type = 'document'; \
                    SELECT * FROM emp_drive_main WHERE emp_drive_main.emp_id = ? AND emp_drive_main.type = 'folder'",
                    [ emp_id, emp_id ],
                    ( err, rslt ) => {
            
                        if( err )
                        {
            
                            res.status(500).send(err);
                            res.end();
                            connection.release();
            
                        }else 
                        {
                            if ( rslt[0].length > 0 )
                            {
                                q = "SELECT * FROM emp_drive_sub ";
                                if ( rslt[1].length > 0 )
                                {
                                    q =  q.concat(' WHERE ')
                                    for ( let x = 0; x < rslt[1].length; x++ )
                                    {
                                        if ( ( x + 1 ) === rslt[1].length )
                                        {
                                            q = q.concat('folder_id = ' + rslt[1][x].id + ' ');
                                        }else
                                        {
                                            q = q.concat('folder_id = ' + rslt[1][x].id + " OR ");
                                        }
                                    }
        
                                    q = q.concat(" ORDER BY id DESC");
                                    connection.query(
                                        q,
                                        ( err, result ) => {
                                
                                            if( err )
                                            {
                                
                                                res.send( err );
                                                res.end();
                                                connection.release();
                                
                                            }else 
                                            {
        
                                                let arr = [];
                                                for ( let x = 0; x < rslt[0].length; x++ )
                                                {
                                                    if ( rslt[0][x].doc_type.toLowerCase() === 'jpeg' || rslt[0][x].doc_type.toLowerCase() === 'jpg' || rslt[0][x].doc_type.toLowerCase() === 'gif' || rslt[0][x].doc_type.toLowerCase() === 'png' )
                                                    {
                                                        arr.push( rslt[0][x] );
                                                    }
                                                }
                                                for ( let x = 0; x < result.length; x++ )
                                                {
                                                    if ( result[x].doc_type.toLowerCase() === 'jpeg' || result[x].doc_type.toLowerCase() === 'jpg' || result[x].doc_type.toLowerCase() === 'gif' || result[x].doc_type.toLowerCase() === 'png' )
                                                    {
                                                        arr.push( result[x] );
                                                    }
                                                }
            
                                                res.send( arr );
                                                res.end();
                                                connection.release();
                                
                                            }
                                
                                        }
                                    )
                                }else
                                {
                                    let arr = [];
                                    for ( let x = 0; x < rslt[0].length; x++ )
                                    {
                                        if ( rslt[0][x].doc_type.toLowerCase() === 'jpeg' || rslt[0][x].doc_type.toLowerCase() === 'jpg' || rslt[0][x].doc_type.toLowerCase() === 'gif' || rslt[0][x].doc_type.toLowerCase() === 'png' )
                                        {
                                            arr.push( rslt[0][x] );
                                        }
                                    }
                                    res.send( arr );
                                    res.end();
                                    connection.release();
                                }
    
                                
                            }else
                            {
                                res.send([]);
                                res.end();
                                connection.release();
                            }
            
                        }
            
                    }
                )
            }

        }
    )

} );

router.post('/uploaddocument', ( req, res ) => {

    const { docName, empId, docsExtension, employee_name } = req.body; 
    const { MyDocs } = req.files;

    const docsName = docName + '.' + docsExtension.toString();
    const d = new Date();
    let folderName = employee_name.replace(/\s/g, '') + '_' + empId.toString() + '/';

    db.getConnection(
        ( err, connection ) => {

            if ( err )
            {

                res.status(503).send(err);
                res.end();

            }else
            {
                connection.query(
                    "INSERT INTO emp_drive_main (emp_id, type, name, date, time, doc_type) VALUES (?,?,?,?,?,?);",
                    [ empId, 'document', folderName + docsName, d, d.toTimeString(), docsExtension.toString() ],
                    ( err, rslt ) => {
            
                        if( err )
                        {
            
                            res.status(500).send(err);
                            res.end();
                            connection.release();
            
                        }else 
                        {
                            let nm = employee_name;
                            MakeDir.mkdir('client/images/drive/' + nm.replace(/\s/g, '') + '_' + empId.toString(), 
                                { recursive: true }, 
                                ( err ) => {
                                    if (err) 
                                    {
                                        res.status(500).send(err);
                                        res.end();
                                        connection.release();
                                    }
                                    else
                                    {
                                        MyDocs.mv('client/images/drive/' + nm.replace(/\s/g, '') + '_' + empId.toString() + '/' + docsName, (err) => {
            
                                            if (err) {
                                    
                                                res.status(500).send(err);
                                                res.end();
                                                connection.release();
                                    
                                            }
                                            else
                                            res.send( rslt );
                                            res.end();
                                            connection.release();
                                    
                                        });
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

router.post('/createnewfolder', ( req, res ) => {

    const { foldername, empId, employee_name } = req.body;
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
                    "INSERT INTO emp_drive_main (emp_id, type, name, date, time) VALUES (?,?,?,?,?);",
                    [ empId, 'folder' /* or document*/, foldername, d, d.toTimeString() ],
                    ( err, rslt ) => {
            
                        if( err )
                        {
            
                            res.status(500).send(err);
                            res.end();
                            connection.release();
            
                        }else 
                        {
                            
                            MakeDir.mkdir('client/images/drive/' + employee_name.replace(/\s/g, '') + '_' + empId.toString() + '/' + foldername, 
                                { recursive: true }, 
                                ( err ) => {
                                    if (err) 
                                    {
                                        res.status(500).send(err);
                                        res.end();
                                        connection.release();
                                    }
                                    else
                                    {
                                        res.send( rslt );
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

} );

router.post('/uploaddocuments', ( req, res ) => {

    const { DriveID, employee_name, empId, FolderName } = req.body;
    let { Attachments } = req.files;
    
    const d = new Date();
    let folderName = employee_name.replace(/\s/g, '') + '_' + empId.toString() + '/';
    
    db.getConnection(
        ( err, connection ) => {
            
            if ( err )
            {
                
                res.status(503).send(err);
                res.end();
                
            }else
            {

                let obj = {};
                if ( Attachments.length === undefined )
                {
                    obj = Attachments;
                    Attachments = [ obj ];
                }
                
                for ( let x = 0; x < Attachments.length; x++ )
                {
                    
                    if ( DriveID !== 'undefined' )
                    {
                        connection.query(
                            "INSERT INTO emp_drive_sub (folder_id, name, date, time, doc_type) VALUES (?,?,?,?,?);",
                            [ DriveID, folderName + FolderName + '/' + Attachments[x].name, d, d.toTimeString(), Attachments[x].mimetype.split('/')[1] ],
                            ( err, rslt ) => {
                    
                                if( err )
                                {
                    
                                    res.status(500).send(err);
                                    res.end();
                                    connection.release();
                    
                                }
    
                                let nm = employee_name;
                                    MakeDir.mkdir('client/images/drive/' + nm.replace(/\s/g, '') + '_' + empId.toString() + '/' + FolderName,
                                        { recursive: true },
                                        (err) => {
                                            if (err) {
                
                                                res.status(500).send(err);
                                                res.end();
                                                connection.release();
                                                
                                            }
                                            else {
                
                                                Attachments[x].mv('client/images/drive/' + nm.replace(/\s/g, '') + '_' + empId.toString() + '/' + FolderName + '/' + Attachments[x].name, (err) => {
                                                    if (err) 
                                                    {
                                                    
                                                        res.status(500).send(err);
                                                        res.end();
                                                        connection.release();
                            
                                                    }
                            
                                                    }
                                                )
                                                
                                            }
                                        }
                                    )
                    
                            }
                        )
                    }else
                    {
                        connection.query(
                            "INSERT INTO emp_drive_main (emp_id, type, name, date, time, doc_type) VALUES (?,?,?,?,?,?);",
                            [ empId, 'document' /* or folder*/, folderName + Attachments[x].name, d, d.toTimeString(), Attachments[x].mimetype.split('/')[1] ],                    
                            ( err, rslt ) => {
                    
                                if( err )
                                {
                    
                                    res.status(500).send(err);
                                    res.end();
                                    connection.release();
                    
                                }
    
                                let nm = employee_name;
                                    MakeDir.mkdir('client/images/drive/' + nm.replace(/\s/g, '') + '_' + empId.toString(),
                                        { recursive: true },
                                        (err) => {
                                            if (err) {
                
                                                res.status(500).send(err);
                                                res.end();
                                                connection.release();
                                                
                                            }
                                            else {
                
                                                Attachments[x].mv('client/images/drive/' + nm.replace(/\s/g, '') + '_' + empId.toString() + '/' + Attachments[x].name, (err) => {
                                                    if (err) 
                                                    {
                                                    
                                                        res.status(500).send(err);
                                                        res.end();
                                                        connection.release();
                            
                                                    }
                            
                                                    }
                                                )
                                                
                                            }
                                        }
                                    )
                    
                            }
                        )
                    }

                    if ( ( x + 1 ) === Attachments.length )
                    {
                        res.send('success');
                        res.end();
                        connection.release();
                    }

                }
            }

        }
    )

} );

router.post('/deletedoc', ( req, res ) => {

    const { DID, empID, driveID, docName } = req.body; 

    db.getConnection(
        ( err, connection ) => {

            if ( err )
            {

                res.status(503).send(err);
                res.end();

            }else
            {
                
                if ( DID === 'undefined' )
                {
                    connection.query(
                        "DELETE FROM `emp_drive_main` WHERE id = " + driveID + " AND emp_id = " + empID,
                        ( err ) => {
                
                            if( err )
                            {
                
                                res.status(500).send(err);
                                res.end();
                                connection.release();
                
                            }else 
                            {
                                
                                if ( docName.indexOf('.') !== -1 ) 
                                {
                                    // would be true. Period found in file name
                                    MakeDir.unlinkSync('client/images/drive/' + docName);
                                    res.send( rslt );
                                    res.end();
                                    connection.release();
                                }else
                                {
                                    connection.query(
                                        "SELECT * FROM emp_drive_sub WHERE folder_id = " + driveID,
                                        ( err, rslt ) => {
                                
                                            if( err )
                                            {
                                
                                                res.status(500).send(err);
                                                res.end();
                                                connection.release();
                                
                                            }else 
                                            {
                                            
                                                if ( rslt[0] )
                                                {
                                                    let length = rslt.length;
                                                    for ( let x = 0; x < length; x++ )
                                                    {
                                                        MakeDir.unlinkSync('client/images/drive/' + rslt[0].name);
                                                    }
                                                }
                                                res.send( rslt );
                                                res.end();
                                                connection.release();
                                
                                            }
                                
                                        }
                                    )
                                }
                
                            }
                
                        }
                    )
                }else
                {
                    connection.query(
                        "DELETE FROM `emp_drive_sub` WHERE folder_id = " + DID + " AND id = " + driveID,
                        ( err, rslt ) => {
                
                            if( err )
                            {
                
                                res.status(500).send(err);
                                res.end();
                                connection.release();
                
                            }else 
                            {
                                
                                MakeDir.unlinkSync('client/images/drive/' + docName);
                                res.send( rslt );
                                res.end();
                                connection.release();
                
                            }
                
                        }
                    )
                }
            }

        }
    )

} );

router.post('/uploadsubdocs', ( req, res ) => {

    const { DriveID, docName, empId, docsExtension, employee_name, FolderName } = req.body; 
    const { MyDocs } = req.files;

    const docsName = docName + '.' + docsExtension.toString();
    const d = new Date();
    let folderName = employee_name.replace(/\s/g, '') + '_' + empId.toString() + '/';

    db.getConnection(
        ( err, connection ) => {

            if ( err )
            {
                res.status(503).send(err);
                res.end();
            }else
            {
                connection.query(
                    "INSERT INTO emp_drive_sub (folder_id, name, date, time, doc_type) VALUES (?,?,?,?,?);",
                    [ DriveID, folderName + FolderName + "/" + docsName, d, d.toTimeString(), docsExtension.toString() ],
                    ( err, rslt ) => {
            
                        if( err )
                        {
                            res.status(500).send(err);
                            res.end();
                            connection.release();
            
                        }else 
                        {
                            let nm = employee_name;
                            MakeDir.mkdir('client/images/drive/' + nm.replace(/\s/g, '') + '_' + empId.toString() + '/' + FolderName, 
                                { recursive: true }, 
                                ( err ) => {
                                    if (err) 
                                    {
                                        res.status(500).send(err);
                                        res.end();
                                        connection.release();
                                    }
                                    else
                                    {
                                        MyDocs.mv('client/images/drive/' + nm.replace(/\s/g, '') + '_' + empId.toString() + '/' + FolderName + '/' + docsName, (err) => {
            
                                            if (err) {
                                    
                                                res.status(500).send(err);
                                                res.end();
                                                connection.release();
                                    
                                            }
                                            else
                                            res.send( rslt );
                                            res.end();
                                            connection.release();
                                    
                                        });
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

router.post('/movedoctofolder', ( req, res ) => {

    const { driveID, folderID, folderName, employee_name, EmpID, driveName } = req.body; 

    db.getConnection(
        ( err, connection ) => {

            if ( err )
            {

                res.status(503).send(err);
                res.end();
            }else
            {
                connection.query(
                    "SELECT * FROM emp_drive_main WHERE id = " + driveID,
                    ( err, rslt ) => {
            
                        if( err )
                        {
            
                            res.status(500).send(err);
                            res.end();
                            connection.release();
            
                        }else 
                        {
                            
                            connection.query(
                                "INSERT INTO emp_drive_sub (folder_id, name, date, time, doc_type) VALUES (?,?,?,?,?);",
                                [ folderID, rslt[0].name, rslt[0].date, rslt[0].time, rslt[0].doc_type ],
                                ( err, rslt ) => {
                        
                                    if( err )
                                    {
                        
                                        res.status(500).send(err);
                                        res.end();
                                        connection.release();
                        
                                    }else 
                                    {

                                        connection.query(
                                            "DELETE FROM `emp_drive_main` WHERE id = " + driveID,
                                            ( err, rslt ) => {
                                    
                                                if( err )
                                                {
                                    
                                                    res.status(500).send(err);
                                                    res.end();
                                                    connection.release();
                                    
                                                }else 
                                                {

                                                    MakeDir.mkdir('client/images/drive/' + employee_name.replace(/\s/g, '') + '_' + EmpID.toString() + '/' + folderName,
                                                        { recursive: true },
                                                        (err) => {
                                                            if (err) {

                                                                res.status(500).send(err);
                                                                res.end();
                                                                connection.release();
                                                            }
                                                            else {

                                                                fs.move(
                                                                    'client/images/drive/' + driveName, 'client/images/drive/' + employee_name.replace(/\s/g, '') + '_' + EmpID.toString() + '/' + folderName + '/' + driveName.toString().split('/').pop()
                                                                    , ( err ) => {
                                                                        if ( err )
                                                                        {
                                                                            console.log( err );
                                                                        }else
                                                                        {
                                                                            res.send(rslt);
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
                )
            }

        }
    );

} );

router.post('/getemployeedrive', ( req, res ) => {

    const { empID, subDoc } = req.body;

    let q = null;
    if ( subDoc === undefined || subDoc === 'undefined' )
    {
        q = "SELECT * FROM emp_drive_main WHERE emp_id = " + empID + " AND type = 'document' ORDER BY id DESC";
    }else
    {
        q = "SELECT * FROM emp_drive_sub WHERE folder_id = " + parseInt(subDoc) + " ORDER BY id DESC";
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
                )
            }

        }
    );

} );

router.post('/getemployeealldrivecontent', ( req, res ) => {

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
                    "SELECT \
                    emp_drive_main.*, \
                    emp_drive_sub.* \
                    FROM emp_drive_main \
                    LEFT OUTER JOIN emp_drive_sub ON emp_drive_main.id = emp_drive_sub.folder_id \
                    WHERE emp_drive_main.emp_id = " + empID,
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

router.post('/getemployeedrivefolders', ( req, res ) => {

    const { empID, subDoc } = req.body; 

    let inFolder = false;
    if ( subDoc === undefined || subDoc === 'undefined' )
    {
        inFolder = false;
    }else
    {
        inFolder = true;
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
                    "SELECT * FROM emp_drive_main WHERE emp_id = " + empID + " AND type = 'folder' ORDER BY id DESC",
                    ( err, rslt ) => {
            
                        if( err )
                        {
            
                            res.status(500).send(err);
                            res.end();
                            connection.release();
            
                        }else 
                        {
                            
                            if ( inFolder )
                            {
                                res.send( [] );
                                res.end();
                            }else
                            {
                                res.send( rslt );
                                res.end();
                            }
                            connection.release();
            
                        }
            
                    }
                )
            }

        }
    );

} );

module.exports = router;