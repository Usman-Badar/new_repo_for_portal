import React, { lazy, Suspense, useEffect, useState } from 'react';
import { GetAllLocations, Edit, BackToLocations, OpenFormFunc, onChangeHandler, onSubmitForm, Delete } from './Methods';
import axios from '../../../../axios';

const UI = lazy( () => import('./UI') );

const Locations = () => {

    const [ LocationsList, setLocationsList ] = useState([]);
    const [ Location, setLocation ] = useState();
    const [ Error, setError ] = useState();
    const [ OpenForm, setOpenForm ] = useState(false);

    useEffect(
        () => {

            GetAllLocations( axios, setLocationsList );

        }, []
    )

    return (
        <>
            <Suspense fallback={ <div>Loading....</div> }>
                <UI
                    LocationsList={ LocationsList }
                    Location={ Location }
                    OpenForm={ OpenForm }
                    Error={ Error }

                    Delete={ ( index ) => Delete( index, axios, setLocationsList, setError ) }
                    Edit={ ( index ) => Edit( index, LocationsList, setLocation ) }
                    BackToLocations={ () => BackToLocations( setLocation, setOpenForm ) }
                    OpenFormFunc={ () => OpenFormFunc( OpenForm, setOpenForm ) }
                    onChangeHandler={ ( e ) => onChangeHandler( e, Location, setLocation ) }
                    onSubmitForm={ ( e, url ) => onSubmitForm( e, url, Location, axios, setLocation, setOpenForm, setLocationsList, setError ) }
                />
            </Suspense>
        </>
    )

}

export default Locations;