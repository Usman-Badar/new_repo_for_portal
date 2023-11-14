/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable eqeqeq */
import React, { useState, useEffect } from 'react';
import './Style.css';

import BreadCrumb from '../../../Components/BreadCrumb';
import Modal from '../../../../../UI/Modal/Modal';
import { convertCurrency } from '../../../../../../utils/currency';
import moment from 'moment';
import { convertTZ } from './../../../../../../utils/date';
import ShippingLine from './ShippingLine';

function UI({ AccessControls, onCreateShpCash, Slip, SlipCode, attachSlip, SlipAttachment, SlipList, PRAttachment, PR, PRCode, SPRSpecifications, setPRAttachment, history, Company, Amount, DO, LOLO, Selected, Locations, Employees, PRList, Keyword, Companies, setKeyword, attachPR, setAmount, setDO, setCompany, onCreateAdvanceCash, setEmployee, setSlipAttachment, Status, setStatus, setLOLO, DET, DMGDT, CSC , Other, setDET, setDMGDT, setCSC, setOther }) {

    // const Relations = useSelector((state) => state.EmpAuth.Relations);
    // const Arr = Employees ? Employees.filter(val => {return val.name.toLowerCase().includes(Keyword.toLowerCase()) && val.emp_id != localStorage.getItem('EmpID')}):null;

    useEffect(
        () => {
            if (sessionStorage.getItem('AdvanceCashStatus')) {
                setStatus(sessionStorage.getItem('AdvanceCashStatus'));
            }
        }, []
    );



    return (
        <>
            <BreadCrumb links={[{ label: 'Cash Requests', href: '/cash/requests' }]} currentLabel="Advance Cash Form" />
            {
                JSON.parse(AccessControls.access).includes(66) || JSON.parse(AccessControls.access).includes(0)
                ?
                <ul className="nav nav-tabs mb-3">
                    <li className="nav-item" onClick={() => { setStatus('AdvanceCashForm'); sessionStorage.setItem('AdvanceCashStatus', 'AdvanceCashForm') }} >
                        <a className={Status === 'AdvanceCashForm' ? 'nav-link active text-capitalize' : 'nav-link text-capitalize'}>Advance Cash</a>
                    </li>
                    <li className="nav-item" onClick={() => { setStatus('AdvanceShippingLineForm'); sessionStorage.setItem('AdvanceCashStatus', 'AdvanceShippingLineForm') }} >
                        <a className={Status === 'AdvanceShippingLineForm' ? 'nav-link active text-capitalize' : 'nav-link text-capitalize'}>Advance Shipping Line Cash</a>
                    </li>
                </ul>
                :null
            }
            {
                Status === 'AdvanceShippingLineForm'
                ?
                <ShippingLine 
                    Companies={Companies}
                    Locations={Locations}
                    DO={DO}
                    LOLO={LOLO}
                    DET={DET}
                    DMGDT={DMGDT}
                    CSC={CSC}
                    Other={Other}
                    
                    setDET={setDET}
                    setDMGDT={setDMGDT}
                    setCSC={setCSC}
                    setOther={setOther}
                    setDO={setDO}
                    setLOLO={setLOLO}
                    onCreateShpCash={onCreateShpCash}
                />
                :
                <>
                    <form onSubmit={onCreateAdvanceCash} className="advance_cash page">
                        <Modal show={PRAttachment} Hide={() => setPRAttachment(!PRAttachment)} content={<PRAttachmentModal PR={PR} attachPR={attachPR} PRList={PRList} />} />
                        <Modal show={SlipAttachment} Hide={() => setSlipAttachment(!SlipAttachment)} content={<SlipAttachmentModal Slip={Slip} attachSlip={attachSlip} SlipList={SlipList} />} />
                        <fieldset className="advance_cash_container page-content">
                            <div className="d-flex align-items-center justify-content-between">
                                <h3 className="heading">
                                    Advance Cash Form
                                    <sub>Get Cash Instantly</sub>
                                </h3>
                            </div>
                            <hr />
                            <div className='grid-container-5050'>
                                {/* <div>
                        <label className='mb-0'>
                            <b>Employee On Behalf Of</b>
                        </label>
                        <div className="employees_list_container">
                            <input type="text" className="form-control" value={ Keyword } onChange={ ( e ) => setKeyword( e.target.value ) } required />
                            {
                                Arr && !Selected?
                                <div className="employees_list">
                                    {
                                        Arr.map(
                                            ( val, index ) => {
                                                return (
                                                    <div className="employee" key={index} onClick={ () => setEmployee({ emp_id: val.emp_id, name: val.name }) }>
                                                        <img src={ 'images/employees/' + val.emp_image } className="rounded-circle" alt="emp" width={35} height={35} />
                                                        <div className="ml-2">
                                                            <b>{ val.name }</b>
                                                            <p className="mb-0">{ val.designation_name }</p>
                                                        </div>
                                                    </div>
                                                )
                                            }
                                        )
                                    }
                                </div>
                                :null
                            }
                        </div>
                    </div> */}
                                <div>
                                    <label className='mb-0'>
                                        <b>Company</b>
                                    </label>
                                    <select className="form-control" name="company_code" onChange={(e) => setCompany(e.target.value)} required>
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
                                    <label className='mb-0'>
                                        <b>Cash Collection At</b>
                                    </label>
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
                            </div>
                            <label className='mb-0 mt-3'>
                                <b>Reason</b>
                            </label>
                            <textarea placeholder='Enter a valid reason in detail' className="form-control mb-3" name="reason" minLength={20} required />
                            <label className='mb-0'>
                                <b>Amount</b>
                            </label>
                            <input type='number' value={Amount} onChange={(e) => setAmount(e.target.value)} min={1} className="form-control mb-3" required />
                            <label className='mb-0'>
                                <b>Amount In Words (PKR)</b>
                            </label>
                            <input id="amount_in_words" className="form-control mb-3 text-capitalize" value={Amount > 0 ? (convertCurrency(Amount) + " Rupees Only") : ''} disabled />
                            {/* <label className="mb-0"><b>Submit To</b></label>
                <select className="form-control mb-3" name="request_to" required>
                    <option value="">Select the option</option>
                    {
                        Company && Relations
                        ?
                        Relations.map(
                            (val, index) => {
                                let option;
                                if ( val.category === 'all' || val.category.includes('purchase_order') )
                                {
                                    if ( val.companies.includes( parseInt(Company) ) )
                                    {
                                        option = <option value={val.sr} key={index}> {val.name} </option>
                                    }
                                }

                                return option;
                            }
                        ):null
                    }
                </select> */}
                            <div className='d-flex justify-content-between'>
                                <div className='btn-group'>
                                    <button title={SPRSpecifications} className="btn submit" type='button' onClick={() => setPRAttachment(true)}> {PR ? "PR (" + PRCode + ") Attached" : "Attach PR"}</button>
                                    <button className="btn light" type='button' onClick={() => setSlipAttachment(true)}>{Slip ? "Slip (" + SlipCode + ") Attached" : "Attach Previous Slip"}</button>
                                </div>
                                <div className='d-flex justify-content-end'>
                                    <button className='btn light' type='button' onClick={() => history.goBack()}>Back</button>
                                    <button className='btn submit ml-2' type='submit'>Submit</button>
                                    <button className='btn submit d-none ml-auto' id="resetBtn" type='reset'>Reset</button>
                                </div>
                            </div>
                        </fieldset>
                    </form>
                </>
            }


        </>
    );

}

export default UI;

const SlipAttachmentModal = ({ Slip, attachSlip, SlipList }) => {
    const [ReasonFilter, setReasonFilter] = useState("");
    const [AmountFilter, setAmountFilter] = useState(0);

    return (
        <>
            <h5 className='mb-0'>Attach Previous Advance Cash</h5>
            <hr />
            <div className='d-flex'>
                <div className='w-50'>
                    <label className='font-weight-bold mb-0'>Search By Reason</label>
                    <input value={ReasonFilter} className='form-control' placeholder='Search Here....' onChange={(e) => setReasonFilter(e.target.value)} />
                </div>
                <div className='w-50 pl-2'>
                    <label className='font-weight-bold mb-0'>Search By Amount</label>
                    <input type='number' className='form-control' min={0} value={AmountFilter} onChange={(e) => setAmountFilter(e.target.value)} />
                </div>
            </div>
            {
                SlipList
                    ?
                    SlipList.length === 0
                        ?
                        <p className="mb-0 text-center">No Record Found</p>
                        :
                        <table className="table table-sm table-hover">
                            <thead>
                                <tr>
                                    <th className='border-top-0'>Sr.No</th>
                                    <th className='border-top-0'>Co & Loc</th>
                                    <th className='border-top-0'>Reason</th>
                                    <th className='border-top-0'>Date</th>
                                    <th className='border-top-0'>Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    SlipList.filter(({ amount, reason }) => amount >= AmountFilter && reason.toLowerCase().includes(ReasonFilter.toLowerCase())).map(
                                        (val, index) => {
                                            const code = val.company_code_name + '-' + val.series_year + '-' + val.serial_no;
                                            const submit_date = val.submit_date ? convertTZ(val.submit_date).toDateString() : null;
                                            return (
                                                <tr className={Slip && Slip == val.id ? 'highlighted' : ''} onClick={() => attachSlip(val.id, code)} key={index} style={{ cursor: 'pointer', transition: '.3s' }}>
                                                    <td>{code}</td>
                                                    <td>
                                                        {val.company_name}<br />
                                                        {val.location_name}
                                                    </td>
                                                    <td><span className='overflow_text'>{val.reason}</span></td>
                                                    <td>
                                                        {submit_date}<br />
                                                        {val.submit_time ? moment(val.submit_time, 'h:mm:ss a').format('hh:mm A') : null}
                                                    </td>
                                                    <td>Rs {val.amount.toLocaleString('en')}</td>
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

const PRAttachmentModal = ({ PR, attachPR, PRList }) => {

    return (
        <>
            <h5>Attach Purchase Requisition</h5>
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
                                    <th className='border-top-0'>PR #</th>
                                    <th className='border-top-0'>Co & Loc</th>
                                    <th className='border-top-0'>Specifications</th>
                                    <th className='border-top-0'>Date</th>
                                    <th className='border-top-0'>Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    PRList.map(
                                        (val, index) => {
                                            const code = val.company_short_code + '-' + val.series_year + '-' + val.series_code;
                                            return (
                                                <tr className={PR && PR == val.pr_id ? 'highlighted' : ''} onClick={() => attachPR(val.pr_id, code, val.specifications)} key={index} style={{ cursor: 'pointer', transition: '.3s' }}>
                                                    <td>{code}</td>
                                                    <td>{val.company_name} <br /> {val.location_name}</td>
                                                    <td>{val.specifications}</td>
                                                    <td>{new Date(val.requested_date).toDateString()}</td>
                                                    <td>Rs {val.total_value.toLocaleString('en')}</td>
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