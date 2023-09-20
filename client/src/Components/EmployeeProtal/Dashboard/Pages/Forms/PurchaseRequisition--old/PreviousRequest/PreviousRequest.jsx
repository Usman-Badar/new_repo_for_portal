import React,{ useState, useEffect } from "react";
import './PreviousRequest.css';

import axios from "../../../../../../../axios";


// import QFS from '../../../../../../../images/QFS-LOGO.PNG';
// import SBL from '../../../../../../../images/SBL-LOGO.PNG';
// import SBS from '../../../../../../../images/SEABOARD-SERVICES.PNG';

const PreviousRequest = () => {

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

        // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [ window.location.href ]
    )
    
    return (
        <>
            {
                ListDetails.info.map(
                    (val, index) => {

                        const d1 = val.discard_date === null && val.approve_date === null ? null : new Date( val.discard_date === null ? val.approve_date : val.discard_date );
                        const d2 = val.view_date === null ? null : new Date( val.view_date );
                        const d3 = new Date( val.request_date );

                        return (
                            <>
                                <div className="PR_printUI" key={ index }>
                                    <div className="PR_printUI_Div">
                                            {/* <h1 className=" font-weight-bolder text-center">Seaboard Group</h1>
                                            <div className="PR_printUI_Logos">
                                                <div><img src={QFS} alt="QFS Logo" /></div>
                                                <div><img src={SBS} alt="SBS Logo" /></div>
                                                <div><img src={SBL} alt="SBL Logo" /></div>
                                            </div> */}
                                            <h3 className="font-weight-bolder text-center" >Purchase Requisition</h3>
                                            <div className="PR_printUI_Top mt-5">
                                                <div>
                                                    <div className="PR_printUI_Top_select mb-2">
                                                        <div className="d-flex align-items-center"><p className="font-weight-bolder">Comapny Name : </p></div>
                                                        <div><p>{val.pr_company_name}</p></div>
                                                    </div>
                                                    <div className="PR_printUI_Top_select">
                                                        <div className="d-flex align-items-center"><p className="font-weight-bolder mr-3">Delivery / Work Location : </p></div>
                                                        <div><p> { val.location_name } </p></div>
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="PR_printUI_Top_select mb-2">
                                                        <div className="d-flex align-items-center mr-3"><p className="font-weight-bolder">PR Number  </p></div>
                                                        <div><p>{val.pr_code}</p></div>
                                                    </div>
                                                    <div className="PR_printUI_Top_select">
                                                        <div className="d-flex align-items-center mr-3"><p className="font-weight-bolder"> Date </p></div>
                                                        <div><p>{d3.toDateString()}</p></div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="PR_printUI_Middle">
                                                <div className="PR_printUI_Grid" style={{ backgroundColor: "rgb(243, 243, 243)" }}>
                                                    <div><p className="font-weight-bolder">Sr: No:</p></div>
                                                    <div><p className="font-weight-bolder">Description</p></div>
                                                    <div><p className="font-weight-bolder">Reason</p></div>
                                                    <div><p className="font-weight-bolder">Quantity</p></div>
                                                    <div><p className="font-weight-bolder" >Estimated Cost</p></div>
                                                    <div><p className="font-weight-bolder">Total Cost</p></div>
                                                </div>
                                                {
                                                    ListDetails.specifications.map(
                                                        (val, index) => {

                                                            return (

                                                                <div className="PR_printUI_Grid" key={index} >
                                                                    <div> <p> {index + 1} </p>  </div>
                                                                    <div> <p> {val.description} </p></div>
                                                                    <div> <p> {val.reason} </p></div>
                                                                    <div> <p> {val.quantity} </p> </div>
                                                                    <div> <p> {val.price} </p> </div>
                                                                    <div> <p> {val.amount} </p> </div>
                                                                </div>

                                                            )

                                                        }
                                                    )
                                                }
                                                <div className="PR_printUI_Grid">
                                                    <div></div>
                                                    <div style={{ backgroundColor: "rgb(243, 243, 243)" }}><p className="font-weight-bolder text-right mr-2">Total :</p></div>
                                                    <div></div>
                                                    <div></div>
                                                    <div></div>
                                                    <div><p>{val.total}</p></div>
                                                </div>
                                            </div>
                                            <div className="w-100">
                                                <div className="PR_printUI_Remarks mt-4" style={{ backgroundColor: "rgb(243, 243, 243)" }}>
                                                    <div className="DIVS" ><p className="font-weight-bolder">Requested By</p></div>
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
                                                            <div className="DIVS" ><p className="font-weight-bolder">Name : </p><p>{val.approve_emp_name}</p></div>
                                                            <div className="DIVS" ><p className="font-weight-bolder">Date : </p><p>{d1 === null ? null : d1.toDateString()}</p></div>
                                                        </div>
                                                        :
                                                        <div>
                                                            <div className="DIVS" ><p className="font-weight-bolder">Name : </p><p>{val.discard_emp_name}</p></div>
                                                            <div className="DIVS" ><p className="font-weight-bolder">Date : </p><p>{d1 === null ? null : d1.toDateString()}</p></div>
                                                        </div>
                                                    }
                                                    <div >
                                                        <div className="DIVS" ><p className="font-weight-bolder">Name : </p><p>{ val.handle_emp_name }</p></div>
                                                        <div className="DIVS" ><p className="font-weight-bolder">Date : </p><p>{d2 === null ? null : d2.toDateString()}</p></div>
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
export default PreviousRequest;
