import React, { lazy, Suspense, useState } from 'react';

import { GetStoreItems } from './Methods';

const UI = lazy( () => import('./UI') );

const Inward = () => {

    const [ StoreItems, setStoreItems ] = useState([]);
    const [ Form, setForm ] = useState(
        {
            item_id: null,
            item_name: "",
            required_quantity: "",
            reason: ""
        }
    )

    return (
        <>
            <Suspense fallback={ <div>Loading....</div> }>
                <UI />
            </Suspense>
        </>
    )

}

export default Inward;