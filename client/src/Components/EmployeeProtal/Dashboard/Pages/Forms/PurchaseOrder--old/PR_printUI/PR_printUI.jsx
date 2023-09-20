import React, { useEffect, useState } from "react";

import './PR_printUI.css';

import QFS from './Logos/QFS-LOGO.PNG';
import SBS from './Logos/SEABOARD-SERVICES.PNG';
import SBL from './Logos/SBL-LOGO.PNG';

import axios from '../../../../../../../axios';

const PR_printUI = ( props ) => {

    const [ListDetails, setListDetails] = useState(
        {
            info: [],
            specifications: []
        }
    )

    useEffect(
        () => {

            let pr_id = props.PrID; // RETURNS AN ID ( PR ID )

            axios.post(
                '/getpurchaseorderdetails',
                {
                    pr_id: pr_id,
                    po_id: null
                }
            ).then(
                (res) => {
                    
                    setListDetails(
                        {
                            info: res.data[4],
                            specifications: res.data[5]
                        }
                    )

                }
            ).catch(err => {

                console.log(err);

            })

        }, [ props.PrID ]
    )

    let num = 20;
    let arr = [];// [ 15, 30, 45, 60, 75, 90, 105, 120, 135, 150 ];

    for (let x = 1; x <= 12; x++) {
        arr.push(x * num);
    }

    return (
        <>
            {
                ListDetails.info.map(
                    ( val, index ) => {

                        const d1 = new Date( val.approve_date );
                        const d2 = new Date( val.discard_date );
                        const d3 = new Date( val.request_date );

                        return (
                            <div className="PR_printUI" key={ index }>
                                <div className="PR_printUI_Div">
                                    <h1 className=" font-weight-bolder text-center">Seaboard Group</h1>
                                    <div className="PR_printUI_Logos">
                                        <div><img src={QFS} alt="QFS Logo" /></div>
                                        <div><img src={SBS} alt="SBS Logo" /></div>
                                        <div><img src={SBL} alt="SBL Logo" /></div>
                                    </div>
                                    <h3 className="font-weight-bolder text-center" >Purchase Requisition</h3>
                                    <div className="PR_printUI_Top mt-5">
                                        <div>
                                            <div className="d-flex">
                                                <p className="font-weight-bolder mr-3">Comapny Name : </p>
                                                <p> { val.pr_company_name } </p>
                                            </div>
                                            <div className="d-flex">
                                                <p className="font-weight-bolder mr-3">Delivery / Work Location : </p>
                                                <p> { val.location_name } </p>
                                            </div>
                                        </div>
                                        <div style={ { width: '40%' } }>
                                            <div className="d-flex border py-1">
                                                <div className="border-right w-50 text-center"><p className="font-weight-bolder">PR Number  </p></div>
                                                <div className="text-center w-50"><p> { val.pr_code } </p></div>
                                            </div>
                                            <div className="d-flex border py-1">
                                                <div className="border-right w-50 text-center"><p className="font-weight-bolder">Date  </p></div>
                                                <div className="text-center w-50"><p> { d1 ? d1.toString().substring(0,15) : null } </p></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="PR_printUI_Middle">
                                        <div className="PR_printUI_Grid" style={{ backgroundColor: "rgb(243, 243, 243)" }}>
                                            <div><p className="font-weight-bolder">Sr: No:</p></div>
                                            <div><p className="font-weight-bolder">Description</p></div>
                                            <div><p className="font-weight-bolder">Quantity</p></div>
                                            <div><p className="font-weight-bolder" >Estimated Cost</p></div>
                                            <div><p className="font-weight-bolder" >Tax</p></div>
                                            <div><p className="font-weight-bolder">Total Cost</p></div>
                                        </div>
                                        {
                                            ListDetails.specifications.map(
                                                (val, index) => {
                                                    return (
                                                        <>
                                                            <div className="PR_printUI_Grid">
                                                                <div><p>{ index + 1 }</p></div>
                                                                <div><p>{ val.description }</p></div>
                                                                <div><p>{ val.quantity }</p></div>
                                                                <div><p>{ val.price }</p></div>
                                                                <div><p>{ val.tax + '%' }</p></div>
                                                                <div><p>{ 'Rs ' + val.amount.toLocaleString('en-US') }</p></div>
                                                            </div>
                                                        </>
                                                    )
                                                }
                                            )
                                        }
                                        <div className="PR_printUI_Grid">
                                            <div></div>
                                            <div style={{ backgroundColor: "rgb(243, 243, 243)" }}><p className="font-weight-bolder text-right mr-2">Total :</p></div>
                                            <div><p></p></div>
                                            <div><p></p></div>
                                            <div><p></p></div>
                                            <div><p>Rs { val.total.toLocaleString('en-US') } </p></div>
                                        </div>
                                    </div>
                                    <div className="PR_printUI_Bottom">
                                        <div className="PR_printUI_Grid1" style={{ backgroundColor: "rgb(243, 243, 243)" }}>
                                            <div><p className="font-weight-bolder">Sr: No:</p></div>
                                            <div><p className="font-weight-bolder">Reason</p></div>
                                        </div>
                                        {
                                            ListDetails.specifications.map(
                                                (val, index) => {
                                                    return (
                                                        <>
                                                            <div className="PR_printUI_Grid1">
                                                                <div><p>{ index + 1 }</p></div>
                                                                <div className="text-justify px-2"><p>{ val.reason }</p></div>
                                                            </div>
                                                        </>
                                                    )
                                                }
                                            )
                                        }
                                        <div className="PR_printUI_Remarks mt-4" style={{ backgroundColor: "rgb(243, 243, 243)" }}>
                                            <div className="DIVS" ><p className="font-weight-bolder">Sumbitted By</p></div>
                                            <div className="DIVS" ><p className="font-weight-bolder">Approved By</p></div>
                                            <div className="DIVS" ><p className="font-weight-bolder">Submitted To</p></div>
                                        </div>
                                        <div className="PR_printUI_Remarks PR_printUI_Remark">
                                            <div >
                                                <div className="DIVS" ><p className="font-weight-bolder mr-3">Name : </p><p> { val.sender_name } </p></div>
                                                <div className="DIVS" ><p className="font-weight-bolder">Date : </p><p>{ d1 ? d1.toString().substring(0,15) : null }</p></div>
                                            </div>
                                            <div >
                                                <div className="DIVS" ><p className="font-weight-bolder mr-3">Name : </p><p> { val.approve_emp_name } </p></div>
                                                <div className="DIVS" ><p className="font-weight-bolder">Date : </p><p>{ d2 ? d2.toString().substring(0,15) : null }</p></div>
                                            </div>
                                            <div >
                                                <div className="DIVS" ><p className="font-weight-bolder mr-3">Name : </p><p> { val.handle_emp_name } </p></div>
                                                <div className="DIVS" ><p className="font-weight-bolder">Date : </p><p>{ d3 ? d3.toString().substring(0,15) : null }</p></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )

                    }
                )
            }
        </>
    )
}
export default PR_printUI;