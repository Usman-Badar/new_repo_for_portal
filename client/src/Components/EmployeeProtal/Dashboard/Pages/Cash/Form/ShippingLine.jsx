/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { convertCurrency } from '../../../../../../utils/currency';

const ShippingLine = ({ Companies, Locations, DO, LOLO, DET, DMGDT, CSC, Other, setDET, setDMGDT, setCSC, setOther, setLOLO, setDO, onCreateShpCash }) => {
    const [reason, setReason] = useState('');
    useEffect(
        () => {
            if (!DO.required && DO.amount !== 0) setDO({...DO, amount: 0});
            if (!LOLO.required && LOLO.amount !== 0) setLOLO({...LOLO, amount: 0});
            if (!DET.required && DET.amount !== 0) setDET({...DET, amount: 0});
            if (!DMGDT.required && DMGDT.amount !== 0) setDMGDT({...DMGDT, amount: 0});
            if (!CSC.required && DET.amount !== 0) setCSC({...CSC, amount: 0});
            if (!Other.required && (Other.amount !== 0 || Other.specification !== '')) setOther({...Other, amount: 0, specification: ''});
        }, [DO.required, LOLO.required, DET.required, DMGDT.required, Other.required]
    );
    const total = parseFloat(DO.amount) + parseFloat(LOLO.amount) + parseFloat(DET.amount) + parseFloat(DMGDT.amount) + parseFloat(CSC.amount) + parseFloat(Other.amount);
    return (
        <>
            <form onSubmit={onCreateShpCash} className="shipping_line_payment_form p-relative">
                <fieldset>
                    <div className="d-flex align-items-center justify-content-between ">
                        <h3 className="heading">
                            Shipping Line Advance Cash
                            <sub>Get Cash For Line Payment Instantly</sub>
                        </h3>
                    </div>
                    <hr />
                    <div className='grid mb-3'>
                        <div>
                            <label className='mb-0'>
                                <b>Line</b>
                            </label>
                            <input className="form-control" name="line" required />
                        </div>
                        <div>
                            <label className='mb-0'>
                                <b>Company</b>
                            </label>
                            <select className="form-control" name="company_code" required>
                                <option value=''>Select the option</option>
                                {Companies.map(val => <option key={val.company_code} value={val.company_code}> {val.company_name} </option>)}
                            </select>
                        </div>
                        <div>
                            <label className='mb-0'>
                                <b>Cash Collection At</b>
                            </label>
                            <select className="form-control" name="location_code" required>
                                <option value=''>Select the option</option>
                                {Locations.map(val => <option key={val.location_code} value={val.location_code}> {val.location_name} </option>)}
                            </select>
                        </div>
                        <div className="type">
                            <div className='d-flex align-items-end mb-1'>
                                <input name='DO' type="checkbox" className="mr-2" checked={DO.required} onChange={() => setDO({...DO, required: !DO.required})} />
                                <label>
                                    D/O Charges
                                </label>
                            </div>
                            <input type='number' value={DO.amount} onChange={(e) => setDO({...DO, amount: e.target.value})} className="form-control" id="DO_amount" disabled={!DO.required} />
                        </div>
                        <div className="type">
                            <div className='d-flex align-items-end mb-1'>
                                <input name='LOLO' type="checkbox" className="mr-2" checked={LOLO.required} onChange={() => setLOLO({...LOLO, required: !LOLO.required})} />
                                <label>
                                    LOLO Charges
                                </label>
                            </div>
                            <input type='number' value={LOLO.amount} onChange={(e) => setLOLO({...LOLO, amount: e.target.value})} className="form-control" id="LOLO_amount" disabled={!LOLO.required} />
                        </div>
                        <div className="type">
                            <div className='d-flex align-items-end mb-1'>
                                <input name='DET' type="checkbox" className="mr-2" checked={DET.required} onChange={() => setDET({...DET, required: !DET.required})} />
                                <label>
                                    Detention
                                </label>
                            </div>
                            <input type='number' value={DET.amount} onChange={(e) => setDET({...DET, amount: e.target.value})} className="form-control" id="DET_amount" disabled={!DET.required} />
                        </div>
                        <div className="type">
                            <div className='d-flex align-items-end mb-1'>
                                <input name='DMGDT' type="checkbox" className="mr-2" checked={DMGDT.required} onChange={() => setDMGDT({...DMGDT, required: !DMGDT.required})} />
                                <label>
                                    Damage & Dirty
                                </label>
                            </div>
                            <input type='number' value={DMGDT.amount} onChange={(e) => setDMGDT({...DMGDT, amount: e.target.value})} className="form-control" id="DMGDT_amount" disabled={!DMGDT.required} />
                        </div>
                        <div className="type">
                            <div className='d-flex align-items-end mb-1'>
                                <input name='CSC' type="checkbox" className="mr-2" checked={CSC.required} onChange={() => setCSC({...CSC, required: !CSC.required})} />
                                <label>
                                    CSC Charges
                                </label>
                            </div>
                            <input type='number' value={CSC.amount} onChange={(e) => setCSC({...CSC, amount: e.target.value})} className="form-control" id="CSC_amount" disabled={!CSC.required} />
                        </div>
                        <div className="type">
                            <div className='d-flex mb-1'>
                                <input name='Other' type="checkbox" className="mr-2" checked={Other.required} onChange={() => setOther({...Other, required: !Other.required})} />
                                <label>
                                    Other
                                </label>
                            </div>
                            <div>
                                <input type='number' value={Other.amount} onChange={(e) => setOther({...Other, amount: e.target.value})} className="form-control mb-2" id="Other_amount" disabled={!Other.required} />
                                <textarea value={Other.specification} onChange={(e) => setOther({...Other, specification: e.target.value})} className="form-control" id="Other_specification" disabled={!Other.required} placeholder={Other.required?'Please Specify...' :''} />
                            </div>
                        </div>
                    </div>
                    <label className='mb-0'>
                        <b>Reason</b>
                    </label>
                    <textarea name='reason' value={reason} onChange={(e) => setReason(e.target.value)} className="form-control" placeholder='Enter a valid reason here....' rows={3} minLength={20} required />
                    <small>{reason.trim().length}/20</small>

                    <div className='grid-2 my-2'>
                        <div>
                            <label className='mb-0'>
                                <b>Amount</b>
                            </label>
                            <input type='number' value={total} className="form-control" name="amount" disabled />
                        </div>
                        <div>
                            <label className='mb-0'>
                                <b>Amount In Words</b>
                            </label>
                            <input className="form-control text-capitalize" name="amount_in_words" value={convertCurrency(total.toString()) + " Rupees Only"} id='amount_in_words' disabled />
                        </div>
                    </div>

                    <button className='btn submit d-block ml-auto mt-3'>Submit</button>
                </fieldset>
            </form>
        </>
    )
}

export default ShippingLine;