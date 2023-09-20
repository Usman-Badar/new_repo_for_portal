import React, { lazy, Suspense, useEffect, useState } from 'react';

import { loadChecklist, loadDetails, loadList, addNewCheckItem, deleteItem } from './Functions';
const UI = lazy( () => import('./UI') );

const DailyMaintenance = () => {
    
    const [ List, setList ] = useState();
    const [ CheckList, setCheckList ] = useState();
    const [ Content, setContent ] = useState(<></>);
    const [ Details, setDetails ] = useState();
    const [ ShowModal, setShowModal ] = useState(false);
    const [ Edit, setEdit ] = useState();

    useEffect(
        () => {
            loadList( setList );
        }, []
    )

    useEffect(
        () => {
            setContent(
                <>
                    <form id="addNew" onSubmit={ (e) => addNewCheckItem( e, Edit, setShowModal, setCheckList ) }>
                        <fieldset>
                            <h5> { Edit ? "Update Item" : "Add New Check Item" }</h5>
                            <hr />
                            <label className="mb-0">Title</label>
                            <input type="text" defaultValue={ Edit ? Edit.title : '' } name="title" minLength={3} required className="form-control" />
                            <button className="btn light mt-3 d-block ml-auto">{ Edit ? "Update" : "Add" }</button>
                            <button id='resetForm' type='reset' className="d-none">cancel</button>
                        </fieldset>
                    </form>
                </>
            );
        }, [ Edit ]
    )

    return (
        <>
            <Suspense fallback={ <div>Loading...</div> }>
                <UI 
                    List={ List }
                    Details={ Details }
                    CheckList={ CheckList }
                    ShowModal={ ShowModal }
                    Content={ Content }

                    deleteItem={ ( id ) => deleteItem( id, setCheckList ) }
                    setEdit={ setEdit }
                    setShowModal={ setShowModal }
                    loadChecklist={ () => loadChecklist( setCheckList ) }
                    loadDetails={ ( report_id ) => loadDetails( report_id, setDetails ) }
                />
            </Suspense>
        </>
    );

}

export default DailyMaintenance;