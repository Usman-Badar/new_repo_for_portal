import React from "react";
import './Style.css';

const UI = (props) => {
    return (
        <>
            <div className="SelfAssessmentForm d-center">
                <div className="SelfAssessmentForm-content">
                    <div className="firstform">
                        <div className="d-flex align-items-center justify-content-between">
                            <h3 className="heading">
                                Self Assessment Review
                                <sub>Form</sub>
                            </h3>

                            {/* <button className="btn submit" type='reset' >Back To Requests</button> */}
                        </div>
                        <hr />

                        <div className="grid-div">
                            <h6 className="">If this form is part of an annual performance review, discuss the form with your manager and then select and answer those questions that most apply to you. Note that this form also includes some preparation questions to consider for the next year.</h6>
                            <div className="rightdiv">
                                <div className="rightdiv-details">
                                    <h6 className="font-weight-bold">Employee Name : </h6>
                                    <h6>Muhammad Malahim</h6>
                                </div>
                                <div className="rightdiv-details">
                                    <h6 className="font-weight-bold">Title : </h6>
                                    <h6>Developer</h6>
                                </div>
                                <div className="rightdiv-details">
                                    <h6 className="font-weight-bold">Manager : </h6>
                                    <h6>Muhammad Malahim</h6>
                                </div>
                                <div className="rightdiv-details">
                                    <h6 className="font-weight-bold">Date : </h6>
                                    <h6>07 Jun 2023</h6>
                                </div>
                            </div>
                        </div>
                        <div className="">
                            <form className="">

                                <h5 className="font-weight-bold">Job Definition </h5>

                                <div className="ml-3 mb-3">
                                    <div className="d-flex">
                                        <span className="mx-2">-</span>
                                        <label className="mb-1">Attach a current position description; if applicable, make note of any significant changes since last year’s performance review.</label>
                                    </div>
                                    <textarea className="form-control" name="" required minLength={20} />
                                </div>

                                <div className="ml-3 mb-3">
                                    <div className="d-flex">
                                        <span className="mx-2">-</span>
                                        <label className="mb-1">Which position responsibilities do you view as most important?   Why?</label>
                                    </div>
                                    <textarea className="form-control" name="" required minLength={20} />
                                </div>

                                <div className="ml-3 mb-3">
                                    <div className="d-flex">
                                        <span className="mx-2">-</span>
                                        <label className="mb-1">Have there been any special circumstances that have helped or hindered you in doing your position this year?  If yes, what were the circumstances and how did they affect your work?</label>
                                    </div>

                                    <textarea className="form-control" name="" required minLength={20} />
                                </div>


                                <br />

                                <h5 className="font-weight-bold">Accomplishments </h5>

                                <div className="ml-3 mb-3">
                                    <div className="d-flex">
                                        <span className="mx-2">-</span>
                                        <label className="mb-1">List your most significant accomplishments or contributions during the past year.  How do these achievements align with the goals/objectives outlined in your last review?</label>
                                    </div>

                                    <textarea className="form-control" name="" required minLength={20} />
                                </div>

                                <div className="ml-3 mb-3">
                                    <div className="d-flex">
                                        <span className="mx-2">-</span>
                                        <label className="mb-1">Since the last review conversation, have you performed any new tasks or additional duties outside the scope of your regular responsibilities?   If so, please specify.</label>
                                    </div>

                                    <textarea className="form-control" name="" required minLength={20} />
                                </div>

                                <div className="ml-3 mb-3">
                                    <div className="d-flex">
                                        <span className="mx-2">-</span>
                                        <label className="mb-1">Describe professional development activities that have been helpful since last year (e.g., offsite seminars/classes, onsite training, peer training, on-the-job experience, better exposure to challenging projects).</label>
                                    </div>
                                    <textarea className="form-control" name="" required minLength={20} />
                                </div>

                                <br />

                                <h5 className="font-weight-bold">Goal Setting </h5>

                                <div className="ml-3 mb-3">
                                    <div className="d-flex">
                                        <span className="mx-2">-</span>
                                        <label className="mb-1">What are your goals for the coming year and what actions will you take to accomplish these goals?</label>
                                    </div>

                                    <textarea className="form-control" name="" required minLength={20} />
                                </div>

                                <div className="ml-3 mb-3">
                                    <div className="d-flex">
                                        <span className="mx-2">-</span>
                                        <label className="mb-1">What could your supervisor/manager do to support you in doing your job and accomplishing these goals?</label>
                                    </div>

                                    <textarea className="form-control" name="" required minLength={20} />
                                </div>

                                <div className="ml-3 mb-3">
                                    <div className="d-flex">
                                        <span className="mx-2">-</span>
                                        <label className="mb-1">What else would help you to do your job better and provide greater job satisfaction? </label>
                                    </div>
                                    <textarea className="form-control" name="" required minLength={20} />
                                </div>

                                <br />

                                <h5 className="font-weight-bold">Development Planning </h5>

                                <div className="ml-3 mb-3">
                                    <div className="d-flex">
                                        <span className="mx-2">-</span>
                                        <label className="mb-1">What kinds of professional development activities would you like to do during the coming year? </label>
                                    </div>

                                    <textarea className="form-control" name="" required minLength={20} />
                                </div>

                                <div className="ml-3 mb-3">
                                    <div className="d-flex">
                                        <span className="mx-2">-</span>
                                        <label className="mb-1">What support or information do you need to complete these activities?</label>
                                    </div>
                                    <textarea className="form-control" name="" required minLength={20} />
                                </div>

                                <div className="d-flex align-items-center justify-content-end">
                                    <button className="btn submit" type='submit'>Submit</button>
                                </div>

                            </form>
                        </div>

                    </div>
                </div>
            </div>
        </>
    )
}
export default UI;