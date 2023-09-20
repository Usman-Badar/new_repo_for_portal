import React,{ useState, useEffect } from "react";
import './PreviousRequest.css';

import axios from "../../../../../../../../axios";


import QFS from '../../../../../../../../images/QFS-LOGO.PNG';
import SBL from '../../../../../../../../images/SBL-LOGO.PNG';
import SBS from '../../../../../../../../images/SEABOARD-SERVICES.PNG';

import Vender from './Venders/Venders';

const PreviousRequest = ( props ) => {

    const [Details, setDetails] = useState(
        {
            info: [],
            specifications: [],
            venders: []
        }
    )

    useEffect(
        () => {

            setDetails(
                {
                    info: props.PurchaseOrderDetails.info,
                    specifications: props.PurchaseOrderDetails.specifications,
                    venders: props.PurchaseOrderDetails.venders
                }
            );

        }, [ props.PurchaseOrderDetails ]
    )
    
    return (
        <>
            {
                Details.info.length > 0
                ?
                Details.info.map(
                    ( val, index ) => {

                        const d1 = new Date( val.request_date );
                        const d2 = val.approve_date === null ? null : new Date( val.approve_date );
                        const d3 = val.discard_date === null ? null : new Date( val.discard_date );

                        let subTotal = 0.00;
                        for ( let x = 0; x < Details.specifications.length; x++ )
                        {
                            subTotal = subTotal + Details.specifications[x].amount;
                        }

                        return (
                            <div className="ViewPOForm" key={ index }>

                                {/* <img src={SGC} className='watermark' alt="water markimage" /> */}

                                {/* HEADING */}
                                <h1
                                    className="text-center"
                                    style={
                                        {
                                            textDecoration: 'underline'
                                        }
                                    }
                                >Seaboard Group</h1>
                                {/* IMAGES GRID */}
                                <div className="ViewPOFormGrid">

                                    <img src={ QFS } alt="QFS LOGO" width="100%" />
                                    <img src={ SBL } alt="SBL LOGO" width="100%" />
                                    <img src={ SBS } alt="SBS LOGO" width="100%" />

                                </div>

                                {/* HEADING */}
                                <h3
                                    className="text-center mb-4"
                                    style={
                                        {
                                            textDecoration: 'underline'
                                        }
                                    }
                                >Purchase Order</h3>

                                {/* REQUEST INFO */}
                                {/* UPPER DIV */}
                                <div className="Upper RequestInfo">

                                    {/* COMPANY INFO */}
                                    {/* LEFT SIDE */}
                                    <div className="Left CompanyInfo">

                                        <p className="font-weight-bold"> { val.po_company_name } </p>
                                        <p>{ val.location_address }</p>
                                        <p>
                                            <b className="mr-2">Phone:</b>
                                            { val.location_phone }
                                        </p>
                                        <p>
                                            <b className="mr-2">Website:</b>
                                            { val.company_website }
                                        </p>

                                    </div>

                                    {/* REQUEST INFO */}
                                    {/* RIGHT SIDE */}
                                    <div className="Right RequestInfo">

                                        <div className="TableDiv">

                                            {/* KEY */}
                                            <div className='divs'>
                                                PR Number
                                            </div>
                                            {/* VALUE */}
                                            <div className='divs'>
                                                { val.pr_code === null || val.pr_code === 0 || val.pr_code === undefined ? "No Purchase Requisition" : val.pr_code }
                                            </div>

                                            {/* KEY */}
                                            <div className='divs'>
                                                PO Number
                                            </div>
                                            {/* VALUE */}
                                            <div className='divs'>
                                                { val.po_code }
                                            </div>

                                            {/* KEY */}
                                            <div className='divs'>
                                                Date
                                            </div>
                                            {/* VALUE */}
                                            <div className='divs'>
                                                { d1 ? d1.toDateString() : null }
                                            </div>

                                        </div>

                                    </div>

                                </div>
                                

                                {/* VENDERS LIST */}
                                {/* SHIPPING TO */}
                                <div className="GridContainer Venders ShipTo">

                                    {/* LEFT SIDE */}
                                    {/* VENDERS LIST */}
                                    <div className="VendersList">

                                        {/* TITLE HEADING */}
                                        <div className='title d-flex align-items-center justify-content-start'>
                                            Venders
                                        </div>

                                        {/* VENDERS */}
                                        {
                                            Details.venders.map(
                                                ( val, index ) => {

                                                    return (
                                                        <Vender
                                                            key={ index }
                                                            name={ val.vender_name }
                                                            phone={ val.vender_phone }
                                                            address={ val.vender_address }
                                                        />
                                                    )

                                                }
                                            )
                                        }

                                    </div>

                                    {/* RIGHT SIDE */}
                                    {/* SHIPPING TO DETAILS */}
                                    <div className="ShippingCompany">

                                        {/* TITLE HEADING */}
                                        <div className='title'>
                                            Ship To
                                        </div>

                                        {/* SHIP TO COMPANY DETAILS */}
                                        <p className="font-weight-bold mx-2">{ val.po_shipto_company_name }</p>
                                        <p className="mx-2">{ val.ShipToLocationAddress }</p>
                                        <p>
                                            <b className="mx-2">Phone:</b>
                                            { val.ShipToLocationPhone }
                                        </p>
                                        <p>
                                            <b className="mx-2">Website:</b>
                                            { val.shipto_company_website }
                                        </p>

                                    </div>

                                </div>
                                

                                {/* MIDDLE */}
                                {/* TO ENTER TH REQUIRED ITEMS DETAILS */}
                                {/* INPUTS FIELDS */}
                                <div className="PO_printUI_Middle">
                                    <div className="PO_printUI_Grid" style={{ backgroundColor: "rgb(243, 243, 243)" }}>
                                        <div><p className="font-weight-bolder">No</p></div>
                                        <div><p className="font-weight-bolder">Description</p></div>
                                        <div><p className="font-weight-bolder">Quantity</p></div>
                                        <div><p className="font-weight-bolder" >Estimated Cost</p></div>
                                        <div><p className="font-weight-bolder" >Tax</p></div>
                                        <div><p className="font-weight-bolder">Total Cost</p></div>
                                    </div>
                                    {
                                        Details.specifications.map(
                                            ( val, index ) => {

                                                return (
                                                    <div
                                                        className={"PO_printUI_Grid MyItems MyItems" + index}
                                                        key={ index }
                                                    >
                                                        <div> <p> { index + 1 } </p>  </div>
                                                        <div> <p> { val.description } </p></div>
                                                        <div> <p> { val.quantity } </p> </div>
                                                        <div> <p> { val.price } </p> </div>
                                                        <div> <p> { val.tax + '%' } </p> </div>
                                                        <div> <p> {'Rs ' + val.amount.toLocaleString('en-US')} </p> </div>
                                                    </div>
                                                )

                                            }
                                        )
                                    }
                                    <div
                                        className={"PO_printUI_Grid PO_printUI_Grid_Bottom MyItems MyItems" + 0}
                                        key={index}
                                    >
                                        <div> <p>  </p>  </div>
                                        <div> <p>  </p></div>
                                        <div> <p>  </p> </div>
                                        <div> <p>  </p> </div>
                                        <div> <p className="font-weight-bold"> Sub Total </p> </div>
                                        <div> <p> {'Rs ' + subTotal.toLocaleString('en-US')} </p> </div>
                                    </div>
                                    <div
                                        className={"PO_printUI_Grid PO_printUI_Grid_Bottom MyItems MyItems" + 0}
                                        key={index}
                                    >
                                        <div> <p>  </p>  </div>
                                        <div> <p>  </p></div>
                                        <div> <p>  </p> </div>
                                        <div> <p>  </p> </div>
                                        <div> <p className="font-weight-bold"> Tax </p> </div>
                                        <div> <p> { val.tax + '%' } </p> </div>
                                    </div>
                                    <div
                                        className={"PO_printUI_Grid PO_printUI_Grid_Bottom MyItems MyItems" + 0}
                                        key={index}
                                    >
                                        <div> <p>  </p>  </div>
                                        <div> <p>  </p></div>
                                        <div> <p>  </p> </div>
                                        <div> <p>  </p> </div>
                                        <div> <p className="font-weight-bold"> Cartage </p> </div>
                                        <div> <p> {'Rs ' + val.cartage.toLocaleString('en-US')} </p> </div>
                                    </div>
                                    <div
                                        className={"PO_printUI_Grid PO_printUI_Grid_Bottom MyItems MyItems" + 0}
                                        key={index}
                                    >
                                        <div> <p>  </p>  </div>
                                        <div> <p>  </p></div>
                                        <div> <p>  </p> </div>
                                        <div> <p>  </p> </div>
                                        <div> <p className="font-weight-bold"> Others </p> </div>
                                        <div> <p> {'Rs ' + val.others.toLocaleString('en-US')} </p> </div>
                                    </div>
                                    <div
                                        className={"PO_printUI_Grid PO_printUI_Grid_Bottom MyItems MyItems" + 0}
                                        key={index}
                                    >
                                        <div> <p>  </p>  </div>
                                        <div> <p>  </p></div>
                                        <div> <p>  </p> </div>
                                        <div> <p>  </p> </div>
                                        <div> <p className="font-weight-bold"> Total </p> </div>
                                        <div> <p> {'Rs ' + val.total.toLocaleString('en-US')} </p> </div>
                                    </div>
                                </div>

                                {/* SENDER COMMENTS ON PURCHASE ORDER */}
                                <div className="Comments">

                                    {/* TITLE HEADING */}
                                    <div className='title rounded-0'>
                                        Comments
                                    </div>
                                    <textarea
                                        placeholder='Please enter your comments on the request.'
                                        className="form-control rounded-0"
                                        value={ val.comments }
                                        disabled
                                    />

                                </div>

                                {/* SENDER & RECEIVER INFORMATION */}
                                {/* GRID CONTAINER */}
                                {/* FOOTER */}
                                <div className="Footer">

                                    {/* LEFT SIDE */}
                                    {/* SENDER INFO */}
                                    {/* REQUESTED BY */}
                                    <div className="Left RequestedBy">

                                        {/* TITLE HEADING */}
                                        <div className='title'>
                                            Requested By
                                        </div>

                                        {/* DATE AND SENDER NAME */}
                                        <div className="d-flex align-items-center pl-2 py-1">
                                            <p className='w-100 font-weight-bold'>
                                                Name
                                            </p>
                                            <p className='w-100'>
                                                { val.sender_name }
                                            </p>
                                        </div>
                                        <div className="d-flex align-items-center pl-2 py-1">
                                            <p className='w-100 font-weight-bold'>
                                                Date
                                            </p>
                                            <p className='w-100'>
                                                { d1 ? d1.toDateString() : null }
                                            </p>
                                        </div>

                                    </div>

                                    {
                                        val.approve_by === null && val.discard_by === null
                                        ?
                                        <>
                                            {/* RIGHT SIDE */}
                                            {/* RECEIVER INFO */}
                                            {/* APPROVED BY */}
                                            <div className="Right ApprovedBy">

                                                {/* TITLE HEADING */}
                                                <div className='title'>
                                                    Approved By
                                                </div>

                                                {/* DATE AND RECEIVER NAME */}
                                                <div className="d-flex align-items-center pl-2 py-1">
                                                    <p className='w-100 font-weight-bold'>
                                                        Name
                                                    </p>
                                                    <p className='w-100'>
                                                        { val.approve_emp_name }
                                                    </p>
                                                </div>
                                                <div className="d-flex align-items-center pl-2 py-1">
                                                    <p className='w-100 font-weight-bold'>
                                                        Date
                                                    </p>
                                                    <p className='w-100'>
                                                        { d2 ? d2.toDateString() : null }
                                                    </p>
                                                </div>

                                            </div>
                                        </>
                                        :
                                        val.discard_by === null
                                        ?
                                        <>
                                            {/* RIGHT SIDE */}
                                            {/* RECEIVER INFO */}
                                            {/* APPROVED BY */}
                                            <div className="Right ApprovedBy">

                                                {/* TITLE HEADING */}
                                                <div className='title'>
                                                    Approved By
                                                </div>

                                                {/* DATE AND RECEIVER NAME */}
                                                <div className="d-flex align-items-center pl-2 py-1">
                                                    <p className='w-100 font-weight-bold'>
                                                        Name
                                                    </p>
                                                    <p className='w-100'>
                                                        { val.approve_emp_name }
                                                    </p>
                                                </div>
                                                <div className="d-flex align-items-center pl-2 py-1">
                                                    <p className='w-100 font-weight-bold'>
                                                        Date
                                                    </p>
                                                    <p className='w-100'>
                                                        { d2 ? d2.toDateString() : null }
                                                    </p>
                                                </div>

                                            </div>
                                        </>
                                        :
                                        <>
                                            {/* RIGHT SIDE */}
                                            {/* RECEIVER INFO */}
                                            {/* REJECTED BY */}
                                            <div className="Right ApprovedBy">

                                                {/* TITLE HEADING */}
                                                <div className='title'>
                                                    Rejected By
                                                </div>

                                                {/* DATE AND RECEIVER NAME */}
                                                <div className="d-flex align-items-center pl-2 py-1">
                                                    <p className='w-100 font-weight-bold'>
                                                        Name
                                                    </p>
                                                    <p className='w-100'>
                                                        { val.discard_emp_name }
                                                    </p>
                                                </div>
                                                <div className="d-flex align-items-center pl-2 py-1">
                                                    <p className='w-100 font-weight-bold'>
                                                        Date
                                                    </p>
                                                    <p className='w-100'>
                                                        { d3 ? d3.toDateString() : null }
                                                    </p>
                                                </div>

                                            </div>
                                        </>
                                    }

                                </div>

                            </div>
                        )

                    }
                )
                :
                null
            }
        </>
    )
}
export default PreviousRequest;
