import React, { useEffect, useState } from 'react';
import './InvtrySubAssets.css';

import axios from '../../../../../../../axios';
import $ from 'jquery';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const InvtrySubAssets = () => {

    const [ SubAssets, setSubAssets ] = useState([]);
    const [ AssetCode, setAssetCode ] = useState();
    const [ SubAsset, setSubAsset ] = useState(
        {
            SAstName: '', editSAstName: '', editID: 0, SAstCode: '', editSAstCode: ''
        }
    );

    useEffect(
        () => {

            let assetCode = window.location.href.split('/').pop();
            setAssetCode( assetCode );

            GetAllSubAssets( assetCode );
            setInterval(() => {
                GetAllSubAssets( assetCode );
            }, 1000);

    }, []);

    const GetAllSubAssets = ( code ) => {

        const Data = new FormData();
        Data.append('AssetCode', code);
        axios.post('/getallsubinvtryassets', Data).then(res => {

            setSubAssets(res.data);

        }).catch(err => {

            toast.dark(err, {
                    position: 'top-right',
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });;

        });
    }

    // Call on change function to store input field data into usestate()
    const OnChangeHandler = ( e ) => {

        const { name, value } = e.target;
        const setValues = {
            ...SubAsset,
            [name]: value
        }

        setSubAsset(setValues);

    }

    const OnAddSubAsset = ( e ) => {
        e.preventDefault();

        const Data = new FormData();
        Data.append('SubAssetName', SubAsset.SAstName);
        Data.append('SubAssetCode', SubAsset.SAstCode);
        Data.append('AssetCode', AssetCode);
        axios.post('/addinvtrysubasset', Data).then( () => {

            GetAllSubAssets( AssetCode );

            setSubAsset(
                {
                    SAstName: '', editSAstName: '', editID: 0, SAstCode: '', editSAstCode: ''
                }
            )

        } ).catch( err => {

            toast.dark( err , {
                    position: 'top-right',
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });;

        } );
    }

    const OnEdit = ( id, indexx ) => {

        let category = SubAssets.filter(
            (val, index, arr) => {
                return index === indexx;
            }
        );

        const setValues = {
            ...SubAsset,
            editSAstName: category[0].sub_asset_name,
            editSAstCode: category[0].sub_asset_code,
            editID: id
        }

        setSubAsset(setValues);

        $('.editModalBtn').trigger('click');

    }

    const OnDelete = ( id ) => {

        const Data = new FormData();
        Data.append('EditCtgryID', id);
        axios.post('/deleteinvtrysubasset', Data).then( () => {

            toast.dark('Sub Asset Deleted', {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            GetAllSubAssets( AssetCode );

            setSubAsset(
                {
                    SAstName: '', editSAstName: '', editID: 0, SAstCode: '', editSAstCode: ''
                }
            );

        } ).catch( err => {

            toast.dark( err , {
                    position: 'top-right',
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });;

        } );
        
    }

    const updateSubAsset = ( id ) => {

        const Data = new FormData();
        Data.append('EditAstName', SubAsset.editSAstName);
        Data.append('EditAstCode', SubAsset.editSAstCode);
        Data.append('EditAstID', id);
        axios.post('/updateinvtrysubasset', Data).then( () => {

            GetAllSubAssets( AssetCode );

            setSubAsset(
                {
                    SAstName: '', editSAstName: '', editID: 0, SAstCode: '', editSAstCode: ''
                }
            );
            toast.dark('Sub Asset Updated', {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });

        } ).catch( err => {

            toast.dark( err , {
                    position: 'top-right',
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });;

        } );

    }

    return (
        <>
            <ToastContainer />
            <div className="InvtrySubAssets_box">
                <div className="InvtrySubAssets_Header">
                    <div className="InvtrySubAssets_Details">
                        <h3 className="mb-4"> Add New Sub Asset </h3>
                        <form onSubmit={ OnAddSubAsset } autocomplete="off">
                            <input type="text" value={ SubAsset.SAstName } placeholder="Sub Asset Name" onChange={ OnChangeHandler } className="form-control" name="SAstName" pattern="[a-zA-Z][a-zA-Z\s]*" minLength="3" required />
                            <input type="text" value={ SubAsset.SAstCode } placeholder="Sub Asset Code" onChange={ OnChangeHandler } className="form-control" name="SAstCode" pattern="^[0-9]+$" required />
                            <button type="submit" className="form-control btn btn-primary">+ Add Sub Asset</button>
                        </form>
                    </div>
                </div>
                <div className="InvtrySubAssets_Right">
                    <div className="InvtrySubAssets_Details">
                        <h3 className="mb-4"> All Sub Assets </h3>
                        <div className="lists">
                            {
                                SubAssets.length === 0
                                    ?
                                    <h3 className="text-center mb-0">No Sub Asset Found</h3>
                                    :
                                    SubAssets.map(
                                        (val, index) => {
                                            return (
                                                <div className="one" key={index}>
                                                    <div className="d-flex">
                                                        <div className="d-flex justify-content-center align-items-center">
                                                            <img src={'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThLP6xJXBY_W2tT5waakogfnpHk4uhpVTy7A&usqp=CAU'} alt="Image" />
                                                        </div>
                                                        <div className="d-flex align-items-center">
                                                            <div>
                                                                <p className="mb-0 font-weight-bold">Name</p>
                                                                <p className="mb-0">{ val.sub_asset_name }</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="d-flex align-items-center Text">
                                                        <div>
                                                            <p className="mb-0 font-weight-bold">Code</p>
                                                            <p className="mb-0">{ val.sub_asset_code }</p>
                                                        </div>
                                                    </div>
                                                    <div className="ShowOnHover">
                                                        <i onClick={() => OnEdit(val.sub_asset_id, index)} title="Edit" className="lar la-edit"></i>
                                                        <i onClick={() => OnDelete(val.sub_asset_id)} title="Delete" className="las la-trash"></i>
                                                    </div>
                                                </div>
                                            )
                                        }
                                    )
                            }
                        </div>
                    </div>
                </div>
                <button type="button" className="btn btn-primary d-none editModalBtn" data-toggle="modal" data-target="#AssetModal">
                    Launch demo modal
                </button>
                <div className="modal fade" id="AssetModal" role="dialog" aria-labelledby="AssetModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content">
                            <div className="modal-body">
                                <input type="text" value={SubAsset.editSAstName} className="form-control mb-3" placeholder="Sub Asset Name" name="editSAstName" onChange={OnChangeHandler} required />
                                <input type="text" value={SubAsset.editSAstCode} className="form-control mb-3" placeholder="Sub Asset Code" name="editSAstCode" onChange={OnChangeHandler} required />
                                <button type='button' data-dismiss="modal" className="btn btn-primary d-block ml-auto text-white" onClick={() => updateSubAsset(SubAsset.editID)}>Update Asset</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default InvtrySubAssets;