import React from 'react';
import './Style.css';

import { Route, Switch, useHistory } from 'react-router-dom';

const UI = ( { Vendors, Item, Items, List, enterItem, searchVender, vendorSelection, createDeliveryChallan, onChangeItems } ) => {

    const history = useHistory();

    return (
        <>
            <div className="delivery_challan">
                <div className="delivery_challan_container">

                    <Switch>
                        <Route exact path="/inventory/challan/list" render={ 
                                () => (
                                    <ListView 
                                        List={ List }
                                        history={ history }
                                    />
                                )
                            } 
                        />
                        <Route exact path="/inventory/challan/create" render={ 
                                () => (
                                    <CreateDChallan
                                        Items={ Items }
                                        history={ history }
                                        Item={ Item }
                                        Vendors={ Vendors }

                                        createDeliveryChallan={ createDeliveryChallan }
                                        vendorSelection={ vendorSelection }
                                        searchVender={ searchVender }
                                        onChangeItems={ onChangeItems }
                                        enterItem={ enterItem }
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

const CreateDChallan = ( { Vendors, Item, Items, history, enterItem, searchVender, createDeliveryChallan, vendorSelection, onChangeItems } ) => {

    return (
        <>
            <div className="d-flex align-items-center justify-content-between">
                <h3 className="heading">
                    Delivery Challan
                    <sub>Create New Challan</sub>
                </h3>

                <button className="btn submit" onClick={ () => history.push('/inventory/challan/list') } type='button'>Back To List</button>
            </div>
            <hr />

            <form onSubmit={ ( e ) => createDeliveryChallan( e, history ) }>
                <fieldset>

                    <div className="main-grid">

                        <div>
                            <div className="flex_container mb-3">

                                <div>
                                    <label className='mb-0'>
                                        <b>Invoice Number</b>
                                    </label>
                                    <input type="text" id='invoice_no' className="form-control" />
                                </div>
                                <div>
                                    <label className='mb-0'>
                                        <b>Current Date</b>
                                    </label>
                                    <input type="text" disabled value={ new Date().toDateString() } className="form-control" />
                                </div>

                            </div>
                            <div className="flex_container">

                                <div>
                                    <label className='mb-0'>
                                        <b>Description</b>
                                    </label>
                                    <input onChange={ onChangeItems } value={ Item.description } name="description" type="text" className="form-control" />
                                </div>
                                <div>
                                    <label className='mb-0'>
                                        <b>Quantity</b>
                                    </label>
                                    <input onChange={ onChangeItems } value={ Item.quantity } min={1} name="quantity" type="number" className="form-control" />
                                </div>

                            </div>

                            <button className="btn light my-3 d-block ml-auto" onClick={ enterItem } type="button">Add Row</button>

                            {
                                Items.length > 0
                                ?
                                <table className='table table-striped'>
                                    <thead>
                                        <tr>
                                            <th>Sr.No</th>
                                            <th>Description</th>
                                            <th>Quantity</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            Items.map(
                                                ( val, index ) => {
                                                    return (
                                                        <tr key={ index }>
                                                            <td>{ index = 1 }</td>
                                                            <td>{ val.description }</td>
                                                            <td>{ val.quantity }</td>
                                                        </tr>
                                                    )
                                                }
                                            )
                                        }
                                    </tbody>
                                </table>
                                :
                                <>
                                    <p className="text-center mt-2 mb-0">No Item Added</p>
                                    <hr className='m-0 w-25 d-block mx-auto bg-dark' />
                                </>
                            }
                        </div>
                        <div>

                            <div className='border rounded p-3 mb-3'>
                                <h6>Vendor</h6>
                                <hr />
                                <p className="mb-2">
                                    <small>Note: Search and select your required vendor. In this case, the vendor is not included in the list, so go to the vendor's page and add that vendor.</small>
                                </p>
                                <label className='mb-0'>
                                    <b>Search Name</b>
                                </label>
                                <div style={ { position: 'relative' } }>
                                    <input type="text" required onChange={ searchVender } id="vendor_name" className="form-control" />
                                    {
                                        Vendors.length === 0
                                        ?null
                                        :
                                        <div className="vendors_list">
                                            {
                                                Vendors.map(
                                                    ( val, index ) => {

                                                        return (
                                                            <>
                                                                <div  style={ { cursor: 'pointer' } } key={ index } onClick={ () => vendorSelection( index ) }>
                                                                    <p className='mb-0'>
                                                                        <b>{ val.name }</b>
                                                                    </p>
                                                                    <span>
                                                                        { val.phone }
                                                                    </span>
                                                                </div>
                                                                <hr className='m-1' />
                                                            </>
                                                        )

                                                    }
                                                )
                                            }
                                        </div>
                                    }
                                </div>
                            </div>

                            <div className='border rounded p-3'>
                                <h6>Received From</h6>
                                <hr />
                                <label className='mb-0'>
                                    <b>Name</b>
                                </label>
                                <input name="received_from_name" type="text" required minLength={3} className="form-control mb-2" />
                                
                                <label className='mb-0'>
                                    <b>Mobile No.</b>
                                </label>
                                <input name="received_from_number" type="number" required className="form-control" />
                            </div>
                            
                            <button className="btn submit mt-3 d-block ml-auto">Create</button>

                        </div>

                    </div>

                </fieldset>
            </form>
        </>
    )

}

const ListView = ( { List, history } ) => {

    return (
        <>
            <div className="d-flex align-items-center justify-content-between">
                <h3 className="heading">
                    Delivery Challan
                    <sub>Entered Challan List</sub>
                </h3>

                <button className="btn submit" onClick={ () => history.push('/inventory/challan/create') } type='button'>Create New</button>
            </div>
            <hr />

            {
                List
                ?
                List.length === 0
                ?
                <h6 className="text-center">No Record Found</h6>
                :
                <table className="table">
                    <thead>
                        <tr>
                            <th>Sr.No</th>
                            <th>Invoice No</th>
                            <th>Vendor</th>
                            <th>Received</th>
                            <th>Date & Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            List.map(
                                ( val, index ) => {
                                    return (
                                        <tr key={ index }>
                                            <td>{ index + 1 }</td>
                                            <td>{ val.invoice_no ? val.invoice_no : '----' }</td>
                                            <td>
                                                { val.vendor_name } <br />
                                                { val.vendor_phone }
                                            </td>
                                            <td>
                                                { val.received_from_name } <br />
                                                { val.received_from_number }
                                            </td>
                                            <td>
                                                { new Date(val.generate_date).toDateString() } at { val.generate_time.substring(0,5) }
                                            </td>
                                        </tr>
                                    )
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