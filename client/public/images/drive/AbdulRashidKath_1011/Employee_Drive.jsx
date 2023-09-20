import React, { useEffect, useRef, useState } from 'react';
import './Employee_Drive.css';

import Menu from '../../../../UI/Menu/Menu';
import Modal from '../../../../UI/Modal/Modal';

import Webcam from 'react-webcam';
import axios from '../../../../../axios';

import LoadImg from '../../../../../images/771.gif';
import $ from 'jquery';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import LoadingUI from '../../../../UI/Loading/Loading';

import InsteadImg from '../../../../../images/not found.png';

const Employee_Drive = () => {

    const refs = useRef();

    const videoConstraints = {
        width: '100% !important',
        facingMode: 'environment'
    }

    const [ StartLoading, setStartLoading ] = useState( false );
    const [ Data, setData ] = useState([]);
    const [ Drive, setDrive ] = useState([]);
    const [ Folders, setFolders ] = useState([]);

    const [ Files, setFiles ] = useState(
        {
            file: '',
            name: ''
        }
    );
    const [ ShowModal, setShowModal ] = useState(false);
    const [ Loading, setLoading ] = useState(<></>);
    const [ Content, setContent ] = useState();
    const [ ImageData, setImageData ] = useState(
        {
            image: '',
            imageName: '',
            extension: ''
        }
    );

    useEffect(
        () => {

            let arr = [
                <SkeletonTheme baseColor="#fff" highlightColor="#ECF0F5">
                    <Skeleton style={{ padding: '50px 0', margin: '5px 0', borderRadius: '30px' }} />
                </SkeletonTheme>,
                <SkeletonTheme baseColor="#fff" highlightColor="#ECF0F5">
                    <Skeleton style={{ padding: '50px 0', margin: '5px 0', borderRadius: '30px' }} />
                </SkeletonTheme>,
                <SkeletonTheme baseColor="#fff" highlightColor="#ECF0F5">
                    <Skeleton style={{ padding: '50px 0', margin: '5px 0', borderRadius: '30px' }} />
                </SkeletonTheme>, <SkeletonTheme baseColor="#fff" highlightColor="#ECF0F5">
                    <Skeleton style={{ padding: '50px 0', margin: '5px 0', borderRadius: '30px' }} />
                </SkeletonTheme>, <SkeletonTheme baseColor="#fff" highlightColor="#ECF0F5">
                    <Skeleton style={{ padding: '50px 0', margin: '5px 0', borderRadius: '30px' }} />
                </SkeletonTheme>, <SkeletonTheme baseColor="#fff" highlightColor="#ECF0F5">
                    <Skeleton style={{ padding: '50px 0', margin: '5px 0', borderRadius: '30px' }} />
                </SkeletonTheme>, <SkeletonTheme baseColor="#fff" highlightColor="#ECF0F5">
                    <Skeleton style={{ padding: '50px 0', margin: '5px 0', borderRadius: '30px' }} />
                </SkeletonTheme>, <SkeletonTheme baseColor="#fff" highlightColor="#ECF0F5">
                    <Skeleton style={{ padding: '50px 0', margin: '5px 0', borderRadius: '30px' }} />
                </SkeletonTheme>,
                <SkeletonTheme baseColor="#fff" highlightColor="#ECF0F5">
                    <Skeleton style={{ padding: '50px 0', margin: '5px 0', borderRadius: '30px' }} />
                </SkeletonTheme>,
                <SkeletonTheme baseColor="#fff" highlightColor="#ECF0F5">
                    <Skeleton style={{ padding: '50px 0', margin: '5px 0', borderRadius: '30px' }} />
                </SkeletonTheme>, <SkeletonTheme baseColor="#fff" highlightColor="#ECF0F5">
                    <Skeleton style={{ padding: '50px 0', margin: '5px 0', borderRadius: '30px' }} />
                </SkeletonTheme>, <SkeletonTheme baseColor="#fff" highlightColor="#ECF0F5">
                    <Skeleton style={{ padding: '50px 0', margin: '5px 0', borderRadius: '30px' }} />
                </SkeletonTheme>, <SkeletonTheme baseColor="#fff" highlightColor="#ECF0F5">
                    <Skeleton style={{ padding: '50px 0', margin: '5px 0', borderRadius: '30px' }} />
                </SkeletonTheme>, <SkeletonTheme baseColor="#fff" highlightColor="#ECF0F5">
                    <Skeleton style={{ padding: '50px 0', margin: '5px 0', borderRadius: '30px' }} />
                </SkeletonTheme>, <SkeletonTheme baseColor="#fff" highlightColor="#ECF0F5">
                    <Skeleton style={{ padding: '50px 0', margin: '5px 0', borderRadius: '30px' }} />
                </SkeletonTheme>
            ]

            setLoading(
                arr
            );

            setTimeout(() => {
                setLoading(
                    <>
                        <div></div>
                        <div>
                            <h4 className="text-center">No</h4>
                        </div>
                        <div>
                            <h4 className="text-center">Document</h4>
                        </div>
                        <div>
                            <h4 className="text-center">Uploaded</h4>
                        </div>
                        <div></div>
                        <div></div>
                    </>
                );  
            }, 1000);

            getData();

            sessionStorage.setItem('SelectedFolder', 'undefined');
            getDrive();
            setInterval(() => {
                getDrive();
            }, 1000);

            setDefaultContent();

            $('.Show_Upload_Div').hide(0);

        }, []
    )

    const getOld = () => {
        setDefaultContent();
        setShowModal( true );
    }

    const setDefaultContent = () => {

        const content = 
            <div className="Modalcontent d-flex justify-content-center">
                <button className="btn" onClick={ OpenFiles }>
                    <i className="text-white bg-dark las la-folder-open"></i>
                    <p className="mb-0">
                        Files
                    </p>
                </button>
                <button className="btn" onClick={ OpenCamera }>
                    <i className="text-white bg-primary las la-camera-retro"></i>
                    <p className="mb-0">
                        Camera
                    </p>
                </button>
            </div>

            setContent( content );

    }

    const onUploadBtnClicked = () => {

        if ( ShowModal )
        {
            setShowModal( false );
            if ( sessionStorage.getItem('SelectedFolder') === 'undefined' )
            {
                getData();
            }
        }else
        {
            setShowModal( true );
        }

    }

    const DownloadDoc = ( index ) => {
        let link = document.createElement("a");
        // If you don't know the name or want to use
        // the webserver default set name = ''
        link.setAttribute('download', 'images/drive/' + Drive[index].name);
        link.href = 'images/drive/' + Drive[index].name;
        document.body.appendChild(link);
        link.click();
        link.remove();
        setShowModal( false );
        if ( sessionStorage.getItem('SelectedFolder') === 'undefined' )
        {
            getData();
        }
    }

    const DeleteDoc = ( index, type ) => {

        const Data = new FormData();
        Data.append('driveID', type === 'document' ? Drive[index].id : Folders[index].id);
        Data.append('empID', type === 'document' ? Drive[index].emp_id : Folders[index].emp_id);
        Data.append('docName', type === 'document' ? Drive[index].name : Folders[index].name);
        Data.append('DID', sessionStorage.getItem('SelectedFolder'));

        axios.post('/deletedoc', Data).then( () => {

            toast.dark('Document Deleted', {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });

            setShowModal( false );
            setDefaultContent();
            if ( sessionStorage.getItem('SelectedFolder') === 'undefined' )
            {
                getData();
            }

        } ).catch( err => {

            console.log( err );
            toast.dark(err.toString(), {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });

        } )

    }

    const ShowPicDiv = ( index ) => {

        let content = null;

        if ( 
            Drive[index].doc_type.toLowerCase() === 'jpeg' || 
            Drive[index].doc_type.toLowerCase() === 'jpg' || 
            Drive[index].doc_type.toLowerCase() === 'png' ||
            Drive[index].doc_type.toLowerCase() === 'gif'
            )
        {
            content = <img src={ 'images/drive/' + Drive[index].name } width='100%' alt='images' />
        }else
        if ( 
            Drive[index].doc_type.toLowerCase() === 'mov' || 
            Drive[index].doc_type.toLowerCase() === 'mp4' || 
            Drive[index].doc_type.toLowerCase() === 'avi' ||
            Drive[index].doc_type.toLowerCase() === 'flv' ||
            Drive[index].doc_type.toLowerCase() === 'mpeg' ||
            Drive[index].doc_type.toLowerCase() === 'wmv' ||
            Drive[index].doc_type.toLowerCase() === 'mpg'
            )
        {
            content = <video width="100%" controls autoPlay muted>
                        <source src={ 'images/drive/' + Drive[index].name } type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
        }else
        if (Drive[index].doc_type.toLowerCase() === 'html' || Drive[index].doc_type.toLowerCase() === 'htm' || Drive[index].doc_type.toLowerCase() === 'xml') {
            content = <iframe src={ 'images/drive/' + Drive[index].name } width="100%" height="500" title="description"></iframe>
        } else

            if (Drive[index].doc_type.toLowerCase() === 'css' || Drive[index].doc_type.toLowerCase() === 'scss' || Drive[index].doc_type.toLowerCase() === 'sass' || Drive[index].doc_type.toLowerCase() === 'less') {
                content = <iframe src={ 'images/drive/' + Drive[index].name } width="100%" height="500" title="description"></iframe>
            } else

                if (Drive[index].doc_type.toLowerCase() === 'js' || Drive[index].doc_type.toLowerCase() === 'jsx') {
                    content = <iframe src={ 'images/drive/' + Drive[index].name } width="100%" height="500" title="description"></iframe>
                } else

                    if (Drive[index].doc_type.toLowerCase() === 'php') {
                        content = <iframe src={ 'images/drive/' + Drive[index].name } width="100%" height="500" title="description"></iframe>
                    } else

                        if (Drive[index].doc_type.toLowerCase() === 'pdf') {
                            content = <iframe src={ 'images/drive/' + Drive[index].name } width="100%" height="500" title="description"></iframe>
                        }else
                        {
                            content = <h4 className="text-center">Format Not Supported</h4>
                        }

        setContent(content);
        setShowModal( true );
        if ( sessionStorage.getItem('SelectedFolder') === 'undefined' )
        {
            getData();
        }

    }

    const getDrive = () => {

        const Data = new FormData();
        Data.append('empID', localStorage.getItem('EmpID'));
        Data.append('subDoc', sessionStorage.getItem('SelectedFolder'));
        axios.post('/getemployeedrive', Data).then( res => {

            setDrive( res.data );
    
        } ).catch( err => {
    
            console.log( err );
    
        } );

        axios.post('/getemployeedrivefolders', Data).then( res => {

            setFolders( res.data );
    
        } ).catch( err => {
    
            console.log( err );
    
        } );

    }

    const OpenCamera = () => {

        const content = 
            <div>
                <Webcam
                    audio={false}
                    screenshotFormat="image/jpeg"
                    ref={refs}
                    videoConstraints={videoConstraints}
                    imageSmoothing
                    forceScreenshotSourceSize="true"
                />
                <button className="btn btn-dark btn-block mt-3" onClick={ takePhoto }>TAKE YOUR PHOTO</button>
            </div>

        setContent( content );

    }

    const OpenFiles = () => {

        $('.Employee_Drive .docuploads').trigger('click');
        
    }
    
    const onFilesSelection = ( event ) => {
        const reader = new FileReader();
        
        reader.onload = () => {
            setStartLoading( true );

            if( reader.readyState === 2 )
            {

                setFiles(
                    {
                        file: event.target.files[0],
                        name: event.target.files[0].name
                    }
                );

                const Data = new FormData();
                Data.append('File', event.target.files[0]);
                Data.append('FileName', event.target.files[0].name);
                Data.append('employee_name', localStorage.getItem('name'));
                Data.append('empId', localStorage.getItem('EmpID'));
                Data.append('DriveID', sessionStorage.getItem('SelectedFolder'));

                axios.post('/uploaddocuments', Data, { headers: { 'content-type': 'multipart/form-data' } }).then(() => {
    
                    setDefaultContent();
                    setShowModal(false);
                    setStartLoading( false );
                    toast.dark('Document Uploaded', {
                        position: 'top-right',
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });

                }).catch(err => {

                    console.log(err);
                    setDefaultContent();
                    setShowModal(false);
                    setStartLoading( false );

                    toast.dark(err.toString(), {
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

        if ( event.target.files[0] ) {
            reader.readAsDataURL( event.target.files[0] );
        }
        

    }

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
    
        var blob = new Blob(byteArrays, {type: contentType});
        return blob;
    }

    const takePhoto = () => {

        var screenshot = refs.current.getScreenshot();

        let block = screenshot.split(";");
        var contentType = block[0].split(":")[1];
        var realData = block[1].split(",")[1];
        var blob = b64toBlob(realData, contentType);

        const d = new Date();

        let ImageCurrentName = d.getDate().toString() + '-' + ( d.getMonth() + 1 ).toString() + '-' + d.getFullYear().toString() + '_at_' + d.getHours() + d.getMinutes() + d.getSeconds();

        const val = {
            ...ImageData,
            imageName: ImageCurrentName,
            image: blob,
            extension: screenshot.split('/')[1].split(';')[0]
        }
        setImageData( val );
        onUpload(val);

    }

    const onUpload = ( data ) => {

        const content = 
        <div className="w-100 d-flex align-items-center justify-content-center" style={ { height: '200px' } }>
            <img src={ LoadImg } width="60" height='60' alt='loading...' />
        </div>

        setContent( content );

        const Data = new FormData();
        Data.append('docName', data.imageName);
        Data.append('docs', data.image);
        Data.append('empId', localStorage.getItem('EmpID'));
        Data.append('MyDocs', data.image);
        Data.append('docsExtension', data.extension);
        Data.append('employee_name', localStorage.getItem('name'));
        Data.append('DriveID', sessionStorage.getItem('SelectedFolder'));

        if ( sessionStorage.getItem('SelectedFolder') === 'undefined' )
        {
            axios.post('/uploaddocument', Data, { headers: { 'content-type': 'multipart/form-data' } }).then( () => {
    
                setDefaultContent();
                setShowModal( false );
    
            } ).catch( err => {
    
                console.log( err );
                setDefaultContent();
                setShowModal( false );
    
            } );
        }else
        {
            axios.post('/uploadsubdocs', Data, { headers: { 'content-type': 'multipart/form-data' } }).then( () => {
    
                setDefaultContent();
                setShowModal( false );
    
            } ).catch( err => {
    
                console.log( err );
                setDefaultContent();
                setShowModal( false );
    
            } );
        }

    }

    const NewFolder = () => {

        const content = 
        <div className="w-100">
            <form onSubmit={ createNewFolder }>
                <input name="folderName" type="text" required className="form-control mb-3" style={ { fontSize: '12px' } } placeholder="Enter the folder name" />
                <button type="submit" className="d-block ml-auto btn btn-primary" style={ { fontSize: '12px' } }>Create</button>
            </form>
        </div>

        setContent( content );
        setShowModal( true );

    }

    const createNewFolder = ( e ) => {

        e.preventDefault();
        let inputValue = e.target['folderName'].value;

        const Data = new FormData();
        Data.append('foldername', inputValue);
        Data.append('empId', localStorage.getItem('EmpID'));

        axios.post('/createnewfolder', Data).then( () => {

            setDefaultContent();
            setShowModal( false );

        } ).catch( err => {

            console.log( err );
            setDefaultContent();
            setShowModal( false );

        } );

    }

    const getData = () => {

        setData(
            [
                {
                    icon: 'las la-cloud-upload-alt',
                    txt: 'Upload',
                    link: false,
                    func: () => getOld()
                },
                {
                    icon: 'las la-cloud-upload-alt',
                    txt: 'New Folder',
                    link: false,
                    func: () => NewFolder()
                }
            ]
        );

    }

    const ShowChangesMenuDiv1 = (classnm) => {
        
        $('.Show_Changes_Menu').hide(300);
        
        if ( $('.' + classnm).css('display') === 'none' )
        {
            $('.' + classnm).show(300);
        }else
        {
            $('.' + classnm).hide(300);
        }
    }

    const MoveDoc = ( index ) => {

        const content = 
            <div className="Employee_Drive_Grid Employee_Drive_GridForModal">
                {
                    Folders.length === 0
                        ?
                        null
                        :
                        Folders.map(
                            (val, i) => {

                                return (
                                    <>
                                        <div className="Div1 d-flex p-3 align-items-center justify-content-start" onClick={ () => MoveDocToSelectedFolder( index, val.id ) }>
                                            <div className='d-flex align-items-center'>
                                                <i className="las la-wallet"></i> <p className="font-weight-bold"> {val.name} </p>
                                            </div>
                                        </div>
                                    </>
                                )

                            }
                        )
                }
            </div>

        setContent( content );
        setShowModal( true );

    }

    const MoveDocToSelectedFolder = ( index, id ) => {

        const Data = new FormData();
        Data.append('driveID', Drive[index].id);
        Data.append('folderID', id);
        axios.post('/movedoctofolder', Data).then( () => {

            setDefaultContent();
            setShowModal( false );
            toast.dark('Document moved'.toString(), {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });

        } ).catch( err => {

            console.log( err );
            setDefaultContent();
            setShowModal( false );

        } );

    }

    const OpenFolder = ( index ) => {

        sessionStorage.setItem('SelectedFolder', index);
        setTimeout(() => {
            setData(
                [
                    {
                        icon: 'las la-cloud-upload-alt',
                        txt: 'Upload',
                        link: false,
                        func: () => getOld()
                    },
                    {
                        icon: 'las la-share',
                        txt: 'Back',
                        link: false,
                        func: () => backToMain()
                    }
                ]
            );
        }, 500);

    }
    
    const backToMain = () => {

        sessionStorage.setItem('SelectedFolder', 'undefined');
        setTimeout(() => {
            setData(
                [
                    {
                        icon: 'las la-cloud-upload-alt',
                        txt: 'Upload',
                        link: false,
                        func: () => getOld()
                    },
                    {
                        icon: 'las la-cloud-upload-alt',
                        txt: 'New Folder',
                        link: false,
                        func: () => NewFolder()
                    }
                ]
            );
        }, 500);

    }

    return (
        <>
            <Menu data={ Data } />
            <LoadingUI display={ StartLoading } />
            <div className="Employee_Drive">
                <input type='file' name='docuploads' className="form-control d-none docuploads" onChange={ onFilesSelection } multiple  />
                <Modal show={ ShowModal } Hide={ onUploadBtnClicked } content={ Content } />
                <>
                    {
                        Folders.length > 0
                            ?
                            <>
                                <h5 className="pt-2">Folders</h5>
                                <div className="Employee_Drive_Grid folders">
                                    {
                                        Folders.length === 0
                                            ?
                                            null
                                            :
                                            Folders.map(
                                                (val, index) => {

                                                    return (
                                                        <>
                                                            <div className="Div1 d-flex p-3 align-items-center justify-content-between">
                                                                <div className='d-flex align-items-center'>
                                                                    <i className="las la-wallet"></i> <p className="font-weight-bold"> {val.name} </p>
                                                                </div>
                                                                <div className="Drive_Icon">
                                                                    <i className="las la-ellipsis-v mr-0"
                                                                        onClick={() => ShowChangesMenuDiv1("Show_Changes_Menu-1" + index)}
                                                                    ></i>
                                                                    <div
                                                                        style={{ top: '5%', right: '100%', width: '150px' }}
                                                                        className={"Show_Changes_Menu Show_Changes_Menu-1" + index}>
                                                                        <div className="DropDown_Drive_Menu">
                                                                            <div className="d-flex align-items-center my-2 px-3 py-1" onClick={() => OpenFolder(val.id)}>
                                                                                <i className="las la-share"></i>
                                                                                <p>Open</p>
                                                                            </div>
                                                                            <div className="d-flex align-items-center my-2 px-3 py-1" onClick={() => DeleteDoc(index, 'folder')}>
                                                                                <i className="las la-trash-alt"></i>
                                                                                <p>Delete</p>
                                                                            </div>
                                                                            {/* <div className="d-flex align-items-center my-2 px-3 py-1">
                                                                                        <i className="las la-remove-format"></i>
                                                                                        <p>Rename</p>
                                                                                    </div> */}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                        </>
                                                    )

                                                }
                                            )
                                    }
                                </div>
                            </>
                            :
                            null
                    }
                    <h5 className="pt-2">Files</h5>
                    <div className="Employee_Drive_Grid" >
                        {
                            Drive.length === 0
                                ?
                                <>
                                    {
                                        Loading
                                    }
                                </>
                                :
                                Drive.map(
                                    (val, index) => {

                                        let icon = null;
                                        let title = null;

                                        if (val.doc_type) {
                                            if (
                                                val.doc_type.toLowerCase() === 'jpeg' ||
                                                val.doc_type.toLowerCase() === 'jpg' ||
                                                val.doc_type.toLowerCase() === 'png' ||
                                                val.doc_type.toLowerCase() === 'gif'
                                            ) {
                                                icon = <i className="lar la-image"></i>
                                                title = <img src={
                                                    val.doc_type ?
                                                        val.doc_type.toLowerCase() === 'jpeg' ||
                                                            val.doc_type.toLowerCase() === 'jpg' ||
                                                            val.doc_type.toLowerCase() === 'png' ||
                                                            val.doc_type.toLowerCase() === 'gif'
                                                            ?
                                                            ('images/drive/' + val.name)
                                                            :
                                                            InsteadImg
                                                        :
                                                        null
                                                }
                                                    alt="Image1"
                                                />
                                            } else

                                                if (
                                                    val.doc_type.toLowerCase() === 'psd' ||
                                                    val.doc_type.toLowerCase() === 'ai' ||
                                                    val.doc_type.toLowerCase() === 'svg' ||
                                                    val.doc_type.toLowerCase() === 'tiff'
                                                ) {
                                                    icon = <i className="lab la-adobe"></i>
                                                    title = <img src={
                                                        val.doc_type ?
                                                            val.doc_type.toLowerCase() === 'jpeg' ||
                                                                val.doc_type.toLowerCase() === 'jpg' ||
                                                                val.doc_type.toLowerCase() === 'png' ||
                                                                val.doc_type.toLowerCase() === 'gif'
                                                                ?
                                                                ('images/drive/' + val.name)
                                                                :
                                                                InsteadImg
                                                            :
                                                            null
                                                    }
                                                        alt="Image1"
                                                    />
                                                } else

                                                    if (val.doc_type.toLowerCase() === 'html' || val.doc_type.toLowerCase() === 'htm' || val.doc_type.toLowerCase() === 'xml') {
                                                        icon = <i className="lar la-file-code"></i>
                                                        title = <iframe src={'images/drive/' + val.name} width="100%" height="500" title="description"></iframe>
                                                    } else

                                                        if (val.doc_type.toLowerCase() === 'css' || val.doc_type.toLowerCase() === 'scss' || val.doc_type.toLowerCase() === 'sass' || val.doc_type.toLowerCase() === 'less') {
                                                            icon = <i className="lab la-css3"></i>
                                                            title = <iframe src={'images/drive/' + val.name} width="100%" height="500" title="description"></iframe>
                                                        } else

                                                            if (val.doc_type.toLowerCase() === 'js' || val.doc_type.toLowerCase() === 'jsx') {
                                                                icon = <i className="lab la-node-js"></i>
                                                                title = <iframe src={'images/drive/' + val.name} width="100%" height="500" title="description"></iframe>
                                                            } else

                                                                if (val.doc_type.toLowerCase() === 'php') {
                                                                    icon = <i className="lab la-php"></i>
                                                                    title = <iframe src={'images/drive/' + val.name} width="100%" height="500" title="description"></iframe>
                                                                } else

                                                                    if (val.doc_type.toLowerCase() === 'pdf') {
                                                                        icon = <i className="las la-file-pdf"></i>
                                                                        title = <iframe src={'images/drive/' + val.name} width="100%" height="500" title="description"></iframe>
                                                                    } else

                                                                        if (
                                                                            val.doc_type.toLowerCase() === 'docx' ||
                                                                            val.doc_type.toLowerCase() === 'doc' ||
                                                                            val.doc_type.toLowerCase() === 'docm' ||
                                                                            val.doc_type.toLowerCase() === 'dotx' ||
                                                                            val.doc_type.toLowerCase() === 'dot'

                                                                        ) {
                                                                            icon = <i className="las la-file-word"></i>
                                                                            title = <img src={
                                                                                val.doc_type ?
                                                                                    val.doc_type.toLowerCase() === 'jpeg' ||
                                                                                        val.doc_type.toLowerCase() === 'jpg' ||
                                                                                        val.doc_type.toLowerCase() === 'png' ||
                                                                                        val.doc_type.toLowerCase() === 'gif'
                                                                                        ?
                                                                                        ('images/drive/' + val.name)
                                                                                        :
                                                                                        InsteadImg
                                                                                    :
                                                                                    null
                                                                            }
                                                                                alt="Image1"
                                                                            />
                                                                        } else

                                                                            if (
                                                                                val.doc_type.toLowerCase() === 'xlsx' ||
                                                                                val.doc_type.toLowerCase() === 'xlsm' ||
                                                                                val.doc_type.toLowerCase() === 'xltx' ||
                                                                                val.doc_type.toLowerCase() === 'xls' ||
                                                                                val.doc_type.toLowerCase() === 'xla'

                                                                            ) {
                                                                                icon = <i className="las la-file-excel"></i>
                                                                                title = <img src={
                                                                                    val.doc_type ?
                                                                                        val.doc_type.toLowerCase() === 'jpeg' ||
                                                                                            val.doc_type.toLowerCase() === 'jpg' ||
                                                                                            val.doc_type.toLowerCase() === 'png' ||
                                                                                            val.doc_type.toLowerCase() === 'gif'
                                                                                            ?
                                                                                            ('images/drive/' + val.name)
                                                                                            :
                                                                                            InsteadImg
                                                                                        :
                                                                                        null
                                                                                }
                                                                                    alt="Image1"
                                                                                />
                                                                            } else

                                                                                if (
                                                                                    val.doc_type.toLowerCase() === 'mov' ||
                                                                                    val.doc_type.toLowerCase() === 'mp4' ||
                                                                                    val.doc_type.toLowerCase() === 'avi' ||
                                                                                    val.doc_type.toLowerCase() === 'flv' ||
                                                                                    val.doc_type.toLowerCase() === 'mpeg' ||
                                                                                    val.doc_type.toLowerCase() === 'wmv' ||
                                                                                    val.doc_type.toLowerCase() === 'mpg'
                                                                                ) {
                                                                                    icon = <i className="las la-video"></i>
                                                                                    title = <video width="100%">
                                                                                        <source src={'images/drive/' + val.name} type="video/mp4" />
                                                                                        Your browser does not support the video tag.
                                                                                    </video>
                                                                                } else {
                                                                                    icon = <i className="las la-file"></i>
                                                                                    title = <img src={
                                                                                        val.doc_type ?
                                                                                            val.doc_type.toLowerCase() === 'jpeg' ||
                                                                                                val.doc_type.toLowerCase() === 'jpg' ||
                                                                                                val.doc_type.toLowerCase() === 'png' ||
                                                                                                val.doc_type.toLowerCase() === 'gif'
                                                                                                ?
                                                                                                ('images/drive/' + val.name)
                                                                                                :
                                                                                                InsteadImg
                                                                                            :
                                                                                            null
                                                                                    }
                                                                                        alt="Image1"
                                                                                    />
                                                                                }
                                        }

                                        return (
                                            <>
                                                <div className="Div1" key={index} style={{ animationDelay: (0 + '.' + index).toString() + 's' }}>
                                                    <div className="Div1_IMG" onClick={() => ShowPicDiv(index)}>
                                                        {
                                                            title
                                                        }
                                                    </div>
                                                    <div className="Employee_Drive_Text">
                                                        <div>
                                                            <div className="pr-lg-2 pr-md-2 pr-sm-0">
                                                                {
                                                                    icon
                                                                }
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <p className="font-weight-bold mb-0"> {val.name ? val.name.split('/').pop().substring(0, 35) : null} </p>
                                                        </div>
                                                        <div className="Drive_Icon">
                                                            <i className="las la-ellipsis-v mr-0"
                                                                onClick={() => ShowChangesMenuDiv1("Show_Changes_Menu1" + index)}
                                                            ></i>
                                                            <div className={"Show_Changes_Menu Show_Changes_Menu1" + index}>
                                                                <div className="DropDown_Drive_Menu">
                                                                    <div className="d-flex align-items-center my-2 px-3 py-1" onClick={() => ShowPicDiv(index)}>
                                                                        <i class="las la-expand-arrows-alt"></i>
                                                                        <p>Preview</p>
                                                                    </div>
                                                                    {/* <div className="d-flex align-items-center my-2 px-3 py-1">
                                                                            <i className="las la-share"></i>
                                                                            <p>Share</p>
                                                                        </div> */}
                                                                    <div className="d-flex align-items-center my-2 px-3 py-1" onClick={() => DownloadDoc(index)}>
                                                                        <i class="las la-arrow-circle-down"></i>
                                                                        <p>Download</p>
                                                                    </div>
                                                                    <div className="d-flex align-items-center my-2 px-3 py-1" onClick={() => DeleteDoc(index, 'document')}>
                                                                        <i className="las la-trash-alt"></i>
                                                                        <p>Delete</p>
                                                                    </div>
                                                                    <div className="d-flex align-items-center my-2 px-3 py-1" onClick={() => MoveDoc(index)}>
                                                                        <i className="las la-suitcase-rolling"></i>
                                                                        <p>Move</p>
                                                                    </div>
                                                                    {/* <div className="d-flex align-items-center my-2 px-3 py-1">
                                                                            <i className="las la-remove-format"></i>
                                                                            <p>Rename</p>
                                                                        </div> */}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        )

                                    }
                                )
                        }
                    </div>
                </>
            </div>
            <ToastContainer />
        </>
    )
}
export default Employee_Drive;
