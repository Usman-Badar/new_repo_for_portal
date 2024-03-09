/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import './Style.css';
import $ from 'jquery';
import { Route, Switch, useHistory } from 'react-router-dom';
import Modal from '../../../../../../UI/Modal/Modal';

const UI = ( { AttachedDC, CreateInward, Employees, OutwardDetails, InwardOutward, SubLocations, Locations, Companies, EditDetails, Confirmation, InOutDetails, ShowDetails, Amount, Month, Name, View, Inward, Outward, Product, onCreateInward, setAttachedDC, loadDeliveryChallans, setCreateInward, onCreateOutward, loadEmployees, setOutwardDetails, createOutward, GetSubLocations, loadOutwards, GetLocations, GetCompanies, updateDetails, onFileSelection, setEditDetails, setConfirmation, viewDetails, deleteTransaction, printLabel, generateLabel, setShowDetails, setView, searchAmount, searchMonth, searchName, getProductDetails } ) => {

    const history = useHistory();

    useEffect(
        () => {
            GetCompanies();
            GetLocations();
        }, []
    )

    useEffect(
        () => {
            if ( EditDetails )
            {
                GetSubLocations( EditDetails.location_code )
            }else
            if ( OutwardDetails )
            {
                GetSubLocations( OutwardDetails.location_code );
            }
        }, [ EditDetails, OutwardDetails ]
    )

    return (
        <>
            <div className="product_details">
                <div className="product_details_container">
                    <Modal show={ ShowDetails } Hide={ () => setShowDetails(!ShowDetails) } content={ <ModalDetails Product={ Product } InwardOutward={ InwardOutward } loadOutwards={ loadOutwards } printLabel={ printLabel } InOutDetails={ InOutDetails } generateLabel={ generateLabel } /> } />
                    { CreateInward ? <Modal show={ CreateInward } Hide={ () => setCreateInward(!CreateInward) } content={ <CreateInwardModal onCreateInward={ onCreateInward } AttachedDC={ AttachedDC } setAttachedDC={ setAttachedDC } loadDeliveryChallans={ loadDeliveryChallans } SubLocations={ SubLocations } GetSubLocations={ GetSubLocations } Companies={ Companies } Locations={ Locations } /> } /> :null }
                    {
                        Confirmation
                        ?
                        <Modal show={ true } Hide={ () => setConfirmation() } content={ Confirmation } />
                        :null
                    }
                    {
                        EditDetails
                        ?
                        <Modal show={ true } Hide={ () => setEditDetails() } content={ <ModalEditDetails GetSubLocations={ GetSubLocations } SubLocations={ SubLocations } Locations={ Locations } Companies={ Companies } updateDetails={ updateDetails } EditDetails={ EditDetails } onFileSelection={ onFileSelection } /> } />
                        :null
                    }
                    {
                        OutwardDetails
                        ?
                        <Modal show={ true } Hide={ () => setOutwardDetails() } content={ <OutwardView onCreateOutward={ onCreateOutward } Employees={ Employees } loadEmployees={ loadEmployees } OutwardDetails={ OutwardDetails } GetSubLocations={ GetSubLocations } Locations={ Locations } SubLocations={ SubLocations } /> } />
                        :null
                    }
                    <Switch>
                        <Route exact path="/inventory/products/details/:id" render={ 
                                () => (
                                    <MainView 
                                        Product={ Product }
                                        Inward={ Inward }
                                        Outward={ Outward }
                                        View={ View }
                                        Name={ Name }
                                        Month={ Month }
                                        Amount={ Amount }
                                        history={ history }

                                        setCreateInward={ setCreateInward }
                                        createOutward={ createOutward }
                                        setEditDetails={ setEditDetails }
                                        deleteTransaction={ deleteTransaction }
                                        viewDetails={ viewDetails }
                                        searchAmount={ searchAmount }
                                        searchMonth={ searchMonth }
                                        searchName={ searchName }
                                        setView={ setView }
                                        getProductDetails={ getProductDetails }
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

const MainView = ( { history, Name, Month, Amount, View, Inward, Outward, Product, setView, viewDetails, setCreateInward, setEditDetails, createOutward, getProductDetails, searchAmount, searchMonth, searchName, deleteTransaction } ) => {

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

    const ArrInward = Inward.filter(
        val => {
            const total_amount = parseInt(val.stored_quantity)*parseFloat(val.unit_price).toFixed(2);
            return val.name.toLowerCase().includes(Name.toLowerCase()) && val.record_date.toLowerCase().includes(Month.toLowerCase()) && total_amount >= parseFloat(Amount).toFixed(2);
        }
    );

    const ArrOutward = Outward.filter(
        val => {
            const total_amount = parseInt(val.quantity)*parseFloat(val.unit_price).toFixed(2);
            return val.name.toLowerCase().includes(Name.toLowerCase()) && val.record_date.toLowerCase().includes(Month.toLowerCase()) && total_amount >= parseFloat(Amount).toFixed(2);
        }
    );

    useEffect(
        () => {

            getProductDetails();

        }, []
    )

    return (
        <>
            {
                Product
                ?
                <div className='main_view_container'>
                    <div className='upper_view'>
                        <div className='d-flex align-items-center'>
                            <span id='icons-bg' style={ { backgroundColor: currentColor.bg } } className='icons-bg mr-3' dangerouslySetInnerHTML={{__html: Product.sub_category_icon}}></span>
                            <div>
                                <h5 className='font-weight-bold mb-0'>{ Product.sub_category_name }</h5>
                                <span className='text-capitalize'>{ Product.product_type } <b>/</b> { Product.category_name } <b>/</b> { new Date(Product.recording_date).toDateString() }</span>
                            </div>
                        </div>
                        <div className='btn-group'>
                            <button className='btn py-2 light' onClick={ () => history.replace('/inventory/products/list') }>Back</button>
                            {/* <button className='btn py-2 cancle'>Remove Product</button>
                            <button className='btn py-2 submit'>Edit Product</button> */}
                        </div>
                    </div>
                    <div className='calc_container'>
                        <div>
                            <h1 className='mb-0'><i className="las la-warehouse"></i> { Product.quantity }</h1>
                            <span>Total Stored Quantity</span>
                        </div>
                        <div>
                            <h1 className='mb-0'><i className="las la-sort-amount-up-alt"></i> { Inward.length > 0 ? Inward.map(item => item.quantity).reduce((prev, next) => prev + next) : 0 }</h1>
                            <span>Total Inward Quantity</span>
                        </div>
                        <div>
                            <h1 className='mb-0'><i className="las la-sort-amount-down"></i> { Outward.length > 0 ? Outward.map(item => item.quantity).reduce((prev, next) => prev + next) : 0 }</h1>
                            <span>Total Outward Quantity</span>
                        </div>
                        <div className='border-0'>
                            <h1 className='mb-0'><i className="las la-user-tag"></i> { Outward.length > 0 ? Outward.map(item => item.status === 'issued' ? item.quantity : 0).reduce((prev, next) => prev + next) : 0 }</h1>
                            <span>Total Quantity Issued</span>
                        </div>
                    </div>
                    <div className='d-flex align-items-center justify-content-between mt-4'>
                        <div className='d-flex align-items-center'>
                            <button onClick={ () => setView(1) } className={ View === 1 ? ' btn submit' : 'btn' }>Inward <sup>({Inward.filter(val => val.company_code.toString().includes(sessionStorage.getItem('productCompany') || "") && val.location_code.toString().includes(sessionStorage.getItem('productLocation') || "") && val.sub_location_code.toString().includes(sessionStorage.getItem('productSubLocation') || "")).length})</sup></button>
                            <button onClick={ () => setView(2) } className={ View === 2 ? ' btn submit' : 'btn' }>Outward <sup>({Outward.filter(val => val.company_code.toString().includes(sessionStorage.getItem('productCompany') || "") && val.location_code.toString().includes(sessionStorage.getItem('productLocation') || "") && val.sub_location_code.toString().includes(sessionStorage.getItem('productSubLocation') || "")).length})</sup></button>
                        </div>
                        <div>
                            <button className="btn light filter-emit" type='button'>
                                Filters
                                <div className="filter-container">
                                    <h6 className='mb-0' style={{ fontFamily: 'Oxygen' }}>Filter Options</h6>
                                    <hr className='my-1 bg-dark' />

                                    <label className="font-weight-bold mb-0">Search Name</label>
                                    <input placeholder='Search Keywords...' type="search" onChange={ (e) => searchName(e.target.value) } className='form-control form-control-sm mb-2' />

                                    <label className="font-weight-bold mb-0">Recording Date</label>
                                    <input type="month" onChange={ (e) => searchMonth(e.target.value) } className='form-control form-control-sm mb-2' />
                                    
                                    <label className="font-weight-bold mb-0">Total Amount</label>
                                    <input placeholder='0.00' type="number" onChange={ (e) => searchAmount(e.target.value.length === 0 ? 0 : e.target.value) } min={0} className='form-control form-control-sm mb-2' />
                                </div>
                            </button>
                            <button className='btn submit ml-2' type='button' onClick={ setCreateInward }>
                                Create Inward
                            </button>
                        </div>
                    </div>
                    <div className='transactions_view'>
                        {
                            View === 1
                            ?
                            ArrInward.filter(val => val.company_code.toString().includes(sessionStorage.getItem('productCompany') || "") && val.location_code.toString().includes(sessionStorage.getItem('productLocation') || "") && val.sub_location_code.toString().includes(sessionStorage.getItem('productSubLocation') || "")).length === 0
                            ?
                            <h6>No Inward Found</h6>
                            :
                            ArrInward.filter(val => val.company_code.toString().includes(sessionStorage.getItem('productCompany') || "") && val.location_code.toString().includes(sessionStorage.getItem('productLocation') || "") && val.sub_location_code.toString().includes(sessionStorage.getItem('productSubLocation') || "")).map(
                                ( val, index ) => {
                                    return (
                                        <div className='card-div' key={index}>
                                            <div className='preview' onClick={ () => viewDetails( val ) }>
                                                <img src={ val.preview ? ( process.env.REACT_APP_SERVER + '/assets/inventory/assets/images/' + val.preview) : 'https://i.stack.imgur.com/Q3vyk.png' } alt="preview" width='100%' />
                                            </div>
                                            <div className='body'>
                                                <div className='d-flex justify-content-between' onClick={ () => viewDetails( val ) }>
                                                    <h5>{ val.name }</h5>
                                                    <div>
                                                        <h5 className='mb-0'>{ new Date(val.record_date).getDate() + '/' + (new Date(val.record_date).getMonth()+1) + '/' + new Date(val.record_date).getFullYear().toString().substring(2,4) }</h5>
                                                        <small className='font-weight-bold text-secondary'>Recording Date</small>
                                                    </div>
                                                </div>
                                                <p onClick={ () => viewDetails( val ) }>
                                                    { val.description } <br />
                                                    { val.company_name } &#9679; { val.location_name } <br />
                                                    { val.note } <br />
                                                    <b><span className='text-primary'>{ val.stored_quantity }</span> Qty</b> &#215; <b>Rs <span className='text-primary'>{ parseFloat(val.unit_price).toFixed(2) }</span></b> &#9679; <b>Rs <span className='text-primary'>{ parseFloat(val.stored_quantity*val.unit_price).toFixed(2) }</span></b> <br />
                                                </p>
                                                <div className='btn-group' style={{ width: 'fit-content', margin: 'auto', display: 'block' }}>
                                                    <button className='btn submit' onClick={ () => createOutward( val ) }>Outward</button>
                                                    <button className='btn light' onClick={ () => setEditDetails( val ) }>Edit</button>
                                                    <button className='btn cancle' onClick={ () => deleteTransaction( val ) }>Delete</button>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                }
                            )
                            :null
                        }

                        {
                            View === 2
                            ?
                            ArrOutward.filter(val => val.company_code.toString().includes(sessionStorage.getItem('productCompany') || "") && val.location_code.toString().includes(sessionStorage.getItem('productLocation') || "") && val.sub_location_code.toString().includes(sessionStorage.getItem('productSubLocation') || "")).length === 0
                            ?
                            <h6>No Outward Found</h6>
                            :
                            ArrOutward.filter(val => val.company_code.toString().includes(sessionStorage.getItem('productCompany') || "") && val.location_code.toString().includes(sessionStorage.getItem('productLocation') || "") && val.sub_location_code.toString().includes(sessionStorage.getItem('productSubLocation') || "")).map(
                                ( val, index ) => {
                                    return (
                                        <div className='card-div' key={index} onClick={ () => viewDetails( val ) }>
                                            <div className='preview'>
                                            <img src={ val.preview ? (process.env.REACT_APP_SERVER + '/assets/inventory/assets/images/' + val.preview) : 'https://i.stack.imgur.com/Q3vyk.png' } alt="preview" width='100%' />
                                            </div>
                                            <div className='body'>
                                                <div className='d-flex justify-content-between'>
                                                    <h5>{ val.name }</h5>
                                                    <div>
                                                        <h5 className='mb-0'>{ new Date(val.record_date).getDate() + '/' + (new Date(val.record_date).getMonth()+1) + '/' + new Date(val.record_date).getFullYear().toString().substring(2,4) }</h5>
                                                        <small className='font-weight-bold text-secondary'>Recording Date</small>
                                                    </div>
                                                </div>
                                                <p>
                                                    { val.description } <br />
                                                    { val.company_name } &#9679; { val.location_name } <br />
                                                    { val.note } <br />
                                                    <b><span className='text-primary'>{ val.quantity }</span> Qty</b> &#215; <b>Rs <span className='text-primary'>{ parseFloat(val.unit_price).toFixed(2) }</span></b> &#9679; <b>Rs <span className='text-primary'>{ parseFloat(val.quantity*val.unit_price).toFixed(2) }</span></b> <br />
                                                </p>
                                            </div>
                                        </div>
                                    )
                                }
                            )
                            :null
                        }
                    </div>
                </div>
                :
                <h6 className='text-center mb-0'>Please Wait....</h6>
            }
        </>
    )

}

const ModalEditDetails = ( { SubLocations, Locations, Companies, EditDetails, updateDetails, GetSubLocations, onFileSelection } ) => {

    const uploadPreview = () => {

        $('.uploadPreview').trigger('click');

    }

    return (
        <>
            <form onSubmit={ updateDetails } className='border p-3'>
                <fieldset>
                    <div className='d-flex align-items-center justify-content-between'>
                        <h4 className='mb-0'>Edit Details</h4>
                        <button className='btn submit' type='submit'>Update</button>
                    </div>
                    <hr />
                    <div className='model-details-grid'>
                        <div>
                            <div className='preview'>
                                <div onClick={ uploadPreview } className='dark'></div>
                                <img src={ 
                                    EditDetails.file
                                    ?
                                    URL.createObjectURL(EditDetails.file)
                                    :
                                    EditDetails.preview ? 
                                    (process.env.REACT_APP_SERVER + '/assets/inventory/assets/images/' + EditDetails.preview) 
                                    : 'https://i.stack.imgur.com/Q3vyk.png' 
                                } alt="preview" width='100%' />
                                <div className='circle' onClick={ uploadPreview }>
                                    <i className="las la-camera"></i>
                                </div>
                                <input type='file' className='d-none uploadPreview' onChange={ onFileSelection } accept='image/png, image/gif, image/jpeg, image/jpg' />
                            </div>
                        </div>
                        <div>
                            <label className='mb-0 font-weight-bold'>Name</label>
                            <input type='text' className='form-control mb-2' defaultValue={ EditDetails.name } name="name" />
                            <label className='mb-0 font-weight-bold'>Description</label>
                            <input type='text' className='form-control mb-2' defaultValue={ EditDetails.description } name="description" />
                            <label className='mb-0 font-weight-bold'>Note</label>
                            <textarea type='text' className='form-control mb-2' defaultValue={ EditDetails.note } name="note" />
                            
                            <table className='table table-sm table-borderless'>
                                <tbody>
                                    <tr>
                                        <th>Company</th>
                                        <th>Location</th>
                                    </tr>
                                    <tr>
                                        <td>
                                            <select className='form-control' name="company_code" disabled={ Companies.length === 0 }>
                                                {
                                                    Companies.map(
                                                        ( val, index ) => {
                                                            return <option value={ val.company_code } selected={ val.company_code === EditDetails.company_code } key={index}>{ val.company_name }</option>
                                                        }
                                                    )
                                                }
                                            </select>
                                        </td>
                                        <td>
                                            <select className='form-control' name="location_code" disabled={ Locations.length === 0 } onChange={ ( e ) => GetSubLocations( e.target.value ) }>
                                                {
                                                    Locations.map(
                                                        ( val, index ) => {
                                                            return <option value={ val.location_code } selected={ val.location_code === EditDetails.location_code } key={index}>{ val.location_name }</option>
                                                        }
                                                    )
                                                }
                                            </select>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>Sub Location</th>
                                        <th>Inward Quantity</th>
                                    </tr>
                                    <tr>
                                        <td>
                                            <select className='form-control' name="sub_location_code" disabled={ SubLocations.length === 0 }>
                                                {
                                                    SubLocations.map(
                                                        ( val, index ) => {
                                                            return <option value={ val.sub_location_code } selected={ val.sub_location_code === EditDetails.sub_location_code } key={index}>{ val.sub_location_name }</option>
                                                        }
                                                    )
                                                }
                                            </select>
                                        </td>
                                        <td>
                                            {
                                                EditDetails.quantity !== EditDetails.stored_quantity
                                                ?
                                                <>
                                                    <input type='number' className='form-control' defaultValue={ EditDetails.quantity } name="quantity" disabled />
                                                    <small>{EditDetails.stored_quantity} left from {EditDetails.quantity}, you cannot change the value.</small>
                                                </>
                                                :
                                                <input type='number' className='form-control' defaultValue={ EditDetails.quantity } name="quantity" />
                                            }
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>Unit Price</th>
                                        <th>Physical Condition</th>
                                    </tr>
                                    <tr>
                                        <td><input type='number' className='form-control' defaultValue={ EditDetails.unit_price } name="unit_price" /></td>
                                        <td>
                                            <select className='form-control' defaultValue={ EditDetails.physical_condition } name="physical_condition">
                                                <option selected={ EditDetails.physical_condition === 'Unworn' } value="Unworn">Unworn</option>
                                                <option selected={ EditDetails.physical_condition === 'Very Good' } value="Very Good">Very Good</option>
                                                <option selected={ EditDetails.physical_condition === 'Good' } value="Good">Good</option>
                                                <option selected={ EditDetails.physical_condition === 'Fair' } value="Fair">Fair</option>
                                                <option selected={ EditDetails.physical_condition === 'Poor' } value="Poor">Poor</option>
                                                <option selected={ EditDetails.physical_condition === 'Incomplete' } value="Incomplete">Incomplete</option>
                                            </select>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </fieldset>
            </form>
        </>
    )

}

const ModalDetails = ( { Product, InwardOutward, InOutDetails, printLabel, loadOutwards, generateLabel } ) => {

    const moment = require('moment');

    useEffect(
        () => {
            if ( Product && InOutDetails )
            {
                if($('#print_label').length > 0) {
                    $('#print_label').trigger('click');
                }
                loadOutwards(InOutDetails.transaction_id);
            }
        }, [ InOutDetails ]
    )

    if ( !InOutDetails )
    {
        return <></>;
    }
    const quantity = InOutDetails.entry === 'inward' ? InOutDetails.stored_quantity : InOutDetails.quantity;

    return (
        <>
            <div className='border p-3'>
                <h4>Details</h4>
                <hr />
                <div className='model-details-grid'>
                    <div>
                        <div>
                            <img src={ InOutDetails.preview ? (process.env.REACT_APP_SERVER + '/assets/inventory/assets/images/' + InOutDetails.preview) : 'https://i.stack.imgur.com/Q3vyk.png' } alt="preview" width='100%' />
                        </div>
                        {
                            Product?.sub_category_labeling === 0?null
                            :
                            <>
                                <div 
                                    id="print_label"
                                    style={
                                        {
                                            padding: 0,
                                        }
                                    }
                                    onClick={ () => generateLabel( new Date().getTime() + "_" + InOutDetails.transaction_id ) }
                                >
                                    <h4 style={ { marginBottom: 0, fontWeight: 'bolder', textAlign: 'center', fontFamily: "Cinzel, serif", fontSize: '20px', letterSpacing: '10px', marginTop: '10px' } }>
                                        SEABOARD
                                    </h4>
                                    <svg 
                                        id="code128"
                                    ></svg>
                                </div>
                                <button className='btn light btn-block' onClick={ () => printLabel( InOutDetails.entering_code + "_" + InOutDetails.transaction_id ) }>Print</button>
                            </>
                        }
                    </div>
                    <div>
                        <h2>{ InOutDetails.name }</h2>
                        <p className='mb-0 text-capitalize'>{ InOutDetails.description }</p>
                        <p className='mb-0 text-capitalize'>
                            <b>Note</b><br />
                            <span>{ InOutDetails.note }</span>
                        </p>
                        <table className='table table-sm table-borderless'>
                            <tbody>
                                <tr>
                                    <th>Company</th>
                                    <th>Location</th>
                                </tr>
                                <tr>
                                    <td>{ InOutDetails.company_name }</td>
                                    <td>{ InOutDetails.location_name }</td>
                                </tr>
                                <tr>
                                    <th>Sub Location</th>
                                    <th>Quantity</th>
                                </tr>
                                <tr>
                                    <td>{ InOutDetails.sub_location_name }</td>
                                    {
                                        InOutDetails.entry === 'inward'
                                        ?
                                        <td>{ InOutDetails.stored_quantity + " left from " + InOutDetails.quantity }</td>
                                        :
                                        <td>{ quantity }</td>
                                    }
                                </tr>
                                <tr>
                                    <th>Unit Price</th>
                                    <th>Total Amount</th>
                                </tr>
                                <tr>
                                    <td>Rs { parseFloat(InOutDetails.unit_price).toFixed(1) }</td>
                                    <td>Rs { parseFloat(quantity * parseFloat(InOutDetails.unit_price).toFixed(1)).toFixed(1) }</td>
                                </tr>
                                <tr>
                                    <th>Record Date</th>
                                    <th>Record Time</th>
                                </tr>
                                <tr>
                                    <td>{ new Date(InOutDetails.record_date).toDateString() }</td>
                                    <td>{ moment(InOutDetails.record_time,["HH:mm:ss"]).format('hh:mm A') }</td>
                                </tr>
                                <tr>
                                    <th>Physical Condition</th>
                                    { InOutDetails.entry === 'outward' ? <th>Issued To</th> : null }
                                </tr>
                                <tr>
                                    <td>{ InOutDetails.physical_condition }</td>
                                    { InOutDetails.entry === 'outward' ? <td>{ InOutDetails.issued_to_emp }</td> : null }
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <br />
                {
                    InOutDetails.entry === 'inward'
                    ?
                    <>
                        <h4>Outwards Created</h4>
                        {
                            InwardOutward.length === 0
                            ?
                            <h6 className='text-center'>No Record Found</h6>
                            :
                            <table className='table table-sm'>
                                <thead>
                                    <tr className='bg-light'>
                                        <th>Sr.No</th>
                                        <th>Location</th>
                                        <th>Issued To</th>
                                        <th>Quantity</th>
                                        <th>Status</th>
                                        <th>Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        InwardOutward.sort().map(
                                            ( val, index ) => {
                                                return (
                                                    <tr key={index}>
                                                        <td>{ index + 1 }</td>
                                                        <td>{ val.location_name } <br /> { val.sub_location_name }</td>
                                                        <td>{ val.issued_to_emp }</td>
                                                        <td>{ val.quantity }</td>
                                                        <td>{ val.status }</td>
                                                        <td>{ new Date(val.record_date).toDateString() }</td>
                                                    </tr>
                                                )
                                            }
                                        )
                                    }
                                </tbody>
                            </table>
                        }
                    </>
                    :null
                }
            </div>
        </>
    )

}

const OutwardView = ({ Employees, OutwardDetails, Locations, SubLocations, loadEmployees, onCreateOutward, GetSubLocations }) => {

    useEffect(
        () => {
            loadEmployees();
        }, []
    )

    return (
        <>
            <form onSubmit={ onCreateOutward } className='border p-3'>
                <fieldset disabled={ OutwardDetails.stored_quantity < 1 }>
                    <h4 className='mb-0'>Create Outward</h4>
                    <hr />
                    {
                        OutwardDetails.stored_quantity < 1
                        ?
                        <div className='alert alert-warning'>
                            You cannot create outward because of no quantity left in the current inward.
                        </div>
                        :null
                    }
                    <div className='grid-container-3'>
                        <div>
                            <label className='mb-0'>Company</label>
                            <input type='text' className='form-control' defaultValue={ OutwardDetails.company_name } disabled />
                        </div>
                        <div>
                            <label className='mb-0'>Location</label>
                            <select className='form-control' name="location_code" disabled={ Locations.length === 0 } onChange={ ( e ) => GetSubLocations( e.target.value ) }>
                                {
                                    Locations.map(
                                        ( val, index ) => {
                                            return <option value={ val.location_code } selected={ val.location_code === OutwardDetails.location_code } key={index}>{ val.location_name }</option>
                                        }
                                    )
                                }
                            </select>
                        </div>
                        <div>
                            <label className='mb-0'>Sub Location</label>
                            <select className='form-control' name="sub_location_code" disabled={ SubLocations.length === 0 }>
                                {
                                    SubLocations.map(
                                        ( val, index ) => {
                                            return <option value={ val.sub_location_code } selected={ val.sub_location_code === OutwardDetails.sub_location_code } key={index}>{ val.sub_location_name }</option>
                                        }
                                    )
                                }
                            </select>
                        </div>
                        <div>
                            <label className='mb-0'>Employee</label>
                            <select className="form-control form-control-sm" name="employee" required>
                                <option value="">Select Employee</option>
                                {
                                    Employees.map(
                                        ( val, index ) => {
                                            return <option key={index} value={ val.emp_id }>{ val.name }</option>;
                                        }
                                    )
                                }
                            </select>
                        </div>
                        <div>
                            <label className='mb-0'>Quantity</label>
                            <input type='number' className='form-control' name="quantity" min={1} max={ OutwardDetails.stored_quantity } />
                        </div>
                        <div>
                            <label className='mb-0'>Note</label>
                            <input type='text' className='form-control' name="note" defaultValue={ OutwardDetails.note } required />
                        </div>
                    </div>
                    <button className='btn submit d-block ml-auto mt-3'>Create</button>
                </fieldset>
            </form>
        </>
    )
}

const CreateInwardModal = ({ AttachedDC, SubLocations, Companies, Locations, GetSubLocations, setAttachedDC, onCreateInward, loadDeliveryChallans }) => {

    const [ VendorSearch, setVendorSearch ] = useState('');
    const [ DescriptionSearch, setDescriptionSearch ] = useState('');
    const [ Preview, setPreview ] = useState();
    const [ DeliveryChallans, setDeliveryChallans ] = useState([]);
    const [ View, setView ] = useState(1);

    useEffect(
        () => {
            if ( View === 2 )
            {
                loadDeliveryChallans( setDeliveryChallans );
            }
        }, [ View ]
    )

    const uploadPreview = () => {

        $('.uploadPreview').trigger('click');

    }

    const onFileSelection = ( event ) => {
        const reader = new FileReader();
        
        reader.onload = () => {
            if( reader.readyState === 2 )
            {
                let arr = [];
    
                for ( let x= 0; x < event.target.files.length; x++ )
                {
                    arr.push( 
                        {
                            file: event.target.files[x],
                            name: event.target.files[x].name
                        }
                     );
                }
                setPreview(
                    {
                        ...Preview,
                        file: arr[0].file
                    }
                )
            }
        }
        if ( event.target.files[0] ) {
            reader.readAsDataURL( event.target.files[0] );
        }
    }

    const attachDC = ( val ) => {

        if ( AttachedDC && AttachedDC.challan_id === val.challan_id )
        {
            setAttachedDC();
        }else
        {
            setAttachedDC(val);
        }

    }

    const Arr = DeliveryChallans.filter(
        val => {
            return val.vendor_name.toLowerCase().includes(VendorSearch.toLowerCase()) && val.description.toLowerCase().includes(DescriptionSearch.toLowerCase());
        }
    );

    return (
        <form className='border p-3' style={{ minHeight: '50vh' }} onSubmit={ ( e ) => onCreateInward( e, Preview ) }>
            <fieldset>
                <div className={ View === 1 ? 'd-block' : 'd-none' }>
                    <div className='d-flex align-items-center justify-content-between'>
                        <h4 className='mb-0'>Create Inward</h4>
                        <button className='btn submit' type='submit'>Submit</button>
                    </div>
                    <hr />
                    <div className='model-details-grid'>
                        <div>
                            <div className='preview mb-5'>
                                <div onClick={ uploadPreview } className='dark'></div>
                                <img src={ 
                                    Preview?
                                    URL.createObjectURL(Preview.file)
                                    : 'https://i.stack.imgur.com/Q3vyk.png' 
                                } alt="preview" width='100%' />
                                <div className='circle' onClick={ uploadPreview }>
                                    <i className="las la-camera"></i>
                                </div>
                                <input type='file' className='d-none uploadPreview' onChange={ onFileSelection } accept='image/png, image/gif, image/jpeg, image/jpg' />
                            </div>
                            <button 
                                title={
                                    AttachedDC ?
                                    `Vendor: ${AttachedDC.vendor_name}\n\nDate: ${new Date(AttachedDC.generate_date).toDateString()}\n\nDescription: ${AttachedDC.description}`
                                    : null
                                }
                                className={ 'btn btn-block ' + ( AttachedDC ? 'submit' : 'light') } type='button' onClick={ () => setView(2) }
                            >
                                {
                                    AttachedDC
                                    ?
                                    <>DC has been attached</>
                                    :
                                    <>Attach Delivery Challan</>
                                }
                            </button>
                        </div>
                        <div>
                            <label className='mb-0 font-weight-bold'>Name</label>
                            <input type='text' className='form-control mb-2' name="name" required />
                            <label className='mb-0 font-weight-bold'>Description</label>
                            <input type='text' className='form-control mb-2' name="description" required />
                            {
                                AttachedDC?null
                                :
                                <>
                                    <label className='mb-0 font-weight-bold'>Date Of Acquisition</label>
                                    <input type='date' className='form-control mb-2' name="date_of_acquisition" />
                                </>
                            }
                            <label className='mb-0 font-weight-bold'>Note</label>
                            <textarea type='text' className='form-control mb-2' required name="note" />
                            
                            <table className='table table-sm table-borderless'>
                                <tbody>
                                    <tr>
                                        <th>Company</th>
                                        <th>Location</th>
                                    </tr>
                                    <tr>
                                        <td>
                                            <select className='form-control' name="company_code" required>
                                                <option value="">Select</option>
                                                {
                                                    Companies.map(
                                                        ( val, index ) => {
                                                            return <option value={ val.company_code } key={index}>{ val.company_name }</option>
                                                        }
                                                    )
                                                }
                                            </select>
                                        </td>
                                        <td>
                                            <select className='form-control' name="location_code" required onChange={ ( e ) => GetSubLocations( e.target.value ) }>
                                                <option value="">Select</option>
                                                {
                                                    Locations.map(
                                                        ( val, index ) => {
                                                            return <option value={ val.location_code } key={index}>{ val.location_name }</option>
                                                        }
                                                    )
                                                }
                                            </select>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>Sub Location</th>
                                        <th>Quantity</th>
                                    </tr>
                                    <tr>
                                        <td>
                                            <select className='form-control' name="sub_location_code" required>
                                                <option value="">Select</option>
                                                {
                                                    SubLocations.map(
                                                        ( val, index ) => {
                                                            return <option value={ val.sub_location_code } key={index}>{ val.sub_location_name }</option>
                                                        }
                                                    )
                                                }
                                            </select>
                                        </td>
                                        <td>
                                            <input type='number' className='form-control' name="quantity" min={0} required />
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>Unit Price</th>
                                        <th>Physical Condition</th>
                                    </tr>
                                    <tr>
                                        <td><input type='number' className='form-control' name="unit_price" min={0} required /></td>
                                        <td>
                                            <select className='form-control' name="physical_condition" required>
                                                <option value="">Select</option>
                                                <option value="Unworn">Unworn</option>
                                                <option value="Very Good">Very Good</option>
                                                <option value="Good">Good</option>
                                                <option value="Fair">Fair</option>
                                                <option value="Poor">Poor</option>
                                                <option value="Incomplete">Incomplete</option>
                                            </select>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div className={ View === 2 ? 'd-block' : 'd-none' }>
                    <div className='d-flex align-items-center justify-content-between'>
                        <h4 className='mb-0'>Attach Delivery Challan</h4>
                        <div>
                            <button className="btn submit mr-2" type='button' onClick={ () => setView(1) }>
                                Back
                            </button>
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
                    </div>
                    <hr />
                    <table className='table table-sm table-borderless table-striped'>
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
                                Arr.map(
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
            </fieldset>
        </form>
    )
}