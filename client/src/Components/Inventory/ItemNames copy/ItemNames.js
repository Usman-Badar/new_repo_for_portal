import React, { lazy, Suspense, useEffect, useState } from 'react';

import { onChangeHandler, EnterNewItem } from './Methods';
import axios from '../../../axios';
import { useHistory } from 'react-router-dom';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UI = lazy( () => import('./UI') );

const ItemNames = () => {

    const history = useHistory();

    const [ ViewTitle, setViewTitle ] = useState("");
    const [ ItemsList, setItemsList ] = useState([]);
    const [ Disabled, setDisabled ] = useState(false);
    const [ Form, setForm ] = useState(
        {
            item_name: ""
        }
    );

    useEffect(
        () => {

            axios.get(
                '/getallitemsnames'
            ).then(
                res => {

                    setItemsList( res.data )

                }
            ).catch(
                err => {

                    console.log( err );

                }
            )

        }, []
    )

    useEffect(
        () => {

            if ( window.location.href.split('/').pop() === 'new_items_names' )
            {
                setViewTitle("Enter New Item");
            }else
            {
                setViewTitle("All Items List");
            }

        }, [ window.location.href.split('/').pop() ]
    )

    return (
        <>
            <ToastContainer />
            <Suspense fallback={ <div>Loading...</div> }>
                <UI
                    ViewTitle={ ViewTitle }
                    ItemsList={ ItemsList }
                    Form={ Form }
                    Disabled={ Disabled }

                    setForm={ setForm }
                    onChangeHandler={ onChangeHandler }
                    EnterNewItem={ (e) => EnterNewItem( e,axios, Form, toast, setDisabled, history ) }
                />
            </Suspense>
        </>
    )

}
export default ItemNames;