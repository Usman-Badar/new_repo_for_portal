import React, { useEffect, useState } from "react";
import './PO_PrintUI.css';
import QFS from './Logos/QFS-LOGO.PNG';
import SBS from './Logos/SEABOARD-SERVICES.PNG';
import SBL from './Logos/SBL-LOGO.PNG';
import axios from '../../../../../axios';


const PO_PrintUI = (props) => {

    const [ListDetails, setListDetails] = useState(
        {
            info: [],
            specifications: [],
            venders: [],
            pr_id: null
        }
    )

    useEffect(
        () => {

            let po_id = window.location.href.split('/')[ window.location.href.split('/').length - 2 ]; // RETURNS AN ID ( PO ID ) FROM THE URL
            let pr_id = window.location.href.split('/').pop(); // RETURNS AN ID ( PR ID ) FROM THE URL

            axios.post(
                '/getpurchaseorderdetails',
                {
                    po_id: po_id,
                    pr_id: pr_id === 0 || pr_id === '0' ? null : pr_id
                }
            ).then(
                (res) => {

                    setListDetails(
                        {
                            info: res.data[0],
                            specifications: res.data[1],
                            venders: res.data[3],
                            pr_id: res.data[4].length > 0 ? res.data[4][0].pr_code : null
                        }
                    )

                }
            ).catch(err => {

                console.log(err);

            })

        }, [ window.location.href.split('/').pop() ]
    )


    let num = 15;
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

                        return (
                            <div key={index} id="PrintDiv" style={{ width: "100%", height: "100vh" }} className="PO_PrintUI">
                                <div className="PO_PrintUI_Div">
                                    <div className="PO_PrintUI_header">
                                        <h1 className=" font-weight-bolder text-center" style={{ textDecoration: 'underline' }}>Seaboard Group</h1>
                                        <div className="PO_PrintUI_Logos">
                                            <div><img src={QFS} alt="QFS Logo" /></div>
                                            <div><img src={SBS} alt="SBS Logo" /></div>
                                            <div><img src={SBL} alt="SBL Logo" /></div>
                                        </div>
                                        <h3 className="font-weight-bolder text-center" style={{ textDecoration: 'underline' }}>Purchase Order</h3>
                                        <div className="PO_PrintUI_Top mt-5">
                                            <div>
                                                <p className="font-weight-bolder mr-3"> {val.po_company_name} </p>
                                                <p className="font-weight-bolder mr-3"> {val.location_address} </p>
                                                <p className="font-weight-bolder mr-3">Phone: {val.location_phone} </p>
                                                <p className="font-weight-bolder mr-3">Website: {val.company_website}</p>
                                            </div>
                                            <div>
                                                <div className="d-flex border">
                                                    <div className="border-right w-50 text-center"><p className="font-weight-bolder">PR Number   </p></div>
                                                    <div className="text-center w-50"><p>{ ListDetails.pr_id === null ? 'NO PURCHASE REQUISITION' : ListDetails.pr_id }</p></div>
                                                </div><div className="d-flex border">
                                                    <div className="border-right w-50 text-center"><p className="font-weight-bolder"> Date  </p></div>
                                                    <div className="text-center w-50"><p>{d3.toDateString()}</p></div>
                                                </div>
                                                <div className="d-flex border">
                                                    <div className="border-right w-50 text-center"><p className="font-weight-bolder">PO Number  </p></div>
                                                    <div className="text-center w-50"><p> {val.po_code} </p></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="PO_PrinUI_Content">
                                        <div className="PO_PrinUI_Venders">
                                            <div >
                                                <div style={{ backgroundColor: "rgb(243, 243, 243)" }}><p className="font-weight-bolder pl-2">Venders</p></div>
                                                {
                                                    ListDetails.venders.map(
                                                        (val, index) => {
                                                            return (
                                                                <>
                                                                    <div className="mb-2 pb-2 border-bottom">
                                                                        <p>{val.vender_name}</p>
                                                                        <p>{val.vender_phone}</p>
                                                                        <p>{val.vender_address}</p>
                                                                    </div>
                                                                </>
                                                            )
                                                        }
                                                    )
                                                }
                                            </div>
                                            <div >
                                                <div style={{ backgroundColor: "rgb(243, 243, 243)" }}><p className="font-weight-bolder pl-2">Ship TO:</p></div>
                                                <p> {val.po_company_name} </p>
                                                <p> {val.location_address} </p>
                                                <p>Phone: {val.location_phone} </p>
                                                <p>Website: {val.company_website}</p>
                                            </div>
                                        </div>
                                        <div className="PO_PrintUI_Middle">
                                            <div className="PO_PrintUI_Grid" style={{ backgroundColor: "rgb(243, 243, 243)" }}>
                                                <div><p className="font-weight-bolder">Sr No:</p></div>
                                                <div><p className="font-weight-bolder">Description</p></div>
                                                <div><p className="font-weight-bolder">Quantity</p></div>
                                                <div><p className="font-weight-bolder" >Unit Price</p></div>
                                                <div><p className="font-weight-bolder">Total</p></div>
                                            </div>
                                            {
                                                ListDetails.specifications.map(
                                                    (val, index) => {
                                                        return (
                                                            <>
                                                                <div key={index} className="PO_PrintUI_Grid PO_PrintUI_Grid_hover" onClick={() => props.clicked(index)}>
                                                                    <div><p>{index + 1}</p></div>
                                                                    <div><p>{val.description}</p></div>
                                                                    <div><p>{val.quantity}</p></div>
                                                                    <div><p>Rs {val.price.toLocaleString('en-US')}</p></div>
                                                                    <div><p>Rs {val.amount.toLocaleString('en-US')}</p></div>
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
                                            <div className="PO_PrintUI_Grid1">
                                                <div></div>
                                                <div></div>
                                                <div></div>
                                                <div>
                                                    <div className="Total"><p>Sub Total</p></div>
                                                    <div className="Total"><p>GST</p></div>
                                                    <div className="Total"><p>Shipping</p></div>
                                                    <div className="Total"><p>Others</p></div>
                                                    <div className="Total"><p>Total</p></div>
                                                </div>
                                                <div>
                                                    <div className="Total"><p> Rs { val.total.toLocaleString('en-US') } </p></div>
                                                    <div className="Total"><p>-</p></div>
                                                    <div className="Total"><p> Rs { val.cartage.toLocaleString('en-US') } </p></div>
                                                    <div className="Total"><p> Rs { val.others.toLocaleString('en-US') } </p></div>
                                                    <div className="Total"><p> Rs { val.total.toLocaleString('en-US') } </p></div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="PO_PrintUI_Bottom">
                                            <div className="PO_PrintUI_CommentBox pb-4" >
                                                <div style={{ backgroundColor: "rgb(243, 243, 243)" }}><p className="font-weight-bolder">Comment and Special instruction</p></div>
                                                <div ><p> {val.comments} </p></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="PO_PrintUI_Footer">
                                        <div className="w-100">
                                            <div className="PO_PrintUI_Remarks PR_printUI_Remark" style={{ backgroundColor: "rgb(243, 243, 243)" }}>
                                                <div className="DIVS" ><p className="font-weight-bolder">Sumbitted By</p></div>
                                                <div className="DIVS" ><p className="font-weight-bolder"> { val.discard_by === null ? "Approved By" : "Discard By" } </p></div>
                                            </div>
                                            <div className="PO_PrintUI_Remarks">
                                                <div >
                                                    <div className="DIVS" ><p className="font-weight-bolder mr-3">Name : </p><p> {val.sender_name} </p></div>
                                                    <div className="DIVS" ><p className="font-weight-bolder mr-3">Date : </p><p>{d3.toDateString()}</p></div>
                                                </div>
                                                <div >
                                                    <div className="DIVS" ><p className="font-weight-bolder mr-3">Name : </p><p> { val.discard_by === null ? val.approve_emp_name : val.discard_emp_name } </p></div>
                                                    <div className="DIVS" ><p className="font-weight-bolder mr-3">Date : </p><p> { val.discard_by === null ? d1.toDateString() : d2.toDateString() } </p></div>
                                                </div>
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
export default PO_PrintUI;