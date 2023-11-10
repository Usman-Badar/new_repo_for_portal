import React, { useEffect, useState } from 'react';
import './FuelRequest.css';

function FuelRequest() {

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

    return (
        <>
            <div className='FuelRequest page'>

                <div className="page-content">
                    <h3 className="heading">
                        Fuel Management Module
                        <sub>Request Fuel for Fueling Station / Point when required</sub>
                    </h3>

                    <hr />
                    <form >
                        <fieldset>
                            <div className="flex_container mb-3">

                                <div>
                                    <label className='mb-0'>
                                        <b>Date</b>
                                    </label>
                                    <input type="date" className="form-control" name="date" required />
                                </div>
                                <div className="mb-3">
                                    <label className='mb-0'>
                                        <b>Fuel in Liters</b>
                                    </label>
                                    <input type='number' min={1} className="form-control" required />
                                </div>
                            </div>

                            <div className='d-flex justify-space-between align-items-center'>
                                <button className="btn light" type="button">Cancle</button>
                                <button className="btn d-block ml-auto submit mt-3" type='submit'>
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