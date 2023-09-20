/* eslint-disable react-hooks/exhaustive-deps */
import React, { Suspense, lazy, useEffect, useState } from 'react';
import { getWeather, loadData } from './Functions';
import { useSelector } from 'react-redux';

const UI = lazy( () => import('./UI') );

function Home() {

    const AccessControls = useSelector( ( state ) => state.EmpAuth.EmployeeData );
    const key = '7e983c87da99f5721b3c4031cb6a4c32';

    const [ WeatherData, setWeatherData ] = useState();
    const [ Coordinates, setCoordinates ] = useState();
    const [ HomeData, setHomeData ] = useState();
    const [ InventoryData, setInventoryData ] = useState();
    const [ View, setView ] = useState(1);
    
    useEffect(
        () => {
            getPosition();
        }, []
    );

    useEffect(
        () => {
            if ( Coordinates )
            {
                getWeather( key, Coordinates, setWeatherData );
            }
        }, [ Coordinates ]
    );

    const getPosition = async () => {
        await navigator.geolocation.getCurrentPosition(
            position => setCoordinates(
                {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                }
            ),
            err => console.log(err)
        );
    }

    return (
        <Suspense fallback={ <div>Loading...</div> }>
            <UI 
                WeatherData={ WeatherData }
                AccessControls={ AccessControls }
                HomeData={ HomeData }
                View={ View }
                InventoryData={ InventoryData }

                setView={ setView }
                loadData={ () => loadData( setHomeData, setInventoryData ) }
                getWeather={ getWeather }
                setCoordinates={ setCoordinates }
            />
        </Suspense>
    )
}

export default Home;