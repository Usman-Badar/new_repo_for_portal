import React from 'react';
import './UI.css';

const UI = ( { MenuItems, AllViews, AllOptions, Form, Edit, onChangeHandler, AddNewMenuItem, onChangeIndex, EditItem, RemoveItem } ) => {

    return (
        <>
            <div className='MenuSetupContainer'>

                <div className='left'>
                    <div className='grid_column'>

                        <h5> Menu </h5>

                        <div className='listContainer'>
                            
                            {
                                typeof( MenuItems ) === 'string'
                                ?
                                <h6 className='text-center py-2 border-bottom'> { MenuItems } </h6>
                                :
                                MenuItems.length === 0
                                ?
                                <h6 className='text-center py-2 border-bottom'> No Record Found </h6>
                                :
                                MenuItems.map(
                                    ( val, index ) => {

                                        return (
                                            <ListItem
                                                itemTxt={ val.menu_txt }
                                                iconClassName={ val.icon_class_name }
                                                type={ val.type }
                                                optionID={ val.option_id }
                                                link={ val.link }
                                                view={ val.view }
                                                under_menu={ val.under_menu }
                                                indexing={ val.indexing }
                                                index={ index }

                                                RemoveItem={ RemoveItem }
                                                EditItem={ EditItem }
                                                onChangeIndex={ onChangeIndex }
                                            />
                                        )

                                    }
                                )
                            }

                        </div>

                    </div>
                </div>

                <div className='right'>
                    <div className='grid_column'>

                        <FormUI
                            Form={ Form }
                            AllViews={ AllViews }
                            AllOptions={ AllOptions }
                            Edit={ Edit }

                            onChangeHandler={ onChangeHandler }
                            AddNewMenuItem={ AddNewMenuItem }
                        />

                    </div>
                </div>

            </div>
        </>
    )

}

export default UI;

const FormUI = ( { Form, AllViews, AllOptions, Edit, AddNewMenuItem, onChangeHandler } ) => {

    return (
        <form onSubmit={ AddNewMenuItem }>
            {
                Edit
                ?
                <h5 className='mb-3'> Edit { Edit } </h5>
                :
                <h5 className='mb-3'> Enter New Menu Item </h5>
            }
            
            <label>Label <sup>*</sup></label>
            <input onChange={ onChangeHandler } placeholder="example: Home" name="menu_txt" type="text" value={ Form.menu_txt } className='form-control form-control-sm' />
            
            <label>Icon <sup>*</sup></label>
            <input onChange={ onChangeHandler } placeholder="example: las la-env" name="icon_class_name" type="text" value={ Form.icon_class_name } className='form-control form-control-sm' />
            
            <label>Type <sup>*</sup></label>
            <select onChange={ onChangeHandler } name="type" type="text" value={ Form.type } className='form-control form-control-sm'>
                <option value='link'>link</option>
                <option value='menu'>menu</option>
            </select>

            {
                Form.type === 'menu'
                ?
                <>
                    <label>Option ID <sup>*</sup></label>
                    <input onChange={ onChangeHandler } name="option_id" type="text" value={ Form.option_id === null ? '' : Form.option_id } className='form-control form-control-sm' />
                </>
                :
                <>
                    <label>Href <sup>*</sup></label>
                    <input onChange={ onChangeHandler } placeholder="example: /home" name="link" type="text" value={ Form.link === null ? '' : Form.link } className='form-control form-control-sm' />
                </>
            }

            <label>View <sup>*</sup></label>
            <input onChange={ onChangeHandler } name="view" type="text" value={ Form.view } className='form-control form-control-sm' />

            <label>Under Menu <sub>(optional)</sub> </label>
            <select onChange={ onChangeHandler } name="under_menu" type="text" value={ Form.under_menu === null ? '' : Form.under_menu } className='form-control form-control-sm'>
                <option value=''>select the option</option>
                {
                    AllOptions.map(
                        val => {

                            return <option key={ val.option_id } value={ val.option_id }>{ val.option_id }</option>

                        }
                    )
                }
            </select>

            <label>Access <sub>(optional)</sub></label>
            <input onChange={ onChangeHandler } placeholder="example: [1,2,3,4]" name="access" type="text" value={ Form.access === null ? '' : Form.access } className='form-control form-control-sm' />

            {
                Form.menu_txt === '' ||
                Form.icon_class_name === '' ||
                Form.type === '' ||
                Form.view === ''
                ?null
                :
                Form.type === 'link' && Form.link === ''
                ?null
                :
                Form.type === 'menu' && Form.option_id === ''
                ?null
                :
                <button className='btn submit mt-3 ml-auto d-block' type='submit'>
                    next
                </button>
            }
        </form>
    )

}

const ListItem = ( { itemTxt, iconClassName, type, optionID, link, view, index, under_menu, indexing, onChangeIndex, EditItem, RemoveItem } ) => {

    return (
        <div className='listItem d-flex align-items-center border-bottom'>

            <div className='pr-3'>

                <i className={ iconClassName + " la-2x" }></i>

            </div>
            <div className='w-100'>
                <p className='title'> { itemTxt } </p>
                <div className='d-flex justify-content-between w-100'>

                    <div className='d-flex'>
                        <div className='pr-3'>
                            <b>Type: </b>
                            <span> { type } </span>
                        </div>
                        {
                            type === 'link'
                            ?
                            <>
                                <div className='pr-3'>
                                    <b>Href: </b>
                                    <span> { link } </span>
                                </div>
                                {
                                    under_menu === null
                                    ?null
                                    :
                                    <div className='pr-3'>
                                        <b>Under Menu: </b>
                                        <span> { under_menu } </span>
                                    </div>
                                }
                            </>
                            :
                            <div className='pr-3'>
                                <b>Option ID: </b>
                                <span> { optionID } </span>
                            </div>
                        }
                        <div className='pr-3'>
                            <b>View: </b>
                            <span> { view } </span>
                        </div>
                    </div>

                    <div className='d-flex align-items-center'>
                        <span className='px-2 actionStrings' onClick={ () => EditItem( index ) }>
                            edit
                        </span>
                        <span className='px-2 actionStrings' onClick={ () => RemoveItem( index ) }>
                            remove
                        </span>
                        <input className='indexing' placeholder={ indexing } onKeyUp={ ( e ) => onChangeIndex( e, index ) } />
                    </div>

                </div>
            </div>

        </div>
    )

}