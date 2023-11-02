/* eslint-disable react-hooks/exhaustive-deps */
import React, { Suspense, lazy, useEffect, useState } from 'react';
import { GetCompanies, GetLocations, loadEmployees, loadPRList, loadSlipList, onCreateAdvanceCash, onCreateShpCash } from './Functions';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
const UI = lazy( () => import('./Ui') );

function Form() {

    const history = useHistory();
    const AccessControls = useSelector( ( state ) => state.EmpAuth.EmployeeData );

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
    const [ Amount, setAmount ] = useState(0);

    const [ DO, setDO ] = useState({
        required: false,
        amount: 0
    });
    const [ LOLO, setLOLO ] = useState({
        required: false,
        amount: 0
    });
    const [ DET, setDET ] = useState({
        required: false,
        amount: 0
    });
    const [ DMGDT, setDMGDT ] = useState({
        required: false,
        amount: 0
    });
    const [ Other, setOther ] = useState({
        required: false,
        amount: 0,
        specification: ''
    });
    const [ PRList, setPRList ] = useState();
    const [ SlipList, setSlipList ] = useState();

    const [ Status, setStatus ] = useState('AdvanceCashForm');

    useEffect(
        () => {
            if ( sessionStorage.getItem('CashStatus') )
            {
                setStatus(sessionStorage.getItem('CashStatus'));
            }
        }, []
    );

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
                Status={Status}
                DO={ DO }
                LOLO={ LOLO }
                DET={ DET }
                DMGDT={ DMGDT }
                Other={ Other }
                AccessControls={AccessControls}

                onCreateShpCash={(e) => onCreateShpCash(e, history, parseFloat(DO.amount) + parseFloat(LOLO.amount) + parseFloat(DET.amount) + parseFloat(DMGDT.amount) + parseFloat(Other.amount), DO, LOLO, DET, DMGDT, Other)}
                setSlipAttachment={ setSlipAttachment }
                attachPR={ ( pr_id, pr_code, specifications ) => { setPRCode(pr_code); setPR( pr_id ); setPRAttachment(false); setSPRSpecifications(specifications); } }
                attachSlip={ ( id, code ) => { setSlipCode(code); setSlip( id ); setSlipAttachment(false); } }
                setPRAttachment={ setPRAttachment }
                setCompany={ setCompany }
                onCreateAdvanceCash={ (e) => onCreateAdvanceCash( e, history, PR, Amount, Employee, Slip ) }
                setAmount={ setAmount }
                setDO={ setDO }
                setKeyword={ setKeyword }
                setEmployee={ setEmployee }
                setStatus={setStatus}
                setLOLO={setLOLO}
                setDET={setDET}
                setDMGDT={setDMGDT}
                setOther={setOther}
            />
        </Suspense>
    );

}

export default Form;