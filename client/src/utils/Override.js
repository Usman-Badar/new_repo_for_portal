import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Modal from '../Components/UI/Modal/Modal';

const Override = ({ onSubmit }) => {
    const [ Confirm, setConfirm ] = useState(false);
    const AccessControls = useSelector( ( state ) => state.EmpAuth.EmployeeData );

    if ( !JSON.parse(AccessControls.access).filter(val => val === 10000)[0] )
    {
        return <></>
    }
    return (
        <>
            <Modal show={ Confirm } Hide={ () => setConfirm(false) } content={ <ConfirmationContent onSubmit={ onSubmit } /> } />
            <button className='btn submit' onClick={() => setConfirm(true)}>Override The Request</button>
        </>
    )
}

export default Override;

const ConfirmationContent = ({ onSubmit }) => {
    const [ Type, setType ] = useState('approved');
    return (
        <form onSubmit={ (e) => onSubmit(e, Type) } className='pr-3 pt-2'>
            <fieldset>
                <h6><b>Confirm to override the request?</b></h6>
                <div className='btn-group w-100 my-2 border'>
                    <button onClick={ () => setType('approved') } type='button' className={ 'btn ' + ( Type === 'approved' ? 'submit' : '' ) }>Approve</button>
                    <button onClick={ () => setType('rejected') } type='button' className={ 'btn ' + ( Type === 'rejected' ? 'cancle' : '' ) }>Reject</button>
                </div>
                <textarea name="remarks" className='form-control mb-2' placeholder='Need Your Remarks...' minLength={20} required />
                <button className='btn submit d-block ml-auto'>Confirm</button>
            </fieldset>
        </form>
    )
}