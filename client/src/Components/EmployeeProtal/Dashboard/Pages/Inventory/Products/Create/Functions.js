import axios from '../../../../../../../axios';
import $ from 'jquery';
import JSAlert from 'js-alert';

export const GetCompanies = ( setCompanies, setLocations ) => {
    axios.get('/getallcompanies')
    .then(
        res => 
        {
            setCompanies(res.data);
            if ( setLocations )
            {
                GetLocations(setLocations);
            }
        }
    ).catch(
        err => {
            console.log(err);
        }
    );
}

export const GetLocations = ( setLocations ) => {
    axios.get('/getalllocations').then(
        res => {
            setLocations( res.data );
        }
    ).catch(
        err => {
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

export const LoadCategories = ( Type, setCategories, setCategory, setSubCategory, setSubCategories ) => {

    axios.post(
        '/inventory/product/create/load_categories',
        {
            type: Type
        }
    ).then(
        res => {
            $('#sub_category_input').val('');
            setCategory();
            setSubCategory();
            setCategories( res.data );
            setSubCategories([]);
        }
    ).catch(
        err => {
            console.log( err );
        }
    )

}

export const searchSubCategories = ( e, setSubCategories, setSubCategory, setType, setCategory ) => {

    if ( e.target.value === '' )
    {
        setSubCategories([]);
        setSubCategory();
        setType('')
        setCategory();
        return false;
    }

    axios.post(
        '/inventory/product/sub_categories/search',
        {
            key: e.target.value,
        }
    ).then(
        res => {
            setSubCategories( res.data );
        }
    ).catch(
        err => {
            console.log( err );
        }
    )

}

export const selectSubCategory = ( id, SubCategories, setCategory, setSubCategory, setType ) => {

    const Arr = SubCategories.filter(
        ( val, index ) => {
            return index === id
        }
    );
    $('#sub_category_input').val(Arr[0]?.name);
    setCategory(
        {
            category_id: Arr[0]?.category_id,
            name: Arr[0]?.category_name
        }
    );
    setSubCategory(Arr[0]?.id);
    setType(Arr[0]?.type);

}

export const onAddAttribute = ( e, Attributes, setAttributes ) => {

    const key = document.getElementById('key').value;
    const type = document.getElementById('type').value;
    const value = document.getElementById('value').value;

    if ( key === '' || value === '' )
    {
        return false;
    }
    let arr = Attributes;
    arr = [...arr, {key: key,type: type,value: value}];
    setAttributes(arr);

    document.getElementById('key').value = '';
    document.getElementById('value').value = '';
    
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

export const onFileSelection = ( event, Preview, setPreview ) => {
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

export const onCreateProduct = ( e, history, Preview, Category, SubCategory, Type, AttachedDC, SubCategories, Attributes ) => {

    e.preventDefault();
    var dateString = e.target['acquisition_date'].value;
    var myDate = new Date(dateString);
    var today = new Date();
    if ( myDate > today )
    {
        JSAlert.alert("Acquisition date should not be greater than today's date!!.").dismissIn(1500 * 1);
        return false;
    }
    $('fieldset').prop('disabled', 'disabled');
    let sub_category = SubCategories.filter(
        ( val ) => {
            return val.id === SubCategory
        }
    )
    let labeling = sub_category[0].labeling;
    const Data = new FormData();
    Data.append("Attachment", Preview ? Preview.file : undefined);
    Data.append("company", e.target['company_code'].value);
    Data.append("location", e.target['location_code'].value);
    Data.append("sub_location", e.target['sub_location_code'].value);
    Data.append("category", Category.category_id);
    Data.append("sub_category", SubCategory);
    Data.append("name", e.target['name'].value);
    Data.append("quantity", e.target['quantity'].value);
    Data.append("unit_price", e.target['unit_price'].value);
    Data.append("description", e.target['description'].value);
    Data.append("product_acquisition_date", e.target['acquisition_date'].value);
    Data.append("physical_condition", e.target['physical_condition'].value);
    Data.append("product_type", Type);
    Data.append("product_note", e.target['note'].value);
    Data.append("delivery_challan", AttachedDC ? AttachedDC.challan_id : 'null');
    Data.append("labeling", labeling);
    Data.append("challan_generate_date", AttachedDC ? AttachedDC.generate_date : 'null');
    Data.append("attributes", JSON.stringify( Attributes ));
    Data.append("recorded_by", localStorage.getItem('EmpID'));

    axios.post(
        '/inventory/products/create',
        Data
    ).then(
        (res) => {

            if ( res.data.title && res.data.title === 'exists' )
            {
                JSAlert.alert("Product Already Exists!!! Inward has been created.").dismissIn(1500 * 1);
                $('fieldset').prop('disabled', false);
            }else
            {
                JSAlert.alert("Product Created.").dismissIn(1500 * 1);
            }
            setTimeout(() => {
                history.replace('/inventory/products/list');
            }, 1000);

        }
    ).catch(
        err => {

            JSAlert.alert("Something went wrong!!!.").dismissIn(1500 * 1);
            $('fieldset').prop('disabled', false);
            console.log( err );

        }
    )

}