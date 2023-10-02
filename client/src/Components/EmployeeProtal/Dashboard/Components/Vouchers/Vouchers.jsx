import React, { useEffect, useState } from "react";
import './Vouchers.css';

import axios from "../../../../../axios";

const Vouchers = () => {

    const [Vouchers, setVouchers] = useState([]);

    
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

                    console.log( res.data )
                    setVouchers( res.data[7] );

                }
            ).catch(err => {

                console.log(err);

            })

        }, []
    )

    return (
        <>
            {
                Vouchers.map(
                    (val) => {
                        return (
                            <>
                                <div className="Vouchers">
                                    <div><img src={ process.env.REACT_APP_SERVER+'/images/Inventory/po_vouchers/' + val.voucher } alt="voucher" /></div>
                                </div>
                            </>
                        )
                    }
                )
            }
        </>
    )
}
export default Vouchers;