import React, { useEffect, useState } from "react";
import './SubAssets.css';


import { NavLink } from 'react-router-dom';
import axios from "../../../../axios";
import $ from 'jquery';

import ReactTooltip from 'react-tooltip';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SubAssets = () => {

    const [EditView, setEditView] = useState(false);
    const [ShowBtns, setShowBtns] = useState(false);
    const [SubAssetsList, setSubAssetsList] = useState([]);
    const [ CheckedSubAsset, setCheckedSubAsset ] = useState(
        {
            asset_id: '',
            sub_asset_code: '',
            sub_asset_name: '',
            created_at: '',
            status: ''
        }
    )

    const [OpenForm, setOpenForm] = useState(false);
    const [View, setView] = useState('list');
    const [AssetID, setAssetID] = useState(0);

    const [Form, setForm] = useState({
        sub_asset_code: '',
        sub_asset_name: '',
    });

    useEffect(
        () => {

            if ( localStorage.getItem('inventorySubAssetsView') )
            {
                setView(localStorage.getItem('inventorySubAssetsView'));
                $('.btn.icon1').removeClass('active');
                $('.btn#' + localStorage.getItem('inventorySubAssetsView')).addClass('active');
            }

        }, []
    )

    useEffect(
        () => {

            let id = parseInt( window.location.href.split('/').pop().split('&&').shift().split('=').pop() );

            if ( !isNaN( id ) )
            {
                setAssetID( id );
                allAssets( id );
            }

        // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [ window.location.href.split('/').pop() ]
    )

    useEffect(
        () => {
            
            if ( CheckedSubAsset.asset_id !== '' )
            {
                setShowBtns( true );
            }else
            {
                setShowBtns( false );
                setEditView( false );
            }

            ReactTooltip.rebuild();

        }, [ CheckedSubAsset.asset_id ]
    )

    const ChangeViewType = (view) => {

        setView(view);
        localStorage.setItem('inventorySubAssetsView', view);
        $('.btn-group.actions .btn').toggleClass('active');

    }

    const allAssets = ( id ) => {

        axios.post(
            '/getallsubassets',
            {
                asset_id: id ? id : AssetID
            }
        ).then(
            res => {

                setSubAssetsList(res.data);

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

        for (let x = 0; x < SubAssetsList.length; x++) {
            if (Form.sub_asset_name.toLocaleLowerCase() === SubAssetsList[x].sub_asset_name.toLocaleLowerCase() || Form.sub_asset_code.toLocaleLowerCase() === SubAssetsList[x].sub_asset_code.toLocaleLowerCase()) {
                alert("name and code should be unique");
                return false;
            }
        }

        const val = {
            asset_id: AssetID,
            sub_asset_name: Form.sub_asset_name,
            sub_asset_code: Form.sub_asset_code,
            date_time: new Date(),
        }

        axios.post(
            '/newsubasset', 
            {
                data: JSON.stringify(val)
            }
        ).then(
            () => {

                setForm(
                    {
                        sub_asset_code: '',
                        sub_asset_name: '',
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
            ...CheckedSubAsset,
            [name]: value
        }

        setCheckedSubAsset(val);

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
            let obj = SubAssetsList[index];
            console.log( obj );
            obj.check = id;
            data = obj;

        }
        setCheckedSubAsset( data );
    }

    const DeleteAssets = () => {

        let arr = [ CheckedSubAsset.sub_asset_id ];

        axios.post(
            '/deleteselectedsubassets',
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
                setCheckedSubAsset(
                    {
                        asset_id: '',
                        sub_asset_code: '',
                        sub_asset_name: '',
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
            '/updateselectedsubasset',
            {
                assets: JSON.stringify( CheckedSubAsset )
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
                setCheckedSubAsset(
                    {
                        asset_id: '',
                        sub_asset_code: '',
                        sub_asset_name: '',
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

            <div className="SubAssets">
                <div className="SubAssets_Top" >
                    <div className="SubAssets_Top_left">

                        <div className="dropdown_filter">
                            <p>All Sub Assets</p>
                            {/* <i class="las la-caret-down"></i> */}
                        </div>

                    </div>
                    <div className="SubAssets_Top_right">

                        {/* <button className="btn setting_button"><i class="las la-cog"></i></button> */}
                        <button className="btn New_button" onClick={ShowForm} > <i class="las la-plus"></i> <p>New</p></button>

                        {
                            ShowBtns === true || CheckedSubAsset.asset_id !== ''
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
                                SubAssetsList.length === 0
                                ?
                                <h4 className="text-center">No Record Found</h4>
                                :
                                <>
                                    <div className="SubAssets_Grid changeOnCLick">
                                        <div></div>
                                        <div><p className="text-left">Sub Assets Name</p></div>
                                    </div>

                                    {
                                        SubAssetsList.map(
                                            (val, index) => {

                                                return (
                                                    <div className="SubAssets_Grid_list changeOnCLick" key={index}>
                                                        <div><input type="radio" name="selection" id={'check' + index} onClick={OnCheckHandler} /></div>
                                                        <NavLink to={'/inventory/asset/id=' + val.sub_asset_id + '&&name=' + val.sub_asset_name + '&&view=sub_items'}><p className="text-left">{val.sub_asset_name}</p></NavLink>
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

                            Form={ CheckedSubAsset }
                            date={ new Date( CheckedSubAsset.created_at ) }
                        />

                    </div>
                    :
                    OpenForm
                        ?

                        <div className='grid_parent'>

                            <div>

                                {
                                    SubAssetsList.length === 0
                                    ?
                                    <h4 className="text-center">No Record Found</h4>
                                    :
                                    <>
                                        <div className="SubAssets_Grid changeOnCLick">
                                            <div></div>
                                            <div><p className="text-left">Sub Assets Name</p></div>
                                        </div>

                                        {
                                            SubAssetsList.map(
                                                (val, index) => {

                                                    return (
                                                        <div className="SubAssets_Grid_list changeOnCLick" key={index}>
                                                            <div><input type="radio" name="selection" id={'check' + index} onClick={OnCheckHandler} /></div>
                                                            <NavLink to={'/inventory/asset/id=' + val.sub_asset_id + '&&name=' + val.sub_asset_name + '&&view=sub_items'}><p className="text-left">{val.sub_asset_name}</p></NavLink>
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
                                    SubAssetsList.length === 0
                                    ?
                                    <h4 className="text-center">No Record Found</h4>
                                    :
                                    null
                                }

                                <div className="SubAssets_Grid_box">


                                    {
                                        SubAssetsList.map(
                                            (val, index) => {

                                                const d = new Date(val.created_at);

                                                return (
                                                    <>

                                                        <NavLink to={'/inventory/asset/id=' + val.sub_asset_id + '&&name=' + val.sub_asset_name + '&&view=sub_items'} className="Grid_box_div shadow-sm rounded" key={ index }>

                                                            <div className="CheckBox"><input type="radio" name="selection" id={'check' + index} onClick={OnCheckHandler}  /></div>

                                                            <div className="Grid_box_div_center">

                                                                <div className="Icon">
                                                                    <i class="las la-image"></i>
                                                                </div>
                                                                <div className="details">
                                                                    <p>Sub Asset Name : </p>
                                                                    <h6>{val.sub_asset_name}</h6>
                                                                </div>

                                                                <div className="details">
                                                                    <p>Sub Asset Code : </p>
                                                                    <h6>{val.sub_asset_code}</h6>
                                                                </div>

                                                                <div className="details">
                                                                    <p>Sub Items : </p>
                                                                    <h6>{val.count_sub_items}</h6>
                                                                </div>

                                                                <div className="details">
                                                                    <p>Date : </p>
                                                                    <h6>{d ? d.toDateString() : null}</h6>
                                                                </div>

                                                            </div>

                                                        </NavLink>

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
                                SubAssetsList.length === 0
                                ?
                                <h4 className="text-center">No Record Found</h4>
                                :
                                <>
                                    <div className="SubAssets_Grid">
                                        <div></div>
                                        <div><p>Sub Assets Name</p></div>
                                        <div><p>Sub Assets Code</p></div>
                                        <div><p>Sub Items</p></div>
                                        <div><p>Date</p></div>
                                    </div>

                                    {
                                        SubAssetsList.map(
                                            (val, index) => {

                                                const d = new Date(val.created_at);

                                                return (
                                                    <div className="SubAssets_Grid_list" key={index}>
                                                        <div><input type="radio" name="selection" id={'check' + index} onClick={OnCheckHandler} /></div>
                                                        <NavLink to={'/inventory/asset/id=' + val.sub_asset_id + '&&name=' + val.sub_asset_name + '&&view=sub_items'}><p>{val.sub_asset_name}</p></NavLink>
                                                        <NavLink to={'/inventory/asset/id=' + val.sub_asset_id + '&&name=' + val.sub_asset_name + '&&view=sub_items'}><p>{val.sub_asset_code}</p></NavLink>
                                                        <NavLink to={'/inventory/asset/id=' + val.sub_asset_id + '&&name=' + val.sub_asset_name + '&&view=sub_items'}><p>{val.count_sub_items}</p></NavLink>
                                                        <NavLink to={'/inventory/asset/id=' + val.sub_asset_id + '&&name=' + val.sub_asset_name + '&&view=sub_items'}><p>{d ? d.toDateString() : null}</p></NavLink>
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

export default SubAssets;

const FormInput = ( props ) => {

    const [ Form, setForm ] = useState(
        {
            sub_asset_name: '',
            sub_asset_code: ''
        }
    );

    useEffect(
        () => {

            setForm(
                {
                    sub_asset_name: props.Form.sub_asset_name,
                    sub_asset_code: props.Form.sub_asset_code
                }
            )

        }, [ props.Form ]
    )

    return (
        <form className="SubAssets_form" onSubmit={ props.submitAssetsForm } key={ props.index } id="myForm">

            <h5 className="font-weight-bold">Add New Assets</h5>

            <div className="SubAssets_form_grid">
                <div>
                    <p>Assets Name</p>
                    <input type="text" onChange={ props.OnChangeHandler } value={ Form.sub_asset_name } className=" form-control form-control-sm" name='sub_asset_name' required />
                </div>
                <div>
                    <p>Assets Code</p>
                    <input type="text" onChange={ props.OnChangeHandler } value={ Form.sub_asset_code } className=" form-control form-control-sm" name="sub_asset_code" required />
                </div>
                <div>
                    <p>Date</p>
                    <input type="text" disabled value={ props.date ? props.date.toDateString() : null } className="form-control form-control-sm" />
                </div>
            </div>

            <div className="SubAssets_form_button" >
                <div className="d-flex">
                    <button className="btn btn-sm cancle" onClick={ () => props.CancleForm() } type="reset">Cancle</button>
                    <button className="btn btn-sm submit" type="submit">Submit</button>
                </div>
            </div>

        </form>
    )

}