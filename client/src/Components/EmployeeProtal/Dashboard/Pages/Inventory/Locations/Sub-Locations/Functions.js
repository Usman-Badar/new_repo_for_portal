import axios from '../../../../../../../axios';
import $ from 'jquery';
import JSAlert from 'js-alert';

export const getAllSubLocations = ( LocationCode, setLocationList ) => {

    axios.post(
        '/inventory/get_sub_locations',
        {
            location_code: LocationCode
        }
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

export const createLocation = ( e, LocationCode, Edit, setEdit, setOpenFormModal, setLocationList ) => {

    e.preventDefault();
    const name = e.target['sub_location_name'].value;

    $('fieldset').prop('disabled', true);
    axios.post(
        Edit ? '/inventory/edit_sub_location' : '/inventory/add_new_sub_location',
        {
            location_code: LocationCode,
            sub_location: name,
            name: name,
            sub_location_code: Edit
        }
    ).then(
        res => {

            if( res.data === 'exists' )
            {
                $('fieldset').prop('disabled', false);
                $('#add_location_err').removeClass('d-none').html("Sub-Location already exists.");
            }else
            {
                if ( Edit )
                {
                    setEdit();
                    $('#add_location_err').removeClass('d-none').removeClass('alert-danger').addClass('alert-success').html("Sub-Location Updated Successfully.");
                }else
                {
                    if ( res.data === 'found' )
                    {
                        $('#add_location_err').removeClass('d-none').removeClass('alert-danger').addClass('alert-warning').html("Sub-Location already exists, re-active.");
                    }else
                    {
                        $('#add_location_err').removeClass('d-none').removeClass('alert-danger').addClass('alert-success').html("Sub-Location added successfully.");
                    }
                }
                setTimeout(() => {
                    setOpenFormModal(false);
                    getAllSubLocations( LocationCode, setLocationList )
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

    const location = LocationList.filter( val => val.sub_location_code === index )[0];
    setEdit(location.sub_location_code);
    setOpenFormModal(true);
    setTimeout(() => {
        $('input.form-control[name=sub_location_name]').val( location.sub_location_name ).attr('id', location.sub_location_code);
    }, 200);

}

export const removeLocation = ( index, LocationCode, LocationList, setRemovalConfirm, setLocationList ) => {
    const location = LocationList.filter( val => val.sub_location_code === index )[0];
    setRemovalConfirm(
        {
            label: "Do you want to remove sub-location '" + location.sub_location_name + "'?",
            func: ( e ) => locationRemovalConfirmed( e, LocationCode, location.sub_location_code, location.sub_location_name, setRemovalConfirm, setLocationList )
        }
    )
}

const locationRemovalConfirmed = ( e, LocationCode, id, name, setRemovalConfirm, setLocationList ) => {

    e.preventDefault();
    $('fieldset').prop('disabled', true);
    axios.post(
        '/inventory/remove_sub_location',
        {
            sub_location_code: id
        }
    ).then(
        () => {
            setRemovalConfirm();
            getAllSubLocations( LocationCode, setLocationList );
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