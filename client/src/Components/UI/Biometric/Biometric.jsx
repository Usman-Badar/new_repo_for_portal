/* eslint-disable eqeqeq */
import React, { useEffect, useState } from 'react';
import JSAlert from 'js-alert';
import $ from 'jquery';

import axios from '../../../axios';
import socket from '../../../io';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Biometric = () => {
    const secugen_lic = "";
    const img = "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/Fingerprint_picture.svg/1413px-Fingerprint_picture.svg.png";
    const uri = "https://localhost:8443/SGIFPCapture";
    const xmlhttp = new XMLHttpRequest();
    let fpobject;

    const [Register, setRegister] = useState(true);
    const [Template, setTemplate] = useState('biometric_verification_match');
    const [ID, setID] = useState('');

    useEffect(
        () => {
            socket.on('biometric_verification_result', (message) => {
                toast.dark(message, {
                    position: 'top-right',
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            })
            socket.on('biometric_verification_match', (data) => {
                if (data.id === socket.id) {
                    $('fieldset').prop('disabled', false);
                    document.getElementById('FPImage2').src = img;
                    setTemplate();
                    toast.dark("Please wait...", {
                        position: 'top-right',
                        autoClose: 2000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                }
            })
            socket.on('biometric_verification_save', (data) => {
                if (data.id === socket.id) {
                    $('fieldset').prop('disabled', false);
                    document.getElementById('FPImage2').src = img;
                    setTemplate();
                    toast.dark("Employee biometric is saved!!!", {
                        position: 'top-right',
                        autoClose: 2000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                }
            })
        }, []
    )

    function CallSGIFPGetData(successCall, failCall) {
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                fpobject = JSON.parse(xmlhttp.responseText);
                successCall(fpobject);
            } else if (xmlhttp.status == 404) {
                failCall(xmlhttp.status)
            }
        }
        xmlhttp.onerror = function () {
            failCall(xmlhttp.status);
        }
        var params = "Timeout=10000";
        params += "&Quality=50";
        params += "&licstr=" + encodeURIComponent(secugen_lic);
        params += "&templateFormat=ISO";
        xmlhttp.open("POST", uri, true);
        xmlhttp.send(params);
    }

    function SuccessFunc(result) {
        if (result.ErrorCode == 0) {
            /* 	Display BMP data in image tag
                BMP data is in base 64 format 
            */
            if (result != null && result.BMPBase64.length > 0) {
                document.getElementById('FPImage2').src = "data:image/bmp;base64," + result.BMPBase64;
            }
            setTemplate(result.BMPBase64);
        } else {
            alert("Fingerprint Capture Error Code:  " + result.ErrorCode + ".\nDescription:  " + (result.ErrorCode) + "."); // ErrorCodeToString
        }
    }

    function ErrorFunc(status) {
        alert("Check if SGIBIOSRV is running; status = " + status + ":");
    }

    function save(e) {
        e.preventDefault();

        if (ID === '' || ID === 0 || !ID) {
            JSAlert.alert("Employee ID is required!!!", "Validation Error", JSAlert.Icons.Warning).dismissIn(2000);
            return false;
        }
        // if (Template === '' || Template === null || !Template) {
        //     JSAlert.alert("Employee biometric is required!!!", "Validation Error", JSAlert.Icons.Warning).dismissIn(2000);
        //     return false;
        // }

        $('fieldset').prop('disabled', true);

        if (Register) {
            socket.emit('biometric_verification_save', {
                template: Template,
                emp_id: ID
            });
        }else {
            socket.emit('biometric_verification_match', {
                template: Template,
                emp_id: ID
            });
        }

        // axios.post(
        //     Register ? '/biometric/save' : '/biometric/match',
        //     {
        //         template: Template,
        //         emp_id: ID
        //     }
        // ).then(() => {
        //     $('fieldset').prop('disabled', false);
        //     document.getElementById('FPImage2').src = img;
        //     setTemplate();
        //     toast.dark(Register ? "Employee biometric is saved!!!" : "Please Wait...", {
        //         position: 'top-right',
        //         autoClose: 2000,
        //         hideProgressBar: false,
        //         closeOnClick: true,
        //         pauseOnHover: true,
        //         draggable: true,
        //         progress: undefined,
        //     });
        // }).catch(err => {
        //     $('fieldset').prop('disabled', false);
        //     console.log(err);
        // })
    }

    return (
        <div className='d-flex w-100 vh-100 align-items-center justify-content-center bg-light'>
            <form className='p-4 border rounded w-50 text-center bg-white' onSubmit={save}>
                <fieldset>
                    <h1 className='mb-0'>Save Employee Biometric</h1>
                    <hr /><br />
                    <img className='pointer' onClick={() => CallSGIFPGetData(SuccessFunc, ErrorFunc)} id="FPImage2" src={img} alt="fingerprints" width='100' />
                    <br /><br />
                    <input value={ID} type="number" onChange={(e) => setID(e.target.value)} placeholder='Employee ID' className="form-control" min={0} required />
                    <div className="d-flex align-items-center mt-3">
                        <input checked={Register} type="checkbox" className='mr-2' onChange={() => setRegister(!Register)} /><span>Register Biometric</span>
                    </div>
                    <br />
                    <button className="btn submit">Save</button>
                </fieldset>
            </form>
            <ToastContainer />
        </div>
    )
}

export default Biometric;
