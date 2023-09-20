import React, { lazy, Suspense, useEffect, useState } from 'react';
import { GetMenuItems, onChangeHandler, GetAllEnteredViews, GetAllEnteredOptionIDs, AddNewMenuItem, onChangeIndex, EditItem, RemoveItem } from './Methods';
import axios from '../../../../axios';

const UI = lazy( () => import('./UI') );

const MenuSetup = () => {

    const [ MenuItems, setMenuItems ] = useState([]);
    const [ AllViews, setAllViews ] = useState([]);
    const [ AllOptions, setAllOptions ] = useState([]);
    const [ Edit, setEdit ] = useState();
    const [ Form, setForm ] = useState(
        {
            menu_txt: '',
            icon_class_name: '',
            type: 'link',
            option_id: null,
            link: null,
            view: 'portal',
            under_menu: null,
            access: null
        }
    );

    useEffect(
        () => {

            GetMenuItems( axios, setMenuItems );
            GetAllEnteredViews( axios, setAllViews );
            GetAllEnteredOptionIDs( axios, setAllOptions );

        }, []
    )

    return (
        <>
            <Suspense fallback={ <div>Loading....</div> }>
                <UI
                    MenuItems={ MenuItems }
                    AllViews={ AllViews }
                    AllOptions={ AllOptions }
                    Form={ Form }
                    Edit={ Edit }

                    onChangeHandler={ (e) => onChangeHandler( e, Form, setForm ) }
                    AddNewMenuItem={ (e) => AddNewMenuItem( e, Form, axios, Edit, setEdit, setForm, setMenuItems, setAllOptions, setAllViews ) }
                    EditItem={ (index) => EditItem( index, MenuItems, setEdit, setForm ) } 
                    RemoveItem={ (index) => RemoveItem( index, MenuItems, axios, setMenuItems ) }
                    onChangeIndex={ (e, index) => onChangeIndex( e, index, axios, MenuItems, setMenuItems ) }
                />
            </Suspense>
        </>
    )

}

export default MenuSetup;