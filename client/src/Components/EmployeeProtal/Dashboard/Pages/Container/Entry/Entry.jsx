import React, { lazy, Suspense, useEffect, useState } from 'react';

import { Entry, GetLocations, loadList } from './Functions';
const UI = lazy( () => import('./UI') );

const Entry = () => {
    
    const [ List, setList ] = useState();
    const [ Locations, setLocations ] = useState([]);

    useEffect(
        () => {
            loadList( setList );
            GetLocations( setLocations );
        }, []
    )

    return (
        <>
            <Suspense fallback={ <div>Loading...</div> }>
                <UI 
                    List={ List }
                    Locations={ Locations }

                    Entry={ ( e, history ) => Entry( e, history ) }
                />
            </Suspense>
        </>
    );

}

export default Entry;