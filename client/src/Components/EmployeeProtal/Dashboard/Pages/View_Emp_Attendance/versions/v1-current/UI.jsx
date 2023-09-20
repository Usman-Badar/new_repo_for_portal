import React from 'react';
import './Style.css';

import ReactHTMLTableToExcel from 'react-html-table-to-excel';

import LoadingIcon from '../../../../../images/loadingIcons/icons8-loading-circle.gif';
import Loading from '../../../../UI/Loading/Loading';

const UI = ( { StartLoading, ref, SelectedEmployee, AccessControls, Companies, Employees, DailyAttendance, OnFilter, setSelectedEmployee } ) => {

    return (
        <>
            <div className='edit_employees_attendance'>

                <RequestDetails />

                <EmployeesList
                    AccessControls={ AccessControls }
                    Companies={ Companies }
                    Employees={ Employees }
                    DailyAttendance={ DailyAttendance }
                    SelectedEmployee={ SelectedEmployee }
                    ref={ ref }
                    StartLoading={ StartLoading }

                    OnFilter={ OnFilter }
                    setSelectedEmployee={ setSelectedEmployee }
                />

            </div>
        </>
    )

}

export default UI;

const RequestDetails = () => {

    return (
        <>
            <div></div>
        </>
    )

}

const EmployeesList = ( { StartLoading, SelectedEmployee, ref, AccessControls, Companies, Employees, DailyAttendance, setSelectedEmployee, OnFilter } ) => {

    return (
        <>
            <div className="employees_list">

                <div className="d-flex align-items-end" style={ { flexWrap: "wrap" } }>
                    <h6 className="mr-1">Employees List</h6>

                    {
                        AccessControls.access ? JSON.parse(AccessControls.access).includes(502) || JSON.parse(AccessControls.access).includes(1)
                        ?
                        <div className="px-1">
                            <label className="mb-0">Company</label>
                            <select
                                className="form-control form-control-sm bg-light"
                                variant="standard"
                                onChange={ OnFilter }
                                name='company'
                            >
                                <option
                                    value=''
                                >
                                    Select the Option
                                </option>
                                {Companies.map(
                                    (val, index) => (
                                        <option
                                            key={index}
                                            value={val.company_code}
                                        >
                                            {val.company_name}
                                        </option>
                                    ))}
                            </select>
                        </div>
                        :
                        null
                        :
                        null
                    }

                    <div className="px-1">
                        <label className="mb-0">Date From</label>
                        <input className="form-control form-control-sm bg-light" name="dateFrom" onChange={ OnFilter } type="date" variant="standard" fullWidth />
                    </div>

                    <div className="px-1">
                        <label className="mb-0">Date To</label>
                        <input className="form-control form-control-sm bg-light" name="dateTo" onChange={ OnFilter } type="date" variant="standard" fullWidth />
                    </div>

                    {
                        Employees.length > 0
                        ?
                        <div className="px-1">
                            <label className="mb-0">Employees</label>
                            <select
                                className="form-control form-control-sm bg-light"
                                variant="standard"
                                style={{ width: '100%', fontSize: '12px', fontFamily: 'Quicksand' }}
                                onChange={ ( e ) => setSelectedEmployee( e.target.value ) }
                                name='employee'
                            >
                                <option
                                    value=''
                                >
                                    Select the Option
                                </option>
                                {Employees.map(
                                    (val, index) => (
                                        <option
                                            key={index}
                                            value={val}
                                        >
                                            { val }
                                        </option>
                                    ))}
                            </select>
                        </div>
                        :
                        null
                    }

                    {
                        DailyAttendance.length > 0
                        ?
                        <ReactHTMLTableToExcel
                            id="test-table-xls-button"
                            className="download-table-xls-button"
                            table="table-to-xls"
                            filename={ 'attendance-sheet' }
                            sheet={ [ "Employees", "Employees", "Employees", "Employees" ] }
                            buttonText="Export in excel"
                        />
                        :null
                    }

                </div>
                <div className="list_content">
                    <Loading 
                        display={ StartLoading }
                        styling={
                            {
                                zIndex: 100000,
                            }
                        }
                        icon={ 
                            <img 
                                src={ LoadingIcon }
                                className="LoadingImg"
                                alt="LoadingIcon"
                                style={ { width: '40px', height: '40px' } }
                            /> 
                        }
                        txt="Loading..."
                    />

                    <table className="table" id="table-to-xls" ref={ ref }>

                        <thead>
                            <tr>

                                <th>Employee ID</th>
                                <th>Name</th>
                                <th>Date</th>
                                <th>Day</th>
                                <th>Time (IN)</th>
                                <th>Time (OUT)</th>
                                <th>Break (IN)</th>
                                <th>Break (OUT)</th>
                                <th>Status</th>

                            </tr>
                        </thead>

                        <tbody>
                            {
                                DailyAttendance.length === 0
                                ?
                                <tr>

                                    <td colSpan={9} className="text-center">
                                        No Record Found
                                    </td>

                                </tr>
                                :
                                DailyAttendance.map(
                                    (val, index) => {

                                        var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                                        var d = new Date(val.emp_date.toString().substring(0, 10));
                                        var dayName = days[d.getDay()];
                                        var content;

                                        if ( SelectedEmployee.length > 0 )
                                        {
                                            if ( val.name === SelectedEmployee )
                                            {
                                                content =  (
                                                    <tr key={index} style={ { backgroundColor: dayName === 'Sunday' ? '#899499' : val.status === 'Holiday' ? '#899499' : val.status === 'OFF' ? '#899499' : val.status === 'Absent' ? '#D3D3D3' : val.status === 'leave' ? '#D3D3D3' : val.status === 'Late' ? '#D3D3D3' : '#fff' } }>
                                                        <td> {val.emp_id} </td>
                                                        <td> {val.name} </td>
                                                        <td> {val.emp_date.toString().substring(0, 10)} </td>
                                                        <td> {dayName} </td>
                                                        {
                                                            val.status === 'leave' && val.time_in === null && val.time_out === null && val.break_in === null && val.break_out === null
                                                            ?
                                                            <>
                                                                <td></td>
                                                                <td></td>
                                                                <td></td>
                                                                <td></td>
                                                            </>
                                                            :
                                                            val.status === 'leave' && (val.time_in !== null || val.time_out !== null || val.break_in !== null || val.break_out !== null)
                                                            ?
                                                            <>
                                                                <td> {val.time_in === null ? <span></span> : val.time_in} </td>
                                                                <td> {val.time_out === null ? <span></span> : val.time_out} </td>
                                                                <td> {val.break_in === null ? <span></span> : val.break_in} </td>
                                                                <td> {val.break_out === null ? <span></span> : val.break_out} </td>
                                                            </>
                                                            :
                                                            <>
                                                                <td> {val.time_in === null ? <span></span> : val.time_in} </td>
                                                                <td> {val.time_out === null ? <span></span> : val.time_out} </td>
                                                                <td> {val.break_in === null ? <span></span> : val.break_in} </td>
                                                                <td> {val.break_out === null ? <span></span> : val.break_out} </td>
                                                            </>
                                                        }
                                                        <td> 
                                                            {
                                                                val.status === 'leave' && val.time_in === null && val.time_out === null && val.break_in === null && val.break_out === null
                                                            ?
                                                            <>
                                                            { val.status }
                                                            </>
                                                            :
                                                            val.status === 'leave' && (val.time_in !== null || val.time_out !== null || val.break_in !== null || val.break_out !== null)
                                                            ?
                                                            <>
                                                                Short Leave
                                                            </>
                                                            :
                                                            <>
                                                                { val.status }
                                                            </>
                                                            } 
                                                        </td>
                                                    </tr>
                                                )
                                            }
                                        }else
                                        {

                                            content = (
                                                <tr key={index} style={ { backgroundColor: dayName === 'Sunday' ? '#899499' : val.status === 'Holiday' ? '#899499' : val.status === 'OFF' ? '#899499' : val.status === 'Absent' ? '#D3D3D3' : val.status === 'leave' ? '#D3D3D3' : val.status === 'Late' ? '#D3D3D3' : '#fff' } }>
                                                    <td> {val.emp_id} </td>
                                                    <td> {val.name} </td>
                                                    <td> {val.emp_date.toString().substring(0, 10)} </td>
                                                    <td> {dayName} </td>
                                                    {
                                                        val.status === 'leave' && val.time_in === null && val.time_out === null && val.break_in === null && val.break_out === null
                                                        ?
                                                        <>
                                                            <td></td>
                                                            <td></td>
                                                            <td></td>
                                                            <td></td>
                                                        </>
                                                        :
                                                        <>
                                                            <td> {val.time_in === null ? <span></span> : val.time_in} </td>
                                                            <td> {val.time_out === null ? <span></span> : val.time_out} </td>
                                                            <td> {val.break_in === null ? <span></span> : val.break_in} </td>
                                                            <td> {val.break_out === null ? <span></span> : val.break_out} </td>
                                                        </>
                                                    }
                                                    <td> 
                                                        {
                                                            val.status === 'leave' && val.time_in === null && val.time_out === null && val.break_in === null && val.break_out === null
                                                        ?
                                                        <>
                                                        { val.status }
                                                        </>
                                                        :
                                                        val.status === 'leave' && (val.time_in !== null || val.time_out !== null || val.break_in !== null || val.break_out !== null)
                                                        ?
                                                        <>
                                                            Short Leave
                                                        </>
                                                        :
                                                        <>
                                                            { val.status }
                                                        </>
                                                        } 
                                                    </td>
                                                </tr>
                                            )

                                        }
                                        return content;

                                    }
                                )
                            }
                        </tbody>

                    </table>

                </div>

            </div>
        </>
    )

}