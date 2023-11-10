import React, { useEffect, useState } from 'react';
import './TripEntry.css';

function TripEntry() {

    const [Equipments, setEquipments] = useState([]);

    useEffect(
        () => {

            setEquipments(
                [
                    {
                        equipment_NUM: 'TRL-123',
                        equipment_type: 'Trailer',

                    },
                    {
                        equipment_NUM: 'TRL-456',
                        equipment_type: 'Trailer',
                    }
                ]
            );

        }, []
    );

    return (
        <>
            <div className='TripEntry page'>

                <div className="page-content">
                    <h3 className="heading">
                        Fuel Management Module
                        <sub>Trailer Trip Entry</sub>
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
                                        <b>Trip</b>
                                    </label>
                                    <input type="text" className="form-control" name="trip" required />
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

export default TripEntry