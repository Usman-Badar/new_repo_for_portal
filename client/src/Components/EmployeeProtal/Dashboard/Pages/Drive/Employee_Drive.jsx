/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState, lazy, Suspense, useMemo } from 'react';
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

const EmpFolders = lazy( () => import('./Folders/Folders') );
const EmpFiles = lazy( () => import('./Files/Files') );

const Employee_Drive = () => {

    const refs = useRef();

    const videoConstraints = {
        width: '100% !important',
        facingMode: 'environment'
    }

    const options = {
        onUploadProgress: (progressEvent) => {
            const {loaded, total} = progressEvent
            let percent = Math.floor(loaded * 100 / total)
            setProgress(percent);
        },
    }

    const [ StartLoading, setStartLoading ] = useState( false );
    const [ Data, setData ] = useState([]);
    const [ Drive, setDrive ] = useState([]);
    const [ Folders, setFolders ] = useState([]);
    const [ ShowModal, setShowModal ] = useState(false);
    const [ Loading, setLoading ] = useState(<></>);
    const [ Content, setContent ] = useState();
    const [ progress, setProgress ] = useState(0);
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
            sessionStorage.setItem('FolderName', 'undefined');
            getDrive();

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
        link.setAttribute('download', process.env.REACT_APP_SERVER+'/images/drive/' + Drive[index].name);
        link.href = process.env.REACT_APP_SERVER+'/images/drive/' + Drive[index].name;
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

        setTimeout(() => {
            getDrive();
        }, 1000);
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
            content = <img src={ process.env.REACT_APP_SERVER+'/images/drive/' + Drive[index].name } width='100%' alt='images' />
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
                        <source src={ process.env.REACT_APP_SERVER+'/images/drive/' + Drive[index].name } type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
        }else
        if (Drive[index].doc_type.toLowerCase() === 'html' || Drive[index].doc_type.toLowerCase() === 'htm' || Drive[index].doc_type.toLowerCase() === 'xml') {
            content = <iframe src={ process.env.REACT_APP_SERVER+'/images/drive/' + Drive[index].name } width="100%" height="500" title="description"></iframe>
        } else

            if (Drive[index].doc_type.toLowerCase() === 'css' || Drive[index].doc_type.toLowerCase() === 'scss' || Drive[index].doc_type.toLowerCase() === 'sass' || Drive[index].doc_type.toLowerCase() === 'less') {
                content = <iframe src={ process.env.REACT_APP_SERVER+'/images/drive/' + Drive[index].name } width="100%" height="500" title="description"></iframe>
            } else

                if (Drive[index].doc_type.toLowerCase() === 'js' || Drive[index].doc_type.toLowerCase() === 'jsx') {
                    content = <iframe src={ process.env.REACT_APP_SERVER+'/images/drive/' + Drive[index].name } width="100%" height="500" title="description"></iframe>
                } else

                    if (Drive[index].doc_type.toLowerCase() === 'php') {
                        content = <iframe src={ process.env.REACT_APP_SERVER+'/images/drive/' + Drive[index].name } width="100%" height="500" title="description"></iframe>
                    } else

                        if (Drive[index].doc_type.toLowerCase() === 'pdf') {
                            content = <iframe src={ process.env.REACT_APP_SERVER+'/images/drive/' + Drive[index].name } width="100%" height="500" title="description"></iframe>
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
                <button className="btn btn-dark btn-block mt-3" onClick={ takePhoto }>TAKE PHOTO</button>
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

                let arr = [];

                for ( let x= 0; x < event.target.files.length; x++ )
                {
                    arr.push( 
                        {
                            file: event.target.files[x],
                            name: event.target.files[x].name
                        }
                     );
                }

                const Data = new FormData();
                Data.append('File', event.target.files[0]);
                Data.append('FileName', event.target.files[0].name);
                Data.append('employee_name', localStorage.getItem('name'));
                Data.append('empId', localStorage.getItem('EmpID'));
                Data.append('DriveID', sessionStorage.getItem('SelectedFolder'));
                Data.append('FolderName', sessionStorage.getItem('FolderName'));
                arr.forEach(file => {
                    Data.append("Attachments", file.file);
                });

                axios.post('/uploaddocuments', Data, {

                    headers: {
                        "Content-Type": "multipart/form-data"
                    }

                }).then(() => {
    
                    setDefaultContent();
                    setShowModal(false);
                    setStartLoading( false );
                    getDrive();
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
    
    console.log(progress)

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
        Data.append('FolderName', sessionStorage.getItem('FolderName'));

        if ( sessionStorage.getItem('SelectedFolder') === 'undefined' )
        {
            axios.post('/uploaddocument', Data, { headers: { 'content-type': 'multipart/form-data' } }).then( () => {
    
                setDefaultContent();
                setShowModal( false );
                getDrive();
    
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
                getDrive();
    
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
        Data.append('employee_name', localStorage.getItem('name'));

        axios.post('/createnewfolder', Data).then( () => {

            setDefaultContent();
            setShowModal( false );
            getDrive();

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
                                        <div className="Div1 d-flex p-2 align-items-center justify-content-start" onClick={ () => MoveDocToSelectedFolder( index, val.id, val.name ) }>
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

    const MoveDocToSelectedFolder = ( index, id, name ) => {

        const Data = new FormData();
        Data.append('driveID', Drive[index].id);
        Data.append('driveName', Drive[index].name);
        Data.append('folderName', name);
        Data.append('folderID', id);
        Data.append('employee_name', localStorage.getItem('name'));
        Data.append('EmpID', localStorage.getItem('EmpID'));
        axios.post('/movedoctofolder', Data).then( () => {

            setDefaultContent();
            setShowModal( false );
            getDrive();
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

    const OpenFolder = ( index, name ) => {

        sessionStorage.setItem('SelectedFolder', index);
        sessionStorage.setItem('FolderName', name);
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
        getDrive();

    }
    
    const backToMain = () => {

        sessionStorage.setItem('SelectedFolder', 'undefined');
        sessionStorage.setItem('FolderName', 'undefined');
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
        getDrive();

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
                        useMemo(
                            () => {

                                return (
                                    <Suspense fallback={ <p className="my-3">Loading Folders....</p> }>
                                        <EmpFolders 
                                            Folders={ Folders }
                                            OpenFolder={ OpenFolder }
                                            ShowChangesMenuDiv1={ ShowChangesMenuDiv1 }
                                            DeleteDoc={ DeleteDoc }
                                        />
                                    </Suspense>
                                )

                            }, [ Folders ]
                        )
                    }

                    {
                        useMemo(
                            () => {

                                return (
                                    <Suspense fallback={ <p className="my-3">Loading Files....</p> }>
                                        <EmpFiles 
                                            Drive={ Drive }
                                            Loading={ Loading }
                                            ShowPicDiv={ ShowPicDiv }
                                            ShowChangesMenuDiv1={ ShowChangesMenuDiv1 }
                                            DownloadDoc={ DownloadDoc }
                                            DeleteDoc={ DeleteDoc }
                                            MoveDoc={ MoveDoc }
                                        />
                                    </Suspense>
                                )

                            }, [ Drive, Loading ]
                        )
                    }

                    
                </>
            </div>
            <ToastContainer />
        </>
    )
}
export default Employee_Drive;
