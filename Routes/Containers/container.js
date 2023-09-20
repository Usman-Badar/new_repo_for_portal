const express = require('express');
const router = express.Router();
const db = require('../../db/connection');

router.post('/container/get/list', ( req, res ) => {

  const { emp_id } = req.body;

    db.query(
        "SELECT \
        tbl_containers.*, \
        employees.name \
        FROM `tbl_containers`  \
        LEFT OUTER JOIN employees ON tbl_containers.entered_by = employees.emp_id \
        WHERE tbl_containers.entered_by = ? ORDER BY id DESC;",
        [ emp_id ],
        ( err, rslt ) => {

            if( err )
            {

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

router.post('/container/new_entry', ( req, res ) => {

    const { emp_id, container_no, location_code, status } = req.body;
  
    db.query(
        "SELECT container_no FROM `tbl_containers` WHERE container_no = ? AND status = ?;",
        [ container_no, status ],
        ( err, rslt ) => {

            if( err )
            {

                res.status(500).send(err);
                res.end();

            }else 
            {

                if ( rslt[0] )
                {
                    res.send('exists');
                    res.end();
                }else
                {
                    db.query(
                        "INSERT INTO `tbl_containers`(`container_no`, `status`, `entered_by`, `entered_date`, `entered_time`, `location_code`) VALUES (?,?,?,?,?,?);",
                        [ container_no, status, emp_id, new Date(), new Date().toTimeString(), location_code ],
                        ( err ) => {
                
                            if( err )
                            {
                
                                res.status(500).send(err);
                                res.end();
                
                            }else 
                            {
                
                                res.send('success');
                                res.end();
                
                            }
                
                        }
                    )
                }

            }

        }
    )
  
  } );

module.exports = router;