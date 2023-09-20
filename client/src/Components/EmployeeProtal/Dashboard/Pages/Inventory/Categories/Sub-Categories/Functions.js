/* eslint-disable eqeqeq */
import axios from '../../../../../../../axios';
import $ from 'jquery';
import JSAlert from 'js-alert';

export const getAllCategories = ( category_id, setCategoriesList ) => {

    axios.post(
        '/inventory/get_sub_categories',
        {
            category_id: category_id
        }
    ).then(
        res => {

            setCategoriesList( res.data );

        }
    ).catch(
        err => {

            console.log( err );

        }
    )

}

export const selectIcon = ( key, icons, setSelectedIcon ) => {

    for ( let x  = 0; x < icons.length; x++ )
    {
        if ( icons[x].key === key )
        {
            setSelectedIcon(icons[x]);
            return false;
        }
    }

}

export const addNewCategory = ( e, category_id, SelectedIcon, Edit, setCategoriesList, setSelectedIcon, setNewCategoryModal ) => {

    e.preventDefault();
    if ( !SelectedIcon )
    {
        JSAlert.alert("Icon is required").dismissIn(1000 * 2);
        return false;
    }
    $('fieldset').prop('disabled', true);
    axios.post(
        Edit ? '/inventory/edit_sub_category' : '/inventory/add_new_sub_category',
        {
            sub_category_id: Edit,
            category_id: category_id,
            sub_category: e.target['sub_category_name'].value,
            category: e.target['sub_category_name'].value,
            labeling: e.target['labeling'].value == 0 ? false : true,
            hod_approval_required: e.target['hod_approval_required'].value == 0 ? false : true,
            icon: SelectedIcon.svg,
            id: Edit
        }
    ).then(
        res => {

            if( res.data === 'exists' )
            {
                $('fieldset').prop('disabled', false);
                $('#add_category_err').removeClass('d-none').html("Sub-Category already exists.");
            }
            else
            {
                if ( res.data === 'found' )
                {
                    $('#add_category_err').removeClass('d-none').removeClass('alert-danger').addClass('alert-warning').html("Sub-Category already exists, re-active.");
                }else
                {
                    $('#add_category_err').removeClass('d-none').removeClass('alert-danger').addClass('alert-success').html(Edit ? "Sub-Category updated successfully." : "Sub-Category added successfully.");
                }
                setSelectedIcon();
                setTimeout(() => {
                    setNewCategoryModal(false);
                    getAllCategories( category_id, setCategoriesList );
                }, 1500);
            }

        }
    ).catch(
        err => {

            $('fieldset').prop('disabled', false);
            console.log( err );
            $('#add_category_err').removeClass('d-none').html("Something went wrong: " + err.message);

        }
    )

}

export const editCategory = ( index, CategoriesList, setEdit, setSelectedIcon, setNewCategoryModal ) => {

    const category = CategoriesList.filter( val => val.id === index )[0];
    setEdit(category.id);
    setNewCategoryModal(true);
    setTimeout(() => {
        setSelectedIcon(
            {
                key: '',
                svg: category.icon
            }
        );
        $('input.form-control[name=sub_category_name]').val( category.name ).attr('id', category.id);
        $('select.form-control[name=labeling]').val( category.labeling );
        $('select.form-control[name=hod_approval_required]').val( category.hod_approval_required );
    }, 200);

}

export const removeCategory = ( index, category_id, CategoriesList, setConfirmation, setCategoriesList ) => {

    const category = CategoriesList.filter( val => val.id === index )[0];
    setConfirmation(
        {
            label: "Do you want to remove sub-category '" + category.name + "'?",
            func: ( e ) => categoryRemovalConfirmed( e, category_id, category.id, category.name, setConfirmation, setCategoriesList )
        }
    )

}

const categoryRemovalConfirmed = ( e, category_id, id, name, setConfirmation, setCategoriesList ) => {

    e.preventDefault();
    $('fieldset').prop('disabled', true);
    axios.post(
        '/inventory/remove_sub_category',
        {
            id: id
        }
    ).then(
        () => {

            setConfirmation();
            getAllCategories( category_id, setCategoriesList );
            JSAlert.alert("Sub-Category '" + name + "' has been removed.").dismissIn(1000 * 2);

        }
    ).catch(
        err => {

            $('fieldset').prop('disabled', true);
            console.log(err);
            JSAlert.alert('Something went wrong. ' + err.message).dismissIn(1000 * 2);

        }
    )

}