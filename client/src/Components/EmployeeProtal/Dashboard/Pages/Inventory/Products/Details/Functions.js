import axios from '../../../../../../../axios';
import $ from 'jquery';
import printJS from 'print-js';
import JSAlert from 'js-alert';

const JsBarcode = require('jsbarcode');

export const generateLabel = ( code ) => {

    $('svg#code128').addClass('d-block');
    $('svg#code128').addClass('code128');
    JsBarcode(
        "#code128", 
        code, 
        {
            lineColor: "#1f2937",
            // displayValue: false,
        }
    );

    document.getElementById('print_label').style.display = 'block';
    document.getElementById('print_label_btn').style.display = 'block';

}

export const printLabel = () => {

    printJS(
        { 
            printable: 'print_label', 
            type: 'html', 
            targetStyles: ['*'],
            css: [
              "https://fonts.googleapis.com/css2?family=Cinzel&family=Oxygen:wght@300&display=swap"
            ],
            font_size: ''
        }
    );

}

export const getProductDetails = (setProduct, setInward, setOutward) => {

    axios.post(
        '/inventory/product/details/all',
        {
            product_id: window.location.href.split('/').pop()
        }
    ).then(
        res => {
            setProduct(res.data[0].length > 0 ? res.data[0][0] : undefined);
            setInward(res.data[1]);
            setOutward(res.data[2]);
        }
    ).catch(
        err => {

            console.log(err);

        }
    )

}

export const viewDetails = ( val, setInOutDetails, setShowDetails ) => {

    setInOutDetails( val );
    setShowDetails( true );

}

export const createOutward = ( val, setOutwardDetails ) => {

    setOutwardDetails(val);

}

export const deleteTransaction = ( val, setConfirmation, setProduct, setInward, setOutward ) => {

    setConfirmation(
        <>
            <form onSubmit={ (e) => confirmDelete( e, val, setConfirmation, setProduct, setInward, setOutward ) }>
                <fieldset>
                    <h6>Do you really want to delete <span className='text-capitalize'>{ val.entry }</span> '{ val.name }'?</h6>
                    <p>The inward quantity will minus from the total product quantity...</p>
                    <button className='btn submit d-block ml-auto' type='submit'>Yes, Confirm</button>
                </fieldset>
            </form>
        </>
    )

}

const confirmDelete = ( e, val, setConfirmation, setProduct, setInward, setOutward ) => {

    e.preventDefault();
    $('fieldset').prop('disabled', true);
    axios.post(
        '/inventory/remove_inward',
        {
            transaction_id: val.transaction_id,
            preview: val.preview
        }
    ).then(
        res => {
            if ( res.data === 'err' )
            {
                JSAlert.alert("Cannot remove inward from the inventory!!!").dismissIn(1500 * 1);
            }else
            {
                setProduct();
                setInward([]);
                setOutward([]);
                setConfirmation();
                getProductDetails(setProduct, setInward, setOutward);
                JSAlert.alert("Inward has been removed from the inventory!!!").dismissIn(1500 * 1);
            }
        }
    ).catch(
        err => {
            $('fieldset').prop('disabled', false);
            console.log(err);
        }
    )

}

export const onFileSelection = ( event, EditDetails, setEditDetails ) => {
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
            setEditDetails(
                {
                    ...EditDetails,
                    file: arr[0].file
                }
            )
        }
    }
    if ( event.target.files[0] ) {
        reader.readAsDataURL( event.target.files[0] );
    }
}

export const updateDetails = ( e, EditDetails, setProduct, setInward, setOutward, setEditDetails ) => {

    e.preventDefault();
    $('fieldset').prop('disabled', true);
    let quantity = 0;
    let stored_quantity = 0;
    let total_amount = 0;

    if ( EditDetails.quantity !== EditDetails.stored_quantity )
    {
        quantity = EditDetails.quantity;
        stored_quantity = EditDetails.stored_quantity;
        total_amount = parseInt(EditDetails.quantity)*parseFloat(EditDetails.unit_price).toFixed(2);
    }else
    {
        quantity = parseInt(e.target['quantity'].value);
        stored_quantity = quantity;
        total_amount = quantity*parseFloat(e.target['unit_price'].value).toFixed(2);
    }

    const Data = new FormData();
    Data.append('preview', EditDetails.file);
    Data.append('transaction_id', EditDetails.transaction_id);
    Data.append('prev_preview', EditDetails.preview);
    Data.append('name', e.target['name'].value);
    Data.append('description', e.target['description'].value);
    Data.append('note', e.target['note'].value);
    Data.append('company_code', e.target['company_code'].value);
    Data.append('location_code', e.target['location_code'].value);
    Data.append('sub_location_code', e.target['sub_location_code'].value);
    Data.append('quantity', quantity);
    Data.append('stored_quantity', stored_quantity);
    Data.append('total_amount', total_amount);
    Data.append('unit_price', e.target['unit_price'].value);
    Data.append('physical_condition', e.target['physical_condition'].value);
    axios.post(
        '/inventory/update_inward',
        Data,
        {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }
    ).then(
        res => {
            setProduct();
            setInward([]);
            setOutward([]);
            if ( res.data === 'err' )
            {
                JSAlert.alert("Cannot update inward!!").dismissIn(1500 * 1);
            }else
            {
                JSAlert.alert("Inward has been updated!!").dismissIn(1500 * 1);
            }
            setEditDetails();
            getProductDetails(setProduct, setInward, setOutward);
        }
    ).catch(
        err => {
            $('fieldset').prop('disabled', false);
            console.log(err);
        }
    )

}

export const GetCompanies = ( setCompanies ) => {

    axios.get('/getallcompanies')
    .then(
        res => 
        {
            setCompanies(res.data);
        }
    ).catch(
        err => {

            console.log(err);

        }
    );

}

export const GetLocations = ( location_code, setLocations, setSubLocations ) => {

    axios.get('/getalllocations').then(
        res => {

            setLocations( res.data );
            if ( location_code )
            {
                GetSubLocations( location_code, setSubLocations )
            }

        }
    ).catch(
        err => {

            console.log( err );

        }
    )

}

export const loadDeliveryChallans = ( setDeliveryChallans ) => {

    axios.get('/delivery_challan/all').then(
        res => {
            setDeliveryChallans( res.data );
        }
    ).catch(
        err => {
            console.log( err );
        }
    )

}

export const loadOutwards = ( transaction_id, setInwardOutward ) => {

    axios.post(
        '/inventory/inwards/outwards/created',
        {
            transaction_id: transaction_id
        }
    ).then(
        res => {
            setInwardOutward( res.data );
        }
    ).catch(
        err => {
            console.log( err );
        }
    )

}

export const loadEmployees = ( setEmployees ) => {

    axios.get(
        '/signature_users'
    ).then (
        res => {

            setEmployees( res.data );
        }
    ).catch (
        err => {
            console.log( err );
        }
    )

}

export const onCreateOutward = ( e, OutwardDetails, setOutwardDetails, setProduct, setInward, setOutward ) => {

    e.preventDefault();
    const location_code = e.target['location_code'].value;
    const sub_location_code = e.target['sub_location_code'].value;
    const employee = e.target['employee'].value;
    const quantity = e.target['quantity'].value;
    const note = e.target['note'].value;
    $('fieldset').prop('disabled', true);
    axios.post(
        '/inventory/products/create/outward',
        {
            location_code: location_code,
            sub_location_code: sub_location_code,
            employee: employee,
            quantity: quantity,
            note: note,
            transaction_id: OutwardDetails.transaction_id, 
            preview: OutwardDetails.preview, 
            product_id: OutwardDetails.product_id, 
            issued_by: localStorage.getItem('EmpID')
        }
    ).then (
        res => {

            if ( res.data === 'err' )
            {
                $('fieldset').prop('disabled', false);
                JSAlert.alert("Cannot create outward from the inward!!!").dismissIn(1500 * 1);
            }else
            {
                setProduct();
                setInward([]);
                setOutward([]);
                setOutwardDetails();
                getProductDetails(setProduct, setInward, setOutward);
                JSAlert.alert("Outward has been created from the inward!!!").dismissIn(1500 * 1);
            }
        }
    ).catch (
        err => {
            $('fieldset').prop('disabled', false);
            console.log( err );
        }
    )

}

export const onCreateInward = ( e, Preview, AttachedDC, setProduct, setInward, setOutward, setCreateInward, setAttachedDC ) => {

    e.preventDefault();
    const Data = new FormData();
    Data.append('preview', Preview ? Preview.file : null);
    Data.append('name', e.target['name'].value);
    Data.append('description', e.target['description'].value);
    Data.append('date_of_acquisition', AttachedDC ? AttachedDC.generate_date : e.target['date_of_acquisition'].value);
    Data.append('note', e.target['note'].value);
    Data.append('company_code', e.target['company_code'].value);
    Data.append('location_code', e.target['location_code'].value);
    Data.append('sub_location_code', e.target['sub_location_code'].value);
    Data.append('quantity', e.target['quantity'].value);
    Data.append('unit_price', e.target['unit_price'].value);
    Data.append('physical_condition', e.target['physical_condition'].value);
    Data.append('challan_id', AttachedDC ? AttachedDC.challan_id : null);
    Data.append('product_id', window.location.href.split('/').pop());
    Data.append('created_by', localStorage.getItem('EmpID'));
    $('fieldset').prop('disabled', true);
    axios.post(
        '/inventory/products/create/inward',
        Data,
        {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }
    ).then (
        res => {

            if ( res.data === 'err' )
            {
                $('fieldset').prop('disabled', false);
                JSAlert.alert("Error while creating inward!!!").dismissIn(1500 * 1);
            }else
            {
                setAttachedDC();
                setProduct();
                setInward([]);
                setOutward([]);
                setCreateInward(false);
                getProductDetails(setProduct, setInward, setOutward);
                JSAlert.alert("Inward has been created!!!").dismissIn(1500 * 1);
            }
        }
    ).catch (
        err => {
            $('fieldset').prop('disabled', false);
            console.log( err );
        }
    )

}

export const GetSubLocations = ( location_code, setSubLocations ) => {

    axios.post(
        '/inventory/get_sub_locations',
        {
            location_code: location_code
        }
    ).then(
        res => {
            setSubLocations( res.data );
        }
    ).catch(
        err => {
            console.log( err );
        }
    )

}