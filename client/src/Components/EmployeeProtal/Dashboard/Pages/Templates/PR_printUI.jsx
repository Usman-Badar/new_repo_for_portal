import React from "react";
import './PR_printUI.css';
import QFS from '../../../../../images/1519892514579.png';
import SBS from '../../../../../images/1519892514579.png';
import SBL from '../../../../../images/1519892514579.png';

const PR_printUI = () => {
    const ListDetails = [
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
    ]
    return (
        <>
            <div className="PR_printUI">
                <div className="PR_printUI_Div" id="PR_printUI">
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
                                <p>icvndvjnj</p>
                            </div>
                            <div className="d-flex">
                                <p className="font-weight-bolder mr-3">Delivery / Work Location : </p>
                                <p>icvndvjnj</p>
                            </div>
                        </div>
                        <div className="w-25">
                            <div className="d-flex border">
                                <div className="border-right w-50 text-center"><p className="font-weight-bolder">PR Number  </p></div>
                                <div className="text-center w-50"><p>icvndvjnj</p></div>
                            </div>
                            <div className="d-flex border">
                                <div className="border-right w-50 text-center"><p className="font-weight-bolder">Date  </p></div>
                                <div className="text-center w-50"><p>icvndvjnj</p></div>
                            </div>
                        </div>
                    </div>
                    <div className="PR_printUI_Middle">
                        <div className="PR_printUI_Grid" style={{ backgroundColor: "rgb(243, 243, 243)" }}>
                            <div><p className="font-weight-bolder">Sr: No:</p></div>
                            <div><p className="font-weight-bolder">Description</p></div>
                            <div><p className="font-weight-bolder">Quantity</p></div>
                            <div><p className="font-weight-bolder" >Estimated Cost</p></div>
                            <div><p className="font-weight-bolder">Total Cost</p></div>
                        </div>
                        {
                            ListDetails.map(
                                (val, index) => {
                                    return (
                                        <>
                                            <div className="PR_printUI_Grid">
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
                        <div className="PR_printUI_Grid">
                            <div></div>
                            <div style={{ backgroundColor: "rgb(243, 243, 243)" }}><p className="font-weight-bolder text-right mr-2">Total :</p></div>
                            <div><p></p></div>
                            <div><p></p></div>
                            <div><p></p></div>
                        </div>
                    </div>
                    <div className="PR_printUI_Bottom">
                        <div className="PR_printUI_Grid1" style={{ backgroundColor: "rgb(243, 243, 243)" }}>
                            <div><p className="font-weight-bolder">Sr: No:</p></div>
                            <div><p className="font-weight-bolder">Reason</p></div>
                        </div>
                        {
                            ListDetails.map(
                                (val, index) => {
                                    return (
                                        <>
                                            <div className="PR_printUI_Grid1">
                                                <div><p>{val.Sno}</p></div>
                                                <div className="text-justify px-2"><p>{val.Reason}</p></div>
                                            </div>
                                        </>
                                    )
                                }
                            )
                        }
                    </div>
                </div>
            </div>
        </>
    )
}
export default PR_printUI;