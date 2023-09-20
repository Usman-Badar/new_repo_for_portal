import React, { lazy, Suspense, useEffect, useState } from 'react';

import { onChangeHandler, EnterNewItem, GetAllItems, Delete, Edit } from './Methods';
import axios from '../../../axios';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UI = lazy( () => import('./UI') );

const ItemNames = () => {

    const [ ItemsList, setItemsList ] = useState([]);
    const [ Editing, setEditing ] = useState(false);
    const [ Log, setLog ] = useState();
    const [ Form, setForm ] = useState(
        {
            item_name: ""
        }
    );

    useEffect(
        () => {

            GetAllItems( axios, setItemsList, setLog );

        }, []
    )

    useEffect(
        () => {

            setTimeout(() => {
                setLog();
            }, 5000);

        }, [ Log ]
    )

    return (
        <>
            <ToastContainer />
            <Suspense fallback={ <div>Loading...</div> }>
                <UI
                    ItemsList={ ItemsList }
                    Form={ Form }
                    Editing={ Editing }
                    Log={ Log }

                    onChangeHandler={ (e) => onChangeHandler(e, Form, setForm) }
                    EnterNewItem={ (e) => EnterNewItem( e, axios, Form, toast, Editing, setForm, setItemsList, setEditing, setLog ) }
                    Delete={ ( index ) => Delete( index, axios, ItemsList, setItemsList, setLog ) }
                    Edit={ ( index ) => Edit( index, ItemsList, setForm, setEditing ) }
                />
            </Suspense>
        </>
    )

}
export default ItemNames;