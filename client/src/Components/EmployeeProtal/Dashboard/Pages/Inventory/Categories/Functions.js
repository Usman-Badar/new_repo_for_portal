import axios from '../../../../../../axios';
import $ from 'jquery';
import JSAlert from 'js-alert';

export const getAllCategories = ( setCategoriesList ) => {

    axios.get(
        '/inventory/get_categories'
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

export const addNewCategory = ( e, SelectedIcon, Edit, setCategoriesList, setSelectedIcon, setNewCategoryModal ) => {

    e.preventDefault();
    if ( !SelectedIcon )
    {
        JSAlert.alert("Icon is required").dismissIn(1000 * 2);
        return false;
    }
    $('fieldset').prop('disabled', true);
    axios.post(
        Edit ? '/inventory/edit_category' : '/inventory/add_new_category',
        {
            category: e.target['category_name'].value,
            type: e.target['category_type'].value,
            icon: SelectedIcon.svg,
            category_id: Edit
        }
    ).then(
        res => {

            if( res.data === 'exists' )
            {
                $('fieldset').prop('disabled', false);
                $('#add_category_err').removeClass('d-none').html("Category already exists.");
            }
            else
            {
                if ( res.data === 'found' )
                {
                    $('#add_category_err').removeClass('d-none').removeClass('alert-danger').addClass('alert-warning').html("Category already exists, re-active.");
                }else
                {
                    $('#add_category_err').removeClass('d-none').removeClass('alert-danger').addClass('alert-success').html(Edit ? "Category updated successfully." : "Category added successfully.");
                }
                setSelectedIcon();
                setTimeout(() => {
                    setNewCategoryModal(false);
                    getAllCategories( setCategoriesList );
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

    const category = CategoriesList.filter( val => val.category_id === index )[0];
    setEdit(category.category_id);
    setNewCategoryModal(true);
    setTimeout(() => {
        setSelectedIcon(
            {
                key: '',
                svg: category.icon
            }
        );
        $('input.form-control[name=category_name]').val( category.name ).attr('id', category.category_id);
        $('select.form-control[name=category_type]').val( category.type );
    }, 500);

}

export const removeCategory = ( index, CategoriesList, setConfirmation, setCategoriesList ) => {

    const category = CategoriesList.filter( val => val.category_id === index )[0];
    setConfirmation(
        {
            label: "Do you want to remove category '" + category.name + "'?",
            func: ( e ) => categoryRemovalConfirmed( e, category.category_id, category.name, setConfirmation, setCategoriesList )
        }
    )

}

const categoryRemovalConfirmed = ( e, category_id, name, setConfirmation, setCategoriesList ) => {

    e.preventDefault();
    $('fieldset').prop('disabled', true);
    axios.post(
        '/inventory/remove_category',
        {
            category_id: category_id
        }
    ).then(
        () => {

            setConfirmation();
            getAllCategories( setCategoriesList );
            JSAlert.alert("Category '" + name + "' has been removed.").dismissIn(1000 * 2);

        }
    ).catch(
        err => {

            $('fieldset').prop('disabled', true);
            console.log(err);
            JSAlert.alert('Something went wrong. ' + err.message).dismissIn(1000 * 2);

        }
    )

}