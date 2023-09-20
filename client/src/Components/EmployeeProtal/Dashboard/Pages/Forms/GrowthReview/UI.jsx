/* eslint-disable jsx-a11y/role-supports-aria-props */
/* eslint-disable no-mixed-operators */
/* eslint-disable eqeqeq */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react';
import './Style.css';

import { Route, Switch } from 'react-router-dom';
import Modal from '../../../../../UI/Modal/Modal';
import { useReactToPrint } from 'react-to-print';

const UI = ({ addRow, Locations, Companies, SubmitPR, onContentInput }) => {

    return (
        <>
            <div className="purchase_requisition">
                <div className="purchase_requisition_form">
                    <Switch>
                        <Route exact path="/growthreview" render={
                            () => (
                                <PRForm
                                    Locations={Locations}
                                    Companies={Companies}
                                    onContentInput={onContentInput}
                                    addRow={addRow}
                                    SubmitPR={SubmitPR}
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

const PRForm = ({ Locations, Companies, SubmitPR, addRow, onContentInput }) => {

    return (
        <>
            <div className="d-flex align-items-center justify-content-between">
                <h3 className="heading">
                    Growth Review
                    <sub>Application Form</sub>
                </h3>

                {/* <button className="btn submit" type='reset'>Back To Requests</button> */}
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
                            <label className="mb-0"><b>Location</b></label>
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


                    {/* <label className="mb-0"><b>Reason</b></label>
                    <textarea className="form-control" name="reason" required minLength={20} /> */}

                    <br />

                    <div className="d-flex justify-content-between align-items-center">
                        <label className='mb-1'><b>Specifications</b></label>
                        <i className="las la-plus-circle la-2x" style={{ cursor: 'pointer' }} title='Add New Row' onClick={addRow}></i>
                    </div>

                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th className='text-center'>Sr.No.</th>
                                <th className='text-center'>Task</th>
                                <th className='text-center'>Ticket</th>
                                <th className='text-center'>Remarks</th>
                            </tr>
                        </thead>
                        <tbody id="specifications_table_body">
                            <tr id="specification_row_1">
                                <td></td>
                                <td></td>
                                <td>
                                    <div className="type_container">
                                        <div className="circle red" ></div>
                                        <div className="circle yellow"></div>
                                        <div className="circle green"></div>
                                    </div>
                                </td>
                                <td></td>
                                {/* <td id="specification_total_cost_1"></td> */}
                            </tr>
                        </tbody>

                    </table>

                    <div className="d-flex align-items-center justify-content-end">

                        <button className="btn submit" type='submit'>Submit</button>

                    </div>
                </fieldset>
            </form>
        </>
    )

}


