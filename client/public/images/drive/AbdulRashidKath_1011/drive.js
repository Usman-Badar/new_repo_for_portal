const express = require('express');
const router = express.Router();
const db = require('../../db/connection');
const MakeDir = require('fs');

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
            
                            res.send( err );
                            connection.release();
            
                        }else 
                        {
                            let nm = employee_name;
                            MakeDir.mkdir('client/images/drive/' + nm.replace(/\s/g, '') + '_' + empId.toString(), 
                                { recursive: true }, 
                                ( err ) => {
                                    if (err) 
                                    {
                                        res.send( err );
                                        connection.release();
                                    }
                                    else
                                    {
                                        MyDocs.mv('client/images/drive/' + nm.replace(/\s/g, '') + '_' + empId.toString() + '/' + docsName, (err) => {
            
                                            if (err) {
                                    
                                                res.send( err );
                                                connection.release();
                                    
                                            }
                                            else
                                            res.send( rslt );
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

    const { foldername, empId } = req.body;
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
            
                            res.send( err );
                            connection.release();
            
                        }else 
                        {
                            
                            res.send( err );
                            connection.release();
            
                        }
            
                    }
                )
            }

        }
    )

} );

router.post('/uploaddocuments', ( req, res ) => {

    const { DriveID, FileName, employee_name, empId } = req.body;

    const docsName = FileName;
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
                if ( DriveID !== 'undefined' )
                {
                    connection.query(
                        "INSERT INTO emp_drive_sub (folder_id, name, date, time, doc_type) VALUES (?,?,?,?,?);",
                        [ DriveID, folderName + docsName, d, d.toTimeString(), FileName.toString().split('.')[1] ],
                        ( err, rslt ) => {
                
                            if( err )
                            {
                
                                res.send( err );
                                connection.release();
                
                            }
                
                        }
                    )
                }else
                {
                    connection.query(
                        "INSERT INTO emp_drive_main (emp_id, type, name, date, time, doc_type) VALUES (?,?,?,?,?,?);",
                        [ empId, 'document' /* or folder*/, folderName + docsName, d, d.toTimeString(), FileName.toString().split('.')[1] ],                    ( err, rslt ) => {
                
                            if( err )
                            {
                
                                res.send( err );
                                connection.release();
                
                            }
                
                        }
                    )
                }

                if ( FileName ) {
                    const { File } = req.files;
                    
                    let nm = employee_name;
                    MakeDir.mkdir('client/images/drive/' + nm.replace(/\s/g, '') + '_' + empId.toString(),
                        { recursive: true },
                        (err) => {
                            if (err) {

                                res.send(err);
                                connection.release();
                                
                            }
                            else {

                                File.mv('client/images/drive/' + nm.replace(/\s/g, '') + '_' + empId.toString() + '/' + docsName, (err) => {
                                    if (err) 
                                    {
                                    
                                        res.send(err);
                                        connection.release();
            
                                    } else {
                                        res.send('success');
                                        connection.release();
                                    }
            
                                    }
                                )
                                
                            }
                        }
                    )
                    
                } else {
                    res.send('success');
                    connection.release();
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
                        ( err, rslt ) => {
                
                            if( err )
                            {
                
                                res.send( err );
                                connection.release();
                
                            }else 
                            {
                                
                                if ( docName.indexOf('.') !== -1 ) 
                                {
                                    // would be true. Period found in file name
                                    MakeDir.unlinkSync('client/images/drive/' + docName);
                                }else
                                {
                                    connection.query(
                                        "SELECT * FROM emp_drive_sub WHERE folder_id = " + driveID,
                                        ( err, rslt ) => {
                                
                                            if( err )
                                            {
                                
                                                res.send( err );
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
                
                                res.send( err );
                                connection.release();
                
                            }else 
                            {
                                
                                MakeDir.unlinkSync('client/images/drive/' + docName);
                                res.send( rslt );
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

    const { DriveID, docName, empId, docsExtension, employee_name } = req.body; 
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
                    [ DriveID, folderName + docsName, d, d.toTimeString(), docsExtension.toString() ],
                    ( err, rslt ) => {
            
                        if( err )
                        {
            
                            res.send( err );
                            connection.release();
            
                        }else 
                        {
                            let nm = employee_name;
                            MakeDir.mkdir('client/images/drive/' + nm.replace(/\s/g, '') + '_' + empId.toString(), 
                                { recursive: true }, 
                                ( err ) => {
                                    if (err) 
                                    {
                                        res.send( err );
                                        connection.release();
                                    }
                                    else
                                    {
                                        MyDocs.mv('client/images/drive/' + nm.replace(/\s/g, '') + '_' + empId.toString() + '/' + docsName, (err) => {
            
                                            if (err) {
                                    
                                                res.send( err );
                                                connection.release();
                                    
                                            }
                                            else
                                            res.send( rslt );
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

    const { driveID, folderID } = req.body; 

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
            
                            res.send( err );
                            connection.release();
            
                        }else 
                        {
                            
                            connection.query(
                                "INSERT INTO emp_drive_sub (folder_id, name, date, time, doc_type) VALUES (?,?,?,?,?);",
                                [ folderID, rslt[0].name, rslt[0].date, rslt[0].time, rslt[0].doc_type ],
                                ( err, rslt ) => {
                        
                                    if( err )
                                    {
                        
                                        res.send( err );
                                        connection.release();
                        
                                    }else 
                                    {

                                        connection.query(
                                            "DELETE FROM `emp_drive_main` WHERE id = " + driveID,
                                            ( err, rslt ) => {
                                    
                                                if( err )
                                                {
                                    
                                                    res.send( err );
                                                    connection.release();
                                    
                                                }else 
                                                {
                                                
                                                    res.send( rslt );
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
            
                            res.send( err );
                            connection.release();
            
                        }else 
                        {
                            
                            res.send( rslt );
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
            
                            res.send( err );
                            connection.release();
            
                        }else 
                        {
                            
                            res.send( rslt );
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
            
                            res.send( err );
                            connection.release();
            
                        }else 
                        {
                            
                            if ( inFolder )
                            {
                                res.send( [] );
                            }else
                            {
                                res.send( rslt );
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