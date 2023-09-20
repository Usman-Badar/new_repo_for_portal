import React, { useEffect, useState } from 'react';

import './PurchaseRequisition.css';

// import QFS from './Logos/QFS-LOGO.PNG';
// import SBL from './Logos/SBL-LOGO.PNG';
// import SBS from './Logos/SEABOARD-SERVICES.PNG';

const PurchaseRequisition = (props) => {

    const [ Items, setItems ] = useState([]);
    const [ Index, setIndex ] = useState();

    useEffect(
        () => {

            setItems([]);
            setTimeout(() => {
                setItems( props.Items );
            }, 100);

        }, [ props.Items, props.Tax, props.TaxMode ]
    )

    useEffect(
        () => {

            setIndex( props.Index );

        }, [ props.Index ]
    );

    return (
        <>
            {
                props.List.map(
                    (val, index) => {

                            const d1 = val.request_date === null ? null :  new Date( val.request_date );
                            const d2 = val.approve_date === null ? null :  new Date( val.approve_date );
                            const d3 = val.view_date === null ? null :  new Date( val.view_date );
                            const d4 = val.discard_date === null ? null :  new Date( val.discard_date );

                        return (
                            <>
                                <div className="PR_printUIView" key={ index }>
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
                                                    <div>
                                                        <p>{val.pr_company_name}</p>
                                                    </div>
                                                </div>
                                                <div className="PR_printUI_Top_select">
                                                    <div className="d-flex align-items-center"><p className="font-weight-bolder mr-3">Delivery / Work Location : </p></div>
                                                    <div>
                                                        <p>{val.location_name}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                <div className="PR_printUI_Top_select mb-2">
                                                    <div className="d-flex align-items-center mr-3"><p className="font-weight-bolder">PR Number  </p></div>
                                                    <div><p>{ val.pr_code }</p></div>
                                                </div>
                                                <div className="PR_printUI_Top_select">
                                                    <div className="d-flex align-items-center mr-3"><p className="font-weight-bolder"> Date </p></div>
                                                    <div><p>{ d1 === null ? null : d1.toDateString() }</p></div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* TAX PERCENTAGE & TAX MODE */}
                                        <div className="d-flex align-items-center justify-content-center mt-3">
                                            <div className="d-flex align-items-center">
                                                <p> Tax (%) <input type="number" className="action" value={ props.Tax } onChange={ props.onChangeTax } pattern="[0-9]+" /> </p>
                                            </div>

                                            <div className="d-flex align-items-center">
                                                
                                                <input type="radio" name="tax_mode" onChange={ props.IndividualTaxMode } checked={ props.TaxMode === 'inclusive' ? true : false } value="inclusive" className="action mx-2" />
                                                <p> Inclusive </p>

                                                <input type="radio" name="tax_mode" onChange={ props.IndividualTaxMode } checked={ props.TaxMode === 'exclusive' ? true : false } value="exclusive" className="action mx-2" />
                                                <p> Exclusive </p>

                                            </div>
                                        </div>

                                        {/* MIDDLE */}
                                        {/* TO ENTER TH REQUIRED ITEMS DETAILS */}
                                        {/* INPUTS FIELDS */}
                                        <div className="PR_printUI_Middle">

                                            <table className="table table-sm">

                                                <thead style={{ backgroundColor: "rgb(243, 243, 243)" }}>
                                                    <tr>

                                                        <th>No</th>
                                                        <th>Description</th>
                                                        <th colSpan={2}>Reason</th>
                                                        <th>Price</th>
                                                        <th>Quantity</th>
                                                        <th>Total</th>
                                                        <th>Tax</th>
                                                        <th>Tax Amount</th>
                                                        <th>Amount</th>

                                                    </tr>
                                                </thead>

                                                <tbody>
                                                    {
                                                        Items.map(
                                                            ( val, index ) => {

                                                                return (
                                                                    <tr
                                                                        key={ index } 
                                                                        className={ "MyItems MyItems" + index }
                                                                        onDoubleClick={() => props.OnEdit(index)}
                                                                        onContextMenu={() => props.onDelete(index)}
                                                                    >

                                                                        <td> { index + 1 } </td>
                                                                        <td> { val.description } </td>
                                                                        <td colSpan={2}>{ val.reason }</td>
                                                                        <td> { val.price } </td>
                                                                        <td> { val.quantity } </td>
                                                                        <td> { val.price * val.quantity } </td>
                                                                        <td> { val.tax } </td>
                                                                        <td> { val.tax_amount } </td>
                                                                        <td> { val.amount } </td>

                                                                    </tr>
                                                                )

                                                            }
                                                        )
                                                    }
                                                    <tr>

                                                        <td>{ Index !== undefined ? ( Index + 1 ) : (Items.length + 1 ) }</td>
                                                        <td> 
                                                            <input 
                                                                type="text" 
                                                                onChange={props.OnChangeHandler}
                                                                onKeyDown={props.AddItem}
                                                                value={props.Item.description}
                                                                name="description"
                                                            /> 
                                                        </td>
                                                        <td colSpan={2}> 
                                                            <input 
                                                                type="text" 
                                                                onChange={props.OnChangeHandler}
                                                                onKeyDown={props.AddItem}
                                                                value={props.Item.reason}
                                                                name="reason"
                                                            /> 
                                                            <small className="err_reason text-danger"></small>
                                                        </td>
                                                        <td> 
                                                            <input 
                                                                type="number" 
                                                                placeholder="0"
                                                                onChange={props.OnChangeHandler}
                                                                onKeyDown={props.AddItem}
                                                                value={props.Item.price}
                                                                pattern="[0-9]+"
                                                                name="price"
                                                            /> 
                                                        </td>
                                                        <td> 
                                                            <input 
                                                                type="number" 
                                                                onChange={props.OnChangeHandler}
                                                                onKeyDown={props.AddItem}
                                                                value={props.Item.quantity}
                                                                pattern="[0-9]+"
                                                                name="quantity"
                                                            /> 
                                                        </td>
                                                        <td> 
                                                            <input 
                                                                type="text" 
                                                                disabled
                                                                value={ props.Item.price * props.Item.quantity }
                                                            /> 
                                                        </td>
                                                        <td> 
                                                            <input 
                                                                type="text" 
                                                                disabled 
                                                                onChange={props.OnChangeHandler}
                                                                onKeyDown={props.AddItem}
                                                                value={props.Item.tax}
                                                                name="tax"
                                                            />  
                                                        </td>
                                                        <td> 
                                                            <input 
                                                                type="text" 
                                                                disabled 
                                                            
                                                            /> 
                                                        </td>
                                                        <td> 
                                                            <input 
                                                                type="text" 
                                                                disabled 
                                                            
                                                            /> 
                                                        </td>

                                                    </tr>
                                                    
                                                </tbody>

                                                <tfoot>

                                                    <tr>

                                                        <td></td>
                                                        <td></td>
                                                        <td colSpan={2}></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                        <th className="border" style={{ backgroundColor: "rgb(243, 243, 243)" }}>Total</th>
                                                        <td> { props.Total } </td>

                                                    </tr>
                                                    <tr>

                                                        <td></td>
                                                        <td></td>
                                                        <td colSpan={2}></td>
                                                        <td></td>
                                                        <td></td>
                                                        <th className="border" style={{ backgroundColor: "rgb(243, 243, 243)" }}>Tax <sub>(%)</sub></th>
                                                        <td> { props.Tax } </td>
                                                        <th className="border" style={{ backgroundColor: "rgb(243, 243, 243)" }}>Tax Amount</th>
                                                        <td> { props.TaxAmount } </td>

                                                    </tr>
                                                    <tr>

                                                        <td></td>
                                                        <td></td>
                                                        <td colSpan={2}></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                        <th className="border" style={{ backgroundColor: "rgb(243, 243, 243)" }}>Net Total</th>
                                                        <td> { props.NetTotal } </td>

                                                    </tr>

                                                </tfoot>

                                            </table>
                                            {/* <div className="PR_printUI_Grid" style={{ backgroundColor: "rgb(243, 243, 243)" }}>
                                                <div className="d-flex align-items-center justify-content-center"><p className="font-weight-bolder">No</p></div>
                                                <div className="d-flex align-items-center justify-content-center"><p className="font-weight-bolder">Description <sub className='d-block'>(include specification required)</sub> </p></div>
                                                <div className="d-flex align-items-center justify-content-center"><p className="font-weight-bolder">Reason</p></div>
                                                <div className="d-flex align-items-center justify-content-center"><p className="font-weight-bolder">Quantity</p></div>
                                                <div className="d-flex align-items-center justify-content-center"><p className="font-weight-bolder" >Unit Price <br /> <sub>(PKR)</sub> </p></div>
                                                <div className="d-flex align-items-center justify-content-center"><p className="font-weight-bolder" >Tax <sub>%</sub> </p></div>
                                                <div className="d-flex align-items-center justify-content-center">
                                                    <span>
                                                        <p className="font-weight-bolder" >Tax</p>
                                                        {
                                                            props.Item.taxRequired === "YES" && props.Item.tax.length > 0
                                                            ?
                                                            <select id="individualTax" onChange={ props.IndividualTaxMode }>
                                                                <option value="inclusive">inclusive</option>
                                                                <option value="exclusive" selected>exclusive</option>
                                                            </select>
                                                            :
                                                            null
                                                        }
                                                    </span>
                                                </div>
                                                <div className="d-flex align-items-center justify-content-center"><p className="font-weight-bolder">Total Cost</p></div>
                                            </div>
                                            {
                                                Items.map(
                                                    (val, index) => {

                                                        return (

                                                            <div
                                                                className={"PR_printUI_Grid MyItems MyItems" + index}
                                                                key={index}
                                                                onDoubleClick={() => props.OnEdit(index)}
                                                                onContextMenu={() => props.onDelete(index)}
                                                            >
                                                                <div> <p> {index + 1} </p>  </div>
                                                                <div> <p> {val.description} </p></div>
                                                                <div> <p> {val.reason} </p></div>
                                                                <div> <p> {val.quantity} </p> </div>
                                                                <div> <p> {val.price} </p> </div>
                                                                <div> <p> {val.tax} </p> </div>
                                                                <div> <p> { val.tax_amount } </p> </div>
                                                                <div> <p> {'Rs ' + val.amount.toLocaleString('en-US')} </p> </div>
                                                            </div>

                                                        )

                                                    }
                                                )
                                            } */}
                                            {/* <div className="PR_printUI_Grid insertion">
                                                <div className="d-flex align-items-center justify-content-center"><p>{ Index !== undefined ? ( Index + 1 ) : (Items.length + 1 ) }</p></div>
                                                <div>
                                                    <textarea
                                                        className="form-control"
                                                        onChange={props.OnChangeHandler}
                                                        onKeyDown={props.AddItem}
                                                        value={props.Item.description}
                                                        name="description"
                                                        autoComplete='off'
                                                    />
                                                </div>
                                                <div>
                                                    <textarea
                                                        className="form-control"
                                                        onChange={props.OnChangeHandler}
                                                        onKeyDown={props.AddItem}
                                                        value={props.Item.reason}
                                                        name="reason"
                                                        autoComplete='off'
                                                    />
                                                    <p className="err_reason text-danger"></p>
                                                </div>
                                                <div>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="0"
                                                        onChange={props.OnChangeHandler}
                                                        onKeyDown={props.AddItem}
                                                        value={props.Item.quantity}
                                                        pattern="[0-9]+"
                                                        name="quantity"
                                                        autoComplete='off'
                                                    />
                                                </div>
                                                <div>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="0"
                                                        onChange={props.OnChangeHandler}
                                                        onKeyDown={props.AddItem}
                                                        value={props.Item.price}
                                                        pattern="[0-9]+"
                                                        name="price"
                                                        autoComplete='off'
                                                    />
                                                </div>
                                                <div>
                                                    <select
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="0"
                                                        onChange={props.OnChangeHandler}
                                                        name="taxRequired"
                                                    >
                                                        <option value="NO">No</option>
                                                        <option value="YES">YES</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="0"
                                                        onChange={props.OnChangeHandler}
                                                        onKeyDown={props.AddItem}
                                                        value={props.Item.tax}
                                                        name="tax"
                                                        id="TAX"
                                                        autoComplete='off'
                                                        disabled
                                                    />
                                                </div>
                                                <div>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="0"
                                                        value={'Rs ' + props.Amount.toLocaleString('en-US')}
                                                        pattern="[0-9]+"
                                                        name="itemAmount"
                                                        autoComplete='off'
                                                        disabled
                                                    />
                                                </div>
                                            </div> */}

                                        </div>
                                        <div className="w-100">
                                            <div className="PR_printUI_Remarks mt-4" style={{ backgroundColor: "rgb(243, 243, 243)" }}>
                                                <div className="DIVS" ><p className="font-weight-bolder">Requested By</p></div>
                                                <div className="DIVS" ><p className="font-weight-bolder">Submitted To</p></div>
                                                {
                                                    val.discard_emp_name === null
                                                    ?
                                                    <div className="DIVS" ><p className="font-weight-bolder">Approved By</p></div>
                                                    :
                                                    <div className="DIVS" ><p className="font-weight-bolder">Discard By</p></div>
                                                }
                                            </div>
                                            <div className="PR_printUI_Remarks PR_printUI_Remark">
                                                <div className="columns">
                                                    <div className="DIVS" ><p className="font-weight-bolder ">Name : </p><p>{val.sender_name}</p></div>
                                                    <div className="DIVS" ><p className="font-weight-bolder">Date : </p><p>{ d1 === null ? null : d1.toDateString() }</p></div>
                                                </div>
                                                <div className="columns">
                                                    <div className="DIVS" ><p className="font-weight-bolder">Name : </p><p>{val.handle_emp_name}</p></div>
                                                    <div className="DIVS" ><p className="font-weight-bolder">Date : </p><p> { d3 === null ? null : d3.toDateString() } </p></div>
                                                </div>
                                                {
                                                    val.discard_emp_name === null
                                                    ?
                                                    <div className="columns">
                                                        <div className="DIVS" ><p className="font-weight-bolder">Name : </p><p>{val.emp_approve_name}</p></div>
                                                        <div className="DIVS" ><p className="font-weight-bolder">Date : </p><p> { d2 === null ? null : d2.toDateString() } </p></div>
                                                    </div>
                                                    :
                                                    <div className="columns">
                                                        <div className="DIVS" ><p className="font-weight-bolder">Name : </p><p>{val.discard_emp_name}</p></div>
                                                        <div className="DIVS" ><p className="font-weight-bolder">Date : </p><p> { d4 === null ? null : d4.toDateString() } </p></div>
                                                        <div className="DIVS" ><p className="font-weight-bolder">Reason : </p><p> { val.remarks } </p></div>
                                                    </div>
                                                }
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
export default PurchaseRequisition;