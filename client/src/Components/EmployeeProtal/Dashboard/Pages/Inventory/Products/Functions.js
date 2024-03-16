import axios from '../../../../../../axios';
import $ from 'jquery';

export const GetCompanies = ( setCompanies, setLocations ) => {

    axios.get('/getallcompanies')
    .then(
        res => 
        {
                
            setCompanies(res.data);
            GetLocations(setLocations)

        }
    ).catch(
        err => {

            console.log(err);

        }
    );

}

export const GetLocations = (setLocations) => {
    setLocations([]);
    axios.get('/getalllocations').then(
        res => {
            setLocations(res.data);
        }
    ).catch(
        err => {
            console.log(err);
        }
    )
}

export const GetSubLocations = (value, setSubLocations) => {
    setSubLocations([]);
    axios.post('/getallsublocations', {location_code: value}).then(
        res => {
            setSubLocations(res.data);
        }
    ).catch(
        err => {
            console.log(err);
        }
    )
}

export const getAllProducts = (SubLocationCode, LocationCode, CompanyCode, CatType, setProductsList) => {

    axios.post(
        '/inventory/get_products',
        {
            type: CatType,
            company: CompanyCode,
            location: LocationCode,
            sub_location: SubLocationCode
        }
    ).then(
        res => {
            setProductsList(res.data);
        }
    ).catch(
        err => {

            console.log(err);

        }
    )

}

export const search = (e, Category, SubCategory, arr, setState) => {

    let rslt = [];
    if ( Category && SubCategory )
    {
        for (let x = 0; x < arr.length; x++) {
            if 
            (
                arr[x].sub_category_name.toLowerCase().includes(e.target.value.toLowerCase()) &&
                arr[x].category_id === parseInt(Category) &&
                arr[x].sub_category_id === parseInt(SubCategory)
            ) {
                rslt.push(arr[x]);
            }
        }
    }else
    if ( Category )
    {
        for (let x = 0; x < arr.length; x++) {
            if 
            (
                arr[x].sub_category_name.toLowerCase().includes(e.target.value.toLowerCase()) &&
                arr[x].category_id === parseInt(Category)
            ) {
                rslt.push(arr[x]);
            }
        }
    }else
    {
        for (let x = 0; x < arr.length; x++) {
            if 
            (
                arr[x].sub_category_name.toLowerCase().includes(e.target.value.toLowerCase())
            ) {
                rslt.push(arr[x]);
            }
        }
    }
    setState(rslt);
    sessionStorage.setItem('productSearch', e.target.value);

};

export const getCategories = (setCategories) => {

    axios.get(
        '/inventory/get_categories'
    ).then(
        res => {

            setCategories(res.data);

        }
    ).catch(
        err => {

            console.log(err);

        }
    )

}

export const getSubCategories = (category_id, setSubCategories) => {

    axios.post(
        '/inventory/get_sub_categories',
        {
            category_id: category_id
        }
    ).then(
        res => {

            setSubCategories(res.data);

        }
    ).catch(
        err => {

            console.log(err);

        }
    )

}