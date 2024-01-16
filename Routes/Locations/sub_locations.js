const express = require('express');
const router = express.Router();
const db = require('../../db/connection');

router.post('/addinvtrysublocation', ( req, res ) => {

    const { SubLocationName, SubLocationCode, LocationCode } = req.body;

    db.getConnection(
        ( err, connection ) => {

            if ( err )
            {

                res.status(503).send(err);
                res.end();

            }else
            {
                
                connection.query(
                    'INSERT INTO invtry_sub_locations (sub_location_name, sub_location_code, location_code) VALUES (?,?,?)',
                    [SubLocationName, SubLocationCode, LocationCode],
                    (err, rslt) => {

                        if (err) {

                            res.status(500).send(err);
                            res.end();
                            connection.release();

                        } else {

                            res.send('Done');
                            res.end();
                            connection.release();

                        }

                    }
                )

            }

        }
    )

} );

router.post('/getallsublocations', ( req, res ) => {

    const { location_code } = req.body;

    db.query(
        "SELECT * FROM tbl_inventory_sub_locations WHERE tbl_inventory_sub_locations.location_code = " + location_code,
        ( err, rslt ) => {
            res.send(rslt);
            res.end();
        }
    )

} );

router.post('/deleteinvtrysublocation', ( req, res ) => {

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
                    "DELETE FROM invtry_sub_locations WHERE sub_location_code = " + EditCtgryID,
                    ( err, rslt ) => {
            
                        if( err )
                        {

                            res.status(500).send(err);
                            res.end();
                            connection.release();
            
                        }else 
                        {
                            
                            res.send('Done');
                            res.end();
                            connection.release();
            
                        }
            
                    }
                )
            }

        }
    )

} );

router.post('/updateinvtrysublocation', ( req, res ) => {

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
                    "UPDATE invtry_sub_locations SET sub_location_name = '" + EditAstName + "', sub_location_code = " + parseInt( EditAstID ) + " WHERE sub_location_code = " + parseInt(EditAstCode),
                    ( err, rslt ) => {
            
                        if( err )
                        {
                            
                            res.status(500).send(err);
                            res.end();
                            connection.release();
            
                        }else 
                        {
            
                            res.send('Done');
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