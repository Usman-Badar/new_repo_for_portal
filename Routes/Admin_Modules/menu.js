const express = require('express');
const router = express.Router();
const db = require('../../db/connection');

router.get('/admin_getallmenuitems', ( req, res ) => {

    db.query(
        "SELECT * FROM `tbl_portal_menu`",
        ( err, rslt ) => {

            if( err )
            {

                res.status(500).send(err);
                res.end();

            }else 
            {

                res.send(rslt);
                res.end();

            }

        }
    )

} );

router.post('/admin_changemenuitemindexing', ( req, res ) => {

    const { index, id } = req.body;

    db.query(
        "UPDATE `tbl_portal_menu` set indexing = ? WHERE id = ?",
        [ index, id ],
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

} );

router.get('/admin_getallmenuitemviews', ( req, res ) => {

    db.query(
        "SELECT tbl_portal_menu.view FROM `tbl_portal_menu` GROUP BY tbl_portal_menu.view;",
        ( err, rslt ) => {

            if( err )
            {

                res.status(500).send(err);
                res.end();

            }else 
            {

                res.send(rslt);
                res.end();

            }

        }
    )

} );

router.get('/admin_getallmenuitemoptions', ( req, res ) => {

    db.query(
        "SELECT tbl_portal_menu.option_id FROM `tbl_portal_menu` WHERE tbl_portal_menu.option_id IS NOT NULL GROUP BY tbl_portal_menu.option_id;",
        ( err, rslt ) => {

            if( err )
            {

                res.status(500).send(err);
                res.end();

            }else 
            {

                res.send(rslt);
                res.end();

            }

        }
    )

} );

router.post('/admin_enternewmenuitem', ( req, res ) => {

    const { menu_txt, icon_class_name, type, option_id, link, view, under_menu, access } = req.body;
    let accessArr = access;
    if ( access === '[]' )
    {
        accessArr = null;
    }else
    if ( access === '' )
    {
        accessArr = null;
    }

    db.query(
        "INSERT INTO `tbl_portal_menu`(`menu_txt`, `icon_class_name`, `type`, `option_id`, `link`, `view`, `under_menu`, `access`) VALUES (?,?,?,?,?,?,?,?);",
        [ menu_txt, icon_class_name, type, option_id === '' ? null : option_id, link === '' ? null : link, view, under_menu === '' ? null : under_menu, accessArr ],
        ( err ) => {

            if( err )
            {

                res.status(500).send(err);
                res.end();

            }else 
            {

                res.send("SUCCESS");
                res.end();

            }

        }
    )

} );

router.post('/admin_editmenuitem', ( req, res ) => {

    const { id, menu_txt, icon_class_name, type, option_id, link, view, under_menu, access } = req.body;
    let accessArr = access;
    if ( access === '[]' )
    {
        accessArr = null;
    }else
    if ( access === '' )
    {
        accessArr = null;
    }

    db.query(
        "UPDATE `tbl_portal_menu` SET `menu_txt`=?,`icon_class_name`=?,`type`=?,`option_id`=?,`link`=?,`view`=?,`under_menu`=?,`access`=? WHERE id = ?;",
        [ menu_txt, icon_class_name, type, option_id === '' ? null : option_id, link === '' ? null : link, view, under_menu === '' ? null : under_menu, accessArr, id ],
        ( err ) => {

            if( err )
            {

                res.status(500).send(err);
                res.end();

            }else 
            {

                res.send("SUCCESS");
                res.end();

            }

        }
    )

} );

router.post('/admin_removemenuitem', ( req, res ) => {

    const { id } = req.body;

    db.query(
        "DELETE FROM `tbl_portal_menu` WHERE id = ?;",
        [ id ],
        ( err ) => {

            if( err )
            {

                res.status(500).send(err);
                res.end();

            }else 
            {

                res.send("SUCCESS");
                res.end();

            }

        }
    )

} );

module.exports = router;