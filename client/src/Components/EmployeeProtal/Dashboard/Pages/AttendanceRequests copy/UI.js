import React from 'react';
import './UI.css';

const UI = ( props ) => {

    return (
        <>
            <div className="AttendanceRequests w-100">

                {/* UPPER */}
                {/* FOR CONTROLS */}
                <div className="upper controls">

                    <div>
                        <p className="font-weight-bold mb-0">Attendance Requests</p>
                        <small className="text-secondary">Please only enter the value if you want to update that field.</small>
                    </div>
                    
                    <div className="d-flex align-items-center">
                        <select disabled={ props.Companies.length === 1 ? true : false } onChange={ props.onChangeCompany } className="form-control form-control-sm mr-2" style={ { width: 'min-content' } }>
                            <option value=''>Company</option>
                            {
                                props.Companies.map(
                                    ( val, index ) => {

                                        return (
                                            <option selected={ props.Companies.length === 1 ? true : false } value={ val.company_code } key={ index }> { val.company_name } </option>
                                        )

                                    }
                                )
                            }
                        </select>
                        <input onChange={ props.onChangeName } type="text" className="form-control form-control-sm mr-2" placeholder='Employee Name' />
                        <input onChange={ props.onChangeDate } type="date" className="form-control form-control-sm" />
                    </div>

                </div>

                {/* RECORDS */}
                {/* PREVIOUS REQUESTS */}
                <table className="table table-hover">
                    
                    <thead>
                        <tr>
                            <th> Employee ID </th>
                            <th>
                                Employee Name
                            </th>
                            <th> Time IN </th>
                            <th> Break IN </th>
                            <th> Break OUT </th>
                            <th> Time OUT </th>
                            <th> Status </th>
                        </tr>
                    </thead>

                    <tbody>
                        {
                            props.Employees.length === 0
                            ?
                            <tr>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td> No Record Found </td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                            :
                            props.Employees.map(
                                ( val, index ) => {

                                    let time_in = val.time_in === null ? "No Time IN" : val.time_in;
                                    let break_in = val.break_in === null ? "No Break IN" : val.break_in;
                                    let break_out = val.break_out === null ? "No Break OUT" : val.break_out;
                                    let time_out = val.time_out === null ? "No Time OUT" : val.time_out;

                                    let row;

                                    if ( props.Name )
                                    {
                                        if ( val.name.toLowerCase().includes( props.Name.toLowerCase() ) )
                                        {
                                            row = (
                                                <tr key={ index }>
                                                    <td> { val.emp_id } </td>
                                                    <td>
                                                        { val.name }
                                                    </td>
                                                    <td>
                                                        <small className="d-block">Current time_in: <b>{ time_in }</b></small>
                                                        <input type="time" className="w-100" name={ 'time_in' + index } />
                                                        <div className="mt-1 d-flex align-items-center"><input className="mr-1" type='checkbox' id={ 'checkboxnumber_time_in_' + index } /> Set to null</div>
                                                    </td>
                                                    <td>
                                                        <small className="d-block">Current break_in: <b>{ break_in }</b></small>
                                                        <input type="time" className="w-100" name={ 'break_in' + index } />
                                                        <div className="mt-1 d-flex align-items-center"><input className="mr-1" type='checkbox' id={ 'checkboxnumber_break_in_' + index } /> Set to null</div>
                                                    </td>
                                                    <td>
                                                        <small className="d-block">Current break_out: <b>{ break_out }</b></small>
                                                        <input type="time" className="w-100" name={ 'break_out' + index } />
                                                        <div className="mt-1 d-flex align-items-center"><input className="mr-1" type='checkbox' id={ 'checkboxnumber_break_out_' + index } /> Set to null</div>
                                                    </td>
                                                    <td>
                                                        <small className="d-block">Current time_out: <b>{ time_out }</b></small>
                                                        <input type="time" className="w-100" name={ 'time_out' + index } />
                                                        <div className="mt-1 d-flex align-items-center"><input className="mr-1" type='checkbox' id={ 'checkboxnumber_time_out_' + index } /> Set to null</div>
                                                    </td>
                                                    <td>
                                                        <small className="d-block">|</small>
                                                        <select value={ val.status } className="w-100" name={ 'status' + index }>
                                                            <option value=""> select </option>
                                                            <option selected={ val.status === 'Holiday' ? true : false } value="Holiday"> Holiday </option>
                                                            <option selected={ val.status === 'OFF' ? true : false } value="OFF"> OFF </option>
                                                            <option selected={ val.status === 'Late' ? true : false } value="Late"> Late </option>
                                                            <option selected={ val.status === 'Present' ? true : false } value="Present"> Present </option>
                                                            <option selected={ val.status === 'Absent' ? true : false } value="Absent"> Absent </option>
                                                        </select>
                                                    </td>

                                                    {
                                                        <td className="d-flex align-items-center"><button onClick={ () => props.updateRecord(index) } className='btn btn-sm btn-outline-primary Edit' type="button" id={ "updateBtn" + index }>update</button></td>
                                                    }
                                                </tr>
                                            )
                                        }
                                    }else
                                    {
                                        row = (
                                            <tr key={ index }>
                                                <td> { val.emp_id } </td>
                                                <td>
                                                    { val.name }
                                                </td>
                                                <td className='d-none'>
                                                    <input type="text" value={ val.timing } className="w-100" name={ 'timing' + index } />
                                                </td>
                                                <td>
                                                    <small className="d-block">Current time_in: <b>{ time_in }</b></small>
                                                    <input type="time" className="w-100" name={ 'time_in' + index } />
                                                    <div className="mt-1 d-flex align-items-center"><input className="mr-1" type='checkbox' id={ 'checkboxnumber_time_in_' + index } /> Set to null</div>
                                                </td>
                                                <td>
                                                    <small className="d-block">Current break_in: <b>{ break_in }</b></small>
                                                    <input type="time" className="w-100" name={ 'break_in' + index } />
                                                    <div className="mt-1 d-flex align-items-center"><input className="mr-1" type='checkbox' id={ 'checkboxnumber_break_in_' + index } /> Set to null</div>
                                                </td>
                                                <td>
                                                    <small className="d-block">Current break_out: <b>{ break_out }</b></small>
                                                    <input type="time" className="w-100" name={ 'break_out' + index } />
                                                    <div className="mt-1 d-flex align-items-center"><input className="mr-1" type='checkbox' id={ 'checkboxnumber_break_out_' + index } /> Set to null</div>
                                                </td>
                                                <td>
                                                    <small className="d-block">Current time_out: <b>{ time_out }</b></small>
                                                    <input type="time" className="w-100" name={ 'time_out' + index } />
                                                    <div className="mt-1 d-flex align-items-center"><input className="mr-1" type='checkbox' id={ 'checkboxnumber_time_out_' + index } /> Set to null</div>
                                                </td>
                                                <td>
                                                    <small className="d-block">|</small>
                                                    <select className="w-100" name={ 'status' + index }>
                                                        <option value=""> select </option>
                                                        <option selected={ val.status === 'Holiday' ? true : false } value="Holiday"> Holiday </option>
                                                        <option selected={ val.status === 'OFF' ? true : false } value="OFF"> OFF </option>
                                                        <option selected={ val.status === 'Late' ? true : false } value="Late"> Late </option>
                                                        <option selected={ val.status === 'Present' ? true : false } value="Present"> Present </option>
                                                        <option selected={ val.status === 'Absent' ? true : false } value="Absent"> Absent </option>
                                                    </select>
                                                </td>

                                                {
                                                    <td className="d-flex align-items-center"><button onClick={ () => props.updateRecord(index) } className='btn btn-sm Edit' type="button" id={ "updateBtn" + index }>update</button></td>
                                                }
                                            </tr>
                                        )   
                                    }

                                    return row;

                                }
                            )
                        }
                    </tbody>

                </table>

            </div>
        </>
    )

}

export default UI;