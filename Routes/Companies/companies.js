const express = require('express');
const router = express.Router();
const db = require('../../db/connection');

const CreateLogs = require('../Employee/logs').CreateLog;

router.post('/addnewcompany', ( req, res ) => {

    const { company_code, code, company_name, website, logo } = req.body;
    
    db.query(
        "SELECT company_code FROM `companies` WHERE company_code = ?;",
        [ company_code ],
        ( err, rslt ) => {
            
            if( err )
            {
                
                res.status(500).send(err);
                res.end();
                
            }else 
            {
                
                if ( rslt[0] )
                {
                    res.send("COMPANY EXISTS");
                    res.end();
                }else
                {
                    db.query(
                        "INSERT INTO `companies`(`company_code`, `code`, `company_name`, `website`, `logo`) VALUES (?,?,?,?,?);",
                        [ company_code, code, company_name, website, logo ],
                        ( err ) => {
                            
                            if( err )
                            {
                                
                                res.status(500).send(err);
                                res.end();
                                
                            }else 
                            {
                                
                                CreateLogs( 
                                    'companies', 
                                    company_code,
                                    "New Company " + company_name + " added",
                                    'info'
                                );
                                res.send("SUCCESS");
                                res.end();
                
                            }
                
                        }
                    )
                }

            }

        }
    )

} );

router.post('/getcompanylogs', ( req, res ) => {

    const { company_code } = req.body;

    db.query(
        "SELECT * \
        FROM \
        tbl_logs \
        WHERE  \
        tbl_logs.tbl_name = 'companies' AND tbl_logs.id = ?",
        [ company_code ],
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

router.post('/getcompanylocations', ( req, res ) => {

    const { company_code } = req.body;
    
    db.getConnection(
        ( err, connection ) => {
            
            if ( err )
            {
                
                
                res.status(503).send(err);
                res.end();
                
            }else
            {
                db.query(
                    "SELECT locations.*, \
                    company_locations.* \
                    FROM company_locations \
                    LEFT OUTER JOIN locations ON company_locations.location_code = locations.location_code \
                    WHERE company_locations.company_code = " + company_code,
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

router.get('/getcompaniescodes', ( req, res ) => {

    db.query(
        "SELECT * FROM companies Where status_view = 'Y' ORDER BY company_name ASC",
       //"SELECT * FROM companies ",
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

router.post('/getcompany', ( req, res ) => {

    const { CompanyCode } = req.body;

    db.getConnection(
        ( err, connection ) => {

            if ( err )
            {

                res.status(503).send(err);
                res.end();

            }else
            {
                connection.query(
                    "SELECT emp_id FROM employees WHERE company_code = " + CompanyCode + " GROUP BY emp_id DESC LIMIT 1",
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

router.get('/getlastcompanycode', ( req, res ) => {

    db.getConnection(
        ( err, connection ) => {

            if ( err )
            {
                res.status(503).send(err);
                res.end();

            }else
            {
                connection.query(
                    "SELECT company_code FROM companies GROUP BY company_code DESC LIMIT 1",
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

router.get('/getallcompanies', ( req, res ) => {

    db.query(
        "SELECT * FROM companies WHERE Status_View = 'Y' GROUP BY company_name ASC",
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

router.post('/getshortcompanyname', ( req, res ) => {

    const { company_code } = req.body;

    db.getConnection(
        ( err, connection ) => {

            if ( err )
            {

                res.status(503).send(err);
                res.end();

            }else
            {
                connection.query(
                    "SELECT code FROM companies WHERE company_code = ?",
                    [ company_code ],
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