import React, { useEffect, useRef, useState } from 'react';
import './FuelRequest.css';
import axios from '../../../../../../../axios';
import JSAlert from 'js-alert';

function FuelRequest() {
    const formRef = useRef();
    const fieldsetRef = useRef();
    const btnRef = useRef();

    const [Equipments, setEquipments] = useState([]);

    useEffect(
        () => {

            setEquipments(
                [
                    {
                        equipment_NUM: 'ABC-123',
                        equipment_type: 'ForkLifter',

                    },
                    {
                        equipment_NUM: 'ABC-456',
                        equipment_type: 'ForkLifter',
                    }
                ]
            );

        }, []
    );

    const onRequest = (e) => {
        e.preventDefault();
        const fuelRequired = e.target['fuelRequired'].value;
        if (typeof(fuelRequired) !== 'number') {
            JSAlert.alert('Invalid fuel quantity!!', 'Validation Error', JSAlert.Icons.Warning).dismissIn(4000);
            return false;
        }
        if (parseFloat(fuelRequired) < 0) {
            JSAlert.alert('Required fuel must be greater than 0!!', 'Validation Error', JSAlert.Icons.Warning).dismissIn(4000);
            return false;
        }
        fieldsetRef.current.disabled = true;
        btnRef.current.innerHTML = 'Please Wait...';
        axios.post(
            '/fuel-managent/fuel-request-for-station',
            {
                fuelRequired: fuelRequired,
                requested_by: localStorage.getItem('EmpID')
            }
        ).then(() => {
            fieldsetRef.current.disabled = false;
            btnRef.current.innerHTML = 'Submit';
            formRef.current.reset();
            JSAlert.alert('Request has been sent', 'Success', JSAlert.Icons.Success).dismissIn(2000);
        }).catch(err => {
            console.log(err);
            JSAlert.alert('Failed To Request!!', 'Request Failed', JSAlert.Icons.Failed).dismissIn(4000);
            fieldsetRef.current.disabled = false;
            btnRef.current.innerHTML = 'Submit';
        });
    }

    return (
        <>
            <div className='FuelRequest page'>

                <div className="page-content">
                    <h3 className="heading">
                        Fuel Management Module
                        <sub>Request Fuel for Fueling Station / Point when required</sub>
                    </h3>

                    <hr />
                    <form ref={formRef} onSubmit={onRequest}>
                        <fieldset ref={fieldsetRef}>
                            <label className='mb-0'>
                                <b>Fuel in Liters</b>
                            </label>
                            <input type='number' min={1} className="form-control" name='fuelRequired' required />

                            <div className='d-flex justify-content-end align-items-center mt-3'>
                                <button className="btn light" type="reset">Cancle</button>
                                <button ref={btnRef} className="btn submit ml-3" type='submit'>
                                    Submit
                                </button>
                            </div>
                        </fieldset>
                    </form>
                </div>
            </div>
        </>
    )
}

export default FuelRequest