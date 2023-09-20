import React, { Suspense, lazy, useEffect, useState } from 'react';

import { fetchDetails, fetchList, loadCompanies, loadEmployees } from './Functions';
const UI = lazy( () => import('./UI') );

function Employee() {
    
    const [ HREmployee, setHREmployee ] = useState();
    const [ Employee, setEmployee ] = useState();
    const [ Locations, setLocations ] = useState();
    const [ Companies, setCompanies ] = useState();
    const [ Designations, setDesignations ] = useState();
    const [ Departments, setDepartments ] = useState();
    const [ Grades, setGrades ] = useState();
    const [ Location, setLocation ] = useState('');
    const [ SpecKeyword, setSpecKeyword ] = useState('');
    const [ Company, setCompany ] = useState(
        {
            company_code: null,
            company_name: ''
        }
    );

    useEffect(
        () => {
            if ( HREmployee )
            {
                let names = [];
                for ( let x = 0; x < HREmployee.length; x++ )
                {
                    if ( !names.includes( HREmployee[x].location_name ) )
                    {
                        names.push(HREmployee[x].location_name);
                    }
                }

                setLocations( names );
            }
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [ HREmployee ]
    )

    return (
        <>
            <Suspense fallback={<div>Loading....</div>}>
                <UI 
                    HREmployee={ HREmployee }
                    Company={ Company }
                    Locations={ Locations }
                    Companies={ Companies }
                    Location={ Location }
                    SpecKeyword={ SpecKeyword }
                    Employee={ Employee }
                    Departments={ Departments }
                    Designations={ Designations }
                    Grades={ Grades }

                    fetchList={ () => fetchList( setDesignations, setDepartments, setLocations, setGrades ) }
                    fetchDetails={ () => fetchDetails( setEmployee ) }
                    setSpecKeyword={ setSpecKeyword }
                    setLocation={ setLocation }
                    setCompany={ setCompany }
                    loadCompanies={ () => loadCompanies( setCompanies, setCompany ) }
                    loadEmployees={ () => loadEmployees( Company, Companies, setHREmployee ) }
                />
            </Suspense>
        </>
    )

}

export default Employee;