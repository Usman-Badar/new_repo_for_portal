import React, { useEffect, useState } from 'react';
import './Style.css';

import { Route, Switch } from 'react-router-dom';
import Modal from '../../../../../UI/Modal/Modal';
import { useSelector } from 'react-redux';

const UI = ( { Data, SubOrdinands, loadSubOrdinands, PRSpecifications, PRequestDetails, AdditionalRows, addAdditionalRow, PR, PRSPec, PRList, attachPR, PRAttachment, onFooterContentInput, selectVendor, Vendors, addRow, setPRAttachment, ApproveRequisition, AttachedBills, Specifications, RequestDetails, history, Requests, RejectRequisition, searchVendor, CancelRequisition, SubmitConfirmation, ShowBillModal, Bills, Locations, Companies, SubmitPO, loadRequests, openRequestDetails, POSubmittion, setSubmitConfirmation, onAttachBills, onContentInput, setShowBillModal } ) => {
    
    const Relations = useSelector((state) => state.EmpAuth.Relations);
    const AccessControls = useSelector( ( state ) => state.EmpAuth.EmployeeData );

    return (
        <>
            <div className="purchase_requisition">
                <Modal show={ ShowBillModal } Hide={ () => setShowBillModal(!ShowBillModal) } content={ <ModalContent setShowBillModal={ setShowBillModal } Bills={ Bills } onAttachBills={ onAttachBills } /> } />
                <div className="purchase_requisition_form">
                    <Modal show={ SubmitConfirmation } Hide={ () => setSubmitConfirmation(!SubmitConfirmation) } content={ <SubmitConfirmationModal Data={ Data } Relations={ Relations } POSubmittion={ POSubmittion } /> } />
                    <Modal show={ PRAttachment } Hide={ () => setPRAttachment(!PRAttachment) } content={ <PRAttachmentModal attachPR={ attachPR } PRList={ PRList } PRSPec={ PRSPec } /> } />

                    <Switch>
                        <Route exact path="/purchase/order/form" render={ 
                            () => (
                                <POForm 
                                    Locations={ Locations }
                                    Companies={ Companies }
                                    Bills={ Bills }
                                    history={ history }
                                    Vendors={ Vendors }
                                    PR={ PR }
                                    
                                    onFooterContentInput={ onFooterContentInput }
                                    addAdditionalRow={ addAdditionalRow }
                                    setPRAttachment={ setPRAttachment }
                                    selectVendor={ selectVendor }
                                    searchVendor={ searchVendor }
                                    addRow={ addRow }
                                    SubmitPO={ SubmitPO }
                                    onContentInput={ onContentInput }
                                    setShowBillModal={ setShowBillModal }
                                />
                            )
                        } />
                        <Route exact path="/purchase/order/requests" render={ 
                            () => (
                                <PORequests 
                                    Requests={ Requests }
                                    history={ history }
                                    AccessControls={ AccessControls }

                                    loadRequests={ loadRequests }
                                />
                            )
                        } />
                        <Route exact path="/purchase/order/details" render={ 
                            () => (
                                <RequestDetailsView 
                                    RequestDetails={ RequestDetails }
                                    Specifications={ Specifications }
                                    Bills={ AttachedBills }
                                    history={ history }
                                    AdditionalRows={ AdditionalRows }
                                    PRequestDetails={ PRequestDetails }
                                    PRSpecifications={ PRSpecifications }
                                    SubOrdinands={ SubOrdinands }

                                    loadSubOrdinands={ loadSubOrdinands }
                                    openRequestDetails={ openRequestDetails }
                                    CancelRequisition={ CancelRequisition }
                                    RejectRequisition={ RejectRequisition }
                                    ApproveRequisition={ ApproveRequisition }
                                />
                            )
                        } />
                    </Switch>
                </div>
            </div>
        </>
    );

}

export default UI;

const POForm = ( { onFooterContentInput, PR, addAdditionalRow, setPRAttachment, Vendors, history, Locations, Bills, Companies, SubmitPO, selectVendor, addRow, searchVendor, setShowBillModal, onContentInput } ) => {

    return (
        <>
            <div className="d-flex align-items-center justify-content-between">
                <h3 className="heading">
                    Purchase Order
                    <sub>Application Form</sub>
                </h3>

                <button className="btn submit" type='reset' onClick={ () => history.replace('/purchase/order/requests') }>Back To Requests</button>
            </div>
            <hr />

            <form onSubmit={ SubmitPO }>   
                <fieldset>
                    <div className="flex_container mb-3">

                        <div>
                            <label className="mb-0"><b>Company Name</b></label>
                            <select className="form-control" name="company_code" required>
                                <option value=''>Select the option</option>
                                {
                                    Companies.map(
                                        val => {

                                            return <option key={ val.company_code } value={ val.company_code }> { val.company_name } </option>

                                        }
                                    )
                                }
                            </select>
                        </div>
                        <div>
                            <label className="mb-0"><b>Invoice No</b></label>
                            <input className="form-control" name="invoice_no" />
                        </div>

                    </div>
                    <div className="flex_container mb-3">

                        <div>
                            <label className="mb-0"><b>Vendor</b></label>
                            <div className="p-relative">
                                <input className="form-control" name="vendor_id" id="vendor_id" onChange={ searchVendor } required />
                                {
                                    Vendors
                                    ?
                                    <div className="vendor_list">
                                        {
                                            Vendors.length === 0
                                            ?
                                            <p className="mb-0 text-center"> No Record Found </p>
                                            :
                                            Vendors.map(
                                                ( val, index ) => {
                                                    return (
                                                        <div key={ index } className="item" onClick={ () => selectVendor( val.vender_id, val.name ) }>
                                                            <label className="font-weight-bold mb-0">{ val.name }</label>
                                                            <p className="mb-0">{ val.phone }</p>
                                                            <p className="mb-0">{ val.address }</p>
                                                        </div>
                                                    )
                                                }
                                            )
                                        }
                                    </div>
                                    :null
                                }
                            </div>
                        </div>
                        <div>
                            <label className="mb-0"><b>Ship To (Location)</b></label>
                            <select className="form-control" name="location_code" required>
                                <option value=''>Select the option</option>
                                {
                                    Locations.map(
                                        val => {

                                            return <option key={ val.location_code } value={ val.location_code }> { val.location_name } </option>

                                        }
                                    )
                                }
                            </select>
                        </div>

                    </div>

                    <div className="grid_container mb-3 px-5">

                        <div className='grid_container align-items-center'>
                            <span>New Purchase</span>
                            <input type="checkbox" value="New Purchase" name="new_purchase" className='ml-2' />
                        </div>
                        <div className='grid_container align-items-center'>
                            <span>Repair</span>
                            <input type="checkbox" value="Repair" name="repair" className='ml-2' />
                        </div>
                        <div className='grid_container align-items-center'>
                            <span>Replacement / Recycle</span>
                            <input type="checkbox" value="Replacement / Recycle" name="replace_recycle" className='ml-2' />
                        </div>
                        <div className='grid_container align-items-center'>
                            <span>Invoice Attached</span>
                            <input type="checkbox" value="Invoice Attached" name="invoice_attached" className='ml-2' />
                        </div>

                    </div>

                    <label className="mb-0"><b>Reason For Repair / Recycle / Replacement / New Purchase</b></label>
                    <textarea className="form-control" name="reason" required minLength={20} />

                    <br />

                    <div className="d-flex justify-content-between align-items-center">
                        <label className='mb-1'><b>Purchase / Repair / Recycle / Replacement Specifications</b></label>
                        <i className="las la-plus-circle la-2x" style={ { cursor: 'pointer' } } title='Add New Row' onClick={ addRow }></i>
                    </div>

                    <table className="table table-bordered border-0">
                        <thead>
                            <tr>
                                <th className='text-center'>Sr.No.</th>
                                <th className='text-center'>Description</th>
                                <th className='text-center'>Quantity</th>
                                <th className='text-center'>Unit</th>
                                <th className='text-center'>Unit Price</th>
                                <th className='text-center'>Total Price</th>
                            </tr>
                        </thead>
                        <tbody id="specifications_table_body">
                            <tr id="specification_row_1">
                                <td id="specification_serial_number_1"></td>
                                <td id="specification_description_1" contentEditable onInput={ onContentInput }></td>
                                <td id="specification_quantity_1" contentEditable onInput={ onContentInput }></td>
                                <td id="specification_unit_1" contentEditable onInput={ onContentInput }></td>
                                <td id="specification_est_cost_1" contentEditable onInput={ onContentInput }></td>
                                <td id="specification_total_cost_1"></td>
                            </tr>
                        </tbody>
                        <tfoot id="specifications_table_footer">
                            <tr id="specification_total_row">
                                <td className='border-0'></td>
                                <td className='border-0'></td>
                                <td className='border-0'></td>
                                <td className='border-0'></td>
                                <td className='text-center' id="sub_total_calculated_amount_label"><b>Sub Total</b></td>
                                <td id="sub_total_calculated_amount"></td>
                            </tr>
                            <tr id="additional_labels_1">
                                <td className='border-0'></td>
                                <td className='border-0'></td>
                                <td className='border-0'></td>
                                <td className='border-0'></td>
                                <td className='text-center' id="additional_label_1" contentEditable onInput={ onFooterContentInput }></td>
                                <td id="additional_value_1" contentEditable onInput={ onFooterContentInput }></td>
                            </tr>
                            <tr id="final_total">
                                <td className='border-0'></td>
                                <td className='border-0'></td>
                                <td className='border-0'></td>
                                <td className='border-0 plus'>
                                    <i className="las la-plus-circle la-2x" style={ { cursor: 'pointer' } } title='Add New Row' onClick={ addAdditionalRow }></i>
                                </td>
                                <td className='text-center' id="total_calculated_amount_label"><b>Total</b></td>
                                <td id="total_calculated_amount"></td>
                            </tr>
                        </tfoot>
                    </table>

                    <div className="d-flex align-items-center justify-content-between">
                        
                        <div className="btn-group">
                            <button className="btn green" type='button' onClick={ () => setShowBillModal(true) }>Attached Bills ({ Bills.length })</button>
                            <button className="btn submit" type='button' onClick={ () => setPRAttachment(true) }> { PR ? "PR Attached" : "Attach PR" }</button>
                        </div>
                        <button className="btn submit" type='submit'>Generate Purchase Order</button>

                    </div>
                </fieldset>
            </form>
        </>
    )

}

const RequestDetailsView = ( { SubOrdinands, loadSubOrdinands, PRSpecifications, PRequestDetails, AdditionalRows, ApproveRequisition, history, Bills, Specifications, RequestDetails, CancelRequisition, RejectRequisition, openRequestDetails } ) => {

    const [ View, setView ] = useState("application");

    useEffect(
        () => {

            const po_id = window.location.href.split('?').pop().split('=').pop();
            openRequestDetails( po_id );

        }, []
    )

    return (
        <>
            {
                RequestDetails
                ?
                parseInt(RequestDetails.requested_by) === parseInt(localStorage.getItem("EmpID")) ||
                parseInt(RequestDetails.appr_rejct_by) === parseInt(localStorage.getItem("EmpID"))
                ?
                <Detailing SubOrdinands={ SubOrdinands } loadSubOrdinands={ loadSubOrdinands } PRSpecifications={ PRSpecifications } PRequestDetails={ PRequestDetails } AdditionalRows={ AdditionalRows } ApproveRequisition={ ApproveRequisition } po_id={ window.location.href.split('?').pop().split('=').pop() } RejectRequisition={ RejectRequisition } CancelRequisition={ CancelRequisition } history={ history } Bills={ Bills } setView={ setView } View={ View } RequestDetails={ RequestDetails } Specifications={ Specifications } />
                :
                <>
                    <h6 className="text-center">Access Denied</h6>
                    <p className="text-center mb-0">
                        You don't have access to view the Purchase Order details (id#{RequestDetails.pr_id}).
                    </p>
                </>
                :
                <h6 className="text-center">Loading Details....</h6>
            }
        </>
    )

}

const Detailing = ( { SubOrdinands, loadSubOrdinands, PRSpecifications, PRequestDetails, AdditionalRows, po_id, CancelRequisition, ApproveRequisition, RejectRequisition, history, Bills, View, setView, RequestDetails, Specifications } ) => {

    const [ CancelConfirm, setCancelConfirm ] = useState(false);
    const [ RejectConfirm, setRejectConfirm ] = useState(false);
    const [ ApprovalConfirm, setApprovalConfirm ] = useState(false);

    return (
        <>
            <div className="purchase_requisition_details">
                <Modal show={ CancelConfirm } Hide={ () => setCancelConfirm(false) } content={ <CancelConfirmation po_id={ po_id } CancelRequisition={ CancelRequisition } /> } />
                <Modal show={ ApprovalConfirm } Hide={ () => setApprovalConfirm(false) } content={ <ApprovalConfirmation SubOrdinands={ SubOrdinands } loadSubOrdinands={ loadSubOrdinands } requested_by={ RequestDetails.requested_by } po_id={ po_id } ApproveRequisition={ ApproveRequisition } /> } />
                <Modal show={ RejectConfirm } Hide={ () => setRejectConfirm(false) } content={ <RejectConfirmation RequestDetails={ RequestDetails } Specifications={ Specifications } po_id={ po_id } RejectRequisition={ RejectRequisition } /> } />

                <div className="d-flex align-items-end justify-content-between">
                    <h4 className="heading">
                        Purchase Order
                        <sub>Request Details</sub>
                    </h4>
                    <div className='btn-group'>
                        <button className="btn green" onClick={ () => history.replace('/purchase/order/requests') }>Back To Requests</button>
                        <button className={ View === 'application' ? "btn submit" : "btn green" } onClick={ () => setView('application') }>Application</button>
                        <button className={ View === 'request_status' ? "btn submit" : "btn green" } onClick={ () => setView('request_status') }>Request Status</button>
                    </div>
                </div>
                <hr />

                <div className='ml-auto mb-2' style={ { width: 'fit-content' } }>
                    <div className="btn-group">
                        {
                            RequestDetails.requested_by != localStorage.getItem('EmpID') &&
                            RequestDetails.appr_rejct_by == localStorage.getItem('EmpID') &&
                            RequestDetails.status === 'waiting_for_approval'
                            ?
                            <>
                                <button className="btn cancle" onClick={ () => setRejectConfirm(true) }>Reject</button>
                                <button className="btn submit" onClick={ () => setApprovalConfirm(true) }>Approve</button>
                            </>
                            :null
                        }

                        {
                            RequestDetails.requested_by == localStorage.getItem('EmpID') &&
                            ( RequestDetails.status === 'sent' || RequestDetails.status === 'viewed' )
                            ?
                            <>
                                <button className="btn cancle" onClick={ () => setCancelConfirm(true) }>Cancel</button>
                            </>
                            :null
                        }
                    </div>
                </div>

                {
                    View === 'application'
                    ?
                    <form className='popUps'>   
                        <fieldset disabled>
                            <div className="flex_container mb-3">

                                <div>
                                    <label className="mb-0"><b>Company Name</b></label>
                                    <input value={ RequestDetails.company_name } className="form-control" />
                                </div>
                                <div>
                                    <label className="mb-0"><b>Delivery / Work Location</b></label>
                                    <input value={ RequestDetails.location_name } className="form-control" />
                                </div>

                            </div>

                            <div className="grid_container mb-3 px-5">

                                {
                                    RequestDetails.new_purchase === 1
                                    ?
                                    <div className='grid_container align-items-center'>
                                        <span>New Purchase</span>
                                        <input checked={ true } type="checkbox" className='ml-2' />
                                    </div>
                                    :null
                                }
                                {
                                    RequestDetails.repair
                                    ?
                                    <div className='grid_container align-items-center'>
                                        <span>Repair</span>
                                        <input checked={ true } type="checkbox" className='ml-2' />
                                    </div>
                                    :null
                                }
                                {
                                    RequestDetails.replace_recycle
                                    ?
                                    <div className='grid_container align-items-center'>
                                        <span>Replacement / Recycle</span>
                                        <input checked={ true } type="checkbox" className='ml-2' />
                                    </div>
                                    :null
                                }
                                {
                                    RequestDetails.invoice_attached
                                    ?
                                    <div className='grid_container align-items-center'>
                                        <span>Invoice Attached</span>
                                        <input checked={ true } type="checkbox" className='ml-2' />
                                    </div>
                                    :null
                                }

                            </div>

                            <label className="mb-0"><b>Reason For Repair / Replacement / New Purchase</b></label>
                            <textarea className="form-control" value={ RequestDetails.reason } />

                            <br />

                            <label className="mb-1"><b>Purchase / Repair / Replacement Specifications</b></label>

                            <table className="table table-bordered">
                                <thead>
                                    <tr>
                                        <th className='text-center'>Sr.No.</th>
                                        <th className='text-center'>Description</th>
                                        <th className='text-center'>Quantity</th>
                                        <th className='text-center'>Unit Price</th>
                                        <th className='text-center'>Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        Specifications.map(
                                            ( val, index ) => {
                                                return (
                                                    <tr key={ index }>
                                                        <td className='text-center'> { index + 1 } </td>
                                                        <td className='text-center'> { val.description } </td>
                                                        <td className='text-center'> { val.quantity } { val.unit } </td>
                                                        <td className='text-center'> Rs { val.unit_price.toLocaleString('en') } </td>
                                                        <td className='text-center'> Rs { val.total_cost.toLocaleString('en') } </td>
                                                    </tr>
                                                )
                                            }
                                        )
                                    }
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td className='text-center'></td>
                                        <td className='text-center'></td>
                                        <td className='text-center'></td>
                                        <td className='text-center'><b>Sub Total</b></td>
                                        <td className='text-center'> Rs { RequestDetails.total_sub_value.toLocaleString('en') } </td>
                                    </tr>
                                    {
                                        AdditionalRows
                                        ?
                                        AdditionalRows.map(
                                            ( val, index ) => {
                                                return (
                                                    <tr key={ index }>
                                                        <td className='text-center'></td>
                                                        <td className='text-center'></td>
                                                        <td className='text-center'></td>
                                                        <td className='text-center text-capitalize'><b>{ val.label }</b></td>
                                                        <td className='text-center'> Rs { val.value.toLocaleString('en') } </td>
                                                    </tr>
                                                )
                                            }
                                        )
                                        :null
                                    }
                                    <tr>
                                        <td className='text-center'></td>
                                        <td className='text-center'></td>
                                        <td className='text-center'></td>
                                        <td className='text-center'><b>Total</b></td>
                                        <td className='text-center'> Rs { RequestDetails.total_value.toLocaleString('en') } </td>
                                    </tr>
                                </tfoot>
                            </table>

                            <label className="mb-0"><b>Additional Notes</b></label>
                            <textarea className="form-control" value={ RequestDetails.note } />
                            {/* <div className="d-flex align-items-center justify-content-between">

                                <button className="btn green" type='reset' onClick={ () => history.replace('/purchase/order/requests') }>Back To Requests</button>
                                <button className="btn submit" type='submit'>Generate Purchase Order</button>

                            </div> */}
                        </fieldset>
                    </form>
                    :
                    <div className='purchase_requisition_details_2' id="accordion">
                        <h6 className='collapse_toogle' data-toggle="collapse" data-target="#general_details" aria-expanded="false" aria-controls="general_details">General Detail</h6>
                        <div className="collapse show" id="general_details" data-parent="#accordion">
                            <table className="table table-bordered popUps">
                                <tbody>
                                    <tr>
                                        <th>Requisition</th>
                                        <td> 
                                            { RequestDetails.requested_employee_name } <br />
                                            { new Date(RequestDetails.requested_date).toDateString() } <br />
                                            { RequestDetails.requested_time }
                                        </td>
                                        <th>Accounts Vision</th>
                                        <td> 
                                            {
                                                RequestDetails.view_date
                                                ?
                                                <>
                                                    { new Date(RequestDetails.view_date).toDateString() } <br />
                                                    { RequestDetails.view_time }
                                                </>
                                                :
                                                <span className={ RequestDetails.status + " text-white status_div" }>Not Viewed</span>
                                            }
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>Proceed To</th>
                                        <td> 
                                            { RequestDetails.submit_to_employee_name ? RequestDetails.submit_to_employee_name : "Not Proceed Yet" }
                                        </td>
                                        <th>Request Status</th>
                                        <td> <span className={ RequestDetails.status + " text-white status_div" }>{ RequestDetails.status }</span> </td>
                                        <th>No of Items Requested</th>
                                        <td> { RequestDetails.no_items_requested } </td>
                                    </tr>
                                    <tr>
                                        {
                                            RequestDetails.remarks != null
                                            ?
                                            <>
                                                <th>
                                                    { RequestDetails.status === 'canceled' ? "Reason To Cancel" : "Inventory's Remarks" }
                                                </th>
                                                <td colSpan={5}>
                                                    { RequestDetails.remarks }
                                                </td>
                                            </>
                                            :null
                                        }
                                    </tr>
                                    <tr>
                                    {
                                            RequestDetails.hod_employee_name != null
                                            ?
                                            RequestDetails.status === 'rejected'
                                            ?
                                            <>
                                                <th>Rejected By</th>
                                                <td>{ RequestDetails.hod_employee_name }</td>
                                                <th>Rejection</th>
                                                <td>{ new Date(RequestDetails.act_date).toDateString() } at { RequestDetails.act_time }</td>
                                            </>
                                            :
                                            <>
                                                <th>{ RequestDetails.status === 'canceled' ? "Canceled By" : "Submitted To" }</th>
                                                <td>{ RequestDetails.hod_employee_name }</td>

                                                {
                                                    RequestDetails.status === 'approved'
                                                    ?
                                                    <>
                                                        <th>Approval</th>
                                                        <td>{ new Date(RequestDetails.act_date).toDateString() } at { RequestDetails.act_time }</td>
                                                        <th>H.O.D's Remarks</th>
                                                        <td>{ RequestDetails.remarks_from_hod }</td>
                                                    </>
                                                    :null
                                                }
                                            </>
                                            :null
                                        }
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        
                        <div className='collapse_toogle mb-2 d-flex justify-content-between' data-toggle="collapse" data-target="#attached_quotations" aria-expanded="false" aria-controls="attached_quotations">
                            <h6 className='mb-0'>Bills Attached</h6>
                            <h6 className='mb-0'>({Bills.length})</h6>
                        </div>
                        <div className="collapse mb-2" id="attached_quotations" data-parent="#accordion">
                            {
                                Bills.length === 0
                                ?
                                <h6 className="text-center">No Bill Attached</h6>
                                :
                                <div className="grid_container">
                                        
                                    {
                                        Bills.map(
                                            (val, index) => {

                                                return (
                                                    <div className='quotation_card'>
                                                        <img src={ process.env.REACT_APP_SERVER + '/' + val.bill } alt="quotation_preview" key={ index } />
                                                    </div>
                                                )
                                            }
                                        )
                                    }

                                </div>
                            }
                        </div>
                        
                        <div className='collapse_toogle d-flex justify-content-between' data-toggle="collapse" data-target="#attached_pr" aria-expanded="false" aria-controls="attached_pr">
                            <h6 className='mb-0'>PR Attachment</h6>
                            <h6 className='mb-0'>({PRequestDetails ? "Attached" : "Not Attached"})</h6>
                        </div>
                        
                        {
                            PRequestDetails
                            ?
                            <div className="collapse" id="attached_pr" data-parent="#accordion">
                                <form className='popUps'>   
                                    <fieldset disabled>
                                        <div className="flex_container mb-3">
    
                                            <div>
                                                <label className="mb-0"><b>Company Name</b></label>
                                                <input value={ PRequestDetails.company_name } className="form-control" />
                                            </div>
                                            <div>
                                                <label className="mb-0"><b>Delivery / Work Location</b></label>
                                                <input value={ PRequestDetails.location_name } className="form-control" />
                                            </div>
    
                                        </div>
    
                                        <div className="grid_container mb-3 px-5">
    
                                        {
                                            RequestDetails.new_purchase === 1
                                            ?
                                            <div className='grid_container align-items-center'>
                                                <span>New Purchase</span>
                                                <input checked={ true } type="checkbox" className='ml-2' />
                                            </div>
                                            :null
                                        }
                                        {
                                            RequestDetails.repair
                                            ?
                                            <div className='grid_container align-items-center'>
                                                <span>Repair</span>
                                                <input checked={ true } type="checkbox" className='ml-2' />
                                            </div>
                                            :null
                                        }
                                        {
                                            RequestDetails.replace_recycle
                                            ?
                                            <div className='grid_container align-items-center'>
                                                <span>Replacement / Recycle</span>
                                                <input checked={ true } type="checkbox" className='ml-2' />
                                            </div>
                                            :null
                                        }
                                        {
                                            RequestDetails.budgeted
                                            ?
                                            <div className='grid_container align-items-center'>
                                                <span>Budgeted</span>
                                                <input checked={ true } type="checkbox" className='ml-2' />
                                            </div>
                                            :null
                                        }
                                        {
                                            RequestDetails.not_budgeted
                                            ?
                                            <div className='grid_container align-items-center'>
                                                <span>Not Budgeted</span>
                                                <input checked={ true } type="checkbox" className='ml-2' />
                                            </div>
                                            :null
                                        }
                                        {
                                            RequestDetails.invoice_attached
                                            ?
                                            <div className='grid_container align-items-center'>
                                                <span>Invoice Attached</span>
                                                <input checked={ true } type="checkbox" className='ml-2' />
                                            </div>
                                            :null
                                        }
    
                                        </div>
    
                                        <label className="mb-0"><b>Reason For Repair / Replacement / New Purchase</b></label>
                                        <textarea className="form-control" value={ PRequestDetails.reason } />
    
                                        <br />
    
                                        <label className="mb-1"><b>Purchase / Repair / Replacement Specifications</b></label>
    
                                        <table className="table table-bordered">
                                            <thead>
                                                <tr>
                                                    <th className='text-center'>Sr.No.</th>
                                                    <th className='text-center'>Description</th>
                                                    <th className='text-center'>Quantity</th>
                                                    <th className='text-center'>Estimated Cost</th>
                                                    <th className='text-center'>Total Cost</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    PRSpecifications.map(
                                                        ( val, index ) => {
                                                            return (
                                                                <tr key={ index }>
                                                                    <td className='text-center'> { index + 1 } </td>
                                                                    <td className='text-center'> { val.description } </td>
                                                                    <td className='text-center'> { val.quantity } </td>
                                                                    <td className='text-center'> Rs { val.estimated_cost.toLocaleString('en') } </td>
                                                                    <td className='text-center'> Rs { val.total_estimated_cost.toLocaleString('en') } </td>
                                                                </tr>
                                                            )
                                                        }
                                                    )
                                                }
                                            </tbody>
                                            <tfoot>
                                                <tr>
                                                    <td className='text-center'></td>
                                                    <td className='text-center'></td>
                                                    <td className='text-center'></td>
                                                    <td className='text-center'><b>Total</b></td>
                                                    <td className='text-center'> Rs { PRequestDetails.total_value.toLocaleString('en') } </td>
                                                </tr>
                                            </tfoot>
                                        </table>
    
                                        <label className="mb-0"><b>Additional Notes</b></label>
                                        <textarea className="form-control" value={ PRequestDetails.note } />
                                    </fieldset>
                                </form>
                            </div>
                            :null
                        }

                    </div>
                }

            </div>
        </>
    )

}

const ApprovalConfirmation = ( { SubOrdinands, po_id, ApproveRequisition, requested_by, loadSubOrdinands } ) => {

    useEffect(
        () => {

            loadSubOrdinands();

        }, []
    );

    return (
        <>
            <form className='pt-1' onSubmit={ (e) => ApproveRequisition( e, po_id, requested_by ) }>
                <fieldset>
                    <h6 className='font-weight-bold'>Confirm Approval</h6>
                    <hr />
                    <div className="alert alert-success d-none" id="error_alert_approval"></div>
                    <textarea placeholder='Add Your Remarks...' name="reason" cols="30" rows="5" className='form-control' required minLength={30} />
                    {
                        SubOrdinands
                        ?
                        SubOrdinands.length === 0
                        ?
                        <p className="text-center">No Record Found</p>
                        :
                        <select name="submit_to" required className='form-control mt-3'>
                            <option value="">Select the option</option>
                            {
                                SubOrdinands.map(
                                    ( val, index ) => {
                                        return (
                                            <option key={ index } value={ val.emp_id }>{ val.name }</option>
                                        )
                                    }
                                )
                            }
                        </select>
                        :
                        <p className="text-center">Please Wait.....</p>
                    }
                    <button className='btn d-block ml-auto submit mt-3'>Confirm</button>
                </fieldset>
            </form>
        </>
    )

}

const CancelConfirmation = ( { pr_id, CancelRequisition } ) => {

    return (
        <>
            <form className='pt-1' onSubmit={ (e) => CancelRequisition( e, pr_id ) }>
                <fieldset>
                    <h6 className='font-weight-bold'>Confirm Cancellation</h6>
                    <hr />
                    <div className="alert alert-warning d-none" id="error_alert_cancelation"></div>
                    <textarea placeholder='Any Specific Reason...' name="reason" cols="30" rows="5" className='form-control' required minLength={30} />
                    <button className='btn d-block ml-auto submit mt-3'>Confirm</button>
                </fieldset>
            </form>
        </>
    )

}

const RejectConfirmation = ( { RequestDetails, Specifications, po_id, RejectRequisition } ) => {

    return (
        <>
            <form className='pt-1' onSubmit={ (e) => RejectRequisition( e, po_id, RequestDetails.requested_by, Specifications ) }>
                <fieldset>
                    <h6 className='font-weight-bold'>Confirm Rejection</h6>
                    <hr />
                    <div className="alert alert-warning d-none" id="error_alert_rejection"></div>
                    <textarea placeholder='Any Specific Reason...' name="reason" cols="30" rows="5" className='form-control' required minLength={30} />
                    <button className='btn d-block ml-auto submit mt-3'>Confirm</button>
                </fieldset>
            </form>
        </>
    )

}

const PORequests = ( { AccessControls, history, Requests, loadRequests } ) => {

    useEffect(
        () => {

            loadRequests()

        }, []
    )

    return (
        <>
            <div className="purchase_requests">
                <div className="d-flex align-items-end justify-content-between">
                    <h3 className="heading">
                        Purchase Order
                        <sub>Previous Requests</sub>
                    </h3>
                    {
                        AccessControls.access
                        ?
                        JSON.parse(AccessControls.access).includes(22) || JSON.parse(AccessControls.access).includes(0)
                        ?
                        <button className='btn submit' onClick={ () => history.replace('/purchase/order/form') }>New</button>
                        :null
                        :null
                    }
                </div>
                <hr />

                {
                    Requests
                    ?
                    Requests.length === 0
                    ?
                    <h6 className="text-center">No Request Found</h6>
                    :
                    <table className="table table-hover popUps">
                        <thead>
                            <tr>
                                <th>Sr.No</th>
                                <th>Company</th>
                                <th>Location</th>
                                <th>Items</th>
                                <th>Requisition</th>
                                <th>Status</th>
                                <th>Total Value</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                Requests.map(
                                    ( val, index ) => {
                                        return (
                                            <tr key={ index } title="Double Click To Enter" onDoubleClick={ () => history.push('/purchase/order/details?po_id=' + val.po_id) }>
                                                <td>{ index + 1 }</td>
                                                <td>{ val.company_name }</td>
                                                <td>{ val.location_name }</td>
                                                <td>{ val.no_items_requested > 1 ? (val.no_items_requested + " Items") : (val.no_items_requested + " Item") }</td>
                                                <td>
                                                    { new Date( val.requested_date ).toDateString() } <br />
                                                    { val.requested_time }
                                                </td>
                                                <td>
                                                    <span className={ "status_div text-white " + val.status }>
                                                        {
                                                            val.status === 'waiting_for_approval' && parseInt(val.appr_rejct_by) === parseInt(localStorage.getItem("EmpID"))
                                                            ?
                                                            "Pending"
                                                            :
                                                            val.status.replace('_', " ")
                                                        }
                                                    </span>
                                                </td>
                                                    <td>Rs { val.total_value.toLocaleString('en') }</td>
                                            </tr>
                                        )
                                    }
                                )
                            }
                        </tbody>
                    </table>
                    :
                    <h6 className="text-center">Please Wait....</h6>
                }
            </div>
        </>
    )

}

const PRAttachmentModal = ( { attachPR, PRList, PRSPec } ) => {

    return (
        <>
            <h5>Attach Purchase Requisition</h5>
            {/* <hr />
            <label className="mb-0"><b>Search Purchase Requisition</b></label>
            <input className="form-control" name="pr_id" required /> */}
            <hr />
            {
                PRList
                ?
                PRList.length === 0
                ?
                <p className="mb-0 text-center">No Record Found</p>
                :
                <table className="table table-sm table-hover">
                    <thead>
                        <tr>
                            <th>PR #</th>
                            <th>Specifications</th>
                            <th>Generate Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            PRList.map(
                                ( val, index ) => {
                                    return (
                                        <tr onClick={ () => attachPR( val.pr_id ) } key={index} style={ { cursor: 'pointer', transition: '.3s' } }>
                                            <td>#{val.pr_id}</td>
                                            <td>
                                                {
                                                    PRSPec.map(
                                                        ( value, index2 ) => {
                                                            let content = (
                                                                <div key={index2}>
                                                                    {
                                                                        value.map(
                                                                            ( value2, index3 ) => {
                                                                                let content2 = <></>
                                                                                if ( parseInt(value2.pr_id) === parseInt(val.pr_id) )
                                                                                {
                                                                                    content2 = (
                                                                                        <span key={ index3 } className="pr-1">
                                                                                            { value2.description }{ (index3 + 1) === value.length ? "" : "," }
                                                                                        </span>
                                                                                    );
                                                                                }

                                                                                return content2;
                                                                            }
                                                                        )
                                                                    }
                                                                </div>
                                                            );

                                                            return content;
                                                        }
                                                    )
                                                }
                                            </td>
                                            <td>{ new Date(val.requested_date).toDateString() }</td>
                                        </tr>
                                    )
                                }
                            )
                        }
                    </tbody>
                </table>
                :
                <p className="mb-0 text-center">Please Wait...</p>
            }
        </>
    )

}

const SubmitConfirmationModal = ( { Data, Relations, POSubmittion } ) => {

    return (
        <>
            <form onSubmit={ POSubmittion }>
                <h5>Confirmation</h5>
                <hr />
                <fieldset>
                    <label className="mb-0"><b>Any Additional Notes</b></label>
                    <textarea className="form-control" name="notes" required />

                    <label className="mb-0 mt-2"><b>Submit To</b></label>
                    <select className="form-control" name="request_to" required>
                        <option value="">Select the option</option>
                        {
                            !Data
                            ?null
                            :
                            Relations.map(
                                (val, index) => {
                                    let option;
                                    if ( val.category === 'all' || val.category.includes('purchase_order') )
                                    {
                                        if ( val.companies.includes( parseInt(Data.company_code) ) )
                                        {
                                            if ( val.pr_approval_limit && val.pr_approval_limit >= parseFloat(Data.total_calculated_amount) )
                                            {
                                                option = <option value={val.sr} key={index}> {val.name} </option>;
                                            }
                                        }
                                    }

                                    return option;
                                }
                            )
                        }
                    </select>
                    <button className='btn green d-block mx-auto mt-3'>Confirm & Submit</button>
                </fieldset>
            </form>
        </>
    )

}

const ModalContent = ( { Bills, setShowBillModal, onAttachBills } ) => {

    return (
        <>
            <div className='modal_content'>

                <div className="d-flex justify-content-between align-items-center">
                    <h4 className='mb-0'>Bills</h4>
                    <input type="file" className='quotations_file' onChange={ onAttachBills } multiple accept="image/*" />
                </div>
                <hr />

                {
                    Bills.length === 0
                    ?
                    <h6 className="text-center">No Bill Attached</h6>
                    :
                    <>
                        <div className="quotations_grid_container">

                            {
                                Bills.map(
                                    ( val, index ) => {
                                        return (
                                            <div>
                                                <img src={ URL.createObjectURL(val.file) } alt="attached_quotation" key={ index } />
                                                <span> { val.name } </span>
                                            </div>
                                        )
                                    }
                                )
                            }

                        </div>
                    </>
                }

                <button className="btn submit d-block mx-auto mt-3" onClick={ () => setShowBillModal(false) }>Close</button>

            </div>
        </>
    )

}