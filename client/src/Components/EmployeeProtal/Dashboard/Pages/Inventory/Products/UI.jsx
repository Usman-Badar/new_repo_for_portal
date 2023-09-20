import React from 'react';
import './Style.css';
import { Route, Switch, useHistory } from 'react-router-dom';
import $ from 'jquery';

const UI = ( { SearchedProductsList, ProductsList, Open, CatType, Category, SubCategory, Categories, SubCategories, setCategory, search, setCatType, setSubCategory } ) => {
    
    const history = useHistory();

    return (
        <>
            <div className="products">
                <div className="products_container">

                    <Switch>
                        <Route exact path="/inventory/products/list" render={ 
                                () => (
                                    <ListView 
                                        ProductsList={ ProductsList }
                                        history={ history }
                                        SubCategory={ SubCategory }
                                        SubCategories={ SubCategories }
                                        Categories={ Categories }
                                        CatType={ CatType }
                                        Category={ Category }
                                        SearchedProductsList={ SearchedProductsList }

                                        search={ search }
                                        setSubCategory={ setSubCategory }
                                        setCategory={ setCategory }
                                        setCatType={ setCatType }
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

const ListView = ( { SearchedProductsList, SubCategory, Category, CatType, SubCategories, Categories, ProductsList, history, setCatType, search, setSubCategory, setCategory } ) => {

    const Arr = SearchedProductsList ? SearchedProductsList : ProductsList;

    return (
        <>
            <div className="d-flex align-items-center justify-content-between">
                <h3 className="heading">
                    Inventory Products
                    <sub>List Of All Items ({Arr.length})</sub>
                </h3>
                <div>
                    <button className="btn submit px-2 filter-emit" type='button'>
                        <i className="las la-filter"></i> Filters
                        <div className="filter-container">
                            <h6 className='mb-0' style={{ fontFamily: 'Oxygen' }}>Filter Options</h6>
                            <hr className='my-1 bg-dark' />

                            <label className="font-weight-bold mb-0">Search Products</label>
                            <input placeholder='Search Keywords...' type="search" onChange={ search } className='form-control form-control-sm mb-2' />
                            
                            <label className="font-weight-bold my-2">Product Type</label>
                            <div className='d-flex align-items-center mb-2'>
                                <input type="radio" checked={ CatType === 'consumable' ? true : false } name='product_type' onChange={ () => setCatType('consumable') } className='form-control form-control-sm mr-2' />
                                <span>Consumable</span>
                            </div>
                            <div className='d-flex align-items-center mb-1'>
                                <input type="radio" checked={ CatType === 'non-consumable' ? true : false } name='product_type' onChange={ () => setCatType('non-consumable') } className='form-control form-control-sm mr-2' />
                                <span>Non-Consumable</span>
                            </div>

                            <br />
                            
                            {
                                Categories
                                ?
                                <>
                                    <label className="font-weight-bold mb-0">Category</label>
                                    <select value={ Category } className='form-control form-control-sm mb-2' onChange={ (e) => setCategory(e.target.value) }>
                                        <option value={undefined}>Select Option</option>
                                        {
                                            Categories.map(
                                                ( val, index ) => {

                                                    let content;
                                                    if ( val.type === CatType )
                                                    {
                                                        content = <option key={ index } value={ val.category_id }>{ val.name }</option>
                                                    }
                                                    return content;

                                                }
                                            )
                                        }
                                    </select>
                                </>
                                :null
                            }
                            {
                                SubCategories && Category
                                ?
                                <>
                                    <label className="font-weight-bold mb-0">Sub-Category</label>
                                    <select value={SubCategory} className='form-control form-control-sm mb-2' onChange={ (e) => setSubCategory(e.target.value) }>
                                        <option value={undefined}>Select Option</option>
                                        {
                                            SubCategories.map(
                                                ( val, index ) => {

                                                    return <option key={ index } value={ val.id }>{ val.name }</option>

                                                }
                                            )
                                        }
                                    </select>
                                </>
                                :null
                            }
                        </div>
                    </button>
                    <button className='btn light ml-2' onClick={ () => history.push('/inventory/products/create') }>Create New</button>
                </div>
            </div>
            <hr />

            {
                Arr
                ?
                Arr.length === 0
                ?
                <h6 className="text-center">No Record Found</h6>
                :
                <table className="table table-sm">
                    <thead>
                        <tr>
                            <th>Sr.No</th>
                            <th colSpan={4}>Product</th>
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
                                        <tr key={ index }>
                                            {/*  onClick={ () => history.push('/inventory/workshop/report/' + val.sub_category_id) } */}
                                            <td>{ index + 1 }</td>
                                            <td className='align-items-center'>
                                                <span id={ 'icons-bg' + index } style={ { backgroundColor: currentColor.bg } } className='icons-bg' dangerouslySetInnerHTML={{__html: val.sub_category_icon}}></span>
                                            </td>
                                            <td>
                                                <b>{ val.sub_category_name }</b> <br />
                                                <b>{ val.product_physical_quantity }<sub>Qty</sub> </b> { parseInt(val.product_physical_quantity) === 1 ? " is " : " are " } available 
                                            </td>
                                            <td>
                                                <b>Category</b> <br />
                                                <span>{ val.category_name }</span>
                                            </td>
                                            <td>
                                                <div className="d-flex">
                                                    <span title="View Details" className='iconic' onDoubleClick={ () => history.push('/inventory/products/details/' + val.product_id) }><i className="las la-eye"></i></span>
                                                    {/* <span title="Edit Product" className='iconic'><i className="las la-edit"></i></span>
                                                    <span title="Delete Product" className='iconic'><i className="las la-trash"></i></span> */}
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
                <h6 className="text-center">Please Wait...</h6>
            }
        </>
    )

}