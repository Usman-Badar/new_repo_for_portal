/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from 'react'
import './EquipmentType_Form.css';

import axios from '../../../../axios';
import JSAlert from 'js-alert';

const EquipmentType_Form = () => {
    const equipmentID = useRef();
    const equipmentType = useRef();
    const formBtn = useRef();
    const [Equipments, setEquipments] = useState([]);

    useEffect(
        () => {
            let isActive = true;
            loadEquipments(isActive);
            return () => {
                isActive = false;
            }
        }, []
    );

    const loadEquipments = (isActive) => {
        axios.get('/fuel-managent/equipment-types').then(res => {
            if (!isActive) return;
            setLastID(res.data);
            setEquipments(res.data);
        }).catch(err => console.log(err));
    }
    const setLastID = (arr) => {
        if (arr.length === 0) {
            equipmentID.current.value = 1;
        }else {
            equipmentID.current.value = arr[0]?.id + 1;
        }
    }
    const onEquipmentAdded = (e) => {
        e.preventDefault();
        if (equipmentType.current.value.trim() === '') {
            JSAlert.alert('Equipment type is required!!', 'Validation Error', JSAlert.Icons.Warning).dismissIn(4000);
            return false;
        }

        formBtn.current.disabled = true;
        formBtn.current.innerHTML = 'Submitting...';
        axios.post(
            '/fuel-managent/equipment-type-entry',
            {
                id: equipmentID.current.value,
                type: equipmentType.current.value,
                user_id: sessionStorage.getItem('UserID')
            }
        ).then(() => {
            formBtn.current.disabled = false;
            formBtn.current.innerHTML = 'Add';
            equipmentType.current.value = '';
            JSAlert.alert('Equiment type added', 'Success', JSAlert.Icons.Success).dismissIn(2000);
            loadEquipments(true);
        }).catch(err => {
            console.log(err);
            JSAlert.alert('Failed To Add!!', 'Request Failed', JSAlert.Icons.Failed).dismissIn(4000);
            formBtn.current.disabled = false;
            formBtn.current.innerHTML = 'Add';
        });
    }

    return (
        <>
            <div className="page pt-3">
                <div className="page-content mb-3">
                    <h3 className="heading">
                        Equipment Type Setup Form
                        <sub>Setup Equipment Types (One Time)</sub>
                    </h3>
                    <hr />
                    <form onSubmit={onEquipmentAdded}>
                        <div className='d-flex' style={{ gap: '20px' }}>
                            <div className='w-50'>
                                <label className='mb-0 font-weight-bold'>Equipment Id</label>
                                <input className="form-control" ref={equipmentID} disabled />
                            </div>
                            <div className='w-50'>
                                <label className='mb-0 font-weight-bold'>Equipment Type</label>
                                <input type="text" className="form-control" placeholder="Equipment Type" ref={equipmentType} required />
                            </div>
                        </div>
                        <button className='d-block ml-auto btn mt-3 submit' ref={formBtn}>Add</button>
                    </form>
                </div>
                <div className='page-content'>
                    {
                        Equipments.length === 0
                        ?
                        <h6 className="text-center mb-0">No Equipment Type Added</h6>
                        :
                        <>
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th className='border-top-0'>Equipment Id</th>
                                        <th className='border-top-0'>Equipment Type</th>

                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        Equipments.map(
                                            (val, index) => {
                                                return (
                                                    <tr key={index}>
                                                        <td>{val.id}</td>
                                                        <td>{val.equipment_type} </td>
                                                    </tr>
                                                )
                                            }
                                        )
                                    }
                                </tbody>
                            </table>
                        </>
                    }
                </div>
            </div>
        </>
    )
}

export default EquipmentType_Form