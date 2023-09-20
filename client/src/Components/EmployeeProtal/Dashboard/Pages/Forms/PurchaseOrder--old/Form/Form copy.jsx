import React, { useEffect, useState } from 'react';

import './Form.css';

import QFS from '../../../../../../../images/QFS-LOGO.PNG';
import SBL from '../../../../../../../images/SBL-LOGO.PNG';
import SBS from '../../../../../../../images/SEABOARD-SERVICES.PNG';
import SGC from '../../../../../../../images/Logo.jpg';

import Vender from './Venders/Venders';
import $ from 'jquery';
import axios from '../../../../../../../axios';

const Form = ( props ) => {

    const [ NewVender, setNewVender ] = useState( false );
    const [ Companies, setCompanies ] = useState([]);
    const [ Locations, setLocations ] = useState([]);
    const [ ShiptoLocations, setShiptoLocations ] = useState([]);
    const [ VendersList, setVendersList ] = useState([]);
    const [ VendersFound, setVendersFound ] = useState([]);
    const [ Data, setData ] = useState({});
    
    const [ FinalValues, setFinalValues ] = useState([]);

    useEffect(
        () => {

            setCompanies( props.Companies );
            setLocations( props.Locations );
            setShiptoLocations( props.ShiptoLocations );
            setData( props.Data );

        }, [ props.Companies, props.Locations, props.ShiptoLocations, props.Data ]
    )

    useEffect(
        () => {

            GetAllVenders();
            setFinalValues(
                [
                    {
                        key: "Sub Total",
                        value: props.Total.toLocaleString('en-US'),
                        editable: true,
                        name: 'subTotal',
                        dropdown: false
                    },
                    {
                        key: "GST",
                        value: props.RequestInformation ? props.RequestInformation.gst : null,
                        editable: false,
                        name: 'gst',
                        dropdown: true
                    },
                    {
                        key: "Cartage",
                        value: props.RequestInformation ? props.RequestInformation.cartage : null,
                        editable: false,
                        name: 'cartage',
                        dropdown: false
                    },
                    {
                        key: "Others",
                        value: props.RequestInformation ? props.RequestInformation.others : null,
                        editable: false,
                        name: 'others',
                        dropdown: false
                    },
                    {
                        key: "Total",
                        value: props.RequestInformation ? props.RequestInformation.total : null,
                        editable: true,
                        name: 'total',
                        dropdown: false
                    }
                ]
            )

        }, [props.RequestInformation, props.Total]
    );

    const d = new Date();

    // ADD NEW VENDER
    const AddNewVender = () => {

        setNewVender( !NewVender );
        if ( $('.POForm .GridContainer.Venders.ShipTo .VendersList .addNewVenderIcon').hasClass('la-plus-circle') )
        {
            $('.POForm .GridContainer.Venders.ShipTo .VendersList .addNewVenderIcon').removeClass('la-plus-circle');
            $('.POForm .GridContainer.Venders.ShipTo .VendersList .addNewVenderIcon').addClass('la-minus-circle');
        }else
        {
            $('.POForm .GridContainer.Venders.ShipTo .VendersList .addNewVenderIcon').removeClass('la-minus-circle');
            $('.POForm .GridContainer.Venders.ShipTo .VendersList .addNewVenderIcon').addClass('la-plus-circle');
        }

    }

    // ADD NEW VENDER
    const AddVender = ( e ) => {

        e.preventDefault();

        // IMPORTANT VARIABLES
        let VenderName = e.target['VenderName'].value;
        let VenderPhone = e.target['VenderPhone'].value;
        let VenderAddress = e.target['VenderAddress'].value;

        let val = {
            VenderName: VenderName,
            VenderPhone: VenderPhone,
            VenderAddress: VenderAddress
        }

        let vendersAdded = props.RequestInformation ? props.RequestInformation.venders : null;

        let venderExists = vendersAdded.filter(
            ( val ) => {

                return val.VenderName === VenderName;

            }
        )

        if ( venderExists.length > 0 )
        {
            alert('Vender already exists');
        }else
        {
            $('.btn.cancelBtn').trigger('click');
            props.AddVender( val );
        }

    }

    // GET ALL VENDERS
    const GetAllVenders = () => {

        axios.get('/getallvenders').then(res => {

            setVendersList( res.data );

        }).catch(err => {

            console.log(err);

        });

    }

    // SEARCH PREVIOUS VENDERS
    const SearchEnteredVenders = ( e ) => {

        const { value } = e.target;

        let VendersFound = VendersList.filter(
            ( val ) => {

                return val.vender_name.includes( value );

            }
        )

        setVendersFound( VendersFound );
        if ( value === '' )
        {
            setVendersFound([]);
        }

    }

    // WHEN VENDER IS SELECTED
    const SelectVender = ( id ) => {

        let SelectedVender = VendersFound[id];
        $('.form-control[name=VenderName]').val( SelectedVender.vender_name );
        $('.form-control[name=VenderPhone]').val( SelectedVender.vender_phone );
        $('.form-control[name=VenderAddress]').val( SelectedVender.vender_address );

        setVendersFound([]);

    }

    return (
        <>
            <div className="POForm">

                <img src={ SGC } className='watermark' alt="water markimage" />

                {/* HEADING */}
                <h1 
                    className="text-center"
                    style={
                        {
                            textDecoration: 'underline'
                        }
                    }
                >Seaboard Group</h1>
                {/* IMAGES GRID */}
                <div className="POFormGrid">

                    <img src={ QFS } alt="QFS LOGO" width="100%" />
                    <img src={ SBL } alt="SBL LOGO" width="100%" />
                    <img src={ SBS } alt="SBS LOGO" width="100%" />

                </div>

                {/* HEADING */}
                <h3 
                    className="text-center mb-4"
                    style={
                        {
                            textDecoration: 'underline'
                        }
                    }
                >Purchase Order</h3>

                {/* REQUEST INFO */}
                {/* UPPER DIV */}
                <div className="Upper RequestInfo">

                    {/* COMPANY INFO */}
                    {/* LEFT SIDE */}
                    <div className="Left CompanyInfo">

                        <select 
                            className="form-control companies"
                            onChange={ props.OnChangeCompany }
                        >
                            <option value="">Select the company</option>
                            {
                                Companies.map(
                                    ( val, index ) => {

                                        return (
                                            <option key={ index } value={ val.company_code }> { val.company_name } </option>
                                        )

                                    }
                                )
                            }
                        </select>
                        {
                            props.RequestInformation
                            ?
                            props.RequestInformation.company.company_code !== 0
                            ?
                                <select 
                                    className="form-control locations"
                                    onChange={ props.OnChangeLocation }
                                >
                                    <option value="">Select the location</option>
                                    {
                                        Locations.map(
                                            ( val, index ) => {


                                                return (
                                                    <option key={ index } value={ val.location_code }> { val.address } </option>
                                                )

                                            }
                                        )
                                    }
                                </select>
                            :
                            null
                            :
                            null
                        }
                        <p>
                            <b className="mr-2">Phone:</b>
                            {
                                props.RequestInformation
                                ?
                                props.RequestInformation.location.location_phone
                                :
                                null
                            }
                        </p>
                        <p>
                            <b className="mr-2">Website:</b>
                            {
                                props.RequestInformation
                                ?
                                props.RequestInformation.company.company_website
                                :
                                null
                            }
                        </p>

                    </div>

                    {/* REQUEST INFO */}
                    {/* RIGHT SIDE */}
                    <div className="Right RequestInfo">

                        <div className="TableDiv">
                            
                            {/* KEY */}
                            <div className='divs'>
                                PR Number
                            </div>
                            {/* VALUE */}
                            <div className='divs'>
                                <input 
                                    type="text" 
                                    className="form-control prNumber" 
                                    placeholder='Like: SBS-01-22/23' 
                                    onKeyDown={ props.OnChangePrNumber }   
                                />
                            </div>

                            {/* KEY */}
                            <div className='divs'>
                                PO Number
                            </div>
                            {/* VALUE */}
                            <div className='divs'>
                                { props.PurchaseOrderCode }
                            </div>

                            {/* KEY */}
                            <div className='divs'>
                                Date
                            </div>
                            {/* VALUE */}
                            <div className='divs'>
                                { d.toDateString() }
                            </div>

                        </div>

                    </div>

                </div>

                {/* VENDERS LIST */}
                {/* SHIPPING TO */}
                <div className="GridContainer Venders ShipTo">

                    {/* LEFT SIDE */}
                    {/* VENDERS LIST */}
                    <div className="VendersList">

                        {/* TITLE HEADING */}
                        <div className='title d-flex align-items-center justify-content-between'>
                            Venders
                            <div>
                                <i 
                                    className="las la-plus-circle addNewVenderIcon"
                                    onClick={ AddNewVender }
                                    style={
                                        {
                                            cursor: 'pointer'
                                        }
                                    }
                                ></i>
                                <span> { props.RequestInformation ? props.RequestInformation.venders.length : null } </span>
                            </div>
                        </div>

                        {/* VENDERS */}
                        {
                            NewVender
                            ?
                            <form onSubmit={ AddVender } className="NewVender">
                                <p><b>Note:</b> Every vender name should be unique.</p>
                                <div className="d-flex align-items-center">
                                    <p className="mb-0 pr-2 font-weight-bold">Name: </p>
                                    <div className="VenderFoundList w-100">
                                        <input
                                            minLength="3" 
                                            type="text" 
                                            className="form-control"
                                            name="VenderName" 
                                            onChange={ SearchEnteredVenders }
                                            required    
                                        />
                                        {
                                            VendersFound.length === 0
                                            ?
                                            null
                                            :
                                            <div className="List">
                                                {
                                                    VendersFound.map(
                                                        ( val, index ) => {

                                                            return (
                                                                <p 
                                                                    key={ index } 
                                                                    className="mb-0"
                                                                    onClick={ () => SelectVender( index ) }
                                                                    style={
                                                                        {
                                                                            cursor: 'pointer'
                                                                        }
                                                                    }
                                                                > { val.vender_name } </p>
                                                            )

                                                        }
                                                    )
                                                }
                                            </div>
                                        }
                                    </div>
                                </div>
                                <div className="d-flex align-items-center">
                                    <p className="mb-0 pr-2 font-weight-bold">Phone: </p>
                                    <input
                                        minLength="10" 
                                        type="text" 
                                        className="form-control"
                                        name="VenderPhone" 
                                        required    
                                    />
                                </div>
                                <div className="d-flex align-items-center">
                                    <p className="mb-0 pr-2 font-weight-bold">Address: </p>
                                    <input
                                        minLength="5" 
                                        type="text" 
                                        className="form-control"
                                        name="VenderAddress" 
                                        required    
                                    />
                                </div>
                                <button className='btn d-none cancelBtn' type='reset'>Cancel</button>
                                <button className='btn' type='submit'>Add</button>
                            </form>
                            :
                            null
                        }

                        {
                            props.RequestInformation
                            ?
                            props.RequestInformation.venders.length > 0
                            ?
                            props.RequestInformation.venders.map(
                                ( val, index ) => {

                                    return (
                                        <Vender
                                            key={ index }
                                            name={ val.VenderName }
                                            phone={ val.VenderPhone }
                                            address={ val.VenderAddress }

                                            RemoveVender={ props.RemoveVender }
                                        />
                                    )

                                }
                            )
                            :
                            null
                            :
                            null
                        }

                    </div>

                    {/* RIGHT SIDE */}
                    {/* SHIPPING TO DETAILS */}
                    <div className="ShippingCompany">

                        {/* TITLE HEADING */}
                        <div className='title'>
                            Ship To
                        </div>

                        {/* SHIP TO COMPANY DETAILS */}
                        <select 
                            className="form-control companies"
                            onChange={ props.OnChangeShipToCompany }
                        >
                            <option>Select the company</option>
                            {
                                Companies.map(
                                    ( val, index ) => {

                                        return (
                                            <option key={ index } value={ val.company_code }> { val.company_name } </option>
                                        )

                                    }
                                )
                            }
                        </select>
                        {
                            props.RequestInformation
                            ?
                            props.RequestInformation.ShipTo.company.company_code !== 0
                            ?
                                <select 
                                    className="form-control locations"
                                    onChange={ props.OnChangeShipToLocation }
                                >
                                    <option>Select the location</option>
                                    {
                                        ShiptoLocations.map(
                                            ( val, index ) => {


                                                return (
                                                    <option key={ index } value={ val.location_code }> { val.address } </option>
                                                )

                                            }
                                        )
                                    }
                                </select>
                            :
                            null
                            :
                            null
                        }
                        <p>
                            <b className="mx-2">Phone:</b>
                            {
                                props.RequestInformation
                                ?
                                props.RequestInformation.ShipTo.location.location_phone
                                :
                                null
                            }
                        </p>
                        <p>
                            <b className="mx-2">Website:</b>
                            {
                                props.RequestInformation
                                ?
                                props.RequestInformation.ShipTo.company.company_website
                                :
                                null
                            }
                        </p>

                    </div>

                </div>

                {/* MIDDLE */}
                {/* TO ENTER TH REQUIRED ITEMS DETAILS */}
                {/* INPUTS FIELDS */}
                <div className="PO_printUI_Middle">
                    <div className="PO_printUI_Grid" style={{ backgroundColor: "rgb(243, 243, 243)" }}>
                        <div><p className="font-weight-bolder">No</p></div>
                        <div><p className="font-weight-bolder">Description <sub className='d-block'>(include specification required)</sub> </p></div>
                        <div><p className="font-weight-bolder">Reason</p></div>
                        <div><p className="font-weight-bolder">Quantity</p></div>
                        <div><p className="font-weight-bolder">Estimated Cost <sub>(PKR)</sub> </p></div>
                        <div><p className="font-weight-bolder">Total Cost</p></div>
                    </div>
                    {
                        props.Items.map(
                            (val, index) => {

                                return (

                                    <div id={"Item" + index} className={"PO_printUI_Grid MyItems MyItems" + index} key={index} onDoubleClick={() => props.OnEdit(index)} onContextMenu={() => props.onDelete(index)}>
                                        <div> <p> {index + 1} </p>  </div>
                                        <div> <p> {val.description} </p></div>
                                        <div> <p> {val.reason} </p></div>
                                        <div> <p> {val.quantity} </p> </div>
                                        <div> <p> {val.price} </p> </div>
                                        <div> <p> {'Rs ' + val.amount.toLocaleString('en-US')} </p> </div>
                                    </div>

                                )

                            }
                        )
                    }
                    <div className="PO_printUI_Grid">
                        <div className="d-flex align-items-center justify-content-center"><p>{props.Items.length + 1}</p></div>
                        <div>
                            <textarea
                                className="form-control"
                                onChange={props.OnChangeHandler}
                                onKeyDown={props.AddItem}
                                value={props.Item.description}
                                name="description"
                            />
                        </div>
                        <div>
                            <textarea
                                className="form-control"
                                onChange={props.OnChangeHandler}
                                onKeyDown={props.AddItem}
                                value={props.Item.reason}
                                name="reason"
                            />
                            <p className="err_reason text-danger"></p>
                        </div>
                        <div>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="0"
                                onChange={props.OnChangeHandler}
                                onKeyDown={props.AddItem}
                                value={props.Item.quantity}
                                pattern="[0-9]+"
                                name="quantity"
                            />
                        </div>
                        <div>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="0"
                                onChange={props.OnChangeHandler}
                                onKeyDown={props.AddItem}
                                value={props.Item.price}
                                pattern="[0-9]+"
                                name="price"
                            />
                        </div>
                        <div>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="0"
                                value={'Rs ' + props.Amount.toLocaleString('en-US')}
                                pattern="[0-9]+"
                                name="itemAmount"
                                disabled
                            />
                        </div>
                    </div>
                    {
                        FinalValues.map(
                            ( val, index ) => {

                                return (
                                    <div className="PO_printUI_Grid PO_printUI_Grid_Bottom" key={ index }>
                                        <div></div>
                                        <div></div>
                                        <div style={{ backgroundColor: "rgb(243, 243, 243)" }}>
                                            <p className="font-weight-bolder text-right mr-2">
                                                {
                                                    val.dropdown
                                                    ?
                                                    <>
                                                        <select onChange={ props.ExclusiveInclusiveTax }>
                                                            <option value="exclusive">Exclusive</option>
                                                            <option value="inclusive">Inclusive</option>
                                                        </select>
                                                        {
                                                            props.TaxMode !== ''
                                                            ?
                                                            <select>
                                                                <option value=""></option>
                                                                <option value=""></option>
                                                                <option value=""></option>
                                                            </select>
                                                            :
                                                            null
                                                        }
                                                    </>
                                                    :
                                                    null
                                                }
                                                { val.key }:
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-left ml-2">Rs</p>
                                            <input 
                                                type="text"
                                                className="form-control"
                                                disabled={ val.editable }
                                                value={ val.value }
                                                pattern="[0-9]+"
                                                name={ val.name }
                                                onChange={ props.FinalValuesChangeHandler }
                                                required
                                            />
                                        </div>
                                    </div>
                                )

                            }
                        )
                    }
                </div>

                {/* SENDER COMMENTS ON PURCHASE ORDER */}
                <div className="Comments">

                    {/* TITLE HEADING */}
                    <div className='title rounded-0'>
                        Comments
                    </div>
                    <textarea 
                        placeholder='Please enter your comments on the request.'
                        className="form-control rounded-0"
                        onChange={ props.OnComments }
                    />

                </div>

                {/* SENDER & RECEIVER INFORMATION */}
                {/* GRID CONTAINER */}
                {/* FOOTER */}
                <div className="Footer">

                    {/* LEFT SIDE */}
                    {/* SENDER INFO */}
                    {/* REQUESTED BY */}
                    <div className="Left RequestedBy">

                        {/* TITLE HEADING */}
                        <div className='title'>
                            Requested By
                        </div>

                        {/* DATE AND SENDER NAME */}
                        <div className="d-flex align-items-center pl-2 py-1">
                            <p className='w-100 font-weight-bold'>
                                Name
                            </p>
                            <p className='w-100'>
                                { Data.name }
                            </p>
                        </div>
                        <div className="d-flex align-items-center pl-2 py-1">
                            <p className='w-100 font-weight-bold'>
                                Date
                            </p>
                            <p className='w-100'>
                                { d.toDateString() }
                            </p>
                        </div>

                    </div>

                    {/* RIGHT SIDE */}
                    {/* RECEIVER INFO */}
                    {/* APPROVED BY */}
                    <div className="Right ApprovedBy">

                        {/* TITLE HEADING */}
                        <div className='title'>
                            Approved By
                        </div>

                        {/* DATE AND RECEIVER NAME */}
                        <div className="d-flex align-items-center pl-2 py-1">
                            <p className='w-100 font-weight-bold'>
                                Name
                            </p>
                            <p className='w-100'>
                                
                            </p>
                        </div>
                        <div className="d-flex align-items-center pl-2 py-1">
                            <p className='w-100 font-weight-bold'>
                                Date
                            </p>
                            <p className='w-100'>
                                
                            </p>
                        </div>

                    </div>

                </div>

            </div>

            <button className='btn btn-primary d-block my-3 ml-auto' onClick={ props.SubmitPurchaseOrder }>Submit</button>
        </>
    )
}
export default Form;