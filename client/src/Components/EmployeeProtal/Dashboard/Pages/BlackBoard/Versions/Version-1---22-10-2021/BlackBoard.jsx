import React from 'react';
import { Link } from "react-router-dom";

import './BlackBoard.css';

const BlackBoard = () => {
    return (
        <>
            <div className="BlackBoard">
                <div className="BlackBoard_Data">
                    <div className="Data">
                        <div className="Data_Grid" >
                            <div><h1>Your Courses</h1></div>
                            <div className="d-flex">
                                <input type="Search" className="form-control" />
                                <button className="btn"><i class="las la-search"></i></button>
                            </div>
                        </div>
                        <div className="py-5">
                            <Link to='/More_Courses'>   <p>View more Courses</p> </Link>
                        </div>
                        <div className="Courses_Cards">
                            <div className="DIV border">
                                <Link to='/BlackBoard_Videos'>
                                    <div className="IMAGE" >
                                        <div className="Circle">
                                            <p className="mb-0">9%</p>
                                        </div>
                                    </div>
                                    <div className="d-flex w-100 Boxes">
                                        <div className="d-flex justify-content-center align-items-center w-100 border-right py-4">
                                            <div className="d-block text-center">
                                                <i class="las la-edit"></i>
                                                <p className="mb-0">See Overview</p>
                                            </div>
                                        </div>
                                        <div className="d-flex justify-content-center align-items-center w-100 py-4">
                                            <div className="d-block text-center">
                                                <i class="las la-play"></i>
                                                <p className="mb-0">Review Courses</p>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                            <div className="DIV border">
                                <div className="IMAGE" >
                                    <div className="Circle">
                                        <p className="mb-0">9%</p>
                                    </div>
                                </div>
                                <div className="d-flex w-100 Boxes">
                                    <div className="d-flex justify-content-center align-items-center w-100 border-right py-4">
                                        <div className="d-block text-center">
                                            <i class="las la-edit"></i>
                                            <p className="mb-0">See Overview</p>
                                        </div>
                                    </div>
                                    <div className="d-flex justify-content-center align-items-center w-100 py-4">
                                        <div className="d-block text-center">
                                            <i class="las la-play"></i>
                                            <p className="mb-0">Review Courses</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="DIV border">
                                <div className="IMAGE" >
                                    <div className="Circle">
                                        <p className="mb-0">9%</p>
                                    </div>
                                </div>
                                <div className="d-flex w-100 Boxes">
                                    <div className="d-flex justify-content-center align-items-center w-100 border-right py-4">
                                        <div className="d-block text-center">
                                            <i class="las la-edit"></i>
                                            <p className="mb-0">See Overview</p>
                                        </div>
                                    </div>
                                    <div className="d-flex justify-content-center align-items-center w-100 py-4">
                                        <div className="d-block text-center">
                                            <i class="las la-play"></i>
                                            <p className="mb-0">Review Courses</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default BlackBoard;