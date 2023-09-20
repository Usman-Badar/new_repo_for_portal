import React, { useEffect, useState } from "react";
import './Bills.css';

import axios from "../../../../../axios";

const Bills = () => {

    const [Bills, setBills] = useState([]);

    
    useEffect(
        () => {

            let po_id = window.location.href.split('/').pop(); // RETURNS AN ID ( PO ID ) FROM THE URL

            axios.post(
                '/getpurchaseorderdetails',
                {
                    po_id: po_id,
                    pr_id: null
                }
            ).then(
                (res) => {

                    setBills( res.data[2] );

                }
            ).catch(err => {

                console.log(err);

            })

        }, []
    )

    return (
        <>
            {
                Bills.map(
                    (val) => {
                        return (
                            <>
                                <div className="Bills">
                                    <div><img src={ 'images/Inventory/po_attachments/' + val.image } alt="Bills" /></div>
                                </div>
                            </>
                        )
                    }
                )
            }
        </>
    )
}
export default Bills;