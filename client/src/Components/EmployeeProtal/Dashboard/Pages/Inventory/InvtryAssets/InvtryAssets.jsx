import React, { useEffect, useState } from 'react';

import { useHistory } from 'react-router-dom';

import './InvtryAssets.css';
import axios from '../../../../../../axios';
import $ from 'jquery';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const InvtryAssets = () => {

    const history = useHistory();

    const [ Asset, setAsset ] = useState(
        {
            AstName: '', editAstName: '', editID: 0, AstCode: '', editAstCode: ''
        }
    );
    const [ Categories, setCategories ] = useState([]);

    useEffect(
        () => {

            GetAllCategories();

        }, []
    )

    // Call on change function to store input field data into usestate()
    const OnChangeHandler = ( e ) => {

        const { name, value } = e.target;
        const setValues = {
            ...Asset,
            [name]: value
        }

        setAsset(setValues);

    }

    const GetAllCategories = () => {

        axios.get('/getallinvtryassets').then( response => {

            setCategories( response.data );

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

    const OnAddCategory = ( e ) => {
        e.preventDefault();

        const Data = new FormData();
        Data.append('AssetName', Asset.AstName);
        Data.append('AssetCode', Asset.AstCode);
        axios.post('/addinvtryasset', Data).then( () => {

            GetAllCategories();

            setAsset(
                {
                    AstName: '', editAstName: '', editID: 0, AstCode: ''
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

        let category = Categories.filter(
            (val, index, arr) => {
                return index === indexx;
            }
        );

        const setValues = {
            ...Asset,
            editAstName: category[0].asset_name,
            editAstCode: category[0].asset_code,
            editID: id
        }

        setAsset(setValues);
        $('.editModalBtn').trigger('click');

    }

    const OnDelete = ( id ) => {

        const Data = new FormData();
        Data.append('EditCtgryID', id);
        axios.post('/deleteinvtryasset', Data).then( () => {

            GetAllCategories();

            setAsset(
                {
                    AstName: '', editAstName: '', editID: 0
                }
            );
            toast.dark('Asset Deleted', {
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

    const updateCategory = ( id ) => {

        const Data = new FormData();
        Data.append('EditAstName', Asset.editAstName);
        Data.append('EditAstCode', Asset.editAstCode);
        Data.append('EditAstID', id);
        axios.post('/updateinvtryasset', Data).then( () => {

            GetAllCategories();

            setAsset(
                {
                    AstName: '', editAstName: '', editID: 0
                }
            );
            toast.dark('Asset Updated', {
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

    const GoToSubAssets = ( id ) => {

        history.replace('/invtry_assets/invtrysubassets/' + id);

    }

    return (
        <>
            <ToastContainer />
            <div className="InventoryAssets_Box">
                <div className="InventoryAssets_Details">
                    <h3 className="mb-4"> All Assets </h3>
                    <div className="lists">
                        {
                            Categories.length === 0
                                ?
                                <h3 className="text-center mb-0">No Asset Found</h3>
                                :
                                Categories.map(
                                    (val, index) => {
                                        return (
                                            <div className="one" key={ index }>
                                                <div className="d-flex">
                                                    <div className="d-flex justify-content-center align-items-center">
                                                        <img src={'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThLP6xJXBY_W2tT5waakogfnpHk4uhpVTy7A&usqp=CAU'} alt="Image" />
                                                    </div>
                                                    <div className="d-flex align-items-center">
                                                        <div>
                                                            <p className="mb-0 font-weight-bold">Name</p>
                                                            <p className="mb-0">{val.asset_name}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="d-flex align-items-center Text">
                                                    <div>
                                                        <p className="mb-0 font-weight-bold">Code</p>
                                                        <p className="mb-0">{val.asset_code}</p>
                                                    </div>
                                                </div>
                                                <div className="ShowOnHover">
                                                    <i onClick={() => GoToSubAssets(val.asset_id)} title="Add Sub Asset" className="las la-plus"></i>
                                                    <i onClick={() => OnEdit(val.asset_id, index)} title="Edit" className="lar la-edit"></i>
                                                    <i onClick={() => OnDelete(val.asset_id)} title="Delete" className="las la-trash"></i>
                                                </div>
                                            </div>
                                        )
                                    }
                                )
                        }
                    </div>
                </div>
                <div className="InventoryAssets_Right">
                    <div className="Btn5">
                        <button type="button" class="btn">New Asset</button>
                        <div className="NewAssetForm">
                            <h4 className="mb-3">
                                Add New Asset
                            </h4>
                            <form onSubmit={ OnAddCategory } autocomplete="off">
                                <input type="text" value={ Asset.AstName } className="form-control mb-3" placeholder="Asset Name" name="AstName" onChange={ OnChangeHandler } required />
                                <input type="text" value={ Asset.AstCode } className="form-control mb-3" placeholder="Asset Code" name="AstCode" onChange={ OnChangeHandler } required />
                                <button className="btn d-block ml-auto" type="submit">Add Asset</button>
                            </form>
                        </div>
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
                            <input type="text" value={Asset.editAstName} className="form-control mb-3" placeholder="Asset Name" name="editAstName" onChange={OnChangeHandler} pattern="[a-zA-Z][a-zA-Z\s]*" minLength="3" required />
                            <input type="text" value={Asset.editAstCode} className="form-control mb-3" placeholder="Asset Code" name="editAstCode" onChange={OnChangeHandler} pattern="^[0-9]+$" required />
                            <button data-dismiss="modal" className="btn btn-primary d-block ml-auto text-white" onClick={() => updateCategory(Asset.editID)}>Update Asset</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )

}

export default InvtryAssets;