const express = require('express');
const router = express.Router();
const db = require('../../db/connection');

setInterval(() => {

    db.query(
        "UPDATE emp_machine_thumbs SET emp_machine_thumbs.status = 'valid' WHERE emp_machine_thumbs.status = 'Waiting';",
        () => {

            console.log("Update All Thumb Statuses To Valid");

        }
    )
    
}, ( ( 1000 * 60 ) * 60 ) * 12);

module.exports = router;