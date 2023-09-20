import React, { lazy, Suspense, useEffect, useState } from 'react';

import { addNewCategory, editCategory, getAllCategories, removeCategory, selectIcon } from './Functions';
const UI = lazy( () => import('./UI') );

const CategoriesComponent = () => {

    const [ CategoriesList, setCategoriesList ] = useState();
    const [ icons, setIcons ] = useState([]);
    const [ SelectedIcon, setSelectedIcon ] = useState();
    const [ Confirmation, setConfirmation ] = useState();
    const [ Edit, setEdit ] = useState();
    const [ NewCategoryModal, setNewCategoryModal ] = useState(false);
    const [ SpecKeyword, setSpecKeyword ] = useState('');
    const [ FilterType, setFilterType ] = useState('');
    const [ FilterIcon, setFilterIcon ] = useState('');
    const [ LoadedTypes, setLoadedTypes ] = useState();

    useEffect(
        () => {
            if ( localStorage.getItem('category_type') )
            {
                setFilterType( localStorage.getItem('category_type') );
            }else
            {
                localStorage.setItem('category_type', 'consumable');
            }
            getAllCategories( setCategoriesList );
        }, []
    )

    useEffect(
        () => {

            if ( CategoriesList )
            {
                let names = [];
                for ( let x = 0; x < CategoriesList.length; x++ )
                {
                    if ( !names.includes( CategoriesList[x].type ) )
                    {
                        names.push(CategoriesList[x].type);
                    }
                }

                setLoadedTypes( names );
            }

        // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [ CategoriesList ]
    )

    return (
        <>
            <Suspense fallback={ <div>Loading...</div> }>
                <UI 
                    LoadedTypes={ LoadedTypes }
                    CategoriesList={ CategoriesList }
                    SpecKeyword={ SpecKeyword }
                    FilterType={ FilterType }
                    FilterIcon={ FilterIcon }
                    NewCategoryModal={ NewCategoryModal }
                    icons={ icons }
                    SelectedIcon={ SelectedIcon }
                    Confirmation={ Confirmation }

                    editCategory={ ( index ) => editCategory( index, CategoriesList, setEdit, setSelectedIcon, setNewCategoryModal ) }
                    setConfirmation={ setConfirmation }
                    removeCategory={ ( index ) => removeCategory( index, CategoriesList, setConfirmation, setCategoriesList ) }
                    addNewCategory={ ( e ) => addNewCategory( e, SelectedIcon, Edit, setCategoriesList, setSelectedIcon, setNewCategoryModal ) }
                    selectIcon={ ( key ) => selectIcon( key, icons, setSelectedIcon ) }
                    searchIcon={ setFilterIcon }
                    setIcons={ setIcons }
                    setNewCategoryModal={ setNewCategoryModal }
                    setSpecKeyword={ setSpecKeyword }
                    setFilterType={ setFilterType }
                />
            </Suspense>
        </>
    );

}

export default CategoriesComponent;