import React, { useEffect, useState } from "react";
import './PR_printUI.css';
import QFS from './Logos/QFS-LOGO.PNG';
import SBS from './Logos/SEABOARD-SERVICES.PNG';
import SBL from './Logos/SBL-LOGO.PNG';
import axios from "../../../../../axios";

const PR_printUI = () => {

    const [ListDetails, setListDetails] = useState(
        {
            info: [],
            specifications: []
        }
    )


    useEffect(
        () => {

            let pr_id = window.location.href.split('/').pop(); // RETURNS AN ID ( PR ID ) FROM THE URL

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

        }, [ window.location.href.split('/').pop() ]
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
                    (val, index) => {
                        
                        
                        const d1 = new Date( val.approve_date );
                        const d2 = new Date( val.discard_date );
                        const d3 = new Date( val.request_date );
                        const d4 = new Date( val.view_date );

                        return (
                            <>
                                <div className="PR_printUI" style={ { fontFamily: 'Poppins' } }>
                                    <div className="PR_printUI_Div">
                                        <div className="PR_printUI_header">
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
                                                        <p>{val.pr_company_name}</p>
                                                    </div>
                                                    <div className="d-flex">
                                                        <p className="font-weight-bolder mr-3">Delivery / Work Location : </p>
                                                        <p> { val.location_name } </p>
                                                    </div>
                                                </div>
                                                <div className="w-25">
                                                    <div className="d-flex border py-1">
                                                        <div className="border-right w-50 text-center"><p className="font-weight-bolder">PR Number  </p></div>
                                                        <div className="text-center w-50"><p>{val.pr_code}</p></div>
                                                    </div>
                                                    <div className="d-flex border py-1">
                                                        <div className="border-right w-50 text-center"><p className="font-weight-bolder">Date  </p></div>
                                                        <div className="text-center w-50"><p>{d3 ? d3.toDateString() : null}</p></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="PR_prinUI_Content">
                                            <div className="PR_printUI_Middle">
                                                <div className="PR_printUI_Grid" style={{ backgroundColor: "rgb(243, 243, 243)" }}>
                                                    <div><p className="font-weight-bolder">Sr: No:</p></div>
                                                    <div><p className="font-weight-bolder">Description</p></div>
                                                    <div><p className="font-weight-bolder">Quantity</p></div>
                                                    <div><p className="font-weight-bolder" >Estimated Cost</p></div>
                                                    <div><p className="font-weight-bolder">Total Cost</p></div>
                                                </div>
                                                {
                                                    ListDetails.specifications.map(
                                                        (val, index) => {

                                                            return (
                                                                <>
                                                                    <div key={index} className="PR_printUI_Grid">
                                                                        <div><p>{index + 1}</p></div>
                                                                        <div><p>{val.description}</p></div>
                                                                        <div><p>{val.quantity}</p></div>
                                                                        <div><p>Rs { val.price.toLocaleString('en-US') }</p></div>
                                                                        <div><p>Rs { val.amount.toLocaleString('en-US') }</p></div>
                                                                    </div>
                                                                    {
                                                                        arr.includes(index)
                                                                            ?
                                                                            <>
                                                                                <div
                                                                                    style={
                                                                                        {
                                                                                            breakAfter: 'page'
                                                                                        }
                                                                                    }
                                                                                ></div>
                                                                                <div
                                                                                    style={
                                                                                        {
                                                                                            height: '30vh'
                                                                                        }
                                                                                    }
                                                                                ></div>
                                                                            </>
                                                                            :
                                                                            null
                                                                    }
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
                                                    <div><p>Rs {val.total.toLocaleString('en-US')}</p></div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="PR_printUI_Footer">
                                            <div className="w-100">
                                                <div className="PR_printUI_Remarks mt-4" style={{ backgroundColor: "rgb(243, 243, 243)" }}>
                                                    <div className="DIVS" ><p className="font-weight-bolder">Sumbitted By</p></div>
                                                    {
                                                        val.discard_emp_name === null
                                                        ?
                                                        <div className="DIVS" ><p className="font-weight-bolder">Approved By</p></div>
                                                        :
                                                        <div className="DIVS" ><p className="font-weight-bolder">Discard By</p></div>
                                                    }
                                                    <div className="DIVS" ><p className="font-weight-bolder">Submitted To</p></div>
                                                </div>
                                                <div className="PR_printUI_Remarks PR_printUI_Remark">
                                                    <div >
                                                        <div className="DIVS" ><p className="font-weight-bolder ">Name : </p><p>{val.sender_name}</p></div>
                                                        <div className="DIVS" ><p className="font-weight-bolder">Date : </p><p>{d3.toDateString()}</p></div>
                                                    </div>
                                                    {
                                                        val.discard_emp_name === null
                                                        ?
                                                        <div>
                                                            <div className="DIVS" ><p className="font-weight-bolder">Name : </p><p> {val.approve_emp_name}</p></div>
                                                            <div className="DIVS" ><p className="font-weight-bolder">Date : </p><p>{d1.toDateString()}</p></div>
                                                        </div>
                                                        :
                                                        <div>
                                                            <div className="DIVS" ><p className="font-weight-bolder">Name : </p><p> {val.discard_emp_name}</p></div>
                                                            <div className="DIVS" ><p className="font-weight-bolder">Date : </p><p>{d2.toDateString()}</p></div>
                                                        </div>
                                                    }
                                                    <div >
                                                        <div className="DIVS" ><p className="font-weight-bolder">Name : </p><p>Antash Javaid</p></div>
                                                        <div className="DIVS" ><p className="font-weight-bolder">Date : </p><p>{d4.toDateString()}</p></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )
                    }
                )
            }
        </>
    )
}
export default PR_printUI;