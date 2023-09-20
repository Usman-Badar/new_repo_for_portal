import React, { lazy, useEffect, useState} from 'react';
import axios from '../../../../../../axios';

const UI = lazy(() => import('./UI'));

const TempEmployees = () => {

    const [ Departments, setDepartments ] = useState([]);
    const [ Companies, setCompanies ] = useState([]);
    const [ Locations, setLocations ] = useState([]);


    useEffect(
        () => {
            loadCompanies();
        }
    )

    const loadCompanies = () => {

        axios.get('/getcompaniescodes').then( response => {

            setCompanies( response.data );
            loadLocations(  )
        } ).catch( err => {

            console.log()

        } );
    }

    const loadLocations = () => {
        axios.get('/getalllocations').then( response => {
            setLocations( response.data );
            loadDEpart(  )
        } ).catch( err => {

        } );
    }

    const loadDEpart = () => {

        axios.get('/getalldepartments').then( response => {

            setDepartments( response.data );

        } ).catch( err => {

            console.log()

        } );
    }

    return (
        <>
            <UI />
        </>
    )
}
export default TempEmployees;