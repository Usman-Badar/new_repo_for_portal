/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import './Style.css';
import { Route, Switch, useHistory } from 'react-router-dom';
import $ from 'jquery';
import Modal from '../../../../../UI/Modal/Modal';
import axios from '../../../../../../axios';

const UI = ( { Confirmation, icons, FilterIcon, SelectedIcon, NewCategoryModal, SpecKeyword, FilterType, LoadedTypes, CategoriesList, editCategory, setConfirmation, addNewCategory, setIcons, selectIcon, removeCategory, searchIcon, setSpecKeyword, setNewCategoryModal, setFilterType } ) => {
    
    const history = useHistory();

    return (
        <>
            <div className="category">
                <div className="category_container">
                    <Modal show={ NewCategoryModal } Hide={ () => setNewCategoryModal(!NewCategoryModal) } content={ <NewCategoryModalContent NewCategoryModal={ NewCategoryModal } addNewCategory={ addNewCategory } SelectedIcon={ SelectedIcon } searchIcon={ searchIcon } FilterIcon={ FilterIcon } icons={ icons } setIcons={ setIcons } selectIcon={ selectIcon } /> } />
                    <Modal show={ Confirmation } Hide={ () => setConfirmation() } content={ <Content Confirmation={ Confirmation } /> } />
                    <Switch>
                        <Route exact path="/inventory/categories/list" render={ 
                                () => (
                                    <ListView 
                                        history={ history }
                                        LoadedTypes={ LoadedTypes }
                                        CategoriesList={ CategoriesList }
                                        SpecKeyword={ SpecKeyword }
                                        FilterType={ FilterType }
                                        
                                        editCategory={ editCategory }
                                        removeCategory={ removeCategory }
                                        setNewCategoryModal={ setNewCategoryModal }
                                        setSpecKeyword={ setSpecKeyword }
                                        setFilterType={ setFilterType }
                                    />
                                )
                            } 
                        />
                    </Switch>

                </div>
            </div>
        </>
    );

}

export default UI;

const ListView = ( { history, SpecKeyword, FilterType, LoadedTypes, CategoriesList, setSpecKeyword, setNewCategoryModal, removeCategory, editCategory, setFilterType } ) => {

    const Arr = CategoriesList ? CategoriesList.filter(
        val => {
            return val.type.toLowerCase() === FilterType.toLowerCase() && val.name.toLowerCase().includes(SpecKeyword.toLowerCase());
        }
    ) : undefined;

    return (
        <>
            <div className="d-flex align-items-center justify-content-between">
                <h3 className="heading">
                    Categories View
                    <sub>List Of All Categories</sub>
                </h3>

                <div>
                    <button className='btn submit' onClick={ () => setNewCategoryModal(true) }>New</button>
                    <button className="btn submit px-2 ml-2 filter-emit" type='button'>
                        <i className="las la-filter"></i> Filters
                        <div className="filter-container">
                            <h6 className='mb-0' style={{ fontFamily: 'Oxygen' }}>Filter Options</h6>
                            <hr className='my-1 bg-dark' />

                            <label className="font-weight-bold mb-0">Search Category</label>
                            <input placeholder='Search Keywords...' type="search" onChange={ (e) => setSpecKeyword(e.target.value) } className='form-control form-control-sm mb-2' />
                            
                            {
                                LoadedTypes
                                ?
                                <>
                                    <label className="font-weight-bold mb-0">Type</label>
                                    <select className='form-control form-control-sm mb-2' onChange={ (e) => setFilterType(e.target.value) }>
                                        {
                                            LoadedTypes.sort().map(
                                                ( type, index ) => {

                                                    return <option key={ index } value={ type } selected={ localStorage.getItem('category_type') === type }>{ type }</option>;

                                                }
                                            )
                                        }
                                    </select>
                                </>
                                :null
                            }
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
                            <th>Category</th>
                            <th colSpan={2}>Category Type</th>
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
                                                                    val.type === 'consumable'
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
                                                                    val.type === 'consumable'
                                                                    ?
                                                                    "text-dark"
                                                                    :
                                                                    "text-danger"
                                                                )
                                                            }
                                                            style={{ fontSize: 12 }}
                                                        >
                                                            {val.type}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="d-flex">
                                                        <span title="View Sub-Categories" className='iconic' onClick={ () => history.push('/inventory/category/sub-categories/' + val.category_id) }><i className="las la-eye"></i></span>
                                                        <span title="Edit Category" className='iconic' onClick={ () => editCategory( val.category_id ) }><i className="las la-edit"></i></span>
                                                        <span title="Delete Category" className='iconic' onClick={ () => removeCategory( val.category_id ) }><i className="las la-trash"></i></span>
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

const NewCategoryModalContent = ( { NewCategoryModal, SelectedIcon, FilterIcon, icons, setIcons, searchIcon, addNewCategory, selectIcon } ) => {

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
                <h5>Category</h5>
                <hr />
                <div class="alert alert-danger d-none" id="add_category_err" role="alert"></div>
                <fieldset>
                    <label className="mb-0"><b>Category Name *</b></label>
                    <input className="form-control mb-2" name="category_name" required />
                    <label className="mb-0"><b>Category Type *</b></label>
                    <select className="form-control mb-2" name="category_type" defaultValue={'consumable'} required>
                        <option value="consumable" selected>consumable</option>
                        <option value="non-consumable">non-consumable</option>
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
                    <button className='btn submit d-block ml-auto mt-3'>Submit</button>
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