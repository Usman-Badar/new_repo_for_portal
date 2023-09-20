import React, { useEffect, useState } from "react";
import './PO_PrintUI.css';
import QFS from './Logos/QFS-LOGO.PNG';
import SBS from './Logos/SEABOARD-SERVICES.PNG';
import SBL from './Logos/SBL-LOGO.PNG';


const PO_PrintUI = (props) => {
    const [ ListDetails, setListDetails ] = useState([
        {
            Sno: '01',
            desc: 'Laptop',
            Quantity: '01',
            EstimatedCost: '50000',
            TotalCost: '70000',
            Reason: 'In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content. Lorem ipsum may be used as a placeholder before the final copy is',
        },
        {
            Sno: '02',
            desc: 'Laptop',
            Quantity: '01',
            EstimatedCost: '50000',
            TotalCost: '70000'
        },
        {
            Sno: '01',
            desc: 'Laptop',
            Quantity: '01',
            EstimatedCost: '50000',
            TotalCost: '70000',
            Reason: 'In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content. Lorem ipsum may be used as a placeholder before the final copy is',
        },
        {
            Sno: '02',
            desc: 'Laptop',
            Quantity: '01',
            EstimatedCost: '50000',
            TotalCost: '70000'
        },
        {
            Sno: '01',
            desc: 'Laptop',
            Quantity: '01',
            EstimatedCost: '50000',
            TotalCost: '70000',
            Reason: 'In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content. Lorem ipsum may be used as a placeholder before the final copy is',
        },
        {
            Sno: '02',
            desc: 'Laptop',
            Quantity: '01',
            EstimatedCost: '50000',
            TotalCost: '70000'
        },
        {
            Sno: '01',
            desc: 'Laptop',
            Quantity: '01',
            EstimatedCost: '50000',
            TotalCost: '70000',
            Reason: 'In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content. Lorem ipsum may be used as a placeholder before the final copy is',
        },
        {
            Sno: '02',
            desc: 'Laptop',
            Quantity: '01',
            EstimatedCost: '50000',
            TotalCost: '70000'
        },
        {
            Sno: '01',
            desc: 'Laptop',
            Quantity: '01',
            EstimatedCost: '50000',
            TotalCost: '70000',
            Reason: 'In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content. Lorem ipsum may be used as a placeholder before the final copy is',
        },
        {
            Sno: '02',
            desc: 'Laptop',
            Quantity: '01',
            EstimatedCost: '50000',
            TotalCost: '70000'
        },
        {
            Sno: '01',
            desc: 'Laptop',
            Quantity: '01',
            EstimatedCost: '50000',
            TotalCost: '70000',
            Reason: 'In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content. Lorem ipsum may be used as a placeholder before the final copy is',
        },
        {
            Sno: '02',
            desc: 'Laptop',
            Quantity: '01',
            EstimatedCost: '50000',
            TotalCost: '70000'
        },
        {
            Sno: '01',
            desc: 'Laptop',
            Quantity: '01',
            EstimatedCost: '50000',
            TotalCost: '70000',
            Reason: 'In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content. Lorem ipsum may be used as a placeholder before the final copy is',
        },
        {
            Sno: '02',
            desc: 'Laptop',
            Quantity: '01',
            EstimatedCost: '50000',
            TotalCost: '70000'
        },
        {
            Sno: '01',
            desc: 'Laptop',
            Quantity: '01',
            EstimatedCost: '50000',
            TotalCost: '70000',
            Reason: 'In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content. Lorem ipsum may be used as a placeholder before the final copy is',
        },
        {
            Sno: '02',
            desc: 'Laptop',
            Quantity: '01',
            EstimatedCost: '50000',
            TotalCost: '70000'
        },
        {
            Sno: '01',
            desc: 'Laptop',
            Quantity: '01',
            EstimatedCost: '50000',
            TotalCost: '70000',
            Reason: 'In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content. Lorem ipsum may be used as a placeholder before the final copy is',
        },
        {
            Sno: '02',
            desc: 'Laptop',
            Quantity: '01',
            EstimatedCost: '50000',
            TotalCost: '70000'
        },
        {
            Sno: '01',
            desc: 'Laptop',
            Quantity: '01',
            EstimatedCost: '50000',
            TotalCost: '70000',
            Reason: 'In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content. Lorem ipsum may be used as a placeholder before the final copy is',
        },
        {
            Sno: '02',
            desc: 'Laptop',
            Quantity: '01',
            EstimatedCost: '50000',
            TotalCost: '70000'
        }
    ])

    useEffect(
        () => {

        },  []
    )


    return (
        <>
            <div id="PrintDiv" style={ { width: "100%", height: "100vh" } }  className="PO_PrintUI">
                <div className="PO_PrintUI_Div">
                    <h1 className=" font-weight-bolder text-center" style={ { textDecoration: 'underline' } }>Seaboard Group</h1>
                    <div className="PO_PrintUI_Logos">
                        <div><img src={QFS} alt="QFS Logo" /></div>
                        <div><img src={SBS} alt="SBS Logo" /></div>
                        <div><img src={SBL} alt="SBL Logo" /></div>
                    </div>
                    <h3 className="font-weight-bolder text-center" style={ { textDecoration: 'underline' } }>Purchase Order</h3>
                    <div className="PO_PrintUI_Top mt-5">
                        <div>
                            <p className="font-weight-bolder mr-3">Seaboard Services</p>
                            <p className="font-weight-bolder mr-3">C-33, Block-2, KehkaShan, Clifton</p>
                            <p className="font-weight-bolder mr-3">Karachi-75600, Pakistan</p>
                            <p className="font-weight-bolder mr-3">Phone: (021) 35866811-4</p>
                            <p className="font-weight-bolder mr-3">Website: www.qfs.com.pk</p>
                        </div>
                        <div>
                            <div className="d-flex border">
                                <div className="border-right w-50 text-center"><p className="font-weight-bolder">Invoice Number  </p></div>
                                <div className="text-center w-50"><p>812</p></div>
                            </div>
                            <div className="d-flex border">
                                <div className="border-right w-50 text-center"><p className="font-weight-bolder">PR Number   </p></div>
                                <div className="text-center w-50"><p>SBS-09-004-21/22</p></div>
                            </div><div className="d-flex border">
                                <div className="border-right w-50 text-center"><p className="font-weight-bolder"> Date  </p></div>
                                <div className="text-center w-50"><p>01-12-2021</p></div>
                            </div>
                            <div className="d-flex border">
                                <div className="border-right w-50 text-center"><p className="font-weight-bolder">PO Number  </p></div>
                                <div className="text-center w-50"><p>SBS-09-007-21/22</p></div>
                            </div>
                        </div>
                    </div>
                    <div className="PO_PrinUI_Venders">
                        <div >
                            <div style={{ backgroundColor: "rgb(243, 243, 243)" }}><p className="font-weight-bolder pl-2">Venders</p></div>
                            <p>PC World</p>
                            <p>C-33, Block-2, KehkaShan, Clifton</p>
                            <p>Karachi-75600, Pakistan</p>
                            <p>Phone: (021) 35866811-4</p>
                            <p>Website: www.qfs.com.pk</p>
                        </div>
                        <div >
                            <div style={{ backgroundColor: "rgb(243, 243, 243)" }}><p className="font-weight-bolder pl-2">Ship TO:</p></div>
                            <p>Seaboard Services</p>
                            <p>C-33, Block-2, KehkaShan, Clifton</p>
                            <p>Karachi-75600, Pakistan</p>
                            <p>Phone: (021) 35866811-4</p>
                            <p>Website: www.qfs.com.pk</p>
                        </div>
                    </div>
                    <div className="PO_PrintUI_Middle">
                        <div className="PO_PrintUI_Grid" style={{ backgroundColor: "rgb(243, 243, 243)" }}>
                            <div><p className="font-weight-bolder">Item No:</p></div>
                            <div><p className="font-weight-bolder">Description</p></div>
                            <div><p className="font-weight-bolder">Quantity</p></div>
                            <div><p className="font-weight-bolder" >Unit Price</p></div>
                            <div><p className="font-weight-bolder">Total</p></div>
                        </div>
                        {
                            ListDetails.map(
                                (val, index) => {
                                    return (
                                        <>
                                            <div className="PO_PrintUI_Grid PO_PrintUI_Grid_hover" onClick={() => props.clicked(index)}>
                                                <div><p>{val.Sno}</p></div>
                                                <div><p>{val.desc}</p></div>
                                                <div><p>{val.Quantity}</p></div>
                                                <div><p>{val.EstimatedCost}</p></div>
                                                <div><p>{val.TotalCost}</p></div>
                                            </div>
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
                                <div className="Total"><p>9500.00</p></div>
                                <div className="Total"><p>-</p></div>
                                <div className="Total"><p>-</p></div>
                                <div className="Total"><p>-</p></div>
                                <div className="Total"><p>9500.00</p></div>
                            </div>
                        </div>
                    </div>
                    <div className="PO_PrintUI_Bottom">
                        <div className="PO_PrintUI_CommentBox pb-4" >
                            <div style={{ backgroundColor: "rgb(243, 243, 243)" }}><p className="font-weight-bolder">Comment and Special instruction</p></div>
                            <div ><p>dsvhnjksnfbonofbdkb</p></div>
                        </div>
                        <div className="PO_PrintUI_Remarks PR_printUI_Remark" style={{ backgroundColor: "rgb(243, 243, 243)" }}>
                            <div className="DIVS" ><p className="font-weight-bolder">Sumbitted By</p></div>
                            <div className="DIVS" ><p className="font-weight-bolder">Approved By</p></div>
                            <div className="DIVS" ><p className="font-weight-bolder">Submitted To</p></div>
                        </div>
                        <div className="PO_PrintUI_Remarks mb-4">
                            <div >
                                <div className="DIVS" ><p className="font-weight-bolder mr-3">Name : </p><p>Antash Javaid</p></div>
                                <div className="DIVS" ><p className="font-weight-bolder">Date : </p><p>2021-10-20</p></div>
                                <div className="DIVS" ><p className="font-weight-bolder">Signature : </p><p></p></div>
                            </div>
                            <div >
                                <div className="DIVS" ><p className="font-weight-bolder mr-3">Name : </p><p>Salman Panjwani</p></div>
                                <div className="DIVS" ><p className="font-weight-bolder">Date : </p><p>2021-10-21</p></div>
                                <div className="DIVS" ><p className="font-weight-bolder">Signature : </p><p></p></div>
                            </div>
                            <div >
                                <div className="DIVS" ><p className="font-weight-bolder mr-3">Name : </p><p>Usman</p></div>
                                <div className="DIVS" ><p className="font-weight-bolder">Date : </p><p>2021-10-22</p></div>
                                <div className="DIVS" ><p className="font-weight-bolder">Signature : </p><p></p></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}
export default PO_PrintUI;