import React, { useEffect, useState } from 'react';
import './Items.css';

import { Link, useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from '../../../../../../axios';

import ReactTooltip from 'react-tooltip';
import Modal from '../../../../../UI/Modal/Modal';

const Items = () => {

    const history = useHistory();
    const AccessControls = useSelector( ( state ) => state.EmpAuth.EmployeeData );

    const [ModalContent, setModalContent] = useState(<></>);
    const [ Show, setShow ] = useState(false);
    const [ Disabled, setDisabled ] = useState(true);
    const [ ID, setID ] = useState();
    const [ View, setView ] = useState('');
    const [ Items, setItems ] = useState([]);
    const [ Assets, setAssets ] = useState([]);
    const [ SubAssets, setSubAssets ] = useState([]);
    const [ Item, setItem ] = useState(
        {
            name: '',
            quantity: 0,
            lock_edit: "N",
            asset_id: 0,
            sub_asset_id: 0
        }
    );

    useEffect(
        () => {

            if ( Item.name === '' || Item.quantity === 0 || Item.lock_edit === '' || Item.asset_id === 0 || Item.sub_asset_id === 0 )
            {
                setDisabled( true );
            }else
            if ( isNaN(Item.quantity) )
            {
                setDisabled( true );
            }else
            {
                setDisabled( false );
            }

        }, [ Item.name, Item.quantity, Item.lock_edit, Item.asset_id, Item.sub_asset_id ]
    )

    useEffect(
        () => {

            getItems();
            getAssets();

        // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []
    )

    useEffect(
        () => {

            setView( window.location.href.split('/').pop() );

        // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [ window.location.href.split('/').pop() ]
    )

    setTimeout(() => {
        ReactTooltip.rebuild();
    }, 1000);

    const getAssets = () => {

        axios.get(
            '/getallassets'
        ).then(
            res => {

                setAssets( res.data );

            }
        ).catch(
            err => {

                console.log( err );

            }
        )

    }

    const GetSubAssets = ( id ) => {

        axios.post(
            '/getallsubassets',
            {
                asset_id: id
            }
        ).then(
            res => {

                setSubAssets( res.data );
                return res.data;

            }
        ).catch(
            err => {

                console.log( err );

            }
        )

    }

    const getItems = () => {

        axios.get(
            '/store/items'
        ).then(
            res => {

                setItems( res.data );
                setID(res.data.length + 1);
                if ( window.location.href.split('/').pop().includes('index') )
                {
                    let index = parseInt( window.location.href.split('/').pop().split('=').pop() );
                    let asset_id;
                    let sub_asset_id;
                    axios.post(
                        '/getallsubassets',
                        {
                            asset_id: res.data[index].asset_id
                        }
                    ).then(
                        subAssets => {

                            axios.get(
                                '/getallassets'
                            ).then(
                                assets => {
                    
                                    for ( let x = 0; x < assets.data.length; x++ )
                                    {
                                        if ( parseInt( assets.data[x].asset_id ) === parseInt( res.data[index].asset_id ) )
                                        {
                                            asset_id = parseInt( assets.data[x].asset_id );
                                        }
                                    }
        
                                    for ( let x = 0; x < subAssets.data.length; x++ )
                                    {
                                        if ( parseInt( subAssets.data[x].sub_asset_id ) === parseInt( res.data[index].sub_asset_id ) )
                                        {
                                            sub_asset_id = parseInt( subAssets.data[x].sub_asset_id );
                                        }
                                    }
        
                                    setItem(
                                        {
                                            name: res.data[index].item_name,
                                            quantity: res.data[index].availble_quantity,
                                            lock_edit: res.data[index].lock_edit,
                                            asset_id: asset_id,
                                            sub_asset_id: sub_asset_id
                                        }
                                    )
                                    setID( res.data[index].id );
                                    setSubAssets( subAssets.data );
                    
                                }
                            ).catch(
                                err => {
                    
                                    console.log( err );
                    
                                }
                            )

                        }
                    ).catch(
                        err => {

                            console.log( err );

                        }
                    )
                }

            }
        ).catch(
            err => {

                console.log( err );

            }
        )

    }

    const HideModelFunction = () => {

        setShow( !Show );

    }

    const onChangeHandler = ( e ) => {

        const { name, value } = e.target;
        const val ={
            ...Item,
            [name]: value
        };

        setItem( val );

        if ( name === 'asset_id' )
        {
            GetSubAssets( value );
        }

    }

    const onSubmitForm = ( e ) => {

        e.preventDefault();

        if ( window.location.href.split('/').pop().includes('index') )
        {
            axios.post(
                '/store/edit',
                {
                    id: ID,
                    name: Item.name,
                    quantity: Item.quantity,
                    lock_edit: Item.lock_edit,
                    sub_asset_id: Item.sub_asset_id,
                    asset_id: Item.asset_id,
                    date_time: new Date().toString(),
                    edit_by: localStorage.getItem('EmpID'),
                    edit_emp_name: localStorage.getItem('name')
                }
            ).then(
                () => {
    
                    history.replace('/store/items');
    
                }
            ).catch(
                err => {
    
                    console.log( err );
    
                }
            )
        }else
        {
            axios.post(
                '/store/new',
                {
                    name: Item.name,
                    quantity: Item.quantity,
                    lock_edit: Item.lock_edit,
                    sub_asset_id: Item.sub_asset_id,
                    asset_id: Item.asset_id,
                    date_time: new Date().toString(),
                    insert_by: localStorage.getItem('EmpID')
                }
            ).then(
                () => {
    
                    history.replace('/store/items');
    
                }
            ).catch(
                err => {
    
                    console.log( err );
    
                }
            )
        }

    }

    const Edit = ( index ) => {

        history.replace('/store/edit/index=' + index);

    }

    const Remove = ( index ) => {

        setModalContent(
            <form onSubmit={ ( e ) => RemoveItem( e, index ) }>
                <p>Do you want remove this item from the store?</p>
                <div className="text-right">
                    <button className='btn btn-sm btn-danger' type='submit'>yes</button>
                </div>
            </form>
        );

        HideModelFunction();

    }

    const RemoveItem = ( e, index ) => {

        e.preventDefault();
        axios.post(
            '/store/remove',
            {
                id: Items[index].id,
                date_time: new Date().toString(),
                remove_by: localStorage.getItem('EmpID'),
                remove_emp_name: localStorage.getItem('name')
            }
        ).then(
            () => {

                setShow( false );
                getItems();

            }
        ).catch(
            err => {

                console.log( err );

            }
        )

    }

    return (
        <>
            {
                View === 'new' || View.includes('index')
                ?
                <div className="items_container">

                    <div className="d-flex align-items-center justify-content-between mb-3">

                        <div>

                            {
                                View === 'new'
                                ?
                                <h5 className='mb-0 font-weight-bold'>Enter New Store Items</h5>
                                :
                                <h5 className='mb-0 font-weight-bold'>Update Existing Store Items</h5>
                            } 

                        </div>
                        <div>
                            <Link to='/store/items' className="btn btn-sm cancle">cancel</Link>
                        </div>

                    </div>

                    <div className="container-fluid px-0">
                        <div className="row">

                            <div className="col-lg-4 col-md-6 col-sm-12">
                                <table className="table table-sm">

                                    <thead>
                                        <tr>

                                            <th> Item Name </th>
                                            <th> Available Quantity </th>

                                        </tr>
                                    </thead>

                                    <tbody>
                                        {
                                            Items.map(
                                                ( val, index ) => {

                                                    return (
                                                        <tr key={ index }>

                                                            <td> { val.item_name } </td>
                                                            <td style={ { position: 'relative' } }> 
                                                                { val.availble_quantity } 
                                                                {
                                                                    JSON.parse(AccessControls.access).includes(1) || JSON.parse(AccessControls.access).includes(525)
                                                                    ?
                                                                    <>
                                                                        <i onClick={ () => Edit( index ) } data-tip="Edit" className="lar la-edit"></i>
                                                                        <i onClick={ () => Remove( index ) } data-tip="Remove" className="las la-trash-alt"></i>
                                                                    </>
                                                                    :
                                                                    val.lock_edit === 'Y'
                                                                    ?
                                                                    <>
                                                                        <i onClick={ () => Edit( index ) } data-tip="Edit" className="lar la-edit"></i>
                                                                        <i onClick={ () => Remove( index ) } data-tip="Remove" className="las la-trash-alt"></i>
                                                                    </>
                                                                    :
                                                                    null
                                                                }
                                                            </td>

                                                        </tr>
                                                    )

                                                }
                                            )
                                        }
                                    </tbody>

                                </table>
                            </div>
                            <div className="col-lg-8 col-md-6 col-sm-12">

                                <form className="p-3 rounded" onSubmit={ onSubmitForm }>

                                    <h6 className='mb-3 font-weight-bold'>Items Form</h6>
                                    <div className="d-flex w-100">
                                        <div className="mr-1 w-50">
                                            <label className="mb-0"> Item ID </label>
                                            <input type="text" className="form-control form-control-sm mb-2" value={ ID } disabled />
                                        </div>
                                        <div className="ml-1 w-50">
                                            <label className="mb-0"> Item Name </label>
                                            <input disabled={ JSON.parse(AccessControls.access).includes(1) || JSON.parse(AccessControls.access).includes(525) || JSON.parse(AccessControls.access).includes(528) ? false : true } type="text" onChange={ onChangeHandler } className="form-control form-control-sm mb-2" value={ Item.name } name="name" required />
                                        </div>
                                    </div>
                                    <div className="d-flex w-100">
                                        <div className="mr-1 w-50">
                                            <label className="mb-0"> Available Quantity </label>
                                            <input type="text" onChange={ onChangeHandler } className="form-control form-control-sm mb-2" value={ Item.quantity } name="quantity" required />
                                        </div>
                                        <div className="ml-1 w-50">
                                            <label className="mb-0"> Editable </label>
                                            <select className="form-control form-control-sm mb-2" onChange={ onChangeHandler } name="lock_edit" value={ Item.lock_edit } disabled={ JSON.parse(AccessControls.access).includes(1) || JSON.parse(AccessControls.access).includes(525) || JSON.parse(AccessControls.access).includes(528) ? false : true }>
                                                <option value="N">N</option>
                                                <option value="Y">Y</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="d-flex w-100">
                                        <div className="mr-1 w-50">
                                            <label className="mb-0"> Category </label>
                                            <select disabled={ JSON.parse(AccessControls.access).includes(1) || JSON.parse(AccessControls.access).includes(525) || JSON.parse(AccessControls.access).includes(528) ? false : true } className="form-control form-control-sm mb-2" onChange={ onChangeHandler } name="asset_id" value={ Item.asset_id }>
                                                <option value={0}>Select the option</option>
                                                {
                                                    Assets.map(
                                                        val => {

                                                            return <option key={ val.asset_id } value={ val.asset_id }> { val.asset_name } </option>

                                                        }
                                                    )
                                                }
                                            </select>
                                        </div>
                                        <div className="ml-1 w-50">
                                            <label className="mb-0"> Sub Category </label>
                                            <select disabled={ JSON.parse(AccessControls.access).includes(1) || JSON.parse(AccessControls.access).includes(525) || JSON.parse(AccessControls.access).includes(528) ? false : true } className="form-control form-control-sm mb-2" onChange={ onChangeHandler } name="sub_asset_id" value={ Item.sub_asset_id }>
                                                <option value={0}>Select the option</option>
                                                {
                                                    SubAssets.map(
                                                        val => {

                                                            return <option key={ val.sub_asset_id } value={ val.sub_asset_id }> { val.sub_asset_name } </option>

                                                        }
                                                    )
                                                }
                                            </select>
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <button className="btn btn-sm submit" type="submit" disabled={ Disabled }> 
                                            {
                                                View === 'new'
                                                ?
                                                'add'
                                                :
                                                'update'
                                            } 
                                        </button>
                                    </div>

                                </form>

                            </div>
                            
                        </div>
                    </div>


                </div>
                :
                <div className="items_container">

                    <div className="d-flex align-items-center justify-content-between mb-3">

                        <div>

                            <h5 className='mb-0 font-weight-bold'>Store Items</h5>

                        </div>
                        <div>
                            {
                                JSON.parse(AccessControls.access).includes(1) || JSON.parse(AccessControls.access).includes(528)
                                ?
                                <Link to='/store/new' className="btn btn-sm newBtn">new</Link>
                                :null
                            }
                        </div>

                    </div>

                    <table className="table table-sm">

                        <thead>
                            <tr>

                                <th> Item ID </th>
                                <th> Item Name </th>
                                <th> Available Quantity </th>
                                <th> Category </th>
                                <th> Sub Category </th>
                                <th> Editable </th>

                            </tr>
                        </thead>

                        <tbody>
                            {
                                Items.map(
                                    ( val, index ) => {

                                        return (
                                            <tr key={ index }>

                                                <td> { val.id } </td>
                                                <td> { val.item_name } </td>
                                                <td> { val.availble_quantity } </td>
                                                <td> { val.asset_name } </td>
                                                <td> { val.sub_asset_name } </td>
                                                <td style={ { position: 'relative' } }> 
                                                    { val.lock_edit } 
                                                    
                                                    {
                                                        JSON.parse(AccessControls.access).includes(1) || JSON.parse(AccessControls.access).includes(525)
                                                        ?
                                                        <>
                                                            <i onClick={ () => Edit( index ) } data-tip="Edit" className="lar la-edit"></i>
                                                            <i onClick={ () => Remove( index ) } data-tip="Remove" className="las la-trash-alt"></i>
                                                        </>
                                                        :
                                                        val.lock_edit === 'Y'
                                                        ?
                                                        <>
                                                            <i onClick={ () => Edit( index ) } data-tip="Edit" className="lar la-edit"></i>
                                                            <i onClick={ () => Remove( index ) } data-tip="Remove" className="las la-trash-alt"></i>
                                                        </>
                                                        :
                                                        null
                                                    }
                                                </td>

                                            </tr>
                                        )

                                    }
                                )
                            }
                        </tbody>

                    </table>

                </div>
            }
            <ReactTooltip />
            <Modal show={ Show } Hide={HideModelFunction} content={ModalContent} />
        </>
    )

}

export default Items;