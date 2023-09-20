const express = require('express');
const router = express.Router();
const db = require('../../../db/connection');

router.post('/getallsubinvtryassets', ( req, res ) => {

    const { AssetCode } = req.body;

    db.getConnection(
        ( err, connection ) => {

            if ( err )
            {
                res.status(503).send(err);
                res.end();

            }else
            {
                connection.query(
                    "SELECT invtry_asset_categories.*, invtry_asset_sub_categories.* FROM invtry_asset_categories RIGHT OUTER JOIN invtry_asset_sub_categories ON invtry_asset_categories.asset_id = invtry_asset_sub_categories.asset_id WHERE invtry_asset_categories.asset_id = " + AssetCode,
                    ( err, rslt ) => {
            
                        if( err )
                        {
            
                            connection.release();
                            res.send( err );
            
                        }else 
                        {
            
                            connection.release();
                            res.send(rslt);
            
                        }
            
                    }
                )
            }

        }
    )

} );

router.post('/addinvtrysubasset', ( req, res ) => {

    const { SubAssetName, SubAssetCode, AssetCode } = req.body;

    db.getConnection(
        ( err, connection ) => {

            if ( err )
            {

                res.status(503).send(err);
                res.end();

            }else
            {
                connection.query(
                    'INSERT INTO invtry_asset_sub_categories (sub_asset_name, sub_asset_code, asset_id) VALUES (?,?,?)',
                    [ SubAssetName, SubAssetCode, AssetCode ],
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

router.post('/deleteinvtrysubasset', ( req, res ) => {

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
                    "DELETE FROM invtry_asset_sub_categories WHERE sub_asset_id = " + EditCtgryID,
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

router.post('/updateinvtrysubasset', ( req, res ) => {

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
                    "UPDATE invtry_asset_sub_categories SET sub_asset_name = '" + EditAstName + "', sub_asset_code = '" + EditAstCode + "' WHERE sub_asset_id = " + EditAstID,
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

module.exports = router;