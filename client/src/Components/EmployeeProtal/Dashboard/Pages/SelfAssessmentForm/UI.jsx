/* eslint-disable eqeqeq */
import React from "react";
import './Style.css';

const UI = ({ Tickets, Questions, Categories, quarter, AccessControls, history, onChangeHandlerTickets, onChangeCheckBoxes, onChangeHandler, needExplanation, onSubmit }) => {
    
    return (
        <>
            <div className="SelfAssessmentForm page">
                <div className="SelfAssessmentForm-content page-content">
                    <div className="firstform">
                        <div className="d-flex align-items-center justify-content-between">
                            <h3 className="heading">
                                Self Assessment Review
                                <sub>justification The Following Questions</sub>
                            </h3>

                            <div className="d-flex align-items-center" style={{ position: 'relative' }}>
                                <i className="las la-sync la-2x mr-3 text-secondary"></i>
                                <div className="savingTxt">Saving...</div>
                                <button className="btn light" onClick={ () => history.goBack() }>Back</button>
                            </div>
                        </div>
                        <hr />
                        <div className="grid-div">
                            <div className="px-3 pt-3 leftdiv">
                                <h6 className="mb-3">If this form is part of an annual performance review, discuss the form with your manager and then select and answer those questions that most apply to you. Note that this form also includes some preparation questions to consider for the next year.</h6>
                                <h6 className="mb-3 urdu ml-auto text-right">یہ فارم سالانہ کارکردگی کے جائزے کا حصہ ہے، ان سوالات کا انتخاب کریں اور ان کا جواب دیں جو آپ پر لاگو ہوتے ہیں۔ اس فارم میں اگلے سال کے لیے بھی کچھ سوالات شامل ہیں۔</h6>
                                <div className="alert alert-info">
                                    <b>Note</b><br />
                                    <span>Please type in English or Urdu (Roman) to express yourself fully</span>
                                    <div className="text-right">
                                        <b className="urdu">نوٹ</b><br />
                                        <span className="urdu">اپنی بات کو مکمل طور پر واضح کرنے کے لیے براہ کرم انگریزی یا اردو (رومن) میں ٹائپ کریں۔</span>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div className="rightdiv">
                                    <div className="rightdiv-details mb-2">
                                        <h6 className="font-weight-bold mb-0">Employee Name</h6>
                                        <input type="text" className="form-control" defaultValue={ AccessControls.name } disabled />
                                    </div>
                                    <div className="rightdiv-details mb-2">
                                        <h6 className="font-weight-bold mb-0">Designation</h6>
                                        <input type="text" className="form-control" defaultValue={ AccessControls.designation_name } disabled />
                                    </div>
                                    <div className="rightdiv-details mb-2">
                                        <h6 className="font-weight-bold mb-0">Quarter</h6>
                                        <input type="text" className="form-control" defaultValue={ quarter } disabled />
                                    </div>
                                    <div className="rightdiv-details">
                                        <h6 className="font-weight-bold mb-0">Date</h6>
                                        <input type="text" className="form-control" defaultValue={ new Date().toDateString() } disabled />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <hr />
                        <form className="" onSubmit={ onSubmit }>
                            <fieldset className="">
                                {
                                    !Questions
                                    ?
                                    <h6>Loading Questions....</h6>
                                    :
                                    Categories.map(
                                        ( category, index ) => {
                                            return (
                                                <div key={index}>
                                                    <hr />
                                                        <h5 className="font-weight-bold pl-3 mb-0" style={{ fontFamily: "Poppins" }}>{ category.category }</h5>
                                                    <hr />
                                                    {
                                                        Questions.filter(val => val.category_id === category.id).length === 0
                                                        ?
                                                        <h6>No Question Found</h6>
                                                        :
                                                        Questions.filter(val => val.category_id === category.id).map(
                                                            ( val, index ) => {
                                                                return (
                                                                    <div className="ml-3 mb-3" key={index}>
                                                                        <div className="d-flex align-items-center justify-content-between question">
                                                                            <div className="d-flex align-items-center left">
                                                                                <i className="las la-arrow-right mb-0 mr-2"></i>
                                                                                <h5 style={{ lineHeight: '25px', fontSize: '16px' }} className="mb-1">{ val.question } <span className="text-danger">*</span></h5>
                                                                            </div>
                                                                            <div className="d-flex align-items-center right">
                                                                                <label className="mb-1 urdu" style={{ fontSize: '16px' }}><span className="text-danger">*</span>{ val.translation }</label>
                                                                                <i className="las la-arrow-left ml-2" style={{ fontSize: '20px' }}></i>
                                                                            </div>
                                                                        </div>
                                                                        <textarea onChange={ onChangeHandler } value={ val.answer } className="form-control" name={ val.name } required={ val.applicable === 1 } minLength={30} />
                                                                        <p className="font-weight-bold mb-2">{val.answer.length}/30 Characters</p>
                                                                        <div className="d-flex align-items-center font-weight-bold"><input type="checkbox" className="form-control mr-2" onChange={ onChangeCheckBoxes } name={ val.name } checked={ val.applicable == 1 ? false : true } /> Not Applicable</div>
                                                                    </div>
                                                                )
                                                            }
                                                        )
                                                    }
                                                </div>
                                            )
                                        }
                                    )
                                }
                                <hr />
                                    <h5 className="font-weight-bold pl-3 mb-0" style={{ fontFamily: "Poppins" }}>Performance Ticket Explanation</h5>
                                <hr />
                                <div className="alert alert-info d-flex align-items-end">
                                    <div className="w-50">
                                        <b className="mb-2 d-block">Note</b>
                                        <span>In this section, you can explain the issued tickets</span>
                                    </div>
                                    <div className="w-50 text-right">
                                        <b className="urdu">نوٹ</b><br />
                                        <span className="urdu">اس سیکشن میں، آپ جاری کردہ ٹکٹوں کی وضاحت کر سکتے ہیں۔</span>
                                    </div>
                                </div>
                                {
                                    Tickets
                                    ?
                                    Tickets.map(
                                        ( val, index ) => {
                                            return (
                                                <div className="ml-3" key={index}>
                                                    <div className="d-flex justify-content-between question ticket" onClick={ () => needExplanation(index) }>
                                                        <div className="d-flex align-items-center left w-50">
                                                            <i className="las la-arrow-right mb-0 mr-2"></i>
                                                            <h5 style={{ lineHeight: '25px', fontSize: '12px', fontFamily: "Poppins" }} className="mb-0"><b>{ val.remarks }</b></h5>
                                                        </div>
                                                        <div className="w-50 d-flex justify-content-end align-items-end">
                                                            <div className='d-flex align-items-center'>
                                                                <div 
                                                                    className={
                                                                        "dot mr-1 "
                                                                        +
                                                                        (
                                                                            val.ticket === 'green'
                                                                            ?
                                                                            "bg-success"
                                                                            :
                                                                            val.ticket === 'red'
                                                                            ?
                                                                            "bg-danger"
                                                                            :
                                                                            val.ticket === 'yellow'
                                                                            ?
                                                                            "bg-warning"
                                                                            :null
                                                                        )
                                                                    }
                                                                ></div>
                                                                <div
                                                                    className={
                                                                        "text-capitalize "
                                                                        +
                                                                        (
                                                                            val.ticket === 'green'
                                                                            ?
                                                                            "text-success"
                                                                            :
                                                                            val.ticket === 'red'
                                                                            ?
                                                                            "text-danger"
                                                                            :
                                                                            val.ticket === 'yellow'
                                                                            ?
                                                                            "text-warning"
                                                                            :null
                                                                        )
                                                                    }
                                                                    style={{ fontSize: 12, fontFamily: "Roboto" }}
                                                                >
                                                                    {val.ticket.split('_').join(' ')}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <textarea onChange={ onChangeHandlerTickets } value={ val.explanation } className={ "form-control popUps " + ( val.need_explanation ? "" : "d-none" ) } name={ val.name } />
                                                </div>
                                            )
                                        }
                                    )
                                    :
                                    <h6>Loading Tickets....</h6>
                                }
                                <div className="d-flex align-items-center justify-content-end mt-3">
                                    <button className="btn submit" type='submit'>Submit</button>
                                </div>
                            </fieldset>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}
export default UI;