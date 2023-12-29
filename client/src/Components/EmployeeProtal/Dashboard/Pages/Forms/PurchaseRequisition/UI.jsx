/* eslint-disable no-eval */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/role-supports-aria-props */
/* eslint-disable no-mixed-operators */
/* eslint-disable eqeqeq */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react';
import './Style.css';

import loading from '../../../../../../images/loadingIcons/icons8-iphone-spinner.gif';
import axios from '../../../../../../axios';
import BreadCrumb from '../../../Components/BreadCrumb';
import { Route, Switch } from 'react-router-dom';
import Modal from '../../../../../UI/Modal/Modal';
import { useReactToPrint } from 'react-to-print';
import JSAlert from 'js-alert';
import $ from 'jquery';
import Override from '../../../../../../utils/Override';
// import { new Date } from '../../../../../../utils/date';

import ReactTooltip from 'react-tooltip';

const UI = ({ FilterEmployees, setFilterEmployees, CompanyLocations, setCompanyLocations, FilterLocation, setFilterLocation, setFilterCondition, FilterCondition, SiteManagerRejectionConfirm, SiteManagerApprovalConfirm, CompanyViewer, Logs, overrideRequisition, TotalCostCalculation, Status, RequestStatuses, RemovedQuotations, EditConfirmation, AccessDefined, Admin, InvRejectRequisition, setRemovedQuotations, sendForApproveRequisition, Relations, Data, HodList, setStatus, updatePR, loadHods, Employee, PRUpdate, selectEmpInBehalf, setQuotations, setEditConfirmation, onSearchEmployees, Employees, AccessControls, FilterAmount, FilterCompany, SpecKeyword, setFilterAmount, LoadedCompanies, setFilterCompany, setSpecKeyword, ApproveRequisition, AttachedQuotations, Specifications, RequestDetails, history, Requests, addRow, RejectRequisition, CancelRequisition, SubmitConfirmation, ShowQuotationModal, Quotations, Locations, Companies, SubmitPR, loadRequests, openRequestDetails, PRSubmittion, setSubmitConfirmation, onAttachQuotations, onContentInput, onContentEdit, setShowQuotationModal }) => {

    return (
        <>
            <div className="purchase_requisition">
                <Modal show={EditConfirmation} Hide={() => setEditConfirmation(!EditConfirmation)} content={<EditConfirmationModal Relations={Relations} Data={Data} RequestDetails={RequestDetails} PRUpdate={PRUpdate} />} />
                <Modal show={ShowQuotationModal} Hide={() => setShowQuotationModal(!ShowQuotationModal)} content={<ModalContent RemovedQuotations={RemovedQuotations} setRemovedQuotations={setRemovedQuotations} setQuotations={setQuotations} setShowQuotationModal={setShowQuotationModal} Quotations={Quotations} onAttachQuotations={onAttachQuotations} />} />
                {
                    window.location.hash.includes('/purchase/requisition/details')
                        ?
                        <BreadCrumb links={[{ label: 'All Purchase Requisitions', href: '/purchase/requisition/requests' }]} currentLabel={"Purchase Requisition Details - " + (RequestDetails ? (RequestDetails.company_short_code + '-' + RequestDetails.series_year + '-' + RequestDetails.series_code) : '')} />
                        :
                        window.location.hash.includes('/purchase/requisition/form')
                            ?
                            <BreadCrumb links={[{ label: 'All Purchase Requisitions', href: '/purchase/requisition/requests' }]} currentLabel="Purchase Requisition Form" />
                            : null
                }
                <div className="purchase_requisition_form">
                    <Modal show={SubmitConfirmation} Hide={() => setSubmitConfirmation(!SubmitConfirmation)} content={<SubmitConfirmationModal AccessControls={ AccessControls } Relations={Relations} Data={Data} HodList={HodList} loadHods={loadHods} Employee={Employee} PRSubmittion={PRSubmittion} />} />

                    <Switch>
                        <Route exact path="/purchase/requisition/form" render={
                            () => (
                                <PRForm
                                    Locations={Locations}
                                    Companies={Companies}
                                    Quotations={Quotations}
                                    history={history}
                                    AccessControls={AccessControls}
                                    Employees={Employees}
                                    Employee={Employee}

                                    TotalCostCalculation={TotalCostCalculation}
                                    selectEmpInBehalf={selectEmpInBehalf}
                                    onSearchEmployees={onSearchEmployees}
                                    addRow={addRow}
                                    SubmitPR={SubmitPR}
                                    onContentInput={onContentInput}
                                    setShowQuotationModal={setShowQuotationModal}
                                />
                            )
                        } />
                        <Route exact path="/purchase/requisition/requests" render={
                            () => (
                                <PRequests
                                    Requests={Requests}
                                    history={history}
                                    LoadedCompanies={LoadedCompanies}
                                    FilterCompany={FilterCompany}
                                    SpecKeyword={SpecKeyword}
                                    FilterAmount={FilterAmount}
                                    AccessControls={AccessControls}
                                    AccessDefined={AccessDefined}
                                    Status={Status}
                                    RequestStatuses={RequestStatuses}
                                    FilterCondition={FilterCondition}
                                    CompanyLocations={CompanyLocations}
                                    FilterLocation={FilterLocation}
                                    FilterEmployees={FilterEmployees}

                                    setFilterEmployees={setFilterEmployees}
                                    setFilterLocation={setFilterLocation}
                                    setFilterCondition={setFilterCondition}
                                    setStatus={setStatus}
                                    setFilterAmount={setFilterAmount}
                                    setFilterCompany={setFilterCompany}
                                    setSpecKeyword={setSpecKeyword}
                                    loadRequests={loadRequests}
                                />
                            )
                        } />
                        <Route exact path="/purchase/requisition/details" render={
                            () => (
                                <RequestDetailsView
                                    RequestDetails={RequestDetails}
                                    Specifications={Specifications}
                                    Quotations={AttachedQuotations}
                                    history={history}
                                    Relations={Relations}
                                    Admin={Admin}
                                    Logs={ Logs }
                                    Locations={ Locations }
                                    CompanyViewer={ CompanyViewer }
                                    AccessControls={AccessControls}

                                    SiteManagerRejectionConfirm={SiteManagerRejectionConfirm}
                                    SiteManagerApprovalConfirm={SiteManagerApprovalConfirm}
                                    overrideRequisition={overrideRequisition}
                                    sendForApproveRequisition={sendForApproveRequisition}
                                    onContentEdit={onContentEdit}
                                    openRequestDetails={openRequestDetails}
                                    CancelRequisition={CancelRequisition}
                                    RejectRequisition={RejectRequisition}
                                    InvRejectRequisition={InvRejectRequisition}
                                    ApproveRequisition={ApproveRequisition}
                                />
                            )
                        } />
                        <Route exact path="/purchase/requisition/form&&pr_id=:id" render={
                            () => (
                                <PRFormForEditing
                                    Locations={Locations}
                                    Companies={Companies}
                                    history={history}
                                    Specifications={Specifications}
                                    RequestDetails={RequestDetails}
                                    Quotations={Quotations}

                                    addRow={addRow}
                                    updatePR={updatePR}
                                    openRequestDetails={openRequestDetails}
                                    onContentInput={onContentInput}
                                    setShowQuotationModal={setShowQuotationModal}
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

const EditConfirmationModal = ({ RequestDetails, Relations, Data, PRUpdate }) => {

    return (
        <>
            {
                RequestDetails
                    ?
                    <form onSubmit={PRUpdate}>
                        <h5>Confirmation</h5>
                        <hr />
                        <fieldset>
                            <label className="mb-0"><b>Any Additional Notes</b></label>
                            <textarea className="form-control" name="notes" required defaultValue={RequestDetails.note} />

                            {
                                RequestDetails.status === 'waiting_for_approval'
                                ?
                                <>
                                    <label className="mb-0 mt-2"><b>Submit To</b></label>
                                    <select className="form-control" name="request_to" required>
                                        <option value="">Select the option</option>
                                        {
                                            !Data
                                                ? null
                                                :
                                                Relations.map(
                                                    (val, index) => {
                                                        let option;
                                                        if (val.category === 'all' || val.category.includes('purchase_requisition')) {
                                                            if (val.companies.includes(parseInt(Data.company_code))) {
                                                                if (val.pr_approval_limit && val.pr_approval_limit >= parseFloat(Data.total_value)) {
                                                                    option = <option value={val.sr} key={index}> {val.name} </option>;
                                                                }
                                                            }
                                                        }

                                                        return option;
                                                    }
                                                )
                                        }
                                    </select>
                                </>
                                :null
                            }
                            <button className='btn green d-block mx-auto mt-3'>Confirm & Update</button>
                        </fieldset>
                    </form>
                    : null
            }
        </>
    )

}

const PRFormForEditing = ({ Quotations, updatePR, RequestDetails, Specifications, openRequestDetails, history, Locations, Companies, addRow, onContentInput, setShowQuotationModal }) => {

    useEffect(
        () => {
            if (!RequestDetails) {
                const pr_id = window.location.href.split('&&pr_id=').pop();
                openRequestDetails(pr_id);
            }
        }, [RequestDetails]
    );

    return (
        <>
            <div className="d-flex align-items-center justify-content-between">
                <h3 className="heading">
                    Update Purchase Requisition
                    <sub>Application Form For Editing</sub>
                    <input type="text" id="draft_id" className='d-none' />
                </h3>

                <div className="btn-group">
                    <button className="btn submit" type='reset' onClick={() => history.goBack()}>
                        Back
                    </button>
                </div>
            </div>
            <hr />

            {
                RequestDetails
                    ?
                    <form onSubmit={updatePR}>
                        <fieldset>
                            <div className="flex_container mb-3">

                                <div>
                                    <label className="mb-0"><b>Company Name</b></label>
                                    <select className="form-control" name="company_code" id="form_company_code" disabled required>
                                        <option value=''>Select the option</option>
                                        {
                                            Companies.map(
                                                val => {

                                                    return <option key={val.company_code} value={val.company_code} selected={RequestDetails.company_code === val.company_code}> {val.company_name} </option>

                                                }
                                            )
                                        }
                                    </select>
                                </div>
                                <div>
                                    <label className="mb-0"><b>Delivery / Work Location</b></label>
                                    <select className="form-control" name="location_code" required>
                                        <option value=''>Select the option</option>
                                        {
                                            Locations.map(
                                                val => {

                                                    return <option key={val.location_code} value={val.location_code} selected={RequestDetails.location_code === val.location_code}> {val.location_name} </option>

                                                }
                                            )
                                        }
                                    </select>
                                </div>
                                {/* {
                            AccessControls.access && JSON.parse(AccessControls.access).map(
                                val => {
                                    let content = <></>;
                                    if ( parseInt(val) === 30 || parseInt(val) === 0 )
                                    {
                                        content = <div>
                                            <label className="mb-0"><b>Request on behalf of employee</b></label>
                                            <div className="p-relative">
                                                <input id="search_emps" placeholder='Search Employee Name....' onChange={ onSearchEmployees } className='form-control mb-3' />
                                                <div className={ Employees ? "p-absolute w-100 emp_list p-3" : "p-absolute w-100 emp_list" } id='emp_list'>
                                                    {
                                                        Employees
                                                        ?
                                                        Employees.length === 0
                                                        ?
                                                        <p className="text-center mb-0">No Record Found</p>
                                                        :
                                                        Employees.map(
                                                            ( val, index ) => {
                                                                let content = <></>

                                                                if ( val.emp_id != localStorage.getItem('EmpID') )
                                                                {
                                                                    content = (
                                                                        <div className="emp_item" key={ index } onClick={ () => selectEmpInBehalf( val.emp_id, val.name ) }>
                                                                            <img src={ process.env.REACT_APP_SERVER+'/images/employees/' + val.emp_image } alt="emp" />
                                                                            <div>
                                                                                <b>{ val.name }</b>
                                                                                <p className="mb-0">{ val.designation_name }</p>
                                                                            </div>
                                                                        </div>
                                                                    )
                                                                }else
                                                                if ( val.emp_id == localStorage.getItem('EmpID') && Employees.length === 1 )
                                                                {
                                                                    content = (
                                                                        <div style={ { wordBreak: 'break-word' } }>
                                                                            <b className="mb-0">No Need To Select</b>
                                                                            <p className="mb-0">You don't have to select yourself, if you want to send Purchase Requisition, the request will auto fill "requested by" field.</p>
                                                                        </div>
                                                                    )
                                                                }
                                                                return content;
                                                            }
                                                        )
                                                        :null
                                                    }
                                                </div>
                                            </div>
                                        </div>;
                                    }
                                    return content;
                                }
                            )
                        } */}

                            </div>

                            <div className="grid_container mb-3 px-5">

                                <div className='grid_container align-items-center'>
                                    <span>New Purchase</span>
                                    <input defaultChecked={RequestDetails.new_purchase === 1} type="checkbox" value="New Purchase" name="new_purchase" className='ml-2' />
                                </div>
                                <div className='grid_container align-items-center'>
                                    <span>Repair</span>
                                    <input defaultChecked={RequestDetails.repair === 1} type="checkbox" value="Repair" name="repair" className='ml-2' />
                                </div>
                                <div className='grid_container align-items-center'>
                                    <span>Replacement / Recycle</span>
                                    <input defaultChecked={RequestDetails.replace_recycle === 1} type="checkbox" value="Replacement / Recycle" name="replace_recycle" className='ml-2' />
                                </div>
                                <div className='grid_container align-items-center'>
                                    <span>Budgeted</span>
                                    <input defaultChecked={RequestDetails.budgeted === 1} type="checkbox" value="Budgeted" name="budgeted" className='ml-2' />
                                </div>
                                <div className='grid_container align-items-center'>
                                    <span>Not Budgeted</span>
                                    <input defaultChecked={RequestDetails.not_budgeted === 1} type="checkbox" value="Not Budgeted" name="not_budgeted" className='ml-2' />
                                </div>
                                <div className='grid_container align-items-center'>
                                    <span>Quotation Attached</span>
                                    <input defaultChecked={RequestDetails.invoice_attached === 1} type="checkbox" value="Quotation Attached" name="invoice_attached" className='ml-2' />
                                </div>

                            </div>

                            <label className="mb-0"><b>Reason For Repair / Replacement / New Purchase</b></label>
                            <textarea className="form-control" name="reason" defaultValue={RequestDetails.reason} required minLength={20} />

                            <br />

                            <div className="d-flex justify-content-between align-items-center">
                                <label className='mb-1'><b>Purchase / Repair / Replacement Specifications</b></label>
                                <i className="las la-plus-circle la-2x" style={{ cursor: 'pointer' }} title='Add New Row' onClick={addRow}></i>
                            </div>

                            <table className="table table-bordered">
                                <thead>
                                    <tr>
                                        <th className='text-center'>Sr.No.</th>
                                        <th className='text-center'>Description</th>
                                        <th className='text-center'>Quantity</th>
                                        <th className='text-center'>Estimated Price</th>
                                        <th className='text-center'>Total Price</th>
                                    </tr>
                                </thead>
                                <tbody id="specifications_table_body">
                                    {
                                        Specifications.map(
                                            (val, index) => {
                                                const num = index + 1;
                                                return (
                                                    <tr id={"specification_row_" + num} key={index}>
                                                        <td id={"specification_serial_number_" + num}>{val.specification_serial_number}</td>
                                                        <td id={"specification_description_" + num} contentEditable onInput={onContentInput}>{val.specification_description}</td>
                                                        <td id={"specification_quantity_" + num} contentEditable onInput={onContentInput}>{val.specification_quantity}</td>
                                                        <td id={"specification_est_cost_" + num} contentEditable onInput={onContentInput}>{val.specification_est_cost}</td>
                                                        <td id={"specification_total_cost_" + num}>{val.specification_total_cost}</td>
                                                    </tr>
                                                )
                                            }
                                        )
                                    }
                                </tbody>
                                <tfoot>
                                    <tr id="specification_total_row">
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td className='text-center' id="total_calculated_amount_label"><b>Total Estimated Amount</b></td>
                                        <td id="total_calculated_amount">{RequestDetails.total_value}</td>
                                    </tr>
                                </tfoot>
                            </table>

                            <div className="d-flex align-items-center justify-content-between">

                                <button className="btn green" type='button' onClick={() => setShowQuotationModal(true)}>Attached Quotations ({Quotations.length})</button>
                                <button className="btn submit" type='submit'>Update Purchase Requisition</button>

                            </div>
                        </fieldset>
                    </form>
                    : null
            }
        </>
    )

}

const PRForm = ({ TotalCostCalculation, Employee, selectEmpInBehalf, onSearchEmployees, Employees, AccessControls, history, Locations, Quotations, Companies, SubmitPR, setShowQuotationModal, addRow, onContentInput }) => {

    const [Drafts, setDrafts] = useState(false);

    const saveToDraft = () => {

        let company_code = $('select[name="company_code"]').val();
        let company_name = $('select[name="company_code"] option:selected').text();
        let location_code = $('select[name="location_code"]').val();
        let location_name = $('select[name="location_code"] option:selected').text();
        let behalfEmp = $('#search_emps').val();
        let draft_id = $('input#draft_id').val();
        let reason = $('textarea[name="reason"]').val();

        let new_purchase = $('input[name="new_purchase"]')[0].checked;
        let repair = $('input[name="repair"]')[0].checked;
        let replace_recycle = $('input[name="replace_recycle"]')[0].checked;
        let invoice_attached = $('input[name="invoice_attached"]')[0].checked;
        let budgeted = $('input[name="budgeted"]')[0].checked;
        let not_budgeted = $('input[name="not_budgeted"]')[0].checked;

        let rows = document.getElementById('specifications_table_body').childNodes;
        let rows_array = Object.keys(rows).map((key) => [rows[key]]);
        let specifications = [];

        for (let x = 0; x < rows_array.length; x++) {
            let row = [];
            let columns = rows_array[x][0].childNodes;
            let columns_array = Object.keys(columns).map((key) => [columns[key]])
            for (let y = 0; y < columns_array.length; y++) {
                row.push(
                    {
                        id: columns_array[y][0].id,
                        value: columns_array[y][0].textContent
                    }
                );
            }

            specifications.push(row);

        }

        const data = {
            draft_id: new Date().getTime(),
            company_code: company_code,
            company_name: company_name,
            location_name: location_name,
            location_code: location_code,
            reason: reason,
            behalfEmp: behalfEmp,
            behalfEmpID: Employee,
            new_purchase: new_purchase,
            repair: repair,
            replace_recycle: replace_recycle,
            invoice_attached: invoice_attached,
            budgeted: budgeted,
            not_budgeted: not_budgeted,
            specifications: JSON.stringify(specifications)
        }

        if (localStorage.getItem('prDrafts')) {

            let pr_list = JSON.parse(localStorage.getItem('prDrafts'));
            let exists = false;
            for (let x = 0; x < pr_list.length; x++) {
                if (pr_list[x].draft_id == draft_id) {
                    pr_list[x] = data;
                    localStorage.setItem('prDrafts', JSON.stringify(pr_list));
                    exists = true;
                    JSAlert.alert("PR Saved In Draft.").dismissIn(1000 * 1);
                    history.replace('/dashboard');
                    setTimeout(() => {
                        history.replace('/purchase/requisition/form');
                    }, 200);
                }
            }

            if (!exists) {
                if (pr_list.length < 5) {
                    pr_list.push(data);
                    localStorage.setItem('prDrafts', JSON.stringify(pr_list));
                    JSAlert.alert("PR Saved In Draft.").dismissIn(1000 * 1);
                    history.replace('/dashboard');
                    setTimeout(() => {
                        history.replace('/purchase/requisition/form');
                    }, 200);
                } else {
                    JSAlert.alert("PR Draft Limit Exceed 😒.").dismissIn(1000 * 1);
                }
            }

        } else {
            localStorage.setItem('prDrafts', JSON.stringify([data]));
            JSAlert.alert("PR Saved In Draft.").dismissIn(1000 * 1);
            history.replace('/dashboard');
            setTimeout(() => {
                history.replace('/purchase/requisition/form');
            }, 200);
        }

    }

    const clearDraft = (index) => {

        let pr_list = JSON.parse(localStorage.getItem('prDrafts'));

        let arr = pr_list.filter(function (item, id) {
            return id !== index
        });

        if (arr.length === 0) {
            localStorage.removeItem('prDrafts');
        } else {
            localStorage.setItem('prDrafts', JSON.stringify(arr));
        }

        setDrafts(!Drafts);

    }

    const activateDraft = (index) => {

        let pr_list = JSON.parse(localStorage.getItem('prDrafts'));
        let pr = pr_list[index];
        $('select[name="company_code"]').val(pr.company_code);
        $('select[name="location_code"]').val(pr.location_code);

        $('input[name="new_purchase"]').prop('checked', pr.new_purchase);
        $('input[name="repair"]').prop('checked', pr.repair);
        $('input[name="replace_recycle"]').prop('checked', pr.replace_recycle);
        $('input[name="invoice_attached"]').prop('checked', pr.invoice_attached);
        $('input[name="budgeted"]').prop('checked', pr.budgeted);
        $('input[name="not_budgeted"]').prop('checked', pr.not_budgeted);

        $('textarea[name="reason"]').val(pr.reason);

        $("#specifications_table_body").children("tr").remove();
        $("#specifications_table_footer").children("tr").eq(1).remove();

        let specifications = JSON.parse(pr.specifications);
        for (let x = 0; x < specifications.length; x++) {
            addRows(specifications[x]);
        }
        TotalCostCalculation();
        selectEmpInBehalf(pr.behalfEmpID, pr.behalfEmp)

        document.getElementById('draft_id').value = pr.draft_id;

    }

    const addRows = (val) => {

        let rows = document.getElementById('specifications_table_body').childNodes;
        let row = document.createElement('tr');
        row.id = "specification_row_" + parseInt(rows.length + 1);

        let column_serial_number = document.createElement('td');
        column_serial_number.id = "specification_serial_number_" + parseInt(rows.length + 1);
        column_serial_number.textContent = val[0].value;

        let column_description = document.createElement('td');
        column_description.contentEditable = true;
        column_description.addEventListener('input', onContentInput);
        column_description.id = "specification_description_" + parseInt(rows.length + 1);
        column_description.textContent = val[1].value;

        let column_quantity = document.createElement('td');
        column_quantity.contentEditable = true;
        column_quantity.addEventListener('input', onContentInput);
        column_quantity.id = "specification_quantity_" + parseInt(rows.length + 1);
        column_quantity.textContent = val[2].value;

        let column_est_cost = document.createElement('td');
        column_est_cost.contentEditable = true;
        column_est_cost.addEventListener('input', onContentInput);
        column_est_cost.id = "specification_est_cost_" + parseInt(rows.length + 1);
        column_est_cost.textContent = val[3].value;

        let column_total_est_cost = document.createElement('td');
        column_total_est_cost.id = "specification_total_cost_" + parseInt(rows.length + 1);
        column_total_est_cost.textContent = val[4].value;

        row.appendChild(column_serial_number);
        row.appendChild(column_description);
        row.appendChild(column_quantity);
        row.appendChild(column_est_cost);
        row.appendChild(column_total_est_cost);

        document.getElementById('specifications_table_body').appendChild(row);

    }

    return (
        <>
            <div className="d-flex align-items-center justify-content-between">
                <h3 className="heading">
                    Purchase Requisition
                    <sub>Application Form</sub>
                    <input type="text" id="draft_id" className='d-none' />
                </h3>

                <div className='btn-group'>
                    <button className="btn submit" type='reset' onClick={() => history.replace('/purchase/requisition/requests')}>Back To Requests</button>
                    {
                        localStorage.getItem('prDrafts')
                            ?
                            <button className="btn green draftBtn" type='button'>
                                Draft <sup>({JSON.parse(localStorage.getItem('prDrafts')).length})</sup>
                                <div className='draft_list'>

                                    {
                                        JSON.parse(localStorage.getItem('prDrafts')).map(
                                            (val, index) => {
                                                return (
                                                    <div className="draftItem bg-white" key={index}>
                                                        <div onClick={() => activateDraft(index)}>
                                                            <b>
                                                                {val.company_name}
                                                            </b><br />
                                                            <span>
                                                                {val.location_name}
                                                            </span>
                                                            <br />
                                                            {
                                                                JSON.parse(val.specifications).map(
                                                                    (value, id) => {
                                                                        return <span key={id}>{value[1].value + ((id + 1) === JSON.parse(val.specifications).length ? '' : ',')}</span>
                                                                    }
                                                                )
                                                            }
                                                        </div>
                                                        <i className="las la-times-circle" onClick={() => clearDraft(index)}></i>
                                                    </div>
                                                )
                                            }
                                        )
                                    }

                                </div>
                            </button>
                            : null
                    }
                    <button className={localStorage.getItem('prDrafts') ? "btn submit" : "btn green"} type='button' onClick={saveToDraft}>
                        Save As Draft
                    </button>
                </div>
            </div>
            <hr />

            <form onSubmit={SubmitPR}>
                <fieldset>
                    <div className="flex_container mb-3">

                        <div>
                            <label className="mb-0"><b>Company Name</b></label>
                            <select className="form-control" name="company_code" id="form_company_code" required>
                                <option value=''>Select the option</option>
                                {
                                    Companies.map(
                                        val => {

                                            return <option key={val.company_code} value={val.company_code}> {val.company_name} </option>

                                        }
                                    )
                                }
                            </select>
                        </div>
                        <div>
                            <label className="mb-0"><b>Delivery / Work Location</b></label>
                            <select className="form-control" name="location_code" required>
                                <option value=''>Select the option</option>
                                {
                                    Locations.map(
                                        val => {

                                            return <option key={val.location_code} value={val.location_code}> {val.location_name} </option>

                                        }
                                    )
                                }
                            </select>
                        </div>
                        {
                            AccessControls.access && JSON.parse(AccessControls.access).filter(access => parseInt(access) === 57)[0]
                            ?
                            <div>
                                <label className="mb-0"><b>Request on behalf of employee</b></label>
                                <div className="p-relative">
                                    <input id="search_emps" placeholder='Search Employee Name....' onChange={onSearchEmployees} className='form-control mb-3' />
                                    <div className={Employees ? "p-absolute w-100 emp_list p-3" : "p-absolute w-100 emp_list"} id='emp_list'>
                                        {
                                            Employees
                                                ?
                                                Employees.length === 0
                                                    ?
                                                    <p className="text-center mb-0">No Record Found</p>
                                                    :
                                                    Employees.map(
                                                        (val, index) => {
                                                            let content = <></>

                                                            if (val.emp_id != localStorage.getItem('EmpID')) {
                                                                content = (
                                                                    <div className="emp_item" key={index} onClick={() => selectEmpInBehalf(val.emp_id, val.name)}>
                                                                        <img src={process.env.REACT_APP_SERVER+'/images/employees/' + val.emp_image} alt="emp" />
                                                                        <div>
                                                                            <b>{val.name}</b>
                                                                            <p className="mb-0">{val.designation_name}</p>
                                                                        </div>
                                                                    </div>
                                                                )
                                                            } else
                                                                if (val.emp_id == localStorage.getItem('EmpID') && Employees.length === 1) {
                                                                    content = (
                                                                        <div style={{ wordBreak: 'break-word' }}>
                                                                            <b className="mb-0">No Need To Select</b>
                                                                            <p className="mb-0">You don't have to select yourself, if you want to send Purchase Requisition, the request will auto fill "requested by" field.</p>
                                                                        </div>
                                                                    )
                                                                }
                                                            return content;
                                                        }
                                                    )
                                                : null
                                        }
                                    </div>
                                </div>
                            </div>
                            :null
                        }

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
                            <span>Budgeted</span>
                            <input type="checkbox" value="Budgeted" name="budgeted" className='ml-2' />
                        </div>
                        <div className='grid_container align-items-center'>
                            <span>Not Budgeted</span>
                            <input type="checkbox" value="Not Budgeted" name="not_budgeted" className='ml-2' />
                        </div>
                        <div className='grid_container align-items-center'>
                            <span>Quotation Attached</span>
                            <input type="checkbox" value="Quotation Attached" name="invoice_attached" className='ml-2' />
                        </div>

                    </div>

                    <label className="mb-0"><b>Reason For Repair / Replacement / New Purchase</b></label>
                    <textarea className="form-control" name="reason" required minLength={20} />

                    <br />

                    <div className="d-flex justify-content-between align-items-center">
                        <label className='mb-1'><b>Purchase / Repair / Replacement Specifications</b></label>
                        <i className="las la-plus-circle la-2x" style={{ cursor: 'pointer' }} title='Add New Row' onClick={addRow}></i>
                    </div>

                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th className='text-center'>Sr.No.</th>
                                <th className='text-center'>Description</th>
                                <th className='text-center'>Quantity</th>
                                <th className='text-center'>Estimated Price</th>
                                <th className='text-center'>Total Price</th>
                            </tr>
                        </thead>
                        <tbody id="specifications_table_body">
                            <tr id="specification_row_1">
                                <td id="specification_serial_number_1"></td>
                                <td id="specification_description_1" contentEditable onInput={onContentInput}></td>
                                <td id="specification_quantity_1" contentEditable onInput={onContentInput}></td>
                                <td id="specification_est_cost_1" contentEditable onInput={onContentInput}></td>
                                <td id="specification_total_cost_1"></td>
                            </tr>
                        </tbody>
                        <tfoot>
                            <tr id="specification_total_row">
                                <td></td>
                                <td></td>
                                <td></td>
                                <td className='text-center' id="total_calculated_amount_label"><b>Total Estimated Amount</b></td>
                                <td id="total_calculated_amount"></td>
                            </tr>
                        </tfoot>
                    </table>

                    <div className="d-flex align-items-center justify-content-between">

                        <button className="btn green" type='button' onClick={() => setShowQuotationModal(true)}>Attached Quotations ({Quotations.length})</button>
                        <button className="btn submit" type='submit'>Generate Purchase Requisition</button>

                    </div>
                </fieldset>
            </form>
        </>
    )

}

const RequestDetailsView = ({ AccessControls, SiteManagerRejectionConfirm, SiteManagerApprovalConfirm, CompanyViewer, Locations, Logs, overrideRequisition, Admin, InvRejectRequisition, sendForApproveRequisition, Relations, ApproveRequisition, history, Quotations, Specifications, RequestDetails, CancelRequisition, RejectRequisition, openRequestDetails, onContentEdit }) => {

    const [View, setView] = useState("application");

    useEffect(
        () => {

            const pr_id = window.location.href.split('?').pop().split('=').pop();
            openRequestDetails(pr_id)

        }, []
    )

    return (
        <>
            {
                RequestDetails
                    ?
                    CompanyViewer|| Admin ||
                        parseInt(RequestDetails.requested_by) === parseInt(localStorage.getItem("EmpID")) ||
                        parseInt(RequestDetails.request_submitted_on_behalf) === parseInt(localStorage.getItem("EmpID")) ||
                        parseInt(RequestDetails.appr_rejct_by) === parseInt(localStorage.getItem("EmpID")) ||
                        parseInt(RequestDetails.submitted_to) === parseInt(localStorage.getItem("EmpID")) ||
                        parseInt(RequestDetails.site_manager) === parseInt(localStorage.getItem("EmpID"))
                        ?
                        <Detailing
                            ApproveRequisition={ApproveRequisition}
                            pr_id={window.location.href.split('?').pop().split('=').pop()}
                            RejectRequisition={RejectRequisition}
                            InvRejectRequisition={InvRejectRequisition}
                            CancelRequisition={CancelRequisition}
                            history={history}
                            Quotations={Quotations}
                            setView={setView}
                            overrideRequisition={overrideRequisition}
                            View={View}
                            Logs={ Logs }
                            Admin={ Admin }
                            Locations={ Locations }
                            RequestDetails={RequestDetails}
                            Specifications={Specifications}
                            onContentEdit={onContentEdit}
                            Relations={Relations}
                            sendForApproveRequisition={sendForApproveRequisition}
                            SiteManagerApprovalConfirm={SiteManagerApprovalConfirm}
                            SiteManagerRejectionConfirm={SiteManagerRejectionConfirm}
                            AccessControls={AccessControls}
                        />
                        :
                        <>
                            <h6 className="text-center">Access Denied</h6>
                            <p className="text-center mb-0">
                                You don't have access to view the purchase requisition details (id#{RequestDetails.pr_id}).
                            </p>
                        </>
                    :
                    <h6 className="text-center">Loading Details....</h6>
            }
        </>
    )

}

const Detailing = ({ AccessControls, SiteManagerRejectionConfirm, SiteManagerApprovalConfirm, Admin, Locations, Logs, overrideRequisition, sendForApproveRequisition, Relations, pr_id, CancelRequisition, ApproveRequisition, InvRejectRequisition, RejectRequisition, history, Quotations, View, setView, RequestDetails, Specifications, onContentEdit }) => {
    const onBeforeGetContentResolve = useRef();

    const [PrintContentLoaded, setPrintContentLoaded] = useState(false);
    const [CancelConfirm, setCancelConfirm] = useState(false);
    const [RejectConfirm, setRejectConfirm] = useState(false);
    const [ApprovalConfirm, setApprovalConfirm] = useState(false);
    const [InvApprovalConfirm, setInvApprovalConfirm] = useState(false);
    const [InvRejectConfirm, setInvRejectConfirm] = useState(false);
    const [siteManagerApproval, setSiteManagerApproval] = useState(false);
    const [siteManagerRejection, setSiteManagerRejection] = useState(false);
    const [StartPrint, setStartPrint] = useState(false);
    const [EditContent, setEditContent] = useState(<></>);
    const [EditConfirm, setEditConfirm] = useState(false);

    useEffect(
        () => {
            setEditContent(
                <div>
                    <h5>You want to edit this purchase requisition?</h5>
                    <button className='btn light d-block ml-auto' onClick={() => history.push('/purchase/requisition/form&&pr_id=' + window.location.href.split('/').pop().split('pr_id=').pop())}>Yes</button>
                </div>
            );
        }, []
    )
    useEffect(() => {
        if (PrintContentLoaded) {
            // Resolves the Promise, telling `react-to-print` it is time to gather the content of the page for printing
            onBeforeGetContentResolve.current();
        }
    }, [PrintContentLoaded, onBeforeGetContentResolve]);

    const componentRef = useRef();
    const handleOnBeforeGetContent = () => {
        return new Promise((resolve) => { // `react-to-print` will wait for this Promise to resolve before continuing
            // Load data
            onBeforeGetContentResolve.current = resolve;
            setPrintContentLoaded(true); // When data is done loading
        });
    };
    const handlePrint = useReactToPrint(
        {
            content: () => componentRef.current,
            copyStyles: true,
            pageStyle: 'p-3',
            onBeforeGetContent: handleOnBeforeGetContent,
            onAfterPrint: () => { setStartPrint(false); setPrintContentLoaded(false); }
        }
    );
    const printPR = () => {
        setStartPrint(true);
        handlePrint();
    }

    return (
        <>
            <div className="purchase_requisition_details">
                <Modal show={EditConfirm} Hide={() => setEditConfirm(false)} content={EditContent} />
                {CancelConfirm?<Modal show={true} Hide={() => setCancelConfirm(false)} content={<CancelConfirmation pr_id={pr_id} CancelRequisition={CancelRequisition} />} />: null}
                {ApprovalConfirm?<Modal show={true} Hide={() => setApprovalConfirm(false)} content={<ApprovalConfirmation submitted_to={RequestDetails.submitted_to} requested_by={RequestDetails.requested_by} pr_id={pr_id} ApproveRequisition={ApproveRequisition} />} />: null}
                {RejectConfirm?<Modal show={true} Hide={() => setRejectConfirm(false)} content={<RejectConfirmation RequestDetails={RequestDetails} Specifications={Specifications} pr_id={pr_id} RejectRequisition={RejectRequisition} />} />: null}
                {InvApprovalConfirm?<Modal show={true} Hide={() => setInvApprovalConfirm(false)} content={<InvApprovalConfirmation RequestDetails={RequestDetails} Relations={Relations} submitted_to={RequestDetails.submitted_to} requested_by={RequestDetails.requested_by} pr_id={pr_id} sendForApproveRequisition={sendForApproveRequisition} />} />: null}
                {InvRejectConfirm?<Modal show={true} Hide={() => setInvRejectConfirm(false)} content={<InvRejectConfirmation RequestDetails={RequestDetails} Specifications={Specifications} pr_id={pr_id} InvRejectRequisition={InvRejectRequisition} />} />: null}
                {siteManagerApproval?<Modal show={true} Hide={() => setSiteManagerApproval(false)} content={<SiteManagerApprovalModal RequestDetails={RequestDetails} Specifications={Specifications} pr_id={pr_id} SiteManagerApprovalConfirm={SiteManagerApprovalConfirm} />} />: null}
                {siteManagerRejection?<Modal show={true} Hide={() => setSiteManagerRejection(false)} content={<SiteManagerRejectionModal RequestDetails={RequestDetails} Specifications={Specifications} pr_id={pr_id} SiteManagerRejectionConfirm={SiteManagerRejectionConfirm} />} />: null}

                <div className="d-flex align-items-end justify-content-between">
                    <h4 className="heading">
                        Purchase Requisition
                        <sub>Request Details</sub>
                    </h4>
                    <div className='btn-group'>
                        <button className="btn green" onClick={() => history.replace('/purchase/requisition/requests')}>Back To Requests</button>
                        <button className={View === 'application' ? "btn submit" : "btn green"} onClick={() => setView('application')}>Application</button>
                        <button className={View === 'request_status' ? "btn submit" : "btn green"} onClick={() => setView('request_status')}>Quotations({Quotations.length})</button>
                    </div>
                </div>
                <hr />

                <div className='ml-auto mb-2' style={{ width: 'fit-content' }}>
                    <div className="btn-group">
                        {
                            RequestDetails.requested_by != localStorage.getItem('EmpID') &&
                                RequestDetails.appr_rejct_by == localStorage.getItem('EmpID') &&
                                RequestDetails.status === 'waiting_for_approval'
                                ?
                                <>
                                    <button className="btn cancle" onClick={() => setRejectConfirm(true)}>Reject</button>
                                    <button className="btn submit" onClick={() => setApprovalConfirm(true)}>Approve</button>
                                </>
                                : null
                        }

                        {
                            RequestDetails.status === 'waiting_for_approval'
                            ?
                            RequestDetails.submitted_to == localStorage.getItem('EmpID')
                            ?
                            <>
                                <button className="btn cancle" onClick={() => setCancelConfirm(true)}>Cancel</button>
                            </>
                            : null : null
                        }

                        {
                            RequestDetails.status === 'sent' ? RequestDetails.site_manager == localStorage.getItem('EmpID') ?
                            <>
                                <button className="btn cancle" onClick={() => setSiteManagerRejection(true)}>Reject</button>
                                <button className="btn submit" onClick={() => setSiteManagerApproval(true)}>Proceed</button>
                            </>
                            :null:null
                        }

                        {
                            RequestDetails.site_manager !== null && RequestDetails.status === 'sent'?null:
                            RequestDetails.site_manager !== null && RequestDetails.status === 'rejected'?null:
                            (JSON.parse(AccessControls.access).includes(57) && RequestDetails.site_manager !== null && RequestDetails.status === 'waiting_for_verification') || 
                            // (JSON.parse(AccessControls.access).includes(57) && RequestDetails.site_manager === null && RequestDetails.status === 'sent') ||
                            (JSON.parse(AccessControls.access).includes(57) && RequestDetails.submitted_to == localStorage.getItem('EmpID') && RequestDetails.status === 'waiting_for_approval')?
                            <>
                                <button className="btn submit" onClick={() => setEditConfirm(true)}>Edit</button>
                            </>
                            : null
                        }
                        {
                            RequestDetails.site_manager !== null && RequestDetails.status === 'sent'?null:
                            RequestDetails.site_manager !== null && RequestDetails.status === 'rejected'?null:
                            (JSON.parse(AccessControls.access).includes(57) && RequestDetails.site_manager !== null && RequestDetails.status === 'waiting_for_verification') || 
                            (JSON.parse(AccessControls.access).includes(57) && RequestDetails.site_manager === null && RequestDetails.status === 'sent')?
                            <>
                                <button className="btn cancle" onClick={() => setInvRejectConfirm(true)}>Reject</button>
                                <button className="btn submit" onClick={() => setInvApprovalConfirm(true)}>Proceed For Approval</button>
                            </>
                            :null
                        }

                        {
                            RequestDetails.requested_by == localStorage.getItem('EmpID') &&
                            (RequestDetails.status === 'sent' || RequestDetails.status === 'viewed')
                            ?
                            <>
                                <button className="btn cancle" onClick={() => setCancelConfirm(true)}>Cancel</button>
                            </>
                            : null
                        }
                        {
                            RequestDetails.requested_by == localStorage.getItem('EmpID') && RequestDetails.status === 'sent'
                            ?
                            <button className="btn submit" onClick={() => setEditConfirm(true)}>Edit</button>
                            :null
                        }
                        <button className='btn light' onClick={printPR}>Print</button>
                        {
                            (RequestDetails.status === 'waiting_for_approval' || RequestDetails.status === 'sent' || RequestDetails.status === 'viewed')
                            ?
                            <Override
                                onSubmit={overrideRequisition}
                            />
                            :null
                        }
                    </div>
                    {/* <button className="btn submit ml-2 px-1 pl-2" onClick={ () => setEditConfirm(true) }><i style={{ fontSize: 17 }} className="las la-edit"></i></button> */}
                </div>

                {
                    View === 'application'
                    ?
                    <>
                        <table className='table table-borderless'>
                            <tbody>
                                <tr>
                                    <td>
                                        <b>Company Name</b><br />
                                        <span>{RequestDetails.company_name}</span><br />
                                        <b>Delivery / Work Location</b><br />
                                        <span className={Logs.filter(log => log.match_key === 'location_code')[0] ? "log_found" : ""}>
                                            {RequestDetails.location_name}
                                            {
                                                Logs.filter(log => log.match_key === 'location_code')[0]?
                                                <div className='log_details'>
                                                    <p className='font-weight-bold mb-0'>Original</p>
                                                    <p className='mb-0'>{Locations?.filter(location => location.location_code == Logs.filter(log => log.match_key === 'location_code')[0]['before_value'])[0]?.location_name}</p>
                                                    <hr className='my-1' />
                                                    <p className='font-weight-bold mb-0'>After</p>
                                                    {
                                                        Logs.filter(log => log.match_key === 'location_code').map(
                                                            ({after_value, created_at, name, remarks}, i) => {
                                                                return (
                                                                    <div key={i} title={remarks}>
                                                                        <p className='mb-0'>
                                                                            {Locations?.filter(location => location.location_code == after_value)[0]?.location_name} 
                                                                            {Locations?.filter(location => location.location_code == after_value)[0]?.location_name === RequestDetails.location_name ? <span className='text-success pl-1'>&#40;Current&#41;</span> : ""}
                                                                        </p>
                                                                        <small className='text-right d-block'>{new Date(created_at).toDateString()} at {new Date(created_at).toLocaleTimeString()}</small>
                                                                        <small className='mb-0 text-right d-block text-danger'>{name}</small>
                                                                    </div>
                                                                )
                                                            }
                                                        )
                                                    }
                                                </div>
                                                :null
                                            }
                                        </span>
                                    </td>
                                    <td>
                                        <b>Requested By</b><br />
                                        <span>
                                            {RequestDetails.requested_employee_name} <br />
                                            {new Date(RequestDetails.requested_date).toDateString()} <br />
                                            {RequestDetails.requested_time}
                                        </span>
                                    </td>
                                    <td>
                                        {
                                            RequestDetails.site_manager
                                            ?
                                            <>
                                                <b>Submitted To</b><br />
                                                <span>
                                                    {RequestDetails.site_manager_name}
                                                    {RequestDetails.site_manager == localStorage.getItem('EmpID')?<b> (You)</b>:null}
                                                    {RequestDetails.site_act_date?<><br/>{new Date(RequestDetails.site_act_date).toDateString()}</>:null}
                                                    {RequestDetails.site_act_time?<><br/>{RequestDetails.site_act_time}</>:null}
                                                </span><br />
                                                {/* <span>{RequestDetails.submit_to_employee_name}</span><br /> */}
                                                {
                                                    RequestDetails.behalf_employee_name
                                                    ?
                                                    <>
                                                        <b>Employee Name (On Behalf Of)</b><br />
                                                        <span>{RequestDetails.behalf_employee_name}</span>
                                                    </>
                                                    :null
                                                }
                                            </>
                                            :null
                                        }
                                    </td>
                                    {
                                        RequestDetails.view_date
                                        ?
                                        <td>
                                            <b>Verified By</b><br />
                                            <span>{RequestDetails.submit_to_employee_name}</span><br />
                                            <span>
                                                {new Date(RequestDetails.view_date).toDateString()} <br />
                                                {RequestDetails.view_time}
                                            </span>
                                        </td>
                                        :
                                        <td></td>
                                    }
                                    <td>
                                        {
                                            RequestDetails.hod_employee_name != null
                                                ?
                                                RequestDetails.status === 'rejected'
                                                    ?
                                                    <>
                                                        {
                                                            RequestDetails.override === 1
                                                                ?
                                                                <><b className='text-danger'>Override By</b><br /></>
                                                                :
                                                                <><b>Rejected By</b><br /></>
                                                        }
                                                        <span>{RequestDetails.hod_employee_name}</span><br />
                                                        <span>{new Date(RequestDetails.act_date).toDateString()}<br />{RequestDetails.act_time}</span>
                                                    </>
                                                    :
                                                    <>
                                                        <b>{RequestDetails.status === 'canceled' || RequestDetails.status === 'canceled_by_inventory' ? "Canceled By" : RequestDetails.override === 1 ? "Override By" : "Proceed To"}</b><br />
                                                        <span>{RequestDetails.hod_employee_name}</span><br />
                                                        {
                                                            RequestDetails.status === 'approved'
                                                                ?
                                                                <>
                                                                    <span>{new Date(RequestDetails.act_date).toDateString()}<br />{RequestDetails.act_time}</span>
                                                                </>
                                                                :
                                                                <>
                                                                    <span className='text-danger'>Not Approved Yet</span>
                                                                </>
                                                        }
                                                    </>
                                                : null
                                        }
                                    </td>
                                    <td>
                                        <b>Request Status</b><br />
                                        <span className={RequestDetails.status + " text-white status_div"}>{RequestDetails.status.split('_').join(' ')}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan={3}>
                                        <b>Reason</b><br />
                                        <span className={Logs.filter(log => log.match_key === 'reason')[0] ? "log_found" : ""}>
                                            {RequestDetails.reason}
                                            {
                                                Logs.filter(log => log.match_key === 'reason')[0]?
                                                <div className='log_details'>
                                                    <p className='font-weight-bold mb-0'>Original</p>
                                                    <p className='mb-0'>{Logs.filter(log => log.match_key === 'reason')[0]['before_value']}</p>
                                                    <hr className='my-1' />
                                                    <p className='font-weight-bold mb-0'>After</p>
                                                    {
                                                        Logs.filter(log => log.match_key === 'reason').map(
                                                            ({after_value, created_at, name, remarks}, i) => {
                                                                return (
                                                                    <div key={i} title={remarks}>
                                                                        <p className='mb-0'>
                                                                            {after_value} 
                                                                            {after_value === RequestDetails.reason ? <span className='text-success pl-1'>&#40;Current&#41;</span> : ""}
                                                                        </p>
                                                                        <small className='text-right d-block'>{new Date(created_at).toDateString()} at {new Date(created_at).toLocaleTimeString()}</small>
                                                                        <small className='mb-0 text-right d-block text-danger'>{name}</small>
                                                                    </div>
                                                                )
                                                            }
                                                        )
                                                    }
                                                </div>
                                                :null
                                            }
                                        </span>
                                    </td>
                                    <td colSpan={3}>
                                        {
                                            RequestDetails.site_manager_remarks != null
                                            ?
                                            <>
                                                <b>Site Manager's Remarks</b><br />
                                                <span>{RequestDetails.site_manager_remarks}</span>
                                            </>
                                            : null
                                        }
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan={3}>
                                        {
                                            RequestDetails.remarks != null
                                            ?
                                            <>
                                                <b>{RequestDetails.status === 'canceled' || RequestDetails.status === 'canceled_by_inventory' ? "Reason To Cancel" : "Inventory's Remarks"}</b><br />
                                                <span>{RequestDetails.remarks}</span>
                                            </>
                                            : null
                                        }
                                    </td>
                                    <td colSpan={2}>
                                        {
                                            RequestDetails.hod_employee_name != null ? RequestDetails.status === 'rejected' ? null
                                                :
                                                <>
                                                    {
                                                        RequestDetails.status === 'approved'
                                                            ?
                                                            <>
                                                                <b>{RequestDetails.override === 1 ? "Override" : "H.O.D's"} Remarks</b><br />
                                                                <span>{RequestDetails.remarks_from_hod}</span>
                                                            </>
                                                            : null
                                                    }
                                                </>
                                                : null
                                        }
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan={6}>
                                        <b>Additional Notes</b><br />
                                        <span className={Logs.filter(log => log.match_key === 'note')[0] ? "log_found" : ""}>
                                            {RequestDetails.note}
                                            {
                                                Logs.filter(log => log.match_key === 'note')[0]?
                                                <div className='log_details'>
                                                    <p className='font-weight-bold mb-0'>Original</p>
                                                    <p className='mb-0'>{Logs.filter(log => log.match_key === 'note')[0]['before_value']}</p>
                                                    <hr className='my-1' />
                                                    <p className='font-weight-bold mb-0'>After</p>
                                                    {
                                                        Logs.filter(log => log.match_key === 'note').map(
                                                            ({after_value, created_at, name, remarks}, i) => {
                                                                return (
                                                                    <div key={i} title={remarks}>
                                                                        <p className='mb-0'>
                                                                            {after_value} 
                                                                            {after_value === RequestDetails.note ? <span className='text-success pl-1'>&#40;Current&#41;</span> : ""}
                                                                        </p>
                                                                        <small className='text-right d-block'>{new Date(created_at).toDateString()} at {new Date(created_at).toLocaleTimeString()}</small>
                                                                        <small className='mb-0 text-right d-block text-danger'>{name}</small>
                                                                    </div>
                                                                )
                                                            }
                                                        )
                                                    }
                                                </div>
                                                :null
                                            }
                                        </span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <div className="grid_container py-3 mb-3 px-5 border-top border-bottom">

                            {
                                RequestDetails.new_purchase === 1
                                    ?
                                    <div className='grid_container align-items-center'>
                                        <b>New Purchase</b>
                                        <input checked={true} type="checkbox" className='ml-2' />
                                    </div>
                                    : null
                            }
                            {
                                RequestDetails.repair
                                    ?
                                    <div className='grid_container align-items-center'>
                                        <b>Repair</b>
                                        <input checked={true} type="checkbox" className='ml-2' />
                                    </div>
                                    : null
                            }
                            {
                                RequestDetails.replace_recycle
                                    ?
                                    <div className='grid_container align-items-center'>
                                        <b>Replacement / Recycle</b>
                                        <input checked={true} type="checkbox" className='ml-2' />
                                    </div>
                                    : null
                            }
                            {
                                RequestDetails.budgeted
                                    ?
                                    <div className='grid_container align-items-center'>
                                        <b>Budgeted</b>
                                        <input checked={true} type="checkbox" className='ml-2' />
                                    </div>
                                    : null
                            }
                            {
                                RequestDetails.not_budgeted
                                    ?
                                    <div className='grid_container align-items-center'>
                                        <b>Not Budgeted</b>
                                        <input checked={true} type="checkbox" className='ml-2' />
                                    </div>
                                    : null
                            }
                            {
                                RequestDetails.invoice_attached
                                    ?
                                    <div className='grid_container align-items-center'>
                                        <b>Quotation Attached</b>
                                        <input checked={true} type="checkbox" className='ml-2' />
                                    </div>
                                    : null
                            }

                        </div>

                        <label className="mb-1"><b>Purchase / Repair / Replacement Specifications</b></label>

                        <table className="table table-borderless specifications-table mb-0">
                            <thead>
                                <tr>
                                    <th>Sr.No.</th>
                                    <th>Description</th>
                                    <th>Quantity</th>
                                    <th>Estimated Cost</th>
                                    <th className='text-right'>Total Cost</th>
                                </tr>
                            </thead>
                            <tbody id="specifications_table_body">
                                {
                                    Specifications.map(
                                        (val, index) => {
                                            return (
                                                <tr id={"specification_row_" + (index + 1)} key={index} pr_id={val.pr_id} spec_id={val.specification_id}>
                                                    <td className={Logs.filter(log => log.additional_match_key !== null && log.match_key == val.sr_no)[0] ? "row_log" : ""} id={"sr_no_" + (index + 1)}>
                                                        <div className='d-flex align-items-center'>
                                                            <span>{Logs.filter(log => log.additional_match_key !== null && log.match_key == val.sr_no)[0]?<div className='log_identity'></div>:""}</span>
                                                            <span>{index + 1}</span>
                                                        </div>
                                                        <div className='logs'>
                                                            <p className='font-weight-bold mb-0'>Changes</p>
                                                            <hr className='my-1' />
                                                            {
                                                                Logs.filter(log => log.additional_match_key !== null && log.match_key == val.sr_no).map(
                                                                    ({additional_match_key, remarks, before_value, after_value, created_at, name, status}, i) => {
                                                                        return (
                                                                            <div key={i} title={remarks}>
                                                                                {
                                                                                    status === 'edited'
                                                                                    ?
                                                                                    <p className='mb-0' style={{ fontSize: 11 }}>
                                                                                        <b className='font-italic text-capitalize mr-1'>{additional_match_key.split("_").join(' ').replace('specification', '').trim()}</b>
                                                                                        <span style={{ fontSize: 11 }}>has changed from <b>{before_value}</b> to <b>{after_value}</b></span>
                                                                                    </p>
                                                                                    :
                                                                                    status === 'added'
                                                                                    ?
                                                                                    <p className='mb-0' style={{ fontSize: 11 }}>
                                                                                        <b className='font-italic text-capitalize mr-1'>It's a new record.</b>
                                                                                    </p>
                                                                                    :
                                                                                    <p className='mb-0' style={{ fontSize: 11 }}>
                                                                                        <b className='font-italic text-capitalize mr-1'>{remarks}</b>
                                                                                    </p>
                                                                                }
                                                                                {
                                                                                    (i + 1) < Logs.filter(log => log.additional_match_key !== null && log.match_key == val.sr_no).length
                                                                                    ?
                                                                                    created_at.toString() === Logs.filter(log => log.additional_match_key !== null && log.match_key == val.sr_no)[i+1].created_at.toString()
                                                                                    ?null
                                                                                    :
                                                                                    <>
                                                                                        <small className='text-right d-block'>{new Date(created_at).toDateString()} at {new Date(created_at).toLocaleTimeString()}</small>
                                                                                        <small className='mb-0 text-right d-block text-danger'>{name}</small>
                                                                                        <hr className='my-1' />
                                                                                    </>
                                                                                    :
                                                                                    <>
                                                                                        <small className='text-right d-block'>{new Date(created_at).toDateString()} at {new Date(created_at).toLocaleTimeString()}</small>
                                                                                        <small className='mb-0 text-right d-block text-danger'>{name}</small>
                                                                                        <hr className='my-1' />
                                                                                    </>
                                                                                }
                                                                            </div>
                                                                        )
                                                                    }
                                                                )
                                                            }
                                                        </div>
                                                    </td>
                                                    <td id={"description_" + (index + 1)}> {val.description} </td>
                                                    <td id={"quantity_" + (index + 1)}> {val.quantity} </td>
                                                    <td id={"estimated_cost_" + (index + 1)}> Rs {val.estimated_cost.toLocaleString('en')} </td>
                                                    <td id={"total_estimated_cost_" + (index + 1)} className='text-right'> Rs {val.total_estimated_cost.toLocaleString('en')} </td>
                                                </tr>
                                            )
                                        }
                                    )
                                }
                            </tbody>
                            <br />
                            <tfoot>
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td className='total-td'><b>Total</b></td>
                                    <td className='text-right total-td'> Rs {RequestDetails.total_value.toLocaleString('en')} </td>
                                </tr>
                            </tfoot>
                        </table>
                        <div className='d-flex justify-content-between'>
                            {
                                Logs.filter(log => log.additional_match_key !== null && log.status == 'deleted')[0]
                                ?
                                <div className='border rounded p-2'>
                                    <h6 className='text-right mt-2'>Deleted Specifications Logs</h6>
                                    <div style={{ width: 500, maxHeight: '200px', overflow: "auto" }}>
                                        {
                                            Logs.filter(log => log.additional_match_key !== null && log.status == 'deleted').reverse().map(
                                                ({before_value, remarks, created_at, name}, i) => {
                                                    return (
                                                        <>
                                                            <p title={remarks} className='mb-0' style={{ fontFamily: "monospace" }} key={i}>
                                                                <b className='text-danger'>The row has been deleted with the following details:</b><br />{before_value}.<br />
                                                                <small className='text-right d-block text-danger'>{name}</small>
                                                                <small className='text-right d-block'>{new Date(created_at).toDateString()} at {new Date(created_at).toLocaleTimeString()}</small>
                                                            </p>
                                                        </>
                                                    )
                                                }
                                            )
                                        }
                                    </div>
                                </div>
                                :<div></div>
                            }
                            {
                                Logs.filter(log => log.match_key == 'total_value')[0]
                                ?
                                <div className='border rounded p-2'>
                                    <h6 className='text-right mt-2'>Total Cost Logs</h6>
                                    <div style={{ width: 500, maxHeight: '200px', overflow: "auto" }}>
                                        {
                                            Logs.filter(log => log.match_key == 'total_value').reverse().map(
                                                ({before_value, after_value, remarks, created_at}, i) => {
                                                    return (
                                                        <>
                                                            <p title={remarks} className='mb-0' style={{ fontFamily: "monospace" }} key={i}>
                                                                <span style={{ color: "#ea8c19" }}>The total cost has been changed from <b>Rs {before_value}/-</b> to <b>Rs {after_value}/-</b> due to changes in the specifications.<br /></span>
                                                                <small className='text-right d-block'>{new Date(created_at).toDateString()} at {new Date(created_at).toLocaleTimeString()}</small>
                                                            </p>
                                                        </>
                                                    )
                                                }
                                            )
                                        }
                                    </div>
                                </div>
                                :<div></div>
                            }
                        </div>
                    </>
                    :
                    <div className='purchase_requisition_details_2' id="accordion">
                        <div className='collapse_toogle d-flex justify-content-between' data-toggle="collapse" data-target="#attached_quotations" aria-expanded="false" aria-controls="attached_quotations">
                            <h6 className='mb-0'>Quotations Attached</h6>
                            <h6 className='mb-0'>({Quotations.length})</h6>
                        </div>
                        <div className="collapse show" id="attached_quotations" data-parent="#accordion">
                            {
                                Quotations.length === 0
                                    ?
                                    <h6 className="text-center">No Quotation Attached</h6>
                                    :
                                    <div className="grid_container">

                                        {
                                            Quotations.map(
                                                (val, index) => {

                                                    return (
                                                        <div className='quotation_card' style={{ display: 'flex', flexDirection: 'column' }}>
                                                            {
                                                                val.quotation.includes('.pdf')
                                                                    ?
                                                                    <iframe src={process.env.REACT_APP_SERVER + '/' + val.quotation} title="quotation_preview" key={index} width="100%" style={{ flexGrow: 1, minHeight: 500 }}></iframe>
                                                                    :
                                                                    <img src={process.env.REACT_APP_SERVER + '/' + val.quotation} alt="quotation_preview" key={index} />
                                                            }
                                                        </div>
                                                    )
                                                }
                                            )
                                        }

                                    </div>
                            }
                        </div>
                    </div>
                }

                {
                    StartPrint && RequestDetails
                        ?
                        <div id="pr_to_print" ref={componentRef} style={{ width: '100%', padding: 20, fontFamily: "Poppins" }}>

                            <div style={
                                {
                                    position: 'fixed',
                                    top: 0,
                                    left: 0,
                                    border: '1px dotted gray',
                                    width: '100%',
                                    height: '100%'
                                }
                            }></div>

                            <div className="content">
                                <h1 className='text-center font-weight-bold' style={{ letterSpacing: '10px', fontFamily: 'Cinzel' }}>SEABOARD GROUP</h1>
                                <hr />
                                <h3 className='text-center font-weight-bold' style={{ letterSpacing: 10 }}> PURCHASE REQUISITION </h3>

                                <br />
                                <br />

                                <div style={{ display: 'flex' }}>

                                    <div style={{ width: "50%" }}>
                                        <div style={{ display: 'flex' }}>
                                            <b style={{ width: '50%', padding: 5, fontSize: 15 }}>Company Name:</b>
                                            <span style={{ width: '50%', padding: 5, fontSize: 15 }}>{RequestDetails.company_name}</span>
                                        </div>
                                        <div style={{ display: 'flex' }}>
                                            <b style={{ width: '50%', padding: 5, fontSize: 15 }}>Delivery / Work Location:</b>
                                            <span style={{ width: '50%', padding: 5, fontSize: 15 }}>{RequestDetails.location_name}</span>
                                        </div>
                                    </div>
                                    <div style={{ width: "50%" }}>
                                        <div style={{ display: 'flex' }}>
                                            <b style={{ width: '50%', padding: 5, fontSize: 15 }}>PR Number:</b>
                                            <span style={{ width: '50%', padding: 5, fontSize: 15 }}>{RequestDetails.company_short_code + '-' + RequestDetails.series_year + '-' + RequestDetails.series_code}</span>
                                        </div>
                                        <div style={{ display: 'flex' }}>
                                            <b style={{ width: '50%', padding: 5, fontSize: 15 }}>Date:</b>
                                            <span style={{ width: '50%', padding: 5, fontSize: 15 }}>{new Date(RequestDetails.requested_date).toDateString()}</span>
                                        </div>
                                    </div>

                                </div>

                                <hr />

                                <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>

                                    <div style={{ width: "50%" }}>
                                        <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                                            <b style={{ width: '50%', padding: 5, fontSize: 15 }}>New Purchase</b>
                                            <span style={{ width: '50%', padding: 5 }}>
                                                <input checked={RequestDetails.new_purchase === 1 ? true : false} type="checkbox" style={{ fontSize: 17, width: 20, height: 20 }} />
                                            </span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                                            <b style={{ width: '50%', padding: 5, fontSize: 15 }}>Repair</b>
                                            <span style={{ width: '50%', padding: 5 }}>
                                                <input checked={RequestDetails.repair === 1 ? true : false} type="checkbox" style={{ fontSize: 17, width: 20, height: 20 }} />
                                            </span>
                                        </div>
                                    </div>
                                    <div style={{ width: "50%" }}>
                                        <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                                            <b style={{ width: '50%', padding: 5, fontSize: 15 }}>Replacement / Recycle</b>
                                            <span style={{ width: '50%', padding: 5 }}>
                                                <input checked={RequestDetails.replace_recycle === 1 ? true : false} type="checkbox" style={{ fontSize: 17, width: 20, height: 20 }} />
                                            </span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                                            <b style={{ width: '50%', padding: 5, fontSize: 15 }}>Budgeted</b>
                                            <span style={{ width: '50%', padding: 5 }}>
                                                <input checked={RequestDetails.budgeted === 1 ? true : false} type="checkbox" style={{ fontSize: 17, width: 20, height: 20 }} />
                                            </span>
                                        </div>
                                    </div>
                                    <div style={{ width: "100%", display: 'flex' }}>
                                        <div style={{ width: '50%', display: 'flex', alignItems: 'flex-end' }}>
                                            <b style={{ width: '50%', padding: 5, fontSize: 15 }}>Not Budgeted</b>
                                            <span style={{ width: '50%', padding: 5 }}>
                                                <input checked={RequestDetails.not_budgeted === 1 ? true : false} type="checkbox" style={{ fontSize: 17, width: 20, height: 20 }} />
                                            </span>
                                        </div>
                                        <div style={{ width: '50%', display: 'flex', alignItems: 'flex-end' }}>
                                            <b style={{ width: '50%', padding: 5, fontSize: 15 }}>Quotation Attached</b>
                                            <span style={{ width: '50%', padding: 5 }}>
                                                <input checked={RequestDetails.invoice_attached === 1 ? true : false} type="checkbox" style={{ fontSize: 17, width: 20, height: 20 }} />
                                            </span>
                                        </div>
                                    </div>

                                </div>

                                <hr />

                                <b style={{ fontSize: 15 }}>Reason For Repair / Replacement / New Purchase</b>
                                <br />
                                <span style={{ wordBreak: 'break-word', padding: 5, fontSize: 15, display: 'block', marginTop: 10, marginBottom: 10 }}>
                                    {RequestDetails.reason}
                                </span>

                                <b style={{ fontSize: 15 }}>Purchase / Repair / Replacement Specifications</b>
                                <br />
                                <table className="table table-bordered mt-2" style={{ zIndex: 1, backgroundColor: '#fff' }}>
                                    <thead>
                                        <tr style={{ borderColor: '#000' }}>
                                            <th style={{ outline: '1px solid lightgray', fontSize: 13, textAlign: 'center' }}>Sr.No</th>
                                            <th style={{ outline: '1px solid lightgray', fontSize: 13 }}>Description</th>
                                            <th style={{ outline: '1px solid lightgray', fontSize: 13, textAlign: 'center' }}>Quantity</th>
                                            <th style={{ outline: '1px solid lightgray', fontSize: 13, textAlign: 'center' }}>Estimated Cost</th>
                                            <th style={{ outline: '1px solid lightgray', fontSize: 13, textAlign: 'center' }}>Total Cost</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            Specifications.map(
                                                (val, index) => {
                                                    return (
                                                        <tr style={{ borderColor: '#000' }} key={index}>
                                                            <td style={{ outline: '1px solid lightgray', fontSize: 13, textAlign: 'center' }}>{index + 1}</td>
                                                            <td style={{ outline: '1px solid lightgray', fontSize: 13, maxWidth: 250, wordBreak: 'break-word' }}>{val.description}</td>
                                                            <td style={{ outline: '1px solid lightgray', fontSize: 13, textAlign: 'center' }}>{val.quantity}</td>
                                                            <td style={{ outline: '1px solid lightgray', fontSize: 13, textAlign: 'center' }}>Rs {val.estimated_cost.toLocaleString('en')}</td>
                                                            <td style={{ outline: '1px solid lightgray', fontSize: 13, textAlign: 'center' }}>Rs {val.total_estimated_cost.toLocaleString('en')}</td>
                                                        </tr>
                                                    )
                                                }
                                            )
                                        }
                                    </tbody>
                                    <tfoot>
                                        <tr style={{ borderColor: '#000' }}>
                                            <td style={{ outline: '1px solid lightgray', fontSize: 13, textAlign: 'center' }}></td>
                                            <td style={{ outline: '1px solid lightgray', fontSize: 13, textAlign: 'center' }}></td>
                                            <td style={{ outline: '1px solid lightgray', fontSize: 13, textAlign: 'center' }}></td>
                                            <th style={{ outline: '1px solid lightgray', textAlign: 'center', border: '0', fontSize: 13 }}><b>Total</b></th>
                                            <td style={{ outline: '1px solid lightgray', fontSize: 13, textAlign: 'center' }}>Rs {RequestDetails.total_value.toLocaleString('en')}</td>
                                        </tr>
                                    </tfoot>
                                </table>

                                <div className="footer" style={{ padding: 20, width: "100%", position: 'fixed', bottom: 0, zIndex: -1 }}>
                                    <p style={{ marginBottom: 0, fontSize: 13 }}>
                                        <b style={{ marginRight: 5 }}>Note: </b>
                                    </p>
                                    <p style={{ marginBottom: 0, fontSize: 13 }}>
                                        - This is an electronically generated report, hence does not require a signature.
                                    </p>
                                    {
                                        RequestDetails.behalf_employee_name
                                            ?
                                            <p style={{ marginBottom: 0, fontSize: 13 }}>- This request is generated by {RequestDetails.requested_employee_name} ({RequestDetails.requested_employee_designation_name}) on behalf of the requested employee.</p>
                                            : null
                                    }
                                    {
                                        RequestDetails.site_act_date
                                        ?
                                        <>
                                            <p style={{ marginBottom: 0, fontSize: 13 }}>
                                                <b style={{ marginRight: 5 }}>Site's Remarks: </b>
                                            </p>
                                            <p style={{ marginBottom: 0, fontSize: 13 }}>- {RequestDetails.site_manager_remarks}</p>
                                        </>
                                        : null
                                    }
                                    {
                                        RequestDetails.status === "approved" || RequestDetails.status === "rejected"
                                            ?
                                            <>
                                                <p style={{ marginBottom: 0, fontSize: 13 }}>
                                                    <b style={{ marginRight: 5 }}>H.O.D's Remarks: </b>
                                                </p>
                                                <p style={{ marginBottom: 0, fontSize: 13 }}>- {RequestDetails.remarks_from_hod}</p>
                                            </>
                                            : null
                                    }
                                    <div style={{ display: 'flex' }}>
                                        <div style={{ width: RequestDetails.site_act_date ? '25%' : '33.33%', padding: 10 }}>
                                            <b style={{ marginBottom: 10, display: 'block', textAlign: 'center', fontSize: 13 }}>Requested By</b>
                                            <p style={{ textAlign: 'center', fontSize: 20, fontFamily: "Tangerine", transform: "rotate(-10deg) translate(0, 5px)" }}>
                                                {
                                                    RequestDetails.behalf_employee_name
                                                        ?
                                                        RequestDetails.behalf_employee_name
                                                        :
                                                        RequestDetails.requested_employee_name
                                                }
                                            </p>
                                            <p style={{ marginTop: 10, marginBottom: 0, display: 'block', textAlign: 'center', fontSize: 13 }}>
                                                {
                                                    RequestDetails.behalf_employee_designation_name
                                                        ?
                                                        RequestDetails.behalf_employee_designation_name
                                                        :
                                                        RequestDetails.requested_employee_designation_name
                                                }
                                            </p>
                                            <p style={{ marginBottom: 0, display: 'block', textAlign: 'center', fontSize: 13 }}>
                                                {new Date(RequestDetails.requested_date).toDateString()}
                                            </p>
                                        </div>
                                        {
                                            RequestDetails.site_act_date
                                            ?
                                            <div style={{ width: RequestDetails.site_act_date ? '25%' : '33.33%', padding: 10 }}>
                                                <b style={{ marginBottom: 10, display: 'block', textAlign: 'center', fontSize: 13 }}>Submitted To</b>
                                                <p style={{ textAlign: 'center', fontSize: 20, fontFamily: "Tangerine", transform: "rotate(-10deg) translate(0, 5px)" }}>
                                                    {RequestDetails.site_manager_name}
                                                </p>
                                                <p style={{ marginBottom: 0, marginTop: 10, display: 'block', textAlign: 'center', fontSize: 13 }}>{RequestDetails.site_manager_designation_name}</p>
                                                <p style={{ marginBottom: 0, display: 'block', textAlign: 'center', fontSize: 13 }}>
                                                    {new Date(RequestDetails.site_act_date).toDateString()}
                                                </p>
                                            </div>
                                            :null
                                        }
                                        <div style={{ width: RequestDetails.site_act_date ? '25%' : '33.33%', padding: 10 }}>
                                            <b style={{ marginBottom: 10, display: 'block', textAlign: 'center', fontSize: 13 }}>Verified By</b>
                                            {
                                                RequestDetails.view_date
                                                    ?
                                                    <>
                                                        <p style={{ textAlign: 'center', fontSize: 20, fontFamily: "Tangerine", transform: "rotate(-10deg) translate(0, 5px)" }}>
                                                            {RequestDetails.submit_to_employee_name}
                                                        </p>
                                                        <p style={{ marginTop: 10, marginBottom: 0, display: 'block', textAlign: 'center', fontSize: 13 }}>{RequestDetails.submit_to_employee_designation_name}</p>
                                                        <p style={{ marginBottom: 0, display: 'block', textAlign: 'center', fontSize: 13 }}>
                                                            {new Date(RequestDetails.view_date).toDateString()}
                                                        </p>
                                                    </>
                                                    : null
                                            }
                                        </div>
                                        <div style={{ width: RequestDetails.site_act_date ? '25%' : '33.33%', padding: 10 }}>
                                            <b style={{ marginBottom: 10, display: 'block', textAlign: 'center', fontSize: 13 }}>{RequestDetails.status === 'rejected' ? "Rejected By" : RequestDetails.status === 'cancelled' || RequestDetails.status === 'canceled_by_inventory' ? "Cancelled By" : "Approved By"}</b>
                                            {
                                                RequestDetails.act_date
                                                    ?
                                                    <>
                                                        <p style={{ textAlign: 'center', fontSize: 20, fontFamily: "Tangerine", transform: "rotate(-10deg) translate(0, 5px)" }}>
                                                            {RequestDetails.hod_employee_name}
                                                        </p>
                                                        <p style={{ marginBottom: 0, marginTop: 10, display: 'block', textAlign: 'center', fontSize: 13 }}>{RequestDetails.hod_employee_designation_name}</p>
                                                        <p style={{ marginBottom: 0, display: 'block', textAlign: 'center', fontSize: 13 }}>
                                                            {new Date(RequestDetails.act_date).toDateString()}
                                                        </p>
                                                    </>
                                                    : null
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                        : null
                }

            </div>
        </>
    )

}

const InvApprovalConfirmation = ({ RequestDetails, Relations, pr_id, sendForApproveRequisition, submitted_to, requested_by }) => {
    const [Reason, setReason] = useState('');
    return (
        <>
            <form className='pt-1' onSubmit={(e) => sendForApproveRequisition(e, pr_id, requested_by, submitted_to)}>
                <fieldset>
                    <h6 className='font-weight-bold'>Proceed This Request for Approval</h6>
                    <hr />
                    <div className="alert alert-success d-none" id="error_alert_approval"></div>
                    <textarea placeholder='Add your remarks here...' name="reason" cols="30" rows="5" className='form-control' required value={Reason} onChange={(e) => setReason(e.target.value)} minLength={30} />
                    {
                        RequestDetails
                            ?
                            <>
                                <label className='font-weight-bold mb-0 mt-2'>Submit To</label>
                                <select name="submit_to" required className="form-control">
                                    <option value="">Select option</option>
                                    {
                                        Relations.map(
                                            (val, index) => {
                                                let option;
                                                if (val.category === 'all' || val.category.includes('purchase_requisition')) {
                                                    if (val.companies.includes(parseInt(RequestDetails.company_code))) {
                                                        if (val.pr_approval_limit && val.pr_approval_limit >= parseFloat(RequestDetails.total_value)) {
                                                            option = <option value={val.sr} key={index}> {val.name} </option>;
                                                        }
                                                    }
                                                }

                                                return option;
                                            }
                                        )
                                    }
                                </select>
                            </>
                            : null
                    }
                    <button className='btn d-block ml-auto submit mt-3' disabled={Reason.trim().length < 15}>Confirm</button>
                </fieldset>
            </form>
        </>
    )

}

const ApprovalConfirmation = ({ pr_id, ApproveRequisition, submitted_to, requested_by }) => {

    return (
        <>
            <form className='pt-1' onSubmit={(e) => ApproveRequisition(e, pr_id, requested_by, submitted_to)}>
                <fieldset>
                    <h6 className='font-weight-bold'>Confirm Approval</h6>
                    <hr />
                    <div className="alert alert-success d-none" id="error_alert_approval"></div>
                    <textarea placeholder='Add Your Remarks...' name="reason" cols="30" rows="5" className='form-control' required minLength={30} />
                    <button className='btn d-block ml-auto submit mt-3'>Confirm</button>
                </fieldset>
            </form>
        </>
    )

}

const CancelConfirmation = ({ pr_id, CancelRequisition }) => {

    return (
        <>
            <form className='pt-1' onSubmit={(e) => CancelRequisition(e, pr_id)}>
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

const RejectConfirmation = ({ RequestDetails, Specifications, pr_id, RejectRequisition }) => {

    return (
        <>
            <form className='pt-1' onSubmit={(e) => RejectRequisition(e, pr_id, RequestDetails.requested_by, Specifications)}>
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

const InvRejectConfirmation = ({ RequestDetails, Specifications, pr_id, InvRejectRequisition }) => {

    return (
        <>
            <form className='pt-1' onSubmit={(e) => InvRejectRequisition(e, pr_id, RequestDetails.requested_by, Specifications)}>
                <fieldset>
                    <h6 className='font-weight-bold'>Do you want to reject this request?</h6>
                    <hr />
                    <div className="alert alert-warning d-none" id="error_alert_rejection"></div>
                    <textarea placeholder='Enter a valid reason here...' name="reason" cols="30" rows="5" className='form-control' required minLength={30} />
                    <button className='btn d-block ml-auto cancle mt-3'>Confirm</button>
                </fieldset>
            </form>
        </>
    )

}

const SiteManagerApprovalModal = ({ RequestDetails, Specifications, pr_id, SiteManagerApprovalConfirm }) => {

    return (
        <>
            <form className='pt-1' onSubmit={(e) => SiteManagerApprovalConfirm(e, pr_id, RequestDetails.requested_by, Specifications)}>
                <fieldset>
                    <h6 className='font-weight-bold'>Do you want to proceed this request to the inventory department H/O?</h6>
                    <hr />
                    <div className="alert alert-success d-none" id="error_alert_approval"></div>
                    <textarea placeholder='Need your remarks...' name="reason" cols="30" rows="5" className='form-control' required minLength={30} />
                    <button className='btn d-block ml-auto submit mt-3'>Confirm</button>
                </fieldset>
            </form>
        </>
    )

}

const SiteManagerRejectionModal = ({ RequestDetails, Specifications, pr_id, SiteManagerRejectionConfirm }) => {

    return (
        <>
            <form className='pt-1' onSubmit={(e) => SiteManagerRejectionConfirm(e, pr_id, RequestDetails.requested_by, Specifications)}>
                <fieldset>
                    <h6 className='font-weight-bold'>Do you want to reject this request?</h6>
                    <hr />
                    <div className="alert alert-danger d-none" id="error_alert_rejection"></div>
                    <textarea placeholder='Enter a valid reason to reject...' name="reason" cols="30" rows="5" className='form-control' required minLength={30} />
                    <button className='btn d-block ml-auto cancle mt-3'>Confirm</button>
                </fieldset>
            </form>
        </>
    )

}

const PRequests = ({ FilterEmployees, setFilterEmployees, FilterLocation, setFilterLocation, CompanyLocations, Status, FilterCondition, RequestStatuses, AccessDefined, AccessControls, FilterAmount, FilterCompany, SpecKeyword, history, setStatus, setFilterAmount, LoadedCompanies, Requests, setSpecKeyword, setFilterCondition, setFilterCompany, loadRequests }) => {

    const [ShowReportModal, setShowReportModal] = useState(false);
    const [ReportProgress, setReportProgress] = useState(<></>);
    const [ShowFilters, setShowFilters] = useState(false);
    const [List, setList] = useState();
    const [ListToExport, setListToExport] = useState([]);
    const types = {
        total_value: 'total_value',
        series_code: 'series_code',
        requested_date: 'requested_date',
    };

    useEffect(
        () => {
            if (AccessDefined) {
                loadRequests()
            }
        }, [AccessDefined]
    );
    useEffect(
        () => {
            const Arr = Requests ? Requests.filter(
                val => {
                    return val.status.toLowerCase().includes(Status.toLowerCase()) && 
                    val.company_name.toLowerCase().includes(FilterCompany.toLowerCase()) && 
                    val.location_name.toLowerCase().includes(FilterLocation.toLowerCase()) && 
                    val.specifications.toLowerCase().includes(SpecKeyword.toLowerCase()) &&
                    val.requested_employee_name?.toLowerCase().includes(FilterEmployees.toLowerCase());
                }
            ) : [];
            const amountFilter = FilterAmount.toString().length === 0 ? Arr : Arr.filter(val => eval(val.total_value + FilterCondition + FilterAmount))
            setList(amountFilter);
        }, [Status, FilterEmployees, FilterLocation, Requests, FilterCompany, SpecKeyword, FilterAmount, FilterCondition]
    );

    const sortArray = (type, in_de, dataType) => {
        const sortProperty = types[type];
        let sorted = sort(sortProperty, in_de, dataType);
        setList(sorted);
    };

    const sort = (property, in_de, dataType) => {
        const result =
            dataType === "number"
                ? sortNumber(property, in_de)
                : dataType === "string"
                    ? sortString(property, in_de)
                    : dataType === 'date'
                        ? sortDate(property, in_de)
                        : [];

        return result;
    }

    const sortNumber = (property, in_de) => {
        let sorted;
        if (in_de > 0) {
            sorted = [...List].sort((a, b) => b[property] - a[property]);
        } else {
            sorted = [...List].sort((a, b) => a[property] - b[property]);
        }
        return sorted;
    }

    const sortString = (property, in_de) => {
        let sorted;
        if (in_de > 0) {
            sorted = [...List].sort((a, b) => b[property].localeCompare(a[property]));
        } else {
            sorted = [...List].sort((a, b) => a[property].localeCompare(b[property]));
        }
        return sorted;
    }

    const sortDate = (property, in_de) => {
        let sorted;
        if (in_de > 0) {
            sorted = [...List].sort((a, b) => new Date(b[property]) - new Date(a[property]));
        } else {
            sorted = [...List].sort((a, b) => new Date(a[property]) - new Date(b[property]));
        }
        return sorted;
    }

    const resetFilters = () => {
        sessionStorage.removeItem('PR_FilterCompany');
        sessionStorage.removeItem('PR_SpecKeyword');
        sessionStorage.removeItem('PR_FilterAmount');
        sessionStorage.removeItem('PR_FilterCondition');
        sessionStorage.removeItem('PR_FilterLocation');
        sessionStorage.removeItem('PR_FilterEmployee');
        setFilterCompany("");
        setSpecKeyword("");
        setFilterAmount('');
        setFilterCondition('>=');
        setFilterLocation('');
        setFilterEmployees('');
    }

    const checkAll = (e) => {
        const { checked } = e.target;
        let arr = [];
        if (checked) {
            for (let x = 0; x < List.length; x++) {
                $('#checkbox_' + List[x].pr_id).prop('checked', true);
                arr.push(List[x]);
            }
        } else {
            $('.checkboxes').prop('checked', false);
        }
        setListToExport(arr);
    }

    const checkBox = (e, val) => {
        $('#checkAll').prop('checked', false);
        let arr = ListToExport.slice();
        const index = arr.findIndex(val => val.pr_id === parseInt(e.target.id.split('_').pop()));
        if (index >= 0) {
            arr.splice(index, 1);
        } else {
            arr.push(val);
        }
        setListToExport(arr);
    }

    const exportReport = () => {
        setReportProgress(
            <>
                <h5 className='border text-center mb-0 py-4'>
                    <img src={loading} width={50} height={50} className='text-center' alt='loading....' /><br />
                    <b>
                        <i>
                            Creating Report....
                        </i>
                    </b>
                </h5>
            </>
        )
        setShowReportModal(true);
        axios.post('/purchase/requisition/report', { data: JSON.stringify(ListToExport) }).then(
            () => {
                setReportProgress(
                    <>
                        <h5 className='border text-center text-success mb-0 py-4' style={{ textDecoration: 'underline' }}>
                            <b>
                                <i>
                                    Report Created
                                </i>
                            </b>
                        </h5>
                    </>
                );
                setTimeout(() => {
                    setShowReportModal(false);
                }, 1000);
                axios.get(process.env.REACT_APP_SERVER + "/assets/portal/assets/excel/purchase/requisitions/purchase_requisitions_report.xlsx", {
                    method: 'GET',
                    responseType: 'blob', // important
                }).then((response) => {
                    const url = window.URL.createObjectURL(new Blob([response.data]));
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', `${Date.now()}.xlsx`);
                    document.body.appendChild(link);
                    link.click();
                });
            }
        ).catch(
            err => {
                console.log(err);
            }
        )
    }

    return (
        <>
            <Modal show={ShowReportModal} Hide={() => setShowReportModal(!ShowReportModal)} content={ReportProgress} />
            <div className="purchase_requests">
                <div className="d-flex align-items-end justify-content-between">
                    <h3 className="heading">
                        Purchase Requisition
                        <sub>Previous Requests</sub>
                    </h3>
                    <div>
                        {
                            AccessControls.access
                                ?
                                JSON.parse(AccessControls.access).includes(45) || JSON.parse(AccessControls.access).includes(0)
                                    ?
                                    <button className='btn submit' onClick={() => history.replace('/purchase/requisition/form')}>New</button>
                                    : null
                                : null
                        }
                        <button className="btn submit px-2 ml-2 filter-emit" onClick={() => setShowFilters(!ShowFilters)} type='button'>
                            {
                                ShowFilters
                                    ?
                                    <>
                                        <i className="las la-times"></i>
                                    </>
                                    :
                                    <div data-tip data-for='filter'>
                                        {
                                            SpecKeyword !== '' || FilterCompany !== '' || FilterLocation !== '' || FilterAmount !== ''
                                                ?
                                                <div className='filterisOpen'></div>
                                                :
                                                null
                                        }
                                        <i className="las la-filter"></i>
                                        <ReactTooltip id='filter' place="top">
                                            Filters
                                        </ReactTooltip>
                                    </div>
                            }
                        </button>
                        {
                            ListToExport.length > 0
                                ?
                                <button className='btn green ml-2' onClick={exportReport}>Export</button>
                                : null
                        }
                    </div>
                </div>
                <br />
                {
                    ShowFilters
                        ?
                        <>
                            <div className='filter-content popUps'>
                                <div className='flex'>
                                    <div className='w-100'>
                                        <label className="font-weight-bold mb-0">Search Specifications</label>
                                        <input value={SpecKeyword} placeholder='Search Keywords...' type="search" onChange={(e) => setSpecKeyword(e.target.value)} className='form-control mb-2' />
                                    </div>
                                    <div className='w-50'>
                                        <label className="font-weight-bold mb-0">Search Employees</label>
                                        <input value={FilterEmployees} placeholder='Search Names...' type="search" onChange={(e) => setFilterEmployees(e.target.value)} className='form-control mb-2' />
                                    </div>
                                    <div className='w-50'>
                                        {
                                            LoadedCompanies
                                                ?
                                                <>
                                                    <label className="font-weight-bold mb-0">Company</label>
                                                    <select value={FilterCompany} className='form-control mb-2' onChange={(e) => setFilterCompany(e.target.value)}>
                                                        <option value=''>Select Option</option>
                                                        {
                                                            LoadedCompanies.sort().map(
                                                                (company, index) => {

                                                                    return <option key={index} value={company}>{company}</option>;

                                                                }
                                                            )
                                                        }
                                                    </select>
                                                </>
                                                : null
                                        }
                                    </div>
                                    {
                                        FilterCompany !== '' && CompanyLocations.length > 0
                                        ?
                                        <div className='w-50'>
                                            <label className="font-weight-bold mb-0">Location</label>
                                            <select value={FilterLocation} className='form-control mb-2' onChange={(e) => setFilterLocation(e.target.value)}>
                                                <option value=''>All</option>
                                                {
                                                    CompanyLocations.sort().map(
                                                        (location, index) => {

                                                            return <option key={index} value={location.location_name}>{location.location_name}</option>;

                                                        }
                                                    )
                                                }
                                            </select>
                                        </div>
                                        :null
                                    }
                                    <div className='w-50'>
                                        <label className="font-weight-bold mb-0">Amount Condition</label>
                                        <select value={FilterCondition} className='form-control mb-2' onChange={(e) => setFilterCondition(e.target.value)}>
                                            <option value='>='>(&gt;=) Greater or Equal</option>
                                            <option value='<='>(&lt;=) Less or Equal</option>
                                            <option value='==='>(===) Equal</option>
                                            <option value='>'>(&gt;) Greater</option>
                                            <option value='<'>(&lt;) Less</option>
                                            <option value='!=='>(!==) Not Equal</option>
                                        </select>
                                    </div>
                                    <div className='w-50'>
                                        <label className="font-weight-bold mb-0">Amount</label>
                                        <input value={FilterAmount} type="number" onChange={(e) => setFilterAmount(e.target.value)} className='form-control mb-2' />
                                    </div>
                                    <button className='btn green d-block ml-auto mt-2' type='button' onClick={resetFilters}>Reset All</button>
                                </div>
                            </div>
                            <br />
                        </>
                        : null
                }

                <ul className="nav nav-tabs mb-3">
                    {/* <li className="nav-item" onClick={ () => { setStatus('overview'); sessionStorage.setItem('PRStatus', 'overview') } }>
                        <a className={ Status === 'overview' ? 'nav-link active text-capitalize' : 'nav-link text-capitalize' }>overview</a>
                    </li> */}
                    <li className="nav-item" onClick={() => { setStatus(''); sessionStorage.setItem('PRStatus', '') }}>
                        <a className={Status === '' ? 'nav-link active text-capitalize' : 'nav-link text-capitalize'}>all {Status === '' ? `(${List ? List.length : 0})` : ""}</a>
                    </li>
                    {
                        RequestStatuses.map(
                            (status, index) => {
                                return (
                                    <li className="nav-item" onClick={() => { setStatus(status); sessionStorage.setItem('PRStatus', status) }} key={index}>
                                        <a className={Status === status ? 'nav-link active text-capitalize' : 'nav-link text-capitalize'}>
                                            {status.split('_').join(' ')} {Status === status ? `(${List ? List.length : 0})` : ""}
                                        </a>
                                    </li>
                                )
                            }
                        )
                    }
                </ul>
                <div className='records-container' style={{ maxHeight: '70vh' }}>
                    {
                        List
                            ?
                            List.length === 0
                                ?
                                <h6 className="text-center">No Request Found</h6>
                                :
                                <table className="table popUps">
                                    <thead>
                                        <tr>
                                            <th className='border-top-0'>
                                                <div className='d-flex align-items-center'>
                                                    <input type="checkbox" id="checkAll" className='mr-2' onChange={checkAll} />
                                                    Check All
                                                </div>
                                            </th>
                                            <th className='border-top-0'>
                                                <div className='d-flex align-items-center'>
                                                    PR No
                                                    <div className='ml-2'>
                                                        <i onClick={() => sortArray('series_code', 1, 'number')} className="las la-chevron-up d-block" style={{ cursor: 'pointer' }}></i>
                                                        <i onClick={() => sortArray('series_code', 0, 'number')} className="las la-chevron-down d-block" style={{ cursor: 'pointer' }}></i>
                                                    </div>
                                                </div>
                                            </th>
                                            <th className='border-top-0'>Co & Loc</th>
                                            <th className='border-top-0'>Specifications</th>
                                            <th className='border-top-0'>
                                                <div className='d-flex align-items-center'>
                                                    Amount
                                                    <div className='ml-2'>
                                                        <i onClick={() => sortArray('total_value', 1, 'number')} className="las la-chevron-up d-block" style={{ cursor: 'pointer' }}></i>
                                                        <i onClick={() => sortArray('total_value', 0, 'number')} className="las la-chevron-down d-block" style={{ cursor: 'pointer' }}></i>
                                                    </div>
                                                </div>
                                            </th>
                                            <th className='border-top-0'>
                                                <div className='d-flex align-items-center'>
                                                    Date & Time
                                                    <div className='ml-2'>
                                                        <i onClick={() => sortArray('requested_date', 1, 'date')} className="las la-chevron-up d-block" style={{ cursor: 'pointer' }}></i>
                                                        <i onClick={() => sortArray('requested_date', 0, 'date')} className="las la-chevron-down d-block" style={{ cursor: 'pointer' }}></i>
                                                    </div>
                                                </div>
                                            </th>
                                            <th className='border-top-0'>Requested Person</th>
                                            <th className='border-top-0'>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            List.map(
                                                (val, index) => {
                                                    return (
                                                        <tr key={index} className='pointer pointer-hover'>
                                                            <td>
                                                                <input type='checkbox' id={"checkbox_" + val.pr_id} className='checkboxes' onChange={(e) => checkBox(e, val)} />
                                                            </td>
                                                            <td  onClick={() => history.push('/purchase/requisition/details?pr_id=' + val.pr_id)}>{val.code + '-' + val.series_year + '-' + val.series_code}</td>
                                                            <td  onClick={() => history.push('/purchase/requisition/details?pr_id=' + val.pr_id)}>{val.company_name} <br /> {val.location_name}</td>
                                                            <td  onClick={() => history.push('/purchase/requisition/details?pr_id=' + val.pr_id)}>{val.specifications}</td>
                                                            {/* <td  onClick={() => history.push('/purchase/requisition/details?pr_id=' + val.pr_id)}>{ val.no_items_requested > 1 ? (val.no_items_requested + " Items") : (val.no_items_requested + " Item") }</td> */}
                                                            <td  onClick={() => history.push('/purchase/requisition/details?pr_id=' + val.pr_id)}>Rs {val.total_value.toLocaleString('en')}</td>
                                                            <td  onClick={() => history.push('/purchase/requisition/details?pr_id=' + val.pr_id)}>
                                                                {new Date(val.requested_date).toDateString()} <br />
                                                                {val.requested_time}
                                                            </td>
                                                            <td  onClick={() => history.push('/purchase/requisition/details?pr_id=' + val.pr_id)}><b>{val.requested_employee_name}</b> <br /> {val.requested_employee_designation_name}</td>
                                                            <td  onClick={() => history.push('/purchase/requisition/details?pr_id=' + val.pr_id)}>
                                                                <div className='d-flex align-items-center'>
                                                                    <div
                                                                        className={
                                                                            "dot mr-1 "
                                                                            +
                                                                            (
                                                                                val.status === 'approved'
                                                                                    ?
                                                                                    "bg-success"
                                                                                    :
                                                                                    val.status === 'rejected'
                                                                                        ?
                                                                                        "bg-danger"
                                                                                        :
                                                                                        val.status === 'waiting_for_approval' || val.status === 'waiting_for_verification'
                                                                                            ?
                                                                                            "bg-warning"
                                                                                            :
                                                                                            "bg-dark"
                                                                            )
                                                                        }
                                                                    ></div>
                                                                    <div
                                                                        className={
                                                                            "text-capitalize "
                                                                            +
                                                                            (
                                                                                val.status === 'approved'
                                                                                    ?
                                                                                    "text-success"
                                                                                    :
                                                                                    val.status === 'rejected'
                                                                                        ?
                                                                                        "text-danger"
                                                                                        :
                                                                                        val.status === 'waiting_for_approval' || val.status === 'waiting_for_verification'
                                                                                            ?
                                                                                            "text-warning"
                                                                                            :
                                                                                            "text-dark"
                                                                            )
                                                                        }
                                                                        style={{ fontSize: 12 }}
                                                                    >
                                                                        {
                                                                            val.status === 'waiting_for_approval' && parseInt(val.appr_rejct_by) === parseInt(localStorage.getItem("EmpID"))
                                                                                ?
                                                                                "Pending"
                                                                                :
                                                                                val.status.split('_').join(' ')
                                                                        }
                                                                    </div>
                                                                </div>
                                                            </td>
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
            </div>
        </>
    )

}

const SubmitConfirmationModal = ({ AccessControls, Relations, Data, loadHods, HodList, Employee, PRSubmittion }) => {
    const [ Key, setKey ] = useState(false);

    useEffect(
        () => {
            if (!HodList) {
                loadHods();
            }
            if ( AccessControls.access )
            {
                for ( let x = 0; x < JSON.parse(AccessControls.access).length; x++ )
                {
                    if ( parseInt(JSON.parse(AccessControls.access)[x]) === 57 )
                    {
                        setKey(true);
                    }
                }
            }
        }, []
    )

    return (
        <>
            <form onSubmit={PRSubmittion}>
                <h5>Confirmation</h5>
                <hr />
                <fieldset>
                    <label className="mb-0"><b>Any Additional Notes</b></label>
                    <textarea className="form-control" name="notes" required />
                    {
                        Employee || Key
                            ?
                            <>
                                <label className="mb-0"><b>Submit To</b></label>
                                {
                                    HodList && Data
                                        ?
                                        <select name="submit_to" required className="form-control mb-2">
                                            <option value="">Select option</option>
                                            {
                                                Relations.map(
                                                    (val, index) => {
                                                        let option;
                                                        if (val.category === 'all' || val.category.includes('purchase_requisition')) {
                                                            if (val.companies.includes(parseInt(Data.company_code))) {
                                                                if (val.pr_approval_limit && val.pr_approval_limit >= parseFloat(Data.total_calculated_amount)) {
                                                                    option = <option value={val.sr} key={index}> {val.name} </option>;
                                                                }
                                                            }
                                                        }

                                                        return option;
                                                    }
                                                )
                                            }
                                        </select>
                                        :
                                        <p className='mb-0 text-center'>Please Wait...</p>
                                }
                            </>
                            : null
                    }
                    <button className='btn green d-block mx-auto mt-3'>Confirm & Submit</button>
                </fieldset>
            </form>
        </>
    )

}

const ModalContent = ({ Quotations, RemovedQuotations, setShowQuotationModal, setQuotations, setRemovedQuotations, onAttachQuotations }) => {

    const removeAttachedQuotation = (id) => {
        const Arr = Quotations.filter(
            (val, index) => {
                return index !== id;
            }
        );
        const RemovedArr = Quotations.filter(
            (val, index) => {
                return index === id;
            }
        );
        const rArr = RemovedQuotations;
        if (RemovedArr[0].quotation) {
            rArr.push(RemovedArr[0]);
        }

        setQuotations(Arr);
        setRemovedQuotations(rArr);
    }

    return (
        <>
            <div className='modal_content'>

                <div className="d-flex justify-content-between align-items-center">
                    <h4 className='mb-0'>Quotations</h4>
                    <input type="file" className='quotations_file' onChange={onAttachQuotations} multiple accept=".png, .jpg, .jpeg" />
                </div>
                <hr />

                {
                    Quotations.length === 0
                        ?
                        <h6 className="text-center">No Quotation Attached</h6>
                        :
                        <>
                            <div className="quotations_grid_container">

                                {
                                    Quotations.map(
                                        (val, index) => {
                                            const img = val.file ? URL.createObjectURL(val.file) : (process.env.REACT_APP_SERVER + '/' + val.quotation);
                                            const title = val.name ? val.name : val.quotation.split('/').pop();
                                            return (
                                                <div className='attached-quotation'>
                                                    <i title="Double Click To Remove" className="las la-trash-alt" onDoubleClick={() => removeAttachedQuotation(index)}></i>
                                                    {
                                                        title.includes('.pdf')
                                                            ?
                                                            <iframe src={img} title="attached_quotation" key={index} height={250}></iframe>
                                                            :
                                                            <img src={img} alt="attached_quotation" key={index} />
                                                    }
                                                    <span> {title} </span>
                                                </div>
                                            )
                                        }
                                    )
                                }

                            </div>
                        </>
                }

                <button className="btn submit d-block mx-auto mt-3" type='button' onClick={() => setShowQuotationModal(false)}>Close</button>

            </div>
        </>
    )

}