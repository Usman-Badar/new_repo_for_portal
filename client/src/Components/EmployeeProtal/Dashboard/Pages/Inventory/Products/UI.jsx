import React, { useState } from 'react';
import './Style.css';
import { Route, Switch, useHistory } from 'react-router-dom';
import $ from 'jquery';
import ReactTooltip from 'react-tooltip';

const UI = ( { CompanyCode, LocationCode, SubLocationCode, ShowZeroValues, SubLocations, Locations, Companies, SearchedProductsList, ProductsList, Open, CatType, Category, SubCategory, Categories, SubCategories, setShowZeroValues, setSubLocationCode, setLocationCode, setCompanyCode, setCategory, search, setCatType, setSubCategory } ) => {
    
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
                                        Companies={ Companies }
                                        Locations={ Locations }
                                        SearchedProductsList={ SearchedProductsList }
                                        SubLocations={ SubLocations }
                                        ShowZeroValues={ ShowZeroValues }
                                        CompanyCode={ CompanyCode }
                                        LocationCode={ LocationCode }
                                        SubLocationCode={ SubLocationCode }
                    
                                        setShowZeroValues={ setShowZeroValues }
                                        setSubLocationCode={ setSubLocationCode }
                                        setLocationCode={ setLocationCode }
                                        search={ search }
                                        setSubCategory={ setSubCategory }
                                        setCategory={ setCategory }
                                        setCatType={ setCatType }
                                        setCompanyCode={ setCompanyCode }
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

const ListView = ( { CompanyCode, LocationCode, SubLocationCode, ShowZeroValues, SubLocations, Locations, Companies, SearchedProductsList, SubCategory, Category, CatType, SubCategories, Categories, ProductsList, history, setShowZeroValues, setLocationCode, setSubLocationCode, setCatType, search, setSubCategory, setCategory, setCompanyCode } ) => {

    const [ ShowFilters, setShowFilters ] = useState(false);
    const Arr = SearchedProductsList ? SearchedProductsList : ProductsList;

    const resetFilters = () => {
        sessionStorage.removeItem('productLocation');
        sessionStorage.removeItem('productCompany');
        sessionStorage.removeItem('productSubLocation');
        setCompanyCode("");
        setLocationCode("");
        setSubLocationCode('');
    }

    return (
        <>
            <div className="d-flex align-items-center justify-content-between">
                <h3 className="heading">
                    Inventory Products
                    <sub>List Of All Items ({Arr.length})</sub>
                </h3>
                <div>
                    <button className='btn light ml-2' onClick={ () => history.push('/inventory/products/create') }>Create New</button>
                    <button className="btn submit px-2 ml-2 filter-emit" onClick={() => setShowFilters(!ShowFilters)} type='button'>
                        {
                            ShowFilters
                                ?
                                <>
                                    <i className="las la-times"></i>
                                </>
                                :
                                <div data-tip data-for='filter'>
                                    {
                                        CompanyCode || LocationCode || LocationCode
                                        ?
                                        <div className='filterisOpen'></div>
                                        :
                                        null
                                    }
                                    <i className="las la-filter"></i>
                                    <ReactTooltip id='filter' place="top">
                                        Filters
                                    </ReactTooltip>
                                </div>
                        }
                    </button>
                </div>
            </div>
            <hr />
            {
                ShowFilters
                    ?
                    <>
                        <div className='filter-content popUps'>
                            <div className='flex'>
                                {
                                    Companies && (
                                        <div className='w-100 searchDiv'>
                                            <label className="font-weight-bold mb-0">Company</label>
                                            <select value={CompanyCode} onChange={(e) => {
                                                setCompanyCode(e.target.value);
                                                sessionStorage.setItem('productCompany', e.target.value);
                                            }} className='form-control form-control-sm mb-2'>
                                                <option value=''>All</option>
                                                {Companies.map((val, index) => <option key={index} value={val.company_code}>{val.company_name}</option>)}
                                            </select>
                                        </div>
                                    )
                                }
                                {
                                    Locations && Locations.length > 0 && (
                                        <div className='w-100 searchDiv'>
                                            <label className="font-weight-bold mb-0">Location</label>
                                            <select value={LocationCode} onChange={(e) => {
                                                setLocationCode(e.target.value);
                                                sessionStorage.setItem('productLocation', e.target.value);
                                            }} className='form-control form-control-sm mb-2'>
                                                <option value=''>All</option>
                                                {Locations.map((val, index) => <option key={index} value={val.location_code}>{val.location_name}</option>)}
                                            </select>
                                        </div>
                                    )
                                }
                                {
                                    SubLocations && SubLocations.length > 0 && (
                                        <div className='w-100 searchDiv'>
                                            <label className="font-weight-bold mb-0">Sub Location</label>
                                            <select value={SubLocationCode} onChange={(e) => {
                                                setSubLocationCode(e.target.value);
                                                sessionStorage.setItem('productSubLocation', e.target.value);
                                            }} className='form-control form-control-sm mb-2'>
                                                <option value=''>All</option>
                                                {SubLocations.map((val, index) => <option key={index} value={val.sub_location_code}>{val.sub_location_name}</option>)}
                                            </select>
                                        </div>
                                    )
                                }
                                {
                                    Categories
                                        ?
                                        <div className='w-100 searchDiv'>
                                            <label className="font-weight-bold mb-0">Category</label>
                                            <select value={Category} className='form-control form-control-sm mb-2' onChange={(e) => setCategory(e.target.value)}>
                                                <option value=''>All</option>
                                                {
                                                    Categories.map(
                                                        (val, index) => {

                                                            let content;
                                                            if (val.type === CatType) {
                                                                content = <option key={index} value={val.category_id}>{val.name}</option>
                                                            }
                                                            return content;

                                                        }
                                                    )
                                                }
                                            </select>
                                        </div>
                                        : null
                                }
                                {
                                    SubCategories && Category
                                        ?
                                        <div className='w-100 searchDiv'>
                                            <label className="font-weight-bold mb-0">Sub-Category</label>
                                            <select value={SubCategory} className='form-control form-control-sm mb-2' onChange={(e) => setSubCategory(e.target.value)}>
                                                <option value=''>All</option>
                                                {
                                                    SubCategories.map(
                                                        (val, index) => {

                                                            return <option key={index} value={val.id}>{val.name}</option>

                                                        }
                                                    )
                                                }
                                            </select>
                                        </div>
                                        : null
                                }
                                <div className='w-100 searchDiv'>
                                    <label className="font-weight-bold mb-0">Search Products</label>
                                    <input id="searchProduct" placeholder='Search Keywords...' type="search" onChange={search} className='form-control form-control-sm mb-2' />
                                </div>
                                <div className='w-100 searchDiv'>
                                    <label className="font-weight-bold my-2">Product Type</label>
                                    <div className='d-flex align-items-center mb-2'>
                                        <input type="radio" checked={CatType === 'consumable' ? true : false} name='product_type' onChange={() => setCatType('consumable')} className='form-control form-control-sm mr-2' />
                                        <span>Consumable</span>
                                    </div>
                                    <div className='d-flex align-items-center mb-1'>
                                        <input type="radio" checked={CatType === 'non-consumable' ? true : false} name='product_type' onChange={() => setCatType('non-consumable')} className='form-control form-control-sm mr-2' />
                                        <span>Non-Consumable</span>
                                    </div>
                                </div>
                                <div className='w-100 searchDiv'>
                                    <label className="font-weight-bold my-2">Include Zero Values</label>
                                    <div className='d-flex align-items-center mb-2'>
                                        <input type="radio" checked={ShowZeroValues} name='zero_values' onChange={() => setShowZeroValues(true)} className='form-control form-control-sm mr-2' />
                                        <span>Include</span>
                                    </div>
                                    <div className='d-flex align-items-center mb-1'>
                                        <input type="radio" checked={!ShowZeroValues} name='zero_values' onChange={() => setShowZeroValues(false)} className='form-control form-control-sm mr-2' />
                                        <span>Exclude</span>
                                    </div>
                                </div>
                                <button className='btn green d-block ml-auto mt-2' type='button' onClick={resetFilters}>Reset All</button>
                            </div>
                        </div>
                        <br />
                    </>
                    : null
            }

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
                            <th className='border-top-0'>Sr.No</th>
                            <th className='border-top-0' colSpan={4}>Product</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            Arr.filter(val => {
                                if (!ShowZeroValues) {
                                    return parseInt(val.product_physical_quantity) > 0
                                }
                                return true;
                            }).map(
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
                                                <b className={parseInt(val.product_physical_quantity) <= 0 ? 'text-danger' : 'text-success'}>{ val.product_physical_quantity }<sub>Qty</sub> </b> { parseInt(val.product_physical_quantity) === 1 ? " is " : " are " } available 
                                            </td>
                                            <td>
                                                <b>Category</b> <br />
                                                <span>{ val.category_name }</span>
                                            </td>
                                            <td>
                                                <div className="d-flex">
                                                    <span title="View Details" className='iconic' onClick={ () => history.push('/inventory/products/details/' + val.product_id) }><i className="las la-eye"></i></span>
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