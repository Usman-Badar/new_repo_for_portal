const mysql = require('mysql');

const db = mysql.createPool( 
    {
        host: '127.0.0.1',
        port : process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME_2,
        multipleStatements: true,
        supportBigNumbers: true,
        waitForConnections: true,
        connectionLimit: 300,
        queueLimit: 300,
        connectTimeout: 10000,
        acquireTimeout: 10000,
        dateStrings: true,
    }
);

function checkConnection()
{
    db.getConnection(
        ( err ) => {
            if ( err ) {
                console.log( '\x1b[31m%s\x1b[0m', err.message );
                console.log('\x1b[33m%s\x1b[0m', `MYSQL Database: ${process.env.DB_NAME_2} is not connected`);
                console.log("Retrying...");
                console.log("\n");
                setTimeout(() => {
                    checkConnection();
                }, 2000);
            }else {
                console.log('\x1b[32m%s\x1b[0m', `MYSQL Database: ${process.env.DB_NAME_2} connected.`);
            }
        }
    )
}

checkConnection();

setInterval(() => {
    const tbl = [
        {
            "Total Connections": db._allConnections.length,
            "Acquiring Connections": db._acquiringConnections.length,
            "Free Connections": db._freeConnections.length,
            "Connections in Queue": db._connectionQueue.length,
            Date: new Date().toLocaleString(),
        }
    ];
    console.table(tbl);
}, 1000 * 60);

module.exports = db;