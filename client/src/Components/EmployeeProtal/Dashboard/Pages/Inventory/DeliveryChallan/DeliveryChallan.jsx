import React, { lazy, Suspense, useEffect, useState } from 'react';

import { createDeliveryChallan, enterItem, loadList, onChangeItems, searchVender, vendorSelection } from './Functions';
const UI = lazy( () => import('./UI') );

const DeliveryChallan = () => {

    const [ List, setList ] = useState();
    const [ Item, setItem ] = useState(
        {
            description: '',
            quantity: 1
        }
    );
    const [ Vendor, setVendor ] = useState();
    const [ Vendors, setVendors ] = useState([]);
    const [ Items, setItems ] = useState([]);

    useEffect(
        () => {
            loadList( setList );
        }, []
    )

    return (
        <>
            <Suspense fallback={ <div>Loading....</div> }>
                <UI 
                    List={ List }
                    Items={ Items }
                    Item={ Item }
                    Vendors={ Vendors }

                    createDeliveryChallan={ ( e, history ) => createDeliveryChallan( e, history, Item, Items, Vendor, setVendor, setVendors, setItems, setItem ) }
                    vendorSelection={ ( index ) => vendorSelection( index, Vendors, setVendor, setVendors ) }
                    searchVender={ ( e ) => searchVender( e, setVendors, setVendor ) }
                    onChangeItems={ ( e ) => onChangeItems( e, Item, setItem ) }
                    enterItem={ () => enterItem( Item, Items, setItems, setItem ) }
                />
            </Suspense>
        </>
    );

}

export default DeliveryChallan;