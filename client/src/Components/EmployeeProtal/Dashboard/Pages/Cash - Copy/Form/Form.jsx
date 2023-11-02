/* eslint-disable react-hooks/exhaustive-deps */
import React, { Suspense, lazy, useEffect, useState } from 'react';

import { GetCompanies, GetLocations, loadEmployees, loadPRList, loadSlipList, onCreateAdvanceCash } from './Functions';
import { useHistory } from 'react-router-dom';
const UI = lazy( () => import('./Ui') );

function Form() {

    const history = useHistory();

    const [ PR, setPR ] = useState();
    const [ PRCode, setPRCode ] = useState();
    const [ Slip, setSlip ] = useState();
    const [ SlipCode, setSlipCode ] = useState();
    const [ PRAttachment, setPRAttachment ] = useState();
    const [ SlipAttachment, setSlipAttachment ] = useState(false);
    const [ SPRSpecifications, setSPRSpecifications ] = useState();
    const [ Selected, setSelected ] = useState(true);
    const [ Keyword, setKeyword ] = useState('');
    const [ Locations, setLocations ] = useState([]);
    const [ Companies, setCompanies ] = useState([]);
    const [ Employees, setEmployees ] = useState([]);
    const [ Employee, setEmployee ] = useState();
    const [ Company, setCompany ] = useState();
    const [ Amount, setAmount ] = useState(1);
    const [ PRList, setPRList ] = useState();
    const [ SlipList, setSlipList ] = useState();

    useEffect(
        () => {
            GetCompanies( setCompanies );
            GetLocations( setLocations );
            loadEmployees( setEmployees );
        }, []
    );
    useEffect(
        () => {
            if ( Employee )
            {
                setKeyword(Employee.name);
                setTimeout(() => {
                    setSelected(true);
                }, 200);
            }
        }, [ Employee ]
    )
    useEffect(
        () => {
            if ( Keyword.length > 0 )
            {
                setSelected(false);
            }else{
                setSelected(true);
            }
        }, [ Keyword ]
    )
    useEffect(
        () => {
            if ( PRAttachment && !PRList )
            {
                loadPRList(setPRList);
            }
        }, [ PRAttachment ]
    )
    useEffect(
        () => {
            if ( SlipAttachment && !SlipList )
            {
                loadSlipList(setSlipList);
            }
        }, [ SlipAttachment ]
    )

    return (
        <Suspense fallback={ <div>Loading...</div> }>
            <UI 
                Locations={ Locations }
                Employees={ Employees }
                Companies={ Companies }
                Keyword={ Keyword }
                Selected={ Selected }
                Amount={ Amount }
                Company={ Company }
                history={ history }
                PR={ PR }
                PRCode={ PRCode }
                PRList={ PRList }
                SPRSpecifications={ SPRSpecifications }
                PRAttachment={ PRAttachment }
                SlipAttachment={ SlipAttachment }
                SlipList={ SlipList }
                Slip={ Slip }
                SlipCode={ SlipCode }

                setSlipAttachment={ setSlipAttachment }
                attachPR={ ( pr_id, pr_code, specifications ) => { setPRCode(pr_code); setPR( pr_id ); setPRAttachment(false); setSPRSpecifications(specifications); } }
                attachSlip={ ( id, code ) => { setSlipCode(code); setSlip( id ); setSlipAttachment(false); } }
                setPRAttachment={ setPRAttachment }
                setCompany={ setCompany }
                onCreateAdvanceCash={ (e) => onCreateAdvanceCash( e, history, PR, Amount, Employee, Slip, setSelected, setKeyword, setEmployee, setAmount, setCompany ) }
                setAmount={ setAmount }
                setKeyword={ setKeyword }
                setEmployee={ setEmployee }
            />
        </Suspense>
    );

}

export default Form;