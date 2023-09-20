const express = require('express');
const router = express.Router();
const db = require('../../../db/connection');

router.post('/addinvtryasset', ( req, res ) => {

    const { AssetName, AssetCode } = req.body;

    db.getConnection(
        ( err, connection ) => {

            if ( err )
            {

                res.status(503).send(err);
                res.end();

            }else
            {
                connection.query(
                    'INSERT INTO invtry_asset_categories (asset_name, asset_code) VALUES (?,?)',
                    [ AssetName, AssetCode ],
                    ( err, rslt ) => {
            
                        if( err )
                        {
            
                            connection.release();
                            res.send( err );
            
                        }else 
                        {
            
                            connection.release();
                            res.send('Done');
            
                        }
            
                    }
                )
            }

        }
    )

} );

router.post('/updateinvtryasset', ( req, res ) => {

    const { EditAstName, EditAstID, EditAstCode } = req.body;

    db.getConnection(
        ( err, connection ) => {

            if ( err )
            {

                res.status(503).send(err);
                res.end();

            }else
            {
                connection.query(
                    "UPDATE invtry_asset_categories SET asset_name = '" + EditAstName + "', asset_code = '" + EditAstCode + "' WHERE asset_id = " + EditAstID,
                    ( err, rslt ) => {
            
                        if( err )
                        {

                            connection.release();
                            res.send( err );
            
                        }else 
                        {
            
                            connection.release();
                            res.send('Done');
            
                        }
            
                    }
                )
            }

        }
    )

} );

router.post('/deleteinvtryasset', ( req, res ) => {

    const { EditCtgryID } = req.body;

    db.getConnection(
        ( err, connection ) => {

            if ( err )
            {

                res.status(503).send(err);
                res.end();

            }else
            {
                connection.query(
                    "DELETE FROM invtry_asset_categories WHERE asset_id = " + EditCtgryID,
                    ( err, rslt ) => {
            
                        if( err )
                        {
            
                            connection.release();
                            res.send( err );
            
                        }else 
                        {
            
                            connection.release();
                            res.send('Done');
            
                        }
            
                    }
                )
            }

        }
    )

} );

router.get('/getallinvtryassets', ( req, res ) => {

    db.getConnection(
        ( err, connection ) => {

            if ( err )
            {

                res.status(503).send(err);
                res.end();

            }else
            {
                connection.query(
                    "SELECT * FROM invtry_asset_categories GROUP BY asset_code ASC",
                    ( err, rslt ) => {
            
                        if( err )
                        {
            
                            connection.release();
                            res.send( err );
            
                        }else 
                        {
                            
                            connection.release();
                            res.send( rslt );
            
                        }
            
                    }
                )
        
            }

        }
    )

} );

module.exports = router;