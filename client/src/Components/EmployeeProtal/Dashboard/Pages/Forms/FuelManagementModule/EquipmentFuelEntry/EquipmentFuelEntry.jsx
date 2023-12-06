import React, { useEffect, useState } from 'react';
import './EquipmentFuelEntry.css';

function EquipmentFuelEntry() {

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
            <div className='EquipmentFuelEntry page'>

                <div className="page-content">
                    <h3 className="heading">
                        Fuel Management Module
                        <sub>Equipment's Fuel Entry (Other than Trip base)</sub>
                    </h3>

                    <hr />
                    <form >
                        <fieldset>
                            <div className="flex_container mb-3">

                                <div>
                                    <label className='mb-0'>
                                        <b>Equipment Type</b>
                                    </label>
                                    <select className="form-control" name="company_code" required>
                                        <option value=''>Select the option</option>
                                        {
                                            Equipments.map(
                                                val => {

                                                    return (
                                                        <option> {val.equipment_type} </option>
                                                    )

                                                }
                                            )
                                        }

                                    </select>
                                </div>
                                <div>
                                    <label className='mb-0'>
                                        <b>Equipment Number</b>
                                    </label>
                                    <select className="form-control" name="company_code" required>
                                        <option value=''>Select the option</option>
                                        {
                                            Equipments.map(
                                                val => {

                                                    return (
                                                        <option> {val.equipment_NUM} </option>
                                                    )

                                                }
                                            )
                                        }
                                    </select>
                                </div>
                            </div>

                            <div className="flex_container mb-3">

                                <div>
                                    <label className='mb-0'>
                                        <b>Hrs Meter Reading</b>
                                    </label>
                                    <input type="text" className="form-control" name="hrsMeter" required />
                                </div>

                                <div>
                                    <label className='mb-0'>
                                        <b>Date</b>
                                    </label>
                                    <input type="date" className="form-control" name="date" required />
                                </div>

                            </div>

                            <div className="mb-3">
                                <label className='mb-0'>
                                    <b>Fuel in Liters</b>
                                </label>
                                <input type='number' min={1} className="form-control" required />
                            </div>

                            <div className='d-flex justify-space-between align-items-center'>
                                <button className="btn light" type="button">Cancel</button>
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

export default EquipmentFuelEntry