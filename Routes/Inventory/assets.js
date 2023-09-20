const express = require('express');
const router = express.Router();
const db = require('../../db/connection');

router.get('/getallassets', ( req, res ) => {

    db.query(
        "SELECT tbl_assets.*, COUNT(tbl_sub_assets.sub_asset_id) as count_sub_assets FROM tbl_assets LEFT OUTER JOIN tbl_sub_assets ON tbl_assets.asset_id = tbl_sub_assets.asset_id WHERE tbl_assets.status = 'active' GROUP BY asset_code ASC",
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
    );

} );

router.post('/newasset', ( req, res ) => {

    const { data } = req.body;

    const val = JSON.parse( data );
    const d = new Date( val.date_time );

    db.getConnection(
        ( err, connection ) => {

            if ( err )
            {

                res.status(503).send(err);
                res.end();

            }else
            {
                connection.query(
                    "INSERT INTO tbl_assets (`asset_name`, `asset_code`, `created_at`) VALUES (?,?,?)",
                    [ val.asset_name, val.asset_code, d ],
                    ( err ) => {
            
                        if( err )
                        {
                            res.status(500).send(err);
                            res.end();
                            connection.release();
            
                        }else 
                        {
            
                            
                            res.send('success');
                            res.end();
                            connection.release();
            
                        }
            
                    }
                );
            }

        }
    );

} );

router.post('/deleteselectedassets', ( req, res ) => {

    const { assets } = req.body;

    const ids = JSON.parse( assets );

    let q = '';
    let parameters = [];
    for ( let x = 0; x < ids.length; x++ )
    {
        q = q.concat("UPDATE tbl_assets SET status = 'removed' WHERE asset_id = ?;");
        parameters.push( ids[x] );
    }

    db.query(
        q,
        parameters,
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
    );

} );

router.post('/updateselectedasset', ( req, res ) => {

    const { assets } = req.body;

    const data = JSON.parse( assets );

    db.query(
        "UPDATE tbl_assets SET asset_name = ?, asset_code = ? WHERE asset_id = ?;",
        [ data.asset_name, data.asset_code, data.asset_id ],
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
    );

} );

router.post('/getallsubassets', ( req, res ) => {

    const { asset_id } = req.body;

    db.query(
        "SELECT \
        tbl_sub_assets.*, \
        COUNT(tblitems.sub_asset_id) as count_sub_items \
        FROM tbl_sub_assets \
        LEFT OUTER JOIN tblitems ON tbl_sub_assets.sub_asset_id = tblitems.sub_asset_id \
        WHERE tbl_sub_assets.status = 'active' AND tbl_sub_assets.asset_id = ? GROUP BY tbl_sub_assets.sub_asset_code ASC",
        [ asset_id ],
        ( err, rslt ) => {

            if( err )
            {

                console.log( err );
                res.status(500).send(err);
                res.end();

            }else 
            {

                res.send( rslt );
                res.end();

            }

        }
    );

} );

router.post('/newsubasset', ( req, res ) => {

    const { data } = req.body;

    const val = JSON.parse( data );
    const d = new Date( val.date_time );

    db.query(
        "INSERT INTO tbl_sub_assets (`asset_id`, `sub_asset_name`, `sub_asset_code`, `created_at`) VALUES (?,?,?,?)",
        [ val.asset_id, val.sub_asset_name, val.sub_asset_code, d ],
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
    );

} );

router.post('/deleteselectedsubassets', ( req, res ) => {

    const { assets } = req.body;

    const ids = JSON.parse( assets );

    let q = '';
    let parameters = [];
    for ( let x = 0; x < ids.length; x++ )
    {
        q = q.concat("UPDATE tbl_sub_assets SET status = 'removed' WHERE sub_asset_id = ?;");
        parameters.push( ids[x] );
    }

    db.query(
        q,
        parameters,
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
    );

} );

router.post('/updateselectedsubasset', ( req, res ) => {

    const { assets } = req.body;

    const data = JSON.parse( assets );

    db.query(
        "UPDATE tbl_sub_assets SET sub_asset_name = ?, sub_asset_code = ? WHERE sub_asset_id = ?;",
        [ data.sub_asset_name, data.sub_asset_code, data.sub_asset_id ],
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
    );

} );

module.exports = router;