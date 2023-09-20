const express = require('express');
const router = express.Router();
const db = require('../../db/connection');

router.get('/getallnewspapers', ( req, res ) => {

    
    db.getConnection(
        ( err, connection ) => {

            if ( err )
            {

                res.status(503).send(err);
                res.end();

            }else
            {
                connection.query(
                    "SELECT * FROM emp_news_papers ORDER BY id DESC",
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
    );

} );

router.post('/getnewspaper', ( req, res ) => {

    const { id } = req.body;
    
    db.getConnection(
        ( err, connection ) => {

            if ( err )
            {

                res.status(503).send(err);
                res.end();

            }else
            {
                connection.query(
                    'SELECT * from emp_news_papers WHERE id = ' + id,
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
    );

} );

router.get('/get_all_notices', ( req, res ) => {
    db.query(
        "SELECT * FROM `tbl_notices` ORDER BY id DESC;",
        ( err, rslt ) => {
            if( err )
            {
                console.log(err);
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

module.exports = router;