import axios from '../../../../../../axios';
import $ from 'jquery';
import JSAlert from 'js-alert';

export const getAllLocations = ( setLocationList ) => {

    axios.get(
        '/inventory/get_locations'
    ).then(
        res => {

            setLocationList( res.data );

        }
    ).catch(
        err => {

            console.log( err );

        }
    )

}

export const createLocation = ( e, Edit, setEdit, setOpenFormModal, setLocationList ) => {

    e.preventDefault();
    const name = e.target['location_name'].value;
    const phone = e.target['location_phone'].value;
    const address = e.target['location_address'].value;

    $('fieldset').prop('disabled', true);
    axios.post(
        Edit ? '/inventory/edit_location' : '/inventory/add_new_location',
        {
            location: name,
            name: name,
            phone: phone,
            address: address,
            location_code: Edit
        }
    ).then(
        res => {

            if( res.data === 'exists' )
            {
                $('fieldset').prop('disabled', false);
                $('#add_location_err').removeClass('d-none').html("Location already exists.");
            }else
            {
                if ( Edit )
                {
                    setEdit();
                    $('#add_location_err').removeClass('d-none').removeClass('alert-danger').addClass('alert-success').html("Location Updated Successfully.");
                }else
                {
                    if ( res.data === 'found' )
                    {
                        $('#add_location_err').removeClass('d-none').removeClass('alert-danger').addClass('alert-warning').html("Location already exists, re-active.");
                    }else
                    {
                        $('#add_location_err').removeClass('d-none').removeClass('alert-danger').addClass('alert-success').html("Location added successfully.");
                    }
                }
                setTimeout(() => {
                    setOpenFormModal(false);
                    getAllLocations( setLocationList )
                }, 1500);
            }

        }
    ).catch(
        err => {

            $('fieldset').prop('disabled', false);
            console.log( err );
            $('#add_location_err').removeClass('d-none').html("Something went wrong: " + err.message);

        }
    )

}

export const editLocation = ( index, LocationList, setEdit, setOpenFormModal ) => {

    const location = LocationList.filter( val => val.location_code === index )[0];
    setEdit(location.location_code);
    setOpenFormModal(true);
    setTimeout(() => {
        $('input.form-control[name=location_name]').val( location.location_name ).attr('id', location.location_code);
        $('input.form-control[name=location_phone]').val( location.location_phone );
        $('textarea.form-control[name=location_address]').val( location.address );
    }, 200);

}

export const removeLocation = ( index, LocationList, setRemovalConfirm, setLocationList ) => {
    const location = LocationList.filter( val => val.location_code === index )[0];
    setRemovalConfirm(
        {
            label: "Do you want to remove location '" + location.location_name + "'?",
            func: ( e ) => locationRemovalConfirmed( e, location.location_code, location.location_name, setRemovalConfirm, setLocationList )
        }
    )
}

const locationRemovalConfirmed = ( e, id, name, setRemovalConfirm, setLocationList ) => {

    e.preventDefault();
    $('fieldset').prop('disabled', true);
    axios.post(
        '/inventory/remove_location',
        {
            location_code: id
        }
    ).then(
        () => {
            setRemovalConfirm();
            getAllLocations( setLocationList );
            JSAlert.alert("Location '" + name + "' has been removed.").dismissIn(1000 * 2);
        }
    ).catch(
        err => {
            $('fieldset').prop('disabled', false);
            console.log(err);
            JSAlert.alert('Something went wrong. ' + err.message).dismissIn(1000 * 2);
        }
    )

}