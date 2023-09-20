import React, { useEffect, useRef, useState } from 'react';
import './CreateUser.css';

import axios from '../../../../../axios';
import $ from 'jquery';
import { useHistory } from 'react-router-dom';

import Webcam from 'react-webcam';


import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import spoken from '../../../../../../node_modules/spoken/build/spoken';

const CreateUser = () => {

    const refs = useRef(null);
    const history = useHistory();
    let key = 'real secret keys should be long and random';
    const encryptor = require('simple-encryptor')(key);

    const [Roles, setRoles] = useState([]);
    const [Camera, setCamera] = useState(false);
    const [ImgPreview, setImgPreview] = useState('');

    const [CreatingUser, setCreatingUser] = useState(
        {
            UsrName: '', UsrPass: '', UsrRole: ''
        }
    );
    const [UsrImgs, setUsrImgs] = useState(
        {
            UsrImage: '', UsrImgName: ''
        }
    )

    useEffect(
        () => {

            setInterval(() => {
                navigator.getUserMedia({ video: true }, () => { setCamera(true); }, () => { setCamera(false); });
            }, 100);

            axios.get('/getusersroles').then(res => {

                setRoles(res.data);

            }).catch(err => {

                toast.dark(err, {
                    position: 'top-right',
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });

            });

        }, []
    )

    const b64toBlob = (b64Data, contentType, sliceSize) => {
        contentType = contentType || '';
        sliceSize = sliceSize || 512;

        var byteCharacters = atob(b64Data); // window.atob(b64Data)
        var byteArrays = [];

        for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            var slice = byteCharacters.slice(offset, offset + sliceSize);

            var byteNumbers = new Array(slice.length);
            for (var i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            var byteArray = new Uint8Array(byteNumbers);

            byteArrays.push(byteArray);
        }

        var blob = new Blob(byteArrays, { type: contentType });
        return blob;
    }

    const takePhoto = () => {

        var screenshot = refs.current.getScreenshot();
        setImgPreview(screenshot);
        $('.close').trigger('click');

        let block = screenshot.split(";");
        var contentType = block[0].split(":")[1];
        var realData = block[1].split(",")[1];
        var blob = b64toBlob(realData, contentType);

        const d = new Date();
        let ImageCurrentName = d.getTime();

        setUsrImgs({ ...UsrImgs, UsrImage: blob, UsrImgName: ImageCurrentName });

    }

    // Call on change function to store input field data into usestate()
    const OnChangeHandler = ( e ) => {

        const { name, value } = e.target;
        const setValues = {
            ...CreatingUser,
            [name]: value
        }

        setCreatingUser(setValues);

    }

    const OnUserCreate = ( e ) => {

        e.preventDefault();

        if( ImgPreview.length === 0 )
        {
            spoken.say('Please take you photo');
        }else{
            spoken.say('Please wait...');
            const Data = new FormData();
            Data.append('UserName', encryptor.encrypt( CreatingUser.UsrName ));
            Data.append('UserRole', CreatingUser.UsrRole);
            Data.append('UsrImg', UsrImgs.UsrImage);
            Data.append('UsrImgName', UsrImgs.UsrImgName);
            Data.append('UserPassword', encryptor.encrypt( CreatingUser.UsrPass ));

            axios.post('/createuser', Data).then(() => {

                spoken.say('Process Completed. Thank You');
                setTimeout(() => {
                    history.replace('/admin_users');
                }, 1000);


            }).catch(err => {

                toast.dark(err, {
                    position: 'top-right',
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });

            });
        }

    }

    const videoConstraints = {
        width: 1280,
        height: 720,
        facingMode: "user"
    }

    return (
        <>
            <div className="CreateUser">
                <div className="Box1">
                    <form onSubmit={ OnUserCreate }>
                        <div className="user_img" data-toggle="modal" data-target="#usrmodal" style={{ 'backgroundImage': "url('" + ImgPreview + "')" }}> User Image </div>
                        <h3 className="mb-3 text-center">Create User Form</h3>
                        <p className="mb-0"> User Name: </p>
                        <input type="text" className="form-control mb-3" name="UsrName" onChange={ OnChangeHandler } required />
                        <p className="mb-0"> User Password: </p>
                        <input type="password" className="form-control mb-3" name="UsrPass" onChange={ OnChangeHandler } required />
                        <p className="mb-0"> User Role: </p>
                        <select className="form-control mb-3" name="UsrRole" onChange={ OnChangeHandler } required>
                            <option value=''>Select the option</option>
                            {
                                Roles.length === 0
                                    ?
                                    <h3 className="text-center mb-0">No Role Found</h3>
                                    :
                                    Roles.map(
                                        (val, index) => {
                                            return (
                                                <option value={val.role_id}> {val.role_title} </option>
                                            )
                                        }
                                    )
                            }
                        </select>
                        <button type="submit" class="btn d-block ml-auto createBtn"> Create </button>
                    </form>
                </div>
                <div id="usrmodal" className="modal fade empModals">
                    <div className="modal-dialog modal-dialog-centered">


                        <div className="modal-content">
                            <div className="modal-header">
                                <h4 className="modal-title">LIVE CAMERA</h4>
                                <button type="button" className="close" data-dismiss="modal">&times;</button>
                            </div>
                            <div className="modal-body">
                                {
                                    Camera ?
                                        <>
                                            <Webcam
                                                audio={false}
                                                screenshotFormat="image/jpeg"
                                                width='100%'
                                                ref={refs}
                                                videoConstraints={videoConstraints}
                                            />
                                            <button className="btn btn-sm btn-block mt-3 btn-dark" onClick={takePhoto}>TAKE YOUR PHOTO</button>
                                        </>
                                        :
                                        <h4 className="text-center my-3">Please Wait</h4>
                                }
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

        </>
    )

}
export default CreateUser;