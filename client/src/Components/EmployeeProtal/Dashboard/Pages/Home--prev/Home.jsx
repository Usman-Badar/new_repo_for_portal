/* eslint-disable react-hooks/exhaustive-deps */
import React, { Suspense, lazy, useEffect, useState } from 'react';
import { getWeather, loadACRequest, loadData } from './Functions';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

const UI = lazy( () => import('./UI') );

function Home() {

    const history = useHistory();
    const AccessControls = useSelector( ( state ) => state.EmpAuth.EmployeeData );
    const key = '7e983c87da99f5721b3c4031cb6a4c32';

    const [ WeatherData, setWeatherData ] = useState();
    const [ Coordinates, setCoordinates ] = useState();
    const [ HomeData, setHomeData ] = useState();
    const [ InventoryData, setInventoryData ] = useState();
    const [ ACData, setACData ] = useState();
    const [ View, setView ] = useState(1);
    
    // useEffect(
    //     () => {
    //         getPosition();
    //     }, []
    // );

    useEffect(
        () => {
            if ( Coordinates )
            {
                getWeather( key, Coordinates, setWeatherData );
            }
        }, [ Coordinates ]
    );

    // useEffect(
    //     () => {
    //         // sample arguments for registration
    //         const createCredentialDefaultArgs = {
    //             publicKey: {
    //                 // Relying Party (a.k.a. - Service):
    //                 rp: {
    //                     name: "Acme",
    //                 },
    //                 // User:
    //                 user: {
    //                     id: new Uint8Array(16),
    //                     name: "carina.p.anand@example.com",
    //                     displayName: "Carina P. Anand",
    //                 },
    //                 pubKeyCredParams: [
    //                     {
    //                         type: "public-key",
    //                         alg: -7,
    //                     },
    //                 ],
    //                 attestation: "direct",
    //                 timeout: 60000,
    //                 challenge: new Uint8Array([
    //                     // must be a cryptographically random number sent from a server
    //                     0x8c, 0x0a, 0x26, 0xff, 0x22, 0x91, 0xc1, 0xe9, 0xb9, 0x4e, 0x2e, 0x17, 0x1a,
    //                     0x98, 0x6a, 0x73, 0x71, 0x9d, 0x43, 0x48, 0xd5, 0xa7, 0x6a, 0x15, 0x7e, 0x38,
    //                     0x94, 0x52, 0x77, 0x97, 0x0f, 0xef,
    //                 ]).buffer,
    //             },
    //         };

    //         // sample arguments for login
    //         const getCredentialDefaultArgs = {
    //             publicKey: {
    //                 timeout: 60000,
    //                 // allowCredentials: [newCredential] // see below
    //                 challenge: new Uint8Array([
    //                     // must be a cryptographically random number sent from a server
    //                     0x79, 0x50, 0x68, 0x71, 0xda, 0xee, 0xee, 0xb9, 0x94, 0xc3, 0xc2, 0x15, 0x67,
    //                     0x65, 0x26, 0x22, 0xe3, 0xf3, 0xab, 0x3b, 0x78, 0x2e, 0xd5, 0x6f, 0x81, 0x26,
    //                     0xe2, 0xa6, 0x01, 0x7d, 0x74, 0x50,
    //                 ]).buffer,
    //             },
    //         };

    //         // register / create a new credential
    //         navigator.credentials
    //             .create(createCredentialDefaultArgs)
    //             .then((cred) => {
    //                 console.log("NEW CREDENTIAL", cred);
    //                 // normally the credential IDs available for an account would come from a server
    //                 // but we can just copy them from above…
    //                 const idList = [
    //                     {
    //                         id: cred.rawId,
    //                         transports: ["usb", "nfc", "ble"],
    //                         type: "public-key",
    //                     },
    //                 ];
    //                 getCredentialDefaultArgs.publicKey.allowCredentials = idList;
    //                 return navigator.credentials.get(getCredentialDefaultArgs);
    //             })
    //             .then((assertion) => {
    //                 console.log("ASSERTION", assertion);
    //             })
    //             .catch((err) => {
    //                 console.log("ERROR", err);
    //             });

    //         // if ("credentials" in navigator) {
    //         //     navigator.credentials.get({ password: true }).then((creds) => {
    //         //         //Do something with the credentials.
    //         //     });
    //         // } else {
    //         //     //Handle sign-in the way you did before.
    //         // }
    //     }, []
    // )

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
                ACData={ ACData }

                setView={ setView }
                loadACRequest={ loadACRequest }
                loadData={ () => loadData( setHomeData, setInventoryData, setACData ) }
                getWeather={ getWeather }
                setCoordinates={ setCoordinates }
            />
        </Suspense>
    )
}

export default Home;