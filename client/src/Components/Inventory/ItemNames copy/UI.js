import React from 'react';
import './UI.css';

import { Link } from 'react-router-dom';

const UI = ( props ) => {

    return (
        <>
            <div className='ItemNamesContainer'>

                <Header ViewTitle={ props.ViewTitle }  />
                {
                    window.location.href.split('/').pop() === 'new_items_names'
                    ?
                    <FormView
                        Form={ props.Form }
                        Disabled={ props.Disabled }

                        setForm={ props.setForm }
                        onChangeHandler={ props.onChangeHandler }
                        EnterNewItem={ props.EnterNewItem }
                    />
                    :
                    <ItemsView
                        ItemsList={ props.ItemsList }
                    />
                }

            </div>
        </>
    )

}
export default UI;

const FormView = ( { Form, Disabled, setForm, onChangeHandler, EnterNewItem } ) => {

    return (
        <form onSubmit={ EnterNewItem }>
            <h4>Item Form</h4>
            <hr />

            <div className='gridContainer'>

                <div>
                    <label>
                        Item Name
                    </label>
                    <input 
                        className='form-control' 
                        type="text" 
                        name="item_name"
                        value={ Form.item_name } 
                        onChange={ (e) => onChangeHandler( e, Form, setForm ) } 
                        required
                    />
                </div>
                <div>
                    <label>
                        Date
                    </label>
                    <input className='form-control' type="text" value={ new Date().toDateString() } disabled />
                </div>

            </div>

            <br />

            <div className='text-right'>
                <button className='submit' type='submit' disabled={ Disabled }>submit</button>
            </div>

        </form>
    )

}

const ItemsView = ( { ItemsList } ) => {

    return (
        <div className='itemsList'>
            <table className="table table-sm">

                <thead>

                    <tr>

                        <th> ID </th>
                        <th> Name </th>
                        <th> Status </th>
                        <th> Action </th>

                    </tr>

                </thead>

                <tbody>

                    {
                        ItemsList.map(
                            val => {

                                return (
                                    <tr key={ val.id }>

                                        <td> { val.id } </td>
                                        <td> { val.item_name } </td>
                                        <td> { val.status } </td>
                                        <td>
                                            <i className="las la-pen-fancy"></i>
                                            <i className="las la-trash-alt"></i>
                                        </td>

                                    </tr>
                                )

                            }
                        )
                    }

                </tbody>

            </table>
        </div>
    )

}

const Header = ( { ViewTitle } ) => {

    return (
        <div className="d-flex align-items-center justify-content-between mb-3">

            <div>

                <h5 className='mb-0 font-weight-bold'>{ ViewTitle }</h5>

            </div>

            <div className="d-flex">
                <Link 
                    to={ '/inventory/new_items_names' } 
                    className="btn btn-sm cancle"
                >
                    new
                </Link>
            </div>

        </div>
    )

}