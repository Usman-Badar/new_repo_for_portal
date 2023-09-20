import React from 'react';
import './UI.css';

const UI = ( { ItemsList, Form, Editing, Log, EnterNewItem, onChangeHandler, Delete, Edit } ) => {

    return (
        <>
            <div className='ItemNamesContainer'>

                <div className='gridContainer'>

                    <div>

                        <div className='divs'>
                            
                            <h5> Items List </h5>

                            <div className='listContainer'>
                                <table className="table table-sm mt-2">

                                    <thead>
                                        <tr>

                                            <th>ID</th>
                                            <th colSpan={2}>Item Name</th>

                                        </tr>
                                    </thead>
                                    
                                    <tbody>

                                        {
                                            ItemsList.map(
                                                ( val, index ) => {
                                                    
                                                    return (
                                                        <tr key={ val.id }>

                                                            <td>{ val.id }</td>
                                                            <td>{ val.item_name }</td>
                                                            <td>
                                                                <i className="las la-edit" onClick={ () => Edit(index) }></i>
                                                                <i className="las la-trash" onClick={ () => Delete(index) }></i>
                                                            </td>

                                                        </tr>
                                                    )

                                                }
                                            )
                                        }
                                    </tbody>

                                </table>
                            </div>

                        </div>

                    </div>
                    <div>
                        
                        <form className='divs' onSubmit={ EnterNewItem } id="newItemForm">

                            <h5> { Editing ? "Edit Item" : "Enter New Item" } </h5>

                            <label> Item Name </label>
                            <input type='text' className="form-control form-control-sm" name="item_name" value={ Form.item_name } onChange={ onChangeHandler } required />

                            <button className='btn submit d-block ml-auto mt-3'>
                                next
                            </button>

                        </form>

                        {
                            Log
                            ?
                            <div className={ 'logContainer popup ' + ( Log.includes("Successfully") ? 'success' : 'error' ) }> { Log } </div>
                            :null
                        }

                    </div>

                </div>

            </div>
        </>
    )

}
export default UI;