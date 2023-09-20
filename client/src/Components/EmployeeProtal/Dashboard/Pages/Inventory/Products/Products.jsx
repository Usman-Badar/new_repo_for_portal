/* eslint-disable react-hooks/exhaustive-deps */
import React, { lazy, Suspense, useEffect, useState } from 'react';

import { getAllProducts, getCategories, getSubCategories, search } from './Functions';
const UI = lazy( () => import('./UI') );

const Products = () => {

    const [ SearchedProductsList, setSearchedProductsList ] = useState();
    const [ ProductsList, setProductsList ] = useState([]);
    const [ Open, setOpen ] = useState(false);
    const [ CatType, setCatType ] = useState('consumable');
    const [ Category, setCategory ] = useState();
    const [ SubCategory, setSubCategory ] = useState();
    const [ Categories, setCategories ] = useState();
    const [ SubCategories, setSubCategories ] = useState();

    useEffect(
        () => {
            setProductsList([]);
            setSearchedProductsList();
            getAllProducts( CatType, setProductsList );
        }, [ CatType ]
    )

    useEffect(
        () => {
            setCategory();
            setSubCategory();
            setCategories();
            setSubCategories();
            getCategories( setCategories );
        }, [ CatType ]
    )

    useEffect(
        () => {
            setSubCategory();
            setSubCategories();
            getSubCategories( Category, setSubCategories );

            if ( Category )
            {
                const data = ProductsList;
                const arr = data.filter(
                    val => {
                        return val.category_id === parseInt(Category)
                    }
                );

                setSearchedProductsList(arr);
            }
        }, [ Category ]
    )

    useEffect(
        () => {

            if ( SubCategory )
            {
                const data = ProductsList;
                const arr = data.filter(
                    val => {
                        return val.category_id === parseInt(Category) && val.sub_category_id === parseInt(SubCategory)
                    }
                );

                setSearchedProductsList(arr);
            }

        }, [ SubCategory ]
    )

    // useEffect(
    //     () => {
    //         if ( sessionStorage.getItem('CatType') && sessionStorage.getItem('CatType') !== '' )
    //         {
    //             setCatType(sessionStorage.getItem('CatType'));
    //         }
    //         if ( sessionStorage.getItem('Category') && sessionStorage.getItem('Category') !== '' )
    //         {
    //             setCategory(parseInt(sessionStorage.getItem('Category')));
    //         }
    //         if ( sessionStorage.getItem('SubCategory') && sessionStorage.getItem('SubCategory') !== '' )
    //         {
    //             setSubCategory(parseInt(sessionStorage.getItem('SubCategory')));
    //         }
    //     }, []
    // );

    return (
        <>
            <Suspense fallback={ <div>Loading...</div> }>
                <UI 
                    SearchedProductsList={ SearchedProductsList }
                    ProductsList={ ProductsList }
                    Open={ Open }
                    CatType={ CatType }
                    Category={ Category }
                    SubCategory={ SubCategory }
                    Categories={ Categories }
                    SubCategories={ SubCategories }

                    search={ (e) => search( e, Category, SubCategory, ProductsList, setSearchedProductsList ) }
                    setCatType={ (val) => { setCatType(val); sessionStorage.setItem('CatType', val) } }
                    setCategory={ (val) => { setCategory(val); sessionStorage.setItem('Category', val) } }
                    setSubCategory={ (val) => { setSubCategory(val); sessionStorage.setItem('SubCategory', val) } }
                />
            </Suspense>
        </>
    );

}

export default Products;