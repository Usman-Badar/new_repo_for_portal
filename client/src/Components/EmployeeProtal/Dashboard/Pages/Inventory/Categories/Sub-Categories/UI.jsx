/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import './Style.css';
import { useHistory } from 'react-router-dom';
import $ from 'jquery';
import Modal from '../../../../../../UI/Modal/Modal';
import axios from '../../../../../../../axios';

const UI = ( { HODApproval, Tagging, Edit, Confirmation, icons, FilterIcon, SelectedIcon, NewCategoryModal, SpecKeyword, CategoriesList, setHODApproval, setTagging, editCategory, setEdit, setConfirmation, addNewCategory, setIcons, selectIcon, removeCategory, searchIcon, setSpecKeyword, setNewCategoryModal } ) => {
    
    const history = useHistory();

    return (
        <>
            <div className="category">
                <div className="category_container">
                    <Modal show={ NewCategoryModal } Hide={ () => { setNewCategoryModal(!NewCategoryModal); setEdit(); } } content={ <NewCategoryModalContent Edit={ Edit } NewCategoryModal={ NewCategoryModal } addNewCategory={ addNewCategory } SelectedIcon={ SelectedIcon } searchIcon={ searchIcon } FilterIcon={ FilterIcon } icons={ icons } setIcons={ setIcons } selectIcon={ selectIcon } /> } />
                    <Modal show={ Confirmation } Hide={ () => setConfirmation() } content={ <Content Confirmation={ Confirmation } /> } />
                    <ListView 
                        CategoriesList={ CategoriesList }
                        SpecKeyword={ SpecKeyword }
                        history={ history }
                        Tagging={ Tagging }
                        HODApproval={ HODApproval }
                        
                        setHODApproval={ setHODApproval }
                        setTagging={ setTagging }
                        editCategory={ editCategory }
                        removeCategory={ removeCategory }
                        setNewCategoryModal={ setNewCategoryModal }
                        setSpecKeyword={ setSpecKeyword }
                    />
                </div>
            </div>
        </>
    );

}

export default UI;

const ListView = ( { HODApproval, Tagging, history, SpecKeyword, CategoriesList, setHODApproval, setTagging, setSpecKeyword, setNewCategoryModal, removeCategory, editCategory } ) => {

    const Arr = CategoriesList ? CategoriesList.filter(
        val => {
            return val.name.toLowerCase().includes(SpecKeyword.toLowerCase()) && val.labeling.toString().includes(Tagging) && val.hod_approval_required.toString().includes(HODApproval);
        }
    ) : undefined;

    return (
        <>
            <div className="d-flex align-items-center justify-content-between">
                <h3 className="heading">
                    Sub-Categories View
                    <sub>List Of All Sub-Categories ({ Arr?.length })</sub>
                </h3>

                <div>
                    <button className='btn light' onClick={ () => history.replace('/inventory/categories/list') }>Back</button>
                    <button className='btn submit ml-2' onClick={ () => setNewCategoryModal(true) }>New</button>
                    <button className="btn submit px-2 ml-2 filter-emit" type='button'>
                        <i className="las la-filter"></i> Filters
                        <div className="filter-container">
                            <h6 className='mb-0' style={{ fontFamily: 'Oxygen' }}>Filter Options</h6>
                            <hr className='my-1 bg-dark' />

                            <label className="font-weight-bold mb-0">Search Category</label>
                            <input placeholder='Search Keywords...' type="search" onChange={ (e) => setSpecKeyword(e.target.value) } className='form-control form-control-sm mb-2' />

                            <label className="font-weight-bold mb-0">Search By Tagging</label>
                            <select onChange={ (e) => setTagging(e.target.value) } className='form-control form-control-sm mb-2'>
                                <option value=''>select</option>
                                <option value='0'>Not Required</option>
                                <option value='1'>Required</option>
                            </select>

                            <label className="font-weight-bold mb-0">Search By H.O.D Approval</label>
                            <select onChange={ (e) => setHODApproval(e.target.value) } className='form-control form-control-sm mb-2'>
                                <option value=''>select</option>
                                <option value='0'>Not Required</option>
                                <option value='1'>Required</option>
                            </select>
                        </div>
                    </button>
                </div>
            </div>
            <hr />
            
            {
                Arr
                ?
                Arr.length === 0
                ?
                <h6 className='text-center'>No Record Found</h6>
                :
                <table className="table table-sm">
                    <thead>
                        <tr>
                            <th>Sr.No</th>
                            <th>Sub-Category</th>
                            <th>Tagging</th>
                            <th colSpan={2}>H.O.D Approval</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            Arr.map(
                                ( val, index ) => {
                                    const Colors = [ 
                                        {
                                            bg: '#FDF4F8',
                                            fg: '#FF7DBA',
                                        },
                                        {
                                            bg: '#FFFBEB',
                                            fg: '#FFE571',
                                        },
                                        {
                                            bg: '#FEF3EF',
                                            fg: '#F49F74',
                                        },
                                        {
                                            bg: '#F3FDFB',
                                            fg: '#68DFC9',
                                        },
                                        {
                                            bg: '#FEEEEC',
                                            fg: '#FE0E00',
                                        },
                                        {
                                            bg: '#FFF6F0',
                                            fg: '#E6CDBB',
                                        },
                                        {
                                            bg: '#F2E1FF',
                                            fg: '#AC6BCD',
                                        },
                                        {
                                            bg: '#FFF2D8',
                                            fg: '#F4991D',
                                        },
                                        {
                                            bg: '#FFD4D5',
                                            fg: '#CC0000',
                                        },
                                        {
                                            bg: '#EBF9FF',
                                            fg: '#5FBED6',
                                        },
                                        {
                                            bg:  '#FED9E8',
                                            fg:  '#760028'
                                        },
                                    ];
                                    const currentColor = Colors[Math.floor(Math.random() * Colors.length)];
                                    setTimeout(() => {
                                        $('#icons-bg' + index + ' svg').css('fill', currentColor.fg);
                                    }, 200);

                                    return (
                                            <tr key={ index } title='Double click to enter'>
                                                <td>{ index + 1 }</td>
                                                <td>
                                                    <div className='d-flex align-items-center w-100'>
                                                        <span id={ 'icons-bg' + index } style={ { backgroundColor: currentColor.bg } } className='icons-bg' dangerouslySetInnerHTML={{__html: val.icon}}></span>
                                                        <div className='ml-2 font-weight-bold' style={{ width: 'fit-content' }}>{ val.name }</div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className='d-flex align-items-center'>
                                                        <div 
                                                            className={
                                                                "dot mr-1 "
                                                                +
                                                                (
                                                                    val.labeling !== 1
                                                                    ?
                                                                    "bg-dark"
                                                                    :
                                                                    "bg-danger"
                                                                )
                                                            }
                                                        ></div>
                                                        <div
                                                            className={
                                                                "text-capitalize "
                                                                +
                                                                (
                                                                    val.labeling !== 1
                                                                    ?
                                                                    "text-dark"
                                                                    :
                                                                    "text-danger"
                                                                )
                                                            }
                                                            style={{ fontSize: 12 }}
                                                        >
                                                            { val.labeling === 1 ? "required" : "not-required" }
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    { val.hod_approval_required === 1 ? <span className="text-danger">required</span> : <span className="text-primary">not-required</span> }
                                                </td>
                                                <td>
                                                    <div className="d-flex">
                                                        <span title="View Products" className='iconic'><i className="las la-eye"></i></span>
                                                        <span title="Edit Sub-Category" className='iconic' onClick={ () => editCategory( val.id ) }><i className="las la-edit"></i></span>
                                                        <span title="Delete Sub-Category" className='iconic' onClick={ () => removeCategory( val.id ) }><i className="las la-trash"></i></span>
                                                    </div>
                                                </td>
                                            </tr>
                                    );

                                }
                            )
                        }
                    </tbody>
                </table>
                :
                <h6 className='text-center'>Loading....</h6>
            }
        </>
    )

}

const NewCategoryModalContent = ( { Edit, NewCategoryModal, SelectedIcon, FilterIcon, icons, setIcons, searchIcon, addNewCategory, selectIcon } ) => {

    useEffect(
        () => {
            if ( icons.length === 0 )
            {
                axios.get(
                    'https://raw.githubusercontent.com/FortAwesome/Font-Awesome/master/metadata/icons.json'
                ).then(
                    res => {
    
                        let arr = [];
                        for ( let x = 0; x < Object.keys(res.data).length; x++ )
                        {
                            arr.push(
                                {
                                    key: Object.keys(res.data)[x],
                                    svg: res.data[Object.keys(res.data)[x]].svg.brands ? res.data[Object.keys(res.data)[x]].svg.brands.raw : res.data[Object.keys(res.data)[x]].svg.solid.raw
                                }
                            );
                        }
    
                        setIcons(arr);
    
                    }
                ).catch(
                    err => {
    
                        console.log( err );
    
                    }
                )
            }
        }, []
    )

    const Arr = icons ? icons.filter(
        val => {
            return val.key.toLowerCase().includes(FilterIcon.toLowerCase());
        }
    ) : null;

    if ( !NewCategoryModal )
    {
        return <></>;
    }

    return (
        <>
            <form autocomplete="off" onSubmit={ addNewCategory }>
                <h5>{ Edit ? "Update" : "Add" } Sub-Category</h5>
                <hr />
                <div class="alert alert-danger d-none" id="add_category_err" role="alert"></div>
                <fieldset>
                    <label className="mb-0"><b>Category Name *</b></label>
                    <input className="form-control mb-2" name="sub_category_name" required />
                    <label className="mb-0"><b>Category Tagging *</b></label>
                    <select className="form-control mb-2" name="labeling" defaultValue={'0'} required>
                        <option value="0">not-required</option>
                        <option value="1" selected>required</option>
                    </select>
                    <label className="mb-0"><b>H.O.D Approval *</b></label>
                    <select className="form-control mb-2" name="hod_approval_required" defaultValue={'1'} required>
                        <option value="1" selected>required</option>
                        <option value="0">not-required</option>
                    </select>
                    <label className="mb-0"><b>Category Icon *</b></label>
                    <input type="search" className="form-control mb-2" name="icon_search" onChange={ (e) => searchIcon(e.target.value) } />
                    <div className="icons_container">
                        {
                            Arr.map(
                                val => {
                                    let className = '';
                                    if ( SelectedIcon && SelectedIcon.key === '' )
                                    {
                                        if ( SelectedIcon.svg === val.svg )
                                        {
                                            className = 'selected';
                                        }
                                    }else
                                    {
                                        if ( SelectedIcon && SelectedIcon.key === val.key )
                                        {
                                            className = 'selected';
                                        }
                                    }
                                    return (
                                        <div key={ val.key } dangerouslySetInnerHTML={{__html: val.svg}} className={ className } onClick={ () => selectIcon(val.key) }></div>
                                    );
                                }
                            )
                        }
                    </div>
                    <button className='btn submit d-block ml-auto mt-3'>{ Edit ? "Update" : "Create" }</button>
                </fieldset>
            </form>
        </>
    )

}

const Content = ( { Confirmation } ) => {

    if ( !Confirmation )
    {
        return <></>;
    }

    return (
        <form onSubmit={ Confirmation.func }>
            <fieldset className="px-3 pt-2 pb-0">
                <h6 className='mb-3'>
                    { Confirmation.label }
                </h6>
                <button className='btn cancle d-block ml-auto' type='submit'>
                    Confirm
                </button>
            </fieldset>
        </form>
    )

}