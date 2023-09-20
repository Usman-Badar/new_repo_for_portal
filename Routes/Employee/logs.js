const express = require('express');
const router = express.Router();
const db = require('../../db/connection');

router.post('/newlog', ( req, res ) => {

    const { empID, table, id, desc, from, to } = req.body;
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
                    // "INSERT INTO logs (emp_id, table, id, description, from, to, date, time) VALUES (?,?,?,?," + JSON.stringify(from) + "," + JSON.stringify(to) + ",?,?)",
                    "SELECT 1",
                    // [ parseInt(empID), table, parseInt( id ), desc, d, d.toTimeString() ],
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
    )

} );

const CreateLog = ( tbl_name, get_id, log, log_type, action_type ) => {

    const d = new Date();

    db.query(
        "INSERT INTO `tbl_logs`(`tbl_name`, `id`, `log`, `log_time`, `log_date`, `log_type`, `action_type`) VALUES (?,?,?,?,?,?,?)",
        [tbl_name, get_id, log, d.toTimeString(), d, log_type, action_type ? action_type : 'edit'],
        (err) => {

            if (err) {
                console.log(err);
            }

        }
    )

}

module.exports = {
    router: router,
    CreateLog: ( tbl_name, get_id, log, log_type, action_type ) => CreateLog( tbl_name, get_id, log, log_type, action_type )
};