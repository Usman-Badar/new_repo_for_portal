/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import './Style.css';
import { Route, Switch, useHistory } from 'react-router-dom';
import Modal from '../../../../../UI/Modal/Modal';
import loading from '../../../../../../images/loadingIcons/icons8-iphone-spinner.gif';

const UI = ( { PurchaseOrders, VerificationProcess, VendorDetails, FilterName, FilterAddress, FilterPhone, FilterNTN, Edit, RemovalConfirm, OpenFormModal, Venders, sendCode, loadRelatedPOs, GetVenders, verifyVendor, setVerificationProcess, setOpenFormModal, getDetails, setEdit, setRemovalConfirm, setFilterName, setFilterAddress, setFilterPhone, setFilterNTN, editVender, removeVender, createVendor } ) => {
    const history = useHistory();

    return (
        <>
            <div className="vendor">
                <div className="vendor_container">
                    <Modal show={ OpenFormModal } Hide={ () => { setOpenFormModal(!OpenFormModal); setEdit(); } } content={ <ModalForm Edit={ Edit } OpenFormModal={ OpenFormModal } createVendor={ createVendor } /> } />
                    <Modal show={ VerificationProcess } Hide={ () => setVerificationProcess(!VerificationProcess) } content={ <VerificationModal VerificationProcess={ VerificationProcess } verifyVendor={ verifyVendor } /> } />
                    <Modal show={ RemovalConfirm } Hide={ () => setRemovalConfirm(!RemovalConfirm) } content={ <ModalConfirmation RemovalConfirm={ RemovalConfirm } /> } />
                    <Switch>
                        <Route exact path="/inventory/vendors/list" render={ 
                                () => (
                                    <ListView 
                                        Venders={ Venders }
                                        FilterName={ FilterName }
                                        FilterAddress={ FilterAddress }
                                        FilterPhone={ FilterPhone }
                                        FilterNTN={ FilterNTN }
                                        history={ history }

                                        GetVenders={ GetVenders }
                                        setFilterName={ setFilterName }
                                        setFilterAddress={ setFilterAddress }
                                        setFilterPhone={ setFilterPhone }
                                        setFilterNTN={ setFilterNTN }
                                        editVender={ editVender }
                                        removeVender={ removeVender }
                                        setOpenFormModal={ setOpenFormModal }
                                    />
                                )
                            } 
                        />
                        <Route exact path="/inventory/vendor/:id" render={ 
                                () => (
                                    <Details 
                                        VendorDetails={ VendorDetails }
                                        history={ history }
                                        PurchaseOrders={ PurchaseOrders }

                                        sendCode={ sendCode }
                                        loadRelatedPOs={ loadRelatedPOs }
                                        editVender={ editVender }
                                        getDetails={ getDetails }
                                        setVerificationProcess={ setVerificationProcess }
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

const Details = ({ PurchaseOrders, history, VendorDetails, setVerificationProcess, loadRelatedPOs, sendCode, editVender, getDetails }) => {
    
    const [ RequestStatuses, setRequestStatuses ] = useState([]);
    const [ Status, setStatus ] = useState('');

    const { FormatMoney } = require('format-money-js');
    const fm = new FormatMoney({ symbol: 'Rs ', decimals: 2 });
    const Arr = PurchaseOrders && PurchaseOrders.filter(val => {return val.status.toLowerCase().includes(Status.toLowerCase())});
    
    useEffect(
        () => {
            getDetails();
        }, []
    );
    useEffect(
        () => {
            if ( VendorDetails )
            {
                loadRelatedPOs();
            }
        }, [ VendorDetails ]
    );
    useEffect(
        () => {
            if ( PurchaseOrders && PurchaseOrders.length > 0 )
            {
                let names = [];
                let statuses = [];
                for ( let x = 0; x < PurchaseOrders.length; x++ )
                {
                    if ( !names.includes(PurchaseOrders[x].company_name) )
                    {
                        names.push(PurchaseOrders[x].company_name);
                    }
                    if ( !statuses.includes(PurchaseOrders[x].status) )
                    {
                        statuses.push(PurchaseOrders[x].status.toLowerCase());
                    }
                }
                setRequestStatuses(statuses);
                // setCompanies( names );
                if (sessionStorage.getItem('ACStatus'))
                {
                    setStatus(sessionStorage.getItem('ACStatus'));
                }
            }
        }, [ PurchaseOrders ]
    );

    if ( !VendorDetails )
    {
        return <img src={loading} alt="loading..." width='50' height='50' className='d-block mx-auto' />
    }

    return (
        <>
            <div className="d-flex align-items-center justify-content-between">
                <h3 className="heading">
                    Vendor Details
                    <sub>View The Details Of the Vendor</sub>
                </h3>
                <div>
                    <button className='btn light' onClick={ () => history.goBack() }>Back</button>
                    { VendorDetails.verified === 0 ? <><button className='btn ml-2 submit' onClick={ () => setVerificationProcess(true) }>Verify Now</button><button className='btn ml-2 submit' id='sendCodeBtn' onClick={ () => sendCode( VendorDetails ) }>Send Code Again</button></> : null }
                </div>
            </div>

            <br /><br />

            <div className='vendor_details_grid'>
                <div>
                    <div className='details'>
                        <i className="lar la-edit" onClick={ () => editVender(window.location.href.split('/').pop()) }></i>
                        <b>Vendor</b><br />
                        <p>{ VendorDetails.name }</p>
                        <b>Contact Person</b><br />
                        <p>{ VendorDetails.contact_person }</p>
                        <b>Whatsapp Number</b><br />
                        <p>{ VendorDetails.phone }</p>
                        <b>NTN Number</b><br />
                        <p>{ VendorDetails.ntn_no }</p>
                        <b>Address</b><br />
                        <p>{ VendorDetails.address }</p>
                        <b>Verified</b><br />
                        <p className='mb-0'>{ VendorDetails.verified === 1 ? <span className='text-success'>Verified</span> : <span className='text-danger'>Not Verified</span> }</p>
                    </div>
                </div>
                <div>
                    <h5>Related Purchase Orders</h5>
                    <ul className="nav nav-tabs mb-3">
                        <li className="nav-item" onClick={ () => { setStatus(''); sessionStorage.setItem('ACStatus', '') } }>
                            <a className={ Status === '' ? 'nav-link active text-capitalize' : 'nav-link text-capitalize' }>all { Status === '' ? `(${Arr?Arr.length:[].length})` : "" }</a>
                        </li>
                        {
                            RequestStatuses.map(
                                ( status, index ) => {
                                    return (
                                        <li className="nav-item" onClick={ () => { setStatus( status ); sessionStorage.setItem('ACStatus', status) } } key={ index }>
                                            <a className={ Status === status ? 'nav-link active text-capitalize' : 'nav-link text-capitalize' }>
                                                { status } { Status === status ? `(${Arr?Arr.length:[].length})` : "" }
                                            </a>
                                        </li>
                                    )
                                }
                            )
                        }
                    </ul>
                    <div className='records-container' style={{ maxHeight: '120vh' }}>
                        {
                            Arr
                            ?
                            Arr.length === 0
                            ?
                            <>
                                <hr />
                                <h6 className='text-center'>No Purchase Order Found</h6>
                            </>
                            :
                            <table className="table popUps">
                                <thead>
                                    <tr>
                                        <th className='border-top-0'>PO No</th>
                                        <th className='border-top-0'>Specifications</th>
                                        <th className='border-top-0'>Date & Time</th>
                                        <th className='border-top-0'>Total Value</th>
                                        <th className='border-top-0'>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        Arr.map(
                                            ( val, index ) => {
                                                return (
                                                    <tr className='pointer pointer-hover' key={ index } onClick={ () => history.push('/purchase/order/details?po_id=' + val.po_id) }>
                                                        <td>{ val.code + '-' + val.series_year + '-' + val.series_code }</td>
                                                        <td>{ val.specifications }</td>
                                                        <td>
                                                            { new Date( val.requested_date ).toDateString() } <br />
                                                            { val.requested_time }
                                                        </td>
                                                        <td>{ fm.from(val.total_value) }</td>
                                                        <td>
                                                            <div className='d-flex align-items-center'>
                                                                <div 
                                                                    className={
                                                                        "dot mr-1 "
                                                                        +
                                                                        (
                                                                            val.status === 'approved'
                                                                            ?
                                                                            "bg-success"
                                                                            :
                                                                            val.status === 'rejected'
                                                                            ?
                                                                            "bg-danger"
                                                                            :
                                                                            val.status === 'waiting_for_approval'
                                                                            ?
                                                                            "bg-warning"
                                                                            :
                                                                            "bg-dark"
                                                                        )
                                                                    }
                                                                ></div>
                                                                <div
                                                                    className={
                                                                        "text-capitalize "
                                                                        +
                                                                        (
                                                                            val.status === 'approved'
                                                                            ?
                                                                            "text-success"
                                                                            :
                                                                            val.status === 'rejected'
                                                                            ?
                                                                            "text-danger"
                                                                            :
                                                                            val.status === 'waiting_for_approval'
                                                                            ?
                                                                            "text-warning"
                                                                            :
                                                                            "text-dark"
                                                                        )
                                                                    }
                                                                    style={{ fontSize: 12 }}
                                                                >
                                                                    {
                                                                        val.status === 'waiting_for_approval' && parseInt(val.appr_rejct_by) === parseInt(localStorage.getItem("EmpID"))
                                                                        ?
                                                                        "Pending"
                                                                        :
                                                                        val.status.split('_').join(' ')
                                                                    }
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )
                                            }
                                        )
                                    }
                                </tbody>
                            </table>
                            :
                            <img src={loading} alt="loading..." width='50' height='50' className='d-block mx-auto mt-3' />
                        }
                    </div>
                </div>
            </div>
        </>
    )
}

const ListView = ( { history, FilterName, FilterAddress, FilterPhone, FilterNTN, Venders, setOpenFormModal, GetVenders, removeVender, editVender, setFilterName, setFilterAddress, setFilterPhone, setFilterNTN } ) => {

    useEffect(
        () => {
            GetVenders();
        }, []
    );

    const Arr = Venders ? Venders.filter(val => {
            let ntn = val.ntn_no ? val.ntn_no : '';
            return val.name.toLowerCase().includes(FilterName.toLowerCase()) && val.address.toLowerCase().includes(FilterAddress.toLowerCase()) && val.phone.toLowerCase().includes(FilterPhone.toLowerCase()) && ntn.toLowerCase().includes(FilterNTN.toLowerCase());
    }) : null;

    return (
        <>
            <div className="d-flex align-items-center justify-content-between">
                <h3 className="heading">
                    Vendors list
                    <sub>List Of All Vendors</sub>
                </h3>
                <div>
                    <button className='btn submit' onClick={ () => setOpenFormModal(true) }>New</button>
                    <button className="btn submit px-2 ml-2 filter-emit" type='button'>
                        <i className="las la-filter"></i> Filters
                        <div className="filter-container">
                            <h6 className='mb-0' style={{ fontFamily: 'Oxygen' }}>Filter Options</h6>
                            <hr className='my-1 bg-dark' />

                            <label className="font-weight-bold mb-0">Search Name</label>
                            <input placeholder='Search By Name...' type="search" onChange={ (e) => setFilterName(e.target.value) } className='form-control form-control-sm mb-2' />
                            
                            <label className="font-weight-bold mb-0">Search Address</label>
                            <input placeholder='Search By Address...' type="search" onChange={ (e) => setFilterAddress(e.target.value) } className='form-control form-control-sm mb-2' />

                            <label className="font-weight-bold mb-0">Search Phone</label>
                            <input placeholder='Search By Phone Number...' type="search" onChange={ (e) => setFilterPhone(e.target.value) } className='form-control form-control-sm mb-2' />

                            <label className="font-weight-bold mb-0">Search NTN</label>
                            <input placeholder='Search By NTN Number...' type="search" onChange={ (e) => setFilterNTN(e.target.value) } className='form-control form-control-sm mb-2' />
                        </div>
                    </button>
                </div>
            </div>
            <table className="table mt-3">
                <thead>
                    <tr>
                        <th>Sr.No</th>
                        <th>Name</th>
                        <th>Phone</th>
                        <th>Verification</th>
                        <th colSpan={2}>NTN Number</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        Arr.map(
                            ( val, index ) => {
                                return (
                                    <tr className='pointer pointer-hover' key={ index }>
                                        <td onClick={ () => history.push('/inventory/vendor/' + val.vender_id) }>{ index + 1 }</td>
                                        <td onClick={ () => history.push('/inventory/vendor/' + val.vender_id) }>
                                            <b>{ val.name }</b><br/>
                                            <span>{ val.address }</span>
                                        </td>
                                        <td onClick={ () => history.push('/inventory/vendor/' + val.vender_id) }>{ val.phone }</td>
                                        <td onClick={ () => history.push('/inventory/vendor/' + val.vender_id) }>{val.verified === 1 ? <span className='text-success'>Verified</span> : <span className='text-danger'>Not Verified</span> }</td>
                                        <td onClick={ () => history.push('/inventory/vendor/' + val.vender_id) }>{ val.ntn_no ? val.ntn_no : '-----' }</td>
                                        <td>
                                            <div className="d-flex">
                                                <span title="Edit Product" className='iconic' onClick={ () => editVender( val.vender_id ) }><i className="las la-edit"></i></span>
                                                <span title="Delete Product" className='iconic' onDoubleClick={ () => removeVender( val.vender_id ) }><i className="las la-trash"></i></span>
                                            </div>
                                        </td>
                                    </tr>
                                );

                            }
                        )
                    }
                </tbody>
            </table>
        </>
    )

}

const ModalForm = ( { Edit, OpenFormModal, createVendor } ) => {

    if ( !OpenFormModal )
    {
        return <></>;
    }

    return (
        <>
            <form onSubmit={ createVendor }>
                <h5 style={{ fontFamily: "Poppins" }}>{ Edit ? 'Update Vendor' : 'New Vendor' }</h5>
                <hr />
                <div class="alert alert-danger d-none" id="create_vender_err" role="alert"></div>
                <fieldset>
                    <label className="mb-0"><b>Vendor Name *</b></label>
                    <input className="form-control" min={3} name="vender_name" placeholder='Since this could be a company name.' required />
                    
                    <label className="mb-0 mt-2"><b>Contact Person *</b></label>
                    <input className="form-control" minLength={3} name="vender_contact_person" placeholder='Enter the contact person name here.' required />
                    
                    <label className="mb-0 mt-2"><b>Vendor Phone Number *</b></label>
                    <input type='number' className="form-control" name="vender_phone" placeholder='This must be a whatsapp number' required />
                    
                    <label className="mb-0 mt-2"><b>Vendor NTN Number (optional)</b></label>
                    <input className="form-control" placeholder="Enter vendor's national tax number." name="ntn_no" />
                    
                    <label className="mb-0 mt-2"><b>Vendor Address *</b></label>
                    <textarea className="form-control" name="vender_address" minLength={10} placeholder="Enter vendor's full address." required />

                    <button className='btn submit d-block mx-auto mt-3'>{ Edit ? 'Update' : 'Create' }</button>
                </fieldset>
            </form>
        </>
    )

}

const VerificationModal = ( { VerificationProcess, verifyVendor } ) => {

    if ( !VerificationProcess )
    {
        return <></>;
    }

    return (
        <>
            <form onSubmit={ verifyVendor }>
                <h5 style={{ fontFamily: "Poppins" }}>Vendor Verification</h5>
                <hr />
                <fieldset>
                    <label className="mb-0 mt-2"><b>Enter Verification Code *</b></label>
                    <input type='number' className="form-control" name="code" required />
                    <button className='btn submit d-block mx-auto mt-3' type='submit'>Verify</button>
                </fieldset>
            </form>
        </>
    )

}

const ModalConfirmation = ( { RemovalConfirm } ) => {

    if ( !RemovalConfirm )
    {
        return <></>;
    }

    return (
        <form onSubmit={ RemovalConfirm.func }>
            <fieldset className="px-3 pt-2 pb-0">
                <h6 className='mb-3'>
                    { RemovalConfirm.label }
                </h6>
                <button className='btn cancle d-block ml-auto' type='submit'>
                    Confirm
                </button>
            </fieldset>
        </form>
    )

}