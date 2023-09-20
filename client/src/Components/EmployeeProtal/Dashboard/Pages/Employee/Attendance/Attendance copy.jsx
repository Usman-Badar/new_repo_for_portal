import React, { useEffect, useState } from 'react';

import './Attendance.css';

import axios from '../../../../../../axios';
import { useSelector } from 'react-redux';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import ReactHTMLTableToExcel from 'react-html-table-to-excel';

const Attendance = () => {

    const EmpData = useSelector( ( state ) => state.EmpAuth.EmployeeData );
    const ref = React.createRef();
    const AccessControls = useSelector( ( state ) => state.EmpAuth.EmployeeData );

    const [ SelectedEmployee, setSelectedEmployee ] = useState('');
    const [ Employees, setEmployees ] = useState([]);
    const [ DailyAttendance, setDailyAttendance ] = useState([]);
    const [ Companies, setCompanies ] = useState([]);
    const [ Filters, setFilters ] = useState(
        {
            dateFrom: '', dateTo: '', company: null
        }
    );
    
    useEffect(
        () => {

            axios.get('/getcompaniescodes').then( response => {

                setCompanies( response.data );

            } ).catch( err => {

                toast.dark( err , {
                    position: 'top-right',
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });

            } );

        }, []
    )

    useEffect(
        () => {

            let names = [];
            for ( let x = 0; x < DailyAttendance.length; x++ )
            {
                if ( !names.includes( DailyAttendance[x].name ) )
                {
                    names.push( DailyAttendance[x].name );
                }
            }

            setEmployees( names );

        // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [ DailyAttendance.length ]
    )

    const OnFilter = ( e ) => {

        const Data = new FormData();
        const { name, value } = e.target;

        const val = {
            ...Filters,
            [name]: value
        }

        setFilters( val );

        if ( name === 'dateFrom' && value !== '' && Filters.dateTo !== '' )
        {
            if ( Filters.dateTo > value )
            {

                Data.append('DateFrom', value);
                Data.append('DateTo', Filters.dateTo);
                Data.append('CompanyCode', Filters.company === null ? EmpData.company_code : Filters.company)
                axios.post('/allemployeesattcompanywiseaccordingtodate', Data).then( res => {

                    setDailyAttendance( res.data );

                } ).catch( err => {

                    toast.dark( err , {
                    position: 'top-right',
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });;

                } );

            }else
            {
                toast.dark('Date From should be less than Date To', {
                    position: 'top-right',
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
        }

        if ( name === 'dateTo' && value !== '' && Filters.dateFrom !== '' )
        {
            if ( Filters.dateFrom < value )
            {
                Data.append('DateFrom', Filters.dateFrom);
                Data.append('DateTo', value);
                Data.append('CompanyCode', Filters.company === null ? EmpData.company_code : Filters.company)
                axios.post('/allemployeesattcompanywiseaccordingtodate', Data).then( res => {
                    
                    setDailyAttendance( res.data );

                } ).catch( err => {

                    toast.dark( err , {
                    position: 'top-right',
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });;

                } );
            }else
            {
                toast.dark('Date To should be greater than Date From', {
                    position: 'top-right',
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
        }

        if ( name === 'company' && Filters.dateFrom !== '' && Filters.dateTo !== '' )
        {
            if ( Filters.dateTo > Filters.dateFrom )
            {

                Data.append('DateFrom', Filters.dateFrom);
                Data.append('DateTo', Filters.dateTo);
                Data.append('CompanyCode', value)
                axios.post('/allemployeesattcompanywiseaccordingtodate', Data).then( res => {

                    setDailyAttendance( res.data );

                } ).catch( err => {

                    toast.dark( err , {
                    position: 'top-right',
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });;

                } );

            }else
            {
                toast.dark('Date From should be less than Date To', {
                    position: 'top-right',
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
        }

    }

    return (
        <>
            <ToastContainer />
            <div className="View_Employee_Attendance">
                <div className="DivFirst">
                    <div className="Filters">

                        <h3 className="mb-4">Filters</h3>
                        {
                            AccessControls.access ? JSON.parse(AccessControls.access).includes(502) || JSON.parse(AccessControls.access).includes(1)
                                ?
                                <>
                                    <label className="mb-0">Company</label>
                                    <select
                                        className="form-control bg-light"
                                        variant="standard"
                                        style={{ width: '100%', fontSize: '12px', fontFamily: 'Quicksand' }}
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
                                </>
                                :
                                null
                                :
                                null
                        }
                        <label className="mb-0">Date From</label>
                        <input className="form-control form-control-sm bg-light" name="dateFrom" onChange={ OnFilter } type="date" variant="standard" style={ { marginBottom: '10px' } } fullWidth />
                        <label className="mb-0">Date To</label>
                        <input className="form-control form-control-sm bg-light" name="dateTo" onChange={ OnFilter } type="date" variant="standard" style={ { marginBottom: '10px' } } fullWidth />
                        {
                            Employees.length > 0
                            ?
                            <>
                                <label className="mb-0">Employees</label>
                                <select
                                    className="form-control bg-light"
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
                            </>
                            :
                            null
                        }
                    </div>
                </div>
                <div>
                    <div className="Attendance">
                        <h5 className="mb-4 font-weight-bolder">Daily Attendance</h5>
                        <div className="attendance-content">
                            {
                                DailyAttendance.length === 0
                                    ?
                                    <h5 className="text-center font-weight-bolder">No Record Found</h5>
                                    :
                                    <table className="table" id="table-to-xls" ref={ ref }>
                                        <thead>
                                            <tr>
                                                <th className="d-none">IDs</th>
                                                <th>Name</th>
                                                <th>Date</th>
                                                <th className="d-none">Day</th>
                                                <th>Time In</th>
                                                <th>Time Out</th>
                                                <th>Break In</th>
                                                <th>Break Out</th>
                                                <th className="d-none">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
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
                                                                        <td className="d-none"> {val.emp_id} </td>
                                                                        <td> {val.name} </td>
                                                                        <td> {val.emp_date.toString().substring(0, 10)} </td>
                                                                        <td className="d-none"> {dayName} </td>
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
                                                                        <td className="d-none"> 
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
                                                                    <td className="d-none"> {val.emp_id} </td>
                                                                    <td> {val.name} </td>
                                                                    <td> {val.emp_date.toString().substring(0, 10)} </td>
                                                                    <td className="d-none"> {dayName} </td>
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
                                                                    <td className="d-none"> 
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
                            }
                        </div>
                        <div className="text-right">
                            <ReactHTMLTableToExcel
                                id="test-table-xls-button"
                                className="download-table-xls-button btn btn-success ml-2"
                                table="table-to-xls"
                                filename={EmpData.company_name + '_Employees_Attendance_From_' + Filters.dateFrom + '_To_' + Filters.dateTo}
                                sheet={ [ "Employees", "Employees", "Employees", "Employees" ] }
                                buttonText="Export in excel"
                            />
                        </div>
                    </div>
                </div>
            </div>

        </>
    )

}

export default Attendance;