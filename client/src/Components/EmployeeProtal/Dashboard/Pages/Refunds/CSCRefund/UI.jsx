/* eslint-disable eqeqeq */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import './Style.css';
import $ from 'jquery';
import { Switch, Route } from 'react-router-dom';
import readXlsxFile from 'read-excel-file';
import { convertTZ } from './../../../../../../utils/date';
import BreadCrumb from './../../../Components/BreadCrumb';
import Modal from './../../../../../UI/Modal/Modal';

const monthNames = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const UI = ({ Relations, history, AccessControls, GetCompanies, setToPaid, setReportToPaid, loadDetails, setToCheck, submitReport, loadList }) => {
    return (
        <>
            <div className='csc_refund page'>
                {
                    window.location.hash.includes('/refund/csc/view/')
                    ?
                    <BreadCrumb links={[{label: 'All CSC Refunds', href: '/refund/csc/list'}]} currentLabel="CSC Refund Details" />
                    :
                    window.location.hash.includes('/refund/csc/new')
                    ?
                    <BreadCrumb links={[{label: 'All CSC Refunds', href: '/refund/csc/list'}]} currentLabel="CSC Refund Form" />
                    :null
                }
                <div className='csc_refund_content page-content'>
                    <Switch>
                        <Route exact path="/refund/csc/new" render={ 
                            () => (
                                <CSCRefund 
                                    history={ history }
                                    Relations={ Relations }
                                    AccessControls={ AccessControls }

                                    submitReport={ submitReport }
                                    GetCompanies={ GetCompanies }
                                />
                            )
                        } />
                        <Route exact path="/refund/csc/list" render={ 
                            () => (
                                <CSCList 
                                    history={ history }
                                    AccessControls={ AccessControls }

                                    loadList={ loadList }
                                />
                            )
                        } />
                        <Route exact path="/refund/csc/view/:id" render={ 
                            () => (
                                <CSCView 
                                    history={ history }

                                    setReportToPaid={ setReportToPaid }
                                    setToPaid={ setToPaid }
                                    loadDetails={ loadDetails }
                                    setToCheck={ setToCheck }
                                />
                            )
                        } />
                    </Switch>
                </div>
            </div>
        </>
    )
}

export default UI;

const CSCRefund = ({ Relations, AccessControls, history, GetCompanies, submitReport }) => {
    const [ StartProcessing, setStartProcessing ] = useState(false);
    const [ UploadedFile, setUploadedFile ] = useState();
    const [ ProcessedData, setProcessedData ] = useState();
    const [ MonthYear, setMonthYear ] = useState();
    const [ Company, setCompany ] = useState();
    const [ SubmitTo, setSubmitTo ] = useState();
    const [ Companies, setCompanies ] = useState([]);
    const [ GrandTotalData, setGrandTotalData ] = useState(
        {
            total_payable_csc_storage: 0,
            total_qfs_box_qict_storage_roll_over_charges: 0,
            total_gross_payable: 0,
            total_less_w_h_t: 0,
            total_net_csc: 0,
            total_qfs_bill_adjustment: 0,
            total_cheque_amount: 0
        }
    );
    // useEffect(
    //     () => {
    //         if ( ProcessedData )
    //         {
    //             localStorage.setItem('ProcessedData', JSON.stringify(ProcessedData));
    //             localStorage.setItem('GrandTotalData', JSON.stringify(GrandTotalData));
    //         }
    //     }, [ProcessedData, GrandTotalData]
    // );
    useEffect(
        () => {
            GetCompanies(setCompanies);
            if ( localStorage.getItem('ProcessedData') && localStorage.getItem('GrandTotalData') )
            {
                setProcessedData(JSON.parse(localStorage.getItem('ProcessedData')));
                setGrandTotalData(JSON.parse(localStorage.getItem('GrandTotalData')));
            }
        }, []
    );

    const triggerUploadFile = () => {
        $('#upload_file').trigger('click');
    }
    const uploadFile = (e) => {
        setStartProcessing(true);
        const reader = new FileReader();
        reader.onload = () => {
            if(reader.readyState === 2) {
                readXlsxFile(e.target.files[0]).then((rows) => {
                    setUploadedFile(
                        {
                            file: e.target.files[0],
                            name: e.target.files[0].name
                        }
                    );
                    processData(rows);
                }).finally(() => {
                    $("#upload_file").val(null);
                    setStartProcessing(false);
                })
            }
        }
        if ( e.target.files[0] ) {
            reader.readAsDataURL( e.target.files[0] );
        }
    }
    const processData = ( rows ) => {
        let arr = [];
        rows.shift();

        let total_payable_csc_storage = 0;
        let total_qfs_box_qict_storage_roll_over_charges = 0;
        let total_gross_payable = 0;
        let total_less_w_h_t = 0;
        let total_net_csc = 0;
        let total_qfs_bill_adjustment = 0;
        let total_cheque_amount = 0;

        for ( let x = 0; x < rows.length; x++ ) {
            const gross_payable = Math.round(parseFloat(rows[x][2]) - parseFloat(rows[x][3]));
            const less_wht = Math.round(gross_payable * parseFloat(rows[x][6]) / 100);
            const net_payment = Math.round(gross_payable - less_wht);
            
            const gross_payable_from_file = parseFloat(rows[x][4]);
            const less_wht_from_file = parseFloat(rows[x][7]);
            const net_csc_from_file = parseFloat(rows[x][8]);
            const cheque_amount_from_file = parseFloat(rows[x][10]);
            arr.push(
                {
                    forwarder_name: rows[x][1],
                    payable_csc_storage: rows[x][2],
                    qfs_box_qict_storage_roll_over_charges: rows[x][3],
                    payable_gross_csc: gross_payable,
                    tax_rate: rows[x][6],
                    less_w_h_t: Math.round(less_wht),
                    net_csc: net_payment,
                    qfs_bill_adjustment: Math.abs(rows[x][9]),
                    cheque_amount: Math.round(net_payment - Math.abs(parseFloat(rows[x][9]))),
                    
                    gross_payable_from_file: gross_payable_from_file,
                    less_wht_from_file: Math.round(Math.abs(less_wht_from_file)),
                    net_csc_from_file: net_csc_from_file,
                    cheque_amount_from_file: cheque_amount_from_file
                }
            );

            total_payable_csc_storage = total_payable_csc_storage + parseFloat(rows[x][2]);
            total_qfs_box_qict_storage_roll_over_charges = total_qfs_box_qict_storage_roll_over_charges + parseFloat(rows[x][3]);
            total_gross_payable = total_gross_payable + gross_payable;
            total_less_w_h_t = total_less_w_h_t + Math.round(less_wht);
            total_net_csc = total_net_csc + net_payment;
            total_qfs_bill_adjustment = total_qfs_bill_adjustment + Math.abs(rows[x][9]);
            total_cheque_amount = total_cheque_amount + Math.round(net_payment - Math.abs(parseFloat(rows[x][9])));
        }

        setProcessedData(arr);
        setGrandTotalData(
            {
                ...GrandTotalData,
                total_payable_csc_storage: total_payable_csc_storage,
                total_qfs_box_qict_storage_roll_over_charges: total_qfs_box_qict_storage_roll_over_charges,
                total_gross_payable: total_gross_payable,
                total_less_w_h_t: total_less_w_h_t,
                total_net_csc: total_net_csc,
                total_qfs_bill_adjustment: total_qfs_bill_adjustment,
                total_cheque_amount: total_cheque_amount,
            }
        )
    }

    return (
        <>
            <div className="csc_refund_form">
                <div className="d-flex align-items-end justify-content-between">
                    <h3 className="heading">
                        CSC Refund Form
                        <sub>Upload File Here</sub>
                    </h3>
                    <div>
                        <button className='btn light' onClick={ () => history.goBack() }>Back</button>
                    </div>
                </div>
                <hr />
                <input type='file' className='d-none' id="upload_file" onChange={ uploadFile } />
                <div className='upload_div' onClick={ triggerUploadFile }>
                    <div className='text-center'>
                        <i className="las la-cloud-upload-alt"></i>
                        {
                            StartProcessing
                            ?
                            <p className='text-center mb-0 text-info'>
                                <b>Processing...</b>
                            </p>
                            :
                            <p className='text-center mb-0'>
                                <b>Upload Your File Here</b>
                            </p>
                        }
                    </div>
                </div>
                <div className='grid my-2'>
                    <div>
                        <label className='mb-0 font-weight-bold'>MM/YYYY</label>
                        <input type='month' className='form-control' onChange={ (e) => setMonthYear(e.target.value) } />
                    </div>
                    <div>
                        <label className='mb-0 font-weight-bold'>Company</label>
                        <select className="form-control" onChange={ (e) => setCompany(e.target.value) } name="company_code" required>
                            <option value=''>Select the option</option>
                            {
                                Companies.map(
                                    val => {

                                        return (
                                            <option 
                                                key={ val.company_code } 
                                                value={ val.company_code }
                                            > { val.company_name } </option>
                                        )

                                    }
                                )
                            }
                        </select>
                    </div>
                    <div>
                        <label className='mb-0 font-weight-bold'>Submit To</label>
                        <select name="submit_to" className="form-control" onChange={ (e) => setSubmitTo(e.target.value) } required>
                            <option value=''>submit to</option>
                            {
                                Relations.map(
                                    (val, index) => {
                                        return <option value={val.sr} key={index}> {val.name} </option>;
                                    }
                                )
                            }
                        </select>
                    </div>
                </div>
                <div className='records-container' style={{ maxHeight: '70vh' }}>
                    {
                        ProcessedData
                        ?
                        <table className='table table-sm table-bordered mb-0'>
                            <thead>
                                <tr>
                                    <th>Sr.No</th>
                                    <th>Forwarder</th>
                                    <th className='text-right'>Payable CSC+Storage</th>
                                    <th className='text-right'>QFS Box, QICT Storage, Roll Over Charges</th>
                                    <th className='text-right'>Payable Gross CSC</th>
                                    <th className='text-center'>Tax Rate</th>
                                    <th className='text-right'>Less : W.H.Tax</th>
                                    <th className='text-right'>NET CSC</th>
                                    <th className='text-right'>QFS BILLS Adjustment</th>
                                    <th className='text-right'>Cheque Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    ProcessedData.map(
                                        ( 
                                            {
                                                forwarder_name, payable_csc_storage, qfs_box_qict_storage_roll_over_charges, payable_gross_csc, 
                                                tax_rate, less_w_h_t, net_csc, qfs_bill_adjustment, cheque_amount, gross_payable_from_file, less_wht_from_file, net_csc_from_file, cheque_amount_from_file
                                            }, 
                                            index 
                                        ) => {
                                            return (
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>{forwarder_name}</td>
                                                    <td className='text-right'>Rs {payable_csc_storage.toLocaleString('en')}/-</td>
                                                    <td className='text-right'>Rs {qfs_box_qict_storage_roll_over_charges.toLocaleString('en')}/-</td>
                                                    <td className={ 'text-right ' + ( parseFloat(payable_gross_csc) === parseFloat(gross_payable_from_file) ? 'matched' : 'not-matched' ) }>Rs {payable_gross_csc.toLocaleString('en')}/-</td>
                                                    <td className='text-center'>{tax_rate}</td>
                                                    <td className={ 'text-right ' + ( parseFloat(less_w_h_t) === parseFloat(less_wht_from_file) ? 'matched' : 'not-matched' ) }>Rs {less_w_h_t.toLocaleString('en')}/-</td>
                                                    <td className={ 'text-right ' + ( parseFloat(net_csc) === parseFloat(net_csc_from_file) ? 'matched' : 'not-matched' ) }>Rs {net_csc.toLocaleString('en')}/-</td>
                                                    <td className={ 'text-right ' + ( parseFloat(qfs_bill_adjustment) > 0 ? 'text-danger' : 'text-secondary' ) }>Rs {qfs_bill_adjustment.toLocaleString('en')}/-</td>
                                                    <td className={ 'text-right ' + ( parseFloat(cheque_amount) === parseFloat(cheque_amount_from_file) ? 'matched' : 'not-matched' ) }>Rs {cheque_amount.toLocaleString('en')}/-</td>
                                                </tr>
                                            )
                                        }
                                    )
                                }
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td></td>
                                    <td className='font-weight-bold'>Grand Total</td>
                                    <td className='text-right'>Rs {GrandTotalData.total_payable_csc_storage.toLocaleString('en')}/-</td>
                                    <td className='text-right'>Rs {GrandTotalData.total_qfs_box_qict_storage_roll_over_charges.toLocaleString('en')}/-</td>
                                    <td className='text-right'>Rs {GrandTotalData.total_gross_payable.toLocaleString('en')}/-</td>
                                    <td className='text-center'></td>
                                    <td className='text-right'>Rs {GrandTotalData.total_less_w_h_t.toLocaleString('en')}/-</td>
                                    <td className='text-right'>Rs {GrandTotalData.total_net_csc.toLocaleString('en')}/-</td>
                                    <td className='text-right'>Rs {GrandTotalData.total_qfs_bill_adjustment.toLocaleString('en')}/-</td>
                                    <td className='text-right'>Rs {GrandTotalData.total_cheque_amount.toLocaleString('en')}/-</td>
                                </tr>
                            </tfoot>
                        </table>
                        :null
                    }
                </div>
                <button className='btn submit d-block ml-auto mt-3' onClick={ () => submitReport( ProcessedData, GrandTotalData, MonthYear, Company, SubmitTo, UploadedFile, history ) } id="submitBtn">Submit</button>
            </div>
        </>
    )
}

const CSCList = ({ AccessControls, history, loadList }) => {
    const [ ShowFilters, setShowFilters ] = useState(false);
    const [ List, setList ] = useState();
    useEffect(
        () => {
            loadList(AccessControls, setList);
        }, []
    );

    return (
        <>
            <div className="csc_refund_list">
                <div className="d-flex align-items-end justify-content-between">
                    <h3 className="heading">
                        Monthly CSC Refund List
                        <sub>View List By Month</sub>
                    </h3>
                    <div>
                        {/* <button className="btn submit px-2 filter-emit" onClick={ () => setShowFilters(!ShowFilters) } type='button'>
                            { ShowFilters ? <><i className="las la-times"></i> Close</> : <><i className="las la-filter"></i> Filters</> }
                        </button> */}
                        <button className='btn submit ml-2' onClick={ () => history.push('/refund/csc/new') }>New</button>
                    </div>
                </div>
                <hr />
                {
                    ShowFilters
                    ?
                    <>
                        <div className='filter-content popUps'>
                            <div className='flex'>
                                <div className='w-100'>
                                    <label className="font-weight-bold mb-0">Search Specifications</label>
                                    <input value={"SpecKeyword"} placeholder='Search Keywords...' type="search" onChange={ (e) => alert(e.target.value) } className='form-control form-control-sm mb-2' />
                                </div>
                            </div>
                            <button className='btn light d-block ml-auto mt-2' type='button' onClick={ alert }>Reset All</button>
                        </div>
                        <br />
                    </>
                    :null
                }
                {/* <ul className="nav nav-tabs mb-3">
                    <li className="nav-item" onClick={ () => { setStatus(''); sessionStorage.setItem('POStatus', '') } }>
                        <a className={ Status === '' ? 'nav-link active text-capitalize' : 'nav-link text-capitalize' }>all { Status === '' ? `(${List?List.length:0})` : "" }</a>
                    </li>
                    {
                        RequestStatuses.map(
                            ( status, index ) => {
                                return (
                                    <li className="nav-item" onClick={ () => { setStatus( status ); sessionStorage.setItem('POStatus', status) } } key={ index }>
                                        <a className={ Status === status ? 'nav-link active text-capitalize' : 'nav-link text-capitalize' }>
                                            { status.split('_').join(' ') } { Status === status ? `(${List?List.length:0})` : "" }
                                        </a>
                                    </li>
                                )
                            }
                        )
                    }
                </ul> */}
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
                                    <th className='border-top-0'>Sr.No</th>
                                    <th className='border-top-0'>Prepared By</th>
                                    <th className='border-top-0'>Month & Year</th>
                                    <th className='border-top-0'>Company</th>
                                    <th className='border-top-0'>Total Cheque Amount</th>
                                    <th className='border-top-0'>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    List.map(
                                        ( {report_id, checked_by, code, status, total_cheque_amount, requested_person, month, year}, index ) => {
                                            return (
                                                <tr key={ index } className='pointer pointer-hover' onClick={ () => history.push('/refund/csc/view/' + report_id) }>
                                                    <td>{ index + 1 }</td>
                                                    <td>{ requested_person }</td>
                                                    <td>{ monthNames[month] }-{ year }</td>
                                                    <td>{ code }</td>
                                                    <td>{ total_cheque_amount }</td>
                                                    <td>
                                                        <div className='d-flex align-items-center'>
                                                            <div 
                                                                className={
                                                                    "dot mr-1 "
                                                                    +
                                                                    (
                                                                        status === 'checked'
                                                                        ?
                                                                        "bg-success"
                                                                        :
                                                                        status === 'sent' && parseInt(checked_by) === parseInt(localStorage.getItem("EmpID"))
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
                                                                        status === 'checked'
                                                                        ?
                                                                        "text-success"
                                                                        :
                                                                        status === 'sent' && parseInt(checked_by) === parseInt(localStorage.getItem("EmpID"))
                                                                        ?
                                                                        "text-warning"
                                                                        :
                                                                        "text-dark"
                                                                    )
                                                                }
                                                                style={{ fontSize: 12 }}
                                                            >
                                                                {
                                                                    status === 'sent' && parseInt(checked_by) === parseInt(localStorage.getItem("EmpID"))
                                                                    ?
                                                                    "pending"
                                                                    :
                                                                    status.split('_').join(' ')
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

const CSCView = ({ history, loadDetails, setToCheck, setReportToPaid, setToPaid }) => {
    const [ Details, setDetails ] = useState(
        {
            data: undefined,
            items: []
        }
    );
    const [ AllPaid, setAllPaid ] = useState(false);
    const [ MarkCheckConfirm, setMarkCheckConfirm ] = useState(false);
    const [ MarkCheckContent, setMarkCheckContent ] = useState(<></>);
    const [ PaidRefunds, setPaidRefunds ] = useState([]);
    useEffect(
        () => {
            loadDetails(setDetails);
        }, []
    );
    useEffect(
        () => {
            let arr = [];
            for ( let x = 0; x < Details.items.length; x++ )
            {
                if ( Details.items[x].status === 'unpaid' ) arr.push(1);
            }
            if ( arr.length === 0 ) {
                setAllPaid(true);
            }else {
                setAllPaid(false);
            }
        }, [Details.items]
    );
    useEffect(
        () => {
            if ( AllPaid && Details.data?.all_forwarders_paid === 0 ) setReportToPaid( setDetails );
        }, [AllPaid, Details.data]
    );

    const confirmation = () => {
        setMarkCheckContent(
            <>
                <h6>Do you want to mark this report as <b>checked</b>?</h6>
                <button className='btn submit d-block ml-auto' id="submitBtn" onClick={() => setToCheck(history)}>Confirm</button>
            </>
        )
        setMarkCheckConfirm(true);
    }
    const confirmPayment = () => {
        setMarkCheckContent(
            <>
                <h6>Do you want to mark the following forwarders as paid?</h6>
                <ul>
                    {
                        PaidRefunds.map(
                            ( val, index ) => {
                                return <li key={index}>{val.forwarder_name}</li>
                            }
                        )
                    }
                </ul>
                <button className='btn submit d-block ml-auto' id="submitBtn" onClick={() => setToPaid(Details.data, PaidRefunds, setDetails, setMarkCheckConfirm, setPaidRefunds)}>Confirm</button>
            </>
        )
        setMarkCheckConfirm(true);
    }
    const checkAll = (e) => {
        const { checked } = e.target;
        let arr = [];
        if ( checked ) {
            for ( let x = 0; x < Details.items.length; x++ )
            {
                if ( Details.items[x].status === 'unpaid' )
                {
                    $('#checkbox_' + Details.items[x].id).prop('checked', true);
                    arr.push(
                        {
                            id: Details.items[x].id,
                            forwarder_name: Details.items[x].forwarder_name,
                            cheque_amount: Details.items[x].cheque_amount
                        }
                    );
                }
            }
        }else {
            $('.checkboxes').prop('checked', false);
        }
        setPaidRefunds(arr);
    }
    const checkBox = (e, forwarder_name, cheque_amount) => {
        $('#checkAll').prop('checked', false);
        let arr = PaidRefunds.slice();
        const index = arr.findIndex(val => val.id === parseInt(e.target.id.split('_').pop()));
        if ( index >= 0 ) {
            arr.splice(index, 1);
        }else
        {
            arr.push(
                {
                    id: parseInt(e.target.id.split('_').pop()),
                    forwarder_name: forwarder_name,
                    cheque_amount: cheque_amount
                }
            )
        }
        setPaidRefunds(arr);
    }
    return (
        <>
            <Modal show={ MarkCheckConfirm } Hide={ () => setMarkCheckConfirm( !MarkCheckConfirm ) } content={ MarkCheckContent } />
            <div className="csc_refund_view">
                <div className="d-flex align-items-end justify-content-between">
                    <h3 className="heading">
                        {monthNames[Details.data?.month]} CSC Refund Report
                        <sub>Summary of Refundable CSC</sub>
                    </h3>
                    <div>
                        <button className='btn light' onClick={ () => history.goBack() }>Back</button>
                    </div>
                </div>
                <hr />
                {
                    Details.data
                    ?
                    <>
                        <table className='table'>
                            <tbody>
                                <tr>
                                    <td className='border-top-0'>
                                        <b>Prepared By</b><br />
                                        <span>{Details.data.requested_person}</span>
                                    </td>
                                    <td className='border-top-0'>
                                        { Details.data.checked_date === null ? <b>Submitted To</b> : <b>Checked By</b> }<br />
                                        <span>{Details.data.checked_person}</span>
                                    </td>
                                    <td className='border-top-0'>
                                        <b>Month</b><br />
                                        <span>{monthNames[Details.data.month]}</span>
                                    </td>
                                    <td className='border-top-0'>
                                        <b>Year</b><br />
                                        <span>{Details.data.year}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <b>Prepared At</b><br />
                                        <span>{convertTZ(Details.data.prepared_date).toDateString()} at {Details.data.prepared_time}</span>
                                    </td>
                                    <td>
                                        <b>Checked At</b><br />
                                        {
                                            Details.data.checked_date === null
                                            ?
                                            <span className='text-danger'>Not Checked</span>
                                            :
                                            <span>{convertTZ(Details.data.checked_date).toDateString()} at {Details.data.checked_time}</span>
                                        }
                                    </td>
                                    <td>
                                        <b>Company</b><br />
                                        <span>{Details.data.code}</span>
                                    </td>
                                    <td>
                                        <b>Request Status</b>
                                        <div className='d-flex align-items-center'>
                                            <div 
                                                className={
                                                    "dot mr-1 "
                                                    +
                                                    (
                                                        Details.data.status === 'checked'
                                                        ?
                                                        "bg-success"
                                                        :
                                                        Details.data.status === 'sent' && parseInt(Details.data.checked_by) === parseInt(localStorage.getItem("EmpID"))
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
                                                        Details.data.status === 'checked'
                                                        ?
                                                        "text-success"
                                                        :
                                                        Details.data.status === 'sent' && parseInt(Details.data.checked_by) === parseInt(localStorage.getItem("EmpID"))
                                                        ?
                                                        "text-warning"
                                                        :
                                                        "text-dark"
                                                    )
                                                }
                                                style={{ fontSize: 12 }}
                                            >
                                                {
                                                    Details.data.status === 'sent' && parseInt(Details.data.checked_by) === parseInt(localStorage.getItem("EmpID"))
                                                    ?
                                                    "pending"
                                                    :
                                                    Details.data.status.split('_').join(' ')
                                                }
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <div className='records-container' style={{ maxHeight: '65vh' }}>
                            <table className='table table-sm table-bordered mb-0'>
                                <thead>
                                    <tr>
                                        <th>
                                            {
                                                AllPaid?null
                                                :
                                                <div className='d-flex align-items-center'>
                                                    <input type="checkbox" disabled={ Details.data.status !== 'checked' } id="checkAll" className='mr-2' onChange={ checkAll } />
                                                    Check All
                                                </div>
                                            }
                                        </th>
                                        <th>Sr.No</th>
                                        <th>Forwarder</th>
                                        <th className='text-right'>Payable CSC+Storage</th>
                                        <th className='text-right'>QFS Box, QICT Storage, Roll Over Charges</th>
                                        <th className='text-right'>Payable Gross CSC</th>
                                        <th className='text-center'>Tax Rate</th>
                                        <th className='text-right'>Less : W.H.Tax</th>
                                        <th className='text-right'>NET CSC</th>
                                        <th className='text-right'>QFS BILLS Adjustment</th>
                                        <th className='text-right'>Cheque Amount</th>
                                        <th className='text-center'>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        Details.items.map(
                                            ( 
                                                {
                                                    forwarder_name, payable_csc_storage, qfs_box_qict_storage_roll_over_charges, payable_gross_csc, 
                                                    id, status, tax_rate, less_w_h_t, net_csc, qfs_bill_adjustment, cheque_amount, 
                                                    gross_payable_from_file, less_wht_from_file, net_csc_from_file, cheque_amount_from_file
                                                }, 
                                                index 
                                            ) => {
                                                return (
                                                    <tr key={index}>
                                                        <td>
                                                            {status === 'paid'?null:<input disabled={ Details.data.status !== 'checked' } type="checkbox" id={ "checkbox_" + id } onChange={ (e) => checkBox(e, forwarder_name, cheque_amount) } className='checkboxes' />}
                                                        </td>
                                                        <td>{index + 1}</td>
                                                        <td>{forwarder_name}</td>
                                                        <td className='text-right'>Rs {payable_csc_storage.toLocaleString('en')}/-</td>
                                                        <td className='text-right'>Rs {qfs_box_qict_storage_roll_over_charges.toLocaleString('en')}/-</td>
                                                        <td className={ 'text-right ' + ( parseFloat(payable_gross_csc) === parseFloat(gross_payable_from_file) ? 'matched' : 'not-matched' ) }>Rs {payable_gross_csc.toLocaleString('en')}/-</td>
                                                        <td className='text-center'>{tax_rate}</td>
                                                        <td className={ 'text-right ' + ( parseFloat(less_w_h_t) === parseFloat(less_wht_from_file) ? 'matched' : 'not-matched' ) }>Rs {less_w_h_t.toLocaleString('en')}/-</td>
                                                        <td className={ 'text-right ' + ( parseFloat(net_csc) === parseFloat(net_csc_from_file) ? 'matched' : 'not-matched' ) }>Rs {net_csc.toLocaleString('en')}/-</td>
                                                        <td className={ 'text-right ' + ( parseFloat(qfs_bill_adjustment) > 0 ? 'text-danger' : 'text-secondary' ) }>Rs {qfs_bill_adjustment.toLocaleString('en')}/-</td>
                                                        <td className={ 'text-right ' + ( parseFloat(cheque_amount) === parseFloat(cheque_amount_from_file) ? 'matched' : 'not-matched' ) }>Rs {cheque_amount.toLocaleString('en')}/-</td>
                                                        <td className={ 'text-center ' + ( status === 'paid' ? 'matched' : 'not-matched' ) }>{status}</td>
                                                    </tr>
                                                )
                                            }
                                        )
                                    }
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td></td>
                                        <td></td>
                                        <td className='font-weight-bold'>Grand Total</td>
                                        <td className='text-right'>Rs {Details.data.total_payable_csc_storage.toLocaleString('en')}/-</td>
                                        <td className='text-right'>Rs {Details.data.total_qfs_box_qict_storage_roll_over_charges.toLocaleString('en')}/-</td>
                                        <td className='text-right'>Rs {Details.data.total_gross_payable.toLocaleString('en')}/-</td>
                                        <td className='text-center'></td>
                                        <td className='text-right'>Rs {Details.data.total_less_w_h_t.toLocaleString('en')}/-</td>
                                        <td className='text-right'>Rs {Details.data.total_net_csc.toLocaleString('en')}/-</td>
                                        <td className='text-right'>Rs {Details.data.total_qfs_bill_adjustment.toLocaleString('en')}/-</td>
                                        <td className='text-right'>Rs {Details.data.total_cheque_amount.toLocaleString('en')}/-</td>
                                        <td></td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                        {
                            Details.data.checked_by == localStorage.getItem("EmpID") &&
                            Details.data.status === 'sent'
                            ?
                            <button className='btn submit d-block ml-auto mt-3' onClick={ confirmation }>Mark As Checked</button>
                            :null
                        }
                        {
                            PaidRefunds.length > 0
                            ?
                            <button className='btn submit d-block ml-auto mt-3' onClick={ confirmPayment }>Mark As Paid</button>
                            :null
                        }
                    </>
                    :
                    <p className='text-center font-weight-bold mb-0'>
                        <i>Please Wait...</i>
                    </p>
                }
            </div>
        </>
    )
}