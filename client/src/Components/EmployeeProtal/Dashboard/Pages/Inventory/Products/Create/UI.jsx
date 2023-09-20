import React from 'react';
import './Style.css';

import $ from 'jquery';
import { useHistory } from 'react-router-dom';

function UI({ Preview, VendorSearch, DescriptionSearch, DeliveryChallans, AttachedDC, Attributes, AttrType,NewAttribute, Type, Category, SubCategories, ShowResults, SubLocations, Companies, Locations, setAttributes, onFileSelection, onCreateProduct, setAttachedDC, setVendorSearch, setDescriptionSearch, setAttrType, onAddAttribute, selectSubCategory, setNewAttribute, searchSubCategories, setShowResults, GetSubLocations }) {

    const history = useHistory();
    const DCArr = DeliveryChallans.filter(
        val => {
            return val.vendor_name.toLowerCase().includes(VendorSearch.toLowerCase()) && val.description.toLowerCase().includes(DescriptionSearch.toLowerCase());
        }
    );
    const attachDC = ( val ) => {

        if ( AttachedDC && AttachedDC.challan_id === val.challan_id )
        {
            setAttachedDC();
        }else
        {
            setAttachedDC(val);
        }

    }
    const uploadPreview = () => {

        $('.uploadPreview').trigger('click');

    }
    const removeAttr = (id) => {
        const arr = Attributes.filter(
            ( val, index ) => {
                return index !== id;
            }
        );
        setAttributes(arr);
    }

    return (
        <>
            <div className="create_product page">
                <div className="create_product_container page-content">

                    <div className="d-flex align-items-center justify-content-between">
                        <h3 className="heading">
                            Create New Product
                            <sub>Enter The details</sub>
                        </h3>

                        <button className="btn submit" onClick={ () => history.push('/inventory/products/list') } type='button'>Back To List</button>
                    </div>
                    <hr />

                    <form onSubmit={ onCreateProduct }>
                        <fieldset>
                            <div className='grid-container'>
                                <div>
                                    <label className='mb-0'><b>Company</b></label>
                                    <select className="form-control" name="company_code" required>
                                        <option value=''>Select the option</option>
                                        {
                                            Companies.map(
                                                val => {

                                                    return <option key={ val.company_code } value={ val.company_code }> { val.company_name } </option>

                                                }
                                            )
                                        }
                                    </select>
                                </div>
                                <div>
                                    <label className='mb-0'><b>Location</b></label>
                                    <select className="form-control" name="location_code" onChange={ (e) => GetSubLocations(e.target.value) } required>
                                        <option value=''>Select the option</option>
                                        {
                                            Locations.map(
                                                val => {

                                                    return <option key={ val.location_code } value={ val.location_code }> { val.location_name } </option>

                                                }
                                            )
                                        }
                                    </select>
                                </div>
                                <div>
                                    <label className='mb-0'><b>Sub-Location</b></label>
                                    <select className='form-control' name="sub_location_code" required>
                                        <option value=''>Select the option</option>
                                        {
                                            SubLocations.map(
                                                ( val, index ) => {
                                                    return <option value={ val.sub_location_code } key={index}>{ val.sub_location_name }</option>
                                                }
                                            )
                                        }
                                    </select>
                                </div>
                                <div className='search-box'>
                                    <label className='mb-0'><b>Sub-Category</b></label>
                                    <input type='search' id="sub_category_input" placeholder='Search Sub Categories....' onChange={ searchSubCategories } onFocus={ () => setShowResults(true) } onBlur={ () => setTimeout(() => {setShowResults(false)}, 100) } className="form-control" name="product_sub_category" required />
                                    {
                                        ShowResults 
                                        ? 
                                        <div className='search-result'>
                                            {
                                                SubCategories.map(
                                                    ( val, index ) => {
                                                        return (
                                                            <div key={index}>
                                                                <p onClick={() => selectSubCategory(index)} className='mb-0 font-weight-bold border-bottom p-1' style={{ cursor: 'pointer', transition: '.3s', fontSize: '14px' }}>{val.name}</p>
                                                            </div>
                                                        )
                                                    }
                                                )
                                            }
                                        </div> 
                                        :null
                                    }
                                </div>
                                <div>
                                    <label className='mb-0'><b>Category</b></label>
                                    <input className="form-control" name="product_category" value={ Category ? Category.name : '' } disabled required />
                                </div>
                                <div>
                                    <label className='mb-0'><b>Product Type</b></label>
                                    <input className="form-control" value={ Type } disabled name="product_type" />
                                </div>
                                <div>
                                    <label className='mb-0'><b>Name</b></label>
                                    <input className="form-control" name="name" required />
                                </div>
                                <div>
                                    <label className='mb-0'><b>Description</b></label>
                                    <input className="form-control" name="description" required />
                                </div>
                                <div>
                                    <label className='mb-0'><b>Acquisition Date</b></label>
                                    <input type='date' className="form-control" name="acquisition_date" required />
                                </div>
                                <div>
                                    <label className='mb-0'><b>Quantity</b></label>
                                    <input type='number' className="form-control" name="quantity" required />
                                </div>
                                <div>
                                    <label className='mb-0'><b>Unit Price</b></label>
                                    <input type='number' className="form-control" name="unit_price" required />
                                </div>
                                <div>
                                    <label className='mb-0'><b>Physical Condition</b></label>
                                    <select className="form-control" name="physical_condition" required>
                                        <option value="">Select the option</option>
                                        <option value="Unworn">Unworn</option>
                                        <option value="Very Good">Very Good</option>
                                        <option value="Good">Good</option>
                                        <option value="Fair">Fair</option>
                                        <option value="Poor">Poor</option>
                                        <option value="Incomplete">Incomplete</option>
                                    </select>
                                </div>
                            </div>
                            <label className='mb-0 mt-3'><b>Note</b></label>
                            <textarea className="form-control" name="note" required />
                            <div className='grid-container-2-4-4 mt-3'>
                                <div>
                                    <div className='preview'>
                                        <div onClick={ uploadPreview } className='dark'></div>
                                        <img src={ 
                                            Preview?.file
                                            ?
                                            URL.createObjectURL(Preview.file)
                                            : 'https://i.stack.imgur.com/Q3vyk.png' 
                                        } alt="preview" width='100%' />
                                        <div className='circle' onClick={ uploadPreview }>
                                            <i className="las la-camera"></i>
                                        </div>
                                        <input type='file' className='d-none uploadPreview' onChange={ onFileSelection } accept='image/png, image/gif, image/jpeg, image/jpg' />
                                    </div>
                                </div>
                                <div>
                                    <div className='d-flex align-items-start justify-content-between pr-3 mb-3'>
                                        <h4 className='mb-0'>Attributes</h4>
                                        <div style={{ position: 'relative' }}>
                                            <i className={ "las " + ( NewAttribute ? "la-times" : "la-plus" ) } onClick={ () => setNewAttribute(!NewAttribute) }></i>
                                            {
                                                NewAttribute
                                                ?
                                                <div className='new-attribute'>
                                                    <label className='mb-0 mt-3'><b>Key</b></label>
                                                    <input className="form-control" id="key" required />
                                                    <label className='mb-0 mt-3'><b>Data Type</b></label>
                                                    <select className="form-control" value={ AttrType } id="type" onChange={ (e) => setAttrType(e.target.value) } required>
                                                        <option value="value_str">text</option>
                                                        <option value="value_int">number</option>
                                                        <option value="value_float">decimal</option>
                                                        <option value="value_date">date</option>
                                                        <option value="value_time">time</option>
                                                    </select>
                                                    <label className='mb-0 mt-3'><b>Value</b></label>
                                                    <input type={AttrType === 'value_time'?"time":AttrType === 'value_int'?"number":AttrType === 'value_float'?"number":AttrType === 'value_date'?"date":"text"} className="form-control" id="value" required />
                                                    <div className='d-flex mt-3 justify-content-end'>
                                                        <button type='button' className='btn light mr-2' onClick={ () => setNewAttribute(!NewAttribute) }>Cancel</button>
                                                        <button type='button' className='btn submit' onClick={ onAddAttribute }>Add</button>
                                                    </div>
                                                </div>
                                                :null
                                            }
                                        </div>
                                    </div>
                                    {
                                        Attributes.length === 0
                                        ?
                                        <>
                                            <hr />
                                            <h6 className='text-center'>No Attribute Added</h6>
                                        </>
                                        :
                                        <div style={{ maxHeight: '40vh', overflow: 'overlay' }}>
                                            <table className='table table-striped'>
                                                <thead>
                                                    <tr>
                                                        <th>Key</th>
                                                        <th>Type</th>
                                                        <th colSpan={2}>Value</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        Attributes.map(
                                                            ( val, index ) => {
                                                                return (
                                                                    <tr key={index}>
                                                                        <td>{ val.key }</td>
                                                                        <td>{ val.type === 'value_time'?"time":val.type === 'value_int'?"number":val.type === 'value_float'?"number":val.type === 'value_date'?"date":"text" }</td>
                                                                        <td>{ val.value }</td>
                                                                        <td>
                                                                            <i className="las la-backspace la-2x" onDoubleClick={ () => removeAttr(index) } style={{ cursor: 'pointer' }}></i>
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
                                </div>
                                <div>
                                    <div className='d-flex align-items-center justify-content-between mb-4'>
                                        <h4 className='mb-0'>Attach Delivery Challan</h4>
                                        <button className="btn light filter-emit" type='button'>
                                            Filters
                                            <div className="filter-container">
                                                <h6 className='mb-0' style={{ fontFamily: 'Oxygen' }}>Filter Options</h6>
                                                <hr className='my-1 bg-dark' />

                                                <label className="font-weight-bold mb-0">Search Vendor</label>
                                                <input placeholder='Search Keywords...' type="search" onChange={ (e) => setVendorSearch(e.target.value.toLowerCase()) } className='form-control form-control-sm mb-2' />

                                                <label className="font-weight-bold mb-0">Search Description</label>
                                                <input placeholder='Search Keywords...' type="search" onChange={ (e) => setDescriptionSearch(e.target.value.toLowerCase()) } className='form-control form-control-sm mb-2' />
                                            </div>
                                        </button>
                                    </div>
                                    <div style={{ maxHeight: '40vh', overflow: 'overlay' }}>
                                        <table className='table table-striped'>
                                            <thead>
                                                <tr>
                                                    <th>Sr.No</th>
                                                    <th>Vendor</th>
                                                    <th>Date</th>
                                                    <th>Description</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    DCArr.map(
                                                        ( val, index ) => {
                                                            const d = new Date(val.generate_date);
                                                            return (
                                                                <tr key={index} className='pointer' onClick={ () => attachDC( val ) }>
                                                                    <td>{ index + 1 }</td>
                                                                    <td>{ val.vendor_name }</td>
                                                                    <td>{ d.toDateString() }</td>
                                                                    <td>
                                                                        <div className='d-flex align-items-center justify-content-between'>
                                                                            <span>{ val.description }</span>
                                                                            {
                                                                                AttachedDC && AttachedDC.challan_id === val.challan_id
                                                                                ?
                                                                                <span className='badging'>attached</span>
                                                                                :null
                                                                            }
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            )
                                                        }
                                                    )
                                                }
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                            <button className='btn submit d-block ml-auto' type='submit'>Create Product</button>
                        </fieldset>
                    </form>
                </div>
            </div>
        </>
    )
}

export default UI;