import React, { useEffect, useState } from "react";
import './Quatation.css';

import axios from "../../../../../axios";

const Quatation = () => {

    const [Quatation, setQuatation] = useState([]);

    
    useEffect(
        () => {

            let pr_id = window.location.href.split('/').pop(); // RETURNS AN ID ( PO ID ) FROM THE URL

            axios.post(
                '/getpurchaseorderdetails',
                {
                    po_id: null,
                    pr_id: pr_id
                }
            ).then(
                (res) => {

                    setQuatation( res.data[6] );

                }
            ).catch(err => {

                console.log(err);

            })

        }, []
    )

    return (
        <>
            {
                Quatation.map(
                    (val) => {
                        return (
                            <>
                                <div className="Quatation">
                                    <div><img src={ 'images/Inventory/pr_attachments/' + val.image } alt="Quatation" /></div>
                                </div>
                            </>
                        )
                    }
                )
            }
        </>
    )
}
export default Quatation;