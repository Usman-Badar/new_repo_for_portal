const express = require('express');
const router = express.Router();
const db = require('../../db/connection');

const io = require('../../server');

const NodeCache = require("node-cache");
const myCache = new NodeCache();
const SendWhatsappNotification = require('../Whatsapp/whatsapp').SendWhatsappNotification;

io.on('connection', ( socket ) => {

    // WHEN NEW USER IS ONLINE
    socket.on(
        'UserOnline', ( id ) => {
            
            db.getConnection(
                ( err, connection ) => {
        
                    if ( err )
                    {

                        res.status(503).send(err);
                        res.end();
                        connection.release();
        
                    }else
                    {
                        connection.query(
                            "SELECT app_status FROM employees WHERE emp_id = ?",
                            [ parseInt( id ) ],
                            ( err, rslt ) => {
                    
                                socket.emit(
                                    'UserOnline', { err: err, rslt: rslt }
                                )
                                connection.release();
                    
                            }
                        )
                    }
        
                }
            )
    
        }
    )

    // WHEN NEW CHAT HAPPEN
    socket.on(
        'NewChat', ( data ) => {
            
            socket.broadcast.emit(
                'UserNewChat', { sender: data.sender, receiver: data.receiver, index: data.index }
            )
    
        }
    )

});

router.post('/getchatemployees', ( req, res ) => {

    const { currentEmp } = req.body;

    db.query(
        "SELECT DISTINCT employees.emp_id, \
        employees.name, \
        locations.location_name, \
        companies.company_name, \
        departments.department_name, \
        designations.designation_name, \
        emp_app_profile.emp_image \
        FROM employees  \
        RIGHT OUTER JOIN emp_chats ON employees.emp_id = emp_chats.sender_id  \
        OR \
        employees.emp_id = emp_chats.receiver_id \
        LEFT OUTER JOIN emp_app_profile ON employees.emp_id = emp_app_profile.emp_id \
        LEFT OUTER JOIN locations ON employees.location_code = locations.location_code \
        LEFT OUTER JOIN companies ON employees.company_code = companies.company_code \
        LEFT OUTER JOIN departments ON employees.department_code = departments.department_code \
        LEFT OUTER JOIN designations ON employees.designation_code = designations.designation_code \
        WHERE employees.emp_status = 'Active' AND emp_chats.sender_id = " + currentEmp + " OR emp_chats.receiver_id = " + currentEmp + " \
        ORDER BY emp_chats.id DESC;",
        ( err, rslt ) => {

            if( err )
            {

                res.status(500).send(err);
                res.end();

            }else 
            {

                if ( rslt.length > 0 )
                {
                    let limit = rslt.length;
                    let count = [];
                    let lastChats = [];
                    function getLastChat()
                    {
                        db.query(
                            "SELECT emp_chats.* \
                            FROM \
                            emp_chats \
                            WHERE sender_id = " + currentEmp + " \
                            AND receiver_id = " + rslt[count.length].emp_id + " \
                            OR receiver_id = " + currentEmp + " \
                            AND sender_id = " + rslt[count.length].emp_id + " \
                            AND sender_status != 'deleted' ORDER BY id DESC LIMIT 1",
                            ( err, result ) => {
                    
                                if( err )
                                {
                    
                                    res.status(500).send(err);
                                    res.end();
                    
                                }else 
                                {
                                    
                                    lastChats.push( result[0] );
                                    if ( lastChats.length === rslt.length )
                                    {
                                        res.send( [rslt, lastChats] );
                                        res.end();
                                    }else
                                    {
                                        if ( ( count.length + 1 ) === limit )
                                        {
                                            console.log( "Last Chat Procedure Completed..." );
                                        }else
                                        {
                                            count.push(1);
                                            getLastChat();
                                        }
                                    }
                    
                                }
                    
                            }
                        );
                    }
                    getLastChat();
                }else
                {
                    res.send( [rslt, []] );
                    res.end();
                }

            }

        }
    );

} );

router.post('/getallemployees', ( req, res ) => {

    const { currentEmp } = req.body;

    db.query(
        "SELECT employees.emp_id, \
        employees.name, \
        locations.location_name, \
        companies.company_name, \
        departments.department_name, \
        designations.designation_name, \
        emp_app_profile.emp_image \
        FROM employees \
        LEFT OUTER JOIN locations ON employees.location_code = locations.location_code \
        LEFT OUTER JOIN companies ON employees.company_code = companies.company_code \
        LEFT OUTER JOIN departments ON employees.department_code = departments.department_code \
        LEFT OUTER JOIN designations ON employees.designation_code = designations.designation_code \
        LEFT OUTER JOIN emp_app_profile ON employees.emp_id = emp_app_profile.emp_id \
        WHERE employees.emp_status = 'Active' AND employees.emp_id != " + currentEmp + " ORDER BY employees.name ASC",
        ( err, rslt ) => {

            if( err )
            {

                res.status(500).send(err);
                res.end();

            }else 
            {

                if ( rslt.length > 0 )
                {
                    let limit = rslt.length;
                    let count = [];
                    let lastChats = [];
                    function getLastChat()
                    {
                        db.query(
                            "SELECT emp_chats.* \
                            FROM \
                            emp_chats \
                            WHERE sender_id = " + currentEmp + " \
                            AND receiver_id = " + rslt[count.length].emp_id + " \
                            OR receiver_id = " + currentEmp + " \
                            AND sender_id = " + rslt[count.length].emp_id + " \
                            AND sender_status != 'deleted' ORDER BY id DESC LIMIT 1",
                            ( err, result ) => {
                    
                                if( err )
                                {
                    
                                    res.status(500).send(err);
                                    res.end();
                    
                                }else 
                                {
                                    
                                    lastChats.push( result[0] );
                                    if ( lastChats.length === rslt.length )
                                    {
                                        res.send( [rslt, lastChats] );
                                        res.end();
                                    }else
                                    {
                                        if ( ( count.length + 1 ) === limit )
                                        {
                                            console.log( "Last Chat Procedure Completed..." );
                                        }else
                                        {
                                            count.push(1);
                                            getLastChat();
                                        }
                                    }
                    
                                }
                    
                            }
                        );
                    }
                    getLastChat();
                }else
                {
                    res.send( [rslt, []] );
                    res.end();
                }

            }

        }
    );

} );

router.post('/srchemp', ( req, res ) => {

    const { SearchKey, currentEmp } = req.body;

    console.log( SearchKey === '' );
    console.log( SearchKey === null );
    console.log( SearchKey.length );
    console.log( typeof(SearchKey) );

    db.getConnection(
        ( err, connection ) => {

            if ( err )
            {

                res.status(503).send(err);
                res.end();

            }else
            {
                let q = '';
                if ( SearchKey === '' || SearchKey.length === 0 )
                {
                    q = "SELECT DISTINCT employees.emp_id, \
                    employees.name, \
                    locations.location_name, \
                    companies.company_name, \
                    departments.department_name, \
                    designations.designation_name, \
                    emp_app_profile.emp_image \
                    FROM employees  \
                    RIGHT OUTER JOIN emp_chats ON employees.emp_id = emp_chats.sender_id  \
                    OR \
                    employees.emp_id = emp_chats.receiver_id \
                    LEFT OUTER JOIN emp_app_profile ON employees.emp_id = emp_app_profile.emp_id \
                    LEFT OUTER JOIN locations ON employees.location_code = locations.location_code \
                    LEFT OUTER JOIN companies ON employees.company_code = companies.company_code \
                    LEFT OUTER JOIN departments ON employees.department_code = departments.department_code \
                    LEFT OUTER JOIN designations ON employees.designation_code = designations.designation_code \
                    WHERE emp_chats.sender_id = " + currentEmp + " OR emp_chats.receiver_id = " + currentEmp + " AND employees.emp_status = 'Active' \
                    ORDER BY emp_chats.id DESC;";
                }else
                {


                    // q = "SELECT employees.emp_id, \
                    // employees.name, \
                    // locations.location_name, \
                    // companies.company_name, \
                    // departments.department_name, \
                    // designations.designation_name, \
                    // emp_app_profile.emp_image, \
                    // emp_chats.sender_id \
                    // FROM employees \
                    // LEFT OUTER JOIN locations ON employees.location_code = locations.location_code \
                    // LEFT OUTER JOIN companies ON employees.company_code = companies.company_code \
                    // LEFT OUTER JOIN departments ON employees.department_code = departments.department_code \
                    // LEFT OUTER JOIN designations ON employees.designation_code = designations.designation_code \
                    // LEFT OUTER JOIN emp_app_profile ON employees.emp_id = emp_app_profile.emp_id \
                    // RIGHT OUTER JOIN emp_chats ON employees.emp_id = emp_chats.sender_id \
                    // WHERE employees.emp_status = 'Active' AND employees.emp_id != " + currentEmp + " AND employees.name LIKE '%" + SearchKey +"%'" + " ORDER BY emp_chats.send_date";
                    

                    // current
                          
                    
                    q = "SELECT DISTINCT employees.emp_id, \
                    employees.name, \
                    locations.location_name, \
                    companies.company_name, \
                    departments.department_name, \
                    designations.designation_name, \
                    emp_app_profile.emp_image \
                    FROM employees  \
                    RIGHT OUTER JOIN emp_chats ON employees.emp_id = emp_chats.sender_id  \
                    OR \
                    employees.emp_id = emp_chats.receiver_id \
                    LEFT OUTER JOIN emp_app_profile ON employees.emp_id = emp_app_profile.emp_id \
                    LEFT OUTER JOIN locations ON employees.location_code = locations.location_code \
                    LEFT OUTER JOIN companies ON employees.company_code = companies.company_code \
                    LEFT OUTER JOIN departments ON employees.department_code = departments.department_code \
                    LEFT OUTER JOIN designations ON employees.designation_code = designations.designation_code \
                    WHERE employees.emp_status = 'Active' AND employees.name LIKE '%" + SearchKey + "%' \
                    ORDER BY emp_chats.id DESC;";
                }
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
            
                            console.log(q)
                            res.send( rslt );
                            res.end();
                            connection.release();
            
                        }
            
                    }
                );
            }

        }
    )

} );

router.post('/getemployeewithchat', ( req, res ) => {

    const { sender, receiver, chatDate } = req.body;
    const d = new Date();
    const d2 = new Date( chatDate );

    db.getConnection(
        ( err, connection ) => {

            if ( err )
            {

                res.status(503).send(err);
                res.end();

            }else
            {
                connection.query(
                    "SELECT emp_chats.* \
                    FROM \
                    emp_chats \
                    WHERE sender_id = " + sender + " AND receiver_id = " + receiver + " OR receiver_id = " + sender + " AND sender_id = " + receiver + " AND sender_status != 'deleted' LIMIT 100",
                    ( err, rslt ) => {
            
                        if( err )
                        {
                            res.status(500).send(err);
                            res.end();
                            connection.release();
            
                        }else 
                        {

                            connection.query(
                                "UPDATE emp_chats SET read_status = 'Read', read_time = '" + d.toTimeString() + "', read_date = '" + d.getFullYear() + '-' + parseInt(d.getMonth() + 1) + '-' + d.getDate() + "' WHERE read_status = 'Not Read' AND receiver_id = " + receiver + " AND sender_id = " + sender,
                                ( err ) => {
                        
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
            }

        }
    )

} );

router.post('/insertchat', ( req, res ) => {

    const { senderID, receiverID, ChatBody } = req.body;
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
                    "INSERT INTO emp_chats (sender_id, receiver_id, chat_body, send_date, send_time, sender_status, read_status) VALUES(?,?,?,?,?,?,?)",
                    [ senderID, receiverID, ChatBody, d, d.toTimeString(), 'Sent', 'Not Read' ],
                    ( err, rslt ) => {
            
                        if( err )
                        {
            
                            res.status(500).send(err);
                            res.end();
                            connection.release();
            
                        }else
                        {
                            // connection.query(
                            //     "SELECT name, cell FROM employees WHERE emp_id = ?;" + 
                            //     "SELECT name, cell FROM employees WHERE emp_id = ?;",
                            //     [ senderID, receiverID ],
                            //     ( err, result ) => {
                        
                            //         if( err )
                            //         {
                        
                            //             console.log( err );
                            //             res.send( err );
                            //             res.end();
                        
                            //         }else
                            //         {
                            //             SendWhatsappNotification( null, null,`${result[0][0].name} is saying...`, ChatBody, result[1][0].cell );
                            //         }
                                    
                            //     }
                            // );
                            res.send( rslt );
                            res.end();
                            connection.release();
                        }
            
                    }
                );
            }

        }
    )

} );

router.post('/chatattachement', ( req, res ) => {

    const { Attachements, sender, receiver } = req.body;
    const d = new Date();

    myCache.set(
        sender.toString() + '_' + d.getTime().toString() + '===',
        JSON.stringify([{ sender: sender, receiver: receiver }, JSON.parse(Attachements)]),
        604800
    );

    res.send( 'https://192.168.10.116:3000/#/download_drive/' + sender.toString() + '_' + d.getTime().toString() + '===' );
    res.end();

} );

router.post('/downloaddrive', ( req, res ) => {

    const { Key } = req.body;

    let response = 'NOT FOUND';
    if ( myCache.get( Key + '===' ) )
    {

        response = JSON.parse( myCache.get( Key + '===' ) );
        res.send( response );
        res.end();

    }else
    {
        res.send( response );
        res.end();
    }

} );












// router.post('/downloaddrive', ( req, res ) => {

//     const { Key } = req.body;

//     let response = 'NOT FOUND';
//     if ( myCache.get( Key + '===' ) )
//     {

//         response = JSON.parse( myCache.get( Key + '===' ) );

//         var uploadDir = fs.readdirSync( 'client/images/drive/' + response[1][0].name.split('/')[0] ); 
//         const zip = new AdmZip();

//         for (var i = 0; i < response[1].length;i++){

//             let file = uploadDir.filter(
//                 ( val ) => {

//                     return val === response[1][i].name.split('/')[1];

//                 }
//             );
            
//             if ( file[0] )
//             {
//                 zip.addLocalFile( 'client/images/drive/' + response[1][0].name.split('/')[0] + '/' + file[0] );
//             }

//         }

//         // Define zip file name
//         const downloadName = `${Date.now()}.zip`;

//         const data = zip.toBuffer();
        
//         // save file zip in root directory
//         zip.writeZip( 'client/images/drive/' + response[1][0].name.split('/')[0] + '/' + downloadName );

//         res.set('Content-Type', 'application/octet-stream');
//         res.set('Content-Disposition', `attachment; filename=${downloadName}`);
//         res.set('Content-Length', data.length);

//         // console.log( data );
//         // res.send(JSON.stringify( data ));
//         res.send( data );
// res.end();

//     }else
//     {
//         res.send( response );
                            // res.end();
//     }

// } );

module.exports = router;