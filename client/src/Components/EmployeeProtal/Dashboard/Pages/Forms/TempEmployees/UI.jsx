import React from "react";
import './Style.css';

const UI = (props) => {
    return (
        <>
            <div className="TempEmployeesForm d-center">
                <div className="TempEmployeesForm-content">
                    <div className="firstform">
                        <div className="text-center mb-3 emp_heading">
                            <h3 className="text-uppercase formName mb-1"> Temporary/Daily Wages Employment Form</h3>
                            <p>Seaboard Group Employee Data Form</p>
                        </div>

                        <div className="">
                            <form className="form1">
                                <div className="d-lg-flex justify-content-center mb-2">
                                    <div className="leftRight mr-2">
                                        <label className="mb-0 font-weight-bold">Name:</label>
                                        <div className="d-flex justify-content-center align-items-center">
                                            <i className="las la-font"></i>
                                            <input name="Name" type="text" pattern="[a-zA-Z][a-zA-Z\s]*" title="Name only contains letters" className="form-control" required minLength="3" />
                                        </div>
                                    </div>
                                    <div className="leftRight mr-2">
                                        <label className="mb-0 font-weight-bold">Father Name:</label>
                                        <div className="d-flex justify-content-center align-items-center">
                                            <i className="las la-bold"></i>
                                            <input name="FatherName" type="text" pattern="[a-zA-Z][a-zA-Z\s]*" title="Father Name only contains letters" className="form-control" required minLength="3" />
                                        </div>
                                    </div>
                                </div>
                                <div className="d-lg-flex justify-content-center mb-2">
                                    <div className="leftRight mr-2">
                                        <label className="mb-0 font-weight-bold">Date of Birth:</label>
                                        <div className="d-flex justify-content-center align-items-center">
                                            <i className="lar la-calendar"></i>
                                            <input name="Dob" type="date" className="form-control" required />
                                        </div>
                                    </div>
                                    <div className="leftRight mr-2">
                                        <label className="mb-0 font-weight-bold">Cell Phone Number:</label>
                                        <div className="d-flex justify-content-center align-items-center">
                                            <i className="las la-phone-square-alt"></i>
                                            <input name="personal_no" pattern="^[0-9]+$" type="text" className="form-control" minLength="11" maxLength="13" required />
                                        </div>
                                    </div>

                                </div>
                                <div className="d-lg-flex justify-content-center mb-2">
                                    <div className="leftRight mr-2">
                                        <label className="mb-0 font-weight-bold">Gender:</label>
                                        <div className="d-flex justify-content-center align-items-center">
                                            <i className="las la-mercury"></i>
                                            <select name="gender" className="form-control" required>
                                                <option value="">Select The Option</option>
                                                <option value="Male">Male</option>
                                                <option value="FeMale">FeMale</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="leftRight mr-2">
                                        <label className="mb-0 font-weight-bold">Email:</label>
                                        <div className="d-flex justify-content-center align-items-center">
                                            <i className="las la-envelope"></i>
                                            <input name="email" type="email" className="form-control" required />
                                        </div>
                                    </div>
                                </div>
                                <div className="d-lg-flex justify-content-center mb-2">
                                    <div className="leftRight mr-2">
                                        <label className="mb-0 font-weight-bold">Address:</label>
                                        <div className="d-flex justify-content-center align-items-center">
                                            <i className="las la-map-marker"></i>
                                            <input name="PrmtAddress" type="text" className="form-control" minLength="10" required />
                                        </div>
                                    </div>
                                    <div className="leftRight mr-2">
                                        <label className="mb-0 font-weight-bold">CNIC:</label>
                                        <div className="d-flex justify-content-center align-items-center">
                                            <i className="las la-list-ol"></i>
                                            <input name="cnic" type="text" pattern="^[0-9]+$" title="CNIC only contains numbers" className="form-control" required minLength="13" maxLength="13" />
                                        </div>
                                    </div>
                                </div>
                                <div className="d-lg-flex justify-content-center mb-2">
                                    <div className="leftRight mr-2">
                                        <label className="mb-0 font-weight-bold">CNIC Front Image:</label>
                                        <div className="d-flex justify-content-center align-items-center">
                                            <i className="las la-id-card-alt"></i>
                                            <input name="cnic_front_photo" type="file" className="form-control" required accept=".jpg, .jpeg, .png" />
                                        </div>
                                    </div>
                                    <div className="leftRight mr-2">
                                        <label className="mb-0 font-weight-bold">CNIC Back Image:</label>
                                        <div className="d-flex justify-content-center align-items-center">
                                            <i className="las la-folder-open"></i>
                                            <input name="cnic_back_photo" type="file" className="form-control" required accept=".jpg, .jpeg, .png" />
                                        </div>
                                    </div>
                                </div>
                                <div className="d-lg-flex justify-content-center mt-4 mb-2">
                                    <div className="leftRight mr-2 w-100">
                                        <div className="d-lg-flex justify-content-center mb-2">
                                            <div className="employee_img" data-toggle="modal" data-target="#myModal"></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right mt-3 mr-2">
                                    <button type="submit" className="btn btn-sm step4_btn_next">Submit</button>
                                </div>
                            </form>
                        </div>

                        {/* <div className="Step5">
                            <div className="d-lg-flex justify-content-center mb-2">
                                <h3 className="mt-4">Form Submitted Successfully</h3>
                            </div>
                        </div> */}

                    </div>
                </div>
            </div>
            <div id="myModal" className="modal fade empModals" role="dialog">
                <div className="modal-dialog modal-dialog-centered">


                    <div className="modal-content">
                        <div className="modal-header">
                            <h4 className="modal-title">LIVE CAMERA</h4>
                            <button type="button" className="close" data-dismiss="modal">&times;</button>
                        </div>
                        {/* <div className="modal-body">
                            {
                                Camera ?
                                    <>
                                        <Webcam
                                            audio={false}
                                            screenshotFormat="image/jpeg"
                                            width='100%'
                                            ref={refs}
                                            videoConstraints={props.videoConstraints}
                                        />
                                        <button className="btn btn-sm btn-block mt-3" onClick={takePhoto}>TAKE YOUR PHOTO</button>
                                    </>
                                    :
                                    <h4 className="text-center my-3">Camera Not Found</h4>
                            }
                        </div> */}
                        <div className="modal-footer">
                            <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
                        </div>
                    </div>

                </div>
            </div>

            {/* <ToastContainer /> */}
        </>
    )
}
export default UI;