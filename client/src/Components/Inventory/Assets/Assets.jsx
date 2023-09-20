/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import './Assets.css';


import { NavLink } from 'react-router-dom';
import axios from "../../../axios";
import $ from 'jquery';

import ReactTooltip from 'react-tooltip';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Assets = () => {

    const [EditView, setEditView] = useState(false);
    const [ShowBtns, setShowBtns] = useState(false);
    const [AssetsList, setAssetsList] = useState([]);
    const [ CheckedAsset, setCheckedAsset ] = useState(
        {
            asset_id: '',
            asset_code: '',
            asset_name: '',
            created_at: '',
            status: ''
        }
    )

    const [OpenForm, setOpenForm] = useState(false);
    const [View, setView] = useState('list');

    const [Form, setForm] = useState({
        asset_code: '',
        asset_name: '',
    });

    useEffect(
        () => {

            allAssets();
            if ( localStorage.getItem('inventoryAssetsView') )
            {
                setView(localStorage.getItem('inventoryAssetsView'));
                $('.btn.icon1').removeClass('active');
                $('.btn#' + localStorage.getItem('inventoryAssetsView')).addClass('active');
            }

        }, []
    )

    useEffect(
        () => {
            
            if ( CheckedAsset.asset_id !== '' )
            {
                setShowBtns( true );
            }else
            {
                setShowBtns( false );
                setEditView( false );
            }

            ReactTooltip.rebuild();

        }, [ CheckedAsset.asset_id ]
    )

    const ChangeViewType = (view) => {

        setView(view);
        localStorage.setItem('inventoryAssetsView', view);
        $('.btn-group.actions .btn').toggleClass('active');

    }

    const allAssets = () => {

        axios.get(
            '/getallassets'
        ).then(
            res => {

                setAssetsList(res.data);

            }
        ).catch(
            err => {

                console.log(err);

            }
        )

    }

    const ShowForm = () => {

        setOpenForm(true)

    }

    const submitAssetsForm = (e) => {

        e.preventDefault();

        for (let x = 0; x < AssetsList.length; x++) {
            if (Form.asset_name.toLocaleLowerCase() === AssetsList[x].asset_name.toLocaleLowerCase() || Form.asset_code.toLocaleLowerCase() === AssetsList[x].asset_code.toLocaleLowerCase()) {
                alert("name and code should be unique");
                return false;
            }
        }

        const val = {
            asset_name: Form.asset_name,
            asset_code: Form.asset_code,
            date_time: new Date(),
        }

        axios.post(
            '/newasset', 
            {
                data: JSON.stringify(val)
            }
        ).then(
            () => {

                setForm(
                    {
                        asset_code: '',
                        asset_name: '',
                    }
                );

                allAssets();
                toast.dark( "New Asset Added" , {
                    position: 'top-center',
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });

            }
        ).catch(
            err => {

                console.log(err);

            }
        )

        setOpenForm(false)


    }

    const OnChangeHandler = (e) => {
        const { value, name } = e.target

        const val = {
            ...Form,
            [name]: value
        }

        setForm(val);
    }

    const OnChangeHandlerInputs = (e) => {

        const { value, name } = e.target

        const val = {
            ...CheckedAsset,
            [name]: value
        }

        setCheckedAsset(val);

    }

    const CancleForm = () => {

        setOpenForm( false )
        setEditView( false )

    }

    const OnCheckHandler = (e) => {

        const { checked, id } = e.target;

        console.log( checked );
        console.log( id );

        let data = {};
        if (checked) {

            let index = id.split('check').pop();
            let obj = AssetsList[index];
            console.log( obj );
            obj.check = id;
            data = obj;

        }
        setCheckedAsset( data );
    }

    const DeleteAssets = () => {

        let arr = [ CheckedAsset.asset_id ];

        axios.post(
            '/deleteselectedassets',
            {
                assets: JSON.stringify( arr )
            }
        ).then(
            () => {

                toast.dark( "Assets Deleted" , {
                    position: 'top-center',
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                allAssets();
                setCheckedAsset(
                    {
                        asset_id: '',
                        asset_code: '',
                        asset_name: '',
                        created_at: '',
                        status: ''
                    }
                );

                $('input[type=radio]').prop('checked', false);

            }
        ).catch(
            err => {

                toast.dark( err, {
                    position: 'top-center',
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });

            }
        )
        
    }  

    const OnEditRecord = () => {

        setEditView( true );

    }

    const OnUpdateRecord = ( e ) => {

        e.preventDefault();
        axios.post(
            '/updateselectedasset',
            {
                assets: JSON.stringify( CheckedAsset )
            }
        ).then(
            () => {

                toast.dark( "Assets Updated" , {
                    position: 'top-center',
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                allAssets();
                setCheckedAsset(
                    {
                        asset_id: '',
                        asset_code: '',
                        asset_name: '',
                        created_at: '',
                        status: ''
                    }
                );

                $('input[type=radio]').prop('checked', false);

            }
        ).catch(
            err => {

                toast.dark( err, {
                    position: 'top-center',
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });

            }
        )

    }

    return (

        <>
            <ReactTooltip />
            <ToastContainer />

            <div className="Assets">
                <div className="Assets_Top" >
                    <div className="Assets_Top_left">

                        <div className="dropdown_filter">
                            <p>All Assets</p>
                            {/* <i class="las la-caret-down"></i> */}
                        </div>

                    </div>
                    <div className="Assets_Top_right">

                        {/* <button className="btn setting_button"><i class="las la-cog"></i></button> */}
                        <button className="btn New_button" onClick={ShowForm} > <i class="las la-plus"></i> <p>New</p></button>

                        {
                            ShowBtns === true || CheckedAsset.asset_id !== ''
                            ?
                            <div className="btn-group">
                                <button data-tip="Edit" className="btn icon1" onClick={ OnEditRecord }><i class="las la-edit"></i></button>
                                <button data-tip="Delete" className="btn icon1" onClick={DeleteAssets}><i class="las la-trash"></i></button>
                            </div>
                            :
                            null
                        }

                        <div className="btn-group actions">
                            <button data-tip="List View" id="list" className="btn icon1 active" onClick={() => ChangeViewType('list')}><i class="las la-list-ul"></i></button>
                            <button data-tip="Box View" id="box" className="btn icon1" onClick={() => ChangeViewType('box')}><i class="las la-border-all"></i></button>
                        </div>
                        <div className="list_button"></div>
                    </div>
                </div>

                {
                    EditView
                    ?
                    <div className='grid_parent'>

                        <div>

                            {
                                AssetsList.length === 0
                                ?
                                <h4 className="text-center">No Record Found</h4>
                                :
                                <>
                                    <div className="Assets_Grid changeOnCLick">
                                        <div></div>
                                        <div><p className="text-left">Assets Name</p></div>
                                    </div>

                                    {
                                        AssetsList.map(
                                            (val, index) => {

                                                return (
                                                    <div className="Assets_Grid_list changeOnCLick" key={index}>
                                                        <div><input type="radio" name="selection" id={'check' + index} onClick={OnCheckHandler} /></div>
                                                        <NavLink to={'/inventory/asset/id=' + val.asset_id + '&&name=' + val.asset_name + '&&view=sub_assets'}><p className="text-left">{val.asset_name}</p></NavLink>
                                                    </div>
                                                )
                                            }
                                        )
                                    }
                                </>
                            }

                        </div>

                        <FormInput 
                            submitAssetsForm={ OnUpdateRecord }
                            OnChangeHandler={ OnChangeHandlerInputs }
                            CancleForm={ CancleForm }

                            Form={ CheckedAsset }
                            date={ new Date( CheckedAsset.created_at ) }
                        />

                    </div>
                    :
                    OpenForm
                        ?

                        <div className='grid_parent'>

                            <div>

                                {
                                    AssetsList.length === 0
                                    ?
                                    <h4 className="text-center">No Record Found</h4>
                                    :
                                    <>
                                        <div className="Assets_Grid changeOnCLick">
                                            <div></div>
                                            <div><p className="text-left">Assets Name</p></div>
                                        </div>

                                        {
                                            AssetsList.map(
                                                (val, index) => {

                                                    return (
                                                        <div className="Assets_Grid_list changeOnCLick" key={index}>
                                                            <div><input type="radio" name="selection" id={'check' + index} onClick={OnCheckHandler} /></div>
                                                            <NavLink to={'/inventory/asset/id=' + val.asset_id + '&&name=' + val.asset_name + '&&view=sub_assets'}><p className="text-left">{val.asset_name}</p></NavLink>
                                                        </div>
                                                    )
                                                }
                                            )
                                        }
                                    </>
                                }

                            </div>

                            <FormInput 
                                submitAssetsForm={ submitAssetsForm }
                                OnChangeHandler={ OnChangeHandler }
                                CancleForm={ CancleForm }

                                Form={ Form }
                                date={ new Date() }
                            />

                        </div>

                        :

                        View === 'box'
                        ?
                        <>

                            <div className="Box">

                                {
                                    AssetsList.length === 0
                                    ?
                                    <h4 className="text-center">No Record Found</h4>
                                    :
                                    null
                                }

                                <div className="Assets_Grid_box">


                                    {
                                        AssetsList.map(
                                            (val, index) => {

                                                const d = new Date(val.created_at);

                                                return (
                                                    <>

                                                        <div className="Grid_box_div shadow-sm rounded" key={ index }>

                                                            <div className="CheckBox"><input type="radio" name="selection" id={'check' + index} onClick={OnCheckHandler}  /></div>

                                                            <NavLink to={'/inventory/asset/id=' + val.asset_id + '&&name=' + val.asset_name + '&&view=sub_assets'} className="Grid_box_div_center">

                                                                <div className="Icon">
                                                                    <i class="las la-image"></i>
                                                                </div>
                                                                <div className="details">
                                                                    <p>Asset Name : </p>
                                                                    <h6>{val.asset_name}</h6>
                                                                </div>

                                                                <div className="details">
                                                                    <p>Asset Code : </p>
                                                                    <h6>{val.asset_code}</h6>
                                                                </div>

                                                                <div className="details">
                                                                    <p>Sub Assets : </p>
                                                                    <h6>{val.count_sub_assets}</h6>
                                                                </div>

                                                                <div className="details">
                                                                    <p>Date : </p>
                                                                    <h6>{d ? d.toDateString() : null}</h6>
                                                                </div>

                                                            </NavLink>

                                                        </div>

                                                    </>
                                                )
                                            }
                                        )
                                    }

                                </div>

                            </div>

                        </>

                        :

                        <div>

                            {
                                AssetsList.length === 0
                                ?
                                <h4 className="text-center">No Record Found</h4>
                                :
                                <>
                                    <div className="Assets_Grid">
                                        <div></div>
                                        <div><p>Assets Name</p></div>
                                        <div><p>Assets Code</p></div>
                                        <div><p>Sub Assets</p></div>
                                        <div><p>Date</p></div>
                                    </div>

                                    {
                                        AssetsList.map(
                                            (val, index) => {

                                                const d = new Date(val.created_at);

                                                return (
                                                    <div className="Assets_Grid_list" key={index}>
                                                        <div><input type="radio" name="selection" id={'check' + index} onClick={OnCheckHandler} /></div>
                                                        <NavLink to={'/inventory/asset/id=' + val.asset_id + '&&name=' + val.asset_name + '&&view=sub_assets'}><p>{val.asset_name}</p></NavLink>
                                                        <NavLink to={'/inventory/asset/id=' + val.asset_id + '&&name=' + val.asset_name + '&&view=sub_assets'}><p>{val.asset_code}</p></NavLink>
                                                        <NavLink to={'/inventory/asset/id=' + val.asset_id + '&&name=' + val.asset_name + '&&view=sub_assets'}><p>{val.count_sub_assets}</p></NavLink>
                                                        <NavLink to={'/inventory/asset/id=' + val.asset_id + '&&name=' + val.asset_name + '&&view=sub_assets'}><p>{d ? d.toDateString() : null}</p></NavLink>
                                                    </div>
                                                )
                                            }
                                        )
                                    }
                                </>
                            }

                        </div>

                }

            </div>

        </>

    )

}

export default Assets;

const FormInput = ( props ) => {

    const [ Form, setForm ] = useState(
        {
            asset_name: '',
            asset_code: ''
        }
    );

    useEffect(
        () => {

            setForm(
                {
                    asset_name: props.Form.asset_name,
                    asset_code: props.Form.asset_code
                }
            )

        }, [ props.Form ]
    )

    return (
        <form className="Assets_form" onSubmit={ props.submitAssetsForm } key={ props.index } id="myForm">

            <h5 className="font-weight-bold">Add New Assets</h5>

            <div className="Assets_form_grid">
                <div>
                    <p>Assets Name</p>
                    <input type="text" onChange={ props.OnChangeHandler } value={ Form.asset_name } className=" form-control form-control-sm" name='asset_name' required />
                </div>
                <div>
                    <p>Assets Code</p>
                    <input type="text" onChange={ props.OnChangeHandler } value={ Form.asset_code } className=" form-control form-control-sm" name="asset_code" required />
                </div>
                <div>
                    <p>Date</p>
                    <input type="text" disabled value={ props.date ? props.date.toDateString() : null } className="form-control form-control-sm" />
                </div>
            </div>

            <div className="Assets_form_button" >
                <div className="d-flex">
                    <button className="btn btn-sm cancle" onClick={ () => props.CancleForm() } type="reset">Cancle</button>
                    <button className="btn btn-sm submit" type="submit">Submit</button>
                </div>
            </div>

        </form>
    )

}