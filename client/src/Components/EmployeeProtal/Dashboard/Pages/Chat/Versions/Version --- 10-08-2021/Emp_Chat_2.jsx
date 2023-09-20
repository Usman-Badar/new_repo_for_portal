import React from 'react'
import './Emp_Chat_2.css';
import IMG from './new1.png';
import TextareaAutosize from '@mui/material/TextareaAutosize';

const Emp_Chat_2 = () => {
    return (
        <>
            <div className="Emp_Chat_2">
                <div className="Emp_Chat_Div">
                    <div className="d-flex w-100">
                        <div className="d-flex justify-content-center align-items-center w-25">
                            <img src={IMG} alt="dp" style={{ width: "70px", height: "70px", borderRadius: "50%" }} />
                        </div>
                        <div className="d-flex justify-content-center align-items-center">
                            <div className="d-block">
                                <p className="font-weight-bolder mb-0">Name</p>
                                <p>Designation</p>
                            </div>
                        </div>
                    </div>
                    <div className="Chat_Box_Div">
                        <div className="d-flex align-items-end mb-2">
                            <img src={IMG} alt="dp" style={{ width: "50px", height: "50px", borderRadius: "50%" }} className="mr-1" />
                            <div className="p-2" style={{ backgroundColor: "#d8d8d8", borderRadius: "5px", borderRadius: "5px" }}>
                                <p>hello, How are you</p>
                                <div className="d-flex justify-content-end" style={{ fontSize: "12px" }}>
                                    <p>11:10</p>
                                    <i class="las la-check ml-1"></i>
                                </div>
                            </div>
                        </div>
                        <div className="d-flex justify-content-end mb-2">
                            <div className="p-2" style={{ backgroundColor: "#d8d8d8", borderRadius: "5px" }}>
                                <p>In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content. Lorem ipsum may be used as a placeholder before final copy is available</p>
                                <div className="d-flex justify-content-end" style={{ fontSize: "12px" }}>
                                    <p>12:55</p>
                                    <i class="las la-check ml-1"></i>
                                </div>
                            </div>
                            <img src={IMG} alt="dp" style={{ width: "50px", height: "50px", borderRadius: "50%" }} className="ml-1" />
                        </div>
                    </div>

                    <div className="d-flex">
                        <i class="las la-smile mx-2" style={{ fontSize: "25px" }}></i>
                        <TextareaAutosize
                            id="TextArea"
                            aria-label="minimum height"
                            minRows={2}
                            placeholder="Message"
                            style={{ width: 200 }}
                        />
                        <i class="las la-paperclip mr-2" style={{ fontSize: "25px" }}></i>
                        <i class="las la-camera mr-2" style={{ fontSize: "25px" }}></i>
                    </div>
                </div>
            </div>
        </>
    )
}
export default Emp_Chat_2;