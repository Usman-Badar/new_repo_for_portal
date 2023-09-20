/* eslint-disable react-hooks/exhaustive-deps */
import React, { lazy, Suspense, useEffect, useState } from 'react';

import { addNewCategory, editCategory, getAllCategories, removeCategory, selectIcon } from './Functions';
const UI = lazy( () => import('./UI') );

const SubCategoriesComponent = () => {

    const category_id = window.location.href.split('/').pop();

    const [ CategoriesList, setCategoriesList ] = useState();
    const [ icons, setIcons ] = useState([]);
    const [ SelectedIcon, setSelectedIcon ] = useState();
    const [ Confirmation, setConfirmation ] = useState();
    const [ Edit, setEdit ] = useState();
    const [ NewCategoryModal, setNewCategoryModal ] = useState(false);
    const [ SpecKeyword, setSpecKeyword ] = useState('');
    const [ FilterIcon, setFilterIcon ] = useState('');
    const [ Tagging, setTagging ] = useState('');
    const [ HODApproval, setHODApproval ] = useState('');

    useEffect(
        () => {
            getAllCategories( category_id, setCategoriesList );
        }, []
    )

    return (
        <>
            <Suspense fallback={ <div>Loading...</div> }>
                <UI 
                    CategoriesList={ CategoriesList }
                    SpecKeyword={ SpecKeyword }
                    FilterIcon={ FilterIcon }
                    NewCategoryModal={ NewCategoryModal }
                    icons={ icons }
                    SelectedIcon={ SelectedIcon }
                    Confirmation={ Confirmation }
                    Edit={ Edit }
                    Tagging={ Tagging }
                    HODApproval={ HODApproval }

                    setHODApproval={ setHODApproval }
                    setTagging={ setTagging }
                    setEdit={ setEdit }
                    editCategory={ ( index ) => editCategory( index, CategoriesList, setEdit, setSelectedIcon, setNewCategoryModal ) }
                    setConfirmation={ setConfirmation }
                    removeCategory={ ( index ) => removeCategory( index, category_id, CategoriesList, setConfirmation, setCategoriesList ) }
                    addNewCategory={ ( e ) => addNewCategory( e, category_id, SelectedIcon, Edit, setCategoriesList, setSelectedIcon, setNewCategoryModal ) }
                    selectIcon={ ( key ) => selectIcon( key, icons, setSelectedIcon ) }
                    searchIcon={ setFilterIcon }
                    setIcons={ setIcons }
                    setNewCategoryModal={ setNewCategoryModal }
                    setSpecKeyword={ setSpecKeyword }
                />
            </Suspense>
        </>
    );

}

export default SubCategoriesComponent;