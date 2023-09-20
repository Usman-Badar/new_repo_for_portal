const mysql = require('mysql');

const db = mysql.createPool( 
    {
        host: '127.0.0.1',
        port : process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
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
    
            if ( err )
            {
                console.log( '\x1b[31m%s\x1b[0m', err.message );
                console.log('\x1b[33m%s\x1b[0m', "MYSQL Database is not connected");
                console.log("Retrying...");
                console.log("\n");
                setTimeout(() => {
                    checkConnection();
                }, 2000);
            }else
            {
                console.log('\x1b[32m%s\x1b[0m', "MYSQL Database connected.");
            }
    
        }
    )
}

checkConnection();

setInterval(() => {

    const tbl = [
        {
            Open: db._allConnections.length,
            Acquiring: db._acquiringConnections.length,
            Free: db._freeConnections.length,
            Queue: db._connectionQueue.length,
            Date: new Date().toDateString(),
            Time: new Date().toTimeString()
        }
    ];
    console.table(tbl);
    
}, 1000 * 60);

// DROP PROCEDURE IF EXISTS remove_inward;
// DELIMITER $$ 

// CREATE PROCEDURE `remove_inward`(IN _transaction_id INT) 
//     BEGIN
//         DECLARE `_rollback` BOOL DEFAULT 0; 
//         DECLARE EXIT HANDLER FOR SQLEXCEPTION 
//         BEGIN
//             ROLLBACK;
//             RESIGNAL;
//         END;
//         START TRANSACTION; 

//         UPDATE tbl_inventory_products a 
//         JOIN tbl_inventory_product_transactions b ON a.product_id = b.product_id 
//         SET a.quantity = a.quantity - b.stored_quantity 
//         WHERE b.transaction_id = _transaction_id; 
//         DELETE FROM `tbl_inventory_product_attributes` WHERE transaction_id = _transaction_id; 
//         DELETE FROM `tbl_inventory_product_transactions` WHERE transaction_id = _transaction_id; 

//         COMMIT;
//     END$$ 

// DELIMITER ;

module.exports = db;