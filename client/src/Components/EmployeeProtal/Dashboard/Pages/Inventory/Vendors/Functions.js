import axios from '../../../../../../axios';
import $ from 'jquery';
import JSAlert from 'js-alert';

export const GetVenders = ( setVenders ) => {
    axios.post(
        '/inventory/venders/all'
    ).then(
        res => {
            setVenders( res.data[0] );
        }
    ).catch(
        err => {
            console.log( err );
        }
    )
}

export const getDetails = ( setVendorDetails ) => {
    axios.post(
        '/inventory/vender/details',
        {
            vendor_id: window.location.href.split('/').pop()
        }
    ).then(
        res => {
            setVendorDetails( res.data[0] );
        }
    ).catch(
        err => {
            console.log( err );
        }
    )
}

export const loadRelatedPOs = ( setPurchaseOrders ) => {
    axios.post(
        '/inventory/vender/purchase_orders',
        {
            vendor_id: window.location.href.split('/').pop()
        }
    ).then(
        res => {
            setPurchaseOrders(res.data);
        }
    ).catch(
        err => {
            console.log( err );
        }
    )
}

export const sendCode = ( VendorDetails ) => {
    $('#sendCodeBtn').prop('disabled', true);
    axios.post(
        '/inventory/vender/send_code',
        {
            vendor_id: window.location.href.split('/').pop(),
            phone: VendorDetails.phone,
            contact_person: VendorDetails.contact_person
        }
    ).then(
        res => {
            $('#sendCodeBtn').prop('disabled', false);
            if ( res.data === 'success' )
            {
                JSAlert.alert("Code Sent").dismissIn(1000 * 2);
            }else
            {
                JSAlert.alert("Something went wrong.").dismissIn(1000 * 2);
            }
        }
    ).catch(
        err => {
            $('#sendCodeBtn').prop('disabled', false);
            console.log( err );
        }
    )
}

export const verifyVendor = ( event, VendorDetails, setVerificationProcess, setVendorDetails ) => {
    event.preventDefault();
    const code = event.target['code'].value;
    $('fieldset').prop('disabled', true);
    axios.post(
        '/inventory/vender/verification',
        {
            code: code,
            vendor_id: window.location.href.split('/').pop(),
            phone: VendorDetails.phone,
            contact_person: VendorDetails.contact_person
        }
    ).then(
        res => {
            if ( res.data === 'not found' )
            {
                $('fieldset').prop('disabled', false);
                JSAlert.alert("Verification code is invalid").dismissIn(1000 * 2);
            }else
            if ( res.data === 'success' )
            {
                getDetails(setVendorDetails);
                setVerificationProcess(false);
                JSAlert.alert("Vendor verified!!!").dismissIn(1000 * 2);
            }else
            {
                $('fieldset').prop('disabled', false);
                JSAlert.alert("Something went wrong!!!").dismissIn(1000 * 2);
            }
        }
    ).catch(
        err => {
            $('fieldset').prop('disabled', false);
            console.log( err );
        }
    )
}

export const createVendor = ( e, VendorDetails, Edit, setEdit, setVendorDetails, setOpenFormModal, setVenders ) => {

    e.preventDefault();
    const vender_name = e.target['vender_name'].value;
    const vender_contact_person = e.target['vender_contact_person'].value;
    const vender_phone = e.target['vender_phone'].value;
    const ntn_no = e.target['ntn_no'].value;
    const vender_address = e.target['vender_address'].value;

    $('fieldset').prop('disabled', true);
    axios.post(
        Edit ? '/inventory/venders/edit' : '/inventory/venders/create',
        {
            name: vender_name,
            contact_person: vender_contact_person,
            phone: vender_phone,
            ntn_no: ntn_no,
            address: vender_address,
            vender_id: Edit
        }
    ).then(
        res => {

            if( res.data === 'exists' )
            {
                $('fieldset').prop('disabled', false);
                $('#create_vender_err').removeClass('d-none').html("Vender with this name or phone number is already exists.");
            }else
            {
                if ( Edit )
                {
                    setEdit();
                    $('#create_vender_err').removeClass('d-none').removeClass('alert-danger').addClass('alert-success').html("Vender Updated Successfully.");
                }else
                {
                    if ( res.data === 'found' )
                    {
                        $('#create_vender_err').removeClass('d-none').removeClass('alert-danger').addClass('alert-warning').html("Vender already exists, re-active.");
                    }else
                    {
                        $('#create_vender_err').removeClass('d-none').removeClass('alert-danger').addClass('alert-success').html("Vender created successfully.");
                    }
                }
                if ( VendorDetails )
                {
                    getDetails( setVendorDetails );
                }else
                {
                    GetVenders( setVenders );
                }
                setTimeout(() => {
                    setOpenFormModal(false);
                }, 1500);
            }

        }
    ).catch(
        err => {

            $('fieldset').prop('disabled', false);
            console.log( err );
            $('#create_vender_err').removeClass('d-none').html("Error found: " + err.message);

        }
    )

}

export const removeVender = ( index, Venders, setRemovalConfirm, setVenders ) => {

    const vender = Venders.filter( val => val.vender_id === index )[0];
    setRemovalConfirm(
        {
            label: "Do you want to remove vender '" + vender.name + "'?",
            func: ( e ) => venderRemovalConfirmed( e, vender.vender_id, vender.name, setRemovalConfirm, setVenders )
        }
    )

}

const venderRemovalConfirmed = ( e, id, name, setRemovalConfirm, setVenders ) => {

    e.preventDefault();
    $('fieldset').prop('disabled', true);
    axios.post(
        '/inventory/venders/remove',
        {
            id: id
        }
    ).then(
        () => {
            setRemovalConfirm();
            GetVenders( setVenders );
            JSAlert.alert("Vender '" + name + "' has been removed.").dismissIn(1000 * 2);
        }
    ).catch(
        err => {
            $('fieldset').prop('disabled', false);
            console.log(err);
            JSAlert.alert('Something went wrong. ' + err.message).dismissIn(1000 * 2);
        }
    )

}

export const editVender = ( VendorDetails, index, Venders, setEdit, setOpenFormModal ) => {

    const vender = VendorDetails ? VendorDetails : Venders.filter( val => parseInt(val.vender_id) === parseInt(index) )[0];
    setEdit(vender.vender_id);
    setOpenFormModal(true);
    setTimeout(() => {
        $('input.form-control[name=vender_name]').val( vender.name ).attr('id', vender.vender_id);
        $('input.form-control[name=vender_contact_person]').val( vender.contact_person );
        $('input.form-control[name=vender_phone]').val( vender.phone );
        $('input.form-control[name=ntn_no]').val( vender.ntn_no );
        $('textarea.form-control[name=vender_address]').val( vender.address );
    }, 200);

}