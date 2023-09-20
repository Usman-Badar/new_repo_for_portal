import React from 'react';

import './Form.css';

// import QFS from '../../../../../../../images/QFS-LOGO.PNG';
// import SBL from '../../../../../../../images/SBL-LOGO.PNG';
// import SBS from '../../../../../../../images/SEABOARD-SERVICES.PNG';

const Form = (props) => {

    const d = new Date();

    return (
        <>
            <div className="PR_printUI">
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
                                    <select className="form-control selects" name="EmployeeCompany" onChange={(e) => props.onCompanyChange(e.target.value)}>
                                        <option value=''>Select The Option</option>
                                        {
                                            props.Companies.map(
                                                (val) => {
                                                    return (
                                                        <>
                                                            <option value={val.company_code}>{val.company_name}</option>
                                                        </>
                                                    )
                                                }
                                            )
                                        }
                                    </select>
                                </div>
                            </div>
                            <div className="PR_printUI_Top_select">
                                <div className="d-flex align-items-center"><p className="font-weight-bolder mr-3">Delivery / Work Location : </p></div>
                                <div>
                                    <select className="form-control selects" name="EmployeeLocation" onChange={(e) => props.onLocationChange(e.target.value)}>
                                        <option value=''>Select The Option</option>
                                        {
                                            props.Locations.map(
                                                (val) => {
                                                    return (
                                                        <>
                                                            <option value={val.location_code}>{val.location_name}</option>
                                                        </>
                                                    )
                                                }
                                            )
                                        }
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="PR_printUI_Top_select mb-2">
                                <div className="d-flex align-items-center justify-content-center"><p className="font-weight-bolder">PR Number  </p></div>
                                <div><input type="text" disabled className="form-control selects" value={ props.PurchaseRequisitionCode } /></div>
                            </div>
                            <div className="PR_printUI_Top_select">
                                <div className="d-flex align-items-center justify-content-center"><p className="font-weight-bolder"> Date </p></div>
                                <div><input type="text" value={d.toDateString()} disabled className="form-control" /></div>
                            </div>
                        </div>
                    </div>
                    <div className="PR_printUI_Middle">
                        <div className="PR_printUI_Grid" style={ { backgroundColor: "rgb(243, 243, 243)" } }>
                            <div><p className="font-weight-bolder">No</p></div>
                            <div><p className="font-weight-bolder">Description <sub className='d-block'>(include specification required)</sub> </p></div>
                            <div><p className="font-weight-bolder">Reason</p></div>
                            <div><p className="font-weight-bolder">Quantity</p></div>
                            <div><p className="font-weight-bolder">Estimated Cost <sub>(PKR)</sub> </p></div>
                            <div><p className="font-weight-bolder">Total Cost</p></div>
                        </div>
                        {
                            props.Items.map(
                                (val, index) => {

                                    return (

                                        <div id={"Item" + index} className={"PR_printUI_Grid MyItems MyItems" + index} key={index} onDoubleClick={() => props.OnEdit(index)} onContextMenu={() => props.onDelete(index)}>
                                            <div> <p> {index + 1} </p>  </div>
                                            <div> <p> {val.description} </p></div>
                                            <div> <p> {val.reason} </p></div>
                                            <div> <p> {val.quantity} </p> </div>
                                            <div> <p> {val.price} </p> </div>
                                            <div> <p> {'Rs ' + val.amount.toLocaleString('en-US')} </p> </div>
                                        </div>

                                    )

                                }
                            )
                        }
                        <div className="PR_printUI_Grid">
                            <div className="d-flex align-items-center justify-content-center"><p>{props.Items.length + 1}</p></div>
                            <div>
                                <textarea
                                    className="form-control"
                                    onChange={props.onChnageHandler}
                                    onKeyDown={props.AddItem}
                                    value={props.Item.description}
                                    name="description"
                                />
                            </div>
                            <div>
                                <textarea
                                    className="form-control"
                                    onChange={props.onChnageHandler}
                                    onKeyDown={props.AddItem}
                                    value={props.Item.reason}
                                    name="reason"
                                />
                                <p className="err_reason text-danger"></p>
                            </div>
                            <div>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="0"
                                    onChange={props.onChnageHandler}
                                    onKeyDown={props.AddItem}
                                    value={props.Item.quantity}
                                    pattern="[0-9]+"
                                    name="quantity"
                                />
                            </div>
                            <div>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="0"
                                    onChange={props.onChnageHandler}
                                    onKeyDown={props.AddItem}
                                    value={props.Item.price}
                                    pattern="[0-9]+"
                                    name="price"
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
                                    disabled
                                />
                            </div>
                        </div>
                        <div className="PR_printUI_Grid">
                            <div></div>
                            <div style={ { backgroundColor: "rgb(243, 243, 243)" } }><p className="font-weight-bolder text-right mr-2">Total :</p></div>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div><p>{'Rs ' + props.Total.toLocaleString('en-US')}</p></div>
                        </div>
                    </div>
                    <div className="w-100">
                        <div className="PR_printUI_Remarks mt-4" style={ { backgroundColor: "rgb(243, 243, 243)" } }>
                            <div className="DIVS" ><p className="font-weight-bolder">Requested By</p></div>
                            <div className="DIVS" ><p className="font-weight-bolder">Submitted To</p></div>
                            <div className="DIVS" ><p className="font-weight-bolder">Approved By</p></div>
                        </div>
                        <div className="PR_printUI_Remarks PR_printUI_Remark">
                            <div>
                                <div className="DIVS" ><p className="font-weight-bolder ">Name : </p><p>{ props.RequestedBy.length > 0 ? props.RequestedBy : props.Data.name }</p></div>
                                <div className="DIVS" ><p className="font-weight-bolder">Date : </p><p>{d.toDateString()}</p></div>
                            </div>
                            <div>
                                <div className="DIVS" ><p className="font-weight-bolder">Name : </p><p></p></div>
                                <div className="DIVS" ><p className="font-weight-bolder">Date : </p><p></p></div>
                            </div>
                            <div>
                                <div className="DIVS" ><p className="font-weight-bolder">Name : </p><p></p></div>
                                <div className="DIVS" ><p className="font-weight-bolder">Date : </p><p></p></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default Form;