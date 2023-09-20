const mysql = require('mysql');

const db = mysql.createPool( 
    {
        host: '127.0.0.1',
        port : '3306',
        user: 'root',
        password: '',
        database: 'seaboard',
        multipleStatements: true,
        supportBigNumbers: true,
        connectionLimit: 300

        // host: 'localhost',
        // port : '3306',
        // user: 'root',
        // password: 'vONn&p{c2\d_9ZXL',
        // database: 'id17010227_seaboard',
        // multipleStatements: true,
        // supportBigNumbers: true,
        // connectionLimit: 300
    }
);

// db.on(
//     'release', ( connection ) => {
//         console.log('Connection %d released', connection.threadId);
//     }
// );

// setInterval(() => {
    
//     db.end(function (err) {
//         // all connections in the pool have ended
//         console.log('Pool end')
//     });

// }, 2000);


setInterval(() => {
    console.log(`Database Open Connections ${ db._allConnections.length }`);
	console.log(`Acquiring Connections ${db._acquiringConnections.length}`);
	console.log(`Free Connections ${db._freeConnections.length}`);
	console.log(`Queue Connections ${db._connectionQueue.length}`);
}, 5000);

module.exports = db;
setInterval(() => {
setInterval(() => {
    console.log(`Database Open Connections ${ db._allConnections.length }`);
	console.log(`Acquiring Connections ${db._acquiringConnections.length}`);
	console.log(`Free Connections ${db._freeConnections.length}`);
	console.log(`Queue Connections ${db._connectionQueue.length}`);
}, 5000);
module.exports = db;
