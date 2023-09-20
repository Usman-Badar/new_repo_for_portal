const express = require('express');
const router = express.Router();
const db = require('../../db/connection');

router.get('/getallaccess', ( req, res ) => {
  
    db.getConnection(
        ( err, connection ) => {

            if ( err )
            {

                
                res.status(503).send(err);
                res.end();

            }else
            {
                connection.query(
                    "SELECT * FROM accesses",
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

router.post('/getemployeeaccess', ( req, res ) => {

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
                    "SELECT emp_access.access FROM emp_access WHERE emp_id = " + empID,
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

router.post('/getemployeeaccesslike', ( req, res ) => {

    const { access } = req.body;

    let q = "SELECT emp_id FROM employees";
    if ( access )
    {
        let acc = JSON.parse(access);
        q = q.concat(' WHERE ', "access LIKE '%" + acc[0] + "%'");
        for ( let x = 0; x < acc.length; x++ )
        {
            q = q.concat(" OR ", "access LIKE '%" + acc[x] + "%'");
        }
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
      )
  
} );

router.post('/checkattaccess', ( req, res ) => {

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
                    "SELECT employees.access FROM employees WHERE emp_id = " + empID,
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

module.exports = router;